import {BaseTitle, SignalRef, Text, TextEncodeEntry, TitleAnchor} from 'vega';
import {isArray, isString} from 'vega-util';
import {ExprRef} from './expr';
import {MarkConfig} from './mark';
import {pick} from './util';
import {MapExcludeValueRefAndReplaceSignalWith, MappedExcludeValueRef} from './vega.schema';

export type BaseTitleNoValueRefs<ES extends ExprRef | SignalRef> = MapExcludeValueRefAndReplaceSignalWith<
  Omit<BaseTitle, 'align' | 'baseline'>,
  ES
> &
  // Since some logic depends on align/baseline, Vega-Lite does NOT allow signal for them.
  MappedExcludeValueRef<Pick<BaseTitle, 'align' | 'baseline'>>;

export type TitleConfig<ES extends ExprRef | SignalRef> = BaseTitleNoValueRefs<ES>;

export interface TitleBase<ES extends ExprRef | SignalRef> extends BaseTitleNoValueRefs<ES> {
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

export interface TitleParams<ES extends ExprRef | SignalRef> extends TitleBase<ES> {
  /**
   * The title text.
   */
  text: Text | ES;

  /**
   * The subtitle Text.
   */
  subtitle?: Text;
}

export function extractTitleConfig(titleConfig: TitleConfig<SignalRef>): {
  titleMarkConfig: MarkConfig<SignalRef>;
  subtitleMarkConfig: MarkConfig<SignalRef>;
  /** These are non-mark title config that need to be hardcoded in the title directive. */
  nonMarkTitleProperties: BaseTitleNoValueRefs<SignalRef>;
  subtitle: BaseTitleNoValueRefs<SignalRef>;
} {
  const {
    // These are non-mark title config that need to be hardcoded
    anchor,
    frame,
    offset,
    orient,
    angle,
    limit,

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

  const titleMarkConfig: MarkConfig<SignalRef> = {
    ...rest,
    ...(color ? {fill: color} : {})
  };

  // These are non-mark title config that need to be hardcoded
  const nonMarkTitleProperties: BaseTitleNoValueRefs<SignalRef> = {
    ...(anchor ? {anchor} : {}),
    ...(frame ? {frame} : {}),
    ...(offset ? {offset} : {}),
    ...(orient ? {orient} : {}),
    ...(angle !== undefined ? {angle} : {}),
    ...(limit !== undefined ? {limit} : {})
  };

  // subtitle part can stay in config.title since header titles do not use subtitle
  const subtitle: BaseTitleNoValueRefs<SignalRef> = {
    ...(subtitleColor ? {subtitleColor} : {}),
    ...(subtitleFont ? {subtitleFont} : {}),
    ...(subtitleFontSize ? {subtitleFontSize} : {}),
    ...(subtitleFontStyle ? {subtitleFontStyle} : {}),
    ...(subtitleFontWeight ? {subtitleFontWeight} : {}),
    ...(subtitleLineHeight ? {subtitleLineHeight} : {}),
    ...(subtitlePadding ? {subtitlePadding} : {})
  };

  const subtitleMarkConfig = pick(titleConfig, ['align', 'baseline', 'dx', 'dy', 'limit']);

  return {titleMarkConfig, subtitleMarkConfig, nonMarkTitleProperties, subtitle};
}

export function isText(v: any): v is Text {
  return isString(v) || (isArray(v) && isString(v[0]));
}
