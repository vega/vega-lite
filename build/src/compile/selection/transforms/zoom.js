"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_event_selector_1 = require("vega-event-selector");
var channel_1 = require("../../../channel");
var util_1 = require("../../../util");
var interval_1 = require("../interval");
var selection_1 = require("../selection");
var scales_1 = require("./scales");
var ANCHOR = '_zoom_anchor', DELTA = '_zoom_delta';
var zoom = {
    has: function (selCmpt) {
        return selCmpt.type === 'interval' && selCmpt.zoom !== undefined && selCmpt.zoom !== false;
    },
    signals: function (model, selCmpt, signals) {
        var name = selCmpt.name, hasScales = scales_1.default.has(selCmpt), delta = name + DELTA, _a = interval_1.projections(selCmpt), x = _a.x, y = _a.y, sx = util_1.stringValue(model.scaleName(channel_1.X)), sy = util_1.stringValue(model.scaleName(channel_1.Y));
        var events = vega_event_selector_1.selector(selCmpt.zoom, 'scope');
        if (!hasScales) {
            events = events.map(function (e) { return (e.markname = name + interval_1.BRUSH, e); });
        }
        signals.push({
            name: name + ANCHOR,
            on: [{
                    events: events,
                    update: hasScales ?
                        "{x: invert(" + sx + ", x(unit)), y: invert(" + sy + ", y(unit))}" :
                        "{x: x(unit), y: y(unit)}"
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
        return signals;
    }
};
exports.default = zoom;
function onDelta(model, selCmpt, channel, size, signals) {
    var name = selCmpt.name, hasScales = scales_1.default.has(selCmpt), signal = signals.filter(function (s) {
        return s.name === selection_1.channelSignalName(selCmpt, channel, hasScales ? 'data' : 'visual');
    })[0], sizeSg = model.getSizeSignalRef(size).signal, base = hasScales ? scales_1.domain(model, channel) : signal.name, anchor = "" + name + ANCHOR + "." + channel, delta = name + DELTA, scale = util_1.stringValue(model.scaleName(channel)), range = "[" + anchor + " + (" + base + "[0] - " + anchor + ") * " + delta + ", " +
        (anchor + " + (" + base + "[1] - " + anchor + ") * " + delta + "]");
    signal.on.push({
        events: { signal: delta },
        update: hasScales ? range : "clampRange(" + range + ", 0, " + sizeSg + ")"
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9vbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi90cmFuc2Zvcm1zL3pvb20udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyREFBOEQ7QUFDOUQsNENBQStDO0FBQy9DLHNDQUEwQztBQUMxQyx3Q0FBd0Y7QUFDeEYsMENBQW1FO0FBRW5FLG1DQUEyRDtBQUczRCxJQUFNLE1BQU0sR0FBRyxjQUFjLEVBQ3ZCLEtBQUssR0FBSSxhQUFhLENBQUM7QUFFN0IsSUFBTSxJQUFJLEdBQXFCO0lBQzdCLEdBQUcsRUFBRSxVQUFTLE9BQU87UUFDbkIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssVUFBVSxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssU0FBUyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDO0lBQzdGLENBQUM7SUFFRCxPQUFPLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU87UUFDdkMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksRUFDckIsU0FBUyxHQUFHLGdCQUFjLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUN2QyxLQUFLLEdBQUcsSUFBSSxHQUFHLEtBQUssRUFDcEIsb0NBQXFDLEVBQXBDLFFBQUMsRUFBRSxRQUFDLEVBQ0wsRUFBRSxHQUFHLGtCQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFDLENBQUMsQ0FBQyxFQUNwQyxFQUFFLEdBQUcsa0JBQVcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFdBQUMsQ0FBQyxDQUFDLENBQUM7UUFFekMsSUFBSSxNQUFNLEdBQUcsOEJBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRWxELEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNmLE1BQU0sR0FBRyxNQUFNLENBQUMsR0FBRyxD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