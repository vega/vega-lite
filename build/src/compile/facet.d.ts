import { NewSignal } from 'vega';
import { Channel } from '../channel';
import { FieldRefOption, TypedFieldDef } from '../channeldef';
import { Config } from '../config';
import { EncodingSortField } from '../sort';
import { NormalizedFacetSpec } from '../spec';
import { EncodingFacetMapping, FacetFieldDef } from '../spec/facet';
import { VgData, VgLayout, VgMarkGroup } from '../vega.schema';
import { Model, ModelWithField } from './model';
import { RepeaterValue } from './repeater';
export declare function facetSortFieldName(fieldDef: FacetFieldDef<string>, sort: EncodingSortField<string>, opt?: FieldRefOption): string;
export declare class FacetModel extends ModelWithField {
    readonly facet: EncodingFacetMapping<string>;
    readonly child: Model;
    readonly children: Model[];
    constructor(spec: NormalizedFacetSpec, parent: Model, parentGivenName: string, repeater: RepeaterValue, config: Config);
    private initFacet;
    channelHasField(channel: Channel): boolean;
    fieldDef(channel: Channel): TypedFieldDef<string>;
    parseData(): void;
    parseLayoutSize(): void;
    parseSelections(): void;
    parseMarkGroup(): void;
    parseAxesAndHeaders(): void;
    assembleSelectionTopLevelSignals(signals: NewSignal[]): NewSignal[];
    assembleSignals(): NewSignal[];
    assembleSelectionData(data: VgData[]): VgData[];
    private getHeaderLayoutMixins;
    protected assembleDefaultLayout(): VgLayout;
    assembleLayoutSignals(): NewSignal[];
    private columnDistinctSignal;
    assembleGroup(signals: NewSignal[]): any;
    /**
     * Aggregate cardinality for calculating size
     */
    private getCardinalityAggregateForChild;
    private assembleFacet;
    private facetSortFields;
    private facetSortOrder;
    private assembleLabelTitle;
    assembleMarks(): VgMarkGroup[];
    protected getMapping(): EncodingFacetMapping<string>;
}
//# sourceMappingURL=facet.d.ts.map