import {Model} from '../../model';
import {UnitModel} from '../../unit';
import {SelectionComponent} from '../../../selection';

export interface TypeCompiler {
  signals: (model: UnitModel, selCmpt: SelectionComponent) => any[];
  topLevelSignals?: (model: Model, selCmpt: SelectionComponent) => any[];
  tupleExpr: (model: UnitModel, selCmpt: SelectionComponent) => string;
  modifyExpr: (model: UnitModel, selCmpt: SelectionComponent) => string;
  marks?: (model: UnitModel, selCmpt:SelectionComponent, marks: any[]) => any[];
  predicate: string;
}

export {default as multi} from './multi';
export {default as single} from './single';
export {default as interval} from './interval';
