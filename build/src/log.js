///<reference path="../typings/vega-util.d.ts" />
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Vega-Lite's singleton logger utility.
 */
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
    // DATA
    message.DEPRECATED_FILTER_NULL = 'filterNull is deprecated. Please use filterInvalid instead.';
    // ENCODING & FACET
    function invalidFieldType(type) {
        return "Invalid field type \"" + type + "\"";
    }
    message.invalidFieldType = invalidFieldType;
    function emptyOrInvalidFieldType(type, channel, newType) {
        return "Invalid field type (" + type + ") for channel " + channel + ", using " + newType + " instead.";
    }
    message.emptyOrInvalidFieldType = emptyOrInvalidFieldType;
    function emptyFieldDef(fieldDef, channel) {
        return "Dropping " + JSON.stringify(fieldDef) + " from channel " + channel + " since it does not contain data field or value.";
    }
    message.emptyFieldDef = emptyFieldDef;
    function incompatibleChannel(channel, markOrFacet, when) {
        return channel + " dropped as it is incompatible with " + markOrFacet +
            when ? "when " + when : '';
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
        return 'Cannot clearly determine orientation for ' + mark + ' since both x and y channel encode continous fields. In this case, we use vertical by default';
    }
    message.unclearOrientContinuous = unclearOrientContinuous;
    function unclearOrientDiscreteOrEmpty(mark) {
        return 'Cannot clearly determine orientation for ' + mark + ' since both x and y channel encode discrete or empty fields.';
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
    message.CANNOT_USE_PADDING_WITH_FACET = 'Cannot use padding with facet\'s scale.  Please use spacing instead.';
    function cannotUseRangePropertyWithFacet(propName) {
        return "Cannot use custom " + propName + " with row or column channel. Please use width, height, or spacing instead.";
    }
    message.cannotUseRangePropertyWithFacet = cannotUseRangePropertyWithFacet;
    function rangeStepDropped(channel) {
        return "rangeStep for " + channel + " is dropped as top-level " + (channel === 'x' ? 'width' : 'height') + " is provided.";
    }
    message.rangeStepDropped = rangeStepDropped;
    function cannotOverrideBinScaleType(channel, defaultScaleType) {
        return "Cannot override scale type for binned channel " + channel + ". We are using " + defaultScaleType + " scale instead.";
    }
    message.cannotOverrideBinScaleType = cannotOverrideBinScaleType;
    function scaleTypeNotWorkWithChannel(channel, scaleType, defaultScaleType) {
        return "Channel " + channel + " does not work with " + scaleType + " scale. We are using " + defaultScaleType + " scale instead.";
    }
    message.scaleTypeNotWorkWithChannel = scaleTypeNotWorkWithChannel;
    function scalePropertyNotWorkWithScaleType(scaleType, propName, channel) {
        return channel + "-scale's \"" + propName + "\" is dropped as it does not work with " + scaleType + " scale.";
    }
    message.scalePropertyNotWorkWithScaleType = scalePropertyNotWorkWithScaleType;
    function scaleTypeNotWorkWithMark(mark, scaleType) {
        return "Scale type \"" + scaleType + "\" does not work with mark " + mark + ".";
    }
    message.scaleTypeNotWorkWithMark = scaleTypeNotWorkWithMark;
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
        return "Time unit \"" + fullTimeUnit + "\" is not supported. We are replacing it with " +
            (fullTimeUnit + '').replace('day', 'date') + '.';
    }
    message.dayReplacedWithDate = dayReplacedWithDate;
    function droppedDay(d) {
        return 'Dropping day from datetime ' + JSON.stringify(d) +
            ' as day cannot be combined with other units.';
    }
    message.droppedDay = droppedDay;
})(message = exports.message || (exports.message = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxpREFBaUQ7OztBQUVqRDs7R0FFRztBQUVILHVDQUF3RDtBQWF4RDs7R0FFRztBQUNILElBQU0sSUFBSSxHQUFHLGtCQUFNLENBQUMsZ0JBQUksQ0FBQyxDQUFDO0FBQzFCLElBQUksT0FBTyxHQUFvQixJQUFJLENBQUM7QUFFcEM7O0dBRUc7QUFDSDtJQUFBO1FBQ1MsVUFBSyxHQUFVLEVBQUUsQ0FBQztRQUNsQixVQUFLLEdBQVUsRUFBRSxDQUFDO1FBQ2xCLFdBQU0sR0FBVSxFQUFFLENBQUM7SUFvQjVCLENBQUM7SUFsQlEsMkJBQUssR0FBWjtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sMEJBQUksR0FBWDtRQUFZLGNBQWM7YUFBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO1lBQWQseUJBQWM7O1FBQ3hCLENBQUEsS0FBQSxJQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsSUFBSSxXQUFJLElBQUksRUFBRTtRQUN6QixNQUFNLENBQUMsSUFBSSxDQUFDOztJQUNkLENBQUM7SUFFTSwwQkFBSSxHQUFYO1FBQVksY0FBYzthQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7WUFBZCx5QkFBYzs7UUFDeEIsQ0FBQSxLQUFBLElBQUksQ0FBQyxLQUFLLENBQUEsQ0FBQyxJQUFJLFdBQUksSUFBSSxFQUFFO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUM7O0lBQ2QsQ0FBQztJQUVNLDJCQUFLLEdBQVo7UUFBYSxjQUFjO2FBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztZQUFkLHlCQUFjOztRQUN6QixDQUFBLEtBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQSxDQUFDLElBQUksV0FBSSxJQUFJLEVBQUU7UUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQzs7SUFDZCxDQUFDO0lBQ0gsa0JB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