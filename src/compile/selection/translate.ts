import {NewSignal} from 'vega';
import {parseSelector} from 'vega-event-selector';
import {SelectionComponent} from './index.js';
import {ScaleChannel, X, Y} from '../../channel.js';
import {UnitModel} from '../unit.js';
import {BRUSH as INTERVAL_BRUSH} from './interval.js';
import {SelectionProjection} from './project.js';
import scalesCompiler, {domain} from './scales.js';
import {SelectionCompiler} from './index.js';

const ANCHOR = '_translate_anchor';
const DELTA = '_translate_delta';

const translate: SelectionCompiler<'interval'> = {
  defined: (selCmpt) => {
    return selCmpt.type === 'interval' && selCmpt.translate;
  },

  signals: (model, selCmpt, signals) => {
    const name = selCmpt.name;
    const boundScales = scalesCompiler.defined(selCmpt);
    const anchor = name + ANCHOR;
    const {x, y} = selCmpt.project.hasChannel;
    let events = parseSelector(selCmpt.translate, 'scope');

    if (!boundScales) {
      events = events.map((e) => ((e.between[0].markname = name + INTERVAL_BRUSH), e));
    }

    signals.push(
      {
        name: anchor,
        value: {},
        on: [
          {
            events: events.map((e) => e.between[0]),
            update: `{x: x(unit), y: y(unit)${
              x !== undefined ? `, extent_x: ${boundScales ? domain(model, X) : `slice(${x.signals.visual})`}` : ''
            }${y !== undefined ? `, extent_y: ${boundScales ? domain(model, Y) : `slice(${y.signals.visual})`}` : ''}}`,
          },
        ],
      },
      {
        name: name + DELTA,
        value: {},
        on: [
          {
            events,
            update: `{x: ${anchor}.x - x(unit), y: ${anchor}.y - y(unit)}`,
          },
        ],
      },
    );

    if (x !== undefined) {
      onDelta(model, selCmpt, x, 'width', signals);
    }

    if (y !== undefined) {
      onDelta(model, selCmpt, y, 'height', signals);
    }

    return signals;
  },
};

export default translate;

function onDelta(
  model: UnitModel,
  selCmpt: SelectionComponent,
  proj: SelectionProjection,
  size: 'width' | 'height',
  signals: NewSignal[],
) {
  const name = selCmpt.name;
  const anchor = name + ANCHOR;
  const delta = name + DELTA;
  const channel = proj.channel as ScaleChannel;
  const boundScales = scalesCompiler.defined(selCmpt);
  const signal = signals.find((s) => s.name === proj.signals[boundScales ? 'data' : 'visual']);
  const sizeSg = model.getSizeSignalRef(size).signal;
  const scaleCmpt = model.getScaleComponent(channel);
  const scaleType = scaleCmpt?.get('type');
  const reversed = scaleCmpt?.get('reverse'); // scale parsing sets this flag for fieldDef.sort
  const sign = !boundScales ? '' : channel === X ? (reversed ? '' : '-') : reversed ? '-' : '';
  const extent = `${anchor}.extent_${channel}`;
  const offset = `${sign}${delta}.${channel} / ${boundScales ? `${sizeSg}` : `span(${extent})`}`;
  const panFn =
    !boundScales || !scaleCmpt
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
    events: {signal: delta},
    update: boundScales ? update : `clampRange(${update}, 0, ${sizeSg})`,
  });
}
