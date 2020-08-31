import {SignalRef} from 'vega-typings/types';
import {buildModel} from '../src/compile/buildmodel';
import {ConcatModel} from '../src/compile/concat';
import {FacetModel} from '../src/compile/facet';
import {LayerModel} from '../src/compile/layer';
import {Model} from '../src/compile/model';
import {parseScales} from '../src/compile/scale/parse';
import {UnitModel} from '../src/compile/unit';
import {initConfig} from '../src/config';
import {normalize} from '../src/normalize';
import {
  GenericLayerSpec,
  isLayerSpec,
  isUnitSpec,
  NormalizedConcatSpec,
  NormalizedFacetSpec,
  NormalizedLayerSpec,
  NormalizedUnitSpec,
  TopLevel,
  TopLevelSpec
} from '../src/spec';
import {BaseSpec, FrameMixins} from '../src/spec/base';
import {FacetedUnitSpec} from '../src/spec/unit';
import {contains} from '../src/util';

export type TopLevelNormalizedUnitSpecForTest = TopLevel<NormalizedUnitSpec> & FrameMixins<SignalRef>;

export function parseModel(inputSpec: TopLevelSpec): Model {
  const config = initConfig(inputSpec.config);
  const spec = normalize(inputSpec, config);
  return buildModel(spec, null, '', undefined, config);
}

export function parseModelWithScale(inputSpec: TopLevelSpec): Model {
  const model = parseModel(inputSpec);
  model.parseScale();
  return model;
}

export function parseUnitModel(spec: TopLevelNormalizedUnitSpecForTest) {
  return new UnitModel(spec, null, '', undefined, initConfig(spec.config));
}

export function parseUnitModelWithScale(spec: TopLevelNormalizedUnitSpecForTest) {
  const model = parseUnitModel(spec);
  model.parseScale();
  return model;
}

export function parseUnitModelWithScaleAndSelection(spec: TopLevelNormalizedUnitSpecForTest) {
  const model = parseUnitModel(spec);
  model.parseScale();
  model.parseSelections();
  return model;
}

export function parseUnitModelWithScaleExceptRange(spec: TopLevelNormalizedUnitSpecForTest) {
  const model = parseUnitModel(spec);
  parseScales(model, {ignoreRange: true});
  return model;
}

export function parseUnitModelWithScaleAndLayoutSize(spec: TopLevelNormalizedUnitSpecForTest) {
  const model = parseUnitModelWithScale(spec);
  model.parseLayoutSize();
  return model;
}

export function parseLayerModel(spec: TopLevel<NormalizedLayerSpec>) {
  return new LayerModel(spec, null, '', undefined, initConfig(spec.config));
}

export function parseFacetModel(spec: TopLevel<NormalizedFacetSpec>) {
  return new FacetModel(spec, null, '', initConfig(spec.config));
}

export function parseFacetModelWithScale(spec: TopLevel<NormalizedFacetSpec>) {
  const model = parseFacetModel(spec);
  model.parseScale();
  return model;
}

export function parseConcatModel(spec: TopLevel<NormalizedConcatSpec>) {
  return new ConcatModel(spec, null, '', initConfig(spec.config));
}

export function assertIsUnitSpec(spec: BaseSpec): asserts spec is FacetedUnitSpec | NormalizedUnitSpec {
  if (!isUnitSpec(spec)) {
    throw new Error('Spec is not a unit spec!');
  }
}

export function assertIsLayerSpec(spec: BaseSpec): asserts spec is GenericLayerSpec<any> {
  if (!isLayerSpec(spec)) {
    throw new Error('Spec is not a layer spec!');
  }
}

/** Returns the array without the elements in item */
export function without<T>(array: readonly T[], excludedItems: readonly T[]) {
  return array.filter(item => !contains(excludedItems, item));
}
