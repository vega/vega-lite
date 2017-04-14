import { Axis } from '../axis';
import { Channel } from '../channel';
import { CellConfig, Config } from '../config';
import { Encoding } from '../encoding';
import { FieldDef, FieldRefOption } from '../fielddef';
import { Legend } from '../legend';
import { Mark, MarkDef } from '../mark';
import { Scale } from '../scale';
import { SelectionDef } from '../selection';
import { UnitSpec } from '../spec';
import { StackProperties } from '../stack';
import { Dict } from '../util';
import { VgData } from '../vega.schema';
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
    readonly markDef: MarkDef;
    readonly encoding: Encoding;
    protected readonly selection: Dict<SelectionDef>;
    protected readonly scales: Dict<Scale>;
    protected readonly axes: Dict<Axis>;
    protected readonly legends: Dict<Legend>;
    readonly config: Config;
    readonly stack: StackProperties;
    children: Model[];
    constructor(spec: UnitSpec, parent: Model, parentGivenName: string, cfg: Config);
    private initFacetCellConfig();
    private initScales(mark, encoding, topLevelWidth, topLevelHeight);
    private initSize(mark, scale, width, height);
    private initAxes(encoding);
    private initLegend(encoding);
    parseData(): void;
    parseSelection(): void;
    parseLayoutData(): void;
    parseScale(): void;
    parseMark(): void;
    parseAxis(): void;
    parseAxisGroup(): void;
    parseGridGroup(): void;
    parseLegend(): void;
    assembleData(): VgData[];
    assembleSignals(signals: any[]): any[];
    assembleSelectionData(data: VgData[]): VgData[];
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
    isUnit(): boolean;
}
