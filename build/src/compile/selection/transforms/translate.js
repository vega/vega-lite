"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_event_selector_1 = require("vega-event-selector");
var channel_1 = require("../../../channel");
var util_1 = require("../../../util");
var interval_1 = require("../interval");
var selection_1 = require("../selection");
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
                            "slice(" + name + "_" + x.field + ")") + ', ' : '') +
                        (y !== null ? 'extent_y: ' + (scales ? scales_1.domain(model, channel_1.Y) :
                            "slice(" + name + "_" + y.field + ")") + ', ' : '') + '}'
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
    var name = selCmpt.name, signal = signals.filter(function (s) { return s.name === selection_1.channelSignalName(selCmpt, channel); })[0], anchor = name + ANCHOR, delta = name + DELTA, scale = util_1.stringValue(model.scaleName(channel)), extent = ".extent_" + channel, sign = getSign(selCmpt, channel), offset = sign + " abs(span(" + anchor + extent + ")) * " +
        (delta + "." + channel + " / " + anchor + "." + size), range = "[" + anchor + extent + "[0] " + offset + ", " +
        ("" + anchor + extent + "[1] " + offset + "]"), lo = "invert(" + scale + (channel === channel_1.X ? ', 0' : ", unit." + size) + ')', hi = "invert(" + scale + (channel === channel_1.X ? ", unit." + size : ', 0') + ')';
    signal.on.push({
        events: { signal: delta },
        update: scales_1.default.has(selCmpt) ? range : "clampRange(" + range + ", " + lo + ", " + hi + ")"
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3RyYW5zZm9ybXMvdHJhbnNsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkRBQThEO0FBQzlELDRDQUErQztBQUMvQyxzQ0FBMEM7QUFDMUMsd0NBQStHO0FBQy9HLDBDQUFtRTtBQUVuRSxtQ0FBMkQ7QUFHM0QsSUFBTSxNQUFNLEdBQUcsbUJBQW1CLEVBQzVCLEtBQUssR0FBSSxrQkFBa0IsQ0FBQztBQUVsQyxJQUFNLFNBQVMsR0FBcUI7SUFDbEMsR0FBRyxFQUFFLFVBQVMsT0FBTztRQUNuQixNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxVQUFVLElBQUksT0FBTyxDQUFDLFNBQVMsS0FBSyxTQUFTLElBQUksT0FBTyxDQUFDLFNBQVMsS0FBSyxLQUFLLENBQUM7SUFDdkcsQ0FBQztJQUVELE9BQU8sRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTztRQUNqQyxJQUFBLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxFQUNyQixNQUFNLEdBQUcsZ0JBQWMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQ3BDLElBQUksR0FBRyxNQUFNLEdBQUcsTUFBTSxHQUFHLElBQUksR0FBRyxlQUFhLEVBQzdDLE1BQU0sR0FBRyxJQUFJLEdBQUcsTUFBTSxFQUN0QixvQ0FBcUMsRUFBcEMsUUFBQyxFQUFFLFFBQUMsQ0FBaUM7UUFDMUMsSUFBSSxNQUFNLEdBQUcsOEJBQWEsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXZELEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNaLE1BQU0sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FB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