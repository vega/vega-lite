import {isArray, isString} from 'vega';
import {Field} from '../channeldef';
import {VariableParameter} from '../parameter';
import {isSelectionParameter, SelectionParameter} from '../selection';
import {
  BaseSpec,
  isUnitSpec,
  NormalizedLayerSpec,
  NormalizedSpec,
  NormalizedUnitSpec,
  TopLevel,
  UnitSpec
} from '../spec';
import {SpecMapper} from '../spec/map';
import {NormalizerParams} from './base';

export class TopLevelSelectionsNormalizer extends SpecMapper<NormalizerParams, NormalizedUnitSpec> {
  public map(spec: TopLevel<NormalizedSpec>, normParams: NormalizerParams): TopLevel<NormalizedSpec> {
    const selections = normParams.selections ?? [];
    if (spec.params && !isUnitSpec(spec)) {
      const params: VariableParameter[] = [];
      for (const param of spec.params) {
        if (isSelectionParameter(param)) {
          selections.push(param);
        } else {
          params.push(param);
        }
      }

      spec.params = params;
    }

    normParams.selections = selections;
    return super.map(spec, addSpecNameToParams(spec, normParams));
  }

  public mapUnit(spec: UnitSpec<Field>, normParams: NormalizerParams): NormalizedUnitSpec | NormalizedLayerSpec {
    const selections = normParams.selections;
    if (!selections || !selections.length) return spec as NormalizedUnitSpec;

    const path = (normParams.path ?? []).concat(spec.name);
    const params: SelectionParameter[] = [];

    for (const selection of selections) {
      // By default, apply selections to all unit views.
      if (!selection.views || !selection.views.length) {
        params.push(selection);
      } else {
        for (const view of selection.views) {
          // view is either a specific unit name, or a partial path through the spec tree.
          if (
            (isString(view) && (view === spec.name || path.indexOf(view) >= 0)) ||
            (isArray(view) &&
              view.map(v => path.indexOf(v)).every((v, i, arr) => v !== -1 && (i === 0 || v > arr[i - 1])))
          ) {
            params.push(selection);
          }
        }
      }
    }

    if (params.length) spec.params = params;
    return spec as NormalizedUnitSpec;
  }
}

for (const method of ['mapFacet', 'mapRepeat', 'mapHConcat', 'mapVConcat', 'mapLayer']) {
  const proto = TopLevelSelectionsNormalizer.prototype[method];
  TopLevelSelectionsNormalizer.prototype[method] = function (spec: BaseSpec, params: NormalizerParams) {
    return proto.call(this, spec, addSpecNameToParams(spec, params));
  };
}

function addSpecNameToParams(spec: BaseSpec, params: NormalizerParams) {
  return spec.name
    ? {
        ...params,
        path: (params.path ?? []).concat(spec.name)
      }
    : params;
}
