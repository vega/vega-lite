import { Config } from '../../config';
import { Encoding } from '../../encoding';
import { MarkDef } from '../../mark';
import { StackProperties } from '../../stack';
import { ScaleComponentIndex } from '../scale/component';
export declare function normalizeMarkDef(markDef: MarkDef, encoding: Encoding<string>, scales: ScaleComponentIndex, config: Config): void;
/**
 * Initialize encoding's value with some special default values
 */
export declare function initEncoding(mark: MarkDef, encoding: Encoding<string>, stacked: StackProperties, config: Config): Encoding<string>;
