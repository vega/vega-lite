import * as tslib_1 from "tslib";
import { stringValue } from 'vega-util';
import { X, Y } from '../../channel';
import { warn } from '../../log';
import { hasContinuousDomain, isBinScale } from '../../scale';
import { keys } from '../../util';
import { channelSignalName, positionalProjections, STORE, TUPLE, unitName } from './selection';
import scales from './transforms/scales';
export var BRUSH = '_brush';
export var SCALE_TRIGGER = '_scale_trigger';
var interval = {
    predicate: 'vlInterval',
    scaleDomain: 'vlIntervalDomain',
    signals: function (model, selCmpt) {
        var name = selCmpt.name;
        var hasScales = scales.has(selCmpt);
        var signals = [];
        var intervals = [];
        var tupleTriggers = [];
        var scaleTriggers = [];
        if (selCmpt.translate && !hasScales) {
            var filterExpr_1 = "!event.item || event.item.mark.name !== " + stringValue(name + BRUSH);
            events(selCmpt, function (_, evt) {
                var filters = evt.between[0].filter || (evt.between[0].filter = []);
                if (filters.indexOf(filterExpr_1) < 0) {
                    filters.push(filterExpr_1);
                }
            });
        }
        for (var _i = 0, _a = selCmpt.project; _i < _a.length; _i++) {
            var p = _a[_i];
            var channel = p.channel;
            if (channel !== X && channel !== Y) {
                warn('Interval selections only support x and y encoding channels.');
                continue;
            }
            var cs = channelSignals(model, selCmpt, channel);
            var dname = channelSignalName(selCmpt, channel, 'data');
            var vname = channelSignalName(selCmpt, channel, 'visual');
            var scaleStr = stringValue(model.scaleName(channel));
            var scaleType = model.getScaleComponent(channel).get('type');
            var toNum = hasContinuousDomain(scaleType) ? '+' : '';
            signals.push.apply(signals, cs);
            tupleTriggers.push(dname);
            intervals.push("{encoding: " + stringValue(channel) + ", " + ("field: " + stringValue(p.field) + ", extent: " + dname + "}"));
            scaleTriggers.push({
                scaleName: model.scaleName(channel),
                expr: "(!isArray(" + dname + ") || " +
                    ("(" + toNum + "invert(" + scaleStr + ", " + vname + ")[0] === " + toNum + dname + "[0] && ") +
                    (toNum + "invert(" + scaleStr + ", " + vname + ")[1] === " + toNum + dname + "[1]))")
            });
        }
        // Proxy scale reactions to ensure that an infinite loop doesn't occur
        // when an interval selection filter touches the scale.
        if (!hasScales) {
            signals.push({
                name: name + SCALE_TRIGGER,
                update: scaleTriggers.map(function (t) { return t.expr; }).join(' && ') + (" ? " + (name + SCALE_TRIGGER) + " : {}")
            });
        }
        // Only add an interval to the store if it has valid data extents. Data extents
        // are set to null if pixel extents are equal to account for intervals over
        // ordinal/nominal domains which, when inverted, will still produce a valid datum.
        return signals.concat({
            name: name + TUPLE,
            on: [
                {
                    events: tupleTriggers.map(function (t) { return ({ signal: t }); }),
                    update: tupleTriggers.join(' && ') + (" ? {unit: " + unitName(model) + ", intervals: [" + intervals.join(', ') + "]} : null")
                }
            ]
        });
    },
    modifyExpr: function (model, selCmpt) {
        var tpl = selCmpt.name + TUPLE;
        return tpl + ', ' + (selCmpt.resolve === 'global' ? 'true' : "{unit: " + unitName(model) + "}");
    },
    marks: function (model, selCmpt, marks) {
        var name = selCmpt.name;
        var _a = positionalProjections(selCmpt), xi = _a.xi, yi = _a.yi;
        var store = "data(" + stringValue(selCmpt.name + STORE) + ")";
        // Do not add a brush if we're binding to scales.
        if (scales.has(selCmpt)) {
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
            for (var _i = 0, _b = keys(update); _i < _b.length; _i++) {
                var key = _b[_i];
                update[key] = [
                    tslib_1.__assign({ test: store + ".length && " + store + "[0].unit === " + unitName(model) }, update[key]),
                    { value: 0 }
                ];
            }
        }
        // Two brush marks ensure that fill colors and other aesthetic choices do
        // not interefere with the core marks, but that the brushed region can still
        // be interacted with (e.g., dragging it around).
        var _c = selCmpt.mark, fill = _c.fill, fillOpacity = _c.fillOpacity, stroke = tslib_1.__rest(_c, ["fill", "fillOpacity"]);
        var vgStroke = keys(stroke).reduce(function (def, k) {
            def[k] = [
                {
                    test: [xi !== null && name + "_x[0] !== " + name + "_x[1]", yi != null && name + "_y[0] !== " + name + "_y[1]"]
                        .filter(function (x) { return x; })
                        .join(' && '),
                    value: stroke[k]
                },
                { value: null }
            ];
            return def;
        }, {});
        return [
            {
                name: name + BRUSH + '_bg',
                type: 'rect',
                clip: true,
                encode: {
                    enter: {
                        fill: { value: fill },
                        fillOpacity: { value: fillOpacity }
                    },
                    update: update
                }
            }
        ].concat(marks, {
            name: name + BRUSH,
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
export default interval;
/**
 * Returns the visual and data signals for an interval selection.
 */
function channelSignals(model, selCmpt, channel) {
    var vname = channelSignalName(selCmpt, channel, 'visual');
    var dname = channelSignalName(selCmpt, channel, 'data');
    var hasScales = scales.has(selCmpt);
    var scaleName = model.scaleName(channel);
    var scaleStr = stringValue(scaleName);
    var scale = model.getScaleComponent(channel);
    var scaleType = scale ? scale.get('type') : undefined;
    var size = model.getSizeSignalRef(channel === X ? 'width' : 'height').signal;
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
        events: { signal: selCmpt.name + SCALE_TRIGGER },
        update: hasContinuousDomain(scaleType) && !isBinScale(scaleType)
            ? "[scale(" + scaleStr + ", " + dname + "[0]), scale(" + scaleStr + ", " + dname + "[1])]"
            : "[0, 0]"
    });
    return hasScales
        ? [{ name: dname, on: [] }]
        : [
            {
                name: vname,
                value: [],
                on: on
            },
            {
                name: dname,
                on: [{ events: { signal: vname }, update: vname + "[0] === " + vname + "[1] ? null : invert(" + scaleStr + ", " + vname + ")" }]
            }
        ];
}
function events(selCmpt, cb) {
    return selCmpt.events.reduce(function (on, evt) {
        if (!evt.between) {
            warn(evt + " is not an ordered event stream for interval selections");
            return on;
        }
        return cb(on, evt);
    }, []);
}
//# sourceMappingURL=interval.js.map