import { Channel } from '../channel';
import { Config } from '../config';
import { FacetFieldDef, FacetMapping } from '../facet';
import { FieldDef, FieldRefOption } from '../fielddef';
import { EncodingSortField } from '../sort';
import { NormalizedFacetSpec } from '../spec';
import { VgData, VgLayout, VgMarkGroup, VgSignal } from '../vega.schema';
import { Model, ModelWithField } from './model';
import { RepeaterValue } from './repeater';
export declare function facetSortFieldName(fieldDef: FacetFieldDef<string>, sort: EncodingSortField<string>, opt?: FieldRefOption): string;
export declare class FacetModel extends ModelWithField {
    readonly type: 'facet';
    readonly facet: FacetMapping<string>;
    readonly child: Model;
    readonly children: Model[];
    constructor(spec: NormalizedFacetSpec, parent: Model, parentGivenName: string, repeater: RepeaterValue, config: Config);
    private initFacet;
    channelHasField(channel: Channel): boolean;
    fieldDef(channel: Channel): FieldDef<string>;
    parseData(): void;
    parseLayoutSize(): void;
    parseSelection(): void;
    parseMarkGroup(): void;
    parseAxisAndHeader(): void;
    private parseHeader;
    private makeHeaderComponent;
    private mergeChildAxis;
    assembleSelectionTopLevelSignals(signals: any[]): VgSignal[];
    assembleSelectionSignals(): VgSignal[];
    assembleSelectionData(data: VgData[]): VgData[];
    private getHeaderLayoutMixins;
    protected assembleDefaultLayout(): VgLayout;
    assembleLayoutSignals(): VgSignal[];
    private columnDistinctSignal;
    assembleGroup(signals: VgSignal[]): any;
    /**
     * Aggregate cardinality for calculating size
     */
    private getCardinalityAggregateForChild;
    private assembleFacet;
    private headerSortFields;
    private headerSortOrder;
    assembleMarks(): VgMarkGroup[];
    protected getMapping(): FacetMapping<string>;
}
