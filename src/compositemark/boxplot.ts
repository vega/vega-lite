import {Orientation} from 'vega';
import {isNumber, isObject} from 'vega-util';
import {getMarkPropOrConfig} from '../compile/common';
import {Config} from '../config';
import {Encoding, extractTransformsFromEncoding, normalizeEncoding} from '../encoding';
import * as log from '../log';
import {isMarkDef, MarkDef} from '../mark';
import {NormalizerParams} from '../normalize';
import {GenericUnitSpec, NormalizedLayerSpec, NormalizedUnitSpec} from '../spec';
import {AggregatedFieldDef, CalculateTransform, JoinAggregateTransform, Transform} from '../transform';
import {isEmpty, omit} from '../util';
import {CompositeMarkNormalizer} from './base';
import {
  compositeMarkContinuousAxis,
  compositeMarkOrient,
  filterTooltipWithAggregatedField,
  GenericCompositeMarkDef,
  getCompositeMarkTooltip,
  getTitle,
  makeCompositeAggregatePartFactory,
  partLayerMixins,
  PartsMixins
} from './common';

export const BOXPLOT = 'boxplot' as const;
export type BoxPlot = typeof BOXPLOT;

export const BOXPLOT_PARTS = ['box', 'median', 'outliers', 'rule', 'ticks'] as const;

type BoxPlotPart = typeof BOXPLOT_PARTS[number];

export type BoxPlotPartsMixins = PartsMixins<BoxPlotPart>;

export interface BoxPlotConfig extends BoxPlotPartsMixins {
  /** Size of the box and median tick of a box plot */
  size?: number;

  /**
   * The extent of the whiskers. Available options include:
   * - `"min-max"`: min and max are the lower and upper whiskers respectively.
   * - A number representing multiple of the interquartile range. This number will be multiplied by the IQR to determine whisker boundary, which spans from the smallest data to the largest data within the range _[Q1 - k * IQR, Q3 + k * IQR]_ where _Q1_ and _Q3_ are the first and third quartiles while _IQR_ is the interquartile range (_Q3-Q1_).
   *
   * __Default value:__ `1.5`.
   */
  extent?: 'min-max' | number;
}

export type BoxPlotDef = GenericCompositeMarkDef<BoxPlot> &
  BoxPlotConfig & {
    /**
     * Type of the mark. For box plots, this should always be `"boxplot"`.
     * [boxplot](https://vega.github.io/vega-lite/docs/boxplot.html)
     */
    type: BoxPlot;

    /**
     * Orientation of the box plot. This is normally automatically determined based on types of fields on x and y channels. However, an explicit `orient` be specified when the orientation is ambiguous.
     *
     * __Default value:__ `"vertical"`.
     */
    orient?: Orientation;
  };

export interface BoxPlotConfigMixins {
  /**
   * Box Config
   */
  boxplot?: BoxPlotConfig;
}

export const boxPlotNormalizer = new CompositeMarkNormalizer(BOXPLOT, normalizeBoxPlot);

export function getBoxPlotType(extent: number | 'min-max') {
  if (isNumber(extent)) {
    return 'tukey';
  }
  // Ham: If we ever want to, we could add another extent syntax `{kIQR: number}` for the original [Q1-k*IQR, Q3+k*IQR] whisker and call this boxPlotType = `kIQR`. However, I'm not exposing this for now.
  return extent;
}

export function normalizeBoxPlot(
  spec: GenericUnitSpec<Encoding<string>, BoxPlot | BoxPlotDef>,
  {config}: NormalizerParams
): NormalizedLayerSpec {
  // Need to initEncoding first so we can infer type
  spec = {
    ...spec,
    encoding: normalizeEncoding(spec.encoding, config)
  };
  const {mark, encoding: _encoding, params, projection: _p, ...outerSpec} = spec;
  const markDef: BoxPlotDef = isMarkDef(mark) ? mark : {type: mark};

  // TODO(https://github.com/vega/vega-lite/issues/3702): add selection support
  if (params) {
    log.warn(log.message.selectionNotSupported('boxplot'));
  }

  const extent = markDef.extent ?? config.boxplot.extent;
  const sizeValue = getMarkPropOrConfig(
    'size',
    markDef as any, // TODO: https://github.com/vega/vega-lite/issues/6245
    config
  );

  const boxPlotType = getBoxPlotType(extent);
  const {
    bins,
    timeUnits,
    transform,
    continuousAxisChannelDef,
    continuousAxis,
    groupby,
    aggregate,
    encodingWithoutContinuousAxis,
    ticksOrient,
    boxOrient,
    customTooltipWithoutAggregatedField
  } = boxParams(spec, extent, config);

  const {color, size, ...encodingWithoutSizeColorAndContinuousAxis} = encodingWithoutContinuousAxis;

  const makeBoxPlotPart = (sharedEncoding: Encoding<string>) => {
    return makeCompositeAggregatePartFactory<BoxPlotPartsMixins>(
      markDef,
      continuousAxis,
      continuousAxisChannelDef,
      sharedEncoding,
      config.boxplot
    );
  };

  const makeBoxPlotExtent = makeBoxPlotPart(encodingWithoutSizeColorAndContinuousAxis);
  const makeBoxPlotBox = makeBoxPlotPart(encodingWithoutContinuousAxis);
  const makeBoxPlotMidTick = makeBoxPlotPart({...encodingWithoutSizeColorAndContinuousAxis, ...(size ? {size} : {})});

  const fiveSummaryTooltipEncoding: Encoding<string> = getCompositeMarkTooltip(
    [
      {fieldPrefix: boxPlotType === 'min-max' ? 'upper_whisker_' : 'max_', titlePrefix: 'Max'},
      {fieldPrefix: 'upper_box_', titlePrefix: 'Q3'},
      {fieldPrefix: 'mid_box_', titlePrefix: 'Median'},
      {fieldPrefix: 'lower_box_', titlePrefix: 'Q1'},
      {fieldPrefix: boxPlotType === 'min-max' ? 'lower_whisker_' : 'min_', titlePrefix: 'Min'}
    ],
    continuousAxisChannelDef,
    encodingWithoutContinuousAxis
  );

  // ## Whisker Layers

  const endTick: MarkDef = {type: 'tick', color: 'black', opacity: 1, orient: ticksOrient, invalid: null, aria: false};
  const whiskerTooltipEncoding: Encoding<string> =
    boxPlotType === 'min-max'
      ? fiveSummaryTooltipEncoding // for min-max, show five-summary tooltip for whisker
      : // for tukey / k-IQR, just show upper/lower-whisker
        getCompositeMarkTooltip(
          [
            {fieldPrefix: 'upper_whisker_', titlePrefix: 'Upper Whisker'},
            {fieldPrefix: 'lower_whisker_', titlePrefix: 'Lower Whisker'}
          ],
          continuousAxisChannelDef,
          encodingWithoutContinuousAxis
        );

  const whiskerLayers = [
    ...makeBoxPlotExtent({
      partName: 'rule',
      mark: {type: 'rule', invalid: null, aria: false},
      positionPrefix: 'lower_whisker',
      endPositionPrefix: 'lower_box',
      extraEncoding: whiskerTooltipEncoding
    }),
    ...makeBoxPlotExtent({
      partName: 'rule',
      mark: {type: 'rule', invalid: null, aria: false},
      positionPrefix: 'upper_box',
      endPositionPrefix: 'upper_whisker',
      extraEncoding: whiskerTooltipEncoding
    }),
    ...makeBoxPlotExtent({
      partName: 'ticks',
      mark: endTick,
      positionPrefix: 'lower_whisker',
      extraEncoding: whiskerTooltipEncoding
    }),
    ...makeBoxPlotExtent({
      partName: 'ticks',
      mark: endTick,
      positionPrefix: 'upper_whisker',
      extraEncoding: whiskerTooltipEncoding
    })
  ];

  // ## Box Layers

  // TODO: support hiding certain mark parts
  const boxLayers: NormalizedUnitSpec[] = [
    ...(boxPlotType !== 'tukey' ? whiskerLayers : []),
    ...makeBoxPlotBox({
      partName: 'box',
      mark: {
        type: 'bar',
        ...(sizeValue ? {size: sizeValue} : {}),
        orient: boxOrient,
        invalid: null,
        ariaRoleDescription: 'box'
      },
      positionPrefix: 'lower_box',
      endPositionPrefix: 'upper_box',
      extraEncoding: fiveSummaryTooltipEncoding
    }),
    ...makeBoxPlotMidTick({
      partName: 'median',
      mark: {
        type: 'tick',
        invalid: null,
        ...(isObject(config.boxplot.median) && config.boxplot.median.color ? {color: config.boxplot.median.color} : {}),
        ...(sizeValue ? {size: sizeValue} : {}),
        orient: ticksOrient,
        aria: false
      },
      positionPrefix: 'mid_box',
      extraEncoding: fiveSummaryTooltipEncoding
    })
  ];

  if (boxPlotType === 'min-max') {
    return {
      ...outerSpec,
      transform: (outerSpec.transform ?? []).concat(transform),
      layer: boxLayers
    };
  }

  // Tukey Box Plot

  const lowerBoxExpr = `datum["lower_box_${continuousAxisChannelDef.field}"]`;
  const upperBoxExpr = `datum["upper_box_${continuousAxisChannelDef.field}"]`;
  const iqrExpr = `(${upperBoxExpr} - ${lowerBoxExpr})`;
  const lowerWhiskerExpr = `${lowerBoxExpr} - ${extent} * ${iqrExpr}`;
  const upperWhiskerExpr = `${upperBoxExpr} + ${extent} * ${iqrExpr}`;
  const fieldExpr = `datum["${continuousAxisChannelDef.field}"]`;

  const joinaggregateTransform: JoinAggregateTransform = {
    joinaggregate: boxParamsQuartiles(continuousAxisChannelDef.field),
    groupby
  };

  const filteredWhiskerSpec: NormalizedLayerSpec = {
    transform: [
      {
        filter: `(${lowerWhiskerExpr} <= ${fieldExpr}) && (${fieldExpr} <= ${upperWhiskerExpr})`
      },
      {
        aggregate: [
          {
            op: 'min',
            field: continuousAxisChannelDef.field,
            as: `lower_whisker_${continuousAxisChannelDef.field}`
          },
          {
            op: 'max',
            field: continuousAxisChannelDef.field,
            as: `upper_whisker_${continuousAxisChannelDef.field}`
          },
          // preserve lower_box / upper_box
          {
            op: 'min',
            field: `lower_box_${continuousAxisChannelDef.field}`,
            as: `lower_box_${continuousAxisChannelDef.field}`
          },
          {
            op: 'max',
            field: `upper_box_${continuousAxisChannelDef.field}`,
            as: `upper_box_${continuousAxisChannelDef.field}`
          },
          ...aggregate
        ],
        groupby
      }
    ],
    layer: whiskerLayers
  };

  const {tooltip, ...encodingWithoutSizeColorContinuousAxisAndTooltip} = encodingWithoutSizeColorAndContinuousAxis;

  const {scale, axis} = continuousAxisChannelDef;
  const title = getTitle(continuousAxisChannelDef);
  const axisWithoutTitle = omit(axis, ['title']);

  const outlierLayersMixins = partLayerMixins<BoxPlotPartsMixins>(markDef, 'outliers', config.boxplot, {
    transform: [{filter: `(${fieldExpr} < ${lowerWhiskerExpr}) || (${fieldExpr} > ${upperWhiskerExpr})`}],
    mark: 'point',
    encoding: {
      [continuousAxis]: {
        field: continuousAxisChannelDef.field,
        type: continuousAxisChannelDef.type,
        ...(title !== undefined ? {title} : {}),
        ...(scale !== undefined ? {scale} : {}),
        // add axis without title since we already added the title above
        ...(isEmpty(axisWithoutTitle) ? {} : {axis: axisWithoutTitle})
      },
      ...encodingWithoutSizeColorContinuousAxisAndTooltip,
      ...(color ? {color} : {}),
      ...(customTooltipWithoutAggregatedField ? {tooltip: customTooltipWithoutAggregatedField} : {})
    }
  })[0];

  let filteredLayersMixins: NormalizedLayerSpec;
  const filteredLayersMixinsTransforms = [...bins, ...timeUnits, joinaggregateTransform];
  if (outlierLayersMixins) {
    filteredLayersMixins = {
      transform: filteredLayersMixinsTransforms,
      layer: [outlierLayersMixins, filteredWhiskerSpec]
    };
  } else {
    filteredLayersMixins = filteredWhiskerSpec;
    filteredLayersMixins.transform.unshift(...filteredLayersMixinsTransforms);
  }

  return {
    ...outerSpec,
    layer: [
      filteredLayersMixins,
      {
        // boxplot
        transform,
        layer: boxLayers
      }
    ]
  };
}

function boxParamsQuartiles(continousAxisField: string): AggregatedFieldDef[] {
  return [
    {
      op: 'q1',
      field: continousAxisField,
      as: `lower_box_${continousAxisField}`
    },
    {
      op: 'q3',
      field: continousAxisField,
      as: `upper_box_${continousAxisField}`
    }
  ];
}

function boxParams(
  spec: GenericUnitSpec<Encoding<string>, BoxPlot | BoxPlotDef>,
  extent: 'min-max' | number,
  config: Config
) {
  const orient = compositeMarkOrient(spec, BOXPLOT);
  const {continuousAxisChannelDef, continuousAxis} = compositeMarkContinuousAxis(spec, orient, BOXPLOT);
  const continuousFieldName: string = continuousAxisChannelDef.field;

  const boxPlotType = getBoxPlotType(extent);

  const boxplotSpecificAggregate: AggregatedFieldDef[] = [
    ...boxParamsQuartiles(continuousFieldName),
    {
      op: 'median',
      field: continuousFieldName,
      as: `mid_box_${continuousFieldName}`
    },
    {
      op: 'min',
      field: continuousFieldName,
      as: (boxPlotType === 'min-max' ? 'lower_whisker_' : 'min_') + continuousFieldName
    },
    {
      op: 'max',
      field: continuousFieldName,
      as: (boxPlotType === 'min-max' ? 'upper_whisker_' : 'max_') + continuousFieldName
    }
  ];

  const postAggregateCalculates: CalculateTransform[] =
    boxPlotType === 'min-max' || boxPlotType === 'tukey'
      ? []
      : [
          // This is for the  original k-IQR, which we do not expose
          {
            calculate: `datum["upper_box_${continuousFieldName}"] - datum["lower_box_${continuousFieldName}"]`,
            as: `iqr_${continuousFieldName}`
          },
          {
            calculate: `min(datum["upper_box_${continuousFieldName}"] + datum["iqr_${continuousFieldName}"] * ${extent}, datum["max_${continuousFieldName}"])`,
            as: `upper_whisker_${continuousFieldName}`
          },
          {
            calculate: `max(datum["lower_box_${continuousFieldName}"] - datum["iqr_${continuousFieldName}"] * ${extent}, datum["min_${continuousFieldName}"])`,
            as: `lower_whisker_${continuousFieldName}`
          }
        ];

  const {[continuousAxis]: oldContinuousAxisChannelDef, ...oldEncodingWithoutContinuousAxis} = spec.encoding;
  const {customTooltipWithoutAggregatedField, filteredEncoding} = filterTooltipWithAggregatedField(
    oldEncodingWithoutContinuousAxis
  );

  const {
    bins,
    timeUnits,
    aggregate,
    groupby,
    encoding: encodingWithoutContinuousAxis
  } = extractTransformsFromEncoding(filteredEncoding, config);

  const ticksOrient: Orientation = orient === 'vertical' ? 'horizontal' : 'vertical';
  const boxOrient: Orientation = orient;

  const transform: Transform[] = [
    ...bins,
    ...timeUnits,
    {
      aggregate: [...aggregate, ...boxplotSpecificAggregate],
      groupby
    },
    ...postAggregateCalculates
  ];

  return {
    bins,
    timeUnits,
    transform,
    groupby,
    aggregate,
    continuousAxisChannelDef,
    continuousAxis,
    encodingWithoutContinuousAxis,
    ticksOrient,
    boxOrient,
    customTooltipWithoutAggregatedField
  };
}
