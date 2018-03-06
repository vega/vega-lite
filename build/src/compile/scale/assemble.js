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
var vega_util_1 = require("vega-util");
var util_1 = require("../../util");
var vega_schema_1 = require("../../vega.schema");
var model_1 = require("../model");
var selection_1 = require("../selection/selection");
var domain_1 = require("./domain");
function assembleScales(model) {
    if (model_1.isLayerModel(model) || model_1.isConcatModel(model) || model_1.isRepeatModel(model)) {
        // For concat / layer / repeat, include scales of children too
        return model.children.reduce(function (scales, child) {
            return scales.concat(assembleScales(child));
        }, assembleScalesForModel(model));
    }
    else {
        // For facet, child scales would not be included in the parent's scope.
        // For unit, there is no child.
        return assembleScalesForModel(model);
    }
}
exports.assembleScales = assembleScales;
function assembleScalesForModel(model) {
    return util_1.keys(model.component.scales).reduce(function (scales, channel) {
        var scaleComponent = model.component.scales[channel];
        if (scaleComponent.merged) {
            // Skipped merged scales
            return scales;
        }
        var scale = scaleComponent.combine();
        // need to separate const and non const object destruction
        var domainRaw = scale.domainRaw, range = scale.range;
        var name = scale.name, type = scale.type, _d = scale.domainRaw, _r = scale.range, otherScaleProps = __rest(scale, ["name", "type", "domainRaw", "range"]);
        range = assembleScaleRange(range, name, model, channel);
        // As scale parsing occurs before selection parsing, a temporary signal
        // is used for domainRaw. Here, we detect if this temporary signal
        // is set, and replace it with the correct domainRaw signal.
        // For more information, see isRawSelectionDomain in selection.ts.
        if (domainRaw && selection_1.isRawSelectionDomain(domainRaw)) {
            domainRaw = selection_1.selectionScaleDomain(model, domainRaw);
        }
        scales.push(__assign({ name: name,
            type: type, domain: domain_1.assembleDomain(model, channel) }, (domainRaw ? { domainRaw: domainRaw } : {}), { range: range }, otherScaleProps));
        return scales;
    }, []);
}
exports.assembleScalesForModel = assembleScalesForModel;
function assembleScaleRange(scaleRange, scaleName, model, channel) {
    // add signals to x/y range
    if (channel === 'x' || channel === 'y') {
        if (vega_schema_1.isVgRangeStep(scaleRange)) {
            // For x/y range step, use a signal created in layout assemble instead of a constant range step.
            return {
                step: { signal: scaleName + '_step' }
            };
        }
        else if (vega_util_1.isArray(scaleRange) && scaleRange.length === 2) {
            var r0 = scaleRange[0];
            var r1 = scaleRange[1];
            if (r0 === 0 && vega_schema_1.isVgSignalRef(r1)) {
                // Replace width signal just in case it is renamed.
                return [0, { signal: model.getSizeName(r1.signal) }];
            }
            else if (vega_schema_1.isVgSignalRef(r0) && r1 === 0) {
                // Replace height signal just in case it is renamed.
                return [{ signal: model.getSizeName(r0.signal) }, 0];
            }
        }
    }
    return scaleRange;
}
exports.assembleScaleRange = assembleScaleRange;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9hc3NlbWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdUNBQWtDO0FBRWxDLG1DQUFnQztBQUNoQyxpREFBaUY7QUFDakYsa0NBQTJFO0FBQzNFLG9EQUFrRjtBQUNsRixtQ0FBd0M7QUFFeEMsd0JBQStCLEtBQVk7SUFDekMsRUFBRSxDQUFDLENBQUMsb0JBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxxQkFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLHFCQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hFLDhEQUE4RDtRQUM5RCxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBQyxNQUFNLEVBQUUsS0FBSztZQUN6QyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUM5QyxDQUFDLEVBQUUsc0JBQXNCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTix1RUFBdUU7UUFDdkUsK0JBQStCO1FBQy9CLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN2QyxDQUFDO0FBQ0gsQ0FBQztBQVhELHdDQVdDO0FBRUQsZ0NBQXVDLEtBQVk7SUFDL0MsTUFBTSxDQUFDLFdBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLE1BQWlCLEVBQUUsT0FBcUI7UUFDbEYsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkQsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDMUIsd0JBQXdCO1lBQ3hCLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEIsQ0FBQztRQUVELElBQU0sS0FBSyxHQUFHLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUV2QywwREFBMEQ7UUFDckQsSUFBQSwyQkFBUyxFQUFFLG1CQUFLLENBQVU7UUFDeEIsSUFBQSxpQkFBSSxFQUFFLGlCQUFJLEVBQUUsb0JBQWEsRUFBRSxnQkFBUyxFQUFFLHVFQUFrQixDQUFVO1FBRXpFLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUV4RCx1RUFBdUU7UUFDdkUsa0VBQWtFO1FBQ2xFLDREQUE0RDtRQUM1RCxrRUFBa0U7UUFDbEUsRUFBRSxDQUFDLENBQUMsU0FBUyxJQUFJLGdDQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqRCxTQUFTLEdBQUcsZ0NBQW9CLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3JELENBQUM7UUFHRCxNQUFNLENBQUMsSUFBSSxZQUNULElBQUksTUFBQTtZQUNKLElBQUksTUFBQSxFQUNKLE1BQU0sRUFBRSx1QkFBYyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsSUFDbkMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUMsU0FBUyxXQUFBLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQ2pDLEtBQUssRUFBRSxLQUFLLElBQ1QsZUFBZSxFQUNsQixDQUFDO1FBRUgsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNoQixDQUFDLEVBQUUsRUFBZSxDQUFDLENBQUM7QUFDeEIsQ0FBQztBQXBDRCx3REFvQ0M7QUFFRCw0QkFBbUMsVUFBbUIsRUFBRSxTQUFpQixFQUFFLEtBQVksRUFBRSxPQUFnQjtJQUN2RywyQkFBMkI7SUFDM0IsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLEdBQUcsSUFBSSxPQUFPLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN2QyxFQUFFLENBQUMsQ0FBQywyQkFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixnR0FBZ0c7WUFDaEcsTUFBTSxDQUFDO2dCQUNMLElBQUksRUFBRSxFQUFDLE1BQU0sRUFBRSxTQUFTLEdBQUcsT0FBTyxFQUFDO2FBQ3BDLENBQUM7UUFDSixDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLG1CQUFPLENBQUMsVUFBVSxDQUFDLElBQUksVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFELElBQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixJQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekIsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSwyQkFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEMsbURBQW1EO2dCQUNuRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUMsQ0FBQyxDQUFDO1lBQ3JELENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsMkJBQWEsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekMsb0RBQW9EO2dCQUNwRCxNQUFNLENBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3JELENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUNELE1BQU0sQ0FBQyxVQUFVLENBQUM7QUFDcEIsQ0FBQztBQXJCRCxnREFxQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzQXJyYXl9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge0NoYW5uZWwsIFNjYWxlQ2hhbm5lbH0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge2tleXN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtpc1ZnUmFuZ2VTdGVwLCBpc1ZnU2lnbmFsUmVmLCBWZ1JhbmdlLCBWZ1NjYWxlfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2lzQ29uY2F0TW9kZWwsIGlzTGF5ZXJNb2RlbCwgaXNSZXBlYXRNb2RlbCwgTW9kZWx9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7aXNSYXdTZWxlY3Rpb25Eb21haW4sIHNlbGVjdGlvblNjYWxlRG9tYWlufSBmcm9tICcuLi9zZWxlY3Rpb24vc2VsZWN0aW9uJztcbmltcG9ydCB7YXNzZW1ibGVEb21haW59IGZyb20gJy4vZG9tYWluJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VtYmxlU2NhbGVzKG1vZGVsOiBNb2RlbCk6IFZnU2NhbGVbXSB7XG4gIGlmIChpc0xheWVyTW9kZWwobW9kZWwpIHx8IGlzQ29uY2F0TW9kZWwobW9kZWwpIHx8IGlzUmVwZWF0TW9kZWwobW9kZWwpKSB7XG4gICAgLy8gRm9yIGNvbmNhdCAvIGxheWVyIC8gcmVwZWF0LCBpbmNsdWRlIHNjYWxlcyBvZiBjaGlsZHJlbiB0b29cbiAgICByZXR1cm4gbW9kZWwuY2hpbGRyZW4ucmVkdWNlKChzY2FsZXMsIGNoaWxkKSA9PiB7XG4gICAgICByZXR1cm4gc2NhbGVzLmNvbmNhdChhc3NlbWJsZVNjYWxlcyhjaGlsZCkpO1xuICAgIH0sIGFzc2VtYmxlU2NhbGVzRm9yTW9kZWwobW9kZWwpKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBGb3IgZmFjZXQsIGNoaWxkIHNjYWxlcyB3b3VsZCBub3QgYmUgaW5jbHVkZWQgaW4gdGhlIHBhcmVudCdzIHNjb3BlLlxuICAgIC8vIEZvciB1bml0LCB0aGVyZSBpcyBubyBjaGlsZC5cbiAgICByZXR1cm4gYXNzZW1ibGVTY2FsZXNGb3JNb2RlbChtb2RlbCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VtYmxlU2NhbGVzRm9yTW9kZWwobW9kZWw6IE1vZGVsKTogVmdTY2FsZVtdIHtcbiAgICByZXR1cm4ga2V5cyhtb2RlbC5jb21wb25lbnQuc2NhbGVzKS5yZWR1Y2UoKHNjYWxlczogVmdTY2FsZVtdLCBjaGFubmVsOiBTY2FsZUNoYW5uZWwpID0+IHtcbiAgICAgIGNvbnN0IHNjYWxlQ29tcG9uZW50ID0gbW9kZWwuY29tcG9uZW50LnNjYWxlc1tjaGFubmVsXTtcbiAgICAgIGlmIChzY2FsZUNvbXBvbmVudC5tZXJnZWQpIHtcbiAgICAgICAgLy8gU2tpcHBlZCBtZXJnZWQgc2NhbGVzXG4gICAgICAgIHJldHVybiBzY2FsZXM7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNjYWxlID0gc2NhbGVDb21wb25lbnQuY29tYmluZSgpO1xuXG4gICAgICAvLyBuZWVkIHRvIHNlcGFyYXRlIGNvbnN0IGFuZCBub24gY29uc3Qgb2JqZWN0IGRlc3RydWN0aW9uXG4gICAgICBsZXQge2RvbWFpblJhdywgcmFuZ2V9ID0gc2NhbGU7XG4gICAgICBjb25zdCB7bmFtZSwgdHlwZSwgZG9tYWluUmF3OiBfZCwgcmFuZ2U6IF9yLCAuLi5vdGhlclNjYWxlUHJvcHN9ID0gc2NhbGU7XG5cbiAgICAgIHJhbmdlID0gYXNzZW1ibGVTY2FsZVJhbmdlKHJhbmdlLCBuYW1lLCBtb2RlbCwgY2hhbm5lbCk7XG5cbiAgICAgIC8vIEFzIHNjYWxlIHBhcnNpbmcgb2NjdXJzIGJlZm9yZSBzZWxlY3Rpb24gcGFyc2luZywgYSB0ZW1wb3Jhcnkgc2lnbmFsXG4gICAgICAvLyBpcyB1c2VkIGZvciBkb21haW5SYXcuIEhlcmUsIHdlIGRldGVjdCBpZiB0aGlzIHRlbXBvcmFyeSBzaWduYWxcbiAgICAgIC8vIGlzIHNldCwgYW5kIHJlcGxhY2UgaXQgd2l0aCB0aGUgY29ycmVjdCBkb21haW5SYXcgc2lnbmFsLlxuICAgICAgLy8gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBpc1Jhd1NlbGVjdGlvbkRvbWFpbiBpbiBzZWxlY3Rpb24udHMuXG4gICAgICBpZiAoZG9tYWluUmF3ICYmIGlzUmF3U2VsZWN0aW9uRG9tYWluKGRvbWFpblJhdykpIHtcbiAgICAgICAgZG9tYWluUmF3ID0gc2VsZWN0aW9uU2NhbGVEb21haW4obW9kZWwsIGRvbWFpblJhdyk7XG4gICAgICB9XG5cblxuICAgICAgc2NhbGVzLnB1c2goe1xuICAgICAgICBuYW1lLFxuICAgICAgICB0eXBlLFxuICAgICAgICBkb21haW46IGFzc2VtYmxlRG9tYWluKG1vZGVsLCBjaGFubmVsKSxcbiAgICAgICAgLi4uKGRvbWFpblJhdyA/IHtkb21haW5SYXd9IDoge30pLFxuICAgICAgICByYW5nZTogcmFuZ2UsXG4gICAgICAgIC4uLm90aGVyU2NhbGVQcm9wc1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBzY2FsZXM7XG4gICAgfSwgW10gYXMgVmdTY2FsZVtdKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VtYmxlU2NhbGVSYW5nZShzY2FsZVJhbmdlOiBWZ1JhbmdlLCBzY2FsZU5hbWU6IHN0cmluZywgbW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gIC8vIGFkZCBzaWduYWxzIHRvIHgveSByYW5nZVxuICBpZiAoY2hhbm5lbCA9PT0gJ3gnIHx8IGNoYW5uZWwgPT09ICd5Jykge1xuICAgIGlmIChpc1ZnUmFuZ2VTdGVwKHNjYWxlUmFuZ2UpKSB7XG4gICAgICAvLyBGb3IgeC95IHJhbmdlIHN0ZXAsIHVzZSBhIHNpZ25hbCBjcmVhdGVkIGluIGxheW91dCBhc3NlbWJsZSBpbnN0ZWFkIG9mIGEgY29uc3RhbnQgcmFuZ2Ugc3RlcC5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN0ZXA6IHtzaWduYWw6IHNjYWxlTmFtZSArICdfc3RlcCd9XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShzY2FsZVJhbmdlKSAmJiBzY2FsZVJhbmdlLmxlbmd0aCA9PT0gMikge1xuICAgICAgY29uc3QgcjAgPSBzY2FsZVJhbmdlWzBdO1xuICAgICAgY29uc3QgcjEgPSBzY2FsZVJhbmdlWzFdO1xuICAgICAgaWYgKHIwID09PSAwICYmIGlzVmdTaWduYWxSZWYocjEpKSB7XG4gICAgICAgIC8vIFJlcGxhY2Ugd2lkdGggc2lnbmFsIGp1c3QgaW4gY2FzZSBpdCBpcyByZW5hbWVkLlxuICAgICAgICByZXR1cm4gWzAsIHtzaWduYWw6IG1vZGVsLmdldFNpemVOYW1lKHIxLnNpZ25hbCl9XTtcbiAgICAgIH0gZWxzZSBpZiAoaXNWZ1NpZ25hbFJlZihyMCkgJiYgcjEgPT09IDApIHtcbiAgICAgICAgLy8gUmVwbGFjZSBoZWlnaHQgc2lnbmFsIGp1c3QgaW4gY2FzZSBpdCBpcyByZW5hbWVkLlxuICAgICAgICByZXR1cm4gW3tzaWduYWw6IG1vZGVsLmdldFNpemVOYW1lKHIwLnNpZ25hbCl9LCAwXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHNjYWxlUmFuZ2U7XG59XG4iXX0=