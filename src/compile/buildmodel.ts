import type {ExprRef, SignalRef} from 'vega';
import {Config} from '../config';
import * as log from '../log';
import {isAnyConcatSpec, isFacetSpec, isLayerSpec, isUnitSpec, LayoutSizeMixins, NormalizedSpec} from '../spec';
import {ConcatModel} from './concat';
import {FacetModel} from './facet';
import {LayerModel} from './layer';
import {Model} from './model';
import {UnitModel} from './unit';
import {SubstituteType} from '../vega.schema';

export function buildModel(
  spec: SubstituteType<NormalizedSpec, ExprRef, SignalRef>,
  parent: Model,
  parentGivenName: string,
  unitSize: LayoutSizeMixins,
  config: Config<SignalRef>
): Model {
  if (isFacetSpec(spec)) {
    return new FacetModel(spec, parent, parentGivenName, config);
  } else if (isLayerSpec(spec)) {
    return new LayerModel(spec, parent, parentGivenName, unitSize, config);
  } else if (isUnitSpec<SignalRef>(spec)) {
    return new UnitModel(spec, parent, parentGivenName, unitSize, config);
  } else if (isAnyConcatSpec(spec)) {
    return new ConcatModel(spec, parent, parentGivenName, config);
  }
  throw new Error(log.message.invalidSpec(spec));
}
