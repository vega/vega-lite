import * as util from '../util';
import {COLOR, COLUMN, ROW, Channel} from '../channel';

export namespace scale {
  // FIXME move this to scale.type
  export function type(timeUnit, channel: Channel) {
    if (channel === COLOR) {
      // FIXME if user specify scale.range as ordinal presets, then this should be ordinal
      return 'linear'; // time has order, so use interpolated ordinal color scale.
    }
    if (channel === COLUMN || channel === ROW) {
      return 'ordinal';
    }

    switch (timeUnit) {
      case 'hours':
      case 'day':
      case 'date':
      case 'month':
        return 'ordinal';
      case 'year':
      case 'second':
      case 'minute':
        return 'linear';
    }
    return 'time';
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

/** returns the template name used for axis labels for a time unit */
export function labelTemplate(timeUnit, abbreviated=false): string {
  var postfix = abbreviated ? '-abbrev' : '';
  switch (timeUnit) {
    case 'day':
      return 'day' + postfix;
    case 'month':
      return 'month' + postfix;
  }
  return null;
}
