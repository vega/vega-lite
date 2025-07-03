import {TUPLE, isTimerSelection, unitName} from './index.js';
import {SelectionCompiler} from './index.js';

export const TOGGLE = '_toggle';

const toggle: SelectionCompiler<'point'> = {
  defined: (selCmpt) => {
    return selCmpt.type === 'point' && !isTimerSelection(selCmpt) && !!selCmpt.toggle;
  },

  signals: (model, selCmpt, signals) => {
    return signals.concat({
      name: selCmpt.name + TOGGLE,
      value: false,
      on: [{events: selCmpt.events, update: selCmpt.toggle}],
    });
  },

  modifyExpr: (model, selCmpt) => {
    const tpl = selCmpt.name + TUPLE;
    const signal = selCmpt.name + TOGGLE;

    return `${signal} ? null : ${tpl}, ${
      selCmpt.resolve === 'global' ? `${signal} ? null : true, ` : `${signal} ? null : {unit: ${unitName(model)}}, `
    }${signal} ? ${tpl} : null`;
  },
};

export default toggle;
