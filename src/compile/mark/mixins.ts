import {MarkDef} from '../../mark';
import * as util from '../../util';
import {VgEncodeEntry, VgValueRef} from '../../vega.schema';
import {getMarkConfig} from '../common';
import {UnitModel} from '../unit';

import * as ref from './valueref';

import {Channel} from '../../channel';

export function color(model: UnitModel) {
  const config = model.config;
  const filled = model.markDef.filled;

  let e = nonPosition('color', model, {
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
 * Return mixins for non-positional channels.
 */
export function nonPosition(channel: Channel, model: UnitModel, opt: {defaultValue?: number | string | boolean, vgChannel?: string, defaultRef?: VgValueRef} = {}): VgEncodeEntry {
  // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613

  const {defaultValue, vgChannel} = opt;
  const defaultRef = opt.defaultRef || (defaultValue !== undefined ? {value: defaultValue} : undefined);
  const valueRef = ref.midPoint(channel, model.encoding[channel], model.scaleName(channel), model.scale(channel), defaultRef);

  return valueRef !== undefined ? {
    // allow vgChannel to be different from channel (mainly for size and color)
    [vgChannel || channel]: valueRef
  } : {};
}

export function text(model: UnitModel) {
  // TODO: support production rule
  return {text: ref.text(model.encoding.text, model.config)};
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
