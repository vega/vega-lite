import { Config } from '../config';
import { LayerSpec } from '../spec';
import { VgData, VgEncodeEntry, VgLayout, VgScale, VgSignal } from '../vega.schema';
import { Model } from './model';
import { RepeaterValue } from './repeat';
import { UnitModel } from './unit';
export declare class LayerModel extends Model {
    readonly children: UnitModel[];
    /**
     * Fixed width for the unit visualization.
     * If undefined (e.g., for ordinal scale), the width of the
     * visualization will be calculated dynamically.
     */
    readonly width: number;
    /**
     * Fixed height for the unit visualization.
     * If undefined (e.g., for ordinal scale), the height of the
     * visualization will be calculated dynamically.
     */
    readonly height: number;
    constructor(spec: LayerSpec, parent: Model, parentGivenName: string, repeater: RepeaterValue, config: Config);
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
