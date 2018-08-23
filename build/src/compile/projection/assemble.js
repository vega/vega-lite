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
    return model.children.reduce(function (projections, child) {
        return projections.concat(child.assembleProjections());
    }, assembleProjectionForModel(model));
}
export function assembleProjectionForModel(model) {
    var component = model.component.projection;
    if (!component || component.merged) {
        return [];
    }
    var projection = component.combine();
    var name = projection.name, rest = tslib_1.__rest(projection, ["name"]); // we need to extract name so that it is always present in the output and pass TS type validation
    var size = {
        signal: "[" + component.size.map(function (ref) { return ref.signal; }).join(', ') + "]"
    };
    var fit = component.data.reduce(function (sources, data) {
        var source = isSignalRef(data) ? data.signal : "data('" + model.lookupDataSource(data) + "')";
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
        tslib_1.__assign({ name: name,
            size: size, fit: {
                signal: fit.length > 1 ? "[" + fit.join(', ') + "]" : fit[0]
            } }, rest)
    ];
}
//# sourceMappingURL=assemble.js.map