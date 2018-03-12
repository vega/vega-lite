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
    function encodingOverridden(channels) {
        return "Layer's shared " + channels.join(',') + " channel " + (channels.length === 1 ? 'is' : 'are') + " overriden";
    }
    message.encodingOverridden = encodingOverridden;
    function projectionOverridden(opt) {
        var parentProjection = opt.parentProjection, projection = opt.projection;
        return "Layer's shared projection " + util_1.stringify(parentProjection) + " is overridden by a child projection " + util_1.stringify(projection) + ".";
    }
    message.projectionOverridden = projectionOverridden;
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
    function latLongDeprecated(channel, type, newChannel) {
        return channel + "-encoding with type " + type + " is deprecated. Replacing with " + newChannel + "-encoding.";
    }
    message.latLongDeprecated = latLongDeprecated;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7O0FBR0gsdUNBQXdEO0FBU3hELCtCQUFpQztBQU1qQzs7R0FFRztBQUNILElBQU0sSUFBSSxHQUFHLGtCQUFNLENBQUMsZ0JBQUksQ0FBQyxDQUFDO0FBQzFCLElBQUksT0FBTyxHQUFvQixJQUFJLENBQUM7QUFFcEM7O0dBRUc7QUFDSDtJQUFBO1FBQ1MsVUFBSyxHQUFVLEVBQUUsQ0FBQztRQUNsQixVQUFLLEdBQVUsRUFBRSxDQUFDO1FBQ2xCLFdBQU0sR0FBVSxFQUFFLENBQUM7SUFvQjVCLENBQUM7SUFsQlEsMkJBQUssR0FBWjtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sMEJBQUksR0FBWDtRQUFZLGNBQWM7YUFBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO1lBQWQseUJBQWM7O1FBQ3hCLENBQUEsS0FBQSxJQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsSUFBSSxXQUFJLElBQUksRUFBRTtRQUN6QixNQUFNLENBQUMsSUFBSSxDQUFDOztJQUNkLENBQUM7SUFFTSwwQkFBSSxHQUFYO1FBQVksY0FBYzthQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7WUFBZCx5QkFBYzs7UUFDeEIsQ0FBQSxLQUFBLElBQUksQ0FBQyxLQUFLLENBQUEsQ0FBQyxJQUFJLFdBQUksSUFBSSxFQUFFO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUM7O0lBQ2QsQ0FBQztJQUVNLDJCQUFLLEdBQVo7UUFBYSxjQUFjO2FBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztZQUFkLHlCQUFjOztRQUN6QixDQUFBLEtBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQSxDQUFDLElBQUksV0FBSSxJQUFJLEVBQUU7UUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQzs7SUFDZCxDQUFDO0lBQ0gsa0JB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LGtCQUU5QixDQUFBO0lBRUQsNkJBQW9DLFlBQW9CO1FBQ3RELE1BQU0sQ0FBQyxpQkFBYyxZQUFZLHNEQUMvQixZQUFZLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsTUFBRyxDQUFDO0lBQzNDLENBQUM7SUFIZSwyQkFBbUIsc0JBR2xDLENBQUE7SUFFRCxvQkFBMkIsQ0FBMEI7UUFDbkQsTUFBTSxDQUFDLGdDQUE4QixnQkFBUyxDQUFDLENBQUMsQ0FBQyxpREFBOEMsQ0FBQztJQUNsRyxDQUFDO0lBRmUsa0JBQVUsYUFFekIsQ0FBQTtBQUNILENBQUMsRUE1TmdCLE9BQU8sR0FBUCxlQUFPLEtBQVAsZUFBTyxRQTROdkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFZlZ2EtTGl0ZSdzIHNpbmdsZXRvbiBsb2dnZXIgdXRpbGl0eS5cbiAqL1xuXG5pbXBvcnQge0FnZ3JlZ2F0ZU9wfSBmcm9tICd2ZWdhJztcbmltcG9ydCB7bG9nZ2VyLCBMb2dnZXJJbnRlcmZhY2UsIFdhcm59IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge0NoYW5uZWwsIEdlb1Bvc2l0aW9uQ2hhbm5lbH0gZnJvbSAnLi9jaGFubmVsJztcbmltcG9ydCB7Q29tcG9zaXRlTWFya30gZnJvbSAnLi9jb21wb3NpdGVtYXJrJztcbmltcG9ydCB7RGF0ZVRpbWUsIERhdGVUaW1lRXhwcn0gZnJvbSAnLi9kYXRldGltZSc7XG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuL2ZpZWxkZGVmJztcbmltcG9ydCB7TWFya30gZnJvbSAnLi9tYXJrJztcbmltcG9ydCB7UHJvamVjdGlvbn0gZnJvbSAnLi9wcm9qZWN0aW9uJztcbmltcG9ydCB7U2NhbGVUeXBlfSBmcm9tICcuL3NjYWxlJztcbmltcG9ydCB7VHlwZX0gZnJvbSAnLi90eXBlJztcbmltcG9ydCB7c3RyaW5naWZ5fSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHtWZ1NvcnRGaWVsZH0gZnJvbSAnLi92ZWdhLnNjaGVtYSc7XG5cblxuZXhwb3J0IHtMb2dnZXJJbnRlcmZhY2V9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5cbi8qKlxuICogTWFpbiAoZGVmYXVsdCkgVmVnYSBMb2dnZXIgaW5zdGFuY2UgZm9yIFZlZ2EtTGl0ZVxuICovXG5jb25zdCBtYWluID0gbG9nZ2VyKFdhcm4pO1xubGV0IGN1cnJlbnQ6IExvZ2dlckludGVyZmFjZSA9IG1haW47XG5cbi8qKlxuICogTG9nZ2VyIHRvb2wgZm9yIGNoZWNraW5nIGlmIHRoZSBjb2RlIHRocm93cyBjb3JyZWN0IHdhcm5pbmdcbiAqL1xuZXhwb3J0IGNsYXNzIExvY2FsTG9nZ2VyIGltcGxlbWVudHMgTG9nZ2VySW50ZXJmYWNlIHtcbiAgcHVibGljIHdhcm5zOiBhbnlbXSA9IFtdO1xuICBwdWJsaWMgaW5mb3M6IGFueVtdID0gW107XG4gIHB1YmxpYyBkZWJ1Z3M6IGFueVtdID0gW107XG5cbiAgcHVibGljIGxldmVsKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHVibGljIHdhcm4oLi4uYXJnczogYW55W10pIHtcbiAgICB0aGlzLndhcm5zLnB1c2goLi4uYXJncyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaWMgaW5mbyguLi5hcmdzOiBhbnlbXSkge1xuICAgIHRoaXMuaW5mb3MucHVzaCguLi5hcmdzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHB1YmxpYyBkZWJ1ZyguLi5hcmdzOiBhbnlbXSkge1xuICAgIHRoaXMuZGVidWdzLnB1c2goLi4uYXJncyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdyYXAoZjogKGxvZ2dlcjogTG9jYWxMb2dnZXIpID0+IHZvaWQpIHtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBjdXJyZW50ID0gbmV3IExvY2FsTG9nZ2VyKCk7XG4gICAgZihjdXJyZW50IGFzIExvY2FsTG9nZ2VyKTtcbiAgICByZXNldCgpO1xuICB9O1xufVxuXG4vKipcbiAqIFNldCB0aGUgc2luZ2xldG9uIGxvZ2dlciB0byBiZSBhIGN1c3RvbSBsb2dnZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldChuZXdMb2dnZXI6IExvZ2dlckludGVyZmFjZSkge1xuICBjdXJyZW50ID0gbmV3TG9nZ2VyO1xuICByZXR1cm4gY3VycmVudDtcbn1cblxuLyoqXG4gKiBSZXNldCB0aGUgbWFpbiBsb2dnZXIgdG8gdXNlIHRoZSBkZWZhdWx0IFZlZ2EgTG9nZ2VyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNldCgpIHtcbiAgY3VycmVudCA9IG1haW47XG4gIHJldHVybiBjdXJyZW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd2FybiguLi5fOiBhbnlbXSkge1xuICBjdXJyZW50Lndhcm4uYXBwbHkoY3VycmVudCwgYXJndW1lbnRzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluZm8oLi4uXzogYW55W10pIHtcbiAgY3VycmVudC5pbmZvLmFwcGx5KGN1cnJlbnQsIGFyZ3VtZW50cyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWJ1ZyguLi5fOiBhbnlbXSkge1xuICBjdXJyZW50LmRlYnVnLmFwcGx5KGN1cnJlbnQsIGFyZ3VtZW50cyk7XG59XG5cbi8qKlxuICogQ29sbGVjdGlvbiBvZiBhbGwgVmVnYS1MaXRlIEVycm9yIE1lc3NhZ2VzXG4gKi9cbmV4cG9ydCBuYW1lc3BhY2UgbWVzc2FnZSB7XG4gIGV4cG9ydCBjb25zdCBJTlZBTElEX1NQRUMgPSAnSW52YWxpZCBzcGVjJztcblxuICAvLyBGSVRcbiAgZXhwb3J0IGNvbnN0IEZJVF9OT05fU0lOR0xFID0gJ0F1dG9zaXplIFwiZml0XCIgb25seSB3b3JrcyBmb3Igc2luZ2xlIHZpZXdzIGFuZCBsYXllcmVkIHZpZXdzLic7XG5cbiAgZXhwb3J0IGNvbnN0IENBTk5PVF9GSVhfUkFOR0VfU1RFUF9XSVRIX0ZJVCA9ICdDYW5ub3QgdXNlIGEgZml4ZWQgdmFsdWUgb2YgXCJyYW5nZVN0ZXBcIiB3aGVuIFwiYXV0b3NpemVcIiBpcyBcImZpdFwiLic7XG5cbiAgLy8gU0VMRUNUSU9OXG4gIGV4cG9ydCBmdW5jdGlvbiBjYW5ub3RQcm9qZWN0T25DaGFubmVsV2l0aG91dEZpZWxkKGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgICByZXR1cm4gYENhbm5vdCBwcm9qZWN0IGEgc2VsZWN0aW9uIG9uIGVuY29kaW5nIGNoYW5uZWwgXCIke2NoYW5uZWx9XCIsIHdoaWNoIGhhcyBubyBmaWVsZC5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIG5lYXJlc3ROb3RTdXBwb3J0Rm9yQ29udGludW91cyhtYXJrOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYFRoZSBcIm5lYXJlc3RcIiB0cmFuc2Zvcm0gaXMgbm90IHN1cHBvcnRlZCBmb3IgJHttYXJrfSBtYXJrcy5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdGlvbk5vdEZvdW5kKG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiBgQ2Fubm90IGZpbmQgYSBzZWxlY3Rpb24gbmFtZWQgXCIke25hbWV9XCJgO1xuICB9XG5cbiAgZXhwb3J0IGNvbnN0IFNDQUxFX0JJTkRJTkdTX0NPTlRJTlVPVVMgPSAnU2NhbGUgYmluZGluZ3MgYXJlIGN1cnJlbnRseSBvbmx5IHN1cHBvcnRlZCBmb3Igc2NhbGVzIHdpdGggdW5iaW5uZWQsIGNvbnRpbnVvdXMgZG9tYWlucy4nO1xuXG4gIC8vIFJFUEVBVFxuICBleHBvcnQgZnVuY3Rpb24gbm9TdWNoUmVwZWF0ZWRWYWx1ZShmaWVsZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBVbmtub3duIHJlcGVhdGVkIHZhbHVlIFwiJHtmaWVsZH1cIi5gO1xuICB9XG5cbiAgLy8gQ09OQ0FUXG4gIGV4cG9ydCBjb25zdCBDT05DQVRfQ0FOTk9UX1NIQVJFX0FYSVMgPSAnQXhlcyBjYW5ub3QgYmUgc2hhcmVkIGluIGNvbmNhdGVuYXRlZCB2aWV3cy4nO1xuXG4gIC8vIFJFUEVBVFxuICBleHBvcnQgY29uc3QgUkVQRUFUX0NBTk5PVF9TSEFSRV9BWElTID0gJ0F4ZXMgY2Fubm90IGJlIHNoYXJlZCBpbiByZXBlYXRlZCB2aWV3cy4nO1xuXG4gIC8vIFRJVExFXG4gIGV4cG9ydCBmdW5jdGlvbiBjYW5ub3RTZXRUaXRsZUFuY2hvcih0eXBlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYENhbm5vdCBzZXQgdGl0bGUgXCJhbmNob3JcIiBmb3IgYSAke3R5cGV9IHNwZWNgO1xuICB9XG5cbiAgLy8gREFUQVxuICBleHBvcnQgZnVuY3Rpb24gdW5yZWNvZ25pemVkUGFyc2UocDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBVbnJlY29nbml6ZWQgcGFyc2UgXCIke3B9XCIuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBkaWZmZXJlbnRQYXJzZShmaWVsZDogc3RyaW5nLCBsb2NhbDogc3RyaW5nLCBhbmNlc3Rvcjogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBBbiBhbmNlc3RvciBwYXJzZWQgZmllbGQgXCIke2ZpZWxkfVwiIGFzICR7YW5jZXN0b3J9IGJ1dCBhIGNoaWxkIHdhbnRzIHRvIHBhcnNlIHRoZSBmaWVsZCBhcyAke2xvY2FsfS5gO1xuICB9XG5cbiAgLy8gVFJBTlNGT1JNU1xuICBleHBvcnQgZnVuY3Rpb24gaW52YWxpZFRyYW5zZm9ybUlnbm9yZWQodHJhbnNmb3JtOiBhbnkpIHtcbiAgICByZXR1cm4gYElnbm9yaW5nIGFuIGludmFsaWQgdHJhbnNmb3JtOiAke3N0cmluZ2lmeSh0cmFuc2Zvcm0pfS5gO1xuICB9XG5cbiAgZXhwb3J0IGNvbnN0IE5PX0ZJRUxEU19ORUVEU19BUyA9ICdJZiBcImZyb20uZmllbGRzXCIgaXMgbm90IHNwZWNpZmllZCwgXCJhc1wiIGhhcyB0byBiZSBhIHN0cmluZyB0aGF0IHNwZWNpZmllcyB0aGUga2V5IHRvIGJlIHVzZWQgZm9yIHRoZSB0aGUgZGF0YSBmcm9tIHRoZSBzZWNvbmRhcnkgc291cmNlLic7XG5cbiAgLy8gRU5DT0RJTkcgJiBGQUNFVFxuXG4gIGV4cG9ydCBmdW5jdGlvbiBlbmNvZGluZ092ZXJyaWRkZW4oY2hhbm5lbHM6IENoYW5uZWxbXSkge1xuICAgIHJldHVybiBgTGF5ZXIncyBzaGFyZWQgJHtjaGFubmVscy5qb2luKCcsJyl9IGNoYW5uZWwgJHtjaGFubmVscy5sZW5ndGggPT09IDEgPyAnaXMnIDogJ2FyZSd9IG92ZXJyaWRlbmA7XG4gIH1cbiAgZXhwb3J0IGZ1bmN0aW9uIHByb2plY3Rpb25PdmVycmlkZGVuKG9wdDoge3BhcmVudFByb2plY3Rpb246IFByb2plY3Rpb24sIHByb2plY3Rpb246IFByb2plY3Rpb259KSB7XG4gICAgY29uc3Qge3BhcmVudFByb2plY3Rpb24sIHByb2plY3Rpb259ID0gb3B0O1xuICAgIHJldHVybiBgTGF5ZXIncyBzaGFyZWQgcHJvamVjdGlvbiAke3N0cmluZ2lmeShwYXJlbnRQcm9qZWN0aW9uKX0gaXMgb3ZlcnJpZGRlbiBieSBhIGNoaWxkIHByb2plY3Rpb24gJHtzdHJpbmdpZnkocHJvamVjdGlvbil9LmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gcHJpbWl0aXZlQ2hhbm5lbERlZihjaGFubmVsOiBDaGFubmVsLCB0eXBlOiAnc3RyaW5nJyB8ICdudW1iZXInIHwgJ2Jvb2xlYW4nLCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbikge1xuICAgIHJldHVybiBgQ2hhbm5lbCAke2NoYW5uZWx9IGlzIGEgJHt0eXBlfS4gQ29udmVydGVkIHRvIHt2YWx1ZTogJHtzdHJpbmdpZnkodmFsdWUpfX0uYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBpbnZhbGlkRmllbGRUeXBlKHR5cGU6IFR5cGUpIHtcbiAgICByZXR1cm4gYEludmFsaWQgZmllbGQgdHlwZSBcIiR7dHlwZX1cImA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gaW52YWxpZEZpZWxkVHlwZUZvckNvdW50QWdncmVnYXRlKHR5cGU6IFR5cGUsIGFnZ3JlZ2F0ZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBJbnZhbGlkIGZpZWxkIHR5cGUgXCIke3R5cGV9XCIgZm9yIGFnZ3JlZ2F0ZTogXCIke2FnZ3JlZ2F0ZX1cIiwgdXNpbmcgXCJxdWFudGl0YXRpdmVcIiBpbnN0ZWFkLmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gaW52YWxpZEFnZ3JlZ2F0ZShhZ2dyZWdhdGU6IEFnZ3JlZ2F0ZU9wIHwgc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBJbnZhbGlkIGFnZ3JlZ2F0aW9uIG9wZXJhdG9yIFwiJHthZ2dyZWdhdGV9XCJgO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGVtcHR5T3JJbnZhbGlkRmllbGRUeXBlKHR5cGU6IFR5cGUgfCBzdHJpbmcsIGNoYW5uZWw6IENoYW5uZWwsIG5ld1R5cGU6IFR5cGUpIHtcbiAgICByZXR1cm4gYEludmFsaWQgZmllbGQgdHlwZSBcIiR7dHlwZX1cIiBmb3IgY2hhbm5lbCBcIiR7Y2hhbm5lbH1cIiwgdXNpbmcgXCIke25ld1R5cGV9XCIgaW5zdGVhZC5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGVtcHR5RmllbGREZWYoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgICByZXR1cm4gYERyb3BwaW5nICR7c3RyaW5naWZ5KGZpZWxkRGVmKX0gZnJvbSBjaGFubmVsIFwiJHtjaGFubmVsfVwiIHNpbmNlIGl0IGRvZXMgbm90IGNvbnRhaW4gZGF0YSBmaWVsZCBvciB2YWx1ZS5gO1xuICB9XG4gIGV4cG9ydCBmdW5jdGlvbiBsYXRMb25nRGVwcmVjYXRlZChjaGFubmVsOiBDaGFubmVsLCB0eXBlOiBUeXBlLCBuZXdDaGFubmVsOiBHZW9Qb3NpdGlvbkNoYW5uZWwpIHtcbiAgICByZXR1cm4gYCR7Y2hhbm5lbH0tZW5jb2Rpbmcgd2l0aCB0eXBlICR7dHlwZX0gaXMgZGVwcmVjYXRlZC4gUmVwbGFjaW5nIHdpdGggJHtuZXdDaGFubmVsfS1lbmNvZGluZy5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGluY29tcGF0aWJsZUNoYW5uZWwoY2hhbm5lbDogQ2hhbm5lbCwgbWFya09yRmFjZXQ6IE1hcmsgfCAnZmFjZXQnIHwgQ29tcG9zaXRlTWFyaywgd2hlbj86IHN0cmluZykge1xuICAgIHJldHVybiBgJHtjaGFubmVsfSBkcm9wcGVkIGFzIGl0IGlzIGluY29tcGF0aWJsZSB3aXRoIFwiJHttYXJrT3JGYWNldH1cIiR7d2hlbiA/IGAgd2hlbiAke3doZW59YCA6ICcnfS5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGludmFsaWRFbmNvZGluZ0NoYW5uZWwoY2hhbm5lbDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGAke2NoYW5uZWx9LWVuY29kaW5nIGlzIGRyb3BwZWQgYXMgJHtjaGFubmVsfSBpcyBub3QgYSB2YWxpZCBlbmNvZGluZyBjaGFubmVsLmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gZmFjZXRDaGFubmVsU2hvdWxkQmVEaXNjcmV0ZShjaGFubmVsOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYCR7Y2hhbm5lbH0gZW5jb2Rpbmcgc2hvdWxkIGJlIGRpc2NyZXRlIChvcmRpbmFsIC8gbm9taW5hbCAvIGJpbm5lZCkuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBkaXNjcmV0ZUNoYW5uZWxDYW5ub3RFbmNvZGUoY2hhbm5lbDogQ2hhbm5lbCwgdHlwZTogVHlwZSkge1xuICAgIHJldHVybiBgVXNpbmcgZGlzY3JldGUgY2hhbm5lbCBcIiR7Y2hhbm5lbH1cIiB0byBlbmNvZGUgXCIke3R5cGV9XCIgZmllbGQgY2FuIGJlIG1pc2xlYWRpbmcgYXMgaXQgZG9lcyBub3QgZW5jb2RlICR7dHlwZSA9PT0gJ29yZGluYWwnID8gJ29yZGVyJyA6ICdtYWduaXR1ZGUnfS5gO1xuICB9XG5cbiAgLy8gTWFya1xuICBleHBvcnQgY29uc3QgQkFSX1dJVEhfUE9JTlRfU0NBTEVfQU5EX1JBTkdFU1RFUF9OVUxMID0gJ0JhciBtYXJrIHNob3VsZCBub3QgYmUgdXNlZCB3aXRoIHBvaW50IHNjYWxlIHdoZW4gcmFuZ2VTdGVwIGlzIG51bGwuIFBsZWFzZSB1c2UgYmFuZCBzY2FsZSBpbnN0ZWFkLic7XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHVuY2xlYXJPcmllbnRDb250aW51b3VzKG1hcms6IE1hcmspIHtcbiAgICByZXR1cm4gYENhbm5vdCBjbGVhcmx5IGRldGVybWluZSBvcmllbnRhdGlvbiBmb3IgXCIke21hcmt9XCIgc2luY2UgYm90aCB4IGFuZCB5IGNoYW5uZWwgZW5jb2RlIGNvbnRpbnVvdXMgZmllbGRzLiBJbiB0aGlzIGNhc2UsIHdlIHVzZSB2ZXJ0aWNhbCBieSBkZWZhdWx0YDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiB1bmNsZWFyT3JpZW50RGlzY3JldGVPckVtcHR5KG1hcms6IE1hcmspIHtcbiAgICByZXR1cm4gYENhbm5vdCBjbGVhcmx5IGRldGVybWluZSBvcmllbnRhdGlvbiBmb3IgXCIke21hcmt9XCIgc2luY2UgYm90aCB4IGFuZCB5IGNoYW5uZWwgZW5jb2RlIGRpc2NyZXRlIG9yIGVtcHR5IGZpZWxkcy5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIG9yaWVudE92ZXJyaWRkZW4ob3JpZ2luYWw6IHN0cmluZywgYWN0dWFsOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYFNwZWNpZmllZCBvcmllbnQgXCIke29yaWdpbmFsfVwiIG92ZXJyaWRkZW4gd2l0aCBcIiR7YWN0dWFsfVwiYDtcbiAgfVxuXG4gIC8vIFNDQUxFXG4gIGV4cG9ydCBjb25zdCBDQU5OT1RfVU5JT05fQ1VTVE9NX0RPTUFJTl9XSVRIX0ZJRUxEX0RPTUFJTiA9ICdjdXN0b20gZG9tYWluIHNjYWxlIGNhbm5vdCBiZSB1bmlvbmVkIHdpdGggZGVmYXVsdCBmaWVsZC1iYXNlZCBkb21haW4nO1xuXG4gIGV4cG9ydCBmdW5jdGlvbiBjYW5ub3RVc2VTY2FsZVByb3BlcnR5V2l0aE5vbkNvbG9yKHByb3A6IHN0cmluZykge1xuICAgIHJldHVybiBgQ2Fubm90IHVzZSB0aGUgc2NhbGUgcHJvcGVydHkgXCIke3Byb3B9XCIgd2l0aCBub24tY29sb3IgY2hhbm5lbC5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHVuYWdncmVnYXRlRG9tYWluSGFzTm9FZmZlY3RGb3JSYXdGaWVsZChmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPikge1xuICAgIHJldHVybiBgVXNpbmcgdW5hZ2dyZWdhdGVkIGRvbWFpbiB3aXRoIHJhdyBmaWVsZCBoYXMgbm8gZWZmZWN0ICgke3N0cmluZ2lmeShmaWVsZERlZil9KS5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHVuYWdncmVnYXRlRG9tYWluV2l0aE5vblNoYXJlZERvbWFpbk9wKGFnZ3JlZ2F0ZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBVbmFnZ3JlZ2F0ZWQgZG9tYWluIG5vdCBhcHBsaWNhYmxlIGZvciBcIiR7YWdncmVnYXRlfVwiIHNpbmNlIGl0IHByb2R1Y2VzIHZhbHVlcyBvdXRzaWRlIHRoZSBvcmlnaW4gZG9tYWluIG9mIHRoZSBzb3VyY2UgZGF0YS5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHVuYWdncmVnYXRlZERvbWFpbldpdGhMb2dTY2FsZShmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPikge1xuICAgIHJldHVybiBgVW5hZ2dyZWdhdGVkIGRvbWFpbiBpcyBjdXJyZW50bHkgdW5zdXBwb3J0ZWQgZm9yIGxvZyBzY2FsZSAoJHtzdHJpbmdpZnkoZmllbGREZWYpfSkuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBjYW5ub3RVc2VTaXplRmllbGRXaXRoQmFuZFNpemUocG9zaXRpb25DaGFubmVsOiAneCd8J3knKSB7XG4gICAgcmV0dXJuIGBVc2luZyBzaXplIGZpZWxkIHdoZW4gJHtwb3NpdGlvbkNoYW5uZWx9LWNoYW5uZWwgaGFzIGEgYmFuZCBzY2FsZSBpcyBub3Qgc3VwcG9ydGVkLmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gY2Fubm90QXBwbHlTaXplVG9Ob25PcmllbnRlZE1hcmsobWFyazogTWFyaykge1xuICAgIHJldHVybiBgQ2Fubm90IGFwcGx5IHNpemUgdG8gbm9uLW9yaWVudGVkIG1hcmsgXCIke21hcmt9XCIuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiByYW5nZVN0ZXBEcm9wcGVkKGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgICByZXR1cm4gYHJhbmdlU3RlcCBmb3IgXCIke2NoYW5uZWx9XCIgaXMgZHJvcHBlZCBhcyB0b3AtbGV2ZWwgJHtcbiAgICAgIGNoYW5uZWwgPT09ICd4JyA/ICd3aWR0aCcgOiAnaGVpZ2h0J30gaXMgcHJvdmlkZWQuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBzY2FsZVR5cGVOb3RXb3JrV2l0aENoYW5uZWwoY2hhbm5lbDogQ2hhbm5lbCwgc2NhbGVUeXBlOiBTY2FsZVR5cGUsIGRlZmF1bHRTY2FsZVR5cGU6IFNjYWxlVHlwZSkge1xuICAgIHJldHVybiBgQ2hhbm5lbCBcIiR7Y2hhbm5lbH1cIiBkb2VzIG5vdCB3b3JrIHdpdGggXCIke3NjYWxlVHlwZX1cIiBzY2FsZS4gV2UgYXJlIHVzaW5nIFwiJHtkZWZhdWx0U2NhbGVUeXBlfVwiIHNjYWxlIGluc3RlYWQuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBzY2FsZVR5cGVOb3RXb3JrV2l0aEZpZWxkRGVmKHNjYWxlVHlwZTogU2NhbGVUeXBlLCBkZWZhdWx0U2NhbGVUeXBlOiBTY2FsZVR5cGUpIHtcbiAgICByZXR1cm4gYEZpZWxkRGVmIGRvZXMgbm90IHdvcmsgd2l0aCBcIiR7c2NhbGVUeXBlfVwiIHNjYWxlLiBXZSBhcmUgdXNpbmcgXCIke2RlZmF1bHRTY2FsZVR5cGV9XCIgc2NhbGUgaW5zdGVhZC5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHNjYWxlUHJvcGVydHlOb3RXb3JrV2l0aFNjYWxlVHlwZShzY2FsZVR5cGU6IFNjYWxlVHlwZSwgcHJvcE5hbWU6IHN0cmluZywgY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgIHJldHVybiBgJHtjaGFubmVsfS1zY2FsZSdzIFwiJHtwcm9wTmFtZX1cIiBpcyBkcm9wcGVkIGFzIGl0IGRvZXMgbm90IHdvcmsgd2l0aCAke3NjYWxlVHlwZX0gc2NhbGUuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBzY2FsZVR5cGVOb3RXb3JrV2l0aE1hcmsobWFyazogTWFyaywgc2NhbGVUeXBlOiBTY2FsZVR5cGUpIHtcbiAgICByZXR1cm4gYFNjYWxlIHR5cGUgXCIke3NjYWxlVHlwZX1cIiBkb2VzIG5vdCB3b3JrIHdpdGggbWFyayBcIiR7bWFya31cIi5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIG1lcmdlQ29uZmxpY3RpbmdQcm9wZXJ0eTxUPihwcm9wZXJ0eTogc3RyaW5nLCBwcm9wZXJ0eU9mOiBzdHJpbmcsIHYxOiBULCB2MjogVCkge1xuICAgIHJldHVybiBgQ29uZmxpY3RpbmcgJHtwcm9wZXJ0eU9mfSBwcm9wZXJ0eSBcIiR7cHJvcGVydHl9XCIgKCR7c3RyaW5naWZ5KHYxKX0gYW5kICR7c3RyaW5naWZ5KHYyKX0pLiAgVXNpbmcgJHtzdHJpbmdpZnkodjEpfS5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGluZGVwZW5kZW50U2NhbGVNZWFuc0luZGVwZW5kZW50R3VpZGUoY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgIHJldHVybiBgU2V0dGluZyB0aGUgc2NhbGUgdG8gYmUgaW5kZXBlbmRlbnQgZm9yIFwiJHtjaGFubmVsfVwiIG1lYW5zIHdlIGFsc28gaGF2ZSB0byBzZXQgdGhlIGd1aWRlIChheGlzIG9yIGxlZ2VuZCkgdG8gYmUgaW5kZXBlbmRlbnQuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBjb25mbGljdGVkRG9tYWluKGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgICByZXR1cm4gYENhbm5vdCBzZXQgJHtjaGFubmVsfS1zY2FsZSdzIFwiZG9tYWluXCIgYXMgaXQgaXMgYmlubmVkLiBQbGVhc2UgdXNlIFwiYmluXCIncyBcImV4dGVudFwiIGluc3RlYWQuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBkb21haW5Tb3J0RHJvcHBlZChzb3J0OiBWZ1NvcnRGaWVsZCkge1xuICAgIHJldHVybiBgRHJvcHBpbmcgc29ydCBwcm9wZXJ0eSAke3N0cmluZ2lmeShzb3J0KX0gYXMgdW5pb25lZCBkb21haW5zIG9ubHkgc3VwcG9ydCBib29sZWFuIG9yIG9wICdjb3VudCcuYDtcbiAgfVxuXG4gIGV4cG9ydCBjb25zdCBVTkFCTEVfVE9fTUVSR0VfRE9NQUlOUyA9ICdVbmFibGUgdG8gbWVyZ2UgZG9tYWlucyc7XG5cbiAgZXhwb3J0IGNvbnN0IE1PUkVfVEhBTl9PTkVfU09SVCA9ICdEb21haW5zIHRoYXQgc2hvdWxkIGJlIHVuaW9uZWQgaGFzIGNvbmZsaWN0aW5nIHNvcnQgcHJvcGVydGllcy4gU29ydCB3aWxsIGJlIHNldCB0byB0cnVlLic7XG5cbiAgLy8gQVhJU1xuICBleHBvcnQgY29uc3QgSU5WQUxJRF9DSEFOTkVMX0ZPUl9BWElTID0gJ0ludmFsaWQgY2hhbm5lbCBmb3IgYXhpcy4nO1xuXG4gIC8vIFNUQUNLXG4gIGV4cG9ydCBmdW5jdGlvbiBjYW5ub3RTdGFja1JhbmdlZE1hcmsoY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgIHJldHVybiBgQ2Fubm90IHN0YWNrIFwiJHtjaGFubmVsfVwiIGlmIHRoZXJlIGlzIGFscmVhZHkgXCIke2NoYW5uZWx9MlwiYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBjYW5ub3RTdGFja05vbkxpbmVhclNjYWxlKHNjYWxlVHlwZTogU2NhbGVUeXBlKSB7XG4gICAgcmV0dXJuIGBDYW5ub3Qgc3RhY2sgbm9uLWxpbmVhciBzY2FsZSAoJHtzY2FsZVR5cGV9KWA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gc3RhY2tOb25TdW1tYXRpdmVBZ2dyZWdhdGUoYWdncmVnYXRlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYFN0YWNraW5nIGlzIGFwcGxpZWQgZXZlbiB0aG91Z2ggdGhlIGFnZ3JlZ2F0ZSBmdW5jdGlvbiBpcyBub24tc3VtbWF0aXZlIChcIiR7YWdncmVnYXRlfVwiKWA7XG4gIH1cblxuICAvLyBUSU1FVU5JVFxuICBleHBvcnQgZnVuY3Rpb24gaW52YWxpZFRpbWVVbml0KHVuaXROYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgfCBudW1iZXIpIHtcbiAgICByZXR1cm4gYEludmFsaWQgJHt1bml0TmFtZX06ICR7c3RyaW5naWZ5KHZhbHVlKX1gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGRheVJlcGxhY2VkV2l0aERhdGUoZnVsbFRpbWVVbml0OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYFRpbWUgdW5pdCBcIiR7ZnVsbFRpbWVVbml0fVwiIGlzIG5vdCBzdXBwb3J0ZWQuIFdlIGFyZSByZXBsYWNpbmcgaXQgd2l0aCAke1xuICAgICAgZnVsbFRpbWVVbml0LnJlcGxhY2UoJ2RheScsICdkYXRlJyl9LmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gZHJvcHBlZERheShkOiBEYXRlVGltZSB8IERhdGVUaW1lRXhwcikge1xuICAgIHJldHVybiBgRHJvcHBpbmcgZGF5IGZyb20gZGF0ZXRpbWUgJHtzdHJpbmdpZnkoZCl9IGFzIGRheSBjYW5ub3QgYmUgY29tYmluZWQgd2l0aCBvdGhlciB1bml0cy5gO1xuICB9XG59XG5cbiJdfQ==