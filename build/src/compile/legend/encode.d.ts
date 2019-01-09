import { SymbolEncodeEntry } from 'vega';
import { NonPositionScaleChannel } from '../../channel';
import { TypedFieldDef } from '../../fielddef';
import { UnitModel } from '../unit';
import { ScaleChannel } from './../../channel';
import { LegendComponent } from './component';
export declare function symbols(fieldDef: TypedFieldDef<string>, symbolsSpec: any, model: UnitModel, channel: ScaleChannel, legendCmp: LegendComponent): SymbolEncodeEntry;
export declare function gradient(fieldDef: TypedFieldDef<string>, gradientSpec: any, model: UnitModel, channel: ScaleChannel, legendCmp: LegendComponent): SymbolEncodeEntry;
export declare function labels(fieldDef: TypedFieldDef<string>, labelsSpec: any, model: UnitModel, channel: NonPositionScaleChannel, legendCmp: LegendComponent): SymbolEncodeEntry;
