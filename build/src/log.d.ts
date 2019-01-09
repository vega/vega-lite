/**
 * Vega-Lite's singleton logger utility.
 */
import { AggregateOp } from 'vega';
import { LoggerInterface } from 'vega-util';
import { Channel, GeoPositionChannel } from './channel';
import { CompositeMark } from './compositemark';
import { ErrorBarCenter, ErrorBarExtent } from './compositemark/errorbar';
import { DateTime, DateTimeExpr } from './datetime';
import { Aggregate, TypedFieldDef } from './fielddef';
import { Mark } from './mark';
import { Projection } from './projection';
import { ScaleType } from './scale';
import { Type } from './type';
import { VgSortField } from './vega.schema';
export { LoggerInterface } from 'vega-util';
/**
 * Logger tool for checking if the code throws correct warning
 */
export declare class LocalLogger implements LoggerInterface {
    warns: any[];
    infos: any[];
    debugs: any[];
    level(): this;
    warn(...args: any[]): this;
    info(...args: any[]): this;
    debug(...args: any[]): this;
}
export declare function wrap(f: (logger: LocalLogger) => void): () => void;
/**
 * Set the singleton logger to be a custom logger
 */
export declare function set(newLogger: LoggerInterface): LoggerInterface;
/**
 * Reset the main logger to use the default Vega Logger
 */
export declare function reset(): LoggerInterface;
export declare function warn(..._: any[]): void;
export declare function info(..._: any[]): void;
export declare function debug(..._: any[]): void;
/**
 * Collection of all Vega-Lite Error Messages
 */
export declare namespace message {
    const INVALID_SPEC = "Invalid spec";
    const FIT_NON_SINGLE = "Autosize \"fit\" only works for single views and layered views.";
    const CANNOT_FIX_RANGE_STEP_WITH_FIT = "Cannot use a fixed value of \"rangeStep\" when \"autosize\" is \"fit\".";
    function cannotProjectOnChannelWithoutField(channel: Channel): string;
    function nearestNotSupportForContinuous(mark: string): string;
    function selectionNotSupported(mark: CompositeMark): string;
    function selectionNotFound(name: string): string;
    const SCALE_BINDINGS_CONTINUOUS = "Scale bindings are currently only supported for scales with unbinned, continuous domains.";
    function noSuchRepeatedValue(field: string): string;
    const CONCAT_CANNOT_SHARE_AXIS = "Axes cannot be shared in concatenated views.";
    const REPEAT_CANNOT_SHARE_AXIS = "Axes cannot be shared in repeated views.";
    function cannotSetTitleAnchor(type: string): string;
    function unrecognizedParse(p: string): string;
    function differentParse(field: string, local: string, ancestor: string): string;
    function invalidTransformIgnored(transform: any): string;
    const NO_FIELDS_NEEDS_AS = "If \"from.fields\" is not specified, \"as\" has to be a string that specifies the key to be used for the data from the secondary source.";
    function encodingOverridden(channels: Channel[]): string;
    function projectionOverridden(opt: {
        parentProjection: Projection;
        projection: Projection;
    }): string;
    function primitiveChannelDef(channel: Channel, type: 'string' | 'number' | 'boolean', value: string | number | boolean): string;
    function invalidFieldType(type: Type): string;
    function nonZeroScaleUsedWithLengthMark(mark: 'bar' | 'area', channel: Channel, opt: {
        scaleType?: ScaleType;
        zeroFalse?: boolean;
    }): string;
    function invalidFieldTypeForCountAggregate(type: Type, aggregate: string): string;
    function invalidAggregate(aggregate: AggregateOp | string): string;
    function missingFieldType(channel: Channel, newType: Type): string;
    function droppingColor(type: 'encoding' | 'property', opt: {
        fill?: boolean;
        stroke?: boolean;
    }): string;
    function emptyFieldDef(fieldDef: TypedFieldDef<string>, channel: Channel): string;
    function latLongDeprecated(channel: Channel, type: Type, newChannel: GeoPositionChannel): string;
    const LINE_WITH_VARYING_SIZE = "Line marks cannot encode size with a non-groupby field. You may want to use trail marks instead.";
    function incompatibleChannel(channel: Channel, markOrFacet: Mark | 'facet' | CompositeMark, when?: string): string;
    function invalidEncodingChannel(channel: string): string;
    function facetChannelShouldBeDiscrete(channel: string): string;
    function discreteChannelCannotEncode(channel: Channel, type: Type): string;
    const BAR_WITH_POINT_SCALE_AND_RANGESTEP_NULL = "Bar mark should not be used with point scale when rangeStep is null. Please use band scale instead.";
    function lineWithRange(hasX2: boolean, hasY2: boolean): string;
    function orientOverridden(original: string, actual: string): string;
    const CANNOT_UNION_CUSTOM_DOMAIN_WITH_FIELD_DOMAIN = "custom domain scale cannot be unioned with default field-based domain";
    function cannotUseScalePropertyWithNonColor(prop: string): string;
    function unaggregateDomainHasNoEffectForRawField(fieldDef: TypedFieldDef<string>): string;
    function unaggregateDomainWithNonSharedDomainOp(aggregate: string): string;
    function unaggregatedDomainWithLogScale(fieldDef: TypedFieldDef<string>): string;
    function cannotApplySizeToNonOrientedMark(mark: Mark): string;
    function rangeStepDropped(channel: Channel): string;
    function scaleTypeNotWorkWithChannel(channel: Channel, scaleType: ScaleType, defaultScaleType: ScaleType): string;
    function scaleTypeNotWorkWithFieldDef(scaleType: ScaleType, defaultScaleType: ScaleType): string;
    function scalePropertyNotWorkWithScaleType(scaleType: ScaleType, propName: string, channel: Channel): string;
    function scaleTypeNotWorkWithMark(mark: Mark, scaleType: ScaleType): string;
    function mergeConflictingProperty<T>(property: string | number | symbol, propertyOf: string | number | symbol, v1: T, v2: T): string;
    function independentScaleMeansIndependentGuide(channel: Channel): string;
    function domainSortDropped(sort: VgSortField): string;
    const UNABLE_TO_MERGE_DOMAINS = "Unable to merge domains";
    const MORE_THAN_ONE_SORT = "Domains that should be unioned has conflicting sort properties. Sort will be set to true.";
    const INVALID_CHANNEL_FOR_AXIS = "Invalid channel for axis.";
    function cannotStackRangedMark(channel: Channel): string;
    function cannotStackNonLinearScale(scaleType: ScaleType): string;
    function stackNonSummativeAggregate(aggregate: string): string;
    function invalidTimeUnit(unitName: string, value: string | number): string;
    function dayReplacedWithDate(fullTimeUnit: string): string;
    function droppedDay(d: DateTime | DateTimeExpr): string;
    function errorBarCenterAndExtentAreNotNeeded(center: ErrorBarCenter, extent: ErrorBarExtent): string;
    function errorBarCenterIsUsedWithWrongExtent(center: ErrorBarCenter, extent: ErrorBarExtent, mark: 'errorbar' | 'errorband'): string;
    function errorBarContinuousAxisHasCustomizedAggregate(aggregate: Aggregate, compositeMark: CompositeMark): string;
    function errorBarCenterIsNotNeeded(extent: ErrorBarExtent, mark: 'errorbar' | 'errorband'): string;
    function errorBand1DNotSupport(property: 'interpolate' | 'tension'): string;
    function channelRequiredForBinned(channel: Channel): string;
    function domainRequiredForThresholdScale(channel: Channel): string;
}
