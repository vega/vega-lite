import {Data} from '../data';
import {TitleParams} from '../title';
import {Transform} from '../transform';
import {VgMarkConfig} from '../vega.schema';

export {normalizeTopLevelSpec as normalize} from '../normalize';
export {TopLevel} from './toplevel';

/**
 * Common properties for all types of specification
 */
export type BaseSpec = Partial<DataMixins> & {
  /**
   * Title for the plot.
   */
  title?: string | TitleParams;

  /**
   * Name of the visualization for later reference.
   */
  name?: string;

  /**
   * Description of this mark for commenting purpose.
   */
  description?: string;

  /**
   * An object describing the data source
   */
  data?: Data;

  /**
   * An array of data transformations such as filter and new field calculation.
   */
  transform?: Transform[];
};

export interface DataMixins {
  /**
   * An object describing the data source
   */
  data: Data;
}

// TODO(https://github.com/vega/vega-lite/issues/2503): Make this generic so we can support some form of top-down sizing.
/**
 * Common properties for specifying width and height of unit and layer specifications.
 */
export interface LayoutSizeMixins {
  /**
   * The width of a visualization.
   *
   * __Default value:__ This will be determined by the following rules:
   *
   * - If a view's [`autosize`](https://vega.github.io/vega-lite/docs/size.html#autosize) type is `"fit"` or its x-channel has a [continuous scale](https://vega.github.io/vega-lite/docs/scale.html#continuous), the width will be the value of [`config.view.width`](https://vega.github.io/vega-lite/docs/spec.html#config).
   * - For x-axis with a band or point scale: if [`rangeStep`](https://vega.github.io/vega-lite/docs/scale.html#band) is a numeric value or unspecified, the width is [determined by the range step, paddings, and the cardinality of the field mapped to x-channel](https://vega.github.io/vega-lite/docs/scale.html#band).   Otherwise, if the `rangeStep` is `null`, the width will be the value of [`config.view.width`](https://vega.github.io/vega-lite/docs/spec.html#config).
   * - If no field is mapped to `x` channel, the `width` will be the value of [`config.scale.textXRangeStep`](https://vega.github.io/vega-lite/docs/size.html#default-width-and-height) for `text` mark and the value of `rangeStep` for other marks.
   *
   * __Note:__ For plots with [`row` and `column` channels](https://vega.github.io/vega-lite/docs/encoding.html#facet), this represents the width of a single view.
   *
   * __See also:__ The documentation for [width and height](https://vega.github.io/vega-lite/docs/size.html) contains more examples.
   */
  width?: number;

  /**
   * The height of a visualization.
   *
   * __Default value:__
   * - If a view's [`autosize`](https://vega.github.io/vega-lite/docs/size.html#autosize) type is `"fit"` or its y-channel has a [continuous scale](https://vega.github.io/vega-lite/docs/scale.html#continuous), the height will be the value of [`config.view.height`](https://vega.github.io/vega-lite/docs/spec.html#config).
   * - For y-axis with a band or point scale: if [`rangeStep`](https://vega.github.io/vega-lite/docs/scale.html#band) is a numeric value or unspecified, the height is [determined by the range step, paddings, and the cardinality of the field mapped to y-channel](https://vega.github.io/vega-lite/docs/scale.html#band). Otherwise, if the `rangeStep` is `null`, the height will be the value of [`config.view.height`](https://vega.github.io/vega-lite/docs/spec.html#config).
   * - If no field is mapped to `y` channel, the `height` will be the value of `rangeStep`.
   *
   * __Note__: For plots with [`row` and `column` channels](https://vega.github.io/vega-lite/docs/encoding.html#facet), this represents the height of a single view.
   *
   * __See also:__ The documentation for [width and height](https://vega.github.io/vega-lite/docs/size.html) contains more examples.
   */
  height?: number;
}

export interface LayerUnitMixins extends LayoutSizeMixins {
  /**
   * An object defining the view background's fill and stroke.
   *
   * __Default value:__ none (transparent)
   */
  view?: ViewBackground;
}

export interface ViewBackground
  extends Partial<
    Pick<
      VgMarkConfig,
      | 'cornerRadius'
      | 'fillOpacity'
      | 'opacity'
      | 'strokeCap'
      | 'strokeDash'
      | 'strokeDashOffset'
      | 'strokeJoin'
      | 'strokeMiterLimit'
      | 'strokeOpacity'
      | 'strokeWidth'
    >
  > {
  // Override documentations for fill and stroke
  /**
   * The fill color.
   *
   * __Default value:__ `undefined`
   */
  fill?: string;

  /**
   * The stroke color.
   *
   * __Default value:__ `"#ddd"`
   */
  stroke?: string;
}
