import { ValueDef } from './fielddef';
import { VgEncodeChannel } from './vega.schema';
export interface Guide {
    /**
     * The formatting pattern for labels. This is D3's [number format pattern](https://github.com/d3/d3-format#locale_format) for quantitative fields and D3's [time format pattern](https://github.com/d3/d3-time-format#locale_format) for time field.
     *
     * See the [format documentation](format.html) for more information.
     *
     * __Default value:__  derived from [numberFormat](config.html#format) config for quantitative fields and from [timeFormat](config.html#format) config for temporal fields.
     */
    format?: string;
    /**
     * A title for the field. If `null`, the title will be removed.
     *
     * __Default value:__  derived from the field's name and transformation function (`aggregate`, `bin` and `timeUnit`).  If the field has an aggregate function, the function is displayed as a part of the title (e.g., `"Sum of Profit"`). If the field is binned or has a time unit applied, the applied function will be denoted in parentheses (e.g., `"Profit (binned)"`, `"Transaction Date (year-month)"`).  Otherwise, the title is simply the field name.
     *
     * __Note__: You can customize the default field title format by providing the [`fieldTitle` property in the [config](config.html) or [`fieldTitle` function via the `compile` function's options](compile.html#field-title).
     */
    title?: string | null;
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
    [k in VgEncodeChannel]?: ValueDef;
};
export declare const VL_ONLY_GUIDE_CONFIG: (keyof VlOnlyGuideConfig)[];
