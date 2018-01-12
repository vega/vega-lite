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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm94cGxvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb3NpdGVtYXJrL2JveHBsb3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVDQUFtQztBQUduQyx3Q0FBbUM7QUFFbkMsMENBQWdEO0FBQ2hELDBDQUFpRztBQUNqRyw4QkFBZ0M7QUFJaEMsbUNBQXFEO0FBR3hDLFFBQUEsT0FBTyxHQUFlLFVBQVUsQ0FBQztBQTBCOUMsc0JBQTZCLElBQTBCO0lBQ3JELE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFGRCxvQ0FFQztBQUVZLFFBQUEsY0FBYyxHQUFtQixDQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7QUF5QmpFLFFBQUEscUNBQXFDLEdBRTlDO0lBQ0YsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQztJQUN0QixVQUFVLEVBQUUsQ0FBQyxPQUFPLENBQUM7SUFDckIsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDO0NBQ2xCLENBQUM7QUFFRixJQUFNLGlCQUFpQixHQUFjLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN0RixtQ0FBMEMsSUFBNkQ7SUFDckcsTUFBTSxjQUNELElBQUksSUFDUCxRQUFRLEVBQUUsaUJBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxPQUFPO1lBQzdELEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxRQUFRLENBQUM7WUFDbEMsQ0FBQztZQUFDLElBQUksQ0FB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S0FBSyxTQUFBLEVBQUUsRUFBRSxFQUFFLGdCQUFnQixFQUFDLENBQUMsQ0FBQztnQkFDMUQsQ0FBQztnQkFFRCxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDakMsQ0FBQztZQUNELCtEQUErRDtZQUMvRCw2QkFBNkIsQ0FBQyxPQUFPLENBQUMsR0FBRztnQkFDdkMsS0FBSyxFQUFFLGdCQUFLLENBQUMsVUFBVSxDQUFDO2dCQUN4QixJQUFJLEVBQUUsVUFBVSxDQUFDLElBQUk7YUFDdEIsQ0FBQztRQUNKLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLDJCQUEyQjtZQUMzQiw2QkFBNkIsQ0FBQyxPQUFPLENBQUMsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0QsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDO1FBQ0wsU0FBUyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQ2xCLElBQUksRUFDSixTQUFTLEVBQ1QsQ0FBQyxFQUFDLFNBQVMsV0FBQSxFQUFFLE9BQU8sU0FBQSxFQUFDLENBQUMsRUFDdEIsdUJBQXVCLENBQ3hCO1FBQ0Qsd0JBQXdCLDBCQUFBO1FBQ3hCLGNBQWMsZ0JBQUE7UUFDZCw2QkFBNkIsK0JBQUE7S0FDOUIsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzTnVtYmVyfSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHtDaGFubmVsfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7Q29uZmlnfSBmcm9tICcuLi9jb25maWcnO1xuaW1wb3J0IHtyZWR1Y2V9IGZyb20gJy4uL2VuY29kaW5nJztcbmltcG9ydCB7QWdncmVnYXRlZEZpZWxkRGVmLCBCaW5UcmFuc2Zvcm0sIENhbGN1bGF0ZVRyYW5zZm9ybSwgVGltZVVuaXRUcmFuc2Zvcm19IGZyb20gJy4uL3RyYW5zZm9ybSc7XG5pbXBvcnQge0VuY29kaW5nLCBmb3JFYWNofSBmcm9tICcuLy4uL2VuY29kaW5nJztcbmltcG9ydCB7ZmllbGQsIEZpZWxkLCBGaWVsZERlZiwgaXNDb250aW51b3VzLCBpc0ZpZWxkRGVmLCBQb3NpdGlvbkZpZWxkRGVmfSBmcm9tICcuLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLy4uL2xvZyc7XG5pbXBvcnQge01hcmtDb25maWd9IGZyb20gJy4vLi4vbWFyayc7XG5pbXBvcnQge0dlbmVyaWNVbml0U3BlYywgTGF5ZXJTcGVjfSBmcm9tICcuLy4uL3NwZWMnO1xuaW1wb3J0IHtPcmllbnR9IGZyb20gJy4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtnZXRNYXJrU3BlY2lmaWNDb25maWdNaXhpbnN9IGZyb20gJy4vY29tbW9uJztcblxuXG5leHBvcnQgY29uc3QgQk9YUExPVDogJ2JveC1wbG90JyA9ICdib3gtcGxvdCc7XG5leHBvcnQgdHlwZSBCT1hQTE9UID0gdHlwZW9mIEJPWFBMT1Q7XG5leHBvcnQgdHlwZSBCb3hQbG90U3R5bGUgPSAnYm94V2hpc2tlcicgfCAnYm94JyB8ICdib3hNaWQnO1xuXG5cbmV4cG9ydCBpbnRlcmZhY2UgQm94UGxvdERlZiB7XG4gIC8qKlxuICAgKiBUeXBlIG9mIHRoZSBtYXJrLiAgRm9yIGJveCBwbG90cywgdGhpcyBzaG91bGQgYWx3YXlzIGJlIGBcImJveC1wbG90XCJgLlxuICAgKiBbYm94cGxvdF0oY29tcG9zaXRlbWFyay5odG1sI2JveHBsb3QpXG4gICAqL1xuICB0eXBlOiBCT1hQTE9UO1xuXG4gIC8qKlxuICAgKiBPcmllbnRhdGlvbiBvZiB0aGUgYm94IHBsb3QuICBUaGlzIGlzIG5vcm1hbGx5IGF1dG9tYXRpY2FsbHkgZGV0ZXJtaW5lZCwgYnV0IGNhbiBiZSBzcGVjaWZpZWQgd2hlbiB0aGUgb3JpZW50YXRpb24gaXMgYW1iaWd1b3VzIGFuZCBjYW5ub3QgYmUgYXV0b21hdGljYWxseSBkZXRlcm1pbmVkLlxuICAgKi9cbiAgb3JpZW50PzogT3JpZW50O1xuXG4gIC8qKlxuICAgKiBFeHRlbnQgaXMgdXNlZCB0byBkZXRlcm1pbmUgd2hlcmUgdGhlIHdoaXNrZXJzIGV4dGVuZCB0by4gVGhlIG9wdGlvbnMgYXJlXG4gICAqIC0gYFwibWluLW1heFwiOiBtaW4gYW5kIG1heCBhcmUgdGhlIGxvd2VyIGFuZCB1cHBlciB3aGlza2VycyByZXNwZWN0aXZlbHkuXG4gICAqIC0gYFwibnVtYmVyXCI6IEEgc2NhbGFyIChpbnRlZ2VyIG9yIGZsb2F0aW5nIHBvaW50IG51bWJlcikgdGhhdCB3aWxsIGJlIG11bHRpcGxpZWQgYnkgdGhlIElRUiBhbmQgdGhlIHByb2R1Y3Qgd2lsbCBiZSBhZGRlZCB0byB0aGUgdGhpcmQgcXVhcnRpbGUgdG8gZ2V0IHRoZSB1cHBlciB3aGlza2VyIGFuZCBzdWJ0cmFjdGVkIGZyb20gdGhlIGZpcnN0IHF1YXJ0aWxlIHRvIGdldCB0aGUgbG93ZXIgd2hpc2tlci5cbiAgICogX19EZWZhdWx0IHZhbHVlOl9fIGBcIm1pbi1tYXhcImAuXG4gICAqL1xuICBleHRlbnQ/OiAnbWluLW1heCcgfCBudW1iZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0JveFBsb3REZWYobWFyazogQk9YUExPVCB8IEJveFBsb3REZWYpOiBtYXJrIGlzIEJveFBsb3REZWYge1xuICByZXR1cm4gISFtYXJrWyd0eXBlJ107XG59XG5cbmV4cG9ydCBjb25zdCBCT1hQTE9UX1NUWUxFUzogQm94UGxvdFN0eWxlW10gPSBbJ2JveFdoaXNrZXInLCAnYm94JywgJ2JveE1pZCddO1xuXG5leHBvcnQgaW50ZXJmYWNlIEJveFBsb3RDb25maWcgZXh0ZW5kcyBNYXJrQ29uZmlnIHtcbiAgLyoqIFNpemUgb2YgdGhlIGJveCBhbmQgbWlkIHRpY2sgb2YgYSBib3ggcGxvdCAqL1xuICBzaXplPzogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJveFBsb3RDb25maWdNaXhpbnMge1xuICAvKipcbiAgICogQm94IENvbmZpZ1xuICAgKiBAaGlkZVxuICAgKi9cbiAgYm94PzogQm94UGxvdENvbmZpZztcblxuICAvKipcbiAgICogQGhpZGVcbiAgICovXG4gIGJveFdoaXNrZXI/OiBNYXJrQ29uZmlnO1xuXG4gIC8qKlxuICAgKiBAaGlkZVxuICAgKi9cbiAgYm94TWlkPzogTWFya0NvbmZpZztcbn1cblxuZXhwb3J0IGNvbnN0IFZMX09OTFlfQk9YUExPVF9DT05GSUdfUFJPUEVSVFlfSU5ERVg6IHtcbiAgW2sgaW4ga2V5b2YgQm94UGxvdENvbmZpZ01peGluc10/OiAoa2V5b2YgQm94UGxvdENvbmZpZ01peGluc1trXSlbXVxufSA9IHtcbiAgYm94OiBbJ3NpemUnLCAnY29sb3InXSxcbiAgYm94V2hpc2tlcjogWydjb2xvciddLFxuICBib3hNaWQ6IFsnY29sb3InXVxufTtcblxuY29uc3Qgc3VwcG9ydGVkQ2hhbm5lbHM6IENoYW5uZWxbXSA9IFsneCcsICd5JywgJ2NvbG9yJywgJ2RldGFpbCcsICdvcGFjaXR5JywgJ3NpemUnXTtcbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJVbnN1cHBvcnRlZENoYW5uZWxzKHNwZWM6IEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZzxzdHJpbmc+LCBCT1hQTE9UIHwgQm94UGxvdERlZj4pOiBHZW5lcmljVW5pdFNwZWM8RW5jb2Rpbmc8c3RyaW5nPiwgQk9YUExPVCB8IEJveFBsb3REZWY+IHtcbiAgcmV0dXJuIHtcbiAgICAuLi5zcGVjLFxuICAgIGVuY29kaW5nOiByZWR1Y2Uoc3BlYy5lbmNvZGluZywgKG5ld0VuY29kaW5nLCBmaWVsZERlZiwgY2hhbm5lbCkgPT4ge1xuICAgICAgaWYgKHN1cHBvcnRlZENoYW5uZWxzLmluZGV4T2YoY2hhbm5lbCkgPiAtMSkge1xuICAgICAgICBuZXdFbmNvZGluZ1tjaGFubmVsXSA9IGZpZWxkRGVmO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuaW5jb21wYXRpYmxlQ2hhbm5lbChjaGFubmVsLCBCT1hQTE9UKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3RW5jb2Rpbmc7XG4gICAgfSwge30pLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplQm94UGxvdChzcGVjOiBHZW5lcmljVW5pdFNwZWM8RW5jb2Rpbmc8c3RyaW5nPiwgQk9YUExPVCB8IEJveFBsb3REZWY+LCBjb25maWc6IENvbmZpZyk6IExheWVyU3BlYyB7XG4gIHNwZWMgPSBmaWx0ZXJVbnN1cHBvcnRlZENoYW5uZWxzKHNwZWMpO1xuICAvLyBUT0RPOiB1c2Ugc2VsZWN0aW9uXG4gIGNvbnN0IHttYXJrLCBlbmNvZGluZywgc2VsZWN0aW9uLCAuLi5vdXRlclNwZWN9ID0gc3BlYztcblxuICBsZXQga0lRUlNjYWxhcjogbnVtYmVyID0gdW5kZWZpbmVkO1xuICBpZiAoaXNCb3hQbG90RGVmKG1hcmspKSB7XG4gICAgaWYgKG1hcmsuZXh0ZW50KSB7XG4gICAgICBpZihpc051bWJlcihtYXJrLmV4dGVudCkpIHtcbiAgICAgICAga0lRUlNjYWxhciA9IG1hcmsuZXh0ZW50O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG9yaWVudDogT3JpZW50ID0gYm94T3JpZW50KHNwZWMpO1xuICBjb25zdCB7dHJhbnNmb3JtLCBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYsIGNvbnRpbnVvdXNBeGlzLCBlbmNvZGluZ1dpdGhvdXRDb250aW51b3VzQXhpc30gPSBib3hQYXJhbXMoc3BlYywgb3JpZW50LCBrSVFSU2NhbGFyKTtcblxuICBjb25zdCB7Y29sb3IsIHNpemUsIC4uLmVuY29kaW5nV2l0aG91dFNpemVDb2xvckFuZENvbnRpbnVvdXNBeGlzfSA9IGVuY29kaW5nV2l0aG91dENvbnRpbnVvdXNBeGlzO1xuXG4gIC8vIFNpemUgZW5jb2Rpbmcgb3IgdGhlIGRlZmF1bHQgY29uZmlnLmJveC5zaXplIGlzIGFwcGxpZWQgdG8gYm94IGFuZCBib3hNaWRcbiAgY29uc3Qgc2l6ZU1peGlucyA9IHNpemUgPyB7c2l6ZX0gOiBnZXRNYXJrU3BlY2lmaWNDb25maWdNaXhpbnMoY29uZmlnLmJveCwgJ3NpemUnKTtcblxuICBjb25zdCBjb250aW51b3VzQXhpc1NjYWxlQW5kQXhpcyA9IHt9O1xuICBpZiAoY29udGludW91c0F4aXNDaGFubmVsRGVmLnNjYWxlKSB7XG4gICAgY29udGludW91c0F4aXNTY2FsZUFuZEF4aXNbJ3NjYWxlJ10gPSBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuc2NhbGU7XG4gIH1cbiAgaWYgKGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5heGlzKSB7XG4gICAgY29udGludW91c0F4aXNTY2FsZUFuZEF4aXNbJ2F4aXMnXSA9IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5heGlzO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5vdXRlclNwZWMsXG4gICAgdHJhbnNmb3JtLFxuICAgIGxheWVyOiBbXG4gICAgICB7IC8vIGxvd2VyIHdoaXNrZXJcbiAgICAgICAgbWFyazoge1xuICAgICAgICAgIHR5cGU6ICdydWxlJyxcbiAgICAgICAgICBzdHlsZTogJ2JveFdoaXNrZXInXG4gICAgICAgIH0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgW2NvbnRpbnVvdXNBeGlzXToge1xuICAgICAgICAgICAgZmllbGQ6ICdsb3dlcl93aGlza2VyXycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICAgICAgICB0eXBlOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYudHlwZSxcbiAgICAgICAgICAgIC4uLmNvbnRpbnVvdXNBeGlzU2NhbGVBbmRBeGlzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBbY29udGludW91c0F4aXMgKyAnMiddOiB7XG4gICAgICAgICAgICBmaWVsZDogJ2xvd2VyX2JveF8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgICAgICAgICAgdHlwZTogY29udGludW91c0F4aXNDaGFubmVsRGVmLnR5cGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIC4uLmVuY29kaW5nV2l0aG91dFNpemVDb2xvckFuZENvbnRpbnVvdXNBeGlzLFxuICAgICAgICAgIC4uLmdldE1hcmtTcGVjaWZpY0NvbmZpZ01peGlucyhjb25maWcuYm94V2hpc2tlciwgJ2NvbG9yJylcbiAgICAgICAgfVxuICAgICAgfSwgeyAvLyB1cHBlciB3aGlza2VyXG4gICAgICAgIG1hcms6IHtcbiAgICAgICAgICB0eXBlOiAncnVsZScsXG4gICAgICAgICAgc3R5bGU6ICdib3hXaGlza2VyJ1xuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFtjb250aW51b3VzQXhpc106IHtcbiAgICAgICAgICAgIGZpZWxkOiAndXBwZXJfYm94XycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICAgICAgICB0eXBlOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYudHlwZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgW2NvbnRpbnVvdXNBeGlzICsgJzInXToge1xuICAgICAgICAgICAgZmllbGQ6ICd1cHBlcl93aGlza2VyXycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICAgICAgICB0eXBlOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYudHlwZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgLi4uZW5jb2RpbmdXaXRob3V0U2l6ZUNvbG9yQW5kQ29udGludW91c0F4aXMsXG4gICAgICAgICAgLi4uZ2V0TWFya1NwZWNpZmljQ29uZmlnTWl4aW5zKGNvbmZpZy5ib3hXaGlza2VyLCAnY29sb3InKVxuICAgICAgICB9XG4gICAgICB9LCB7IC8vIGJveCAocTEgdG8gcTMpXG4gICAgICAgIC4uLihzZWxlY3Rpb24gPyB7c2VsZWN0aW9ufSA6IHt9KSxcbiAgICAgICAgbWFyazoge1xuICAgICAgICAgIHR5cGU6ICdiYXInLFxuICAgICAgICAgIHN0eWxlOiAnYm94J1xuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFtjb250aW51b3VzQXhpc106IHtcbiAgICAgICAgICAgIGZpZWxkOiAnbG93ZXJfYm94XycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICAgICAgICB0eXBlOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYudHlwZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgW2NvbnRpbnVvdXNBeGlzICsgJzInXToge1xuICAgICAgICAgICAgZmllbGQ6ICd1cHBlcl9ib3hfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZCxcbiAgICAgICAgICAgIHR5cGU6IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi50eXBlXG4gICAgICAgICAgfSxcbiAgICAgICAgICAuLi5lbmNvZGluZ1dpdGhvdXRDb250aW51b3VzQXhpcyxcbiAgICAgICAgICAuLi4oZW5jb2RpbmdXaXRob3V0Q29udGludW91c0F4aXMuY29sb3IgPyB7fSA6IGdldE1hcmtTcGVjaWZpY0NvbmZpZ01peGlucyhjb25maWcuYm94LCAnY29sb3InKSksXG4gICAgICAgICAgLi4uc2l6ZU1peGlucyxcbiAgICAgICAgfVxuICAgICAgfSwgeyAvLyBtaWQgdGlja1xuICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgdHlwZTogJ3RpY2snLFxuICAgICAgICAgIHN0eWxlOiAnYm94TWlkJ1xuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFtjb250aW51b3VzQXhpc106IHtcbiAgICAgICAgICAgIGZpZWxkOiAnbWlkX2JveF8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgICAgICAgICAgdHlwZTogY29udGludW91c0F4aXNDaGFubmVsRGVmLnR5cGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIC4uLmVuY29kaW5nV2l0aG91dFNpemVDb2xvckFuZENvbnRpbnVvdXNBeGlzLFxuICAgICAgICAgIC4uLmdldE1hcmtTcGVjaWZpY0NvbmZpZ01peGlucyhjb25maWcuYm94TWlkLCAnY29sb3InKSxcbiAgICAgICAgICAuLi5zaXplTWl4aW5zLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgXVxuICB9O1xufVxuXG5mdW5jdGlvbiBib3hPcmllbnQoc3BlYzogR2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPEZpZWxkPiwgQk9YUExPVCB8IEJveFBsb3REZWY+KTogT3JpZW50IHtcbiAgY29uc3Qge21hcms6IG1hcmssIGVuY29kaW5nOiBlbmNvZGluZywgLi4uX291dGVyU3BlY30gPSBzcGVjO1xuXG4gIGlmIChpc0ZpZWxkRGVmKGVuY29kaW5nLngpICYmIGlzQ29udGludW91cyhlbmNvZGluZy54KSkge1xuICAgIC8vIHggaXMgY29udGludW91c1xuICAgIGlmIChpc0ZpZWxkRGVmKGVuY29kaW5nLnkpICYmIGlzQ29udGludW91cyhlbmNvZGluZy55KSkge1xuICAgICAgLy8gYm90aCB4IGFuZCB5IGFyZSBjb250aW51b3VzXG4gICAgICBpZiAoZW5jb2RpbmcueC5hZ2dyZWdhdGUgPT09IHVuZGVmaW5lZCAmJiBlbmNvZGluZy55LmFnZ3JlZ2F0ZSA9PT0gQk9YUExPVCkge1xuICAgICAgICByZXR1cm4gJ3ZlcnRpY2FsJztcbiAgICAgIH0gZWxzZSBpZiAoZW5jb2RpbmcueS5hZ2dyZWdhdGUgPT09IHVuZGVmaW5lZCAmJiBlbmNvZGluZy54LmFnZ3JlZ2F0ZSA9PT0gQk9YUExPVCkge1xuICAgICAgICByZXR1cm4gJ2hvcml6b250YWwnO1xuICAgICAgfSBlbHNlIGlmIChlbmNvZGluZy54LmFnZ3JlZ2F0ZSA9PT0gQk9YUExPVCAmJiBlbmNvZGluZy55LmFnZ3JlZ2F0ZSA9PT0gQk9YUExPVCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JvdGggeCBhbmQgeSBjYW5ub3QgaGF2ZSBhZ2dyZWdhdGUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChpc0JveFBsb3REZWYobWFyaykgJiYgbWFyay5vcmllbnQpIHtcbiAgICAgICAgICByZXR1cm4gbWFyay5vcmllbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkZWZhdWx0IG9yaWVudGF0aW9uID0gdmVydGljYWxcbiAgICAgICAgcmV0dXJuICd2ZXJ0aWNhbCc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8geCBpcyBjb250aW51b3VzIGJ1dCB5IGlzIG5vdFxuICAgIHJldHVybiAnaG9yaXpvbnRhbCc7XG4gIH0gZWxzZSBpZiAoaXNGaWVsZERlZihlbmNvZGluZy55KSAmJiBpc0NvbnRpbnVvdXMoZW5jb2RpbmcueSkpIHtcbiAgICAvLyB5IGlzIGNvbnRpbnVvdXMgYnV0IHggaXMgbm90XG4gICAgcmV0dXJuICd2ZXJ0aWNhbCc7XG4gIH0gZWxzZSB7XG4gICAgLy8gTmVpdGhlciB4IG5vciB5IGlzIGNvbnRpbnVvdXMuXG4gICAgdGhyb3cgbmV3IEVycm9yKCdOZWVkIGEgdmFsaWQgY29udGludW91cyBheGlzIGZvciBib3hwbG90cycpO1xuICB9XG59XG5cblxuZnVuY3Rpb24gYm94Q29udGlub3VzQXhpcyhzcGVjOiBHZW5lcmljVW5pdFNwZWM8RW5jb2Rpbmc8c3RyaW5nPiwgQk9YUExPVCB8IEJveFBsb3REZWY+LCBvcmllbnQ6IE9yaWVudCkge1xuICBjb25zdCB7bWFyazogbWFyaywgZW5jb2Rpbmc6IGVuY29kaW5nLCAuLi5fb3V0ZXJTcGVjfSA9IHNwZWM7XG5cbiAgbGV0IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZjogUG9zaXRpb25GaWVsZERlZjxzdHJpbmc+O1xuICBsZXQgY29udGludW91c0F4aXM6ICd4JyB8ICd5JztcblxuICBpZiAob3JpZW50ID09PSAndmVydGljYWwnKSB7XG4gICAgY29udGludW91c0F4aXMgPSAneSc7XG4gICAgY29udGludW91c0F4aXNDaGFubmVsRGVmID0gZW5jb2RpbmcueSBhcyBGaWVsZERlZjxzdHJpbmc+OyAvLyBTYWZlIHRvIGNhc3QgYmVjYXVzZSBpZiB5IGlzIG5vdCBjb250aW5vdXMgZmllbGRkZWYsIHRoZSBvcmllbnQgd291bGQgbm90IGJlIHZlcnRpY2FsLlxuICB9IGVsc2Uge1xuICAgIGNvbnRpbnVvdXNBeGlzID0gJ3gnO1xuICAgIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZiA9IGVuY29kaW5nLnggYXMgRmllbGREZWY8c3RyaW5nPjsgLy8gU2FmZSB0byBjYXN0IGJlY2F1c2UgaWYgeCBpcyBub3QgY29udGlub3VzIGZpZWxkZGVmLCB0aGUgb3JpZW50IHdvdWxkIG5vdCBiZSBob3Jpem9udGFsLlxuICB9XG5cbiAgaWYgKGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZiAmJiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuYWdncmVnYXRlKSB7XG4gICAgY29uc3Qge2FnZ3JlZ2F0ZSwgLi4uY29udGludW91c0F4aXNXaXRob3V0QWdncmVnYXRlfSA9IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZjtcbiAgICBpZiAoYWdncmVnYXRlICE9PSBCT1hQTE9UKSB7XG4gICAgICBsb2cud2FybihgQ29udGludW91cyBheGlzIHNob3VsZCBub3QgaGF2ZSBjdXN0b21pemVkIGFnZ3JlZ2F0aW9uIGZ1bmN0aW9uICR7YWdncmVnYXRlfWApO1xuICAgIH1cbiAgICBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYgPSBjb250aW51b3VzQXhpc1dpdGhvdXRBZ2dyZWdhdGU7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZixcbiAgICBjb250aW51b3VzQXhpc1xuICB9O1xufVxuXG5mdW5jdGlvbiBib3hQYXJhbXMoc3BlYzogR2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPHN0cmluZz4sIEJPWFBMT1QgfCBCb3hQbG90RGVmPiwgb3JpZW50OiBPcmllbnQsIGtJUVJTY2FsYXI6ICdtaW4tbWF4JyB8IG51bWJlcikge1xuXG4gIGNvbnN0IHtjb250aW51b3VzQXhpc0NoYW5uZWxEZWYsIGNvbnRpbnVvdXNBeGlzfSA9IGJveENvbnRpbm91c0F4aXMoc3BlYywgb3JpZW50KTtcbiAgY29uc3QgZW5jb2RpbmcgPSBzcGVjLmVuY29kaW5nO1xuXG4gIGNvbnN0IGlzTWluTWF4ID0ga0lRUlNjYWxhciA9PT0gdW5kZWZpbmVkO1xuICBjb25zdCBhZ2dyZWdhdGU6IEFnZ3JlZ2F0ZWRGaWVsZERlZltdID0gW1xuICAgIHtcbiAgICAgIG9wOiAncTEnLFxuICAgICAgZmllbGQ6IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZCxcbiAgICAgIGFzOiAnbG93ZXJfYm94XycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGRcbiAgICB9LFxuICAgIHtcbiAgICAgIG9wOiAncTMnLFxuICAgICAgZmllbGQ6IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZCxcbiAgICAgIGFzOiAndXBwZXJfYm94XycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGRcbiAgICB9LFxuICAgIHtcbiAgICAgIG9wOiAnbWVkaWFuJyxcbiAgICAgIGZpZWxkOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICBhczogJ21pZF9ib3hfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZFxuICAgIH1cbiAgXTtcbiAgbGV0IHBvc3RBZ2dyZWdhdGVDYWxjdWxhdGVzOiBDYWxjdWxhdGVUcmFuc2Zvcm1bXSA9IFtdO1xuXG4gIGFnZ3JlZ2F0ZS5wdXNoKHtcbiAgICBvcDogJ21pbicsXG4gICAgZmllbGQ6IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZCxcbiAgICBhczogKGlzTWluTWF4ID8gJ2xvd2VyX3doaXNrZXJfJyA6ICdtaW5fJykgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGRcbiAgfSk7XG4gIGFnZ3JlZ2F0ZS5wdXNoKHtcbiAgICBvcDogJ21heCcsXG4gICAgZmllbGQ6IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZCxcbiAgICBhczogIChpc01pbk1heCA/ICd1cHBlcl93aGlza2VyXycgOiAnbWF4XycpICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkXG4gIH0pO1xuXG4gIGlmICghaXNNaW5NYXgpIHtcbiAgICBwb3N0QWdncmVnYXRlQ2FsY3VsYXRlcyA9IFtcbiAgICAgIHtcbiAgICAgICAgY2FsY3VsYXRlOiBgZGF0dW0udXBwZXJfYm94XyR7Y29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkfSAtIGRhdHVtLmxvd2VyX2JveF8ke2NvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZH1gLFxuICAgICAgICBhczogJ2lxcl8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjYWxjdWxhdGU6IGBtaW4oZGF0dW0udXBwZXJfYm94XyR7Y29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkfSArIGRhdHVtLmlxcl8ke2NvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZH0gKiAke2tJUVJTY2FsYXJ9LCBkYXR1bS5tYXhfJHtjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGR9KWAsXG4gICAgICAgIGFzOiAndXBwZXJfd2hpc2tlcl8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjYWxjdWxhdGU6IGBtYXgoZGF0dW0ubG93ZXJfYm94XyR7Y29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkfSAtIGRhdHVtLmlxcl8ke2NvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZH0gKiAke2tJUVJTY2FsYXJ9LCBkYXR1bS5taW5fJHtjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGR9KWAsXG4gICAgICAgIGFzOiAnbG93ZXJfd2hpc2tlcl8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkXG4gICAgICB9XG4gICAgXTtcbiAgfVxuXG4gIGNvbnN0IGdyb3VwYnk6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IGJpbnM6IEJpblRyYW5zZm9ybVtdID0gW107XG4gIGNvbnN0IHRpbWVVbml0czogVGltZVVuaXRUcmFuc2Zvcm1bXSA9IFtdO1xuXG4gIGNvbnN0IGVuY29kaW5nV2l0aG91dENvbnRpbnVvdXNBeGlzOiBFbmNvZGluZzxzdHJpbmc+ID0ge307XG4gIGZvckVhY2goZW5jb2RpbmcsIChjaGFubmVsRGVmLCBjaGFubmVsKSA9PiB7XG4gICAgaWYgKGNoYW5uZWwgPT09IGNvbnRpbnVvdXNBeGlzKSB7XG4gICAgICAvLyBTa2lwIGNvbnRpbnVvdXMgYXhpcyBhcyB3ZSBhbHJlYWR5IGhhbmRsZSBpdCBzZXBhcmF0ZWx5XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChpc0ZpZWxkRGVmKGNoYW5uZWxEZWYpKSB7XG4gICAgICBpZiAoY2hhbm5lbERlZi5hZ2dyZWdhdGUgJiYgY2hhbm5lbERlZi5hZ2dyZWdhdGUgIT09IEJPWFBMT1QpIHtcbiAgICAgICAgYWdncmVnYXRlLnB1c2goe1xuICAgICAgICAgIG9wOiBjaGFubmVsRGVmLmFnZ3JlZ2F0ZSxcbiAgICAgICAgICBmaWVsZDogY2hhbm5lbERlZi5maWVsZCxcbiAgICAgICAgICBhczogZmllbGQoY2hhbm5lbERlZilcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKGNoYW5uZWxEZWYuYWdncmVnYXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtZWRGaWVsZCA9IGZpZWxkKGNoYW5uZWxEZWYpO1xuXG4gICAgICAgIC8vIEFkZCBiaW4gb3IgdGltZVVuaXQgdHJhbnNmb3JtIGlmIGFwcGxpY2FibGVcbiAgICAgICAgY29uc3QgYmluID0gY2hhbm5lbERlZi5iaW47XG4gICAgICAgIGlmIChiaW4pIHtcbiAgICAgICAgICBjb25zdCB7ZmllbGR9ID0gY2hhbm5lbERlZjtcbiAgICAgICAgICBiaW5zLnB1c2goe2JpbiwgZmllbGQsIGFzOiB0cmFuc2Zvcm1lZEZpZWxkfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY2hhbm5lbERlZi50aW1lVW5pdCkge1xuICAgICAgICAgIGNvbnN0IHt0aW1lVW5pdCwgZmllbGR9ID0gY2hhbm5lbERlZjtcbiAgICAgICAgICB0aW1lVW5pdHMucHVzaCh7dGltZVVuaXQsIGZpZWxkLCBhczogdHJhbnNmb3JtZWRGaWVsZH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZ3JvdXBieS5wdXNoKHRyYW5zZm9ybWVkRmllbGQpO1xuICAgICAgfVxuICAgICAgLy8gbm93IHRoZSBmaWVsZCBzaG91bGQgcmVmZXIgdG8gcG9zdC10cmFuc2Zvcm1lZCBmaWVsZCBpbnN0ZWFkXG4gICAgICBlbmNvZGluZ1dpdGhvdXRDb250aW51b3VzQXhpc1tjaGFubmVsXSA9IHtcbiAgICAgICAgZmllbGQ6IGZpZWxkKGNoYW5uZWxEZWYpLFxuICAgICAgICB0eXBlOiBjaGFubmVsRGVmLnR5cGVcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEZvciB2YWx1ZSBkZWYsIGp1c3QgY29weVxuICAgICAgZW5jb2RpbmdXaXRob3V0Q29udGludW91c0F4aXNbY2hhbm5lbF0gPSBlbmNvZGluZ1tjaGFubmVsXTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgdHJhbnNmb3JtOiBbXS5jb25jYXQoXG4gICAgICBiaW5zLFxuICAgICAgdGltZVVuaXRzLFxuICAgICAgW3thZ2dyZWdhdGUsIGdyb3VwYnl9XSxcbiAgICAgIHBvc3RBZ2dyZWdhdGVDYWxjdWxhdGVzXG4gICAgKSxcbiAgICBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYsXG4gICAgY29udGludW91c0F4aXMsXG4gICAgZW5jb2RpbmdXaXRob3V0Q29udGludW91c0F4aXNcbiAgfTtcbn1cbiJdfQ==