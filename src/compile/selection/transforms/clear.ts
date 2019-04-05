import {NewSignal, Update} from 'vega';
import {selector as parseSelector} from 'vega-event-selector';
import {TUPLE} from '..';
import {TransformCompiler} from './transforms';

const clear: TransformCompiler = {
  has: selCmpt => {
    return selCmpt.clear === false ? false : true;
  },

  signals: (model, selCmpt, signals) => {
    const trigger = selCmpt['on'] === 'mouseover' ? 'mouseout' : 'dblclick';
    const events = selCmpt.clear ? parseSelector(selCmpt.clear, 'scope') : parseSelector(trigger, 'scope');
    selCmpt.project.forEach(proj => {
      const d_idx = signals.findIndex(n => n.name === proj.signals.data);
      const v_idx = signals.findIndex(n => n.name === proj.signals.visual);
      addClear(d_idx, signals, events, 'null');
      addClear(v_idx, signals, events, '[0, 0]');
    });
    const t_idx = signals.findIndex(n => n.name === selCmpt.name + TUPLE);
    addClear(t_idx, signals, events, 'null');
    return signals;
  }
};

export default clear;

function addClear(idx: number, signals: NewSignal[], events: any[], update: Update) {
  if (idx !== -1 && signals[idx].on) {
    signals[idx].on.push({
      events: events,
      update: update
    });
  }
}
