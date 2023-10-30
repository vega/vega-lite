import { NewSignal, SignalRef } from 'vega';
import { AxisInternal } from '../axis';
import { Channel, NonPositionScaleChannel, PositionChannel, ScaleChannel, SingleDefChannel } from '../channel';
import { Config } from '../config';
import * as vlEncoding from '../encoding';
import { Encoding } from '../encoding';
import { ExprRef } from '../expr';
import { LegendInternal } from '../legend';
import { Mark, MarkDef } from '../mark';
import { Projection } from '../projection';
import { Domain } from '../scale';
import { SelectionParameter } from '../selection';
import { LayoutSizeMixins, NormalizedUnitSpec } from '../spec';
import { StackProperties } from '../stack';
import { VgData, VgLayout } from '../vega.schema';
import { AxisInternalIndex } from './axis/component';
import { LegendInternalIndex } from './legend/component';
import { Model, ModelWithField } from './model';
import { ScaleIndex } from './scale/component';
/**
 * Internal model of Vega-Lite specification for the compiler.
 */
export declare class UnitModel extends ModelWithField {
    readonly markDef: MarkDef<Mark, SignalRef>;
    readonly encoding: Encoding<string>;
    readonly specifiedScales: ScaleIndex;
    readonly stack: StackProperties;
    protected specifiedAxes: AxisInternalIndex;
    protected specifiedLegends: LegendInternalIndex;
    specifiedProjection: Projection<ExprRef | SignalRef>;
    readonly selection: SelectionParameter[];
    children: Model[];
    constructor(spec: NormalizedUnitSpec, parent: Model, parentGivenName: string, parentGivenSize: LayoutSizeMixins, config: Config<SignalRef>);
    get hasProjection(): boolean;
    /**
     * Return specified Vega-Lite scale domain for a particular channel
     * @param channel
     */
    scaleDomain(channel: ScaleChannel): Domain;
    axis(channel: PositionChannel): AxisInternal;
    legend(channel: NonPositionScaleChannel): LegendInternal;
    private initScales;
    private initScale;
    private initAxes;
    private initAxis;
    private initLegends;
    parseData(): void;
    parseLayoutSize(): void;
    parseSelections(): void;
    parseMarkGroup(): void;
    parseAxesAndHeaders(): void;
    assembleSelectionTopLevelSignals(signals: any[]): NewSignal[];
    assembleSignals(): NewSignal[];
    assembleSelectionData(data: readonly VgData[]): VgData[];
    assembleLayout(): VgLayout;
    assembleLayoutSignals(): NewSignal[];
    assembleMarks(): any[];
    assembleGroupStyle(): string | string[];
    protected getMapping(): vlEncoding.Encoding<string>;
    get mark(): Mark;
    channelHasField(channel: Channel): boolean;
    fieldDef(channel: SingleDefChannel): import("../channeldef").FieldDef<string, any>;
    typedFieldDef(channel: SingleDefChannel): import("../channeldef").TypedFieldDef<string, any, boolean | import("../bin").BinParams | "binned">;
}
//# sourceMappingURL=unit.d.ts.map