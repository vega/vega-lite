/* Package of defining Vega-lite Specification's json schema at its utility functions */

import {Config, defaultOverlayConfig} from './config';
import {Data} from './data';
import {EncodingWithFacet, Encoding, channelHasField, isRanged} from './encoding';
import {Facet} from './facet';
import {FieldDef} from './fielddef';
import {Mark, AnyMark, COMPOSITE_MARKS, ERRORBAR, AREA, LINE, POINT, isCompositeMark} from './mark';
import {stack} from './stack';
import {Transform} from './transform';
import {ROW, COLUMN, X, Y, X2, Y2} from './channel';
import * as vlEncoding from './encoding';
import {contains, duplicate, extend, hash, keys, omit, pick, vals} from './util';

export type Padding = number | {top?: number, bottom?: number, left?: number, right?: number};

export interface BaseSpec {
  /**
   * URL to JSON schema for this Vega-Lite specification.
   * @format uri
   */
  $schema?: string;

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
   * The default visualization padding, in pixels, from the edge of the visualization canvas to the data rectangle. This can be a single number or an object with `"top"`, `"left"`, `"right"`, `"bottom"` properties.
   *
   * __Default value__: `5`
   *
   * @minimum 0
   */
  padding?: Padding;

  /**
   * An object describing the data source
   */
  data?: Data;

  /**
   * An object describing filter and new field calculation.
   */
  transform?: Transform;

  /**
   * Configuration object
   */
  config?: Config;
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
}

export type UnitSpec = GenericUnitSpec<Mark, Encoding>;

export type LayeredUnitSpec = GenericUnitSpec<AnyMark, Encoding>;


export type FacetedUnitSpec = GenericUnitSpec<AnyMark, EncodingWithFacet>;

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

/* Custom type guards */


export function isFacetSpec(spec: GenericSpec<GenericUnitSpec<any, any>>): spec is GenericFacetSpec<GenericUnitSpec<any, any>> {
  return spec['facet'] !== undefined;
}

export function isFacetedUnitSpec(spec: ExtendedSpec): spec is FacetedUnitSpec {
  if (isUnitSpec(spec)) {
    const hasRow = channelHasField(spec.encoding, ROW);
    const hasColumn = channelHasField(spec.encoding, COLUMN);

    return hasRow || hasColumn;
  }

  return false;
}

export function isUnitSpec(spec: ExtendedSpec): spec is FacetedUnitSpec | UnitSpec {
  return spec['mark'] !== undefined;
}

export function isLayerSpec(spec: ExtendedSpec | Spec): spec is GenericLayerSpec<GenericUnitSpec<any, Encoding>> {
  return spec['layer'] !== undefined;
}

/**
 * Decompose extended unit specs into composition of pure unit specs.
 */
// TODO: consider moving this to another file.  Maybe vl.spec.normalize or vl.normalize
export function normalize(spec: ExtendedSpec | Spec): Spec {
  if (isFacetSpec(spec)) {
    return normalizeFacet(spec);
  }
  if (isLayerSpec(spec)) {
    return normalizeLayer(spec);
  }
  if (isFacetedUnitSpec(spec)) {
    return normalizeFacetedUnit(spec);
  }
  return normalizeNonFacetUnit(spec);
}

function normalizeNonFacet(spec: GenericLayerSpec<LayeredUnitSpec> | LayeredUnitSpec) {
  if (isLayerSpec(spec)) {
    return normalizeLayer(spec);
  }
  return normalizeNonFacetUnit(spec);
}

function normalizeFacet(spec: GenericFacetSpec<LayeredUnitSpec>): FacetSpec {
  const {spec: subspec, ...rest} = spec;
  return {
    ...rest,
    spec: normalizeNonFacet(subspec)
  };
}

function normalizeLayer(spec: GenericLayerSpec<LayeredUnitSpec>): LayerSpec {
  const {layer: layer, ...rest} = spec;
  return {
    ...rest,
    layer: layer.map(normalizeNonFacet)
  };
}

function normalizeFacetedUnit(spec: FacetedUnitSpec): FacetSpec {
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
    })
  };
}

function isNormalUnitSpec(spec: GenericUnitSpec<AnyMark, Encoding>):
  spec is GenericUnitSpec<Mark, Encoding> {
    return !contains(COMPOSITE_MARKS, spec.mark);
}

function normalizeNonFacetUnit(spec: GenericUnitSpec<AnyMark, Encoding>) {
  const config = spec.config;
  const overlayConfig = config && config.overlay;
  const overlayWithLine = overlayConfig  && spec.mark === AREA &&
    contains(['linepoint', 'line'], overlayConfig.area);
  const overlayWithPoint = overlayConfig && (
    (overlayConfig.line && spec.mark === LINE) ||
    (overlayConfig.area === 'linepoint' && spec.mark === AREA)
  );

  if (isNormalUnitSpec(spec)) {
    // TODO: thoroughly test
    if (isRanged(spec.encoding)) {
      return normalizeRangedUnit(spec);
    }

    if (overlayWithPoint || overlayWithLine) {
      return normalizeOverlay(spec, overlayWithPoint, overlayWithLine);
    }
    return spec;
  } else {
    /* istanbul ignore else */
    if (spec.mark === ERRORBAR) {
      return normalizeErrorBar(spec);
    } else {
      throw new Error(`unsupported composite mark ${spec.mark}`);
    }
  }
}

function normalizeRangedUnit(spec: UnitSpec) {
  const hasX = channelHasField(spec.encoding, X);
  const hasY = channelHasField(spec.encoding, Y);
  const hasX2 = channelHasField(spec.encoding, X2);
  const hasY2 = channelHasField(spec.encoding, Y2);
  if ((hasX2 && !hasX) || (hasY2 && !hasY)) {
    let normalizedSpec = duplicate(spec);
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

function normalizeErrorBar(spec: GenericUnitSpec<AnyMark, Encoding>): LayerSpec {
  const {mark: _m, encoding: encoding, ...outerSpec} = spec;
  const {size: _s, ...encodingWithoutSize} = encoding;
  const {x2: _x2, y2: _y2, ...encodingWithoutX2Y2} = encoding;

  return {
    ...outerSpec,
    layer: [
      {
        mark: 'rule',
        encoding: encodingWithoutSize
      },{ // Lower tick
        mark: 'tick',
        encoding: encodingWithoutX2Y2
      }, { // Upper tick
        mark: 'tick',
        encoding: {
          ...encodingWithoutX2Y2,
          ...(encoding.x2 ? {x: encoding.x2} : {}),
          ...(encoding.y2 ? {y: encoding.y2} : {})
        }
      }
    ]
  };
}

// FIXME(#1804): rewrite this
function normalizeOverlay(spec: UnitSpec, overlayWithPoint: boolean, overlayWithLine: boolean): LayerSpec {
  let outerProps = ['name', 'description', 'data', 'transform'];
  let baseSpec = omit(spec, outerProps.concat('config'));

  let baseConfig = duplicate(spec.config);
  delete baseConfig.overlay;
  // TODO: remove shape, size

  // Need to copy stack config to overlayed layer
  const stacked = stack(spec.mark,
    spec.encoding,
    spec.config ? spec.config.stack : undefined
  );

  const layerSpec = {
    ...pick(spec, outerProps),
    layer: [baseSpec],
    ...(keys(baseConfig).length > 0 ? {config: baseConfig} : {})
  };

  if (overlayWithLine) {
    // TODO: add name with suffix
    let lineSpec = duplicate(baseSpec);
    lineSpec.mark = LINE;
    // TODO: remove shape, size
    let markConfig = extend({},
      defaultOverlayConfig.lineStyle,
      spec.config.overlay.lineStyle,
      stacked ? {stacked: stacked.offset} : null
    );
    if (keys(markConfig).length > 0) {
      lineSpec.config = {mark: markConfig};
    }

    layerSpec.layer.push(lineSpec);
  }

  if (overlayWithPoint) {
    // TODO: add name with suffix
    let pointSpec = duplicate(baseSpec);
    pointSpec.mark = POINT;

    let markConfig = extend({},
      defaultOverlayConfig.pointStyle,
      spec.config.overlay.pointStyle,
      stacked ? {stacked: stacked.offset} : null
    );
    if (keys(markConfig).length > 0) {
      pointSpec.config = {mark: markConfig};
    }
    layerSpec.layer.push(pointSpec);
  }
  return layerSpec;
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
    let key = hash(pureFieldDef);
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
};

export function isStacked(spec: FacetedUnitSpec): boolean {
  if (isCompositeMark(spec.mark)) {
    return false;
  }
  return stack(spec.mark, spec.encoding,
           spec.config ? spec.config.stack : undefined
         ) !== null;
}
