import {isPathMark} from '../../mark.js';
import {hasContinuousDomain} from '../../scale.js';
import {getMarkPropOrConfig} from '../common.js';
import {normalizeInvalidDataMode} from './normalizeInvalidDataMode.js';
export function getScaleInvalidDataMode({markDef, config, scaleChannel, scaleType, isCountAggregate}) {
  if (!scaleType || !hasContinuousDomain(scaleType) || isCountAggregate) {
    // - Discrete scales can always display null as another category
    // - Count cannot output null values
    return 'always-valid';
  }
  const invalidMode = normalizeInvalidDataMode(getMarkPropOrConfig('invalid', markDef, config), {
    isPath: isPathMark(markDef.type),
  });
  const scaleOutputForInvalid = config.scale?.invalid?.[scaleChannel];
  if (scaleOutputForInvalid !== undefined) {
    // Regardless of the current invalid mode, if the channel has a default value, we consider the field valid.
    return 'show';
  }
  return invalidMode;
}
export function shouldBreakPath(mode) {
  return mode === 'break-paths-filter-domains' || mode === 'break-paths-show-domains';
}
//# sourceMappingURL=ScaleInvalidDataMode.js.map
