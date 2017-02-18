import {COLOR, SIZE, DETAIL} from '../channel';
import {Config} from '../config';
import {Encoding, isAggregate, channelHasField} from '../encoding';
import {MarkConfig} from '../mark';
import {BAR, AREA, POINT, LINE, TICK, CIRCLE, SQUARE, RULE, Mark} from '../mark';
import {Scale} from '../scale';
import {StackProperties} from '../stack';
import {contains, extend, Dict} from '../util';
/**
 * Augment config.mark with rule-based default values.
 */
export function initMarkConfig(mark: Mark, encoding: Encoding, scale: Dict<Scale>, stacked: StackProperties, config: Config): MarkConfig {
  // override mark config with mark specific config
  const markConfig = extend({}, config.mark, config[mark]);

  if (markConfig.filled === undefined) {
    markConfig.filled = mark !== POINT && mark !== LINE && mark !== RULE;
  }

  if (markConfig.opacity === undefined) {
    const o = opacity(mark, encoding, stacked);
    if (o) {
      markConfig.opacity = o;
    }
  }

  return markConfig;
}

export function opacity(mark: Mark, encoding: Encoding, stacked: StackProperties) {
  if (contains([POINT, TICK, CIRCLE, SQUARE], mark)) {
    // point-based marks
    if (!isAggregate(encoding) || channelHasField(encoding, DETAIL)) {
      return 0.7;
    }
  }
  if (mark === BAR && !stacked) {
    if (channelHasField(encoding, COLOR) || channelHasField(encoding, DETAIL) || channelHasField(encoding, SIZE)) {
      return 0.7;
    }
  }
  if (mark === AREA) {
    return 0.7; // inspired by Tableau
  }
  return undefined;
}
