"use strict";
var util_1 = require('../util');
var channel_1 = require('../channel');
var timeunit_1 = require('../timeunit');
function smallestUnit(timeUnit) {
    if (!timeUnit) {
        return undefined;
    }
    if (timeunit_1.containsTimeUnit(timeUnit, timeunit_1.TimeUnit.SECONDS)) {
        return 'second';
    }
    if (timeunit_1.containsTimeUnit(timeUnit, timeunit_1.TimeUnit.MINUTES)) {
        return 'minute';
    }
    if (timeunit_1.containsTimeUnit(timeUnit, timeunit_1.TimeUnit.HOURS)) {
        return 'hour';
    }
    if (timeunit_1.containsTimeUnit(timeUnit, timeunit_1.TimeUnit.DAY) ||
        timeunit_1.containsTimeUnit(timeUnit, timeunit_1.TimeUnit.DATE)) {
        return 'day';
    }
    if (timeunit_1.containsTimeUnit(timeUnit, timeunit_1.TimeUnit.MONTH)) {
        return 'month';
    }
    if (timeunit_1.containsTimeUnit(timeUnit, timeunit_1.TimeUnit.YEAR)) {
        return 'year';
    }
    return undefined;
}
exports.smallestUnit = smallestUnit;
function parseExpression(timeUnit, fieldRef, onlyRef) {
    if (onlyRef === void 0) { onlyRef = false; }
    var out = 'datetime(';
    function func(fun, addComma) {
        if (addComma === void 0) { addComma = true; }
        if (onlyRef) {
            return fieldRef + (addComma ? ', ' : '');
        }
        else {
            var res = '';
            if (fun === 'quarter') {
                res = 'floor(month(' + fieldRef + ')' + '/3)*3';
            }
            else {
                res = fun + '(' + fieldRef + ')';
            }
            return res + (addComma ? ', ' : '');
        }
    }
    if (timeunit_1.containsTimeUnit(timeUnit, timeunit_1.TimeUnit.YEAR)) {
        out += func('year');
    }
    else {
        out += '2006, ';
    }
    if (timeunit_1.containsTimeUnit(timeUnit, timeunit_1.TimeUnit.MONTH)) {
        out += func('month');
    }
    else if (timeunit_1.containsTimeUnit(timeUnit, timeunit_1.TimeUnit.QUARTER)) {
        out += func('quarter');
    }
    else {
        out += '0, ';
    }
    if (timeunit_1.containsTimeUnit(timeUnit, timeunit_1.TimeUnit.DAY)) {
        out += func('day', false) + '+1, ';
    }
    else if (timeunit_1.containsTimeUnit(timeUnit, timeunit_1.TimeUnit.DATE)) {
        out += func('date');
    }
    else {
        out += '1, ';
    }
    if (timeunit_1.containsTimeUnit(timeUnit, timeunit_1.TimeUnit.HOURS)) {
        out += func('hours');
    }
    else {
        out += '0, ';
    }
    if (timeunit_1.containsTimeUnit(timeUnit, timeunit_1.TimeUnit.MINUTES)) {
        out += func('minutes');
    }
    else {
        out += '0, ';
    }
    if (timeunit_1.containsTimeUnit(timeUnit, timeunit_1.TimeUnit.SECONDS)) {
        out += func('seconds');
    }
    else {
        out += '0, ';
    }
    if (timeunit_1.containsTimeUnit(timeUnit, timeunit_1.TimeUnit.MILLISECONDS)) {
        out += func('milliseconds', false);
    }
    else {
        out += '0';
    }
    return out + ')';
}
exports.parseExpression = parseExpression;
function rawDomain(timeUnit, channel) {
    if (util_1.contains([channel_1.ROW, channel_1.COLUMN, channel_1.SHAPE, channel_1.COLOR], channel)) {
        return null;
    }
    switch (timeUnit) {
        case timeunit_1.TimeUnit.SECONDS:
            return util_1.range(0, 60);
        case timeunit_1.TimeUnit.MINUTES:
            return util_1.range(0, 60);
        case timeunit_1.TimeUnit.HOURS:
            return util_1.range(0, 24);
        case timeunit_1.TimeUnit.DAY:
            return util_1.range(0, 7);
        case timeunit_1.TimeUnit.DATE:
            return util_1.range(1, 32);
        case timeunit_1.TimeUnit.MONTH:
            return util_1.range(0, 12);
        case timeunit_1.TimeUnit.QUARTER:
            return [0, 3, 6, 9];
    }
    return null;
}
exports.rawDomain = rawDomain;
//# sourceMappingURL=time.js.map