import { Channel, ScaleChannel, SingleDefChannel } from '../channel';
import { Config } from '../config';
import { Data, DataSourceType } from '../data';
import { FieldDef, FieldRefOption } from '../fielddef';
import { ResolveMapping } from '../resolve';
import { BaseSpec } from '../spec';
import { Transform } from '../transform';
import { Dict } from '../util';
import { VgAxis, VgData, VgEncodeEntry, VgLayout, VgLegend, VgMarkGroup, VgScale, VgSignal } from '../vega.schema';
import { AxisComponentIndex } from './axis/component';
import { DataComponent } from './data/index';
import { LayoutSize, LayoutSizeComponent } from './layout/component';
import { LayoutHeaderComponent } from './layout/header';
import { LegendComponentIndex } from './legend/component';
import { ScaleComponent, ScaleComponentIndex } from './scale/component';
import { SelectionComponent } from './selection/selection';
/**
 * Composable Components that are intermediate results of the parsing phase of the
 * compilations.  These composable components will be assembled in the last
 * compilation step.
 */
export interface Component {
    data: DataComponent;
    scales: ScaleComponentIndex;
    selection: Dict<SelectionComponent>;
    /** Dictionary mapping channel to VgAxis definition */
    axes: AxisComponentIndex;
    /** Dictionary mapping channel to VgLegend definition */
    legends: LegendComponentIndex;
    layoutSize: LayoutSizeComponent;
    layoutHeaders: {
        row?: LayoutHeaderComponent;
        column?: LayoutHeaderComponent;
    };
    mark: VgMarkGroup[];
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
    readonly resolve: ResolveMapping;
    readonly parent: Model;
    readonly name: string;
    readonly description: string;
    readonly data: Data;
    readonly transforms: Transform[];
    /** Name map for scales, which can be renamed by a model's parent. */
    protected scaleNameMap: NameMapInterface;
    /** Name map for size, which can be renamed by a model's parent. */
    protected sizeNameMap: NameMapInterface;
    readonly config: Config;
    readonly component: Component;
    readonly abstract children: Model[];
    constructor(spec: BaseSpec, parent: Model, parentGivenName: string, config: Config, resolve: ResolveMapping);
    readonly width: number;
    readonly height: number;
    protected initSize(size: LayoutSize): void;
    parse(): void;
    abstract parseData(): void;
    abstract parseSelection(): void;
    parseScale(): void;
    parseLayoutSize(): void;
    parseMarkDef(): void;
    abstract parseMarkGroup(): void;
    abstract parseAxisAndHeader(): void;
    abstract parseLegend(): void;
    abstract assembleSelectionTopLevelSignals(signals: any[]): any[];
    abstract assembleSelectionSignals(): any[];
    abstract assembleSelectionData(data: VgData[]): VgData[];
    abstract assembleData(): VgData[];
    abstract assembleLayout(): VgLayout;
    abstract assembleLayoutSignals(): VgSignal[];
    assembleScales(): VgScale[];
    assembleHeaderMarks(): VgMarkGroup[];
    abstract assembleMarks(): VgMarkGroup[];
    assembleAxes(): VgAxis[];
    assembleLegends(): VgLegend[];
    assembleGroup(signals?: VgSignal[]): any;
    abstract assembleParentGroupProperties(): VgEncodeEntry;
    hasDescendantWithFieldOnChannel(channel: Channel): boolean;
    getName(text: string): string;
    /**
     * Request a data source name for the given data source type and mark that data source as required. This method should be called in parse, so that all used data source can be correctly instantiated in assembleData().
     */
    requestDataName(name: DataSourceType): string;
    getSizeSignalRef(sizeType: 'width' | 'height'): {
        signal: string;
    };
    /**
     * Lookup the name of the datasource for an output node. You probably want to call this in assemble.
     */
    lookupDataSource(name: string): string;
    renameSize(oldName: string, newName: string): void;
    channelSizeName(channel: Channel): string;
    sizeName(size: string): string;
    renameScale(oldName: string, newName: string): void;
    /**
     * @return scale name for a given channel after the scale has been parsed and named.
     */
    scaleName(this: Model, originalScaleName: Channel | string, parse?: boolean): string;
    /**
     * Corrects the data references in marks after assemble.
     */
    correctDataNames: (mark: any) => any;
    /**
     * Traverse a model's hierarchy to get the scale component for a particular channel.
     */
    getScaleComponent(channel: ScaleChannel): ScaleComponent;
    /**
     * Traverse a model's hierarchy to get a particular selection component.
     */
    getSelectionComponent(varName: string, origName: string): SelectionComponent;
}
/** Abstract class for UnitModel and FacetModel.  Both of which can contain fieldDefs as a part of its own specification. */
export declare abstract class ModelWithField extends Model {
    abstract fieldDef(channel: SingleDefChannel): FieldDef<string>;
    /** Get "field" reference for vega */
    field(channel: SingleDefChannel, opt?: FieldRefOption): string;
    abstract hasDiscreteDomain(channel: Channel): boolean;
    protected abstract getMapping(): {
        [key: string]: any;
    };
    reduceFieldDef<T, U>(f: (acc: U, fd: FieldDef<string>, c: Channel) => U, init: T, t?: any): any;
    forEachFieldDef(f: (fd: FieldDef<string>, c: Channel) => void, t?: any): void;
    abstract channelHasField(channel: Channel): boolean;
}
