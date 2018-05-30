import * as tslib_1 from "tslib";
import { isArray } from 'vega-util';
import { getFieldDef, isConditionalSelection, isValueDef, vgField, } from '../../fielddef';
import * as log from '../../log';
import { expression } from '../../predicate';
import { hasContinuousDomain } from '../../scale';
import { contains } from '../../util';
import { VG_MARK_CONFIGS } from '../../vega.schema';
import { getMarkConfig } from '../common';
import { selectionPredicate } from '../selection/selection';
import * as ref from './valueref';
export function color(model, opt) {
    if (opt === void 0) { opt = { valueOnly: false }; }
    var markDef = model.markDef, encoding = model.encoding, config = model.config;
    var filled = markDef.filled, markType = markDef.type;
    var configValue = {
        fill: getMarkConfig('fill', markDef, config),
        stroke: getMarkConfig('stroke', markDef, config),
        color: getMarkConfig('color', markDef, config)
    };
    var transparentIfNeeded = contains(['bar', 'point', 'circle', 'square', 'geoshape'], markType) ? 'transparent' : undefined;
    var defaultValue = {
        fill: markDef.fill || configValue.fill ||
            // If there is no fill, always fill symbols, bar, geoshape
            // with transparent fills https://github.com/vega/vega-lite/issues/1316
            transparentIfNeeded,
        stroke: markDef.stroke || configValue.stroke
    };
    var colorVgChannel = filled ? 'fill' : 'stroke';
    var fillStrokeMarkDefAndConfig = tslib_1.__assign({}, (defaultValue.fill ? {
        fill: { value: defaultValue.fill }
    } : {}), (defaultValue.stroke ? {
        stroke: { value: defaultValue.stroke }
    } : {}));
    if (encoding.fill || encoding.stroke) {
        // ignore encoding.color, markDef.color, config.color
        if (markDef.color) {
            // warn for markDef.color  (no need to warn encoding.color as it will be dropped in normalized already)
            log.warn(log.message.droppingColor('property', { fill: 'fill' in encoding, stroke: 'stroke' in encoding }));
        }
        return tslib_1.__assign({}, nonPosition('fill', model, { defaultValue: defaultValue.fill || transparentIfNeeded }), nonPosition('stroke', model, { defaultValue: defaultValue.stroke }));
    }
    else if (encoding.color) {
        return tslib_1.__assign({}, fillStrokeMarkDefAndConfig, nonPosition('color', model, {
            vgChannel: colorVgChannel,
            // apply default fill/stroke first, then color config, then transparent if needed.
            defaultValue: markDef[colorVgChannel] || markDef.color || configValue[colorVgChannel] || configValue.color || (filled ? transparentIfNeeded : undefined)
        }));
    }
    else if (markDef.fill || markDef.stroke) {
        // Ignore markDef.color, config.color
        if (markDef.color) {
            log.warn(log.message.droppingColor('property', { fill: 'fill' in markDef, stroke: 'stroke' in markDef }));
        }
        return fillStrokeMarkDefAndConfig;
    }
    else if (markDef.color) {
        return tslib_1.__assign({}, fillStrokeMarkDefAndConfig, (_a = {}, _a[colorVgChannel] = { value: markDef.color }, _a));
    }
    else if (configValue.fill || configValue.stroke) {
        // ignore config.color
        return fillStrokeMarkDefAndConfig;
    }
    else if (configValue.color) {
        return tslib_1.__assign({}, (transparentIfNeeded ? { fill: { value: 'transparent' } } : {}), (_b = {}, _b[colorVgChannel] = { value: configValue.color }, _b));
    }
    return {};
    var _a, _b;
}
export function baseEncodeEntry(model, ignore) {
    return tslib_1.__assign({}, markDefProperties(model.markDef, ignore), color(model), nonPosition('opacity', model), tooltip(model), text(model, 'href'));
}
function markDefProperties(mark, ignore) {
    return VG_MARK_CONFIGS.reduce(function (m, prop) {
        if (mark[prop] !== undefined && ignore[prop] !== 'ignore') {
            m[prop] = { value: mark[prop] };
        }
        return m;
    }, {});
}
export function valueIfDefined(prop, value) {
    if (value !== undefined) {
        return _a = {}, _a[prop] = { value: value }, _a;
    }
    return undefined;
    var _a;
}
function validPredicate(vgRef) {
    return vgRef + " !== null && !isNaN(" + vgRef + ")";
}
export function defined(model) {
    if (model.config.invalidValues === 'filter') {
        var fields = ['x', 'y'].map(function (channel) {
            var scaleComponent = model.getScaleComponent(channel);
            if (scaleComponent) {
                var scaleType = scaleComponent.get('type');
                // Discrete domain scales can handle invalid values, but continuous scales can't.
                if (hasContinuousDomain(scaleType)) {
                    return model.vgField(channel, { expr: 'datum' });
                }
            }
            return undefined;
        })
            .filter(function (field) { return !!field; })
            .map(validPredicate);
        if (fields.length > 0) {
            return {
                defined: { signal: fields.join(' && ') }
            };
        }
    }
    return {};
}
/**
 * Return mixins for non-positional channels with scales.  (Text doesn't have scale.)
 */
export function nonPosition(channel, model, opt) {
    if (opt === void 0) { opt = {}; }
    var defaultValue = opt.defaultValue, vgChannel = opt.vgChannel;
    var defaultRef = opt.defaultRef || (defaultValue !== undefined ? { value: defaultValue } : undefined);
    var channelDef = model.encoding[channel];
    return wrapCondition(model, channelDef, vgChannel || channel, function (cDef) {
        return ref.midPoint(channel, cDef, model.scaleName(channel), model.getScaleComponent(channel), null, // No need to provide stack for non-position as it does not affect mid point
        defaultRef);
    });
}
/**
 * Return a mixin that include a Vega production rule for a Vega-Lite conditional channel definition.
 * or a simple mixin if channel def has no condition.
 */
export function wrapCondition(model, channelDef, vgChannel, refFn) {
    var condition = channelDef && channelDef.condition;
    var valueRef = refFn(channelDef);
    if (condition) {
        var conditions = isArray(condition) ? condition : [condition];
        var vgConditions = conditions.map(function (c) {
            var conditionValueRef = refFn(c);
            var test = isConditionalSelection(c) ? selectionPredicate(model, c.selection) : expression(model, c.test);
            return tslib_1.__assign({ test: test }, conditionValueRef);
        });
        return _a = {},
            _a[vgChannel] = vgConditions.concat((valueRef !== undefined ? [valueRef] : [])),
            _a;
    }
    else {
        return valueRef !== undefined ? (_b = {}, _b[vgChannel] = valueRef, _b) : {};
    }
    var _a, _b;
}
export function tooltip(model) {
    var channel = 'tooltip';
    var channelDef = model.encoding[channel];
    if (isArray(channelDef)) {
        var keyValues = channelDef.map(function (fieldDef) {
            var key = fieldDef.title !== undefined ? fieldDef.title : vgField(fieldDef, { binSuffix: 'range' });
            var value = ref.text(fieldDef, model.config).signal;
            return "\"" + key + "\": " + value;
        });
        return { tooltip: { signal: "{" + keyValues.join(', ') + "}" } };
    }
    else {
        // if not an array, behave just like text
        return textCommon(model, channel, channelDef);
    }
}
export function text(model, channel) {
    if (channel === void 0) { channel = 'text'; }
    var channelDef = model.encoding[channel];
    return textCommon(model, channel, channelDef);
}
function textCommon(model, channel, channelDef) {
    return wrapCondition(model, channelDef, channel, function (cDef) { return ref.text(cDef, model.config); });
}
export function bandPosition(fieldDef, channel, model) {
    var scaleName = model.scaleName(channel);
    var sizeChannel = channel === 'x' ? 'width' : 'height';
    if (model.encoding.size || model.markDef.size !== undefined) {
        var orient = model.markDef.orient;
        if (orient) {
            var centeredBandPositionMixins = (_a = {},
                // Use xc/yc and place the mark at the middle of the band
                // This way we never have to deal with size's condition for x/y position.
                _a[channel + 'c'] = ref.fieldRef(fieldDef, scaleName, {}, { band: 0.5 }),
                _a);
            if (getFieldDef(model.encoding.size)) {
                return tslib_1.__assign({}, centeredBandPositionMixins, nonPosition('size', model, { vgChannel: sizeChannel }));
            }
            else if (isValueDef(model.encoding.size)) {
                return tslib_1.__assign({}, centeredBandPositionMixins, nonPosition('size', model, { vgChannel: sizeChannel }));
            }
            else if (model.markDef.size !== undefined) {
                return tslib_1.__assign({}, centeredBandPositionMixins, (_b = {}, _b[sizeChannel] = { value: model.markDef.size }, _b));
            }
        }
        else {
            log.warn(log.message.cannotApplySizeToNonOrientedMark(model.markDef.type));
        }
    }
    return _c = {},
        _c[channel] = ref.fieldRef(fieldDef, scaleName, { binSuffix: 'range' }),
        _c[sizeChannel] = ref.bandRef(scaleName),
        _c;
    var _a, _b, _c;
}
export function centeredBandPosition(channel, model, defaultPosRef, defaultSizeRef) {
    var centerChannel = channel === 'x' ? 'xc' : 'yc';
    var sizeChannel = channel === 'x' ? 'width' : 'height';
    return tslib_1.__assign({}, pointPosition(channel, model, defaultPosRef, centerChannel), nonPosition('size', model, { defaultRef: defaultSizeRef, vgChannel: sizeChannel }));
}
export function binnedPosition(fieldDef, channel, scaleName, spacing, reverse) {
    if (channel === 'x') {
        return {
            x2: ref.bin(fieldDef, scaleName, 'start', reverse ? 0 : spacing),
            x: ref.bin(fieldDef, scaleName, 'end', reverse ? spacing : 0)
        };
    }
    else {
        return {
            y2: ref.bin(fieldDef, scaleName, 'start', reverse ? spacing : 0),
            y: ref.bin(fieldDef, scaleName, 'end', reverse ? 0 : spacing)
        };
    }
}
/**
 * Return mixins for point (non-band) position channels.
 */
export function pointPosition(channel, model, defaultRef, vgChannel) {
    // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613
    var encoding = model.encoding, mark = model.mark, stack = model.stack;
    var channelDef = encoding[channel];
    var scaleName = model.scaleName(channel);
    var scale = model.getScaleComponent(channel);
    var offset = ref.getOffset(channel, model.markDef);
    var valueRef = !channelDef && (encoding.latitude || encoding.longitude) ?
        // use geopoint output if there are lat/long and there is no point position overriding lat/long.
        { field: model.getName(channel) } : tslib_1.__assign({}, ref.stackable(channel, encoding[channel], scaleName, scale, stack, ref.getDefaultRef(defaultRef, channel, scaleName, scale, mark)), (offset ? { offset: offset } : {}));
    return _a = {},
        _a[vgChannel || channel] = valueRef,
        _a;
    var _a;
}
/**
 * Return mixins for x2, y2.
 * If channel is not specified, return one channel based on orientation.
 */
export function pointPosition2(model, defaultRef, channel) {
    var encoding = model.encoding, mark = model.mark, stack = model.stack;
    var baseChannel = channel === 'x2' ? 'x' : 'y';
    var channelDef = encoding[baseChannel];
    var scaleName = model.scaleName(baseChannel);
    var scale = model.getScaleComponent(baseChannel);
    var offset = ref.getOffset(channel, model.markDef);
    var valueRef = !channelDef && (encoding.latitude || encoding.longitude) ?
        // use geopoint output if there are lat2/long2 and there is no point position2 overriding lat2/long2.
        { field: model.getName(channel) } : tslib_1.__assign({}, ref.stackable2(channel, channelDef, encoding[channel], scaleName, scale, stack, ref.getDefaultRef(defaultRef, baseChannel, scaleName, scale, mark)), (offset ? { offset: offset } : {}));
    return _a = {}, _a[channel] = valueRef, _a;
    var _a;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4aW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvbWFyay9taXhpbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFHbEMsT0FBTyxFQUlMLFdBQVcsRUFDWCxzQkFBc0IsRUFDdEIsVUFBVSxFQUdWLE9BQU8sR0FDUixNQUFNLGdCQUFnQixDQUFDO0FBQ3hCLE9BQU8sS0FBSyxHQUFHLE1BQU0sV0FBVyxDQUFDO0FBRWpDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDaEQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNwQyxPQUFPLEVBQUMsZUFBZSxFQUE0QixNQUFNLG1CQUFtQixDQUFDO0FBQzdFLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDeEMsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFFMUQsT0FBTyxLQUFLLEdBQUcsTUFBTSxZQUFZLENBQUM7QUFFbEMsTUFBTSxnQkFBZ0IsS0FBZ0IsRUFBRSxHQUE4QztJQUE5QyxvQkFBQSxFQUFBLFFBQTZCLFNBQVMsRUFBRSxLQUFLLEVBQUM7SUFDN0UsSUFBQSx1QkFBTyxFQUFFLHlCQUFRLEVBQUUscUJBQU0sQ0FBVTtJQUNuQyxJQUFBLHVCQUFNLEVBQUUsdUJBQWMsQ0FBWTtJQUV6QyxJQUFNLFdBQVcsR0FBRztRQUNsQixJQUFJLEVBQUUsYUFBYSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDO1FBQzVDLE1BQU0sRUFBRSxhQUFhLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUM7UUFDaEQsS0FBSyxFQUFFLGFBQWEsQ0FBQyxPQUFPLEVBQUUsT0FBTyxF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QUksQ0FBQyxDQUNuRSxFQUNFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFDLE1BQU0sUUFBQSxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUM1QixDQUFDO0lBRUosZ0JBQVEsR0FBQyxPQUFPLElBQUcsUUFBUSxLQUFFOztBQUMvQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc0FycmF5fSBmcm9tICd2ZWdhLXV0aWwnO1xuXG5pbXBvcnQge05PTlBPU0lUSU9OX1NDQUxFX0NIQU5ORUxTLCBQb3NpdGlvblNjYWxlQ2hhbm5lbH0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge1xuICBDaGFubmVsRGVmLFxuICBGaWVsZERlZixcbiAgRmllbGREZWZXaXRoQ29uZGl0aW9uLFxuICBnZXRGaWVsZERlZixcbiAgaXNDb25kaXRpb25hbFNlbGVjdGlvbixcbiAgaXNWYWx1ZURlZixcbiAgVGV4dEZpZWxkRGVmLFxuICBWYWx1ZURlZldpdGhDb25kaXRpb24sXG4gIHZnRmllbGQsXG59IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtNYXJrRGVmfSBmcm9tICcuLi8uLi9tYXJrJztcbmltcG9ydCB7ZXhwcmVzc2lvbn0gZnJvbSAnLi4vLi4vcHJlZGljYXRlJztcbmltcG9ydCB7aGFzQ29udGludW91c0RvbWFpbn0gZnJvbSAnLi4vLi4vc2NhbGUnO1xuaW1wb3J0IHtjb250YWluc30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZHX01BUktfQ09ORklHUywgVmdFbmNvZGVFbnRyeSwgVmdWYWx1ZVJlZn0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtnZXRNYXJrQ29uZmlnfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtzZWxlY3Rpb25QcmVkaWNhdGV9IGZyb20gJy4uL3NlbGVjdGlvbi9zZWxlY3Rpb24nO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uL3VuaXQnO1xuaW1wb3J0ICogYXMgcmVmIGZyb20gJy4vdmFsdWVyZWYnO1xuXG5leHBvcnQgZnVuY3Rpb24gY29sb3IobW9kZWw6IFVuaXRNb2RlbCwgb3B0OiB7dmFsdWVPbmx5OiBib29sZWFufSA9IHt2YWx1ZU9ubHk6IGZhbHNlfSk6IFZnRW5jb2RlRW50cnkge1xuICBjb25zdCB7bWFya0RlZiwgZW5jb2RpbmcsIGNvbmZpZ30gPSBtb2RlbDtcbiAgY29uc3Qge2ZpbGxlZCwgdHlwZTogbWFya1R5cGV9ID0gbWFya0RlZjtcblxuICBjb25zdCBjb25maWdWYWx1ZSA9IHtcbiAgICBmaWxsOiBnZXRNYXJrQ29uZmlnKCdmaWxsJywgbWFya0RlZiwgY29uZmlnKSxcbiAgICBzdHJva2U6IGdldE1hcmtDb25maWcoJ3N0cm9rZScsIG1hcmtEZWYsIGNvbmZpZyksXG4gICAgY29sb3I6IGdldE1hcmtDb25maWcoJ2NvbG9yJywgbWFya0RlZiwgY29uZmlnKVxuICB9O1xuXG4gIGNvbnN0IHRyYW5zcGFyZW50SWZOZWVkZWQgPSBjb250YWlucyhbJ2JhcicsICdwb2ludCcsICdjaXJjbGUnLCAnc3F1YXJlJywgJ2dlb3NoYXBlJ10sIG1hcmtUeXBlKSA/ICd0cmFuc3BhcmVudCcgOiB1bmRlZmluZWQ7XG5cbiAgY29uc3QgZGVmYXVsdFZhbHVlID0ge1xuICAgIGZpbGw6IG1hcmtEZWYuZmlsbCB8fCBjb25maWdWYWx1ZS5maWxsIHx8XG4gICAgLy8gSWYgdGhlcmUgaXMgbm8gZmlsbCwgYWx3YXlzIGZpbGwgc3ltYm9scywgYmFyLCBnZW9zaGFwZVxuICAgIC8vIHdpdGggdHJhbnNwYXJlbnQgZmlsbHMgaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8xMzE2XG4gICAgICB0cmFuc3BhcmVudElmTmVlZGVkLFxuICAgIHN0cm9rZTogbWFya0RlZi5zdHJva2UgfHwgY29uZmlnVmFsdWUuc3Ryb2tlXG4gIH07XG5cbiAgY29uc3QgY29sb3JWZ0NoYW5uZWwgPSBmaWxsZWQgPyAnZmlsbCcgOiAnc3Ryb2tlJztcblxuICBjb25zdCBmaWxsU3Ryb2tlTWFya0RlZkFuZENvbmZpZzogVmdFbmNvZGVFbnRyeSA9IHtcbiAgICAuLi4oZGVmYXVsdFZhbHVlLmZpbGwgPyB7XG4gICAgICBmaWxsOiB7dmFsdWU6IGRlZmF1bHRWYWx1ZS5maWxsfVxuICAgIH0gOiB7fSksXG4gICAgLi4uKGRlZmF1bHRWYWx1ZS5zdHJva2UgPyB7XG4gICAgICBzdHJva2U6IHt2YWx1ZTogZGVmYXVsdFZhbHVlLnN0cm9rZX1cbiAgICB9IDoge30pLFxuICB9O1xuXG4gIGlmIChlbmNvZGluZy5maWxsIHx8IGVuY29kaW5nLnN0cm9rZSkge1xuICAgIC8vIGlnbm9yZSBlbmNvZGluZy5jb2xvciwgbWFya0RlZi5jb2xvciwgY29uZmlnLmNvbG9yXG4gICAgaWYgKG1hcmtEZWYuY29sb3IpIHtcbiAgICAgIC8vIHdhcm4gZm9yIG1hcmtEZWYuY29sb3IgIChubyBuZWVkIHRvIHdhcm4gZW5jb2RpbmcuY29sb3IgYXMgaXQgd2lsbCBiZSBkcm9wcGVkIGluIG5vcm1hbGl6ZWQgYWxyZWFkeSlcbiAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmRyb3BwaW5nQ29sb3IoJ3Byb3BlcnR5Jywge2ZpbGw6ICdmaWxsJyBpbiBlbmNvZGluZywgc3Ryb2tlOiAnc3Ryb2tlJyBpbiBlbmNvZGluZ30pKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4ubm9uUG9zaXRpb24oJ2ZpbGwnLCBtb2RlbCwge2RlZmF1bHRWYWx1ZTogZGVmYXVsdFZhbHVlLmZpbGwgfHwgdHJhbnNwYXJlbnRJZk5lZWRlZH0pLFxuICAgICAgLi4ubm9uUG9zaXRpb24oJ3N0cm9rZScsIG1vZGVsLCB7ZGVmYXVsdFZhbHVlOiBkZWZhdWx0VmFsdWUuc3Ryb2tlfSlcbiAgICB9O1xuICB9IGVsc2UgaWYgKGVuY29kaW5nLmNvbG9yKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uZmlsbFN0cm9rZU1hcmtEZWZBbmRDb25maWcsXG4gICAgICAvLyBvdmVycmlkZSB0aGVtIHdpdGggZW5jb2RlZCBjb2xvciBmaWVsZFxuICAgICAgLi4ubm9uUG9zaXRpb24oJ2NvbG9yJywgbW9kZWwsIHtcbiAgICAgICAgdmdDaGFubmVsOiBjb2xvclZnQ2hhbm5lbCxcbiAgICAgICAgLy8gYXBwbHkgZGVmYXVsdCBmaWxsL3N0cm9rZSBmaXJzdCwgdGhlbiBjb2xvciBjb25maWcsIHRoZW4gdHJhbnNwYXJlbnQgaWYgbmVlZGVkLlxuICAgICAgICBkZWZhdWx0VmFsdWU6IG1hcmtEZWZbY29sb3JWZ0NoYW5uZWxdIHx8IG1hcmtEZWYuY29sb3IgfHwgY29uZmlnVmFsdWVbY29sb3JWZ0NoYW5uZWxdIHx8IGNvbmZpZ1ZhbHVlLmNvbG9yIHx8IChmaWxsZWQgPyB0cmFuc3BhcmVudElmTmVlZGVkIDogdW5kZWZpbmVkKVxuICAgICAgfSlcbiAgICB9O1xuICB9IGVsc2UgaWYgKG1hcmtEZWYuZmlsbCB8fCBtYXJrRGVmLnN0cm9rZSkge1xuICAgIC8vIElnbm9yZSBtYXJrRGVmLmNvbG9yLCBjb25maWcuY29sb3JcbiAgICBpZiAobWFya0RlZi5jb2xvcikge1xuICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuZHJvcHBpbmdDb2xvcigncHJvcGVydHknLCB7ZmlsbDogJ2ZpbGwnIGluIG1hcmtEZWYsIHN0cm9rZTogJ3N0cm9rZScgaW4gbWFya0RlZn0pKTtcbiAgICB9XG4gICAgcmV0dXJuIGZpbGxTdHJva2VNYXJrRGVmQW5kQ29uZmlnO1xuICB9IGVsc2UgaWYgKG1hcmtEZWYuY29sb3IpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uZmlsbFN0cm9rZU1hcmtEZWZBbmRDb25maWcsIC8vIGluIHRoaXMgY2FzZSwgZmlsbFN0cm9rZU1hcmtEZWZBbmRDb25maWcgb25seSBpbmNsdWRlIGNvbmZpZ1xuXG4gICAgICAvLyBvdmVycmlkZSBjb25maWcgd2l0aCBtYXJrRGVmLmNvbG9yXG4gICAgICBbY29sb3JWZ0NoYW5uZWxdOiB7dmFsdWU6IG1hcmtEZWYuY29sb3J9XG4gICAgfTtcbiAgfSBlbHNlIGlmIChjb25maWdWYWx1ZS5maWxsIHx8IGNvbmZpZ1ZhbHVlLnN0cm9rZSkge1xuICAgIC8vIGlnbm9yZSBjb25maWcuY29sb3JcbiAgICByZXR1cm4gZmlsbFN0cm9rZU1hcmtEZWZBbmRDb25maWc7XG4gIH0gZWxzZSBpZiAoY29uZmlnVmFsdWUuY29sb3IpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uKHRyYW5zcGFyZW50SWZOZWVkZWQgPyB7ZmlsbDoge3ZhbHVlOiAndHJhbnNwYXJlbnQnfX0gOiB7fSksXG4gICAgICBbY29sb3JWZ0NoYW5uZWxdOiB7dmFsdWU6IGNvbmZpZ1ZhbHVlLmNvbG9yfVxuICAgIH07XG4gIH1cbiAgcmV0dXJuIHt9O1xufVxuXG5leHBvcnQgdHlwZSBJZ25vcmUgPSBSZWNvcmQ8J3NpemUnIHwgJ29yaWVudCcsICdpZ25vcmUnIHwgJ2luY2x1ZGUnPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJhc2VFbmNvZGVFbnRyeShtb2RlbDogVW5pdE1vZGVsLCBpZ25vcmU6IElnbm9yZSkge1xuICByZXR1cm4ge1xuICAgIC4uLm1hcmtEZWZQcm9wZXJ0aWVzKG1vZGVsLm1hcmtEZWYsIGlnbm9yZSksXG4gICAgLi4uY29sb3IobW9kZWwpLFxuICAgIC4uLm5vblBvc2l0aW9uKCdvcGFjaXR5JywgbW9kZWwpLFxuICAgIC4uLnRvb2x0aXAobW9kZWwpLFxuICAgIC4uLnRleHQobW9kZWwsICdocmVmJylcbiAgfTtcbn1cblxuZnVuY3Rpb24gbWFya0RlZlByb3BlcnRpZXMobWFyazogTWFya0RlZiwgaWdub3JlOiBJZ25vcmUpIHtcbiAgcmV0dXJuIFZHX01BUktfQ09ORklHUy5yZWR1Y2UoKG0sIHByb3ApID0+IHtcbiAgICBpZiAobWFya1twcm9wXSAhPT0gdW5kZWZpbmVkICYmIGlnbm9yZVtwcm9wXSAhPT0gJ2lnbm9yZScpIHtcbiAgICAgIG1bcHJvcF0gPSB7dmFsdWU6IG1hcmtbcHJvcF19O1xuICAgIH1cbiAgICByZXR1cm4gbTtcbiAgfSwge30pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsdWVJZkRlZmluZWQocHJvcDogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbik6IFZnRW5jb2RlRW50cnkge1xuICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiB7W3Byb3BdOiB7dmFsdWU6IHZhbHVlfX07XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gdmFsaWRQcmVkaWNhdGUodmdSZWY6IHN0cmluZykge1xuICByZXR1cm4gYCR7dmdSZWZ9ICE9PSBudWxsICYmICFpc05hTigke3ZnUmVmfSlgO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lZChtb2RlbDogVW5pdE1vZGVsKTogVmdFbmNvZGVFbnRyeSB7XG4gIGlmIChtb2RlbC5jb25maWcuaW52YWxpZFZhbHVlcyA9PT0gJ2ZpbHRlcicpIHtcbiAgICBjb25zdCBmaWVsZHMgPSBbJ3gnLCAneSddLm1hcCgoY2hhbm5lbDogUG9zaXRpb25TY2FsZUNoYW5uZWwpID0+IHtcbiAgICAgICAgY29uc3Qgc2NhbGVDb21wb25lbnQgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKTtcbiAgICAgICAgaWYgKHNjYWxlQ29tcG9uZW50KSB7XG4gICAgICAgICAgY29uc3Qgc2NhbGVUeXBlID0gc2NhbGVDb21wb25lbnQuZ2V0KCd0eXBlJyk7XG5cbiAgICAgICAgICAvLyBEaXNjcmV0ZSBkb21haW4gc2NhbGVzIGNhbiBoYW5kbGUgaW52YWxpZCB2YWx1ZXMsIGJ1dCBjb250aW51b3VzIHNjYWxlcyBjYW4ndC5cbiAgICAgICAgICBpZiAoaGFzQ29udGludW91c0RvbWFpbihzY2FsZVR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gbW9kZWwudmdGaWVsZChjaGFubmVsLCB7ZXhwcjogJ2RhdHVtJ30pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSlcbiAgICAgIC5maWx0ZXIoZmllbGQgPT4gISFmaWVsZClcbiAgICAgIC5tYXAodmFsaWRQcmVkaWNhdGUpO1xuXG4gICAgaWYgKGZpZWxkcy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkZWZpbmVkOiB7c2lnbmFsOiBmaWVsZHMuam9pbignICYmICcpfVxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge307XG59XG5cbi8qKlxuICogUmV0dXJuIG1peGlucyBmb3Igbm9uLXBvc2l0aW9uYWwgY2hhbm5lbHMgd2l0aCBzY2FsZXMuICAoVGV4dCBkb2Vzbid0IGhhdmUgc2NhbGUuKVxuICovXG5leHBvcnQgZnVuY3Rpb24gbm9uUG9zaXRpb24oY2hhbm5lbDogdHlwZW9mIE5PTlBPU0lUSU9OX1NDQUxFX0NIQU5ORUxTWzBdLCBtb2RlbDogVW5pdE1vZGVsLCBvcHQ6IHtkZWZhdWx0VmFsdWU/OiBudW1iZXIgfCBzdHJpbmcgfCBib29sZWFuLCB2Z0NoYW5uZWw/OiBzdHJpbmcsIGRlZmF1bHRSZWY/OiBWZ1ZhbHVlUmVmfSA9IHt9KTogVmdFbmNvZGVFbnRyeSB7XG4gIGNvbnN0IHtkZWZhdWx0VmFsdWUsIHZnQ2hhbm5lbH0gPSBvcHQ7XG4gIGNvbnN0IGRlZmF1bHRSZWYgPSBvcHQuZGVmYXVsdFJlZiB8fCAoZGVmYXVsdFZhbHVlICE9PSB1bmRlZmluZWQgPyB7dmFsdWU6IGRlZmF1bHRWYWx1ZX0gOiB1bmRlZmluZWQpO1xuXG4gIGNvbnN0IGNoYW5uZWxEZWYgPSBtb2RlbC5lbmNvZGluZ1tjaGFubmVsXTtcblxuICByZXR1cm4gd3JhcENvbmRpdGlvbihtb2RlbCwgY2hhbm5lbERlZiwgdmdDaGFubmVsIHx8IGNoYW5uZWwsIChjRGVmKSA9PiB7XG4gICAgcmV0dXJuIHJlZi5taWRQb2ludChcbiAgICAgIGNoYW5uZWwsIGNEZWYsIG1vZGVsLnNjYWxlTmFtZShjaGFubmVsKSxcbiAgICAgIG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpLFxuICAgICAgbnVsbCwgLy8gTm8gbmVlZCB0byBwcm92aWRlIHN0YWNrIGZvciBub24tcG9zaXRpb24gYXMgaXQgZG9lcyBub3QgYWZmZWN0IG1pZCBwb2ludFxuICAgICAgZGVmYXVsdFJlZlxuICAgICk7XG4gIH0pO1xufVxuXG4vKipcbiAqIFJldHVybiBhIG1peGluIHRoYXQgaW5jbHVkZSBhIFZlZ2EgcHJvZHVjdGlvbiBydWxlIGZvciBhIFZlZ2EtTGl0ZSBjb25kaXRpb25hbCBjaGFubmVsIGRlZmluaXRpb24uXG4gKiBvciBhIHNpbXBsZSBtaXhpbiBpZiBjaGFubmVsIGRlZiBoYXMgbm8gY29uZGl0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gd3JhcENvbmRpdGlvbihcbiAgICBtb2RlbDogVW5pdE1vZGVsLCBjaGFubmVsRGVmOiBDaGFubmVsRGVmPHN0cmluZz4sIHZnQ2hhbm5lbDogc3RyaW5nLFxuICAgIHJlZkZuOiAoY0RlZjogQ2hhbm5lbERlZjxzdHJpbmc+KSA9PiBWZ1ZhbHVlUmVmXG4gICk6IFZnRW5jb2RlRW50cnkge1xuICBjb25zdCBjb25kaXRpb24gPSBjaGFubmVsRGVmICYmIGNoYW5uZWxEZWYuY29uZGl0aW9uO1xuICBjb25zdCB2YWx1ZVJlZiA9IHJlZkZuKGNoYW5uZWxEZWYpO1xuICBpZiAoY29uZGl0aW9uKSB7XG4gICAgY29uc3QgY29uZGl0aW9ucyA9IGlzQXJyYXkoY29uZGl0aW9uKSA/IGNvbmRpdGlvbiA6IFtjb25kaXRpb25dO1xuICAgIGNvbnN0IHZnQ29uZGl0aW9ucyA9IGNvbmRpdGlvbnMubWFwKChjKSA9PiB7XG4gICAgICBjb25zdCBjb25kaXRpb25WYWx1ZVJlZiA9IHJlZkZuKGMpO1xuICAgICAgY29uc3QgdGVzdCA9IGlzQ29uZGl0aW9uYWxTZWxlY3Rpb24oYykgPyBzZWxlY3Rpb25QcmVkaWNhdGUobW9kZWwsIGMuc2VsZWN0aW9uKSA6IGV4cHJlc3Npb24obW9kZWwsIGMudGVzdCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0ZXN0LFxuICAgICAgICAuLi5jb25kaXRpb25WYWx1ZVJlZlxuICAgICAgfTtcbiAgICB9KTtcbiAgICByZXR1cm4ge1xuICAgICAgW3ZnQ2hhbm5lbF06IFtcbiAgICAgICAgLi4udmdDb25kaXRpb25zLFxuICAgICAgICAuLi4odmFsdWVSZWYgIT09IHVuZGVmaW5lZCA/IFt2YWx1ZVJlZl0gOiBbXSlcbiAgICAgIF1cbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB2YWx1ZVJlZiAhPT0gdW5kZWZpbmVkID8ge1t2Z0NoYW5uZWxdOiB2YWx1ZVJlZn0gOiB7fTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9vbHRpcChtb2RlbDogVW5pdE1vZGVsKSB7XG4gIGNvbnN0IGNoYW5uZWwgPSAndG9vbHRpcCc7XG4gIGNvbnN0IGNoYW5uZWxEZWYgPSBtb2RlbC5lbmNvZGluZ1tjaGFubmVsXTtcbiAgaWYgKGlzQXJyYXkoY2hhbm5lbERlZikpIHtcbiAgICBjb25zdCBrZXlWYWx1ZXMgPSBjaGFubmVsRGVmLm1hcCgoZmllbGREZWYpID0+IHtcbiAgICAgIGNvbnN0IGtleSA9IGZpZWxkRGVmLnRpdGxlICE9PSB1bmRlZmluZWQgPyBmaWVsZERlZi50aXRsZSA6IHZnRmllbGQoZmllbGREZWYsIHtiaW5TdWZmaXg6ICdyYW5nZSd9KTtcbiAgICAgIGNvbnN0IHZhbHVlID0gcmVmLnRleHQoZmllbGREZWYsIG1vZGVsLmNvbmZpZykuc2lnbmFsO1xuICAgICAgcmV0dXJuIGBcIiR7a2V5fVwiOiAke3ZhbHVlfWA7XG4gICAgfSk7XG4gICAgcmV0dXJuIHt0b29sdGlwOiB7c2lnbmFsOiBgeyR7a2V5VmFsdWVzLmpvaW4oJywgJyl9fWB9fTtcbiAgfSBlbHNlIHtcbiAgICAvLyBpZiBub3QgYW4gYXJyYXksIGJlaGF2ZSBqdXN0IGxpa2UgdGV4dFxuICAgIHJldHVybiB0ZXh0Q29tbW9uKG1vZGVsLCBjaGFubmVsLCBjaGFubmVsRGVmKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdGV4dChtb2RlbDogVW5pdE1vZGVsLCBjaGFubmVsOiAndGV4dCcgfCAnaHJlZicgPSAndGV4dCcpIHtcbiAgY29uc3QgY2hhbm5lbERlZiA9IG1vZGVsLmVuY29kaW5nW2NoYW5uZWxdO1xuICByZXR1cm4gdGV4dENvbW1vbihtb2RlbCwgY2hhbm5lbCwgY2hhbm5lbERlZik7XG59XG5cbmZ1bmN0aW9uIHRleHRDb21tb24obW9kZWw6IFVuaXRNb2RlbCwgY2hhbm5lbDogJ3RleHQnIHwgJ2hyZWYnIHwgJ3Rvb2x0aXAnLCBjaGFubmVsRGVmOiBGaWVsZERlZldpdGhDb25kaXRpb248VGV4dEZpZWxkRGVmPHN0cmluZz4+IHwgVmFsdWVEZWZXaXRoQ29uZGl0aW9uPFRleHRGaWVsZERlZjxzdHJpbmc+Pikge1xuICByZXR1cm4gd3JhcENvbmRpdGlvbihtb2RlbCwgY2hhbm5lbERlZiwgY2hhbm5lbCwgKGNEZWYpID0+IHJlZi50ZXh0KGNEZWYsIG1vZGVsLmNvbmZpZykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmFuZFBvc2l0aW9uKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjaGFubmVsOiAneCd8J3knLCBtb2RlbDogVW5pdE1vZGVsKSB7XG4gIGNvbnN0IHNjYWxlTmFtZSA9IG1vZGVsLnNjYWxlTmFtZShjaGFubmVsKTtcbiAgY29uc3Qgc2l6ZUNoYW5uZWwgPSBjaGFubmVsID09PSAneCcgPyAnd2lkdGgnIDogJ2hlaWdodCc7XG5cbiAgaWYgKG1vZGVsLmVuY29kaW5nLnNpemUgfHwgbW9kZWwubWFya0RlZi5zaXplICE9PSB1bmRlZmluZWQpIHtcbiAgICBjb25zdCBvcmllbnQgPSBtb2RlbC5tYXJrRGVmLm9yaWVudDtcbiAgICBpZiAob3JpZW50KSB7XG4gICAgICBjb25zdCBjZW50ZXJlZEJhbmRQb3NpdGlvbk1peGlucyA9IHtcbiAgICAgICAgLy8gVXNlIHhjL3ljIGFuZCBwbGFjZSB0aGUgbWFyayBhdCB0aGUgbWlkZGxlIG9mIHRoZSBiYW5kXG4gICAgICAgIC8vIFRoaXMgd2F5IHdlIG5ldmVyIGhhdmUgdG8gZGVhbCB3aXRoIHNpemUncyBjb25kaXRpb24gZm9yIHgveSBwb3NpdGlvbi5cbiAgICAgICAgW2NoYW5uZWwrJ2MnXTogcmVmLmZpZWxkUmVmKGZpZWxkRGVmLCBzY2FsZU5hbWUsIHt9LCB7YmFuZDogMC41fSlcbiAgICAgIH07XG5cbiAgICAgIGlmIChnZXRGaWVsZERlZihtb2RlbC5lbmNvZGluZy5zaXplKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLmNlbnRlcmVkQmFuZFBvc2l0aW9uTWl4aW5zLFxuICAgICAgICAgIC4uLm5vblBvc2l0aW9uKCdzaXplJywgbW9kZWwsIHt2Z0NoYW5uZWw6IHNpemVDaGFubmVsfSlcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSBpZiAoaXNWYWx1ZURlZihtb2RlbC5lbmNvZGluZy5zaXplKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLmNlbnRlcmVkQmFuZFBvc2l0aW9uTWl4aW5zLFxuICAgICAgICAgIC4uLm5vblBvc2l0aW9uKCdzaXplJywgbW9kZWwsIHt2Z0NoYW5uZWw6IHNpemVDaGFubmVsfSlcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSBpZiAobW9kZWwubWFya0RlZi5zaXplICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5jZW50ZXJlZEJhbmRQb3NpdGlvbk1peGlucyxcbiAgICAgICAgICBbc2l6ZUNoYW5uZWxdOiB7dmFsdWU6IG1vZGVsLm1hcmtEZWYuc2l6ZX1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuY2Fubm90QXBwbHlTaXplVG9Ob25PcmllbnRlZE1hcmsobW9kZWwubWFya0RlZi50eXBlKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiB7XG4gICAgW2NoYW5uZWxdOiByZWYuZmllbGRSZWYoZmllbGREZWYsIHNjYWxlTmFtZSwge2JpblN1ZmZpeDogJ3JhbmdlJ30pLFxuICAgIFtzaXplQ2hhbm5lbF06IHJlZi5iYW5kUmVmKHNjYWxlTmFtZSlcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNlbnRlcmVkQmFuZFBvc2l0aW9uKGNoYW5uZWw6ICd4JyB8ICd5JywgbW9kZWw6IFVuaXRNb2RlbCwgZGVmYXVsdFBvc1JlZjogVmdWYWx1ZVJlZiwgZGVmYXVsdFNpemVSZWY6IFZnVmFsdWVSZWYpIHtcbiAgY29uc3QgY2VudGVyQ2hhbm5lbDogJ3hjJyB8ICd5YycgPSBjaGFubmVsID09PSAneCcgPyAneGMnIDogJ3ljJztcbiAgY29uc3Qgc2l6ZUNoYW5uZWwgPSBjaGFubmVsID09PSAneCcgPyAnd2lkdGgnIDogJ2hlaWdodCc7XG4gIHJldHVybiB7XG4gICAgLi4ucG9pbnRQb3NpdGlvbihjaGFubmVsLCBtb2RlbCwgZGVmYXVsdFBvc1JlZiwgY2VudGVyQ2hhbm5lbCksXG4gICAgLi4ubm9uUG9zaXRpb24oJ3NpemUnLCBtb2RlbCwge2RlZmF1bHRSZWY6IGRlZmF1bHRTaXplUmVmLCB2Z0NoYW5uZWw6IHNpemVDaGFubmVsfSlcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJpbm5lZFBvc2l0aW9uKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjaGFubmVsOiAneCd8J3knLCBzY2FsZU5hbWU6IHN0cmluZywgc3BhY2luZzogbnVtYmVyLCByZXZlcnNlOiBib29sZWFuKSB7XG4gIGlmIChjaGFubmVsID09PSAneCcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgeDI6IHJlZi5iaW4oZmllbGREZWYsIHNjYWxlTmFtZSwgJ3N0YXJ0JywgcmV2ZXJzZSA/IDAgOiBzcGFjaW5nKSxcbiAgICAgIHg6IHJlZi5iaW4oZmllbGREZWYsIHNjYWxlTmFtZSwgJ2VuZCcsIHJldmVyc2UgPyBzcGFjaW5nIDogMClcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICB5MjogcmVmLmJpbihmaWVsZERlZiwgc2NhbGVOYW1lLCAnc3RhcnQnLCByZXZlcnNlID8gc3BhY2luZyA6IDApLFxuICAgICAgeTogcmVmLmJpbihmaWVsZERlZiwgc2NhbGVOYW1lLCAnZW5kJywgcmV2ZXJzZSA/IDAgOiBzcGFjaW5nKVxuICAgIH07XG4gIH1cbn1cblxuXG4vKipcbiAqIFJldHVybiBtaXhpbnMgZm9yIHBvaW50IChub24tYmFuZCkgcG9zaXRpb24gY2hhbm5lbHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwb2ludFBvc2l0aW9uKGNoYW5uZWw6ICd4J3wneScsIG1vZGVsOiBVbml0TW9kZWwsIGRlZmF1bHRSZWY6IFZnVmFsdWVSZWYgfCAnemVyb09yTWluJyB8ICd6ZXJvT3JNYXgnLCB2Z0NoYW5uZWw/OiAneCd8J3knfCd4Yyd8J3ljJykge1xuICAvLyBUT0RPOiByZWZhY3RvciBob3cgcmVmZXIgdG8gc2NhbGUgYXMgZGlzY3Vzc2VkIGluIGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EtbGl0ZS9wdWxsLzE2MTNcblxuICBjb25zdCB7ZW5jb2RpbmcsIG1hcmssIHN0YWNrfSA9IG1vZGVsO1xuXG4gIGNvbnN0IGNoYW5uZWxEZWYgPSBlbmNvZGluZ1tjaGFubmVsXTtcbiAgY29uc3Qgc2NhbGVOYW1lID0gbW9kZWwuc2NhbGVOYW1lKGNoYW5uZWwpO1xuICBjb25zdCBzY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpO1xuXG5cbiAgY29uc3Qgb2Zmc2V0ID0gcmVmLmdldE9mZnNldChjaGFubmVsLCBtb2RlbC5tYXJrRGVmKTtcblxuXG4gIGNvbnN0IHZhbHVlUmVmID0gIWNoYW5uZWxEZWYgJiYgKGVuY29kaW5nLmxhdGl0dWRlIHx8IGVuY29kaW5nLmxvbmdpdHVkZSkgP1xuICAgIC8vIHVzZSBnZW9wb2ludCBvdXRwdXQgaWYgdGhlcmUgYXJlIGxhdC9sb25nIGFuZCB0aGVyZSBpcyBubyBwb2ludCBwb3NpdGlvbiBvdmVycmlkaW5nIGxhdC9sb25nLlxuICAgIHtmaWVsZDogbW9kZWwuZ2V0TmFtZShjaGFubmVsKX0gOlxuICAgIHtcbiAgICAgIC4uLnJlZi5zdGFja2FibGUoY2hhbm5lbCwgZW5jb2RpbmdbY2hhbm5lbF0sIHNjYWxlTmFtZSwgc2NhbGUsIHN0YWNrLFxuICAgICAgICByZWYuZ2V0RGVmYXVsdFJlZihkZWZhdWx0UmVmLCBjaGFubmVsLCBzY2FsZU5hbWUsIHNjYWxlLCBtYXJrKVxuICAgICAgKSxcbiAgICAgLi4uKG9mZnNldCA/IHtvZmZzZXR9OiB7fSlcbiAgICB9O1xuXG4gIHJldHVybiB7XG4gICAgW3ZnQ2hhbm5lbCB8fCBjaGFubmVsXTogdmFsdWVSZWZcbiAgfTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gbWl4aW5zIGZvciB4MiwgeTIuXG4gKiBJZiBjaGFubmVsIGlzIG5vdCBzcGVjaWZpZWQsIHJldHVybiBvbmUgY2hhbm5lbCBiYXNlZCBvbiBvcmllbnRhdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBvaW50UG9zaXRpb24yKG1vZGVsOiBVbml0TW9kZWwsIGRlZmF1bHRSZWY6ICd6ZXJvT3JNaW4nIHwgJ3plcm9Pck1heCcsIGNoYW5uZWw6ICd4MicgfCAneTInKSB7XG4gIGNvbnN0IHtlbmNvZGluZywgbWFyaywgc3RhY2t9ID0gbW9kZWw7XG5cbiAgY29uc3QgYmFzZUNoYW5uZWwgPSBjaGFubmVsID09PSAneDInID8gJ3gnIDogJ3knO1xuICBjb25zdCBjaGFubmVsRGVmID0gZW5jb2RpbmdbYmFzZUNoYW5uZWxdO1xuICBjb25zdCBzY2FsZU5hbWUgPSBtb2RlbC5zY2FsZU5hbWUoYmFzZUNoYW5uZWwpO1xuICBjb25zdCBzY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGJhc2VDaGFubmVsKTtcblxuICBjb25zdCBvZmZzZXQgPSByZWYuZ2V0T2Zmc2V0KGNoYW5uZWwsIG1vZGVsLm1hcmtEZWYpO1xuXG4gIGNvbnN0IHZhbHVlUmVmID0gIWNoYW5uZWxEZWYgJiYgKGVuY29kaW5nLmxhdGl0dWRlIHx8IGVuY29kaW5nLmxvbmdpdHVkZSkgP1xuICAgIC8vIHVzZSBnZW9wb2ludCBvdXRwdXQgaWYgdGhlcmUgYXJlIGxhdDIvbG9uZzIgYW5kIHRoZXJlIGlzIG5vIHBvaW50IHBvc2l0aW9uMiBvdmVycmlkaW5nIGxhdDIvbG9uZzIuXG4gICAge2ZpZWxkOiBtb2RlbC5nZXROYW1lKGNoYW5uZWwpfTpcbiAgICB7XG4gICAgICAuLi5yZWYuc3RhY2thYmxlMihjaGFubmVsLCBjaGFubmVsRGVmLCBlbmNvZGluZ1tjaGFubmVsXSwgc2NhbGVOYW1lLCBzY2FsZSwgc3RhY2ssXG4gICAgICAgIHJlZi5nZXREZWZhdWx0UmVmKGRlZmF1bHRSZWYsIGJhc2VDaGFubmVsLCBzY2FsZU5hbWUsIHNjYWxlLCBtYXJrKVxuICAgICAgKSxcbiAgICAgIC4uLihvZmZzZXQgPyB7b2Zmc2V0fSA6IHt9KVxuICAgIH07XG5cbiAgcmV0dXJuIHtbY2hhbm5lbF06IHZhbHVlUmVmfTtcbn1cbiJdfQ==