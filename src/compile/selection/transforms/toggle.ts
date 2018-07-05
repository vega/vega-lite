import {TUPLE, unitName} from '../selection';
import {TransformCompiler} from './transforms';

const TOGGLE = '_toggle';

const toggle: TransformCompiler = {
  has: selCmpt => {
    return selCmpt.type === 'multi' && selCmpt.toggle;
  },

  signals: (model, selCmpt, signals) => {
    return signals.concat({
      name: selCmpt.name + TOGGLE,
      value: false,
      on: [{events: selCmpt.events, update: selCmpt.toggle}]
    });
  },

  modifyExpr: (model, selCmpt, expr) => {
    const tpl = selCmpt.name + TUPLE;
    const signal = selCmpt.name + TOGGLE;

    return (
      `${signal} ? null : ${tpl}, ` +
      (selCmpt.resolve === 'global' ? `${signal} ? null : true, ` : `${signal} ? null : {unit: ${unitName(model)}}, `) +
      `${signal} ? ${tpl} : null`
    );
  }
};

export default toggle;
