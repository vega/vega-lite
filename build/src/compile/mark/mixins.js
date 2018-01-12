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
        // Mark definition has higher predecence than config;
        // fill/stroke has higher precedence than color.
        defaultValue: model.markDef[vgChannel] ||
            model.markDef.color ||
            common_1.getMarkConfig(vgChannel, model.markDef, config) ||
            common_1.getMarkConfig('color', model.markDef, config)
    });
    // If there is no fill, always fill symbols
    // with transparent fills https://github.com/vega/vega-lite/issues/1316
    if (!e.fill && util.contains(['bar', 'point', 'circle', 'square'], model.mark())) {
        e.fill = { value: 'transparent' };
    }
    return e;
}
exports.color = color;
function markDefProperties(mark, ignoreOrient) {
    return vega_schema_1.VG_MARK_CONFIGS.reduce(function (m, prop) {
        if (mark[prop] && (!ignoreOrient || prop !== 'orient')) {
            m[prop] = { value: mark[prop] };
        }
        return m;
    }, {});
}
exports.markDefProperties = markDefProperties;
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
            return __assign({ test: selection_1.predicate(model, c.selection) }, conditionValueRef);
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
    if (model.encoding.size) {
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
        }
        else {
            log.warn(log.message.cannotApplySizeToNonOrientedMark(model.markDef.type));
        }
    }
    return _b = {},
        _b[channel] = ref.fieldRef(fieldDef, scaleName, { binSuffix: 'range' }),
        _b[sizeChannel] = ref.band(scaleName),
        _b;
    var _a, _b;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4aW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvbWFyay9taXhpbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHVDQUFrQztBQUVsQywyQ0FBNkU7QUFDN0UsK0JBQWlDO0FBRWpDLGlDQUFtQztBQUNuQyxpREFBNkU7QUFDN0Usb0NBQXdDO0FBQ3hDLG9EQUFpRDtBQUVqRCxnQ0FBa0M7QUFHbEMsZUFBc0IsS0FBZ0I7SUFDcEMsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUM1QixJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNwQyxJQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO0lBQzdDLElBQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFO1FBQ3BDLFNBQVMsV0FBQTtRQUNULHFEQUFxRDtRQUNyRCxnREFBZ0Q7UUFDaEQsWUFBWSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO1lBQ3BDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSztZQUNuQixzQkFBYSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQztZQUMvQyxzQkFBYSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQztLQUNoRCxDQUFDLENBQUM7SUFFSCwyQ0FBMkM7SUFDM0MsdUVBQXVFO0lBQ3ZFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FB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QUMsRUFBRSxLQUFLLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLEVBQUUsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzFLLE1BQU0sVUFBRSxHQUFDLE9BQU8sSUFBRyxRQUFRLEtBQUU7O0FBQy9CLENBQUM7QUFQRCx3Q0FPQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNBcnJheX0gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCB7Tk9OUE9TSVRJT05fU0NBTEVfQ0hBTk5FTFN9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtDaGFubmVsRGVmLCBGaWVsZERlZiwgZ2V0RmllbGREZWYsIGlzVmFsdWVEZWZ9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtNYXJrRGVmfSBmcm9tICcuLi8uLi9tYXJrJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZHX01BUktfQ09ORklHUywgVmdFbmNvZGVFbnRyeSwgVmdWYWx1ZVJlZn0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtnZXRNYXJrQ29uZmlnfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtwcmVkaWNhdGV9IGZyb20gJy4uL3NlbGVjdGlvbi9zZWxlY3Rpb24nO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uL3VuaXQnO1xuaW1wb3J0ICogYXMgcmVmIGZyb20gJy4vdmFsdWVyZWYnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBjb2xvcihtb2RlbDogVW5pdE1vZGVsKSB7XG4gIGNvbnN0IGNvbmZpZyA9IG1vZGVsLmNvbmZpZztcbiAgY29uc3QgZmlsbGVkID0gbW9kZWwubWFya0RlZi5maWxsZWQ7XG4gIGNvbnN0IHZnQ2hhbm5lbCA9IGZpbGxlZCA/ICdmaWxsJyA6ICdzdHJva2UnO1xuICBjb25zdCBlID0gbm9uUG9zaXRpb24oJ2NvbG9yJywgbW9kZWwsIHtcbiAgICB2Z0NoYW5uZWwsXG4gICAgLy8gTWFyayBkZWZpbml0aW9uIGhhcyBoaWdoZXIgcHJlZGVjZW5jZSB0aGFuIGNvbmZpZztcbiAgICAvLyBmaWxsL3N0cm9rZSBoYXMgaGlnaGVyIHByZWNlZGVuY2UgdGhhbiBjb2xvci5cbiAgICBkZWZhdWx0VmFsdWU6IG1vZGVsLm1hcmtEZWZbdmdDaGFubmVsXSB8fFxuICAgICAgbW9kZWwubWFya0RlZi5jb2xvciB8fFxuICAgICAgZ2V0TWFya0NvbmZpZyh2Z0NoYW5uZWwsIG1vZGVsLm1hcmtEZWYsIGNvbmZpZykgfHxcbiAgICAgIGdldE1hcmtDb25maWcoJ2NvbG9yJywgbW9kZWwubWFya0RlZiwgY29uZmlnKVxuICB9KTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyBmaWxsLCBhbHdheXMgZmlsbCBzeW1ib2xzXG4gIC8vIHdpdGggdHJhbnNwYXJlbnQgZmlsbHMgaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8xMzE2XG4gIGlmICghZS5maWxsICYmIHV0aWwuY29udGFpbnMoWydiYXInLCAncG9pbnQnLCAnY2lyY2xlJywgJ3NxdWFyZSddLCBtb2RlbC5tYXJrKCkpKSB7XG4gICAgZS5maWxsID0ge3ZhbHVlOiAndHJhbnNwYXJlbnQnfTtcbiAgfVxuICByZXR1cm4gZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcmtEZWZQcm9wZXJ0aWVzKG1hcms6IE1hcmtEZWYsIGlnbm9yZU9yaWVudD86IGJvb2xlYW4pIHtcbiAgcmV0dXJuIFZHX01BUktfQ09ORklHUy5yZWR1Y2UoKG0sIHByb3ApID0+IHtcbiAgICBpZiAobWFya1twcm9wXSAmJiAoIWlnbm9yZU9yaWVudCB8fCBwcm9wICE9PSAnb3JpZW50JykpIHtcbiAgICAgIG1bcHJvcF0gPSB7dmFsdWU6IG1hcmtbcHJvcF19O1xuICAgIH1cbiAgICByZXR1cm4gbTtcbiAgfSwge30pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsdWVJZkRlZmluZWQocHJvcDogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbik6IFZnRW5jb2RlRW50cnkge1xuICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiB7W3Byb3BdOiB7dmFsdWU6IHZhbHVlfX07XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBSZXR1cm4gbWl4aW5zIGZvciBub24tcG9zaXRpb25hbCBjaGFubmVscyB3aXRoIHNjYWxlcy4gIChUZXh0IGRvZXNuJ3QgaGF2ZSBzY2FsZS4pXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub25Qb3NpdGlvbihjaGFubmVsOiB0eXBlb2YgTk9OUE9TSVRJT05fU0NBTEVfQ0hBTk5FTFNbMF0sIG1vZGVsOiBVbml0TW9kZWwsIG9wdDoge2RlZmF1bHRWYWx1ZT86IG51bWJlciB8IHN0cmluZyB8IGJvb2xlYW4sIHZnQ2hhbm5lbD86IHN0cmluZywgZGVmYXVsdFJlZj86IFZnVmFsdWVSZWZ9ID0ge30pOiBWZ0VuY29kZUVudHJ5IHtcbiAgLy8gVE9ETzogcmVmYWN0b3IgaG93IHdlIHJlZmVyIHRvIHNjYWxlIGFzIGRpc2N1c3NlZCBpbiBodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLWxpdGUvcHVsbC8xNjEzXG5cbiAgY29uc3Qge2RlZmF1bHRWYWx1ZSwgdmdDaGFubmVsfSA9IG9wdDtcbiAgY29uc3QgZGVmYXVsdFJlZiA9IG9wdC5kZWZhdWx0UmVmIHx8IChkZWZhdWx0VmFsdWUgIT09IHVuZGVmaW5lZCA/IHt2YWx1ZTogZGVmYXVsdFZhbHVlfSA6IHVuZGVmaW5lZCk7XG5cbiAgY29uc3QgY2hhbm5lbERlZiA9IG1vZGVsLmVuY29kaW5nW2NoYW5uZWxdO1xuXG4gIHJldHVybiB3cmFwQ29uZGl0aW9uKG1vZGVsLCBjaGFubmVsRGVmLCB2Z0NoYW5uZWwgfHwgY2hhbm5lbCwgKGNEZWYpID0+IHtcbiAgICByZXR1cm4gcmVmLm1pZFBvaW50KFxuICAgICAgY2hhbm5lbCwgY0RlZiwgbW9kZWwuc2NhbGVOYW1lKGNoYW5uZWwpLFxuICAgICAgbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCksXG4gICAgICBudWxsLCAvLyBObyBuZWVkIHRvIHByb3ZpZGUgc3RhY2sgZm9yIG5vbi1wb3NpdGlvbiBhcyBpdCBkb2VzIG5vdCBhZmZlY3QgbWlkIHBvaW50XG4gICAgICBkZWZhdWx0UmVmXG4gICAgKTtcbiAgfSk7XG59XG5cbi8qKlxuICogUmV0dXJuIGEgbWl4aW4gdGhhdCBpbmNsdWRlIGEgVmVnYSBwcm9kdWN0aW9uIHJ1bGUgZm9yIGEgVmVnYS1MaXRlIGNvbmRpdGlvbmFsIGNoYW5uZWwgZGVmaW5pdGlvbi5cbiAqIG9yIGEgc2ltcGxlIG1peGluIGlmIGNoYW5uZWwgZGVmIGhhcyBubyBjb25kaXRpb24uXG4gKi9cbmZ1bmN0aW9uIHdyYXBDb25kaXRpb24oXG4gICAgbW9kZWw6IFVuaXRNb2RlbCwgY2hhbm5lbERlZjogQ2hhbm5lbERlZjxzdHJpbmc+LCB2Z0NoYW5uZWw6IHN0cmluZyxcbiAgICByZWZGbjogKGNEZWY6IENoYW5uZWxEZWY8c3RyaW5nPikgPT4gVmdWYWx1ZVJlZlxuICApOiBWZ0VuY29kZUVudHJ5IHtcbiAgY29uc3QgY29uZGl0aW9uID0gY2hhbm5lbERlZiAmJiBjaGFubmVsRGVmLmNvbmRpdGlvbjtcbiAgY29uc3QgdmFsdWVSZWYgPSByZWZGbihjaGFubmVsRGVmKTtcbiAgaWYgKGNvbmRpdGlvbikge1xuICAgIGNvbnN0IGNvbmRpdGlvbnMgPSBpc0FycmF5KGNvbmRpdGlvbikgPyBjb25kaXRpb24gOiBbY29uZGl0aW9uXTtcbiAgICBjb25zdCB2Z0NvbmRpdGlvbnMgPSBjb25kaXRpb25zLm1hcCgoYykgPT4ge1xuICAgICAgY29uc3QgY29uZGl0aW9uVmFsdWVSZWYgPSByZWZGbihjKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRlc3Q6IHByZWRpY2F0ZShtb2RlbCwgYy5zZWxlY3Rpb24pLFxuICAgICAgICAuLi5jb25kaXRpb25WYWx1ZVJlZlxuICAgICAgfTtcbiAgICB9KTtcbiAgICByZXR1cm4ge1xuICAgICAgW3ZnQ2hhbm5lbF06IFtcbiAgICAgICAgLi4udmdDb25kaXRpb25zLFxuICAgICAgICAuLi4odmFsdWVSZWYgIT09IHVuZGVmaW5lZCA/IFt2YWx1ZVJlZl0gOiBbXSlcbiAgICAgIF1cbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB2YWx1ZVJlZiAhPT0gdW5kZWZpbmVkID8ge1t2Z0NoYW5uZWxdOiB2YWx1ZVJlZn0gOiB7fTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdGV4dChtb2RlbDogVW5pdE1vZGVsLCBjaGFubmVsOiAndGV4dCcgfCAndG9vbHRpcCcgPSAndGV4dCcpIHtcbiAgY29uc3QgY2hhbm5lbERlZiA9IG1vZGVsLmVuY29kaW5nW2NoYW5uZWxdO1xuICByZXR1cm4gd3JhcENvbmRpdGlvbihtb2RlbCwgY2hhbm5lbERlZiwgY2hhbm5lbCwgKGNEZWYpID0+IHJlZi50ZXh0KGNEZWYsIG1vZGVsLmNvbmZpZykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmFuZFBvc2l0aW9uKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjaGFubmVsOiAneCd8J3knLCBtb2RlbDogVW5pdE1vZGVsKSB7XG4gIGNvbnN0IHNjYWxlTmFtZSA9IG1vZGVsLnNjYWxlTmFtZShjaGFubmVsKTtcbiAgY29uc3Qgc2l6ZUNoYW5uZWwgPSBjaGFubmVsID09PSAneCcgPyAnd2lkdGgnIDogJ2hlaWdodCc7XG5cbiAgaWYgKG1vZGVsLmVuY29kaW5nLnNpemUpIHtcbiAgICBjb25zdCBvcmllbnQgPSBtb2RlbC5tYXJrRGVmLm9yaWVudDtcbiAgICBpZiAob3JpZW50KSB7XG4gICAgICBjb25zdCBjZW50ZXJlZEJhbmRQb3NpdGlvbk1peGlucyA9IHtcbiAgICAgICAgLy8gVXNlIHhjL3ljIGFuZCBwbGFjZSB0aGUgbWFyayBhdCB0aGUgbWlkZGxlIG9mIHRoZSBiYW5kXG4gICAgICAgIC8vIFRoaXMgd2F5IHdlIG5ldmVyIGhhdmUgdG8gZGVhbCB3aXRoIHNpemUncyBjb25kaXRpb24gZm9yIHgveSBwb3NpdGlvbi5cbiAgICAgICAgW2NoYW5uZWwrJ2MnXTogcmVmLmZpZWxkUmVmKGZpZWxkRGVmLCBzY2FsZU5hbWUsIHt9LCB7YmFuZDogMC41fSlcbiAgICAgIH07XG5cbiAgICAgIGlmIChnZXRGaWVsZERlZihtb2RlbC5lbmNvZGluZy5zaXplKSkge1xuICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5jYW5ub3RVc2VTaXplRmllbGRXaXRoQmFuZFNpemUoY2hhbm5lbCkpO1xuICAgICAgICAvLyBUT0RPOiBhcHBseSBzaXplIHRvIGJhbmQgYW5kIHNldCBzY2FsZSByYW5nZSB0byBzb21lIHZhbHVlcyBiZXR3ZWVuIDAtMS5cbiAgICAgICAgLy8gcmV0dXJuIHtcbiAgICAgICAgLy8gICAuLi5jZW50ZXJlZEJhbmRQb3NpdGlvbk1peGlucyxcbiAgICAgICAgLy8gICAuLi5iYW5kU2l6ZSgnc2l6ZScsIG1vZGVsLCB7dmdDaGFubmVsOiBzaXplQ2hhbm5lbH0pXG4gICAgICAgIC8vIH07XG4gICAgICB9IGVsc2UgaWYgKGlzVmFsdWVEZWYobW9kZWwuZW5jb2Rpbmcuc2l6ZSkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5jZW50ZXJlZEJhbmRQb3NpdGlvbk1peGlucyxcbiAgICAgICAgICAuLi5ub25Qb3NpdGlvbignc2l6ZScsIG1vZGVsLCB7dmdDaGFubmVsOiBzaXplQ2hhbm5lbH0pXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmNhbm5vdEFwcGx5U2l6ZVRvTm9uT3JpZW50ZWRNYXJrKG1vZGVsLm1hcmtEZWYudHlwZSkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge1xuICAgIFtjaGFubmVsXTogcmVmLmZpZWxkUmVmKGZpZWxkRGVmLCBzY2FsZU5hbWUsIHtiaW5TdWZmaXg6ICdyYW5nZSd9KSxcbiAgICBbc2l6ZUNoYW5uZWxdOiByZWYuYmFuZChzY2FsZU5hbWUpXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjZW50ZXJlZEJhbmRQb3NpdGlvbihjaGFubmVsOiAneCcgfCAneScsIG1vZGVsOiBVbml0TW9kZWwsIGRlZmF1bHRQb3NSZWY6IFZnVmFsdWVSZWYsIGRlZmF1bHRTaXplUmVmOiBWZ1ZhbHVlUmVmKSB7XG4gIGNvbnN0IGNlbnRlckNoYW5uZWw6ICd4YycgfCAneWMnID0gY2hhbm5lbCA9PT0gJ3gnID8gJ3hjJyA6ICd5Yyc7XG4gIGNvbnN0IHNpemVDaGFubmVsID0gY2hhbm5lbCA9PT0gJ3gnID8gJ3dpZHRoJyA6ICdoZWlnaHQnO1xuICByZXR1cm4ge1xuICAgIC4uLnBvaW50UG9zaXRpb24oY2hhbm5lbCwgbW9kZWwsIGRlZmF1bHRQb3NSZWYsIGNlbnRlckNoYW5uZWwpLFxuICAgIC4uLm5vblBvc2l0aW9uKCdzaXplJywgbW9kZWwsIHtkZWZhdWx0UmVmOiBkZWZhdWx0U2l6ZVJlZiwgdmdDaGFubmVsOiBzaXplQ2hhbm5lbH0pXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5uZWRQb3NpdGlvbihmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY2hhbm5lbDogJ3gnfCd5Jywgc2NhbGVOYW1lOiBzdHJpbmcsIHNwYWNpbmc6IG51bWJlciwgcmV2ZXJzZTogYm9vbGVhbikge1xuICBpZiAoY2hhbm5lbCA9PT0gJ3gnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHgyOiByZWYuYmluKGZpZWxkRGVmLCBzY2FsZU5hbWUsICdzdGFydCcsIHJldmVyc2UgPyAwIDogc3BhY2luZyksXG4gICAgICB4OiByZWYuYmluKGZpZWxkRGVmLCBzY2FsZU5hbWUsICdlbmQnLCByZXZlcnNlID8gc3BhY2luZyA6IDApXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgeTI6IHJlZi5iaW4oZmllbGREZWYsIHNjYWxlTmFtZSwgJ3N0YXJ0JywgcmV2ZXJzZSA/IHNwYWNpbmcgOiAwKSxcbiAgICAgIHk6IHJlZi5iaW4oZmllbGREZWYsIHNjYWxlTmFtZSwgJ2VuZCcsIHJldmVyc2UgPyAwIDogc3BhY2luZylcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJuIG1peGlucyBmb3IgcG9pbnQgKG5vbi1iYW5kKSBwb3NpdGlvbiBjaGFubmVscy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBvaW50UG9zaXRpb24oY2hhbm5lbDogJ3gnfCd5JywgbW9kZWw6IFVuaXRNb2RlbCwgZGVmYXVsdFJlZjogVmdWYWx1ZVJlZiB8ICd6ZXJvT3JNaW4nIHwgJ3plcm9Pck1heCcsIHZnQ2hhbm5lbD86ICd4J3wneSd8J3hjJ3wneWMnKSB7XG4gIC8vIFRPRE86IHJlZmFjdG9yIGhvdyByZWZlciB0byBzY2FsZSBhcyBkaXNjdXNzZWQgaW4gaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL3B1bGwvMTYxM1xuXG4gIGNvbnN0IHtlbmNvZGluZywgc3RhY2t9ID0gbW9kZWw7XG4gIGNvbnN0IHZhbHVlUmVmID0gcmVmLnN0YWNrYWJsZShjaGFubmVsLCBlbmNvZGluZ1tjaGFubmVsXSwgbW9kZWwuc2NhbGVOYW1lKGNoYW5uZWwpLCBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKSwgc3RhY2ssIGRlZmF1bHRSZWYpO1xuXG4gIHJldHVybiB7XG4gICAgW3ZnQ2hhbm5lbCB8fCBjaGFubmVsXTogdmFsdWVSZWZcbiAgfTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gbWl4aW5zIGZvciB4MiwgeTIuXG4gKiBJZiBjaGFubmVsIGlzIG5vdCBzcGVjaWZpZWQsIHJldHVybiBvbmUgY2hhbm5lbCBiYXNlZCBvbiBvcmllbnRhdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBvaW50UG9zaXRpb24yKG1vZGVsOiBVbml0TW9kZWwsIGRlZmF1bHRSZWY6ICd6ZXJvT3JNaW4nIHwgJ3plcm9Pck1heCcsIGNoYW5uZWw/OiAneDInIHwgJ3kyJykge1xuICBjb25zdCB7ZW5jb2RpbmcsIG1hcmtEZWYsIHN0YWNrfSA9IG1vZGVsO1xuICBjaGFubmVsID0gY2hhbm5lbCB8fCAobWFya0RlZi5vcmllbnQgPT09ICdob3Jpem9udGFsJyA/ICd4MicgOiAneTInKTtcbiAgY29uc3QgYmFzZUNoYW5uZWwgPSBjaGFubmVsID09PSAneDInID8gJ3gnIDogJ3knO1xuXG4gIGNvbnN0IHZhbHVlUmVmID0gcmVmLnN0YWNrYWJsZTIoY2hhbm5lbCwgZW5jb2RpbmdbYmFzZUNoYW5uZWxdLCBlbmNvZGluZ1tjaGFubmVsXSwgbW9kZWwuc2NhbGVOYW1lKGJhc2VDaGFubmVsKSwgbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoYmFzZUNoYW5uZWwpLCBzdGFjaywgZGVmYXVsdFJlZik7XG4gIHJldHVybiB7W2NoYW5uZWxdOiB2YWx1ZVJlZn07XG59XG4iXX0=