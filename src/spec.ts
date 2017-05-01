import {COLUMN, ROW, X, X2, Y, Y2} from './channel';
import * as compositeMark from './compositemark';
import {CompositeMark} from './compositemark';
import {Config} from './config';
import {Data} from './data';
import {channelHasField, Encoding, EncodingWithFacet, isRanged} from './encoding';
import * as vlEncoding from './encoding';
import {Facet} from './facet';
import {Field, FieldDef} from './fielddef';
import * as log from './log';
import {AREA, isPrimitiveMark, LINE, Mark, MarkDef} from './mark';
import {Repeat} from './repeat';
import {ResolveMapping} from './resolve';
import {SelectionDef} from './selection';
import {stack} from './stack';
import {TopLevelProperties} from './toplevelprops';
import {Transform} from './transform';
import {contains, duplicate, hash, vals} from './util';


export type TopLevel<S extends BaseSpec> = S & TopLevelProperties & {
  /**
   * URL to JSON schema for this Vega-Lite specification.
   * @format uri
   */
  $schema?: string;

  /**
   * Vega-Lite configuration object.
   */
  config?: Config;
};


export interface BaseSpec {

  /**
   * Name of the visualization for later reference.
   */
  name?: string;

  /**
   * An optional description of this mark for commenting purpose.
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
}

export interface UnitSize {
  /**
   * The width of a single visualization.
   *
   * __Default value:__ This will be determined by the following rules:
   *
   * - For x-axis with a continuous (non-ordinal) scale, the width will be the value of [`config.cell.width`](config.html#cell-config).
   * - For x-axis with an ordinal scale: if [`rangeStep`](scale.html#ordinal) is a numeric value (default), the width is determined by the value of `rangeStep` and the cardinality of the field mapped to x-channel.   Otherwise, if the `rangeStep` is `"fit"`, the width will be the value of [`config.cell.width`](config.html#cell-config).
   * - If no field is mapped to `x` channel, the `width` will be the value of [`config.scale.textXRangeStep`](size.html#default-width-and-height) for `text` mark and the value of `rangeStep` for other marks.
   *
   * __Note__: For plot with `row` and `column` channels, this represents the width of a single cell.
   */
  width?: number;

  /**
   * Height of a single visualization.
   *
   * __Default value:__
   * - For y-axis with a continuous (non-ordinal) scale, the height will be the value of [`config.cell.height`](config.html#cell-config).
   * - For y-axis with an ordinal scale: if [`rangeStep`](scale.html#ordinal) is a numeric value (default), the height is determined by the value of `rangeStep` and the cardinality of the field mapped to y-channel.   Otherwise, if the `rangeStep` is `"fit"`, the height will be the value of [`config.cell.height`](config.html#cell-config).
   * - If no field is mapped to `x` channel, the `height` will be the value of `rangeStep`.
   *
   * __Note__: For plot with `row` and `column` channels, this represents the height of a single cell.
   */
  height?: number;
}

export interface GenericUnitSpec<E extends Encoding<any>, M> extends BaseSpec, UnitSize {

  /**
   * A string describing the mark type (one of `"bar"`, `"circle"`, `"square"`, `"tick"`, `"line"`,
   * `"area"`, `"point"`, `"rule"`, and `"text"`) or a [mark definition object](mark.html#mark-def).
   */
  mark: M;

  /**
   * A key-value mapping between encoding channels and definition of fields.
   */
  encoding: E;

  /**
   * A key-value mapping between selection names and definitions.
   */
  selection?: {[name: string]: SelectionDef};
}

export type UnitSpec = GenericUnitSpec<Encoding<Field>, Mark | MarkDef>;

/**
 * Unit spec that can contain composite mark
 */
export type CompositeUnitSpec = GenericUnitSpec<Encoding<Field>, CompositeMark | Mark | MarkDef>;

/**
 * Unit spec that can contain composite mark and row or column channels.
 */
export type FacetedCompositeUnitSpec = GenericUnitSpec<EncodingWithFacet<Field>, CompositeMark | Mark | MarkDef>;

export interface GenericLayerSpec<U extends GenericUnitSpec<any, any>> extends BaseSpec, UnitSize {
  /**
   * Unit specs that will be layered.
   */
  layer: (GenericLayerSpec<U> | U)[];

  resolve?: ResolveMapping;
}

export type LayerSpec = GenericLayerSpec<UnitSpec>;

export interface GenericFacetSpec<U extends GenericUnitSpec<any, any>> extends BaseSpec {
  facet: Facet<Field>;

  // TODO: support facet of facet
  spec: GenericLayerSpec<U> | GenericRepeatSpec<U> | U;
}

export type FacetSpec = GenericFacetSpec<UnitSpec>;

export interface GenericRepeatSpec<U extends GenericUnitSpec<any, any>> extends BaseSpec {
  repeat: Repeat;

  // TODO: add GenericFacetSpec<U>
  spec: GenericRepeatSpec<U> | GenericLayerSpec<U> | U;
}

export type RepeatSpec = GenericRepeatSpec<UnitSpec>;

export interface GenericVConcatSpec<U extends GenericUnitSpec<any, any>> extends BaseSpec {
  // TODO: add GenericFacetSpec<U> | GenericfacetSpec<U>
  vconcat: (GenericLayerSpec<U> | GenericRepeatSpec<U> | U)[];
}

export interface GenericHConcatSpec<U extends GenericUnitSpec<any, any>> extends BaseSpec {
  // TODO: add GenericFacetSpec<U> | GenericfacetSpec<U>
  hconcat: (GenericLayerSpec<U> | GenericRepeatSpec<U> | U)[];
}

export type GenericConcatSpec<U extends GenericUnitSpec<any, any>> = GenericVConcatSpec<U> | GenericHConcatSpec<U>;

export type ConcatSpec = GenericConcatSpec<UnitSpec>;

export type GenericSpec<U extends GenericUnitSpec<any, any>> = U | GenericLayerSpec<U> | GenericFacetSpec<U> | GenericRepeatSpec<U> | GenericConcatSpec<U>;

export type Spec = GenericSpec<UnitSpec>;

export type TopLevelExtendedSpec = TopLevel<FacetedCompositeUnitSpec> | TopLevel<GenericLayerSpec<CompositeUnitSpec>> | TopLevel<GenericFacetSpec<CompositeUnitSpec>> | TopLevel<GenericRepeatSpec<CompositeUnitSpec>> | TopLevel<GenericConcatSpec<CompositeUnitSpec>>;

/* Custom type guards */


export function isFacetSpec(spec: GenericSpec<GenericUnitSpec<any, any>>): spec is GenericFacetSpec<GenericUnitSpec<any, any>> {
  return spec['facet'] !== undefined;
}

export function isUnitSpec(spec: GenericSpec<GenericUnitSpec<any, any>>): spec is FacetedCompositeUnitSpec | UnitSpec {
  return !!spec['mark'];
}

export function isLayerSpec(spec: GenericSpec<GenericUnitSpec<any, any>>): spec is GenericLayerSpec<GenericUnitSpec<any, any>> {
  return spec['layer'] !== undefined;
}

export function isRepeatSpec(spec: GenericSpec<GenericUnitSpec<any, any>>): spec is GenericRepeatSpec<GenericUnitSpec<any, any>> {
  return spec['repeat'] !== undefined;
}

export function isConcatSpec(spec: GenericSpec<GenericUnitSpec<any, any>>): spec is GenericConcatSpec<GenericUnitSpec<any, any>> {
  return isVConcatSpec(spec) || isHConcatSpec(spec);
}

export function isVConcatSpec(spec: GenericSpec<GenericUnitSpec<any, any>>): spec is GenericVConcatSpec<GenericUnitSpec<any, any>> {
  return spec['vconcat'] !== undefined;
}

export function isHConcatSpec(spec: GenericSpec<GenericUnitSpec<any, any>>): spec is GenericHConcatSpec<GenericUnitSpec<any, any>> {
  return spec['hconcat'] !== undefined;
}

/**
 * Decompose extended unit specs into composition of pure unit specs.
 */
// TODO: consider moving this to another file.  Maybe vl.spec.normalize or vl.normalize
export function normalize(spec: TopLevelExtendedSpec, config: Config): Spec {
  if (isFacetSpec(spec)) {
    return normalizeFacet(spec, config);
  }
  if (isLayerSpec(spec)) {
    return normalizeLayer(spec, config);
  }
  if (isRepeatSpec(spec)) {
    return normalizeRepeat(spec, spec.config);
  }
  if (isVConcatSpec(spec)) {
    return normalizeVConcat(spec, spec.config);
  }
  if (isHConcatSpec(spec)) {
    return normalizeHConcat(spec, spec.config);
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

function normalizeNonFacet(spec: GenericLayerSpec<CompositeUnitSpec> | GenericRepeatSpec<CompositeUnitSpec> | CompositeUnitSpec, config: Config) {
  if (isLayerSpec(spec)) {
    return normalizeLayer(spec, config);
  }
  if (isRepeatSpec(spec)) {
    return normalizeRepeat(spec, config);
  }
  return normalizeNonFacetUnit(spec, config);
}


function normalizeNonFacetWithRepeat(spec: GenericLayerSpec<CompositeUnitSpec> | GenericRepeatSpec<CompositeUnitSpec> | CompositeUnitSpec, config: Config) {
  if (isLayerSpec(spec)) {
    return normalizeLayer(spec, config);
  }
  if (isRepeatSpec(spec)) {
    return normalizeRepeat(spec, config);
  }
  return normalizeNonFacetUnit(spec, config);
}


function normalizeFacet(spec: GenericFacetSpec<CompositeUnitSpec>, config: Config): FacetSpec {
  const {spec: subspec, ...rest} = spec;
  return {
    ...rest,
    spec: normalizeNonFacet(subspec, config)
  };
}

function normalizeLayer(spec: GenericLayerSpec<CompositeUnitSpec>, config: Config): LayerSpec {
  const {layer: layer, ...rest} = spec;
  return {
    ...rest,
    layer: layer.map((subspec) => isLayerSpec(subspec) ? normalizeLayer(subspec, config) : normalizeNonFacetUnit(subspec, config))
  };
}

function normalizeRepeat(spec: GenericRepeatSpec<CompositeUnitSpec>, config: Config): RepeatSpec {
  const {spec: subspec, ...rest} = spec;
  return {
    ...rest,
    spec: normalizeNonFacetWithRepeat(subspec, config)
  };
}

function normalizeVConcat(spec: GenericVConcatSpec<CompositeUnitSpec>, config: Config): ConcatSpec {
  const {vconcat: vconcat, ...rest} = spec;
  return {
    ...rest,
    vconcat: vconcat.map((subspec) => normalizeNonFacet(subspec, config))
  };
}

function normalizeHConcat(spec: GenericHConcatSpec<CompositeUnitSpec>, config: Config): ConcatSpec {
  const {hconcat: hconcat, ...rest} = spec;
  return {
    ...rest,
    hconcat: hconcat.map((subspec) => normalizeNonFacet(subspec, config))
  };
}

function normalizeFacetedUnit(spec: FacetedCompositeUnitSpec, config: Config): FacetSpec {
  // New encoding in the inside spec should not contain row / column
  // as row/column should be moved to facet
  const {row: row, column: column, ...encoding} = spec.encoding;

  // Mark and encoding should be moved into the inner spec
  const {mark: mark, selection: selection, encoding: _, ...outerSpec} = spec;

  return {
    ...outerSpec,
    facet: {
      ...(row ? {row} : {}),
      ...(column ? {column}: {}),
    },
    spec: normalizeNonFacetUnit({
      mark,
      encoding,
      ...(selection ? {selection} : {})
    }, config)
  };
}

function isNonFacetUnitSpecWithPrimitiveMark(spec: GenericUnitSpec<Encoding<Field>, string | MarkDef>):
  spec is GenericUnitSpec<Encoding<Field>, Mark> {
    return isPrimitiveMark(spec.mark);
}

function normalizeNonFacetUnit(spec: GenericUnitSpec<Encoding<Field>, string | MarkDef>, config: Config) {
  if (isNonFacetUnitSpecWithPrimitiveMark(spec)) {
    // TODO: thoroughly test
    if (isRanged(spec.encoding)) {
      return normalizeRangedUnit(spec);
    }

    const overlayConfig = config && config.overlay;
    const overlayWithLine = overlayConfig  && spec.mark === AREA &&
      contains(['linepoint', 'line'], overlayConfig.area);
    const overlayWithPoint = overlayConfig && (
      (overlayConfig.line && spec.mark === LINE) ||
      (overlayConfig.area === 'linepoint' && spec.mark === AREA)
    );
    // TODO: consider moving this to become another case of compositeMark
    if (overlayWithPoint || overlayWithLine) {
      return normalizeOverlay(spec, overlayWithPoint, overlayWithLine, config);
    }

    return spec; // Nothing to normalize
  } else {
    return compositeMark.normalize(spec, config);
  }
}

function normalizeRangedUnit(spec: UnitSpec) {
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


// FIXME(#1804): re-design this
function normalizeOverlay(spec: UnitSpec, overlayWithPoint: boolean, overlayWithLine: boolean, config: Config): LayerSpec {
  const {mark, encoding, ...outerSpec} = spec;
  const layer = [{mark, encoding}];

  // Need to copy stack config to overlayed layer
  const stackProps = stack(mark, encoding, config ? config.stack : undefined);

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

  if (overlayWithLine) {
    layer.push({
      mark: {
        type: 'line',
        role: 'lineOverlay'
      },
      encoding: overlayEncoding
    });
  }
  if (overlayWithPoint) {
    layer.push({
      mark: {
        type: 'point',
        filled: true,
        role: 'pointOverlay'
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
function accumulate(dict: any, fieldDefs: FieldDef<Field>[]): any {
  fieldDefs.forEach(function(fieldDef) {
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
function fieldDefIndex(spec: GenericSpec<GenericUnitSpec<any, any>>, dict: any = {}): any {
  // TODO: Support repeat and concat
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
    accumulate(dict, vlEncoding.fieldDefs(spec.spec));
    fieldDefIndex(spec.spec, dict);
  } else if (isConcatSpec(spec)) {
    const childSpec = isVConcatSpec(spec) ? spec.vconcat : spec.hconcat;
    childSpec.forEach(child => {
      if (isUnitSpec(child)) {
        accumulate(dict, vlEncoding.fieldDefs(child.encoding));
      } else {
        fieldDefIndex(child, dict);
      }
    });
  } else { // Unit Spec
    accumulate(dict, vlEncoding.fieldDefs(spec.encoding));
  }
  return dict;
}

/* Returns all non-duplicate fieldDefs in a spec in a flat array */
export function fieldDefs(spec: GenericSpec<GenericUnitSpec<any, any>>): FieldDef<Field>[] {
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
