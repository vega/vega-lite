import { NewSignal } from 'vega';
import { Axis } from '../axis';
import { Channel, ScaleChannel, SingleDefChannel } from '../channel';
import { Config } from '../config';
import { Encoding } from '../encoding';
import { TypedFieldDef } from '../fielddef';
import { Legend } from '../legend';
import { Mark, MarkDef } from '../mark';
import { Projection } from '../projection';
import { Domain } from '../scale';
import { SelectionDef } from '../selection';
import { LayoutSizeMixins, NormalizedUnitSpec } from '../spec';
import { StackProperties } from '../stack';
import { Dict } from '../util';
import { VgData, VgEncodeEntry, VgLayout } from '../vega.schema';
import { AxisIndex } from './axis/component';
import { LegendIndex } from './legend/component';
import { Model, ModelWithField } from './model';
import { RepeaterValue } from './repeater';
import { ScaleIndex } from './scale/component';
/**
 * Internal model of Vega-Lite specification for the compiler.
 */
export declare class UnitModel extends ModelWithField {
    fit: boolean;
    readonly type: 'unit';
    readonly markDef: MarkDef;
    readonly encoding: Encoding<string>;
    readonly specifiedScales: ScaleIndex;
    readonly stack: StackProperties;
    protected specifiedAxes: AxisIndex;
    protected specifiedLegends: LegendIndex;
    specifiedProjection: Projection;
    readonly selection: Dict<SelectionDef>;
    children: Model[];
    constructor(spec: NormalizedUnitSpec, parent: Model, parentGivenName: string, parentGivenSize: LayoutSizeMixins, repeater: RepeaterValue, config: Config, fit: boolean);
    readonly hasProjection: boolean;
    /**
     * Return specified Vega-lite scale domain for a particular channel
     * @param channel
     */
    scaleDomain(channel: ScaleChannel): Domain;
    axis(channel: Channel): Axis;
    legend(channel: Channel): Legend;
    private initScales;
    private initAxes;
    private initLegend;
    parseData(): void;
    parseLayoutSize(): void;
    parseSelection(): void;
    parseMarkGroup(): void;
    parseAxisAndHeader(): void;
    assembleSelectionTopLevelSignals(signals: any[]): NewSignal[];
    assembleSelectionSignals(): NewSignal[];
    assembleSelectionData(data: VgData[]): VgData[];
    assembleLayout(): VgLayout;
    assembleLayoutSignals(): NewSignal[];
    assembleMarks(): any[];
    assembleLayoutSize(): VgEncodeEntry;
    protected getMapping(): Encoding<string>;
    toSpec(excludeConfig?: any, excludeData?: any): any;
    readonly mark: Mark;
    channelHasField(channel: Channel): boolean;
    fieldDef(channel: SingleDefChannel): TypedFieldDef<string, import("../type").Type>;
}
