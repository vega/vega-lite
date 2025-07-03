import type {SignalRef} from 'vega';
import {Config} from '../config.js';
import * as log from '../log/index.js';
import {
  isAnyConcatSpec,
  isFacetSpec,
  isLayerSpec,
  isUnitSpec,
  LayoutSizeMixins,
  NormalizedSpec,
} from '../spec/index.js';
import {ConcatModel} from './concat.js';
import {FacetModel} from './facet.js';
import {LayerModel} from './layer.js';
import {Model} from './model.js';
import {UnitModel} from './unit.js';

export function buildModel(
  spec: NormalizedSpec,
  parent: Model,
  parentGivenName: string,
  unitSize: LayoutSizeMixins,
  config: Config<SignalRef>,
): Model {
  if (isFacetSpec(spec)) {
    return new FacetModel(spec, parent, parentGivenName, config);
  } else if (isLayerSpec(spec)) {
    return new LayerModel(spec, parent, parentGivenName, unitSize, config);
  } else if (isUnitSpec(spec)) {
    return new UnitModel(spec, parent, parentGivenName, unitSize, config);
  } else if (isAnyConcatSpec(spec)) {
    return new ConcatModel(spec, parent, parentGivenName, config);
  }
  throw new Error(log.message.invalidSpec(spec));
}
