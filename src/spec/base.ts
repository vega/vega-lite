import {Color} from 'vega';
import {isArray, isNumber} from 'vega-util';
import {Config} from '../config';
import {Data} from '../data';
import {Resolve} from '../resolve';
import {TitleParams} from '../title';
import {Transform} from '../transform';
import {Flag, keys} from '../util';
import {BaseMarkConfig, LayoutAlign, RowCol} from '../vega.schema';
import {isConcatSpec} from './concat';
import {isFacetMapping, isFacetSpec} from './facet';
import {NormalizedSpec} from './index';
import {isRepeatSpec} from './repeat';

export {TopLevel} from './toplevel';

/**
 * Common properties for all types of specification
 */
export interface BaseSpec {
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
   * An object describing the data source. Set to `null` to ignore the parent's data source. If no data is set, it is derived from the parent.
   */
  data?: Data | null;

  /**
   * An array of data transformations such as filter and new field calculation.
   */
  transform?: Transform[];
}

export interface DataMixins {
  /**
   * An object describing the data source.
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

export interface ResolveMixins {
  /**
   * Scale, axis, and legend resolutions for view composition specifications.
   */
  resolve?: Resolve;
}

export interface BaseViewBackground
  extends Partial<
    Pick<
      BaseMarkConfig,
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
  fill?: Color | null;

  /**
   * The stroke color.
   *
   * __Default value:__ `"#ddd"`
   */
  stroke?: Color | null;
}

export interface ViewBackground extends BaseViewBackground {
  /**
   * A string or array of strings indicating the name of custom styles to apply to the view background. A style is a named collection of mark property defaults defined within the [style configuration](https://vega.github.io/vega-lite/docs/mark.html#style-config). If style is an array, later styles will override earlier styles.
   *
   * __Default value:__ `"cell"`
   * __Note:__ Any specified view background properties will augment the default style.
   */
  style?: string | string[];
}

export interface BoundsMixins {
  /**
   * The bounds calculation method to use for determining the extent of a sub-plot. One of `full` (the default) or `flush`.
   *
   * - If set to `full`, the entire calculated bounds (including axes, title, and legend) will be used.
   * - If set to `flush`, only the specified width and height values for the sub-view will be used. The `flush` setting can be useful when attempting to place sub-plots without axes or legends into a uniform grid structure.
   *
   * __Default value:__ `"full"`
   */

  bounds?: 'full' | 'flush';
}

/**
 * Base layout for FacetSpec and RepeatSpec.
 * This is named "GenericComposition" layout as ConcatLayout is a GenericCompositionLayout too
 * (but _not_ vice versa).
 */
export interface GenericCompositionLayout extends BoundsMixins {
  /**
   * The alignment to apply to grid rows and columns.
   * The supported string values are `"all"`, `"each"`, and `"none"`.
   *
   * - For `"none"`, a flow layout will be used, in which adjacent subviews are simply placed one after the other.
   * - For `"each"`, subviews will be aligned into a clean grid structure, but each row or column may be of variable size.
   * - For `"all"`, subviews will be aligned and each row or column will be sized identically based on the maximum observed size. String values for this property will be applied to both grid rows and columns.
   *
   * Alternatively, an object value of the form `{"row": string, "column": string}` can be used to supply different alignments for rows and columns.
   *
   * __Default value:__ `"all"`.
   */
  align?: LayoutAlign | RowCol<LayoutAlign>;

  /**
   * Boolean flag indicating if subviews should be centered relative to their respective rows or columns.
   *
   * An object value of the form `{"row": boolean, "column": boolean}` can be used to supply different centering values for rows and columns.
   *
   * __Default value:__ `false`
   */
  center?: boolean | RowCol<boolean>;

  /**
   * The spacing in pixels between sub-views of the composition operator.
   * An object of the form `{"row": number, "column": number}` can be used to set
   * different spacing values for rows and columns.
   *
   * __Default value__: Depends on `"spacing"` property of [the view composition configuration](https://vega.github.io/vega-lite/docs/config.html#view-config) (`20` by default)
   */
  spacing?: number | RowCol<number>;
}

export const DEFAULT_SPACING = 20;

export interface ColumnMixins {
  /**
   * The number of columns to include in the view composition layout.
   *
   * __Default value__: `undefined` -- An infinite number of columns (a single row) will be assumed. This is equivalent to
   * `hconcat` (for `concat`) and to using the `column` channel (for `facet` and `repeat`).
   *
   * __Note__:
   *
   * 1) This property is only for:
   * - the general (wrappable) `concat` operator (not `hconcat`/`vconcat`)
   * - the `facet` and `repeat` operator with one field/repetition definition (without row/column nesting)
   *
   * 2) Setting the `columns` to `1` is equivalent to `vconcat` (for `concat`) and to using the `row` channel (for `facet` and `repeat`).
   */
  columns?: number;
}

export type GenericCompositionLayoutWithColumns = GenericCompositionLayout & ColumnMixins;

export type CompositionConfig = ColumnMixins & {
  /**
   * The default spacing in pixels between composed sub-views.
   *
   * __Default value__: `20`
   */
  spacing?: number;
};

export interface CompositionConfigMixins {
  /** Default configuration for the `facet` view composition operator */
  facet?: CompositionConfig;

  /** Default configuration for all concatenation view composition operators (`concat`, `hconcat`, and `vconcat`) */
  concat?: CompositionConfig;

  /** Default configuration for the `repeat` view composition operator */
  repeat?: CompositionConfig;
}

const COMPOSITION_LAYOUT_INDEX: Flag<keyof GenericCompositionLayoutWithColumns> = {
  align: 1,
  bounds: 1,
  center: 1,
  columns: 1,
  spacing: 1
};

const COMPOSITION_LAYOUT_PROPERTIES = keys(COMPOSITION_LAYOUT_INDEX);

export type SpecType = 'unit' | 'facet' | 'layer' | 'concat' | 'repeat';

export function extractCompositionLayout(
  spec: NormalizedSpec,
  specType: SpecType,
  config: Config
): GenericCompositionLayoutWithColumns {
  const compositionConfig = config[specType];
  const layout: GenericCompositionLayoutWithColumns = {};

  // Apply config first
  const {spacing: spacingConfig, columns} = compositionConfig;
  if (spacingConfig !== undefined) {
    layout.spacing = spacingConfig;
  }

  if (columns !== undefined) {
    if (
      (isFacetSpec(spec) && !isFacetMapping(spec.facet)) ||
      (isRepeatSpec(spec) && isArray(spec.repeat)) ||
      isConcatSpec(spec)
    ) {
      layout.columns = columns;
    }
  }

  // Then copy properties from the spec

  for (const prop of COMPOSITION_LAYOUT_PROPERTIES) {
    if (spec[prop] !== undefined) {
      if (prop === 'spacing') {
        const spacing = spec[prop];

        layout[prop] = isNumber(spacing)
          ? spacing
          : {
              row: spacing.row || spacingConfig,
              column: spacing.column || spacingConfig
            };
      } else {
        layout[prop] = spec[prop];
      }
    }
  }

  return layout;
}
