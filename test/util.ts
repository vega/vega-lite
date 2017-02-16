import {buildModel} from '../src/compile/common';
import {UnitModel} from '../src/compile/unit';
import {FacetModel} from '../src/compile/facet';
import {LayerModel} from '../src/compile/layer';
import {UnitSpec, FacetSpec, LayerSpec, normalize, ExtendedSpec} from '../src/spec';
import {Model} from '../src/compile/model';

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
