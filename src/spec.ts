import {isObject} from 'vega-util';
import {COLUMN, ROW, X, X2, Y, Y2} from './channel';
import * as compositeMark from './compositemark';
import {Config} from './config';
import {Data} from './data';
import {channelHasField, Encoding, EncodingWithFacet, isRanged} from './encoding';
import * as vlEncoding from './encoding';
import {FacetMapping} from './facet';
import {Field, FieldDef, RepeatRef} from './fielddef';
import * as log from './log';
import {AnyMark, AreaConfig, isMarkDef, isPathMark, isPrimitiveMark, LineConfig, Mark, MarkConfig, MarkDef} from './mark';
import {Projection} from './projection';
import {Repeat} from './repeat';
import {Resolve} from './resolve';
import {SelectionDef} from './selection';
import {stack} from './stack';
import {TitleParams} from './title';
import {TopLevelProperties} from './toplevelprops';
import {Transform} from './transform';
import {Dict, duplicate, hash, keys, omit, vals} from './util';


export type TopLevel<S extends BaseSpec> = S & TopLevelProperties & {
  /**
   * URL to [JSON schema](http://json-schema.org/) for a Vega-Lite specification. Unless you have a reason to change this, use `https://vega.github.io/schema/vega-lite/v2.json`. Setting the `$schema` property allows automatic validation and autocomplete in editors that support JSON schema.
   * @format uri
   */
  $schema?: string;

  /**
   * Vega-Lite configuration object.  This property can only be defined at the top-level of a specification.
   */
  config?: Config;
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

export type DataMixins = {
  /**
   * An object describing the data source
   */
  data: Data;
};


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


export interface GenericFacetSpec<
  U extends GenericUnitSpec<any, any>,
  L extends GenericLayerSpec<any>
  > extends BaseSpec {
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

export interface GenericRepeatSpec<
  U extends GenericUnitSpec<any, any>,
  L extends GenericLayerSpec<any>
> extends BaseSpec {
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

export interface GenericVConcatSpec<
  U extends GenericUnitSpec<any, any>,
  L extends GenericLayerSpec<any>
> extends BaseSpec {
  /**
   * A list of views that should be concatenated and put into a column.
   */
  vconcat: (GenericSpec<U, L>)[];

  /**
   * Scale, axis, and legend resolutions for vertically concatenated charts.
   */
  resolve?: Resolve;
}

export interface GenericHConcatSpec<
  U extends GenericUnitSpec<any, any>,
  L extends GenericLayerSpec<any>
> extends BaseSpec {
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
  GenericVConcatSpec<NormalizedUnitSpec, NormalizedLayerSpec> | GenericHConcatSpec<NormalizedUnitSpec, NormalizedLayerSpec>;

export type GenericSpec<
  U extends GenericUnitSpec<any, any>,
  L extends GenericLayerSpec<any>
> = U | L | GenericFacetSpec<U, L> | GenericRepeatSpec<U, L> |
  GenericVConcatSpec<U, L> |GenericHConcatSpec<U, L>;

export type NormalizedSpec = GenericSpec<NormalizedUnitSpec, NormalizedLayerSpec>;

export type TopLevelFacetedUnitSpec = TopLevel<FacetedCompositeUnitSpec> & DataMixins;
export type TopLevelFacetSpec = TopLevel<GenericFacetSpec<CompositeUnitSpec, ExtendedLayerSpec>> & DataMixins;

export type TopLevelSpec = TopLevelFacetedUnitSpec | TopLevelFacetSpec | TopLevel<ExtendedLayerSpec> |
TopLevel<GenericRepeatSpec<CompositeUnitSpec, ExtendedLayerSpec>> | TopLevel<GenericVConcatSpec<CompositeUnitSpec, ExtendedLayerSpec>> | TopLevel<GenericHConcatSpec<CompositeUnitSpec, ExtendedLayerSpec>>;

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

export function isConcatSpec(spec: BaseSpec):
  spec is GenericVConcatSpec<any, any> |
    GenericHConcatSpec<any, any> {
  return isVConcatSpec(spec) || isHConcatSpec(spec);
}

export function isVConcatSpec(spec: BaseSpec): spec is GenericVConcatSpec<any, any> {
  return spec['vconcat'] !== undefined;
}

export function isHConcatSpec(spec: BaseSpec): spec is GenericHConcatSpec<any, any> {
  return spec['hconcat'] !== undefined;
}

/**
 * Decompose extended unit specs into composition of pure unit specs.
 */
// TODO: consider moving this to another file.  Maybe vl.spec.normalize or vl.normalize
export function normalize(spec: TopLevelSpec | GenericSpec<CompositeUnitSpec, ExtendedLayerSpec> | FacetedCompositeUnitSpec, config: Config): NormalizedSpec {
  if (isFacetSpec(spec)) {
    return normalizeFacet(spec, config);
  }
  if (isLayerSpec(spec)) {
    return normalizeLayer(spec, config);
  }
  if (isRepeatSpec(spec)) {
    return normalizeRepeat(spec, config);
  }
  if (isVConcatSpec(spec)) {
    return normalizeVConcat(spec, config);
  }
  if (isHConcatSpec(spec)) {
    return normalizeHConcat(spec, config);
  }
  if (isUnitSpec(spec)) {
    const hasRow = channelHasField(spec.encoding, ROW);
    const hasColumn = channelHasField(spec.encoding, COLUMN);

    if (hasRow || hasColumn) {
      return normalizeFacetedUnit(spec, config);
    }
    return normalizeNonFacetUnit(spec, config);
  }
  throw new Error(log.message.INVALID_SPEC);
}

function normalizeFacet(spec: GenericFacetSpec<CompositeUnitSpec, ExtendedLayerSpec>, config: Config): NormalizedFacetSpec {
  const {spec: subspec, ...rest} = spec;
  return {
    ...rest,
    // TODO: remove "any" once we support all facet listed in https://github.com/vega/vega-lite/issues/2760
    spec: normalize(subspec, config) as any
  };
}

function mergeEncoding(opt: {parentEncoding: Encoding<any>, encoding: Encoding<any>}): Encoding<any> {
  const {parentEncoding, encoding} = opt;
  if (parentEncoding && encoding) {
    const overriden = keys(parentEncoding).reduce((o, key) => {
      if (encoding[key]) {
        o.push(key);
      }
      return o;
    }, []);

    if (overriden.length > 0) {
      log.warn(log.message.encodingOverridden(overriden));
    }
  }

  const merged = {
    ...(parentEncoding || {}),
    ...(encoding || {})
  };
  return keys(merged).length > 0 ? merged : undefined;
}

function mergeProjection(opt: {parentProjection: Projection, projection: Projection}) {
  const {parentProjection, projection} = opt;
  if (parentProjection && projection) {
    log.warn(log.message.projectionOverridden({parentProjection, projection}));
  }
  return projection || parentProjection;
}

function normalizeLayer(
  spec: ExtendedLayerSpec,
  config: Config,
  parentEncoding?: Encoding<string | RepeatRef>,
  parentProjection?: Projection
): NormalizedLayerSpec {
  const {layer, encoding, projection, ...rest} = spec;
  const mergedEncoding = mergeEncoding({parentEncoding, encoding});
  const mergedProjection = mergeProjection({parentProjection, projection});
  return {
    ...rest,
    layer: layer.map((subspec) => {
      if (isLayerSpec(subspec)) {
        return normalizeLayer(subspec, config, mergedEncoding, mergedProjection);
      }
      return normalizeNonFacetUnit(subspec, config, mergedEncoding, mergedProjection);
    })
  };
}

function normalizeRepeat(spec: GenericRepeatSpec<CompositeUnitSpec, ExtendedLayerSpec>, config: Config): NormalizedRepeatSpec {
  const {spec: subspec, ...rest} = spec;
  return {
    ...rest,
    spec: normalize(subspec, config)
  };
}

function normalizeVConcat(spec: GenericVConcatSpec<CompositeUnitSpec, ExtendedLayerSpec>, config: Config): NormalizedConcatSpec {
  const {vconcat: vconcat, ...rest} = spec;
  return {
    ...rest,
    vconcat: vconcat.map((subspec) => normalize(subspec, config))
  };
}

function normalizeHConcat(spec: GenericHConcatSpec<CompositeUnitSpec, ExtendedLayerSpec>, config: Config): NormalizedConcatSpec {
  const {hconcat: hconcat, ...rest} = spec;
  return {
    ...rest,
    hconcat: hconcat.map((subspec) => normalize(subspec, config))
  };
}

function normalizeFacetedUnit(spec: FacetedCompositeUnitSpec, config: Config): NormalizedFacetSpec {
  // New encoding in the inside spec should not contain row / column
  // as row/column should be moved to facet
  const {row: row, column: column, ...encoding} = spec.encoding;

  // Mark and encoding should be moved into the inner spec
  const {mark, width, projection, height, selection, encoding: _, ...outerSpec} = spec;

  return {
    ...outerSpec,
    facet: {
      ...(row ? {row} : {}),
      ...(column ? {column}: {}),
    },
    spec: normalizeNonFacetUnit({
      ...(projection ? {projection} : {}),
      mark,
      ...(width ? {width} : {}),
      ...(height ? {height} : {}),
      encoding,
      ...(selection ? {selection} : {})
    }, config)
  };
}

function isNonFacetUnitSpecWithPrimitiveMark(spec: GenericUnitSpec<Encoding<Field>, AnyMark>):
  spec is GenericUnitSpec<Encoding<Field>, Mark> {
    return isPrimitiveMark(spec.mark);
}

function getPointOverlay(markDef: MarkDef, markConfig: LineConfig, encoding: Encoding<Field>): MarkConfig {
  if (markDef.point === 'transparent') {
    return {opacity: 0};
  } else if (markDef.point) { // truthy : true or object
    return isObject(markDef.point) ? markDef.point : {};
  } else if (markDef.point !== undefined) { // false or null
    return null;
  } else { // undefined (not disabled)
    if (markConfig.point || encoding.shape) {
      // enable point overlay if config[mark].point is truthy or if encoding.shape is provided
      return isObject(markConfig.point) ? markConfig.point : {};
    }
    // markDef.point is defined as falsy
    return null;
  }
}

function getLineOverlay(markDef: MarkDef, markConfig: AreaConfig): MarkConfig {
  if (markDef.line) { // true or object
    return markDef.line === true ? {} : markDef.line;
  } else if (markDef.line !== undefined) { // false or null
    return null;
  } else { // undefined (not disabled)
    if (markConfig.line) {
      // enable line overlay if config[mark].line is truthy
      return markConfig.line === true ? {} : markConfig.line;
    }
    // markDef.point is defined as falsy
    return null;
  }
}

function normalizeNonFacetUnit(
  spec: GenericUnitSpec<Encoding<Field>, AnyMark>, config: Config,
  parentEncoding?: Encoding<string | RepeatRef>, parentProjection?: Projection
): NormalizedUnitSpec | NormalizedLayerSpec {
  const {encoding, projection} = spec;
  const mark = isMarkDef(spec.mark) ? spec.mark.type : spec.mark;


  // merge parent encoding / projection first
  if (parentEncoding || parentProjection) {
    const mergedProjection = mergeProjection({parentProjection, projection});
    const mergedEncoding = mergeEncoding({parentEncoding, encoding});
    return normalizeNonFacetUnit({
      ...spec,
      ...(mergedProjection ? {projection: mergedProjection} : {}),
      ...(mergedEncoding ? {encoding: mergedEncoding} : {}),
    }, config);
  }

  if (isNonFacetUnitSpecWithPrimitiveMark(spec)) {
    // TODO: thoroughly test
    if (isRanged(encoding)) {
      return normalizeRangedUnit(spec);
    }

    if (mark === 'line' && (encoding.x2 || encoding.y2)) {
      log.warn(log.message.lineWithRange(!!encoding.x2, !!encoding.y2));

      return normalizeNonFacetUnit({
        mark: 'rule',
        ...spec
      }, config, parentEncoding, parentProjection);
    }

    if (isPathMark(mark)) {
      return normalizePathOverlay(spec, config);
    }

    return spec; // Nothing to normalize
  } else {
    return compositeMark.normalize(spec, config);
  }
}

function normalizeRangedUnit(spec: NormalizedUnitSpec) {
  const hasX = channelHasField(spec.encoding, X);
  const hasY = channelHasField(spec.encoding, Y);
  const hasX2 = channelHasField(spec.encoding, X2);
  const hasY2 = channelHasField(spec.encoding, Y2);
  if ((hasX2 && !hasX) || (hasY2 && !hasY)) {
    const normalizedSpec = duplicate(spec);
    if (hasX2 && !hasX) {
      normalizedSpec.encoding.x = normalizedSpec.encoding.x2;
      delete normalizedSpec.encoding.x2;
    }
    if (hasY2 && !hasY) {
      normalizedSpec.encoding.y = normalizedSpec.encoding.y2;
      delete normalizedSpec.encoding.y2;
    }

    return normalizedSpec;
  }
  return spec;
}

function dropLineAndPoint(markDef: MarkDef): MarkDef | Mark {
  const {point: _point, line: _line, ...mark} = markDef;

  return keys(mark).length > 1 ? mark : mark.type;
}

function normalizePathOverlay(spec: NormalizedUnitSpec, config: Config = {}): NormalizedLayerSpec | NormalizedUnitSpec {

  // _ is used to denote a dropped property of the unit spec
  // which should not be carried over to the layer spec
  const {selection, projection, encoding, mark, ...outerSpec} = spec;
  const markDef = isMarkDef(mark) ? mark : {type: mark};

  const pointOverlay = getPointOverlay(markDef, config[markDef.type], encoding);
  const lineOverlay = markDef.type === 'area' && getLineOverlay(markDef, config[markDef.type]);

  if (!pointOverlay && !lineOverlay) {
    return {
      ...spec,
      // Do not include point / line overlay in the normalize spec
      mark: dropLineAndPoint(markDef)
    };
  }

  const layer: NormalizedUnitSpec[] = [{
    ...(selection ? {selection} : {}),
    // Do not include point / line overlay in the normalize spec
    mark: dropLineAndPoint({
      ...markDef,
      // make area mark translucent by default
      // TODO: extract this 0.7 to be shared with default opacity for point/tick/...
      ...(markDef.type === 'area' ? {opacity: 0.7} : {}),
    }),
    // drop shape from encoding as this might be used to trigger point overlay
    encoding: omit(encoding, ['shape'])
  }];

  // FIXME: disable tooltip for the line layer if tooltip is not group-by field.
  // FIXME: determine rules for applying selections.

  // Need to copy stack config to overlayed layer
  const stackProps = stack(markDef, encoding, config ? config.stack : undefined);

  let overlayEncoding = encoding;
  if (stackProps) {
    const {fieldChannel: stackFieldChannel, offset} = stackProps;
    overlayEncoding = {
      ...encoding,
      [stackFieldChannel]: {
        ...encoding[stackFieldChannel],
        ...(offset ? {stack: offset} : {})
      }
    };
  }

  if (lineOverlay) {
    const {interpolate} = markDef;
    layer.push({
      ...(projection ? {projection} : {}),
      mark: {
        type: 'line',
        ...lineOverlay,
        ...(interpolate ? {interpolate} : {})
      },
      encoding: overlayEncoding
    });
  }
  if (pointOverlay) {
    layer.push({
      ...(projection ? {projection} : {}),
      mark: {
        type: 'point',
        opacity: 1,
        filled: true,
        ...pointOverlay
      },
      encoding: overlayEncoding
    });
  }

  return {
    ...outerSpec,
    layer
  };
}

// TODO: add vl.spec.validate & move stuff from vl.validate to here

/* Accumulate non-duplicate fieldDefs in a dictionary */
function accumulate(dict: any, defs: FieldDef<Field>[]): any {
  defs.forEach(function(fieldDef) {
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
  } else { // Unit Spec
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
    return stack(spec.mark, spec.encoding,
            config ? config.stack : undefined
          ) !== null;
  }
  return false;
}
