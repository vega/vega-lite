import {NewSignal} from 'vega';
import {parseSelector} from 'vega-event-selector';
import {stringValue} from 'vega-util';
import {SelectionComponent} from './index.js';
import {ScaleChannel, X, Y} from '../../channel.js';
import {UnitModel} from '../unit.js';
import {BRUSH as INTERVAL_BRUSH} from './interval.js';
import {SelectionProjection} from './project.js';
import {default as scalesCompiler, domain} from './scales.js';
import {SelectionCompiler} from './index.js';

const ANCHOR = '_zoom_anchor';
const DELTA = '_zoom_delta';

const zoom: SelectionCompiler<'interval'> = {
  defined: (selCmpt) => {
    return selCmpt.type === 'interval' && selCmpt.zoom;
  },

  signals: (model, selCmpt, signals) => {
    const name = selCmpt.name;
    const boundScales = scalesCompiler.defined(selCmpt);
    const delta = name + DELTA;
    const {x, y} = selCmpt.project.hasChannel;
    const sx = stringValue(model.scaleName(X));
    const sy = stringValue(model.scaleName(Y));
    let events = parseSelector(selCmpt.zoom, 'scope');

    if (!boundScales) {
      events = events.map((e) => ((e.markname = name + INTERVAL_BRUSH), e));
    }

    signals.push(
      {
        name: name + ANCHOR,
        on: [
          {
            events,
            update: !boundScales
              ? `{x: x(unit), y: y(unit)}`
              : `{${[sx ? `x: invert(${sx}, x(unit))` : '', sy ? `y: invert(${sy}, y(unit))` : '']
                  .filter((expr) => expr)
                  .join(', ')}}`,
          },
        ],
      },
      {
        name: delta,
        on: [
          {
            events,
            force: true,
            update: 'pow(1.001, event.deltaY * pow(16, event.deltaMode))',
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

export default zoom;

function onDelta(
  model: UnitModel,
  selCmpt: SelectionComponent,
  proj: SelectionProjection,
  size: 'width' | 'height',
  signals: NewSignal[],
) {
  const name = selCmpt.name;
  const channel = proj.channel as ScaleChannel;
  const boundScales = scalesCompiler.defined(selCmpt);
  const signal = signals.find((s) => s.name === proj.signals[boundScales ? 'data' : 'visual']);
  const sizeSg = model.getSizeSignalRef(size).signal;
  const scaleCmpt = model.getScaleComponent(channel);
  const scaleType = scaleCmpt?.get('type');
  const base = boundScales ? domain(model, channel) : signal.name;
  const delta = name + DELTA;
  const anchor = `${name}${ANCHOR}.${channel}`;
  const zoomFn =
    !boundScales || !scaleCmpt
      ? 'zoomLinear'
      : scaleType === 'log'
        ? 'zoomLog'
        : scaleType === 'symlog'
          ? 'zoomSymlog'
          : scaleType === 'pow'
            ? 'zoomPow'
            : 'zoomLinear';
  const arg = !boundScales
    ? ''
    : scaleType === 'pow'
      ? `, ${scaleCmpt.get('exponent') ?? 1}`
      : scaleType === 'symlog'
        ? `, ${scaleCmpt.get('constant') ?? 1}`
        : '';
  const update = `${zoomFn}(${base}, ${anchor}, ${delta}${arg})`;

  signal.on.push({
    events: {signal: delta},
    update: boundScales ? update : `clampRange(${update}, 0, ${sizeSg})`,
  });
}
