import * as tslib_1 from "tslib";
import { isNumber, isObject } from 'vega-util';
import { extractTransformsFromEncoding } from '../encoding';
import * as log from '../log';
import { isMarkDef } from '../mark';
import { getFirstDefined, keys } from '../util';
import { compositeMarkContinuousAxis, compositeMarkOrient, filterUnsupportedChannels, makeCompositeAggregatePartFactory, partLayerMixins } from './common';
export var BOXPLOT = 'boxplot';
var BOXPLOT_PART_INDEX = {
    box: 1,
    median: 1,
    outliers: 1,
    rule: 1,
    ticks: 1
};
export var BOXPLOT_PARTS = keys(BOXPLOT_PART_INDEX);
var boxPlotSupportedChannels = ['x', 'y', 'color', 'detail', 'opacity', 'size'];
export function normalizeBoxPlot(spec, config) {
    var _a;
    spec = filterUnsupportedChannels(spec, boxPlotSupportedChannels, BOXPLOT);
    // TODO: use selection
    var mark = spec.mark, _encoding = spec.encoding, selection = spec.selection, _p = spec.projection, outerSpec = tslib_1.__rest(spec, ["mark", "encoding", "selection", "projection"]);
    var markDef = isMarkDef(mark) ? mark : { type: mark };
    // TODO(https://github.com/vega/vega-lite/issues/3702): add selection support
    if (selection) {
        log.warn(log.message.selectionNotSupported('boxplot'));
    }
    var extent = markDef.extent || config.boxplot.extent;
    var sizeValue = getFirstDefined(markDef.size, config.boxplot.size);
    var isMinMax = !isNumber(extent);
    var _b = boxParams(spec, extent, config), transform = _b.transform, continuousAxisChannelDef = _b.continuousAxisChannelDef, continuousAxis = _b.continuousAxis, groupby = _b.groupby, encodingWithoutContinuousAxis = _b.encodingWithoutContinuousAxis, tickOrient = _b.tickOrient;
    var color = encodingWithoutContinuousAxis.color, size = encodingWithoutContinuousAxis.size, encodingWithoutSizeColorAndContinuousAxis = tslib_1.__rest(encodingWithoutContinuousAxis, ["color", "size"]);
    var makeBoxPlotPart = function (sharedEncoding) {
        return makeCompositeAggregatePartFactory(markDef, continuousAxis, continuousAxisChannelDef, sharedEncoding, config.boxplot);
    };
    var makeBoxPlotExtent = makeBoxPlotPart(encodingWithoutSizeColorAndContinuousAxis);
    var makeBoxPlotBox = makeBoxPlotPart(encodingWithoutContinuousAxis);
    var makeBoxPlotMidTick = makeBoxPlotPart(tslib_1.__assign({}, encodingWithoutSizeColorAndContinuousAxis, (size ? { size: size } : {})));
    var endTick = { type: 'tick', color: 'black', opacity: 1, orient: tickOrient };
    var bar = tslib_1.__assign({ type: 'bar' }, (sizeValue ? { size: sizeValue } : {}));
    var midTick = tslib_1.__assign({ type: 'tick' }, (isObject(config.boxplot.median) && config.boxplot.median.color ? { color: config.boxplot.median.color } : {}), (sizeValue ? { size: sizeValue } : {}), { orient: tickOrient });
    var boxLayer = makeBoxPlotExtent('rule', 'rule', 'lower_whisker', 'lower_box').concat(makeBoxPlotExtent('rule', 'rule', 'upper_box', 'upper_whisker'), makeBoxPlotExtent('ticks', endTick, 'lower_whisker'), makeBoxPlotExtent('ticks', endTick, 'upper_whisker'), makeBoxPlotBox('box', bar, 'lower_box', 'upper_box'), makeBoxPlotMidTick('median', midTick, 'mid_box'));
    var outliersLayerMixins = [];
    if (!isMinMax) {
        var lowerBoxExpr = 'datum.lower_box_' + continuousAxisChannelDef.field;
        var upperBoxExpr = 'datum.upper_box_' + continuousAxisChannelDef.field;
        var iqrExpr = "(" + upperBoxExpr + " - " + lowerBoxExpr + ")";
        var lowerWhiskerExpr = lowerBoxExpr + " - " + extent + " * " + iqrExpr;
        var upperWhiskerExpr = upperBoxExpr + " + " + extent + " * " + iqrExpr;
        var fieldExpr = "datum." + continuousAxisChannelDef.field;
        outliersLayerMixins = partLayerMixins(markDef, 'outliers', config.boxplot, {
            transform: [
                {
                    window: boxParamsQuartiles(continuousAxisChannelDef.field),
                    frame: [null, null],
                    groupby: groupby
                },
                {
                    filter: "(" + fieldExpr + " < " + lowerWhiskerExpr + ") || (" + fieldExpr + " > " + upperWhiskerExpr + ")"
                }
            ],
            mark: 'point',
            encoding: tslib_1.__assign((_a = {}, _a[continuousAxis] = {
                field: continuousAxisChannelDef.field,
                type: continuousAxisChannelDef.type
            }, _a), encodingWithoutSizeColorAndContinuousAxis)
        });
    }
    if (outliersLayerMixins.length > 0) {
        // tukey box plot with outliers included
        return tslib_1.__assign({}, outerSpec, { layer: [
                {
                    // boxplot
                    transform: transform,
                    layer: boxLayer
                }
            ].concat(outliersLayerMixins) });
    }
    return tslib_1.__assign({}, outerSpec, { transform: (outerSpec.transform || []).concat(transform), layer: boxLayer });
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
    var orient = compositeMarkOrient(spec, BOXPLOT);
    var _a = compositeMarkContinuousAxis(spec, orient, BOXPLOT), continuousAxisChannelDef = _a.continuousAxisChannelDef, continuousAxis = _a.continuousAxis;
    var continuousFieldName = continuousAxisChannelDef.field;
    var isMinMax = !isNumber(extent);
    var boxplotSpecificAggregate = boxParamsQuartiles(continuousFieldName).concat([
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
    ]);
    var postAggregateCalculates = isMinMax
        ? []
        : [
            {
                calculate: "datum.upper_box_" + continuousFieldName + " - datum.lower_box_" + continuousFieldName,
                as: 'iqr_' + continuousFieldName
            },
            {
                calculate: "min(datum.upper_box_" + continuousFieldName + " + datum.iqr_" + continuousFieldName + " * " + extent + ", datum.max_" + continuousFieldName + ")",
                as: 'upper_whisker_' + continuousFieldName
            },
            {
                calculate: "max(datum.lower_box_" + continuousFieldName + " - datum.iqr_" + continuousFieldName + " * " + extent + ", datum.min_" + continuousFieldName + ")",
                as: 'lower_whisker_' + continuousFieldName
            }
        ];
    var _b = spec.encoding, _c = continuousAxis, oldContinuousAxisChannelDef = _b[_c], oldEncodingWithoutContinuousAxis = tslib_1.__rest(_b, [typeof _c === "symbol" ? _c : _c + ""]);
    var _d = extractTransformsFromEncoding(oldEncodingWithoutContinuousAxis, config), bins = _d.bins, timeUnits = _d.timeUnits, aggregate = _d.aggregate, groupby = _d.groupby, encodingWithoutContinuousAxis = _d.encoding;
    var tickOrient = orient === 'vertical' ? 'horizontal' : 'vertical';
    return {
        transform: bins.concat(timeUnits, [
            {
                aggregate: aggregate.concat(boxplotSpecificAggregate),
                groupby: groupby
            }
        ], postAggregateCalculates),
        groupby: groupby,
        continuousAxisChannelDef: continuousAxisChannelDef,
        continuousAxis: continuousAxis,
        encodingWithoutContinuousAxis: encodingWithoutContinuousAxis,
        tickOrient: tickOrient
    };
}
//# sourceMappingURL=boxplot.js.map