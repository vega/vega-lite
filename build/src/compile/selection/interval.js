"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var channel_1 = require("../../channel");
var log_1 = require("../../log");
var scale_1 = require("../../scale");
var util_1 = require("../../util");
var selection_1 = require("./selection");
var scales_1 = tslib_1.__importDefault(require("./transforms/scales"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJ2YWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vaW50ZXJ2YWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsdUNBQXNDO0FBQ3RDLHlDQUFtQztBQUNuQyxpQ0FBK0I7QUFDL0IscUNBQTREO0FBQzVELG1DQUFnQztBQUdoQyx5Q0FRcUI7QUFDckIsdUVBQXlDO0FBRTVCLFFBQUEsS0FBSyxHQUFHLFFBQVEsQ0FBQztBQUNqQixRQUFBLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQztBQUU5QyxJQUFNLFFBQVEsR0FBcUI7SUFDakMsU0FBUyxFQUFFLFlBQVk7SUFDdkIsV0FBVyxFQUFFLGtCQUFrQjtJQUUvQixPQUFPLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTztRQUM5QixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQzFCLElBQU0sU0FBUyxHQUFHLGdCQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RDLElBQU0sT0FBTyxHQUFVLEVBQUUsQ0FBQztRQUMxQixJQUFNLFNBQVMsR0FBVSxFQUFFLENBQUM7UUFDNUIsSUFBTSxhQUFhLEdBQWEsRUFBRSxDQUFDO1FBQ25DLElBQU0sYUFBYSxHQUFVLEVBQUUsQ0FBQztRQUVoQyxJQUFJLE9BQU8sQ0FBQyxTQUFTLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkMsSUFBTSxZQUFVLEdBQUcsNkNBQTJDLHVCQUFXLENBQUMsSUFBSSxHQUFHLGFBQUssQ0FBRyxDQUFDO1lBQzFGLE1BQU0sQ0FBQyxPQUFPLEVBQUUsVUFBUyxDQUFRLEVBQUUsR0FBa0I7Z0JBQ25ELElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLENB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LEVBQUUsQ0FBQyxDQUFDO0FBQ1QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7c3RyaW5nVmFsdWV9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge1gsIFl9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHt3YXJufSBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtoYXNDb250aW51b3VzRG9tYWluLCBpc0JpblNjYWxlfSBmcm9tICcuLi8uLi9zY2FsZSc7XG5pbXBvcnQge2tleXN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0V2ZW50U3RyZWFtfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQge1xuICBjaGFubmVsU2lnbmFsTmFtZSxcbiAgcG9zaXRpb25hbFByb2plY3Rpb25zLFxuICBTZWxlY3Rpb25Db21waWxlcixcbiAgU2VsZWN0aW9uQ29tcG9uZW50LFxuICBTVE9SRSxcbiAgVFVQTEUsXG4gIHVuaXROYW1lLFxufSBmcm9tICcuL3NlbGVjdGlvbic7XG5pbXBvcnQgc2NhbGVzIGZyb20gJy4vdHJhbnNmb3Jtcy9zY2FsZXMnO1xuXG5leHBvcnQgY29uc3QgQlJVU0ggPSAnX2JydXNoJztcbmV4cG9ydCBjb25zdCBTQ0FMRV9UUklHR0VSID0gJ19zY2FsZV90cmlnZ2VyJztcblxuY29uc3QgaW50ZXJ2YWw6U2VsZWN0aW9uQ29tcGlsZXIgPSB7XG4gIHByZWRpY2F0ZTogJ3ZsSW50ZXJ2YWwnLFxuICBzY2FsZURvbWFpbjogJ3ZsSW50ZXJ2YWxEb21haW4nLFxuXG4gIHNpZ25hbHM6IGZ1bmN0aW9uKG1vZGVsLCBzZWxDbXB0KSB7XG4gICAgY29uc3QgbmFtZSA9IHNlbENtcHQubmFtZTtcbiAgICBjb25zdCBoYXNTY2FsZXMgPSBzY2FsZXMuaGFzKHNlbENtcHQpO1xuICAgIGNvbnN0IHNpZ25hbHM6IGFueVtdID0gW107XG4gICAgY29uc3QgaW50ZXJ2YWxzOiBhbnlbXSA9IFtdO1xuICAgIGNvbnN0IHR1cGxlVHJpZ2dlcnM6IHN0cmluZ1tdID0gW107XG4gICAgY29uc3Qgc2NhbGVUcmlnZ2VyczogYW55W10gPSBbXTtcblxuICAgIGlmIChzZWxDbXB0LnRyYW5zbGF0ZSAmJiAhaGFzU2NhbGVzKSB7XG4gICAgICBjb25zdCBmaWx0ZXJFeHByID0gYCFldmVudC5pdGVtIHx8IGV2ZW50Lml0ZW0ubWFyay5uYW1lICE9PSAke3N0cmluZ1ZhbHVlKG5hbWUgKyBCUlVTSCl9YDtcbiAgICAgIGV2ZW50cyhzZWxDbXB0LCBmdW5jdGlvbihfOiBhbnlbXSwgZXZ0OiBWZ0V2ZW50U3RyZWFtKSB7XG4gICAgICAgIGNvbnN0IGZpbHRlcnMgPSBldnQuYmV0d2VlblswXS5maWx0ZXIgfHwgKGV2dC5iZXR3ZWVuWzBdLmZpbHRlciA9IFtdKTtcbiAgICAgICAgaWYgKGZpbHRlcnMuaW5kZXhPZihmaWx0ZXJFeHByKSA8IDApIHtcbiAgICAgICAgICBmaWx0ZXJzLnB1c2goZmlsdGVyRXhwcik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHNlbENtcHQucHJvamVjdC5mb3JFYWNoKGZ1bmN0aW9uKHApIHtcbiAgICAgIGNvbnN0IGNoYW5uZWwgPSBwLmNoYW5uZWw7XG4gICAgICBpZiAoY2hhbm5lbCAhPT0gWCAmJiBjaGFubmVsICE9PSBZKSB7XG4gICAgICAgIHdhcm4oJ0ludGVydmFsIHNlbGVjdGlvbnMgb25seSBzdXBwb3J0IHggYW5kIHkgZW5jb2RpbmcgY2hhbm5lbHMuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY3MgPSBjaGFubmVsU2lnbmFscyhtb2RlbCwgc2VsQ21wdCwgY2hhbm5lbCk7XG4gICAgICBjb25zdCBkbmFtZSA9IGNoYW5uZWxTaWduYWxOYW1lKHNlbENtcHQsIGNoYW5uZWwsICdkYXRhJyk7XG4gICAgICBjb25zdCB2bmFtZSA9IGNoYW5uZWxTaWduYWxOYW1lKHNlbENtcHQsIGNoYW5uZWwsICd2aXN1YWwnKTtcbiAgICAgIGNvbnN0IHNjYWxlU3RyID0gc3RyaW5nVmFsdWUobW9kZWwuc2NhbGVOYW1lKGNoYW5uZWwpKTtcbiAgICAgIGNvbnN0IHNjYWxlVHlwZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpLmdldCgndHlwZScpO1xuICAgICAgY29uc3QgdG9OdW0gPSBoYXNDb250aW51b3VzRG9tYWluKHNjYWxlVHlwZSkgPyAnKycgOiAnJztcblxuICAgICAgc2lnbmFscy5wdXNoLmFwcGx5KHNpZ25hbHMsIGNzKTtcbiAgICAgIHR1cGxlVHJpZ2dlcnMucHVzaChkbmFtZSk7XG4gICAgICBpbnRlcnZhbHMucHVzaChge2VuY29kaW5nOiAke3N0cmluZ1ZhbHVlKGNoYW5uZWwpfSwgYCArXG4gICAgICAgIGBmaWVsZDogJHtzdHJpbmdWYWx1ZShwLmZpZWxkKX0sIGV4dGVudDogJHtkbmFtZX19YCk7XG5cbiAgICAgIHNjYWxlVHJpZ2dlcnMucHVzaCh7XG4gICAgICAgIHNjYWxlTmFtZTogbW9kZWwuc2NhbGVOYW1lKGNoYW5uZWwpLFxuICAgICAgICBleHByOiBgKCFpc0FycmF5KCR7ZG5hbWV9KSB8fCBgICtcbiAgICAgICAgICBgKCR7dG9OdW19aW52ZXJ0KCR7c2NhbGVTdHJ9LCAke3ZuYW1lfSlbMF0gPT09ICR7dG9OdW19JHtkbmFtZX1bMF0gJiYgYCArXG4gICAgICAgICAgICBgJHt0b051bX1pbnZlcnQoJHtzY2FsZVN0cn0sICR7dm5hbWV9KVsxXSA9PT0gJHt0b051bX0ke2RuYW1lfVsxXSkpYFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBQcm94eSBzY2FsZSByZWFjdGlvbnMgdG8gZW5zdXJlIHRoYXQgYW4gaW5maW5pdGUgbG9vcCBkb2Vzbid0IG9jY3VyXG4gICAgLy8gd2hlbiBhbiBpbnRlcnZhbCBzZWxlY3Rpb24gZmlsdGVyIHRvdWNoZXMgdGhlIHNjYWxlLlxuICAgIGlmICghaGFzU2NhbGVzKSB7XG4gICAgICBzaWduYWxzLnB1c2goe1xuICAgICAgICBuYW1lOiBuYW1lICsgU0NBTEVfVFJJR0dFUixcbiAgICAgICAgdXBkYXRlOiBzY2FsZVRyaWdnZXJzLm1hcCgodCkgPT4gdC5leHByKS5qb2luKCcgJiYgJykgK1xuICAgICAgICAgIGAgPyAke25hbWUgKyBTQ0FMRV9UUklHR0VSfSA6IHt9YFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gT25seSBhZGQgYW4gaW50ZXJ2YWwgdG8gdGhlIHN0b3JlIGlmIGl0IGhhcyB2YWxpZCBkYXRhIGV4dGVudHMuIERhdGEgZXh0ZW50c1xuICAgIC8vIGFyZSBzZXQgdG8gbnVsbCBpZiBwaXhlbCBleHRlbnRzIGFyZSBlcXVhbCB0byBhY2NvdW50IGZvciBpbnRlcnZhbHMgb3ZlclxuICAgIC8vIG9yZGluYWwvbm9taW5hbCBkb21haW5zIHdoaWNoLCB3aGVuIGludmVydGVkLCB3aWxsIHN0aWxsIHByb2R1Y2UgYSB2YWxpZCBkYXR1bS5cbiAgICByZXR1cm4gc2lnbmFscy5jb25jYXQoe1xuICAgICAgbmFtZTogbmFtZSArIFRVUExFLFxuICAgICAgb246IFt7XG4gICAgICAgIGV2ZW50czogdHVwbGVUcmlnZ2Vycy5tYXAoKHQpID0+ICh7c2lnbmFsOiB0fSkpLFxuICAgICAgICB1cGRhdGU6IHR1cGxlVHJpZ2dlcnMuam9pbignICYmICcpICtcbiAgICAgICAgICBgID8ge3VuaXQ6ICR7dW5pdE5hbWUobW9kZWwpfSwgaW50ZXJ2YWxzOiBbJHtpbnRlcnZhbHMuam9pbignLCAnKX1dfSA6IG51bGxgXG4gICAgICB9XVxuICAgIH0pO1xuICB9LFxuXG4gIG1vZGlmeUV4cHI6IGZ1bmN0aW9uKG1vZGVsLCBzZWxDbXB0KSB7XG4gICAgY29uc3QgdHBsID0gc2VsQ21wdC5uYW1lICsgVFVQTEU7XG4gICAgcmV0dXJuIHRwbCArICcsICcgK1xuICAgICAgKHNlbENtcHQucmVzb2x2ZSA9PT0gJ2dsb2JhbCcgPyAndHJ1ZScgOiBge3VuaXQ6ICR7dW5pdE5hbWUobW9kZWwpfX1gKTtcbiAgfSxcblxuICBtYXJrczogZnVuY3Rpb24obW9kZWwsIHNlbENtcHQsIG1hcmtzKSB7XG4gICAgY29uc3QgbmFtZSA9IHNlbENtcHQubmFtZTtcbiAgICBjb25zdCB7eGksIHlpfSA9IHBvc2l0aW9uYWxQcm9qZWN0aW9ucyhzZWxDbXB0KTtcbiAgICBjb25zdCBzdG9yZSA9IGBkYXRhKCR7c3RyaW5nVmFsdWUoc2VsQ21wdC5uYW1lICsgU1RPUkUpfSlgO1xuXG4gICAgLy8gRG8gbm90IGFkZCBhIGJydXNoIGlmIHdlJ3JlIGJpbmRpbmcgdG8gc2NhbGVzLlxuICAgIGlmIChzY2FsZXMuaGFzKHNlbENtcHQpKSB7XG4gICAgICByZXR1cm4gbWFya3M7XG4gICAgfVxuXG4gICAgY29uc3QgdXBkYXRlOiBhbnkgPSB7XG4gICAgICB4OiB4aSAhPT0gbnVsbCA/IHtzaWduYWw6IGAke25hbWV9X3hbMF1gfSA6IHt2YWx1ZTogMH0sXG4gICAgICB5OiB5aSAhPT0gbnVsbCA/IHtzaWduYWw6IGAke25hbWV9X3lbMF1gfSA6IHt2YWx1ZTogMH0sXG4gICAgICB4MjogeGkgIT09IG51bGwgPyB7c2lnbmFsOiBgJHtuYW1lfV94WzFdYH0gOiB7ZmllbGQ6IHtncm91cDogJ3dpZHRoJ319LFxuICAgICAgeTI6IHlpICE9PSBudWxsID8ge3NpZ25hbDogYCR7bmFtZX1feVsxXWB9IDoge2ZpZWxkOiB7Z3JvdXA6ICdoZWlnaHQnfX1cbiAgICB9O1xuXG4gICAgLy8gSWYgdGhlIHNlbGVjdGlvbiBpcyByZXNvbHZlZCB0byBnbG9iYWwsIG9ubHkgYSBzaW5nbGUgaW50ZXJ2YWwgaXMgaW5cbiAgICAvLyB0aGUgc3RvcmUuIFdyYXAgYnJ1c2ggbWFyaydzIGVuY29kaW5ncyB3aXRoIGEgcHJvZHVjdGlvbiBydWxlIHRvIHRlc3RcbiAgICAvLyB0aGlzIGJhc2VkIG9uIHRoZSBgdW5pdGAgcHJvcGVydHkuIEhpZGUgdGhlIGJydXNoIG1hcmsgaWYgaXQgY29ycmVzcG9uZHNcbiAgICAvLyB0byBhIHVuaXQgZGlmZmVyZW50IGZyb20gdGhlIG9uZSBpbiB0aGUgc3RvcmUuXG4gICAgaWYgKHNlbENtcHQucmVzb2x2ZSA9PT0gJ2dsb2JhbCcpIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIGtleXModXBkYXRlKSkge1xuICAgICAgICB1cGRhdGVba2V5XSA9IFt7XG4gICAgICAgICAgdGVzdDogYCR7c3RvcmV9Lmxlbmd0aCAmJiAke3N0b3JlfVswXS51bml0ID09PSAke3VuaXROYW1lKG1vZGVsKX1gLFxuICAgICAgICAgIC4uLnVwZGF0ZVtrZXldXG4gICAgICAgIH0sIHt2YWx1ZTogMH1dO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFR3byBicnVzaCBtYXJrcyBlbnN1cmUgdGhhdCBmaWxsIGNvbG9ycyBhbmQgb3RoZXIgYWVzdGhldGljIGNob2ljZXMgZG9cbiAgICAvLyBub3QgaW50ZXJlZmVyZSB3aXRoIHRoZSBjb3JlIG1hcmtzLCBidXQgdGhhdCB0aGUgYnJ1c2hlZCByZWdpb24gY2FuIHN0aWxsXG4gICAgLy8gYmUgaW50ZXJhY3RlZCB3aXRoIChlLmcuLCBkcmFnZ2luZyBpdCBhcm91bmQpLlxuICAgIGNvbnN0IHtmaWxsLCBmaWxsT3BhY2l0eSwgLi4uc3Ryb2tlfSA9IHNlbENtcHQubWFyaztcbiAgICBjb25zdCB2Z1N0cm9rZSA9IGtleXMoc3Ryb2tlKS5yZWR1Y2UoKGRlZiwgaykgPT4ge1xuICAgICAgZGVmW2tdID0gW3tcbiAgICAgICAgdGVzdDogW1xuICAgICAgICAgIHhpICE9PSBudWxsICYmIGAke25hbWV9X3hbMF0gIT09ICR7bmFtZX1feFsxXWAsXG4gICAgICAgICAgeWkgIT0gbnVsbCAmJiBgJHtuYW1lfV95WzBdICE9PSAke25hbWV9X3lbMV1gLFxuICAgICAgICBdLmZpbHRlcih4ID0+IHgpLmpvaW4oJyAmJiAnKSxcbiAgICAgICAgdmFsdWU6IHN0cm9rZVtrXVxuICAgICAgfSwge3ZhbHVlOiBudWxsfV07XG4gICAgICByZXR1cm4gZGVmO1xuICAgIH0sIHt9KTtcblxuICAgIHJldHVybiBbe1xuICAgICAgbmFtZTogbmFtZSArIEJSVVNIICsgJ19iZycsXG4gICAgICB0eXBlOiAncmVjdCcsXG4gICAgICBjbGlwOiB0cnVlLFxuICAgICAgZW5jb2RlOiB7XG4gICAgICAgIGVudGVyOiB7XG4gICAgICAgICAgZmlsbDoge3ZhbHVlOiBmaWxsfSxcbiAgICAgICAgICBmaWxsT3BhY2l0eToge3ZhbHVlOiBmaWxsT3BhY2l0eX1cbiAgICAgICAgfSxcbiAgICAgICAgdXBkYXRlOiB1cGRhdGVcbiAgICAgIH1cbiAgICB9IGFzIGFueV0uY29uY2F0KG1hcmtzLCB7XG4gICAgICBuYW1lOiBuYW1lICsgQlJVU0gsXG4gICAgICB0eXBlOiAncmVjdCcsXG4gICAgICBjbGlwOiB0cnVlLFxuICAgICAgZW5jb2RlOiB7XG4gICAgICAgIGVudGVyOiB7XG4gICAgICAgICAgZmlsbDoge3ZhbHVlOiAndHJhbnNwYXJlbnQnfVxuICAgICAgICB9LFxuICAgICAgICB1cGRhdGU6IHsuLi51cGRhdGUsIC4uLnZnU3Ryb2tlfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59O1xuZXhwb3J0IGRlZmF1bHQgaW50ZXJ2YWw7XG5cbi8qKlxuICogUmV0dXJucyB0aGUgdmlzdWFsIGFuZCBkYXRhIHNpZ25hbHMgZm9yIGFuIGludGVydmFsIHNlbGVjdGlvbi5cbiAqL1xuZnVuY3Rpb24gY2hhbm5lbFNpZ25hbHMobW9kZWw6IFVuaXRNb2RlbCwgc2VsQ21wdDogU2VsZWN0aW9uQ29tcG9uZW50LCBjaGFubmVsOiAneCd8J3knKTogYW55IHtcbiAgY29uc3Qgdm5hbWUgPSBjaGFubmVsU2lnbmFsTmFtZShzZWxDbXB0LCBjaGFubmVsLCAndmlzdWFsJyk7XG4gIGNvbnN0IGRuYW1lID0gY2hhbm5lbFNpZ25hbE5hbWUoc2VsQ21wdCwgY2hhbm5lbCwgJ2RhdGEnKTtcbiAgY29uc3QgaGFzU2NhbGVzID0gc2NhbGVzLmhhcyhzZWxDbXB0KTtcbiAgY29uc3Qgc2NhbGVOYW1lID0gbW9kZWwuc2NhbGVOYW1lKGNoYW5uZWwpO1xuICBjb25zdCBzY2FsZVN0ciA9IHN0cmluZ1ZhbHVlKHNjYWxlTmFtZSk7XG4gIGNvbnN0IHNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCk7XG4gIGNvbnN0IHNjYWxlVHlwZSA9IHNjYWxlID8gc2NhbGUuZ2V0KCd0eXBlJykgOiB1bmRlZmluZWQ7XG4gIGNvbnN0IHNpemUgPSBtb2RlbC5nZXRTaXplU2lnbmFsUmVmKGNoYW5uZWwgPT09IFggPyAnd2lkdGgnIDogJ2hlaWdodCcpLnNpZ25hbDtcbiAgY29uc3QgY29vcmQgPSBgJHtjaGFubmVsfSh1bml0KWA7XG5cbiAgY29uc3Qgb24gPSBldmVudHMoc2VsQ21wdCwgZnVuY3Rpb24oZGVmOiBhbnlbXSwgZXZ0OiBWZ0V2ZW50U3RyZWFtKSB7XG4gICAgcmV0dXJuIGRlZi5jb25jYXQoXG4gICAgICB7ZXZlbnRzOiBldnQuYmV0d2VlblswXSwgdXBkYXRlOiBgWyR7Y29vcmR9LCAke2Nvb3JkfV1gfSwgICAgICAgICAgIC8vIEJydXNoIFN0YXJ0XG4gICAgICB7ZXZlbnRzOiBldnQsIHVwZGF0ZTogYFske3ZuYW1lfVswXSwgY2xhbXAoJHtjb29yZH0sIDAsICR7c2l6ZX0pXWB9IC8vIEJydXNoIEVuZFxuICAgICk7XG4gIH0pO1xuXG4gIC8vIFJlYWN0IHRvIHBhbi96b29tcyBvZiBjb250aW51b3VzIHNjYWxlcy4gTm9uLWNvbnRpbnVvdXMgc2NhbGVzXG4gIC8vIChiaW4tbGluZWFyLCBiYW5kLCBwb2ludCkgY2Fubm90IGJlIHBhbi96b29tZWQgYW5kIGFueSBvdGhlciBjaGFuZ2VzXG4gIC8vIHRvIHRoZWlyIGRvbWFpbnMgKGUuZy4sIGZpbHRlcmluZykgc2hvdWxkIGNsZWFyIHRoZSBicnVzaGVzLlxuICBvbi5wdXNoKHtcbiAgICBldmVudHM6IHtzaWduYWw6IHNlbENtcHQubmFtZSArIFNDQUxFX1RSSUdHRVJ9LFxuICAgIHVwZGF0ZTogaGFzQ29udGludW91c0RvbWFpbihzY2FsZVR5cGUpICYmICFpc0JpblNjYWxlKHNjYWxlVHlwZSkgP1xuICAgICAgYFtzY2FsZSgke3NjYWxlU3RyfSwgJHtkbmFtZX1bMF0pLCBzY2FsZSgke3NjYWxlU3RyfSwgJHtkbmFtZX1bMV0pXWAgOiBgWzAsIDBdYFxuICB9KTtcblxuICByZXR1cm4gaGFzU2NhbGVzID8gW3tuYW1lOiBkbmFtZSwgb246IFtdfV0gOiBbe1xuICAgIG5hbWU6IHZuYW1lLCB2YWx1ZTogW10sIG9uOiBvblxuICB9LCB7XG4gICAgbmFtZTogZG5hbWUsXG4gICAgb246IFt7ZXZlbnRzOiB7c2lnbmFsOiB2bmFtZX0sIHVwZGF0ZTogYCR7dm5hbWV9WzBdID09PSAke3ZuYW1lfVsxXSA/IG51bGwgOiBpbnZlcnQoJHtzY2FsZVN0cn0sICR7dm5hbWV9KWB9XVxuICB9XTtcbn1cblxuZnVuY3Rpb24gZXZlbnRzKHNlbENtcHQ6IFNlbGVjdGlvbkNvbXBvbmVudCwgY2I6IEZ1bmN0aW9uKSB7XG4gIHJldHVybiBzZWxDbXB0LmV2ZW50cy5yZWR1Y2UoZnVuY3Rpb24ob246IGFueVtdLCBldnQ6IFZnRXZlbnRTdHJlYW0pIHtcbiAgICBpZiAoIWV2dC5iZXR3ZWVuKSB7XG4gICAgICB3YXJuKGAke2V2dH0gaXMgbm90IGFuIG9yZGVyZWQgZXZlbnQgc3RyZWFtIGZvciBpbnRlcnZhbCBzZWxlY3Rpb25zYCk7XG4gICAgICByZXR1cm4gb247XG4gICAgfVxuICAgIHJldHVybiBjYihvbiwgZXZ0KTtcbiAgfSwgW10pO1xufVxuIl19