import { Axis } from '../axis';
import { Channel } from '../channel';
import { Config } from '../config';
import { Encoding } from '../encoding';
import { FieldDef, FieldRefOption } from '../fielddef';
import { Legend } from '../legend';
import { Mark, MarkDef } from '../mark';
import { Scale } from '../scale';
import { SelectionDef } from '../selection';
import { SortField, SortOrder } from '../sort';
import { UnitSize, UnitSpec } from '../spec';
import { StackProperties } from '../stack';
import { Dict } from '../util';
import { VgData, VgLayout, VgSignal } from '../vega.schema';
import { Model, ModelWithField } from './model';
import { RepeaterValue } from './repeat';
/**
 * Internal model of Vega-Lite specification for the compiler.
 */
export declare class UnitModel extends ModelWithField {
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
    readonly encoding: Encoding<string>;
    protected scales: Dict<Scale>;
    readonly stack: StackProperties;
    protected axes: Dict<Axis>;
    protected legends: Dict<Legend>;
    readonly selection: Dict<SelectionDef>;
    children: Model[];
    constructor(spec: UnitSpec, parent: Model, parentGivenName: string, parentUnitSize: UnitSize, repeater: RepeaterValue, config: Config);
    scale(channel: Channel): Scale;
    hasDiscreteDomain(channel: Channel): boolean;
    sort(channel: Channel): SortField | SortOrder;
    axis(channel: Channel): Axis;
    legend(channel: Channel): Legend;
    private initFacetCellConfig();
    private initScales(mark, encoding, topLevelWidth, topLevelHeight);
    private initSize(mark, scale, width, height);
    private initAxes(encoding);
    private initLegend(encoding);
    parseData(): void;
    parseSelection(): void;
    parseScale(): void;
    parseMark(): void;
    parseAxisAndHeader(): void;
    parseLegend(): void;
    assembleData(): VgData[];
    assembleSelectionTopLevelSignals(signals: any[]): VgSignal[];
    assembleSelectionSignals(): VgSignal[];
    assembleSelectionData(data: VgData[]): VgData[];
    assembleLayout(): VgLayout;
    assembleLayoutSignals(): VgSignal[];
    assembleMarks(): any[];
    assembleParentGroupProperties(): any;
    channels(): ("text" | "x" | "y" | "x2" | "y2" | "color" | "opacity" | "size" | "shape" | "detail" | "tooltip" | "order")[];
    protected getMapping(): Encoding<string>;
    toSpec(excludeConfig?: any, excludeData?: any): any;
    mark(): Mark;
    channelHasField(channel: Channel): boolean;
    fieldDef(channel: Channel): FieldDef<string>;
    /** Get "field" reference for vega */
    field(channel: Channel, opt?: FieldRefOption): string;
}
