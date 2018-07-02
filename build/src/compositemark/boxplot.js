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
    var _a, _b, _c, _d;
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
    var _e = boxParams(spec, orient, kIQRScalar), transform = _e.transform, continuousAxisChannelDef = _e.continuousAxisChannelDef, continuousAxis = _e.continuousAxis, encodingWithoutContinuousAxis = _e.encodingWithoutContinuousAxis;
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
                encoding: tslib_1.__assign((_a = {}, _a[continuousAxis] = tslib_1.__assign({ field: 'lower_whisker_' + continuousAxisChannelDef.field, type: continuousAxisChannelDef.type }, continuousAxisScaleAndAxis), _a[continuousAxis + '2'] = {
                    field: 'lower_box_' + continuousAxisChannelDef.field,
                    type: continuousAxisChannelDef.type
                }, _a), encodingWithoutSizeColorAndContinuousAxis, getMarkSpecificConfigMixins(config.boxWhisker, 'color'))
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
                }, _b), encodingWithoutSizeColorAndContinuousAxis, getMarkSpecificConfigMixins(config.boxWhisker, 'color'))
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
                }, _c), encodingWithoutContinuousAxis, (encodingWithoutContinuousAxis.color ? {} : getMarkSpecificConfigMixins(config.box, 'color')), sizeMixins) }),
            {
                mark: {
                    type: 'tick',
                    style: 'boxMid'
                },
                encoding: tslib_1.__assign((_d = {}, _d[continuousAxis] = {
                    field: 'mid_box_' + continuousAxisChannelDef.field,
                    type: continuousAxisChannelDef.type
                }, _d), encodingWithoutSizeColorAndContinuousAxis, getMarkSpecificConfigMixins(config.boxMid, 'color'), sizeMixins)
            }
        ] });
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
//# sourceMappingURL=boxplot.js.map