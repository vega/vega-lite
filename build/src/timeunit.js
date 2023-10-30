import { isObject, isString } from 'vega-util';
import { dateTimeExprToExpr, dateTimeToExpr } from './datetime';
import { accessPathWithDatum, keys, stringify, varName } from './util';
/** Time Unit that only corresponds to only one part of Date objects. */
export const LOCAL_SINGLE_TIMEUNIT_INDEX = {
    year: 1,
    quarter: 1,
    month: 1,
    week: 1,
    day: 1,
    dayofyear: 1,
    date: 1,
    hours: 1,
    minutes: 1,
    seconds: 1,
    milliseconds: 1
};
export const TIMEUNIT_PARTS = keys(LOCAL_SINGLE_TIMEUNIT_INDEX);
export function isLocalSingleTimeUnit(timeUnit) {
    return !!LOCAL_SINGLE_TIMEUNIT_INDEX[timeUnit];
}
export const UTC_SINGLE_TIMEUNIT_INDEX = {
    utcyear: 1,
    utcquarter: 1,
    utcmonth: 1,
    utcweek: 1,
    utcday: 1,
    utcdayofyear: 1,
    utcdate: 1,
    utchours: 1,
    utcminutes: 1,
    utcseconds: 1,
    utcmilliseconds: 1
};
export const LOCAL_MULTI_TIMEUNIT_INDEX = {
    yearquarter: 1,
    yearquartermonth: 1,
    yearmonth: 1,
    yearmonthdate: 1,
    yearmonthdatehours: 1,
    yearmonthdatehoursminutes: 1,
    yearmonthdatehoursminutesseconds: 1,
    yearweek: 1,
    yearweekday: 1,
    yearweekdayhours: 1,
    yearweekdayhoursminutes: 1,
    yearweekdayhoursminutesseconds: 1,
    yeardayofyear: 1,
    quartermonth: 1,
    monthdate: 1,
    monthdatehours: 1,
    monthdatehoursminutes: 1,
    monthdatehoursminutesseconds: 1,
    weekday: 1,
    weeksdayhours: 1,
    weekdayhoursminutes: 1,
    weekdayhoursminutesseconds: 1,
    dayhours: 1,
    dayhoursminutes: 1,
    dayhoursminutesseconds: 1,
    hoursminutes: 1,
    hoursminutesseconds: 1,
    minutesseconds: 1,
    secondsmilliseconds: 1
};
const BINNED_LOCAL_TIMEUNIT_INDEX = {
    binnedyear: 1,
    binnedyearquarter: 1,
    binnedyearquartermonth: 1,
    binnedyearmonth: 1,
    binnedyearmonthdate: 1,
    binnedyearmonthdatehours: 1,
    binnedyearmonthdatehoursminutes: 1,
    binnedyearmonthdatehoursminutesseconds: 1,
    binnedyearweek: 1,
    binnedyearweekday: 1,
    binnedyearweekdayhours: 1,
    binnedyearweekdayhoursminutes: 1,
    binnedyearweekdayhoursminutesseconds: 1,
    binnedyeardayofyear: 1
};
const BINNED_UTC_TIMEUNIT_INDEX = {
    binnedutcyear: 1,
    binnedutcyearquarter: 1,
    binnedutcyearquartermonth: 1,
    binnedutcyearmonth: 1,
    binnedutcyearmonthdate: 1,
    binnedutcyearmonthdatehours: 1,
    binnedutcyearmonthdatehoursminutes: 1,
    binnedutcyearmonthdatehoursminutesseconds: 1,
    binnedutcyearweek: 1,
    binnedutcyearweekday: 1,
    binnedutcyearweekdayhours: 1,
    binnedutcyearweekdayhoursminutes: 1,
    binnedutcyearweekdayhoursminutesseconds: 1,
    binnedutcyeardayofyear: 1
};
export const BINNED_TIMEUNIT_INDEX = {
    ...BINNED_LOCAL_TIMEUNIT_INDEX,
    ...BINNED_UTC_TIMEUNIT_INDEX
};
export function isBinnedTimeUnit(timeUnit) {
    if (isObject(timeUnit)) {
        return timeUnit.binned;
    }
    return isBinnedTimeUnitString(timeUnit);
}
export function isBinnedTimeUnitString(timeUnit) {
    return timeUnit && timeUnit.startsWith('binned');
}
export const UTC_MULTI_TIMEUNIT_INDEX = {
    utcyearquarter: 1,
    utcyearquartermonth: 1,
    utcyearmonth: 1,
    utcyearmonthdate: 1,
    utcyearmonthdatehours: 1,
    utcyearmonthdatehoursminutes: 1,
    utcyearmonthdatehoursminutesseconds: 1,
    utcyearweek: 1,
    utcyearweekday: 1,
    utcyearweekdayhours: 1,
    utcyearweekdayhoursminutes: 1,
    utcyearweekdayhoursminutesseconds: 1,
    utcyeardayofyear: 1,
    utcquartermonth: 1,
    utcmonthdate: 1,
    utcmonthdatehours: 1,
    utcmonthdatehoursminutes: 1,
    utcmonthdatehoursminutesseconds: 1,
    utcweekday: 1,
    utcweeksdayhours: 1,
    utcweekdayhoursminutes: 1,
    utcweekdayhoursminutesseconds: 1,
    utcdayhours: 1,
    utcdayhoursminutes: 1,
    utcdayhoursminutesseconds: 1,
    utchoursminutes: 1,
    utchoursminutesseconds: 1,
    utcminutesseconds: 1,
    utcsecondsmilliseconds: 1
};
export function isUTCTimeUnit(t) {
    return t.startsWith('utc');
}
export function getLocalTimeUnitFromUTCTimeUnit(t) {
    return t.substring(3);
}
// In order of increasing specificity
export const VEGALITE_TIMEFORMAT = {
    'year-month': '%b %Y ',
    'year-month-date': '%b %d, %Y '
};
export function getTimeUnitParts(timeUnit) {
    return TIMEUNIT_PARTS.filter(part => containsTimeUnit(timeUnit, part));
}
export function getSmallestTimeUnitPart(timeUnit) {
    const parts = getTimeUnitParts(timeUnit);
    return parts[parts.length - 1];
}
/** Returns true if fullTimeUnit contains the timeUnit, false otherwise. */
export function containsTimeUnit(fullTimeUnit, timeUnit) {
    const index = fullTimeUnit.indexOf(timeUnit);
    if (index < 0) {
        return false;
    }
    // exclude milliseconds
    if (index > 0 && timeUnit === 'seconds' && fullTimeUnit.charAt(index - 1) === 'i') {
        return false;
    }
    // exclude dayofyear
    if (fullTimeUnit.length > index + 3 && timeUnit === 'day' && fullTimeUnit.charAt(index + 3) === 'o') {
        return false;
    }
    if (index > 0 && timeUnit === 'year' && fullTimeUnit.charAt(index - 1) === 'f') {
        return false;
    }
    return true;
}
/**
 * Returns Vega expression for a given timeUnit and fieldRef
 */
export function fieldExpr(fullTimeUnit, field, { end } = { end: false }) {
    const fieldRef = accessPathWithDatum(field);
    const utc = isUTCTimeUnit(fullTimeUnit) ? 'utc' : '';
    function func(timeUnit) {
        if (timeUnit === 'quarter') {
            // quarter starting at 0 (0,3,6,9).
            return `(${utc}quarter(${fieldRef})-1)`;
        }
        else {
            return `${utc}${timeUnit}(${fieldRef})`;
        }
    }
    let lastTimeUnit;
    const dateExpr = {};
    for (const part of TIMEUNIT_PARTS) {
        if (containsTimeUnit(fullTimeUnit, part)) {
            dateExpr[part] = func(part);
            lastTimeUnit = part;
        }
    }
    if (end) {
        dateExpr[lastTimeUnit] += '+1';
    }
    return dateTimeExprToExpr(dateExpr);
}
export function timeUnitSpecifierExpression(timeUnit) {
    if (!timeUnit) {
        return undefined;
    }
    const timeUnitParts = getTimeUnitParts(timeUnit);
    return `timeUnitSpecifier(${stringify(timeUnitParts)}, ${stringify(VEGALITE_TIMEFORMAT)})`;
}
/**
 * Returns the signal expression used for axis labels for a time unit.
 */
export function formatExpression(timeUnit, field, isUTCScale) {
    if (!timeUnit) {
        return undefined;
    }
    const expr = timeUnitSpecifierExpression(timeUnit);
    // We only use utcFormat for utc scale
    // For utc time units, the data is already converted as a part of timeUnit transform.
    // Thus, utc time units should use timeFormat to avoid shifting the time twice.
    const utc = isUTCScale || isUTCTimeUnit(timeUnit);
    return `${utc ? 'utc' : 'time'}Format(${field}, ${expr})`;
}
export function normalizeTimeUnit(timeUnit) {
    if (!timeUnit) {
        return undefined;
    }
    let params;
    if (isString(timeUnit)) {
        if (isBinnedTimeUnitString(timeUnit)) {
            params = {
                unit: timeUnit.substring(6),
                binned: true
            };
        }
        else {
            params = {
                unit: timeUnit
            };
        }
    }
    else if (isObject(timeUnit)) {
        params = {
            ...timeUnit,
            ...(timeUnit.unit ? { unit: timeUnit.unit } : {})
        };
    }
    if (isUTCTimeUnit(params.unit)) {
        params.utc = true;
        params.unit = getLocalTimeUnitFromUTCTimeUnit(params.unit);
    }
    return params;
}
export function timeUnitToString(tu) {
    const { utc, ...rest } = normalizeTimeUnit(tu);
    if (rest.unit) {
        return ((utc ? 'utc' : '') +
            keys(rest)
                .map(p => varName(`${p === 'unit' ? '' : `_${p}_`}${rest[p]}`))
                .join(''));
    }
    else {
        // when maxbins is specified instead of units
        return ((utc ? 'utc' : '') +
            'timeunit' +
            keys(rest)
                .map(p => varName(`_${p}_${rest[p]}`))
                .join(''));
    }
}
export function durationExpr(timeUnit, wrap = x => x) {
    const normalizedTimeUnit = normalizeTimeUnit(timeUnit);
    const smallestUnitPart = getSmallestTimeUnitPart(normalizedTimeUnit.unit);
    if (smallestUnitPart && smallestUnitPart !== 'day') {
        const startDate = {
            year: 2001,
            month: 1,
            date: 1,
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: 0
        };
        const { step, part } = getDateTimePartAndStep(smallestUnitPart, normalizedTimeUnit.step);
        const endDate = {
            ...startDate,
            [part]: +startDate[part] + step
        };
        // Calculate timestamp duration for the smallest unit listed
        return `${wrap(dateTimeToExpr(endDate))} - ${wrap(dateTimeToExpr(startDate))}`;
    }
    return undefined;
}
const DATE_PARTS = {
    year: 1,
    month: 1,
    date: 1,
    hours: 1,
    minutes: 1,
    seconds: 1,
    milliseconds: 1
};
export function isDatePart(timeUnit) {
    return !!DATE_PARTS[timeUnit];
}
export function getDateTimePartAndStep(timeUnit, step = 1) {
    if (isDatePart(timeUnit)) {
        return { part: timeUnit, step };
    }
    switch (timeUnit) {
        case 'day':
        case 'dayofyear':
            return { part: 'date', step };
        case 'quarter':
            return { part: 'month', step: step * 3 };
        case 'week':
            return { part: 'date', step: step * 7 };
    }
}
//# sourceMappingURL=timeunit.js.map