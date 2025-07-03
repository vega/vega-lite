import type {MarkConfig} from 'vega';
import {MarkDef} from '../../../mark.js';
import {hasProperty} from '../../../util.js';
import {VG_MARK_CONFIGS, VgEncodeEntry, VgValueRef} from '../../../vega.schema.js';
import {signalOrValueRef} from '../../common.js';
import {UnitModel} from '../../unit.js';
import {aria} from './aria.js';
import {color} from './color.js';
import {nonPosition} from './nonposition.js';
import {text} from './text.js';
import {tooltip} from './tooltip.js';
import {zindex} from './zindex.js';

export {color} from './color.js';
export {nonPosition} from './nonposition.js';
export {pointPosition} from './position-point.js';
export {pointOrRangePosition, rangePosition} from './position-range.js';
export {rectPosition} from './position-rect.js';
export {text} from './text.js';
export {tooltip} from './tooltip.js';

export type Ignore = Record<'color' | 'size' | 'orient' | 'align' | 'baseline' | 'theta', 'ignore' | 'include'>;

const ALWAYS_IGNORE = new Set(['aria', 'width', 'height']);

export function baseEncodeEntry(model: UnitModel, ignore: Ignore) {
  const {fill = undefined, stroke = undefined} = ignore.color === 'include' ? color(model) : {};
  return {
    ...markDefProperties(model.markDef, ignore),
    ...colorRef('fill', fill),
    ...colorRef('stroke', stroke),
    ...nonPosition('opacity', model),
    ...nonPosition('fillOpacity', model),
    ...nonPosition('strokeOpacity', model),
    ...nonPosition('strokeWidth', model),
    ...nonPosition('strokeDash', model),
    ...zindex(model),
    ...tooltip(model),
    ...text(model, 'href'),
    ...aria(model),
  };
}

function colorRef(channel: 'fill' | 'stroke', valueRef: VgValueRef | VgValueRef[]): VgEncodeEntry {
  return valueRef ? {[channel]: valueRef} : {};
}

function markDefProperties(mark: MarkDef, ignore: Ignore) {
  return VG_MARK_CONFIGS.reduce(
    (m, prop) => {
      if (!ALWAYS_IGNORE.has(prop) && hasProperty(mark, prop) && (ignore as any)[prop] !== 'ignore') {
        m[prop] = signalOrValueRef(mark[prop]);
      }
      return m;
    },
    {} as Record<keyof MarkConfig, unknown>,
  );
}
