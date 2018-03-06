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
var vega_util_1 = require("vega-util");
var fielddef_1 = require("../../fielddef");
var log = require("../../log");
var predicate_1 = require("../../predicate");
var util = require("../../util");
var vega_schema_1 = require("../../vega.schema");
var common_1 = require("../common");
var selection_1 = require("../selection/selection");
var ref = require("./valueref");
function color(model) {
    var config = model.config;
    var filled = model.markDef.filled;
    var vgChannel = filled ? 'fill' : 'stroke';
    var e = nonPosition('color', model, {
        vgChannel: vgChannel,
        // Mark definition has higher precedence than config;
        // fill/stroke has higher precedence than color.
        defaultValue: model.markDef[vgChannel] ||
            model.markDef.color ||
            common_1.getMarkConfig(vgChannel, model.markDef, config) ||
            common_1.getMarkConfig('color', model.markDef, config)
    });
    // If there is no fill, always fill symbols
    // with transparent fills https://github.com/vega/vega-lite/issues/1316
    if (!e.fill && util.contains(['bar', 'point', 'circle', 'square', 'geoshape'], model.mark())) {
        e.fill = { value: 'transparent' };
    }
    return e;
}
exports.color = color;
function baseEncodeEntry(model, ignore) {
    return __assign({}, markDefProperties(model.markDef, ignore), color(model), nonPosition('opacity', model), text(model, 'tooltip'), text(model, 'href'));
}
exports.baseEncodeEntry = baseEncodeEntry;
function markDefProperties(mark, ignore) {
    return vega_schema_1.VG_MARK_CONFIGS.reduce(function (m, prop) {
        if (mark[prop] && ignore[prop] !== 'ignore') {
            m[prop] = { value: mark[prop] };
        }
        return m;
    }, {});
}
function valueIfDefined(prop, value) {
    if (value !== undefined) {
        return _a = {}, _a[prop] = { value: value }, _a;
    }
    return undefined;
    var _a;
}
exports.valueIfDefined = valueIfDefined;
/**
 * Return mixins for non-positional channels with scales.  (Text doesn't have scale.)
 */
function nonPosition(channel, model, opt) {
    // TODO: refactor how we refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613
    if (opt === void 0) { opt = {}; }
    var defaultValue = opt.defaultValue, vgChannel = opt.vgChannel;
    var defaultRef = opt.defaultRef || (defaultValue !== undefined ? { value: defaultValue } : undefined);
    var channelDef = model.encoding[channel];
    return wrapCondition(model, channelDef, vgChannel || channel, function (cDef) {
        return ref.midPoint(channel, cDef, model.scaleName(channel), model.getScaleComponent(channel), null, // No need to provide stack for non-position as it does not affect mid point
        defaultRef);
    });
}
exports.nonPosition = nonPosition;
/**
 * Return a mixin that include a Vega production rule for a Vega-Lite conditional channel definition.
 * or a simple mixin if channel def has no condition.
 */
function wrapCondition(model, channelDef, vgChannel, refFn) {
    var condition = channelDef && channelDef.condition;
    var valueRef = refFn(channelDef);
    if (condition) {
        var conditions = vega_util_1.isArray(condition) ? condition : [condition];
        var vgConditions = conditions.map(function (c) {
            var conditionValueRef = refFn(c);
            var test = fielddef_1.isConditionalSelection(c) ? selection_1.selectionPredicate(model, c.selection) : predicate_1.expression(model, c.test);
            return __assign({ test: test }, conditionValueRef);
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
function text(model, channel) {
    if (channel === void 0) { channel = 'text'; }
    var channelDef = model.encoding[channel];
    return wrapCondition(model, channelDef, channel, function (cDef) { return ref.text(cDef, model.config); });
}
exports.text = text;
function bandPosition(fieldDef, channel, model) {
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
            if (fielddef_1.getFieldDef(model.encoding.size)) {
                log.warn(log.message.cannotUseSizeFieldWithBandSize(channel));
                // TODO: apply size to band and set scale range to some values between 0-1.
                // return {
                //   ...centeredBandPositionMixins,
                //   ...bandSize('size', model, {vgChannel: sizeChannel})
                // };
            }
            else if (fielddef_1.isValueDef(model.encoding.size)) {
                return __assign({}, centeredBandPositionMixins, nonPosition('size', model, { vgChannel: sizeChannel }));
            }
            else if (model.markDef.size !== undefined) {
                return __assign({}, centeredBandPositionMixins, (_b = {}, _b[sizeChannel] = { value: model.markDef.size }, _b));
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
exports.bandPosition = bandPosition;
function centeredBandPosition(channel, model, defaultPosRef, defaultSizeRef) {
    var centerChannel = channel === 'x' ? 'xc' : 'yc';
    var sizeChannel = channel === 'x' ? 'width' : 'height';
    return __assign({}, pointPosition(channel, model, defaultPosRef, centerChannel), nonPosition('size', model, { defaultRef: defaultSizeRef, vgChannel: sizeChannel }));
}
exports.centeredBandPosition = centeredBandPosition;
function binnedPosition(fieldDef, channel, scaleName, spacing, reverse) {
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
exports.binnedPosition = binnedPosition;
/**
 * Return mixins for point (non-band) position channels.
 */
function pointPosition(channel, model, defaultRef, vgChannel) {
    // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613
    var encoding = model.encoding, stack = model.stack;
    var valueRef = ref.stackable(channel, encoding[channel], model.scaleName(channel), model.getScaleComponent(channel), stack, defaultRef);
    return _a = {},
        _a[vgChannel || channel] = valueRef,
        _a;
    var _a;
}
exports.pointPosition = pointPosition;
/**
 * Return mixins for x2, y2.
 * If channel is not specified, return one channel based on orientation.
 */
function pointPosition2(model, defaultRef, channel) {
    var encoding = model.encoding, markDef = model.markDef, stack = model.stack;
    channel = channel || (markDef.orient === 'horizontal' ? 'x2' : 'y2');
    var baseChannel = channel === 'x2' ? 'x' : 'y';
    var valueRef = ref.stackable2(channel, encoding[baseChannel], encoding[channel], model.scaleName(baseChannel), model.getScaleComponent(baseChannel), stack, defaultRef);
    return _a = {}, _a[channel] = valueRef, _a;
    var _a;
}
exports.pointPosition2 = pointPosition2;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4aW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvbWFyay9taXhpbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHVDQUFrQztBQUVsQywyQ0FBcUc7QUFDckcsK0JBQWlDO0FBRWpDLDZDQUEyQztBQUMzQyxpQ0FBbUM7QUFDbkMsaURBQTZFO0FBQzdFLG9DQUF3QztBQUN4QyxvREFBMEQ7QUFFMUQsZ0NBQWtDO0FBR2xDLGVBQXNCLEtBQWdCO0lBQ3BDLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7SUFDNUIsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDcEMsSUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztJQUM3QyxJQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRTtRQUNwQyxTQUFTLFdBQUE7UUFDVCxxREFBcUQ7UUFDckQsZ0RBQWdEO1FBQ2hELFlBQVksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztZQUNwQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUs7WUFDbkIsc0JBQWEsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7WUFDL0Msc0JBQWEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7S0FDaEQsQ0FBQyxDQUFDO0lBRUgsMkNBQTJDO0lBQzNDLHVFQUF1RTtJQUN2RSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxVQUFVLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFF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RUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFFMUksTUFBTTtRQUNKLEdBQUMsU0FBUyxJQUFJLE9BQU8sSUFBRyxRQUFRO1dBQ2hDOztBQUNKLENBQUM7QUFURCxzQ0FTQztBQUVEOzs7R0FHRztBQUNILHdCQUErQixLQUFnQixFQUFFLFVBQXFDLEVBQUUsT0FBcUI7SUFDcEcsSUFBQSx5QkFBUSxFQUFFLHVCQUFPLEVBQUUsbUJBQUssQ0FBVTtJQUN6QyxPQUFPLEdBQUcsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckUsSUFBTSxXQUFXLEdBQUcsT0FBTyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFFakQsSUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDMUssTUFBTSxVQUFFLEdBQUMsT0FBTyxJQUFHLFFBQVEsS0FBRTs7QUFDL0IsQ0FBQztBQVBELHdDQU9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc0FycmF5fSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHtOT05QT1NJVElPTl9TQ0FMRV9DSEFOTkVMU30gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge0NoYW5uZWxEZWYsIEZpZWxkRGVmLCBnZXRGaWVsZERlZiwgaXNDb25kaXRpb25hbFNlbGVjdGlvbiwgaXNWYWx1ZURlZn0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL2xvZyc7XG5pbXBvcnQge01hcmtEZWZ9IGZyb20gJy4uLy4uL21hcmsnO1xuaW1wb3J0IHtleHByZXNzaW9ufSBmcm9tICcuLi8uLi9wcmVkaWNhdGUnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VkdfTUFSS19DT05GSUdTLCBWZ0VuY29kZUVudHJ5LCBWZ1ZhbHVlUmVmfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2dldE1hcmtDb25maWd9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge3NlbGVjdGlvblByZWRpY2F0ZX0gZnJvbSAnLi4vc2VsZWN0aW9uL3NlbGVjdGlvbic7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQgKiBhcyByZWYgZnJvbSAnLi92YWx1ZXJlZic7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbG9yKG1vZGVsOiBVbml0TW9kZWwpIHtcbiAgY29uc3QgY29uZmlnID0gbW9kZWwuY29uZmlnO1xuICBjb25zdCBmaWxsZWQgPSBtb2RlbC5tYXJrRGVmLmZpbGxlZDtcbiAgY29uc3QgdmdDaGFubmVsID0gZmlsbGVkID8gJ2ZpbGwnIDogJ3N0cm9rZSc7XG4gIGNvbnN0IGUgPSBub25Qb3NpdGlvbignY29sb3InLCBtb2RlbCwge1xuICAgIHZnQ2hhbm5lbCxcbiAgICAvLyBNYXJrIGRlZmluaXRpb24gaGFzIGhpZ2hlciBwcmVjZWRlbmNlIHRoYW4gY29uZmlnO1xuICAgIC8vIGZpbGwvc3Ryb2tlIGhhcyBoaWdoZXIgcHJlY2VkZW5jZSB0aGFuIGNvbG9yLlxuICAgIGRlZmF1bHRWYWx1ZTogbW9kZWwubWFya0RlZlt2Z0NoYW5uZWxdIHx8XG4gICAgICBtb2RlbC5tYXJrRGVmLmNvbG9yIHx8XG4gICAgICBnZXRNYXJrQ29uZmlnKHZnQ2hhbm5lbCwgbW9kZWwubWFya0RlZiwgY29uZmlnKSB8fFxuICAgICAgZ2V0TWFya0NvbmZpZygnY29sb3InLCBtb2RlbC5tYXJrRGVmLCBjb25maWcpXG4gIH0pO1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vIGZpbGwsIGFsd2F5cyBmaWxsIHN5bWJvbHNcbiAgLy8gd2l0aCB0cmFuc3BhcmVudCBmaWxscyBodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLWxpdGUvaXNzdWVzLzEzMTZcbiAgaWYgKCFlLmZpbGwgJiYgdXRpbC5jb250YWlucyhbJ2JhcicsICdwb2ludCcsICdjaXJjbGUnLCAnc3F1YXJlJywgJ2dlb3NoYXBlJ10sIG1vZGVsLm1hcmsoKSkpIHtcbiAgICBlLmZpbGwgPSB7dmFsdWU6ICd0cmFuc3BhcmVudCd9O1xuICB9XG4gIHJldHVybiBlO1xufVxuXG5leHBvcnQgdHlwZSBJZ25vcmUgPSBSZWNvcmQ8J3NpemUnIHwgJ29yaWVudCcsICdpZ25vcmUnIHwgJ2luY2x1ZGUnPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJhc2VFbmNvZGVFbnRyeShtb2RlbDogVW5pdE1vZGVsLCBpZ25vcmU6IElnbm9yZSkge1xuICByZXR1cm4ge1xuICAgIC4uLm1hcmtEZWZQcm9wZXJ0aWVzKG1vZGVsLm1hcmtEZWYsIGlnbm9yZSksXG4gICAgLi4uY29sb3IobW9kZWwpLFxuICAgIC4uLm5vblBvc2l0aW9uKCdvcGFjaXR5JywgbW9kZWwpLFxuICAgIC4uLnRleHQobW9kZWwsICd0b29sdGlwJyksXG4gICAgLi4udGV4dChtb2RlbCwgJ2hyZWYnKVxuICB9O1xufVxuXG5mdW5jdGlvbiBtYXJrRGVmUHJvcGVydGllcyhtYXJrOiBNYXJrRGVmLCBpZ25vcmU6IElnbm9yZSkge1xuICByZXR1cm4gVkdfTUFSS19DT05GSUdTLnJlZHVjZSgobSwgcHJvcCkgPT4ge1xuICAgIGlmIChtYXJrW3Byb3BdICYmIGlnbm9yZVtwcm9wXSAhPT0gJ2lnbm9yZScpIHtcbiAgICAgIG1bcHJvcF0gPSB7dmFsdWU6IG1hcmtbcHJvcF19O1xuICAgIH1cbiAgICByZXR1cm4gbTtcbiAgfSwge30pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsdWVJZkRlZmluZWQocHJvcDogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbik6IFZnRW5jb2RlRW50cnkge1xuICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiB7W3Byb3BdOiB7dmFsdWU6IHZhbHVlfX07XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBSZXR1cm4gbWl4aW5zIGZvciBub24tcG9zaXRpb25hbCBjaGFubmVscyB3aXRoIHNjYWxlcy4gIChUZXh0IGRvZXNuJ3QgaGF2ZSBzY2FsZS4pXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub25Qb3NpdGlvbihjaGFubmVsOiB0eXBlb2YgTk9OUE9TSVRJT05fU0NBTEVfQ0hBTk5FTFNbMF0sIG1vZGVsOiBVbml0TW9kZWwsIG9wdDoge2RlZmF1bHRWYWx1ZT86IG51bWJlciB8IHN0cmluZyB8IGJvb2xlYW4sIHZnQ2hhbm5lbD86IHN0cmluZywgZGVmYXVsdFJlZj86IFZnVmFsdWVSZWZ9ID0ge30pOiBWZ0VuY29kZUVudHJ5IHtcbiAgLy8gVE9ETzogcmVmYWN0b3IgaG93IHdlIHJlZmVyIHRvIHNjYWxlIGFzIGRpc2N1c3NlZCBpbiBodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLWxpdGUvcHVsbC8xNjEzXG5cbiAgY29uc3Qge2RlZmF1bHRWYWx1ZSwgdmdDaGFubmVsfSA9IG9wdDtcbiAgY29uc3QgZGVmYXVsdFJlZiA9IG9wdC5kZWZhdWx0UmVmIHx8IChkZWZhdWx0VmFsdWUgIT09IHVuZGVmaW5lZCA/IHt2YWx1ZTogZGVmYXVsdFZhbHVlfSA6IHVuZGVmaW5lZCk7XG5cbiAgY29uc3QgY2hhbm5lbERlZiA9IG1vZGVsLmVuY29kaW5nW2NoYW5uZWxdO1xuXG4gIHJldHVybiB3cmFwQ29uZGl0aW9uKG1vZGVsLCBjaGFubmVsRGVmLCB2Z0NoYW5uZWwgfHwgY2hhbm5lbCwgKGNEZWYpID0+IHtcbiAgICByZXR1cm4gcmVmLm1pZFBvaW50KFxuICAgICAgY2hhbm5lbCwgY0RlZiwgbW9kZWwuc2NhbGVOYW1lKGNoYW5uZWwpLFxuICAgICAgbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCksXG4gICAgICBudWxsLCAvLyBObyBuZWVkIHRvIHByb3ZpZGUgc3RhY2sgZm9yIG5vbi1wb3NpdGlvbiBhcyBpdCBkb2VzIG5vdCBhZmZlY3QgbWlkIHBvaW50XG4gICAgICBkZWZhdWx0UmVmXG4gICAgKTtcbiAgfSk7XG59XG5cbi8qKlxuICogUmV0dXJuIGEgbWl4aW4gdGhhdCBpbmNsdWRlIGEgVmVnYSBwcm9kdWN0aW9uIHJ1bGUgZm9yIGEgVmVnYS1MaXRlIGNvbmRpdGlvbmFsIGNoYW5uZWwgZGVmaW5pdGlvbi5cbiAqIG9yIGEgc2ltcGxlIG1peGluIGlmIGNoYW5uZWwgZGVmIGhhcyBubyBjb25kaXRpb24uXG4gKi9cbmZ1bmN0aW9uIHdyYXBDb25kaXRpb24oXG4gICAgbW9kZWw6IFVuaXRNb2RlbCwgY2hhbm5lbERlZjogQ2hhbm5lbERlZjxzdHJpbmc+LCB2Z0NoYW5uZWw6IHN0cmluZyxcbiAgICByZWZGbjogKGNEZWY6IENoYW5uZWxEZWY8c3RyaW5nPikgPT4gVmdWYWx1ZVJlZlxuICApOiBWZ0VuY29kZUVudHJ5IHtcbiAgY29uc3QgY29uZGl0aW9uID0gY2hhbm5lbERlZiAmJiBjaGFubmVsRGVmLmNvbmRpdGlvbjtcbiAgY29uc3QgdmFsdWVSZWYgPSByZWZGbihjaGFubmVsRGVmKTtcbiAgaWYgKGNvbmRpdGlvbikge1xuICAgIGNvbnN0IGNvbmRpdGlvbnMgPSBpc0FycmF5KGNvbmRpdGlvbikgPyBjb25kaXRpb24gOiBbY29uZGl0aW9uXTtcbiAgICBjb25zdCB2Z0NvbmRpdGlvbnMgPSBjb25kaXRpb25zLm1hcCgoYykgPT4ge1xuICAgICAgY29uc3QgY29uZGl0aW9uVmFsdWVSZWYgPSByZWZGbihjKTtcbiAgICAgIGNvbnN0IHRlc3QgPSBpc0NvbmRpdGlvbmFsU2VsZWN0aW9uKGMpID8gc2VsZWN0aW9uUHJlZGljYXRlKG1vZGVsLCBjLnNlbGVjdGlvbikgOiBleHByZXNzaW9uKG1vZGVsLCBjLnRlc3QpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGVzdCxcbiAgICAgICAgLi4uY29uZGl0aW9uVmFsdWVSZWZcbiAgICAgIH07XG4gICAgfSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIFt2Z0NoYW5uZWxdOiBbXG4gICAgICAgIC4uLnZnQ29uZGl0aW9ucyxcbiAgICAgICAgLi4uKHZhbHVlUmVmICE9PSB1bmRlZmluZWQgPyBbdmFsdWVSZWZdIDogW10pXG4gICAgICBdXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdmFsdWVSZWYgIT09IHVuZGVmaW5lZCA/IHtbdmdDaGFubmVsXTogdmFsdWVSZWZ9IDoge307XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRleHQobW9kZWw6IFVuaXRNb2RlbCwgY2hhbm5lbDogJ3RleHQnIHwgJ3Rvb2x0aXAnIHwgJ2hyZWYnID0gJ3RleHQnKSB7XG4gIGNvbnN0IGNoYW5uZWxEZWYgPSBtb2RlbC5lbmNvZGluZ1tjaGFubmVsXTtcbiAgcmV0dXJuIHdyYXBDb25kaXRpb24obW9kZWwsIGNoYW5uZWxEZWYsIGNoYW5uZWwsIChjRGVmKSA9PiByZWYudGV4dChjRGVmLCBtb2RlbC5jb25maWcpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJhbmRQb3NpdGlvbihmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY2hhbm5lbDogJ3gnfCd5JywgbW9kZWw6IFVuaXRNb2RlbCkge1xuICBjb25zdCBzY2FsZU5hbWUgPSBtb2RlbC5zY2FsZU5hbWUoY2hhbm5lbCk7XG4gIGNvbnN0IHNpemVDaGFubmVsID0gY2hhbm5lbCA9PT0gJ3gnID8gJ3dpZHRoJyA6ICdoZWlnaHQnO1xuXG4gIGlmIChtb2RlbC5lbmNvZGluZy5zaXplIHx8IG1vZGVsLm1hcmtEZWYuc2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgY29uc3Qgb3JpZW50ID0gbW9kZWwubWFya0RlZi5vcmllbnQ7XG4gICAgaWYgKG9yaWVudCkge1xuICAgICAgY29uc3QgY2VudGVyZWRCYW5kUG9zaXRpb25NaXhpbnMgPSB7XG4gICAgICAgIC8vIFVzZSB4Yy95YyBhbmQgcGxhY2UgdGhlIG1hcmsgYXQgdGhlIG1pZGRsZSBvZiB0aGUgYmFuZFxuICAgICAgICAvLyBUaGlzIHdheSB3ZSBuZXZlciBoYXZlIHRvIGRlYWwgd2l0aCBzaXplJ3MgY29uZGl0aW9uIGZvciB4L3kgcG9zaXRpb24uXG4gICAgICAgIFtjaGFubmVsKydjJ106IHJlZi5maWVsZFJlZihmaWVsZERlZiwgc2NhbGVOYW1lLCB7fSwge2JhbmQ6IDAuNX0pXG4gICAgICB9O1xuXG4gICAgICBpZiAoZ2V0RmllbGREZWYobW9kZWwuZW5jb2Rpbmcuc2l6ZSkpIHtcbiAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuY2Fubm90VXNlU2l6ZUZpZWxkV2l0aEJhbmRTaXplKGNoYW5uZWwpKTtcbiAgICAgICAgLy8gVE9ETzogYXBwbHkgc2l6ZSB0byBiYW5kIGFuZCBzZXQgc2NhbGUgcmFuZ2UgdG8gc29tZSB2YWx1ZXMgYmV0d2VlbiAwLTEuXG4gICAgICAgIC8vIHJldHVybiB7XG4gICAgICAgIC8vICAgLi4uY2VudGVyZWRCYW5kUG9zaXRpb25NaXhpbnMsXG4gICAgICAgIC8vICAgLi4uYmFuZFNpemUoJ3NpemUnLCBtb2RlbCwge3ZnQ2hhbm5lbDogc2l6ZUNoYW5uZWx9KVxuICAgICAgICAvLyB9O1xuICAgICAgfSBlbHNlIGlmIChpc1ZhbHVlRGVmKG1vZGVsLmVuY29kaW5nLnNpemUpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uY2VudGVyZWRCYW5kUG9zaXRpb25NaXhpbnMsXG4gICAgICAgICAgLi4ubm9uUG9zaXRpb24oJ3NpemUnLCBtb2RlbCwge3ZnQ2hhbm5lbDogc2l6ZUNoYW5uZWx9KVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIGlmIChtb2RlbC5tYXJrRGVmLnNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLmNlbnRlcmVkQmFuZFBvc2l0aW9uTWl4aW5zLFxuICAgICAgICAgIFtzaXplQ2hhbm5lbF06IHt2YWx1ZTogbW9kZWwubWFya0RlZi5zaXplfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5jYW5ub3RBcHBseVNpemVUb05vbk9yaWVudGVkTWFyayhtb2RlbC5tYXJrRGVmLnR5cGUpKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBbY2hhbm5lbF06IHJlZi5maWVsZFJlZihmaWVsZERlZiwgc2NhbGVOYW1lLCB7YmluU3VmZml4OiAncmFuZ2UnfSksXG4gICAgW3NpemVDaGFubmVsXTogcmVmLmJhbmRSZWYoc2NhbGVOYW1lKVxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2VudGVyZWRCYW5kUG9zaXRpb24oY2hhbm5lbDogJ3gnIHwgJ3knLCBtb2RlbDogVW5pdE1vZGVsLCBkZWZhdWx0UG9zUmVmOiBWZ1ZhbHVlUmVmLCBkZWZhdWx0U2l6ZVJlZjogVmdWYWx1ZVJlZikge1xuICBjb25zdCBjZW50ZXJDaGFubmVsOiAneGMnIHwgJ3ljJyA9IGNoYW5uZWwgPT09ICd4JyA/ICd4YycgOiAneWMnO1xuICBjb25zdCBzaXplQ2hhbm5lbCA9IGNoYW5uZWwgPT09ICd4JyA/ICd3aWR0aCcgOiAnaGVpZ2h0JztcbiAgcmV0dXJuIHtcbiAgICAuLi5wb2ludFBvc2l0aW9uKGNoYW5uZWwsIG1vZGVsLCBkZWZhdWx0UG9zUmVmLCBjZW50ZXJDaGFubmVsKSxcbiAgICAuLi5ub25Qb3NpdGlvbignc2l6ZScsIG1vZGVsLCB7ZGVmYXVsdFJlZjogZGVmYXVsdFNpemVSZWYsIHZnQ2hhbm5lbDogc2l6ZUNoYW5uZWx9KVxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmlubmVkUG9zaXRpb24oZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIGNoYW5uZWw6ICd4J3wneScsIHNjYWxlTmFtZTogc3RyaW5nLCBzcGFjaW5nOiBudW1iZXIsIHJldmVyc2U6IGJvb2xlYW4pIHtcbiAgaWYgKGNoYW5uZWwgPT09ICd4Jykge1xuICAgIHJldHVybiB7XG4gICAgICB4MjogcmVmLmJpbihmaWVsZERlZiwgc2NhbGVOYW1lLCAnc3RhcnQnLCByZXZlcnNlID8gMCA6IHNwYWNpbmcpLFxuICAgICAgeDogcmVmLmJpbihmaWVsZERlZiwgc2NhbGVOYW1lLCAnZW5kJywgcmV2ZXJzZSA/IHNwYWNpbmcgOiAwKVxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHkyOiByZWYuYmluKGZpZWxkRGVmLCBzY2FsZU5hbWUsICdzdGFydCcsIHJldmVyc2UgPyBzcGFjaW5nIDogMCksXG4gICAgICB5OiByZWYuYmluKGZpZWxkRGVmLCBzY2FsZU5hbWUsICdlbmQnLCByZXZlcnNlID8gMCA6IHNwYWNpbmcpXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybiBtaXhpbnMgZm9yIHBvaW50IChub24tYmFuZCkgcG9zaXRpb24gY2hhbm5lbHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwb2ludFBvc2l0aW9uKGNoYW5uZWw6ICd4J3wneScsIG1vZGVsOiBVbml0TW9kZWwsIGRlZmF1bHRSZWY6IFZnVmFsdWVSZWYgfCAnemVyb09yTWluJyB8ICd6ZXJvT3JNYXgnLCB2Z0NoYW5uZWw/OiAneCd8J3knfCd4Yyd8J3ljJykge1xuICAvLyBUT0RPOiByZWZhY3RvciBob3cgcmVmZXIgdG8gc2NhbGUgYXMgZGlzY3Vzc2VkIGluIGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EtbGl0ZS9wdWxsLzE2MTNcblxuICBjb25zdCB7ZW5jb2RpbmcsIHN0YWNrfSA9IG1vZGVsO1xuICBjb25zdCB2YWx1ZVJlZiA9IHJlZi5zdGFja2FibGUoY2hhbm5lbCwgZW5jb2RpbmdbY2hhbm5lbF0sIG1vZGVsLnNjYWxlTmFtZShjaGFubmVsKSwgbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCksIHN0YWNrLCBkZWZhdWx0UmVmKTtcblxuICByZXR1cm4ge1xuICAgIFt2Z0NoYW5uZWwgfHwgY2hhbm5lbF06IHZhbHVlUmVmXG4gIH07XG59XG5cbi8qKlxuICogUmV0dXJuIG1peGlucyBmb3IgeDIsIHkyLlxuICogSWYgY2hhbm5lbCBpcyBub3Qgc3BlY2lmaWVkLCByZXR1cm4gb25lIGNoYW5uZWwgYmFzZWQgb24gb3JpZW50YXRpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwb2ludFBvc2l0aW9uMihtb2RlbDogVW5pdE1vZGVsLCBkZWZhdWx0UmVmOiAnemVyb09yTWluJyB8ICd6ZXJvT3JNYXgnLCBjaGFubmVsPzogJ3gyJyB8ICd5MicpIHtcbiAgY29uc3Qge2VuY29kaW5nLCBtYXJrRGVmLCBzdGFja30gPSBtb2RlbDtcbiAgY2hhbm5lbCA9IGNoYW5uZWwgfHwgKG1hcmtEZWYub3JpZW50ID09PSAnaG9yaXpvbnRhbCcgPyAneDInIDogJ3kyJyk7XG4gIGNvbnN0IGJhc2VDaGFubmVsID0gY2hhbm5lbCA9PT0gJ3gyJyA/ICd4JyA6ICd5JztcblxuICBjb25zdCB2YWx1ZVJlZiA9IHJlZi5zdGFja2FibGUyKGNoYW5uZWwsIGVuY29kaW5nW2Jhc2VDaGFubmVsXSwgZW5jb2RpbmdbY2hhbm5lbF0sIG1vZGVsLnNjYWxlTmFtZShiYXNlQ2hhbm5lbCksIG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGJhc2VDaGFubmVsKSwgc3RhY2ssIGRlZmF1bHRSZWYpO1xuICByZXR1cm4ge1tjaGFubmVsXTogdmFsdWVSZWZ9O1xufVxuIl19