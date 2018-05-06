"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
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
        var name = scale.name, type = scale.type, _d = scale.domainRaw, _r = scale.range, otherScaleProps = tslib_1.__rest(scale, ["name", "type", "domainRaw", "range"]);
        range = assembleScaleRange(range, name, model, channel);
        // As scale parsing occurs before selection parsing, a temporary signal
        // is used for domainRaw. Here, we detect if this temporary signal
        // is set, and replace it with the correct domainRaw signal.
        // For more information, see isRawSelectionDomain in selection.ts.
        if (domainRaw && selection_1.isRawSelectionDomain(domainRaw)) {
            domainRaw = selection_1.selectionScaleDomain(model, domainRaw);
        }
        scales.push(tslib_1.__assign({ name: name,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9hc3NlbWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBa0M7QUFFbEMsbUNBQWdDO0FBQ2hDLGlEQUFpRjtBQUNqRixrQ0FBMkU7QUFDM0Usb0RBQWtGO0FBQ2xGLG1DQUF3QztBQUV4Qyx3QkFBK0IsS0FBWTtJQUN6QyxJQUFJLG9CQUFZLENBQUMsS0FBSyxDQUFDLElBQUkscUJBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxxQkFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3ZFLDhEQUE4RDtRQUM5RCxPQUFPLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQUMsTUFBTSxFQUFFLEtBQUs7WUFDekMsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzlDLENBQUMsRUFBRSxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0tBQ25DO1NBQU07UUFDTCx1RUFBdUU7UUFDdkUsK0JBQStCO1FBQy9CLE9BQU8sc0JBQXNCLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDdEM7QUFDSCxDQUFDO0FBWEQsd0NBV0M7QUFFRCxnQ0FBdUMsS0FBWTtJQUMvQyxPQUFPLFdBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLE1BQWlCLEVBQUUsT0FBcUI7UUFDbEYsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkQsSUFBSSxjQUFjLENBQUMsTUFBTSxFQUFFO1lBQ3pCLHdCQUF3QjtZQUN4QixPQUFPLE1BQU0sQ0FBQztTQUNmO1FBRUQsSUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRXZDLDBEQUEwRDtRQUNyRCxJQUFBLDJCQUFTLEVBQUUsbUJBQUssQ0FBVTtRQUN4QixJQUFBLGlCQUFJLEVBQUUsaUJBQUksRUFBRSxvQkFBYSxFQUFFLGdCQUFTLEVBQUUsK0VBQWtCLENBQVU7UUFFekUsS0FBSyxHQUFHLGtCQUFrQixDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXhELHVFQUF1RTtRQUN2RSxrRUFBa0U7UUFDbEUsNERBQTREO1FBQzVELGtFQUFrRTtRQUNsRSxJQUFJLFNBQVMsSUFBSSxnQ0FBb0IsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUNoRCxTQUFTLEdBQUcsZ0NBQW9CLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQ3BEO1FBR0QsTUFBTSxDQUFDLElBQUksb0JBQ1QsSUFBSSxNQUFBO1lBQ0osSUFBSSxNQUFBLEVBQ0osTUFBTSxFQUFFLHVCQUFjLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxJQUNuQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBQyxTQUFTLFdBQUEsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFDakMsS0FBSyxFQUFFLEtBQUssSUFDVCxlQUFlLEVBQ2xCLENBQUM7UUFFSCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDLEVBQUUsRUFBZSxDQUFDLENBQUM7QUFDeEIsQ0FBQztBQXBDRCx3REFvQ0M7QUFFRCw0QkFBbUMsVUFBbUIsRUFBRSxTQUFpQixFQUFFLEtBQVksRUFBRSxPQUFnQjtJQUN2RywyQkFBMkI7SUFDM0IsSUFBSSxPQUFPLEtBQUssR0FBRyxJQUFJLE9BQU8sS0FBSyxHQUFHLEVBQUU7UUFDdEMsSUFBSSwyQkFBYSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQzdCLGdHQUFnRztZQUNoRyxPQUFPO2dCQUNMLElBQUksRUFBRSxFQUFDLE1BQU0sRUFBRSxTQUFTLEdBQUcsT0FBTyxFQUFDO2FBQ3BDLENBQUM7U0FDSDthQUFNLElBQUksbUJBQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUN6RCxJQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekIsSUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSwyQkFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2dCQUNqQyxtREFBbUQ7Z0JBQ25ELE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUMsQ0FBQyxDQUFDO2FBQ3BEO2lCQUFNLElBQUksMkJBQWEsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFO2dCQUN4QyxvREFBb0Q7Z0JBQ3BELE9BQU8sQ0FBQyxFQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ3BEO1NBQ0Y7S0FDRjtJQUNELE9BQU8sVUFBVSxDQUFDO0FBQ3BCLENBQUM7QUFyQkQsZ0RBcUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc0FycmF5fSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHtDaGFubmVsLCBTY2FsZUNoYW5uZWx9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtrZXlzfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7aXNWZ1JhbmdlU3RlcCwgaXNWZ1NpZ25hbFJlZiwgVmdSYW5nZSwgVmdTY2FsZX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtpc0NvbmNhdE1vZGVsLCBpc0xheWVyTW9kZWwsIGlzUmVwZWF0TW9kZWwsIE1vZGVsfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge2lzUmF3U2VsZWN0aW9uRG9tYWluLCBzZWxlY3Rpb25TY2FsZURvbWFpbn0gZnJvbSAnLi4vc2VsZWN0aW9uL3NlbGVjdGlvbic7XG5pbXBvcnQge2Fzc2VtYmxlRG9tYWlufSBmcm9tICcuL2RvbWFpbic7XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlbWJsZVNjYWxlcyhtb2RlbDogTW9kZWwpOiBWZ1NjYWxlW10ge1xuICBpZiAoaXNMYXllck1vZGVsKG1vZGVsKSB8fCBpc0NvbmNhdE1vZGVsKG1vZGVsKSB8fCBpc1JlcGVhdE1vZGVsKG1vZGVsKSkge1xuICAgIC8vIEZvciBjb25jYXQgLyBsYXllciAvIHJlcGVhdCwgaW5jbHVkZSBzY2FsZXMgb2YgY2hpbGRyZW4gdG9vXG4gICAgcmV0dXJuIG1vZGVsLmNoaWxkcmVuLnJlZHVjZSgoc2NhbGVzLCBjaGlsZCkgPT4ge1xuICAgICAgcmV0dXJuIHNjYWxlcy5jb25jYXQoYXNzZW1ibGVTY2FsZXMoY2hpbGQpKTtcbiAgICB9LCBhc3NlbWJsZVNjYWxlc0Zvck1vZGVsKG1vZGVsKSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gRm9yIGZhY2V0LCBjaGlsZCBzY2FsZXMgd291bGQgbm90IGJlIGluY2x1ZGVkIGluIHRoZSBwYXJlbnQncyBzY29wZS5cbiAgICAvLyBGb3IgdW5pdCwgdGhlcmUgaXMgbm8gY2hpbGQuXG4gICAgcmV0dXJuIGFzc2VtYmxlU2NhbGVzRm9yTW9kZWwobW9kZWwpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlbWJsZVNjYWxlc0Zvck1vZGVsKG1vZGVsOiBNb2RlbCk6IFZnU2NhbGVbXSB7XG4gICAgcmV0dXJuIGtleXMobW9kZWwuY29tcG9uZW50LnNjYWxlcykucmVkdWNlKChzY2FsZXM6IFZnU2NhbGVbXSwgY2hhbm5lbDogU2NhbGVDaGFubmVsKSA9PiB7XG4gICAgICBjb25zdCBzY2FsZUNvbXBvbmVudCA9IG1vZGVsLmNvbXBvbmVudC5zY2FsZXNbY2hhbm5lbF07XG4gICAgICBpZiAoc2NhbGVDb21wb25lbnQubWVyZ2VkKSB7XG4gICAgICAgIC8vIFNraXBwZWQgbWVyZ2VkIHNjYWxlc1xuICAgICAgICByZXR1cm4gc2NhbGVzO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzY2FsZSA9IHNjYWxlQ29tcG9uZW50LmNvbWJpbmUoKTtcblxuICAgICAgLy8gbmVlZCB0byBzZXBhcmF0ZSBjb25zdCBhbmQgbm9uIGNvbnN0IG9iamVjdCBkZXN0cnVjdGlvblxuICAgICAgbGV0IHtkb21haW5SYXcsIHJhbmdlfSA9IHNjYWxlO1xuICAgICAgY29uc3Qge25hbWUsIHR5cGUsIGRvbWFpblJhdzogX2QsIHJhbmdlOiBfciwgLi4ub3RoZXJTY2FsZVByb3BzfSA9IHNjYWxlO1xuXG4gICAgICByYW5nZSA9IGFzc2VtYmxlU2NhbGVSYW5nZShyYW5nZSwgbmFtZSwgbW9kZWwsIGNoYW5uZWwpO1xuXG4gICAgICAvLyBBcyBzY2FsZSBwYXJzaW5nIG9jY3VycyBiZWZvcmUgc2VsZWN0aW9uIHBhcnNpbmcsIGEgdGVtcG9yYXJ5IHNpZ25hbFxuICAgICAgLy8gaXMgdXNlZCBmb3IgZG9tYWluUmF3LiBIZXJlLCB3ZSBkZXRlY3QgaWYgdGhpcyB0ZW1wb3Jhcnkgc2lnbmFsXG4gICAgICAvLyBpcyBzZXQsIGFuZCByZXBsYWNlIGl0IHdpdGggdGhlIGNvcnJlY3QgZG9tYWluUmF3IHNpZ25hbC5cbiAgICAgIC8vIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgaXNSYXdTZWxlY3Rpb25Eb21haW4gaW4gc2VsZWN0aW9uLnRzLlxuICAgICAgaWYgKGRvbWFpblJhdyAmJiBpc1Jhd1NlbGVjdGlvbkRvbWFpbihkb21haW5SYXcpKSB7XG4gICAgICAgIGRvbWFpblJhdyA9IHNlbGVjdGlvblNjYWxlRG9tYWluKG1vZGVsLCBkb21haW5SYXcpO1xuICAgICAgfVxuXG5cbiAgICAgIHNjYWxlcy5wdXNoKHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgdHlwZSxcbiAgICAgICAgZG9tYWluOiBhc3NlbWJsZURvbWFpbihtb2RlbCwgY2hhbm5lbCksXG4gICAgICAgIC4uLihkb21haW5SYXcgPyB7ZG9tYWluUmF3fSA6IHt9KSxcbiAgICAgICAgcmFuZ2U6IHJhbmdlLFxuICAgICAgICAuLi5vdGhlclNjYWxlUHJvcHNcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gc2NhbGVzO1xuICAgIH0sIFtdIGFzIFZnU2NhbGVbXSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlbWJsZVNjYWxlUmFuZ2Uoc2NhbGVSYW5nZTogVmdSYW5nZSwgc2NhbGVOYW1lOiBzdHJpbmcsIG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICAvLyBhZGQgc2lnbmFscyB0byB4L3kgcmFuZ2VcbiAgaWYgKGNoYW5uZWwgPT09ICd4JyB8fCBjaGFubmVsID09PSAneScpIHtcbiAgICBpZiAoaXNWZ1JhbmdlU3RlcChzY2FsZVJhbmdlKSkge1xuICAgICAgLy8gRm9yIHgveSByYW5nZSBzdGVwLCB1c2UgYSBzaWduYWwgY3JlYXRlZCBpbiBsYXlvdXQgYXNzZW1ibGUgaW5zdGVhZCBvZiBhIGNvbnN0YW50IHJhbmdlIHN0ZXAuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdGVwOiB7c2lnbmFsOiBzY2FsZU5hbWUgKyAnX3N0ZXAnfVxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkoc2NhbGVSYW5nZSkgJiYgc2NhbGVSYW5nZS5sZW5ndGggPT09IDIpIHtcbiAgICAgIGNvbnN0IHIwID0gc2NhbGVSYW5nZVswXTtcbiAgICAgIGNvbnN0IHIxID0gc2NhbGVSYW5nZVsxXTtcbiAgICAgIGlmIChyMCA9PT0gMCAmJiBpc1ZnU2lnbmFsUmVmKHIxKSkge1xuICAgICAgICAvLyBSZXBsYWNlIHdpZHRoIHNpZ25hbCBqdXN0IGluIGNhc2UgaXQgaXMgcmVuYW1lZC5cbiAgICAgICAgcmV0dXJuIFswLCB7c2lnbmFsOiBtb2RlbC5nZXRTaXplTmFtZShyMS5zaWduYWwpfV07XG4gICAgICB9IGVsc2UgaWYgKGlzVmdTaWduYWxSZWYocjApICYmIHIxID09PSAwKSB7XG4gICAgICAgIC8vIFJlcGxhY2UgaGVpZ2h0IHNpZ25hbCBqdXN0IGluIGNhc2UgaXQgaXMgcmVuYW1lZC5cbiAgICAgICAgcmV0dXJuIFt7c2lnbmFsOiBtb2RlbC5nZXRTaXplTmFtZShyMC5zaWduYWwpfSwgMF07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBzY2FsZVJhbmdlO1xufVxuIl19