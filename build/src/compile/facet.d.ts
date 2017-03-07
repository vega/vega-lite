import { Axis } from '../axis';
import { Channel } from '../channel';
import { Config } from '../config';
import { Facet } from '../facet';
import { FieldDef } from '../fielddef';
import { Legend } from '../legend';
import { Scale } from '../scale';
import { FacetSpec } from '../spec';
import { Dict } from '../util';
import { VgData, VgEncodeEntry } from '../vega.schema';
import { StackProperties } from '../stack';
import { Model } from './model';
/**
 * Prefix for special data sources for driving column's axis group.
 */
export declare const COLUMN_AXES_DATA_PREFIX = "column-";
/**
 * Prefix for special data sources for driving row's axis group.
 */
export declare const ROW_AXES_DATA_PREFIX = "row-";
export declare class FacetModel extends Model {
    readonly facet: Facet;
    readonly child: Model;
    readonly children: Model[];
    protected readonly scales: Dict<Scale>;
    protected readonly axes: Dict<Axis>;
    protected readonly legends: Dict<Legend>;
    readonly config: Config;
    readonly stack: StackProperties;
    private readonly _spacing;
    constructor(spec: FacetSpec, parent: Model, parentGivenName: string);
    private initConfig(specConfig, parent);
    private initFacet(facet);
    private initScalesAndSpacing(facet, config);
    private initAxis(facet, config, child);
    channelHasField(channel: Channel): boolean;
    private hasSummary();
    facetedTable(): string;
    dataTable(): string;
    fieldDef(channel: Channel): FieldDef;
    parseData(): void;
    parseSelection(): void;
    parseLayoutData(): void;
    parseScale(): void;
    parseMark(): void;
    parseAxis(): void;
    parseAxisGroup(): void;
    parseGridGroup(): void;
    parseLegend(): void;
    assembleParentGroupProperties(): any;
    assembleSignals(signals: any): any[];
    assembleSelectionData(data: VgData[]): VgData[];
    assembleData(data: VgData[]): VgData[];
    assembleLayout(layoutData: VgData[]): VgData[];
    assembleMarks(): any[];
    channels(): ("row" | "column")[];
    protected getMapping(): Facet;
    spacing(channel: Channel): any;
    isFacet(): boolean;
}
export declare function hasSubPlotWithXy(model: FacetModel): boolean;
export declare function spacing(scale: Scale, model: FacetModel, config: Config): number;
/**
 * Add data for driving row/column axes when there are both row and column
 * Note that we don't have to deal with these in the parse step at all
 * because these items never get merged with any other items.
 */
export declare function assembleAxesGroupData(model: FacetModel, data: VgData[]): VgData[];
export declare function getSharedAxisGroup(model: FacetModel, channel: 'x' | 'y'): VgEncodeEntry;
