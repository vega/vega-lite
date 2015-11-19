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
