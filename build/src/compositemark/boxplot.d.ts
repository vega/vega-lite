import { Config } from '../config';
import { Encoding } from './../encoding';
import { MarkConfig } from './../mark';
import { GenericUnitSpec, NormalizedLayerSpec } from './../spec';
import { Orient } from './../vega.schema';
export declare const BOXPLOT: 'box-plot';
export declare type BOXPLOT = typeof BOXPLOT;
export declare type BoxPlotStyle = 'boxWhisker' | 'box' | 'boxMid';
export interface BoxPlotDef {
    /**
     * Type of the mark.  For box plots, this should always be `"box-plot"`.
     * [boxplot](https://vega.github.io/vega-lite/docs/compositemark.html#boxplot)
     */
    type: BOXPLOT;
    /**
     * Orientation of the box plot.  This is normally automatically determined, but can be specified when the orientation is ambiguous and cannot be automatically determined.
     */
    orient?: Orient;
    /**
     * Extent is used to determine where the whiskers extend to. The options are
     * - `"min-max": min and max are the lower and upper whiskers respectively.
     * -  A scalar (integer or floating point number) that will be multiplied by the IQR and the product will be added to the third quartile to get the upper whisker and subtracted from the first quartile to get the lower whisker.
     * __Default value:__ `"1.5"`.
     */
    extent?: 'min-max' | number;
}
export declare function isBoxPlotDef(mark: BOXPLOT | BoxPlotDef): mark is BoxPlotDef;
export declare const BOXPLOT_STYLES: BoxPlotStyle[];
export interface BoxPlotConfig extends MarkConfig {
    /** Size of the box and mid tick of a box plot */
    size?: number;
    /** The default extent, which is used to determine where the whiskers extend to. The options are
     * - `"min-max": min and max are the lower and upper whiskers respectively.
     * - `"number": A scalar (integer or floating point number) that will be multiplied by the IQR and the product will be added to the third quartile to get the upper whisker and subtracted from the first quartile to get the lower whisker.
     */
    extent?: 'min-max' | number;
}
export interface BoxPlotConfigMixins {
    /**
     * Box Config
     * @hide
     */
    box?: BoxPlotConfig;
    /**
     * @hide
     */
    boxWhisker?: MarkConfig;
    /**
     * @hide
     */
    boxMid?: MarkConfig;
}
export declare const VL_ONLY_BOXPLOT_CONFIG_PROPERTY_INDEX: {
    [k in keyof BoxPlotConfigMixins]?: (keyof BoxPlotConfigMixins[k])[];
};
export declare function filterUnsupportedChannels(spec: GenericUnitSpec<Encoding<string>, BOXPLOT | BoxPlotDef>): GenericUnitSpec<Encoding<string>, BOXPLOT | BoxPlotDef>;
export declare function normalizeBoxPlot(spec: GenericUnitSpec<Encoding<string>, BOXPLOT | BoxPlotDef>, config: Config): NormalizedLayerSpec;
