import { Config } from '../config';
import { Encoding } from '../encoding';
import { Facet } from '../facet';
import { Field } from '../fielddef';
import { Repeat } from '../repeat';
import { RepeatSpec } from '../spec';
import { VgData, VgLayout, VgScale, VgSignal } from '../vega.schema';
import { Model } from './model';
export declare type RepeaterValue = {
    row?: string;
    column?: string;
};
export declare function replaceRepeaterInFacet(facet: Facet<Field>, repeater: RepeaterValue): Facet<string>;
export declare function replaceRepeaterInEncoding(encoding: Encoding<Field>, repeater: RepeaterValue): Encoding<string>;
export declare class RepeatModel extends Model {
    readonly repeat: Repeat;
    readonly children: Model[];
    constructor(spec: RepeatSpec, parent: Model, parentGivenName: string, repeatValues: RepeaterValue, config: Config);
    private _initChildren(spec, repeat, repeater, config);
    parseData(): void;
    parseSelection(): void;
    parseScale(this: RepeatModel): void;
    parseMark(): void;
    parseAxisAndHeader(): void;
    parseAxisGroup(): void;
    parseLegend(): void;
    assembleData(): VgData[];
    assembleParentGroupProperties(): any;
    assembleSelectionTopLevelSignals(signals: any[]): VgSignal[];
    assembleSelectionSignals(): VgSignal[];
    assembleLayoutSignals(): VgSignal[];
    assembleSelectionData(data: VgData[]): VgData[];
    assembleScales(): VgScale[];
    assembleLayout(): VgLayout;
    assembleMarks(): any[];
}
