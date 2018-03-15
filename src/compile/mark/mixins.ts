import {isArray} from 'vega-util';
import {NONPOSITION_SCALE_CHANNELS} from '../../channel';
import {ChannelDef, FieldDef, getFieldDef, isConditionalSelection, isValueDef} from '../../fielddef';
import * as log from '../../log';
import {MarkDef} from '../../mark';
import {expression} from '../../predicate';
import {contains} from '../../util';
import {VG_MARK_CONFIGS, VgEncodeEntry, VgValueRef} from '../../vega.schema';
import {getMarkConfig} from '../common';
import {selectionPredicate} from '../selection/selection';
import {UnitModel} from '../unit';
import * as ref from './valueref';


export function color(model: UnitModel) {
  const config = model.config;
  const {filled, type: markType} = model.markDef;
  const vgChannel = filled ? 'fill' : 'stroke';

  return {
    // If there is no fill, always fill symbols, bar, geoshape
    // with transparent fills https://github.com/vega/vega-lite/issues/1316
    ...(
      contains(['bar', 'point', 'circle', 'square', 'geoshape'], markType) ?
      {fill: {value: 'transparent'}}:
      {}
    ),

    ...nonPosition('color', model, {
      vgChannel,
      // Mark definition has higher precedence than config;
      // fill/stroke has higher precedence than color.
      defaultValue: model.markDef[vgChannel] ||
        model.markDef.color ||
        getMarkConfig(vgChannel, model.markDef, config) ||
        getMarkConfig('color', model.markDef, config)
    }),
    // fill / stroke encodings have higher precedence than color encoding
    ...nonPosition('fill', model),
    ...nonPosition('stroke', model)
  };
}

export type Ignore = Record<'size' | 'orient', 'ignore' | 'include'>;

export function baseEncodeEntry(model: UnitModel, ignore: Ignore) {
  return {
    ...markDefProperties(model.markDef, ignore),
    ...color(model),
    ...nonPosition('opacity', model),
    ...text(model, 'tooltip'),
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
function wrapCondition(
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

export function text(model: UnitModel, channel: 'text' | 'tooltip' | 'href' = 'text') {
  const channelDef = model.encoding[channel];
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
        log.warn(log.message.cannotUseSizeFieldWithBandSize(channel));
        // TODO: apply size to band and set scale range to some values between 0-1.
        // return {
        //   ...centeredBandPositionMixins,
        //   ...bandSize('size', model, {vgChannel: sizeChannel})
        // };
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

  const {encoding, stack} = model;

  const channelDef = encoding[channel];

  const valueRef = !channelDef && (encoding.latitude || encoding.longitude) ?
    // use geopoint output if there are lat/long and there is no point position overriding lat/long.
    {field: model.getName(channel)} :
    ref.stackable(channel, encoding[channel], model.scaleName(channel), model.getScaleComponent(channel), stack, defaultRef);

  return {
    [vgChannel || channel]: valueRef
  };
}

/**
 * Return mixins for x2, y2.
 * If channel is not specified, return one channel based on orientation.
 */
export function pointPosition2(model: UnitModel, defaultRef: 'zeroOrMin' | 'zeroOrMax', channel?: 'x2' | 'y2') {
  const {encoding, markDef, stack} = model;
  channel = channel || (markDef.orient === 'horizontal' ? 'x2' : 'y2');

  const baseChannel = channel === 'x2' ? 'x' : 'y';
  const channelDef = encoding[baseChannel];

  const valueRef = !channelDef && (encoding.latitude || encoding.longitude) ?
    // use geopoint output if there are lat2/long2 and there is no point position2 overriding lat2/long2.
    {field: model.getName(channel)}:
    ref.stackable2(channel, channelDef, encoding[channel], model.scaleName(baseChannel), model.getScaleComponent(baseChannel), stack, defaultRef);
  return {[channel]: valueRef};
}
