import {Update} from 'vega';
import {TUPLE} from '..';
import {varName} from '../../../util';
import inputBindings from './inputs';
import {TransformCompiler} from './transforms';

const clear: TransformCompiler = {
  has: selCmpt => {
    return selCmpt.clear !== false;
  },

  topLevelSignals: (model, selCmpt, signals) => {
    if (inputBindings.has(selCmpt)) {
      selCmpt.project.forEach(proj => {
        const idx = signals.findIndex(n => n.name === varName(`${selCmpt.name}_${proj.field}`));
        if (idx !== -1) {
          signals[idx].on.push({events: selCmpt.clear, update: 'null'});
        }
      });
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
