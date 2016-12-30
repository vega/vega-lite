import {SelectionSpec, SelectionComponent, SelectionNames} from '../../../selection';
import {UnitModel} from '../../unit';
import {SelectionCompiler} from './';
import {defaultValue} from '../';
import {stringValue} from '../../../util';

const TOGGLE = '_toggle';

const multiCompiler:SelectionCompiler = {
  predicate: 'inPointSelection',

  parse: function(model: UnitModel, def: SelectionSpec) {
    return {
      events: defaultValue(def.on, 'click'),
      project: defaultValue(def.project, {fields: ['_id']}),
      toggle: defaultValue(def.toggle, 'event.shiftKey')
    };
  },

  signals: function(model: UnitModel, sel: SelectionComponent) {
    let proj = sel.project;
    return [{
      name: sel.name,
      value: {},
      on: [{
        events: sel.events,
        update: '{fields: [' +
          proj.map((p: any) => stringValue(p.field)).join(', ') +
          '], values: [' +
          proj.map((p: any) => 'datum[' + stringValue(p.field) + ']').join(', ') +
          ']}'
      }]
    }, {
      name: sel.name + TOGGLE,
      value: false,
      on: [{events: sel.events, update: sel.toggle}]
    }];
  },

  tupleExpr: function(model: UnitModel, sel: SelectionComponent) {
    let name = sel.name;
    return 'fields: ' + name + '.fields, values: ' + name + '.values';
  },

  modifyExpr: function(model: UnitModel, sel: SelectionComponent) {
    let tpl = sel.name + SelectionNames.TUPLE,
        toggle = sel.name + TOGGLE;

    return toggle + ' ? null : ' + tpl + ', ' +
      toggle + ' ? null : true, ' +
      toggle + ' ? ' + tpl + ' : null';
  },

  marks: function() { return arguments[arguments.length-1]; }
};

export {multiCompiler as default};
