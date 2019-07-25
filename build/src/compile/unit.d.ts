import { NewSignal } from 'vega';
import { Axis } from '../axis';
import { Channel, ScaleChannel, SingleDefChannel } from '../channel';
import { TypedFieldDef } from '../channeldef';
import { Config } from '../config';
import * as vlEncoding from '../encoding';
import { Encoding } from '../encoding';
import { Legend } from '../legend';
import { Mark, MarkDef } from '../mark';
import { Projection } from '../projection';
import { Domain } from '../scale';
import { SelectionDef } from '../selection';
import { LayoutSizeMixins, NormalizedUnitSpec } from '../spec';
import { StackProperties } from '../stack';
import { Dict } from '../util';
import { VgData, VgLayout } from '../vega.schema';
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
    parseSelections(): void;
    parseMarkGroup(): void;
    parseAxesAndHeaders(): void;
    assembleSelectionTopLevelSignals(signals: any[]): NewSignal[];
    assembleSignals(): NewSignal[];
    assembleSelectionData(data: VgData[]): VgData[];
    assembleLayout(): VgLayout;
    assembleLayoutSignals(): NewSignal[];
    assembleMarks(): any[];
    protected getMapping(): vlEncoding.Encoding<string>;
    readonly mark: Mark;
    channelHasField(channel: Channel): boolean;
    fieldDef(channel: SingleDefChannel): TypedFieldDef<string, import("../type").Type, import("../bin").Bin>;
}
//# sourceMappingURL=unit.d.ts.map