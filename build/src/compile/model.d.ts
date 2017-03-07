import { Axis } from '../axis';
import { Channel } from '../channel';
import { Config, CellConfig } from '../config';
import { Data, DataSourceType } from '../data';
import { FieldDef, FieldRefOption } from '../fielddef';
import { Legend } from '../legend';
import { Scale } from '../scale';
import { SortField, SortOrder } from '../sort';
import { BaseSpec, Padding } from '../spec';
import { Transform } from '../transform';
import { Dict } from '../util';
import { VgData, VgEncodeEntry, VgScale, VgAxis, VgLegend } from '../vega.schema';
import { Formula } from '../transform';
import { OneOfFilter, EqualFilter, RangeFilter } from '../filter';
import { DataComponent } from './data/data';
import { LayoutComponent } from './layout';
import { StackProperties } from '../stack';
import { SelectionComponent } from './selection/selection';
/**
 * Composable Components that are intermediate results of the parsing phase of the
 * compilations.  These composable components will be assembled in the last
 * compilation step.
 */
export interface Component {
    data: DataComponent;
    layout: LayoutComponent;
    scales: Dict<VgScale>;
    selection: Dict<SelectionComponent>;
    /** Dictionary mapping channel to VgAxis definition */
    axes: Dict<VgAxis[]>;
    /** Dictionary mapping channel to VgLegend definition */
    legends: Dict<VgLegend>;
    /** Dictionary mapping channel to axis mark group for facet and concat */
    axisGroups: Dict<VgEncodeEntry>;
    /** Dictionary mapping channel to grid mark group for facet (and concat?) */
    gridGroups: Dict<VgEncodeEntry[]>;
    mark: VgEncodeEntry[];
}
export declare class NameMap implements NameMapInterface {
    private nameMap;
    constructor();
    rename(oldName: string, newName: string): void;
    has(name: string): boolean;
    get(name: string): string;
}
export interface NameMapInterface {
    rename(oldname: string, newName: string): void;
    has(name: string): boolean;
    get(name: string): string;
}
export declare abstract class Model {
    readonly parent: Model;
    protected readonly name: string;
    readonly description: string;
    readonly padding: Padding;
    readonly data: Data;
    /** Name map for data sources, which can be renamed by a model's parent. */
    protected dataNameMap: NameMapInterface;
    /** Name map for scales, which can be renamed by a model's parent. */
    protected scaleNameMap: NameMapInterface;
    /** Name map for size, which can be renamed by a model's parent. */
    protected sizeNameMap: NameMapInterface;
    protected readonly transform: Transform;
    protected readonly abstract scales: Dict<Scale>;
    protected readonly abstract axes: Dict<Axis>;
    protected readonly abstract legends: Dict<Legend>;
    readonly abstract config: Config;
    component: Component;
    readonly abstract children: Model[];
    abstract stack: StackProperties;
    constructor(spec: BaseSpec, parent: Model, parentGivenName: string);
    parse(): void;
    abstract parseData(): void;
    abstract parseSelection(): void;
    abstract parseLayoutData(): void;
    abstract parseScale(): void;
    abstract parseMark(): void;
    abstract parseAxis(): void;
    abstract parseLegend(): void;
    abstract parseAxisGroup(): void;
    abstract parseGridGroup(): void;
    abstract assembleSignals(signals: any[]): any[];
    abstract assembleSelectionData(data: VgData[]): VgData[];
    abstract assembleData(data: VgData[]): VgData[];
    abstract assembleLayout(layoutData: VgData[]): VgData[];
    assembleScales(): VgScale[];
    abstract assembleMarks(): any[];
    assembleAxes(): VgAxis[];
    assembleLegends(): any[];
    assembleGroup(): any;
    abstract assembleParentGroupProperties(cellConfig: CellConfig): VgEncodeEntry;
    abstract channels(): Channel[];
    protected abstract getMapping(): {
        [key: string]: any;
    };
    reduceFieldDef<T, U>(f: (acc: U, fd: FieldDef, c: Channel) => U, init: T, t?: any): any;
    forEachFieldDef(f: (fd: FieldDef, c: Channel) => void, t?: any): void;
    hasDescendantWithFieldOnChannel(channel: Channel): boolean;
    abstract channelHasField(channel: Channel): boolean;
    getName(text: string, delimiter?: string): string;
    renameData(oldName: string, newName: string): void;
    /**
     * Return the data source name for the given data source type.
     *
     * For unit spec, this is always simply the spec.name + '-' + dataSourceType.
     * We already use the name map so that marks and scales use the correct data.
     */
    dataName(dataSourceType: DataSourceType): string;
    renameSize(oldName: string, newName: string): void;
    channelSizeName(channel: Channel): string;
    sizeName(size: string): string;
    abstract dataTable(): string;
    calculate(): Formula[];
    filterInvalid(): boolean;
    filter(): string | OneOfFilter | EqualFilter | RangeFilter | (string | OneOfFilter | EqualFilter | RangeFilter)[];
    /** Get "field" reference for vega */
    field(channel: Channel, opt?: FieldRefOption): string;
    abstract fieldDef(channel: Channel): FieldDef;
    scale(channel: Channel): Scale;
    hasDiscreteScale(channel: Channel): boolean;
    renameScale(oldName: string, newName: string): void;
    /**
     * @return scale name for a given channel after the scale has been parsed and named.
     * (DO NOT USE THIS METHOD DURING SCALE PARSING, use model.name() instead)
     */
    scaleName(this: Model, originalScaleName: Channel | string, parse?: boolean): string;
    sort(channel: Channel): SortField | SortOrder;
    axis(channel: Channel): Axis;
    legend(channel: Channel): Legend;
    /**
     * Type checks
     */
    isUnit(): boolean;
    isFacet(): boolean;
    isLayer(): boolean;
}
