import {Model} from '../../model';
import {UnitModel} from '../../unit';
import {SelectionDef} from '../../../selection';
import {SelectionComponent} from '../selection';
import {Dict} from '../../../util';

export interface TransformCompiler {
  has: (selCmpt: SelectionComponent | SelectionDef) => boolean;
  parse?: (model: UnitModel, def: SelectionDef, selCmpt: SelectionComponent) => void;
  signals?: (model: UnitModel, selCmpt: SelectionComponent, signals: any[]) => any[];
  topLevelSignals?: (model: Model, selCmpt: SelectionComponent, signals: any[]) => any[];
  // tupleExpr?: (model: UnitModel, selCmpt: SelectionComponent, expr: string) => string;
  modifyExpr?: (model: UnitModel, selCmpt: SelectionComponent, expr: string) => string;
  marks?: (model: UnitModel, selCmpt:SelectionComponent, marks: any[], selMarks: any[]) => any[];
  clippedGroup?: boolean;
}

import project from './project';
import toggle from './toggle';
import translate from './translate';
import zoom from './zoom';
import scales from './scales';
import inputs from './inputs';
import nearest from './nearest';
const compilers: Dict<TransformCompiler> = {project, toggle, scales,
  translate, zoom, inputs, nearest};

export function forEachTransform(selCmpt: SelectionComponent, cb: (tx: TransformCompiler) => void) {
  for (let t in compilers) {
    if (compilers[t].has(selCmpt)) {
      cb(compilers[t]);
    }
  }
}
