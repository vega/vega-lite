import {isNumber} from 'vega-util';
import {Channel} from '../channel';
import {Config} from '../config';
import {reduce} from '../encoding';
import {isRepeatRef} from '../fielddef';
import {CalculateTransform, Summarize, SummarizeTransform} from '../transform';
import {Encoding, forEach} from './../encoding';
import {field, Field, FieldDef, isContinuous, isDiscrete, isFieldDef, PositionFieldDef} from './../fielddef';
import * as log from './../log';
import {MarkConfig, MarkDef} from './../mark';
import {GenericUnitSpec, LayerSpec} from './../spec';
import {Orient} from './../vega.schema';


export const BOXPLOT: 'box-plot' = 'box-plot';
export type BOXPLOT = typeof BOXPLOT;
export type BoxPlotRole = 'boxWhisker' | 'box' | 'boxMid';


export interface BoxPlotDef {
  type: BOXPLOT;
  orient?: Orient;
  extent?: 'min-max' | number;
}

export function isBoxPlotDef(mark: BOXPLOT | BoxPlotDef): mark is BoxPlotDef {
  return !!mark['type'];
}

export const BOXPLOT_ROLES: BoxPlotRole[] = ['boxWhisker', 'box', 'boxMid'];

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
  const {mark, encoding, ...outerSpec} = spec;

  let kIQRScalar: number = undefined;
  if (isBoxPlotDef(mark)) {
    if (mark.extent) {
      if(isNumber(mark.extent)) {
        kIQRScalar = mark.extent;
      }
    }
  }
  const isMinMax = kIQRScalar === undefined;

  const orient: Orient = boxOrient(spec);
  const {discreteAxisChannelDef, continuousAxisChannelDef, discreteAxis, continuousAxis, is1D} = boxParams(spec, orient);

  if (continuousAxisChannelDef.aggregate !== undefined && continuousAxisChannelDef.aggregate !== BOXPLOT) {
    throw new Error(`Continuous axis should not have customized aggregation function ${continuousAxisChannelDef.aggregate}`);
  }

  const {transform, nonPositionEncoding} = boxTransform(encoding, discreteAxisChannelDef, continuousAxisChannelDef, kIQRScalar, is1D);

  const {size, color, ...nonPositionEncodingWithoutColorSize} = nonPositionEncoding;
  const sizeMixins = size ? {size} : {size: {value: config.box.size}};
  const discreteAxisEncodingMixin = discreteAxisChannelDef !== undefined ? {[discreteAxis]: discreteAxisChannelDef} : {};

  return {
    ...outerSpec,
    transform,
    layer: [
      { // lower whisker
        mark: {
          type: 'rule',
          role: 'boxWhisker'
        },
        encoding: {
          ...discreteAxisEncodingMixin,
          [continuousAxis]: {
            axis: continuousAxisChannelDef.axis,
            field: 'lowerWhisker',
            type: continuousAxisChannelDef.type
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
          role: 'boxWhisker'
        },
        encoding: {
          ...discreteAxisEncodingMixin,
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
        mark: {
          type: 'bar',
          role: 'box'
        },
        encoding: {
          ...discreteAxisEncodingMixin,
          [continuousAxis]: {
            field: 'lowerBox',
            type: continuousAxisChannelDef.type
          },
          [continuousAxis + '2']: {
            field: 'upperBox',
            type: continuousAxisChannelDef.type
          },
          ...nonPositionEncoding,
          // Need to apply size here to make sure size config get used
          ...sizeMixins
        }
      }, { // mid tick
        mark: {
          type: 'tick',
          role: 'boxMid'
        },
        encoding: {
          ...discreteAxisEncodingMixin,
          [continuousAxis]: {
            field: 'midBox',
            type: continuousAxisChannelDef.type
          },
          ...nonPositionEncoding,
          ...sizeMixins,
          color: {value : 'white'}
        }
      }
    ]
  };
}

function boxOrient(spec: GenericUnitSpec<Encoding<Field>, BOXPLOT | BoxPlotDef>): Orient {
  const {mark: mark, encoding: encoding, ...outerSpec} = spec;

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


function boxParams(spec: GenericUnitSpec<Encoding<string>, BOXPLOT | BoxPlotDef>, orient: Orient) {
  const {mark: mark, encoding: encoding, ...outerSpec} = spec;

  let discreteAxisChannelDef: PositionFieldDef<string>;
  let continuousAxisChannelDef: PositionFieldDef<string>;
  let discreteAxis;
  let continuousAxis;

  if (orient === 'vertical') {
    continuousAxis = 'y';
    continuousAxisChannelDef = encoding.y as FieldDef<string>; // Safe to cast because if y is not continous fielddef, the orient would not be vertical.

    if (isFieldDef(encoding.x)) {
      discreteAxis = 'x';
      discreteAxisChannelDef = encoding.x;
    }
  } else {
    continuousAxis = 'x';
    continuousAxisChannelDef = encoding.x as FieldDef<string>; // Safe to cast because if x is not continous fielddef, the orient would not be horizontal.

    if (isFieldDef(encoding.y)) {
      discreteAxis = 'y';
      discreteAxisChannelDef = encoding.y;
    }
  }

  if (continuousAxisChannelDef && continuousAxisChannelDef.aggregate) {
    const {aggregate, ...continuousAxisWithoutAggregate} = continuousAxisChannelDef;
    if (aggregate !== BOXPLOT) {
      log.warn(`Continuous axis should not have customized aggregation function ${aggregate}`);
    }
    continuousAxisChannelDef = continuousAxisWithoutAggregate;
  }

  return {
    discreteAxisChannelDef,
    continuousAxisChannelDef,
    discreteAxis,
    continuousAxis,
    is1D: !(isFieldDef(encoding.x) && isFieldDef(encoding.y))
  };
}

function boxTransform(encoding: Encoding<string>, discreteAxisFieldDef: PositionFieldDef<string>, continuousAxisChannelDef: PositionFieldDef<string>, kIQRScalar: 'min-max' | number, is1D: boolean) {
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
  let calculateTransforms: CalculateTransform[] = [];

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
    calculateTransforms = [
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

  const groupby: Array<Field | string> = [];
  if (discreteAxisFieldDef !== undefined) {
    groupby.push(discreteAxisFieldDef.field);
  }

  const nonPositionEncoding: Encoding<string> = {};
  forEach(encoding, (channelDef, channel) => {
    if (channel === 'x' || channel === 'y') {
      // Skip x and y as we already handle them separately
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
        // FIXME: Matthwchun -- you will need to apply timeUnit and bin transform before summarize in the output transform if applicable
        groupby.push(field(channelDef));
      }
      // now the field should refer to post-transformed field instead
      nonPositionEncoding[channel] = {
        field: field(channelDef),
        type: channelDef.type
      };
    } else {
      // For value def, just copy
      nonPositionEncoding[channel] = encoding[channel];
    }
  });

  return {
    transform: [].concat(
      // FIXME add timeUnit, bin if necessary
      [{summarize, groupby}],
      calculateTransforms
    ),
    nonPositionEncoding
  };
}
