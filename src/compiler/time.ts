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
