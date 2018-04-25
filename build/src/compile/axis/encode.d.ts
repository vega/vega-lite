import { Axis } from '../../axis';
import { Channel, PositionScaleChannel } from '../../channel';
import { FieldDef } from '../../fielddef';
import { AxisOrient, HorizontalAlign } from '../../vega.schema';
import { UnitModel } from '../unit';
export declare function labels(model: UnitModel, channel: PositionScaleChannel, specifiedLabelsSpec: any, orient: AxisOrient): any;
export declare function labelBaseline(angle: number, orient: AxisOrient): {
    value: string;
};
export declare function labelAngle(axis: Axis, channel: Channel, fieldDef: FieldDef<string>): number;
export declare function labelAlign(angle: number, orient: AxisOrient): HorizontalAlign;
