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
    var mark = spec.mark, encoding = spec.encoding, selection = spec.selection, _p = spec.projection, outerSpec = __rest(spec, ["mark", "encoding", "selection", "projection"]);
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
                encoding: __assign((_b = {}, _b[continuousAxis] = __assign({ field: 'lower_whisker_' + continuousAxisChannelDef.field, type: continuousAxisChannelDef.type }, continuousAxisScaleAndAxis), _b[continuousAxis + '2'] = {
                    field: 'lower_box_' + continuousAxisChannelDef.field,
                    type: continuousAxisChannelDef.type
                }, _b), encodingWithoutSizeColorAndContinuousAxis, common_1.getMarkSpecificConfigMixins(config.boxWhisker, 'color'))
            }, {
                mark: {
                    type: 'rule',
                    style: 'boxWhisker'
                },
                encoding: __assign((_c = {}, _c[continuousAxis] = {
                    field: 'upper_box_' + continuousAxisChannelDef.field,
                    type: continuousAxisChannelDef.type
                }, _c[continuousAxis + '2'] = {
                    field: 'upper_whisker_' + continuousAxisChannelDef.field,
                    type: continuousAxisChannelDef.type
                }, _c), encodingWithoutSizeColorAndContinuousAxis, common_1.getMarkSpecificConfigMixins(config.boxWhisker, 'color'))
            },
            __assign({}, (selection ? { selection: selection } : {}), { mark: {
                    type: 'bar',
                    style: 'box'
                }, encoding: __assign((_d = {}, _d[continuousAxis] = {
                    field: 'lower_box_' + continuousAxisChannelDef.field,
                    type: continuousAxisChannelDef.type
                }, _d[continuousAxis + '2'] = {
                    field: 'upper_box_' + continuousAxisChannelDef.field,
                    type: continuousAxisChannelDef.type
                }, _d), encodingWithoutContinuousAxis, (encodingWithoutContinuousAxis.color ? {} : common_1.getMarkSpecificConfigMixins(config.box, 'color')), sizeMixins) }),
            {
                mark: {
                    type: 'tick',
                    style: 'boxMid'
                },
                encoding: __assign((_e = {}, _e[continuousAxis] = {
                    field: 'mid_box_' + continuousAxisChannelDef.field,
                    type: continuousAxisChannelDef.type
                }, _e), encodingWithoutSizeColorAndContinuousAxis, common_1.getMarkSpecificConfigMixins(config.boxMid, 'color'), sizeMixins)
            }
        ] });
    var _b, _c, _d, _e;
}
exports.normalizeBoxPlot = normalizeBoxPlot;
function boxOrient(spec) {
    var mark = spec.mark, encoding = spec.encoding, _p = spec.projection, _outerSpec = __rest(spec, ["mark", "encoding", "projection"]);
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
    var mark = spec.mark, encoding = spec.encoding, _p = spec.projection, _outerSpec = __rest(spec, ["mark", "encoding", "projection"]);
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
    var postAggregateCalculates = [];
    aggregate.push({
        op: 'min',
        field: continuousAxisChannelDef.field,
        as: (isMinMax ? 'lower_whisker_' : 'min_') + continuousAxisChannelDef.field
    });
    aggregate.push({
        op: 'max',
        field: continuousAxisChannelDef.field,
        as: (isMinMax ? 'upper_whisker_' : 'max_') + continuousAxisChannelDef.field
    });
    if (!isMinMax) {
        postAggregateCalculates = [
            {
                calculate: "datum.upper_box_" + continuousAxisChannelDef.field + " - datum.lower_box_" + continuousAxisChannelDef.field,
                as: 'iqr_' + continuousAxisChannelDef.field
            },
            {
                calculate: "min(datum.upper_box_" + continuousAxisChannelDef.field + " + datum.iqr_" + continuousAxisChannelDef.field + " * " + kIQRScalar + ", datum.max_" + continuousAxisChannelDef.field + ")",
                as: 'upper_whisker_' + continuousAxisChannelDef.field
            },
            {
                calculate: "max(datum.lower_box_" + continuousAxisChannelDef.field + " - datum.iqr_" + continuousAxisChannelDef.field + " * " + kIQRScalar + ", datum.min_" + continuousAxisChannelDef.field + ")",
                as: 'lower_whisker_' + continuousAxisChannelDef.field
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
                    as: fielddef_1.vgField(channelDef)
                });
            }
            else if (channelDef.aggregate === undefined) {
                var transformedField = fielddef_1.vgField(channelDef);
                // Add bin or timeUnit transform if applicable
                var bin = channelDef.bin;
                if (bin) {
                    var field = channelDef.field;
                    bins.push({ bin: bin, field: field, as: transformedField });
                }
                else if (channelDef.timeUnit) {
                    var timeUnit = channelDef.timeUnit, field = channelDef.field;
                    timeUnits.push({ timeUnit: timeUnit, field: field, as: transformedField });
                }
                groupby.push(transformedField);
            }
            // now the field should refer to post-transformed field instead
            encodingWithoutContinuousAxis[channel] = {
                field: fielddef_1.vgField(channelDef),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm94cGxvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb3NpdGVtYXJrL2JveHBsb3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVDQUFtQztBQUduQyx3Q0FBbUM7QUFFbkMsMENBQWdEO0FBQ2hELDBDQUFtRztBQUNuRyw4QkFBZ0M7QUFJaEMsbUNBQXFEO0FBR3hDLFFBQUEsT0FBTyxHQUFlLFVBQVUsQ0FBQztBQTBCOUMsc0JBQTZCLElBQTBCO0lBQ3JELE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFGRCxvQ0FFQztBQUVZLFFBQUEsY0FBYyxHQUFtQixDQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7QUF5QmpFLFFBQUEscUNBQXFDLEdBRTlDO0lBQ0YsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQztJQUN0QixVQUFVLEVBQUUsQ0FBQyxPQUFPLENBQUM7SUFDckIsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDO0NBQ2xCLENBQUM7QUFFRixJQUFNLGlCQUFpQixHQUFjLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN0RixtQ0FBMEMsSUFBNkQ7SUFDckcsTUFBTSxjQUNELElBQUksSUFDUCxRQUFRLEVBQUUsaUJBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxPQUFPO1lBQzdELEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxRQUFRLENBQUM7WUFDbEMsQ0FBQztZQUFDLElBQUksQ0FB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QUMsSUFBSSxDQUFDLEVBQUMsUUFBUSxVQUFBLEVBQUUsS0FBSyxPQUFBLEVBQUUsRUFBRSxFQUFFLGdCQUFnQixFQUFDLENBQUMsQ0FBQztnQkFDMUQsQ0FBQztnQkFFRCxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDakMsQ0FBQztZQUNELCtEQUErRDtZQUMvRCw2QkFBNkIsQ0FBQyxPQUFPLENBQUMsR0FBRztnQkFDdkMsS0FBSyxFQUFFLGtCQUFPLENBQUMsVUFBVSxDQUFDO2dCQUMxQixJQUFJLEVBQUUsVUFBVSxDQUFDLElBQUk7YUFDdEIsQ0FBQztRQUNKLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLDJCQUEyQjtZQUMzQiw2QkFBNkIsQ0FBQyxPQUFPLENBQUMsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0QsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDO1FBQ0wsU0FBUyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQ2xCLElBQUksRUFDSixTQUFTLEVBQ1QsQ0FBQyxFQUFDLFNBQVMsV0FBQSxFQUFFLE9BQU8sU0FBQSxFQUFDLENBQUMsRUFDdEIsdUJBQXVCLENBQ3hCO1FBQ0Qsd0JBQXdCLDBCQUFBO1FBQ3hCLGNBQWMsZ0JBQUE7UUFDZCw2QkFBNkIsK0JBQUE7S0FDOUIsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzTnVtYmVyfSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHtDaGFubmVsfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7Q29uZmlnfSBmcm9tICcuLi9jb25maWcnO1xuaW1wb3J0IHtyZWR1Y2V9IGZyb20gJy4uL2VuY29kaW5nJztcbmltcG9ydCB7QWdncmVnYXRlZEZpZWxkRGVmLCBCaW5UcmFuc2Zvcm0sIENhbGN1bGF0ZVRyYW5zZm9ybSwgVGltZVVuaXRUcmFuc2Zvcm19IGZyb20gJy4uL3RyYW5zZm9ybSc7XG5pbXBvcnQge0VuY29kaW5nLCBmb3JFYWNofSBmcm9tICcuLy4uL2VuY29kaW5nJztcbmltcG9ydCB7RmllbGQsIEZpZWxkRGVmLCBpc0NvbnRpbnVvdXMsIGlzRmllbGREZWYsIFBvc2l0aW9uRmllbGREZWYsIHZnRmllbGR9IGZyb20gJy4vLi4vZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4vLi4vbG9nJztcbmltcG9ydCB7TWFya0NvbmZpZ30gZnJvbSAnLi8uLi9tYXJrJztcbmltcG9ydCB7R2VuZXJpY1VuaXRTcGVjLCBMYXllclNwZWN9IGZyb20gJy4vLi4vc3BlYyc7XG5pbXBvcnQge09yaWVudH0gZnJvbSAnLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2dldE1hcmtTcGVjaWZpY0NvbmZpZ01peGluc30gZnJvbSAnLi9jb21tb24nO1xuXG5cbmV4cG9ydCBjb25zdCBCT1hQTE9UOiAnYm94LXBsb3QnID0gJ2JveC1wbG90JztcbmV4cG9ydCB0eXBlIEJPWFBMT1QgPSB0eXBlb2YgQk9YUExPVDtcbmV4cG9ydCB0eXBlIEJveFBsb3RTdHlsZSA9ICdib3hXaGlza2VyJyB8ICdib3gnIHwgJ2JveE1pZCc7XG5cblxuZXhwb3J0IGludGVyZmFjZSBCb3hQbG90RGVmIHtcbiAgLyoqXG4gICAqIFR5cGUgb2YgdGhlIG1hcmsuICBGb3IgYm94IHBsb3RzLCB0aGlzIHNob3VsZCBhbHdheXMgYmUgYFwiYm94LXBsb3RcImAuXG4gICAqIFtib3hwbG90XShjb21wb3NpdGVtYXJrLmh0bWwjYm94cGxvdClcbiAgICovXG4gIHR5cGU6IEJPWFBMT1Q7XG5cbiAgLyoqXG4gICAqIE9yaWVudGF0aW9uIG9mIHRoZSBib3ggcGxvdC4gIFRoaXMgaXMgbm9ybWFsbHkgYXV0b21hdGljYWxseSBkZXRlcm1pbmVkLCBidXQgY2FuIGJlIHNwZWNpZmllZCB3aGVuIHRoZSBvcmllbnRhdGlvbiBpcyBhbWJpZ3VvdXMgYW5kIGNhbm5vdCBiZSBhdXRvbWF0aWNhbGx5IGRldGVybWluZWQuXG4gICAqL1xuICBvcmllbnQ/OiBPcmllbnQ7XG5cbiAgLyoqXG4gICAqIEV4dGVudCBpcyB1c2VkIHRvIGRldGVybWluZSB3aGVyZSB0aGUgd2hpc2tlcnMgZXh0ZW5kIHRvLiBUaGUgb3B0aW9ucyBhcmVcbiAgICogLSBgXCJtaW4tbWF4XCI6IG1pbiBhbmQgbWF4IGFyZSB0aGUgbG93ZXIgYW5kIHVwcGVyIHdoaXNrZXJzIHJlc3BlY3RpdmVseS5cbiAgICogLSBgXCJudW1iZXJcIjogQSBzY2FsYXIgKGludGVnZXIgb3IgZmxvYXRpbmcgcG9pbnQgbnVtYmVyKSB0aGF0IHdpbGwgYmUgbXVsdGlwbGllZCBieSB0aGUgSVFSIGFuZCB0aGUgcHJvZHVjdCB3aWxsIGJlIGFkZGVkIHRvIHRoZSB0aGlyZCBxdWFydGlsZSB0byBnZXQgdGhlIHVwcGVyIHdoaXNrZXIgYW5kIHN1YnRyYWN0ZWQgZnJvbSB0aGUgZmlyc3QgcXVhcnRpbGUgdG8gZ2V0IHRoZSBsb3dlciB3aGlza2VyLlxuICAgKiBfX0RlZmF1bHQgdmFsdWU6X18gYFwibWluLW1heFwiYC5cbiAgICovXG4gIGV4dGVudD86ICdtaW4tbWF4JyB8IG51bWJlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQm94UGxvdERlZihtYXJrOiBCT1hQTE9UIHwgQm94UGxvdERlZik6IG1hcmsgaXMgQm94UGxvdERlZiB7XG4gIHJldHVybiAhIW1hcmtbJ3R5cGUnXTtcbn1cblxuZXhwb3J0IGNvbnN0IEJPWFBMT1RfU1RZTEVTOiBCb3hQbG90U3R5bGVbXSA9IFsnYm94V2hpc2tlcicsICdib3gnLCAnYm94TWlkJ107XG5cbmV4cG9ydCBpbnRlcmZhY2UgQm94UGxvdENvbmZpZyBleHRlbmRzIE1hcmtDb25maWcge1xuICAvKiogU2l6ZSBvZiB0aGUgYm94IGFuZCBtaWQgdGljayBvZiBhIGJveCBwbG90ICovXG4gIHNpemU/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQm94UGxvdENvbmZpZ01peGlucyB7XG4gIC8qKlxuICAgKiBCb3ggQ29uZmlnXG4gICAqIEBoaWRlXG4gICAqL1xuICBib3g/OiBCb3hQbG90Q29uZmlnO1xuXG4gIC8qKlxuICAgKiBAaGlkZVxuICAgKi9cbiAgYm94V2hpc2tlcj86IE1hcmtDb25maWc7XG5cbiAgLyoqXG4gICAqIEBoaWRlXG4gICAqL1xuICBib3hNaWQ/OiBNYXJrQ29uZmlnO1xufVxuXG5leHBvcnQgY29uc3QgVkxfT05MWV9CT1hQTE9UX0NPTkZJR19QUk9QRVJUWV9JTkRFWDoge1xuICBbayBpbiBrZXlvZiBCb3hQbG90Q29uZmlnTWl4aW5zXT86IChrZXlvZiBCb3hQbG90Q29uZmlnTWl4aW5zW2tdKVtdXG59ID0ge1xuICBib3g6IFsnc2l6ZScsICdjb2xvciddLFxuICBib3hXaGlza2VyOiBbJ2NvbG9yJ10sXG4gIGJveE1pZDogWydjb2xvciddXG59O1xuXG5jb25zdCBzdXBwb3J0ZWRDaGFubmVsczogQ2hhbm5lbFtdID0gWyd4JywgJ3knLCAnY29sb3InLCAnZGV0YWlsJywgJ29wYWNpdHknLCAnc2l6ZSddO1xuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlclVuc3VwcG9ydGVkQ2hhbm5lbHMoc3BlYzogR2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPHN0cmluZz4sIEJPWFBMT1QgfCBCb3hQbG90RGVmPik6IEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZzxzdHJpbmc+LCBCT1hQTE9UIHwgQm94UGxvdERlZj4ge1xuICByZXR1cm4ge1xuICAgIC4uLnNwZWMsXG4gICAgZW5jb2Rpbmc6IHJlZHVjZShzcGVjLmVuY29kaW5nLCAobmV3RW5jb2RpbmcsIGZpZWxkRGVmLCBjaGFubmVsKSA9PiB7XG4gICAgICBpZiAoc3VwcG9ydGVkQ2hhbm5lbHMuaW5kZXhPZihjaGFubmVsKSA+IC0xKSB7XG4gICAgICAgIG5ld0VuY29kaW5nW2NoYW5uZWxdID0gZmllbGREZWY7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5pbmNvbXBhdGlibGVDaGFubmVsKGNoYW5uZWwsIEJPWFBMT1QpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXdFbmNvZGluZztcbiAgICB9LCB7fSksXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVCb3hQbG90KHNwZWM6IEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZzxzdHJpbmc+LCBCT1hQTE9UIHwgQm94UGxvdERlZj4sIGNvbmZpZzogQ29uZmlnKTogTGF5ZXJTcGVjIHtcbiAgc3BlYyA9IGZpbHRlclVuc3VwcG9ydGVkQ2hhbm5lbHMoc3BlYyk7XG4gIC8vIFRPRE86IHVzZSBzZWxlY3Rpb25cbiAgY29uc3Qge21hcmssIGVuY29kaW5nLCBzZWxlY3Rpb24sIHByb2plY3Rpb246IF9wLCAuLi5vdXRlclNwZWN9ID0gc3BlYztcblxuICBsZXQga0lRUlNjYWxhcjogbnVtYmVyID0gdW5kZWZpbmVkO1xuICBpZiAoaXNCb3hQbG90RGVmKG1hcmspKSB7XG4gICAgaWYgKG1hcmsuZXh0ZW50KSB7XG4gICAgICBpZihpc051bWJlcihtYXJrLmV4dGVudCkpIHtcbiAgICAgICAga0lRUlNjYWxhciA9IG1hcmsuZXh0ZW50O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG9yaWVudDogT3JpZW50ID0gYm94T3JpZW50KHNwZWMpO1xuICBjb25zdCB7dHJhbnNmb3JtLCBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYsIGNvbnRpbnVvdXNBeGlzLCBlbmNvZGluZ1dpdGhvdXRDb250aW51b3VzQXhpc30gPSBib3hQYXJhbXMoc3BlYywgb3JpZW50LCBrSVFSU2NhbGFyKTtcblxuICBjb25zdCB7Y29sb3IsIHNpemUsIC4uLmVuY29kaW5nV2l0aG91dFNpemVDb2xvckFuZENvbnRpbnVvdXNBeGlzfSA9IGVuY29kaW5nV2l0aG91dENvbnRpbnVvdXNBeGlzO1xuXG4gIC8vIFNpemUgZW5jb2Rpbmcgb3IgdGhlIGRlZmF1bHQgY29uZmlnLmJveC5zaXplIGlzIGFwcGxpZWQgdG8gYm94IGFuZCBib3hNaWRcbiAgY29uc3Qgc2l6ZU1peGlucyA9IHNpemUgPyB7c2l6ZX0gOiBnZXRNYXJrU3BlY2lmaWNDb25maWdNaXhpbnMoY29uZmlnLmJveCwgJ3NpemUnKTtcblxuICBjb25zdCBjb250aW51b3VzQXhpc1NjYWxlQW5kQXhpcyA9IHt9O1xuICBpZiAoY29udGludW91c0F4aXNDaGFubmVsRGVmLnNjYWxlKSB7XG4gICAgY29udGludW91c0F4aXNTY2FsZUFuZEF4aXNbJ3NjYWxlJ10gPSBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuc2NhbGU7XG4gIH1cbiAgaWYgKGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5heGlzKSB7XG4gICAgY29udGludW91c0F4aXNTY2FsZUFuZEF4aXNbJ2F4aXMnXSA9IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5heGlzO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5vdXRlclNwZWMsXG4gICAgdHJhbnNmb3JtLFxuICAgIGxheWVyOiBbXG4gICAgICB7IC8vIGxvd2VyIHdoaXNrZXJcbiAgICAgICAgbWFyazoge1xuICAgICAgICAgIHR5cGU6ICdydWxlJyxcbiAgICAgICAgICBzdHlsZTogJ2JveFdoaXNrZXInXG4gICAgICAgIH0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgW2NvbnRpbnVvdXNBeGlzXToge1xuICAgICAgICAgICAgZmllbGQ6ICdsb3dlcl93aGlza2VyXycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICAgICAgICB0eXBlOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYudHlwZSxcbiAgICAgICAgICAgIC4uLmNvbnRpbnVvdXNBeGlzU2NhbGVBbmRBeGlzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBbY29udGludW91c0F4aXMgKyAnMiddOiB7XG4gICAgICAgICAgICBmaWVsZDogJ2xvd2VyX2JveF8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgICAgICAgICAgdHlwZTogY29udGludW91c0F4aXNDaGFubmVsRGVmLnR5cGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIC4uLmVuY29kaW5nV2l0aG91dFNpemVDb2xvckFuZENvbnRpbnVvdXNBeGlzLFxuICAgICAgICAgIC4uLmdldE1hcmtTcGVjaWZpY0NvbmZpZ01peGlucyhjb25maWcuYm94V2hpc2tlciwgJ2NvbG9yJylcbiAgICAgICAgfVxuICAgICAgfSwgeyAvLyB1cHBlciB3aGlza2VyXG4gICAgICAgIG1hcms6IHtcbiAgICAgICAgICB0eXBlOiAncnVsZScsXG4gICAgICAgICAgc3R5bGU6ICdib3hXaGlza2VyJ1xuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFtjb250aW51b3VzQXhpc106IHtcbiAgICAgICAgICAgIGZpZWxkOiAndXBwZXJfYm94XycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICAgICAgICB0eXBlOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYudHlwZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgW2NvbnRpbnVvdXNBeGlzICsgJzInXToge1xuICAgICAgICAgICAgZmllbGQ6ICd1cHBlcl93aGlza2VyXycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICAgICAgICB0eXBlOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYudHlwZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgLi4uZW5jb2RpbmdXaXRob3V0U2l6ZUNvbG9yQW5kQ29udGludW91c0F4aXMsXG4gICAgICAgICAgLi4uZ2V0TWFya1NwZWNpZmljQ29uZmlnTWl4aW5zKGNvbmZpZy5ib3hXaGlza2VyLCAnY29sb3InKVxuICAgICAgICB9XG4gICAgICB9LCB7IC8vIGJveCAocTEgdG8gcTMpXG4gICAgICAgIC4uLihzZWxlY3Rpb24gPyB7c2VsZWN0aW9ufSA6IHt9KSxcbiAgICAgICAgbWFyazoge1xuICAgICAgICAgIHR5cGU6ICdiYXInLFxuICAgICAgICAgIHN0eWxlOiAnYm94J1xuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFtjb250aW51b3VzQXhpc106IHtcbiAgICAgICAgICAgIGZpZWxkOiAnbG93ZXJfYm94XycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICAgICAgICB0eXBlOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYudHlwZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgW2NvbnRpbnVvdXNBeGlzICsgJzInXToge1xuICAgICAgICAgICAgZmllbGQ6ICd1cHBlcl9ib3hfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZCxcbiAgICAgICAgICAgIHR5cGU6IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi50eXBlXG4gICAgICAgICAgfSxcbiAgICAgICAgICAuLi5lbmNvZGluZ1dpdGhvdXRDb250aW51b3VzQXhpcyxcbiAgICAgICAgICAuLi4oZW5jb2RpbmdXaXRob3V0Q29udGludW91c0F4aXMuY29sb3IgPyB7fSA6IGdldE1hcmtTcGVjaWZpY0NvbmZpZ01peGlucyhjb25maWcuYm94LCAnY29sb3InKSksXG4gICAgICAgICAgLi4uc2l6ZU1peGlucyxcbiAgICAgICAgfVxuICAgICAgfSwgeyAvLyBtaWQgdGlja1xuICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgdHlwZTogJ3RpY2snLFxuICAgICAgICAgIHN0eWxlOiAnYm94TWlkJ1xuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFtjb250aW51b3VzQXhpc106IHtcbiAgICAgICAgICAgIGZpZWxkOiAnbWlkX2JveF8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgICAgICAgICAgdHlwZTogY29udGludW91c0F4aXNDaGFubmVsRGVmLnR5cGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIC4uLmVuY29kaW5nV2l0aG91dFNpemVDb2xvckFuZENvbnRpbnVvdXNBeGlzLFxuICAgICAgICAgIC4uLmdldE1hcmtTcGVjaWZpY0NvbmZpZ01peGlucyhjb25maWcuYm94TWlkLCAnY29sb3InKSxcbiAgICAgICAgICAuLi5zaXplTWl4aW5zLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgXVxuICB9O1xufVxuXG5mdW5jdGlvbiBib3hPcmllbnQoc3BlYzogR2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPEZpZWxkPiwgQk9YUExPVCB8IEJveFBsb3REZWY+KTogT3JpZW50IHtcbiAgY29uc3Qge21hcms6IG1hcmssIGVuY29kaW5nOiBlbmNvZGluZywgcHJvamVjdGlvbjogX3AsIC4uLl9vdXRlclNwZWN9ID0gc3BlYztcblxuICBpZiAoaXNGaWVsZERlZihlbmNvZGluZy54KSAmJiBpc0NvbnRpbnVvdXMoZW5jb2RpbmcueCkpIHtcbiAgICAvLyB4IGlzIGNvbnRpbnVvdXNcbiAgICBpZiAoaXNGaWVsZERlZihlbmNvZGluZy55KSAmJiBpc0NvbnRpbnVvdXMoZW5jb2RpbmcueSkpIHtcbiAgICAgIC8vIGJvdGggeCBhbmQgeSBhcmUgY29udGludW91c1xuICAgICAgaWYgKGVuY29kaW5nLnguYWdncmVnYXRlID09PSB1bmRlZmluZWQgJiYgZW5jb2RpbmcueS5hZ2dyZWdhdGUgPT09IEJPWFBMT1QpIHtcbiAgICAgICAgcmV0dXJuICd2ZXJ0aWNhbCc7XG4gICAgICB9IGVsc2UgaWYgKGVuY29kaW5nLnkuYWdncmVnYXRlID09PSB1bmRlZmluZWQgJiYgZW5jb2RpbmcueC5hZ2dyZWdhdGUgPT09IEJPWFBMT1QpIHtcbiAgICAgICAgcmV0dXJuICdob3Jpem9udGFsJztcbiAgICAgIH0gZWxzZSBpZiAoZW5jb2RpbmcueC5hZ2dyZWdhdGUgPT09IEJPWFBMT1QgJiYgZW5jb2RpbmcueS5hZ2dyZWdhdGUgPT09IEJPWFBMT1QpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCb3RoIHggYW5kIHkgY2Fubm90IGhhdmUgYWdncmVnYXRlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaXNCb3hQbG90RGVmKG1hcmspICYmIG1hcmsub3JpZW50KSB7XG4gICAgICAgICAgcmV0dXJuIG1hcmsub3JpZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZGVmYXVsdCBvcmllbnRhdGlvbiA9IHZlcnRpY2FsXG4gICAgICAgIHJldHVybiAndmVydGljYWwnO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHggaXMgY29udGludW91cyBidXQgeSBpcyBub3RcbiAgICByZXR1cm4gJ2hvcml6b250YWwnO1xuICB9IGVsc2UgaWYgKGlzRmllbGREZWYoZW5jb2RpbmcueSkgJiYgaXNDb250aW51b3VzKGVuY29kaW5nLnkpKSB7XG4gICAgLy8geSBpcyBjb250aW51b3VzIGJ1dCB4IGlzIG5vdFxuICAgIHJldHVybiAndmVydGljYWwnO1xuICB9IGVsc2Uge1xuICAgIC8vIE5laXRoZXIgeCBub3IgeSBpcyBjb250aW51b3VzLlxuICAgIHRocm93IG5ldyBFcnJvcignTmVlZCBhIHZhbGlkIGNvbnRpbnVvdXMgYXhpcyBmb3IgYm94cGxvdHMnKTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGJveENvbnRpbm91c0F4aXMoc3BlYzogR2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPHN0cmluZz4sIEJPWFBMT1QgfCBCb3hQbG90RGVmPiwgb3JpZW50OiBPcmllbnQpIHtcbiAgY29uc3Qge21hcms6IG1hcmssIGVuY29kaW5nOiBlbmNvZGluZywgcHJvamVjdGlvbjogX3AsIC4uLl9vdXRlclNwZWN9ID0gc3BlYztcblxuICBsZXQgY29udGludW91c0F4aXNDaGFubmVsRGVmOiBQb3NpdGlvbkZpZWxkRGVmPHN0cmluZz47XG4gIGxldCBjb250aW51b3VzQXhpczogJ3gnIHwgJ3knO1xuXG4gIGlmIChvcmllbnQgPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICBjb250aW51b3VzQXhpcyA9ICd5JztcbiAgICBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYgPSBlbmNvZGluZy55IGFzIEZpZWxkRGVmPHN0cmluZz47IC8vIFNhZmUgdG8gY2FzdCBiZWNhdXNlIGlmIHkgaXMgbm90IGNvbnRpbm91cyBmaWVsZGRlZiwgdGhlIG9yaWVudCB3b3VsZCBub3QgYmUgdmVydGljYWwuXG4gIH0gZWxzZSB7XG4gICAgY29udGludW91c0F4aXMgPSAneCc7XG4gICAgY29udGludW91c0F4aXNDaGFubmVsRGVmID0gZW5jb2RpbmcueCBhcyBGaWVsZERlZjxzdHJpbmc+OyAvLyBTYWZlIHRvIGNhc3QgYmVjYXVzZSBpZiB4IGlzIG5vdCBjb250aW5vdXMgZmllbGRkZWYsIHRoZSBvcmllbnQgd291bGQgbm90IGJlIGhvcml6b250YWwuXG4gIH1cblxuICBpZiAoY29udGludW91c0F4aXNDaGFubmVsRGVmICYmIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5hZ2dyZWdhdGUpIHtcbiAgICBjb25zdCB7YWdncmVnYXRlLCAuLi5jb250aW51b3VzQXhpc1dpdGhvdXRBZ2dyZWdhdGV9ID0gY29udGludW91c0F4aXNDaGFubmVsRGVmO1xuICAgIGlmIChhZ2dyZWdhdGUgIT09IEJPWFBMT1QpIHtcbiAgICAgIGxvZy53YXJuKGBDb250aW51b3VzIGF4aXMgc2hvdWxkIG5vdCBoYXZlIGN1c3RvbWl6ZWQgYWdncmVnYXRpb24gZnVuY3Rpb24gJHthZ2dyZWdhdGV9YCk7XG4gICAgfVxuICAgIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZiA9IGNvbnRpbnVvdXNBeGlzV2l0aG91dEFnZ3JlZ2F0ZTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY29udGludW91c0F4aXNDaGFubmVsRGVmLFxuICAgIGNvbnRpbnVvdXNBeGlzXG4gIH07XG59XG5cbmZ1bmN0aW9uIGJveFBhcmFtcyhzcGVjOiBHZW5lcmljVW5pdFNwZWM8RW5jb2Rpbmc8c3RyaW5nPiwgQk9YUExPVCB8IEJveFBsb3REZWY+LCBvcmllbnQ6IE9yaWVudCwga0lRUlNjYWxhcjogJ21pbi1tYXgnIHwgbnVtYmVyKSB7XG5cbiAgY29uc3Qge2NvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZiwgY29udGludW91c0F4aXN9ID0gYm94Q29udGlub3VzQXhpcyhzcGVjLCBvcmllbnQpO1xuICBjb25zdCBlbmNvZGluZyA9IHNwZWMuZW5jb2Rpbmc7XG5cbiAgY29uc3QgaXNNaW5NYXggPSBrSVFSU2NhbGFyID09PSB1bmRlZmluZWQ7XG4gIGNvbnN0IGFnZ3JlZ2F0ZTogQWdncmVnYXRlZEZpZWxkRGVmW10gPSBbXG4gICAge1xuICAgICAgb3A6ICdxMScsXG4gICAgICBmaWVsZDogY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgICAgYXM6ICdsb3dlcl9ib3hfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZFxuICAgIH0sXG4gICAge1xuICAgICAgb3A6ICdxMycsXG4gICAgICBmaWVsZDogY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgICAgYXM6ICd1cHBlcl9ib3hfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZFxuICAgIH0sXG4gICAge1xuICAgICAgb3A6ICdtZWRpYW4nLFxuICAgICAgZmllbGQ6IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZCxcbiAgICAgIGFzOiAnbWlkX2JveF8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkXG4gICAgfVxuICBdO1xuICBsZXQgcG9zdEFnZ3JlZ2F0ZUNhbGN1bGF0ZXM6IENhbGN1bGF0ZVRyYW5zZm9ybVtdID0gW107XG5cbiAgYWdncmVnYXRlLnB1c2goe1xuICAgIG9wOiAnbWluJyxcbiAgICBmaWVsZDogY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgIGFzOiAoaXNNaW5NYXggPyAnbG93ZXJfd2hpc2tlcl8nIDogJ21pbl8nKSArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZFxuICB9KTtcbiAgYWdncmVnYXRlLnB1c2goe1xuICAgIG9wOiAnbWF4JyxcbiAgICBmaWVsZDogY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgIGFzOiAgKGlzTWluTWF4ID8gJ3VwcGVyX3doaXNrZXJfJyA6ICdtYXhfJykgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGRcbiAgfSk7XG5cbiAgaWYgKCFpc01pbk1heCkge1xuICAgIHBvc3RBZ2dyZWdhdGVDYWxjdWxhdGVzID0gW1xuICAgICAge1xuICAgICAgICBjYWxjdWxhdGU6IGBkYXR1bS51cHBlcl9ib3hfJHtjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGR9IC0gZGF0dW0ubG93ZXJfYm94XyR7Y29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkfWAsXG4gICAgICAgIGFzOiAnaXFyXycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGRcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNhbGN1bGF0ZTogYG1pbihkYXR1bS51cHBlcl9ib3hfJHtjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGR9ICsgZGF0dW0uaXFyXyR7Y29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkfSAqICR7a0lRUlNjYWxhcn0sIGRhdHVtLm1heF8ke2NvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZH0pYCxcbiAgICAgICAgYXM6ICd1cHBlcl93aGlza2VyXycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGRcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNhbGN1bGF0ZTogYG1heChkYXR1bS5sb3dlcl9ib3hfJHtjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGR9IC0gZGF0dW0uaXFyXyR7Y29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkfSAqICR7a0lRUlNjYWxhcn0sIGRhdHVtLm1pbl8ke2NvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZH0pYCxcbiAgICAgICAgYXM6ICdsb3dlcl93aGlza2VyXycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGRcbiAgICAgIH1cbiAgICBdO1xuICB9XG5cbiAgY29uc3QgZ3JvdXBieTogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgYmluczogQmluVHJhbnNmb3JtW10gPSBbXTtcbiAgY29uc3QgdGltZVVuaXRzOiBUaW1lVW5pdFRyYW5zZm9ybVtdID0gW107XG5cbiAgY29uc3QgZW5jb2RpbmdXaXRob3V0Q29udGludW91c0F4aXM6IEVuY29kaW5nPHN0cmluZz4gPSB7fTtcbiAgZm9yRWFjaChlbmNvZGluZywgKGNoYW5uZWxEZWYsIGNoYW5uZWwpID0+IHtcbiAgICBpZiAoY2hhbm5lbCA9PT0gY29udGludW91c0F4aXMpIHtcbiAgICAgIC8vIFNraXAgY29udGludW91cyBheGlzIGFzIHdlIGFscmVhZHkgaGFuZGxlIGl0IHNlcGFyYXRlbHlcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGlzRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICAgIGlmIChjaGFubmVsRGVmLmFnZ3JlZ2F0ZSAmJiBjaGFubmVsRGVmLmFnZ3JlZ2F0ZSAhPT0gQk9YUExPVCkge1xuICAgICAgICBhZ2dyZWdhdGUucHVzaCh7XG4gICAgICAgICAgb3A6IGNoYW5uZWxEZWYuYWdncmVnYXRlLFxuICAgICAgICAgIGZpZWxkOiBjaGFubmVsRGVmLmZpZWxkLFxuICAgICAgICAgIGFzOiB2Z0ZpZWxkKGNoYW5uZWxEZWYpXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChjaGFubmVsRGVmLmFnZ3JlZ2F0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybWVkRmllbGQgPSB2Z0ZpZWxkKGNoYW5uZWxEZWYpO1xuXG4gICAgICAgIC8vIEFkZCBiaW4gb3IgdGltZVVuaXQgdHJhbnNmb3JtIGlmIGFwcGxpY2FibGVcbiAgICAgICAgY29uc3QgYmluID0gY2hhbm5lbERlZi5iaW47XG4gICAgICAgIGlmIChiaW4pIHtcbiAgICAgICAgICBjb25zdCB7ZmllbGR9ID0gY2hhbm5lbERlZjtcbiAgICAgICAgICBiaW5zLnB1c2goe2JpbiwgZmllbGQsIGFzOiB0cmFuc2Zvcm1lZEZpZWxkfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY2hhbm5lbERlZi50aW1lVW5pdCkge1xuICAgICAgICAgIGNvbnN0IHt0aW1lVW5pdCwgZmllbGR9ID0gY2hhbm5lbERlZjtcbiAgICAgICAgICB0aW1lVW5pdHMucHVzaCh7dGltZVVuaXQsIGZpZWxkLCBhczogdHJhbnNmb3JtZWRGaWVsZH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZ3JvdXBieS5wdXNoKHRyYW5zZm9ybWVkRmllbGQpO1xuICAgICAgfVxuICAgICAgLy8gbm93IHRoZSBmaWVsZCBzaG91bGQgcmVmZXIgdG8gcG9zdC10cmFuc2Zvcm1lZCBmaWVsZCBpbnN0ZWFkXG4gICAgICBlbmNvZGluZ1dpdGhvdXRDb250aW51b3VzQXhpc1tjaGFubmVsXSA9IHtcbiAgICAgICAgZmllbGQ6IHZnRmllbGQoY2hhbm5lbERlZiksXG4gICAgICAgIHR5cGU6IGNoYW5uZWxEZWYudHlwZVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRm9yIHZhbHVlIGRlZiwganVzdCBjb3B5XG4gICAgICBlbmNvZGluZ1dpdGhvdXRDb250aW51b3VzQXhpc1tjaGFubmVsXSA9IGVuY29kaW5nW2NoYW5uZWxdO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICB0cmFuc2Zvcm06IFtdLmNvbmNhdChcbiAgICAgIGJpbnMsXG4gICAgICB0aW1lVW5pdHMsXG4gICAgICBbe2FnZ3JlZ2F0ZSwgZ3JvdXBieX1dLFxuICAgICAgcG9zdEFnZ3JlZ2F0ZUNhbGN1bGF0ZXNcbiAgICApLFxuICAgIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZixcbiAgICBjb250aW51b3VzQXhpcyxcbiAgICBlbmNvZGluZ1dpdGhvdXRDb250aW51b3VzQXhpc1xuICB9O1xufVxuIl19