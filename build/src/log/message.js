import { getSizeChannel } from '../channel';
import { stringify } from '../util';
export function invalidSpec(spec) {
    return `Invalid specification ${stringify(spec)}. Make sure the specification includes at least one of the following properties: "mark", "layer", "facet", "hconcat", "vconcat", "concat", or "repeat".`;
}
// FIT
export const FIT_NON_SINGLE = 'Autosize "fit" only works for single views and layered views.';
export function containerSizeNonSingle(name) {
    const uName = name == 'width' ? 'Width' : 'Height';
    return `${uName} "container" only works for single views and layered views.`;
}
export function containerSizeNotCompatibleWithAutosize(name) {
    const uName = name == 'width' ? 'Width' : 'Height';
    const fitDirection = name == 'width' ? 'x' : 'y';
    return `${uName} "container" only works well with autosize "fit" or "fit-${fitDirection}".`;
}
export function droppingFit(channel) {
    return channel
        ? `Dropping "fit-${channel}" because spec has discrete ${getSizeChannel(channel)}.`
        : `Dropping "fit" because spec has discrete size.`;
}
// VIEW SIZE
export function unknownField(channel) {
    return `Unknown field for ${channel}. Cannot calculate view size.`;
}
// SELECTION
export function cannotProjectOnChannelWithoutField(channel) {
    return `Cannot project a selection on encoding channel "${channel}", which has no field.`;
}
export function cannotProjectAggregate(channel, aggregate) {
    return `Cannot project a selection on encoding channel "${channel}" as it uses an aggregate function ("${aggregate}").`;
}
export function nearestNotSupportForContinuous(mark) {
    return `The "nearest" transform is not supported for ${mark} marks.`;
}
export function selectionNotSupported(mark) {
    return `Selection not supported for ${mark} yet.`;
}
export function selectionNotFound(name) {
    return `Cannot find a selection named "${name}".`;
}
export const SCALE_BINDINGS_CONTINUOUS = 'Scale bindings are currently only supported for scales with unbinned, continuous domains.';
export const LEGEND_BINDINGS_MUST_HAVE_PROJECTION = 'Legend bindings are only supported for selections over an individual field or encoding channel.';
export function cannotLookupVariableParameter(name) {
    return `Lookups can only be performed on selection parameters. "${name}" is a variable parameter.`;
}
export function noSameUnitLookup(name) {
    return (`Cannot define and lookup the "${name}" selection in the same view. ` +
        `Try moving the lookup into a second, layered view?`);
}
export const NEEDS_SAME_SELECTION = 'The same selection must be used to override scale domains in a layered view.';
export const INTERVAL_INITIALIZED_WITH_POS = 'Interval selections should be initialized using "x", "y", "longitude", or "latitude" keys.';
// REPEAT
export function noSuchRepeatedValue(field) {
    return `Unknown repeated value "${field}".`;
}
export function columnsNotSupportByRowCol(type) {
    return `The "columns" property cannot be used when "${type}" has nested row/column.`;
}
// CONCAT / REPEAT
export const CONCAT_CANNOT_SHARE_AXIS = 'Axes cannot be shared in concatenated or repeated views yet (https://github.com/vega/vega-lite/issues/2415).';
// DATA
export function unrecognizedParse(p) {
    return `Unrecognized parse "${p}".`;
}
export function differentParse(field, local, ancestor) {
    return `An ancestor parsed field "${field}" as ${ancestor} but a child wants to parse the field as ${local}.`;
}
export const ADD_SAME_CHILD_TWICE = 'Attempt to add the same child twice.';
// TRANSFORMS
export function invalidTransformIgnored(transform) {
    return `Ignoring an invalid transform: ${stringify(transform)}.`;
}
export const NO_FIELDS_NEEDS_AS = 'If "from.fields" is not specified, "as" has to be a string that specifies the key to be used for the data from the secondary source.';
// ENCODING & FACET
export function customFormatTypeNotAllowed(channel) {
    return `Config.customFormatTypes is not true, thus custom format type and format for channel ${channel} are dropped.`;
}
export function projectionOverridden(opt) {
    const { parentProjection, projection } = opt;
    return `Layer's shared projection ${stringify(parentProjection)} is overridden by a child projection ${stringify(projection)}.`;
}
export const REPLACE_ANGLE_WITH_THETA = 'Arc marks uses theta channel rather than angle, replacing angle with theta.';
export function offsetNestedInsideContinuousPositionScaleDropped(mainChannel) {
    return `${mainChannel}Offset dropped because ${mainChannel} is continuous`;
}
export function primitiveChannelDef(channel, type, value) {
    return `Channel ${channel} is a ${type}. Converted to {value: ${stringify(value)}}.`;
}
export function invalidFieldType(type) {
    return `Invalid field type "${type}".`;
}
export function invalidFieldTypeForCountAggregate(type, aggregate) {
    return `Invalid field type "${type}" for aggregate: "${aggregate}", using "quantitative" instead.`;
}
export function invalidAggregate(aggregate) {
    return `Invalid aggregation operator "${aggregate}".`;
}
export function missingFieldType(channel, newType) {
    return `Missing type for channel "${channel}", using "${newType}" instead.`;
}
export function droppingColor(type, opt) {
    const { fill, stroke } = opt;
    return `Dropping color ${type} as the plot also has ${fill && stroke ? 'fill and stroke' : fill ? 'fill' : 'stroke'}.`;
}
export function relativeBandSizeNotSupported(sizeChannel) {
    return `Position range does not support relative band size for ${sizeChannel}.`;
}
export function emptyFieldDef(fieldDef, channel) {
    return `Dropping ${stringify(fieldDef)} from channel "${channel}" since it does not contain any data field, datum, value, or signal.`;
}
export const LINE_WITH_VARYING_SIZE = 'Line marks cannot encode size with a non-groupby field. You may want to use trail marks instead.';
export function incompatibleChannel(channel, markOrFacet, when) {
    return `${channel} dropped as it is incompatible with "${markOrFacet}"${when ? ` when ${when}` : ''}.`;
}
export function offsetEncodingScaleIgnored(channel) {
    return `${channel} encoding has no scale, so specified scale is ignored.`;
}
export function invalidEncodingChannel(channel) {
    return `${channel}-encoding is dropped as ${channel} is not a valid encoding channel.`;
}
export function channelShouldBeDiscrete(channel) {
    return `${channel} encoding should be discrete (ordinal / nominal / binned).`;
}
export function channelShouldBeDiscreteOrDiscretizing(channel) {
    return `${channel} encoding should be discrete (ordinal / nominal / binned) or use a discretizing scale (e.g. threshold).`;
}
export function facetChannelDropped(channels) {
    return `Facet encoding dropped as ${channels.join(' and ')} ${channels.length > 1 ? 'are' : 'is'} also specified.`;
}
export function discreteChannelCannotEncode(channel, type) {
    return `Using discrete channel "${channel}" to encode "${type}" field can be misleading as it does not encode ${type === 'ordinal' ? 'order' : 'magnitude'}.`;
}
// MARK
export function rangeMarkAlignmentCannotBeExpression(align) {
    return `The ${align} for range marks cannot be an expression`;
}
export function lineWithRange(hasX2, hasY2) {
    const channels = hasX2 && hasY2 ? 'x2 and y2' : hasX2 ? 'x2' : 'y2';
    return `Line mark is for continuous lines and thus cannot be used with ${channels}. We will use the rule mark (line segments) instead.`;
}
export function orientOverridden(original, actual) {
    return `Specified orient "${original}" overridden with "${actual}".`;
}
// SCALE
export const CANNOT_UNION_CUSTOM_DOMAIN_WITH_FIELD_DOMAIN = 'Custom domain scale cannot be unioned with default field-based domain.';
export function cannotUseScalePropertyWithNonColor(prop) {
    return `Cannot use the scale property "${prop}" with non-color channel.`;
}
export function cannotUseRelativeBandSizeWithNonBandScale(scaleType) {
    return `Cannot use the relative band size with ${scaleType} scale.`;
}
export function unaggregateDomainHasNoEffectForRawField(fieldDef) {
    return `Using unaggregated domain with raw field has no effect (${stringify(fieldDef)}).`;
}
export function unaggregateDomainWithNonSharedDomainOp(aggregate) {
    return `Unaggregated domain not applicable for "${aggregate}" since it produces values outside the origin domain of the source data.`;
}
export function unaggregatedDomainWithLogScale(fieldDef) {
    return `Unaggregated domain is currently unsupported for log scale (${stringify(fieldDef)}).`;
}
export function cannotApplySizeToNonOrientedMark(mark) {
    return `Cannot apply size to non-oriented mark "${mark}".`;
}
export function scaleTypeNotWorkWithChannel(channel, scaleType, defaultScaleType) {
    return `Channel "${channel}" does not work with "${scaleType}" scale. We are using "${defaultScaleType}" scale instead.`;
}
export function scaleTypeNotWorkWithFieldDef(scaleType, defaultScaleType) {
    return `FieldDef does not work with "${scaleType}" scale. We are using "${defaultScaleType}" scale instead.`;
}
export function scalePropertyNotWorkWithScaleType(scaleType, propName, channel) {
    return `${channel}-scale's "${propName}" is dropped as it does not work with ${scaleType} scale.`;
}
export function scaleTypeNotWorkWithMark(mark, scaleType) {
    return `Scale type "${scaleType}" does not work with mark "${mark}".`;
}
export function stepDropped(channel) {
    return `The step for "${channel}" is dropped because the ${channel === 'width' ? 'x' : 'y'} is continuous.`;
}
export function mergeConflictingProperty(property, propertyOf, v1, v2) {
    return `Conflicting ${propertyOf.toString()} property "${property.toString()}" (${stringify(v1)} and ${stringify(v2)}). Using ${stringify(v1)}.`;
}
export function mergeConflictingDomainProperty(property, propertyOf, v1, v2) {
    return `Conflicting ${propertyOf.toString()} property "${property.toString()}" (${stringify(v1)} and ${stringify(v2)}). Using the union of the two domains.`;
}
export function independentScaleMeansIndependentGuide(channel) {
    return `Setting the scale to be independent for "${channel}" means we also have to set the guide (axis or legend) to be independent.`;
}
export function domainSortDropped(sort) {
    return `Dropping sort property ${stringify(sort)} as unioned domains only support boolean or op "count", "min", and "max".`;
}
export const MORE_THAN_ONE_SORT = 'Domains that should be unioned has conflicting sort properties. Sort will be set to true.';
export const FACETED_INDEPENDENT_DIFFERENT_SOURCES = 'Detected faceted independent scales that union domain of multiple fields from different data sources. We will use the first field. The result view size may be incorrect.';
export const FACETED_INDEPENDENT_SAME_FIELDS_DIFFERENT_SOURCES = 'Detected faceted independent scales that union domain of the same fields from different source. We will assume that this is the same field from a different fork of the same data source. However, if this is not the case, the result view size may be incorrect.';
export const FACETED_INDEPENDENT_SAME_SOURCE = 'Detected faceted independent scales that union domain of multiple fields from the same data source. We will use the first field. The result view size may be incorrect.';
// AXIS
export const INVALID_CHANNEL_FOR_AXIS = 'Invalid channel for axis.';
// STACK
export function cannotStackRangedMark(channel) {
    return `Cannot stack "${channel}" if there is already "${channel}2".`;
}
export function cannotStackNonLinearScale(scaleType) {
    return `Cannot stack non-linear scale (${scaleType}).`;
}
export function stackNonSummativeAggregate(aggregate) {
    return `Stacking is applied even though the aggregate function is non-summative ("${aggregate}").`;
}
// TIMEUNIT
export function invalidTimeUnit(unitName, value) {
    return `Invalid ${unitName}: ${stringify(value)}.`;
}
export function droppedDay(d) {
    return `Dropping day from datetime ${stringify(d)} as day cannot be combined with other units.`;
}
export function errorBarCenterAndExtentAreNotNeeded(center, extent) {
    return `${extent ? 'extent ' : ''}${extent && center ? 'and ' : ''}${center ? 'center ' : ''}${extent && center ? 'are ' : 'is '}not needed when data are aggregated.`;
}
export function errorBarCenterIsUsedWithWrongExtent(center, extent, mark) {
    return `${center} is not usually used with ${extent} for ${mark}.`;
}
export function errorBarContinuousAxisHasCustomizedAggregate(aggregate, compositeMark) {
    return `Continuous axis should not have customized aggregation function ${aggregate}; ${compositeMark} already agregates the axis.`;
}
export function errorBand1DNotSupport(property) {
    return `1D error band does not support ${property}.`;
}
// CHANNEL
export function channelRequiredForBinned(channel) {
    return `Channel ${channel} is required for "binned" bin.`;
}
export function channelShouldNotBeUsedForBinned(channel) {
    return `Channel ${channel} should not be used with "binned" bin.`;
}
export function domainRequiredForThresholdScale(channel) {
    return `Domain for ${channel} is required for threshold scale.`;
}
//# sourceMappingURL=message.js.map