import * as vlEnc from './enc';
import {Model} from './compiler/Model';

// TODO: add vl.spec.validate


export function alwaysNoOcclusion(spec) {
  // FIXME raw OxQ with # of rows = # of O
  return vlEnc.isAggregate(spec.encoding);
}

export function getCleanSpec(spec) {
  // TODO: move toSpec to here!
  return new Model(spec).toSpec(true);
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
