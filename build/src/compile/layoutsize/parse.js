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
        if (sizeType === 'width' && model.mark() === 'text') {
            // width for text mark without x-field is a bit wider than typical range step
            return config.scale.textXRangeStep;
        }
        // Set width/height equal to rangeStep config or if rangeStep is null, use value from default scale config.
        return config.scale.rangeStep || scale_1.defaultScaleConfig.rangeStep;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9sYXlvdXRzaXplL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQWtFO0FBQ2xFLGlEQUFnRDtBQUdoRCxrQ0FBMkQ7QUFJM0QsOEJBQXFDLEtBQVk7SUFDL0MsdUJBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFL0IsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7SUFDbEQsY0FBYyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsZ0NBQWdDLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDMUYsY0FBYyxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsZ0NBQWdDLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDOUYsQ0FBQztBQU5ELG9EQU1DO0FBRVksUUFBQSxxQkFBcUIsR0FBRyxvQkFBb0IsQ0FBQztBQUUxRCwrQkFBc0MsS0FBa0I7SUFDdEQsdUJBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0IsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7SUFFbEQsSUFBTSxlQUFlLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7SUFDN0QsY0FBYyxDQUFDLGVBQWUsQ0FBQyxlQUFlLEVBQUUsZ0NBQWdDLENBQUMsS0FBSyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUM7QUFDNUcsQ0FBQztBQU5ELHNEQU1DO0FBRUQsaUNBQXdDLEtBQVk7SUFDbEQsR0FBRyxDQUFDLENBQWdCLFVBQWMsRUFBZCxLQUFBLEtBQUssQ0FBQyxRQUFRLEVBQWQsY0FBYyxFQUFkLElBQWM7UUFBN0IsSUFBTSxLQUFLLFNBQUE7UUFDZCxLQUFLLENBQUMsZUFBZSxFQUFF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QWMsQ0FBQztRQUNyQyxDQUFDO1FBRUQsMkdBQTJHO1FBQzNHLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsSUFBSSwwQkFBa0IsQ0FBQyxTQUFTLENBQUM7SUFDaEUsQ0FBQztBQUVILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2RlZmF1bHRTY2FsZUNvbmZpZywgaGFzRGlzY3JldGVEb21haW59IGZyb20gJy4uLy4uL3NjYWxlJztcbmltcG9ydCB7aXNWZ1JhbmdlU3RlcH0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtDb25jYXRNb2RlbH0gZnJvbSAnLi4vY29uY2F0JztcbmltcG9ydCB7TW9kZWx9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7RXhwbGljaXQsIG1lcmdlVmFsdWVzV2l0aEV4cGxpY2l0fSBmcm9tICcuLi9zcGxpdCc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQge0xheW91dFNpemUsIExheW91dFNpemVJbmRleH0gZnJvbSAnLi9jb21wb25lbnQnO1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VMYXllckxheW91dFNpemUobW9kZWw6IE1vZGVsKSB7XG4gIHBhcnNlQ2hpbGRyZW5MYXlvdXRTaXplKG1vZGVsKTtcblxuICBjb25zdCBsYXlvdXRTaXplQ21wdCA9IG1vZGVsLmNvbXBvbmVudC5sYXlvdXRTaXplO1xuICBsYXlvdXRTaXplQ21wdC5zZXRXaXRoRXhwbGljaXQoJ3dpZHRoJywgcGFyc2VOb25Vbml0TGF5b3V0U2l6ZUZvckNoYW5uZWwobW9kZWwsICd3aWR0aCcpKTtcbiAgbGF5b3V0U2l6ZUNtcHQuc2V0V2l0aEV4cGxpY2l0KCdoZWlnaHQnLCBwYXJzZU5vblVuaXRMYXlvdXRTaXplRm9yQ2hhbm5lbChtb2RlbCwgJ2hlaWdodCcpKTtcbn1cblxuZXhwb3J0IGNvbnN0IHBhcnNlUmVwZWF0TGF5b3V0U2l6ZSA9IHBhcnNlTGF5ZXJMYXlvdXRTaXplO1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VDb25jYXRMYXlvdXRTaXplKG1vZGVsOiBDb25jYXRNb2RlbCkge1xuICBwYXJzZUNoaWxkcmVuTGF5b3V0U2l6ZShtb2RlbCk7XG4gIGNvbnN0IGxheW91dFNpemVDbXB0ID0gbW9kZWwuY29tcG9uZW50LmxheW91dFNpemU7XG5cbiAgY29uc3Qgc2l6ZVR5cGVUb01lcmdlID0gbW9kZWwuaXNWQ29uY2F0ID8gJ3dpZHRoJyA6ICdoZWlnaHQnO1xuICBsYXlvdXRTaXplQ21wdC5zZXRXaXRoRXhwbGljaXQoc2l6ZVR5cGVUb01lcmdlLCBwYXJzZU5vblVuaXRMYXlvdXRTaXplRm9yQ2hhbm5lbChtb2RlbCwgc2l6ZVR5cGVUb01lcmdlKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUNoaWxkcmVuTGF5b3V0U2l6ZShtb2RlbDogTW9kZWwpIHtcbiAgZm9yIChjb25zdCBjaGlsZCBvZiBtb2RlbC5jaGlsZHJlbikge1xuICAgIGNoaWxkLnBhcnNlTGF5b3V0U2l6ZSgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHBhcnNlTm9uVW5pdExheW91dFNpemVGb3JDaGFubmVsKG1vZGVsOiBNb2RlbCwgc2l6ZVR5cGU6ICd3aWR0aCcgfCAnaGVpZ2h0Jyk6IEV4cGxpY2l0PExheW91dFNpemU+IHtcbiAgY29uc3QgY2hhbm5lbCA9IHNpemVUeXBlID09PSAnd2lkdGgnID8gJ3gnIDogJ3knO1xuICBjb25zdCByZXNvbHZlID0gbW9kZWwuY29tcG9uZW50LnJlc29sdmU7XG5cbiAgbGV0IG1lcmdlZFNpemU6IEV4cGxpY2l0PExheW91dFNpemU+O1xuICAvLyBUcnkgdG8gbWVyZ2UgbGF5b3V0IHNpemVcbiAgZm9yIChjb25zdCBjaGlsZCBvZiBtb2RlbC5jaGlsZHJlbikge1xuICAgIGNvbnN0IGNoaWxkU2l6ZSA9IGNoaWxkLmNvbXBvbmVudC5sYXlvdXRTaXplLmdldFdpdGhFeHBsaWNpdChzaXplVHlwZSk7XG4gICAgY29uc3Qgc2NhbGVSZXNvbHZlID0gcmVzb2x2ZS5zY2FsZVtjaGFubmVsXTtcbiAgICBpZiAoc2NhbGVSZXNvbHZlID09PSAnaW5kZXBlbmRlbnQnICYmIGNoaWxkU2l6ZS52YWx1ZSA9PT0gJ3JhbmdlLXN0ZXAnKSB7XG4gICAgICAvLyBEbyBub3QgbWVyZ2UgaW5kZXBlbmRlbnQgc2NhbGVzIHdpdGggcmFuZ2Utc3RlcCBhcyB0aGVpciBzaXplIGRlcGVuZHNcbiAgICAgIC8vIG9uIHRoZSBzY2FsZSBkb21haW5zLCB3aGljaCBjYW4gYmUgZGlmZmVyZW50IGJldHdlZW4gc2NhbGVzLlxuICAgICAgbWVyZ2VkU2l6ZSA9IHVuZGVmaW5lZDtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChtZXJnZWRTaXplKSB7XG4gICAgICBpZiAoc2NhbGVSZXNvbHZlID09PSAnaW5kZXBlbmRlbnQnICYmIG1lcmdlZFNpemUudmFsdWUgIT09IGNoaWxkU2l6ZS52YWx1ZSkge1xuICAgICAgICAvLyBGb3IgaW5kZXBlbmRlbnQgc2NhbGUsIG9ubHkgbWVyZ2UgaWYgYWxsIHRoZSBzaXplcyBhcmUgdGhlIHNhbWUuXG4gICAgICAgIC8vIElmIHRoZSB2YWx1ZXMgYXJlIGRpZmZlcmVudCwgYWJhbmRvbiB0aGUgbWVyZ2UhXG4gICAgICAgIG1lcmdlZFNpemUgPSB1bmRlZmluZWQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgbWVyZ2VkU2l6ZSA9IG1lcmdlVmFsdWVzV2l0aEV4cGxpY2l0PExheW91dFNpemVJbmRleCwgTGF5b3V0U2l6ZT4oXG4gICAgICAgIG1lcmdlZFNpemUsIGNoaWxkU2l6ZSwgc2l6ZVR5cGUsICcnXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBtZXJnZWRTaXplID0gY2hpbGRTaXplO1xuICAgIH1cbiAgfVxuXG4gIGlmIChtZXJnZWRTaXplKSB7XG4gICAgLy8gSWYgbWVyZ2VkLCByZW5hbWUgc2l6ZSBhbmQgc2V0IHNpemUgb2YgYWxsIGNoaWxkcmVuLlxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgbW9kZWwuY2hpbGRyZW4pIHtcbiAgICAgIG1vZGVsLnJlbmFtZUxheW91dFNpemUoY2hpbGQuZ2V0TmFtZShzaXplVHlwZSksIG1vZGVsLmdldE5hbWUoc2l6ZVR5cGUpKTtcbiAgICAgIGNoaWxkLmNvbXBvbmVudC5sYXlvdXRTaXplLnNldChzaXplVHlwZSwgJ21lcmdlZCcsIGZhbHNlKTtcbiAgICB9XG4gICAgcmV0dXJuIG1lcmdlZFNpemU7XG4gIH0gZWxzZSB7XG4gICAgLy8gT3RoZXJ3aXNlLCB0aGVyZSBpcyBubyBtZXJnZWQgc2l6ZS5cbiAgICByZXR1cm4ge1xuICAgICAgZXhwbGljaXQ6IGZhbHNlLFxuICAgICAgdmFsdWU6IHVuZGVmaW5lZFxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVW5pdExheW91dFNpemUobW9kZWw6IFVuaXRNb2RlbCkge1xuICBjb25zdCBsYXlvdXRTaXplQ29tcG9uZW50ID0gbW9kZWwuY29tcG9uZW50LmxheW91dFNpemU7XG4gIGlmICghbGF5b3V0U2l6ZUNvbXBvbmVudC5leHBsaWNpdC53aWR0aCkge1xuICAgIGNvbnN0IHdpZHRoID0gZGVmYXVsdFVuaXRTaXplKG1vZGVsLCAnd2lkdGgnKTtcbiAgICBsYXlvdXRTaXplQ29tcG9uZW50LnNldCgnd2lkdGgnLCB3aWR0aCwgZmFsc2UpO1xuICB9XG5cbiAgaWYgKCFsYXlvdXRTaXplQ29tcG9uZW50LmV4cGxpY2l0LmhlaWdodCkge1xuICAgIGNvbnN0IGhlaWdodCA9IGRlZmF1bHRVbml0U2l6ZShtb2RlbCwgJ2hlaWdodCcpO1xuICAgIGxheW91dFNpemVDb21wb25lbnQuc2V0KCdoZWlnaHQnLCBoZWlnaHQsIGZhbHNlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBkZWZhdWx0VW5pdFNpemUobW9kZWw6IFVuaXRNb2RlbCwgc2l6ZVR5cGU6ICd3aWR0aCcgfCAnaGVpZ2h0Jyk6IExheW91dFNpemUge1xuICBjb25zdCBjaGFubmVsID0gc2l6ZVR5cGUgPT09ICd3aWR0aCcgPyAneCcgOiAneSc7XG4gIGNvbnN0IGNvbmZpZyA9IG1vZGVsLmNvbmZpZztcbiAgY29uc3Qgc2NhbGVDb21wb25lbnQgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKTtcblxuICBpZiAoc2NhbGVDb21wb25lbnQpIHtcbiAgICBjb25zdCBzY2FsZVR5cGUgPSBzY2FsZUNvbXBvbmVudC5nZXQoJ3R5cGUnKTtcbiAgICBjb25zdCByYW5nZSA9IHNjYWxlQ29tcG9uZW50LmdldCgncmFuZ2UnKTtcblxuICAgIGlmIChoYXNEaXNjcmV0ZURvbWFpbihzY2FsZVR5cGUpICYmIGlzVmdSYW5nZVN0ZXAocmFuZ2UpKSB7XG4gICAgICAvLyBGb3IgZGlzY3JldGUgZG9tYWluIHdpdGggcmFuZ2Uuc3RlcCwgdXNlIGR5bmFtaWMgd2lkdGgvaGVpZ2h0XG4gICAgICByZXR1cm4gJ3JhbmdlLXN0ZXAnO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY29uZmlnLnZpZXdbc2l6ZVR5cGVdO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBObyBzY2FsZSAtIHNldCBkZWZhdWx0IHNpemVcbiAgICBpZiAoc2l6ZVR5cGUgPT09ICd3aWR0aCcgJiYgbW9kZWwubWFyaygpID09PSAndGV4dCcpIHtcbiAgICAgIC8vIHdpZHRoIGZvciB0ZXh0IG1hcmsgd2l0aG91dCB4LWZpZWxkIGlzIGEgYml0IHdpZGVyIHRoYW4gdHlwaWNhbCByYW5nZSBzdGVwXG4gICAgICByZXR1cm4gY29uZmlnLnNjYWxlLnRleHRYUmFuZ2VTdGVwO1xuICAgIH1cblxuICAgIC8vIFNldCB3aWR0aC9oZWlnaHQgZXF1YWwgdG8gcmFuZ2VTdGVwIGNvbmZpZyBvciBpZiByYW5nZVN0ZXAgaXMgbnVsbCwgdXNlIHZhbHVlIGZyb20gZGVmYXVsdCBzY2FsZSBjb25maWcuXG4gICAgcmV0dXJuIGNvbmZpZy5zY2FsZS5yYW5nZVN0ZXAgfHwgZGVmYXVsdFNjYWxlQ29uZmlnLnJhbmdlU3RlcDtcbiAgfVxuXG59XG4iXX0=