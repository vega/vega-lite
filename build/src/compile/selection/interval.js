"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var selection_1 = require("./selection");
var channel_1 = require("../../channel");
var util_1 = require("../../util");
var log_1 = require("../../log");
var scales_1 = require("./transforms/scales");
exports.BRUSH = '_brush', exports.SIZE = '_size';
var interval = {
    predicate: 'vlInterval',
    signals: function (model, selCmpt) {
        var signals = [], intervals = [], name = selCmpt.name, size = name + exports.SIZE;
        if (selCmpt.translate && !(scales_1.default.has(selCmpt))) {
            events(selCmpt, function (_, evt) {
                var filters = evt.between[0].filter || (evt.between[0].filter = []);
                filters.push('!event.item || (event.item && ' +
                    ("event.item.mark.name !== " + util_1.stringValue(name + exports.BRUSH) + ")"));
            });
        }
        selCmpt.project.forEach(function (p) {
            if (p.encoding !== channel_1.X && p.encoding !== channel_1.Y) {
                log_1.warn('Interval selections only support x and y encoding channels.');
                return;
            }
            var cs = channelSignal(model, selCmpt, p.encoding);
            signals.push(cs);
            intervals.push("{field: " + util_1.stringValue(p.field) + ", extent: " + cs.name + "}");
        });
        signals.push({
            name: size,
            value: [],
            on: events(selCmpt, function (on, evt) {
                on.push({
                    events: evt.between[0],
                    update: '{x: x(unit), y: y(unit), width: 0, height: 0}'
                });
                on.push({
                    events: evt,
                    update: "{x: " + size + ".x, y: " + size + ".y, " +
                        ("width: abs(x(unit) - " + size + ".x), height: abs(y(unit) - " + size + ".y)}")
                });
                return on;
            })
        }, {
            name: name,
            update: "[" + intervals.join(', ') + "]"
        });
        return signals;
    },
    tupleExpr: function (model, selCmpt) {
        return "intervals: " + selCmpt.name;
    },
    modifyExpr: function (model, selCmpt) {
        var tpl = selCmpt.name + selection_1.TUPLE;
        return tpl + ", {unit: " + tpl + ".unit}";
    },
    marks: function (model, selCmpt, marks) {
        var name = selCmpt.name, _a = projections(selCmpt), x = _a.x, y = _a.y;
        // Do not add a brush if we're binding to scales.
        if (scales_1.default.has(selCmpt)) {
            return marks;
        }
        var update = {
            x: util_1.extend({}, x !== null ?
                { scale: model.scaleName(channel_1.X), signal: name + "[" + x + "].extent[0]" } :
                { value: 0 }),
            x2: util_1.extend({}, x !== null ?
                { scale: model.scaleName(channel_1.X), signal: name + "[" + x + "].extent[1]" } :
                { field: { group: 'width' } }),
            y: util_1.extend({}, y !== null ?
                { scale: model.scaleName(channel_1.Y), signal: name + "[" + y + "].extent[0]" } :
                { value: 0 }),
            y2: util_1.extend({}, y !== null ?
                { scale: model.scaleName(channel_1.Y), signal: name + "[" + y + "].extent[1]" } :
                { field: { group: 'height' } }),
        };
        return [{
                name: undefined,
                type: 'rect',
                encode: {
                    enter: { fill: { value: '#eee' } },
                    update: update
                }
            }].concat(marks, {
            name: name + exports.BRUSH,
            type: 'rect',
            encode: {
                enter: { fill: { value: 'transparent' } },
                update: update
            }
        });
    }
};
exports.default = interval;
function projections(selCmpt) {
    var x = null, y = null;
    selCmpt.project.forEach(function (p, i) {
        if (p.encoding === channel_1.X) {
            x = i;
        }
        else if (p.encoding === channel_1.Y) {
            y = i;
        }
    });
    return { x: x, y: y };
}
exports.projections = projections;
function channelSignal(model, selCmpt, channel) {
    var name = selection_1.channelSignalName(selCmpt, channel), size = (channel === channel_1.X ? 'width' : 'height'), coord = channel + "(unit)", invert = selection_1.invert.bind(null, model, selCmpt, channel);
    return {
        name: name,
        value: [],
        on: scales_1.default.has(selCmpt) ? [] : events(selCmpt, function (on, evt) {
            on.push({
                events: evt.between[0],
                update: invert("[" + coord + ", " + coord + "]")
            });
            on.push({
                events: evt,
                update: "[" + name + "[0], " + invert("clamp(" + coord + ", 0, " + size + ")") + ']'
            });
            return on;
        })
    };
}
function events(selCmpt, cb) {
    return selCmpt.events.reduce(function (on, evt) {
        if (!evt.between) {
            log_1.warn(evt + " is not an ordered event stream for interval selections");
            return on;
        }
        return cb(on, evt);
    }, []);
}
//# sourceMappingURL=interval.js.map