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
var util_1 = require("util");
var util_2 = require("../../util");
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
        if (!util_2.contains(sources, source)) {
            // build a unique list of sources
            sources.push(source);
        }
        return sources;
    }, []);
    if (fit.length <= 0) {
        util_1.error("Projection's fit didn't find any data sources");
    }
    return [__assign({ name: name,
            size: size, fit: {
                signal: fit.length > 1 ? "[" + fit.join(', ') + "]" : fit[0]
            } }, rest)];
}
exports.assembleProjectionForModel = assembleProjectionForModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9wcm9qZWN0aW9uL2Fzc2VtYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2QkFBMkI7QUFDM0IsbUNBQW9DO0FBQ3BDLGlEQUEyRTtBQUMzRSxrQ0FBMkU7QUFFM0UsNkJBQW9DLEtBQVk7SUFDOUMsRUFBRSxDQUFDLENBQUMsb0JBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxxQkFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLHFCQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sQ0FBQyxzQ0FBc0MsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixNQUFNLENBQUMsMEJBQTBCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0MsQ0FBQztBQUNILENBQUM7QUFORCxrREFNQztBQUVELGdEQUF1RCxLQUFZO0lBQ2pFLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFDLFdBQVcsRUFBRSxLQUFLO1FBQzlDLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUM7SUFDekQsQ0FBQyxFQUFFLDBCQUEwQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDeEMsQ0FBQztBQUpELHdGQUlDO0FBRUQsb0NBQTJDLEtBQVk7SUFDckQsSUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7SUFDN0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDbkMsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFFRCxJQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDaEMsSUFBQSxzQkFBSSxFQUFFLG1DQUFPLENBQWUsQ0FBRSxpR0FBaUc7SUFFdEksSUFBTSxJQUFJLEdBQWdCO1FBQ3hCLE1BQU0sRUFBRSxNQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsR0FBRyxJQUFLLE9BQUEsR0FBRyxDQUFDLE1BQU0sRUFBVixDQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQUc7S0FDbEUsQ0FBQztJQUVGLElBQU0sR0FBRyxHQUFhLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQUMsT0FBTyxFQUFFLElBQUk7UUFDeEQsSUFBTSxNQUFNLEdBQVcsMkJBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBUyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE9BQUksQ0FBQztRQUNyRyxFQUFFLENBQUMsQ0FBQyxDQUFDLGVBQVEsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9CLGlDQUFpQztZQUNqQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZCLENBQUM7UUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ2pCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUVQLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQixZQUFLLENBQUMsK0NBQStDLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQsTUFBTSxDQUFDLFlBQ0wsSUFBSSxNQUFBO1lBQ0osSUFBSSxNQUFBLEVBQ0osR0FBRyxFQUFFO2dCQUNILE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDeEQsSUFDRSxJQUFJLEVBQ1AsQ0FBQztBQUNMLENBQUM7QUFsQ0QsZ0VBa0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtlcnJvcn0gZnJvbSAndXRpbCc7XG5pbXBvcnQge2NvbnRhaW5zfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7aXNWZ1NpZ25hbFJlZiwgVmdQcm9qZWN0aW9uLCBWZ1NpZ25hbFJlZn0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtpc0NvbmNhdE1vZGVsLCBpc0xheWVyTW9kZWwsIGlzUmVwZWF0TW9kZWwsIE1vZGVsfSBmcm9tICcuLi9tb2RlbCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlbWJsZVByb2plY3Rpb25zKG1vZGVsOiBNb2RlbCk6IFZnUHJvamVjdGlvbltdIHtcbiAgaWYgKGlzTGF5ZXJNb2RlbChtb2RlbCkgfHwgaXNDb25jYXRNb2RlbChtb2RlbCkgfHwgaXNSZXBlYXRNb2RlbChtb2RlbCkpIHtcbiAgICByZXR1cm4gYXNzZW1ibGVQcm9qZWN0aW9uc0Zvck1vZGVsQW5kQ2hpbGRyZW4obW9kZWwpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBhc3NlbWJsZVByb2plY3Rpb25Gb3JNb2RlbChtb2RlbCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VtYmxlUHJvamVjdGlvbnNGb3JNb2RlbEFuZENoaWxkcmVuKG1vZGVsOiBNb2RlbCk6IFZnUHJvamVjdGlvbltdIHtcbiAgcmV0dXJuIG1vZGVsLmNoaWxkcmVuLnJlZHVjZSgocHJvamVjdGlvbnMsIGNoaWxkKSA9PiB7XG4gICAgcmV0dXJuIHByb2plY3Rpb25zLmNvbmNhdChjaGlsZC5hc3NlbWJsZVByb2plY3Rpb25zKCkpO1xuICB9LCBhc3NlbWJsZVByb2plY3Rpb25Gb3JNb2RlbChtb2RlbCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZW1ibGVQcm9qZWN0aW9uRm9yTW9kZWwobW9kZWw6IE1vZGVsKTogVmdQcm9qZWN0aW9uW10ge1xuICBjb25zdCBjb21wb25lbnQgPSBtb2RlbC5jb21wb25lbnQucHJvamVjdGlvbjtcbiAgaWYgKCFjb21wb25lbnQgfHwgY29tcG9uZW50Lm1lcmdlZCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IHByb2plY3Rpb24gPSBjb21wb25lbnQuY29tYmluZSgpO1xuICBjb25zdCB7bmFtZSwgLi4ucmVzdH0gPSBwcm9qZWN0aW9uOyAgLy8gd2UgbmVlZCB0byBleHRyYWN0IG5hbWUgc28gdGhhdCBpdCBpcyBhbHdheXMgcHJlc2VudCBpbiB0aGUgb3V0cHV0IGFuZCBwYXNzIFRTIHR5cGUgdmFsaWRhdGlvblxuXG4gIGNvbnN0IHNpemU6IFZnU2lnbmFsUmVmID0ge1xuICAgIHNpZ25hbDogYFske2NvbXBvbmVudC5zaXplLm1hcCgocmVmKSA9PiByZWYuc2lnbmFsKS5qb2luKCcsICcpfV1gXG4gIH07XG5cbiAgY29uc3QgZml0OiBzdHJpbmdbXSA9IGNvbXBvbmVudC5kYXRhLnJlZHVjZSgoc291cmNlcywgZGF0YSkgPT4ge1xuICAgIGNvbnN0IHNvdXJjZTogc3RyaW5nID0gaXNWZ1NpZ25hbFJlZihkYXRhKSA/IGRhdGEuc2lnbmFsIDogYGRhdGEoJyR7bW9kZWwubG9va3VwRGF0YVNvdXJjZShkYXRhKX0nKWA7XG4gICAgaWYgKCFjb250YWlucyhzb3VyY2VzLCBzb3VyY2UpKSB7XG4gICAgICAvLyBidWlsZCBhIHVuaXF1ZSBsaXN0IG9mIHNvdXJjZXNcbiAgICAgIHNvdXJjZXMucHVzaChzb3VyY2UpO1xuICAgIH1cbiAgICByZXR1cm4gc291cmNlcztcbiAgfSwgW10pO1xuXG4gIGlmIChmaXQubGVuZ3RoIDw9IDApIHtcbiAgICBlcnJvcihcIlByb2plY3Rpb24ncyBmaXQgZGlkbid0IGZpbmQgYW55IGRhdGEgc291cmNlc1wiKTtcbiAgfVxuXG4gIHJldHVybiBbe1xuICAgIG5hbWUsXG4gICAgc2l6ZSxcbiAgICBmaXQ6IHtcbiAgICAgIHNpZ25hbDogZml0Lmxlbmd0aCA+IDEgPyBgWyR7Zml0LmpvaW4oJywgJyl9XWAgOiBmaXRbMF1cbiAgICB9LFxuICAgIC4uLnJlc3RcbiAgfV07XG59XG4iXX0=