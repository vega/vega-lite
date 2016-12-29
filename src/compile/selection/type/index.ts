import {UnitModel} from './../../unit';
import {SelectionSpec, SelectionComponent} from '../../../selection';

export interface SelectionCompiler {
  parseUnitSelection:  (model: UnitModel, def: SelectionSpec) => any;
  assembleUnitSignals: (model: UnitModel, sel: SelectionComponent) => any[];
  tupleExpression:  (model: UnitModel, sel: SelectionComponent) => string;
  modifyExpression: (model: UnitModel, sel: SelectionComponent) => string;
  assembleUnitMarks: (model: UnitModel, sel:SelectionComponent, marks: any[]) => any[];
}

import {default as single} from './single';
export {single};

import {default as multi} from './multi';
export {multi};

import {default as interval} from './interval';
export {interval};
