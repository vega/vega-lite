import { Config } from '../../config';
import { Encoding } from '../../encoding';
import { Mark, MarkDef } from '../../mark';
import { StackProperties } from '../../stack';
export declare function normalizeMarkDef(mark: Mark | MarkDef, encoding: Encoding<string>, config: Config): MarkDef;
/**
 * Initialize encoding's value with some special default values
 */
export declare function initEncoding(mark: MarkDef, encoding: Encoding<string>, stacked: StackProperties, config: Config): Encoding<string>;
