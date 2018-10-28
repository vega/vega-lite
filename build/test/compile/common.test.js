/* tslint:disable:quotemark */
import { mergeTitle, numberFormat, timeFormatExpression } from '../../src/compile/common';
import { defaultConfig } from '../../src/config';
import { vgField } from '../../src/fielddef';
import { TimeUnit } from '../../src/timeunit';
import { NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL } from '../../src/type';
describe('Common', function () {
    describe('timeFormat()', function () {
        it('should get the right time expression for month with shortTimeLabels=true', function () {
            var fieldDef = { timeUnit: TimeUnit.MONTH, field: 'a', type: TEMPORAL };
            var expression = timeFormatExpression(vgField(fieldDef, { expr: 'datum' }), TimeUnit.MONTH, undefined, true, defaultConfig.timeFormat, false);
            expect(expression).toBe("timeFormat(datum[\"month_a\"], '%b')");
        });
        it('should get the right time expression for month with shortTimeLabels=false', function () {
            var fieldDef = { timeUnit: TimeUnit.MONTH, field: 'a', type: TEMPORAL };
            var expression = timeFormatExpression(vgField(fieldDef, { expr: 'datum' }), TimeUnit.MONTH, undefined, false, defaultConfig.timeFormat, false);
            expect(expression).toBe("timeFormat(datum[\"month_a\"], '%B')");
        });
        it('should get the right time expression for yearmonth with custom format', function () {
            var fieldDef = { timeUnit: TimeUnit.YEARMONTH, field: 'a', type: TEMPORAL };
            var expression = timeFormatExpression(vgField(fieldDef, { expr: 'datum' }), TimeUnit.MONTH, '%Y', true, defaultConfig.timeFormat, false);
            expect(expression).toBe("timeFormat(datum[\"yearmonth_a\"], '%Y')");
        });
        it('should get the right time expression for quarter', function () {
            var fieldDef = { timeUnit: TimeUnit.QUARTER, field: 'a', type: TEMPORAL };
            var expression = timeFormatExpression(vgField(fieldDef, { expr: 'datum' }), TimeUnit.QUARTER, undefined, true, defaultConfig.timeFormat, false);
            expect(expression).toBe("'Q' + quarter(datum[\"quarter_a\"])");
        });
        it('should get the right time expression for yearquarter', function () {
            var expression = timeFormatExpression('datum["data"]', TimeUnit.YEARQUARTER, undefined, true, defaultConfig.timeFormat, false);
            expect(expression).toBe("'Q' + quarter(datum[\"data\"]) + ' ' + timeFormat(datum[\"data\"], '%y')");
        });
        it('should get the right time expression for yearmonth with custom format and utc scale type', function () {
            var fieldDef = { timeUnit: TimeUnit.YEARMONTH, field: 'a', type: TEMPORAL };
            var expression = timeFormatExpression(vgField(fieldDef, { expr: 'datum' }), TimeUnit.MONTH, '%Y', true, defaultConfig.timeFormat, true);
            expect(expression).toBe("utcFormat(datum[\"yearmonth_a\"], '%Y')");
        });
    });
    describe('numberFormat()', function () {
        it('should use number format for quantitative scale', function () {
            expect(numberFormat({ field: 'a', type: QUANTITATIVE }, undefined, { numberFormat: 'd' })).toBe('d');
        });
        it('should use number format for ordinal and nominal data but don not use config', function () {
            for (var _i = 0, _a = [ORDINAL, NOMINAL]; _i < _a.length; _i++) {
                var type = _a[_i];
                expect(numberFormat({ field: 'a', type: type }, undefined, { numberFormat: 'd' })).toBeUndefined();
                expect(numberFormat({ field: 'a', type: type }, 'd', { numberFormat: 'd' })).toBe('d');
            }
        });
        it('should support empty number format', function () {
            expect(numberFormat({ field: 'a', type: QUANTITATIVE }, undefined, { numberFormat: '' })).toBe('');
        });
        it('should use format if provided', function () {
            expect(numberFormat({ field: 'a', type: QUANTITATIVE }, 'a', {})).toBe('a');
        });
        it('should not use number format for binned quantitative scale', function () {
            expect(numberFormat({ bin: true, field: 'a', type: QUANTITATIVE }, undefined, {})).toBeUndefined();
        });
        it('should not use number format for temporal scale', function () {
            expect(numberFormat({ bin: true, field: 'a', type: TEMPORAL }, undefined, {})).toBeUndefined();
            expect(numberFormat({ bin: true, field: 'a', type: ORDINAL, timeUnit: 'month' }, undefined, {})).toBeUndefined();
        });
    });
    describe('mergeTitle()', function () {
        it('should drop falsy title(s) when merged', function () {
            expect(mergeTitle('title', null)).toBe('title');
            expect(mergeTitle(null, 'title')).toBe('title');
            expect(mergeTitle(null, null)).toBe(null);
        });
        it('should drop one title when both are the same', function () {
            expect(mergeTitle('title', 'title')).toBe('title');
        });
        it('should join 2 titles with comma when both titles are not falsy and difference', function () {
            expect(mergeTitle('title1', 'title2')).toBe('title1, title2');
        });
    });
});
//# sourceMappingURL=common.test.js.map