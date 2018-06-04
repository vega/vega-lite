"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var mark_1 = require("../../mark");
var scale_1 = require("../../scale");
var type_1 = require("../../type");
var util_1 = require("../../util");
var model_1 = require("../model");
var resolve_1 = require("../resolve");
var split_1 = require("../split");
var component_1 = require("./component");
var domain_1 = require("./domain");
var properties_1 = require("./properties");
var range_1 = require("./range");
var type_2 = require("./type");
function parseScale(model) {
    parseScaleCore(model);
    domain_1.parseScaleDomain(model);
    for (var _i = 0, NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES_1 = scale_1.NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES; _i < NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES_1.length; _i++) {
        var prop = NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES_1[_i];
        properties_1.parseScaleProperty(model, prop);
    }
    // range depends on zero
    range_1.parseScaleRange(model);
}
exports.parseScale = parseScale;
function parseScaleCore(model) {
    if (model_1.isUnitModel(model)) {
        model.component.scales = parseUnitScaleCore(model);
    }
    else {
        model.component.scales = parseNonUnitScaleCore(model);
    }
}
exports.parseScaleCore = parseScaleCore;
/**
 * Parse scales for all channels of a model.
 */
function parseUnitScaleCore(model) {
    var encoding = model.encoding, config = model.config, mark = model.mark;
    return channel_1.SCALE_CHANNELS.reduce(function (scaleComponents, channel) {
        var fieldDef;
        var specifiedScale = undefined;
        var channelDef = encoding[channel];
        // Don't generate scale for shape of geoshape
        if (fielddef_1.isFieldDef(channelDef) && mark === mark_1.GEOSHAPE &&
            channel === channel_1.SHAPE && channelDef.type === type_1.GEOJSON) {
            return scaleComponents;
        }
        if (fielddef_1.isFieldDef(channelDef)) {
            fieldDef = channelDef;
            specifiedScale = channelDef.scale;
        }
        else if (fielddef_1.hasConditionalFieldDef(channelDef)) {
            fieldDef = channelDef.condition;
            specifiedScale = channelDef.condition['scale']; // We use ['scale'] since we know that channel here has scale for sure
        }
        else if (channel === channel_1.X) {
            fieldDef = fielddef_1.getFieldDef(encoding.x2);
        }
        else if (channel === channel_1.Y) {
            fieldDef = fielddef_1.getFieldDef(encoding.y2);
        }
        if (fieldDef && specifiedScale !== null && specifiedScale !== false) {
            specifiedScale = specifiedScale || {};
            var specifiedScaleType = specifiedScale.type;
            var sType = type_2.scaleType(specifiedScale.type, channel, fieldDef, mark, config.scale);
            scaleComponents[channel] = new component_1.ScaleComponent(model.scaleName(channel + '', true), { value: sType, explicit: specifiedScaleType === sType });
        }
        return scaleComponents;
    }, {});
}
var scaleTypeTieBreaker = split_1.tieBreakByComparing(function (st1, st2) { return (scale_1.scaleTypePrecedence(st1) - scale_1.scaleTypePrecedence(st2)); });
function parseNonUnitScaleCore(model) {
    var scaleComponents = model.component.scales = {};
    var scaleTypeWithExplicitIndex = {};
    var resolve = model.component.resolve;
    var _loop_1 = function (child) {
        parseScaleCore(child);
        // Instead of always merging right away -- check if it is compatible to merge first!
        util_1.keys(child.component.scales).forEach(function (channel) {
            // if resolve is undefined, set default first
            resolve.scale[channel] = resolve.scale[channel] || resolve_1.defaultScaleResolve(channel, model);
            if (resolve.scale[channel] === 'shared') {
                var explicitScaleType = scaleTypeWithExplicitIndex[channel];
                var childScaleType = child.component.scales[channel].getWithExplicit('type');
                if (explicitScaleType) {
                    if (scale_1.scaleCompatible(explicitScaleType.value, childScaleType.value)) {
                        // merge scale component if type are compatible
                        scaleTypeWithExplicitIndex[channel] = split_1.mergeValuesWithExplicit(explicitScaleType, childScaleType, 'type', 'scale', scaleTypeTieBreaker);
                    }
                    else {
                        // Otherwise, update conflicting channel to be independent
                        resolve.scale[channel] = 'independent';
                        // Remove from the index so they don't get merged
                        delete scaleTypeWithExplicitIndex[channel];
                    }
                }
                else {
                    scaleTypeWithExplicitIndex[channel] = childScaleType;
                }
            }
        });
    };
    // Parse each child scale and determine if a particular channel can be merged.
    for (var _i = 0, _a = model.children; _i < _a.length; _i++) {
        var child = _a[_i];
        _loop_1(child);
    }
    // Merge each channel listed in the index
    util_1.keys(scaleTypeWithExplicitIndex).forEach(function (channel) {
        // Create new merged scale component
        var name = model.scaleName(channel, true);
        var typeWithExplicit = scaleTypeWithExplicitIndex[channel];
        scaleComponents[channel] = new component_1.ScaleComponent(name, typeWithExplicit);
        // rename each child and mark them as merged
        for (var _i = 0, _a = model.children; _i < _a.length; _i++) {
            var child = _a[_i];
            var childScale = child.component.scales[channel];
            if (childScale) {
                child.renameScale(childScale.get('name'), name);
                childScale.merged = true;
            }
        }
    });
    return scaleComponents;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9wYXJzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUF3RTtBQUN4RSwyQ0FBeUY7QUFDekYsbUNBQW9DO0FBQ3BDLHFDQU1xQjtBQUNyQixtQ0FBbUM7QUFDbkMsbUNBQWdDO0FBRWhDLGtDQUE0QztBQUM1QyxzQ0FBK0M7QUFDL0Msa0NBQWdGO0FBRWhGLHlDQUFnRTtBQUNoRSxtQ0FBMEM7QUFDMUMsMkNBQWdEO0FBQ2hELGlDQUF3QztBQUN4QywrQkFBaUM7QUFFakMsb0JBQTJCLEtBQVk7SUFDckMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3RCLHlCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hCLEtBQW1CLFVBQTJDLEVBQTNDLGdEQUFBLG1EQUEyQyxFQUEzQyx5REFBMkMsRUFBM0MsSUFBMkMsRUFBRTtRQUEzRCxJQUFNLElBQUksb0RBQUE7UUFDYiwrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDakM7SUFDRCx3QkFBd0I7SUFDeEIsdUJBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6QixDQUFDO0FBUkQsZ0NBUUM7QUFFRCx3QkFBK0IsS0FBWTtJQUN6QyxJQUFJLG1CQUFXLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDdEIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDcEQ7U0FBTTtRQUNMLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3ZEO0FBQ0gsQ0FBQztBQU5ELHdDQU1DO0FBRUQ7O0dBRUc7QUFDSCw0QkFBNEIsS0FBZ0I7SUFDbkMsSUFBQSx5QkFBUSxFQUFFLHFCQUFNLEVBQUUsaUJBQUksQ0FBVTtJQUV2QyxPQUFPLHdCQUFjLENB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QUMsQ0FBQztRQUM3RCxlQUFlLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSwwQkFBYyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBRXRFLDRDQUE0QztRQUM1QyxLQUFvQixVQUFjLEVBQWQsS0FBQSxLQUFLLENBQUMsUUFBUSxFQUFkLGNBQWMsRUFBZCxJQUFjLEVBQUU7WUFBL0IsSUFBTSxLQUFLLFNBQUE7WUFDZCxJQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNuRCxJQUFJLFVBQVUsRUFBRTtnQkFDZCxLQUFLLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ2hELFVBQVUsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO2FBQzFCO1NBQ0Y7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sZUFBZSxDQUFDO0FBQ3pCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1NDQUxFX0NIQU5ORUxTLCBTY2FsZUNoYW5uZWwsIFNIQVBFLCBYLCBZfSBmcm9tICcuLi8uLi9jaGFubmVsJztcbmltcG9ydCB7RmllbGREZWYsIGdldEZpZWxkRGVmLCBoYXNDb25kaXRpb25hbEZpZWxkRGVmLCBpc0ZpZWxkRGVmfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQge0dFT1NIQVBFfSBmcm9tICcuLi8uLi9tYXJrJztcbmltcG9ydCB7XG4gIE5PTl9UWVBFX0RPTUFJTl9SQU5HRV9WRUdBX1NDQUxFX1BST1BFUlRJRVMsXG4gIFNjYWxlLFxuICBzY2FsZUNvbXBhdGlibGUsXG4gIFNjYWxlVHlwZSxcbiAgc2NhbGVUeXBlUHJlY2VkZW5jZSxcbn0gZnJvbSAnLi4vLi4vc2NhbGUnO1xuaW1wb3J0IHtHRU9KU09OfSBmcm9tICcuLi8uLi90eXBlJztcbmltcG9ydCB7a2V5c30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnU2NhbGV9IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7aXNVbml0TW9kZWwsIE1vZGVsfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge2RlZmF1bHRTY2FsZVJlc29sdmV9IGZyb20gJy4uL3Jlc29sdmUnO1xuaW1wb3J0IHtFeHBsaWNpdCwgbWVyZ2VWYWx1ZXNXaXRoRXhwbGljaXQsIHRpZUJyZWFrQnlDb21wYXJpbmd9IGZyb20gJy4uL3NwbGl0JztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCB7U2NhbGVDb21wb25lbnQsIFNjYWxlQ29tcG9uZW50SW5kZXh9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7cGFyc2VTY2FsZURvbWFpbn0gZnJvbSAnLi9kb21haW4nO1xuaW1wb3J0IHtwYXJzZVNjYWxlUHJvcGVydHl9IGZyb20gJy4vcHJvcGVydGllcyc7XG5pbXBvcnQge3BhcnNlU2NhbGVSYW5nZX0gZnJvbSAnLi9yYW5nZSc7XG5pbXBvcnQge3NjYWxlVHlwZX0gZnJvbSAnLi90eXBlJztcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU2NhbGUobW9kZWw6IE1vZGVsKSB7XG4gIHBhcnNlU2NhbGVDb3JlKG1vZGVsKTtcbiAgcGFyc2VTY2FsZURvbWFpbihtb2RlbCk7XG4gIGZvciAoY29uc3QgcHJvcCBvZiBOT05fVFlQRV9ET01BSU5fUkFOR0VfVkVHQV9TQ0FMRV9QUk9QRVJUSUVTKSB7XG4gICAgcGFyc2VTY2FsZVByb3BlcnR5KG1vZGVsLCBwcm9wKTtcbiAgfVxuICAvLyByYW5nZSBkZXBlbmRzIG9uIHplcm9cbiAgcGFyc2VTY2FsZVJhbmdlKG1vZGVsKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU2NhbGVDb3JlKG1vZGVsOiBNb2RlbCkge1xuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpKSB7XG4gICAgbW9kZWwuY29tcG9uZW50LnNjYWxlcyA9IHBhcnNlVW5pdFNjYWxlQ29yZShtb2RlbCk7XG4gIH0gZWxzZSB7XG4gICAgbW9kZWwuY29tcG9uZW50LnNjYWxlcyA9IHBhcnNlTm9uVW5pdFNjYWxlQ29yZShtb2RlbCk7XG4gIH1cbn1cblxuLyoqXG4gKiBQYXJzZSBzY2FsZXMgZm9yIGFsbCBjaGFubmVscyBvZiBhIG1vZGVsLlxuICovXG5mdW5jdGlvbiBwYXJzZVVuaXRTY2FsZUNvcmUobW9kZWw6IFVuaXRNb2RlbCk6IFNjYWxlQ29tcG9uZW50SW5kZXgge1xuICBjb25zdCB7ZW5jb2RpbmcsIGNvbmZpZywgbWFya30gPSBtb2RlbDtcblxuICByZXR1cm4gU0NBTEVfQ0hBTk5FTFMucmVkdWNlKChzY2FsZUNvbXBvbmVudHM6IFNjYWxlQ29tcG9uZW50SW5kZXgsIGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCkgPT4ge1xuICAgIGxldCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPjtcbiAgICBsZXQgc3BlY2lmaWVkU2NhbGU6IFNjYWxlIHwgbnVsbCA9IHVuZGVmaW5lZDtcblxuICAgIGNvbnN0IGNoYW5uZWxEZWYgPSBlbmNvZGluZ1tjaGFubmVsXTtcblxuICAgIC8vIERvbid0IGdlbmVyYXRlIHNjYWxlIGZvciBzaGFwZSBvZiBnZW9zaGFwZVxuICAgIGlmIChcbiAgICAgIGlzRmllbGREZWYoY2hhbm5lbERlZikgJiYgbWFyayA9PT0gR0VPU0hBUEUgJiZcbiAgICAgIGNoYW5uZWwgPT09IFNIQVBFICYmIGNoYW5uZWxEZWYudHlwZSA9PT0gR0VPSlNPTlxuICAgICkge1xuICAgICAgcmV0dXJuIHNjYWxlQ29tcG9uZW50cztcbiAgICB9XG5cbiAgICBpZiAoaXNGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgICAgZmllbGREZWYgPSBjaGFubmVsRGVmO1xuICAgICAgc3BlY2lmaWVkU2NhbGUgPSBjaGFubmVsRGVmLnNjYWxlO1xuICAgIH0gZWxzZSBpZiAoaGFzQ29uZGl0aW9uYWxGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgICAgZmllbGREZWYgPSBjaGFubmVsRGVmLmNvbmRpdGlvbjtcbiAgICAgIHNwZWNpZmllZFNjYWxlID0gY2hhbm5lbERlZi5jb25kaXRpb25bJ3NjYWxlJ107IC8vIFdlIHVzZSBbJ3NjYWxlJ10gc2luY2Ugd2Uga25vdyB0aGF0IGNoYW5uZWwgaGVyZSBoYXMgc2NhbGUgZm9yIHN1cmVcbiAgICB9IGVsc2UgaWYgKGNoYW5uZWwgPT09IFgpIHtcbiAgICAgIGZpZWxkRGVmID0gZ2V0RmllbGREZWYoZW5jb2RpbmcueDIpO1xuICAgIH0gZWxzZSBpZiAoY2hhbm5lbCA9PT0gWSkge1xuICAgICAgZmllbGREZWYgPSBnZXRGaWVsZERlZihlbmNvZGluZy55Mik7XG4gICAgfVxuXG4gICAgaWYgKGZpZWxkRGVmICYmIHNwZWNpZmllZFNjYWxlICE9PSBudWxsICYmIHNwZWNpZmllZFNjYWxlICE9PSBmYWxzZSkge1xuICAgICAgc3BlY2lmaWVkU2NhbGUgPSBzcGVjaWZpZWRTY2FsZSB8fCB7fTtcbiAgICAgIGNvbnN0IHNwZWNpZmllZFNjYWxlVHlwZSA9IHNwZWNpZmllZFNjYWxlLnR5cGU7XG4gICAgICBjb25zdCBzVHlwZSA9IHNjYWxlVHlwZShzcGVjaWZpZWRTY2FsZS50eXBlLCBjaGFubmVsLCBmaWVsZERlZiwgbWFyaywgY29uZmlnLnNjYWxlKTtcbiAgICAgIHNjYWxlQ29tcG9uZW50c1tjaGFubmVsXSA9IG5ldyBTY2FsZUNvbXBvbmVudChcbiAgICAgICAgbW9kZWwuc2NhbGVOYW1lKGNoYW5uZWwgKyAnJywgdHJ1ZSksXG4gICAgICAgIHt2YWx1ZTogc1R5cGUsIGV4cGxpY2l0OiBzcGVjaWZpZWRTY2FsZVR5cGUgPT09IHNUeXBlfVxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHNjYWxlQ29tcG9uZW50cztcbiAgfSwge30pO1xufVxuXG5jb25zdCBzY2FsZVR5cGVUaWVCcmVha2VyID0gdGllQnJlYWtCeUNvbXBhcmluZyhcbiAgKHN0MTogU2NhbGVUeXBlLCBzdDI6IFNjYWxlVHlwZSkgPT4gKHNjYWxlVHlwZVByZWNlZGVuY2Uoc3QxKSAtIHNjYWxlVHlwZVByZWNlZGVuY2Uoc3QyKSlcbik7XG5cblxuZnVuY3Rpb24gcGFyc2VOb25Vbml0U2NhbGVDb3JlKG1vZGVsOiBNb2RlbCkge1xuICBjb25zdCBzY2FsZUNvbXBvbmVudHM6IFNjYWxlQ29tcG9uZW50SW5kZXggPSBtb2RlbC5jb21wb25lbnQuc2NhbGVzID0ge307XG5cbiAgY29uc3Qgc2NhbGVUeXBlV2l0aEV4cGxpY2l0SW5kZXg6IHtcbiAgICAvLyBVc2luZyBNYXBwZWQgVHlwZSB0byBkZWNsYXJlIHR5cGUgKGh0dHBzOi8vd3d3LnR5cGVzY3JpcHRsYW5nLm9yZy9kb2NzL2hhbmRib29rL2FkdmFuY2VkLXR5cGVzLmh0bWwjbWFwcGVkLXR5cGVzKVxuICAgIFtrIGluIFNjYWxlQ2hhbm5lbF0/OiBFeHBsaWNpdDxTY2FsZVR5cGU+XG4gIH0gPSB7fTtcbiAgY29uc3QgcmVzb2x2ZSA9IG1vZGVsLmNvbXBvbmVudC5yZXNvbHZlO1xuXG4gIC8vIFBhcnNlIGVhY2ggY2hpbGQgc2NhbGUgYW5kIGRldGVybWluZSBpZiBhIHBhcnRpY3VsYXIgY2hhbm5lbCBjYW4gYmUgbWVyZ2VkLlxuICBmb3IgKGNvbnN0IGNoaWxkIG9mIG1vZGVsLmNoaWxkcmVuKSB7XG4gICAgcGFyc2VTY2FsZUNvcmUoY2hpbGQpO1xuXG4gICAgLy8gSW5zdGVhZCBvZiBhbHdheXMgbWVyZ2luZyByaWdodCBhd2F5IC0tIGNoZWNrIGlmIGl0IGlzIGNvbXBhdGlibGUgdG8gbWVyZ2UgZmlyc3QhXG4gICAga2V5cyhjaGlsZC5jb21wb25lbnQuc2NhbGVzKS5mb3JFYWNoKChjaGFubmVsOiBTY2FsZUNoYW5uZWwpID0+IHtcbiAgICAgIC8vIGlmIHJlc29sdmUgaXMgdW5kZWZpbmVkLCBzZXQgZGVmYXVsdCBmaXJzdFxuICAgICAgcmVzb2x2ZS5zY2FsZVtjaGFubmVsXSA9IHJlc29sdmUuc2NhbGVbY2hhbm5lbF0gfHwgZGVmYXVsdFNjYWxlUmVzb2x2ZShjaGFubmVsLCBtb2RlbCk7XG5cbiAgICAgIGlmIChyZXNvbHZlLnNjYWxlW2NoYW5uZWxdID09PSAnc2hhcmVkJykge1xuICAgICAgICBjb25zdCBleHBsaWNpdFNjYWxlVHlwZSA9IHNjYWxlVHlwZVdpdGhFeHBsaWNpdEluZGV4W2NoYW5uZWxdO1xuICAgICAgICBjb25zdCBjaGlsZFNjYWxlVHlwZSA9IGNoaWxkLmNvbXBvbmVudC5zY2FsZXNbY2hhbm5lbF0uZ2V0V2l0aEV4cGxpY2l0KCd0eXBlJyk7XG5cbiAgICAgICAgaWYgKGV4cGxpY2l0U2NhbGVUeXBlKSB7XG4gICAgICAgICAgaWYgKHNjYWxlQ29tcGF0aWJsZShleHBsaWNpdFNjYWxlVHlwZS52YWx1ZSwgY2hpbGRTY2FsZVR5cGUudmFsdWUpKSB7XG4gICAgICAgICAgICAvLyBtZXJnZSBzY2FsZSBjb21wb25lbnQgaWYgdHlwZSBhcmUgY29tcGF0aWJsZVxuICAgICAgICAgICAgc2NhbGVUeXBlV2l0aEV4cGxpY2l0SW5kZXhbY2hhbm5lbF0gPSBtZXJnZVZhbHVlc1dpdGhFeHBsaWNpdDxWZ1NjYWxlLCBTY2FsZVR5cGU+KFxuICAgICAgICAgICAgICBleHBsaWNpdFNjYWxlVHlwZSwgY2hpbGRTY2FsZVR5cGUsICd0eXBlJywgJ3NjYWxlJywgc2NhbGVUeXBlVGllQnJlYWtlclxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCB1cGRhdGUgY29uZmxpY3RpbmcgY2hhbm5lbCB0byBiZSBpbmRlcGVuZGVudFxuICAgICAgICAgICAgcmVzb2x2ZS5zY2FsZVtjaGFubmVsXSA9ICdpbmRlcGVuZGVudCc7XG4gICAgICAgICAgICAvLyBSZW1vdmUgZnJvbSB0aGUgaW5kZXggc28gdGhleSBkb24ndCBnZXQgbWVyZ2VkXG4gICAgICAgICAgICBkZWxldGUgc2NhbGVUeXBlV2l0aEV4cGxpY2l0SW5kZXhbY2hhbm5lbF07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNjYWxlVHlwZVdpdGhFeHBsaWNpdEluZGV4W2NoYW5uZWxdID0gY2hpbGRTY2FsZVR5cGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIE1lcmdlIGVhY2ggY2hhbm5lbCBsaXN0ZWQgaW4gdGhlIGluZGV4XG4gIGtleXMoc2NhbGVUeXBlV2l0aEV4cGxpY2l0SW5kZXgpLmZvckVhY2goKGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCkgPT4ge1xuICAgIC8vIENyZWF0ZSBuZXcgbWVyZ2VkIHNjYWxlIGNvbXBvbmVudFxuICAgIGNvbnN0IG5hbWUgPSBtb2RlbC5zY2FsZU5hbWUoY2hhbm5lbCwgdHJ1ZSk7XG4gICAgY29uc3QgdHlwZVdpdGhFeHBsaWNpdCA9IHNjYWxlVHlwZVdpdGhFeHBsaWNpdEluZGV4W2NoYW5uZWxdO1xuICAgIHNjYWxlQ29tcG9uZW50c1tjaGFubmVsXSA9IG5ldyBTY2FsZUNvbXBvbmVudChuYW1lLCB0eXBlV2l0aEV4cGxpY2l0KTtcblxuICAgIC8vIHJlbmFtZSBlYWNoIGNoaWxkIGFuZCBtYXJrIHRoZW0gYXMgbWVyZ2VkXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBtb2RlbC5jaGlsZHJlbikge1xuICAgICAgY29uc3QgY2hpbGRTY2FsZSA9IGNoaWxkLmNvbXBvbmVudC5zY2FsZXNbY2hhbm5lbF07XG4gICAgICBpZiAoY2hpbGRTY2FsZSkge1xuICAgICAgICBjaGlsZC5yZW5hbWVTY2FsZShjaGlsZFNjYWxlLmdldCgnbmFtZScpLCBuYW1lKTtcbiAgICAgICAgY2hpbGRTY2FsZS5tZXJnZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHNjYWxlQ29tcG9uZW50cztcbn1cbiJdfQ==