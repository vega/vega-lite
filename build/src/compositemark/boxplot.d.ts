import { Config } from '../config';
import { Encoding } from '../encoding';
import { GenericUnitSpec, NormalizedLayerSpec } from '../spec';
import { Orient } from '../vega.schema';
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
     * - A number representing multiple of the interquartile range (Q3-Q1).  This number will be multiplied by the IQR. The product will be added to the third quartile to get the upper whisker and subtracted from the first quartile to get the lower whisker.
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
    orient?: Orient;
};
export interface BoxPlotConfigMixins {
    /**
     * Box Config
     */
    boxplot?: BoxPlotConfig;
}
export declare function normalizeBoxPlot(spec: GenericUnitSpec<Encoding<string>, BoxPlot | BoxPlotDef>, config: Config): NormalizedLayerSpec;
