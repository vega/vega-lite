import {Field} from '../channeldef.js';
import {SelectionParameter, isSelectionParameter} from '../selection.js';
import {NormalizedLayerSpec, NormalizedSpec, NormalizedUnitSpec, TopLevel, UnitSpec} from '../spec/index.js';
import {SpecMapper} from '../spec/map.js';
import {NormalizerParams} from './base.js';

/** The parameter a bare `time` encoding elaborates into. */
export const ANIMATION_FRAME = 'animation_frame';

/**
 * Whether a parameter drives an animation. This test reads the parameter's own
 * shape rather than asking the selection compiler, because normalization runs
 * before parsing.
 */
function isAnimationParameter(param: any): boolean {
  if (!isSelectionParameter(param)) return false;
  const {select} = param as SelectionParameter;
  const on = typeof select === 'string' ? undefined : select.on;
  return on === 'timer' || (on as any)?.type === 'timer';
}

/**
 * Whether any view in the spec already animates. Elaboration supplies a missing
 * parameter and leaves a declared one exactly as the author wrote it.
 */
function hasAnimationParameter(spec: any): boolean {
  if (!spec || typeof spec !== 'object') return false;
  if (Array.isArray(spec.params) && spec.params.some(isAnimationParameter)) return true;
  for (const key of ['layer', 'concat', 'vconcat', 'hconcat'] as const) {
    if (Array.isArray(spec[key]) && spec[key].some(hasAnimationParameter)) return true;
  }
  for (const key of ['spec', 'facet'] as const) {
    if (spec[key] && hasAnimationParameter(spec[key])) return true;
  }
  return false;
}

/**
 * Elaborates a `time` encoding into the parameter and filter that drive it.
 *
 * A `time` encoding names the field an animation runs over. From that field
 * this normalizer derives a timer parameter over the same field and a filter
 * keeping the frame that parameter holds. A spec that declares only the
 * encoding therefore compiles to the same Vega as one that writes both out.
 *
 * Every animated view receives the same parameter name, so the views share one
 * store and advance on one clock. The animation's signals are top-level and
 * unprefixed, so a view runs exactly one clock however its parameters are
 * named. Distinct names would suggest that two views can reach different
 * frames, which the compiler cannot arrange.
 */
export class TimeEncodingNormalizer extends SpecMapper<NormalizerParams, NormalizedUnitSpec> {
  public map(spec: TopLevel<NormalizedSpec>, normParams: NormalizerParams): TopLevel<NormalizedSpec> {
    // This flag covers the whole spec, so compute it once. `map` re-enters for
    // every child of a concat, and a parameter declared anywhere in the view
    // suppresses elaboration everywhere. A per-child computation would read
    // only that child and elaborate around a parameter its sibling declared.
    normParams.elaborateTimeEncoding ??= !hasAnimationParameter(spec);
    return super.map(spec, normParams);
  }

  public mapUnit(spec: UnitSpec<Field>, normParams: NormalizerParams): NormalizedUnitSpec | NormalizedLayerSpec {
    if (!normParams.elaborateTimeEncoding || !(spec.encoding as any)?.time) {
      return spec as NormalizedUnitSpec;
    }

    const param: SelectionParameter = {
      name: ANIMATION_FRAME,
      select: {type: 'point', on: 'timer'},
    };

    return {
      ...spec,
      params: [...(spec.params ?? []), param],
      transform: [...(spec.transform ?? []), {filter: {param: ANIMATION_FRAME}}],
    } as NormalizedUnitSpec;
  }
}
