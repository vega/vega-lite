"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("../../util");
var vega_schema_1 = require("../../vega.schema");
var model_1 = require("../model");
function assembleProjections(model) {
    if (model_1.isLayerModel(model) || model_1.isConcatModel(model) || model_1.isRepeatModel(model)) {
        return assembleProjectionsForModelAndChildren(model);
    }
    else {
        return assembleProjectionForModel(model);
    }
}
exports.assembleProjections = assembleProjections;
function assembleProjectionsForModelAndChildren(model) {
    return model.children.reduce(function (projections, child) {
        return projections.concat(child.assembleProjections());
    }, assembleProjectionForModel(model));
}
exports.assembleProjectionsForModelAndChildren = assembleProjectionsForModelAndChildren;
function assembleProjectionForModel(model) {
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
        var source = vega_schema_1.isVgSignalRef(data) ? data.signal : "data('" + model.lookupDataSource(data) + "')";
        if (!util_1.contains(sources, source)) {
            // build a unique list of sources
            sources.push(source);
        }
        return sources;
    }, []);
    if (fit.length <= 0) {
        throw new Error("Projection's fit didn't find any data sources");
    }
    return [tslib_1.__assign({ name: name,
            size: size, fit: {
                signal: fit.length > 1 ? "[" + fit.join(', ') + "]" : fit[0]
            } }, rest)];
}
exports.assembleProjectionForModel = assembleProjectionForModel;
//# sourceMappingURL=assemble.js.map