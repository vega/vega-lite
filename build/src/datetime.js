// DateTime definition object
import { isNumber } from 'vega-util';
import * as log from './log';
import { duplicate, keys } from './util';
/*
 * A designated year that starts on Sunday.
 */
const SUNDAY_YEAR = 2006;
export function isDateTime(o) {
    return (!!o &&
        (!!o.year ||
            !!o.quarter ||
            !!o.month ||
            !!o.date ||
            !!o.day ||
            !!o.hours ||
            !!o.minutes ||
            !!o.seconds ||
            !!o.milliseconds));
}
export const MONTHS = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december'
];
export const SHORT_MONTHS = MONTHS.map(m => m.substr(0, 3));
export const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
export const SHORT_DAYS = DAYS.map(d => d.substr(0, 3));
function normalizeQuarter(q) {
    if (isNumber(q)) {
        if (q > 4) {
            log.warn(log.message.invalidTimeUnit('quarter', q));
        }
        // We accept 1-based quarter, so need to readjust to 0-based quarter
        return (q - 1).toString();
    }
    else {
        // Invalid quarter
        throw new Error(log.message.invalidTimeUnit('quarter', q));
    }
}
function normalizeMonth(m) {
    if (isNumber(m)) {
        // We accept 1-based month, so need to readjust to 0-based month
        return (m - 1).toString();
    }
    else {
        const lowerM = m.toLowerCase();
        const monthIndex = MONTHS.indexOf(lowerM);
        if (monthIndex !== -1) {
            return monthIndex + ''; // 0 for january, ...
        }
        const shortM = lowerM.substr(0, 3);
        const shortMonthIndex = SHORT_MONTHS.indexOf(shortM);
        if (shortMonthIndex !== -1) {
            return shortMonthIndex + '';
        }
        // Invalid month
        throw new Error(log.message.invalidTimeUnit('month', m));
    }
}
function normalizeDay(d) {
    if (isNumber(d)) {
        // mod so that this can be both 0-based where 0 = sunday
        // and 1-based where 7=sunday
        return (d % 7) + '';
    }
    else {
        const lowerD = d.toLowerCase();
        const dayIndex = DAYS.indexOf(lowerD);
        if (dayIndex !== -1) {
            return dayIndex + ''; // 0 for january, ...
        }
        const shortD = lowerD.substr(0, 3);
        const shortDayIndex = SHORT_DAYS.indexOf(shortD);
        if (shortDayIndex !== -1) {
            return shortDayIndex + '';
        }
        // Invalid day
        throw new Error(log.message.invalidTimeUnit('day', d));
    }
}
/**
 * Return Vega Expression for a particular date time.
 * @param d
 * @param normalize whether to normalize quarter, month, day.
 */
export function dateTimeExpr(d, normalize = false) {
    const units = [];
    if (normalize && d.day !== undefined) {
        if (keys(d).length > 1) {
            log.warn(log.message.droppedDay(d));
            d = duplicate(d);
            delete d.day;
        }
    }
    if (d.year !== undefined) {
        units.push(d.year);
    }
    else if (d.day !== undefined) {
        // Set year to 2006 for working with day since January 1 2006 is a Sunday
        units.push(SUNDAY_YEAR);
    }
    else {
        units.push(0);
    }
    if (d.month !== undefined) {
        const month = normalize ? normalizeMonth(d.month) : d.month;
        units.push(month);
    }
    else if (d.quarter !== undefined) {
        const quarter = normalize ? normalizeQuarter(d.quarter) : d.quarter;
        units.push(quarter + '*3');
    }
    else {
        units.push(0); // months start at zero in JS
    }
    if (d.date !== undefined) {
        units.push(d.date);
    }
    else if (d.day !== undefined) {
        // HACK: Day only works as a standalone unit
        // This is only correct because we always set year to 2006 for day
        const day = normalize ? normalizeDay(d.day) : d.day;
        units.push(day + '+1');
    }
    else {
        units.push(1); // Date starts at 1 in JS
    }
    // Note: can't use TimeUnit enum here as importing it will create
    // circular dependency problem!
    for (const timeUnit of ['hours', 'minutes', 'seconds', 'milliseconds']) {
        if (d[timeUnit] !== undefined) {
            units.push(d[timeUnit]);
        }
        else {
            units.push(0);
        }
    }
    if (d.utc) {
        return `utc(${units.join(', ')})`;
    }
    else {
        return `datetime(${units.join(', ')})`;
    }
}
//# sourceMappingURL=datetime.js.map