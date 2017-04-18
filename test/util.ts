import {buildModel} from '../src/compile/common';
import {ConcatModel} from '../src/compile/concat';
import {FacetModel} from '../src/compile/facet';
import {LayerModel} from '../src/compile/layer';
import {Model} from '../src/compile/model';
import {RepeatModel} from '../src/compile/repeat';
import {UnitModel} from '../src/compile/unit';
import {initConfig} from '../src/config';
import {ConcatSpec, FacetSpec, LayerSpec, normalize, RepeatSpec, TopLevel, TopLevelExtendedSpec, UnitSpec} from '../src/spec';

export function parseModel(inputSpec: TopLevelExtendedSpec): Model {
  const spec = normalize(inputSpec);
  return buildModel(spec, null, '', null, initConfig(inputSpec.config));
}

export function parseUnitModel(spec: TopLevel<UnitSpec>) {
  return new UnitModel(spec, null, '', null, initConfig(spec.config));
}

export function parseLayerModel(spec: TopLevel<LayerSpec>) {
  return new LayerModel(spec, null, '', null, initConfig(spec.config));
}

export function parseFacetModel(spec: TopLevel<FacetSpec>) {
  return new FacetModel(spec, null, '', null, initConfig(spec.config));
}

export function parseRepeatModel(spec: TopLevel<RepeatSpec>) {
  return new RepeatModel(spec, null, '', null, initConfig(spec.config));
}

export function parseConcatModel(spec: TopLevel<ConcatSpec>) {
  return new ConcatModel(spec, null, '', null, initConfig(spec.config));
}
