import { Axis } from '../axis';
import { Channel } from '../channel';
import { CellConfig, Config } from '../config';
import { Encoding } from '../encoding';
import { FieldDef, FieldRefOption } from '../fielddef';
import { Legend } from '../legend';
import { Mark, MarkDef } from '../mark';
import { Scale } from '../scale';
import { UnitSpec } from '../spec';
import { Dict } from '../util';
import { VgData } from '../vega.schema';
import { SelectionDef } from '../selection';
import { StackProperties } from '../stack';
import { Model } from './model';
/**
 * Internal model of Vega-Lite specification for the compiler.
 */
export declare class UnitModel extends Model {
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
    readonly markDef: MarkDef & {
        filled: boolean;
    };
    readonly encoding: Encoding;
    protected readonly selection: Dict<SelectionDef>;
    protected readonly scales: Dict<Scale>;
    protected readonly axes: Dict<Axis>;
    protected readonly legends: Dict<Legend>;
    readonly config: Config;
    readonly stack: StackProperties;
    children: Model[];
    constructor(spec: UnitSpec, parent: Model, parentGivenName: string);
    /**
     * Init config by merging config from parent and, if applicable, from facet config
     */
    private initConfig(specConfig, parent);
    private initScales(mark, encoding, config, topLevelWidth, topLevelHeight);
    private initSize(mark, scale, width, height, cellConfig, scaleConfig);
    private initAxes(encoding, config);
    private initLegend(encoding, config);
    parseData(): void;
    parseSelection(): void;
    parseLayoutData(): void;
    parseScale(): void;
    parseMark(): void;
    parseAxis(): void;
    parseAxisGroup(): void;
    parseGridGroup(): void;
    parseLegend(): void;
    assembleSignals(signals: any[]): any[];
    assembleSelectionData(data: VgData[]): VgData[];
    assembleData(data: VgData[]): VgData[];
    assembleLayout(layoutData: VgData[]): VgData[];
    assembleMarks(): any[];
    assembleParentGroupProperties(cellConfig: CellConfig): any;
    channels(): ("text" | "x" | "y" | "x2" | "y2" | "color" | "opacity" | "size" | "shape" | "detail" | "order")[];
    protected getMapping(): Encoding;
    toSpec(excludeConfig?: any, excludeData?: any): any;
    mark(): Mark;
    channelHasField(channel: Channel): boolean;
    fieldDef(channel: Channel): FieldDef;
    /** Get "field" reference for vega */
    field(channel: Channel, opt?: FieldRefOption): string;
    dataTable(): string;
    isUnit(): boolean;
}
