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
    scaleDomain: 'vlIntervalDomain',
    signals: function (model, selCmpt) {
        var signals = [];
        var intervals = [];
        var name = selCmpt.name;
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
            var cs = channelSignals(model, selCmpt, p.encoding);
            var csName = selection_1.channelSignalName(selCmpt, p.encoding, 'data');
            signals.push.apply(signals, cs);
            intervals.push("{encoding: " + util_1.stringValue(p.encoding) + ", " +
                ("field: " + util_1.stringValue(p.field) + ", extent: " + csName + "}"));
        });
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
    if (scale_1.hasContinuousDomain(scaleType) && !scale_1.isBinScale(scaleType)) {
        on.push({
            events: { scale: scaleName },
            update: "!isArray(" + dname + ") ? " + vname + " : " +
                ("[scale(" + scaleStr + ", " + dname + "[0]), scale(" + scaleStr + ", " + dname + "[1])]")
        });
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJ2YWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vaW50ZXJ2YWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUNBQTRDO0FBQzVDLGlDQUErQjtBQUMvQixxQ0FBNEQ7QUFDNUQsbUNBQXFEO0FBR3JELHlDQUFxSDtBQUNySCw4Q0FBeUM7QUFHNUIsUUFBQSxLQUFLLEdBQUcsUUFBUSxDQUFDO0FBRTlCLElBQU0sUUFBUSxHQUFxQjtJQUNqQyxTQUFTLEVBQUUsWUFBWTtJQUN2QixXQUFXLEVBQUUsa0JBQWtCO0lBRS9CLE9BQU8sRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPO1FBQzlCLElBQU0sT0FBTyxHQUFVLEVBQUUsQ0FBQztRQUMxQixJQUFNLFNBQVMsR0FBUyxFQUFFLENBQUM7UUFDM0IsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztRQUUxQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQyxnQkFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoRCxJQUFNLFlBQVUsR0FBRyw2Q0FBMkMsa0JBQVcsQ0FBQyxJQUFJLEdBQUcsYUFBSyxDQUFHLENBQUM7WUFDMUYsTUFBTSxDQUFDLE9BQU8sRUFBRSxVQUFTLENBQVEsRUFBRSxHQUFrQjtnQkFDbkQsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDdEUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNwQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVUsQ0FBQyxDQUFDO2dCQUMzQixDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBUyxDQUFDO1lBQ2hDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEtBQUssV0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEtBQUssV0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekMsVUFBSSxDQUFDLDZEQUE2RCxDQUFDLENBQUM7Z0JBQ3BFLE1BQU0sQ0FBQztZQUNULENBQUM7WUFFRCxJQUFNLEVBQUUsR0FBRyxjQUFjLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdEQsSUFBTSxNQUFNLEdBQUcsNkJBQWlCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDOUQsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ2hDLFNBQVMsQ0FBQyxJQUFJLENBQUMsZ0JBQWMsa0JBQVcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQUk7aUJBQ3hELFlBQVUsa0JBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGtCQUFhLE1BQU0sTUFBRyxDQUFBLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1lBQ3BCLElBQUksRUFBRSxJQUFJLEdBQUcsaUJBQUs7WUFDbEIsTUFBTSxFQUFFLFlBQVUsa0JBQVcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLHNCQUFpQixTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFJO1NBQzFGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxVQUFVLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTztRQUNqQyxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLGlCQUFLLENBQUM7UUFDakMsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJO1lBQ2YsQ0FBQyxPQUFPLENBQUMsT0FBTyxLQUFLLFFBQVEsR0FBRyxNQUFNLEdBQUcsWUFBVSxrQkFBVyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBRyxDQUFDLENBQUM7SUFDMUYsQ0FBQztJQUVELEtBQUssRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSztRQUNuQyxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQ3BCLElBQUEseUJBQStCLEVBQTlCLFVBQUUsRUFBRSxVQUFFLENBQXlCO1FBQ3RDLElBQU0sR0FBRyxHQUFHLElBQUksR0FBRyxpQkFBSyxDQUFDO1FBQ3pCLElBQU0sS0FBSyxHQUFHLFVBQVEsa0JBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLGlCQUFLLENBQUMsTUFBRyxDQUFDO1FBRTNELGlEQUFpRDtRQUNqRCxFQUFFLENBQUMsQ0FBQyxnQkFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNmLENBQUM7UUFFRCxJQUFNLE1BQU0sR0FBRztZQUNiLENBQUMsRUFBRSxFQUFFLEtBQUssSUFBSSxHQUFHLEVBQUMsTUFBTSxFQUFLLElBQUksVUFBTyxFQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFDO1lBQ3RELENBQUMsRUFBRSxFQUFFLEtBQUssSUFBSSxHQUFHLEVBQUMsTUFBTSxFQUFLLElBQUksVUFBTyxFQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFDO1lBQ3RELEVBQUUsRUFBRSxFQUFFLEtBQUssSUFBSSxHQUFHLEVBQUMsTUFBTSxFQUFLLElBQUksVUFBTyxFQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFDLEVBQUM7WUFDdEUsRUFBRSxFQUFFLEVBQUUsS0FBSyxJQUFJLEdBQUcsRUFBQyxNQUFNLEVBQUssSUFBSSxVQUFPLEVBQUMsR0FBRyxFQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUMsRUFBQztTQUN4RSxDQUFDO1FBRUYsdUVBQXVFO1FBQ3ZFLHdFQUF3RTtRQUN4RSwyRUFBMkU7UUFDM0UsaURBQWlEO1FBQ2pELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNqQyxXQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVMsR0FBRztnQkFDL0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLG9CQUNaLElBQUksRUFBSyxLQUFLLG1CQUFjLEtBQUsscUJBQWdCLGtCQUFXLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBRyxJQUM5RSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQ2IsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUNqQixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRCx5RUFBeUU7UUFDekUsNEVBQTRFO1FBQzVFLGlEQUFpRDtRQUNqRCxNQUFNLENBQUMsQ0FBQztnQkFDTixJQUFJLEVBQUUsTUFBTTtnQkFDWixNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFO3dCQUNMLElBQUksRUFBRSxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUM7d0JBQ3JCLFdBQVcsRUFBRSxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUM7cUJBQzVCO29CQUNELE1BQU0sRUFBRSxNQUFNO2lCQUNmO2FBQ0ssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7WUFDdEIsSUFBSSxFQUFFLElBQUksR0FBRyxhQUFLO1lBQ2xCLElBQUksRUFBRSxNQUFNO1lBQ1osTUFBTSxFQUFFO2dCQUNOLEtBQUssRUFBRTtvQkFDTCxJQUFJLEVBQUUsRUFBQyxLQUFLLEVBQUUsYUFBYSxFQUFDO29CQUM1QixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFDO2lCQUN6QjtnQkFDRCxNQUFNLEVBQUUsTUFBTTthQUNmO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGLENBQUM7QUFDa0IsMkJBQU87QUFFM0IscUJBQTRCLE9BQTJCO0lBQ3JELElBQUksQ0FBQyxHQUFvQixJQUFJLENBQUM7SUFDOUIsSUFBSSxFQUFFLEdBQVUsSUFBSSxDQUFDO0lBQ3JCLElBQUksQ0FBQyxHQUFvQixJQUFJLENBQUM7SUFDOUIsSUFBSSxFQUFFLEdBQVcsSUFBSSxDQUFDO0lBRXRCLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVMsQ0FBQyxFQUFFLENBQUM7UUFDbkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsS0FBSyxXQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLENBQUMsR0FBSSxDQUFDLENBQUM7WUFDUCxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ1QsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxLQUFLLFdBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNOLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDVCxDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsRUFBQyxDQUFDLEdBQUEsRUFBRSxFQUFFLElBQUEsRUFBRSxDQUFDLEdBQUEsRUFBRSxFQUFFLElBQUEsRUFBQyxDQUFDO0FBQ3hCLENBQUM7QUFoQkQsa0NBZ0JDO0FBRUQ7O0dBRUc7QUFDSCx3QkFBd0IsS0FBZ0IsRUFBRSxPQUEyQixFQUFFLE9BQWdCO0lBQ3JGLElBQU0sS0FBSyxHQUFHLDZCQUFpQixDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDNUQsSUFBTSxLQUFLLEdBQUcsNkJBQWlCLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMxRCxJQUFNLFNBQVMsR0FBRyxnQkFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN0QyxJQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzNDLElBQU0sUUFBUSxHQUFHLGtCQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDeEMsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQy9DLElBQU0sU0FBUyxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUN4RCxJQUFNLElBQUksR0FBSSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxLQUFLLFdBQUMsR0FBRyxPQUFPLEdBQUcsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQ2hGLElBQU0sS0FBSyxHQUFNLE9BQU8sV0FBUSxDQUFDO0lBRWpDLElBQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsVUFBUyxHQUFVLEVBQUUsR0FBa0I7UUFDaEUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQ2YsRUFBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBSSxLQUFLLFVBQUssS0FBSyxNQUFHLEVBQUMsRUFBWSxjQUFjO1FBQ2xGLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBSSxLQUFLLG1CQUFjLEtBQUssYUFBUSxJQUFJLE9BQUksRUFBQyxDQUFDLFlBQVk7U0FDakYsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUgsaUVBQWlFO0lBQ2pFLHVFQUF1RTtJQUN2RSwrREFBK0Q7SUFDL0QsRUFBRSxDQUFDLENBQUMsMkJBQW1CLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxrQkFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RCxFQUFFLENBQUMsSUFBSSxDQUFDO1lBQ04sTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLFNBQVMsRUFBQztZQUMxQixNQUFNLEVBQUUsY0FBWSxLQUFLLFlBQU8sS0FBSyxRQUFLO2lCQUN0QyxZQUFVLFFBQVEsVUFBSyxLQUFLLG9CQUFlLFFBQVEsVUFBSyxLQUFLLFVBQU8sQ0FBQTtTQUN6RSxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsTUFBTSxDQUFDLFNBQVMsR0FBRyxDQUFDLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFDLENBQUMsR0FBRyxDQUFDO1lBQzVDLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtTQUMvQixFQUFFO1lBQ0QsSUFBSSxFQUFFLEtBQUs7WUFDWCxFQUFFLEVBQUUsQ0FBQyxFQUFDLE1BQU0sRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsRUFBRSxNQUFNLEVBQUUsWUFBVSxRQUFRLFVBQUssS0FBSyxNQUFHLEVBQUMsQ0FBQztTQUN6RSxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsZ0JBQWdCLE9BQTJCLEVBQUUsRUFBWTtJQUN2RCxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBUyxFQUFTLEVBQUUsR0FBa0I7UUFDakUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNqQixVQUFJLENBQUksR0FBRyw0REFBeUQsQ0FBQyxDQUFDO1lBQ3RFLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDWixDQUFDO1FBQ0QsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDckIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ1QsQ0FBQyJ9