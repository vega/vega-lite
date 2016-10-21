import {buildModel} from '../src/compile/common';
import {UnitModel} from '../src/compile/unit';
import {ExtendedUnitSpec, normalize} from '../src/spec';
import {contains} from '../src/util';
import {Model} from '../src/compile/model';

export function parseModel(inputSpec): Model {
  const spec = normalize(inputSpec);
  return buildModel(spec, null, '');
}

/**
 * Call new Model without worrying about types.
 * We use this in tests to allow using raw JSON.
 */
export function parseUnitModel(spec) {
  // TODO: support other type of model as well
  return new UnitModel(spec as ExtendedUnitSpec, null, '');
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
