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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4aW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvbWFyay9taXhpbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsMkNBQTZFO0FBQzdFLCtCQUFpQztBQUVqQyxpQ0FBbUM7QUFFbkMsb0NBQXdDO0FBQ3hDLG9EQUFpRDtBQUVqRCxnQ0FBa0M7QUFHbEMsZUFBc0IsS0FBZ0I7SUFDcEMsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUM1QixJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNwQyxJQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO0lBQzdDLElBQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFO1FBQ3BDLFNBQVMsV0FBQTtRQUNULCtDQUErQztRQUMvQyxZQUFZLEVBQUUsc0JBQWEsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7WUFDM0Qsc0JBQWEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7S0FDaEQsQ0FBQyxDQUFDO0lBRUgsMkNBQTJDO0lBQzNDLHVFQUF1RTtJQUN2RSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRixDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUMsS0FBSyxFQUFFLGFBQWEsRUFBQyxDQUFDO0lBQ2xDLENBQUM7SUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQWpCRCxzQkFpQkM7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