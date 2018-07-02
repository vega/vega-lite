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
    var _a, _b;
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
    var _a;
    if (value !== undefined) {
        return _a = {}, _a[prop] = { value: value }, _a;
    }
    return undefined;
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
    var _a, _b;
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
    var _a, _b, _c;
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
    var _a;
    var encoding = model.encoding, mark = model.mark, stack = model.stack;
    var channelDef = encoding[channel];
    var scaleName = model.scaleName(channel);
    var scale = model.getScaleComponent(channel);
    var offset = ref.getOffset(channel, model.markDef);
    var valueRef = !channelDef && (encoding.latitude || encoding.longitude) ?
        // use geopoint output if there are lat/long and there is no point position overriding lat/long.
        { field: model.getName(channel) } : tslib_1.__assign({}, ref.position(channel, encoding[channel], scaleName, scale, stack, ref.getDefaultRef(defaultRef, channel, scaleName, scale, mark)), (offset ? { offset: offset } : {}));
    return _a = {},
        _a[vgChannel || channel] = valueRef,
        _a;
}
/**
 * Return mixins for x2, y2.
 * If channel is not specified, return one channel based on orientation.
 */
export function pointPosition2(model, defaultRef, channel) {
    var _a;
    var encoding = model.encoding, mark = model.mark, stack = model.stack;
    var baseChannel = channel === 'x2' ? 'x' : 'y';
    var channelDef = encoding[baseChannel];
    var scaleName = model.scaleName(baseChannel);
    var scale = model.getScaleComponent(baseChannel);
    var offset = ref.getOffset(channel, model.markDef);
    var valueRef = !channelDef && (encoding.latitude || encoding.longitude) ?
        // use geopoint output if there are lat2/long2 and there is no point position2 overriding lat2/long2.
        { field: model.getName(channel) } : tslib_1.__assign({}, ref.position2(channel, channelDef, encoding[channel], scaleName, scale, stack, ref.getDefaultRef(defaultRef, baseChannel, scaleName, scale, mark)), (offset ? { offset: offset } : {}));
    return _a = {}, _a[channel] = valueRef, _a;
}
//# sourceMappingURL=mixins.js.map