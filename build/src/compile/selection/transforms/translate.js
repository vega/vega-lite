"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var event_selector_1 = require("vega-parser/src/parsers/event-selector");
var channel_1 = require("../../../channel");
var util_1 = require("../../../util");
var scales_1 = require("./scales");
var interval_1 = require("../interval");
var ANCHOR = '_translate_anchor', DELTA = '_translate_delta';
var translate = {
    has: function (selCmpt) {
        return selCmpt.type === 'interval' && selCmpt.translate !== undefined && selCmpt.translate !== false;
    },
    signals: function (model, selCmpt, signals) {
        var name = selCmpt.name, scales = scales_1.default.has(selCmpt), size = scales ? 'unit' : name + interval_1.SIZE, anchor = name + ANCHOR, events = event_selector_1.default(selCmpt.translate, 'scope'), _a = interval_1.projections(selCmpt), x = _a.x, y = _a.y;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3RyYW5zZm9ybXMvdHJhbnNsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUVBQW1FO0FBR25FLDRDQUErQztBQUMvQyxzQ0FBMEM7QUFFMUMsbUNBQTJEO0FBQzNELHdDQUErRztBQUUvRyxJQUFNLE1BQU0sR0FBRyxtQkFBbUIsRUFDNUIsS0FBSyxHQUFJLGtCQUFrQixDQUFDO0FBRWxDLElBQU0sU0FBUyxHQUFxQjtJQUNsQyxHQUFHLEVBQUUsVUFBUyxPQUFPO1FBQ25CLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLFVBQVUsSUFBSSxPQUFPLENBQUMsU0FBUyxLQUFLLFNBQVMsSUFBSSxPQUFPLENBQUMsU0FBUyxLQUFLLEtBQUssQ0FBQztJQUN2RyxDQUFDO0lBRUQsT0FBTyxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPO1FBQ25DLElBQUEsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQ25CLE1BQU0sR0FBRyxnQkFBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFDcEMsSUFBSSxHQUFHLE1BQU0sR0FBRyxNQUFNLEdBQUcsSUFBSSxHQUFHLGVBQWEsRUFDN0MsTUFBTSxHQUFHLElBQUksR0FBRyxNQUFNLEVBQ3RCLE1BQU0sR0FBRyx3QkFBYSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLEVBQ2xELG9DQUFxQyxFQUFwQyxRQUFDLEVBQUUsUUFBQyxDQUFpQztRQUUxQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDWixNQUFNLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxH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