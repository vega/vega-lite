/**
 * @minimum 1
 * @maximum 12
 * @TJS-type integer
 */
export declare type Month = number;
/**
 * @minimum 1
 * @maximum 7
 */
export declare type Day = number;
/**
 * Object for defining datetime in Vega-Lite Filter.
 * If both month and quarter are provided, month has higher precedence.
 * `day` cannot be combined with other date.
 * We accept string for month and day names.
 */
export interface DateTime {
    /**
     * Integer value representing the year.
     * @TJS-type integer
     */
    year?: number;
    /**
     * Integer value representing the quarter of the year (from 1-4).
     * @minimum 1
     * @maximum 4
     * @TJS-type integer
     */
    quarter?: number;
    /** One of: (1) integer value representing the month from `1`-`12`. `1` represents January;  (2) case-insensitive month name (e.g., `"January"`);  (3) case-insensitive, 3-character short month name (e.g., `"Jan"`). */
    month?: Month | string;
    /**
     * Integer value representing the date from 1-31.
     * @minimum 1
     * @maximum 31
     * @TJS-type integer
     */
    date?: number;
    /**
     * Value representing the day of a week.  This can be one of: (1) integer value -- `1` represents Monday; (2) case-insensitive day name (e.g., `"Monday"`);  (3) case-insensitive, 3-character short day name (e.g., `"Mon"`).   <br/> **Warning:** A DateTime definition object with `day`** should not be combined with `year`, `quarter`, `month`, or `date`.
     */
    day?: Day | string;
    /**
     * Integer value representing the hour of a day from 0-23.
     * @minimum 0
     * @maximum 23
     * @TJS-type integer
     */
    hours?: number;
    /**
     * Integer value representing the minute segment of time from 0-59.
     * @minimum 0
     * @maximum 59
     * @TJS-type integer
     */
    minutes?: number;
    /**
     * Integer value representing the second segment (0-59) of a time value
     * @minimum 0
     * @maximum 59
     * @TJS-type integer
     */
    seconds?: number;
    /**
     * Integer value representing the millisecond segment of time.
     * @minimum 0
     * @maximum 999
     * @TJS-type integer
     */
    milliseconds?: number;
    /**
     * A boolean flag indicating if date time is in utc time. If false, the date time is in local time
     */
    utc?: boolean;
}
/**
 * Internal Object for defining datetime expressions.
 * This is an expression version of DateTime.
 * If both month and quarter are provided, month has higher precedence.
 * `day` cannot be combined with other date.
 */
export interface DateTimeExpr {
    year?: string;
    quarter?: string;
    month?: string;
    date?: string;
    day?: string;
    hours?: string;
    minutes?: string;
    seconds?: string;
    milliseconds?: string;
    utc?: boolean;
}
export declare function isDateTime(o: any): o is DateTime;
export declare const MONTHS: string[];
export declare const SHORT_MONTHS: string[];
export declare const DAYS: string[];
export declare const SHORT_DAYS: string[];
/**
 * Return Vega Expression for a particular date time.
 * @param d
 * @param normalize whether to normalize quarter, month, day.
 */
export declare function dateTimeExpr(d: DateTime | DateTimeExpr, normalize?: boolean): string;
