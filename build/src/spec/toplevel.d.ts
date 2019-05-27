import { Config } from '../config';
import { InlineDataset } from '../data';
import { Dict } from '../util';
import { BaseSpec } from './index';
/**
 * @minimum 0
 */
export declare type Padding = number | {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
};
export declare type Datasets = Dict<InlineDataset>;
export declare type TopLevel<S extends BaseSpec> = S & TopLevelProperties & {
    /**
     * URL to [JSON schema](http://json-schema.org/) for a Vega-Lite specification. Unless you have a reason to change this, use `https://vega.github.io/schema/vega-lite/v3.json`. Setting the `$schema` property allows automatic validation and autocomplete in editors that support JSON schema.
     * @format uri
     */
    $schema?: string;
    /**
     * Vega-Lite configuration object.  This property can only be defined at the top-level of a specification.
     */
    config?: Config;
    /**
     * A global data store for named datasets. This is a mapping from names to inline datasets.
     * This can be an array of objects or primitive values or a string. Arrays of primitive values are ingested as objects with a `data` property.
     */
    datasets?: Datasets;
    /**
     * Optional metadata that will be passed to Vega.
     * This object is completely ignored by Vega and Vega-Lite and can be used for custom metadata.
     */
    usermeta?: object;
};
export interface TopLevelProperties {
    /**
     * CSS color property to use as the background of the entire view.
     *
     * __Default value:__ none (transparent)
     */
    background?: string;
    /**
     * The default visualization padding, in pixels, from the edge of the visualization canvas to the data rectangle.  If a number, specifies padding for all sides.
     * If an object, the value should have the format `{"left": 5, "top": 5, "right": 5, "bottom": 5}` to specify padding for each side of the visualization.
     *
     * __Default value__: `5`
     */
    padding?: Padding;
    /**
     * Sets how the visualization size should be determined. If a string, should be one of `"pad"`, `"fit"` or `"none"`.
     * Object values can additionally specify parameters for content sizing and automatic resizing.
     * `"fit"` is only supported for single and layered views that don't use `rangeStep`.
     *
     * __Default value__: `pad`
     */
    autosize?: AutosizeType | AutoSizeParams;
}
export declare type AutosizeType = 'pad' | 'fit' | 'none';
export interface AutoSizeParams {
    /**
     * The sizing format type. One of `"pad"`, `"fit"` or `"none"`. See the [autosize type](https://vega.github.io/vega-lite/docs/size.html#autosize) documentation for descriptions of each.
     *
     * __Default value__: `"pad"`
     */
    type?: AutosizeType;
    /**
     * A boolean flag indicating if autosize layout should be re-calculated on every view update.
     *
     * __Default value__: `false`
     */
    resize?: boolean;
    /**
     * Determines how size calculation should be performed, one of `"content"` or `"padding"`. The default setting (`"content"`) interprets the width and height settings as the data rectangle (plotting) dimensions, to which padding is then added. In contrast, the `"padding"` setting includes the padding within the view size calculations, such that the width and height settings indicate the **total** intended size of the view.
     *
     * __Default value__: `"content"`
     */
    contains?: 'content' | 'padding';
}
export declare function normalizeAutoSize(topLevelAutosize: AutosizeType | AutoSizeParams, configAutosize: AutosizeType | AutoSizeParams, isUnitOrLayer?: boolean): AutoSizeParams;
export declare function extractTopLevelProperties<T extends TopLevelProperties>(t: T): {};
//# sourceMappingURL=toplevel.d.ts.map