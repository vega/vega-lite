import {SignalRef} from 'vega';
import {ScaleChannel} from '../../channel.js';
import {Config} from '../../config.js';
import {MarkInvalidDataMode} from '../../invalid.js';
import {MarkDef, isPathMark} from '../../mark.js';
import {ScaleType, hasContinuousDomain} from '../../scale.js';
import {getMarkPropOrConfig} from '../common.js';
import {normalizeInvalidDataMode} from './normalizeInvalidDataMode.js';

export type ScaleInvalidDataMode =
  // remove 'break-paths-show-path-domains' from MarkInvalidDataMode
  // because it is a macro for '"filter"' or `"break-path-keep-domains`
  | Omit<MarkInvalidDataMode, 'break-paths-show-path-domains'>

  // Add always-valid because at scale level, categorical scales can handle any values and thus is always valid.
  | 'always-valid';

export function getScaleInvalidDataMode<C extends ScaleChannel>({
  markDef,
  config,
  scaleChannel,
  scaleType,
  isCountAggregate,
}: {
  markDef: MarkDef;
  config: Config<SignalRef>;
  scaleChannel: C;
  scaleType: ScaleType;
  isCountAggregate: boolean;
}): ScaleInvalidDataMode {
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
export function shouldBreakPath(mode: ScaleInvalidDataMode): boolean {
  return mode === 'break-paths-filter-domains' || mode === 'break-paths-show-domains';
}
