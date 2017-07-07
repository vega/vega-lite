"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_event_selector_1 = require("vega-event-selector");
var channel_1 = require("../../../channel");
var util_1 = require("../../../util");
var interval_1 = require("../interval");
var selection_1 = require("../selection");
var scales_1 = require("./scales");
var ANCHOR = '_zoom_anchor';
var DELTA = '_zoom_delta';
var zoom = {
    has: function (selCmpt) {
        return selCmpt.type === 'interval' && selCmpt.zoom;
    },
    signals: function (model, selCmpt, signals) {
        var name = selCmpt.name;
        var hasScales = scales_1.default.has(selCmpt);
        var delta = name + DELTA;
        var _a = interval_1.projections(selCmpt), x = _a.x, y = _a.y;
        var sx = util_1.stringValue(model.scaleName(channel_1.X));
        var sy = util_1.stringValue(model.scaleName(channel_1.Y));
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
    var name = selCmpt.name;
    var hasScales = scales_1.default.has(selCmpt);
    var signal = signals.filter(function (s) {
        return s.name === selection_1.channelSignalName(selCmpt, channel, hasScales ? 'data' : 'visual');
    })[0];
    var sizeSg = model.getSizeSignalRef(size).signal;
    var scaleType = model.getScaleComponent(channel).get('type');
    var base = hasScales ? scales_1.domain(model, channel) : signal.name;
    var delta = name + DELTA;
    var anchor = "" + name + ANCHOR + "." + channel;
    var zoomFn = !hasScales ? 'zoomLinear' :
        scaleType === 'log' ? 'zoomLog' :
            scaleType === 'pow' ? 'zoomPow' : 'zoomLinear';
    var update = zoomFn + "(" + base + ", " + anchor + ", " + delta + ")";
    signal.on.push({
        events: { signal: delta },
        update: hasScales ? update : "clampRange(" + update + ", 0, " + sizeSg + ")"
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9vbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi90cmFuc2Zvcm1zL3pvb20udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyREFBOEQ7QUFDOUQsNENBQTZEO0FBQzdELHNDQUEwQztBQUMxQyx3Q0FBd0Y7QUFDeEYsMENBQW1FO0FBRW5FLG1DQUEyRDtBQUkzRCxJQUFNLE1BQU0sR0FBRyxjQUFjLENBQUM7QUFDOUIsSUFBTSxLQUFLLEdBQUksYUFBYSxDQUFDO0FBRTdCLElBQU0sSUFBSSxHQUFxQjtJQUM3QixHQUFHLEVBQUUsVUFBUyxPQUFPO1FBQ25CLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLFVBQVUsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQ3JELENBQUM7SUFFRCxPQUFPLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU87UUFDdkMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztRQUMxQixJQUFNLFNBQVMsR0FBRyxnQkFBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QyxJQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLElBQUEsb0NBQXFDLEVBQXBDLFFBQUMsRUFBRSxRQUFDLENBQWlDO1FBQzVDLElBQU0sRUFBRSxHQUFHLGtCQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLElBQU0sRUFBRSxHQUFHLGtCQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLElBQUksTUFBTSxHQUFHLDhCQUFhLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVsRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDZixNQUFN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