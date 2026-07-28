import {Signal, Transforms as VgTransform} from 'vega';
import {stringValue} from 'vega-util';
import {TIME} from '../channel.js';
import {TimeFieldDef} from '../channeldef.js';
import {DataSourceType} from '../data.js';
import {hasDiscreteRange} from '../scale.js';
import {VgData} from '../vega.schema.js';
import {UnitModel} from './unit.js';
import {
  ANIM_TWEEN,
  ANIM_VALUE,
  ANIM_VALUE_NEXT,
  CURR,
  EASED_ANIM_CLOCK,
  MAX_EXTENT,
  MIN_EXTENT,
  T_INDEX,
} from './selection/point.js';

/** Rows at the frame the animation is currently on. */
export const EQ = '_eq';
/** Rows at the frame it is heading towards. */
export const NEXT = '_next';
/** Current-frame rows joined to their successor by the key field. */
export const EQ_NEXT = '_eq_next';
/** What interpolated marks are drawn from. */
export const INTERPOLATE = '_interpolate';

/**
 * The field a keyless interpolation joins on. A keyframe holding a single mark
 * offers nothing to tell its rows apart by, so the compiler synthesizes a field
 * holding a constant. Every row in the frame then matches every row in the
 * next, and with one row on each side that pairs the mark with its successor.
 */
export const SINGLETON_KEY = 'animation_key';

export interface AnimationKey {
  /**
   * The field identifying a mark across keyframes, so the join can pair a mark
   * with itself in the next frame and tween it towards that position.
   * Undefined when the keyframe holds a single mark, which needs no field to
   * distinguish it.
   */
  field?: string;

  /**
   * Whether the last keyframe tweens back to the first rather than stopping.
   */
  loop?: boolean;
}

/**
 * The key an animated unit interpolates on, or undefined when the unit draws
 * each frame outright.
 *
 * Interpolation needs discrete keyframes to move between, so it applies to band
 * time scales. A linear time scale is already continuous, and offers no next
 * frame to head towards, because every instant is its own frame.
 */
export function animationKey(model: UnitModel): AnimationKey | undefined {
  if (!model.isAnimated) {
    return undefined;
  }

  const key = (model.encoding.time as TimeFieldDef<string>)?.key;
  if (!key) {
    return undefined;
  }

  // `true` asks for interpolation without giving a field. The keyframe holds
  // one mark, which needs no field to distinguish it.
  const normalized: AnimationKey = key === true ? {} : key;

  return model.getScaleComponent(TIME)?.get('type') === 'band' ? normalized : undefined;
}

/**
 * Signals locating the animation between the frame it is on and the frame it
 * is heading towards. Mark encodings interpolate along `anim_tween`, which runs
 * from 0 to 1 across the gap between the two frames.
 */
export function animationInterpolationSignals(model: UnitModel, selectionName: string): Signal[] {
  const key = animationKey(model);
  if (!key) {
    return [];
  }

  const domain = `${selectionName}_domain`;
  const timeScale = stringValue(model.scaleName(TIME));

  return [
    {name: MAX_EXTENT, init: `extent(${domain})[1]`},
    {name: T_INDEX, update: `indexof(${domain}, ${ANIM_VALUE})`},
    {
      // Past the last keyframe there is no successor to head towards. A looping
      // animation tweens back to the first frame, and the rest settle in place.
      name: ANIM_VALUE_NEXT,
      update: `${T_INDEX} < length(${domain}) - 1 ? ${domain}[${T_INDEX} + 1] : ${key.loop ? MIN_EXTENT : MAX_EXTENT}`,
    },
    {
      // How far the clock has travelled into the gap between the two frames.
      // Guarded because the two frames coincide at the end of a non-looping
      // animation, where the gap is zero and the ratio undefined.
      name: ANIM_TWEEN,
      update:
        `${ANIM_VALUE_NEXT} !== ${ANIM_VALUE} ? ` +
        `(${EASED_ANIM_CLOCK} - scale(${timeScale}, ${ANIM_VALUE})) / ` +
        `(scale(${timeScale}, ${ANIM_VALUE_NEXT}) - scale(${timeScale}, ${ANIM_VALUE})) : 0`,
    },
  ];
}

/**
 * Datasets that pair each mark in the current frame with the same mark in the
 * next one, so encodings have both endpoints of the tween available on a single
 * datum.
 *
 * A mark with no successor -- one that leaves the chart -- is dropped rather
 * than left frozen in place at the old position.
 */
export function animationInterpolationData(model: UnitModel, source: VgData): VgData[] {
  const key = animationKey(model);
  if (!key) {
    return [];
  }

  const name = source.name;
  const timeField = (model.encoding.time as TimeFieldDef<string>).field as string;
  const field = stringValue(timeField);

  // Layout transforms compute positions within a keyframe, so the derived
  // datasets need them too or the interpolated marks lay out against the whole
  // dataset instead of the frame.
  const layout = (source.transform ?? []).filter((t) => t.type === 'stack');

  // Without a key field the frame holds one mark, so a constant column stands in
  // for its identity and the join pairs the single row with its successor.
  const joinField = key.field ?? SINGLETON_KEY;
  const singleton: VgTransform[] = key.field ? [] : [{type: 'formula', expr: '0', as: SINGLETON_KEY}];

  return [
    {
      name: name + EQ,
      source: name,
      transform: [{type: 'filter', expr: `datum[${field}] === ${ANIM_VALUE}`}, ...layout, ...singleton],
    },
    {
      name: name + NEXT,
      source: name,
      transform: [{type: 'filter', expr: `datum[${field}] === ${ANIM_VALUE_NEXT}`}, ...layout, ...singleton],
    },
    {
      name: name + EQ_NEXT,
      source: name + EQ,
      transform: [
        {
          type: 'lookup',
          from: name + NEXT,
          key: joinField,
          fields: [joinField],
          as: ['next'],
        },
        {type: 'filter', expr: 'isValid(datum.next)'},
      ],
    },
    {
      name: name + INTERPOLATE,
      source: [name + CURR, name + EQ_NEXT],
      // Rows at the current frame come from the joined dataset, so they carry a
      // successor to tween towards. Rows at other frames -- which a cumulative
      // or windowed predicate admits -- pass through from the frame dataset and
      // are drawn where they are.
      transform: [
        {
          type: 'filter',
          expr: `datum[${field}] === ${ANIM_VALUE} ? isValid(datum.next) : true`,
        },
      ],
    },
  ];
}

/**
 * Rewrites a mark's scaled encodings to interpolate towards the next frame.
 *
 * This function interpolates positions after scaling. A band scale over
 * category names has no midpoint between two of its values, so interpolating
 * before scaling would leave those marks nowhere to travel through. Scaling
 * first gives every mark two pixel positions to slide between.
 */
export function interpolateMarkEncodings(model: UnitModel, encode: Record<string, any>, rescale: boolean): void {
  for (const channel of Object.keys(encode)) {
    let def = encode[channel];

    // Production rules compile to an array whose last entry is the default.
    if (Array.isArray(def)) {
      def = def[def.length - 1];
    }

    const {scale, field} = def ?? {};
    if (!field || typeof field !== 'string') {
      continue;
    }

    if (!scale) {
      // No scale to go through -- a projected geographic position, for
      // instance. The raw values are already in a space we can interpolate.
      encode[channel] = {
        signal: `isValid(datum.next) ? lerp([datum[${stringValue(field)}], datum.next[${stringValue(field)}]], ${ANIM_TWEEN}) : datum[${stringValue(field)}]`,
      };
      continue;
    }

    if (hasDiscreteRange(model.getScaleComponent(scale as any)?.get('type'))) {
      // Moving between an ordinal scale's outputs is not a continuous change;
      // leave the mark to switch at the frame boundary.
      continue;
    }

    // With rescaling, the next frame's position has to be read off the next
    // frame's scale -- otherwise the mark tweens towards where its successor
    // would have been under the current frame's domain.
    const nextScale = rescale ? `${scale}${NEXT}` : scale;
    const here = `scale(${stringValue(scale)}, datum[${stringValue(field)}])`;
    const there = `scale(${stringValue(nextScale)}, datum.next[${stringValue(field)}])`;

    encode[channel] = {
      signal: `isValid(datum.next) ? lerp([${here}, ${there}], ${ANIM_TWEEN}) : ${here}`,
    };
  }
}

/**
 * The main data source of an animated unit's frame datasets.
 */
export function animationSourceName(model: UnitModel): string {
  return model.lookupDataSource(model.getDataName(DataSourceType.Main));
}
