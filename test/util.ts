import {Model} from '../src/compile/Model';
import {SingleSpec} from '../src/spec';
import {contains} from '../src/util';

/**
 * Call new Model without worrying about types.
 * We use this in tests to allow using raw JSON.
 */
export function parseModel(spec) {
  return new Model(spec as SingleSpec);
}

export const zSchema = require('z-schema');

zSchema.registerFormat('color', function (str) {
  // valid colors are in list or hex color
  return contains(['purple'], str) || /^#([0-9a-f]{3}){1,2}$/i.test(str);
});
zSchema.registerFormat('font', function (str) {
  // right now no fonts are valid
  return false;
});
