import { Anchor, TitleOrient, VgMarkConfig, VgTitleConfig } from './vega.schema';
export interface TitleBase {
    /**
     * The orientation of the title relative to the chart. One of `"top"` (the default), `"bottom"`, `"left"`, or `"right"`.
     */
    orient?: TitleOrient;
    /**
     * The anchor position for placing the title. One of `"start"`, `"middle"`, or `"end"`. For example, with an orientation of top these anchor positions map to a left-, center-, or right-aligned title.
     *
     * __Default value:__ `"middle"` for [single](https://vega.github.io/vega-lite/docs/spec.html) and [layered](https://vega.github.io/vega-lite/docs/layer.html) views.
     * `"start"` for other composite views.
     *
     * __Note:__ [For now](https://github.com/vega/vega-lite/issues/2875), `anchor` is only customizable only for [single](https://vega.github.io/vega-lite/docs/spec.html) and [layered](https://vega.github.io/vega-lite/docs/layer.html) views.  For other composite views, `anchor` is always `"start"`.
     */
    anchor?: Anchor;
    /**
     * The orthogonal offset in pixels by which to displace the title from its position along the edge of the chart.
     */
    offset?: number;
    /**
     * A [mark style property](https://vega.github.io/vega-lite/docs/config.html#style) to apply to the title text mark.
     *
     * __Default value:__ `"group-title"`.
     */
    style?: string | string[];
}
export interface TitleParams extends TitleBase {
    /**
     * The title text.
     */
    text: string;
}
export declare function extractTitleConfig(titleConfig: VgTitleConfig): {
    mark: VgMarkConfig;
    nonMark: TitleBase;
};
