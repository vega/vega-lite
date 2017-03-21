import {buildModel} from '../src/compile/common';
import {FacetModel} from '../src/compile/facet';
import {LayerModel} from '../src/compile/layer';
import {Model} from '../src/compile/model';
import {UnitModel} from '../src/compile/unit';
import {ExtendedSpec, FacetSpec, LayerSpec, normalize, UnitSpec} from '../src/spec';

export function parseModel(inputSpec: ExtendedSpec): Model {
  const spec = normalize(inputSpec);
  return buildModel(spec, null, '');
}

export function parseUnitModel(spec: UnitSpec) {
  return new UnitModel(spec, null, '');
}

export function parseLayerModel(spec: LayerSpec) {
  return new LayerModel(spec, null, '');
}

export function parseFacetModel(spec: FacetSpec) {
  return new FacetModel(spec, null, '');
}
