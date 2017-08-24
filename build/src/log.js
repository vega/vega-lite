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
        return "Cannot project a selection on encoding channel \"" + channel + "\", which has no field.";
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
    // TITLE
    function cannotSetTitleAnchor(type) {
        return "Cannot set title \"anchor\" for a " + type + " spec";
    }
    message.cannotSetTitleAnchor = cannotSetTitleAnchor;
    // DATA
    function unrecognizedParse(p) {
        return "Unrecognized parse \"" + p + "\".";
    }
    message.unrecognizedParse = unrecognizedParse;
    function differentParse(field, local, ancestor) {
        return "An ancestor parsed field \"" + field + "\" as " + ancestor + " but a child wants to parse the field as " + local + ".";
    }
    message.differentParse = differentParse;
    // TRANSFORMS
    function invalidTransformIgnored(transform) {
        return "Ignoring an invalid transform: " + JSON.stringify(transform) + ".";
    }
    message.invalidTransformIgnored = invalidTransformIgnored;
    message.NO_FIELDS_NEEDS_AS = 'If "from.fields" is not specified, "as" has to be a string that specifies the key to be used for the the data from the secondary source.';
    // ENCODING & FACET
    function invalidFieldType(type) {
        return "Invalid field type \"" + type + "\"";
    }
    message.invalidFieldType = invalidFieldType;
    function invalidFieldTypeForCountAggregate(type, aggregate) {
        return "Invalid field type \"" + type + "\" for aggregate: \"" + aggregate + "\", using \"quantitative\" instead.";
    }
    message.invalidFieldTypeForCountAggregate = invalidFieldTypeForCountAggregate;
    function invalidAggregate(aggregate) {
        return "Invalid aggregation operator \"" + aggregate + "\"";
    }
    message.invalidAggregate = invalidAggregate;
    function emptyOrInvalidFieldType(type, channel, newType) {
        return "Invalid field type \"" + type + "\" for channel \"" + channel + "\", using \"" + newType + "\" instead.";
    }
    message.emptyOrInvalidFieldType = emptyOrInvalidFieldType;
    function emptyFieldDef(fieldDef, channel) {
        return "Dropping " + JSON.stringify(fieldDef) + " from channel \"" + channel + "\" since it does not contain data field or value.";
    }
    message.emptyFieldDef = emptyFieldDef;
    function incompatibleChannel(channel, markOrFacet, when) {
        return channel + " dropped as it is incompatible with \"" + markOrFacet + "\"" + (when ? " when " + when : '') + ".";
    }
    message.incompatibleChannel = incompatibleChannel;
    function facetChannelShouldBeDiscrete(channel) {
        return channel + " encoding should be discrete (ordinal / nominal / binned).";
    }
    message.facetChannelShouldBeDiscrete = facetChannelShouldBeDiscrete;
    function discreteChannelCannotEncode(channel, type) {
        return "Using discrete channel \"" + channel + "\" to encode \"" + type + "\" field can be misleading as it does not encode " + (type === 'ordinal' ? 'order' : 'magnitude') + ".";
    }
    message.discreteChannelCannotEncode = discreteChannelCannotEncode;
    // Mark
    message.BAR_WITH_POINT_SCALE_AND_RANGESTEP_NULL = 'Bar mark should not be used with point scale when rangeStep is null. Please use band scale instead.';
    function unclearOrientContinuous(mark) {
        return "Cannot clearly determine orientation for \"" + mark + "\" since both x and y channel encode continous fields. In this case, we use vertical by default";
    }
    message.unclearOrientContinuous = unclearOrientContinuous;
    function unclearOrientDiscreteOrEmpty(mark) {
        return "Cannot clearly determine orientation for \"" + mark + "\" since both x and y channel encode discrete or empty fields.";
    }
    message.unclearOrientDiscreteOrEmpty = unclearOrientDiscreteOrEmpty;
    function orientOverridden(original, actual) {
        return "Specified orient \"" + original + "\" overridden with \"" + actual + "\"";
    }
    message.orientOverridden = orientOverridden;
    // SCALE
    message.CANNOT_UNION_CUSTOM_DOMAIN_WITH_FIELD_DOMAIN = 'custom domain scale cannot be unioned with default field-based domain';
    function cannotUseScalePropertyWithNonColor(prop) {
        return "Cannot use the scale property \"" + prop + "\" with non-color channel.";
    }
    message.cannotUseScalePropertyWithNonColor = cannotUseScalePropertyWithNonColor;
    function unaggregateDomainHasNoEffectForRawField(fieldDef) {
        return "Using unaggregated domain with raw field has no effect (" + JSON.stringify(fieldDef) + ").";
    }
    message.unaggregateDomainHasNoEffectForRawField = unaggregateDomainHasNoEffectForRawField;
    function unaggregateDomainWithNonSharedDomainOp(aggregate) {
        return "Unaggregated domain not applicable for \"" + aggregate + "\" since it produces values outside the origin domain of the source data.";
    }
    message.unaggregateDomainWithNonSharedDomainOp = unaggregateDomainWithNonSharedDomainOp;
    function unaggregatedDomainWithLogScale(fieldDef) {
        return "Unaggregated domain is currently unsupported for log scale (" + JSON.stringify(fieldDef) + ").";
    }
    message.unaggregatedDomainWithLogScale = unaggregatedDomainWithLogScale;
    message.CANNOT_USE_RANGE_WITH_POSITION = 'Cannot use a custom "range" with x or y channel.  Please customize width, height, padding, or rangeStep instead.';
    function cannotUseSizeFieldWithBandSize(positionChannel) {
        return "Using size field when " + positionChannel + "-channel has a band scale is not supported.";
    }
    message.cannotUseSizeFieldWithBandSize = cannotUseSizeFieldWithBandSize;
    function cannotApplySizeToNonOrientedMark(mark) {
        return "Cannot apply size to non-oriented mark \"" + mark + "\".";
    }
    message.cannotApplySizeToNonOrientedMark = cannotApplySizeToNonOrientedMark;
    function rangeStepDropped(channel) {
        return "rangeStep for \"" + channel + "\" is dropped as top-level " + (channel === 'x' ? 'width' : 'height') + " is provided.";
    }
    message.rangeStepDropped = rangeStepDropped;
    function scaleTypeNotWorkWithChannel(channel, scaleType, defaultScaleType) {
        return "Channel \"" + channel + "\" does not work with \"" + scaleType + "\" scale. We are using \"" + defaultScaleType + "\" scale instead.";
    }
    message.scaleTypeNotWorkWithChannel = scaleTypeNotWorkWithChannel;
    function scaleTypeNotWorkWithFieldDef(scaleType, defaultScaleType) {
        return "FieldDef does not work with \"" + scaleType + "\" scale. We are using \"" + defaultScaleType + "\" scale instead.";
    }
    message.scaleTypeNotWorkWithFieldDef = scaleTypeNotWorkWithFieldDef;
    function scalePropertyNotWorkWithScaleType(scaleType, propName, channel) {
        return channel + "-scale's \"" + propName + "\" is dropped as it does not work with " + scaleType + " scale.";
    }
    message.scalePropertyNotWorkWithScaleType = scalePropertyNotWorkWithScaleType;
    function scaleTypeNotWorkWithMark(mark, scaleType) {
        return "Scale type \"" + scaleType + "\" does not work with mark \"" + mark + "\".";
    }
    message.scaleTypeNotWorkWithMark = scaleTypeNotWorkWithMark;
    function mergeConflictingProperty(property, propertyOf, v1, v2) {
        return "Conflicting " + propertyOf + " property \"" + property + "\" (\"" + v1 + "\" and \"" + v2 + "\").  Using \"" + v1 + "\".";
    }
    message.mergeConflictingProperty = mergeConflictingProperty;
    function independentScaleMeansIndependentGuide(channel) {
        return "Setting the scale to be independent for \"" + channel + "\" means we also have to set the guide (axis or legend) to be independent.";
    }
    message.independentScaleMeansIndependentGuide = independentScaleMeansIndependentGuide;
    function conflictedDomain(channel) {
        return "Cannot set " + channel + "-scale's \"domain\" as it is binned. Please use \"bin\"'s \"extent\" instead.";
    }
    message.conflictedDomain = conflictedDomain;
    function domainSortDropped(sort) {
        return "Dropping sort property \"" + JSON.stringify(sort) + "\" as unioned domains only support boolean or op 'count'.";
    }
    message.domainSortDropped = domainSortDropped;
    message.UNABLE_TO_MERGE_DOMAINS = 'Unable to merge domains';
    message.MORE_THAN_ONE_SORT = 'Domains that should be unioned has conflicting sort properties. Sort will be set to true.';
    // AXIS
    message.INVALID_CHANNEL_FOR_AXIS = 'Invalid channel for axis.';
    // STACK
    function cannotStackRangedMark(channel) {
        return "Cannot stack \"" + channel + "\" if there is already \"" + channel + "2\"";
    }
    message.cannotStackRangedMark = cannotStackRangedMark;
    function cannotStackNonLinearScale(scaleType) {
        return "Cannot stack non-linear scale (" + scaleType + ")";
    }
    message.cannotStackNonLinearScale = cannotStackNonLinearScale;
    function cannotStackNonSummativeAggregate(aggregate) {
        return "Cannot stack when the aggregate function is non-summative (\"" + aggregate + "\")";
    }
    message.cannotStackNonSummativeAggregate = cannotStackNonSummativeAggregate;
    // TIMEUNIT
    function invalidTimeUnit(unitName, value) {
        return "Invalid " + unitName + ": \"" + value + "\"";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7O0FBRUgsdUNBQXdEO0FBY3hEOztHQUVHO0FBQ0gsSUFBTSxJQUFJLEdBQUcsa0JBQU0sQ0FBQyxnQkFBSSxDQUFDLENBQUM7QUFDMUIsSUFBSSxPQUFPLEdBQW9CLElBQUksQ0FBQztBQUVwQzs7R0FFRztBQUNIO0lBQUE7UUFDUyxVQUFLLEdBQVUsRUFBRSxDQUFDO1FBQ2xCLFVBQUssR0FBVSxFQUFFLENBQUM7UUFDbEIsV0FBTSxHQUFVLEVBQUUsQ0FBQztJQW9CNUIsQ0FBQztJQWxCUSwyQkFBSyxHQUFaO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSwwQkFBSSxHQUFYO1FBQVksY0FBYzthQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7WUFBZCx5QkFBYzs7UUFDeEIsQ0FBQSxLQUFBLElBQUksQ0FBQyxLQUFLLENBQUEsQ0FBQyxJQUFJLFdBQUksSUFBSSxFQUFFO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUM7O0lBQ2QsQ0FBQztJQUVNLDBCQUFJLEdBQVg7UUFBWSxjQUFjO2FBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztZQUFkLHlCQUFjOztRQUN4QixDQUFBLEtBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQSxDQUFDLElBQUksV0FBSSxJQUFJLEVBQUU7UUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQzs7SUFDZCxDQUFDO0lBRU0sMkJBQUssR0FBWjtRQUFhLGNBQWM7YUFBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO1lBQWQseUJBQWM7O1FBQ3pCLENBQUEsS0FBQSxJQUFJLENBQUMsTUFBTSxDQUFBLENBQUMsSUFBSSxXQUFJLElBQUksRUFBRTtRQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDOztJQUNkLENBQUM7SUFDSCxrQkFBQztBQUFELENBQUMs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