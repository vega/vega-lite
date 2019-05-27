import * as tslib_1 from "tslib";
import { isNumber, isObject } from 'vega-util';
import { extractTransformsFromEncoding } from '../encoding';
import * as log from '../log';
import { isMarkDef } from '../mark';
import { getFirstDefined, keys } from '../util';
import { CompositeMarkNormalizer } from './base';
import { compositeMarkContinuousAxis, compositeMarkOrient, filterTooltipWithAggregatedField, getCompositeMarkTooltip, makeCompositeAggregatePartFactory, partLayerMixins } from './common';
export const BOXPLOT = 'boxplot';
const BOXPLOT_PART_INDEX = {
    box: 1,
    median: 1,
    outliers: 1,
    rule: 1,
    ticks: 1
};
export const BOXPLOT_PARTS = keys(BOXPLOT_PART_INDEX);
export const boxPlotNormalizer = new CompositeMarkNormalizer(BOXPLOT, normalizeBoxPlot);
export function getBoxPlotType(extent) {
    if (isNumber(extent)) {
        return 'tukey';
    }
    // Ham: If we ever want to, we could add another extent syntax `{kIQR: number}` for the original [Q1-k*IQR, Q3+k*IQR] whisker and call this boxPlotType = `kIQR`.  However, I'm not exposing this for now.
    return extent;
}
export function normalizeBoxPlot(spec, { config }) {
    // TODO: use selection
    const { mark, encoding: _encoding, selection, projection: _p } = spec, outerSpec = tslib_1.__rest(spec, ["mark", "encoding", "selection", "projection"]);
    const markDef = isMarkDef(mark) ? mark : { type: mark };
    // TODO(https://github.com/vega/vega-lite/issues/3702): add selection support
    if (selection) {
        log.warn(log.message.selectionNotSupported('boxplot'));
    }
    const extent = markDef.extent || config.boxplot.extent;
    const sizeValue = getFirstDefined(markDef.size, config.boxplot.size);
    const boxPlotType = getBoxPlotType(extent);
    const { transform, continuousAxisChannelDef, continuousAxis, groupby, aggregate, encodingWithoutContinuousAxis, ticksOrient, customTooltipWithoutAggregatedField } = boxParams(spec, extent, config);
    const { color, size } = encodingWithoutContinuousAxis, encodingWithoutSizeColorAndContinuousAxis = tslib_1.__rest(encodingWithoutContinuousAxis, ["color", "size"]);
    const makeBoxPlotPart = (sharedEncoding) => {
        return makeCompositeAggregatePartFactory(markDef, continuousAxis, continuousAxisChannelDef, sharedEncoding, config.boxplot);
    };
    const makeBoxPlotExtent = makeBoxPlotPart(encodingWithoutSizeColorAndContinuousAxis);
    const makeBoxPlotBox = makeBoxPlotPart(encodingWithoutContinuousAxis);
    const makeBoxPlotMidTick = makeBoxPlotPart(Object.assign({}, encodingWithoutSizeColorAndContinuousAxis, (size ? { size } : {})));
    const fiveSummaryTooltipEncoding = getCompositeMarkTooltip([
        { fieldPrefix: boxPlotType === 'min-max' ? 'upper_whisker_' : 'max_', titlePrefix: 'Max' },
        { fieldPrefix: 'upper_box_', titlePrefix: 'Q3' },
        { fieldPrefix: 'mid_box_', titlePrefix: 'Median' },
        { fieldPrefix: 'lower_box_', titlePrefix: 'Q1' },
        { fieldPrefix: boxPlotType === 'min-max' ? 'lower_whisker_' : 'min_', titlePrefix: 'Min' }
    ], continuousAxisChannelDef, encodingWithoutContinuousAxis);
    // ## Whisker Layers
    const endTick = { type: 'tick', color: 'black', opacity: 1, orient: ticksOrient };
    const whiskerTooltipEncoding = boxPlotType === 'min-max'
        ? fiveSummaryTooltipEncoding // for min-max, show five-summary tooltip for whisker
        : // for tukey / k-IQR, just show upper/lower-whisker
            getCompositeMarkTooltip([
                { fieldPrefix: 'upper_whisker_', titlePrefix: 'Upper Whisker' },
                { fieldPrefix: 'lower_whisker_', titlePrefix: 'Lower Whisker' }
            ], continuousAxisChannelDef, encodingWithoutContinuousAxis);
    const whiskerLayers = [
        ...makeBoxPlotExtent({
            partName: 'rule',
            mark: 'rule',
            positionPrefix: 'lower_whisker',
            endPositionPrefix: 'lower_box',
            extraEncoding: whiskerTooltipEncoding
        }),
        ...makeBoxPlotExtent({
            partName: 'rule',
            mark: 'rule',
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
    const boxLayers = [
        ...(boxPlotType !== 'tukey' ? whiskerLayers : []),
        ...makeBoxPlotBox({
            partName: 'box',
            mark: Object.assign({ type: 'bar' }, (sizeValue ? { size: sizeValue } : {})),
            positionPrefix: 'lower_box',
            endPositionPrefix: 'upper_box',
            extraEncoding: fiveSummaryTooltipEncoding
        }),
        ...makeBoxPlotMidTick({
            partName: 'median',
            mark: Object.assign({ type: 'tick' }, (isObject(config.boxplot.median) && config.boxplot.median.color ? { color: config.boxplot.median.color } : {}), (sizeValue ? { size: sizeValue } : {}), { orient: ticksOrient }),
            positionPrefix: 'mid_box',
            extraEncoding: fiveSummaryTooltipEncoding
        })
    ];
    // ## Filtered Layers
    let filteredLayersMixins;
    if (boxPlotType !== 'min-max') {
        const lowerBoxExpr = `datum["lower_box_${continuousAxisChannelDef.field}"]`;
        const upperBoxExpr = `datum["upper_box_${continuousAxisChannelDef.field}"]`;
        const iqrExpr = `(${upperBoxExpr} - ${lowerBoxExpr})`;
        const lowerWhiskerExpr = `${lowerBoxExpr} - ${extent} * ${iqrExpr}`;
        const upperWhiskerExpr = `${upperBoxExpr} + ${extent} * ${iqrExpr}`;
        const fieldExpr = `datum["${continuousAxisChannelDef.field}"]`;
        const joinaggregateTransform = {
            joinaggregate: boxParamsQuartiles(continuousAxisChannelDef.field),
            groupby
        };
        let filteredWhiskerSpec = undefined;
        if (boxPlotType === 'tukey') {
            filteredWhiskerSpec = {
                transform: [
                    {
                        filter: `(${lowerWhiskerExpr} <= ${fieldExpr}) && (${fieldExpr} <= ${upperWhiskerExpr})`
                    },
                    {
                        aggregate: [
                            {
                                op: 'min',
                                field: continuousAxisChannelDef.field,
                                as: 'lower_whisker_' + continuousAxisChannelDef.field
                            },
                            {
                                op: 'max',
                                field: continuousAxisChannelDef.field,
                                as: 'upper_whisker_' + continuousAxisChannelDef.field
                            },
                            // preserve lower_box / upper_box
                            {
                                op: 'min',
                                field: 'lower_box_' + continuousAxisChannelDef.field,
                                as: 'lower_box_' + continuousAxisChannelDef.field
                            },
                            {
                                op: 'max',
                                field: 'upper_box_' + continuousAxisChannelDef.field,
                                as: 'upper_box_' + continuousAxisChannelDef.field
                            },
                            ...aggregate
                        ],
                        groupby
                    }
                ],
                layer: whiskerLayers
            };
        }
        const { tooltip } = encodingWithoutSizeColorAndContinuousAxis, encodingWithoutSizeColorContinuousAxisAndTooltip = tslib_1.__rest(encodingWithoutSizeColorAndContinuousAxis, ["tooltip"]);
        const outlierLayersMixins = partLayerMixins(markDef, 'outliers', config.boxplot, {
            transform: [{ filter: `(${fieldExpr} < ${lowerWhiskerExpr}) || (${fieldExpr} > ${upperWhiskerExpr})` }],
            mark: 'point',
            encoding: Object.assign({ [continuousAxis]: {
                    field: continuousAxisChannelDef.field,
                    type: continuousAxisChannelDef.type
                } }, encodingWithoutSizeColorContinuousAxisAndTooltip, (customTooltipWithoutAggregatedField ? { tooltip: customTooltipWithoutAggregatedField } : {}))
        })[0];
        if (outlierLayersMixins && filteredWhiskerSpec) {
            filteredLayersMixins = {
                transform: [joinaggregateTransform],
                layer: [outlierLayersMixins, filteredWhiskerSpec]
            };
        }
        else if (outlierLayersMixins) {
            filteredLayersMixins = outlierLayersMixins;
            filteredLayersMixins.transform.unshift(joinaggregateTransform);
        }
        else if (filteredWhiskerSpec) {
            filteredLayersMixins = filteredWhiskerSpec;
            filteredLayersMixins.transform.unshift(joinaggregateTransform);
        }
    }
    if (filteredLayersMixins) {
        // tukey box plot with outliers included
        return Object.assign({}, outerSpec, { layer: [
                ...(filteredLayersMixins ? [filteredLayersMixins] : []),
                {
                    // boxplot
                    transform,
                    layer: boxLayers
                }
            ] });
    }
    return Object.assign({}, outerSpec, { transform: (outerSpec.transform || []).concat(transform), layer: boxLayers });
}
function boxParamsQuartiles(continousAxisField) {
    return [
        {
            op: 'q1',
            field: continousAxisField,
            as: 'lower_box_' + continousAxisField
        },
        {
            op: 'q3',
            field: continousAxisField,
            as: 'upper_box_' + continousAxisField
        }
    ];
}
function boxParams(spec, extent, config) {
    const orient = compositeMarkOrient(spec, BOXPLOT);
    const { continuousAxisChannelDef, continuousAxis } = compositeMarkContinuousAxis(spec, orient, BOXPLOT);
    const continuousFieldName = continuousAxisChannelDef.field;
    const boxPlotType = getBoxPlotType(extent);
    const boxplotSpecificAggregate = [
        ...boxParamsQuartiles(continuousFieldName),
        {
            op: 'median',
            field: continuousFieldName,
            as: 'mid_box_' + continuousFieldName
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
    const postAggregateCalculates = boxPlotType === 'min-max' || boxPlotType === 'tukey'
        ? []
        : [
            // This is for the  original k-IQR, which we do not expose
            {
                calculate: `datum["upper_box_${continuousFieldName}"] - datum["lower_box_${continuousFieldName}"]`,
                as: 'iqr_' + continuousFieldName
            },
            {
                calculate: `min(datum["upper_box_${continuousFieldName}"] + datum["iqr_${continuousFieldName}"] * ${extent}, datum["max_${continuousFieldName}"])`,
                as: 'upper_whisker_' + continuousFieldName
            },
            {
                calculate: `max(datum["lower_box_${continuousFieldName}"] - datum["iqr_${continuousFieldName}"] * ${extent}, datum["min_${continuousFieldName}"])`,
                as: 'lower_whisker_' + continuousFieldName
            }
        ];
    const _a = spec.encoding, _b = continuousAxis, oldContinuousAxisChannelDef = _a[_b], oldEncodingWithoutContinuousAxis = tslib_1.__rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
    const { customTooltipWithoutAggregatedField, filteredEncoding } = filterTooltipWithAggregatedField(oldEncodingWithoutContinuousAxis);
    const { bins, timeUnits, aggregate, groupby, encoding: encodingWithoutContinuousAxis } = extractTransformsFromEncoding(filteredEncoding, config);
    const ticksOrient = orient === 'vertical' ? 'horizontal' : 'vertical';
    return {
        transform: [
            ...bins,
            ...timeUnits,
            {
                aggregate: [...aggregate, ...boxplotSpecificAggregate],
                groupby
            },
            ...postAggregateCalculates
        ],
        groupby,
        aggregate,
        continuousAxisChannelDef,
        continuousAxis,
        encodingWithoutContinuousAxis,
        ticksOrient,
        customTooltipWithoutAggregatedField
    };
}
//# sourceMappingURL=boxplot.js.map