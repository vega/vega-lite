import { Channel } from '../channel';
import { CellConfig } from '../config';
import { Encoding } from '../encoding';
import { FieldDef, FieldRefOption } from '../fielddef';
import { Mark } from '../mark';
import { UnitSpec } from '../spec';
import { VgData } from '../vega.schema';
import { Model } from './model';
import { StackProperties } from '../stack';
/**
 * Internal model of Vega-Lite specification for the compiler.
 */
export declare class UnitModel extends Model {
    /**
     * Fixed width for the unit visualization.
     * If undefined (e.g., for ordinal scale), the width of the
     * visualization will be calculated dynamically.
     */
    private _width;
    /**
     * Fixed height for the unit visualization.
     * If undefined (e.g., for ordinal scale), the height of the
     * visualization will be calculated dynamically.
     */
    private _height;
    private readonly _mark;
    private readonly _encoding;
    private readonly _stack;
    constructor(spec: UnitSpec, parent: Model, parentGivenName: string);
    private _initEncoding(mark, encoding);
    /**
     * Init config by merging config from parent and, if applicable, from facet config
     */
    private _initConfig(specConfig, parent);
    private _initScale(mark, encoding, config, topLevelWidth, topLevelHeight);
    private _initSize(mark, scale, width, height, cellConfig, scaleConfig);
    private _initAxis(encoding, config);
    private _initLegend(encoding, config);
    children(): Model[];
    readonly width: number;
    readonly height: number;
    parseData(): void;
    parseSelectionData(): void;
    parseLayoutData(): void;
    parseScale(): void;
    parseMark(): void;
    parseAxis(): void;
    parseAxisGroup(): void;
    parseGridGroup(): void;
    parseLegend(): void;
    assembleData(data: VgData[]): VgData[];
    assembleLayout(layoutData: VgData[]): VgData[];
    assembleMarks(): any[];
    assembleParentGroupProperties(cellConfig: CellConfig): any;
    channels(): ("text" | "x" | "y" | "x2" | "y2" | "color" | "opacity" | "size" | "shape" | "detail" | "anchor" | "offset" | "order")[];
    protected mapping(): Encoding;
    stack(): StackProperties;
    toSpec(excludeConfig?: any, excludeData?: any): any;
    mark(): Mark;
    channelHasField(channel: Channel): boolean;
    encoding(): Encoding;
    fieldDef(channel: Channel): FieldDef;
    /** Get "field" reference for vega */
    field(channel: Channel, opt?: FieldRefOption): string;
    dataTable(): string;
    isUnit(): boolean;
}
