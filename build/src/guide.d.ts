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
     * A title for the field.
     *
     * __Default value:__  derived from the field's name and transformation function (`aggregate`, `bin` and `timeUnit`).  If the field has a function, the function is displayed as an all capped text with parentheses wrapping the field name (e.g., `"SUM(field_name)"`, `"BIN(field_name)"`, `"YEAR(field_name)"`).  Otherwise, the title is simply the field name.
     */
    title?: string;
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
