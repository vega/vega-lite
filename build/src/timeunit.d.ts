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
    const MONTHDATEHOURS: 'monthdatehours';
    const HOURSMINUTES: 'hoursminutes';
    const HOURSMINUTESSECONDS: 'hoursminutesseconds';
    const MINUTESSECONDS: 'minutesseconds';
    const SECONDSMILLISECONDS: 'secondsmilliseconds';
    const QUARTER: 'quarter';
    const YEARQUARTER: 'yearquarter';
    const QUARTERMONTH: 'quartermonth';
    const YEARQUARTERMONTH: 'yearquartermonth';
    const UTCYEAR: 'utcyear';
    const UTCMONTH: 'utcmonth';
    const UTCDAY: 'utcday';
    const UTCDATE: 'utcdate';
    const UTCHOURS: 'utchours';
    const UTCMINUTES: 'utcminutes';
    const UTCSECONDS: 'utcseconds';
    const UTCMILLISECONDS: 'utcmilliseconds';
    const UTCYEARMONTH: 'utcyearmonth';
    const UTCYEARMONTHDATE: 'utcyearmonthdate';
    const UTCYEARMONTHDATEHOURS: 'utcyearmonthdatehours';
    const UTCYEARMONTHDATEHOURSMINUTES: 'utcyearmonthdatehoursminutes';
    const UTCYEARMONTHDATEHOURSMINUTESSECONDS: 'utcyearmonthdatehoursminutesseconds';
    const UTCMONTHDATE: 'utcmonthdate';
    const UTCMONTHDATEHOURS: 'utcmonthdatehours';
    const UTCHOURSMINUTES: 'utchoursminutes';
    const UTCHOURSMINUTESSECONDS: 'utchoursminutesseconds';
    const UTCMINUTESSECONDS: 'utcminutesseconds';
    const UTCSECONDSMILLISECONDS: 'utcsecondsmilliseconds';
    const UTCQUARTER: 'utcquarter';
    const UTCYEARQUARTER: 'utcyearquarter';
    const UTCQUARTERMONTH: 'utcquartermonth';
    const UTCYEARQUARTERMONTH: 'utcyearquartermonth';
}
export declare type LocalSingleTimeUnit = typeof TimeUnit.YEAR | typeof TimeUnit.QUARTER | typeof TimeUnit.MONTH | typeof TimeUnit.DAY | typeof TimeUnit.DATE | typeof TimeUnit.HOURS | typeof TimeUnit.MINUTES | typeof TimeUnit.SECONDS | typeof TimeUnit.MILLISECONDS;
export declare const TIMEUNIT_PARTS: LocalSingleTimeUnit[];
export declare function isLocalSingleTimeUnit(timeUnit: string): timeUnit is LocalSingleTimeUnit;
export declare type UtcSingleTimeUnit = typeof TimeUnit.UTCYEAR | typeof TimeUnit.UTCQUARTER | typeof TimeUnit.UTCMONTH | typeof TimeUnit.UTCDAY | typeof TimeUnit.UTCDATE | typeof TimeUnit.UTCHOURS | typeof TimeUnit.UTCMINUTES | typeof TimeUnit.UTCSECONDS | typeof TimeUnit.UTCMILLISECONDS;
export declare function isUtcSingleTimeUnit(timeUnit: string): timeUnit is UtcSingleTimeUnit;
export declare type SingleTimeUnit = LocalSingleTimeUnit | UtcSingleTimeUnit;
export declare type LocalMultiTimeUnit = typeof TimeUnit.YEARQUARTER | typeof TimeUnit.YEARQUARTERMONTH | typeof TimeUnit.YEARMONTH | typeof TimeUnit.YEARMONTHDATE | typeof TimeUnit.YEARMONTHDATEHOURS | typeof TimeUnit.YEARMONTHDATEHOURSMINUTES | typeof TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS | typeof TimeUnit.QUARTERMONTH | typeof TimeUnit.MONTHDATE | typeof TimeUnit.MONTHDATEHOURS | typeof TimeUnit.HOURSMINUTES | typeof TimeUnit.HOURSMINUTESSECONDS | typeof TimeUnit.MINUTESSECONDS | typeof TimeUnit.SECONDSMILLISECONDS;
export declare type UtcMultiTimeUnit = typeof TimeUnit.UTCYEARQUARTER | typeof TimeUnit.UTCYEARQUARTERMONTH | typeof TimeUnit.UTCYEARMONTH | typeof TimeUnit.UTCYEARMONTHDATE | typeof TimeUnit.UTCYEARMONTHDATEHOURS | typeof TimeUnit.UTCYEARMONTHDATEHOURSMINUTES | typeof TimeUnit.UTCYEARMONTHDATEHOURSMINUTESSECONDS | typeof TimeUnit.UTCQUARTERMONTH | typeof TimeUnit.UTCMONTHDATE | typeof TimeUnit.UTCMONTHDATEHOURS | typeof TimeUnit.UTCHOURSMINUTES | typeof TimeUnit.UTCHOURSMINUTESSECONDS | typeof TimeUnit.UTCMINUTESSECONDS | typeof TimeUnit.UTCSECONDSMILLISECONDS;
export declare type MultiTimeUnit = LocalMultiTimeUnit | UtcMultiTimeUnit;
export declare type LocalTimeUnit = LocalSingleTimeUnit | LocalMultiTimeUnit;
export declare type UtcTimeUnit = UtcSingleTimeUnit | UtcMultiTimeUnit;
export declare function isUTCTimeUnit(t: string): t is UtcTimeUnit;
export declare function getLocalTimeUnit(t: UtcTimeUnit): LocalTimeUnit;
export declare type TimeUnit = SingleTimeUnit | MultiTimeUnit;
export declare const TIMEUNITS: TimeUnit[];
export declare function isTimeUnit(t: string): t is TimeUnit;
/**
 * Converts a date to only have the measurements relevant to the specified unit
 * i.e. ('yearmonth', '2000-12-04 07:58:14') -> '2000-12-01 00:00:00'
 * Note: the base date is Jan 01 1900 00:00:00
 */
export declare function convert(unit: TimeUnit, date: Date): Date;
export declare function getTimeUnitParts(timeUnit: TimeUnit): any[];
/** Returns true if fullTimeUnit contains the timeUnit, false otherwise. */
export declare function containsTimeUnit(fullTimeUnit: TimeUnit, timeUnit: TimeUnit): boolean;
/**
 * Returns Vega expresssion for a given timeUnit and fieldRef
 */
export declare function fieldExpr(fullTimeUnit: TimeUnit, field: string): string;
export declare function getDateTimeComponents(timeUnit: TimeUnit, shortTimeLabels: boolean): string[];
/**
 * returns the signal expression used for axis labels for a time unit
 */
export declare function formatExpression(timeUnit: TimeUnit, field: string, shortTimeLabels: boolean, isUTCScale: boolean): string;
export declare function normalizeTimeUnit(timeUnit: TimeUnit): TimeUnit;
