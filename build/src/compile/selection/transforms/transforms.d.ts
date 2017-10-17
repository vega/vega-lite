import { SelectionDef } from '../../../selection';
import { VgSignal } from '../../../vega.schema';
import { Model } from '../../model';
import { UnitModel } from '../../unit';
import { SelectionComponent } from '../selection';
export interface TransformCompiler {
    has: (selCmpt: SelectionComponent | SelectionDef) => boolean;
    parse?: (model: UnitModel, def: SelectionDef, selCmpt: SelectionComponent) => void;
    signals?: (model: UnitModel, selCmpt: SelectionComponent, signals: VgSignal[]) => VgSignal[];
    topLevelSignals?: (model: Model, selCmpt: SelectionComponent, signals: VgSignal[]) => VgSignal[];
    modifyExpr?: (model: UnitModel, selCmpt: SelectionComponent, expr: string) => string;
    marks?: (model: UnitModel, selCmpt: SelectionComponent, marks: any[]) => any[];
}
export declare function forEachTransform(selCmpt: SelectionComponent, cb: (tx: TransformCompiler) => void): void;
