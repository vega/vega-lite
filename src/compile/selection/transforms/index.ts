import {UnitModel} from './../../unit';
import {SelectionSpec, SelectionComponent} from '../../../selection';
import {Dict} from '../../../util';

export interface TransformCompiler {
  has: (sel: SelectionComponent | SelectionSpec) => boolean;
  parse?: (model: UnitModel, def: SelectionSpec, sel: SelectionComponent) => void;
  signals?: (model: UnitModel, sel: SelectionComponent, signals: any[]) => any[];
  // tupleExpr?: (model: UnitModel, sel: SelectionComponent, expr: string) => string;
  modifyExpr?: (model: UnitModel, sel: SelectionComponent, expr: string) => string;
  // marks?: (model: UnitModel, sel:SelectionComponent, marks: any[]) => void;
}

import project from './project';
import toggle from './toggle';
import translate from './translate';
import zoom from './zoom';
export const transforms: Dict<TransformCompiler> = {
  'project': project,
  'toggle': toggle,
  'translate': translate,
  'zoom': zoom
};
