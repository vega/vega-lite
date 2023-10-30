import { Binding, Signal, Stream } from 'vega';
import { BrushConfig, LegendBinding, SelectionInit, SelectionInitInterval, SelectionResolution, SelectionType } from '../../selection';
import { Dict } from '../../util';
import { OutputNode } from '../data/dataflow';
import { Model } from '../model';
import { UnitModel } from '../unit';
import { SelectionProjection, SelectionProjectionComponent } from './project';
import { SelectionParameter } from '../../selection';
import { ParameterName } from '../../parameter';
export declare const STORE = "_store";
export declare const TUPLE = "_tuple";
export declare const MODIFY = "_modify";
export declare const SELECTION_DOMAIN = "_selection_domain_";
export declare const VL_SELECTION_RESOLVE = "vlSelectionResolve";
export interface SelectionComponent<T extends SelectionType = SelectionType> {
    name: ParameterName;
    type: T;
    init?: (T extends 'interval' ? SelectionInitInterval : T extends 'point' ? SelectionInit : never)[][];
    events: Stream[];
    materialized: OutputNode;
    bind?: 'scales' | Binding | Dict<Binding> | LegendBinding;
    resolve: SelectionResolution;
    mark?: BrushConfig;
    project: SelectionProjectionComponent;
    scales?: SelectionProjection[];
    toggle?: string;
    translate?: any;
    zoom?: any;
    nearest?: any;
    clear?: any;
}
export interface SelectionCompiler<T extends SelectionType = SelectionType> {
    defined: (selCmpt: SelectionComponent) => boolean;
    parse?: (model: UnitModel, selCmpt: SelectionComponent<T>, def: SelectionParameter<T>) => void;
    signals?: (model: UnitModel, selCmpt: SelectionComponent<T>, signals: Signal[]) => Signal[];
    topLevelSignals?: (model: Model, selCmpt: SelectionComponent<T>, signals: Signal[]) => Signal[];
    modifyExpr?: (model: UnitModel, selCmpt: SelectionComponent<T>, expr: string) => string;
    marks?: (model: UnitModel, selCmpt: SelectionComponent<T>, marks: any[]) => any[];
}
export declare const selectionCompilers: SelectionCompiler[];
export declare function unitName(model: Model, { escape }?: {
    escape: boolean;
}): string;
export declare function requiresSelectionId(model: Model): boolean;
export declare function disableDirectManipulation(selCmpt: SelectionComponent, selDef: SelectionParameter<'point'>): void;
//# sourceMappingURL=index.d.ts.map