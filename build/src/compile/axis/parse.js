import { AXIS_PARTS, isAxisProperty, VG_AXIS_PROPERTIES } from '../../axis';
import { POSITION_SCALE_CHANNELS, X, Y } from '../../channel';
import { toFieldDefBase } from '../../fielddef';
import { keys } from '../../util';
import { getSpecifiedOrDefaultValue, guideEncodeEntry, mergeTitle, mergeTitleComponent, mergeTitleFieldDefs, numberFormat } from '../common';
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
                    return mergeTitleComponent(v1, v2);
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
function getFieldDefTitle(model, channel) {
    var channel2 = channel === 'x' ? 'x2' : 'y2';
    var fieldDef = model.fieldDef(channel);
    var fieldDef2 = model.fieldDef(channel2);
    var title1 = fieldDef ? fieldDef.title : undefined;
    var title2 = fieldDef2 ? fieldDef2.title : undefined;
    if (title1 && title2) {
        return mergeTitle(title1, title2);
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
                    // title can be explicit if fieldDef.title is set
                    property === 'title' && value === getFieldDefTitle(model, channel) ? true :
                        // Otherwise, things are explicit if the returned value matches the specified property
                        value === axis[property];
            var configValue = getAxisConfig(property, model.config, channel, axisComponent.get('orient'), model.getScaleComponent(channel).get('type'));
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
    var axisEncode = AXIS_PARTS.reduce(function (e, part) {
        if (!axisComponent.hasAxisPart(part)) {
            // No need to create encode for a disabled part.
            return e;
        }
        var axisEncodingPart = guideEncodeEntry(axisEncoding[part] || {}, model);
        var value = part === 'labels' ?
            encode.labels(model, channel, axisEncodingPart, axisComponent.get('orient')) :
            axisEncodingPart;
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
            var fieldDefTitle = getFieldDefTitle(model, channel);
            var specifiedTitle = fieldDefTitle !== undefined ? fieldDefTitle :
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9heGlzL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBTyxVQUFVLEVBQWdCLGNBQWMsRUFBRSxrQkFBa0IsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUM5RixPQUFPLEVBQUMsdUJBQXVCLEVBQXdCLENBQUMsRUFBRSxDQUFDLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDbEYsT0FBTyxFQUFlLGNBQWMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzVELE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFaEMsT0FBTyxFQUFDLDBCQUEwQixFQUFFLGdCQUFnQixFQUFFLFVBQVUsRUFBRSxtQkFBbUIsRUFBRSxtQkFBbUIsRUFBRSxZQUFZLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFFM0ksT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQzdDLE9BQU8sRUFBQyxpQkFBaUIsRUFBWSx1QkFBdUIsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUU5RSxPQUFPLEVBQUMsYUFBYSxFQUF5QyxNQUFNLGFBQWEsQ0FBQztBQUNsRixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ3ZDLE9BQU8sS0FBSyxNQUFNLE1BQU0sVUFBVSxDQUFDO0FBQ25DLE9BQU8sS0FBSyxVQUFVLE1BQU0sY0FBYyxDQUFDO0FBRzNDLE1BQU0sd0JBQXdCLEtBQWdCO0lBQzVDLE9BQU8sdUJBQXVCLENBQUMsTUFBTSxDQUFDLFVBQVMsSUFBSSxFQUFFLE9BQU87UUFDMUQsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQzFELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxP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QUFRLENBQUMsQ0FBQztZQUMzQyw0REFBNEQ7WUFDNUQsOERBQThEO1lBQzlELElBQU0sYUFBYSxHQUFHLGdCQUFnQixDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztZQUN2RCxJQUFNLGNBQWMsR0FBRyxhQUFhLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDbEUsYUFBYSxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQztZQUV0RSxPQUFPLDBCQUEwQixDQUMvQixjQUFjO1lBQ2QsaUZBQWlGO1lBQ2pGLG1CQUFtQixDQUNqQixDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUMxQixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FDN0MsQ0FDRixDQUFDO1FBQ0osS0FBSyxRQUFRO1lBQ1gsT0FBTyxVQUFVLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ3JFO0lBQ0Qsd0NBQXdDO0lBQ3hDLE9BQU8sY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQUN4RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBeGlzLCBBWElTX1BBUlRTLCBBeGlzRW5jb2RpbmcsIGlzQXhpc1Byb3BlcnR5LCBWR19BWElTX1BST1BFUlRJRVN9IGZyb20gJy4uLy4uL2F4aXMnO1xuaW1wb3J0IHtQT1NJVElPTl9TQ0FMRV9DSEFOTkVMUywgUG9zaXRpb25TY2FsZUNoYW5uZWwsIFgsIFl9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtGaWVsZERlZkJhc2UsIHRvRmllbGREZWZCYXNlfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQge2tleXN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtBeGlzT3JpZW50LCBWZ0F4aXMsIFZnQXhpc0VuY29kZX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtnZXRTcGVjaWZpZWRPckRlZmF1bHRWYWx1ZSwgZ3VpZGVFbmNvZGVFbnRyeSwgbWVyZ2VUaXRsZSwgbWVyZ2VUaXRsZUNvbXBvbmVudCwgbWVyZ2VUaXRsZUZpZWxkRGVmcywgbnVtYmVyRm9ybWF0fSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtMYXllck1vZGVsfSBmcm9tICcuLi9sYXllcic7XG5pbXBvcnQge3BhcnNlR3VpZGVSZXNvbHZlfSBmcm9tICcuLi9yZXNvbHZlJztcbmltcG9ydCB7ZGVmYXVsdFRpZUJyZWFrZXIsIEV4cGxpY2l0LCBtZXJnZVZhbHVlc1dpdGhFeHBsaWNpdH0gZnJvbSAnLi4vc3BsaXQnO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uL3VuaXQnO1xuaW1wb3J0IHtBeGlzQ29tcG9uZW50LCBBeGlzQ29tcG9uZW50SW5kZXgsIEF4aXNDb21wb25lbnRQcm9wc30gZnJvbSAnLi9jb21wb25lbnQnO1xuaW1wb3J0IHtnZXRBeGlzQ29uZmlnfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgKiBhcyBlbmNvZGUgZnJvbSAnLi9lbmNvZGUnO1xuaW1wb3J0ICogYXMgcHJvcGVydGllcyBmcm9tICcuL3Byb3BlcnRpZXMnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVVuaXRBeGlzKG1vZGVsOiBVbml0TW9kZWwpOiBBeGlzQ29tcG9uZW50SW5kZXgge1xuICByZXR1cm4gUE9TSVRJT05fU0NBTEVfQ0hBTk5FTFMucmVkdWNlKGZ1bmN0aW9uKGF4aXMsIGNoYW5uZWwpIHtcbiAgICBpZiAobW9kZWwuY29tcG9uZW50LnNjYWxlc1tjaGFubmVsXSAmJiBtb2RlbC5heGlzKGNoYW5uZWwpKSB7XG4gICAgICBheGlzW2NoYW5uZWxdID0gW3BhcnNlQXhpcyhjaGFubmVsLCBtb2RlbCldO1xuICAgIH1cbiAgICByZXR1cm4gYXhpcztcbiAgfSwge30gYXMgQXhpc0NvbXBvbmVudEluZGV4KTtcbn1cblxuY29uc3QgT1BQT1NJVEVfT1JJRU5UOiB7W0sgaW4gQXhpc09yaWVudF06IEF4aXNPcmllbnR9ID0ge1xuICBib3R0b206ICd0b3AnLFxuICB0b3A6ICdib3R0b20nLFxuICBsZWZ0OiAncmlnaHQnLFxuICByaWdodDogJ2xlZnQnXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VMYXllckF4aXMobW9kZWw6IExheWVyTW9kZWwpIHtcbiAgY29uc3Qge2F4ZXMsIHJlc29sdmV9ID0gbW9kZWwuY29tcG9uZW50O1xuICBjb25zdCBheGlzQ291bnQ6IHtcbiAgICAvLyBVc2luZyBNYXBwZWQgVHlwZSB0byBkZWNsYXJlIHR5cGUgKGh0dHBzOi8vd3d3LnR5cGVzY3JpcHRsYW5nLm9yZy9kb2NzL2hhbmRib29rL2FkdmFuY2VkLXR5cGVzLmh0bWwjbWFwcGVkLXR5cGVzKVxuICAgIFtrIGluIEF4aXNPcmllbnRdOiBudW1iZXJcbiAgfSA9IHt0b3A6IDAsIGJvdHRvbTogMCwgcmlnaHQ6IDAsIGxlZnQ6IDB9O1xuXG4gIGZvciAoY29uc3QgY2hpbGQgb2YgbW9kZWwuY2hpbGRyZW4pIHtcbiAgICBjaGlsZC5wYXJzZUF4aXNBbmRIZWFkZXIoKTtcblxuICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBrZXlzKGNoaWxkLmNvbXBvbmVudC5heGVzKSkge1xuICAgICAgcmVzb2x2ZS5heGlzW2NoYW5uZWxdID0gcGFyc2VHdWlkZVJlc29sdmUobW9kZWwuY29tcG9uZW50LnJlc29sdmUsIGNoYW5uZWwpO1xuICAgICAgaWYgKHJlc29sdmUuYXhpc1tjaGFubmVsXSA9PT0gJ3NoYXJlZCcpIHtcbiAgICAgICAgLy8gSWYgdGhlIHJlc29sdmUgc2F5cyBzaGFyZWQgKGFuZCBoYXMgbm90IGJlZW4gb3ZlcnJpZGRlbilcbiAgICAgICAgLy8gV2Ugd2lsbCB0cnkgdG8gbWVyZ2UgYW5kIHNlZSBpZiB0aGVyZSBpcyBhIGNvbmZsaWN0XG5cbiAgICAgICAgYXhlc1tjaGFubmVsXSA9IG1lcmdlQXhpc0NvbXBvbmVudHMoYXhlc1tjaGFubmVsXSwgY2hpbGQuY29tcG9uZW50LmF4ZXNbY2hhbm5lbF0pO1xuXG4gICAgICAgIGlmICghYXhlc1tjaGFubmVsXSkge1xuICAgICAgICAgIC8vIElmIG1lcmdlIHJldHVybnMgbm90aGluZywgdGhlcmUgaXMgYSBjb25mbGljdCBzbyB3ZSBjYW5ub3QgbWFrZSB0aGUgYXhpcyBzaGFyZWQuXG4gICAgICAgICAgLy8gVGh1cywgbWFyayBheGlzIGFzIGluZGVwZW5kZW50IGFuZCByZW1vdmUgdGhlIGF4aXMgY29tcG9uZW50LlxuICAgICAgICAgIHJlc29sdmUuYXhpc1tjaGFubmVsXSA9ICdpbmRlcGVuZGVudCc7XG4gICAgICAgICAgZGVsZXRlIGF4ZXNbY2hhbm5lbF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBNb3ZlIGF4ZXMgdG8gbGF5ZXIncyBheGlzIGNvbXBvbmVudCBhbmQgbWVyZ2Ugc2hhcmVkIGF4ZXNcbiAgZm9yIChjb25zdCBjaGFubmVsIG9mIFtYLCBZXSkge1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgbW9kZWwuY2hpbGRyZW4pIHtcbiAgICAgIGlmICghY2hpbGQuY29tcG9uZW50LmF4ZXNbY2hhbm5lbF0pIHtcbiAgICAgICAgLy8gc2tpcCBpZiB0aGUgY2hpbGQgZG9lcyBub3QgaGF2ZSBhIHBhcnRpY3VsYXIgYXhpc1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlc29sdmUuYXhpc1tjaGFubmVsXSA9PT0gJ2luZGVwZW5kZW50Jykge1xuICAgICAgICAvLyBJZiBheGVzIGFyZSBpbmRlcGVuZGVudCwgY29uY2F0IHRoZSBheGlzQ29tcG9uZW50IGFycmF5LlxuICAgICAgICBheGVzW2NoYW5uZWxdID0gKGF4ZXNbY2hhbm5lbF0gfHwgW10pLmNvbmNhdChjaGlsZC5jb21wb25lbnQuYXhlc1tjaGFubmVsXSk7XG5cbiAgICAgICAgLy8gQXV0b21hdGljYWxseSBhZGp1c3Qgb3JpZW50XG4gICAgICAgIGZvciAoY29uc3QgYXhpc0NvbXBvbmVudCBvZiBjaGlsZC5jb21wb25lbnQuYXhlc1tjaGFubmVsXSkge1xuICAgICAgICAgIGNvbnN0IHt2YWx1ZTogb3JpZW50LCBleHBsaWNpdH0gPSBheGlzQ29tcG9uZW50LmdldFdpdGhFeHBsaWNpdCgnb3JpZW50Jyk7XG4gICAgICAgICAgaWYgKGF4aXNDb3VudFtvcmllbnRdID4gMCAmJiAhZXhwbGljaXQpIHtcbiAgICAgICAgICAgIC8vIENoYW5nZSBheGlzIG9yaWVudCBpZiB0aGUgbnVtYmVyIGRvIG5vdCBtYXRjaFxuICAgICAgICAgICAgY29uc3Qgb3Bwb3NpdGVPcmllbnQgPSBPUFBPU0lURV9PUklFTlRbb3JpZW50XTtcbiAgICAgICAgICAgIGlmIChheGlzQ291bnRbb3JpZW50XSA+IGF4aXNDb3VudFtvcHBvc2l0ZU9yaWVudF0pIHtcbiAgICAgICAgICAgICAgYXhpc0NvbXBvbmVudC5zZXQoJ29yaWVudCcsIG9wcG9zaXRlT3JpZW50LCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGF4aXNDb3VudFtvcmllbnRdKys7XG5cbiAgICAgICAgICAvLyBUT0RPKGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EtbGl0ZS9pc3N1ZXMvMjYzNCk6IGF1dG9tYXRpY2FseSBhZGQgZXh0cmEgb2Zmc2V0P1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEFmdGVyIG1lcmdpbmcsIG1ha2Ugc3VyZSB0byByZW1vdmUgYXhlcyBmcm9tIGNoaWxkXG4gICAgICBkZWxldGUgY2hpbGQuY29tcG9uZW50LmF4ZXNbY2hhbm5lbF07XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG1lcmdlQXhpc0NvbXBvbmVudHMobWVyZ2VkQXhpc0NtcHRzOiBBeGlzQ29tcG9uZW50W10sIGNoaWxkQXhpc0NtcHRzOiBBeGlzQ29tcG9uZW50W10pOiBBeGlzQ29tcG9uZW50W10ge1xuICBpZiAobWVyZ2VkQXhpc0NtcHRzKSB7XG4gICAgLy8gRklYTUU6IHRoaXMgaXMgYSBiaXQgd3Jvbmcgb25jZSB3ZSBzdXBwb3J0IG11bHRpcGxlIGF4ZXNcbiAgICBpZiAobWVyZ2VkQXhpc0NtcHRzLmxlbmd0aCAhPT0gY2hpbGRBeGlzQ21wdHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkOyAvLyBDYW5ub3QgbWVyZ2UgYXhpcyBjb21wb25lbnQgd2l0aCBkaWZmZXJlbnQgbnVtYmVyIG9mIGF4ZXMuXG4gICAgfVxuICAgIGNvbnN0IGxlbmd0aCA9IG1lcmdlZEF4aXNDbXB0cy5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGggOyBpKyspIHtcbiAgICAgIGNvbnN0IG1lcmdlZCA9IG1lcmdlZEF4aXNDbXB0c1tpXTtcbiAgICAgIGNvbnN0IGNoaWxkID0gY2hpbGRBeGlzQ21wdHNbaV07XG5cbiAgICAgIGlmICgoISFtZXJnZWQpICE9PSAoISFjaGlsZCkpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH0gZWxzZSBpZiAobWVyZ2VkICYmIGNoaWxkKSB7XG4gICAgICAgIGNvbnN0IG1lcmdlZE9yaWVudCA9IG1lcmdlZC5nZXRXaXRoRXhwbGljaXQoJ29yaWVudCcpO1xuICAgICAgICBjb25zdCBjaGlsZE9yaWVudCA9IGNoaWxkLmdldFdpdGhFeHBsaWNpdCgnb3JpZW50Jyk7XG5cbiAgICAgICAgaWYgKG1lcmdlZE9yaWVudC5leHBsaWNpdCAmJiBjaGlsZE9yaWVudC5leHBsaWNpdCAmJiBtZXJnZWRPcmllbnQudmFsdWUgIT09IGNoaWxkT3JpZW50LnZhbHVlKSB7XG4gICAgICAgICAgLy8gVE9ETzogdGhyb3cgd2FybmluZyBpZiByZXNvbHZlIGlzIGV4cGxpY2l0IChXZSBkb24ndCBoYXZlIGluZm8gYWJvdXQgZXhwbGljaXQvaW1wbGljaXQgcmVzb2x2ZSB5ZXQuKVxuXG4gICAgICAgICAgLy8gQ2Fubm90IG1lcmdlIGR1ZSB0byBpbmNvbnNpc3RlbnQgb3JpZW50XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZXJnZWRBeGlzQ21wdHNbaV0gPSBtZXJnZUF4aXNDb21wb25lbnQobWVyZ2VkLCBjaGlsZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gRm9yIGZpcnN0IG9uZSwgcmV0dXJuIGEgY29weSBvZiB0aGUgY2hpbGRcbiAgICByZXR1cm4gY2hpbGRBeGlzQ21wdHMubWFwKGF4aXNDb21wb25lbnQgPT4gYXhpc0NvbXBvbmVudC5jbG9uZSgpKTtcbiAgfVxuICByZXR1cm4gbWVyZ2VkQXhpc0NtcHRzO1xufVxuXG5mdW5jdGlvbiBtZXJnZUF4aXNDb21wb25lbnQobWVyZ2VkOiBBeGlzQ29tcG9uZW50LCBjaGlsZDogQXhpc0NvbXBvbmVudCk6IEF4aXNDb21wb25lbnQge1xuICBmb3IgKGNvbnN0IHByb3Agb2YgVkdfQVhJU19QUk9QRVJUSUVTKSB7XG4gICAgY29uc3QgbWVyZ2VkVmFsdWVXaXRoRXhwbGljaXQgPSBtZXJnZVZhbHVlc1dpdGhFeHBsaWNpdDxWZ0F4aXMsIGFueT4oXG4gICAgICBtZXJnZWQuZ2V0V2l0aEV4cGxpY2l0KHByb3ApLFxuICAgICAgY2hpbGQuZ2V0V2l0aEV4cGxpY2l0KHByb3ApLFxuICAgICAgcHJvcCwgJ2F4aXMnLFxuXG4gICAgICAvLyBUaWUgYnJlYWtlciBmdW5jdGlvblxuICAgICAgKHYxOiBFeHBsaWNpdDxhbnk+LCB2MjogRXhwbGljaXQ8YW55PikgPT4ge1xuICAgICAgICBzd2l0Y2ggKHByb3ApIHtcbiAgICAgICAgICBjYXNlICd0aXRsZSc6XG4gICAgICAgICAgICByZXR1cm4gbWVyZ2VUaXRsZUNvbXBvbmVudCh2MSwgdjIpO1xuICAgICAgICAgIGNhc2UgJ2dyaWRTY2FsZSc6XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBleHBsaWNpdDogdjEuZXhwbGljaXQsIC8vIGtlZXAgdGhlIG9sZCBleHBsaWNpdFxuICAgICAgICAgICAgICB2YWx1ZTogdjEudmFsdWUgfHwgdjIudmFsdWVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZmF1bHRUaWVCcmVha2VyPFZnQXhpcywgYW55Pih2MSwgdjIsIHByb3AsICdheGlzJyk7XG4gICAgICB9XG4gICAgKTtcbiAgICBtZXJnZWQuc2V0V2l0aEV4cGxpY2l0KHByb3AsIG1lcmdlZFZhbHVlV2l0aEV4cGxpY2l0KTtcbiAgfVxuICByZXR1cm4gbWVyZ2VkO1xufVxuXG5mdW5jdGlvbiBnZXRGaWVsZERlZlRpdGxlKG1vZGVsOiBVbml0TW9kZWwsIGNoYW5uZWw6ICd4JyB8ICd5Jykge1xuICBjb25zdCBjaGFubmVsMiA9IGNoYW5uZWwgPT09ICd4JyA/ICd4MicgOiAneTInO1xuICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuICBjb25zdCBmaWVsZERlZjIgPSBtb2RlbC5maWVsZERlZihjaGFubmVsMik7XG5cbiAgY29uc3QgdGl0bGUxID0gZmllbGREZWYgPyBmaWVsZERlZi50aXRsZSA6IHVuZGVmaW5lZDtcbiAgY29uc3QgdGl0bGUyID0gZmllbGREZWYyID8gZmllbGREZWYyLnRpdGxlIDogdW5kZWZpbmVkO1xuXG4gIGlmICh0aXRsZTEgJiYgdGl0bGUyKSB7XG4gICAgcmV0dXJuIG1lcmdlVGl0bGUodGl0bGUxLCB0aXRsZTIpO1xuICB9IGVsc2UgaWYgKHRpdGxlMSkge1xuICAgIHJldHVybiB0aXRsZTE7XG4gIH0gZWxzZSBpZiAodGl0bGUyKSB7XG4gICAgcmV0dXJuIHRpdGxlMjtcbiAgfSBlbHNlIGlmICh0aXRsZTEgIT09IHVuZGVmaW5lZCkgeyAvLyBmYWxzeSB2YWx1ZSB0byBkaXNhYmxlIGNvbmZpZ1xuICAgIHJldHVybiB0aXRsZTE7XG4gIH0gZWxzZSBpZiAodGl0bGUyICE9PSB1bmRlZmluZWQpIHsgLy8gZmFsc3kgdmFsdWUgdG8gZGlzYWJsZSBjb25maWdcbiAgICByZXR1cm4gdGl0bGUyO1xuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gcGFyc2VBeGlzKGNoYW5uZWw6IFBvc2l0aW9uU2NhbGVDaGFubmVsLCBtb2RlbDogVW5pdE1vZGVsKTogQXhpc0NvbXBvbmVudCB7XG4gIGNvbnN0IGF4aXMgPSBtb2RlbC5heGlzKGNoYW5uZWwpO1xuXG4gIGNvbnN0IGF4aXNDb21wb25lbnQgPSBuZXcgQXhpc0NvbXBvbmVudCgpO1xuXG4gIC8vIDEuMi4gQWRkIHByb3BlcnRpZXNcbiAgVkdfQVhJU19QUk9QRVJUSUVTLmZvckVhY2goZnVuY3Rpb24ocHJvcGVydHkpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGdldFByb3BlcnR5KHByb3BlcnR5LCBheGlzLCBjaGFubmVsLCBtb2RlbCk7XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IGV4cGxpY2l0ID1cbiAgICAgICAgLy8gc3BlY2lmaWVkIGF4aXMudmFsdWVzIGlzIGFscmVhZHkgcmVzcGVjdGVkLCBidXQgbWF5IGdldCB0cmFuc2Zvcm1lZC5cbiAgICAgICAgcHJvcGVydHkgPT09ICd2YWx1ZXMnID8gISFheGlzLnZhbHVlcyA6XG4gICAgICAgIC8vIGJvdGggVkwgYXhpcy5lbmNvZGluZyBhbmQgYXhpcy5sYWJlbEFuZ2xlIGFmZmVjdCBWRyBheGlzLmVuY29kZVxuICAgICAgICBwcm9wZXJ0eSA9PT0gJ2VuY29kZScgPyAhIWF4aXMuZW5jb2RpbmcgfHwgISFheGlzLmxhYmVsQW5nbGUgOlxuICAgICAgICAvLyB0aXRsZSBjYW4gYmUgZXhwbGljaXQgaWYgZmllbGREZWYudGl0bGUgaXMgc2V0XG4gICAgICAgICAgICBwcm9wZXJ0eSA9PT0gJ3RpdGxlJyAmJiB2YWx1ZSA9PT0gZ2V0RmllbGREZWZUaXRsZShtb2RlbCwgY2hhbm5lbCkgPyB0cnVlIDpcbiAgICAgICAgLy8gT3RoZXJ3aXNlLCB0aGluZ3MgYXJlIGV4cGxpY2l0IGlmIHRoZSByZXR1cm5lZCB2YWx1ZSBtYXRjaGVzIHRoZSBzcGVjaWZpZWQgcHJvcGVydHlcbiAgICAgICAgdmFsdWUgPT09IGF4aXNbcHJvcGVydHldO1xuXG4gICAgICBjb25zdCBjb25maWdWYWx1ZSA9IGdldEF4aXNDb25maWcocHJvcGVydHksIG1vZGVsLmNvbmZpZywgY2hhbm5lbCwgYXhpc0NvbXBvbmVudC5nZXQoJ29yaWVudCcpLCBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKS5nZXQoJ3R5cGUnKSk7XG5cbiAgICAgIC8vIG9ubHkgc2V0IHByb3BlcnR5IGlmIGl0IGlzIGV4cGxpY2l0bHkgc2V0IG9yIGhhcyBubyBjb25maWcgdmFsdWUgKG90aGVyd2lzZSB3ZSB3aWxsIGFjY2lkZW50YWxseSBvdmVycmlkZSBjb25maWcpXG4gICAgICBpZiAoZXhwbGljaXQgfHwgY29uZmlnVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBEbyBub3QgYXBwbHkgaW1wbGljaXQgcnVsZSBpZiB0aGVyZSBpcyBhIGNvbmZpZyB2YWx1ZVxuICAgICAgICBheGlzQ29tcG9uZW50LnNldChwcm9wZXJ0eSwgdmFsdWUsIGV4cGxpY2l0KTtcbiAgICAgIH0gZWxzZSBpZiAocHJvcGVydHkgPT09ICdncmlkJyAmJiBjb25maWdWYWx1ZSkge1xuICAgICAgICAvLyBHcmlkIGlzIGFuIGV4Y2VwdGlvbiBiZWNhdXNlIHdlIG5lZWQgdG8gc2V0IGdyaWQgPSB0cnVlIHRvIGdlbmVyYXRlIGFub3RoZXIgZ3JpZCBheGlzXG4gICAgICAgIGF4aXNDb21wb25lbnQuc2V0KHByb3BlcnR5LCBjb25maWdWYWx1ZSwgZmFsc2UpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgLy8gMikgQWRkIGd1aWRlIGVuY29kZSBkZWZpbml0aW9uIGdyb3Vwc1xuICBjb25zdCBheGlzRW5jb2RpbmcgPSBheGlzLmVuY29kaW5nIHx8IHt9O1xuICBjb25zdCBheGlzRW5jb2RlID0gQVhJU19QQVJUUy5yZWR1Y2UoKGU6IFZnQXhpc0VuY29kZSwgcGFydCkgPT4ge1xuICAgIGlmICghYXhpc0NvbXBvbmVudC5oYXNBeGlzUGFydChwYXJ0KSkge1xuICAgICAgLy8gTm8gbmVlZCB0byBjcmVhdGUgZW5jb2RlIGZvciBhIGRpc2FibGVkIHBhcnQuXG4gICAgICByZXR1cm4gZTtcbiAgICB9XG5cbiAgICBjb25zdCBheGlzRW5jb2RpbmdQYXJ0ID0gZ3VpZGVFbmNvZGVFbnRyeShheGlzRW5jb2RpbmdbcGFydF0gfHwge30sIG1vZGVsKTtcblxuICAgIGNvbnN0IHZhbHVlID0gcGFydCA9PT0gJ2xhYmVscycgP1xuICAgICAgZW5jb2RlLmxhYmVscyhtb2RlbCwgY2hhbm5lbCwgYXhpc0VuY29kaW5nUGFydCwgYXhpc0NvbXBvbmVudC5nZXQoJ29yaWVudCcpKSA6XG4gICAgICBheGlzRW5jb2RpbmdQYXJ0O1xuXG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQgJiYga2V5cyh2YWx1ZSkubGVuZ3RoID4gMCkge1xuICAgICAgZVtwYXJ0XSA9IHt1cGRhdGU6IHZhbHVlfTtcbiAgICB9XG4gICAgcmV0dXJuIGU7XG4gIH0sIHt9IGFzIFZnQXhpc0VuY29kZSk7XG5cbiAgLy8gRklYTUU6IEJ5IGhhdmluZyBlbmNvZGUgYXMgb25lIHByb3BlcnR5LCB3ZSB3b24ndCBoYXZlIGZpbmUgZ3JhaW5lZCBlbmNvZGUgbWVyZ2luZy5cbiAgaWYgKGtleXMoYXhpc0VuY29kZSkubGVuZ3RoID4gMCkge1xuICAgIGF4aXNDb21wb25lbnQuc2V0KCdlbmNvZGUnLCBheGlzRW5jb2RlLCAhIWF4aXMuZW5jb2RpbmcgfHwgYXhpcy5sYWJlbEFuZ2xlICE9PSB1bmRlZmluZWQpO1xuICB9XG5cbiAgcmV0dXJuIGF4aXNDb21wb25lbnQ7XG59XG5cbmZ1bmN0aW9uIGdldFByb3BlcnR5PEsgZXh0ZW5kcyBrZXlvZiBBeGlzQ29tcG9uZW50UHJvcHM+KHByb3BlcnR5OiBLLCBzcGVjaWZpZWRBeGlzOiBBeGlzLCBjaGFubmVsOiBQb3NpdGlvblNjYWxlQ2hhbm5lbCwgbW9kZWw6IFVuaXRNb2RlbCk6IEF4aXNDb21wb25lbnRQcm9wc1tLXSB7XG4gIGNvbnN0IGZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCk7XG4gIHN3aXRjaCAocHJvcGVydHkpIHtcbiAgICBjYXNlICdzY2FsZSc6XG4gICAgICByZXR1cm4gbW9kZWwuc2NhbGVOYW1lKGNoYW5uZWwpO1xuICAgIGNhc2UgJ2dyaWRTY2FsZSc6XG4gICAgICByZXR1cm4gcHJvcGVydGllcy5ncmlkU2NhbGUobW9kZWwsIGNoYW5uZWwpO1xuICAgIGNhc2UgJ2Zvcm1hdCc6XG4gICAgICAvLyBXZSBkb24ndCBpbmNsdWRlIHRlbXBvcmFsIGZpZWxkIGhlcmUgYXMgd2UgYXBwbHkgZm9ybWF0IGluIGVuY29kZSBibG9ja1xuICAgICAgcmV0dXJuIG51bWJlckZvcm1hdChmaWVsZERlZiwgc3BlY2lmaWVkQXhpcy5mb3JtYXQsIG1vZGVsLmNvbmZpZyk7XG4gICAgY2FzZSAnZ3JpZCc6IHtcbiAgICAgIGNvbnN0IHNjYWxlVHlwZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpLmdldCgndHlwZScpO1xuICAgICAgcmV0dXJuIGdldFNwZWNpZmllZE9yRGVmYXVsdFZhbHVlKHNwZWNpZmllZEF4aXMuZ3JpZCwgcHJvcGVydGllcy5ncmlkKHNjYWxlVHlwZSwgZmllbGREZWYpKTtcbiAgICB9XG4gICAgY2FzZSAnbGFiZWxGbHVzaCc6XG4gICAgICByZXR1cm4gcHJvcGVydGllcy5sYWJlbEZsdXNoKGZpZWxkRGVmLCBjaGFubmVsLCBzcGVjaWZpZWRBeGlzKTtcbiAgICBjYXNlICdsYWJlbE92ZXJsYXAnOiB7XG4gICAgICBjb25zdCBzY2FsZVR5cGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKS5nZXQoJ3R5cGUnKTtcbiAgICAgIHJldHVybiBwcm9wZXJ0aWVzLmxhYmVsT3ZlcmxhcChmaWVsZERlZiwgc3BlY2lmaWVkQXhpcywgY2hhbm5lbCwgc2NhbGVUeXBlKTtcbiAgICB9XG4gICAgY2FzZSAnb3JpZW50JzpcbiAgICAgIHJldHVybiBnZXRTcGVjaWZpZWRPckRlZmF1bHRWYWx1ZShzcGVjaWZpZWRBeGlzLm9yaWVudCwgcHJvcGVydGllcy5vcmllbnQoY2hhbm5lbCkpO1xuICAgIGNhc2UgJ3RpY2tDb3VudCc6IHtcbiAgICAgIGNvbnN0IHNjYWxlVHlwZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpLmdldCgndHlwZScpO1xuICAgICAgY29uc3Qgc2l6ZVR5cGUgPSBjaGFubmVsID09PSAneCcgPyAnd2lkdGgnIDogY2hhbm5lbCA9PT0gJ3knID8gJ2hlaWdodCcgOiB1bmRlZmluZWQ7XG4gICAgICBjb25zdCBzaXplID0gc2l6ZVR5cGUgPyBtb2RlbC5nZXRTaXplU2lnbmFsUmVmKHNpemVUeXBlKVxuICAgICAgIDogdW5kZWZpbmVkO1xuICAgICAgcmV0dXJuIGdldFNwZWNpZmllZE9yRGVmYXVsdFZhbHVlKHNwZWNpZmllZEF4aXMudGlja0NvdW50LCBwcm9wZXJ0aWVzLnRpY2tDb3VudChjaGFubmVsLCBmaWVsZERlZiwgc2NhbGVUeXBlLCBzaXplKSk7XG4gICAgfVxuICAgIGNhc2UgJ3RpdGxlJzpcbiAgICAgIGNvbnN0IGNoYW5uZWwyID0gY2hhbm5lbCA9PT0gJ3gnID8gJ3gyJyA6ICd5Mic7XG4gICAgICBjb25zdCBmaWVsZERlZjIgPSBtb2RlbC5maWVsZERlZihjaGFubmVsMik7XG4gICAgICAvLyBLZWVwIHVuZGVmaW5lZCBzbyB3ZSB1c2UgZGVmYXVsdCBpZiB0aXRsZSBpcyB1bnNwZWNpZmllZC5cbiAgICAgIC8vIEZvciBvdGhlciBmYWxzeSB2YWx1ZSwga2VlcCB0aGVtIHNvIHdlIHdpbGwgaGlkZSB0aGUgdGl0bGUuXG4gICAgICBjb25zdCBmaWVsZERlZlRpdGxlID0gZ2V0RmllbGREZWZUaXRsZShtb2RlbCwgY2hhbm5lbCk7XG4gICAgICBjb25zdCBzcGVjaWZpZWRUaXRsZSA9IGZpZWxkRGVmVGl0bGUgIT09IHVuZGVmaW5lZCA/IGZpZWxkRGVmVGl0bGUgOlxuICAgICAgICBzcGVjaWZpZWRBeGlzLnRpdGxlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBzcGVjaWZpZWRBeGlzLnRpdGxlO1xuXG4gICAgICByZXR1cm4gZ2V0U3BlY2lmaWVkT3JEZWZhdWx0VmFsdWU8c3RyaW5nIHwgRmllbGREZWZCYXNlPHN0cmluZz5bXT4oXG4gICAgICAgIHNwZWNpZmllZFRpdGxlLFxuICAgICAgICAvLyBJZiB0aXRsZSBub3Qgc3BlY2lmaWVkLCBzdG9yZSBiYXNlIHBhcnRzIG9mIGZpZWxkRGVmIChhbmQgZmllbGREZWYyIGlmIGV4aXN0cylcbiAgICAgICAgbWVyZ2VUaXRsZUZpZWxkRGVmcyhcbiAgICAgICAgICBbdG9GaWVsZERlZkJhc2UoZmllbGREZWYpXSxcbiAgICAgICAgICBmaWVsZERlZjIgPyBbdG9GaWVsZERlZkJhc2UoZmllbGREZWYyKV0gOiBbXVxuICAgICAgICApXG4gICAgICApO1xuICAgIGNhc2UgJ3ZhbHVlcyc6XG4gICAgICByZXR1cm4gcHJvcGVydGllcy52YWx1ZXMoc3BlY2lmaWVkQXhpcywgbW9kZWwsIGZpZWxkRGVmLCBjaGFubmVsKTtcbiAgfVxuICAvLyBPdGhlcndpc2UsIHJldHVybiBzcGVjaWZpZWQgcHJvcGVydHkuXG4gIHJldHVybiBpc0F4aXNQcm9wZXJ0eShwcm9wZXJ0eSkgPyBzcGVjaWZpZWRBeGlzW3Byb3BlcnR5XSA6IHVuZGVmaW5lZDtcbn1cbiJdfQ==