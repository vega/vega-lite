import {TUPLE} from '..';
import {TransformCompiler} from './transforms';

const clear: TransformCompiler = {
  has: selCmpt => {
    return selCmpt.type === 'multi' && selCmpt.clear;
  },

  signals: (model, selCmpt, signals) => {
    const tupleIdx = signals.findIndex(i => i.name === selCmpt.name + TUPLE);
    signals[tupleIdx].on.push({
      events: [{source: 'scope', type: selCmpt.clear}],
      update: 'null'
    });
    return signals;
  }
};

export default clear;
