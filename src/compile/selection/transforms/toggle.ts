import {UnitModel} from './../../unit';
import {SelectionComponent, SelectionNames} from '../../../selection';
import {TransformCompiler} from './';

const NS = '_toggle';

const toggle:TransformCompiler = {
  signals: function(model: UnitModel, sel: SelectionComponent, signals: any[]) {
    return signals.concat({
      name: sel.name + NS,
      value: false,
      on: [{events: sel.events, update: sel.toggle}]
    });
  },

  modifyExpr: function(model: UnitModel, sel: SelectionComponent, expr: string) {
    let tpl = sel.name + SelectionNames.TUPLE,
        signal = sel.name + NS;

    return signal + ' ? null : ' + tpl + ', ' +
      signal + ' ? null : true, ' +
      signal + ' ? ' + tpl + ' : null';
  }
};

export {toggle as default};
