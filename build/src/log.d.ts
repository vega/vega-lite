/// <reference path="../../typings/vega-util.d.ts" />
/**
 * Vega-Lite's singleton logger utility.
 */
import { LoggerInterface } from 'vega-util';
import { AggregateOp } from './aggregate';
import { Channel } from './channel';
import { DateTime, DateTimeExpr } from './datetime';
import { FieldDef } from './fielddef';
import { Mark } from './mark';
import { ScaleType } from './scale';
import { TimeUnit } from './timeunit';
import { Type } from './type';
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
export declare function runLocalLogger(f: (localLogger: LocalLogger) => void): void;
export declare function wrap(f: (logger: LocalLogger) => void): () => void;
/**
 * Set the singleton logger to be a custom logger
 */
export declare function set(logger: LoggerInterface): LoggerInterface;
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
    function invalidTransformIgnored(transform: any): string;
    function invalidFieldType(type: Type): string;
    function invalidAggregate(aggregate: AggregateOp | string): string;
    function emptyOrInvalidFieldType(type: Type | string, channel: Channel, newType: Type): string;
    function emptyFieldDef(fieldDef: FieldDef, channel: Channel): string;
    function incompatibleChannel(channel: Channel, markOrFacet: Mark | 'facet', when?: string): string;
    function facetChannelShouldBeDiscrete(channel: string): string;
    function discreteChannelCannotEncode(channel: Channel, type: Type): string;
    const BAR_WITH_POINT_SCALE_AND_RANGESTEP_NULL = "Bar mark should not be used with point scale when rangeStep is null. Please use band scale instead.";
    function unclearOrientContinuous(mark: Mark): string;
    function unclearOrientDiscreteOrEmpty(mark: Mark): string;
    function orientOverridden(original: string, actual: string): string;
    const CANNOT_UNION_CUSTOM_DOMAIN_WITH_FIELD_DOMAIN = "custom domain scale cannot be unioned with default field-based domain";
    function cannotUseScalePropertyWithNonColor(prop: string): string;
    function unaggregateDomainHasNoEffectForRawField(fieldDef: FieldDef): string;
    function unaggregateDomainWithNonSharedDomainOp(aggregate: AggregateOp): string;
    function unaggregatedDomainWithLogScale(fieldDef: FieldDef): string;
    const CANNOT_USE_RANGE_WITH_POSITION = "Cannot use custom range with x or y channel.  Please customize width, height, padding, or rangeStep instead.";
    const CANNOT_USE_PADDING_WITH_FACET = "Cannot use padding with facet's scale.  Please use spacing instead.";
    function cannotUseRangePropertyWithFacet(propName: string): string;
    function rangeStepDropped(channel: Channel): string;
    function scaleTypeNotWorkWithChannel(channel: Channel, scaleType: ScaleType, defaultScaleType: ScaleType): string;
    function scaleTypeNotWorkWithFieldDef(scaleType: ScaleType, defaultScaleType: ScaleType): string;
    function scalePropertyNotWorkWithScaleType(scaleType: ScaleType, propName: string, channel: Channel): string;
    function scaleTypeNotWorkWithMark(mark: Mark, scaleType: ScaleType): string;
    const INVAID_DOMAIN = "Invalid scale domain";
    const UNABLE_TO_MERGE_DOMAINS = "Unable to merge domains";
    const INVALID_CHANNEL_FOR_AXIS = "Invalid channel for axis.";
    function cannotStackRangedMark(channel: Channel): string;
    function cannotStackNonLinearScale(scaleType: ScaleType): string;
    function cannotStackNonSummativeAggregate(aggregate: AggregateOp): string;
    function invalidTimeUnit(unitName: string, value: string | number): string;
    function dayReplacedWithDate(fullTimeUnit: TimeUnit): string;
    function droppedDay(d: DateTime | DateTimeExpr): string;
}
