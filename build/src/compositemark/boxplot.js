import * as tslib_1 from "tslib";
import { isNumber, isObject } from 'vega-util';
import { extractTransformsFromEncoding } from '../encoding';
import * as log from '../log';
import { isMarkDef } from '../mark';
import { getFirstDefined, keys } from '../util';
import { compositeMarkContinuousAxis, compositeMarkOrient, filterUnsupportedChannels, getCompositeMarkTooltip, makeCompositeAggregatePartFactory, partLayerMixins } from './common';
export const BOXPLOT = 'boxplot';
const BOXPLOT_PART_INDEX = {
    box: 1,
    median: 1,
    outliers: 1,
    rule: 1,
    ticks: 1
};
export const BOXPLOT_PARTS = keys(BOXPLOT_PART_INDEX);
const boxPlotSupportedChannels = ['x', 'y', 'color', 'detail', 'opacity', 'size'];
export function normalizeBoxPlot(spec, config) {
    spec = filterUnsupportedChannels(spec, boxPlotSupportedChannels, BOXPLOT);
    // TODO: use selection
    const { mark, encoding: _encoding, selection, projection: _p } = spec, outerSpec = tslib_1.__rest(spec, ["mark", "encoding", "selection", "projection"]);
    const markDef = isMarkDef(mark) ? mark : { type: mark };
    // TODO(https://github.com/vega/vega-lite/issues/3702): add selection support
    if (selection) {
        log.warn(log.message.selectionNotSupported('boxplot'));
    }
    const extent = markDef.extent || config.boxplot.extent;
    const sizeValue = getFirstDefined(markDef.size, config.boxplot.size);
    const isMinMax = !isNumber(extent);
    const { transform, continuousAxisChannelDef, continuousAxis, groupby, encodingWithoutContinuousAxis, ticksOrient, tooltipEncoding } = boxParams(spec, extent, config);
    const { color, size } = encodingWithoutContinuousAxis, encodingWithoutSizeColorAndContinuousAxis = tslib_1.__rest(encodingWithoutContinuousAxis, ["color", "size"]);
    const makeBoxPlotPart = (sharedEncoding) => {
        return makeCompositeAggregatePartFactory(markDef, continuousAxis, continuousAxisChannelDef, sharedEncoding, config.boxplot);
    };
    const makeBoxPlotExtent = makeBoxPlotPart(encodingWithoutSizeColorAndContinuousAxis);
    const makeBoxPlotBox = makeBoxPlotPart(encodingWithoutContinuousAxis);
    const makeBoxPlotMidTick = makeBoxPlotPart(Object.assign({}, encodingWithoutSizeColorAndContinuousAxis, (size ? { size } : {})));
    const endTick = { type: 'tick', color: 'black', opacity: 1, orient: ticksOrient };
    const bar = Object.assign({ type: 'bar' }, (sizeValue ? { size: sizeValue } : {}));
    const midTick = Object.assign({ type: 'tick' }, (isObject(config.boxplot.median) && config.boxplot.median.color ? { color: config.boxplot.median.color } : {}), (sizeValue ? { size: sizeValue } : {}), { orient: ticksOrient });
    // TODO: support hiding certain mark parts
    const boxLayer = [
        ...makeBoxPlotExtent({
            partName: 'rule',
            mark: 'rule',
            positionPrefix: 'lower_whisker',
            endPositionPrefix: 'lower_box',
            extraEncoding: tooltipEncoding
        }),
        ...makeBoxPlotExtent({
            partName: 'rule',
            mark: 'rule',
            positionPrefix: 'upper_box',
            endPositionPrefix: 'upper_whisker',
            extraEncoding: tooltipEncoding
        }),
        ...makeBoxPlotExtent({
            partName: 'ticks',
            mark: endTick,
            positionPrefix: 'lower_whisker',
            extraEncoding: tooltipEncoding
        }),
        ...makeBoxPlotExtent({
            partName: 'ticks',
            mark: endTick,
            positionPrefix: 'upper_whisker',
            extraEncoding: tooltipEncoding
        }),
        ...makeBoxPlotBox({
            partName: 'box',
            mark: bar,
            positionPrefix: 'lower_box',
            endPositionPrefix: 'upper_box',
            extraEncoding: tooltipEncoding
        }),
        ...makeBoxPlotMidTick({
            partName: 'median',
            mark: midTick,
            positionPrefix: 'mid_box',
            extraEncoding: tooltipEncoding
        })
    ];
    let outliersLayerMixins = [];
    if (!isMinMax) {
        const lowerBoxExpr = 'datum.lower_box_' + continuousAxisChannelDef.field;
        const upperBoxExpr = 'datum.upper_box_' + continuousAxisChannelDef.field;
        const iqrExpr = `(${upperBoxExpr} - ${lowerBoxExpr})`;
        const lowerWhiskerExpr = `${lowerBoxExpr} - ${extent} * ${iqrExpr}`;
        const upperWhiskerExpr = `${upperBoxExpr} + ${extent} * ${iqrExpr}`;
        const fieldExpr = `datum.${continuousAxisChannelDef.field}`;
        outliersLayerMixins = partLayerMixins(markDef, 'outliers', config.boxplot, {
            transform: [
                {
                    window: boxParamsQuartiles(continuousAxisChannelDef.field),
                    frame: [null, null],
                    groupby
                },
                {
                    filter: `(${fieldExpr} < ${lowerWhiskerExpr}) || (${fieldExpr} > ${upperWhiskerExpr})`
                }
            ],
            mark: 'point',
            encoding: Object.assign({ [continuousAxis]: {
                    field: continuousAxisChannelDef.field,
                    type: continuousAxisChannelDef.type
                } }, encodingWithoutSizeColorAndContinuousAxis)
        });
    }
    if (outliersLayerMixins.length > 0) {
        // tukey box plot with outliers included
        return Object.assign({}, outerSpec, { layer: [
                {
                    // boxplot
                    transform,
                    layer: boxLayer
                },
                ...outliersLayerMixins
            ] });
    }
    return Object.assign({}, outerSpec, { transform: (outerSpec.transform || []).concat(transform), layer: boxLayer });
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
    const isMinMax = !isNumber(extent);
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
            as: (isMinMax ? 'lower_whisker_' : 'min_') + continuousFieldName
        },
        {
            op: 'max',
            field: continuousFieldName,
            as: (isMinMax ? 'upper_whisker_' : 'max_') + continuousFieldName
        }
    ];
    const postAggregateCalculates = isMinMax
        ? []
        : [
            {
                calculate: `datum.upper_box_${continuousFieldName} - datum.lower_box_${continuousFieldName}`,
                as: 'iqr_' + continuousFieldName
            },
            {
                calculate: `min(datum.upper_box_${continuousFieldName} + datum.iqr_${continuousFieldName} * ${extent}, datum.max_${continuousFieldName})`,
                as: 'upper_whisker_' + continuousFieldName
            },
            {
                calculate: `max(datum.lower_box_${continuousFieldName} - datum.iqr_${continuousFieldName} * ${extent}, datum.min_${continuousFieldName})`,
                as: 'lower_whisker_' + continuousFieldName
            }
        ];
    const _a = spec.encoding, _b = continuousAxis, oldContinuousAxisChannelDef = _a[_b], oldEncodingWithoutContinuousAxis = tslib_1.__rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
    const { bins, timeUnits, aggregate, groupby, encoding: encodingWithoutContinuousAxis } = extractTransformsFromEncoding(oldEncodingWithoutContinuousAxis, config);
    const ticksOrient = orient === 'vertical' ? 'horizontal' : 'vertical';
    const tooltipSummary = [
        { fieldPrefix: 'upper_whisker_', titlePrefix: isMinMax ? 'Max' : 'Upper Whisker' },
        { fieldPrefix: 'upper_box_', titlePrefix: 'Q3' },
        { fieldPrefix: 'mid_box_', titlePrefix: 'Median' },
        { fieldPrefix: 'lower_box_', titlePrefix: 'Q1' },
        { fieldPrefix: 'lower_whisker_', titlePrefix: isMinMax ? 'Min' : 'Lower Whisker' }
    ];
    const tooltipEncoding = getCompositeMarkTooltip(tooltipSummary, continuousAxisChannelDef, encodingWithoutContinuousAxis);
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
        continuousAxisChannelDef,
        continuousAxis,
        encodingWithoutContinuousAxis,
        ticksOrient,
        tooltipEncoding
    };
}
//# sourceMappingURL=boxplot.js.map