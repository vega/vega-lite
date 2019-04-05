import {Update} from 'vega';
import {selector as parseSelector} from 'vega-event-selector';
import {TUPLE} from '..';
import {TransformCompiler} from './transforms';

const clear: TransformCompiler = {
  has: selCmpt => {
    return selCmpt.clear !== false;
  },

  signals: (model, selCmpt, signals) => {
    const on = selCmpt.events[0].type;
    const trigger = on === 'mouseover' ? 'mouseout' : 'dblclick';
    const events = selCmpt.clear ? parseSelector(selCmpt.clear, 'scope') : parseSelector(trigger, 'scope');

    function addClear(idx: number, update: Update) {
      if (idx !== -1 && signals[idx].on) {
        signals[idx].on.push({
          events: events,
          update: update
        });
      }
    }

    // Be as minimalist as possible when adding clear triggers to minimize dataflow execution.
    if (selCmpt.type === 'interval') {
      selCmpt.project.forEach(proj => {
        const vIdx = signals.findIndex(n => n.name === proj.signals.visual);
        addClear(vIdx, '[0, 0]');

        if (vIdx === -1) {
          const dIdx = signals.findIndex(n => n.name === proj.signals.data);
          addClear(dIdx, 'null');
        }
      });
    } else {
      const tIdx = signals.findIndex(n => n.name === selCmpt.name + TUPLE);
      addClear(tIdx, 'null');
    }

    return signals;
  }
};

export default clear;
