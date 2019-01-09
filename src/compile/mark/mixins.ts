import {array, isArray, isObject, isString} from 'vega-util';
import {isBinned, isBinning} from '../../bin';
import {Channel, NonPositionScaleChannel, SCALE_CHANNELS, ScaleChannel, X, X2, Y2} from '../../channel';
import {
  ChannelDef,
  getTypedFieldDef,
  isConditionalSelection,
  isFieldDef,
  isValueDef,
  SecondaryFieldDef,
  TypedFieldDef,
  ValueDef
} from '../../fielddef';
import * as log from '../../log';
import {isPathMark, MarkDef} from '../../mark';
import {hasContinuousDomain} from '../../scale';
import {contains, Dict, getFirstDefined, keys} from '../../util';
import {VG_MARK_CONFIGS, VgEncodeEntry, VgValueRef} from '../../vega.schema';
import {getMarkConfig} from '../common';
import {expression} from '../predicate';
import {selectionPredicate} from '../selection/selection';
import {UnitModel} from '../unit';
import * as ref from './valueref';

function isVisible(c: string) {
  return c !== 'transparent' && c !== null && c !== undefined;
}

export function color(model: UnitModel): VgEncodeEntry {
  const {markDef, encoding, config} = model;
  const {filled, type: markType} = markDef;

  const configValue = {
    fill: getMarkConfig('fill', markDef, config),
    stroke: getMarkConfig('stroke', markDef, config),
    color: getMarkConfig('color', markDef, config)
  };

  const transparentIfNeeded = contains(['bar', 'point', 'circle', 'square', 'geoshape'], markType)
    ? 'transparent'
    : undefined;

  const defaultFill = getFirstDefined(
    markDef.fill,
    configValue.fill,
    // If there is no fill, always fill symbols, bar, geoshape
    // with transparent fills https://github.com/vega/vega-lite/issues/1316
    transparentIfNeeded
  );

  const defaultStroke = getFirstDefined(markDef.stroke, configValue.stroke);

  const colorVgChannel = filled ? 'fill' : 'stroke';

  const fillStrokeMarkDefAndConfig: VgEncodeEntry = {
    ...(defaultFill ? {fill: {value: defaultFill}} : {}),
    ...(defaultStroke ? {stroke: {value: defaultStroke}} : {})
  };

  if (encoding.fill || encoding.stroke) {
    // ignore encoding.color, markDef.color, config.color
    if (markDef.color) {
      // warn for markDef.color  (no need to warn encoding.color as it will be dropped in normalized already)
      log.warn(log.message.droppingColor('property', {fill: 'fill' in encoding, stroke: 'stroke' in encoding}));
    }

    return {
      ...nonPosition('fill', model, {defaultValue: getFirstDefined(defaultFill, transparentIfNeeded)}),
      ...nonPosition('stroke', model, {defaultValue: defaultStroke})
    };
  } else if (encoding.color) {
    return {
      ...fillStrokeMarkDefAndConfig,
      // override them with encoded color field
      ...nonPosition('color', model, {
        vgChannel: colorVgChannel,
        // apply default fill/stroke first, then color config, then transparent if needed.
        defaultValue: getFirstDefined(
          markDef[colorVgChannel],
          markDef.color,
          configValue[colorVgChannel],
          configValue.color,
          filled ? transparentIfNeeded : undefined
        )
      })
    };
  } else if (isVisible(markDef.fill) || isVisible(markDef.stroke)) {
    // Ignore markDef.color
    if (markDef.color) {
      log.warn(log.message.droppingColor('property', {fill: 'fill' in markDef, stroke: 'stroke' in markDef}));
    }
    return fillStrokeMarkDefAndConfig;
  } else if (markDef.color) {
    return {
      ...fillStrokeMarkDefAndConfig, // in this case, fillStrokeMarkDefAndConfig only include config

      // override config with markDef.color
      [colorVgChannel]: {value: markDef.color}
    };
  } else if (isVisible(configValue.fill) || isVisible(configValue.stroke)) {
    // ignore config.color
    return fillStrokeMarkDefAndConfig;
  } else if (configValue.color) {
    return {
      ...(transparentIfNeeded ? {fill: {value: 'transparent'}} : {}),
      [colorVgChannel]: {value: configValue.color}
    };
  }
  return {};
}

export type Ignore = Record<'size' | 'orient', 'ignore' | 'include'>;

export function baseEncodeEntry(model: UnitModel, ignore: Ignore) {
  const {fill, stroke} = color(model);
  return {
    ...markDefProperties(model.markDef, ignore),
    ...wrapInvalid(model, 'fill', fill),
    ...wrapInvalid(model, 'stroke', stroke),
    ...nonPosition('opacity', model),
    ...nonPosition('fillOpacity', model),
    ...nonPosition('strokeOpacity', model),
    ...nonPosition('strokeWidth', model),
    ...tooltip(model),
    ...text(model, 'href')
  };
}

function wrapInvalid(model: UnitModel, channel: Channel, valueRef: VgValueRef | VgValueRef[]): VgEncodeEntry {
  const {config, mark} = model;

  if (config.invalidValues && valueRef && !isPathMark(mark)) {
    // For non-path marks, we have to exclude invalid values (null and NaN) for scales with continuous domains.
    // For path marks, we will use "defined" property and skip these values instead.
    const test = validPredicate(model, {invalid: true, channels: SCALE_CHANNELS});
    if (test) {
      return {
        [channel]: [
          // prepend the invalid case
          // TODO: support custom value
          {test, value: null},
          ...array(valueRef)
        ]
      };
    }
  }
  return valueRef ? {[channel]: valueRef} : {};
}

function markDefProperties(mark: MarkDef, ignore: Ignore) {
  return VG_MARK_CONFIGS.reduce((m, prop) => {
    if (mark[prop] !== undefined && ignore[prop] !== 'ignore') {
      m[prop] = {value: mark[prop]};
    }
    return m;
  }, {});
}

export function valueIfDefined(prop: string, value: string | number | boolean): VgEncodeEntry {
  if (value !== undefined) {
    return {[prop]: {value: value}};
  }
  return undefined;
}

function validPredicate(model: UnitModel, {invalid = false, channels}: {invalid?: boolean; channels: ScaleChannel[]}) {
  const filterIndex = channels.reduce((aggregator: Dict<true>, channel) => {
    const scaleComponent = model.getScaleComponent(channel);
    if (scaleComponent) {
      const scaleType = scaleComponent.get('type');
      const field = model.vgField(channel, {expr: 'datum'});

      // While discrete domain scales can handle invalid values, continuous scales can't.
      if (field && hasContinuousDomain(scaleType)) {
        aggregator[field] = true;
      }
    }
    return aggregator;
  }, {});

  const fields = keys(filterIndex);
  if (fields.length > 0) {
    const op = invalid ? '||' : '&&';
    return fields
      .map(field => {
        const eq = invalid ? '===' : '!==';
        return `${field} ${eq} null ${op} ${invalid ? '' : '!'}isNaN(${field})`;
      })
      .join(` ${op} `);
  }
  return undefined;
}
export function defined(model: UnitModel): VgEncodeEntry {
  if (model.config.invalidValues === 'filter') {
    const signal = validPredicate(model, {channels: ['x', 'y']});

    if (signal) {
      return {defined: {signal}};
    }
  }
  return {};
}

/**
 * Return mixins for non-positional channels with scales.  (Text doesn't have scale.)
 */
export function nonPosition(
  channel: NonPositionScaleChannel,
  model: UnitModel,
  opt: {defaultValue?: number | string | boolean; vgChannel?: string; defaultRef?: VgValueRef} = {}
): VgEncodeEntry {
  const {markDef, encoding} = model;
  const {vgChannel = channel} = opt;

  const {defaultValue = markDef[vgChannel]} = opt;
  const defaultRef = opt.defaultRef || (defaultValue !== undefined ? {value: defaultValue} : undefined);

  const channelDef = encoding[channel];

  return wrapCondition(model, channelDef, vgChannel, cDef => {
    return ref.midPoint(
      channel,
      cDef,
      undefined,
      model.scaleName(channel),
      model.getScaleComponent(channel),
      null, // No need to provide stack for non-position as it does not affect mid point
      defaultRef
    );
  });
}

/**
 * Return a mixin that include a Vega production rule for a Vega-Lite conditional channel definition.
 * or a simple mixin if channel def has no condition.
 */
export function wrapCondition(
  model: UnitModel,
  channelDef: ChannelDef,
  vgChannel: string,
  refFn: (cDef: ChannelDef) => VgValueRef
): VgEncodeEntry {
  const condition = channelDef && channelDef.condition;
  const valueRef = refFn(channelDef);
  if (condition) {
    const conditions = isArray(condition) ? condition : [condition];
    const vgConditions = conditions.map(c => {
      const conditionValueRef = refFn(c);
      const test = isConditionalSelection(c) ? selectionPredicate(model, c.selection) : expression(model, c.test);
      return {
        test,
        ...conditionValueRef
      };
    });
    return {
      [vgChannel]: [...vgConditions, ...(valueRef !== undefined ? [valueRef] : [])]
    };
  } else {
    return valueRef !== undefined ? {[vgChannel]: valueRef} : {};
  }
}

export function tooltip(model: UnitModel) {
  const {encoding, markDef, config} = model;
  const channelDef = encoding.tooltip;
  if (isArray(channelDef)) {
    return {tooltip: ref.tooltipForEncoding({tooltip: channelDef}, config)};
  } else {
    return wrapCondition(model, channelDef, 'tooltip', cDef => {
      // use valueRef based on channelDef first
      const tooltipRefFromChannelDef = ref.text(cDef, model.config);
      if (tooltipRefFromChannelDef) {
        return tooltipRefFromChannelDef;
      }

      if (cDef === null) {
        // Allow using encoding.tooltip = null to disable tooltip
        return undefined;
      }

      // If tooltipDef does not exist, then use value from markDef or config
      const markTooltip = getFirstDefined(markDef.tooltip, getMarkConfig('tooltip', markDef, config));
      if (isString(markTooltip)) {
        return {value: markTooltip};
      } else if (isObject(markTooltip)) {
        // `tooltip` is `{fields: 'encodings' | 'fields'}`
        if (markTooltip.content === 'encoding') {
          return ref.tooltipForEncoding(encoding, config);
        } else {
          return {signal: 'datum'};
        }
      }

      return undefined;
    });
  }
}

export function text(model: UnitModel, channel: 'text' | 'href' = 'text') {
  const channelDef = model.encoding[channel];
  return wrapCondition(model, channelDef, channel, cDef => ref.text(cDef, model.config));
}

export function bandPosition(fieldDef: TypedFieldDef<string>, channel: 'x' | 'y', model: UnitModel) {
  const scaleName = model.scaleName(channel);
  const sizeChannel = channel === 'x' ? 'width' : 'height';

  if (model.encoding.size || model.markDef.size !== undefined) {
    const orient = model.markDef.orient;
    if (orient) {
      const centeredBandPositionMixins = {
        // Use xc/yc and place the mark at the middle of the band
        // This way we never have to deal with size's condition for x/y position.
        [channel + 'c']: ref.fieldRef(fieldDef, scaleName, {}, {band: 0.5})
      };

      if (getTypedFieldDef(model.encoding.size)) {
        return {
          ...centeredBandPositionMixins,
          ...nonPosition('size', model, {vgChannel: sizeChannel})
        };
      } else if (isValueDef(model.encoding.size)) {
        return {
          ...centeredBandPositionMixins,
          ...nonPosition('size', model, {vgChannel: sizeChannel})
        };
      } else if (model.markDef.size !== undefined) {
        return {
          ...centeredBandPositionMixins,
          [sizeChannel]: {value: model.markDef.size}
        };
      }
    } else {
      log.warn(log.message.cannotApplySizeToNonOrientedMark(model.markDef.type));
    }
  }
  return {
    [channel]: ref.fieldRef(fieldDef, scaleName, {binSuffix: 'range'}),
    [sizeChannel]: ref.bandRef(scaleName)
  };
}

export function centeredBandPosition(
  channel: 'x' | 'y',
  model: UnitModel,
  defaultPosRef: VgValueRef,
  defaultSizeRef: VgValueRef
) {
  const centerChannel: 'xc' | 'yc' = channel === 'x' ? 'xc' : 'yc';
  const sizeChannel = channel === 'x' ? 'width' : 'height';
  return {
    ...pointPosition(channel, model, defaultPosRef, centerChannel),
    ...nonPosition('size', model, {defaultRef: defaultSizeRef, vgChannel: sizeChannel})
  };
}

export function binPosition(
  fieldDef: TypedFieldDef<string>,
  fieldDef2: ValueDef | SecondaryFieldDef<string>,
  channel: 'x' | 'y',
  scaleName: string,
  spacing: number,
  reverse: boolean
) {
  const binSpacing = {
    x: reverse ? spacing : 0,
    x2: reverse ? 0 : spacing,
    y: reverse ? 0 : spacing,
    y2: reverse ? spacing : 0
  };
  const channel2 = channel === X ? X2 : Y2;
  if (isBinning(fieldDef.bin)) {
    return {
      [channel2]: ref.bin(fieldDef, scaleName, 'start', binSpacing[`${channel}2`]),
      [channel]: ref.bin(fieldDef, scaleName, 'end', binSpacing[channel])
    };
  } else if (isBinned(fieldDef.bin) && isFieldDef(fieldDef2)) {
    return {
      [channel2]: ref.fieldRef(fieldDef, scaleName, {}, {offset: binSpacing[`${channel}2`]}),
      [channel]: ref.fieldRef(fieldDef2, scaleName, {}, {offset: binSpacing[channel]})
    };
  } else {
    log.warn(log.message.channelRequiredForBinned(channel2));
    return undefined;
  }
}

/**
 * Return mixins for point (non-band) position channels.
 */
export function pointPosition(
  channel: 'x' | 'y',
  model: UnitModel,
  defaultRef: VgValueRef | 'zeroOrMin' | 'zeroOrMax',
  vgChannel?: 'x' | 'y' | 'xc' | 'yc'
) {
  // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613

  const {encoding, mark, stack} = model;

  const channelDef = encoding[channel];
  const channel2Def = encoding[channel === X ? X2 : Y2];
  const scaleName = model.scaleName(channel);
  const scale = model.getScaleComponent(channel);

  const offset = ref.getOffset(channel, model.markDef);

  const valueRef =
    !channelDef && (encoding.latitude || encoding.longitude)
      ? // use geopoint output if there are lat/long and there is no point position overriding lat/long.
        {field: model.getName(channel)}
      : {
          ...ref.position(
            channel,
            channelDef,
            channel2Def,
            scaleName,
            scale,
            stack,
            ref.getDefaultRef(defaultRef, channel, scaleName, scale, mark)
          ),
          ...(offset ? {offset} : {})
        };

  return {
    [vgChannel || channel]: valueRef
  };
}

/**
 * Return mixins for x2, y2.
 * If channel is not specified, return one channel based on orientation.
 */
export function pointPosition2(model: UnitModel, defaultRef: 'zeroOrMin' | 'zeroOrMax', channel: 'x2' | 'y2') {
  const {encoding, mark, stack} = model;

  const baseChannel = channel === 'x2' ? 'x' : 'y';
  const channelDef = encoding[baseChannel];
  const scaleName = model.scaleName(baseChannel);
  const scale = model.getScaleComponent(baseChannel);

  const offset = ref.getOffset(channel, model.markDef);

  const valueRef =
    !channelDef && (encoding.latitude || encoding.longitude)
      ? // use geopoint output if there are lat2/long2 and there is no point position2 overriding lat2/long2.
        {field: model.getName(channel)}
      : {
          ...ref.position2(
            channel,
            channelDef,
            encoding[channel],
            scaleName,
            scale,
            stack,
            ref.getDefaultRef(defaultRef, baseChannel, scaleName, scale, mark)
          ),
          ...(offset ? {offset} : {})
        };

  return {[channel]: valueRef};
}
