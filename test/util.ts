import {buildModel} from '../src/compile/common';
import {ConcatModel} from '../src/compile/concat';
import {FacetModel} from '../src/compile/facet';
import {LayerModel} from '../src/compile/layer';
import {normalizeMarkDef} from '../src/compile/mark/init';
import {parseMarkDef} from '../src/compile/mark/mark';
import {Model} from '../src/compile/model';
import {RepeatModel} from '../src/compile/repeat';
import {UnitModel} from '../src/compile/unit';
import {defaultConfig} from '../src/config';
import {initConfig} from '../src/config';
import {ConcatSpec, FacetSpec, LayerSpec, normalize, RepeatSpec, TopLevel, TopLevelExtendedSpec, UnitSpec} from '../src/spec';

export function parseModel(inputSpec: TopLevelExtendedSpec): Model {
  const config = initConfig(inputSpec.config);
  const spec = normalize(inputSpec, config);
  return buildModel(spec, null, '', undefined, undefined, config);
}

export function parseModelWithScale(inputSpec: TopLevelExtendedSpec): Model {
  const model = parseModel(inputSpec);
  model.parseScale();
  return model;
}

export function parseUnitModel(spec: TopLevel<UnitSpec>) {
  return new UnitModel(spec, null, '', undefined, undefined, initConfig(spec.config));
}

export function parseUnitModelWithScale(spec: TopLevel<UnitSpec>) {
  const model = parseUnitModel(spec);
  model.parseScale();
  return model;
}

export function parseUnitModelWithScaleAndMarkDef(spec: TopLevel<UnitSpec>) {
  const model = parseUnitModelWithScale(spec);
  parseMarkDef(model);
  return model;
}

export function parseUnitModelWithScaleAndLayoutSize(spec: TopLevel<UnitSpec>) {
  const model = parseUnitModelWithScale(spec);
  model.parseLayoutSize();
  return model;
}


export function parseLayerModel(spec: TopLevel<LayerSpec>) {
  return new LayerModel(spec, null, '', undefined, undefined, initConfig(spec.config));
}

export function parseFacetModel(spec: TopLevel<FacetSpec>) {
  return new FacetModel(spec, null, '', undefined, initConfig(spec.config));
}

export function parseFacetModelWithScale(spec: TopLevel<FacetSpec>) {
  const model = parseFacetModel(spec);
  model.parseScale();
  return model;
}

export function parseRepeatModel(spec: TopLevel<RepeatSpec>) {
  return new RepeatModel(spec, null, '', undefined, initConfig(spec.config));
}

export function parseConcatModel(spec: TopLevel<ConcatSpec>) {
  return new ConcatModel(spec, null, '', undefined, initConfig(spec.config));
}
