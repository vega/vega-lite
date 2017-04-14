"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_event_selector_1 = require("vega-event-selector");
var channel_1 = require("../../../channel");
var util_1 = require("../../../util");
var interval_1 = require("../interval");
var scales_1 = require("./scales");
var ANCHOR = '_zoom_anchor', DELTA = '_zoom_delta';
var zoom = {
    has: function (selCmpt) {
        return selCmpt.type === 'interval' && selCmpt.zoom !== undefined && selCmpt.zoom !== false;
    },
    signals: function (model, selCmpt, signals) {
        var name = selCmpt.name, delta = name + DELTA, _a = interval_1.projections(selCmpt), x = _a.x, y = _a.y, sx = util_1.stringValue(model.scaleName(channel_1.X)), sy = util_1.stringValue(model.scaleName(channel_1.Y));
        var events = vega_event_selector_1.selector(selCmpt.zoom, 'scope');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9vbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi90cmFuc2Zvcm1zL3pvb20udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyREFBOEQ7QUFDOUQsNENBQStDO0FBQy9DLHNDQUEwQztBQUMxQyx3Q0FBK0c7QUFHL0csbUNBQTJEO0FBRzNELElBQU0sTUFBTSxHQUFHLGNBQWMsRUFDdkIsS0FBSyxHQUFJLGFBQWEsQ0FBQztBQUU3QixJQUFNLElBQUksR0FBcUI7SUFDN0IsR0FBRyxFQUFFLFVBQVMsT0FBTztRQUNuQixNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxVQUFVLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxTQUFTLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUM7SUFDN0YsQ0FBQztJQUVELE9BQU8sRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTztRQUN2QyxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxFQUNyQixLQUFLLEdBQUcsSUFBSSxHQUFHLEtBQUssRUFDcEIsb0NBQXFDLEVBQXBDLFFBQUMsRUFBRSxRQUFDLEVBQ0wsRUFBRSxHQUFHLGtCQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFDLENBQUMsQ0FBQyxFQUNwQyxFQUFFLEdBQUcsa0JBQVcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFdBQUMsQ0FBQyxDQUFDLENBQUM7UUFFekMsSUFBSSxNQUFNLEdBQUcsOEJBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRWxELEVBQUUsQ0FBQyxDQUFDLENBQUMsZ0JBQWMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFD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