import { selector as parseSelector } from 'vega-event-selector';
import { X, Y } from '../../../channel';
import { BRUSH as INTERVAL_BRUSH } from '../interval';
import { channelSignalName, positionalProjections } from '../selection';
import scalesCompiler, { domain } from './scales';
var ANCHOR = '_translate_anchor';
var DELTA = '_translate_delta';
var translate = {
    has: function (selCmpt) {
        return selCmpt.type === 'interval' && selCmpt.translate;
    },
    signals: function (model, selCmpt, signals) {
        var name = selCmpt.name;
        var hasScales = scalesCompiler.has(selCmpt);
        var anchor = name + ANCHOR;
        var _a = positionalProjections(selCmpt), x = _a.x, y = _a.y;
        var events = parseSelector(selCmpt.translate, 'scope');
        if (!hasScales) {
            events = events.map(function (e) { return ((e.between[0].markname = name + INTERVAL_BRUSH), e); });
        }
        signals.push({
            name: anchor,
            value: {},
            on: [
                {
                    events: events.map(function (e) { return e.between[0]; }),
                    update: '{x: x(unit), y: y(unit)' +
                        (x !== null
                            ? ', extent_x: ' +
                                (hasScales ? domain(model, X) : "slice(" + channelSignalName(selCmpt, 'x', 'visual') + ")")
                            : '') +
                        (y !== null
                            ? ', extent_y: ' +
                                (hasScales ? domain(model, Y) : "slice(" + channelSignalName(selCmpt, 'y', 'visual') + ")")
                            : '') +
                        '}'
                }
            ]
        }, {
            name: name + DELTA,
            value: {},
            on: [
                {
                    events: events,
                    update: "{x: " + anchor + ".x - x(unit), y: " + anchor + ".y - y(unit)}"
                }
            ]
        });
        if (x !== null) {
            onDelta(model, selCmpt, X, 'width', signals);
        }
        if (y !== null) {
            onDelta(model, selCmpt, Y, 'height', signals);
        }
        return signals;
    }
};
export default translate;
function onDelta(model, selCmpt, channel, size, signals) {
    var name = selCmpt.name;
    var hasScales = scalesCompiler.has(selCmpt);
    var signal = signals.filter(function (s) {
        return s.name === channelSignalName(selCmpt, channel, hasScales ? 'data' : 'visual');
    })[0];
    var anchor = name + ANCHOR;
    var delta = name + DELTA;
    var sizeSg = model.getSizeSignalRef(size).signal;
    var scaleCmpt = model.getScaleComponent(channel);
    var scaleType = scaleCmpt.get('type');
    var sign = hasScales && channel === X ? '-' : ''; // Invert delta when panning x-scales.
    var extent = anchor + ".extent_" + channel;
    var offset = "" + sign + delta + "." + channel + " / " + (hasScales ? "" + sizeSg : "span(" + extent + ")");
    var panFn = !hasScales
        ? 'panLinear'
        : scaleType === 'log'
            ? 'panLog'
            : scaleType === 'pow'
                ? 'panPow'
                : 'panLinear';
    var update = panFn + "(" + extent + ", " + offset +
        (hasScales && scaleType === 'pow' ? ", " + (scaleCmpt.get('exponent') || 1) : '') +
        ')';
    signal.on.push({
        events: { signal: delta },
        update: hasScales ? update : "clampRange(" + update + ", 0, " + sizeSg + ")"
    });
}
//# sourceMappingURL=translate.js.map