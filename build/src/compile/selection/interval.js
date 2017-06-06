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
var interval = {
    predicate: 'vlInterval',
    signals: function (model, selCmpt) {
        var signals = [], intervals = [], name = selCmpt.name;
        if (selCmpt.translate && !(scales_1.default.has(selCmpt))) {
            var filterExpr_1 = "!event.item || event.item.mark.name !== " + util_1.stringValue(name + exports.BRUSH);
            events(selCmpt, function (_, evt) {
                var filters = evt.between[0].filter || (evt.between[0].filter = []);
                if (filters.indexOf(filterExpr_1) < 0) {
                    filters.push(filterExpr_1);
                }
            });
        }
        selCmpt.project.forEach(function (p) {
            if (p.encoding !== channel_1.X && p.encoding !== channel_1.Y) {
                log_1.warn('Interval selections only support x and y encoding channels.');
                return;
            }
            var cs = channelSignals(model, selCmpt, p.encoding), csName = selection_1.channelSignalName(selCmpt, p.encoding, 'data');
            signals.push.apply(signals, cs);
            intervals.push("{encoding: " + util_1.stringValue(p.encoding) + ", " +
                ("field: " + util_1.stringValue(p.field) + ", extent: " + csName + "}"));
        });
        return signals.concat({ name: name, update: "[" + intervals.join(', ') + "]" });
    },
    tupleExpr: function (model, selCmpt) {
        return "intervals: " + selCmpt.name;
    },
    modifyExpr: function (model, selCmpt) {
        var tpl = selCmpt.name + selection_1.TUPLE;
        return tpl + ', ' +
            (selCmpt.resolve === 'global' ? 'true' : "{unit: " + util_1.stringValue(model.getName('')) + "}");
    },
    marks: function (model, selCmpt, marks) {
        var name = selCmpt.name, _a = projections(selCmpt), xi = _a.xi, yi = _a.yi, tpl = name + selection_1.TUPLE, store = "data(" + util_1.stringValue(selCmpt.name + selection_1.STORE) + ")";
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
    var x = null, xi = null, y = null, yi = null;
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
    var vname = selection_1.channelSignalName(selCmpt, channel, 'visual'), dname = selection_1.channelSignalName(selCmpt, channel, 'data'), hasScales = scales_1.default.has(selCmpt), scaleName = model.scaleName(channel), scaleStr = util_1.stringValue(scaleName), scaleType = model.getComponent('scales', channel).type, size = model.getSizeSignalRef(channel === channel_1.X ? 'width' : 'height').signal, coord = channel + "(unit)";
    var on = events(selCmpt, function (def, evt) {
        return def.concat({ events: evt.between[0], update: "[" + coord + ", " + coord + "]" }, // Brush Start
        { events: evt, update: "[" + vname + "[0], clamp(" + coord + ", 0, " + size + ")]" } // Brush End
        );
    });
    // React to pan/zooms of continuous scales. Non-continuous scales
    // (bin-linear, band, point) cannot be pan/zoomed and any other changes
    // to their domains (e.g., filtering) should clear the brushes.
    on.push({
        events: { scale: scaleName },
        update: scale_1.hasContinuousDomain(scaleType) && !scale_1.isBinScale(scaleType) ?
            "!isArray(" + dname + ") ? " + vname + " : " +
                ("[scale(" + scaleStr + ", " + dname + "[0]), scale(" + scaleStr + ", " + dname + "[1])]") :
            "[]"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJ2YWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vaW50ZXJ2YWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUNBQTRDO0FBQzVDLGlDQUErQjtBQUMvQixxQ0FBNEQ7QUFDNUQsbUNBQXFEO0FBR3JELHlDQUFxSDtBQUNySCw4Q0FBeUM7QUFFNUIsUUFBQSxLQUFLLEdBQUcsUUFBUSxDQUFDO0FBRTlCLElBQU0sUUFBUSxHQUFxQjtJQUNqQyxTQUFTLEVBQUUsWUFBWTtJQUV2QixPQUFPLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTztRQUM5QixJQUFNLE9BQU8sR0FBVSxFQUFFLEVBQ3JCLFNBQVMsR0FBUyxFQUFFLEVBQ3BCLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBRXhCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDLGdCQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hELElBQU0sWUFBVSxHQUFHLDZDQUEyQyxrQkFBVyxDQUFDLElBQUksR0FBRyxhQUFLLENBQUcsQ0FBQztZQUMxRixNQUFNLENBQUMsT0FBTyxFQUFFLFVBQVMsQ0FBUSxFQUFFLEdBQWtCO2dCQUNuRCxJQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUN0RSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBVSxDQUFDLENBQUM7Z0JBQzNCLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FB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