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
    function selectionNotFound(name) {
        return "Cannot find a selection named \"" + name + "\"";
    }
    message.selectionNotFound = selectionNotFound;
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
    function invalidFieldTypeForCountAggregate(type, aggregate) {
        return "Invalid field type \"" + type + "\" for aggregate: \"" + aggregate + "\", using \"quantitative\" instead.";
    }
    message.invalidFieldTypeForCountAggregate = invalidFieldTypeForCountAggregate;
    function invalidFieldTypeForBin(type) {
        return "Invalid field type \"" + type + "\" for bin, using \"quantitative\" instead.";
    }
    message.invalidFieldTypeForBin = invalidFieldTypeForBin;
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
    function mergeConflictingProperty(property, propertyOf, v1, v2) {
        return "Conflicting " + propertyOf + " property " + property + " (" + v1 + " and " + v2 + ").  Using " + v1 + ".";
    }
    message.mergeConflictingProperty = mergeConflictingProperty;
    function independentScaleMeansIndependentGuide(channel) {
        return "Setting the scale to be independent for " + channel + " means we also have to set the guide (axis or legend) to be independent.";
    }
    message.independentScaleMeansIndependentGuide = independentScaleMeansIndependentGuide;
    function conflictedDomain(channel) {
        return "Cannot set " + channel + "-scale's \"domain\" as it is binned. Please use \"bin\"'s \"extent\" instead.";
    }
    message.conflictedDomain = conflictedDomain;
    function domainSortDropped(sort) {
        return "Dropping sort property " + JSON.stringify(sort) + " as unioned domains only support boolean or op 'count'.";
    }
    message.domainSortDropped = domainSortDropped;
    message.UNABLE_TO_MERGE_DOMAINS = 'Unable to merge domains';
    message.MORE_THAN_ONE_SORT = 'Domains that should be unioned has conflicting sort properties. Sort will be set to true.';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7O0FBRUgsdUNBQXdEO0FBaUJ4RDs7R0FFRztBQUNILElBQU0sSUFBSSxHQUFHLGtCQUFNLENBQUMsZ0JBQUksQ0FBQyxDQUFDO0FBQzFCLElBQUksT0FBTyxHQUFvQixJQUFJLENBQUM7QUFFcEM7O0dBRUc7QUFDSDtJQUFBO1FBQ1MsVUFBSyxHQUFVLEVBQUUsQ0FBQztRQUNsQixVQUFLLEdBQVUsRUFBRSxDQUFDO1FBQ2xCLFdBQU0sR0FBVSxFQUFFLENBQUM7SUFvQjVCLENBQUM7SUFsQlEsMkJBQUssR0FBWjtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sMEJBQUksR0FBWDtRQUFZLGNBQWM7YUFBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO1lBQWQseUJBQWM7O1FBQ3hCLENBQUEsS0FBQSxJQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsSUFBSSxXQUFJLElBQUksRUFBRTtRQUN6QixNQUFNLENBQUMsSUFBSSxDQUFDOztJQUNkLENBQUM7SUFFTSwwQkFBSSxHQUFYO1FBQVksY0FBYzthQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7WUFBZCx5QkFBYzs7UUFDeEIsQ0FBQSxLQUFBLElBQUksQ0FBQyxLQUFLLENBQUEsQ0FBQyxJQUFJLFdBQUksSUFBSSxFQUFFO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUM7O0lBQ2QsQ0FBQztJQUVNLDJCQUFLLEdBQVo7UUFBYSxjQUFjO2FBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztZQUFkLHlCQUFjOztRQUN6QixDQUFBLEtBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQSxDQUFDLElBQUksV0FBSSxJQUFJLEVBQUU7UUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQzs7SUFDZCxDQUFDO0lBQ0gsa0JBQUM7QUFBRCxDQUFD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