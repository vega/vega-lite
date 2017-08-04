import { Channel } from '../channel';
import { Config } from '../config';
import { Facet } from '../facet';
import { FieldDef } from '../fielddef';
import { FacetSpec } from '../spec';
import { VgData, VgLayout, VgMarkGroup, VgScale, VgSignal } from '../vega.schema';
import { Model, ModelWithField } from './model';
import { RepeaterValue } from './repeat';
export declare class FacetModel extends ModelWithField {
    readonly facet: Facet<string>;
    readonly child: Model;
    readonly children: Model[];
    constructor(spec: FacetSpec, parent: Model, parentGivenName: string, repeater: RepeaterValue, config: Config);
    private initFacet(facet);
    channelHasField(channel: Channel): boolean;
    hasDiscreteDomain(channel: Channel): boolean;
    fieldDef(channel: Channel): FieldDef<string>;
    parseData(): void;
    parseLayoutSize(): void;
    parseSelection(): void;
    parseMarkGroup(): void;
    parseAxisAndHeader(): void;
    private parseHeader(channel);
    private makeHeaderComponent(channel, labels);
    private mergeChildAxis(channel);
    parseLegend(): void;
    assembleData(): VgData[];
    assembleParentGroupProperties(): any;
    assembleScales(): VgScale[];
    assembleSelectionTopLevelSignals(signals: any[]): VgSignal[];
    assembleSelectionSignals(): VgSignal[];
    assembleSelectionData(data: VgData[]): VgData[];
    private getLayoutBandMixins(headerType);
    assembleLayout(): VgLayout;
    assembleLayoutSignals(): VgSignal[];
    private columnDistinctSignal();
    /**
     * Aggregate cardinality for calculating size
     */
    private getCardinalityAggregateForChild();
    assembleMarks(): VgMarkGroup[];
    protected getMapping(): Facet<string>;
}
