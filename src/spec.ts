/* Utilities for a Vega-Lite specificiation */

import {FieldDef} from './schema/fielddef.schema';
import {Spec} from './schema/schema';

import {Model} from './compile/Model';
import {COLOR, SHAPE} from './channel';
import * as vlEncoding from './encoding';
import {BAR, AREA} from './mark';
import {duplicate} from './util';

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
  return new Model(spec).toSpec(true);
}

export function isStack(spec: Spec): boolean {
  return (vlEncoding.has(spec.encoding, COLOR) || vlEncoding.has(spec.encoding, SHAPE)) &&
    (spec.mark === BAR || spec.mark === AREA) &&
    (!spec.config || !spec.config.stack !== false) &&
    vlEncoding.isAggregate(spec.encoding);
}

// TODO revise
export function transpose(spec: Spec): Spec {
  var oldenc = spec.encoding,
    encoding = duplicate(spec.encoding);
  encoding.x = oldenc.y;
  encoding.y = oldenc.x;
  encoding.row = oldenc.column;
  encoding.column = oldenc.row;
  spec.encoding = encoding;
  return spec;
}
