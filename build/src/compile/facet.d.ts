import { Channel } from '../channel';
import { Config } from '../config';
import { FacetMapping } from '../facet';
import { FieldDef } from '../fielddef';
import { NormalizedFacetSpec } from '../spec';
import { VgData, VgLayout, VgMarkGroup, VgSignal } from '../vega.schema';
import { Model, ModelWithField } from './model';
import { RepeaterValue } from './repeater';
export declare class FacetModel extends ModelWithField {
    readonly type: 'facet';
    readonly facet: FacetMapping<string>;
    readonly child: Model;
    readonly children: Model[];
    constructor(spec: NormalizedFacetSpec, parent: Model, parentGivenName: string, repeater: RepeaterValue, config: Config);
    private initFacet(facet);
    channelHasField(channel: Channel): boolean;
    fieldDef(channel: Channel): FieldDef<string>;
    parseData(): void;
    parseLayoutSize(): void;
    parseSelection(): void;
    parseMarkGroup(): void;
    parseAxisAndHeader(): void;
    private parseHeader(channel);
    private makeHeaderComponent(channel, labels);
    private mergeChildAxis(channel);
    assembleSelectionTopLevelSignals(signals: any[]): VgSignal[];
    assembleSelectionSignals(): VgSignal[];
    assembleSelectionData(data: VgData[]): VgData[];
    private getLayoutBandMixins(headerType);
    assembleLayout(): VgLayout;
    assembleLayoutSignals(): VgSignal[];
    private columnDistinctSignal();
    assembleGroup(signals: VgSignal[]): any;
    /**
     * Aggregate cardinality for calculating size
     */
    private getCardinalityAggregateForChild();
    assembleMarks(): VgMarkGroup[];
    protected getMapping(): FacetMapping<string>;
}
