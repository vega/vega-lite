import {SymbolEncodeEntry} from 'vega';
import {isArray} from 'vega-util';
import {COLOR, NonPositionScaleChannel, OPACITY} from '../../channel';
import {
  Conditional,
  FieldDefWithCondition,
  hasConditionalValueDef,
  isTimeFormatFieldDef,
  isValueDef,
  MarkPropFieldDef,
  TypedFieldDef,
  Value,
  ValueDef,
  ValueDefWithCondition
} from '../../channeldef';
import {FILL_STROKE_CONFIG} from '../../mark';
import {ScaleType} from '../../scale';
import {getFirstDefined, keys} from '../../util';
import {applyMarkConfig, timeFormatExpression} from '../common';
import * as mixins from '../mark/mixins';
import {UnitModel} from '../unit';
import {ScaleChannel} from './../../channel';
import {LegendComponent} from './component';
import {defaultType} from './properties';

function type(legendCmp: LegendComponent, model: UnitModel, channel: ScaleChannel) {
  const scaleType = model.getScaleComponent(channel).get('type');
  return getFirstDefined(legendCmp.get('type'), defaultType({channel, scaleType, alwaysReturn: true}));
}

export function symbols(
  fieldDef: TypedFieldDef<string>,
  symbolsSpec: any,
  model: UnitModel,
  channel: ScaleChannel,
  legendCmp: LegendComponent
): SymbolEncodeEntry {
  if (type(legendCmp, model, channel) !== 'symbol') {
    return undefined;
  }

  let out = {
    ...applyMarkConfig({}, model, FILL_STROKE_CONFIG),
    ...mixins.color(model)
  } as SymbolEncodeEntry; // FIXME: remove this when VgEncodeEntry is compatible with SymbolEncodeEntry

  const {markDef, encoding, config} = model;
  const filled = markDef.filled;

  const opacity = getMaxValue(encoding.opacity) || markDef.opacity;

  if (out.fill) {
    // for fill legend, we don't want any fill in symbol
    if (channel === 'fill' || (filled && channel === COLOR)) {
      delete out.fill;
    } else {
      if (out.fill['field']) {
        // For others, set fill to some opaque value (or nothing if a color is already set)
        if (legendCmp.get('symbolFillColor')) {
          delete out.fill;
        } else {
          out.fill = {value: config.legend.symbolBaseFillColor || 'black'};
          out.fillOpacity = {value: opacity || 1};
        }
      } else if (isArray(out.fill)) {
        const fill =
          (getFirstConditionValue(encoding.fill || encoding.color) as string) ||
          markDef.fill ||
          (filled && markDef.color);
        if (fill) {
          out.fill = {value: fill};
        }
      }
    }
  }

  if (out.stroke) {
    if (channel === 'stroke' || (!filled && channel === COLOR)) {
      delete out.stroke;
    } else {
      if (out.stroke['field']) {
        // For others, remove stroke field
        delete out.stroke;
      } else if (isArray(out.stroke)) {
        const stroke = getFirstDefined(
          getFirstConditionValue(encoding.stroke || encoding.color) as string,
          markDef.stroke,
          filled ? markDef.color : undefined
        );
        if (stroke) {
          out.stroke = {value: stroke};
        }
      }
    }
  }

  if (channel !== OPACITY) {
    if (opacity) {
      // only apply opacity if it is neither zero or undefined
      out.opacity = {value: opacity};
    }
  }

  out = {...out, ...symbolsSpec};

  return keys(out).length > 0 ? out : undefined;
}

export function gradient(
  fieldDef: TypedFieldDef<string>,
  gradientSpec: any,
  model: UnitModel,
  channel: ScaleChannel,
  legendCmp: LegendComponent
) {
  if (type(legendCmp, model, channel) !== 'gradient') {
    return undefined;
  }

  let out: SymbolEncodeEntry = {};

  const opacity = getMaxValue(model.encoding.opacity) || model.markDef.opacity;
  if (opacity) {
    // only apply opacity if it is neither zero or undefined
    out.opacity = {value: opacity};
  }

  out = {...out, ...gradientSpec};
  return keys(out).length > 0 ? out : undefined;
}

export function labels(
  fieldDef: TypedFieldDef<string>,
  labelsSpec: any,
  model: UnitModel,
  channel: NonPositionScaleChannel
) {
  const legend = model.legend(channel);
  const config = model.config;

  let out: SymbolEncodeEntry = {};

  if (isTimeFormatFieldDef(fieldDef)) {
    const isUTCScale = model.getScaleComponent(channel).get('type') === ScaleType.UTC;
    const expr = timeFormatExpression(
      'datum.value',
      fieldDef.timeUnit,
      legend.format,
      config.legend.shortTimeLabels,
      config.timeFormat,
      isUTCScale
    );
    labelsSpec = {
      ...(expr ? {text: {signal: expr}} : {}),
      ...labelsSpec
    };
  }

  out = {...out, ...labelsSpec};

  return keys(out).length > 0 ? out : undefined;
}

function getMaxValue(
  channelDef:
    | FieldDefWithCondition<MarkPropFieldDef<string>, number>
    | ValueDefWithCondition<MarkPropFieldDef<string>, number>
) {
  return getConditionValue<number>(channelDef, (v: number, conditionalDef) => Math.max(v, conditionalDef.value as any));
}

export function getFirstConditionValue<V extends Value>(
  channelDef: FieldDefWithCondition<MarkPropFieldDef<string>, V> | ValueDefWithCondition<MarkPropFieldDef<string>, V>
): V {
  return getConditionValue(channelDef, (v: V, conditionalDef: Conditional<ValueDef<V>>) => {
    return getFirstDefined<V>(v, conditionalDef.value);
  });
}

function getConditionValue<V extends Value>(
  channelDef: FieldDefWithCondition<MarkPropFieldDef<string>, V> | ValueDefWithCondition<MarkPropFieldDef<string>, V>,
  reducer: (val: V, conditionalDef: Conditional<ValueDef>) => V
): V {
  if (hasConditionalValueDef(channelDef)) {
    return (isArray(channelDef.condition) ? channelDef.condition : [channelDef.condition]).reduce(
      reducer,
      channelDef.value as any
    );
  } else if (isValueDef(channelDef)) {
    return channelDef.value as any;
  }
  return undefined;
}
