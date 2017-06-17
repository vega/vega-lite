import {isNumber} from 'vega-util';
import {Config} from '../config';
import {Encoding} from './../encoding';
import {Field, FieldDef, isContinuous, isDiscrete, isFieldDef, PositionFieldDef} from './../fielddef';
import {MarkConfig, MarkDef} from './../mark';
import {GenericUnitSpec, LayerSpec} from './../spec';
import {Orient} from './../vega.schema';


export const BOXPLOT: 'box-plot' = 'box-plot';
export type BOXPLOT = typeof BOXPLOT;
export type BoxPlotRole = 'boxWhisker' | 'box' | 'boxMid';
export const supportedEncChannels = ['color', 'detail', 'opacity', 'size'];

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

export function normalizeBoxPlot(spec: GenericUnitSpec<Encoding<Field>, BOXPLOT | BoxPlotDef>, config: Config): LayerSpec {
  const {mark: mark, encoding: encoding, ...outerSpec} = spec;
  const {x: _x, y: _y, ...nonPositionEncoding} = encoding;
  const {size: size, ...nonPositionEncodingWithoutSize} = nonPositionEncoding;
  const {color: _color, ...nonPositionEncodingWithoutColorSize} = nonPositionEncodingWithoutSize;
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
  const params = boxParams(spec, orient);

  if (continuousAxisChannelDef.aggregate !== undefined && continuousAxisChannelDef.aggregate !== BOXPLOT) {
    throw new Error(`Continuous axis should not have customized aggregation function ${continuousAxisChannelDef.aggregate}`);
  }

  const transform = boxTransform(encoding, discreteAxisChannelDef, continuousAxisChannelDef, kIQRScalar, is1D);

  const discreteAxisEncodingMixin = discreteAxisChannelDef !== undefined ? {[discreteAxis]: discreteAxisChannelDef} : {};

  return {
    ...outerSpec,
    transform: transform,
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

  const is2D = encoding.x && encoding.y;
  const continuousXAxis = isFieldDef(encoding.x) && isContinuous(encoding.x);
  const continuousYAxis = isFieldDef(encoding.y) && isContinuous(encoding.y);

  if (continuousXAxis
      && (encoding.y === undefined || (isFieldDef(encoding.y) && isDiscrete(encoding.y)))) {
    return 'horizontal';
  } else if (continuousYAxis
      && (encoding.x === undefined || (isFieldDef(encoding.x) && isDiscrete(encoding.x)))) {
    return 'vertical';
  }

  if (!continuousXAxis && !continuousYAxis) {
    throw new Error('Need a valid continuous axis for boxplots');
  }

  if (isFieldDef(encoding.x) && isFieldDef(encoding.y) && isContinuous(encoding.x) && isContinuous(encoding.y)) {
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
    }
  }

  // default orientation = vertical
  return 'vertical';
}


export function boxParams(spec: GenericUnitSpec<Encoding<Field>, BOXPLOT | BoxPlotDef>, orient: Orient) {
  const {mark: mark, encoding: encoding, ...outerSpec} = spec;

  let discreteAxisChannelDef: PositionFieldDef<Field>;
  let continuousAxisChannelDef: PositionFieldDef<Field>;
  let discreteAxis;
  let continuousAxis;

  if (orient === 'vertical') {
    if (isFieldDef(encoding.y)) {
      continuousAxis = 'y';
      continuousAxisChannelDef = encoding.y;
    }

    if (isFieldDef(encoding.x)) {
      discreteAxis = 'x';
      discreteAxisChannelDef = encoding.x;
    }
  } else {
    if (isFieldDef(encoding.x)) {
      continuousAxis = 'x';
      continuousAxisChannelDef = encoding.x;
    }

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

  for (const fieldName in encoding) {
    if (supportedEncChannels.indexOf(fieldName) > -1) {
      const fieldDef = encoding[fieldName];
      if (fieldDef.field && fieldDef.aggregate !== BOXPLOT) {
        transformDef[0].summarize = transformDef[0].summarize.push({
          aggregate: fieldDef.aggregate,
          field: fieldDef.field,
          as: 'fieldName_' + fieldDef.field
        });
      }
    }
  }

  transformDef[0].groupby = boxTransformGroupby(discreteAxisFieldDef, encoding);

  return transformDef;
}

export function boxTransformGroupby(discreteAxisFieldDef: PositionFieldDef<Field>, encoding: Encoding<Field>): Array<Field | string> {
  const groupby: Array<Field | string> = [];
  if (discreteAxisFieldDef !== undefined) {
    groupby.push(discreteAxisFieldDef.field);
  }

  for (const fieldName in encoding) {
    if (supportedEncChannels.indexOf(fieldName) > -1) {
      const fieldDef = encoding[fieldName];
      if (fieldDef.field && fieldDef.aggregate === undefined) {
        groupby.push(fieldName);
      }
    }
  }

  return groupby;
}
