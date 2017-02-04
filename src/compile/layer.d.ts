import { Channel } from '../channel';
import { CellConfig } from '../config';
import { FieldDef } from '../fielddef';
import { LayerSpec } from '../spec';
import { StackProperties } from '../stack';
import { VgData, VgEncodeEntry } from '../vega.schema';
import { Model } from './model';
import { UnitModel } from './unit';
export declare class LayerModel extends Model {
    private _children;
    /**
     * Fixed width for the unit visualization.
     * If undefined (e.g., for ordinal scale), the width of the
     * visualization will be calculated dynamically.
     */
    private readonly _width;
    /**
     * Fixed height for the unit visualization.
     * If undefined (e.g., for ordinal scale), the height of the
     * visualization will be calculated dynamically.
     */
    private readonly _height;
    constructor(spec: LayerSpec, parent: Model, parentGivenName: string);
    private _initConfig(specConfig, parent);
    readonly width: number;
    readonly height: number;
    channelHasField(_: Channel): boolean;
    children(): UnitModel[];
    hasDiscreteScale(channel: Channel): boolean;
    dataTable(): string;
    fieldDef(_: Channel): FieldDef;
    stack(): StackProperties;
    parseData(): void;
    parseSelectionData(): void;
    parseLayoutData(): void;
    parseScale(this: LayerModel): void;
    parseMark(): void;
    parseAxis(): void;
    parseAxisGroup(): void;
    parseGridGroup(): void;
    parseLegend(): void;
    assembleParentGroupProperties(cellConfig: CellConfig): VgEncodeEntry;
    assembleData(data: VgData[]): VgData[];
    assembleLayout(layoutData: VgData[]): VgData[];
    assembleMarks(): any[];
    channels(): Channel[];
    protected mapping(): any;
    isLayer(): boolean;
    /**
     * Returns true if the child either has no source defined or uses the same url.
     * This is useful if you want to know whether it is possible to move a filter up.
     *
     * This function can only be called once th child has been parsed.
     */
    compatibleSource(child: UnitModel): boolean;
}
