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
    parseLayoutSize(): void;
    parseSelection(): void;
    parseMarkGroup(): void;
    parseAxisAndHeader(): void;
    parseAxisGroup(): void;
    parseLegend(): void;
    assembleData(): VgData[];
    assembleParentGroupProperties(): any;
    assembleScales(): VgScale[];
    assembleSelectionTopLevelSignals(signals: any[]): VgSignal[];
    assembleSelectionSignals(): VgSignal[];
    assembleLayoutSignals(): VgSignal[];
    assembleSelectionData(data: VgData[]): VgData[];
    assembleLayout(): VgLayout;
    assembleMarks(): any[];
}
