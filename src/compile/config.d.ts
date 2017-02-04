import { Config } from '../config';
import { Encoding } from '../encoding';
import { MarkConfig, TextConfig, Orient } from '../mark';
import { Mark } from '../mark';
import { Scale } from '../scale';
import { StackProperties } from '../stack';
import { Dict } from '../util';
/**
 * Augment config.mark with rule-based default values.
 */
export declare function initMarkConfig(mark: Mark, encoding: Encoding, scale: Dict<Scale>, stacked: StackProperties, config: Config): MarkConfig;
export declare function initTextConfig(encoding: Encoding, config: Config): TextConfig;
export declare function opacity(mark: Mark, encoding: Encoding, stacked: StackProperties): number;
export declare function orient(mark: Mark, encoding: Encoding, scale: Dict<Scale>, markConfig?: MarkConfig): Orient;
