import type {MarkConfig} from 'vega';
import {MarkDef} from '../../../mark';
import {hasProperty} from '../../../util';
import {VG_MARK_CONFIGS, VgEncodeEntry, VgValueRef} from '../../../vega.schema';
import {signalOrValueRef} from '../../common';
import {UnitModel} from '../../unit';
import {aria} from './aria';
import {color} from './color';
import {nonPosition} from './nonposition';
import {text} from './text';
import {tooltip} from './tooltip';
import {zindex} from './zindex';

export {color} from './color';
export {nonPosition} from './nonposition';
export {pointPosition} from './position-point';
export {pointOrRangePosition, rangePosition} from './position-range';
export {rectPosition} from './position-rect';
export {text} from './text';
export {tooltip} from './tooltip';

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
    ...aria(model)
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
    {} as Record<keyof MarkConfig, unknown>
  );
}
