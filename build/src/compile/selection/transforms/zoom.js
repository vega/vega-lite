import { selector as parseSelector } from 'vega-event-selector';
import { stringValue } from 'vega-util';
import { X, Y } from '../../../channel';
import { BRUSH as INTERVAL_BRUSH } from '../interval';
import { channelSignalName, positionalProjections } from '../selection';
import { default as scalesCompiler, domain } from './scales';
var ANCHOR = '_zoom_anchor';
var DELTA = '_zoom_delta';
var zoom = {
    has: function (selCmpt) {
        return selCmpt.type === 'interval' && selCmpt.zoom;
    },
    signals: function (model, selCmpt, signals) {
        var name = selCmpt.name;
        var hasScales = scalesCompiler.has(selCmpt);
        var delta = name + DELTA;
        var _a = positionalProjections(selCmpt), x = _a.x, y = _a.y;
        var sx = stringValue(model.scaleName(X));
        var sy = stringValue(model.scaleName(Y));
        var events = parseSelector(selCmpt.zoom, 'scope');
        if (!hasScales) {
            events = events.map(function (e) { return ((e.markname = name + INTERVAL_BRUSH), e); });
        }
        signals.push({
            name: name + ANCHOR,
            on: [
                {
                    events: events,
                    update: !hasScales
                        ? "{x: x(unit), y: y(unit)}"
                        : '{' +
                            [sx ? "x: invert(" + sx + ", x(unit))" : '', sy ? "y: invert(" + sy + ", y(unit))" : '']
                                .filter(function (expr) { return !!expr; })
                                .join(', ') +
                            '}'
                }
            ]
        }, {
            name: delta,
            on: [
                {
                    events: events,
                    force: true,
                    update: 'pow(1.001, event.deltaY * pow(16, event.deltaMode))'
                }
            ]
        });
        if (x !== null) {
            onDelta(model, selCmpt, 'x', 'width', signals);
        }
        if (y !== null) {
            onDelta(model, selCmpt, 'y', 'height', signals);
        }
        return signals;
    }
};
export default zoom;
function onDelta(model, selCmpt, channel, size, signals) {
    var name = selCmpt.name;
    var hasScales = scalesCompiler.has(selCmpt);
    var signal = signals.filter(function (s) {
        return s.name === channelSignalName(selCmpt, channel, hasScales ? 'data' : 'visual');
    })[0];
    var sizeSg = model.getSizeSignalRef(size).signal;
    var scaleCmpt = model.getScaleComponent(channel);
    var scaleType = scaleCmpt.get('type');
    var base = hasScales ? domain(model, channel) : signal.name;
    var delta = name + DELTA;
    var anchor = "" + name + ANCHOR + "." + channel;
    var zoomFn = !hasScales
        ? 'zoomLinear'
        : scaleType === 'log'
            ? 'zoomLog'
            : scaleType === 'pow'
                ? 'zoomPow'
                : 'zoomLinear';
    var update = zoomFn + "(" + base + ", " + anchor + ", " + delta +
        (hasScales && scaleType === 'pow' ? ", " + (scaleCmpt.get('exponent') || 1) : '') +
        ')';
    signal.on.push({
        events: { signal: delta },
        update: hasScales ? update : "clampRange(" + update + ", 0, " + sizeSg + ")"
    });
}
//# sourceMappingURL=zoom.js.map