import { SymbolEncodeEntry } from 'vega';
import { NonPositionScaleChannel } from '../../channel';
import { FieldDefWithCondition, MarkPropFieldDef, TypedFieldDef, Value, ValueDefWithCondition } from '../../channeldef';
import { UnitModel } from '../unit';
import { ScaleChannel } from './../../channel';
import { LegendComponent } from './component';
export declare function symbols(fieldDef: TypedFieldDef<string>, symbolsSpec: any, model: UnitModel, channel: ScaleChannel, legendCmp: LegendComponent): SymbolEncodeEntry;
export declare function gradient(fieldDef: TypedFieldDef<string>, gradientSpec: any, model: UnitModel, channel: ScaleChannel, legendCmp: LegendComponent): SymbolEncodeEntry;
export declare function labels(fieldDef: TypedFieldDef<string>, labelsSpec: any, model: UnitModel, channel: NonPositionScaleChannel): SymbolEncodeEntry;
export declare function getFirstConditionValue<V extends Value>(channelDef: FieldDefWithCondition<MarkPropFieldDef<string>, V> | ValueDefWithCondition<MarkPropFieldDef<string>, V>): V;
//# sourceMappingURL=encode.d.ts.map