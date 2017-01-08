import {Model} from '../../model';
import {UnitModel} from '../../unit';
import {SelectionSpec, SelectionComponent} from '../../../selection';
import {Dict} from '../../../util';

export interface TransformCompiler {
  has: (sel: SelectionComponent | SelectionSpec) => boolean;
  parse?: (model: UnitModel, def: SelectionSpec, sel: SelectionComponent) => void;
  signals?: (model: UnitModel, sel: SelectionComponent, signals: any[]) => any[];
  topLevelSignals?: (model: Model, sel: SelectionComponent, signals: any[]) => any[];
  // tupleExpr?: (model: UnitModel, sel: SelectionComponent, expr: string) => string;
  modifyExpr?: (model: UnitModel, sel: SelectionComponent, expr: string) => string;
  // marks?: (model: UnitModel, sel:SelectionComponent, marks: any[]) => void;
  clippedGroup?: boolean;
}

import project from './project';
import toggle from './toggle';
import translate from './translate';
import zoom from './zoom';
import scales from './scales';
import inputs from './inputs';
const compilers: Dict<TransformCompiler> = {project, toggle, scales,
  translate, zoom, inputs};

export function transforms(sel: SelectionComponent, cb: (tx: TransformCompiler) => void) {
  for (let t in compilers) {
    if (compilers[t].has(sel)) {
      cb(compilers[t]);
    }
  }
}
