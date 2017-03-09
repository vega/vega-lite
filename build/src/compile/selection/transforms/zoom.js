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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9vbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi90cmFuc2Zvcm1zL3pvb20udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5RUFBbUU7QUFHbkUsNENBQStDO0FBQy9DLHNDQUEwQztBQUUxQyxtQ0FBMkQ7QUFDM0Qsd0NBQStHO0FBRS9HLElBQU0sTUFBTSxHQUFHLGNBQWMsRUFDdkIsS0FBSyxHQUFJLGFBQWEsQ0FBQztBQUU3QixJQUFNLElBQUksR0FBcUI7SUFDN0IsR0FBRyxFQUFFLFVBQVMsT0FBTztRQUNuQixNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxVQUFVLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxTQUFTLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUM7SUFDN0YsQ0FBQztJQUVELE9BQU8sRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTztRQUN2QyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxFQUNuQixLQUFLLEdBQUcsSUFBSSxHQUFHLEtBQUssRUFDcEIsTUFBTSxHQUFHLHdCQUFhLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsRUFDN0Msb0NBQXFDLEVBQXBDLFFBQUMsRUFBRSxRQUFDLEVBQ0wsRUFBRSxHQUFHLGtCQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFDLENBQUMsQ0FBQyxFQUNwQyxFQUFFLEdBQUcsa0JBQVcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFdBQUMsQ0FBQyxDQUFDLENBQUM7UUFFekMsRUFBRSxDQUFDLENBQUMsQ0FBQyxnQkFBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsQ0FBQyxRQUFR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