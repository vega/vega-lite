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
        return selCmpt.type === 'interval' && selCmpt.zoom !== undefined && selCmpt.zoom !== false;
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
    var base = hasScales ? scales_1.domain(model, channel) : signal.name;
    var anchor = "" + name + ANCHOR + "." + channel;
    var delta = name + DELTA;
    var scale = util_1.stringValue(model.scaleName(channel));
    var range = "[" + anchor + " + (" + base + "[0] - " + anchor + ") * " + delta + ", " +
        (anchor + " + (" + base + "[1] - " + anchor + ") * " + delta + "]");
    signal.on.push({
        events: { signal: delta },
        update: hasScales ? range : "clampRange(" + range + ", 0, " + sizeSg + ")"
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9vbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi90cmFuc2Zvcm1zL3pvb20udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyREFBOEQ7QUFDOUQsNENBQStDO0FBQy9DLHNDQUEwQztBQUMxQyx3Q0FBd0Y7QUFDeEYsMENBQW1FO0FBRW5FLG1DQUEyRDtBQUkzRCxJQUFNLE1BQU0sR0FBRyxjQUFjLENBQUM7QUFDOUIsSUFBTSxLQUFLLEdBQUksYUFBYSxDQUFDO0FBRTdCLElBQU0sSUFBSSxHQUFxQjtJQUM3QixHQUFHLEVBQUUsVUFBUyxPQUFPO1FBQ25CLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLFVBQVUsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLFNBQVMsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQztJQUM3RixDQUFDO0lBRUQsT0FBTyxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPO1FBQ3ZDLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDMUIsSUFBTSxTQUFTLEdBQUcsZ0JBQWMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUMsSUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUNyQixJQUFBLG9DQUFxQyxFQUFwQyxRQUFDLEVBQUUsUUFBQyxDQUFpQztRQUM1QyxJQUFNLEVBQUUsR0FBRyxrQkFBVyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsV0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxJQUFNLEVBQUUsR0FBRyxrQkFBVyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsV0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxJQUFJLE1BQU0sR0FBRyw4QkFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFbEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2YsTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLGdCQUFjLEVBQUUsQ0FBQyxDQUFDLEVBQXZDLENBQXVDLENBQUMsQ0FBQztRQUN0RSxDQUFDO1FBRUQsT0FBTyxDQUFDLElBQUksQ0FBQztZQUNYLElBQUksRUFBRSxJQUFJLEdBQUcsTUFBTTtZQUNuQixFQUFFLEVBQUUsQ0FBQztvQkFDSCxNQUFNLEVBQUUsTUFBTTtvQkFDZCxNQUFNLEVBQUUsU0FBUzt3QkFDZixnQkFBYyxFQUFFLDhCQUF5QixFQUFFLGdCQUFhO3dCQUN4RCwwQkFBMEI7aUJBQzdCLENBQUM7U0FDSCxFQUFFO1lBQ0QsSUFBSSxFQUFFLEtBQUs7WUFDWCxFQUFFLEVBQUUsQ0FBQztvQkFDSCxNQUFNLEVBQUUsTUFBTTtvQkFDZCxLQUFLLEVBQUUsSUFBSTtvQkFDWCxNQUFNLEVBQUUscURBQXFEO2lCQUM5RCxDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDZixPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2pELENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNmLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUVELE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDakIsQ0FBQztDQUNGLENBQUM7QUFFYyx1QkFBTztBQUV2QixpQkFBaUIsS0FBZ0IsRUFBRSxPQUEyQixFQUFFLE9BQWdCLEVBQUUsSUFBd0IsRUFBRSxPQUFjO0lBQ3hILElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDMUIsSUFBTSxTQUFTLEdBQUcsZ0JBQWMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUMsSUFBTSxNQUFNLEdBQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUs7UUFDdEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssNkJBQWlCLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEdBQUcsTUFBTSxHQUFHLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZGLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ04sSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUNuRCxJQUFNLElBQUksR0FBRyxTQUFTLEdBQUcsZUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQzlELElBQU0sTUFBTSxHQUFHLEtBQUcsSUFBSSxHQUFHLE1BQU0sU0FBSSxPQUFTLENBQUM7SUFDN0MsSUFBTSxLQUFLLEdBQUksSUFBSSxHQUFHLEtBQUssQ0FBQztJQUM1QixJQUFNLEtBQUssR0FBSSxrQkFBVyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNyRCxJQUFNLEtBQUssR0FBSSxNQUFJLE1BQU0sWUFBTyxJQUFJLGNBQVMsTUFBTSxZQUFPLEtBQUssT0FBSTtTQUM5RCxNQUFNLFlBQU8sSUFBSSxjQUFTLE1BQU0sWUFBTyxLQUFLLE1BQUcsQ0FBQSxDQUFDO0lBRXJELE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO1FBQ2IsTUFBTSxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQztRQUN2QixNQUFNLEVBQUUsU0FBUyxHQUFHLEtBQUssR0FBRyxnQkFBYyxLQUFLLGFBQVEsTUFBTSxNQUFHO0tBQ2pFLENBQUMsQ0FBQztBQUNMLENBQUMifQ==