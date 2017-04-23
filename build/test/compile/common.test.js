/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../../src/channel");
var common_1 = require("../../src/compile/common");
var config_1 = require("../../src/config");
var fielddef_1 = require("../../src/fielddef");
var timeunit_1 = require("../../src/timeunit");
var type_1 = require("../../src/type");
describe('Common', function () {
    describe('timeFormat()', function () {
        it('should get the right time expression for month with shortTimeLabels=true', function () {
            var fieldDef = { timeUnit: timeunit_1.TimeUnit.MONTH, field: 'a', type: type_1.TEMPORAL };
            var expression = common_1.timeFormatExpression(fielddef_1.field(fieldDef, { expr: 'datum' }), timeunit_1.TimeUnit.MONTH, undefined, true, config_1.defaultConfig.timeFormat);
            chai_1.assert.equal(expression, "timeFormat(datum[\"month_a\"], '%b')");
        });
        it('should get the right time expression for month with shortTimeLabels=false', function () {
            var fieldDef = { timeUnit: timeunit_1.TimeUnit.MONTH, field: 'a', type: type_1.TEMPORAL };
            var expression = common_1.timeFormatExpression(fielddef_1.field(fieldDef, { expr: 'datum' }), timeunit_1.TimeUnit.MONTH, undefined, false, config_1.defaultConfig.timeFormat);
            chai_1.assert.equal(expression, "timeFormat(datum[\"month_a\"], '%B')");
        });
        it('should get the right time expression for yearmonth with custom format', function () {
            var fieldDef = { timeUnit: timeunit_1.TimeUnit.YEARMONTH, field: 'a', type: type_1.TEMPORAL };
            var expression = common_1.timeFormatExpression(fielddef_1.field(fieldDef, { expr: 'datum' }), timeunit_1.TimeUnit.MONTH, '%Y', true, config_1.defaultConfig.timeFormat);
            chai_1.assert.equal(expression, "timeFormat(datum[\"yearmonth_a\"], '%Y')");
        });
        it('should get the right time expression for quarter', function () {
            var fieldDef = { timeUnit: timeunit_1.TimeUnit.QUARTER, field: 'a', type: type_1.TEMPORAL };
            var expression = common_1.timeFormatExpression(fielddef_1.field(fieldDef, { expr: 'datum' }), timeunit_1.TimeUnit.QUARTER, undefined, true, config_1.defaultConfig.timeFormat);
            chai_1.assert.equal(expression, "'Q' + quarter(datum[\"quarter_a\"])");
        });
        it('should get the right time expression for yearquarter', function () {
            var expression = common_1.timeFormatExpression('datum["data"]', timeunit_1.TimeUnit.YEARQUARTER, undefined, true, config_1.defaultConfig.timeFormat);
            chai_1.assert.equal(expression, "'Q' + quarter(datum[\"data\"]) + ' ' + timeFormat(datum[\"data\"], '%y')");
        });
    });
    describe('numberFormat()', function () {
        it('should use number format for quantitative scale', function () {
            chai_1.assert.equal(common_1.numberFormat({ field: 'a', type: type_1.QUANTITATIVE }, undefined, { numberFormat: 'd' }, channel_1.X), 'd');
        });
        it('should support empty number format', function () {
            chai_1.assert.equal(common_1.numberFormat({ field: 'a', type: type_1.QUANTITATIVE }, undefined, { numberFormat: '' }, channel_1.X), '');
        });
        it('should use format if provided', function () {
            chai_1.assert.equal(common_1.numberFormat({ field: 'a', type: type_1.QUANTITATIVE }, 'a', {}, channel_1.X), 'a');
        });
        it('should not use number format for binned quantitative scale', function () {
            chai_1.assert.equal(common_1.numberFormat({ bin: true, field: 'a', type: type_1.QUANTITATIVE }, undefined, {}, channel_1.X), undefined);
        });
        it('should not use number format for non-quantitative scale', function () {
            for (var _i = 0, _a = [type_1.TEMPORAL, type_1.NOMINAL, type_1.ORDINAL]; _i < _a.length; _i++) {
                var type = _a[_i];
                chai_1.assert.equal(common_1.numberFormat({ bin: true, field: 'a', type: type }, undefined, {}, channel_1.X), undefined);
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi90ZXN0L2NvbXBpbGUvY29tbW9uLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOEJBQThCOzs7QUFFOUIsNkJBQTRCO0FBQzVCLDZDQUFvQztBQUNwQyxtREFBNEU7QUFDNUUsMkNBQStDO0FBQy9DLCtDQUFtRDtBQUNuRCwrQ0FBNEM7QUFDNUMsdUNBQXdFO0FBRXhFLFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFDakIsUUFBUSxDQUFDLGNBQWMsRUFBRTtRQUN2QixFQUFFLENBQUMsMEVBQTBFLEVBQUU7WUFDN0UsSUFBTSxRQUFRLEdBQUcsRUFBQyxRQUFRLEVBQUUsbUJBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsZUFBUSxFQUFDLENBQUM7WUFDeEUsSUFBTSxVQUFVLEdBQUcsNkJBQW9CLENBQUMsZ0JBQUssQ0FBQyxRQUFRLEVBQUUsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFDLENBQUMsRUFBRSxtQkFBUSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLHNCQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDckksYUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsc0NBQW9DLENBQUMsQ0FBQztRQUNqRSxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyRUFBMkUsRUFBRTtZQUM5RSxJQUFNLFFBQVEsR0FBRyxFQUFDLFFBQVEsRUFBRSxtQkFBUSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxlQUFRLEVBQUMsQ0FBQztZQUN4RSxJQUFNLFVBQVUsR0FBRyw2QkFBb0IsQ0FBQyxnQkFBSyxDQUFDLFFBQVEsRUFBRSxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUMsQ0FBQyxFQUFFLG1CQUFRLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVB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