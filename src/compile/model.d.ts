import { Axis } from '../axis';
import { Channel } from '../channel';
import { Config, CellConfig } from '../config';
import { Data, DataSourceType } from '../data';
import { FieldDef, FieldRefOption } from '../fielddef';
import { Legend } from '../legend';
import { OneOfFilter, EqualFilter, RangeFilter } from '../filter';
import { Scale } from '../scale';
import { SortField, SortOrder } from '../sort';
import { StackProperties } from '../stack';
import { BaseSpec, Padding } from '../spec';
import { Transform } from '../transform';
import { Dict } from '../util';
import { VgData, VgEncodeEntry, VgScale, VgAxis, VgLegend } from '../vega.schema';
import { Formula } from '../transform';
import { DataComponent } from './data/data';
import { LayoutComponent } from './layout';
import { ScaleComponents } from './scale/scale';
/**
 * Composable Components that are intermediate results of the parsing phase of the
 * compilations.  These composable components will be assembled in the last
 * compilation step.
 */
export interface Component {
    data: DataComponent;
    layout: LayoutComponent;
    scale: Dict<ScaleComponents>;
    /** Dictionary mapping channel to VgAxis definition */
    axis: Dict<VgAxis[]>;
    /** Dictionary mapping channel to VgLegend definition */
    legend: Dict<VgLegend>;
    /** Dictionary mapping channel to axis mark group for facet and concat */
    axisGroup: Dict<VgEncodeEntry>;
    /** Dictionary mapping channel to grid mark group for facet (and concat?) */
    gridGroup: Dict<VgEncodeEntry[]>;
    mark: VgEncodeEntry[];
}
export interface NameMapInterface {
    rename(oldname: string, newName: string): void;
    has(name: string): boolean;
    get(name: string): string;
}
export declare abstract class Model {
    protected readonly _parent: Model;
    protected readonly _name: string;
    protected readonly _description: string;
    protected readonly _padding: Padding;
    protected readonly _data: Data;
    /** Name map for data sources, which can be renamed by a model's parent. */
    protected _dataNameMap: NameMapInterface;
    /** Name map for scales, which can be renamed by a model's parent. */
    protected _scaleNameMap: NameMapInterface;
    /** Name map for size, which can be renamed by a model's parent. */
    protected _sizeNameMap: NameMapInterface;
    protected readonly _transform: Transform;
    protected _scale: Dict<Scale>;
    protected _axis: Dict<Axis>;
    protected _legend: Dict<Legend>;
    protected _config: Config;
    component: Component;
    constructor(spec: BaseSpec, parent: Model, parentGivenName: string);
    parse(): void;
    abstract parseData(): void;
    abstract parseSelectionData(): void;
    abstract parseLayoutData(): void;
    abstract parseScale(): void;
    abstract parseMark(): void;
    abstract parseAxis(): void;
    abstract parseLegend(): void;
    abstract parseAxisGroup(): void;
    abstract parseGridGroup(): void;
    abstract assembleData(data: VgData[]): VgData[];
    abstract assembleLayout(layoutData: VgData[]): VgData[];
    assembleScales(): VgScale[];
    abstract assembleMarks(): any[];
    assembleAxes(): VgAxis[];
    assembleLegends(): any[];
    assembleGroup(): any;
    abstract assembleParentGroupProperties(cellConfig: CellConfig): VgEncodeEntry;
    abstract channels(): Channel[];
    protected abstract mapping(): any;
    reduce<T>(f: (acc: any, fd: FieldDef, c: Channel) => any, init: T, t?: any): any;
    forEach(f: (fd: FieldDef, c: Channel) => void, t?: any): void;
    hasDescendantWithFieldOnChannel(channel: Channel): boolean;
    abstract channelHasField(channel: Channel): boolean;
    parent(): Model;
    abstract children(): Model[];
    name(text?: string, delimiter?: string): string;
    description(): string;
    padding(): Padding;
    data(): Data;
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
    scaleName(originalScaleName: Channel | string, parse?: boolean): string;
    sort(channel: Channel): SortField | SortOrder;
    abstract stack(): StackProperties;
    axis(channel: Channel): Axis;
    legend(channel: Channel): Legend;
    /**
     * Get the spec configuration.
     */
    config(): Config;
    /**
     * Type checks
     */
    isUnit(): boolean;
    isFacet(): boolean;
    isLayer(): boolean;
}
