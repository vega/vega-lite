import {isNumber} from 'vega-util';
import {Channel} from '../channel';
import {Config} from '../config';
import {reduce} from '../encoding';
import {AggregatedFieldDef, BinTransform, CalculateTransform, TimeUnitTransform} from '../transform';
import {Encoding, forEach} from './../encoding';
import {Field, FieldDef, isContinuous, isFieldDef, PositionFieldDef, vgField} from './../fielddef';
import * as log from './../log';
import {MarkConfig} from './../mark';
import {GenericUnitSpec, NormalizedLayerSpec} from './../spec';
import {Orient} from './../vega.schema';
import {getMarkSpecificConfigMixins} from './common';


export const BOXPLOT: 'box-plot' = 'box-plot';
export type BOXPLOT = typeof BOXPLOT;
export type BoxPlotStyle = 'boxWhisker' | 'box' | 'boxMid';


export interface BoxPlotDef {
  /**
   * Type of the mark.  For box plots, this should always be `"box-plot"`.
   * [boxplot](https://vega.github.io/vega-lite/docs/compositemark.html#boxplot)
   */
  type: BOXPLOT;

  /**
   * Orientation of the box plot.  This is normally automatically determined, but can be specified when the orientation is ambiguous and cannot be automatically determined.
   */
  orient?: Orient;

  /**
   * Extent is used to determine where the whiskers extend to. The options are
   * - `"min-max": min and max are the lower and upper whiskers respectively.
   * -  A scalar (integer or floating point number) that will be multiplied by the IQR and the product will be added to the third quartile to get the upper whisker and subtracted from the first quartile to get the lower whisker.
   * __Default value:__ `"1.5"`.
   */
  extent?: 'min-max' | number;
}

export function isBoxPlotDef(mark: BOXPLOT | BoxPlotDef): mark is BoxPlotDef {
  return !!mark['type'];
}

export const BOXPLOT_STYLES: BoxPlotStyle[] = ['boxWhisker', 'box', 'boxMid'];

export interface BoxPlotConfig extends MarkConfig {
  /** Size of the box and mid tick of a box plot */
  size?: number;
  /** The default extent, which is used to determine where the whiskers extend to. The options are
   * - `"min-max": min and max are the lower and upper whiskers respectively.
   * - `"number": A scalar (integer or floating point number) that will be multiplied by the IQR and the product will be added to the third quartile to get the upper whisker and subtracted from the first quartile to get the lower whisker.
   */
  extent?: 'min-max' | number;
}

export interface BoxPlotConfigMixins {
  /**
   * Box Config
   * @hide
   */
  box?: BoxPlotConfig;

  /**
   * @hide
   */
  boxWhisker?: MarkConfig;

  /**
   * @hide
   */
  boxMid?: MarkConfig;
}

export const VL_ONLY_BOXPLOT_CONFIG_PROPERTY_INDEX: {
  [k in keyof BoxPlotConfigMixins]?: (keyof BoxPlotConfigMixins[k])[]
} = {
  box: ['size', 'color', 'extent'],
  boxWhisker: ['color'],
  boxMid: ['color']
};

const supportedChannels: Channel[] = ['x', 'y', 'color', 'detail', 'opacity', 'size'];
export function filterUnsupportedChannels(spec: GenericUnitSpec<Encoding<string>, BOXPLOT | BoxPlotDef>): GenericUnitSpec<Encoding<string>, BOXPLOT | BoxPlotDef> {
  return {
    ...spec,
    encoding: reduce(spec.encoding, (newEncoding, fieldDef, channel) => {
      if (supportedChannels.indexOf(channel) > -1) {
        newEncoding[channel] = fieldDef;
      } else {
        log.warn(log.message.incompatibleChannel(channel, BOXPLOT));
      }
      return newEncoding;
    }, {}),
  };
}

export function normalizeBoxPlot(spec: GenericUnitSpec<Encoding<string>, BOXPLOT | BoxPlotDef>, config: Config): NormalizedLayerSpec {
  spec = filterUnsupportedChannels(spec);
  // TODO: use selection
  const {mark, encoding, selection, projection: _p, ...outerSpec} = spec;

  let kIQRScalar: number = undefined;
  if (isNumber(config.box.extent)) {
    kIQRScalar = config.box.extent;
  }

  if (isBoxPlotDef(mark)) {
    if (mark.extent) {
      if(mark.extent === 'min-max') {
        kIQRScalar = undefined;
      }
    }
  }

  const orient: Orient = boxOrient(spec);
  const {transform, continuousAxisChannelDef, continuousAxis, encodingWithoutContinuousAxis} = boxParams(spec, orient, kIQRScalar);

  const {color, size, ...encodingWithoutSizeColorAndContinuousAxis} = encodingWithoutContinuousAxis;

  // Size encoding or the default config.box.size is applied to box and boxMid
  const sizeMixins = size ? {size} : getMarkSpecificConfigMixins(config.box, 'size');

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
          style: 'boxWhisker'
        },
        encoding: {
          [continuousAxis]: {
            field: 'lower_whisker_' + continuousAxisChannelDef.field,
            type: continuousAxisChannelDef.type,
            ...continuousAxisScaleAndAxis
          },
          [continuousAxis + '2']: {
            field: 'lower_box_' + continuousAxisChannelDef.field,
            type: continuousAxisChannelDef.type
          },
          ...encodingWithoutSizeColorAndContinuousAxis,
          ...getMarkSpecificConfigMixins(config.boxWhisker, 'color')
        }
      }, { // upper whisker
        mark: {
          type: 'rule',
          style: 'boxWhisker'
        },
        encoding: {
          [continuousAxis]: {
            field: 'upper_box_' + continuousAxisChannelDef.field,
            type: continuousAxisChannelDef.type
          },
          [continuousAxis + '2']: {
            field: 'upper_whisker_' + continuousAxisChannelDef.field,
            type: continuousAxisChannelDef.type
          },
          ...encodingWithoutSizeColorAndContinuousAxis,
          ...getMarkSpecificConfigMixins(config.boxWhisker, 'color')
        }
      }, { // box (q1 to q3)
        ...(selection ? {selection} : {}),
        mark: {
          type: 'bar',
          style: 'box'
        },
        encoding: {
          [continuousAxis]: {
            field: 'lower_box_' + continuousAxisChannelDef.field,
            type: continuousAxisChannelDef.type
          },
          [continuousAxis + '2']: {
            field: 'upper_box_' + continuousAxisChannelDef.field,
            type: continuousAxisChannelDef.type
          },
          ...encodingWithoutContinuousAxis,
          ...(encodingWithoutContinuousAxis.color ? {} : getMarkSpecificConfigMixins(config.box, 'color')),
          ...sizeMixins,
        }
      }, { // mid tick
        mark: {
          type: 'tick',
          style: 'boxMid'
        },
        encoding: {
          [continuousAxis]: {
            field: 'mid_box_' + continuousAxisChannelDef.field,
            type: continuousAxisChannelDef.type
          },
          ...encodingWithoutSizeColorAndContinuousAxis,
          ...getMarkSpecificConfigMixins(config.boxMid, 'color'),
          ...sizeMixins,
        }
      }
    ]
  };
}

function boxOrient(spec: GenericUnitSpec<Encoding<Field>, BOXPLOT | BoxPlotDef>): Orient {
  const {mark: mark, encoding: encoding, projection: _p, ..._outerSpec} = spec;

  if (isFieldDef(encoding.x) && isContinuous(encoding.x)) {
    // x is continuous
    if (isFieldDef(encoding.y) && isContinuous(encoding.y)) {
      // both x and y are continuous
      if (encoding.x.aggregate === undefined && encoding.y.aggregate === BOXPLOT) {
        return 'vertical';
      } else if (encoding.y.aggregate === undefined && encoding.x.aggregate === BOXPLOT) {
        return 'horizontal';
      } else if (encoding.x.aggregate === BOXPLOT && encoding.y.aggregate === BOXPLOT) {
        throw new Error('Both x and y cannot have aggregate');
      } else {
        if (isBoxPlotDef(mark) && mark.orient) {
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
    throw new Error('Need a valid continuous axis for boxplots');
  }
}


function boxContinousAxis(spec: GenericUnitSpec<Encoding<string>, BOXPLOT | BoxPlotDef>, orient: Orient) {
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
    if (aggregate !== BOXPLOT) {
      log.warn(`Continuous axis should not have customized aggregation function ${aggregate}`);
    }
    continuousAxisChannelDef = continuousAxisWithoutAggregate;
  }

  return {
    continuousAxisChannelDef,
    continuousAxis
  };
}

function boxParams(spec: GenericUnitSpec<Encoding<string>, BOXPLOT | BoxPlotDef>, orient: Orient, kIQRScalar: 'min-max' | number) {

  const {continuousAxisChannelDef, continuousAxis} = boxContinousAxis(spec, orient);
  const encoding = spec.encoding;

  const isMinMax = kIQRScalar === undefined;
  const aggregate: AggregatedFieldDef[] = [
    {
      op: 'q1',
      field: continuousAxisChannelDef.field,
      as: 'lower_box_' + continuousAxisChannelDef.field
    },
    {
      op: 'q3',
      field: continuousAxisChannelDef.field,
      as: 'upper_box_' + continuousAxisChannelDef.field
    },
    {
      op: 'median',
      field: continuousAxisChannelDef.field,
      as: 'mid_box_' + continuousAxisChannelDef.field
    }
  ];
  let postAggregateCalculates: CalculateTransform[] = [];

  aggregate.push({
    op: 'min',
    field: continuousAxisChannelDef.field,
    as: (isMinMax ? 'lower_whisker_' : 'min_') + continuousAxisChannelDef.field
  });
  aggregate.push({
    op: 'max',
    field: continuousAxisChannelDef.field,
    as:  (isMinMax ? 'upper_whisker_' : 'max_') + continuousAxisChannelDef.field
  });

  if (!isMinMax) {
    postAggregateCalculates = [
      {
        calculate: `datum.upper_box_${continuousAxisChannelDef.field} - datum.lower_box_${continuousAxisChannelDef.field}`,
        as: 'iqr_' + continuousAxisChannelDef.field
      },
      {
        calculate: `min(datum.upper_box_${continuousAxisChannelDef.field} + datum.iqr_${continuousAxisChannelDef.field} * ${kIQRScalar}, datum.max_${continuousAxisChannelDef.field})`,
        as: 'upper_whisker_' + continuousAxisChannelDef.field
      },
      {
        calculate: `max(datum.lower_box_${continuousAxisChannelDef.field} - datum.iqr_${continuousAxisChannelDef.field} * ${kIQRScalar}, datum.min_${continuousAxisChannelDef.field})`,
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
      if (channelDef.aggregate && channelDef.aggregate !== BOXPLOT) {
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
