import {contains, range} from '../util';
import {COLUMN, ROW, SHAPE, COLOR, Channel} from '../channel';
import {TimeUnit} from '../timeunit';

/** returns the template name used for axis labels for a time unit */
export function format(timeUnit: TimeUnit, abbreviated = false): string {
  if (!timeUnit) {
    return undefined;
  }

  let timeString = timeUnit.toString();

  let dateComponents = [];

  if (timeString.indexOf('year') > -1) {
    dateComponents.push(abbreviated ? '%y' : '%Y');
  }

  if (timeString.indexOf('month') > -1) {
    dateComponents.push(abbreviated ? '%b' : '%B');
  }

  if (timeString.indexOf('day') > -1) {
    dateComponents.push(abbreviated ? '%a' : '%A');
  } else if (timeString.indexOf('date') > -1) {
    dateComponents.push('%d');
  }

  let timeComponents = [];

  if (timeString.indexOf('hours') > -1) {
    timeComponents.push('%H');
  }
  if (timeString.indexOf('minutes') > -1) {
    timeComponents.push('%M');
  }
  if (timeString.indexOf('seconds') > -1) {
    timeComponents.push('%S');
  }
  if (timeString.indexOf('milliseconds') > -1) {
    timeComponents.push('%L');
  }

  let out = [];
  if (dateComponents.length > 0) {
    out.push(dateComponents.join('-'));
  }
  if (timeComponents.length > 0) {
    out.push(timeComponents.join(':'));
  }

  return out.length > 0 ? out.join(' ') : undefined;
}

/** returns the smallest nice unit for scale.nice */
export function smallestUnit(timeUnit): string {
  if (!timeUnit) {
    return undefined;
  }

  if (timeUnit.indexOf('second') > -1) {
    return 'second';
  }

  if (timeUnit.indexOf('minute') > -1) {
    return 'minute';
  }

  if (timeUnit.indexOf('hour') > -1) {
    return 'hour';
  }

  if (timeUnit.indexOf('day') > -1 || timeUnit.indexOf('date') > -1) {
    return 'day';
  }

  if (timeUnit.indexOf('month') > -1) {
    return 'month';
  }

  if (timeUnit.indexOf('year') > -1) {
    return 'year';
  }
  return undefined;
}

export function parseExpression(timeUnit: TimeUnit, fieldRef: string, onlyRef = false): string {
  let out = 'datetime(';
  let timeString = timeUnit.toString();

  function get(fun: string, addComma = true) {
    if (onlyRef) {
      return fieldRef + (addComma ? ', ' : '');
    } else {
      return fun + '(' + fieldRef + ')' + (addComma ? ', ' : '');
    }
  }

  if (timeString.indexOf('year') > -1) {
    out += get('year');
  } else {
    out += '2006, '; // January 1 2006 is a Sunday
  }

  if (timeString.indexOf('month') > -1) {
    out += get('month');
  } else {
    // month starts at 0 in javascript
    out += '0, ';
  }

  // need to add 1 because days start at 1
  if (timeString.indexOf('day') > -1) {
    out += get('day', false) + '+1, ';
  } else if (timeString.indexOf('date') > -1) {
    out += get('date');
  } else {
    out += '1, ';
  }

  if (timeString.indexOf('hours') > -1) {
    out += get('hours');
  } else {
    out += '0, ';
  }

  if (timeString.indexOf('minutes') > -1) {
    out += get('minutes');
  } else {
    out += '0, ';
  }

  if (timeString.indexOf('seconds') > -1) {
    out += get('seconds');
  } else {
    out += '0, ';
  }

  if (timeString.indexOf('milliseconds') > -1) {
    out += get('milliseconds', false);
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
  }

  return null;
}
