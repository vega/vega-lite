import {BaseTitle, Text, TextEncodeEntry, TitleAnchor} from 'vega';
import {isArray, isString} from 'vega-util';
import {MarkConfig} from './mark';
import {pick} from './util';
import {ExcludeMappedValueRef, ExcludeMappedValueRefButKeepSignal} from './vega.schema';

export type BaseTitleNoValueRefs = ExcludeMappedValueRefButKeepSignal<Omit<BaseTitle, 'align' | 'baseline'>> &
  // Since some logic depends on align/baseline, Vega-Lite does NOT allow signal for them.
  ExcludeMappedValueRef<Pick<BaseTitle, 'align' | 'baseline'>>;

export type TitleConfig = BaseTitleNoValueRefs;

export interface TitleBase extends BaseTitleNoValueRefs {
  /**
   * The anchor position for placing the title. One of `"start"`, `"middle"`, or `"end"`. For example, with an orientation of top these anchor positions map to a left-, center-, or right-aligned title.
   *
   * __Default value:__ `"middle"` for [single](https://vega.github.io/vega-lite/docs/spec.html) and [layered](https://vega.github.io/vega-lite/docs/layer.html) views.
   * `"start"` for other composite views.
   *
   * __Note:__ [For now](https://github.com/vega/vega-lite/issues/2875), `anchor` is only customizable only for [single](https://vega.github.io/vega-lite/docs/spec.html) and [layered](https://vega.github.io/vega-lite/docs/layer.html) views. For other composite views, `anchor` is always `"start"`.
   */
  anchor?: TitleAnchor;

  /**
   * A [mark style property](https://vega.github.io/vega-lite/docs/config.html#style) to apply to the title text mark.
   *
   * __Default value:__ `"group-title"`.
   */
  style?: string | string[];

  /**
   * 	The integer z-index indicating the layering of the title group relative to other axis, mark and legend groups.
   *
   * __Default value:__ `0`.
   *
   * @TJS-type integer
   * @minimum 0
   */
  zindex?: number;

  /**
   * Mark definitions for custom encoding.
   *
   * @hidden
   */
  encoding?: TextEncodeEntry;
}

export interface TitleParams extends TitleBase {
  /**
   * The title text.
   */
  text: Text;

  /**
   * The subtitle Text.
   */
  subtitle?: Text;
}

export function extractTitleConfig(
  titleConfig: TitleConfig
): {
  titleMarkConfig: MarkConfig;
  subtitleMarkConfig: MarkConfig;
  nonMark: BaseTitleNoValueRefs;
  subtitle: BaseTitleNoValueRefs;
} {
  const {
    // These are non-mark title config that need to be hardcoded
    anchor,
    frame,
    offset,
    orient,

    // color needs to be redirect to fill
    color,

    // subtitle properties
    subtitleColor,
    subtitleFont,
    subtitleFontSize,
    subtitleFontStyle,
    subtitleFontWeight,
    subtitleLineHeight,
    subtitlePadding,

    // The rest are mark config.
    ...rest
  } = titleConfig;

  const titleMarkConfig: MarkConfig = {
    ...rest,
    ...(color ? {fill: color} : {})
  };

  // These are non-mark title config that need to be hardcoded
  const nonMark: BaseTitleNoValueRefs = {
    ...(anchor ? {anchor} : {}),
    ...(frame ? {frame} : {}),
    ...(offset ? {offset} : {}),
    ...(orient ? {orient} : {})
  };

  // subtitle part can stay in config.title since header titles do not use subtitle
  const subtitle: BaseTitleNoValueRefs = {
    ...(subtitleColor ? {subtitleColor} : {}),
    ...(subtitleFont ? {subtitleFont} : {}),
    ...(subtitleFontSize ? {subtitleFontSize} : {}),
    ...(subtitleFontStyle ? {subtitleFontStyle} : {}),
    ...(subtitleFontWeight ? {subtitleFontWeight} : {}),
    ...(subtitleLineHeight ? {subtitleLineHeight} : {}),
    ...(subtitlePadding ? {subtitlePadding} : {})
  };

  const subtitleMarkConfig = pick(titleMarkConfig, ['align', 'baseline', 'dx', 'dy', 'limit']);

  return {titleMarkConfig, subtitleMarkConfig, nonMark, subtitle};
}

export function isText(v: any): v is Text {
  return isString(v) || (isArray(v) && isString(v[0]));
}
