import { Orientation } from 'vega';
import { Encoding } from '../encoding';
import { NormalizerParams } from '../normalize';
import { GenericUnitSpec, NormalizedLayerSpec } from '../spec';
import { CompositeMarkNormalizer } from './base';
import { GenericCompositeMarkDef, PartsMixins } from './common';
export declare const BOXPLOT: 'boxplot';
export declare type BoxPlot = typeof BOXPLOT;
export declare type BoxPlotPart = 'box' | 'median' | 'outliers' | 'rule' | 'ticks';
export declare const BOXPLOT_PARTS: BoxPlotPart[];
export declare type BoxPlotPartsMixins = PartsMixins<BoxPlotPart>;
export interface BoxPlotConfig extends BoxPlotPartsMixins {
    /** Size of the box and median tick of a box plot */
    size?: number;
    /**
     * The extent of the whiskers. Available options include:
     * - `"min-max"`: min and max are the lower and upper whiskers respectively.
     * - A number representing multiple of the interquartile range.  This number will be multiplied by the IQR to determine whisker boundary, which spans from the smallest data to the largest data within the range _[Q1 - k * IQR, Q3 + k * IQR]_ where _Q1_ and _Q3_ are the first and third quartiles while _IQR_ is the interquartile range (_Q3-Q1_).
     *
     * __Default value:__ `1.5`.
     */
    extent?: 'min-max' | number;
}
export declare type BoxPlotDef = GenericCompositeMarkDef<BoxPlot> & BoxPlotConfig & {
    /**
     * Type of the mark.  For box plots, this should always be `"boxplot"`.
     * [boxplot](https://vega.github.io/vega-lite/docs/boxplot.html)
     */
    type: BoxPlot;
    /**
     * Orientation of the box plot.  This is normally automatically determined based on types of fields on x and y channels. However, an explicit `orient` be specified when the orientation is ambiguous.
     *
     * __Default value:__ `"vertical"`.
     */
    orient?: Orientation;
};
export interface BoxPlotConfigMixins {
    /**
     * Box Config
     */
    boxplot?: BoxPlotConfig;
}
export declare const boxPlotNormalizer: CompositeMarkNormalizer<"boxplot">;
export declare function getBoxPlotType(extent: number | 'min-max'): "min-max" | "tukey";
export declare function normalizeBoxPlot(spec: GenericUnitSpec<Encoding<string>, BoxPlot | BoxPlotDef>, { config }: NormalizerParams): NormalizedLayerSpec;
//# sourceMappingURL=boxplot.d.ts.map