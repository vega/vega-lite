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
        return selCmpt.type === 'interval' && selCmpt.translate !== undefined && selCmpt.translate !== false;
    },
    signals: function (model, selCmpt, signals) {
        var name = selCmpt.name;
        var hasScales = scales_1.default.has(selCmpt);
        var anchor = name + ANCHOR;
        var _a = interval_1.projections(selCmpt), x = _a.x, y = _a.y;
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
    var name = selCmpt.name;
    var hasScales = scales_1.default.has(selCmpt);
    var signal = signals.filter(function (s) {
        return s.name === selection_1.channelSignalName(selCmpt, channel, hasScales ? 'data' : 'visual');
    })[0];
    var sizeSg = model.getSizeSignalRef(size).signal;
    var anchor = name + ANCHOR;
    var delta = name + DELTA;
    var sign = getSign(selCmpt, channel);
    var offset = sign + (hasScales ?
        " span(" + anchor + ".extent_" + channel + ") * " + delta + "." + channel + " / " + sizeSg :
        " " + delta + "." + channel);
    var extent = anchor + ".extent_" + channel;
    var range = "[" + extent + "[0] " + offset + ", " + extent + "[1] " + offset + "]";
    signal.on.push({
        events: { signal: delta },
        update: hasScales ? range : "clampRange(" + range + ", 0, " + sizeSg + ")"
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3RyYW5zZm9ybXMvdHJhbnNsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkRBQThEO0FBQzlELDRDQUErQztBQUUvQyx3Q0FBd0Y7QUFDeEYsMENBQW1FO0FBRW5FLG1DQUEyRDtBQUkzRCxJQUFNLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQztBQUNuQyxJQUFNLEtBQUssR0FBSSxrQkFBa0IsQ0FBQztBQUVsQyxJQUFNLFNBQVMsR0FBcUI7SUFDbEMsR0FBRyxFQUFFLFVBQVMsT0FBTztRQUNuQixNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxVQUFVLElBQUksT0FBTyxDQUFDLFNBQVMsS0FBSyxTQUFTLElBQUksT0FBTyxDQUFDLFNBQVMsS0FBSyxLQUFLLENBQUM7SUFDdkcsQ0FBQztJQUVELE9BQU8sRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTztRQUN2QyxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQzFCLElBQU0sU0FBUyxHQUFHLGdCQUFjLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlDLElBQU0sTUFBTSxHQUFHLElBQUksR0FBRyxNQUFNLENBQUM7UUFDdkIsSUFBQSxvQ0FBcUMsRUFBcEMsUUFBQyxFQUFFLFFBQUMsQ0FBaUM7UUFDNUMsSUFBSSxNQUFNLEdBQUcsOEJBQWEsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXZELEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNmLE1BQU0sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxJQUFJLEdB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