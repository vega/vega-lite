"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var encoding_1 = require("../encoding");
var log = tslib_1.__importStar(require("../log"));
var mark_1 = require("../mark");
var util_1 = require("../util");
var common_1 = require("./common");
exports.BOXPLOT = 'boxplot';
var BOXPLOT_PART_INDEX = {
    box: 1,
    median: 1,
    outliers: 1,
    rule: 1,
    ticks: 1
};
exports.BOXPLOT_PARTS = util_1.keys(BOXPLOT_PART_INDEX);
var boxPlotSupportedChannels = ['x', 'y', 'color', 'detail', 'opacity', 'size'];
function normalizeBoxPlot(spec, config) {
    var _a;
    spec = common_1.filterUnsupportedChannels(spec, boxPlotSupportedChannels, exports.BOXPLOT);
    // TODO: use selection
    var mark = spec.mark, _encoding = spec.encoding, selection = spec.selection, _p = spec.projection, outerSpec = tslib_1.__rest(spec, ["mark", "encoding", "selection", "projection"]);
    var markDef = mark_1.isMarkDef(mark) ? mark : { type: mark };
    // TODO(https://github.com/vega/vega-lite/issues/3702): add selection support
    if (selection) {
        log.warn(log.message.selectionNotSupported('boxplot'));
    }
    var extent = markDef.extent || config.boxplot.extent;
    var sizeValue = util_1.getFirstDefined(markDef.size, config.boxplot.size);
    var isMinMax = !vega_util_1.isNumber(extent);
    var _b = boxParams(spec, extent, config), transform = _b.transform, continuousAxisChannelDef = _b.continuousAxisChannelDef, continuousAxis = _b.continuousAxis, groupby = _b.groupby, encodingWithoutContinuousAxis = _b.encodingWithoutContinuousAxis, tickOrient = _b.tickOrient;
    var color = encodingWithoutContinuousAxis.color, size = encodingWithoutContinuousAxis.size, encodingWithoutSizeColorAndContinuousAxis = tslib_1.__rest(encodingWithoutContinuousAxis, ["color", "size"]);
    var makeBoxPlotPart = function (sharedEncoding) {
        return common_1.makeCompositeAggregatePartFactory(markDef, continuousAxis, continuousAxisChannelDef, sharedEncoding, config.boxplot);
    };
    var makeBoxPlotExtent = makeBoxPlotPart(encodingWithoutSizeColorAndContinuousAxis);
    var makeBoxPlotBox = makeBoxPlotPart(encodingWithoutContinuousAxis);
    var makeBoxPlotMidTick = makeBoxPlotPart(tslib_1.__assign({}, encodingWithoutSizeColorAndContinuousAxis, (size ? { size: size } : {})));
    var endTick = { type: 'tick', color: 'black', opacity: 1, orient: tickOrient };
    var bar = tslib_1.__assign({ type: 'bar' }, (sizeValue ? { size: sizeValue } : {}));
    var midTick = tslib_1.__assign({ type: 'tick' }, (vega_util_1.isObject(config.boxplot.median) && config.boxplot.median.color ? { color: config.boxplot.median.color } : {}), (sizeValue ? { size: sizeValue } : {}), { orient: tickOrient });
    var boxLayer = makeBoxPlotExtent('rule', 'rule', 'lower_whisker', 'lower_box').concat(makeBoxPlotExtent('rule', 'rule', 'upper_box', 'upper_whisker'), makeBoxPlotExtent('ticks', endTick, 'lower_whisker'), makeBoxPlotExtent('ticks', endTick, 'upper_whisker'), makeBoxPlotBox('box', bar, 'lower_box', 'upper_box'), makeBoxPlotMidTick('median', midTick, 'mid_box'));
    var outliersLayerMixins = [];
    if (!isMinMax) {
        var lowerBoxExpr = 'datum.lower_box_' + continuousAxisChannelDef.field;
        var upperBoxExpr = 'datum.upper_box_' + continuousAxisChannelDef.field;
        var iqrExpr = "(" + upperBoxExpr + " - " + lowerBoxExpr + ")";
        var lowerWhiskerExpr = lowerBoxExpr + " - " + extent + " * " + iqrExpr;
        var upperWhiskerExpr = upperBoxExpr + " + " + extent + " * " + iqrExpr;
        var fieldExpr = "datum." + continuousAxisChannelDef.field;
        outliersLayerMixins = common_1.partLayerMixins(markDef, 'outliers', config.boxplot, {
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
    return tslib_1.__assign({}, outerSpec, { transform: transform, layer: boxLayer });
}
exports.normalizeBoxPlot = normalizeBoxPlot;
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
    var orient = common_1.compositeMarkOrient(spec, exports.BOXPLOT);
    var _a = common_1.compositeMarkContinuousAxis(spec, orient, exports.BOXPLOT), continuousAxisChannelDef = _a.continuousAxisChannelDef, continuousAxis = _a.continuousAxis;
    var continuousFieldName = continuousAxisChannelDef.field;
    var isMinMax = !vega_util_1.isNumber(extent);
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
    var _d = encoding_1.extractTransformsFromEncoding(oldEncodingWithoutContinuousAxis, config), bins = _d.bins, timeUnits = _d.timeUnits, aggregate = _d.aggregate, groupby = _d.groupby, encodingWithoutContinuousAxis = _d.encoding;
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