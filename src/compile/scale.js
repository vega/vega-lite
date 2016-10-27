"use strict";
var aggregate_1 = require('../aggregate');
var channel_1 = require('../channel');
var config_1 = require('../config');
var data_1 = require('../data');
var datetime_1 = require('../datetime');
var fielddef_1 = require('../fielddef');
var mark_1 = require('../mark');
var scale_1 = require('../scale');
var sort_1 = require('../sort');
var stack_1 = require('../stack');
var type_1 = require('../type');
var util_1 = require('../util');
var timeunit_1 = require('../timeunit');
exports.COLOR_LEGEND = 'color_legend';
exports.COLOR_LEGEND_LABEL = 'color_legend_label';
function parseScaleComponent(model) {
    return model.channels().reduce(function (scale, channel) {
        if (model.scale(channel)) {
            var fieldDef = model.fieldDef(channel);
            var scales = {
                main: parseMainScale(model, fieldDef, channel)
            };
            if (channel === channel_1.COLOR && model.legend(channel_1.COLOR) && (fieldDef.type === type_1.ORDINAL || fieldDef.bin || fieldDef.timeUnit)) {
                scales.colorLegend = parseColorLegendScale(model, fieldDef);
                if (fieldDef.bin) {
                    scales.binColorLegend = parseBinColorLegendLabel(model, fieldDef);
                }
            }
            scale[channel] = scales;
        }
        return scale;
    }, {});
}
exports.parseScaleComponent = parseScaleComponent;
function parseMainScale(model, fieldDef, channel) {
    var scale = model.scale(channel);
    var sort = model.sort(channel);
    var scaleDef = {
        name: model.scaleName(channel + '', true),
        type: scale.type,
    };
    if (channel === channel_1.X && model.has(channel_1.X2)) {
        if (model.has(channel_1.X)) {
            scaleDef.domain = { fields: [domain(scale, model, channel_1.X), domain(scale, model, channel_1.X2)] };
        }
        else {
            scaleDef.domain = domain(scale, model, channel_1.X2);
        }
    }
    else if (channel === channel_1.Y && model.has(channel_1.Y2)) {
        if (model.has(channel_1.Y)) {
            scaleDef.domain = { fields: [domain(scale, model, channel_1.Y), domain(scale, model, channel_1.Y2)] };
        }
        else {
            scaleDef.domain = domain(scale, model, channel_1.Y2);
        }
    }
    else {
        scaleDef.domain = domain(scale, model, channel);
    }
    util_1.extend(scaleDef, rangeMixins(scale, model, channel));
    if (sort && (sort_1.isSortField(sort) ? sort.order : sort) === sort_1.SortOrder.DESCENDING) {
        scaleDef.reverse = true;
    }
    [
        'round',
        'clamp', 'nice',
        'exponent', 'zero',
        'points',
        'padding'
    ].forEach(function (property) {
        var value = exports[property](scale, channel, fieldDef, model, scaleDef);
        if (value !== undefined) {
            scaleDef[property] = value;
        }
    });
    return scaleDef;
}
function parseColorLegendScale(model, fieldDef) {
    return {
        name: model.scaleName(exports.COLOR_LEGEND, true),
        type: scale_1.ScaleType.ORDINAL,
        domain: {
            data: model.dataTable(),
            field: model.field(channel_1.COLOR, (fieldDef.bin || fieldDef.timeUnit) ? {} : { prefix: 'rank' }),
            sort: true
        },
        range: { data: model.dataTable(), field: model.field(channel_1.COLOR), sort: true }
    };
}
function parseBinColorLegendLabel(model, fieldDef) {
    return {
        name: model.scaleName(exports.COLOR_LEGEND_LABEL, true),
        type: scale_1.ScaleType.ORDINAL,
        domain: {
            data: model.dataTable(),
            field: model.field(channel_1.COLOR),
            sort: true
        },
        range: {
            data: model.dataTable(),
            field: fielddef_1.field(fieldDef, { binSuffix: 'range' }),
            sort: {
                field: model.field(channel_1.COLOR, { binSuffix: 'start' }),
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
        if (scale && scale.type !== undefined && scale.type !== scale_1.ScaleType.ORDINAL) {
            console.warn('Channel', channel, 'does not work with scale type =', scale.type);
        }
        return scale_1.ScaleType.ORDINAL;
    }
    if (scale.type !== undefined) {
        return scale.type;
    }
    switch (fieldDef.type) {
        case type_1.NOMINAL:
            return scale_1.ScaleType.ORDINAL;
        case type_1.ORDINAL:
            if (channel === channel_1.COLOR) {
                return scale_1.ScaleType.LINEAR;
            }
            return scale_1.ScaleType.ORDINAL;
        case type_1.TEMPORAL:
            if (channel === channel_1.COLOR) {
                return scale_1.ScaleType.TIME;
            }
            if (fieldDef.timeUnit) {
                return timeunit_1.defaultScaleType(fieldDef.timeUnit);
            }
            return scale_1.ScaleType.TIME;
        case type_1.QUANTITATIVE:
            if (fieldDef.bin) {
                return util_1.contains([channel_1.X, channel_1.Y, channel_1.COLOR], channel) ? scale_1.ScaleType.LINEAR : scale_1.ScaleType.ORDINAL;
            }
            return scale_1.ScaleType.LINEAR;
    }
    return null;
}
exports.scaleType = scaleType;
function scaleBandSize(scaleType, bandSize, scaleConfig, topLevelSize, mark, channel) {
    if (scaleType === scale_1.ScaleType.ORDINAL) {
        if (topLevelSize === undefined) {
            if (bandSize) {
                return bandSize;
            }
            else if (channel === channel_1.X && mark === mark_1.TEXT) {
                return scaleConfig.textBandWidth;
            }
            else {
                return scaleConfig.bandSize;
            }
        }
        else {
            if (bandSize) {
                console.warn('bandSize for', channel, 'overridden as top-level', channel === channel_1.X ? 'width' : 'height', 'is provided.');
            }
            return scale_1.BANDSIZE_FIT;
        }
    }
    else {
        return undefined;
    }
}
exports.scaleBandSize = scaleBandSize;
function domain(scale, model, channel) {
    var fieldDef = model.fieldDef(channel);
    if (scale.domain) {
        if (datetime_1.isDateTime(scale.domain[0])) {
            return scale.domain.map(function (dt) {
                return datetime_1.timestamp(dt, true);
            });
        }
        return scale.domain;
    }
    if (fieldDef.type === type_1.TEMPORAL) {
        if (timeunit_1.imputedDomain(fieldDef.timeUnit, channel)) {
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
        if (stack.offset === stack_1.StackOffset.NORMALIZE) {
            return [0, 1];
        }
        return {
            data: model.dataName(data_1.STACKED_SCALE),
            field: model.field(channel, { prefix: 'sum' })
        };
    }
    var useRawDomain = _useRawDomain(scale, model, channel), sort = domainSort(model, channel, scale.type);
    if (useRawDomain) {
        return {
            data: data_1.SOURCE,
            field: model.field(channel, { noAggregate: true })
        };
    }
    else if (fieldDef.bin) {
        if (scale.type === scale_1.ScaleType.ORDINAL) {
            return {
                data: model.dataTable(),
                field: model.field(channel, { binSuffix: 'range' }),
                sort: {
                    field: model.field(channel, { binSuffix: 'start' }),
                    op: 'min'
                }
            };
        }
        else if (channel === channel_1.COLOR) {
            return {
                data: model.dataTable(),
                field: model.field(channel, { binSuffix: 'start' })
            };
        }
        else {
            return {
                data: model.dataTable(),
                field: [
                    model.field(channel, { binSuffix: 'start' }),
                    model.field(channel, { binSuffix: 'end' })
                ]
            };
        }
    }
    else if (sort) {
        return {
            data: sort.op ? data_1.SOURCE : model.dataTable(),
            field: (fieldDef.type === type_1.ORDINAL && channel === channel_1.COLOR) ? model.field(channel, { prefix: 'rank' }) : model.field(channel),
            sort: sort
        };
    }
    else {
        return {
            data: model.dataTable(),
            field: (fieldDef.type === type_1.ORDINAL && channel === channel_1.COLOR) ? model.field(channel, { prefix: 'rank' }) : model.field(channel),
        };
    }
}
exports.domain = domain;
function domainSort(model, channel, scaleType) {
    if (scaleType !== scale_1.ScaleType.ORDINAL) {
        return undefined;
    }
    var sort = model.sort(channel);
    if (sort_1.isSortField(sort)) {
        return {
            op: sort.op,
            field: sort.field
        };
    }
    if (util_1.contains([sort_1.SortOrder.ASCENDING, sort_1.SortOrder.DESCENDING, undefined], sort)) {
        return true;
    }
    return undefined;
}
exports.domainSort = domainSort;
function _useRawDomain(scale, model, channel) {
    var fieldDef = model.fieldDef(channel);
    return scale.useRawDomain &&
        fieldDef.aggregate &&
        aggregate_1.SHARED_DOMAIN_OPS.indexOf(fieldDef.aggregate) >= 0 &&
        ((fieldDef.type === type_1.QUANTITATIVE && !fieldDef.bin && scale.type !== scale_1.ScaleType.LOG) ||
            (fieldDef.type === type_1.TEMPORAL && util_1.contains([scale_1.ScaleType.TIME, scale_1.ScaleType.UTC], scale.type)));
}
function rangeMixins(scale, model, channel) {
    var fieldDef = model.fieldDef(channel);
    var scaleConfig = model.config().scale;
    if (scale.type === scale_1.ScaleType.ORDINAL && scale.bandSize && scale.bandSize !== scale_1.BANDSIZE_FIT && util_1.contains([channel_1.X, channel_1.Y], channel)) {
        return { bandSize: scale.bandSize };
    }
    if (scale.range && !util_1.contains([channel_1.X, channel_1.Y, channel_1.ROW, channel_1.COLUMN], channel)) {
        return { range: scale.range };
    }
    switch (channel) {
        case channel_1.ROW:
            return { range: 'height' };
        case channel_1.COLUMN:
            return { range: 'width' };
    }
    var unitModel = model;
    switch (channel) {
        case channel_1.X:
            return {
                rangeMin: 0,
                rangeMax: unitModel.width
            };
        case channel_1.Y:
            return {
                rangeMin: unitModel.height,
                rangeMax: 0
            };
        case channel_1.SIZE:
            if (unitModel.mark() === mark_1.BAR) {
                if (scaleConfig.barSizeRange !== undefined) {
                    return { range: scaleConfig.barSizeRange };
                }
                var dimension = model.config().mark.orient === config_1.Orient.HORIZONTAL ? channel_1.Y : channel_1.X;
                return { range: [model.config().mark.barThinSize, model.scale(dimension).bandSize] };
            }
            else if (unitModel.mark() === mark_1.TEXT) {
                return { range: scaleConfig.fontSizeRange };
            }
            else if (unitModel.mark() === mark_1.RULE) {
                return { range: scaleConfig.ruleSizeRange };
            }
            else if (unitModel.mark() === mark_1.TICK) {
                return { range: scaleConfig.tickSizeRange };
            }
            if (scaleConfig.pointSizeRange !== undefined) {
                return { range: scaleConfig.pointSizeRange };
            }
            var bandSize = pointBandSize(unitModel);
            return { range: [9, (bandSize - 2) * (bandSize - 2)] };
        case channel_1.SHAPE:
            return { range: scaleConfig.shapeRange };
        case channel_1.COLOR:
            if (fieldDef.type === type_1.NOMINAL) {
                return { range: scaleConfig.nominalColorRange };
            }
            return { range: scaleConfig.sequentialColorRange };
        case channel_1.OPACITY:
            return { range: scaleConfig.opacity };
    }
    return {};
}
exports.rangeMixins = rangeMixins;
function pointBandSize(model) {
    var scaleConfig = model.config().scale;
    var hasX = model.has(channel_1.X);
    var hasY = model.has(channel_1.Y);
    var xIsMeasure = fielddef_1.isMeasure(model.encoding().x);
    var yIsMeasure = fielddef_1.isMeasure(model.encoding().y);
    if (hasX && hasY) {
        return xIsMeasure !== yIsMeasure ?
            model.scale(xIsMeasure ? channel_1.Y : channel_1.X).bandSize :
            Math.min(model.scale(channel_1.X).bandSize || scaleConfig.bandSize, model.scale(channel_1.Y).bandSize || scaleConfig.bandSize);
    }
    else if (hasY) {
        return yIsMeasure ? model.config().scale.bandSize : model.scale(channel_1.Y).bandSize;
    }
    else if (hasX) {
        return xIsMeasure ? model.config().scale.bandSize : model.scale(channel_1.X).bandSize;
    }
    return model.config().scale.bandSize;
}
function clamp(scale) {
    if (util_1.contains([scale_1.ScaleType.LINEAR, scale_1.ScaleType.POW, scale_1.ScaleType.SQRT,
        scale_1.ScaleType.LOG, scale_1.ScaleType.TIME, scale_1.ScaleType.UTC], scale.type)) {
        return scale.clamp;
    }
    return undefined;
}
exports.clamp = clamp;
function exponent(scale) {
    if (scale.type === scale_1.ScaleType.POW) {
        return scale.exponent;
    }
    return undefined;
}
exports.exponent = exponent;
function nice(scale, channel, fieldDef) {
    if (util_1.contains([scale_1.ScaleType.LINEAR, scale_1.ScaleType.POW, scale_1.ScaleType.SQRT, scale_1.ScaleType.LOG,
        scale_1.ScaleType.TIME, scale_1.ScaleType.UTC, scale_1.ScaleType.QUANTIZE], scale.type)) {
        if (scale.nice !== undefined) {
            return scale.nice;
        }
        if (util_1.contains([scale_1.ScaleType.TIME, scale_1.ScaleType.UTC], scale.type)) {
            return timeunit_1.smallestUnit(fieldDef.timeUnit);
        }
        return util_1.contains([channel_1.X, channel_1.Y], channel);
    }
    return undefined;
}
exports.nice = nice;
function padding(scale, channel, __, ___, scaleDef) {
    if (scale.type === scale_1.ScaleType.ORDINAL && util_1.contains([channel_1.X, channel_1.Y], channel)) {
        return scaleDef.points ? 1 : scale.padding;
    }
    return undefined;
}
exports.padding = padding;
function points(scale, channel, __, model) {
    if (scale.type === scale_1.ScaleType.ORDINAL && util_1.contains([channel_1.X, channel_1.Y], channel)) {
        return model.mark() === mark_1.BAR && scale.bandSize === scale_1.BANDSIZE_FIT ? undefined : true;
    }
    return undefined;
}
exports.points = points;
function round(scale, channel) {
    if (util_1.contains([channel_1.X, channel_1.Y, channel_1.ROW, channel_1.COLUMN, channel_1.SIZE], channel) && scale.round !== undefined) {
        return scale.round;
    }
    return undefined;
}
exports.round = round;
function zero(scale, channel, fieldDef) {
    if (!util_1.contains([scale_1.ScaleType.TIME, scale_1.ScaleType.UTC, scale_1.ScaleType.ORDINAL], scale.type)) {
        if (scale.zero !== undefined) {
            return scale.zero;
        }
        return !scale.domain && !fieldDef.bin && util_1.contains([channel_1.X, channel_1.Y], channel);
    }
    return undefined;
}
exports.zero = zero;
//# sourceMappingURL=scale.js.map