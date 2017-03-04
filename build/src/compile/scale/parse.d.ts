import { Channel } from '../../channel';
import { Scale } from '../../scale';
import { Dict } from '../../util';
import { Model } from '../model';
import { ScaleComponents } from './scale';
/**
 * Parse scales for all channels of a model.
 */
export default function parseScaleComponent(model: Model): Dict<ScaleComponents>;
/**
 * Parse scales for a single channel of a model.
 */
export declare function parseScale(model: Model, channel: Channel): ScaleComponents;
export declare const NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES: (keyof Scale)[];
