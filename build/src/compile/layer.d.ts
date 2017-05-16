import { Config } from '../config';
import { LayerSpec, UnitSize } from '../spec';
import { VgData, VgEncodeEntry, VgLayout, VgScale, VgSignal } from '../vega.schema';
import { Model } from './model';
import { RepeaterValue } from './repeat';
import { UnitModel } from './unit';
export declare class LayerModel extends Model {
    readonly children: UnitModel[];
    private readonly resolve;
    constructor(spec: LayerSpec, parent: Model, parentGivenName: string, parentUnitSize: UnitSize, repeater: RepeaterValue, config: Config);
    parseData(): void;
    parseSelection(): void;
    parseScale(this: LayerModel): void;
    parseMark(): void;
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
