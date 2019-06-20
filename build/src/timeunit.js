"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var datetime_1 = require("./datetime");
var log = tslib_1.__importStar(require("./log"));
var util_1 = require("./util");
var TimeUnit;
(function (TimeUnit) {
    TimeUnit.YEAR = 'year';
    TimeUnit.MONTH = 'month';
    TimeUnit.DAY = 'day';
    TimeUnit.DATE = 'date';
    TimeUnit.HOURS = 'hours';
    TimeUnit.MINUTES = 'minutes';
    TimeUnit.SECONDS = 'seconds';
    TimeUnit.MILLISECONDS = 'milliseconds';
    TimeUnit.YEARMONTH = 'yearmonth';
    TimeUnit.YEARMONTHDATE = 'yearmonthdate';
    TimeUnit.YEARMONTHDATEHOURS = 'yearmonthdatehours';
    TimeUnit.YEARMONTHDATEHOURSMINUTES = 'yearmonthdatehoursminutes';
    TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS = 'yearmonthdatehoursminutesseconds';
    // MONTHDATE always include 29 February since we use year 0th (which is a leap year);
    TimeUnit.MONTHDATE = 'monthdate';
    TimeUnit.HOURSMINUTES = 'hoursminutes';
    TimeUnit.HOURSMINUTESSECONDS = 'hoursminutesseconds';
    TimeUnit.MINUTESSECONDS = 'minutesseconds';
    TimeUnit.SECONDSMILLISECONDS = 'secondsmilliseconds';
    TimeUnit.QUARTER = 'quarter';
    TimeUnit.YEARQUARTER = 'yearquarter';
    TimeUnit.QUARTERMONTH = 'quartermonth';
    TimeUnit.YEARQUARTERMONTH = 'yearquartermonth';
    TimeUnit.UTCYEAR = 'utcyear';
    TimeUnit.UTCMONTH = 'utcmonth';
    TimeUnit.UTCDAY = 'utcday';
    TimeUnit.UTCDATE = 'utcdate';
    TimeUnit.UTCHOURS = 'utchours';
    TimeUnit.UTCMINUTES = 'utcminutes';
    TimeUnit.UTCSECONDS = 'utcseconds';
    TimeUnit.UTCMILLISECONDS = 'utcmilliseconds';
    TimeUnit.UTCYEARMONTH = 'utcyearmonth';
    TimeUnit.UTCYEARMONTHDATE = 'utcyearmonthdate';
    TimeUnit.UTCYEARMONTHDATEHOURS = 'utcyearmonthdatehours';
    TimeUnit.UTCYEARMONTHDATEHOURSMINUTES = 'utcyearmonthdatehoursminutes';
    TimeUnit.UTCYEARMONTHDATEHOURSMINUTESSECONDS = 'utcyearmonthdatehoursminutesseconds';
    // MONTHDATE always include 29 February since we use year 0th (which is a leap year);
    TimeUnit.UTCMONTHDATE = 'utcmonthdate';
    TimeUnit.UTCHOURSMINUTES = 'utchoursminutes';
    TimeUnit.UTCHOURSMINUTESSECONDS = 'utchoursminutesseconds';
    TimeUnit.UTCMINUTESSECONDS = 'utcminutesseconds';
    TimeUnit.UTCSECONDSMILLISECONDS = 'utcsecondsmilliseconds';
    TimeUnit.UTCQUARTER = 'utcquarter';
    TimeUnit.UTCYEARQUARTER = 'utcyearquarter';
    TimeUnit.UTCQUARTERMONTH = 'utcquartermonth';
    TimeUnit.UTCYEARQUARTERMONTH = 'utcyearquartermonth';
})(TimeUnit = exports.TimeUnit || (exports.TimeUnit = {}));
/** Time Unit that only corresponds to only one part of Date objects. */
var LOCAL_SINGLE_TIMEUNIT_INDEX = {
    year: 1,
    quarter: 1,
    month: 1,
    day: 1,
    date: 1,
    hours: 1,
    minutes: 1,
    seconds: 1,
    milliseconds: 1
};
exports.TIMEUNIT_PARTS = util_1.flagKeys(LOCAL_SINGLE_TIMEUNIT_INDEX);
function isLocalSingleTimeUnit(timeUnit) {
    return !!LOCAL_SINGLE_TIMEUNIT_INDEX[timeUnit];
}
exports.isLocalSingleTimeUnit = isLocalSingleTimeUnit;
var UTC_SINGLE_TIMEUNIT_INDEX = {
    utcyear: 1,
    utcquarter: 1,
    utcmonth: 1,
    utcday: 1,
    utcdate: 1,
    utchours: 1,
    utcminutes: 1,
    utcseconds: 1,
    utcmilliseconds: 1
};
function isUtcSingleTimeUnit(timeUnit) {
    return !!UTC_SINGLE_TIMEUNIT_INDEX[timeUnit];
}
exports.isUtcSingleTimeUnit = isUtcSingleTimeUnit;
var LOCAL_MULTI_TIMEUNIT_INDEX = {
    yearquarter: 1,
    yearquartermonth: 1,
    yearmonth: 1,
    yearmonthdate: 1,
    yearmonthdatehours: 1,
    yearmonthdatehoursminutes: 1,
    yearmonthdatehoursminutesseconds: 1,
    quartermonth: 1,
    monthdate: 1,
    hoursminutes: 1,
    hoursminutesseconds: 1,
    minutesseconds: 1,
    secondsmilliseconds: 1
};
var UTC_MULTI_TIMEUNIT_INDEX = {
    utcyearquarter: 1,
    utcyearquartermonth: 1,
    utcyearmonth: 1,
    utcyearmonthdate: 1,
    utcyearmonthdatehours: 1,
    utcyearmonthdatehoursminutes: 1,
    utcyearmonthdatehoursminutesseconds: 1,
    utcquartermonth: 1,
    utcmonthdate: 1,
    utchoursminutes: 1,
    utchoursminutesseconds: 1,
    utcminutesseconds: 1,
    utcsecondsmilliseconds: 1
};
var UTC_TIMEUNIT_INDEX = tslib_1.__assign({}, UTC_SINGLE_TIMEUNIT_INDEX, UTC_MULTI_TIMEUNIT_INDEX);
function isUTCTimeUnit(t) {
    return !!UTC_TIMEUNIT_INDEX[t];
}
exports.isUTCTimeUnit = isUTCTimeUnit;
function getLocalTimeUnit(t) {
    return t.substr(3);
}
exports.getLocalTimeUnit = getLocalTimeUnit;
var TIMEUNIT_INDEX = tslib_1.__assign({}, LOCAL_SINGLE_TIMEUNIT_INDEX, UTC_SINGLE_TIMEUNIT_INDEX, LOCAL_MULTI_TIMEUNIT_INDEX, UTC_MULTI_TIMEUNIT_INDEX);
exports.TIMEUNITS = util_1.flagKeys(TIMEUNIT_INDEX);
function isTimeUnit(t) {
    return !!TIMEUNIT_INDEX[t];
}
exports.isTimeUnit = isTimeUnit;
var SET_DATE_METHOD = {
    year: 'setFullYear',
    month: 'setMonth',
    date: 'setDate',
    hours: 'setHours',
    minutes: 'setMinutes',
    seconds: 'setSeconds',
    milliseconds: 'setMilliseconds',
    // Day and quarter have their own special cases
    quarter: null,
    day: null,
};
/**
 * Converts a date to only have the measurements relevant to the specified unit
 * i.e. ('yearmonth', '2000-12-04 07:58:14') -> '2000-12-01 00:00:00'
 * Note: the base date is Jan 01 1900 00:00:00
 */
function convert(unit, date) {
    var isUTC = isUTCTimeUnit(unit);
    var result = isUTC ?
        // start with uniform date
        new Date(Date.UTC(0, 0, 1, 0, 0, 0, 0)) :
        new Date(0, 0, 1, 0, 0, 0, 0);
    for (var _i = 0, TIMEUNIT_PARTS_1 = exports.TIMEUNIT_PARTS; _i < TIMEUNIT_PARTS_1.length; _i++) {
        var timeUnitPart = TIMEUNIT_PARTS_1[_i];
        if (containsTimeUnit(unit, timeUnitPart)) {
            switch (timeUnitPart) {
                case TimeUnit.DAY:
                    throw new Error('Cannot convert to TimeUnits containing \'day\'');
                case TimeUnit.QUARTER: {
                    var _a = dateMethods('month', isUTC), getDateMethod_1 = _a.getDateMethod, setDateMethod_1 = _a.setDateMethod;
                    // indicate quarter by setting month to be the first of the quarter i.e. may (4) -> april (3)
                    result[setDateMethod_1]((Math.floor(date[getDateMethod_1]() / 3)) * 3);
                    break;
                }
                default:
                    var _b = dateMethods(timeUnitPart, isUTC), getDateMethod = _b.getDateMethod, setDateMethod = _b.setDateMethod;
                    result[setDateMethod](date[getDateMethod]());
            }
        }
    }
    return result;
}
exports.convert = convert;
function dateMethods(singleUnit, isUtc) {
    var rawSetDateMethod = SET_DATE_METHOD[singleUnit];
    var setDateMethod = isUtc ? 'setUTC' + rawSetDateMethod.substr(3) : rawSetDateMethod;
    var getDateMethod = 'get' + (isUtc ? 'UTC' : '') + rawSetDateMethod.substr(3);
    return { setDateMethod: setDateMethod, getDateMethod: getDateMethod };
}
function getTimeUnitParts(timeUnit) {
    return exports.TIMEUNIT_PARTS.reduce(function (parts, part) {
        if (containsTimeUnit(timeUnit, part)) {
            return parts.concat(part);
        }
        return parts;
    }, []);
}
exports.getTimeUnitParts = getTimeUnitParts;
/** Returns true if fullTimeUnit contains the timeUnit, false otherwise. */
function containsTimeUnit(fullTimeUnit, timeUnit) {
    var index = fullTimeUnit.indexOf(timeUnit);
    return index > -1 &&
        (timeUnit !== TimeUnit.SECONDS ||
            index === 0 ||
            fullTimeUnit.charAt(index - 1) !== 'i' // exclude milliseconds
        );
}
exports.containsTimeUnit = containsTimeUnit;
/**
 * Returns Vega expresssion for a given timeUnit and fieldRef
 */
function fieldExpr(fullTimeUnit, field) {
    var fieldRef = util_1.accessPathWithDatum(field);
    var utc = isUTCTimeUnit(fullTimeUnit) ? 'utc' : '';
    function func(timeUnit) {
        if (timeUnit === TimeUnit.QUARTER) {
            // quarter starting at 0 (0,3,6,9).
            return "(" + utc + "quarter(" + fieldRef + ")-1)";
        }
        else {
            return "" + utc + timeUnit + "(" + fieldRef + ")";
        }
    }
    var d = exports.TIMEUNIT_PARTS.reduce(function (dateExpr, tu) {
        if (containsTimeUnit(fullTimeUnit, tu)) {
            dateExpr[tu] = func(tu);
        }
        return dateExpr;
    }, {});
    return datetime_1.dateTimeExpr(d);
}
exports.fieldExpr = fieldExpr;
/**
 * returns the signal expression used for axis labels for a time unit
 */
function formatExpression(timeUnit, field, shortTimeLabels, isUTCScale) {
    if (!timeUnit) {
        return undefined;
    }
    var dateComponents = [];
    var expression = '';
    var hasYear = containsTimeUnit(timeUnit, TimeUnit.YEAR);
    if (containsTimeUnit(timeUnit, TimeUnit.QUARTER)) {
        // special expression for quarter as prefix
        expression = "'Q' + quarter(" + field + ")";
    }
    if (containsTimeUnit(timeUnit, TimeUnit.MONTH)) {
        // By default use short month name
        dateComponents.push(shortTimeLabels !== false ? '%b' : '%B');
    }
    if (containsTimeUnit(timeUnit, TimeUnit.DAY)) {
        dateComponents.push(shortTimeLabels ? '%a' : '%A');
    }
    else if (containsTimeUnit(timeUnit, TimeUnit.DATE)) {
        dateComponents.push('%d' + (hasYear ? ',' : '')); // add comma if there is year
    }
    if (hasYear) {
        dateComponents.push(shortTimeLabels ? '%y' : '%Y');
    }
    var timeComponents = [];
    if (containsTimeUnit(timeUnit, TimeUnit.HOURS)) {
        timeComponents.push('%H');
    }
    if (containsTimeUnit(timeUnit, TimeUnit.MINUTES)) {
        timeComponents.push('%M');
    }
    if (containsTimeUnit(timeUnit, TimeUnit.SECONDS)) {
        timeComponents.push('%S');
    }
    if (containsTimeUnit(timeUnit, TimeUnit.MILLISECONDS)) {
        timeComponents.push('%L');
    }
    var dateTimeComponents = [];
    if (dateComponents.length > 0) {
        dateTimeComponents.push(dateComponents.join(' '));
    }
    if (timeComponents.length > 0) {
        dateTimeComponents.push(timeComponents.join(':'));
    }
    if (dateTimeComponents.length > 0) {
        if (expression) {
            // Add space between quarter and main time format
            expression += " + ' ' + ";
        }
        // We only use utcFormat for utc scale
        // For utc time units, the data is already converted as a part of timeUnit transform.
        // Thus, utc time units should use timeFormat to avoid shifting the time twice.
        if (isUTCScale) {
            expression += "utcFormat(" + field + ", '" + dateTimeComponents.join(' ') + "')";
        }
        else {
            expression += "timeFormat(" + field + ", '" + dateTimeComponents.join(' ') + "')";
        }
    }
    // If expression is still an empty string, return undefined instead.
    return expression || undefined;
}
exports.formatExpression = formatExpression;
function normalizeTimeUnit(timeUnit) {
    if (timeUnit !== 'day' && timeUnit.indexOf('day') >= 0) {
        log.warn(log.message.dayReplacedWithDate(timeUnit));
        return timeUnit.replace('day', 'date');
    }
    return timeUnit;
}
exports.normalizeTimeUnit = normalizeTimeUnit;
//# sourceMappingURL=timeunit.js.map