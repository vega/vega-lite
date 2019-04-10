import {NewSignal, Signal} from 'vega';
import {SelectionComponent} from '..';
import {SelectionDef} from '../../../selection';
import {Model} from '../../model';
import {UnitModel} from '../../unit';
import clear from './clear';
import inputs from './inputs';
import nearest from './nearest';
import project from './project';
import scales from './scales';
import toggle from './toggle';
import translate from './translate';
import zoom from './zoom';

export interface TransformCompiler {
  has: (selCmpt: SelectionComponent | SelectionDef) => boolean;
  parse?: (model: UnitModel, def: SelectionDef, selCmpt: SelectionComponent) => void;
  signals?: (model: UnitModel, selCmpt: SelectionComponent, signals: NewSignal[]) => Signal[]; // the output can be a new or a push signal
  topLevelSignals?: (model: Model, selCmpt: SelectionComponent, signals: NewSignal[]) => NewSignal[];
  modifyExpr?: (model: UnitModel, selCmpt: SelectionComponent, expr: string) => string;
  marks?: (model: UnitModel, selCmpt: SelectionComponent, marks: any[]) => any[];
}

const compilers: TransformCompiler[] = [project, toggle, scales, translate, zoom, inputs, nearest, clear];

export function forEachTransform(selCmpt: SelectionComponent, cb: (tx: TransformCompiler) => void) {
  for (const t of compilers) {
    if (t.has(selCmpt)) {
      cb(t);
    }
  }
}
