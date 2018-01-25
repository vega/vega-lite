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
            return properties.domain(property, specifiedAxis, isGridAxis, channel);
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
            return properties.ticks(property, specifiedAxis, isGridAxis, channel);
        case 'title':
            return common_1.getSpecifiedOrDefaultValue(specifiedAxis.title, properties.title(specifiedAxis.titleMaxLength, fieldDef, model.config));
        case 'values':
            return properties.values(specifiedAxis, model, fieldDef);
        case 'zindex':
            return common_1.getSpecifiedOrDefaultValue(specifiedAxis.zindex, properties.zindex(isGridAxis));
    }
    // Otherwise, return specified property.
    return axis_1.isAxisProperty(property) ? specifiedAxis[property] : undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9heGlzL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxtQ0FBc0c7QUFDdEcseUNBQTRFO0FBQzVFLG1DQUFzQztBQUV0QyxvQ0FBZ0Y7QUFFaEYsc0NBQTZDO0FBQzdDLGtDQUE4RTtBQUU5RSx5Q0FBaUY7QUFDakYsbUNBQXVDO0FBQ3ZDLGlDQUFtQztBQUNuQyx5Q0FBMkM7QUFHM0MsSUFBTSxVQUFVLEdBQWUsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFFOUUsdUJBQThCLEtBQWdCO0lBQzVDLE1BQU0sQ0FBQyxpQ0FBdUIsQ0FBQyxNQUFNLENBQUMsVUFBUyxJQUFJLEVBQUUsT0FBTztRQUMxRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzRCxJQUFNLGFBQWEsR0FBa0IsRUFBRSxDQUFDO1lBQ3hDLDhCQUE4QjtZQUM5QixJQUFNLElBQUksR0FBRyxhQUFhLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzNDLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxhQUFhLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUM1QixDQUFDO1lBRUQsSUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMzQyxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsYUFBYSxDQUFDLElBQUksR0FBRyxJQUFJLENB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Q1YsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDeEUsS0FBSyxPQUFPO1lBQ1YsTUFBTSxDQUFDLG1DQUEwQixDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsY0FBYyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNqSSxLQUFLLFFBQVE7WUFDWCxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzNELEtBQUssUUFBUTtZQUNYLE1BQU0sQ0FBQyxtQ0FBMEIsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUMzRixDQUFDO0lBQ0Qsd0NBQXdDO0lBQ3hDLE1BQU0sQ0FBQyxxQkFBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQUN4RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBeGlzLCBBWElTX1BST1BFUlRZX1RZUEUsIEF4aXNFbmNvZGluZywgaXNBeGlzUHJvcGVydHksIFZHX0FYSVNfUFJPUEVSVElFU30gZnJvbSAnLi4vLi4vYXhpcyc7XG5pbXBvcnQge1BPU0lUSU9OX1NDQUxFX0NIQU5ORUxTLCBQb3NpdGlvblNjYWxlQ2hhbm5lbH0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge2tleXMsIHNvbWV9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtBeGlzT3JpZW50LCBWZ0F4aXMsIFZnQXhpc0VuY29kZX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtnZXRTcGVjaWZpZWRPckRlZmF1bHRWYWx1ZSwgbnVtYmVyRm9ybWF0LCB0aXRsZU1lcmdlcn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7TGF5ZXJNb2RlbH0gZnJvbSAnLi4vbGF5ZXInO1xuaW1wb3J0IHtwYXJzZUd1aWRlUmVzb2x2ZX0gZnJvbSAnLi4vcmVzb2x2ZSc7XG5pbXBvcnQge2RlZmF1bHRUaWVCcmVha2VyLCBFeHBsaWNpdCwgbWVyZ2VWYWx1ZXNXaXRoRXhwbGljaXR9IGZyb20gJy4uL3NwbGl0JztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCB7QXhpc0NvbXBvbmVudCwgQXhpc0NvbXBvbmVudEluZGV4LCBBeGlzQ29tcG9uZW50UGFydH0gZnJvbSAnLi9jb21wb25lbnQnO1xuaW1wb3J0IHtnZXRBeGlzQ29uZmlnfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgKiBhcyBlbmNvZGUgZnJvbSAnLi9lbmNvZGUnO1xuaW1wb3J0ICogYXMgcHJvcGVydGllcyBmcm9tICcuL3Byb3BlcnRpZXMnO1xuXG50eXBlIEF4aXNQYXJ0ID0ga2V5b2YgQXhpc0VuY29kaW5nO1xuY29uc3QgQVhJU19QQVJUUzogQXhpc1BhcnRbXSA9IFsnZG9tYWluJywgJ2dyaWQnLCAnbGFiZWxzJywgJ3RpY2tzJywgJ3RpdGxlJ107XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVVuaXRBeGlzKG1vZGVsOiBVbml0TW9kZWwpOiBBeGlzQ29tcG9uZW50SW5kZXgge1xuICByZXR1cm4gUE9TSVRJT05fU0NBTEVfQ0hBTk5FTFMucmVkdWNlKGZ1bmN0aW9uKGF4aXMsIGNoYW5uZWwpIHtcbiAgICBpZiAobW9kZWwuY29tcG9uZW50LnNjYWxlc1tjaGFubmVsXSAmJiBtb2RlbC5heGlzKGNoYW5uZWwpKSB7XG4gICAgICBjb25zdCBheGlzQ29tcG9uZW50OiBBeGlzQ29tcG9uZW50ID0ge307XG4gICAgICAvLyBUT0RPOiBzdXBwb3J0IG11bHRpcGxlIGF4aXNcbiAgICAgIGNvbnN0IG1haW4gPSBwYXJzZU1haW5BeGlzKGNoYW5uZWwsIG1vZGVsKTtcbiAgICAgIGlmIChtYWluICYmIGlzVmlzaWJsZUF4aXMobWFpbikpIHtcbiAgICAgICAgYXhpc0NvbXBvbmVudC5tYWluID0gbWFpbjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZ3JpZCA9IHBhcnNlR3JpZEF4aXMoY2hhbm5lbCwgbW9kZWwpO1xuICAgICAgaWYgKGdyaWQgJiYgaXNWaXNpYmxlQXhpcyhncmlkKSkge1xuICAgICAgICBheGlzQ29tcG9uZW50LmdyaWQgPSBncmlkO1xuICAgICAgfVxuXG4gICAgICBheGlzW2NoYW5uZWxdID0gW2F4aXNDb21wb25lbnRdO1xuICAgIH1cbiAgICByZXR1cm4gYXhpcztcbiAgfSwge30gYXMgQXhpc0NvbXBvbmVudEluZGV4KTtcbn1cblxuY29uc3QgT1BQT1NJVEVfT1JJRU5UOiB7W0sgaW4gQXhpc09yaWVudF06IEF4aXNPcmllbnR9ID0ge1xuICBib3R0b206ICd0b3AnLFxuICB0b3A6ICdib3R0b20nLFxuICBsZWZ0OiAncmlnaHQnLFxuICByaWdodDogJ2xlZnQnXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VMYXllckF4aXMobW9kZWw6IExheWVyTW9kZWwpIHtcbiAgY29uc3Qge2F4ZXMsIHJlc29sdmV9ID0gbW9kZWwuY29tcG9uZW50O1xuICBjb25zdCBheGlzQ291bnQ6IHtcbiAgICAvLyBVc2luZyBNYXBwZWQgVHlwZSB0byBkZWNsYXJlIHR5cGUgKGh0dHBzOi8vd3d3LnR5cGVzY3JpcHRsYW5nLm9yZy9kb2NzL2hhbmRib29rL2FkdmFuY2VkLXR5cGVzLmh0bWwjbWFwcGVkLXR5cGVzKVxuICAgIFtrIGluIEF4aXNPcmllbnRdOiBudW1iZXJcbiAgfSA9IHt0b3A6IDAsIGJvdHRvbTogMCwgcmlnaHQ6IDAsIGxlZnQ6IDB9O1xuXG4gIGZvciAoY29uc3QgY2hpbGQgb2YgbW9kZWwuY2hpbGRyZW4pIHtcbiAgICBjaGlsZC5wYXJzZUF4aXNBbmRIZWFkZXIoKTtcblxuICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBrZXlzKGNoaWxkLmNvbXBvbmVudC5heGVzKSkge1xuICAgICAgcmVzb2x2ZS5heGlzW2NoYW5uZWxdID0gcGFyc2VHdWlkZVJlc29sdmUobW9kZWwuY29tcG9uZW50LnJlc29sdmUsIGNoYW5uZWwpO1xuICAgICAgaWYgKHJlc29sdmUuYXhpc1tjaGFubmVsXSA9PT0gJ3NoYXJlZCcpIHtcbiAgICAgICAgLy8gSWYgdGhlIHJlc29sdmUgc2F5cyBzaGFyZWQgKGFuZCBoYXMgbm90IGJlZW4gb3ZlcnJpZGRlbilcbiAgICAgICAgLy8gV2Ugd2lsbCB0cnkgdG8gbWVyZ2UgYW5kIHNlZSBpZiB0aGVyZSBpcyBhIGNvbmZsaWN0XG5cbiAgICAgICAgYXhlc1tjaGFubmVsXSA9IG1lcmdlQXhpc0NvbXBvbmVudHMoYXhlc1tjaGFubmVsXSwgY2hpbGQuY29tcG9uZW50LmF4ZXNbY2hhbm5lbF0pO1xuXG4gICAgICAgIGlmICghYXhlc1tjaGFubmVsXSkge1xuICAgICAgICAgIC8vIElmIG1lcmdlIHJldHVybnMgbm90aGluZywgdGhlcmUgaXMgYSBjb25mbGljdCBzbyB3ZSBjYW5ub3QgbWFrZSB0aGUgYXhpcyBzaGFyZWQuXG4gICAgICAgICAgLy8gVGh1cywgbWFyayBheGlzIGFzIGluZGVwZW5kZW50IGFuZCByZW1vdmUgdGhlIGF4aXMgY29tcG9uZW50LlxuICAgICAgICAgIHJlc29sdmUuYXhpc1tjaGFubmVsXSA9ICdpbmRlcGVuZGVudCc7XG4gICAgICAgICAgZGVsZXRlIGF4ZXNbY2hhbm5lbF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBNb3ZlIGF4ZXMgdG8gbGF5ZXIncyBheGlzIGNvbXBvbmVudCBhbmQgbWVyZ2Ugc2hhcmVkIGF4ZXNcbiAgZm9yIChjb25zdCBjaGFubmVsIG9mIFsneCcsICd5J10pIHtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIG1vZGVsLmNoaWxkcmVuKSB7XG4gICAgICBpZiAoIWNoaWxkLmNvbXBvbmVudC5heGVzW2NoYW5uZWxdKSB7XG4gICAgICAgIC8vIHNraXAgaWYgdGhlIGNoaWxkIGRvZXMgbm90IGhhdmUgYSBwYXJ0aWN1bGFyIGF4aXNcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXNvbHZlLmF4aXNbY2hhbm5lbF0gPT09ICdpbmRlcGVuZGVudCcpIHtcbiAgICAgICAgLy8gSWYgYXhlcyBhcmUgaW5kZXBlbmRlbnQsIGNvbmNhdCB0aGUgYXhpc0NvbXBvbmVudCBhcnJheS5cbiAgICAgICAgYXhlc1tjaGFubmVsXSA9IChheGVzW2NoYW5uZWxdIHx8IFtdKS5jb25jYXQoY2hpbGQuY29tcG9uZW50LmF4ZXNbY2hhbm5lbF0pO1xuXG4gICAgICAgIC8vIEF1dG9tYXRpY2FsbHkgYWRqdXN0IG9yaWVudFxuICAgICAgICBmb3IgKGNvbnN0IGF4aXNDb21wb25lbnQgb2YgY2hpbGQuY29tcG9uZW50LmF4ZXNbY2hhbm5lbF0pIHtcbiAgICAgICAgICBjb25zdCB7dmFsdWU6IG9yaWVudCwgZXhwbGljaXR9ID0gYXhpc0NvbXBvbmVudC5tYWluLmdldFdpdGhFeHBsaWNpdCgnb3JpZW50Jyk7XG4gICAgICAgICAgaWYgKGF4aXNDb3VudFtvcmllbnRdID4gMCAmJiAhZXhwbGljaXQpIHtcbiAgICAgICAgICAgIC8vIENoYW5nZSBheGlzIG9yaWVudCBpZiB0aGUgbnVtYmVyIGRvIG5vdCBtYXRjaFxuICAgICAgICAgICAgY29uc3Qgb3Bwb3NpdGVPcmllbnQgPSBPUFBPU0lURV9PUklFTlRbb3JpZW50XTtcbiAgICAgICAgICAgIGlmIChheGlzQ291bnRbb3JpZW50XSA+IGF4aXNDb3VudFtvcHBvc2l0ZU9yaWVudF0pIHtcbiAgICAgICAgICAgICAgYXhpc0NvbXBvbmVudC5tYWluLnNldCgnb3JpZW50Jywgb3Bwb3NpdGVPcmllbnQsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYXhpc0NvdW50W29yaWVudF0rKztcblxuICAgICAgICAgIC8vIFRPRE8oaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8yNjM0KTogYXV0b21hdGljYWx5IGFkZCBleHRyYSBvZmZzZXQ/XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gQWZ0ZXIgbWVyZ2luZywgbWFrZSBzdXJlIHRvIHJlbW92ZSBheGVzIGZyb20gY2hpbGRcbiAgICAgIGRlbGV0ZSBjaGlsZC5jb21wb25lbnQuYXhlc1tjaGFubmVsXTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gbWVyZ2VBeGlzQ29tcG9uZW50cyhtZXJnZWRBeGlzQ21wdHM6IEF4aXNDb21wb25lbnRbXSwgY2hpbGRBeGlzQ21wdHM6IEF4aXNDb21wb25lbnRbXSk6IEF4aXNDb21wb25lbnRbXSB7XG4gIGlmIChtZXJnZWRBeGlzQ21wdHMpIHtcbiAgICBpZiAobWVyZ2VkQXhpc0NtcHRzLmxlbmd0aCAhPT0gY2hpbGRBeGlzQ21wdHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkOyAvLyBDYW5ub3QgbWVyZ2UgYXhpcyBjb21wb25lbnQgd2l0aCBkaWZmZXJlbnQgbnVtYmVyIG9mIGF4ZXMuXG4gICAgfVxuICAgIGNvbnN0IGxlbmd0aCA9IG1lcmdlZEF4aXNDbXB0cy5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGggOyBpKyspIHtcbiAgICAgIGNvbnN0IG1lcmdlZE1haW4gPSBtZXJnZWRBeGlzQ21wdHNbaV0ubWFpbjtcbiAgICAgIGNvbnN0IGNoaWxkTWFpbiA9IGNoaWxkQXhpc0NtcHRzW2ldLm1haW47XG5cbiAgICAgIGlmICgoISFtZXJnZWRNYWluKSAhPT0gKCEhY2hpbGRNYWluKSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSBlbHNlIGlmIChtZXJnZWRNYWluICYmIGNoaWxkTWFpbikge1xuICAgICAgICBjb25zdCBtZXJnZWRPcmllbnQgPSBtZXJnZWRNYWluLmdldFdpdGhFeHBsaWNpdCgnb3JpZW50Jyk7XG4gICAgICAgIGNvbnN0IGNoaWxkT3JpZW50ID0gY2hpbGRNYWluLmdldFdpdGhFeHBsaWNpdCgnb3JpZW50Jyk7XG5cbiAgICAgICAgaWYgKG1lcmdlZE9yaWVudC5leHBsaWNpdCAmJiBjaGlsZE9yaWVudC5leHBsaWNpdCAmJiBtZXJnZWRPcmllbnQudmFsdWUgIT09IGNoaWxkT3JpZW50LnZhbHVlKSB7XG4gICAgICAgICAgLy8gVE9ETzogdGhyb3cgd2FybmluZyBpZiByZXNvbHZlIGlzIGV4cGxpY2l0IChXZSBkb24ndCBoYXZlIGluZm8gYWJvdXQgZXhwbGljaXQvaW1wbGljaXQgcmVzb2x2ZSB5ZXQuKVxuICAgICAgICAgIC8vIENhbm5vdCBtZXJnZSBkdWUgdG8gaW5jb25zaXN0ZW50IG9yaWVudFxuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWVyZ2VkQXhpc0NtcHRzW2ldLm1haW4gPSBtZXJnZUF4aXNDb21wb25lbnRQYXJ0KG1lcmdlZE1haW4sIGNoaWxkTWFpbik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgbWVyZ2VkR3JpZCA9IG1lcmdlZEF4aXNDbXB0c1tpXS5ncmlkO1xuICAgICAgY29uc3QgY2hpbGRHcmlkID0gY2hpbGRBeGlzQ21wdHNbaV0uZ3JpZDtcbiAgICAgIGlmICgoISFtZXJnZWRHcmlkKSAhPT0gKCEhY2hpbGRHcmlkKSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSBlbHNlIGlmIChtZXJnZWRHcmlkICYmIGNoaWxkR3JpZCkge1xuICAgICAgICBtZXJnZWRBeGlzQ21wdHNbaV0uZ3JpZCA9IG1lcmdlQXhpc0NvbXBvbmVudFBhcnQobWVyZ2VkR3JpZCwgY2hpbGRHcmlkKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gRm9yIGZpcnN0IG9uZSwgcmV0dXJuIGEgY29weSBvZiB0aGUgY2hpbGRcbiAgICByZXR1cm4gY2hpbGRBeGlzQ21wdHMubWFwKGF4aXNDb21wb25lbnQgPT4gKHtcbiAgICAgIC4uLihheGlzQ29tcG9uZW50Lm1haW4gPyB7bWFpbjogYXhpc0NvbXBvbmVudC5tYWluLmNsb25lKCl9IDoge30pLFxuICAgICAgLi4uKGF4aXNDb21wb25lbnQuZ3JpZCA/IHtncmlkOiBheGlzQ29tcG9uZW50LmdyaWQuY2xvbmUoKX0gOiB7fSlcbiAgICB9KSk7XG4gIH1cbiAgcmV0dXJuIG1lcmdlZEF4aXNDbXB0cztcbn1cblxuZnVuY3Rpb24gbWVyZ2VBeGlzQ29tcG9uZW50UGFydChtZXJnZWQ6IEF4aXNDb21wb25lbnRQYXJ0LCBjaGlsZDogQXhpc0NvbXBvbmVudFBhcnQpOiBBeGlzQ29tcG9uZW50UGFydCB7XG4gIGZvciAoY29uc3QgcHJvcCBvZiBWR19BWElTX1BST1BFUlRJRVMpIHtcbiAgICBjb25zdCBtZXJnZWRWYWx1ZVdpdGhFeHBsaWNpdCA9IG1lcmdlVmFsdWVzV2l0aEV4cGxpY2l0PFZnQXhpcywgYW55PihcbiAgICAgIG1lcmdlZC5nZXRXaXRoRXhwbGljaXQocHJvcCksXG4gICAgICBjaGlsZC5nZXRXaXRoRXhwbGljaXQocHJvcCksXG4gICAgICBwcm9wLCAnYXhpcycsXG5cbiAgICAgIC8vIFRpZSBicmVha2VyIGZ1bmN0aW9uXG4gICAgICAodjE6IEV4cGxpY2l0PGFueT4sIHYyOiBFeHBsaWNpdDxhbnk+KSA9PiB7XG4gICAgICAgIHN3aXRjaCAocHJvcCkge1xuICAgICAgICAgIGNhc2UgJ3RpdGxlJzpcbiAgICAgICAgICAgIHJldHVybiB0aXRsZU1lcmdlcih2MSwgdjIpO1xuICAgICAgICAgIGNhc2UgJ2dyaWRTY2FsZSc6XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBleHBsaWNpdDogdjEuZXhwbGljaXQsIC8vIGtlZXAgdGhlIG9sZCBleHBsaWNpdFxuICAgICAgICAgICAgICB2YWx1ZTogdjEudmFsdWUgfHwgdjIudmFsdWVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZmF1bHRUaWVCcmVha2VyPFZnQXhpcywgYW55Pih2MSwgdjIsIHByb3AsICdheGlzJyk7XG4gICAgICB9XG4gICAgKTtcbiAgICBtZXJnZWQuc2V0V2l0aEV4cGxpY2l0KHByb3AsIG1lcmdlZFZhbHVlV2l0aEV4cGxpY2l0KTtcbiAgfVxuICByZXR1cm4gbWVyZ2VkO1xufVxuXG5mdW5jdGlvbiBpc0ZhbHNlT3JOdWxsKHY6IGJvb2xlYW4gfCBudWxsKSB7XG4gIHJldHVybiB2ID09PSBmYWxzZSB8fCB2ID09PSBudWxsO1xufVxuXG4vKipcbiAqIFJldHVybiBpZiBhbiBheGlzIGlzIHZpc2libGUgKHNob3dzIGF0IGxlYXN0IG9uZSBwYXJ0IG9mIHRoZSBheGlzKS5cbiAqL1xuZnVuY3Rpb24gaXNWaXNpYmxlQXhpcyhheGlzOiBBeGlzQ29tcG9uZW50UGFydCkge1xuICByZXR1cm4gc29tZShBWElTX1BBUlRTLCAocGFydCkgPT4gaGFzQXhpc1BhcnQoYXhpcywgcGFydCkpO1xufVxuXG5mdW5jdGlvbiBoYXNBeGlzUGFydChheGlzOiBBeGlzQ29tcG9uZW50UGFydCwgcGFydDogQXhpc1BhcnQpIHtcbiAgLy8gRklYTUUoaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8yNTUyKSB0aGlzIG1ldGhvZCBjYW4gYmUgd3JvbmcgaWYgdXNlcnMgdXNlIGEgVmVnYSB0aGVtZS5cblxuICBpZiAocGFydCA9PT0gJ2F4aXMnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAocGFydCA9PT0gJ2dyaWQnIHx8IHBhcnQgPT09ICd0aXRsZScpIHtcbiAgICByZXR1cm4gISFheGlzLmdldChwYXJ0KTtcbiAgfVxuICAvLyBPdGhlciBwYXJ0cyBhcmUgZW5hYmxlZCBieSBkZWZhdWx0LCBzbyB0aGV5IHNob3VsZCBub3QgYmUgZmFsc2Ugb3IgbnVsbC5cbiAgcmV0dXJuICFpc0ZhbHNlT3JOdWxsKGF4aXMuZ2V0KHBhcnQpKTtcbn1cblxuLyoqXG4gKiBNYWtlIGFuIGlubmVyIGF4aXMgZm9yIHNob3dpbmcgZ3JpZCBmb3Igc2hhcmVkIGF4aXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUdyaWRBeGlzKGNoYW5uZWw6IFBvc2l0aW9uU2NhbGVDaGFubmVsLCBtb2RlbDogVW5pdE1vZGVsKTogQXhpc0NvbXBvbmVudFBhcnQge1xuICAvLyBGSVhNRTogc3VwcG9ydCBhZGRpbmcgdGlja3MgZm9yIGdyaWQgYXhpcyB0aGF0IGFyZSBpbm5lciBheGVzIG9mIGZhY2V0ZWQgcGxvdHMuXG4gIHJldHVybiBwYXJzZUF4aXMoY2hhbm5lbCwgbW9kZWwsIHRydWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VNYWluQXhpcyhjaGFubmVsOiBQb3NpdGlvblNjYWxlQ2hhbm5lbCwgbW9kZWw6IFVuaXRNb2RlbCk6IEF4aXNDb21wb25lbnRQYXJ0IHtcbiAgcmV0dXJuIHBhcnNlQXhpcyhjaGFubmVsLCBtb2RlbCwgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiBwYXJzZUF4aXMoY2hhbm5lbDogUG9zaXRpb25TY2FsZUNoYW5uZWwsIG1vZGVsOiBVbml0TW9kZWwsIGlzR3JpZEF4aXM6IGJvb2xlYW4pOiBBeGlzQ29tcG9uZW50UGFydCB7XG4gIGNvbnN0IGF4aXMgPSBtb2RlbC5heGlzKGNoYW5uZWwpO1xuXG4gIGNvbnN0IGF4aXNDb21wb25lbnQgPSBuZXcgQXhpc0NvbXBvbmVudFBhcnQoKTtcblxuICAvLyAxLjIuIEFkZCBwcm9wZXJ0aWVzXG4gIFZHX0FYSVNfUFJPUEVSVElFUy5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgY29uc3QgdmFsdWUgPSBnZXRQcm9wZXJ0eShwcm9wZXJ0eSwgYXhpcywgY2hhbm5lbCwgbW9kZWwsIGlzR3JpZEF4aXMpO1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBleHBsaWNpdCA9XG4gICAgICAgIC8vIHNwZWNpZmllZCBheGlzLnZhbHVlcyBpcyBhbHJlYWR5IHJlc3BlY3RlZCwgYnV0IG1heSBnZXQgdHJhbnNmb3JtZWQuXG4gICAgICAgIHByb3BlcnR5ID09PSAndmFsdWVzJyA/ICEhYXhpcy52YWx1ZXMgOlxuICAgICAgICAvLyBib3RoIFZMIGF4aXMuZW5jb2RpbmcgYW5kIGF4aXMubGFiZWxBbmdsZSBhZmZlY3QgVkcgYXhpcy5lbmNvZGVcbiAgICAgICAgcHJvcGVydHkgPT09ICdlbmNvZGUnID8gISFheGlzLmVuY29kaW5nIHx8ICEhYXhpcy5sYWJlbEFuZ2xlIDpcbiAgICAgICAgdmFsdWUgPT09IGF4aXNbcHJvcGVydHldO1xuXG4gICAgICBjb25zdCBjb25maWdWYWx1ZSA9IGdldEF4aXNDb25maWcocHJvcGVydHksIG1vZGVsLmNvbmZpZywgY2hhbm5lbCwgYXhpc0NvbXBvbmVudC5nZXQoJ29yaWVudCcpLCBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKS5nZXQoJ3R5cGUnKSk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgZXhwbGljaXQgfHwgY29uZmlnVmFsdWUgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAvLyBBIGxvdCBvZiBydWxlcyBuZWVkIHRvIGJlIGFwcGxpZWQgZm9yIHRoZSBncmlkIGF4aXNcbiAgICAgICAgLy8gRklYTUU6IHRoaXMgaXMgbm90IHBlcmZlY3RseSBjb3JyZWN0LCBidXQgd2UgbmVlZCB0byByZXdyaXRlIGF4aXMgY29tcG9uZW50IHRvIGhhdmUgb25lIGF4aXMgYW5kIHNlcGFyYXRlIHRoZW0gbGF0ZXIgZHVyaW5nIGFzc2VtYmx5IGFueXdheS5cbiAgICAgICAgaXNHcmlkQXhpc1xuICAgICAgKSB7XG4gICAgICAgIC8vIERvIG5vdCBhcHBseSBpbXBsaWNpdCBydWxlIGlmIHRoZXJlIGlzIGEgY29uZmlnIHZhbHVlXG4gICAgICAgIGF4aXNDb21wb25lbnQuc2V0KHByb3BlcnR5LCB2YWx1ZSwgZXhwbGljaXQpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgLy8gMikgQWRkIGd1aWRlIGVuY29kZSBkZWZpbml0aW9uIGdyb3Vwc1xuICBjb25zdCBheGlzRW5jb2RpbmcgPSBheGlzLmVuY29kaW5nIHx8IHt9O1xuICBjb25zdCBheGlzRW5jb2RlID0gQVhJU19QQVJUUy5yZWR1Y2UoKGU6IFZnQXhpc0VuY29kZSwgcGFydCkgPT4ge1xuICAgIGlmICghaGFzQXhpc1BhcnQoYXhpc0NvbXBvbmVudCwgcGFydCkpIHtcbiAgICAgIC8vIE5vIG5lZWQgdG8gY3JlYXRlIGVuY29kZSBmb3IgYSBkaXNhYmxlZCBwYXJ0LlxuICAgICAgcmV0dXJuIGU7XG4gICAgfVxuXG4gICAgY29uc3QgdmFsdWUgPSBwYXJ0ID09PSAnbGFiZWxzJyA/XG4gICAgICBlbmNvZGUubGFiZWxzKG1vZGVsLCBjaGFubmVsLCBheGlzRW5jb2RpbmcubGFiZWxzIHx8IHt9LCBheGlzQ29tcG9uZW50LmdldCgnb3JpZW50JykpIDpcbiAgICAgIGF4aXNFbmNvZGluZ1twYXJ0XSB8fCB7fTtcblxuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIGtleXModmFsdWUpLmxlbmd0aCA+IDApIHtcbiAgICAgIGVbcGFydF0gPSB7dXBkYXRlOiB2YWx1ZX07XG4gICAgfVxuICAgIHJldHVybiBlO1xuICB9LCB7fSBhcyBWZ0F4aXNFbmNvZGUpO1xuXG4gIC8vIEZJWE1FOiBCeSBoYXZpbmcgZW5jb2RlIGFzIG9uZSBwcm9wZXJ0eSwgd2Ugd29uJ3QgaGF2ZSBmaW5lIGdyYWluZWQgZW5jb2RlIG1lcmdpbmcuXG4gIGlmIChrZXlzKGF4aXNFbmNvZGUpLmxlbmd0aCA+IDApIHtcbiAgICBheGlzQ29tcG9uZW50LnNldCgnZW5jb2RlJywgYXhpc0VuY29kZSwgISFheGlzLmVuY29kaW5nIHx8ICEhYXhpcy5sYWJlbEFuZ2xlKTtcbiAgfVxuXG4gIHJldHVybiBheGlzQ29tcG9uZW50O1xufVxuXG5mdW5jdGlvbiBnZXRQcm9wZXJ0eTxLIGV4dGVuZHMga2V5b2YgVmdBeGlzPihwcm9wZXJ0eTogSywgc3BlY2lmaWVkQXhpczogQXhpcywgY2hhbm5lbDogUG9zaXRpb25TY2FsZUNoYW5uZWwsIG1vZGVsOiBVbml0TW9kZWwsIGlzR3JpZEF4aXM6IGJvb2xlYW4pOiBWZ0F4aXNbS10ge1xuICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuXG4gIGlmICgoaXNHcmlkQXhpcyAmJiBBWElTX1BST1BFUlRZX1RZUEVbcHJvcGVydHldID09PSAnbWFpbicpIHx8XG4gICAgICAoIWlzR3JpZEF4aXMgJiYgQVhJU19QUk9QRVJUWV9UWVBFW3Byb3BlcnR5XSA9PT0gJ2dyaWQnKSkge1xuICAgIC8vIERvIG5vdCBhcHBseSB1bmFwcGxpY2FibGUgcHJvcGVydGllc1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBzd2l0Y2ggKHByb3BlcnR5KSB7XG4gICAgY2FzZSAnc2NhbGUnOlxuICAgICAgcmV0dXJuIG1vZGVsLnNjYWxlTmFtZShjaGFubmVsKTtcbiAgICBjYXNlICdncmlkU2NhbGUnOlxuICAgICAgcmV0dXJuIHByb3BlcnRpZXMuZ3JpZFNjYWxlKG1vZGVsLCBjaGFubmVsLCBpc0dyaWRBeGlzKTtcblxuICAgIGNhc2UgJ2RvbWFpbic6XG4gICAgICByZXR1cm4gcHJvcGVydGllcy5kb21haW4ocHJvcGVydHksIHNwZWNpZmllZEF4aXMsIGlzR3JpZEF4aXMsIGNoYW5uZWwpO1xuICAgIGNhc2UgJ2Zvcm1hdCc6XG4gICAgICAvLyBXZSBkb24ndCBpbmNsdWRlIHRlbXBvcmFsIGZpZWxkIGhlcmUgYXMgd2UgYXBwbHkgZm9ybWF0IGluIGVuY29kZSBibG9ja1xuICAgICAgcmV0dXJuIG51bWJlckZvcm1hdChmaWVsZERlZiwgc3BlY2lmaWVkQXhpcy5mb3JtYXQsIG1vZGVsLmNvbmZpZyk7XG4gICAgY2FzZSAnZ3JpZCc6IHtcbiAgICAgIGNvbnN0IHNjYWxlVHlwZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpLmdldCgndHlwZScpO1xuICAgICAgcmV0dXJuIGdldFNwZWNpZmllZE9yRGVmYXVsdFZhbHVlKHNwZWNpZmllZEF4aXMuZ3JpZCwgcHJvcGVydGllcy5ncmlkKHNjYWxlVHlwZSwgZmllbGREZWYpKTtcbiAgICB9XG4gICAgY2FzZSAnbGFiZWxzJzpcbiAgICAgIHJldHVybiBpc0dyaWRBeGlzID8gZmFsc2UgOiBzcGVjaWZpZWRBeGlzLmxhYmVscztcbiAgICBjYXNlICdsYWJlbEZsdXNoJzpcbiAgICAgIHJldHVybiBwcm9wZXJ0aWVzLmxhYmVsRmx1c2goZmllbGREZWYsIGNoYW5uZWwsIHNwZWNpZmllZEF4aXMsIGlzR3JpZEF4aXMpO1xuICAgIGNhc2UgJ2xhYmVsT3ZlcmxhcCc6IHtcbiAgICAgIGNvbnN0IHNjYWxlVHlwZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpLmdldCgndHlwZScpO1xuICAgICAgcmV0dXJuIHByb3BlcnRpZXMubGFiZWxPdmVybGFwKGZpZWxkRGVmLCBzcGVjaWZpZWRBeGlzLCBjaGFubmVsLCBzY2FsZVR5cGUpO1xuICAgIH1cbiAgICBjYXNlICdtaW5FeHRlbnQnOiB7XG4gICAgICByZXR1cm4gcHJvcGVydGllcy5taW5NYXhFeHRlbnQoc3BlY2lmaWVkQXhpcy5taW5FeHRlbnQsIGlzR3JpZEF4aXMpO1xuICAgIH1cbiAgICBjYXNlICdtYXhFeHRlbnQnOiB7XG4gICAgICByZXR1cm4gcHJvcGVydGllcy5taW5NYXhFeHRlbnQoc3BlY2lmaWVkQXhpcy5tYXhFeHRlbnQsIGlzR3JpZEF4aXMpO1xuICAgIH1cbiAgICBjYXNlICdvcmllbnQnOlxuICAgICAgcmV0dXJuIGdldFNwZWNpZmllZE9yRGVmYXVsdFZhbHVlKHNwZWNpZmllZEF4aXMub3JpZW50LCBwcm9wZXJ0aWVzLm9yaWVudChjaGFubmVsKSk7XG4gICAgY2FzZSAndGlja0NvdW50Jzoge1xuICAgICAgY29uc3Qgc2NhbGVUeXBlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCkuZ2V0KCd0eXBlJyk7XG4gICAgICBjb25zdCBzaXplVHlwZSA9IGNoYW5uZWwgPT09ICd4JyA/ICd3aWR0aCcgOiBjaGFubmVsID09PSAneScgPyAnaGVpZ2h0JyA6IHVuZGVmaW5lZDtcbiAgICAgIGNvbnN0IHNpemUgPSBzaXplVHlwZSA/IG1vZGVsLmdldFNpemVTaWduYWxSZWYoc2l6ZVR5cGUpXG4gICAgICAgOiB1bmRlZmluZWQ7XG4gICAgICByZXR1cm4gZ2V0U3BlY2lmaWVkT3JEZWZhdWx0VmFsdWUoc3BlY2lmaWVkQXhpcy50aWNrQ291bnQsIHByb3BlcnRpZXMudGlja0NvdW50KGNoYW5uZWwsIGZpZWxkRGVmLCBzY2FsZVR5cGUsIHNpemUpKTtcbiAgICB9XG4gICAgY2FzZSAndGlja3MnOlxuICAgICAgcmV0dXJuIHByb3BlcnRpZXMudGlja3MocHJvcGVydHksIHNwZWNpZmllZEF4aXMsIGlzR3JpZEF4aXMsIGNoYW5uZWwpO1xuICAgIGNhc2UgJ3RpdGxlJzpcbiAgICAgIHJldHVybiBnZXRTcGVjaWZpZWRPckRlZmF1bHRWYWx1ZShzcGVjaWZpZWRBeGlzLnRpdGxlLCBwcm9wZXJ0aWVzLnRpdGxlKHNwZWNpZmllZEF4aXMudGl0bGVNYXhMZW5ndGgsIGZpZWxkRGVmLCBtb2RlbC5jb25maWcpKTtcbiAgICBjYXNlICd2YWx1ZXMnOlxuICAgICAgcmV0dXJuIHByb3BlcnRpZXMudmFsdWVzKHNwZWNpZmllZEF4aXMsIG1vZGVsLCBmaWVsZERlZik7XG4gICAgY2FzZSAnemluZGV4JzpcbiAgICAgIHJldHVybiBnZXRTcGVjaWZpZWRPckRlZmF1bHRWYWx1ZShzcGVjaWZpZWRBeGlzLnppbmRleCwgcHJvcGVydGllcy56aW5kZXgoaXNHcmlkQXhpcykpO1xuICB9XG4gIC8vIE90aGVyd2lzZSwgcmV0dXJuIHNwZWNpZmllZCBwcm9wZXJ0eS5cbiAgcmV0dXJuIGlzQXhpc1Byb3BlcnR5KHByb3BlcnR5KSA/IHNwZWNpZmllZEF4aXNbcHJvcGVydHldIDogdW5kZWZpbmVkO1xufVxuIl19