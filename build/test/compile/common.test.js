"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var common_1 = require("../../src/compile/common");
var config_1 = require("../../src/config");
var fielddef_1 = require("../../src/fielddef");
var timeunit_1 = require("../../src/timeunit");
var type_1 = require("../../src/type");
describe('Common', function () {
    describe('timeFormat()', function () {
        it('should get the right time expression for month with shortTimeLabels=true', function () {
            var fieldDef = { timeUnit: timeunit_1.TimeUnit.MONTH, field: 'a', type: type_1.TEMPORAL };
            var expression = common_1.timeFormatExpression(fielddef_1.vgField(fieldDef, { expr: 'datum' }), timeunit_1.TimeUnit.MONTH, undefined, true, config_1.defaultConfig.timeFormat, false);
            chai_1.assert.equal(expression, "timeFormat(datum[\"month_a\"], '%b')");
        });
        it('should get the right time expression for month with shortTimeLabels=false', function () {
            var fieldDef = { timeUnit: timeunit_1.TimeUnit.MONTH, field: 'a', type: type_1.TEMPORAL };
            var expression = common_1.timeFormatExpression(fielddef_1.vgField(fieldDef, { expr: 'datum' }), timeunit_1.TimeUnit.MONTH, undefined, false, config_1.defaultConfig.timeFormat, false);
            chai_1.assert.equal(expression, "timeFormat(datum[\"month_a\"], '%B')");
        });
        it('should get the right time expression for yearmonth with custom format', function () {
            var fieldDef = { timeUnit: timeunit_1.TimeUnit.YEARMONTH, field: 'a', type: type_1.TEMPORAL };
            var expression = common_1.timeFormatExpression(fielddef_1.vgField(fieldDef, { expr: 'datum' }), timeunit_1.TimeUnit.MONTH, '%Y', true, config_1.defaultConfig.timeFormat, false);
            chai_1.assert.equal(expression, "timeFormat(datum[\"yearmonth_a\"], '%Y')");
        });
        it('should get the right time expression for quarter', function () {
            var fieldDef = { timeUnit: timeunit_1.TimeUnit.QUARTER, field: 'a', type: type_1.TEMPORAL };
            var expression = common_1.timeFormatExpression(fielddef_1.vgField(fieldDef, { expr: 'datum' }), timeunit_1.TimeUnit.QUARTER, undefined, true, config_1.defaultConfig.timeFormat, false);
            chai_1.assert.equal(expression, "'Q' + quarter(datum[\"quarter_a\"])");
        });
        it('should get the right time expression for yearquarter', function () {
            var expression = common_1.timeFormatExpression('datum["data"]', timeunit_1.TimeUnit.YEARQUARTER, undefined, true, config_1.defaultConfig.timeFormat, false);
            chai_1.assert.equal(expression, "'Q' + quarter(datum[\"data\"]) + ' ' + timeFormat(datum[\"data\"], '%y')");
        });
        it('should get the right time expression for yearmonth with custom format and utc scale type', function () {
            var fieldDef = { timeUnit: timeunit_1.TimeUnit.YEARMONTH, field: 'a', type: type_1.TEMPORAL };
            var expression = common_1.timeFormatExpression(fielddef_1.vgField(fieldDef, { expr: 'datum' }), timeunit_1.TimeUnit.MONTH, '%Y', true, config_1.defaultConfig.timeFormat, true);
            chai_1.assert.equal(expression, "utcFormat(datum[\"yearmonth_a\"], '%Y')");
        });
    });
    describe('numberFormat()', function () {
        it('should use number format for quantitative scale', function () {
            chai_1.assert.equal(common_1.numberFormat({ field: 'a', type: type_1.QUANTITATIVE }, undefined, { numberFormat: 'd' }), 'd');
        });
        it('should support empty number format', function () {
            chai_1.assert.equal(common_1.numberFormat({ field: 'a', type: type_1.QUANTITATIVE }, undefined, { numberFormat: '' }), '');
        });
        it('should use format if provided', function () {
            chai_1.assert.equal(common_1.numberFormat({ field: 'a', type: type_1.QUANTITATIVE }, 'a', {}), 'a');
        });
        it('should not use number format for binned quantitative scale', function () {
            chai_1.assert.equal(common_1.numberFormat({ bin: true, field: 'a', type: type_1.QUANTITATIVE }, undefined, {}), undefined);
        });
        it('should not use number format for non-quantitative scale', function () {
            for (var _i = 0, _a = [type_1.TEMPORAL, type_1.NOMINAL, type_1.ORDINAL]; _i < _a.length; _i++) {
                var type = _a[_i];
                chai_1.assert.equal(common_1.numberFormat({ bin: true, field: 'a', type: type }, undefined, {}), undefined);
            }
        });
    });
});
//# sourceMappingURL=common.test.js.map