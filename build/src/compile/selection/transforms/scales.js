import { stringValue } from 'vega-util';
import { isScaleChannel, X, Y } from '../../../channel';
import * as log from '../../../log';
import { hasContinuousDomain, isBinScale } from '../../../scale';
import { accessPathWithDatum, varName } from '../../../util';
import { channelSignalName, VL_SELECTION_RESOLVE } from '../selection';
var scaleBindings = {
    has: function (selCmpt) {
        return selCmpt.type === 'interval' && selCmpt.resolve === 'global' && selCmpt.bind && selCmpt.bind === 'scales';
    },
    parse: function (model, selDef, selCmpt) {
        var name = varName(selCmpt.name);
        var bound = (selCmpt.scales = []);
        for (var _i = 0, _a = selCmpt.project; _i < _a.length; _i++) {
            var p = _a[_i];
            var channel = p.channel;
            if (!isScaleChannel(channel)) {
                continue;
            }
            var scale = model.getScaleComponent(channel);
            var scaleType = scale ? scale.get('type') : undefined;
            if (!scale || !hasContinuousDomain(scaleType) || isBinScale(scaleType)) {
                log.warn(log.message.SCALE_BINDINGS_CONTINUOUS);
                continue;
            }
            scale.set('domainRaw', { signal: accessPathWithDatum(p.field, name) }, true);
            bound.push(channel);
            // Bind both x/y for diag plot of repeated views.
            if (model.repeater && model.repeater.row === model.repeater.column) {
                var scale2 = model.getScaleComponent(channel === X ? Y : X);
                scale2.set('domainRaw', { signal: accessPathWithDatum(p.field, name) }, true);
            }
        }
    },
    topLevelSignals: function (model, selCmpt, signals) {
        var channelSignals = selCmpt.scales
            .filter(function (channel) {
            return !signals.filter(function (s) { return s.name === channelSignalName(selCmpt, channel, 'data'); }).length;
        })
            .map(function (channel) {
            return { channel: channel, signal: channelSignalName(selCmpt, channel, 'data') };
        });
        // Top-level signals are only needed for multiview displays and if this
        // view's top-level signals haven't already been generated.
        if (!model.parent || !channelSignals.length) {
            return signals;
        }
        // vlSelectionResolve does not account for the behavior of bound scales in
        // multiview displays. Each unit view adds a tuple to the store, but the
        // state of the selection is the unit selection most recently updated. This
        // state is captured by the top-level signals that we insert and "push
        // outer" to from within the units. We need to reassemble this state into
        // the top-level named signal, except no single selCmpt has a global view.
        var namedSg = signals.filter(function (s) { return s.name === selCmpt.name; })[0];
        var update = namedSg.update;
        if (update.indexOf(VL_SELECTION_RESOLVE) >= 0) {
            namedSg.update =
                '{' + channelSignals.map(function (cs) { return stringValue(selCmpt.fields[cs.channel]) + ": " + cs.signal; }).join(', ') + '}';
        }
        else {
            for (var _i = 0, channelSignals_1 = channelSignals; _i < channelSignals_1.length; _i++) {
                var cs = channelSignals_1[_i];
                var mapping = ", " + stringValue(selCmpt.fields[cs.channel]) + ": " + cs.signal;
                if (update.indexOf(mapping) < 0) {
                    namedSg.update = update.substring(0, update.length - 1) + mapping + '}';
                }
            }
        }
        return signals.concat(channelSignals.map(function (cs) { return ({ name: cs.signal }); }));
    },
    signals: function (model, selCmpt, signals) {
        // Nested signals need only push to top-level signals with multiview displays.
        if (model.parent) {
            var _loop_1 = function (channel) {
                var signal = signals.filter(function (s) { return s.name === channelSignalName(selCmpt, channel, 'data'); })[0];
                signal.push = 'outer';
                delete signal.value;
                delete signal.update;
            };
            for (var _i = 0, _a = selCmpt.scales; _i < _a.length; _i++) {
                var channel = _a[_i];
                _loop_1(channel);
            }
        }
        return signals;
    }
};
export default scaleBindings;
export function domain(model, channel) {
    var scale = stringValue(model.scaleName(channel));
    return "domain(" + scale + ")";
}
//# sourceMappingURL=scales.js.map