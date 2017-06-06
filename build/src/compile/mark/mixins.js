"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var log = require("../../log");
var util = require("../../util");
var common_1 = require("../common");
var ref = require("./valueref");
var fielddef_1 = require("../../fielddef");
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
    var negate = selectionName.charAt(0) === '!', name = negate ? selectionName.slice(1) : selectionName, selection = model.getComponent('selection', name);
    return (negate ? '!' : '') +
        selection_1.predicate(model, selection.name, selection.type, selection.resolve);
}
function text(model, vgChannel) {
    if (vgChannel === void 0) { vgChannel = 'text'; }
    var channelDef = model.encoding[vgChannel];
    var valueRef = (vgChannel === 'tooltip' && !channelDef) ? undefined : ref.text(channelDef, model.config);
    return wrapCondition(model, channelDef && channelDef.condition, vgChannel, valueRef);
}
exports.text = text;
function bandPosition(channel, model) {
    var fieldDef = model.encoding[channel];
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
            if (fielddef_1.isFieldDef(model.encoding.size)) {
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
        _b[channel] = ref.fieldRef(fieldDef, scaleName, {}),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4aW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvbWFyay9taXhpbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsK0JBQWlDO0FBRWpDLGlDQUFtQztBQUVuQyxvQ0FBd0M7QUFHeEMsZ0NBQWtDO0FBR2xDLDJDQUFpRTtBQUNqRSxvREFBaUQ7QUFFakQsZUFBc0IsS0FBZ0I7SUFDcEMsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUM1QixJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUVwQyxJQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRTtRQUNwQyxTQUFTLEVBQUUsTUFBTSxHQUFHLE1BQU0sR0FBRyxRQUFRO1FBQ3JDLFlBQVksRUFBRSxzQkFBYSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLEVBQUUsTUFBTSxDQUFXO0tBQ3JFLENBQUMsQ0FBQztJQUVILDJDQUEyQztJQUMzQyx1RUFBdUU7SUFDdkUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakYsQ0FBQyxDQUFDLElBQUksR0FBRyxFQUFDLEtBQUssRUFBRSxhQUFhLEVBQUMsQ0FBQztJQUNsQyxDQUFDO0lBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNYLENBQUM7QUFmRCxzQkFlQztBQUVELDJCQUFrQyxJQUFhLEVBQUUsS0FBd0I7SUFDdkUsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLEVBQUUsSUFBSTtRQUMxQixFQUFFLENBQUMsQ0FBQyxJQUFJLENB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