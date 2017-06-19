"use strict";
/**
 * Vega-Lite's singleton logger utility.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var vega_util_1 = require("vega-util");
/**
 * Main (default) Vega Logger instance for Vega-Lite
 */
var main = vega_util_1.logger(vega_util_1.Warn);
var current = main;
/**
 * Logger tool for checking if the code throws correct warning
 */
var LocalLogger = (function () {
    function LocalLogger() {
        this.warns = [];
        this.infos = [];
        this.debugs = [];
    }
    LocalLogger.prototype.level = function () {
        return this;
    };
    LocalLogger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        (_a = this.warns).push.apply(_a, args);
        return this;
        var _a;
    };
    LocalLogger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        (_a = this.infos).push.apply(_a, args);
        return this;
        var _a;
    };
    LocalLogger.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        (_a = this.debugs).push.apply(_a, args);
        return this;
        var _a;
    };
    return LocalLogger;
}());
exports.LocalLogger = LocalLogger;
function runLocalLogger(f) {
    var localLogger = current = new LocalLogger();
    f(localLogger);
    reset();
}
exports.runLocalLogger = runLocalLogger;
function wrap(f) {
    return function () {
        var logger = current = new LocalLogger();
        f(logger);
        reset();
    };
}
exports.wrap = wrap;
/**
 * Set the singleton logger to be a custom logger
 */
function set(logger) {
    current = logger;
    return current;
}
exports.set = set;
/**
 * Reset the main logger to use the default Vega Logger
 */
function reset() {
    current = main;
    return current;
}
exports.reset = reset;
function warn() {
    var _ = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        _[_i] = arguments[_i];
    }
    current.warn.apply(current, arguments);
}
exports.warn = warn;
function info() {
    var _ = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        _[_i] = arguments[_i];
    }
    current.info.apply(current, arguments);
}
exports.info = info;
function debug() {
    var _ = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        _[_i] = arguments[_i];
    }
    current.debug.apply(current, arguments);
}
exports.debug = debug;
/**
 * Collection of all Vega-Lite Error Messages
 */
var message;
(function (message) {
    message.INVALID_SPEC = 'Invalid spec';
    // SELECTION
    function cannotProjectOnChannelWithoutField(channel) {
        return "Cannot project a selection on encoding channel " + channel + ", which has no field.";
    }
    message.cannotProjectOnChannelWithoutField = cannotProjectOnChannelWithoutField;
    // REPEAT
    function noSuchRepeatedValue(field) {
        return "Unknown repeated value \"" + field + "\".";
    }
    message.noSuchRepeatedValue = noSuchRepeatedValue;
    // DATA
    function unrecognizedParse(p) {
        return "Unrecognized parse " + p + ".";
    }
    message.unrecognizedParse = unrecognizedParse;
    function differentParse(field, local, ancestor) {
        return "An ancestor parsed field " + field + " as " + ancestor + " but a child wants to parse the field as " + local + ".";
    }
    message.differentParse = differentParse;
    // TRANSFORMS
    function invalidTransformIgnored(transform) {
        return "Ignoring an invalid transform: " + JSON.stringify(transform) + ".";
    }
    message.invalidTransformIgnored = invalidTransformIgnored;
    message.NO_FIELDS_NEEDS_AS = 'If `from.fields` is not specified, `as` has to be a string that specifies the key to be used for the the data from the secondary source.';
    // ENCODING & FACET
    function invalidFieldType(type) {
        return "Invalid field type \"" + type + "\"";
    }
    message.invalidFieldType = invalidFieldType;
    function invalidAggregate(aggregate) {
        return "Invalid aggregation operator \"" + aggregate + "\"";
    }
    message.invalidAggregate = invalidAggregate;
    function emptyOrInvalidFieldType(type, channel, newType) {
        return "Invalid field type (" + type + ") for channel " + channel + ", using " + newType + " instead.";
    }
    message.emptyOrInvalidFieldType = emptyOrInvalidFieldType;
    function emptyFieldDef(fieldDef, channel) {
        return "Dropping " + JSON.stringify(fieldDef) + " from channel " + channel + " since it does not contain data field or value.";
    }
    message.emptyFieldDef = emptyFieldDef;
    function incompatibleChannel(channel, markOrFacet, when) {
        return channel + " dropped as it is incompatible with " + markOrFacet + (when ? " when " + when : '') + ".";
    }
    message.incompatibleChannel = incompatibleChannel;
    function facetChannelShouldBeDiscrete(channel) {
        return channel + " encoding should be discrete (ordinal / nominal / binned).";
    }
    message.facetChannelShouldBeDiscrete = facetChannelShouldBeDiscrete;
    function discreteChannelCannotEncode(channel, type) {
        return "Using discrete channel " + channel + " to encode " + type + " field can be misleading as it does not encode " + (type === 'ordinal' ? 'order' : 'magnitude') + ".";
    }
    message.discreteChannelCannotEncode = discreteChannelCannotEncode;
    // Mark
    message.BAR_WITH_POINT_SCALE_AND_RANGESTEP_NULL = 'Bar mark should not be used with point scale when rangeStep is null. Please use band scale instead.';
    function unclearOrientContinuous(mark) {
        return "Cannot clearly determine orientation for " + mark + " since both x and y channel encode continous fields. In this case, we use vertical by default";
    }
    message.unclearOrientContinuous = unclearOrientContinuous;
    function unclearOrientDiscreteOrEmpty(mark) {
        return "Cannot clearly determine orientation for " + mark + " since both x and y channel encode discrete or empty fields.";
    }
    message.unclearOrientDiscreteOrEmpty = unclearOrientDiscreteOrEmpty;
    function orientOverridden(original, actual) {
        return "Specified orient " + original + " overridden with " + actual;
    }
    message.orientOverridden = orientOverridden;
    // SCALE
    message.CANNOT_UNION_CUSTOM_DOMAIN_WITH_FIELD_DOMAIN = 'custom domain scale cannot be unioned with default field-based domain';
    function cannotUseScalePropertyWithNonColor(prop) {
        return "Cannot use " + prop + " with non-color channel.";
    }
    message.cannotUseScalePropertyWithNonColor = cannotUseScalePropertyWithNonColor;
    function unaggregateDomainHasNoEffectForRawField(fieldDef) {
        return "Using unaggregated domain with raw field has no effect (" + JSON.stringify(fieldDef) + ").";
    }
    message.unaggregateDomainHasNoEffectForRawField = unaggregateDomainHasNoEffectForRawField;
    function unaggregateDomainWithNonSharedDomainOp(aggregate) {
        return "Unaggregated domain not applicable for " + aggregate + " since it produces values outside the origin domain of the source data.";
    }
    message.unaggregateDomainWithNonSharedDomainOp = unaggregateDomainWithNonSharedDomainOp;
    function unaggregatedDomainWithLogScale(fieldDef) {
        return "Unaggregated domain is currently unsupported for log scale (" + JSON.stringify(fieldDef) + ").";
    }
    message.unaggregatedDomainWithLogScale = unaggregatedDomainWithLogScale;
    message.CANNOT_USE_RANGE_WITH_POSITION = 'Cannot use custom range with x or y channel.  Please customize width, height, padding, or rangeStep instead.';
    function cannotUseSizeFieldWithBandSize(positionChannel) {
        return "Using size field when " + positionChannel + "-channel has a band scale is not supported.";
    }
    message.cannotUseSizeFieldWithBandSize = cannotUseSizeFieldWithBandSize;
    function cannotApplySizeToNonOrientedMark(mark) {
        return "Cannot apply size to non-oriented mark " + mark + ".";
    }
    message.cannotApplySizeToNonOrientedMark = cannotApplySizeToNonOrientedMark;
    function rangeStepDropped(channel) {
        return "rangeStep for " + channel + " is dropped as top-level " + (channel === 'x' ? 'width' : 'height') + " is provided.";
    }
    message.rangeStepDropped = rangeStepDropped;
    function scaleTypeNotWorkWithChannel(channel, scaleType, defaultScaleType) {
        return "Channel " + channel + " does not work with " + scaleType + " scale. We are using " + defaultScaleType + " scale instead.";
    }
    message.scaleTypeNotWorkWithChannel = scaleTypeNotWorkWithChannel;
    function scaleTypeNotWorkWithFieldDef(scaleType, defaultScaleType) {
        return "FieldDef does not work with " + scaleType + " scale. We are using " + defaultScaleType + " scale instead.";
    }
    message.scaleTypeNotWorkWithFieldDef = scaleTypeNotWorkWithFieldDef;
    function scalePropertyNotWorkWithScaleType(scaleType, propName, channel) {
        return channel + "-scale's \"" + propName + "\" is dropped as it does not work with " + scaleType + " scale.";
    }
    message.scalePropertyNotWorkWithScaleType = scalePropertyNotWorkWithScaleType;
    function scaleTypeNotWorkWithMark(mark, scaleType) {
        return "Scale type \"" + scaleType + "\" does not work with mark " + mark + ".";
    }
    message.scaleTypeNotWorkWithMark = scaleTypeNotWorkWithMark;
    function independentScaleMeansIndependentGuide(channel) {
        return "Setting the scale to be independent for " + channel + " means we also have to set the guide (axis or legend) to be independent.";
    }
    message.independentScaleMeansIndependentGuide = independentScaleMeansIndependentGuide;
    function conflictedDomain(channel) {
        return "Cannot set " + channel + "-scale's \"domain\" as it is binned. Please use \"bin\"'s \"extent\" instead.";
    }
    message.conflictedDomain = conflictedDomain;
    message.INVAID_DOMAIN = 'Invalid scale domain';
    message.UNABLE_TO_MERGE_DOMAINS = 'Unable to merge domains';
    // AXIS
    message.INVALID_CHANNEL_FOR_AXIS = 'Invalid channel for axis.';
    // STACK
    function cannotStackRangedMark(channel) {
        return "Cannot stack " + channel + " if there is already " + channel + "2";
    }
    message.cannotStackRangedMark = cannotStackRangedMark;
    function cannotStackNonLinearScale(scaleType) {
        return "Cannot stack non-linear scale (" + scaleType + ")";
    }
    message.cannotStackNonLinearScale = cannotStackNonLinearScale;
    function cannotStackNonSummativeAggregate(aggregate) {
        return "Cannot stack when the aggregate function is non-summative (" + aggregate + ")";
    }
    message.cannotStackNonSummativeAggregate = cannotStackNonSummativeAggregate;
    // TIMEUNIT
    function invalidTimeUnit(unitName, value) {
        return "Invalid " + unitName + ": " + value;
    }
    message.invalidTimeUnit = invalidTimeUnit;
    function dayReplacedWithDate(fullTimeUnit) {
        return "Time unit \"" + fullTimeUnit + "\" is not supported. We are replacing it with " + fullTimeUnit.replace('day', 'date') + ".";
    }
    message.dayReplacedWithDate = dayReplacedWithDate;
    function droppedDay(d) {
        return "Dropping day from datetime " + JSON.stringify(d) + " as day cannot be combined with other units.";
    }
    message.droppedDay = droppedDay;
})(message = exports.message || (exports.message = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7O0FBRUgsdUNBQXdEO0FBYXhEOztHQUVHO0FBQ0gsSUFBTSxJQUFJLEdBQUcsa0JBQU0sQ0FBQyxnQkFBSSxDQUFDLENBQUM7QUFDMUIsSUFBSSxPQUFPLEdBQW9CLElBQUksQ0FBQztBQUVwQzs7R0FFRztBQUNIO0lBQUE7UUFDUyxVQUFLLEdBQVUsRUFBRSxDQUFDO1FBQ2xCLFVBQUssR0FBVSxFQUFFLENBQUM7UUFDbEIsV0FBTSxHQUFVLEVBQUUsQ0FBQztJQW9CNUIsQ0FBQztJQWxCUSwyQkFBSyxHQUFaO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSwwQkFBSSxHQUFYO1FBQVksY0FBYzthQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7WUFBZCx5QkFBYzs7UUFDeEIsQ0FBQSxLQUFBLElBQUksQ0FBQyxLQUFLLENBQUEsQ0FBQyxJQUFJLFdBQUksSUFBSSxFQUFFO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUM7O0lBQ2QsQ0FBQztJQUVNLDBCQUFJLEdBQVg7UUFBWSxjQUFjO2FBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztZQUFkLHlCQUFjOztRQUN4QixDQUFBLEtBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQSxDQUFDLElBQUksV0FBSSxJQUFJLEVBQUU7UUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQzs7SUFDZCxDQUFDO0lBRU0sMkJBQUssR0FBWjtRQUFhLGNBQWM7YUFBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO1lBQWQseUJBQWM7O1FBQ3pCLENBQUEsS0FBQSxJQUFJLENBQUMsTUFBTSxDQUFBLENBQUMsSUFBSSxXQUFJLElBQUksRUFBRTtRQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDOztJQUNkLENBQUM7SUFDSCxrQkFBQztBQUFELENBQUMs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