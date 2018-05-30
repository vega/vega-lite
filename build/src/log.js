/**
 * Vega-Lite's singleton logger utility.
 */
import { logger, Warn } from 'vega-util';
import { stringify } from './util';
/**
 * Main (default) Vega Logger instance for Vega-Lite
 */
var main = logger(Warn);
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
export { LocalLogger };
export function wrap(f) {
    return function () {
        current = new LocalLogger();
        f(current);
        reset();
    };
}
/**
 * Set the singleton logger to be a custom logger
 */
export function set(newLogger) {
    current = newLogger;
    return current;
}
/**
 * Reset the main logger to use the default Vega Logger
 */
export function reset() {
    current = main;
    return current;
}
export function warn() {
    var _ = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        _[_i] = arguments[_i];
    }
    current.warn.apply(current, arguments);
}
export function info() {
    var _ = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        _[_i] = arguments[_i];
    }
    current.info.apply(current, arguments);
}
export function debug() {
    var _ = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        _[_i] = arguments[_i];
    }
    current.debug.apply(current, arguments);
}
/**
 * Collection of all Vega-Lite Error Messages
 */
export var message;
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
        return "Ignoring an invalid transform: " + stringify(transform) + ".";
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
        return "Layer's shared projection " + stringify(parentProjection) + " is overridden by a child projection " + stringify(projection) + ".";
    }
    message.projectionOverridden = projectionOverridden;
    function primitiveChannelDef(channel, type, value) {
        return "Channel " + channel + " is a " + type + ". Converted to {value: " + stringify(value) + "}.";
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
        return "Dropping " + stringify(fieldDef) + " from channel \"" + channel + "\" since it does not contain data field or value.";
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
        return "Using unaggregated domain with raw field has no effect (" + stringify(fieldDef) + ").";
    }
    message.unaggregateDomainHasNoEffectForRawField = unaggregateDomainHasNoEffectForRawField;
    function unaggregateDomainWithNonSharedDomainOp(aggregate) {
        return "Unaggregated domain not applicable for \"" + aggregate + "\" since it produces values outside the origin domain of the source data.";
    }
    message.unaggregateDomainWithNonSharedDomainOp = unaggregateDomainWithNonSharedDomainOp;
    function unaggregatedDomainWithLogScale(fieldDef) {
        return "Unaggregated domain is currently unsupported for log scale (" + stringify(fieldDef) + ").";
    }
    message.unaggregatedDomainWithLogScale = unaggregatedDomainWithLogScale;
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
        return "Conflicting " + propertyOf + " property \"" + property + "\" (" + stringify(v1) + " and " + stringify(v2) + ").  Using " + stringify(v1) + ".";
    }
    message.mergeConflictingProperty = mergeConflictingProperty;
    function independentScaleMeansIndependentGuide(channel) {
        return "Setting the scale to be independent for \"" + channel + "\" means we also have to set the guide (axis or legend) to be independent.";
    }
    message.independentScaleMeansIndependentGuide = independentScaleMeansIndependentGuide;
    function domainSortDropped(sort) {
        return "Dropping sort property " + stringify(sort) + " as unioned domains only support boolean or op 'count'.";
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
        return "Invalid " + unitName + ": " + stringify(value);
    }
    message.invalidTimeUnit = invalidTimeUnit;
    function dayReplacedWithDate(fullTimeUnit) {
        return "Time unit \"" + fullTimeUnit + "\" is not supported. We are replacing it with " + fullTimeUnit.replace('day', 'date') + ".";
    }
    message.dayReplacedWithDate = dayReplacedWithDate;
    function droppedDay(d) {
        return "Dropping day from datetime " + stringify(d) + " as day cannot be combined with other units.";
    }
    message.droppedDay = droppedDay;
})(message || (message = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRztBQUdILE9BQU8sRUFBQyxNQUFNLEVBQW1CLElBQUksRUFBQyxNQUFNLFdBQVcsQ0FBQztBQVN4RCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBTWpDOztHQUVHO0FBQ0gsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzFCLElBQUksT0FBTyxHQUFvQixJQUFJLENBQUM7QUFFcEM7O0dBRUc7QUFDSDtJQUFBO1FBQ1MsVUFBSyxHQUFVLEVBQUUsQ0FBQztRQUNsQixVQUFLLEdBQVUsRUFBRSxDQUFDO1FBQ2xCLFdBQU0sR0FBVSxFQUFFLENBQUM7SUFvQjVCLENBQUM7SUFsQlEsMkJBQUssR0FBWjtRQUNFLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLDBCQUFJLEdBQVg7UUFBWSxjQUFjO2FBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztZQUFkLHlCQUFjOztRQUN4QixDQUFBLEtBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQSxDQUFDLElBQUksV0FBSSxJQUFJLEVBQUU7UUFDekIsT0FBTyxJQUFJLENBQUM7O0lBQ2QsQ0FBQztJQUVNLDBCQUFJLEdBQVg7UUFBWSxjQUFjO2FBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztZQUFkLHlCQUFjOztRQUN4QixDQUFBLEtBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQSxDQUFDLElBQUksV0FBSSxJQUFJLEVBQUU7UUFDekIsT0FBTyxJQUFJLENBQUM7O0lBQ2QsQ0FBQztJQUVNLDJCQUFLLEdBQVo7UUFBYSxjQUFjO2FBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztZQUFkLHlCQUFjOztRQUN6QixDQUFBLEtBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQSxDQUFDLElBQUksV0FBSSxJQUFJLEVB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QXdCLEdBQUcsMkJBQTJCLENBQUM7SUFFcEUsUUFBUTtJQUNSLCtCQUFzQyxPQUFnQjtRQUNwRCxPQUFPLG9CQUFpQixPQUFPLGlDQUEwQixPQUFPLFFBQUksQ0FBQztJQUN2RSxDQUFDO0lBRmUsNkJBQXFCLHdCQUVwQyxDQUFBO0lBRUQsbUNBQTBDLFNBQW9CO1FBQzVELE9BQU8sb0NBQWtDLFNBQVMsTUFBRyxDQUFDO0lBQ3hELENBQUM7SUFGZSxpQ0FBeUIsNEJBRXhDLENBQUE7SUFFRCxvQ0FBMkMsU0FBaUI7UUFDMUQsT0FBTyxnRkFBNkUsU0FBUyxRQUFJLENBQUM7SUFDcEcsQ0FBQztJQUZlLGtDQUEwQiw2QkFFekMsQ0FBQTtJQUVELFdBQVc7SUFDWCx5QkFBZ0MsUUFBZ0IsRUFBRSxLQUFzQjtRQUN0RSxPQUFPLGFBQVcsUUFBUSxVQUFLLFNBQVMsQ0FBQyxLQUFLLENBQUcsQ0FBQztJQUNwRCxDQUFDO0lBRmUsdUJBQWUsa0JBRTlCLENBQUE7SUFFRCw2QkFBb0MsWUFBb0I7UUFDdEQsT0FBTyxpQkFBYyxZQUFZLHNEQUMvQixZQUFZLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsTUFBRyxDQUFDO0lBQzNDLENBQUM7SUFIZSwyQkFBbUIsc0JBR2xDLENBQUE7SUFFRCxvQkFBMkIsQ0FBMEI7UUFDbkQsT0FBTyxnQ0FBOEIsU0FBUyxDQUFDLENBQUMsQ0FBQyxpREFBOEMsQ0FBQztJQUNsRyxDQUFDO0lBRmUsa0JBQVUsYUFFekIsQ0FBQTtBQUNILENBQUMsRUE1T2dCLE9BQU8sS0FBUCxPQUFPLFFBNE92QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVmVnYS1MaXRlJ3Mgc2luZ2xldG9uIGxvZ2dlciB1dGlsaXR5LlxuICovXG5cbmltcG9ydCB7QWdncmVnYXRlT3B9IGZyb20gJ3ZlZ2EnO1xuaW1wb3J0IHtsb2dnZXIsIExvZ2dlckludGVyZmFjZSwgV2Fybn0gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCB7Q2hhbm5lbCwgR2VvUG9zaXRpb25DaGFubmVsfSBmcm9tICcuL2NoYW5uZWwnO1xuaW1wb3J0IHtDb21wb3NpdGVNYXJrfSBmcm9tICcuL2NvbXBvc2l0ZW1hcmsnO1xuaW1wb3J0IHtEYXRlVGltZSwgRGF0ZVRpbWVFeHByfSBmcm9tICcuL2RhdGV0aW1lJztcbmltcG9ydCB7RmllbGREZWZ9IGZyb20gJy4vZmllbGRkZWYnO1xuaW1wb3J0IHtNYXJrfSBmcm9tICcuL21hcmsnO1xuaW1wb3J0IHtQcm9qZWN0aW9ufSBmcm9tICcuL3Byb2plY3Rpb24nO1xuaW1wb3J0IHtTY2FsZVR5cGV9IGZyb20gJy4vc2NhbGUnO1xuaW1wb3J0IHtUeXBlfSBmcm9tICcuL3R5cGUnO1xuaW1wb3J0IHtzdHJpbmdpZnl9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQge1ZnU29ydEZpZWxkfSBmcm9tICcuL3ZlZ2Euc2NoZW1hJztcblxuXG5leHBvcnQge0xvZ2dlckludGVyZmFjZX0gZnJvbSAndmVnYS11dGlsJztcblxuLyoqXG4gKiBNYWluIChkZWZhdWx0KSBWZWdhIExvZ2dlciBpbnN0YW5jZSBmb3IgVmVnYS1MaXRlXG4gKi9cbmNvbnN0IG1haW4gPSBsb2dnZXIoV2Fybik7XG5sZXQgY3VycmVudDogTG9nZ2VySW50ZXJmYWNlID0gbWFpbjtcblxuLyoqXG4gKiBMb2dnZXIgdG9vbCBmb3IgY2hlY2tpbmcgaWYgdGhlIGNvZGUgdGhyb3dzIGNvcnJlY3Qgd2FybmluZ1xuICovXG5leHBvcnQgY2xhc3MgTG9jYWxMb2dnZXIgaW1wbGVtZW50cyBMb2dnZXJJbnRlcmZhY2Uge1xuICBwdWJsaWMgd2FybnM6IGFueVtdID0gW107XG4gIHB1YmxpYyBpbmZvczogYW55W10gPSBbXTtcbiAgcHVibGljIGRlYnVnczogYW55W10gPSBbXTtcblxuICBwdWJsaWMgbGV2ZWwoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaWMgd2FybiguLi5hcmdzOiBhbnlbXSkge1xuICAgIHRoaXMud2FybnMucHVzaCguLi5hcmdzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHB1YmxpYyBpbmZvKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgdGhpcy5pbmZvcy5wdXNoKC4uLmFyZ3MpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHVibGljIGRlYnVnKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgdGhpcy5kZWJ1Z3MucHVzaCguLi5hcmdzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gd3JhcChmOiAobG9nZ2VyOiBMb2NhbExvZ2dlcikgPT4gdm9pZCkge1xuICByZXR1cm4gKCkgPT4ge1xuICAgIGN1cnJlbnQgPSBuZXcgTG9jYWxMb2dnZXIoKTtcbiAgICBmKGN1cnJlbnQgYXMgTG9jYWxMb2dnZXIpO1xuICAgIHJlc2V0KCk7XG4gIH07XG59XG5cbi8qKlxuICogU2V0IHRoZSBzaW5nbGV0b24gbG9nZ2VyIHRvIGJlIGEgY3VzdG9tIGxvZ2dlclxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0KG5ld0xvZ2dlcjogTG9nZ2VySW50ZXJmYWNlKSB7XG4gIGN1cnJlbnQgPSBuZXdMb2dnZXI7XG4gIHJldHVybiBjdXJyZW50O1xufVxuXG4vKipcbiAqIFJlc2V0IHRoZSBtYWluIGxvZ2dlciB0byB1c2UgdGhlIGRlZmF1bHQgVmVnYSBMb2dnZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0KCkge1xuICBjdXJyZW50ID0gbWFpbjtcbiAgcmV0dXJuIGN1cnJlbnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3YXJuKC4uLl86IGFueVtdKSB7XG4gIGN1cnJlbnQud2Fybi5hcHBseShjdXJyZW50LCBhcmd1bWVudHMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5mbyguLi5fOiBhbnlbXSkge1xuICBjdXJyZW50LmluZm8uYXBwbHkoY3VycmVudCwgYXJndW1lbnRzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlYnVnKC4uLl86IGFueVtdKSB7XG4gIGN1cnJlbnQuZGVidWcuYXBwbHkoY3VycmVudCwgYXJndW1lbnRzKTtcbn1cblxuLyoqXG4gKiBDb2xsZWN0aW9uIG9mIGFsbCBWZWdhLUxpdGUgRXJyb3IgTWVzc2FnZXNcbiAqL1xuZXhwb3J0IG5hbWVzcGFjZSBtZXNzYWdlIHtcbiAgZXhwb3J0IGNvbnN0IElOVkFMSURfU1BFQyA9ICdJbnZhbGlkIHNwZWMnO1xuXG4gIC8vIEZJVFxuICBleHBvcnQgY29uc3QgRklUX05PTl9TSU5HTEUgPSAnQXV0b3NpemUgXCJmaXRcIiBvbmx5IHdvcmtzIGZvciBzaW5nbGUgdmlld3MgYW5kIGxheWVyZWQgdmlld3MuJztcblxuICBleHBvcnQgY29uc3QgQ0FOTk9UX0ZJWF9SQU5HRV9TVEVQX1dJVEhfRklUID0gJ0Nhbm5vdCB1c2UgYSBmaXhlZCB2YWx1ZSBvZiBcInJhbmdlU3RlcFwiIHdoZW4gXCJhdXRvc2l6ZVwiIGlzIFwiZml0XCIuJztcblxuICAvLyBTRUxFQ1RJT05cbiAgZXhwb3J0IGZ1bmN0aW9uIGNhbm5vdFByb2plY3RPbkNoYW5uZWxXaXRob3V0RmllbGQoY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgIHJldHVybiBgQ2Fubm90IHByb2plY3QgYSBzZWxlY3Rpb24gb24gZW5jb2RpbmcgY2hhbm5lbCBcIiR7Y2hhbm5lbH1cIiwgd2hpY2ggaGFzIG5vIGZpZWxkLmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gbmVhcmVzdE5vdFN1cHBvcnRGb3JDb250aW51b3VzKG1hcms6IHN0cmluZykge1xuICAgIHJldHVybiBgVGhlIFwibmVhcmVzdFwiIHRyYW5zZm9ybSBpcyBub3Qgc3VwcG9ydGVkIGZvciAke21hcmt9IG1hcmtzLmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gc2VsZWN0aW9uTm90Rm91bmQobmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBDYW5ub3QgZmluZCBhIHNlbGVjdGlvbiBuYW1lZCBcIiR7bmFtZX1cImA7XG4gIH1cblxuICBleHBvcnQgY29uc3QgU0NBTEVfQklORElOR1NfQ09OVElOVU9VUyA9ICdTY2FsZSBiaW5kaW5ncyBhcmUgY3VycmVudGx5IG9ubHkgc3VwcG9ydGVkIGZvciBzY2FsZXMgd2l0aCB1bmJpbm5lZCwgY29udGludW91cyBkb21haW5zLic7XG5cbiAgLy8gUkVQRUFUXG4gIGV4cG9ydCBmdW5jdGlvbiBub1N1Y2hSZXBlYXRlZFZhbHVlKGZpZWxkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYFVua25vd24gcmVwZWF0ZWQgdmFsdWUgXCIke2ZpZWxkfVwiLmA7XG4gIH1cblxuICAvLyBDT05DQVRcbiAgZXhwb3J0IGNvbnN0IENPTkNBVF9DQU5OT1RfU0hBUkVfQVhJUyA9ICdBeGVzIGNhbm5vdCBiZSBzaGFyZWQgaW4gY29uY2F0ZW5hdGVkIHZpZXdzLic7XG5cbiAgLy8gUkVQRUFUXG4gIGV4cG9ydCBjb25zdCBSRVBFQVRfQ0FOTk9UX1NIQVJFX0FYSVMgPSAnQXhlcyBjYW5ub3QgYmUgc2hhcmVkIGluIHJlcGVhdGVkIHZpZXdzLic7XG5cbiAgLy8gVElUTEVcbiAgZXhwb3J0IGZ1bmN0aW9uIGNhbm5vdFNldFRpdGxlQW5jaG9yKHR5cGU6IHN0cmluZykge1xuICAgIHJldHVybiBgQ2Fubm90IHNldCB0aXRsZSBcImFuY2hvclwiIGZvciBhICR7dHlwZX0gc3BlY2A7XG4gIH1cblxuICAvLyBEQVRBXG4gIGV4cG9ydCBmdW5jdGlvbiB1bnJlY29nbml6ZWRQYXJzZShwOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYFVucmVjb2duaXplZCBwYXJzZSBcIiR7cH1cIi5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGRpZmZlcmVudFBhcnNlKGZpZWxkOiBzdHJpbmcsIGxvY2FsOiBzdHJpbmcsIGFuY2VzdG9yOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYEFuIGFuY2VzdG9yIHBhcnNlZCBmaWVsZCBcIiR7ZmllbGR9XCIgYXMgJHthbmNlc3Rvcn0gYnV0IGEgY2hpbGQgd2FudHMgdG8gcGFyc2UgdGhlIGZpZWxkIGFzICR7bG9jYWx9LmA7XG4gIH1cblxuICAvLyBUUkFOU0ZPUk1TXG4gIGV4cG9ydCBmdW5jdGlvbiBpbnZhbGlkVHJhbnNmb3JtSWdub3JlZCh0cmFuc2Zvcm06IGFueSkge1xuICAgIHJldHVybiBgSWdub3JpbmcgYW4gaW52YWxpZCB0cmFuc2Zvcm06ICR7c3RyaW5naWZ5KHRyYW5zZm9ybSl9LmA7XG4gIH1cblxuICBleHBvcnQgY29uc3QgTk9fRklFTERTX05FRURTX0FTID0gJ0lmIFwiZnJvbS5maWVsZHNcIiBpcyBub3Qgc3BlY2lmaWVkLCBcImFzXCIgaGFzIHRvIGJlIGEgc3RyaW5nIHRoYXQgc3BlY2lmaWVzIHRoZSBrZXkgdG8gYmUgdXNlZCBmb3IgdGhlIGRhdGEgZnJvbSB0aGUgc2Vjb25kYXJ5IHNvdXJjZS4nO1xuXG4gIC8vIEVOQ09ESU5HICYgRkFDRVRcblxuICBleHBvcnQgZnVuY3Rpb24gZW5jb2RpbmdPdmVycmlkZGVuKGNoYW5uZWxzOiBDaGFubmVsW10pIHtcbiAgICByZXR1cm4gYExheWVyJ3Mgc2hhcmVkICR7Y2hhbm5lbHMuam9pbignLCcpfSBjaGFubmVsICR7Y2hhbm5lbHMubGVuZ3RoID09PSAxID8gJ2lzJyA6ICdhcmUnfSBvdmVycmlkZW5gO1xuICB9XG4gIGV4cG9ydCBmdW5jdGlvbiBwcm9qZWN0aW9uT3ZlcnJpZGRlbihvcHQ6IHtwYXJlbnRQcm9qZWN0aW9uOiBQcm9qZWN0aW9uLCBwcm9qZWN0aW9uOiBQcm9qZWN0aW9ufSkge1xuICAgIGNvbnN0IHtwYXJlbnRQcm9qZWN0aW9uLCBwcm9qZWN0aW9ufSA9IG9wdDtcbiAgICByZXR1cm4gYExheWVyJ3Mgc2hhcmVkIHByb2plY3Rpb24gJHtzdHJpbmdpZnkocGFyZW50UHJvamVjdGlvbil9IGlzIG92ZXJyaWRkZW4gYnkgYSBjaGlsZCBwcm9qZWN0aW9uICR7c3RyaW5naWZ5KHByb2plY3Rpb24pfS5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHByaW1pdGl2ZUNoYW5uZWxEZWYoY2hhbm5lbDogQ2hhbm5lbCwgdHlwZTogJ3N0cmluZycgfCAnbnVtYmVyJyB8ICdib29sZWFuJywgdmFsdWU6IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gYENoYW5uZWwgJHtjaGFubmVsfSBpcyBhICR7dHlwZX0uIENvbnZlcnRlZCB0byB7dmFsdWU6ICR7c3RyaW5naWZ5KHZhbHVlKX19LmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gaW52YWxpZEZpZWxkVHlwZSh0eXBlOiBUeXBlKSB7XG4gICAgcmV0dXJuIGBJbnZhbGlkIGZpZWxkIHR5cGUgXCIke3R5cGV9XCJgO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIG5vblplcm9TY2FsZVVzZWRXaXRoTGVuZ3RoTWFyayhcbiAgICBtYXJrOiAnYmFyJyB8ICdhcmVhJywgY2hhbm5lbDogQ2hhbm5lbCxcbiAgICBvcHQ6IHtzY2FsZVR5cGU/OiBTY2FsZVR5cGUsIHplcm9GYWxzZT86IGJvb2xlYW59XG4gICkge1xuICAgIGNvbnN0IHNjYWxlVGV4dCA9IG9wdC5zY2FsZVR5cGUgPyBgJHtvcHQuc2NhbGVUeXBlfSBzY2FsZWAgOlxuICAgICAgb3B0Lnplcm9GYWxzZSA/ICdzY2FsZSB3aXRoIHplcm89ZmFsc2UnIDpcbiAgICAgICdzY2FsZSB3aXRoIGN1c3RvbSBkb21haW4gdGhhdCBleGNsdWRlcyB6ZXJvJztcblxuICAgIHJldHVybiBgQSAke3NjYWxlVGV4dH0gaXMgdXNlZCB3aXRoICR7bWFya30gbWFyay4gVGhpcyBjYW4gYmUgbWlzbGVhZGluZyBhcyB0aGUgJHtjaGFubmVsID09PSAneCcgPyAnd2lkdGgnIDogJ2hlaWdodCd9IG9mIHRoZSAke21hcmt9IGNhbiBiZSBhcmJpdHJhcnkgYmFzZWQgb24gdGhlIHNjYWxlIGRvbWFpbi4gWW91IG1heSB3YW50IHRvIHVzZSBwb2ludCBtYXJrIGluc3RlYWQuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBpbnZhbGlkRmllbGRUeXBlRm9yQ291bnRBZ2dyZWdhdGUodHlwZTogVHlwZSwgYWdncmVnYXRlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYEludmFsaWQgZmllbGQgdHlwZSBcIiR7dHlwZX1cIiBmb3IgYWdncmVnYXRlOiBcIiR7YWdncmVnYXRlfVwiLCB1c2luZyBcInF1YW50aXRhdGl2ZVwiIGluc3RlYWQuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBpbnZhbGlkQWdncmVnYXRlKGFnZ3JlZ2F0ZTogQWdncmVnYXRlT3AgfCBzdHJpbmcpIHtcbiAgICByZXR1cm4gYEludmFsaWQgYWdncmVnYXRpb24gb3BlcmF0b3IgXCIke2FnZ3JlZ2F0ZX1cImA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gZW1wdHlPckludmFsaWRGaWVsZFR5cGUodHlwZTogVHlwZSB8IHN0cmluZywgY2hhbm5lbDogQ2hhbm5lbCwgbmV3VHlwZTogVHlwZSkge1xuICAgIHJldHVybiBgSW52YWxpZCBmaWVsZCB0eXBlIFwiJHt0eXBlfVwiIGZvciBjaGFubmVsIFwiJHtjaGFubmVsfVwiLCB1c2luZyBcIiR7bmV3VHlwZX1cIiBpbnN0ZWFkLmA7XG4gIH1cbiAgZXhwb3J0IGZ1bmN0aW9uIGRyb3BwaW5nQ29sb3IodHlwZTogJ2VuY29kaW5nJyB8ICdwcm9wZXJ0eScsIG9wdDoge2ZpbGw/OiBib29sZWFuLCBzdHJva2U/OiBib29sZWFufSkge1xuICAgIGNvbnN0IHtmaWxsLCBzdHJva2V9ID0gb3B0O1xuICAgIHJldHVybiBgRHJvcHBpbmcgY29sb3IgJHt0eXBlfSBhcyB0aGUgcGxvdCBhbHNvIGhhcyBgICsgKFxuICAgICAgZmlsbCAmJiBzdHJva2UgPyAnZmlsbCBhbmQgc3Ryb2tlJyA6IGZpbGwgPyAnZmlsbCcgOiAnc3Ryb2tlJ1xuICAgICk7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gZW1wdHlGaWVsZERlZihmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgIHJldHVybiBgRHJvcHBpbmcgJHtzdHJpbmdpZnkoZmllbGREZWYpfSBmcm9tIGNoYW5uZWwgXCIke2NoYW5uZWx9XCIgc2luY2UgaXQgZG9lcyBub3QgY29udGFpbiBkYXRhIGZpZWxkIG9yIHZhbHVlLmA7XG4gIH1cbiAgZXhwb3J0IGZ1bmN0aW9uIGxhdExvbmdEZXByZWNhdGVkKGNoYW5uZWw6IENoYW5uZWwsIHR5cGU6IFR5cGUsIG5ld0NoYW5uZWw6IEdlb1Bvc2l0aW9uQ2hhbm5lbCkge1xuICAgIHJldHVybiBgJHtjaGFubmVsfS1lbmNvZGluZyB3aXRoIHR5cGUgJHt0eXBlfSBpcyBkZXByZWNhdGVkLiBSZXBsYWNpbmcgd2l0aCAke25ld0NoYW5uZWx9LWVuY29kaW5nLmA7XG4gIH1cblxuICBleHBvcnQgY29uc3QgTElORV9XSVRIX1ZBUllJTkdfU0laRSA9ICdMaW5lIG1hcmtzIGNhbm5vdCBlbmNvZGUgc2l6ZSB3aXRoIGEgbm9uLWdyb3VwYnkgZmllbGQuIFlvdSBtYXkgd2FudCB0byB1c2UgdHJhaWwgbWFya3MgaW5zdGVhZC4nO1xuXG4gIGV4cG9ydCBmdW5jdGlvbiBpbmNvbXBhdGlibGVDaGFubmVsKGNoYW5uZWw6IENoYW5uZWwsIG1hcmtPckZhY2V0OiBNYXJrIHwgJ2ZhY2V0JyB8IENvbXBvc2l0ZU1hcmssIHdoZW4/OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYCR7Y2hhbm5lbH0gZHJvcHBlZCBhcyBpdCBpcyBpbmNvbXBhdGlibGUgd2l0aCBcIiR7bWFya09yRmFjZXR9XCIke3doZW4gPyBgIHdoZW4gJHt3aGVufWAgOiAnJ30uYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBpbnZhbGlkRW5jb2RpbmdDaGFubmVsKGNoYW5uZWw6IHN0cmluZykge1xuICAgIHJldHVybiBgJHtjaGFubmVsfS1lbmNvZGluZyBpcyBkcm9wcGVkIGFzICR7Y2hhbm5lbH0gaXMgbm90IGEgdmFsaWQgZW5jb2RpbmcgY2hhbm5lbC5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGZhY2V0Q2hhbm5lbFNob3VsZEJlRGlzY3JldGUoY2hhbm5lbDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGAke2NoYW5uZWx9IGVuY29kaW5nIHNob3VsZCBiZSBkaXNjcmV0ZSAob3JkaW5hbCAvIG5vbWluYWwgLyBiaW5uZWQpLmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gZGlzY3JldGVDaGFubmVsQ2Fubm90RW5jb2RlKGNoYW5uZWw6IENoYW5uZWwsIHR5cGU6IFR5cGUpIHtcbiAgICByZXR1cm4gYFVzaW5nIGRpc2NyZXRlIGNoYW5uZWwgXCIke2NoYW5uZWx9XCIgdG8gZW5jb2RlIFwiJHt0eXBlfVwiIGZpZWxkIGNhbiBiZSBtaXNsZWFkaW5nIGFzIGl0IGRvZXMgbm90IGVuY29kZSAke3R5cGUgPT09ICdvcmRpbmFsJyA/ICdvcmRlcicgOiAnbWFnbml0dWRlJ30uYDtcbiAgfVxuXG4gIC8vIE1hcmtcbiAgZXhwb3J0IGNvbnN0IEJBUl9XSVRIX1BPSU5UX1NDQUxFX0FORF9SQU5HRVNURVBfTlVMTCA9ICdCYXIgbWFyayBzaG91bGQgbm90IGJlIHVzZWQgd2l0aCBwb2ludCBzY2FsZSB3aGVuIHJhbmdlU3RlcCBpcyBudWxsLiBQbGVhc2UgdXNlIGJhbmQgc2NhbGUgaW5zdGVhZC4nO1xuXG4gIGV4cG9ydCBmdW5jdGlvbiBsaW5lV2l0aFJhbmdlKGhhc1gyOiBib29sZWFuLCBoYXNZMjogYm9vbGVhbikge1xuICAgIGNvbnN0IGNoYW5uZWxzID0gaGFzWDIgJiYgaGFzWTIgPyAneDIgYW5kIHkyJyA6IGhhc1gyID8gJ3gyJyA6ICd5Mic7XG4gICAgcmV0dXJuIGBMaW5lIG1hcmsgaXMgZm9yIGNvbnRpbnVvdXMgbGluZXMgYW5kIHRodXMgY2Fubm90IGJlIHVzZWQgd2l0aCAke2NoYW5uZWxzfS4gV2Ugd2lsbCB1c2UgdGhlIHJ1bGUgbWFyayAobGluZSBzZWdtZW50cykgaW5zdGVhZC5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHVuY2xlYXJPcmllbnRDb250aW51b3VzKG1hcms6IE1hcmspIHtcbiAgICByZXR1cm4gYENhbm5vdCBjbGVhcmx5IGRldGVybWluZSBvcmllbnRhdGlvbiBmb3IgXCIke21hcmt9XCIgc2luY2UgYm90aCB4IGFuZCB5IGNoYW5uZWwgZW5jb2RlIGNvbnRpbnVvdXMgZmllbGRzLiBJbiB0aGlzIGNhc2UsIHdlIHVzZSB2ZXJ0aWNhbCBieSBkZWZhdWx0YDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiB1bmNsZWFyT3JpZW50RGlzY3JldGVPckVtcHR5KG1hcms6IE1hcmspIHtcbiAgICByZXR1cm4gYENhbm5vdCBjbGVhcmx5IGRldGVybWluZSBvcmllbnRhdGlvbiBmb3IgXCIke21hcmt9XCIgc2luY2UgYm90aCB4IGFuZCB5IGNoYW5uZWwgZW5jb2RlIGRpc2NyZXRlIG9yIGVtcHR5IGZpZWxkcy5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIG9yaWVudE92ZXJyaWRkZW4ob3JpZ2luYWw6IHN0cmluZywgYWN0dWFsOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYFNwZWNpZmllZCBvcmllbnQgXCIke29yaWdpbmFsfVwiIG92ZXJyaWRkZW4gd2l0aCBcIiR7YWN0dWFsfVwiYDtcbiAgfVxuXG4gIC8vIFNDQUxFXG4gIGV4cG9ydCBjb25zdCBDQU5OT1RfVU5JT05fQ1VTVE9NX0RPTUFJTl9XSVRIX0ZJRUxEX0RPTUFJTiA9ICdjdXN0b20gZG9tYWluIHNjYWxlIGNhbm5vdCBiZSB1bmlvbmVkIHdpdGggZGVmYXVsdCBmaWVsZC1iYXNlZCBkb21haW4nO1xuXG4gIGV4cG9ydCBmdW5jdGlvbiBjYW5ub3RVc2VTY2FsZVByb3BlcnR5V2l0aE5vbkNvbG9yKHByb3A6IHN0cmluZykge1xuICAgIHJldHVybiBgQ2Fubm90IHVzZSB0aGUgc2NhbGUgcHJvcGVydHkgXCIke3Byb3B9XCIgd2l0aCBub24tY29sb3IgY2hhbm5lbC5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHVuYWdncmVnYXRlRG9tYWluSGFzTm9FZmZlY3RGb3JSYXdGaWVsZChmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPikge1xuICAgIHJldHVybiBgVXNpbmcgdW5hZ2dyZWdhdGVkIGRvbWFpbiB3aXRoIHJhdyBmaWVsZCBoYXMgbm8gZWZmZWN0ICgke3N0cmluZ2lmeShmaWVsZERlZil9KS5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHVuYWdncmVnYXRlRG9tYWluV2l0aE5vblNoYXJlZERvbWFpbk9wKGFnZ3JlZ2F0ZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBVbmFnZ3JlZ2F0ZWQgZG9tYWluIG5vdCBhcHBsaWNhYmxlIGZvciBcIiR7YWdncmVnYXRlfVwiIHNpbmNlIGl0IHByb2R1Y2VzIHZhbHVlcyBvdXRzaWRlIHRoZSBvcmlnaW4gZG9tYWluIG9mIHRoZSBzb3VyY2UgZGF0YS5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHVuYWdncmVnYXRlZERvbWFpbldpdGhMb2dTY2FsZShmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPikge1xuICAgIHJldHVybiBgVW5hZ2dyZWdhdGVkIGRvbWFpbiBpcyBjdXJyZW50bHkgdW5zdXBwb3J0ZWQgZm9yIGxvZyBzY2FsZSAoJHtzdHJpbmdpZnkoZmllbGREZWYpfSkuYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBjYW5ub3RBcHBseVNpemVUb05vbk9yaWVudGVkTWFyayhtYXJrOiBNYXJrKSB7XG4gICAgcmV0dXJuIGBDYW5ub3QgYXBwbHkgc2l6ZSB0byBub24tb3JpZW50ZWQgbWFyayBcIiR7bWFya31cIi5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHJhbmdlU3RlcERyb3BwZWQoY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgIHJldHVybiBgcmFuZ2VTdGVwIGZvciBcIiR7Y2hhbm5lbH1cIiBpcyBkcm9wcGVkIGFzIHRvcC1sZXZlbCAke1xuICAgICAgY2hhbm5lbCA9PT0gJ3gnID8gJ3dpZHRoJyA6ICdoZWlnaHQnfSBpcyBwcm92aWRlZC5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHNjYWxlVHlwZU5vdFdvcmtXaXRoQ2hhbm5lbChjaGFubmVsOiBDaGFubmVsLCBzY2FsZVR5cGU6IFNjYWxlVHlwZSwgZGVmYXVsdFNjYWxlVHlwZTogU2NhbGVUeXBlKSB7XG4gICAgcmV0dXJuIGBDaGFubmVsIFwiJHtjaGFubmVsfVwiIGRvZXMgbm90IHdvcmsgd2l0aCBcIiR7c2NhbGVUeXBlfVwiIHNjYWxlLiBXZSBhcmUgdXNpbmcgXCIke2RlZmF1bHRTY2FsZVR5cGV9XCIgc2NhbGUgaW5zdGVhZC5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHNjYWxlVHlwZU5vdFdvcmtXaXRoRmllbGREZWYoc2NhbGVUeXBlOiBTY2FsZVR5cGUsIGRlZmF1bHRTY2FsZVR5cGU6IFNjYWxlVHlwZSkge1xuICAgIHJldHVybiBgRmllbGREZWYgZG9lcyBub3Qgd29yayB3aXRoIFwiJHtzY2FsZVR5cGV9XCIgc2NhbGUuIFdlIGFyZSB1c2luZyBcIiR7ZGVmYXVsdFNjYWxlVHlwZX1cIiBzY2FsZSBpbnN0ZWFkLmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gc2NhbGVQcm9wZXJ0eU5vdFdvcmtXaXRoU2NhbGVUeXBlKHNjYWxlVHlwZTogU2NhbGVUeXBlLCBwcm9wTmFtZTogc3RyaW5nLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgcmV0dXJuIGAke2NoYW5uZWx9LXNjYWxlJ3MgXCIke3Byb3BOYW1lfVwiIGlzIGRyb3BwZWQgYXMgaXQgZG9lcyBub3Qgd29yayB3aXRoICR7c2NhbGVUeXBlfSBzY2FsZS5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHNjYWxlVHlwZU5vdFdvcmtXaXRoTWFyayhtYXJrOiBNYXJrLCBzY2FsZVR5cGU6IFNjYWxlVHlwZSkge1xuICAgIHJldHVybiBgU2NhbGUgdHlwZSBcIiR7c2NhbGVUeXBlfVwiIGRvZXMgbm90IHdvcmsgd2l0aCBtYXJrIFwiJHttYXJrfVwiLmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gbWVyZ2VDb25mbGljdGluZ1Byb3BlcnR5PFQ+KHByb3BlcnR5OiBzdHJpbmcsIHByb3BlcnR5T2Y6IHN0cmluZywgdjE6IFQsIHYyOiBUKSB7XG4gICAgcmV0dXJuIGBDb25mbGljdGluZyAke3Byb3BlcnR5T2Z9IHByb3BlcnR5IFwiJHtwcm9wZXJ0eX1cIiAoJHtzdHJpbmdpZnkodjEpfSBhbmQgJHtzdHJpbmdpZnkodjIpfSkuICBVc2luZyAke3N0cmluZ2lmeSh2MSl9LmA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gaW5kZXBlbmRlbnRTY2FsZU1lYW5zSW5kZXBlbmRlbnRHdWlkZShjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgcmV0dXJuIGBTZXR0aW5nIHRoZSBzY2FsZSB0byBiZSBpbmRlcGVuZGVudCBmb3IgXCIke2NoYW5uZWx9XCIgbWVhbnMgd2UgYWxzbyBoYXZlIHRvIHNldCB0aGUgZ3VpZGUgKGF4aXMgb3IgbGVnZW5kKSB0byBiZSBpbmRlcGVuZGVudC5gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGRvbWFpblNvcnREcm9wcGVkKHNvcnQ6IFZnU29ydEZpZWxkKSB7XG4gICAgcmV0dXJuIGBEcm9wcGluZyBzb3J0IHByb3BlcnR5ICR7c3RyaW5naWZ5KHNvcnQpfSBhcyB1bmlvbmVkIGRvbWFpbnMgb25seSBzdXBwb3J0IGJvb2xlYW4gb3Igb3AgJ2NvdW50Jy5gO1xuICB9XG5cbiAgZXhwb3J0IGNvbnN0IFVOQUJMRV9UT19NRVJHRV9ET01BSU5TID0gJ1VuYWJsZSB0byBtZXJnZSBkb21haW5zJztcblxuICBleHBvcnQgY29uc3QgTU9SRV9USEFOX09ORV9TT1JUID0gJ0RvbWFpbnMgdGhhdCBzaG91bGQgYmUgdW5pb25lZCBoYXMgY29uZmxpY3Rpbmcgc29ydCBwcm9wZXJ0aWVzLiBTb3J0IHdpbGwgYmUgc2V0IHRvIHRydWUuJztcblxuICAvLyBBWElTXG4gIGV4cG9ydCBjb25zdCBJTlZBTElEX0NIQU5ORUxfRk9SX0FYSVMgPSAnSW52YWxpZCBjaGFubmVsIGZvciBheGlzLic7XG5cbiAgLy8gU1RBQ0tcbiAgZXhwb3J0IGZ1bmN0aW9uIGNhbm5vdFN0YWNrUmFuZ2VkTWFyayhjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgcmV0dXJuIGBDYW5ub3Qgc3RhY2sgXCIke2NoYW5uZWx9XCIgaWYgdGhlcmUgaXMgYWxyZWFkeSBcIiR7Y2hhbm5lbH0yXCJgO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGNhbm5vdFN0YWNrTm9uTGluZWFyU2NhbGUoc2NhbGVUeXBlOiBTY2FsZVR5cGUpIHtcbiAgICByZXR1cm4gYENhbm5vdCBzdGFjayBub24tbGluZWFyIHNjYWxlICgke3NjYWxlVHlwZX0pYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBzdGFja05vblN1bW1hdGl2ZUFnZ3JlZ2F0ZShhZ2dyZWdhdGU6IHN0cmluZykge1xuICAgIHJldHVybiBgU3RhY2tpbmcgaXMgYXBwbGllZCBldmVuIHRob3VnaCB0aGUgYWdncmVnYXRlIGZ1bmN0aW9uIGlzIG5vbi1zdW1tYXRpdmUgKFwiJHthZ2dyZWdhdGV9XCIpYDtcbiAgfVxuXG4gIC8vIFRJTUVVTklUXG4gIGV4cG9ydCBmdW5jdGlvbiBpbnZhbGlkVGltZVVuaXQodW5pdE5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZyB8IG51bWJlcikge1xuICAgIHJldHVybiBgSW52YWxpZCAke3VuaXROYW1lfTogJHtzdHJpbmdpZnkodmFsdWUpfWA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gZGF5UmVwbGFjZWRXaXRoRGF0ZShmdWxsVGltZVVuaXQ6IHN0cmluZykge1xuICAgIHJldHVybiBgVGltZSB1bml0IFwiJHtmdWxsVGltZVVuaXR9XCIgaXMgbm90IHN1cHBvcnRlZC4gV2UgYXJlIHJlcGxhY2luZyBpdCB3aXRoICR7XG4gICAgICBmdWxsVGltZVVuaXQucmVwbGFjZSgnZGF5JywgJ2RhdGUnKX0uYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBkcm9wcGVkRGF5KGQ6IERhdGVUaW1lIHwgRGF0ZVRpbWVFeHByKSB7XG4gICAgcmV0dXJuIGBEcm9wcGluZyBkYXkgZnJvbSBkYXRldGltZSAke3N0cmluZ2lmeShkKX0gYXMgZGF5IGNhbm5vdCBiZSBjb21iaW5lZCB3aXRoIG90aGVyIHVuaXRzLmA7XG4gIH1cbn1cblxuIl19