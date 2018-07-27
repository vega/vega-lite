import { assert } from 'chai';
import { containsTimeUnit, convert, fieldExpr, formatExpression, TimeUnit } from '../src/timeunit';
describe('timeUnit', function () {
    describe('containsTimeUnit', function () {
        it('should return true for quarter given quarter', function () {
            var fullTimeUnit = TimeUnit.QUARTER;
            var timeUnit = TimeUnit.QUARTER;
            assert.equal(containsTimeUnit(fullTimeUnit, timeUnit), true);
        });
        it('should return true for yearquarter given quarter', function () {
            var fullTimeUnit = TimeUnit.YEARQUARTER;
            var timeUnit = TimeUnit.QUARTER;
            assert.equal(containsTimeUnit(fullTimeUnit, timeUnit), true);
        });
        it('should return true for SECONDS and MILLISECONDS given SECONDSMILLISECONDS', function () {
            var fullTimeUnit = TimeUnit.SECONDSMILLISECONDS;
            var timeUnit = TimeUnit.SECONDS;
            assert.equal(containsTimeUnit(fullTimeUnit, timeUnit), true);
        });
        it('should return true for MILLISECONDS given SECONDSMILLISECONDS', function () {
            var fullTimeUnit = TimeUnit.SECONDSMILLISECONDS;
            var timeUnit = TimeUnit.MILLISECONDS;
            assert.equal(containsTimeUnit(fullTimeUnit, timeUnit), true);
        });
        it('should return false for quarter given year', function () {
            var fullTimeUnit = TimeUnit.YEAR;
            var timeUnit = TimeUnit.QUARTER;
            assert.equal(containsTimeUnit(fullTimeUnit, timeUnit), false);
        });
        it('should return false for SECONDS given MILLISECONDS', function () {
            var fullTimeUnit = TimeUnit.MILLISECONDS;
            var timeUnit = TimeUnit.SECONDS;
            assert.equal(containsTimeUnit(fullTimeUnit, timeUnit), false);
        });
    });
    describe('fieldExpr', function () {
        it('should return correct field expression for YEARMONTHDATEHOURSMINUTESSECONDS', function () {
            assert.equal(fieldExpr(TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS, 'x'), 'datetime(year(datum["x"]), month(datum["x"]), date(datum["x"]), hours(datum["x"]), minutes(datum["x"]), seconds(datum["x"]), 0)');
        });
        it('should return correct field expression for QUARTER', function () {
            assert.equal(fieldExpr(TimeUnit.QUARTER, 'x'), 'datetime(0, (quarter(datum["x"])-1)*3, 1, 0, 0, 0, 0)');
        });
        it('should return correct field expression for DAY', function () {
            assert.equal(fieldExpr(TimeUnit.DAY, 'x'), 'datetime(2006, 0, day(datum["x"])+1, 0, 0, 0, 0)');
        });
        it('should return correct field expression for MILLISECONDS', function () {
            assert.equal(fieldExpr(TimeUnit.MILLISECONDS, 'x'), 'datetime(0, 0, 1, 0, 0, 0, milliseconds(datum["x"]))');
        });
        it('should return correct field expression with utc for MILLISECONDS', function () {
            assert.equal(fieldExpr(TimeUnit.UTCQUARTER, 'x'), 'datetime(0, (utcquarter(datum["x"])-1)*3, 1, 0, 0, 0, 0)');
            assert.equal(fieldExpr(TimeUnit.UTCMILLISECONDS, 'x'), 'datetime(0, 0, 1, 0, 0, 0, utcmilliseconds(datum["x"]))');
        });
    });
    describe('convert', function () {
        it('should throw an error for the DAY timeunit', function () {
            assert.throws(function () {
                convert(TimeUnit.DAY, new Date(2000, 11, 2, 23, 59, 59, 999));
            }, Error, "Cannot convert to TimeUnits containing 'day'");
        });
        it('should return expected result for YEARQUARTER', function () {
            var date = convert(TimeUnit.YEARQUARTER, new Date(2000, 11, 2, 23, 59, 59, 999));
            assert.equal(date.getTime(), new Date(2000, 9, 1, 0, 0, 0, 0).getTime());
        });
        it('should return expected result for UTCYEARQUARTER', function () {
            var date = convert(TimeUnit.UTCYEARQUARTER, new Date(Date.UTC(2000, 11, 2, 23, 59, 59, 999)));
            assert.equal(date.getTime(), new Date(Date.UTC(2000, 9, 1, 0, 0, 0, 0)).getTime());
        });
        it('should return expected result for YEARQUARTERMONTH', function () {
            var date = convert(TimeUnit.YEARQUARTERMONTH, new Date(2000, 11, 2, 23, 59, 59, 999));
            assert.equal(date.getTime(), new Date(2000, 11, 1, 0, 0, 0, 0).getTime());
        });
        it('should return expected result for YEARMONTH', function () {
            var date = convert(TimeUnit.YEARMONTH, new Date(2000, 11, 2, 23, 59, 59, 999));
            assert.equal(date.getTime(), new Date(2000, 11, 1, 0, 0, 0, 0).getTime());
        });
        it('should return expected result for UTCYEARMONTH', function () {
            var date = convert(TimeUnit.UTCYEARMONTH, new Date(Date.UTC(2000, 11, 2, 23, 59, 59, 999)));
            assert.equal(date.getTime(), new Date(Date.UTC(2000, 11, 1, 0, 0, 0, 0)).getTime());
        });
        it('should return expected result for UTCYEARMONTH', function () {
            var date = convert(TimeUnit.UTCYEAR, new Date(Date.UTC(2000, 11, 2, 23, 59, 59, 999)));
            assert.equal(date.getTime(), new Date(Date.UTC(2000, 0, 1, 0, 0, 0, 0)).getTime());
        });
        it('should return expected result for YEARMONTHDATE', function () {
            var date = convert(TimeUnit.YEARMONTHDATE, new Date(2000, 11, 2, 23, 59, 59, 999));
            assert.equal(date.getTime(), new Date(2000, 11, 2, 0, 0, 0, 0).getTime());
        });
        it('should return expected result for YEARMONTHDATEHOURS', function () {
            var date = convert(TimeUnit.YEARMONTHDATEHOURS, new Date(2000, 11, 2, 23, 59, 59, 999));
            assert.equal(date.getTime(), new Date(2000, 11, 2, 23, 0, 0, 0).getTime());
        });
        it('should return expected result for YEARMONTHDATEHOURSMINUTES', function () {
            var date = convert(TimeUnit.YEARMONTHDATEHOURSMINUTES, new Date(2000, 11, 2, 23, 59, 59, 999));
            assert.equal(date.getTime(), new Date(2000, 11, 2, 23, 59, 0, 0).getTime());
        });
        it('should return expected result for YEARMONTHDATEHOURSMINUTESSECONDS', function () {
            var date = convert(TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS, new Date(2000, 11, 2, 23, 59, 59, 999));
            assert.equal(date.getTime(), new Date(2000, 11, 2, 23, 59, 59, 0).getTime());
        });
        it('should return expected result for QUARTERMONTH', function () {
            var date = convert(TimeUnit.QUARTERMONTH, new Date(2000, 11, 2, 23, 59, 59, 999));
            assert.equal(date.getTime(), new Date(1900, 11, 1, 0, 0, 0, 0).getTime());
        });
        it('should return expected result for HOURSMINUTES', function () {
            var date = convert(TimeUnit.HOURSMINUTES, new Date(2000, 11, 2, 23, 59, 59, 999));
            assert.equal(date.getTime(), new Date(1900, 0, 1, 23, 59, 0, 0).getTime());
        });
        it('should return expected result for HOURSMINUTESSECONDS', function () {
            var date = convert(TimeUnit.HOURSMINUTESSECONDS, new Date(2000, 11, 2, 23, 59, 59, 999));
            assert.equal(date.getTime(), new Date(1900, 0, 1, 23, 59, 59, 0).getTime());
        });
        it('should return expected result for MINUTESSECONDS', function () {
            var date = convert(TimeUnit.MINUTESSECONDS, new Date(2000, 11, 2, 23, 59, 59, 999));
            assert.equal(date.getTime(), new Date(1900, 0, 1, 0, 59, 59, 0).getTime());
        });
        it('should return expected result for SECONDSMILLISECONDS', function () {
            var date = convert(TimeUnit.SECONDSMILLISECONDS, new Date(2000, 11, 2, 23, 59, 59, 999));
            assert.equal(date.getTime(), new Date(1900, 0, 1, 0, 0, 59, 999).getTime());
        });
    });
    describe('template', function () {
        it('should return correct template for YEARMONTHDATEHOURSMINUTESSECONDS', function () {
            assert.equal(formatExpression(TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS, 'datum.x', undefined, false), "timeFormat(datum.x, '%b %d, %Y %H:%M:%S')");
        });
        it('should return correct template for YEARMONTH (No comma)', function () {
            assert.equal(formatExpression(TimeUnit.YEARMONTH, 'datum.x', undefined, false), "timeFormat(datum.x, '%b %Y')");
        });
        it('should return correct template for DAY', function () {
            assert.equal(formatExpression(TimeUnit.DAY, 'datum.x', undefined, false), "timeFormat(datum.x, '%A')");
        });
        it('should return correct template for DAY (shortened)', function () {
            assert.equal(formatExpression(TimeUnit.DAY, 'datum.x', true, false), "timeFormat(datum.x, '%a')");
        });
        it('should return correct template for QUARTER', function () {
            assert.equal(formatExpression(TimeUnit.QUARTER, 'datum.x', undefined, false), "'Q' + quarter(datum.x)");
        });
        it('should return correct template for YEARQUARTER', function () {
            assert.equal(formatExpression(TimeUnit.YEARQUARTER, 'datum.x', undefined, false), "'Q' + quarter(datum.x) + ' ' + timeFormat(datum.x, '%Y')");
        });
        it('should return correct template for milliseconds', function () {
            assert.equal(formatExpression(TimeUnit.MILLISECONDS, 'datum.x', undefined, false), "timeFormat(datum.x, '%L')");
        });
        it('should return correct template for no timeUnit', function () {
            assert.equal(formatExpression(undefined, 'datum.x', undefined, false), undefined);
        });
        it('should return correct template for YEARMONTH (No comma) with utc scale', function () {
            assert.equal(formatExpression(TimeUnit.YEARMONTH, 'datum.x', undefined, true), "utcFormat(datum.x, '%b %Y')");
        });
    });
});
//# sourceMappingURL=timeunit.test.js.map