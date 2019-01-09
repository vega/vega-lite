import { AxisConfigMixins } from './axis';
import { CompositeMarkConfigMixins } from './compositemark';
import { HeaderConfig } from './header';
import { LegendConfig } from './legend';
import { MarkConfigMixins } from './mark';
import { ProjectionConfig } from './projection';
import { ScaleConfig } from './scale';
import { SelectionConfig } from './selection';
import { TopLevelProperties } from './spec/toplevel';
import { StackOffset } from './stack';
import { TitleConfig } from './title';
import { StrokeJoin, VgMarkConfig, VgScheme } from './vega.schema';
export interface ViewConfig {
    /**
     * The default width of the single plot or each plot in a trellis plot when the visualization has a continuous (non-ordinal) x-scale or ordinal x-scale with `rangeStep` = `null`.
     *
     * __Default value:__ `200`
     *
     */
    width?: number;
    /**
     * The default height of the single plot or each plot in a trellis plot when the visualization has a continuous (non-ordinal) y-scale with `rangeStep` = `null`.
     *
     * __Default value:__ `200`
     *
     */
    height?: number;
    /**
     * Whether the view should be clipped.
     */
    clip?: boolean;
    /**
     * The fill color.
     *
     * __Default value:__ (none)
     *
     */
    fill?: string;
    /**
     * The fill opacity (value between [0,1]).
     *
     * __Default value:__ (none)
     *
     */
    fillOpacity?: number;
    /**
     * The stroke color.
     *
     * __Default value:__ (none)
     *
     */
    stroke?: string;
    /**
     * The stroke opacity (value between [0,1]).
     *
     * __Default value:__ (none)
     *
     */
    strokeOpacity?: number;
    /**
     * The stroke width, in pixels.
     *
     * __Default value:__ (none)
     *
     */
    strokeWidth?: number;
    /**
     * An array of alternating stroke, space lengths for creating dashed or dotted lines.
     *
     * __Default value:__ (none)
     *
     */
    strokeDash?: number[];
    /**
     * The offset (in pixels) into which to begin drawing with the stroke dash array.
     *
     * __Default value:__ (none)
     *
     */
    strokeDashOffset?: number;
    /**
     * The stroke line join method. One of miter (default), round or bevel.
     *
     * __Default value:__ 'miter'
     *
     */
    strokeJoin?: StrokeJoin;
    /**
     * The stroke line join method. One of miter (default), round or bevel.
     *
     * __Default value:__ 'miter'
     *
     */
    strokeMiterLimit?: number;
}
export declare const defaultViewConfig: ViewConfig;
export declare type RangeConfigValue = (number | string)[] | VgScheme | {
    step: number;
};
export declare type RangeConfig = RangeConfigProps & {
    [name: string]: RangeConfigValue;
};
export interface RangeConfigProps {
    /**
     * Default range for _nominal_ (categorical) fields.
     */
    category?: string[] | VgScheme;
    /**
     * Default range for diverging _quantitative_ fields.
     */
    diverging?: string[] | VgScheme;
    /**
     * Default range for _quantitative_ heatmaps.
     */
    heatmap?: string[] | VgScheme;
    /**
     * Default range for _ordinal_ fields.
     */
    ordinal?: string[] | VgScheme;
    /**
     * Default range for _quantitative_ and _temporal_ fields.
     */
    ramp?: string[] | VgScheme;
    /**
     * Default range palette for the `shape` channel.
     */
    symbol?: string[];
}
export declare function isVgScheme(rangeConfig: string[] | VgScheme): rangeConfig is VgScheme;
export interface VLOnlyConfig {
    /**
     * Default axis and legend title for count fields.
     *
     * __Default value:__ `'Count of Records`.
     *
     * @type {string}
     */
    countTitle?: string;
    /**
     * Defines how Vega-Lite should handle invalid values (`null` and `NaN`).
     * - If set to `"filter"` (default), all data items with null values will be skipped (for line, trail, and area marks) or filtered (for other marks).
     * - If `null`, all data items are included. In this case, invalid values will be interpreted as zeroes.
     */
    invalidValues?: 'filter' | null;
    /**
     * Defines how Vega-Lite generates title for fields.  There are three possible styles:
     * - `"verbal"` (Default) - displays function in a verbal style (e.g., "Sum of field", "Year-month of date", "field (binned)").
     * - `"function"` - displays function using parentheses and capitalized texts (e.g., "SUM(field)", "YEARMONTH(date)", "BIN(field)").
     * - `"plain"` - displays only the field name without functions (e.g., "field", "date", "field").
     */
    fieldTitle?: 'verbal' | 'functional' | 'plain';
    /**
     * D3 Number format for guide labels and text marks. For example "s" for SI units. Use [D3's number format pattern](https://github.com/d3/d3-format#locale_format).
     */
    numberFormat?: string;
    /**
     * Default time format for raw time values (without time units) in text marks, legend labels and header labels.
     *
     * __Default value:__ `"%b %d, %Y"`
     * __Note:__ Axes automatically determine format each label automatically so this config would not affect axes.
     */
    timeFormat?: string;
    /** Default properties for [single view plots](https://vega.github.io/vega-lite/docs/spec.html#single). */
    view?: ViewConfig;
    /**
     * Scale configuration determines default properties for all [scales](https://vega.github.io/vega-lite/docs/scale.html). For a full list of scale configuration options, please see the [corresponding section of the scale documentation](https://vega.github.io/vega-lite/docs/scale.html#config).
     */
    scale?: ScaleConfig;
    /** An object hash for defining default properties for each type of selections. */
    selection?: SelectionConfig;
    /** Default stack offset for stackable mark. */
    stack?: StackOffset;
}
export interface StyleConfigIndex {
    [style: string]: VgMarkConfig;
}
export interface Config extends TopLevelProperties, VLOnlyConfig, MarkConfigMixins, CompositeMarkConfigMixins, AxisConfigMixins {
    /**
     * An object hash that defines default range arrays or schemes for using with scales.
     * For a full list of scale range configuration options, please see the [corresponding section of the scale documentation](https://vega.github.io/vega-lite/docs/scale.html#config).
     */
    range?: RangeConfig;
    /**
     * Legend configuration, which determines default properties for all [legends](https://vega.github.io/vega-lite/docs/legend.html). For a full list of legend configuration options, please see the [corresponding section of in the legend documentation](https://vega.github.io/vega-lite/docs/legend.html#config).
     */
    legend?: LegendConfig;
    /**
     * Header configuration, which determines default properties for all [header](https://vega.github.io/vega-lite/docs/header.html). For a full list of header configuration options, please see the [corresponding section of in the header documentation](https://vega.github.io/vega-lite/docs/header.html#config).
     */
    header?: HeaderConfig;
    /**
     * Title configuration, which determines default properties for all [titles](https://vega.github.io/vega-lite/docs/title.html). For a full list of title configuration options, please see the [corresponding section of the title documentation](https://vega.github.io/vega-lite/docs/title.html#config).
     */
    title?: TitleConfig;
    /**
     * Projection configuration, which determines default properties for all [projections](https://vega.github.io/vega-lite/docs/projection.html). For a full list of projection configuration options, please see the [corresponding section of the projection documentation](https://vega.github.io/vega-lite/docs/projection.html#config).
     */
    projection?: ProjectionConfig;
    /** An object hash that defines key-value mappings to determine default properties for marks with a given [style](https://vega.github.io/vega-lite/docs/mark.html#mark-def).  The keys represent styles names; the values have to be valid [mark configuration objects](https://vega.github.io/vega-lite/docs/mark.html#config).  */
    style?: StyleConfigIndex;
}
export declare const defaultConfig: Config;
export declare function initConfig(config: Config): Config;
export declare function stripAndRedirectConfig(config: Config): Config;
