import {stringValue} from 'vega-util';

import {signals as multiSignals} from './multi';
import {SelectionCompiler, STORE, TUPLE, unitName} from './selection';

const single: SelectionCompiler = {
  predicate: 'vlSingle',
  scaleDomain: 'vlSingleDomain',

  signals: multiSignals,

  topLevelSignals: (model, selCmpt, signals) => {
    const hasSignal = signals.filter(s => s.name === selCmpt.name);
    const data = `data(${stringValue(selCmpt.name + STORE)})`;
    const values = `${data}[0].values`;
    return hasSignal.length
      ? signals
      : signals.concat({
          name: selCmpt.name,
          update: `${data}.length && {` + selCmpt.project.map((p, i) => `${p.field}: ${values}[${i}]`).join(', ') + '}'
        });
  },

  modifyExpr: (model, selCmpt) => {
    const tpl = selCmpt.name + TUPLE;
    return tpl + ', ' + (selCmpt.resolve === 'global' ? 'true' : `{unit: ${unitName(model)}}`);
  }
};

export default single;
