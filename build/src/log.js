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
    // REPEAT
    message.REPEAT_CANNOT_SHARE_AXIS = 'Axes cannot be shared in repeated views.';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7O0FBRUgsdUNBQXdEO0FBY3hEOztHQUVHO0FBQ0gsSUFBTSxJQUFJLEdBQUcsa0JBQU0sQ0FBQyxnQkFBSSxDQUFDLENBQUM7QUFDMUIsSUFBSSxPQUFPLEdBQW9CLElBQUksQ0FBQztBQUVwQzs7R0FFRztBQUNIO0lBQUE7UUFDUyxVQUFLLEdBQVUsRUFBRSxDQUFDO1FBQ2xCLFVBQUssR0FBVSxFQUFFLENBQUM7UUFDbEIsV0FBTSxHQUFVLEVBQUUsQ0FBQztJQW9CNUIsQ0FBQztJQWxCUSwyQkFBSyxHQUFaO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSwwQkFBSSxHQUFYO1FBQVksY0FBYzthQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7WUFBZCx5QkFBYzs7UUFDeEIsQ0FBQSxLQUFBLElBQUksQ0FBQyxLQUFLLENBQUEsQ0FBQyxJQUFJLFdBQUksSUFBSSxFQUFFO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUM7O0lBQ2QsQ0FBQztJQUVNLDBCQUFJLEdBQVg7UUFBWSxjQUFjO2FBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztZQUFkLHlCQUFjOztRQUN4QixDQUFBLEtBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQSxDQUFDLElBQUksV0FBSSxJQUFJLEVBQUU7UUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQzs7SUFDZCxDQUFDO0lBRU0sMkJBQUssR0FBWjtRQUFhLGNBQWM7YUFBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO1lBQWQseUJBQWM7O1FBQ3pCLENBQUEsS0FBQSxJQUFJLENBQUMsTUFBTSxDQUFBLENBQUMsSUFBSSxXQUFJLElBQUksRUFBRTtRQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDOztJQUNkLENBQUM7SUFDSCxrQkFBQztBQUFELENBQUMs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RUQsbUNBQTBDLFNBQW9CO1FBQzVELE1BQU0sQ0FBQyxvQ0FBa0MsU0FBUyxNQUFHLENBQUM7SUFDeEQsQ0FBQztJQUZlLGlDQUF5Qiw0QkFFeEMsQ0FBQTtJQUVELG9DQUEyQyxTQUFpQjtRQUMxRCxNQUFNLENBQUMsZ0ZBQTZFLFNBQVMsUUFBSSxDQUFDO0lBQ3BHLENBQUM7SUFGZSxrQ0FBMEIsNkJBRXpDLENBQUE7SUFFRCxXQUFXO0lBQ1gseUJBQWdDLFFBQWdCLEVBQUUsS0FBc0I7UUFDdEUsTUFBTSxDQUFDLGFBQVcsUUFBUSxZQUFNLEtBQUssT0FBRyxDQUFDO0lBQzNDLENBQUM7SUFGZSx1QkFBZSxrQkFFOUIsQ0FBQTtJQUVELDZCQUFvQyxZQUFvQjtRQUN0RCxNQUFNLENBQUMsaUJBQWMsWUFBWSxzREFDL0IsWUFBWSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLE1BQUcsQ0FBQztJQUMzQyxDQUFDO0lBSGUsMkJBQW1CLHNCQUdsQyxDQUFBO0lBRUQsb0JBQTJCLENBQTBCO1FBQ25ELE1BQU0sQ0FBQyxnQ0FBOEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsaURBQThDLENBQUM7SUFDdkcsQ0FBQztJQUZlLGtCQUFVLGFBRXpCLENBQUE7QUFDSCxDQUFDLEVBN01nQixPQUFPLEdBQVAsZUFBTyxLQUFQLGVBQU8sUUE2TXZCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBWZWdhLUxpdGUncyBzaW5nbGV0b24gbG9nZ2VyIHV0aWxpdHkuXG4gKi9cblxuaW1wb3J0IHtsb2dnZXIsIExvZ2dlckludGVyZmFjZSwgV2Fybn0gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCB7QWdncmVnYXRlT3B9IGZyb20gJy4vYWdncmVnYXRlJztcbmltcG9ydCB7Q2hhbm5lbH0gZnJvbSAnLi9jaGFubmVsJztcbmltcG9ydCB7Q29tcG9zaXRlTWFya30gZnJvbSAnLi9jb21wb3NpdGVtYXJrJztcbmltcG9ydCB7RGF0ZVRpbWUsIERhdGVUaW1lRXhwcn0gZnJvbSAnLi9kYXRldGltZSc7XG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuL2ZpZWxkZGVmJztcbmltcG9ydCB7TWFya30gZnJvbSAnLi9tYXJrJztcbmltcG9ydCB7U2NhbGVUeXBlfSBmcm9tICcuL3NjYWxlJztcbmltcG9ydCB7VHlwZX0gZnJvbSAnLi90eXBlJztcbmltcG9ydCB7VmdTb3J0RmllbGR9IGZyb20gJy4vdmVnYS5zY2hlbWEnO1xuXG5cbmV4cG9ydCB7TG9nZ2VySW50ZXJmYWNlfSBmcm9tICd2ZWdhLXV0aWwnO1xuXG4vKipcbiAqIE1haW4gKGRlZmF1bHQpIFZlZ2EgTG9nZ2VyIGluc3RhbmNlIGZvciBWZWdhLUxpdGVcbiAqL1xuY29uc3QgbWFpbiA9IGxvZ2dlcihXYXJuKTtcbmxldCBjdXJyZW50OiBMb2dnZXJJbnRlcmZhY2UgPSBtYWluO1xuXG4vKipcbiAqIExvZ2dlciB0b29sIGZvciBjaGVja2luZyBpZiB0aGUgY29kZSB0aHJvd3MgY29ycmVjdCB3YXJuaW5nXG4gKi9cbmV4cG9ydCBjbGFzcyBMb2NhbExvZ2dlciBpbXBsZW1lbnRzIExvZ2dlckludGVyZmFjZSB7XG4gIHB1YmxpYyB3YXJuczogYW55W10gPSBbXTtcbiAgcHVibGljIGluZm9zOiBhbnlbXSA9IFtdO1xuICBwdWJsaWMgZGVidWdzOiBhbnlbXSA9IFtdO1xuXG4gIHB1YmxpYyBsZXZlbCgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHB1YmxpYyB3YXJuKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgdGhpcy53YXJucy5wdXNoKC4uLmFyZ3MpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHVibGljIGluZm8oLi4uYXJnczogYW55W10pIHtcbiAgICB0aGlzLmluZm9zLnB1c2goLi4uYXJncyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaWMgZGVidWcoLi4uYXJnczogYW55W10pIHtcbiAgICB0aGlzLmRlYnVncy5wdXNoKC4uLmFyZ3MpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3cmFwKGY6IChsb2dnZXI6IExvY2FsTG9nZ2VyKSA9PiB2b2lkKSB7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgY29uc3QgbG9nZ2VyID0gY3VycmVudCA9IG5ldyBMb2NhbExvZ2dlcigpO1xuICAgIGYobG9nZ2VyKTtcbiAgICByZXNldCgpO1xuICB9O1xufVxuXG4vKipcbiAqIFNldCB0aGUgc2luZ2xldG9uIGxvZ2dlciB0byBiZSBhIGN1c3RvbSBsb2dnZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldChsb2dnZXI6IExvZ2dlckludGVyZmFjZSkge1xuICBjdXJyZW50ID0gbG9nZ2VyO1xuICByZXR1cm4gY3VycmVudDtcbn1cblxuLyoqXG4gKiBSZXNldCB0aGUgbWFpbiBsb2dnZXIgdG8gdXNlIHRoZSBkZWZhdWx0IFZlZ2EgTG9nZ2VyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNldCgpIHtcbiAgY3VycmVudCA9IG1haW47XG4gIHJldHVybiBjdXJyZW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd2FybiguLi5fOiBhbnlbXSkge1xuICBjdXJyZW50Lndhcm4uYXBwbHkoY3VycmVudCwgYXJndW1lbnRzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluZm8oLi4uXzogYW55W10pIHtcbiAgY3VycmVudC5pbmZvLmFwcGx5KGN1cnJlbnQsIGFyZ3VtZW50cyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWJ1ZyguLi5fOiBhbnlbXSkge1xuICBjdXJyZW50LmRlYnVnLmFwcGx5KGN1cnJlbnQsIGFyZ3VtZW50cyk7XG59XG5cbi8qKlxuICogQ29sbGVjdGlvbiBvZiBhbGwgVmVnYS1MaXRlIEVycm9yIE1lc3NhZ2VzXG4gKi9cbmV4cG9ydCBuYW1lc3BhY2UgbWVzc2FnZSB7XG4gIGV4cG9ydCBjb25zdCBJTlZBTElEX1NQRUMgPSAnSW52YWxpZCBzcGVjJztcblxuICAvLyBGSVRcbiAgZXhwb3J0IGNvbnN0IEZJVF9OT05fU0lOR0xFID0gJ0F1dG9zaXplIFwiZml0XCIgb25seSB3b3JrcyBmb3Igc2luZ2xlIHZpZXdzIGFuZCBsYXllcmVkIHZpZXdzLic7XG5cbiAgZXhwb3J0IGNvbnN0IENBTk5PVF9GSVhfUkFOR0VfU1RFUF9XSVRIX0ZJVCA9ICdDYW5ub3QgdXNlIGEgZml4ZWQgdmFsdWUgb2YgXCJyYW5nZVN0ZXBcIiB3aGVuIFwiYXV0b3NpemVcIiBpcyBcImZpdFwiLic7XG5cbiAgLy8gU0VMRUNUSU9OXG4gIGV4cG9ydCBmdW5jdGlvbiBjYW5ub3RQcm9qZWN0T25DaGFubmVsV2l0aG91dEZpZWxkKGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgICByZXR1cm4gYENhbm5vdCBwcm9qZWN0IGEgc2VsZWN0aW9uIG9uIGVuY29kaW5nIGNoYW5uZWwgXCIke2NoYW5uZWx9XCIsIHdoaWNoIGhhcyBubyBmaWVsZC5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIG5lYXJlc3ROb3RTdXBwb3J0Rm9yQ29udGludW91cyhtYXJrOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYFRoZSBcIm5lYXJlc3RcIiB0cmFuc2Zvcm0gaXMgbm90IHN1cHBvcnRlZCBmb3IgJHttYXJrfSBtYXJrcy5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdGlvbk5vdEZvdW5kKG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiBgQ2Fubm90IGZpbmQgYSBzZWxlY3Rpb24gbmFtZWQgXCIke25hbWV9XCJgO1xuICB9XG5cbiAgZXhwb3J0IGNvbnN0IFNDQUxFX0JJTkRJTkdTX0NPTlRJTlVPVVMgPSAnU2NhbGUgYmluZGluZ3MgYXJlIGN1cnJlbnRseSBvbmx5IHN1cHBvcnRlZCBmb3Igc2NhbGVzIHdpdGggdW5iaW5uZWQsIGNvbnRpbnVvdXMgZG9tYWlucy4nO1xuXG4gIC8vIFJFUEVBVFxuICBleHBvcnQgZnVuY3Rpb24gbm9TdWNoUmVwZWF0ZWRWYWx1ZShmaWVsZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBVbmtub3duIHJlcGVhdGVkIHZhbHVlIFwiJHtmaWVsZH1cIi5gO1xuICB9XG5cbiAgLy8gQ09OQ0FUXG4gIGV4cG9ydCBjb25zdCBDT05DQVRfQ0FOTk9UX1NIQVJFX0FYSVMgPSAnQXhlcyBjYW5ub3QgYmUgc2hhcmVkIGluIGNvbmNhdGVuYXRlZCB2aWV3cy4nO1xuXG4gIC8vIFJFUEVBVFxuICBleHBvcnQgY29uc3QgUkVQRUFUX0NBTk5PVF9TSEFSRV9BWElTID0gJ0F4ZXMgY2Fubm90IGJlIHNoYXJlZCBpbiByZXBlYXRlZCB2aWV3cy4nO1xuXG4gIC8vIFRJVExFXG4gIGV4cG9ydCBmdW5jdGlvbiBjYW5ub3RTZXRUaXRsZUFuY2hvcih0eXBlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYENhbm5vdCBzZXQgdGl0bGUgXCJhbmNob3JcIiBmb3IgYSAke3R5cGV9IHNwZWNgO1xuICB9XG5cbiAgLy8gREFUQVxuICBleHBvcnQgZnVuY3Rpb24gdW5yZWNvZ25pemVkUGFyc2UocDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBVbnJlY29nbml6ZWQgcGFyc2UgXCIke3B9XCIuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBkaWZmZXJlbnRQYXJzZShmaWVsZDogc3RyaW5nLCBsb2NhbDogc3RyaW5nLCBhbmNlc3Rvcjogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBBbiBhbmNlc3RvciBwYXJzZWQgZmllbGQgXCIke2ZpZWxkfVwiIGFzICR7YW5jZXN0b3J9IGJ1dCBhIGNoaWxkIHdhbnRzIHRvIHBhcnNlIHRoZSBmaWVsZCBhcyAke2xvY2FsfS5gO1xuICB9XG5cbiAgLy8gVFJBTlNGT1JNU1xuICBleHBvcnQgZnVuY3Rpb24gaW52YWxpZFRyYW5zZm9ybUlnbm9yZWQodHJhbnNmb3JtOiBhbnkpIHtcbiAgICByZXR1cm4gYElnbm9yaW5nIGFuIGludmFsaWQgdHJhbnNmb3JtOiAke0pTT04uc3RyaW5naWZ5KHRyYW5zZm9ybSl9LmA7XG4gIH1cblxuICBleHBvcnQgY29uc3QgTk9fRklFTERTX05FRURTX0FTID0gJ0lmIFwiZnJvbS5maWVsZHNcIiBpcyBub3Qgc3BlY2lmaWVkLCBcImFzXCIgaGFzIHRvIGJlIGEgc3RyaW5nIHRoYXQgc3BlY2lmaWVzIHRoZSBrZXkgdG8gYmUgdXNlZCBmb3IgdGhlIHRoZSBkYXRhIGZyb20gdGhlIHNlY29uZGFyeSBzb3VyY2UuJztcblxuICAvLyBFTkNPRElORyAmIEZBQ0VUXG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHByaW1pdGl2ZUNoYW5uZWxEZWYoY2hhbm5lbDogQ2hhbm5lbCwgdHlwZTogJ3N0cmluZycgfCAnbnVtYmVyJyB8ICdib29sZWFuJywgdmFsdWU6IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gYENoYW5uZWwgJHtjaGFubmVsfSBpcyBhICR7dHlwZX0uIENvbnZlcnRlZCB0byB7dmFsdWU6ICR7dmFsdWV9fS5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGludmFsaWRGaWVsZFR5cGUodHlwZTogVHlwZSkge1xuICAgIHJldHVybiBgSW52YWxpZCBmaWVsZCB0eXBlIFwiJHt0eXBlfVwiYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBpbnZhbGlkRmllbGRUeXBlRm9yQ291bnRBZ2dyZWdhdGUodHlwZTogVHlwZSwgYWdncmVnYXRlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYEludmFsaWQgZmllbGQgdHlwZSBcIiR7dHlwZX1cIiBmb3IgYWdncmVnYXRlOiBcIiR7YWdncmVnYXRlfVwiLCB1c2luZyBcInF1YW50aXRhdGl2ZVwiIGluc3RlYWQuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBpbnZhbGlkQWdncmVnYXRlKGFnZ3JlZ2F0ZTogQWdncmVnYXRlT3AgfCBzdHJpbmcpIHtcbiAgICByZXR1cm4gYEludmFsaWQgYWdncmVnYXRpb24gb3BlcmF0b3IgXCIke2FnZ3JlZ2F0ZX1cImA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gZW1wdHlPckludmFsaWRGaWVsZFR5cGUodHlwZTogVHlwZSB8IHN0cmluZywgY2hhbm5lbDogQ2hhbm5lbCwgbmV3VHlwZTogVHlwZSkge1xuICAgIHJldHVybiBgSW52YWxpZCBmaWVsZCB0eXBlIFwiJHt0eXBlfVwiIGZvciBjaGFubmVsIFwiJHtjaGFubmVsfVwiLCB1c2luZyBcIiR7bmV3VHlwZX1cIiBpbnN0ZWFkLmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gZW1wdHlGaWVsZERlZihmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgIHJldHVybiBgRHJvcHBpbmcgJHtKU09OLnN0cmluZ2lmeShmaWVsZERlZil9IGZyb20gY2hhbm5lbCBcIiR7Y2hhbm5lbH1cIiBzaW5jZSBpdCBkb2VzIG5vdCBjb250YWluIGRhdGEgZmllbGQgb3IgdmFsdWUuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBpbmNvbXBhdGlibGVDaGFubmVsKGNoYW5uZWw6IENoYW5uZWwsIG1hcmtPckZhY2V0OiBNYXJrIHwgJ2ZhY2V0JyB8IENvbXBvc2l0ZU1hcmssIHdoZW4/OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYCR7Y2hhbm5lbH0gZHJvcHBlZCBhcyBpdCBpcyBpbmNvbXBhdGlibGUgd2l0aCBcIiR7bWFya09yRmFjZXR9XCIke3doZW4gPyBgIHdoZW4gJHt3aGVufWAgOiAnJ30uYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBmYWNldENoYW5uZWxTaG91bGRCZURpc2NyZXRlKGNoYW5uZWw6IHN0cmluZykge1xuICAgIHJldHVybiBgJHtjaGFubmVsfSBlbmNvZGluZyBzaG91bGQgYmUgZGlzY3JldGUgKG9yZGluYWwgLyBub21pbmFsIC8gYmlubmVkKS5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGRpc2NyZXRlQ2hhbm5lbENhbm5vdEVuY29kZShjaGFubmVsOiBDaGFubmVsLCB0eXBlOiBUeXBlKSB7XG4gICAgcmV0dXJuIGBVc2luZyBkaXNjcmV0ZSBjaGFubmVsIFwiJHtjaGFubmVsfVwiIHRvIGVuY29kZSBcIiR7dHlwZX1cIiBmaWVsZCBjYW4gYmUgbWlzbGVhZGluZyBhcyBpdCBkb2VzIG5vdCBlbmNvZGUgJHt0eXBlID09PSAnb3JkaW5hbCcgPyAnb3JkZXInIDogJ21hZ25pdHVkZSd9LmA7XG4gIH1cblxuICAvLyBNYXJrXG4gIGV4cG9ydCBjb25zdCBCQVJfV0lUSF9QT0lOVF9TQ0FMRV9BTkRfUkFOR0VTVEVQX05VTEwgPSAnQmFyIG1hcmsgc2hvdWxkIG5vdCBiZSB1c2VkIHdpdGggcG9pbnQgc2NhbGUgd2hlbiByYW5nZVN0ZXAgaXMgbnVsbC4gUGxlYXNlIHVzZSBiYW5kIHNjYWxlIGluc3RlYWQuJztcblxuICBleHBvcnQgZnVuY3Rpb24gdW5jbGVhck9yaWVudENvbnRpbnVvdXMobWFyazogTWFyaykge1xuICAgIHJldHVybiBgQ2Fubm90IGNsZWFybHkgZGV0ZXJtaW5lIG9yaWVudGF0aW9uIGZvciBcIiR7bWFya31cIiBzaW5jZSBib3RoIHggYW5kIHkgY2hhbm5lbCBlbmNvZGUgY29udGlub3VzIGZpZWxkcy4gSW4gdGhpcyBjYXNlLCB3ZSB1c2UgdmVydGljYWwgYnkgZGVmYXVsdGA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gdW5jbGVhck9yaWVudERpc2NyZXRlT3JFbXB0eShtYXJrOiBNYXJrKSB7XG4gICAgcmV0dXJuIGBDYW5ub3QgY2xlYXJseSBkZXRlcm1pbmUgb3JpZW50YXRpb24gZm9yIFwiJHttYXJrfVwiIHNpbmNlIGJvdGggeCBhbmQgeSBjaGFubmVsIGVuY29kZSBkaXNjcmV0ZSBvciBlbXB0eSBmaWVsZHMuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBvcmllbnRPdmVycmlkZGVuKG9yaWdpbmFsOiBzdHJpbmcsIGFjdHVhbDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBTcGVjaWZpZWQgb3JpZW50IFwiJHtvcmlnaW5hbH1cIiBvdmVycmlkZGVuIHdpdGggXCIke2FjdHVhbH1cImA7XG4gIH1cblxuICAvLyBTQ0FMRVxuICBleHBvcnQgY29uc3QgQ0FOTk9UX1VOSU9OX0NVU1RPTV9ET01BSU5fV0lUSF9GSUVMRF9ET01BSU4gPSAnY3VzdG9tIGRvbWFpbiBzY2FsZSBjYW5ub3QgYmUgdW5pb25lZCB3aXRoIGRlZmF1bHQgZmllbGQtYmFzZWQgZG9tYWluJztcblxuICBleHBvcnQgZnVuY3Rpb24gY2Fubm90VXNlU2NhbGVQcm9wZXJ0eVdpdGhOb25Db2xvcihwcm9wOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYENhbm5vdCB1c2UgdGhlIHNjYWxlIHByb3BlcnR5IFwiJHtwcm9wfVwiIHdpdGggbm9uLWNvbG9yIGNoYW5uZWwuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiB1bmFnZ3JlZ2F0ZURvbWFpbkhhc05vRWZmZWN0Rm9yUmF3RmllbGQoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4pIHtcbiAgICByZXR1cm4gYFVzaW5nIHVuYWdncmVnYXRlZCBkb21haW4gd2l0aCByYXcgZmllbGQgaGFzIG5vIGVmZmVjdCAoJHtKU09OLnN0cmluZ2lmeShmaWVsZERlZil9KS5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHVuYWdncmVnYXRlRG9tYWluV2l0aE5vblNoYXJlZERvbWFpbk9wKGFnZ3JlZ2F0ZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBVbmFnZ3JlZ2F0ZWQgZG9tYWluIG5vdCBhcHBsaWNhYmxlIGZvciBcIiR7YWdncmVnYXRlfVwiIHNpbmNlIGl0IHByb2R1Y2VzIHZhbHVlcyBvdXRzaWRlIHRoZSBvcmlnaW4gZG9tYWluIG9mIHRoZSBzb3VyY2UgZGF0YS5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHVuYWdncmVnYXRlZERvbWFpbldpdGhMb2dTY2FsZShmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPikge1xuICAgIHJldHVybiBgVW5hZ2dyZWdhdGVkIGRvbWFpbiBpcyBjdXJyZW50bHkgdW5zdXBwb3J0ZWQgZm9yIGxvZyBzY2FsZSAoJHtKU09OLnN0cmluZ2lmeShmaWVsZERlZil9KS5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGNhbm5vdFVzZVNpemVGaWVsZFdpdGhCYW5kU2l6ZShwb3NpdGlvbkNoYW5uZWw6ICd4J3wneScpIHtcbiAgICByZXR1cm4gYFVzaW5nIHNpemUgZmllbGQgd2hlbiAke3Bvc2l0aW9uQ2hhbm5lbH0tY2hhbm5lbCBoYXMgYSBiYW5kIHNjYWxlIGlzIG5vdCBzdXBwb3J0ZWQuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBjYW5ub3RBcHBseVNpemVUb05vbk9yaWVudGVkTWFyayhtYXJrOiBNYXJrKSB7XG4gICAgcmV0dXJuIGBDYW5ub3QgYXBwbHkgc2l6ZSB0byBub24tb3JpZW50ZWQgbWFyayBcIiR7bWFya31cIi5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHJhbmdlU3RlcERyb3BwZWQoY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgIHJldHVybiBgcmFuZ2VTdGVwIGZvciBcIiR7Y2hhbm5lbH1cIiBpcyBkcm9wcGVkIGFzIHRvcC1sZXZlbCAke1xuICAgICAgY2hhbm5lbCA9PT0gJ3gnID8gJ3dpZHRoJyA6ICdoZWlnaHQnfSBpcyBwcm92aWRlZC5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHNjYWxlVHlwZU5vdFdvcmtXaXRoQ2hhbm5lbChjaGFubmVsOiBDaGFubmVsLCBzY2FsZVR5cGU6IFNjYWxlVHlwZSwgZGVmYXVsdFNjYWxlVHlwZTogU2NhbGVUeXBlKSB7XG4gICAgcmV0dXJuIGBDaGFubmVsIFwiJHtjaGFubmVsfVwiIGRvZXMgbm90IHdvcmsgd2l0aCBcIiR7c2NhbGVUeXBlfVwiIHNjYWxlLiBXZSBhcmUgdXNpbmcgXCIke2RlZmF1bHRTY2FsZVR5cGV9XCIgc2NhbGUgaW5zdGVhZC5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHNjYWxlVHlwZU5vdFdvcmtXaXRoRmllbGREZWYoc2NhbGVUeXBlOiBTY2FsZVR5cGUsIGRlZmF1bHRTY2FsZVR5cGU6IFNjYWxlVHlwZSkge1xuICAgIHJldHVybiBgRmllbGREZWYgZG9lcyBub3Qgd29yayB3aXRoIFwiJHtzY2FsZVR5cGV9XCIgc2NhbGUuIFdlIGFyZSB1c2luZyBcIiR7ZGVmYXVsdFNjYWxlVHlwZX1cIiBzY2FsZSBpbnN0ZWFkLmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gc2NhbGVQcm9wZXJ0eU5vdFdvcmtXaXRoU2NhbGVUeXBlKHNjYWxlVHlwZTogU2NhbGVUeXBlLCBwcm9wTmFtZTogc3RyaW5nLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgcmV0dXJuIGAke2NoYW5uZWx9LXNjYWxlJ3MgXCIke3Byb3BOYW1lfVwiIGlzIGRyb3BwZWQgYXMgaXQgZG9lcyBub3Qgd29yayB3aXRoICR7c2NhbGVUeXBlfSBzY2FsZS5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHNjYWxlVHlwZU5vdFdvcmtXaXRoTWFyayhtYXJrOiBNYXJrLCBzY2FsZVR5cGU6IFNjYWxlVHlwZSkge1xuICAgIHJldHVybiBgU2NhbGUgdHlwZSBcIiR7c2NhbGVUeXBlfVwiIGRvZXMgbm90IHdvcmsgd2l0aCBtYXJrIFwiJHttYXJrfVwiLmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gbWVyZ2VDb25mbGljdGluZ1Byb3BlcnR5PFQ+KHByb3BlcnR5OiBzdHJpbmcsIHByb3BlcnR5T2Y6IHN0cmluZywgdjE6IFQsIHYyOiBUKSB7XG4gICAgcmV0dXJuIGBDb25mbGljdGluZyAke3Byb3BlcnR5T2Z9IHByb3BlcnR5IFwiJHtwcm9wZXJ0eX1cIiAoXCIke3YxfVwiIGFuZCBcIiR7djJ9XCIpLiAgVXNpbmcgXCIke3YxfVwiLmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gaW5kZXBlbmRlbnRTY2FsZU1lYW5zSW5kZXBlbmRlbnRHdWlkZShjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgcmV0dXJuIGBTZXR0aW5nIHRoZSBzY2FsZSB0byBiZSBpbmRlcGVuZGVudCBmb3IgXCIke2NoYW5uZWx9XCIgbWVhbnMgd2UgYWxzbyBoYXZlIHRvIHNldCB0aGUgZ3VpZGUgKGF4aXMgb3IgbGVnZW5kKSB0byBiZSBpbmRlcGVuZGVudC5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGNvbmZsaWN0ZWREb21haW4oY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgIHJldHVybiBgQ2Fubm90IHNldCAke2NoYW5uZWx9LXNjYWxlJ3MgXCJkb21haW5cIiBhcyBpdCBpcyBiaW5uZWQuIFBsZWFzZSB1c2UgXCJiaW5cIidzIFwiZXh0ZW50XCIgaW5zdGVhZC5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGRvbWFpblNvcnREcm9wcGVkKHNvcnQ6IFZnU29ydEZpZWxkKSB7XG4gICAgcmV0dXJuIGBEcm9wcGluZyBzb3J0IHByb3BlcnR5IFwiJHtKU09OLnN0cmluZ2lmeShzb3J0KX1cIiBhcyB1bmlvbmVkIGRvbWFpbnMgb25seSBzdXBwb3J0IGJvb2xlYW4gb3Igb3AgJ2NvdW50Jy5gO1xuICB9XG5cbiAgZXhwb3J0IGNvbnN0IFVOQUJMRV9UT19NRVJHRV9ET01BSU5TID0gJ1VuYWJsZSB0byBtZXJnZSBkb21haW5zJztcblxuICBleHBvcnQgY29uc3QgTU9SRV9USEFOX09ORV9TT1JUID0gJ0RvbWFpbnMgdGhhdCBzaG91bGQgYmUgdW5pb25lZCBoYXMgY29uZmxpY3Rpbmcgc29ydCBwcm9wZXJ0aWVzLiBTb3J0IHdpbGwgYmUgc2V0IHRvIHRydWUuJztcblxuICAvLyBBWElTXG4gIGV4cG9ydCBjb25zdCBJTlZBTElEX0NIQU5ORUxfRk9SX0FYSVMgPSAnSW52YWxpZCBjaGFubmVsIGZvciBheGlzLic7XG5cbiAgLy8gU1RBQ0tcbiAgZXhwb3J0IGZ1bmN0aW9uIGNhbm5vdFN0YWNrUmFuZ2VkTWFyayhjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgcmV0dXJuIGBDYW5ub3Qgc3RhY2sgXCIke2NoYW5uZWx9XCIgaWYgdGhlcmUgaXMgYWxyZWFkeSBcIiR7Y2hhbm5lbH0yXCJgO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGNhbm5vdFN0YWNrTm9uTGluZWFyU2NhbGUoc2NhbGVUeXBlOiBTY2FsZVR5cGUpIHtcbiAgICByZXR1cm4gYENhbm5vdCBzdGFjayBub24tbGluZWFyIHNjYWxlICgke3NjYWxlVHlwZX0pYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBzdGFja05vblN1bW1hdGl2ZUFnZ3JlZ2F0ZShhZ2dyZWdhdGU6IHN0cmluZykge1xuICAgIHJldHVybiBgU3RhY2tpbmcgaXMgYXBwbGllZCBldmVuIHRob3VnaCB0aGUgYWdncmVnYXRlIGZ1bmN0aW9uIGlzIG5vbi1zdW1tYXRpdmUgKFwiJHthZ2dyZWdhdGV9XCIpYDtcbiAgfVxuXG4gIC8vIFRJTUVVTklUXG4gIGV4cG9ydCBmdW5jdGlvbiBpbnZhbGlkVGltZVVuaXQodW5pdE5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZyB8IG51bWJlcikge1xuICAgIHJldHVybiBgSW52YWxpZCAke3VuaXROYW1lfTogXCIke3ZhbHVlfVwiYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBkYXlSZXBsYWNlZFdpdGhEYXRlKGZ1bGxUaW1lVW5pdDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBUaW1lIHVuaXQgXCIke2Z1bGxUaW1lVW5pdH1cIiBpcyBub3Qgc3VwcG9ydGVkLiBXZSBhcmUgcmVwbGFjaW5nIGl0IHdpdGggJHtcbiAgICAgIGZ1bGxUaW1lVW5pdC5yZXBsYWNlKCdkYXknLCAnZGF0ZScpfS5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGRyb3BwZWREYXkoZDogRGF0ZVRpbWUgfCBEYXRlVGltZUV4cHIpIHtcbiAgICByZXR1cm4gYERyb3BwaW5nIGRheSBmcm9tIGRhdGV0aW1lICR7SlNPTi5zdHJpbmdpZnkoZCl9IGFzIGRheSBjYW5ub3QgYmUgY29tYmluZWQgd2l0aCBvdGhlciB1bml0cy5gO1xuICB9XG59XG5cbiJdfQ==