import { EncodeEntry, Gradient, LegendEncode, LegendType, SymbolEncodeEntry } from 'vega';
import { NonPositionScaleChannel } from '../../channel';
import { DatumDef, TypedFieldDef, Value } from '../../channeldef';
import { Encoding } from '../../encoding';
import { UnitModel } from '../unit';
import { LegendComponent } from './component';
export interface LegendEncodeParams {
    fieldOrDatumDef: TypedFieldDef<string> | DatumDef;
    model: UnitModel;
    channel: NonPositionScaleChannel;
    legendCmpt: LegendComponent;
    legendType: LegendType;
}
export declare const legendEncodeRules: {
    [part in keyof LegendEncode]?: (spec: EncodeEntry, params: LegendEncodeParams) => EncodeEntry;
};
export declare function symbols(symbolsSpec: any, { fieldOrDatumDef, model, channel, legendCmpt, legendType }: LegendEncodeParams): SymbolEncodeEntry;
export declare function gradient(gradientSpec: any, { model, legendType, legendCmpt }: LegendEncodeParams): SymbolEncodeEntry;
export declare function labels(specifiedlabelsSpec: any, { fieldOrDatumDef, model, channel, legendCmpt }: LegendEncodeParams): any;
export declare function entries(entriesSpec: any, { legendCmpt }: LegendEncodeParams): any;
export declare function getFirstConditionValue<V extends Value | Gradient>(channelDef: Encoding<string>['fill' | 'stroke' | 'shape']): V;
//# sourceMappingURL=encode.d.ts.map