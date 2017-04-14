import { Config } from '../../config';
import { Encoding } from '../../encoding';
import { Mark, MarkDef } from '../../mark';
import { Scale } from '../../scale';
import { StackProperties } from '../../stack';
import { Dict } from '../../util';
export declare function initMarkDef(mark: Mark | MarkDef, encoding: Encoding, scale: Dict<Scale>, config: Config): MarkDef;
/**
 * Initialize encoding's value with some special default values
 */
export declare function initEncoding(mark: Mark, encoding: Encoding, stacked: StackProperties, config: Config): Encoding;
