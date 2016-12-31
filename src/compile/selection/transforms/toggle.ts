import {TransformCompiler} from './';
import {NS as NAMES} from '../';

const NS = '_toggle';

const toggle:TransformCompiler = {
  has: function(sel) {
    return sel.toggle !== undefined && sel.toggle !== false;
  },

  signals: function(model, sel, signals) {
    return signals.concat({
      name: sel.name + NS,
      value: false,
      on: [{events: sel.events, update: sel.toggle}]
    });
  },

  modifyExpr: function(model, sel, expr) {
    let tpl = sel.name + NAMES.TUPLE,
        signal = sel.name + NS;

    return signal + ' ? null : ' + tpl + ', ' +
      signal + ' ? null : true, ' +
      signal + ' ? ' + tpl + ' : null';
  }
};

export {toggle as default};
