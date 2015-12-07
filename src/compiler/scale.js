var util_1 = require('../util');
var aggregate_1 = require('../aggregate');
var channel_1 = require('../channel');
var data_1 = require('../data');
var time = require('./time');
var type_1 = require('../type');
var mark_1 = require('../mark');
function compileScales(names, model) {
    return names.reduce(function (a, channel) {
        var scaleDef = {
            name: channel,
            type: type(channel, model),
        };
        scaleDef.domain = domain(model, channel, scaleDef.type);
        util_1.extend(scaleDef, rangeMixins(model, channel, scaleDef.type));
        [
            'reverse', 'round',
            'clamp', 'nice',
            'exponent', 'zero',
            'bandWidth', 'outerPadding', 'padding', 'points'
        ].forEach(function (property) {
            var value = exports[property](model, channel, scaleDef.type);
            if (value !== undefined) {
                scaleDef[property] = value;
            }
        });
        return (a.push(scaleDef), a);
    }, []);
}
exports.compileScales = compileScales;
function type(channel, model) {
    var fieldDef = model.fieldDef(channel);
    switch (fieldDef.type) {
        case type_1.NOMINAL:
            return 'ordinal';
        case type_1.ORDINAL:
            var range = fieldDef.scale.range;
            return channel === channel_1.COLOR && (typeof range !== 'string') ? 'linear' : 'ordinal';
        case type_1.TEMPORAL:
            return time.scale.type(fieldDef.timeUnit, channel);
        case type_1.QUANTITATIVE:
            if (fieldDef.bin) {
                return channel === channel_1.ROW || channel === channel_1.COLUMN || channel === channel_1.SHAPE ? 'ordinal' : 'linear';
            }
            return fieldDef.scale.type;
    }
}
exports.type = type;
function domain(model, channel, type) {
    var fieldDef = model.fieldDef(channel);
    if (fieldDef.scale.domain) {
        return fieldDef.scale.domain;
    }
    if (fieldDef.type === type_1.TEMPORAL) {
        var range = time.scale.domain(fieldDef.timeUnit, channel);
        if (range) {
            return range;
        }
    }
    var stack = model.stack();
    if (stack && channel === stack.fieldChannel) {
        var facet = model.has(channel_1.ROW) || model.has(channel_1.COLUMN);
        return {
            data: data_1.STACKED,
            field: model.field(channel, {
                prefn: (facet ? 'max_' : '') + 'sum_'
            })
        };
    }
    var useRawDomain = _useRawDomain(model, channel);
    var sort = domainSort(model, channel, type);
    if (useRawDomain) {
        return {
            data: data_1.SOURCE,
            field: model.field(channel, { noAggregate: true })
        };
    }
    else if (fieldDef.bin) {
        return {
            data: model.dataTable(),
            field: type === 'ordinal' ?
                model.field(channel, { binSuffix: '_start' }) :
                [
                    model.field(channel, { binSuffix: '_start' }),
                    model.field(channel, { binSuffix: '_end' })
                ]
        };
    }
    else if (sort) {
        return {
            data: sort.op ? data_1.SOURCE : model.dataTable(),
            field: model.field(channel),
            sort: sort
        };
    }
    else {
        return {
            data: model.dataTable(),
            field: model.field(channel)
        };
    }
}
exports.domain = domain;
function domainSort(model, channel, type) {
    var sort = model.fieldDef(channel).sort;
    if (sort === 'ascending' || sort === 'descending') {
        return true;
    }
    if (type === 'ordinal' && typeof sort !== 'string') {
        return {
            op: sort.op,
            field: sort.field
        };
    }
    return undefined;
}
exports.domainSort = domainSort;
function reverse(model, channel) {
    var sort = model.fieldDef(channel).sort;
    return sort && (typeof sort === 'string' ?
        sort === 'descending' :
        sort.order === 'descending') ? true : undefined;
}
exports.reverse = reverse;
function _useRawDomain(model, channel) {
    var fieldDef = model.fieldDef(channel);
    return fieldDef.scale.useRawDomain &&
        fieldDef.aggregate &&
        aggregate_1.SHARED_DOMAIN_OPS.indexOf(fieldDef.aggregate) >= 0 &&
        ((fieldDef.type === type_1.QUANTITATIVE && !fieldDef.bin) ||
            (fieldDef.type === type_1.TEMPORAL &&
                (!fieldDef.timeUnit || time.scale.type(fieldDef.timeUnit, channel) === 'linear')));
}
exports._useRawDomain = _useRawDomain;
function bandWidth(model, channel, scaleType) {
    if (scaleType === 'ordinal') {
        return model.fieldDef(channel).scale.bandWidth;
    }
    return undefined;
}
exports.bandWidth = bandWidth;
function clamp(model, channel) {
    return model.fieldDef(channel).scale.clamp;
}
exports.clamp = clamp;
function exponent(model, channel) {
    return model.fieldDef(channel).scale.exponent;
}
exports.exponent = exponent;
function nice(model, channel, scaleType) {
    if (model.fieldDef(channel).scale.nice !== undefined) {
        return model.fieldDef(channel).scale.nice;
    }
    switch (channel) {
        case channel_1.X:
        case channel_1.Y:
            if (scaleType === 'time' || scaleType === 'ordinal') {
                return undefined;
            }
            return true;
        case channel_1.ROW:
        case channel_1.COLUMN:
            return true;
    }
    return undefined;
}
exports.nice = nice;
function outerPadding(model, channel, scaleType) {
    if (scaleType === 'ordinal') {
        if (model.fieldDef(channel).scale.outerPadding !== undefined) {
            return model.fieldDef(channel).scale.outerPadding;
        }
    }
    return undefined;
}
exports.outerPadding = outerPadding;
function padding(model, channel, scaleType) {
    if (scaleType === 'ordinal') {
        return model.fieldDef(channel).scale.padding;
    }
    return undefined;
}
exports.padding = padding;
function points(model, channel, scaleType) {
    if (scaleType === 'ordinal') {
        if (model.fieldDef(channel).scale.points !== undefined) {
            return model.fieldDef(channel).scale.points;
        }
        switch (channel) {
            case channel_1.X:
            case channel_1.Y:
                return true;
        }
    }
    return undefined;
}
exports.points = points;
function rangeMixins(model, channel, scaleType) {
    var fieldDef = model.fieldDef(channel);
    if (fieldDef.scale.range) {
        return { range: fieldDef.scale.range };
    }
    switch (channel) {
        case channel_1.X:
            return { rangeMin: 0, rangeMax: model.layout().cellWidth };
        case channel_1.Y:
            if (scaleType === 'ordinal') {
                return { rangeMin: 0, rangeMax: model.layout().cellHeight };
            }
            return { rangeMin: model.layout().cellHeight, rangeMax: 0 };
        case channel_1.SIZE:
            if (model.is(mark_1.BAR)) {
                return {
                    range: [3, Math.max(model.fieldDef(channel_1.X).scale.bandWidth, model.fieldDef(channel_1.Y).scale.bandWidth)]
                };
            }
            else if (model.is(mark_1.TEXT)) {
                return { range: [8, 40] };
            }
            var bandWidth = Math.min(model.fieldDef(channel_1.X).scale.bandWidth, model.fieldDef(channel_1.Y).scale.bandWidth) - 1;
            return { range: [10, 0.8 * bandWidth * bandWidth] };
        case channel_1.SHAPE:
            return { range: 'shapes' };
        case channel_1.COLOR:
            if (scaleType === 'ordinal') {
                return { range: 'category10' };
            }
            else {
                return { range: ['#AFC6A3', '#09622A'] };
            }
        case channel_1.ROW:
            return { range: 'height' };
        case channel_1.COLUMN:
            return { range: 'width' };
    }
    return {};
}
exports.rangeMixins = rangeMixins;
function round(model, channel) {
    if (model.fieldDef(channel).scale.round !== undefined) {
        return model.fieldDef(channel).scale.round;
    }
    switch (channel) {
        case channel_1.X:
        case channel_1.Y:
        case channel_1.ROW:
        case channel_1.COLUMN:
        case channel_1.SIZE:
            return true;
    }
    return undefined;
}
exports.round = round;
function zero(model, channel) {
    var fieldDef = model.fieldDef(channel);
    var timeUnit = fieldDef.timeUnit;
    if (fieldDef.scale.zero !== undefined) {
        return fieldDef.scale.zero;
    }
    if (fieldDef.type === type_1.TEMPORAL) {
        if (timeUnit === 'year') {
            return false;
        }
        return undefined;
    }
    if (fieldDef.bin) {
        return false;
    }
    return channel === channel_1.X || channel === channel_1.Y ?
        undefined :
        false;
}
exports.zero = zero;
//# sourceMappingURL=scale.js.map