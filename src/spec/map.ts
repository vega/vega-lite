import {GenericSpec} from './index.js';
import * as log from '../log/index.js';
import {Field, FieldName} from '../channeldef.js';
import {
  GenericConcatSpec,
  GenericHConcatSpec,
  GenericVConcatSpec,
  isConcatSpec,
  isHConcatSpec,
  isVConcatSpec,
} from './concat.js';
import {GenericFacetSpec, isFacetSpec} from './facet.js';
import {GenericLayerSpec, isLayerSpec} from './layer.js';
import {isRepeatSpec, RepeatSpec} from './repeat.js';
import {GenericUnitSpec, isUnitSpec, NormalizedUnitSpec} from './unit.js';

export abstract class SpecMapper<
  P,
  UI extends GenericUnitSpec<any, any>,
  LI extends GenericLayerSpec<any> = GenericLayerSpec<UI>,
  UO extends GenericUnitSpec<any, any> = NormalizedUnitSpec,
  RO extends RepeatSpec = never,
  FO extends Field = FieldName,
> {
  public map(spec: GenericSpec<UI, LI, RepeatSpec, Field>, params: P): GenericSpec<UO, GenericLayerSpec<UO>, RO, FO> {
    if (isFacetSpec(spec)) {
      return this.mapFacet(spec, params);
    } else if (isRepeatSpec(spec)) {
      return this.mapRepeat(spec, params);
    } else if (isHConcatSpec(spec)) {
      return this.mapHConcat(spec, params);
    } else if (isVConcatSpec(spec)) {
      return this.mapVConcat(spec, params);
    } else if (isConcatSpec(spec)) {
      return this.mapConcat(spec, params);
    } else {
      return this.mapLayerOrUnit(spec, params);
    }
  }

  public mapLayerOrUnit(spec: UI | LI, params: P): UO | GenericLayerSpec<UO> {
    if (isLayerSpec(spec)) {
      return this.mapLayer(spec, params);
    } else if (isUnitSpec(spec)) {
      return this.mapUnit(spec, params);
    }
    throw new Error(log.message.invalidSpec(spec));
  }

  public abstract mapUnit(spec: UI, params: P): UO | GenericLayerSpec<UO>;

  protected mapLayer(spec: LI, params: P): GenericLayerSpec<UO> {
    return {
      ...spec,
      layer: spec.layer.map((subspec) => this.mapLayerOrUnit(subspec, params)),
    };
  }

  protected mapHConcat(
    spec: GenericHConcatSpec<GenericSpec<UI, LI, RepeatSpec, Field>>,
    params: P,
  ): GenericHConcatSpec<GenericSpec<UO, GenericLayerSpec<UO>, RO, FO>> {
    return {
      ...spec,
      hconcat: spec.hconcat.map((subspec) => this.map(subspec, params)),
    };
  }

  protected mapVConcat(
    spec: GenericVConcatSpec<GenericSpec<UI, LI, RepeatSpec, Field>>,
    params: P,
  ): GenericVConcatSpec<GenericSpec<UO, GenericLayerSpec<UO>, RO, FO>> {
    return {
      ...spec,
      vconcat: spec.vconcat.map((subspec) => this.map(subspec, params)),
    };
  }

  protected mapConcat(
    spec: GenericConcatSpec<GenericSpec<UI, LI, RepeatSpec, Field>>,
    params: P,
  ): GenericConcatSpec<GenericSpec<UO, GenericLayerSpec<UO>, RO, FO>> {
    const {concat, ...rest} = spec;

    return {
      ...rest,
      concat: concat.map((subspec) => this.map(subspec, params)),
    };
  }

  protected mapFacet(spec: GenericFacetSpec<UI, LI, Field>, params: P): GenericFacetSpec<UO, GenericLayerSpec<UO>, FO> {
    return {
      // as any is required here since TS cannot infer that FO may only be FieldName or Field, but not RepeatRef
      ...(spec as any),
      // TODO: remove "any" once we support all facet listed in https://github.com/vega/vega-lite/issues/2760
      spec: this.map(spec.spec, params) as any,
    };
  }

  protected mapRepeat(spec: RepeatSpec, params: P): GenericSpec<UO, any, RO, FO> {
    return {
      ...spec,
      // as any is required here since TS cannot infer that the output type satisfies the input type
      spec: this.map(spec.spec as any, params),
    };
  }
}
