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
        var _a = selection_1.spatialProjections(selCmpt), xi = _a.xi, yi = _a.yi;
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