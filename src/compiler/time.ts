import {contains, range} from '../util';
import {COLUMN, ROW, SHAPE, COLOR, Channel} from '../channel';

/** returns the template name used for axis labels for a time unit */
export function format(timeUnit, abbreviated = false): string {
  if (!timeUnit) {
    return undefined;
  }

  let dateComponents = [];

  if (timeUnit.indexOf('year') > -1) {
    dateComponents.push(abbreviated ? '%y' : '%Y');
  }

  if (timeUnit.indexOf('month') > -1) {
    dateComponents.push(abbreviated ? '%b' : '%B');
  }

  if (timeUnit.indexOf('day') > -1) {
    dateComponents.push(abbreviated ? '%a' : '%A');
  } else if (timeUnit.indexOf('date') > -1) {
    dateComponents.push('%d');
  }

  let timeComponents = [];

  if (timeUnit.indexOf('hour') > -1) {
    timeComponents.push('%H');
  }
  if (timeUnit.indexOf('minute') > -1) {
    timeComponents.push('%M');
  }
  if (timeUnit.indexOf('second') > -1) {
    timeComponents.push('%S');
  }
  if (timeUnit.indexOf('milliseconds') > -1) {
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

export function parseExpression(timeUnit: string, fieldRef: string, onlyRef = false): string {
  let out = 'datetime(';

  function get(fun: string, addComma = true) {
    if (onlyRef) {
      return fieldRef + (addComma ? ', ' : '');
    } else {
      return fun + '(' + fieldRef + ')' + (addComma ? ', ' : '');
    }
  }

  if (timeUnit.indexOf('year') > -1) {
    out += get('year');
  } else {
    out += '2006, '; // January 1 2006 is a Sunday
  }

  if (timeUnit.indexOf('month') > -1) {
    out += get('month');
  } else {
    // month starts at 0 in javascript
    out += '0, ';
  }

  // need to add 1 because days start at 1
  if (timeUnit.indexOf('day') > -1) {
    out += get('day', false) + '+1, ';
  } else if (timeUnit.indexOf('date') > -1) {
    out += get('date');
  } else {
    out += '1, ';
  }

  if (timeUnit.indexOf('hours') > -1) {
    out += get('hours');
  } else {
    out += '0, ';
  }

  if (timeUnit.indexOf('minutes') > -1) {
    out += get('minutes');
  } else {
    out += '0, ';
  }

  if (timeUnit.indexOf('seconds') > -1) {
    out += get('seconds');
  } else {
    out += '0, ';
  }

  if (timeUnit.indexOf('milliseconds') > -1) {
    out += get('milliseconds', false);
  } else {
    out += '0';
  }

  return out + ')';
}

/** Generate the complete raw domain. */
export function rawDomain(timeUnit: string, channel: Channel) {
  if (contains([ROW, COLUMN, SHAPE, COLOR], channel)) {
    return null;
  }

  switch (timeUnit) {
    case 'seconds':
      return range(0, 60);
    case 'minutes':
      return range(0, 60);
    case 'hours':
      return range(0, 24);
    case 'day':
      return range(0, 7);
    case 'date':
      return range(1, 32);
    case 'month':
      return range(0, 12);
  }

  return null;
}
