"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_event_selector_1 = require("vega-event-selector");
var channel_1 = require("../../../channel");
var interval_1 = require("../interval");
var selection_1 = require("../selection");
var scales_1 = require("./scales");
var ANCHOR = '_translate_anchor';
var DELTA = '_translate_delta';
var translate = {
    has: function (selCmpt) {
        return selCmpt.type === 'interval' && selCmpt.translate;
    },
    signals: function (model, selCmpt, signals) {
        var name = selCmpt.name;
        var hasScales = scales_1.default.has(selCmpt);
        var anchor = name + ANCHOR;
        var _a = selection_1.spatialProjections(selCmpt), x = _a.x, y = _a.y;
        var events = vega_event_selector_1.selector(selCmpt.translate, 'scope');
        if (!hasScales) {
            events = events.map(function (e) { return (e.between[0].markname = name + interval_1.BRUSH, e); });
        }
        signals.push({
            name: anchor,
            value: {},
            on: [{
                    events: events.map(function (e) { return e.between[0]; }),
                    update: '{x: x(unit), y: y(unit)' +
                        (x !== null ? ', extent_x: ' + (hasScales ? scales_1.domain(model, channel_1.X) :
                            "slice(" + selection_1.channelSignalName(selCmpt, 'x', 'visual') + ")") : '') +
                        (y !== null ? ', extent_y: ' + (hasScales ? scales_1.domain(model, channel_1.Y) :
                            "slice(" + selection_1.channelSignalName(selCmpt, 'y', 'visual') + ")") : '') + '}'
                }]
        }, {
            name: name + DELTA,
            value: {},
            on: [{
                    events: events,
                    update: "{x: " + anchor + ".x - x(unit), y: " + anchor + ".y - y(unit)}"
                }]
        });
        if (x !== null) {
            onDelta(model, selCmpt, channel_1.X, 'width', signals);
        }
        if (y !== null) {
            onDelta(model, selCmpt, channel_1.Y, 'height', signals);
        }
        return signals;
    }
};
exports.default = translate;
function onDelta(model, selCmpt, channel, size, signals) {
    var name = selCmpt.name;
    var hasScales = scales_1.default.has(selCmpt);
    var signal = signals.filter(function (s) {
        return s.name === selection_1.channelSignalName(selCmpt, channel, hasScales ? 'data' : 'visual');
    })[0];
    var anchor = name + ANCHOR;
    var delta = name + DELTA;
    var sizeSg = model.getSizeSignalRef(size).signal;
    var scaleCmpt = model.getScaleComponent(channel);
    var scaleType = scaleCmpt.get('type');
    var sign = hasScales && channel === channel_1.X ? '-' : ''; // Invert delta when panning x-scales.
    var extent = anchor + ".extent_" + channel;
    var offset = "" + sign + delta + "." + channel + " / " + (hasScales ? "" + sizeSg : "span(" + extent + ")");
    var panFn = !hasScales ? 'panLinear' :
        scaleType === 'log' ? 'panLog' :
            scaleType === 'pow' ? 'panPow' : 'panLinear';
    var update = panFn + "(" + extent + ", " + offset +
        (hasScales && scaleType === 'pow' ? ", " + (scaleCmpt.get('exponent') || 1) : '') + ')';
    signal.on.push({
        events: { signal: delta },
        update: hasScales ? update : "clampRange(" + update + ", 0, " + sizeSg + ")"
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3RyYW5zZm9ybXMvdHJhbnNsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkRBQThEO0FBQzlELDRDQUFvRDtBQUNwRCx3Q0FBb0Q7QUFDcEQsMENBQXVGO0FBRXZGLG1DQUEyRDtBQUkzRCxJQUFNLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQztBQUNuQyxJQUFNLEtBQUssR0FBSSxrQkFBa0IsQ0FBQztBQUVsQyxJQUFNLFNBQVMsR0FBcUI7SUFDbEMsR0FBRyxFQUFFLFVBQVMsT0FBTztRQUNuQixNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxVQUFVLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQztJQUMxRCxDQUFDO0lBRUQsT0FBTyxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPO1FBQ3ZDLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDMUIsSUFBTSxTQUFTLEdBQUcsZ0JBQWMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUMsSUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLE1BQU0sQ0FBQztRQUN2QixJQUFBLDRDQUFvQyxFQUFuQyxRQUFDLEVBQUUsUUFBQyxDQUFnQztRQUMzQyxJQUFJLE1BQU0sR0FBRyw4QkFBYSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFdkQsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2YsTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxnQkFBYyxFQUFFLENBQUMsQ0FBQyxFQUFsRCxDQUFrRCxDQUFD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