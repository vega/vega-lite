/* tslint:disable:quotemark */
import { assert } from 'chai';
import { numberFormat, timeFormatExpression } from '../../src/compile/common';
import { defaultConfig } from '../../src/config';
import { vgField } from '../../src/fielddef';
import { TimeUnit } from '../../src/timeunit';
import { NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL } from '../../src/type';
describe('Common', function () {
    describe('timeFormat()', function () {
        it('should get the right time expression for month with shortTimeLabels=true', function () {
            var fieldDef = { timeUnit: TimeUnit.MONTH, field: 'a', type: TEMPORAL };
            var expression = timeFormatExpression(vgField(fieldDef, { expr: 'datum' }), TimeUnit.MONTH, undefined, true, defaultConfig.timeFormat, false);
            assert.equal(expression, "timeFormat(datum[\"month_a\"], '%b')");
        });
        it('should get the right time expression for month with shortTimeLabels=false', function () {
            var fieldDef = { timeUnit: TimeUnit.MONTH, field: 'a', type: TEMPORAL };
            var expression = timeFormatExpression(vgField(fieldDef, { expr: 'datum' }), TimeUnit.MONTH, undefined, false, defaultConfig.timeFormat, false);
            assert.equal(expression, "timeFormat(datum[\"month_a\"], '%B')");
        });
        it('should get the right time expression for yearmonth with custom format', function () {
            var fieldDef = { timeUnit: TimeUnit.YEARMONTH, field: 'a', type: TEMPORAL };
            var expression = timeFormatExpression(vgField(fieldDef, { expr: 'datum' }), TimeUnit.MONTH, '%Y', true, defaultConfig.timeFormat, false);
            assert.equal(expression, "timeFormat(datum[\"yearmonth_a\"], '%Y')");
        });
        it('should get the right time expression for quarter', function () {
            var fieldDef = { timeUnit: TimeUnit.QUARTER, field: 'a', type: TEMPORAL };
            var expression = timeFormatExpression(vgField(fieldDef, { expr: 'datum' }), TimeUnit.QUARTER, undefined, true, defaultConfig.timeFormat, false);
            assert.equal(expression, "'Q' + quarter(datum[\"quarter_a\"])");
        });
        it('should get the right time expression for yearquarter', function () {
            var expression = timeFormatExpression('datum["data"]', TimeUnit.YEARQUARTER, undefined, true, defaultConfig.timeFormat, false);
            assert.equal(expression, "'Q' + quarter(datum[\"data\"]) + ' ' + timeFormat(datum[\"data\"], '%y')");
        });
        it('should get the right time expression for yearmonth with custom format and utc scale type', function () {
            var fieldDef = { timeUnit: TimeUnit.YEARMONTH, field: 'a', type: TEMPORAL };
            var expression = timeFormatExpression(vgField(fieldDef, { expr: 'datum' }), TimeUnit.MONTH, '%Y', true, defaultConfig.timeFormat, true);
            assert.equal(expression, "utcFormat(datum[\"yearmonth_a\"], '%Y')");
        });
    });
    describe('numberFormat()', function () {
        it('should use number format for quantitative scale', function () {
            assert.equal(numberFormat({ field: 'a', type: QUANTITATIVE }, undefined, { numberFormat: 'd' }), 'd');
        });
        it('should support empty number format', function () {
            assert.equal(numberFormat({ field: 'a', type: QUANTITATIVE }, undefined, { numberFormat: '' }), '');
        });
        it('should use format if provided', function () {
            assert.equal(numberFormat({ field: 'a', type: QUANTITATIVE }, 'a', {}), 'a');
        });
        it('should not use number format for binned quantitative scale', function () {
            assert.equal(numberFormat({ bin: true, field: 'a', type: QUANTITATIVE }, undefined, {}), undefined);
        });
        it('should not use number format for non-quantitative scale', function () {
            for (var _i = 0, _a = [TEMPORAL, NOMINAL, ORDINAL]; _i < _a.length; _i++) {
                var type = _a[_i];
                assert.equal(numberFormat({ bin: true, field: 'a', type: type }, undefined, {}), undefined);
            }
        });
    });
});
//# sourceMappingURL=common.test.js.map