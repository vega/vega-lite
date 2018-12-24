import * as log from '../log';
import {GenericHConcatSpec, GenericVConcatSpec, isHConcatSpec, isVConcatSpec} from './concat';
import {GenericFacetSpec, isFacetSpec} from './facet';
import {GenericSpec} from './index';
import {GenericLayerSpec, isLayerSpec} from './layer';
import {GenericRepeatSpec, isRepeatSpec} from './repeat';
import {GenericUnitSpec, isUnitSpec, NormalizedUnitSpec} from './unit';

export abstract class SpecMapper<
  P,
  UI extends GenericUnitSpec<any, any>,
  LI extends GenericLayerSpec<any> = GenericLayerSpec<UI>,
  UO extends GenericUnitSpec<any, any> = NormalizedUnitSpec
> {
  public map(spec: GenericSpec<UI, LI>, params: P): GenericSpec<UO, GenericLayerSpec<UO>> {
    if (isFacetSpec(spec)) {
      return this.mapFacet(spec, params);
    } else if (isRepeatSpec(spec)) {
      return this.mapRepeat(spec, params);
    } else if (isHConcatSpec(spec)) {
      return this.mapHConcat(spec, params);
    } else if (isVConcatSpec(spec)) {
      return this.mapVConcat(spec, params);
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
    throw new Error(log.message.INVALID_SPEC);
  }

  public abstract mapUnit(spec: UI, params: P): UO;
  protected mapLayer(spec: LI, params: P): GenericLayerSpec<UO> {
    const {layer, ...rest} = spec;

    return {
      ...rest,
      layer: layer.map(subspec => this.mapLayerOrUnit(subspec, params))
    };
  }

  protected mapHConcat(spec: GenericHConcatSpec<UI, LI>, params: P): GenericHConcatSpec<UO, GenericLayerSpec<UO>> {
    return {
      ...spec,
      hconcat: spec.hconcat.map(subspec => this.map(subspec, params))
    };
  }

  protected mapVConcat(spec: GenericVConcatSpec<UI, LI>, params: P): GenericVConcatSpec<UO, GenericLayerSpec<UO>> {
    return {
      ...spec,
      vconcat: spec.vconcat.map(subspec => this.map(subspec, params))
    };
  }

  protected mapFacet(spec: GenericFacetSpec<UI, LI>, params: P): GenericFacetSpec<UO, GenericLayerSpec<UO>> {
    return {
      ...spec,
      // TODO: remove "any" once we support all facet listed in https://github.com/vega/vega-lite/issues/2760
      spec: this.map(spec.spec, params) as any
    };
  }

  protected mapRepeat(spec: GenericRepeatSpec<UI, LI>, params: P): GenericRepeatSpec<UO, GenericLayerSpec<UO>> {
    return {
      ...spec,
      spec: this.map(spec.spec, params)
    };
  }
}
