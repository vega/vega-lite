import {isNumber} from 'vega-util';
import {Channel} from '../channel';
import {Config} from '../config';
import {reduce} from '../encoding';
import {AggregatedFieldDef, BinTransform, CalculateTransform, TimeUnitTransform} from '../transform';
import {Encoding, forEach} from './../encoding';
import {Field, FieldDef, isContinuous, isFieldDef, PositionFieldDef, vgField} from './../fielddef';
import * as log from './../log';
import {MarkConfig} from './../mark';
import {GenericUnitSpec, LayerSpec} from './../spec';
import {Orient} from './../vega.schema';
import {getMarkSpecificConfigMixins} from './common';


export const ERRORBAR: 'error-bar' = 'error-bar';
export type ERRORBAR = typeof ERRORBAR;
export type ErrorBarStyle = 'barWhisker' | 'barMid';

export interface ErrorBarDef {
  /**
   * Type of the mark.  For error bar, this should always be `"error-bar"`.
   * [errorbar](compositemark.html#errorbar)
   */
  type: ERRORBAR;

  /**
   * Orientation of the error bar.  This is normally automatically determined, but can be specified when the orientation is ambiguous and cannot be automatically determined.
   */
  orient?: Orient;

  /**
   * Extent is used to determine the length of the whiskers. The options are
   * - `"stdev": standard deviation.
   * - `"stderr": standard error.
   * __Default value:__ `"stdev"`.
   */
  extent?: 'stdev' | 'stderr';
  // 'ci' will be added later !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  /**
   * Center is used to determine the center of the error bar. The options are
   * _ `"mean": mean.
   * _ `"median": median.
   * __Default value:__ `"mean"`.
   */
  center?: 'mean' | 'median';
}

export function isErrorBarDef(mark: ERRORBAR | ErrorBarDef): mark is ErrorBarDef {
  return !!mark['type'];
}

export const ERRORBAR_STYLES: ErrorBarStyle[] = ['barWhisker', 'barMid'];

export interface ErrorBarConfigMixins {

  /**
   * @hide
   */
  barWhisker?: MarkConfig;

  /**
   * @hide
   */
  barMid?: MarkConfig;
}

export const VL_ONLY_ERRORBAR_CONFIG_PROPERTY_INDEX: {
  [k in keyof ErrorBarConfigMixins]?: (keyof ErrorBarConfigMixins[k])[]
} = {
  barWhisker: ['color'],
  barMid: ['color']
};

const supportedChannels: Channel[] = ['x', 'y', 'color', 'detail', 'opacity', 'size'];
// do we need 'size' ?????????????????????????????????????????????????????????????????????????????
export function filterUnsupportedChannels(spec: GenericUnitSpec<Encoding<string>, ERRORBAR | ErrorBarDef>): GenericUnitSpec<Encoding<string>, ERRORBAR | ErrorBarDef> {
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

export function normalizeErrorBar(spec: GenericUnitSpec<Encoding<string>, ERRORBAR | ErrorBarDef>, config: Config): LayerSpec {
  spec = filterUnsupportedChannels(spec);
  const {mark, encoding, selection, projection: _p, ...outerSpec} = spec;

  const extent: 'stdev' | 'stderr' = (isErrorBarDef(mark) && mark.extent) ? mark.extent : 'stdev';
  const center: 'mean' | 'median' = (isErrorBarDef(mark) && mark.center) ? mark.center : 'mean';

  const orient: Orient = barOrient(spec);
  const {transform, continuousAxisChannelDef, continuousAxis, encodingWithoutContinuousAxis} = barParams(spec, orient, extent, center);

  const {color, ...encodingWithoutColorAndContinuousAxis} = encodingWithoutContinuousAxis;

  const continuousAxisScaleAndAxis = {};
  if (continuousAxisChannelDef.scale) {
    continuousAxisScaleAndAxis['scale'] = continuousAxisChannelDef.scale;
  }
  if (continuousAxisChannelDef.axis) {
    continuousAxisScaleAndAxis['axis'] = continuousAxisChannelDef.axis;
  }

  return {
    ...outerSpec,
    transform,
    layer: [
      { // lower whisker
        mark: {
          type: 'rule',
          style: 'barWhisker'
        },
        encoding: {
          [continuousAxis]: {
            field: 'lower_whisker_' + continuousAxisChannelDef.field,
            type: continuousAxisChannelDef.type,
            ...continuousAxisScaleAndAxis
          },
          [continuousAxis + '2']: {
            field: 'mid_point_' + continuousAxisChannelDef.field,
            type: continuousAxisChannelDef.type
          },
          ...encodingWithoutColorAndContinuousAxis,
          ...getMarkSpecificConfigMixins(config.boxWhisker, 'color')
        }
      }, { // upper whisker
        mark: {
          type: 'rule',
          style: 'barWhisker'
        },
        encoding: {
          [continuousAxis]: {
            field: 'mid_point_' + continuousAxisChannelDef.field,
            type: continuousAxisChannelDef.type
          },
          [continuousAxis + '2']: {
            field: 'upper_whisker_' + continuousAxisChannelDef.field,
            type: continuousAxisChannelDef.type
          },
          ...encodingWithoutColorAndContinuousAxis,
          ...getMarkSpecificConfigMixins(config.boxWhisker, 'color')
        }
      }, { // mid point
        mark: {
          type: 'point',
          style: 'barMid'
        },
        encoding: {
          [continuousAxis]: {
            field: 'mid_point_' + continuousAxisChannelDef.field,
            type: continuousAxisChannelDef.type
          },
          ...encodingWithoutColorAndContinuousAxis,
          ...getMarkSpecificConfigMixins(config.boxMid, 'color'),
          // ...sizeMixins,
          // do we need this ????????????????????????????????????????????
        }
      }
    ]
  };
}

function barOrient(spec: GenericUnitSpec<Encoding<Field>, ERRORBAR | ErrorBarDef>): Orient {
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
        throw new Error('Both x and y cannot have aggregate');
      } else {
        if (isErrorBarDef(mark) && mark.orient) {
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
    throw new Error('Need a valid continuous axis for errorbar');
  }
}

function barContinousAxis(spec: GenericUnitSpec<Encoding<string>, ERRORBAR | ErrorBarDef>, orient: Orient) {
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

function barParams(spec: GenericUnitSpec<Encoding<string>, ERRORBAR | ErrorBarDef>, orient: Orient, extent: 'stdev' | 'stderr', center: 'mean' | 'median') {

  const {continuousAxisChannelDef, continuousAxis} = barContinousAxis(spec, orient);
  const encoding = spec.encoding;

  const aggregate: AggregatedFieldDef[] = [
    {
      op: center,
      field: continuousAxisChannelDef.field,
      as: 'mid_point_' + continuousAxisChannelDef.field
    }
  ];

  aggregate.push({
    op: extent,
    field: continuousAxisChannelDef.field,
    as: 'whisker_' + continuousAxisChannelDef.field
  });
  // do we combine aggregate extent and center?????????????????????????????????????

  const postAggregateCalculates: CalculateTransform[] = [
    {
      calculate: `datum.mid_point_${continuousAxisChannelDef.field} + datum.whisker_${continuousAxisChannelDef.field}`,
      as: 'upper_whisker_' + continuousAxisChannelDef.field
    },
    {
      calculate: `datum.mid_point_${continuousAxisChannelDef.field} - datum.whisker_${continuousAxisChannelDef.field}`,
      as: 'lower_whisker_' + continuousAxisChannelDef.field
    }
  ];

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
      if (channelDef.aggregate && channelDef.aggregate !== ERRORBAR) {
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
    encodingWithoutContinuousAxis
  };
}
