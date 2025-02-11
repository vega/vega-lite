import {Update} from 'vega';
import {parseSelector} from 'vega-event-selector';
import {isString} from 'vega-util';
import {TUPLE, isTimerSelection} from './index.js';
import {varName} from '../../util.js';
import inputBindings from './inputs.js';
import toggle, {TOGGLE} from './toggle.js';
import {SelectionCompiler} from './index.js';

const clear: SelectionCompiler = {
  defined: (selCmpt) => {
    return selCmpt.clear !== undefined && selCmpt.clear !== false && !isTimerSelection(selCmpt);
  },

  parse: (model, selCmpt) => {
    if (selCmpt.clear) {
      selCmpt.clear = isString(selCmpt.clear) ? parseSelector(selCmpt.clear, 'view') : selCmpt.clear;
    }
  },

  topLevelSignals: (model, selCmpt, signals) => {
    if (inputBindings.defined(selCmpt)) {
      for (const proj of selCmpt.project.items) {
        const idx = signals.findIndex((n) => n.name === varName(`${selCmpt.name}_${proj.field}`));
        if (idx !== -1) {
          signals[idx].on.push({events: selCmpt.clear, update: 'null'});
        }
      }
    }

    return signals;
  },

  signals: (model, selCmpt, signals) => {
    function addClear(idx: number, update: Update) {
      if (idx !== -1 && signals[idx].on) {
        signals[idx].on.push({events: selCmpt.clear, update});
      }
    }

    // Be as minimalist as possible when adding clear triggers to minimize dataflow execution.
    if (selCmpt.type === 'interval') {
      for (const proj of selCmpt.project.items) {
        const vIdx = signals.findIndex((n) => n.name === proj.signals.visual);
        addClear(vIdx, '[0, 0]');

        if (vIdx === -1) {
          const dIdx = signals.findIndex((n) => n.name === proj.signals.data);
          addClear(dIdx, 'null');
        }
      }
    } else {
      let tIdx = signals.findIndex((n) => n.name === selCmpt.name + TUPLE);
      addClear(tIdx, 'null');

      if (toggle.defined(selCmpt)) {
        tIdx = signals.findIndex((n) => n.name === selCmpt.name + TOGGLE);
        addClear(tIdx, 'false');
      }
    }

    return signals;
  },
};

export default clear;
