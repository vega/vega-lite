import { Axis } from '../axis';
import { Channel } from '../channel';
import { CellConfig, Config } from '../config';
import { Data, DataSourceType } from '../data';
import { FieldDef, FieldRefOption } from '../fielddef';
import { Legend } from '../legend';
import { Scale } from '../scale';
import { SortField, SortOrder } from '../sort';
import { BaseSpec } from '../spec';
import { StackProperties } from '../stack';
import { Transform } from '../transform';
import { Dict } from '../util';
import { VgAxis, VgData, VgEncodeEntry, VgLegend, VgScale } from '../vega.schema';
import { DataComponent } from './data/index';
import { LayoutComponent } from './layout';
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
export interface NameMapInterface {
    rename(oldname: string, newName: string): void;
    has(name: string): boolean;
    get(name: string): string;
}
export declare class NameMap implements NameMapInterface {
    private nameMap;
    constructor();
    rename(oldName: string, newName: string): void;
    has(name: string): boolean;
    get(name: string): string;
}
export declare abstract class Model {
    readonly parent: Model;
    protected readonly name: string;
    readonly description: string;
    readonly data: Data;
    readonly transforms: Transform[];
    /** Name map for scales, which can be renamed by a model's parent. */
    protected scaleNameMap: NameMapInterface;
    /** Name map for size, which can be renamed by a model's parent. */
    protected sizeNameMap: NameMapInterface;
    protected readonly transform: Transform;
    protected readonly scales: Dict<Scale>;
    protected readonly axes: Dict<Axis>;
    protected readonly legends: Dict<Legend>;
    readonly config: Config;
    component: Component;
    readonly abstract children: Model[];
    abstract stack: StackProperties;
    constructor(spec: BaseSpec, parent: Model, parentGivenName: string, config: Config);
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
    abstract assembleData(): VgData[];
    abstract assembleLayout(layoutData: VgData[]): VgData[];
    assembleScales(): VgScale[];
    abstract assembleMarks(): any[];
    assembleAxes(): VgAxis[];
    assembleLegends(): VgLegend[];
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
    /**
     * Return the data source name for the given data source type. You probably want to call this in parse.
     */
    getDataName(name: DataSourceType): string;
    /**
     * Lookup the name of the datasource for an output node. You probably want to call this in assemble.
     */
    lookupDataSource(name: string): string;
    renameSize(oldName: string, newName: string): void;
    channelSizeName(channel: Channel): string;
    sizeName(size: string): string;
    /** Get "field" reference for vega */
    field(channel: Channel, opt?: FieldRefOption): string;
    abstract fieldDef(channel: Channel): FieldDef;
    scale(channel: Channel): Scale;
    hasDiscreteScale(channel: Channel): boolean;
    renameScale(oldName: string, newName: string): void;
    /**
     * @return scale name for a given channel after the scale has been parsed and named.
     */
    scaleName(this: Model, originalScaleName: Channel | string, parse?: boolean): string;
    sort(channel: Channel): SortField | SortOrder;
    axis(channel: Channel): Axis;
    legend(channel: Channel): Legend;
    /**
     * Corrects the data references in marks after assemble.
     */
    correctDataNames: (mark: any) => any;
    /**
     * Type checks
     */
    isUnit(): boolean;
    isFacet(): boolean;
    isLayer(): boolean;
}
