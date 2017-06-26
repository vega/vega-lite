import {isNumber} from 'vega-util';
import {Channel} from '../channel';
import {Config} from '../config';
import {reduce} from '../encoding';
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
export function filterUnsupportedChannels(spec: GenericUnitSpec<Encoding<Field>, BOXPLOT | BoxPlotDef>): GenericUnitSpec<Encoding<Field>, BOXPLOT | BoxPlotDef> {
  const {encoding: encoding, ...outerSpec} = spec;

  return {
    encoding: reduce(encoding, (newEncoding, fieldDef, channel) => {
      if (supportedChannels.indexOf(channel) > -1) {
        newEncoding[channel] = fieldDef;
      } else {
        log.warn(log.message.incompatibleChannel(channel, BOXPLOT));
      }
      return newEncoding;
    }, {}),
    ...outerSpec
  };
}

export function normalizeBoxPlot(spec: GenericUnitSpec<Encoding<Field>, BOXPLOT | BoxPlotDef>, config: Config): LayerSpec {
  spec = filterUnsupportedChannels(spec);
  const {mark: mark, encoding: encoding, ...outerSpec} = spec;
  const size = encoding.size;
  const midTickAndBarSizeChannelDef = size ? {size: size} : {size: {value: config.box.size}};

  let kIQRScalar: number = undefined;
  if (isBoxPlotDef(mark)) {
    if (mark.extent) {
      if(isNumber(mark.extent)) {
        kIQRScalar = mark.extent;
      }
    }
  }
  const isMinMax = kIQRScalar === undefined;

  if (encoding.x === undefined && encoding.y === undefined) {
    throw new Error('Need at least one axis');
  }

  const orient: Orient = boxOrient(spec);
  const {discreteAxisChannelDef, continuousAxisChannelDef, discreteAxis, continuousAxis, is1D} = boxParams(spec, orient);

  if (continuousAxisChannelDef.aggregate !== undefined && continuousAxisChannelDef.aggregate !== BOXPLOT) {
    throw new Error(`Continuous axis should not have customized aggregation function ${continuousAxisChannelDef.aggregate}`);
  }

  const {transformDef, encodingPostTransform} = boxTransform(encoding, discreteAxisChannelDef, continuousAxisChannelDef, kIQRScalar, is1D);
  const {x: _x, y: _y, ...nonPositionEncoding} = encodingPostTransform;
  const {size: _size, ...nonPositionEncodingWithoutSize} = nonPositionEncoding;
  const {color: _color, ...nonPositionEncodingWithoutColorSize} = nonPositionEncodingWithoutSize;
  const discreteAxisEncodingMixin = discreteAxisChannelDef !== undefined ? {[discreteAxis]: discreteAxisChannelDef} : {};

  return {
    ...outerSpec,
    transform: transformDef,
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
          ...nonPositionEncodingWithoutSize,
          ...midTickAndBarSizeChannelDef
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
          ...midTickAndBarSizeChannelDef,
          color: {value : 'white'}
        }
      }
    ]
  };
}

export function boxOrient(spec: GenericUnitSpec<Encoding<Field>, BOXPLOT | BoxPlotDef>): Orient {
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


export function boxParams(spec: GenericUnitSpec<Encoding<Field>, BOXPLOT | BoxPlotDef>, orient: Orient) {
  const {mark: mark, encoding: encoding, ...outerSpec} = spec;

  let discreteAxisChannelDef: PositionFieldDef<Field>;
  let continuousAxisChannelDef: PositionFieldDef<Field>;
  let discreteAxis;
  let continuousAxis;

  if (orient === 'vertical') {
    continuousAxis = 'y';
    continuousAxisChannelDef = encoding.y as FieldDef<Field>; // safe because need at least one axis for boxplot

    if (isFieldDef(encoding.x)) {
      discreteAxis = 'x';
      discreteAxisChannelDef = encoding.x;
    }
  } else {
    continuousAxis = 'x';
    continuousAxisChannelDef = encoding.x as FieldDef<Field>; // safe because need at least one axis for boxplot

    if (isFieldDef(encoding.y)) {
      discreteAxis = 'y';
      discreteAxisChannelDef = encoding.y;
    }
  }

  if (continuousAxisChannelDef && continuousAxisChannelDef.aggregate) {
    const {aggregate: aggregate, ...continuousAxisWithoutAggregate} = continuousAxisChannelDef;
    if (aggregate !== BOXPLOT) {
      throw new Error(`Continuous axis should not have customized aggregation function ${aggregate}`);
    }
    continuousAxisChannelDef = continuousAxisWithoutAggregate;
  }

  return {
    discreteAxisChannelDef: discreteAxisChannelDef,
    continuousAxisChannelDef: continuousAxisChannelDef,
    discreteAxis: discreteAxis,
    continuousAxis: continuousAxis,
    is1D: !(isFieldDef(encoding.x) && isFieldDef(encoding.y))
  };
}

export function boxTransform(encoding: Encoding<Field>, discreteAxisFieldDef: PositionFieldDef<Field>, continuousAxisChannelDef: PositionFieldDef<Field>, kIQRScalar: 'min-max' | number, is1D: boolean) {
  const isMinMax = kIQRScalar === undefined;

  let transformDef:any = [
      {
        summarize: [
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
        ]
      }
  ];

  if (isMinMax) {
    transformDef[0].summarize = transformDef[0].summarize.concat([
      {
        aggregate: 'min',
        field: continuousAxisChannelDef.field,
        as: 'lowerWhisker'
      },
      {
        aggregate: 'max',
        field: continuousAxisChannelDef.field,
        as: 'upperWhisker'
      }
    ]);
  } else {
    transformDef = transformDef.concat([
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
    ]);
  }

  const groupby: Array<Field | string> = [];
  if (discreteAxisFieldDef !== undefined) {
    groupby.push(discreteAxisFieldDef.field);
  }

  const {x: _x, y: _y, ...nonPositionEncoding} = encoding;

  for (const fieldName in nonPositionEncoding) {
    if (nonPositionEncoding.hasOwnProperty(fieldName)) {
      const fieldDef = nonPositionEncoding[fieldName];
      if (field(fieldDef)) {
        if (fieldDef.aggregate && fieldDef.aggregate !== BOXPLOT) {
          transformDef[0].summarize = transformDef[0].summarize.concat([{
            aggregate: fieldDef.aggregate,
            field: fieldDef.field,
            as: field(fieldDef)
          }]);
          encoding[fieldName] = {
            field: field(fieldDef),
            type: fieldDef.type
          };
        } else if (fieldDef.aggregate === undefined) {
          groupby.push(field(fieldDef));
        }
      }
    }
  }

  const encodingPostTransform = encoding;

  transformDef[0].groupby = groupby;
  return {transformDef, encodingPostTransform};
}
