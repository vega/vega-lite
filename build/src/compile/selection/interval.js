"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var log_1 = require("../../log");
var scale_1 = require("../../scale");
var util_1 = require("../../util");
var selection_1 = require("./selection");
var scales_1 = require("./transforms/scales");
exports.BRUSH = '_brush';
exports.SCALE_TRIGGER = '_scale_trigger';
var interval = {
    predicate: 'vlInterval',
    scaleDomain: 'vlIntervalDomain',
    signals: function (model, selCmpt) {
        var name = selCmpt.name;
        var hasScales = scales_1.default.has(selCmpt);
        var signals = [];
        var intervals = [];
        var tupleTriggers = [];
        var scaleTriggers = [];
        if (selCmpt.translate && !hasScales) {
            var filterExpr_1 = "!event.item || event.item.mark.name !== " + util_1.stringValue(name + exports.BRUSH);
            events(selCmpt, function (_, evt) {
                var filters = evt.between[0].filter || (evt.between[0].filter = []);
                if (filters.indexOf(filterExpr_1) < 0) {
                    filters.push(filterExpr_1);
                }
            });
        }
        selCmpt.project.forEach(function (p) {
            var channel = p.channel;
            if (channel !== channel_1.X && channel !== channel_1.Y) {
                log_1.warn('Interval selections only support x and y encoding channels.');
                return;
            }
            var cs = channelSignals(model, selCmpt, channel);
            var dname = selection_1.channelSignalName(selCmpt, channel, 'data');
            var vname = selection_1.channelSignalName(selCmpt, channel, 'visual');
            var scaleStr = util_1.stringValue(model.scaleName(channel));
            var scaleType = model.getScaleComponent(channel).get('type');
            var toNum = scale_1.hasContinuousDomain(scaleType) ? '+' : '';
            signals.push.apply(signals, cs);
            tupleTriggers.push(dname);
            intervals.push("{encoding: " + util_1.stringValue(channel) + ", " +
                ("field: " + util_1.stringValue(p.field) + ", extent: " + dname + "}"));
            scaleTriggers.push({
                scaleName: model.scaleName(channel),
                expr: "(!isArray(" + dname + ") || " +
                    ("(" + toNum + "invert(" + scaleStr + ", " + vname + ")[0] === " + toNum + dname + "[0] && ") +
                    (toNum + "invert(" + scaleStr + ", " + vname + ")[1] === " + toNum + dname + "[1]))")
            });
        });
        // Proxy scale reactions to ensure that an infinite loop doesn't occur
        // when an interval selection filter touches the scale.
        if (!hasScales) {
            signals.push({
                name: name + exports.SCALE_TRIGGER,
                update: scaleTriggers.map(function (t) { return t.expr; }).join(' && ') +
                    (" ? " + (name + exports.SCALE_TRIGGER) + " : {}")
            });
        }
        // Only add an interval to the store if it has valid data extents. Data extents
        // are set to null if pixel extents are equal to account for intervals over
        // ordinal/nominal domains which, when inverted, will still produce a valid datum.
        return signals.concat({
            name: name + selection_1.TUPLE,
            on: [{
                    events: tupleTriggers.map(function (t) { return ({ signal: t }); }),
                    update: tupleTriggers.join(' && ') +
                        (" ? {unit: " + selection_1.unitName(model) + ", intervals: [" + intervals.join(', ') + "]} : null")
                }]
        });
    },
    modifyExpr: function (model, selCmpt) {
        var tpl = selCmpt.name + selection_1.TUPLE;
        return tpl + ', ' +
            (selCmpt.resolve === 'global' ? 'true' : "{unit: " + selection_1.unitName(model) + "}");
    },
    marks: function (model, selCmpt, marks) {
        var name = selCmpt.name;
        var _a = selection_1.positionalProjections(selCmpt), xi = _a.xi, yi = _a.yi;
        var store = "data(" + util_1.stringValue(selCmpt.name + selection_1.STORE) + ")";
        // Do not add a brush if we're binding to scales.
        if (scales_1.default.has(selCmpt)) {
            return marks;
        }
        var update = {
            x: xi !== null ? { signal: name + "_x[0]" } : { value: 0 },
            y: yi !== null ? { signal: name + "_y[0]" } : { value: 0 },
            x2: xi !== null ? { signal: name + "_x[1]" } : { field: { group: 'width' } },
            y2: yi !== null ? { signal: name + "_y[1]" } : { field: { group: 'height' } }
        };
        // If the selection is resolved to global, only a single interval is in
        // the store. Wrap brush mark's encodings with a production rule to test
        // this based on the `unit` property. Hide the brush mark if it corresponds
        // to a unit different from the one in the store.
        if (selCmpt.resolve === 'global') {
            util_1.keys(update).forEach(function (key) {
                update[key] = [tslib_1.__assign({ test: store + ".length && " + store + "[0].unit === " + selection_1.unitName(model) }, update[key]), { value: 0 }];
            });
        }
        // Two brush marks ensure that fill colors and other aesthetic choices do
        // not interefere with the core marks, but that the brushed region can still
        // be interacted with (e.g., dragging it around).
        var _b = selCmpt.mark, fill = _b.fill, fillOpacity = _b.fillOpacity, stroke = tslib_1.__rest(_b, ["fill", "fillOpacity"]);
        var vgStroke = util_1.keys(stroke).reduce(function (def, k) {
            def[k] = { value: stroke[k] };
            return def;
        }, {});
        return [{
                name: name + exports.BRUSH + '_bg',
                type: 'rect',
                clip: true,
                encode: {
                    enter: {
                        fill: { value: fill },
                        fillOpacity: { value: fillOpacity }
                    },
                    update: update
                }
            }].concat(marks, {
            name: name + exports.BRUSH,
            type: 'rect',
            clip: true,
            encode: {
                enter: tslib_1.__assign({ fill: { value: 'transparent' } }, vgStroke),
                update: update
            }
        });
    }
};
exports.default = interval;
/**
 * Returns the visual and data signals for an interval selection.
 */
function channelSignals(model, selCmpt, channel) {
    var vname = selection_1.channelSignalName(selCmpt, channel, 'visual');
    var dname = selection_1.channelSignalName(selCmpt, channel, 'data');
    var hasScales = scales_1.default.has(selCmpt);
    var scaleName = model.scaleName(channel);
    var scaleStr = util_1.stringValue(scaleName);
    var scale = model.getScaleComponent(channel);
    var scaleType = scale ? scale.get('type') : undefined;
    var size = model.getSizeSignalRef(channel === channel_1.X ? 'width' : 'height').signal;
    var coord = channel + "(unit)";
    var on = events(selCmpt, function (def, evt) {
        return def.concat({ events: evt.between[0], update: "[" + coord + ", " + coord + "]" }, // Brush Start
        { events: evt, update: "[" + vname + "[0], clamp(" + coord + ", 0, " + size + ")]" } // Brush End
        );
    });
    // React to pan/zooms of continuous scales. Non-continuous scales
    // (bin-linear, band, point) cannot be pan/zoomed and any other changes
    // to their domains (e.g., filtering) should clear the brushes.
    on.push({
        events: { signal: selCmpt.name + exports.SCALE_TRIGGER },
        update: scale_1.hasContinuousDomain(scaleType) && !scale_1.isBinScale(scaleType) ?
            "[scale(" + scaleStr + ", " + dname + "[0]), scale(" + scaleStr + ", " + dname + "[1])]" : "[0, 0]"
    });
    return hasScales ? [{ name: dname, on: [] }] : [{
            name: vname, value: [], on: on
        }, {
            name: dname,
            on: [{ events: { signal: vname }, update: vname + "[0] === " + vname + "[1] ? null : invert(" + scaleStr + ", " + vname + ")" }]
        }];
}
function events(selCmpt, cb) {
    return selCmpt.events.reduce(function (on, evt) {
        if (!evt.between) {
            log_1.warn(evt + " is not an ordered event stream for interval selections");
            return on;
        }
        return cb(on, evt);
    }, []);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJ2YWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vaW50ZXJ2YWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUNBQW1DO0FBQ25DLGlDQUErQjtBQUMvQixxQ0FBNEQ7QUFDNUQsbUNBQTZDO0FBRzdDLHlDQVFxQjtBQUNyQiw4Q0FBeUM7QUFFNUIsUUFBQSxLQUFLLEdBQUcsUUFBUSxDQUFDO0FBQ2pCLFFBQUEsYUFBYSxHQUFHLGdCQUFnQixDQUFDO0FBRTlDLElBQU0sUUFBUSxHQUFxQjtJQUNqQyxTQUFTLEVBQUUsWUFBWTtJQUN2QixXQUFXLEVBQUUsa0JBQWtCO0lBRS9CLE9BQU8sRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPO1FBQzlCLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDMUIsSUFBTSxTQUFTLEdBQUcsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEMsSUFBTSxPQUFPLEdBQVUsRUFBRSxDQUFDO1FBQzFCLElBQU0sU0FBUyxHQUFVLEVBQUUsQ0FBQztRQUM1QixJQUFNLGFBQWEsR0FBYSxFQUFFLENBQUM7UUFDbkMsSUFBTSxhQUFhLEdBQVUsRUFBRSxDQUFDO1FBRWhDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLElBQU0sWUFBVSxHQUFHLDZDQUEyQyxrQkFBVyxDQUFDLElBQUksR0FBRyxhQUFLLENBQUcsQ0FBQztZQUMxRixNQUFNLENBQUMsT0FBTyxFQUFFLFVBQVMsQ0FBUSxFQUFFLEdBQWtCO2dCQUNuRCxJQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLEVBQUUs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