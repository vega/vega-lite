import {isNumber} from 'vega-util';
import {Channel} from '../channel';
import {Config} from '../config';
import {reduce} from '../encoding';
import {BinTransform, CalculateTransform, Summarize, TimeUnitTransform} from '../transform';
import {Encoding, forEach} from './../encoding';
import {field, Field, FieldDef, isContinuous, isFieldDef, PositionFieldDef} from './../fielddef';
import * as log from './../log';
import {MarkConfig} from './../mark';
import {GenericUnitSpec, LayerSpec} from './../spec';
import {Orient} from './../vega.schema';


export const BOXPLOT: 'box-plot' = 'box-plot';
export type BOXPLOT = typeof BOXPLOT;
export type BoxPlotStyle = 'boxWhisker' | 'box' | 'boxMid';


export interface BoxPlotDef {
  type: BOXPLOT;
  orient?: Orient;
  extent?: 'min-max' | number;
}

export function isBoxPlotDef(mark: BOXPLOT | BoxPlotDef): mark is BoxPlotDef {
  return !!mark['type'];
}

export const BOXPLOT_STYLES: BoxPlotStyle[] = ['boxWhisker', 'box', 'boxMid'];

export interface BoxPlotConfig extends MarkConfig {
  /** Size of the box and mid tick of a box plot */
  size?: number;
}

export interface BoxPlotConfigMixins {
  /** Box Config */
  box?: BoxPlotConfig;

  boxWhisker?: MarkConfig;

  boxMid?: MarkConfig;
}

export const VL_ONLY_BOXPLOT_CONFIG_PROPERTY_INDEX: {
  [k in keyof BoxPlotConfigMixins]?: (keyof BoxPlotConfigMixins[k])[]
} = {
  box: ['size']
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

export function normalizeBoxPlot(spec: GenericUnitSpec<Encoding<string>, BOXPLOT | BoxPlotDef>, config: Config): LayerSpec {
  spec = filterUnsupportedChannels(spec);
  // TODO: use selection
  const {mark, encoding, selection, ...outerSpec} = spec;

  let kIQRScalar: number = undefined;
  if (isBoxPlotDef(mark)) {
    if (mark.extent) {
      if(isNumber(mark.extent)) {
        kIQRScalar = mark.extent;
      }
    }
  }

  const orient: Orient = boxOrient(spec);
  const {transform, continuousAxisChannelDef, continuousAxis, encodingWithoutContinuousAxis} = boxParams(spec, orient, kIQRScalar);

  const {size, color, ...nonPositionEncodingWithoutColorSize} = encodingWithoutContinuousAxis;
  const sizeMixins = size ? {size} : {size: {value: config.box.size}};

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
            field: 'lowerWhisker',
            type: continuousAxisChannelDef.type,
            ...continuousAxisScaleAndAxis
          },
          [continuousAxis + '2']: {
            field: 'lowerBox',
            type: continuousAxisChannelDef.type
          },
          ...nonPositionEncodingWithoutColorSize
        }
      }, { // upper whisker
        mark: {
          type: 'rule',
          style: 'boxWhisker'
        },
        encoding: {
          [continuousAxis]: {
            field: 'upperBox',
            type: continuousAxisChannelDef.type
          },
          [continuousAxis + '2']: {
            field: 'upperWhisker',
            type: continuousAxisChannelDef.type
          },
          ...nonPositionEncodingWithoutColorSize
        }
      }, { // box (q1 to q3)
        ...(selection ? {selection} : {}),
        mark: {
          type: 'bar',
          style: 'box'
        },
        encoding: {
          [continuousAxis]: {
            field: 'lowerBox',
            type: continuousAxisChannelDef.type
          },
          [continuousAxis + '2']: {
            field: 'upperBox',
            type: continuousAxisChannelDef.type
          },
          ...encodingWithoutContinuousAxis,
          // Need to apply size here to make sure size config get used
          ...sizeMixins
        }
      }, { // mid tick
        mark: {
          type: 'tick',
          style: 'boxMid'
        },
        encoding: {
          [continuousAxis]: {
            field: 'midBox',
            type: continuousAxisChannelDef.type
          },
          ...nonPositionEncodingWithoutColorSize,
          ...sizeMixins
        }
      }
    ]
  };
}

function boxOrient(spec: GenericUnitSpec<Encoding<Field>, BOXPLOT | BoxPlotDef>): Orient {
  const {mark: mark, encoding: encoding, ..._outerSpec} = spec;

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
  const {mark: mark, encoding: encoding, ..._outerSpec} = spec;

  let continuousAxisChannelDef: PositionFieldDef<string>;
  let continuousAxis: 'x' | 'y';

  if (orient === 'vertical') {
    continuousAxis = 'y';
    continuousAxisChannelDef = encoding.y as FieldDef<string>; // Safe to cast because if y is not continous fielddef, the orient would not be vertical.
  } else {
    continuousAxis = 'x';
    continuousAxisChannelDef = encoding.x as FieldDef<string>; // Safe to cast because if x is not continous fielddef, the orient would not be horizontal.
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
  const summarize: Summarize[] = [
    {
      aggregate: 'q1',
      field: continuousAxisChannelDef.field,
      as: 'lowerBox'
    },
    {
      aggregate: 'q3',
      field: continuousAxisChannelDef.field,
      as: 'upperBox'
    },
    {
      aggregate: 'median',
      field: continuousAxisChannelDef.field,
      as: 'midBox'
    }
  ];
  let postAggregateCalculates: CalculateTransform[] = [];

  if (isMinMax) {
    summarize.push({
      aggregate: 'min',
      field: continuousAxisChannelDef.field,
      as: 'lowerWhisker'
    });
    summarize.push({
      aggregate: 'max',
      field: continuousAxisChannelDef.field,
      as: 'upperWhisker'
    });
  } else {
    postAggregateCalculates = [
      {
        calculate: 'datum.upperBox - datum.lowerBox',
        as: 'IQR'
      },
      {
        calculate: 'datum.lowerBox - datum.IQR * ' + kIQRScalar,
        as: 'lowerWhisker'
      },
      {
        calculate: 'datum.upperBox + datum.IQR * ' + kIQRScalar,
        as: 'lowerWhisker'
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
        summarize.push({
          aggregate: channelDef.aggregate,
          field: channelDef.field,
          as: field(channelDef)
        });
      } else if (channelDef.aggregate === undefined) {
        const transformedField = field(channelDef);

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
        field: field(channelDef),
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
      [{summarize, groupby}],
      postAggregateCalculates
    ),
    continuousAxisChannelDef,
    continuousAxis,
    encodingWithoutContinuousAxis
  };
}
