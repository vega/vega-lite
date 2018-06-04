"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var fielddef_1 = require("../../fielddef");
var log = tslib_1.__importStar(require("../../log"));
var predicate_1 = require("../../predicate");
var scale_1 = require("../../scale");
var util_1 = require("../../util");
var vega_schema_1 = require("../../vega.schema");
var common_1 = require("../common");
var selection_1 = require("../selection/selection");
var ref = tslib_1.__importStar(require("./valueref"));
function color(model, opt) {
    var _a, _b;
    if (opt === void 0) { opt = { valueOnly: false }; }
    var markDef = model.markDef, encoding = model.encoding, config = model.config;
    var filled = markDef.filled, markType = markDef.type;
    var configValue = {
        fill: common_1.getMarkConfig('fill', markDef, config),
        stroke: common_1.getMarkConfig('stroke', markDef, config),
        color: common_1.getMarkConfig('color', markDef, config)
    };
    var transparentIfNeeded = util_1.contains(['bar', 'point', 'circle', 'square', 'geoshape'], markType) ? 'transparent' : undefined;
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
exports.color = color;
function baseEncodeEntry(model, ignore) {
    return tslib_1.__assign({}, markDefProperties(model.markDef, ignore), color(model), nonPosition('opacity', model), tooltip(model), text(model, 'href'));
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
    var _a;
    if (value !== undefined) {
        return _a = {}, _a[prop] = { value: value }, _a;
    }
    return undefined;
}
exports.valueIfDefined = valueIfDefined;
function validPredicate(vgRef) {
    return vgRef + " !== null && !isNaN(" + vgRef + ")";
}
function defined(model) {
    if (model.config.invalidValues === 'filter') {
        var fields = ['x', 'y'].map(function (channel) {
            var scaleComponent = model.getScaleComponent(channel);
            if (scaleComponent) {
                var scaleType = scaleComponent.get('type');
                // Discrete domain scales can handle invalid values, but continuous scales can't.
                if (scale_1.hasContinuousDomain(scaleType)) {
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
    var channel = 'tooltip';
    var channelDef = model.encoding[channel];
    if (vega_util_1.isArray(channelDef)) {
        var keyValues = channelDef.map(function (fieldDef) {
            var key = fieldDef.title !== undefined ? fieldDef.title : fielddef_1.vgField(fieldDef, { binSuffix: 'range' });
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
exports.tooltip = tooltip;
function text(model, channel) {
    if (channel === void 0) { channel = 'text'; }
    var channelDef = model.encoding[channel];
    return textCommon(model, channel, channelDef);
}
exports.text = text;
function textCommon(model, channel, channelDef) {
    return wrapCondition(model, channelDef, channel, function (cDef) { return ref.text(cDef, model.config); });
}
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
    var _a;
    var encoding = model.encoding, mark = model.mark, stack = model.stack;
    var channelDef = encoding[channel];
    var scaleName = model.scaleName(channel);
    var scale = model.getScaleComponent(channel);
    var offset = ref.getOffset(channel, model.markDef);
    var valueRef = !channelDef && (encoding.latitude || encoding.longitude) ?
        // use geopoint output if there are lat/long and there is no point position overriding lat/long.
        { field: model.getName(channel) } : tslib_1.__assign({}, ref.stackable(channel, encoding[channel], scaleName, scale, stack, ref.getDefaultRef(defaultRef, channel, scaleName, scale, mark)), (offset ? { offset: offset } : {}));
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
    var valueRef = !channelDef && (encoding.latitude || encoding.longitude) ?
        // use geopoint output if there are lat2/long2 and there is no point position2 overriding lat2/long2.
        { field: model.getName(channel) } : tslib_1.__assign({}, ref.stackable2(channel, channelDef, encoding[channel], scaleName, scale, stack, ref.getDefaultRef(defaultRef, baseChannel, scaleName, scale, mark)), (offset ? { offset: offset } : {}));
    return _a = {}, _a[channel] = valueRef, _a;
}
exports.pointPosition2 = pointPosition2;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4aW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvbWFyay9taXhpbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsdUNBQWtDO0FBR2xDLDJDQVV3QjtBQUN4QixxREFBaUM7QUFFakMsNkNBQTJDO0FBQzNDLHFDQUFnRDtBQUNoRCxtQ0FBb0M7QUFDcEMsaURBQTZFO0FBQzdFLG9DQUF3QztBQUN4QyxvREFBMEQ7QUFFMUQsc0RBQWtDO0FBRWxDLGVBQXNCLEtBQWdCLEVBQUUsR0FBOEM7O0lBQTlDLG9CQUFBLEVBQUEsUUFBNkIsU0FBUyxFQUFFLEtBQUssRUFBQztJQUM3RSxJQUFBLHVCQUFPLEVBQUUseUJBQVEsRUFBRSxxQkFBTSxDQUFVO0lBQ25DLElBQUEsdUJBQU0sRUFBRSx1QkFBYyxDQUFZO0lBRXpDLElBQU0sV0FBVyxHQUFHO1FBQ2xCLElBQUksRUFBRSxzQkFBYSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDO1FBQzVDLE1BQU0sRUFBRSxzQkFBYSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDO1FBQ2hELEtBQUssRUFBRSxzQkFBYSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDO0tBQy9DLENBQUM7SUFFRixJQUFNLG1CQUFtQixHQUFHLGVBQVEsQ0FBQyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxVQUFVLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFFN0gsSUFBTSxZQUFZLEdBQUc7UUFDbkIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLElBQUksV0FBVyxDQUFDLElBQUk7WUFDdEMsMERBQTBEO1lBQzFELHVFQUF1RTtZQUNyRSxtQkFBbUI7UUFDckIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLElB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Tk9OUE9TSVRJT05fU0NBTEVfQ0hBTk5FTFMsIFBvc2l0aW9uU2NhbGVDaGFubmVsfSBmcm9tICcuLi8uLi9jaGFubmVsJztcbmltcG9ydCB7XG4gIENoYW5uZWxEZWYsXG4gIEZpZWxkRGVmLFxuICBGaWVsZERlZldpdGhDb25kaXRpb24sXG4gIGdldEZpZWxkRGVmLFxuICBpc0NvbmRpdGlvbmFsU2VsZWN0aW9uLFxuICBpc1ZhbHVlRGVmLFxuICBUZXh0RmllbGREZWYsXG4gIFZhbHVlRGVmV2l0aENvbmRpdGlvbixcbiAgdmdGaWVsZCxcbn0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL2xvZyc7XG5pbXBvcnQge01hcmtEZWZ9IGZyb20gJy4uLy4uL21hcmsnO1xuaW1wb3J0IHtleHByZXNzaW9ufSBmcm9tICcuLi8uLi9wcmVkaWNhdGUnO1xuaW1wb3J0IHtoYXNDb250aW51b3VzRG9tYWlufSBmcm9tICcuLi8uLi9zY2FsZSc7XG5pbXBvcnQge2NvbnRhaW5zfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VkdfTUFSS19DT05GSUdTLCBWZ0VuY29kZUVudHJ5LCBWZ1ZhbHVlUmVmfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2dldE1hcmtDb25maWd9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge3NlbGVjdGlvblByZWRpY2F0ZX0gZnJvbSAnLi4vc2VsZWN0aW9uL3NlbGVjdGlvbic7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQgKiBhcyByZWYgZnJvbSAnLi92YWx1ZXJlZic7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb2xvcihtb2RlbDogVW5pdE1vZGVsLCBvcHQ6IHt2YWx1ZU9ubHk6IGJvb2xlYW59ID0ge3ZhbHVlT25seTogZmFsc2V9KTogVmdFbmNvZGVFbnRyeSB7XG4gIGNvbnN0IHttYXJrRGVmLCBlbmNvZGluZywgY29uZmlnfSA9IG1vZGVsO1xuICBjb25zdCB7ZmlsbGVkLCB0eXBlOiBtYXJrVHlwZX0gPSBtYXJrRGVmO1xuXG4gIGNvbnN0IGNvbmZpZ1ZhbHVlID0ge1xuICAgIGZpbGw6IGdldE1hcmtDb25maWcoJ2ZpbGwnLCBtYXJrRGVmLCBjb25maWcpLFxuICAgIHN0cm9rZTogZ2V0TWFya0NvbmZpZygnc3Ryb2tlJywgbWFya0RlZiwgY29uZmlnKSxcbiAgICBjb2xvcjogZ2V0TWFya0NvbmZpZygnY29sb3InLCBtYXJrRGVmLCBjb25maWcpXG4gIH07XG5cbiAgY29uc3QgdHJhbnNwYXJlbnRJZk5lZWRlZCA9IGNvbnRhaW5zKFsnYmFyJywgJ3BvaW50JywgJ2NpcmNsZScsICdzcXVhcmUnLCAnZ2Vvc2hhcGUnXSwgbWFya1R5cGUpID8gJ3RyYW5zcGFyZW50JyA6IHVuZGVmaW5lZDtcblxuICBjb25zdCBkZWZhdWx0VmFsdWUgPSB7XG4gICAgZmlsbDogbWFya0RlZi5maWxsIHx8IGNvbmZpZ1ZhbHVlLmZpbGwgfHxcbiAgICAvLyBJZiB0aGVyZSBpcyBubyBmaWxsLCBhbHdheXMgZmlsbCBzeW1ib2xzLCBiYXIsIGdlb3NoYXBlXG4gICAgLy8gd2l0aCB0cmFuc3BhcmVudCBmaWxscyBodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLWxpdGUvaXNzdWVzLzEzMTZcbiAgICAgIHRyYW5zcGFyZW50SWZOZWVkZWQsXG4gICAgc3Ryb2tlOiBtYXJrRGVmLnN0cm9rZSB8fCBjb25maWdWYWx1ZS5zdHJva2VcbiAgfTtcblxuICBjb25zdCBjb2xvclZnQ2hhbm5lbCA9IGZpbGxlZCA/ICdmaWxsJyA6ICdzdHJva2UnO1xuXG4gIGNvbnN0IGZpbGxTdHJva2VNYXJrRGVmQW5kQ29uZmlnOiBWZ0VuY29kZUVudHJ5ID0ge1xuICAgIC4uLihkZWZhdWx0VmFsdWUuZmlsbCA/IHtcbiAgICAgIGZpbGw6IHt2YWx1ZTogZGVmYXVsdFZhbHVlLmZpbGx9XG4gICAgfSA6IHt9KSxcbiAgICAuLi4oZGVmYXVsdFZhbHVlLnN0cm9rZSA/IHtcbiAgICAgIHN0cm9rZToge3ZhbHVlOiBkZWZhdWx0VmFsdWUuc3Ryb2tlfVxuICAgIH0gOiB7fSksXG4gIH07XG5cbiAgaWYgKGVuY29kaW5nLmZpbGwgfHwgZW5jb2Rpbmcuc3Ryb2tlKSB7XG4gICAgLy8gaWdub3JlIGVuY29kaW5nLmNvbG9yLCBtYXJrRGVmLmNvbG9yLCBjb25maWcuY29sb3JcbiAgICBpZiAobWFya0RlZi5jb2xvcikge1xuICAgICAgLy8gd2FybiBmb3IgbWFya0RlZi5jb2xvciAgKG5vIG5lZWQgdG8gd2FybiBlbmNvZGluZy5jb2xvciBhcyBpdCB3aWxsIGJlIGRyb3BwZWQgaW4gbm9ybWFsaXplZCBhbHJlYWR5KVxuICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuZHJvcHBpbmdDb2xvcigncHJvcGVydHknLCB7ZmlsbDogJ2ZpbGwnIGluIGVuY29kaW5nLCBzdHJva2U6ICdzdHJva2UnIGluIGVuY29kaW5nfSkpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAuLi5ub25Qb3NpdGlvbignZmlsbCcsIG1vZGVsLCB7ZGVmYXVsdFZhbHVlOiBkZWZhdWx0VmFsdWUuZmlsbCB8fCB0cmFuc3BhcmVudElmTmVlZGVkfSksXG4gICAgICAuLi5ub25Qb3NpdGlvbignc3Ryb2tlJywgbW9kZWwsIHtkZWZhdWx0VmFsdWU6IGRlZmF1bHRWYWx1ZS5zdHJva2V9KVxuICAgIH07XG4gIH0gZWxzZSBpZiAoZW5jb2RpbmcuY29sb3IpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi5maWxsU3Ryb2tlTWFya0RlZkFuZENvbmZpZyxcbiAgICAgIC8vIG92ZXJyaWRlIHRoZW0gd2l0aCBlbmNvZGVkIGNvbG9yIGZpZWxkXG4gICAgICAuLi5ub25Qb3NpdGlvbignY29sb3InLCBtb2RlbCwge1xuICAgICAgICB2Z0NoYW5uZWw6IGNvbG9yVmdDaGFubmVsLFxuICAgICAgICAvLyBhcHBseSBkZWZhdWx0IGZpbGwvc3Ryb2tlIGZpcnN0LCB0aGVuIGNvbG9yIGNvbmZpZywgdGhlbiB0cmFuc3BhcmVudCBpZiBuZWVkZWQuXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogbWFya0RlZltjb2xvclZnQ2hhbm5lbF0gfHwgbWFya0RlZi5jb2xvciB8fCBjb25maWdWYWx1ZVtjb2xvclZnQ2hhbm5lbF0gfHwgY29uZmlnVmFsdWUuY29sb3IgfHwgKGZpbGxlZCA/IHRyYW5zcGFyZW50SWZOZWVkZWQgOiB1bmRlZmluZWQpXG4gICAgICB9KVxuICAgIH07XG4gIH0gZWxzZSBpZiAobWFya0RlZi5maWxsIHx8IG1hcmtEZWYuc3Ryb2tlKSB7XG4gICAgLy8gSWdub3JlIG1hcmtEZWYuY29sb3IsIGNvbmZpZy5jb2xvclxuICAgIGlmIChtYXJrRGVmLmNvbG9yKSB7XG4gICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5kcm9wcGluZ0NvbG9yKCdwcm9wZXJ0eScsIHtmaWxsOiAnZmlsbCcgaW4gbWFya0RlZiwgc3Ryb2tlOiAnc3Ryb2tlJyBpbiBtYXJrRGVmfSkpO1xuICAgIH1cbiAgICByZXR1cm4gZmlsbFN0cm9rZU1hcmtEZWZBbmRDb25maWc7XG4gIH0gZWxzZSBpZiAobWFya0RlZi5jb2xvcikge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5maWxsU3Ryb2tlTWFya0RlZkFuZENvbmZpZywgLy8gaW4gdGhpcyBjYXNlLCBmaWxsU3Ryb2tlTWFya0RlZkFuZENvbmZpZyBvbmx5IGluY2x1ZGUgY29uZmlnXG5cbiAgICAgIC8vIG92ZXJyaWRlIGNvbmZpZyB3aXRoIG1hcmtEZWYuY29sb3JcbiAgICAgIFtjb2xvclZnQ2hhbm5lbF06IHt2YWx1ZTogbWFya0RlZi5jb2xvcn1cbiAgICB9O1xuICB9IGVsc2UgaWYgKGNvbmZpZ1ZhbHVlLmZpbGwgfHwgY29uZmlnVmFsdWUuc3Ryb2tlKSB7XG4gICAgLy8gaWdub3JlIGNvbmZpZy5jb2xvclxuICAgIHJldHVybiBmaWxsU3Ryb2tlTWFya0RlZkFuZENvbmZpZztcbiAgfSBlbHNlIGlmIChjb25maWdWYWx1ZS5jb2xvcikge1xuICAgIHJldHVybiB7XG4gICAgICAuLi4odHJhbnNwYXJlbnRJZk5lZWRlZCA/IHtmaWxsOiB7dmFsdWU6ICd0cmFuc3BhcmVudCd9fSA6IHt9KSxcbiAgICAgIFtjb2xvclZnQ2hhbm5lbF06IHt2YWx1ZTogY29uZmlnVmFsdWUuY29sb3J9XG4gICAgfTtcbiAgfVxuICByZXR1cm4ge307XG59XG5cbmV4cG9ydCB0eXBlIElnbm9yZSA9IFJlY29yZDwnc2l6ZScgfCAnb3JpZW50JywgJ2lnbm9yZScgfCAnaW5jbHVkZSc+O1xuXG5leHBvcnQgZnVuY3Rpb24gYmFzZUVuY29kZUVudHJ5KG1vZGVsOiBVbml0TW9kZWwsIGlnbm9yZTogSWdub3JlKSB7XG4gIHJldHVybiB7XG4gICAgLi4ubWFya0RlZlByb3BlcnRpZXMobW9kZWwubWFya0RlZiwgaWdub3JlKSxcbiAgICAuLi5jb2xvcihtb2RlbCksXG4gICAgLi4ubm9uUG9zaXRpb24oJ29wYWNpdHknLCBtb2RlbCksXG4gICAgLi4udG9vbHRpcChtb2RlbCksXG4gICAgLi4udGV4dChtb2RlbCwgJ2hyZWYnKVxuICB9O1xufVxuXG5mdW5jdGlvbiBtYXJrRGVmUHJvcGVydGllcyhtYXJrOiBNYXJrRGVmLCBpZ25vcmU6IElnbm9yZSkge1xuICByZXR1cm4gVkdfTUFSS19DT05GSUdTLnJlZHVjZSgobSwgcHJvcCkgPT4ge1xuICAgIGlmIChtYXJrW3Byb3BdICE9PSB1bmRlZmluZWQgJiYgaWdub3JlW3Byb3BdICE9PSAnaWdub3JlJykge1xuICAgICAgbVtwcm9wXSA9IHt2YWx1ZTogbWFya1twcm9wXX07XG4gICAgfVxuICAgIHJldHVybiBtO1xuICB9LCB7fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZUlmRGVmaW5lZChwcm9wOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuKTogVmdFbmNvZGVFbnRyeSB7XG4gIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHtbcHJvcF06IHt2YWx1ZTogdmFsdWV9fTtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiB2YWxpZFByZWRpY2F0ZSh2Z1JlZjogc3RyaW5nKSB7XG4gIHJldHVybiBgJHt2Z1JlZn0gIT09IG51bGwgJiYgIWlzTmFOKCR7dmdSZWZ9KWA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZpbmVkKG1vZGVsOiBVbml0TW9kZWwpOiBWZ0VuY29kZUVudHJ5IHtcbiAgaWYgKG1vZGVsLmNvbmZpZy5pbnZhbGlkVmFsdWVzID09PSAnZmlsdGVyJykge1xuICAgIGNvbnN0IGZpZWxkcyA9IFsneCcsICd5J10ubWFwKChjaGFubmVsOiBQb3NpdGlvblNjYWxlQ2hhbm5lbCkgPT4ge1xuICAgICAgICBjb25zdCBzY2FsZUNvbXBvbmVudCA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpO1xuICAgICAgICBpZiAoc2NhbGVDb21wb25lbnQpIHtcbiAgICAgICAgICBjb25zdCBzY2FsZVR5cGUgPSBzY2FsZUNvbXBvbmVudC5nZXQoJ3R5cGUnKTtcblxuICAgICAgICAgIC8vIERpc2NyZXRlIGRvbWFpbiBzY2FsZXMgY2FuIGhhbmRsZSBpbnZhbGlkIHZhbHVlcywgYnV0IGNvbnRpbnVvdXMgc2NhbGVzIGNhbid0LlxuICAgICAgICAgIGlmIChoYXNDb250aW51b3VzRG9tYWluKHNjYWxlVHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBtb2RlbC52Z0ZpZWxkKGNoYW5uZWwsIHtleHByOiAnZGF0dW0nfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9KVxuICAgICAgLmZpbHRlcihmaWVsZCA9PiAhIWZpZWxkKVxuICAgICAgLm1hcCh2YWxpZFByZWRpY2F0ZSk7XG5cbiAgICBpZiAoZmllbGRzLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGRlZmluZWQ6IHtzaWduYWw6IGZpZWxkcy5qb2luKCcgJiYgJyl9XG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7fTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gbWl4aW5zIGZvciBub24tcG9zaXRpb25hbCBjaGFubmVscyB3aXRoIHNjYWxlcy4gIChUZXh0IGRvZXNuJ3QgaGF2ZSBzY2FsZS4pXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub25Qb3NpdGlvbihjaGFubmVsOiB0eXBlb2YgTk9OUE9TSVRJT05fU0NBTEVfQ0hBTk5FTFNbMF0sIG1vZGVsOiBVbml0TW9kZWwsIG9wdDoge2RlZmF1bHRWYWx1ZT86IG51bWJlciB8IHN0cmluZyB8IGJvb2xlYW4sIHZnQ2hhbm5lbD86IHN0cmluZywgZGVmYXVsdFJlZj86IFZnVmFsdWVSZWZ9ID0ge30pOiBWZ0VuY29kZUVudHJ5IHtcbiAgY29uc3Qge2RlZmF1bHRWYWx1ZSwgdmdDaGFubmVsfSA9IG9wdDtcbiAgY29uc3QgZGVmYXVsdFJlZiA9IG9wdC5kZWZhdWx0UmVmIHx8IChkZWZhdWx0VmFsdWUgIT09IHVuZGVmaW5lZCA/IHt2YWx1ZTogZGVmYXVsdFZhbHVlfSA6IHVuZGVmaW5lZCk7XG5cbiAgY29uc3QgY2hhbm5lbERlZiA9IG1vZGVsLmVuY29kaW5nW2NoYW5uZWxdO1xuXG4gIHJldHVybiB3cmFwQ29uZGl0aW9uKG1vZGVsLCBjaGFubmVsRGVmLCB2Z0NoYW5uZWwgfHwgY2hhbm5lbCwgKGNEZWYpID0+IHtcbiAgICByZXR1cm4gcmVmLm1pZFBvaW50KFxuICAgICAgY2hhbm5lbCwgY0RlZiwgbW9kZWwuc2NhbGVOYW1lKGNoYW5uZWwpLFxuICAgICAgbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCksXG4gICAgICBudWxsLCAvLyBObyBuZWVkIHRvIHByb3ZpZGUgc3RhY2sgZm9yIG5vbi1wb3NpdGlvbiBhcyBpdCBkb2VzIG5vdCBhZmZlY3QgbWlkIHBvaW50XG4gICAgICBkZWZhdWx0UmVmXG4gICAgKTtcbiAgfSk7XG59XG5cbi8qKlxuICogUmV0dXJuIGEgbWl4aW4gdGhhdCBpbmNsdWRlIGEgVmVnYSBwcm9kdWN0aW9uIHJ1bGUgZm9yIGEgVmVnYS1MaXRlIGNvbmRpdGlvbmFsIGNoYW5uZWwgZGVmaW5pdGlvbi5cbiAqIG9yIGEgc2ltcGxlIG1peGluIGlmIGNoYW5uZWwgZGVmIGhhcyBubyBjb25kaXRpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3cmFwQ29uZGl0aW9uKFxuICAgIG1vZGVsOiBVbml0TW9kZWwsIGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8c3RyaW5nPiwgdmdDaGFubmVsOiBzdHJpbmcsXG4gICAgcmVmRm46IChjRGVmOiBDaGFubmVsRGVmPHN0cmluZz4pID0+IFZnVmFsdWVSZWZcbiAgKTogVmdFbmNvZGVFbnRyeSB7XG4gIGNvbnN0IGNvbmRpdGlvbiA9IGNoYW5uZWxEZWYgJiYgY2hhbm5lbERlZi5jb25kaXRpb247XG4gIGNvbnN0IHZhbHVlUmVmID0gcmVmRm4oY2hhbm5lbERlZik7XG4gIGlmIChjb25kaXRpb24pIHtcbiAgICBjb25zdCBjb25kaXRpb25zID0gaXNBcnJheShjb25kaXRpb24pID8gY29uZGl0aW9uIDogW2NvbmRpdGlvbl07XG4gICAgY29uc3QgdmdDb25kaXRpb25zID0gY29uZGl0aW9ucy5tYXAoKGMpID0+IHtcbiAgICAgIGNvbnN0IGNvbmRpdGlvblZhbHVlUmVmID0gcmVmRm4oYyk7XG4gICAgICBjb25zdCB0ZXN0ID0gaXNDb25kaXRpb25hbFNlbGVjdGlvbihjKSA/IHNlbGVjdGlvblByZWRpY2F0ZShtb2RlbCwgYy5zZWxlY3Rpb24pIDogZXhwcmVzc2lvbihtb2RlbCwgYy50ZXN0KTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRlc3QsXG4gICAgICAgIC4uLmNvbmRpdGlvblZhbHVlUmVmXG4gICAgICB9O1xuICAgIH0pO1xuICAgIHJldHVybiB7XG4gICAgICBbdmdDaGFubmVsXTogW1xuICAgICAgICAuLi52Z0NvbmRpdGlvbnMsXG4gICAgICAgIC4uLih2YWx1ZVJlZiAhPT0gdW5kZWZpbmVkID8gW3ZhbHVlUmVmXSA6IFtdKVxuICAgICAgXVxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHZhbHVlUmVmICE9PSB1bmRlZmluZWQgPyB7W3ZnQ2hhbm5lbF06IHZhbHVlUmVmfSA6IHt9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b29sdGlwKG1vZGVsOiBVbml0TW9kZWwpIHtcbiAgY29uc3QgY2hhbm5lbCA9ICd0b29sdGlwJztcbiAgY29uc3QgY2hhbm5lbERlZiA9IG1vZGVsLmVuY29kaW5nW2NoYW5uZWxdO1xuICBpZiAoaXNBcnJheShjaGFubmVsRGVmKSkge1xuICAgIGNvbnN0IGtleVZhbHVlcyA9IGNoYW5uZWxEZWYubWFwKChmaWVsZERlZikgPT4ge1xuICAgICAgY29uc3Qga2V5ID0gZmllbGREZWYudGl0bGUgIT09IHVuZGVmaW5lZCA/IGZpZWxkRGVmLnRpdGxlIDogdmdGaWVsZChmaWVsZERlZiwge2JpblN1ZmZpeDogJ3JhbmdlJ30pO1xuICAgICAgY29uc3QgdmFsdWUgPSByZWYudGV4dChmaWVsZERlZiwgbW9kZWwuY29uZmlnKS5zaWduYWw7XG4gICAgICByZXR1cm4gYFwiJHtrZXl9XCI6ICR7dmFsdWV9YDtcbiAgICB9KTtcbiAgICByZXR1cm4ge3Rvb2x0aXA6IHtzaWduYWw6IGB7JHtrZXlWYWx1ZXMuam9pbignLCAnKX19YH19O1xuICB9IGVsc2Uge1xuICAgIC8vIGlmIG5vdCBhbiBhcnJheSwgYmVoYXZlIGp1c3QgbGlrZSB0ZXh0XG4gICAgcmV0dXJuIHRleHRDb21tb24obW9kZWwsIGNoYW5uZWwsIGNoYW5uZWxEZWYpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXh0KG1vZGVsOiBVbml0TW9kZWwsIGNoYW5uZWw6ICd0ZXh0JyB8ICdocmVmJyA9ICd0ZXh0Jykge1xuICBjb25zdCBjaGFubmVsRGVmID0gbW9kZWwuZW5jb2RpbmdbY2hhbm5lbF07XG4gIHJldHVybiB0ZXh0Q29tbW9uKG1vZGVsLCBjaGFubmVsLCBjaGFubmVsRGVmKTtcbn1cblxuZnVuY3Rpb24gdGV4dENvbW1vbihtb2RlbDogVW5pdE1vZGVsLCBjaGFubmVsOiAndGV4dCcgfCAnaHJlZicgfCAndG9vbHRpcCcsIGNoYW5uZWxEZWY6IEZpZWxkRGVmV2l0aENvbmRpdGlvbjxUZXh0RmllbGREZWY8c3RyaW5nPj4gfCBWYWx1ZURlZldpdGhDb25kaXRpb248VGV4dEZpZWxkRGVmPHN0cmluZz4+KSB7XG4gIHJldHVybiB3cmFwQ29uZGl0aW9uKG1vZGVsLCBjaGFubmVsRGVmLCBjaGFubmVsLCAoY0RlZikgPT4gcmVmLnRleHQoY0RlZiwgbW9kZWwuY29uZmlnKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiYW5kUG9zaXRpb24oZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIGNoYW5uZWw6ICd4J3wneScsIG1vZGVsOiBVbml0TW9kZWwpIHtcbiAgY29uc3Qgc2NhbGVOYW1lID0gbW9kZWwuc2NhbGVOYW1lKGNoYW5uZWwpO1xuICBjb25zdCBzaXplQ2hhbm5lbCA9IGNoYW5uZWwgPT09ICd4JyA/ICd3aWR0aCcgOiAnaGVpZ2h0JztcblxuICBpZiAobW9kZWwuZW5jb2Rpbmcuc2l6ZSB8fCBtb2RlbC5tYXJrRGVmLnNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IG9yaWVudCA9IG1vZGVsLm1hcmtEZWYub3JpZW50O1xuICAgIGlmIChvcmllbnQpIHtcbiAgICAgIGNvbnN0IGNlbnRlcmVkQmFuZFBvc2l0aW9uTWl4aW5zID0ge1xuICAgICAgICAvLyBVc2UgeGMveWMgYW5kIHBsYWNlIHRoZSBtYXJrIGF0IHRoZSBtaWRkbGUgb2YgdGhlIGJhbmRcbiAgICAgICAgLy8gVGhpcyB3YXkgd2UgbmV2ZXIgaGF2ZSB0byBkZWFsIHdpdGggc2l6ZSdzIGNvbmRpdGlvbiBmb3IgeC95IHBvc2l0aW9uLlxuICAgICAgICBbY2hhbm5lbCsnYyddOiByZWYuZmllbGRSZWYoZmllbGREZWYsIHNjYWxlTmFtZSwge30sIHtiYW5kOiAwLjV9KVxuICAgICAgfTtcblxuICAgICAgaWYgKGdldEZpZWxkRGVmKG1vZGVsLmVuY29kaW5nLnNpemUpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uY2VudGVyZWRCYW5kUG9zaXRpb25NaXhpbnMsXG4gICAgICAgICAgLi4ubm9uUG9zaXRpb24oJ3NpemUnLCBtb2RlbCwge3ZnQ2hhbm5lbDogc2l6ZUNoYW5uZWx9KVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIGlmIChpc1ZhbHVlRGVmKG1vZGVsLmVuY29kaW5nLnNpemUpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uY2VudGVyZWRCYW5kUG9zaXRpb25NaXhpbnMsXG4gICAgICAgICAgLi4ubm9uUG9zaXRpb24oJ3NpemUnLCBtb2RlbCwge3ZnQ2hhbm5lbDogc2l6ZUNoYW5uZWx9KVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIGlmIChtb2RlbC5tYXJrRGVmLnNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLmNlbnRlcmVkQmFuZFBvc2l0aW9uTWl4aW5zLFxuICAgICAgICAgIFtzaXplQ2hhbm5lbF06IHt2YWx1ZTogbW9kZWwubWFya0RlZi5zaXplfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5jYW5ub3RBcHBseVNpemVUb05vbk9yaWVudGVkTWFyayhtb2RlbC5tYXJrRGVmLnR5cGUpKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBbY2hhbm5lbF06IHJlZi5maWVsZFJlZihmaWVsZERlZiwgc2NhbGVOYW1lLCB7YmluU3VmZml4OiAncmFuZ2UnfSksXG4gICAgW3NpemVDaGFubmVsXTogcmVmLmJhbmRSZWYoc2NhbGVOYW1lKVxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2VudGVyZWRCYW5kUG9zaXRpb24oY2hhbm5lbDogJ3gnIHwgJ3knLCBtb2RlbDogVW5pdE1vZGVsLCBkZWZhdWx0UG9zUmVmOiBWZ1ZhbHVlUmVmLCBkZWZhdWx0U2l6ZVJlZjogVmdWYWx1ZVJlZikge1xuICBjb25zdCBjZW50ZXJDaGFubmVsOiAneGMnIHwgJ3ljJyA9IGNoYW5uZWwgPT09ICd4JyA/ICd4YycgOiAneWMnO1xuICBjb25zdCBzaXplQ2hhbm5lbCA9IGNoYW5uZWwgPT09ICd4JyA/ICd3aWR0aCcgOiAnaGVpZ2h0JztcbiAgcmV0dXJuIHtcbiAgICAuLi5wb2ludFBvc2l0aW9uKGNoYW5uZWwsIG1vZGVsLCBkZWZhdWx0UG9zUmVmLCBjZW50ZXJDaGFubmVsKSxcbiAgICAuLi5ub25Qb3NpdGlvbignc2l6ZScsIG1vZGVsLCB7ZGVmYXVsdFJlZjogZGVmYXVsdFNpemVSZWYsIHZnQ2hhbm5lbDogc2l6ZUNoYW5uZWx9KVxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmlubmVkUG9zaXRpb24oZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIGNoYW5uZWw6ICd4J3wneScsIHNjYWxlTmFtZTogc3RyaW5nLCBzcGFjaW5nOiBudW1iZXIsIHJldmVyc2U6IGJvb2xlYW4pIHtcbiAgaWYgKGNoYW5uZWwgPT09ICd4Jykge1xuICAgIHJldHVybiB7XG4gICAgICB4MjogcmVmLmJpbihmaWVsZERlZiwgc2NhbGVOYW1lLCAnc3RhcnQnLCByZXZlcnNlID8gMCA6IHNwYWNpbmcpLFxuICAgICAgeDogcmVmLmJpbihmaWVsZERlZiwgc2NhbGVOYW1lLCAnZW5kJywgcmV2ZXJzZSA/IHNwYWNpbmcgOiAwKVxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHkyOiByZWYuYmluKGZpZWxkRGVmLCBzY2FsZU5hbWUsICdzdGFydCcsIHJldmVyc2UgPyBzcGFjaW5nIDogMCksXG4gICAgICB5OiByZWYuYmluKGZpZWxkRGVmLCBzY2FsZU5hbWUsICdlbmQnLCByZXZlcnNlID8gMCA6IHNwYWNpbmcpXG4gICAgfTtcbiAgfVxufVxuXG5cbi8qKlxuICogUmV0dXJuIG1peGlucyBmb3IgcG9pbnQgKG5vbi1iYW5kKSBwb3NpdGlvbiBjaGFubmVscy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBvaW50UG9zaXRpb24oY2hhbm5lbDogJ3gnfCd5JywgbW9kZWw6IFVuaXRNb2RlbCwgZGVmYXVsdFJlZjogVmdWYWx1ZVJlZiB8ICd6ZXJvT3JNaW4nIHwgJ3plcm9Pck1heCcsIHZnQ2hhbm5lbD86ICd4J3wneSd8J3hjJ3wneWMnKSB7XG4gIC8vIFRPRE86IHJlZmFjdG9yIGhvdyByZWZlciB0byBzY2FsZSBhcyBkaXNjdXNzZWQgaW4gaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL3B1bGwvMTYxM1xuXG4gIGNvbnN0IHtlbmNvZGluZywgbWFyaywgc3RhY2t9ID0gbW9kZWw7XG5cbiAgY29uc3QgY2hhbm5lbERlZiA9IGVuY29kaW5nW2NoYW5uZWxdO1xuICBjb25zdCBzY2FsZU5hbWUgPSBtb2RlbC5zY2FsZU5hbWUoY2hhbm5lbCk7XG4gIGNvbnN0IHNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCk7XG5cblxuICBjb25zdCBvZmZzZXQgPSByZWYuZ2V0T2Zmc2V0KGNoYW5uZWwsIG1vZGVsLm1hcmtEZWYpO1xuXG5cbiAgY29uc3QgdmFsdWVSZWYgPSAhY2hhbm5lbERlZiAmJiAoZW5jb2RpbmcubGF0aXR1ZGUgfHwgZW5jb2RpbmcubG9uZ2l0dWRlKSA/XG4gICAgLy8gdXNlIGdlb3BvaW50IG91dHB1dCBpZiB0aGVyZSBhcmUgbGF0L2xvbmcgYW5kIHRoZXJlIGlzIG5vIHBvaW50IHBvc2l0aW9uIG92ZXJyaWRpbmcgbGF0L2xvbmcuXG4gICAge2ZpZWxkOiBtb2RlbC5nZXROYW1lKGNoYW5uZWwpfSA6XG4gICAge1xuICAgICAgLi4ucmVmLnN0YWNrYWJsZShjaGFubmVsLCBlbmNvZGluZ1tjaGFubmVsXSwgc2NhbGVOYW1lLCBzY2FsZSwgc3RhY2ssXG4gICAgICAgIHJlZi5nZXREZWZhdWx0UmVmKGRlZmF1bHRSZWYsIGNoYW5uZWwsIHNjYWxlTmFtZSwgc2NhbGUsIG1hcmspXG4gICAgICApLFxuICAgICAuLi4ob2Zmc2V0ID8ge29mZnNldH06IHt9KVxuICAgIH07XG5cbiAgcmV0dXJuIHtcbiAgICBbdmdDaGFubmVsIHx8IGNoYW5uZWxdOiB2YWx1ZVJlZlxuICB9O1xufVxuXG4vKipcbiAqIFJldHVybiBtaXhpbnMgZm9yIHgyLCB5Mi5cbiAqIElmIGNoYW5uZWwgaXMgbm90IHNwZWNpZmllZCwgcmV0dXJuIG9uZSBjaGFubmVsIGJhc2VkIG9uIG9yaWVudGF0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcG9pbnRQb3NpdGlvbjIobW9kZWw6IFVuaXRNb2RlbCwgZGVmYXVsdFJlZjogJ3plcm9Pck1pbicgfCAnemVyb09yTWF4JywgY2hhbm5lbDogJ3gyJyB8ICd5MicpIHtcbiAgY29uc3Qge2VuY29kaW5nLCBtYXJrLCBzdGFja30gPSBtb2RlbDtcblxuICBjb25zdCBiYXNlQ2hhbm5lbCA9IGNoYW5uZWwgPT09ICd4MicgPyAneCcgOiAneSc7XG4gIGNvbnN0IGNoYW5uZWxEZWYgPSBlbmNvZGluZ1tiYXNlQ2hhbm5lbF07XG4gIGNvbnN0IHNjYWxlTmFtZSA9IG1vZGVsLnNjYWxlTmFtZShiYXNlQ2hhbm5lbCk7XG4gIGNvbnN0IHNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoYmFzZUNoYW5uZWwpO1xuXG4gIGNvbnN0IG9mZnNldCA9IHJlZi5nZXRPZmZzZXQoY2hhbm5lbCwgbW9kZWwubWFya0RlZik7XG5cbiAgY29uc3QgdmFsdWVSZWYgPSAhY2hhbm5lbERlZiAmJiAoZW5jb2RpbmcubGF0aXR1ZGUgfHwgZW5jb2RpbmcubG9uZ2l0dWRlKSA/XG4gICAgLy8gdXNlIGdlb3BvaW50IG91dHB1dCBpZiB0aGVyZSBhcmUgbGF0Mi9sb25nMiBhbmQgdGhlcmUgaXMgbm8gcG9pbnQgcG9zaXRpb24yIG92ZXJyaWRpbmcgbGF0Mi9sb25nMi5cbiAgICB7ZmllbGQ6IG1vZGVsLmdldE5hbWUoY2hhbm5lbCl9OlxuICAgIHtcbiAgICAgIC4uLnJlZi5zdGFja2FibGUyKGNoYW5uZWwsIGNoYW5uZWxEZWYsIGVuY29kaW5nW2NoYW5uZWxdLCBzY2FsZU5hbWUsIHNjYWxlLCBzdGFjayxcbiAgICAgICAgcmVmLmdldERlZmF1bHRSZWYoZGVmYXVsdFJlZiwgYmFzZUNoYW5uZWwsIHNjYWxlTmFtZSwgc2NhbGUsIG1hcmspXG4gICAgICApLFxuICAgICAgLi4uKG9mZnNldCA/IHtvZmZzZXR9IDoge30pXG4gICAgfTtcblxuICByZXR1cm4ge1tjaGFubmVsXTogdmFsdWVSZWZ9O1xufVxuIl19