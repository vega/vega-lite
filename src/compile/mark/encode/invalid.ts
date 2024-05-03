import {isString} from 'vega-util';
import {isCountingAggregateOp} from '../../../aggregate';
import {NonPositionScaleChannel, PolarPositionScaleChannel, PositionScaleChannel} from '../../../channel';
import {FieldDef, FieldName, getFieldDef, vgField} from '../../../channeldef';
import {ScaleInvalidDataIncludeAs, isScaleInvalidDataIncludeAsValue} from '../../../invalid';
import {fieldValidPredicate} from '../../../predicate';
import {VgValueRef, isSignalRef} from '../../../vega.schema';
import {getScaleInvalidDataMode} from '../../invalid/ScaleInvalidDataMode';
import {ScaleComponent} from '../../scale/component';
import {zeroOrMinOrMax} from './zeroOrMinOrMax';
import {MidPointParams} from './valueref';

export function fieldInvalidPredicate(field: FieldName | FieldDef<string>, {invalid = true}: {invalid: boolean}) {
  return fieldValidPredicate(isString(field) ? field : vgField(field, {expr: 'datum'}), !invalid);
}

export function getConditionalValueRefForIncludingInvalidValue<
  C extends PositionScaleChannel | PolarPositionScaleChannel | NonPositionScaleChannel
>({
  scaleChannel,
  channelDef,
  scale,
  scaleName,
  markDef,
  config
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
    isCountAggregate
  });

  if (fieldDef && invalidDataMode === 'include') {
    const includeAs: ScaleInvalidDataIncludeAs<C> = config.scale.invalid?.[scaleChannel] || 'min';
    return {
      test: fieldInvalidPredicate(fieldDef, {invalid: true}),
      ...refForInvalidValues(scaleChannel, includeAs, scale, scaleName)
    };
  }
  return undefined;
}

function refForInvalidValues<C extends PositionScaleChannel | PolarPositionScaleChannel | NonPositionScaleChannel>(
  channel: C,
  includeAs: ScaleInvalidDataIncludeAs<C>,
  scale: ScaleComponent,
  scaleName: string
): VgValueRef {
  if (isScaleInvalidDataIncludeAsValue(includeAs)) {
    const {value} = includeAs;
    return isSignalRef(value) ? {signal: value.signal} : {value};
  }

  return zeroOrMinOrMax({
    mainChannel: channel,
    scale,
    scaleName,
    mode: includeAs === 'zero-or-min' ? 'zeroOrMin' : 'min'
  });
}
