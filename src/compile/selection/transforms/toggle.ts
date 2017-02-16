import {TransformCompiler} from './transforms';
import {TUPLE} from '../selection';

const TOGGLE = '_toggle';

const toggle:TransformCompiler = {
  has: function(selCmpt) {
    return selCmpt.toggle !== undefined && selCmpt.toggle !== false;
  },

  signals: function(model, selCmpt, signals) {
    return signals.concat({
      name: selCmpt.name + TOGGLE,
      value: false,
      on: [{events: selCmpt.events, update: selCmpt.toggle}]
    });
  },

  modifyExpr: function(model, selCmpt, expr) {
    let tpl = selCmpt.name + TUPLE,
        signal = selCmpt.name + TOGGLE;

    return `${signal} ? null : ${tpl}, ` +
      `${signal} ? null : true, ` +
      `${signal} ? ${tpl} : null`;
  }
};

export {toggle as default};
