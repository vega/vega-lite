"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axis_1 = require("../../axis");
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var util_1 = require("../../util");
var common_1 = require("../common");
var resolve_1 = require("../resolve");
var split_1 = require("../split");
var component_1 = require("./component");
var config_1 = require("./config");
var encode = require("./encode");
var properties = require("./properties");
function parseUnitAxis(model) {
    return channel_1.POSITION_SCALE_CHANNELS.reduce(function (axis, channel) {
        if (model.component.scales[channel] && model.axis(channel)) {
            axis[channel] = [parseAxis(channel, model)];
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
    for (var _e = 0, _f = [channel_1.X, channel_1.Y]; _e < _f.length; _e++) {
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
                    var _l = axisComponent.getWithExplicit('orient'), orient = _l.value, explicit = _l.explicit;
                    if (axisCount[orient] > 0 && !explicit) {
                        // Change axis orient if the number do not match
                        var oppositeOrient = OPPOSITE_ORIENT[orient];
                        if (axisCount[orient] > axisCount[oppositeOrient]) {
                            axisComponent.set('orient', oppositeOrient, false);
                        }
                    }
                    axisCount[orient]++;
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
        // FIXME: this is a bit wrong once we support multiple axes
        if (mergedAxisCmpts.length !== childAxisCmpts.length) {
            return undefined; // Cannot merge axis component with different number of axes.
        }
        var length_1 = mergedAxisCmpts.length;
        for (var i = 0; i < length_1; i++) {
            var merged = mergedAxisCmpts[i];
            var child = childAxisCmpts[i];
            if ((!!merged) !== (!!child)) {
                return undefined;
            }
            else if (merged && child) {
                var mergedOrient = merged.getWithExplicit('orient');
                var childOrient = child.getWithExplicit('orient');
                if (mergedOrient.explicit && childOrient.explicit && mergedOrient.value !== childOrient.value) {
                    // TODO: throw warning if resolve is explicit (We don't have info about explicit/implicit resolve yet.)
                    // Cannot merge due to inconsistent orient
                    return undefined;
                }
                else {
                    mergedAxisCmpts[i] = mergeAxisComponent(merged, child);
                }
            }
        }
    }
    else {
        // For first one, return a copy of the child
        return childAxisCmpts.map(function (axisComponent) { return axisComponent.clone(); });
    }
    return mergedAxisCmpts;
}
function mergeAxisComponent(merged, child) {
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
function parseAxis(channel, model) {
    var axis = model.axis(channel);
    var axisComponent = new component_1.AxisComponent();
    // 1.2. Add properties
    axis_1.VG_AXIS_PROPERTIES.forEach(function (property) {
        var value = getProperty(property, axis, channel, model);
        if (value !== undefined) {
            var explicit = 
            // specified axis.values is already respected, but may get transformed.
            property === 'values' ? !!axis.values :
                // both VL axis.encoding and axis.labelAngle affect VG axis.encode
                property === 'encode' ? !!axis.encoding || !!axis.labelAngle :
                    value === axis[property];
            var configValue = config_1.getAxisConfig(property, model.config, channel, axisComponent.get('orient'), model.getScaleComponent(channel).get('type'));
            // only set property if it is explicitly set or has no config value (otherwise we will accidentally override config)
            if (explicit || configValue === undefined) {
                // Do not apply implicit rule if there is a config value
                axisComponent.set(property, value, explicit);
            }
        }
    });
    // 2) Add guide encode definition groups
    var axisEncoding = axis.encoding || {};
    var axisEncode = axis_1.AXIS_PARTS.reduce(function (e, part) {
        if (!axisComponent.hasAxisPart(part)) {
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
        axisComponent.set('encode', axisEncode, !!axis.encoding || axis.labelAngle !== undefined);
    }
    return axisComponent;
}
function getProperty(property, specifiedAxis, channel, model) {
    var fieldDef = model.fieldDef(channel);
    switch (property) {
        case 'scale':
            return model.scaleName(channel);
        case 'gridScale':
            return properties.gridScale(model, channel);
        case 'format':
            // We don't include temporal field here as we apply format in encode block
            return common_1.numberFormat(fieldDef, specifiedAxis.format, model.config);
        case 'grid': {
            var scaleType = model.getScaleComponent(channel).get('type');
            return common_1.getSpecifiedOrDefaultValue(specifiedAxis.grid, properties.grid(scaleType, fieldDef));
        }
        case 'labelFlush':
            return properties.labelFlush(fieldDef, channel, specifiedAxis);
        case 'labelOverlap': {
            var scaleType = model.getScaleComponent(channel).get('type');
            return properties.labelOverlap(fieldDef, specifiedAxis, channel, scaleType);
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
        case 'title':
            var channel2 = channel === 'x' ? 'x2' : 'y2';
            var fieldDef2 = model.fieldDef(channel2);
            // Keep undefined so we use default if title is unspecified.
            // For other falsy value, keep them so we will hide the title.
            var specifiedTitle = fieldDef.title !== undefined ? fieldDef.title :
                specifiedAxis.title === undefined ? undefined : specifiedAxis.title;
            return common_1.getSpecifiedOrDefaultValue(specifiedTitle, 
            // If title not specified, store base parts of fieldDef (and fieldDef2 if exists)
            common_1.mergeTitleFieldDefs([fielddef_1.toFieldDefBase(fieldDef)], fieldDef2 ? [fielddef_1.toFieldDefBase(fieldDef2)] : []));
        case 'values':
            return properties.values(specifiedAxis, model, fieldDef);
    }
    // Otherwise, return specified property.
    return axis_1.isAxisProperty(property) ? specifiedAxis[property] : undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9heGlzL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQThGO0FBQzlGLHlDQUFrRjtBQUNsRiwyQ0FBNEQ7QUFDNUQsbUNBQWdDO0FBRWhDLG9DQUFxRztBQUVyRyxzQ0FBNkM7QUFDN0Msa0NBQThFO0FBRTlFLHlDQUFrRjtBQUNsRixtQ0FBdUM7QUFDdkMsaUNBQW1DO0FBQ25DLHlDQUEyQztBQUczQyx1QkFBOEIsS0FBZ0I7SUFDNUMsT0FBTyxpQ0FBdUIsQ0FBQyxNQUFNLENBQUMsVUFBUyxJQUFJLEVBQUUsT0FBTztRQUMxRCxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDMUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQzdDO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDLEVBQUUsRUFBd0IsQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFQRCxzQ0FPQztBQUVELElBQU0sZUFBZSxHQUFvQztJQUN2RCxNQUFNLEVBQUUsS0FBSztJQUNiLEdBQUcsRUFBRSxRQUFRO0lBQ2IsSUFBSSxFQUFFLE9BQU87SUFDYixLQUFLLEVBQUUsTUFBTTtDQUNkLENBQUM7QUFFRix3QkFBK0IsS0FBaUI7SUFDeEMsSUFBQSxvQkFBaUMsRUFBaEMsY0FBSSxFQUFFLG9CQUFPLENBQW9CO0lBQ3hDLElBQU0sU0FBUyxHQUdYLEVBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBQyxDQUFDO0lBRTNDLEtBQW9CLFVBQWMsRUFBZCxLQUFBLEtB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LFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQUN4RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBeGlzLCBBWElTX1BBUlRTLCBBeGlzRW5jb2RpbmcsIGlzQXhpc1Byb3BlcnR5LCBWR19BWElTX1BST1BFUlRJRVN9IGZyb20gJy4uLy4uL2F4aXMnO1xuaW1wb3J0IHtQT1NJVElPTl9TQ0FMRV9DSEFOTkVMUywgUG9zaXRpb25TY2FsZUNoYW5uZWwsIFgsIFl9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtGaWVsZERlZkJhc2UsIHRvRmllbGREZWZCYXNlfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQge2tleXN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtBeGlzT3JpZW50LCBWZ0F4aXMsIFZnQXhpc0VuY29kZX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtnZXRTcGVjaWZpZWRPckRlZmF1bHRWYWx1ZSwgbWVyZ2VUaXRsZUZpZWxkRGVmcywgbnVtYmVyRm9ybWF0LCB0aXRsZU1lcmdlcn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7TGF5ZXJNb2RlbH0gZnJvbSAnLi4vbGF5ZXInO1xuaW1wb3J0IHtwYXJzZUd1aWRlUmVzb2x2ZX0gZnJvbSAnLi4vcmVzb2x2ZSc7XG5pbXBvcnQge2RlZmF1bHRUaWVCcmVha2VyLCBFeHBsaWNpdCwgbWVyZ2VWYWx1ZXNXaXRoRXhwbGljaXR9IGZyb20gJy4uL3NwbGl0JztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCB7QXhpc0NvbXBvbmVudCwgQXhpc0NvbXBvbmVudEluZGV4LCBBeGlzQ29tcG9uZW50UHJvcHN9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7Z2V0QXhpc0NvbmZpZ30gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0ICogYXMgZW5jb2RlIGZyb20gJy4vZW5jb2RlJztcbmltcG9ydCAqIGFzIHByb3BlcnRpZXMgZnJvbSAnLi9wcm9wZXJ0aWVzJztcblxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VVbml0QXhpcyhtb2RlbDogVW5pdE1vZGVsKTogQXhpc0NvbXBvbmVudEluZGV4IHtcbiAgcmV0dXJuIFBPU0lUSU9OX1NDQUxFX0NIQU5ORUxTLnJlZHVjZShmdW5jdGlvbihheGlzLCBjaGFubmVsKSB7XG4gICAgaWYgKG1vZGVsLmNvbXBvbmVudC5zY2FsZXNbY2hhbm5lbF0gJiYgbW9kZWwuYXhpcyhjaGFubmVsKSkge1xuICAgICAgYXhpc1tjaGFubmVsXSA9IFtwYXJzZUF4aXMoY2hhbm5lbCwgbW9kZWwpXTtcbiAgICB9XG4gICAgcmV0dXJuIGF4aXM7XG4gIH0sIHt9IGFzIEF4aXNDb21wb25lbnRJbmRleCk7XG59XG5cbmNvbnN0IE9QUE9TSVRFX09SSUVOVDoge1tLIGluIEF4aXNPcmllbnRdOiBBeGlzT3JpZW50fSA9IHtcbiAgYm90dG9tOiAndG9wJyxcbiAgdG9wOiAnYm90dG9tJyxcbiAgbGVmdDogJ3JpZ2h0JyxcbiAgcmlnaHQ6ICdsZWZ0J1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTGF5ZXJBeGlzKG1vZGVsOiBMYXllck1vZGVsKSB7XG4gIGNvbnN0IHtheGVzLCByZXNvbHZlfSA9IG1vZGVsLmNvbXBvbmVudDtcbiAgY29uc3QgYXhpc0NvdW50OiB7XG4gICAgLy8gVXNpbmcgTWFwcGVkIFR5cGUgdG8gZGVjbGFyZSB0eXBlIChodHRwczovL3d3dy50eXBlc2NyaXB0bGFuZy5vcmcvZG9jcy9oYW5kYm9vay9hZHZhbmNlZC10eXBlcy5odG1sI21hcHBlZC10eXBlcylcbiAgICBbayBpbiBBeGlzT3JpZW50XTogbnVtYmVyXG4gIH0gPSB7dG9wOiAwLCBib3R0b206IDAsIHJpZ2h0OiAwLCBsZWZ0OiAwfTtcblxuICBmb3IgKGNvbnN0IGNoaWxkIG9mIG1vZGVsLmNoaWxkcmVuKSB7XG4gICAgY2hpbGQucGFyc2VBeGlzQW5kSGVhZGVyKCk7XG5cbiAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2Yga2V5cyhjaGlsZC5jb21wb25lbnQuYXhlcykpIHtcbiAgICAgIHJlc29sdmUuYXhpc1tjaGFubmVsXSA9IHBhcnNlR3VpZGVSZXNvbHZlKG1vZGVsLmNvbXBvbmVudC5yZXNvbHZlLCBjaGFubmVsKTtcbiAgICAgIGlmIChyZXNvbHZlLmF4aXNbY2hhbm5lbF0gPT09ICdzaGFyZWQnKSB7XG4gICAgICAgIC8vIElmIHRoZSByZXNvbHZlIHNheXMgc2hhcmVkIChhbmQgaGFzIG5vdCBiZWVuIG92ZXJyaWRkZW4pXG4gICAgICAgIC8vIFdlIHdpbGwgdHJ5IHRvIG1lcmdlIGFuZCBzZWUgaWYgdGhlcmUgaXMgYSBjb25mbGljdFxuXG4gICAgICAgIGF4ZXNbY2hhbm5lbF0gPSBtZXJnZUF4aXNDb21wb25lbnRzKGF4ZXNbY2hhbm5lbF0sIGNoaWxkLmNvbXBvbmVudC5heGVzW2NoYW5uZWxdKTtcblxuICAgICAgICBpZiAoIWF4ZXNbY2hhbm5lbF0pIHtcbiAgICAgICAgICAvLyBJZiBtZXJnZSByZXR1cm5zIG5vdGhpbmcsIHRoZXJlIGlzIGEgY29uZmxpY3Qgc28gd2UgY2Fubm90IG1ha2UgdGhlIGF4aXMgc2hhcmVkLlxuICAgICAgICAgIC8vIFRodXMsIG1hcmsgYXhpcyBhcyBpbmRlcGVuZGVudCBhbmQgcmVtb3ZlIHRoZSBheGlzIGNvbXBvbmVudC5cbiAgICAgICAgICByZXNvbHZlLmF4aXNbY2hhbm5lbF0gPSAnaW5kZXBlbmRlbnQnO1xuICAgICAgICAgIGRlbGV0ZSBheGVzW2NoYW5uZWxdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gTW92ZSBheGVzIHRvIGxheWVyJ3MgYXhpcyBjb21wb25lbnQgYW5kIG1lcmdlIHNoYXJlZCBheGVzXG4gIGZvciAoY29uc3QgY2hhbm5lbCBvZiBbWCwgWV0pIHtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIG1vZGVsLmNoaWxkcmVuKSB7XG4gICAgICBpZiAoIWNoaWxkLmNvbXBvbmVudC5heGVzW2NoYW5uZWxdKSB7XG4gICAgICAgIC8vIHNraXAgaWYgdGhlIGNoaWxkIGRvZXMgbm90IGhhdmUgYSBwYXJ0aWN1bGFyIGF4aXNcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXNvbHZlLmF4aXNbY2hhbm5lbF0gPT09ICdpbmRlcGVuZGVudCcpIHtcbiAgICAgICAgLy8gSWYgYXhlcyBhcmUgaW5kZXBlbmRlbnQsIGNvbmNhdCB0aGUgYXhpc0NvbXBvbmVudCBhcnJheS5cbiAgICAgICAgYXhlc1tjaGFubmVsXSA9IChheGVzW2NoYW5uZWxdIHx8IFtdKS5jb25jYXQoY2hpbGQuY29tcG9uZW50LmF4ZXNbY2hhbm5lbF0pO1xuXG4gICAgICAgIC8vIEF1dG9tYXRpY2FsbHkgYWRqdXN0IG9yaWVudFxuICAgICAgICBmb3IgKGNvbnN0IGF4aXNDb21wb25lbnQgb2YgY2hpbGQuY29tcG9uZW50LmF4ZXNbY2hhbm5lbF0pIHtcbiAgICAgICAgICBjb25zdCB7dmFsdWU6IG9yaWVudCwgZXhwbGljaXR9ID0gYXhpc0NvbXBvbmVudC5nZXRXaXRoRXhwbGljaXQoJ29yaWVudCcpO1xuICAgICAgICAgIGlmIChheGlzQ291bnRbb3JpZW50XSA+IDAgJiYgIWV4cGxpY2l0KSB7XG4gICAgICAgICAgICAvLyBDaGFuZ2UgYXhpcyBvcmllbnQgaWYgdGhlIG51bWJlciBkbyBub3QgbWF0Y2hcbiAgICAgICAgICAgIGNvbnN0IG9wcG9zaXRlT3JpZW50ID0gT1BQT1NJVEVfT1JJRU5UW29yaWVudF07XG4gICAgICAgICAgICBpZiAoYXhpc0NvdW50W29yaWVudF0gPiBheGlzQ291bnRbb3Bwb3NpdGVPcmllbnRdKSB7XG4gICAgICAgICAgICAgIGF4aXNDb21wb25lbnQuc2V0KCdvcmllbnQnLCBvcHBvc2l0ZU9yaWVudCwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBheGlzQ291bnRbb3JpZW50XSsrO1xuXG4gICAgICAgICAgLy8gVE9ETyhodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLWxpdGUvaXNzdWVzLzI2MzQpOiBhdXRvbWF0aWNhbHkgYWRkIGV4dHJhIG9mZnNldD9cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBBZnRlciBtZXJnaW5nLCBtYWtlIHN1cmUgdG8gcmVtb3ZlIGF4ZXMgZnJvbSBjaGlsZFxuICAgICAgZGVsZXRlIGNoaWxkLmNvbXBvbmVudC5heGVzW2NoYW5uZWxdO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBtZXJnZUF4aXNDb21wb25lbnRzKG1lcmdlZEF4aXNDbXB0czogQXhpc0NvbXBvbmVudFtdLCBjaGlsZEF4aXNDbXB0czogQXhpc0NvbXBvbmVudFtdKTogQXhpc0NvbXBvbmVudFtdIHtcbiAgaWYgKG1lcmdlZEF4aXNDbXB0cykge1xuICAgIC8vIEZJWE1FOiB0aGlzIGlzIGEgYml0IHdyb25nIG9uY2Ugd2Ugc3VwcG9ydCBtdWx0aXBsZSBheGVzXG4gICAgaWYgKG1lcmdlZEF4aXNDbXB0cy5sZW5ndGggIT09IGNoaWxkQXhpc0NtcHRzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDsgLy8gQ2Fubm90IG1lcmdlIGF4aXMgY29tcG9uZW50IHdpdGggZGlmZmVyZW50IG51bWJlciBvZiBheGVzLlxuICAgIH1cbiAgICBjb25zdCBsZW5ndGggPSBtZXJnZWRBeGlzQ21wdHMubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoIDsgaSsrKSB7XG4gICAgICBjb25zdCBtZXJnZWQgPSBtZXJnZWRBeGlzQ21wdHNbaV07XG4gICAgICBjb25zdCBjaGlsZCA9IGNoaWxkQXhpc0NtcHRzW2ldO1xuXG4gICAgICBpZiAoKCEhbWVyZ2VkKSAhPT0gKCEhY2hpbGQpKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9IGVsc2UgaWYgKG1lcmdlZCAmJiBjaGlsZCkge1xuICAgICAgICBjb25zdCBtZXJnZWRPcmllbnQgPSBtZXJnZWQuZ2V0V2l0aEV4cGxpY2l0KCdvcmllbnQnKTtcbiAgICAgICAgY29uc3QgY2hpbGRPcmllbnQgPSBjaGlsZC5nZXRXaXRoRXhwbGljaXQoJ29yaWVudCcpO1xuXG4gICAgICAgIGlmIChtZXJnZWRPcmllbnQuZXhwbGljaXQgJiYgY2hpbGRPcmllbnQuZXhwbGljaXQgJiYgbWVyZ2VkT3JpZW50LnZhbHVlICE9PSBjaGlsZE9yaWVudC52YWx1ZSkge1xuICAgICAgICAgIC8vIFRPRE86IHRocm93IHdhcm5pbmcgaWYgcmVzb2x2ZSBpcyBleHBsaWNpdCAoV2UgZG9uJ3QgaGF2ZSBpbmZvIGFib3V0IGV4cGxpY2l0L2ltcGxpY2l0IHJlc29sdmUgeWV0LilcblxuICAgICAgICAgIC8vIENhbm5vdCBtZXJnZSBkdWUgdG8gaW5jb25zaXN0ZW50IG9yaWVudFxuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWVyZ2VkQXhpc0NtcHRzW2ldID0gbWVyZ2VBeGlzQ29tcG9uZW50KG1lcmdlZCwgY2hpbGQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIEZvciBmaXJzdCBvbmUsIHJldHVybiBhIGNvcHkgb2YgdGhlIGNoaWxkXG4gICAgcmV0dXJuIGNoaWxkQXhpc0NtcHRzLm1hcChheGlzQ29tcG9uZW50ID0+IGF4aXNDb21wb25lbnQuY2xvbmUoKSk7XG4gIH1cbiAgcmV0dXJuIG1lcmdlZEF4aXNDbXB0cztcbn1cblxuZnVuY3Rpb24gbWVyZ2VBeGlzQ29tcG9uZW50KG1lcmdlZDogQXhpc0NvbXBvbmVudCwgY2hpbGQ6IEF4aXNDb21wb25lbnQpOiBBeGlzQ29tcG9uZW50IHtcbiAgZm9yIChjb25zdCBwcm9wIG9mIFZHX0FYSVNfUFJPUEVSVElFUykge1xuICAgIGNvbnN0IG1lcmdlZFZhbHVlV2l0aEV4cGxpY2l0ID0gbWVyZ2VWYWx1ZXNXaXRoRXhwbGljaXQ8VmdBeGlzLCBhbnk+KFxuICAgICAgbWVyZ2VkLmdldFdpdGhFeHBsaWNpdChwcm9wKSxcbiAgICAgIGNoaWxkLmdldFdpdGhFeHBsaWNpdChwcm9wKSxcbiAgICAgIHByb3AsICdheGlzJyxcblxuICAgICAgLy8gVGllIGJyZWFrZXIgZnVuY3Rpb25cbiAgICAgICh2MTogRXhwbGljaXQ8YW55PiwgdjI6IEV4cGxpY2l0PGFueT4pID0+IHtcbiAgICAgICAgc3dpdGNoIChwcm9wKSB7XG4gICAgICAgICAgY2FzZSAndGl0bGUnOlxuICAgICAgICAgICAgcmV0dXJuIHRpdGxlTWVyZ2VyKHYxLCB2Mik7XG4gICAgICAgICAgY2FzZSAnZ3JpZFNjYWxlJzpcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIGV4cGxpY2l0OiB2MS5leHBsaWNpdCwgLy8ga2VlcCB0aGUgb2xkIGV4cGxpY2l0XG4gICAgICAgICAgICAgIHZhbHVlOiB2MS52YWx1ZSB8fCB2Mi52YWx1ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmYXVsdFRpZUJyZWFrZXI8VmdBeGlzLCBhbnk+KHYxLCB2MiwgcHJvcCwgJ2F4aXMnKTtcbiAgICAgIH1cbiAgICApO1xuICAgIG1lcmdlZC5zZXRXaXRoRXhwbGljaXQocHJvcCwgbWVyZ2VkVmFsdWVXaXRoRXhwbGljaXQpO1xuICB9XG4gIHJldHVybiBtZXJnZWQ7XG59XG5cblxuZnVuY3Rpb24gcGFyc2VBeGlzKGNoYW5uZWw6IFBvc2l0aW9uU2NhbGVDaGFubmVsLCBtb2RlbDogVW5pdE1vZGVsKTogQXhpc0NvbXBvbmVudCB7XG4gIGNvbnN0IGF4aXMgPSBtb2RlbC5heGlzKGNoYW5uZWwpO1xuXG4gIGNvbnN0IGF4aXNDb21wb25lbnQgPSBuZXcgQXhpc0NvbXBvbmVudCgpO1xuXG4gIC8vIDEuMi4gQWRkIHByb3BlcnRpZXNcbiAgVkdfQVhJU19QUk9QRVJUSUVTLmZvckVhY2goZnVuY3Rpb24ocHJvcGVydHkpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGdldFByb3BlcnR5KHByb3BlcnR5LCBheGlzLCBjaGFubmVsLCBtb2RlbCk7XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IGV4cGxpY2l0ID1cbiAgICAgICAgLy8gc3BlY2lmaWVkIGF4aXMudmFsdWVzIGlzIGFscmVhZHkgcmVzcGVjdGVkLCBidXQgbWF5IGdldCB0cmFuc2Zvcm1lZC5cbiAgICAgICAgcHJvcGVydHkgPT09ICd2YWx1ZXMnID8gISFheGlzLnZhbHVlcyA6XG4gICAgICAgIC8vIGJvdGggVkwgYXhpcy5lbmNvZGluZyBhbmQgYXhpcy5sYWJlbEFuZ2xlIGFmZmVjdCBWRyBheGlzLmVuY29kZVxuICAgICAgICBwcm9wZXJ0eSA9PT0gJ2VuY29kZScgPyAhIWF4aXMuZW5jb2RpbmcgfHwgISFheGlzLmxhYmVsQW5nbGUgOlxuICAgICAgICB2YWx1ZSA9PT0gYXhpc1twcm9wZXJ0eV07XG5cbiAgICAgIGNvbnN0IGNvbmZpZ1ZhbHVlID0gZ2V0QXhpc0NvbmZpZyhwcm9wZXJ0eSwgbW9kZWwuY29uZmlnLCBjaGFubmVsLCBheGlzQ29tcG9uZW50LmdldCgnb3JpZW50JyksIG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpLmdldCgndHlwZScpKTtcblxuICAgICAgLy8gb25seSBzZXQgcHJvcGVydHkgaWYgaXQgaXMgZXhwbGljaXRseSBzZXQgb3IgaGFzIG5vIGNvbmZpZyB2YWx1ZSAob3RoZXJ3aXNlIHdlIHdpbGwgYWNjaWRlbnRhbGx5IG92ZXJyaWRlIGNvbmZpZylcbiAgICAgIGlmIChleHBsaWNpdCB8fCBjb25maWdWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIERvIG5vdCBhcHBseSBpbXBsaWNpdCBydWxlIGlmIHRoZXJlIGlzIGEgY29uZmlnIHZhbHVlXG4gICAgICAgIGF4aXNDb21wb25lbnQuc2V0KHByb3BlcnR5LCB2YWx1ZSwgZXhwbGljaXQpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgLy8gMikgQWRkIGd1aWRlIGVuY29kZSBkZWZpbml0aW9uIGdyb3Vwc1xuICBjb25zdCBheGlzRW5jb2RpbmcgPSBheGlzLmVuY29kaW5nIHx8IHt9O1xuICBjb25zdCBheGlzRW5jb2RlID0gQVhJU19QQVJUUy5yZWR1Y2UoKGU6IFZnQXhpc0VuY29kZSwgcGFydCkgPT4ge1xuICAgIGlmICghYXhpc0NvbXBvbmVudC5oYXNBeGlzUGFydChwYXJ0KSkge1xuICAgICAgLy8gTm8gbmVlZCB0byBjcmVhdGUgZW5jb2RlIGZvciBhIGRpc2FibGVkIHBhcnQuXG4gICAgICByZXR1cm4gZTtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZSA9IHBhcnQgPT09ICdsYWJlbHMnID9cbiAgICAgIGVuY29kZS5sYWJlbHMobW9kZWwsIGNoYW5uZWwsIGF4aXNFbmNvZGluZy5sYWJlbHMgfHwge30sIGF4aXNDb21wb25lbnQuZ2V0KCdvcmllbnQnKSkgOlxuICAgICAgYXhpc0VuY29kaW5nW3BhcnRdIHx8IHt9O1xuXG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQgJiYga2V5cyh2YWx1ZSkubGVuZ3RoID4gMCkge1xuICAgICAgZVtwYXJ0XSA9IHt1cGRhdGU6IHZhbHVlfTtcbiAgICB9XG4gICAgcmV0dXJuIGU7XG4gIH0sIHt9IGFzIFZnQXhpc0VuY29kZSk7XG5cbiAgLy8gRklYTUU6IEJ5IGhhdmluZyBlbmNvZGUgYXMgb25lIHByb3BlcnR5LCB3ZSB3b24ndCBoYXZlIGZpbmUgZ3JhaW5lZCBlbmNvZGUgbWVyZ2luZy5cbiAgaWYgKGtleXMoYXhpc0VuY29kZSkubGVuZ3RoID4gMCkge1xuICAgIGF4aXNDb21wb25lbnQuc2V0KCdlbmNvZGUnLCBheGlzRW5jb2RlLCAhIWF4aXMuZW5jb2RpbmcgfHwgYXhpcy5sYWJlbEFuZ2xlICE9PSB1bmRlZmluZWQpO1xuICB9XG5cbiAgcmV0dXJuIGF4aXNDb21wb25lbnQ7XG59XG5cbmZ1bmN0aW9uIGdldFByb3BlcnR5PEsgZXh0ZW5kcyBrZXlvZiBBeGlzQ29tcG9uZW50UHJvcHM+KHByb3BlcnR5OiBLLCBzcGVjaWZpZWRBeGlzOiBBeGlzLCBjaGFubmVsOiBQb3NpdGlvblNjYWxlQ2hhbm5lbCwgbW9kZWw6IFVuaXRNb2RlbCk6IEF4aXNDb21wb25lbnRQcm9wc1tLXSB7XG4gIGNvbnN0IGZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCk7XG4gIHN3aXRjaCAocHJvcGVydHkpIHtcbiAgICBjYXNlICdzY2FsZSc6XG4gICAgICByZXR1cm4gbW9kZWwuc2NhbGVOYW1lKGNoYW5uZWwpO1xuICAgIGNhc2UgJ2dyaWRTY2FsZSc6XG4gICAgICByZXR1cm4gcHJvcGVydGllcy5ncmlkU2NhbGUobW9kZWwsIGNoYW5uZWwpO1xuICAgIGNhc2UgJ2Zvcm1hdCc6XG4gICAgICAvLyBXZSBkb24ndCBpbmNsdWRlIHRlbXBvcmFsIGZpZWxkIGhlcmUgYXMgd2UgYXBwbHkgZm9ybWF0IGluIGVuY29kZSBibG9ja1xuICAgICAgcmV0dXJuIG51bWJlckZvcm1hdChmaWVsZERlZiwgc3BlY2lmaWVkQXhpcy5mb3JtYXQsIG1vZGVsLmNvbmZpZyk7XG4gICAgY2FzZSAnZ3JpZCc6IHtcbiAgICAgIGNvbnN0IHNjYWxlVHlwZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpLmdldCgndHlwZScpO1xuICAgICAgcmV0dXJuIGdldFNwZWNpZmllZE9yRGVmYXVsdFZhbHVlKHNwZWNpZmllZEF4aXMuZ3JpZCwgcHJvcGVydGllcy5ncmlkKHNjYWxlVHlwZSwgZmllbGREZWYpKTtcbiAgICB9XG4gICAgY2FzZSAnbGFiZWxGbHVzaCc6XG4gICAgICByZXR1cm4gcHJvcGVydGllcy5sYWJlbEZsdXNoKGZpZWxkRGVmLCBjaGFubmVsLCBzcGVjaWZpZWRBeGlzKTtcbiAgICBjYXNlICdsYWJlbE92ZXJsYXAnOiB7XG4gICAgICBjb25zdCBzY2FsZVR5cGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKS5nZXQoJ3R5cGUnKTtcbiAgICAgIHJldHVybiBwcm9wZXJ0aWVzLmxhYmVsT3ZlcmxhcChmaWVsZERlZiwgc3BlY2lmaWVkQXhpcywgY2hhbm5lbCwgc2NhbGVUeXBlKTtcbiAgICB9XG4gICAgY2FzZSAnb3JpZW50JzpcbiAgICAgIHJldHVybiBnZXRTcGVjaWZpZWRPckRlZmF1bHRWYWx1ZShzcGVjaWZpZWRBeGlzLm9yaWVudCwgcHJvcGVydGllcy5vcmllbnQoY2hhbm5lbCkpO1xuICAgIGNhc2UgJ3RpY2tDb3VudCc6IHtcbiAgICAgIGNvbnN0IHNjYWxlVHlwZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpLmdldCgndHlwZScpO1xuICAgICAgY29uc3Qgc2l6ZVR5cGUgPSBjaGFubmVsID09PSAneCcgPyAnd2lkdGgnIDogY2hhbm5lbCA9PT0gJ3knID8gJ2hlaWdodCcgOiB1bmRlZmluZWQ7XG4gICAgICBjb25zdCBzaXplID0gc2l6ZVR5cGUgPyBtb2RlbC5nZXRTaXplU2lnbmFsUmVmKHNpemVUeXBlKVxuICAgICAgIDogdW5kZWZpbmVkO1xuICAgICAgcmV0dXJuIGdldFNwZWNpZmllZE9yRGVmYXVsdFZhbHVlKHNwZWNpZmllZEF4aXMudGlja0NvdW50LCBwcm9wZXJ0aWVzLnRpY2tDb3VudChjaGFubmVsLCBmaWVsZERlZiwgc2NhbGVUeXBlLCBzaXplKSk7XG4gICAgfVxuICAgIGNhc2UgJ3RpdGxlJzpcbiAgICAgIGNvbnN0IGNoYW5uZWwyID0gY2hhbm5lbCA9PT0gJ3gnID8gJ3gyJyA6ICd5Mic7XG4gICAgICBjb25zdCBmaWVsZERlZjIgPSBtb2RlbC5maWVsZERlZihjaGFubmVsMik7XG4gICAgICAvLyBLZWVwIHVuZGVmaW5lZCBzbyB3ZSB1c2UgZGVmYXVsdCBpZiB0aXRsZSBpcyB1bnNwZWNpZmllZC5cbiAgICAgIC8vIEZvciBvdGhlciBmYWxzeSB2YWx1ZSwga2VlcCB0aGVtIHNvIHdlIHdpbGwgaGlkZSB0aGUgdGl0bGUuXG4gICAgICBjb25zdCBzcGVjaWZpZWRUaXRsZSA9IGZpZWxkRGVmLnRpdGxlICE9PSB1bmRlZmluZWQgPyBmaWVsZERlZi50aXRsZSA6XG4gICAgICAgIHNwZWNpZmllZEF4aXMudGl0bGUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IHNwZWNpZmllZEF4aXMudGl0bGU7XG5cbiAgICAgIHJldHVybiBnZXRTcGVjaWZpZWRPckRlZmF1bHRWYWx1ZTxzdHJpbmcgfCBGaWVsZERlZkJhc2U8c3RyaW5nPltdPihcbiAgICAgICAgc3BlY2lmaWVkVGl0bGUsXG4gICAgICAgIC8vIElmIHRpdGxlIG5vdCBzcGVjaWZpZWQsIHN0b3JlIGJhc2UgcGFydHMgb2YgZmllbGREZWYgKGFuZCBmaWVsZERlZjIgaWYgZXhpc3RzKVxuICAgICAgICBtZXJnZVRpdGxlRmllbGREZWZzKFxuICAgICAgICAgIFt0b0ZpZWxkRGVmQmFzZShmaWVsZERlZildLFxuICAgICAgICAgIGZpZWxkRGVmMiA/IFt0b0ZpZWxkRGVmQmFzZShmaWVsZERlZjIpXSA6IFtdXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgY2FzZSAndmFsdWVzJzpcbiAgICAgIHJldHVybiBwcm9wZXJ0aWVzLnZhbHVlcyhzcGVjaWZpZWRBeGlzLCBtb2RlbCwgZmllbGREZWYpO1xuICB9XG4gIC8vIE90aGVyd2lzZSwgcmV0dXJuIHNwZWNpZmllZCBwcm9wZXJ0eS5cbiAgcmV0dXJuIGlzQXhpc1Byb3BlcnR5KHByb3BlcnR5KSA/IHNwZWNpZmllZEF4aXNbcHJvcGVydHldIDogdW5kZWZpbmVkO1xufVxuIl19