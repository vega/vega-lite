import { Config } from '../config';
import { Encoding } from './../encoding';
import { MarkConfig } from './../mark';
import { GenericUnitSpec, LayerSpec } from './../spec';
import { Orient } from './../vega.schema';
export declare const BOXPLOT: 'box-plot';
export declare type BOXPLOT = typeof BOXPLOT;
export declare type BoxPlotStyle = 'boxWhisker' | 'box' | 'boxMid';
export interface BoxPlotDef {
    type: BOXPLOT;
    orient?: Orient;
    extent?: 'min-max' | number;
}
export declare function isBoxPlotDef(mark: BOXPLOT | BoxPlotDef): mark is BoxPlotDef;
export declare const BOXPLOT_STYLES: BoxPlotStyle[];
export interface BoxPlotConfig extends MarkConfig {
    /** Size of the box and mid tick of a box plot */
    size?: number;
}
export interface BoxPlotConfigMixins {
    /** Box Config */
    box?: BoxPlotConfig;
    boxWhisker?: MarkConfig;
    boxMid?: MarkConfig;
}
export declare const VL_ONLY_BOXPLOT_CONFIG_PROPERTY_INDEX: {
    [k in keyof BoxPlotConfigMixins]?: (keyof BoxPlotConfigMixins[k])[];
};
export declare function filterUnsupportedChannels(spec: GenericUnitSpec<Encoding<string>, BOXPLOT | BoxPlotDef>): GenericUnitSpec<Encoding<string>, BOXPLOT | BoxPlotDef>;
export declare function normalizeBoxPlot(spec: GenericUnitSpec<Encoding<string>, BOXPLOT | BoxPlotDef>, config: Config): LayerSpec;
