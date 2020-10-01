import {Parameter} from '../parameter';
import {isParameterSelection, SelectionDef} from '../selection';
import {isUnitSpec, NormalizedLayerSpec, NormalizedSpec, NormalizedUnitSpec, TopLevel, UnitSpec} from '../spec';
import {SpecMapper} from '../spec/map';
import {NormalizerParams} from './base';

export class TopLevelSelectionsNormalizer extends SpecMapper<NormalizerParams, NormalizedUnitSpec> {
  public map(spec: TopLevel<NormalizedSpec>, normParams: NormalizerParams): TopLevel<NormalizedSpec> {
    const selections = normParams.selections ?? [];
    if (spec.params && !isUnitSpec(spec)) {
      const params: Parameter[] = [];
      for (const param of spec.params) {
        if (isParameterSelection(param)) {
          selections.push(param);
        } else {
          params.push(param);
        }
      }

      spec.params = params;
    }

    normParams.selections = selections;
    return super.map(spec, normParams);
  }

  public mapUnit(spec: UnitSpec, normParams: NormalizerParams): NormalizedUnitSpec | NormalizedLayerSpec {
    const selections = normParams.selections;
    if (!selections || !selections.length) return spec as NormalizedUnitSpec;

    const params: SelectionDef[] = [];
    for (const selection of selections) {
      if (!selection.views || !selection.views.length || selection.views.indexOf(spec.name) >= 0) {
        params.push(selection);
      }
    }

    spec.params = params;
    return spec as NormalizedUnitSpec;
  }
}
