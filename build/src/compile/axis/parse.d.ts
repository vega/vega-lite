import { Channel } from '../../channel';
import { VgAxis } from '../../vega.schema';
import { UnitModel } from '../unit';
import { AxesComponent } from './index';
export declare function parseAxisComponent(model: UnitModel, axisChannels: Channel[]): AxesComponent;
/**
 * Make an inner axis for showing grid for shared axis.
 */
export declare function parseGridAxis(channel: Channel, model: UnitModel): VgAxis;
export declare function parseMainAxis(channel: Channel, model: UnitModel): any;
