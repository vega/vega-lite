"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var resolve_1 = require("../../src/compile/resolve");
var log = tslib_1.__importStar(require("../../src/log"));
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
//# sourceMappingURL=resolve.test.js.map