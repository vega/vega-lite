/* Utilities for a Vega-Lite specificiation */

import * as vlEncoding from './encoding';
import * as util from './util';
import {Model} from './compiler/Model';
import {Spec} from './schema/schema';

// TODO: add vl.spec.validate & move stuff from vl.validate to here

export function alwaysNoOcclusion(spec: Spec): boolean {
  // FIXME raw OxQ with # of rows = # of O
  return vlEncoding.isAggregate(spec.encoding);
}

export function getCleanSpec(spec: Spec): Spec {
  // TODO: move toSpec to here!
  return new Model(spec).toSpec(true);
}


export function isStack(spec): boolean {
  // FIXME update this once we have control for stack ...
  return (spec.marktype === 'bar' || spec.marktype === 'area') &&
    !!spec.encoding.color;
}

// TODO revise
export function transpose(spec: Spec): Spec {
  var oldenc = spec.encoding,
    encoding = util.duplicate(spec.encoding);
  encoding.x = oldenc.y;
  encoding.y = oldenc.x;
  encoding.row = oldenc.col;
  encoding.col = oldenc.row;
  spec.encoding = encoding;
  return spec;
}
