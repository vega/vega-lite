"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_event_selector_1 = require("vega-event-selector");
var channel_1 = require("../../../channel");
var util_1 = require("../../../util");
var interval_1 = require("../interval");
var scales_1 = require("./scales");
var ANCHOR = '_translate_anchor', DELTA = '_translate_delta';
var translate = {
    has: function (selCmpt) {
        return selCmpt.type === 'interval' && selCmpt.translate !== undefined && selCmpt.translate !== false;
    },
    signals: function (model, selCmpt, signals) {
        var name = selCmpt.name, scales = scales_1.default.has(selCmpt), size = scales ? 'unit' : name + interval_1.SIZE, anchor = name + ANCHOR, _a = interval_1.projections(selCmpt), x = _a.x, y = _a.y;
        var events = vega_event_selector_1.selector(selCmpt.translate, 'scope');
        if (!scales) {
            events = events.map(function (e) { return (e.between[0].markname = name + interval_1.BRUSH, e); });
        }
        signals.push({
            name: anchor,
            value: {},
            on: [{
                    events: events.map(function (e) { return e.between[0]; }),
                    update: '{x: x(unit), y: y(unit), ' +
                        ("width: " + size + ".width, height: " + size + ".height, ") +
                        (x !== null ? 'extent_x: ' + (scales ? scales_1.domain(model, channel_1.X) :
                            "slice(" + name + "_x)") + ', ' : '') +
                        (y !== null ? 'extent_y: ' + (scales ? scales_1.domain(model, channel_1.Y) :
                            "slice(" + name + "_y)") + ', ' : '') + '}'
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
    var s = channel === channel_1.X ? '+' : '-';
    if (scales_1.default.has(selCmpt)) {
        s = s === '+' ? '-' : '+';
    }
    return s;
}
function onDelta(model, selCmpt, channel, size, signals) {
    var name = selCmpt.name, signal = signals.filter(function (s) { return s.name === name + '_' + channel; })[0], anchor = name + ANCHOR, delta = name + DELTA, scale = util_1.stringValue(model.scaleName(channel)), extent = ".extent_" + channel, sign = getSign(selCmpt, channel), offset = sign + " abs(span(" + anchor + extent + ")) * " +
        (delta + "." + channel + " / " + anchor + "." + size), range = "[" + anchor + extent + "[0] " + offset + ", " +
        ("" + anchor + extent + "[1] " + offset + "]"), lo = "invert(" + scale + (channel === channel_1.X ? ', 0' : ", unit." + size) + ')', hi = "invert(" + scale + (channel === channel_1.X ? ", unit." + size : ', 0') + ')';
    signal.on.push({
        events: { signal: delta },
        update: scales_1.default.has(selCmpt) ? range : "clampRange(" + range + ", " + lo + ", " + hi + ")"
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3RyYW5zZm9ybXMvdHJhbnNsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkRBQThEO0FBQzlELDRDQUErQztBQUMvQyxzQ0FBMEM7QUFDMUMsd0NBQStHO0FBRy9HLG1DQUEyRDtBQUczRCxJQUFNLE1BQU0sR0FBRyxtQkFBbUIsRUFDNUIsS0FBSyxHQUFJLGtCQUFrQixDQUFDO0FBRWxDLElBQU0sU0FBUyxHQUFxQjtJQUNsQyxHQUFHLEVBQUUsVUFBUyxPQUFPO1FBQ25CLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLFVBQVUsSUFBSSxPQUFPLENBQUMsU0FBUyxLQUFLLFNBQVMsSUFBSSxPQUFPLENBQUMsU0FBUyxLQUFLLEtBQUssQ0FBQztJQUN2RyxDQUFDO0lBRUQsT0FBTyxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPO1FBQ2pDLElBQUEsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQ3JCLE1BQU0sR0FBRyxnQkFBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFDcEMsSUFBSSxHQUFHLE1BQU0sR0FBRyxNQUFNLEdBQUcsSUFBSSxHQUFHLGVBQWEsRUFDN0MsTUFBTSxHQUFHLElBQUksR0FBRyxNQUFNLEVBQ3RCLG9DQUFxQyxFQUFwQyxRQUFDLEVBQUUsUUFBQyxDQUFpQztRQUMxQyxJQUFJLE1BQU0sR0FBRyw4QkFBYSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFdkQsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ1osTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxH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