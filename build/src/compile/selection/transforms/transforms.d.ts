import { NewSignal, Signal } from 'vega';
import { SelectionDef } from '../../../selection';
import { Model } from '../../model';
import { UnitModel } from '../../unit';
import { SelectionComponent } from '../selection';
export interface TransformCompiler {
    has: (selCmpt: SelectionComponent | SelectionDef) => boolean;
    parse?: (model: UnitModel, def: SelectionDef, selCmpt: SelectionComponent) => void;
    signals?: (model: UnitModel, selCmpt: SelectionComponent, signals: NewSignal[]) => Signal[];
    topLevelSignals?: (model: Model, selCmpt: SelectionComponent, signals: NewSignal[]) => NewSignal[];
    modifyExpr?: (model: UnitModel, selCmpt: SelectionComponent, expr: string) => string;
    marks?: (model: UnitModel, selCmpt: SelectionComponent, marks: any[]) => any[];
}
export declare function forEachTransform(selCmpt: SelectionComponent, cb: (tx: TransformCompiler) => void): void;
