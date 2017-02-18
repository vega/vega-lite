
import {Config} from '../config';
import {Encoding} from '../encoding';
import {MarkConfig} from '../mark';
import {POINT, LINE, RULE, Mark} from '../mark';
import {Scale} from '../scale';
import {StackProperties} from '../stack';
import {extend, Dict} from '../util';
/**
 * Augment config.mark with rule-based default values.
 */
export function initMarkConfig(mark: Mark, encoding: Encoding, scale: Dict<Scale>, stacked: StackProperties, config: Config): MarkConfig {
  // override mark config with mark specific config
  const markConfig = extend({}, config.mark, config[mark]);

  if (markConfig.filled === undefined) {
    markConfig.filled = mark !== POINT && mark !== LINE && mark !== RULE;
  }

  return markConfig;
}

