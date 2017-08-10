import { Config } from '../config';
import { LayerSpec, LayoutSizeMixins } from '../spec';
import { VgData, VgLayout, VgScale, VgSignal, VgTitle } from '../vega.schema';
import { Model } from './model';
import { RepeaterValue } from './repeater';
export declare class LayerModel extends Model {
    readonly type: 'layer';
    readonly children: Model[];
    constructor(spec: LayerSpec, parent: Model, parentGivenName: string, parentGivenSize: LayoutSizeMixins, repeater: RepeaterValue, config: Config);
    parseData(): void;
    parseLayoutSize(): void;
    parseSelection(): void;
    parseMarkGroup(): void;
    parseAxisAndHeader(): void;
    assembleSelectionTopLevelSignals(signals: any[]): VgSignal[];
    assembleSelectionSignals(): VgSignal[];
    assembleLayoutSignals(): VgSignal[];
    assembleSelectionData(data: VgData[]): VgData[];
    assembleTitle(): VgTitle;
    assembleScales(): VgScale[];
    assembleLayout(): VgLayout;
    assembleMarks(): any[];
}
