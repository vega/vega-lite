import {TransformCompiler} from './';
import {TUPLE} from '../';

const TOGGLE = '_toggle';

const toggle:TransformCompiler = {
  has: function(sel) {
    return sel.toggle !== undefined && sel.toggle !== false;
  },

  signals: function(model, sel, signals) {
    return signals.concat({
      name: sel.name + TOGGLE,
      value: false,
      on: [{events: sel.events, update: sel.toggle}]
    });
  },

  modifyExpr: function(model, sel, expr) {
    let tpl = sel.name + TUPLE,
        signal = sel.name + TOGGLE;

    return `${signal} ? null : ${tpl}, ` +
      `${signal} ? null : true, ` +
      `${signal} ? ${tpl} : null`;
  }
};

export {toggle as default};
