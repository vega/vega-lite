"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var event_selector_1 = require("vega-parser/src/parsers/event-selector");
var channel_1 = require("../../../channel");
var util_1 = require("../../../util");
var scales_1 = require("./scales");
var interval_1 = require("../interval");
var ANCHOR = '_zoom_anchor', DELTA = '_zoom_delta';
var zoom = {
    has: function (selCmpt) {
        return selCmpt.type === 'interval' && selCmpt.zoom !== undefined && selCmpt.zoom !== false;
    },
    signals: function (model, selCmpt, signals) {
        var name = selCmpt.name, delta = name + DELTA, events = event_selector_1.default(selCmpt.zoom, 'scope'), _a = interval_1.projections(selCmpt), x = _a.x, y = _a.y, sx = util_1.stringValue(model.scaleName(channel_1.X)), sy = util_1.stringValue(model.scaleName(channel_1.Y));
        if (!scales_1.default.has(selCmpt)) {
            events = events.map(function (e) { return (e.markname = name + interval_1.BRUSH, e); });
        }
        signals.push({
            name: name + ANCHOR,
            on: [{
                    events: events,
                    update: "{x: invert(" + sx + ", x(unit)), y: invert(" + sy + ", y(unit))}"
                }]
        }, {
            name: delta,
            on: [{
                    events: events,
                    force: true,
                    update: 'pow(1.001, event.deltaY * pow(16, event.deltaMode))'
                }]
        });
        if (x !== null) {
            onDelta(model, selCmpt, 'x', 'width', signals);
        }
        if (y !== null) {
            onDelta(model, selCmpt, 'y', 'height', signals);
        }
        var size = signals.filter(function (s) { return s.name === name + interval_1.SIZE; });
        if (size.length) {
            var sname = size[0].name;
            size[0].on.push({
                events: { signal: delta },
                update: "{x: " + sname + ".x, y: " + sname + ".y, " +
                    ("width: " + sname + ".width * " + delta + " , ") +
                    ("height: " + sname + ".height * " + delta + "}")
            });
        }
        return signals;
    }
};
exports.default = zoom;
function onDelta(model, selCmpt, channel, size, signals) {
    var name = selCmpt.name, signal = signals.filter(function (s) { return s.name === name + '_' + channel; })[0], scales = scales_1.default.has(selCmpt), base = scales ? scales_1.domain(model, channel) : signal.name, anchor = "" + name + ANCHOR + "." + channel, delta = name + DELTA, scale = util_1.stringValue(model.scaleName(channel)), range = "[" + anchor + " + (" + base + "[0] - " + anchor + ") * " + delta + ", " +
        (anchor + " + (" + base + "[1] - " + anchor + ") * " + delta + "]"), lo = "invert(" + scale + (channel === channel_1.X ? ', 0' : ", unit." + size) + ')', hi = "invert(" + scale + (channel === channel_1.X ? ", unit." + size : ', 0') + ')';
    signal.on.push({
        events: { signal: delta },
        update: scales ? range : "clampRange(" + range + ", " + lo + ", " + hi + ")"
    });
}
//# sourceMappingURL=zoom.js.map