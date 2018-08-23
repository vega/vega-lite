import { stringValue } from 'vega-util';
import { X, Y } from '../../../channel';
import * as log from '../../../log';
import { hasContinuousDomain, isBinScale } from '../../../scale';
import { channelSignalName } from '../selection';
var scaleBindings = {
    has: function (selCmpt) {
        return selCmpt.type === 'interval' && selCmpt.resolve === 'global' && selCmpt.bind && selCmpt.bind === 'scales';
    },
    parse: function (model, selDef, selCmpt) {
        var bound = (selCmpt.scales = []);
        selCmpt.project.forEach(function (p) {
            var channel = p.channel;
            var scale = model.getScaleComponent(channel);
            var scaleType = scale ? scale.get('type') : undefined;
            if (!scale || !hasContinuousDomain(scaleType) || isBinScale(scaleType)) {
                log.warn(log.message.SCALE_BINDINGS_CONTINUOUS);
                return;
            }
            scale.set('domainRaw', { signal: channelSignalName(selCmpt, channel, 'data') }, true);
            bound.push(channel);
            // Bind both x/y for diag plot of repeated views.
            if (model.repeater && model.repeater.row === model.repeater.column) {
                var scale2 = model.getScaleComponent(channel === X ? Y : X);
                scale2.set('domainRaw', { signal: channelSignalName(selCmpt, channel, 'data') }, true);
            }
        });
    },
    topLevelSignals: function (model, selCmpt, signals) {
        // Top-level signals are only needed when coordinating composed views.
        if (!model.parent) {
            return signals;
        }
        var channels = selCmpt.scales.filter(function (channel) {
            return !signals.filter(function (s) { return s.name === channelSignalName(selCmpt, channel, 'data'); }).length;
        });
        return signals.concat(channels.map(function (channel) {
            return { name: channelSignalName(selCmpt, channel, 'data') };
        }));
    },
    signals: function (model, selCmpt, signals) {
        // Nested signals need only push to top-level signals when within composed views.
        if (model.parent) {
            selCmpt.scales.forEach(function (channel) {
                var signal = signals.filter(function (s) { return s.name === channelSignalName(selCmpt, channel, 'data'); })[0];
                signal.push = 'outer';
                delete signal.value;
                delete signal.update;
            });
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