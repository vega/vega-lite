import {MarkDef} from '../../mark';
import * as util from '../../util';
import {VgEncodeEntry, VgValueRef} from '../../vega.schema';
import {getMarkConfig} from '../common';
import {UnitModel} from '../unit';

import * as ref from './valueref';

import {NONSPATIAL_SCALE_CHANNELS} from '../../channel';
import {Condition} from '../../fielddef';
import {predicate} from '../selection/selection';

export function color(model: UnitModel) {
  const config = model.config;
  const filled = model.markDef.filled;

  const e = nonPosition('color', model, {
    vgChannel: filled ? 'fill' : 'stroke',
    defaultValue: getMarkConfig('color', model.mark(), config) as string
  });

  // If there is no fill, always fill symbols
  // with transparent fills https://github.com/vega/vega-lite/issues/1316
  if (!e.fill && util.contains(['bar', 'point', 'circle', 'square'], model.mark())) {
    e.fill = {value: 'transparent'};
  }
  return e;
}

export function markDefProperties(mark: MarkDef, props: (keyof MarkDef)[]) {
  return props.reduce((m, prop) => {
    if (mark[prop]) {
      m[prop] = {value: mark[prop]};
    }
    return m;
  }, {});
}

export function valueIfDefined(prop: string, value: VgValueRef): VgEncodeEntry {
  if (value !== undefined) {
    return {[prop]: {value: value}};
  }
  return undefined;
}

/**
 * Return mixins for non-positional channels with scales.  (Text doesn't have scale.)
 */
export function nonPosition(channel: typeof NONSPATIAL_SCALE_CHANNELS[0], model: UnitModel, opt: {defaultValue?: number | string | boolean, vgChannel?: string, defaultRef?: VgValueRef} = {}): VgEncodeEntry {
  // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613

  const {defaultValue, vgChannel} = opt;
  const defaultRef = opt.defaultRef || (defaultValue !== undefined ? {value: defaultValue} : undefined);

  const channelDef = model.encoding[channel];
  const valueRef = ref.midPoint(channel, channelDef, model.scaleName(channel), model.scale(channel), defaultRef);

  return wrapCondition(model, channelDef && channelDef.condition, vgChannel || channel, valueRef);
}

/**
 * Return a mixin that include a Vega production rule for a Vega-Lite conditional channel definition.
 * or a simple mixin if channel def has no condition.
 */
function wrapCondition(model: UnitModel, condition: Condition<any>, vgChannel: string, valueRef: VgValueRef): VgEncodeEntry {
  if (condition) {
    const {selection, value} = condition;
    return {
      [vgChannel]: [
        {test: selectionTest(model, selection), value},
        ...(valueRef !== undefined ? [valueRef] : [])
      ]
    };
  } else {
    return valueRef !== undefined ? {[vgChannel]: valueRef} : {};
  }
}

function selectionTest(model: UnitModel, selectionName: string) {
  const negate = selectionName.charAt(0) === '!',
    name = negate ? selectionName.slice(1) : selectionName;
  return (negate ? '!' : '') + predicate(model.component.selection[name]);
}

export function text(model: UnitModel) {
  const channelDef = model.encoding.text;
  return wrapCondition(model, channelDef && channelDef.condition, 'text', ref.text(channelDef, model.config));
}

export function bandPosition(channel: 'x'|'y', model: UnitModel) {
  // TODO: band scale doesn't support size yet
  const fieldDef = model.encoding[channel];
  const scaleName = model.scaleName(channel);
  const sizeChannel = channel === 'x' ? 'width' : 'height';
  return {
    [channel]: ref.fieldRef(fieldDef, scaleName, {}),
    [sizeChannel]: ref.band(scaleName)
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

export function binnedPosition(channel: 'x'|'y', model: UnitModel, spacing: number) {
  const fieldDef = model.encoding[channel];
  const scaleName = model.scaleName(channel);
  if (channel === 'x') {
    return {
      x2: ref.bin(fieldDef, scaleName, 'start', spacing),
      x: ref.bin(fieldDef, scaleName, 'end')
    };
  } else {
    return {
      y2: ref.bin(fieldDef, scaleName, 'start'),
      y: ref.bin(fieldDef, scaleName, 'end', spacing)
    };
  }
}

/**
 * Return mixins for point (non-band) position channels.
 */
export function pointPosition(channel: 'x'|'y', model: UnitModel, defaultRef: VgValueRef | 'zeroOrMin' | 'zeroOrMax', vgChannel?: 'x'|'y'|'xc'|'yc') {
  // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613

  const {encoding, stack} = model;
  const valueRef = ref.stackable(channel, encoding[channel], model.scaleName(channel), model.scale(channel), stack, defaultRef);

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

  const valueRef = ref.stackable2(channel, encoding[baseChannel], encoding[channel], model.scaleName(baseChannel), model.scale(baseChannel), stack, defaultRef);
  return {[channel]: valueRef};
}
