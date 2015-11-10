/// <reference path="../typings/d3-time-format.d.ts"/>

import {utcFormat} from 'd3-time-format';

import Encoding from '../Encoding';
import * as util from '../util';
import {Enctype, Type} from '../consts';

// 'Wednesday September 17 04:00:00 2014'
// Wednesday is the longest date
// September is the longest month (8 in javascript as it is zero-indexed).
const LONG_DATE = new Date(Date.UTC(2014, 8, 17));

export function cardinality(encDef, stats, filterNull, type) {
  var timeUnit = encDef.timeUnit;
  switch (timeUnit) {
    case 'seconds': return 60;
    case 'minutes': return 60;
    case 'hours': return 24;
    case 'day': return 7;
    case 'date': return 31;
    case 'month': return 12;
    case 'year':
      var stat = stats[encDef.name],
        yearstat = stats['year_' + encDef.name];

      if (!yearstat) { return null; }

      return yearstat.distinct -
        (stat.missing > 0 && filterNull[type] ? 1 : 0);
  }

  return null;
};

export function formula(timeUnit, fieldRef) {
  // TODO(kanitw): add formula to other time format
  var fn = 'utc' + timeUnit;
  return fn + '(' + fieldRef + ')';
};

export function maxLength(timeUnit, encoding: Encoding) {
  switch (timeUnit) {
    case 'seconds':
    case 'minutes':
    case 'hours':
    case 'date':
      return 2;
    case 'month':
    case 'day':
      var rng = range(timeUnit, encoding);
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
  var timeFormat = encoding.config('timeFormat');
  return utcFormat(timeFormat)(LONG_DATE).length;
};

export function range(timeUnit, encoding: Encoding) {
  var labelLength = encoding.config('timeScaleLabelLength'),
    scaleLabel;
  switch (timeUnit) {
    case 'day':
      scaleLabel = encoding.config('dayScaleLabel');
      break;
    case 'month':
      scaleLabel = encoding.config('monthScaleLabel');
      break;
  }
  if (scaleLabel) {
    return labelLength ? scaleLabel.map(
        function(s) { return s.substr(0, labelLength);}
      ) : scaleLabel;
  }
  return;
};


/**
 * @param  {Object} encoding
 * @return {Array}  scales for time unit names
 */
export function scales(encoding: Encoding) {
  var scales = encoding.reduce(function(scales, encDef) {
    var timeUnit = encDef.timeUnit;
    if (encDef.type === Type.T && timeUnit && !scales[timeUnit]) {
      var scaleDef = scale.def(encDef.timeUnit, encoding);
      if (scaleDef) scales[timeUnit] = scaleDef;
    }
    return scales;
  }, {});

  return util.vals(scales);
};

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
};


export namespace scale {
  /** append custom time scales for axis label */
  export function def(timeUnit, encoding) {
    var rangeDef = range(timeUnit, encoding);

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

  export function type(timeUnit, name) {
    if (name === Enctype.COLOR) {
      return 'linear'; // time has order, so use interpolated ordinal color scale.
    }

    // FIXME revise this -- should 'year' be linear too?
    return isOrdinalFn(timeUnit) || name === Enctype.COL || name === Enctype.ROW ? 'ordinal' : 'linear';
  }

  export function domain(timeUnit, name?) {
    var isColor = name === Enctype.COLOR;
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
};

/** whether a particular time function has custom scale for labels implemented in time.scale */
export function hasScale(timeUnit) {
  switch (timeUnit) {
    case 'day':
    case 'month':
      return true;
  }
  return false;
};
