import {isNumber} from 'vega-util';
import {Channel} from '../channel';
import {Config} from '../config';
import {reduce} from '../encoding';
import {GenericMarkDef, isMarkDef, MarkConfig} from '../mark';
import {AggregatedFieldDef, BinTransform, CalculateTransform, TimeUnitTransform} from '../transform';
import {Flag, keys} from '../util';
import {Encoding, forEach} from './../encoding';
import {Field, FieldDef, isContinuous, isFieldDef, PositionFieldDef, vgField} from './../fielddef';
import * as log from './../log';
import {GenericUnitSpec, LayerSpec} from './../spec';
import {Orient} from './../vega.schema';
import {getMarkDefMixins} from './common';


export const BOXPLOT: 'boxplot' = 'boxplot';
export type BoxPlot = typeof BOXPLOT;

export type BoxPlotPart = 'box' | 'median' | 'whisker';

const BOXPLOT_PART_INDEX: Flag<BoxPlotPart> = {
  box: 1,
  median: 1,
  whisker: 1
};

export const BOXPLOT_PARTS = keys(BOXPLOT_PART_INDEX);

// TODO: Currently can't use `PartsMixins<BoxPlotPart>`
// as the schema generator will fail
export type BoxPlotPartsMixins = {
  [part in BoxPlotPart]?: MarkConfig
};

export interface BoxPlotConfig extends BoxPlotPartsMixins {
  /** Size of the box and median tick of a box plot */
  size?: number;

  /**
   * The extent of the whiskers. Available options include:
   * - `"min-max": min and max are the lower and upper whiskers respectively.
   * - `"number": multiples of the interquartile range (Q3-Q1) A number that will be multiplied by the IQR and the product will be added to the third quartile to get the upper whisker and subtracted from the first quartile to get the lower whisker.
   *
   * __Default value:__ `"1.5"`.
   */
  extent?: 'min-max' | number;
}
export interface BoxPlotDef extends GenericMarkDef<BoxPlot>, BoxPlotConfig {
  /**
   * Orientation of the box plot.  This is normally automatically determined, but can be specified when the orientation is ambiguous and cannot be automatically determined.
   */
  orient?: Orient;
}

export interface BoxPlotConfigMixins {
  /**
   * Box Config
   */
  boxplot?: BoxPlotConfig;
}


const supportedChannels: Channel[] = ['x', 'y', 'color', 'detail', 'opacity', 'size'];
export function filterUnsupportedChannels(spec: GenericUnitSpec<Encoding<string>, BoxPlot | BoxPlotDef>): GenericUnitSpec<Encoding<string>, BoxPlot | BoxPlotDef> {
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

export function normalizeBoxPlot(spec: GenericUnitSpec<Encoding<string>, BoxPlot | BoxPlotDef>, config: Config): LayerSpec {
  spec = filterUnsupportedChannels(spec);
  // TODO: use selection
  const {mark, encoding, selection, projection: _p, ...outerSpec} = spec;
  const markDef = isMarkDef(mark) ? mark : {type: mark};

  const extent = markDef.extent || config.boxplot.extent;
  const sizeValue = markDef.size || config.boxplot.size;

  const orient: Orient = boxOrient(spec);
  const {transform, continuousAxisChannelDef, continuousAxis, encodingWithoutContinuousAxis} = boxParams(spec, orient, extent);

  const {color, size, ...encodingWithoutSizeColorAndContinuousAxis} = encodingWithoutContinuousAxis;

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
          ...getMarkDefMixins<BoxPlotPartsMixins>(markDef, 'whisker', config.boxplot)
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
          ...encodingWithoutSizeColorAndContinuousAxis
        }
      }, { // upper whisker
        mark: {
          type: 'rule',
          ...getMarkDefMixins<BoxPlotPartsMixins>(markDef, 'whisker', config.boxplot)
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
          ...encodingWithoutSizeColorAndContinuousAxis
        }
      }, { // box (q1 to q3)
        ...(selection ? {selection} : {}),
        mark: {
          type: 'bar',
          ...(sizeValue ? {size: sizeValue} : {}),
          ...getMarkDefMixins<BoxPlotPartsMixins>(markDef, 'box', config.boxplot)
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
          ...(size ? {size} : {})
        }
      }, { // median tick
        mark: {
          type: 'tick',
          ...(sizeValue ? {size: sizeValue} : {}),
          ...getMarkDefMixins<BoxPlotPartsMixins>(markDef, 'median', config.boxplot)
        },
        encoding: {
          [continuousAxis]: {
            field: 'mid_box_' + continuousAxisChannelDef.field,
            type: continuousAxisChannelDef.type
          },
          ...encodingWithoutSizeColorAndContinuousAxis,
          ...(size ? {size} : {})
        }
      }
    ]
  };
}

function boxOrient(spec: GenericUnitSpec<Encoding<Field>, BoxPlot | BoxPlotDef>): Orient {
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
    throw new Error('Need a valid continuous axis for boxplots');
  }
}


function boxContinousAxis(spec: GenericUnitSpec<Encoding<string>, BoxPlot | BoxPlotDef>, orient: Orient) {
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

function boxParams(spec: GenericUnitSpec<Encoding<string>, BoxPlot | BoxPlotDef>, orient: Orient, extent: 'min-max' | number) {

  const {continuousAxisChannelDef, continuousAxis} = boxContinousAxis(spec, orient);
  const encoding = spec.encoding;

  const isMinMax = !isNumber(extent);
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
        calculate: `min(datum.upper_box_${continuousAxisChannelDef.field} + datum.iqr_${continuousAxisChannelDef.field} * ${extent}, datum.max_${continuousAxisChannelDef.field})`,
        as: 'upper_whisker_' + continuousAxisChannelDef.field
      },
      {
        calculate: `max(datum.lower_box_${continuousAxisChannelDef.field} - datum.iqr_${continuousAxisChannelDef.field} * ${extent}, datum.min_${continuousAxisChannelDef.field})`,
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
