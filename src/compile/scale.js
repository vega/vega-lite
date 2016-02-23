"use strict";
var util_1 = require('../util');
var aggregate_1 = require('../aggregate');
var channel_1 = require('../channel');
var data_1 = require('../data');
var type_1 = require('../type');
var mark_1 = require('../mark');
var time_1 = require('./time');
var enums_1 = require('../enums');
var timeunit_1 = require('../timeunit');
var fielddef_1 = require('../fielddef');
exports.COLOR_LEGEND = 'color_legend';
exports.COLOR_LEGEND_LABEL = 'color_legend_label';
function compileScales(channels, model) {
    return channels.filter(channel_1.hasScale)
        .reduce(function (scales, channel) {
        var fieldDef = model.fieldDef(channel);
        if (channel === channel_1.COLOR && model.legend(channel_1.COLOR) && (fieldDef.type === type_1.ORDINAL || fieldDef.bin || fieldDef.timeUnit)) {
            scales.push(colorLegendScale(model, fieldDef));
            if (fieldDef.bin) {
                scales.push(binColorLegendLabel(model, fieldDef));
            }
        }
        scales.push(mainScale(model, fieldDef, channel));
        return scales;
    }, []);
}
exports.compileScales = compileScales;
function mainScale(model, fieldDef, channel) {
    var scale = model.scale(channel);
    var sort = model.sort(channel);
    var scaleDef = {
        name: model.scaleName(channel),
        type: scaleType(scale, fieldDef, channel, model.mark()),
    };
    scaleDef.domain = domain(scale, model, channel, scaleDef.type);
    util_1.extend(scaleDef, rangeMixins(scale, model, channel, scaleDef.type));
    if (sort && (typeof sort === 'string' ? sort : sort.order) === 'descending') {
        scaleDef.reverse = true;
    }
    [
        'round',
        'clamp', 'nice',
        'exponent', 'zero',
        'padding', 'points'
    ].forEach(function (property) {
        var value = exports[property](scale[property], scaleDef.type, channel, fieldDef);
        if (value !== undefined) {
            scaleDef[property] = value;
        }
    });
    return scaleDef;
}
function colorLegendScale(model, fieldDef) {
    return {
        name: exports.COLOR_LEGEND,
        type: 'ordinal',
        domain: {
            data: model.dataTable(),
            field: model.field(channel_1.COLOR, (fieldDef.bin || fieldDef.timeUnit) ? {} : { prefn: 'rank_' }), sort: true
        },
        range: { data: model.dataTable(), field: model.field(channel_1.COLOR), sort: true }
    };
}
function binColorLegendLabel(model, fieldDef) {
    return {
        name: exports.COLOR_LEGEND_LABEL,
        type: 'ordinal',
        domain: {
            data: model.dataTable(),
            field: model.field(channel_1.COLOR, { prefn: 'rank_' }),
            sort: true
        },
        range: {
            data: model.dataTable(),
            field: fielddef_1.field(fieldDef, { binSuffix: '_range' }),
            sort: {
                field: model.field(channel_1.COLOR, { binSuffix: '_start' }),
                op: 'min'
            }
        }
    };
}
function scaleType(scale, fieldDef, channel, mark) {
    if (!channel_1.hasScale(channel)) {
        return null;
    }
    if (util_1.contains([channel_1.ROW, channel_1.COLUMN, channel_1.SHAPE], channel)) {
        return enums_1.ScaleType.ORDINAL;
    }
    if (scale.type !== undefined) {
        return scale.type;
    }
    switch (fieldDef.type) {
        case type_1.NOMINAL:
            return enums_1.ScaleType.ORDINAL;
        case type_1.ORDINAL:
            if (channel === channel_1.COLOR) {
                return enums_1.ScaleType.LINEAR;
            }
            return enums_1.ScaleType.ORDINAL;
        case type_1.TEMPORAL:
            if (channel === channel_1.COLOR) {
                return enums_1.ScaleType.TIME;
            }
            if (fieldDef.timeUnit) {
                switch (fieldDef.timeUnit) {
                    case timeunit_1.TimeUnit.HOURS:
                    case timeunit_1.TimeUnit.DAY:
                    case timeunit_1.TimeUnit.MONTH:
                        return enums_1.ScaleType.ORDINAL;
                    default:
                        return enums_1.ScaleType.TIME;
                }
            }
            return enums_1.ScaleType.TIME;
        case type_1.QUANTITATIVE:
            if (fieldDef.bin) {
                return util_1.contains([channel_1.X, channel_1.Y, channel_1.COLOR], channel) ? enums_1.ScaleType.LINEAR : enums_1.ScaleType.ORDINAL;
            }
            return enums_1.ScaleType.LINEAR;
    }
    return null;
}
exports.scaleType = scaleType;
function domain(scale, model, channel, scaleType) {
    var fieldDef = model.fieldDef(channel);
    if (scale.domain) {
        return scale.domain;
    }
    if (fieldDef.type === type_1.TEMPORAL) {
        if (time_1.rawDomain(fieldDef.timeUnit, channel)) {
            return {
                data: fieldDef.timeUnit,
                field: 'date'
            };
        }
        return {
            data: model.dataTable(),
            field: model.field(channel),
            sort: {
                field: model.field(channel),
                op: 'min'
            }
        };
    }
    var stack = model.stack();
    if (stack && channel === stack.fieldChannel) {
        if (stack.offset === enums_1.StackOffset.NORMALIZE) {
            return [0, 1];
        }
        return {
            data: data_1.STACKED_SCALE,
            field: model.field(channel, { prefn: 'sum_' })
        };
    }
    var useRawDomain = _useRawDomain(scale, model, channel, scaleType), sort = domainSort(model, channel, scaleType);
    if (useRawDomain) {
        return {
            data: data_1.SOURCE,
            field: model.field(channel, { noAggregate: true })
        };
    }
    else if (fieldDef.bin) {
        return scaleType === 'ordinal' ? {
            data: model.dataTable(),
            field: model.field(channel, { binSuffix: '_range' }),
            sort: {
                field: model.field(channel, { binSuffix: '_start' }),
                op: 'min'
            }
        } : channel === channel_1.COLOR ? {
            data: model.dataTable(),
            field: model.field(channel, { binSuffix: '_start' })
        } : {
            data: model.dataTable(),
            field: [
                model.field(channel, { binSuffix: '_start' }),
                model.field(channel, { binSuffix: '_end' })
            ]
        };
    }
    else if (sort) {
        return {
            data: sort.op ? data_1.SOURCE : model.dataTable(),
            field: (fieldDef.type === type_1.ORDINAL && channel === channel_1.COLOR) ? model.field(channel, { prefn: 'rank_' }) : model.field(channel),
            sort: sort
        };
    }
    else {
        return {
            data: model.dataTable(),
            field: (fieldDef.type === type_1.ORDINAL && channel === channel_1.COLOR) ? model.field(channel, { prefn: 'rank_' }) : model.field(channel),
        };
    }
}
exports.domain = domain;
function domainSort(model, channel, scaleType) {
    if (scaleType !== 'ordinal') {
        return undefined;
    }
    var sort = model.sort(channel);
    if (util_1.contains(['ascending', 'descending', undefined], sort)) {
        return true;
    }
    if (typeof sort !== 'string') {
        return {
            op: sort.op,
            field: sort.field
        };
    }
    return undefined;
}
exports.domainSort = domainSort;
function _useRawDomain(scale, model, channel, scaleType) {
    var fieldDef = model.fieldDef(channel);
    return scale.useRawDomain &&
        fieldDef.aggregate &&
        aggregate_1.SHARED_DOMAIN_OPS.indexOf(fieldDef.aggregate) >= 0 &&
        ((fieldDef.type === type_1.QUANTITATIVE && !fieldDef.bin) ||
            (fieldDef.type === type_1.TEMPORAL && util_1.contains(['time', 'utc'], scaleType)));
}
function rangeMixins(scale, model, channel, scaleType) {
    var fieldDef = model.fieldDef(channel), scaleConfig = model.config().scale;
    if (scaleType === 'ordinal' && scale.bandSize && util_1.contains([channel_1.X, channel_1.Y], channel)) {
        return { bandSize: scale.bandSize };
    }
    if (scale.range && !util_1.contains([channel_1.X, channel_1.Y, channel_1.ROW, channel_1.COLUMN], channel)) {
        return { range: scale.range };
    }
    switch (channel) {
        case channel_1.X:
            return {
                rangeMin: 0,
                rangeMax: model.cellWidth()
            };
        case channel_1.Y:
            return {
                rangeMin: model.cellHeight(),
                rangeMax: 0
            };
        case channel_1.SIZE:
            if (model.is(mark_1.BAR)) {
                if (scaleConfig.barSizeRange !== undefined) {
                    return { range: scaleConfig.barSizeRange };
                }
                var dimension = model.config().mark.orient === 'horizontal' ? channel_1.Y : channel_1.X;
                return { range: [model.config().mark.barThinSize, model.scale(dimension).bandSize] };
            }
            else if (model.is(mark_1.TEXT)) {
                return { range: scaleConfig.fontSizeRange };
            }
            if (scaleConfig.pointSizeRange !== undefined) {
                return { range: scaleConfig.pointSizeRange };
            }
            var xIsMeasure = model.isMeasure(channel_1.X);
            var yIsMeasure = model.isMeasure(channel_1.Y);
            var bandSize = xIsMeasure !== yIsMeasure ?
                model.scale(xIsMeasure ? channel_1.Y : channel_1.X).bandSize :
                Math.min(model.scale(channel_1.X).bandSize || scaleConfig.bandSize, model.scale(channel_1.Y).bandSize || scaleConfig.bandSize);
            return { range: [9, (bandSize - 2) * (bandSize - 2)] };
        case channel_1.SHAPE:
            return { range: scaleConfig.shapeRange };
        case channel_1.COLOR:
            if (fieldDef.type === type_1.NOMINAL) {
                return { range: scaleConfig.nominalColorRange };
            }
            return { range: scaleConfig.sequentialColorRange };
        case channel_1.ROW:
            return { range: 'height' };
        case channel_1.COLUMN:
            return { range: 'width' };
    }
    return {};
}
exports.rangeMixins = rangeMixins;
function clamp(prop, scaleType) {
    if (util_1.contains(['linear', 'pow', 'sqrt', 'log', 'time', 'utc'], scaleType)) {
        return prop;
    }
    return undefined;
}
exports.clamp = clamp;
function exponent(prop, scaleType) {
    if (scaleType === 'pow') {
        return prop;
    }
    return undefined;
}
exports.exponent = exponent;
function nice(prop, scaleType, channel, fieldDef) {
    if (util_1.contains(['linear', 'pow', 'sqrt', 'log', 'time', 'utc', 'quantize'], scaleType)) {
        if (prop !== undefined) {
            return prop;
        }
        if (util_1.contains(['time', 'utc'], scaleType)) {
            return time_1.smallestUnit(fieldDef.timeUnit);
        }
        return util_1.contains([channel_1.X, channel_1.Y], channel);
    }
    return undefined;
}
exports.nice = nice;
function padding(prop, scaleType, channel) {
    if (scaleType === 'ordinal' && util_1.contains([channel_1.X, channel_1.Y], channel)) {
        return prop;
    }
    return undefined;
}
exports.padding = padding;
function points(__, scaleType, channel) {
    if (scaleType === 'ordinal' && util_1.contains([channel_1.X, channel_1.Y], channel)) {
        return true;
    }
    return undefined;
}
exports.points = points;
function round(prop, scaleType, channel) {
    if (util_1.contains([channel_1.X, channel_1.Y, channel_1.ROW, channel_1.COLUMN, channel_1.SIZE], channel) && prop !== undefined) {
        return prop;
    }
    return undefined;
}
exports.round = round;
function zero(prop, scaleType, channel, fieldDef) {
    if (!util_1.contains(['time', 'utc', 'ordinal'], scaleType)) {
        if (prop !== undefined) {
            return prop;
        }
        return !fieldDef.bin && util_1.contains([channel_1.X, channel_1.Y], channel);
    }
    return undefined;
}
exports.zero = zero;
//# sourceMappingURL=scale.js.map