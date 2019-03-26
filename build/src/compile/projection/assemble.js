import * as tslib_1 from "tslib";
import { contains } from '../../util';
import { isSignalRef } from '../../vega.schema';
import { isConcatModel, isLayerModel, isRepeatModel } from '../model';
export function assembleProjections(model) {
    if (isLayerModel(model) || isConcatModel(model) || isRepeatModel(model)) {
        return assembleProjectionsForModelAndChildren(model);
    }
    else {
        return assembleProjectionForModel(model);
    }
}
export function assembleProjectionsForModelAndChildren(model) {
    return model.children.reduce((projections, child) => {
        return projections.concat(child.assembleProjections());
    }, assembleProjectionForModel(model));
}
export function assembleProjectionForModel(model) {
    const component = model.component.projection;
    if (!component || component.merged) {
        return [];
    }
    const projection = component.combine();
    const { name } = projection, rest = tslib_1.__rest(projection, ["name"]); // we need to extract name so that it is always present in the output and pass TS type validation
    const size = {
        signal: `[${component.size.map(ref => ref.signal).join(', ')}]`
    };
    const fit = component.data.reduce((sources, data) => {
        const source = isSignalRef(data) ? data.signal : `data('${model.lookupDataSource(data)}')`;
        if (!contains(sources, source)) {
            // build a unique list of sources
            sources.push(source);
        }
        return sources;
    }, []);
    if (fit.length <= 0) {
        throw new Error("Projection's fit didn't find any data sources");
    }
    return [
        Object.assign({ name,
            size, fit: {
                signal: fit.length > 1 ? `[${fit.join(', ')}]` : fit[0]
            } }, rest)
    ];
}
//# sourceMappingURL=assemble.js.map