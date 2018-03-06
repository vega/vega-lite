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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm94cGxvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb3NpdGVtYXJrL2JveHBsb3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVDQUFtQztBQUduQyx3Q0FBbUM7QUFFbkMsMENBQWdEO0FBQ2hELDBDQUFtRztBQUNuRyw4QkFBZ0M7QUFJaEMsbUNBQXFEO0FBR3hDLFFBQUEsT0FBTyxHQUFlLFVBQVUsQ0FBQztBQTBCOUMsc0JBQTZCLElBQTBCO0lBQ3JELE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFGRCxvQ0FFQztBQUVZLFFBQUEsY0FBYyxHQUFtQixDQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7QUE4QmpFLFFBQUEscUNBQXFDLEdBRTlDO0lBQ0YsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUM7SUFDaEMsVUFBVSxFQUFFLENBQUMsT0FBTyxDQUFDO0lBQ3JCLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQztDQUNsQixDQUFDO0FBRUYsSUFBTSxpQkFBaUIsR0FBYyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDdEYsbUNBQTBDLElBQTZEO0lBQ3JHLE1BQU0sY0FDRCxJQUFJLElBQ1AsUUFBUSxFQUFFLGlCQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsT0FBTztZQUM3RCxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsUUFBUSxDQUFDO1lBQ2xDLENBQUM7WUFB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LENBQUM7Z0JBQ2hELENBQUM7Z0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUN4QixJQUFBLDhCQUFRLEVBQUUsd0JBQUssQ0FBZTtvQkFDckMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFDLFFBQVEsVUFBQSxFQUFFLEtBQUssT0FBQSxFQUFFLEVBQUUsRUFBRSxnQkFBZ0IsRUFBQyxDQUFDLENBQUM7Z0JBQzFELENBQUM7Z0JBRUQsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ2pDLENBQUM7WUFDRCwrREFBK0Q7WUFDL0QsNkJBQTZCLENBQUMsT0FBTyxDQUFDLEdBQUc7Z0JBQ3ZDLEtBQUssRUFBRSxrQkFBTyxDQUFDLFVBQVUsQ0FBQztnQkFDMUIsSUFBSSxFQUFFLFVBQVUsQ0FBQyxJQUFJO2FBQ3RCLENBQUM7UUFDSixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTiwyQkFBMkI7WUFDM0IsNkJBQTZCLENBQUMsT0FBTyxDQUFDLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdELENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQztRQUNMLFNBQVMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUNsQixJQUFJLEVBQ0osU0FBUyxFQUNULENBQUMsRUFBQyxTQUFTLFdBQUEsRUFBRSxPQUFPLFNBQUEsRUFBQyxDQUFDLEVBQ3RCLHVCQUF1QixDQUN4QjtRQUNELHdCQUF3QiwwQkFBQTtRQUN4QixjQUFjLGdCQUFBO1FBQ2QsNkJBQTZCLCtCQUFBO0tBQzlCLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc051bWJlcn0gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCB7Q2hhbm5lbH0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7cmVkdWNlfSBmcm9tICcuLi9lbmNvZGluZyc7XG5pbXBvcnQge0FnZ3JlZ2F0ZWRGaWVsZERlZiwgQmluVHJhbnNmb3JtLCBDYWxjdWxhdGVUcmFuc2Zvcm0sIFRpbWVVbml0VHJhbnNmb3JtfSBmcm9tICcuLi90cmFuc2Zvcm0nO1xuaW1wb3J0IHtFbmNvZGluZywgZm9yRWFjaH0gZnJvbSAnLi8uLi9lbmNvZGluZyc7XG5pbXBvcnQge0ZpZWxkLCBGaWVsZERlZiwgaXNDb250aW51b3VzLCBpc0ZpZWxkRGVmLCBQb3NpdGlvbkZpZWxkRGVmLCB2Z0ZpZWxkfSBmcm9tICcuLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLy4uL2xvZyc7XG5pbXBvcnQge01hcmtDb25maWd9IGZyb20gJy4vLi4vbWFyayc7XG5pbXBvcnQge0dlbmVyaWNVbml0U3BlYywgTGF5ZXJTcGVjfSBmcm9tICcuLy4uL3NwZWMnO1xuaW1wb3J0IHtPcmllbnR9IGZyb20gJy4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtnZXRNYXJrU3BlY2lmaWNDb25maWdNaXhpbnN9IGZyb20gJy4vY29tbW9uJztcblxuXG5leHBvcnQgY29uc3QgQk9YUExPVDogJ2JveC1wbG90JyA9ICdib3gtcGxvdCc7XG5leHBvcnQgdHlwZSBCT1hQTE9UID0gdHlwZW9mIEJPWFBMT1Q7XG5leHBvcnQgdHlwZSBCb3hQbG90U3R5bGUgPSAnYm94V2hpc2tlcicgfCAnYm94JyB8ICdib3hNaWQnO1xuXG5cbmV4cG9ydCBpbnRlcmZhY2UgQm94UGxvdERlZiB7XG4gIC8qKlxuICAgKiBUeXBlIG9mIHRoZSBtYXJrLiAgRm9yIGJveCBwbG90cywgdGhpcyBzaG91bGQgYWx3YXlzIGJlIGBcImJveC1wbG90XCJgLlxuICAgKiBbYm94cGxvdF0oY29tcG9zaXRlbWFyay5odG1sI2JveHBsb3QpXG4gICAqL1xuICB0eXBlOiBCT1hQTE9UO1xuXG4gIC8qKlxuICAgKiBPcmllbnRhdGlvbiBvZiB0aGUgYm94IHBsb3QuICBUaGlzIGlzIG5vcm1hbGx5IGF1dG9tYXRpY2FsbHkgZGV0ZXJtaW5lZCwgYnV0IGNhbiBiZSBzcGVjaWZpZWQgd2hlbiB0aGUgb3JpZW50YXRpb24gaXMgYW1iaWd1b3VzIGFuZCBjYW5ub3QgYmUgYXV0b21hdGljYWxseSBkZXRlcm1pbmVkLlxuICAgKi9cbiAgb3JpZW50PzogT3JpZW50O1xuXG4gIC8qKlxuICAgKiBFeHRlbnQgaXMgdXNlZCB0byBkZXRlcm1pbmUgd2hlcmUgdGhlIHdoaXNrZXJzIGV4dGVuZCB0by4gVGhlIG9wdGlvbnMgYXJlXG4gICAqIC0gYFwibWluLW1heFwiOiBtaW4gYW5kIG1heCBhcmUgdGhlIGxvd2VyIGFuZCB1cHBlciB3aGlza2VycyByZXNwZWN0aXZlbHkuXG4gICAqIC0gIEEgc2NhbGFyIChpbnRlZ2VyIG9yIGZsb2F0aW5nIHBvaW50IG51bWJlcikgdGhhdCB3aWxsIGJlIG11bHRpcGxpZWQgYnkgdGhlIElRUiBhbmQgdGhlIHByb2R1Y3Qgd2lsbCBiZSBhZGRlZCB0byB0aGUgdGhpcmQgcXVhcnRpbGUgdG8gZ2V0IHRoZSB1cHBlciB3aGlza2VyIGFuZCBzdWJ0cmFjdGVkIGZyb20gdGhlIGZpcnN0IHF1YXJ0aWxlIHRvIGdldCB0aGUgbG93ZXIgd2hpc2tlci5cbiAgICogX19EZWZhdWx0IHZhbHVlOl9fIGBcIjEuNVwiYC5cbiAgICovXG4gIGV4dGVudD86ICdtaW4tbWF4JyB8IG51bWJlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQm94UGxvdERlZihtYXJrOiBCT1hQTE9UIHwgQm94UGxvdERlZik6IG1hcmsgaXMgQm94UGxvdERlZiB7XG4gIHJldHVybiAhIW1hcmtbJ3R5cGUnXTtcbn1cblxuZXhwb3J0IGNvbnN0IEJPWFBMT1RfU1RZTEVTOiBCb3hQbG90U3R5bGVbXSA9IFsnYm94V2hpc2tlcicsICdib3gnLCAnYm94TWlkJ107XG5cbmV4cG9ydCBpbnRlcmZhY2UgQm94UGxvdENvbmZpZyBleHRlbmRzIE1hcmtDb25maWcge1xuICAvKiogU2l6ZSBvZiB0aGUgYm94IGFuZCBtaWQgdGljayBvZiBhIGJveCBwbG90ICovXG4gIHNpemU/OiBudW1iZXI7XG4gIC8qKiBUaGUgZGVmYXVsdCBleHRlbnQsIHdoaWNoIGlzIHVzZWQgdG8gZGV0ZXJtaW5lIHdoZXJlIHRoZSB3aGlza2VycyBleHRlbmQgdG8uIFRoZSBvcHRpb25zIGFyZVxuICAgKiAtIGBcIm1pbi1tYXhcIjogbWluIGFuZCBtYXggYXJlIHRoZSBsb3dlciBhbmQgdXBwZXIgd2hpc2tlcnMgcmVzcGVjdGl2ZWx5LlxuICAgKiAtIGBcIm51bWJlclwiOiBBIHNjYWxhciAoaW50ZWdlciBvciBmbG9hdGluZyBwb2ludCBudW1iZXIpIHRoYXQgd2lsbCBiZSBtdWx0aXBsaWVkIGJ5IHRoZSBJUVIgYW5kIHRoZSBwcm9kdWN0IHdpbGwgYmUgYWRkZWQgdG8gdGhlIHRoaXJkIHF1YXJ0aWxlIHRvIGdldCB0aGUgdXBwZXIgd2hpc2tlciBhbmQgc3VidHJhY3RlZCBmcm9tIHRoZSBmaXJzdCBxdWFydGlsZSB0byBnZXQgdGhlIGxvd2VyIHdoaXNrZXIuXG4gICAqL1xuICBleHRlbnQ/OiAnbWluLW1heCcgfCBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQm94UGxvdENvbmZpZ01peGlucyB7XG4gIC8qKlxuICAgKiBCb3ggQ29uZmlnXG4gICAqIEBoaWRlXG4gICAqL1xuICBib3g/OiBCb3hQbG90Q29uZmlnO1xuXG4gIC8qKlxuICAgKiBAaGlkZVxuICAgKi9cbiAgYm94V2hpc2tlcj86IE1hcmtDb25maWc7XG5cbiAgLyoqXG4gICAqIEBoaWRlXG4gICAqL1xuICBib3hNaWQ/OiBNYXJrQ29uZmlnO1xufVxuXG5leHBvcnQgY29uc3QgVkxfT05MWV9CT1hQTE9UX0NPTkZJR19QUk9QRVJUWV9JTkRFWDoge1xuICBbayBpbiBrZXlvZiBCb3hQbG90Q29uZmlnTWl4aW5zXT86IChrZXlvZiBCb3hQbG90Q29uZmlnTWl4aW5zW2tdKVtdXG59ID0ge1xuICBib3g6IFsnc2l6ZScsICdjb2xvcicsICdleHRlbnQnXSxcbiAgYm94V2hpc2tlcjogWydjb2xvciddLFxuICBib3hNaWQ6IFsnY29sb3InXVxufTtcblxuY29uc3Qgc3VwcG9ydGVkQ2hhbm5lbHM6IENoYW5uZWxbXSA9IFsneCcsICd5JywgJ2NvbG9yJywgJ2RldGFpbCcsICdvcGFjaXR5JywgJ3NpemUnXTtcbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJVbnN1cHBvcnRlZENoYW5uZWxzKHNwZWM6IEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZzxzdHJpbmc+LCBCT1hQTE9UIHwgQm94UGxvdERlZj4pOiBHZW5lcmljVW5pdFNwZWM8RW5jb2Rpbmc8c3RyaW5nPiwgQk9YUExPVCB8IEJveFBsb3REZWY+IHtcbiAgcmV0dXJuIHtcbiAgICAuLi5zcGVjLFxuICAgIGVuY29kaW5nOiByZWR1Y2Uoc3BlYy5lbmNvZGluZywgKG5ld0VuY29kaW5nLCBmaWVsZERlZiwgY2hhbm5lbCkgPT4ge1xuICAgICAgaWYgKHN1cHBvcnRlZENoYW5uZWxzLmluZGV4T2YoY2hhbm5lbCkgPiAtMSkge1xuICAgICAgICBuZXdFbmNvZGluZ1tjaGFubmVsXSA9IGZpZWxkRGVmO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuaW5jb21wYXRpYmxlQ2hhbm5lbChjaGFubmVsLCBCT1hQTE9UKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3RW5jb2Rpbmc7XG4gICAgfSwge30pLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplQm94UGxvdChzcGVjOiBHZW5lcmljVW5pdFNwZWM8RW5jb2Rpbmc8c3RyaW5nPiwgQk9YUExPVCB8IEJveFBsb3REZWY+LCBjb25maWc6IENvbmZpZyk6IExheWVyU3BlYyB7XG4gIHNwZWMgPSBmaWx0ZXJVbnN1cHBvcnRlZENoYW5uZWxzKHNwZWMpO1xuICAvLyBUT0RPOiB1c2Ugc2VsZWN0aW9uXG4gIGNvbnN0IHttYXJrLCBlbmNvZGluZywgc2VsZWN0aW9uLCBwcm9qZWN0aW9uOiBfcCwgLi4ub3V0ZXJTcGVjfSA9IHNwZWM7XG5cbiAgbGV0IGtJUVJTY2FsYXI6IG51bWJlciA9IHVuZGVmaW5lZDtcbiAgaWYgKGlzTnVtYmVyKGNvbmZpZy5ib3guZXh0ZW50KSkge1xuICAgIGtJUVJTY2FsYXIgPSBjb25maWcuYm94LmV4dGVudDtcbiAgfVxuXG4gIGlmIChpc0JveFBsb3REZWYobWFyaykpIHtcbiAgICBpZiAobWFyay5leHRlbnQpIHtcbiAgICAgIGlmKG1hcmsuZXh0ZW50ID09PSAnbWluLW1heCcpIHtcbiAgICAgICAga0lRUlNjYWxhciA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdCBvcmllbnQ6IE9yaWVudCA9IGJveE9yaWVudChzcGVjKTtcbiAgY29uc3Qge3RyYW5zZm9ybSwgY29udGludW91c0F4aXNDaGFubmVsRGVmLCBjb250aW51b3VzQXhpcywgZW5jb2RpbmdXaXRob3V0Q29udGludW91c0F4aXN9ID0gYm94UGFyYW1zKHNwZWMsIG9yaWVudCwga0lRUlNjYWxhcik7XG5cbiAgY29uc3Qge2NvbG9yLCBzaXplLCAuLi5lbmNvZGluZ1dpdGhvdXRTaXplQ29sb3JBbmRDb250aW51b3VzQXhpc30gPSBlbmNvZGluZ1dpdGhvdXRDb250aW51b3VzQXhpcztcblxuICAvLyBTaXplIGVuY29kaW5nIG9yIHRoZSBkZWZhdWx0IGNvbmZpZy5ib3guc2l6ZSBpcyBhcHBsaWVkIHRvIGJveCBhbmQgYm94TWlkXG4gIGNvbnN0IHNpemVNaXhpbnMgPSBzaXplID8ge3NpemV9IDogZ2V0TWFya1NwZWNpZmljQ29uZmlnTWl4aW5zKGNvbmZpZy5ib3gsICdzaXplJyk7XG5cbiAgY29uc3QgY29udGludW91c0F4aXNTY2FsZUFuZEF4aXMgPSB7fTtcbiAgaWYgKGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5zY2FsZSkge1xuICAgIGNvbnRpbnVvdXNBeGlzU2NhbGVBbmRBeGlzWydzY2FsZSddID0gY29udGludW91c0F4aXNDaGFubmVsRGVmLnNjYWxlO1xuICB9XG4gIGlmIChjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuYXhpcykge1xuICAgIGNvbnRpbnVvdXNBeGlzU2NhbGVBbmRBeGlzWydheGlzJ10gPSBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuYXhpcztcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLi4ub3V0ZXJTcGVjLFxuICAgIHRyYW5zZm9ybSxcbiAgICBsYXllcjogW1xuICAgICAgeyAvLyBsb3dlciB3aGlza2VyXG4gICAgICAgIG1hcms6IHtcbiAgICAgICAgICB0eXBlOiAncnVsZScsXG4gICAgICAgICAgc3R5bGU6ICdib3hXaGlza2VyJ1xuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFtjb250aW51b3VzQXhpc106IHtcbiAgICAgICAgICAgIGZpZWxkOiAnbG93ZXJfd2hpc2tlcl8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgICAgICAgICAgdHlwZTogY29udGludW91c0F4aXNDaGFubmVsRGVmLnR5cGUsXG4gICAgICAgICAgICAuLi5jb250aW51b3VzQXhpc1NjYWxlQW5kQXhpc1xuICAgICAgICAgIH0sXG4gICAgICAgICAgW2NvbnRpbnVvdXNBeGlzICsgJzInXToge1xuICAgICAgICAgICAgZmllbGQ6ICdsb3dlcl9ib3hfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZCxcbiAgICAgICAgICAgIHR5cGU6IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi50eXBlXG4gICAgICAgICAgfSxcbiAgICAgICAgICAuLi5lbmNvZGluZ1dpdGhvdXRTaXplQ29sb3JBbmRDb250aW51b3VzQXhpcyxcbiAgICAgICAgICAuLi5nZXRNYXJrU3BlY2lmaWNDb25maWdNaXhpbnMoY29uZmlnLmJveFdoaXNrZXIsICdjb2xvcicpXG4gICAgICAgIH1cbiAgICAgIH0sIHsgLy8gdXBwZXIgd2hpc2tlclxuICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgdHlwZTogJ3J1bGUnLFxuICAgICAgICAgIHN0eWxlOiAnYm94V2hpc2tlcidcbiAgICAgICAgfSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICBbY29udGludW91c0F4aXNdOiB7XG4gICAgICAgICAgICBmaWVsZDogJ3VwcGVyX2JveF8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgICAgICAgICAgdHlwZTogY29udGludW91c0F4aXNDaGFubmVsRGVmLnR5cGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFtjb250aW51b3VzQXhpcyArICcyJ106IHtcbiAgICAgICAgICAgIGZpZWxkOiAndXBwZXJfd2hpc2tlcl8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgICAgICAgICAgdHlwZTogY29udGludW91c0F4aXNDaGFubmVsRGVmLnR5cGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIC4uLmVuY29kaW5nV2l0aG91dFNpemVDb2xvckFuZENvbnRpbnVvdXNBeGlzLFxuICAgICAgICAgIC4uLmdldE1hcmtTcGVjaWZpY0NvbmZpZ01peGlucyhjb25maWcuYm94V2hpc2tlciwgJ2NvbG9yJylcbiAgICAgICAgfVxuICAgICAgfSwgeyAvLyBib3ggKHExIHRvIHEzKVxuICAgICAgICAuLi4oc2VsZWN0aW9uID8ge3NlbGVjdGlvbn0gOiB7fSksXG4gICAgICAgIG1hcms6IHtcbiAgICAgICAgICB0eXBlOiAnYmFyJyxcbiAgICAgICAgICBzdHlsZTogJ2JveCdcbiAgICAgICAgfSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICBbY29udGludW91c0F4aXNdOiB7XG4gICAgICAgICAgICBmaWVsZDogJ2xvd2VyX2JveF8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgICAgICAgICAgdHlwZTogY29udGludW91c0F4aXNDaGFubmVsRGVmLnR5cGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFtjb250aW51b3VzQXhpcyArICcyJ106IHtcbiAgICAgICAgICAgIGZpZWxkOiAndXBwZXJfYm94XycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICAgICAgICB0eXBlOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYudHlwZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgLi4uZW5jb2RpbmdXaXRob3V0Q29udGludW91c0F4aXMsXG4gICAgICAgICAgLi4uKGVuY29kaW5nV2l0aG91dENvbnRpbnVvdXNBeGlzLmNvbG9yID8ge30gOiBnZXRNYXJrU3BlY2lmaWNDb25maWdNaXhpbnMoY29uZmlnLmJveCwgJ2NvbG9yJykpLFxuICAgICAgICAgIC4uLnNpemVNaXhpbnMsXG4gICAgICAgIH1cbiAgICAgIH0sIHsgLy8gbWlkIHRpY2tcbiAgICAgICAgbWFyazoge1xuICAgICAgICAgIHR5cGU6ICd0aWNrJyxcbiAgICAgICAgICBzdHlsZTogJ2JveE1pZCdcbiAgICAgICAgfSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICBbY29udGludW91c0F4aXNdOiB7XG4gICAgICAgICAgICBmaWVsZDogJ21pZF9ib3hfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZCxcbiAgICAgICAgICAgIHR5cGU6IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi50eXBlXG4gICAgICAgICAgfSxcbiAgICAgICAgICAuLi5lbmNvZGluZ1dpdGhvdXRTaXplQ29sb3JBbmRDb250aW51b3VzQXhpcyxcbiAgICAgICAgICAuLi5nZXRNYXJrU3BlY2lmaWNDb25maWdNaXhpbnMoY29uZmlnLmJveE1pZCwgJ2NvbG9yJyksXG4gICAgICAgICAgLi4uc2l6ZU1peGlucyxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn1cblxuZnVuY3Rpb24gYm94T3JpZW50KHNwZWM6IEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZzxGaWVsZD4sIEJPWFBMT1QgfCBCb3hQbG90RGVmPik6IE9yaWVudCB7XG4gIGNvbnN0IHttYXJrOiBtYXJrLCBlbmNvZGluZzogZW5jb2RpbmcsIHByb2plY3Rpb246IF9wLCAuLi5fb3V0ZXJTcGVjfSA9IHNwZWM7XG5cbiAgaWYgKGlzRmllbGREZWYoZW5jb2RpbmcueCkgJiYgaXNDb250aW51b3VzKGVuY29kaW5nLngpKSB7XG4gICAgLy8geCBpcyBjb250aW51b3VzXG4gICAgaWYgKGlzRmllbGREZWYoZW5jb2RpbmcueSkgJiYgaXNDb250aW51b3VzKGVuY29kaW5nLnkpKSB7XG4gICAgICAvLyBib3RoIHggYW5kIHkgYXJlIGNvbnRpbnVvdXNcbiAgICAgIGlmIChlbmNvZGluZy54LmFnZ3JlZ2F0ZSA9PT0gdW5kZWZpbmVkICYmIGVuY29kaW5nLnkuYWdncmVnYXRlID09PSBCT1hQTE9UKSB7XG4gICAgICAgIHJldHVybiAndmVydGljYWwnO1xuICAgICAgfSBlbHNlIGlmIChlbmNvZGluZy55LmFnZ3JlZ2F0ZSA9PT0gdW5kZWZpbmVkICYmIGVuY29kaW5nLnguYWdncmVnYXRlID09PSBCT1hQTE9UKSB7XG4gICAgICAgIHJldHVybiAnaG9yaXpvbnRhbCc7XG4gICAgICB9IGVsc2UgaWYgKGVuY29kaW5nLnguYWdncmVnYXRlID09PSBCT1hQTE9UICYmIGVuY29kaW5nLnkuYWdncmVnYXRlID09PSBCT1hQTE9UKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQm90aCB4IGFuZCB5IGNhbm5vdCBoYXZlIGFnZ3JlZ2F0ZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGlzQm94UGxvdERlZihtYXJrKSAmJiBtYXJrLm9yaWVudCkge1xuICAgICAgICAgIHJldHVybiBtYXJrLm9yaWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGRlZmF1bHQgb3JpZW50YXRpb24gPSB2ZXJ0aWNhbFxuICAgICAgICByZXR1cm4gJ3ZlcnRpY2FsJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB4IGlzIGNvbnRpbnVvdXMgYnV0IHkgaXMgbm90XG4gICAgcmV0dXJuICdob3Jpem9udGFsJztcbiAgfSBlbHNlIGlmIChpc0ZpZWxkRGVmKGVuY29kaW5nLnkpICYmIGlzQ29udGludW91cyhlbmNvZGluZy55KSkge1xuICAgIC8vIHkgaXMgY29udGludW91cyBidXQgeCBpcyBub3RcbiAgICByZXR1cm4gJ3ZlcnRpY2FsJztcbiAgfSBlbHNlIHtcbiAgICAvLyBOZWl0aGVyIHggbm9yIHkgaXMgY29udGludW91cy5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05lZWQgYSB2YWxpZCBjb250aW51b3VzIGF4aXMgZm9yIGJveHBsb3RzJyk7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBib3hDb250aW5vdXNBeGlzKHNwZWM6IEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZzxzdHJpbmc+LCBCT1hQTE9UIHwgQm94UGxvdERlZj4sIG9yaWVudDogT3JpZW50KSB7XG4gIGNvbnN0IHttYXJrOiBtYXJrLCBlbmNvZGluZzogZW5jb2RpbmcsIHByb2plY3Rpb246IF9wLCAuLi5fb3V0ZXJTcGVjfSA9IHNwZWM7XG5cbiAgbGV0IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZjogUG9zaXRpb25GaWVsZERlZjxzdHJpbmc+O1xuICBsZXQgY29udGludW91c0F4aXM6ICd4JyB8ICd5JztcblxuICBpZiAob3JpZW50ID09PSAndmVydGljYWwnKSB7XG4gICAgY29udGludW91c0F4aXMgPSAneSc7XG4gICAgY29udGludW91c0F4aXNDaGFubmVsRGVmID0gZW5jb2RpbmcueSBhcyBGaWVsZERlZjxzdHJpbmc+OyAvLyBTYWZlIHRvIGNhc3QgYmVjYXVzZSBpZiB5IGlzIG5vdCBjb250aW51b3VzIGZpZWxkZGVmLCB0aGUgb3JpZW50IHdvdWxkIG5vdCBiZSB2ZXJ0aWNhbC5cbiAgfSBlbHNlIHtcbiAgICBjb250aW51b3VzQXhpcyA9ICd4JztcbiAgICBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYgPSBlbmNvZGluZy54IGFzIEZpZWxkRGVmPHN0cmluZz47IC8vIFNhZmUgdG8gY2FzdCBiZWNhdXNlIGlmIHggaXMgbm90IGNvbnRpbnVvdXMgZmllbGRkZWYsIHRoZSBvcmllbnQgd291bGQgbm90IGJlIGhvcml6b250YWwuXG4gIH1cblxuICBpZiAoY29udGludW91c0F4aXNDaGFubmVsRGVmICYmIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5hZ2dyZWdhdGUpIHtcbiAgICBjb25zdCB7YWdncmVnYXRlLCAuLi5jb250aW51b3VzQXhpc1dpdGhvdXRBZ2dyZWdhdGV9ID0gY29udGludW91c0F4aXNDaGFubmVsRGVmO1xuICAgIGlmIChhZ2dyZWdhdGUgIT09IEJPWFBMT1QpIHtcbiAgICAgIGxvZy53YXJuKGBDb250aW51b3VzIGF4aXMgc2hvdWxkIG5vdCBoYXZlIGN1c3RvbWl6ZWQgYWdncmVnYXRpb24gZnVuY3Rpb24gJHthZ2dyZWdhdGV9YCk7XG4gICAgfVxuICAgIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZiA9IGNvbnRpbnVvdXNBeGlzV2l0aG91dEFnZ3JlZ2F0ZTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY29udGludW91c0F4aXNDaGFubmVsRGVmLFxuICAgIGNvbnRpbnVvdXNBeGlzXG4gIH07XG59XG5cbmZ1bmN0aW9uIGJveFBhcmFtcyhzcGVjOiBHZW5lcmljVW5pdFNwZWM8RW5jb2Rpbmc8c3RyaW5nPiwgQk9YUExPVCB8IEJveFBsb3REZWY+LCBvcmllbnQ6IE9yaWVudCwga0lRUlNjYWxhcjogJ21pbi1tYXgnIHwgbnVtYmVyKSB7XG5cbiAgY29uc3Qge2NvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZiwgY29udGludW91c0F4aXN9ID0gYm94Q29udGlub3VzQXhpcyhzcGVjLCBvcmllbnQpO1xuICBjb25zdCBlbmNvZGluZyA9IHNwZWMuZW5jb2Rpbmc7XG5cbiAgY29uc3QgaXNNaW5NYXggPSBrSVFSU2NhbGFyID09PSB1bmRlZmluZWQ7XG4gIGNvbnN0IGFnZ3JlZ2F0ZTogQWdncmVnYXRlZEZpZWxkRGVmW10gPSBbXG4gICAge1xuICAgICAgb3A6ICdxMScsXG4gICAgICBmaWVsZDogY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgICAgYXM6ICdsb3dlcl9ib3hfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZFxuICAgIH0sXG4gICAge1xuICAgICAgb3A6ICdxMycsXG4gICAgICBmaWVsZDogY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgICAgYXM6ICd1cHBlcl9ib3hfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZFxuICAgIH0sXG4gICAge1xuICAgICAgb3A6ICdtZWRpYW4nLFxuICAgICAgZmllbGQ6IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZCxcbiAgICAgIGFzOiAnbWlkX2JveF8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkXG4gICAgfVxuICBdO1xuICBsZXQgcG9zdEFnZ3JlZ2F0ZUNhbGN1bGF0ZXM6IENhbGN1bGF0ZVRyYW5zZm9ybVtdID0gW107XG5cbiAgYWdncmVnYXRlLnB1c2goe1xuICAgIG9wOiAnbWluJyxcbiAgICBmaWVsZDogY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgIGFzOiAoaXNNaW5NYXggPyAnbG93ZXJfd2hpc2tlcl8nIDogJ21pbl8nKSArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZFxuICB9KTtcbiAgYWdncmVnYXRlLnB1c2goe1xuICAgIG9wOiAnbWF4JyxcbiAgICBmaWVsZDogY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgIGFzOiAgKGlzTWluTWF4ID8gJ3VwcGVyX3doaXNrZXJfJyA6ICdtYXhfJykgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGRcbiAgfSk7XG5cbiAgaWYgKCFpc01pbk1heCkge1xuICAgIHBvc3RBZ2dyZWdhdGVDYWxjdWxhdGVzID0gW1xuICAgICAge1xuICAgICAgICBjYWxjdWxhdGU6IGBkYXR1bS51cHBlcl9ib3hfJHtjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGR9IC0gZGF0dW0ubG93ZXJfYm94XyR7Y29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkfWAsXG4gICAgICAgIGFzOiAnaXFyXycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGRcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNhbGN1bGF0ZTogYG1pbihkYXR1bS51cHBlcl9ib3hfJHtjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGR9ICsgZGF0dW0uaXFyXyR7Y29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkfSAqICR7a0lRUlNjYWxhcn0sIGRhdHVtLm1heF8ke2NvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZH0pYCxcbiAgICAgICAgYXM6ICd1cHBlcl93aGlza2VyXycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGRcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNhbGN1bGF0ZTogYG1heChkYXR1bS5sb3dlcl9ib3hfJHtjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGR9IC0gZGF0dW0uaXFyXyR7Y29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkfSAqICR7a0lRUlNjYWxhcn0sIGRhdHVtLm1pbl8ke2NvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZH0pYCxcbiAgICAgICAgYXM6ICdsb3dlcl93aGlza2VyXycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGRcbiAgICAgIH1cbiAgICBdO1xuICB9XG5cbiAgY29uc3QgZ3JvdXBieTogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgYmluczogQmluVHJhbnNmb3JtW10gPSBbXTtcbiAgY29uc3QgdGltZVVuaXRzOiBUaW1lVW5pdFRyYW5zZm9ybVtdID0gW107XG5cbiAgY29uc3QgZW5jb2RpbmdXaXRob3V0Q29udGludW91c0F4aXM6IEVuY29kaW5nPHN0cmluZz4gPSB7fTtcbiAgZm9yRWFjaChlbmNvZGluZywgKGNoYW5uZWxEZWYsIGNoYW5uZWwpID0+IHtcbiAgICBpZiAoY2hhbm5lbCA9PT0gY29udGludW91c0F4aXMpIHtcbiAgICAgIC8vIFNraXAgY29udGludW91cyBheGlzIGFzIHdlIGFscmVhZHkgaGFuZGxlIGl0IHNlcGFyYXRlbHlcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGlzRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICAgIGlmIChjaGFubmVsRGVmLmFnZ3JlZ2F0ZSAmJiBjaGFubmVsRGVmLmFnZ3JlZ2F0ZSAhPT0gQk9YUExPVCkge1xuICAgICAgICBhZ2dyZWdhdGUucHVzaCh7XG4gICAgICAgICAgb3A6IGNoYW5uZWxEZWYuYWdncmVnYXRlLFxuICAgICAgICAgIGZpZWxkOiBjaGFubmVsRGVmLmZpZWxkLFxuICAgICAgICAgIGFzOiB2Z0ZpZWxkKGNoYW5uZWxEZWYpXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChjaGFubmVsRGVmLmFnZ3JlZ2F0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybWVkRmllbGQgPSB2Z0ZpZWxkKGNoYW5uZWxEZWYpO1xuXG4gICAgICAgIC8vIEFkZCBiaW4gb3IgdGltZVVuaXQgdHJhbnNmb3JtIGlmIGFwcGxpY2FibGVcbiAgICAgICAgY29uc3QgYmluID0gY2hhbm5lbERlZi5iaW47XG4gICAgICAgIGlmIChiaW4pIHtcbiAgICAgICAgICBjb25zdCB7ZmllbGR9ID0gY2hhbm5lbERlZjtcbiAgICAgICAgICBiaW5zLnB1c2goe2JpbiwgZmllbGQsIGFzOiB0cmFuc2Zvcm1lZEZpZWxkfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY2hhbm5lbERlZi50aW1lVW5pdCkge1xuICAgICAgICAgIGNvbnN0IHt0aW1lVW5pdCwgZmllbGR9ID0gY2hhbm5lbERlZjtcbiAgICAgICAgICB0aW1lVW5pdHMucHVzaCh7dGltZVVuaXQsIGZpZWxkLCBhczogdHJhbnNmb3JtZWRGaWVsZH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZ3JvdXBieS5wdXNoKHRyYW5zZm9ybWVkRmllbGQpO1xuICAgICAgfVxuICAgICAgLy8gbm93IHRoZSBmaWVsZCBzaG91bGQgcmVmZXIgdG8gcG9zdC10cmFuc2Zvcm1lZCBmaWVsZCBpbnN0ZWFkXG4gICAgICBlbmNvZGluZ1dpdGhvdXRDb250aW51b3VzQXhpc1tjaGFubmVsXSA9IHtcbiAgICAgICAgZmllbGQ6IHZnRmllbGQoY2hhbm5lbERlZiksXG4gICAgICAgIHR5cGU6IGNoYW5uZWxEZWYudHlwZVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRm9yIHZhbHVlIGRlZiwganVzdCBjb3B5XG4gICAgICBlbmNvZGluZ1dpdGhvdXRDb250aW51b3VzQXhpc1tjaGFubmVsXSA9IGVuY29kaW5nW2NoYW5uZWxdO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICB0cmFuc2Zvcm06IFtdLmNvbmNhdChcbiAgICAgIGJpbnMsXG4gICAgICB0aW1lVW5pdHMsXG4gICAgICBbe2FnZ3JlZ2F0ZSwgZ3JvdXBieX1dLFxuICAgICAgcG9zdEFnZ3JlZ2F0ZUNhbGN1bGF0ZXNcbiAgICApLFxuICAgIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZixcbiAgICBjb250aW51b3VzQXhpcyxcbiAgICBlbmNvZGluZ1dpdGhvdXRDb250aW51b3VzQXhpc1xuICB9O1xufVxuIl19