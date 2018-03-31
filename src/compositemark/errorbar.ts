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


export const ERRORBAR: 'errorbar' = 'errorbar';
export type ErrorBar = typeof ERRORBAR;

export type ErrorBarExtent = 'ci' | 'stderr' | 'stdev';
export type ErrorBarCenterMarkType = 'point' | 'circle' | 'bar' | 'line';

export type ErrorBarPart = 'mean' | 'whisker';

const ERRORBAR_PART_INDEX: Flag<ErrorBarPart> = {
  mean: 1,
  whisker: 1
};

export const ERRORBAR_PARTS = keys(ERRORBAR_PART_INDEX);

// TODO: Currently can't use `PartsMixins<ErrorBarPart>`
// as the schema generator will fail
export type ErrorBarPartsMixins = {
  [part in ErrorBarPart]?: MarkConfig
};

export interface ErrorBarConfig extends ErrorBarPartsMixins {
  /** Size of the center point of an error bar */
  size?: number;

  /**
   * The extent of the whiskers. Available options include:
   * - `"stdev": Standard deviation.
   * - `"stderr": Standard error.
   * _ `"ci": Confidence interval.
   *
   * __Default value:__ `"stdev"`.
   */
  extent?: ErrorBarExtent;

  /**
   * The shape of the mean point. Available options include:
   * - `"none": no center point
   * - `"point": point.
   * - `"circle": circle.
   * - `"square": square. // will implement it later.
   * - `"bar": bar.
   * - `"line": line.
   *
   * __Default value:__ `"none"`.
   */
  centerMarkType?: 'none' | ErrorBarCenterMarkType;
}
export interface ErrorBarDef extends GenericMarkDef<ErrorBar>, ErrorBarConfig {
  /**
   * Orientation of the error bar.  This is normally automatically determined, but can be specified when the orientation is ambiguous and cannot be automatically determined.
   */
  orient?: Orient;
}

export interface ErrorBarConfigMixins {
  /**
   * ErrorBar Config
   */
  errorbar?: ErrorBarConfig;
}


const supportedChannels: Channel[] = ['x', 'y', 'color', 'detail', 'opacity', 'size'];
export function filterUnsupportedChannels(spec: GenericUnitSpec<Encoding<string>, ErrorBar | ErrorBarDef>): GenericUnitSpec<Encoding<string>, ErrorBar | ErrorBarDef> {
  return {
    ...spec,
    encoding: reduce(spec.encoding, (newEncoding, fieldDef, channel) => {
      if (supportedChannels.indexOf(channel) > -1) {
        newEncoding[channel] = fieldDef;
      } else {
        log.warn(log.message.incompatibleChannel(channel, ERRORBAR));
      }
      return newEncoding;
    }, {}),
  };
}

function isOrient(orient: Orient | 'both'): orient is Orient {
  return orient !== 'both';
}

function hasCenterMark(centerMarkType: ErrorBarCenterMarkType | 'none'): centerMarkType is ErrorBarCenterMarkType {
  return centerMarkType !== 'none';
}

export function normalizeErrorBar(spec: GenericUnitSpec<Encoding<string>, ErrorBar | ErrorBarDef>, config: Config): NormalizedLayerSpec {
  spec = filterUnsupportedChannels(spec);
  // TODO: use selection
  const {mark, encoding, selection, projection: _p, ...outerSpec} = spec;
  const markDef: ErrorBarDef = isMarkDef(mark) ? mark : {type: mark};

  const extent = markDef.extent || config.errorbar.extent;
  const sizeValue = markDef.size || config.errorbar.size;
  const centerMarkType = markDef.centerMarkType || config.errorbar.centerMarkType;

  let transform: Transform[] = []; // fix typing here.
  let whiskersLayer: NormalizedUnitSpec[] = []; // fix typing here.
  let meanLayer: NormalizedUnitSpec[] = []; // fix typing here.
  const centerMarkFill = centerMarkType !== 'circle' && centerMarkType !== 'line';

  const pseudoOrient: Orient | 'both' = errorBarOrient(spec);

  if (isOrient(pseudoOrient)) {
    const orient: Orient = pseudoOrient;
    const {transform: transformTmp, continuousAxisChannelDef, continuousAxis, encodingWithoutContinuousAxis} = errorBarParams(spec, orient, extent, []);
    transform = transformTmp;

    const {color, size, ...encodingWithoutSizeColorAndContinuousAxis} = encodingWithoutContinuousAxis;

    const continuousAxisScaleAndAxis = {};
    if (continuousAxisChannelDef.scale) {
      continuousAxisScaleAndAxis['scale'] = continuousAxisChannelDef.scale;
    }
    if (continuousAxisChannelDef.axis) {
      continuousAxisScaleAndAxis['axis'] = continuousAxisChannelDef.axis;
    }

    whiskersLayer = [{ // whisker
      mark: {
        type: 'rule',
        ...getMarkDefMixins<ErrorBarPartsMixins>(markDef, 'whisker', config.errorbar)
      },
      encoding: {
        [continuousAxis]: {
          field: 'lower_whisker_' + continuousAxisChannelDef.field,
          type: continuousAxisChannelDef.type,
          ...continuousAxisScaleAndAxis
        },
        [continuousAxis + '2']: {
          field: 'upper_whisker_' + continuousAxisChannelDef.field,
          type: continuousAxisChannelDef.type
        },
        ...encodingWithoutSizeColorAndContinuousAxis
      }
    }];

    if (hasCenterMark(centerMarkType)) {
      meanLayer = [{ // mean point
        mark: {
          type: centerMarkType,
          filled: centerMarkFill,
          opacity: 1,
          ...(sizeValue ? {size: sizeValue} : {}),
          ...getMarkDefMixins<ErrorBarPartsMixins>(markDef, 'mean', config.errorbar)
        },
        encoding: {
          [continuousAxis]: {
            field: 'mean_point_' + continuousAxisChannelDef.field,
            type: continuousAxisChannelDef.type
          },
          ...encodingWithoutContinuousAxis,
          // ...(size ? {size} : {})
        }
      }];
    }
  } else {
    const {transform: yTransform, continuousAxisChannelDef: yChannelDef, encodingWithoutContinuousAxis: encodingWithoutY, aggregate, transformWithoutAggregate: yTransformWithoutAggregate} = errorBarParams(spec, 'vertical', extent, []);
    const {transform: xTransform, continuousAxisChannelDef: xChannelDef, encodingWithoutContinuousAxis: encodingWithoutX} = errorBarParams(spec, 'horizontal', extent, aggregate);

    transform = xTransform.concat(yTransformWithoutAggregate);

    const {x, ...encodingWithoutAxes} = encodingWithoutY;
    const {color, size, ...encodingWithoutSizeColorAndAxes} = encodingWithoutAxes;

    const xScaleAndAxis = {};
    if (xChannelDef.scale) {
      xScaleAndAxis['scale'] = xChannelDef.scale;
    }
    if (xChannelDef.axis) {
      xScaleAndAxis['axis'] = xChannelDef.axis;
    }

    const yScaleAndAxis = {};
    if (yChannelDef.scale) {
      yScaleAndAxis['scale'] = yChannelDef.scale;
    }
    if (yChannelDef.axis) {
      yScaleAndAxis['axis'] = yChannelDef.axis;
    }

    whiskersLayer = [
      { // horizontal whisker
        mark: {
          type: 'rule',
          ...getMarkDefMixins<ErrorBarPartsMixins>(markDef, 'whisker', config.errorbar)
        },
        encoding: {
          x: {
            field: 'lower_whisker_' + xChannelDef.field,
            type: xChannelDef.type,
            ...xScaleAndAxis
          },
          x2: {
            field: 'upper_whisker_' + xChannelDef.field,
            type: xChannelDef.type
          },
          y: {
            field: 'mean_point_' + yChannelDef.field,
            type: yChannelDef.type,
            // ...yScaleAndAxis
          },
          ...encodingWithoutSizeColorAndAxes
        }
      }, { // vertical whisker
        mark: {
          type: 'rule',
          ...getMarkDefMixins<ErrorBarPartsMixins>(markDef, 'whisker', config.errorbar)
        },
        encoding: {
          y: {
            field: 'lower_whisker_' + yChannelDef.field,
            type: yChannelDef.type,
            ...yScaleAndAxis
          },
          y2: {
            field: 'upper_whisker_' + yChannelDef.field,
            type: yChannelDef.type
          },
          x: {
            field: 'mean_point_' + xChannelDef.field,
            type: xChannelDef.type,
            // ...xScaleAndAxis
          },
          ...encodingWithoutSizeColorAndAxes
        }
      }
    ];

    if (hasCenterMark(centerMarkType)) {
      meanLayer = [{ // mean point
        mark: {
          type: centerMarkType,
          filled: centerMarkFill,
          opacity: 1,
          ...(sizeValue ? {size: sizeValue} : {}),
          ...getMarkDefMixins<ErrorBarPartsMixins>(markDef, 'mean', config.errorbar)
        },
        encoding: {
          x: {
            field: 'mean_point_' + xChannelDef.field,
            type: xChannelDef.type,
            // ...xScaleAndAxis
          },
          y: {
            field: 'mean_point_' + yChannelDef.field,
            type: yChannelDef.type,
            // ...yScaleAndAxis
          },
          ...encodingWithoutAxes,
          // ...(size ? {size} : {})
        }
      }];
    }
  }

  let layer: NormalizedUnitSpec[] = []; // fix typing here.
  if (centerMarkType === 'line' || centerMarkType === 'bar') {
    layer = meanLayer.concat(whiskersLayer);
  } else {
    layer = whiskersLayer.concat(meanLayer);
  }

  return {
    ...outerSpec,
    transform,
    layer
  };
}

function errorBarOrient(spec: GenericUnitSpec<Encoding<Field>, ErrorBar | ErrorBarDef>): Orient | 'both' {
  const {mark: mark, encoding: encoding, projection: _p, ..._outerSpec} = spec;

  if (isFieldDef(encoding.x) && isContinuous(encoding.x)) {
    // x is continuous
    if (isFieldDef(encoding.y) && isContinuous(encoding.y)) {
      // both x and y are continuous
      if (encoding.x.aggregate === undefined && encoding.y.aggregate === ERRORBAR) {
        return 'vertical';
      } else if (encoding.y.aggregate === undefined && encoding.x.aggregate === ERRORBAR) {
        return 'horizontal';
      } else if (encoding.x.aggregate === ERRORBAR && encoding.y.aggregate === ERRORBAR) {
        return 'both';
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
    throw new Error('Need a valid continuous axis for errorbars');
  }
}


function errorBarContinousAxis(spec: GenericUnitSpec<Encoding<string>, ErrorBar | ErrorBarDef>, orient: Orient) {
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
    if (aggregate !== ERRORBAR) {
      log.warn(`Continuous axis should not have customized aggregation function ${aggregate}`);
    }
    continuousAxisChannelDef = continuousAxisWithoutAggregate;
  }

  return {
    continuousAxisChannelDef,
    continuousAxis
  };
}

function isCi(extent: ErrorBarExtent): extent is 'ci' {
  return extent === 'ci';
}

function errorBarParams(spec: GenericUnitSpec<Encoding<string>, ErrorBar | ErrorBarDef>, orient: Orient, extent: ErrorBarExtent, aggregate: AggregatedFieldDef[]) {

  const {continuousAxisChannelDef, continuousAxis} = errorBarContinousAxis(spec, orient);
  const encoding = spec.encoding;

  aggregate.push({
    op: 'mean',
    field: continuousAxisChannelDef.field,
    as: 'mean_point_' + continuousAxisChannelDef.field
  });

  let postAggregateCalculates: CalculateTransform[] = [];

  if (isCi(extent)) {
    aggregate.push({
      op: 'ci0',
      field: continuousAxisChannelDef.field,
      as: 'lower_whisker_' + continuousAxisChannelDef.field
    });
    aggregate.push({
      op: 'ci1',
      field: continuousAxisChannelDef.field,
      as:  'upper_whisker_' + continuousAxisChannelDef.field
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
        as: 'upper_whisker_' + continuousAxisChannelDef.field
      },
      {
        calculate: `datum.mean_point_${continuousAxisChannelDef.field} - datum.extent_${continuousAxisChannelDef.field}`,
        as: 'lower_whisker_' + continuousAxisChannelDef.field
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
