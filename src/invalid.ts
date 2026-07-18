import type {SignalRef} from 'vega';
import {ScaleChannel} from './channel.js';
import {Mark, MarkDef} from './mark.js';
import {isObject} from 'vega-util';

/**
 * Mixins for Vega-Lite Spec's Mark Definiton (to add mark.invalid)
 */
export interface MarkInvalidMixins {
  /**
   * Invalid data mode, which defines how the marks and corresponding scales should represent invalid values (`null` and `NaN` in continuous scales *without* defined output for invalid values).
   *
   * - `"filter"` — *Exclude* all invalid values from the visualization's *marks* and *scales*.
   * For path marks (for line, area, trail), this option will create paths that connect valid points, as if the data rows with invalid values do not exist.
   *
   * - `"break-paths-filter-domains"` —
   * Break path marks (for line, area, trail) at invalid values.  For non-path marks, this is equivalent to `"filter"`.
   * All *scale* domains will *exclude* these filtered data points.
   *
   * - `"break-paths-show-domains"` —
   * Break paths (for line, area, trail) at invalid values.  Hide invalid values for non-path marks.
   * All *scale* domains will *include* these filtered data points (for both path and non-path marks).
   *
   * - `"show"` or `null` —
   * Show all data points in the marks and scale domains. Each scale will use the output for invalid values defined in `config.scale.invalid`
   * or, if unspecified, by default invalid values will produce the same visual values as zero (if the scale includes zero) or the minimum value (if the scale does not include zero).
   *
   * - `"break-paths-show-path-domains"` (default) —
   * This is equivalent to `"break-paths-show-domains"` for path-based marks (line/area/trail)
   * and `"filter"` for non-path marks.
   *
   * __Note__: If any channel's scale has an output for invalid values defined in `config.scale.invalid`,
   * all values for the scales will be considered "valid" since they can produce a reasonable output for the scales.
   * Thus, fields for such channels will not be filtered and will not cause path breaks.
   */
  invalid?: MarkInvalidDataMode | null;
}

export type MarkInvalidDataMode =
  | 'filter'
  | 'break-paths-filter-domains'
  | 'break-paths-show-domains'
  | 'break-paths-show-path-domains'
  | 'show';

/**
 * Mixins for Vega-Lite Spec's config.scale
 */
export interface ScaleInvalidDataConfigMixins {
  /**
   * An object that defines scale outputs per channel for invalid values (nulls and NaNs on a continuous scale).
   * - The keys in this object are the scale channels.
   * - The values is either `"zero-or-min"` (use zero if the scale includes zero or min value otherwise) or a value definition `{value: ...}`.
   *
   * _Example:_ Setting this `config.scale.invalid` property to `{color: {value: '#aaa'}}`
   * will make the visualization color all invalid values with '#aaa'.
   *
   * See [https://vega.github.io/vega-lite/docs/invalid-data.html](Invalid Data Docs) for more details.
   */
  invalid?: ScaleInvalidDataConfig;
}

export type ScaleInvalidDataConfig = {
  [c in ScaleChannel]?: ScaleInvalidDataShowAs<c>;
};

export type ScaleInvalidDataShowAs<C extends ScaleChannel> = ScaleInvalidDataShowAsValue<C> | 'zero-or-min';

export type ScaleInvalidDataShowAsValue<C extends ScaleChannel> = {
  value: MarkDef<Mark, SignalRef>[C];
};

export function isScaleInvalidDataIncludeAsValue<C extends ScaleChannel>(
  invalidDataMode: ScaleInvalidDataShowAs<C>,
): invalidDataMode is ScaleInvalidDataShowAsValue<C> {
  return isObject(invalidDataMode) && 'value' in invalidDataMode;
}
