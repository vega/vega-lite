import { Config } from '../config';
import { Field } from '../fielddef';
import { Encoding } from './../encoding';
import { MarkConfig } from './../mark';
import { GenericUnitSpec, LayerSpec } from './../spec';
export declare const BOXPLOT: 'box-plot';
export declare type BOXPLOT = typeof BOXPLOT;
export interface BoxPlotConfig extends MarkConfig {
    /** Size of the box and mid tick of a box plot */
    size?: number;
}
export declare function normalizeBoxPlot(spec: GenericUnitSpec<BOXPLOT, Encoding<Field>>, config: Config): LayerSpec;
