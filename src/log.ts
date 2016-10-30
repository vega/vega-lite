/**
 * Vega-Lite's singleton logger utility.
 */

// import Logger from 'vega-util/src/logger';
// import {LoggerInterface, Warn} from 'vega-util/src/logger';

// ========== TEMPORARY SOLUTION FOR FAILED IMPORT (copied from vega-util/log) =========
/* tslint:disable */
export interface LoggerInterface {
  level: (_: number) => number | LoggerInterface;
  warn(...args): LoggerInterface;
  info(...args): LoggerInterface;
  debug(...args): LoggerInterface;
}

function log(method, level, input) {
  var args = [level].concat([].slice.call(input));
  console[method].apply(console, args); // eslint-disable-line no-console
}

export var None  = 0;
export var Warn  = 1;
export var Info  = 2;
export var Debug = 3;


export function Logger(_): LoggerInterface {
  var level = _ || None;
  return {
    level: function(_) {
      return arguments.length ? (level = +_, this) : level;
    },
    warn: function() {
      if (level >= Warn) log('warn', 'WARN', arguments);
      return this;
    },
    info: function() {
      if (level >= Info) log('log', 'INFO', arguments);
      return this;
    },
    debug: function() {
      if (level >= Debug) log('log', 'DEBUG', arguments);
      return this;
    }
  }
}
/* tslint:enable */
// ========== END OF TEMPORARY SOLUTION FOR FAILED IMPORT =========

import {AggregateOp} from './aggregate';
import {X, Channel} from './channel';
import {DateTime, DateTimeExpr} from './datetime';
import {FieldDef} from './fielddef';
import {Mark} from './mark';
import {TimeUnit} from './timeunit';
import {ScaleType} from './scale';

/**
 * Main (default) Vega Logger instance for Vega-Lite
 */
const main = Logger(Warn);
let current: LoggerInterface = main;

/**
 * Set the singleton logger to be a custom logger
 */
export function set(logger: LoggerInterface) {
  current = logger;
}

/**
 * Reset the main logger to use the default Vega Logger
 */
export function reset() {
  current = main;
}

export function warn(...args) {
  current.warn.apply(current, arguments);
}

export function info(...args) {
  current.info.apply(current, arguments);
}

export function debug(...args) {
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

  export function facetChannelShouldBeDiscrete(channel) {
    return `${channel} encoding should be discrete (ordinal / nominal / binned).`;
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
  export function invalidTimeUnit(unitName: string, value) {
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

