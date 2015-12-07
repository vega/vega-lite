var util_1 = require('../util');
var channel_1 = require('../channel');
var time = require('./time');
var type_1 = require('../type');
var mark_1 = require('../mark');
function compileLegends(model) {
    var defs = [];
    if (model.has(channel_1.COLOR) && model.fieldDef(channel_1.COLOR).legend) {
        defs.push(compileLegend(model, channel_1.COLOR, {
            fill: channel_1.COLOR
        }));
    }
    if (model.has(channel_1.SIZE) && model.fieldDef(channel_1.SIZE).legend) {
        defs.push(compileLegend(model, channel_1.SIZE, {
            size: channel_1.SIZE
        }));
    }
    if (model.has(channel_1.SHAPE) && model.fieldDef(channel_1.SHAPE).legend) {
        defs.push(compileLegend(model, channel_1.SHAPE, {
            shape: channel_1.SHAPE
        }));
    }
    return defs;
}
exports.compileLegends = compileLegends;
function compileLegend(model, channel, def) {
    var legend = model.fieldDef(channel).legend;
    def.title = title(model, channel);
    ['orient', 'format', 'values'].forEach(function (property) {
        var value = legend[property];
        if (value !== undefined) {
            def[property] = value;
        }
    });
    var props = (typeof legend !== 'boolean' && legend.properties) || {};
    ['title', 'labels', 'symbols', 'legend'].forEach(function (group) {
        var value = properties[group] ?
            properties[group](model, channel, props[group]) :
            props[group];
        if (value !== undefined) {
            def.properties = def.properties || {};
            def.properties[group] = value;
        }
    });
    return def;
}
exports.compileLegend = compileLegend;
function title(model, channel) {
    var legend = model.fieldDef(channel).legend;
    if (typeof legend !== 'boolean' && legend.title) {
        return legend.title;
    }
    return model.fieldTitle(channel);
}
exports.title = title;
var properties;
(function (properties) {
    function labels(model, channel, spec) {
        var fieldDef = model.fieldDef(channel);
        var timeUnit = fieldDef.timeUnit;
        if (fieldDef.type === type_1.TEMPORAL && timeUnit && time.labelTemplate(timeUnit)) {
            return util_1.extend({
                text: {
                    template: '{{datum.data | ' + time.labelTemplate(timeUnit) + '}}'
                }
            }, spec || {});
        }
        return spec;
    }
    properties.labels = labels;
    function symbols(model, channel, spec) {
        var symbols = {};
        var mark = model.mark();
        switch (mark) {
            case mark_1.BAR:
            case mark_1.TICK:
            case mark_1.TEXT:
                symbols.stroke = { value: 'transparent' };
                symbols.shape = { value: 'square' };
                break;
            case mark_1.CIRCLE:
            case mark_1.SQUARE:
                symbols.shape = { value: mark };
            case mark_1.POINT:
                if (model.config('marks').filled) {
                    if (model.has(channel_1.COLOR) && channel === channel_1.COLOR) {
                        symbols.fill = { scale: channel_1.COLOR, field: 'data' };
                    }
                    else {
                        symbols.fill = { value: model.fieldDef(channel_1.COLOR).value };
                    }
                    symbols.stroke = { value: 'transparent' };
                }
                else {
                    if (model.has(channel_1.COLOR) && channel === channel_1.COLOR) {
                        symbols.stroke = { scale: channel_1.COLOR, field: 'data' };
                    }
                    else {
                        symbols.stroke = { value: model.fieldDef(channel_1.COLOR).value };
                    }
                    symbols.fill = { value: 'transparent' };
                    symbols.strokeWidth = { value: model.config('marks').strokeWidth };
                }
                break;
            case mark_1.LINE:
            case mark_1.AREA:
                break;
        }
        var opacity = model.markOpacity();
        if (opacity) {
            symbols.opacity = { value: opacity };
        }
        symbols = util_1.extend(symbols, spec || {});
        return util_1.keys(symbols).length > 0 ? symbols : undefined;
    }
    properties.symbols = symbols;
})(properties || (properties = {}));
//# sourceMappingURL=legend.js.map