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
    box: ['size', 'color', 'extent'],
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
    if (vega_util_1.isNumber(config.box.extent)) {
        kIQRScalar = config.box.extent;
    }
    if (isBoxPlotDef(mark)) {
        if (mark.extent) {
            if (mark.extent === 'min-max') {
                kIQRScalar = undefined;
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
        continuousAxisChannelDef = encoding.y; // Safe to cast because if y is not continuous fielddef, the orient would not be vertical.
    }
    else {
        continuousAxis = 'x';
        continuousAxisChannelDef = encoding.x; // Safe to cast because if x is not continuous fielddef, the orient would not be horizontal.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm94cGxvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb3NpdGVtYXJrL2JveHBsb3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVDQUFtQztBQUduQyx3Q0FBbUM7QUFFbkMsMENBQWdEO0FBQ2hELDBDQUFtRztBQUNuRyw4QkFBZ0M7QUFJaEMsbUNBQXFEO0FBR3hDLFFBQUEsT0FBTyxHQUFlLFVBQVUsQ0FBQztBQTBCOUMsc0JBQTZCLElBQTBCO0lBQ3JELE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFGRCxvQ0FFQztBQUVZLFFBQUEsY0FBYyxHQUFtQixDQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7QUE4QmpFLFFBQUEscUNBQXFDLEdBRTlDO0lBQ0YsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUM7SUFDaEMsVUFBVSxFQUFFLENBQUMsT0FBTyxDQUFDO0lBQ3JCLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQztDQUNsQixDQUFDO0FBRUYsSUFBTSxpQkFBaUIsR0FBYyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDdEYsbUNBQTBDLElBQTZEO0lBQ3JHLE1BQU0sY0FDRCxJQUFJLElBQ1AsUUFBUSxFQUFFLGlCQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsT0FBTztZQUM3RCxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsUUFBUSxDQUFDO1lBQ2xDLENBQUM7WUFB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LENBQUM7Z0JBQ2hELENBQUM7Z0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUN4QixJQUFBLDhCQUFRLEVBQUUsd0JBQUssQ0FBZTtvQkFDckMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFDLFFBQVEsVUFBQSxFQUFFLEtBQUssT0FBQSxFQUFFLEVBQUUsRUFBRSxnQkFBZ0IsRUFBQyxDQUFDLENBQUM7Z0JBQzFELENBQUM7Z0JBRUQsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ2pDLENBQUM7WUFDRCwrREFBK0Q7WUFDL0QsNkJBQTZCLENBQUMsT0FBTyxDQUFDLEdBQUc7Z0JBQ3ZDLEtBQUssRUFBRSxrQkFBTyxDQUFDLFVBQVUsQ0FBQztnQkFDMUIsSUFBSSxFQUFFLFVBQVUsQ0FBQyxJQUFJO2FBQ3RCLENBQUM7UUFDSixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTiwyQkFBMkI7WUFDM0IsNkJBQTZCLENBQUMsT0FBTyxDQUFDLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdELENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQztRQUNMLFNBQVMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUNsQixJQUFJLEVBQ0osU0FBUyxFQUNULENBQUMsRUFBQyxTQUFTLFdBQUEsRUFBRSxPQUFPLFNBQUEsRUFBQyxDQUFDLEVBQ3RCLHVCQUF1QixDQUN4QjtRQUNELHdCQUF3QiwwQkFBQTtRQUN4QixjQUFjLGdCQUFBO1FBQ2QsNkJBQTZCLCtCQUFBO0tBQzlCLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc051bWJlcn0gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCB7Q2hhbm5lbH0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7cmVkdWNlfSBmcm9tICcuLi9lbmNvZGluZyc7XG5pbXBvcnQge0FnZ3JlZ2F0ZWRGaWVsZERlZiwgQmluVHJhbnNmb3JtLCBDYWxjdWxhdGVUcmFuc2Zvcm0sIFRpbWVVbml0VHJhbnNmb3JtfSBmcm9tICcuLi90cmFuc2Zvcm0nO1xuaW1wb3J0IHtFbmNvZGluZywgZm9yRWFjaH0gZnJvbSAnLi8uLi9lbmNvZGluZyc7XG5pbXBvcnQge0ZpZWxkLCBGaWVsZERlZiwgaXNDb250aW51b3VzLCBpc0ZpZWxkRGVmLCBQb3NpdGlvbkZpZWxkRGVmLCB2Z0ZpZWxkfSBmcm9tICcuLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLy4uL2xvZyc7XG5pbXBvcnQge01hcmtDb25maWd9IGZyb20gJy4vLi4vbWFyayc7XG5pbXBvcnQge0dlbmVyaWNVbml0U3BlYywgTm9ybWFsaXplZExheWVyU3BlY30gZnJvbSAnLi8uLi9zcGVjJztcbmltcG9ydCB7T3JpZW50fSBmcm9tICcuLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7Z2V0TWFya1NwZWNpZmljQ29uZmlnTWl4aW5zfSBmcm9tICcuL2NvbW1vbic7XG5cblxuZXhwb3J0IGNvbnN0IEJPWFBMT1Q6ICdib3gtcGxvdCcgPSAnYm94LXBsb3QnO1xuZXhwb3J0IHR5cGUgQk9YUExPVCA9IHR5cGVvZiBCT1hQTE9UO1xuZXhwb3J0IHR5cGUgQm94UGxvdFN0eWxlID0gJ2JveFdoaXNrZXInIHwgJ2JveCcgfCAnYm94TWlkJztcblxuXG5leHBvcnQgaW50ZXJmYWNlIEJveFBsb3REZWYge1xuICAvKipcbiAgICogVHlwZSBvZiB0aGUgbWFyay4gIEZvciBib3ggcGxvdHMsIHRoaXMgc2hvdWxkIGFsd2F5cyBiZSBgXCJib3gtcGxvdFwiYC5cbiAgICogW2JveHBsb3RdKGNvbXBvc2l0ZW1hcmsuaHRtbCNib3hwbG90KVxuICAgKi9cbiAgdHlwZTogQk9YUExPVDtcblxuICAvKipcbiAgICogT3JpZW50YXRpb24gb2YgdGhlIGJveCBwbG90LiAgVGhpcyBpcyBub3JtYWxseSBhdXRvbWF0aWNhbGx5IGRldGVybWluZWQsIGJ1dCBjYW4gYmUgc3BlY2lmaWVkIHdoZW4gdGhlIG9yaWVudGF0aW9uIGlzIGFtYmlndW91cyBhbmQgY2Fubm90IGJlIGF1dG9tYXRpY2FsbHkgZGV0ZXJtaW5lZC5cbiAgICovXG4gIG9yaWVudD86IE9yaWVudDtcblxuICAvKipcbiAgICogRXh0ZW50IGlzIHVzZWQgdG8gZGV0ZXJtaW5lIHdoZXJlIHRoZSB3aGlza2VycyBleHRlbmQgdG8uIFRoZSBvcHRpb25zIGFyZVxuICAgKiAtIGBcIm1pbi1tYXhcIjogbWluIGFuZCBtYXggYXJlIHRoZSBsb3dlciBhbmQgdXBwZXIgd2hpc2tlcnMgcmVzcGVjdGl2ZWx5LlxuICAgKiAtICBBIHNjYWxhciAoaW50ZWdlciBvciBmbG9hdGluZyBwb2ludCBudW1iZXIpIHRoYXQgd2lsbCBiZSBtdWx0aXBsaWVkIGJ5IHRoZSBJUVIgYW5kIHRoZSBwcm9kdWN0IHdpbGwgYmUgYWRkZWQgdG8gdGhlIHRoaXJkIHF1YXJ0aWxlIHRvIGdldCB0aGUgdXBwZXIgd2hpc2tlciBhbmQgc3VidHJhY3RlZCBmcm9tIHRoZSBmaXJzdCBxdWFydGlsZSB0byBnZXQgdGhlIGxvd2VyIHdoaXNrZXIuXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBgXCIxLjVcImAuXG4gICAqL1xuICBleHRlbnQ/OiAnbWluLW1heCcgfCBudW1iZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0JveFBsb3REZWYobWFyazogQk9YUExPVCB8IEJveFBsb3REZWYpOiBtYXJrIGlzIEJveFBsb3REZWYge1xuICByZXR1cm4gISFtYXJrWyd0eXBlJ107XG59XG5cbmV4cG9ydCBjb25zdCBCT1hQTE9UX1NUWUxFUzogQm94UGxvdFN0eWxlW10gPSBbJ2JveFdoaXNrZXInLCAnYm94JywgJ2JveE1pZCddO1xuXG5leHBvcnQgaW50ZXJmYWNlIEJveFBsb3RDb25maWcgZXh0ZW5kcyBNYXJrQ29uZmlnIHtcbiAgLyoqIFNpemUgb2YgdGhlIGJveCBhbmQgbWlkIHRpY2sgb2YgYSBib3ggcGxvdCAqL1xuICBzaXplPzogbnVtYmVyO1xuICAvKiogVGhlIGRlZmF1bHQgZXh0ZW50LCB3aGljaCBpcyB1c2VkIHRvIGRldGVybWluZSB3aGVyZSB0aGUgd2hpc2tlcnMgZXh0ZW5kIHRvLiBUaGUgb3B0aW9ucyBhcmVcbiAgICogLSBgXCJtaW4tbWF4XCI6IG1pbiBhbmQgbWF4IGFyZSB0aGUgbG93ZXIgYW5kIHVwcGVyIHdoaXNrZXJzIHJlc3BlY3RpdmVseS5cbiAgICogLSBgXCJudW1iZXJcIjogQSBzY2FsYXIgKGludGVnZXIgb3IgZmxvYXRpbmcgcG9pbnQgbnVtYmVyKSB0aGF0IHdpbGwgYmUgbXVsdGlwbGllZCBieSB0aGUgSVFSIGFuZCB0aGUgcHJvZHVjdCB3aWxsIGJlIGFkZGVkIHRvIHRoZSB0aGlyZCBxdWFydGlsZSB0byBnZXQgdGhlIHVwcGVyIHdoaXNrZXIgYW5kIHN1YnRyYWN0ZWQgZnJvbSB0aGUgZmlyc3QgcXVhcnRpbGUgdG8gZ2V0IHRoZSBsb3dlciB3aGlza2VyLlxuICAgKi9cbiAgZXh0ZW50PzogJ21pbi1tYXgnIHwgbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJveFBsb3RDb25maWdNaXhpbnMge1xuICAvKipcbiAgICogQm94IENvbmZpZ1xuICAgKiBAaGlkZVxuICAgKi9cbiAgYm94PzogQm94UGxvdENvbmZpZztcblxuICAvKipcbiAgICogQGhpZGVcbiAgICovXG4gIGJveFdoaXNrZXI/OiBNYXJrQ29uZmlnO1xuXG4gIC8qKlxuICAgKiBAaGlkZVxuICAgKi9cbiAgYm94TWlkPzogTWFya0NvbmZpZztcbn1cblxuZXhwb3J0IGNvbnN0IFZMX09OTFlfQk9YUExPVF9DT05GSUdfUFJPUEVSVFlfSU5ERVg6IHtcbiAgW2sgaW4ga2V5b2YgQm94UGxvdENvbmZpZ01peGluc10/OiAoa2V5b2YgQm94UGxvdENvbmZpZ01peGluc1trXSlbXVxufSA9IHtcbiAgYm94OiBbJ3NpemUnLCAnY29sb3InLCAnZXh0ZW50J10sXG4gIGJveFdoaXNrZXI6IFsnY29sb3InXSxcbiAgYm94TWlkOiBbJ2NvbG9yJ11cbn07XG5cbmNvbnN0IHN1cHBvcnRlZENoYW5uZWxzOiBDaGFubmVsW10gPSBbJ3gnLCAneScsICdjb2xvcicsICdkZXRhaWwnLCAnb3BhY2l0eScsICdzaXplJ107XG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyVW5zdXBwb3J0ZWRDaGFubmVscyhzcGVjOiBHZW5lcmljVW5pdFNwZWM8RW5jb2Rpbmc8c3RyaW5nPiwgQk9YUExPVCB8IEJveFBsb3REZWY+KTogR2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPHN0cmluZz4sIEJPWFBMT1QgfCBCb3hQbG90RGVmPiB7XG4gIHJldHVybiB7XG4gICAgLi4uc3BlYyxcbiAgICBlbmNvZGluZzogcmVkdWNlKHNwZWMuZW5jb2RpbmcsIChuZXdFbmNvZGluZywgZmllbGREZWYsIGNoYW5uZWwpID0+IHtcbiAgICAgIGlmIChzdXBwb3J0ZWRDaGFubmVscy5pbmRleE9mKGNoYW5uZWwpID4gLTEpIHtcbiAgICAgICAgbmV3RW5jb2RpbmdbY2hhbm5lbF0gPSBmaWVsZERlZjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmluY29tcGF0aWJsZUNoYW5uZWwoY2hhbm5lbCwgQk9YUExPVCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ld0VuY29kaW5nO1xuICAgIH0sIHt9KSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUJveFBsb3Qoc3BlYzogR2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPHN0cmluZz4sIEJPWFBMT1QgfCBCb3hQbG90RGVmPiwgY29uZmlnOiBDb25maWcpOiBOb3JtYWxpemVkTGF5ZXJTcGVjIHtcbiAgc3BlYyA9IGZpbHRlclVuc3VwcG9ydGVkQ2hhbm5lbHMoc3BlYyk7XG4gIC8vIFRPRE86IHVzZSBzZWxlY3Rpb25cbiAgY29uc3Qge21hcmssIGVuY29kaW5nLCBzZWxlY3Rpb24sIHByb2plY3Rpb246IF9wLCAuLi5vdXRlclNwZWN9ID0gc3BlYztcblxuICBsZXQga0lRUlNjYWxhcjogbnVtYmVyID0gdW5kZWZpbmVkO1xuICBpZiAoaXNOdW1iZXIoY29uZmlnLmJveC5leHRlbnQpKSB7XG4gICAga0lRUlNjYWxhciA9IGNvbmZpZy5ib3guZXh0ZW50O1xuICB9XG5cbiAgaWYgKGlzQm94UGxvdERlZihtYXJrKSkge1xuICAgIGlmIChtYXJrLmV4dGVudCkge1xuICAgICAgaWYobWFyay5leHRlbnQgPT09ICdtaW4tbWF4Jykge1xuICAgICAgICBrSVFSU2NhbGFyID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG9yaWVudDogT3JpZW50ID0gYm94T3JpZW50KHNwZWMpO1xuICBjb25zdCB7dHJhbnNmb3JtLCBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYsIGNvbnRpbnVvdXNBeGlzLCBlbmNvZGluZ1dpdGhvdXRDb250aW51b3VzQXhpc30gPSBib3hQYXJhbXMoc3BlYywgb3JpZW50LCBrSVFSU2NhbGFyKTtcblxuICBjb25zdCB7Y29sb3IsIHNpemUsIC4uLmVuY29kaW5nV2l0aG91dFNpemVDb2xvckFuZENvbnRpbnVvdXNBeGlzfSA9IGVuY29kaW5nV2l0aG91dENvbnRpbnVvdXNBeGlzO1xuXG4gIC8vIFNpemUgZW5jb2Rpbmcgb3IgdGhlIGRlZmF1bHQgY29uZmlnLmJveC5zaXplIGlzIGFwcGxpZWQgdG8gYm94IGFuZCBib3hNaWRcbiAgY29uc3Qgc2l6ZU1peGlucyA9IHNpemUgPyB7c2l6ZX0gOiBnZXRNYXJrU3BlY2lmaWNDb25maWdNaXhpbnMoY29uZmlnLmJveCwgJ3NpemUnKTtcblxuICBjb25zdCBjb250aW51b3VzQXhpc1NjYWxlQW5kQXhpcyA9IHt9O1xuICBpZiAoY29udGludW91c0F4aXNDaGFubmVsRGVmLnNjYWxlKSB7XG4gICAgY29udGludW91c0F4aXNTY2FsZUFuZEF4aXNbJ3NjYWxlJ10gPSBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuc2NhbGU7XG4gIH1cbiAgaWYgKGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5heGlzKSB7XG4gICAgY29udGludW91c0F4aXNTY2FsZUFuZEF4aXNbJ2F4aXMnXSA9IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5heGlzO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5vdXRlclNwZWMsXG4gICAgdHJhbnNmb3JtLFxuICAgIGxheWVyOiBbXG4gICAgICB7IC8vIGxvd2VyIHdoaXNrZXJcbiAgICAgICAgbWFyazoge1xuICAgICAgICAgIHR5cGU6ICdydWxlJyxcbiAgICAgICAgICBzdHlsZTogJ2JveFdoaXNrZXInXG4gICAgICAgIH0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgW2NvbnRpbnVvdXNBeGlzXToge1xuICAgICAgICAgICAgZmllbGQ6ICdsb3dlcl93aGlza2VyXycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICAgICAgICB0eXBlOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYudHlwZSxcbiAgICAgICAgICAgIC4uLmNvbnRpbnVvdXNBeGlzU2NhbGVBbmRBeGlzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBbY29udGludW91c0F4aXMgKyAnMiddOiB7XG4gICAgICAgICAgICBmaWVsZDogJ2xvd2VyX2JveF8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgICAgICAgICAgdHlwZTogY29udGludW91c0F4aXNDaGFubmVsRGVmLnR5cGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIC4uLmVuY29kaW5nV2l0aG91dFNpemVDb2xvckFuZENvbnRpbnVvdXNBeGlzLFxuICAgICAgICAgIC4uLmdldE1hcmtTcGVjaWZpY0NvbmZpZ01peGlucyhjb25maWcuYm94V2hpc2tlciwgJ2NvbG9yJylcbiAgICAgICAgfVxuICAgICAgfSwgeyAvLyB1cHBlciB3aGlza2VyXG4gICAgICAgIG1hcms6IHtcbiAgICAgICAgICB0eXBlOiAncnVsZScsXG4gICAgICAgICAgc3R5bGU6ICdib3hXaGlza2VyJ1xuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFtjb250aW51b3VzQXhpc106IHtcbiAgICAgICAgICAgIGZpZWxkOiAndXBwZXJfYm94XycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICAgICAgICB0eXBlOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYudHlwZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgW2NvbnRpbnVvdXNBeGlzICsgJzInXToge1xuICAgICAgICAgICAgZmllbGQ6ICd1cHBlcl93aGlza2VyXycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICAgICAgICB0eXBlOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYudHlwZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgLi4uZW5jb2RpbmdXaXRob3V0U2l6ZUNvbG9yQW5kQ29udGludW91c0F4aXMsXG4gICAgICAgICAgLi4uZ2V0TWFya1NwZWNpZmljQ29uZmlnTWl4aW5zKGNvbmZpZy5ib3hXaGlza2VyLCAnY29sb3InKVxuICAgICAgICB9XG4gICAgICB9LCB7IC8vIGJveCAocTEgdG8gcTMpXG4gICAgICAgIC4uLihzZWxlY3Rpb24gPyB7c2VsZWN0aW9ufSA6IHt9KSxcbiAgICAgICAgbWFyazoge1xuICAgICAgICAgIHR5cGU6ICdiYXInLFxuICAgICAgICAgIHN0eWxlOiAnYm94J1xuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFtjb250aW51b3VzQXhpc106IHtcbiAgICAgICAgICAgIGZpZWxkOiAnbG93ZXJfYm94XycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICAgICAgICB0eXBlOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYudHlwZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgW2NvbnRpbnVvdXNBeGlzICsgJzInXToge1xuICAgICAgICAgICAgZmllbGQ6ICd1cHBlcl9ib3hfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZCxcbiAgICAgICAgICAgIHR5cGU6IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi50eXBlXG4gICAgICAgICAgfSxcbiAgICAgICAgICAuLi5lbmNvZGluZ1dpdGhvdXRDb250aW51b3VzQXhpcyxcbiAgICAgICAgICAuLi4oZW5jb2RpbmdXaXRob3V0Q29udGludW91c0F4aXMuY29sb3IgPyB7fSA6IGdldE1hcmtTcGVjaWZpY0NvbmZpZ01peGlucyhjb25maWcuYm94LCAnY29sb3InKSksXG4gICAgICAgICAgLi4uc2l6ZU1peGlucyxcbiAgICAgICAgfVxuICAgICAgfSwgeyAvLyBtaWQgdGlja1xuICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgdHlwZTogJ3RpY2snLFxuICAgICAgICAgIHN0eWxlOiAnYm94TWlkJ1xuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFtjb250aW51b3VzQXhpc106IHtcbiAgICAgICAgICAgIGZpZWxkOiAnbWlkX2JveF8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgICAgICAgICAgdHlwZTogY29udGludW91c0F4aXNDaGFubmVsRGVmLnR5cGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIC4uLmVuY29kaW5nV2l0aG91dFNpemVDb2xvckFuZENvbnRpbnVvdXNBeGlzLFxuICAgICAgICAgIC4uLmdldE1hcmtTcGVjaWZpY0NvbmZpZ01peGlucyhjb25maWcuYm94TWlkLCAnY29sb3InKSxcbiAgICAgICAgICAuLi5zaXplTWl4aW5zLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgXVxuICB9O1xufVxuXG5mdW5jdGlvbiBib3hPcmllbnQoc3BlYzogR2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPEZpZWxkPiwgQk9YUExPVCB8IEJveFBsb3REZWY+KTogT3JpZW50IHtcbiAgY29uc3Qge21hcms6IG1hcmssIGVuY29kaW5nOiBlbmNvZGluZywgcHJvamVjdGlvbjogX3AsIC4uLl9vdXRlclNwZWN9ID0gc3BlYztcblxuICBpZiAoaXNGaWVsZERlZihlbmNvZGluZy54KSAmJiBpc0NvbnRpbnVvdXMoZW5jb2RpbmcueCkpIHtcbiAgICAvLyB4IGlzIGNvbnRpbnVvdXNcbiAgICBpZiAoaXNGaWVsZERlZihlbmNvZGluZy55KSAmJiBpc0NvbnRpbnVvdXMoZW5jb2RpbmcueSkpIHtcbiAgICAgIC8vIGJvdGggeCBhbmQgeSBhcmUgY29udGludW91c1xuICAgICAgaWYgKGVuY29kaW5nLnguYWdncmVnYXRlID09PSB1bmRlZmluZWQgJiYgZW5jb2RpbmcueS5hZ2dyZWdhdGUgPT09IEJPWFBMT1QpIHtcbiAgICAgICAgcmV0dXJuICd2ZXJ0aWNhbCc7XG4gICAgICB9IGVsc2UgaWYgKGVuY29kaW5nLnkuYWdncmVnYXRlID09PSB1bmRlZmluZWQgJiYgZW5jb2RpbmcueC5hZ2dyZWdhdGUgPT09IEJPWFBMT1QpIHtcbiAgICAgICAgcmV0dXJuICdob3Jpem9udGFsJztcbiAgICAgIH0gZWxzZSBpZiAoZW5jb2RpbmcueC5hZ2dyZWdhdGUgPT09IEJPWFBMT1QgJiYgZW5jb2RpbmcueS5hZ2dyZWdhdGUgPT09IEJPWFBMT1QpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCb3RoIHggYW5kIHkgY2Fubm90IGhhdmUgYWdncmVnYXRlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaXNCb3hQbG90RGVmKG1hcmspICYmIG1hcmsub3JpZW50KSB7XG4gICAgICAgICAgcmV0dXJuIG1hcmsub3JpZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZGVmYXVsdCBvcmllbnRhdGlvbiA9IHZlcnRpY2FsXG4gICAgICAgIHJldHVybiAndmVydGljYWwnO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHggaXMgY29udGludW91cyBidXQgeSBpcyBub3RcbiAgICByZXR1cm4gJ2hvcml6b250YWwnO1xuICB9IGVsc2UgaWYgKGlzRmllbGREZWYoZW5jb2RpbmcueSkgJiYgaXNDb250aW51b3VzKGVuY29kaW5nLnkpKSB7XG4gICAgLy8geSBpcyBjb250aW51b3VzIGJ1dCB4IGlzIG5vdFxuICAgIHJldHVybiAndmVydGljYWwnO1xuICB9IGVsc2Uge1xuICAgIC8vIE5laXRoZXIgeCBub3IgeSBpcyBjb250aW51b3VzLlxuICAgIHRocm93IG5ldyBFcnJvcignTmVlZCBhIHZhbGlkIGNvbnRpbnVvdXMgYXhpcyBmb3IgYm94cGxvdHMnKTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGJveENvbnRpbm91c0F4aXMoc3BlYzogR2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPHN0cmluZz4sIEJPWFBMT1QgfCBCb3hQbG90RGVmPiwgb3JpZW50OiBPcmllbnQpIHtcbiAgY29uc3Qge21hcms6IG1hcmssIGVuY29kaW5nOiBlbmNvZGluZywgcHJvamVjdGlvbjogX3AsIC4uLl9vdXRlclNwZWN9ID0gc3BlYztcblxuICBsZXQgY29udGludW91c0F4aXNDaGFubmVsRGVmOiBQb3NpdGlvbkZpZWxkRGVmPHN0cmluZz47XG4gIGxldCBjb250aW51b3VzQXhpczogJ3gnIHwgJ3knO1xuXG4gIGlmIChvcmllbnQgPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICBjb250aW51b3VzQXhpcyA9ICd5JztcbiAgICBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYgPSBlbmNvZGluZy55IGFzIEZpZWxkRGVmPHN0cmluZz47IC8vIFNhZmUgdG8gY2FzdCBiZWNhdXNlIGlmIHkgaXMgbm90IGNvbnRpbnVvdXMgZmllbGRkZWYsIHRoZSBvcmllbnQgd291bGQgbm90IGJlIHZlcnRpY2FsLlxuICB9IGVsc2Uge1xuICAgIGNvbnRpbnVvdXNBeGlzID0gJ3gnO1xuICAgIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZiA9IGVuY29kaW5nLnggYXMgRmllbGREZWY8c3RyaW5nPjsgLy8gU2FmZSB0byBjYXN0IGJlY2F1c2UgaWYgeCBpcyBub3QgY29udGludW91cyBmaWVsZGRlZiwgdGhlIG9yaWVudCB3b3VsZCBub3QgYmUgaG9yaXpvbnRhbC5cbiAgfVxuXG4gIGlmIChjb250aW51b3VzQXhpc0NoYW5uZWxEZWYgJiYgY29udGludW91c0F4aXNDaGFubmVsRGVmLmFnZ3JlZ2F0ZSkge1xuICAgIGNvbnN0IHthZ2dyZWdhdGUsIC4uLmNvbnRpbnVvdXNBeGlzV2l0aG91dEFnZ3JlZ2F0ZX0gPSBjb250aW51b3VzQXhpc0NoYW5uZWxEZWY7XG4gICAgaWYgKGFnZ3JlZ2F0ZSAhPT0gQk9YUExPVCkge1xuICAgICAgbG9nLndhcm4oYENvbnRpbnVvdXMgYXhpcyBzaG91bGQgbm90IGhhdmUgY3VzdG9taXplZCBhZ2dyZWdhdGlvbiBmdW5jdGlvbiAke2FnZ3JlZ2F0ZX1gKTtcbiAgICB9XG4gICAgY29udGludW91c0F4aXNDaGFubmVsRGVmID0gY29udGludW91c0F4aXNXaXRob3V0QWdncmVnYXRlO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYsXG4gICAgY29udGludW91c0F4aXNcbiAgfTtcbn1cblxuZnVuY3Rpb24gYm94UGFyYW1zKHNwZWM6IEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZzxzdHJpbmc+LCBCT1hQTE9UIHwgQm94UGxvdERlZj4sIG9yaWVudDogT3JpZW50LCBrSVFSU2NhbGFyOiAnbWluLW1heCcgfCBudW1iZXIpIHtcblxuICBjb25zdCB7Y29udGludW91c0F4aXNDaGFubmVsRGVmLCBjb250aW51b3VzQXhpc30gPSBib3hDb250aW5vdXNBeGlzKHNwZWMsIG9yaWVudCk7XG4gIGNvbnN0IGVuY29kaW5nID0gc3BlYy5lbmNvZGluZztcblxuICBjb25zdCBpc01pbk1heCA9IGtJUVJTY2FsYXIgPT09IHVuZGVmaW5lZDtcbiAgY29uc3QgYWdncmVnYXRlOiBBZ2dyZWdhdGVkRmllbGREZWZbXSA9IFtcbiAgICB7XG4gICAgICBvcDogJ3ExJyxcbiAgICAgIGZpZWxkOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICBhczogJ2xvd2VyX2JveF8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkXG4gICAgfSxcbiAgICB7XG4gICAgICBvcDogJ3EzJyxcbiAgICAgIGZpZWxkOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICBhczogJ3VwcGVyX2JveF8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkXG4gICAgfSxcbiAgICB7XG4gICAgICBvcDogJ21lZGlhbicsXG4gICAgICBmaWVsZDogY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgICAgYXM6ICdtaWRfYm94XycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGRcbiAgICB9XG4gIF07XG4gIGxldCBwb3N0QWdncmVnYXRlQ2FsY3VsYXRlczogQ2FsY3VsYXRlVHJhbnNmb3JtW10gPSBbXTtcblxuICBhZ2dyZWdhdGUucHVzaCh7XG4gICAgb3A6ICdtaW4nLFxuICAgIGZpZWxkOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgYXM6IChpc01pbk1heCA/ICdsb3dlcl93aGlza2VyXycgOiAnbWluXycpICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkXG4gIH0pO1xuICBhZ2dyZWdhdGUucHVzaCh7XG4gICAgb3A6ICdtYXgnLFxuICAgIGZpZWxkOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgYXM6ICAoaXNNaW5NYXggPyAndXBwZXJfd2hpc2tlcl8nIDogJ21heF8nKSArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZFxuICB9KTtcblxuICBpZiAoIWlzTWluTWF4KSB7XG4gICAgcG9zdEFnZ3JlZ2F0ZUNhbGN1bGF0ZXMgPSBbXG4gICAgICB7XG4gICAgICAgIGNhbGN1bGF0ZTogYGRhdHVtLnVwcGVyX2JveF8ke2NvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZH0gLSBkYXR1bS5sb3dlcl9ib3hfJHtjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGR9YCxcbiAgICAgICAgYXM6ICdpcXJfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2FsY3VsYXRlOiBgbWluKGRhdHVtLnVwcGVyX2JveF8ke2NvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZH0gKyBkYXR1bS5pcXJfJHtjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGR9ICogJHtrSVFSU2NhbGFyfSwgZGF0dW0ubWF4XyR7Y29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkfSlgLFxuICAgICAgICBhczogJ3VwcGVyX3doaXNrZXJfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2FsY3VsYXRlOiBgbWF4KGRhdHVtLmxvd2VyX2JveF8ke2NvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZH0gLSBkYXR1bS5pcXJfJHtjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGR9ICogJHtrSVFSU2NhbGFyfSwgZGF0dW0ubWluXyR7Y29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkfSlgLFxuICAgICAgICBhczogJ2xvd2VyX3doaXNrZXJfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZFxuICAgICAgfVxuICAgIF07XG4gIH1cblxuICBjb25zdCBncm91cGJ5OiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCBiaW5zOiBCaW5UcmFuc2Zvcm1bXSA9IFtdO1xuICBjb25zdCB0aW1lVW5pdHM6IFRpbWVVbml0VHJhbnNmb3JtW10gPSBbXTtcblxuICBjb25zdCBlbmNvZGluZ1dpdGhvdXRDb250aW51b3VzQXhpczogRW5jb2Rpbmc8c3RyaW5nPiA9IHt9O1xuICBmb3JFYWNoKGVuY29kaW5nLCAoY2hhbm5lbERlZiwgY2hhbm5lbCkgPT4ge1xuICAgIGlmIChjaGFubmVsID09PSBjb250aW51b3VzQXhpcykge1xuICAgICAgLy8gU2tpcCBjb250aW51b3VzIGF4aXMgYXMgd2UgYWxyZWFkeSBoYW5kbGUgaXQgc2VwYXJhdGVseVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaXNGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgICAgaWYgKGNoYW5uZWxEZWYuYWdncmVnYXRlICYmIGNoYW5uZWxEZWYuYWdncmVnYXRlICE9PSBCT1hQTE9UKSB7XG4gICAgICAgIGFnZ3JlZ2F0ZS5wdXNoKHtcbiAgICAgICAgICBvcDogY2hhbm5lbERlZi5hZ2dyZWdhdGUsXG4gICAgICAgICAgZmllbGQ6IGNoYW5uZWxEZWYuZmllbGQsXG4gICAgICAgICAgYXM6IHZnRmllbGQoY2hhbm5lbERlZilcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKGNoYW5uZWxEZWYuYWdncmVnYXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtZWRGaWVsZCA9IHZnRmllbGQoY2hhbm5lbERlZik7XG5cbiAgICAgICAgLy8gQWRkIGJpbiBvciB0aW1lVW5pdCB0cmFuc2Zvcm0gaWYgYXBwbGljYWJsZVxuICAgICAgICBjb25zdCBiaW4gPSBjaGFubmVsRGVmLmJpbjtcbiAgICAgICAgaWYgKGJpbikge1xuICAgICAgICAgIGNvbnN0IHtmaWVsZH0gPSBjaGFubmVsRGVmO1xuICAgICAgICAgIGJpbnMucHVzaCh7YmluLCBmaWVsZCwgYXM6IHRyYW5zZm9ybWVkRmllbGR9KTtcbiAgICAgICAgfSBlbHNlIGlmIChjaGFubmVsRGVmLnRpbWVVbml0KSB7XG4gICAgICAgICAgY29uc3Qge3RpbWVVbml0LCBmaWVsZH0gPSBjaGFubmVsRGVmO1xuICAgICAgICAgIHRpbWVVbml0cy5wdXNoKHt0aW1lVW5pdCwgZmllbGQsIGFzOiB0cmFuc2Zvcm1lZEZpZWxkfSk7XG4gICAgICAgIH1cblxuICAgICAgICBncm91cGJ5LnB1c2godHJhbnNmb3JtZWRGaWVsZCk7XG4gICAgICB9XG4gICAgICAvLyBub3cgdGhlIGZpZWxkIHNob3VsZCByZWZlciB0byBwb3N0LXRyYW5zZm9ybWVkIGZpZWxkIGluc3RlYWRcbiAgICAgIGVuY29kaW5nV2l0aG91dENvbnRpbnVvdXNBeGlzW2NoYW5uZWxdID0ge1xuICAgICAgICBmaWVsZDogdmdGaWVsZChjaGFubmVsRGVmKSxcbiAgICAgICAgdHlwZTogY2hhbm5lbERlZi50eXBlXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBGb3IgdmFsdWUgZGVmLCBqdXN0IGNvcHlcbiAgICAgIGVuY29kaW5nV2l0aG91dENvbnRpbnVvdXNBeGlzW2NoYW5uZWxdID0gZW5jb2RpbmdbY2hhbm5lbF07XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIHRyYW5zZm9ybTogW10uY29uY2F0KFxuICAgICAgYmlucyxcbiAgICAgIHRpbWVVbml0cyxcbiAgICAgIFt7YWdncmVnYXRlLCBncm91cGJ5fV0sXG4gICAgICBwb3N0QWdncmVnYXRlQ2FsY3VsYXRlc1xuICAgICksXG4gICAgY29udGludW91c0F4aXNDaGFubmVsRGVmLFxuICAgIGNvbnRpbnVvdXNBeGlzLFxuICAgIGVuY29kaW5nV2l0aG91dENvbnRpbnVvdXNBeGlzXG4gIH07XG59XG4iXX0=