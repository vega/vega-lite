/* tslint:disable:quotemark */
"use strict";
var chai_1 = require("chai");
var util_1 = require("../util");
var log = require("../../src/log");
var channel_1 = require("../../src/channel");
var layout_1 = require("../../src/compile/layout");
describe('compile/layout', function () {
    describe('cardinalityExpr', function () {
        it('should return correct cardinality expr by default', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal' }
                }
            });
            var expr = layout_1.cardinalityExpr(model, channel_1.X);
            chai_1.assert.equal(expr, 'datum["distinct_a"]');
        });
        it('should return domain length if custom domain is provided', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal', scale: { domain: ['a', 'b'] } }
                }
            });
            var expr = layout_1.cardinalityExpr(model, channel_1.X);
            chai_1.assert.equal(expr, '2');
        });
    });
    describe('unitSizeExpr', function () {
        it('should return correct formula for ordinal-point scale', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal' }
                }
            });
            var sizeExpr = layout_1.unitSizeExpr(model, channel_1.X);
            chai_1.assert.equal(sizeExpr, 'max(datum["distinct_a"] - 1 + 2*0.5, 0) * 21');
        });
        it('should return correct formula for ordinal-band scale with custom padding', function () {
            var model = util_1.parseUnitModel({
                mark: 'rect',
                encoding: {
                    x: { field: 'a', type: 'ordinal', scale: { padding: 0.3 } },
                }
            });
            var sizeExpr = layout_1.unitSizeExpr(model, channel_1.X);
            chai_1.assert.equal(sizeExpr, 'max(datum["distinct_a"] - 0.3 + 2*0.3, 0) * 21');
        });
        it('should return correct formula for ordinal-band scale with custom paddingInner', function () {
            var model = util_1.parseUnitModel({
                mark: 'rect',
                encoding: {
                    x: { field: 'a', type: 'ordinal', scale: { paddingInner: 0.3 } },
                }
            });
            var sizeExpr = layout_1.unitSizeExpr(model, channel_1.X);
            chai_1.assert.equal(sizeExpr, 'max(datum["distinct_a"] - 0.3 + 2*0.15, 0) * 21');
        });
        it('should return static cell size for ordinal x-scale with null', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal', scale: { rangeStep: null } }
                }
            });
            var sizeExpr = layout_1.unitSizeExpr(model, channel_1.X);
            chai_1.assert.equal(sizeExpr, '200');
        });
        it('should return static cell size for ordinal y-scale with null', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    y: { field: 'a', type: 'ordinal', scale: { rangeStep: null } }
                }
            });
            var sizeExpr = layout_1.unitSizeExpr(model, channel_1.Y);
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
            var sizeExpr = layout_1.unitSizeExpr(model, channel_1.X);
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
                var sizeExpr = layout_1.unitSizeExpr(model, channel_1.X);
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
            var sizeExpr = layout_1.unitSizeExpr(model, channel_1.X);
            chai_1.assert.equal(sizeExpr, '200');
        });
        it('should return static cell size for non-ordinal y-scale', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    y: { field: 'a', type: 'quantitative' }
                }
            });
            var sizeExpr = layout_1.unitSizeExpr(model, channel_1.Y);
            chai_1.assert.equal(sizeExpr, '200');
        });
        it('should return default rangeStep if axis is not mapped', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {},
                config: { scale: { rangeStep: 17 } }
            });
            var sizeExpr = layout_1.unitSizeExpr(model, channel_1.X);
            chai_1.assert.equal(sizeExpr, '17');
        });
        it('should return textXRangeStep if axis is not mapped for X of text mark', function () {
            var model = util_1.parseUnitModel({
                mark: 'text',
                encoding: {},
                config: { scale: { textXRangeStep: 91 } }
            });
            var sizeExpr = layout_1.unitSizeExpr(model, channel_1.X);
            chai_1.assert.equal(sizeExpr, '91');
        });
    });
});
//# sourceMappingURL=layout.test.js.map