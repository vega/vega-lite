"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
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
    return __assign({}, spec, { encoding: encoding_1.reduce(spec.encoding, function (newEncoding, fieldDef, channel) {
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
    var mark = spec.mark, encoding = spec.encoding, selection = spec.selection, outerSpec = __rest(spec, ["mark", "encoding", "selection"]);
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
    var color = encodingWithoutContinuousAxis.color, size = encodingWithoutContinuousAxis.size, encodingWithoutSizeColorAndContinuousAxis = __rest(encodingWithoutContinuousAxis, ["color", "size"]);
    // Size encoding or the default config.box.size is applied to box and boxMid
    var sizeMixins = size ? { size: size } : common_1.getMarkSpecificConfigMixins(config.box, 'size');
    var continuousAxisScaleAndAxis = {};
    if (continuousAxisChannelDef.scale) {
        continuousAxisScaleAndAxis['scale'] = continuousAxisChannelDef.scale;
    }
    if (continuousAxisChannelDef.axis) {
        continuousAxisScaleAndAxis['axis'] = continuousAxisChannelDef.axis;
    }
    return __assign({}, outerSpec, { transform: transform, layer: [
            {
                mark: {
                    type: 'rule',
                    style: 'boxWhisker'
                },
                encoding: __assign((_b = {}, _b[continuousAxis] = __assign({ field: 'lowerWhisker', type: continuousAxisChannelDef.type }, continuousAxisScaleAndAxis), _b[continuousAxis + '2'] = {
                    field: 'lowerBox',
                    type: continuousAxisChannelDef.type
                }, _b), encodingWithoutSizeColorAndContinuousAxis, common_1.getMarkSpecificConfigMixins(config.boxWhisker, 'color'))
            }, {
                mark: {
                    type: 'rule',
                    style: 'boxWhisker'
                },
                encoding: __assign((_c = {}, _c[continuousAxis] = {
                    field: 'upperBox',
                    type: continuousAxisChannelDef.type
                }, _c[continuousAxis + '2'] = {
                    field: 'upperWhisker',
                    type: continuousAxisChannelDef.type
                }, _c), encodingWithoutSizeColorAndContinuousAxis, common_1.getMarkSpecificConfigMixins(config.boxWhisker, 'color'))
            },
            __assign({}, (selection ? { selection: selection } : {}), { mark: {
                    type: 'bar',
                    style: 'box'
                }, encoding: __assign((_d = {}, _d[continuousAxis] = {
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
                encoding: __assign((_e = {}, _e[continuousAxis] = {
                    field: 'midBox',
                    type: continuousAxisChannelDef.type
                }, _e), encodingWithoutSizeColorAndContinuousAxis, common_1.getMarkSpecificConfigMixins(config.boxMid, 'color'), sizeMixins)
            }
        ] });
    var _b, _c, _d, _e;
}
exports.normalizeBoxPlot = normalizeBoxPlot;
function boxOrient(spec) {
    var mark = spec.mark, encoding = spec.encoding, _outerSpec = __rest(spec, ["mark", "encoding"]);
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
    var mark = spec.mark, encoding = spec.encoding, _outerSpec = __rest(spec, ["mark", "encoding"]);
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
        var aggregate = continuousAxisChannelDef.aggregate, continuousAxisWithoutAggregate = __rest(continuousAxisChannelDef, ["aggregate"]);
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
    var aggregate = [
        {
            op: 'q1',
            field: continuousAxisChannelDef.field,
            as: 'lowerBox'
        },
        {
            op: 'q3',
            field: continuousAxisChannelDef.field,
            as: 'upperBox'
        },
        {
            op: 'median',
            field: continuousAxisChannelDef.field,
            as: 'midBox'
        }
    ];
    var postAggregateCalculates = [];
    if (isMinMax) {
        aggregate.push({
            op: 'min',
            field: continuousAxisChannelDef.field,
            as: 'lowerWhisker'
        });
        aggregate.push({
            op: 'max',
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
                as: 'upperWhisker'
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
                aggregate.push({
                    op: channelDef.aggregate,
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
        transform: [].concat(bins, timeUnits, [{ aggregate: aggregate, groupby: groupby }], postAggregateCalculates),
        continuousAxisChannelDef: continuousAxisChannelDef,
        continuousAxis: continuousAxis,
        encodingWithoutContinuousAxis: encodingWithoutContinuousAxis
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm94cGxvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb3NpdGVtYXJrL2JveHBsb3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVDQUFtQztBQUduQyx3Q0FBbUM7QUFFbkMsMENBQWdEO0FBQ2hELDBDQUFpRztBQUNqRyw4QkFBZ0M7QUFJaEMsbUNBQXFEO0FBR3hDLFFBQUEsT0FBTyxHQUFlLFVBQVUsQ0FBQztBQTBCOUMsc0JBQTZCLElBQTBCO0lBQ3JELE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFGRCxvQ0FFQztBQUVZLFFBQUEsY0FBYyxHQUFtQixDQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7QUF5QmpFLFFBQUEscUNBQXFDLEdBRTlDO0lBQ0YsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQztJQUN0QixVQUFVLEVBQUUsQ0FBQyxPQUFPLENBQUM7SUFDckIsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDO0NBQ2xCLENBQUM7QUFFRixJQUFNLGlCQUFpQixHQUFjLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN0RixtQ0FBMEMsSUFBNkQ7SUFDckcsTUFBTSxjQUNELElBQUksSUFDUCxRQUFRLEVBQUUsaUJBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxPQUFPO1lBQzdELEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxRQUFRLENBQUM7WUFDbEMsQ0FBQztZQUFDLElBQUksQ0FB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cG9ydCB7aXNOdW1iZXJ9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge0NoYW5uZWx9IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQge3JlZHVjZX0gZnJvbSAnLi4vZW5jb2RpbmcnO1xuaW1wb3J0IHtBZ2dyZWdhdGVkRmllbGREZWYsIEJpblRyYW5zZm9ybSwgQ2FsY3VsYXRlVHJhbnNmb3JtLCBUaW1lVW5pdFRyYW5zZm9ybX0gZnJvbSAnLi4vdHJhbnNmb3JtJztcbmltcG9ydCB7RW5jb2RpbmcsIGZvckVhY2h9IGZyb20gJy4vLi4vZW5jb2RpbmcnO1xuaW1wb3J0IHtmaWVsZCwgRmllbGQsIEZpZWxkRGVmLCBpc0NvbnRpbnVvdXMsIGlzRmllbGREZWYsIFBvc2l0aW9uRmllbGREZWZ9IGZyb20gJy4vLi4vZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4vLi4vbG9nJztcbmltcG9ydCB7TWFya0NvbmZpZ30gZnJvbSAnLi8uLi9tYXJrJztcbmltcG9ydCB7R2VuZXJpY1VuaXRTcGVjLCBMYXllclNwZWN9IGZyb20gJy4vLi4vc3BlYyc7XG5pbXBvcnQge09yaWVudH0gZnJvbSAnLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2dldE1hcmtTcGVjaWZpY0NvbmZpZ01peGluc30gZnJvbSAnLi9jb21tb24nO1xuXG5cbmV4cG9ydCBjb25zdCBCT1hQTE9UOiAnYm94LXBsb3QnID0gJ2JveC1wbG90JztcbmV4cG9ydCB0eXBlIEJPWFBMT1QgPSB0eXBlb2YgQk9YUExPVDtcbmV4cG9ydCB0eXBlIEJveFBsb3RTdHlsZSA9ICdib3hXaGlza2VyJyB8ICdib3gnIHwgJ2JveE1pZCc7XG5cblxuZXhwb3J0IGludGVyZmFjZSBCb3hQbG90RGVmIHtcbiAgLyoqXG4gICAqIFR5cGUgb2YgdGhlIG1hcmsuICBGb3IgYm94IHBsb3RzLCB0aGlzIHNob3VsZCBhbHdheXMgYmUgYFwiYm94LXBsb3RcImAuXG4gICAqIFtib3hwbG90XShjb21wb3NpdGVtYXJrLmh0bWwjYm94cGxvdClcbiAgICovXG4gIHR5cGU6IEJPWFBMT1Q7XG5cbiAgLyoqXG4gICAqIE9yaWVudGF0aW9uIG9mIHRoZSBib3ggcGxvdC4gIFRoaXMgaXMgbm9ybWFsbHkgYXV0b21hdGljYWxseSBkZXRlcm1pbmVkLCBidXQgY2FuIGJlIHNwZWNpZmllZCB3aGVuIHRoZSBvcmllbnRhdGlvbiBpcyBhbWJpZ3VvdXMgYW5kIGNhbm5vdCBiZSBhdXRvbWF0aWNhbGx5IGRldGVybWluZWQuXG4gICAqL1xuICBvcmllbnQ/OiBPcmllbnQ7XG5cbiAgLyoqXG4gICAqIEV4dGVudCBpcyB1c2VkIHRvIGRldGVybWluZSB3aGVyZSB0aGUgd2hpc2tlcnMgZXh0ZW5kIHRvLiBUaGUgb3B0aW9ucyBhcmVcbiAgICogLSBgXCJtaW4tbWF4XCI6IG1pbiBhbmQgbWF4IGFyZSB0aGUgbG93ZXIgYW5kIHVwcGVyIHdoaXNrZXJzIHJlc3BlY3RpdmVseS5cbiAgICogLSBgXCJudW1iZXJcIjogQSBzY2FsYXIgKGludGVnZXIgb3IgZmxvYXRpbmcgcG9pbnQgbnVtYmVyKSB0aGF0IHdpbGwgYmUgbXVsdGlwbGllZCBieSB0aGUgSVFSIGFuZCB0aGUgcHJvZHVjdCB3aWxsIGJlIGFkZGVkIHRvIHRoZSB0aGlyZCBxdWFydGlsZSB0byBnZXQgdGhlIHVwcGVyIHdoaXNrZXIgYW5kIHN1YnRyYWN0ZWQgZnJvbSB0aGUgZmlyc3QgcXVhcnRpbGUgdG8gZ2V0IHRoZSBsb3dlciB3aGlza2VyLlxuICAgKiBfX0RlZmF1bHQgdmFsdWU6X18gYFwibWluLW1heFwiYC5cbiAgICovXG4gIGV4dGVudD86ICdtaW4tbWF4JyB8IG51bWJlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQm94UGxvdERlZihtYXJrOiBCT1hQTE9UIHwgQm94UGxvdERlZik6IG1hcmsgaXMgQm94UGxvdERlZiB7XG4gIHJldHVybiAhIW1hcmtbJ3R5cGUnXTtcbn1cblxuZXhwb3J0IGNvbnN0IEJPWFBMT1RfU1RZTEVTOiBCb3hQbG90U3R5bGVbXSA9IFsnYm94V2hpc2tlcicsICdib3gnLCAnYm94TWlkJ107XG5cbmV4cG9ydCBpbnRlcmZhY2UgQm94UGxvdENvbmZpZyBleHRlbmRzIE1hcmtDb25maWcge1xuICAvKiogU2l6ZSBvZiB0aGUgYm94IGFuZCBtaWQgdGljayBvZiBhIGJveCBwbG90ICovXG4gIHNpemU/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQm94UGxvdENvbmZpZ01peGlucyB7XG4gIC8qKlxuICAgKiBCb3ggQ29uZmlnXG4gICAqIEBoaWRlXG4gICAqL1xuICBib3g/OiBCb3hQbG90Q29uZmlnO1xuXG4gIC8qKlxuICAgKiBAaGlkZVxuICAgKi9cbiAgYm94V2hpc2tlcj86IE1hcmtDb25maWc7XG5cbiAgLyoqXG4gICAqIEBoaWRlXG4gICAqL1xuICBib3hNaWQ/OiBNYXJrQ29uZmlnO1xufVxuXG5leHBvcnQgY29uc3QgVkxfT05MWV9CT1hQTE9UX0NPTkZJR19QUk9QRVJUWV9JTkRFWDoge1xuICBbayBpbiBrZXlvZiBCb3hQbG90Q29uZmlnTWl4aW5zXT86IChrZXlvZiBCb3hQbG90Q29uZmlnTWl4aW5zW2tdKVtdXG59ID0ge1xuICBib3g6IFsnc2l6ZScsICdjb2xvciddLFxuICBib3hXaGlza2VyOiBbJ2NvbG9yJ10sXG4gIGJveE1pZDogWydjb2xvciddXG59O1xuXG5jb25zdCBzdXBwb3J0ZWRDaGFubmVsczogQ2hhbm5lbFtdID0gWyd4JywgJ3knLCAnY29sb3InLCAnZGV0YWlsJywgJ29wYWNpdHknLCAnc2l6ZSddO1xuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlclVuc3VwcG9ydGVkQ2hhbm5lbHMoc3BlYzogR2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPHN0cmluZz4sIEJPWFBMT1QgfCBCb3hQbG90RGVmPik6IEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZzxzdHJpbmc+LCBCT1hQTE9UIHwgQm94UGxvdERlZj4ge1xuICByZXR1cm4ge1xuICAgIC4uLnNwZWMsXG4gICAgZW5jb2Rpbmc6IHJlZHVjZShzcGVjLmVuY29kaW5nLCAobmV3RW5jb2RpbmcsIGZpZWxkRGVmLCBjaGFubmVsKSA9PiB7XG4gICAgICBpZiAoc3VwcG9ydGVkQ2hhbm5lbHMuaW5kZXhPZihjaGFubmVsKSA+IC0xKSB7XG4gICAgICAgIG5ld0VuY29kaW5nW2NoYW5uZWxdID0gZmllbGREZWY7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5pbmNvbXBhdGlibGVDaGFubmVsKGNoYW5uZWwsIEJPWFBMT1QpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXdFbmNvZGluZztcbiAgICB9LCB7fSksXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVCb3hQbG90KHNwZWM6IEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZzxzdHJpbmc+LCBCT1hQTE9UIHwgQm94UGxvdERlZj4sIGNvbmZpZzogQ29uZmlnKTogTGF5ZXJTcGVjIHtcbiAgc3BlYyA9IGZpbHRlclVuc3VwcG9ydGVkQ2hhbm5lbHMoc3BlYyk7XG4gIC8vIFRPRE86IHVzZSBzZWxlY3Rpb25cbiAgY29uc3Qge21hcmssIGVuY29kaW5nLCBzZWxlY3Rpb24sIC4uLm91dGVyU3BlY30gPSBzcGVjO1xuXG4gIGxldCBrSVFSU2NhbGFyOiBudW1iZXIgPSB1bmRlZmluZWQ7XG4gIGlmIChpc0JveFBsb3REZWYobWFyaykpIHtcbiAgICBpZiAobWFyay5leHRlbnQpIHtcbiAgICAgIGlmKGlzTnVtYmVyKG1hcmsuZXh0ZW50KSkge1xuICAgICAgICBrSVFSU2NhbGFyID0gbWFyay5leHRlbnQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3Qgb3JpZW50OiBPcmllbnQgPSBib3hPcmllbnQoc3BlYyk7XG4gIGNvbnN0IHt0cmFuc2Zvcm0sIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZiwgY29udGludW91c0F4aXMsIGVuY29kaW5nV2l0aG91dENvbnRpbnVvdXNBeGlzfSA9IGJveFBhcmFtcyhzcGVjLCBvcmllbnQsIGtJUVJTY2FsYXIpO1xuXG4gIGNvbnN0IHtjb2xvciwgc2l6ZSwgLi4uZW5jb2RpbmdXaXRob3V0U2l6ZUNvbG9yQW5kQ29udGludW91c0F4aXN9ID0gZW5jb2RpbmdXaXRob3V0Q29udGludW91c0F4aXM7XG5cbiAgLy8gU2l6ZSBlbmNvZGluZyBvciB0aGUgZGVmYXVsdCBjb25maWcuYm94LnNpemUgaXMgYXBwbGllZCB0byBib3ggYW5kIGJveE1pZFxuICBjb25zdCBzaXplTWl4aW5zID0gc2l6ZSA/IHtzaXplfSA6IGdldE1hcmtTcGVjaWZpY0NvbmZpZ01peGlucyhjb25maWcuYm94LCAnc2l6ZScpO1xuXG4gIGNvbnN0IGNvbnRpbnVvdXNBeGlzU2NhbGVBbmRBeGlzID0ge307XG4gIGlmIChjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuc2NhbGUpIHtcbiAgICBjb250aW51b3VzQXhpc1NjYWxlQW5kQXhpc1snc2NhbGUnXSA9IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5zY2FsZTtcbiAgfVxuICBpZiAoY29udGludW91c0F4aXNDaGFubmVsRGVmLmF4aXMpIHtcbiAgICBjb250aW51b3VzQXhpc1NjYWxlQW5kQXhpc1snYXhpcyddID0gY29udGludW91c0F4aXNDaGFubmVsRGVmLmF4aXM7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC4uLm91dGVyU3BlYyxcbiAgICB0cmFuc2Zvcm0sXG4gICAgbGF5ZXI6IFtcbiAgICAgIHsgLy8gbG93ZXIgd2hpc2tlclxuICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgdHlwZTogJ3J1bGUnLFxuICAgICAgICAgIHN0eWxlOiAnYm94V2hpc2tlcidcbiAgICAgICAgfSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICBbY29udGludW91c0F4aXNdOiB7XG4gICAgICAgICAgICBmaWVsZDogJ2xvd2VyV2hpc2tlcicsXG4gICAgICAgICAgICB0eXBlOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYudHlwZSxcbiAgICAgICAgICAgIC4uLmNvbnRpbnVvdXNBeGlzU2NhbGVBbmRBeGlzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBbY29udGludW91c0F4aXMgKyAnMiddOiB7XG4gICAgICAgICAgICBmaWVsZDogJ2xvd2VyQm94JyxcbiAgICAgICAgICAgIHR5cGU6IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi50eXBlXG4gICAgICAgICAgfSxcbiAgICAgICAgICAuLi5lbmNvZGluZ1dpdGhvdXRTaXplQ29sb3JBbmRDb250aW51b3VzQXhpcyxcbiAgICAgICAgICAuLi5nZXRNYXJrU3BlY2lmaWNDb25maWdNaXhpbnMoY29uZmlnLmJveFdoaXNrZXIsICdjb2xvcicpXG4gICAgICAgIH1cbiAgICAgIH0sIHsgLy8gdXBwZXIgd2hpc2tlclxuICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgdHlwZTogJ3J1bGUnLFxuICAgICAgICAgIHN0eWxlOiAnYm94V2hpc2tlcidcbiAgICAgICAgfSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICBbY29udGludW91c0F4aXNdOiB7XG4gICAgICAgICAgICBmaWVsZDogJ3VwcGVyQm94JyxcbiAgICAgICAgICAgIHR5cGU6IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi50eXBlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBbY29udGludW91c0F4aXMgKyAnMiddOiB7XG4gICAgICAgICAgICBmaWVsZDogJ3VwcGVyV2hpc2tlcicsXG4gICAgICAgICAgICB0eXBlOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYudHlwZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgLi4uZW5jb2RpbmdXaXRob3V0U2l6ZUNvbG9yQW5kQ29udGludW91c0F4aXMsXG4gICAgICAgICAgLi4uZ2V0TWFya1NwZWNpZmljQ29uZmlnTWl4aW5zKGNvbmZpZy5ib3hXaGlza2VyLCAnY29sb3InKVxuICAgICAgICB9XG4gICAgICB9LCB7IC8vIGJveCAocTEgdG8gcTMpXG4gICAgICAgIC4uLihzZWxlY3Rpb24gPyB7c2VsZWN0aW9ufSA6IHt9KSxcbiAgICAgICAgbWFyazoge1xuICAgICAgICAgIHR5cGU6ICdiYXInLFxuICAgICAgICAgIHN0eWxlOiAnYm94J1xuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFtjb250aW51b3VzQXhpc106IHtcbiAgICAgICAgICAgIGZpZWxkOiAnbG93ZXJCb3gnLFxuICAgICAgICAgICAgdHlwZTogY29udGludW91c0F4aXNDaGFubmVsRGVmLnR5cGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFtjb250aW51b3VzQXhpcyArICcyJ106IHtcbiAgICAgICAgICAgIGZpZWxkOiAndXBwZXJCb3gnLFxuICAgICAgICAgICAgdHlwZTogY29udGludW91c0F4aXNDaGFubmVsRGVmLnR5cGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIC4uLmVuY29kaW5nV2l0aG91dENvbnRpbnVvdXNBeGlzLFxuICAgICAgICAgIC4uLihlbmNvZGluZ1dpdGhvdXRDb250aW51b3VzQXhpcy5jb2xvciA/IHt9IDogZ2V0TWFya1NwZWNpZmljQ29uZmlnTWl4aW5zKGNvbmZpZy5ib3gsICdjb2xvcicpKSxcbiAgICAgICAgICAuLi5zaXplTWl4aW5zLFxuICAgICAgICB9XG4gICAgICB9LCB7IC8vIG1pZCB0aWNrXG4gICAgICAgIG1hcms6IHtcbiAgICAgICAgICB0eXBlOiAndGljaycsXG4gICAgICAgICAgc3R5bGU6ICdib3hNaWQnXG4gICAgICAgIH0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgW2NvbnRpbnVvdXNBeGlzXToge1xuICAgICAgICAgICAgZmllbGQ6ICdtaWRCb3gnLFxuICAgICAgICAgICAgdHlwZTogY29udGludW91c0F4aXNDaGFubmVsRGVmLnR5cGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIC4uLmVuY29kaW5nV2l0aG91dFNpemVDb2xvckFuZENvbnRpbnVvdXNBeGlzLFxuICAgICAgICAgIC4uLmdldE1hcmtTcGVjaWZpY0NvbmZpZ01peGlucyhjb25maWcuYm94TWlkLCAnY29sb3InKSxcbiAgICAgICAgICAuLi5zaXplTWl4aW5zLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgXVxuICB9O1xufVxuXG5mdW5jdGlvbiBib3hPcmllbnQoc3BlYzogR2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPEZpZWxkPiwgQk9YUExPVCB8IEJveFBsb3REZWY+KTogT3JpZW50IHtcbiAgY29uc3Qge21hcms6IG1hcmssIGVuY29kaW5nOiBlbmNvZGluZywgLi4uX291dGVyU3BlY30gPSBzcGVjO1xuXG4gIGlmIChpc0ZpZWxkRGVmKGVuY29kaW5nLngpICYmIGlzQ29udGludW91cyhlbmNvZGluZy54KSkge1xuICAgIC8vIHggaXMgY29udGludW91c1xuICAgIGlmIChpc0ZpZWxkRGVmKGVuY29kaW5nLnkpICYmIGlzQ29udGludW91cyhlbmNvZGluZy55KSkge1xuICAgICAgLy8gYm90aCB4IGFuZCB5IGFyZSBjb250aW51b3VzXG4gICAgICBpZiAoZW5jb2RpbmcueC5hZ2dyZWdhdGUgPT09IHVuZGVmaW5lZCAmJiBlbmNvZGluZy55LmFnZ3JlZ2F0ZSA9PT0gQk9YUExPVCkge1xuICAgICAgICByZXR1cm4gJ3ZlcnRpY2FsJztcbiAgICAgIH0gZWxzZSBpZiAoZW5jb2RpbmcueS5hZ2dyZWdhdGUgPT09IHVuZGVmaW5lZCAmJiBlbmNvZGluZy54LmFnZ3JlZ2F0ZSA9PT0gQk9YUExPVCkge1xuICAgICAgICByZXR1cm4gJ2hvcml6b250YWwnO1xuICAgICAgfSBlbHNlIGlmIChlbmNvZGluZy54LmFnZ3JlZ2F0ZSA9PT0gQk9YUExPVCAmJiBlbmNvZGluZy55LmFnZ3JlZ2F0ZSA9PT0gQk9YUExPVCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JvdGggeCBhbmQgeSBjYW5ub3QgaGF2ZSBhZ2dyZWdhdGUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChpc0JveFBsb3REZWYobWFyaykgJiYgbWFyay5vcmllbnQpIHtcbiAgICAgICAgICByZXR1cm4gbWFyay5vcmllbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkZWZhdWx0IG9yaWVudGF0aW9uID0gdmVydGljYWxcbiAgICAgICAgcmV0dXJuICd2ZXJ0aWNhbCc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8geCBpcyBjb250aW51b3VzIGJ1dCB5IGlzIG5vdFxuICAgIHJldHVybiAnaG9yaXpvbnRhbCc7XG4gIH0gZWxzZSBpZiAoaXNGaWVsZERlZihlbmNvZGluZy55KSAmJiBpc0NvbnRpbnVvdXMoZW5jb2RpbmcueSkpIHtcbiAgICAvLyB5IGlzIGNvbnRpbnVvdXMgYnV0IHggaXMgbm90XG4gICAgcmV0dXJuICd2ZXJ0aWNhbCc7XG4gIH0gZWxzZSB7XG4gICAgLy8gTmVpdGhlciB4IG5vciB5IGlzIGNvbnRpbnVvdXMuXG4gICAgdGhyb3cgbmV3IEVycm9yKCdOZWVkIGEgdmFsaWQgY29udGludW91cyBheGlzIGZvciBib3hwbG90cycpO1xuICB9XG59XG5cblxuZnVuY3Rpb24gYm94Q29udGlub3VzQXhpcyhzcGVjOiBHZW5lcmljVW5pdFNwZWM8RW5jb2Rpbmc8c3RyaW5nPiwgQk9YUExPVCB8IEJveFBsb3REZWY+LCBvcmllbnQ6IE9yaWVudCkge1xuICBjb25zdCB7bWFyazogbWFyaywgZW5jb2Rpbmc6IGVuY29kaW5nLCAuLi5fb3V0ZXJTcGVjfSA9IHNwZWM7XG5cbiAgbGV0IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZjogUG9zaXRpb25GaWVsZERlZjxzdHJpbmc+O1xuICBsZXQgY29udGludW91c0F4aXM6ICd4JyB8ICd5JztcblxuICBpZiAob3JpZW50ID09PSAndmVydGljYWwnKSB7XG4gICAgY29udGludW91c0F4aXMgPSAneSc7XG4gICAgY29udGludW91c0F4aXNDaGFubmVsRGVmID0gZW5jb2RpbmcueSBhcyBGaWVsZERlZjxzdHJpbmc+OyAvLyBTYWZlIHRvIGNhc3QgYmVjYXVzZSBpZiB5IGlzIG5vdCBjb250aW5vdXMgZmllbGRkZWYsIHRoZSBvcmllbnQgd291bGQgbm90IGJlIHZlcnRpY2FsLlxuICB9IGVsc2Uge1xuICAgIGNvbnRpbnVvdXNBeGlzID0gJ3gnO1xuICAgIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZiA9IGVuY29kaW5nLnggYXMgRmllbGREZWY8c3RyaW5nPjsgLy8gU2FmZSB0byBjYXN0IGJlY2F1c2UgaWYgeCBpcyBub3QgY29udGlub3VzIGZpZWxkZGVmLCB0aGUgb3JpZW50IHdvdWxkIG5vdCBiZSBob3Jpem9udGFsLlxuICB9XG5cbiAgaWYgKGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZiAmJiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuYWdncmVnYXRlKSB7XG4gICAgY29uc3Qge2FnZ3JlZ2F0ZSwgLi4uY29udGludW91c0F4aXNXaXRob3V0QWdncmVnYXRlfSA9IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZjtcbiAgICBpZiAoYWdncmVnYXRlICE9PSBCT1hQTE9UKSB7XG4gICAgICBsb2cud2FybihgQ29udGludW91cyBheGlzIHNob3VsZCBub3QgaGF2ZSBjdXN0b21pemVkIGFnZ3JlZ2F0aW9uIGZ1bmN0aW9uICR7YWdncmVnYXRlfWApO1xuICAgIH1cbiAgICBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYgPSBjb250aW51b3VzQXhpc1dpdGhvdXRBZ2dyZWdhdGU7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZixcbiAgICBjb250aW51b3VzQXhpc1xuICB9O1xufVxuXG5mdW5jdGlvbiBib3hQYXJhbXMoc3BlYzogR2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPHN0cmluZz4sIEJPWFBMT1QgfCBCb3hQbG90RGVmPiwgb3JpZW50OiBPcmllbnQsIGtJUVJTY2FsYXI6ICdtaW4tbWF4JyB8IG51bWJlcikge1xuXG4gIGNvbnN0IHtjb250aW51b3VzQXhpc0NoYW5uZWxEZWYsIGNvbnRpbnVvdXNBeGlzfSA9IGJveENvbnRpbm91c0F4aXMoc3BlYywgb3JpZW50KTtcbiAgY29uc3QgZW5jb2RpbmcgPSBzcGVjLmVuY29kaW5nO1xuXG4gIGNvbnN0IGlzTWluTWF4ID0ga0lRUlNjYWxhciA9PT0gdW5kZWZpbmVkO1xuICBjb25zdCBhZ2dyZWdhdGU6IEFnZ3JlZ2F0ZWRGaWVsZERlZltdID0gW1xuICAgIHtcbiAgICAgIG9wOiAncTEnLFxuICAgICAgZmllbGQ6IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZCxcbiAgICAgIGFzOiAnbG93ZXJCb3gnXG4gICAgfSxcbiAgICB7XG4gICAgICBvcDogJ3EzJyxcbiAgICAgIGZpZWxkOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICBhczogJ3VwcGVyQm94J1xuICAgIH0sXG4gICAge1xuICAgICAgb3A6ICdtZWRpYW4nLFxuICAgICAgZmllbGQ6IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZCxcbiAgICAgIGFzOiAnbWlkQm94J1xuICAgIH1cbiAgXTtcbiAgbGV0IHBvc3RBZ2dyZWdhdGVDYWxjdWxhdGVzOiBDYWxjdWxhdGVUcmFuc2Zvcm1bXSA9IFtdO1xuXG4gIGlmIChpc01pbk1heCkge1xuICAgIGFnZ3JlZ2F0ZS5wdXNoKHtcbiAgICAgIG9wOiAnbWluJyxcbiAgICAgIGZpZWxkOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICBhczogJ2xvd2VyV2hpc2tlcidcbiAgICB9KTtcbiAgICBhZ2dyZWdhdGUucHVzaCh7XG4gICAgICBvcDogJ21heCcsXG4gICAgICBmaWVsZDogY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgICAgYXM6ICd1cHBlcldoaXNrZXInXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcG9zdEFnZ3JlZ2F0ZUNhbGN1bGF0ZXMgPSBbXG4gICAgICB7XG4gICAgICAgIGNhbGN1bGF0ZTogJ2RhdHVtLnVwcGVyQm94IC0gZGF0dW0ubG93ZXJCb3gnLFxuICAgICAgICBhczogJ0lRUidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNhbGN1bGF0ZTogJ2RhdHVtLmxvd2VyQm94IC0gZGF0dW0uSVFSICogJyArIGtJUVJTY2FsYXIsXG4gICAgICAgIGFzOiAnbG93ZXJXaGlza2VyJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2FsY3VsYXRlOiAnZGF0dW0udXBwZXJCb3ggKyBkYXR1bS5JUVIgKiAnICsga0lRUlNjYWxhcixcbiAgICAgICAgYXM6ICd1cHBlcldoaXNrZXInXG4gICAgICB9XG4gICAgXTtcbiAgfVxuXG4gIGNvbnN0IGdyb3VwYnk6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IGJpbnM6IEJpblRyYW5zZm9ybVtdID0gW107XG4gIGNvbnN0IHRpbWVVbml0czogVGltZVVuaXRUcmFuc2Zvcm1bXSA9IFtdO1xuXG4gIGNvbnN0IGVuY29kaW5nV2l0aG91dENvbnRpbnVvdXNBeGlzOiBFbmNvZGluZzxzdHJpbmc+ID0ge307XG4gIGZvckVhY2goZW5jb2RpbmcsIChjaGFubmVsRGVmLCBjaGFubmVsKSA9PiB7XG4gICAgaWYgKGNoYW5uZWwgPT09IGNvbnRpbnVvdXNBeGlzKSB7XG4gICAgICAvLyBTa2lwIGNvbnRpbnVvdXMgYXhpcyBhcyB3ZSBhbHJlYWR5IGhhbmRsZSBpdCBzZXBhcmF0ZWx5XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChpc0ZpZWxkRGVmKGNoYW5uZWxEZWYpKSB7XG4gICAgICBpZiAoY2hhbm5lbERlZi5hZ2dyZWdhdGUgJiYgY2hhbm5lbERlZi5hZ2dyZWdhdGUgIT09IEJPWFBMT1QpIHtcbiAgICAgICAgYWdncmVnYXRlLnB1c2goe1xuICAgICAgICAgIG9wOiBjaGFubmVsRGVmLmFnZ3JlZ2F0ZSxcbiAgICAgICAgICBmaWVsZDogY2hhbm5lbERlZi5maWVsZCxcbiAgICAgICAgICBhczogZmllbGQoY2hhbm5lbERlZilcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKGNoYW5uZWxEZWYuYWdncmVnYXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtZWRGaWVsZCA9IGZpZWxkKGNoYW5uZWxEZWYpO1xuXG4gICAgICAgIC8vIEFkZCBiaW4gb3IgdGltZVVuaXQgdHJhbnNmb3JtIGlmIGFwcGxpY2FibGVcbiAgICAgICAgY29uc3QgYmluID0gY2hhbm5lbERlZi5iaW47XG4gICAgICAgIGlmIChiaW4pIHtcbiAgICAgICAgICBjb25zdCB7ZmllbGR9ID0gY2hhbm5lbERlZjtcbiAgICAgICAgICBiaW5zLnB1c2goe2JpbiwgZmllbGQsIGFzOiB0cmFuc2Zvcm1lZEZpZWxkfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY2hhbm5lbERlZi50aW1lVW5pdCkge1xuICAgICAgICAgIGNvbnN0IHt0aW1lVW5pdCwgZmllbGR9ID0gY2hhbm5lbERlZjtcbiAgICAgICAgICB0aW1lVW5pdHMucHVzaCh7dGltZVVuaXQsIGZpZWxkLCBhczogdHJhbnNmb3JtZWRGaWVsZH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZ3JvdXBieS5wdXNoKHRyYW5zZm9ybWVkRmllbGQpO1xuICAgICAgfVxuICAgICAgLy8gbm93IHRoZSBmaWVsZCBzaG91bGQgcmVmZXIgdG8gcG9zdC10cmFuc2Zvcm1lZCBmaWVsZCBpbnN0ZWFkXG4gICAgICBlbmNvZGluZ1dpdGhvdXRDb250aW51b3VzQXhpc1tjaGFubmVsXSA9IHtcbiAgICAgICAgZmllbGQ6IGZpZWxkKGNoYW5uZWxEZWYpLFxuICAgICAgICB0eXBlOiBjaGFubmVsRGVmLnR5cGVcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEZvciB2YWx1ZSBkZWYsIGp1c3QgY29weVxuICAgICAgZW5jb2RpbmdXaXRob3V0Q29udGludW91c0F4aXNbY2hhbm5lbF0gPSBlbmNvZGluZ1tjaGFubmVsXTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgdHJhbnNmb3JtOiBbXS5jb25jYXQoXG4gICAgICBiaW5zLFxuICAgICAgdGltZVVuaXRzLFxuICAgICAgW3thZ2dyZWdhdGUsIGdyb3VwYnl9XSxcbiAgICAgIHBvc3RBZ2dyZWdhdGVDYWxjdWxhdGVzXG4gICAgKSxcbiAgICBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYsXG4gICAgY29udGludW91c0F4aXMsXG4gICAgZW5jb2RpbmdXaXRob3V0Q29udGludW91c0F4aXNcbiAgfTtcbn1cbiJdfQ==