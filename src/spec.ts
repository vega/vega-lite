/* Utilities for a Vega-Lite specificiation */

import * as vlEncoding from './encoding';
import {duplicate} from './util';
import {Model} from './compiler/Model';
import {Spec} from './schema/schema';
import {COLOR, DETAIL} from './channel';
import {BAR, AREA} from './marktype';

// TODO: add vl.spec.validate & move stuff from vl.validate to here

export function alwaysNoOcclusion(spec: Spec): boolean {
  // FIXME raw OxQ with # of rows = # of O
  return vlEncoding.isAggregate(spec.encoding);
}

export function getCleanSpec(spec: Spec): Spec {
  // TODO: move toSpec to here!
  return new Model(spec).toSpec(true);
}

export function isStack(spec: Spec): boolean {
  return (spec.encoding[COLOR].field || spec.encoding[DETAIL].field) &&
    (spec.marktype === BAR || spec.marktype === AREA) &&
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
