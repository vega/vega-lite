"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var encoding_1 = require("../encoding");
var encoding_2 = require("./../encoding");
var fielddef_1 = require("./../fielddef");
var log = require("./../log");
var common_1 = require("./common");
exports.BOXPLOT = 'box-plot';
function isBoxPlotDef(mark) {
    return !!mark['type'];
}
exports.isBoxPlotDef = isBoxPlotDef;
exports.BOXPLOT_STYLES = ['boxWhisker', 'box', 'boxMid'];
exports.VL_ONLY_BOXPLOT_CONFIG_PROPERTY_INDEX = {
    box: ['size', 'color'],
    boxWhisker: ['color'],
    boxMid: ['color']
};
var supportedChannels = ['x', 'y', 'color', 'detail', 'opacity', 'size'];
function filterUnsupportedChannels(spec) {
    return tslib_1.__assign({}, spec, { encoding: encoding_1.reduce(spec.encoding, function (newEncoding, fieldDef, channel) {
            if (supportedChannels.indexOf(channel) > -1) {
                newEncoding[channel] = fieldDef;
            }
            else {
                log.warn(log.message.incompatibleChannel(channel, exports.BOXPLOT));
            }
            return newEncoding;
        }, {}) });
}
exports.filterUnsupportedChannels = filterUnsupportedChannels;
function normalizeBoxPlot(spec, config) {
    spec = filterUnsupportedChannels(spec);
    // TODO: use selection
    var mark = spec.mark, encoding = spec.encoding, selection = spec.selection, outerSpec = tslib_1.__rest(spec, ["mark", "encoding", "selection"]);
    var kIQRScalar = undefined;
    if (isBoxPlotDef(mark)) {
        if (mark.extent) {
            if (vega_util_1.isNumber(mark.extent)) {
                kIQRScalar = mark.extent;
            }
        }
    }
    var orient = boxOrient(spec);
    var _a = boxParams(spec, orient, kIQRScalar), transform = _a.transform, continuousAxisChannelDef = _a.continuousAxisChannelDef, continuousAxis = _a.continuousAxis, encodingWithoutContinuousAxis = _a.encodingWithoutContinuousAxis;
    var color = encodingWithoutContinuousAxis.color, size = encodingWithoutContinuousAxis.size, encodingWithoutSizeColorAndContinuousAxis = tslib_1.__rest(encodingWithoutContinuousAxis, ["color", "size"]);
    // Size encoding or the default config.box.size is applied to box and boxMid
    var sizeMixins = size ? { size: size } : common_1.getMarkSpecificConfigMixins(config.box, 'size');
    var continuousAxisScaleAndAxis = {};
    if (continuousAxisChannelDef.scale) {
        continuousAxisScaleAndAxis['scale'] = continuousAxisChannelDef.scale;
    }
    if (continuousAxisChannelDef.axis) {
        continuousAxisScaleAndAxis['axis'] = continuousAxisChannelDef.axis;
    }
    return tslib_1.__assign({}, outerSpec, { transform: transform, layer: [
            {
                mark: {
                    type: 'rule',
                    style: 'boxWhisker'
                },
                encoding: tslib_1.__assign((_b = {}, _b[continuousAxis] = tslib_1.__assign({ field: 'lowerWhisker', type: continuousAxisChannelDef.type }, continuousAxisScaleAndAxis), _b[continuousAxis + '2'] = {
                    field: 'lowerBox',
                    type: continuousAxisChannelDef.type
                }, _b), encodingWithoutSizeColorAndContinuousAxis, common_1.getMarkSpecificConfigMixins(config.boxWhisker, 'color'))
            }, {
                mark: {
                    type: 'rule',
                    style: 'boxWhisker'
                },
                encoding: tslib_1.__assign((_c = {}, _c[continuousAxis] = {
                    field: 'upperBox',
                    type: continuousAxisChannelDef.type
                }, _c[continuousAxis + '2'] = {
                    field: 'upperWhisker',
                    type: continuousAxisChannelDef.type
                }, _c), encodingWithoutSizeColorAndContinuousAxis, common_1.getMarkSpecificConfigMixins(config.boxWhisker, 'color'))
            },
            tslib_1.__assign({}, (selection ? { selection: selection } : {}), { mark: {
                    type: 'bar',
                    style: 'box'
                }, encoding: tslib_1.__assign((_d = {}, _d[continuousAxis] = {
                    field: 'lowerBox',
                    type: continuousAxisChannelDef.type
                }, _d[continuousAxis + '2'] = {
                    field: 'upperBox',
                    type: continuousAxisChannelDef.type
                }, _d), encodingWithoutContinuousAxis, (encodingWithoutContinuousAxis.color ? {} : common_1.getMarkSpecificConfigMixins(config.box, 'color')), sizeMixins) }),
            {
                mark: {
                    type: 'tick',
                    style: 'boxMid'
                },
                encoding: tslib_1.__assign((_e = {}, _e[continuousAxis] = {
                    field: 'midBox',
                    type: continuousAxisChannelDef.type
                }, _e), encodingWithoutSizeColorAndContinuousAxis, common_1.getMarkSpecificConfigMixins(config.boxMid, 'color'), sizeMixins)
            }
        ] });
    var _b, _c, _d, _e;
}
exports.normalizeBoxPlot = normalizeBoxPlot;
function boxOrient(spec) {
    var mark = spec.mark, encoding = spec.encoding, _outerSpec = tslib_1.__rest(spec, ["mark", "encoding"]);
    if (fielddef_1.isFieldDef(encoding.x) && fielddef_1.isContinuous(encoding.x)) {
        // x is continuous
        if (fielddef_1.isFieldDef(encoding.y) && fielddef_1.isContinuous(encoding.y)) {
            // both x and y are continuous
            if (encoding.x.aggregate === undefined && encoding.y.aggregate === exports.BOXPLOT) {
                return 'vertical';
            }
            else if (encoding.y.aggregate === undefined && encoding.x.aggregate === exports.BOXPLOT) {
                return 'horizontal';
            }
            else if (encoding.x.aggregate === exports.BOXPLOT && encoding.y.aggregate === exports.BOXPLOT) {
                throw new Error('Both x and y cannot have aggregate');
            }
            else {
                if (isBoxPlotDef(mark) && mark.orient) {
                    return mark.orient;
                }
                // default orientation = vertical
                return 'vertical';
            }
        }
        // x is continuous but y is not
        return 'horizontal';
    }
    else if (fielddef_1.isFieldDef(encoding.y) && fielddef_1.isContinuous(encoding.y)) {
        // y is continuous but x is not
        return 'vertical';
    }
    else {
        // Neither x nor y is continuous.
        throw new Error('Need a valid continuous axis for boxplots');
    }
}
function boxContinousAxis(spec, orient) {
    var mark = spec.mark, encoding = spec.encoding, _outerSpec = tslib_1.__rest(spec, ["mark", "encoding"]);
    var continuousAxisChannelDef;
    var continuousAxis;
    if (orient === 'vertical') {
        continuousAxis = 'y';
        continuousAxisChannelDef = encoding.y; // Safe to cast because if y is not continous fielddef, the orient would not be vertical.
    }
    else {
        continuousAxis = 'x';
        continuousAxisChannelDef = encoding.x; // Safe to cast because if x is not continous fielddef, the orient would not be horizontal.
    }
    if (continuousAxisChannelDef && continuousAxisChannelDef.aggregate) {
        var aggregate = continuousAxisChannelDef.aggregate, continuousAxisWithoutAggregate = tslib_1.__rest(continuousAxisChannelDef, ["aggregate"]);
        if (aggregate !== exports.BOXPLOT) {
            log.warn("Continuous axis should not have customized aggregation function " + aggregate);
        }
        continuousAxisChannelDef = continuousAxisWithoutAggregate;
    }
    return {
        continuousAxisChannelDef: continuousAxisChannelDef,
        continuousAxis: continuousAxis
    };
}
function boxParams(spec, orient, kIQRScalar) {
    var _a = boxContinousAxis(spec, orient), continuousAxisChannelDef = _a.continuousAxisChannelDef, continuousAxis = _a.continuousAxis;
    var encoding = spec.encoding;
    var isMinMax = kIQRScalar === undefined;
    var summarize = [
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
    ];
    var postAggregateCalculates = [];
    if (isMinMax) {
        summarize.push({
            aggregate: 'min',
            field: continuousAxisChannelDef.field,
            as: 'lowerWhisker'
        });
        summarize.push({
            aggregate: 'max',
            field: continuousAxisChannelDef.field,
            as: 'upperWhisker'
        });
    }
    else {
        postAggregateCalculates = [
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
        ];
    }
    var groupby = [];
    var bins = [];
    var timeUnits = [];
    var encodingWithoutContinuousAxis = {};
    encoding_2.forEach(encoding, function (channelDef, channel) {
        if (channel === continuousAxis) {
            // Skip continuous axis as we already handle it separately
            return;
        }
        if (fielddef_1.isFieldDef(channelDef)) {
            if (channelDef.aggregate && channelDef.aggregate !== exports.BOXPLOT) {
                summarize.push({
                    aggregate: channelDef.aggregate,
                    field: channelDef.field,
                    as: fielddef_1.field(channelDef)
                });
            }
            else if (channelDef.aggregate === undefined) {
                var transformedField = fielddef_1.field(channelDef);
                // Add bin or timeUnit transform if applicable
                var bin = channelDef.bin;
                if (bin) {
                    var field_1 = channelDef.field;
                    bins.push({ bin: bin, field: field_1, as: transformedField });
                }
                else if (channelDef.timeUnit) {
                    var timeUnit = channelDef.timeUnit, field_2 = channelDef.field;
                    timeUnits.push({ timeUnit: timeUnit, field: field_2, as: transformedField });
                }
                groupby.push(transformedField);
            }
            // now the field should refer to post-transformed field instead
            encodingWithoutContinuousAxis[channel] = {
                field: fielddef_1.field(channelDef),
                type: channelDef.type
            };
        }
        else {
            // For value def, just copy
            encodingWithoutContinuousAxis[channel] = encoding[channel];
        }
    });
    return {
        transform: [].concat(bins, timeUnits, [{ summarize: summarize, groupby: groupby }], postAggregateCalculates),
        continuousAxisChannelDef: continuousAxisChannelDef,
        continuousAxis: continuousAxis,
        encodingWithoutContinuousAxis: encodingWithoutContinuousAxis
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm94cGxvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb3NpdGVtYXJrL2JveHBsb3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsdUNBQW1DO0FBR25DLHdDQUFtQztBQUVuQywwQ0FBZ0Q7QUFDaEQsMENBQWlHO0FBQ2pHLDhCQUFnQztBQUloQyxtQ0FBcUQ7QUFHeEMsUUFBQSxPQUFPLEdBQWUsVUFBVSxDQUFDO0FBVzlDLHNCQUE2QixJQUEwQjtJQUNyRCxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN4QixDQUFDO0FBRkQsb0NBRUM7QUFFWSxRQUFBLGNBQWMsR0FBbUIsQ0FBQyxZQUFZLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBZ0JqRSxRQUFBLHFDQUFxQyxHQUU5QztJQUNGLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUM7SUFDdEIsVUFBVSxFQUFFLENBQUMsT0FBTyxDQUFDO0lBQ3JCLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQztDQUNsQixDQUFDO0FBRUYsSUFBTSxpQkFBaUIsR0FBYyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDdEYsbUNBQTBDLElBQTZEO0lBQ3JHLE1BQU0sc0JBQ0QsSUFBSSxJQUNQLFFBQVEsRUFBRSxpQkFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLE9BQU87WUFDN0QsRUFBRSxDQUFDLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLFFBQVEsQ0FBQztZQUNsQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sR0FB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