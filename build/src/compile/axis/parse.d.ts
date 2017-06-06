import { Channel } from '../../channel';
import { VgAxis } from '../../vega.schema';
import { UnitModel } from '../unit';
import { AxisComponentIndex } from './component';
export declare function parseAxisComponent(model: UnitModel, axisChannels: Channel[]): AxisComponentIndex;
/**
 * Make an inner axis for showing grid for shared axis.
 */
export declare function parseGridAxis(channel: Channel, model: UnitModel): VgAxis;
export declare function parseMainAxis(channel: Channel, model: UnitModel): any;
