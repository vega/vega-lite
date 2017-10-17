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
var LocalLogger = /** @class */ (function () {
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
    // FIT
    message.FIT_NON_SINGLE = 'Autosize "fit" only works for single views and layered views.';
    message.CANNOT_FIX_RANGE_STEP_WITH_FIT = 'Cannot use a fixed value of "rangeStep" when "autosize" is "fit".';
    // SELECTION
    function cannotProjectOnChannelWithoutField(channel) {
        return "Cannot project a selection on encoding channel \"" + channel + "\", which has no field.";
    }
    message.cannotProjectOnChannelWithoutField = cannotProjectOnChannelWithoutField;
    function nearestNotSupportForContinuous(mark) {
        return "The \"nearest\" transform is not supported for " + mark + " marks.";
    }
    message.nearestNotSupportForContinuous = nearestNotSupportForContinuous;
    function selectionNotFound(name) {
        return "Cannot find a selection named \"" + name + "\"";
    }
    message.selectionNotFound = selectionNotFound;
    message.SCALE_BINDINGS_CONTINUOUS = 'Scale bindings are currently only supported for scales with unbinned, continuous domains.';
    // REPEAT
    function noSuchRepeatedValue(field) {
        return "Unknown repeated value \"" + field + "\".";
    }
    message.noSuchRepeatedValue = noSuchRepeatedValue;
    // CONCAT
    message.CONCAT_CANNOT_SHARE_AXIS = 'Axes cannot be shared in concatenated views.';
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
    function primitiveChannelDef(channel, type, value) {
        return "Channel " + channel + " is a " + type + ". Converted to {value: " + value + "}.";
    }
    message.primitiveChannelDef = primitiveChannelDef;
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
    function stackNonSummativeAggregate(aggregate) {
        return "Stacking is applied even though the aggregate function is non-summative (\"" + aggregate + "\")";
    }
    message.stackNonSummativeAggregate = stackNonSummativeAggregate;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7O0FBRUgsdUNBQXdEO0FBY3hEOztHQUVHO0FBQ0gsSUFBTSxJQUFJLEdBQUcsa0JBQU0sQ0FBQyxnQkFBSSxDQUFDLENBQUM7QUFDMUIsSUFBSSxPQUFPLEdBQW9CLElBQUksQ0FBQztBQUVwQzs7R0FFRztBQUNIO0lBQUE7UUFDUyxVQUFLLEdBQVUsRUFBRSxDQUFDO1FBQ2xCLFVBQUssR0FBVSxFQUFFLENBQUM7UUFDbEIsV0FBTSxHQUFVLEVBQUUsQ0FBQztJQW9CNUIsQ0FBQztJQWxCUSwyQkFBSyxHQUFaO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSwwQkFBSSxHQUFYO1FBQVksY0FBYzthQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7WUFBZCx5QkFBYzs7UUFDeEIsQ0FBQSxLQUFBLElBQUksQ0FBQyxLQUFLLENBQUEsQ0FBQyxJQUFJLFdBQUksSUFBSSxFQUFFO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUM7O0lBQ2QsQ0FBQztJQUVNLDBCQUFJLEdBQVg7UUFBWSxjQUFjO2FBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztZQUFkLHlCQUFjOztRQUN4QixDQUFBLEtBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQSxDQUFDLElBQUksV0FBSSxJQUFJLEVBQUU7UUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQzs7SUFDZCxDQUFDO0lBRU0sMkJBQUssR0FBWjtRQUFhLGNBQWM7YUFBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO1lBQWQseUJBQWM7O1FBQ3pCLENBQUEsS0FBQSxJQUFJLENBQUMsTUFBTSxDQUFBLENBQUMsSUFBSSxXQUFJLElBQUksRUFBRTtRQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDOztJQUNkLENBQUM7SUFDSCxrQkFBQztBQUFELENBQUMsQUF2QkQsSUF1QkM7QUF2Qlksa0NBQVc7QUF5QnhCLGNBQXFCLENBQWdDO0lBQ25ELE1BQU0sQ0FBQztRQUNMLElBQU0sTUFBTSxHQUFHLE9BQU8sR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQzNDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNWLEtBQUssRUFBRSxDQUFDO0lBQ1YsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQU5ELG9CQU1DO0FBRUQ7O0dBRUc7QUFDSCxhQUFvQixNQUF1QjtJQUN6QyxPQUFPLEdBQUcsTUFBTSxDQUFDO0lBQ2pCLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDakIsQ0FBQztBQUhELGtCQUdDO0FBRUQ7O0dBRUc7QUFDSDtJQUNFLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDZixNQUFNLENBQUMsT0FBTyxDQUFDO0FBQ2pCLENBQUM7QUFIRCxzQkFHQztBQUVEO0lBQXFCLFdBQVc7U0FBWCxVQUFXLEVBQVgscUJBQVcsRUFBWCxJQUFXO1FBQVgsc0JBQVc7O0lBQzlCLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztBQUN6QyxDQUFDO0FBRkQsb0JBRUM7QUFFRDtJQUFxQixXQUFXO1NBQVgsVUFBVyxFQUFYLHFCQUFXLEVBQVgsSUFBVztRQUFYLHNCQUFXOztJQUM5QixPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDekMsQ0FBQztBQUZELG9CQUVDO0FBRUQ7SUFBc0IsV0FBVztTQUFYLFVBQVcsRUFBWCxxQkFBVyxFQUFYLElBQVc7UUFBWCxzQkFBVzs7SUFDL0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzFDLENBQUM7QUFGRCxzQkFFQztBQUVEOztHQUVHO0FBQ0gsSUFBaUIsT0FBTyxDQTBNdkI7QUExTUQsV0FBaUIsT0FBTztJQUNULG9CQUFZLEdBQUcsY0FBYyxDQUFDO0lBRTNDLE1BQU07SUFDTyxzQkFBYyxHQUFHLCtEQUErRCxDQUFDO0lBRWpGLHNDQUE4QixHQUFHLG1FQUFtRSxDQUFDO0lBRWxILFlBQVk7SUFDWiw0Q0FBbUQsT0FBZ0I7UUFDakUsTUFBTSxDQUFDLHNEQUFtRCxPQUFPLDRCQUF3QixDQUFDO0lBQzVGLENBQUM7SUFGZSwwQ0FBa0MscUNBRWpELENBQUE7SUFFRCx3Q0FBK0MsSUFBWTtRQUN6RCxNQUFNLENBQUMsb0RBQWdELElBQUksWUFBUyxDQUFDO0lBQ3ZFLENBQUM7SUFGZSxzQ0FBOEIsaUNBRTdDLENBQUE7SUFFRCwyQkFBa0MsSUFBWTtRQUM1QyxNQUFNLENBQUMscUNBQWtDLElBQUksT0FBRyxDQUFDO0lBQ25ELENBQUM7SUFGZSx5QkFBaUIsb0JBRWhDLENBQUE7SUFFWSxpQ0FBeUIsR0FBRywyRkFBMkYsQ0FBQztJQUVySSxTQUFTO0lBQ1QsNkJBQW9DLEtBQWE7UUFDL0MsTUFBTSxDQUFDLDhCQUEyQixLQUFLLFFBQUksQ0FBQztJQUM5QyxDQUFDO0lBRmUsMkJBQW1CLHNCQUVsQyxDQUFBO0lBRUQsU0FBUztJQUNJLGdDQUF3QixHQUFHLDhDQUE4QyxDQUFDO0lBRXZGLFFBQVE7SUFDUiw4QkFBcUMsSUFBWTtRQUMvQyxNQUFNLENBQUMsdUNBQW1DLElBQUksVUFBTyxDQUFDO0lBQ3hELENBQUM7SUFGZSw0QkFBb0IsdUJBRW5DLENBQUE7SUFFRCxPQUFPO0lBQ1AsMkJBQWtDLENBQVM7UUFDekMsTUFBTSxDQUFDLDBCQUF1QixDQUFDLFFBQUksQ0FBQztJQUN0QyxDQUFDO0lBRmUseUJBQWlCLG9CQUVoQyxDQUFBO0lBRUQsd0JBQStCLEtBQWEsRUFBRSxLQUFhLEVBQUUsUUFBZ0I7UUFDM0UsTUFBTSxDQUFDLGdDQUE2QixLQUFLLGNBQVEsUUFBUSxpREFBNEMsS0FBSyxNQUFHLENBQUM7SUFDaEgsQ0FBQztJQUZlLHNCQUFjLGlCQUU3QixDQUFBO0lBRUQsYUFBYTtJQUNiLGlDQUF3QyxTQUFjO1FBQ3BELE1BQU0sQ0FBQyxvQ0FBa0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBRyxDQUFDO0lBQ3hFLENBQUM7SUFGZSwrQkFBdUIsMEJBRXRDLENBQUE7SUFFWSwwQkFBa0IsR0FBRywwSUFBMEksQ0FBQztJQUU3SyxtQkFBbUI7SUFFbkIsNkJBQW9DLE9BQWdCLEVBQUUsSUFBcUMsRUFBRSxLQUFnQztRQUMzSCxNQUFNLENBQUMsYUFBVyxPQUFPLGNBQVMsSUFBSSwrQkFBMEIsS0FBSyxPQUFJLENBQUM7SUFDNUUsQ0FBQztJQUZlLDJCQUFtQixzQkFFbEMsQ0FBQTtJQUVELDBCQUFpQyxJQUFVO1FBQ3pDLE1BQU0sQ0FBQywwQkFBdUIsSUFBSSxPQUFHLENBQUM7SUFDeEMsQ0FBQztJQUZlLHdCQUFnQixtQkFFL0IsQ0FBQTtJQUVELDJDQUFrRCxJQUFVLEVBQUUsU0FBaUI7UUFDN0UsTUFBTSxDQUFDLDBCQUF1QixJQUFJLDRCQUFxQixTQUFTLHdDQUFrQyxDQUFDO0lBQ3JHLENBQUM7SUFGZSx5Q0FBaUMsb0NBRWhELENBQUE7SUFFRCwwQkFBaUMsU0FBK0I7UUFDOUQsTUFBTSxDQUFDLG9DQUFpQyxTQUFTLE9BQUcsQ0FBQztJQUN2RCxDQUFDO0lBRmUsd0JBQWdCLG1CQUUvQixDQUFBO0lBRUQsaUNBQXdDLElBQW1CLEVBQUUsT0FBZ0IsRUFBRSxPQUFhO1FBQzFGLE1BQU0sQ0FBQywwQkFBdUIsSUFBSSx5QkFBa0IsT0FBTyxvQkFBYSxPQUFPLGdCQUFZLENBQUM7SUFDOUYsQ0FBQztJQUZlLCtCQUF1QiwwQkFFdEMsQ0FBQTtJQUVELHVCQUE4QixRQUEwQixFQUFFLE9BQWdCO1FBQ3hFLE1BQU0sQ0FBQyxjQUFZLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLHdCQUFrQixPQUFPLHNEQUFrRCxDQUFDO0lBQ3pILENBQUM7SUFGZSxxQkFBYSxnQkFFNUIsQ0FBQTtJQUVELDZCQUFvQyxPQUFnQixFQUFFLFdBQTJDLEVBQUUsSUFBYTtRQUM5RyxNQUFNLENBQUksT0FBTyw4Q0FBd0MsV0FBVyxXQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsV0FBUyxJQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBRyxDQUFDO0lBQ3pHLENBQUM7SUFGZSwyQkFBbUIsc0JBRWxDLENBQUE7SUFFRCxzQ0FBNkMsT0FBZTtRQUMxRCxNQUFNLENBQUksT0FBTywrREFBNEQsQ0FBQztJQUNoRixDQUFDO0lBRmUsb0NBQTRCLCtCQUUzQyxDQUFBO0lBRUQscUNBQTRDLE9BQWdCLEVBQUUsSUFBVTtRQUN0RSxNQUFNLENBQUMsOEJBQTJCLE9BQU8sdUJBQWdCLElBQUksMERBQW1ELElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsV0FBVyxPQUFHLENBQUM7SUFDaEssQ0FBQztJQUZlLG1DQUEyQiw4QkFFMUMsQ0FBQTtJQUVELE9BQU87SUFDTSwrQ0FBdUMsR0FBRyxxR0FBcUcsQ0FBQztJQUU3SixpQ0FBd0MsSUFBVTtRQUNoRCxNQUFNLENBQUMsZ0RBQTZDLElBQUksb0dBQWdHLENBQUM7SUFDM0osQ0FBQztJQUZlLCtCQUF1QiwwQkFFdEMsQ0FBQTtJQUVELHNDQUE2QyxJQUFVO1FBQ3JELE1BQU0sQ0FBQyxnREFBNkMsSUFBSSxtRUFBK0QsQ0FBQztJQUMxSCxDQUFDO0lBRmUsb0NBQTRCLCtCQUUzQyxDQUFBO0lBRUQsMEJBQWlDLFFBQWdCLEVBQUUsTUFBYztRQUMvRCxNQUFNLENBQUMsd0JBQXFCLFFBQVEsNkJBQXNCLE1BQU0sT0FBRyxDQUFDO0lBQ3RFLENBQUM7SUFGZSx3QkFBZ0IsbUJBRS9CLENBQUE7SUFFRCxRQUFRO0lBQ0ssb0RBQTRDLEdBQUcsdUVBQXVFLENBQUM7SUFFcEksNENBQW1ELElBQVk7UUFDN0QsTUFBTSxDQUFDLHFDQUFrQyxJQUFJLCtCQUEyQixDQUFDO0lBQzNFLENBQUM7SUFGZSwwQ0FBa0MscUNBRWpELENBQUE7SUFFRCxpREFBd0QsUUFBMEI7UUFDaEYsTUFBTSxDQUFDLDZEQUEyRCxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFJLENBQUM7SUFDakcsQ0FBQztJQUZlLCtDQUF1QywwQ0FFdEQsQ0FBQTtJQUVELGdEQUF1RCxTQUFpQjtRQUN0RSxNQUFNLENBQUMsOENBQTJDLFNBQVMsOEVBQTBFLENBQUM7SUFDeEksQ0FBQztJQUZlLDhDQUFzQyx5Q0FFckQsQ0FBQTtJQUVELHdDQUErQyxRQUEwQjtRQUN2RSxNQUFNLENBQUMsaUVBQStELElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQUksQ0FBQztJQUNyRyxDQUFDO0lBRmUsc0NBQThCLGlDQUU3QyxDQUFBO0lBRUQsd0NBQStDLGVBQXdCO1FBQ3JFLE1BQU0sQ0FBQywyQkFBeUIsZUFBZSxnREFBNkMsQ0FBQztJQUMvRixDQUFDO0lBRmUsc0NBQThCLGlDQUU3QyxDQUFBO0lBRUQsMENBQWlELElBQVU7UUFDekQsTUFBTSxDQUFDLDhDQUEyQyxJQUFJLFFBQUksQ0FBQztJQUM3RCxDQUFDO0lBRmUsd0NBQWdDLG1DQUUvQyxDQUFBO0lBRUQsMEJBQWlDLE9BQWdCO1FBQy9DLE1BQU0sQ0FBQyxxQkFBa0IsT0FBTyxvQ0FDOUIsT0FBTyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFRLG1CQUFlLENBQUM7SUFDeEQsQ0FBQztJQUhlLHdCQUFnQixtQkFHL0IsQ0FBQTtJQUVELHFDQUE0QyxPQUFnQixFQUFFLFNBQW9CLEVBQUUsZ0JBQTJCO1FBQzdHLE1BQU0sQ0FBQyxlQUFZLE9BQU8sZ0NBQXlCLFNBQVMsaUNBQTBCLGdCQUFnQixzQkFBa0IsQ0FBQztJQUMzSCxDQUFDO0lBRmUsbUNBQTJCLDhCQUUxQyxDQUFBO0lBRUQsc0NBQTZDLFNBQW9CLEVBQUUsZ0JBQTJCO1FBQzVGLE1BQU0sQ0FBQyxtQ0FBZ0MsU0FBUyxpQ0FBMEIsZ0JBQWdCLHNCQUFrQixDQUFDO0lBQy9HLENBQUM7SUFGZSxvQ0FBNEIsK0JBRTNDLENBQUE7SUFFRCwyQ0FBa0QsU0FBb0IsRUFBRSxRQUFnQixFQUFFLE9BQWdCO1FBQ3hHLE1BQU0sQ0FBSSxPQUFPLG1CQUFhLFFBQVEsK0NBQXlDLFNBQVMsWUFBUyxDQUFDO0lBQ3BHLENBQUM7SUFGZSx5Q0FBaUMsb0NBRWhELENBQUE7SUFFRCxrQ0FBeUMsSUFBVSxFQUFFLFNBQW9CO1FBQ3ZFLE1BQU0sQ0FBQyxrQkFBZSxTQUFTLHFDQUE4QixJQUFJLFFBQUksQ0FBQztJQUN4RSxDQUFDO0lBRmUsZ0NBQXdCLDJCQUV2QyxDQUFBO0lBRUQsa0NBQTRDLFFBQWdCLEVBQUUsVUFBa0IsRUFBRSxFQUFLLEVBQUUsRUFBSztRQUM1RixNQUFNLENBQUMsaUJBQWUsVUFBVSxvQkFBYyxRQUFRLGNBQU8sRUFBRSxpQkFBVSxFQUFFLHNCQUFlLEVBQUUsUUFBSSxDQUFDO0lBQ25HLENBQUM7SUFGZSxnQ0FBd0IsMkJBRXZDLENBQUE7SUFFRCwrQ0FBc0QsT0FBZ0I7UUFDcEUsTUFBTSxDQUFDLCtDQUE0QyxPQUFPLCtFQUEyRSxDQUFDO0lBQ3hJLENBQUM7SUFGZSw2Q0FBcUMsd0NBRXBELENBQUE7SUFFRCwwQkFBaUMsT0FBZ0I7UUFDL0MsTUFBTSxDQUFDLGdCQUFjLE9BQU8sa0ZBQXlFLENBQUM7SUFDeEcsQ0FBQztJQUZlLHdCQUFnQixtQkFFL0IsQ0FBQTtJQUVELDJCQUFrQyxJQUFpQjtRQUNqRCxNQUFNLENBQUMsOEJBQTJCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLDhEQUEwRCxDQUFDO0lBQ25ILENBQUM7SUFGZSx5QkFBaUIsb0JBRWhDLENBQUE7SUFFWSwrQkFBdUIsR0FBRyx5QkFBeUIsQ0FBQztJQUVwRCwwQkFBa0IsR0FBRywyRkFBMkYsQ0FBQztJQUU5SCxPQUFPO0lBQ00sZ0NBQXdCLEdBQUcsMkJBQTJCLENBQUM7SUFFcEUsUUFBUTtJQUNSLCtCQUFzQyxPQUFnQjtRQUNwRCxNQUFNLENBQUMsb0JBQWlCLE9BQU8saUNBQTBCLE9BQU8sUUFBSSxDQUFDO0lBQ3ZFLENBQUM7SUFGZSw2QkFBcUIsd0JBRXBDLENBQUE7SUFFRCxtQ0FBMEMsU0FBb0I7UUFDNUQsTUFBTSxDQUFDLG9DQUFrQyxTQUFTLE1BQUcsQ0FBQztJQUN4RCxDQUFDO0lBRmUsaUNBQXlCLDRCQUV4QyxDQUFBO0lBRUQsb0NBQTJDLFNBQWlCO1FBQzFELE1BQU0sQ0FBQyxnRkFBNkUsU0FBUyxRQUFJLENBQUM7SUFDcEcsQ0FBQztJQUZlLGtDQUEwQiw2QkFFekMsQ0FBQTtJQUVELFdBQVc7SUFDWCx5QkFBZ0MsUUFBZ0IsRUFBRSxLQUFzQjtRQUN0RSxNQUFNLENBQUMsYUFBVyxRQUFRLFlBQU0sS0FBSyxPQUFHLENBQUM7SUFDM0MsQ0FBQztJQUZlLHVCQUFlLGtCQUU5QixDQUFBO0lBRUQsNkJBQW9DLFlBQW9CO1FBQ3RELE1BQU0sQ0FBQyxpQkFBYyxZQUFZLHNEQUMvQixZQUFZLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsTUFBRyxDQUFDO0lBQzNDLENBQUM7SUFIZSwyQkFBbUIsc0JBR2xDLENBQUE7SUFFRCxvQkFBMkIsQ0FBMEI7UUFDbkQsTUFBTSxDQUFDLGdDQUE4QixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxpREFBOEMsQ0FBQztJQUN2RyxDQUFDO0lBRmUsa0JBQVUsYUFFekIsQ0FBQTtBQUNILENBQUMsRUExTWdCLE9BQU8sR0FBUCxlQUFPLEtBQVAsZUFBTyxRQTBNdkIifQ==