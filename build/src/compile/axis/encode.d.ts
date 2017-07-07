import { Axis } from '../../axis';
import { Channel, SpatialScaleChannel } from '../../channel';
import { FieldDef } from '../../fielddef';
import { AxisOrient, VgAxis } from '../../vega.schema';
import { Split } from '../split';
import { UnitModel } from '../unit';
export declare function labels(model: UnitModel, channel: SpatialScaleChannel, specifiedLabelsSpec: any, def: Split<Partial<VgAxis>>): any;
export declare function labelAngle(axis: Axis, channel: Channel, fieldDef: FieldDef<string>): number;
export declare function labelAlign(angle: number, orient: AxisOrient): "left" | "right";
