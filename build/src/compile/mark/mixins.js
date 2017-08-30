"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fielddef_1 = require("../../fielddef");
var log = require("../../log");
var util = require("../../util");
var common_1 = require("../common");
var selection_1 = require("../selection/selection");
var ref = require("./valueref");
function color(model) {
    var config = model.config;
    var filled = model.markDef.filled;
    var vgChannel = filled ? 'fill' : 'stroke';
    var e = nonPosition('color', model, {
        vgChannel: vgChannel,
        // fill/stroke has higher precedence than color
        defaultValue: common_1.getMarkConfig(vgChannel, model.markDef, config) ||
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
function markDefProperties(mark, props) {
    return props.reduce(function (m, prop) {
        if (mark[prop]) {
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
        var conditionValueRef = refFn(condition);
        return _a = {},
            _a[vgChannel] = [
                tslib_1.__assign({ test: selection_1.predicate(model, condition.selection) }, conditionValueRef)
            ].concat((valueRef !== undefined ? [valueRef] : [])),
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
                return tslib_1.__assign({}, centeredBandPositionMixins, nonPosition('size', model, { vgChannel: sizeChannel }));
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
    return tslib_1.__assign({}, pointPosition(channel, model, defaultPosRef, centerChannel), nonPosition('size', model, { defaultRef: defaultSizeRef, vgChannel: sizeChannel }));
}
exports.centeredBandPosition = centeredBandPosition;
function binnedPosition(fieldDef, channel, scaleName, spacing) {
    if (channel === 'x') {
        return {
            x2: ref.bin(fieldDef, scaleName, 'start', spacing),
            x: ref.bin(fieldDef, scaleName, 'end')
        };
    }
    else {
        return {
            y2: ref.bin(fieldDef, scaleName, 'start'),
            y: ref.bin(fieldDef, scaleName, 'end', spacing)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4aW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvbWFyay9taXhpbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsMkNBQTZFO0FBQzdFLCtCQUFpQztBQUVqQyxpQ0FBbUM7QUFFbkMsb0NBQXdDO0FBQ3hDLG9EQUFpRDtBQUVqRCxnQ0FBa0M7QUFHbEMsZUFBc0IsS0FBZ0I7SUFDcEMsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUM1QixJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNwQyxJQUFNLFNBQVMsR0FBRyxNQUFNLEdBQUcsTUFBTSxHQUFHLFFBQVEsQ0FBQztJQUM3QyxJQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRTtRQUNwQyxTQUFTLFdBQUE7UUFDVCwrQ0FBK0M7UUFDL0MsWUFBWSxFQUFFLHNCQUFhLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO1lBQzNELHNCQUFhLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO0tBQ2hELENBQUMsQ0FBQztJQUVILDJDQUEyQztJQUMzQyx1RUFBdUU7SUFDdkUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakYsQ0FBQyxDQUFDLElBQUksR0FBRyxFQUFDLEtBQUssRUFBRSxhQUFhLEVBQUMsQ0FBQztJQUNsQyxDQUFDO0lBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNYLENBQUM7QUFqQkQsc0JBaUJDO0FBRUQsMkJBQWtDLElBQWEsRUFB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