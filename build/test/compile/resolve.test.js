"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var resolve_1 = require("../../src/compile/resolve");
var log = require("../../src/log");
var util_1 = require("../util");
describe('compile/resolve', function () {
    describe('defaultScaleResolve', function () {
        it('shares scales for layer model by default.', function () {
            var model = util_1.parseLayerModel({
                layer: []
            });
            chai_1.assert.equal(resolve_1.defaultScaleResolve('x', model), 'shared');
        });
        it('shares scales for facet model by default.', function () {
            var model = util_1.parseFacetModel({
                facet: {
                    row: { field: 'a', type: 'nominal' }
                },
                spec: { mark: 'point', encoding: {} }
            });
            chai_1.assert.equal(resolve_1.defaultScaleResolve('x', model), 'shared');
        });
        it('separates xy scales for concat model by default.', function () {
            var model = util_1.parseConcatModel({
                hconcat: []
            });
            chai_1.assert.equal(resolve_1.defaultScaleResolve('x', model), 'independent');
        });
        it('shares non-xy scales for concat model by default.', function () {
            var model = util_1.parseConcatModel({
                hconcat: []
            });
            chai_1.assert.equal(resolve_1.defaultScaleResolve('color', model), 'shared');
        });
        it('separates xy scales for repeat model by default.', function () {
            var model = util_1.parseRepeatModel({
                repeat: {
                    row: ['a', 'b']
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: { repeat: 'row' }, type: 'quantitative' },
                        color: { field: 'color', type: 'quantitative' }
                    }
                }
            });
            chai_1.assert.equal(resolve_1.defaultScaleResolve('x', model), 'independent');
        });
        it('shares non-xy scales for repeat model by default.', function () {
            var model = util_1.parseRepeatModel({
                repeat: {
                    row: ['a', 'b']
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: { repeat: 'row' }, type: 'quantitative' },
                        color: { field: 'color', type: 'quantitative' }
                    }
                }
            });
            chai_1.assert.equal(resolve_1.defaultScaleResolve('color', model), 'shared');
        });
    });
    describe('parseGuideResolve', function () {
        it('shares axis for a shared scale by default', function () {
            var axisResolve = resolve_1.parseGuideResolve({
                scale: { x: 'shared' },
                axis: {}
            }, 'x');
            chai_1.assert.equal(axisResolve, 'shared');
        });
        it('separates axis for a shared scale if specified', function () {
            var axisResolve = resolve_1.parseGuideResolve({
                scale: { x: 'shared' },
                axis: { x: 'independent' }
            }, 'x');
            chai_1.assert.equal(axisResolve, 'independent');
        });
        it('separates legend for a shared scale if specified', function () {
            var legendResolve = resolve_1.parseGuideResolve({
                scale: { color: 'shared' },
                legend: { color: 'independent' }
            }, 'color');
            chai_1.assert.equal(legendResolve, 'independent');
        });
        it('separates axis for an independent scale by default', function () {
            var axisResolve = resolve_1.parseGuideResolve({
                scale: { x: 'independent' },
                axis: {}
            }, 'x');
            chai_1.assert.equal(axisResolve, 'independent');
        });
        it('separates axis for an independent scale even "shared" is specified and throw warning', log.wrap(function (localLogger) {
            var axisResolve = resolve_1.parseGuideResolve({
                scale: { x: 'independent' },
                axis: { x: 'shared' }
            }, 'x');
            chai_1.assert.equal(axisResolve, 'independent');
            chai_1.assert.equal(localLogger.warns[0], log.message.independentScaleMeansIndependentGuide('x'));
        }));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2ZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdGVzdC9jb21waWxlL3Jlc29sdmUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUM1QixxREFBaUY7QUFDakYsbUNBQXFDO0FBQ3JDLGdDQUE2RjtBQUU3RixRQUFRLENBQUMsaUJBQWlCLEVBQUU7SUFDMUIsUUFBUSxDQUFDLHFCQUFxQixFQUFFO1FBQzlCLEVBQUUsQ0FBQywyQ0FBMkMsRUFBRTtZQUM5QyxJQUFNLEtBQUssR0FBRyxzQkFBZSxDQUFDO2dCQUM1QixLQUFLLEVBQUUsRUFBRTthQUNWLENBQUMsQ0FBQztZQUNILGFBQU0sQ0FBQyxLQUFLLENBQUMsNkJBQW1CLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzFELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDJDQUEyQyxFQUFFO1lBQzlDLElBQU0sS0FBSyxHQUFHLHNCQUFlLENBQUM7Z0JBQzVCLEtBQUssRUFBRTtvQkFDTCxHQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7aUJBQ25DO2dCQUNELElBQUksRUFBRSxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBQzthQUNwQyxDQUFDLENBQUM7WUFDSCxhQUFNLENBQUMsS0FBSyxDQUFDLDZCQUFtQixDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMxRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxrREFBa0QsRUFBRTtZQUNyRCxJQUFNLEtBQUssR0FBRyx1QkFBZ0IsQ0FBQztnQkFDN0IsT0FBTyxFQUFFLEVBQUU7YUFDWixDQUFDLENBQUM7WUFDSCxhQUFNLENBQUMsS0FBSyxDQUFDLDZCQUFtQixDQUFDLEdBQUcsRUFBRSxLQUFL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