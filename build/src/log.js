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
    message.NO_FIELDS_NEEDS_AS = 'If "from.fields" is not specified, "as" has to be a string that specifies the key to be used for the data from the secondary source.';
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
    function nonZeroScaleUsedWithLengthMark(mark, channel, opt) {
        var scaleText = opt.scaleType ? opt.scaleType + " scale" :
            opt.zeroFalse ? 'scale with zero=false' :
                'scale with custom domain that excludes zero';
        return "A " + scaleText + " is used with " + mark + " mark. This can be misleading as the " + (channel === 'x' ? 'width' : 'height') + " of the " + mark + " can be arbitrary based on the scale domain. You may want to use point mark instead.";
    }
    message.nonZeroScaleUsedWithLengthMark = nonZeroScaleUsedWithLengthMark;
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
    function droppingColor(type, opt) {
        var fill = opt.fill, stroke = opt.stroke;
        return "Dropping color " + type + " as the plot also has " + (fill && stroke ? 'fill and stroke' : fill ? 'fill' : 'stroke');
    }
    message.droppingColor = droppingColor;
    function emptyFieldDef(fieldDef, channel) {
        return "Dropping " + util_1.stringify(fieldDef) + " from channel \"" + channel + "\" since it does not contain data field or value.";
    }
    message.emptyFieldDef = emptyFieldDef;
    function latLongDeprecated(channel, type, newChannel) {
        return channel + "-encoding with type " + type + " is deprecated. Replacing with " + newChannel + "-encoding.";
    }
    message.latLongDeprecated = latLongDeprecated;
    message.LINE_WITH_VARYING_SIZE = 'Line marks cannot encode size with a non-groupby field. You may want to use trail marks instead.';
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
    function lineWithRange(hasX2, hasY2) {
        var channels = hasX2 && hasY2 ? 'x2 and y2' : hasX2 ? 'x2' : 'y2';
        return "Line mark is for continuous lines and thus cannot be used with " + channels + ". We will use the rule mark (line segments) instead.";
    }
    message.lineWithRange = lineWithRange;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7O0FBR0gsdUNBQXdEO0FBU3hELCtCQUFpQztBQU1qQzs7R0FFRztBQUNILElBQU0sSUFBSSxHQUFHLGtCQUFNLENBQUMsZ0JBQUksQ0FBQyxDQUFDO0FBQzFCLElBQUksT0FBTyxHQUFvQixJQUFJLENBQUM7QUFFcEM7O0dBRUc7QUFDSDtJQUFBO1FBQ1MsVUFBSyxHQUFVLEVBQUUsQ0FBQztRQUNsQixVQUFLLEdBQVUsRUFBRSxDQUFDO1FBQ2xCLFdBQU0sR0FBVSxFQUFFLENBQUM7SUFvQjVCLENBQUM7SUFsQlEsMkJBQUssR0FBWjtRQUNFLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLDBCQUFJLEdBQVg7UUFBWSxjQUFjO2FBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztZQUFkLHlCQUFjOztRQUN4QixDQUFBLEtBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQSxDQUFDLElBQUksV0FBSSxJQUFJLEVBQUU7UUFDekIsT0FBTyxJQUFJLENBQUM7O0lBQ2QsQ0FBQztJQUVNLDBCQUFJLEdBQVg7UUFBWSxjQUFjO2FBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztZQUFkLHlCQUFjOztRQUN4QixDQUFBLEtBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQSxDQUFDLElBQUksV0FBSSxJQUFJLEVBQUU7UUFDekIsT0FBTyxJQUFJLENBQUM7O0lBQ2QsQ0FBQztJQUVNLDJCQUFLLEdBQVo7UUFBYSxjQUFjO2FBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztZQUFkLHlCQUFjOztRQUN6QixDQUFBLEtBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQSxDQUFDLElBQUksV0FBSSxJQUFJLEVBQUU7UUFDMUIsT0FBTyxJQUFJLENBQUM7O0lBQ2QsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FBQyxBQXZCRCxJ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WyIvKipcbiAqIFZlZ2EtTGl0ZSdzIHNpbmdsZXRvbiBsb2dnZXIgdXRpbGl0eS5cbiAqL1xuXG5pbXBvcnQge0FnZ3JlZ2F0ZU9wfSBmcm9tICd2ZWdhJztcbmltcG9ydCB7bG9nZ2VyLCBMb2dnZXJJbnRlcmZhY2UsIFdhcm59IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge0NoYW5uZWwsIEdlb1Bvc2l0aW9uQ2hhbm5lbH0gZnJvbSAnLi9jaGFubmVsJztcbmltcG9ydCB7Q29tcG9zaXRlTWFya30gZnJvbSAnLi9jb21wb3NpdGVtYXJrJztcbmltcG9ydCB7RGF0ZVRpbWUsIERhdGVUaW1lRXhwcn0gZnJvbSAnLi9kYXRldGltZSc7XG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuL2ZpZWxkZGVmJztcbmltcG9ydCB7TWFya30gZnJvbSAnLi9tYXJrJztcbmltcG9ydCB7UHJvamVjdGlvbn0gZnJvbSAnLi9wcm9qZWN0aW9uJztcbmltcG9ydCB7U2NhbGVUeXBlfSBmcm9tICcuL3NjYWxlJztcbmltcG9ydCB7VHlwZX0gZnJvbSAnLi90eXBlJztcbmltcG9ydCB7c3RyaW5naWZ5fSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHtWZ1NvcnRGaWVsZH0gZnJvbSAnLi92ZWdhLnNjaGVtYSc7XG5cblxuZXhwb3J0IHtMb2dnZXJJbnRlcmZhY2V9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5cbi8qKlxuICogTWFpbiAoZGVmYXVsdCkgVmVnYSBMb2dnZXIgaW5zdGFuY2UgZm9yIFZlZ2EtTGl0ZVxuICovXG5jb25zdCBtYWluID0gbG9nZ2VyKFdhcm4pO1xubGV0IGN1cnJlbnQ6IExvZ2dlckludGVyZmFjZSA9IG1haW47XG5cbi8qKlxuICogTG9nZ2VyIHRvb2wgZm9yIGNoZWNraW5nIGlmIHRoZSBjb2RlIHRocm93cyBjb3JyZWN0IHdhcm5pbmdcbiAqL1xuZXhwb3J0IGNsYXNzIExvY2FsTG9nZ2VyIGltcGxlbWVudHMgTG9nZ2VySW50ZXJmYWNlIHtcbiAgcHVibGljIHdhcm5zOiBhbnlbXSA9IFtdO1xuICBwdWJsaWMgaW5mb3M6IGFueVtdID0gW107XG4gIHB1YmxpYyBkZWJ1Z3M6IGFueVtdID0gW107XG5cbiAgcHVibGljIGxldmVsKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHVibGljIHdhcm4oLi4uYXJnczogYW55W10pIHtcbiAgICB0aGlzLndhcm5zLnB1c2goLi4uYXJncyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaWMgaW5mbyguLi5hcmdzOiBhbnlbXSkge1xuICAgIHRoaXMuaW5mb3MucHVzaCguLi5hcmdzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHB1YmxpYyBkZWJ1ZyguLi5hcmdzOiBhbnlbXSkge1xuICAgIHRoaXMuZGVidWdzLnB1c2goLi4uYXJncyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdyYXAoZjogKGxvZ2dlcjogTG9jYWxMb2dnZXIpID0+IHZvaWQpIHtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBjdXJyZW50ID0gbmV3IExvY2FsTG9nZ2VyKCk7XG4gICAgZihjdXJyZW50IGFzIExvY2FsTG9nZ2VyKTtcbiAgICByZXNldCgpO1xuICB9O1xufVxuXG4vKipcbiAqIFNldCB0aGUgc2luZ2xldG9uIGxvZ2dlciB0byBiZSBhIGN1c3RvbSBsb2dnZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldChuZXdMb2dnZXI6IExvZ2dlckludGVyZmFjZSkge1xuICBjdXJyZW50ID0gbmV3TG9nZ2VyO1xuICByZXR1cm4gY3VycmVudDtcbn1cblxuLyoqXG4gKiBSZXNldCB0aGUgbWFpbiBsb2dnZXIgdG8gdXNlIHRoZSBkZWZhdWx0IFZlZ2EgTG9nZ2VyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNldCgpIHtcbiAgY3VycmVudCA9IG1haW47XG4gIHJldHVybiBjdXJyZW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd2FybiguLi5fOiBhbnlbXSkge1xuICBjdXJyZW50Lndhcm4uYXBwbHkoY3VycmVudCwgYXJndW1lbnRzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluZm8oLi4uXzogYW55W10pIHtcbiAgY3VycmVudC5pbmZvLmFwcGx5KGN1cnJlbnQsIGFyZ3VtZW50cyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWJ1ZyguLi5fOiBhbnlbXSkge1xuICBjdXJyZW50LmRlYnVnLmFwcGx5KGN1cnJlbnQsIGFyZ3VtZW50cyk7XG59XG5cbi8qKlxuICogQ29sbGVjdGlvbiBvZiBhbGwgVmVnYS1MaXRlIEVycm9yIE1lc3NhZ2VzXG4gKi9cbmV4cG9ydCBuYW1lc3BhY2UgbWVzc2FnZSB7XG4gIGV4cG9ydCBjb25zdCBJTlZBTElEX1NQRUMgPSAnSW52YWxpZCBzcGVjJztcblxuICAvLyBGSVRcbiAgZXhwb3J0IGNvbnN0IEZJVF9OT05fU0lOR0xFID0gJ0F1dG9zaXplIFwiZml0XCIgb25seSB3b3JrcyBmb3Igc2luZ2xlIHZpZXdzIGFuZCBsYXllcmVkIHZpZXdzLic7XG5cbiAgZXhwb3J0IGNvbnN0IENBTk5PVF9GSVhfUkFOR0VfU1RFUF9XSVRIX0ZJVCA9ICdDYW5ub3QgdXNlIGEgZml4ZWQgdmFsdWUgb2YgXCJyYW5nZVN0ZXBcIiB3aGVuIFwiYXV0b3NpemVcIiBpcyBcImZpdFwiLic7XG5cbiAgLy8gU0VMRUNUSU9OXG4gIGV4cG9ydCBmdW5jdGlvbiBjYW5ub3RQcm9qZWN0T25DaGFubmVsV2l0aG91dEZpZWxkKGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgICByZXR1cm4gYENhbm5vdCBwcm9qZWN0IGEgc2VsZWN0aW9uIG9uIGVuY29kaW5nIGNoYW5uZWwgXCIke2NoYW5uZWx9XCIsIHdoaWNoIGhhcyBubyBmaWVsZC5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIG5lYXJlc3ROb3RTdXBwb3J0Rm9yQ29udGludW91cyhtYXJrOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYFRoZSBcIm5lYXJlc3RcIiB0cmFuc2Zvcm0gaXMgbm90IHN1cHBvcnRlZCBmb3IgJHttYXJrfSBtYXJrcy5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdGlvbk5vdEZvdW5kKG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiBgQ2Fubm90IGZpbmQgYSBzZWxlY3Rpb24gbmFtZWQgXCIke25hbWV9XCJgO1xuICB9XG5cbiAgZXhwb3J0IGNvbnN0IFNDQUxFX0JJTkRJTkdTX0NPTlRJTlVPVVMgPSAnU2NhbGUgYmluZGluZ3MgYXJlIGN1cnJlbnRseSBvbmx5IHN1cHBvcnRlZCBmb3Igc2NhbGVzIHdpdGggdW5iaW5uZWQsIGNvbnRpbnVvdXMgZG9tYWlucy4nO1xuXG4gIC8vIFJFUEVBVFxuICBleHBvcnQgZnVuY3Rpb24gbm9TdWNoUmVwZWF0ZWRWYWx1ZShmaWVsZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBVbmtub3duIHJlcGVhdGVkIHZhbHVlIFwiJHtmaWVsZH1cIi5gO1xuICB9XG5cbiAgLy8gQ09OQ0FUXG4gIGV4cG9ydCBjb25zdCBDT05DQVRfQ0FOTk9UX1NIQVJFX0FYSVMgPSAnQXhlcyBjYW5ub3QgYmUgc2hhcmVkIGluIGNvbmNhdGVuYXRlZCB2aWV3cy4nO1xuXG4gIC8vIFJFUEVBVFxuICBleHBvcnQgY29uc3QgUkVQRUFUX0NBTk5PVF9TSEFSRV9BWElTID0gJ0F4ZXMgY2Fubm90IGJlIHNoYXJlZCBpbiByZXBlYXRlZCB2aWV3cy4nO1xuXG4gIC8vIFRJVExFXG4gIGV4cG9ydCBmdW5jdGlvbiBjYW5ub3RTZXRUaXRsZUFuY2hvcih0eXBlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYENhbm5vdCBzZXQgdGl0bGUgXCJhbmNob3JcIiBmb3IgYSAke3R5cGV9IHNwZWNgO1xuICB9XG5cbiAgLy8gREFUQVxuICBleHBvcnQgZnVuY3Rpb24gdW5yZWNvZ25pemVkUGFyc2UocDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBVbnJlY29nbml6ZWQgcGFyc2UgXCIke3B9XCIuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBkaWZmZXJlbnRQYXJzZShmaWVsZDogc3RyaW5nLCBsb2NhbDogc3RyaW5nLCBhbmNlc3Rvcjogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBBbiBhbmNlc3RvciBwYXJzZWQgZmllbGQgXCIke2ZpZWxkfVwiIGFzICR7YW5jZXN0b3J9IGJ1dCBhIGNoaWxkIHdhbnRzIHRvIHBhcnNlIHRoZSBmaWVsZCBhcyAke2xvY2FsfS5gO1xuICB9XG5cbiAgLy8gVFJBTlNGT1JNU1xuICBleHBvcnQgZnVuY3Rpb24gaW52YWxpZFRyYW5zZm9ybUlnbm9yZWQodHJhbnNmb3JtOiBhbnkpIHtcbiAgICByZXR1cm4gYElnbm9yaW5nIGFuIGludmFsaWQgdHJhbnNmb3JtOiAke3N0cmluZ2lmeSh0cmFuc2Zvcm0pfS5gO1xuICB9XG5cbiAgZXhwb3J0IGNvbnN0IE5PX0ZJRUxEU19ORUVEU19BUyA9ICdJZiBcImZyb20uZmllbGRzXCIgaXMgbm90IHNwZWNpZmllZCwgXCJhc1wiIGhhcyB0byBiZSBhIHN0cmluZyB0aGF0IHNwZWNpZmllcyB0aGUga2V5IHRvIGJlIHVzZWQgZm9yIHRoZSBkYXRhIGZyb20gdGhlIHNlY29uZGFyeSBzb3VyY2UuJztcblxuICAvLyBFTkNPRElORyAmIEZBQ0VUXG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGVuY29kaW5nT3ZlcnJpZGRlbihjaGFubmVsczogQ2hhbm5lbFtdKSB7XG4gICAgcmV0dXJuIGBMYXllcidzIHNoYXJlZCAke2NoYW5uZWxzLmpvaW4oJywnKX0gY2hhbm5lbCAke2NoYW5uZWxzLmxlbmd0aCA9PT0gMSA/ICdpcycgOiAnYXJlJ30gb3ZlcnJpZGVuYDtcbiAgfVxuICBleHBvcnQgZnVuY3Rpb24gcHJvamVjdGlvbk92ZXJyaWRkZW4ob3B0OiB7cGFyZW50UHJvamVjdGlvbjogUHJvamVjdGlvbiwgcHJvamVjdGlvbjogUHJvamVjdGlvbn0pIHtcbiAgICBjb25zdCB7cGFyZW50UHJvamVjdGlvbiwgcHJvamVjdGlvbn0gPSBvcHQ7XG4gICAgcmV0dXJuIGBMYXllcidzIHNoYXJlZCBwcm9qZWN0aW9uICR7c3RyaW5naWZ5KHBhcmVudFByb2plY3Rpb24pfSBpcyBvdmVycmlkZGVuIGJ5IGEgY2hpbGQgcHJvamVjdGlvbiAke3N0cmluZ2lmeShwcm9qZWN0aW9uKX0uYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBwcmltaXRpdmVDaGFubmVsRGVmKGNoYW5uZWw6IENoYW5uZWwsIHR5cGU6ICdzdHJpbmcnIHwgJ251bWJlcicgfCAnYm9vbGVhbicsIHZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuKSB7XG4gICAgcmV0dXJuIGBDaGFubmVsICR7Y2hhbm5lbH0gaXMgYSAke3R5cGV9LiBDb252ZXJ0ZWQgdG8ge3ZhbHVlOiAke3N0cmluZ2lmeSh2YWx1ZSl9fS5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGludmFsaWRGaWVsZFR5cGUodHlwZTogVHlwZSkge1xuICAgIHJldHVybiBgSW52YWxpZCBmaWVsZCB0eXBlIFwiJHt0eXBlfVwiYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBub25aZXJvU2NhbGVVc2VkV2l0aExlbmd0aE1hcmsoXG4gICAgbWFyazogJ2JhcicgfCAnYXJlYScsIGNoYW5uZWw6IENoYW5uZWwsXG4gICAgb3B0OiB7c2NhbGVUeXBlPzogU2NhbGVUeXBlLCB6ZXJvRmFsc2U/OiBib29sZWFufVxuICApIHtcbiAgICBjb25zdCBzY2FsZVRleHQgPSBvcHQuc2NhbGVUeXBlID8gYCR7b3B0LnNjYWxlVHlwZX0gc2NhbGVgIDpcbiAgICAgIG9wdC56ZXJvRmFsc2UgPyAnc2NhbGUgd2l0aCB6ZXJvPWZhbHNlJyA6XG4gICAgICAnc2NhbGUgd2l0aCBjdXN0b20gZG9tYWluIHRoYXQgZXhjbHVkZXMgemVybyc7XG5cbiAgICByZXR1cm4gYEEgJHtzY2FsZVRleHR9IGlzIHVzZWQgd2l0aCAke21hcmt9IG1hcmsuIFRoaXMgY2FuIGJlIG1pc2xlYWRpbmcgYXMgdGhlICR7Y2hhbm5lbCA9PT0gJ3gnID8gJ3dpZHRoJyA6ICdoZWlnaHQnfSBvZiB0aGUgJHttYXJrfSBjYW4gYmUgYXJiaXRyYXJ5IGJhc2VkIG9uIHRoZSBzY2FsZSBkb21haW4uIFlvdSBtYXkgd2FudCB0byB1c2UgcG9pbnQgbWFyayBpbnN0ZWFkLmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gaW52YWxpZEZpZWxkVHlwZUZvckNvdW50QWdncmVnYXRlKHR5cGU6IFR5cGUsIGFnZ3JlZ2F0ZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBJbnZhbGlkIGZpZWxkIHR5cGUgXCIke3R5cGV9XCIgZm9yIGFnZ3JlZ2F0ZTogXCIke2FnZ3JlZ2F0ZX1cIiwgdXNpbmcgXCJxdWFudGl0YXRpdmVcIiBpbnN0ZWFkLmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gaW52YWxpZEFnZ3JlZ2F0ZShhZ2dyZWdhdGU6IEFnZ3JlZ2F0ZU9wIHwgc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBJbnZhbGlkIGFnZ3JlZ2F0aW9uIG9wZXJhdG9yIFwiJHthZ2dyZWdhdGV9XCJgO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGVtcHR5T3JJbnZhbGlkRmllbGRUeXBlKHR5cGU6IFR5cGUgfCBzdHJpbmcsIGNoYW5uZWw6IENoYW5uZWwsIG5ld1R5cGU6IFR5cGUpIHtcbiAgICByZXR1cm4gYEludmFsaWQgZmllbGQgdHlwZSBcIiR7dHlwZX1cIiBmb3IgY2hhbm5lbCBcIiR7Y2hhbm5lbH1cIiwgdXNpbmcgXCIke25ld1R5cGV9XCIgaW5zdGVhZC5gO1xuICB9XG4gIGV4cG9ydCBmdW5jdGlvbiBkcm9wcGluZ0NvbG9yKHR5cGU6ICdlbmNvZGluZycgfCAncHJvcGVydHknLCBvcHQ6IHtmaWxsPzogYm9vbGVhbiwgc3Ryb2tlPzogYm9vbGVhbn0pIHtcbiAgICBjb25zdCB7ZmlsbCwgc3Ryb2tlfSA9IG9wdDtcbiAgICByZXR1cm4gYERyb3BwaW5nIGNvbG9yICR7dHlwZX0gYXMgdGhlIHBsb3QgYWxzbyBoYXMgYCArIChcbiAgICAgIGZpbGwgJiYgc3Ryb2tlID8gJ2ZpbGwgYW5kIHN0cm9rZScgOiBmaWxsID8gJ2ZpbGwnIDogJ3N0cm9rZSdcbiAgICApO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGVtcHR5RmllbGREZWYoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgICByZXR1cm4gYERyb3BwaW5nICR7c3RyaW5naWZ5KGZpZWxkRGVmKX0gZnJvbSBjaGFubmVsIFwiJHtjaGFubmVsfVwiIHNpbmNlIGl0IGRvZXMgbm90IGNvbnRhaW4gZGF0YSBmaWVsZCBvciB2YWx1ZS5gO1xuICB9XG4gIGV4cG9ydCBmdW5jdGlvbiBsYXRMb25nRGVwcmVjYXRlZChjaGFubmVsOiBDaGFubmVsLCB0eXBlOiBUeXBlLCBuZXdDaGFubmVsOiBHZW9Qb3NpdGlvbkNoYW5uZWwpIHtcbiAgICByZXR1cm4gYCR7Y2hhbm5lbH0tZW5jb2Rpbmcgd2l0aCB0eXBlICR7dHlwZX0gaXMgZGVwcmVjYXRlZC4gUmVwbGFjaW5nIHdpdGggJHtuZXdDaGFubmVsfS1lbmNvZGluZy5gO1xuICB9XG5cbiAgZXhwb3J0IGNvbnN0IExJTkVfV0lUSF9WQVJZSU5HX1NJWkUgPSAnTGluZSBtYXJrcyBjYW5ub3QgZW5jb2RlIHNpemUgd2l0aCBhIG5vbi1ncm91cGJ5IGZpZWxkLiBZb3UgbWF5IHdhbnQgdG8gdXNlIHRyYWlsIG1hcmtzIGluc3RlYWQuJztcblxuICBleHBvcnQgZnVuY3Rpb24gaW5jb21wYXRpYmxlQ2hhbm5lbChjaGFubmVsOiBDaGFubmVsLCBtYXJrT3JGYWNldDogTWFyayB8ICdmYWNldCcgfCBDb21wb3NpdGVNYXJrLCB3aGVuPzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGAke2NoYW5uZWx9IGRyb3BwZWQgYXMgaXQgaXMgaW5jb21wYXRpYmxlIHdpdGggXCIke21hcmtPckZhY2V0fVwiJHt3aGVuID8gYCB3aGVuICR7d2hlbn1gIDogJyd9LmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gaW52YWxpZEVuY29kaW5nQ2hhbm5lbChjaGFubmVsOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYCR7Y2hhbm5lbH0tZW5jb2RpbmcgaXMgZHJvcHBlZCBhcyAke2NoYW5uZWx9IGlzIG5vdCBhIHZhbGlkIGVuY29kaW5nIGNoYW5uZWwuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBmYWNldENoYW5uZWxTaG91bGRCZURpc2NyZXRlKGNoYW5uZWw6IHN0cmluZykge1xuICAgIHJldHVybiBgJHtjaGFubmVsfSBlbmNvZGluZyBzaG91bGQgYmUgZGlzY3JldGUgKG9yZGluYWwgLyBub21pbmFsIC8gYmlubmVkKS5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGRpc2NyZXRlQ2hhbm5lbENhbm5vdEVuY29kZShjaGFubmVsOiBDaGFubmVsLCB0eXBlOiBUeXBlKSB7XG4gICAgcmV0dXJuIGBVc2luZyBkaXNjcmV0ZSBjaGFubmVsIFwiJHtjaGFubmVsfVwiIHRvIGVuY29kZSBcIiR7dHlwZX1cIiBmaWVsZCBjYW4gYmUgbWlzbGVhZGluZyBhcyBpdCBkb2VzIG5vdCBlbmNvZGUgJHt0eXBlID09PSAnb3JkaW5hbCcgPyAnb3JkZXInIDogJ21hZ25pdHVkZSd9LmA7XG4gIH1cblxuICAvLyBNYXJrXG4gIGV4cG9ydCBjb25zdCBCQVJfV0lUSF9QT0lOVF9TQ0FMRV9BTkRfUkFOR0VTVEVQX05VTEwgPSAnQmFyIG1hcmsgc2hvdWxkIG5vdCBiZSB1c2VkIHdpdGggcG9pbnQgc2NhbGUgd2hlbiByYW5nZVN0ZXAgaXMgbnVsbC4gUGxlYXNlIHVzZSBiYW5kIHNjYWxlIGluc3RlYWQuJztcblxuICBleHBvcnQgZnVuY3Rpb24gbGluZVdpdGhSYW5nZShoYXNYMjogYm9vbGVhbiwgaGFzWTI6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBjaGFubmVscyA9IGhhc1gyICYmIGhhc1kyID8gJ3gyIGFuZCB5MicgOiBoYXNYMiA/ICd4MicgOiAneTInO1xuICAgIHJldHVybiBgTGluZSBtYXJrIGlzIGZvciBjb250aW51b3VzIGxpbmVzIGFuZCB0aHVzIGNhbm5vdCBiZSB1c2VkIHdpdGggJHtjaGFubmVsc30uIFdlIHdpbGwgdXNlIHRoZSBydWxlIG1hcmsgKGxpbmUgc2VnbWVudHMpIGluc3RlYWQuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiB1bmNsZWFyT3JpZW50Q29udGludW91cyhtYXJrOiBNYXJrKSB7XG4gICAgcmV0dXJuIGBDYW5ub3QgY2xlYXJseSBkZXRlcm1pbmUgb3JpZW50YXRpb24gZm9yIFwiJHttYXJrfVwiIHNpbmNlIGJvdGggeCBhbmQgeSBjaGFubmVsIGVuY29kZSBjb250aW51b3VzIGZpZWxkcy4gSW4gdGhpcyBjYXNlLCB3ZSB1c2UgdmVydGljYWwgYnkgZGVmYXVsdGA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gdW5jbGVhck9yaWVudERpc2NyZXRlT3JFbXB0eShtYXJrOiBNYXJrKSB7XG4gICAgcmV0dXJuIGBDYW5ub3QgY2xlYXJseSBkZXRlcm1pbmUgb3JpZW50YXRpb24gZm9yIFwiJHttYXJrfVwiIHNpbmNlIGJvdGggeCBhbmQgeSBjaGFubmVsIGVuY29kZSBkaXNjcmV0ZSBvciBlbXB0eSBmaWVsZHMuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBvcmllbnRPdmVycmlkZGVuKG9yaWdpbmFsOiBzdHJpbmcsIGFjdHVhbDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBTcGVjaWZpZWQgb3JpZW50IFwiJHtvcmlnaW5hbH1cIiBvdmVycmlkZGVuIHdpdGggXCIke2FjdHVhbH1cImA7XG4gIH1cblxuICAvLyBTQ0FMRVxuICBleHBvcnQgY29uc3QgQ0FOTk9UX1VOSU9OX0NVU1RPTV9ET01BSU5fV0lUSF9GSUVMRF9ET01BSU4gPSAnY3VzdG9tIGRvbWFpbiBzY2FsZSBjYW5ub3QgYmUgdW5pb25lZCB3aXRoIGRlZmF1bHQgZmllbGQtYmFzZWQgZG9tYWluJztcblxuICBleHBvcnQgZnVuY3Rpb24gY2Fubm90VXNlU2NhbGVQcm9wZXJ0eVdpdGhOb25Db2xvcihwcm9wOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYENhbm5vdCB1c2UgdGhlIHNjYWxlIHByb3BlcnR5IFwiJHtwcm9wfVwiIHdpdGggbm9uLWNvbG9yIGNoYW5uZWwuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiB1bmFnZ3JlZ2F0ZURvbWFpbkhhc05vRWZmZWN0Rm9yUmF3RmllbGQoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4pIHtcbiAgICByZXR1cm4gYFVzaW5nIHVuYWdncmVnYXRlZCBkb21haW4gd2l0aCByYXcgZmllbGQgaGFzIG5vIGVmZmVjdCAoJHtzdHJpbmdpZnkoZmllbGREZWYpfSkuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiB1bmFnZ3JlZ2F0ZURvbWFpbldpdGhOb25TaGFyZWREb21haW5PcChhZ2dyZWdhdGU6IHN0cmluZykge1xuICAgIHJldHVybiBgVW5hZ2dyZWdhdGVkIGRvbWFpbiBub3QgYXBwbGljYWJsZSBmb3IgXCIke2FnZ3JlZ2F0ZX1cIiBzaW5jZSBpdCBwcm9kdWNlcyB2YWx1ZXMgb3V0c2lkZSB0aGUgb3JpZ2luIGRvbWFpbiBvZiB0aGUgc291cmNlIGRhdGEuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiB1bmFnZ3JlZ2F0ZWREb21haW5XaXRoTG9nU2NhbGUoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4pIHtcbiAgICByZXR1cm4gYFVuYWdncmVnYXRlZCBkb21haW4gaXMgY3VycmVudGx5IHVuc3VwcG9ydGVkIGZvciBsb2cgc2NhbGUgKCR7c3RyaW5naWZ5KGZpZWxkRGVmKX0pLmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gY2Fubm90VXNlU2l6ZUZpZWxkV2l0aEJhbmRTaXplKHBvc2l0aW9uQ2hhbm5lbDogJ3gnfCd5Jykge1xuICAgIHJldHVybiBgVXNpbmcgc2l6ZSBmaWVsZCB3aGVuICR7cG9zaXRpb25DaGFubmVsfS1jaGFubmVsIGhhcyBhIGJhbmQgc2NhbGUgaXMgbm90IHN1cHBvcnRlZC5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGNhbm5vdEFwcGx5U2l6ZVRvTm9uT3JpZW50ZWRNYXJrKG1hcms6IE1hcmspIHtcbiAgICByZXR1cm4gYENhbm5vdCBhcHBseSBzaXplIHRvIG5vbi1vcmllbnRlZCBtYXJrIFwiJHttYXJrfVwiLmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gcmFuZ2VTdGVwRHJvcHBlZChjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgcmV0dXJuIGByYW5nZVN0ZXAgZm9yIFwiJHtjaGFubmVsfVwiIGlzIGRyb3BwZWQgYXMgdG9wLWxldmVsICR7XG4gICAgICBjaGFubmVsID09PSAneCcgPyAnd2lkdGgnIDogJ2hlaWdodCd9IGlzIHByb3ZpZGVkLmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gc2NhbGVUeXBlTm90V29ya1dpdGhDaGFubmVsKGNoYW5uZWw6IENoYW5uZWwsIHNjYWxlVHlwZTogU2NhbGVUeXBlLCBkZWZhdWx0U2NhbGVUeXBlOiBTY2FsZVR5cGUpIHtcbiAgICByZXR1cm4gYENoYW5uZWwgXCIke2NoYW5uZWx9XCIgZG9lcyBub3Qgd29yayB3aXRoIFwiJHtzY2FsZVR5cGV9XCIgc2NhbGUuIFdlIGFyZSB1c2luZyBcIiR7ZGVmYXVsdFNjYWxlVHlwZX1cIiBzY2FsZSBpbnN0ZWFkLmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gc2NhbGVUeXBlTm90V29ya1dpdGhGaWVsZERlZihzY2FsZVR5cGU6IFNjYWxlVHlwZSwgZGVmYXVsdFNjYWxlVHlwZTogU2NhbGVUeXBlKSB7XG4gICAgcmV0dXJuIGBGaWVsZERlZiBkb2VzIG5vdCB3b3JrIHdpdGggXCIke3NjYWxlVHlwZX1cIiBzY2FsZS4gV2UgYXJlIHVzaW5nIFwiJHtkZWZhdWx0U2NhbGVUeXBlfVwiIHNjYWxlIGluc3RlYWQuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBzY2FsZVByb3BlcnR5Tm90V29ya1dpdGhTY2FsZVR5cGUoc2NhbGVUeXBlOiBTY2FsZVR5cGUsIHByb3BOYW1lOiBzdHJpbmcsIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgICByZXR1cm4gYCR7Y2hhbm5lbH0tc2NhbGUncyBcIiR7cHJvcE5hbWV9XCIgaXMgZHJvcHBlZCBhcyBpdCBkb2VzIG5vdCB3b3JrIHdpdGggJHtzY2FsZVR5cGV9IHNjYWxlLmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gc2NhbGVUeXBlTm90V29ya1dpdGhNYXJrKG1hcms6IE1hcmssIHNjYWxlVHlwZTogU2NhbGVUeXBlKSB7XG4gICAgcmV0dXJuIGBTY2FsZSB0eXBlIFwiJHtzY2FsZVR5cGV9XCIgZG9lcyBub3Qgd29yayB3aXRoIG1hcmsgXCIke21hcmt9XCIuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBtZXJnZUNvbmZsaWN0aW5nUHJvcGVydHk8VD4ocHJvcGVydHk6IHN0cmluZywgcHJvcGVydHlPZjogc3RyaW5nLCB2MTogVCwgdjI6IFQpIHtcbiAgICByZXR1cm4gYENvbmZsaWN0aW5nICR7cHJvcGVydHlPZn0gcHJvcGVydHkgXCIke3Byb3BlcnR5fVwiICgke3N0cmluZ2lmeSh2MSl9IGFuZCAke3N0cmluZ2lmeSh2Mil9KS4gIFVzaW5nICR7c3RyaW5naWZ5KHYxKX0uYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBpbmRlcGVuZGVudFNjYWxlTWVhbnNJbmRlcGVuZGVudEd1aWRlKGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgICByZXR1cm4gYFNldHRpbmcgdGhlIHNjYWxlIHRvIGJlIGluZGVwZW5kZW50IGZvciBcIiR7Y2hhbm5lbH1cIiBtZWFucyB3ZSBhbHNvIGhhdmUgdG8gc2V0IHRoZSBndWlkZSAoYXhpcyBvciBsZWdlbmQpIHRvIGJlIGluZGVwZW5kZW50LmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gY29uZmxpY3RlZERvbWFpbihjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgcmV0dXJuIGBDYW5ub3Qgc2V0ICR7Y2hhbm5lbH0tc2NhbGUncyBcImRvbWFpblwiIGFzIGl0IGlzIGJpbm5lZC4gUGxlYXNlIHVzZSBcImJpblwiJ3MgXCJleHRlbnRcIiBpbnN0ZWFkLmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gZG9tYWluU29ydERyb3BwZWQoc29ydDogVmdTb3J0RmllbGQpIHtcbiAgICByZXR1cm4gYERyb3BwaW5nIHNvcnQgcHJvcGVydHkgJHtzdHJpbmdpZnkoc29ydCl9IGFzIHVuaW9uZWQgZG9tYWlucyBvbmx5IHN1cHBvcnQgYm9vbGVhbiBvciBvcCAnY291bnQnLmA7XG4gIH1cblxuICBleHBvcnQgY29uc3QgVU5BQkxFX1RPX01FUkdFX0RPTUFJTlMgPSAnVW5hYmxlIHRvIG1lcmdlIGRvbWFpbnMnO1xuXG4gIGV4cG9ydCBjb25zdCBNT1JFX1RIQU5fT05FX1NPUlQgPSAnRG9tYWlucyB0aGF0IHNob3VsZCBiZSB1bmlvbmVkIGhhcyBjb25mbGljdGluZyBzb3J0IHByb3BlcnRpZXMuIFNvcnQgd2lsbCBiZSBzZXQgdG8gdHJ1ZS4nO1xuXG4gIC8vIEFYSVNcbiAgZXhwb3J0IGNvbnN0IElOVkFMSURfQ0hBTk5FTF9GT1JfQVhJUyA9ICdJbnZhbGlkIGNoYW5uZWwgZm9yIGF4aXMuJztcblxuICAvLyBTVEFDS1xuICBleHBvcnQgZnVuY3Rpb24gY2Fubm90U3RhY2tSYW5nZWRNYXJrKGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgICByZXR1cm4gYENhbm5vdCBzdGFjayBcIiR7Y2hhbm5lbH1cIiBpZiB0aGVyZSBpcyBhbHJlYWR5IFwiJHtjaGFubmVsfTJcImA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gY2Fubm90U3RhY2tOb25MaW5lYXJTY2FsZShzY2FsZVR5cGU6IFNjYWxlVHlwZSkge1xuICAgIHJldHVybiBgQ2Fubm90IHN0YWNrIG5vbi1saW5lYXIgc2NhbGUgKCR7c2NhbGVUeXBlfSlgO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHN0YWNrTm9uU3VtbWF0aXZlQWdncmVnYXRlKGFnZ3JlZ2F0ZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBTdGFja2luZyBpcyBhcHBsaWVkIGV2ZW4gdGhvdWdoIHRoZSBhZ2dyZWdhdGUgZnVuY3Rpb24gaXMgbm9uLXN1bW1hdGl2ZSAoXCIke2FnZ3JlZ2F0ZX1cIilgO1xuICB9XG5cbiAgLy8gVElNRVVOSVRcbiAgZXhwb3J0IGZ1bmN0aW9uIGludmFsaWRUaW1lVW5pdCh1bml0TmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKSB7XG4gICAgcmV0dXJuIGBJbnZhbGlkICR7dW5pdE5hbWV9OiAke3N0cmluZ2lmeSh2YWx1ZSl9YDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBkYXlSZXBsYWNlZFdpdGhEYXRlKGZ1bGxUaW1lVW5pdDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBUaW1lIHVuaXQgXCIke2Z1bGxUaW1lVW5pdH1cIiBpcyBub3Qgc3VwcG9ydGVkLiBXZSBhcmUgcmVwbGFjaW5nIGl0IHdpdGggJHtcbiAgICAgIGZ1bGxUaW1lVW5pdC5yZXBsYWNlKCdkYXknLCAnZGF0ZScpfS5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGRyb3BwZWREYXkoZDogRGF0ZVRpbWUgfCBEYXRlVGltZUV4cHIpIHtcbiAgICByZXR1cm4gYERyb3BwaW5nIGRheSBmcm9tIGRhdGV0aW1lICR7c3RyaW5naWZ5KGQpfSBhcyBkYXkgY2Fubm90IGJlIGNvbWJpbmVkIHdpdGggb3RoZXIgdW5pdHMuYDtcbiAgfVxufVxuXG4iXX0=