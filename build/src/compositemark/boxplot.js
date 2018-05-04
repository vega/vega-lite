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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm94cGxvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb3NpdGVtYXJrL2JveHBsb3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFHbkMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUVuQyxPQUFPLEVBQVcsT0FBTyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2hELE9BQU8sRUFBa0IsWUFBWSxFQUFFLFVBQVUsRUFBb0IsT0FBTyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ25HLE9BQU8sS0FBSyxHQUFHLE1BQU0sVUFBVSxDQUFDO0FBSWhDLE9BQU8sRUFBQywyQkFBMkIsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUdyRCxNQUFNLENBQUMsSUFBTSxPQUFPLEdBQWUsVUFBVSxDQUFDO0FBMEI5QyxNQUFNLHVCQUF1QixJQUEwQjtJQUNyRCxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDeEIsQ0FBQztBQUVELE1BQU0sQ0FBQyxJQUFNLGNBQWMsR0FBbUIsQ0FBQyxZQUFZLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBOEI5RSxNQUFNLENBQUMsSUFBTSxxQ0FBcUMsR0FFOUM7SUFDRixHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQztJQUNoQyxVQUFVLEVBQUUsQ0FBQyxPQUFPLENBQUM7SUFDckIsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDO0NBQ2xCLENBQUM7QUFFRixJQUFNLGlCQUFpQixHQUFjLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN0RixNQUFNLG9DQUFvQyxJQUE2RDtJQUNyRyw0QkFDSyxJQUFJLElBQ1AsUUFBUSxFQUFFLE1BQU0sQ0FBQyxJ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QUFDLEVBQ3RCLHVCQUF1QixDQUN4QjtRQUNELHdCQUF3QiwwQkFBQTtRQUN4QixjQUFjLGdCQUFBO1FBQ2QsNkJBQTZCLCtCQUFBO0tBQzlCLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc051bWJlcn0gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCB7Q2hhbm5lbH0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7cmVkdWNlfSBmcm9tICcuLi9lbmNvZGluZyc7XG5pbXBvcnQge0FnZ3JlZ2F0ZWRGaWVsZERlZiwgQmluVHJhbnNmb3JtLCBDYWxjdWxhdGVUcmFuc2Zvcm0sIFRpbWVVbml0VHJhbnNmb3JtfSBmcm9tICcuLi90cmFuc2Zvcm0nO1xuaW1wb3J0IHtFbmNvZGluZywgZm9yRWFjaH0gZnJvbSAnLi8uLi9lbmNvZGluZyc7XG5pbXBvcnQge0ZpZWxkLCBGaWVsZERlZiwgaXNDb250aW51b3VzLCBpc0ZpZWxkRGVmLCBQb3NpdGlvbkZpZWxkRGVmLCB2Z0ZpZWxkfSBmcm9tICcuLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLy4uL2xvZyc7XG5pbXBvcnQge01hcmtDb25maWd9IGZyb20gJy4vLi4vbWFyayc7XG5pbXBvcnQge0dlbmVyaWNVbml0U3BlYywgTm9ybWFsaXplZExheWVyU3BlY30gZnJvbSAnLi8uLi9zcGVjJztcbmltcG9ydCB7T3JpZW50fSBmcm9tICcuLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7Z2V0TWFya1NwZWNpZmljQ29uZmlnTWl4aW5zfSBmcm9tICcuL2NvbW1vbic7XG5cblxuZXhwb3J0IGNvbnN0IEJPWFBMT1Q6ICdib3gtcGxvdCcgPSAnYm94LXBsb3QnO1xuZXhwb3J0IHR5cGUgQk9YUExPVCA9IHR5cGVvZiBCT1hQTE9UO1xuZXhwb3J0IHR5cGUgQm94UGxvdFN0eWxlID0gJ2JveFdoaXNrZXInIHwgJ2JveCcgfCAnYm94TWlkJztcblxuXG5leHBvcnQgaW50ZXJmYWNlIEJveFBsb3REZWYge1xuICAvKipcbiAgICogVHlwZSBvZiB0aGUgbWFyay4gIEZvciBib3ggcGxvdHMsIHRoaXMgc2hvdWxkIGFsd2F5cyBiZSBgXCJib3gtcGxvdFwiYC5cbiAgICogW2JveHBsb3RdKGNvbXBvc2l0ZW1hcmsuaHRtbCNib3hwbG90KVxuICAgKi9cbiAgdHlwZTogQk9YUExPVDtcblxuICAvKipcbiAgICogT3JpZW50YXRpb24gb2YgdGhlIGJveCBwbG90LiAgVGhpcyBpcyBub3JtYWxseSBhdXRvbWF0aWNhbGx5IGRldGVybWluZWQsIGJ1dCBjYW4gYmUgc3BlY2lmaWVkIHdoZW4gdGhlIG9yaWVudGF0aW9uIGlzIGFtYmlndW91cyBhbmQgY2Fubm90IGJlIGF1dG9tYXRpY2FsbHkgZGV0ZXJtaW5lZC5cbiAgICovXG4gIG9yaWVudD86IE9yaWVudDtcblxuICAvKipcbiAgICogRXh0ZW50IGlzIHVzZWQgdG8gZGV0ZXJtaW5lIHdoZXJlIHRoZSB3aGlza2VycyBleHRlbmQgdG8uIFRoZSBvcHRpb25zIGFyZVxuICAgKiAtIGBcIm1pbi1tYXhcIjogbWluIGFuZCBtYXggYXJlIHRoZSBsb3dlciBhbmQgdXBwZXIgd2hpc2tlcnMgcmVzcGVjdGl2ZWx5LlxuICAgKiAtICBBIHNjYWxhciAoaW50ZWdlciBvciBmbG9hdGluZyBwb2ludCBudW1iZXIpIHRoYXQgd2lsbCBiZSBtdWx0aXBsaWVkIGJ5IHRoZSBJUVIgYW5kIHRoZSBwcm9kdWN0IHdpbGwgYmUgYWRkZWQgdG8gdGhlIHRoaXJkIHF1YXJ0aWxlIHRvIGdldCB0aGUgdXBwZXIgd2hpc2tlciBhbmQgc3VidHJhY3RlZCBmcm9tIHRoZSBmaXJzdCBxdWFydGlsZSB0byBnZXQgdGhlIGxvd2VyIHdoaXNrZXIuXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBgXCIxLjVcImAuXG4gICAqL1xuICBleHRlbnQ/OiAnbWluLW1heCcgfCBudW1iZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0JveFBsb3REZWYobWFyazogQk9YUExPVCB8IEJveFBsb3REZWYpOiBtYXJrIGlzIEJveFBsb3REZWYge1xuICByZXR1cm4gISFtYXJrWyd0eXBlJ107XG59XG5cbmV4cG9ydCBjb25zdCBCT1hQTE9UX1NUWUxFUzogQm94UGxvdFN0eWxlW10gPSBbJ2JveFdoaXNrZXInLCAnYm94JywgJ2JveE1pZCddO1xuXG5leHBvcnQgaW50ZXJmYWNlIEJveFBsb3RDb25maWcgZXh0ZW5kcyBNYXJrQ29uZmlnIHtcbiAgLyoqIFNpemUgb2YgdGhlIGJveCBhbmQgbWlkIHRpY2sgb2YgYSBib3ggcGxvdCAqL1xuICBzaXplPzogbnVtYmVyO1xuICAvKiogVGhlIGRlZmF1bHQgZXh0ZW50LCB3aGljaCBpcyB1c2VkIHRvIGRldGVybWluZSB3aGVyZSB0aGUgd2hpc2tlcnMgZXh0ZW5kIHRvLiBUaGUgb3B0aW9ucyBhcmVcbiAgICogLSBgXCJtaW4tbWF4XCI6IG1pbiBhbmQgbWF4IGFyZSB0aGUgbG93ZXIgYW5kIHVwcGVyIHdoaXNrZXJzIHJlc3BlY3RpdmVseS5cbiAgICogLSBgXCJudW1iZXJcIjogQSBzY2FsYXIgKGludGVnZXIgb3IgZmxvYXRpbmcgcG9pbnQgbnVtYmVyKSB0aGF0IHdpbGwgYmUgbXVsdGlwbGllZCBieSB0aGUgSVFSIGFuZCB0aGUgcHJvZHVjdCB3aWxsIGJlIGFkZGVkIHRvIHRoZSB0aGlyZCBxdWFydGlsZSB0byBnZXQgdGhlIHVwcGVyIHdoaXNrZXIgYW5kIHN1YnRyYWN0ZWQgZnJvbSB0aGUgZmlyc3QgcXVhcnRpbGUgdG8gZ2V0IHRoZSBsb3dlciB3aGlza2VyLlxuICAgKi9cbiAgZXh0ZW50PzogJ21pbi1tYXgnIHwgbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJveFBsb3RDb25maWdNaXhpbnMge1xuICAvKipcbiAgICogQm94IENvbmZpZ1xuICAgKiBAaGlkZVxuICAgKi9cbiAgYm94PzogQm94UGxvdENvbmZpZztcblxuICAvKipcbiAgICogQGhpZGVcbiAgICovXG4gIGJveFdoaXNrZXI/OiBNYXJrQ29uZmlnO1xuXG4gIC8qKlxuICAgKiBAaGlkZVxuICAgKi9cbiAgYm94TWlkPzogTWFya0NvbmZpZztcbn1cblxuZXhwb3J0IGNvbnN0IFZMX09OTFlfQk9YUExPVF9DT05GSUdfUFJPUEVSVFlfSU5ERVg6IHtcbiAgW2sgaW4ga2V5b2YgQm94UGxvdENvbmZpZ01peGluc10/OiAoa2V5b2YgQm94UGxvdENvbmZpZ01peGluc1trXSlbXVxufSA9IHtcbiAgYm94OiBbJ3NpemUnLCAnY29sb3InLCAnZXh0ZW50J10sXG4gIGJveFdoaXNrZXI6IFsnY29sb3InXSxcbiAgYm94TWlkOiBbJ2NvbG9yJ11cbn07XG5cbmNvbnN0IHN1cHBvcnRlZENoYW5uZWxzOiBDaGFubmVsW10gPSBbJ3gnLCAneScsICdjb2xvcicsICdkZXRhaWwnLCAnb3BhY2l0eScsICdzaXplJ107XG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyVW5zdXBwb3J0ZWRDaGFubmVscyhzcGVjOiBHZW5lcmljVW5pdFNwZWM8RW5jb2Rpbmc8c3RyaW5nPiwgQk9YUExPVCB8IEJveFBsb3REZWY+KTogR2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPHN0cmluZz4sIEJPWFBMT1QgfCBCb3hQbG90RGVmPiB7XG4gIHJldHVybiB7XG4gICAgLi4uc3BlYyxcbiAgICBlbmNvZGluZzogcmVkdWNlKHNwZWMuZW5jb2RpbmcsIChuZXdFbmNvZGluZywgZmllbGREZWYsIGNoYW5uZWwpID0+IHtcbiAgICAgIGlmIChzdXBwb3J0ZWRDaGFubmVscy5pbmRleE9mKGNoYW5uZWwpID4gLTEpIHtcbiAgICAgICAgbmV3RW5jb2RpbmdbY2hhbm5lbF0gPSBmaWVsZERlZjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmluY29tcGF0aWJsZUNoYW5uZWwoY2hhbm5lbCwgQk9YUExPVCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ld0VuY29kaW5nO1xuICAgIH0sIHt9KSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUJveFBsb3Qoc3BlYzogR2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPHN0cmluZz4sIEJPWFBMT1QgfCBCb3hQbG90RGVmPiwgY29uZmlnOiBDb25maWcpOiBOb3JtYWxpemVkTGF5ZXJTcGVjIHtcbiAgc3BlYyA9IGZpbHRlclVuc3VwcG9ydGVkQ2hhbm5lbHMoc3BlYyk7XG4gIC8vIFRPRE86IHVzZSBzZWxlY3Rpb25cbiAgY29uc3Qge21hcmssIGVuY29kaW5nLCBzZWxlY3Rpb24sIHByb2plY3Rpb246IF9wLCAuLi5vdXRlclNwZWN9ID0gc3BlYztcblxuICBsZXQga0lRUlNjYWxhcjogbnVtYmVyID0gdW5kZWZpbmVkO1xuICBpZiAoaXNOdW1iZXIoY29uZmlnLmJveC5leHRlbnQpKSB7XG4gICAga0lRUlNjYWxhciA9IGNvbmZpZy5ib3guZXh0ZW50O1xuICB9XG5cbiAgaWYgKGlzQm94UGxvdERlZihtYXJrKSkge1xuICAgIGlmIChtYXJrLmV4dGVudCkge1xuICAgICAgaWYobWFyay5leHRlbnQgPT09ICdtaW4tbWF4Jykge1xuICAgICAgICBrSVFSU2NhbGFyID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG9yaWVudDogT3JpZW50ID0gYm94T3JpZW50KHNwZWMpO1xuICBjb25zdCB7dHJhbnNmb3JtLCBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYsIGNvbnRpbnVvdXNBeGlzLCBlbmNvZGluZ1dpdGhvdXRDb250aW51b3VzQXhpc30gPSBib3hQYXJhbXMoc3BlYywgb3JpZW50LCBrSVFSU2NhbGFyKTtcblxuICBjb25zdCB7Y29sb3IsIHNpemUsIC4uLmVuY29kaW5nV2l0aG91dFNpemVDb2xvckFuZENvbnRpbnVvdXNBeGlzfSA9IGVuY29kaW5nV2l0aG91dENvbnRpbnVvdXNBeGlzO1xuXG4gIC8vIFNpemUgZW5jb2Rpbmcgb3IgdGhlIGRlZmF1bHQgY29uZmlnLmJveC5zaXplIGlzIGFwcGxpZWQgdG8gYm94IGFuZCBib3hNaWRcbiAgY29uc3Qgc2l6ZU1peGlucyA9IHNpemUgPyB7c2l6ZX0gOiBnZXRNYXJrU3BlY2lmaWNDb25maWdNaXhpbnMoY29uZmlnLmJveCwgJ3NpemUnKTtcblxuICBjb25zdCBjb250aW51b3VzQXhpc1NjYWxlQW5kQXhpcyA9IHt9O1xuICBpZiAoY29udGludW91c0F4aXNDaGFubmVsRGVmLnNjYWxlKSB7XG4gICAgY29udGludW91c0F4aXNTY2FsZUFuZEF4aXNbJ3NjYWxlJ10gPSBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuc2NhbGU7XG4gIH1cbiAgaWYgKGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5heGlzKSB7XG4gICAgY29udGludW91c0F4aXNTY2FsZUFuZEF4aXNbJ2F4aXMnXSA9IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5heGlzO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5vdXRlclNwZWMsXG4gICAgdHJhbnNmb3JtLFxuICAgIGxheWVyOiBbXG4gICAgICB7IC8vIGxvd2VyIHdoaXNrZXJcbiAgICAgICAgbWFyazoge1xuICAgICAgICAgIHR5cGU6ICdydWxlJyxcbiAgICAgICAgICBzdHlsZTogJ2JveFdoaXNrZXInXG4gICAgICAgIH0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgW2NvbnRpbnVvdXNBeGlzXToge1xuICAgICAgICAgICAgZmllbGQ6ICdsb3dlcl93aGlza2VyXycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICAgICAgICB0eXBlOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYudHlwZSxcbiAgICAgICAgICAgIC4uLmNvbnRpbnVvdXNBeGlzU2NhbGVBbmRBeGlzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBbY29udGludW91c0F4aXMgKyAnMiddOiB7XG4gICAgICAgICAgICBmaWVsZDogJ2xvd2VyX2JveF8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgICAgICAgICAgdHlwZTogY29udGludW91c0F4aXNDaGFubmVsRGVmLnR5cGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIC4uLmVuY29kaW5nV2l0aG91dFNpemVDb2xvckFuZENvbnRpbnVvdXNBeGlzLFxuICAgICAgICAgIC4uLmdldE1hcmtTcGVjaWZpY0NvbmZpZ01peGlucyhjb25maWcuYm94V2hpc2tlciwgJ2NvbG9yJylcbiAgICAgICAgfVxuICAgICAgfSwgeyAvLyB1cHBlciB3aGlza2VyXG4gICAgICAgIG1hcms6IHtcbiAgICAgICAgICB0eXBlOiAncnVsZScsXG4gICAgICAgICAgc3R5bGU6ICdib3hXaGlza2VyJ1xuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFtjb250aW51b3VzQXhpc106IHtcbiAgICAgICAgICAgIGZpZWxkOiAndXBwZXJfYm94XycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICAgICAgICB0eXBlOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYudHlwZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgW2NvbnRpbnVvdXNBeGlzICsgJzInXToge1xuICAgICAgICAgICAgZmllbGQ6ICd1cHBlcl93aGlza2VyXycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICAgICAgICB0eXBlOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYudHlwZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgLi4uZW5jb2RpbmdXaXRob3V0U2l6ZUNvbG9yQW5kQ29udGludW91c0F4aXMsXG4gICAgICAgICAgLi4uZ2V0TWFya1NwZWNpZmljQ29uZmlnTWl4aW5zKGNvbmZpZy5ib3hXaGlza2VyLCAnY29sb3InKVxuICAgICAgICB9XG4gICAgICB9LCB7IC8vIGJveCAocTEgdG8gcTMpXG4gICAgICAgIC4uLihzZWxlY3Rpb24gPyB7c2VsZWN0aW9ufSA6IHt9KSxcbiAgICAgICAgbWFyazoge1xuICAgICAgICAgIHR5cGU6ICdiYXInLFxuICAgICAgICAgIHN0eWxlOiAnYm94J1xuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFtjb250aW51b3VzQXhpc106IHtcbiAgICAgICAgICAgIGZpZWxkOiAnbG93ZXJfYm94XycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICAgICAgICB0eXBlOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYudHlwZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgW2NvbnRpbnVvdXNBeGlzICsgJzInXToge1xuICAgICAgICAgICAgZmllbGQ6ICd1cHBlcl9ib3hfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZCxcbiAgICAgICAgICAgIHR5cGU6IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi50eXBlXG4gICAgICAgICAgfSxcbiAgICAgICAgICAuLi5lbmNvZGluZ1dpdGhvdXRDb250aW51b3VzQXhpcyxcbiAgICAgICAgICAuLi4oZW5jb2RpbmdXaXRob3V0Q29udGludW91c0F4aXMuY29sb3IgPyB7fSA6IGdldE1hcmtTcGVjaWZpY0NvbmZpZ01peGlucyhjb25maWcuYm94LCAnY29sb3InKSksXG4gICAgICAgICAgLi4uc2l6ZU1peGlucyxcbiAgICAgICAgfVxuICAgICAgfSwgeyAvLyBtaWQgdGlja1xuICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgdHlwZTogJ3RpY2snLFxuICAgICAgICAgIHN0eWxlOiAnYm94TWlkJ1xuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFtjb250aW51b3VzQXhpc106IHtcbiAgICAgICAgICAgIGZpZWxkOiAnbWlkX2JveF8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgICAgICAgICAgdHlwZTogY29udGludW91c0F4aXNDaGFubmVsRGVmLnR5cGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIC4uLmVuY29kaW5nV2l0aG91dFNpemVDb2xvckFuZENvbnRpbnVvdXNBeGlzLFxuICAgICAgICAgIC4uLmdldE1hcmtTcGVjaWZpY0NvbmZpZ01peGlucyhjb25maWcuYm94TWlkLCAnY29sb3InKSxcbiAgICAgICAgICAuLi5zaXplTWl4aW5zLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgXVxuICB9O1xufVxuXG5mdW5jdGlvbiBib3hPcmllbnQoc3BlYzogR2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPEZpZWxkPiwgQk9YUExPVCB8IEJveFBsb3REZWY+KTogT3JpZW50IHtcbiAgY29uc3Qge21hcms6IG1hcmssIGVuY29kaW5nOiBlbmNvZGluZywgcHJvamVjdGlvbjogX3AsIC4uLl9vdXRlclNwZWN9ID0gc3BlYztcblxuICBpZiAoaXNGaWVsZERlZihlbmNvZGluZy54KSAmJiBpc0NvbnRpbnVvdXMoZW5jb2RpbmcueCkpIHtcbiAgICAvLyB4IGlzIGNvbnRpbnVvdXNcbiAgICBpZiAoaXNGaWVsZERlZihlbmNvZGluZy55KSAmJiBpc0NvbnRpbnVvdXMoZW5jb2RpbmcueSkpIHtcbiAgICAgIC8vIGJvdGggeCBhbmQgeSBhcmUgY29udGludW91c1xuICAgICAgaWYgKGVuY29kaW5nLnguYWdncmVnYXRlID09PSB1bmRlZmluZWQgJiYgZW5jb2RpbmcueS5hZ2dyZWdhdGUgPT09IEJPWFBMT1QpIHtcbiAgICAgICAgcmV0dXJuICd2ZXJ0aWNhbCc7XG4gICAgICB9IGVsc2UgaWYgKGVuY29kaW5nLnkuYWdncmVnYXRlID09PSB1bmRlZmluZWQgJiYgZW5jb2RpbmcueC5hZ2dyZWdhdGUgPT09IEJPWFBMT1QpIHtcbiAgICAgICAgcmV0dXJuICdob3Jpem9udGFsJztcbiAgICAgIH0gZWxzZSBpZiAoZW5jb2RpbmcueC5hZ2dyZWdhdGUgPT09IEJPWFBMT1QgJiYgZW5jb2RpbmcueS5hZ2dyZWdhdGUgPT09IEJPWFBMT1QpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCb3RoIHggYW5kIHkgY2Fubm90IGhhdmUgYWdncmVnYXRlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaXNCb3hQbG90RGVmKG1hcmspICYmIG1hcmsub3JpZW50KSB7XG4gICAgICAgICAgcmV0dXJuIG1hcmsub3JpZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZGVmYXVsdCBvcmllbnRhdGlvbiA9IHZlcnRpY2FsXG4gICAgICAgIHJldHVybiAndmVydGljYWwnO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHggaXMgY29udGludW91cyBidXQgeSBpcyBub3RcbiAgICByZXR1cm4gJ2hvcml6b250YWwnO1xuICB9IGVsc2UgaWYgKGlzRmllbGREZWYoZW5jb2RpbmcueSkgJiYgaXNDb250aW51b3VzKGVuY29kaW5nLnkpKSB7XG4gICAgLy8geSBpcyBjb250aW51b3VzIGJ1dCB4IGlzIG5vdFxuICAgIHJldHVybiAndmVydGljYWwnO1xuICB9IGVsc2Uge1xuICAgIC8vIE5laXRoZXIgeCBub3IgeSBpcyBjb250aW51b3VzLlxuICAgIHRocm93IG5ldyBFcnJvcignTmVlZCBhIHZhbGlkIGNvbnRpbnVvdXMgYXhpcyBmb3IgYm94cGxvdHMnKTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGJveENvbnRpbm91c0F4aXMoc3BlYzogR2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPHN0cmluZz4sIEJPWFBMT1QgfCBCb3hQbG90RGVmPiwgb3JpZW50OiBPcmllbnQpIHtcbiAgY29uc3Qge21hcms6IG1hcmssIGVuY29kaW5nOiBlbmNvZGluZywgcHJvamVjdGlvbjogX3AsIC4uLl9vdXRlclNwZWN9ID0gc3BlYztcblxuICBsZXQgY29udGludW91c0F4aXNDaGFubmVsRGVmOiBQb3NpdGlvbkZpZWxkRGVmPHN0cmluZz47XG4gIGxldCBjb250aW51b3VzQXhpczogJ3gnIHwgJ3knO1xuXG4gIGlmIChvcmllbnQgPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICBjb250aW51b3VzQXhpcyA9ICd5JztcbiAgICBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYgPSBlbmNvZGluZy55IGFzIEZpZWxkRGVmPHN0cmluZz47IC8vIFNhZmUgdG8gY2FzdCBiZWNhdXNlIGlmIHkgaXMgbm90IGNvbnRpbnVvdXMgZmllbGRkZWYsIHRoZSBvcmllbnQgd291bGQgbm90IGJlIHZlcnRpY2FsLlxuICB9IGVsc2Uge1xuICAgIGNvbnRpbnVvdXNBeGlzID0gJ3gnO1xuICAgIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZiA9IGVuY29kaW5nLnggYXMgRmllbGREZWY8c3RyaW5nPjsgLy8gU2FmZSB0byBjYXN0IGJlY2F1c2UgaWYgeCBpcyBub3QgY29udGludW91cyBmaWVsZGRlZiwgdGhlIG9yaWVudCB3b3VsZCBub3QgYmUgaG9yaXpvbnRhbC5cbiAgfVxuXG4gIGlmIChjb250aW51b3VzQXhpc0NoYW5uZWxEZWYgJiYgY29udGludW91c0F4aXNDaGFubmVsRGVmLmFnZ3JlZ2F0ZSkge1xuICAgIGNvbnN0IHthZ2dyZWdhdGUsIC4uLmNvbnRpbnVvdXNBeGlzV2l0aG91dEFnZ3JlZ2F0ZX0gPSBjb250aW51b3VzQXhpc0NoYW5uZWxEZWY7XG4gICAgaWYgKGFnZ3JlZ2F0ZSAhPT0gQk9YUExPVCkge1xuICAgICAgbG9nLndhcm4oYENvbnRpbnVvdXMgYXhpcyBzaG91bGQgbm90IGhhdmUgY3VzdG9taXplZCBhZ2dyZWdhdGlvbiBmdW5jdGlvbiAke2FnZ3JlZ2F0ZX1gKTtcbiAgICB9XG4gICAgY29udGludW91c0F4aXNDaGFubmVsRGVmID0gY29udGludW91c0F4aXNXaXRob3V0QWdncmVnYXRlO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYsXG4gICAgY29udGludW91c0F4aXNcbiAgfTtcbn1cblxuZnVuY3Rpb24gYm94UGFyYW1zKHNwZWM6IEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZzxzdHJpbmc+LCBCT1hQTE9UIHwgQm94UGxvdERlZj4sIG9yaWVudDogT3JpZW50LCBrSVFSU2NhbGFyOiAnbWluLW1heCcgfCBudW1iZXIpIHtcblxuICBjb25zdCB7Y29udGludW91c0F4aXNDaGFubmVsRGVmLCBjb250aW51b3VzQXhpc30gPSBib3hDb250aW5vdXNBeGlzKHNwZWMsIG9yaWVudCk7XG4gIGNvbnN0IGVuY29kaW5nID0gc3BlYy5lbmNvZGluZztcblxuICBjb25zdCBpc01pbk1heCA9IGtJUVJTY2FsYXIgPT09IHVuZGVmaW5lZDtcbiAgY29uc3QgYWdncmVnYXRlOiBBZ2dyZWdhdGVkRmllbGREZWZbXSA9IFtcbiAgICB7XG4gICAgICBvcDogJ3ExJyxcbiAgICAgIGZpZWxkOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICBhczogJ2xvd2VyX2JveF8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkXG4gICAgfSxcbiAgICB7XG4gICAgICBvcDogJ3EzJyxcbiAgICAgIGZpZWxkOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICBhczogJ3VwcGVyX2JveF8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkXG4gICAgfSxcbiAgICB7XG4gICAgICBvcDogJ21lZGlhbicsXG4gICAgICBmaWVsZDogY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgICAgYXM6ICdtaWRfYm94XycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGRcbiAgICB9XG4gIF07XG4gIGxldCBwb3N0QWdncmVnYXRlQ2FsY3VsYXRlczogQ2FsY3VsYXRlVHJhbnNmb3JtW10gPSBbXTtcblxuICBhZ2dyZWdhdGUucHVzaCh7XG4gICAgb3A6ICdtaW4nLFxuICAgIGZpZWxkOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgYXM6IChpc01pbk1heCA/ICdsb3dlcl93aGlza2VyXycgOiAnbWluXycpICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkXG4gIH0pO1xuICBhZ2dyZWdhdGUucHVzaCh7XG4gICAgb3A6ICdtYXgnLFxuICAgIGZpZWxkOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgYXM6ICAoaXNNaW5NYXggPyAndXBwZXJfd2hpc2tlcl8nIDogJ21heF8nKSArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZFxuICB9KTtcblxuICBpZiAoIWlzTWluTWF4KSB7XG4gICAgcG9zdEFnZ3JlZ2F0ZUNhbGN1bGF0ZXMgPSBbXG4gICAgICB7XG4gICAgICAgIGNhbGN1bGF0ZTogYGRhdHVtLnVwcGVyX2JveF8ke2NvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZH0gLSBkYXR1bS5sb3dlcl9ib3hfJHtjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGR9YCxcbiAgICAgICAgYXM6ICdpcXJfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2FsY3VsYXRlOiBgbWluKGRhdHVtLnVwcGVyX2JveF8ke2NvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZH0gKyBkYXR1bS5pcXJfJHtjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGR9ICogJHtrSVFSU2NhbGFyfSwgZGF0dW0ubWF4XyR7Y29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkfSlgLFxuICAgICAgICBhczogJ3VwcGVyX3doaXNrZXJfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2FsY3VsYXRlOiBgbWF4KGRhdHVtLmxvd2VyX2JveF8ke2NvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZH0gLSBkYXR1bS5pcXJfJHtjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGR9ICogJHtrSVFSU2NhbGFyfSwgZGF0dW0ubWluXyR7Y29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkfSlgLFxuICAgICAgICBhczogJ2xvd2VyX3doaXNrZXJfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZFxuICAgICAgfVxuICAgIF07XG4gIH1cblxuICBjb25zdCBncm91cGJ5OiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCBiaW5zOiBCaW5UcmFuc2Zvcm1bXSA9IFtdO1xuICBjb25zdCB0aW1lVW5pdHM6IFRpbWVVbml0VHJhbnNmb3JtW10gPSBbXTtcblxuICBjb25zdCBlbmNvZGluZ1dpdGhvdXRDb250aW51b3VzQXhpczogRW5jb2Rpbmc8c3RyaW5nPiA9IHt9O1xuICBmb3JFYWNoKGVuY29kaW5nLCAoY2hhbm5lbERlZiwgY2hhbm5lbCkgPT4ge1xuICAgIGlmIChjaGFubmVsID09PSBjb250aW51b3VzQXhpcykge1xuICAgICAgLy8gU2tpcCBjb250aW51b3VzIGF4aXMgYXMgd2UgYWxyZWFkeSBoYW5kbGUgaXQgc2VwYXJhdGVseVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaXNGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgICAgaWYgKGNoYW5uZWxEZWYuYWdncmVnYXRlICYmIGNoYW5uZWxEZWYuYWdncmVnYXRlICE9PSBCT1hQTE9UKSB7XG4gICAgICAgIGFnZ3JlZ2F0ZS5wdXNoKHtcbiAgICAgICAgICBvcDogY2hhbm5lbERlZi5hZ2dyZWdhdGUsXG4gICAgICAgICAgZmllbGQ6IGNoYW5uZWxEZWYuZmllbGQsXG4gICAgICAgICAgYXM6IHZnRmllbGQoY2hhbm5lbERlZilcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKGNoYW5uZWxEZWYuYWdncmVnYXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtZWRGaWVsZCA9IHZnRmllbGQoY2hhbm5lbERlZik7XG5cbiAgICAgICAgLy8gQWRkIGJpbiBvciB0aW1lVW5pdCB0cmFuc2Zvcm0gaWYgYXBwbGljYWJsZVxuICAgICAgICBjb25zdCBiaW4gPSBjaGFubmVsRGVmLmJpbjtcbiAgICAgICAgaWYgKGJpbikge1xuICAgICAgICAgIGNvbnN0IHtmaWVsZH0gPSBjaGFubmVsRGVmO1xuICAgICAgICAgIGJpbnMucHVzaCh7YmluLCBmaWVsZCwgYXM6IHRyYW5zZm9ybWVkRmllbGR9KTtcbiAgICAgICAgfSBlbHNlIGlmIChjaGFubmVsRGVmLnRpbWVVbml0KSB7XG4gICAgICAgICAgY29uc3Qge3RpbWVVbml0LCBmaWVsZH0gPSBjaGFubmVsRGVmO1xuICAgICAgICAgIHRpbWVVbml0cy5wdXNoKHt0aW1lVW5pdCwgZmllbGQsIGFzOiB0cmFuc2Zvcm1lZEZpZWxkfSk7XG4gICAgICAgIH1cblxuICAgICAgICBncm91cGJ5LnB1c2godHJhbnNmb3JtZWRGaWVsZCk7XG4gICAgICB9XG4gICAgICAvLyBub3cgdGhlIGZpZWxkIHNob3VsZCByZWZlciB0byBwb3N0LXRyYW5zZm9ybWVkIGZpZWxkIGluc3RlYWRcbiAgICAgIGVuY29kaW5nV2l0aG91dENvbnRpbnVvdXNBeGlzW2NoYW5uZWxdID0ge1xuICAgICAgICBmaWVsZDogdmdGaWVsZChjaGFubmVsRGVmKSxcbiAgICAgICAgdHlwZTogY2hhbm5lbERlZi50eXBlXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBGb3IgdmFsdWUgZGVmLCBqdXN0IGNvcHlcbiAgICAgIGVuY29kaW5nV2l0aG91dENvbnRpbnVvdXNBeGlzW2NoYW5uZWxdID0gZW5jb2RpbmdbY2hhbm5lbF07XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIHRyYW5zZm9ybTogW10uY29uY2F0KFxuICAgICAgYmlucyxcbiAgICAgIHRpbWVVbml0cyxcbiAgICAgIFt7YWdncmVnYXRlLCBncm91cGJ5fV0sXG4gICAgICBwb3N0QWdncmVnYXRlQ2FsY3VsYXRlc1xuICAgICksXG4gICAgY29udGludW91c0F4aXNDaGFubmVsRGVmLFxuICAgIGNvbnRpbnVvdXNBeGlzLFxuICAgIGVuY29kaW5nV2l0aG91dENvbnRpbnVvdXNBeGlzXG4gIH07XG59XG4iXX0=