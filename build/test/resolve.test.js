"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var log = require("../src/log");
var resolve_1 = require("../src/resolve");
describe('resolve', function () {
    describe('initLayerResolve', function () {
        var defaults = {
            x: { scale: 'shared', axis: 'shared' },
            y: { scale: 'shared', axis: 'shared' },
            size: { scale: 'shared', legend: 'shared' },
            shape: { scale: 'shared', legend: 'shared' },
            color: { scale: 'shared', legend: 'shared' },
            opacity: { scale: 'shared', legend: 'shared' }
        };
        it('should share by default', function () {
            var actual = resolve_1.initLayerResolve({});
            chai_1.assert.deepEqual(actual, defaults);
        });
        it('should set x axis to independent', function () {
            var actual = resolve_1.initLayerResolve({ x: {
                    axis: 'independent'
                } });
            chai_1.assert.deepEqual(actual, tslib_1.__assign({}, defaults, { x: {
                    scale: 'shared',
                    axis: 'independent'
                } }));
        });
        it('should set x axis to independent even if we set scale to shared', function () {
            var actual = resolve_1.initLayerResolve({ x: {
                    scale: 'shared',
                    axis: 'independent'
                } });
            chai_1.assert.deepEqual(actual, tslib_1.__assign({}, defaults, { x: {
                    scale: 'shared',
                    axis: 'independent'
                } }));
        });
        it('should set color legend to independent', function () {
            var actual = resolve_1.initLayerResolve({ color: {
                    legend: 'independent'
                } });
            chai_1.assert.deepEqual(actual, tslib_1.__assign({}, defaults, { color: {
                    scale: 'shared',
                    legend: 'independent'
                } }));
        });
        it('should force independent axis if scale is independent', function () {
            log.runLocalLogger(function (localLogger) {
                var actual = resolve_1.initLayerResolve({ x: {
                        scale: 'independent',
                        axis: 'shared'
                    } });
                chai_1.assert.deepEqual(actual, tslib_1.__assign({}, defaults, { x: {
                        scale: 'independent',
                        axis: 'independent'
                    } }));
                chai_1.assert.equal(localLogger.warns[0], log.message.independentScaleMeansIndependentGuide('x'));
            });
        });
        it('should force independent axis if scale is independent', function () {
            log.runLocalLogger(function (localLogger) {
                var actual = resolve_1.initLayerResolve({ color: {
                        scale: 'independent',
                        legend: 'shared'
                    } });
                chai_1.assert.deepEqual(actual, tslib_1.__assign({}, defaults, { color: {
                        scale: 'independent',
                        legend: 'independent'
                    } }));
                chai_1.assert.equal(localLogger.warns[0], log.message.independentScaleMeansIndependentGuide('color'));
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2ZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC9yZXNvbHZlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQTRCO0FBQzVCLGdDQUFrQztBQUNsQywwQ0FBZ0U7QUFFaEUsUUFBUSxDQUFDLFNBQVMsRUFBRTtJQUNsQixRQUFRLENBQUMsa0JBQWtCLEVBQUU7UUFDM0IsSUFBTSxRQUFRLEdBQW1CO1lBQy9CLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBQztZQUNwQyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUM7WUFDcEMsSUFBSSxFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFDO1lBQ3pDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBQztZQUMxQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUM7WUFDMUMsT0FBTyxFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFDO1NBQzdDLENBQUM7UUFFRixFQUFFLENBQUMseUJBQXlCLEVBQUU7WUFDNUIsSUFBTSxNQUFNLEdBQUcsMEJBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDcEMsYUFBTSxDQUFDLFNBQVMsQ0FBaUIsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3JELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGtDQUFrQyxFQUFFO1lBQ3JDLElBQU0sTUFBTSxHQUFHLDBCQUFnQixDQUFDLEVBQUMsQ0FBQyxFQUFFO29CQUNsQyxJQUFJLEVBQUUsYUFBYTtpQkFDcEIsRUFBQyxDQUFDLENBQUM7WUFFSixhQUFNLENBQUMsU0FBUyxD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