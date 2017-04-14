import {SelectionDef} from '../../../selection';
import {Dict} from '../../../util';
import {Model} from '../../model';
import {UnitModel} from '../../unit';
import {SelectionComponent} from '../selection';

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

import inputs from './inputs';
import nearest from './nearest';
import project from './project';
import scales from './scales';
import toggle from './toggle';
import translate from './translate';
import zoom from './zoom';
const compilers: Dict<TransformCompiler> = {project, toggle, scales,
  translate, zoom, inputs, nearest};

export function forEachTransform(selCmpt: SelectionComponent, cb: (tx: TransformCompiler) => void) {
  for (const t in compilers) {
    if (compilers[t].has(selCmpt)) {
      cb(compilers[t]);
    }
  }
}
