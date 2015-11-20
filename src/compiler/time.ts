/// <reference path="../../typings/d3-time-format.d.ts"/>

import {utcFormat} from 'd3-time-format';

import {Model} from './Model';
import * as vlFieldDef from '../fielddef';
import * as util from '../util';
import {COLOR, COL, ROW, Channel} from '../channel';
import {TEMPORAL} from '../type';

// 'Wednesday September 17 04:00:00 2014'
// Wednesday is the longest date
// September is the longest month (8 in javascript as it is zero-indexed).
const LONG_DATE = new Date(Date.UTC(2014, 8, 17));

export function cardinality(fieldDef, stats, filterNull, type) {
  var timeUnit = fieldDef.timeUnit;
  switch (timeUnit) {
    case 'seconds': return 60;
    case 'minutes': return 60;
    case 'hours': return 24;
    case 'day': return 7;
    case 'date': return 31;
    case 'month': return 12;
    case 'year':
      var stat = stats[fieldDef.name],
        yearstat = stats['year_' + fieldDef.name];

      if (!yearstat) { return null; }

      return yearstat.distinct -
        (stat.missing > 0 && filterNull[type] ? 1 : 0);
  }

  return null;
}

export function formula(timeUnit, fieldRef) {
  // TODO(kanitw): add formula to other time format
  var fn = 'utc' + timeUnit;
  return fn + '(' + fieldRef + ')';
}

export function maxLength(timeUnit, model: Model) {
  switch (timeUnit) {
    case 'seconds':
    case 'minutes':
    case 'hours':
    case 'date':
      return 2;
    case 'month':
    case 'day':
      var rng = range(timeUnit, model);
      if (rng) {
        // return the longest name in the range
        return Math.max.apply(null, rng.map(function(r) {return r.length;}));
      }
      return 2;
    case 'year':
      return 4; //'1998'
  }
  // TODO(#600) revise this
  // no time unit
  var timeFormat = model.config('timeFormat');
  return utcFormat(timeFormat)(LONG_DATE).length;
}

export function range(timeUnit, model: Model) {
  var labelLength = model.config('timeScaleLabelLength'),
    scaleLabel;
  switch (timeUnit) {
    case 'day':
      scaleLabel = model.config('dayScaleLabel');
      break;
    case 'month':
      scaleLabel = model.config('monthScaleLabel');
      break;
  }
  if (scaleLabel) {
    return labelLength ? scaleLabel.map(
        function(s) { return s.substr(0, labelLength);}
      ) : scaleLabel;
  }
  return;
}


/**
 * @param  {Model} model
 * @return {Array}  scales for time unit names
 */
export function scales(model: Model) {
  var scales = model.reduce(function(scales, fieldDef) {
    var timeUnit = fieldDef.timeUnit;
    if (fieldDef.type === TEMPORAL && timeUnit && !scales[timeUnit]) {
      var scaleDef = scale.def(fieldDef.timeUnit, model);
      if (scaleDef) scales[timeUnit] = scaleDef;
    }
    return scales;
  }, {});

  return util.vals(scales);
}

export function isOrdinalFn(timeUnit) {
  switch (timeUnit) {
    case 'seconds':
    case 'minutes':
    case 'hours':
    case 'day':
    case 'date':
    case 'month':
      return true;
  }
  return false;
}


export namespace scale {
  /** append custom time scales for axis label */
  export function def(timeUnit, model: Model) {
    var rangeDef = range(timeUnit, model);

    if (rangeDef) {
      return {
        name: 'time-'+timeUnit,
        type: 'ordinal',
        domain: scale.domain(timeUnit),
        range: rangeDef
      };
    }
    return null;
  }

  export function type(timeUnit, channel: Channel) {
    if (channel === COLOR) {
      return 'linear'; // time has order, so use interpolated ordinal color scale.
    }

    // FIXME revise this -- should 'year' be linear too?
    return isOrdinalFn(timeUnit) || channel === COL || channel === ROW ? 'ordinal' : 'linear';
  }

  export function domain(timeUnit, channel?: Channel) {
    var isColor = channel === COLOR;
    switch (timeUnit) {
      case 'seconds':
      case 'minutes': return isColor ? [0,59] : util.range(0, 60);
      case 'hours': return isColor ? [0,23] : util.range(0, 24);
      case 'day': return isColor ? [0,6] : util.range(0, 7);
      case 'date': return isColor ? [1,31] : util.range(1, 32);
      case 'month': return isColor ? [0,11] : util.range(0, 12);
    }
    return null;
  }
}

/** whether a particular time function has custom scale for labels implemented in time.scale */
export function hasScale(timeUnit) {
  switch (timeUnit) {
    case 'day':
    case 'month':
      return true;
  }
  return false;
}
