import {selector as parseSelector} from 'vega-event-selector';
import {TUPLE} from '..';
import {TransformCompiler} from './transforms';

const CLEAR_DATA_SIGNALS = [TUPLE, '_toggle'];
const CLEAR_VISUAL_SIGNALS = ['_x', '_y'];

const CLEAR_SIGNALS = [CLEAR_DATA_SIGNALS, CLEAR_VISUAL_SIGNALS];
const CLEAR_TRIGGERS = {mouseover: 'mouseout', click: 'dblclick'};
const CLEAR_UPDATE = ['null', '[0, 0]'];

const clear: TransformCompiler = {
  has: selCmpt => {
    if (selCmpt.clear === false) {
      return false;
    }
    return (selCmpt['on'] && selCmpt.type !== 'interval') || selCmpt['bind'];
  },

  signals: (model, selCmpt, signals) => {
    const trigger = CLEAR_TRIGGERS[selCmpt['on']] ? CLEAR_TRIGGERS[selCmpt['on']] : 'dblclick';
    const events = selCmpt.clear ? parseSelector(selCmpt.clear, 'scope') : parseSelector(trigger, 'scope');

    if (selCmpt['bind']) {
      selCmpt.project.forEach(proj => {
        const ext = '_' + proj.field;
        const idx = signals.findIndex(n => n.name === selCmpt.name + ext);
        if (idx !== -1) {
          signals[idx].on = signals[idx].on
            ? signals[idx].on.concat({
                events: events,
                update: CLEAR_UPDATE[0]
              })
            : [{events: events, update: CLEAR_UPDATE[0]}];
        }
      });
    } else if (selCmpt['on']) {
      CLEAR_SIGNALS.forEach((signal, k) => {
        for (const ext of signal) {
          const idx = signals.findIndex(n => n.name === selCmpt.name + ext);
          if (idx !== -1) {
            signals[idx].on = signals[idx].on
              ? signals[idx].on.concat({
                  events: events,
                  update: CLEAR_UPDATE[k]
                })
              : [{events: events, update: CLEAR_UPDATE[k]}];
          }
        }
      });
    }
    return signals;
  }
};

export default clear;
