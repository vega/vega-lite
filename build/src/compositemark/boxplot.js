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
                encoding: tslib_1.__assign((_b = {}, _b[continuousAxis] = tslib_1.__assign({ field: 'lower_whisker_' + continuousAxisChannelDef.field, type: continuousAxisChannelDef.type }, continuousAxisScaleAndAxis), _b[continuousAxis + '2'] = {
                    field: 'lower_box_' + continuousAxisChannelDef.field,
                    type: continuousAxisChannelDef.type
                }, _b), encodingWithoutSizeColorAndContinuousAxis, common_1.getMarkSpecificConfigMixins(config.boxWhisker, 'color'))
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
                }, _c), encodingWithoutSizeColorAndContinuousAxis, common_1.getMarkSpecificConfigMixins(config.boxWhisker, 'color'))
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
                }, _d), encodingWithoutContinuousAxis, (encodingWithoutContinuousAxis.color ? {} : common_1.getMarkSpecificConfigMixins(config.box, 'color')), sizeMixins) }),
            {
                mark: {
                    type: 'tick',
                    style: 'boxMid'
                },
                encoding: tslib_1.__assign((_e = {}, _e[continuousAxis] = {
                    field: 'mid_box_' + continuousAxisChannelDef.field,
                    type: continuousAxisChannelDef.type
                }, _e), encodingWithoutSizeColorAndContinuousAxis, common_1.getMarkSpecificConfigMixins(config.boxMid, 'color'), sizeMixins)
            }
        ] });
    var _b, _c, _d, _e;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm94cGxvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb3NpdGVtYXJrL2JveHBsb3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsdUNBQW1DO0FBR25DLHdDQUFtQztBQUVuQywwQ0FBZ0Q7QUFDaEQsMENBQW1HO0FBQ25HLDhCQUFnQztBQUloQyxtQ0FBcUQ7QUFHeEMsUUFBQSxPQUFPLEdBQWUsVUFBVSxDQUFDO0FBMEI5QyxzQkFBNkIsSUFBMEI7SUFDckQsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFGRCxvQ0FFQztBQUVZLFFBQUEsY0FBYyxHQUFtQixDQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7QUE4QmpFLFFBQUEscUNBQXFDLEdBRTlDO0lBQ0YsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUM7SUFDaEMsVUFBVSxFQUFFLENBQUMsT0FBTyxDQUFDO0lBQ3JCLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQztDQUNsQixDQUFDO0FBRUYsSUFBTSxpQkFBaUIsR0FBYyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDdEYsbUNBQTBDLElBQTZEO0lBQ3JHLDRCQUNLLElBQUksSUFDUCxRQUFRLEVBQUUsaUJBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxPQUFPO1lBQzdELElBQUksaUJBQWlCLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO2dCQUMzQyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsUUFBUSxDQUFDO2FBQ2pDO2lCQUFNO2dCQUNMLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxt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QUFVLENBQUMsR0FBRyxDQUFDO2dCQUMzQixJQUFJLEdBQUcsRUFBRTtvQkFDQSxJQUFBLHdCQUFLLENBQWU7b0JBQzNCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBQyxHQUFHLEtBQUEsRUFBRSxLQUFLLE9BQUEsRUFBRSxFQUFFLEVBQUUsZ0JBQWdCLEVBQUMsQ0FBQyxDQUFDO2lCQUMvQztxQkFBTSxJQUFJLFVBQVUsQ0FBQyxRQUFRLEVBQUU7b0JBQ3ZCLElBQUEsOEJBQVEsRUFBRSx3QkFBSyxDQUFlO29CQUNyQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUMsUUFBUSxVQUFBLEVBQUUsS0FBSyxPQUFBLEVBQUUsRUFBRSxFQUFFLGdCQUFnQixFQUFDLENBQUMsQ0FBQztpQkFDekQ7Z0JBRUQsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2FBQ2hDO1lBQ0QsK0RBQStEO1lBQy9ELDZCQUE2QixDQUFDLE9BQU8sQ0FBQyxHQUFHO2dCQUN2QyxLQUFLLEVBQUUsa0JBQU8sQ0FBQyxVQUFVLENBQUM7Z0JBQzFCLElBQUksRUFBRSxVQUFVLENBQUMsSUFBSTthQUN0QixDQUFDO1NBQ0g7YUFBTTtZQUNMLDJCQUEyQjtZQUMzQiw2QkFBNkIsQ0FBQyxPQUFPLENBQUMsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDNUQ7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU87UUFDTCxTQUFTLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FDbEIsSUFBSSxFQUNKLFNBQVMsRUFDVCxDQUFDLEVBQUMsU0FBUyxXQUFBLEVBQUUsT0FBTyxTQUFBLEVBQUMsQ0FBQyxFQUN0Qix1QkFBdUIsQ0FDeEI7UUFDRCx3QkFBd0IsMEJBQUE7UUFDeEIsY0FBYyxnQkFBQTtRQUNkLDZCQUE2QiwrQkFBQTtLQUM5QixDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNOdW1iZXJ9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge0NoYW5uZWx9IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQge3JlZHVjZX0gZnJvbSAnLi4vZW5jb2RpbmcnO1xuaW1wb3J0IHtBZ2dyZWdhdGVkRmllbGREZWYsIEJpblRyYW5zZm9ybSwgQ2FsY3VsYXRlVHJhbnNmb3JtLCBUaW1lVW5pdFRyYW5zZm9ybX0gZnJvbSAnLi4vdHJhbnNmb3JtJztcbmltcG9ydCB7RW5jb2RpbmcsIGZvckVhY2h9IGZyb20gJy4vLi4vZW5jb2RpbmcnO1xuaW1wb3J0IHtGaWVsZCwgRmllbGREZWYsIGlzQ29udGludW91cywgaXNGaWVsZERlZiwgUG9zaXRpb25GaWVsZERlZiwgdmdGaWVsZH0gZnJvbSAnLi8uLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi8uLi9sb2cnO1xuaW1wb3J0IHtNYXJrQ29uZmlnfSBmcm9tICcuLy4uL21hcmsnO1xuaW1wb3J0IHtHZW5lcmljVW5pdFNwZWMsIE5vcm1hbGl6ZWRMYXllclNwZWN9IGZyb20gJy4vLi4vc3BlYyc7XG5pbXBvcnQge09yaWVudH0gZnJvbSAnLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2dldE1hcmtTcGVjaWZpY0NvbmZpZ01peGluc30gZnJvbSAnLi9jb21tb24nO1xuXG5cbmV4cG9ydCBjb25zdCBCT1hQTE9UOiAnYm94LXBsb3QnID0gJ2JveC1wbG90JztcbmV4cG9ydCB0eXBlIEJPWFBMT1QgPSB0eXBlb2YgQk9YUExPVDtcbmV4cG9ydCB0eXBlIEJveFBsb3RTdHlsZSA9ICdib3hXaGlza2VyJyB8ICdib3gnIHwgJ2JveE1pZCc7XG5cblxuZXhwb3J0IGludGVyZmFjZSBCb3hQbG90RGVmIHtcbiAgLyoqXG4gICAqIFR5cGUgb2YgdGhlIG1hcmsuICBGb3IgYm94IHBsb3RzLCB0aGlzIHNob3VsZCBhbHdheXMgYmUgYFwiYm94LXBsb3RcImAuXG4gICAqIFtib3hwbG90XShjb21wb3NpdGVtYXJrLmh0bWwjYm94cGxvdClcbiAgICovXG4gIHR5cGU6IEJPWFBMT1Q7XG5cbiAgLyoqXG4gICAqIE9yaWVudGF0aW9uIG9mIHRoZSBib3ggcGxvdC4gIFRoaXMgaXMgbm9ybWFsbHkgYXV0b21hdGljYWxseSBkZXRlcm1pbmVkLCBidXQgY2FuIGJlIHNwZWNpZmllZCB3aGVuIHRoZSBvcmllbnRhdGlvbiBpcyBhbWJpZ3VvdXMgYW5kIGNhbm5vdCBiZSBhdXRvbWF0aWNhbGx5IGRldGVybWluZWQuXG4gICAqL1xuICBvcmllbnQ/OiBPcmllbnQ7XG5cbiAgLyoqXG4gICAqIEV4dGVudCBpcyB1c2VkIHRvIGRldGVybWluZSB3aGVyZSB0aGUgd2hpc2tlcnMgZXh0ZW5kIHRvLiBUaGUgb3B0aW9ucyBhcmVcbiAgICogLSBgXCJtaW4tbWF4XCI6IG1pbiBhbmQgbWF4IGFyZSB0aGUgbG93ZXIgYW5kIHVwcGVyIHdoaXNrZXJzIHJlc3BlY3RpdmVseS5cbiAgICogLSAgQSBzY2FsYXIgKGludGVnZXIgb3IgZmxvYXRpbmcgcG9pbnQgbnVtYmVyKSB0aGF0IHdpbGwgYmUgbXVsdGlwbGllZCBieSB0aGUgSVFSIGFuZCB0aGUgcHJvZHVjdCB3aWxsIGJlIGFkZGVkIHRvIHRoZSB0aGlyZCBxdWFydGlsZSB0byBnZXQgdGhlIHVwcGVyIHdoaXNrZXIgYW5kIHN1YnRyYWN0ZWQgZnJvbSB0aGUgZmlyc3QgcXVhcnRpbGUgdG8gZ2V0IHRoZSBsb3dlciB3aGlza2VyLlxuICAgKiBfX0RlZmF1bHQgdmFsdWU6X18gYFwiMS41XCJgLlxuICAgKi9cbiAgZXh0ZW50PzogJ21pbi1tYXgnIHwgbnVtYmVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNCb3hQbG90RGVmKG1hcms6IEJPWFBMT1QgfCBCb3hQbG90RGVmKTogbWFyayBpcyBCb3hQbG90RGVmIHtcbiAgcmV0dXJuICEhbWFya1sndHlwZSddO1xufVxuXG5leHBvcnQgY29uc3QgQk9YUExPVF9TVFlMRVM6IEJveFBsb3RTdHlsZVtdID0gWydib3hXaGlza2VyJywgJ2JveCcsICdib3hNaWQnXTtcblxuZXhwb3J0IGludGVyZmFjZSBCb3hQbG90Q29uZmlnIGV4dGVuZHMgTWFya0NvbmZpZyB7XG4gIC8qKiBTaXplIG9mIHRoZSBib3ggYW5kIG1pZCB0aWNrIG9mIGEgYm94IHBsb3QgKi9cbiAgc2l6ZT86IG51bWJlcjtcbiAgLyoqIFRoZSBkZWZhdWx0IGV4dGVudCwgd2hpY2ggaXMgdXNlZCB0byBkZXRlcm1pbmUgd2hlcmUgdGhlIHdoaXNrZXJzIGV4dGVuZCB0by4gVGhlIG9wdGlvbnMgYXJlXG4gICAqIC0gYFwibWluLW1heFwiOiBtaW4gYW5kIG1heCBhcmUgdGhlIGxvd2VyIGFuZCB1cHBlciB3aGlza2VycyByZXNwZWN0aXZlbHkuXG4gICAqIC0gYFwibnVtYmVyXCI6IEEgc2NhbGFyIChpbnRlZ2VyIG9yIGZsb2F0aW5nIHBvaW50IG51bWJlcikgdGhhdCB3aWxsIGJlIG11bHRpcGxpZWQgYnkgdGhlIElRUiBhbmQgdGhlIHByb2R1Y3Qgd2lsbCBiZSBhZGRlZCB0byB0aGUgdGhpcmQgcXVhcnRpbGUgdG8gZ2V0IHRoZSB1cHBlciB3aGlza2VyIGFuZCBzdWJ0cmFjdGVkIGZyb20gdGhlIGZpcnN0IHF1YXJ0aWxlIHRvIGdldCB0aGUgbG93ZXIgd2hpc2tlci5cbiAgICovXG4gIGV4dGVudD86ICdtaW4tbWF4JyB8IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBCb3hQbG90Q29uZmlnTWl4aW5zIHtcbiAgLyoqXG4gICAqIEJveCBDb25maWdcbiAgICogQGhpZGVcbiAgICovXG4gIGJveD86IEJveFBsb3RDb25maWc7XG5cbiAgLyoqXG4gICAqIEBoaWRlXG4gICAqL1xuICBib3hXaGlza2VyPzogTWFya0NvbmZpZztcblxuICAvKipcbiAgICogQGhpZGVcbiAgICovXG4gIGJveE1pZD86IE1hcmtDb25maWc7XG59XG5cbmV4cG9ydCBjb25zdCBWTF9PTkxZX0JPWFBMT1RfQ09ORklHX1BST1BFUlRZX0lOREVYOiB7XG4gIFtrIGluIGtleW9mIEJveFBsb3RDb25maWdNaXhpbnNdPzogKGtleW9mIEJveFBsb3RDb25maWdNaXhpbnNba10pW11cbn0gPSB7XG4gIGJveDogWydzaXplJywgJ2NvbG9yJywgJ2V4dGVudCddLFxuICBib3hXaGlza2VyOiBbJ2NvbG9yJ10sXG4gIGJveE1pZDogWydjb2xvciddXG59O1xuXG5jb25zdCBzdXBwb3J0ZWRDaGFubmVsczogQ2hhbm5lbFtdID0gWyd4JywgJ3knLCAnY29sb3InLCAnZGV0YWlsJywgJ29wYWNpdHknLCAnc2l6ZSddO1xuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlclVuc3VwcG9ydGVkQ2hhbm5lbHMoc3BlYzogR2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPHN0cmluZz4sIEJPWFBMT1QgfCBCb3hQbG90RGVmPik6IEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZzxzdHJpbmc+LCBCT1hQTE9UIHwgQm94UGxvdERlZj4ge1xuICByZXR1cm4ge1xuICAgIC4uLnNwZWMsXG4gICAgZW5jb2Rpbmc6IHJlZHVjZShzcGVjLmVuY29kaW5nLCAobmV3RW5jb2RpbmcsIGZpZWxkRGVmLCBjaGFubmVsKSA9PiB7XG4gICAgICBpZiAoc3VwcG9ydGVkQ2hhbm5lbHMuaW5kZXhPZihjaGFubmVsKSA+IC0xKSB7XG4gICAgICAgIG5ld0VuY29kaW5nW2NoYW5uZWxdID0gZmllbGREZWY7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5pbmNvbXBhdGlibGVDaGFubmVsKGNoYW5uZWwsIEJPWFBMT1QpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXdFbmNvZGluZztcbiAgICB9LCB7fSksXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVCb3hQbG90KHNwZWM6IEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZzxzdHJpbmc+LCBCT1hQTE9UIHwgQm94UGxvdERlZj4sIGNvbmZpZzogQ29uZmlnKTogTm9ybWFsaXplZExheWVyU3BlYyB7XG4gIHNwZWMgPSBmaWx0ZXJVbnN1cHBvcnRlZENoYW5uZWxzKHNwZWMpO1xuICAvLyBUT0RPOiB1c2Ugc2VsZWN0aW9uXG4gIGNvbnN0IHttYXJrLCBlbmNvZGluZywgc2VsZWN0aW9uLCBwcm9qZWN0aW9uOiBfcCwgLi4ub3V0ZXJTcGVjfSA9IHNwZWM7XG5cbiAgbGV0IGtJUVJTY2FsYXI6IG51bWJlciA9IHVuZGVmaW5lZDtcbiAgaWYgKGlzTnVtYmVyKGNvbmZpZy5ib3guZXh0ZW50KSkge1xuICAgIGtJUVJTY2FsYXIgPSBjb25maWcuYm94LmV4dGVudDtcbiAgfVxuXG4gIGlmIChpc0JveFBsb3REZWYobWFyaykpIHtcbiAgICBpZiAobWFyay5leHRlbnQpIHtcbiAgICAgIGlmKG1hcmsuZXh0ZW50ID09PSAnbWluLW1heCcpIHtcbiAgICAgICAga0lRUlNjYWxhciA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdCBvcmllbnQ6IE9yaWVudCA9IGJveE9yaWVudChzcGVjKTtcbiAgY29uc3Qge3RyYW5zZm9ybSwgY29udGludW91c0F4aXNDaGFubmVsRGVmLCBjb250aW51b3VzQXhpcywgZW5jb2RpbmdXaXRob3V0Q29udGludW91c0F4aXN9ID0gYm94UGFyYW1zKHNwZWMsIG9yaWVudCwga0lRUlNjYWxhcik7XG5cbiAgY29uc3Qge2NvbG9yLCBzaXplLCAuLi5lbmNvZGluZ1dpdGhvdXRTaXplQ29sb3JBbmRDb250aW51b3VzQXhpc30gPSBlbmNvZGluZ1dpdGhvdXRDb250aW51b3VzQXhpcztcblxuICAvLyBTaXplIGVuY29kaW5nIG9yIHRoZSBkZWZhdWx0IGNvbmZpZy5ib3guc2l6ZSBpcyBhcHBsaWVkIHRvIGJveCBhbmQgYm94TWlkXG4gIGNvbnN0IHNpemVNaXhpbnMgPSBzaXplID8ge3NpemV9IDogZ2V0TWFya1NwZWNpZmljQ29uZmlnTWl4aW5zKGNvbmZpZy5ib3gsICdzaXplJyk7XG5cbiAgY29uc3QgY29udGludW91c0F4aXNTY2FsZUFuZEF4aXMgPSB7fTtcbiAgaWYgKGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5zY2FsZSkge1xuICAgIGNvbnRpbnVvdXNBeGlzU2NhbGVBbmRBeGlzWydzY2FsZSddID0gY29udGludW91c0F4aXNDaGFubmVsRGVmLnNjYWxlO1xuICB9XG4gIGlmIChjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuYXhpcykge1xuICAgIGNvbnRpbnVvdXNBeGlzU2NhbGVBbmRBeGlzWydheGlzJ10gPSBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuYXhpcztcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLi4ub3V0ZXJTcGVjLFxuICAgIHRyYW5zZm9ybSxcbiAgICBsYXllcjogW1xuICAgICAgeyAvLyBsb3dlciB3aGlza2VyXG4gICAgICAgIG1hcms6IHtcbiAgICAgICAgICB0eXBlOiAncnVsZScsXG4gICAgICAgICAgc3R5bGU6ICdib3hXaGlza2VyJ1xuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFtjb250aW51b3VzQXhpc106IHtcbiAgICAgICAgICAgIGZpZWxkOiAnbG93ZXJfd2hpc2tlcl8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgICAgICAgICAgdHlwZTogY29udGludW91c0F4aXNDaGFubmVsRGVmLnR5cGUsXG4gICAgICAgICAgICAuLi5jb250aW51b3VzQXhpc1NjYWxlQW5kQXhpc1xuICAgICAgICAgIH0sXG4gICAgICAgICAgW2NvbnRpbnVvdXNBeGlzICsgJzInXToge1xuICAgICAgICAgICAgZmllbGQ6ICdsb3dlcl9ib3hfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZCxcbiAgICAgICAgICAgIHR5cGU6IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi50eXBlXG4gICAgICAgICAgfSxcbiAgICAgICAgICAuLi5lbmNvZGluZ1dpdGhvdXRTaXplQ29sb3JBbmRDb250aW51b3VzQXhpcyxcbiAgICAgICAgICAuLi5nZXRNYXJrU3BlY2lmaWNDb25maWdNaXhpbnMoY29uZmlnLmJveFdoaXNrZXIsICdjb2xvcicpXG4gICAgICAgIH1cbiAgICAgIH0sIHsgLy8gdXBwZXIgd2hpc2tlclxuICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgdHlwZTogJ3J1bGUnLFxuICAgICAgICAgIHN0eWxlOiAnYm94V2hpc2tlcidcbiAgICAgICAgfSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICBbY29udGludW91c0F4aXNdOiB7XG4gICAgICAgICAgICBmaWVsZDogJ3VwcGVyX2JveF8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgICAgICAgICAgdHlwZTogY29udGludW91c0F4aXNDaGFubmVsRGVmLnR5cGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFtjb250aW51b3VzQXhpcyArICcyJ106IHtcbiAgICAgICAgICAgIGZpZWxkOiAndXBwZXJfd2hpc2tlcl8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgICAgICAgICAgdHlwZTogY29udGludW91c0F4aXNDaGFubmVsRGVmLnR5cGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIC4uLmVuY29kaW5nV2l0aG91dFNpemVDb2xvckFuZENvbnRpbnVvdXNBeGlzLFxuICAgICAgICAgIC4uLmdldE1hcmtTcGVjaWZpY0NvbmZpZ01peGlucyhjb25maWcuYm94V2hpc2tlciwgJ2NvbG9yJylcbiAgICAgICAgfVxuICAgICAgfSwgeyAvLyBib3ggKHExIHRvIHEzKVxuICAgICAgICAuLi4oc2VsZWN0aW9uID8ge3NlbGVjdGlvbn0gOiB7fSksXG4gICAgICAgIG1hcms6IHtcbiAgICAgICAgICB0eXBlOiAnYmFyJyxcbiAgICAgICAgICBzdHlsZTogJ2JveCdcbiAgICAgICAgfSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICBbY29udGludW91c0F4aXNdOiB7XG4gICAgICAgICAgICBmaWVsZDogJ2xvd2VyX2JveF8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgICAgICAgICAgdHlwZTogY29udGludW91c0F4aXNDaGFubmVsRGVmLnR5cGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFtjb250aW51b3VzQXhpcyArICcyJ106IHtcbiAgICAgICAgICAgIGZpZWxkOiAndXBwZXJfYm94XycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGQsXG4gICAgICAgICAgICB0eXBlOiBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYudHlwZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgLi4uZW5jb2RpbmdXaXRob3V0Q29udGludW91c0F4aXMsXG4gICAgICAgICAgLi4uKGVuY29kaW5nV2l0aG91dENvbnRpbnVvdXNBeGlzLmNvbG9yID8ge30gOiBnZXRNYXJrU3BlY2lmaWNDb25maWdNaXhpbnMoY29uZmlnLmJveCwgJ2NvbG9yJykpLFxuICAgICAgICAgIC4uLnNpemVNaXhpbnMsXG4gICAgICAgIH1cbiAgICAgIH0sIHsgLy8gbWlkIHRpY2tcbiAgICAgICAgbWFyazoge1xuICAgICAgICAgIHR5cGU6ICd0aWNrJyxcbiAgICAgICAgICBzdHlsZTogJ2JveE1pZCdcbiAgICAgICAgfSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICBbY29udGludW91c0F4aXNdOiB7XG4gICAgICAgICAgICBmaWVsZDogJ21pZF9ib3hfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZCxcbiAgICAgICAgICAgIHR5cGU6IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi50eXBlXG4gICAgICAgICAgfSxcbiAgICAgICAgICAuLi5lbmNvZGluZ1dpdGhvdXRTaXplQ29sb3JBbmRDb250aW51b3VzQXhpcyxcbiAgICAgICAgICAuLi5nZXRNYXJrU3BlY2lmaWNDb25maWdNaXhpbnMoY29uZmlnLmJveE1pZCwgJ2NvbG9yJyksXG4gICAgICAgICAgLi4uc2l6ZU1peGlucyxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn1cblxuZnVuY3Rpb24gYm94T3JpZW50KHNwZWM6IEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZzxGaWVsZD4sIEJPWFBMT1QgfCBCb3hQbG90RGVmPik6IE9yaWVudCB7XG4gIGNvbnN0IHttYXJrOiBtYXJrLCBlbmNvZGluZzogZW5jb2RpbmcsIHByb2plY3Rpb246IF9wLCAuLi5fb3V0ZXJTcGVjfSA9IHNwZWM7XG5cbiAgaWYgKGlzRmllbGREZWYoZW5jb2RpbmcueCkgJiYgaXNDb250aW51b3VzKGVuY29kaW5nLngpKSB7XG4gICAgLy8geCBpcyBjb250aW51b3VzXG4gICAgaWYgKGlzRmllbGREZWYoZW5jb2RpbmcueSkgJiYgaXNDb250aW51b3VzKGVuY29kaW5nLnkpKSB7XG4gICAgICAvLyBib3RoIHggYW5kIHkgYXJlIGNvbnRpbnVvdXNcbiAgICAgIGlmIChlbmNvZGluZy54LmFnZ3JlZ2F0ZSA9PT0gdW5kZWZpbmVkICYmIGVuY29kaW5nLnkuYWdncmVnYXRlID09PSBCT1hQTE9UKSB7XG4gICAgICAgIHJldHVybiAndmVydGljYWwnO1xuICAgICAgfSBlbHNlIGlmIChlbmNvZGluZy55LmFnZ3JlZ2F0ZSA9PT0gdW5kZWZpbmVkICYmIGVuY29kaW5nLnguYWdncmVnYXRlID09PSBCT1hQTE9UKSB7XG4gICAgICAgIHJldHVybiAnaG9yaXpvbnRhbCc7XG4gICAgICB9IGVsc2UgaWYgKGVuY29kaW5nLnguYWdncmVnYXRlID09PSBCT1hQTE9UICYmIGVuY29kaW5nLnkuYWdncmVnYXRlID09PSBCT1hQTE9UKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQm90aCB4IGFuZCB5IGNhbm5vdCBoYXZlIGFnZ3JlZ2F0ZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGlzQm94UGxvdERlZihtYXJrKSAmJiBtYXJrLm9yaWVudCkge1xuICAgICAgICAgIHJldHVybiBtYXJrLm9yaWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGRlZmF1bHQgb3JpZW50YXRpb24gPSB2ZXJ0aWNhbFxuICAgICAgICByZXR1cm4gJ3ZlcnRpY2FsJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB4IGlzIGNvbnRpbnVvdXMgYnV0IHkgaXMgbm90XG4gICAgcmV0dXJuICdob3Jpem9udGFsJztcbiAgfSBlbHNlIGlmIChpc0ZpZWxkRGVmKGVuY29kaW5nLnkpICYmIGlzQ29udGludW91cyhlbmNvZGluZy55KSkge1xuICAgIC8vIHkgaXMgY29udGludW91cyBidXQgeCBpcyBub3RcbiAgICByZXR1cm4gJ3ZlcnRpY2FsJztcbiAgfSBlbHNlIHtcbiAgICAvLyBOZWl0aGVyIHggbm9yIHkgaXMgY29udGludW91cy5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05lZWQgYSB2YWxpZCBjb250aW51b3VzIGF4aXMgZm9yIGJveHBsb3RzJyk7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBib3hDb250aW5vdXNBeGlzKHNwZWM6IEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZzxzdHJpbmc+LCBCT1hQTE9UIHwgQm94UGxvdERlZj4sIG9yaWVudDogT3JpZW50KSB7XG4gIGNvbnN0IHttYXJrOiBtYXJrLCBlbmNvZGluZzogZW5jb2RpbmcsIHByb2plY3Rpb246IF9wLCAuLi5fb3V0ZXJTcGVjfSA9IHNwZWM7XG5cbiAgbGV0IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZjogUG9zaXRpb25GaWVsZERlZjxzdHJpbmc+O1xuICBsZXQgY29udGludW91c0F4aXM6ICd4JyB8ICd5JztcblxuICBpZiAob3JpZW50ID09PSAndmVydGljYWwnKSB7XG4gICAgY29udGludW91c0F4aXMgPSAneSc7XG4gICAgY29udGludW91c0F4aXNDaGFubmVsRGVmID0gZW5jb2RpbmcueSBhcyBGaWVsZERlZjxzdHJpbmc+OyAvLyBTYWZlIHRvIGNhc3QgYmVjYXVzZSBpZiB5IGlzIG5vdCBjb250aW51b3VzIGZpZWxkZGVmLCB0aGUgb3JpZW50IHdvdWxkIG5vdCBiZSB2ZXJ0aWNhbC5cbiAgfSBlbHNlIHtcbiAgICBjb250aW51b3VzQXhpcyA9ICd4JztcbiAgICBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYgPSBlbmNvZGluZy54IGFzIEZpZWxkRGVmPHN0cmluZz47IC8vIFNhZmUgdG8gY2FzdCBiZWNhdXNlIGlmIHggaXMgbm90IGNvbnRpbnVvdXMgZmllbGRkZWYsIHRoZSBvcmllbnQgd291bGQgbm90IGJlIGhvcml6b250YWwuXG4gIH1cblxuICBpZiAoY29udGludW91c0F4aXNDaGFubmVsRGVmICYmIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5hZ2dyZWdhdGUpIHtcbiAgICBjb25zdCB7YWdncmVnYXRlLCAuLi5jb250aW51b3VzQXhpc1dpdGhvdXRBZ2dyZWdhdGV9ID0gY29udGludW91c0F4aXNDaGFubmVsRGVmO1xuICAgIGlmIChhZ2dyZWdhdGUgIT09IEJPWFBMT1QpIHtcbiAgICAgIGxvZy53YXJuKGBDb250aW51b3VzIGF4aXMgc2hvdWxkIG5vdCBoYXZlIGN1c3RvbWl6ZWQgYWdncmVnYXRpb24gZnVuY3Rpb24gJHthZ2dyZWdhdGV9YCk7XG4gICAgfVxuICAgIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZiA9IGNvbnRpbnVvdXNBeGlzV2l0aG91dEFnZ3JlZ2F0ZTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY29udGludW91c0F4aXNDaGFubmVsRGVmLFxuICAgIGNvbnRpbnVvdXNBeGlzXG4gIH07XG59XG5cbmZ1bmN0aW9uIGJveFBhcmFtcyhzcGVjOiBHZW5lcmljVW5pdFNwZWM8RW5jb2Rpbmc8c3RyaW5nPiwgQk9YUExPVCB8IEJveFBsb3REZWY+LCBvcmllbnQ6IE9yaWVudCwga0lRUlNjYWxhcjogJ21pbi1tYXgnIHwgbnVtYmVyKSB7XG5cbiAgY29uc3Qge2NvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZiwgY29udGludW91c0F4aXN9ID0gYm94Q29udGlub3VzQXhpcyhzcGVjLCBvcmllbnQpO1xuICBjb25zdCBlbmNvZGluZyA9IHNwZWMuZW5jb2Rpbmc7XG5cbiAgY29uc3QgaXNNaW5NYXggPSBrSVFSU2NhbGFyID09PSB1bmRlZmluZWQ7XG4gIGNvbnN0IGFnZ3JlZ2F0ZTogQWdncmVnYXRlZEZpZWxkRGVmW10gPSBbXG4gICAge1xuICAgICAgb3A6ICdxMScsXG4gICAgICBmaWVsZDogY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgICAgYXM6ICdsb3dlcl9ib3hfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZFxuICAgIH0sXG4gICAge1xuICAgICAgb3A6ICdxMycsXG4gICAgICBmaWVsZDogY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgICAgYXM6ICd1cHBlcl9ib3hfJyArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZFxuICAgIH0sXG4gICAge1xuICAgICAgb3A6ICdtZWRpYW4nLFxuICAgICAgZmllbGQ6IGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZCxcbiAgICAgIGFzOiAnbWlkX2JveF8nICsgY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkXG4gICAgfVxuICBdO1xuICBsZXQgcG9zdEFnZ3JlZ2F0ZUNhbGN1bGF0ZXM6IENhbGN1bGF0ZVRyYW5zZm9ybVtdID0gW107XG5cbiAgYWdncmVnYXRlLnB1c2goe1xuICAgIG9wOiAnbWluJyxcbiAgICBmaWVsZDogY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgIGFzOiAoaXNNaW5NYXggPyAnbG93ZXJfd2hpc2tlcl8nIDogJ21pbl8nKSArIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZFxuICB9KTtcbiAgYWdncmVnYXRlLnB1c2goe1xuICAgIG9wOiAnbWF4JyxcbiAgICBmaWVsZDogY29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkLFxuICAgIGFzOiAgKGlzTWluTWF4ID8gJ3VwcGVyX3doaXNrZXJfJyA6ICdtYXhfJykgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGRcbiAgfSk7XG5cbiAgaWYgKCFpc01pbk1heCkge1xuICAgIHBvc3RBZ2dyZWdhdGVDYWxjdWxhdGVzID0gW1xuICAgICAge1xuICAgICAgICBjYWxjdWxhdGU6IGBkYXR1bS51cHBlcl9ib3hfJHtjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGR9IC0gZGF0dW0ubG93ZXJfYm94XyR7Y29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkfWAsXG4gICAgICAgIGFzOiAnaXFyXycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGRcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNhbGN1bGF0ZTogYG1pbihkYXR1bS51cHBlcl9ib3hfJHtjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGR9ICsgZGF0dW0uaXFyXyR7Y29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkfSAqICR7a0lRUlNjYWxhcn0sIGRhdHVtLm1heF8ke2NvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZH0pYCxcbiAgICAgICAgYXM6ICd1cHBlcl93aGlza2VyXycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGRcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNhbGN1bGF0ZTogYG1heChkYXR1bS5sb3dlcl9ib3hfJHtjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGR9IC0gZGF0dW0uaXFyXyR7Y29udGludW91c0F4aXNDaGFubmVsRGVmLmZpZWxkfSAqICR7a0lRUlNjYWxhcn0sIGRhdHVtLm1pbl8ke2NvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZi5maWVsZH0pYCxcbiAgICAgICAgYXM6ICdsb3dlcl93aGlza2VyXycgKyBjb250aW51b3VzQXhpc0NoYW5uZWxEZWYuZmllbGRcbiAgICAgIH1cbiAgICBdO1xuICB9XG5cbiAgY29uc3QgZ3JvdXBieTogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgYmluczogQmluVHJhbnNmb3JtW10gPSBbXTtcbiAgY29uc3QgdGltZVVuaXRzOiBUaW1lVW5pdFRyYW5zZm9ybVtdID0gW107XG5cbiAgY29uc3QgZW5jb2RpbmdXaXRob3V0Q29udGludW91c0F4aXM6IEVuY29kaW5nPHN0cmluZz4gPSB7fTtcbiAgZm9yRWFjaChlbmNvZGluZywgKGNoYW5uZWxEZWYsIGNoYW5uZWwpID0+IHtcbiAgICBpZiAoY2hhbm5lbCA9PT0gY29udGludW91c0F4aXMpIHtcbiAgICAgIC8vIFNraXAgY29udGludW91cyBheGlzIGFzIHdlIGFscmVhZHkgaGFuZGxlIGl0IHNlcGFyYXRlbHlcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGlzRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICAgIGlmIChjaGFubmVsRGVmLmFnZ3JlZ2F0ZSAmJiBjaGFubmVsRGVmLmFnZ3JlZ2F0ZSAhPT0gQk9YUExPVCkge1xuICAgICAgICBhZ2dyZWdhdGUucHVzaCh7XG4gICAgICAgICAgb3A6IGNoYW5uZWxEZWYuYWdncmVnYXRlLFxuICAgICAgICAgIGZpZWxkOiBjaGFubmVsRGVmLmZpZWxkLFxuICAgICAgICAgIGFzOiB2Z0ZpZWxkKGNoYW5uZWxEZWYpXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChjaGFubmVsRGVmLmFnZ3JlZ2F0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybWVkRmllbGQgPSB2Z0ZpZWxkKGNoYW5uZWxEZWYpO1xuXG4gICAgICAgIC8vIEFkZCBiaW4gb3IgdGltZVVuaXQgdHJhbnNmb3JtIGlmIGFwcGxpY2FibGVcbiAgICAgICAgY29uc3QgYmluID0gY2hhbm5lbERlZi5iaW47XG4gICAgICAgIGlmIChiaW4pIHtcbiAgICAgICAgICBjb25zdCB7ZmllbGR9ID0gY2hhbm5lbERlZjtcbiAgICAgICAgICBiaW5zLnB1c2goe2JpbiwgZmllbGQsIGFzOiB0cmFuc2Zvcm1lZEZpZWxkfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY2hhbm5lbERlZi50aW1lVW5pdCkge1xuICAgICAgICAgIGNvbnN0IHt0aW1lVW5pdCwgZmllbGR9ID0gY2hhbm5lbERlZjtcbiAgICAgICAgICB0aW1lVW5pdHMucHVzaCh7dGltZVVuaXQsIGZpZWxkLCBhczogdHJhbnNmb3JtZWRGaWVsZH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZ3JvdXBieS5wdXNoKHRyYW5zZm9ybWVkRmllbGQpO1xuICAgICAgfVxuICAgICAgLy8gbm93IHRoZSBmaWVsZCBzaG91bGQgcmVmZXIgdG8gcG9zdC10cmFuc2Zvcm1lZCBmaWVsZCBpbnN0ZWFkXG4gICAgICBlbmNvZGluZ1dpdGhvdXRDb250aW51b3VzQXhpc1tjaGFubmVsXSA9IHtcbiAgICAgICAgZmllbGQ6IHZnRmllbGQoY2hhbm5lbERlZiksXG4gICAgICAgIHR5cGU6IGNoYW5uZWxEZWYudHlwZVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRm9yIHZhbHVlIGRlZiwganVzdCBjb3B5XG4gICAgICBlbmNvZGluZ1dpdGhvdXRDb250aW51b3VzQXhpc1tjaGFubmVsXSA9IGVuY29kaW5nW2NoYW5uZWxdO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICB0cmFuc2Zvcm06IFtdLmNvbmNhdChcbiAgICAgIGJpbnMsXG4gICAgICB0aW1lVW5pdHMsXG4gICAgICBbe2FnZ3JlZ2F0ZSwgZ3JvdXBieX1dLFxuICAgICAgcG9zdEFnZ3JlZ2F0ZUNhbGN1bGF0ZXNcbiAgICApLFxuICAgIGNvbnRpbnVvdXNBeGlzQ2hhbm5lbERlZixcbiAgICBjb250aW51b3VzQXhpcyxcbiAgICBlbmNvZGluZ1dpdGhvdXRDb250aW51b3VzQXhpc1xuICB9O1xufVxuIl19