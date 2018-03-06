"use strict";
/**
 * Vega-Lite's singleton logger utility.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var vega_util_1 = require("vega-util");
var util_1 = require("./util");
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
        current = new LocalLogger();
        f(current);
        reset();
    };
}
exports.wrap = wrap;
/**
 * Set the singleton logger to be a custom logger
 */
function set(newLogger) {
    current = newLogger;
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
        return "Ignoring an invalid transform: " + util_1.stringify(transform) + ".";
    }
    message.invalidTransformIgnored = invalidTransformIgnored;
    message.NO_FIELDS_NEEDS_AS = 'If "from.fields" is not specified, "as" has to be a string that specifies the key to be used for the the data from the secondary source.';
    // ENCODING & FACET
    function primitiveChannelDef(channel, type, value) {
        return "Channel " + channel + " is a " + type + ". Converted to {value: " + util_1.stringify(value) + "}.";
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
        return "Dropping " + util_1.stringify(fieldDef) + " from channel \"" + channel + "\" since it does not contain data field or value.";
    }
    message.emptyFieldDef = emptyFieldDef;
    function incompatibleChannel(channel, markOrFacet, when) {
        return channel + " dropped as it is incompatible with \"" + markOrFacet + "\"" + (when ? " when " + when : '') + ".";
    }
    message.incompatibleChannel = incompatibleChannel;
    function invalidEncodingChannel(channel) {
        return channel + "-encoding is dropped as " + channel + " is not a valid encoding channel.";
    }
    message.invalidEncodingChannel = invalidEncodingChannel;
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
        return "Cannot clearly determine orientation for \"" + mark + "\" since both x and y channel encode continuous fields. In this case, we use vertical by default";
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
        return "Using unaggregated domain with raw field has no effect (" + util_1.stringify(fieldDef) + ").";
    }
    message.unaggregateDomainHasNoEffectForRawField = unaggregateDomainHasNoEffectForRawField;
    function unaggregateDomainWithNonSharedDomainOp(aggregate) {
        return "Unaggregated domain not applicable for \"" + aggregate + "\" since it produces values outside the origin domain of the source data.";
    }
    message.unaggregateDomainWithNonSharedDomainOp = unaggregateDomainWithNonSharedDomainOp;
    function unaggregatedDomainWithLogScale(fieldDef) {
        return "Unaggregated domain is currently unsupported for log scale (" + util_1.stringify(fieldDef) + ").";
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
        return "Conflicting " + propertyOf + " property \"" + property + "\" (" + util_1.stringify(v1) + " and " + util_1.stringify(v2) + ").  Using " + util_1.stringify(v1) + ".";
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
        return "Dropping sort property " + util_1.stringify(sort) + " as unioned domains only support boolean or op 'count'.";
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
        return "Invalid " + unitName + ": " + util_1.stringify(value);
    }
    message.invalidTimeUnit = invalidTimeUnit;
    function dayReplacedWithDate(fullTimeUnit) {
        return "Time unit \"" + fullTimeUnit + "\" is not supported. We are replacing it with " + fullTimeUnit.replace('day', 'date') + ".";
    }
    message.dayReplacedWithDate = dayReplacedWithDate;
    function droppedDay(d) {
        return "Dropping day from datetime " + util_1.stringify(d) + " as day cannot be combined with other units.";
    }
    message.droppedDay = droppedDay;
})(message = exports.message || (exports.message = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7O0FBRUgsdUNBQXdEO0FBU3hELCtCQUFpQztBQU1qQzs7R0FFRztBQUNILElBQU0sSUFBSSxHQUFHLGtCQUFNLENBQUMsZ0JBQUksQ0FBQyxDQUFDO0FBQzFCLElBQUksT0FBTyxHQUFvQixJQUFJLENBQUM7QUFFcEM7O0dBRUc7QUFDSDtJQUFBO1FBQ1MsVUFBSyxHQUFVLEVBQUUsQ0FBQztRQUNsQixVQUFLLEdBQVUsRUFBRSxDQUFDO1FBQ2xCLFdBQU0sR0FBVSxFQUFFLENBQUM7SUFvQjVCLENBQUM7SUFsQlEsMkJBQUssR0FBWjtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sMEJBQUksR0FBWDtRQUFZLGNBQWM7YUFBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO1lBQWQseUJBQWM7O1FBQ3hCLENBQUEsS0FBQSxJQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsSUFBSSxXQUFJLElBQUksRUFBRTtRQUN6QixNQUFNLENBQUMsSUFBSSxDQUFDOztJQUNkLENBQUM7SUFFTSwwQkFBSSxHQUFYO1FBQVksY0FBYzthQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7WUFBZCx5QkFBYzs7UUFDeEIsQ0FBQSxLQUFBLElBQUksQ0FBQyxLQUFLLENBQUEsQ0FBQyxJQUFJLFdBQUksSUFBSSxFQUFFO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUM7O0lBQ2QsQ0FBQztJQUVNLDJCQUFLLEdBQVo7UUFBYSxjQUFjO2FBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztZQUFkLHlCQUFjOztRQUN6QixDQUFBLEtBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQSxDQUFDLElBQUksV0FBSSxJQUFJLEVBQUU7UUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQzs7SUFDZCxDQUFDO0lBQ0gsa0JB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QUVwRSxRQUFRO0lBQ1IsK0JBQXNDLE9BQWdCO1FBQ3BELE1BQU0sQ0FBQyxvQkFBaUIsT0FBTyxpQ0FBMEIsT0FBTyxRQUFJLENBQUM7SUFDdkUsQ0FBQztJQUZlLDZCQUFxQix3QkFFcEMsQ0FBQTtJQUVELG1DQUEwQyxTQUFvQjtRQUM1RCxNQUFNLENBQUMsb0NBQWtDLFNBQVMsTUFBRyxDQUFDO0lBQ3hELENBQUM7SUFGZSxpQ0FBeUIsNEJBRXhDLENBQUE7SUFFRCxvQ0FBMkMsU0FBaUI7UUFDMUQsTUFBTSxDQUFDLGdGQUE2RSxTQUFTLFFBQUksQ0FBQztJQUNwRyxDQUFDO0lBRmUsa0NBQTBCLDZCQUV6QyxDQUFBO0lBRUQsV0FBVztJQUNYLHlCQUFnQyxRQUFnQixFQUFFLEtBQXNCO1FBQ3RFLE1BQU0sQ0FBQyxhQUFXLFFBQVEsVUFBSyxnQkFBUyxDQUFDLEtBQUssQ0FBRyxDQUFDO0lBQ3BELENBQUM7SUFGZSx1QkFBZSxrQkFFOUIsQ0FBQTtJQUVELDZCQUFvQyxZQUFvQjtRQUN0RCxNQUFNLENBQUMsaUJBQWMsWUFBWSxzREFDL0IsWUFBWSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLE1BQUcsQ0FBQztJQUMzQyxDQUFDO0lBSGUsMkJBQW1CLHNCQUdsQyxDQUFBO0lBRUQsb0JBQTJCLENBQTBCO1FBQ25ELE1BQU0sQ0FBQyxnQ0FBOEIsZ0JBQVMsQ0FBQyxDQUFDLENBQUMsaURBQThDLENBQUM7SUFDbEcsQ0FBQztJQUZlLGtCQUFVLGFBRXpCLENBQUE7QUFDSCxDQUFDLEVBak5nQixPQUFPLEdBQVAsZUFBTyxLQUFQLGVBQU8sUUFpTnZCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBWZWdhLUxpdGUncyBzaW5nbGV0b24gbG9nZ2VyIHV0aWxpdHkuXG4gKi9cblxuaW1wb3J0IHtsb2dnZXIsIExvZ2dlckludGVyZmFjZSwgV2Fybn0gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCB7QWdncmVnYXRlT3B9IGZyb20gJy4vYWdncmVnYXRlJztcbmltcG9ydCB7Q2hhbm5lbH0gZnJvbSAnLi9jaGFubmVsJztcbmltcG9ydCB7Q29tcG9zaXRlTWFya30gZnJvbSAnLi9jb21wb3NpdGVtYXJrJztcbmltcG9ydCB7RGF0ZVRpbWUsIERhdGVUaW1lRXhwcn0gZnJvbSAnLi9kYXRldGltZSc7XG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuL2ZpZWxkZGVmJztcbmltcG9ydCB7TWFya30gZnJvbSAnLi9tYXJrJztcbmltcG9ydCB7U2NhbGVUeXBlfSBmcm9tICcuL3NjYWxlJztcbmltcG9ydCB7VHlwZX0gZnJvbSAnLi90eXBlJztcbmltcG9ydCB7c3RyaW5naWZ5fSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHtWZ1NvcnRGaWVsZH0gZnJvbSAnLi92ZWdhLnNjaGVtYSc7XG5cblxuZXhwb3J0IHtMb2dnZXJJbnRlcmZhY2V9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5cbi8qKlxuICogTWFpbiAoZGVmYXVsdCkgVmVnYSBMb2dnZXIgaW5zdGFuY2UgZm9yIFZlZ2EtTGl0ZVxuICovXG5jb25zdCBtYWluID0gbG9nZ2VyKFdhcm4pO1xubGV0IGN1cnJlbnQ6IExvZ2dlckludGVyZmFjZSA9IG1haW47XG5cbi8qKlxuICogTG9nZ2VyIHRvb2wgZm9yIGNoZWNraW5nIGlmIHRoZSBjb2RlIHRocm93cyBjb3JyZWN0IHdhcm5pbmdcbiAqL1xuZXhwb3J0IGNsYXNzIExvY2FsTG9nZ2VyIGltcGxlbWVudHMgTG9nZ2VySW50ZXJmYWNlIHtcbiAgcHVibGljIHdhcm5zOiBhbnlbXSA9IFtdO1xuICBwdWJsaWMgaW5mb3M6IGFueVtdID0gW107XG4gIHB1YmxpYyBkZWJ1Z3M6IGFueVtdID0gW107XG5cbiAgcHVibGljIGxldmVsKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHVibGljIHdhcm4oLi4uYXJnczogYW55W10pIHtcbiAgICB0aGlzLndhcm5zLnB1c2goLi4uYXJncyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaWMgaW5mbyguLi5hcmdzOiBhbnlbXSkge1xuICAgIHRoaXMuaW5mb3MucHVzaCguLi5hcmdzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHB1YmxpYyBkZWJ1ZyguLi5hcmdzOiBhbnlbXSkge1xuICAgIHRoaXMuZGVidWdzLnB1c2goLi4uYXJncyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdyYXAoZjogKGxvZ2dlcjogTG9jYWxMb2dnZXIpID0+IHZvaWQpIHtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBjdXJyZW50ID0gbmV3IExvY2FsTG9nZ2VyKCk7XG4gICAgZihjdXJyZW50IGFzIExvY2FsTG9nZ2VyKTtcbiAgICByZXNldCgpO1xuICB9O1xufVxuXG4vKipcbiAqIFNldCB0aGUgc2luZ2xldG9uIGxvZ2dlciB0byBiZSBhIGN1c3RvbSBsb2dnZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldChuZXdMb2dnZXI6IExvZ2dlckludGVyZmFjZSkge1xuICBjdXJyZW50ID0gbmV3TG9nZ2VyO1xuICByZXR1cm4gY3VycmVudDtcbn1cblxuLyoqXG4gKiBSZXNldCB0aGUgbWFpbiBsb2dnZXIgdG8gdXNlIHRoZSBkZWZhdWx0IFZlZ2EgTG9nZ2VyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNldCgpIHtcbiAgY3VycmVudCA9IG1haW47XG4gIHJldHVybiBjdXJyZW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd2FybiguLi5fOiBhbnlbXSkge1xuICBjdXJyZW50Lndhcm4uYXBwbHkoY3VycmVudCwgYXJndW1lbnRzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluZm8oLi4uXzogYW55W10pIHtcbiAgY3VycmVudC5pbmZvLmFwcGx5KGN1cnJlbnQsIGFyZ3VtZW50cyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWJ1ZyguLi5fOiBhbnlbXSkge1xuICBjdXJyZW50LmRlYnVnLmFwcGx5KGN1cnJlbnQsIGFyZ3VtZW50cyk7XG59XG5cbi8qKlxuICogQ29sbGVjdGlvbiBvZiBhbGwgVmVnYS1MaXRlIEVycm9yIE1lc3NhZ2VzXG4gKi9cbmV4cG9ydCBuYW1lc3BhY2UgbWVzc2FnZSB7XG4gIGV4cG9ydCBjb25zdCBJTlZBTElEX1NQRUMgPSAnSW52YWxpZCBzcGVjJztcblxuICAvLyBGSVRcbiAgZXhwb3J0IGNvbnN0IEZJVF9OT05fU0lOR0xFID0gJ0F1dG9zaXplIFwiZml0XCIgb25seSB3b3JrcyBmb3Igc2luZ2xlIHZpZXdzIGFuZCBsYXllcmVkIHZpZXdzLic7XG5cbiAgZXhwb3J0IGNvbnN0IENBTk5PVF9GSVhfUkFOR0VfU1RFUF9XSVRIX0ZJVCA9ICdDYW5ub3QgdXNlIGEgZml4ZWQgdmFsdWUgb2YgXCJyYW5nZVN0ZXBcIiB3aGVuIFwiYXV0b3NpemVcIiBpcyBcImZpdFwiLic7XG5cbiAgLy8gU0VMRUNUSU9OXG4gIGV4cG9ydCBmdW5jdGlvbiBjYW5ub3RQcm9qZWN0T25DaGFubmVsV2l0aG91dEZpZWxkKGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgICByZXR1cm4gYENhbm5vdCBwcm9qZWN0IGEgc2VsZWN0aW9uIG9uIGVuY29kaW5nIGNoYW5uZWwgXCIke2NoYW5uZWx9XCIsIHdoaWNoIGhhcyBubyBmaWVsZC5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIG5lYXJlc3ROb3RTdXBwb3J0Rm9yQ29udGludW91cyhtYXJrOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYFRoZSBcIm5lYXJlc3RcIiB0cmFuc2Zvcm0gaXMgbm90IHN1cHBvcnRlZCBmb3IgJHttYXJrfSBtYXJrcy5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdGlvbk5vdEZvdW5kKG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiBgQ2Fubm90IGZpbmQgYSBzZWxlY3Rpb24gbmFtZWQgXCIke25hbWV9XCJgO1xuICB9XG5cbiAgZXhwb3J0IGNvbnN0IFNDQUxFX0JJTkRJTkdTX0NPTlRJTlVPVVMgPSAnU2NhbGUgYmluZGluZ3MgYXJlIGN1cnJlbnRseSBvbmx5IHN1cHBvcnRlZCBmb3Igc2NhbGVzIHdpdGggdW5iaW5uZWQsIGNvbnRpbnVvdXMgZG9tYWlucy4nO1xuXG4gIC8vIFJFUEVBVFxuICBleHBvcnQgZnVuY3Rpb24gbm9TdWNoUmVwZWF0ZWRWYWx1ZShmaWVsZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBVbmtub3duIHJlcGVhdGVkIHZhbHVlIFwiJHtmaWVsZH1cIi5gO1xuICB9XG5cbiAgLy8gQ09OQ0FUXG4gIGV4cG9ydCBjb25zdCBDT05DQVRfQ0FOTk9UX1NIQVJFX0FYSVMgPSAnQXhlcyBjYW5ub3QgYmUgc2hhcmVkIGluIGNvbmNhdGVuYXRlZCB2aWV3cy4nO1xuXG4gIC8vIFJFUEVBVFxuICBleHBvcnQgY29uc3QgUkVQRUFUX0NBTk5PVF9TSEFSRV9BWElTID0gJ0F4ZXMgY2Fubm90IGJlIHNoYXJlZCBpbiByZXBlYXRlZCB2aWV3cy4nO1xuXG4gIC8vIFRJVExFXG4gIGV4cG9ydCBmdW5jdGlvbiBjYW5ub3RTZXRUaXRsZUFuY2hvcih0eXBlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYENhbm5vdCBzZXQgdGl0bGUgXCJhbmNob3JcIiBmb3IgYSAke3R5cGV9IHNwZWNgO1xuICB9XG5cbiAgLy8gREFUQVxuICBleHBvcnQgZnVuY3Rpb24gdW5yZWNvZ25pemVkUGFyc2UocDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBVbnJlY29nbml6ZWQgcGFyc2UgXCIke3B9XCIuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBkaWZmZXJlbnRQYXJzZShmaWVsZDogc3RyaW5nLCBsb2NhbDogc3RyaW5nLCBhbmNlc3Rvcjogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBBbiBhbmNlc3RvciBwYXJzZWQgZmllbGQgXCIke2ZpZWxkfVwiIGFzICR7YW5jZXN0b3J9IGJ1dCBhIGNoaWxkIHdhbnRzIHRvIHBhcnNlIHRoZSBmaWVsZCBhcyAke2xvY2FsfS5gO1xuICB9XG5cbiAgLy8gVFJBTlNGT1JNU1xuICBleHBvcnQgZnVuY3Rpb24gaW52YWxpZFRyYW5zZm9ybUlnbm9yZWQodHJhbnNmb3JtOiBhbnkpIHtcbiAgICByZXR1cm4gYElnbm9yaW5nIGFuIGludmFsaWQgdHJhbnNmb3JtOiAke3N0cmluZ2lmeSh0cmFuc2Zvcm0pfS5gO1xuICB9XG5cbiAgZXhwb3J0IGNvbnN0IE5PX0ZJRUxEU19ORUVEU19BUyA9ICdJZiBcImZyb20uZmllbGRzXCIgaXMgbm90IHNwZWNpZmllZCwgXCJhc1wiIGhhcyB0byBiZSBhIHN0cmluZyB0aGF0IHNwZWNpZmllcyB0aGUga2V5IHRvIGJlIHVzZWQgZm9yIHRoZSB0aGUgZGF0YSBmcm9tIHRoZSBzZWNvbmRhcnkgc291cmNlLic7XG5cbiAgLy8gRU5DT0RJTkcgJiBGQUNFVFxuXG4gIGV4cG9ydCBmdW5jdGlvbiBwcmltaXRpdmVDaGFubmVsRGVmKGNoYW5uZWw6IENoYW5uZWwsIHR5cGU6ICdzdHJpbmcnIHwgJ251bWJlcicgfCAnYm9vbGVhbicsIHZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuKSB7XG4gICAgcmV0dXJuIGBDaGFubmVsICR7Y2hhbm5lbH0gaXMgYSAke3R5cGV9LiBDb252ZXJ0ZWQgdG8ge3ZhbHVlOiAke3N0cmluZ2lmeSh2YWx1ZSl9fS5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGludmFsaWRGaWVsZFR5cGUodHlwZTogVHlwZSkge1xuICAgIHJldHVybiBgSW52YWxpZCBmaWVsZCB0eXBlIFwiJHt0eXBlfVwiYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBpbnZhbGlkRmllbGRUeXBlRm9yQ291bnRBZ2dyZWdhdGUodHlwZTogVHlwZSwgYWdncmVnYXRlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYEludmFsaWQgZmllbGQgdHlwZSBcIiR7dHlwZX1cIiBmb3IgYWdncmVnYXRlOiBcIiR7YWdncmVnYXRlfVwiLCB1c2luZyBcInF1YW50aXRhdGl2ZVwiIGluc3RlYWQuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBpbnZhbGlkQWdncmVnYXRlKGFnZ3JlZ2F0ZTogQWdncmVnYXRlT3AgfCBzdHJpbmcpIHtcbiAgICByZXR1cm4gYEludmFsaWQgYWdncmVnYXRpb24gb3BlcmF0b3IgXCIke2FnZ3JlZ2F0ZX1cImA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gZW1wdHlPckludmFsaWRGaWVsZFR5cGUodHlwZTogVHlwZSB8IHN0cmluZywgY2hhbm5lbDogQ2hhbm5lbCwgbmV3VHlwZTogVHlwZSkge1xuICAgIHJldHVybiBgSW52YWxpZCBmaWVsZCB0eXBlIFwiJHt0eXBlfVwiIGZvciBjaGFubmVsIFwiJHtjaGFubmVsfVwiLCB1c2luZyBcIiR7bmV3VHlwZX1cIiBpbnN0ZWFkLmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gZW1wdHlGaWVsZERlZihmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgIHJldHVybiBgRHJvcHBpbmcgJHtzdHJpbmdpZnkoZmllbGREZWYpfSBmcm9tIGNoYW5uZWwgXCIke2NoYW5uZWx9XCIgc2luY2UgaXQgZG9lcyBub3QgY29udGFpbiBkYXRhIGZpZWxkIG9yIHZhbHVlLmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gaW5jb21wYXRpYmxlQ2hhbm5lbChjaGFubmVsOiBDaGFubmVsLCBtYXJrT3JGYWNldDogTWFyayB8ICdmYWNldCcgfCBDb21wb3NpdGVNYXJrLCB3aGVuPzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGAke2NoYW5uZWx9IGRyb3BwZWQgYXMgaXQgaXMgaW5jb21wYXRpYmxlIHdpdGggXCIke21hcmtPckZhY2V0fVwiJHt3aGVuID8gYCB3aGVuICR7d2hlbn1gIDogJyd9LmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gaW52YWxpZEVuY29kaW5nQ2hhbm5lbChjaGFubmVsOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYCR7Y2hhbm5lbH0tZW5jb2RpbmcgaXMgZHJvcHBlZCBhcyAke2NoYW5uZWx9IGlzIG5vdCBhIHZhbGlkIGVuY29kaW5nIGNoYW5uZWwuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBmYWNldENoYW5uZWxTaG91bGRCZURpc2NyZXRlKGNoYW5uZWw6IHN0cmluZykge1xuICAgIHJldHVybiBgJHtjaGFubmVsfSBlbmNvZGluZyBzaG91bGQgYmUgZGlzY3JldGUgKG9yZGluYWwgLyBub21pbmFsIC8gYmlubmVkKS5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGRpc2NyZXRlQ2hhbm5lbENhbm5vdEVuY29kZShjaGFubmVsOiBDaGFubmVsLCB0eXBlOiBUeXBlKSB7XG4gICAgcmV0dXJuIGBVc2luZyBkaXNjcmV0ZSBjaGFubmVsIFwiJHtjaGFubmVsfVwiIHRvIGVuY29kZSBcIiR7dHlwZX1cIiBmaWVsZCBjYW4gYmUgbWlzbGVhZGluZyBhcyBpdCBkb2VzIG5vdCBlbmNvZGUgJHt0eXBlID09PSAnb3JkaW5hbCcgPyAnb3JkZXInIDogJ21hZ25pdHVkZSd9LmA7XG4gIH1cblxuICAvLyBNYXJrXG4gIGV4cG9ydCBjb25zdCBCQVJfV0lUSF9QT0lOVF9TQ0FMRV9BTkRfUkFOR0VTVEVQX05VTEwgPSAnQmFyIG1hcmsgc2hvdWxkIG5vdCBiZSB1c2VkIHdpdGggcG9pbnQgc2NhbGUgd2hlbiByYW5nZVN0ZXAgaXMgbnVsbC4gUGxlYXNlIHVzZSBiYW5kIHNjYWxlIGluc3RlYWQuJztcblxuICBleHBvcnQgZnVuY3Rpb24gdW5jbGVhck9yaWVudENvbnRpbnVvdXMobWFyazogTWFyaykge1xuICAgIHJldHVybiBgQ2Fubm90IGNsZWFybHkgZGV0ZXJtaW5lIG9yaWVudGF0aW9uIGZvciBcIiR7bWFya31cIiBzaW5jZSBib3RoIHggYW5kIHkgY2hhbm5lbCBlbmNvZGUgY29udGludW91cyBmaWVsZHMuIEluIHRoaXMgY2FzZSwgd2UgdXNlIHZlcnRpY2FsIGJ5IGRlZmF1bHRgO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHVuY2xlYXJPcmllbnREaXNjcmV0ZU9yRW1wdHkobWFyazogTWFyaykge1xuICAgIHJldHVybiBgQ2Fubm90IGNsZWFybHkgZGV0ZXJtaW5lIG9yaWVudGF0aW9uIGZvciBcIiR7bWFya31cIiBzaW5jZSBib3RoIHggYW5kIHkgY2hhbm5lbCBlbmNvZGUgZGlzY3JldGUgb3IgZW1wdHkgZmllbGRzLmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gb3JpZW50T3ZlcnJpZGRlbihvcmlnaW5hbDogc3RyaW5nLCBhY3R1YWw6IHN0cmluZykge1xuICAgIHJldHVybiBgU3BlY2lmaWVkIG9yaWVudCBcIiR7b3JpZ2luYWx9XCIgb3ZlcnJpZGRlbiB3aXRoIFwiJHthY3R1YWx9XCJgO1xuICB9XG5cbiAgLy8gU0NBTEVcbiAgZXhwb3J0IGNvbnN0IENBTk5PVF9VTklPTl9DVVNUT01fRE9NQUlOX1dJVEhfRklFTERfRE9NQUlOID0gJ2N1c3RvbSBkb21haW4gc2NhbGUgY2Fubm90IGJlIHVuaW9uZWQgd2l0aCBkZWZhdWx0IGZpZWxkLWJhc2VkIGRvbWFpbic7XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGNhbm5vdFVzZVNjYWxlUHJvcGVydHlXaXRoTm9uQ29sb3IocHJvcDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBDYW5ub3QgdXNlIHRoZSBzY2FsZSBwcm9wZXJ0eSBcIiR7cHJvcH1cIiB3aXRoIG5vbi1jb2xvciBjaGFubmVsLmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gdW5hZ2dyZWdhdGVEb21haW5IYXNOb0VmZmVjdEZvclJhd0ZpZWxkKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+KSB7XG4gICAgcmV0dXJuIGBVc2luZyB1bmFnZ3JlZ2F0ZWQgZG9tYWluIHdpdGggcmF3IGZpZWxkIGhhcyBubyBlZmZlY3QgKCR7c3RyaW5naWZ5KGZpZWxkRGVmKX0pLmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gdW5hZ2dyZWdhdGVEb21haW5XaXRoTm9uU2hhcmVkRG9tYWluT3AoYWdncmVnYXRlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYFVuYWdncmVnYXRlZCBkb21haW4gbm90IGFwcGxpY2FibGUgZm9yIFwiJHthZ2dyZWdhdGV9XCIgc2luY2UgaXQgcHJvZHVjZXMgdmFsdWVzIG91dHNpZGUgdGhlIG9yaWdpbiBkb21haW4gb2YgdGhlIHNvdXJjZSBkYXRhLmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gdW5hZ2dyZWdhdGVkRG9tYWluV2l0aExvZ1NjYWxlKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+KSB7XG4gICAgcmV0dXJuIGBVbmFnZ3JlZ2F0ZWQgZG9tYWluIGlzIGN1cnJlbnRseSB1bnN1cHBvcnRlZCBmb3IgbG9nIHNjYWxlICgke3N0cmluZ2lmeShmaWVsZERlZil9KS5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGNhbm5vdFVzZVNpemVGaWVsZFdpdGhCYW5kU2l6ZShwb3NpdGlvbkNoYW5uZWw6ICd4J3wneScpIHtcbiAgICByZXR1cm4gYFVzaW5nIHNpemUgZmllbGQgd2hlbiAke3Bvc2l0aW9uQ2hhbm5lbH0tY2hhbm5lbCBoYXMgYSBiYW5kIHNjYWxlIGlzIG5vdCBzdXBwb3J0ZWQuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBjYW5ub3RBcHBseVNpemVUb05vbk9yaWVudGVkTWFyayhtYXJrOiBNYXJrKSB7XG4gICAgcmV0dXJuIGBDYW5ub3QgYXBwbHkgc2l6ZSB0byBub24tb3JpZW50ZWQgbWFyayBcIiR7bWFya31cIi5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHJhbmdlU3RlcERyb3BwZWQoY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgIHJldHVybiBgcmFuZ2VTdGVwIGZvciBcIiR7Y2hhbm5lbH1cIiBpcyBkcm9wcGVkIGFzIHRvcC1sZXZlbCAke1xuICAgICAgY2hhbm5lbCA9PT0gJ3gnID8gJ3dpZHRoJyA6ICdoZWlnaHQnfSBpcyBwcm92aWRlZC5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHNjYWxlVHlwZU5vdFdvcmtXaXRoQ2hhbm5lbChjaGFubmVsOiBDaGFubmVsLCBzY2FsZVR5cGU6IFNjYWxlVHlwZSwgZGVmYXVsdFNjYWxlVHlwZTogU2NhbGVUeXBlKSB7XG4gICAgcmV0dXJuIGBDaGFubmVsIFwiJHtjaGFubmVsfVwiIGRvZXMgbm90IHdvcmsgd2l0aCBcIiR7c2NhbGVUeXBlfVwiIHNjYWxlLiBXZSBhcmUgdXNpbmcgXCIke2RlZmF1bHRTY2FsZVR5cGV9XCIgc2NhbGUgaW5zdGVhZC5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHNjYWxlVHlwZU5vdFdvcmtXaXRoRmllbGREZWYoc2NhbGVUeXBlOiBTY2FsZVR5cGUsIGRlZmF1bHRTY2FsZVR5cGU6IFNjYWxlVHlwZSkge1xuICAgIHJldHVybiBgRmllbGREZWYgZG9lcyBub3Qgd29yayB3aXRoIFwiJHtzY2FsZVR5cGV9XCIgc2NhbGUuIFdlIGFyZSB1c2luZyBcIiR7ZGVmYXVsdFNjYWxlVHlwZX1cIiBzY2FsZSBpbnN0ZWFkLmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gc2NhbGVQcm9wZXJ0eU5vdFdvcmtXaXRoU2NhbGVUeXBlKHNjYWxlVHlwZTogU2NhbGVUeXBlLCBwcm9wTmFtZTogc3RyaW5nLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgcmV0dXJuIGAke2NoYW5uZWx9LXNjYWxlJ3MgXCIke3Byb3BOYW1lfVwiIGlzIGRyb3BwZWQgYXMgaXQgZG9lcyBub3Qgd29yayB3aXRoICR7c2NhbGVUeXBlfSBzY2FsZS5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHNjYWxlVHlwZU5vdFdvcmtXaXRoTWFyayhtYXJrOiBNYXJrLCBzY2FsZVR5cGU6IFNjYWxlVHlwZSkge1xuICAgIHJldHVybiBgU2NhbGUgdHlwZSBcIiR7c2NhbGVUeXBlfVwiIGRvZXMgbm90IHdvcmsgd2l0aCBtYXJrIFwiJHttYXJrfVwiLmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gbWVyZ2VDb25mbGljdGluZ1Byb3BlcnR5PFQ+KHByb3BlcnR5OiBzdHJpbmcsIHByb3BlcnR5T2Y6IHN0cmluZywgdjE6IFQsIHYyOiBUKSB7XG4gICAgcmV0dXJuIGBDb25mbGljdGluZyAke3Byb3BlcnR5T2Z9IHByb3BlcnR5IFwiJHtwcm9wZXJ0eX1cIiAoJHtzdHJpbmdpZnkodjEpfSBhbmQgJHtzdHJpbmdpZnkodjIpfSkuICBVc2luZyAke3N0cmluZ2lmeSh2MSl9LmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gaW5kZXBlbmRlbnRTY2FsZU1lYW5zSW5kZXBlbmRlbnRHdWlkZShjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgcmV0dXJuIGBTZXR0aW5nIHRoZSBzY2FsZSB0byBiZSBpbmRlcGVuZGVudCBmb3IgXCIke2NoYW5uZWx9XCIgbWVhbnMgd2UgYWxzbyBoYXZlIHRvIHNldCB0aGUgZ3VpZGUgKGF4aXMgb3IgbGVnZW5kKSB0byBiZSBpbmRlcGVuZGVudC5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGNvbmZsaWN0ZWREb21haW4oY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgIHJldHVybiBgQ2Fubm90IHNldCAke2NoYW5uZWx9LXNjYWxlJ3MgXCJkb21haW5cIiBhcyBpdCBpcyBiaW5uZWQuIFBsZWFzZSB1c2UgXCJiaW5cIidzIFwiZXh0ZW50XCIgaW5zdGVhZC5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGRvbWFpblNvcnREcm9wcGVkKHNvcnQ6IFZnU29ydEZpZWxkKSB7XG4gICAgcmV0dXJuIGBEcm9wcGluZyBzb3J0IHByb3BlcnR5ICR7c3RyaW5naWZ5KHNvcnQpfSBhcyB1bmlvbmVkIGRvbWFpbnMgb25seSBzdXBwb3J0IGJvb2xlYW4gb3Igb3AgJ2NvdW50Jy5gO1xuICB9XG5cbiAgZXhwb3J0IGNvbnN0IFVOQUJMRV9UT19NRVJHRV9ET01BSU5TID0gJ1VuYWJsZSB0byBtZXJnZSBkb21haW5zJztcblxuICBleHBvcnQgY29uc3QgTU9SRV9USEFOX09ORV9TT1JUID0gJ0RvbWFpbnMgdGhhdCBzaG91bGQgYmUgdW5pb25lZCBoYXMgY29uZmxpY3Rpbmcgc29ydCBwcm9wZXJ0aWVzLiBTb3J0IHdpbGwgYmUgc2V0IHRvIHRydWUuJztcblxuICAvLyBBWElTXG4gIGV4cG9ydCBjb25zdCBJTlZBTElEX0NIQU5ORUxfRk9SX0FYSVMgPSAnSW52YWxpZCBjaGFubmVsIGZvciBheGlzLic7XG5cbiAgLy8gU1RBQ0tcbiAgZXhwb3J0IGZ1bmN0aW9uIGNhbm5vdFN0YWNrUmFuZ2VkTWFyayhjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgcmV0dXJuIGBDYW5ub3Qgc3RhY2sgXCIke2NoYW5uZWx9XCIgaWYgdGhlcmUgaXMgYWxyZWFkeSBcIiR7Y2hhbm5lbH0yXCJgO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGNhbm5vdFN0YWNrTm9uTGluZWFyU2NhbGUoc2NhbGVUeXBlOiBTY2FsZVR5cGUpIHtcbiAgICByZXR1cm4gYENhbm5vdCBzdGFjayBub24tbGluZWFyIHNjYWxlICgke3NjYWxlVHlwZX0pYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBzdGFja05vblN1bW1hdGl2ZUFnZ3JlZ2F0ZShhZ2dyZWdhdGU6IHN0cmluZykge1xuICAgIHJldHVybiBgU3RhY2tpbmcgaXMgYXBwbGllZCBldmVuIHRob3VnaCB0aGUgYWdncmVnYXRlIGZ1bmN0aW9uIGlzIG5vbi1zdW1tYXRpdmUgKFwiJHthZ2dyZWdhdGV9XCIpYDtcbiAgfVxuXG4gIC8vIFRJTUVVTklUXG4gIGV4cG9ydCBmdW5jdGlvbiBpbnZhbGlkVGltZVVuaXQodW5pdE5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZyB8IG51bWJlcikge1xuICAgIHJldHVybiBgSW52YWxpZCAke3VuaXROYW1lfTogJHtzdHJpbmdpZnkodmFsdWUpfWA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gZGF5UmVwbGFjZWRXaXRoRGF0ZShmdWxsVGltZVVuaXQ6IHN0cmluZykge1xuICAgIHJldHVybiBgVGltZSB1bml0IFwiJHtmdWxsVGltZVVuaXR9XCIgaXMgbm90IHN1cHBvcnRlZC4gV2UgYXJlIHJlcGxhY2luZyBpdCB3aXRoICR7XG4gICAgICBmdWxsVGltZVVuaXQucmVwbGFjZSgnZGF5JywgJ2RhdGUnKX0uYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBkcm9wcGVkRGF5KGQ6IERhdGVUaW1lIHwgRGF0ZVRpbWVFeHByKSB7XG4gICAgcmV0dXJuIGBEcm9wcGluZyBkYXkgZnJvbSBkYXRldGltZSAke3N0cmluZ2lmeShkKX0gYXMgZGF5IGNhbm5vdCBiZSBjb21iaW5lZCB3aXRoIG90aGVyIHVuaXRzLmA7XG4gIH1cbn1cblxuIl19