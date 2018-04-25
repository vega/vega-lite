import { AXIS_PARTS, isAxisProperty, VG_AXIS_PROPERTIES } from '../../axis';
import { POSITION_SCALE_CHANNELS, X, Y } from '../../channel';
import { toFieldDefBase } from '../../fielddef';
import { keys } from '../../util';
import { getSpecifiedOrDefaultValue, mergeTitleFieldDefs, numberFormat, titleMerger } from '../common';
import { parseGuideResolve } from '../resolve';
import { defaultTieBreaker, mergeValuesWithExplicit } from '../split';
import { AxisComponent } from './component';
import { getAxisConfig } from './config';
import * as encode from './encode';
import * as properties from './properties';
export function parseUnitAxis(model) {
    return POSITION_SCALE_CHANNELS.reduce(function (axis, channel) {
        if (model.component.scales[channel] && model.axis(channel)) {
            axis[channel] = [parseAxis(channel, model)];
        }
        return axis;
    }, {});
}
var OPPOSITE_ORIENT = {
    bottom: 'top',
    top: 'bottom',
    left: 'right',
    right: 'left'
};
export function parseLayerAxis(model) {
    var _a = model.component, axes = _a.axes, resolve = _a.resolve;
    var axisCount = { top: 0, bottom: 0, right: 0, left: 0 };
    for (var _i = 0, _b = model.children; _i < _b.length; _i++) {
        var child = _b[_i];
        child.parseAxisAndHeader();
        for (var _c = 0, _d = keys(child.component.axes); _c < _d.length; _c++) {
            var channel = _d[_c];
            resolve.axis[channel] = parseGuideResolve(model.component.resolve, channel);
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
    for (var _e = 0, _f = [X, Y]; _e < _f.length; _e++) {
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
        var mergedValueWithExplicit = mergeValuesWithExplicit(merged.getWithExplicit(prop), child.getWithExplicit(prop), prop, 'axis', 
        // Tie breaker function
        function (v1, v2) {
            switch (prop) {
                case 'title':
                    return titleMerger(v1, v2);
                case 'gridScale':
                    return {
                        explicit: v1.explicit,
                        value: v1.value || v2.value
                    };
            }
            return defaultTieBreaker(v1, v2, prop, 'axis');
        });
        merged.setWithExplicit(prop, mergedValueWithExplicit);
    };
    for (var _i = 0, VG_AXIS_PROPERTIES_1 = VG_AXIS_PROPERTIES; _i < VG_AXIS_PROPERTIES_1.length; _i++) {
        var prop = VG_AXIS_PROPERTIES_1[_i];
        _loop_1(prop);
    }
    return merged;
}
function parseAxis(channel, model) {
    var axis = model.axis(channel);
    var axisComponent = new AxisComponent();
    // 1.2. Add properties
    VG_AXIS_PROPERTIES.forEach(function (property) {
        var value = getProperty(property, axis, channel, model);
        if (value !== undefined) {
            var explicit = 
            // specified axis.values is already respected, but may get transformed.
            property === 'values' ? !!axis.values :
                // both VL axis.encoding and axis.labelAngle affect VG axis.encode
                property === 'encode' ? !!axis.encoding || !!axis.labelAngle :
                    value === axis[property];
            var configValue = getAxisConfig(property, model.config, channel, axisComponent.get('orient'), model.getScaleComponent(channel).get('type'));
            // only set property if it is explicitly set or has no config value (otherwise we will accidentally override config)
            if (explicit || configValue === undefined) {
                // Do not apply implicit rule if there is a config value
                axisComponent.set(property, value, explicit);
            }
        }
    });
    // 2) Add guide encode definition groups
    var axisEncoding = axis.encoding || {};
    var axisEncode = AXIS_PARTS.reduce(function (e, part) {
        if (!axisComponent.hasAxisPart(part)) {
            // No need to create encode for a disabled part.
            return e;
        }
        var value = part === 'labels' ?
            encode.labels(model, channel, axisEncoding.labels || {}, axisComponent.get('orient')) :
            axisEncoding[part] || {};
        if (value !== undefined && keys(value).length > 0) {
            e[part] = { update: value };
        }
        return e;
    }, {});
    // FIXME: By having encode as one property, we won't have fine grained encode merging.
    if (keys(axisEncode).length > 0) {
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
            return numberFormat(fieldDef, specifiedAxis.format, model.config);
        case 'grid': {
            var scaleType = model.getScaleComponent(channel).get('type');
            return getSpecifiedOrDefaultValue(specifiedAxis.grid, properties.grid(scaleType, fieldDef));
        }
        case 'labelFlush':
            return properties.labelFlush(fieldDef, channel, specifiedAxis);
        case 'labelOverlap': {
            var scaleType = model.getScaleComponent(channel).get('type');
            return properties.labelOverlap(fieldDef, specifiedAxis, channel, scaleType);
        }
        case 'orient':
            return getSpecifiedOrDefaultValue(specifiedAxis.orient, properties.orient(channel));
        case 'tickCount': {
            var scaleType = model.getScaleComponent(channel).get('type');
            var sizeType = channel === 'x' ? 'width' : channel === 'y' ? 'height' : undefined;
            var size = sizeType ? model.getSizeSignalRef(sizeType)
                : undefined;
            return getSpecifiedOrDefaultValue(specifiedAxis.tickCount, properties.tickCount(channel, fieldDef, scaleType, size));
        }
        case 'title':
            var channel2 = channel === 'x' ? 'x2' : 'y2';
            var fieldDef2 = model.fieldDef(channel2);
            // Keep undefined so we use default if title is unspecified.
            // For other falsy value, keep them so we will hide the title.
            var specifiedTitle = fieldDef.title !== undefined ? fieldDef.title :
                specifiedAxis.title === undefined ? undefined : specifiedAxis.title;
            return getSpecifiedOrDefaultValue(specifiedTitle, 
            // If title not specified, store base parts of fieldDef (and fieldDef2 if exists)
            mergeTitleFieldDefs([toFieldDefBase(fieldDef)], fieldDef2 ? [toFieldDefBase(fieldDef2)] : []));
        case 'values':
            return properties.values(specifiedAxis, model, fieldDef);
    }
    // Otherwise, return specified property.
    return isAxisProperty(property) ? specifiedAxis[property] : undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9heGlzL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBTyxVQUFVLEVBQWdCLGNBQWMsRUFBRSxrQkFBa0IsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUM5RixPQUFPLEVBQUMsdUJBQXVCLEVBQXdCLENBQUMsRUFBRSxDQUFDLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDbEYsT0FBTyxFQUFlLGNBQWMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzVELE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFaEMsT0FBTyxFQUFDLDBCQUEwQixFQUFFLG1CQUFtQixFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFFckcsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQzdDLE9BQU8sRUFBQyxpQkFBaUIsRUFBWSx1QkFBdUIsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUU5RSxPQUFPLEVBQUMsYUFBYSxFQUF5QyxNQUFNLGFBQWEsQ0FBQztBQUNsRixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ3ZDLE9BQU8sS0FBSyxNQUFNLE1BQU0sVUFBVSxDQUFDO0FBQ25DLE9BQU8sS0FBSyxVQUFVLE1BQU0sY0FBYyxDQUFDO0FBRzNDLE1BQU0sd0JBQXdCLEtBQWdCO0lBQzVDLE9BQU8sdUJBQXVCLENBQUMsTUFBTSxDQUFDLFVBQVMsSUFBSSxFQUFFLE9BQU87UUFDMUQsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQzFELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMs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SyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO1lBRXRFLE9BQU8sMEJBQTBCLENBQy9CLGNBQWM7WUFDZCxpRkFBaUY7WUFDakYsbUJBQW1CLENBQ2pCLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQzFCLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUM3QyxDQUNGLENBQUM7UUFDSixLQUFLLFFBQVE7WUFDWCxPQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztLQUM1RDtJQUNELHdDQUF3QztJQUN4QyxPQUFPLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7QUFDeEUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QXhpcywgQVhJU19QQVJUUywgQXhpc0VuY29kaW5nLCBpc0F4aXNQcm9wZXJ0eSwgVkdfQVhJU19QUk9QRVJUSUVTfSBmcm9tICcuLi8uLi9heGlzJztcbmltcG9ydCB7UE9TSVRJT05fU0NBTEVfQ0hBTk5FTFMsIFBvc2l0aW9uU2NhbGVDaGFubmVsLCBYLCBZfSBmcm9tICcuLi8uLi9jaGFubmVsJztcbmltcG9ydCB7RmllbGREZWZCYXNlLCB0b0ZpZWxkRGVmQmFzZX0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtrZXlzfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7QXhpc09yaWVudCwgVmdBeGlzLCBWZ0F4aXNFbmNvZGV9IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7Z2V0U3BlY2lmaWVkT3JEZWZhdWx0VmFsdWUsIG1lcmdlVGl0bGVGaWVsZERlZnMsIG51bWJlckZvcm1hdCwgdGl0bGVNZXJnZXJ9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge0xheWVyTW9kZWx9IGZyb20gJy4uL2xheWVyJztcbmltcG9ydCB7cGFyc2VHdWlkZVJlc29sdmV9IGZyb20gJy4uL3Jlc29sdmUnO1xuaW1wb3J0IHtkZWZhdWx0VGllQnJlYWtlciwgRXhwbGljaXQsIG1lcmdlVmFsdWVzV2l0aEV4cGxpY2l0fSBmcm9tICcuLi9zcGxpdCc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQge0F4aXNDb21wb25lbnQsIEF4aXNDb21wb25lbnRJbmRleCwgQXhpc0NvbXBvbmVudFByb3BzfSBmcm9tICcuL2NvbXBvbmVudCc7XG5pbXBvcnQge2dldEF4aXNDb25maWd9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCAqIGFzIGVuY29kZSBmcm9tICcuL2VuY29kZSc7XG5pbXBvcnQgKiBhcyBwcm9wZXJ0aWVzIGZyb20gJy4vcHJvcGVydGllcyc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVW5pdEF4aXMobW9kZWw6IFVuaXRNb2RlbCk6IEF4aXNDb21wb25lbnRJbmRleCB7XG4gIHJldHVybiBQT1NJVElPTl9TQ0FMRV9DSEFOTkVMUy5yZWR1Y2UoZnVuY3Rpb24oYXhpcywgY2hhbm5lbCkge1xuICAgIGlmIChtb2RlbC5jb21wb25lbnQuc2NhbGVzW2NoYW5uZWxdICYmIG1vZGVsLmF4aXMoY2hhbm5lbCkpIHtcbiAgICAgIGF4aXNbY2hhbm5lbF0gPSBbcGFyc2VBeGlzKGNoYW5uZWwsIG1vZGVsKV07XG4gICAgfVxuICAgIHJldHVybiBheGlzO1xuICB9LCB7fSBhcyBBeGlzQ29tcG9uZW50SW5kZXgpO1xufVxuXG5jb25zdCBPUFBPU0lURV9PUklFTlQ6IHtbSyBpbiBBeGlzT3JpZW50XTogQXhpc09yaWVudH0gPSB7XG4gIGJvdHRvbTogJ3RvcCcsXG4gIHRvcDogJ2JvdHRvbScsXG4gIGxlZnQ6ICdyaWdodCcsXG4gIHJpZ2h0OiAnbGVmdCdcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUxheWVyQXhpcyhtb2RlbDogTGF5ZXJNb2RlbCkge1xuICBjb25zdCB7YXhlcywgcmVzb2x2ZX0gPSBtb2RlbC5jb21wb25lbnQ7XG4gIGNvbnN0IGF4aXNDb3VudDoge1xuICAgIC8vIFVzaW5nIE1hcHBlZCBUeXBlIHRvIGRlY2xhcmUgdHlwZSAoaHR0cHM6Ly93d3cudHlwZXNjcmlwdGxhbmcub3JnL2RvY3MvaGFuZGJvb2svYWR2YW5jZWQtdHlwZXMuaHRtbCNtYXBwZWQtdHlwZXMpXG4gICAgW2sgaW4gQXhpc09yaWVudF06IG51bWJlclxuICB9ID0ge3RvcDogMCwgYm90dG9tOiAwLCByaWdodDogMCwgbGVmdDogMH07XG5cbiAgZm9yIChjb25zdCBjaGlsZCBvZiBtb2RlbC5jaGlsZHJlbikge1xuICAgIGNoaWxkLnBhcnNlQXhpc0FuZEhlYWRlcigpO1xuXG4gICAgZm9yIChjb25zdCBjaGFubmVsIG9mIGtleXMoY2hpbGQuY29tcG9uZW50LmF4ZXMpKSB7XG4gICAgICByZXNvbHZlLmF4aXNbY2hhbm5lbF0gPSBwYXJzZUd1aWRlUmVzb2x2ZShtb2RlbC5jb21wb25lbnQucmVzb2x2ZSwgY2hhbm5lbCk7XG4gICAgICBpZiAocmVzb2x2ZS5heGlzW2NoYW5uZWxdID09PSAnc2hhcmVkJykge1xuICAgICAgICAvLyBJZiB0aGUgcmVzb2x2ZSBzYXlzIHNoYXJlZCAoYW5kIGhhcyBub3QgYmVlbiBvdmVycmlkZGVuKVxuICAgICAgICAvLyBXZSB3aWxsIHRyeSB0byBtZXJnZSBhbmQgc2VlIGlmIHRoZXJlIGlzIGEgY29uZmxpY3RcblxuICAgICAgICBheGVzW2NoYW5uZWxdID0gbWVyZ2VBeGlzQ29tcG9uZW50cyhheGVzW2NoYW5uZWxdLCBjaGlsZC5jb21wb25lbnQuYXhlc1tjaGFubmVsXSk7XG5cbiAgICAgICAgaWYgKCFheGVzW2NoYW5uZWxdKSB7XG4gICAgICAgICAgLy8gSWYgbWVyZ2UgcmV0dXJucyBub3RoaW5nLCB0aGVyZSBpcyBhIGNvbmZsaWN0IHNvIHdlIGNhbm5vdCBtYWtlIHRoZSBheGlzIHNoYXJlZC5cbiAgICAgICAgICAvLyBUaHVzLCBtYXJrIGF4aXMgYXMgaW5kZXBlbmRlbnQgYW5kIHJlbW92ZSB0aGUgYXhpcyBjb21wb25lbnQuXG4gICAgICAgICAgcmVzb2x2ZS5heGlzW2NoYW5uZWxdID0gJ2luZGVwZW5kZW50JztcbiAgICAgICAgICBkZWxldGUgYXhlc1tjaGFubmVsXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIE1vdmUgYXhlcyB0byBsYXllcidzIGF4aXMgY29tcG9uZW50IGFuZCBtZXJnZSBzaGFyZWQgYXhlc1xuICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgW1gsIFldKSB7XG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBtb2RlbC5jaGlsZHJlbikge1xuICAgICAgaWYgKCFjaGlsZC5jb21wb25lbnQuYXhlc1tjaGFubmVsXSkge1xuICAgICAgICAvLyBza2lwIGlmIHRoZSBjaGlsZCBkb2VzIG5vdCBoYXZlIGEgcGFydGljdWxhciBheGlzXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVzb2x2ZS5heGlzW2NoYW5uZWxdID09PSAnaW5kZXBlbmRlbnQnKSB7XG4gICAgICAgIC8vIElmIGF4ZXMgYXJlIGluZGVwZW5kZW50LCBjb25jYXQgdGhlIGF4aXNDb21wb25lbnQgYXJyYXkuXG4gICAgICAgIGF4ZXNbY2hhbm5lbF0gPSAoYXhlc1tjaGFubmVsXSB8fCBbXSkuY29uY2F0KGNoaWxkLmNvbXBvbmVudC5heGVzW2NoYW5uZWxdKTtcblxuICAgICAgICAvLyBBdXRvbWF0aWNhbGx5IGFkanVzdCBvcmllbnRcbiAgICAgICAgZm9yIChjb25zdCBheGlzQ29tcG9uZW50IG9mIGNoaWxkLmNvbXBvbmVudC5heGVzW2NoYW5uZWxdKSB7XG4gICAgICAgICAgY29uc3Qge3ZhbHVlOiBvcmllbnQsIGV4cGxpY2l0fSA9IGF4aXNDb21wb25lbnQuZ2V0V2l0aEV4cGxpY2l0KCdvcmllbnQnKTtcbiAgICAgICAgICBpZiAoYXhpc0NvdW50W29yaWVudF0gPiAwICYmICFleHBsaWNpdCkge1xuICAgICAgICAgICAgLy8gQ2hhbmdlIGF4aXMgb3JpZW50IGlmIHRoZSBudW1iZXIgZG8gbm90IG1hdGNoXG4gICAgICAgICAgICBjb25zdCBvcHBvc2l0ZU9yaWVudCA9IE9QUE9TSVRFX09SSUVOVFtvcmllbnRdO1xuICAgICAgICAgICAgaWYgKGF4aXNDb3VudFtvcmllbnRdID4gYXhpc0NvdW50W29wcG9zaXRlT3JpZW50XSkge1xuICAgICAgICAgICAgICBheGlzQ29tcG9uZW50LnNldCgnb3JpZW50Jywgb3Bwb3NpdGVPcmllbnQsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYXhpc0NvdW50W29yaWVudF0rKztcblxuICAgICAgICAgIC8vIFRPRE8oaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8yNjM0KTogYXV0b21hdGljYWx5IGFkZCBleHRyYSBvZmZzZXQ/XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gQWZ0ZXIgbWVyZ2luZywgbWFrZSBzdXJlIHRvIHJlbW92ZSBheGVzIGZyb20gY2hpbGRcbiAgICAgIGRlbGV0ZSBjaGlsZC5jb21wb25lbnQuYXhlc1tjaGFubmVsXTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gbWVyZ2VBeGlzQ29tcG9uZW50cyhtZXJnZWRBeGlzQ21wdHM6IEF4aXNDb21wb25lbnRbXSwgY2hpbGRBeGlzQ21wdHM6IEF4aXNDb21wb25lbnRbXSk6IEF4aXNDb21wb25lbnRbXSB7XG4gIGlmIChtZXJnZWRBeGlzQ21wdHMpIHtcbiAgICAvLyBGSVhNRTogdGhpcyBpcyBhIGJpdCB3cm9uZyBvbmNlIHdlIHN1cHBvcnQgbXVsdGlwbGUgYXhlc1xuICAgIGlmIChtZXJnZWRBeGlzQ21wdHMubGVuZ3RoICE9PSBjaGlsZEF4aXNDbXB0cy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7IC8vIENhbm5vdCBtZXJnZSBheGlzIGNvbXBvbmVudCB3aXRoIGRpZmZlcmVudCBudW1iZXIgb2YgYXhlcy5cbiAgICB9XG4gICAgY29uc3QgbGVuZ3RoID0gbWVyZ2VkQXhpc0NtcHRzLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aCA7IGkrKykge1xuICAgICAgY29uc3QgbWVyZ2VkID0gbWVyZ2VkQXhpc0NtcHRzW2ldO1xuICAgICAgY29uc3QgY2hpbGQgPSBjaGlsZEF4aXNDbXB0c1tpXTtcblxuICAgICAgaWYgKCghIW1lcmdlZCkgIT09ICghIWNoaWxkKSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSBlbHNlIGlmIChtZXJnZWQgJiYgY2hpbGQpIHtcbiAgICAgICAgY29uc3QgbWVyZ2VkT3JpZW50ID0gbWVyZ2VkLmdldFdpdGhFeHBsaWNpdCgnb3JpZW50Jyk7XG4gICAgICAgIGNvbnN0IGNoaWxkT3JpZW50ID0gY2hpbGQuZ2V0V2l0aEV4cGxpY2l0KCdvcmllbnQnKTtcblxuICAgICAgICBpZiAobWVyZ2VkT3JpZW50LmV4cGxpY2l0ICYmIGNoaWxkT3JpZW50LmV4cGxpY2l0ICYmIG1lcmdlZE9yaWVudC52YWx1ZSAhPT0gY2hpbGRPcmllbnQudmFsdWUpIHtcbiAgICAgICAgICAvLyBUT0RPOiB0aHJvdyB3YXJuaW5nIGlmIHJlc29sdmUgaXMgZXhwbGljaXQgKFdlIGRvbid0IGhhdmUgaW5mbyBhYm91dCBleHBsaWNpdC9pbXBsaWNpdCByZXNvbHZlIHlldC4pXG5cbiAgICAgICAgICAvLyBDYW5ub3QgbWVyZ2UgZHVlIHRvIGluY29uc2lzdGVudCBvcmllbnRcbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1lcmdlZEF4aXNDbXB0c1tpXSA9IG1lcmdlQXhpc0NvbXBvbmVudChtZXJnZWQsIGNoaWxkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBGb3IgZmlyc3Qgb25lLCByZXR1cm4gYSBjb3B5IG9mIHRoZSBjaGlsZFxuICAgIHJldHVybiBjaGlsZEF4aXNDbXB0cy5tYXAoYXhpc0NvbXBvbmVudCA9PiBheGlzQ29tcG9uZW50LmNsb25lKCkpO1xuICB9XG4gIHJldHVybiBtZXJnZWRBeGlzQ21wdHM7XG59XG5cbmZ1bmN0aW9uIG1lcmdlQXhpc0NvbXBvbmVudChtZXJnZWQ6IEF4aXNDb21wb25lbnQsIGNoaWxkOiBBeGlzQ29tcG9uZW50KTogQXhpc0NvbXBvbmVudCB7XG4gIGZvciAoY29uc3QgcHJvcCBvZiBWR19BWElTX1BST1BFUlRJRVMpIHtcbiAgICBjb25zdCBtZXJnZWRWYWx1ZVdpdGhFeHBsaWNpdCA9IG1lcmdlVmFsdWVzV2l0aEV4cGxpY2l0PFZnQXhpcywgYW55PihcbiAgICAgIG1lcmdlZC5nZXRXaXRoRXhwbGljaXQocHJvcCksXG4gICAgICBjaGlsZC5nZXRXaXRoRXhwbGljaXQocHJvcCksXG4gICAgICBwcm9wLCAnYXhpcycsXG5cbiAgICAgIC8vIFRpZSBicmVha2VyIGZ1bmN0aW9uXG4gICAgICAodjE6IEV4cGxpY2l0PGFueT4sIHYyOiBFeHBsaWNpdDxhbnk+KSA9PiB7XG4gICAgICAgIHN3aXRjaCAocHJvcCkge1xuICAgICAgICAgIGNhc2UgJ3RpdGxlJzpcbiAgICAgICAgICAgIHJldHVybiB0aXRsZU1lcmdlcih2MSwgdjIpO1xuICAgICAgICAgIGNhc2UgJ2dyaWRTY2FsZSc6XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBleHBsaWNpdDogdjEuZXhwbGljaXQsIC8vIGtlZXAgdGhlIG9sZCBleHBsaWNpdFxuICAgICAgICAgICAgICB2YWx1ZTogdjEudmFsdWUgfHwgdjIudmFsdWVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZmF1bHRUaWVCcmVha2VyPFZnQXhpcywgYW55Pih2MSwgdjIsIHByb3AsICdheGlzJyk7XG4gICAgICB9XG4gICAgKTtcbiAgICBtZXJnZWQuc2V0V2l0aEV4cGxpY2l0KHByb3AsIG1lcmdlZFZhbHVlV2l0aEV4cGxpY2l0KTtcbiAgfVxuICByZXR1cm4gbWVyZ2VkO1xufVxuXG5cbmZ1bmN0aW9uIHBhcnNlQXhpcyhjaGFubmVsOiBQb3NpdGlvblNjYWxlQ2hhbm5lbCwgbW9kZWw6IFVuaXRNb2RlbCk6IEF4aXNDb21wb25lbnQge1xuICBjb25zdCBheGlzID0gbW9kZWwuYXhpcyhjaGFubmVsKTtcblxuICBjb25zdCBheGlzQ29tcG9uZW50ID0gbmV3IEF4aXNDb21wb25lbnQoKTtcblxuICAvLyAxLjIuIEFkZCBwcm9wZXJ0aWVzXG4gIFZHX0FYSVNfUFJPUEVSVElFUy5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgY29uc3QgdmFsdWUgPSBnZXRQcm9wZXJ0eShwcm9wZXJ0eSwgYXhpcywgY2hhbm5lbCwgbW9kZWwpO1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBleHBsaWNpdCA9XG4gICAgICAgIC8vIHNwZWNpZmllZCBheGlzLnZhbHVlcyBpcyBhbHJlYWR5IHJlc3BlY3RlZCwgYnV0IG1heSBnZXQgdHJhbnNmb3JtZWQuXG4gICAgICAgIHByb3BlcnR5ID09PSAndmFsdWVzJyA/ICEhYXhpcy52YWx1ZXMgOlxuICAgICAgICAvLyBib3RoIFZMIGF4aXMuZW5jb2RpbmcgYW5kIGF4aXMubGFiZWxBbmdsZSBhZmZlY3QgVkcgYXhpcy5lbmNvZGVcbiAgICAgICAgcHJvcGVydHkgPT09ICdlbmNvZGUnID8gISFheGlzLmVuY29kaW5nIHx8ICEhYXhpcy5sYWJlbEFuZ2xlIDpcbiAgICAgICAgdmFsdWUgPT09IGF4aXNbcHJvcGVydHldO1xuXG4gICAgICBjb25zdCBjb25maWdWYWx1ZSA9IGdldEF4aXNDb25maWcocHJvcGVydHksIG1vZGVsLmNvbmZpZywgY2hhbm5lbCwgYXhpc0NvbXBvbmVudC5nZXQoJ29yaWVudCcpLCBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKS5nZXQoJ3R5cGUnKSk7XG5cbiAgICAgIC8vIG9ubHkgc2V0IHByb3BlcnR5IGlmIGl0IGlzIGV4cGxpY2l0bHkgc2V0IG9yIGhhcyBubyBjb25maWcgdmFsdWUgKG90aGVyd2lzZSB3ZSB3aWxsIGFjY2lkZW50YWxseSBvdmVycmlkZSBjb25maWcpXG4gICAgICBpZiAoZXhwbGljaXQgfHwgY29uZmlnVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBEbyBub3QgYXBwbHkgaW1wbGljaXQgcnVsZSBpZiB0aGVyZSBpcyBhIGNvbmZpZyB2YWx1ZVxuICAgICAgICBheGlzQ29tcG9uZW50LnNldChwcm9wZXJ0eSwgdmFsdWUsIGV4cGxpY2l0KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIC8vIDIpIEFkZCBndWlkZSBlbmNvZGUgZGVmaW5pdGlvbiBncm91cHNcbiAgY29uc3QgYXhpc0VuY29kaW5nID0gYXhpcy5lbmNvZGluZyB8fCB7fTtcbiAgY29uc3QgYXhpc0VuY29kZSA9IEFYSVNfUEFSVFMucmVkdWNlKChlOiBWZ0F4aXNFbmNvZGUsIHBhcnQpID0+IHtcbiAgICBpZiAoIWF4aXNDb21wb25lbnQuaGFzQXhpc1BhcnQocGFydCkpIHtcbiAgICAgIC8vIE5vIG5lZWQgdG8gY3JlYXRlIGVuY29kZSBmb3IgYSBkaXNhYmxlZCBwYXJ0LlxuICAgICAgcmV0dXJuIGU7XG4gICAgfVxuXG4gICAgY29uc3QgdmFsdWUgPSBwYXJ0ID09PSAnbGFiZWxzJyA/XG4gICAgICBlbmNvZGUubGFiZWxzKG1vZGVsLCBjaGFubmVsLCBheGlzRW5jb2RpbmcubGFiZWxzIHx8IHt9LCBheGlzQ29tcG9uZW50LmdldCgnb3JpZW50JykpIDpcbiAgICAgIGF4aXNFbmNvZGluZ1twYXJ0XSB8fCB7fTtcblxuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIGtleXModmFsdWUpLmxlbmd0aCA+IDApIHtcbiAgICAgIGVbcGFydF0gPSB7dXBkYXRlOiB2YWx1ZX07XG4gICAgfVxuICAgIHJldHVybiBlO1xuICB9LCB7fSBhcyBWZ0F4aXNFbmNvZGUpO1xuXG4gIC8vIEZJWE1FOiBCeSBoYXZpbmcgZW5jb2RlIGFzIG9uZSBwcm9wZXJ0eSwgd2Ugd29uJ3QgaGF2ZSBmaW5lIGdyYWluZWQgZW5jb2RlIG1lcmdpbmcuXG4gIGlmIChrZXlzKGF4aXNFbmNvZGUpLmxlbmd0aCA+IDApIHtcbiAgICBheGlzQ29tcG9uZW50LnNldCgnZW5jb2RlJywgYXhpc0VuY29kZSwgISFheGlzLmVuY29kaW5nIHx8IGF4aXMubGFiZWxBbmdsZSAhPT0gdW5kZWZpbmVkKTtcbiAgfVxuXG4gIHJldHVybiBheGlzQ29tcG9uZW50O1xufVxuXG5mdW5jdGlvbiBnZXRQcm9wZXJ0eTxLIGV4dGVuZHMga2V5b2YgQXhpc0NvbXBvbmVudFByb3BzPihwcm9wZXJ0eTogSywgc3BlY2lmaWVkQXhpczogQXhpcywgY2hhbm5lbDogUG9zaXRpb25TY2FsZUNoYW5uZWwsIG1vZGVsOiBVbml0TW9kZWwpOiBBeGlzQ29tcG9uZW50UHJvcHNbS10ge1xuICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuICBzd2l0Y2ggKHByb3BlcnR5KSB7XG4gICAgY2FzZSAnc2NhbGUnOlxuICAgICAgcmV0dXJuIG1vZGVsLnNjYWxlTmFtZShjaGFubmVsKTtcbiAgICBjYXNlICdncmlkU2NhbGUnOlxuICAgICAgcmV0dXJuIHByb3BlcnRpZXMuZ3JpZFNjYWxlKG1vZGVsLCBjaGFubmVsKTtcbiAgICBjYXNlICdmb3JtYXQnOlxuICAgICAgLy8gV2UgZG9uJ3QgaW5jbHVkZSB0ZW1wb3JhbCBmaWVsZCBoZXJlIGFzIHdlIGFwcGx5IGZvcm1hdCBpbiBlbmNvZGUgYmxvY2tcbiAgICAgIHJldHVybiBudW1iZXJGb3JtYXQoZmllbGREZWYsIHNwZWNpZmllZEF4aXMuZm9ybWF0LCBtb2RlbC5jb25maWcpO1xuICAgIGNhc2UgJ2dyaWQnOiB7XG4gICAgICBjb25zdCBzY2FsZVR5cGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKS5nZXQoJ3R5cGUnKTtcbiAgICAgIHJldHVybiBnZXRTcGVjaWZpZWRPckRlZmF1bHRWYWx1ZShzcGVjaWZpZWRBeGlzLmdyaWQsIHByb3BlcnRpZXMuZ3JpZChzY2FsZVR5cGUsIGZpZWxkRGVmKSk7XG4gICAgfVxuICAgIGNhc2UgJ2xhYmVsRmx1c2gnOlxuICAgICAgcmV0dXJuIHByb3BlcnRpZXMubGFiZWxGbHVzaChmaWVsZERlZiwgY2hhbm5lbCwgc3BlY2lmaWVkQXhpcyk7XG4gICAgY2FzZSAnbGFiZWxPdmVybGFwJzoge1xuICAgICAgY29uc3Qgc2NhbGVUeXBlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCkuZ2V0KCd0eXBlJyk7XG4gICAgICByZXR1cm4gcHJvcGVydGllcy5sYWJlbE92ZXJsYXAoZmllbGREZWYsIHNwZWNpZmllZEF4aXMsIGNoYW5uZWwsIHNjYWxlVHlwZSk7XG4gICAgfVxuICAgIGNhc2UgJ29yaWVudCc6XG4gICAgICByZXR1cm4gZ2V0U3BlY2lmaWVkT3JEZWZhdWx0VmFsdWUoc3BlY2lmaWVkQXhpcy5vcmllbnQsIHByb3BlcnRpZXMub3JpZW50KGNoYW5uZWwpKTtcbiAgICBjYXNlICd0aWNrQ291bnQnOiB7XG4gICAgICBjb25zdCBzY2FsZVR5cGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKS5nZXQoJ3R5cGUnKTtcbiAgICAgIGNvbnN0IHNpemVUeXBlID0gY2hhbm5lbCA9PT0gJ3gnID8gJ3dpZHRoJyA6IGNoYW5uZWwgPT09ICd5JyA/ICdoZWlnaHQnIDogdW5kZWZpbmVkO1xuICAgICAgY29uc3Qgc2l6ZSA9IHNpemVUeXBlID8gbW9kZWwuZ2V0U2l6ZVNpZ25hbFJlZihzaXplVHlwZSlcbiAgICAgICA6IHVuZGVmaW5lZDtcbiAgICAgIHJldHVybiBnZXRTcGVjaWZpZWRPckRlZmF1bHRWYWx1ZShzcGVjaWZpZWRBeGlzLnRpY2tDb3VudCwgcHJvcGVydGllcy50aWNrQ291bnQoY2hhbm5lbCwgZmllbGREZWYsIHNjYWxlVHlwZSwgc2l6ZSkpO1xuICAgIH1cbiAgICBjYXNlICd0aXRsZSc6XG4gICAgICBjb25zdCBjaGFubmVsMiA9IGNoYW5uZWwgPT09ICd4JyA/ICd4MicgOiAneTInO1xuICAgICAgY29uc3QgZmllbGREZWYyID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbDIpO1xuICAgICAgLy8gS2VlcCB1bmRlZmluZWQgc28gd2UgdXNlIGRlZmF1bHQgaWYgdGl0bGUgaXMgdW5zcGVjaWZpZWQuXG4gICAgICAvLyBGb3Igb3RoZXIgZmFsc3kgdmFsdWUsIGtlZXAgdGhlbSBzbyB3ZSB3aWxsIGhpZGUgdGhlIHRpdGxlLlxuICAgICAgY29uc3Qgc3BlY2lmaWVkVGl0bGUgPSBmaWVsZERlZi50aXRsZSAhPT0gdW5kZWZpbmVkID8gZmllbGREZWYudGl0bGUgOlxuICAgICAgICBzcGVjaWZpZWRBeGlzLnRpdGxlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBzcGVjaWZpZWRBeGlzLnRpdGxlO1xuXG4gICAgICByZXR1cm4gZ2V0U3BlY2lmaWVkT3JEZWZhdWx0VmFsdWU8c3RyaW5nIHwgRmllbGREZWZCYXNlPHN0cmluZz5bXT4oXG4gICAgICAgIHNwZWNpZmllZFRpdGxlLFxuICAgICAgICAvLyBJZiB0aXRsZSBub3Qgc3BlY2lmaWVkLCBzdG9yZSBiYXNlIHBhcnRzIG9mIGZpZWxkRGVmIChhbmQgZmllbGREZWYyIGlmIGV4aXN0cylcbiAgICAgICAgbWVyZ2VUaXRsZUZpZWxkRGVmcyhcbiAgICAgICAgICBbdG9GaWVsZERlZkJhc2UoZmllbGREZWYpXSxcbiAgICAgICAgICBmaWVsZERlZjIgPyBbdG9GaWVsZERlZkJhc2UoZmllbGREZWYyKV0gOiBbXVxuICAgICAgICApXG4gICAgICApO1xuICAgIGNhc2UgJ3ZhbHVlcyc6XG4gICAgICByZXR1cm4gcHJvcGVydGllcy52YWx1ZXMoc3BlY2lmaWVkQXhpcywgbW9kZWwsIGZpZWxkRGVmKTtcbiAgfVxuICAvLyBPdGhlcndpc2UsIHJldHVybiBzcGVjaWZpZWQgcHJvcGVydHkuXG4gIHJldHVybiBpc0F4aXNQcm9wZXJ0eShwcm9wZXJ0eSkgPyBzcGVjaWZpZWRBeGlzW3Byb3BlcnR5XSA6IHVuZGVmaW5lZDtcbn1cbiJdfQ==