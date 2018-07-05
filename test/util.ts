import {buildModel} from '../src/compile/buildmodel';
import {ConcatModel} from '../src/compile/concat';
import {FacetModel} from '../src/compile/facet';
import {LayerModel} from '../src/compile/layer';
import {Model} from '../src/compile/model';
import {RepeatModel} from '../src/compile/repeat';
import {UnitModel} from '../src/compile/unit';
import {initConfig} from '../src/config';
import {
  normalize,
  NormalizedConcatSpec,
  NormalizedFacetSpec,
  NormalizedLayerSpec,
  NormalizedRepeatSpec,
  NormalizedUnitSpec,
  TopLevel,
  TopLevelSpec
} from '../src/spec';
import {isLayerSpec, isUnitSpec} from '../src/spec';
import {normalizeAutoSize} from '../src/toplevelprops';

export function parseModel(inputSpec: TopLevelSpec): Model {
  const config = initConfig(inputSpec.config);
  const spec = normalize(inputSpec, config);
  const autosize = normalizeAutoSize(inputSpec.autosize, config.autosize, isLayerSpec(spec) || isUnitSpec(spec));
  return buildModel(spec, null, '', undefined, undefined, config, autosize.type === 'fit');
}

export function parseModelWithScale(inputSpec: TopLevelSpec): Model {
  const model = parseModel(inputSpec);
  model.parseScale();
  return model;
}

export function parseUnitModel(spec: TopLevel<NormalizedUnitSpec>) {
  return new UnitModel(
    spec,
    null,
    '',
    undefined,
    undefined,
    initConfig(spec.config),
    normalizeAutoSize(spec.autosize, spec.config ? spec.config.autosize : undefined, true).type === 'fit'
  );
}

export function parseUnitModelWithScale(spec: TopLevel<NormalizedUnitSpec>) {
  const model = parseUnitModel(spec);
  model.parseScale();
  return model;
}

export function parseUnitModelWithScaleAndLayoutSize(spec: TopLevel<NormalizedUnitSpec>) {
  const model = parseUnitModelWithScale(spec);
  model.parseLayoutSize();
  return model;
}

export function parseLayerModel(spec: TopLevel<NormalizedLayerSpec>) {
  return new LayerModel(
    spec,
    null,
    '',
    undefined,
    undefined,
    initConfig(spec.config),
    normalizeAutoSize(spec.autosize, spec.config ? spec.config.autosize : undefined, true).type === 'fit'
  );
}

export function parseFacetModel(spec: TopLevel<NormalizedFacetSpec>) {
  return new FacetModel(spec, null, '', undefined, initConfig(spec.config));
}

export function parseFacetModelWithScale(spec: TopLevel<NormalizedFacetSpec>) {
  const model = parseFacetModel(spec);
  model.parseScale();
  return model;
}

export function parseRepeatModel(spec: TopLevel<NormalizedRepeatSpec>) {
  return new RepeatModel(spec, null, '', undefined, initConfig(spec.config));
}

export function parseConcatModel(spec: TopLevel<NormalizedConcatSpec>) {
  return new ConcatModel(spec, null, '', undefined, initConfig(spec.config));
}
