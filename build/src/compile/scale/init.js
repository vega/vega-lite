"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../../log");
var scale_1 = require("../../scale");
var domain_1 = require("./domain");
var range_1 = require("./range");
var rules = require("./rules");
var type_1 = require("./type");
var util = require("../../util");
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
        type: type_1.default(specifiedScale.type, fieldDef.type, channel, fieldDef.timeUnit, mark, topLevelSize !== undefined, specifiedScale.rangeStep, config.scale)
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
//# sourceMappingURL=init.js.map