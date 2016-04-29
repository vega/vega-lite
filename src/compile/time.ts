import {contains, range} from '../util';
import {COLUMN, ROW, SHAPE, COLOR, Channel} from '../channel';
import {TimeUnit, containsTimeUnit} from '../timeunit';

/** returns the smallest nice unit for scale.nice */
export function smallestUnit(timeUnit): string {
  if (!timeUnit) {
    return undefined;
  }

  if (containsTimeUnit(timeUnit, TimeUnit.SECONDS)) {
    return 'second';
  }

  if (containsTimeUnit(timeUnit, TimeUnit.MINUTES)) {
    return 'minute';
  }

  if (containsTimeUnit(timeUnit, TimeUnit.HOURS)) {
    return 'hour';
  }

  if (containsTimeUnit(timeUnit, TimeUnit.DAY) ||
      containsTimeUnit(timeUnit, TimeUnit.DATE)) {
    return 'day';
  }

  if (containsTimeUnit(timeUnit, TimeUnit.MONTH)) {
    return 'month';
  }

  if (containsTimeUnit(timeUnit, TimeUnit.YEAR)) {
    return 'year';
  }
  return undefined;
}

export function parseExpression(timeUnit: TimeUnit, fieldRef: string, onlyRef = false): string {
  let out = 'datetime(';

  function func(fun: string, addComma = true) {
    if (onlyRef) {
      return fieldRef + (addComma ? ', ' : '');
    } else {
      let res = '';
      if (fun === 'quarter') {
        // Divide by 3 to get the corresponding quarter number, multiply by 3
        // to scale to the first month of the corresponding quarter(0,3,6,9).
        res = 'floor(month(' + fieldRef + ')' + '/3)*3';
      } else {
        res = fun + '(' + fieldRef + ')' ;
      }
      return res + (addComma ? ', ' : '');
    }
  }

  if (containsTimeUnit(timeUnit, TimeUnit.YEAR)) {
    out += func('year');
  } else {
    out += '2006, '; // January 1 2006 is a Sunday
  }

  if (containsTimeUnit(timeUnit, TimeUnit.MONTH)) {
    out += func('month');
  } else if (containsTimeUnit(timeUnit, TimeUnit.QUARTER)) {
    out += func('quarter');
  } else {
    // month starts at 0 in javascript
    out += '0, ';
  }

  // need to add 1 because days start at 1
  if (containsTimeUnit(timeUnit, TimeUnit.DAY)) {
    out += func('day', false) + '+1, ';
  } else if (containsTimeUnit(timeUnit, TimeUnit.DATE)) {
    out += func('date');
  } else {
    out += '1, ';
  }

  if (containsTimeUnit(timeUnit, TimeUnit.HOURS)) {
    out += func('hours');
  } else {
    out += '0, ';
  }

  if (containsTimeUnit(timeUnit, TimeUnit.MINUTES)) {
    out += func('minutes');
  } else {
    out += '0, ';
  }

  if (containsTimeUnit(timeUnit, TimeUnit.SECONDS)) {
    out += func('seconds');
  } else {
    out += '0, ';
  }

  if (containsTimeUnit(timeUnit, TimeUnit.MILLISECONDS)) {
    out += func('milliseconds', false);
  } else {
    out += '0';
  }

  return out + ')';
}

/** Generate the complete raw domain. */
export function rawDomain(timeUnit: TimeUnit, channel: Channel) {
  if (contains([ROW, COLUMN, SHAPE, COLOR], channel)) {
    return null;
  }

  switch (timeUnit) {
    case TimeUnit.SECONDS:
      return range(0, 60);
    case TimeUnit.MINUTES:
      return range(0, 60);
    case TimeUnit.HOURS:
      return range(0, 24);
    case TimeUnit.DAY:
      return range(0, 7);
    case TimeUnit.DATE:
      return range(1, 32);
    case TimeUnit.MONTH:
      return range(0, 12);
    case TimeUnit.QUARTER:
      return [0,3,6,9];
  }

  return null;
}
