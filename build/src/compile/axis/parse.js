"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var axis_1 = require("../../axis");
var channel_1 = require("../../channel");
var util_1 = require("../../util");
var common_1 = require("../common");
var resolve_1 = require("../resolve");
var split_1 = require("../split");
var component_1 = require("./component");
var config_1 = require("./config");
var encode = require("./encode");
var properties = require("./properties");
var AXIS_PARTS = ['domain', 'grid', 'labels', 'ticks', 'title'];
function parseUnitAxis(model) {
    return channel_1.POSITION_SCALE_CHANNELS.reduce(function (axis, channel) {
        if (model.component.scales[channel] && model.axis(channel)) {
            var axisComponent = {};
            // TODO: support multiple axis
            var main = parseMainAxis(channel, model);
            if (main && isVisibleAxis(main)) {
                axisComponent.main = main;
            }
            var grid = parseGridAxis(channel, model);
            if (grid && isVisibleAxis(grid)) {
                axisComponent.grid = grid;
            }
            axis[channel] = [axisComponent];
        }
        return axis;
    }, {});
}
exports.parseUnitAxis = parseUnitAxis;
var OPPOSITE_ORIENT = {
    bottom: 'top',
    top: 'bottom',
    left: 'right',
    right: 'left'
};
function parseLayerAxis(model) {
    var _a = model.component, axes = _a.axes, resolve = _a.resolve;
    var axisCount = { top: 0, bottom: 0, right: 0, left: 0 };
    for (var _i = 0, _b = model.children; _i < _b.length; _i++) {
        var child = _b[_i];
        child.parseAxisAndHeader();
        for (var _c = 0, _d = util_1.keys(child.component.axes); _c < _d.length; _c++) {
            var channel = _d[_c];
            resolve.axis[channel] = resolve_1.parseGuideResolve(model.component.resolve, channel);
            if (resolve.axis[channel] === 'shared') {
                // If the resolve says shared (and has not been overridden)
                // We will try to merge and see if there is a conflict
                axes[channel] = mergeAxisComponents(axes[channel], child.component.axes[channel]);
                if (!axes[channel]) {
                    // If merge returns nothing, there is a conflict so we cannot make the axis shared.
                    // Thus, mark axis as independent and remove the axis component.
                    resolve.axis[channel] = 'independent';
                    delete axes[channel];
                }
            }
        }
    }
    // Move axes to layer's axis component and merge shared axes
    for (var _e = 0, _f = ['x', 'y']; _e < _f.length; _e++) {
        var channel = _f[_e];
        for (var _g = 0, _h = model.children; _g < _h.length; _g++) {
            var child = _h[_g];
            if (!child.component.axes[channel]) {
                // skip if the child does not have a particular axis
                continue;
            }
            if (resolve.axis[channel] === 'independent') {
                // If axes are independent, concat the axisComponent array.
                axes[channel] = (axes[channel] || []).concat(child.component.axes[channel]);
                // Automatically adjust orient
                for (var _j = 0, _k = child.component.axes[channel]; _j < _k.length; _j++) {
                    var axisComponent = _k[_j];
                    var _l = axisComponent.main.getWithExplicit('orient'), orient = _l.value, explicit = _l.explicit;
                    if (axisCount[orient] > 0 && !explicit) {
                        // Change axis orient if the number do not match
                        var oppositeOrient = OPPOSITE_ORIENT[orient];
                        if (axisCount[orient] > axisCount[oppositeOrient]) {
                            axisComponent.main.set('orient', oppositeOrient, false);
                        }
                    }
                    axisCount[orient]++;
                    // TODO(https://github.com/vega/vega-lite/issues/2634): automaticaly add extra offset?
                }
            }
            // After merging, make sure to remove axes from child
            delete child.component.axes[channel];
        }
    }
}
exports.parseLayerAxis = parseLayerAxis;
function mergeAxisComponents(mergedAxisCmpts, childAxisCmpts) {
    if (mergedAxisCmpts) {
        if (mergedAxisCmpts.length !== childAxisCmpts.length) {
            return undefined; // Cannot merge axis component with different number of axes.
        }
        var length_1 = mergedAxisCmpts.length;
        for (var i = 0; i < length_1; i++) {
            var mergedMain = mergedAxisCmpts[i].main;
            var childMain = childAxisCmpts[i].main;
            if ((!!mergedMain) !== (!!childMain)) {
                return undefined;
            }
            else if (mergedMain && childMain) {
                var mergedOrient = mergedMain.getWithExplicit('orient');
                var childOrient = childMain.getWithExplicit('orient');
                if (mergedOrient.explicit && childOrient.explicit && mergedOrient.value !== childOrient.value) {
                    // TODO: throw warning if resolve is explicit (We don't have info about explicit/implicit resolve yet.)
                    // Cannot merge due to inconsistent orient
                    return undefined;
                }
                else {
                    mergedAxisCmpts[i].main = mergeAxisComponentPart(mergedMain, childMain);
                }
            }
            var mergedGrid = mergedAxisCmpts[i].grid;
            var childGrid = childAxisCmpts[i].grid;
            if ((!!mergedGrid) !== (!!childGrid)) {
                return undefined;
            }
            else if (mergedGrid && childGrid) {
                mergedAxisCmpts[i].grid = mergeAxisComponentPart(mergedGrid, childGrid);
            }
        }
    }
    else {
        // For first one, return a copy of the child
        return childAxisCmpts.map(function (axisComponent) { return (__assign({}, (axisComponent.main ? { main: axisComponent.main.clone() } : {}), (axisComponent.grid ? { grid: axisComponent.grid.clone() } : {}))); });
    }
    return mergedAxisCmpts;
}
function mergeAxisComponentPart(merged, child) {
    var _loop_1 = function (prop) {
        var mergedValueWithExplicit = split_1.mergeValuesWithExplicit(merged.getWithExplicit(prop), child.getWithExplicit(prop), prop, 'axis', 
        // Tie breaker function
        function (v1, v2) {
            switch (prop) {
                case 'title':
                    return common_1.titleMerger(v1, v2);
                case 'gridScale':
                    return {
                        explicit: v1.explicit,
                        value: v1.value || v2.value
                    };
            }
            return split_1.defaultTieBreaker(v1, v2, prop, 'axis');
        });
        merged.setWithExplicit(prop, mergedValueWithExplicit);
    };
    for (var _i = 0, VG_AXIS_PROPERTIES_1 = axis_1.VG_AXIS_PROPERTIES; _i < VG_AXIS_PROPERTIES_1.length; _i++) {
        var prop = VG_AXIS_PROPERTIES_1[_i];
        _loop_1(prop);
    }
    return merged;
}
function isFalseOrNull(v) {
    return v === false || v === null;
}
/**
 * Return if an axis is visible (shows at least one part of the axis).
 */
function isVisibleAxis(axis) {
    return util_1.some(AXIS_PARTS, function (part) { return hasAxisPart(axis, part); });
}
function hasAxisPart(axis, part) {
    // FIXME(https://github.com/vega/vega-lite/issues/2552) this method can be wrong if users use a Vega theme.
    if (part === 'axis') {
        return true;
    }
    if (part === 'grid' || part === 'title') {
        return !!axis.get(part);
    }
    // Other parts are enabled by default, so they should not be false or null.
    return !isFalseOrNull(axis.get(part));
}
/**
 * Make an inner axis for showing grid for shared axis.
 */
function parseGridAxis(channel, model) {
    // FIXME: support adding ticks for grid axis that are inner axes of faceted plots.
    return parseAxis(channel, model, true);
}
exports.parseGridAxis = parseGridAxis;
function parseMainAxis(channel, model) {
    return parseAxis(channel, model, false);
}
exports.parseMainAxis = parseMainAxis;
function parseAxis(channel, model, isGridAxis) {
    var axis = model.axis(channel);
    var axisComponent = new component_1.AxisComponentPart();
    // 1.2. Add properties
    axis_1.VG_AXIS_PROPERTIES.forEach(function (property) {
        var value = getProperty(property, axis, channel, model, isGridAxis);
        if (value !== undefined) {
            var explicit = 
            // specified axis.values is already respected, but may get transformed.
            property === 'values' ? !!axis.values :
                // both VL axis.encoding and axis.labelAngle affect VG axis.encode
                property === 'encode' ? !!axis.encoding || !!axis.labelAngle :
                    value === axis[property];
            var configValue = config_1.getAxisConfig(property, model.config, channel, axisComponent.get('orient'), model.getScaleComponent(channel).get('type'));
            if (explicit || configValue === undefined ||
                // A lot of rules need to be applied for the grid axis
                // FIXME: this is not perfectly correct, but we need to rewrite axis component to have one axis and separate them later during assembly anyway.
                isGridAxis) {
                // Do not apply implicit rule if there is a config value
                axisComponent.set(property, value, explicit);
            }
        }
    });
    // 2) Add guide encode definition groups
    var axisEncoding = axis.encoding || {};
    var axisEncode = AXIS_PARTS.reduce(function (e, part) {
        if (!hasAxisPart(axisComponent, part)) {
            // No need to create encode for a disabled part.
            return e;
        }
        var value = part === 'labels' ?
            encode.labels(model, channel, axisEncoding.labels || {}, axisComponent.get('orient')) :
            axisEncoding[part] || {};
        if (value !== undefined && util_1.keys(value).length > 0) {
            e[part] = { update: value };
        }
        return e;
    }, {});
    // FIXME: By having encode as one property, we won't have fine grained encode merging.
    if (util_1.keys(axisEncode).length > 0) {
        axisComponent.set('encode', axisEncode, !!axis.encoding || !!axis.labelAngle);
    }
    return axisComponent;
}
function getProperty(property, specifiedAxis, channel, model, isGridAxis) {
    var fieldDef = model.fieldDef(channel);
    if ((isGridAxis && axis_1.AXIS_PROPERTY_TYPE[property] === 'main') ||
        (!isGridAxis && axis_1.AXIS_PROPERTY_TYPE[property] === 'grid')) {
        // Do not apply unapplicable properties
        return undefined;
    }
    switch (property) {
        case 'scale':
            return model.scaleName(channel);
        case 'gridScale':
            return properties.gridScale(model, channel, isGridAxis);
        case 'domain':
            return properties.domain('domain', specifiedAxis, isGridAxis, channel);
        case 'format':
            // We don't include temporal field here as we apply format in encode block
            return common_1.numberFormat(fieldDef, specifiedAxis.format, model.config);
        case 'grid': {
            var scaleType = model.getScaleComponent(channel).get('type');
            return common_1.getSpecifiedOrDefaultValue(specifiedAxis.grid, properties.grid(scaleType, fieldDef));
        }
        case 'labels':
            return isGridAxis ? false : specifiedAxis.labels;
        case 'labelFlush':
            return properties.labelFlush(fieldDef, channel, specifiedAxis, isGridAxis);
        case 'labelOverlap': {
            var scaleType = model.getScaleComponent(channel).get('type');
            return properties.labelOverlap(fieldDef, specifiedAxis, channel, scaleType);
        }
        case 'minExtent': {
            return properties.minMaxExtent(specifiedAxis.minExtent, isGridAxis);
        }
        case 'maxExtent': {
            return properties.minMaxExtent(specifiedAxis.maxExtent, isGridAxis);
        }
        case 'orient':
            return common_1.getSpecifiedOrDefaultValue(specifiedAxis.orient, properties.orient(channel));
        case 'tickCount': {
            var scaleType = model.getScaleComponent(channel).get('type');
            var sizeType = channel === 'x' ? 'width' : channel === 'y' ? 'height' : undefined;
            var size = sizeType ? model.getSizeSignalRef(sizeType)
                : undefined;
            return common_1.getSpecifiedOrDefaultValue(specifiedAxis.tickCount, properties.tickCount(channel, fieldDef, scaleType, size));
        }
        case 'ticks':
            return properties.ticks('ticks', specifiedAxis, isGridAxis, channel);
        case 'title':
            return common_1.getSpecifiedOrDefaultValue(
            // For falsy value, keep undefined so we use default,
            // but use null for '', null, and false to hide the title
            specifiedAxis.title || (specifiedAxis.title === undefined ? undefined : null), properties.title(specifiedAxis.titleMaxLength, fieldDef, model.config)) || undefined; // make falsy value undefined so output Vega spec is shorter
        case 'values':
            return properties.values(specifiedAxis, model, fieldDef);
        case 'zindex':
            return common_1.getSpecifiedOrDefaultValue(specifiedAxis.zindex, properties.zindex(isGridAxis));
    }
    // Otherwise, return specified property.
    return axis_1.isAxisProperty(property) ? specifiedAxis[property] : undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9heGlzL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxtQ0FBc0c7QUFDdEcseUNBQTRFO0FBQzVFLG1DQUFzQztBQUV0QyxvQ0FBZ0Y7QUFFaEYsc0NBQTZDO0FBQzdDLGtDQUE4RTtBQUU5RSx5Q0FBaUY7QUFDakYsbUNBQXVDO0FBQ3ZDLGlDQUFtQztBQUNuQyx5Q0FBMkM7QUFHM0MsSUFBTSxVQUFVLEdBQWUsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFFOUUsdUJBQThCLEtBQWdCO0lBQzVDLE1BQU0sQ0FBQyxpQ0FBdUIsQ0FBQyxNQUFNLENBQUMsVUFBUyxJQUFJLEVBQUUsT0FBTztRQUMxRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzRCxJQUFNLGFBQWEsR0FBa0IsRUFBRSxDQUFDO1lBQ3hDLDhCQUE4QjtZQUM5QixJQUFNLElBQUksR0FBRyxhQUFhLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzNDLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxhQUFhLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUM1QixDQUFDO1lBRUQsSUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMzQyxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsYUFBYSxDQUFDLElBQUksR0FBRyxJQUFJLENB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Q1YsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDdkUsS0FBSyxPQUFPO1lBQ1YsTUFBTSxDQUFDLG1DQUEwQjtZQUMvQixxREFBcUQ7WUFDckQseURBQXlEO1lBQ3pELGFBQWEsQ0FBQyxLQUFLLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFDN0UsVUFBVSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsY0FBYyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQ3ZFLElBQUksU0FBUyxDQUFDLENBQUMsNERBQTREO1FBQzlFLEtBQUssUUFBUTtZQUNYLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDM0QsS0FBSyxRQUFRO1lBQ1gsTUFBTSxDQUFDLG1DQUEwQixDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQzNGLENBQUM7SUFDRCx3Q0FBd0M7SUFDeEMsTUFBTSxDQUFDLHFCQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0FBQ3hFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0F4aXMsIEFYSVNfUFJPUEVSVFlfVFlQRSwgQXhpc0VuY29kaW5nLCBpc0F4aXNQcm9wZXJ0eSwgVkdfQVhJU19QUk9QRVJUSUVTfSBmcm9tICcuLi8uLi9heGlzJztcbmltcG9ydCB7UE9TSVRJT05fU0NBTEVfQ0hBTk5FTFMsIFBvc2l0aW9uU2NhbGVDaGFubmVsfSBmcm9tICcuLi8uLi9jaGFubmVsJztcbmltcG9ydCB7a2V5cywgc29tZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge0F4aXNPcmllbnQsIFZnQXhpcywgVmdBeGlzRW5jb2RlfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2dldFNwZWNpZmllZE9yRGVmYXVsdFZhbHVlLCBudW1iZXJGb3JtYXQsIHRpdGxlTWVyZ2VyfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtMYXllck1vZGVsfSBmcm9tICcuLi9sYXllcic7XG5pbXBvcnQge3BhcnNlR3VpZGVSZXNvbHZlfSBmcm9tICcuLi9yZXNvbHZlJztcbmltcG9ydCB7ZGVmYXVsdFRpZUJyZWFrZXIsIEV4cGxpY2l0LCBtZXJnZVZhbHVlc1dpdGhFeHBsaWNpdH0gZnJvbSAnLi4vc3BsaXQnO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uL3VuaXQnO1xuaW1wb3J0IHtBeGlzQ29tcG9uZW50LCBBeGlzQ29tcG9uZW50SW5kZXgsIEF4aXNDb21wb25lbnRQYXJ0fSBmcm9tICcuL2NvbXBvbmVudCc7XG5pbXBvcnQge2dldEF4aXNDb25maWd9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCAqIGFzIGVuY29kZSBmcm9tICcuL2VuY29kZSc7XG5pbXBvcnQgKiBhcyBwcm9wZXJ0aWVzIGZyb20gJy4vcHJvcGVydGllcyc7XG5cbnR5cGUgQXhpc1BhcnQgPSBrZXlvZiBBeGlzRW5jb2Rpbmc7XG5jb25zdCBBWElTX1BBUlRTOiBBeGlzUGFydFtdID0gWydkb21haW4nLCAnZ3JpZCcsICdsYWJlbHMnLCAndGlja3MnLCAndGl0bGUnXTtcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVW5pdEF4aXMobW9kZWw6IFVuaXRNb2RlbCk6IEF4aXNDb21wb25lbnRJbmRleCB7XG4gIHJldHVybiBQT1NJVElPTl9TQ0FMRV9DSEFOTkVMUy5yZWR1Y2UoZnVuY3Rpb24oYXhpcywgY2hhbm5lbCkge1xuICAgIGlmIChtb2RlbC5jb21wb25lbnQuc2NhbGVzW2NoYW5uZWxdICYmIG1vZGVsLmF4aXMoY2hhbm5lbCkpIHtcbiAgICAgIGNvbnN0IGF4aXNDb21wb25lbnQ6IEF4aXNDb21wb25lbnQgPSB7fTtcbiAgICAgIC8vIFRPRE86IHN1cHBvcnQgbXVsdGlwbGUgYXhpc1xuICAgICAgY29uc3QgbWFpbiA9IHBhcnNlTWFpbkF4aXMoY2hhbm5lbCwgbW9kZWwpO1xuICAgICAgaWYgKG1haW4gJiYgaXNWaXNpYmxlQXhpcyhtYWluKSkge1xuICAgICAgICBheGlzQ29tcG9uZW50Lm1haW4gPSBtYWluO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBncmlkID0gcGFyc2VHcmlkQXhpcyhjaGFubmVsLCBtb2RlbCk7XG4gICAgICBpZiAoZ3JpZCAmJiBpc1Zpc2libGVBeGlzKGdyaWQpKSB7XG4gICAgICAgIGF4aXNDb21wb25lbnQuZ3JpZCA9IGdyaWQ7XG4gICAgICB9XG5cbiAgICAgIGF4aXNbY2hhbm5lbF0gPSBbYXhpc0NvbXBvbmVudF07XG4gICAgfVxuICAgIHJldHVybiBheGlzO1xuICB9LCB7fSBhcyBBeGlzQ29tcG9uZW50SW5kZXgpO1xufVxuXG5jb25zdCBPUFBPU0lURV9PUklFTlQ6IHtbSyBpbiBBeGlzT3JpZW50XTogQXhpc09yaWVudH0gPSB7XG4gIGJvdHRvbTogJ3RvcCcsXG4gIHRvcDogJ2JvdHRvbScsXG4gIGxlZnQ6ICdyaWdodCcsXG4gIHJpZ2h0OiAnbGVmdCdcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUxheWVyQXhpcyhtb2RlbDogTGF5ZXJNb2RlbCkge1xuICBjb25zdCB7YXhlcywgcmVzb2x2ZX0gPSBtb2RlbC5jb21wb25lbnQ7XG4gIGNvbnN0IGF4aXNDb3VudDoge1xuICAgIC8vIFVzaW5nIE1hcHBlZCBUeXBlIHRvIGRlY2xhcmUgdHlwZSAoaHR0cHM6Ly93d3cudHlwZXNjcmlwdGxhbmcub3JnL2RvY3MvaGFuZGJvb2svYWR2YW5jZWQtdHlwZXMuaHRtbCNtYXBwZWQtdHlwZXMpXG4gICAgW2sgaW4gQXhpc09yaWVudF06IG51bWJlclxuICB9ID0ge3RvcDogMCwgYm90dG9tOiAwLCByaWdodDogMCwgbGVmdDogMH07XG5cbiAgZm9yIChjb25zdCBjaGlsZCBvZiBtb2RlbC5jaGlsZHJlbikge1xuICAgIGNoaWxkLnBhcnNlQXhpc0FuZEhlYWRlcigpO1xuXG4gICAgZm9yIChjb25zdCBjaGFubmVsIG9mIGtleXMoY2hpbGQuY29tcG9uZW50LmF4ZXMpKSB7XG4gICAgICByZXNvbHZlLmF4aXNbY2hhbm5lbF0gPSBwYXJzZUd1aWRlUmVzb2x2ZShtb2RlbC5jb21wb25lbnQucmVzb2x2ZSwgY2hhbm5lbCk7XG4gICAgICBpZiAocmVzb2x2ZS5heGlzW2NoYW5uZWxdID09PSAnc2hhcmVkJykge1xuICAgICAgICAvLyBJZiB0aGUgcmVzb2x2ZSBzYXlzIHNoYXJlZCAoYW5kIGhhcyBub3QgYmVlbiBvdmVycmlkZGVuKVxuICAgICAgICAvLyBXZSB3aWxsIHRyeSB0byBtZXJnZSBhbmQgc2VlIGlmIHRoZXJlIGlzIGEgY29uZmxpY3RcblxuICAgICAgICBheGVzW2NoYW5uZWxdID0gbWVyZ2VBeGlzQ29tcG9uZW50cyhheGVzW2NoYW5uZWxdLCBjaGlsZC5jb21wb25lbnQuYXhlc1tjaGFubmVsXSk7XG5cbiAgICAgICAgaWYgKCFheGVzW2NoYW5uZWxdKSB7XG4gICAgICAgICAgLy8gSWYgbWVyZ2UgcmV0dXJucyBub3RoaW5nLCB0aGVyZSBpcyBhIGNvbmZsaWN0IHNvIHdlIGNhbm5vdCBtYWtlIHRoZSBheGlzIHNoYXJlZC5cbiAgICAgICAgICAvLyBUaHVzLCBtYXJrIGF4aXMgYXMgaW5kZXBlbmRlbnQgYW5kIHJlbW92ZSB0aGUgYXhpcyBjb21wb25lbnQuXG4gICAgICAgICAgcmVzb2x2ZS5heGlzW2NoYW5uZWxdID0gJ2luZGVwZW5kZW50JztcbiAgICAgICAgICBkZWxldGUgYXhlc1tjaGFubmVsXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIE1vdmUgYXhlcyB0byBsYXllcidzIGF4aXMgY29tcG9uZW50IGFuZCBtZXJnZSBzaGFyZWQgYXhlc1xuICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgWyd4JywgJ3knXSkge1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgbW9kZWwuY2hpbGRyZW4pIHtcbiAgICAgIGlmICghY2hpbGQuY29tcG9uZW50LmF4ZXNbY2hhbm5lbF0pIHtcbiAgICAgICAgLy8gc2tpcCBpZiB0aGUgY2hpbGQgZG9lcyBub3QgaGF2ZSBhIHBhcnRpY3VsYXIgYXhpc1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlc29sdmUuYXhpc1tjaGFubmVsXSA9PT0gJ2luZGVwZW5kZW50Jykge1xuICAgICAgICAvLyBJZiBheGVzIGFyZSBpbmRlcGVuZGVudCwgY29uY2F0IHRoZSBheGlzQ29tcG9uZW50IGFycmF5LlxuICAgICAgICBheGVzW2NoYW5uZWxdID0gKGF4ZXNbY2hhbm5lbF0gfHwgW10pLmNvbmNhdChjaGlsZC5jb21wb25lbnQuYXhlc1tjaGFubmVsXSk7XG5cbiAgICAgICAgLy8gQXV0b21hdGljYWxseSBhZGp1c3Qgb3JpZW50XG4gICAgICAgIGZvciAoY29uc3QgYXhpc0NvbXBvbmVudCBvZiBjaGlsZC5jb21wb25lbnQuYXhlc1tjaGFubmVsXSkge1xuICAgICAgICAgIGNvbnN0IHt2YWx1ZTogb3JpZW50LCBleHBsaWNpdH0gPSBheGlzQ29tcG9uZW50Lm1haW4uZ2V0V2l0aEV4cGxpY2l0KCdvcmllbnQnKTtcbiAgICAgICAgICBpZiAoYXhpc0NvdW50W29yaWVudF0gPiAwICYmICFleHBsaWNpdCkge1xuICAgICAgICAgICAgLy8gQ2hhbmdlIGF4aXMgb3JpZW50IGlmIHRoZSBudW1iZXIgZG8gbm90IG1hdGNoXG4gICAgICAgICAgICBjb25zdCBvcHBvc2l0ZU9yaWVudCA9IE9QUE9TSVRFX09SSUVOVFtvcmllbnRdO1xuICAgICAgICAgICAgaWYgKGF4aXNDb3VudFtvcmllbnRdID4gYXhpc0NvdW50W29wcG9zaXRlT3JpZW50XSkge1xuICAgICAgICAgICAgICBheGlzQ29tcG9uZW50Lm1haW4uc2V0KCdvcmllbnQnLCBvcHBvc2l0ZU9yaWVudCwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBheGlzQ291bnRbb3JpZW50XSsrO1xuXG4gICAgICAgICAgLy8gVE9ETyhodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLWxpdGUvaXNzdWVzLzI2MzQpOiBhdXRvbWF0aWNhbHkgYWRkIGV4dHJhIG9mZnNldD9cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBBZnRlciBtZXJnaW5nLCBtYWtlIHN1cmUgdG8gcmVtb3ZlIGF4ZXMgZnJvbSBjaGlsZFxuICAgICAgZGVsZXRlIGNoaWxkLmNvbXBvbmVudC5heGVzW2NoYW5uZWxdO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBtZXJnZUF4aXNDb21wb25lbnRzKG1lcmdlZEF4aXNDbXB0czogQXhpc0NvbXBvbmVudFtdLCBjaGlsZEF4aXNDbXB0czogQXhpc0NvbXBvbmVudFtdKTogQXhpc0NvbXBvbmVudFtdIHtcbiAgaWYgKG1lcmdlZEF4aXNDbXB0cykge1xuICAgIGlmIChtZXJnZWRBeGlzQ21wdHMubGVuZ3RoICE9PSBjaGlsZEF4aXNDbXB0cy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7IC8vIENhbm5vdCBtZXJnZSBheGlzIGNvbXBvbmVudCB3aXRoIGRpZmZlcmVudCBudW1iZXIgb2YgYXhlcy5cbiAgICB9XG4gICAgY29uc3QgbGVuZ3RoID0gbWVyZ2VkQXhpc0NtcHRzLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aCA7IGkrKykge1xuICAgICAgY29uc3QgbWVyZ2VkTWFpbiA9IG1lcmdlZEF4aXNDbXB0c1tpXS5tYWluO1xuICAgICAgY29uc3QgY2hpbGRNYWluID0gY2hpbGRBeGlzQ21wdHNbaV0ubWFpbjtcblxuICAgICAgaWYgKCghIW1lcmdlZE1haW4pICE9PSAoISFjaGlsZE1haW4pKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9IGVsc2UgaWYgKG1lcmdlZE1haW4gJiYgY2hpbGRNYWluKSB7XG4gICAgICAgIGNvbnN0IG1lcmdlZE9yaWVudCA9IG1lcmdlZE1haW4uZ2V0V2l0aEV4cGxpY2l0KCdvcmllbnQnKTtcbiAgICAgICAgY29uc3QgY2hpbGRPcmllbnQgPSBjaGlsZE1haW4uZ2V0V2l0aEV4cGxpY2l0KCdvcmllbnQnKTtcblxuICAgICAgICBpZiAobWVyZ2VkT3JpZW50LmV4cGxpY2l0ICYmIGNoaWxkT3JpZW50LmV4cGxpY2l0ICYmIG1lcmdlZE9yaWVudC52YWx1ZSAhPT0gY2hpbGRPcmllbnQudmFsdWUpIHtcbiAgICAgICAgICAvLyBUT0RPOiB0aHJvdyB3YXJuaW5nIGlmIHJlc29sdmUgaXMgZXhwbGljaXQgKFdlIGRvbid0IGhhdmUgaW5mbyBhYm91dCBleHBsaWNpdC9pbXBsaWNpdCByZXNvbHZlIHlldC4pXG4gICAgICAgICAgLy8gQ2Fubm90IG1lcmdlIGR1ZSB0byBpbmNvbnNpc3RlbnQgb3JpZW50XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZXJnZWRBeGlzQ21wdHNbaV0ubWFpbiA9IG1lcmdlQXhpc0NvbXBvbmVudFBhcnQobWVyZ2VkTWFpbiwgY2hpbGRNYWluKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBtZXJnZWRHcmlkID0gbWVyZ2VkQXhpc0NtcHRzW2ldLmdyaWQ7XG4gICAgICBjb25zdCBjaGlsZEdyaWQgPSBjaGlsZEF4aXNDbXB0c1tpXS5ncmlkO1xuICAgICAgaWYgKCghIW1lcmdlZEdyaWQpICE9PSAoISFjaGlsZEdyaWQpKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9IGVsc2UgaWYgKG1lcmdlZEdyaWQgJiYgY2hpbGRHcmlkKSB7XG4gICAgICAgIG1lcmdlZEF4aXNDbXB0c1tpXS5ncmlkID0gbWVyZ2VBeGlzQ29tcG9uZW50UGFydChtZXJnZWRHcmlkLCBjaGlsZEdyaWQpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBGb3IgZmlyc3Qgb25lLCByZXR1cm4gYSBjb3B5IG9mIHRoZSBjaGlsZFxuICAgIHJldHVybiBjaGlsZEF4aXNDbXB0cy5tYXAoYXhpc0NvbXBvbmVudCA9PiAoe1xuICAgICAgLi4uKGF4aXNDb21wb25lbnQubWFpbiA/IHttYWluOiBheGlzQ29tcG9uZW50Lm1haW4uY2xvbmUoKX0gOiB7fSksXG4gICAgICAuLi4oYXhpc0NvbXBvbmVudC5ncmlkID8ge2dyaWQ6IGF4aXNDb21wb25lbnQuZ3JpZC5jbG9uZSgpfSA6IHt9KVxuICAgIH0pKTtcbiAgfVxuICByZXR1cm4gbWVyZ2VkQXhpc0NtcHRzO1xufVxuXG5mdW5jdGlvbiBtZXJnZUF4aXNDb21wb25lbnRQYXJ0KG1lcmdlZDogQXhpc0NvbXBvbmVudFBhcnQsIGNoaWxkOiBBeGlzQ29tcG9uZW50UGFydCk6IEF4aXNDb21wb25lbnRQYXJ0IHtcbiAgZm9yIChjb25zdCBwcm9wIG9mIFZHX0FYSVNfUFJPUEVSVElFUykge1xuICAgIGNvbnN0IG1lcmdlZFZhbHVlV2l0aEV4cGxpY2l0ID0gbWVyZ2VWYWx1ZXNXaXRoRXhwbGljaXQ8VmdBeGlzLCBhbnk+KFxuICAgICAgbWVyZ2VkLmdldFdpdGhFeHBsaWNpdChwcm9wKSxcbiAgICAgIGNoaWxkLmdldFdpdGhFeHBsaWNpdChwcm9wKSxcbiAgICAgIHByb3AsICdheGlzJyxcblxuICAgICAgLy8gVGllIGJyZWFrZXIgZnVuY3Rpb25cbiAgICAgICh2MTogRXhwbGljaXQ8YW55PiwgdjI6IEV4cGxpY2l0PGFueT4pID0+IHtcbiAgICAgICAgc3dpdGNoIChwcm9wKSB7XG4gICAgICAgICAgY2FzZSAndGl0bGUnOlxuICAgICAgICAgICAgcmV0dXJuIHRpdGxlTWVyZ2VyKHYxLCB2Mik7XG4gICAgICAgICAgY2FzZSAnZ3JpZFNjYWxlJzpcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIGV4cGxpY2l0OiB2MS5leHBsaWNpdCwgLy8ga2VlcCB0aGUgb2xkIGV4cGxpY2l0XG4gICAgICAgICAgICAgIHZhbHVlOiB2MS52YWx1ZSB8fCB2Mi52YWx1ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmYXVsdFRpZUJyZWFrZXI8VmdBeGlzLCBhbnk+KHYxLCB2MiwgcHJvcCwgJ2F4aXMnKTtcbiAgICAgIH1cbiAgICApO1xuICAgIG1lcmdlZC5zZXRXaXRoRXhwbGljaXQocHJvcCwgbWVyZ2VkVmFsdWVXaXRoRXhwbGljaXQpO1xuICB9XG4gIHJldHVybiBtZXJnZWQ7XG59XG5cbmZ1bmN0aW9uIGlzRmFsc2VPck51bGwodjogYm9vbGVhbiB8IG51bGwpIHtcbiAgcmV0dXJuIHYgPT09IGZhbHNlIHx8IHYgPT09IG51bGw7XG59XG5cbi8qKlxuICogUmV0dXJuIGlmIGFuIGF4aXMgaXMgdmlzaWJsZSAoc2hvd3MgYXQgbGVhc3Qgb25lIHBhcnQgb2YgdGhlIGF4aXMpLlxuICovXG5mdW5jdGlvbiBpc1Zpc2libGVBeGlzKGF4aXM6IEF4aXNDb21wb25lbnRQYXJ0KSB7XG4gIHJldHVybiBzb21lKEFYSVNfUEFSVFMsIChwYXJ0KSA9PiBoYXNBeGlzUGFydChheGlzLCBwYXJ0KSk7XG59XG5cbmZ1bmN0aW9uIGhhc0F4aXNQYXJ0KGF4aXM6IEF4aXNDb21wb25lbnRQYXJ0LCBwYXJ0OiBBeGlzUGFydCkge1xuICAvLyBGSVhNRShodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLWxpdGUvaXNzdWVzLzI1NTIpIHRoaXMgbWV0aG9kIGNhbiBiZSB3cm9uZyBpZiB1c2VycyB1c2UgYSBWZWdhIHRoZW1lLlxuXG4gIGlmIChwYXJ0ID09PSAnYXhpcycpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmIChwYXJ0ID09PSAnZ3JpZCcgfHwgcGFydCA9PT0gJ3RpdGxlJykge1xuICAgIHJldHVybiAhIWF4aXMuZ2V0KHBhcnQpO1xuICB9XG4gIC8vIE90aGVyIHBhcnRzIGFyZSBlbmFibGVkIGJ5IGRlZmF1bHQsIHNvIHRoZXkgc2hvdWxkIG5vdCBiZSBmYWxzZSBvciBudWxsLlxuICByZXR1cm4gIWlzRmFsc2VPck51bGwoYXhpcy5nZXQocGFydCkpO1xufVxuXG4vKipcbiAqIE1ha2UgYW4gaW5uZXIgYXhpcyBmb3Igc2hvd2luZyBncmlkIGZvciBzaGFyZWQgYXhpcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlR3JpZEF4aXMoY2hhbm5lbDogUG9zaXRpb25TY2FsZUNoYW5uZWwsIG1vZGVsOiBVbml0TW9kZWwpOiBBeGlzQ29tcG9uZW50UGFydCB7XG4gIC8vIEZJWE1FOiBzdXBwb3J0IGFkZGluZyB0aWNrcyBmb3IgZ3JpZCBheGlzIHRoYXQgYXJlIGlubmVyIGF4ZXMgb2YgZmFjZXRlZCBwbG90cy5cbiAgcmV0dXJuIHBhcnNlQXhpcyhjaGFubmVsLCBtb2RlbCwgdHJ1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZU1haW5BeGlzKGNoYW5uZWw6IFBvc2l0aW9uU2NhbGVDaGFubmVsLCBtb2RlbDogVW5pdE1vZGVsKTogQXhpc0NvbXBvbmVudFBhcnQge1xuICByZXR1cm4gcGFyc2VBeGlzKGNoYW5uZWwsIG1vZGVsLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlQXhpcyhjaGFubmVsOiBQb3NpdGlvblNjYWxlQ2hhbm5lbCwgbW9kZWw6IFVuaXRNb2RlbCwgaXNHcmlkQXhpczogYm9vbGVhbik6IEF4aXNDb21wb25lbnRQYXJ0IHtcbiAgY29uc3QgYXhpcyA9IG1vZGVsLmF4aXMoY2hhbm5lbCk7XG5cbiAgY29uc3QgYXhpc0NvbXBvbmVudCA9IG5ldyBBeGlzQ29tcG9uZW50UGFydCgpO1xuXG4gIC8vIDEuMi4gQWRkIHByb3BlcnRpZXNcbiAgVkdfQVhJU19QUk9QRVJUSUVTLmZvckVhY2goZnVuY3Rpb24ocHJvcGVydHkpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGdldFByb3BlcnR5KHByb3BlcnR5LCBheGlzLCBjaGFubmVsLCBtb2RlbCwgaXNHcmlkQXhpcyk7XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IGV4cGxpY2l0ID1cbiAgICAgICAgLy8gc3BlY2lmaWVkIGF4aXMudmFsdWVzIGlzIGFscmVhZHkgcmVzcGVjdGVkLCBidXQgbWF5IGdldCB0cmFuc2Zvcm1lZC5cbiAgICAgICAgcHJvcGVydHkgPT09ICd2YWx1ZXMnID8gISFheGlzLnZhbHVlcyA6XG4gICAgICAgIC8vIGJvdGggVkwgYXhpcy5lbmNvZGluZyBhbmQgYXhpcy5sYWJlbEFuZ2xlIGFmZmVjdCBWRyBheGlzLmVuY29kZVxuICAgICAgICBwcm9wZXJ0eSA9PT0gJ2VuY29kZScgPyAhIWF4aXMuZW5jb2RpbmcgfHwgISFheGlzLmxhYmVsQW5nbGUgOlxuICAgICAgICB2YWx1ZSA9PT0gYXhpc1twcm9wZXJ0eV07XG5cbiAgICAgIGNvbnN0IGNvbmZpZ1ZhbHVlID0gZ2V0QXhpc0NvbmZpZyhwcm9wZXJ0eSwgbW9kZWwuY29uZmlnLCBjaGFubmVsLCBheGlzQ29tcG9uZW50LmdldCgnb3JpZW50JyksIG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpLmdldCgndHlwZScpKTtcblxuICAgICAgaWYgKFxuICAgICAgICBleHBsaWNpdCB8fCBjb25maWdWYWx1ZSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgIC8vIEEgbG90IG9mIHJ1bGVzIG5lZWQgdG8gYmUgYXBwbGllZCBmb3IgdGhlIGdyaWQgYXhpc1xuICAgICAgICAvLyBGSVhNRTogdGhpcyBpcyBub3QgcGVyZmVjdGx5IGNvcnJlY3QsIGJ1dCB3ZSBuZWVkIHRvIHJld3JpdGUgYXhpcyBjb21wb25lbnQgdG8gaGF2ZSBvbmUgYXhpcyBhbmQgc2VwYXJhdGUgdGhlbSBsYXRlciBkdXJpbmcgYXNzZW1ibHkgYW55d2F5LlxuICAgICAgICBpc0dyaWRBeGlzXG4gICAgICApIHtcbiAgICAgICAgLy8gRG8gbm90IGFwcGx5IGltcGxpY2l0IHJ1bGUgaWYgdGhlcmUgaXMgYSBjb25maWcgdmFsdWVcbiAgICAgICAgYXhpc0NvbXBvbmVudC5zZXQocHJvcGVydHksIHZhbHVlLCBleHBsaWNpdCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvLyAyKSBBZGQgZ3VpZGUgZW5jb2RlIGRlZmluaXRpb24gZ3JvdXBzXG4gIGNvbnN0IGF4aXNFbmNvZGluZyA9IGF4aXMuZW5jb2RpbmcgfHwge307XG4gIGNvbnN0IGF4aXNFbmNvZGUgPSBBWElTX1BBUlRTLnJlZHVjZSgoZTogVmdBeGlzRW5jb2RlLCBwYXJ0KSA9PiB7XG4gICAgaWYgKCFoYXNBeGlzUGFydChheGlzQ29tcG9uZW50LCBwYXJ0KSkge1xuICAgICAgLy8gTm8gbmVlZCB0byBjcmVhdGUgZW5jb2RlIGZvciBhIGRpc2FibGVkIHBhcnQuXG4gICAgICByZXR1cm4gZTtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZSA9IHBhcnQgPT09ICdsYWJlbHMnID9cbiAgICAgIGVuY29kZS5sYWJlbHMobW9kZWwsIGNoYW5uZWwsIGF4aXNFbmNvZGluZy5sYWJlbHMgfHwge30sIGF4aXNDb21wb25lbnQuZ2V0KCdvcmllbnQnKSkgOlxuICAgICAgYXhpc0VuY29kaW5nW3BhcnRdIHx8IHt9O1xuXG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQgJiYga2V5cyh2YWx1ZSkubGVuZ3RoID4gMCkge1xuICAgICAgZVtwYXJ0XSA9IHt1cGRhdGU6IHZhbHVlfTtcbiAgICB9XG4gICAgcmV0dXJuIGU7XG4gIH0sIHt9IGFzIFZnQXhpc0VuY29kZSk7XG5cbiAgLy8gRklYTUU6IEJ5IGhhdmluZyBlbmNvZGUgYXMgb25lIHByb3BlcnR5LCB3ZSB3b24ndCBoYXZlIGZpbmUgZ3JhaW5lZCBlbmNvZGUgbWVyZ2luZy5cbiAgaWYgKGtleXMoYXhpc0VuY29kZSkubGVuZ3RoID4gMCkge1xuICAgIGF4aXNDb21wb25lbnQuc2V0KCdlbmNvZGUnLCBheGlzRW5jb2RlLCAhIWF4aXMuZW5jb2RpbmcgfHwgISFheGlzLmxhYmVsQW5nbGUpO1xuICB9XG5cbiAgcmV0dXJuIGF4aXNDb21wb25lbnQ7XG59XG5cbmZ1bmN0aW9uIGdldFByb3BlcnR5PEsgZXh0ZW5kcyBrZXlvZiBWZ0F4aXM+KHByb3BlcnR5OiBLLCBzcGVjaWZpZWRBeGlzOiBBeGlzLCBjaGFubmVsOiBQb3NpdGlvblNjYWxlQ2hhbm5lbCwgbW9kZWw6IFVuaXRNb2RlbCwgaXNHcmlkQXhpczogYm9vbGVhbik6IFZnQXhpc1tLXSB7XG4gIGNvbnN0IGZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCk7XG5cbiAgaWYgKChpc0dyaWRBeGlzICYmIEFYSVNfUFJPUEVSVFlfVFlQRVtwcm9wZXJ0eV0gPT09ICdtYWluJykgfHxcbiAgICAgICghaXNHcmlkQXhpcyAmJiBBWElTX1BST1BFUlRZX1RZUEVbcHJvcGVydHldID09PSAnZ3JpZCcpKSB7XG4gICAgLy8gRG8gbm90IGFwcGx5IHVuYXBwbGljYWJsZSBwcm9wZXJ0aWVzXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHN3aXRjaCAocHJvcGVydHkpIHtcbiAgICBjYXNlICdzY2FsZSc6XG4gICAgICByZXR1cm4gbW9kZWwuc2NhbGVOYW1lKGNoYW5uZWwpO1xuICAgIGNhc2UgJ2dyaWRTY2FsZSc6XG4gICAgICByZXR1cm4gcHJvcGVydGllcy5ncmlkU2NhbGUobW9kZWwsIGNoYW5uZWwsIGlzR3JpZEF4aXMpO1xuXG4gICAgY2FzZSAnZG9tYWluJzpcbiAgICAgIHJldHVybiBwcm9wZXJ0aWVzLmRvbWFpbignZG9tYWluJywgc3BlY2lmaWVkQXhpcywgaXNHcmlkQXhpcywgY2hhbm5lbCk7XG4gICAgY2FzZSAnZm9ybWF0JzpcbiAgICAgIC8vIFdlIGRvbid0IGluY2x1ZGUgdGVtcG9yYWwgZmllbGQgaGVyZSBhcyB3ZSBhcHBseSBmb3JtYXQgaW4gZW5jb2RlIGJsb2NrXG4gICAgICByZXR1cm4gbnVtYmVyRm9ybWF0KGZpZWxkRGVmLCBzcGVjaWZpZWRBeGlzLmZvcm1hdCwgbW9kZWwuY29uZmlnKTtcbiAgICBjYXNlICdncmlkJzoge1xuICAgICAgY29uc3Qgc2NhbGVUeXBlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCkuZ2V0KCd0eXBlJyk7XG4gICAgICByZXR1cm4gZ2V0U3BlY2lmaWVkT3JEZWZhdWx0VmFsdWUoc3BlY2lmaWVkQXhpcy5ncmlkLCBwcm9wZXJ0aWVzLmdyaWQoc2NhbGVUeXBlLCBmaWVsZERlZikpO1xuICAgIH1cbiAgICBjYXNlICdsYWJlbHMnOlxuICAgICAgcmV0dXJuIGlzR3JpZEF4aXMgPyBmYWxzZSA6IHNwZWNpZmllZEF4aXMubGFiZWxzO1xuICAgIGNhc2UgJ2xhYmVsRmx1c2gnOlxuICAgICAgcmV0dXJuIHByb3BlcnRpZXMubGFiZWxGbHVzaChmaWVsZERlZiwgY2hhbm5lbCwgc3BlY2lmaWVkQXhpcywgaXNHcmlkQXhpcyk7XG4gICAgY2FzZSAnbGFiZWxPdmVybGFwJzoge1xuICAgICAgY29uc3Qgc2NhbGVUeXBlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCkuZ2V0KCd0eXBlJyk7XG4gICAgICByZXR1cm4gcHJvcGVydGllcy5sYWJlbE92ZXJsYXAoZmllbGREZWYsIHNwZWNpZmllZEF4aXMsIGNoYW5uZWwsIHNjYWxlVHlwZSk7XG4gICAgfVxuICAgIGNhc2UgJ21pbkV4dGVudCc6IHtcbiAgICAgIHJldHVybiBwcm9wZXJ0aWVzLm1pbk1heEV4dGVudChzcGVjaWZpZWRBeGlzLm1pbkV4dGVudCwgaXNHcmlkQXhpcyk7XG4gICAgfVxuICAgIGNhc2UgJ21heEV4dGVudCc6IHtcbiAgICAgIHJldHVybiBwcm9wZXJ0aWVzLm1pbk1heEV4dGVudChzcGVjaWZpZWRBeGlzLm1heEV4dGVudCwgaXNHcmlkQXhpcyk7XG4gICAgfVxuICAgIGNhc2UgJ29yaWVudCc6XG4gICAgICByZXR1cm4gZ2V0U3BlY2lmaWVkT3JEZWZhdWx0VmFsdWUoc3BlY2lmaWVkQXhpcy5vcmllbnQsIHByb3BlcnRpZXMub3JpZW50KGNoYW5uZWwpKTtcbiAgICBjYXNlICd0aWNrQ291bnQnOiB7XG4gICAgICBjb25zdCBzY2FsZVR5cGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKS5nZXQoJ3R5cGUnKTtcbiAgICAgIGNvbnN0IHNpemVUeXBlID0gY2hhbm5lbCA9PT0gJ3gnID8gJ3dpZHRoJyA6IGNoYW5uZWwgPT09ICd5JyA/ICdoZWlnaHQnIDogdW5kZWZpbmVkO1xuICAgICAgY29uc3Qgc2l6ZSA9IHNpemVUeXBlID8gbW9kZWwuZ2V0U2l6ZVNpZ25hbFJlZihzaXplVHlwZSlcbiAgICAgICA6IHVuZGVmaW5lZDtcbiAgICAgIHJldHVybiBnZXRTcGVjaWZpZWRPckRlZmF1bHRWYWx1ZShzcGVjaWZpZWRBeGlzLnRpY2tDb3VudCwgcHJvcGVydGllcy50aWNrQ291bnQoY2hhbm5lbCwgZmllbGREZWYsIHNjYWxlVHlwZSwgc2l6ZSkpO1xuICAgIH1cbiAgICBjYXNlICd0aWNrcyc6XG4gICAgICByZXR1cm4gcHJvcGVydGllcy50aWNrcygndGlja3MnLCBzcGVjaWZpZWRBeGlzLCBpc0dyaWRBeGlzLCBjaGFubmVsKTtcbiAgICBjYXNlICd0aXRsZSc6XG4gICAgICByZXR1cm4gZ2V0U3BlY2lmaWVkT3JEZWZhdWx0VmFsdWUoXG4gICAgICAgIC8vIEZvciBmYWxzeSB2YWx1ZSwga2VlcCB1bmRlZmluZWQgc28gd2UgdXNlIGRlZmF1bHQsXG4gICAgICAgIC8vIGJ1dCB1c2UgbnVsbCBmb3IgJycsIG51bGwsIGFuZCBmYWxzZSB0byBoaWRlIHRoZSB0aXRsZVxuICAgICAgICBzcGVjaWZpZWRBeGlzLnRpdGxlIHx8IChzcGVjaWZpZWRBeGlzLnRpdGxlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBudWxsKSxcbiAgICAgICAgcHJvcGVydGllcy50aXRsZShzcGVjaWZpZWRBeGlzLnRpdGxlTWF4TGVuZ3RoLCBmaWVsZERlZiwgbW9kZWwuY29uZmlnKVxuICAgICAgKSB8fCB1bmRlZmluZWQ7IC8vIG1ha2UgZmFsc3kgdmFsdWUgdW5kZWZpbmVkIHNvIG91dHB1dCBWZWdhIHNwZWMgaXMgc2hvcnRlclxuICAgIGNhc2UgJ3ZhbHVlcyc6XG4gICAgICByZXR1cm4gcHJvcGVydGllcy52YWx1ZXMoc3BlY2lmaWVkQXhpcywgbW9kZWwsIGZpZWxkRGVmKTtcbiAgICBjYXNlICd6aW5kZXgnOlxuICAgICAgcmV0dXJuIGdldFNwZWNpZmllZE9yRGVmYXVsdFZhbHVlKHNwZWNpZmllZEF4aXMuemluZGV4LCBwcm9wZXJ0aWVzLnppbmRleChpc0dyaWRBeGlzKSk7XG4gIH1cbiAgLy8gT3RoZXJ3aXNlLCByZXR1cm4gc3BlY2lmaWVkIHByb3BlcnR5LlxuICByZXR1cm4gaXNBeGlzUHJvcGVydHkocHJvcGVydHkpID8gc3BlY2lmaWVkQXhpc1twcm9wZXJ0eV0gOiB1bmRlZmluZWQ7XG59XG4iXX0=