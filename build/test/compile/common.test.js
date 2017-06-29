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
            var expression = common_1.timeFormatExpression(fielddef_1.field(fieldDef, { expr: 'datum' }), timeunit_1.TimeUnit.MONTH, undefined, true, config_1.defaultConfig.timeFormat, false);
            chai_1.assert.equal(expression, "timeFormat(datum[\"month_a\"], '%b')");
        });
        it('should get the right time expression for month with shortTimeLabels=false', function () {
            var fieldDef = { timeUnit: timeunit_1.TimeUnit.MONTH, field: 'a', type: type_1.TEMPORAL };
            var expression = common_1.timeFormatExpression(fielddef_1.field(fieldDef, { expr: 'datum' }), timeunit_1.TimeUnit.MONTH, undefined, false, config_1.defaultConfig.timeFormat, false);
            chai_1.assert.equal(expression, "timeFormat(datum[\"month_a\"], '%B')");
        });
        it('should get the right time expression for yearmonth with custom format', function () {
            var fieldDef = { timeUnit: timeunit_1.TimeUnit.YEARMONTH, field: 'a', type: type_1.TEMPORAL };
            var expression = common_1.timeFormatExpression(fielddef_1.field(fieldDef, { expr: 'datum' }), timeunit_1.TimeUnit.MONTH, '%Y', true, config_1.defaultConfig.timeFormat, false);
            chai_1.assert.equal(expression, "timeFormat(datum[\"yearmonth_a\"], '%Y')");
        });
        it('should get the right time expression for quarter', function () {
            var fieldDef = { timeUnit: timeunit_1.TimeUnit.QUARTER, field: 'a', type: type_1.TEMPORAL };
            var expression = common_1.timeFormatExpression(fielddef_1.field(fieldDef, { expr: 'datum' }), timeunit_1.TimeUnit.QUARTER, undefined, true, config_1.defaultConfig.timeFormat, false);
            chai_1.assert.equal(expression, "'Q' + quarter(datum[\"quarter_a\"])");
        });
        it('should get the right time expression for yearquarter', function () {
            var expression = common_1.timeFormatExpression('datum["data"]', timeunit_1.TimeUnit.YEARQUARTER, undefined, true, config_1.defaultConfig.timeFormat, false);
            chai_1.assert.equal(expression, "'Q' + quarter(datum[\"data\"]) + ' ' + timeFormat(datum[\"data\"], '%y')");
        });
        it('should get the right time expression for yearmonth with custom format and utc scale type', function () {
            var fieldDef = { timeUnit: timeunit_1.TimeUnit.YEARMONTH, field: 'a', type: type_1.TEMPORAL };
            var expression = common_1.timeFormatExpression(fielddef_1.field(fieldDef, { expr: 'datum' }), timeunit_1.TimeUnit.MONTH, '%Y', true, config_1.defaultConfig.timeFormat, true);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi90ZXN0L2NvbXBpbGUvY29tbW9uLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBRTVCLG1EQUE0RTtBQUM1RSwyQ0FBK0M7QUFDL0MsK0NBQW1EO0FBQ25ELCtDQUE0QztBQUM1Qyx1Q0FBd0U7QUFFeEUsUUFBUSxDQUFDLFFBQVEsRUFBRTtJQUNqQixRQUFRLENBQUMsY0FBYyxFQUFFO1FBQ3ZCLEVBQUUsQ0FBQywwRUFBMEUsRUFBRTtZQUM3RSxJQUFNLFFBQVEsR0FBRyxFQUFDLFFBQVEsRUFBRSxtQkFBUSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxlQUFRLEVBQUMsQ0FBQztZQUN4RSxJQUFNLFVBQVUsR0FBRyw2QkFBb0IsQ0FBQyxnQkFBSyxDQUFDLFFBQVEsRUFBRSxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUMsQ0FBQyxFQUFFLG1CQUFRLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsc0JBQWEsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDNUksYUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsc0NBQW9DLENBQUMsQ0FBQztRQUNqRSxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyRUFBMkUsRUFBRTtZQUM5RSxJQUFNLFFBQVEsR0FBRyxFQUFDLFFBQVEsRUFBRSxtQkFBUSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxlQUFRLEVBQUMsQ0FBQztZQUN4RSxJQUFNLFVBQVUsR0FBRyw2QkFBb0IsQ0FBQyxnQkFBSyxDQUFDLFFBQVEsRUFBRSxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUMsQ0FBQyxFQUFFLG1CQUFRLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUs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