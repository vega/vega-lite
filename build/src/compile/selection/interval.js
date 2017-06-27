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
            var channel = p.encoding;
            if (channel !== channel_1.X && channel !== channel_1.Y) {
                log_1.warn('Interval selections only support x and y encoding channels.');
                return;
            }
            var cs = channelSignals(model, selCmpt, channel);
            var dname = selection_1.channelSignalName(selCmpt, channel, 'data');
            var vname = selection_1.channelSignalName(selCmpt, channel, 'visual');
            var scaleStr = util_1.stringValue(model.scaleName(channel));
            signals.push.apply(signals, cs);
            intervals.push("{encoding: " + util_1.stringValue(channel) + ", " +
                ("field: " + util_1.stringValue(p.field) + ", extent: " + dname + "}"));
            scaleTriggers.push({
                scaleName: model.scaleName(channel),
                expr: "(!isArray(" + dname + ") || " +
                    ("(invert(" + scaleStr + ", " + vname + ")[0] === " + dname + "[0] && ") +
                    ("invert(" + scaleStr + ", " + vname + ")[1] === " + dname + "[1]))")
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
        return signals.concat({
            name: name + selection_1.TUPLE,
            update: "{unit: " + util_1.stringValue(model.getName('')) + ", intervals: [" + intervals.join(', ') + "]}"
        });
    },
    modifyExpr: function (model, selCmpt) {
        var tpl = selCmpt.name + selection_1.TUPLE;
        return tpl + ', ' +
            (selCmpt.resolve === 'global' ? 'true' : "{unit: " + util_1.stringValue(model.getName('')) + "}");
    },
    marks: function (model, selCmpt, marks) {
        var name = selCmpt.name;
        var _a = projections(selCmpt), xi = _a.xi, yi = _a.yi;
        var tpl = name + selection_1.TUPLE;
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
                update[key] = [tslib_1.__assign({ test: store + ".length && " + store + "[0].unit === " + util_1.stringValue(model.getName('')) }, update[key]), { value: 0 }];
            });
        }
        // Two brush marks ensure that fill colors and other aesthetic choices do
        // not interefere with the core marks, but that the brushed region can still
        // be interacted with (e.g., dragging it around).
        return [{
                type: 'rect',
                encode: {
                    enter: {
                        fill: { value: '#333' },
                        fillOpacity: { value: 0.125 }
                    },
                    update: update
                }
            }].concat(marks, {
            name: name + exports.BRUSH,
            type: 'rect',
            encode: {
                enter: {
                    fill: { value: 'transparent' },
                    stroke: { value: 'white' }
                },
                update: update
            }
        });
    }
};
exports.default = interval;
function projections(selCmpt) {
    var x = null;
    var xi = null;
    var y = null;
    var yi = null;
    selCmpt.project.forEach(function (p, i) {
        if (p.encoding === channel_1.X) {
            x = p;
            xi = i;
        }
        else if (p.encoding === channel_1.Y) {
            y = p;
            yi = i;
        }
    });
    return { x: x, xi: xi, y: y, yi: yi };
}
exports.projections = projections;
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
            on: [{ events: { signal: vname }, update: "invert(" + scaleStr + ", " + vname + ")" }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJ2YWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vaW50ZXJ2YWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUNBQTRDO0FBQzVDLGlDQUErQjtBQUMvQixxQ0FBNEQ7QUFDNUQsbUNBQXFEO0FBR3JELHlDQUFxSDtBQUNySCw4Q0FBeUM7QUFHNUIsUUFBQSxLQUFLLEdBQUcsUUFBUSxDQUFDO0FBQ2pCLFFBQUEsYUFBYSxHQUFHLGdCQUFnQixDQUFDO0FBRTlDLElBQU0sUUFBUSxHQUFxQjtJQUNqQyxTQUFTLEVBQUUsWUFBWTtJQUN2QixXQUFXLEVBQUUsa0JBQWtCO0lBRS9CLE9BQU8sRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPO1FBQzlCLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDMUIsSUFBTSxTQUFTLEdBQUcsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEMsSUFBTSxPQUFPLEdBQVUsRUFBRSxDQUFDO1FBQzFCLElBQU0sU0FBUyxHQUFTLEVBQUUsQ0FBQztRQUMzQixJQUFNLGFBQWEsR0FBVSxFQUFFLENBQUM7UUFFaEMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsSUFBTSxZQUFVLEdBQUcsNkNBQTJDLGtCQUFXLENBQUMsSUFBSSxHQUFHLGFBQUssQ0FBRyxDQUFDO1lBQzFGLE1BQU0sQ0FBQyxPQUFPLEVBQUUsVUFBUyxDQUFRLEVBQUUsR0FBa0I7Z0JBQ25ELElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQ3RFLEVBQUUsQ0FBQyxDQUFD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