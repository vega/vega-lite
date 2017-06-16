import {Config} from '../config';
import {Encoding} from './../encoding';
import {Field, FieldDef, isContinuous, isDiscrete, isFieldDef, PositionFieldDef} from './../fielddef';
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

export function normalizeBoxPlot(spec: GenericUnitSpec<Encoding<Field>, BOXPLOT | BoxPlotDef>, config: Config): LayerSpec {
  const {mark: mark, encoding: encoding, ...outerSpec} = spec;
  const {x: _x, y: _y, ...nonPositionEncoding} = encoding;
  const {size: size, ...nonPositionEncodingWithoutSize} = nonPositionEncoding;
  const {color: _color, ...nonPositionEncodingWithoutColorSize} = nonPositionEncodingWithoutSize;
  const midTickAndBarSizeChannelDef = size ? {size: size} : {size: {value: config.box.size}};

  let kIQRScalar: number = undefined;
  if (isBoxPlotDef(mark)) {
    if (mark && mark.extent) {
      if(typeof(mark.extent) === 'number') {
        kIQRScalar = mark.extent;
      }
    }
  }
  const isMinMax = kIQRScalar === undefined;

  let discreteAxisFieldDef: PositionFieldDef<Field>;
  let continuousAxisChannelDef: PositionFieldDef<Field>;
  let discreteAxis;
  let continuousAxis;

  if (encoding.x === undefined && encoding.y === undefined) {
    throw new Error('Need at least one axis');
  }

  const orient: Orient = boxOrient(spec);
  const params = boxParams(spec, orient);
  discreteAxisFieldDef = params.discreteAxisFieldDef;
  continuousAxisChannelDef = params.continuousAxisChannelDef;
  discreteAxis = params.discreteAxis;
  continuousAxis = params.continuousAxis;
  const is1D = params.is1D;

  if (continuousAxisChannelDef.aggregate !== undefined && continuousAxisChannelDef.aggregate !== BOXPLOT) {
    throw new Error(`Continuous axis should not have customized aggregation function ${continuousAxisChannelDef.aggregate}`);
  }

  const transformDef = boxTransform(encoding, discreteAxisFieldDef, continuousAxisChannelDef, kIQRScalar, is1D);

  const discreteAxisEncodingMixin = discreteAxisFieldDef !== undefined ? {[discreteAxis]: discreteAxisFieldDef} : {};

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

  const is2D = encoding.x && encoding.y;

  if (!is2D) {
    if (isFieldDef(encoding.x) && isContinuous(encoding.x) && encoding.y === undefined) {
      return 'horizontal';
    } else if (encoding.x === undefined && isFieldDef(encoding.y) && isContinuous(encoding.y)) {
      return 'vertical';
    } else {
      throw new Error('Need a continuous axis for 1D boxplots');
    }
  } else {
    if (isFieldDef(encoding.x) && isFieldDef(encoding.y)) {
      let resultOrient: Orient;

      if (isDiscrete(encoding.x) && isContinuous(encoding.y)) {
        resultOrient = 'vertical';
      } else if (isDiscrete(encoding.y) && isContinuous(encoding.x)) {
        resultOrient = 'horizontal';
      } else {
        if (isContinuous(encoding.x) && isContinuous(encoding.y)) {
          if (encoding.x.aggregate === undefined && encoding.y.aggregate === BOXPLOT) {
            resultOrient = 'vertical';
          } else if (encoding.y.aggregate === undefined && encoding.x.aggregate === BOXPLOT) {
            resultOrient = 'horizontal';
          } else if (encoding.x.aggregate === BOXPLOT && encoding.y.aggregate === BOXPLOT) {
            throw new Error('Both x and y cannot have aggregate');
          } else {
            if (isBoxPlotDef(mark)) {
              if (mark && mark.orient) {
                resultOrient = mark.orient;
              } else {
                // default orientation = vertical
                resultOrient = 'vertical';
              }
            } else {
              resultOrient = 'vertical';
            }
          }
        } else {
          throw new Error('Both x and y cannot be discrete');
        }
      }

      return resultOrient;
    } else {
      throw new Error('Both axes must be valid field definitions');
    }
  }
}


export function boxParams(spec: GenericUnitSpec<Encoding<Field>, BOXPLOT | BoxPlotDef>, orient: Orient) {
  const {mark: mark, encoding: encoding, ...outerSpec} = spec;

  let discreteAxisFieldDef: PositionFieldDef<Field>;
  let continuousAxisChannelDef: PositionFieldDef<Field>;
  let discreteAxis;
  let continuousAxis;

  const is2D = encoding.x && encoding.y;

  if (!is2D) {
    if (orient === 'horizontal') {
      continuousAxis = 'x';
      if (isFieldDef(encoding.x)) {
        continuousAxisChannelDef = encoding.x;
      }
    } else {
      continuousAxis = 'y';
      if (isFieldDef(encoding.y)) {
        continuousAxisChannelDef = encoding.y;
      }
    }
  } else {
    if (isFieldDef(encoding.x) && isFieldDef(encoding.y)) {
      if (orient === 'vertical') {
        discreteAxis = 'x';
        continuousAxis = 'y';
        continuousAxisChannelDef = encoding.y;
        discreteAxisFieldDef = encoding.x;
      } else {
        discreteAxis = 'y';
        continuousAxis = 'x';
        continuousAxisChannelDef = encoding.x;
        discreteAxisFieldDef = encoding.y;
      }
    }

    if (continuousAxisChannelDef && continuousAxisChannelDef.aggregate) {
      const {aggregate: aggregate, ...continuousAxisWithoutAggregate} = continuousAxisChannelDef;
      if (aggregate !== BOXPLOT) {
        throw new Error(`Continuous axis should not have customized aggregation function ${aggregate}`);
      }
      continuousAxisChannelDef = continuousAxisWithoutAggregate;
    }
  }

  return {
    discreteAxisFieldDef: discreteAxisFieldDef,
    continuousAxisChannelDef: continuousAxisChannelDef,
    discreteAxis: discreteAxis,
    continuousAxis: continuousAxis,
    is1D: !is2D
  };
}

export function boxTransform(encoding: Encoding<Field>, discreteAxisFieldDef: PositionFieldDef<Field>, continuousAxisChannelDef: PositionFieldDef<Field>, kIQRScalar: 'min-max' | number, is1D: boolean) {
  const isMinMax = kIQRScalar === undefined;
  const groupbyDef = boxTransformGroupby(discreteAxisFieldDef, encoding);

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

  if (groupbyDef !== undefined) {
    transformDef[0].groupby = groupbyDef;
  }

  return transformDef;
}

export function boxTransformGroupby(discreteAxisFieldDef: PositionFieldDef<Field>, encoding: Encoding<Field>): Array<Field | string> {
  const result: Array<Field | string> = [];
  if (discreteAxisFieldDef !== undefined) {
    result.push(discreteAxisFieldDef.field);
  }
  const supportedEncChannels = ['size', 'color', 'opacity'];

  for (const fieldName in encoding) {
    if (supportedEncChannels.indexOf(fieldName) > -1) {
      const fieldDef = encoding[fieldName];
      if (fieldDef.field && fieldDef.aggregate !== BOXPLOT) {
        result.push(fieldName);
      }
    }
  }

  return result;
}
