import { Channel } from '../channel';
import { CellConfig, Config } from '../config';
import { FieldDef } from '../fielddef';
import { LayerSpec } from '../spec';
import { VgData, VgEncodeEntry, VgScale } from '../vega.schema';
import { Model } from './model';
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
    constructor(spec: LayerSpec, parent: Model, parentGivenName: string, config: Config);
    channelHasField(channel: Channel): boolean;
    hasDiscreteScale(channel: Channel): boolean;
    fieldDef(channel: Channel): FieldDef;
    parseData(): void;
    parseSelection(): void;
    parseLayoutData(): void;
    parseScale(this: LayerModel): void;
    parseMark(): void;
    parseAxis(): void;
    parseAxisGroup(): void;
    parseLegend(): void;
    assembleParentGroupProperties(cellConfig: CellConfig): VgEncodeEntry;
    assembleSignals(signals: any[]): any[];
    assembleSelectionData(data: VgData[]): VgData[];
    assembleData(): VgData[];
    assembleScales(): VgScale[];
    assembleLayout(layoutData: VgData[]): VgData[];
    assembleMarks(): any[];
    channels(): Channel[];
    protected getMapping(): any;
    isLayer(): boolean;
}
