import { AXIS_PARTS, isAxisProperty, VG_AXIS_PROPERTIES } from '../../axis';
import { isBinned } from '../../bin';
import { POSITION_SCALE_CHANNELS, X, Y } from '../../channel';
import { toFieldDefBase } from '../../fielddef';
import { getFirstDefined, keys } from '../../util';
import { guideEncodeEntry, mergeTitle, mergeTitleComponent, mergeTitleFieldDefs, numberFormat } from '../common';
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
                    // TODO(https://github.com/vega/vega-lite/issues/2634): automaticaly add extra offset?
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
            if (!!merged !== !!child) {
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
                        value: getFirstDefined(v1.value, v2.value)
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
    else if (title1 !== undefined) {
        // falsy value to disable config
        return title1;
    }
    else if (title2 !== undefined) {
        // falsy value to disable config
        return title2;
    }
    return undefined;
}
function isExplicit(value, property, axis, model, channel) {
    switch (property) {
        case 'values':
            return !!axis.values;
        // specified axis.values is already respected, but may get transformed.
        case 'encode':
            // both VL axis.encoding and axis.labelAngle affect VG axis.encode
            return !!axis.encoding || !!axis.labelAngle;
        case 'title':
            // title can be explicit if fieldDef.title is set
            if (value === getFieldDefTitle(model, channel)) {
                return true;
            }
    }
    // Otherwise, things are explicit if the returned value matches the specified property
    return value === axis[property];
}
function parseAxis(channel, model) {
    var axis = model.axis(channel);
    var axisComponent = new AxisComponent();
    // 1.2. Add properties
    VG_AXIS_PROPERTIES.forEach(function (property) {
        var value = getProperty(property, axis, channel, model);
        if (value !== undefined) {
            var explicit = isExplicit(value, property, axis, model, channel);
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
        var value = part === 'labels'
            ? encode.labels(model, channel, axisEncodingPart, axisComponent.get('orient'))
            : axisEncodingPart;
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
    // Some properties depend on labelAngle so we have to declare it here.
    // Also, we don't use `getFirstDefined` for labelAngle
    // as we want to normalize specified value to be within [0,360)
    var labelAngle = properties.labelAngle(model, specifiedAxis, channel, fieldDef);
    switch (property) {
        case 'scale':
            return model.scaleName(channel);
        case 'gridScale':
            return properties.gridScale(model, channel);
        case 'format':
            // We don't include temporal field here as we apply format in encode block
            return numberFormat(fieldDef, specifiedAxis.format, model.config);
        case 'grid': {
            if (isBinned(model.fieldDef(channel).bin)) {
                return false;
            }
            else {
                var scaleType = model.getScaleComponent(channel).get('type');
                return getFirstDefined(specifiedAxis.grid, properties.grid(scaleType, fieldDef));
            }
        }
        case 'labelAlign':
            return getFirstDefined(specifiedAxis.labelAlign, properties.labelAlign(labelAngle, properties.orient(channel)));
        case 'labelAngle':
            return labelAngle;
        case 'labelBaseline':
            return getFirstDefined(specifiedAxis.labelBaseline, properties.labelBaseline(labelAngle, properties.orient(channel)));
        case 'labelFlush':
            return properties.labelFlush(fieldDef, channel, specifiedAxis);
        case 'labelOverlap': {
            var scaleType = model.getScaleComponent(channel).get('type');
            return properties.labelOverlap(fieldDef, specifiedAxis, channel, scaleType);
        }
        case 'orient':
            return getFirstDefined(specifiedAxis.orient, properties.orient(channel));
        case 'tickCount': {
            var scaleType = model.getScaleComponent(channel).get('type');
            var scaleName = model.scaleName(channel);
            var sizeType = channel === 'x' ? 'width' : channel === 'y' ? 'height' : undefined;
            var size = sizeType ? model.getSizeSignalRef(sizeType) : undefined;
            return getFirstDefined(specifiedAxis.tickCount, properties.tickCount(channel, fieldDef, scaleType, size, scaleName, specifiedAxis));
        }
        case 'title':
            var channel2 = channel === 'x' ? 'x2' : 'y2';
            var fieldDef2 = model.fieldDef(channel2);
            // Keep undefined so we use default if title is unspecified.
            // For other falsy value, keep them so we will hide the title.
            return getFirstDefined(specifiedAxis.title, getFieldDefTitle(model, channel), // If title not specified, store base parts of fieldDef (and fieldDef2 if exists)
            mergeTitleFieldDefs([toFieldDefBase(fieldDef)], fieldDef2 ? [toFieldDefBase(fieldDef2)] : []));
        case 'values':
            return properties.values(specifiedAxis, model, fieldDef, channel);
    }
    // Otherwise, return specified property.
    return isAxisProperty(property) ? specifiedAxis[property] : undefined;
}
//# sourceMappingURL=parse.js.map