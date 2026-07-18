import {isCountingAggregateOp} from '../../../aggregate.js';
import {NonPositionScaleChannel, PolarPositionScaleChannel, PositionScaleChannel} from '../../../channel.js';
import {getFieldDef, vgField} from '../../../channeldef.js';
import {ScaleInvalidDataShowAs, isScaleInvalidDataIncludeAsValue} from '../../../invalid.js';
import {fieldValidPredicate} from '../../../predicate.js';
import {VgValueRef, isSignalRef} from '../../../vega.schema.js';
import {getScaleInvalidDataMode} from '../../invalid/ScaleInvalidDataMode.js';
import {ScaleComponent} from '../../scale/component.js';
import {scaledZeroOrMinOrMax} from './scaledZeroOrMinOrMax.js';
import {MidPointParams} from './valueref.js';

export function getConditionalValueRefForIncludingInvalidValue<
  C extends PositionScaleChannel | PolarPositionScaleChannel | NonPositionScaleChannel,
>({
  scaleChannel,
  channelDef,
  scale,
  scaleName,
  markDef,
  config,
}: {
  scaleChannel: C;
} & Pick<MidPointParams, 'scale' | 'scaleName' | 'channelDef' | 'markDef' | 'config'>): VgValueRef | undefined {
  const scaleType = scale?.get('type');

  const fieldDef = getFieldDef<string>(channelDef);
  const isCountAggregate = isCountingAggregateOp(fieldDef?.aggregate);

  const invalidDataMode = getScaleInvalidDataMode<C>({
    scaleChannel,
    markDef,
    config,
    scaleType,
    isCountAggregate,
  });

  if (fieldDef && invalidDataMode === 'show') {
    const includeAs: ScaleInvalidDataShowAs<C> = config.scale.invalid?.[scaleChannel] ?? 'zero-or-min';
    return {
      test: fieldValidPredicate(vgField(fieldDef, {expr: 'datum'}), false),
      ...refForInvalidValues(includeAs, scale, scaleName),
    };
  }
  return undefined;
}

function refForInvalidValues<C extends PositionScaleChannel | PolarPositionScaleChannel | NonPositionScaleChannel>(
  includeAs: ScaleInvalidDataShowAs<C>,
  scale: ScaleComponent,
  scaleName: string,
): VgValueRef {
  if (isScaleInvalidDataIncludeAsValue(includeAs)) {
    const {value} = includeAs;
    return isSignalRef(value) ? {signal: value.signal} : {value};
  }

  return scaledZeroOrMinOrMax({
    scale,
    scaleName,
    mode: 'zeroOrMin',
  });
}
