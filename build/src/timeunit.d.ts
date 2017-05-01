export declare namespace TimeUnit {
    const YEAR: 'year';
    const MONTH: 'month';
    const DAY: 'day';
    const DATE: 'date';
    const HOURS: 'hours';
    const MINUTES: 'minutes';
    const SECONDS: 'seconds';
    const MILLISECONDS: 'milliseconds';
    const YEARMONTH: 'yearmonth';
    const YEARMONTHDATE: 'yearmonthdate';
    const YEARMONTHDATEHOURS: 'yearmonthdatehours';
    const YEARMONTHDATEHOURSMINUTES: 'yearmonthdatehoursminutes';
    const YEARMONTHDATEHOURSMINUTESSECONDS: 'yearmonthdatehoursminutesseconds';
    const MONTHDATE: 'monthdate';
    const HOURSMINUTES: 'hoursminutes';
    const HOURSMINUTESSECONDS: 'hoursminutesseconds';
    const MINUTESSECONDS: 'minutesseconds';
    const SECONDSMILLISECONDS: 'secondsmilliseconds';
    const QUARTER: 'quarter';
    const YEARQUARTER: 'yearquarter';
    const QUARTERMONTH: 'quartermonth';
    const YEARQUARTERMONTH: 'yearquartermonth';
}
export declare type TimeUnit = typeof TimeUnit.YEAR | typeof TimeUnit.MONTH | typeof TimeUnit.DAY | typeof TimeUnit.DATE | typeof TimeUnit.HOURS | typeof TimeUnit.MINUTES | typeof TimeUnit.SECONDS | typeof TimeUnit.MILLISECONDS | typeof TimeUnit.YEARMONTH | typeof TimeUnit.YEARMONTHDATE | typeof TimeUnit.YEARMONTHDATEHOURS | typeof TimeUnit.YEARMONTHDATEHOURSMINUTES | typeof TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS | typeof TimeUnit.MONTHDATE | typeof TimeUnit.HOURSMINUTES | typeof TimeUnit.HOURSMINUTESSECONDS | typeof TimeUnit.MINUTESSECONDS | typeof TimeUnit.SECONDSMILLISECONDS | typeof TimeUnit.QUARTER | typeof TimeUnit.YEARQUARTER | typeof TimeUnit.QUARTERMONTH | typeof TimeUnit.YEARQUARTERMONTH;
/** Time Unit that only corresponds to only one part of Date objects. */
export declare const SINGLE_TIMEUNITS: ("year" | "month" | "day" | "date" | "hours" | "minutes" | "seconds" | "milliseconds" | "quarter")[];
export declare function isSingleTimeUnit(timeUnit: TimeUnit): boolean;
/**
 * Converts a date to only have the measurements relevant to the specified unit
 * i.e. ('yearmonth', '2000-12-04 07:58:14') -> '2000-12-01 00:00:00'
 * Note: the base date is Jan 01 1900 00:00:00
 */
export declare function convert(unit: TimeUnit, date: Date): Date;
export declare const MULTI_TIMEUNITS: ("yearmonth" | "yearmonthdate" | "yearmonthdatehours" | "yearmonthdatehoursminutes" | "yearmonthdatehoursminutesseconds" | "hoursminutes" | "hoursminutesseconds" | "minutesseconds" | "secondsmilliseconds" | "yearquarter" | "quartermonth" | "yearquartermonth")[];
export declare function isMultiTimeUnit(timeUnit: TimeUnit): boolean;
export declare const TIMEUNITS: ("year" | "month" | "day" | "date" | "hours" | "minutes" | "seconds" | "milliseconds" | "yearmonth" | "yearmonthdate" | "yearmonthdatehours" | "yearmonthdatehoursminutes" | "yearmonthdatehoursminutesseconds" | "hoursminutes" | "hoursminutesseconds" | "minutesseconds" | "secondsmilliseconds" | "quarter" | "yearquarter" | "quartermonth" | "yearquartermonth")[];
/** Returns true if fullTimeUnit contains the timeUnit, false otherwise. */
export declare function containsTimeUnit(fullTimeUnit: TimeUnit, timeUnit: TimeUnit): boolean;
/**
 * Returns Vega expresssion for a given timeUnit and fieldRef
 */
export declare function fieldExpr(fullTimeUnit: TimeUnit, field: string): string;
/** returns the smallest nice unit for scale.nice */
export declare function smallestUnit(timeUnit: TimeUnit): string;
/** returns the signal expression used for axis labels for a time unit */
export declare function formatExpression(timeUnit: TimeUnit, field: string, shortTimeLabels: boolean): string;
export declare function isDiscreteByDefault(timeUnit: TimeUnit): boolean;
