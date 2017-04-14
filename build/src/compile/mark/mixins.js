"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util = require("../../util");
var common_1 = require("../common");
var ref = require("./valueref");
var selection_1 = require("../selection/selection");
function color(model) {
    var config = model.config;
    var filled = model.markDef.filled;
    var e = nonPosition('color', model, {
        vgChannel: filled ? 'fill' : 'stroke',
        defaultValue: common_1.getMarkConfig('color', model.mark(), config)
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
    // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613
    if (opt === void 0) { opt = {}; }
    var defaultValue = opt.defaultValue, vgChannel = opt.vgChannel;
    var defaultRef = opt.defaultRef || (defaultValue !== undefined ? { value: defaultValue } : undefined);
    var channelDef = model.encoding[channel];
    var valueRef = ref.midPoint(channel, channelDef, model.scaleName(channel), model.scale(channel), defaultRef);
    return wrapCondition(model, channelDef && channelDef.condition, vgChannel || channel, valueRef);
}
exports.nonPosition = nonPosition;
/**
 * Return a mixin that include a Vega production rule for a Vega-Lite conditional channel definition.
 * or a simple mixin if channel def has no condition.
 */
function wrapCondition(model, condition, vgChannel, valueRef) {
    if (condition) {
        var selection = condition.selection, value = condition.value;
        return _a = {},
            _a[vgChannel] = [
                { test: selectionTest(model, selection), value: value }
            ].concat((valueRef !== undefined ? [valueRef] : [])),
            _a;
    }
    else {
        return valueRef !== undefined ? (_b = {}, _b[vgChannel] = valueRef, _b) : {};
    }
    var _a, _b;
}
function selectionTest(model, selectionName) {
    var negate = selectionName.charAt(0) === '!', name = negate ? selectionName.slice(1) : selectionName;
    return (negate ? '!' : '') + selection_1.predicate(model.component.selection[name]);
}
function text(model) {
    var channelDef = model.encoding.text;
    return wrapCondition(model, channelDef && channelDef.condition, 'text', ref.text(channelDef, model.config));
}
exports.text = text;
function bandPosition(channel, model) {
    // TODO: band scale doesn't support size yet
    var fieldDef = model.encoding[channel];
    var scaleName = model.scaleName(channel);
    var sizeChannel = channel === 'x' ? 'width' : 'height';
    return _a = {},
        _a[channel] = ref.fieldRef(fieldDef, scaleName, {}),
        _a[sizeChannel] = ref.band(scaleName),
        _a;
    var _a;
}
exports.bandPosition = bandPosition;
function centeredBandPosition(channel, model, defaultPosRef, defaultSizeRef) {
    var centerChannel = channel === 'x' ? 'xc' : 'yc';
    var sizeChannel = channel === 'x' ? 'width' : 'height';
    return tslib_1.__assign({}, pointPosition(channel, model, defaultPosRef, centerChannel), nonPosition('size', model, { defaultRef: defaultSizeRef, vgChannel: sizeChannel }));
}
exports.centeredBandPosition = centeredBandPosition;
function binnedPosition(channel, model, spacing) {
    var fieldDef = model.encoding[channel];
    var scaleName = model.scaleName(channel);
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
    var valueRef = ref.stackable(channel, encoding[channel], model.scaleName(channel), model.scale(channel), stack, defaultRef);
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
    var valueRef = ref.stackable2(channel, encoding[baseChannel], encoding[channel], model.scaleName(baseChannel), model.scale(baseChannel), stack, defaultRef);
    return _a = {}, _a[channel] = valueRef, _a;
    var _a;
}
exports.pointPosition2 = pointPosition2;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4aW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvbWFyay9taXhpbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsaUNBQW1DO0FBRW5DLG9DQUF3QztBQUd4QyxnQ0FBa0M7QUFJbEMsb0RBQWlEO0FBRWpELGVBQXNCLEtBQWdCO0lBQ3BDLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7SUFDNUIsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFFcEMsSUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUU7UUFDcEMsU0FBUyxFQUFFLE1BQU0sR0FBRyxNQUFNLEdBQUcsUUFBUTtRQUNyQyxZQUFZLEVBQUUsc0JBQWEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxFQUFFLE1BQU0sQ0FBVztLQUNyRSxDQUFDLENBQUM7SUFFSCwyQ0FBMkM7SUFDM0MsdUVBQXVFO0lBQ3ZFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pGLENBQUMsQ0FBQyxJQUFJLEdBQUcsRUFBQyxLQUFLLEVBQUUsYUFBYSxFQUFDLENBQUM7SUFDbEMsQ0FBQztJQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBZkQsc0JBZUM7QUFFRCwyQkFBa0MsSUFBYSxFQUFFLEtBQXdCO0lBQ3ZFLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxFQUFFLElBQUk7UUFDMUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FB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