import { Config } from '../config';
import { LayerSpec, LayoutSize } from '../spec';
import { VgData, VgEncodeEntry, VgLayout, VgScale, VgSignal } from '../vega.schema';
import { Model } from './model';
import { RepeaterValue } from './repeat';
export declare class LayerModel extends Model {
    readonly children: Model[];
    constructor(spec: LayerSpec, parent: Model, parentGivenName: string, parentGivenSize: LayoutSize, repeater: RepeaterValue, config: Config);
    parseData(): void;
    parseSelection(): void;
    parseMarkGroup(): void;
    parseAxisAndHeader(): void;
    parseLegend(): void;
    assembleParentGroupProperties(): VgEncodeEntry;
    assembleSelectionTopLevelSignals(signals: any[]): VgSignal[];
    assembleSelectionSignals(): VgSignal[];
    assembleLayoutSignals(): VgSignal[];
    assembleSelectionData(data: VgData[]): VgData[];
    assembleData(): VgData[];
    assembleScales(): VgScale[];
    assembleLayout(): VgLayout;
    assembleMarks(): any[];
}
