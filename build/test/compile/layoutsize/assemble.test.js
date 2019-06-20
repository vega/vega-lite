"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var util_1 = require("../../util");
var channel_1 = require("../../../src/channel");
var assemble_1 = require("../../../src/compile/layoutsize/assemble");
var log = tslib_1.__importStar(require("../../../src/log"));
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
                    scale: { x: 'independent' }
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
        it('should return static view size for ordinal x-scale with null', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal', scale: { rangeStep: null } }
                }
            });
            var size = assemble_1.sizeSignals(model, 'width');
            chai_1.assert.deepEqual(size, [{ name: 'width', value: 200 }]);
        });
        it('should return static view size for ordinal y-scale with null', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                mark: 'point',
                encoding: {
                    y: { field: 'a', type: 'ordinal', scale: { rangeStep: null } }
                }
            });
            var size = assemble_1.sizeSignals(model, 'height');
            chai_1.assert.deepEqual(size, [{ name: 'height', value: 200 }]);
        });
        it('should return static view size for ordinal scale with top-level width', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                width: 205,
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal' }
                }
            });
            var size = assemble_1.sizeSignals(model, 'width');
            chai_1.assert.deepEqual(size, [{ name: 'width', value: 205 }]);
        });
        it('should return static view size for ordinal scale with top-level width even if there is numeric rangeStep', log.wrap(function (localLogger) {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                width: 205,
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal', scale: { rangeStep: 21 } }
                }
            });
            var size = assemble_1.sizeSignals(model, 'width');
            chai_1.assert.deepEqual(size, [{ name: 'width', value: 205 }]);
            chai_1.assert.equal(localLogger.warns[0], log.message.rangeStepDropped(channel_1.X));
        }));
        it('should return static view width for non-ordinal x-scale', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'quantitative' }
                }
            });
            var size = assemble_1.sizeSignals(model, 'width');
            chai_1.assert.deepEqual(size, [{ name: 'width', value: 200 }]);
        });
        it('should return static view size for non-ordinal y-scale', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                mark: 'point',
                encoding: {
                    y: { field: 'a', type: 'quantitative' }
                }
            });
            var size = assemble_1.sizeSignals(model, 'height');
            chai_1.assert.deepEqual(size, [{ name: 'height', value: 200 }]);
        });
        it('should return default rangeStep if axis is not mapped', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                mark: 'point',
                encoding: {},
                config: { scale: { rangeStep: 17 } }
            });
            var size = assemble_1.sizeSignals(model, 'width');
            chai_1.assert.deepEqual(size, [{ name: 'width', value: 17 }]);
        });
        it('should return textXRangeStep if axis is not mapped for X of text mark', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                mark: 'text',
                encoding: {},
                config: { scale: { textXRangeStep: 91 } }
            });
            var size = assemble_1.sizeSignals(model, 'width');
            chai_1.assert.deepEqual(size, [{ name: 'width', value: 91 }]);
        });
    });
});
//# sourceMappingURL=assemble.test.js.map