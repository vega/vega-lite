import {TransformCompiler} from './transforms';
import {TUPLE} from '..';

const clear: TransformCompiler = {
  has: selCmpt => {
    return selCmpt.type === 'multi' && selCmpt.clear !== 'none';
  },

  signals: (model, selCmpt, signals) => {
    const tupleIdx = signals.findIndex(i => i.name === selCmpt.name + TUPLE);
    signals[tupleIdx].on.push({
      events: selCmpt.clear,
      update: 'null'
    });
    return signals;
  }
};

export default clear;
