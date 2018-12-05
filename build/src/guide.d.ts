import { ConditionValueDefMixins, ValueDef } from './fielddef';
import { LegendConfig } from './legend';
import { VgEncodeChannel } from './vega.schema';
export interface TitleMixins {
    /**
     * A title for the field. If `null`, the title will be removed.
     *
     * __Default value:__  derived from the field's name and transformation function (`aggregate`, `bin` and `timeUnit`).  If the field has an aggregate function, the function is displayed as part of the title (e.g., `"Sum of Profit"`). If the field is binned or has a time unit applied, the applied function is shown in parentheses (e.g., `"Profit (binned)"`, `"Transaction Date (year-month)"`).  Otherwise, the title is simply the field name.
     *
     * __Notes__:
     *
     * 1) You can customize the default field title format by providing the [`fieldTitle`](https://vega.github.io/vega-lite/docs/config.html#top-level-config) property in the [config](https://vega.github.io/vega-lite/docs/config.html) or [`fieldTitle` function via the `compile` function's options](https://vega.github.io/vega-lite/docs/compile.html#field-title).
     *
     * 2) If both field definition's `title` and axis, header, or legend `title` are defined, axis/header/legend title will be used.
     */
    title?: string | null;
}
export interface Guide extends TitleMixins {
    /**
     * The formatting pattern for labels. This is D3's [number format pattern](https://github.com/d3/d3-format#locale_format) for quantitative fields and D3's [time format pattern](https://github.com/d3/d3-time-format#locale_format) for time field.
     *
     * See the [format documentation](https://vega.github.io/vega-lite/docs/format.html) for more information.
     *
     * __Default value:__  derived from [numberFormat](https://vega.github.io/vega-lite/docs/config.html#format) config for quantitative fields and from [timeFormat](https://vega.github.io/vega-lite/docs/config.html#format) config for temporal fields.
     */
    format?: string;
}
export interface VlOnlyGuideConfig {
    /**
     * Whether month names and weekday names should be abbreviated.
     *
     * __Default value:__  `false`
     */
    shortTimeLabels?: boolean;
}
export declare type GuideEncodingEntry = {
    [k in VgEncodeChannel]?: ValueDef & ConditionValueDefMixins;
};
export declare const VL_ONLY_GUIDE_CONFIG: (keyof VlOnlyGuideConfig)[];
export declare const VL_ONLY_LEGEND_CONFIG: (keyof LegendConfig)[];
