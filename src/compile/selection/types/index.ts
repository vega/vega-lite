import {Model} from '../../model';
import {UnitModel} from '../../unit';
import {SelectionComponent} from '../../../selection';

export interface TypeCompiler {
  signals: (model: UnitModel, sel: SelectionComponent) => any[];
  topLevelSignals?: (model: Model, sel: SelectionComponent) => any[];
  tupleExpr: (model: UnitModel, sel: SelectionComponent) => string;
  modifyExpr: (model: UnitModel, sel: SelectionComponent) => string;
  marks?: (model: UnitModel, sel:SelectionComponent, marks: any[]) => any[];
  predicate: string;
}

export {default as multi} from './multi';
export {default as single} from './single';
export {default as interval} from './interval';
