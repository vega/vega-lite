import {isString} from 'vega-util';
import {hasProperty} from './util.js';

export const AUTO = 'auto' as const;

export type AutoMark = typeof AUTO;

export const AUTO_PREFERRED_MARKS = ['point', 'line', 'area', 'bar', 'rule'] as const;

export type AutoPreferredMark = (typeof AUTO_PREFERRED_MARKS)[number];

export interface AutoMarkDef {
  /**
   * The mark type. For an automatically-chosen mark, this should always be `"auto"`.
   */
  type: AutoMark;

  /**
   * Constrains the family of mark that `auto` selects. One of `"point"`, `"line"`, `"area"`,
   * `"bar"`, or `"rule"`. When set, `auto` still determines the mark's orientation, baseline,
   * stacking, and any binning/aggregation, but always uses the requested family.
   *
   * __Note:__ `"area"` is only ever produced when explicitly requested via `prefer`.
   *
   * __Default value:__ Inferred from the encodings.
   */
  prefer?: AutoPreferredMark;
}

export function isAutoMarkDef(mark: unknown): mark is AutoMarkDef {
  return hasProperty(mark, 'type') && (mark as AutoMarkDef).type === AUTO;
}

export function isAutoMark(mark: unknown): mark is AutoMark | AutoMarkDef {
  return isString(mark) ? mark === AUTO : isAutoMarkDef(mark);
}

export function isAutoPreferredMark(prefer: unknown): prefer is AutoPreferredMark {
  return isString(prefer) && (AUTO_PREFERRED_MARKS as readonly string[]).includes(prefer);
}
