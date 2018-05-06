"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scale_1 = require("../../scale");
var vega_schema_1 = require("../../vega.schema");
var split_1 = require("../split");
function parseLayerLayoutSize(model) {
    parseChildrenLayoutSize(model);
    var layoutSizeCmpt = model.component.layoutSize;
    layoutSizeCmpt.setWithExplicit('width', parseNonUnitLayoutSizeForChannel(model, 'width'));
    layoutSizeCmpt.setWithExplicit('height', parseNonUnitLayoutSizeForChannel(model, 'height'));
}
exports.parseLayerLayoutSize = parseLayerLayoutSize;
exports.parseRepeatLayoutSize = parseLayerLayoutSize;
function parseConcatLayoutSize(model) {
    parseChildrenLayoutSize(model);
    var layoutSizeCmpt = model.component.layoutSize;
    var sizeTypeToMerge = model.isVConcat ? 'width' : 'height';
    layoutSizeCmpt.setWithExplicit(sizeTypeToMerge, parseNonUnitLayoutSizeForChannel(model, sizeTypeToMerge));
}
exports.parseConcatLayoutSize = parseConcatLayoutSize;
function parseChildrenLayoutSize(model) {
    for (var _i = 0, _a = model.children; _i < _a.length; _i++) {
        var child = _a[_i];
        child.parseLayoutSize();
    }
}
exports.parseChildrenLayoutSize = parseChildrenLayoutSize;
function parseNonUnitLayoutSizeForChannel(model, sizeType) {
    var channel = sizeType === 'width' ? 'x' : 'y';
    var resolve = model.component.resolve;
    var mergedSize;
    // Try to merge layout size
    for (var _i = 0, _a = model.children; _i < _a.length; _i++) {
        var child = _a[_i];
        var childSize = child.component.layoutSize.getWithExplicit(sizeType);
        var scaleResolve = resolve.scale[channel];
        if (scaleResolve === 'independent' && childSize.value === 'range-step') {
            // Do not merge independent scales with range-step as their size depends
            // on the scale domains, which can be different between scales.
            mergedSize = undefined;
            break;
        }
        if (mergedSize) {
            if (scaleResolve === 'independent' && mergedSize.value !== childSize.value) {
                // For independent scale, only merge if all the sizes are the same.
                // If the values are different, abandon the merge!
                mergedSize = undefined;
                break;
            }
            mergedSize = split_1.mergeValuesWithExplicit(mergedSize, childSize, sizeType, '');
        }
        else {
            mergedSize = childSize;
        }
    }
    if (mergedSize) {
        // If merged, rename size and set size of all children.
        for (var _b = 0, _c = model.children; _b < _c.length; _b++) {
            var child = _c[_b];
            model.renameLayoutSize(child.getName(sizeType), model.getName(sizeType));
            child.component.layoutSize.set(sizeType, 'merged', false);
        }
        return mergedSize;
    }
    else {
        // Otherwise, there is no merged size.
        return {
            explicit: false,
            value: undefined
        };
    }
}
function parseUnitLayoutSize(model) {
    var layoutSizeComponent = model.component.layoutSize;
    if (!layoutSizeComponent.explicit.width) {
        var width = defaultUnitSize(model, 'width');
        layoutSizeComponent.set('width', width, false);
    }
    if (!layoutSizeComponent.explicit.height) {
        var height = defaultUnitSize(model, 'height');
        layoutSizeComponent.set('height', height, false);
    }
}
exports.parseUnitLayoutSize = parseUnitLayoutSize;
function defaultUnitSize(model, sizeType) {
    var channel = sizeType === 'width' ? 'x' : 'y';
    var config = model.config;
    var scaleComponent = model.getScaleComponent(channel);
    if (scaleComponent) {
        var scaleType = scaleComponent.get('type');
        var range = scaleComponent.get('range');
        if (scale_1.hasDiscreteDomain(scaleType) && vega_schema_1.isVgRangeStep(range)) {
            // For discrete domain with range.step, use dynamic width/height
            return 'range-step';
        }
        else {
            return config.view[sizeType];
        }
    }
    else {
        // No scale - set default size
        if (sizeType === 'width' && model.mark === 'text') {
            // width for text mark without x-field is a bit wider than typical range step
            return config.scale.textXRangeStep;
        }
        // Set width/height equal to rangeStep config or if rangeStep is null, use value from default scale config.
        return config.scale.rangeStep || scale_1.defaultScaleConfig.rangeStep;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9sYXlvdXRzaXplL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQWtFO0FBQ2xFLGlEQUFnRDtBQUdoRCxrQ0FBMkQ7QUFJM0QsOEJBQXFDLEtBQVk7SUFDL0MsdUJBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFL0IsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7SUFDbEQsY0FBYyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsZ0NBQWdDLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDMUYsY0FBYyxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsZ0NBQWdDLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDOUYsQ0FBQztBQU5ELG9EQU1DO0FBRVksUUFBQSxxQkFBcUIsR0FBRyxvQkFBb0IsQ0FBQztBQUUxRCwrQkFBc0MsS0FBa0I7SUFDdEQsdUJBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0IsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7SUFFbEQsSUFBTSxlQUFlLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7SUFDN0QsY0FBYyxDQUFDLGVBQWUsQ0FBQyxlQUFlLEVBQUUsZ0NBQWdDLENBQUMsS0FBSyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUM7QUFDNUcsQ0FBQztBQU5ELHNEQU1DO0FBRUQsaUNBQXdDLEtBQVk7SUFDbEQsS0FBb0IsVUFBYyxFQUFkLEtBQUEsS0FBSyxDQUFDLFFBQVEsRUFBZCxjQUFjLEVBQWQsSUFBYztRQUE3QixJQUFNLEtBQUssU0FBQTtRQUNkLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztLQUN6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QUFDLEdBQUcsQ0FBQztJQUNqRCxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQzVCLElBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUV4RCxJQUFJLGNBQWMsRUFBRTtRQUNsQixJQUFNLFNBQVMsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdDLElBQU0sS0FBSyxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFMUMsSUFBSSx5QkFBaUIsQ0FBQyxTQUFTLENBQUMsSUFBSSwyQkFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3hELGdFQUFnRTtZQUNoRSxPQUFPLFlBQVksQ0FBQztTQUNyQjthQUFNO1lBQ0wsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQzlCO0tBQ0Y7U0FBTTtRQUNMLDhCQUE4QjtRQUM5QixJQUFJLFFBQVEsS0FBSyxPQUFPLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7WUFDakQsNkVBQTZFO1lBQzdFLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUM7U0FDcEM7UUFFRCwyR0FBMkc7UUFDM0csT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsSUFBSSwwQkFBa0IsQ0FBQyxTQUFTLENBQUM7S0FDL0Q7QUFFSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtkZWZhdWx0U2NhbGVDb25maWcsIGhhc0Rpc2NyZXRlRG9tYWlufSBmcm9tICcuLi8uLi9zY2FsZSc7XG5pbXBvcnQge2lzVmdSYW5nZVN0ZXB9IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7Q29uY2F0TW9kZWx9IGZyb20gJy4uL2NvbmNhdCc7XG5pbXBvcnQge01vZGVsfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge0V4cGxpY2l0LCBtZXJnZVZhbHVlc1dpdGhFeHBsaWNpdH0gZnJvbSAnLi4vc3BsaXQnO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uL3VuaXQnO1xuaW1wb3J0IHtMYXlvdXRTaXplLCBMYXlvdXRTaXplSW5kZXh9IGZyb20gJy4vY29tcG9uZW50JztcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTGF5ZXJMYXlvdXRTaXplKG1vZGVsOiBNb2RlbCkge1xuICBwYXJzZUNoaWxkcmVuTGF5b3V0U2l6ZShtb2RlbCk7XG5cbiAgY29uc3QgbGF5b3V0U2l6ZUNtcHQgPSBtb2RlbC5jb21wb25lbnQubGF5b3V0U2l6ZTtcbiAgbGF5b3V0U2l6ZUNtcHQuc2V0V2l0aEV4cGxpY2l0KCd3aWR0aCcsIHBhcnNlTm9uVW5pdExheW91dFNpemVGb3JDaGFubmVsKG1vZGVsLCAnd2lkdGgnKSk7XG4gIGxheW91dFNpemVDbXB0LnNldFdpdGhFeHBsaWNpdCgnaGVpZ2h0JywgcGFyc2VOb25Vbml0TGF5b3V0U2l6ZUZvckNoYW5uZWwobW9kZWwsICdoZWlnaHQnKSk7XG59XG5cbmV4cG9ydCBjb25zdCBwYXJzZVJlcGVhdExheW91dFNpemUgPSBwYXJzZUxheWVyTGF5b3V0U2l6ZTtcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQ29uY2F0TGF5b3V0U2l6ZShtb2RlbDogQ29uY2F0TW9kZWwpIHtcbiAgcGFyc2VDaGlsZHJlbkxheW91dFNpemUobW9kZWwpO1xuICBjb25zdCBsYXlvdXRTaXplQ21wdCA9IG1vZGVsLmNvbXBvbmVudC5sYXlvdXRTaXplO1xuXG4gIGNvbnN0IHNpemVUeXBlVG9NZXJnZSA9IG1vZGVsLmlzVkNvbmNhdCA/ICd3aWR0aCcgOiAnaGVpZ2h0JztcbiAgbGF5b3V0U2l6ZUNtcHQuc2V0V2l0aEV4cGxpY2l0KHNpemVUeXBlVG9NZXJnZSwgcGFyc2VOb25Vbml0TGF5b3V0U2l6ZUZvckNoYW5uZWwobW9kZWwsIHNpemVUeXBlVG9NZXJnZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VDaGlsZHJlbkxheW91dFNpemUobW9kZWw6IE1vZGVsKSB7XG4gIGZvciAoY29uc3QgY2hpbGQgb2YgbW9kZWwuY2hpbGRyZW4pIHtcbiAgICBjaGlsZC5wYXJzZUxheW91dFNpemUoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZU5vblVuaXRMYXlvdXRTaXplRm9yQ2hhbm5lbChtb2RlbDogTW9kZWwsIHNpemVUeXBlOiAnd2lkdGgnIHwgJ2hlaWdodCcpOiBFeHBsaWNpdDxMYXlvdXRTaXplPiB7XG4gIGNvbnN0IGNoYW5uZWwgPSBzaXplVHlwZSA9PT0gJ3dpZHRoJyA/ICd4JyA6ICd5JztcbiAgY29uc3QgcmVzb2x2ZSA9IG1vZGVsLmNvbXBvbmVudC5yZXNvbHZlO1xuXG4gIGxldCBtZXJnZWRTaXplOiBFeHBsaWNpdDxMYXlvdXRTaXplPjtcbiAgLy8gVHJ5IHRvIG1lcmdlIGxheW91dCBzaXplXG4gIGZvciAoY29uc3QgY2hpbGQgb2YgbW9kZWwuY2hpbGRyZW4pIHtcbiAgICBjb25zdCBjaGlsZFNpemUgPSBjaGlsZC5jb21wb25lbnQubGF5b3V0U2l6ZS5nZXRXaXRoRXhwbGljaXQoc2l6ZVR5cGUpO1xuICAgIGNvbnN0IHNjYWxlUmVzb2x2ZSA9IHJlc29sdmUuc2NhbGVbY2hhbm5lbF07XG4gICAgaWYgKHNjYWxlUmVzb2x2ZSA9PT0gJ2luZGVwZW5kZW50JyAmJiBjaGlsZFNpemUudmFsdWUgPT09ICdyYW5nZS1zdGVwJykge1xuICAgICAgLy8gRG8gbm90IG1lcmdlIGluZGVwZW5kZW50IHNjYWxlcyB3aXRoIHJhbmdlLXN0ZXAgYXMgdGhlaXIgc2l6ZSBkZXBlbmRzXG4gICAgICAvLyBvbiB0aGUgc2NhbGUgZG9tYWlucywgd2hpY2ggY2FuIGJlIGRpZmZlcmVudCBiZXR3ZWVuIHNjYWxlcy5cbiAgICAgIG1lcmdlZFNpemUgPSB1bmRlZmluZWQ7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAobWVyZ2VkU2l6ZSkge1xuICAgICAgaWYgKHNjYWxlUmVzb2x2ZSA9PT0gJ2luZGVwZW5kZW50JyAmJiBtZXJnZWRTaXplLnZhbHVlICE9PSBjaGlsZFNpemUudmFsdWUpIHtcbiAgICAgICAgLy8gRm9yIGluZGVwZW5kZW50IHNjYWxlLCBvbmx5IG1lcmdlIGlmIGFsbCB0aGUgc2l6ZXMgYXJlIHRoZSBzYW1lLlxuICAgICAgICAvLyBJZiB0aGUgdmFsdWVzIGFyZSBkaWZmZXJlbnQsIGFiYW5kb24gdGhlIG1lcmdlIVxuICAgICAgICBtZXJnZWRTaXplID0gdW5kZWZpbmVkO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIG1lcmdlZFNpemUgPSBtZXJnZVZhbHVlc1dpdGhFeHBsaWNpdDxMYXlvdXRTaXplSW5kZXgsIExheW91dFNpemU+KFxuICAgICAgICBtZXJnZWRTaXplLCBjaGlsZFNpemUsIHNpemVUeXBlLCAnJ1xuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWVyZ2VkU2l6ZSA9IGNoaWxkU2l6ZTtcbiAgICB9XG4gIH1cblxuICBpZiAobWVyZ2VkU2l6ZSkge1xuICAgIC8vIElmIG1lcmdlZCwgcmVuYW1lIHNpemUgYW5kIHNldCBzaXplIG9mIGFsbCBjaGlsZHJlbi5cbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIG1vZGVsLmNoaWxkcmVuKSB7XG4gICAgICBtb2RlbC5yZW5hbWVMYXlvdXRTaXplKGNoaWxkLmdldE5hbWUoc2l6ZVR5cGUpLCBtb2RlbC5nZXROYW1lKHNpemVUeXBlKSk7XG4gICAgICBjaGlsZC5jb21wb25lbnQubGF5b3V0U2l6ZS5zZXQoc2l6ZVR5cGUsICdtZXJnZWQnLCBmYWxzZSk7XG4gICAgfVxuICAgIHJldHVybiBtZXJnZWRTaXplO1xuICB9IGVsc2Uge1xuICAgIC8vIE90aGVyd2lzZSwgdGhlcmUgaXMgbm8gbWVyZ2VkIHNpemUuXG4gICAgcmV0dXJuIHtcbiAgICAgIGV4cGxpY2l0OiBmYWxzZSxcbiAgICAgIHZhbHVlOiB1bmRlZmluZWRcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVVuaXRMYXlvdXRTaXplKG1vZGVsOiBVbml0TW9kZWwpIHtcbiAgY29uc3QgbGF5b3V0U2l6ZUNvbXBvbmVudCA9IG1vZGVsLmNvbXBvbmVudC5sYXlvdXRTaXplO1xuICBpZiAoIWxheW91dFNpemVDb21wb25lbnQuZXhwbGljaXQud2lkdGgpIHtcbiAgICBjb25zdCB3aWR0aCA9IGRlZmF1bHRVbml0U2l6ZShtb2RlbCwgJ3dpZHRoJyk7XG4gICAgbGF5b3V0U2l6ZUNvbXBvbmVudC5zZXQoJ3dpZHRoJywgd2lkdGgsIGZhbHNlKTtcbiAgfVxuXG4gIGlmICghbGF5b3V0U2l6ZUNvbXBvbmVudC5leHBsaWNpdC5oZWlnaHQpIHtcbiAgICBjb25zdCBoZWlnaHQgPSBkZWZhdWx0VW5pdFNpemUobW9kZWwsICdoZWlnaHQnKTtcbiAgICBsYXlvdXRTaXplQ29tcG9uZW50LnNldCgnaGVpZ2h0JywgaGVpZ2h0LCBmYWxzZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGVmYXVsdFVuaXRTaXplKG1vZGVsOiBVbml0TW9kZWwsIHNpemVUeXBlOiAnd2lkdGgnIHwgJ2hlaWdodCcpOiBMYXlvdXRTaXplIHtcbiAgY29uc3QgY2hhbm5lbCA9IHNpemVUeXBlID09PSAnd2lkdGgnID8gJ3gnIDogJ3knO1xuICBjb25zdCBjb25maWcgPSBtb2RlbC5jb25maWc7XG4gIGNvbnN0IHNjYWxlQ29tcG9uZW50ID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCk7XG5cbiAgaWYgKHNjYWxlQ29tcG9uZW50KSB7XG4gICAgY29uc3Qgc2NhbGVUeXBlID0gc2NhbGVDb21wb25lbnQuZ2V0KCd0eXBlJyk7XG4gICAgY29uc3QgcmFuZ2UgPSBzY2FsZUNvbXBvbmVudC5nZXQoJ3JhbmdlJyk7XG5cbiAgICBpZiAoaGFzRGlzY3JldGVEb21haW4oc2NhbGVUeXBlKSAmJiBpc1ZnUmFuZ2VTdGVwKHJhbmdlKSkge1xuICAgICAgLy8gRm9yIGRpc2NyZXRlIGRvbWFpbiB3aXRoIHJhbmdlLnN0ZXAsIHVzZSBkeW5hbWljIHdpZHRoL2hlaWdodFxuICAgICAgcmV0dXJuICdyYW5nZS1zdGVwJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNvbmZpZy52aWV3W3NpemVUeXBlXTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gTm8gc2NhbGUgLSBzZXQgZGVmYXVsdCBzaXplXG4gICAgaWYgKHNpemVUeXBlID09PSAnd2lkdGgnICYmIG1vZGVsLm1hcmsgPT09ICd0ZXh0Jykge1xuICAgICAgLy8gd2lkdGggZm9yIHRleHQgbWFyayB3aXRob3V0IHgtZmllbGQgaXMgYSBiaXQgd2lkZXIgdGhhbiB0eXBpY2FsIHJhbmdlIHN0ZXBcbiAgICAgIHJldHVybiBjb25maWcuc2NhbGUudGV4dFhSYW5nZVN0ZXA7XG4gICAgfVxuXG4gICAgLy8gU2V0IHdpZHRoL2hlaWdodCBlcXVhbCB0byByYW5nZVN0ZXAgY29uZmlnIG9yIGlmIHJhbmdlU3RlcCBpcyBudWxsLCB1c2UgdmFsdWUgZnJvbSBkZWZhdWx0IHNjYWxlIGNvbmZpZy5cbiAgICByZXR1cm4gY29uZmlnLnNjYWxlLnJhbmdlU3RlcCB8fCBkZWZhdWx0U2NhbGVDb25maWcucmFuZ2VTdGVwO1xuICB9XG5cbn1cbiJdfQ==