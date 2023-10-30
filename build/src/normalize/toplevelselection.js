import { isArray, isString } from 'vega';
import { isSelectionParameter } from '../selection';
import { isUnitSpec } from '../spec';
import { SpecMapper } from '../spec/map';
export class TopLevelSelectionsNormalizer extends SpecMapper {
    map(spec, normParams) {
        const selections = normParams.selections ?? [];
        if (spec.params && !isUnitSpec(spec)) {
            const params = [];
            for (const param of spec.params) {
                if (isSelectionParameter(param)) {
                    selections.push(param);
                }
                else {
                    params.push(param);
                }
            }
            spec.params = params;
        }
        normParams.selections = selections;
        return super.map(spec, normParams);
    }
    mapUnit(spec, normParams) {
        const selections = normParams.selections;
        if (!selections || !selections.length)
            return spec;
        const path = (normParams.path ?? []).concat(spec.name);
        const params = [];
        for (const selection of selections) {
            // By default, apply selections to all unit views.
            if (!selection.views || !selection.views.length) {
                params.push(selection);
            }
            else {
                for (const view of selection.views) {
                    // view is either a specific unit name, or a partial path through the spec tree.
                    if ((isString(view) && (view === spec.name || path.includes(view))) ||
                        (isArray(view) &&
                            // logic for backwards compatibility with view paths before we had unique names
                            // @ts-ignore
                            view.map(v => path.indexOf(v)).every((v, i, arr) => v !== -1 && (i === 0 || v > arr[i - 1])))) {
                        params.push(selection);
                    }
                }
            }
        }
        if (params.length)
            spec.params = params;
        return spec;
    }
}
for (const method of ['mapFacet', 'mapRepeat', 'mapHConcat', 'mapVConcat', 'mapLayer']) {
    const proto = TopLevelSelectionsNormalizer.prototype[method];
    TopLevelSelectionsNormalizer.prototype[method] = function (spec, params) {
        return proto.call(this, spec, addSpecNameToParams(spec, params));
    };
}
function addSpecNameToParams(spec, params) {
    return spec.name
        ? {
            ...params,
            path: (params.path ?? []).concat(spec.name)
        }
        : params;
}
//# sourceMappingURL=toplevelselection.js.map