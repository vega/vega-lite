/* Utilities for a Vega-Lite specificiation */

import {FieldDef} from './fielddef';
// Package of defining Vega-lite Specification's json schema

import {Config} from './config';
import {Data} from './data';
import {Encoding} from './encoding';
import {Mark} from './mark';
import {Transform} from './transform';

import {COLOR, SHAPE} from './channel';
import * as vlEncoding from './encoding';
import {BAR, AREA} from './mark';
import {duplicate} from './util';

/**
 * Schema for Vega-Lite specification
 * @required ["mark", "encoding"]
 */
export interface Spec {
  /**
   * A name for the specification. The name is used to annotate marks, scale names, and more.
   */
  name?: string;
  description?: string;
  data?: Data;
  transform?: Transform;
  mark: Mark;
  encoding: Encoding;
  config?: Config;
}



// TODO: add vl.spec.validate & move stuff from vl.validate to here

export function alwaysNoOcclusion(spec: Spec): boolean {
  // FIXME raw OxQ with # of rows = # of O
  return vlEncoding.isAggregate(spec.encoding);
}

export function fieldDefs(spec: Spec): FieldDef[] {
  // TODO: refactor this once we have composition
  return vlEncoding.fieldDefs(spec.encoding);
};

export function getCleanSpec(spec: Spec): Spec {
  // TODO: move toSpec to here!
  return spec;
}

export function isStack(spec: Spec): boolean {
  return (vlEncoding.has(spec.encoding, COLOR) || vlEncoding.has(spec.encoding, SHAPE)) &&
    (spec.mark === BAR || spec.mark === AREA) &&
    (!spec.config || !spec.config.mark.stacked !== false) &&
    vlEncoding.isAggregate(spec.encoding);
}

// TODO revise
export function transpose(spec: Spec): Spec {
  const oldenc = spec.encoding;
  let encoding = duplicate(spec.encoding);
  encoding.x = oldenc.y;
  encoding.y = oldenc.x;
  encoding.row = oldenc.column;
  encoding.column = oldenc.row;
  spec.encoding = encoding;
  return spec;
}
