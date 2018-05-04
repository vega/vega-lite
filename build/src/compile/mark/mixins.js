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
function wrapCondition(model, channelDef, vgChannel, refFn) {
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
                log.warn(log.message.cannotUseSizeFieldWithBandSize(channel));
                // TODO: apply size to band and set scale range to some values between 0-1.
                // return {
                //   ...centeredBandPositionMixins,
                //   ...bandSize('size', model, {vgChannel: sizeChannel})
                // };
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
    var valueRef = !channelDef && (encoding.latitude || encoding.longitude) ?
        // use geopoint output if there are lat/long and there is no point position overriding lat/long.
        { field: model.getName(channel) } :
        ref.stackable(channel, encoding[channel], scaleName, scale, stack, ref.getDefaultRef(defaultRef, channel, scaleName, scale, mark));
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
    var encoding = model.encoding, mark = model.mark, markDef = model.markDef, stack = model.stack;
    channel = channel || (markDef.orient === 'horizontal' ? 'x2' : 'y2');
    var baseChannel = channel === 'x2' ? 'x' : 'y';
    var channelDef = encoding[baseChannel];
    var scaleName = model.scaleName(baseChannel);
    var scale = model.getScaleComponent(baseChannel);
    var valueRef = !channelDef && (encoding.latitude || encoding.longitude) ?
        // use geopoint output if there are lat2/long2 and there is no point position2 overriding lat2/long2.
        { field: model.getName(channel) } :
        ref.stackable2(channel, channelDef, encoding[channel], scaleName, scale, stack, ref.getDefaultRef(defaultRef, baseChannel, scaleName, scale, mark));
    return _a = {}, _a[channel] = valueRef, _a;
    var _a;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4aW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvbWFyay9taXhpbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFHbEMsT0FBTyxFQUlMLFdBQVcsRUFDWCxzQkFBc0IsRUFDdEIsVUFBVSxFQUdWLE9BQU8sR0FDUixNQUFNLGdCQUFnQixDQUFDO0FBQ3hCLE9BQU8sS0FBSyxHQUFHLE1BQU0sV0FBVyxDQUFDO0FBRWpDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDaEQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNwQyxPQUFPLEVBQUMsZUFBZSxFQUE0QixNQUFNLG1CQUFtQixDQUFDO0FBQzdFLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDeEMsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFFMUQsT0FBTyxLQUFLLEdBQUcsTUFBTSxZQUFZLENBQUM7QUFFbEMsTUFBTSxnQkFBZ0IsS0FBZ0IsRUFBRSxHQUE4QztJQUE5QyxvQkFBQSxFQUFBLFFBQTZCLFNBQVMsRUFBRSxLQUFLLEVBQUM7SUFDN0UsSUFBQSx1QkFBTyxFQUFFLHlCQUFRLEVBQUUscUJBQU0sQ0FBVTtJQUNuQyxJQUFBLHVCQUFNLEVBQUUsdUJBQWMsQ0FBWTtJQUV6QyxJQUFNLFdBQVcsR0FBRztRQUNsQixJQUFJLEVBQUUsYUFBYSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDO1FBQzVDLE1BQU0sRUFBRSxhQUFhLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUM7UUFDaEQsS0FBSyxFQUFFLGFBQWEsQ0FBQyxPQUFPLEVBQUUsT0FBTyxF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dXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNBcnJheX0gZnJvbSAndmVnYS11dGlsJztcblxuaW1wb3J0IHtOT05QT1NJVElPTl9TQ0FMRV9DSEFOTkVMUywgUG9zaXRpb25TY2FsZUNoYW5uZWx9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtcbiAgQ2hhbm5lbERlZixcbiAgRmllbGREZWYsXG4gIEZpZWxkRGVmV2l0aENvbmRpdGlvbixcbiAgZ2V0RmllbGREZWYsXG4gIGlzQ29uZGl0aW9uYWxTZWxlY3Rpb24sXG4gIGlzVmFsdWVEZWYsXG4gIFRleHRGaWVsZERlZixcbiAgVmFsdWVEZWZXaXRoQ29uZGl0aW9uLFxuICB2Z0ZpZWxkLFxufSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nJztcbmltcG9ydCB7TWFya0RlZn0gZnJvbSAnLi4vLi4vbWFyayc7XG5pbXBvcnQge2V4cHJlc3Npb259IGZyb20gJy4uLy4uL3ByZWRpY2F0ZSc7XG5pbXBvcnQge2hhc0NvbnRpbnVvdXNEb21haW59IGZyb20gJy4uLy4uL3NjYWxlJztcbmltcG9ydCB7Y29udGFpbnN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWR19NQVJLX0NPTkZJR1MsIFZnRW5jb2RlRW50cnksIFZnVmFsdWVSZWZ9IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7Z2V0TWFya0NvbmZpZ30gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7c2VsZWN0aW9uUHJlZGljYXRlfSBmcm9tICcuLi9zZWxlY3Rpb24vc2VsZWN0aW9uJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCAqIGFzIHJlZiBmcm9tICcuL3ZhbHVlcmVmJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbG9yKG1vZGVsOiBVbml0TW9kZWwsIG9wdDoge3ZhbHVlT25seTogYm9vbGVhbn0gPSB7dmFsdWVPbmx5OiBmYWxzZX0pOiBWZ0VuY29kZUVudHJ5IHtcbiAgY29uc3Qge21hcmtEZWYsIGVuY29kaW5nLCBjb25maWd9ID0gbW9kZWw7XG4gIGNvbnN0IHtmaWxsZWQsIHR5cGU6IG1hcmtUeXBlfSA9IG1hcmtEZWY7XG5cbiAgY29uc3QgY29uZmlnVmFsdWUgPSB7XG4gICAgZmlsbDogZ2V0TWFya0NvbmZpZygnZmlsbCcsIG1hcmtEZWYsIGNvbmZpZyksXG4gICAgc3Ryb2tlOiBnZXRNYXJrQ29uZmlnKCdzdHJva2UnLCBtYXJrRGVmLCBjb25maWcpLFxuICAgIGNvbG9yOiBnZXRNYXJrQ29uZmlnKCdjb2xvcicsIG1hcmtEZWYsIGNvbmZpZylcbiAgfTtcblxuICBjb25zdCB0cmFuc3BhcmVudElmTmVlZGVkID0gY29udGFpbnMoWydiYXInLCAncG9pbnQnLCAnY2lyY2xlJywgJ3NxdWFyZScsICdnZW9zaGFwZSddLCBtYXJrVHlwZSkgPyAndHJhbnNwYXJlbnQnIDogdW5kZWZpbmVkO1xuXG4gIGNvbnN0IGRlZmF1bHRWYWx1ZSA9IHtcbiAgICBmaWxsOiBtYXJrRGVmLmZpbGwgfHwgY29uZmlnVmFsdWUuZmlsbCB8fFxuICAgIC8vIElmIHRoZXJlIGlzIG5vIGZpbGwsIGFsd2F5cyBmaWxsIHN5bWJvbHMsIGJhciwgZ2Vvc2hhcGVcbiAgICAvLyB3aXRoIHRyYW5zcGFyZW50IGZpbGxzIGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EtbGl0ZS9pc3N1ZXMvMTMxNlxuICAgICAgdHJhbnNwYXJlbnRJZk5lZWRlZCxcbiAgICBzdHJva2U6IG1hcmtEZWYuc3Ryb2tlIHx8IGNvbmZpZ1ZhbHVlLnN0cm9rZVxuICB9O1xuXG4gIGNvbnN0IGNvbG9yVmdDaGFubmVsID0gZmlsbGVkID8gJ2ZpbGwnIDogJ3N0cm9rZSc7XG5cbiAgY29uc3QgZmlsbFN0cm9rZU1hcmtEZWZBbmRDb25maWc6IFZnRW5jb2RlRW50cnkgPSB7XG4gICAgLi4uKGRlZmF1bHRWYWx1ZS5maWxsID8ge1xuICAgICAgZmlsbDoge3ZhbHVlOiBkZWZhdWx0VmFsdWUuZmlsbH1cbiAgICB9IDoge30pLFxuICAgIC4uLihkZWZhdWx0VmFsdWUuc3Ryb2tlID8ge1xuICAgICAgc3Ryb2tlOiB7dmFsdWU6IGRlZmF1bHRWYWx1ZS5zdHJva2V9XG4gICAgfSA6IHt9KSxcbiAgfTtcblxuICBpZiAoZW5jb2RpbmcuZmlsbCB8fCBlbmNvZGluZy5zdHJva2UpIHtcbiAgICAvLyBpZ25vcmUgZW5jb2RpbmcuY29sb3IsIG1hcmtEZWYuY29sb3IsIGNvbmZpZy5jb2xvclxuICAgIGlmIChtYXJrRGVmLmNvbG9yKSB7XG4gICAgICAvLyB3YXJuIGZvciBtYXJrRGVmLmNvbG9yICAobm8gbmVlZCB0byB3YXJuIGVuY29kaW5nLmNvbG9yIGFzIGl0IHdpbGwgYmUgZHJvcHBlZCBpbiBub3JtYWxpemVkIGFscmVhZHkpXG4gICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5kcm9wcGluZ0NvbG9yKCdwcm9wZXJ0eScsIHtmaWxsOiAnZmlsbCcgaW4gZW5jb2RpbmcsIHN0cm9rZTogJ3N0cm9rZScgaW4gZW5jb2Rpbmd9KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm5vblBvc2l0aW9uKCdmaWxsJywgbW9kZWwsIHtkZWZhdWx0VmFsdWU6IGRlZmF1bHRWYWx1ZS5maWxsIHx8IHRyYW5zcGFyZW50SWZOZWVkZWR9KSxcbiAgICAgIC4uLm5vblBvc2l0aW9uKCdzdHJva2UnLCBtb2RlbCwge2RlZmF1bHRWYWx1ZTogZGVmYXVsdFZhbHVlLnN0cm9rZX0pXG4gICAgfTtcbiAgfSBlbHNlIGlmIChlbmNvZGluZy5jb2xvcikge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmZpbGxTdHJva2VNYXJrRGVmQW5kQ29uZmlnLFxuICAgICAgLy8gb3ZlcnJpZGUgdGhlbSB3aXRoIGVuY29kZWQgY29sb3IgZmllbGRcbiAgICAgIC4uLm5vblBvc2l0aW9uKCdjb2xvcicsIG1vZGVsLCB7XG4gICAgICAgIHZnQ2hhbm5lbDogY29sb3JWZ0NoYW5uZWwsXG4gICAgICAgIC8vIGFwcGx5IGRlZmF1bHQgZmlsbC9zdHJva2UgZmlyc3QsIHRoZW4gY29sb3IgY29uZmlnLCB0aGVuIHRyYW5zcGFyZW50IGlmIG5lZWRlZC5cbiAgICAgICAgZGVmYXVsdFZhbHVlOiBtYXJrRGVmW2NvbG9yVmdDaGFubmVsXSB8fCBtYXJrRGVmLmNvbG9yIHx8IGNvbmZpZ1ZhbHVlW2NvbG9yVmdDaGFubmVsXSB8fCBjb25maWdWYWx1ZS5jb2xvciB8fCAoZmlsbGVkID8gdHJhbnNwYXJlbnRJZk5lZWRlZCA6IHVuZGVmaW5lZClcbiAgICAgIH0pXG4gICAgfTtcbiAgfSBlbHNlIGlmIChtYXJrRGVmLmZpbGwgfHwgbWFya0RlZi5zdHJva2UpIHtcbiAgICAvLyBJZ25vcmUgbWFya0RlZi5jb2xvciwgY29uZmlnLmNvbG9yXG4gICAgaWYgKG1hcmtEZWYuY29sb3IpIHtcbiAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmRyb3BwaW5nQ29sb3IoJ3Byb3BlcnR5Jywge2ZpbGw6ICdmaWxsJyBpbiBtYXJrRGVmLCBzdHJva2U6ICdzdHJva2UnIGluIG1hcmtEZWZ9KSk7XG4gICAgfVxuICAgIHJldHVybiBmaWxsU3Ryb2tlTWFya0RlZkFuZENvbmZpZztcbiAgfSBlbHNlIGlmIChtYXJrRGVmLmNvbG9yKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmZpbGxTdHJva2VNYXJrRGVmQW5kQ29uZmlnLCAvLyBpbiB0aGlzIGNhc2UsIGZpbGxTdHJva2VNYXJrRGVmQW5kQ29uZmlnIG9ubHkgaW5jbHVkZSBjb25maWdcblxuICAgICAgLy8gb3ZlcnJpZGUgY29uZmlnIHdpdGggbWFya0RlZi5jb2xvclxuICAgICAgW2NvbG9yVmdDaGFubmVsXToge3ZhbHVlOiBtYXJrRGVmLmNvbG9yfVxuICAgIH07XG4gIH0gZWxzZSBpZiAoY29uZmlnVmFsdWUuZmlsbCB8fCBjb25maWdWYWx1ZS5zdHJva2UpIHtcbiAgICAvLyBpZ25vcmUgY29uZmlnLmNvbG9yXG4gICAgcmV0dXJuIGZpbGxTdHJva2VNYXJrRGVmQW5kQ29uZmlnO1xuICB9IGVsc2UgaWYgKGNvbmZpZ1ZhbHVlLmNvbG9yKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLih0cmFuc3BhcmVudElmTmVlZGVkID8ge2ZpbGw6IHt2YWx1ZTogJ3RyYW5zcGFyZW50J319IDoge30pLFxuICAgICAgW2NvbG9yVmdDaGFubmVsXToge3ZhbHVlOiBjb25maWdWYWx1ZS5jb2xvcn1cbiAgICB9O1xuICB9XG4gIHJldHVybiB7fTtcbn1cblxuZXhwb3J0IHR5cGUgSWdub3JlID0gUmVjb3JkPCdzaXplJyB8ICdvcmllbnQnLCAnaWdub3JlJyB8ICdpbmNsdWRlJz47XG5cbmV4cG9ydCBmdW5jdGlvbiBiYXNlRW5jb2RlRW50cnkobW9kZWw6IFVuaXRNb2RlbCwgaWdub3JlOiBJZ25vcmUpIHtcbiAgcmV0dXJuIHtcbiAgICAuLi5tYXJrRGVmUHJvcGVydGllcyhtb2RlbC5tYXJrRGVmLCBpZ25vcmUpLFxuICAgIC4uLmNvbG9yKG1vZGVsKSxcbiAgICAuLi5ub25Qb3NpdGlvbignb3BhY2l0eScsIG1vZGVsKSxcbiAgICAuLi50b29sdGlwKG1vZGVsKSxcbiAgICAuLi50ZXh0KG1vZGVsLCAnaHJlZicpXG4gIH07XG59XG5cbmZ1bmN0aW9uIG1hcmtEZWZQcm9wZXJ0aWVzKG1hcms6IE1hcmtEZWYsIGlnbm9yZTogSWdub3JlKSB7XG4gIHJldHVybiBWR19NQVJLX0NPTkZJR1MucmVkdWNlKChtLCBwcm9wKSA9PiB7XG4gICAgaWYgKG1hcmtbcHJvcF0gIT09IHVuZGVmaW5lZCAmJiBpZ25vcmVbcHJvcF0gIT09ICdpZ25vcmUnKSB7XG4gICAgICBtW3Byb3BdID0ge3ZhbHVlOiBtYXJrW3Byb3BdfTtcbiAgICB9XG4gICAgcmV0dXJuIG07XG4gIH0sIHt9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbHVlSWZEZWZpbmVkKHByb3A6IHN0cmluZywgdmFsdWU6IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4pOiBWZ0VuY29kZUVudHJ5IHtcbiAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4ge1twcm9wXToge3ZhbHVlOiB2YWx1ZX19O1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIHZhbGlkUHJlZGljYXRlKHZnUmVmOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGAke3ZnUmVmfSAhPT0gbnVsbCAmJiAhaXNOYU4oJHt2Z1JlZn0pYDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmluZWQobW9kZWw6IFVuaXRNb2RlbCk6IFZnRW5jb2RlRW50cnkge1xuICBpZiAobW9kZWwuY29uZmlnLmludmFsaWRWYWx1ZXMgPT09ICdmaWx0ZXInKSB7XG4gICAgY29uc3QgZmllbGRzID0gWyd4JywgJ3knXS5tYXAoKGNoYW5uZWw6IFBvc2l0aW9uU2NhbGVDaGFubmVsKSA9PiB7XG4gICAgICAgIGNvbnN0IHNjYWxlQ29tcG9uZW50ID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCk7XG4gICAgICAgIGlmIChzY2FsZUNvbXBvbmVudCkge1xuICAgICAgICAgIGNvbnN0IHNjYWxlVHlwZSA9IHNjYWxlQ29tcG9uZW50LmdldCgndHlwZScpO1xuXG4gICAgICAgICAgLy8gRGlzY3JldGUgZG9tYWluIHNjYWxlcyBjYW4gaGFuZGxlIGludmFsaWQgdmFsdWVzLCBidXQgY29udGludW91cyBzY2FsZXMgY2FuJ3QuXG4gICAgICAgICAgaWYgKGhhc0NvbnRpbnVvdXNEb21haW4oc2NhbGVUeXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIG1vZGVsLnZnRmllbGQoY2hhbm5lbCwge2V4cHI6ICdkYXR1bSd9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH0pXG4gICAgICAuZmlsdGVyKGZpZWxkID0+ICEhZmllbGQpXG4gICAgICAubWFwKHZhbGlkUHJlZGljYXRlKTtcblxuICAgIGlmIChmaWVsZHMubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZGVmaW5lZDoge3NpZ25hbDogZmllbGRzLmpvaW4oJyAmJiAnKX1cbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHt9O1xufVxuXG4vKipcbiAqIFJldHVybiBtaXhpbnMgZm9yIG5vbi1wb3NpdGlvbmFsIGNoYW5uZWxzIHdpdGggc2NhbGVzLiAgKFRleHQgZG9lc24ndCBoYXZlIHNjYWxlLilcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vblBvc2l0aW9uKGNoYW5uZWw6IHR5cGVvZiBOT05QT1NJVElPTl9TQ0FMRV9DSEFOTkVMU1swXSwgbW9kZWw6IFVuaXRNb2RlbCwgb3B0OiB7ZGVmYXVsdFZhbHVlPzogbnVtYmVyIHwgc3RyaW5nIHwgYm9vbGVhbiwgdmdDaGFubmVsPzogc3RyaW5nLCBkZWZhdWx0UmVmPzogVmdWYWx1ZVJlZn0gPSB7fSk6IFZnRW5jb2RlRW50cnkge1xuICBjb25zdCB7ZGVmYXVsdFZhbHVlLCB2Z0NoYW5uZWx9ID0gb3B0O1xuICBjb25zdCBkZWZhdWx0UmVmID0gb3B0LmRlZmF1bHRSZWYgfHwgKGRlZmF1bHRWYWx1ZSAhPT0gdW5kZWZpbmVkID8ge3ZhbHVlOiBkZWZhdWx0VmFsdWV9IDogdW5kZWZpbmVkKTtcblxuICBjb25zdCBjaGFubmVsRGVmID0gbW9kZWwuZW5jb2RpbmdbY2hhbm5lbF07XG5cbiAgcmV0dXJuIHdyYXBDb25kaXRpb24obW9kZWwsIGNoYW5uZWxEZWYsIHZnQ2hhbm5lbCB8fCBjaGFubmVsLCAoY0RlZikgPT4ge1xuICAgIHJldHVybiByZWYubWlkUG9pbnQoXG4gICAgICBjaGFubmVsLCBjRGVmLCBtb2RlbC5zY2FsZU5hbWUoY2hhbm5lbCksXG4gICAgICBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKSxcbiAgICAgIG51bGwsIC8vIE5vIG5lZWQgdG8gcHJvdmlkZSBzdGFjayBmb3Igbm9uLXBvc2l0aW9uIGFzIGl0IGRvZXMgbm90IGFmZmVjdCBtaWQgcG9pbnRcbiAgICAgIGRlZmF1bHRSZWZcbiAgICApO1xuICB9KTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBtaXhpbiB0aGF0IGluY2x1ZGUgYSBWZWdhIHByb2R1Y3Rpb24gcnVsZSBmb3IgYSBWZWdhLUxpdGUgY29uZGl0aW9uYWwgY2hhbm5lbCBkZWZpbml0aW9uLlxuICogb3IgYSBzaW1wbGUgbWl4aW4gaWYgY2hhbm5lbCBkZWYgaGFzIG5vIGNvbmRpdGlvbi5cbiAqL1xuZnVuY3Rpb24gd3JhcENvbmRpdGlvbihcbiAgICBtb2RlbDogVW5pdE1vZGVsLCBjaGFubmVsRGVmOiBDaGFubmVsRGVmPHN0cmluZz4sIHZnQ2hhbm5lbDogc3RyaW5nLFxuICAgIHJlZkZuOiAoY0RlZjogQ2hhbm5lbERlZjxzdHJpbmc+KSA9PiBWZ1ZhbHVlUmVmXG4gICk6IFZnRW5jb2RlRW50cnkge1xuICBjb25zdCBjb25kaXRpb24gPSBjaGFubmVsRGVmICYmIGNoYW5uZWxEZWYuY29uZGl0aW9uO1xuICBjb25zdCB2YWx1ZVJlZiA9IHJlZkZuKGNoYW5uZWxEZWYpO1xuICBpZiAoY29uZGl0aW9uKSB7XG4gICAgY29uc3QgY29uZGl0aW9ucyA9IGlzQXJyYXkoY29uZGl0aW9uKSA/IGNvbmRpdGlvbiA6IFtjb25kaXRpb25dO1xuICAgIGNvbnN0IHZnQ29uZGl0aW9ucyA9IGNvbmRpdGlvbnMubWFwKChjKSA9PiB7XG4gICAgICBjb25zdCBjb25kaXRpb25WYWx1ZVJlZiA9IHJlZkZuKGMpO1xuICAgICAgY29uc3QgdGVzdCA9IGlzQ29uZGl0aW9uYWxTZWxlY3Rpb24oYykgPyBzZWxlY3Rpb25QcmVkaWNhdGUobW9kZWwsIGMuc2VsZWN0aW9uKSA6IGV4cHJlc3Npb24obW9kZWwsIGMudGVzdCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0ZXN0LFxuICAgICAgICAuLi5jb25kaXRpb25WYWx1ZVJlZlxuICAgICAgfTtcbiAgICB9KTtcbiAgICByZXR1cm4ge1xuICAgICAgW3ZnQ2hhbm5lbF06IFtcbiAgICAgICAgLi4udmdDb25kaXRpb25zLFxuICAgICAgICAuLi4odmFsdWVSZWYgIT09IHVuZGVmaW5lZCA/IFt2YWx1ZVJlZl0gOiBbXSlcbiAgICAgIF1cbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB2YWx1ZVJlZiAhPT0gdW5kZWZpbmVkID8ge1t2Z0NoYW5uZWxdOiB2YWx1ZVJlZn0gOiB7fTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9vbHRpcChtb2RlbDogVW5pdE1vZGVsKSB7XG4gIGNvbnN0IGNoYW5uZWwgPSAndG9vbHRpcCc7XG4gIGNvbnN0IGNoYW5uZWxEZWYgPSBtb2RlbC5lbmNvZGluZ1tjaGFubmVsXTtcbiAgaWYgKGlzQXJyYXkoY2hhbm5lbERlZikpIHtcbiAgICBjb25zdCBrZXlWYWx1ZXMgPSBjaGFubmVsRGVmLm1hcCgoZmllbGREZWYpID0+IHtcbiAgICAgIGNvbnN0IGtleSA9IGZpZWxkRGVmLnRpdGxlICE9PSB1bmRlZmluZWQgPyBmaWVsZERlZi50aXRsZSA6IHZnRmllbGQoZmllbGREZWYsIHtiaW5TdWZmaXg6ICdyYW5nZSd9KTtcbiAgICAgIGNvbnN0IHZhbHVlID0gcmVmLnRleHQoZmllbGREZWYsIG1vZGVsLmNvbmZpZykuc2lnbmFsO1xuICAgICAgcmV0dXJuIGBcIiR7a2V5fVwiOiAke3ZhbHVlfWA7XG4gICAgfSk7XG4gICAgcmV0dXJuIHt0b29sdGlwOiB7c2lnbmFsOiBgeyR7a2V5VmFsdWVzLmpvaW4oJywgJyl9fWB9fTtcbiAgfSBlbHNlIHtcbiAgICAvLyBpZiBub3QgYW4gYXJyYXksIGJlaGF2ZSBqdXN0IGxpa2UgdGV4dFxuICAgIHJldHVybiB0ZXh0Q29tbW9uKG1vZGVsLCBjaGFubmVsLCBjaGFubmVsRGVmKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdGV4dChtb2RlbDogVW5pdE1vZGVsLCBjaGFubmVsOiAndGV4dCcgfCAnaHJlZicgPSAndGV4dCcpIHtcbiAgY29uc3QgY2hhbm5lbERlZiA9IG1vZGVsLmVuY29kaW5nW2NoYW5uZWxdO1xuICByZXR1cm4gdGV4dENvbW1vbihtb2RlbCwgY2hhbm5lbCwgY2hhbm5lbERlZik7XG59XG5cbmZ1bmN0aW9uIHRleHRDb21tb24obW9kZWw6IFVuaXRNb2RlbCwgY2hhbm5lbDogJ3RleHQnIHwgJ2hyZWYnIHwgJ3Rvb2x0aXAnLCBjaGFubmVsRGVmOiBGaWVsZERlZldpdGhDb25kaXRpb248VGV4dEZpZWxkRGVmPHN0cmluZz4+IHwgVmFsdWVEZWZXaXRoQ29uZGl0aW9uPFRleHRGaWVsZERlZjxzdHJpbmc+Pikge1xuICByZXR1cm4gd3JhcENvbmRpdGlvbihtb2RlbCwgY2hhbm5lbERlZiwgY2hhbm5lbCwgKGNEZWYpID0+IHJlZi50ZXh0KGNEZWYsIG1vZGVsLmNvbmZpZykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmFuZFBvc2l0aW9uKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjaGFubmVsOiAneCd8J3knLCBtb2RlbDogVW5pdE1vZGVsKSB7XG4gIGNvbnN0IHNjYWxlTmFtZSA9IG1vZGVsLnNjYWxlTmFtZShjaGFubmVsKTtcbiAgY29uc3Qgc2l6ZUNoYW5uZWwgPSBjaGFubmVsID09PSAneCcgPyAnd2lkdGgnIDogJ2hlaWdodCc7XG5cbiAgaWYgKG1vZGVsLmVuY29kaW5nLnNpemUgfHwgbW9kZWwubWFya0RlZi5zaXplICE9PSB1bmRlZmluZWQpIHtcbiAgICBjb25zdCBvcmllbnQgPSBtb2RlbC5tYXJrRGVmLm9yaWVudDtcbiAgICBpZiAob3JpZW50KSB7XG4gICAgICBjb25zdCBjZW50ZXJlZEJhbmRQb3NpdGlvbk1peGlucyA9IHtcbiAgICAgICAgLy8gVXNlIHhjL3ljIGFuZCBwbGFjZSB0aGUgbWFyayBhdCB0aGUgbWlkZGxlIG9mIHRoZSBiYW5kXG4gICAgICAgIC8vIFRoaXMgd2F5IHdlIG5ldmVyIGhhdmUgdG8gZGVhbCB3aXRoIHNpemUncyBjb25kaXRpb24gZm9yIHgveSBwb3NpdGlvbi5cbiAgICAgICAgW2NoYW5uZWwrJ2MnXTogcmVmLmZpZWxkUmVmKGZpZWxkRGVmLCBzY2FsZU5hbWUsIHt9LCB7YmFuZDogMC41fSlcbiAgICAgIH07XG5cbiAgICAgIGlmIChnZXRGaWVsZERlZihtb2RlbC5lbmNvZGluZy5zaXplKSkge1xuICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5jYW5ub3RVc2VTaXplRmllbGRXaXRoQmFuZFNpemUoY2hhbm5lbCkpO1xuICAgICAgICAvLyBUT0RPOiBhcHBseSBzaXplIHRvIGJhbmQgYW5kIHNldCBzY2FsZSByYW5nZSB0byBzb21lIHZhbHVlcyBiZXR3ZWVuIDAtMS5cbiAgICAgICAgLy8gcmV0dXJuIHtcbiAgICAgICAgLy8gICAuLi5jZW50ZXJlZEJhbmRQb3NpdGlvbk1peGlucyxcbiAgICAgICAgLy8gICAuLi5iYW5kU2l6ZSgnc2l6ZScsIG1vZGVsLCB7dmdDaGFubmVsOiBzaXplQ2hhbm5lbH0pXG4gICAgICAgIC8vIH07XG4gICAgICB9IGVsc2UgaWYgKGlzVmFsdWVEZWYobW9kZWwuZW5jb2Rpbmcuc2l6ZSkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5jZW50ZXJlZEJhbmRQb3NpdGlvbk1peGlucyxcbiAgICAgICAgICAuLi5ub25Qb3NpdGlvbignc2l6ZScsIG1vZGVsLCB7dmdDaGFubmVsOiBzaXplQ2hhbm5lbH0pXG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKG1vZGVsLm1hcmtEZWYuc2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uY2VudGVyZWRCYW5kUG9zaXRpb25NaXhpbnMsXG4gICAgICAgICAgW3NpemVDaGFubmVsXToge3ZhbHVlOiBtb2RlbC5tYXJrRGVmLnNpemV9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmNhbm5vdEFwcGx5U2l6ZVRvTm9uT3JpZW50ZWRNYXJrKG1vZGVsLm1hcmtEZWYudHlwZSkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge1xuICAgIFtjaGFubmVsXTogcmVmLmZpZWxkUmVmKGZpZWxkRGVmLCBzY2FsZU5hbWUsIHtiaW5TdWZmaXg6ICdyYW5nZSd9KSxcbiAgICBbc2l6ZUNoYW5uZWxdOiByZWYuYmFuZFJlZihzY2FsZU5hbWUpXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjZW50ZXJlZEJhbmRQb3NpdGlvbihjaGFubmVsOiAneCcgfCAneScsIG1vZGVsOiBVbml0TW9kZWwsIGRlZmF1bHRQb3NSZWY6IFZnVmFsdWVSZWYsIGRlZmF1bHRTaXplUmVmOiBWZ1ZhbHVlUmVmKSB7XG4gIGNvbnN0IGNlbnRlckNoYW5uZWw6ICd4YycgfCAneWMnID0gY2hhbm5lbCA9PT0gJ3gnID8gJ3hjJyA6ICd5Yyc7XG4gIGNvbnN0IHNpemVDaGFubmVsID0gY2hhbm5lbCA9PT0gJ3gnID8gJ3dpZHRoJyA6ICdoZWlnaHQnO1xuICByZXR1cm4ge1xuICAgIC4uLnBvaW50UG9zaXRpb24oY2hhbm5lbCwgbW9kZWwsIGRlZmF1bHRQb3NSZWYsIGNlbnRlckNoYW5uZWwpLFxuICAgIC4uLm5vblBvc2l0aW9uKCdzaXplJywgbW9kZWwsIHtkZWZhdWx0UmVmOiBkZWZhdWx0U2l6ZVJlZiwgdmdDaGFubmVsOiBzaXplQ2hhbm5lbH0pXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5uZWRQb3NpdGlvbihmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY2hhbm5lbDogJ3gnfCd5Jywgc2NhbGVOYW1lOiBzdHJpbmcsIHNwYWNpbmc6IG51bWJlciwgcmV2ZXJzZTogYm9vbGVhbikge1xuICBpZiAoY2hhbm5lbCA9PT0gJ3gnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHgyOiByZWYuYmluKGZpZWxkRGVmLCBzY2FsZU5hbWUsICdzdGFydCcsIHJldmVyc2UgPyAwIDogc3BhY2luZyksXG4gICAgICB4OiByZWYuYmluKGZpZWxkRGVmLCBzY2FsZU5hbWUsICdlbmQnLCByZXZlcnNlID8gc3BhY2luZyA6IDApXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgeTI6IHJlZi5iaW4oZmllbGREZWYsIHNjYWxlTmFtZSwgJ3N0YXJ0JywgcmV2ZXJzZSA/IHNwYWNpbmcgOiAwKSxcbiAgICAgIHk6IHJlZi5iaW4oZmllbGREZWYsIHNjYWxlTmFtZSwgJ2VuZCcsIHJldmVyc2UgPyAwIDogc3BhY2luZylcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJuIG1peGlucyBmb3IgcG9pbnQgKG5vbi1iYW5kKSBwb3NpdGlvbiBjaGFubmVscy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBvaW50UG9zaXRpb24oY2hhbm5lbDogJ3gnfCd5JywgbW9kZWw6IFVuaXRNb2RlbCwgZGVmYXVsdFJlZjogVmdWYWx1ZVJlZiB8ICd6ZXJvT3JNaW4nIHwgJ3plcm9Pck1heCcsIHZnQ2hhbm5lbD86ICd4J3wneSd8J3hjJ3wneWMnKSB7XG4gIC8vIFRPRE86IHJlZmFjdG9yIGhvdyByZWZlciB0byBzY2FsZSBhcyBkaXNjdXNzZWQgaW4gaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL3B1bGwvMTYxM1xuXG4gIGNvbnN0IHtlbmNvZGluZywgbWFyaywgc3RhY2t9ID0gbW9kZWw7XG5cbiAgY29uc3QgY2hhbm5lbERlZiA9IGVuY29kaW5nW2NoYW5uZWxdO1xuICBjb25zdCBzY2FsZU5hbWUgPSBtb2RlbC5zY2FsZU5hbWUoY2hhbm5lbCk7XG4gIGNvbnN0IHNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCk7XG5cbiAgY29uc3QgdmFsdWVSZWYgPSAhY2hhbm5lbERlZiAmJiAoZW5jb2RpbmcubGF0aXR1ZGUgfHwgZW5jb2RpbmcubG9uZ2l0dWRlKSA/XG4gICAgLy8gdXNlIGdlb3BvaW50IG91dHB1dCBpZiB0aGVyZSBhcmUgbGF0L2xvbmcgYW5kIHRoZXJlIGlzIG5vIHBvaW50IHBvc2l0aW9uIG92ZXJyaWRpbmcgbGF0L2xvbmcuXG4gICAge2ZpZWxkOiBtb2RlbC5nZXROYW1lKGNoYW5uZWwpfSA6XG4gICAgcmVmLnN0YWNrYWJsZShjaGFubmVsLCBlbmNvZGluZ1tjaGFubmVsXSwgc2NhbGVOYW1lLCBzY2FsZSwgc3RhY2ssXG4gICAgICByZWYuZ2V0RGVmYXVsdFJlZihkZWZhdWx0UmVmLCBjaGFubmVsLCBzY2FsZU5hbWUsIHNjYWxlLCBtYXJrKVxuICAgICk7XG5cbiAgcmV0dXJuIHtcbiAgICBbdmdDaGFubmVsIHx8IGNoYW5uZWxdOiB2YWx1ZVJlZlxuICB9O1xufVxuXG4vKipcbiAqIFJldHVybiBtaXhpbnMgZm9yIHgyLCB5Mi5cbiAqIElmIGNoYW5uZWwgaXMgbm90IHNwZWNpZmllZCwgcmV0dXJuIG9uZSBjaGFubmVsIGJhc2VkIG9uIG9yaWVudGF0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcG9pbnRQb3NpdGlvbjIobW9kZWw6IFVuaXRNb2RlbCwgZGVmYXVsdFJlZjogJ3plcm9Pck1pbicgfCAnemVyb09yTWF4JywgY2hhbm5lbD86ICd4MicgfCAneTInKSB7XG4gIGNvbnN0IHtlbmNvZGluZywgbWFyaywgbWFya0RlZiwgc3RhY2t9ID0gbW9kZWw7XG4gIGNoYW5uZWwgPSBjaGFubmVsIHx8IChtYXJrRGVmLm9yaWVudCA9PT0gJ2hvcml6b250YWwnID8gJ3gyJyA6ICd5MicpO1xuXG4gIGNvbnN0IGJhc2VDaGFubmVsID0gY2hhbm5lbCA9PT0gJ3gyJyA/ICd4JyA6ICd5JztcbiAgY29uc3QgY2hhbm5lbERlZiA9IGVuY29kaW5nW2Jhc2VDaGFubmVsXTtcbiAgY29uc3Qgc2NhbGVOYW1lID0gbW9kZWwuc2NhbGVOYW1lKGJhc2VDaGFubmVsKTtcbiAgY29uc3Qgc2NhbGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChiYXNlQ2hhbm5lbCk7XG5cbiAgY29uc3QgdmFsdWVSZWYgPSAhY2hhbm5lbERlZiAmJiAoZW5jb2RpbmcubGF0aXR1ZGUgfHwgZW5jb2RpbmcubG9uZ2l0dWRlKSA/XG4gICAgLy8gdXNlIGdlb3BvaW50IG91dHB1dCBpZiB0aGVyZSBhcmUgbGF0Mi9sb25nMiBhbmQgdGhlcmUgaXMgbm8gcG9pbnQgcG9zaXRpb24yIG92ZXJyaWRpbmcgbGF0Mi9sb25nMi5cbiAgICB7ZmllbGQ6IG1vZGVsLmdldE5hbWUoY2hhbm5lbCl9OlxuICAgIHJlZi5zdGFja2FibGUyKGNoYW5uZWwsIGNoYW5uZWxEZWYsIGVuY29kaW5nW2NoYW5uZWxdLCBzY2FsZU5hbWUsIHNjYWxlLCBzdGFjayxcbiAgICAgIHJlZi5nZXREZWZhdWx0UmVmKGRlZmF1bHRSZWYsIGJhc2VDaGFubmVsLCBzY2FsZU5hbWUsIHNjYWxlLCBtYXJrKVxuICAgICk7XG5cbiAgcmV0dXJuIHtbY2hhbm5lbF06IHZhbHVlUmVmfTtcbn1cbiJdfQ==