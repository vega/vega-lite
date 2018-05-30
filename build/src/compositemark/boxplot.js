import * as tslib_1 from "tslib";
import { isNumber } from 'vega-util';
import { reduce } from '../encoding';
import { forEach } from './../encoding';
import { isContinuous, isFieldDef, vgField } from './../fielddef';
import * as log from './../log';
import { getMarkSpecificConfigMixins } from './common';
export var BOXPLOT = 'box-plot';
export function isBoxPlotDef(mark) {
    return !!mark['type'];
}
export var BOXPLOT_STYLES = ['boxWhisker', 'box', 'boxMid'];
export var VL_ONLY_BOXPLOT_CONFIG_PROPERTY_INDEX = {
    box: ['size', 'color', 'extent'],
    boxWhisker: ['color'],
    boxMid: ['color']
};
var supportedChannels = ['x', 'y', 'color', 'detail', 'opacity', 'size'];
export function filterUnsupportedChannels(spec) {
    return tslib_1.__assign({}, spec, { encoding: reduce(spec.encoding, function (newEncoding, fieldDef, channel) {
            if (supportedChannels.indexOf(channel) > -1) {
                newEncoding[channel] = fieldDef;
            }
            else {
                log.warn(log.message.incompatibleChannel(channel, BOXPLOT));
            }
            return newEncoding;
        }, {}) });
}
export function normalizeBoxPlot(spec, config) {
    spec = filterUnsupportedChannels(spec);
    // TODO: use selection
    var mark = spec.mark, encoding = spec.encoding, selection = spec.selection, _p = spec.projection, outerSpec = tslib_1.__rest(spec, ["mark", "encoding", "selection", "projection"]);
    var kIQRScalar = undefined;
    if (isNumber(config.box.extent)) {
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
    var color = encodingWithoutContinuousAxis.color, size = encodingWithoutContinuousAxis.size, encodingWithoutSizeColorAndContinuousAxis = tslib_1.__rest(encodingWithoutContinuousAxis, ["color", "size"]);
    // Size encoding or the default config.box.size is applied to box and boxMid
    var sizeMixins = size ? { size: size } : getMarkSpecificConfigMixins(config.box, 'size');
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
                encoding: tslib_1.__assign((_b = {}, _b[continuousAxis] = tslib_1.__assign({ field: 'lower_whisker_' + continuousAxisChannelDef.field, type: continuousAxisChannelDef.type }, continuousAxisScaleAndAxis), _b[continuousAxis + '2'] = {
                    field: 'lower_box_' + continuousAxisChannelDef.field,
                    type: continuousAxisChannelDef.type
                }, _b), encodingWithoutSizeColorAndContinuousAxis, getMarkSpecificConfigMixins(config.boxWhisker, 'color'))
            }, {
                mark: {
                    type: 'rule',
                    style: 'boxWhisker'
                },
                encoding: tslib_1.__assign((_c = {}, _c[continuousAxis] = {
                    field: 'upper_box_' + continuousAxisChannelDef.field,
                    type: continuousAxisChannelDef.type
                }, _c[continuousAxis + '2'] = {
                    field: 'upper_whisker_' + continuousAxisChannelDef.field,
                    type: continuousAxisChannelDef.type
                }, _c), encodingWithoutSizeColorAndContinuousAxis, getMarkSpecificConfigMixins(config.boxWhisker, 'color'))
            },
            tslib_1.__assign({}, (selection ? { selection: selection } : {}), { mark: {
                    type: 'bar',
                    style: 'box'
                }, encoding: tslib_1.__assign((_d = {}, _d[continuousAxis] = {
                    field: 'lower_box_' + continuousAxisChannelDef.field,
                    type: continuousAxisChannelDef.type
                }, _d[continuousAxis + '2'] = {
                    field: 'upper_box_' + continuousAxisChannelDef.field,
                    type: continuousAxisChannelDef.type
                }, _d), encodingWithoutContinuousAxis, (encodingWithoutContinuousAxis.color ? {} : getMarkSpecificConfigMixins(config.box, 'color')), sizeMixins) }),
            {
                mark: {
                    type: 'tick',
                    style: 'boxMid'
                },
                encoding: tslib_1.__assign((_e = {}, _e[continuousAxis] = {
                    field: 'mid_box_' + continuousAxisChannelDef.field,
                    type: continuousAxisChannelDef.type
                }, _e), encodingWithoutSizeColorAndContinuousAxis, getMarkSpecificConfigMixins(config.boxMid, 'color'), sizeMixins)
            }
        ] });
    var _b, _c, _d, _e;
}
function boxOrient(spec) {
    var mark = spec.mark, encoding = spec.encoding, _p = spec.projection, _outerSpec = tslib_1.__rest(spec, ["mark", "encoding", "projection"]);
    if (isFieldDef(encoding.x) && isContinuous(encoding.x)) {
        // x is continuous
        if (isFieldDef(encoding.y) && isContinuous(encoding.y)) {
            // both x and y are continuous
            if (encoding.x.aggregate === undefined && encoding.y.aggregate === BOXPLOT) {
                return 'vertical';
            }
            else if (encoding.y.aggregate === undefined && encoding.x.aggregate === BOXPLOT) {
                return 'horizontal';
            }
            else if (encoding.x.aggregate === BOXPLOT && encoding.y.aggregate === BOXPLOT) {
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
    else if (isFieldDef(encoding.y) && isContinuous(encoding.y)) {
        // y is continuous but x is not
        return 'vertical';
    }
    else {
        // Neither x nor y is continuous.
        throw new Error('Need a valid continuous axis for boxplots');
    }
}
function boxContinousAxis(spec, orient) {
    var mark = spec.mark, encoding = spec.encoding, _p = spec.projection, _outerSpec = tslib_1.__rest(spec, ["mark", "encoding", "projection"]);
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
        var aggregate = continuousAxisChannelDef.aggregate, continuousAxisWithoutAggregate = tslib_1.__rest(continuousAxisChannelDef, ["aggregate"]);
        if (aggregate !== BOXPLOT) {
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
    forEach(encoding, function (channelDef, channel) {
        if (channel === continuousAxis) {
            // Skip continuous axis as we already handle it separately
            return;
        }
        if (isFieldDef(channelDef)) {
            if (channelDef.aggregate && channelDef.aggregate !== BOXPLOT) {
                aggregate.push({
                    op: channelDef.aggregate,
                    field: channelDef.field,
                    as: vgField(channelDef)
                });
            }
            else if (channelDef.aggregate === undefined) {
                var transformedField = vgField(channelDef);
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
                field: vgField(channelDef),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm94cGxvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb3NpdGVtYXJrL2JveHBsb3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFHbkMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUVuQyxPQUFPLEVBQVcsT0FBTyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2hELE9BQU8sRUFBa0IsWUFBWSxFQUFFLFVBQVUsRUFBb0IsT0FBTyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ25HLE9BQU8sS0FBSyxHQUFHLE1BQU0sVUFBVSxDQUFDO0FBSWhDLE9BQU8sRUFBQywyQkFBMkIsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUdyRCxNQUFNLENBQUMsSUFBTSxPQUFPLEdBQWUsVUFBVSxDQUFDO0FBMEI5QyxNQUFNLHVCQUF1QixJQUEwQjtJQUNyRCxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDeEIsQ0FBQztBQUVELE1BQU0sQ0FBQyxJQUFNLGNBQWMsR0FBbUIsQ0FBQyxZQUFZLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBOEI5RSxNQUFNLENBQUMsSUFBTSxxQ0FBcUMsR0FFOUM7SUFDRixHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQztJQUNoQyxVQUFVLEVBQUUsQ0FBQyxPQUFPLENBQUM7SUFDckIsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDO0NBQ2xCLENBQUM7QUFFRixJQUFNLGlCQUFpQixHQUFjLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN0RixNQUFNLG9DQUFvQyxJQUE2RDtJQUNyRyw0QkFDSyxJQUFJLElBQ1AsUUFBUSxFQUFFLE1BQU0sQ0FBQyxJ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QUFDLEVBQ3RCLHVCQUF1QixDQUN4QjtRQUNELHdCQUF3QiwwQkFBQTtRQUN4QixjQUFjLGdCQUFBO1FBQ2QsNkJBQTZCLCtCQUFBO0tBQzlCLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc051bWJlcn0gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCB7Q2hhbm5lbH0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7cmVkdWNlfSBmcm9tICcuLi9lbmNvZGluZyc7XG5pbXBvcnQge0FnZ3JlZ2F0ZWRGaWVsZERlZiwgQmluVHJhbnNmb3JtLCBDYWxjdWxhdGVUcmFuc2Zvcm0sIFRpbWVVbml0VHJhbnNmb3JtfSBmcm9tICcuLi90cmFuc2Zvcm0nO1xuaW1wb3J0IHtFbmNvZGluZywgZm9yRWFjaH0gZnJvbSAnLi8uLi9lbmNvZGluZyc7XG5pbXBvcnQge0ZpZWxkLCBGaWVsZERlZiwgaXNDb250aW51b3VzLCBpc0ZpZWxkRGVmLCBQb3NpdGlvbkZpZWxkRGVmLCB2Z0ZpZWxkfSBmcm9tICcuLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLy4uL2xvZyc7XG5pbXBvcnQge01hcmtDb25maWd9IGZyb20gJy4vLi4vbWFyayc7XG5pbXBvcnQge0dlbmVyaWNVbml0U3BlYywgTm9ybWFsaXplZExheWVyU3BlY30gZnJvbSAnLi8uLi9zcGVjJztcbmltcG9ydCB7T3JpZW50fSBmcm9tICcuLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7Z2V0TWFya1NwZWNpZmljQ29uZmlnTWl4aW5zfSBmcm9tICcuL2NvbW1vbic7XG5cblxuZXhwb3J0IGNvbnN0IEJPWFBMT1Q6ICdib3gtcGxvdCcgPSAnYm94LXBsb3QnO1xuZXhwb3J0IHR5cGUgQk9YUExPVCA9IHR5cGVvZiBCT1hQTE9UO1xuZXhwb3J0IHR5cGUgQm94UGxvdFN0eWxlID0gJ2JveFdoaXNrZXInIHwgJ2JveCcgfCAnYm94TWlkJztcblxuXG5leHBvcnQgaW50ZXJmYWNlIEJveFBsb3REZWYge1xuICAvKipcbiAgICogVHlwZSBvZiB0aGUgbWFyay4gIEZvciBib3ggcGxvdHMsIHRoaXMgc2hvdWxkIGFsd2F5cyBiZSBgXCJib3gtcGxvdFwiYC5cbiAgICogW2JveHBsb3RdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3MvY29tcG9zaXRlbWFyay5odG1sI2JveHBsb3QpXG4gICAqL1xuICB0eXBlOiBCT1hQTE9UO1xuXG4gIC8qKlxuICAgKiBPcmllbnRhdGlvbiBvZiB0aGUgYm94IHBsb3QuICBUaGlzIGlzIG5vcm1hbGx5IGF1dG9tYXRpY2FsbHkgZGV0ZXJtaW5lZCwgYnV0IGNhbiBiZSBzcGVjaWZpZWQgd2hlbiB0aGUgb3JpZW50YXRpb24gaXMgYW1iaWd1b3VzIGFuZCBjYW5ub3QgYmUgYXV0b21hdGljYWxseSBkZXRlcm1pbmVkLlxuICAgKi9cbiAgb3JpZW50PzogT3JpZW50O1xuXG4gIC8qKlxuICAgKiBFeHRlbnQgaXMgdXNlZCB0byBkZXRlcm1pbmUgd2hlcmUgdGhlIHdoaXNrZXJzIGV4dGVuZCB0by4gVGhlIG9wdGlvbnMgYXJlXG4gICAqIC0gYFwibWluLW1heFwiOiBtaW4gYW5kIG1heCBhcmUgdGhlIGxvd2VyIGFuZCB1cHBlciB3aGlza2VycyByZXNwZWN0aXZlbHkuXG4gICAqIC0gIEEgc2NhbGFyIChpbnRlZ2VyIG9yIGZsb2F0aW5nIHBvaW50IG51bWJlcikgdGhhdCB3aWxsIGJlIG11bHRpcGxpZWQgYnkgdGhlIElRUiBhbmQgdGhlIHByb2R1Y3Qgd2lsbCBiZSBhZGRlZCB0byB0aGUgdGhpcmQgcXVhcnRpbGUgdG8gZ2V0IHRoZSB1cHBlciB3aGlza2VyIGFuZCBzdWJ0cmFjdGVkIGZyb20gdGhlIGZpcnN0IHF1YXJ0aWxlIHRvIGdldCB0aGUgbG93ZXIgd2hpc2tlci5cbiAgICogX19EZWZhdWx0IHZhbHVlOl9fIGBcIjEuNVwiYC5cbiAgICovXG4gIGV4dGVudD86ICdtaW4tbWF4JyB8IG51bWJlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQm94UGxvdERlZihtYXJrOiBCT1hQTE9UIHwgQm94UGxvdERlZik6IG1hcmsgaXMgQm94UGxvdERlZiB7XG4gIHJldHVybiAhIW1hcmtbJ3R5cGUnXTtcbn1cblxuZXhwb3J0IGNvbnN0IEJPWFBMT1RfU1RZTEVTOiBCb3hQbG90U3R5bGVbXSA9IFsnYm94V2hpc2tlcicsICdib3gnLCAnYm94TWlkJ107XG5cbmV4cG9ydCBpbnRlcmZhY2UgQm94UGxvdENvbmZpZyBleHRlbmRzIE1hcmtDb25maWcge1xuICAvKiogU2l6ZSBvZiB0aGUgYm94IGFuZCBtaWQgdGljayBvZiBhIGJveCBwbG90ICovXG4gIHNpemU/OiBudW1iZXI7XG4gIC8qKiBUaGUgZGVmYXVsdCBleHRlbnQsIHdoaWNoIGlzIHVzZWQgdG8gZGV0ZXJtaW5lIHdoZXJlIHRoZSB3aGlza2VycyBleHRlbmQgdG8uIFRoZSBvcHRpb25zIGFyZVxuICAgKiAtIGBcIm1pbi1tYXhcIjogbWluIGFuZCBtYXggYXJlIHRoZSBsb3dlciBhbmQgdXBwZXIgd2hpc2tlcnMgcmVzcGVjdGl2ZWx5LlxuICAgKiAtIGBcIm51bWJlclwiOiBBIHNjYWxhciAoaW50ZWdlciBvciBmbG9hdGluZyBwb2ludCBudW1iZXIpIHRoYXQgd2lsbCBiZSBtdWx0aXBsaWVkIGJ5IHRoZSBJUVIgYW5kIHRoZSBwcm9kdWN0IHdpbGwgYmUgYWRkZWQgdG8gdGhlIHRoaXJkIHF1YXJ0aWxlIHRvIGdldCB0aGUgdXBwZXIgd2hpc2tlciBhbmQgc3VidHJhY3RlZCBmcm9tIHRoZSBmaXJzdCBxdWFydGlsZSB0byBnZXQgdGhlIGxvd2VyIHdoaXNrZXIuXG4gICAqL1xuICBleHRlbnQ/OiAnbWluLW1heCcgfCBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQm94UGxvdENvbmZpZ01peGlucyB7XG4gIC8qKlxuICAgKiBCb3ggQ29uZmlnXG4gICAqIEBoaWRlXG4gICAqL1xuICBib3g/OiBCb3hQbG90Q29uZmlnO1xuXG4gIC8qKlxuICAgKiBAaGlkZVxuICAgKi9cbiAgYm94V2hpc2tlcj86IE1hcmtDb25maWc7XG5cbiAgLyoqXG4gICAqIEBoaWRlXG4gICAqL1xuICBib3hNaWQ/OiBNYXJrQ29uZmlnO1xufVxuXG5leHBvcnQgY29uc3QgVkxfT05MWV9CT1hQTE9UX0NPTkZJR19QUk9QRVJUWV9JTkRFWDoge1xuICBbayBpbiBrZXlvZiBCb3hQbG90Q29uZmlnTWl4aW5zXT86IChrZXlvZiBCb3hQbG90Q29uZmlnTWl4aW5zW2tdKVtdXG59ID0ge1xuICBib3g6IFsnc2l6ZScsICdjb2xvcicsICdleHRlbnQnXSxcbiAgYm94V2hpc2tlcjogWydjb2xvciddLFxuICBib3hNaWQ6IFsnY29sb3InXVxufTtcblxuY29uc3Qgc3VwcG9ydGVkQ2hhbm5lbHM6IENoYW5uZWxbXSA9IFsneCcsICd5JywgJ2NvbG9yJywgJ2RldGFpbCcsICdvcGFjaXR5JywgJ3NpemUnXTtcbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJVbnN1cHBvcnRlZENoYW5uZWxzKHNwZWM6IEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZzxzdHJpbmc+LCBCT1hQTE9UIHwgQm94UGxvdERlZj4pOiBHZW5lcmljVW5pdFNwZWM8RW5jb2Rpbmc8c3RyaW5nPiwgQk9YUExPVCB8IEJveFBsb3REZWY+IHtcbiAgcmV0dXJuIHtcbiAgICAuLi5zcGVjLFxuICAgIGVuY29kaW5nOiByZWR1Y2Uoc3BlYy5lbmNvZGluZywgKG5ld0VuY29kaW5nLCBmaWVsZERlZiwgY2hhbm5lbCkgPT4ge1xuICAgICAgaWYgKHN1cHBvcnRlZENoYW5uZWxzLmluZGV4T2YoY2hhbm5lbCkgPiAtMSkge1xuICAgICAgICBuZXdFbmNvZGluZ1tjaGFubmVsXSA9IGZpZWxkRGVmO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuaW5jb21wYXRpYmxlQ2hhbm5lbChjaGFubmVsLCBCT1hQTE9UKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3RW5jb2Rpbmc7XG4gICAgfSwge30pLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplQm94UGxvdChzcGVjOiBHZW5lcmljVW5pdFNwZWM8RW5jb2Rpbmc8c3RyaW5nPiwgQk9YUExPVCB8IEJveFBsb3REZWY+LCBjb25maWc6IENvbmZpZyk6IE5vcm1hbGl6ZWRMYXllclNwZWMge1xuICBzcGVjID0gZmlsdGVyVW5zdXBwb3J0ZWRDaGFubmVscyhzcGVjKTtcbiAgLy8gVE9ETzogdXNlIHNlbGVjdGlvblxuICBjb25zdCB7bWFyaywgZW5jb2RpbmcsIHNlbGVjdGlvbiwgcHJvamVjdGlvbjogX3AsIC4uLm91dGVyU3BlY30gPSBzcGVjO1xuXG4gIGxldCBrSVFSU2NhbGFyOiBudW1iZXIgPSB1bmRlZmluZWQ7XG4gIGlmIChpc051bWJlcihjb25maWcuYm94LmV4dGVudCkpIHtcbiAgICBrSVFSU2NhbGFyID0gY29uZmlnLmJveC5leHRlbnQ7XG4gIH1cblxuICBpZiAoaXNCb3hQbG90RGVmKG1hcmspKSB7XG4gICAgaWYgKG1hcmsuZXh0ZW50KSB7XG4gICAgICBpZihtYXJrLmV4dGVudCA9PT0gJ21pbi1tYXgnKSB7XG4gICAgICAgIGtJUVJTY2FsYXIgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3Qgb3JpZW50OiBPcmllbnQgPSBib3hPcmllbnQoc3BlYyk7XG4gIGNvbnN0IHt0cmFuc2Zvcm0sIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZiwgY29udGludW91c0F4aXMsIGVuY29kaW5nV2l0aG91dENvbnRpbnVvdXNBeGlzfSA9IGJveFBhcmFtcyhzcGVjLCBvcmllbnQsIGtJUVJTY2FsYXIpO1xuXG4gIGNvbnN0IHtjb2xvciwgc2l6ZSwgLi4uZW5jb2RpbmdXaXRob3V0U2l6ZUNvbG9yQW5kQ29udGludW91c0F4aXN9ID0gZW5jb2RpbmdXaXRob3V0Q29udGludW91c0F4aXM7XG5cbiAgLy8gU2l6ZSBlbmNvZGluZyBvciB0aGUgZGVmYXVsdCBjb25maWcuYm94LnNpemUgaXMgYXBwbGllZCB0byBib3ggYW5kIGJveE1pZFxuICBjb25zdCBzaXplTWl4aW5zID0gc2l6ZSA/IHtzaXplfSA6IGdldE1hcmtTcGVjaWZpY0NvbmZpZ01peGlucyhjb25maWcuYm94LCAnc2l6ZScpO1xuXG4gIGNvbnN0IGNvbnRpbnVvdXNBeGlzU2NhbGVBbmRBeGlzID0ge307XG4gIGlmIChjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuc2NhbGUpIHtcbiAgICBjb250aW51b3VzQXhpc1NjYWxlQW5kQXhpc1snc2NhbGUnXSA9IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5zY2FsZTtcbiAgfVxuICBpZiAoY29udGludW91c0F4aXNDaGFubmVsRGVmLmF4aXMpIHtcbiAgICBjb250aW51b3VzQXhpc1NjYWxlQW5kQXhpc1snYXhpcyddID0gY29udGludW91c0F4aXNDaGFubmVsRGVmLmF4aXM7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC4uLm91dGVyU3BlYyxcbiAgICB0cmFuc2Zvcm0sXG4gICAgbGF5ZXI6IFtcbiAgICAgIHsgLy8gbG93ZXIgd2hpc2tlclxuICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgdHlwZTogJ3J1bGUnLFxuICAgICAgICAgIHN0eWxlOiAnYm94V2hpc2tlcidcbiAgICAgICAgfSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICBbY29udGludW91c0F4aXNdOiB7XG4gICAgICAgICAgICBmaWVsZDogJ2xvd2VyX3doaXNrZXJfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZCxcbiAgICAgICAgICAgIHR5cGU6IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi50eXBlLFxuICAgICAgICAgICAgLi4uY29udGludW91c0F4aXNTY2FsZUFuZEF4aXNcbiAgICAgICAgICB9LFxuICAgICAgICAgIFtjb250aW51b3VzQXhpcyArICcyJ106IHtcbiAgICAgICAgICAgIGZpZWxkOiAnbG93ZXJfYm94XycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICAgICAgICB0eXBlOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYudHlwZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgLi4uZW5jb2RpbmdXaXRob3V0U2l6ZUNvbG9yQW5kQ29udGludW91c0F4aXMsXG4gICAgICAgICAgLi4uZ2V0TWFya1NwZWNpZmljQ29uZmlnTWl4aW5zKGNvbmZpZy5ib3hXaGlza2VyLCAnY29sb3InKVxuICAgICAgICB9XG4gICAgICB9LCB7IC8vIHVwcGVyIHdoaXNrZXJcbiAgICAgICAgbWFyazoge1xuICAgICAgICAgIHR5cGU6ICdydWxlJyxcbiAgICAgICAgICBzdHlsZTogJ2JveFdoaXNrZXInXG4gICAgICAgIH0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgW2NvbnRpbnVvdXNBeGlzXToge1xuICAgICAgICAgICAgZmllbGQ6ICd1cHBlcl9ib3hfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZCxcbiAgICAgICAgICAgIHR5cGU6IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi50eXBlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBbY29udGludW91c0F4aXMgKyAnMiddOiB7XG4gICAgICAgICAgICBmaWVsZDogJ3VwcGVyX3doaXNrZXJfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZCxcbiAgICAgICAgICAgIHR5cGU6IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi50eXBlXG4gICAgICAgICAgfSxcbiAgICAgICAgICAuLi5lbmNvZGluZ1dpdGhvdXRTaXplQ29sb3JBbmRDb250aW51b3VzQXhpcyxcbiAgICAgICAgICAuLi5nZXRNYXJrU3BlY2lmaWNDb25maWdNaXhpbnMoY29uZmlnLmJveFdoaXNrZXIsICdjb2xvcicpXG4gICAgICAgIH1cbiAgICAgIH0sIHsgLy8gYm94IChxMSB0byBxMylcbiAgICAgICAgLi4uKHNlbGVjdGlvbiA/IHtzZWxlY3Rpb259IDoge30pLFxuICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgdHlwZTogJ2JhcicsXG4gICAgICAgICAgc3R5bGU6ICdib3gnXG4gICAgICAgIH0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgW2NvbnRpbnVvdXNBeGlzXToge1xuICAgICAgICAgICAgZmllbGQ6ICdsb3dlcl9ib3hfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZCxcbiAgICAgICAgICAgIHR5cGU6IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi50eXBlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBbY29udGludW91c0F4aXMgKyAnMiddOiB7XG4gICAgICAgICAgICBmaWVsZDogJ3VwcGVyX2JveF8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgICAgICAgICAgdHlwZTogY29udGludW91c0F4aXNDaGFubmVsRGVmLnR5cGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIC4uLmVuY29kaW5nV2l0aG91dENvbnRpbnVvdXNBeGlzLFxuICAgICAgICAgIC4uLihlbmNvZGluZ1dpdGhvdXRDb250aW51b3VzQXhpcy5jb2xvciA/IHt9IDogZ2V0TWFya1NwZWNpZmljQ29uZmlnTWl4aW5zKGNvbmZpZy5ib3gsICdjb2xvcicpKSxcbiAgICAgICAgICAuLi5zaXplTWl4aW5zLFxuICAgICAgICB9XG4gICAgICB9LCB7IC8vIG1pZCB0aWNrXG4gICAgICAgIG1hcms6IHtcbiAgICAgICAgICB0eXBlOiAndGljaycsXG4gICAgICAgICAgc3R5bGU6ICdib3hNaWQnXG4gICAgICAgIH0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgW2NvbnRpbnVvdXNBeGlzXToge1xuICAgICAgICAgICAgZmllbGQ6ICdtaWRfYm94XycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICAgICAgICB0eXBlOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYudHlwZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgLi4uZW5jb2RpbmdXaXRob3V0U2l6ZUNvbG9yQW5kQ29udGludW91c0F4aXMsXG4gICAgICAgICAgLi4uZ2V0TWFya1NwZWNpZmljQ29uZmlnTWl4aW5zKGNvbmZpZy5ib3hNaWQsICdjb2xvcicpLFxuICAgICAgICAgIC4uLnNpemVNaXhpbnMsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdXG4gIH07XG59XG5cbmZ1bmN0aW9uIGJveE9yaWVudChzcGVjOiBHZW5lcmljVW5pdFNwZWM8RW5jb2Rpbmc8RmllbGQ+LCBCT1hQTE9UIHwgQm94UGxvdERlZj4pOiBPcmllbnQge1xuICBjb25zdCB7bWFyazogbWFyaywgZW5jb2Rpbmc6IGVuY29kaW5nLCBwcm9qZWN0aW9uOiBfcCwgLi4uX291dGVyU3BlY30gPSBzcGVjO1xuXG4gIGlmIChpc0ZpZWxkRGVmKGVuY29kaW5nLngpICYmIGlzQ29udGludW91cyhlbmNvZGluZy54KSkge1xuICAgIC8vIHggaXMgY29udGludW91c1xuICAgIGlmIChpc0ZpZWxkRGVmKGVuY29kaW5nLnkpICYmIGlzQ29udGludW91cyhlbmNvZGluZy55KSkge1xuICAgICAgLy8gYm90aCB4IGFuZCB5IGFyZSBjb250aW51b3VzXG4gICAgICBpZiAoZW5jb2RpbmcueC5hZ2dyZWdhdGUgPT09IHVuZGVmaW5lZCAmJiBlbmNvZGluZy55LmFnZ3JlZ2F0ZSA9PT0gQk9YUExPVCkge1xuICAgICAgICByZXR1cm4gJ3ZlcnRpY2FsJztcbiAgICAgIH0gZWxzZSBpZiAoZW5jb2RpbmcueS5hZ2dyZWdhdGUgPT09IHVuZGVmaW5lZCAmJiBlbmNvZGluZy54LmFnZ3JlZ2F0ZSA9PT0gQk9YUExPVCkge1xuICAgICAgICByZXR1cm4gJ2hvcml6b250YWwnO1xuICAgICAgfSBlbHNlIGlmIChlbmNvZGluZy54LmFnZ3JlZ2F0ZSA9PT0gQk9YUExPVCAmJiBlbmNvZGluZy55LmFnZ3JlZ2F0ZSA9PT0gQk9YUExPVCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JvdGggeCBhbmQgeSBjYW5ub3QgaGF2ZSBhZ2dyZWdhdGUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChpc0JveFBsb3REZWYobWFyaykgJiYgbWFyay5vcmllbnQpIHtcbiAgICAgICAgICByZXR1cm4gbWFyay5vcmllbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkZWZhdWx0IG9yaWVudGF0aW9uID0gdmVydGljYWxcbiAgICAgICAgcmV0dXJuICd2ZXJ0aWNhbCc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8geCBpcyBjb250aW51b3VzIGJ1dCB5IGlzIG5vdFxuICAgIHJldHVybiAnaG9yaXpvbnRhbCc7XG4gIH0gZWxzZSBpZiAoaXNGaWVsZERlZihlbmNvZGluZy55KSAmJiBpc0NvbnRpbnVvdXMoZW5jb2RpbmcueSkpIHtcbiAgICAvLyB5IGlzIGNvbnRpbnVvdXMgYnV0IHggaXMgbm90XG4gICAgcmV0dXJuICd2ZXJ0aWNhbCc7XG4gIH0gZWxzZSB7XG4gICAgLy8gTmVpdGhlciB4IG5vciB5IGlzIGNvbnRpbnVvdXMuXG4gICAgdGhyb3cgbmV3IEVycm9yKCdOZWVkIGEgdmFsaWQgY29udGludW91cyBheGlzIGZvciBib3hwbG90cycpO1xuICB9XG59XG5cblxuZnVuY3Rpb24gYm94Q29udGlub3VzQXhpcyhzcGVjOiBHZW5lcmljVW5pdFNwZWM8RW5jb2Rpbmc8c3RyaW5nPiwgQk9YUExPVCB8IEJveFBsb3REZWY+LCBvcmllbnQ6IE9yaWVudCkge1xuICBjb25zdCB7bWFyazogbWFyaywgZW5jb2Rpbmc6IGVuY29kaW5nLCBwcm9qZWN0aW9uOiBfcCwgLi4uX291dGVyU3BlY30gPSBzcGVjO1xuXG4gIGxldCBjb250aW51b3VzQXhpc0NoYW5uZWxEZWY6IFBvc2l0aW9uRmllbGREZWY8c3RyaW5nPjtcbiAgbGV0IGNvbnRpbnVvdXNBeGlzOiAneCcgfCAneSc7XG5cbiAgaWYgKG9yaWVudCA9PT0gJ3ZlcnRpY2FsJykge1xuICAgIGNvbnRpbnVvdXNBeGlzID0gJ3knO1xuICAgIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZiA9IGVuY29kaW5nLnkgYXMgRmllbGREZWY8c3RyaW5nPjsgLy8gU2FmZSB0byBjYXN0IGJlY2F1c2UgaWYgeSBpcyBub3QgY29udGludW91cyBmaWVsZGRlZiwgdGhlIG9yaWVudCB3b3VsZCBub3QgYmUgdmVydGljYWwuXG4gIH0gZWxzZSB7XG4gICAgY29udGludW91c0F4aXMgPSAneCc7XG4gICAgY29udGludW91c0F4aXNDaGFubmVsRGVmID0gZW5jb2RpbmcueCBhcyBGaWVsZERlZjxzdHJpbmc+OyAvLyBTYWZlIHRvIGNhc3QgYmVjYXVzZSBpZiB4IGlzIG5vdCBjb250aW51b3VzIGZpZWxkZGVmLCB0aGUgb3JpZW50IHdvdWxkIG5vdCBiZSBob3Jpem9udGFsLlxuICB9XG5cbiAgaWYgKGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZiAmJiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuYWdncmVnYXRlKSB7XG4gICAgY29uc3Qge2FnZ3JlZ2F0ZSwgLi4uY29udGludW91c0F4aXNXaXRob3V0QWdncmVnYXRlfSA9IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZjtcbiAgICBpZiAoYWdncmVnYXRlICE9PSBCT1hQTE9UKSB7XG4gICAgICBsb2cud2FybihgQ29udGludW91cyBheGlzIHNob3VsZCBub3QgaGF2ZSBjdXN0b21pemVkIGFnZ3JlZ2F0aW9uIGZ1bmN0aW9uICR7YWdncmVnYXRlfWApO1xuICAgIH1cbiAgICBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYgPSBjb250aW51b3VzQXhpc1dpdGhvdXRBZ2dyZWdhdGU7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZixcbiAgICBjb250aW51b3VzQXhpc1xuICB9O1xufVxuXG5mdW5jdGlvbiBib3hQYXJhbXMoc3BlYzogR2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPHN0cmluZz4sIEJPWFBMT1QgfCBCb3hQbG90RGVmPiwgb3JpZW50OiBPcmllbnQsIGtJUVJTY2FsYXI6ICdtaW4tbWF4JyB8IG51bWJlcikge1xuXG4gIGNvbnN0IHtjb250aW51b3VzQXhpc0NoYW5uZWxEZWYsIGNvbnRpbnVvdXNBeGlzfSA9IGJveENvbnRpbm91c0F4aXMoc3BlYywgb3JpZW50KTtcbiAgY29uc3QgZW5jb2RpbmcgPSBzcGVjLmVuY29kaW5nO1xuXG4gIGNvbnN0IGlzTWluTWF4ID0ga0lRUlNjYWxhciA9PT0gdW5kZWZpbmVkO1xuICBjb25zdCBhZ2dyZWdhdGU6IEFnZ3JlZ2F0ZWRGaWVsZERlZltdID0gW1xuICAgIHtcbiAgICAgIG9wOiAncTEnLFxuICAgICAgZmllbGQ6IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZCxcbiAgICAgIGFzOiAnbG93ZXJfYm94XycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGRcbiAgICB9LFxuICAgIHtcbiAgICAgIG9wOiAncTMnLFxuICAgICAgZmllbGQ6IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZCxcbiAgICAgIGFzOiAndXBwZXJfYm94XycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGRcbiAgICB9LFxuICAgIHtcbiAgICAgIG9wOiAnbWVkaWFuJyxcbiAgICAgIGZpZWxkOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICBhczogJ21pZF9ib3hfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZFxuICAgIH1cbiAgXTtcbiAgbGV0IHBvc3RBZ2dyZWdhdGVDYWxjdWxhdGVzOiBDYWxjdWxhdGVUcmFuc2Zvcm1bXSA9IFtdO1xuXG4gIGFnZ3JlZ2F0ZS5wdXNoKHtcbiAgICBvcDogJ21pbicsXG4gICAgZmllbGQ6IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZCxcbiAgICBhczogKGlzTWluTWF4ID8gJ2xvd2VyX3doaXNrZXJfJyA6ICdtaW5fJykgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGRcbiAgfSk7XG4gIGFnZ3JlZ2F0ZS5wdXNoKHtcbiAgICBvcDogJ21heCcsXG4gICAgZmllbGQ6IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZCxcbiAgICBhczogIChpc01pbk1heCA/ICd1cHBlcl93aGlza2VyXycgOiAnbWF4XycpICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkXG4gIH0pO1xuXG4gIGlmICghaXNNaW5NYXgpIHtcbiAgICBwb3N0QWdncmVnYXRlQ2FsY3VsYXRlcyA9IFtcbiAgICAgIHtcbiAgICAgICAgY2FsY3VsYXRlOiBgZGF0dW0udXBwZXJfYm94XyR7Y29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkfSAtIGRhdHVtLmxvd2VyX2JveF8ke2NvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZH1gLFxuICAgICAgICBhczogJ2lxcl8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjYWxjdWxhdGU6IGBtaW4oZGF0dW0udXBwZXJfYm94XyR7Y29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkfSArIGRhdHVtLmlxcl8ke2NvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZH0gKiAke2tJUVJTY2FsYXJ9LCBkYXR1bS5tYXhfJHtjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGR9KWAsXG4gICAgICAgIGFzOiAndXBwZXJfd2hpc2tlcl8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjYWxjdWxhdGU6IGBtYXgoZGF0dW0ubG93ZXJfYm94XyR7Y29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkfSAtIGRhdHVtLmlxcl8ke2NvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZH0gKiAke2tJUVJTY2FsYXJ9LCBkYXR1bS5taW5fJHtjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGR9KWAsXG4gICAgICAgIGFzOiAnbG93ZXJfd2hpc2tlcl8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkXG4gICAgICB9XG4gICAgXTtcbiAgfVxuXG4gIGNvbnN0IGdyb3VwYnk6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IGJpbnM6IEJpblRyYW5zZm9ybVtdID0gW107XG4gIGNvbnN0IHRpbWVVbml0czogVGltZVVuaXRUcmFuc2Zvcm1bXSA9IFtdO1xuXG4gIGNvbnN0IGVuY29kaW5nV2l0aG91dENvbnRpbnVvdXNBeGlzOiBFbmNvZGluZzxzdHJpbmc+ID0ge307XG4gIGZvckVhY2goZW5jb2RpbmcsIChjaGFubmVsRGVmLCBjaGFubmVsKSA9PiB7XG4gICAgaWYgKGNoYW5uZWwgPT09IGNvbnRpbnVvdXNBeGlzKSB7XG4gICAgICAvLyBTa2lwIGNvbnRpbnVvdXMgYXhpcyBhcyB3ZSBhbHJlYWR5IGhhbmRsZSBpdCBzZXBhcmF0ZWx5XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChpc0ZpZWxkRGVmKGNoYW5uZWxEZWYpKSB7XG4gICAgICBpZiAoY2hhbm5lbERlZi5hZ2dyZWdhdGUgJiYgY2hhbm5lbERlZi5hZ2dyZWdhdGUgIT09IEJPWFBMT1QpIHtcbiAgICAgICAgYWdncmVnYXRlLnB1c2goe1xuICAgICAgICAgIG9wOiBjaGFubmVsRGVmLmFnZ3JlZ2F0ZSxcbiAgICAgICAgICBmaWVsZDogY2hhbm5lbERlZi5maWVsZCxcbiAgICAgICAgICBhczogdmdGaWVsZChjaGFubmVsRGVmKVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoY2hhbm5lbERlZi5hZ2dyZWdhdGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zdCB0cmFuc2Zvcm1lZEZpZWxkID0gdmdGaWVsZChjaGFubmVsRGVmKTtcblxuICAgICAgICAvLyBBZGQgYmluIG9yIHRpbWVVbml0IHRyYW5zZm9ybSBpZiBhcHBsaWNhYmxlXG4gICAgICAgIGNvbnN0IGJpbiA9IGNoYW5uZWxEZWYuYmluO1xuICAgICAgICBpZiAoYmluKSB7XG4gICAgICAgICAgY29uc3Qge2ZpZWxkfSA9IGNoYW5uZWxEZWY7XG4gICAgICAgICAgYmlucy5wdXNoKHtiaW4sIGZpZWxkLCBhczogdHJhbnNmb3JtZWRGaWVsZH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGNoYW5uZWxEZWYudGltZVVuaXQpIHtcbiAgICAgICAgICBjb25zdCB7dGltZVVuaXQsIGZpZWxkfSA9IGNoYW5uZWxEZWY7XG4gICAgICAgICAgdGltZVVuaXRzLnB1c2goe3RpbWVVbml0LCBmaWVsZCwgYXM6IHRyYW5zZm9ybWVkRmllbGR9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdyb3VwYnkucHVzaCh0cmFuc2Zvcm1lZEZpZWxkKTtcbiAgICAgIH1cbiAgICAgIC8vIG5vdyB0aGUgZmllbGQgc2hvdWxkIHJlZmVyIHRvIHBvc3QtdHJhbnNmb3JtZWQgZmllbGQgaW5zdGVhZFxuICAgICAgZW5jb2RpbmdXaXRob3V0Q29udGludW91c0F4aXNbY2hhbm5lbF0gPSB7XG4gICAgICAgIGZpZWxkOiB2Z0ZpZWxkKGNoYW5uZWxEZWYpLFxuICAgICAgICB0eXBlOiBjaGFubmVsRGVmLnR5cGVcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEZvciB2YWx1ZSBkZWYsIGp1c3QgY29weVxuICAgICAgZW5jb2RpbmdXaXRob3V0Q29udGludW91c0F4aXNbY2hhbm5lbF0gPSBlbmNvZGluZ1tjaGFubmVsXTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgdHJhbnNmb3JtOiBbXS5jb25jYXQoXG4gICAgICBiaW5zLFxuICAgICAgdGltZVVuaXRzLFxuICAgICAgW3thZ2dyZWdhdGUsIGdyb3VwYnl9XSxcbiAgICAgIHBvc3RBZ2dyZWdhdGVDYWxjdWxhdGVzXG4gICAgKSxcbiAgICBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYsXG4gICAgY29udGludW91c0F4aXMsXG4gICAgZW5jb2RpbmdXaXRob3V0Q29udGludW91c0F4aXNcbiAgfTtcbn1cbiJdfQ==