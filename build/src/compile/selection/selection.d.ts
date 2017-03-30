import { Channel } from '../../channel';
import { SelectionDef, SelectionDomain, SelectionResolutions, SelectionTypes } from '../../selection';
import { Dict } from '../../util';
import { VgBinding, VgData } from '../../vega.schema';
import { Model } from '../model';
import { UnitModel } from '../unit';
import { SelectionComponent } from './selection';
export declare const STORE = "_store", TUPLE = "_tuple", MODIFY = "_modify";
export interface SelectionComponent {
    name: string;
    type: SelectionTypes;
    domain: SelectionDomain;
    events: any;
    bind?: 'scales' | VgBinding | {
        [key: string]: VgBinding;
    };
    resolve: SelectionResolutions;
    project?: ProjectComponent[];
    scales?: Channel[];
    toggle?: any;
    translate?: any;
    zoom?: any;
    nearest?: any;
}
export interface ProjectComponent {
    field?: string;
    encoding?: Channel;
}
export interface SelectionCompiler {
    signals: (model: UnitModel, selCmpt: SelectionComponent) => any[];
    topLevelSignals?: (model: Model, selCmpt: SelectionComponent) => any[];
    tupleExpr: (model: UnitModel, selCmpt: SelectionComponent) => string;
    modifyExpr: (model: UnitModel, selCmpt: SelectionComponent) => string;
    marks?: (model: UnitModel, selCmpt: SelectionComponent, marks: any[]) => any[];
    predicate: string;
}
export declare function parseUnitSelection(model: UnitModel, selDefs: Dict<SelectionDef>): Dict<SelectionComponent>;
export declare function assembleUnitSignals(model: UnitModel, signals: any[]): any[];
export declare function assembleTopLevelSignals(model: Model): any[];
export declare function assembleUnitData(model: UnitModel, data: VgData[]): VgData[];
export declare function assembleUnitMarks(model: UnitModel, marks: any[]): any[];
export declare function predicate(selCmpt: SelectionComponent, datum?: string): string;
export declare function invert(model: UnitModel, selCmpt: SelectionComponent, channel: Channel, expr: string): string;
export declare function channelSignalName(selCmpt: SelectionComponent, channel: Channel): string;
