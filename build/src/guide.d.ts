import { SignalRef, Text } from 'vega';
import { ConditionValueDefMixins, FormatMixins, ValueDef } from './channeldef';
import { LegendConfig } from './legend';
import { VgEncodeChannel } from './vega.schema';
export interface TitleMixins {
    /**
     * A title for the field. If `null`, the title will be removed.
     *
     * __Default value:__  derived from the field's name and transformation function (`aggregate`, `bin` and `timeUnit`). If the field has an aggregate function, the function is displayed as part of the title (e.g., `"Sum of Profit"`). If the field is binned or has a time unit applied, the applied function is shown in parentheses (e.g., `"Profit (binned)"`, `"Transaction Date (year-month)"`). Otherwise, the title is simply the field name.
     *
     * __Notes__:
     *
     * 1) You can customize the default field title format by providing the [`fieldTitle`](https://vega.github.io/vega-lite/docs/config.html#top-level-config) property in the [config](https://vega.github.io/vega-lite/docs/config.html) or [`fieldTitle` function via the `compile` function's options](https://vega.github.io/vega-lite/usage/compile.html#field-title).
     *
     * 2) If both field definition's `title` and axis, header, or legend `title` are defined, axis/header/legend title will be used.
     */
    title?: Text | null | SignalRef;
}
export interface Guide extends TitleMixins, FormatMixins {
}
export interface VlOnlyGuideConfig {
    /**
     * Set to null to disable title for the axis, legend, or header.
     */
    title?: null;
}
export type GuideEncodingConditionalValueDef = ValueDef & ConditionValueDefMixins;
export type GuideEncodingEntry = Partial<Record<VgEncodeChannel, GuideEncodingConditionalValueDef>>;
export declare const VL_ONLY_LEGEND_CONFIG: (keyof LegendConfig<any>)[];
//# sourceMappingURL=guide.d.ts.map