import {Config} from './config';
import {Data} from './data';
import * as vlEncoding from './encoding';
import {Encoding, EncodingWithFacet, extractTransformsFromEncoding, forEach} from './encoding';
import {FacetMapping} from './facet';
import {Field, FieldDef, RepeatRef} from './fielddef';
import * as log from './log';
import {AnyMark, isPrimitiveMark, Mark, MarkDef} from './mark';
import {Projection} from './projection';
import {Repeat} from './repeat';
import {Resolve} from './resolve';
import {SelectionDef} from './selection';
import {stack} from './stack';
import {TitleParams} from './title';
import {ConcatLayout, Datasets, GenericCompositionLayout, TopLevelProperties} from './toplevelprops';
import {Transform} from './transform';
import {Dict, hash, vals} from './util';

export type TopLevel<S extends BaseSpec> = S &
  TopLevelProperties & {
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

export interface GenericUnitSpec<E extends Encoding<any>, M> extends BaseSpec, LayoutSizeMixins {
  /**
   * A string describing the mark type (one of `"bar"`, `"circle"`, `"square"`, `"tick"`, `"line"`,
   * `"area"`, `"point"`, `"rule"`, `"geoshape"`, and `"text"`) or a [mark definition object](https://vega.github.io/vega-lite/docs/mark.html#mark-def).
   */
  mark: M;

  /**
   * A key-value mapping between encoding channels and definition of fields.
   */
  encoding?: E;

  /**
   * An object defining properties of geographic projection, which will be applied to `shape` path for `"geoshape"` marks
   * and to `latitude` and `"longitude"` channels for other marks.
   */
  projection?: Projection;

  /**
   * A key-value mapping between selection names and definitions.
   */
  selection?: {[name: string]: SelectionDef};
}

export type NormalizedUnitSpec = GenericUnitSpec<Encoding<string | RepeatRef>, Mark | MarkDef>;

/**
 * Unit spec that can have a composite mark.
 */
export type CompositeUnitSpec = GenericUnitSpec<Encoding<string | RepeatRef>, AnyMark>;

/**
 * Unit spec that can have a composite mark and row or column channels.
 */
export type FacetedCompositeUnitSpec = GenericUnitSpec<EncodingWithFacet<string | RepeatRef>, AnyMark>;

export interface GenericLayerSpec<U extends GenericUnitSpec<any, any>> extends BaseSpec, LayoutSizeMixins {
  /**
   * Layer or single view specifications to be layered.
   *
   * __Note__: Specifications inside `layer` cannot use `row` and `column` channels as layering facet specifications is not allowed.
   */
  layer: (GenericLayerSpec<U> | U)[];

  /**
   * Scale, axis, and legend resolutions for layers.
   */
  resolve?: Resolve;
}

/**
 * Layer Spec with encoding and projection
 */
export interface ExtendedLayerSpec extends GenericLayerSpec<CompositeUnitSpec> {
  /**
   * A shared key-value mapping between encoding channels and definition of fields in the underlying layers.
   */
  encoding?: Encoding<string | RepeatRef>;

  /**
   * An object defining properties of the geographic projection shared by underlying layers.
   */
  projection?: Projection;
}

export type NormalizedLayerSpec = GenericLayerSpec<NormalizedUnitSpec>;

export interface GenericFacetSpec<U extends GenericUnitSpec<any, any>, L extends GenericLayerSpec<any>>
  extends BaseSpec,
    GenericCompositionLayout {
  /**
   * An object that describes mappings between `row` and `column` channels and their field definitions.
   */
  facet: FacetMapping<string | RepeatRef>;

  /**
   * A specification of the view that gets faceted.
   */
  spec: L | U;
  // TODO: replace this with GenericSpec<U> once we support all cases;

  /**
   * Scale, axis, and legend resolutions for facets.
   */
  resolve?: Resolve;
}

export type NormalizedFacetSpec = GenericFacetSpec<NormalizedUnitSpec, NormalizedLayerSpec>;

export interface GenericRepeatSpec<U extends GenericUnitSpec<any, any>, L extends GenericLayerSpec<any>>
  extends BaseSpec,
    GenericCompositionLayout {
  /**
   * An object that describes what fields should be repeated into views that are laid out as a `row` or `column`.
   */
  repeat: Repeat;

  spec: GenericSpec<U, L>;

  /**
   * Scale and legend resolutions for repeated charts.
   */
  resolve?: Resolve;
}

export type NormalizedRepeatSpec = GenericRepeatSpec<NormalizedUnitSpec, NormalizedLayerSpec>;

export interface GenericVConcatSpec<U extends GenericUnitSpec<any, any>, L extends GenericLayerSpec<any>>
  extends BaseSpec,
    ConcatLayout {
  /**
   * A list of views that should be concatenated and put into a column.
   */
  vconcat: (GenericSpec<U, L>)[];

  /**
   * Scale, axis, and legend resolutions for vertically concatenated charts.
   */
  resolve?: Resolve;
}

export interface GenericHConcatSpec<U extends GenericUnitSpec<any, any>, L extends GenericLayerSpec<any>>
  extends BaseSpec,
    ConcatLayout {
  /**
   * A list of views that should be concatenated and put into a row.
   */
  hconcat: (GenericSpec<U, L>)[];

  /**
   * Scale, axis, and legend resolutions for horizontally concatenated charts.
   */
  resolve?: Resolve;
}

export type NormalizedConcatSpec =
  | GenericVConcatSpec<NormalizedUnitSpec, NormalizedLayerSpec>
  | GenericHConcatSpec<NormalizedUnitSpec, NormalizedLayerSpec>;

export type GenericSpec<U extends GenericUnitSpec<any, any>, L extends GenericLayerSpec<any>> =
  | U
  | L
  | GenericFacetSpec<U, L>
  | GenericRepeatSpec<U, L>
  | GenericVConcatSpec<U, L>
  | GenericHConcatSpec<U, L>;

export type NormalizedSpec = GenericSpec<NormalizedUnitSpec, NormalizedLayerSpec>;

export type TopLevelFacetedUnitSpec = TopLevel<FacetedCompositeUnitSpec> & DataMixins;
export type TopLevelFacetSpec = TopLevel<GenericFacetSpec<FacetedCompositeUnitSpec, ExtendedLayerSpec>> & DataMixins;

export type TopLevelSpec =
  | TopLevelFacetedUnitSpec
  | TopLevelFacetSpec
  | TopLevel<ExtendedLayerSpec>
  | TopLevel<GenericRepeatSpec<FacetedCompositeUnitSpec, ExtendedLayerSpec>>
  | TopLevel<GenericVConcatSpec<FacetedCompositeUnitSpec, ExtendedLayerSpec>>
  | TopLevel<GenericHConcatSpec<FacetedCompositeUnitSpec, ExtendedLayerSpec>>;

/* Custom type guards */

export function isFacetSpec(spec: BaseSpec): spec is GenericFacetSpec<any, any> {
  return spec['facet'] !== undefined;
}

export function isUnitSpec(spec: BaseSpec): spec is FacetedCompositeUnitSpec | NormalizedUnitSpec {
  return !!spec['mark'];
}

export function isLayerSpec(spec: BaseSpec): spec is GenericLayerSpec<any> {
  return spec['layer'] !== undefined;
}

export function isRepeatSpec(spec: BaseSpec): spec is GenericRepeatSpec<any, any> {
  return spec['repeat'] !== undefined;
}

export function isConcatSpec(spec: BaseSpec): spec is GenericVConcatSpec<any, any> | GenericHConcatSpec<any, any> {
  return isVConcatSpec(spec) || isHConcatSpec(spec);
}

export function isVConcatSpec(spec: BaseSpec): spec is GenericVConcatSpec<any, any> {
  return spec['vconcat'] !== undefined;
}

export function isHConcatSpec(spec: BaseSpec): spec is GenericHConcatSpec<any, any> {
  return spec['hconcat'] !== undefined;
}

export {normalizeTopLevelSpec as normalize} from './normalize';

// TODO: add vl.spec.validate & move stuff from vl.validate to here

/* Accumulate non-duplicate fieldDefs in a dictionary */
function accumulate(dict: any, defs: FieldDef<Field>[]): any {
  defs.forEach(fieldDef => {
    // Consider only pure fieldDef properties (ignoring scale, axis, legend)
    const pureFieldDef = ['field', 'type', 'value', 'timeUnit', 'bin', 'aggregate'].reduce((f, key) => {
      if (fieldDef[key] !== undefined) {
        f[key] = fieldDef[key];
      }
      return f;
    }, {});
    const key = hash(pureFieldDef);
    dict[key] = dict[key] || fieldDef;
  });
  return dict;
}

/* Recursively get fieldDefs from a spec, returns a dictionary of fieldDefs */
function fieldDefIndex<T>(spec: GenericSpec<any, any>, dict: Dict<FieldDef<T>> = {}): Dict<FieldDef<T>> {
  // FIXME(https://github.com/vega/vega-lite/issues/2207): Support fieldDefIndex for repeat
  if (isLayerSpec(spec)) {
    spec.layer.forEach(layer => {
      if (isUnitSpec(layer)) {
        accumulate(dict, vlEncoding.fieldDefs(layer.encoding));
      } else {
        fieldDefIndex(layer, dict);
      }
    });
  } else if (isFacetSpec(spec)) {
    accumulate(dict, vlEncoding.fieldDefs(spec.facet));
    fieldDefIndex(spec.spec, dict);
  } else if (isRepeatSpec(spec)) {
    fieldDefIndex(spec.spec, dict);
  } else if (isConcatSpec(spec)) {
    const childSpec = isVConcatSpec(spec) ? spec.vconcat : spec.hconcat;
    childSpec.forEach(child => fieldDefIndex(child, dict));
  } else {
    // Unit Spec
    accumulate(dict, vlEncoding.fieldDefs(spec.encoding));
  }
  return dict;
}

/* Returns all non-duplicate fieldDefs in a spec in a flat array */
export function fieldDefs(spec: GenericSpec<any, any>): FieldDef<any>[] {
  return vals(fieldDefIndex(spec));
}

export function isStacked(spec: TopLevel<FacetedCompositeUnitSpec>, config?: Config): boolean {
  config = config || spec.config;
  if (isPrimitiveMark(spec.mark)) {
    return stack(spec.mark, spec.encoding, config ? config.stack : undefined) !== null;
  }
  return false;
}

export function selectedFields(spec: NormalizedSpec): string[] {
  if (isFacetSpec(spec) || isRepeatSpec(spec)) {
    return selectedFieldsSingle(spec);
  }
  if (isLayerSpec(spec)) {
    return selectedFieldsLayered(spec);
  }
  if (isUnitSpec(spec)) {
    return selectedFieldsUnit(spec);
  }
  throw new Error(log.message.INVALID_SPEC);
}

function selectedFieldsUnit(spec: NormalizedUnitSpec): string[] {
  const fields: string[] = [];
  forEach(spec.encoding, (fieldDef, channel) => {
    fields.push(fieldDef.field);
  });
  return fields;
}

function selectedFieldsLayered(spec: NormalizedLayerSpec): string[] {
  let fields: string[] = [];
  spec.layer.map(subspec => {
    fields = fields.concat(selectedFields(subspec));
  });
  return fields;
}

function selectedFieldsSingle(spec: NormalizedFacetSpec | NormalizedRepeatSpec): string[] {
  return selectedFields(spec.spec);
}

export function extractTransforms(spec: NormalizedSpec, config: Config): NormalizedSpec {
  if (isFacetSpec(spec) || isRepeatSpec(spec)) {
    return extractTransformsSingle(spec, config);
  }
  if (isLayerSpec(spec)) {
    return extractTransformsLayered(spec, config);
  }
  if (isUnitSpec(spec)) {
    return extractTransformsUnit(spec, config);
  }
  if (isVConcatSpec(spec)) {
    return extractTransformsVConcat(spec, config);
  }
  if (isHConcatSpec(spec)) {
    return extractTransformsHConcat(spec, config);
  }
  throw new Error(log.message.INVALID_SPEC);
}

function extractTransformsUnit(spec: NormalizedUnitSpec, config: Config): NormalizedUnitSpec {
  if (spec.encoding) {
    const {encoding: oldEncoding, transform: oldTransforms, ...rest} = spec;
    const {bins, timeUnits, aggregate, groupby, encoding: newEncoding} = extractTransformsFromEncoding(
      oldEncoding,
      config
    );
    return {
      transform: [
        ...(oldTransforms ? oldTransforms : []),
        ...bins,
        ...timeUnits,
        ...(!aggregate.length ? [] : [{aggregate, groupby}])
      ],
      ...rest,
      encoding: newEncoding
    };
  } else {
    return spec;
  }
}

function extractTransformsSingle(
  spec: NormalizedFacetSpec | NormalizedRepeatSpec,
  config: Config
): NormalizedFacetSpec | NormalizedRepeatSpec {
  const {spec: subspec, ...rest} = spec;
  return {
    ...rest,
    spec: extractTransforms(subspec, config) as any
  };
}

function extractTransformsLayered(spec: NormalizedLayerSpec, config: Config): NormalizedLayerSpec {
  const {layer, ...rest} = spec;
  return {
    ...rest,
    layer: layer.map(subspec => {
      return extractTransforms(subspec, config) as any;
    })
  };
}

function extractTransformsVConcat(
  spec: GenericVConcatSpec<NormalizedUnitSpec, NormalizedLayerSpec>,
  config: Config
): NormalizedConcatSpec {
  const {vconcat, ...rest} = spec;
  return {
    ...rest,
    vconcat: vconcat.map(subspec => {
      return extractTransforms(subspec, config) as any;
    })
  };
}

function extractTransformsHConcat(
  spec: GenericHConcatSpec<NormalizedUnitSpec, NormalizedLayerSpec>,
  config: Config
): NormalizedConcatSpec {
  const {hconcat, ...rest} = spec;
  return {
    ...rest,
    hconcat: hconcat.map(subspec => {
      return extractTransforms(subspec, config) as any;
    })
  };
}
