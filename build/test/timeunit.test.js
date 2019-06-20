"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var timeunit_1 = require("../src/timeunit");
describe('timeUnit', function () {
    describe('containsTimeUnit', function () {
        it('should return true for quarter given quarter', function () {
            var fullTimeUnit = timeunit_1.TimeUnit.QUARTER;
            var timeUnit = timeunit_1.TimeUnit.QUARTER;
            chai_1.assert.equal(timeunit_1.containsTimeUnit(fullTimeUnit, timeUnit), true);
        });
        it('should return true for yearquarter given quarter', function () {
            var fullTimeUnit = timeunit_1.TimeUnit.YEARQUARTER;
            var timeUnit = timeunit_1.TimeUnit.QUARTER;
            chai_1.assert.equal(timeunit_1.containsTimeUnit(fullTimeUnit, timeUnit), true);
        });
        it('should return true for SECONDS and MILLISECONDS given SECONDSMILLISECONDS', function () {
            var fullTimeUnit = timeunit_1.TimeUnit.SECONDSMILLISECONDS;
            var timeUnit = timeunit_1.TimeUnit.SECONDS;
            chai_1.assert.equal(timeunit_1.containsTimeUnit(fullTimeUnit, timeUnit), true);
        });
        it('should return true for MILLISECONDS given SECONDSMILLISECONDS', function () {
            var fullTimeUnit = timeunit_1.TimeUnit.SECONDSMILLISECONDS;
            var timeUnit = timeunit_1.TimeUnit.MILLISECONDS;
            chai_1.assert.equal(timeunit_1.containsTimeUnit(fullTimeUnit, timeUnit), true);
        });
        it('should return false for quarter given year', function () {
            var fullTimeUnit = timeunit_1.TimeUnit.YEAR;
            var timeUnit = timeunit_1.TimeUnit.QUARTER;
            chai_1.assert.equal(timeunit_1.containsTimeUnit(fullTimeUnit, timeUnit), false);
        });
        it('should return false for SECONDS given MILLISECONDS', function () {
            var fullTimeUnit = timeunit_1.TimeUnit.MILLISECONDS;
            var timeUnit = timeunit_1.TimeUnit.SECONDS;
            chai_1.assert.equal(timeunit_1.containsTimeUnit(fullTimeUnit, timeUnit), false);
        });
    });
    describe('fieldExpr', function () {
        it('should return correct field expression for YEARMONTHDATEHOURSMINUTESSECONDS', function () {
            chai_1.assert.equal(timeunit_1.fieldExpr(timeunit_1.TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS, 'x'), 'datetime(year(datum["x"]), month(datum["x"]), date(datum["x"]), hours(datum["x"]), minutes(datum["x"]), seconds(datum["x"]), 0)');
        });
        it('should return correct field expression for QUARTER', function () {
            chai_1.assert.equal(timeunit_1.fieldExpr(timeunit_1.TimeUnit.QUARTER, 'x'), 'datetime(0, (quarter(datum["x"])-1)*3, 1, 0, 0, 0, 0)');
        });
        it('should return correct field expression for DAY', function () {
            chai_1.assert.equal(timeunit_1.fieldExpr(timeunit_1.TimeUnit.DAY, 'x'), 'datetime(2006, 0, day(datum["x"])+1, 0, 0, 0, 0)');
        });
        it('should return correct field expression for MILLISECONDS', function () {
            chai_1.assert.equal(timeunit_1.fieldExpr(timeunit_1.TimeUnit.MILLISECONDS, 'x'), 'datetime(0, 0, 1, 0, 0, 0, milliseconds(datum["x"]))');
        });
        it('should return correct field expression with utc for MILLISECONDS', function () {
            chai_1.assert.equal(timeunit_1.fieldExpr(timeunit_1.TimeUnit.UTCQUARTER, 'x'), 'datetime(0, (utcquarter(datum["x"])-1)*3, 1, 0, 0, 0, 0)');
            chai_1.assert.equal(timeunit_1.fieldExpr(timeunit_1.TimeUnit.UTCMILLISECONDS, 'x'), 'datetime(0, 0, 1, 0, 0, 0, utcmilliseconds(datum["x"]))');
        });
    });
    describe('convert', function () {
        it('should throw an error for the DAY timeunit', function () {
            chai_1.assert.throws(function () {
                timeunit_1.convert(timeunit_1.TimeUnit.DAY, new Date(2000, 11, 2, 23, 59, 59, 999));
            }, Error, 'Cannot convert to TimeUnits containing \'day\'');
        });
        it('should return expected result for YEARQUARTER', function () {
            var date = timeunit_1.convert(timeunit_1.TimeUnit.YEARQUARTER, new Date(2000, 11, 2, 23, 59, 59, 999));
            chai_1.assert.equal(date.getTime(), new Date(2000, 9, 1, 0, 0, 0, 0).getTime());
        });
        it('should return expected result for UTCYEARQUARTER', function () {
            var date = timeunit_1.convert(timeunit_1.TimeUnit.UTCYEARQUARTER, new Date(Date.UTC(2000, 11, 2, 23, 59, 59, 999)));
            chai_1.assert.equal(date.getTime(), new Date(Date.UTC(2000, 9, 1, 0, 0, 0, 0)).getTime());
        });
        it('should return expected result for YEARQUARTERMONTH', function () {
            var date = timeunit_1.convert(timeunit_1.TimeUnit.YEARQUARTERMONTH, new Date(2000, 11, 2, 23, 59, 59, 999));
            chai_1.assert.equal(date.getTime(), new Date(2000, 11, 1, 0, 0, 0, 0).getTime());
        });
        it('should return expected result for YEARMONTH', function () {
            var date = timeunit_1.convert(timeunit_1.TimeUnit.YEARMONTH, new Date(2000, 11, 2, 23, 59, 59, 999));
            chai_1.assert.equal(date.getTime(), new Date(2000, 11, 1, 0, 0, 0, 0).getTime());
        });
        it('should return expected result for UTCYEARMONTH', function () {
            var date = timeunit_1.convert(timeunit_1.TimeUnit.UTCYEARMONTH, new Date(Date.UTC(2000, 11, 2, 23, 59, 59, 999)));
            chai_1.assert.equal(date.getTime(), new Date(Date.UTC(2000, 11, 1, 0, 0, 0, 0)).getTime());
        });
        it('should return expected result for UTCYEARMONTH', function () {
            var date = timeunit_1.convert(timeunit_1.TimeUnit.UTCYEAR, new Date(Date.UTC(2000, 11, 2, 23, 59, 59, 999)));
            chai_1.assert.equal(date.getTime(), new Date(Date.UTC(2000, 0, 1, 0, 0, 0, 0)).getTime());
        });
        it('should return expected result for YEARMONTHDATE', function () {
            var date = timeunit_1.convert(timeunit_1.TimeUnit.YEARMONTHDATE, new Date(2000, 11, 2, 23, 59, 59, 999));
            chai_1.assert.equal(date.getTime(), new Date(2000, 11, 2, 0, 0, 0, 0).getTime());
        });
        it('should return expected result for YEARMONTHDATEHOURS', function () {
            var date = timeunit_1.convert(timeunit_1.TimeUnit.YEARMONTHDATEHOURS, new Date(2000, 11, 2, 23, 59, 59, 999));
            chai_1.assert.equal(date.getTime(), new Date(2000, 11, 2, 23, 0, 0, 0).getTime());
        });
        it('should return expected result for YEARMONTHDATEHOURSMINUTES', function () {
            var date = timeunit_1.convert(timeunit_1.TimeUnit.YEARMONTHDATEHOURSMINUTES, new Date(2000, 11, 2, 23, 59, 59, 999));
            chai_1.assert.equal(date.getTime(), new Date(2000, 11, 2, 23, 59, 0, 0).getTime());
        });
        it('should return expected result for YEARMONTHDATEHOURSMINUTESSECONDS', function () {
            var date = timeunit_1.convert(timeunit_1.TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS, new Date(2000, 11, 2, 23, 59, 59, 999));
            chai_1.assert.equal(date.getTime(), new Date(2000, 11, 2, 23, 59, 59, 0).getTime());
        });
        it('should return expected result for QUARTERMONTH', function () {
            var date = timeunit_1.convert(timeunit_1.TimeUnit.QUARTERMONTH, new Date(2000, 11, 2, 23, 59, 59, 999));
            chai_1.assert.equal(date.getTime(), new Date(1900, 11, 1, 0, 0, 0, 0).getTime());
        });
        it('should return expected result for HOURSMINUTES', function () {
            var date = timeunit_1.convert(timeunit_1.TimeUnit.HOURSMINUTES, new Date(2000, 11, 2, 23, 59, 59, 999));
            chai_1.assert.equal(date.getTime(), new Date(1900, 0, 1, 23, 59, 0, 0).getTime());
        });
        it('should return expected result for HOURSMINUTESSECONDS', function () {
            var date = timeunit_1.convert(timeunit_1.TimeUnit.HOURSMINUTESSECONDS, new Date(2000, 11, 2, 23, 59, 59, 999));
            chai_1.assert.equal(date.getTime(), new Date(1900, 0, 1, 23, 59, 59, 0).getTime());
        });
        it('should return expected result for MINUTESSECONDS', function () {
            var date = timeunit_1.convert(timeunit_1.TimeUnit.MINUTESSECONDS, new Date(2000, 11, 2, 23, 59, 59, 999));
            chai_1.assert.equal(date.getTime(), new Date(1900, 0, 1, 0, 59, 59, 0).getTime());
        });
        it('should return expected result for SECONDSMILLISECONDS', function () {
            var date = timeunit_1.convert(timeunit_1.TimeUnit.SECONDSMILLISECONDS, new Date(2000, 11, 2, 23, 59, 59, 999));
            chai_1.assert.equal(date.getTime(), new Date(1900, 0, 1, 0, 0, 59, 999).getTime());
        });
    });
    describe('template', function () {
        it('should return correct template for YEARMONTHDATEHOURSMINUTESSECONDS', function () {
            chai_1.assert.equal(timeunit_1.formatExpression(timeunit_1.TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS, 'datum.x', undefined, false), "timeFormat(datum.x, '%b %d, %Y %H:%M:%S')");
        });
        it('should return correct template for YEARMONTH (No comma)', function () {
            chai_1.assert.equal(timeunit_1.formatExpression(timeunit_1.TimeUnit.YEARMONTH, 'datum.x', undefined, false), "timeFormat(datum.x, '%b %Y')");
        });
        it('should return correct template for DAY', function () {
            chai_1.assert.equal(timeunit_1.formatExpression(timeunit_1.TimeUnit.DAY, 'datum.x', undefined, false), "timeFormat(datum.x, '%A')");
        });
        it('should return correct template for DAY (shortened)', function () {
            chai_1.assert.equal(timeunit_1.formatExpression(timeunit_1.TimeUnit.DAY, 'datum.x', true, false), "timeFormat(datum.x, '%a')");
        });
        it('should return correct template for QUARTER', function () {
            chai_1.assert.equal(timeunit_1.formatExpression(timeunit_1.TimeUnit.QUARTER, 'datum.x', undefined, false), "'Q' + quarter(datum.x)");
        });
        it('should return correct template for YEARQUARTER', function () {
            chai_1.assert.equal(timeunit_1.formatExpression(timeunit_1.TimeUnit.YEARQUARTER, 'datum.x', undefined, false), "'Q' + quarter(datum.x) + ' ' + timeFormat(datum.x, '%Y')");
        });
        it('should return correct template for milliseconds', function () {
            chai_1.assert.equal(timeunit_1.formatExpression(timeunit_1.TimeUnit.MILLISECONDS, 'datum.x', undefined, false), "timeFormat(datum.x, '%L')");
        });
        it('should return correct template for no timeUnit', function () {
            chai_1.assert.equal(timeunit_1.formatExpression(undefined, 'datum.x', undefined, false), undefined);
        });
        it('should return correct template for YEARMONTH (No comma) with utc scale', function () {
            chai_1.assert.equal(timeunit_1.formatExpression(timeunit_1.TimeUnit.YEARMONTH, 'datum.x', undefined, true), "utcFormat(datum.x, '%b %Y')");
        });
    });
});
//# sourceMappingURL=timeunit.test.js.map