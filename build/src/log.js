/**
 * Vega-Lite's singleton logger utility.
 */
import { logger, Warn } from 'vega-util';
import { stringify } from './util';
/**
 * Main (default) Vega Logger instance for Vega-Lite
 */
const main = logger(Warn);
let current = main;
/**
 * Logger tool for checking if the code throws correct warning
 */
export class LocalLogger {
    constructor() {
        this.warns = [];
        this.infos = [];
        this.debugs = [];
    }
    level() {
        return this;
    }
    warn(...args) {
        this.warns.push(...args);
        return this;
    }
    info(...args) {
        this.infos.push(...args);
        return this;
    }
    debug(...args) {
        this.debugs.push(...args);
        return this;
    }
}
export function wrap(f) {
    return () => {
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
export function warn(..._) {
    current.warn.apply(current, arguments);
}
export function info(..._) {
    current.info.apply(current, arguments);
}
export function debug(..._) {
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
        return `Cannot project a selection on encoding channel "${channel}", which has no field.`;
    }
    message.cannotProjectOnChannelWithoutField = cannotProjectOnChannelWithoutField;
    function nearestNotSupportForContinuous(mark) {
        return `The "nearest" transform is not supported for ${mark} marks.`;
    }
    message.nearestNotSupportForContinuous = nearestNotSupportForContinuous;
    function selectionNotSupported(mark) {
        return `Selection not supported for ${mark} yet`;
    }
    message.selectionNotSupported = selectionNotSupported;
    function selectionNotFound(name) {
        return `Cannot find a selection named "${name}"`;
    }
    message.selectionNotFound = selectionNotFound;
    message.SCALE_BINDINGS_CONTINUOUS = 'Scale bindings are currently only supported for scales with unbinned, continuous domains.';
    // REPEAT
    function noSuchRepeatedValue(field) {
        return `Unknown repeated value "${field}".`;
    }
    message.noSuchRepeatedValue = noSuchRepeatedValue;
    // CONCAT
    message.CONCAT_CANNOT_SHARE_AXIS = 'Axes cannot be shared in concatenated views.';
    // REPEAT
    message.REPEAT_CANNOT_SHARE_AXIS = 'Axes cannot be shared in repeated views.';
    // TITLE
    function cannotSetTitleAnchor(type) {
        return `Cannot set title "anchor" for a ${type} spec`;
    }
    message.cannotSetTitleAnchor = cannotSetTitleAnchor;
    // DATA
    function unrecognizedParse(p) {
        return `Unrecognized parse "${p}".`;
    }
    message.unrecognizedParse = unrecognizedParse;
    function differentParse(field, local, ancestor) {
        return `An ancestor parsed field "${field}" as ${ancestor} but a child wants to parse the field as ${local}.`;
    }
    message.differentParse = differentParse;
    // TRANSFORMS
    function invalidTransformIgnored(transform) {
        return `Ignoring an invalid transform: ${stringify(transform)}.`;
    }
    message.invalidTransformIgnored = invalidTransformIgnored;
    message.NO_FIELDS_NEEDS_AS = 'If "from.fields" is not specified, "as" has to be a string that specifies the key to be used for the data from the secondary source.';
    // ENCODING & FACET
    function encodingOverridden(channels) {
        return `Layer's shared ${channels.join(',')} channel ${channels.length === 1 ? 'is' : 'are'} overriden`;
    }
    message.encodingOverridden = encodingOverridden;
    function projectionOverridden(opt) {
        const { parentProjection, projection } = opt;
        return `Layer's shared projection ${stringify(parentProjection)} is overridden by a child projection ${stringify(projection)}.`;
    }
    message.projectionOverridden = projectionOverridden;
    function primitiveChannelDef(channel, type, value) {
        return `Channel ${channel} is a ${type}. Converted to {value: ${stringify(value)}}.`;
    }
    message.primitiveChannelDef = primitiveChannelDef;
    function invalidFieldType(type) {
        return `Invalid field type "${type}"`;
    }
    message.invalidFieldType = invalidFieldType;
    function nonZeroScaleUsedWithLengthMark(mark, channel, opt) {
        const scaleText = opt.scaleType
            ? `${opt.scaleType} scale`
            : opt.zeroFalse
                ? 'scale with zero=false'
                : 'scale with custom domain that excludes zero';
        return `A ${scaleText} is used to encode ${mark}'s ${channel}. This can be misleading as the ${channel === 'x' ? 'width' : 'height'} of the ${mark} can be arbitrary based on the scale domain. You may want to use point mark instead.`;
    }
    message.nonZeroScaleUsedWithLengthMark = nonZeroScaleUsedWithLengthMark;
    function invalidFieldTypeForCountAggregate(type, aggregate) {
        return `Invalid field type "${type}" for aggregate: "${aggregate}", using "quantitative" instead.`;
    }
    message.invalidFieldTypeForCountAggregate = invalidFieldTypeForCountAggregate;
    function invalidAggregate(aggregate) {
        return `Invalid aggregation operator "${aggregate}"`;
    }
    message.invalidAggregate = invalidAggregate;
    function missingFieldType(channel, newType) {
        return `Missing type for channel "${channel}", using "${newType}" instead.`;
    }
    message.missingFieldType = missingFieldType;
    function droppingColor(type, opt) {
        const { fill, stroke } = opt;
        return (`Dropping color ${type} as the plot also has ` + (fill && stroke ? 'fill and stroke' : fill ? 'fill' : 'stroke'));
    }
    message.droppingColor = droppingColor;
    function emptyFieldDef(fieldDef, channel) {
        return `Dropping ${stringify(fieldDef)} from channel "${channel}" since it does not contain data field or value.`;
    }
    message.emptyFieldDef = emptyFieldDef;
    function latLongDeprecated(channel, type, newChannel) {
        return `${channel}-encoding with type ${type} is deprecated. Replacing with ${newChannel}-encoding.`;
    }
    message.latLongDeprecated = latLongDeprecated;
    message.LINE_WITH_VARYING_SIZE = 'Line marks cannot encode size with a non-groupby field. You may want to use trail marks instead.';
    function incompatibleChannel(channel, markOrFacet, when) {
        return `${channel} dropped as it is incompatible with "${markOrFacet}"${when ? ` when ${when}` : ''}.`;
    }
    message.incompatibleChannel = incompatibleChannel;
    function invalidEncodingChannel(channel) {
        return `${channel}-encoding is dropped as ${channel} is not a valid encoding channel.`;
    }
    message.invalidEncodingChannel = invalidEncodingChannel;
    function facetChannelShouldBeDiscrete(channel) {
        return `${channel} encoding should be discrete (ordinal / nominal / binned).`;
    }
    message.facetChannelShouldBeDiscrete = facetChannelShouldBeDiscrete;
    function discreteChannelCannotEncode(channel, type) {
        return `Using discrete channel "${channel}" to encode "${type}" field can be misleading as it does not encode ${type === 'ordinal' ? 'order' : 'magnitude'}.`;
    }
    message.discreteChannelCannotEncode = discreteChannelCannotEncode;
    // Mark
    message.BAR_WITH_POINT_SCALE_AND_RANGESTEP_NULL = 'Bar mark should not be used with point scale when rangeStep is null. Please use band scale instead.';
    function lineWithRange(hasX2, hasY2) {
        const channels = hasX2 && hasY2 ? 'x2 and y2' : hasX2 ? 'x2' : 'y2';
        return `Line mark is for continuous lines and thus cannot be used with ${channels}. We will use the rule mark (line segments) instead.`;
    }
    message.lineWithRange = lineWithRange;
    function orientOverridden(original, actual) {
        return `Specified orient "${original}" overridden with "${actual}"`;
    }
    message.orientOverridden = orientOverridden;
    // SCALE
    message.CANNOT_UNION_CUSTOM_DOMAIN_WITH_FIELD_DOMAIN = 'custom domain scale cannot be unioned with default field-based domain';
    function cannotUseScalePropertyWithNonColor(prop) {
        return `Cannot use the scale property "${prop}" with non-color channel.`;
    }
    message.cannotUseScalePropertyWithNonColor = cannotUseScalePropertyWithNonColor;
    function unaggregateDomainHasNoEffectForRawField(fieldDef) {
        return `Using unaggregated domain with raw field has no effect (${stringify(fieldDef)}).`;
    }
    message.unaggregateDomainHasNoEffectForRawField = unaggregateDomainHasNoEffectForRawField;
    function unaggregateDomainWithNonSharedDomainOp(aggregate) {
        return `Unaggregated domain not applicable for "${aggregate}" since it produces values outside the origin domain of the source data.`;
    }
    message.unaggregateDomainWithNonSharedDomainOp = unaggregateDomainWithNonSharedDomainOp;
    function unaggregatedDomainWithLogScale(fieldDef) {
        return `Unaggregated domain is currently unsupported for log scale (${stringify(fieldDef)}).`;
    }
    message.unaggregatedDomainWithLogScale = unaggregatedDomainWithLogScale;
    function cannotApplySizeToNonOrientedMark(mark) {
        return `Cannot apply size to non-oriented mark "${mark}".`;
    }
    message.cannotApplySizeToNonOrientedMark = cannotApplySizeToNonOrientedMark;
    function rangeStepDropped(channel) {
        return `rangeStep for "${channel}" is dropped as top-level ${channel === 'x' ? 'width' : 'height'} is provided.`;
    }
    message.rangeStepDropped = rangeStepDropped;
    function scaleTypeNotWorkWithChannel(channel, scaleType, defaultScaleType) {
        return `Channel "${channel}" does not work with "${scaleType}" scale. We are using "${defaultScaleType}" scale instead.`;
    }
    message.scaleTypeNotWorkWithChannel = scaleTypeNotWorkWithChannel;
    function scaleTypeNotWorkWithFieldDef(scaleType, defaultScaleType) {
        return `FieldDef does not work with "${scaleType}" scale. We are using "${defaultScaleType}" scale instead.`;
    }
    message.scaleTypeNotWorkWithFieldDef = scaleTypeNotWorkWithFieldDef;
    function scalePropertyNotWorkWithScaleType(scaleType, propName, channel) {
        return `${channel}-scale's "${propName}" is dropped as it does not work with ${scaleType} scale.`;
    }
    message.scalePropertyNotWorkWithScaleType = scalePropertyNotWorkWithScaleType;
    function scaleTypeNotWorkWithMark(mark, scaleType) {
        return `Scale type "${scaleType}" does not work with mark "${mark}".`;
    }
    message.scaleTypeNotWorkWithMark = scaleTypeNotWorkWithMark;
    function mergeConflictingProperty(property, propertyOf, v1, v2) {
        return `Conflicting ${propertyOf.toString()} property "${property.toString()}" (${stringify(v1)} and ${stringify(v2)}).  Using ${stringify(v1)}.`;
    }
    message.mergeConflictingProperty = mergeConflictingProperty;
    function independentScaleMeansIndependentGuide(channel) {
        return `Setting the scale to be independent for "${channel}" means we also have to set the guide (axis or legend) to be independent.`;
    }
    message.independentScaleMeansIndependentGuide = independentScaleMeansIndependentGuide;
    function domainSortDropped(sort) {
        return `Dropping sort property ${stringify(sort)} as unioned domains only support boolean or op 'count'.`;
    }
    message.domainSortDropped = domainSortDropped;
    message.UNABLE_TO_MERGE_DOMAINS = 'Unable to merge domains';
    message.MORE_THAN_ONE_SORT = 'Domains that should be unioned has conflicting sort properties. Sort will be set to true.';
    // AXIS
    message.INVALID_CHANNEL_FOR_AXIS = 'Invalid channel for axis.';
    // STACK
    function cannotStackRangedMark(channel) {
        return `Cannot stack "${channel}" if there is already "${channel}2"`;
    }
    message.cannotStackRangedMark = cannotStackRangedMark;
    function cannotStackNonLinearScale(scaleType) {
        return `Cannot stack non-linear scale (${scaleType})`;
    }
    message.cannotStackNonLinearScale = cannotStackNonLinearScale;
    function stackNonSummativeAggregate(aggregate) {
        return `Stacking is applied even though the aggregate function is non-summative ("${aggregate}")`;
    }
    message.stackNonSummativeAggregate = stackNonSummativeAggregate;
    // TIMEUNIT
    function invalidTimeUnit(unitName, value) {
        return `Invalid ${unitName}: ${stringify(value)}`;
    }
    message.invalidTimeUnit = invalidTimeUnit;
    function dayReplacedWithDate(fullTimeUnit) {
        return `Time unit "${fullTimeUnit}" is not supported. We are replacing it with ${fullTimeUnit.replace('day', 'date')}.`;
    }
    message.dayReplacedWithDate = dayReplacedWithDate;
    function droppedDay(d) {
        return `Dropping day from datetime ${stringify(d)} as day cannot be combined with other units.`;
    }
    message.droppedDay = droppedDay;
    function errorBarCenterAndExtentAreNotNeeded(center, extent) {
        return `${extent ? 'extent ' : ''}${extent && center ? 'and ' : ''}${center ? 'center ' : ''}${extent && center ? 'are ' : 'is '}not needed when data are aggregated.`;
    }
    message.errorBarCenterAndExtentAreNotNeeded = errorBarCenterAndExtentAreNotNeeded;
    function errorBarCenterIsUsedWithWrongExtent(center, extent, mark) {
        return `${center} is not usually used with ${extent} for ${mark}.`;
    }
    message.errorBarCenterIsUsedWithWrongExtent = errorBarCenterIsUsedWithWrongExtent;
    function errorBarContinuousAxisHasCustomizedAggregate(aggregate, compositeMark) {
        return `Continuous axis should not have customized aggregation function ${aggregate}; ${compositeMark} already agregates the axis.`;
    }
    message.errorBarContinuousAxisHasCustomizedAggregate = errorBarContinuousAxisHasCustomizedAggregate;
    function errorBarCenterIsNotNeeded(extent, mark) {
        return `Center is not needed to be specified in ${mark} when extent is ${extent}.`;
    }
    message.errorBarCenterIsNotNeeded = errorBarCenterIsNotNeeded;
    function errorBand1DNotSupport(property) {
        return `1D error band does not support ${property}`;
    }
    message.errorBand1DNotSupport = errorBand1DNotSupport;
    // CHANNEL
    function channelRequiredForBinned(channel) {
        return `Channel ${channel} is required for "binned" bin`;
    }
    message.channelRequiredForBinned = channelRequiredForBinned;
    function domainRequiredForThresholdScale(channel) {
        return `Domain for ${channel} is required for threshold scale`;
    }
    message.domainRequiredForThresholdScale = domainRequiredForThresholdScale;
})(message || (message = {}));
//# sourceMappingURL=log.js.map