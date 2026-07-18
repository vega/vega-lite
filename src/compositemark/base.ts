import {Encoding} from '../encoding.js';
import {GenericMarkDef, getMarkType} from '../mark.js';
import {NonFacetUnitNormalizer, Normalize, NormalizerParams} from '../normalize/base.js';
import {GenericSpec} from '../spec/index.js';
import {GenericLayerSpec, NormalizedLayerSpec} from '../spec/layer.js';
import {GenericUnitSpec, isUnitSpec, NormalizedUnitSpec} from '../spec/unit.js';
import {FieldName} from '../channeldef.js';

// TODO: replace string with Mark
export type CompositeMarkUnitSpec<M extends string> = GenericUnitSpec<any, M | GenericMarkDef<M>>;

export class CompositeMarkNormalizer<M extends string> implements NonFacetUnitNormalizer<CompositeMarkUnitSpec<M>> {
  constructor(
    public name: string,
    public run: (
      spec: CompositeMarkUnitSpec<M>,
      params: NormalizerParams,
      normalize: Normalize<
        // Input of the normalize method
        GenericUnitSpec<Encoding<FieldName>, M> | GenericLayerSpec<any>,
        // Output of the normalize method
        NormalizedLayerSpec | NormalizedUnitSpec
      >,
    ) => NormalizedLayerSpec | NormalizedUnitSpec,
  ) {}

  public hasMatchingType(spec: GenericSpec<any, any, any, any>): spec is CompositeMarkUnitSpec<M> {
    if (isUnitSpec(spec)) {
      return getMarkType(spec.mark) === this.name;
    }
    return false;
  }
}
