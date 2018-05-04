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
            return properties.values(specifiedAxis, model, fieldDef, channel);
    }
    // Otherwise, return specified property.
    return isAxisProperty(property) ? specifiedAxis[property] : undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9heGlzL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBTyxVQUFVLEVBQWdCLGNBQWMsRUFBRSxrQkFBa0IsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUM5RixPQUFPLEVBQUMsdUJBQXVCLEVBQXdCLENBQUMsRUFBRSxDQUFDLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDbEYsT0FBTyxFQUFlLGNBQWMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzVELE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFaEMsT0FBTyxFQUFDLDBCQUEwQixFQUFFLG1CQUFtQixFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFFckcsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQzdDLE9BQU8sRUFBQyxpQkFBaUIsRUFBWSx1QkFBdUIsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUU5RSxPQUFPLEVBQUMsYUFBYSxFQUF5QyxNQUFNLGFBQWEsQ0FBQztBQUNsRixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ3ZDLE9BQU8sS0FBSyxNQUFNLE1BQU0sVUFBVSxDQUFDO0FBQ25DLE9BQU8sS0FBSyxVQUFVLE1BQU0sY0FBYyxDQUFDO0FBRzNDLE1BQU0sd0JBQXdCLEtBQWdCO0lBQzVDLE9BQU8sdUJBQXVCLENBQUMsTUFBTSxDQUFDLFVBQVMsSUFBSSxFQUFFLE9BQU87UUFDMUQsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQzFELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMs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SyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO1lBRXRFLE9BQU8sMEJBQTBCLENBQy9CLGNBQWM7WUFDZCxpRkFBaUY7WUFDakYsbUJBQW1CLENBQ2pCLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQzFCLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUM3QyxDQUNGLENBQUM7UUFDSixLQUFLLFFBQVE7WUFDWCxPQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDckU7SUFDRCx3Q0FBd0M7SUFDeEMsT0FBTyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0FBQ3hFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0F4aXMsIEFYSVNfUEFSVFMsIEF4aXNFbmNvZGluZywgaXNBeGlzUHJvcGVydHksIFZHX0FYSVNfUFJPUEVSVElFU30gZnJvbSAnLi4vLi4vYXhpcyc7XG5pbXBvcnQge1BPU0lUSU9OX1NDQUxFX0NIQU5ORUxTLCBQb3NpdGlvblNjYWxlQ2hhbm5lbCwgWCwgWX0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge0ZpZWxkRGVmQmFzZSwgdG9GaWVsZERlZkJhc2V9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7a2V5c30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge0F4aXNPcmllbnQsIFZnQXhpcywgVmdBeGlzRW5jb2RlfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2dldFNwZWNpZmllZE9yRGVmYXVsdFZhbHVlLCBtZXJnZVRpdGxlRmllbGREZWZzLCBudW1iZXJGb3JtYXQsIHRpdGxlTWVyZ2VyfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtMYXllck1vZGVsfSBmcm9tICcuLi9sYXllcic7XG5pbXBvcnQge3BhcnNlR3VpZGVSZXNvbHZlfSBmcm9tICcuLi9yZXNvbHZlJztcbmltcG9ydCB7ZGVmYXVsdFRpZUJyZWFrZXIsIEV4cGxpY2l0LCBtZXJnZVZhbHVlc1dpdGhFeHBsaWNpdH0gZnJvbSAnLi4vc3BsaXQnO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uL3VuaXQnO1xuaW1wb3J0IHtBeGlzQ29tcG9uZW50LCBBeGlzQ29tcG9uZW50SW5kZXgsIEF4aXNDb21wb25lbnRQcm9wc30gZnJvbSAnLi9jb21wb25lbnQnO1xuaW1wb3J0IHtnZXRBeGlzQ29uZmlnfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgKiBhcyBlbmNvZGUgZnJvbSAnLi9lbmNvZGUnO1xuaW1wb3J0ICogYXMgcHJvcGVydGllcyBmcm9tICcuL3Byb3BlcnRpZXMnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVVuaXRBeGlzKG1vZGVsOiBVbml0TW9kZWwpOiBBeGlzQ29tcG9uZW50SW5kZXgge1xuICByZXR1cm4gUE9TSVRJT05fU0NBTEVfQ0hBTk5FTFMucmVkdWNlKGZ1bmN0aW9uKGF4aXMsIGNoYW5uZWwpIHtcbiAgICBpZiAobW9kZWwuY29tcG9uZW50LnNjYWxlc1tjaGFubmVsXSAmJiBtb2RlbC5heGlzKGNoYW5uZWwpKSB7XG4gICAgICBheGlzW2NoYW5uZWxdID0gW3BhcnNlQXhpcyhjaGFubmVsLCBtb2RlbCldO1xuICAgIH1cbiAgICByZXR1cm4gYXhpcztcbiAgfSwge30gYXMgQXhpc0NvbXBvbmVudEluZGV4KTtcbn1cblxuY29uc3QgT1BQT1NJVEVfT1JJRU5UOiB7W0sgaW4gQXhpc09yaWVudF06IEF4aXNPcmllbnR9ID0ge1xuICBib3R0b206ICd0b3AnLFxuICB0b3A6ICdib3R0b20nLFxuICBsZWZ0OiAncmlnaHQnLFxuICByaWdodDogJ2xlZnQnXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VMYXllckF4aXMobW9kZWw6IExheWVyTW9kZWwpIHtcbiAgY29uc3Qge2F4ZXMsIHJlc29sdmV9ID0gbW9kZWwuY29tcG9uZW50O1xuICBjb25zdCBheGlzQ291bnQ6IHtcbiAgICAvLyBVc2luZyBNYXBwZWQgVHlwZSB0byBkZWNsYXJlIHR5cGUgKGh0dHBzOi8vd3d3LnR5cGVzY3JpcHRsYW5nLm9yZy9kb2NzL2hhbmRib29rL2FkdmFuY2VkLXR5cGVzLmh0bWwjbWFwcGVkLXR5cGVzKVxuICAgIFtrIGluIEF4aXNPcmllbnRdOiBudW1iZXJcbiAgfSA9IHt0b3A6IDAsIGJvdHRvbTogMCwgcmlnaHQ6IDAsIGxlZnQ6IDB9O1xuXG4gIGZvciAoY29uc3QgY2hpbGQgb2YgbW9kZWwuY2hpbGRyZW4pIHtcbiAgICBjaGlsZC5wYXJzZUF4aXNBbmRIZWFkZXIoKTtcblxuICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBrZXlzKGNoaWxkLmNvbXBvbmVudC5heGVzKSkge1xuICAgICAgcmVzb2x2ZS5heGlzW2NoYW5uZWxdID0gcGFyc2VHdWlkZVJlc29sdmUobW9kZWwuY29tcG9uZW50LnJlc29sdmUsIGNoYW5uZWwpO1xuICAgICAgaWYgKHJlc29sdmUuYXhpc1tjaGFubmVsXSA9PT0gJ3NoYXJlZCcpIHtcbiAgICAgICAgLy8gSWYgdGhlIHJlc29sdmUgc2F5cyBzaGFyZWQgKGFuZCBoYXMgbm90IGJlZW4gb3ZlcnJpZGRlbilcbiAgICAgICAgLy8gV2Ugd2lsbCB0cnkgdG8gbWVyZ2UgYW5kIHNlZSBpZiB0aGVyZSBpcyBhIGNvbmZsaWN0XG5cbiAgICAgICAgYXhlc1tjaGFubmVsXSA9IG1lcmdlQXhpc0NvbXBvbmVudHMoYXhlc1tjaGFubmVsXSwgY2hpbGQuY29tcG9uZW50LmF4ZXNbY2hhbm5lbF0pO1xuXG4gICAgICAgIGlmICghYXhlc1tjaGFubmVsXSkge1xuICAgICAgICAgIC8vIElmIG1lcmdlIHJldHVybnMgbm90aGluZywgdGhlcmUgaXMgYSBjb25mbGljdCBzbyB3ZSBjYW5ub3QgbWFrZSB0aGUgYXhpcyBzaGFyZWQuXG4gICAgICAgICAgLy8gVGh1cywgbWFyayBheGlzIGFzIGluZGVwZW5kZW50IGFuZCByZW1vdmUgdGhlIGF4aXMgY29tcG9uZW50LlxuICAgICAgICAgIHJlc29sdmUuYXhpc1tjaGFubmVsXSA9ICdpbmRlcGVuZGVudCc7XG4gICAgICAgICAgZGVsZXRlIGF4ZXNbY2hhbm5lbF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBNb3ZlIGF4ZXMgdG8gbGF5ZXIncyBheGlzIGNvbXBvbmVudCBhbmQgbWVyZ2Ugc2hhcmVkIGF4ZXNcbiAgZm9yIChjb25zdCBjaGFubmVsIG9mIFtYLCBZXSkge1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgbW9kZWwuY2hpbGRyZW4pIHtcbiAgICAgIGlmICghY2hpbGQuY29tcG9uZW50LmF4ZXNbY2hhbm5lbF0pIHtcbiAgICAgICAgLy8gc2tpcCBpZiB0aGUgY2hpbGQgZG9lcyBub3QgaGF2ZSBhIHBhcnRpY3VsYXIgYXhpc1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlc29sdmUuYXhpc1tjaGFubmVsXSA9PT0gJ2luZGVwZW5kZW50Jykge1xuICAgICAgICAvLyBJZiBheGVzIGFyZSBpbmRlcGVuZGVudCwgY29uY2F0IHRoZSBheGlzQ29tcG9uZW50IGFycmF5LlxuICAgICAgICBheGVzW2NoYW5uZWxdID0gKGF4ZXNbY2hhbm5lbF0gfHwgW10pLmNvbmNhdChjaGlsZC5jb21wb25lbnQuYXhlc1tjaGFubmVsXSk7XG5cbiAgICAgICAgLy8gQXV0b21hdGljYWxseSBhZGp1c3Qgb3JpZW50XG4gICAgICAgIGZvciAoY29uc3QgYXhpc0NvbXBvbmVudCBvZiBjaGlsZC5jb21wb25lbnQuYXhlc1tjaGFubmVsXSkge1xuICAgICAgICAgIGNvbnN0IHt2YWx1ZTogb3JpZW50LCBleHBsaWNpdH0gPSBheGlzQ29tcG9uZW50LmdldFdpdGhFeHBsaWNpdCgnb3JpZW50Jyk7XG4gICAgICAgICAgaWYgKGF4aXNDb3VudFtvcmllbnRdID4gMCAmJiAhZXhwbGljaXQpIHtcbiAgICAgICAgICAgIC8vIENoYW5nZSBheGlzIG9yaWVudCBpZiB0aGUgbnVtYmVyIGRvIG5vdCBtYXRjaFxuICAgICAgICAgICAgY29uc3Qgb3Bwb3NpdGVPcmllbnQgPSBPUFBPU0lURV9PUklFTlRbb3JpZW50XTtcbiAgICAgICAgICAgIGlmIChheGlzQ291bnRbb3JpZW50XSA+IGF4aXNDb3VudFtvcHBvc2l0ZU9yaWVudF0pIHtcbiAgICAgICAgICAgICAgYXhpc0NvbXBvbmVudC5zZXQoJ29yaWVudCcsIG9wcG9zaXRlT3JpZW50LCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGF4aXNDb3VudFtvcmllbnRdKys7XG5cbiAgICAgICAgICAvLyBUT0RPKGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EtbGl0ZS9pc3N1ZXMvMjYzNCk6IGF1dG9tYXRpY2FseSBhZGQgZXh0cmEgb2Zmc2V0P1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEFmdGVyIG1lcmdpbmcsIG1ha2Ugc3VyZSB0byByZW1vdmUgYXhlcyBmcm9tIGNoaWxkXG4gICAgICBkZWxldGUgY2hpbGQuY29tcG9uZW50LmF4ZXNbY2hhbm5lbF07XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG1lcmdlQXhpc0NvbXBvbmVudHMobWVyZ2VkQXhpc0NtcHRzOiBBeGlzQ29tcG9uZW50W10sIGNoaWxkQXhpc0NtcHRzOiBBeGlzQ29tcG9uZW50W10pOiBBeGlzQ29tcG9uZW50W10ge1xuICBpZiAobWVyZ2VkQXhpc0NtcHRzKSB7XG4gICAgLy8gRklYTUU6IHRoaXMgaXMgYSBiaXQgd3Jvbmcgb25jZSB3ZSBzdXBwb3J0IG11bHRpcGxlIGF4ZXNcbiAgICBpZiAobWVyZ2VkQXhpc0NtcHRzLmxlbmd0aCAhPT0gY2hpbGRBeGlzQ21wdHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkOyAvLyBDYW5ub3QgbWVyZ2UgYXhpcyBjb21wb25lbnQgd2l0aCBkaWZmZXJlbnQgbnVtYmVyIG9mIGF4ZXMuXG4gICAgfVxuICAgIGNvbnN0IGxlbmd0aCA9IG1lcmdlZEF4aXNDbXB0cy5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGggOyBpKyspIHtcbiAgICAgIGNvbnN0IG1lcmdlZCA9IG1lcmdlZEF4aXNDbXB0c1tpXTtcbiAgICAgIGNvbnN0IGNoaWxkID0gY2hpbGRBeGlzQ21wdHNbaV07XG5cbiAgICAgIGlmICgoISFtZXJnZWQpICE9PSAoISFjaGlsZCkpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH0gZWxzZSBpZiAobWVyZ2VkICYmIGNoaWxkKSB7XG4gICAgICAgIGNvbnN0IG1lcmdlZE9yaWVudCA9IG1lcmdlZC5nZXRXaXRoRXhwbGljaXQoJ29yaWVudCcpO1xuICAgICAgICBjb25zdCBjaGlsZE9yaWVudCA9IGNoaWxkLmdldFdpdGhFeHBsaWNpdCgnb3JpZW50Jyk7XG5cbiAgICAgICAgaWYgKG1lcmdlZE9yaWVudC5leHBsaWNpdCAmJiBjaGlsZE9yaWVudC5leHBsaWNpdCAmJiBtZXJnZWRPcmllbnQudmFsdWUgIT09IGNoaWxkT3JpZW50LnZhbHVlKSB7XG4gICAgICAgICAgLy8gVE9ETzogdGhyb3cgd2FybmluZyBpZiByZXNvbHZlIGlzIGV4cGxpY2l0IChXZSBkb24ndCBoYXZlIGluZm8gYWJvdXQgZXhwbGljaXQvaW1wbGljaXQgcmVzb2x2ZSB5ZXQuKVxuXG4gICAgICAgICAgLy8gQ2Fubm90IG1lcmdlIGR1ZSB0byBpbmNvbnNpc3RlbnQgb3JpZW50XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZXJnZWRBeGlzQ21wdHNbaV0gPSBtZXJnZUF4aXNDb21wb25lbnQobWVyZ2VkLCBjaGlsZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gRm9yIGZpcnN0IG9uZSwgcmV0dXJuIGEgY29weSBvZiB0aGUgY2hpbGRcbiAgICByZXR1cm4gY2hpbGRBeGlzQ21wdHMubWFwKGF4aXNDb21wb25lbnQgPT4gYXhpc0NvbXBvbmVudC5jbG9uZSgpKTtcbiAgfVxuICByZXR1cm4gbWVyZ2VkQXhpc0NtcHRzO1xufVxuXG5mdW5jdGlvbiBtZXJnZUF4aXNDb21wb25lbnQobWVyZ2VkOiBBeGlzQ29tcG9uZW50LCBjaGlsZDogQXhpc0NvbXBvbmVudCk6IEF4aXNDb21wb25lbnQge1xuICBmb3IgKGNvbnN0IHByb3Agb2YgVkdfQVhJU19QUk9QRVJUSUVTKSB7XG4gICAgY29uc3QgbWVyZ2VkVmFsdWVXaXRoRXhwbGljaXQgPSBtZXJnZVZhbHVlc1dpdGhFeHBsaWNpdDxWZ0F4aXMsIGFueT4oXG4gICAgICBtZXJnZWQuZ2V0V2l0aEV4cGxpY2l0KHByb3ApLFxuICAgICAgY2hpbGQuZ2V0V2l0aEV4cGxpY2l0KHByb3ApLFxuICAgICAgcHJvcCwgJ2F4aXMnLFxuXG4gICAgICAvLyBUaWUgYnJlYWtlciBmdW5jdGlvblxuICAgICAgKHYxOiBFeHBsaWNpdDxhbnk+LCB2MjogRXhwbGljaXQ8YW55PikgPT4ge1xuICAgICAgICBzd2l0Y2ggKHByb3ApIHtcbiAgICAgICAgICBjYXNlICd0aXRsZSc6XG4gICAgICAgICAgICByZXR1cm4gdGl0bGVNZXJnZXIodjEsIHYyKTtcbiAgICAgICAgICBjYXNlICdncmlkU2NhbGUnOlxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgZXhwbGljaXQ6IHYxLmV4cGxpY2l0LCAvLyBrZWVwIHRoZSBvbGQgZXhwbGljaXRcbiAgICAgICAgICAgICAgdmFsdWU6IHYxLnZhbHVlIHx8IHYyLnZhbHVlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWZhdWx0VGllQnJlYWtlcjxWZ0F4aXMsIGFueT4odjEsIHYyLCBwcm9wLCAnYXhpcycpO1xuICAgICAgfVxuICAgICk7XG4gICAgbWVyZ2VkLnNldFdpdGhFeHBsaWNpdChwcm9wLCBtZXJnZWRWYWx1ZVdpdGhFeHBsaWNpdCk7XG4gIH1cbiAgcmV0dXJuIG1lcmdlZDtcbn1cblxuXG5mdW5jdGlvbiBwYXJzZUF4aXMoY2hhbm5lbDogUG9zaXRpb25TY2FsZUNoYW5uZWwsIG1vZGVsOiBVbml0TW9kZWwpOiBBeGlzQ29tcG9uZW50IHtcbiAgY29uc3QgYXhpcyA9IG1vZGVsLmF4aXMoY2hhbm5lbCk7XG5cbiAgY29uc3QgYXhpc0NvbXBvbmVudCA9IG5ldyBBeGlzQ29tcG9uZW50KCk7XG5cbiAgLy8gMS4yLiBBZGQgcHJvcGVydGllc1xuICBWR19BWElTX1BST1BFUlRJRVMuZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgIGNvbnN0IHZhbHVlID0gZ2V0UHJvcGVydHkocHJvcGVydHksIGF4aXMsIGNoYW5uZWwsIG1vZGVsKTtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgZXhwbGljaXQgPVxuICAgICAgICAvLyBzcGVjaWZpZWQgYXhpcy52YWx1ZXMgaXMgYWxyZWFkeSByZXNwZWN0ZWQsIGJ1dCBtYXkgZ2V0IHRyYW5zZm9ybWVkLlxuICAgICAgICBwcm9wZXJ0eSA9PT0gJ3ZhbHVlcycgPyAhIWF4aXMudmFsdWVzIDpcbiAgICAgICAgLy8gYm90aCBWTCBheGlzLmVuY29kaW5nIGFuZCBheGlzLmxhYmVsQW5nbGUgYWZmZWN0IFZHIGF4aXMuZW5jb2RlXG4gICAgICAgIHByb3BlcnR5ID09PSAnZW5jb2RlJyA/ICEhYXhpcy5lbmNvZGluZyB8fCAhIWF4aXMubGFiZWxBbmdsZSA6XG4gICAgICAgIHZhbHVlID09PSBheGlzW3Byb3BlcnR5XTtcblxuICAgICAgY29uc3QgY29uZmlnVmFsdWUgPSBnZXRBeGlzQ29uZmlnKHByb3BlcnR5LCBtb2RlbC5jb25maWcsIGNoYW5uZWwsIGF4aXNDb21wb25lbnQuZ2V0KCdvcmllbnQnKSwgbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCkuZ2V0KCd0eXBlJykpO1xuXG4gICAgICAvLyBvbmx5IHNldCBwcm9wZXJ0eSBpZiBpdCBpcyBleHBsaWNpdGx5IHNldCBvciBoYXMgbm8gY29uZmlnIHZhbHVlIChvdGhlcndpc2Ugd2Ugd2lsbCBhY2NpZGVudGFsbHkgb3ZlcnJpZGUgY29uZmlnKVxuICAgICAgaWYgKGV4cGxpY2l0IHx8IGNvbmZpZ1ZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gRG8gbm90IGFwcGx5IGltcGxpY2l0IHJ1bGUgaWYgdGhlcmUgaXMgYSBjb25maWcgdmFsdWVcbiAgICAgICAgYXhpc0NvbXBvbmVudC5zZXQocHJvcGVydHksIHZhbHVlLCBleHBsaWNpdCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvLyAyKSBBZGQgZ3VpZGUgZW5jb2RlIGRlZmluaXRpb24gZ3JvdXBzXG4gIGNvbnN0IGF4aXNFbmNvZGluZyA9IGF4aXMuZW5jb2RpbmcgfHwge307XG4gIGNvbnN0IGF4aXNFbmNvZGUgPSBBWElTX1BBUlRTLnJlZHVjZSgoZTogVmdBeGlzRW5jb2RlLCBwYXJ0KSA9PiB7XG4gICAgaWYgKCFheGlzQ29tcG9uZW50Lmhhc0F4aXNQYXJ0KHBhcnQpKSB7XG4gICAgICAvLyBObyBuZWVkIHRvIGNyZWF0ZSBlbmNvZGUgZm9yIGEgZGlzYWJsZWQgcGFydC5cbiAgICAgIHJldHVybiBlO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlID0gcGFydCA9PT0gJ2xhYmVscycgP1xuICAgICAgZW5jb2RlLmxhYmVscyhtb2RlbCwgY2hhbm5lbCwgYXhpc0VuY29kaW5nLmxhYmVscyB8fCB7fSwgYXhpc0NvbXBvbmVudC5nZXQoJ29yaWVudCcpKSA6XG4gICAgICBheGlzRW5jb2RpbmdbcGFydF0gfHwge307XG5cbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCAmJiBrZXlzKHZhbHVlKS5sZW5ndGggPiAwKSB7XG4gICAgICBlW3BhcnRdID0ge3VwZGF0ZTogdmFsdWV9O1xuICAgIH1cbiAgICByZXR1cm4gZTtcbiAgfSwge30gYXMgVmdBeGlzRW5jb2RlKTtcblxuICAvLyBGSVhNRTogQnkgaGF2aW5nIGVuY29kZSBhcyBvbmUgcHJvcGVydHksIHdlIHdvbid0IGhhdmUgZmluZSBncmFpbmVkIGVuY29kZSBtZXJnaW5nLlxuICBpZiAoa2V5cyhheGlzRW5jb2RlKS5sZW5ndGggPiAwKSB7XG4gICAgYXhpc0NvbXBvbmVudC5zZXQoJ2VuY29kZScsIGF4aXNFbmNvZGUsICEhYXhpcy5lbmNvZGluZyB8fCBheGlzLmxhYmVsQW5nbGUgIT09IHVuZGVmaW5lZCk7XG4gIH1cblxuICByZXR1cm4gYXhpc0NvbXBvbmVudDtcbn1cblxuZnVuY3Rpb24gZ2V0UHJvcGVydHk8SyBleHRlbmRzIGtleW9mIEF4aXNDb21wb25lbnRQcm9wcz4ocHJvcGVydHk6IEssIHNwZWNpZmllZEF4aXM6IEF4aXMsIGNoYW5uZWw6IFBvc2l0aW9uU2NhbGVDaGFubmVsLCBtb2RlbDogVW5pdE1vZGVsKTogQXhpc0NvbXBvbmVudFByb3BzW0tdIHtcbiAgY29uc3QgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcbiAgc3dpdGNoIChwcm9wZXJ0eSkge1xuICAgIGNhc2UgJ3NjYWxlJzpcbiAgICAgIHJldHVybiBtb2RlbC5zY2FsZU5hbWUoY2hhbm5lbCk7XG4gICAgY2FzZSAnZ3JpZFNjYWxlJzpcbiAgICAgIHJldHVybiBwcm9wZXJ0aWVzLmdyaWRTY2FsZShtb2RlbCwgY2hhbm5lbCk7XG4gICAgY2FzZSAnZm9ybWF0JzpcbiAgICAgIC8vIFdlIGRvbid0IGluY2x1ZGUgdGVtcG9yYWwgZmllbGQgaGVyZSBhcyB3ZSBhcHBseSBmb3JtYXQgaW4gZW5jb2RlIGJsb2NrXG4gICAgICByZXR1cm4gbnVtYmVyRm9ybWF0KGZpZWxkRGVmLCBzcGVjaWZpZWRBeGlzLmZvcm1hdCwgbW9kZWwuY29uZmlnKTtcbiAgICBjYXNlICdncmlkJzoge1xuICAgICAgY29uc3Qgc2NhbGVUeXBlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCkuZ2V0KCd0eXBlJyk7XG4gICAgICByZXR1cm4gZ2V0U3BlY2lmaWVkT3JEZWZhdWx0VmFsdWUoc3BlY2lmaWVkQXhpcy5ncmlkLCBwcm9wZXJ0aWVzLmdyaWQoc2NhbGVUeXBlLCBmaWVsZERlZikpO1xuICAgIH1cbiAgICBjYXNlICdsYWJlbEZsdXNoJzpcbiAgICAgIHJldHVybiBwcm9wZXJ0aWVzLmxhYmVsRmx1c2goZmllbGREZWYsIGNoYW5uZWwsIHNwZWNpZmllZEF4aXMpO1xuICAgIGNhc2UgJ2xhYmVsT3ZlcmxhcCc6IHtcbiAgICAgIGNvbnN0IHNjYWxlVHlwZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpLmdldCgndHlwZScpO1xuICAgICAgcmV0dXJuIHByb3BlcnRpZXMubGFiZWxPdmVybGFwKGZpZWxkRGVmLCBzcGVjaWZpZWRBeGlzLCBjaGFubmVsLCBzY2FsZVR5cGUpO1xuICAgIH1cbiAgICBjYXNlICdvcmllbnQnOlxuICAgICAgcmV0dXJuIGdldFNwZWNpZmllZE9yRGVmYXVsdFZhbHVlKHNwZWNpZmllZEF4aXMub3JpZW50LCBwcm9wZXJ0aWVzLm9yaWVudChjaGFubmVsKSk7XG4gICAgY2FzZSAndGlja0NvdW50Jzoge1xuICAgICAgY29uc3Qgc2NhbGVUeXBlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCkuZ2V0KCd0eXBlJyk7XG4gICAgICBjb25zdCBzaXplVHlwZSA9IGNoYW5uZWwgPT09ICd4JyA/ICd3aWR0aCcgOiBjaGFubmVsID09PSAneScgPyAnaGVpZ2h0JyA6IHVuZGVmaW5lZDtcbiAgICAgIGNvbnN0IHNpemUgPSBzaXplVHlwZSA/IG1vZGVsLmdldFNpemVTaWduYWxSZWYoc2l6ZVR5cGUpXG4gICAgICAgOiB1bmRlZmluZWQ7XG4gICAgICByZXR1cm4gZ2V0U3BlY2lmaWVkT3JEZWZhdWx0VmFsdWUoc3BlY2lmaWVkQXhpcy50aWNrQ291bnQsIHByb3BlcnRpZXMudGlja0NvdW50KGNoYW5uZWwsIGZpZWxkRGVmLCBzY2FsZVR5cGUsIHNpemUpKTtcbiAgICB9XG4gICAgY2FzZSAndGl0bGUnOlxuICAgICAgY29uc3QgY2hhbm5lbDIgPSBjaGFubmVsID09PSAneCcgPyAneDInIDogJ3kyJztcbiAgICAgIGNvbnN0IGZpZWxkRGVmMiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwyKTtcbiAgICAgIC8vIEtlZXAgdW5kZWZpbmVkIHNvIHdlIHVzZSBkZWZhdWx0IGlmIHRpdGxlIGlzIHVuc3BlY2lmaWVkLlxuICAgICAgLy8gRm9yIG90aGVyIGZhbHN5IHZhbHVlLCBrZWVwIHRoZW0gc28gd2Ugd2lsbCBoaWRlIHRoZSB0aXRsZS5cbiAgICAgIGNvbnN0IHNwZWNpZmllZFRpdGxlID0gZmllbGREZWYudGl0bGUgIT09IHVuZGVmaW5lZCA/IGZpZWxkRGVmLnRpdGxlIDpcbiAgICAgICAgc3BlY2lmaWVkQXhpcy50aXRsZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogc3BlY2lmaWVkQXhpcy50aXRsZTtcblxuICAgICAgcmV0dXJuIGdldFNwZWNpZmllZE9yRGVmYXVsdFZhbHVlPHN0cmluZyB8IEZpZWxkRGVmQmFzZTxzdHJpbmc+W10+KFxuICAgICAgICBzcGVjaWZpZWRUaXRsZSxcbiAgICAgICAgLy8gSWYgdGl0bGUgbm90IHNwZWNpZmllZCwgc3RvcmUgYmFzZSBwYXJ0cyBvZiBmaWVsZERlZiAoYW5kIGZpZWxkRGVmMiBpZiBleGlzdHMpXG4gICAgICAgIG1lcmdlVGl0bGVGaWVsZERlZnMoXG4gICAgICAgICAgW3RvRmllbGREZWZCYXNlKGZpZWxkRGVmKV0sXG4gICAgICAgICAgZmllbGREZWYyID8gW3RvRmllbGREZWZCYXNlKGZpZWxkRGVmMildIDogW11cbiAgICAgICAgKVxuICAgICAgKTtcbiAgICBjYXNlICd2YWx1ZXMnOlxuICAgICAgcmV0dXJuIHByb3BlcnRpZXMudmFsdWVzKHNwZWNpZmllZEF4aXMsIG1vZGVsLCBmaWVsZERlZiwgY2hhbm5lbCk7XG4gIH1cbiAgLy8gT3RoZXJ3aXNlLCByZXR1cm4gc3BlY2lmaWVkIHByb3BlcnR5LlxuICByZXR1cm4gaXNBeGlzUHJvcGVydHkocHJvcGVydHkpID8gc3BlY2lmaWVkQXhpc1twcm9wZXJ0eV0gOiB1bmRlZmluZWQ7XG59XG4iXX0=