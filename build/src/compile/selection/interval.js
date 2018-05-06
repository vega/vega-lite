"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
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
                update[key] = [tslib_1.__assign({ test: store + ".length && " + store + "[0].unit === " + selection_1.unitName(model) }, update[key]), { value: 0 }];
            }
        }
        // Two brush marks ensure that fill colors and other aesthetic choices do
        // not interefere with the core marks, but that the brushed region can still
        // be interacted with (e.g., dragging it around).
        var _c = selCmpt.mark, fill = _c.fill, fillOpacity = _c.fillOpacity, stroke = tslib_1.__rest(_c, ["fill", "fillOpacity"]);
        var vgStroke = util_1.keys(stroke).reduce(function (def, k) {
            def[k] = [{
                    test: [
                        xi !== null && name + "_x[0] !== " + name + "_x[1]",
                        yi != null && name + "_y[0] !== " + name + "_y[1]",
                    ].filter(function (x) { return x; }).join(' && '),
                    value: stroke[k]
                }, { value: null }];
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
                enter: {
                    fill: { value: 'transparent' }
                },
                update: tslib_1.__assign({}, update, vgStroke)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJ2YWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vaW50ZXJ2YWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsdUNBQXNDO0FBQ3RDLHlDQUFtQztBQUNuQyxpQ0FBK0I7QUFDL0IscUNBQTREO0FBQzVELG1DQUFnQztBQUdoQyx5Q0FRcUI7QUFDckIsOENBQXlDO0FBRTVCLFFBQUEsS0FBSyxHQUFHLFFBQVEsQ0FBQztBQUNqQixRQUFBLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQztBQUU5QyxJQUFNLFFBQVEsR0FBcUI7SUFDakMsU0FBUyxFQUFFLFlBQVk7SUFDdkIsV0FBVyxFQUFFLGtCQUFrQjtJQUUvQixPQUFPLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTztRQUM5QixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQzFCLElBQU0sU0FBUyxHQUFHLGdCQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RDLElBQU0sT0FBTyxHQUFVLEVBQUUsQ0FBQztRQUMxQixJQUFNLFNBQVMsR0FBVSxFQUFFLENBQUM7UUFDNUIsSUFBTSxhQUFhLEdBQWEsRUFBRSxDQUFDO1FBQ25DLElBQU0sYUFBYSxHQUFVLEVBQUUsQ0FBQztRQUVoQyxJQUFJLE9BQU8sQ0FBQyxTQUFTLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkMsSUFBTSxZQUFVLEdBQUcsNkNBQTJDLHVCQUFXLENBQUMsSUFBSSxHQUFHLGFBQUssQ0FBRyxDQUFDO1lBQzFGLE1BQU0sQ0FBQyxPQUFPLEVBQUUsVUFBUyxDQUFRLEVBQUUsR0FBa0I7Z0JBQ25ELElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLENB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LENBQUMsQ0FBQztBQUNULENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3N0cmluZ1ZhbHVlfSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHtYLCBZfSBmcm9tICcuLi8uLi9jaGFubmVsJztcbmltcG9ydCB7d2Fybn0gZnJvbSAnLi4vLi4vbG9nJztcbmltcG9ydCB7aGFzQ29udGludW91c0RvbWFpbiwgaXNCaW5TY2FsZX0gZnJvbSAnLi4vLi4vc2NhbGUnO1xuaW1wb3J0IHtrZXlzfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdFdmVudFN0cmVhbX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uL3VuaXQnO1xuaW1wb3J0IHtcbiAgY2hhbm5lbFNpZ25hbE5hbWUsXG4gIHBvc2l0aW9uYWxQcm9qZWN0aW9ucyxcbiAgU2VsZWN0aW9uQ29tcGlsZXIsXG4gIFNlbGVjdGlvbkNvbXBvbmVudCxcbiAgU1RPUkUsXG4gIFRVUExFLFxuICB1bml0TmFtZSxcbn0gZnJvbSAnLi9zZWxlY3Rpb24nO1xuaW1wb3J0IHNjYWxlcyBmcm9tICcuL3RyYW5zZm9ybXMvc2NhbGVzJztcblxuZXhwb3J0IGNvbnN0IEJSVVNIID0gJ19icnVzaCc7XG5leHBvcnQgY29uc3QgU0NBTEVfVFJJR0dFUiA9ICdfc2NhbGVfdHJpZ2dlcic7XG5cbmNvbnN0IGludGVydmFsOlNlbGVjdGlvbkNvbXBpbGVyID0ge1xuICBwcmVkaWNhdGU6ICd2bEludGVydmFsJyxcbiAgc2NhbGVEb21haW46ICd2bEludGVydmFsRG9tYWluJyxcblxuICBzaWduYWxzOiBmdW5jdGlvbihtb2RlbCwgc2VsQ21wdCkge1xuICAgIGNvbnN0IG5hbWUgPSBzZWxDbXB0Lm5hbWU7XG4gICAgY29uc3QgaGFzU2NhbGVzID0gc2NhbGVzLmhhcyhzZWxDbXB0KTtcbiAgICBjb25zdCBzaWduYWxzOiBhbnlbXSA9IFtdO1xuICAgIGNvbnN0IGludGVydmFsczogYW55W10gPSBbXTtcbiAgICBjb25zdCB0dXBsZVRyaWdnZXJzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGNvbnN0IHNjYWxlVHJpZ2dlcnM6IGFueVtdID0gW107XG5cbiAgICBpZiAoc2VsQ21wdC50cmFuc2xhdGUgJiYgIWhhc1NjYWxlcykge1xuICAgICAgY29uc3QgZmlsdGVyRXhwciA9IGAhZXZlbnQuaXRlbSB8fCBldmVudC5pdGVtLm1hcmsubmFtZSAhPT0gJHtzdHJpbmdWYWx1ZShuYW1lICsgQlJVU0gpfWA7XG4gICAgICBldmVudHMoc2VsQ21wdCwgZnVuY3Rpb24oXzogYW55W10sIGV2dDogVmdFdmVudFN0cmVhbSkge1xuICAgICAgICBjb25zdCBmaWx0ZXJzID0gZXZ0LmJldHdlZW5bMF0uZmlsdGVyIHx8IChldnQuYmV0d2VlblswXS5maWx0ZXIgPSBbXSk7XG4gICAgICAgIGlmIChmaWx0ZXJzLmluZGV4T2YoZmlsdGVyRXhwcikgPCAwKSB7XG4gICAgICAgICAgZmlsdGVycy5wdXNoKGZpbHRlckV4cHIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzZWxDbXB0LnByb2plY3QuZm9yRWFjaChmdW5jdGlvbihwKSB7XG4gICAgICBjb25zdCBjaGFubmVsID0gcC5jaGFubmVsO1xuICAgICAgaWYgKGNoYW5uZWwgIT09IFggJiYgY2hhbm5lbCAhPT0gWSkge1xuICAgICAgICB3YXJuKCdJbnRlcnZhbCBzZWxlY3Rpb25zIG9ubHkgc3VwcG9ydCB4IGFuZCB5IGVuY29kaW5nIGNoYW5uZWxzLicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNzID0gY2hhbm5lbFNpZ25hbHMobW9kZWwsIHNlbENtcHQsIGNoYW5uZWwpO1xuICAgICAgY29uc3QgZG5hbWUgPSBjaGFubmVsU2lnbmFsTmFtZShzZWxDbXB0LCBjaGFubmVsLCAnZGF0YScpO1xuICAgICAgY29uc3Qgdm5hbWUgPSBjaGFubmVsU2lnbmFsTmFtZShzZWxDbXB0LCBjaGFubmVsLCAndmlzdWFsJyk7XG4gICAgICBjb25zdCBzY2FsZVN0ciA9IHN0cmluZ1ZhbHVlKG1vZGVsLnNjYWxlTmFtZShjaGFubmVsKSk7XG4gICAgICBjb25zdCBzY2FsZVR5cGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKS5nZXQoJ3R5cGUnKTtcbiAgICAgIGNvbnN0IHRvTnVtID0gaGFzQ29udGludW91c0RvbWFpbihzY2FsZVR5cGUpID8gJysnIDogJyc7XG5cbiAgICAgIHNpZ25hbHMucHVzaC5hcHBseShzaWduYWxzLCBjcyk7XG4gICAgICB0dXBsZVRyaWdnZXJzLnB1c2goZG5hbWUpO1xuICAgICAgaW50ZXJ2YWxzLnB1c2goYHtlbmNvZGluZzogJHtzdHJpbmdWYWx1ZShjaGFubmVsKX0sIGAgK1xuICAgICAgICBgZmllbGQ6ICR7c3RyaW5nVmFsdWUocC5maWVsZCl9LCBleHRlbnQ6ICR7ZG5hbWV9fWApO1xuXG4gICAgICBzY2FsZVRyaWdnZXJzLnB1c2goe1xuICAgICAgICBzY2FsZU5hbWU6IG1vZGVsLnNjYWxlTmFtZShjaGFubmVsKSxcbiAgICAgICAgZXhwcjogYCghaXNBcnJheSgke2RuYW1lfSkgfHwgYCArXG4gICAgICAgICAgYCgke3RvTnVtfWludmVydCgke3NjYWxlU3RyfSwgJHt2bmFtZX0pWzBdID09PSAke3RvTnVtfSR7ZG5hbWV9WzBdICYmIGAgK1xuICAgICAgICAgICAgYCR7dG9OdW19aW52ZXJ0KCR7c2NhbGVTdHJ9LCAke3ZuYW1lfSlbMV0gPT09ICR7dG9OdW19JHtkbmFtZX1bMV0pKWBcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gUHJveHkgc2NhbGUgcmVhY3Rpb25zIHRvIGVuc3VyZSB0aGF0IGFuIGluZmluaXRlIGxvb3AgZG9lc24ndCBvY2N1clxuICAgIC8vIHdoZW4gYW4gaW50ZXJ2YWwgc2VsZWN0aW9uIGZpbHRlciB0b3VjaGVzIHRoZSBzY2FsZS5cbiAgICBpZiAoIWhhc1NjYWxlcykge1xuICAgICAgc2lnbmFscy5wdXNoKHtcbiAgICAgICAgbmFtZTogbmFtZSArIFNDQUxFX1RSSUdHRVIsXG4gICAgICAgIHVwZGF0ZTogc2NhbGVUcmlnZ2Vycy5tYXAoKHQpID0+IHQuZXhwcikuam9pbignICYmICcpICtcbiAgICAgICAgICBgID8gJHtuYW1lICsgU0NBTEVfVFJJR0dFUn0gOiB7fWBcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIE9ubHkgYWRkIGFuIGludGVydmFsIHRvIHRoZSBzdG9yZSBpZiBpdCBoYXMgdmFsaWQgZGF0YSBleHRlbnRzLiBEYXRhIGV4dGVudHNcbiAgICAvLyBhcmUgc2V0IHRvIG51bGwgaWYgcGl4ZWwgZXh0ZW50cyBhcmUgZXF1YWwgdG8gYWNjb3VudCBmb3IgaW50ZXJ2YWxzIG92ZXJcbiAgICAvLyBvcmRpbmFsL25vbWluYWwgZG9tYWlucyB3aGljaCwgd2hlbiBpbnZlcnRlZCwgd2lsbCBzdGlsbCBwcm9kdWNlIGEgdmFsaWQgZGF0dW0uXG4gICAgcmV0dXJuIHNpZ25hbHMuY29uY2F0KHtcbiAgICAgIG5hbWU6IG5hbWUgKyBUVVBMRSxcbiAgICAgIG9uOiBbe1xuICAgICAgICBldmVudHM6IHR1cGxlVHJpZ2dlcnMubWFwKCh0KSA9PiAoe3NpZ25hbDogdH0pKSxcbiAgICAgICAgdXBkYXRlOiB0dXBsZVRyaWdnZXJzLmpvaW4oJyAmJiAnKSArXG4gICAgICAgICAgYCA/IHt1bml0OiAke3VuaXROYW1lKG1vZGVsKX0sIGludGVydmFsczogWyR7aW50ZXJ2YWxzLmpvaW4oJywgJyl9XX0gOiBudWxsYFxuICAgICAgfV1cbiAgICB9KTtcbiAgfSxcblxuICBtb2RpZnlFeHByOiBmdW5jdGlvbihtb2RlbCwgc2VsQ21wdCkge1xuICAgIGNvbnN0IHRwbCA9IHNlbENtcHQubmFtZSArIFRVUExFO1xuICAgIHJldHVybiB0cGwgKyAnLCAnICtcbiAgICAgIChzZWxDbXB0LnJlc29sdmUgPT09ICdnbG9iYWwnID8gJ3RydWUnIDogYHt1bml0OiAke3VuaXROYW1lKG1vZGVsKX19YCk7XG4gIH0sXG5cbiAgbWFya3M6IGZ1bmN0aW9uKG1vZGVsLCBzZWxDbXB0LCBtYXJrcykge1xuICAgIGNvbnN0IG5hbWUgPSBzZWxDbXB0Lm5hbWU7XG4gICAgY29uc3Qge3hpLCB5aX0gPSBwb3NpdGlvbmFsUHJvamVjdGlvbnMoc2VsQ21wdCk7XG4gICAgY29uc3Qgc3RvcmUgPSBgZGF0YSgke3N0cmluZ1ZhbHVlKHNlbENtcHQubmFtZSArIFNUT1JFKX0pYDtcblxuICAgIC8vIERvIG5vdCBhZGQgYSBicnVzaCBpZiB3ZSdyZSBiaW5kaW5nIHRvIHNjYWxlcy5cbiAgICBpZiAoc2NhbGVzLmhhcyhzZWxDbXB0KSkge1xuICAgICAgcmV0dXJuIG1hcmtzO1xuICAgIH1cblxuICAgIGNvbnN0IHVwZGF0ZTogYW55ID0ge1xuICAgICAgeDogeGkgIT09IG51bGwgPyB7c2lnbmFsOiBgJHtuYW1lfV94WzBdYH0gOiB7dmFsdWU6IDB9LFxuICAgICAgeTogeWkgIT09IG51bGwgPyB7c2lnbmFsOiBgJHtuYW1lfV95WzBdYH0gOiB7dmFsdWU6IDB9LFxuICAgICAgeDI6IHhpICE9PSBudWxsID8ge3NpZ25hbDogYCR7bmFtZX1feFsxXWB9IDoge2ZpZWxkOiB7Z3JvdXA6ICd3aWR0aCd9fSxcbiAgICAgIHkyOiB5aSAhPT0gbnVsbCA/IHtzaWduYWw6IGAke25hbWV9X3lbMV1gfSA6IHtmaWVsZDoge2dyb3VwOiAnaGVpZ2h0J319XG4gICAgfTtcblxuICAgIC8vIElmIHRoZSBzZWxlY3Rpb24gaXMgcmVzb2x2ZWQgdG8gZ2xvYmFsLCBvbmx5IGEgc2luZ2xlIGludGVydmFsIGlzIGluXG4gICAgLy8gdGhlIHN0b3JlLiBXcmFwIGJydXNoIG1hcmsncyBlbmNvZGluZ3Mgd2l0aCBhIHByb2R1Y3Rpb24gcnVsZSB0byB0ZXN0XG4gICAgLy8gdGhpcyBiYXNlZCBvbiB0aGUgYHVuaXRgIHByb3BlcnR5LiBIaWRlIHRoZSBicnVzaCBtYXJrIGlmIGl0IGNvcnJlc3BvbmRzXG4gICAgLy8gdG8gYSB1bml0IGRpZmZlcmVudCBmcm9tIHRoZSBvbmUgaW4gdGhlIHN0b3JlLlxuICAgIGlmIChzZWxDbXB0LnJlc29sdmUgPT09ICdnbG9iYWwnKSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBrZXlzKHVwZGF0ZSkpIHtcbiAgICAgICAgdXBkYXRlW2tleV0gPSBbe1xuICAgICAgICAgIHRlc3Q6IGAke3N0b3JlfS5sZW5ndGggJiYgJHtzdG9yZX1bMF0udW5pdCA9PT0gJHt1bml0TmFtZShtb2RlbCl9YCxcbiAgICAgICAgICAuLi51cGRhdGVba2V5XVxuICAgICAgICB9LCB7dmFsdWU6IDB9XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUd28gYnJ1c2ggbWFya3MgZW5zdXJlIHRoYXQgZmlsbCBjb2xvcnMgYW5kIG90aGVyIGFlc3RoZXRpYyBjaG9pY2VzIGRvXG4gICAgLy8gbm90IGludGVyZWZlcmUgd2l0aCB0aGUgY29yZSBtYXJrcywgYnV0IHRoYXQgdGhlIGJydXNoZWQgcmVnaW9uIGNhbiBzdGlsbFxuICAgIC8vIGJlIGludGVyYWN0ZWQgd2l0aCAoZS5nLiwgZHJhZ2dpbmcgaXQgYXJvdW5kKS5cbiAgICBjb25zdCB7ZmlsbCwgZmlsbE9wYWNpdHksIC4uLnN0cm9rZX0gPSBzZWxDbXB0Lm1hcms7XG4gICAgY29uc3QgdmdTdHJva2UgPSBrZXlzKHN0cm9rZSkucmVkdWNlKChkZWYsIGspID0+IHtcbiAgICAgIGRlZltrXSA9IFt7XG4gICAgICAgIHRlc3Q6IFtcbiAgICAgICAgICB4aSAhPT0gbnVsbCAmJiBgJHtuYW1lfV94WzBdICE9PSAke25hbWV9X3hbMV1gLFxuICAgICAgICAgIHlpICE9IG51bGwgJiYgYCR7bmFtZX1feVswXSAhPT0gJHtuYW1lfV95WzFdYCxcbiAgICAgICAgXS5maWx0ZXIoeCA9PiB4KS5qb2luKCcgJiYgJyksXG4gICAgICAgIHZhbHVlOiBzdHJva2Vba11cbiAgICAgIH0sIHt2YWx1ZTogbnVsbH1dO1xuICAgICAgcmV0dXJuIGRlZjtcbiAgICB9LCB7fSk7XG5cbiAgICByZXR1cm4gW3tcbiAgICAgIG5hbWU6IG5hbWUgKyBCUlVTSCArICdfYmcnLFxuICAgICAgdHlwZTogJ3JlY3QnLFxuICAgICAgY2xpcDogdHJ1ZSxcbiAgICAgIGVuY29kZToge1xuICAgICAgICBlbnRlcjoge1xuICAgICAgICAgIGZpbGw6IHt2YWx1ZTogZmlsbH0sXG4gICAgICAgICAgZmlsbE9wYWNpdHk6IHt2YWx1ZTogZmlsbE9wYWNpdHl9XG4gICAgICAgIH0sXG4gICAgICAgIHVwZGF0ZTogdXBkYXRlXG4gICAgICB9XG4gICAgfSBhcyBhbnldLmNvbmNhdChtYXJrcywge1xuICAgICAgbmFtZTogbmFtZSArIEJSVVNILFxuICAgICAgdHlwZTogJ3JlY3QnLFxuICAgICAgY2xpcDogdHJ1ZSxcbiAgICAgIGVuY29kZToge1xuICAgICAgICBlbnRlcjoge1xuICAgICAgICAgIGZpbGw6IHt2YWx1ZTogJ3RyYW5zcGFyZW50J31cbiAgICAgICAgfSxcbiAgICAgICAgdXBkYXRlOiB7Li4udXBkYXRlLCAuLi52Z1N0cm9rZX1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufTtcbmV4cG9ydCBkZWZhdWx0IGludGVydmFsO1xuXG4vKipcbiAqIFJldHVybnMgdGhlIHZpc3VhbCBhbmQgZGF0YSBzaWduYWxzIGZvciBhbiBpbnRlcnZhbCBzZWxlY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNoYW5uZWxTaWduYWxzKG1vZGVsOiBVbml0TW9kZWwsIHNlbENtcHQ6IFNlbGVjdGlvbkNvbXBvbmVudCwgY2hhbm5lbDogJ3gnfCd5Jyk6IGFueSB7XG4gIGNvbnN0IHZuYW1lID0gY2hhbm5lbFNpZ25hbE5hbWUoc2VsQ21wdCwgY2hhbm5lbCwgJ3Zpc3VhbCcpO1xuICBjb25zdCBkbmFtZSA9IGNoYW5uZWxTaWduYWxOYW1lKHNlbENtcHQsIGNoYW5uZWwsICdkYXRhJyk7XG4gIGNvbnN0IGhhc1NjYWxlcyA9IHNjYWxlcy5oYXMoc2VsQ21wdCk7XG4gIGNvbnN0IHNjYWxlTmFtZSA9IG1vZGVsLnNjYWxlTmFtZShjaGFubmVsKTtcbiAgY29uc3Qgc2NhbGVTdHIgPSBzdHJpbmdWYWx1ZShzY2FsZU5hbWUpO1xuICBjb25zdCBzY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpO1xuICBjb25zdCBzY2FsZVR5cGUgPSBzY2FsZSA/IHNjYWxlLmdldCgndHlwZScpIDogdW5kZWZpbmVkO1xuICBjb25zdCBzaXplID0gbW9kZWwuZ2V0U2l6ZVNpZ25hbFJlZihjaGFubmVsID09PSBYID8gJ3dpZHRoJyA6ICdoZWlnaHQnKS5zaWduYWw7XG4gIGNvbnN0IGNvb3JkID0gYCR7Y2hhbm5lbH0odW5pdClgO1xuXG4gIGNvbnN0IG9uID0gZXZlbnRzKHNlbENtcHQsIGZ1bmN0aW9uKGRlZjogYW55W10sIGV2dDogVmdFdmVudFN0cmVhbSkge1xuICAgIHJldHVybiBkZWYuY29uY2F0KFxuICAgICAge2V2ZW50czogZXZ0LmJldHdlZW5bMF0sIHVwZGF0ZTogYFske2Nvb3JkfSwgJHtjb29yZH1dYH0sICAgICAgICAgICAvLyBCcnVzaCBTdGFydFxuICAgICAge2V2ZW50czogZXZ0LCB1cGRhdGU6IGBbJHt2bmFtZX1bMF0sIGNsYW1wKCR7Y29vcmR9LCAwLCAke3NpemV9KV1gfSAvLyBCcnVzaCBFbmRcbiAgICApO1xuICB9KTtcblxuICAvLyBSZWFjdCB0byBwYW4vem9vbXMgb2YgY29udGludW91cyBzY2FsZXMuIE5vbi1jb250aW51b3VzIHNjYWxlc1xuICAvLyAoYmluLWxpbmVhciwgYmFuZCwgcG9pbnQpIGNhbm5vdCBiZSBwYW4vem9vbWVkIGFuZCBhbnkgb3RoZXIgY2hhbmdlc1xuICAvLyB0byB0aGVpciBkb21haW5zIChlLmcuLCBmaWx0ZXJpbmcpIHNob3VsZCBjbGVhciB0aGUgYnJ1c2hlcy5cbiAgb24ucHVzaCh7XG4gICAgZXZlbnRzOiB7c2lnbmFsOiBzZWxDbXB0Lm5hbWUgKyBTQ0FMRV9UUklHR0VSfSxcbiAgICB1cGRhdGU6IGhhc0NvbnRpbnVvdXNEb21haW4oc2NhbGVUeXBlKSAmJiAhaXNCaW5TY2FsZShzY2FsZVR5cGUpID9cbiAgICAgIGBbc2NhbGUoJHtzY2FsZVN0cn0sICR7ZG5hbWV9WzBdKSwgc2NhbGUoJHtzY2FsZVN0cn0sICR7ZG5hbWV9WzFdKV1gIDogYFswLCAwXWBcbiAgfSk7XG5cbiAgcmV0dXJuIGhhc1NjYWxlcyA/IFt7bmFtZTogZG5hbWUsIG9uOiBbXX1dIDogW3tcbiAgICBuYW1lOiB2bmFtZSwgdmFsdWU6IFtdLCBvbjogb25cbiAgfSwge1xuICAgIG5hbWU6IGRuYW1lLFxuICAgIG9uOiBbe2V2ZW50czoge3NpZ25hbDogdm5hbWV9LCB1cGRhdGU6IGAke3ZuYW1lfVswXSA9PT0gJHt2bmFtZX1bMV0gPyBudWxsIDogaW52ZXJ0KCR7c2NhbGVTdHJ9LCAke3ZuYW1lfSlgfV1cbiAgfV07XG59XG5cbmZ1bmN0aW9uIGV2ZW50cyhzZWxDbXB0OiBTZWxlY3Rpb25Db21wb25lbnQsIGNiOiBGdW5jdGlvbikge1xuICByZXR1cm4gc2VsQ21wdC5ldmVudHMucmVkdWNlKGZ1bmN0aW9uKG9uOiBhbnlbXSwgZXZ0OiBWZ0V2ZW50U3RyZWFtKSB7XG4gICAgaWYgKCFldnQuYmV0d2Vlbikge1xuICAgICAgd2FybihgJHtldnR9IGlzIG5vdCBhbiBvcmRlcmVkIGV2ZW50IHN0cmVhbSBmb3IgaW50ZXJ2YWwgc2VsZWN0aW9uc2ApO1xuICAgICAgcmV0dXJuIG9uO1xuICAgIH1cbiAgICByZXR1cm4gY2Iob24sIGV2dCk7XG4gIH0sIFtdKTtcbn1cbiJdfQ==