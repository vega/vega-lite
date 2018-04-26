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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9wcm9qZWN0aW9uL2Fzc2VtYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFvQztBQUNwQyxpREFBMkU7QUFDM0Usa0NBQTJFO0FBRTNFLDZCQUFvQyxLQUFZO0lBQzlDLElBQUksb0JBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxxQkFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLHFCQUFhLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDdkUsT0FBTyxzQ0FBc0MsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN0RDtTQUFNO1FBQ0wsT0FBTywwQkFBMEIsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMxQztBQUNILENBQUM7QUFORCxrREFNQztBQUVELGdEQUF1RCxLQUFZO0lBQ2pFLE9BQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBQyxXQUFXLEVBQUUsS0FBSztRQUM5QyxPQUFPLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQztJQUN6RCxDQUFDLEVBQUUsMEJBQTBCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN4QyxDQUFDO0FBSkQsd0ZBSUM7QUFFRCxvQ0FBMkMsS0FBWTtJQUNyRCxJQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztJQUM3QyxJQUFJLENBQUMsU0FBUyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEVBQUU7UUFDbEMsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUVELElBQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNoQyxJQUFBLHNCQUFJLEVBQUUsMkNBQU8sQ0FBZSxDQUFFLGlHQUFpRztJQUV0SSxJQUFNLElBQUksR0FBZ0I7UUFDeEIsTUFBTSxFQUFFLE1BQUksU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxHQUFHLElBQUssT0FBQSxHQUFHLENBQUMsTUFBTSxFQUFWLENBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBRztLQUNsRSxDQUFDO0lBRUYsSUFBTSxHQUFHLEdBQWEsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBQyxPQUFPLEVBQUUsSUFBSTtRQUN4RCxJQUFNLE1BQU0sR0FBVywyQkFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxXQUFTLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsT0FBSSxDQUFDO1FBQ3JHLElBQUksQ0FBQyxlQUFRLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQzlCLGlDQUFpQztZQUNqQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3RCO1FBQ0QsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRVAsSUFBSSxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtRQUNuQixNQUFNLElBQUksS0FBSyxDQUFDLCtDQUErQyxDQUFDLENBQUM7S0FDbEU7SUFFRCxPQUFPLG9CQUNMLElBQUksTUFBQTtZQUNKLElBQUksTUFBQSxFQUNKLEdBQUcsRUFBRTtnQkFDSCxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ3hELElBQ0UsSUFBSSxFQUNQLENBQUM7QUFDTCxDQUFDO0FBbENELGdFQWtDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Y29udGFpbnN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtpc1ZnU2lnbmFsUmVmLCBWZ1Byb2plY3Rpb24sIFZnU2lnbmFsUmVmfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2lzQ29uY2F0TW9kZWwsIGlzTGF5ZXJNb2RlbCwgaXNSZXBlYXRNb2RlbCwgTW9kZWx9IGZyb20gJy4uL21vZGVsJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VtYmxlUHJvamVjdGlvbnMobW9kZWw6IE1vZGVsKTogVmdQcm9qZWN0aW9uW10ge1xuICBpZiAoaXNMYXllck1vZGVsKG1vZGVsKSB8fCBpc0NvbmNhdE1vZGVsKG1vZGVsKSB8fCBpc1JlcGVhdE1vZGVsKG1vZGVsKSkge1xuICAgIHJldHVybiBhc3NlbWJsZVByb2plY3Rpb25zRm9yTW9kZWxBbmRDaGlsZHJlbihtb2RlbCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGFzc2VtYmxlUHJvamVjdGlvbkZvck1vZGVsKG1vZGVsKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZW1ibGVQcm9qZWN0aW9uc0Zvck1vZGVsQW5kQ2hpbGRyZW4obW9kZWw6IE1vZGVsKTogVmdQcm9qZWN0aW9uW10ge1xuICByZXR1cm4gbW9kZWwuY2hpbGRyZW4ucmVkdWNlKChwcm9qZWN0aW9ucywgY2hpbGQpID0+IHtcbiAgICByZXR1cm4gcHJvamVjdGlvbnMuY29uY2F0KGNoaWxkLmFzc2VtYmxlUHJvamVjdGlvbnMoKSk7XG4gIH0sIGFzc2VtYmxlUHJvamVjdGlvbkZvck1vZGVsKG1vZGVsKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlbWJsZVByb2plY3Rpb25Gb3JNb2RlbChtb2RlbDogTW9kZWwpOiBWZ1Byb2plY3Rpb25bXSB7XG4gIGNvbnN0IGNvbXBvbmVudCA9IG1vZGVsLmNvbXBvbmVudC5wcm9qZWN0aW9uO1xuICBpZiAoIWNvbXBvbmVudCB8fCBjb21wb25lbnQubWVyZ2VkKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgcHJvamVjdGlvbiA9IGNvbXBvbmVudC5jb21iaW5lKCk7XG4gIGNvbnN0IHtuYW1lLCAuLi5yZXN0fSA9IHByb2plY3Rpb247ICAvLyB3ZSBuZWVkIHRvIGV4dHJhY3QgbmFtZSBzbyB0aGF0IGl0IGlzIGFsd2F5cyBwcmVzZW50IGluIHRoZSBvdXRwdXQgYW5kIHBhc3MgVFMgdHlwZSB2YWxpZGF0aW9uXG5cbiAgY29uc3Qgc2l6ZTogVmdTaWduYWxSZWYgPSB7XG4gICAgc2lnbmFsOiBgWyR7Y29tcG9uZW50LnNpemUubWFwKChyZWYpID0+IHJlZi5zaWduYWwpLmpvaW4oJywgJyl9XWBcbiAgfTtcblxuICBjb25zdCBmaXQ6IHN0cmluZ1tdID0gY29tcG9uZW50LmRhdGEucmVkdWNlKChzb3VyY2VzLCBkYXRhKSA9PiB7XG4gICAgY29uc3Qgc291cmNlOiBzdHJpbmcgPSBpc1ZnU2lnbmFsUmVmKGRhdGEpID8gZGF0YS5zaWduYWwgOiBgZGF0YSgnJHttb2RlbC5sb29rdXBEYXRhU291cmNlKGRhdGEpfScpYDtcbiAgICBpZiAoIWNvbnRhaW5zKHNvdXJjZXMsIHNvdXJjZSkpIHtcbiAgICAgIC8vIGJ1aWxkIGEgdW5pcXVlIGxpc3Qgb2Ygc291cmNlc1xuICAgICAgc291cmNlcy5wdXNoKHNvdXJjZSk7XG4gICAgfVxuICAgIHJldHVybiBzb3VyY2VzO1xuICB9LCBbXSk7XG5cbiAgaWYgKGZpdC5sZW5ndGggPD0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlByb2plY3Rpb24ncyBmaXQgZGlkbid0IGZpbmQgYW55IGRhdGEgc291cmNlc1wiKTtcbiAgfVxuXG4gIHJldHVybiBbe1xuICAgIG5hbWUsXG4gICAgc2l6ZSxcbiAgICBmaXQ6IHtcbiAgICAgIHNpZ25hbDogZml0Lmxlbmd0aCA+IDEgPyBgWyR7Zml0LmpvaW4oJywgJyl9XWAgOiBmaXRbMF1cbiAgICB9LFxuICAgIC4uLnJlc3RcbiAgfV07XG59XG4iXX0=