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
        // Mark definition has higher predecence than config;
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
function baseEncodeEntry(model, ignoreOrient) {
    return __assign({}, markDefProperties(model.markDef, ignoreOrient), color(model), nonPosition('opacity', model), text(model, 'tooltip'), text(model, 'href'));
}
exports.baseEncodeEntry = baseEncodeEntry;
function markDefProperties(mark, ignoreOrient) {
    return vega_schema_1.VG_MARK_CONFIGS.reduce(function (m, prop) {
        if (mark[prop] && (!ignoreOrient || prop !== 'orient')) {
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
        _b[sizeChannel] = ref.bandRef(scaleName),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4aW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvbWFyay9taXhpbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHVDQUFrQztBQUVsQywyQ0FBcUc7QUFDckcsK0JBQWlDO0FBRWpDLDZDQUEyQztBQUMzQyxpQ0FBbUM7QUFDbkMsaURBQTZFO0FBQzdFLG9DQUF3QztBQUN4QyxvREFBMEQ7QUFFMUQsZ0NBQWtDO0FBR2xDLGVBQXNCLEtBQWdCO0lBQ3BDLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7SUFDNUIsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDcEMsSUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztJQUM3QyxJQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRTtRQUNwQyxTQUFTLFdBQUE7UUFDVCxxREFBcUQ7UUFDckQsZ0RBQWdEO1FBQ2hELFlBQVksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztZQUNwQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUs7WUFDbkIsc0JBQWEsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7WUFDL0Msc0JBQWEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7S0FDaEQsQ0FBQyxDQUFDO0lBRUgsMkNBQTJDO0lBQzNDLHVFQUF1RTtJQUN2RSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxVQUFVLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFF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RSxVQUFxQyxFQUFFLE9BQXFCO0lBQ3BHLElBQUEseUJBQVEsRUFBRSx1QkFBTyxFQUFFLG1CQUFLLENBQVU7SUFDekMsT0FBTyxHQUFHLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JFLElBQU0sV0FBVyxHQUFHLE9BQU8sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBRWpELElBQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsRUFBRSxLQUFLLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLEVBQUUsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzFLLE1BQU0sVUFBRSxHQUFDLE9BQU8sSUFBRyxRQUFRLEtBQUU7O0FBQy9CLENBQUM7QUFQRCx3Q0FPQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNBcnJheX0gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCB7Tk9OUE9TSVRJT05fU0NBTEVfQ0hBTk5FTFN9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtDaGFubmVsRGVmLCBGaWVsZERlZiwgZ2V0RmllbGREZWYsIGlzQ29uZGl0aW9uYWxTZWxlY3Rpb24sIGlzVmFsdWVEZWZ9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtNYXJrRGVmfSBmcm9tICcuLi8uLi9tYXJrJztcbmltcG9ydCB7ZXhwcmVzc2lvbn0gZnJvbSAnLi4vLi4vcHJlZGljYXRlJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZHX01BUktfQ09ORklHUywgVmdFbmNvZGVFbnRyeSwgVmdWYWx1ZVJlZn0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtnZXRNYXJrQ29uZmlnfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtzZWxlY3Rpb25QcmVkaWNhdGV9IGZyb20gJy4uL3NlbGVjdGlvbi9zZWxlY3Rpb24nO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uL3VuaXQnO1xuaW1wb3J0ICogYXMgcmVmIGZyb20gJy4vdmFsdWVyZWYnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBjb2xvcihtb2RlbDogVW5pdE1vZGVsKSB7XG4gIGNvbnN0IGNvbmZpZyA9IG1vZGVsLmNvbmZpZztcbiAgY29uc3QgZmlsbGVkID0gbW9kZWwubWFya0RlZi5maWxsZWQ7XG4gIGNvbnN0IHZnQ2hhbm5lbCA9IGZpbGxlZCA/ICdmaWxsJyA6ICdzdHJva2UnO1xuICBjb25zdCBlID0gbm9uUG9zaXRpb24oJ2NvbG9yJywgbW9kZWwsIHtcbiAgICB2Z0NoYW5uZWwsXG4gICAgLy8gTWFyayBkZWZpbml0aW9uIGhhcyBoaWdoZXIgcHJlZGVjZW5jZSB0aGFuIGNvbmZpZztcbiAgICAvLyBmaWxsL3N0cm9rZSBoYXMgaGlnaGVyIHByZWNlZGVuY2UgdGhhbiBjb2xvci5cbiAgICBkZWZhdWx0VmFsdWU6IG1vZGVsLm1hcmtEZWZbdmdDaGFubmVsXSB8fFxuICAgICAgbW9kZWwubWFya0RlZi5jb2xvciB8fFxuICAgICAgZ2V0TWFya0NvbmZpZyh2Z0NoYW5uZWwsIG1vZGVsLm1hcmtEZWYsIGNvbmZpZykgfHxcbiAgICAgIGdldE1hcmtDb25maWcoJ2NvbG9yJywgbW9kZWwubWFya0RlZiwgY29uZmlnKVxuICB9KTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyBmaWxsLCBhbHdheXMgZmlsbCBzeW1ib2xzXG4gIC8vIHdpdGggdHJhbnNwYXJlbnQgZmlsbHMgaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8xMzE2XG4gIGlmICghZS5maWxsICYmIHV0aWwuY29udGFpbnMoWydiYXInLCAncG9pbnQnLCAnY2lyY2xlJywgJ3NxdWFyZScsICdnZW9zaGFwZSddLCBtb2RlbC5tYXJrKCkpKSB7XG4gICAgZS5maWxsID0ge3ZhbHVlOiAndHJhbnNwYXJlbnQnfTtcbiAgfVxuICByZXR1cm4gZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJhc2VFbmNvZGVFbnRyeShtb2RlbDogVW5pdE1vZGVsLCBpZ25vcmVPcmllbnQ6IGJvb2xlYW4pIHtcbiAgcmV0dXJuIHtcbiAgICAuLi5tYXJrRGVmUHJvcGVydGllcyhtb2RlbC5tYXJrRGVmLCBpZ25vcmVPcmllbnQpLFxuICAgIC4uLmNvbG9yKG1vZGVsKSxcbiAgICAuLi5ub25Qb3NpdGlvbignb3BhY2l0eScsIG1vZGVsKSxcbiAgICAuLi50ZXh0KG1vZGVsLCAndG9vbHRpcCcpLFxuICAgIC4uLnRleHQobW9kZWwsICdocmVmJylcbiAgfTtcbn1cblxuZnVuY3Rpb24gbWFya0RlZlByb3BlcnRpZXMobWFyazogTWFya0RlZiwgaWdub3JlT3JpZW50PzogYm9vbGVhbikge1xuICByZXR1cm4gVkdfTUFSS19DT05GSUdTLnJlZHVjZSgobSwgcHJvcCkgPT4ge1xuICAgIGlmIChtYXJrW3Byb3BdICYmICghaWdub3JlT3JpZW50IHx8IHByb3AgIT09ICdvcmllbnQnKSkge1xuICAgICAgbVtwcm9wXSA9IHt2YWx1ZTogbWFya1twcm9wXX07XG4gICAgfVxuICAgIHJldHVybiBtO1xuICB9LCB7fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZUlmRGVmaW5lZChwcm9wOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuKTogVmdFbmNvZGVFbnRyeSB7XG4gIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHtbcHJvcF06IHt2YWx1ZTogdmFsdWV9fTtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIFJldHVybiBtaXhpbnMgZm9yIG5vbi1wb3NpdGlvbmFsIGNoYW5uZWxzIHdpdGggc2NhbGVzLiAgKFRleHQgZG9lc24ndCBoYXZlIHNjYWxlLilcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vblBvc2l0aW9uKGNoYW5uZWw6IHR5cGVvZiBOT05QT1NJVElPTl9TQ0FMRV9DSEFOTkVMU1swXSwgbW9kZWw6IFVuaXRNb2RlbCwgb3B0OiB7ZGVmYXVsdFZhbHVlPzogbnVtYmVyIHwgc3RyaW5nIHwgYm9vbGVhbiwgdmdDaGFubmVsPzogc3RyaW5nLCBkZWZhdWx0UmVmPzogVmdWYWx1ZVJlZn0gPSB7fSk6IFZnRW5jb2RlRW50cnkge1xuICAvLyBUT0RPOiByZWZhY3RvciBob3cgd2UgcmVmZXIgdG8gc2NhbGUgYXMgZGlzY3Vzc2VkIGluIGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EtbGl0ZS9wdWxsLzE2MTNcblxuICBjb25zdCB7ZGVmYXVsdFZhbHVlLCB2Z0NoYW5uZWx9ID0gb3B0O1xuICBjb25zdCBkZWZhdWx0UmVmID0gb3B0LmRlZmF1bHRSZWYgfHwgKGRlZmF1bHRWYWx1ZSAhPT0gdW5kZWZpbmVkID8ge3ZhbHVlOiBkZWZhdWx0VmFsdWV9IDogdW5kZWZpbmVkKTtcblxuICBjb25zdCBjaGFubmVsRGVmID0gbW9kZWwuZW5jb2RpbmdbY2hhbm5lbF07XG5cbiAgcmV0dXJuIHdyYXBDb25kaXRpb24obW9kZWwsIGNoYW5uZWxEZWYsIHZnQ2hhbm5lbCB8fCBjaGFubmVsLCAoY0RlZikgPT4ge1xuICAgIHJldHVybiByZWYubWlkUG9pbnQoXG4gICAgICBjaGFubmVsLCBjRGVmLCBtb2RlbC5zY2FsZU5hbWUoY2hhbm5lbCksXG4gICAgICBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKSxcbiAgICAgIG51bGwsIC8vIE5vIG5lZWQgdG8gcHJvdmlkZSBzdGFjayBmb3Igbm9uLXBvc2l0aW9uIGFzIGl0IGRvZXMgbm90IGFmZmVjdCBtaWQgcG9pbnRcbiAgICAgIGRlZmF1bHRSZWZcbiAgICApO1xuICB9KTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBtaXhpbiB0aGF0IGluY2x1ZGUgYSBWZWdhIHByb2R1Y3Rpb24gcnVsZSBmb3IgYSBWZWdhLUxpdGUgY29uZGl0aW9uYWwgY2hhbm5lbCBkZWZpbml0aW9uLlxuICogb3IgYSBzaW1wbGUgbWl4aW4gaWYgY2hhbm5lbCBkZWYgaGFzIG5vIGNvbmRpdGlvbi5cbiAqL1xuZnVuY3Rpb24gd3JhcENvbmRpdGlvbihcbiAgICBtb2RlbDogVW5pdE1vZGVsLCBjaGFubmVsRGVmOiBDaGFubmVsRGVmPHN0cmluZz4sIHZnQ2hhbm5lbDogc3RyaW5nLFxuICAgIHJlZkZuOiAoY0RlZjogQ2hhbm5lbERlZjxzdHJpbmc+KSA9PiBWZ1ZhbHVlUmVmXG4gICk6IFZnRW5jb2RlRW50cnkge1xuICBjb25zdCBjb25kaXRpb24gPSBjaGFubmVsRGVmICYmIGNoYW5uZWxEZWYuY29uZGl0aW9uO1xuICBjb25zdCB2YWx1ZVJlZiA9IHJlZkZuKGNoYW5uZWxEZWYpO1xuICBpZiAoY29uZGl0aW9uKSB7XG4gICAgY29uc3QgY29uZGl0aW9ucyA9IGlzQXJyYXkoY29uZGl0aW9uKSA/IGNvbmRpdGlvbiA6IFtjb25kaXRpb25dO1xuICAgIGNvbnN0IHZnQ29uZGl0aW9ucyA9IGNvbmRpdGlvbnMubWFwKChjKSA9PiB7XG4gICAgICBjb25zdCBjb25kaXRpb25WYWx1ZVJlZiA9IHJlZkZuKGMpO1xuICAgICAgY29uc3QgdGVzdCA9IGlzQ29uZGl0aW9uYWxTZWxlY3Rpb24oYykgPyBzZWxlY3Rpb25QcmVkaWNhdGUobW9kZWwsIGMuc2VsZWN0aW9uKSA6IGV4cHJlc3Npb24obW9kZWwsIGMudGVzdCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0ZXN0LFxuICAgICAgICAuLi5jb25kaXRpb25WYWx1ZVJlZlxuICAgICAgfTtcbiAgICB9KTtcbiAgICByZXR1cm4ge1xuICAgICAgW3ZnQ2hhbm5lbF06IFtcbiAgICAgICAgLi4udmdDb25kaXRpb25zLFxuICAgICAgICAuLi4odmFsdWVSZWYgIT09IHVuZGVmaW5lZCA/IFt2YWx1ZVJlZl0gOiBbXSlcbiAgICAgIF1cbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB2YWx1ZVJlZiAhPT0gdW5kZWZpbmVkID8ge1t2Z0NoYW5uZWxdOiB2YWx1ZVJlZn0gOiB7fTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdGV4dChtb2RlbDogVW5pdE1vZGVsLCBjaGFubmVsOiAndGV4dCcgfCAndG9vbHRpcCcgfCAnaHJlZicgPSAndGV4dCcpIHtcbiAgY29uc3QgY2hhbm5lbERlZiA9IG1vZGVsLmVuY29kaW5nW2NoYW5uZWxdO1xuICByZXR1cm4gd3JhcENvbmRpdGlvbihtb2RlbCwgY2hhbm5lbERlZiwgY2hhbm5lbCwgKGNEZWYpID0+IHJlZi50ZXh0KGNEZWYsIG1vZGVsLmNvbmZpZykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmFuZFBvc2l0aW9uKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjaGFubmVsOiAneCd8J3knLCBtb2RlbDogVW5pdE1vZGVsKSB7XG4gIGNvbnN0IHNjYWxlTmFtZSA9IG1vZGVsLnNjYWxlTmFtZShjaGFubmVsKTtcbiAgY29uc3Qgc2l6ZUNoYW5uZWwgPSBjaGFubmVsID09PSAneCcgPyAnd2lkdGgnIDogJ2hlaWdodCc7XG5cbiAgaWYgKG1vZGVsLmVuY29kaW5nLnNpemUpIHtcbiAgICBjb25zdCBvcmllbnQgPSBtb2RlbC5tYXJrRGVmLm9yaWVudDtcbiAgICBpZiAob3JpZW50KSB7XG4gICAgICBjb25zdCBjZW50ZXJlZEJhbmRQb3NpdGlvbk1peGlucyA9IHtcbiAgICAgICAgLy8gVXNlIHhjL3ljIGFuZCBwbGFjZSB0aGUgbWFyayBhdCB0aGUgbWlkZGxlIG9mIHRoZSBiYW5kXG4gICAgICAgIC8vIFRoaXMgd2F5IHdlIG5ldmVyIGhhdmUgdG8gZGVhbCB3aXRoIHNpemUncyBjb25kaXRpb24gZm9yIHgveSBwb3NpdGlvbi5cbiAgICAgICAgW2NoYW5uZWwrJ2MnXTogcmVmLmZpZWxkUmVmKGZpZWxkRGVmLCBzY2FsZU5hbWUsIHt9LCB7YmFuZDogMC41fSlcbiAgICAgIH07XG5cbiAgICAgIGlmIChnZXRGaWVsZERlZihtb2RlbC5lbmNvZGluZy5zaXplKSkge1xuICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5jYW5ub3RVc2VTaXplRmllbGRXaXRoQmFuZFNpemUoY2hhbm5lbCkpO1xuICAgICAgICAvLyBUT0RPOiBhcHBseSBzaXplIHRvIGJhbmQgYW5kIHNldCBzY2FsZSByYW5nZSB0byBzb21lIHZhbHVlcyBiZXR3ZWVuIDAtMS5cbiAgICAgICAgLy8gcmV0dXJuIHtcbiAgICAgICAgLy8gICAuLi5jZW50ZXJlZEJhbmRQb3NpdGlvbk1peGlucyxcbiAgICAgICAgLy8gICAuLi5iYW5kU2l6ZSgnc2l6ZScsIG1vZGVsLCB7dmdDaGFubmVsOiBzaXplQ2hhbm5lbH0pXG4gICAgICAgIC8vIH07XG4gICAgICB9IGVsc2UgaWYgKGlzVmFsdWVEZWYobW9kZWwuZW5jb2Rpbmcuc2l6ZSkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5jZW50ZXJlZEJhbmRQb3NpdGlvbk1peGlucyxcbiAgICAgICAgICAuLi5ub25Qb3NpdGlvbignc2l6ZScsIG1vZGVsLCB7dmdDaGFubmVsOiBzaXplQ2hhbm5lbH0pXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmNhbm5vdEFwcGx5U2l6ZVRvTm9uT3JpZW50ZWRNYXJrKG1vZGVsLm1hcmtEZWYudHlwZSkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge1xuICAgIFtjaGFubmVsXTogcmVmLmZpZWxkUmVmKGZpZWxkRGVmLCBzY2FsZU5hbWUsIHtiaW5TdWZmaXg6ICdyYW5nZSd9KSxcbiAgICBbc2l6ZUNoYW5uZWxdOiByZWYuYmFuZFJlZihzY2FsZU5hbWUpXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjZW50ZXJlZEJhbmRQb3NpdGlvbihjaGFubmVsOiAneCcgfCAneScsIG1vZGVsOiBVbml0TW9kZWwsIGRlZmF1bHRQb3NSZWY6IFZnVmFsdWVSZWYsIGRlZmF1bHRTaXplUmVmOiBWZ1ZhbHVlUmVmKSB7XG4gIGNvbnN0IGNlbnRlckNoYW5uZWw6ICd4YycgfCAneWMnID0gY2hhbm5lbCA9PT0gJ3gnID8gJ3hjJyA6ICd5Yyc7XG4gIGNvbnN0IHNpemVDaGFubmVsID0gY2hhbm5lbCA9PT0gJ3gnID8gJ3dpZHRoJyA6ICdoZWlnaHQnO1xuICByZXR1cm4ge1xuICAgIC4uLnBvaW50UG9zaXRpb24oY2hhbm5lbCwgbW9kZWwsIGRlZmF1bHRQb3NSZWYsIGNlbnRlckNoYW5uZWwpLFxuICAgIC4uLm5vblBvc2l0aW9uKCdzaXplJywgbW9kZWwsIHtkZWZhdWx0UmVmOiBkZWZhdWx0U2l6ZVJlZiwgdmdDaGFubmVsOiBzaXplQ2hhbm5lbH0pXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5uZWRQb3NpdGlvbihmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY2hhbm5lbDogJ3gnfCd5Jywgc2NhbGVOYW1lOiBzdHJpbmcsIHNwYWNpbmc6IG51bWJlciwgcmV2ZXJzZTogYm9vbGVhbikge1xuICBpZiAoY2hhbm5lbCA9PT0gJ3gnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHgyOiByZWYuYmluKGZpZWxkRGVmLCBzY2FsZU5hbWUsICdzdGFydCcsIHJldmVyc2UgPyAwIDogc3BhY2luZyksXG4gICAgICB4OiByZWYuYmluKGZpZWxkRGVmLCBzY2FsZU5hbWUsICdlbmQnLCByZXZlcnNlID8gc3BhY2luZyA6IDApXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgeTI6IHJlZi5iaW4oZmllbGREZWYsIHNjYWxlTmFtZSwgJ3N0YXJ0JywgcmV2ZXJzZSA/IHNwYWNpbmcgOiAwKSxcbiAgICAgIHk6IHJlZi5iaW4oZmllbGREZWYsIHNjYWxlTmFtZSwgJ2VuZCcsIHJldmVyc2UgPyAwIDogc3BhY2luZylcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJuIG1peGlucyBmb3IgcG9pbnQgKG5vbi1iYW5kKSBwb3NpdGlvbiBjaGFubmVscy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBvaW50UG9zaXRpb24oY2hhbm5lbDogJ3gnfCd5JywgbW9kZWw6IFVuaXRNb2RlbCwgZGVmYXVsdFJlZjogVmdWYWx1ZVJlZiB8ICd6ZXJvT3JNaW4nIHwgJ3plcm9Pck1heCcsIHZnQ2hhbm5lbD86ICd4J3wneSd8J3hjJ3wneWMnKSB7XG4gIC8vIFRPRE86IHJlZmFjdG9yIGhvdyByZWZlciB0byBzY2FsZSBhcyBkaXNjdXNzZWQgaW4gaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL3B1bGwvMTYxM1xuXG4gIGNvbnN0IHtlbmNvZGluZywgc3RhY2t9ID0gbW9kZWw7XG4gIGNvbnN0IHZhbHVlUmVmID0gcmVmLnN0YWNrYWJsZShjaGFubmVsLCBlbmNvZGluZ1tjaGFubmVsXSwgbW9kZWwuc2NhbGVOYW1lKGNoYW5uZWwpLCBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKSwgc3RhY2ssIGRlZmF1bHRSZWYpO1xuXG4gIHJldHVybiB7XG4gICAgW3ZnQ2hhbm5lbCB8fCBjaGFubmVsXTogdmFsdWVSZWZcbiAgfTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gbWl4aW5zIGZvciB4MiwgeTIuXG4gKiBJZiBjaGFubmVsIGlzIG5vdCBzcGVjaWZpZWQsIHJldHVybiBvbmUgY2hhbm5lbCBiYXNlZCBvbiBvcmllbnRhdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBvaW50UG9zaXRpb24yKG1vZGVsOiBVbml0TW9kZWwsIGRlZmF1bHRSZWY6ICd6ZXJvT3JNaW4nIHwgJ3plcm9Pck1heCcsIGNoYW5uZWw/OiAneDInIHwgJ3kyJykge1xuICBjb25zdCB7ZW5jb2RpbmcsIG1hcmtEZWYsIHN0YWNrfSA9IG1vZGVsO1xuICBjaGFubmVsID0gY2hhbm5lbCB8fCAobWFya0RlZi5vcmllbnQgPT09ICdob3Jpem9udGFsJyA/ICd4MicgOiAneTInKTtcbiAgY29uc3QgYmFzZUNoYW5uZWwgPSBjaGFubmVsID09PSAneDInID8gJ3gnIDogJ3knO1xuXG4gIGNvbnN0IHZhbHVlUmVmID0gcmVmLnN0YWNrYWJsZTIoY2hhbm5lbCwgZW5jb2RpbmdbYmFzZUNoYW5uZWxdLCBlbmNvZGluZ1tjaGFubmVsXSwgbW9kZWwuc2NhbGVOYW1lKGJhc2VDaGFubmVsKSwgbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoYmFzZUNoYW5uZWwpLCBzdGFjaywgZGVmYXVsdFJlZik7XG4gIHJldHVybiB7W2NoYW5uZWxdOiB2YWx1ZVJlZn07XG59XG4iXX0=