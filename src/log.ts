///<reference path="../typings/vega-util.d.ts" />

/**
 * Vega-Lite's singleton logger utility.
 */

import {logger, LoggerInterface, Warn} from 'vega-util';

import {AggregateOp} from './aggregate';
import {Channel} from './channel';
import {DateTime, DateTimeExpr} from './datetime';
import {FieldDef} from './fielddef';
import {Mark} from './mark';
import {ScaleType} from './scale';
import {TimeUnit} from './timeunit';
import {Type} from './type';

export {LoggerInterface} from 'vega-util';

/**
 * Main (default) Vega Logger instance for Vega-Lite
 */
const main = logger(Warn);
let current: LoggerInterface = main;

/**
 * Logger tool for checking if the code throws correct warning
 */
export class LocalLogger implements LoggerInterface {
  public warns: any[] = [];
  public infos: any[] = [];
  public debugs: any[] = [];

  public level() {
    return this;
  }

  public warn(...args: any[]) {
    this.warns.push(...args);
    return this;
  }

  public info(...args: any[]) {
    this.infos.push(...args);
    return this;
  }

  public debug(...args: any[]) {
    this.debugs.push(...args);
    return this;
  }
}

export function runLocalLogger(f: (localLogger: LocalLogger) => void) {
  const localLogger = current = new LocalLogger();
  f(localLogger);
  reset();
}

export function wrap(f: (logger: LocalLogger) => void) {
  return () => {
    const logger = current = new LocalLogger();
    f(logger);
    reset();
  };
}

/**
 * Set the singleton logger to be a custom logger
 */
export function set(logger: LoggerInterface) {
  current = logger;
  return current;
}

/**
 * Reset the main logger to use the default Vega Logger
 */
export function reset() {
  current = main;
  return current;
}

export function warn(..._: any[]) {
  current.warn.apply(current, arguments);
}

export function info(..._: any[]) {
  current.info.apply(current, arguments);
}

export function debug(..._: any[]) {
  current.debug.apply(current, arguments);
}

/**
 * Collection of all Vega-Lite Error Messages
 */
export namespace message {
  export const INVALID_SPEC = 'Invalid spec';

  // TRANSFORMS
  export function invalidTransformIgnored(transform: any) {
    return `Ignoring an invalid transform: ${JSON.stringify(transform)}.`;
  }

  // ENCODING & FACET
  export function invalidFieldType(type: Type) {
    return `Invalid field type "${type}"`;
  }
  export function invalidAggregate(aggregate: AggregateOp | string) {
    return `Invalid aggregation operator "${aggregate}"`;
  }

  export function emptyOrInvalidFieldType(type: Type | string, channel: Channel, newType: Type) {
    return `Invalid field type (${type}) for channel ${channel}, using ${newType} instead.`;
  }

  export function emptyFieldDef(fieldDef: FieldDef, channel: Channel) {
    return `Dropping ${JSON.stringify(fieldDef)} from channel ${channel} since it does not contain data field or value.`;
  }

  export function incompatibleChannel(channel: Channel, markOrFacet: Mark | 'facet', when?: string) {
    return `${channel} dropped as it is incompatible with ${markOrFacet}` +
      when ? `when ${when}` : '';
  }

  export function facetChannelShouldBeDiscrete(channel: string) {
    return `${channel} encoding should be discrete (ordinal / nominal / binned).`;
  }

  export function discreteChannelCannotEncode(channel: Channel, type: Type) {
    return `Using discrete channel ${channel} to encode ${type} field can be misleading as it does not encode ${type === 'ordinal' ? 'order' : 'magnitude'}.`;
  }

  // Mark
  export const BAR_WITH_POINT_SCALE_AND_RANGESTEP_NULL = 'Bar mark should not be used with point scale when rangeStep is null. Please use band scale instead.';

  export function unclearOrientContinuous(mark: Mark) {
    return 'Cannot clearly determine orientation for ' + mark + ' since both x and y channel encode continous fields. In this case, we use vertical by default';
  }

  export function unclearOrientDiscreteOrEmpty(mark: Mark) {
    return 'Cannot clearly determine orientation for ' + mark + ' since both x and y channel encode discrete or empty fields.';
  }

  export function orientOverridden(original: string, actual: string) {
    return `Specified orient ${original} overridden with ${actual}`;
  }

  // SCALE
  export const CANNOT_UNION_CUSTOM_DOMAIN_WITH_FIELD_DOMAIN = 'custom domain scale cannot be unioned with default field-based domain';

  export function cannotUseScalePropertyWithNonColor(prop: string) {
    return `Cannot use ${prop} with non-color channel.`;
  }

  export function unaggregateDomainHasNoEffectForRawField(fieldDef: FieldDef) {
    return `Using unaggregated domain with raw field has no effect (${JSON.stringify(fieldDef)}).`;
  }

  export function unaggregateDomainWithNonSharedDomainOp(aggregate: AggregateOp) {
    return `Unaggregated domain not applicable for ${aggregate} since it produces values outside the origin domain of the source data.`;
  }

  export function unaggregatedDomainWithLogScale(fieldDef: FieldDef) {
    return `Unaggregated domain is currently unsupported for log scale (${JSON.stringify(fieldDef)}).`;
  }

  export const CANNOT_USE_RANGE_WITH_POSITION =
    'Cannot use custom range with x or y channel.  Please customize width, height, padding, or rangeStep instead.';

    export const CANNOT_USE_PADDING_WITH_FACET = 'Cannot use padding with facet\'s scale.  Please use spacing instead.';

  export function cannotUseRangePropertyWithFacet(propName: string) {
    return `Cannot use custom ${propName} with row or column channel. Please use width, height, or spacing instead.`;
  }

  export function rangeStepDropped(channel: Channel) {
    return `rangeStep for ${channel} is dropped as top-level ${
      channel === 'x' ? 'width' : 'height'} is provided.`;
  }

  export function scaleTypeNotWorkWithChannel(channel: Channel, scaleType: ScaleType, defaultScaleType: ScaleType) {
    return `Channel ${channel} does not work with ${scaleType} scale. We are using ${defaultScaleType} scale instead.`;
  }

  export function scaleTypeNotWorkWithFieldDef(scaleType: ScaleType, defaultScaleType: ScaleType) {
    return `FieldDef does not work with ${scaleType} scale. We are using ${defaultScaleType} scale instead.`;
  }

  export function scalePropertyNotWorkWithScaleType(scaleType: ScaleType, propName: string, channel: Channel) {
    return `${channel}-scale's "${propName}" is dropped as it does not work with ${scaleType} scale.`;
  }

  export function scaleTypeNotWorkWithMark(mark: Mark, scaleType: ScaleType) {
    return `Scale type "${scaleType}" does not work with mark ${mark}.`;
  }

  export const INVAID_DOMAIN = 'Invalid scale domain';

  export const UNABLE_TO_MERGE_DOMAINS = 'Unable to merge domains';

  // AXIS
  export const INVALID_CHANNEL_FOR_AXIS = 'Invalid channel for axis.';

  // STACK
  export function cannotStackRangedMark(channel: Channel) {
    return `Cannot stack ${channel} if there is already ${channel}2`;
  }

  export function cannotStackNonLinearScale(scaleType: ScaleType) {
    return `Cannot stack non-linear scale (${scaleType})`;
  }

  export function cannotStackNonSummativeAggregate(aggregate: AggregateOp) {
    return `Cannot stack when the aggregate function is non-summative (${aggregate})`;
  }

  // TIMEUNIT
  export function invalidTimeUnit(unitName: string, value: string | number) {
    return `Invalid ${unitName}: ${value}`;
  }

  export function dayReplacedWithDate(fullTimeUnit: TimeUnit) {
    return `Time unit "${fullTimeUnit}" is not supported. We are replacing it with ` +
      (fullTimeUnit+'').replace('day', 'date') + '.';
  }

  export function droppedDay(d: DateTime | DateTimeExpr) {
    return 'Dropping day from datetime ' + JSON.stringify(d) +
          ' as day cannot be combined with other units.';
  }
}

