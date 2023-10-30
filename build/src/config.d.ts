import { Color, InitSignal, Locale, NewSignal, RangeConfig, RangeScheme, SignalRef } from 'vega';
import { Axis, AxisConfigMixins } from './axis';
import { CompositeMarkConfigMixins } from './compositemark';
import { ExprRef } from './expr';
import { HeaderConfigMixins } from './header';
import { LegendConfig } from './legend';
import { AnyMarkConfig, MarkConfig, MarkConfigMixins } from './mark';
import { ProjectionConfig } from './projection';
import { ScaleConfig } from './scale';
import { SelectionConfig } from './selection';
import { BaseViewBackground, CompositionConfigMixins } from './spec/base';
import { TopLevelProperties } from './spec/toplevel';
import { TitleConfig } from './title';
export interface ViewConfig<ES extends ExprRef | SignalRef> extends BaseViewBackground<ES> {
    /**
     * The default width when the plot has a continuous field for x or longitude, or has arc marks.
     *
     * __Default value:__ `200`
     */
    continuousWidth?: number;
    /**
     * The default width when the plot has non-arc marks and either a discrete x-field or no x-field.
     * The width can be either a number indicating a fixed width or an object in the form of `{step: number}` defining the width per discrete step.
     *
     * __Default value:__ a step size based on `config.view.step`.
     */
    discreteWidth?: number | {
        step: number;
    };
    /**
     * The default height when the plot has a continuous y-field for x or latitude, or has arc marks.
     *
     * __Default value:__ `200`
     */
    continuousHeight?: number;
    /**
     * The default height when the plot has non arc marks and either a discrete y-field or no y-field.
     * The height can be either a number indicating a fixed height or an object in the form of `{step: number}` defining the height per discrete step.
     *
     * __Default value:__ a step size based on `config.view.step`.
     */
    discreteHeight?: number | {
        step: number;
    };
    /**
     * Default step size for x-/y- discrete fields.
     */
    step?: number;
    /**
     * Whether the view should be clipped.
     */
    clip?: boolean;
}
export declare function getViewConfigContinuousSize<ES extends ExprRef | SignalRef>(viewConfig: ViewConfig<ES>, channel: 'width' | 'height'): any;
export declare function getViewConfigDiscreteStep<ES extends ExprRef | SignalRef>(viewConfig: ViewConfig<ES>, channel: 'width' | 'height'): number;
export declare function getViewConfigDiscreteSize<ES extends ExprRef | SignalRef>(viewConfig: ViewConfig<ES>, channel: 'width' | 'height'): any;
export declare const DEFAULT_STEP = 20;
export declare const defaultViewConfig: ViewConfig<SignalRef>;
export declare function isVgScheme(rangeScheme: string[] | RangeScheme): rangeScheme is RangeScheme;
export type ColorConfig = Record<string, Color>;
export type FontSizeConfig = Record<string, number>;
export interface FormatConfig {
    /**
     * If numberFormatType is not specified,
     * D3 number format for guide labels, text marks, and tooltips of non-normalized fields (fields *without* `stack: "normalize"`). For example `"s"` for SI units.
     * Use [D3's number format pattern](https://github.com/d3/d3-format#locale_format).
     *
     * If `config.numberFormatType` is specified and `config.customFormatTypes` is `true`, this value will be passed as `format` alongside `datum.value` to the `config.numberFormatType` function.
     */
    numberFormat?: string;
    /**
     * [Custom format type](https://vega.github.io/vega-lite/docs/config.html#custom-format-type)
     * for `config.numberFormat`.
     *
     * __Default value:__ `undefined` -- This is equilvalent to call D3-format, which is exposed as [`format` in Vega-Expression](https://vega.github.io/vega/docs/expressions/#format).
     * __Note:__ You must also set `customFormatTypes` to `true` to use this feature.
     */
    numberFormatType?: string;
    /**
     * If normalizedNumberFormatType is not specified,
     * D3 number format for axis labels, text marks, and tooltips of normalized stacked fields (fields with `stack: "normalize"`). For example `"s"` for SI units.
     * Use [D3's number format pattern](https://github.com/d3/d3-format#locale_format).
     *
     * If `config.normalizedNumberFormatType` is specified and `config.customFormatTypes` is `true`, this value will be passed as `format` alongside `datum.value` to the `config.numberFormatType` function.
     * __Default value:__ `%`
     */
    normalizedNumberFormat?: string;
    /**
     * [Custom format type](https://vega.github.io/vega-lite/docs/config.html#custom-format-type)
     * for `config.normalizedNumberFormat`.
     *
     * __Default value:__ `undefined` -- This is equilvalent to call D3-format, which is exposed as [`format` in Vega-Expression](https://vega.github.io/vega/docs/expressions/#format).
     * __Note:__ You must also set `customFormatTypes` to `true` to use this feature.
     */
    normalizedNumberFormatType?: string;
    /**
     * Default time format for raw time values (without time units) in text marks, legend labels and header labels.
     *
     * __Default value:__ `"%b %d, %Y"`
     * __Note:__ Axes automatically determine the format for each label automatically so this config does not affect axes.
     */
    timeFormat?: string;
    /**
     * [Custom format type](https://vega.github.io/vega-lite/docs/config.html#custom-format-type)
     * for `config.timeFormat`.
     *
     * __Default value:__ `undefined` -- This is equilvalent to call D3-time-format, which is exposed as [`timeFormat` in Vega-Expression](https://vega.github.io/vega/docs/expressions/#timeFormat).
     * __Note:__ You must also set `customFormatTypes` to `true` and there must *not* be a `timeUnit` defined to use this feature.
     */
    timeFormatType?: string;
}
export interface VLOnlyConfig<ES extends ExprRef | SignalRef> extends FormatConfig {
    /**
     * Default font for all text marks, titles, and labels.
     */
    font?: string;
    /**
     * Default color signals.
     *
     * @hidden
     */
    color?: boolean | ColorConfig;
    /**
     * Default font size signals.
     *
     * @hidden
     */
    fontSize?: boolean | FontSizeConfig;
    /**
     * Default axis and legend title for count fields.
     *
     * __Default value:__ `'Count of Records`.
     *
     * @type {string}
     */
    countTitle?: string;
    /**
     * Defines how Vega-Lite generates title for fields. There are three possible styles:
     * - `"verbal"` (Default) - displays function in a verbal style (e.g., "Sum of field", "Year-month of date", "field (binned)").
     * - `"function"` - displays function using parentheses and capitalized texts (e.g., "SUM(field)", "YEARMONTH(date)", "BIN(field)").
     * - `"plain"` - displays only the field name without functions (e.g., "field", "date", "field").
     */
    fieldTitle?: 'verbal' | 'functional' | 'plain';
    /**
     * Allow the `formatType` property for text marks and guides to accept a custom formatter function [registered as a Vega expression](https://vega.github.io/vega-lite/usage/compile.html#format-type).
     */
    customFormatTypes?: boolean;
    /**
     * Define [custom format configuration](https://vega.github.io/vega-lite/docs/config.html#format) for tooltips. If unspecified, default format config will be applied.
     */
    tooltipFormat?: FormatConfig;
    /** Default properties for [single view plots](https://vega.github.io/vega-lite/docs/spec.html#single). */
    view?: ViewConfig<ES>;
    /**
     * Scale configuration determines default properties for all [scales](https://vega.github.io/vega-lite/docs/scale.html). For a full list of scale configuration options, please see the [corresponding section of the scale documentation](https://vega.github.io/vega-lite/docs/scale.html#config).
     */
    scale?: ScaleConfig<ES>;
    /** An object hash for defining default properties for each type of selections. */
    selection?: SelectionConfig;
}
export type StyleConfigIndex<ES extends ExprRef | SignalRef> = Partial<Record<string, AnyMarkConfig<ES> | Axis<ES>>> & MarkConfigMixins<ES> & {
    /**
     * Default style for axis, legend, and header titles.
     */
    'guide-title'?: MarkConfig<ES>;
    /**
     * Default style for axis, legend, and header labels.
     */
    'guide-label'?: MarkConfig<ES>;
    /**
     * Default style for chart titles
     */
    'group-title'?: MarkConfig<ES>;
    /**
     * Default style for chart subtitles
     */
    'group-subtitle'?: MarkConfig<ES>;
};
export interface Config<ES extends ExprRef | SignalRef = ExprRef | SignalRef> extends TopLevelProperties<ES>, VLOnlyConfig<ES>, MarkConfigMixins<ES>, CompositeMarkConfigMixins, AxisConfigMixins<ES>, HeaderConfigMixins<ES>, CompositionConfigMixins {
    /**
     * An object hash that defines default range arrays or schemes for using with scales.
     * For a full list of scale range configuration options, please see the [corresponding section of the scale documentation](https://vega.github.io/vega-lite/docs/scale.html#config).
     */
    range?: RangeConfig;
    /**
     * Legend configuration, which determines default properties for all [legends](https://vega.github.io/vega-lite/docs/legend.html). For a full list of legend configuration options, please see the [corresponding section of in the legend documentation](https://vega.github.io/vega-lite/docs/legend.html#config).
     */
    legend?: LegendConfig<ES>;
    /**
     * Title configuration, which determines default properties for all [titles](https://vega.github.io/vega-lite/docs/title.html). For a full list of title configuration options, please see the [corresponding section of the title documentation](https://vega.github.io/vega-lite/docs/title.html#config).
     */
    title?: TitleConfig<ES>;
    /**
     * Projection configuration, which determines default properties for all [projections](https://vega.github.io/vega-lite/docs/projection.html). For a full list of projection configuration options, please see the [corresponding section of the projection documentation](https://vega.github.io/vega-lite/docs/projection.html#config).
     */
    projection?: ProjectionConfig;
    /** An object hash that defines key-value mappings to determine default properties for marks with a given [style](https://vega.github.io/vega-lite/docs/mark.html#mark-def). The keys represent styles names; the values have to be valid [mark configuration objects](https://vega.github.io/vega-lite/docs/mark.html#config). */
    style?: StyleConfigIndex<ES>;
    /**
     * A delimiter, such as a newline character, upon which to break text strings into multiple lines. This property provides a global default for text marks, which is overridden by mark or style config settings, and by the lineBreak mark encoding channel. If signal-valued, either string or regular expression (regexp) values are valid.
     */
    lineBreak?: string | ES;
    /**
     * A boolean flag indicating if ARIA default attributes should be included for marks and guides (SVG output only). If false, the `"aria-hidden"` attribute will be set for all guides, removing them from the ARIA accessibility tree and Vega-Lite will not generate default descriptions for marks.
     *
     * __Default value:__ `true`.
     */
    aria?: boolean;
    /**
     * Locale definitions for string parsing and formatting of number and date values. The locale object should contain `number` and/or `time` properties with [locale definitions](https://vega.github.io/vega/docs/api/locale/). Locale definitions provided in the config block may be overridden by the View constructor locale option.
     */
    locale?: Locale;
    /**
     * @hidden
     */
    signals?: (InitSignal | NewSignal)[];
}
export declare const defaultConfig: Config<SignalRef>;
export declare const DEFAULT_FONT_SIZE: {
    text: number;
    guideLabel: number;
    guideTitle: number;
    groupTitle: number;
    groupSubtitle: number;
};
export declare const DEFAULT_COLOR: {
    blue: string;
    orange: string;
    red: string;
    teal: string;
    green: string;
    yellow: string;
    purple: string;
    pink: string;
    brown: string;
    gray0: string;
    gray1: string;
    gray2: string;
    gray3: string;
    gray4: string;
    gray5: string;
    gray6: string;
    gray7: string;
    gray8: string;
    gray9: string;
    gray10: string;
    gray11: string;
    gray12: string;
    gray13: string;
    gray14: string;
    gray15: string;
};
export declare function colorSignalConfig(color?: boolean | ColorConfig): Config;
export declare function fontSizeSignalConfig(fontSize: boolean | FontSizeConfig): Config;
export declare function fontConfig(font: string): Config;
/**
 * Merge specified config with default config and config for the `color` flag,
 * then replace all expressions with signals
 */
export declare function initConfig(specifiedConfig?: Config): Config<SignalRef>;
export declare function stripAndRedirectConfig(config: Config<SignalRef>): Config<SignalRef>;
//# sourceMappingURL=config.d.ts.map