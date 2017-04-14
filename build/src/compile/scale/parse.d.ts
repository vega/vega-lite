import { Channel } from '../../channel';
import { Scale } from '../../scale';
import { Dict } from '../../util';
import { Model } from '../model';
import { VgScale } from '../../vega.schema';
/**
 * Parse scales for all channels of a model.
 */
export default function parseScaleComponent(model: Model): Dict<VgScale>;
export declare const NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES: (keyof Scale)[];
/**
 * Parse scales for a single channel of a model.
 */
export declare function parseScale(model: Model, channel: Channel): VgScale;
