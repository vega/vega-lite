import {SignalRef} from 'vega';
import {Config} from '../config';
import * as log from '../log';
import {isAnyConcatSpec, isFacetSpec, isLayerSpec, isUnitSpec, LayoutSizeMixins, NormalizedSpec} from '../spec';
import {ConcatModel} from './concat';
import {FacetModel} from './facet';
import {LayerModel} from './layer';
import {Model} from './model';
import {UnitModel} from './unit';

export function buildModel(
  spec: NormalizedSpec,
  parent: Model,
  parentGivenName: string,
  unitSize: LayoutSizeMixins,
  config: Config<SignalRef>
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
