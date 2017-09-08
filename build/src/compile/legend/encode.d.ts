import { Channel, NonspatialScaleChannel } from '../../channel';
import { FieldDef } from '../../fielddef';
import { UnitModel } from '../unit';
import { LegendComponent } from './component';
export declare function symbols(fieldDef: FieldDef<string>, symbolsSpec: any, model: UnitModel, channel: Channel, legendCmpt: LegendComponent): any;
export declare function gradient(fieldDef: FieldDef<string>, gradientSpec: any, model: UnitModel, channel: Channel, legendCmpt: LegendComponent): any;
export declare function labels(fieldDef: FieldDef<string>, labelsSpec: any, model: UnitModel, channel: NonspatialScaleChannel, legendCmpt: LegendComponent): any;
