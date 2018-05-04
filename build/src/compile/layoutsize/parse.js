import { defaultScaleConfig, hasDiscreteDomain } from '../../scale';
import { isVgRangeStep } from '../../vega.schema';
import { mergeValuesWithExplicit } from '../split';
export function parseLayerLayoutSize(model) {
    parseChildrenLayoutSize(model);
    var layoutSizeCmpt = model.component.layoutSize;
    layoutSizeCmpt.setWithExplicit('width', parseNonUnitLayoutSizeForChannel(model, 'width'));
    layoutSizeCmpt.setWithExplicit('height', parseNonUnitLayoutSizeForChannel(model, 'height'));
}
export var parseRepeatLayoutSize = parseLayerLayoutSize;
export function parseConcatLayoutSize(model) {
    parseChildrenLayoutSize(model);
    var layoutSizeCmpt = model.component.layoutSize;
    var sizeTypeToMerge = model.isVConcat ? 'width' : 'height';
    layoutSizeCmpt.setWithExplicit(sizeTypeToMerge, parseNonUnitLayoutSizeForChannel(model, sizeTypeToMerge));
}
export function parseChildrenLayoutSize(model) {
    for (var _i = 0, _a = model.children; _i < _a.length; _i++) {
        var child = _a[_i];
        child.parseLayoutSize();
    }
}
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
            mergedSize = mergeValuesWithExplicit(mergedSize, childSize, sizeType, '');
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
export function parseUnitLayoutSize(model) {
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
function defaultUnitSize(model, sizeType) {
    var channel = sizeType === 'width' ? 'x' : 'y';
    var config = model.config;
    var scaleComponent = model.getScaleComponent(channel);
    if (scaleComponent) {
        var scaleType = scaleComponent.get('type');
        var range = scaleComponent.get('range');
        if (hasDiscreteDomain(scaleType) && isVgRangeStep(range)) {
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
        return config.scale.rangeStep || defaultScaleConfig.rangeStep;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9sYXlvdXRzaXplL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxrQkFBa0IsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUNsRSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFHaEQsT0FBTyxFQUFXLHVCQUF1QixFQUFDLE1BQU0sVUFBVSxDQUFDO0FBSTNELE1BQU0sK0JBQStCLEtBQVk7SUFDL0MsdUJBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFL0IsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7SUFDbEQsY0FBYyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsZ0NBQWdDLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDMUYsY0FBYyxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsZ0NBQWdDLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDOUYsQ0FBQztBQUVELE1BQU0sQ0FBQyxJQUFNLHFCQUFxQixHQUFHLG9CQUFvQixDQUFDO0FBRTFELE1BQU0sZ0NBQWdDLEtBQWtCO0lBQ3RELHVCQUF1QixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9CLElBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO0lBRWxELElBQU0sZUFBZSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO0lBQzdELGNBQWMsQ0FBQyxlQUFlLENBQUMsZUFBZSxFQUFFLGdDQUFnQyxDQUFDLEtBQUssRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDO0FBQzVHLENBQUM7QUFFRCxNQUFNLGtDQUFrQyxLQUFZO0lBQ2xELEtBQW9CLFVB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QixLQUFnQixFQUFFLFFBQTRCO0lBQ3JFLElBQU0sT0FBTyxHQUFHLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ2pELElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7SUFDNUIsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRXhELElBQUksY0FBYyxFQUFFO1FBQ2xCLElBQU0sU0FBUyxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0MsSUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUxQyxJQUFJLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUN4RCxnRUFBZ0U7WUFDaEUsT0FBTyxZQUFZLENBQUM7U0FDckI7YUFBTTtZQUNMLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUM5QjtLQUNGO1NBQU07UUFDTCw4QkFBOEI7UUFDOUIsSUFBSSxRQUFRLEtBQUssT0FBTyxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFO1lBQ2pELDZFQUE2RTtZQUM3RSxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDO1NBQ3BDO1FBRUQsMkdBQTJHO1FBQzNHLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksa0JBQWtCLENBQUMsU0FBUyxDQUFDO0tBQy9EO0FBRUgsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZGVmYXVsdFNjYWxlQ29uZmlnLCBoYXNEaXNjcmV0ZURvbWFpbn0gZnJvbSAnLi4vLi4vc2NhbGUnO1xuaW1wb3J0IHtpc1ZnUmFuZ2VTdGVwfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge0NvbmNhdE1vZGVsfSBmcm9tICcuLi9jb25jYXQnO1xuaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtFeHBsaWNpdCwgbWVyZ2VWYWx1ZXNXaXRoRXhwbGljaXR9IGZyb20gJy4uL3NwbGl0JztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCB7TGF5b3V0U2l6ZSwgTGF5b3V0U2l6ZUluZGV4fSBmcm9tICcuL2NvbXBvbmVudCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUxheWVyTGF5b3V0U2l6ZShtb2RlbDogTW9kZWwpIHtcbiAgcGFyc2VDaGlsZHJlbkxheW91dFNpemUobW9kZWwpO1xuXG4gIGNvbnN0IGxheW91dFNpemVDbXB0ID0gbW9kZWwuY29tcG9uZW50LmxheW91dFNpemU7XG4gIGxheW91dFNpemVDbXB0LnNldFdpdGhFeHBsaWNpdCgnd2lkdGgnLCBwYXJzZU5vblVuaXRMYXlvdXRTaXplRm9yQ2hhbm5lbChtb2RlbCwgJ3dpZHRoJykpO1xuICBsYXlvdXRTaXplQ21wdC5zZXRXaXRoRXhwbGljaXQoJ2hlaWdodCcsIHBhcnNlTm9uVW5pdExheW91dFNpemVGb3JDaGFubmVsKG1vZGVsLCAnaGVpZ2h0JykpO1xufVxuXG5leHBvcnQgY29uc3QgcGFyc2VSZXBlYXRMYXlvdXRTaXplID0gcGFyc2VMYXllckxheW91dFNpemU7XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUNvbmNhdExheW91dFNpemUobW9kZWw6IENvbmNhdE1vZGVsKSB7XG4gIHBhcnNlQ2hpbGRyZW5MYXlvdXRTaXplKG1vZGVsKTtcbiAgY29uc3QgbGF5b3V0U2l6ZUNtcHQgPSBtb2RlbC5jb21wb25lbnQubGF5b3V0U2l6ZTtcblxuICBjb25zdCBzaXplVHlwZVRvTWVyZ2UgPSBtb2RlbC5pc1ZDb25jYXQgPyAnd2lkdGgnIDogJ2hlaWdodCc7XG4gIGxheW91dFNpemVDbXB0LnNldFdpdGhFeHBsaWNpdChzaXplVHlwZVRvTWVyZ2UsIHBhcnNlTm9uVW5pdExheW91dFNpemVGb3JDaGFubmVsKG1vZGVsLCBzaXplVHlwZVRvTWVyZ2UpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQ2hpbGRyZW5MYXlvdXRTaXplKG1vZGVsOiBNb2RlbCkge1xuICBmb3IgKGNvbnN0IGNoaWxkIG9mIG1vZGVsLmNoaWxkcmVuKSB7XG4gICAgY2hpbGQucGFyc2VMYXlvdXRTaXplKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VOb25Vbml0TGF5b3V0U2l6ZUZvckNoYW5uZWwobW9kZWw6IE1vZGVsLCBzaXplVHlwZTogJ3dpZHRoJyB8ICdoZWlnaHQnKTogRXhwbGljaXQ8TGF5b3V0U2l6ZT4ge1xuICBjb25zdCBjaGFubmVsID0gc2l6ZVR5cGUgPT09ICd3aWR0aCcgPyAneCcgOiAneSc7XG4gIGNvbnN0IHJlc29sdmUgPSBtb2RlbC5jb21wb25lbnQucmVzb2x2ZTtcblxuICBsZXQgbWVyZ2VkU2l6ZTogRXhwbGljaXQ8TGF5b3V0U2l6ZT47XG4gIC8vIFRyeSB0byBtZXJnZSBsYXlvdXQgc2l6ZVxuICBmb3IgKGNvbnN0IGNoaWxkIG9mIG1vZGVsLmNoaWxkcmVuKSB7XG4gICAgY29uc3QgY2hpbGRTaXplID0gY2hpbGQuY29tcG9uZW50LmxheW91dFNpemUuZ2V0V2l0aEV4cGxpY2l0KHNpemVUeXBlKTtcbiAgICBjb25zdCBzY2FsZVJlc29sdmUgPSByZXNvbHZlLnNjYWxlW2NoYW5uZWxdO1xuICAgIGlmIChzY2FsZVJlc29sdmUgPT09ICdpbmRlcGVuZGVudCcgJiYgY2hpbGRTaXplLnZhbHVlID09PSAncmFuZ2Utc3RlcCcpIHtcbiAgICAgIC8vIERvIG5vdCBtZXJnZSBpbmRlcGVuZGVudCBzY2FsZXMgd2l0aCByYW5nZS1zdGVwIGFzIHRoZWlyIHNpemUgZGVwZW5kc1xuICAgICAgLy8gb24gdGhlIHNjYWxlIGRvbWFpbnMsIHdoaWNoIGNhbiBiZSBkaWZmZXJlbnQgYmV0d2VlbiBzY2FsZXMuXG4gICAgICBtZXJnZWRTaXplID0gdW5kZWZpbmVkO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKG1lcmdlZFNpemUpIHtcbiAgICAgIGlmIChzY2FsZVJlc29sdmUgPT09ICdpbmRlcGVuZGVudCcgJiYgbWVyZ2VkU2l6ZS52YWx1ZSAhPT0gY2hpbGRTaXplLnZhbHVlKSB7XG4gICAgICAgIC8vIEZvciBpbmRlcGVuZGVudCBzY2FsZSwgb25seSBtZXJnZSBpZiBhbGwgdGhlIHNpemVzIGFyZSB0aGUgc2FtZS5cbiAgICAgICAgLy8gSWYgdGhlIHZhbHVlcyBhcmUgZGlmZmVyZW50LCBhYmFuZG9uIHRoZSBtZXJnZSFcbiAgICAgICAgbWVyZ2VkU2l6ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBtZXJnZWRTaXplID0gbWVyZ2VWYWx1ZXNXaXRoRXhwbGljaXQ8TGF5b3V0U2l6ZUluZGV4LCBMYXlvdXRTaXplPihcbiAgICAgICAgbWVyZ2VkU2l6ZSwgY2hpbGRTaXplLCBzaXplVHlwZSwgJydcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1lcmdlZFNpemUgPSBjaGlsZFNpemU7XG4gICAgfVxuICB9XG5cbiAgaWYgKG1lcmdlZFNpemUpIHtcbiAgICAvLyBJZiBtZXJnZWQsIHJlbmFtZSBzaXplIGFuZCBzZXQgc2l6ZSBvZiBhbGwgY2hpbGRyZW4uXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBtb2RlbC5jaGlsZHJlbikge1xuICAgICAgbW9kZWwucmVuYW1lTGF5b3V0U2l6ZShjaGlsZC5nZXROYW1lKHNpemVUeXBlKSwgbW9kZWwuZ2V0TmFtZShzaXplVHlwZSkpO1xuICAgICAgY2hpbGQuY29tcG9uZW50LmxheW91dFNpemUuc2V0KHNpemVUeXBlLCAnbWVyZ2VkJywgZmFsc2UpO1xuICAgIH1cbiAgICByZXR1cm4gbWVyZ2VkU2l6ZTtcbiAgfSBlbHNlIHtcbiAgICAvLyBPdGhlcndpc2UsIHRoZXJlIGlzIG5vIG1lcmdlZCBzaXplLlxuICAgIHJldHVybiB7XG4gICAgICBleHBsaWNpdDogZmFsc2UsXG4gICAgICB2YWx1ZTogdW5kZWZpbmVkXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VVbml0TGF5b3V0U2l6ZShtb2RlbDogVW5pdE1vZGVsKSB7XG4gIGNvbnN0IGxheW91dFNpemVDb21wb25lbnQgPSBtb2RlbC5jb21wb25lbnQubGF5b3V0U2l6ZTtcbiAgaWYgKCFsYXlvdXRTaXplQ29tcG9uZW50LmV4cGxpY2l0LndpZHRoKSB7XG4gICAgY29uc3Qgd2lkdGggPSBkZWZhdWx0VW5pdFNpemUobW9kZWwsICd3aWR0aCcpO1xuICAgIGxheW91dFNpemVDb21wb25lbnQuc2V0KCd3aWR0aCcsIHdpZHRoLCBmYWxzZSk7XG4gIH1cblxuICBpZiAoIWxheW91dFNpemVDb21wb25lbnQuZXhwbGljaXQuaGVpZ2h0KSB7XG4gICAgY29uc3QgaGVpZ2h0ID0gZGVmYXVsdFVuaXRTaXplKG1vZGVsLCAnaGVpZ2h0Jyk7XG4gICAgbGF5b3V0U2l6ZUNvbXBvbmVudC5zZXQoJ2hlaWdodCcsIGhlaWdodCwgZmFsc2UpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRVbml0U2l6ZShtb2RlbDogVW5pdE1vZGVsLCBzaXplVHlwZTogJ3dpZHRoJyB8ICdoZWlnaHQnKTogTGF5b3V0U2l6ZSB7XG4gIGNvbnN0IGNoYW5uZWwgPSBzaXplVHlwZSA9PT0gJ3dpZHRoJyA/ICd4JyA6ICd5JztcbiAgY29uc3QgY29uZmlnID0gbW9kZWwuY29uZmlnO1xuICBjb25zdCBzY2FsZUNvbXBvbmVudCA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpO1xuXG4gIGlmIChzY2FsZUNvbXBvbmVudCkge1xuICAgIGNvbnN0IHNjYWxlVHlwZSA9IHNjYWxlQ29tcG9uZW50LmdldCgndHlwZScpO1xuICAgIGNvbnN0IHJhbmdlID0gc2NhbGVDb21wb25lbnQuZ2V0KCdyYW5nZScpO1xuXG4gICAgaWYgKGhhc0Rpc2NyZXRlRG9tYWluKHNjYWxlVHlwZSkgJiYgaXNWZ1JhbmdlU3RlcChyYW5nZSkpIHtcbiAgICAgIC8vIEZvciBkaXNjcmV0ZSBkb21haW4gd2l0aCByYW5nZS5zdGVwLCB1c2UgZHluYW1pYyB3aWR0aC9oZWlnaHRcbiAgICAgIHJldHVybiAncmFuZ2Utc3RlcCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjb25maWcudmlld1tzaXplVHlwZV07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIE5vIHNjYWxlIC0gc2V0IGRlZmF1bHQgc2l6ZVxuICAgIGlmIChzaXplVHlwZSA9PT0gJ3dpZHRoJyAmJiBtb2RlbC5tYXJrID09PSAndGV4dCcpIHtcbiAgICAgIC8vIHdpZHRoIGZvciB0ZXh0IG1hcmsgd2l0aG91dCB4LWZpZWxkIGlzIGEgYml0IHdpZGVyIHRoYW4gdHlwaWNhbCByYW5nZSBzdGVwXG4gICAgICByZXR1cm4gY29uZmlnLnNjYWxlLnRleHRYUmFuZ2VTdGVwO1xuICAgIH1cblxuICAgIC8vIFNldCB3aWR0aC9oZWlnaHQgZXF1YWwgdG8gcmFuZ2VTdGVwIGNvbmZpZyBvciBpZiByYW5nZVN0ZXAgaXMgbnVsbCwgdXNlIHZhbHVlIGZyb20gZGVmYXVsdCBzY2FsZSBjb25maWcuXG4gICAgcmV0dXJuIGNvbmZpZy5zY2FsZS5yYW5nZVN0ZXAgfHwgZGVmYXVsdFNjYWxlQ29uZmlnLnJhbmdlU3RlcDtcbiAgfVxuXG59XG4iXX0=