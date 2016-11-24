import {buildModel} from '../src/compile/common';
import {UnitModel} from '../src/compile/unit';
import {FacetModel} from '../src/compile/facet';
import {ExtendedUnitSpec, FacetSpec, normalize, ExtendedSpec} from '../src/spec';
import {Model} from '../src/compile/model';

/**
 * Call new Model without worrying about types.
 * We use this in tests to allow using raw JSON.
 */
export function parseModel(inputSpec: ExtendedSpec): Model {
  const spec = normalize(inputSpec);
  return buildModel(spec, null, '');
}

/**
 * Call new UnitModel without worrying about types.
 * We use this in tests to allow using raw JSON.
 */
export function parseUnitModel(spec: ExtendedUnitSpec) {
  // TODO: support other type of model as well
  return new UnitModel(spec, null, '');
}


/**
 * Call new FacetModel without worrying about types.
 * We use this in tests to allow using raw JSON.
 */
export function parseFacetModel(spec: FacetSpec) {
  // TODO: support other type of model as well
  return new FacetModel(spec as FacetSpec, null, '');
}
