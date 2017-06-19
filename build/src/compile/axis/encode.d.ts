import { AxisOrient } from '../../axis';
import { SpatialScaleChannel } from '../../channel';
import { VgAxis } from '../../vega.schema';
import { UnitModel } from '../unit';
export declare function labels(model: UnitModel, channel: SpatialScaleChannel, specifiedLabelsSpec: any, def: VgAxis): any;
export declare function labelAlign(angle: number, orient: AxisOrient): "left" | "right";
