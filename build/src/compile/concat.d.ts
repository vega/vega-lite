import { Config } from '../config';
import { ConcatSpec } from '../spec';
import { VgData, VgLayout, VgScale, VgSignal } from '../vega.schema';
import { Model } from './model';
import { RepeaterValue } from './repeat';
export declare class ConcatModel extends Model {
    readonly children: Model[];
    readonly isVConcat: boolean;
    constructor(spec: ConcatSpec, parent: Model, parentGivenName: string, repeater: RepeaterValue, config: Config);
    parseData(): void;
    parseSelection(): void;
    parseScale(): void;
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
