import {isArray} from 'vega-util';

import {NONPOSITION_SCALE_CHANNELS, PositionScaleChannel} from '../../channel';
import {
  ChannelDef,
  FieldDef,
  FieldDefWithCondition,
  getFieldDef,
  isConditionalSelection,
  isValueDef,
  TextFieldDef,
  ValueDefWithCondition,
  vgField,
} from '../../fielddef';
import * as log from '../../log';
import {MarkDef} from '../../mark';
import {expression} from '../../predicate';
import {hasContinuousDomain} from '../../scale';
import {contains} from '../../util';
import {VG_MARK_CONFIGS, VgEncodeEntry, VgValueRef} from '../../vega.schema';
import {getMarkConfig} from '../common';
import {selectionPredicate} from '../selection/selection';
import {UnitModel} from '../unit';
import * as ref from './valueref';

export function color(model: UnitModel, opt: {valueOnly: boolean} = {valueOnly: false}): VgEncodeEntry {
  const {markDef, encoding, config} = model;
  const {filled, type: markType} = markDef;

  const configValue = {
    fill: getMarkConfig('fill', markDef, config),
    stroke: getMarkConfig('stroke', markDef, config),
    color: getMarkConfig('color', markDef, config)
  };

  const transparentIfNeeded = contains(['bar', 'point', 'circle', 'square', 'geoshape'], markType) ? 'transparent' : undefined;

  const defaultValue = {
    fill: markDef.fill || configValue.fill ||
    // If there is no fill, always fill symbols, bar, geoshape
    // with transparent fills https://github.com/vega/vega-lite/issues/1316
      transparentIfNeeded,
    stroke: markDef.stroke || configValue.stroke
  };

  const colorVgChannel = filled ? 'fill' : 'stroke';

  const fillStrokeMarkDefAndConfig: VgEncodeEntry = {
    ...(defaultValue.fill ? {
      fill: {value: defaultValue.fill}
    } : {}),
    ...(defaultValue.stroke ? {
      stroke: {value: defaultValue.stroke}
    } : {}),
  };

  if (encoding.fill || encoding.stroke) {
    // ignore encoding.color, markDef.color, config.color
    if (markDef.color) {
      // warn for markDef.color  (no need to warn encoding.color as it will be dropped in normalized already)
      log.warn(log.message.droppingColor('property', {fill: 'fill' in encoding, stroke: 'stroke' in encoding}));
    }

    return {
      ...nonPosition('fill', model, {defaultValue: defaultValue.fill || transparentIfNeeded}),
      ...nonPosition('stroke', model, {defaultValue: defaultValue.stroke})
    };
  } else if (encoding.color) {

    return {
      ...fillStrokeMarkDefAndConfig,
      // override them with encoded color field
      ...nonPosition('color', model, {
        vgChannel: colorVgChannel,
        // apply default fill/stroke first, then color config, then transparent if needed.
        defaultValue: markDef[colorVgChannel] || markDef.color || configValue[colorVgChannel] || configValue.color || (filled ? transparentIfNeeded : undefined)
      })
    };
  } else if (markDef.fill || markDef.stroke) {
    // Ignore markDef.color, config.color
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
  } else if (configValue.fill || configValue.stroke) {
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
  return {
    ...markDefProperties(model.markDef, ignore),
    ...color(model),
    ...nonPosition('opacity', model),
    ...tooltip(model),
    ...text(model, 'href')
  };
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

function validPredicate(vgRef: string) {
  return `${vgRef} !== null && !isNaN(${vgRef})`;
}

export function defined(model: UnitModel): VgEncodeEntry {
  if (model.config.invalidValues === 'filter') {
    const fields = ['x', 'y'].map((channel: PositionScaleChannel) => {
        const scaleComponent = model.getScaleComponent(channel);
        if (scaleComponent) {
          const scaleType = scaleComponent.get('type');

          // Discrete domain scales can handle invalid values, but continuous scales can't.
          if (hasContinuousDomain(scaleType)) {
            return model.vgField(channel, {expr: 'datum'});
          }
        }
        return undefined;
      })
      .filter(field => !!field)
      .map(validPredicate);

    if (fields.length > 0) {
      return {
        defined: {signal: fields.join(' && ')}
      };
    }
  }

  return {};
}

/**
 * Return mixins for non-positional channels with scales.  (Text doesn't have scale.)
 */
export function nonPosition(channel: typeof NONPOSITION_SCALE_CHANNELS[0], model: UnitModel, opt: {defaultValue?: number | string | boolean, vgChannel?: string, defaultRef?: VgValueRef} = {}): VgEncodeEntry {
  const {defaultValue, vgChannel} = opt;
  const defaultRef = opt.defaultRef || (defaultValue !== undefined ? {value: defaultValue} : undefined);

  const channelDef = model.encoding[channel];

  return wrapCondition(model, channelDef, vgChannel || channel, (cDef) => {
    return ref.midPoint(
      channel, cDef, model.scaleName(channel),
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
    model: UnitModel, channelDef: ChannelDef<string>, vgChannel: string,
    refFn: (cDef: ChannelDef<string>) => VgValueRef
  ): VgEncodeEntry {
  const condition = channelDef && channelDef.condition;
  const valueRef = refFn(channelDef);
  if (condition) {
    const conditions = isArray(condition) ? condition : [condition];
    const vgConditions = conditions.map((c) => {
      const conditionValueRef = refFn(c);
      const test = isConditionalSelection(c) ? selectionPredicate(model, c.selection) : expression(model, c.test);
      return {
        test,
        ...conditionValueRef
      };
    });
    return {
      [vgChannel]: [
        ...vgConditions,
        ...(valueRef !== undefined ? [valueRef] : [])
      ]
    };
  } else {
    return valueRef !== undefined ? {[vgChannel]: valueRef} : {};
  }
}

export function tooltip(model: UnitModel) {
  const channel = 'tooltip';
  const channelDef = model.encoding[channel];
  if (isArray(channelDef)) {
    const keyValues = channelDef.map((fieldDef) => {
      const key = fieldDef.title !== undefined ? fieldDef.title : vgField(fieldDef, {binSuffix: 'range'});
      const value = ref.text(fieldDef, model.config).signal;
      return `"${key}": ${value}`;
    });
    return {tooltip: {signal: `{${keyValues.join(', ')}}`}};
  } else {
    // if not an array, behave just like text
    return textCommon(model, channel, channelDef);
  }
}

export function text(model: UnitModel, channel: 'text' | 'href' = 'text') {
  const channelDef = model.encoding[channel];
  return textCommon(model, channel, channelDef);
}

function textCommon(model: UnitModel, channel: 'text' | 'href' | 'tooltip', channelDef: FieldDefWithCondition<TextFieldDef<string>> | ValueDefWithCondition<TextFieldDef<string>>) {
  return wrapCondition(model, channelDef, channel, (cDef) => ref.text(cDef, model.config));
}

export function bandPosition(fieldDef: FieldDef<string>, channel: 'x'|'y', model: UnitModel) {
  const scaleName = model.scaleName(channel);
  const sizeChannel = channel === 'x' ? 'width' : 'height';

  if (model.encoding.size || model.markDef.size !== undefined) {
    const orient = model.markDef.orient;
    if (orient) {
      const centeredBandPositionMixins = {
        // Use xc/yc and place the mark at the middle of the band
        // This way we never have to deal with size's condition for x/y position.
        [channel+'c']: ref.fieldRef(fieldDef, scaleName, {}, {band: 0.5})
      };

      if (getFieldDef(model.encoding.size)) {
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

export function centeredBandPosition(channel: 'x' | 'y', model: UnitModel, defaultPosRef: VgValueRef, defaultSizeRef: VgValueRef) {
  const centerChannel: 'xc' | 'yc' = channel === 'x' ? 'xc' : 'yc';
  const sizeChannel = channel === 'x' ? 'width' : 'height';
  return {
    ...pointPosition(channel, model, defaultPosRef, centerChannel),
    ...nonPosition('size', model, {defaultRef: defaultSizeRef, vgChannel: sizeChannel})
  };
}

export function binnedPosition(fieldDef: FieldDef<string>, channel: 'x'|'y', scaleName: string, spacing: number, reverse: boolean) {
  if (channel === 'x') {
    return {
      x2: ref.bin(fieldDef, scaleName, 'start', reverse ? 0 : spacing),
      x: ref.bin(fieldDef, scaleName, 'end', reverse ? spacing : 0)
    };
  } else {
    return {
      y2: ref.bin(fieldDef, scaleName, 'start', reverse ? spacing : 0),
      y: ref.bin(fieldDef, scaleName, 'end', reverse ? 0 : spacing)
    };
  }
}


/**
 * Return mixins for point (non-band) position channels.
 */
export function pointPosition(channel: 'x'|'y', model: UnitModel, defaultRef: VgValueRef | 'zeroOrMin' | 'zeroOrMax', vgChannel?: 'x'|'y'|'xc'|'yc') {
  // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613

  const {encoding, mark, stack} = model;

  const channelDef = encoding[channel];
  const scaleName = model.scaleName(channel);
  const scale = model.getScaleComponent(channel);


  const offset = ref.getOffset(channel, model.markDef);


  const valueRef = !channelDef && (encoding.latitude || encoding.longitude) ?
    // use geopoint output if there are lat/long and there is no point position overriding lat/long.
    {field: model.getName(channel)} :
    {
      ...ref.stackable(channel, encoding[channel], scaleName, scale, stack,
        ref.getDefaultRef(defaultRef, channel, scaleName, scale, mark)
      ),
     ...(offset ? {offset}: {})
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

  const valueRef = !channelDef && (encoding.latitude || encoding.longitude) ?
    // use geopoint output if there are lat2/long2 and there is no point position2 overriding lat2/long2.
    {field: model.getName(channel)}:
    {
      ...ref.stackable2(channel, channelDef, encoding[channel], scaleName, scale, stack,
        ref.getDefaultRef(defaultRef, baseChannel, scaleName, scale, mark)
      ),
      ...(offset ? {offset} : {})
    };

  return {[channel]: valueRef};
}
