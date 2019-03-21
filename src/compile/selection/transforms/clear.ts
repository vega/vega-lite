import {TUPLE} from '..';
import {selector as parseSelector} from 'vega-event-selector';
import {TransformCompiler} from './transforms';

const CLEAR_DATA_SIGNALS = [TUPLE, '_toggle'];
const CLEAR_VISUAL_SIGNALS = ['_x', '_y'];

const CLEAR_SIGNALS = [CLEAR_DATA_SIGNALS, CLEAR_VISUAL_SIGNALS];
const CLEAR_UPDATE = ['null', '[0, 0]'];

const clear: TransformCompiler = {
  has: selCmpt => {
    return selCmpt.clear;
  },

  signals: (model, selCmpt, signals) => {
    let events = parseSelector(selCmpt.clear, 'scope');
    CLEAR_SIGNALS.forEach((signal, k) => {
      for (let i = 0; i < signal.length; i++) {
        const idx = signals.findIndex(n => n.name === selCmpt.name + signal[i]);
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
    return signals;
  }
};

export default clear;
