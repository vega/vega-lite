import {isNumber} from 'vega-util';
import {isAggregateOp} from '../aggregate';
import {Channel} from '../channel';
import {Config} from '../config';
import {reduce} from '../encoding';
import {GenericMarkDef, isMarkDef, MarkConfig} from '../mark';
import {AggregatedFieldDef, BinTransform, CalculateTransform, TimeUnitTransform, Transform} from '../transform';
import {Flag, keys} from '../util';
import {Encoding, forEach} from './../encoding';
import {Field, FieldDef, isContinuous, isFieldDef, PositionFieldDef, RepeatRef, vgField} from './../fielddef';
import * as log from './../log';
import {GenericLayerSpec, GenericUnitSpec, NormalizedLayerSpec, NormalizedUnitSpec} from './../spec';
import {Orient} from './../vega.schema';
import {getMarkDefMixins} from './common';


export const ERRORAREA: 'errorarea' = 'errorarea';
export type ErrorArea = typeof ERRORAREA;

export type ErrorAreaExtent = 'ci' | 'stderr' | 'stdev';
export type ErrorAreaCenterMarkType = 'point' | 'circle' | 'area' | 'line';

export type ErrorAreaPart = 'mean' | 'area';

const ERRORAREA_PART_INDEX: Flag<ErrorAreaPart> = {
  mean: 1,
  area: 1
};

export const ERRORAREA_PARTS = keys(ERRORAREA_PART_INDEX);

// TODO: Currently can't use `PartsMixins<ErrorAreaPart>`
// as the schema generator will fail
export type ErrorAreaPartsMixins = {
  [part in ErrorAreaPart]?: MarkConfig
};

export interface ErrorAreaConfig extends ErrorAreaPartsMixins {
  /** Size of the center point of an error area */
  size?: number;

  /**
   * The extent of the area. Available options include:
   * - `"stdev": Standard deviation.
   * - `"stderr": Standard error.
   * _ `"ci": Confidence interval.
   *
   * __Default value:__ `"stdev"`.
   */
  extent?: ErrorAreaExtent;

  /**
   * The opacity of the area.
   */
  areaOpacity?: number;
}
export interface ErrorAreaDef extends GenericMarkDef<ErrorArea>, ErrorAreaConfig {
  /**
   * Orientation of the error area.  This is normally automatically determined, but can be specified when the orientation is ambiguous and cannot be automatically determined.
   */
  orient?: Orient;
}

export interface ErrorAreaConfigMixins {
  /**
   * ErrorArea Config
   */
  errorarea?: ErrorAreaConfig;
}


const supportedChannels: Channel[] = ['x', 'y', 'color', 'detail', 'opacity', 'size'];
export function filterUnsupportedChannels(spec: GenericUnitSpec<Encoding<string>, ErrorArea | ErrorAreaDef>): GenericUnitSpec<Encoding<string>, ErrorArea | ErrorAreaDef> {
  return {
    ...spec,
    encoding: reduce(spec.encoding, (newEncoding, fieldDef, channel) => {
      if (supportedChannels.indexOf(channel) > -1) {
        newEncoding[channel] = fieldDef;
      } else {
        log.warn(log.message.incompatibleChannel(channel, ERRORAREA));
      }
      return newEncoding;
    }, {}),
  };
}

export function normalizeErrorArea(spec: GenericUnitSpec<Encoding<string>, ErrorArea | ErrorAreaDef>, config: Config): NormalizedLayerSpec {
  spec = filterUnsupportedChannels(spec);
  // TODO: use selection
  const {mark, encoding, selection, projection: _p, ...outerSpec} = spec;
  const markDef: ErrorAreaDef = isMarkDef(mark) ? mark : {type: mark};

  const extent = markDef.extent || config.errorarea.extent;
  const opacityValue = markDef.areaOpacity || config.errorarea.areaOpacity;
  const sizeValue = markDef.size || config.errorarea.size;

  const areasLayer: NormalizedUnitSpec[] = [];
  const meanLayer: NormalizedUnitSpec[] = [];

  const orient: Orient = errorAreaOrient(spec);

  const {transform, continuousAxisChannelDef, continuousAxis, encodingWithoutContinuousAxis} = errorAreaParams(spec, orient, extent);

  const {color, size, ...encodingWithoutSizeColorAndContinuousAxis} = encodingWithoutContinuousAxis;

  const continuousAxisScaleAndAxis = {};
  if (continuousAxisChannelDef.scale) {
    continuousAxisScaleAndAxis['scale'] = continuousAxisChannelDef.scale;
  }
  if (continuousAxisChannelDef.axis) {
    continuousAxisScaleAndAxis['axis'] = continuousAxisChannelDef.axis;
  }

  const layer: NormalizedUnitSpec[] = [
    { // area
      mark: {
        type: 'area',
        opacity: opacityValue,
        ...getMarkDefMixins<ErrorAreaPartsMixins>(markDef, 'area', config.errorarea)
      },
      encoding: {
        [continuousAxis]: {
          field: 'lower_area_' + continuousAxisChannelDef.field,
          type: continuousAxisChannelDef.type,
          ...continuousAxisScaleAndAxis
        },
        [continuousAxis + '2']: {
          field: 'upper_area_' + continuousAxisChannelDef.field,
          type: continuousAxisChannelDef.type
        },
        ...encodingWithoutSizeColorAndContinuousAxis
      }
    },
    { // mean point
      mark: {
        type: 'line',
        ...getMarkDefMixins<ErrorAreaPartsMixins>(markDef, 'mean', config.errorarea)
      },
      encoding: {
        [continuousAxis]: {
          field: 'mean_point_' + continuousAxisChannelDef.field,
          type: continuousAxisChannelDef.type
        },
        ...encodingWithoutContinuousAxis,
        // ...(size ? {size} : {})
      }
    }
  ];

  return {
    ...outerSpec,
    transform,
    layer
  };
}

function errorAreaOrient(spec: GenericUnitSpec<Encoding<Field>, ErrorArea | ErrorAreaDef>): Orient {
  const {mark: mark, encoding: encoding, projection: _p, ..._outerSpec} = spec;

  if (isFieldDef(encoding.x) && isContinuous(encoding.x)) {
    // x is continuous
    if (isFieldDef(encoding.y) && isContinuous(encoding.y)) {
      // both x and y are continuous
      if (encoding.x.aggregate === undefined && encoding.y.aggregate === ERRORAREA) {
        return 'vertical';
      } else if (encoding.y.aggregate === undefined && encoding.x.aggregate === ERRORAREA) {
        return 'horizontal';
      } else if (encoding.x.aggregate === ERRORAREA && encoding.y.aggregate === ERRORAREA) {
        throw new Error('Both x and y cannot have aggregate');
      } else {
        if (isMarkDef(mark) && mark.orient) {
          return mark.orient;
        }

        // default orientation = vertical
        return 'vertical';
      }
    }

    // x is continuous but y is not
    return 'horizontal';
  } else if (isFieldDef(encoding.y) && isContinuous(encoding.y)) {
    // y is continuous but x is not
    return 'vertical';
  } else {
    // Neither x nor y is continuous.
    throw new Error('Need a valid continuous axis for errorareas');
  }
}


function errorAreaContinousAxis(spec: GenericUnitSpec<Encoding<string>, ErrorArea | ErrorAreaDef>, orient: Orient) {
  const {mark: mark, encoding: encoding, projection: _p, ..._outerSpec} = spec;

  let continuousAxisChannelDef: PositionFieldDef<string>;
  let continuousAxis: 'x' | 'y';

  if (orient === 'vertical') {
    continuousAxis = 'y';
    continuousAxisChannelDef = encoding.y as FieldDef<string>; // Safe to cast because if y is not continuous fielddef, the orient would not be vertical.
  } else {
    continuousAxis = 'x';
    continuousAxisChannelDef = encoding.x as FieldDef<string>; // Safe to cast because if x is not continuous fielddef, the orient would not be horizontal.
  }

  if (continuousAxisChannelDef && continuousAxisChannelDef.aggregate) {
    const {aggregate, ...continuousAxisWithoutAggregate} = continuousAxisChannelDef;
    if (aggregate !== ERRORAREA) {
      log.warn(`Continuous axis should not have customized aggregation function ${aggregate}`);
    }
    continuousAxisChannelDef = continuousAxisWithoutAggregate;
  }

  return {
    continuousAxisChannelDef,
    continuousAxis
  };
}

function isCi(extent: ErrorAreaExtent): extent is 'ci' {
  return extent === 'ci';
}

function errorAreaParams(spec: GenericUnitSpec<Encoding<string>, ErrorArea | ErrorAreaDef>, orient: Orient, extent: ErrorAreaExtent) {

  const {continuousAxisChannelDef, continuousAxis} = errorAreaContinousAxis(spec, orient);
  const encoding = spec.encoding;

  const aggregate: AggregatedFieldDef[] =[{
    op: 'mean',
    field: continuousAxisChannelDef.field,
    as: 'mean_point_' + continuousAxisChannelDef.field
  }];

  let postAggregateCalculates: CalculateTransform[] = [];

  if (isCi(extent)) {
    aggregate.push({
      op: 'ci0',
      field: continuousAxisChannelDef.field,
      as: 'lower_area_' + continuousAxisChannelDef.field
    });
    aggregate.push({
      op: 'ci1',
      field: continuousAxisChannelDef.field,
      as:  'upper_area_' + continuousAxisChannelDef.field
    });
  } else {
    aggregate.push({
      op: extent,
      field: continuousAxisChannelDef.field,
      as: 'extent_' + continuousAxisChannelDef.field
    });

    postAggregateCalculates = [
      {
        calculate: `datum.mean_point_${continuousAxisChannelDef.field} + datum.extent_${continuousAxisChannelDef.field}`,
        as: 'upper_area_' + continuousAxisChannelDef.field
      },
      {
        calculate: `datum.mean_point_${continuousAxisChannelDef.field} - datum.extent_${continuousAxisChannelDef.field}`,
        as: 'lower_area_' + continuousAxisChannelDef.field
      }
    ];
  }

  const groupby: string[] = [];
  const bins: BinTransform[] = [];
  const timeUnits: TimeUnitTransform[] = [];

  const encodingWithoutContinuousAxis: Encoding<string> = {};
  forEach(encoding, (channelDef, channel) => {
    if (channel === continuousAxis) {
      // Skip continuous axis as we already handle it separately
      return;
    }
    if (isFieldDef(channelDef)) {
      if (channelDef.aggregate && isAggregateOp(channelDef.aggregate)) {
        aggregate.push({
          op: channelDef.aggregate,
          field: channelDef.field,
          as: vgField(channelDef)
        });
      } else if (channelDef.aggregate === undefined) {
        const transformedField = vgField(channelDef);

        // Add bin or timeUnit transform if applicable
        const bin = channelDef.bin;
        if (bin) {
          const {field} = channelDef;
          bins.push({bin, field, as: transformedField});
        } else if (channelDef.timeUnit) {
          const {timeUnit, field} = channelDef;
          timeUnits.push({timeUnit, field, as: transformedField});
        }

        groupby.push(transformedField);
      }
      // now the field should refer to post-transformed field instead
      encodingWithoutContinuousAxis[channel] = {
        field: vgField(channelDef),
        type: channelDef.type
      };
    } else {
      // For value def, just copy
      encodingWithoutContinuousAxis[channel] = encoding[channel];
    }
  });

  return {
    transform: [].concat(
      bins,
      timeUnits,
      [{aggregate, groupby}],
      postAggregateCalculates
    ),
    continuousAxisChannelDef,
    continuousAxis,
    encodingWithoutContinuousAxis,
    aggregate,
    transformWithoutAggregate: [].concat(
      bins,
      timeUnits,
      postAggregateCalculates
    )
  };
}
