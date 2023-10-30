import { BaseTitle, SignalRef, Text, TextEncodeEntry, TitleAnchor } from 'vega';
import { ExprRef } from './expr';
import { MarkConfig } from './mark';
import { MapExcludeValueRefAndReplaceSignalWith, MappedExcludeValueRef } from './vega.schema';
export type BaseTitleNoValueRefs<ES extends ExprRef | SignalRef> = MapExcludeValueRefAndReplaceSignalWith<Omit<BaseTitle, 'align' | 'baseline'>, ES> & MappedExcludeValueRef<Pick<BaseTitle, 'align' | 'baseline'>>;
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
export declare function extractTitleConfig(titleConfig: TitleConfig<SignalRef>): {
    titleMarkConfig: MarkConfig<SignalRef>;
    subtitleMarkConfig: MarkConfig<SignalRef>;
    /** These are non-mark title config that need to be hardcoded in the title directive. */
    nonMarkTitleProperties: BaseTitleNoValueRefs<SignalRef>;
    subtitle: BaseTitleNoValueRefs<SignalRef>;
};
export declare function isText(v: any): v is Text;
//# sourceMappingURL=title.d.ts.map