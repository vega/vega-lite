import { stringValue } from 'vega-util';
import { isScaleChannel, X, Y } from '../../../channel';
import * as log from '../../../log';
import { hasContinuousDomain, isBinScale } from '../../../scale';
import { accessPathWithDatum, varName } from '../../../util';
import { channelSignalName, VL_SELECTION_RESOLVE } from '../selection';
const scaleBindings = {
    has: selCmpt => {
        return selCmpt.type === 'interval' && selCmpt.resolve === 'global' && selCmpt.bind && selCmpt.bind === 'scales';
    },
    parse: (model, selDef, selCmpt) => {
        const name = varName(selCmpt.name);
        const bound = (selCmpt.scales = []);
        for (const p of selCmpt.project) {
            const channel = p.channel;
            if (!isScaleChannel(channel)) {
                continue;
            }
            const scale = model.getScaleComponent(channel);
            const scaleType = scale ? scale.get('type') : undefined;
            if (!scale || !hasContinuousDomain(scaleType) || isBinScale(scaleType)) {
                log.warn(log.message.SCALE_BINDINGS_CONTINUOUS);
                continue;
            }
            scale.set('domainRaw', { signal: accessPathWithDatum(p.field, name) }, true);
            bound.push(channel);
            // Bind both x/y for diag plot of repeated views.
            if (model.repeater && model.repeater.row === model.repeater.column) {
                const scale2 = model.getScaleComponent(channel === X ? Y : X);
                scale2.set('domainRaw', { signal: accessPathWithDatum(p.field, name) }, true);
            }
        }
    },
    topLevelSignals: (model, selCmpt, signals) => {
        const channelSignals = selCmpt.scales
            .filter(channel => {
            return !signals.filter(s => s.name === channelSignalName(selCmpt, channel, 'data')).length;
        })
            .map(channel => {
            return { channel, signal: channelSignalName(selCmpt, channel, 'data') };
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
        const namedSg = signals.filter(s => s.name === selCmpt.name)[0];
        const update = namedSg.update;
        if (update.indexOf(VL_SELECTION_RESOLVE) >= 0) {
            namedSg.update =
                '{' + channelSignals.map(cs => `${stringValue(selCmpt.fields[cs.channel])}: ${cs.signal}`).join(', ') + '}';
        }
        else {
            for (const cs of channelSignals) {
                const mapping = `, ${stringValue(selCmpt.fields[cs.channel])}: ${cs.signal}`;
                if (update.indexOf(mapping) < 0) {
                    namedSg.update = update.substring(0, update.length - 1) + mapping + '}';
                }
            }
        }
        return signals.concat(channelSignals.map(cs => ({ name: cs.signal })));
    },
    signals: (model, selCmpt, signals) => {
        // Nested signals need only push to top-level signals with multiview displays.
        if (model.parent) {
            for (const channel of selCmpt.scales) {
                const signal = signals.filter(s => s.name === channelSignalName(selCmpt, channel, 'data'))[0];
                // convert to PushSignal
                signal.push = 'outer';
                delete signal.value;
                delete signal.update;
            }
        }
        return signals;
    }
};
export default scaleBindings;
export function domain(model, channel) {
    const scale = stringValue(model.scaleName(channel));
    return `domain(${scale})`;
}
//# sourceMappingURL=scales.js.map