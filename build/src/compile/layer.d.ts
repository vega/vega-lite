import { Channel } from '../channel';
import { CellConfig, Config } from '../config';
import { FieldDef } from '../fielddef';
import { Legend } from '../legend';
import { Scale } from '../scale';
import { Axis } from '../axis';
import { LayerSpec } from '../spec';
import { StackProperties } from '../stack';
import { Dict } from '../util';
import { VgData, VgEncodeEntry, VgScale } from '../vega.schema';
import { Model } from './model';
import { UnitModel } from './unit';
export declare class LayerModel extends Model {
    readonly children: UnitModel[];
    protected readonly scales: Dict<Scale>;
    protected readonly axes: Dict<Axis>;
    protected readonly legends: Dict<Legend>;
    readonly config: Config;
    readonly stack: StackProperties;
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
    constructor(spec: LayerSpec, parent: Model, parentGivenName: string);
    private initConfig(specConfig, parent);
    channelHasField(channel: Channel): boolean;
    hasDiscreteScale(channel: Channel): boolean;
    dataTable(): string;
    fieldDef(channel: Channel): FieldDef;
    parseData(): void;
    parseSelection(): void;
    parseLayoutData(): void;
    parseScale(this: LayerModel): void;
    parseMark(): void;
    parseAxis(): void;
    parseAxisGroup(): void;
    parseGridGroup(): void;
    parseLegend(): void;
    assembleParentGroupProperties(cellConfig: CellConfig): VgEncodeEntry;
    assembleSignals(signals: any[]): any[];
    assembleSelectionData(data: VgData[]): VgData[];
    assembleScales(): VgScale[];
    assembleData(data: VgData[]): VgData[];
    assembleLayout(layoutData: VgData[]): VgData[];
    assembleMarks(): any[];
    channels(): Channel[];
    protected getMapping(): any;
    isLayer(): boolean;
    /**
     * Returns true if the child either has no source defined or uses the same url.
     * This is useful if you want to know whether it is possible to move a filter up.
     *
     * This function can only be called once th child has been parsed.
     */
    compatibleSource(child: UnitModel): boolean;
}
