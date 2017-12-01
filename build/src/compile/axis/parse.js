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
        if (model.axis(channel)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9heGlzL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxtQ0FBc0c7QUFDdEcseUNBQTRFO0FBQzVFLG1DQUFzQztBQUV0QyxvQ0FBZ0Y7QUFFaEYsc0NBQTZDO0FBQzdDLGtDQUE4RTtBQUU5RSx5Q0FBaUY7QUFDakYsbUNBQXVDO0FBQ3ZDLGlDQUFtQztBQUNuQyx5Q0FBMkM7QUFHM0MsSUFBTSxVQUFVLEdBQWUsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFFOUUsdUJBQThCLEtBQWdCO0lBQzVDLE1BQU0sQ0FBQyxpQ0FBdUIsQ0FBQyxNQUFNLENBQUMsVUFBUyxJQUFJLEVBQUUsT0FBTztRQUMxRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFNLGFBQWEsR0FBa0IsRUFBRSxDQUFDO1lBQ3hDLDhCQUE4QjtZQUM5QixJQUFNLElBQUksR0FBRyxhQUFhLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzNDLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxhQUFhLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUM1QixDQUFDO1lBRUQsSUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMzQyxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsYUFBYSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDNUIsQ0FBQztZQUVELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxD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QWEsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDeEUsS0FBSyxPQUFPO1lBQ1YsTUFBTSxDQUFDLG1DQUEwQixDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsY0FBYyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNqSSxLQUFLLFFBQVE7WUFDWCxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzNELEtBQUssUUFBUTtZQUNYLE1BQU0sQ0FBQyxtQ0FBMEIsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUMzRixDQUFDO0lBQ0Qsd0NBQXdDO0lBQ3hDLE1BQU0sQ0FBQyxxQkFBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQUN4RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBeGlzLCBBWElTX1BST1BFUlRZX1RZUEUsIEF4aXNFbmNvZGluZywgaXNBeGlzUHJvcGVydHksIFZHX0FYSVNfUFJPUEVSVElFU30gZnJvbSAnLi4vLi4vYXhpcyc7XG5pbXBvcnQge1BPU0lUSU9OX1NDQUxFX0NIQU5ORUxTLCBQb3NpdGlvblNjYWxlQ2hhbm5lbH0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge2tleXMsIHNvbWV9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtBeGlzT3JpZW50LCBWZ0F4aXMsIFZnQXhpc0VuY29kZX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtnZXRTcGVjaWZpZWRPckRlZmF1bHRWYWx1ZSwgbnVtYmVyRm9ybWF0LCB0aXRsZU1lcmdlcn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7TGF5ZXJNb2RlbH0gZnJvbSAnLi4vbGF5ZXInO1xuaW1wb3J0IHtwYXJzZUd1aWRlUmVzb2x2ZX0gZnJvbSAnLi4vcmVzb2x2ZSc7XG5pbXBvcnQge2RlZmF1bHRUaWVCcmVha2VyLCBFeHBsaWNpdCwgbWVyZ2VWYWx1ZXNXaXRoRXhwbGljaXR9IGZyb20gJy4uL3NwbGl0JztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCB7QXhpc0NvbXBvbmVudCwgQXhpc0NvbXBvbmVudEluZGV4LCBBeGlzQ29tcG9uZW50UGFydH0gZnJvbSAnLi9jb21wb25lbnQnO1xuaW1wb3J0IHtnZXRBeGlzQ29uZmlnfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgKiBhcyBlbmNvZGUgZnJvbSAnLi9lbmNvZGUnO1xuaW1wb3J0ICogYXMgcHJvcGVydGllcyBmcm9tICcuL3Byb3BlcnRpZXMnO1xuXG50eXBlIEF4aXNQYXJ0ID0ga2V5b2YgQXhpc0VuY29kaW5nO1xuY29uc3QgQVhJU19QQVJUUzogQXhpc1BhcnRbXSA9IFsnZG9tYWluJywgJ2dyaWQnLCAnbGFiZWxzJywgJ3RpY2tzJywgJ3RpdGxlJ107XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVVuaXRBeGlzKG1vZGVsOiBVbml0TW9kZWwpOiBBeGlzQ29tcG9uZW50SW5kZXgge1xuICByZXR1cm4gUE9TSVRJT05fU0NBTEVfQ0hBTk5FTFMucmVkdWNlKGZ1bmN0aW9uKGF4aXMsIGNoYW5uZWwpIHtcbiAgICBpZiAobW9kZWwuYXhpcyhjaGFubmVsKSkge1xuICAgICAgY29uc3QgYXhpc0NvbXBvbmVudDogQXhpc0NvbXBvbmVudCA9IHt9O1xuICAgICAgLy8gVE9ETzogc3VwcG9ydCBtdWx0aXBsZSBheGlzXG4gICAgICBjb25zdCBtYWluID0gcGFyc2VNYWluQXhpcyhjaGFubmVsLCBtb2RlbCk7XG4gICAgICBpZiAobWFpbiAmJiBpc1Zpc2libGVBeGlzKG1haW4pKSB7XG4gICAgICAgIGF4aXNDb21wb25lbnQubWFpbiA9IG1haW47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGdyaWQgPSBwYXJzZUdyaWRBeGlzKGNoYW5uZWwsIG1vZGVsKTtcbiAgICAgIGlmIChncmlkICYmIGlzVmlzaWJsZUF4aXMoZ3JpZCkpIHtcbiAgICAgICAgYXhpc0NvbXBvbmVudC5ncmlkID0gZ3JpZDtcbiAgICAgIH1cblxuICAgICAgYXhpc1tjaGFubmVsXSA9IFtheGlzQ29tcG9uZW50XTtcbiAgICB9XG4gICAgcmV0dXJuIGF4aXM7XG4gIH0sIHt9IGFzIEF4aXNDb21wb25lbnRJbmRleCk7XG59XG5cbmNvbnN0IE9QUE9TSVRFX09SSUVOVDoge1tLIGluIEF4aXNPcmllbnRdOiBBeGlzT3JpZW50fSA9IHtcbiAgYm90dG9tOiAndG9wJyxcbiAgdG9wOiAnYm90dG9tJyxcbiAgbGVmdDogJ3JpZ2h0JyxcbiAgcmlnaHQ6ICdsZWZ0J1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTGF5ZXJBeGlzKG1vZGVsOiBMYXllck1vZGVsKSB7XG4gIGNvbnN0IHtheGVzLCByZXNvbHZlfSA9IG1vZGVsLmNvbXBvbmVudDtcbiAgY29uc3QgYXhpc0NvdW50OiB7XG4gICAgLy8gVXNpbmcgTWFwcGVkIFR5cGUgdG8gZGVjbGFyZSB0eXBlIChodHRwczovL3d3dy50eXBlc2NyaXB0bGFuZy5vcmcvZG9jcy9oYW5kYm9vay9hZHZhbmNlZC10eXBlcy5odG1sI21hcHBlZC10eXBlcylcbiAgICBbayBpbiBBeGlzT3JpZW50XTogbnVtYmVyXG4gIH0gPSB7dG9wOiAwLCBib3R0b206IDAsIHJpZ2h0OiAwLCBsZWZ0OiAwfTtcblxuICBmb3IgKGNvbnN0IGNoaWxkIG9mIG1vZGVsLmNoaWxkcmVuKSB7XG4gICAgY2hpbGQucGFyc2VBeGlzQW5kSGVhZGVyKCk7XG5cbiAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2Yga2V5cyhjaGlsZC5jb21wb25lbnQuYXhlcykpIHtcbiAgICAgIHJlc29sdmUuYXhpc1tjaGFubmVsXSA9IHBhcnNlR3VpZGVSZXNvbHZlKG1vZGVsLmNvbXBvbmVudC5yZXNvbHZlLCBjaGFubmVsKTtcbiAgICAgIGlmIChyZXNvbHZlLmF4aXNbY2hhbm5lbF0gPT09ICdzaGFyZWQnKSB7XG4gICAgICAgIC8vIElmIHRoZSByZXNvbHZlIHNheXMgc2hhcmVkIChhbmQgaGFzIG5vdCBiZWVuIG92ZXJyaWRkZW4pXG4gICAgICAgIC8vIFdlIHdpbGwgdHJ5IHRvIG1lcmdlIGFuZCBzZWUgaWYgdGhlcmUgaXMgYSBjb25mbGljdFxuXG4gICAgICAgIGF4ZXNbY2hhbm5lbF0gPSBtZXJnZUF4aXNDb21wb25lbnRzKGF4ZXNbY2hhbm5lbF0sIGNoaWxkLmNvbXBvbmVudC5heGVzW2NoYW5uZWxdKTtcblxuICAgICAgICBpZiAoIWF4ZXNbY2hhbm5lbF0pIHtcbiAgICAgICAgICAvLyBJZiBtZXJnZSByZXR1cm5zIG5vdGhpbmcsIHRoZXJlIGlzIGEgY29uZmxpY3Qgc28gd2UgY2Fubm90IG1ha2UgdGhlIGF4aXMgc2hhcmVkLlxuICAgICAgICAgIC8vIFRodXMsIG1hcmsgYXhpcyBhcyBpbmRlcGVuZGVudCBhbmQgcmVtb3ZlIHRoZSBheGlzIGNvbXBvbmVudC5cbiAgICAgICAgICByZXNvbHZlLmF4aXNbY2hhbm5lbF0gPSAnaW5kZXBlbmRlbnQnO1xuICAgICAgICAgIGRlbGV0ZSBheGVzW2NoYW5uZWxdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gTW92ZSBheGVzIHRvIGxheWVyJ3MgYXhpcyBjb21wb25lbnQgYW5kIG1lcmdlIHNoYXJlZCBheGVzXG4gIGZvciAoY29uc3QgY2hhbm5lbCBvZiBbJ3gnLCAneSddKSB7XG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBtb2RlbC5jaGlsZHJlbikge1xuICAgICAgaWYgKCFjaGlsZC5jb21wb25lbnQuYXhlc1tjaGFubmVsXSkge1xuICAgICAgICAvLyBza2lwIGlmIHRoZSBjaGlsZCBkb2VzIG5vdCBoYXZlIGEgcGFydGljdWxhciBheGlzXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVzb2x2ZS5heGlzW2NoYW5uZWxdID09PSAnaW5kZXBlbmRlbnQnKSB7XG4gICAgICAgIC8vIElmIGF4ZXMgYXJlIGluZGVwZW5kZW50LCBjb25jYXQgdGhlIGF4aXNDb21wb25lbnQgYXJyYXkuXG4gICAgICAgIGF4ZXNbY2hhbm5lbF0gPSAoYXhlc1tjaGFubmVsXSB8fCBbXSkuY29uY2F0KGNoaWxkLmNvbXBvbmVudC5heGVzW2NoYW5uZWxdKTtcblxuICAgICAgICAvLyBBdXRvbWF0aWNhbGx5IGFkanVzdCBvcmllbnRcbiAgICAgICAgZm9yIChjb25zdCBheGlzQ29tcG9uZW50IG9mIGNoaWxkLmNvbXBvbmVudC5heGVzW2NoYW5uZWxdKSB7XG4gICAgICAgICAgY29uc3Qge3ZhbHVlOiBvcmllbnQsIGV4cGxpY2l0fSA9IGF4aXNDb21wb25lbnQubWFpbi5nZXRXaXRoRXhwbGljaXQoJ29yaWVudCcpO1xuICAgICAgICAgIGlmIChheGlzQ291bnRbb3JpZW50XSA+IDAgJiYgIWV4cGxpY2l0KSB7XG4gICAgICAgICAgICAvLyBDaGFuZ2UgYXhpcyBvcmllbnQgaWYgdGhlIG51bWJlciBkbyBub3QgbWF0Y2hcbiAgICAgICAgICAgIGNvbnN0IG9wcG9zaXRlT3JpZW50ID0gT1BQT1NJVEVfT1JJRU5UW29yaWVudF07XG4gICAgICAgICAgICBpZiAoYXhpc0NvdW50W29yaWVudF0gPiBheGlzQ291bnRbb3Bwb3NpdGVPcmllbnRdKSB7XG4gICAgICAgICAgICAgIGF4aXNDb21wb25lbnQubWFpbi5zZXQoJ29yaWVudCcsIG9wcG9zaXRlT3JpZW50LCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGF4aXNDb3VudFtvcmllbnRdKys7XG5cbiAgICAgICAgICAvLyBUT0RPKGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EtbGl0ZS9pc3N1ZXMvMjYzNCk6IGF1dG9tYXRpY2FseSBhZGQgZXh0cmEgb2Zmc2V0P1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEFmdGVyIG1lcmdpbmcsIG1ha2Ugc3VyZSB0byByZW1vdmUgYXhlcyBmcm9tIGNoaWxkXG4gICAgICBkZWxldGUgY2hpbGQuY29tcG9uZW50LmF4ZXNbY2hhbm5lbF07XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG1lcmdlQXhpc0NvbXBvbmVudHMobWVyZ2VkQXhpc0NtcHRzOiBBeGlzQ29tcG9uZW50W10sIGNoaWxkQXhpc0NtcHRzOiBBeGlzQ29tcG9uZW50W10pOiBBeGlzQ29tcG9uZW50W10ge1xuICBpZiAobWVyZ2VkQXhpc0NtcHRzKSB7XG4gICAgaWYgKG1lcmdlZEF4aXNDbXB0cy5sZW5ndGggIT09IGNoaWxkQXhpc0NtcHRzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDsgLy8gQ2Fubm90IG1lcmdlIGF4aXMgY29tcG9uZW50IHdpdGggZGlmZmVyZW50IG51bWJlciBvZiBheGVzLlxuICAgIH1cbiAgICBjb25zdCBsZW5ndGggPSBtZXJnZWRBeGlzQ21wdHMubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoIDsgaSsrKSB7XG4gICAgICBjb25zdCBtZXJnZWRNYWluID0gbWVyZ2VkQXhpc0NtcHRzW2ldLm1haW47XG4gICAgICBjb25zdCBjaGlsZE1haW4gPSBjaGlsZEF4aXNDbXB0c1tpXS5tYWluO1xuXG4gICAgICBpZiAoKCEhbWVyZ2VkTWFpbikgIT09ICghIWNoaWxkTWFpbikpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH0gZWxzZSBpZiAobWVyZ2VkTWFpbiAmJiBjaGlsZE1haW4pIHtcbiAgICAgICAgY29uc3QgbWVyZ2VkT3JpZW50ID0gbWVyZ2VkTWFpbi5nZXRXaXRoRXhwbGljaXQoJ29yaWVudCcpO1xuICAgICAgICBjb25zdCBjaGlsZE9yaWVudCA9IGNoaWxkTWFpbi5nZXRXaXRoRXhwbGljaXQoJ29yaWVudCcpO1xuXG4gICAgICAgIGlmIChtZXJnZWRPcmllbnQuZXhwbGljaXQgJiYgY2hpbGRPcmllbnQuZXhwbGljaXQgJiYgbWVyZ2VkT3JpZW50LnZhbHVlICE9PSBjaGlsZE9yaWVudC52YWx1ZSkge1xuICAgICAgICAgIC8vIFRPRE86IHRocm93IHdhcm5pbmcgaWYgcmVzb2x2ZSBpcyBleHBsaWNpdCAoV2UgZG9uJ3QgaGF2ZSBpbmZvIGFib3V0IGV4cGxpY2l0L2ltcGxpY2l0IHJlc29sdmUgeWV0LilcbiAgICAgICAgICAvLyBDYW5ub3QgbWVyZ2UgZHVlIHRvIGluY29uc2lzdGVudCBvcmllbnRcbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1lcmdlZEF4aXNDbXB0c1tpXS5tYWluID0gbWVyZ2VBeGlzQ29tcG9uZW50UGFydChtZXJnZWRNYWluLCBjaGlsZE1haW4pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1lcmdlZEdyaWQgPSBtZXJnZWRBeGlzQ21wdHNbaV0uZ3JpZDtcbiAgICAgIGNvbnN0IGNoaWxkR3JpZCA9IGNoaWxkQXhpc0NtcHRzW2ldLmdyaWQ7XG4gICAgICBpZiAoKCEhbWVyZ2VkR3JpZCkgIT09ICghIWNoaWxkR3JpZCkpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH0gZWxzZSBpZiAobWVyZ2VkR3JpZCAmJiBjaGlsZEdyaWQpIHtcbiAgICAgICAgbWVyZ2VkQXhpc0NtcHRzW2ldLmdyaWQgPSBtZXJnZUF4aXNDb21wb25lbnRQYXJ0KG1lcmdlZEdyaWQsIGNoaWxkR3JpZCk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIEZvciBmaXJzdCBvbmUsIHJldHVybiBhIGNvcHkgb2YgdGhlIGNoaWxkXG4gICAgcmV0dXJuIGNoaWxkQXhpc0NtcHRzLm1hcChheGlzQ29tcG9uZW50ID0+ICh7XG4gICAgICAuLi4oYXhpc0NvbXBvbmVudC5tYWluID8ge21haW46IGF4aXNDb21wb25lbnQubWFpbi5jbG9uZSgpfSA6IHt9KSxcbiAgICAgIC4uLihheGlzQ29tcG9uZW50LmdyaWQgPyB7Z3JpZDogYXhpc0NvbXBvbmVudC5ncmlkLmNsb25lKCl9IDoge30pXG4gICAgfSkpO1xuICB9XG4gIHJldHVybiBtZXJnZWRBeGlzQ21wdHM7XG59XG5cbmZ1bmN0aW9uIG1lcmdlQXhpc0NvbXBvbmVudFBhcnQobWVyZ2VkOiBBeGlzQ29tcG9uZW50UGFydCwgY2hpbGQ6IEF4aXNDb21wb25lbnRQYXJ0KTogQXhpc0NvbXBvbmVudFBhcnQge1xuICBmb3IgKGNvbnN0IHByb3Agb2YgVkdfQVhJU19QUk9QRVJUSUVTKSB7XG4gICAgY29uc3QgbWVyZ2VkVmFsdWVXaXRoRXhwbGljaXQgPSBtZXJnZVZhbHVlc1dpdGhFeHBsaWNpdDxWZ0F4aXMsIGFueT4oXG4gICAgICBtZXJnZWQuZ2V0V2l0aEV4cGxpY2l0KHByb3ApLFxuICAgICAgY2hpbGQuZ2V0V2l0aEV4cGxpY2l0KHByb3ApLFxuICAgICAgcHJvcCwgJ2F4aXMnLFxuXG4gICAgICAvLyBUaWUgYnJlYWtlciBmdW5jdGlvblxuICAgICAgKHYxOiBFeHBsaWNpdDxhbnk+LCB2MjogRXhwbGljaXQ8YW55PikgPT4ge1xuICAgICAgICBzd2l0Y2ggKHByb3ApIHtcbiAgICAgICAgICBjYXNlICd0aXRsZSc6XG4gICAgICAgICAgICByZXR1cm4gdGl0bGVNZXJnZXIodjEsIHYyKTtcbiAgICAgICAgICBjYXNlICdncmlkU2NhbGUnOlxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgZXhwbGljaXQ6IHYxLmV4cGxpY2l0LCAvLyBrZWVwIHRoZSBvbGQgZXhwbGljaXRcbiAgICAgICAgICAgICAgdmFsdWU6IHYxLnZhbHVlIHx8IHYyLnZhbHVlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWZhdWx0VGllQnJlYWtlcjxWZ0F4aXMsIGFueT4odjEsIHYyLCBwcm9wLCAnYXhpcycpO1xuICAgICAgfVxuICAgICk7XG4gICAgbWVyZ2VkLnNldFdpdGhFeHBsaWNpdChwcm9wLCBtZXJnZWRWYWx1ZVdpdGhFeHBsaWNpdCk7XG4gIH1cbiAgcmV0dXJuIG1lcmdlZDtcbn1cblxuZnVuY3Rpb24gaXNGYWxzZU9yTnVsbCh2OiBib29sZWFuIHwgbnVsbCkge1xuICByZXR1cm4gdiA9PT0gZmFsc2UgfHwgdiA9PT0gbnVsbDtcbn1cblxuLyoqXG4gKiBSZXR1cm4gaWYgYW4gYXhpcyBpcyB2aXNpYmxlIChzaG93cyBhdCBsZWFzdCBvbmUgcGFydCBvZiB0aGUgYXhpcykuXG4gKi9cbmZ1bmN0aW9uIGlzVmlzaWJsZUF4aXMoYXhpczogQXhpc0NvbXBvbmVudFBhcnQpIHtcbiAgcmV0dXJuIHNvbWUoQVhJU19QQVJUUywgKHBhcnQpID0+IGhhc0F4aXNQYXJ0KGF4aXMsIHBhcnQpKTtcbn1cblxuZnVuY3Rpb24gaGFzQXhpc1BhcnQoYXhpczogQXhpc0NvbXBvbmVudFBhcnQsIHBhcnQ6IEF4aXNQYXJ0KSB7XG4gIC8vIEZJWE1FKGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EtbGl0ZS9pc3N1ZXMvMjU1MikgdGhpcyBtZXRob2QgY2FuIGJlIHdyb25nIGlmIHVzZXJzIHVzZSBhIFZlZ2EgdGhlbWUuXG5cbiAgaWYgKHBhcnQgPT09ICdheGlzJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKHBhcnQgPT09ICdncmlkJyB8fCBwYXJ0ID09PSAndGl0bGUnKSB7XG4gICAgcmV0dXJuICEhYXhpcy5nZXQocGFydCk7XG4gIH1cbiAgLy8gT3RoZXIgcGFydHMgYXJlIGVuYWJsZWQgYnkgZGVmYXVsdCwgc28gdGhleSBzaG91bGQgbm90IGJlIGZhbHNlIG9yIG51bGwuXG4gIHJldHVybiAhaXNGYWxzZU9yTnVsbChheGlzLmdldChwYXJ0KSk7XG59XG5cbi8qKlxuICogTWFrZSBhbiBpbm5lciBheGlzIGZvciBzaG93aW5nIGdyaWQgZm9yIHNoYXJlZCBheGlzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VHcmlkQXhpcyhjaGFubmVsOiBQb3NpdGlvblNjYWxlQ2hhbm5lbCwgbW9kZWw6IFVuaXRNb2RlbCk6IEF4aXNDb21wb25lbnRQYXJ0IHtcbiAgLy8gRklYTUU6IHN1cHBvcnQgYWRkaW5nIHRpY2tzIGZvciBncmlkIGF4aXMgdGhhdCBhcmUgaW5uZXIgYXhlcyBvZiBmYWNldGVkIHBsb3RzLlxuICByZXR1cm4gcGFyc2VBeGlzKGNoYW5uZWwsIG1vZGVsLCB0cnVlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTWFpbkF4aXMoY2hhbm5lbDogUG9zaXRpb25TY2FsZUNoYW5uZWwsIG1vZGVsOiBVbml0TW9kZWwpOiBBeGlzQ29tcG9uZW50UGFydCB7XG4gIHJldHVybiBwYXJzZUF4aXMoY2hhbm5lbCwgbW9kZWwsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VBeGlzKGNoYW5uZWw6IFBvc2l0aW9uU2NhbGVDaGFubmVsLCBtb2RlbDogVW5pdE1vZGVsLCBpc0dyaWRBeGlzOiBib29sZWFuKTogQXhpc0NvbXBvbmVudFBhcnQge1xuICBjb25zdCBheGlzID0gbW9kZWwuYXhpcyhjaGFubmVsKTtcblxuICBjb25zdCBheGlzQ29tcG9uZW50ID0gbmV3IEF4aXNDb21wb25lbnRQYXJ0KCk7XG5cbiAgLy8gMS4yLiBBZGQgcHJvcGVydGllc1xuICBWR19BWElTX1BST1BFUlRJRVMuZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgIGNvbnN0IHZhbHVlID0gZ2V0UHJvcGVydHkocHJvcGVydHksIGF4aXMsIGNoYW5uZWwsIG1vZGVsLCBpc0dyaWRBeGlzKTtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgZXhwbGljaXQgPVxuICAgICAgICAvLyBzcGVjaWZpZWQgYXhpcy52YWx1ZXMgaXMgYWxyZWFkeSByZXNwZWN0ZWQsIGJ1dCBtYXkgZ2V0IHRyYW5zZm9ybWVkLlxuICAgICAgICBwcm9wZXJ0eSA9PT0gJ3ZhbHVlcycgPyAhIWF4aXMudmFsdWVzIDpcbiAgICAgICAgLy8gYm90aCBWTCBheGlzLmVuY29kaW5nIGFuZCBheGlzLmxhYmVsQW5nbGUgYWZmZWN0IFZHIGF4aXMuZW5jb2RlXG4gICAgICAgIHByb3BlcnR5ID09PSAnZW5jb2RlJyA/ICEhYXhpcy5lbmNvZGluZyB8fCAhIWF4aXMubGFiZWxBbmdsZSA6XG4gICAgICAgIHZhbHVlID09PSBheGlzW3Byb3BlcnR5XTtcblxuICAgICAgY29uc3QgY29uZmlnVmFsdWUgPSBnZXRBeGlzQ29uZmlnKHByb3BlcnR5LCBtb2RlbC5jb25maWcsIGNoYW5uZWwsIGF4aXNDb21wb25lbnQuZ2V0KCdvcmllbnQnKSwgbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCkuZ2V0KCd0eXBlJykpO1xuXG4gICAgICBpZiAoXG4gICAgICAgIGV4cGxpY2l0IHx8IGNvbmZpZ1ZhbHVlID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgLy8gQSBsb3Qgb2YgcnVsZXMgbmVlZCB0byBiZSBhcHBsaWVkIGZvciB0aGUgZ3JpZCBheGlzXG4gICAgICAgIC8vIEZJWE1FOiB0aGlzIGlzIG5vdCBwZXJmZWN0bHkgY29ycmVjdCwgYnV0IHdlIG5lZWQgdG8gcmV3cml0ZSBheGlzIGNvbXBvbmVudCB0byBoYXZlIG9uZSBheGlzIGFuZCBzZXBhcmF0ZSB0aGVtIGxhdGVyIGR1cmluZyBhc3NlbWJseSBhbnl3YXkuXG4gICAgICAgIGlzR3JpZEF4aXNcbiAgICAgICkge1xuICAgICAgICAvLyBEbyBub3QgYXBwbHkgaW1wbGljaXQgcnVsZSBpZiB0aGVyZSBpcyBhIGNvbmZpZyB2YWx1ZVxuICAgICAgICBheGlzQ29tcG9uZW50LnNldChwcm9wZXJ0eSwgdmFsdWUsIGV4cGxpY2l0KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIC8vIDIpIEFkZCBndWlkZSBlbmNvZGUgZGVmaW5pdGlvbiBncm91cHNcbiAgY29uc3QgYXhpc0VuY29kaW5nID0gYXhpcy5lbmNvZGluZyB8fCB7fTtcbiAgY29uc3QgYXhpc0VuY29kZSA9IEFYSVNfUEFSVFMucmVkdWNlKChlOiBWZ0F4aXNFbmNvZGUsIHBhcnQpID0+IHtcbiAgICBpZiAoIWhhc0F4aXNQYXJ0KGF4aXNDb21wb25lbnQsIHBhcnQpKSB7XG4gICAgICAvLyBObyBuZWVkIHRvIGNyZWF0ZSBlbmNvZGUgZm9yIGEgZGlzYWJsZWQgcGFydC5cbiAgICAgIHJldHVybiBlO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlID0gcGFydCA9PT0gJ2xhYmVscycgP1xuICAgICAgZW5jb2RlLmxhYmVscyhtb2RlbCwgY2hhbm5lbCwgYXhpc0VuY29kaW5nLmxhYmVscyB8fCB7fSwgYXhpc0NvbXBvbmVudC5nZXQoJ29yaWVudCcpKSA6XG4gICAgICBheGlzRW5jb2RpbmdbcGFydF0gfHwge307XG5cbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCAmJiBrZXlzKHZhbHVlKS5sZW5ndGggPiAwKSB7XG4gICAgICBlW3BhcnRdID0ge3VwZGF0ZTogdmFsdWV9O1xuICAgIH1cbiAgICByZXR1cm4gZTtcbiAgfSwge30gYXMgVmdBeGlzRW5jb2RlKTtcblxuICAvLyBGSVhNRTogQnkgaGF2aW5nIGVuY29kZSBhcyBvbmUgcHJvcGVydHksIHdlIHdvbid0IGhhdmUgZmluZSBncmFpbmVkIGVuY29kZSBtZXJnaW5nLlxuICBpZiAoa2V5cyhheGlzRW5jb2RlKS5sZW5ndGggPiAwKSB7XG4gICAgYXhpc0NvbXBvbmVudC5zZXQoJ2VuY29kZScsIGF4aXNFbmNvZGUsICEhYXhpcy5lbmNvZGluZyB8fCAhIWF4aXMubGFiZWxBbmdsZSk7XG4gIH1cblxuICByZXR1cm4gYXhpc0NvbXBvbmVudDtcbn1cblxuZnVuY3Rpb24gZ2V0UHJvcGVydHk8SyBleHRlbmRzIGtleW9mIFZnQXhpcz4ocHJvcGVydHk6IEssIHNwZWNpZmllZEF4aXM6IEF4aXMsIGNoYW5uZWw6IFBvc2l0aW9uU2NhbGVDaGFubmVsLCBtb2RlbDogVW5pdE1vZGVsLCBpc0dyaWRBeGlzOiBib29sZWFuKTogVmdBeGlzW0tdIHtcbiAgY29uc3QgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcblxuICBpZiAoKGlzR3JpZEF4aXMgJiYgQVhJU19QUk9QRVJUWV9UWVBFW3Byb3BlcnR5XSA9PT0gJ21haW4nKSB8fFxuICAgICAgKCFpc0dyaWRBeGlzICYmIEFYSVNfUFJPUEVSVFlfVFlQRVtwcm9wZXJ0eV0gPT09ICdncmlkJykpIHtcbiAgICAvLyBEbyBub3QgYXBwbHkgdW5hcHBsaWNhYmxlIHByb3BlcnRpZXNcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgc3dpdGNoIChwcm9wZXJ0eSkge1xuICAgIGNhc2UgJ3NjYWxlJzpcbiAgICAgIHJldHVybiBtb2RlbC5zY2FsZU5hbWUoY2hhbm5lbCk7XG4gICAgY2FzZSAnZ3JpZFNjYWxlJzpcbiAgICAgIHJldHVybiBwcm9wZXJ0aWVzLmdyaWRTY2FsZShtb2RlbCwgY2hhbm5lbCwgaXNHcmlkQXhpcyk7XG5cbiAgICBjYXNlICdkb21haW4nOlxuICAgICAgcmV0dXJuIHByb3BlcnRpZXMuZG9tYWluKHByb3BlcnR5LCBzcGVjaWZpZWRBeGlzLCBpc0dyaWRBeGlzLCBjaGFubmVsKTtcbiAgICBjYXNlICdmb3JtYXQnOlxuICAgICAgLy8gV2UgZG9uJ3QgaW5jbHVkZSB0ZW1wb3JhbCBmaWVsZCBoZXJlIGFzIHdlIGFwcGx5IGZvcm1hdCBpbiBlbmNvZGUgYmxvY2tcbiAgICAgIHJldHVybiBudW1iZXJGb3JtYXQoZmllbGREZWYsIHNwZWNpZmllZEF4aXMuZm9ybWF0LCBtb2RlbC5jb25maWcpO1xuICAgIGNhc2UgJ2dyaWQnOiB7XG4gICAgICBjb25zdCBzY2FsZVR5cGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKS5nZXQoJ3R5cGUnKTtcbiAgICAgIHJldHVybiBnZXRTcGVjaWZpZWRPckRlZmF1bHRWYWx1ZShzcGVjaWZpZWRBeGlzLmdyaWQsIHByb3BlcnRpZXMuZ3JpZChzY2FsZVR5cGUsIGZpZWxkRGVmKSk7XG4gICAgfVxuICAgIGNhc2UgJ2xhYmVscyc6XG4gICAgICByZXR1cm4gaXNHcmlkQXhpcyA/IGZhbHNlIDogc3BlY2lmaWVkQXhpcy5sYWJlbHM7XG4gICAgY2FzZSAnbGFiZWxGbHVzaCc6XG4gICAgICByZXR1cm4gcHJvcGVydGllcy5sYWJlbEZsdXNoKGZpZWxkRGVmLCBjaGFubmVsLCBzcGVjaWZpZWRBeGlzLCBpc0dyaWRBeGlzKTtcbiAgICBjYXNlICdsYWJlbE92ZXJsYXAnOiB7XG4gICAgICBjb25zdCBzY2FsZVR5cGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKS5nZXQoJ3R5cGUnKTtcbiAgICAgIHJldHVybiBwcm9wZXJ0aWVzLmxhYmVsT3ZlcmxhcChmaWVsZERlZiwgc3BlY2lmaWVkQXhpcywgY2hhbm5lbCwgc2NhbGVUeXBlKTtcbiAgICB9XG4gICAgY2FzZSAnbWluRXh0ZW50Jzoge1xuICAgICAgcmV0dXJuIHByb3BlcnRpZXMubWluTWF4RXh0ZW50KHNwZWNpZmllZEF4aXMubWluRXh0ZW50LCBpc0dyaWRBeGlzKTtcbiAgICB9XG4gICAgY2FzZSAnbWF4RXh0ZW50Jzoge1xuICAgICAgcmV0dXJuIHByb3BlcnRpZXMubWluTWF4RXh0ZW50KHNwZWNpZmllZEF4aXMubWF4RXh0ZW50LCBpc0dyaWRBeGlzKTtcbiAgICB9XG4gICAgY2FzZSAnb3JpZW50JzpcbiAgICAgIHJldHVybiBnZXRTcGVjaWZpZWRPckRlZmF1bHRWYWx1ZShzcGVjaWZpZWRBeGlzLm9yaWVudCwgcHJvcGVydGllcy5vcmllbnQoY2hhbm5lbCkpO1xuICAgIGNhc2UgJ3RpY2tDb3VudCc6IHtcbiAgICAgIGNvbnN0IHNjYWxlVHlwZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpLmdldCgndHlwZScpO1xuICAgICAgY29uc3Qgc2l6ZVR5cGUgPSBjaGFubmVsID09PSAneCcgPyAnd2lkdGgnIDogY2hhbm5lbCA9PT0gJ3knID8gJ2hlaWdodCcgOiB1bmRlZmluZWQ7XG4gICAgICBjb25zdCBzaXplID0gc2l6ZVR5cGUgPyBtb2RlbC5nZXRTaXplU2lnbmFsUmVmKHNpemVUeXBlKVxuICAgICAgIDogdW5kZWZpbmVkO1xuICAgICAgcmV0dXJuIGdldFNwZWNpZmllZE9yRGVmYXVsdFZhbHVlKHNwZWNpZmllZEF4aXMudGlja0NvdW50LCBwcm9wZXJ0aWVzLnRpY2tDb3VudChjaGFubmVsLCBmaWVsZERlZiwgc2NhbGVUeXBlLCBzaXplKSk7XG4gICAgfVxuICAgIGNhc2UgJ3RpY2tzJzpcbiAgICAgIHJldHVybiBwcm9wZXJ0aWVzLnRpY2tzKHByb3BlcnR5LCBzcGVjaWZpZWRBeGlzLCBpc0dyaWRBeGlzLCBjaGFubmVsKTtcbiAgICBjYXNlICd0aXRsZSc6XG4gICAgICByZXR1cm4gZ2V0U3BlY2lmaWVkT3JEZWZhdWx0VmFsdWUoc3BlY2lmaWVkQXhpcy50aXRsZSwgcHJvcGVydGllcy50aXRsZShzcGVjaWZpZWRBeGlzLnRpdGxlTWF4TGVuZ3RoLCBmaWVsZERlZiwgbW9kZWwuY29uZmlnKSk7XG4gICAgY2FzZSAndmFsdWVzJzpcbiAgICAgIHJldHVybiBwcm9wZXJ0aWVzLnZhbHVlcyhzcGVjaWZpZWRBeGlzLCBtb2RlbCwgZmllbGREZWYpO1xuICAgIGNhc2UgJ3ppbmRleCc6XG4gICAgICByZXR1cm4gZ2V0U3BlY2lmaWVkT3JEZWZhdWx0VmFsdWUoc3BlY2lmaWVkQXhpcy56aW5kZXgsIHByb3BlcnRpZXMuemluZGV4KGlzR3JpZEF4aXMpKTtcbiAgfVxuICAvLyBPdGhlcndpc2UsIHJldHVybiBzcGVjaWZpZWQgcHJvcGVydHkuXG4gIHJldHVybiBpc0F4aXNQcm9wZXJ0eShwcm9wZXJ0eSkgPyBzcGVjaWZpZWRBeGlzW3Byb3BlcnR5XSA6IHVuZGVmaW5lZDtcbn1cbiJdfQ==