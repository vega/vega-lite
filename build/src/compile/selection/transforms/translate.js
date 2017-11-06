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
        var _a = selection_1.positionalProjections(selCmpt), x = _a.x, y = _a.y;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3RyYW5zZm9ybXMvdHJhbnNsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkRBQThEO0FBQzlELDRDQUFvRDtBQUVwRCx3Q0FBb0Q7QUFDcEQsMENBQTBGO0FBRTFGLG1DQUEyRDtBQUkzRCxJQUFNLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQztBQUNuQyxJQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQztBQUVqQyxJQUFNLFNBQVMsR0FBcUI7SUFDbEMsR0FBRyxFQUFFLFVBQVMsT0FBTztRQUNuQixNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxVQUFVLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQztJQUMxRCxDQUFDO0lBRUQsT0FBTyxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPO1FBQ3ZDLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDMUIsSUFBTSxTQUFTLEdBQUcsZ0JBQWMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUMsSUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLE1BQU0sQ0FBQztRQUN2QixJQUFBLCtDQUF1QyxFQUF0QyxRQUFDLEVBQUUsUUFBQyxDQUFtQztRQUM5QyxJQUFJLE1BQU0sR0FBRyw4QkFBYSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFdkQsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2YsTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxnQkFBYyxFQUFFLENBQUMsQ0FBQyxFQUFsRCxDQUFrRCxDQUFD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