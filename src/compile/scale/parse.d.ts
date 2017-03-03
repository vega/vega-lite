import { Channel } from '../../channel';
import { Dict } from '../../util';
import { Model } from '../model';
import { ScaleComponents } from './scale';
import { VgDomain } from '../../vega.schema';
/**
 * Parse scales for all channels of a model.
 */
export default function parseScaleComponent(model: Model): Dict<ScaleComponents>;
/**
 * Parse scales for a single channel of a model.
 */
export declare function parseScale(model: Model, channel: Channel): ScaleComponents;
export declare function parseDomain(model: Model, channel: Channel): VgDomain;
