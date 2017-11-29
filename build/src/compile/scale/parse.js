"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var scale_1 = require("../../scale");
var util_1 = require("../../util");
var model_1 = require("../model");
var resolve_1 = require("../resolve");
var split_1 = require("../split");
var component_1 = require("./component");
var domain_1 = require("./domain");
var properties_1 = require("./properties");
var range_1 = require("./range");
var type_1 = require("./type");
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
        if (fielddef_1.isFieldDef(channelDef)) {
            fieldDef = channelDef;
            specifiedScale = channelDef.scale || {};
        }
        else if (fielddef_1.hasConditionalFieldDef(channelDef)) {
            fieldDef = channelDef.condition;
            specifiedScale = channelDef.condition['scale'] || {}; // We use ['scale'] since we know that channel here has scale for sure
        }
        else if (channel === 'x') {
            fieldDef = fielddef_1.getFieldDef(encoding.x2);
        }
        else if (channel === 'y') {
            fieldDef = fielddef_1.getFieldDef(encoding.y2);
        }
        if (fieldDef) {
            var specifiedScaleType = specifiedScale.type;
            var sType = type_1.scaleType(specifiedScale.type, channel, fieldDef, mark, config.scale);
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
                var scaleType_1 = scaleTypeWithExplicitIndex[channel];
                var childScaleType = child.component.scales[channel].getWithExplicit('type');
                if (scaleType_1) {
                    if (scale_1.scaleCompatible(scaleType_1.value, childScaleType.value)) {
                        // merge scale component if type are compatible
                        scaleTypeWithExplicitIndex[channel] = split_1.mergeValuesWithExplicit(scaleType_1, childScaleType, 'type', 'scale', scaleTypeTieBreaker);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9wYXJzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUEyRDtBQUMzRCwyQ0FBeUY7QUFDekYscUNBTXFCO0FBQ3JCLG1DQUFnQztBQUVoQyxrQ0FBNEM7QUFDNUMsc0NBQStDO0FBQy9DLGtDQUFnRjtBQUVoRix5Q0FBZ0U7QUFDaEUsbUNBQTBDO0FBQzFDLDJDQUFnRDtBQUNoRCxpQ0FBd0M7QUFDeEMsK0JBQWlDO0FBRWpDLG9CQUEyQixLQUFZO0lBQ3JDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0Qix5QkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4QixHQUFHLENBQUMsQ0FBZSxVQUEyQyxFQUEzQyxnREFBQSxtREFBMkMsRUFBM0MseURBQTJDLEVBQTNDLElBQTJDO1FBQXpELElBQU0sSUFBSSxvREFBQTtRQUNiLCtCQUFrQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNqQztJQUNELHdCQUF3QjtJQUN4Qix1QkFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3pCLENBQUM7QUFSRCxnQ0FRQztBQUVELHdCQUErQixLQUFZO0lBQ3pDLEVBQUUsQ0FBQyxDQUFDLG1CQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hELENBQUM7QUFDSCxDQUFDO0FBTkQsd0NBTUM7QUFFRDs7R0FFRztBQUNILDRCQUE0QixLQUFnQjtJQUNuQyxJQUFBLHlCQUFRLEVBQUUscUJBQU0sQ0FBVTtJQUNqQyxJ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QyxVQUFDLE9BQXFCO1FBQzdELG9DQUFvQztRQUNwQyxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM1QyxJQUFNLGdCQUFnQixHQUFHLDBCQUEwQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdELGVBQWUsQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLDBCQUFjLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFFdEUsNENBQTRDO1FBQzVDLEdBQUcsQ0FBQyxDQUFnQixVQUFjLEVBQWQsS0FBQSxLQUFLLENBQUMsUUFBUSxFQUFkLGNBQWMsRUFBZCxJQUFjO1lBQTdCLElBQU0sS0FBSyxTQUFBO1lBQ2QsSUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDbkQsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDZixLQUFLLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ2hELFVBQVUsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1lBQzNCLENBQUM7U0FDRjtJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLGVBQWUsQ0FBQztBQUN6QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtTQ0FMRV9DSEFOTkVMUywgU2NhbGVDaGFubmVsfSBmcm9tICcuLi8uLi9jaGFubmVsJztcbmltcG9ydCB7RmllbGREZWYsIGdldEZpZWxkRGVmLCBoYXNDb25kaXRpb25hbEZpZWxkRGVmLCBpc0ZpZWxkRGVmfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQge1xuICBOT05fVFlQRV9ET01BSU5fUkFOR0VfVkVHQV9TQ0FMRV9QUk9QRVJUSUVTLFxuICBTY2FsZSxcbiAgc2NhbGVDb21wYXRpYmxlLFxuICBTY2FsZVR5cGUsXG4gIHNjYWxlVHlwZVByZWNlZGVuY2UsXG59IGZyb20gJy4uLy4uL3NjYWxlJztcbmltcG9ydCB7a2V5c30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnU2NhbGV9IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7aXNVbml0TW9kZWwsIE1vZGVsfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge2RlZmF1bHRTY2FsZVJlc29sdmV9IGZyb20gJy4uL3Jlc29sdmUnO1xuaW1wb3J0IHtFeHBsaWNpdCwgbWVyZ2VWYWx1ZXNXaXRoRXhwbGljaXQsIHRpZUJyZWFrQnlDb21wYXJpbmd9IGZyb20gJy4uL3NwbGl0JztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCB7U2NhbGVDb21wb25lbnQsIFNjYWxlQ29tcG9uZW50SW5kZXh9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7cGFyc2VTY2FsZURvbWFpbn0gZnJvbSAnLi9kb21haW4nO1xuaW1wb3J0IHtwYXJzZVNjYWxlUHJvcGVydHl9IGZyb20gJy4vcHJvcGVydGllcyc7XG5pbXBvcnQge3BhcnNlU2NhbGVSYW5nZX0gZnJvbSAnLi9yYW5nZSc7XG5pbXBvcnQge3NjYWxlVHlwZX0gZnJvbSAnLi90eXBlJztcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU2NhbGUobW9kZWw6IE1vZGVsKSB7XG4gIHBhcnNlU2NhbGVDb3JlKG1vZGVsKTtcbiAgcGFyc2VTY2FsZURvbWFpbihtb2RlbCk7XG4gIGZvciAoY29uc3QgcHJvcCBvZiBOT05fVFlQRV9ET01BSU5fUkFOR0VfVkVHQV9TQ0FMRV9QUk9QRVJUSUVTKSB7XG4gICAgcGFyc2VTY2FsZVByb3BlcnR5KG1vZGVsLCBwcm9wKTtcbiAgfVxuICAvLyByYW5nZSBkZXBlbmRzIG9uIHplcm9cbiAgcGFyc2VTY2FsZVJhbmdlKG1vZGVsKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU2NhbGVDb3JlKG1vZGVsOiBNb2RlbCkge1xuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpKSB7XG4gICAgbW9kZWwuY29tcG9uZW50LnNjYWxlcyA9IHBhcnNlVW5pdFNjYWxlQ29yZShtb2RlbCk7XG4gIH0gZWxzZSB7XG4gICAgbW9kZWwuY29tcG9uZW50LnNjYWxlcyA9IHBhcnNlTm9uVW5pdFNjYWxlQ29yZShtb2RlbCk7XG4gIH1cbn1cblxuLyoqXG4gKiBQYXJzZSBzY2FsZXMgZm9yIGFsbCBjaGFubmVscyBvZiBhIG1vZGVsLlxuICovXG5mdW5jdGlvbiBwYXJzZVVuaXRTY2FsZUNvcmUobW9kZWw6IFVuaXRNb2RlbCk6IFNjYWxlQ29tcG9uZW50SW5kZXgge1xuICBjb25zdCB7ZW5jb2RpbmcsIGNvbmZpZ30gPSBtb2RlbDtcbiAgY29uc3QgbWFyayA9IG1vZGVsLm1hcmsoKTtcblxuICByZXR1cm4gU0NBTEVfQ0hBTk5FTFMucmVkdWNlKChzY2FsZUNvbXBvbmVudHM6IFNjYWxlQ29tcG9uZW50SW5kZXgsIGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCkgPT4ge1xuICAgIGxldCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPjtcbiAgICBsZXQgc3BlY2lmaWVkU2NhbGU6IFNjYWxlID0ge307XG5cbiAgICBjb25zdCBjaGFubmVsRGVmID0gZW5jb2RpbmdbY2hhbm5lbF07XG5cbiAgICBpZiAoaXNGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgICAgZmllbGREZWYgPSBjaGFubmVsRGVmO1xuICAgICAgc3BlY2lmaWVkU2NhbGUgPSBjaGFubmVsRGVmLnNjYWxlIHx8IHt9O1xuICAgIH0gZWxzZSBpZiAoaGFzQ29uZGl0aW9uYWxGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgICAgZmllbGREZWYgPSBjaGFubmVsRGVmLmNvbmRpdGlvbjtcbiAgICAgIHNwZWNpZmllZFNjYWxlID0gY2hhbm5lbERlZi5jb25kaXRpb25bJ3NjYWxlJ10gfHwge307IC8vIFdlIHVzZSBbJ3NjYWxlJ10gc2luY2Ugd2Uga25vdyB0aGF0IGNoYW5uZWwgaGVyZSBoYXMgc2NhbGUgZm9yIHN1cmVcbiAgICB9IGVsc2UgaWYgKGNoYW5uZWwgPT09ICd4Jykge1xuICAgICAgZmllbGREZWYgPSBnZXRGaWVsZERlZihlbmNvZGluZy54Mik7XG4gICAgfSBlbHNlIGlmIChjaGFubmVsID09PSAneScpIHtcbiAgICAgIGZpZWxkRGVmID0gZ2V0RmllbGREZWYoZW5jb2RpbmcueTIpO1xuICAgIH1cblxuICAgIGlmIChmaWVsZERlZikge1xuICAgICAgY29uc3Qgc3BlY2lmaWVkU2NhbGVUeXBlID0gc3BlY2lmaWVkU2NhbGUudHlwZTtcbiAgICAgIGNvbnN0IHNUeXBlID0gc2NhbGVUeXBlKHNwZWNpZmllZFNjYWxlLnR5cGUsIGNoYW5uZWwsIGZpZWxkRGVmLCBtYXJrLCBjb25maWcuc2NhbGUpO1xuICAgICAgc2NhbGVDb21wb25lbnRzW2NoYW5uZWxdID0gbmV3IFNjYWxlQ29tcG9uZW50KFxuICAgICAgICBtb2RlbC5zY2FsZU5hbWUoY2hhbm5lbCArICcnLCB0cnVlKSxcbiAgICAgICAge3ZhbHVlOiBzVHlwZSwgZXhwbGljaXQ6IHNwZWNpZmllZFNjYWxlVHlwZSA9PT0gc1R5cGV9XG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gc2NhbGVDb21wb25lbnRzO1xuICB9LCB7fSk7XG59XG5cbmNvbnN0IHNjYWxlVHlwZVRpZUJyZWFrZXIgPSB0aWVCcmVha0J5Q29tcGFyaW5nKFxuICAoc3QxOiBTY2FsZVR5cGUsIHN0MjogU2NhbGVUeXBlKSA9PiAoc2NhbGVUeXBlUHJlY2VkZW5jZShzdDEpIC0gc2NhbGVUeXBlUHJlY2VkZW5jZShzdDIpKVxuKTtcblxuXG5mdW5jdGlvbiBwYXJzZU5vblVuaXRTY2FsZUNvcmUobW9kZWw6IE1vZGVsKSB7XG4gIGNvbnN0IHNjYWxlQ29tcG9uZW50czogU2NhbGVDb21wb25lbnRJbmRleCA9IG1vZGVsLmNvbXBvbmVudC5zY2FsZXMgPSB7fTtcblxuICBjb25zdCBzY2FsZVR5cGVXaXRoRXhwbGljaXRJbmRleDoge1xuICAgIC8vIFVzaW5nIE1hcHBlZCBUeXBlIHRvIGRlY2xhcmUgdHlwZSAoaHR0cHM6Ly93d3cudHlwZXNjcmlwdGxhbmcub3JnL2RvY3MvaGFuZGJvb2svYWR2YW5jZWQtdHlwZXMuaHRtbCNtYXBwZWQtdHlwZXMpXG4gICAgW2sgaW4gU2NhbGVDaGFubmVsXT86IEV4cGxpY2l0PFNjYWxlVHlwZT5cbiAgfSA9IHt9O1xuICBjb25zdCByZXNvbHZlID0gbW9kZWwuY29tcG9uZW50LnJlc29sdmU7XG5cbiAgLy8gUGFyc2UgZWFjaCBjaGlsZCBzY2FsZSBhbmQgZGV0ZXJtaW5lIGlmIGEgcGFydGljdWxhciBjaGFubmVsIGNhbiBiZSBtZXJnZWQuXG4gIGZvciAoY29uc3QgY2hpbGQgb2YgbW9kZWwuY2hpbGRyZW4pIHtcbiAgICBwYXJzZVNjYWxlQ29yZShjaGlsZCk7XG5cbiAgICAvLyBJbnN0ZWFkIG9mIGFsd2F5cyBtZXJnaW5nIHJpZ2h0IGF3YXkgLS0gY2hlY2sgaWYgaXQgaXMgY29tcGF0aWJsZSB0byBtZXJnZSBmaXJzdCFcbiAgICBrZXlzKGNoaWxkLmNvbXBvbmVudC5zY2FsZXMpLmZvckVhY2goKGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCkgPT4ge1xuICAgICAgLy8gaWYgcmVzb2x2ZSBpcyB1bmRlZmluZWQsIHNldCBkZWZhdWx0IGZpcnN0XG4gICAgICByZXNvbHZlLnNjYWxlW2NoYW5uZWxdID0gcmVzb2x2ZS5zY2FsZVtjaGFubmVsXSB8fCBkZWZhdWx0U2NhbGVSZXNvbHZlKGNoYW5uZWwsIG1vZGVsKTtcblxuICAgICAgaWYgKHJlc29sdmUuc2NhbGVbY2hhbm5lbF0gPT09ICdzaGFyZWQnKSB7XG4gICAgICAgIGNvbnN0IHNjYWxlVHlwZSA9IHNjYWxlVHlwZVdpdGhFeHBsaWNpdEluZGV4W2NoYW5uZWxdO1xuICAgICAgICBjb25zdCBjaGlsZFNjYWxlVHlwZSA9IGNoaWxkLmNvbXBvbmVudC5zY2FsZXNbY2hhbm5lbF0uZ2V0V2l0aEV4cGxpY2l0KCd0eXBlJyk7XG5cbiAgICAgICAgaWYgKHNjYWxlVHlwZSkge1xuICAgICAgICAgIGlmIChzY2FsZUNvbXBhdGlibGUoc2NhbGVUeXBlLnZhbHVlLCBjaGlsZFNjYWxlVHlwZS52YWx1ZSkpIHtcbiAgICAgICAgICAgIC8vIG1lcmdlIHNjYWxlIGNvbXBvbmVudCBpZiB0eXBlIGFyZSBjb21wYXRpYmxlXG4gICAgICAgICAgICBzY2FsZVR5cGVXaXRoRXhwbGljaXRJbmRleFtjaGFubmVsXSA9IG1lcmdlVmFsdWVzV2l0aEV4cGxpY2l0PFZnU2NhbGUsIFNjYWxlVHlwZT4oXG4gICAgICAgICAgICAgIHNjYWxlVHlwZSwgY2hpbGRTY2FsZVR5cGUsICd0eXBlJywgJ3NjYWxlJywgc2NhbGVUeXBlVGllQnJlYWtlclxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCB1cGRhdGUgY29uZmxpY3RpbmcgY2hhbm5lbCB0byBiZSBpbmRlcGVuZGVudFxuICAgICAgICAgICAgcmVzb2x2ZS5zY2FsZVtjaGFubmVsXSA9ICdpbmRlcGVuZGVudCc7XG4gICAgICAgICAgICAvLyBSZW1vdmUgZnJvbSB0aGUgaW5kZXggc28gdGhleSBkb24ndCBnZXQgbWVyZ2VkXG4gICAgICAgICAgICBkZWxldGUgc2NhbGVUeXBlV2l0aEV4cGxpY2l0SW5kZXhbY2hhbm5lbF07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNjYWxlVHlwZVdpdGhFeHBsaWNpdEluZGV4W2NoYW5uZWxdID0gY2hpbGRTY2FsZVR5cGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIE1lcmdlIGVhY2ggY2hhbm5lbCBsaXN0ZWQgaW4gdGhlIGluZGV4XG4gIGtleXMoc2NhbGVUeXBlV2l0aEV4cGxpY2l0SW5kZXgpLmZvckVhY2goKGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCkgPT4ge1xuICAgIC8vIENyZWF0ZSBuZXcgbWVyZ2VkIHNjYWxlIGNvbXBvbmVudFxuICAgIGNvbnN0IG5hbWUgPSBtb2RlbC5zY2FsZU5hbWUoY2hhbm5lbCwgdHJ1ZSk7XG4gICAgY29uc3QgdHlwZVdpdGhFeHBsaWNpdCA9IHNjYWxlVHlwZVdpdGhFeHBsaWNpdEluZGV4W2NoYW5uZWxdO1xuICAgIHNjYWxlQ29tcG9uZW50c1tjaGFubmVsXSA9IG5ldyBTY2FsZUNvbXBvbmVudChuYW1lLCB0eXBlV2l0aEV4cGxpY2l0KTtcblxuICAgIC8vIHJlbmFtZSBlYWNoIGNoaWxkIGFuZCBtYXJrIHRoZW0gYXMgbWVyZ2VkXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBtb2RlbC5jaGlsZHJlbikge1xuICAgICAgY29uc3QgY2hpbGRTY2FsZSA9IGNoaWxkLmNvbXBvbmVudC5zY2FsZXNbY2hhbm5lbF07XG4gICAgICBpZiAoY2hpbGRTY2FsZSkge1xuICAgICAgICBjaGlsZC5yZW5hbWVTY2FsZShjaGlsZFNjYWxlLmdldCgnbmFtZScpLCBuYW1lKTtcbiAgICAgICAgY2hpbGRTY2FsZS5tZXJnZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHNjYWxlQ29tcG9uZW50cztcbn1cbiJdfQ==