"use strict";
var channel_1 = require('../channel');
var fielddef_1 = require('../fielddef');
var sort_1 = require('../sort');
var type_1 = require('../type');
var time_1 = require('./time');
var util_1 = require('../util');
exports.FILL_STROKE_CONFIG = ['fill', 'fillOpacity',
    'stroke', 'strokeWidth', 'strokeDash', 'strokeDashOffset', 'strokeOpacity',
    'opacity'];
function applyColorAndOpacity(p, model) {
    var filled = model.config().mark.filled;
    var fieldDef = model.fieldDef(channel_1.COLOR);
    applyMarkConfig(p, model, exports.FILL_STROKE_CONFIG);
    var value;
    if (model.has(channel_1.COLOR)) {
        value = {
            scale: model.scaleName(channel_1.COLOR),
            field: model.field(channel_1.COLOR, fieldDef.type === type_1.ORDINAL ? { prefn: 'rank_' } : {})
        };
    }
    else if (fieldDef && fieldDef.value) {
        value = { value: fieldDef.value };
    }
    if (value !== undefined) {
        if (filled) {
            p.fill = value;
        }
        else {
            p.stroke = value;
        }
    }
    else {
        p[filled ? 'fill' : 'stroke'] = p[filled ? 'fill' : 'stroke'] ||
            { value: model.config().mark.color };
    }
}
exports.applyColorAndOpacity = applyColorAndOpacity;
function applyConfig(properties, config, propsList) {
    propsList.forEach(function (property) {
        var value = config[property];
        if (value !== undefined) {
            properties[property] = { value: value };
        }
    });
}
exports.applyConfig = applyConfig;
function applyMarkConfig(marksProperties, model, propsList) {
    applyConfig(marksProperties, model.config().mark, propsList);
}
exports.applyMarkConfig = applyMarkConfig;
function formatMixins(model, channel, format) {
    var fieldDef = model.fieldDef(channel);
    if (!util_1.contains([type_1.QUANTITATIVE, type_1.TEMPORAL], fieldDef.type)) {
        return {};
    }
    var def = {};
    if (fieldDef.type === type_1.TEMPORAL) {
        def.formatType = 'time';
    }
    if (format !== undefined) {
        def.format = format;
    }
    else {
        switch (fieldDef.type) {
            case type_1.QUANTITATIVE:
                def.format = model.config().numberFormat;
                break;
            case type_1.TEMPORAL:
                def.format = timeFormat(model, channel) || model.config().timeFormat;
                break;
        }
    }
    if (channel === channel_1.TEXT) {
        var filter = (def.formatType || 'number') + (def.format ? ':\'' + def.format + '\'' : '');
        return {
            text: {
                template: '{{' + model.field(channel, { datum: true }) + ' | ' + filter + '}}'
            }
        };
    }
    return def;
}
exports.formatMixins = formatMixins;
function isAbbreviated(model, channel, fieldDef) {
    switch (channel) {
        case channel_1.ROW:
        case channel_1.COLUMN:
        case channel_1.X:
        case channel_1.Y:
            return model.axis(channel).shortTimeLabels;
        case channel_1.COLOR:
        case channel_1.SHAPE:
        case channel_1.SIZE:
            return model.legend(channel).shortTimeLabels;
        case channel_1.TEXT:
            return model.config().mark.shortTimeLabels;
        case channel_1.LABEL:
    }
    return false;
}
function sortField(orderChannelDef) {
    return (orderChannelDef.sort === sort_1.SortOrder.DESCENDING ? '-' : '') + fielddef_1.field(orderChannelDef);
}
exports.sortField = sortField;
function timeFormat(model, channel) {
    var fieldDef = model.fieldDef(channel);
    return time_1.format(fieldDef.timeUnit, isAbbreviated(model, channel, fieldDef));
}
exports.timeFormat = timeFormat;
//# sourceMappingURL=common.js.map