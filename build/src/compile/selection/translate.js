import { parseSelector } from 'vega-event-selector';
import { X, Y } from '../../channel';
import { BRUSH as INTERVAL_BRUSH } from './interval';
import scalesCompiler, { domain } from './scales';
const ANCHOR = '_translate_anchor';
const DELTA = '_translate_delta';
const translate = {
    defined: selCmpt => {
        return selCmpt.type === 'interval' && selCmpt.translate;
    },
    signals: (model, selCmpt, signals) => {
        const name = selCmpt.name;
        const boundScales = scalesCompiler.defined(selCmpt);
        const anchor = name + ANCHOR;
        const { x, y } = selCmpt.project.hasChannel;
        let events = parseSelector(selCmpt.translate, 'scope');
        if (!boundScales) {
            events = events.map(e => ((e.between[0].markname = name + INTERVAL_BRUSH), e));
        }
        signals.push({
            name: anchor,
            value: {},
            on: [
                {
                    events: events.map(e => e.between[0]),
                    update: '{x: x(unit), y: y(unit)' +
                        (x !== undefined ? `, extent_x: ${boundScales ? domain(model, X) : `slice(${x.signals.visual})`}` : '') +
                        (y !== undefined ? `, extent_y: ${boundScales ? domain(model, Y) : `slice(${y.signals.visual})`}` : '') +
                        '}'
                }
            ]
        }, {
            name: name + DELTA,
            value: {},
            on: [
                {
                    events,
                    update: `{x: ${anchor}.x - x(unit), y: ${anchor}.y - y(unit)}`
                }
            ]
        });
        if (x !== undefined) {
            onDelta(model, selCmpt, x, 'width', signals);
        }
        if (y !== undefined) {
            onDelta(model, selCmpt, y, 'height', signals);
        }
        return signals;
    }
};
export default translate;
function onDelta(model, selCmpt, proj, size, signals) {
    const name = selCmpt.name;
    const anchor = name + ANCHOR;
    const delta = name + DELTA;
    const channel = proj.channel;
    const boundScales = scalesCompiler.defined(selCmpt);
    const signal = signals.filter(s => s.name === proj.signals[boundScales ? 'data' : 'visual'])[0];
    const sizeSg = model.getSizeSignalRef(size).signal;
    const scaleCmpt = model.getScaleComponent(channel);
    const scaleType = scaleCmpt && scaleCmpt.get('type');
    const reversed = scaleCmpt && scaleCmpt.get('reverse'); // scale parsing sets this flag for fieldDef.sort
    const sign = !boundScales ? '' : channel === X ? (reversed ? '' : '-') : reversed ? '-' : '';
    const extent = `${anchor}.extent_${channel}`;
    const offset = `${sign}${delta}.${channel} / ${boundScales ? `${sizeSg}` : `span(${extent})`}`;
    const panFn = !boundScales || !scaleCmpt
        ? 'panLinear'
        : scaleType === 'log'
            ? 'panLog'
            : scaleType === 'symlog'
                ? 'panSymlog'
                : scaleType === 'pow'
                    ? 'panPow'
                    : 'panLinear';
    const arg = !boundScales
        ? ''
        : scaleType === 'pow'
            ? `, ${scaleCmpt.get('exponent') ?? 1}`
            : scaleType === 'symlog'
                ? `, ${scaleCmpt.get('constant') ?? 1}`
                : '';
    const update = `${panFn}(${extent}, ${offset}${arg})`;
    signal.on.push({
        events: { signal: delta },
        update: boundScales ? update : `clampRange(${update}, 0, ${sizeSg})`
    });
}
//# sourceMappingURL=translate.js.map