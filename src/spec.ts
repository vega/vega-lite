/* Utilities for a Vega-Lite specificiation */

import {FieldDef} from './fielddef';
// Package of defining Vega-lite Specification's json schema

import {Config} from './config';
import {Data} from './data';
import {Encoding, UnitEncoding, has} from './encoding';
import {Facet} from './facet';
import {Mark} from './mark';
import {Transform} from './transform';

import {COLOR, SHAPE, ROW, COLUMN, X, Y, X2, Y2} from './channel';
import * as vlEncoding from './encoding';
import {BAR, AREA} from './mark';
import {duplicate, extend} from './util';

export interface BaseSpec {
  name?: string;
  description?: string;
  data?: Data;
  transform?: Transform;
  config?: Config;
}

export interface UnitSpec extends BaseSpec {
  mark: Mark;
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
   * A name for the specification. The name is used to annotate marks, scale names, and more.
   */
  mark: Mark;
  encoding?: Encoding;
}

export interface FacetSpec extends BaseSpec {
  facet: Facet;
  spec: LayerSpec | UnitSpec;
}

export interface LayerSpec extends BaseSpec {
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
export function normalize(spec: ExtendedSpec): Spec {
  if (isExtendedUnitSpec(spec)) {
    return normalizeExtendedUnitSpec(spec);
  }
  if (isUnitSpec(spec)) {
    return normalizeUnitSpec(spec);
  }
  return spec;
}

export function normalizeExtendedUnitSpec(spec: ExtendedUnitSpec): Spec {
    const hasRow = has(spec.encoding, ROW);
    const hasColumn = has(spec.encoding, COLUMN);

    // TODO: @arvind please  add interaction syntax here
    let encoding = duplicate(spec.encoding);
    delete encoding.column;
    delete encoding.row;

    return extend(
      spec.name ? { name: spec.name } : {},
      spec.description ? { description: spec.description } : {},
      { data: spec.data },
      spec.transform ? { transform: spec.transform } : {},
      {
        facet: extend(
          hasRow ? { row: spec.encoding.row } : {},
          hasColumn ? { column: spec.encoding.column } : {}
        ),
        spec: normalizeUnitSpec({
          mark: spec.mark,
          encoding: encoding
        })
      },
      spec.config ? { config: spec.config } : {}
    );
}

export function normalizeUnitSpec(spec: UnitSpec): Spec {
  if (spec.encoding) {
    const hasX = has(spec.encoding, X);
    const hasY = has(spec.encoding, Y);
    const hasX2 = has(spec.encoding, X2);
    const hasY2 = has(spec.encoding, Y2);
    if ((hasX2 && !hasX) || (hasY2 && !hasY)) {
      let normalizedSpec = duplicate(spec);
      if (hasX2 && !hasX) {
        normalizedSpec.encoding.x = duplicate(normalizedSpec.encoding.x2);
        delete normalizedSpec.encoding.x2;
      }
      if (hasY2 && !hasY) {
        normalizedSpec.encoding.y = duplicate(normalizedSpec.encoding.y2);
        delete normalizedSpec.encoding.y2;
      }

      return normalizedSpec;
    }
  }
  return spec;
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

export function isStack(spec: ExtendedUnitSpec): boolean {
  return (vlEncoding.has(spec.encoding, COLOR) || vlEncoding.has(spec.encoding, SHAPE)) &&
    (spec.mark === BAR || spec.mark === AREA) &&
    (!spec.config || !spec.config.mark.stacked !== false) &&
    vlEncoding.isAggregate(spec.encoding);
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
