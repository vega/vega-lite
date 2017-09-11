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
    var mark = spec.mark, encoding = spec.encoding, _outerSpec = tslib_1.__rest(spec, ["mark", "encoding"]);
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
    var mark = spec.mark, encoding = spec.encoding, _outerSpec = tslib_1.__rest(spec, ["mark", "encoding"]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm94cGxvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb3NpdGVtYXJrL2JveHBsb3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsdUNBQW1DO0FBR25DLHdDQUFtQztBQUVuQywwQ0FBZ0Q7QUFDaEQsMENBQWlHO0FBQ2pHLDhCQUFnQztBQU1uQixRQUFBLE9BQU8sR0FBZSxVQUFVLENBQUM7QUFXOUMsc0JBQTZCLElBQTBCO0lBQ3JELE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFGRCxvQ0FFQztBQUVZLFFBQUEsY0FBYyxHQUFtQixDQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFnQmpFLFFBQUEscUNBQXFDLEdBRTlDO0lBQ0YsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDO0NBQ2QsQ0FBQztBQUVGLElBQU0saUJBQWlCLEdBQWMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3RGLG1DQUEwQyxJQUE2RDtJQUNyRyxNQUFNLHNCQUNELElBQUksSUFDUCxRQUFRLEVBQUUsaUJBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxPQUFPO1lBQzdELEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxRQUFRLENBQUM7WUFDbEMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsZUFBTyxDQUFDLENBQUMsQ0FBQztZQUM5RCxDQUFDO1lBQ0QsTUFBTSxDQUFDLFdBQVcsQ0FBQztRQUNyQixDQUFDLEVBQUUsRUFBRSxDQUFDLElBQ047QUFDSixDQUFDO0FBWkQsOERBWUM7QUFFRCwwQkFBaUMsSUFBNkQsRUFBRSxNQUFjO0lBQzVHLElBQUksR0FBRyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2QyxzQkFBc0I7SUFDZixJQUFBLGdCQUFJLEVBQUUsd0JBQVEsRUFBRSwwQkFBUyxFQUFFLG1FQUFZLENBQVM7SUFFdkQsSUFBSSxVQUFVLEdBQVcsU0FBUyxDQUFDO0lBQ25DLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDaEIsRUFBRSxDQUFBLENBQUMsb0JBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUMzQixDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFRCxJQUFNLE1BQU0sR0FBVyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakMsSUFBQSx3Q0FBMEgsRUFBekgsd0JBQVMsRUFBRSxzREFBd0IsRUFBRSxrQ0FBYyxFQUFFLGdFQUE2QixDQUF3QztJQUUxSCxJQUFBLHlDQUFJLEVBQUUsMkNBQUssRUFBRSxzR0FBc0MsQ0FBa0M7SUFDNUYsSUFBTSxVQUFVLEdBQUcsSUFBSSxHQUFHLEVBQUMsSUFBSSxNQUFBLEVBQUMsR0FBRyxFQUFDLElBQUksRUFBRSxFQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBQyxFQUFDLENBQUM7SUFFcEUsSUFBTSwwQkFBMEIsR0FBRyxFQUFFLENBQUM7SUFDdEMsRUFBRSxDQUFDLENBQUMsd0JBQXdCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNuQywwQkFBMEIsQ0FBQyxPQUFPLENBQUMsR0FBRyx3QkFBd0IsQ0FBQyxLQUFLLENBQUM7SUFDdkUsQ0FBQztJQUNELEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEMsMEJBQTBCLENBQUMsTUFBTSxDQUFDLEdBQUcsd0JBQXdCLENBQUMsSUFBSSxDQUFDO0lBQ3JFLENBQUM7SUFFRCxNQUFNLHNCQUNELFNBQVMsSUFDWixTQUFTLFdBQUEsRUFDVCxLQUFLLEVBQUU7WUFDTDtnQkFDRSxJQUFJLEVBQUU7b0JBQ0osSUFBSSxFQUFFLE1BQU07b0JBQ1osS0FBSyxFQUFFLFlBQVk7aUJBQ3BCO2dCQUNELFFBQVEsZ0NBQ0wsY0FBYyx1QkFDYixLQUFLLEVBQUUsY0FBYyxFQUNyQixJQUFJLEVBQUUsd0JBQXdCLENBQUMsSUFBSSxJQUNoQywwQkFBMEIsTUFFOUIsY0FBYyxHQUFHLEdBQUcsSUFBRztvQkFDdEIsS0FBSyxFQUFFLFVBQVU7b0JBQ2pCLElBQUksRUFBRSx3QkFBd0IsQ0FBQyxJQUFJO2lCQUNwQyxPQUNFLG1DQUFtQyxDQUN2QzthQUNGLEVBQUU7Z0JBQ0QsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxNQUFNO29CQUNaLEtBQUssRUFBRSxZQUFZO2lCQUNwQjtnQkFDRCxRQUFRLGdDQUNMLGNBQWMsSUFBRztvQkFDaEIsS0FBSyxFQUFFLFVBQVU7b0JBQ2pCLElBQUksRUFBRSx3QkFBd0IsQ0FBQyxJQUFJO2lCQUNwQyxLQUNBLGNBQWMsR0FBRyxHQUFHLElBQUc7b0JBQ3RCLEtBQUssRUFBRSxjQUFjO29CQUNyQixJQUFJLEVBQUUsd0JBQXdCLENBQUMsSUFBSTtpQkFDcEMsT0FDRSxtQ0FBbUMsQ0FDdkM7YUFDRjtpQ0FDSSxDQUFDLFNBQVMsR0FBRyxFQUFDLFNBQVMsV0FBQSxFQUFDLEdBQUcsRUFBRSxDQUFDLElBQ2pDLElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsS0FBSztvQkFDWCxLQUFLLEVBQUUsS0FBSztpQkFDYixFQUNELFFBQVEsZ0NBQ0wsY0FBYyxJQUFHO29CQUNoQixLQUFLLEVBQUUsVUFBVTtvQkFDakIsSUFBSSxFQUFFLHdCQUF3QixDQUFDLElBQUk7aUJBQ3BDLEtBQ0EsY0FBYyxHQUFHLEdBQUcsSUFBRztvQkFDdEIsS0FBSyxFQUFFLFVBQVU7b0JBQ2pCLElBQUksRUFBRSx3QkFBd0IsQ0FBQyxJQUFJO2lCQUNwQyxPQUNFLDZCQUE2QixFQUU3QixVQUFVO1lBRWQ7Z0JBQ0QsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxNQUFNO29CQUNaLEtBQUssRUFBRSxRQUFRO2lCQUNoQjtnQkFDRCxRQUFRLGdDQUNMLGNBQWMsSUFBRztvQkFDaEIsS0FBSyxFQUFFLFFBQVE7b0JBQ2YsSUFBSSxFQUFFLHdCQUF3QixDQUFDLElBQUk7aUJBQ3BDLE9BQ0UsbUNBQW1DLEVBQ25DLFVBQVUsQ0FDZDthQUNGO1NBQ0YsSUFDRDs7QUFDSixDQUFDO0FBcEdELDRDQW9HQztBQUVELG1CQUFtQixJQUE0RDtJQUN0RSxJQUFBLGdCQUFVLEVBQUUsd0JBQWtCLEVBQUUsdURBQWEsQ0FBUztJQUU3RCxFQUFFLENBQUMsQ0FBQyxxQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSx1QkFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkQsa0JBQWtCO1FBQ2xCLEVBQUUsQ0FBQyxDQUFDLHFCQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLHVCQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2RCw4QkFBOEI7WUFDOUIsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLEtBQUssU0FBUyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxLQUFLLGVBQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQzNFLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDcEIsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsS0FBSyxTQUFTLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLEtBQUssZUFBTyxDQUFDLENBQUMsQ0FBQztnQkFDbEYsTUFBTSxDQUFDLFlBQVksQ0FBQztZQUN0QixDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxLQUFLLGVBQU8sSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsS0FBSyxlQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNoRixNQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7WUFDeEQsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDdEMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQ3JCLENBQUM7Z0JBRUQsaUNBQWlDO2dCQUNqQyxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQ3BCLENBQUM7UUFDSCxDQUFDO1FBRUQsK0JBQStCO1FBQy9CLE1BQU0sQ0FBQyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxxQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSx1QkFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUQsK0JBQStCO1FBQy9CLE1BQU0sQ0FBQyxVQUFVLENBQUM7SUFDcEIsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04saUNBQWlDO1FBQ2pDLE1BQU0sSUFBSSxLQUFLLENBQUMsMkNBQTJDLENBQUMsQ0FBQztJQUMvRCxDQUFDO0FBQ0gsQ0FBQztBQUdELDBCQUEwQixJQUE2RCxFQUFFLE1BQWM7SUFDOUYsSUFBQSxnQkFBVSxFQUFFLHdCQUFrQixFQUFFLHVEQUFhLENBQVM7SUFFN0QsSUFBSSx3QkFBa0QsQ0FBQztJQUN2RCxJQUFJLGNBQXlCLENBQUM7SUFFOUIsRUFBRSxDQUFDLENBQUMsTUFBTSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDMUIsY0FBYyxHQUFHLEdBQUcsQ0FBQztRQUNyQix3QkFBd0IsR0FBRyxRQUFRLENBQUMsQ0FBcUIsQ0FBQyxDQUFDLHlGQUF5RjtJQUN0SixDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixjQUFjLEdBQUcsR0FBRyxDQUFDO1FBQ3JCLHdCQUF3QixHQUFHLFFBQVEsQ0FBQyxDQUFxQixDQUFDLENBQUMsMkZBQTJGO0lBQ3hKLENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsSUFBSSx3QkFBd0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzVELElBQUEsOENBQVMsRUFBRSx3RkFBaUMsQ0FBNkI7UUFDaEYsRUFBRSxDQUFDLENBQUMsU0FBUyxLQUFLLGVBQU8sQ0FBQyxDQUFDLENBQUM7WUFDMUIsR0FBRyxDQUFDLElBQUksQ0FBQyxxRUFBbUUsU0FBVyxDQUFDLENBQUM7UUFDM0YsQ0FBQztRQUNELHdCQUF3QixHQUFHLDhCQUE4QixDQUFDO0lBQzVELENBQUM7SUFFRCxNQUFNLENBQUM7UUFDTCx3QkFBd0IsMEJBQUE7UUFDeEIsY0FBYyxnQkFBQTtLQUNmLENBQUM7QUFDSixDQUFDO0FBRUQsbUJBQW1CLElBQTZELEVBQUUsTUFBYyxFQUFFLFVBQThCO0lBRXhILElBQUEsbUNBQTJFLEVBQTFFLHNEQUF3QixFQUFFLGtDQUFjLENBQW1DO0lBQ2xGLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7SUFFL0IsSUFBTSxRQUFRLEdBQUcsVUFBVSxLQUFLLFNBQVMsQ0FBQztJQUMxQyxJQUFNLFNBQVMsR0FBZ0I7UUFDN0I7WUFDRSxTQUFTLEVBQUUsSUFBSTtZQUNmLEtBQUssRUFBRSx3QkFBd0IsQ0FBQyxLQUFLO1lBQ3JDLEVBQUUsRUFBRSxVQUFVO1NBQ2Y7UUFDRDtZQUNFLFNBQVMsRUFBRSxJQUFJO1lBQ2YsS0FBSyxFQUFFLHdCQUF3QixDQUFDLEtBQUs7WUFDckMsRUFBRSxFQUFFLFVBQVU7U0FDZjtRQUNEO1lBQ0UsU0FBUyxFQUFFLFFBQVE7WUFDbkIsS0FBSyxFQUFFLHdCQUF3QixDQUFDLEtBQUs7WUFDckMsRUFBRSxFQUFFLFFBQVE7U0FDYjtLQUNGLENBQUM7SUFDRixJQUFJLHVCQUF1QixHQUF5QixFQUFFLENBQUM7SUFFdkQsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNiLFNBQVMsQ0FBQyxJQUFJLENBQUM7WUFDYixTQUFTLEVBQUUsS0FBSztZQUNoQixLQUFLLEVBQUUsd0JBQXdCLENBQUMsS0FBSztZQUNyQyxFQUFFLEVBQUUsY0FBYztTQUNuQixDQUFDLENBQUM7UUFDSCxTQUFTLENBQUMsSUFBSSxDQUFDO1lBQ2IsU0FBUyxFQUFFLEtBQUs7WUFDaEIsS0FBSyxFQUFFLHdCQUF3QixDQUFDLEtBQUs7WUFDckMsRUFBRSxFQUFFLGNBQWM7U0FDbkIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sdUJBQXVCLEdBQUc7WUFDeEI7Z0JBQ0UsU0FBUyxFQUFFLGlDQUFpQztnQkFDNUMsRUFBRSxFQUFFLEtBQUs7YUFDVjtZQUNEO2dCQUNFLFNBQVMsRUFBRSwrQkFBK0IsR0FBRyxVQUFVO2dCQUN2RCxFQUFFLEVBQUUsY0FBYzthQUNuQjtZQUNEO2dCQUNFLFNBQVMsRUFBRSwrQkFBK0IsR0FBRyxVQUFVO2dCQUN2RCxFQUFFLEVBQUUsY0FBYzthQUNuQjtTQUNGLENBQUM7SUFDSixDQUFDO0lBRUQsSUFBTSxPQUFPLEdBQWEsRUFBRSxDQUFDO0lBQzdCLElBQU0sSUFBSSxHQUFtQixFQUFFLENBQUM7SUFDaEMsSUFBTSxTQUFTLEdBQXdCLEVBQUUsQ0FBQztJQUUxQyxJQUFNLDZCQUE2QixHQUFxQixFQUFFLENBQUM7SUFDM0Qsa0JBQU8sQ0FBQyxRQUFRLEVBQUUsVUFBQyxVQUFVLEVBQUUsT0FBTztRQUNwQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssY0FBYyxDQUFDLENBQUMsQ0FBQztZQUMvQiwwREFBMEQ7WUFDMUQsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLHFCQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLElBQUksVUFBVSxDQUFDLFNBQVMsS0FBSyxlQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUM3RCxTQUFTLENBQUMsSUFBSSxDQUFDO29CQUNiLFNBQVMsRUFBRSxVQUFVLENBQUMsU0FBUztvQkFDL0IsS0FBSyxFQUFFLFVBQVUsQ0FBQyxLQUFLO29CQUN2QixFQUFFLEVBQUUsZ0JBQUssQ0FBQyxVQUFVLENBQUM7aUJBQ3RCLENBQUMsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxJQUFNLGdCQUFnQixHQUFHLGdCQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBRTNDLDhDQUE4QztnQkFDOUMsSUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQztnQkFDM0IsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDRCxJQUFBLDBCQUFLLENBQWU7b0JBQzNCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBQyxHQUFHLEtBQUEsRUFBRSxLQUFLLFNBQUEsRUFBRSxFQUFFLEVBQUUsZ0JBQWdCLEVBQUMsQ0FBQyxDQUFDO2dCQUNoRCxDQUFDO2dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDeEIsSUFBQSw4QkFBUSxFQUFFLDBCQUFLLENBQWU7b0JBQ3JDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBQyxRQUFRLFVBQUEsRUFBRSxLQUFLLFNBQUEsRUFBRSxFQUFFLEVBQUUsZ0JBQWdCLEVBQUMsQ0FBQyxDQUFDO2dCQUMxRCxDQUFDO2dCQUVELE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUNqQyxDQUFDO1lBQ0QsK0RBQStEO1lBQy9ELDZCQUE2QixDQUFDLE9BQU8sQ0FBQyxHQUFHO2dCQUN2QyxLQUFLLEVBQUUsZ0JBQUssQ0FBQyxVQUFVLENBQUM7Z0JBQ3hCLElBQUksRUFBRSxVQUFVLENBQUMsSUFBSTthQUN0QixDQUFDO1FBQ0osQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sMkJBQTJCO1lBQzNCLDZCQUE2QixDQUFDLE9BQU8sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3RCxDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUM7UUFDTCxTQUFTLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FDbEIsSUFBSSxFQUNKLFNBQVMsRUFDVCxDQUFDLEVBQUMsU0FBUyxXQUFBLEVBQUUsT0FBTyxTQUFBLEVBQUMsQ0FBQyxFQUN0Qix1QkFBdUIsQ0FDeEI7UUFDRCx3QkFBd0IsMEJBQUE7UUFDeEIsY0FBYyxnQkFBQTtRQUNkLDZCQUE2QiwrQkFBQTtLQUM5QixDQUFDO0FBQ0osQ0FBQyJ9