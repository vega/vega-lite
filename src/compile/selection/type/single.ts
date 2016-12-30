import {SelectionSpec, SelectionComponent, SelectionNames} from '../../../selection';
import {UnitModel} from '../../unit';
import {SelectionCompiler, multi} from './';
import {defaultValue} from '../';
import {stringValue} from '../../../util';

const singleCompiler:SelectionCompiler = {
  predicate: multi.predicate,

  parse: function(model: UnitModel, def: SelectionSpec) {
    return {
      events: defaultValue(def.on, 'click'),
      project: defaultValue(def.project, {fields: ['_id']})
    };
  },

  signals: function(model: UnitModel, sel: SelectionComponent) {
    return [multi.signals(model, sel)[0]];
  },

  tupleExpr: function(model: UnitModel, sel: SelectionComponent) {
    let name = sel.name, values = name + '.values';
    return 'fields: ' + name + '.fields, values: ' + values + ', ' +
      sel.project.map(function(p: any, i: number) {
        return p.field + ': ' + values + '[' + i + ']'
      }).join(', ');
  },

  modifyExpr: function(model: UnitModel, sel: SelectionComponent) {
    return sel.name + SelectionNames.TUPLE + ', true';
  },

  marks: function() { return arguments[arguments.length-1]; }
};

export {singleCompiler as default};
