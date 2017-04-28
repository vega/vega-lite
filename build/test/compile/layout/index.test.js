"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../../util");
var channel_1 = require("../../../src/channel");
var layout_1 = require("../../../src/compile/layout");
var log = require("../../../src/log");
describe('compile/layout', function () {
    describe('unitSizeExpr', function () {
        it('should return correct formula for ordinal-point scale', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal' }
                }
            });
            var sizeExpr = layout_1.unitSizeExpr(model, 'width');
            chai_1.assert.equal(sizeExpr, 'bandspace(domain(\'x\').length, 1, 0.5) * 21');
        });
        it('should return correct formula for ordinal-band scale with custom padding', function () {
            var model = util_1.parseUnitModel({
                mark: 'rect',
                encoding: {
                    x: { field: 'a', type: 'ordinal', scale: { padding: 0.3 } },
                }
            });
            var sizeExpr = layout_1.unitSizeExpr(model, 'width');
            chai_1.assert.equal(sizeExpr, 'bandspace(domain(\'x\').length, 0.3, 0.3) * 21');
        });
        it('should return correct formula for ordinal-band scale with custom paddingInner', function () {
            var model = util_1.parseUnitModel({
                mark: 'rect',
                encoding: {
                    x: { field: 'a', type: 'ordinal', scale: { paddingInner: 0.3 } },
                }
            });
            var sizeExpr = layout_1.unitSizeExpr(model, 'width');
            chai_1.assert.equal(sizeExpr, 'bandspace(domain(\'x\').length, 0.3, 0.15) * 21');
        });
        it('should return static cell size for ordinal x-scale with null', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal', scale: { rangeStep: null } }
                }
            });
            var sizeExpr = layout_1.unitSizeExpr(model, 'width');
            chai_1.assert.equal(sizeExpr, '200');
        });
        it('should return static cell size for ordinal y-scale with null', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    y: { field: 'a', type: 'ordinal', scale: { rangeStep: null } }
                }
            });
            var sizeExpr = layout_1.unitSizeExpr(model, 'height');
            chai_1.assert.equal(sizeExpr, '200');
        });
        it('should return static cell size for ordinal scale with top-level width', function () {
            var model = util_1.parseUnitModel({
                width: 205,
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal' }
                }
            });
            var sizeExpr = layout_1.unitSizeExpr(model, 'width');
            chai_1.assert.equal(sizeExpr, '205');
        });
        it('should return static cell size for ordinal scale with top-level width even if there is numeric rangeStep', function () {
            log.runLocalLogger(function (localLogger) {
                var model = util_1.parseUnitModel({
                    width: 205,
                    mark: 'point',
                    encoding: {
                        x: { field: 'a', type: 'ordinal', scale: { rangeStep: 21 } }
                    }
                });
                var sizeExpr = layout_1.unitSizeExpr(model, 'width');
                chai_1.assert.equal(sizeExpr, '205');
                chai_1.assert.equal(localLogger.warns[0], log.message.rangeStepDropped(channel_1.X));
            });
        });
        it('should return static cell width for non-ordinal x-scale', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'quantitative' }
                }
            });
            var sizeExpr = layout_1.unitSizeExpr(model, 'width');
            chai_1.assert.equal(sizeExpr, '200');
        });
        it('should return static cell size for non-ordinal y-scale', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    y: { field: 'a', type: 'quantitative' }
                }
            });
            var sizeExpr = layout_1.unitSizeExpr(model, 'height');
            chai_1.assert.equal(sizeExpr, '200');
        });
        it('should return default rangeStep if axis is not mapped', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {},
                config: { scale: { rangeStep: 17 } }
            });
            var sizeExpr = layout_1.unitSizeExpr(model, 'width');
            chai_1.assert.equal(sizeExpr, '17');
        });
        it('should return textXRangeStep if axis is not mapped for X of text mark', function () {
            var model = util_1.parseUnitModel({
                mark: 'text',
                encoding: {},
                config: { scale: { textXRangeStep: 91 } }
            });
            var sizeExpr = layout_1.unitSizeExpr(model, 'width');
            chai_1.assert.equal(sizeExpr, '91');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9sYXlvdXQvaW5kZXgudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFDNUIsbUNBQTBDO0FBRTFDLGdEQUEwQztBQUMxQyxzREFBeUQ7QUFDekQsc0NBQXdDO0FBRXhDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtJQUN6QixRQUFRLENBQUMsY0FBYyxFQUFFO1FBQ3ZCLEVBQUUsQ0FBQyx1REFBdUQsRUFBRTtZQUMxRCxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO2dCQUMzQixJQUFJLEVBQUUsT0FBTztnQkFDYixRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDO2lCQUNqQzthQUNGLENBQUMsQ0FBQztZQUVILElBQU0sUUFBUSxHQUFHLHFCQUFZLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzlDLGFBQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLDhDQUE4QyxDQUFDLENBQUM7UUFDekUsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMEVBQTBFLEVBQUU7WUFDN0UsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztnQkFDM0IsSUFBSSxFQUFFLE1BQU07Z0JBQ1osUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFDLEVBQUM7aUJBQ3hEO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsSUFBTSxRQUFRLEdBQUcscUJBQVksQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDOUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsZ0RBQWdELENB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