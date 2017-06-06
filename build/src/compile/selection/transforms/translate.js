"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_event_selector_1 = require("vega-event-selector");
var channel_1 = require("../../../channel");
var interval_1 = require("../interval");
var selection_1 = require("../selection");
var scales_1 = require("./scales");
var ANCHOR = '_translate_anchor', DELTA = '_translate_delta';
var translate = {
    has: function (selCmpt) {
        return selCmpt.type === 'interval' && selCmpt.translate !== undefined && selCmpt.translate !== false;
    },
    signals: function (model, selCmpt, signals) {
        var name = selCmpt.name, hasScales = scales_1.default.has(selCmpt), anchor = name + ANCHOR, _a = interval_1.projections(selCmpt), x = _a.x, y = _a.y;
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
                    update: "{x: x(unit) - " + anchor + ".x, y: y(unit) - " + anchor + ".y}"
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
function getSign(selCmpt, channel) {
    if (scales_1.default.has(selCmpt)) {
        return channel === channel_1.Y ? '+' : '-';
    }
    return '+';
}
function onDelta(model, selCmpt, channel, size, signals) {
    var name = selCmpt.name, hasScales = scales_1.default.has(selCmpt), signal = signals.filter(function (s) {
        return s.name === selection_1.channelSignalName(selCmpt, channel, hasScales ? 'data' : 'visual');
    })[0], sizeSg = model.getSizeSignalRef(size).signal, anchor = name + ANCHOR, delta = name + DELTA, sign = getSign(selCmpt, channel), offset = sign + (hasScales ?
        " span(" + anchor + ".extent_" + channel + ") * " + delta + "." + channel + " / " + sizeSg :
        " " + delta + "." + channel), extent = anchor + ".extent_" + channel, range = "[" + extent + "[0] " + offset + ", " + extent + "[1] " + offset + "]";
    signal.on.push({
        events: { signal: delta },
        update: hasScales ? range : "clampRange(" + range + ", 0, " + sizeSg + ")"
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3RyYW5zZm9ybXMvdHJhbnNsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkRBQThEO0FBQzlELDRDQUErQztBQUUvQyx3Q0FBd0Y7QUFDeEYsMENBQW1FO0FBRW5FLG1DQUEyRDtBQUczRCxJQUFNLE1BQU0sR0FBRyxtQkFBbUIsRUFDNUIsS0FBSyxHQUFJLGtCQUFrQixDQUFDO0FBRWxDLElBQU0sU0FBUyxHQUFxQjtJQUNsQyxHQUFHLEVBQUUsVUFBUyxPQUFPO1FBQ25CLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLFVBQVUsSUFBSSxPQUFPLENBQUMsU0FBUyxLQUFLLFNBQVMsSUFBSSxPQUFPLENBQUMsU0FBUyxLQUFLLEtBQUssQ0FBQztJQUN2RyxDQUFDO0lBRUQsT0FBTyxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPO1FBQ2pDLElBQUEsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQ3JCLFNBQVMsR0FBRyxnQkFBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFDdkMsTUFBTSxHQUFHLElBQUksR0FBRyxNQUFNLEVBQ3RCLG9DQUFxQyxFQUFwQyxRQUFDLEVBQUUsUUFBQyxDQUFpQztRQUMxQyxJQUFJLE1BQU0sR0FBRyw4QkFBYSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFdkQsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2YsTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxnQkFBYyxFQUFFLENBQUMsQ0FBQyxFQUFsRCxDQUFrRCxDQUFD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