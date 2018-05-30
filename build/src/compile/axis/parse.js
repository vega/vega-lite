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
                    return common_1.mergeTitleComponent(v1, v2);
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
function getFieldDefTitle(model, channel) {
    var channel2 = channel === 'x' ? 'x2' : 'y2';
    var fieldDef = model.fieldDef(channel);
    var fieldDef2 = model.fieldDef(channel2);
    var title1 = fieldDef ? fieldDef.title : undefined;
    var title2 = fieldDef2 ? fieldDef2.title : undefined;
    if (title1 && title2) {
        return common_1.mergeTitle(title1, title2);
    }
    else if (title1) {
        return title1;
    }
    else if (title2) {
        return title2;
    }
    else if (title1 !== undefined) { // falsy value to disable config
        return title1;
    }
    else if (title2 !== undefined) { // falsy value to disable config
        return title2;
    }
    return undefined;
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
                    // title can be explicit if fieldDef.title is set
                    property === 'title' && value === getFieldDefTitle(model, channel) ? true :
                        // Otherwise, things are explicit if the returned value matches the specified property
                        value === axis[property];
            var configValue = config_1.getAxisConfig(property, model.config, channel, axisComponent.get('orient'), model.getScaleComponent(channel).get('type'));
            // only set property if it is explicitly set or has no config value (otherwise we will accidentally override config)
            if (explicit || configValue === undefined) {
                // Do not apply implicit rule if there is a config value
                axisComponent.set(property, value, explicit);
            }
            else if (property === 'grid' && configValue) {
                // Grid is an exception because we need to set grid = true to generate another grid axis
                axisComponent.set(property, configValue, false);
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
        var axisEncodingPart = common_1.guideEncodeEntry(axisEncoding[part] || {}, model);
        var value = part === 'labels' ?
            encode.labels(model, channel, axisEncodingPart, axisComponent.get('orient')) :
            axisEncodingPart;
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
            var fieldDefTitle = getFieldDefTitle(model, channel);
            var specifiedTitle = fieldDefTitle !== undefined ? fieldDefTitle :
                specifiedAxis.title === undefined ? undefined : specifiedAxis.title;
            return common_1.getSpecifiedOrDefaultValue(specifiedTitle, 
            // If title not specified, store base parts of fieldDef (and fieldDef2 if exists)
            common_1.mergeTitleFieldDefs([fielddef_1.toFieldDefBase(fieldDef)], fieldDef2 ? [fielddef_1.toFieldDefBase(fieldDef2)] : []));
        case 'values':
            return properties.values(specifiedAxis, model, fieldDef, channel);
    }
    // Otherwise, return specified property.
    return axis_1.isAxisProperty(property) ? specifiedAxis[property] : undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9heGlzL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQThGO0FBQzlGLHlDQUFrRjtBQUNsRiwyQ0FBNEQ7QUFDNUQsbUNBQWdDO0FBRWhDLG9DQUEySTtBQUUzSSxzQ0FBNkM7QUFDN0Msa0NBQThFO0FBRTlFLHlDQUFrRjtBQUNsRixtQ0FBdUM7QUFDdkMsaUNBQW1DO0FBQ25DLHlDQUEyQztBQUczQyx1QkFBOEIsS0FBZ0I7SUFDNUMsT0FBTyxpQ0FBdUIsQ0FBQyxNQUFNLENBQUMsVUFBUyxJQUFJLEVBQUUsT0FBTztRQUMxRCxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDMUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQzdDO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDLEVBQUUsRUFBd0IsQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFQRCxzQ0FPQztBQUVELElBQU0sZUFBZSxHQUFvQztJQUN2RCxNQUFNLEVBQUUsS0FBSztJQUNiLEdBQUcsRUFBRSxRQUFRO0lBQ2IsSUFBSSxFQUFFLE9BQU87SUFDYixLQUFLLEVBQUUsTUFBTTtDQUNkLENBQUM7QUFFRix3QkFBK0IsS0FBaUI7SUFDeEMsSUFBQSxvQkFBaUMsRUFBaEMsY0FBSSxFQUFFLG9CQUFPLENBQW9CO0lBQ3hDLElBQU0sU0FBUyxHQUdYLEVBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBQyxDQUFDO0lBRTNDLEtBQW9CLFVBQWMsRUFBZCxLQUFBLEtB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Q0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQzdDLENBQ0YsQ0FBQztRQUNKLEtBQUssUUFBUTtZQUNYLE9BQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUNyRTtJQUNELHdDQUF3QztJQUN4QyxPQUFPLHFCQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0FBQ3hFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0F4aXMsIEFYSVNfUEFSVFMsIEF4aXNFbmNvZGluZywgaXNBeGlzUHJvcGVydHksIFZHX0FYSVNfUFJPUEVSVElFU30gZnJvbSAnLi4vLi4vYXhpcyc7XG5pbXBvcnQge1BPU0lUSU9OX1NDQUxFX0NIQU5ORUxTLCBQb3NpdGlvblNjYWxlQ2hhbm5lbCwgWCwgWX0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge0ZpZWxkRGVmQmFzZSwgdG9GaWVsZERlZkJhc2V9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7a2V5c30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge0F4aXNPcmllbnQsIFZnQXhpcywgVmdBeGlzRW5jb2RlfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2dldFNwZWNpZmllZE9yRGVmYXVsdFZhbHVlLCBndWlkZUVuY29kZUVudHJ5LCBtZXJnZVRpdGxlLCBtZXJnZVRpdGxlQ29tcG9uZW50LCBtZXJnZVRpdGxlRmllbGREZWZzLCBudW1iZXJGb3JtYXR9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge0xheWVyTW9kZWx9IGZyb20gJy4uL2xheWVyJztcbmltcG9ydCB7cGFyc2VHdWlkZVJlc29sdmV9IGZyb20gJy4uL3Jlc29sdmUnO1xuaW1wb3J0IHtkZWZhdWx0VGllQnJlYWtlciwgRXhwbGljaXQsIG1lcmdlVmFsdWVzV2l0aEV4cGxpY2l0fSBmcm9tICcuLi9zcGxpdCc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQge0F4aXNDb21wb25lbnQsIEF4aXNDb21wb25lbnRJbmRleCwgQXhpc0NvbXBvbmVudFByb3BzfSBmcm9tICcuL2NvbXBvbmVudCc7XG5pbXBvcnQge2dldEF4aXNDb25maWd9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCAqIGFzIGVuY29kZSBmcm9tICcuL2VuY29kZSc7XG5pbXBvcnQgKiBhcyBwcm9wZXJ0aWVzIGZyb20gJy4vcHJvcGVydGllcyc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVW5pdEF4aXMobW9kZWw6IFVuaXRNb2RlbCk6IEF4aXNDb21wb25lbnRJbmRleCB7XG4gIHJldHVybiBQT1NJVElPTl9TQ0FMRV9DSEFOTkVMUy5yZWR1Y2UoZnVuY3Rpb24oYXhpcywgY2hhbm5lbCkge1xuICAgIGlmIChtb2RlbC5jb21wb25lbnQuc2NhbGVzW2NoYW5uZWxdICYmIG1vZGVsLmF4aXMoY2hhbm5lbCkpIHtcbiAgICAgIGF4aXNbY2hhbm5lbF0gPSBbcGFyc2VBeGlzKGNoYW5uZWwsIG1vZGVsKV07XG4gICAgfVxuICAgIHJldHVybiBheGlzO1xuICB9LCB7fSBhcyBBeGlzQ29tcG9uZW50SW5kZXgpO1xufVxuXG5jb25zdCBPUFBPU0lURV9PUklFTlQ6IHtbSyBpbiBBeGlzT3JpZW50XTogQXhpc09yaWVudH0gPSB7XG4gIGJvdHRvbTogJ3RvcCcsXG4gIHRvcDogJ2JvdHRvbScsXG4gIGxlZnQ6ICdyaWdodCcsXG4gIHJpZ2h0OiAnbGVmdCdcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUxheWVyQXhpcyhtb2RlbDogTGF5ZXJNb2RlbCkge1xuICBjb25zdCB7YXhlcywgcmVzb2x2ZX0gPSBtb2RlbC5jb21wb25lbnQ7XG4gIGNvbnN0IGF4aXNDb3VudDoge1xuICAgIC8vIFVzaW5nIE1hcHBlZCBUeXBlIHRvIGRlY2xhcmUgdHlwZSAoaHR0cHM6Ly93d3cudHlwZXNjcmlwdGxhbmcub3JnL2RvY3MvaGFuZGJvb2svYWR2YW5jZWQtdHlwZXMuaHRtbCNtYXBwZWQtdHlwZXMpXG4gICAgW2sgaW4gQXhpc09yaWVudF06IG51bWJlclxuICB9ID0ge3RvcDogMCwgYm90dG9tOiAwLCByaWdodDogMCwgbGVmdDogMH07XG5cbiAgZm9yIChjb25zdCBjaGlsZCBvZiBtb2RlbC5jaGlsZHJlbikge1xuICAgIGNoaWxkLnBhcnNlQXhpc0FuZEhlYWRlcigpO1xuXG4gICAgZm9yIChjb25zdCBjaGFubmVsIG9mIGtleXMoY2hpbGQuY29tcG9uZW50LmF4ZXMpKSB7XG4gICAgICByZXNvbHZlLmF4aXNbY2hhbm5lbF0gPSBwYXJzZUd1aWRlUmVzb2x2ZShtb2RlbC5jb21wb25lbnQucmVzb2x2ZSwgY2hhbm5lbCk7XG4gICAgICBpZiAocmVzb2x2ZS5heGlzW2NoYW5uZWxdID09PSAnc2hhcmVkJykge1xuICAgICAgICAvLyBJZiB0aGUgcmVzb2x2ZSBzYXlzIHNoYXJlZCAoYW5kIGhhcyBub3QgYmVlbiBvdmVycmlkZGVuKVxuICAgICAgICAvLyBXZSB3aWxsIHRyeSB0byBtZXJnZSBhbmQgc2VlIGlmIHRoZXJlIGlzIGEgY29uZmxpY3RcblxuICAgICAgICBheGVzW2NoYW5uZWxdID0gbWVyZ2VBeGlzQ29tcG9uZW50cyhheGVzW2NoYW5uZWxdLCBjaGlsZC5jb21wb25lbnQuYXhlc1tjaGFubmVsXSk7XG5cbiAgICAgICAgaWYgKCFheGVzW2NoYW5uZWxdKSB7XG4gICAgICAgICAgLy8gSWYgbWVyZ2UgcmV0dXJucyBub3RoaW5nLCB0aGVyZSBpcyBhIGNvbmZsaWN0IHNvIHdlIGNhbm5vdCBtYWtlIHRoZSBheGlzIHNoYXJlZC5cbiAgICAgICAgICAvLyBUaHVzLCBtYXJrIGF4aXMgYXMgaW5kZXBlbmRlbnQgYW5kIHJlbW92ZSB0aGUgYXhpcyBjb21wb25lbnQuXG4gICAgICAgICAgcmVzb2x2ZS5heGlzW2NoYW5uZWxdID0gJ2luZGVwZW5kZW50JztcbiAgICAgICAgICBkZWxldGUgYXhlc1tjaGFubmVsXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIE1vdmUgYXhlcyB0byBsYXllcidzIGF4aXMgY29tcG9uZW50IGFuZCBtZXJnZSBzaGFyZWQgYXhlc1xuICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgW1gsIFldKSB7XG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBtb2RlbC5jaGlsZHJlbikge1xuICAgICAgaWYgKCFjaGlsZC5jb21wb25lbnQuYXhlc1tjaGFubmVsXSkge1xuICAgICAgICAvLyBza2lwIGlmIHRoZSBjaGlsZCBkb2VzIG5vdCBoYXZlIGEgcGFydGljdWxhciBheGlzXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVzb2x2ZS5heGlzW2NoYW5uZWxdID09PSAnaW5kZXBlbmRlbnQnKSB7XG4gICAgICAgIC8vIElmIGF4ZXMgYXJlIGluZGVwZW5kZW50LCBjb25jYXQgdGhlIGF4aXNDb21wb25lbnQgYXJyYXkuXG4gICAgICAgIGF4ZXNbY2hhbm5lbF0gPSAoYXhlc1tjaGFubmVsXSB8fCBbXSkuY29uY2F0KGNoaWxkLmNvbXBvbmVudC5heGVzW2NoYW5uZWxdKTtcblxuICAgICAgICAvLyBBdXRvbWF0aWNhbGx5IGFkanVzdCBvcmllbnRcbiAgICAgICAgZm9yIChjb25zdCBheGlzQ29tcG9uZW50IG9mIGNoaWxkLmNvbXBvbmVudC5heGVzW2NoYW5uZWxdKSB7XG4gICAgICAgICAgY29uc3Qge3ZhbHVlOiBvcmllbnQsIGV4cGxpY2l0fSA9IGF4aXNDb21wb25lbnQuZ2V0V2l0aEV4cGxpY2l0KCdvcmllbnQnKTtcbiAgICAgICAgICBpZiAoYXhpc0NvdW50W29yaWVudF0gPiAwICYmICFleHBsaWNpdCkge1xuICAgICAgICAgICAgLy8gQ2hhbmdlIGF4aXMgb3JpZW50IGlmIHRoZSBudW1iZXIgZG8gbm90IG1hdGNoXG4gICAgICAgICAgICBjb25zdCBvcHBvc2l0ZU9yaWVudCA9IE9QUE9TSVRFX09SSUVOVFtvcmllbnRdO1xuICAgICAgICAgICAgaWYgKGF4aXNDb3VudFtvcmllbnRdID4gYXhpc0NvdW50W29wcG9zaXRlT3JpZW50XSkge1xuICAgICAgICAgICAgICBheGlzQ29tcG9uZW50LnNldCgnb3JpZW50Jywgb3Bwb3NpdGVPcmllbnQsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYXhpc0NvdW50W29yaWVudF0rKztcblxuICAgICAgICAgIC8vIFRPRE8oaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8yNjM0KTogYXV0b21hdGljYWx5IGFkZCBleHRyYSBvZmZzZXQ/XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gQWZ0ZXIgbWVyZ2luZywgbWFrZSBzdXJlIHRvIHJlbW92ZSBheGVzIGZyb20gY2hpbGRcbiAgICAgIGRlbGV0ZSBjaGlsZC5jb21wb25lbnQuYXhlc1tjaGFubmVsXTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gbWVyZ2VBeGlzQ29tcG9uZW50cyhtZXJnZWRBeGlzQ21wdHM6IEF4aXNDb21wb25lbnRbXSwgY2hpbGRBeGlzQ21wdHM6IEF4aXNDb21wb25lbnRbXSk6IEF4aXNDb21wb25lbnRbXSB7XG4gIGlmIChtZXJnZWRBeGlzQ21wdHMpIHtcbiAgICAvLyBGSVhNRTogdGhpcyBpcyBhIGJpdCB3cm9uZyBvbmNlIHdlIHN1cHBvcnQgbXVsdGlwbGUgYXhlc1xuICAgIGlmIChtZXJnZWRBeGlzQ21wdHMubGVuZ3RoICE9PSBjaGlsZEF4aXNDbXB0cy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7IC8vIENhbm5vdCBtZXJnZSBheGlzIGNvbXBvbmVudCB3aXRoIGRpZmZlcmVudCBudW1iZXIgb2YgYXhlcy5cbiAgICB9XG4gICAgY29uc3QgbGVuZ3RoID0gbWVyZ2VkQXhpc0NtcHRzLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aCA7IGkrKykge1xuICAgICAgY29uc3QgbWVyZ2VkID0gbWVyZ2VkQXhpc0NtcHRzW2ldO1xuICAgICAgY29uc3QgY2hpbGQgPSBjaGlsZEF4aXNDbXB0c1tpXTtcblxuICAgICAgaWYgKCghIW1lcmdlZCkgIT09ICghIWNoaWxkKSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSBlbHNlIGlmIChtZXJnZWQgJiYgY2hpbGQpIHtcbiAgICAgICAgY29uc3QgbWVyZ2VkT3JpZW50ID0gbWVyZ2VkLmdldFdpdGhFeHBsaWNpdCgnb3JpZW50Jyk7XG4gICAgICAgIGNvbnN0IGNoaWxkT3JpZW50ID0gY2hpbGQuZ2V0V2l0aEV4cGxpY2l0KCdvcmllbnQnKTtcblxuICAgICAgICBpZiAobWVyZ2VkT3JpZW50LmV4cGxpY2l0ICYmIGNoaWxkT3JpZW50LmV4cGxpY2l0ICYmIG1lcmdlZE9yaWVudC52YWx1ZSAhPT0gY2hpbGRPcmllbnQudmFsdWUpIHtcbiAgICAgICAgICAvLyBUT0RPOiB0aHJvdyB3YXJuaW5nIGlmIHJlc29sdmUgaXMgZXhwbGljaXQgKFdlIGRvbid0IGhhdmUgaW5mbyBhYm91dCBleHBsaWNpdC9pbXBsaWNpdCByZXNvbHZlIHlldC4pXG5cbiAgICAgICAgICAvLyBDYW5ub3QgbWVyZ2UgZHVlIHRvIGluY29uc2lzdGVudCBvcmllbnRcbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1lcmdlZEF4aXNDbXB0c1tpXSA9IG1lcmdlQXhpc0NvbXBvbmVudChtZXJnZWQsIGNoaWxkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBGb3IgZmlyc3Qgb25lLCByZXR1cm4gYSBjb3B5IG9mIHRoZSBjaGlsZFxuICAgIHJldHVybiBjaGlsZEF4aXNDbXB0cy5tYXAoYXhpc0NvbXBvbmVudCA9PiBheGlzQ29tcG9uZW50LmNsb25lKCkpO1xuICB9XG4gIHJldHVybiBtZXJnZWRBeGlzQ21wdHM7XG59XG5cbmZ1bmN0aW9uIG1lcmdlQXhpc0NvbXBvbmVudChtZXJnZWQ6IEF4aXNDb21wb25lbnQsIGNoaWxkOiBBeGlzQ29tcG9uZW50KTogQXhpc0NvbXBvbmVudCB7XG4gIGZvciAoY29uc3QgcHJvcCBvZiBWR19BWElTX1BST1BFUlRJRVMpIHtcbiAgICBjb25zdCBtZXJnZWRWYWx1ZVdpdGhFeHBsaWNpdCA9IG1lcmdlVmFsdWVzV2l0aEV4cGxpY2l0PFZnQXhpcywgYW55PihcbiAgICAgIG1lcmdlZC5nZXRXaXRoRXhwbGljaXQocHJvcCksXG4gICAgICBjaGlsZC5nZXRXaXRoRXhwbGljaXQocHJvcCksXG4gICAgICBwcm9wLCAnYXhpcycsXG5cbiAgICAgIC8vIFRpZSBicmVha2VyIGZ1bmN0aW9uXG4gICAgICAodjE6IEV4cGxpY2l0PGFueT4sIHYyOiBFeHBsaWNpdDxhbnk+KSA9PiB7XG4gICAgICAgIHN3aXRjaCAocHJvcCkge1xuICAgICAgICAgIGNhc2UgJ3RpdGxlJzpcbiAgICAgICAgICAgIHJldHVybiBtZXJnZVRpdGxlQ29tcG9uZW50KHYxLCB2Mik7XG4gICAgICAgICAgY2FzZSAnZ3JpZFNjYWxlJzpcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIGV4cGxpY2l0OiB2MS5leHBsaWNpdCwgLy8ga2VlcCB0aGUgb2xkIGV4cGxpY2l0XG4gICAgICAgICAgICAgIHZhbHVlOiB2MS52YWx1ZSB8fCB2Mi52YWx1ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmYXVsdFRpZUJyZWFrZXI8VmdBeGlzLCBhbnk+KHYxLCB2MiwgcHJvcCwgJ2F4aXMnKTtcbiAgICAgIH1cbiAgICApO1xuICAgIG1lcmdlZC5zZXRXaXRoRXhwbGljaXQocHJvcCwgbWVyZ2VkVmFsdWVXaXRoRXhwbGljaXQpO1xuICB9XG4gIHJldHVybiBtZXJnZWQ7XG59XG5cbmZ1bmN0aW9uIGdldEZpZWxkRGVmVGl0bGUobW9kZWw6IFVuaXRNb2RlbCwgY2hhbm5lbDogJ3gnIHwgJ3knKSB7XG4gIGNvbnN0IGNoYW5uZWwyID0gY2hhbm5lbCA9PT0gJ3gnID8gJ3gyJyA6ICd5Mic7XG4gIGNvbnN0IGZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCk7XG4gIGNvbnN0IGZpZWxkRGVmMiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwyKTtcblxuICBjb25zdCB0aXRsZTEgPSBmaWVsZERlZiA/IGZpZWxkRGVmLnRpdGxlIDogdW5kZWZpbmVkO1xuICBjb25zdCB0aXRsZTIgPSBmaWVsZERlZjIgPyBmaWVsZERlZjIudGl0bGUgOiB1bmRlZmluZWQ7XG5cbiAgaWYgKHRpdGxlMSAmJiB0aXRsZTIpIHtcbiAgICByZXR1cm4gbWVyZ2VUaXRsZSh0aXRsZTEsIHRpdGxlMik7XG4gIH0gZWxzZSBpZiAodGl0bGUxKSB7XG4gICAgcmV0dXJuIHRpdGxlMTtcbiAgfSBlbHNlIGlmICh0aXRsZTIpIHtcbiAgICByZXR1cm4gdGl0bGUyO1xuICB9IGVsc2UgaWYgKHRpdGxlMSAhPT0gdW5kZWZpbmVkKSB7IC8vIGZhbHN5IHZhbHVlIHRvIGRpc2FibGUgY29uZmlnXG4gICAgcmV0dXJuIHRpdGxlMTtcbiAgfSBlbHNlIGlmICh0aXRsZTIgIT09IHVuZGVmaW5lZCkgeyAvLyBmYWxzeSB2YWx1ZSB0byBkaXNhYmxlIGNvbmZpZ1xuICAgIHJldHVybiB0aXRsZTI7XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBwYXJzZUF4aXMoY2hhbm5lbDogUG9zaXRpb25TY2FsZUNoYW5uZWwsIG1vZGVsOiBVbml0TW9kZWwpOiBBeGlzQ29tcG9uZW50IHtcbiAgY29uc3QgYXhpcyA9IG1vZGVsLmF4aXMoY2hhbm5lbCk7XG5cbiAgY29uc3QgYXhpc0NvbXBvbmVudCA9IG5ldyBBeGlzQ29tcG9uZW50KCk7XG5cbiAgLy8gMS4yLiBBZGQgcHJvcGVydGllc1xuICBWR19BWElTX1BST1BFUlRJRVMuZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgIGNvbnN0IHZhbHVlID0gZ2V0UHJvcGVydHkocHJvcGVydHksIGF4aXMsIGNoYW5uZWwsIG1vZGVsKTtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgZXhwbGljaXQgPVxuICAgICAgICAvLyBzcGVjaWZpZWQgYXhpcy52YWx1ZXMgaXMgYWxyZWFkeSByZXNwZWN0ZWQsIGJ1dCBtYXkgZ2V0IHRyYW5zZm9ybWVkLlxuICAgICAgICBwcm9wZXJ0eSA9PT0gJ3ZhbHVlcycgPyAhIWF4aXMudmFsdWVzIDpcbiAgICAgICAgLy8gYm90aCBWTCBheGlzLmVuY29kaW5nIGFuZCBheGlzLmxhYmVsQW5nbGUgYWZmZWN0IFZHIGF4aXMuZW5jb2RlXG4gICAgICAgIHByb3BlcnR5ID09PSAnZW5jb2RlJyA/ICEhYXhpcy5lbmNvZGluZyB8fCAhIWF4aXMubGFiZWxBbmdsZSA6XG4gICAgICAgIC8vIHRpdGxlIGNhbiBiZSBleHBsaWNpdCBpZiBmaWVsZERlZi50aXRsZSBpcyBzZXRcbiAgICAgICAgICAgIHByb3BlcnR5ID09PSAndGl0bGUnICYmIHZhbHVlID09PSBnZXRGaWVsZERlZlRpdGxlKG1vZGVsLCBjaGFubmVsKSA/IHRydWUgOlxuICAgICAgICAvLyBPdGhlcndpc2UsIHRoaW5ncyBhcmUgZXhwbGljaXQgaWYgdGhlIHJldHVybmVkIHZhbHVlIG1hdGNoZXMgdGhlIHNwZWNpZmllZCBwcm9wZXJ0eVxuICAgICAgICB2YWx1ZSA9PT0gYXhpc1twcm9wZXJ0eV07XG5cbiAgICAgIGNvbnN0IGNvbmZpZ1ZhbHVlID0gZ2V0QXhpc0NvbmZpZyhwcm9wZXJ0eSwgbW9kZWwuY29uZmlnLCBjaGFubmVsLCBheGlzQ29tcG9uZW50LmdldCgnb3JpZW50JyksIG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpLmdldCgndHlwZScpKTtcblxuICAgICAgLy8gb25seSBzZXQgcHJvcGVydHkgaWYgaXQgaXMgZXhwbGljaXRseSBzZXQgb3IgaGFzIG5vIGNvbmZpZyB2YWx1ZSAob3RoZXJ3aXNlIHdlIHdpbGwgYWNjaWRlbnRhbGx5IG92ZXJyaWRlIGNvbmZpZylcbiAgICAgIGlmIChleHBsaWNpdCB8fCBjb25maWdWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIERvIG5vdCBhcHBseSBpbXBsaWNpdCBydWxlIGlmIHRoZXJlIGlzIGEgY29uZmlnIHZhbHVlXG4gICAgICAgIGF4aXNDb21wb25lbnQuc2V0KHByb3BlcnR5LCB2YWx1ZSwgZXhwbGljaXQpO1xuICAgICAgfSBlbHNlIGlmIChwcm9wZXJ0eSA9PT0gJ2dyaWQnICYmIGNvbmZpZ1ZhbHVlKSB7XG4gICAgICAgIC8vIEdyaWQgaXMgYW4gZXhjZXB0aW9uIGJlY2F1c2Ugd2UgbmVlZCB0byBzZXQgZ3JpZCA9IHRydWUgdG8gZ2VuZXJhdGUgYW5vdGhlciBncmlkIGF4aXNcbiAgICAgICAgYXhpc0NvbXBvbmVudC5zZXQocHJvcGVydHksIGNvbmZpZ1ZhbHVlLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvLyAyKSBBZGQgZ3VpZGUgZW5jb2RlIGRlZmluaXRpb24gZ3JvdXBzXG4gIGNvbnN0IGF4aXNFbmNvZGluZyA9IGF4aXMuZW5jb2RpbmcgfHwge307XG4gIGNvbnN0IGF4aXNFbmNvZGUgPSBBWElTX1BBUlRTLnJlZHVjZSgoZTogVmdBeGlzRW5jb2RlLCBwYXJ0KSA9PiB7XG4gICAgaWYgKCFheGlzQ29tcG9uZW50Lmhhc0F4aXNQYXJ0KHBhcnQpKSB7XG4gICAgICAvLyBObyBuZWVkIHRvIGNyZWF0ZSBlbmNvZGUgZm9yIGEgZGlzYWJsZWQgcGFydC5cbiAgICAgIHJldHVybiBlO1xuICAgIH1cblxuICAgIGNvbnN0IGF4aXNFbmNvZGluZ1BhcnQgPSBndWlkZUVuY29kZUVudHJ5KGF4aXNFbmNvZGluZ1twYXJ0XSB8fCB7fSwgbW9kZWwpO1xuXG4gICAgY29uc3QgdmFsdWUgPSBwYXJ0ID09PSAnbGFiZWxzJyA/XG4gICAgICBlbmNvZGUubGFiZWxzKG1vZGVsLCBjaGFubmVsLCBheGlzRW5jb2RpbmdQYXJ0LCBheGlzQ29tcG9uZW50LmdldCgnb3JpZW50JykpIDpcbiAgICAgIGF4aXNFbmNvZGluZ1BhcnQ7XG5cbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCAmJiBrZXlzKHZhbHVlKS5sZW5ndGggPiAwKSB7XG4gICAgICBlW3BhcnRdID0ge3VwZGF0ZTogdmFsdWV9O1xuICAgIH1cbiAgICByZXR1cm4gZTtcbiAgfSwge30gYXMgVmdBeGlzRW5jb2RlKTtcblxuICAvLyBGSVhNRTogQnkgaGF2aW5nIGVuY29kZSBhcyBvbmUgcHJvcGVydHksIHdlIHdvbid0IGhhdmUgZmluZSBncmFpbmVkIGVuY29kZSBtZXJnaW5nLlxuICBpZiAoa2V5cyhheGlzRW5jb2RlKS5sZW5ndGggPiAwKSB7XG4gICAgYXhpc0NvbXBvbmVudC5zZXQoJ2VuY29kZScsIGF4aXNFbmNvZGUsICEhYXhpcy5lbmNvZGluZyB8fCBheGlzLmxhYmVsQW5nbGUgIT09IHVuZGVmaW5lZCk7XG4gIH1cblxuICByZXR1cm4gYXhpc0NvbXBvbmVudDtcbn1cblxuZnVuY3Rpb24gZ2V0UHJvcGVydHk8SyBleHRlbmRzIGtleW9mIEF4aXNDb21wb25lbnRQcm9wcz4ocHJvcGVydHk6IEssIHNwZWNpZmllZEF4aXM6IEF4aXMsIGNoYW5uZWw6IFBvc2l0aW9uU2NhbGVDaGFubmVsLCBtb2RlbDogVW5pdE1vZGVsKTogQXhpc0NvbXBvbmVudFByb3BzW0tdIHtcbiAgY29uc3QgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcbiAgc3dpdGNoIChwcm9wZXJ0eSkge1xuICAgIGNhc2UgJ3NjYWxlJzpcbiAgICAgIHJldHVybiBtb2RlbC5zY2FsZU5hbWUoY2hhbm5lbCk7XG4gICAgY2FzZSAnZ3JpZFNjYWxlJzpcbiAgICAgIHJldHVybiBwcm9wZXJ0aWVzLmdyaWRTY2FsZShtb2RlbCwgY2hhbm5lbCk7XG4gICAgY2FzZSAnZm9ybWF0JzpcbiAgICAgIC8vIFdlIGRvbid0IGluY2x1ZGUgdGVtcG9yYWwgZmllbGQgaGVyZSBhcyB3ZSBhcHBseSBmb3JtYXQgaW4gZW5jb2RlIGJsb2NrXG4gICAgICByZXR1cm4gbnVtYmVyRm9ybWF0KGZpZWxkRGVmLCBzcGVjaWZpZWRBeGlzLmZvcm1hdCwgbW9kZWwuY29uZmlnKTtcbiAgICBjYXNlICdncmlkJzoge1xuICAgICAgY29uc3Qgc2NhbGVUeXBlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCkuZ2V0KCd0eXBlJyk7XG4gICAgICByZXR1cm4gZ2V0U3BlY2lmaWVkT3JEZWZhdWx0VmFsdWUoc3BlY2lmaWVkQXhpcy5ncmlkLCBwcm9wZXJ0aWVzLmdyaWQoc2NhbGVUeXBlLCBmaWVsZERlZikpO1xuICAgIH1cbiAgICBjYXNlICdsYWJlbEZsdXNoJzpcbiAgICAgIHJldHVybiBwcm9wZXJ0aWVzLmxhYmVsRmx1c2goZmllbGREZWYsIGNoYW5uZWwsIHNwZWNpZmllZEF4aXMpO1xuICAgIGNhc2UgJ2xhYmVsT3ZlcmxhcCc6IHtcbiAgICAgIGNvbnN0IHNjYWxlVHlwZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpLmdldCgndHlwZScpO1xuICAgICAgcmV0dXJuIHByb3BlcnRpZXMubGFiZWxPdmVybGFwKGZpZWxkRGVmLCBzcGVjaWZpZWRBeGlzLCBjaGFubmVsLCBzY2FsZVR5cGUpO1xuICAgIH1cbiAgICBjYXNlICdvcmllbnQnOlxuICAgICAgcmV0dXJuIGdldFNwZWNpZmllZE9yRGVmYXVsdFZhbHVlKHNwZWNpZmllZEF4aXMub3JpZW50LCBwcm9wZXJ0aWVzLm9yaWVudChjaGFubmVsKSk7XG4gICAgY2FzZSAndGlja0NvdW50Jzoge1xuICAgICAgY29uc3Qgc2NhbGVUeXBlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCkuZ2V0KCd0eXBlJyk7XG4gICAgICBjb25zdCBzaXplVHlwZSA9IGNoYW5uZWwgPT09ICd4JyA/ICd3aWR0aCcgOiBjaGFubmVsID09PSAneScgPyAnaGVpZ2h0JyA6IHVuZGVmaW5lZDtcbiAgICAgIGNvbnN0IHNpemUgPSBzaXplVHlwZSA/IG1vZGVsLmdldFNpemVTaWduYWxSZWYoc2l6ZVR5cGUpXG4gICAgICAgOiB1bmRlZmluZWQ7XG4gICAgICByZXR1cm4gZ2V0U3BlY2lmaWVkT3JEZWZhdWx0VmFsdWUoc3BlY2lmaWVkQXhpcy50aWNrQ291bnQsIHByb3BlcnRpZXMudGlja0NvdW50KGNoYW5uZWwsIGZpZWxkRGVmLCBzY2FsZVR5cGUsIHNpemUpKTtcbiAgICB9XG4gICAgY2FzZSAndGl0bGUnOlxuICAgICAgY29uc3QgY2hhbm5lbDIgPSBjaGFubmVsID09PSAneCcgPyAneDInIDogJ3kyJztcbiAgICAgIGNvbnN0IGZpZWxkRGVmMiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwyKTtcbiAgICAgIC8vIEtlZXAgdW5kZWZpbmVkIHNvIHdlIHVzZSBkZWZhdWx0IGlmIHRpdGxlIGlzIHVuc3BlY2lmaWVkLlxuICAgICAgLy8gRm9yIG90aGVyIGZhbHN5IHZhbHVlLCBrZWVwIHRoZW0gc28gd2Ugd2lsbCBoaWRlIHRoZSB0aXRsZS5cbiAgICAgIGNvbnN0IGZpZWxkRGVmVGl0bGUgPSBnZXRGaWVsZERlZlRpdGxlKG1vZGVsLCBjaGFubmVsKTtcbiAgICAgIGNvbnN0IHNwZWNpZmllZFRpdGxlID0gZmllbGREZWZUaXRsZSAhPT0gdW5kZWZpbmVkID8gZmllbGREZWZUaXRsZSA6XG4gICAgICAgIHNwZWNpZmllZEF4aXMudGl0bGUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IHNwZWNpZmllZEF4aXMudGl0bGU7XG5cbiAgICAgIHJldHVybiBnZXRTcGVjaWZpZWRPckRlZmF1bHRWYWx1ZTxzdHJpbmcgfCBGaWVsZERlZkJhc2U8c3RyaW5nPltdPihcbiAgICAgICAgc3BlY2lmaWVkVGl0bGUsXG4gICAgICAgIC8vIElmIHRpdGxlIG5vdCBzcGVjaWZpZWQsIHN0b3JlIGJhc2UgcGFydHMgb2YgZmllbGREZWYgKGFuZCBmaWVsZERlZjIgaWYgZXhpc3RzKVxuICAgICAgICBtZXJnZVRpdGxlRmllbGREZWZzKFxuICAgICAgICAgIFt0b0ZpZWxkRGVmQmFzZShmaWVsZERlZildLFxuICAgICAgICAgIGZpZWxkRGVmMiA/IFt0b0ZpZWxkRGVmQmFzZShmaWVsZERlZjIpXSA6IFtdXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgY2FzZSAndmFsdWVzJzpcbiAgICAgIHJldHVybiBwcm9wZXJ0aWVzLnZhbHVlcyhzcGVjaWZpZWRBeGlzLCBtb2RlbCwgZmllbGREZWYsIGNoYW5uZWwpO1xuICB9XG4gIC8vIE90aGVyd2lzZSwgcmV0dXJuIHNwZWNpZmllZCBwcm9wZXJ0eS5cbiAgcmV0dXJuIGlzQXhpc1Byb3BlcnR5KHByb3BlcnR5KSA/IHNwZWNpZmllZEF4aXNbcHJvcGVydHldIDogdW5kZWZpbmVkO1xufVxuIl19