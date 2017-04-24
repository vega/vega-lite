"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_event_selector_1 = require("vega-event-selector");
var channel_1 = require("../../../channel");
var util_1 = require("../../../util");
var interval_1 = require("../interval");
var selection_1 = require("../selection");
var scales_1 = require("./scales");
var ANCHOR = '_zoom_anchor', DELTA = '_zoom_delta';
var zoom = {
    has: function (selCmpt) {
        return selCmpt.type === 'interval' && selCmpt.zoom !== undefined && selCmpt.zoom !== false;
    },
    signals: function (model, selCmpt, signals) {
        var name = selCmpt.name, delta = name + DELTA, _a = interval_1.projections(selCmpt), x = _a.x, y = _a.y, sx = util_1.stringValue(model.scaleName(channel_1.X)), sy = util_1.stringValue(model.scaleName(channel_1.Y));
        var events = vega_event_selector_1.selector(selCmpt.zoom, 'scope');
        if (!scales_1.default.has(selCmpt)) {
            events = events.map(function (e) { return (e.markname = name + interval_1.BRUSH, e); });
        }
        signals.push({
            name: name + ANCHOR,
            on: [{
                    events: events,
                    update: "{x: invert(" + sx + ", x(unit)), y: invert(" + sy + ", y(unit))}"
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
        var size = signals.filter(function (s) { return s.name === name + interval_1.SIZE; });
        if (size.length) {
            var sname = size[0].name;
            size[0].on.push({
                events: { signal: delta },
                update: "{x: " + sname + ".x, y: " + sname + ".y, " +
                    ("width: " + sname + ".width * " + delta + " , ") +
                    ("height: " + sname + ".height * " + delta + "}")
            });
        }
        return signals;
    }
};
exports.default = zoom;
function onDelta(model, selCmpt, channel, size, signals) {
    var name = selCmpt.name, signal = signals.filter(function (s) { return s.name === selection_1.channelSignalName(selCmpt, channel); })[0], scales = scales_1.default.has(selCmpt), base = scales ? scales_1.domain(model, channel) : signal.name, anchor = "" + name + ANCHOR + "." + channel, delta = name + DELTA, scale = util_1.stringValue(model.scaleName(channel)), range = "[" + anchor + " + (" + base + "[0] - " + anchor + ") * " + delta + ", " +
        (anchor + " + (" + base + "[1] - " + anchor + ") * " + delta + "]"), lo = "invert(" + scale + (channel === channel_1.X ? ', 0' : ", unit." + size) + ')', hi = "invert(" + scale + (channel === channel_1.X ? ", unit." + size : ', 0') + ')';
    signal.on.push({
        events: { signal: delta },
        update: scales ? range : "clampRange(" + range + ", " + lo + ", " + hi + ")"
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9vbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi90cmFuc2Zvcm1zL3pvb20udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyREFBOEQ7QUFDOUQsNENBQStDO0FBQy9DLHNDQUEwQztBQUMxQyx3Q0FBK0c7QUFDL0csMENBQW1FO0FBRW5FLG1DQUEyRDtBQUczRCxJQUFNLE1BQU0sR0FBRyxjQUFjLEVBQ3ZCLEtBQUssR0FBSSxhQUFhLENBQUM7QUFFN0IsSUFBTSxJQUFJLEdBQXFCO0lBQzdCLEdBQUcsRUFBRSxVQUFTLE9BQU87UUFDbkIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssVUFBVSxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssU0FBUyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDO0lBQzdGLENBQUM7SUFFRCxPQUFPLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU87UUFDdkMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksRUFDckIsS0FBSyxHQUFHLElBQUksR0FBRyxLQUFLLEVBQ3BCLG9DQUFxQyxFQUFwQyxRQUFDLEVBQUUsUUFBQyxFQUNMLEVBQUUsR0FBRyxrQkFBVyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsV0FBQyxDQUFDLENBQUMsRUFDcEMsRUFBRSxHQUFHLGtCQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXpDLElBQUksTUFBTSxHQUFHLDhCQUFhLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVsRCxFQUFFLENBQUMsQ0FBQyxDQUFDLGdCQUFjLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQyxNQUFNLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsSUFBSyxP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