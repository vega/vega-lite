import {Config} from '../config';
import {isFieldDef} from '../fielddef';
import {Encoding} from './../encoding';
import {Field, FieldDef, isContinuous, isDiscrete, PositionFieldDef} from './../fielddef';
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

  let discreteAxisFieldDef: PositionFieldDef<Field>, continuousAxisChannelDef: PositionFieldDef<Field>;
  let discreteAxis, continuousAxis;

  let is1D = true;

  if (encoding.x && encoding.y) {
    // 2D

    is1D = false;

    const orient: Orient = box2DOrient(spec);
    const params = box2DParams(spec, orient);
    discreteAxisFieldDef = params.discreteAxisFieldDef;
    continuousAxisChannelDef = params.continuousAxisChannelDef;
    discreteAxis = params.discreteAxis;
    continuousAxis = params.continuousAxis;

  } else if (isFieldDef(encoding.x) && isContinuous(encoding.x) && encoding.y === undefined) {
    // 1D horizontal
    continuousAxis = 'x';
    continuousAxisChannelDef = encoding.x;
  } else if (encoding.x === undefined && isFieldDef(encoding.y) && isContinuous(encoding.y)) {
    // 1D vertical
    continuousAxis = 'y';
    continuousAxisChannelDef = encoding.y;
  } else {
    throw new Error('Need a continuous axis for 1D boxplots');
  }

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

export function box2DOrient(spec: GenericUnitSpec<Encoding<Field>, BOXPLOT | BoxPlotDef>): Orient {
  const {mark: mark, encoding: encoding, ...outerSpec} = spec;

  // FIXME: refactor code such that we don't have to do this casting
  // We can cast here as we already check from outside that both x and y are FieldDef
  const xDef = encoding.x as FieldDef<Field>;
  const yDef = encoding.y as FieldDef<Field>;
  let resultOrient: Orient;

  if (isDiscrete(xDef) && isContinuous(yDef)) {
    resultOrient = 'vertical';
  } else if (isDiscrete(yDef) && isContinuous(xDef)) {
    resultOrient = 'horizontal';
  } else {
    if (isContinuous(xDef) && isContinuous(yDef)) {
      if (xDef.aggregate === undefined && yDef.aggregate === BOXPLOT) {
        resultOrient = 'vertical';
      } else if (yDef.aggregate === undefined && xDef.aggregate === BOXPLOT) {
        resultOrient = 'horizontal';
      } else if (xDef.aggregate === BOXPLOT && yDef.aggregate === BOXPLOT) {
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
}


export function box2DParams(spec: GenericUnitSpec<Encoding<Field>, BOXPLOT | BoxPlotDef>, orient: Orient) {
  const {mark: mark, encoding: encoding, ...outerSpec} = spec;

  let discreteAxisFieldDef: PositionFieldDef<Field>;
  let continuousAxisChannelDef: PositionFieldDef<Field>;
  let discreteAxis;
  let continuousAxis;

  // FIXME: refactor code such that we don't have to do this casting
  // We can cast here as we already check from outside that both x and y are FieldDef
  const xDef = encoding.x as FieldDef<Field>;
  const yDef = encoding.y as FieldDef<Field>;


  if (orient === 'vertical') {
    discreteAxis = 'x';
    continuousAxis = 'y';
    continuousAxisChannelDef = yDef;
    discreteAxisFieldDef = xDef;
  } else {
    discreteAxis = 'y';
    continuousAxis = 'x';
    continuousAxisChannelDef = xDef;
    discreteAxisFieldDef = yDef;
  }

  if (continuousAxisChannelDef && continuousAxisChannelDef.aggregate) {
    const {aggregate: aggregate, ...continuousAxisWithoutAggregate} = continuousAxisChannelDef;
    if (aggregate !== BOXPLOT) {
      throw new Error(`Continuous axis should not have customized aggregation function ${aggregate}`);
    }
    continuousAxisChannelDef = continuousAxisWithoutAggregate;
  }

  return {
    discreteAxisFieldDef: discreteAxisFieldDef,
    continuousAxisChannelDef: continuousAxisChannelDef,
    discreteAxis: discreteAxis,
    continuousAxis: continuousAxis
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
