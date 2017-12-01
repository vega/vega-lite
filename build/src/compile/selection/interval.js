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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJ2YWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vaW50ZXJ2YWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUFtQztBQUNuQyxpQ0FBK0I7QUFDL0IscUNBQTREO0FBQzVELG1DQUE2QztBQUc3Qyx5Q0FRcUI7QUFDckIsOENBQXlDO0FBRTVCLFFBQUEsS0FBSyxHQUFHLFFBQVEsQ0FBQztBQUNqQixRQUFBLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQztBQUU5QyxJQUFNLFFBQVEsR0FBcUI7SUFDakMsU0FBUyxFQUFFLFlBQVk7SUFDdkIsV0FBVyxFQUFFLGtCQUFrQjtJQUUvQixPQUFPLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTztRQUM5QixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQzFCLElBQU0sU0FBUyxHQUFHLGdCQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RDLElBQU0sT0FBTyxHQUFVLEVBQUUsQ0FBQztRQUMxQixJQUFNLFNBQVMsR0FBVSxFQUFFLENBQUM7UUFDNUIsSUFBTSxhQUFhLEdBQWEsRUFBRSxDQUFDO1FBQ25DLElBQU0sYUFBYSxHQUFVLEVBQUUsQ0FBQztRQUVoQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNwQyxJQUFNLFlBQVUsR0FBRyw2Q0FBMkMsa0JBQVcsQ0FBQyxJQUFJLEdBQUcsYUFBSyxDQUFHLENBQUM7WUFDMUYsTUFBTSxDQUFDLE9BQU8sRUFBRSxVQUFTLENBQVEsRUFBRSxHQUFrQjtnQkFDbkQsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFD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b3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1gsIFl9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHt3YXJufSBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtoYXNDb250aW51b3VzRG9tYWluLCBpc0JpblNjYWxlfSBmcm9tICcuLi8uLi9zY2FsZSc7XG5pbXBvcnQge2tleXMsIHN0cmluZ1ZhbHVlfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdFdmVudFN0cmVhbX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uL3VuaXQnO1xuaW1wb3J0IHtcbiAgY2hhbm5lbFNpZ25hbE5hbWUsXG4gIHBvc2l0aW9uYWxQcm9qZWN0aW9ucyxcbiAgU2VsZWN0aW9uQ29tcGlsZXIsXG4gIFNlbGVjdGlvbkNvbXBvbmVudCxcbiAgU1RPUkUsXG4gIFRVUExFLFxuICB1bml0TmFtZSxcbn0gZnJvbSAnLi9zZWxlY3Rpb24nO1xuaW1wb3J0IHNjYWxlcyBmcm9tICcuL3RyYW5zZm9ybXMvc2NhbGVzJztcblxuZXhwb3J0IGNvbnN0IEJSVVNIID0gJ19icnVzaCc7XG5leHBvcnQgY29uc3QgU0NBTEVfVFJJR0dFUiA9ICdfc2NhbGVfdHJpZ2dlcic7XG5cbmNvbnN0IGludGVydmFsOlNlbGVjdGlvbkNvbXBpbGVyID0ge1xuICBwcmVkaWNhdGU6ICd2bEludGVydmFsJyxcbiAgc2NhbGVEb21haW46ICd2bEludGVydmFsRG9tYWluJyxcblxuICBzaWduYWxzOiBmdW5jdGlvbihtb2RlbCwgc2VsQ21wdCkge1xuICAgIGNvbnN0IG5hbWUgPSBzZWxDbXB0Lm5hbWU7XG4gICAgY29uc3QgaGFzU2NhbGVzID0gc2NhbGVzLmhhcyhzZWxDbXB0KTtcbiAgICBjb25zdCBzaWduYWxzOiBhbnlbXSA9IFtdO1xuICAgIGNvbnN0IGludGVydmFsczogYW55W10gPSBbXTtcbiAgICBjb25zdCB0dXBsZVRyaWdnZXJzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGNvbnN0IHNjYWxlVHJpZ2dlcnM6IGFueVtdID0gW107XG5cbiAgICBpZiAoc2VsQ21wdC50cmFuc2xhdGUgJiYgIWhhc1NjYWxlcykge1xuICAgICAgY29uc3QgZmlsdGVyRXhwciA9IGAhZXZlbnQuaXRlbSB8fCBldmVudC5pdGVtLm1hcmsubmFtZSAhPT0gJHtzdHJpbmdWYWx1ZShuYW1lICsgQlJVU0gpfWA7XG4gICAgICBldmVudHMoc2VsQ21wdCwgZnVuY3Rpb24oXzogYW55W10sIGV2dDogVmdFdmVudFN0cmVhbSkge1xuICAgICAgICBjb25zdCBmaWx0ZXJzID0gZXZ0LmJldHdlZW5bMF0uZmlsdGVyIHx8IChldnQuYmV0d2VlblswXS5maWx0ZXIgPSBbXSk7XG4gICAgICAgIGlmIChmaWx0ZXJzLmluZGV4T2YoZmlsdGVyRXhwcikgPCAwKSB7XG4gICAgICAgICAgZmlsdGVycy5wdXNoKGZpbHRlckV4cHIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzZWxDbXB0LnByb2plY3QuZm9yRWFjaChmdW5jdGlvbihwKSB7XG4gICAgICBjb25zdCBjaGFubmVsID0gcC5jaGFubmVsO1xuICAgICAgaWYgKGNoYW5uZWwgIT09IFggJiYgY2hhbm5lbCAhPT0gWSkge1xuICAgICAgICB3YXJuKCdJbnRlcnZhbCBzZWxlY3Rpb25zIG9ubHkgc3VwcG9ydCB4IGFuZCB5IGVuY29kaW5nIGNoYW5uZWxzLicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNzID0gY2hhbm5lbFNpZ25hbHMobW9kZWwsIHNlbENtcHQsIGNoYW5uZWwpO1xuICAgICAgY29uc3QgZG5hbWUgPSBjaGFubmVsU2lnbmFsTmFtZShzZWxDbXB0LCBjaGFubmVsLCAnZGF0YScpO1xuICAgICAgY29uc3Qgdm5hbWUgPSBjaGFubmVsU2lnbmFsTmFtZShzZWxDbXB0LCBjaGFubmVsLCAndmlzdWFsJyk7XG4gICAgICBjb25zdCBzY2FsZVN0ciA9IHN0cmluZ1ZhbHVlKG1vZGVsLnNjYWxlTmFtZShjaGFubmVsKSk7XG4gICAgICBjb25zdCBzY2FsZVR5cGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKS5nZXQoJ3R5cGUnKTtcbiAgICAgIGNvbnN0IHRvTnVtID0gaGFzQ29udGludW91c0RvbWFpbihzY2FsZVR5cGUpID8gJysnIDogJyc7XG5cbiAgICAgIHNpZ25hbHMucHVzaC5hcHBseShzaWduYWxzLCBjcyk7XG4gICAgICB0dXBsZVRyaWdnZXJzLnB1c2goZG5hbWUpO1xuICAgICAgaW50ZXJ2YWxzLnB1c2goYHtlbmNvZGluZzogJHtzdHJpbmdWYWx1ZShjaGFubmVsKX0sIGAgK1xuICAgICAgICBgZmllbGQ6ICR7c3RyaW5nVmFsdWUocC5maWVsZCl9LCBleHRlbnQ6ICR7ZG5hbWV9fWApO1xuXG4gICAgICBzY2FsZVRyaWdnZXJzLnB1c2goe1xuICAgICAgICBzY2FsZU5hbWU6IG1vZGVsLnNjYWxlTmFtZShjaGFubmVsKSxcbiAgICAgICAgZXhwcjogYCghaXNBcnJheSgke2RuYW1lfSkgfHwgYCArXG4gICAgICAgICAgYCgke3RvTnVtfWludmVydCgke3NjYWxlU3RyfSwgJHt2bmFtZX0pWzBdID09PSAke3RvTnVtfSR7ZG5hbWV9WzBdICYmIGAgK1xuICAgICAgICAgICAgYCR7dG9OdW19aW52ZXJ0KCR7c2NhbGVTdHJ9LCAke3ZuYW1lfSlbMV0gPT09ICR7dG9OdW19JHtkbmFtZX1bMV0pKWBcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gUHJveHkgc2NhbGUgcmVhY3Rpb25zIHRvIGVuc3VyZSB0aGF0IGFuIGluZmluaXRlIGxvb3AgZG9lc24ndCBvY2N1clxuICAgIC8vIHdoZW4gYW4gaW50ZXJ2YWwgc2VsZWN0aW9uIGZpbHRlciB0b3VjaGVzIHRoZSBzY2FsZS5cbiAgICBpZiAoIWhhc1NjYWxlcykge1xuICAgICAgc2lnbmFscy5wdXNoKHtcbiAgICAgICAgbmFtZTogbmFtZSArIFNDQUxFX1RSSUdHRVIsXG4gICAgICAgIHVwZGF0ZTogc2NhbGVUcmlnZ2Vycy5tYXAoKHQpID0+IHQuZXhwcikuam9pbignICYmICcpICtcbiAgICAgICAgICBgID8gJHtuYW1lICsgU0NBTEVfVFJJR0dFUn0gOiB7fWBcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIE9ubHkgYWRkIGFuIGludGVydmFsIHRvIHRoZSBzdG9yZSBpZiBpdCBoYXMgdmFsaWQgZGF0YSBleHRlbnRzLiBEYXRhIGV4dGVudHNcbiAgICAvLyBhcmUgc2V0IHRvIG51bGwgaWYgcGl4ZWwgZXh0ZW50cyBhcmUgZXF1YWwgdG8gYWNjb3VudCBmb3IgaW50ZXJ2YWxzIG92ZXJcbiAgICAvLyBvcmRpbmFsL25vbWluYWwgZG9tYWlucyB3aGljaCwgd2hlbiBpbnZlcnRlZCwgd2lsbCBzdGlsbCBwcm9kdWNlIGEgdmFsaWQgZGF0dW0uXG4gICAgcmV0dXJuIHNpZ25hbHMuY29uY2F0KHtcbiAgICAgIG5hbWU6IG5hbWUgKyBUVVBMRSxcbiAgICAgIG9uOiBbe1xuICAgICAgICBldmVudHM6IHR1cGxlVHJpZ2dlcnMubWFwKCh0KSA9PiAoe3NpZ25hbDogdH0pKSxcbiAgICAgICAgdXBkYXRlOiB0dXBsZVRyaWdnZXJzLmpvaW4oJyAmJiAnKSArXG4gICAgICAgICAgYCA/IHt1bml0OiAke3VuaXROYW1lKG1vZGVsKX0sIGludGVydmFsczogWyR7aW50ZXJ2YWxzLmpvaW4oJywgJyl9XX0gOiBudWxsYFxuICAgICAgfV1cbiAgICB9KTtcbiAgfSxcblxuICBtb2RpZnlFeHByOiBmdW5jdGlvbihtb2RlbCwgc2VsQ21wdCkge1xuICAgIGNvbnN0IHRwbCA9IHNlbENtcHQubmFtZSArIFRVUExFO1xuICAgIHJldHVybiB0cGwgKyAnLCAnICtcbiAgICAgIChzZWxDbXB0LnJlc29sdmUgPT09ICdnbG9iYWwnID8gJ3RydWUnIDogYHt1bml0OiAke3VuaXROYW1lKG1vZGVsKX19YCk7XG4gIH0sXG5cbiAgbWFya3M6IGZ1bmN0aW9uKG1vZGVsLCBzZWxDbXB0LCBtYXJrcykge1xuICAgIGNvbnN0IG5hbWUgPSBzZWxDbXB0Lm5hbWU7XG4gICAgY29uc3Qge3hpLCB5aX0gPSBwb3NpdGlvbmFsUHJvamVjdGlvbnMoc2VsQ21wdCk7XG4gICAgY29uc3Qgc3RvcmUgPSBgZGF0YSgke3N0cmluZ1ZhbHVlKHNlbENtcHQubmFtZSArIFNUT1JFKX0pYDtcblxuICAgIC8vIERvIG5vdCBhZGQgYSBicnVzaCBpZiB3ZSdyZSBiaW5kaW5nIHRvIHNjYWxlcy5cbiAgICBpZiAoc2NhbGVzLmhhcyhzZWxDbXB0KSkge1xuICAgICAgcmV0dXJuIG1hcmtzO1xuICAgIH1cblxuICAgIGNvbnN0IHVwZGF0ZTogYW55ID0ge1xuICAgICAgeDogeGkgIT09IG51bGwgPyB7c2lnbmFsOiBgJHtuYW1lfV94WzBdYH0gOiB7dmFsdWU6IDB9LFxuICAgICAgeTogeWkgIT09IG51bGwgPyB7c2lnbmFsOiBgJHtuYW1lfV95WzBdYH0gOiB7dmFsdWU6IDB9LFxuICAgICAgeDI6IHhpICE9PSBudWxsID8ge3NpZ25hbDogYCR7bmFtZX1feFsxXWB9IDoge2ZpZWxkOiB7Z3JvdXA6ICd3aWR0aCd9fSxcbiAgICAgIHkyOiB5aSAhPT0gbnVsbCA/IHtzaWduYWw6IGAke25hbWV9X3lbMV1gfSA6IHtmaWVsZDoge2dyb3VwOiAnaGVpZ2h0J319XG4gICAgfTtcblxuICAgIC8vIElmIHRoZSBzZWxlY3Rpb24gaXMgcmVzb2x2ZWQgdG8gZ2xvYmFsLCBvbmx5IGEgc2luZ2xlIGludGVydmFsIGlzIGluXG4gICAgLy8gdGhlIHN0b3JlLiBXcmFwIGJydXNoIG1hcmsncyBlbmNvZGluZ3Mgd2l0aCBhIHByb2R1Y3Rpb24gcnVsZSB0byB0ZXN0XG4gICAgLy8gdGhpcyBiYXNlZCBvbiB0aGUgYHVuaXRgIHByb3BlcnR5LiBIaWRlIHRoZSBicnVzaCBtYXJrIGlmIGl0IGNvcnJlc3BvbmRzXG4gICAgLy8gdG8gYSB1bml0IGRpZmZlcmVudCBmcm9tIHRoZSBvbmUgaW4gdGhlIHN0b3JlLlxuICAgIGlmIChzZWxDbXB0LnJlc29sdmUgPT09ICdnbG9iYWwnKSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBrZXlzKHVwZGF0ZSkpIHtcbiAgICAgICAgdXBkYXRlW2tleV0gPSBbe1xuICAgICAgICAgIHRlc3Q6IGAke3N0b3JlfS5sZW5ndGggJiYgJHtzdG9yZX1bMF0udW5pdCA9PT0gJHt1bml0TmFtZShtb2RlbCl9YCxcbiAgICAgICAgICAuLi51cGRhdGVba2V5XVxuICAgICAgICB9LCB7dmFsdWU6IDB9XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUd28gYnJ1c2ggbWFya3MgZW5zdXJlIHRoYXQgZmlsbCBjb2xvcnMgYW5kIG90aGVyIGFlc3RoZXRpYyBjaG9pY2VzIGRvXG4gICAgLy8gbm90IGludGVyZWZlcmUgd2l0aCB0aGUgY29yZSBtYXJrcywgYnV0IHRoYXQgdGhlIGJydXNoZWQgcmVnaW9uIGNhbiBzdGlsbFxuICAgIC8vIGJlIGludGVyYWN0ZWQgd2l0aCAoZS5nLiwgZHJhZ2dpbmcgaXQgYXJvdW5kKS5cbiAgICBjb25zdCB7ZmlsbCwgZmlsbE9wYWNpdHksIC4uLnN0cm9rZX0gPSBzZWxDbXB0Lm1hcms7XG4gICAgY29uc3QgdmdTdHJva2UgPSBrZXlzKHN0cm9rZSkucmVkdWNlKChkZWYsIGspID0+IHtcbiAgICAgIGRlZltrXSA9IHt2YWx1ZTogc3Ryb2tlW2tdfTtcbiAgICAgIHJldHVybiBkZWY7XG4gICAgfSwge30pO1xuXG4gICAgcmV0dXJuIFt7XG4gICAgICBuYW1lOiBuYW1lICsgQlJVU0ggKyAnX2JnJyxcbiAgICAgIHR5cGU6ICdyZWN0JyxcbiAgICAgIGNsaXA6IHRydWUsXG4gICAgICBlbmNvZGU6IHtcbiAgICAgICAgZW50ZXI6IHtcbiAgICAgICAgICBmaWxsOiB7dmFsdWU6IGZpbGx9LFxuICAgICAgICAgIGZpbGxPcGFjaXR5OiB7dmFsdWU6IGZpbGxPcGFjaXR5fVxuICAgICAgICB9LFxuICAgICAgICB1cGRhdGU6IHVwZGF0ZVxuICAgICAgfVxuICAgIH0gYXMgYW55XS5jb25jYXQobWFya3MsIHtcbiAgICAgIG5hbWU6IG5hbWUgKyBCUlVTSCxcbiAgICAgIHR5cGU6ICdyZWN0JyxcbiAgICAgIGNsaXA6IHRydWUsXG4gICAgICBlbmNvZGU6IHtcbiAgICAgICAgZW50ZXI6IHtcbiAgICAgICAgICBmaWxsOiB7dmFsdWU6ICd0cmFuc3BhcmVudCd9LFxuICAgICAgICAgIC4uLnZnU3Ryb2tlXG4gICAgICAgIH0sXG4gICAgICAgIHVwZGF0ZTogdXBkYXRlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn07XG5leHBvcnQge2ludGVydmFsIGFzIGRlZmF1bHR9O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIHZpc3VhbCBhbmQgZGF0YSBzaWduYWxzIGZvciBhbiBpbnRlcnZhbCBzZWxlY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNoYW5uZWxTaWduYWxzKG1vZGVsOiBVbml0TW9kZWwsIHNlbENtcHQ6IFNlbGVjdGlvbkNvbXBvbmVudCwgY2hhbm5lbDogJ3gnfCd5Jyk6IGFueSB7XG4gIGNvbnN0IHZuYW1lID0gY2hhbm5lbFNpZ25hbE5hbWUoc2VsQ21wdCwgY2hhbm5lbCwgJ3Zpc3VhbCcpO1xuICBjb25zdCBkbmFtZSA9IGNoYW5uZWxTaWduYWxOYW1lKHNlbENtcHQsIGNoYW5uZWwsICdkYXRhJyk7XG4gIGNvbnN0IGhhc1NjYWxlcyA9IHNjYWxlcy5oYXMoc2VsQ21wdCk7XG4gIGNvbnN0IHNjYWxlTmFtZSA9IG1vZGVsLnNjYWxlTmFtZShjaGFubmVsKTtcbiAgY29uc3Qgc2NhbGVTdHIgPSBzdHJpbmdWYWx1ZShzY2FsZU5hbWUpO1xuICBjb25zdCBzY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpO1xuICBjb25zdCBzY2FsZVR5cGUgPSBzY2FsZSA/IHNjYWxlLmdldCgndHlwZScpIDogdW5kZWZpbmVkO1xuICBjb25zdCBzaXplID0gbW9kZWwuZ2V0U2l6ZVNpZ25hbFJlZihjaGFubmVsID09PSBYID8gJ3dpZHRoJyA6ICdoZWlnaHQnKS5zaWduYWw7XG4gIGNvbnN0IGNvb3JkID0gYCR7Y2hhbm5lbH0odW5pdClgO1xuXG4gIGNvbnN0IG9uID0gZXZlbnRzKHNlbENtcHQsIGZ1bmN0aW9uKGRlZjogYW55W10sIGV2dDogVmdFdmVudFN0cmVhbSkge1xuICAgIHJldHVybiBkZWYuY29uY2F0KFxuICAgICAge2V2ZW50czogZXZ0LmJldHdlZW5bMF0sIHVwZGF0ZTogYFske2Nvb3JkfSwgJHtjb29yZH1dYH0sICAgICAgICAgICAvLyBCcnVzaCBTdGFydFxuICAgICAge2V2ZW50czogZXZ0LCB1cGRhdGU6IGBbJHt2bmFtZX1bMF0sIGNsYW1wKCR7Y29vcmR9LCAwLCAke3NpemV9KV1gfSAvLyBCcnVzaCBFbmRcbiAgICApO1xuICB9KTtcblxuICAvLyBSZWFjdCB0byBwYW4vem9vbXMgb2YgY29udGludW91cyBzY2FsZXMuIE5vbi1jb250aW51b3VzIHNjYWxlc1xuICAvLyAoYmluLWxpbmVhciwgYmFuZCwgcG9pbnQpIGNhbm5vdCBiZSBwYW4vem9vbWVkIGFuZCBhbnkgb3RoZXIgY2hhbmdlc1xuICAvLyB0byB0aGVpciBkb21haW5zIChlLmcuLCBmaWx0ZXJpbmcpIHNob3VsZCBjbGVhciB0aGUgYnJ1c2hlcy5cbiAgb24ucHVzaCh7XG4gICAgZXZlbnRzOiB7c2lnbmFsOiBzZWxDbXB0Lm5hbWUgKyBTQ0FMRV9UUklHR0VSfSxcbiAgICB1cGRhdGU6IGhhc0NvbnRpbnVvdXNEb21haW4oc2NhbGVUeXBlKSAmJiAhaXNCaW5TY2FsZShzY2FsZVR5cGUpID9cbiAgICAgIGBbc2NhbGUoJHtzY2FsZVN0cn0sICR7ZG5hbWV9WzBdKSwgc2NhbGUoJHtzY2FsZVN0cn0sICR7ZG5hbWV9WzFdKV1gIDogYFswLCAwXWBcbiAgfSk7XG5cbiAgcmV0dXJuIGhhc1NjYWxlcyA/IFt7bmFtZTogZG5hbWUsIG9uOiBbXX1dIDogW3tcbiAgICBuYW1lOiB2bmFtZSwgdmFsdWU6IFtdLCBvbjogb25cbiAgfSwge1xuICAgIG5hbWU6IGRuYW1lLFxuICAgIG9uOiBbe2V2ZW50czoge3NpZ25hbDogdm5hbWV9LCB1cGRhdGU6IGAke3ZuYW1lfVswXSA9PT0gJHt2bmFtZX1bMV0gPyBudWxsIDogaW52ZXJ0KCR7c2NhbGVTdHJ9LCAke3ZuYW1lfSlgfV1cbiAgfV07XG59XG5cbmZ1bmN0aW9uIGV2ZW50cyhzZWxDbXB0OiBTZWxlY3Rpb25Db21wb25lbnQsIGNiOiBGdW5jdGlvbikge1xuICByZXR1cm4gc2VsQ21wdC5ldmVudHMucmVkdWNlKGZ1bmN0aW9uKG9uOiBhbnlbXSwgZXZ0OiBWZ0V2ZW50U3RyZWFtKSB7XG4gICAgaWYgKCFldnQuYmV0d2Vlbikge1xuICAgICAgd2FybihgJHtldnR9IGlzIG5vdCBhbiBvcmRlcmVkIGV2ZW50IHN0cmVhbSBmb3IgaW50ZXJ2YWwgc2VsZWN0aW9uc2ApO1xuICAgICAgcmV0dXJuIG9uO1xuICAgIH1cbiAgICByZXR1cm4gY2Iob24sIGV2dCk7XG4gIH0sIFtdKTtcbn1cbiJdfQ==