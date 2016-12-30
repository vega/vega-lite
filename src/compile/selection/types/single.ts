import {SelectionSpec, SelectionComponent} from '../../../selection';
import {UnitModel} from '../../unit';
import {TypeCompiler, multi} from './';
import {defaultValue, NS} from '../';

const single:TypeCompiler = {
  predicate: multi.predicate,

  parse: function(model: UnitModel, def: SelectionSpec) {
    return {
      events: defaultValue(def.on, 'click'),
      project: defaultValue(def.project, {fields: ['_id']})
    };
  },

  signals: multi.signals,

  tupleExpr: function(model: UnitModel, sel: SelectionComponent) {
    let name = sel.name, values = name + '.values';
    return 'fields: ' + name + '.fields, values: ' + values + ', ' +
      sel.project.map(function(p: any, i: number) {
        return p.field + ': ' + values + '[' + i + ']';
      }).join(', ');
  },

  modifyExpr: function(model: UnitModel, sel: SelectionComponent) {
    return sel.name + NS.TUPLE + ', true';
  }
};

export {single as default};
