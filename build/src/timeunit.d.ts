import { DateTime } from './datetime';
/** Time Unit that only corresponds to only one part of Date objects. */
export declare const LOCAL_SINGLE_TIMEUNIT_INDEX: {
    readonly year: 1;
    readonly quarter: 1;
    readonly month: 1;
    readonly week: 1;
    readonly day: 1;
    readonly dayofyear: 1;
    readonly date: 1;
    readonly hours: 1;
    readonly minutes: 1;
    readonly seconds: 1;
    readonly milliseconds: 1;
};
export type LocalSingleTimeUnit = keyof typeof LOCAL_SINGLE_TIMEUNIT_INDEX;
export declare const TIMEUNIT_PARTS: ("day" | "month" | "year" | "quarter" | "week" | "hours" | "minutes" | "seconds" | "date" | "dayofyear" | "milliseconds")[];
export declare function isLocalSingleTimeUnit(timeUnit: string): timeUnit is LocalSingleTimeUnit;
export declare const UTC_SINGLE_TIMEUNIT_INDEX: {
    readonly utcyear: 1;
    readonly utcquarter: 1;
    readonly utcmonth: 1;
    readonly utcweek: 1;
    readonly utcday: 1;
    readonly utcdayofyear: 1;
    readonly utcdate: 1;
    readonly utchours: 1;
    readonly utcminutes: 1;
    readonly utcseconds: 1;
    readonly utcmilliseconds: 1;
};
export type UtcSingleTimeUnit = keyof typeof UTC_SINGLE_TIMEUNIT_INDEX;
export type SingleTimeUnit = LocalSingleTimeUnit | UtcSingleTimeUnit;
export declare const LOCAL_MULTI_TIMEUNIT_INDEX: {
    readonly yearquarter: 1;
    readonly yearquartermonth: 1;
    readonly yearmonth: 1;
    readonly yearmonthdate: 1;
    readonly yearmonthdatehours: 1;
    readonly yearmonthdatehoursminutes: 1;
    readonly yearmonthdatehoursminutesseconds: 1;
    readonly yearweek: 1;
    readonly yearweekday: 1;
    readonly yearweekdayhours: 1;
    readonly yearweekdayhoursminutes: 1;
    readonly yearweekdayhoursminutesseconds: 1;
    readonly yeardayofyear: 1;
    readonly quartermonth: 1;
    readonly monthdate: 1;
    readonly monthdatehours: 1;
    readonly monthdatehoursminutes: 1;
    readonly monthdatehoursminutesseconds: 1;
    readonly weekday: 1;
    readonly weeksdayhours: 1;
    readonly weekdayhoursminutes: 1;
    readonly weekdayhoursminutesseconds: 1;
    readonly dayhours: 1;
    readonly dayhoursminutes: 1;
    readonly dayhoursminutesseconds: 1;
    readonly hoursminutes: 1;
    readonly hoursminutesseconds: 1;
    readonly minutesseconds: 1;
    readonly secondsmilliseconds: 1;
};
export type LocalMultiTimeUnit = keyof typeof LOCAL_MULTI_TIMEUNIT_INDEX;
declare const BINNED_LOCAL_TIMEUNIT_INDEX: {
    readonly binnedyear: 1;
    readonly binnedyearquarter: 1;
    readonly binnedyearquartermonth: 1;
    readonly binnedyearmonth: 1;
    readonly binnedyearmonthdate: 1;
    readonly binnedyearmonthdatehours: 1;
    readonly binnedyearmonthdatehoursminutes: 1;
    readonly binnedyearmonthdatehoursminutesseconds: 1;
    readonly binnedyearweek: 1;
    readonly binnedyearweekday: 1;
    readonly binnedyearweekdayhours: 1;
    readonly binnedyearweekdayhoursminutes: 1;
    readonly binnedyearweekdayhoursminutesseconds: 1;
    readonly binnedyeardayofyear: 1;
};
type BinnedLocalTimeUnit = keyof typeof BINNED_LOCAL_TIMEUNIT_INDEX;
declare const BINNED_UTC_TIMEUNIT_INDEX: {
    binnedutcyear: number;
    binnedutcyearquarter: number;
    binnedutcyearquartermonth: number;
    binnedutcyearmonth: number;
    binnedutcyearmonthdate: number;
    binnedutcyearmonthdatehours: number;
    binnedutcyearmonthdatehoursminutes: number;
    binnedutcyearmonthdatehoursminutesseconds: number;
    binnedutcyearweek: number;
    binnedutcyearweekday: number;
    binnedutcyearweekdayhours: number;
    binnedutcyearweekdayhoursminutes: number;
    binnedutcyearweekdayhoursminutesseconds: number;
    binnedutcyeardayofyear: number;
};
export declare const BINNED_TIMEUNIT_INDEX: {
    binnedutcyear: number;
    binnedutcyearquarter: number;
    binnedutcyearquartermonth: number;
    binnedutcyearmonth: number;
    binnedutcyearmonthdate: number;
    binnedutcyearmonthdatehours: number;
    binnedutcyearmonthdatehoursminutes: number;
    binnedutcyearmonthdatehoursminutesseconds: number;
    binnedutcyearweek: number;
    binnedutcyearweekday: number;
    binnedutcyearweekdayhours: number;
    binnedutcyearweekdayhoursminutes: number;
    binnedutcyearweekdayhoursminutesseconds: number;
    binnedutcyeardayofyear: number;
    binnedyear: 1;
    binnedyearquarter: 1;
    binnedyearquartermonth: 1;
    binnedyearmonth: 1;
    binnedyearmonthdate: 1;
    binnedyearmonthdatehours: 1;
    binnedyearmonthdatehoursminutes: 1;
    binnedyearmonthdatehoursminutesseconds: 1;
    binnedyearweek: 1;
    binnedyearweekday: 1;
    binnedyearweekdayhours: 1;
    binnedyearweekdayhoursminutes: 1;
    binnedyearweekdayhoursminutesseconds: 1;
    binnedyeardayofyear: 1;
};
type BinnedUtcTimeUnit = keyof typeof BINNED_UTC_TIMEUNIT_INDEX;
export type BinnedTimeUnit = BinnedLocalTimeUnit | BinnedUtcTimeUnit;
export declare function isBinnedTimeUnit(timeUnit: TimeUnit | BinnedTimeUnit | TimeUnitParams | undefined): timeUnit is BinnedTimeUnit | TimeUnitParams;
export declare function isBinnedTimeUnitString(timeUnit: TimeUnit | BinnedTimeUnit | undefined): timeUnit is BinnedTimeUnit;
export declare const UTC_MULTI_TIMEUNIT_INDEX: {
    readonly utcyearquarter: 1;
    readonly utcyearquartermonth: 1;
    readonly utcyearmonth: 1;
    readonly utcyearmonthdate: 1;
    readonly utcyearmonthdatehours: 1;
    readonly utcyearmonthdatehoursminutes: 1;
    readonly utcyearmonthdatehoursminutesseconds: 1;
    readonly utcyearweek: 1;
    readonly utcyearweekday: 1;
    readonly utcyearweekdayhours: 1;
    readonly utcyearweekdayhoursminutes: 1;
    readonly utcyearweekdayhoursminutesseconds: 1;
    readonly utcyeardayofyear: 1;
    readonly utcquartermonth: 1;
    readonly utcmonthdate: 1;
    readonly utcmonthdatehours: 1;
    readonly utcmonthdatehoursminutes: 1;
    readonly utcmonthdatehoursminutesseconds: 1;
    readonly utcweekday: 1;
    readonly utcweeksdayhours: 1;
    readonly utcweekdayhoursminutes: 1;
    readonly utcweekdayhoursminutesseconds: 1;
    readonly utcdayhours: 1;
    readonly utcdayhoursminutes: 1;
    readonly utcdayhoursminutesseconds: 1;
    readonly utchoursminutes: 1;
    readonly utchoursminutesseconds: 1;
    readonly utcminutesseconds: 1;
    readonly utcsecondsmilliseconds: 1;
};
export type UtcMultiTimeUnit = keyof typeof UTC_MULTI_TIMEUNIT_INDEX;
export type MultiTimeUnit = LocalMultiTimeUnit | UtcMultiTimeUnit;
export type LocalTimeUnit = LocalSingleTimeUnit | LocalMultiTimeUnit;
export type UtcTimeUnit = UtcSingleTimeUnit | UtcMultiTimeUnit;
export declare function isUTCTimeUnit(t: string): t is UtcTimeUnit;
export declare function getLocalTimeUnitFromUTCTimeUnit(t: UtcTimeUnit): LocalTimeUnit;
export type TimeUnit = SingleTimeUnit | MultiTimeUnit;
export type TimeUnitFormat = 'year' | 'year-month' | 'year-month-date' | 'quarter' | 'month' | 'date' | 'week' | 'day' | 'hours' | 'hours-minutes' | 'minutes' | 'seconds' | 'milliseconds';
export interface TimeUnitTransformParams {
    /**
     * Defines how date-time values should be binned.
     */
    unit?: TimeUnit;
    /**
     * If no `unit` is specified, maxbins is used to infer time units.
     */
    maxbins?: number;
    /**
     * The number of steps between bins, in terms of the least
     * significant unit provided.
     */
    step?: number;
    /**
     * True to use UTC timezone. Equivalent to using a `utc` prefixed `TimeUnit`.
     */
    utc?: boolean;
}
/**
 * Time Unit Params for encoding predicate, which can specified if the data is  already "binned".
 */
export interface TimeUnitParams extends TimeUnitTransformParams {
    /**
     * Whether the data has already been binned to this time unit.
     * If true, Vega-Lite will only format the data, marks, and guides,
     * without applying the timeUnit transform to re-bin the data again.
     */
    binned?: boolean;
}
export type TimeFormatConfig = Partial<Record<TimeUnitFormat, string>>;
export declare const VEGALITE_TIMEFORMAT: TimeFormatConfig;
export declare function getTimeUnitParts(timeUnit: TimeUnit): LocalSingleTimeUnit[];
export declare function getSmallestTimeUnitPart(timeUnit: TimeUnit): LocalSingleTimeUnit;
/** Returns true if fullTimeUnit contains the timeUnit, false otherwise. */
export declare function containsTimeUnit(fullTimeUnit: TimeUnit, timeUnit: TimeUnit): boolean;
/**
 * Returns Vega expression for a given timeUnit and fieldRef
 */
export declare function fieldExpr(fullTimeUnit: TimeUnit, field: string, { end }?: {
    end: boolean;
}): string;
export declare function timeUnitSpecifierExpression(timeUnit: TimeUnit): string;
/**
 * Returns the signal expression used for axis labels for a time unit.
 */
export declare function formatExpression(timeUnit: TimeUnit, field: string, isUTCScale: boolean): string;
export declare function normalizeTimeUnit(timeUnit: TimeUnit | BinnedTimeUnit | TimeUnitParams): TimeUnitParams;
export declare function timeUnitToString(tu: TimeUnit | TimeUnitTransformParams): string;
export declare function durationExpr(timeUnit: TimeUnit | BinnedTimeUnit | TimeUnitTransformParams, wrap?: (x: string) => string): string;
declare const DATE_PARTS: {
    readonly year: 1;
    readonly month: 1;
    readonly date: 1;
    readonly hours: 1;
    readonly minutes: 1;
    readonly seconds: 1;
    readonly milliseconds: 1;
};
type DatePart = keyof typeof DATE_PARTS;
export declare function isDatePart(timeUnit: LocalSingleTimeUnit): timeUnit is DatePart;
export declare function getDateTimePartAndStep(timeUnit: LocalSingleTimeUnit, step?: number): {
    part: keyof DateTime;
    step: number;
};
export {};
//# sourceMappingURL=timeunit.d.ts.map