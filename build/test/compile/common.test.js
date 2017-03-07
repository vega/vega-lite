/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../../src/channel");
var config_1 = require("../../src/config");
var timeunit_1 = require("../../src/timeunit");
var fielddef_1 = require("../../src/fielddef");
var type_1 = require("../../src/type");
var common_1 = require("../../src/compile/common");
describe('Common', function () {
    describe('timeFormat()', function () {
        it('should get the right time expression for month with shortTimeLabels=true', function () {
            var fieldDef = { timeUnit: timeunit_1.TimeUnit.MONTH, field: 'a', type: type_1.TEMPORAL };
            var expression = common_1.timeFormatExpression(fielddef_1.field(fieldDef, { datum: true }), timeunit_1.TimeUnit.MONTH, undefined, true, config_1.defaultConfig.timeFormat);
            chai_1.assert.equal(expression, "timeFormat(datum[\"month_a\"], '%b')");
        });
        it('should get the right time expression for month with shortTimeLabels=false', function () {
            var fieldDef = { timeUnit: timeunit_1.TimeUnit.MONTH, field: 'a', type: type_1.TEMPORAL };
            var expression = common_1.timeFormatExpression(fielddef_1.field(fieldDef, { datum: true }), timeunit_1.TimeUnit.MONTH, undefined, false, config_1.defaultConfig.timeFormat);
            chai_1.assert.equal(expression, "timeFormat(datum[\"month_a\"], '%B')");
        });
        it('should get the right time expression for yearmonth with custom format', function () {
            var fieldDef = { timeUnit: timeunit_1.TimeUnit.YEARMONTH, field: 'a', type: type_1.TEMPORAL };
            var expression = common_1.timeFormatExpression(fielddef_1.field(fieldDef, { datum: true }), timeunit_1.TimeUnit.MONTH, '%Y', true, config_1.defaultConfig.timeFormat);
            chai_1.assert.equal(expression, "timeFormat(datum[\"yearmonth_a\"], '%Y')");
        });
        it('should get the right time expression for quarter', function () {
            var fieldDef = { timeUnit: timeunit_1.TimeUnit.QUARTER, field: 'a', type: type_1.TEMPORAL };
            var expression = common_1.timeFormatExpression(fielddef_1.field(fieldDef, { datum: true }), timeunit_1.TimeUnit.QUARTER, undefined, true, config_1.defaultConfig.timeFormat);
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
            chai_1.assert.equal(common_1.numberFormat({ field: 'a', type: type_1.QUANTITATIVE }, 'a', 'd', channel_1.X), 'a');
        });
        it('should not use number format for binned quantitative scale', function () {
            chai_1.assert.equal(common_1.numberFormat({ bin: true, field: 'a', type: type_1.QUANTITATIVE }, undefined, 'd', channel_1.X), undefined);
        });
        it('should not use number format for non-quantitative scale', function () {
            for (var _i = 0, _a = [type_1.TEMPORAL, type_1.NOMINAL, type_1.ORDINAL]; _i < _a.length; _i++) {
                var type = _a[_i];
                chai_1.assert.equal(common_1.numberFormat({ bin: true, field: 'a', type: type }, undefined, 'd', channel_1.X), undefined);
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi90ZXN0L2NvbXBpbGUvY29tbW9uLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOEJBQThCOzs7QUFFOUIsNkJBQTRCO0FBQzVCLDZDQUFvQztBQUNwQywyQ0FBK0M7QUFDL0MsK0NBQTRDO0FBQzVDLCtDQUFtRDtBQUNuRCx1Q0FBd0U7QUFDeEUsbURBQTRFO0FBRTVFLFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFDakIsUUFBUSxDQUFDLGNBQWMsRUFBRTtRQUN2QixFQUFFLENBQUMsMEVBQTBFLEVBQUU7WUFDN0UsSUFBTSxRQUFRLEdBQWEsRUFBQyxRQUFRLEVBQUUsbUJBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsZUFBUSxFQUFDLENBQUM7WUFDbEYsSUFBTSxVQUFVLEdBQUcsNkJBQW9CLENBQUMsZ0JBQUssQ0FBQyxRQUFRLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFDLENBQUMsRUFBRSxtQkFBUSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLHNCQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbkksYUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsc0NBQW9DLENBQUMsQ0FBQztRQUNqRSxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyRUFBMkUsRUFBRTtZQUM5RSxJQUFNLFFBQVEsR0FBYSxFQUFDLFFBQVEsRUFBRSxtQkFBUSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxlQUFRLEVBQUMsQ0FBQztZQUNsRixJQUFNLFVBQVUsR0FBRyw2QkFBb0IsQ0FBQyxnQkFBSyxDQUFDLFFBQVEsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQyxFQUFFLG1CQUFRLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVB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