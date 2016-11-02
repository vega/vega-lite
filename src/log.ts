///<reference path="../typings/vega-util.d.ts" />

/**
 * Vega-Lite's singleton logger utility.
 */

import {logger, LoggerInterface, Warn} from 'vega-util';

import {AggregateOp} from './aggregate';
import {X, Channel} from './channel';
import {DateTime, DateTimeExpr} from './datetime';
import {FieldDef} from './fielddef';
import {Mark} from './mark';
import {TimeUnit} from './timeunit';
import {ScaleType} from './scale';

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

export function warn(...args: any[]) {
  current.warn.apply(current, arguments);
}

export function info(...args: any[]) {
  current.info.apply(current, arguments);
}

export function debug(...args: any[]) {
  current.debug.apply(current, arguments);
}

/**
 * Collection of all Vega-Lite Error Messages
 */
export namespace message {
  export const INVALID_SPEC = 'Invalid spec';

  // DATA
  export const DEPRECATED_FILTER_NULL = 'filterNull is deprecated. Please use filterInvalid instead.';

  // ENCODING & FACET
  export function emptyFieldDef(fieldDef: FieldDef, channel: Channel) {
    return `Dropping ${JSON.stringify(fieldDef)} from channel ${channel} since it does not contain data field or value.`;
  }

  export function incompatibleChannel(channel: Channel, markOrFacet: Mark | 'facet') {
    return `${channel} dropped as it is incompatible with ${markOrFacet}`;
  }

  export function facetChannelShouldBeDiscrete(channel: string) {
    return `${channel} encoding should be discrete (ordinal / nominal / binned).`;
  }

  // Mark
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

  export function bandSizeOverridden(channel: Channel) {
    return `bandSize for ${channel} overridden as top-level ${
      channel === X ? 'width' : 'height'} is provided.`;
  }

  export function scaleTypeNotWorkWithChannel(channel: Channel, scaleType: ScaleType) {
    return `Channel ${channel} does not work with scale type = ${scaleType}`;
  }

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

