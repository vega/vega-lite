import { Channel } from '../../channel';
import { Scale } from '../../scale';
import { VgScale } from '../../vega.schema';
import { UnitModel } from '../unit';
import { ScaleComponentIndex } from './component';
/**
 * Parse scales for all channels of a model.
 */
export default function parseScaleComponent(model: UnitModel): ScaleComponentIndex;
export declare const NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES: (keyof Scale)[];
/**
 * Parse scales for a single channel of a model.
 */
export declare function parseScale(model: UnitModel, channel: Channel): VgScale;
