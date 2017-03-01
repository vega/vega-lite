import { Mark, MarkDef } from '../../mark';
import { Encoding } from '../../encoding';
import { Dict } from '../../util';
import { Scale } from '../../scale';
import { Config } from '../../config';
import { StackProperties } from '../../stack';
export declare function initMarkDef(mark: Mark | MarkDef, encoding: Encoding, scale: Dict<Scale>, config: Config): MarkDef & {
    filled: boolean;
};
/**
 * Initialize encoding's value with some special default values
 */
export declare function initEncoding(mark: Mark, encoding: Encoding, stacked: StackProperties, config: Config): Encoding;
