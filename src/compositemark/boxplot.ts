import {Config} from '../config';
import {Encoding} from './../encoding';
import {Field, FieldDef, isContinuous, isDiscrete, PositionFieldDef} from './../fielddef';
import {MarkConfig, MarkDef} from './../mark';
import {GenericUnitSpec, LayerSpec} from './../spec';
import {Orient} from './../vega.schema';

export const BOXPLOT: 'box-plot' = 'box-plot';
export type BOXPLOT = typeof BOXPLOT;

export interface BoxPlotDef {
  type: BOXPLOT;
  orient: Orient;
}

export interface BoxPlotConfig extends MarkConfig {
  /** Size of the box and mid tick of a box plot */
  size?: number;
}

export function normalizeBoxPlot(spec: GenericUnitSpec<Encoding<Field>, BOXPLOT | BoxPlotDef>, config: Config): LayerSpec {
  const {mark: mark, encoding: encoding, ...outerSpec} = spec;
  const {x: _x, y: _y, ...nonPositionEncoding} = encoding;
  const {size: size, ...nonPositionEncodingWithoutSize} = nonPositionEncoding;
  const {color: _color, ...nonPositionEncodingWithoutColorSize} = nonPositionEncodingWithoutSize;
  const midTickAndBarSizeChannelDef = size ? {size: size} : {size: {value: config.box.size}};

  let discreteAxisFieldDef, continuousAxisChannelDef: PositionFieldDef<Field>;
  let discreteAxis, continuousAxis;

  if (encoding.x && encoding.y) {
    // 2D
    if (isContinuous(encoding.x) && isContinuous(encoding.y)) {
      const xEncChannel = encoding.x as FieldDef<Field>;
      const yEncChannel = encoding.y as FieldDef<Field>;
      if (xEncChannel.aggregate === BOXPLOT && yEncChannel.aggregate === BOXPLOT) {
        throw new Error('Both x and y cannot have aggregate');
      }
    } else if (isDiscrete(encoding.x) && isDiscrete(encoding.y)) {
      throw new Error('Both x and y cannot be discrete');
    }

    const orient: Orient = box2DOrient(spec);
    const params = box2DParams(spec, orient);
    discreteAxisFieldDef = params.discreteAxisFieldDef;
    continuousAxisChannelDef = params.continuousAxisChannelDef;
    discreteAxis = params.discreteAxis;
    continuousAxis = params.continuousAxis;

  } else if (encoding.x && isContinuous(encoding.x) && encoding.y === undefined) {
    // 1D horizontal
    continuousAxis = 'x';
    continuousAxisChannelDef = encoding.x;
  } else if (encoding.x === undefined && encoding.y && isContinuous(encoding.y)) {
    // 1D vertical
    continuousAxis = 'y';
    continuousAxisChannelDef = encoding.y;
  } else {
    throw new Error('Need a continuous axis for 1D boxplots');
  }

  if (continuousAxisChannelDef.aggregate !== undefined && continuousAxisChannelDef.aggregate !== BOXPLOT) {
    throw new Error('Continuous axis should not be aggregated');
  }

  const baseContinuousFieldDef = {
      field: continuousAxisChannelDef.field,
      type: continuousAxisChannelDef.type
  };

  const minFieldDef = {
    aggregate: 'min',
    ...baseContinuousFieldDef
  };
  const minWithAxisFieldDef = {
    axis: continuousAxisChannelDef.axis,
    ...minFieldDef
  };
  const q1FieldDef = {
    aggregate: 'q1',
    ...baseContinuousFieldDef
  };
  const medianFieldDef = {
    aggregate: 'median',
    ...baseContinuousFieldDef
  };
  const q3FieldDef = {
    aggregate: 'q3',
    ...baseContinuousFieldDef
  };
  const maxFieldDef = {
    aggregate: 'max',
    ...baseContinuousFieldDef
  };

  const discreteAxisEncodingMixin = discreteAxisFieldDef !== undefined ? {[discreteAxis]: discreteAxisFieldDef} : {};

  return {
    ...outerSpec,
    layer: [
      { // lower whisker
        mark: {
          type: 'rule',
          role: 'boxWhisker'
        },
        encoding: {
          ...discreteAxisEncodingMixin,
          [continuousAxis]: minWithAxisFieldDef,
          [continuousAxis + '2']: q1FieldDef,
          ...nonPositionEncodingWithoutColorSize
        }
      }, { // upper whisker
        mark: {
          type: 'rule',
          role: 'boxWhisker'
        },
        encoding: {
          ...discreteAxisEncodingMixin,
          [continuousAxis]: q3FieldDef,
          [continuousAxis + '2']: maxFieldDef,
          ...nonPositionEncodingWithoutColorSize
        }
      }, { // box (q1 to q3)
        mark: {
          type: 'bar',
          role: 'box'
        },
        encoding: {
          ...discreteAxisEncodingMixin,
          [continuousAxis]: q1FieldDef,
          [continuousAxis + '2']: q3FieldDef,
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
          [continuousAxis]: medianFieldDef,
          ...nonPositionEncoding,
          ...midTickAndBarSizeChannelDef,
          'color': {'value' : 'white'}
        }
      }
    ]
  };
}

export function box2DOrient(spec: GenericUnitSpec<Encoding<Field>, BOXPLOT | BoxPlotDef>): Orient {
  const {mark: mark, encoding: encoding, ...outerSpec} = spec;
  const xEncChannel = encoding.x as FieldDef<Field>;
  const yEncChannel = encoding.y as FieldDef<Field>;
  let resultOrient: Orient;

  if (isDiscrete(encoding.x) && isContinuous(encoding.y)) {
    resultOrient = 'vertical';
  } else if (isDiscrete(encoding.y) && isContinuous(encoding.x)) {
    resultOrient = 'horizontal';
  } else {
    if (isContinuous(encoding.x) && isContinuous(encoding.y)) {
      if (xEncChannel.aggregate === undefined && yEncChannel.aggregate === BOXPLOT) {
        resultOrient = 'vertical';
      } else if (yEncChannel.aggregate === undefined && xEncChannel.aggregate === BOXPLOT) {
        resultOrient = 'horizontal';
      } else if (xEncChannel.aggregate === BOXPLOT && yEncChannel.aggregate === BOXPLOT) {
        return undefined; // invalid spec
      } else {
        const markChannel = mark as BoxPlotDef;
        if (markChannel && markChannel.orient) {
          resultOrient = markChannel.orient;
        } else {
          // default orientation = vertical
          resultOrient = 'vertical';
        }
      }
    } else {
      resultOrient = undefined; // 2 discrete axes
    }
  }

  return resultOrient;
}

export function box2DParams(spec: GenericUnitSpec<Encoding<Field>, BOXPLOT | BoxPlotDef>, orient: Orient) {
  const {mark: mark, encoding: encoding, ...outerSpec} = spec;

  let discreteAxisFieldDef: PositionFieldDef<Field>, continuousAxisChannelDef: PositionFieldDef<Field>;
  let discreteAxis, continuousAxis;

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

  if (continuousAxisChannelDef && continuousAxisChannelDef.aggregate) {
    const {aggregate: aggregate, ...continuousAxisWithoutAggregate} = continuousAxisChannelDef;
    if (aggregate !== BOXPLOT) {
      throw new Error('Continuous axis should not be aggregated');
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
