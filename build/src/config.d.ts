import { AxisConfig } from './axis';
import { LegendConfig } from './legend';
import { BarConfig, MarkConfig, TextConfig, TickConfig } from './mark';
import { ScaleConfig } from './scale';
import { SelectionConfig } from './selection';
import { StackOffset } from './stack';
import { TopLevelProperties } from './toplevelprops';
import { VgRangeScheme } from './vega.schema';
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
export declare const defaultFacetCellConfig: CellConfig;
export interface FacetConfig {
    /** Facet Axis Config */
    axis?: AxisConfig;
    /** Facet Grid Config */
    grid?: FacetGridConfig;
    /** Facet Cell Config */
    cell?: CellConfig;
}
export interface FacetGridConfig {
    /**
     * Color of the grid between facets.
     */
    color?: string;
    /**
     * Opacity of the grid between facets.
     */
    opacity?: number;
    /**
     * Offset for grid between facets.
     */
    offset?: number;
}
export declare const defaultFacetConfig: FacetConfig;
export declare type AreaOverlay = 'line' | 'linepoint' | 'none';
export interface OverlayConfig {
    /**
     * Whether to overlay line with point.
     *
     * __Default value:__ `false`
     */
    line?: boolean;
    /**
     * Type of overlay for area mark (line or linepoint)
     */
    area?: AreaOverlay;
}
export declare const defaultOverlayConfig: OverlayConfig;
export declare type RangeConfig = (number | string)[] | VgRangeScheme | {
    step: number;
};
export interface Config extends TopLevelProperties {
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
    /**
     * Default axis and legend title for count fields.
     *
     * __Default value:__ `'Number of Records'`.
     *
     * @type {string}
     */
    countTitle?: string;
    /** Cell Config */
    cell?: CellConfig;
    /** Default stack offset for stackable mark. */
    stack?: StackOffset;
    /** Mark Config */
    mark?: MarkConfig;
    /** Area-Specific Config */
    area?: MarkConfig;
    /** Bar-Specific Config */
    bar?: BarConfig;
    /** Circle-Specific Config */
    circle?: MarkConfig;
    /** Line-Specific Config */
    line?: MarkConfig;
    /** Point-Specific Config */
    point?: MarkConfig;
    /** Rect-Specific Config */
    rect?: MarkConfig;
    /** Rule-Specific Config */
    rule?: MarkConfig;
    /** Square-Specific Config */
    square?: MarkConfig;
    /** Text-Specific Config */
    text?: TextConfig;
    /** Tick-Specific Config */
    tick?: TickConfig;
    /** Mark Overlay Config */
    overlay?: OverlayConfig;
    /** Scale Config */
    scale?: ScaleConfig;
    /**
     * Scale range config, or properties defining named range arrays
     * that can be used within scale range definitions
     * (such as `{"type": "ordinal", "range": "category"}`).
     * For default range that Vega-Lite adopts from Vega, see https://github.com/vega/vega-parser#scale-range-properties.
     */
    range?: {
        [name: string]: RangeConfig;
    };
    /** Generic axis config. */
    axis?: AxisConfig;
    /**
     * X-axis specific config.
     */
    axisX?: AxisConfig;
    /**
     * Y-axis specific config.
     */
    axisY?: AxisConfig;
    /**
     * Specific axis config for y-axis along the left edge of the chart.
     */
    axisLeft?: AxisConfig;
    /**
     * Specific axis config for y-axis along the right edge of the chart.
     */
    axisRight?: AxisConfig;
    /**
     * Specific axis config for x-axis along the top edge of the chart.
     */
    axisTop?: AxisConfig;
    /**
     * Specific axis config for x-axis along the bottom edge of the chart.
     */
    axixBottom?: AxisConfig;
    /**
     * Specific axis config for axes with "band" scales.
     */
    axisBand?: AxisConfig;
    /** Legend Config */
    legend?: LegendConfig;
    /** Facet Config */
    facet?: FacetConfig;
    /** Selection Config */
    selection?: SelectionConfig;
    /**
     * Whether to filter invalid values (`null` and `NaN`) from the data.
     * - By default (`undefined`), only quantitative and temporal fields are filtered.
     * - If set to `true`, all data items with null values are filtered.
     * - If `false`, all data items are included. In this case, null values will be interpret as zeroes.
     */
    filterInvalid?: boolean;
    [role: string]: any;
}
export declare const defaultConfig: Config;
export declare function initConfig(config: Config): any;
