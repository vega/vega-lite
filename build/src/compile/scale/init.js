"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../../log");
var scale_1 = require("../../scale");
var util = require("../../util");
var domain_1 = require("./domain");
var range_1 = require("./range");
var rules = require("./rules");
var type_1 = require("./type");
/**
 * All scale properties except type and all range properties.
 */
exports.NON_TYPE_RANGE_SCALE_PROPERTIES = [
    // general properties
    'domain',
    'round',
    // quantitative / time
    'clamp', 'nice',
    // quantitative
    'exponent', 'zero',
    'interpolate',
    // ordinal
    'padding', 'paddingInner', 'paddingOuter' // padding
];
/**
 * Initialize Vega-Lite Scale's properties
 *
 * Note that we have to apply these rules here because:
 * - many other scale and non-scale properties (including layout, mark) depend on scale type
 * - layout depends on padding
 * - range depends on zero and size (width and height) depends on range
 */
function init(channel, fieldDef, config, mark, topLevelSize, xyRangeSteps) {
    var specifiedScale = (fieldDef || {}).scale || {};
    var scale = {
        type: type_1.default(specifiedScale.type, channel, fieldDef, mark, topLevelSize !== undefined, specifiedScale.rangeStep, config.scale)
    };
    // Use specified value if compatible or determine default values for each property
    exports.NON_TYPE_RANGE_SCALE_PROPERTIES.forEach(function (property) {
        var specifiedValue = specifiedScale[property];
        var supportedByScaleType = scale_1.scaleTypeSupportProperty(scale.type, property);
        var channelIncompatability = scale_1.channelScalePropertyIncompatability(channel, property);
        if (specifiedValue !== undefined) {
            // If there is a specified value, check if it is compatible with scale type and channel
            if (!supportedByScaleType) {
                log.warn(log.message.scalePropertyNotWorkWithScaleType(scale.type, property, channel));
            }
            else if (channelIncompatability) {
                log.warn(channelIncompatability);
            }
        }
        if (supportedByScaleType && channelIncompatability === undefined) {
            var value = getValue(specifiedValue, property, scale, channel, fieldDef, config.scale);
            if (value !== undefined) {
                scale[property] = value;
            }
        }
    });
    return util.extend(scale, range_1.default(channel, scale.type, fieldDef.type, specifiedScale, config, scale.zero, mark, topLevelSize, xyRangeSteps));
}
exports.default = init;
function getValue(specifiedValue, property, scale, channel, fieldDef, scaleConfig) {
    // For domain, we might override specified value
    if (property === 'domain') {
        return domain_1.initDomain(specifiedValue, fieldDef, scale.type, scaleConfig);
    }
    // Other properties, no overriding default values
    if (specifiedValue !== undefined) {
        return specifiedValue;
    }
    return getDefaultValue(property, scale, channel, fieldDef, scaleConfig);
}
function getDefaultValue(property, scale, channel, fieldDef, scaleConfig) {
    // If we have default rule-base, determine default value first
    switch (property) {
        case 'nice':
            return rules.nice(scale.type, channel, fieldDef);
        case 'padding':
            return rules.padding(channel, scale.type, scaleConfig);
        case 'paddingInner':
            return rules.paddingInner(scale.padding, channel, scaleConfig);
        case 'paddingOuter':
            return rules.paddingOuter(scale.padding, channel, scale.type, scale.paddingInner, scaleConfig);
        case 'round':
            return rules.round(channel, scaleConfig);
        case 'zero':
            return rules.zero(scale, channel, fieldDef);
    }
    // Otherwise, use scale config
    return scaleConfig[property];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NjYWxlL2luaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBaUM7QUFNakMscUNBQThHO0FBQzlHLGlDQUFtQztBQUVuQyxtQ0FBb0M7QUFDcEMsaUNBQWtDO0FBQ2xDLCtCQUFpQztBQUNqQywrQkFBK0I7QUFFL0I7O0dBRUc7QUFDVSxRQUFBLCtCQUErQixHQUFvQjtJQUM5RCxxQkFBcUI7SUFDckIsUUFBUTtJQUNSLE9BQU87SUFDUCxzQkFBc0I7SUFDdEIsT0FBTyxFQUFFLE1BQU07SUFDZixlQUFlO0lBQ2YsVUFBVSxFQUFFLE1BQU07SUFDbEIsYUFBYTtJQUNiLFVBQVU7SUFDVixTQUFTLEVBQUUsY0FBYyxFQUFFLGNBQWMsQ0FBQyxVQUFVO0NBQ3JELENBQUM7QUFFRjs7Ozs7OztHQU9HO0FBQ0gsY0FDSSxPQUFnQixFQUFFLFFBQXVCLEVBQUUsTUFBYyxFQUN6RCxJQUFzQixFQUFFLFlBQWdDLEVBQUUsWUFBc0I7SUFDbEYsSUFBTSxjQUFjLEdBQUcsQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztJQUVwRCxJQUFNLEtBQUssR0FBVTtRQUNuQixJQUFJLEVBQUUsY0FBUyxDQUNiLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsWUFBWSxLQUFLLFNBQVMsRUFDeEUsY0FBYyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUN2QztLQUNGLENBQUM7SUFFRixrRkFBa0Y7SUFDbEYsdUNBQStCLENBQUMsT0FBTyxDQUFDLFVBQVMsUUFBUTtRQUN2RCxJQUFNLGNBQWMsR0FBRyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFaEQsSUFBTSxvQkFBb0IsR0FBRyxnQ0FBd0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEs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