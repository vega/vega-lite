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
var util_1 = require("../../util");
var vega_schema_1 = require("../../vega.schema");
var common_1 = require("../common");
var selection_1 = require("../selection/selection");
var ref = require("./valueref");
function color(model) {
    var config = model.config;
    var _a = model.markDef, filled = _a.filled, markType = _a.type;
    var vgChannel = filled ? 'fill' : 'stroke';
    return __assign({}, (util_1.contains(['bar', 'point', 'circle', 'square', 'geoshape'], markType) ?
        { fill: { value: 'transparent' } } :
        {}), nonPosition('color', model, {
        vgChannel: vgChannel,
        // Mark definition has higher precedence than config;
        // fill/stroke has higher precedence than color.
        defaultValue: model.markDef[vgChannel] ||
            model.markDef.color ||
            common_1.getMarkConfig(vgChannel, model.markDef, config) ||
            common_1.getMarkConfig('color', model.markDef, config)
    }), nonPosition('fill', model), nonPosition('stroke', model));
}
exports.color = color;
function baseEncodeEntry(model, ignore) {
    return __assign({}, markDefProperties(model.markDef, ignore), color(model), nonPosition('opacity', model), text(model, 'tooltip'), text(model, 'href'));
}
exports.baseEncodeEntry = baseEncodeEntry;
function markDefProperties(mark, ignore) {
    return vega_schema_1.VG_MARK_CONFIGS.reduce(function (m, prop) {
        if (mark[prop] !== undefined && ignore[prop] !== 'ignore') {
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
    var channelDef = encoding[channel];
    var valueRef = !channelDef && (encoding.latitude || encoding.longitude) ?
        // use geopoint output if there are lat/long and there is no point position overriding lat/long.
        { field: model.getName(channel) } :
        ref.stackable(channel, encoding[channel], model.scaleName(channel), model.getScaleComponent(channel), stack, defaultRef);
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
    var channelDef = encoding[baseChannel];
    var valueRef = !channelDef && (encoding.latitude || encoding.longitude) ?
        // use geopoint output if there are lat2/long2 and there is no point position2 overriding lat2/long2.
        { field: model.getName(channel) } :
        ref.stackable2(channel, channelDef, encoding[channel], model.scaleName(baseChannel), model.getScaleComponent(baseChannel), stack, defaultRef);
    return _a = {}, _a[channel] = valueRef, _a;
    var _a;
}
exports.pointPosition2 = pointPosition2;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4aW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvbWFyay9taXhpbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHVDQUFrQztBQUVsQywyQ0FBcUc7QUFDckcsK0JBQWlDO0FBRWpDLDZDQUEyQztBQUMzQyxtQ0FBb0M7QUFDcEMsaURBQTZFO0FBQzdFLG9DQUF3QztBQUN4QyxvREFBMEQ7QUFFMUQsZ0NBQWtDO0FBR2xDLGVBQXNCLEtBQWdCO0lBQ3BDLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7SUFDdEIsSUFBQSxrQkFBd0MsRUFBdkMsa0JBQU0sRUFBRSxrQkFBYyxDQUFrQjtJQUMvQyxJQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO0lBRTdDLE1BQU0sY0FHRCxDQUNELGVBQVEsQ0FBQyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxVQUFVLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLEVBQUMsSUFBSSxFQUFFLEVBQUMsS0FBSyxFQUFFLGFBQWEsRUFBQyxFQUFDLENBQUEsQ0FBQztRQUMvQixFQUFFLENBQ0gsRUFFRSxXQUFXLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRTtRQUM3QixTQUFTLFdBQUE7UUFDVCxxREFBcUQ7UUFDckQsZ0RBQWdEO1FBQ2hELFlBQVksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztZQUNwQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUs7WUFDbkIsc0JBQWEsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7WUFDL0Msc0JBQWEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7S0FDaEQsQ0FBQyxFQUVDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQzFCLFdBQVcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLEVBQy9CO0FBQ0osQ0FBQztBQTNCRCxzQkEyQkM7QUFJRCx5QkFBZ0MsS0FBZ0IsRUFBRSxNQUFjO0lBQzlELE1BQU0sY0FDRCxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxFQUN4QyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQ1osV0FBVyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsRUFDN0IsSUFBSSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsRUFDdEIsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsRUFDdEI7QUFDSixDQUFDO0FBUkQsMENBUUM7QUFFRCwyQkFBMkIsSUFBYSxFQUFFLE1BQWM7SUFDdEQsTUFBTSxDQUFDLDZCQUFlLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxFQUFFLElBQUk7UUFDcEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLFNBQVMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUMxRCxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUM7UUFDaEMsQ0FBQztRQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDVCxDQUFDO0FBRUQsd0JBQStCLElBQVksRUFBRSxLQUFnQztJQUMzRSxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUN4QixNQUFNLFVBQUUsR0FBQyxJQUFJLElBQUcsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLEtBQUU7SUFDbEMsQ0FBQztJQUNELE1BQU0sQ0FBQyxTQUFTLENBQUM7O0FBQ25CLENBQUM7QUFMRCx3Q0FLQztBQUVEOztHQUVHO0FBQ0gscUJBQTRCLE9BQTZDLEVBQUUsS0FBZ0IsRUFBRSxHQUFpRztJQUFqRyxvQkFBQSxFQUFBLFFBQWlHO0lBQ3JMLElBQUEsK0JBQVksRUFBRSx5QkFBUyxDQUFRO0lBQ3RDLElBQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxVQUFVLElBQUksQ0FBQyxZQUFZLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFDLEtBQUssRUFBRSxZQUFZLEVBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7SUFFdEcsSUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUUzQyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsU0FBUyxJQUFJLE9BQU8sRUFBRSxVQUFDLElBQUk7UUFDakUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQ2pCLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFDdkMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxFQUNoQyxJQUFJLEVBQUUsNEVBQTRFO1FBQ2xGLFVBQVUsQ0FDWCxDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBZEQsa0NBY0M7QUFFRDs7O0dBR0c7QUFDSCx1QkFDSSxLQUFnQixFQUFFLFVBQThCLEVBQUUsU0FBaUIsRUFDbkUsS0FBK0M7SUFFakQsSUFBTSxTQUFTLEdBQUcsVUFBVSxJQUFJLFVBQVUsQ0FBQyxTQUFTLENBQUM7SUFDckQsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ25DLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDZCxJQUFNLFVBQVUsR0FBRyxtQkFBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEUsSUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUM7WUFDcEMsSUFBTSxpQkFBaUIsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkMsSUFBTSxJQUFJLEdBQUcsaUNBQXNCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLDhCQUFrQixDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLHNCQUFVLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1RyxNQUFNLFlBQ0osSUFBSSxNQUFBLElBQ0QsaUJBQWlCLEVBQ3BCO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNO1lBQ0osR0FBQyxTQUFTLElBQ0wsWUFBWSxRQUNaLENBQUMsUUFBUSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQzlDO2VBQ0Q7SUFDSixDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixNQUFNLENBQUMsUUFBUSxLQUFLLFNBQVMsQ0FBQyxDQUFDLFdBQUUsR0FBQyxTQUFTLElBQUcsUUFBUSxNQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDL0QsQ0FBQzs7QUFDSCxDQUFDO0FBRUQsY0FBcUIsS0FBZ0IsRUFBRSxPQUE2QztJQUE3Qyx3QkFBQSxFQUFBLGdCQUE2QztJQUNsRixJQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzNDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsVUFBQyxJQUFJLElBQUssT0FBQSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQTVCLENBQTRCLENBQUMsQ0FBQztBQUMzRixDQUFDO0FBSEQsb0JBR0M7QUFFRCxzQkFBNkIsUUFBMEIsRUFBRSxPQUFnQixFQUFFLEtBQWdCO0lBQ3pGLElBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDM0MsSUFBTSxXQUFXLEdBQUcsT0FBTyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7SUFFekQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUM1RCxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUNwQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ1gsSUFBTSwwQkFBMEI7Z0JBQzlCLHlEQUF5RDtnQkFDekQseUVBQXlFO2dCQUN6RSxHQUFDLE9BQU8sR0FBQyxHQUFHLElBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUMsQ0FBQzttQkFDbEUsQ0FBQztZQUVGLEVBQUUsQ0FBQyxDQUFDLHNCQUFXLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUM5RCwyRUFBMkU7Z0JBQzNFLFdBQVc7Z0JBQ1gsbUNBQW1DO2dCQUNuQyx5REFBeUQ7Z0JBQ3pELEtBQUs7WUFDUCxDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLHFCQUFVLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLE1BQU0sY0FDRCwwQkFBMEIsRUFDMUIsV0FBVyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBQyxTQUFTLEVBQUUsV0FBVyxFQUFDLENBQUMsRUFDdkQ7WUFDSixDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLE1BQU0sY0FDRCwwQkFBMEIsZUFDNUIsV0FBVyxJQUFHLEVBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFDLE9BQzFDO1lBQ0osQ0FBQztRQUNILENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxnQ0FBZ0MsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDN0UsQ0FBQztJQUNILENBQUM7SUFDRCxNQUFNO1FBQ0osR0FBQyxPQUFPLElBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBQyxDQUFDO1FBQ2xFLEdBQUMsV0FBVyxJQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO1dBQ3JDOztBQUNKLENBQUM7QUF2Q0Qsb0NBdUNDO0FBRUQsOEJBQXFDLE9BQWtCLEVBQUUsS0FBZ0IsRUFBRSxhQUF5QixFQUFFLGNBQTBCO0lBQzlILElBQU0sYUFBYSxHQUFnQixPQUFPLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNqRSxJQUFNLFdBQVcsR0FBRyxPQUFPLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztJQUN6RCxNQUFNLGNBQ0QsYUFBYSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLGFBQWEsQ0FBQyxFQUMzRCxXQUFXLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBQyxDQUFDLEVBQ25GO0FBQ0osQ0FBQztBQVBELG9EQU9DO0FBRUQsd0JBQStCLFFBQTBCLEVBQUUsT0FBZ0IsRUFBRSxTQUFpQixFQUFFLE9BQWUsRUFBRSxPQUFnQjtJQUMvSCxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNwQixNQUFNLENBQUM7WUFDTCxFQUFFLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ2hFLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDOUQsQ0FBQztJQUNKLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLE1BQU0sQ0FBQztZQUNMLEVBQUUsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztTQUM5RCxDQUFDO0lBQ0osQ0FBQztBQUNILENBQUM7QUFaRCx3Q0FZQztBQUVEOztHQUVHO0FBQ0gsdUJBQThCLE9BQWdCLEVBQUUsS0FBZ0IsRUFBRSxVQUFrRCxFQUFFLFNBQTZCO0lBQ2pKLGdHQUFnRztJQUV6RixJQUFBLHlCQUFRLEVBQUUsbUJBQUssQ0FBVTtJQUVoQyxJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFckMsSUFBTSxRQUFRLEdBQUcsQ0FBQyxVQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLGdHQUFnRztRQUNoRyxFQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUNqQyxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBRTNILE1BQU07UUFDSixHQUFDLFNBQVMsSUFBSSxPQUFPLElBQUcsUUFBUTtXQUNoQzs7QUFDSixDQUFDO0FBZkQsc0NBZUM7QUFFRDs7O0dBR0c7QUFDSCx3QkFBK0IsS0FBZ0IsRUFBRSxVQUFxQyxFQUFFLE9BQXFCO0lBQ3BHLElBQUEseUJBQVEsRUFBRSx1QkFBTyxFQUFFLG1CQUFLLENBQVU7SUFDekMsT0FBTyxHQUFHLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXJFLElBQU0sV0FBVyxHQUFHLE9BQU8sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ2pELElBQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUV6QyxJQUFNLFFBQVEsR0FBRyxDQUFDLFVBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDekUscUdBQXFHO1FBQ3JHLEVBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQSxDQUFDO1FBQ2hDLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsRUFBRSxLQUFLLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLEVBQUUsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ2hKLE1BQU0sVUFBRSxHQUFDLE9BQU8sSUFBRyxRQUFRLEtBQUU7O0FBQy9CLENBQUM7QUFaRCx3Q0FZQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNBcnJheX0gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCB7Tk9OUE9TSVRJT05fU0NBTEVfQ0hBTk5FTFN9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtDaGFubmVsRGVmLCBGaWVsZERlZiwgZ2V0RmllbGREZWYsIGlzQ29uZGl0aW9uYWxTZWxlY3Rpb24sIGlzVmFsdWVEZWZ9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtNYXJrRGVmfSBmcm9tICcuLi8uLi9tYXJrJztcbmltcG9ydCB7ZXhwcmVzc2lvbn0gZnJvbSAnLi4vLi4vcHJlZGljYXRlJztcbmltcG9ydCB7Y29udGFpbnN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWR19NQVJLX0NPTkZJR1MsIFZnRW5jb2RlRW50cnksIFZnVmFsdWVSZWZ9IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7Z2V0TWFya0NvbmZpZ30gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7c2VsZWN0aW9uUHJlZGljYXRlfSBmcm9tICcuLi9zZWxlY3Rpb24vc2VsZWN0aW9uJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCAqIGFzIHJlZiBmcm9tICcuL3ZhbHVlcmVmJztcblxuXG5leHBvcnQgZnVuY3Rpb24gY29sb3IobW9kZWw6IFVuaXRNb2RlbCkge1xuICBjb25zdCBjb25maWcgPSBtb2RlbC5jb25maWc7XG4gIGNvbnN0IHtmaWxsZWQsIHR5cGU6IG1hcmtUeXBlfSA9IG1vZGVsLm1hcmtEZWY7XG4gIGNvbnN0IHZnQ2hhbm5lbCA9IGZpbGxlZCA/ICdmaWxsJyA6ICdzdHJva2UnO1xuXG4gIHJldHVybiB7XG4gICAgLy8gSWYgdGhlcmUgaXMgbm8gZmlsbCwgYWx3YXlzIGZpbGwgc3ltYm9scywgYmFyLCBnZW9zaGFwZVxuICAgIC8vIHdpdGggdHJhbnNwYXJlbnQgZmlsbHMgaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8xMzE2XG4gICAgLi4uKFxuICAgICAgY29udGFpbnMoWydiYXInLCAncG9pbnQnLCAnY2lyY2xlJywgJ3NxdWFyZScsICdnZW9zaGFwZSddLCBtYXJrVHlwZSkgP1xuICAgICAge2ZpbGw6IHt2YWx1ZTogJ3RyYW5zcGFyZW50J319OlxuICAgICAge31cbiAgICApLFxuXG4gICAgLi4ubm9uUG9zaXRpb24oJ2NvbG9yJywgbW9kZWwsIHtcbiAgICAgIHZnQ2hhbm5lbCxcbiAgICAgIC8vIE1hcmsgZGVmaW5pdGlvbiBoYXMgaGlnaGVyIHByZWNlZGVuY2UgdGhhbiBjb25maWc7XG4gICAgICAvLyBmaWxsL3N0cm9rZSBoYXMgaGlnaGVyIHByZWNlZGVuY2UgdGhhbiBjb2xvci5cbiAgICAgIGRlZmF1bHRWYWx1ZTogbW9kZWwubWFya0RlZlt2Z0NoYW5uZWxdIHx8XG4gICAgICAgIG1vZGVsLm1hcmtEZWYuY29sb3IgfHxcbiAgICAgICAgZ2V0TWFya0NvbmZpZyh2Z0NoYW5uZWwsIG1vZGVsLm1hcmtEZWYsIGNvbmZpZykgfHxcbiAgICAgICAgZ2V0TWFya0NvbmZpZygnY29sb3InLCBtb2RlbC5tYXJrRGVmLCBjb25maWcpXG4gICAgfSksXG4gICAgLy8gZmlsbCAvIHN0cm9rZSBlbmNvZGluZ3MgaGF2ZSBoaWdoZXIgcHJlY2VkZW5jZSB0aGFuIGNvbG9yIGVuY29kaW5nXG4gICAgLi4ubm9uUG9zaXRpb24oJ2ZpbGwnLCBtb2RlbCksXG4gICAgLi4ubm9uUG9zaXRpb24oJ3N0cm9rZScsIG1vZGVsKVxuICB9O1xufVxuXG5leHBvcnQgdHlwZSBJZ25vcmUgPSBSZWNvcmQ8J3NpemUnIHwgJ29yaWVudCcsICdpZ25vcmUnIHwgJ2luY2x1ZGUnPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJhc2VFbmNvZGVFbnRyeShtb2RlbDogVW5pdE1vZGVsLCBpZ25vcmU6IElnbm9yZSkge1xuICByZXR1cm4ge1xuICAgIC4uLm1hcmtEZWZQcm9wZXJ0aWVzKG1vZGVsLm1hcmtEZWYsIGlnbm9yZSksXG4gICAgLi4uY29sb3IobW9kZWwpLFxuICAgIC4uLm5vblBvc2l0aW9uKCdvcGFjaXR5JywgbW9kZWwpLFxuICAgIC4uLnRleHQobW9kZWwsICd0b29sdGlwJyksXG4gICAgLi4udGV4dChtb2RlbCwgJ2hyZWYnKVxuICB9O1xufVxuXG5mdW5jdGlvbiBtYXJrRGVmUHJvcGVydGllcyhtYXJrOiBNYXJrRGVmLCBpZ25vcmU6IElnbm9yZSkge1xuICByZXR1cm4gVkdfTUFSS19DT05GSUdTLnJlZHVjZSgobSwgcHJvcCkgPT4ge1xuICAgIGlmIChtYXJrW3Byb3BdICE9PSB1bmRlZmluZWQgJiYgaWdub3JlW3Byb3BdICE9PSAnaWdub3JlJykge1xuICAgICAgbVtwcm9wXSA9IHt2YWx1ZTogbWFya1twcm9wXX07XG4gICAgfVxuICAgIHJldHVybiBtO1xuICB9LCB7fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZUlmRGVmaW5lZChwcm9wOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuKTogVmdFbmNvZGVFbnRyeSB7XG4gIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHtbcHJvcF06IHt2YWx1ZTogdmFsdWV9fTtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIFJldHVybiBtaXhpbnMgZm9yIG5vbi1wb3NpdGlvbmFsIGNoYW5uZWxzIHdpdGggc2NhbGVzLiAgKFRleHQgZG9lc24ndCBoYXZlIHNjYWxlLilcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vblBvc2l0aW9uKGNoYW5uZWw6IHR5cGVvZiBOT05QT1NJVElPTl9TQ0FMRV9DSEFOTkVMU1swXSwgbW9kZWw6IFVuaXRNb2RlbCwgb3B0OiB7ZGVmYXVsdFZhbHVlPzogbnVtYmVyIHwgc3RyaW5nIHwgYm9vbGVhbiwgdmdDaGFubmVsPzogc3RyaW5nLCBkZWZhdWx0UmVmPzogVmdWYWx1ZVJlZn0gPSB7fSk6IFZnRW5jb2RlRW50cnkge1xuICBjb25zdCB7ZGVmYXVsdFZhbHVlLCB2Z0NoYW5uZWx9ID0gb3B0O1xuICBjb25zdCBkZWZhdWx0UmVmID0gb3B0LmRlZmF1bHRSZWYgfHwgKGRlZmF1bHRWYWx1ZSAhPT0gdW5kZWZpbmVkID8ge3ZhbHVlOiBkZWZhdWx0VmFsdWV9IDogdW5kZWZpbmVkKTtcblxuICBjb25zdCBjaGFubmVsRGVmID0gbW9kZWwuZW5jb2RpbmdbY2hhbm5lbF07XG5cbiAgcmV0dXJuIHdyYXBDb25kaXRpb24obW9kZWwsIGNoYW5uZWxEZWYsIHZnQ2hhbm5lbCB8fCBjaGFubmVsLCAoY0RlZikgPT4ge1xuICAgIHJldHVybiByZWYubWlkUG9pbnQoXG4gICAgICBjaGFubmVsLCBjRGVmLCBtb2RlbC5zY2FsZU5hbWUoY2hhbm5lbCksXG4gICAgICBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKSxcbiAgICAgIG51bGwsIC8vIE5vIG5lZWQgdG8gcHJvdmlkZSBzdGFjayBmb3Igbm9uLXBvc2l0aW9uIGFzIGl0IGRvZXMgbm90IGFmZmVjdCBtaWQgcG9pbnRcbiAgICAgIGRlZmF1bHRSZWZcbiAgICApO1xuICB9KTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBtaXhpbiB0aGF0IGluY2x1ZGUgYSBWZWdhIHByb2R1Y3Rpb24gcnVsZSBmb3IgYSBWZWdhLUxpdGUgY29uZGl0aW9uYWwgY2hhbm5lbCBkZWZpbml0aW9uLlxuICogb3IgYSBzaW1wbGUgbWl4aW4gaWYgY2hhbm5lbCBkZWYgaGFzIG5vIGNvbmRpdGlvbi5cbiAqL1xuZnVuY3Rpb24gd3JhcENvbmRpdGlvbihcbiAgICBtb2RlbDogVW5pdE1vZGVsLCBjaGFubmVsRGVmOiBDaGFubmVsRGVmPHN0cmluZz4sIHZnQ2hhbm5lbDogc3RyaW5nLFxuICAgIHJlZkZuOiAoY0RlZjogQ2hhbm5lbERlZjxzdHJpbmc+KSA9PiBWZ1ZhbHVlUmVmXG4gICk6IFZnRW5jb2RlRW50cnkge1xuICBjb25zdCBjb25kaXRpb24gPSBjaGFubmVsRGVmICYmIGNoYW5uZWxEZWYuY29uZGl0aW9uO1xuICBjb25zdCB2YWx1ZVJlZiA9IHJlZkZuKGNoYW5uZWxEZWYpO1xuICBpZiAoY29uZGl0aW9uKSB7XG4gICAgY29uc3QgY29uZGl0aW9ucyA9IGlzQXJyYXkoY29uZGl0aW9uKSA/IGNvbmRpdGlvbiA6IFtjb25kaXRpb25dO1xuICAgIGNvbnN0IHZnQ29uZGl0aW9ucyA9IGNvbmRpdGlvbnMubWFwKChjKSA9PiB7XG4gICAgICBjb25zdCBjb25kaXRpb25WYWx1ZVJlZiA9IHJlZkZuKGMpO1xuICAgICAgY29uc3QgdGVzdCA9IGlzQ29uZGl0aW9uYWxTZWxlY3Rpb24oYykgPyBzZWxlY3Rpb25QcmVkaWNhdGUobW9kZWwsIGMuc2VsZWN0aW9uKSA6IGV4cHJlc3Npb24obW9kZWwsIGMudGVzdCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0ZXN0LFxuICAgICAgICAuLi5jb25kaXRpb25WYWx1ZVJlZlxuICAgICAgfTtcbiAgICB9KTtcbiAgICByZXR1cm4ge1xuICAgICAgW3ZnQ2hhbm5lbF06IFtcbiAgICAgICAgLi4udmdDb25kaXRpb25zLFxuICAgICAgICAuLi4odmFsdWVSZWYgIT09IHVuZGVmaW5lZCA/IFt2YWx1ZVJlZl0gOiBbXSlcbiAgICAgIF1cbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB2YWx1ZVJlZiAhPT0gdW5kZWZpbmVkID8ge1t2Z0NoYW5uZWxdOiB2YWx1ZVJlZn0gOiB7fTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdGV4dChtb2RlbDogVW5pdE1vZGVsLCBjaGFubmVsOiAndGV4dCcgfCAndG9vbHRpcCcgfCAnaHJlZicgPSAndGV4dCcpIHtcbiAgY29uc3QgY2hhbm5lbERlZiA9IG1vZGVsLmVuY29kaW5nW2NoYW5uZWxdO1xuICByZXR1cm4gd3JhcENvbmRpdGlvbihtb2RlbCwgY2hhbm5lbERlZiwgY2hhbm5lbCwgKGNEZWYpID0+IHJlZi50ZXh0KGNEZWYsIG1vZGVsLmNvbmZpZykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmFuZFBvc2l0aW9uKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjaGFubmVsOiAneCd8J3knLCBtb2RlbDogVW5pdE1vZGVsKSB7XG4gIGNvbnN0IHNjYWxlTmFtZSA9IG1vZGVsLnNjYWxlTmFtZShjaGFubmVsKTtcbiAgY29uc3Qgc2l6ZUNoYW5uZWwgPSBjaGFubmVsID09PSAneCcgPyAnd2lkdGgnIDogJ2hlaWdodCc7XG5cbiAgaWYgKG1vZGVsLmVuY29kaW5nLnNpemUgfHwgbW9kZWwubWFya0RlZi5zaXplICE9PSB1bmRlZmluZWQpIHtcbiAgICBjb25zdCBvcmllbnQgPSBtb2RlbC5tYXJrRGVmLm9yaWVudDtcbiAgICBpZiAob3JpZW50KSB7XG4gICAgICBjb25zdCBjZW50ZXJlZEJhbmRQb3NpdGlvbk1peGlucyA9IHtcbiAgICAgICAgLy8gVXNlIHhjL3ljIGFuZCBwbGFjZSB0aGUgbWFyayBhdCB0aGUgbWlkZGxlIG9mIHRoZSBiYW5kXG4gICAgICAgIC8vIFRoaXMgd2F5IHdlIG5ldmVyIGhhdmUgdG8gZGVhbCB3aXRoIHNpemUncyBjb25kaXRpb24gZm9yIHgveSBwb3NpdGlvbi5cbiAgICAgICAgW2NoYW5uZWwrJ2MnXTogcmVmLmZpZWxkUmVmKGZpZWxkRGVmLCBzY2FsZU5hbWUsIHt9LCB7YmFuZDogMC41fSlcbiAgICAgIH07XG5cbiAgICAgIGlmIChnZXRGaWVsZERlZihtb2RlbC5lbmNvZGluZy5zaXplKSkge1xuICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5jYW5ub3RVc2VTaXplRmllbGRXaXRoQmFuZFNpemUoY2hhbm5lbCkpO1xuICAgICAgICAvLyBUT0RPOiBhcHBseSBzaXplIHRvIGJhbmQgYW5kIHNldCBzY2FsZSByYW5nZSB0byBzb21lIHZhbHVlcyBiZXR3ZWVuIDAtMS5cbiAgICAgICAgLy8gcmV0dXJuIHtcbiAgICAgICAgLy8gICAuLi5jZW50ZXJlZEJhbmRQb3NpdGlvbk1peGlucyxcbiAgICAgICAgLy8gICAuLi5iYW5kU2l6ZSgnc2l6ZScsIG1vZGVsLCB7dmdDaGFubmVsOiBzaXplQ2hhbm5lbH0pXG4gICAgICAgIC8vIH07XG4gICAgICB9IGVsc2UgaWYgKGlzVmFsdWVEZWYobW9kZWwuZW5jb2Rpbmcuc2l6ZSkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5jZW50ZXJlZEJhbmRQb3NpdGlvbk1peGlucyxcbiAgICAgICAgICAuLi5ub25Qb3NpdGlvbignc2l6ZScsIG1vZGVsLCB7dmdDaGFubmVsOiBzaXplQ2hhbm5lbH0pXG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKG1vZGVsLm1hcmtEZWYuc2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uY2VudGVyZWRCYW5kUG9zaXRpb25NaXhpbnMsXG4gICAgICAgICAgW3NpemVDaGFubmVsXToge3ZhbHVlOiBtb2RlbC5tYXJrRGVmLnNpemV9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmNhbm5vdEFwcGx5U2l6ZVRvTm9uT3JpZW50ZWRNYXJrKG1vZGVsLm1hcmtEZWYudHlwZSkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge1xuICAgIFtjaGFubmVsXTogcmVmLmZpZWxkUmVmKGZpZWxkRGVmLCBzY2FsZU5hbWUsIHtiaW5TdWZmaXg6ICdyYW5nZSd9KSxcbiAgICBbc2l6ZUNoYW5uZWxdOiByZWYuYmFuZFJlZihzY2FsZU5hbWUpXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjZW50ZXJlZEJhbmRQb3NpdGlvbihjaGFubmVsOiAneCcgfCAneScsIG1vZGVsOiBVbml0TW9kZWwsIGRlZmF1bHRQb3NSZWY6IFZnVmFsdWVSZWYsIGRlZmF1bHRTaXplUmVmOiBWZ1ZhbHVlUmVmKSB7XG4gIGNvbnN0IGNlbnRlckNoYW5uZWw6ICd4YycgfCAneWMnID0gY2hhbm5lbCA9PT0gJ3gnID8gJ3hjJyA6ICd5Yyc7XG4gIGNvbnN0IHNpemVDaGFubmVsID0gY2hhbm5lbCA9PT0gJ3gnID8gJ3dpZHRoJyA6ICdoZWlnaHQnO1xuICByZXR1cm4ge1xuICAgIC4uLnBvaW50UG9zaXRpb24oY2hhbm5lbCwgbW9kZWwsIGRlZmF1bHRQb3NSZWYsIGNlbnRlckNoYW5uZWwpLFxuICAgIC4uLm5vblBvc2l0aW9uKCdzaXplJywgbW9kZWwsIHtkZWZhdWx0UmVmOiBkZWZhdWx0U2l6ZVJlZiwgdmdDaGFubmVsOiBzaXplQ2hhbm5lbH0pXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5uZWRQb3NpdGlvbihmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY2hhbm5lbDogJ3gnfCd5Jywgc2NhbGVOYW1lOiBzdHJpbmcsIHNwYWNpbmc6IG51bWJlciwgcmV2ZXJzZTogYm9vbGVhbikge1xuICBpZiAoY2hhbm5lbCA9PT0gJ3gnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHgyOiByZWYuYmluKGZpZWxkRGVmLCBzY2FsZU5hbWUsICdzdGFydCcsIHJldmVyc2UgPyAwIDogc3BhY2luZyksXG4gICAgICB4OiByZWYuYmluKGZpZWxkRGVmLCBzY2FsZU5hbWUsICdlbmQnLCByZXZlcnNlID8gc3BhY2luZyA6IDApXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgeTI6IHJlZi5iaW4oZmllbGREZWYsIHNjYWxlTmFtZSwgJ3N0YXJ0JywgcmV2ZXJzZSA/IHNwYWNpbmcgOiAwKSxcbiAgICAgIHk6IHJlZi5iaW4oZmllbGREZWYsIHNjYWxlTmFtZSwgJ2VuZCcsIHJldmVyc2UgPyAwIDogc3BhY2luZylcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJuIG1peGlucyBmb3IgcG9pbnQgKG5vbi1iYW5kKSBwb3NpdGlvbiBjaGFubmVscy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBvaW50UG9zaXRpb24oY2hhbm5lbDogJ3gnfCd5JywgbW9kZWw6IFVuaXRNb2RlbCwgZGVmYXVsdFJlZjogVmdWYWx1ZVJlZiB8ICd6ZXJvT3JNaW4nIHwgJ3plcm9Pck1heCcsIHZnQ2hhbm5lbD86ICd4J3wneSd8J3hjJ3wneWMnKSB7XG4gIC8vIFRPRE86IHJlZmFjdG9yIGhvdyByZWZlciB0byBzY2FsZSBhcyBkaXNjdXNzZWQgaW4gaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL3B1bGwvMTYxM1xuXG4gIGNvbnN0IHtlbmNvZGluZywgc3RhY2t9ID0gbW9kZWw7XG5cbiAgY29uc3QgY2hhbm5lbERlZiA9IGVuY29kaW5nW2NoYW5uZWxdO1xuXG4gIGNvbnN0IHZhbHVlUmVmID0gIWNoYW5uZWxEZWYgJiYgKGVuY29kaW5nLmxhdGl0dWRlIHx8IGVuY29kaW5nLmxvbmdpdHVkZSkgP1xuICAgIC8vIHVzZSBnZW9wb2ludCBvdXRwdXQgaWYgdGhlcmUgYXJlIGxhdC9sb25nIGFuZCB0aGVyZSBpcyBubyBwb2ludCBwb3NpdGlvbiBvdmVycmlkaW5nIGxhdC9sb25nLlxuICAgIHtmaWVsZDogbW9kZWwuZ2V0TmFtZShjaGFubmVsKX0gOlxuICAgIHJlZi5zdGFja2FibGUoY2hhbm5lbCwgZW5jb2RpbmdbY2hhbm5lbF0sIG1vZGVsLnNjYWxlTmFtZShjaGFubmVsKSwgbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCksIHN0YWNrLCBkZWZhdWx0UmVmKTtcblxuICByZXR1cm4ge1xuICAgIFt2Z0NoYW5uZWwgfHwgY2hhbm5lbF06IHZhbHVlUmVmXG4gIH07XG59XG5cbi8qKlxuICogUmV0dXJuIG1peGlucyBmb3IgeDIsIHkyLlxuICogSWYgY2hhbm5lbCBpcyBub3Qgc3BlY2lmaWVkLCByZXR1cm4gb25lIGNoYW5uZWwgYmFzZWQgb24gb3JpZW50YXRpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwb2ludFBvc2l0aW9uMihtb2RlbDogVW5pdE1vZGVsLCBkZWZhdWx0UmVmOiAnemVyb09yTWluJyB8ICd6ZXJvT3JNYXgnLCBjaGFubmVsPzogJ3gyJyB8ICd5MicpIHtcbiAgY29uc3Qge2VuY29kaW5nLCBtYXJrRGVmLCBzdGFja30gPSBtb2RlbDtcbiAgY2hhbm5lbCA9IGNoYW5uZWwgfHwgKG1hcmtEZWYub3JpZW50ID09PSAnaG9yaXpvbnRhbCcgPyAneDInIDogJ3kyJyk7XG5cbiAgY29uc3QgYmFzZUNoYW5uZWwgPSBjaGFubmVsID09PSAneDInID8gJ3gnIDogJ3knO1xuICBjb25zdCBjaGFubmVsRGVmID0gZW5jb2RpbmdbYmFzZUNoYW5uZWxdO1xuXG4gIGNvbnN0IHZhbHVlUmVmID0gIWNoYW5uZWxEZWYgJiYgKGVuY29kaW5nLmxhdGl0dWRlIHx8IGVuY29kaW5nLmxvbmdpdHVkZSkgP1xuICAgIC8vIHVzZSBnZW9wb2ludCBvdXRwdXQgaWYgdGhlcmUgYXJlIGxhdDIvbG9uZzIgYW5kIHRoZXJlIGlzIG5vIHBvaW50IHBvc2l0aW9uMiBvdmVycmlkaW5nIGxhdDIvbG9uZzIuXG4gICAge2ZpZWxkOiBtb2RlbC5nZXROYW1lKGNoYW5uZWwpfTpcbiAgICByZWYuc3RhY2thYmxlMihjaGFubmVsLCBjaGFubmVsRGVmLCBlbmNvZGluZ1tjaGFubmVsXSwgbW9kZWwuc2NhbGVOYW1lKGJhc2VDaGFubmVsKSwgbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoYmFzZUNoYW5uZWwpLCBzdGFjaywgZGVmYXVsdFJlZik7XG4gIHJldHVybiB7W2NoYW5uZWxdOiB2YWx1ZVJlZn07XG59XG4iXX0=