import {ColorValueRef, SignalRef, SymbolEncodeEntry} from 'vega';
import {array, isArray, stringValue} from 'vega-util';
import {COLOR, NonPositionScaleChannel, OPACITY, ScaleChannel} from '../../channel';
import {
  Conditional,
  DatumDef,
  Gradient,
  hasConditionalValueDef,
  isFieldDef,
  isValueDef,
  TypedFieldDef,
  Value,
  ValueDef
} from '../../channeldef';
import {Encoding} from '../../encoding';
import {FILL_STROKE_CONFIG} from '../../mark';
import {ScaleType} from '../../scale';
import {getFirstDefined, keys, varName} from '../../util';
import {applyMarkConfig, signalOrValueRef} from '../common';
import {formatSignalRef} from '../format';
import * as mixins from '../mark/encode';
import {STORE} from '../selection';
import {UnitModel} from '../unit';
import {LegendComponent} from './component';
import {defaultType} from './properties';

function type(legendCmp: LegendComponent, model: UnitModel, channel: ScaleChannel) {
  const scaleType = model.getScaleComponent(channel).get('type');
  return getFirstDefined(legendCmp.get('type'), defaultType({channel, scaleType, alwaysReturn: true}));
}

export function symbols(
  fieldOrDatumDef: TypedFieldDef<string> | DatumDef,
  symbolsSpec: any,
  model: UnitModel,
  channel: ScaleChannel,
  legendCmp: LegendComponent
): SymbolEncodeEntry {
  if (type(legendCmp, model, channel) !== 'symbol') {
    return undefined;
  }

  const {markDef, encoding, config, mark} = model;
  const filled = markDef.filled && mark !== 'trail';

  let out = {
    ...applyMarkConfig({}, model, FILL_STROKE_CONFIG),
    ...mixins.color(model, {filled})
  } as SymbolEncodeEntry; // FIXME: remove this when VgEncodeEntry is compatible with SymbolEncodeEntry

  const opacity = getMaxValue(encoding.opacity) ?? markDef.opacity;

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
          out.fill = signalOrValueRef(config.legend.symbolBaseFillColor ?? 'black');
          out.fillOpacity = signalOrValueRef(opacity ?? 1);
        }
      } else if (isArray(out.fill)) {
        const fill =
          getFirstConditionValue(encoding.fill ?? encoding.color) ?? markDef.fill ?? (filled && markDef.color);
        if (fill) {
          out.fill = signalOrValueRef(fill) as ColorValueRef;
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
        const stroke = getFirstDefined<string | Gradient | SignalRef>(
          getFirstConditionValue<string | Gradient>(encoding.stroke || encoding.color),
          markDef.stroke,
          filled ? markDef.color : undefined
        );
        if (stroke) {
          out.stroke = {value: stroke} as ColorValueRef;
        }
      }
    }
  }

  if (channel !== OPACITY) {
    const condition = isFieldDef(fieldOrDatumDef) && selectedCondition(model, legendCmp, fieldOrDatumDef);

    if (condition) {
      out.opacity = [
        {test: condition, ...signalOrValueRef(opacity ?? 1)},
        signalOrValueRef(config.legend.unselectedOpacity)
      ];
    } else if (opacity) {
      out.opacity = signalOrValueRef(opacity);
    }
  }

  out = {...out, ...symbolsSpec};

  return keys(out).length > 0 ? out : undefined;
}

export function gradient(
  fieldOrDatumDef: TypedFieldDef<string> | DatumDef,
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
    out.opacity = signalOrValueRef(opacity);
  }

  out = {...out, ...gradientSpec};
  return keys(out).length > 0 ? out : undefined;
}

export function labels(
  fieldOrDatumDef: TypedFieldDef<string> | DatumDef,
  specifiedlabelsSpec: any,
  model: UnitModel,
  channel: NonPositionScaleChannel,
  legendCmp: LegendComponent
) {
  const legend = model.legend(channel) || {};
  const config = model.config;

  const condition = isFieldDef(fieldOrDatumDef) ? selectedCondition(model, legendCmp, fieldOrDatumDef) : undefined;
  const opacity = condition ? [{test: condition, value: 1}, {value: config.legend.unselectedOpacity}] : undefined;

  const {format, formatType} = legend;

  const text = formatSignalRef({
    fieldOrDatumDef,
    format,
    formatType,
    field: 'datum.value',
    config,
    isUTCScale: model.getScaleComponent(channel).get('type') === ScaleType.UTC,
    omitNumberFormatAndEmptyTimeFormat: true // no need to generate number format for encoding block as we can use Vega's legend format
  });

  const labelsSpec = {
    ...(opacity ? {opacity} : {}),
    ...(text ? {text} : {}),
    ...specifiedlabelsSpec
  };

  return keys(labelsSpec).length > 0 ? labelsSpec : undefined;
}

export function entries(
  fieldOrDatumDef: TypedFieldDef<string> | DatumDef,
  entriesSpec: any,
  model: UnitModel,
  channel: NonPositionScaleChannel,
  legendCmp: LegendComponent
) {
  const selections = legendCmp.get('selections');
  return selections?.length ? {fill: {value: 'transparent'}} : undefined;
}

function getMaxValue(channelDef: Encoding<string>['opacity']) {
  return getConditionValue<number>(channelDef, (v: number, conditionalDef) => Math.max(v, conditionalDef.value as any));
}

export function getFirstConditionValue<V extends Value | Gradient>(
  channelDef: Encoding<string>['fill' | 'stroke' | 'shape']
): V {
  return getConditionValue<V>(channelDef, (v: V, conditionalDef: Conditional<ValueDef<V>>) => {
    return getFirstDefined<V>(v, conditionalDef.value);
  });
}

function getConditionValue<V extends Value | Gradient>(
  channelDef: Encoding<string>['fill' | 'stroke' | 'shape' | 'opacity'],
  reducer: (val: V, conditionalDef: Conditional<ValueDef<V>>) => V
): V {
  if (hasConditionalValueDef(channelDef)) {
    return array(channelDef.condition).reduce(reducer, channelDef.value as any);
  } else if (isValueDef(channelDef)) {
    return channelDef.value as any;
  }
  return undefined;
}

function selectedCondition(model: UnitModel, legendCmp: LegendComponent, fieldDef: TypedFieldDef<string>) {
  const selections = legendCmp.get('selections');
  if (!selections?.length) return undefined;

  const field = stringValue(fieldDef.field);
  return selections
    .map(name => {
      const store = stringValue(varName(name) + STORE);
      return `(!length(data(${store})) || (${name}[${field}] && indexof(${name}[${field}], datum.value) >= 0))`;
    })
    .join(' || ');
}
