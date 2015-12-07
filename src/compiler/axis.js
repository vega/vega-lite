var util_1 = require('../util');
var type_1 = require('../type');
var channel_1 = require('../channel');
var time = require('./time');
function compileAxis(channel, model) {
    var isCol = channel === channel_1.COLUMN, isRow = channel === channel_1.ROW, type = isCol ? 'x' : isRow ? 'y' : channel;
    var def = {
        type: type,
        scale: channel
    };
    [
        'format', 'grid', 'layer', 'orient', 'tickSize', 'ticks', 'title',
        'offset', 'tickPadding', 'tickSize', 'tickSizeMajor', 'tickSizeMinor', 'tickSizeEnd',
        'titleOffset', 'values', 'subdivide'
    ].forEach(function (property) {
        var method;
        var value = (method = exports[property]) ?
            method(model, channel, def) :
            model.fieldDef(channel).axis[property];
        if (value !== undefined) {
            def[property] = value;
        }
    });
    var props = model.fieldDef(channel).axis.properties || {};
    [
        'axis', 'labels',
        'grid', 'title', 'ticks', 'majorTicks', 'minorTicks'
    ].forEach(function (group) {
        var value = properties[group] ?
            properties[group](model, channel, props[group], def) :
            props[group];
        if (value !== undefined) {
            def.properties = def.properties || {};
            def.properties[group] = value;
        }
    });
    return def;
}
exports.compileAxis = compileAxis;
function format(model, channel) {
    var fieldDef = model.fieldDef(channel);
    var format = fieldDef.axis.format;
    if (format !== undefined) {
        return format;
    }
    if (fieldDef.type === type_1.QUANTITATIVE) {
        return model.numberFormat(channel);
    }
    else if (fieldDef.type === type_1.TEMPORAL) {
        var timeUnit = fieldDef.timeUnit;
        if (!timeUnit) {
            return model.config('timeFormat');
        }
        else if (timeUnit === 'year') {
            return 'd';
        }
    }
    return undefined;
}
exports.format = format;
function grid(model, channel) {
    var fieldDef = model.fieldDef(channel);
    var grid = fieldDef.axis.grid;
    if (grid !== undefined) {
        return grid;
    }
    return !model.isOrdinalScale(channel) && !fieldDef.bin;
}
exports.grid = grid;
function layer(model, channel, def) {
    var layer = model.fieldDef(channel).axis.layer;
    if (layer !== undefined) {
        return layer;
    }
    if (def.grid) {
        return 'back';
    }
    return undefined;
}
exports.layer = layer;
;
function orient(model, channel) {
    var orient = model.fieldDef(channel).axis.orient;
    if (orient) {
        return orient;
    }
    else if (channel === channel_1.COLUMN) {
        return 'top';
    }
    else if (channel === channel_1.ROW) {
        if (model.has(channel_1.Y) && model.fieldDef(channel_1.Y).axis.orient !== 'right') {
            return 'right';
        }
    }
    return undefined;
}
exports.orient = orient;
function ticks(model, channel) {
    var ticks = model.fieldDef(channel).axis.ticks;
    if (ticks !== undefined) {
        return ticks;
    }
    if (channel === channel_1.X && !model.fieldDef(channel).bin) {
        return 5;
    }
    return undefined;
}
exports.ticks = ticks;
function tickSize(model, channel) {
    var tickSize = model.fieldDef(channel).axis.tickSize;
    if (tickSize !== undefined) {
        return tickSize;
    }
    if (channel === channel_1.ROW || channel === channel_1.COLUMN) {
        return 0;
    }
    return undefined;
}
exports.tickSize = tickSize;
function title(model, channel) {
    var axisSpec = model.fieldDef(channel).axis;
    if (axisSpec.title !== undefined) {
        return axisSpec.title;
    }
    var fieldTitle = model.fieldTitle(channel);
    var layout = model.layout();
    var maxLength;
    if (axisSpec.titleMaxLength) {
        maxLength = axisSpec.titleMaxLength;
    }
    else if (channel === channel_1.X && typeof layout.cellWidth === 'number') {
        maxLength = layout.cellWidth / model.config('characterWidth');
    }
    else if (channel === channel_1.Y && typeof layout.cellHeight === 'number') {
        maxLength = layout.cellHeight / model.config('characterWidth');
    }
    return maxLength ? util_1.truncate(fieldTitle, maxLength) : fieldTitle;
}
exports.title = title;
var properties;
(function (properties) {
    function axis(model, channel, spec) {
        if (channel === channel_1.ROW || channel === channel_1.COLUMN) {
            return util_1.extend({
                opacity: { value: 0 }
            }, spec || {});
        }
        return spec || undefined;
    }
    properties.axis = axis;
    function labels(model, channel, spec, def) {
        var fieldDef = model.fieldDef(channel);
        var filterName = time.labelTemplate(fieldDef.timeUnit, fieldDef.axis.shortTimeNames);
        if (fieldDef.type === type_1.TEMPORAL && filterName) {
            spec = util_1.extend({
                text: { template: '{{datum.data | ' + filterName + '}}' }
            }, spec || {});
        }
        if (util_1.contains([type_1.NOMINAL, type_1.ORDINAL], fieldDef.type) && fieldDef.axis.labelMaxLength) {
            spec = util_1.extend({
                text: {
                    template: '{{ datum.data | truncate:' + fieldDef.axis.labelMaxLength + '}}'
                }
            }, spec || {});
        }
        switch (channel) {
            case channel_1.X:
                if (model.isDimension(channel_1.X) || fieldDef.type === type_1.TEMPORAL) {
                    spec = util_1.extend({
                        angle: { value: 270 },
                        align: { value: def.orient === 'top' ? 'left' : 'right' },
                        baseline: { value: 'middle' }
                    }, spec || {});
                }
                break;
            case channel_1.ROW:
                if (def.orient === 'right') {
                    spec = util_1.extend({
                        angle: { value: 90 },
                        align: { value: 'center' },
                        baseline: { value: 'bottom' }
                    }, spec || {});
                }
        }
        return spec || undefined;
    }
    properties.labels = labels;
})(properties || (properties = {}));
//# sourceMappingURL=axis.js.map