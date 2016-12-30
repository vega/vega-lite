import {UnitModel} from './../../unit';
import {SelectionSpec, SelectionComponent} from '../../../selection';
import {Dict} from '../../../util';

export interface TransformCompiler {
  parse?: (model: UnitModel, def: SelectionSpec, sel: SelectionComponent) => void;
  signals?: (model: UnitModel, sel: SelectionComponent, signals: any[]) => any[];
  // tupleExpr?: (model: UnitModel, sel: SelectionComponent, expr: string) => string;
  modifyExpr?: (model: UnitModel, sel: SelectionComponent, expr: string) => string;
  // marks?: (model: UnitModel, sel:SelectionComponent, marks: any[]) => void;
}

import {default as project} from './project';
import {default as toggle} from './toggle';
import {default as translate} from './translate';
export const transforms: Dict<TransformCompiler> = {
  'project': project,
  'toggle': toggle,
  'translate': translate
};
