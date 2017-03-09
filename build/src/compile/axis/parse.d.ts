import { Channel } from '../../channel';
import { VgAxis } from '../../vega.schema';
import { Model } from '../model';
import { Dict } from '../../util';
export declare function parseAxisComponent(model: Model, axisChannels: Channel[]): Dict<VgAxis[]>;
/**
 * Make an inner axis for showing grid for shared axis.
 */
export declare function parseGridAxis(channel: Channel, model: Model): VgAxis;
export declare function parseMainAxis(channel: Channel, model: Model): any;
