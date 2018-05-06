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
            return properties.values(specifiedAxis, model, fieldDef, channel);
    }
    // Otherwise, return specified property.
    return axis_1.isAxisProperty(property) ? specifiedAxis[property] : undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9heGlzL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQThGO0FBQzlGLHlDQUFrRjtBQUNsRiwyQ0FBNEQ7QUFDNUQsbUNBQWdDO0FBRWhDLG9DQUFxRztBQUVyRyxzQ0FBNkM7QUFDN0Msa0NBQThFO0FBRTlFLHlDQUFrRjtBQUNsRixtQ0FBdUM7QUFDdkMsaUNBQW1DO0FBQ25DLHlDQUEyQztBQUczQyx1QkFBOEIsS0FBZ0I7SUFDNUMsT0FBTyxpQ0FBdUIsQ0FBQyxNQUFNLENBQUMsVUFBUyxJQUFJLEVBQUUsT0FBTztRQUMxRCxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDMUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQzdDO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDLEVBQUUsRUFBd0IsQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFQRCxzQ0FPQztBQUVELElBQU0sZUFBZSxHQUFvQztJQUN2RCxNQUFNLEVBQUUsS0FBSztJQUNiLEdBQUcsRUFBRSxRQUFRO0lBQ2IsSUFBSSxFQUFFLE9BQU87SUFDYixLQUFLLEVBQUUsTUFBTTtDQUNkLENBQUM7QUFFRix3QkFBK0IsS0FBaUI7SUFDeEMsSUFBQSxvQkFBaUMsRUFBaEMsY0FBSSxFQUFFLG9CQUFPLENBQW9CO0lBQ3hDLElBQU0sU0FBUyxHQUdYLEVBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBQyxDQUFDO0lBRTNDLEtBQW9CLFVBQWMsRUFBZCxLQUFBLEtB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cUJBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7QUFDeEUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QXhpcywgQVhJU19QQVJUUywgQXhpc0VuY29kaW5nLCBpc0F4aXNQcm9wZXJ0eSwgVkdfQVhJU19QUk9QRVJUSUVTfSBmcm9tICcuLi8uLi9heGlzJztcbmltcG9ydCB7UE9TSVRJT05fU0NBTEVfQ0hBTk5FTFMsIFBvc2l0aW9uU2NhbGVDaGFubmVsLCBYLCBZfSBmcm9tICcuLi8uLi9jaGFubmVsJztcbmltcG9ydCB7RmllbGREZWZCYXNlLCB0b0ZpZWxkRGVmQmFzZX0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtrZXlzfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7QXhpc09yaWVudCwgVmdBeGlzLCBWZ0F4aXNFbmNvZGV9IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7Z2V0U3BlY2lmaWVkT3JEZWZhdWx0VmFsdWUsIG1lcmdlVGl0bGVGaWVsZERlZnMsIG51bWJlckZvcm1hdCwgdGl0bGVNZXJnZXJ9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge0xheWVyTW9kZWx9IGZyb20gJy4uL2xheWVyJztcbmltcG9ydCB7cGFyc2VHdWlkZVJlc29sdmV9IGZyb20gJy4uL3Jlc29sdmUnO1xuaW1wb3J0IHtkZWZhdWx0VGllQnJlYWtlciwgRXhwbGljaXQsIG1lcmdlVmFsdWVzV2l0aEV4cGxpY2l0fSBmcm9tICcuLi9zcGxpdCc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQge0F4aXNDb21wb25lbnQsIEF4aXNDb21wb25lbnRJbmRleCwgQXhpc0NvbXBvbmVudFByb3BzfSBmcm9tICcuL2NvbXBvbmVudCc7XG5pbXBvcnQge2dldEF4aXNDb25maWd9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCAqIGFzIGVuY29kZSBmcm9tICcuL2VuY29kZSc7XG5pbXBvcnQgKiBhcyBwcm9wZXJ0aWVzIGZyb20gJy4vcHJvcGVydGllcyc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVW5pdEF4aXMobW9kZWw6IFVuaXRNb2RlbCk6IEF4aXNDb21wb25lbnRJbmRleCB7XG4gIHJldHVybiBQT1NJVElPTl9TQ0FMRV9DSEFOTkVMUy5yZWR1Y2UoZnVuY3Rpb24oYXhpcywgY2hhbm5lbCkge1xuICAgIGlmIChtb2RlbC5jb21wb25lbnQuc2NhbGVzW2NoYW5uZWxdICYmIG1vZGVsLmF4aXMoY2hhbm5lbCkpIHtcbiAgICAgIGF4aXNbY2hhbm5lbF0gPSBbcGFyc2VBeGlzKGNoYW5uZWwsIG1vZGVsKV07XG4gICAgfVxuICAgIHJldHVybiBheGlzO1xuICB9LCB7fSBhcyBBeGlzQ29tcG9uZW50SW5kZXgpO1xufVxuXG5jb25zdCBPUFBPU0lURV9PUklFTlQ6IHtbSyBpbiBBeGlzT3JpZW50XTogQXhpc09yaWVudH0gPSB7XG4gIGJvdHRvbTogJ3RvcCcsXG4gIHRvcDogJ2JvdHRvbScsXG4gIGxlZnQ6ICdyaWdodCcsXG4gIHJpZ2h0OiAnbGVmdCdcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUxheWVyQXhpcyhtb2RlbDogTGF5ZXJNb2RlbCkge1xuICBjb25zdCB7YXhlcywgcmVzb2x2ZX0gPSBtb2RlbC5jb21wb25lbnQ7XG4gIGNvbnN0IGF4aXNDb3VudDoge1xuICAgIC8vIFVzaW5nIE1hcHBlZCBUeXBlIHRvIGRlY2xhcmUgdHlwZSAoaHR0cHM6Ly93d3cudHlwZXNjcmlwdGxhbmcub3JnL2RvY3MvaGFuZGJvb2svYWR2YW5jZWQtdHlwZXMuaHRtbCNtYXBwZWQtdHlwZXMpXG4gICAgW2sgaW4gQXhpc09yaWVudF06IG51bWJlclxuICB9ID0ge3RvcDogMCwgYm90dG9tOiAwLCByaWdodDogMCwgbGVmdDogMH07XG5cbiAgZm9yIChjb25zdCBjaGlsZCBvZiBtb2RlbC5jaGlsZHJlbikge1xuICAgIGNoaWxkLnBhcnNlQXhpc0FuZEhlYWRlcigpO1xuXG4gICAgZm9yIChjb25zdCBjaGFubmVsIG9mIGtleXMoY2hpbGQuY29tcG9uZW50LmF4ZXMpKSB7XG4gICAgICByZXNvbHZlLmF4aXNbY2hhbm5lbF0gPSBwYXJzZUd1aWRlUmVzb2x2ZShtb2RlbC5jb21wb25lbnQucmVzb2x2ZSwgY2hhbm5lbCk7XG4gICAgICBpZiAocmVzb2x2ZS5heGlzW2NoYW5uZWxdID09PSAnc2hhcmVkJykge1xuICAgICAgICAvLyBJZiB0aGUgcmVzb2x2ZSBzYXlzIHNoYXJlZCAoYW5kIGhhcyBub3QgYmVlbiBvdmVycmlkZGVuKVxuICAgICAgICAvLyBXZSB3aWxsIHRyeSB0byBtZXJnZSBhbmQgc2VlIGlmIHRoZXJlIGlzIGEgY29uZmxpY3RcblxuICAgICAgICBheGVzW2NoYW5uZWxdID0gbWVyZ2VBeGlzQ29tcG9uZW50cyhheGVzW2NoYW5uZWxdLCBjaGlsZC5jb21wb25lbnQuYXhlc1tjaGFubmVsXSk7XG5cbiAgICAgICAgaWYgKCFheGVzW2NoYW5uZWxdKSB7XG4gICAgICAgICAgLy8gSWYgbWVyZ2UgcmV0dXJucyBub3RoaW5nLCB0aGVyZSBpcyBhIGNvbmZsaWN0IHNvIHdlIGNhbm5vdCBtYWtlIHRoZSBheGlzIHNoYXJlZC5cbiAgICAgICAgICAvLyBUaHVzLCBtYXJrIGF4aXMgYXMgaW5kZXBlbmRlbnQgYW5kIHJlbW92ZSB0aGUgYXhpcyBjb21wb25lbnQuXG4gICAgICAgICAgcmVzb2x2ZS5heGlzW2NoYW5uZWxdID0gJ2luZGVwZW5kZW50JztcbiAgICAgICAgICBkZWxldGUgYXhlc1tjaGFubmVsXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIE1vdmUgYXhlcyB0byBsYXllcidzIGF4aXMgY29tcG9uZW50IGFuZCBtZXJnZSBzaGFyZWQgYXhlc1xuICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgW1gsIFldKSB7XG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBtb2RlbC5jaGlsZHJlbikge1xuICAgICAgaWYgKCFjaGlsZC5jb21wb25lbnQuYXhlc1tjaGFubmVsXSkge1xuICAgICAgICAvLyBza2lwIGlmIHRoZSBjaGlsZCBkb2VzIG5vdCBoYXZlIGEgcGFydGljdWxhciBheGlzXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVzb2x2ZS5heGlzW2NoYW5uZWxdID09PSAnaW5kZXBlbmRlbnQnKSB7XG4gICAgICAgIC8vIElmIGF4ZXMgYXJlIGluZGVwZW5kZW50LCBjb25jYXQgdGhlIGF4aXNDb21wb25lbnQgYXJyYXkuXG4gICAgICAgIGF4ZXNbY2hhbm5lbF0gPSAoYXhlc1tjaGFubmVsXSB8fCBbXSkuY29uY2F0KGNoaWxkLmNvbXBvbmVudC5heGVzW2NoYW5uZWxdKTtcblxuICAgICAgICAvLyBBdXRvbWF0aWNhbGx5IGFkanVzdCBvcmllbnRcbiAgICAgICAgZm9yIChjb25zdCBheGlzQ29tcG9uZW50IG9mIGNoaWxkLmNvbXBvbmVudC5heGVzW2NoYW5uZWxdKSB7XG4gICAgICAgICAgY29uc3Qge3ZhbHVlOiBvcmllbnQsIGV4cGxpY2l0fSA9IGF4aXNDb21wb25lbnQuZ2V0V2l0aEV4cGxpY2l0KCdvcmllbnQnKTtcbiAgICAgICAgICBpZiAoYXhpc0NvdW50W29yaWVudF0gPiAwICYmICFleHBsaWNpdCkge1xuICAgICAgICAgICAgLy8gQ2hhbmdlIGF4aXMgb3JpZW50IGlmIHRoZSBudW1iZXIgZG8gbm90IG1hdGNoXG4gICAgICAgICAgICBjb25zdCBvcHBvc2l0ZU9yaWVudCA9IE9QUE9TSVRFX09SSUVOVFtvcmllbnRdO1xuICAgICAgICAgICAgaWYgKGF4aXNDb3VudFtvcmllbnRdID4gYXhpc0NvdW50W29wcG9zaXRlT3JpZW50XSkge1xuICAgICAgICAgICAgICBheGlzQ29tcG9uZW50LnNldCgnb3JpZW50Jywgb3Bwb3NpdGVPcmllbnQsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYXhpc0NvdW50W29yaWVudF0rKztcblxuICAgICAgICAgIC8vIFRPRE8oaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8yNjM0KTogYXV0b21hdGljYWx5IGFkZCBleHRyYSBvZmZzZXQ/XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gQWZ0ZXIgbWVyZ2luZywgbWFrZSBzdXJlIHRvIHJlbW92ZSBheGVzIGZyb20gY2hpbGRcbiAgICAgIGRlbGV0ZSBjaGlsZC5jb21wb25lbnQuYXhlc1tjaGFubmVsXTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gbWVyZ2VBeGlzQ29tcG9uZW50cyhtZXJnZWRBeGlzQ21wdHM6IEF4aXNDb21wb25lbnRbXSwgY2hpbGRBeGlzQ21wdHM6IEF4aXNDb21wb25lbnRbXSk6IEF4aXNDb21wb25lbnRbXSB7XG4gIGlmIChtZXJnZWRBeGlzQ21wdHMpIHtcbiAgICAvLyBGSVhNRTogdGhpcyBpcyBhIGJpdCB3cm9uZyBvbmNlIHdlIHN1cHBvcnQgbXVsdGlwbGUgYXhlc1xuICAgIGlmIChtZXJnZWRBeGlzQ21wdHMubGVuZ3RoICE9PSBjaGlsZEF4aXNDbXB0cy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7IC8vIENhbm5vdCBtZXJnZSBheGlzIGNvbXBvbmVudCB3aXRoIGRpZmZlcmVudCBudW1iZXIgb2YgYXhlcy5cbiAgICB9XG4gICAgY29uc3QgbGVuZ3RoID0gbWVyZ2VkQXhpc0NtcHRzLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aCA7IGkrKykge1xuICAgICAgY29uc3QgbWVyZ2VkID0gbWVyZ2VkQXhpc0NtcHRzW2ldO1xuICAgICAgY29uc3QgY2hpbGQgPSBjaGlsZEF4aXNDbXB0c1tpXTtcblxuICAgICAgaWYgKCghIW1lcmdlZCkgIT09ICghIWNoaWxkKSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSBlbHNlIGlmIChtZXJnZWQgJiYgY2hpbGQpIHtcbiAgICAgICAgY29uc3QgbWVyZ2VkT3JpZW50ID0gbWVyZ2VkLmdldFdpdGhFeHBsaWNpdCgnb3JpZW50Jyk7XG4gICAgICAgIGNvbnN0IGNoaWxkT3JpZW50ID0gY2hpbGQuZ2V0V2l0aEV4cGxpY2l0KCdvcmllbnQnKTtcblxuICAgICAgICBpZiAobWVyZ2VkT3JpZW50LmV4cGxpY2l0ICYmIGNoaWxkT3JpZW50LmV4cGxpY2l0ICYmIG1lcmdlZE9yaWVudC52YWx1ZSAhPT0gY2hpbGRPcmllbnQudmFsdWUpIHtcbiAgICAgICAgICAvLyBUT0RPOiB0aHJvdyB3YXJuaW5nIGlmIHJlc29sdmUgaXMgZXhwbGljaXQgKFdlIGRvbid0IGhhdmUgaW5mbyBhYm91dCBleHBsaWNpdC9pbXBsaWNpdCByZXNvbHZlIHlldC4pXG5cbiAgICAgICAgICAvLyBDYW5ub3QgbWVyZ2UgZHVlIHRvIGluY29uc2lzdGVudCBvcmllbnRcbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1lcmdlZEF4aXNDbXB0c1tpXSA9IG1lcmdlQXhpc0NvbXBvbmVudChtZXJnZWQsIGNoaWxkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBGb3IgZmlyc3Qgb25lLCByZXR1cm4gYSBjb3B5IG9mIHRoZSBjaGlsZFxuICAgIHJldHVybiBjaGlsZEF4aXNDbXB0cy5tYXAoYXhpc0NvbXBvbmVudCA9PiBheGlzQ29tcG9uZW50LmNsb25lKCkpO1xuICB9XG4gIHJldHVybiBtZXJnZWRBeGlzQ21wdHM7XG59XG5cbmZ1bmN0aW9uIG1lcmdlQXhpc0NvbXBvbmVudChtZXJnZWQ6IEF4aXNDb21wb25lbnQsIGNoaWxkOiBBeGlzQ29tcG9uZW50KTogQXhpc0NvbXBvbmVudCB7XG4gIGZvciAoY29uc3QgcHJvcCBvZiBWR19BWElTX1BST1BFUlRJRVMpIHtcbiAgICBjb25zdCBtZXJnZWRWYWx1ZVdpdGhFeHBsaWNpdCA9IG1lcmdlVmFsdWVzV2l0aEV4cGxpY2l0PFZnQXhpcywgYW55PihcbiAgICAgIG1lcmdlZC5nZXRXaXRoRXhwbGljaXQocHJvcCksXG4gICAgICBjaGlsZC5nZXRXaXRoRXhwbGljaXQocHJvcCksXG4gICAgICBwcm9wLCAnYXhpcycsXG5cbiAgICAgIC8vIFRpZSBicmVha2VyIGZ1bmN0aW9uXG4gICAgICAodjE6IEV4cGxpY2l0PGFueT4sIHYyOiBFeHBsaWNpdDxhbnk+KSA9PiB7XG4gICAgICAgIHN3aXRjaCAocHJvcCkge1xuICAgICAgICAgIGNhc2UgJ3RpdGxlJzpcbiAgICAgICAgICAgIHJldHVybiB0aXRsZU1lcmdlcih2MSwgdjIpO1xuICAgICAgICAgIGNhc2UgJ2dyaWRTY2FsZSc6XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBleHBsaWNpdDogdjEuZXhwbGljaXQsIC8vIGtlZXAgdGhlIG9sZCBleHBsaWNpdFxuICAgICAgICAgICAgICB2YWx1ZTogdjEudmFsdWUgfHwgdjIudmFsdWVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZmF1bHRUaWVCcmVha2VyPFZnQXhpcywgYW55Pih2MSwgdjIsIHByb3AsICdheGlzJyk7XG4gICAgICB9XG4gICAgKTtcbiAgICBtZXJnZWQuc2V0V2l0aEV4cGxpY2l0KHByb3AsIG1lcmdlZFZhbHVlV2l0aEV4cGxpY2l0KTtcbiAgfVxuICByZXR1cm4gbWVyZ2VkO1xufVxuXG5cbmZ1bmN0aW9uIHBhcnNlQXhpcyhjaGFubmVsOiBQb3NpdGlvblNjYWxlQ2hhbm5lbCwgbW9kZWw6IFVuaXRNb2RlbCk6IEF4aXNDb21wb25lbnQge1xuICBjb25zdCBheGlzID0gbW9kZWwuYXhpcyhjaGFubmVsKTtcblxuICBjb25zdCBheGlzQ29tcG9uZW50ID0gbmV3IEF4aXNDb21wb25lbnQoKTtcblxuICAvLyAxLjIuIEFkZCBwcm9wZXJ0aWVzXG4gIFZHX0FYSVNfUFJPUEVSVElFUy5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgY29uc3QgdmFsdWUgPSBnZXRQcm9wZXJ0eShwcm9wZXJ0eSwgYXhpcywgY2hhbm5lbCwgbW9kZWwpO1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBleHBsaWNpdCA9XG4gICAgICAgIC8vIHNwZWNpZmllZCBheGlzLnZhbHVlcyBpcyBhbHJlYWR5IHJlc3BlY3RlZCwgYnV0IG1heSBnZXQgdHJhbnNmb3JtZWQuXG4gICAgICAgIHByb3BlcnR5ID09PSAndmFsdWVzJyA/ICEhYXhpcy52YWx1ZXMgOlxuICAgICAgICAvLyBib3RoIFZMIGF4aXMuZW5jb2RpbmcgYW5kIGF4aXMubGFiZWxBbmdsZSBhZmZlY3QgVkcgYXhpcy5lbmNvZGVcbiAgICAgICAgcHJvcGVydHkgPT09ICdlbmNvZGUnID8gISFheGlzLmVuY29kaW5nIHx8ICEhYXhpcy5sYWJlbEFuZ2xlIDpcbiAgICAgICAgdmFsdWUgPT09IGF4aXNbcHJvcGVydHldO1xuXG4gICAgICBjb25zdCBjb25maWdWYWx1ZSA9IGdldEF4aXNDb25maWcocHJvcGVydHksIG1vZGVsLmNvbmZpZywgY2hhbm5lbCwgYXhpc0NvbXBvbmVudC5nZXQoJ29yaWVudCcpLCBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKS5nZXQoJ3R5cGUnKSk7XG5cbiAgICAgIC8vIG9ubHkgc2V0IHByb3BlcnR5IGlmIGl0IGlzIGV4cGxpY2l0bHkgc2V0IG9yIGhhcyBubyBjb25maWcgdmFsdWUgKG90aGVyd2lzZSB3ZSB3aWxsIGFjY2lkZW50YWxseSBvdmVycmlkZSBjb25maWcpXG4gICAgICBpZiAoZXhwbGljaXQgfHwgY29uZmlnVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBEbyBub3QgYXBwbHkgaW1wbGljaXQgcnVsZSBpZiB0aGVyZSBpcyBhIGNvbmZpZyB2YWx1ZVxuICAgICAgICBheGlzQ29tcG9uZW50LnNldChwcm9wZXJ0eSwgdmFsdWUsIGV4cGxpY2l0KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIC8vIDIpIEFkZCBndWlkZSBlbmNvZGUgZGVmaW5pdGlvbiBncm91cHNcbiAgY29uc3QgYXhpc0VuY29kaW5nID0gYXhpcy5lbmNvZGluZyB8fCB7fTtcbiAgY29uc3QgYXhpc0VuY29kZSA9IEFYSVNfUEFSVFMucmVkdWNlKChlOiBWZ0F4aXNFbmNvZGUsIHBhcnQpID0+IHtcbiAgICBpZiAoIWF4aXNDb21wb25lbnQuaGFzQXhpc1BhcnQocGFydCkpIHtcbiAgICAgIC8vIE5vIG5lZWQgdG8gY3JlYXRlIGVuY29kZSBmb3IgYSBkaXNhYmxlZCBwYXJ0LlxuICAgICAgcmV0dXJuIGU7XG4gICAgfVxuXG4gICAgY29uc3QgdmFsdWUgPSBwYXJ0ID09PSAnbGFiZWxzJyA/XG4gICAgICBlbmNvZGUubGFiZWxzKG1vZGVsLCBjaGFubmVsLCBheGlzRW5jb2RpbmcubGFiZWxzIHx8IHt9LCBheGlzQ29tcG9uZW50LmdldCgnb3JpZW50JykpIDpcbiAgICAgIGF4aXNFbmNvZGluZ1twYXJ0XSB8fCB7fTtcblxuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIGtleXModmFsdWUpLmxlbmd0aCA+IDApIHtcbiAgICAgIGVbcGFydF0gPSB7dXBkYXRlOiB2YWx1ZX07XG4gICAgfVxuICAgIHJldHVybiBlO1xuICB9LCB7fSBhcyBWZ0F4aXNFbmNvZGUpO1xuXG4gIC8vIEZJWE1FOiBCeSBoYXZpbmcgZW5jb2RlIGFzIG9uZSBwcm9wZXJ0eSwgd2Ugd29uJ3QgaGF2ZSBmaW5lIGdyYWluZWQgZW5jb2RlIG1lcmdpbmcuXG4gIGlmIChrZXlzKGF4aXNFbmNvZGUpLmxlbmd0aCA+IDApIHtcbiAgICBheGlzQ29tcG9uZW50LnNldCgnZW5jb2RlJywgYXhpc0VuY29kZSwgISFheGlzLmVuY29kaW5nIHx8IGF4aXMubGFiZWxBbmdsZSAhPT0gdW5kZWZpbmVkKTtcbiAgfVxuXG4gIHJldHVybiBheGlzQ29tcG9uZW50O1xufVxuXG5mdW5jdGlvbiBnZXRQcm9wZXJ0eTxLIGV4dGVuZHMga2V5b2YgQXhpc0NvbXBvbmVudFByb3BzPihwcm9wZXJ0eTogSywgc3BlY2lmaWVkQXhpczogQXhpcywgY2hhbm5lbDogUG9zaXRpb25TY2FsZUNoYW5uZWwsIG1vZGVsOiBVbml0TW9kZWwpOiBBeGlzQ29tcG9uZW50UHJvcHNbS10ge1xuICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuICBzd2l0Y2ggKHByb3BlcnR5KSB7XG4gICAgY2FzZSAnc2NhbGUnOlxuICAgICAgcmV0dXJuIG1vZGVsLnNjYWxlTmFtZShjaGFubmVsKTtcbiAgICBjYXNlICdncmlkU2NhbGUnOlxuICAgICAgcmV0dXJuIHByb3BlcnRpZXMuZ3JpZFNjYWxlKG1vZGVsLCBjaGFubmVsKTtcbiAgICBjYXNlICdmb3JtYXQnOlxuICAgICAgLy8gV2UgZG9uJ3QgaW5jbHVkZSB0ZW1wb3JhbCBmaWVsZCBoZXJlIGFzIHdlIGFwcGx5IGZvcm1hdCBpbiBlbmNvZGUgYmxvY2tcbiAgICAgIHJldHVybiBudW1iZXJGb3JtYXQoZmllbGREZWYsIHNwZWNpZmllZEF4aXMuZm9ybWF0LCBtb2RlbC5jb25maWcpO1xuICAgIGNhc2UgJ2dyaWQnOiB7XG4gICAgICBjb25zdCBzY2FsZVR5cGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKS5nZXQoJ3R5cGUnKTtcbiAgICAgIHJldHVybiBnZXRTcGVjaWZpZWRPckRlZmF1bHRWYWx1ZShzcGVjaWZpZWRBeGlzLmdyaWQsIHByb3BlcnRpZXMuZ3JpZChzY2FsZVR5cGUsIGZpZWxkRGVmKSk7XG4gICAgfVxuICAgIGNhc2UgJ2xhYmVsRmx1c2gnOlxuICAgICAgcmV0dXJuIHByb3BlcnRpZXMubGFiZWxGbHVzaChmaWVsZERlZiwgY2hhbm5lbCwgc3BlY2lmaWVkQXhpcyk7XG4gICAgY2FzZSAnbGFiZWxPdmVybGFwJzoge1xuICAgICAgY29uc3Qgc2NhbGVUeXBlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCkuZ2V0KCd0eXBlJyk7XG4gICAgICByZXR1cm4gcHJvcGVydGllcy5sYWJlbE92ZXJsYXAoZmllbGREZWYsIHNwZWNpZmllZEF4aXMsIGNoYW5uZWwsIHNjYWxlVHlwZSk7XG4gICAgfVxuICAgIGNhc2UgJ29yaWVudCc6XG4gICAgICByZXR1cm4gZ2V0U3BlY2lmaWVkT3JEZWZhdWx0VmFsdWUoc3BlY2lmaWVkQXhpcy5vcmllbnQsIHByb3BlcnRpZXMub3JpZW50KGNoYW5uZWwpKTtcbiAgICBjYXNlICd0aWNrQ291bnQnOiB7XG4gICAgICBjb25zdCBzY2FsZVR5cGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKS5nZXQoJ3R5cGUnKTtcbiAgICAgIGNvbnN0IHNpemVUeXBlID0gY2hhbm5lbCA9PT0gJ3gnID8gJ3dpZHRoJyA6IGNoYW5uZWwgPT09ICd5JyA/ICdoZWlnaHQnIDogdW5kZWZpbmVkO1xuICAgICAgY29uc3Qgc2l6ZSA9IHNpemVUeXBlID8gbW9kZWwuZ2V0U2l6ZVNpZ25hbFJlZihzaXplVHlwZSlcbiAgICAgICA6IHVuZGVmaW5lZDtcbiAgICAgIHJldHVybiBnZXRTcGVjaWZpZWRPckRlZmF1bHRWYWx1ZShzcGVjaWZpZWRBeGlzLnRpY2tDb3VudCwgcHJvcGVydGllcy50aWNrQ291bnQoY2hhbm5lbCwgZmllbGREZWYsIHNjYWxlVHlwZSwgc2l6ZSkpO1xuICAgIH1cbiAgICBjYXNlICd0aXRsZSc6XG4gICAgICBjb25zdCBjaGFubmVsMiA9IGNoYW5uZWwgPT09ICd4JyA/ICd4MicgOiAneTInO1xuICAgICAgY29uc3QgZmllbGREZWYyID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbDIpO1xuICAgICAgLy8gS2VlcCB1bmRlZmluZWQgc28gd2UgdXNlIGRlZmF1bHQgaWYgdGl0bGUgaXMgdW5zcGVjaWZpZWQuXG4gICAgICAvLyBGb3Igb3RoZXIgZmFsc3kgdmFsdWUsIGtlZXAgdGhlbSBzbyB3ZSB3aWxsIGhpZGUgdGhlIHRpdGxlLlxuICAgICAgY29uc3Qgc3BlY2lmaWVkVGl0bGUgPSBmaWVsZERlZi50aXRsZSAhPT0gdW5kZWZpbmVkID8gZmllbGREZWYudGl0bGUgOlxuICAgICAgICBzcGVjaWZpZWRBeGlzLnRpdGxlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBzcGVjaWZpZWRBeGlzLnRpdGxlO1xuXG4gICAgICByZXR1cm4gZ2V0U3BlY2lmaWVkT3JEZWZhdWx0VmFsdWU8c3RyaW5nIHwgRmllbGREZWZCYXNlPHN0cmluZz5bXT4oXG4gICAgICAgIHNwZWNpZmllZFRpdGxlLFxuICAgICAgICAvLyBJZiB0aXRsZSBub3Qgc3BlY2lmaWVkLCBzdG9yZSBiYXNlIHBhcnRzIG9mIGZpZWxkRGVmIChhbmQgZmllbGREZWYyIGlmIGV4aXN0cylcbiAgICAgICAgbWVyZ2VUaXRsZUZpZWxkRGVmcyhcbiAgICAgICAgICBbdG9GaWVsZERlZkJhc2UoZmllbGREZWYpXSxcbiAgICAgICAgICBmaWVsZERlZjIgPyBbdG9GaWVsZERlZkJhc2UoZmllbGREZWYyKV0gOiBbXVxuICAgICAgICApXG4gICAgICApO1xuICAgIGNhc2UgJ3ZhbHVlcyc6XG4gICAgICByZXR1cm4gcHJvcGVydGllcy52YWx1ZXMoc3BlY2lmaWVkQXhpcywgbW9kZWwsIGZpZWxkRGVmLCBjaGFubmVsKTtcbiAgfVxuICAvLyBPdGhlcndpc2UsIHJldHVybiBzcGVjaWZpZWQgcHJvcGVydHkuXG4gIHJldHVybiBpc0F4aXNQcm9wZXJ0eShwcm9wZXJ0eSkgPyBzcGVjaWZpZWRBeGlzW3Byb3BlcnR5XSA6IHVuZGVmaW5lZDtcbn1cbiJdfQ==