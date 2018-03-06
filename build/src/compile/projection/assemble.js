"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
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
    var name = projection.name, rest = __rest(projection, ["name"]); // we need to extract name so that it is always present in the output and pass TS type validation
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
    return [__assign({ name: name,
            size: size, fit: {
                signal: fit.length > 1 ? "[" + fit.join(', ') + "]" : fit[0]
            } }, rest)];
}
exports.assembleProjectionForModel = assembleProjectionForModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9wcm9qZWN0aW9uL2Fzc2VtYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBb0M7QUFDcEMsaURBQTJFO0FBQzNFLGtDQUEyRTtBQUUzRSw2QkFBb0MsS0FBWTtJQUM5QyxFQUFFLENBQUMsQ0FBQyxvQkFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLHFCQUFhLENBQUMsS0FBSyxDQUFDLElBQUkscUJBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEUsTUFBTSxDQUFDLHNDQUFzQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLE1BQU0sQ0FBQywwQkFBMEIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzQyxDQUFDO0FBQ0gsQ0FBQztBQU5ELGtEQU1DO0FBRUQsZ0RBQXVELEtBQVk7SUFDakUsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQUMsV0FBVyxFQUFFLEtBQUs7UUFDOUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQztJQUN6RCxDQUFDLEVBQUUsMEJBQTBCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN4QyxDQUFDO0FBSkQsd0ZBSUM7QUFFRCxvQ0FBMkMsS0FBWTtJQUNyRCxJQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztJQUM3QyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNuQyxNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVELElBQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNoQyxJQUFBLHNCQUFJLEVBQUUsbUNBQU8sQ0FBZSxDQUFFLGlHQUFpRztJQUV0SSxJQUFNLElBQUksR0FBZ0I7UUFDeEIsTUFBTSxFQUFFLE1BQUksU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxHQUFHLElBQUssT0FBQSxHQUFHLENBQUMsTUFBTSxFQUFWLENBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBRztLQUNsRSxDQUFDO0lBRUYsSUFBTSxHQUFHLEdBQWEsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBQyxPQUFPLEVBQUUsSUFBSTtRQUN4RCxJQUFNLE1BQU0sR0FBVywyQkFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxXQUFTLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsT0FBSSxDQUFDO1FBQ3JHLEVBQUUsQ0FBQyxDQUFDLENBQUMsZUFBUSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0IsaUNBQWlDO1lBQ2pDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkIsQ0FBQztRQUNELE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDakIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRVAsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMsK0NBQStDLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRUQsTUFBTSxDQUFDLFlBQ0wsSUFBSSxNQUFBO1lBQ0osSUFBSSxNQUFBLEVBQ0osR0FBRyxFQUFFO2dCQUNILE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDeEQsSUFDRSxJQUFJLEVBQ1AsQ0FBQztBQUNMLENBQUM7QUFsQ0QsZ0VBa0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtjb250YWluc30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge2lzVmdTaWduYWxSZWYsIFZnUHJvamVjdGlvbiwgVmdTaWduYWxSZWZ9IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7aXNDb25jYXRNb2RlbCwgaXNMYXllck1vZGVsLCBpc1JlcGVhdE1vZGVsLCBNb2RlbH0gZnJvbSAnLi4vbW9kZWwnO1xuXG5leHBvcnQgZnVuY3Rpb24gYXNzZW1ibGVQcm9qZWN0aW9ucyhtb2RlbDogTW9kZWwpOiBWZ1Byb2plY3Rpb25bXSB7XG4gIGlmIChpc0xheWVyTW9kZWwobW9kZWwpIHx8IGlzQ29uY2F0TW9kZWwobW9kZWwpIHx8IGlzUmVwZWF0TW9kZWwobW9kZWwpKSB7XG4gICAgcmV0dXJuIGFzc2VtYmxlUHJvamVjdGlvbnNGb3JNb2RlbEFuZENoaWxkcmVuKG1vZGVsKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYXNzZW1ibGVQcm9qZWN0aW9uRm9yTW9kZWwobW9kZWwpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlbWJsZVByb2plY3Rpb25zRm9yTW9kZWxBbmRDaGlsZHJlbihtb2RlbDogTW9kZWwpOiBWZ1Byb2plY3Rpb25bXSB7XG4gIHJldHVybiBtb2RlbC5jaGlsZHJlbi5yZWR1Y2UoKHByb2plY3Rpb25zLCBjaGlsZCkgPT4ge1xuICAgIHJldHVybiBwcm9qZWN0aW9ucy5jb25jYXQoY2hpbGQuYXNzZW1ibGVQcm9qZWN0aW9ucygpKTtcbiAgfSwgYXNzZW1ibGVQcm9qZWN0aW9uRm9yTW9kZWwobW9kZWwpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VtYmxlUHJvamVjdGlvbkZvck1vZGVsKG1vZGVsOiBNb2RlbCk6IFZnUHJvamVjdGlvbltdIHtcbiAgY29uc3QgY29tcG9uZW50ID0gbW9kZWwuY29tcG9uZW50LnByb2plY3Rpb247XG4gIGlmICghY29tcG9uZW50IHx8IGNvbXBvbmVudC5tZXJnZWQpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjb25zdCBwcm9qZWN0aW9uID0gY29tcG9uZW50LmNvbWJpbmUoKTtcbiAgY29uc3Qge25hbWUsIC4uLnJlc3R9ID0gcHJvamVjdGlvbjsgIC8vIHdlIG5lZWQgdG8gZXh0cmFjdCBuYW1lIHNvIHRoYXQgaXQgaXMgYWx3YXlzIHByZXNlbnQgaW4gdGhlIG91dHB1dCBhbmQgcGFzcyBUUyB0eXBlIHZhbGlkYXRpb25cblxuICBjb25zdCBzaXplOiBWZ1NpZ25hbFJlZiA9IHtcbiAgICBzaWduYWw6IGBbJHtjb21wb25lbnQuc2l6ZS5tYXAoKHJlZikgPT4gcmVmLnNpZ25hbCkuam9pbignLCAnKX1dYFxuICB9O1xuXG4gIGNvbnN0IGZpdDogc3RyaW5nW10gPSBjb21wb25lbnQuZGF0YS5yZWR1Y2UoKHNvdXJjZXMsIGRhdGEpID0+IHtcbiAgICBjb25zdCBzb3VyY2U6IHN0cmluZyA9IGlzVmdTaWduYWxSZWYoZGF0YSkgPyBkYXRhLnNpZ25hbCA6IGBkYXRhKCcke21vZGVsLmxvb2t1cERhdGFTb3VyY2UoZGF0YSl9JylgO1xuICAgIGlmICghY29udGFpbnMoc291cmNlcywgc291cmNlKSkge1xuICAgICAgLy8gYnVpbGQgYSB1bmlxdWUgbGlzdCBvZiBzb3VyY2VzXG4gICAgICBzb3VyY2VzLnB1c2goc291cmNlKTtcbiAgICB9XG4gICAgcmV0dXJuIHNvdXJjZXM7XG4gIH0sIFtdKTtcblxuICBpZiAoZml0Lmxlbmd0aCA8PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiUHJvamVjdGlvbidzIGZpdCBkaWRuJ3QgZmluZCBhbnkgZGF0YSBzb3VyY2VzXCIpO1xuICB9XG5cbiAgcmV0dXJuIFt7XG4gICAgbmFtZSxcbiAgICBzaXplLFxuICAgIGZpdDoge1xuICAgICAgc2lnbmFsOiBmaXQubGVuZ3RoID4gMSA/IGBbJHtmaXQuam9pbignLCAnKX1dYCA6IGZpdFswXVxuICAgIH0sXG4gICAgLi4ucmVzdFxuICB9XTtcbn1cbiJdfQ==