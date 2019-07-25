import {array, isArray, isObject, isString} from 'vega-util';
import {isBinned, isBinning} from '../../bin';
import {Channel, NonPositionScaleChannel, ScaleChannel, SCALE_CHANNELS, X, X2, Y2} from '../../channel';
import {
  ChannelDef,
  getTypedFieldDef,
  isConditionalSelection,
  isFieldDef,
  isValueDef,
  SecondaryFieldDef,
  TypedFieldDef,
  ValueDef
} from '../../channeldef';
import * as log from '../../log';
import {isPathMark, Mark, MarkConfig, MarkDef} from '../../mark';
import {hasContinuousDomain} from '../../scale';
import {contains, Dict, getFirstDefined, keys} from '../../util';
import {VgEncodeChannel, VgEncodeEntry, VgValueRef, VG_MARK_CONFIGS} from '../../vega.schema';
import {getMarkConfig, getStyleConfig} from '../common';
import {expression} from '../predicate';
import {assembleSelectionPredicate} from '../selection/assemble';
import {UnitModel} from '../unit';
import * as ref from './valueref';
import {fieldInvalidPredicate} from './valueref';

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
    ...wrapAllFieldsInvalid(model, 'fill', fill),
    ...wrapAllFieldsInvalid(model, 'stroke', stroke),
    ...nonPosition('opacity', model),
    ...nonPosition('fillOpacity', model),
    ...nonPosition('strokeOpacity', model),
    ...nonPosition('strokeWidth', model),
    ...tooltip(model),
    ...text(model, 'href')
  };
}

function wrapAllFieldsInvalid(model: UnitModel, channel: Channel, valueRef: VgValueRef | VgValueRef[]): VgEncodeEntry {
  const {config, mark} = model;

  if (config.invalidValues === 'hide' && valueRef && !isPathMark(mark)) {
    // For non-path marks, we have to exclude invalid values (null and NaN) for scales with continuous domains.
    // For path marks, we will use "defined" property and skip these values instead.
    const test = allFieldsInvalidPredicate(model, {invalid: true, channels: SCALE_CHANNELS});
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

function allFieldsInvalidPredicate(
  model: UnitModel,
  {invalid = false, channels}: {invalid?: boolean; channels: ScaleChannel[]}
) {
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
    return fields.map(field => fieldInvalidPredicate(field, invalid)).join(` ${op} `);
  }
  return undefined;
}
export function defined(model: UnitModel): VgEncodeEntry {
  if (model.config.invalidValues) {
    const signal = allFieldsInvalidPredicate(model, {channels: ['x', 'y']});

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
  opt: {
    defaultValue?: number | string | boolean;
    vgChannel?: VgEncodeChannel;
    defaultRef?: VgValueRef;
  } = {}
): VgEncodeEntry {
  const {markDef, encoding, config} = model;
  const {vgChannel = channel} = opt;
  let {defaultRef, defaultValue} = opt;

  if (defaultRef === undefined) {
    // prettier-ignore
    defaultValue = defaultValue ||
      (vgChannel === channel
        ? // When vl channel is the same as Vega's, no need to read from config as Vega will apply them correctly
        markDef[channel]
        : // However, when they are different (e.g, vl's text size is vg fontSize), need to read "size" from configs
        getFirstDefined(markDef[channel], markDef[vgChannel], getMarkConfig(channel, markDef, config, {vgChannel})));

    defaultRef = defaultValue ? {value: defaultValue} : undefined;
  }

  const channelDef = encoding[channel];

  return wrapCondition(model, channelDef, vgChannel, cDef => {
    return ref.midPoint({
      channel,
      channelDef: cDef,
      scaleName: model.scaleName(channel),
      scale: model.getScaleComponent(channel),
      stack: null, // No need to provide stack for non-position as it does not affect mid point
      defaultRef
    });
  });
}

/**
 * Return a mixin that includes a Vega production rule for a Vega-Lite conditional channel definition.
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
      const test = isConditionalSelection(c)
        ? assembleSelectionPredicate(model, c.selection)
        : expression(model, c.test);
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

export function tooltip(model: UnitModel, opt: {reactiveGeom?: boolean} = {}) {
  const {encoding, markDef, config} = model;
  const channelDef = encoding.tooltip;
  if (isArray(channelDef)) {
    return {tooltip: ref.tooltipForEncoding({tooltip: channelDef}, config, opt)};
  } else {
    return wrapCondition(model, channelDef, 'tooltip', cDef => {
      // use valueRef based on channelDef first
      const tooltipRefFromChannelDef = ref.text(cDef, model.config, opt.reactiveGeom ? 'datum.datum' : 'datum');
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
          return ref.tooltipForEncoding(encoding, config, opt);
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

export function bandPosition(
  fieldDef: TypedFieldDef<string>,
  channel: 'x' | 'y',
  model: UnitModel,
  defaultSizeRef?: VgValueRef
) {
  const scaleName = model.scaleName(channel);
  const sizeChannel = channel === 'x' ? 'width' : 'height';

  if (
    model.encoding.size ||
    model.markDef.size !== undefined ||
    (defaultSizeRef && defaultSizeRef.value !== undefined)
  ) {
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
      } else if (defaultSizeRef && defaultSizeRef.value !== undefined) {
        return {
          ...centeredBandPositionMixins,
          [sizeChannel]: defaultSizeRef
        };
      }
    } else {
      log.warn(log.message.cannotApplySizeToNonOrientedMark(model.markDef.type));
    }
  }

  return {
    // FIXME: make offset works correctly here when we support group bar (https://github.com/vega/vega-lite/issues/396)
    [channel]: ref.fieldRef(fieldDef, scaleName, {binSuffix: 'range'}, {}),
    [sizeChannel]: defaultSizeRef || ref.bandRef(scaleName)
  };
}

export function centeredPointPositionWithSize(
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

export function binPosition({
  fieldDef,
  fieldDef2,
  channel,
  scaleName,
  mark,
  spacing = 0,
  reverse
}: {
  fieldDef: TypedFieldDef<string>;
  fieldDef2?: ValueDef | SecondaryFieldDef<string>;
  channel: 'x' | 'y';
  scaleName: string;
  mark: Mark;
  spacing?: number;
  reverse: boolean;
}) {
  const binSpacing = {
    x: reverse ? spacing : 0,
    x2: reverse ? 0 : spacing,
    y: reverse ? 0 : spacing,
    y2: reverse ? spacing : 0
  };
  const channel2 = channel === X ? X2 : Y2;
  if (isBinning(fieldDef.bin)) {
    return {
      [channel2]: ref.bin({
        channel,
        fieldDef,
        scaleName,
        mark,
        side: 'start',
        offset: binSpacing[`${channel}2`]
      }),
      [channel]: ref.bin({channel, fieldDef, scaleName, mark, side: 'end', offset: binSpacing[channel]})
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

  const {encoding, mark, markDef, config, stack} = model;

  const channelDef = encoding[channel];
  const channel2Def = encoding[channel === X ? X2 : Y2];
  const scaleName = model.scaleName(channel);
  const scale = model.getScaleComponent(channel);

  const offset = ref.getOffset(channel, model.markDef);

  const valueRef =
    !channelDef && (encoding.latitude || encoding.longitude)
      ? // use geopoint output if there are lat/long and there is no point position overriding lat/long.
        {field: model.getName(channel)}
      : ref.position({
          channel,
          channelDef,
          channel2Def,
          scaleName,
          scale,
          stack,
          mark,
          offset,
          defaultRef: ref.positionDefault({
            markDef,
            config,
            defaultRef,
            channel,
            scaleName,
            scale,
            mark,
            checkBarAreaWithoutZero: !channel2Def // only check for non-ranged marks
          })
        });

  return {
    [vgChannel || channel]: valueRef
  };
}

/**
 * Return mixins for x2, y2.
 * If channel is not specified, return one channel based on orientation.
 */
export function pointPosition2(model: UnitModel, defaultRef: 'zeroOrMin' | 'zeroOrMax', channel: 'x2' | 'y2') {
  const {encoding, mark, markDef, stack, config} = model;

  const baseChannel = channel === 'x2' ? 'x' : 'y';
  const sizeChannel = channel === 'x2' ? 'width' : 'height';

  const channelDef = encoding[baseChannel];
  const scaleName = model.scaleName(baseChannel);
  const scale = model.getScaleComponent(baseChannel);

  const offset = ref.getOffset(channel, model.markDef);

  if (!channelDef && (encoding.latitude || encoding.longitude)) {
    // use geopoint output if there are lat2/long2 and there is no point position2 overriding lat2/long2.
    return {[channel]: {field: model.getName(channel)}};
  }

  const valueRef = ref.position2({
    channel,
    channelDef,
    channel2Def: encoding[channel],
    scaleName,
    scale,
    stack,
    mark,
    offset,
    defaultRef: undefined
  });

  if (valueRef !== undefined) {
    return {[channel]: valueRef};
  }

  // TODO: check width/height encoding here once we add them

  // no x2/y2 encoding, then try to read x2/y2 or width/height based on precedence:
  // markDef > config.style > mark-specific config (config[mark]) > general mark config (config.mark)

  return getFirstDefined<VgEncodeEntry>(
    position2orSize(channel, markDef),
    position2orSize(channel, {
      [channel]: getStyleConfig(channel, markDef, config.style),
      [sizeChannel]: getStyleConfig(sizeChannel, markDef, config.style)
    }),
    position2orSize(channel, config[mark]),
    position2orSize(channel, config.mark),
    {
      [channel]: ref.positionDefault({
        markDef,
        config,
        defaultRef,
        channel,
        scaleName,
        scale,
        mark,
        checkBarAreaWithoutZero: !encoding[channel] // only check for non-ranged marks
      })()
    }
  );
}

function position2orSize(channel: 'x2' | 'y2', markDef: MarkConfig) {
  const sizeChannel = channel === 'x2' ? 'width' : 'height';
  if (markDef[channel]) {
    return {[channel]: ref.vgValueRef(channel, markDef[channel])};
  } else if (markDef[sizeChannel]) {
    return {[sizeChannel]: {value: markDef[sizeChannel]}};
  }
  return undefined;
}
