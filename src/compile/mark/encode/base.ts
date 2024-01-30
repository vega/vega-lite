import {array} from 'vega-util';
import {Channel, ScaleChannel, SCALE_CHANNELS} from '../../../channel.js';
import {isPathMark, MarkDef} from '../../../mark.js';
import {hasContinuousDomain} from '../../../scale.js';
import {Dict, keys} from '../../../util.js';
import {VgEncodeEntry, VgValueRef, VG_MARK_CONFIGS} from '../../../vega.schema.js';
import {getMarkPropOrConfig, signalOrValueRef} from '../../common.js';
import {UnitModel} from '../../unit.js';
import {aria} from './aria.js';
import {color} from './color.js';
import {nonPosition} from './nonposition.js';
import {text} from './text.js';
import {tooltip} from './tooltip.js';
import {fieldInvalidPredicate} from './valueref.js';
import {zindex} from './zindex.js';

export {color} from './color.js';
export {wrapCondition} from './conditional.js';
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
    ...wrapAllFieldsInvalid(model, 'fill', fill),
    ...wrapAllFieldsInvalid(model, 'stroke', stroke),
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

// TODO: mark VgValueRef[] as readonly after https://github.com/vega/vega/pull/1987
function wrapAllFieldsInvalid(model: UnitModel, channel: Channel, valueRef: VgValueRef | VgValueRef[]): VgEncodeEntry {
  const {config, mark, markDef} = model;

  const invalid = getMarkPropOrConfig('invalid', markDef, config);

  if (invalid === 'hide' && valueRef && !isPathMark(mark)) {
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
    if (!ALWAYS_IGNORE.has(prop) && mark[prop] !== undefined && ignore[prop] !== 'ignore') {
      m[prop] = signalOrValueRef(mark[prop]);
    }
    return m;
  }, {});
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
