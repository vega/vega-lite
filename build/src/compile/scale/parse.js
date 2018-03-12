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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9wYXJzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUF3RTtBQUN4RSwyQ0FBeUY7QUFDekYsbUNBQW9DO0FBQ3BDLHFDQU1xQjtBQUNyQixtQ0FBbUM7QUFDbkMsbUNBQWdDO0FBRWhDLGtDQUE0QztBQUM1QyxzQ0FBK0M7QUFDL0Msa0NBQWdGO0FBRWhGLHlDQUFnRTtBQUNoRSxtQ0FBMEM7QUFDMUMsMkNBQWdEO0FBQ2hELGlDQUF3QztBQUN4QywrQkFBaUM7QUFFakMsb0JBQTJCLEtBQVk7SUFDckMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3RCLHlCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hCLEdBQUcsQ0FBQyxDQUFlLFVBQTJDLEVBQTNDLGdEQUFBLG1EQUEyQyxFQUEzQyx5REFBMkMsRUFBM0MsSUFBMkM7UUFBekQsSUFBTSxJQUFJLG9EQUFBO1FBQ2IsK0JBQWtCLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ2pDO0lBQ0Qsd0JBQXdCO0lBQ3hCLHVCQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDekIsQ0FBQztBQVJELGdDQVFDO0FBRUQsd0JBQStCLEtBQVk7SUFDekMsRUFBRSxDQUFDLENBQUMsbUJBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEQsQ0FBQztBQUNILENBQUM7QUFORCx3Q0FNQztBQUVEOztHQUVHO0FBQ0gsNEJBQTRCLEtBQWdCO0lBQ25DLElBQUEseUJB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OlsiaW1wb3J0IHtTQ0FMRV9DSEFOTkVMUywgU2NhbGVDaGFubmVsLCBTSEFQRSwgWCwgWX0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge0ZpZWxkRGVmLCBnZXRGaWVsZERlZiwgaGFzQ29uZGl0aW9uYWxGaWVsZERlZiwgaXNGaWVsZERlZn0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtHRU9TSEFQRX0gZnJvbSAnLi4vLi4vbWFyayc7XG5pbXBvcnQge1xuICBOT05fVFlQRV9ET01BSU5fUkFOR0VfVkVHQV9TQ0FMRV9QUk9QRVJUSUVTLFxuICBTY2FsZSxcbiAgc2NhbGVDb21wYXRpYmxlLFxuICBTY2FsZVR5cGUsXG4gIHNjYWxlVHlwZVByZWNlZGVuY2UsXG59IGZyb20gJy4uLy4uL3NjYWxlJztcbmltcG9ydCB7R0VPSlNPTn0gZnJvbSAnLi4vLi4vdHlwZSc7XG5pbXBvcnQge2tleXN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ1NjYWxlfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2lzVW5pdE1vZGVsLCBNb2RlbH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtkZWZhdWx0U2NhbGVSZXNvbHZlfSBmcm9tICcuLi9yZXNvbHZlJztcbmltcG9ydCB7RXhwbGljaXQsIG1lcmdlVmFsdWVzV2l0aEV4cGxpY2l0LCB0aWVCcmVha0J5Q29tcGFyaW5nfSBmcm9tICcuLi9zcGxpdCc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQge1NjYWxlQ29tcG9uZW50LCBTY2FsZUNvbXBvbmVudEluZGV4fSBmcm9tICcuL2NvbXBvbmVudCc7XG5pbXBvcnQge3BhcnNlU2NhbGVEb21haW59IGZyb20gJy4vZG9tYWluJztcbmltcG9ydCB7cGFyc2VTY2FsZVByb3BlcnR5fSBmcm9tICcuL3Byb3BlcnRpZXMnO1xuaW1wb3J0IHtwYXJzZVNjYWxlUmFuZ2V9IGZyb20gJy4vcmFuZ2UnO1xuaW1wb3J0IHtzY2FsZVR5cGV9IGZyb20gJy4vdHlwZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVNjYWxlKG1vZGVsOiBNb2RlbCkge1xuICBwYXJzZVNjYWxlQ29yZShtb2RlbCk7XG4gIHBhcnNlU2NhbGVEb21haW4obW9kZWwpO1xuICBmb3IgKGNvbnN0IHByb3Agb2YgTk9OX1RZUEVfRE9NQUlOX1JBTkdFX1ZFR0FfU0NBTEVfUFJPUEVSVElFUykge1xuICAgIHBhcnNlU2NhbGVQcm9wZXJ0eShtb2RlbCwgcHJvcCk7XG4gIH1cbiAgLy8gcmFuZ2UgZGVwZW5kcyBvbiB6ZXJvXG4gIHBhcnNlU2NhbGVSYW5nZShtb2RlbCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVNjYWxlQ29yZShtb2RlbDogTW9kZWwpIHtcbiAgaWYgKGlzVW5pdE1vZGVsKG1vZGVsKSkge1xuICAgIG1vZGVsLmNvbXBvbmVudC5zY2FsZXMgPSBwYXJzZVVuaXRTY2FsZUNvcmUobW9kZWwpO1xuICB9IGVsc2Uge1xuICAgIG1vZGVsLmNvbXBvbmVudC5zY2FsZXMgPSBwYXJzZU5vblVuaXRTY2FsZUNvcmUobW9kZWwpO1xuICB9XG59XG5cbi8qKlxuICogUGFyc2Ugc2NhbGVzIGZvciBhbGwgY2hhbm5lbHMgb2YgYSBtb2RlbC5cbiAqL1xuZnVuY3Rpb24gcGFyc2VVbml0U2NhbGVDb3JlKG1vZGVsOiBVbml0TW9kZWwpOiBTY2FsZUNvbXBvbmVudEluZGV4IHtcbiAgY29uc3Qge2VuY29kaW5nLCBjb25maWd9ID0gbW9kZWw7XG4gIGNvbnN0IG1hcmsgPSBtb2RlbC5tYXJrKCk7XG5cbiAgcmV0dXJuIFNDQUxFX0NIQU5ORUxTLnJlZHVjZSgoc2NhbGVDb21wb25lbnRzOiBTY2FsZUNvbXBvbmVudEluZGV4LCBjaGFubmVsOiBTY2FsZUNoYW5uZWwpID0+IHtcbiAgICBsZXQgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz47XG4gICAgbGV0IHNwZWNpZmllZFNjYWxlOiBTY2FsZSB8IG51bGwgPSB1bmRlZmluZWQ7XG5cbiAgICBjb25zdCBjaGFubmVsRGVmID0gZW5jb2RpbmdbY2hhbm5lbF07XG5cbiAgICAvLyBEb24ndCBnZW5lcmF0ZSBzY2FsZSBmb3Igc2hhcGUgb2YgZ2Vvc2hhcGVcbiAgICBpZiAoXG4gICAgICBpc0ZpZWxkRGVmKGNoYW5uZWxEZWYpICYmIG1hcmsgPT09IEdFT1NIQVBFICYmXG4gICAgICBjaGFubmVsID09PSBTSEFQRSAmJiBjaGFubmVsRGVmLnR5cGUgPT09IEdFT0pTT05cbiAgICApIHtcbiAgICAgIHJldHVybiBzY2FsZUNvbXBvbmVudHM7XG4gICAgfVxuXG4gICAgaWYgKGlzRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICAgIGZpZWxkRGVmID0gY2hhbm5lbERlZjtcbiAgICAgIHNwZWNpZmllZFNjYWxlID0gY2hhbm5lbERlZi5zY2FsZTtcbiAgICB9IGVsc2UgaWYgKGhhc0NvbmRpdGlvbmFsRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICAgIGZpZWxkRGVmID0gY2hhbm5lbERlZi5jb25kaXRpb247XG4gICAgICBzcGVjaWZpZWRTY2FsZSA9IGNoYW5uZWxEZWYuY29uZGl0aW9uWydzY2FsZSddOyAvLyBXZSB1c2UgWydzY2FsZSddIHNpbmNlIHdlIGtub3cgdGhhdCBjaGFubmVsIGhlcmUgaGFzIHNjYWxlIGZvciBzdXJlXG4gICAgfSBlbHNlIGlmIChjaGFubmVsID09PSBYKSB7XG4gICAgICBmaWVsZERlZiA9IGdldEZpZWxkRGVmKGVuY29kaW5nLngyKTtcbiAgICB9IGVsc2UgaWYgKGNoYW5uZWwgPT09IFkpIHtcbiAgICAgIGZpZWxkRGVmID0gZ2V0RmllbGREZWYoZW5jb2RpbmcueTIpO1xuICAgIH1cblxuICAgIGlmIChmaWVsZERlZiAmJiBzcGVjaWZpZWRTY2FsZSAhPT0gbnVsbCAmJiBzcGVjaWZpZWRTY2FsZSAhPT0gZmFsc2UpIHtcbiAgICAgIHNwZWNpZmllZFNjYWxlID0gc3BlY2lmaWVkU2NhbGUgfHwge307XG4gICAgICBjb25zdCBzcGVjaWZpZWRTY2FsZVR5cGUgPSBzcGVjaWZpZWRTY2FsZS50eXBlO1xuICAgICAgY29uc3Qgc1R5cGUgPSBzY2FsZVR5cGUoc3BlY2lmaWVkU2NhbGUudHlwZSwgY2hhbm5lbCwgZmllbGREZWYsIG1hcmssIGNvbmZpZy5zY2FsZSk7XG4gICAgICBzY2FsZUNvbXBvbmVudHNbY2hhbm5lbF0gPSBuZXcgU2NhbGVDb21wb25lbnQoXG4gICAgICAgIG1vZGVsLnNjYWxlTmFtZShjaGFubmVsICsgJycsIHRydWUpLFxuICAgICAgICB7dmFsdWU6IHNUeXBlLCBleHBsaWNpdDogc3BlY2lmaWVkU2NhbGVUeXBlID09PSBzVHlwZX1cbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBzY2FsZUNvbXBvbmVudHM7XG4gIH0sIHt9KTtcbn1cblxuY29uc3Qgc2NhbGVUeXBlVGllQnJlYWtlciA9IHRpZUJyZWFrQnlDb21wYXJpbmcoXG4gIChzdDE6IFNjYWxlVHlwZSwgc3QyOiBTY2FsZVR5cGUpID0+IChzY2FsZVR5cGVQcmVjZWRlbmNlKHN0MSkgLSBzY2FsZVR5cGVQcmVjZWRlbmNlKHN0MikpXG4pO1xuXG5cbmZ1bmN0aW9uIHBhcnNlTm9uVW5pdFNjYWxlQ29yZShtb2RlbDogTW9kZWwpIHtcbiAgY29uc3Qgc2NhbGVDb21wb25lbnRzOiBTY2FsZUNvbXBvbmVudEluZGV4ID0gbW9kZWwuY29tcG9uZW50LnNjYWxlcyA9IHt9O1xuXG4gIGNvbnN0IHNjYWxlVHlwZVdpdGhFeHBsaWNpdEluZGV4OiB7XG4gICAgLy8gVXNpbmcgTWFwcGVkIFR5cGUgdG8gZGVjbGFyZSB0eXBlIChodHRwczovL3d3dy50eXBlc2NyaXB0bGFuZy5vcmcvZG9jcy9oYW5kYm9vay9hZHZhbmNlZC10eXBlcy5odG1sI21hcHBlZC10eXBlcylcbiAgICBbayBpbiBTY2FsZUNoYW5uZWxdPzogRXhwbGljaXQ8U2NhbGVUeXBlPlxuICB9ID0ge307XG4gIGNvbnN0IHJlc29sdmUgPSBtb2RlbC5jb21wb25lbnQucmVzb2x2ZTtcblxuICAvLyBQYXJzZSBlYWNoIGNoaWxkIHNjYWxlIGFuZCBkZXRlcm1pbmUgaWYgYSBwYXJ0aWN1bGFyIGNoYW5uZWwgY2FuIGJlIG1lcmdlZC5cbiAgZm9yIChjb25zdCBjaGlsZCBvZiBtb2RlbC5jaGlsZHJlbikge1xuICAgIHBhcnNlU2NhbGVDb3JlKGNoaWxkKTtcblxuICAgIC8vIEluc3RlYWQgb2YgYWx3YXlzIG1lcmdpbmcgcmlnaHQgYXdheSAtLSBjaGVjayBpZiBpdCBpcyBjb21wYXRpYmxlIHRvIG1lcmdlIGZpcnN0IVxuICAgIGtleXMoY2hpbGQuY29tcG9uZW50LnNjYWxlcykuZm9yRWFjaCgoY2hhbm5lbDogU2NhbGVDaGFubmVsKSA9PiB7XG4gICAgICAvLyBpZiByZXNvbHZlIGlzIHVuZGVmaW5lZCwgc2V0IGRlZmF1bHQgZmlyc3RcbiAgICAgIHJlc29sdmUuc2NhbGVbY2hhbm5lbF0gPSByZXNvbHZlLnNjYWxlW2NoYW5uZWxdIHx8IGRlZmF1bHRTY2FsZVJlc29sdmUoY2hhbm5lbCwgbW9kZWwpO1xuXG4gICAgICBpZiAocmVzb2x2ZS5zY2FsZVtjaGFubmVsXSA9PT0gJ3NoYXJlZCcpIHtcbiAgICAgICAgY29uc3QgZXhwbGljaXRTY2FsZVR5cGUgPSBzY2FsZVR5cGVXaXRoRXhwbGljaXRJbmRleFtjaGFubmVsXTtcbiAgICAgICAgY29uc3QgY2hpbGRTY2FsZVR5cGUgPSBjaGlsZC5jb21wb25lbnQuc2NhbGVzW2NoYW5uZWxdLmdldFdpdGhFeHBsaWNpdCgndHlwZScpO1xuXG4gICAgICAgIGlmIChleHBsaWNpdFNjYWxlVHlwZSkge1xuICAgICAgICAgIGlmIChzY2FsZUNvbXBhdGlibGUoZXhwbGljaXRTY2FsZVR5cGUudmFsdWUsIGNoaWxkU2NhbGVUeXBlLnZhbHVlKSkge1xuICAgICAgICAgICAgLy8gbWVyZ2Ugc2NhbGUgY29tcG9uZW50IGlmIHR5cGUgYXJlIGNvbXBhdGlibGVcbiAgICAgICAgICAgIHNjYWxlVHlwZVdpdGhFeHBsaWNpdEluZGV4W2NoYW5uZWxdID0gbWVyZ2VWYWx1ZXNXaXRoRXhwbGljaXQ8VmdTY2FsZSwgU2NhbGVUeXBlPihcbiAgICAgICAgICAgICAgZXhwbGljaXRTY2FsZVR5cGUsIGNoaWxkU2NhbGVUeXBlLCAndHlwZScsICdzY2FsZScsIHNjYWxlVHlwZVRpZUJyZWFrZXJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgdXBkYXRlIGNvbmZsaWN0aW5nIGNoYW5uZWwgdG8gYmUgaW5kZXBlbmRlbnRcbiAgICAgICAgICAgIHJlc29sdmUuc2NhbGVbY2hhbm5lbF0gPSAnaW5kZXBlbmRlbnQnO1xuICAgICAgICAgICAgLy8gUmVtb3ZlIGZyb20gdGhlIGluZGV4IHNvIHRoZXkgZG9uJ3QgZ2V0IG1lcmdlZFxuICAgICAgICAgICAgZGVsZXRlIHNjYWxlVHlwZVdpdGhFeHBsaWNpdEluZGV4W2NoYW5uZWxdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzY2FsZVR5cGVXaXRoRXhwbGljaXRJbmRleFtjaGFubmVsXSA9IGNoaWxkU2NhbGVUeXBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyBNZXJnZSBlYWNoIGNoYW5uZWwgbGlzdGVkIGluIHRoZSBpbmRleFxuICBrZXlzKHNjYWxlVHlwZVdpdGhFeHBsaWNpdEluZGV4KS5mb3JFYWNoKChjaGFubmVsOiBTY2FsZUNoYW5uZWwpID0+IHtcbiAgICAvLyBDcmVhdGUgbmV3IG1lcmdlZCBzY2FsZSBjb21wb25lbnRcbiAgICBjb25zdCBuYW1lID0gbW9kZWwuc2NhbGVOYW1lKGNoYW5uZWwsIHRydWUpO1xuICAgIGNvbnN0IHR5cGVXaXRoRXhwbGljaXQgPSBzY2FsZVR5cGVXaXRoRXhwbGljaXRJbmRleFtjaGFubmVsXTtcbiAgICBzY2FsZUNvbXBvbmVudHNbY2hhbm5lbF0gPSBuZXcgU2NhbGVDb21wb25lbnQobmFtZSwgdHlwZVdpdGhFeHBsaWNpdCk7XG5cbiAgICAvLyByZW5hbWUgZWFjaCBjaGlsZCBhbmQgbWFyayB0aGVtIGFzIG1lcmdlZFxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgbW9kZWwuY2hpbGRyZW4pIHtcbiAgICAgIGNvbnN0IGNoaWxkU2NhbGUgPSBjaGlsZC5jb21wb25lbnQuc2NhbGVzW2NoYW5uZWxdO1xuICAgICAgaWYgKGNoaWxkU2NhbGUpIHtcbiAgICAgICAgY2hpbGQucmVuYW1lU2NhbGUoY2hpbGRTY2FsZS5nZXQoJ25hbWUnKSwgbmFtZSk7XG4gICAgICAgIGNoaWxkU2NhbGUubWVyZ2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBzY2FsZUNvbXBvbmVudHM7XG59XG4iXX0=