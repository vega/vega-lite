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
    var encoding = model.encoding, config = model.config;
    var mark = model.mark();
    return channel_1.SCALE_CHANNELS.reduce(function (scaleComponents, channel) {
        var fieldDef;
        var specifiedScale = {};
        var channelDef = encoding[channel];
        // If mark has a projection (potentially implicitly), there is no need to generate a scale.
        if (fielddef_1.isFieldDef(channelDef) && ((mark === mark_1.GEOSHAPE && fielddef_1.isFieldDef(channelDef) && channel === channel_1.SHAPE && channelDef.type === type_1.GEOJSON)
            || (util_1.contains([channel_1.X, channel_1.Y, channel_1.X2, channel_1.Y2], channel) && util_1.contains([type_1.LATITUDE, type_1.LONGITUDE], channelDef.type)))) {
            return scaleComponents;
        }
        if (fielddef_1.isFieldDef(channelDef)) {
            fieldDef = channelDef;
            specifiedScale = channelDef.scale || {};
        }
        else if (fielddef_1.hasConditionalFieldDef(channelDef)) {
            fieldDef = channelDef.condition;
            specifiedScale = channelDef.condition['scale'] || {}; // We use ['scale'] since we know that channel here has scale for sure
        }
        else if (channel === channel_1.X) {
            fieldDef = fielddef_1.getFieldDef(encoding.x2);
        }
        else if (channel === channel_1.Y) {
            fieldDef = fielddef_1.getFieldDef(encoding.y2);
        }
        if (fieldDef) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9wYXJzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUFnRjtBQUNoRiwyQ0FBeUY7QUFDekYsbUNBQW9DO0FBQ3BDLHFDQU1xQjtBQUNyQixtQ0FBd0Q7QUFDeEQsbUNBQTBDO0FBRTFDLGtDQUE0QztBQUM1QyxzQ0FBK0M7QUFDL0Msa0NBQWdGO0FBRWhGLHlDQUFnRTtBQUNoRSxtQ0FBMEM7QUFDMUMsMkNBQWdEO0FBQ2hELGlDQUF3QztBQUN4QywrQkFBaUM7QUFFakMsb0JBQTJCLEtBQVk7SUFDckMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3RCLHlCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hCLEdBQUcsQ0FBQyxDQUFlLFVBQTJDLEVBQTNDLGdEQUFBLG1EQUEyQyxFQUEzQyx5REFBMkMsRUFBM0MsSUFBMkM7UUFBekQsSUFBTSxJQUFJLG9EQUFBO1FBQ2IsK0JBQWtCLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ2pDO0lBQ0Qsd0JBQXdCO0lBQ3hCLHVCQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDekIsQ0FBQztBQVJELGdDQVFDO0FBRUQsd0JBQStCLEtBQVk7SUFDekMsRUFBRSxDQUFDLENBQUMsbUJBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEQsQ0FBQztBQUNILENBQUM7QUFORCx3Q0FNQztBQUVEOztHQUVHO0FBQ0gsNEJBQTRCLEtBQWdCO0lBQ25DLElBQUEseUJB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QUksQ0FBQyxDQUFDO2dCQUNoRCxVQUFVLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUMzQixDQUFDO1NBQ0Y7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxlQUFlLENBQUM7QUFDekIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7U0NBTEVfQ0hBTk5FTFMsIFNjYWxlQ2hhbm5lbCwgU0hBUEUsIFgsIFgyLCBZLCBZMn0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge0ZpZWxkRGVmLCBnZXRGaWVsZERlZiwgaGFzQ29uZGl0aW9uYWxGaWVsZERlZiwgaXNGaWVsZERlZn0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtHRU9TSEFQRX0gZnJvbSAnLi4vLi4vbWFyayc7XG5pbXBvcnQge1xuICBOT05fVFlQRV9ET01BSU5fUkFOR0VfVkVHQV9TQ0FMRV9QUk9QRVJUSUVTLFxuICBTY2FsZSxcbiAgc2NhbGVDb21wYXRpYmxlLFxuICBTY2FsZVR5cGUsXG4gIHNjYWxlVHlwZVByZWNlZGVuY2UsXG59IGZyb20gJy4uLy4uL3NjYWxlJztcbmltcG9ydCB7R0VPSlNPTiwgTEFUSVRVREUsIExPTkdJVFVERX0gZnJvbSAnLi4vLi4vdHlwZSc7XG5pbXBvcnQge2NvbnRhaW5zLCBrZXlzfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdTY2FsZX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtpc1VuaXRNb2RlbCwgTW9kZWx9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7ZGVmYXVsdFNjYWxlUmVzb2x2ZX0gZnJvbSAnLi4vcmVzb2x2ZSc7XG5pbXBvcnQge0V4cGxpY2l0LCBtZXJnZVZhbHVlc1dpdGhFeHBsaWNpdCwgdGllQnJlYWtCeUNvbXBhcmluZ30gZnJvbSAnLi4vc3BsaXQnO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uL3VuaXQnO1xuaW1wb3J0IHtTY2FsZUNvbXBvbmVudCwgU2NhbGVDb21wb25lbnRJbmRleH0gZnJvbSAnLi9jb21wb25lbnQnO1xuaW1wb3J0IHtwYXJzZVNjYWxlRG9tYWlufSBmcm9tICcuL2RvbWFpbic7XG5pbXBvcnQge3BhcnNlU2NhbGVQcm9wZXJ0eX0gZnJvbSAnLi9wcm9wZXJ0aWVzJztcbmltcG9ydCB7cGFyc2VTY2FsZVJhbmdlfSBmcm9tICcuL3JhbmdlJztcbmltcG9ydCB7c2NhbGVUeXBlfSBmcm9tICcuL3R5cGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VTY2FsZShtb2RlbDogTW9kZWwpIHtcbiAgcGFyc2VTY2FsZUNvcmUobW9kZWwpO1xuICBwYXJzZVNjYWxlRG9tYWluKG1vZGVsKTtcbiAgZm9yIChjb25zdCBwcm9wIG9mIE5PTl9UWVBFX0RPTUFJTl9SQU5HRV9WRUdBX1NDQUxFX1BST1BFUlRJRVMpIHtcbiAgICBwYXJzZVNjYWxlUHJvcGVydHkobW9kZWwsIHByb3ApO1xuICB9XG4gIC8vIHJhbmdlIGRlcGVuZHMgb24gemVyb1xuICBwYXJzZVNjYWxlUmFuZ2UobW9kZWwpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VTY2FsZUNvcmUobW9kZWw6IE1vZGVsKSB7XG4gIGlmIChpc1VuaXRNb2RlbChtb2RlbCkpIHtcbiAgICBtb2RlbC5jb21wb25lbnQuc2NhbGVzID0gcGFyc2VVbml0U2NhbGVDb3JlKG1vZGVsKTtcbiAgfSBlbHNlIHtcbiAgICBtb2RlbC5jb21wb25lbnQuc2NhbGVzID0gcGFyc2VOb25Vbml0U2NhbGVDb3JlKG1vZGVsKTtcbiAgfVxufVxuXG4vKipcbiAqIFBhcnNlIHNjYWxlcyBmb3IgYWxsIGNoYW5uZWxzIG9mIGEgbW9kZWwuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlVW5pdFNjYWxlQ29yZShtb2RlbDogVW5pdE1vZGVsKTogU2NhbGVDb21wb25lbnRJbmRleCB7XG4gIGNvbnN0IHtlbmNvZGluZywgY29uZmlnfSA9IG1vZGVsO1xuICBjb25zdCBtYXJrID0gbW9kZWwubWFyaygpO1xuXG4gIHJldHVybiBTQ0FMRV9DSEFOTkVMUy5yZWR1Y2UoKHNjYWxlQ29tcG9uZW50czogU2NhbGVDb21wb25lbnRJbmRleCwgY2hhbm5lbDogU2NhbGVDaGFubmVsKSA9PiB7XG4gICAgbGV0IGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+O1xuICAgIGxldCBzcGVjaWZpZWRTY2FsZTogU2NhbGUgPSB7fTtcblxuICAgIGNvbnN0IGNoYW5uZWxEZWYgPSBlbmNvZGluZ1tjaGFubmVsXTtcblxuICAgIC8vIElmIG1hcmsgaGFzIGEgcHJvamVjdGlvbiAocG90ZW50aWFsbHkgaW1wbGljaXRseSksIHRoZXJlIGlzIG5vIG5lZWQgdG8gZ2VuZXJhdGUgYSBzY2FsZS5cbiAgICBpZiAoaXNGaWVsZERlZihjaGFubmVsRGVmKSAmJiAoKG1hcmsgPT09IEdFT1NIQVBFICYmIGlzRmllbGREZWYoY2hhbm5lbERlZikgJiYgY2hhbm5lbCA9PT0gU0hBUEUgJiYgY2hhbm5lbERlZi50eXBlID09PSBHRU9KU09OKVxuICAgIHx8IChjb250YWlucyhbWCwgWSwgWDIsIFkyXSwgY2hhbm5lbCkgJiYgY29udGFpbnMoW0xBVElUVURFLCBMT05HSVRVREVdLCBjaGFubmVsRGVmLnR5cGUpKSkpIHtcbiAgICAgIHJldHVybiBzY2FsZUNvbXBvbmVudHM7XG4gICAgfVxuXG4gICAgaWYgKGlzRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICAgIGZpZWxkRGVmID0gY2hhbm5lbERlZjtcbiAgICAgIHNwZWNpZmllZFNjYWxlID0gY2hhbm5lbERlZi5zY2FsZSB8fCB7fTtcbiAgICB9IGVsc2UgaWYgKGhhc0NvbmRpdGlvbmFsRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICAgIGZpZWxkRGVmID0gY2hhbm5lbERlZi5jb25kaXRpb247XG4gICAgICBzcGVjaWZpZWRTY2FsZSA9IGNoYW5uZWxEZWYuY29uZGl0aW9uWydzY2FsZSddIHx8IHt9OyAvLyBXZSB1c2UgWydzY2FsZSddIHNpbmNlIHdlIGtub3cgdGhhdCBjaGFubmVsIGhlcmUgaGFzIHNjYWxlIGZvciBzdXJlXG4gICAgfSBlbHNlIGlmIChjaGFubmVsID09PSBYKSB7XG4gICAgICBmaWVsZERlZiA9IGdldEZpZWxkRGVmKGVuY29kaW5nLngyKTtcbiAgICB9IGVsc2UgaWYgKGNoYW5uZWwgPT09IFkpIHtcbiAgICAgIGZpZWxkRGVmID0gZ2V0RmllbGREZWYoZW5jb2RpbmcueTIpO1xuICAgIH1cblxuICAgIGlmIChmaWVsZERlZikge1xuICAgICAgY29uc3Qgc3BlY2lmaWVkU2NhbGVUeXBlID0gc3BlY2lmaWVkU2NhbGUudHlwZTtcbiAgICAgIGNvbnN0IHNUeXBlID0gc2NhbGVUeXBlKHNwZWNpZmllZFNjYWxlLnR5cGUsIGNoYW5uZWwsIGZpZWxkRGVmLCBtYXJrLCBjb25maWcuc2NhbGUpO1xuICAgICAgc2NhbGVDb21wb25lbnRzW2NoYW5uZWxdID0gbmV3IFNjYWxlQ29tcG9uZW50KFxuICAgICAgICBtb2RlbC5zY2FsZU5hbWUoY2hhbm5lbCArICcnLCB0cnVlKSxcbiAgICAgICAge3ZhbHVlOiBzVHlwZSwgZXhwbGljaXQ6IHNwZWNpZmllZFNjYWxlVHlwZSA9PT0gc1R5cGV9XG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gc2NhbGVDb21wb25lbnRzO1xuICB9LCB7fSk7XG59XG5cbmNvbnN0IHNjYWxlVHlwZVRpZUJyZWFrZXIgPSB0aWVCcmVha0J5Q29tcGFyaW5nKFxuICAoc3QxOiBTY2FsZVR5cGUsIHN0MjogU2NhbGVUeXBlKSA9PiAoc2NhbGVUeXBlUHJlY2VkZW5jZShzdDEpIC0gc2NhbGVUeXBlUHJlY2VkZW5jZShzdDIpKVxuKTtcblxuXG5mdW5jdGlvbiBwYXJzZU5vblVuaXRTY2FsZUNvcmUobW9kZWw6IE1vZGVsKSB7XG4gIGNvbnN0IHNjYWxlQ29tcG9uZW50czogU2NhbGVDb21wb25lbnRJbmRleCA9IG1vZGVsLmNvbXBvbmVudC5zY2FsZXMgPSB7fTtcblxuICBjb25zdCBzY2FsZVR5cGVXaXRoRXhwbGljaXRJbmRleDoge1xuICAgIC8vIFVzaW5nIE1hcHBlZCBUeXBlIHRvIGRlY2xhcmUgdHlwZSAoaHR0cHM6Ly93d3cudHlwZXNjcmlwdGxhbmcub3JnL2RvY3MvaGFuZGJvb2svYWR2YW5jZWQtdHlwZXMuaHRtbCNtYXBwZWQtdHlwZXMpXG4gICAgW2sgaW4gU2NhbGVDaGFubmVsXT86IEV4cGxpY2l0PFNjYWxlVHlwZT5cbiAgfSA9IHt9O1xuICBjb25zdCByZXNvbHZlID0gbW9kZWwuY29tcG9uZW50LnJlc29sdmU7XG5cbiAgLy8gUGFyc2UgZWFjaCBjaGlsZCBzY2FsZSBhbmQgZGV0ZXJtaW5lIGlmIGEgcGFydGljdWxhciBjaGFubmVsIGNhbiBiZSBtZXJnZWQuXG4gIGZvciAoY29uc3QgY2hpbGQgb2YgbW9kZWwuY2hpbGRyZW4pIHtcbiAgICBwYXJzZVNjYWxlQ29yZShjaGlsZCk7XG5cbiAgICAvLyBJbnN0ZWFkIG9mIGFsd2F5cyBtZXJnaW5nIHJpZ2h0IGF3YXkgLS0gY2hlY2sgaWYgaXQgaXMgY29tcGF0aWJsZSB0byBtZXJnZSBmaXJzdCFcbiAgICBrZXlzKGNoaWxkLmNvbXBvbmVudC5zY2FsZXMpLmZvckVhY2goKGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCkgPT4ge1xuICAgICAgLy8gaWYgcmVzb2x2ZSBpcyB1bmRlZmluZWQsIHNldCBkZWZhdWx0IGZpcnN0XG4gICAgICByZXNvbHZlLnNjYWxlW2NoYW5uZWxdID0gcmVzb2x2ZS5zY2FsZVtjaGFubmVsXSB8fCBkZWZhdWx0U2NhbGVSZXNvbHZlKGNoYW5uZWwsIG1vZGVsKTtcblxuICAgICAgaWYgKHJlc29sdmUuc2NhbGVbY2hhbm5lbF0gPT09ICdzaGFyZWQnKSB7XG4gICAgICAgIGNvbnN0IGV4cGxpY2l0U2NhbGVUeXBlID0gc2NhbGVUeXBlV2l0aEV4cGxpY2l0SW5kZXhbY2hhbm5lbF07XG4gICAgICAgIGNvbnN0IGNoaWxkU2NhbGVUeXBlID0gY2hpbGQuY29tcG9uZW50LnNjYWxlc1tjaGFubmVsXS5nZXRXaXRoRXhwbGljaXQoJ3R5cGUnKTtcblxuICAgICAgICBpZiAoZXhwbGljaXRTY2FsZVR5cGUpIHtcbiAgICAgICAgICBpZiAoc2NhbGVDb21wYXRpYmxlKGV4cGxpY2l0U2NhbGVUeXBlLnZhbHVlLCBjaGlsZFNjYWxlVHlwZS52YWx1ZSkpIHtcbiAgICAgICAgICAgIC8vIG1lcmdlIHNjYWxlIGNvbXBvbmVudCBpZiB0eXBlIGFyZSBjb21wYXRpYmxlXG4gICAgICAgICAgICBzY2FsZVR5cGVXaXRoRXhwbGljaXRJbmRleFtjaGFubmVsXSA9IG1lcmdlVmFsdWVzV2l0aEV4cGxpY2l0PFZnU2NhbGUsIFNjYWxlVHlwZT4oXG4gICAgICAgICAgICAgIGV4cGxpY2l0U2NhbGVUeXBlLCBjaGlsZFNjYWxlVHlwZSwgJ3R5cGUnLCAnc2NhbGUnLCBzY2FsZVR5cGVUaWVCcmVha2VyXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBPdGhlcndpc2UsIHVwZGF0ZSBjb25mbGljdGluZyBjaGFubmVsIHRvIGJlIGluZGVwZW5kZW50XG4gICAgICAgICAgICByZXNvbHZlLnNjYWxlW2NoYW5uZWxdID0gJ2luZGVwZW5kZW50JztcbiAgICAgICAgICAgIC8vIFJlbW92ZSBmcm9tIHRoZSBpbmRleCBzbyB0aGV5IGRvbid0IGdldCBtZXJnZWRcbiAgICAgICAgICAgIGRlbGV0ZSBzY2FsZVR5cGVXaXRoRXhwbGljaXRJbmRleFtjaGFubmVsXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2NhbGVUeXBlV2l0aEV4cGxpY2l0SW5kZXhbY2hhbm5lbF0gPSBjaGlsZFNjYWxlVHlwZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gTWVyZ2UgZWFjaCBjaGFubmVsIGxpc3RlZCBpbiB0aGUgaW5kZXhcbiAga2V5cyhzY2FsZVR5cGVXaXRoRXhwbGljaXRJbmRleCkuZm9yRWFjaCgoY2hhbm5lbDogU2NhbGVDaGFubmVsKSA9PiB7XG4gICAgLy8gQ3JlYXRlIG5ldyBtZXJnZWQgc2NhbGUgY29tcG9uZW50XG4gICAgY29uc3QgbmFtZSA9IG1vZGVsLnNjYWxlTmFtZShjaGFubmVsLCB0cnVlKTtcbiAgICBjb25zdCB0eXBlV2l0aEV4cGxpY2l0ID0gc2NhbGVUeXBlV2l0aEV4cGxpY2l0SW5kZXhbY2hhbm5lbF07XG4gICAgc2NhbGVDb21wb25lbnRzW2NoYW5uZWxdID0gbmV3IFNjYWxlQ29tcG9uZW50KG5hbWUsIHR5cGVXaXRoRXhwbGljaXQpO1xuXG4gICAgLy8gcmVuYW1lIGVhY2ggY2hpbGQgYW5kIG1hcmsgdGhlbSBhcyBtZXJnZWRcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIG1vZGVsLmNoaWxkcmVuKSB7XG4gICAgICBjb25zdCBjaGlsZFNjYWxlID0gY2hpbGQuY29tcG9uZW50LnNjYWxlc1tjaGFubmVsXTtcbiAgICAgIGlmIChjaGlsZFNjYWxlKSB7XG4gICAgICAgIGNoaWxkLnJlbmFtZVNjYWxlKGNoaWxkU2NhbGUuZ2V0KCduYW1lJyksIG5hbWUpO1xuICAgICAgICBjaGlsZFNjYWxlLm1lcmdlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gc2NhbGVDb21wb25lbnRzO1xufVxuIl19