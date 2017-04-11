/* Package of defining Vega-lite Specification's json schema at its utility functions */

import * as compositeMark from './compositemark';
import {Config} from './config';
import {Data} from './data';
import {channelHasField, Encoding, EncodingWithFacet, isRanged} from './encoding';
import {Facet} from './facet';
import {FieldDef} from './fielddef';

import {COLUMN, ROW, X, X2, Y, Y2} from './channel';
import * as vlEncoding from './encoding';
import * as log from './log';
import {AREA, isPrimitiveMark, LINE, Mark, MarkDef} from './mark';
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
   * Configuration object
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
   * This property has no effect on the output visualization.
   */
  description?: string;

  /**
   * An object describing the data source
   */
  data?: Data;

  /**
   * An object describing filter and new field calculation.
   */
  transform?: Transform[];
}

export interface GenericUnitSpec<M, E extends Encoding> extends BaseSpec {
  // FIXME description for top-level width
  width?: number;

  // FIXME description for top-level width
  height?: number;

  /**
   * The mark type.
   * One of `"bar"`, `"circle"`, `"square"`, `"tick"`, `"line"`,
   * `"area"`, `"point"`, `"rule"`, and `"text"`.
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

export type UnitSpec = GenericUnitSpec<Mark | MarkDef, Encoding>;

export type LayeredUnitSpec = GenericUnitSpec<string | MarkDef, Encoding>;

export type FacetedUnitSpec = GenericUnitSpec<string | MarkDef, EncodingWithFacet>;

export interface GenericLayerSpec<U extends GenericUnitSpec<any, any>> extends BaseSpec {
  // FIXME description for top-level width
  width?: number;

  // FIXME description for top-level width
  height?: number;

  /**
   * Unit specs that will be layered.
   */
  // TODO: support layer of layer
  layer: (GenericLayerSpec<U> | U)[];
}

export type LayerSpec = GenericLayerSpec<UnitSpec>;

export interface GenericFacetSpec<U extends GenericUnitSpec<any, any>> extends BaseSpec {
  facet: Facet;

  // TODO: support facet of facet
  spec: GenericLayerSpec<U> | U;
}

export type FacetSpec = GenericFacetSpec<UnitSpec>;
export type ExtendedFacetSpec = GenericFacetSpec<FacetedUnitSpec>;

export type GenericSpec<U extends GenericUnitSpec<any, any>> = U | GenericLayerSpec<U> | GenericFacetSpec<U>;

export type ExtendedSpec = GenericSpec<FacetedUnitSpec>;

export type Spec = GenericSpec<UnitSpec>;

export type TopLevelExtendedSpec = TopLevel<ExtendedSpec>;

/* Custom type guards */


export function isFacetSpec(spec: GenericSpec<GenericUnitSpec<any, any>>): spec is GenericFacetSpec<GenericUnitSpec<any, any>> {
  return spec['facet'] !== undefined;
}

export function isUnitSpec(spec: ExtendedSpec | Spec): spec is FacetedUnitSpec | UnitSpec {
  return !!spec['mark'];
}

export function isLayerSpec(spec: ExtendedSpec | Spec): spec is GenericLayerSpec<GenericUnitSpec<any, Encoding>> {
  return spec['layer'] !== undefined;
}

/**
 * Decompose extended unit specs into composition of pure unit specs.
 */
// TODO: consider moving this to another file.  Maybe vl.spec.normalize or vl.normalize
export function normalize(spec: TopLevel<ExtendedSpec>): Spec {
  if (isFacetSpec(spec)) {
    return normalizeFacet(spec, spec.config);
  }
  if (isLayerSpec(spec)) {
    return normalizeLayer(spec, spec.config);
  }
  if (isUnitSpec(spec)) {
    const hasRow = channelHasField(spec.encoding, ROW);
    const hasColumn = channelHasField(spec.encoding, COLUMN);

    if (hasRow || hasColumn) {
      return normalizeFacetedUnit(spec, spec.config);
    }
    return normalizeNonFacetUnit(spec, spec.config);
  }
  throw new Error(log.message.INVALID_SPEC);
}

function normalizeNonFacet(spec: GenericLayerSpec<LayeredUnitSpec> | LayeredUnitSpec, config: Config) {
  if (isLayerSpec(spec)) {
    return normalizeLayer(spec, config);
  }
  return normalizeNonFacetUnit(spec, config);
}

function normalizeFacet(spec: GenericFacetSpec<LayeredUnitSpec>, config: Config): FacetSpec {
  const {spec: subspec, ...rest} = spec;
  return {
    ...rest,
    spec: normalizeNonFacet(subspec, config)
  };
}

function normalizeLayer(spec: GenericLayerSpec<LayeredUnitSpec>, config: Config): LayerSpec {
  const {layer: layer, ...rest} = spec;
  return {
    ...rest,
    layer: layer.map((subspec) => normalizeNonFacet(subspec, config))
  };
}

function normalizeFacetedUnit(spec: FacetedUnitSpec, config: Config): FacetSpec {
  // New encoding in the inside spec should not contain row / column
  // as row/column should be moved to facet
  const {row: row, column: column, ...encoding} = spec.encoding;

  // Mark and encoding should be moved into the inner spec
  const {mark: mark, encoding: _, ...outerSpec} = spec;

  return {
    ...outerSpec,
    facet: {
      ...(row ? {row} : {}),
      ...(column ? {column}: {}),
    },
    spec: normalizeNonFacetUnit({
      mark,
      encoding
    }, config)
  };
}

function isNonFacetUnitSpecWithPrimitiveMark(spec: GenericUnitSpec<string | MarkDef, Encoding>):
  spec is GenericUnitSpec<Mark, Encoding> {
    return isPrimitiveMark(spec.mark);
}

function normalizeNonFacetUnit(spec: GenericUnitSpec<string | MarkDef, Encoding>, config: Config) {
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
    return compositeMark.normalize(spec);
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
function accumulate(dict: any, fieldDefs: FieldDef[]): any {
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
function fieldDefIndex(spec: ExtendedSpec | ExtendedFacetSpec, dict: any = {}): any {
  // TODO: Support repeat and concat
  if (isLayerSpec(spec)) {
    spec.layer.forEach(function(layer) {
      if (isUnitSpec(layer)) {
        accumulate(dict, vlEncoding.fieldDefs(layer.encoding));
      } else {
        fieldDefIndex(layer, dict);
      }
    });
  } else if (isFacetSpec(spec)) {
    accumulate(dict, vlEncoding.fieldDefs(spec.facet));
    fieldDefIndex(spec.spec, dict);
  } else { // Unit Spec
    accumulate(dict, vlEncoding.fieldDefs(spec.encoding));
  }
  return dict;
}

/* Returns all non-duplicate fieldDefs in a spec in a flat array */
export function fieldDefs(spec: ExtendedSpec | ExtendedFacetSpec): FieldDef[] {
  return vals(fieldDefIndex(spec));
}

export function isStacked(spec: TopLevel<FacetedUnitSpec>, config?: Config): boolean {
  config = config || spec.config;
  if (isPrimitiveMark(spec.mark)) {
    return stack(spec.mark, spec.encoding,
            config ? config.stack : undefined
          ) !== null;
  }
  return false;
}
