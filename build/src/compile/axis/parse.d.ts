import { Channel } from '../../channel';
import { VgAxis } from '../../vega.schema';
import { Dict } from '../../util';
import { Model } from '../model';
export declare function parseAxisComponent(model: Model, axisChannels: Channel[]): Dict<VgAxis[]>;
/**
 * Make an inner axis for showing grid for shared axis.
 */
export declare function parseGridAxis(channel: Channel, model: Model): VgAxis;
export declare function parseMainAxis(channel: Channel, model: Model): any;
