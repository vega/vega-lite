import type {SignalRef} from 'vega';
import {Field} from '../src/channeldef.js';
import {buildModel} from '../src/compile/buildmodel.js';
import {ConcatModel} from '../src/compile/concat.js';
import {FacetModel} from '../src/compile/facet.js';
import {LayerModel} from '../src/compile/layer.js';
import {Model} from '../src/compile/model.js';
import {parseScales} from '../src/compile/scale/parse.js';
import {UnitModel} from '../src/compile/unit.js';
import {initConfig} from '../src/config.js';
import {normalize} from '../src/normalize/index.js';
import {
  GenericLayerSpec,
  isLayerSpec,
  isUnitSpec,
  NormalizedConcatSpec,
  NormalizedFacetSpec,
  NormalizedLayerSpec,
  NormalizedUnitSpec,
  TopLevel,
  TopLevelSpec,
} from '../src/spec/index.js';
import {BaseSpec, FrameMixins} from '../src/spec/base.js';
import {FacetedUnitSpec} from '../src/spec/unit.js';
import {contains} from '../src/util.js';

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

export function parseModelWithScaleAndLayoutSize(spec: TopLevelSpec) {
  const model = parseModelWithScale(spec);
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

export function assertIsUnitSpec(spec: BaseSpec): asserts spec is FacetedUnitSpec<Field> | NormalizedUnitSpec {
  if (!isUnitSpec(spec)) {
    throw new Error('Spec is not a unit spec!');
  }
}

export function assertIsLayerSpec(spec: BaseSpec): asserts spec is GenericLayerSpec<any> {
  if (!isLayerSpec(spec)) {
    throw new Error('Spec is not a layer spec!');
  }
}

/** Returns the array without the elements in excludedItems */
export function without<T>(array: readonly T[], excludedItems: readonly T[]) {
  return array.filter((item) => !contains(excludedItems, item));
}

export function range(start: number, stop: number, step: number) {
  return Array.from({length: (stop - start) / step}, (_, i) => start + step * i);
}
