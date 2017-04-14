import { SelectionDef } from '../../../selection';
import { Model } from '../../model';
import { UnitModel } from '../../unit';
import { SelectionComponent } from '../selection';
export interface TransformCompiler {
    has: (selCmpt: SelectionComponent | SelectionDef) => boolean;
    parse?: (model: UnitModel, def: SelectionDef, selCmpt: SelectionComponent) => void;
    signals?: (model: UnitModel, selCmpt: SelectionComponent, signals: any[]) => any[];
    topLevelSignals?: (model: Model, selCmpt: SelectionComponent, signals: any[]) => any[];
    modifyExpr?: (model: UnitModel, selCmpt: SelectionComponent, expr: string) => string;
    marks?: (model: UnitModel, selCmpt: SelectionComponent, marks: any[], selMarks: any[]) => any[];
    clippedGroup?: boolean;
}
export declare function forEachTransform(selCmpt: SelectionComponent, cb: (tx: TransformCompiler) => void): void;
