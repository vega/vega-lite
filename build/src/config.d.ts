import { AxisConfigMixins } from './axis';
import { CompositeMarkConfigMixins } from './compositemark/index';
import { LegendConfig } from './legend';
import { MarkConfigMixins } from './mark';
import { ScaleConfig } from './scale';
import { SelectionConfig } from './selection';
import { StackOffset } from './stack';
import { TopLevelProperties } from './toplevelprops';
import { VgMarkConfig, VgScheme, VgTitleConfig } from './vega.schema';
export interface CellConfig {
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
export declare const defaultCellConfig: CellConfig;
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
    invalidValues?: 'filter';
    /**
     * D3 Number format for axis labels and text tables. For example "s" for SI units.(in the form of [D3 number format pattern](https://github.com/mbostock/d3/wiki/Formatting)).
     *
     * __Default value:__ `"s"` (except for text marks that encode a count field, the default value is `"d"`).
     *
     */
    numberFormat?: string;
    /**
     * Default datetime format for axis and legend labels. The format can be set directly on each axis and legend. [D3 time format pattern](https://github.com/mbostock/d3/wiki/Time-Formatting)).
     *
     * __Default value:__ `'%b %d, %Y'`.
     *
     */
    timeFormat?: string;
    /** Cell Config */
    cell?: CellConfig;
    /** Scale Config */
    scale?: ScaleConfig;
    /** Selection Config */
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
     * Scale range config, or properties defining named range arrays
     * that can be used within scale range definitions
     * (such as `{"type": "ordinal", "range": "category"}`).
     * For default range that Vega-Lite adopts from Vega, see https://github.com/vega/vega-parser#scale-range-properties.
     */
    range?: RangeConfig;
    /** Legend Config */
    legend?: LegendConfig;
    /**
     * Title Config
     */
    title?: VgTitleConfig;
    /** Style Config */
    style?: StyleConfigIndex;
    /**
     * @hide
     */
    overlay?: OverlayConfig;
}
export declare const defaultConfig: Config;
export declare function initConfig(config: Config): Config;
export declare function stripAndRedirectConfig(config: Config): Config;
