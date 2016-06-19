/* Package of defining Vega-lite Specification's json schema at its utility functions */

import {ROW, COLUMN} from './channel';
import {Config, defaultOverlayConfig, AreaOverlay} from './config';
import {Data} from './data';
import {Encoding, UnitEncoding, has} from './encoding';
import {Facet} from './facet';
import {FieldDef} from './fielddef';
import {Mark, LINE, AREA, POINT} from './mark';
import {stack} from './stack';
import {Transform} from './transform';

import * as vlEncoding from './encoding';
import {contains, duplicate, extend, keys, pick, omit} from './util';

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
  transform?: Transform;

  /**
   * Configuration object
   */
  config?: Config;
}

export interface UnitSpec extends BaseSpec {
  /**
   * The mark type.
   * One of `"bar"`, `"circle"`, `"square"`, `"tick"`, `"line"`,
   * `"area"`, `"point"`, `"rule"`, and `"text"`.
   */
  mark: Mark;

  /**
   * A key-value mapping between encoding channels and definition of fields.
   */
  encoding?: UnitEncoding;
}

/**
 * Schema for a unit Vega-Lite specification, with the syntactic sugar extensions:
 * - `row` and `column` are included in the encoding.
 * - (Future) label, box plot
 *
 * Note: the spec could contain facet.
 *
 * @required ["mark", "encoding"]
 */
export interface ExtendedUnitSpec extends BaseSpec {
  /**
   * The mark type.
   * One of `"bar"`, `"circle"`, `"square"`, `"tick"`, `"line"`,
   * `"area"`, `"point"`, `"rule"`, and `"text"`.
   */
  mark: Mark;

  /**
   * A key-value mapping between encoding channels and definition of fields.
   */
  encoding?: Encoding;
}

export interface FacetSpec extends BaseSpec {
  facet: Facet;
  spec: LayerSpec | UnitSpec;
}

export interface LayerSpec extends BaseSpec {
  /**
   * Unit specs that will be layered.
   */
  layers: UnitSpec[];
}

/** This is for the future schema */
export interface ExtendedFacetSpec extends BaseSpec {
  facet: Facet;

  spec: ExtendedUnitSpec | FacetSpec;
}

export type ExtendedSpec = ExtendedUnitSpec | FacetSpec | LayerSpec;
export type Spec = UnitSpec | FacetSpec | LayerSpec;

/* Custom type guards */

export function isFacetSpec(spec: ExtendedSpec): spec is FacetSpec {
  return spec['facet'] !== undefined;
}

export function isExtendedUnitSpec(spec: ExtendedSpec): spec is ExtendedUnitSpec {
  if (isSomeUnitSpec(spec)) {
    const hasRow = has(spec.encoding, ROW);
    const hasColumn = has(spec.encoding, COLUMN);

    return hasRow || hasColumn;
  }

  return false;
}

export function isUnitSpec(spec: ExtendedSpec): spec is UnitSpec {
  if (isSomeUnitSpec(spec)) {
    return !isExtendedUnitSpec(spec);
  }

  return false;
}

export function isSomeUnitSpec(spec: ExtendedSpec): spec is ExtendedUnitSpec | UnitSpec {
  return spec['mark'] !== undefined;
}

export function isLayerSpec(spec: ExtendedSpec): spec is LayerSpec {
  return spec['layers'] !== undefined;
}


/**
 * Decompose extended unit specs into composition of pure unit specs.
 */
// TODO: consider moving this to another file.  Maybe vl.spec.normalize or vl.normalize
export function normalize(spec: ExtendedSpec): Spec {
  if (isExtendedUnitSpec(spec)) {
    return normalizeExtendedUnitSpec(spec);
  } else if (isUnitSpec(spec)) {
    return normalizeUnitSpec(spec as any);
  }

  return spec;
}

export function normalizeExtendedUnitSpec(spec: ExtendedUnitSpec) {
  // TODO: @arvind please  add interaction syntax here
  let encoding = duplicate(spec.encoding);
  delete encoding.column;
  delete encoding.row;

  return extend(
    pick(spec, ['name', 'description', 'data', 'transform']),
    {
      facet: pick(spec.encoding, ['row', 'column']),
      spec: {
        mark: spec.mark,
        encoding: encoding
      }
    },
    spec.config ? { config: spec.config } : {}
  );
}

export function normalizeUnitSpec(spec: UnitSpec): Spec {
  const config = spec.config;
  const overlayConfig = config && config.overlay;
  const overlayWithLine = overlayConfig  && spec.mark === AREA &&
    contains([AreaOverlay.LINEPOINT, AreaOverlay.LINE], overlayConfig.area);
  const overlayWithPoint = overlayConfig && (
    (overlayConfig.line && spec.mark === LINE) ||
    (overlayConfig.area === AreaOverlay.LINEPOINT && spec.mark === AREA)
  );

  if (isStacked(spec)) {
    // We can't overlay stacked area yet!
    return spec;
  }

  if (overlayWithPoint || overlayWithLine) {
    return normalizeOverlay(spec, overlayWithPoint, overlayWithLine);
  }
  return spec;
}

export function normalizeOverlay(spec: UnitSpec, overlayWithPoint: boolean, overlayWithLine: boolean): LayerSpec {
  let outerProps = ['name', 'description', 'data', 'transform'];
  let baseSpec = omit(spec, outerProps.concat('config'));

  let baseConfig = duplicate(spec.config);
  delete baseConfig.overlay;
  // TODO: remove shape, size

  const layerSpec = extend(
    pick(spec, outerProps),
    { layers: [baseSpec] },
    keys(baseConfig).length > 0 ? { config: baseConfig } : {}
  );

  if (overlayWithLine) {
    // TODO: add name with suffix
    let lineSpec = duplicate(baseSpec);
    lineSpec.mark = LINE;
    // TODO: remove shape, size
    let markConfig = extend({}, defaultOverlayConfig.lineStyle, spec.config.overlay.lineStyle);
    if (keys(markConfig).length > 0) {
      lineSpec.config = {mark: markConfig};
    }

    layerSpec.layers.push(lineSpec);
  }

  if (overlayWithPoint) {
    // TODO: add name with suffix
    let pointSpec = duplicate(baseSpec);
    pointSpec.mark = POINT;
    let markConfig = extend({}, defaultOverlayConfig.pointStyle, spec.config.overlay.pointStyle);;
    if (keys(markConfig).length > 0) {
      pointSpec.config = {mark: markConfig};
    }
    layerSpec.layers.push(pointSpec);
  }
  return layerSpec;
}

// TODO: add vl.spec.validate & move stuff from vl.validate to here

export function alwaysNoOcclusion(spec: ExtendedUnitSpec): boolean {
  // FIXME raw OxQ with # of rows = # of O
  return vlEncoding.isAggregate(spec.encoding);
}

export function fieldDefs(spec: ExtendedUnitSpec): FieldDef[] {
  // TODO: refactor this once we have composition
  return vlEncoding.fieldDefs(spec.encoding);
};

export function getCleanSpec(spec: ExtendedUnitSpec): ExtendedUnitSpec {
  // TODO: move toSpec to here!
  return spec;
}

export function isStacked(spec: ExtendedUnitSpec): boolean {
  return stack(spec.mark, spec.encoding, spec.config) !== null;
}

// TODO revise
export function transpose(spec: ExtendedUnitSpec): ExtendedUnitSpec {
  const oldenc = spec.encoding;
  let encoding = duplicate(spec.encoding);
  encoding.x = oldenc.y;
  encoding.y = oldenc.x;
  encoding.row = oldenc.column;
  encoding.column = oldenc.row;
  spec.encoding = encoding;
  return spec;
}
