"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var encoding_1 = require("../encoding");
var encoding_2 = require("./../encoding");
var fielddef_1 = require("./../fielddef");
var log = tslib_1.__importStar(require("./../log"));
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
    var _a, _b, _c, _d;
    spec = filterUnsupportedChannels(spec);
    // TODO: use selection
    var mark = spec.mark, encoding = spec.encoding, selection = spec.selection, _p = spec.projection, outerSpec = tslib_1.__rest(spec, ["mark", "encoding", "selection", "projection"]);
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
    var _e = boxParams(spec, orient, kIQRScalar), transform = _e.transform, continuousAxisChannelDef = _e.continuousAxisChannelDef, continuousAxis = _e.continuousAxis, encodingWithoutContinuousAxis = _e.encodingWithoutContinuousAxis;
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
                encoding: tslib_1.__assign((_a = {}, _a[continuousAxis] = tslib_1.__assign({ field: 'lower_whisker_' + continuousAxisChannelDef.field, type: continuousAxisChannelDef.type }, continuousAxisScaleAndAxis), _a[continuousAxis + '2'] = {
                    field: 'lower_box_' + continuousAxisChannelDef.field,
                    type: continuousAxisChannelDef.type
                }, _a), encodingWithoutSizeColorAndContinuousAxis, common_1.getMarkSpecificConfigMixins(config.boxWhisker, 'color'))
            }, {
                mark: {
                    type: 'rule',
                    style: 'boxWhisker'
                },
                encoding: tslib_1.__assign((_b = {}, _b[continuousAxis] = {
                    field: 'upper_box_' + continuousAxisChannelDef.field,
                    type: continuousAxisChannelDef.type
                }, _b[continuousAxis + '2'] = {
                    field: 'upper_whisker_' + continuousAxisChannelDef.field,
                    type: continuousAxisChannelDef.type
                }, _b), encodingWithoutSizeColorAndContinuousAxis, common_1.getMarkSpecificConfigMixins(config.boxWhisker, 'color'))
            },
            tslib_1.__assign({}, (selection ? { selection: selection } : {}), { mark: {
                    type: 'bar',
                    style: 'box'
                }, encoding: tslib_1.__assign((_c = {}, _c[continuousAxis] = {
                    field: 'lower_box_' + continuousAxisChannelDef.field,
                    type: continuousAxisChannelDef.type
                }, _c[continuousAxis + '2'] = {
                    field: 'upper_box_' + continuousAxisChannelDef.field,
                    type: continuousAxisChannelDef.type
                }, _c), encodingWithoutContinuousAxis, (encodingWithoutContinuousAxis.color ? {} : common_1.getMarkSpecificConfigMixins(config.box, 'color')), sizeMixins) }),
            {
                mark: {
                    type: 'tick',
                    style: 'boxMid'
                },
                encoding: tslib_1.__assign((_d = {}, _d[continuousAxis] = {
                    field: 'mid_box_' + continuousAxisChannelDef.field,
                    type: continuousAxisChannelDef.type
                }, _d), encodingWithoutSizeColorAndContinuousAxis, common_1.getMarkSpecificConfigMixins(config.boxMid, 'color'), sizeMixins)
            }
        ] });
}
exports.normalizeBoxPlot = normalizeBoxPlot;
function boxOrient(spec) {
    var mark = spec.mark, encoding = spec.encoding, _p = spec.projection, _outerSpec = tslib_1.__rest(spec, ["mark", "encoding", "projection"]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm94cGxvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb3NpdGVtYXJrL2JveHBsb3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsdUNBQW1DO0FBR25DLHdDQUFtQztBQUVuQywwQ0FBZ0Q7QUFDaEQsMENBQW1HO0FBQ25HLG9EQUFnQztBQUloQyxtQ0FBcUQ7QUFHeEMsUUFBQSxPQUFPLEdBQWUsVUFBVSxDQUFDO0FBMEI5QyxzQkFBNkIsSUFBMEI7SUFDckQsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFGRCxvQ0FFQztBQUVZLFFBQUEsY0FBYyxHQUFtQixDQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7QUE4QmpFLFFBQUEscUNBQXFDLEdBRTlDO0lBQ0YsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUM7SUFDaEMsVUFBVSxFQUFFLENBQUMsT0FBTyxDQUFDO0lBQ3JCLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQztDQUNsQixDQUFDO0FBRUYsSUFBTSxpQkFBaUIsR0FBYyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDdEYsbUNBQTBDLElBQTZEO0lBQ3JHLDRCQUNLLElBQUksSUFDUCxRQUFRLEVBQUUsaUJBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxPQUFPO1lBQzdELElBQUksaUJBQWlCLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO2dCQUMzQyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsUUFBUSxDQUFDO2FBQ2pDO2lCQUFNO2dCQUNMLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxt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QUFVLENBQUMsR0FBRyxDQUFDO2dCQUMzQixJQUFJLEdBQUcsRUFBRTtvQkFDQSxJQUFBLHdCQUFLLENBQWU7b0JBQzNCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBQyxHQUFHLEtBQUEsRUFBRSxLQUFLLE9BQUEsRUFBRSxFQUFFLEVBQUUsZ0JBQWdCLEVBQUMsQ0FBQyxDQUFDO2lCQUMvQztxQkFBTSxJQUFJLFVBQVUsQ0FBQyxRQUFRLEVBQUU7b0JBQ3ZCLElBQUEsOEJBQVEsRUFBRSx3QkFBSyxDQUFlO29CQUNyQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUMsUUFBUSxVQUFBLEVBQUUsS0FBSyxPQUFBLEVBQUUsRUFBRSxFQUFFLGdCQUFnQixFQUFDLENBQUMsQ0FBQztpQkFDekQ7Z0JBRUQsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2FBQ2hDO1lBQ0QsK0RBQStEO1lBQy9ELDZCQUE2QixDQUFDLE9BQU8sQ0FBQyxHQUFHO2dCQUN2QyxLQUFLLEVBQUUsa0JBQU8sQ0FBQyxVQUFVLENBQUM7Z0JBQzFCLElBQUksRUFBRSxVQUFVLENBQUMsSUFBSTthQUN0QixDQUFDO1NBQ0g7YUFBTTtZQUNMLDJCQUEyQjtZQUMzQiw2QkFBNkIsQ0FBQyxPQUFPLENBQUMsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDNUQ7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU87UUFDTCxTQUFTLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FDbEIsSUFBSSxFQUNKLFNBQVMsRUFDVCxDQUFDLEVBQUMsU0FBUyxXQUFBLEVBQUUsT0FBTyxTQUFBLEVBQUMsQ0FBQyxFQUN0Qix1QkFBdUIsQ0FDeEI7UUFDRCx3QkFBd0IsMEJBQUE7UUFDeEIsY0FBYyxnQkFBQTtRQUNkLDZCQUE2QiwrQkFBQTtLQUM5QixDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNOdW1iZXJ9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge0NoYW5uZWx9IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQge3JlZHVjZX0gZnJvbSAnLi4vZW5jb2RpbmcnO1xuaW1wb3J0IHtBZ2dyZWdhdGVkRmllbGREZWYsIEJpblRyYW5zZm9ybSwgQ2FsY3VsYXRlVHJhbnNmb3JtLCBUaW1lVW5pdFRyYW5zZm9ybX0gZnJvbSAnLi4vdHJhbnNmb3JtJztcbmltcG9ydCB7RW5jb2RpbmcsIGZvckVhY2h9IGZyb20gJy4vLi4vZW5jb2RpbmcnO1xuaW1wb3J0IHtGaWVsZCwgRmllbGREZWYsIGlzQ29udGludW91cywgaXNGaWVsZERlZiwgUG9zaXRpb25GaWVsZERlZiwgdmdGaWVsZH0gZnJvbSAnLi8uLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi8uLi9sb2cnO1xuaW1wb3J0IHtNYXJrQ29uZmlnfSBmcm9tICcuLy4uL21hcmsnO1xuaW1wb3J0IHtHZW5lcmljVW5pdFNwZWMsIE5vcm1hbGl6ZWRMYXllclNwZWN9IGZyb20gJy4vLi4vc3BlYyc7XG5pbXBvcnQge09yaWVudH0gZnJvbSAnLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2dldE1hcmtTcGVjaWZpY0NvbmZpZ01peGluc30gZnJvbSAnLi9jb21tb24nO1xuXG5cbmV4cG9ydCBjb25zdCBCT1hQTE9UOiAnYm94LXBsb3QnID0gJ2JveC1wbG90JztcbmV4cG9ydCB0eXBlIEJPWFBMT1QgPSB0eXBlb2YgQk9YUExPVDtcbmV4cG9ydCB0eXBlIEJveFBsb3RTdHlsZSA9ICdib3hXaGlza2VyJyB8ICdib3gnIHwgJ2JveE1pZCc7XG5cblxuZXhwb3J0IGludGVyZmFjZSBCb3hQbG90RGVmIHtcbiAgLyoqXG4gICAqIFR5cGUgb2YgdGhlIG1hcmsuICBGb3IgYm94IHBsb3RzLCB0aGlzIHNob3VsZCBhbHdheXMgYmUgYFwiYm94LXBsb3RcImAuXG4gICAqIFtib3hwbG90XShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL2NvbXBvc2l0ZW1hcmsuaHRtbCNib3hwbG90KVxuICAgKi9cbiAgdHlwZTogQk9YUExPVDtcblxuICAvKipcbiAgICogT3JpZW50YXRpb24gb2YgdGhlIGJveCBwbG90LiAgVGhpcyBpcyBub3JtYWxseSBhdXRvbWF0aWNhbGx5IGRldGVybWluZWQsIGJ1dCBjYW4gYmUgc3BlY2lmaWVkIHdoZW4gdGhlIG9yaWVudGF0aW9uIGlzIGFtYmlndW91cyBhbmQgY2Fubm90IGJlIGF1dG9tYXRpY2FsbHkgZGV0ZXJtaW5lZC5cbiAgICovXG4gIG9yaWVudD86IE9yaWVudDtcblxuICAvKipcbiAgICogRXh0ZW50IGlzIHVzZWQgdG8gZGV0ZXJtaW5lIHdoZXJlIHRoZSB3aGlza2VycyBleHRlbmQgdG8uIFRoZSBvcHRpb25zIGFyZVxuICAgKiAtIGBcIm1pbi1tYXhcIjogbWluIGFuZCBtYXggYXJlIHRoZSBsb3dlciBhbmQgdXBwZXIgd2hpc2tlcnMgcmVzcGVjdGl2ZWx5LlxuICAgKiAtICBBIHNjYWxhciAoaW50ZWdlciBvciBmbG9hdGluZyBwb2ludCBudW1iZXIpIHRoYXQgd2lsbCBiZSBtdWx0aXBsaWVkIGJ5IHRoZSBJUVIgYW5kIHRoZSBwcm9kdWN0IHdpbGwgYmUgYWRkZWQgdG8gdGhlIHRoaXJkIHF1YXJ0aWxlIHRvIGdldCB0aGUgdXBwZXIgd2hpc2tlciBhbmQgc3VidHJhY3RlZCBmcm9tIHRoZSBmaXJzdCBxdWFydGlsZSB0byBnZXQgdGhlIGxvd2VyIHdoaXNrZXIuXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBgXCIxLjVcImAuXG4gICAqL1xuICBleHRlbnQ/OiAnbWluLW1heCcgfCBudW1iZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0JveFBsb3REZWYobWFyazogQk9YUExPVCB8IEJveFBsb3REZWYpOiBtYXJrIGlzIEJveFBsb3REZWYge1xuICByZXR1cm4gISFtYXJrWyd0eXBlJ107XG59XG5cbmV4cG9ydCBjb25zdCBCT1hQTE9UX1NUWUxFUzogQm94UGxvdFN0eWxlW10gPSBbJ2JveFdoaXNrZXInLCAnYm94JywgJ2JveE1pZCddO1xuXG5leHBvcnQgaW50ZXJmYWNlIEJveFBsb3RDb25maWcgZXh0ZW5kcyBNYXJrQ29uZmlnIHtcbiAgLyoqIFNpemUgb2YgdGhlIGJveCBhbmQgbWlkIHRpY2sgb2YgYSBib3ggcGxvdCAqL1xuICBzaXplPzogbnVtYmVyO1xuICAvKiogVGhlIGRlZmF1bHQgZXh0ZW50LCB3aGljaCBpcyB1c2VkIHRvIGRldGVybWluZSB3aGVyZSB0aGUgd2hpc2tlcnMgZXh0ZW5kIHRvLiBUaGUgb3B0aW9ucyBhcmVcbiAgICogLSBgXCJtaW4tbWF4XCI6IG1pbiBhbmQgbWF4IGFyZSB0aGUgbG93ZXIgYW5kIHVwcGVyIHdoaXNrZXJzIHJlc3BlY3RpdmVseS5cbiAgICogLSBgXCJudW1iZXJcIjogQSBzY2FsYXIgKGludGVnZXIgb3IgZmxvYXRpbmcgcG9pbnQgbnVtYmVyKSB0aGF0IHdpbGwgYmUgbXVsdGlwbGllZCBieSB0aGUgSVFSIGFuZCB0aGUgcHJvZHVjdCB3aWxsIGJlIGFkZGVkIHRvIHRoZSB0aGlyZCBxdWFydGlsZSB0byBnZXQgdGhlIHVwcGVyIHdoaXNrZXIgYW5kIHN1YnRyYWN0ZWQgZnJvbSB0aGUgZmlyc3QgcXVhcnRpbGUgdG8gZ2V0IHRoZSBsb3dlciB3aGlza2VyLlxuICAgKi9cbiAgZXh0ZW50PzogJ21pbi1tYXgnIHwgbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJveFBsb3RDb25maWdNaXhpbnMge1xuICAvKipcbiAgICogQm94IENvbmZpZ1xuICAgKiBAaGlkZVxuICAgKi9cbiAgYm94PzogQm94UGxvdENvbmZpZztcblxuICAvKipcbiAgICogQGhpZGVcbiAgICovXG4gIGJveFdoaXNrZXI/OiBNYXJrQ29uZmlnO1xuXG4gIC8qKlxuICAgKiBAaGlkZVxuICAgKi9cbiAgYm94TWlkPzogTWFya0NvbmZpZztcbn1cblxuZXhwb3J0IGNvbnN0IFZMX09OTFlfQk9YUExPVF9DT05GSUdfUFJPUEVSVFlfSU5ERVg6IHtcbiAgW2sgaW4ga2V5b2YgQm94UGxvdENvbmZpZ01peGluc10/OiAoa2V5b2YgQm94UGxvdENvbmZpZ01peGluc1trXSlbXVxufSA9IHtcbiAgYm94OiBbJ3NpemUnLCAnY29sb3InLCAnZXh0ZW50J10sXG4gIGJveFdoaXNrZXI6IFsnY29sb3InXSxcbiAgYm94TWlkOiBbJ2NvbG9yJ11cbn07XG5cbmNvbnN0IHN1cHBvcnRlZENoYW5uZWxzOiBDaGFubmVsW10gPSBbJ3gnLCAneScsICdjb2xvcicsICdkZXRhaWwnLCAnb3BhY2l0eScsICdzaXplJ107XG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyVW5zdXBwb3J0ZWRDaGFubmVscyhzcGVjOiBHZW5lcmljVW5pdFNwZWM8RW5jb2Rpbmc8c3RyaW5nPiwgQk9YUExPVCB8IEJveFBsb3REZWY+KTogR2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPHN0cmluZz4sIEJPWFBMT1QgfCBCb3hQbG90RGVmPiB7XG4gIHJldHVybiB7XG4gICAgLi4uc3BlYyxcbiAgICBlbmNvZGluZzogcmVkdWNlKHNwZWMuZW5jb2RpbmcsIChuZXdFbmNvZGluZywgZmllbGREZWYsIGNoYW5uZWwpID0+IHtcbiAgICAgIGlmIChzdXBwb3J0ZWRDaGFubmVscy5pbmRleE9mKGNoYW5uZWwpID4gLTEpIHtcbiAgICAgICAgbmV3RW5jb2RpbmdbY2hhbm5lbF0gPSBmaWVsZERlZjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmluY29tcGF0aWJsZUNoYW5uZWwoY2hhbm5lbCwgQk9YUExPVCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ld0VuY29kaW5nO1xuICAgIH0sIHt9KSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUJveFBsb3Qoc3BlYzogR2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPHN0cmluZz4sIEJPWFBMT1QgfCBCb3hQbG90RGVmPiwgY29uZmlnOiBDb25maWcpOiBOb3JtYWxpemVkTGF5ZXJTcGVjIHtcbiAgc3BlYyA9IGZpbHRlclVuc3VwcG9ydGVkQ2hhbm5lbHMoc3BlYyk7XG4gIC8vIFRPRE86IHVzZSBzZWxlY3Rpb25cbiAgY29uc3Qge21hcmssIGVuY29kaW5nLCBzZWxlY3Rpb24sIHByb2plY3Rpb246IF9wLCAuLi5vdXRlclNwZWN9ID0gc3BlYztcblxuICBsZXQga0lRUlNjYWxhcjogbnVtYmVyID0gdW5kZWZpbmVkO1xuICBpZiAoaXNOdW1iZXIoY29uZmlnLmJveC5leHRlbnQpKSB7XG4gICAga0lRUlNjYWxhciA9IGNvbmZpZy5ib3guZXh0ZW50O1xuICB9XG5cbiAgaWYgKGlzQm94UGxvdERlZihtYXJrKSkge1xuICAgIGlmIChtYXJrLmV4dGVudCkge1xuICAgICAgaWYobWFyay5leHRlbnQgPT09ICdtaW4tbWF4Jykge1xuICAgICAgICBrSVFSU2NhbGFyID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG9yaWVudDogT3JpZW50ID0gYm94T3JpZW50KHNwZWMpO1xuICBjb25zdCB7dHJhbnNmb3JtLCBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYsIGNvbnRpbnVvdXNBeGlzLCBlbmNvZGluZ1dpdGhvdXRDb250aW51b3VzQXhpc30gPSBib3hQYXJhbXMoc3BlYywgb3JpZW50LCBrSVFSU2NhbGFyKTtcblxuICBjb25zdCB7Y29sb3IsIHNpemUsIC4uLmVuY29kaW5nV2l0aG91dFNpemVDb2xvckFuZENvbnRpbnVvdXNBeGlzfSA9IGVuY29kaW5nV2l0aG91dENvbnRpbnVvdXNBeGlzO1xuXG4gIC8vIFNpemUgZW5jb2Rpbmcgb3IgdGhlIGRlZmF1bHQgY29uZmlnLmJveC5zaXplIGlzIGFwcGxpZWQgdG8gYm94IGFuZCBib3hNaWRcbiAgY29uc3Qgc2l6ZU1peGlucyA9IHNpemUgPyB7c2l6ZX0gOiBnZXRNYXJrU3BlY2lmaWNDb25maWdNaXhpbnMoY29uZmlnLmJveCwgJ3NpemUnKTtcblxuICBjb25zdCBjb250aW51b3VzQXhpc1NjYWxlQW5kQXhpcyA9IHt9O1xuICBpZiAoY29udGludW91c0F4aXNDaGFubmVsRGVmLnNjYWxlKSB7XG4gICAgY29udGludW91c0F4aXNTY2FsZUFuZEF4aXNbJ3NjYWxlJ10gPSBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuc2NhbGU7XG4gIH1cbiAgaWYgKGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5heGlzKSB7XG4gICAgY29udGludW91c0F4aXNTY2FsZUFuZEF4aXNbJ2F4aXMnXSA9IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5heGlzO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5vdXRlclNwZWMsXG4gICAgdHJhbnNmb3JtLFxuICAgIGxheWVyOiBbXG4gICAgICB7IC8vIGxvd2VyIHdoaXNrZXJcbiAgICAgICAgbWFyazoge1xuICAgICAgICAgIHR5cGU6ICdydWxlJyxcbiAgICAgICAgICBzdHlsZTogJ2JveFdoaXNrZXInXG4gICAgICAgIH0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgW2NvbnRpbnVvdXNBeGlzXToge1xuICAgICAgICAgICAgZmllbGQ6ICdsb3dlcl93aGlza2VyXycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICAgICAgICB0eXBlOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYudHlwZSxcbiAgICAgICAgICAgIC4uLmNvbnRpbnVvdXNBeGlzU2NhbGVBbmRBeGlzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBbY29udGludW91c0F4aXMgKyAnMiddOiB7XG4gICAgICAgICAgICBmaWVsZDogJ2xvd2VyX2JveF8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgICAgICAgICAgdHlwZTogY29udGludW91c0F4aXNDaGFubmVsRGVmLnR5cGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIC4uLmVuY29kaW5nV2l0aG91dFNpemVDb2xvckFuZENvbnRpbnVvdXNBeGlzLFxuICAgICAgICAgIC4uLmdldE1hcmtTcGVjaWZpY0NvbmZpZ01peGlucyhjb25maWcuYm94V2hpc2tlciwgJ2NvbG9yJylcbiAgICAgICAgfVxuICAgICAgfSwgeyAvLyB1cHBlciB3aGlza2VyXG4gICAgICAgIG1hcms6IHtcbiAgICAgICAgICB0eXBlOiAncnVsZScsXG4gICAgICAgICAgc3R5bGU6ICdib3hXaGlza2VyJ1xuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFtjb250aW51b3VzQXhpc106IHtcbiAgICAgICAgICAgIGZpZWxkOiAndXBwZXJfYm94XycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICAgICAgICB0eXBlOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYudHlwZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgW2NvbnRpbnVvdXNBeGlzICsgJzInXToge1xuICAgICAgICAgICAgZmllbGQ6ICd1cHBlcl93aGlza2VyXycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICAgICAgICB0eXBlOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYudHlwZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgLi4uZW5jb2RpbmdXaXRob3V0U2l6ZUNvbG9yQW5kQ29udGludW91c0F4aXMsXG4gICAgICAgICAgLi4uZ2V0TWFya1NwZWNpZmljQ29uZmlnTWl4aW5zKGNvbmZpZy5ib3hXaGlza2VyLCAnY29sb3InKVxuICAgICAgICB9XG4gICAgICB9LCB7IC8vIGJveCAocTEgdG8gcTMpXG4gICAgICAgIC4uLihzZWxlY3Rpb24gPyB7c2VsZWN0aW9ufSA6IHt9KSxcbiAgICAgICAgbWFyazoge1xuICAgICAgICAgIHR5cGU6ICdiYXInLFxuICAgICAgICAgIHN0eWxlOiAnYm94J1xuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFtjb250aW51b3VzQXhpc106IHtcbiAgICAgICAgICAgIGZpZWxkOiAnbG93ZXJfYm94XycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICAgICAgICB0eXBlOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYudHlwZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgW2NvbnRpbnVvdXNBeGlzICsgJzInXToge1xuICAgICAgICAgICAgZmllbGQ6ICd1cHBlcl9ib3hfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZCxcbiAgICAgICAgICAgIHR5cGU6IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi50eXBlXG4gICAgICAgICAgfSxcbiAgICAgICAgICAuLi5lbmNvZGluZ1dpdGhvdXRDb250aW51b3VzQXhpcyxcbiAgICAgICAgICAuLi4oZW5jb2RpbmdXaXRob3V0Q29udGludW91c0F4aXMuY29sb3IgPyB7fSA6IGdldE1hcmtTcGVjaWZpY0NvbmZpZ01peGlucyhjb25maWcuYm94LCAnY29sb3InKSksXG4gICAgICAgICAgLi4uc2l6ZU1peGlucyxcbiAgICAgICAgfVxuICAgICAgfSwgeyAvLyBtaWQgdGlja1xuICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgdHlwZTogJ3RpY2snLFxuICAgICAgICAgIHN0eWxlOiAnYm94TWlkJ1xuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFtjb250aW51b3VzQXhpc106IHtcbiAgICAgICAgICAgIGZpZWxkOiAnbWlkX2JveF8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgICAgICAgICAgdHlwZTogY29udGludW91c0F4aXNDaGFubmVsRGVmLnR5cGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIC4uLmVuY29kaW5nV2l0aG91dFNpemVDb2xvckFuZENvbnRpbnVvdXNBeGlzLFxuICAgICAgICAgIC4uLmdldE1hcmtTcGVjaWZpY0NvbmZpZ01peGlucyhjb25maWcuYm94TWlkLCAnY29sb3InKSxcbiAgICAgICAgICAuLi5zaXplTWl4aW5zLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgXVxuICB9O1xufVxuXG5mdW5jdGlvbiBib3hPcmllbnQoc3BlYzogR2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPEZpZWxkPiwgQk9YUExPVCB8IEJveFBsb3REZWY+KTogT3JpZW50IHtcbiAgY29uc3Qge21hcms6IG1hcmssIGVuY29kaW5nOiBlbmNvZGluZywgcHJvamVjdGlvbjogX3AsIC4uLl9vdXRlclNwZWN9ID0gc3BlYztcblxuICBpZiAoaXNGaWVsZERlZihlbmNvZGluZy54KSAmJiBpc0NvbnRpbnVvdXMoZW5jb2RpbmcueCkpIHtcbiAgICAvLyB4IGlzIGNvbnRpbnVvdXNcbiAgICBpZiAoaXNGaWVsZERlZihlbmNvZGluZy55KSAmJiBpc0NvbnRpbnVvdXMoZW5jb2RpbmcueSkpIHtcbiAgICAgIC8vIGJvdGggeCBhbmQgeSBhcmUgY29udGludW91c1xuICAgICAgaWYgKGVuY29kaW5nLnguYWdncmVnYXRlID09PSB1bmRlZmluZWQgJiYgZW5jb2RpbmcueS5hZ2dyZWdhdGUgPT09IEJPWFBMT1QpIHtcbiAgICAgICAgcmV0dXJuICd2ZXJ0aWNhbCc7XG4gICAgICB9IGVsc2UgaWYgKGVuY29kaW5nLnkuYWdncmVnYXRlID09PSB1bmRlZmluZWQgJiYgZW5jb2RpbmcueC5hZ2dyZWdhdGUgPT09IEJPWFBMT1QpIHtcbiAgICAgICAgcmV0dXJuICdob3Jpem9udGFsJztcbiAgICAgIH0gZWxzZSBpZiAoZW5jb2RpbmcueC5hZ2dyZWdhdGUgPT09IEJPWFBMT1QgJiYgZW5jb2RpbmcueS5hZ2dyZWdhdGUgPT09IEJPWFBMT1QpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCb3RoIHggYW5kIHkgY2Fubm90IGhhdmUgYWdncmVnYXRlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaXNCb3hQbG90RGVmKG1hcmspICYmIG1hcmsub3JpZW50KSB7XG4gICAgICAgICAgcmV0dXJuIG1hcmsub3JpZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZGVmYXVsdCBvcmllbnRhdGlvbiA9IHZlcnRpY2FsXG4gICAgICAgIHJldHVybiAndmVydGljYWwnO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHggaXMgY29udGludW91cyBidXQgeSBpcyBub3RcbiAgICByZXR1cm4gJ2hvcml6b250YWwnO1xuICB9IGVsc2UgaWYgKGlzRmllbGREZWYoZW5jb2RpbmcueSkgJiYgaXNDb250aW51b3VzKGVuY29kaW5nLnkpKSB7XG4gICAgLy8geSBpcyBjb250aW51b3VzIGJ1dCB4IGlzIG5vdFxuICAgIHJldHVybiAndmVydGljYWwnO1xuICB9IGVsc2Uge1xuICAgIC8vIE5laXRoZXIgeCBub3IgeSBpcyBjb250aW51b3VzLlxuICAgIHRocm93IG5ldyBFcnJvcignTmVlZCBhIHZhbGlkIGNvbnRpbnVvdXMgYXhpcyBmb3IgYm94cGxvdHMnKTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGJveENvbnRpbm91c0F4aXMoc3BlYzogR2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPHN0cmluZz4sIEJPWFBMT1QgfCBCb3hQbG90RGVmPiwgb3JpZW50OiBPcmllbnQpIHtcbiAgY29uc3Qge21hcms6IG1hcmssIGVuY29kaW5nOiBlbmNvZGluZywgcHJvamVjdGlvbjogX3AsIC4uLl9vdXRlclNwZWN9ID0gc3BlYztcblxuICBsZXQgY29udGludW91c0F4aXNDaGFubmVsRGVmOiBQb3NpdGlvbkZpZWxkRGVmPHN0cmluZz47XG4gIGxldCBjb250aW51b3VzQXhpczogJ3gnIHwgJ3knO1xuXG4gIGlmIChvcmllbnQgPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICBjb250aW51b3VzQXhpcyA9ICd5JztcbiAgICBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYgPSBlbmNvZGluZy55IGFzIEZpZWxkRGVmPHN0cmluZz47IC8vIFNhZmUgdG8gY2FzdCBiZWNhdXNlIGlmIHkgaXMgbm90IGNvbnRpbnVvdXMgZmllbGRkZWYsIHRoZSBvcmllbnQgd291bGQgbm90IGJlIHZlcnRpY2FsLlxuICB9IGVsc2Uge1xuICAgIGNvbnRpbnVvdXNBeGlzID0gJ3gnO1xuICAgIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZiA9IGVuY29kaW5nLnggYXMgRmllbGREZWY8c3RyaW5nPjsgLy8gU2FmZSB0byBjYXN0IGJlY2F1c2UgaWYgeCBpcyBub3QgY29udGludW91cyBmaWVsZGRlZiwgdGhlIG9yaWVudCB3b3VsZCBub3QgYmUgaG9yaXpvbnRhbC5cbiAgfVxuXG4gIGlmIChjb250aW51b3VzQXhpc0NoYW5uZWxEZWYgJiYgY29udGludW91c0F4aXNDaGFubmVsRGVmLmFnZ3JlZ2F0ZSkge1xuICAgIGNvbnN0IHthZ2dyZWdhdGUsIC4uLmNvbnRpbnVvdXNBeGlzV2l0aG91dEFnZ3JlZ2F0ZX0gPSBjb250aW51b3VzQXhpc0NoYW5uZWxEZWY7XG4gICAgaWYgKGFnZ3JlZ2F0ZSAhPT0gQk9YUExPVCkge1xuICAgICAgbG9nLndhcm4oYENvbnRpbnVvdXMgYXhpcyBzaG91bGQgbm90IGhhdmUgY3VzdG9taXplZCBhZ2dyZWdhdGlvbiBmdW5jdGlvbiAke2FnZ3JlZ2F0ZX1gKTtcbiAgICB9XG4gICAgY29udGludW91c0F4aXNDaGFubmVsRGVmID0gY29udGludW91c0F4aXNXaXRob3V0QWdncmVnYXRlO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYsXG4gICAgY29udGludW91c0F4aXNcbiAgfTtcbn1cblxuZnVuY3Rpb24gYm94UGFyYW1zKHNwZWM6IEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZzxzdHJpbmc+LCBCT1hQTE9UIHwgQm94UGxvdERlZj4sIG9yaWVudDogT3JpZW50LCBrSVFSU2NhbGFyOiAnbWluLW1heCcgfCBudW1iZXIpIHtcblxuICBjb25zdCB7Y29udGludW91c0F4aXNDaGFubmVsRGVmLCBjb250aW51b3VzQXhpc30gPSBib3hDb250aW5vdXNBeGlzKHNwZWMsIG9yaWVudCk7XG4gIGNvbnN0IGVuY29kaW5nID0gc3BlYy5lbmNvZGluZztcblxuICBjb25zdCBpc01pbk1heCA9IGtJUVJTY2FsYXIgPT09IHVuZGVmaW5lZDtcbiAgY29uc3QgYWdncmVnYXRlOiBBZ2dyZWdhdGVkRmllbGREZWZbXSA9IFtcbiAgICB7XG4gICAgICBvcDogJ3ExJyxcbiAgICAgIGZpZWxkOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICBhczogJ2xvd2VyX2JveF8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkXG4gICAgfSxcbiAgICB7XG4gICAgICBvcDogJ3EzJyxcbiAgICAgIGZpZWxkOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICBhczogJ3VwcGVyX2JveF8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkXG4gICAgfSxcbiAgICB7XG4gICAgICBvcDogJ21lZGlhbicsXG4gICAgICBmaWVsZDogY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgICAgYXM6ICdtaWRfYm94XycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGRcbiAgICB9XG4gIF07XG4gIGxldCBwb3N0QWdncmVnYXRlQ2FsY3VsYXRlczogQ2FsY3VsYXRlVHJhbnNmb3JtW10gPSBbXTtcblxuICBhZ2dyZWdhdGUucHVzaCh7XG4gICAgb3A6ICdtaW4nLFxuICAgIGZpZWxkOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgYXM6IChpc01pbk1heCA/ICdsb3dlcl93aGlza2VyXycgOiAnbWluXycpICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkXG4gIH0pO1xuICBhZ2dyZWdhdGUucHVzaCh7XG4gICAgb3A6ICdtYXgnLFxuICAgIGZpZWxkOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgYXM6ICAoaXNNaW5NYXggPyAndXBwZXJfd2hpc2tlcl8nIDogJ21heF8nKSArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZFxuICB9KTtcblxuICBpZiAoIWlzTWluTWF4KSB7XG4gICAgcG9zdEFnZ3JlZ2F0ZUNhbGN1bGF0ZXMgPSBbXG4gICAgICB7XG4gICAgICAgIGNhbGN1bGF0ZTogYGRhdHVtLnVwcGVyX2JveF8ke2NvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZH0gLSBkYXR1bS5sb3dlcl9ib3hfJHtjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGR9YCxcbiAgICAgICAgYXM6ICdpcXJfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2FsY3VsYXRlOiBgbWluKGRhdHVtLnVwcGVyX2JveF8ke2NvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZH0gKyBkYXR1bS5pcXJfJHtjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGR9ICogJHtrSVFSU2NhbGFyfSwgZGF0dW0ubWF4XyR7Y29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkfSlgLFxuICAgICAgICBhczogJ3VwcGVyX3doaXNrZXJfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2FsY3VsYXRlOiBgbWF4KGRhdHVtLmxvd2VyX2JveF8ke2NvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZH0gLSBkYXR1bS5pcXJfJHtjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGR9ICogJHtrSVFSU2NhbGFyfSwgZGF0dW0ubWluXyR7Y29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkfSlgLFxuICAgICAgICBhczogJ2xvd2VyX3doaXNrZXJfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZFxuICAgICAgfVxuICAgIF07XG4gIH1cblxuICBjb25zdCBncm91cGJ5OiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCBiaW5zOiBCaW5UcmFuc2Zvcm1bXSA9IFtdO1xuICBjb25zdCB0aW1lVW5pdHM6IFRpbWVVbml0VHJhbnNmb3JtW10gPSBbXTtcblxuICBjb25zdCBlbmNvZGluZ1dpdGhvdXRDb250aW51b3VzQXhpczogRW5jb2Rpbmc8c3RyaW5nPiA9IHt9O1xuICBmb3JFYWNoKGVuY29kaW5nLCAoY2hhbm5lbERlZiwgY2hhbm5lbCkgPT4ge1xuICAgIGlmIChjaGFubmVsID09PSBjb250aW51b3VzQXhpcykge1xuICAgICAgLy8gU2tpcCBjb250aW51b3VzIGF4aXMgYXMgd2UgYWxyZWFkeSBoYW5kbGUgaXQgc2VwYXJhdGVseVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaXNGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgICAgaWYgKGNoYW5uZWxEZWYuYWdncmVnYXRlICYmIGNoYW5uZWxEZWYuYWdncmVnYXRlICE9PSBCT1hQTE9UKSB7XG4gICAgICAgIGFnZ3JlZ2F0ZS5wdXNoKHtcbiAgICAgICAgICBvcDogY2hhbm5lbERlZi5hZ2dyZWdhdGUsXG4gICAgICAgICAgZmllbGQ6IGNoYW5uZWxEZWYuZmllbGQsXG4gICAgICAgICAgYXM6IHZnRmllbGQoY2hhbm5lbERlZilcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKGNoYW5uZWxEZWYuYWdncmVnYXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtZWRGaWVsZCA9IHZnRmllbGQoY2hhbm5lbERlZik7XG5cbiAgICAgICAgLy8gQWRkIGJpbiBvciB0aW1lVW5pdCB0cmFuc2Zvcm0gaWYgYXBwbGljYWJsZVxuICAgICAgICBjb25zdCBiaW4gPSBjaGFubmVsRGVmLmJpbjtcbiAgICAgICAgaWYgKGJpbikge1xuICAgICAgICAgIGNvbnN0IHtmaWVsZH0gPSBjaGFubmVsRGVmO1xuICAgICAgICAgIGJpbnMucHVzaCh7YmluLCBmaWVsZCwgYXM6IHRyYW5zZm9ybWVkRmllbGR9KTtcbiAgICAgICAgfSBlbHNlIGlmIChjaGFubmVsRGVmLnRpbWVVbml0KSB7XG4gICAgICAgICAgY29uc3Qge3RpbWVVbml0LCBmaWVsZH0gPSBjaGFubmVsRGVmO1xuICAgICAgICAgIHRpbWVVbml0cy5wdXNoKHt0aW1lVW5pdCwgZmllbGQsIGFzOiB0cmFuc2Zvcm1lZEZpZWxkfSk7XG4gICAgICAgIH1cblxuICAgICAgICBncm91cGJ5LnB1c2godHJhbnNmb3JtZWRGaWVsZCk7XG4gICAgICB9XG4gICAgICAvLyBub3cgdGhlIGZpZWxkIHNob3VsZCByZWZlciB0byBwb3N0LXRyYW5zZm9ybWVkIGZpZWxkIGluc3RlYWRcbiAgICAgIGVuY29kaW5nV2l0aG91dENvbnRpbnVvdXNBeGlzW2NoYW5uZWxdID0ge1xuICAgICAgICBmaWVsZDogdmdGaWVsZChjaGFubmVsRGVmKSxcbiAgICAgICAgdHlwZTogY2hhbm5lbERlZi50eXBlXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBGb3IgdmFsdWUgZGVmLCBqdXN0IGNvcHlcbiAgICAgIGVuY29kaW5nV2l0aG91dENvbnRpbnVvdXNBeGlzW2NoYW5uZWxdID0gZW5jb2RpbmdbY2hhbm5lbF07XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIHRyYW5zZm9ybTogW10uY29uY2F0KFxuICAgICAgYmlucyxcbiAgICAgIHRpbWVVbml0cyxcbiAgICAgIFt7YWdncmVnYXRlLCBncm91cGJ5fV0sXG4gICAgICBwb3N0QWdncmVnYXRlQ2FsY3VsYXRlc1xuICAgICksXG4gICAgY29udGludW91c0F4aXNDaGFubmVsRGVmLFxuICAgIGNvbnRpbnVvdXNBeGlzLFxuICAgIGVuY29kaW5nV2l0aG91dENvbnRpbnVvdXNBeGlzXG4gIH07XG59XG4iXX0=