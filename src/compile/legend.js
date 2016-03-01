"use strict";
var channel_1 = require('../channel');
var fielddef_1 = require('../fielddef');
var mark_1 = require('../mark');
var util_1 = require('../util');
var common_1 = require('./common');
var type_1 = require('../type');
var scale_1 = require('./scale');
function compileLegends(model) {
    var defs = [];
    if (model.has(channel_1.COLOR) && model.legend(channel_1.COLOR)) {
        var fieldDef = model.fieldDef(channel_1.COLOR);
        var scale = model.scaleName(useColorLegendScale(fieldDef) ?
            scale_1.COLOR_LEGEND :
            channel_1.COLOR);
        var def = model.config().mark.filled ? { fill: scale } : { stroke: scale };
        defs.push(compileLegend(model, channel_1.COLOR, def));
    }
    if (model.has(channel_1.SIZE) && model.legend(channel_1.SIZE)) {
        defs.push(compileLegend(model, channel_1.SIZE, {
            size: model.scaleName(channel_1.SIZE)
        }));
    }
    if (model.has(channel_1.SHAPE) && model.legend(channel_1.SHAPE)) {
        defs.push(compileLegend(model, channel_1.SHAPE, {
            shape: model.scaleName(channel_1.SHAPE)
        }));
    }
    return defs;
}
exports.compileLegends = compileLegends;
function compileLegend(model, channel, def) {
    var fieldDef = model.fieldDef(channel);
    var legend = model.legend(channel);
    def.title = title(legend, fieldDef);
    util_1.extend(def, formatMixins(legend, model, channel));
    ['orient', 'values'].forEach(function (property) {
        var value = legend[property];
        if (value !== undefined) {
            def[property] = value;
        }
    });
    var props = (typeof legend !== 'boolean' && legend.properties) || {};
    ['title', 'symbols', 'legend', 'labels'].forEach(function (group) {
        var value = properties[group] ?
            properties[group](fieldDef, props[group], model, channel) :
            props[group];
        if (value !== undefined) {
            def.properties = def.properties || {};
            def.properties[group] = value;
        }
    });
    return def;
}
exports.compileLegend = compileLegend;
function title(legend, fieldDef) {
    if (typeof legend !== 'boolean' && legend.title) {
        return legend.title;
    }
    return fielddef_1.title(fieldDef);
}
exports.title = title;
function formatMixins(legend, model, channel) {
    var fieldDef = model.fieldDef(channel);
    if (fieldDef.bin) {
        return {};
    }
    return common_1.formatMixins(model, channel, typeof legend !== 'boolean' ? legend.format : undefined);
}
exports.formatMixins = formatMixins;
function useColorLegendScale(fieldDef) {
    return fieldDef.type === type_1.ORDINAL || fieldDef.bin || fieldDef.timeUnit;
}
exports.useColorLegendScale = useColorLegendScale;
var properties;
(function (properties) {
    function symbols(fieldDef, symbolsSpec, model, channel) {
        var symbols = {};
        var mark = model.mark();
        switch (mark) {
            case mark_1.BAR:
            case mark_1.TICK:
            case mark_1.TEXT:
                symbols.shape = { value: 'square' };
                break;
            case mark_1.CIRCLE:
            case mark_1.SQUARE:
                symbols.shape = { value: mark };
                break;
            case mark_1.POINT:
            case mark_1.LINE:
            case mark_1.AREA:
                break;
        }
        var filled = model.config().mark.filled;
        common_1.applyMarkConfig(symbols, model, util_1.without(common_1.FILL_STROKE_CONFIG, [filled ? 'fill' : 'stroke']));
        if (filled) {
            symbols.strokeWidth = { value: 0 };
        }
        var value;
        if (model.has(channel_1.COLOR) && channel === channel_1.COLOR) {
            if (useColorLegendScale(fieldDef)) {
                value = { scale: model.scaleName(channel_1.COLOR), field: 'data' };
            }
        }
        else if (model.fieldDef(channel_1.COLOR).value) {
            value = { value: model.fieldDef(channel_1.COLOR).value };
        }
        if (value !== undefined) {
            if (filled) {
                symbols.fill = value;
            }
            else {
                symbols.stroke = value;
            }
        }
        else if (channel !== channel_1.COLOR) {
            symbols[filled ? 'fill' : 'stroke'] = symbols[filled ? 'fill' : 'stroke'] ||
                { value: model.config().mark.color };
        }
        symbols = util_1.extend(symbols, symbolsSpec || {});
        return util_1.keys(symbols).length > 0 ? symbols : undefined;
    }
    properties.symbols = symbols;
    function labels(fieldDef, symbolsSpec, model, channel) {
        if (channel === channel_1.COLOR) {
            if (fieldDef.type === type_1.ORDINAL) {
                return {
                    text: {
                        scale: model.scaleName(scale_1.COLOR_LEGEND),
                        field: 'data'
                    }
                };
            }
            else if (fieldDef.bin) {
                return {
                    text: {
                        scale: model.scaleName(scale_1.COLOR_LEGEND_LABEL),
                        field: 'data'
                    }
                };
            }
            else if (fieldDef.timeUnit) {
                return {
                    text: {
                        template: '{{ datum.data | time:\'' + common_1.timeFormat(model, channel) + '\'}}'
                    }
                };
            }
        }
        return undefined;
    }
    properties.labels = labels;
})(properties || (properties = {}));
//# sourceMappingURL=legend.js.map