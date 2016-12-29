import {SelectionSpec, SelectionComponent, SelectionNames} from '../../../selection';
import {UnitModel} from '../../unit';
import {SelectionCompiler} from './';
import {defaultValue} from '../';
import {default as single} from './single';

const TOGGLE = '_toggle';

const multiCompiler:SelectionCompiler = {
  parseUnitSelection: function(model: UnitModel, def: SelectionSpec) {
    return {
      events: defaultValue(def.on, 'click'),
      project: defaultValue(def.project, {fields: ['_id']}),
      toggle: defaultValue(def.toggle, 'event.shiftKey')
    };
  },

  assembleUnitSignals: function(model: UnitModel, sel: SelectionComponent) {
    return single.assembleUnitSignals(model, sel).concat({
      name: sel.name + TOGGLE,
      value: false,
      on: [{events: sel.events, update: sel.toggle}]
    });
  },

  tupleExpression: single.tupleExpression,

  modifyExpression: function(model: UnitModel, sel: SelectionComponent) {
    let tpl = sel.name + SelectionNames.TUPLE,
        toggle = sel.name + TOGGLE;

    return toggle + ' ? null : ' + tpl + ', ' +
      toggle + ' ? null : true, ' +
      toggle + ' ? ' + tpl + ' : null';
  },

  assembleUnitMarks: function() { return arguments[arguments.length-1]; }
};

export {multiCompiler as default};
