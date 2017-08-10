"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../../util");
var channel_1 = require("../../../src/channel");
var assemble_1 = require("../../../src/compile/layout/assemble");
var log = require("../../../src/log");
describe('compile/layout', function () {
    describe('sizeExpr', function () {
        it('should return correct formula for ordinal-point scale', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal' }
                }
            });
            var size = assemble_1.sizeSignals(model, 'width');
            chai_1.assert.deepEqual(size, [{
                    name: 'x_step',
                    value: 21
                }, {
                    name: 'width',
                    update: 'bandspace(domain(\'x\').length, 1, 0.5) * x_step'
                }]);
        });
        it('should return correct formula for ordinal-band scale with custom padding', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                mark: 'rect',
                encoding: {
                    x: { field: 'a', type: 'ordinal', scale: { padding: 0.3 } },
                }
            });
            var size = assemble_1.sizeSignals(model, 'width');
            chai_1.assert.deepEqual(size, [{
                    name: 'x_step',
                    value: 21
                }, {
                    name: 'width',
                    update: 'bandspace(domain(\'x\').length, 0.3, 0.3) * x_step'
                }]);
        });
        it('should return correct formula for ordinal-band scale with custom paddingInner', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                mark: 'rect',
                encoding: {
                    x: { field: 'a', type: 'ordinal', scale: { paddingInner: 0.3 } },
                }
            });
            var size = assemble_1.sizeSignals(model, 'width');
            chai_1.assert.deepEqual(size, [{
                    name: 'x_step',
                    value: 21
                }, {
                    name: 'width',
                    update: 'bandspace(domain(\'x\').length, 0.3, 0.15) * x_step'
                }]);
        });
        it('should return only step if parent is facet', function () {
            var model = util_1.parseFacetModel({
                facet: {
                    row: { field: 'a', type: 'ordinal' }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: 'b', type: 'nominal' }
                    }
                },
                resolve: {
                    x: { scale: 'independent' }
                }
            });
            model.parseScale();
            model.parseLayoutSize();
            var size = assemble_1.sizeSignals(model.child, 'width');
            chai_1.assert.deepEqual(size, [{
                    name: 'child_x_step',
                    value: 21
                }]);
        });
        it('should return static cell size for ordinal x-scale with null', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal', scale: { rangeStep: null } }
                }
            });
            var size = assemble_1.sizeSignals(model, 'width');
            chai_1.assert.deepEqual(size, [{ name: 'width', update: '200' }]);
        });
        it('should return static cell size for ordinal y-scale with null', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                mark: 'point',
                encoding: {
                    y: { field: 'a', type: 'ordinal', scale: { rangeStep: null } }
                }
            });
            var size = assemble_1.sizeSignals(model, 'height');
            chai_1.assert.deepEqual(size, [{ name: 'height', update: '200' }]);
        });
        it('should return static cell size for ordinal scale with top-level width', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                width: 205,
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal' }
                }
            });
            var size = assemble_1.sizeSignals(model, 'width');
            chai_1.assert.deepEqual(size, [{ name: 'width', update: '205' }]);
        });
        it('should return static cell size for ordinal scale with top-level width even if there is numeric rangeStep', function () {
            log.runLocalLogger(function (localLogger) {
                var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                    width: 205,
                    mark: 'point',
                    encoding: {
                        x: { field: 'a', type: 'ordinal', scale: { rangeStep: 21 } }
                    }
                });
                var size = assemble_1.sizeSignals(model, 'width');
                chai_1.assert.deepEqual(size, [{ name: 'width', update: '205' }]);
                chai_1.assert.equal(localLogger.warns[0], log.message.rangeStepDropped(channel_1.X));
            });
        });
        it('should return static cell width for non-ordinal x-scale', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'quantitative' }
                }
            });
            var size = assemble_1.sizeSignals(model, 'width');
            chai_1.assert.deepEqual(size, [{ name: 'width', update: '200' }]);
        });
        it('should return static cell size for non-ordinal y-scale', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                mark: 'point',
                encoding: {
                    y: { field: 'a', type: 'quantitative' }
                }
            });
            var size = assemble_1.sizeSignals(model, 'height');
            chai_1.assert.deepEqual(size, [{ name: 'height', update: '200' }]);
        });
        it('should return default rangeStep if axis is not mapped', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                mark: 'point',
                encoding: {},
                config: { scale: { rangeStep: 17 } }
            });
            var size = assemble_1.sizeSignals(model, 'width');
            chai_1.assert.deepEqual(size, [{ name: 'width', update: '17' }]);
        });
        it('should return textXRangeStep if axis is not mapped for X of text mark', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                mark: 'text',
                encoding: {},
                config: { scale: { textXRangeStep: 91 } }
            });
            var size = assemble_1.sizeSignals(model, 'width');
            chai_1.assert.deepEqual(size, [{ name: 'width', update: '91' }]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9sYXlvdXQvYXNzZW1ibGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFDNUIsbUNBQWlGO0FBRWpGLGdEQUEwQztBQUMxQyxpRUFBaUU7QUFDakUsc0NBQXdDO0FBRXhDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtJQUN6QixRQUFRLENBQUMsVUFBVSxFQUFFO1FBQ25CLEVBQUUsQ0FBQyx1REFBdUQsRUFBRTtZQUMxRCxJQUFNLEtBQUssR0FBRywyQ0FBb0MsQ0FBQztnQkFDakQsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQztpQkFDakM7YUFDRixDQUFDLENBQUM7WUFFSCxJQUFNLElBQUksR0FBRyxzQkFBVyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztZQUN6QyxhQUFNLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUN0QixJQUFJLEVBQUUsUUFBUTtvQkFDZCxLQUFLLEVBQUUsRUFBRTtpQkFDVixFQUFDO29CQUNBLElBQUksRUFBRSxPQUFPO29CQUNiLE1BQU0sRUFBRSxrREFBa0Q7aUJBQzNELENBQUMsQ0FBQyxDQUFDO1FBQ04sQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMEVBQTBFLEVBQUU7WUFDN0UsSUFBTSxLQUFLLEdBQUcsMkNBQW9DLENBQUM7Z0JBQ2pELElBQUksRUFBRSxNQUFNO2dCQUNaLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBQyxFQUFDO2lCQUN4RDth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