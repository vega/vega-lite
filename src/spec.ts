/* Utilities for a Vega-Lite specificiation */

import * as vlEncoding from './encoding';
import {Model} from './compiler/Model';

// TODO: add vl.spec.validate & move stuff from vl.validate to here

export function alwaysNoOcclusion(spec) {
  // FIXME raw OxQ with # of rows = # of O
  return vlEncoding.isAggregate(spec.encoding);
}

export function getCleanSpec(spec) {
  // TODO: move toSpec to here!
  return new Model(spec).toSpec(true);
}


export function isStack(spec) {
  // FIXME update this once we have control for stack ...
  return (spec.marktype === 'bar' || spec.marktype === 'area') &&
    !!spec.encoding.color;
}

// TODO revise
export function transpose(spec) {
  var oldenc = spec.encoding,
    enc = util.duplicate(spec.encoding);
  enc.x = oldenc.y;
  enc.y = oldenc.x;
  enc.row = oldenc.col;
  enc.col = oldenc.row;
  spec.encoding = enc;
  return spec;
}
