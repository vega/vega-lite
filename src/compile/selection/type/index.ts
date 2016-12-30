import {UnitModel} from './../../unit';
import {SelectionSpec, SelectionComponent} from '../../../selection';

export interface SelectionCompiler {
  parse: (model: UnitModel, def: SelectionSpec) => any;
  signals: (model: UnitModel, sel: SelectionComponent) => any[];
  tupleExpr: (model: UnitModel, sel: SelectionComponent) => string;
  modifyExpr: (model: UnitModel, sel: SelectionComponent) => string;
  marks: (model: UnitModel, sel:SelectionComponent, marks: any[]) => any[];
  predicate: string;
}

import {default as multi} from './multi';
export {multi};

import {default as single} from './single';
export {single};

import {default as interval} from './interval';
export {interval};
