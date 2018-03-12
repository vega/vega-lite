"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var vega_util_1 = require("vega-util");
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
            var filterExpr_1 = "!event.item || event.item.mark.name !== " + vega_util_1.stringValue(name + exports.BRUSH);
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
            var scaleStr = vega_util_1.stringValue(model.scaleName(channel));
            var scaleType = model.getScaleComponent(channel).get('type');
            var toNum = scale_1.hasContinuousDomain(scaleType) ? '+' : '';
            signals.push.apply(signals, cs);
            tupleTriggers.push(dname);
            intervals.push("{encoding: " + vega_util_1.stringValue(channel) + ", " +
                ("field: " + vega_util_1.stringValue(p.field) + ", extent: " + dname + "}"));
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
        var store = "data(" + vega_util_1.stringValue(selCmpt.name + selection_1.STORE) + ")";
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
            for (var _i = 0, _b = util_1.keys(update); _i < _b.length; _i++) {
                var key = _b[_i];
                update[key] = [__assign({ test: store + ".length && " + store + "[0].unit === " + selection_1.unitName(model) }, update[key]), { value: 0 }];
            }
        }
        // Two brush marks ensure that fill colors and other aesthetic choices do
        // not interefere with the core marks, but that the brushed region can still
        // be interacted with (e.g., dragging it around).
        var _c = selCmpt.mark, fill = _c.fill, fillOpacity = _c.fillOpacity, stroke = __rest(_c, ["fill", "fillOpacity"]);
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
                enter: __assign({ fill: { value: 'transparent' } }, vgStroke),
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
    var scaleStr = vega_util_1.stringValue(scaleName);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJ2YWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vaW50ZXJ2YWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVDQUFzQztBQUN0Qyx5Q0FBbUM7QUFDbkMsaUNBQStCO0FBQy9CLHFDQUE0RDtBQUM1RCxtQ0FBZ0M7QUFHaEMseUNBUXFCO0FBQ3JCLDhDQUF5QztBQUU1QixRQUFBLEtBQUssR0FBRyxRQUFRLENBQUM7QUFDakIsUUFBQSxhQUFhLEdBQUcsZ0JBQWdCLENBQUM7QUFFOUMsSUFBTSxRQUFRLEdBQXFCO0lBQ2pDLFNBQVMsRUFBRSxZQUFZO0lBQ3ZCLFdBQVcsRUFBRSxrQkFBa0I7SUFFL0IsT0FBTyxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU87UUFDOUIsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztRQUMxQixJQUFNLFNBQVMsR0FBRyxnQkFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0QyxJQUFNLE9BQU8sR0FBVSxFQUFFLENBQUM7UUFDMUIsSUFBTSxTQUFTLEdBQVUsRUFBRSxDQUFDO1FBQzVCLElBQU0sYUFBYSxHQUFhLEVBQUUsQ0FBQztRQUNuQyxJQUFNLGFBQWEsR0FBVSxFQUFFLENBQUM7UUFFaEMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsSUFBTSxZQUFVLEdBQUcsNkNBQTJDLHVCQUFXLENBQUMsSUFBSSxHQUFHLGFBQUssQ0FBRyxDQUFDO1lBQzFGLE1BQU0sQ0FBQyxPQUFPLEVBQUUsVUFBUyxDQUFRLEVBQUUsR0FBa0I7Z0JBQ25ELElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxD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QUFDVCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtzdHJpbmdWYWx1ZX0gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCB7WCwgWX0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge3dhcm59IGZyb20gJy4uLy4uL2xvZyc7XG5pbXBvcnQge2hhc0NvbnRpbnVvdXNEb21haW4sIGlzQmluU2NhbGV9IGZyb20gJy4uLy4uL3NjYWxlJztcbmltcG9ydCB7a2V5c30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnRXZlbnRTdHJlYW19IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCB7XG4gIGNoYW5uZWxTaWduYWxOYW1lLFxuICBwb3NpdGlvbmFsUHJvamVjdGlvbnMsXG4gIFNlbGVjdGlvbkNvbXBpbGVyLFxuICBTZWxlY3Rpb25Db21wb25lbnQsXG4gIFNUT1JFLFxuICBUVVBMRSxcbiAgdW5pdE5hbWUsXG59IGZyb20gJy4vc2VsZWN0aW9uJztcbmltcG9ydCBzY2FsZXMgZnJvbSAnLi90cmFuc2Zvcm1zL3NjYWxlcyc7XG5cbmV4cG9ydCBjb25zdCBCUlVTSCA9ICdfYnJ1c2gnO1xuZXhwb3J0IGNvbnN0IFNDQUxFX1RSSUdHRVIgPSAnX3NjYWxlX3RyaWdnZXInO1xuXG5jb25zdCBpbnRlcnZhbDpTZWxlY3Rpb25Db21waWxlciA9IHtcbiAgcHJlZGljYXRlOiAndmxJbnRlcnZhbCcsXG4gIHNjYWxlRG9tYWluOiAndmxJbnRlcnZhbERvbWFpbicsXG5cbiAgc2lnbmFsczogZnVuY3Rpb24obW9kZWwsIHNlbENtcHQpIHtcbiAgICBjb25zdCBuYW1lID0gc2VsQ21wdC5uYW1lO1xuICAgIGNvbnN0IGhhc1NjYWxlcyA9IHNjYWxlcy5oYXMoc2VsQ21wdCk7XG4gICAgY29uc3Qgc2lnbmFsczogYW55W10gPSBbXTtcbiAgICBjb25zdCBpbnRlcnZhbHM6IGFueVtdID0gW107XG4gICAgY29uc3QgdHVwbGVUcmlnZ2Vyczogc3RyaW5nW10gPSBbXTtcbiAgICBjb25zdCBzY2FsZVRyaWdnZXJzOiBhbnlbXSA9IFtdO1xuXG4gICAgaWYgKHNlbENtcHQudHJhbnNsYXRlICYmICFoYXNTY2FsZXMpIHtcbiAgICAgIGNvbnN0IGZpbHRlckV4cHIgPSBgIWV2ZW50Lml0ZW0gfHwgZXZlbnQuaXRlbS5tYXJrLm5hbWUgIT09ICR7c3RyaW5nVmFsdWUobmFtZSArIEJSVVNIKX1gO1xuICAgICAgZXZlbnRzKHNlbENtcHQsIGZ1bmN0aW9uKF86IGFueVtdLCBldnQ6IFZnRXZlbnRTdHJlYW0pIHtcbiAgICAgICAgY29uc3QgZmlsdGVycyA9IGV2dC5iZXR3ZWVuWzBdLmZpbHRlciB8fCAoZXZ0LmJldHdlZW5bMF0uZmlsdGVyID0gW10pO1xuICAgICAgICBpZiAoZmlsdGVycy5pbmRleE9mKGZpbHRlckV4cHIpIDwgMCkge1xuICAgICAgICAgIGZpbHRlcnMucHVzaChmaWx0ZXJFeHByKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2VsQ21wdC5wcm9qZWN0LmZvckVhY2goZnVuY3Rpb24ocCkge1xuICAgICAgY29uc3QgY2hhbm5lbCA9IHAuY2hhbm5lbDtcbiAgICAgIGlmIChjaGFubmVsICE9PSBYICYmIGNoYW5uZWwgIT09IFkpIHtcbiAgICAgICAgd2FybignSW50ZXJ2YWwgc2VsZWN0aW9ucyBvbmx5IHN1cHBvcnQgeCBhbmQgeSBlbmNvZGluZyBjaGFubmVscy4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjcyA9IGNoYW5uZWxTaWduYWxzKG1vZGVsLCBzZWxDbXB0LCBjaGFubmVsKTtcbiAgICAgIGNvbnN0IGRuYW1lID0gY2hhbm5lbFNpZ25hbE5hbWUoc2VsQ21wdCwgY2hhbm5lbCwgJ2RhdGEnKTtcbiAgICAgIGNvbnN0IHZuYW1lID0gY2hhbm5lbFNpZ25hbE5hbWUoc2VsQ21wdCwgY2hhbm5lbCwgJ3Zpc3VhbCcpO1xuICAgICAgY29uc3Qgc2NhbGVTdHIgPSBzdHJpbmdWYWx1ZShtb2RlbC5zY2FsZU5hbWUoY2hhbm5lbCkpO1xuICAgICAgY29uc3Qgc2NhbGVUeXBlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCkuZ2V0KCd0eXBlJyk7XG4gICAgICBjb25zdCB0b051bSA9IGhhc0NvbnRpbnVvdXNEb21haW4oc2NhbGVUeXBlKSA/ICcrJyA6ICcnO1xuXG4gICAgICBzaWduYWxzLnB1c2guYXBwbHkoc2lnbmFscywgY3MpO1xuICAgICAgdHVwbGVUcmlnZ2Vycy5wdXNoKGRuYW1lKTtcbiAgICAgIGludGVydmFscy5wdXNoKGB7ZW5jb2Rpbmc6ICR7c3RyaW5nVmFsdWUoY2hhbm5lbCl9LCBgICtcbiAgICAgICAgYGZpZWxkOiAke3N0cmluZ1ZhbHVlKHAuZmllbGQpfSwgZXh0ZW50OiAke2RuYW1lfX1gKTtcblxuICAgICAgc2NhbGVUcmlnZ2Vycy5wdXNoKHtcbiAgICAgICAgc2NhbGVOYW1lOiBtb2RlbC5zY2FsZU5hbWUoY2hhbm5lbCksXG4gICAgICAgIGV4cHI6IGAoIWlzQXJyYXkoJHtkbmFtZX0pIHx8IGAgK1xuICAgICAgICAgIGAoJHt0b051bX1pbnZlcnQoJHtzY2FsZVN0cn0sICR7dm5hbWV9KVswXSA9PT0gJHt0b051bX0ke2RuYW1lfVswXSAmJiBgICtcbiAgICAgICAgICAgIGAke3RvTnVtfWludmVydCgke3NjYWxlU3RyfSwgJHt2bmFtZX0pWzFdID09PSAke3RvTnVtfSR7ZG5hbWV9WzFdKSlgXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIFByb3h5IHNjYWxlIHJlYWN0aW9ucyB0byBlbnN1cmUgdGhhdCBhbiBpbmZpbml0ZSBsb29wIGRvZXNuJ3Qgb2NjdXJcbiAgICAvLyB3aGVuIGFuIGludGVydmFsIHNlbGVjdGlvbiBmaWx0ZXIgdG91Y2hlcyB0aGUgc2NhbGUuXG4gICAgaWYgKCFoYXNTY2FsZXMpIHtcbiAgICAgIHNpZ25hbHMucHVzaCh7XG4gICAgICAgIG5hbWU6IG5hbWUgKyBTQ0FMRV9UUklHR0VSLFxuICAgICAgICB1cGRhdGU6IHNjYWxlVHJpZ2dlcnMubWFwKCh0KSA9PiB0LmV4cHIpLmpvaW4oJyAmJiAnKSArXG4gICAgICAgICAgYCA/ICR7bmFtZSArIFNDQUxFX1RSSUdHRVJ9IDoge31gXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBPbmx5IGFkZCBhbiBpbnRlcnZhbCB0byB0aGUgc3RvcmUgaWYgaXQgaGFzIHZhbGlkIGRhdGEgZXh0ZW50cy4gRGF0YSBleHRlbnRzXG4gICAgLy8gYXJlIHNldCB0byBudWxsIGlmIHBpeGVsIGV4dGVudHMgYXJlIGVxdWFsIHRvIGFjY291bnQgZm9yIGludGVydmFscyBvdmVyXG4gICAgLy8gb3JkaW5hbC9ub21pbmFsIGRvbWFpbnMgd2hpY2gsIHdoZW4gaW52ZXJ0ZWQsIHdpbGwgc3RpbGwgcHJvZHVjZSBhIHZhbGlkIGRhdHVtLlxuICAgIHJldHVybiBzaWduYWxzLmNvbmNhdCh7XG4gICAgICBuYW1lOiBuYW1lICsgVFVQTEUsXG4gICAgICBvbjogW3tcbiAgICAgICAgZXZlbnRzOiB0dXBsZVRyaWdnZXJzLm1hcCgodCkgPT4gKHtzaWduYWw6IHR9KSksXG4gICAgICAgIHVwZGF0ZTogdHVwbGVUcmlnZ2Vycy5qb2luKCcgJiYgJykgK1xuICAgICAgICAgIGAgPyB7dW5pdDogJHt1bml0TmFtZShtb2RlbCl9LCBpbnRlcnZhbHM6IFske2ludGVydmFscy5qb2luKCcsICcpfV19IDogbnVsbGBcbiAgICAgIH1dXG4gICAgfSk7XG4gIH0sXG5cbiAgbW9kaWZ5RXhwcjogZnVuY3Rpb24obW9kZWwsIHNlbENtcHQpIHtcbiAgICBjb25zdCB0cGwgPSBzZWxDbXB0Lm5hbWUgKyBUVVBMRTtcbiAgICByZXR1cm4gdHBsICsgJywgJyArXG4gICAgICAoc2VsQ21wdC5yZXNvbHZlID09PSAnZ2xvYmFsJyA/ICd0cnVlJyA6IGB7dW5pdDogJHt1bml0TmFtZShtb2RlbCl9fWApO1xuICB9LFxuXG4gIG1hcmtzOiBmdW5jdGlvbihtb2RlbCwgc2VsQ21wdCwgbWFya3MpIHtcbiAgICBjb25zdCBuYW1lID0gc2VsQ21wdC5uYW1lO1xuICAgIGNvbnN0IHt4aSwgeWl9ID0gcG9zaXRpb25hbFByb2plY3Rpb25zKHNlbENtcHQpO1xuICAgIGNvbnN0IHN0b3JlID0gYGRhdGEoJHtzdHJpbmdWYWx1ZShzZWxDbXB0Lm5hbWUgKyBTVE9SRSl9KWA7XG5cbiAgICAvLyBEbyBub3QgYWRkIGEgYnJ1c2ggaWYgd2UncmUgYmluZGluZyB0byBzY2FsZXMuXG4gICAgaWYgKHNjYWxlcy5oYXMoc2VsQ21wdCkpIHtcbiAgICAgIHJldHVybiBtYXJrcztcbiAgICB9XG5cbiAgICBjb25zdCB1cGRhdGU6IGFueSA9IHtcbiAgICAgIHg6IHhpICE9PSBudWxsID8ge3NpZ25hbDogYCR7bmFtZX1feFswXWB9IDoge3ZhbHVlOiAwfSxcbiAgICAgIHk6IHlpICE9PSBudWxsID8ge3NpZ25hbDogYCR7bmFtZX1feVswXWB9IDoge3ZhbHVlOiAwfSxcbiAgICAgIHgyOiB4aSAhPT0gbnVsbCA/IHtzaWduYWw6IGAke25hbWV9X3hbMV1gfSA6IHtmaWVsZDoge2dyb3VwOiAnd2lkdGgnfX0sXG4gICAgICB5MjogeWkgIT09IG51bGwgPyB7c2lnbmFsOiBgJHtuYW1lfV95WzFdYH0gOiB7ZmllbGQ6IHtncm91cDogJ2hlaWdodCd9fVxuICAgIH07XG5cbiAgICAvLyBJZiB0aGUgc2VsZWN0aW9uIGlzIHJlc29sdmVkIHRvIGdsb2JhbCwgb25seSBhIHNpbmdsZSBpbnRlcnZhbCBpcyBpblxuICAgIC8vIHRoZSBzdG9yZS4gV3JhcCBicnVzaCBtYXJrJ3MgZW5jb2RpbmdzIHdpdGggYSBwcm9kdWN0aW9uIHJ1bGUgdG8gdGVzdFxuICAgIC8vIHRoaXMgYmFzZWQgb24gdGhlIGB1bml0YCBwcm9wZXJ0eS4gSGlkZSB0aGUgYnJ1c2ggbWFyayBpZiBpdCBjb3JyZXNwb25kc1xuICAgIC8vIHRvIGEgdW5pdCBkaWZmZXJlbnQgZnJvbSB0aGUgb25lIGluIHRoZSBzdG9yZS5cbiAgICBpZiAoc2VsQ21wdC5yZXNvbHZlID09PSAnZ2xvYmFsJykge1xuICAgICAgZm9yIChjb25zdCBrZXkgb2Yga2V5cyh1cGRhdGUpKSB7XG4gICAgICAgIHVwZGF0ZVtrZXldID0gW3tcbiAgICAgICAgICB0ZXN0OiBgJHtzdG9yZX0ubGVuZ3RoICYmICR7c3RvcmV9WzBdLnVuaXQgPT09ICR7dW5pdE5hbWUobW9kZWwpfWAsXG4gICAgICAgICAgLi4udXBkYXRlW2tleV1cbiAgICAgICAgfSwge3ZhbHVlOiAwfV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVHdvIGJydXNoIG1hcmtzIGVuc3VyZSB0aGF0IGZpbGwgY29sb3JzIGFuZCBvdGhlciBhZXN0aGV0aWMgY2hvaWNlcyBkb1xuICAgIC8vIG5vdCBpbnRlcmVmZXJlIHdpdGggdGhlIGNvcmUgbWFya3MsIGJ1dCB0aGF0IHRoZSBicnVzaGVkIHJlZ2lvbiBjYW4gc3RpbGxcbiAgICAvLyBiZSBpbnRlcmFjdGVkIHdpdGggKGUuZy4sIGRyYWdnaW5nIGl0IGFyb3VuZCkuXG4gICAgY29uc3Qge2ZpbGwsIGZpbGxPcGFjaXR5LCAuLi5zdHJva2V9ID0gc2VsQ21wdC5tYXJrO1xuICAgIGNvbnN0IHZnU3Ryb2tlID0ga2V5cyhzdHJva2UpLnJlZHVjZSgoZGVmLCBrKSA9PiB7XG4gICAgICBkZWZba10gPSB7dmFsdWU6IHN0cm9rZVtrXX07XG4gICAgICByZXR1cm4gZGVmO1xuICAgIH0sIHt9KTtcblxuICAgIHJldHVybiBbe1xuICAgICAgbmFtZTogbmFtZSArIEJSVVNIICsgJ19iZycsXG4gICAgICB0eXBlOiAncmVjdCcsXG4gICAgICBjbGlwOiB0cnVlLFxuICAgICAgZW5jb2RlOiB7XG4gICAgICAgIGVudGVyOiB7XG4gICAgICAgICAgZmlsbDoge3ZhbHVlOiBmaWxsfSxcbiAgICAgICAgICBmaWxsT3BhY2l0eToge3ZhbHVlOiBmaWxsT3BhY2l0eX1cbiAgICAgICAgfSxcbiAgICAgICAgdXBkYXRlOiB1cGRhdGVcbiAgICAgIH1cbiAgICB9IGFzIGFueV0uY29uY2F0KG1hcmtzLCB7XG4gICAgICBuYW1lOiBuYW1lICsgQlJVU0gsXG4gICAgICB0eXBlOiAncmVjdCcsXG4gICAgICBjbGlwOiB0cnVlLFxuICAgICAgZW5jb2RlOiB7XG4gICAgICAgIGVudGVyOiB7XG4gICAgICAgICAgZmlsbDoge3ZhbHVlOiAndHJhbnNwYXJlbnQnfSxcbiAgICAgICAgICAuLi52Z1N0cm9rZVxuICAgICAgICB9LFxuICAgICAgICB1cGRhdGU6IHVwZGF0ZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59O1xuZXhwb3J0IHtpbnRlcnZhbCBhcyBkZWZhdWx0fTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSB2aXN1YWwgYW5kIGRhdGEgc2lnbmFscyBmb3IgYW4gaW50ZXJ2YWwgc2VsZWN0aW9uLlxuICovXG5mdW5jdGlvbiBjaGFubmVsU2lnbmFscyhtb2RlbDogVW5pdE1vZGVsLCBzZWxDbXB0OiBTZWxlY3Rpb25Db21wb25lbnQsIGNoYW5uZWw6ICd4J3wneScpOiBhbnkge1xuICBjb25zdCB2bmFtZSA9IGNoYW5uZWxTaWduYWxOYW1lKHNlbENtcHQsIGNoYW5uZWwsICd2aXN1YWwnKTtcbiAgY29uc3QgZG5hbWUgPSBjaGFubmVsU2lnbmFsTmFtZShzZWxDbXB0LCBjaGFubmVsLCAnZGF0YScpO1xuICBjb25zdCBoYXNTY2FsZXMgPSBzY2FsZXMuaGFzKHNlbENtcHQpO1xuICBjb25zdCBzY2FsZU5hbWUgPSBtb2RlbC5zY2FsZU5hbWUoY2hhbm5lbCk7XG4gIGNvbnN0IHNjYWxlU3RyID0gc3RyaW5nVmFsdWUoc2NhbGVOYW1lKTtcbiAgY29uc3Qgc2NhbGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKTtcbiAgY29uc3Qgc2NhbGVUeXBlID0gc2NhbGUgPyBzY2FsZS5nZXQoJ3R5cGUnKSA6IHVuZGVmaW5lZDtcbiAgY29uc3Qgc2l6ZSA9IG1vZGVsLmdldFNpemVTaWduYWxSZWYoY2hhbm5lbCA9PT0gWCA/ICd3aWR0aCcgOiAnaGVpZ2h0Jykuc2lnbmFsO1xuICBjb25zdCBjb29yZCA9IGAke2NoYW5uZWx9KHVuaXQpYDtcblxuICBjb25zdCBvbiA9IGV2ZW50cyhzZWxDbXB0LCBmdW5jdGlvbihkZWY6IGFueVtdLCBldnQ6IFZnRXZlbnRTdHJlYW0pIHtcbiAgICByZXR1cm4gZGVmLmNvbmNhdChcbiAgICAgIHtldmVudHM6IGV2dC5iZXR3ZWVuWzBdLCB1cGRhdGU6IGBbJHtjb29yZH0sICR7Y29vcmR9XWB9LCAgICAgICAgICAgLy8gQnJ1c2ggU3RhcnRcbiAgICAgIHtldmVudHM6IGV2dCwgdXBkYXRlOiBgWyR7dm5hbWV9WzBdLCBjbGFtcCgke2Nvb3JkfSwgMCwgJHtzaXplfSldYH0gLy8gQnJ1c2ggRW5kXG4gICAgKTtcbiAgfSk7XG5cbiAgLy8gUmVhY3QgdG8gcGFuL3pvb21zIG9mIGNvbnRpbnVvdXMgc2NhbGVzLiBOb24tY29udGludW91cyBzY2FsZXNcbiAgLy8gKGJpbi1saW5lYXIsIGJhbmQsIHBvaW50KSBjYW5ub3QgYmUgcGFuL3pvb21lZCBhbmQgYW55IG90aGVyIGNoYW5nZXNcbiAgLy8gdG8gdGhlaXIgZG9tYWlucyAoZS5nLiwgZmlsdGVyaW5nKSBzaG91bGQgY2xlYXIgdGhlIGJydXNoZXMuXG4gIG9uLnB1c2goe1xuICAgIGV2ZW50czoge3NpZ25hbDogc2VsQ21wdC5uYW1lICsgU0NBTEVfVFJJR0dFUn0sXG4gICAgdXBkYXRlOiBoYXNDb250aW51b3VzRG9tYWluKHNjYWxlVHlwZSkgJiYgIWlzQmluU2NhbGUoc2NhbGVUeXBlKSA/XG4gICAgICBgW3NjYWxlKCR7c2NhbGVTdHJ9LCAke2RuYW1lfVswXSksIHNjYWxlKCR7c2NhbGVTdHJ9LCAke2RuYW1lfVsxXSldYCA6IGBbMCwgMF1gXG4gIH0pO1xuXG4gIHJldHVybiBoYXNTY2FsZXMgPyBbe25hbWU6IGRuYW1lLCBvbjogW119XSA6IFt7XG4gICAgbmFtZTogdm5hbWUsIHZhbHVlOiBbXSwgb246IG9uXG4gIH0sIHtcbiAgICBuYW1lOiBkbmFtZSxcbiAgICBvbjogW3tldmVudHM6IHtzaWduYWw6IHZuYW1lfSwgdXBkYXRlOiBgJHt2bmFtZX1bMF0gPT09ICR7dm5hbWV9WzFdID8gbnVsbCA6IGludmVydCgke3NjYWxlU3RyfSwgJHt2bmFtZX0pYH1dXG4gIH1dO1xufVxuXG5mdW5jdGlvbiBldmVudHMoc2VsQ21wdDogU2VsZWN0aW9uQ29tcG9uZW50LCBjYjogRnVuY3Rpb24pIHtcbiAgcmV0dXJuIHNlbENtcHQuZXZlbnRzLnJlZHVjZShmdW5jdGlvbihvbjogYW55W10sIGV2dDogVmdFdmVudFN0cmVhbSkge1xuICAgIGlmICghZXZ0LmJldHdlZW4pIHtcbiAgICAgIHdhcm4oYCR7ZXZ0fSBpcyBub3QgYW4gb3JkZXJlZCBldmVudCBzdHJlYW0gZm9yIGludGVydmFsIHNlbGVjdGlvbnNgKTtcbiAgICAgIHJldHVybiBvbjtcbiAgICB9XG4gICAgcmV0dXJuIGNiKG9uLCBldnQpO1xuICB9LCBbXSk7XG59XG4iXX0=