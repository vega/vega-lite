import { containsTimeUnit, convert, fieldExpr, formatExpression, TimeUnit } from '../src/timeunit';
describe('timeUnit', () => {
    describe('containsTimeUnit', () => {
        it('should return true for quarter given quarter', () => {
            const fullTimeUnit = TimeUnit.QUARTER;
            const timeUnit = TimeUnit.QUARTER;
            expect(containsTimeUnit(fullTimeUnit, timeUnit)).toBe(true);
        });
        it('should return true for yearquarter given quarter', () => {
            const fullTimeUnit = TimeUnit.YEARQUARTER;
            const timeUnit = TimeUnit.QUARTER;
            expect(containsTimeUnit(fullTimeUnit, timeUnit)).toBe(true);
        });
        it('should return true for SECONDS and MILLISECONDS given SECONDSMILLISECONDS', () => {
            const fullTimeUnit = TimeUnit.SECONDSMILLISECONDS;
            const timeUnit = TimeUnit.SECONDS;
            expect(containsTimeUnit(fullTimeUnit, timeUnit)).toBe(true);
        });
        it('should return true for MILLISECONDS given SECONDSMILLISECONDS', () => {
            const fullTimeUnit = TimeUnit.SECONDSMILLISECONDS;
            const timeUnit = TimeUnit.MILLISECONDS;
            expect(containsTimeUnit(fullTimeUnit, timeUnit)).toBe(true);
        });
        it('should return false for quarter given year', () => {
            const fullTimeUnit = TimeUnit.YEAR;
            const timeUnit = TimeUnit.QUARTER;
            expect(containsTimeUnit(fullTimeUnit, timeUnit)).toBeFalsy();
        });
        it('should return false for SECONDS given MILLISECONDS', () => {
            const fullTimeUnit = TimeUnit.MILLISECONDS;
            const timeUnit = TimeUnit.SECONDS;
            expect(containsTimeUnit(fullTimeUnit, timeUnit)).toBeFalsy();
        });
    });
    describe('fieldExpr', () => {
        it('should return correct field expression for YEARMONTHDATEHOURSMINUTESSECONDS', () => {
            expect(fieldExpr(TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS, 'x')).toBe('datetime(year(datum["x"]), month(datum["x"]), date(datum["x"]), hours(datum["x"]), minutes(datum["x"]), seconds(datum["x"]), 0)');
        });
        it('should return correct field expression for QUARTER', () => {
            expect(fieldExpr(TimeUnit.QUARTER, 'x')).toBe('datetime(0, (quarter(datum["x"])-1)*3, 1, 0, 0, 0, 0)');
        });
        it('should return correct field expression for DAY', () => {
            expect(fieldExpr(TimeUnit.DAY, 'x')).toBe('datetime(2006, 0, day(datum["x"])+1, 0, 0, 0, 0)');
        });
        it('should return correct field expression for MILLISECONDS', () => {
            expect(fieldExpr(TimeUnit.MILLISECONDS, 'x')).toBe('datetime(0, 0, 1, 0, 0, 0, milliseconds(datum["x"]))');
        });
        it('should return correct field expression for MONTHDATE', () => {
            expect(fieldExpr(TimeUnit.MONTHDATE, 'x')).toBe('datetime(0, month(datum["x"]), date(datum["x"]), 0, 0, 0, 0)');
        });
        it('should return correct field expression with utc for MILLISECONDS', () => {
            expect(fieldExpr(TimeUnit.UTCQUARTER, 'x')).toBe('datetime(0, (utcquarter(datum["x"])-1)*3, 1, 0, 0, 0, 0)');
            expect(fieldExpr(TimeUnit.UTCMILLISECONDS, 'x')).toBe('datetime(0, 0, 1, 0, 0, 0, utcmilliseconds(datum["x"]))');
        });
    });
    describe('convert', () => {
        it('should throw an error for the DAY timeunit', () => {
            expect(() => {
                convert(TimeUnit.DAY, new Date(2000, 11, 2, 23, 59, 59, 999));
            }).toThrowError("Cannot convert to TimeUnits containing 'day'");
        });
        it('should return expected result for YEARQUARTER', () => {
            const date = convert(TimeUnit.YEARQUARTER, new Date(2000, 11, 2, 23, 59, 59, 999));
            expect(date.getTime()).toBe(new Date(2000, 9, 1, 0, 0, 0, 0).getTime());
        });
        it('should return expected result for UTCYEARQUARTER', () => {
            const date = convert(TimeUnit.UTCYEARQUARTER, new Date(Date.UTC(2000, 11, 2, 23, 59, 59, 999)));
            expect(date.getTime()).toBe(new Date(Date.UTC(2000, 9, 1, 0, 0, 0, 0)).getTime());
        });
        it('should return expected result for YEARQUARTERMONTH', () => {
            const date = convert(TimeUnit.YEARQUARTERMONTH, new Date(2000, 11, 2, 23, 59, 59, 999));
            expect(date.getTime()).toBe(new Date(2000, 11, 1, 0, 0, 0, 0).getTime());
        });
        it('should return expected result for YEARMONTH', () => {
            const date = convert(TimeUnit.YEARMONTH, new Date(2000, 11, 2, 23, 59, 59, 999));
            expect(date.getTime()).toBe(new Date(2000, 11, 1, 0, 0, 0, 0).getTime());
        });
        it('should return expected result for UTCYEARMONTH', () => {
            const date = convert(TimeUnit.UTCYEARMONTH, new Date(Date.UTC(2000, 11, 2, 23, 59, 59, 999)));
            expect(date.getTime()).toBe(new Date(Date.UTC(2000, 11, 1, 0, 0, 0, 0)).getTime());
        });
        it('should return expected result for UTCYEARMONTH', () => {
            const date = convert(TimeUnit.UTCYEAR, new Date(Date.UTC(2000, 11, 2, 23, 59, 59, 999)));
            expect(date.getTime()).toBe(new Date(Date.UTC(2000, 0, 1, 0, 0, 0, 0)).getTime());
        });
        it('should return expected result for YEARMONTHDATE', () => {
            const date = convert(TimeUnit.YEARMONTHDATE, new Date(2000, 11, 2, 23, 59, 59, 999));
            expect(date.getTime()).toBe(new Date(2000, 11, 2, 0, 0, 0, 0).getTime());
        });
        it('should return expected result for YEARMONTHDATEHOURS', () => {
            const date = convert(TimeUnit.YEARMONTHDATEHOURS, new Date(2000, 11, 2, 23, 59, 59, 999));
            expect(date.getTime()).toBe(new Date(2000, 11, 2, 23, 0, 0, 0).getTime());
        });
        it('should return expected result for YEARMONTHDATEHOURSMINUTES', () => {
            const date = convert(TimeUnit.YEARMONTHDATEHOURSMINUTES, new Date(2000, 11, 2, 23, 59, 59, 999));
            expect(date.getTime()).toBe(new Date(2000, 11, 2, 23, 59, 0, 0).getTime());
        });
        it('should return expected result for YEARMONTHDATEHOURSMINUTESSECONDS', () => {
            const date = convert(TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS, new Date(2000, 11, 2, 23, 59, 59, 999));
            expect(date.getTime()).toBe(new Date(2000, 11, 2, 23, 59, 59, 0).getTime());
        });
        it('should return expected result for QUARTERMONTH', () => {
            const date = convert(TimeUnit.QUARTERMONTH, new Date(2000, 11, 2, 23, 59, 59, 999));
            expect(date.getTime()).toBe(new Date(1972, 11, 1, 0, 0, 0, 0).getTime());
        });
        it('should return expected result for HOURSMINUTES', () => {
            const date = convert(TimeUnit.HOURSMINUTES, new Date(2000, 11, 2, 23, 59, 59, 999));
            expect(date.getTime()).toBe(new Date(1972, 0, 1, 23, 59, 0, 0).getTime());
        });
        it('should return expected result for HOURSMINUTESSECONDS', () => {
            const date = convert(TimeUnit.HOURSMINUTESSECONDS, new Date(2000, 11, 2, 23, 59, 59, 999));
            expect(date.getTime()).toBe(new Date(1972, 0, 1, 23, 59, 59, 0).getTime());
        });
        it('should return expected result for MINUTESSECONDS', () => {
            const date = convert(TimeUnit.MINUTESSECONDS, new Date(2000, 11, 2, 23, 59, 59, 999));
            expect(date.getTime()).toBe(new Date(1972, 0, 1, 0, 59, 59, 0).getTime());
        });
        it('should return expected result for SECONDSMILLISECONDS', () => {
            const date = convert(TimeUnit.SECONDSMILLISECONDS, new Date(2000, 11, 2, 23, 59, 59, 999));
            expect(date.getTime()).toBe(new Date(1972, 0, 1, 0, 0, 59, 999).getTime());
        });
        it('should return expected result for MONTHDATE', () => {
            const date = convert(TimeUnit.MONTHDATE, new Date(2000, 11, 2, 23, 59, 59, 999));
            expect(date.getTime()).toBe(new Date(1972, 11, 2, 0, 0, 0, 0).getTime());
        });
    });
    describe('template', () => {
        it('should return correct template for YEARMONTHDATEHOURSMINUTESSECONDS', () => {
            expect(formatExpression(TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS, 'datum.x', undefined, false)).toBe("timeFormat(datum.x, '%b %d, %Y %H:%M:%S')");
        });
        it('should return correct template for YEARMONTH (No comma)', () => {
            expect(formatExpression(TimeUnit.YEARMONTH, 'datum.x', undefined, false)).toBe("timeFormat(datum.x, '%b %Y')");
        });
        it('should return correct template for DAY', () => {
            expect(formatExpression(TimeUnit.DAY, 'datum.x', undefined, false)).toBe("timeFormat(datum.x, '%A')");
        });
        it('should return correct template for DAY (shortened)', () => {
            expect(formatExpression(TimeUnit.DAY, 'datum.x', true, false)).toBe("timeFormat(datum.x, '%a')");
        });
        it('should return correct template for QUARTER', () => {
            expect(formatExpression(TimeUnit.QUARTER, 'datum.x', undefined, false)).toBe("'Q' + quarter(datum.x)");
        });
        it('should return correct template for YEARQUARTER', () => {
            expect(formatExpression(TimeUnit.YEARQUARTER, 'datum.x', undefined, false)).toBe("'Q' + quarter(datum.x) + ' ' + timeFormat(datum.x, '%Y')");
        });
        it('should return correct template for milliseconds', () => {
            expect(formatExpression(TimeUnit.MILLISECONDS, 'datum.x', undefined, false)).toBe("timeFormat(datum.x, '%L')");
        });
        it('should return correct template for no timeUnit', () => {
            expect(formatExpression(undefined, 'datum.x', undefined, false)).toBeUndefined();
        });
        it('should return correct template for YEARMONTH (No comma) with utc scale', () => {
            expect(formatExpression(TimeUnit.YEARMONTH, 'datum.x', undefined, true)).toBe("utcFormat(datum.x, '%b %Y')");
        });
    });
});
//# sourceMappingURL=timeunit.test.js.map