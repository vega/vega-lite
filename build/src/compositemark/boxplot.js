"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var encoding_1 = require("../encoding");
var encoding_2 = require("./../encoding");
var fielddef_1 = require("./../fielddef");
var log = require("./../log");
exports.BOXPLOT = 'box-plot';
function isBoxPlotDef(mark) {
    return !!mark['type'];
}
exports.isBoxPlotDef = isBoxPlotDef;
exports.BOXPLOT_STYLES = ['boxWhisker', 'box', 'boxMid'];
exports.VL_ONLY_BOXPLOT_CONFIG_PROPERTY_INDEX = {
    box: ['size']
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
    var isMinMax = kIQRScalar === undefined;
    var orient = boxOrient(spec);
    var _a = boxParams(spec, orient, kIQRScalar), transform = _a.transform, continuousAxisChannelDef = _a.continuousAxisChannelDef, continuousAxis = _a.continuousAxis, encodingWithoutContinuousAxis = _a.encodingWithoutContinuousAxis;
    var size = encodingWithoutContinuousAxis.size, color = encodingWithoutContinuousAxis.color, nonPositionEncodingWithoutColorSize = tslib_1.__rest(encodingWithoutContinuousAxis, ["size", "color"]);
    var sizeMixins = size ? { size: size } : { size: { value: config.box.size } };
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
                }, _b), nonPositionEncodingWithoutColorSize)
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
                }, _c), nonPositionEncodingWithoutColorSize)
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
                }, _d), encodingWithoutContinuousAxis, sizeMixins) }),
            {
                mark: {
                    type: 'tick',
                    style: 'boxMid'
                },
                encoding: tslib_1.__assign((_e = {}, _e[continuousAxis] = {
                    field: 'midBox',
                    type: continuousAxisChannelDef.type
                }, _e), nonPositionEncodingWithoutColorSize, sizeMixins)
            }
        ] });
    var _b, _c, _d, _e;
}
exports.normalizeBoxPlot = normalizeBoxPlot;
function boxOrient(spec) {
    var mark = spec.mark, encoding = spec.encoding, outerSpec = tslib_1.__rest(spec, ["mark", "encoding"]);
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
    var mark = spec.mark, encoding = spec.encoding, outerSpec = tslib_1.__rest(spec, ["mark", "encoding"]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm94cGxvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb3NpdGVtYXJrL2JveHBsb3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsdUNBQW1DO0FBR25DLHdDQUFtQztBQUduQywwQ0FBZ0Q7QUFDaEQsMENBQTZHO0FBQzdHLDhCQUFnQztBQU1uQixRQUFBLE9BQU8sR0FBZSxVQUFVLENBQUM7QUFXOUMsc0JBQTZCLElBQTBCO0lBQ3JELE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFGRCxvQ0FFQztBQUVZLFFBQUEsY0FBYyxHQUFtQixDQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFnQmpFLFFBQUEscUNBQXFDLEdBRTlDO0lBQ0YsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDO0NBQ2QsQ0FBQztBQUVGLElBQU0saUJBQWlCLEdBQWMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3RGLG1DQUEwQyxJQUE2RDtJQUNyRyxNQUFNLHNCQUNELElBQUksSUFDUCxRQUFRLEVBQUUsaUJBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxPQUFPO1lBQzdELEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxRQUFRLENBQUM7WUFDbEMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsZUFBTyxDQUFDLENBQUMsQ0FBQztZQUM5RCxD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