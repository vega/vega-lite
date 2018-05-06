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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9wYXJzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUF3RTtBQUN4RSwyQ0FBeUY7QUFDekYsbUNBQW9DO0FBQ3BDLHFDQU1xQjtBQUNyQixtQ0FBbUM7QUFDbkMsbUNBQWdDO0FBRWhDLGtDQUE0QztBQUM1QyxzQ0FBK0M7QUFDL0Msa0NBQWdGO0FBRWhGLHlDQUFnRTtBQUNoRSxtQ0FBMEM7QUFDMUMsMkNBQWdEO0FBQ2hELGlDQUF3QztBQUN4QywrQkFBaUM7QUFFakMsb0JBQTJCLEtBQVk7SUFDckMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3RCLHlCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hCLEtBQW1CLFVBQTJDLEVBQTNDLGdEQUFBLG1EQUEyQyxFQUEzQyx5REFBMkMsRUFBM0MsSUFBMkM7UUFBekQsSUFBTSxJQUFJLG9EQUFBO1FBQ2IsK0JBQWtCLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ2pDO0lBQ0Qsd0JBQXdCO0lBQ3hCLHVCQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDekIsQ0FBQztBQVJELGdDQVFDO0FBRUQsd0JBQStCLEtBQVk7SUFDekMsSUFBSSxtQkFBVyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3RCLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3BEO1NBQU07UUFDTCxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN2RDtBQUNILENBQUM7QUFORCx3Q0FNQztBQUVEOztHQUVHO0FBQ0gsNEJBQTRCLEtBQWdCO0lBQ25DLElBQUEseUJBQVEsRUFBRSxxQkFBTSxFQUFFLGlCQUFJLENBQVU7SUFFdkMsT0FBTyx3QkFBYyxDQUFDLE1B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QUM7UUFDN0QsZUFBZSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksMEJBQWMsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUV0RSw0Q0FBNEM7UUFDNUMsS0FBb0IsVUFBYyxFQUFkLEtBQUEsS0FBSyxDQUFDLFFBQVEsRUFBZCxjQUFjLEVBQWQsSUFBYztZQUE3QixJQUFNLEtBQUssU0FBQTtZQUNkLElBQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ25ELElBQUksVUFBVSxFQUFFO2dCQUNkLEtBQUssQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDaEQsVUFBVSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7YUFDMUI7U0FDRjtJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxlQUFlLENBQUM7QUFDekIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7U0NBTEVfQ0hBTk5FTFMsIFNjYWxlQ2hhbm5lbCwgU0hBUEUsIFgsIFl9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtGaWVsZERlZiwgZ2V0RmllbGREZWYsIGhhc0NvbmRpdGlvbmFsRmllbGREZWYsIGlzRmllbGREZWZ9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7R0VPU0hBUEV9IGZyb20gJy4uLy4uL21hcmsnO1xuaW1wb3J0IHtcbiAgTk9OX1RZUEVfRE9NQUlOX1JBTkdFX1ZFR0FfU0NBTEVfUFJPUEVSVElFUyxcbiAgU2NhbGUsXG4gIHNjYWxlQ29tcGF0aWJsZSxcbiAgU2NhbGVUeXBlLFxuICBzY2FsZVR5cGVQcmVjZWRlbmNlLFxufSBmcm9tICcuLi8uLi9zY2FsZSc7XG5pbXBvcnQge0dFT0pTT059IGZyb20gJy4uLy4uL3R5cGUnO1xuaW1wb3J0IHtrZXlzfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdTY2FsZX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtpc1VuaXRNb2RlbCwgTW9kZWx9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7ZGVmYXVsdFNjYWxlUmVzb2x2ZX0gZnJvbSAnLi4vcmVzb2x2ZSc7XG5pbXBvcnQge0V4cGxpY2l0LCBtZXJnZVZhbHVlc1dpdGhFeHBsaWNpdCwgdGllQnJlYWtCeUNvbXBhcmluZ30gZnJvbSAnLi4vc3BsaXQnO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uL3VuaXQnO1xuaW1wb3J0IHtTY2FsZUNvbXBvbmVudCwgU2NhbGVDb21wb25lbnRJbmRleH0gZnJvbSAnLi9jb21wb25lbnQnO1xuaW1wb3J0IHtwYXJzZVNjYWxlRG9tYWlufSBmcm9tICcuL2RvbWFpbic7XG5pbXBvcnQge3BhcnNlU2NhbGVQcm9wZXJ0eX0gZnJvbSAnLi9wcm9wZXJ0aWVzJztcbmltcG9ydCB7cGFyc2VTY2FsZVJhbmdlfSBmcm9tICcuL3JhbmdlJztcbmltcG9ydCB7c2NhbGVUeXBlfSBmcm9tICcuL3R5cGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VTY2FsZShtb2RlbDogTW9kZWwpIHtcbiAgcGFyc2VTY2FsZUNvcmUobW9kZWwpO1xuICBwYXJzZVNjYWxlRG9tYWluKG1vZGVsKTtcbiAgZm9yIChjb25zdCBwcm9wIG9mIE5PTl9UWVBFX0RPTUFJTl9SQU5HRV9WRUdBX1NDQUxFX1BST1BFUlRJRVMpIHtcbiAgICBwYXJzZVNjYWxlUHJvcGVydHkobW9kZWwsIHByb3ApO1xuICB9XG4gIC8vIHJhbmdlIGRlcGVuZHMgb24gemVyb1xuICBwYXJzZVNjYWxlUmFuZ2UobW9kZWwpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VTY2FsZUNvcmUobW9kZWw6IE1vZGVsKSB7XG4gIGlmIChpc1VuaXRNb2RlbChtb2RlbCkpIHtcbiAgICBtb2RlbC5jb21wb25lbnQuc2NhbGVzID0gcGFyc2VVbml0U2NhbGVDb3JlKG1vZGVsKTtcbiAgfSBlbHNlIHtcbiAgICBtb2RlbC5jb21wb25lbnQuc2NhbGVzID0gcGFyc2VOb25Vbml0U2NhbGVDb3JlKG1vZGVsKTtcbiAgfVxufVxuXG4vKipcbiAqIFBhcnNlIHNjYWxlcyBmb3IgYWxsIGNoYW5uZWxzIG9mIGEgbW9kZWwuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlVW5pdFNjYWxlQ29yZShtb2RlbDogVW5pdE1vZGVsKTogU2NhbGVDb21wb25lbnRJbmRleCB7XG4gIGNvbnN0IHtlbmNvZGluZywgY29uZmlnLCBtYXJrfSA9IG1vZGVsO1xuXG4gIHJldHVybiBTQ0FMRV9DSEFOTkVMUy5yZWR1Y2UoKHNjYWxlQ29tcG9uZW50czogU2NhbGVDb21wb25lbnRJbmRleCwgY2hhbm5lbDogU2NhbGVDaGFubmVsKSA9PiB7XG4gICAgbGV0IGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+O1xuICAgIGxldCBzcGVjaWZpZWRTY2FsZTogU2NhbGUgfCBudWxsID0gdW5kZWZpbmVkO1xuXG4gICAgY29uc3QgY2hhbm5lbERlZiA9IGVuY29kaW5nW2NoYW5uZWxdO1xuXG4gICAgLy8gRG9uJ3QgZ2VuZXJhdGUgc2NhbGUgZm9yIHNoYXBlIG9mIGdlb3NoYXBlXG4gICAgaWYgKFxuICAgICAgaXNGaWVsZERlZihjaGFubmVsRGVmKSAmJiBtYXJrID09PSBHRU9TSEFQRSAmJlxuICAgICAgY2hhbm5lbCA9PT0gU0hBUEUgJiYgY2hhbm5lbERlZi50eXBlID09PSBHRU9KU09OXG4gICAgKSB7XG4gICAgICByZXR1cm4gc2NhbGVDb21wb25lbnRzO1xuICAgIH1cblxuICAgIGlmIChpc0ZpZWxkRGVmKGNoYW5uZWxEZWYpKSB7XG4gICAgICBmaWVsZERlZiA9IGNoYW5uZWxEZWY7XG4gICAgICBzcGVjaWZpZWRTY2FsZSA9IGNoYW5uZWxEZWYuc2NhbGU7XG4gICAgfSBlbHNlIGlmIChoYXNDb25kaXRpb25hbEZpZWxkRGVmKGNoYW5uZWxEZWYpKSB7XG4gICAgICBmaWVsZERlZiA9IGNoYW5uZWxEZWYuY29uZGl0aW9uO1xuICAgICAgc3BlY2lmaWVkU2NhbGUgPSBjaGFubmVsRGVmLmNvbmRpdGlvblsnc2NhbGUnXTsgLy8gV2UgdXNlIFsnc2NhbGUnXSBzaW5jZSB3ZSBrbm93IHRoYXQgY2hhbm5lbCBoZXJlIGhhcyBzY2FsZSBmb3Igc3VyZVxuICAgIH0gZWxzZSBpZiAoY2hhbm5lbCA9PT0gWCkge1xuICAgICAgZmllbGREZWYgPSBnZXRGaWVsZERlZihlbmNvZGluZy54Mik7XG4gICAgfSBlbHNlIGlmIChjaGFubmVsID09PSBZKSB7XG4gICAgICBmaWVsZERlZiA9IGdldEZpZWxkRGVmKGVuY29kaW5nLnkyKTtcbiAgICB9XG5cbiAgICBpZiAoZmllbGREZWYgJiYgc3BlY2lmaWVkU2NhbGUgIT09IG51bGwgJiYgc3BlY2lmaWVkU2NhbGUgIT09IGZhbHNlKSB7XG4gICAgICBzcGVjaWZpZWRTY2FsZSA9IHNwZWNpZmllZFNjYWxlIHx8IHt9O1xuICAgICAgY29uc3Qgc3BlY2lmaWVkU2NhbGVUeXBlID0gc3BlY2lmaWVkU2NhbGUudHlwZTtcbiAgICAgIGNvbnN0IHNUeXBlID0gc2NhbGVUeXBlKHNwZWNpZmllZFNjYWxlLnR5cGUsIGNoYW5uZWwsIGZpZWxkRGVmLCBtYXJrLCBjb25maWcuc2NhbGUpO1xuICAgICAgc2NhbGVDb21wb25lbnRzW2NoYW5uZWxdID0gbmV3IFNjYWxlQ29tcG9uZW50KFxuICAgICAgICBtb2RlbC5zY2FsZU5hbWUoY2hhbm5lbCArICcnLCB0cnVlKSxcbiAgICAgICAge3ZhbHVlOiBzVHlwZSwgZXhwbGljaXQ6IHNwZWNpZmllZFNjYWxlVHlwZSA9PT0gc1R5cGV9XG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gc2NhbGVDb21wb25lbnRzO1xuICB9LCB7fSk7XG59XG5cbmNvbnN0IHNjYWxlVHlwZVRpZUJyZWFrZXIgPSB0aWVCcmVha0J5Q29tcGFyaW5nKFxuICAoc3QxOiBTY2FsZVR5cGUsIHN0MjogU2NhbGVUeXBlKSA9PiAoc2NhbGVUeXBlUHJlY2VkZW5jZShzdDEpIC0gc2NhbGVUeXBlUHJlY2VkZW5jZShzdDIpKVxuKTtcblxuXG5mdW5jdGlvbiBwYXJzZU5vblVuaXRTY2FsZUNvcmUobW9kZWw6IE1vZGVsKSB7XG4gIGNvbnN0IHNjYWxlQ29tcG9uZW50czogU2NhbGVDb21wb25lbnRJbmRleCA9IG1vZGVsLmNvbXBvbmVudC5zY2FsZXMgPSB7fTtcblxuICBjb25zdCBzY2FsZVR5cGVXaXRoRXhwbGljaXRJbmRleDoge1xuICAgIC8vIFVzaW5nIE1hcHBlZCBUeXBlIHRvIGRlY2xhcmUgdHlwZSAoaHR0cHM6Ly93d3cudHlwZXNjcmlwdGxhbmcub3JnL2RvY3MvaGFuZGJvb2svYWR2YW5jZWQtdHlwZXMuaHRtbCNtYXBwZWQtdHlwZXMpXG4gICAgW2sgaW4gU2NhbGVDaGFubmVsXT86IEV4cGxpY2l0PFNjYWxlVHlwZT5cbiAgfSA9IHt9O1xuICBjb25zdCByZXNvbHZlID0gbW9kZWwuY29tcG9uZW50LnJlc29sdmU7XG5cbiAgLy8gUGFyc2UgZWFjaCBjaGlsZCBzY2FsZSBhbmQgZGV0ZXJtaW5lIGlmIGEgcGFydGljdWxhciBjaGFubmVsIGNhbiBiZSBtZXJnZWQuXG4gIGZvciAoY29uc3QgY2hpbGQgb2YgbW9kZWwuY2hpbGRyZW4pIHtcbiAgICBwYXJzZVNjYWxlQ29yZShjaGlsZCk7XG5cbiAgICAvLyBJbnN0ZWFkIG9mIGFsd2F5cyBtZXJnaW5nIHJpZ2h0IGF3YXkgLS0gY2hlY2sgaWYgaXQgaXMgY29tcGF0aWJsZSB0byBtZXJnZSBmaXJzdCFcbiAgICBrZXlzKGNoaWxkLmNvbXBvbmVudC5zY2FsZXMpLmZvckVhY2goKGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCkgPT4ge1xuICAgICAgLy8gaWYgcmVzb2x2ZSBpcyB1bmRlZmluZWQsIHNldCBkZWZhdWx0IGZpcnN0XG4gICAgICByZXNvbHZlLnNjYWxlW2NoYW5uZWxdID0gcmVzb2x2ZS5zY2FsZVtjaGFubmVsXSB8fCBkZWZhdWx0U2NhbGVSZXNvbHZlKGNoYW5uZWwsIG1vZGVsKTtcblxuICAgICAgaWYgKHJlc29sdmUuc2NhbGVbY2hhbm5lbF0gPT09ICdzaGFyZWQnKSB7XG4gICAgICAgIGNvbnN0IGV4cGxpY2l0U2NhbGVUeXBlID0gc2NhbGVUeXBlV2l0aEV4cGxpY2l0SW5kZXhbY2hhbm5lbF07XG4gICAgICAgIGNvbnN0IGNoaWxkU2NhbGVUeXBlID0gY2hpbGQuY29tcG9uZW50LnNjYWxlc1tjaGFubmVsXS5nZXRXaXRoRXhwbGljaXQoJ3R5cGUnKTtcblxuICAgICAgICBpZiAoZXhwbGljaXRTY2FsZVR5cGUpIHtcbiAgICAgICAgICBpZiAoc2NhbGVDb21wYXRpYmxlKGV4cGxpY2l0U2NhbGVUeXBlLnZhbHVlLCBjaGlsZFNjYWxlVHlwZS52YWx1ZSkpIHtcbiAgICAgICAgICAgIC8vIG1lcmdlIHNjYWxlIGNvbXBvbmVudCBpZiB0eXBlIGFyZSBjb21wYXRpYmxlXG4gICAgICAgICAgICBzY2FsZVR5cGVXaXRoRXhwbGljaXRJbmRleFtjaGFubmVsXSA9IG1lcmdlVmFsdWVzV2l0aEV4cGxpY2l0PFZnU2NhbGUsIFNjYWxlVHlwZT4oXG4gICAgICAgICAgICAgIGV4cGxpY2l0U2NhbGVUeXBlLCBjaGlsZFNjYWxlVHlwZSwgJ3R5cGUnLCAnc2NhbGUnLCBzY2FsZVR5cGVUaWVCcmVha2VyXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBPdGhlcndpc2UsIHVwZGF0ZSBjb25mbGljdGluZyBjaGFubmVsIHRvIGJlIGluZGVwZW5kZW50XG4gICAgICAgICAgICByZXNvbHZlLnNjYWxlW2NoYW5uZWxdID0gJ2luZGVwZW5kZW50JztcbiAgICAgICAgICAgIC8vIFJlbW92ZSBmcm9tIHRoZSBpbmRleCBzbyB0aGV5IGRvbid0IGdldCBtZXJnZWRcbiAgICAgICAgICAgIGRlbGV0ZSBzY2FsZVR5cGVXaXRoRXhwbGljaXRJbmRleFtjaGFubmVsXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2NhbGVUeXBlV2l0aEV4cGxpY2l0SW5kZXhbY2hhbm5lbF0gPSBjaGlsZFNjYWxlVHlwZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gTWVyZ2UgZWFjaCBjaGFubmVsIGxpc3RlZCBpbiB0aGUgaW5kZXhcbiAga2V5cyhzY2FsZVR5cGVXaXRoRXhwbGljaXRJbmRleCkuZm9yRWFjaCgoY2hhbm5lbDogU2NhbGVDaGFubmVsKSA9PiB7XG4gICAgLy8gQ3JlYXRlIG5ldyBtZXJnZWQgc2NhbGUgY29tcG9uZW50XG4gICAgY29uc3QgbmFtZSA9IG1vZGVsLnNjYWxlTmFtZShjaGFubmVsLCB0cnVlKTtcbiAgICBjb25zdCB0eXBlV2l0aEV4cGxpY2l0ID0gc2NhbGVUeXBlV2l0aEV4cGxpY2l0SW5kZXhbY2hhbm5lbF07XG4gICAgc2NhbGVDb21wb25lbnRzW2NoYW5uZWxdID0gbmV3IFNjYWxlQ29tcG9uZW50KG5hbWUsIHR5cGVXaXRoRXhwbGljaXQpO1xuXG4gICAgLy8gcmVuYW1lIGVhY2ggY2hpbGQgYW5kIG1hcmsgdGhlbSBhcyBtZXJnZWRcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIG1vZGVsLmNoaWxkcmVuKSB7XG4gICAgICBjb25zdCBjaGlsZFNjYWxlID0gY2hpbGQuY29tcG9uZW50LnNjYWxlc1tjaGFubmVsXTtcbiAgICAgIGlmIChjaGlsZFNjYWxlKSB7XG4gICAgICAgIGNoaWxkLnJlbmFtZVNjYWxlKGNoaWxkU2NhbGUuZ2V0KCduYW1lJyksIG5hbWUpO1xuICAgICAgICBjaGlsZFNjYWxlLm1lcmdlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gc2NhbGVDb21wb25lbnRzO1xufVxuIl19