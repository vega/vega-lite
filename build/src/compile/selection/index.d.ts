import { Binding, NewSignal, SignalRef } from 'vega';
import { BrushConfig, SelectionInit, SelectionInitInterval, SelectionResolution, SelectionType } from '../../selection';
import { Dict } from '../../util';
import { EventStream } from '../../vega.schema';
import { Model } from '../model';
import { UnitModel } from '../unit';
import { SelectionProjection, SelectionProjectionComponent } from './transforms/project';
export declare const STORE = "_store";
export declare const TUPLE = "_tuple";
export declare const MODIFY = "_modify";
export declare const SELECTION_DOMAIN = "_selection_domain_";
export declare const VL_SELECTION_RESOLVE = "vlSelectionResolve";
export interface SelectionComponent<T extends SelectionType = SelectionType> {
    name: string;
    type: T;
    init?: (T extends 'interval' ? SelectionInitInterval : T extends 'single' ? SelectionInit : SelectionInit | SelectionInit[])[];
    events: EventStream;
    bind?: 'scales' | Binding | Dict<Binding>;
    resolve: SelectionResolution;
    empty: 'all' | 'none';
    mark?: BrushConfig;
    project?: SelectionProjectionComponent;
    scales?: SelectionProjection[];
    toggle?: any;
    translate?: any;
    zoom?: any;
    nearest?: any;
    clear?: any;
}
export interface SelectionCompiler<T extends SelectionType = SelectionType> {
    signals: (model: UnitModel, selCmpt: SelectionComponent<T>) => NewSignal[];
    topLevelSignals?: (model: Model, selCmpt: SelectionComponent<T>, signals: NewSignal[]) => NewSignal[];
    modifyExpr: (model: UnitModel, selCmpt: SelectionComponent<T>) => string;
    marks?: (model: UnitModel, selCmpt: SelectionComponent<T>, marks: any[]) => any[];
}
export declare function forEachSelection(model: Model, cb: (selCmpt: SelectionComponent, selCompiler: SelectionCompiler) => void): void;
export declare function unitName(model: Model): string;
export declare function requiresSelectionId(model: Model): boolean;
export declare function isRawSelectionDomain(domainRaw: SignalRef): boolean;
//# sourceMappingURL=index.d.ts.map