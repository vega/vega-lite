import { AxisConfigMixins } from './axis';
import { CompositeMarkConfigMixins } from './compositemark/index';
import { LegendConfig } from './legend';
import { MarkConfigMixins } from './mark';
import { ProjectionConfig } from './projection';
import { ScaleConfig } from './scale';
import { SelectionConfig } from './selection';
import { StackOffset } from './stack';
import { TopLevelProperties } from './toplevelprops';
import { VgMarkConfig, VgScheme, VgTitleConfig } from './vega.schema';
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
}
export declare const defaultViewConfig: ViewConfig;
export declare type RangeConfigValue = (number | string)[] | VgScheme | {
    step: number;
};
export interface RangeConfig {
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
    [name: string]: RangeConfigValue;
}
export interface VLOnlyConfig {
    /**
     * Default axis and legend title for count fields.
     *
     * __Default value:__ `'Number of Records'`.
     *
     * @type {string}
     */
    countTitle?: string;
    /**
     * Defines how Vega-Lite should handle invalid values (`null` and `NaN`).
     * - If set to `"filter"` (default), all data items with null values are filtered.
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
     * D3 Number format for axis labels and text tables. For example "s" for SI units. Use [D3's number format pattern](https://github.com/d3/d3-format#locale_format).
     */
    numberFormat?: string;
    /**
     * Default datetime format for axis and legend labels. The format can be set directly on each axis and legend. Use [D3's time format pattern](https://github.com/d3/d3-time-format#locale_format).
     *
     * __Default value:__ `'%b %d, %Y'`.
     *
     */
    timeFormat?: string;
    /** Default properties for [single view plots](spec.html#single). */
    view?: ViewConfig;
    /**
     * Scale configuration determines default properties for all [scales](scale.html). For a full list of scale configuration options, please see the [corresponding section of the scale documentation](scale.html#config).
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
export declare type AreaOverlay = 'line' | 'linepoint' | 'none';
export interface OverlayConfig {
    /**
     * Whether to overlay line with point.
     */
    line?: boolean;
    /**
     * Type of overlay for area mark (line or linepoint)
     */
    area?: AreaOverlay;
}
export interface Config extends TopLevelProperties, VLOnlyConfig, MarkConfigMixins, CompositeMarkConfigMixins, AxisConfigMixins {
    /**
     * An object hash that defines default range arrays or schemes for using with scales.
     * For a full list of scale range configuration options, please see the [corresponding section of the scale documentation](scale.html#config).
     */
    range?: RangeConfig;
    /**
     * Legend configuration, which determines default properties for all [legends](legend.html). For a full list of legend configuration options, please see the [corresponding section of in the legend documentation](legend.html#config).
     */
    legend?: LegendConfig;
    /**
     * Title configuration, which determines default properties for all [titles](title.html). For a full list of title configuration options, please see the [corresponding section of the title documentation](title.html#config).
     */
    title?: VgTitleConfig;
    /**
     * Projection configuration, which determines default properties for all [projections](projection.html). For a full list of projection configuration options, please see the [corresponding section of the projection documentation](projection.html#config).
     */
    projection?: ProjectionConfig;
    /** An object hash that defines key-value mappings to determine default properties for marks with a given [style](mark.html#mark-def).  The keys represent styles names; the value are valid [mark configuration objects](mark.html#config).  */
    style?: StyleConfigIndex;
    /**
     * @hide
     */
    overlay?: OverlayConfig;
}
export declare const defaultConfig: Config;
export declare function initConfig(config: Config): Config;
export declare function stripAndRedirectConfig(config: Config): Config;
