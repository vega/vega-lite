import { Channel } from '../../channel';
import { Config } from '../../config';
import { ScaleFieldDef } from '../../fielddef';
import { Mark } from '../../mark';
import { Scale } from '../../scale';
/**
 * All scale properties except type and all range properties.
 */
export declare const NON_TYPE_RANGE_SCALE_PROPERTIES: (keyof Scale)[];
/**
 * Initialize Vega-Lite Scale's properties
 *
 * Note that we have to apply these rules here because:
 * - many other scale and non-scale properties (including layout, mark) depend on scale type
 * - layout depends on padding
 * - range depends on zero and size (width and height) depends on range
 */
export default function init(channel: Channel, fieldDef: ScaleFieldDef, config: Config, mark: Mark | undefined, topLevelSize: number | undefined, xyRangeSteps: number[]): Scale;
