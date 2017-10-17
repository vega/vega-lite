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
        var _a = selection_1.positionalProjections(selCmpt), x = _a.x, y = _a.y;
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
                    update: !hasScales ? "{x: x(unit), y: y(unit)}" :
                        '{' + [
                            (sx ? "x: invert(" + sx + ", x(unit))" : ''),
                            (sy ? "y: invert(" + sy + ", y(unit))" : '')
                        ].filter(function (expr) { return !!expr; }).join(', ') + '}'
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
    var scaleCmpt = model.getScaleComponent(channel);
    var scaleType = scaleCmpt.get('type');
    var base = hasScales ? scales_1.domain(model, channel) : signal.name;
    var delta = name + DELTA;
    var anchor = "" + name + ANCHOR + "." + channel;
    var zoomFn = !hasScales ? 'zoomLinear' :
        scaleType === 'log' ? 'zoomLog' :
            scaleType === 'pow' ? 'zoomPow' : 'zoomLinear';
    var update = zoomFn + "(" + base + ", " + anchor + ", " + delta +
        (hasScales && scaleType === 'pow' ? ", " + (scaleCmpt.get('exponent') || 1) : '') + ')';
    signal.on.push({
        events: { signal: delta },
        update: hasScales ? update : "clampRange(" + update + ", 0, " + sizeSg + ")"
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9vbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi90cmFuc2Zvcm1zL3pvb20udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyREFBOEQ7QUFDOUQsNENBQW9EO0FBQ3BELHNDQUEwQztBQUUxQyx3Q0FBb0Q7QUFDcEQsMENBQTBGO0FBRTFGLG1DQUEyRDtBQUkzRCxJQUFNLE1BQU0sR0FBRyxjQUFjLENBQUM7QUFDOUIsSUFBTSxLQUFLLEdBQUksYUFBYSxDQUFDO0FBRTdCLElBQU0sSUFBSSxHQUFxQjtJQUM3QixHQUFHLEVBQUUsVUFBUyxPQUFPO1FBQ25CLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLFVBQVUsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQ3JELENBQUM7SUFFRCxPQUFPLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU87UUFDdkMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztRQUMxQixJQUFNLFNBQVMsR0FBRyxnQkFBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QyxJQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLElBQUEsK0NBQXVDLEVBQXRDLFFBQUMsRUFBRSxRQUFDLENBQW1DO1FBQzlDLElBQU0sRUFBRSxHQUFHLGtCQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLElBQU0sRUFBRSxHQUFHLGtCQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLElBQUksTUFBTSxHQUFHLDhCQUFhLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVsRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDZixNQUFN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