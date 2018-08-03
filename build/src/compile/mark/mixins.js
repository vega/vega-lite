"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var bin_1 = require("../../bin");
var channel_1 = require("../../channel");
var encoding_1 = require("../../encoding");
var fielddef_1 = require("../../fielddef");
var log = tslib_1.__importStar(require("../../log"));
var mark_1 = require("../../mark");
var predicate_1 = require("../../predicate");
var scale_1 = require("../../scale");
var util_1 = require("../../util");
var vega_schema_1 = require("../../vega.schema");
var common_1 = require("../common");
var selection_1 = require("../selection/selection");
var ref = tslib_1.__importStar(require("./valueref"));
function color(model) {
    var _a, _b;
    var markDef = model.markDef, encoding = model.encoding, config = model.config;
    var filled = markDef.filled, markType = markDef.type;
    var configValue = {
        fill: common_1.getMarkConfig('fill', markDef, config),
        stroke: common_1.getMarkConfig('stroke', markDef, config),
        color: common_1.getMarkConfig('color', markDef, config)
    };
    var transparentIfNeeded = util_1.contains(['bar', 'point', 'circle', 'square', 'geoshape'], markType)
        ? 'transparent'
        : undefined;
    var defaultValue = {
        fill: util_1.getFirstDefined(markDef.fill, configValue.fill, 
        // If there is no fill, always fill symbols, bar, geoshape
        // with transparent fills https://github.com/vega/vega-lite/issues/1316
        transparentIfNeeded),
        stroke: util_1.getFirstDefined(markDef.stroke, configValue.stroke)
    };
    var colorVgChannel = filled ? 'fill' : 'stroke';
    var fillStrokeMarkDefAndConfig = tslib_1.__assign({}, (defaultValue.fill
        ? {
            fill: { value: defaultValue.fill }
        }
        : {}), (defaultValue.stroke
        ? {
            stroke: { value: defaultValue.stroke }
        }
        : {}));
    if (encoding.fill || encoding.stroke) {
        // ignore encoding.color, markDef.color, config.color
        if (markDef.color) {
            // warn for markDef.color  (no need to warn encoding.color as it will be dropped in normalized already)
            log.warn(log.message.droppingColor('property', { fill: 'fill' in encoding, stroke: 'stroke' in encoding }));
        }
        return tslib_1.__assign({}, nonPosition('fill', model, { defaultValue: util_1.getFirstDefined(defaultValue.fill, transparentIfNeeded) }), nonPosition('stroke', model, { defaultValue: defaultValue.stroke }));
    }
    else if (encoding.color) {
        return tslib_1.__assign({}, fillStrokeMarkDefAndConfig, nonPosition('color', model, {
            vgChannel: colorVgChannel,
            // apply default fill/stroke first, then color config, then transparent if needed.
            defaultValue: util_1.getFirstDefined(markDef[colorVgChannel], markDef.color, configValue[colorVgChannel], configValue.color, filled ? transparentIfNeeded : undefined)
        }));
    }
    else if (markDef.fill !== undefined || markDef.stroke !== undefined) {
        // Ignore markDef.color, config.color
        if (markDef.color) {
            log.warn(log.message.droppingColor('property', { fill: 'fill' in markDef, stroke: 'stroke' in markDef }));
        }
        return fillStrokeMarkDefAndConfig;
    }
    else if (markDef.color) {
        return tslib_1.__assign({}, fillStrokeMarkDefAndConfig, (_a = {}, _a[colorVgChannel] = { value: markDef.color }, _a));
    }
    else if (configValue.fill !== undefined || configValue.stroke !== undefined) {
        // ignore config.color
        return fillStrokeMarkDefAndConfig;
    }
    else if (configValue.color) {
        return tslib_1.__assign({}, (transparentIfNeeded ? { fill: { value: 'transparent' } } : {}), (_b = {}, _b[colorVgChannel] = { value: configValue.color }, _b));
    }
    return {};
}
exports.color = color;
function baseEncodeEntry(model, ignore) {
    var _a = color(model), fill = _a.fill, stroke = _a.stroke;
    return tslib_1.__assign({}, markDefProperties(model.markDef, ignore), wrapInvalid(model, 'fill', fill), wrapInvalid(model, 'stroke', stroke), nonPosition('opacity', model), tooltip(model), text(model, 'href'));
}
exports.baseEncodeEntry = baseEncodeEntry;
function wrapInvalid(model, channel, valueRef) {
    var _a, _b;
    var config = model.config, mark = model.mark;
    if (config.invalidValues && valueRef && !mark_1.isPathMark(mark)) {
        // For non-path marks, we have to exclude invalid values (null and NaN) for scales with continuous domains.
        // For path marks, we will use "defined" property and skip these values instead.
        var test_1 = validPredicate(model, { invalid: true, channels: channel_1.SCALE_CHANNELS });
        if (test_1) {
            return _a = {},
                _a[channel] = [
                    // prepend the invalid case
                    // TODO: support custom value
                    { test: test_1, value: null }
                ].concat(vega_util_1.array(valueRef)),
                _a;
        }
    }
    return valueRef ? (_b = {}, _b[channel] = valueRef, _b) : {};
}
function markDefProperties(mark, ignore) {
    return vega_schema_1.VG_MARK_CONFIGS.reduce(function (m, prop) {
        if (mark[prop] !== undefined && ignore[prop] !== 'ignore') {
            m[prop] = { value: mark[prop] };
        }
        return m;
    }, {});
}
function valueIfDefined(prop, value) {
    var _a;
    if (value !== undefined) {
        return _a = {}, _a[prop] = { value: value }, _a;
    }
    return undefined;
}
exports.valueIfDefined = valueIfDefined;
function validPredicate(model, _a) {
    var _b = _a.invalid, invalid = _b === void 0 ? false : _b, channels = _a.channels;
    var filterIndex = channels.reduce(function (aggregator, channel) {
        var scaleComponent = model.getScaleComponent(channel);
        if (scaleComponent) {
            var scaleType = scaleComponent.get('type');
            var field = model.vgField(channel, { expr: 'datum' });
            // While discrete domain scales can handle invalid values, continuous scales can't.
            if (field && scale_1.hasContinuousDomain(scaleType)) {
                aggregator[field] = true;
            }
        }
        return aggregator;
    }, {});
    var fields = util_1.keys(filterIndex);
    if (fields.length > 0) {
        var op_1 = invalid ? '||' : '&&';
        return fields
            .map(function (field) {
            var eq = invalid ? '===' : '!==';
            return field + " " + eq + " null " + op_1 + " " + (invalid ? '' : '!') + "isNaN(" + field + ")";
        })
            .join(" " + op_1 + " ");
    }
    return undefined;
}
function defined(model) {
    if (model.config.invalidValues === 'filter') {
        var signal = validPredicate(model, { channels: ['x', 'y'] });
        if (signal) {
            return { defined: { signal: signal } };
        }
    }
    return {};
}
exports.defined = defined;
/**
 * Return mixins for non-positional channels with scales.  (Text doesn't have scale.)
 */
function nonPosition(channel, model, opt) {
    if (opt === void 0) { opt = {}; }
    var defaultValue = opt.defaultValue, vgChannel = opt.vgChannel;
    var defaultRef = opt.defaultRef || (defaultValue !== undefined ? { value: defaultValue } : undefined);
    var channelDef = model.encoding[channel];
    return wrapCondition(model, channelDef, vgChannel || channel, function (cDef) {
        return ref.midPoint(channel, cDef, undefined, model.scaleName(channel), model.getScaleComponent(channel), null, // No need to provide stack for non-position as it does not affect mid point
        defaultRef);
    });
}
exports.nonPosition = nonPosition;
/**
 * Return a mixin that include a Vega production rule for a Vega-Lite conditional channel definition.
 * or a simple mixin if channel def has no condition.
 */
function wrapCondition(model, channelDef, vgChannel, refFn) {
    var _a, _b;
    var condition = channelDef && channelDef.condition;
    var valueRef = refFn(channelDef);
    if (condition) {
        var conditions = vega_util_1.isArray(condition) ? condition : [condition];
        var vgConditions = conditions.map(function (c) {
            var conditionValueRef = refFn(c);
            var test = fielddef_1.isConditionalSelection(c) ? selection_1.selectionPredicate(model, c.selection) : predicate_1.expression(model, c.test);
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
exports.wrapCondition = wrapCondition;
function tooltip(model) {
    var encoding = model.encoding, markDef = model.markDef, config = model.config;
    var channelDef = encoding.tooltip;
    if (vega_util_1.isArray(channelDef)) {
        return { tooltip: ref.tooltipForChannelDefs(channelDef, config) };
    }
    else {
        return wrapCondition(model, channelDef, 'tooltip', function (cDef) {
            // use valueRef based on channelDef first
            var tooltipRefFromChannelDef = ref.text(cDef, model.config);
            if (tooltipRefFromChannelDef) {
                return tooltipRefFromChannelDef;
            }
            // If tooltipDef does not exist, then use value from markDef or config
            var markTooltip = util_1.getFirstDefined(markDef.tooltip, common_1.getMarkConfig('tooltip', markDef, config));
            if (vega_util_1.isString(markTooltip)) {
                return { value: markTooltip };
            }
            else if (vega_util_1.isObject(markTooltip)) {
                // `tooltip` is `{fields: 'encodings' | 'fields'}`
                if (markTooltip.content === 'encoding') {
                    return ref.tooltipForChannelDefs(encoding_1.fieldDefs(encoding), config);
                }
                else {
                    return { signal: 'datum' };
                }
            }
            return undefined;
        });
    }
}
exports.tooltip = tooltip;
function text(model, channel) {
    if (channel === void 0) { channel = 'text'; }
    var channelDef = model.encoding[channel];
    return wrapCondition(model, channelDef, channel, function (cDef) { return ref.text(cDef, model.config); });
}
exports.text = text;
function bandPosition(fieldDef, channel, model) {
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
            if (fielddef_1.getFieldDef(model.encoding.size)) {
                return tslib_1.__assign({}, centeredBandPositionMixins, nonPosition('size', model, { vgChannel: sizeChannel }));
            }
            else if (fielddef_1.isValueDef(model.encoding.size)) {
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
exports.bandPosition = bandPosition;
function centeredBandPosition(channel, model, defaultPosRef, defaultSizeRef) {
    var centerChannel = channel === 'x' ? 'xc' : 'yc';
    var sizeChannel = channel === 'x' ? 'width' : 'height';
    return tslib_1.__assign({}, pointPosition(channel, model, defaultPosRef, centerChannel), nonPosition('size', model, { defaultRef: defaultSizeRef, vgChannel: sizeChannel }));
}
exports.centeredBandPosition = centeredBandPosition;
function binPosition(fieldDef, fieldDef2, channel, scaleName, spacing, reverse) {
    var _a, _b;
    var binSpacing = {
        x: reverse ? spacing : 0,
        x2: reverse ? 0 : spacing,
        y: reverse ? 0 : spacing,
        y2: reverse ? spacing : 0
    };
    var channel2 = channel === channel_1.X ? channel_1.X2 : channel_1.Y2;
    if (bin_1.isBinning(fieldDef.bin)) {
        return _a = {},
            _a[channel2] = ref.bin(fieldDef, scaleName, 'start', binSpacing[channel + "2"]),
            _a[channel] = ref.bin(fieldDef, scaleName, 'end', binSpacing[channel]),
            _a;
    }
    else if (bin_1.isBinned(fieldDef.bin) && fielddef_1.isFieldDef(fieldDef2)) {
        return _b = {},
            _b[channel2] = ref.fieldRef(fieldDef, scaleName, {}, { offset: binSpacing[channel + "2"] }),
            _b[channel] = ref.fieldRef(fieldDef2, scaleName, {}, { offset: binSpacing[channel] }),
            _b;
    }
    else {
        log.warn(log.message.channelRequiredForBinned(channel2));
        return undefined;
    }
}
exports.binPosition = binPosition;
/**
 * Return mixins for point (non-band) position channels.
 */
function pointPosition(channel, model, defaultRef, vgChannel) {
    // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613
    var _a;
    var encoding = model.encoding, mark = model.mark, stack = model.stack;
    var channelDef = encoding[channel];
    var channel2Def = encoding[channel === channel_1.X ? channel_1.X2 : channel_1.Y2];
    var scaleName = model.scaleName(channel);
    var scale = model.getScaleComponent(channel);
    var offset = ref.getOffset(channel, model.markDef);
    var valueRef = !channelDef && (encoding.latitude || encoding.longitude)
        ? // use geopoint output if there are lat/long and there is no point position overriding lat/long.
            { field: model.getName(channel) }
        : tslib_1.__assign({}, ref.position(channel, channelDef, channel2Def, scaleName, scale, stack, ref.getDefaultRef(defaultRef, channel, scaleName, scale, mark)), (offset ? { offset: offset } : {}));
    return _a = {},
        _a[vgChannel || channel] = valueRef,
        _a;
}
exports.pointPosition = pointPosition;
/**
 * Return mixins for x2, y2.
 * If channel is not specified, return one channel based on orientation.
 */
function pointPosition2(model, defaultRef, channel) {
    var _a;
    var encoding = model.encoding, mark = model.mark, stack = model.stack;
    var baseChannel = channel === 'x2' ? 'x' : 'y';
    var channelDef = encoding[baseChannel];
    var scaleName = model.scaleName(baseChannel);
    var scale = model.getScaleComponent(baseChannel);
    var offset = ref.getOffset(channel, model.markDef);
    var valueRef = !channelDef && (encoding.latitude || encoding.longitude)
        ? // use geopoint output if there are lat2/long2 and there is no point position2 overriding lat2/long2.
            { field: model.getName(channel) }
        : tslib_1.__assign({}, ref.position2(channel, channelDef, encoding[channel], scaleName, scale, stack, ref.getDefaultRef(defaultRef, baseChannel, scaleName, scale, mark)), (offset ? { offset: offset } : {}));
    return _a = {}, _a[channel] = valueRef, _a;
}
exports.pointPosition2 = pointPosition2;
//# sourceMappingURL=mixins.js.map