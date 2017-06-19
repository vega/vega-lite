import { SpatialScaleChannel } from '../../channel';
import { VgAxis } from '../../vega.schema';
import { UnitModel } from '../unit';
import { AxisComponentIndex } from './component';
export declare function parseAxisComponent(model: UnitModel, axisChannels: SpatialScaleChannel[]): AxisComponentIndex;
/**
 * Make an inner axis for showing grid for shared axis.
 */
export declare function parseGridAxis(channel: SpatialScaleChannel, model: UnitModel): VgAxis;
export declare function parseMainAxis(channel: SpatialScaleChannel, model: UnitModel): any;
