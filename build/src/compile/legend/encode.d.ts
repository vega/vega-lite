import { Channel, NonPositionScaleChannel } from '../../channel';
import { FieldDef } from '../../fielddef';
import { LegendType, VgEncodeEntry } from '../../vega.schema';
import { UnitModel } from '../unit';
export declare function symbols(fieldDef: FieldDef<string>, symbolsSpec: any, model: UnitModel, channel: Channel, type: LegendType): VgEncodeEntry;
export declare function gradient(fieldDef: FieldDef<string>, gradientSpec: any, model: UnitModel, channel: Channel, type: LegendType): any;
export declare function labels(fieldDef: FieldDef<string>, labelsSpec: any, model: UnitModel, channel: NonPositionScaleChannel, type: LegendType): any;
