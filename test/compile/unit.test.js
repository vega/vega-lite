"use strict";
var chai_1 = require("chai");
var log = require("../../src/log");
var unit_1 = require("../../src/compile/unit");
var channel_1 = require("../../src/channel");
var mark_1 = require("../../src/mark");
var type_1 = require("../../src/type");
var util_1 = require("../util");
describe('UnitModel', function () {
    it('should say it is unit', function () {
        var model = new unit_1.UnitModel({}, null, null);
        chai_1.assert(model.isUnit());
        chai_1.assert(!model.isFacet());
        chai_1.assert(!model.isLayer());
    });
    describe('initEncoding', function () {
        it('should drop unsupported channel and throws warning', function () {
            log.runLocalLogger(function (localLogger) {
                var model = util_1.parseUnitModel({
                    mark: 'bar',
                    encoding: {
                        shape: { field: 'a', type: 'quantitative' }
                    }
                });
                chai_1.assert.equal(model.encoding().shape, undefined);
                chai_1.assert.equal(localLogger.warns[0], log.message.incompatibleChannel(channel_1.SHAPE, mark_1.BAR));
            });
        });
        it('should drop channel without field and value and throws warning', function () {
            log.runLocalLogger(function (localLogger) {
                var model = util_1.parseUnitModel({
                    mark: 'bar',
                    encoding: {
                        x: { type: 'quantitative' }
                    }
                });
                chai_1.assert.equal(model.encoding().x, undefined);
                chai_1.assert.equal(localLogger.warns[0], log.message.emptyFieldDef({ type: type_1.QUANTITATIVE }, channel_1.X));
            });
        });
        it('should drop a fieldDef without field and value from the channel def list and throws warning', function () {
            log.runLocalLogger(function (localLogger) {
                var model = util_1.parseUnitModel({
                    mark: 'bar',
                    encoding: {
                        detail: [
                            { field: 'a', type: 'ordinal' },
                            { value: 'b' },
                            { type: 'quantitative' }
                        ]
                    }
                });
                chai_1.assert.deepEqual(model.encoding().detail, [
                    { field: 'a', type: 'ordinal' },
                    { value: 'b' }
                ]);
                chai_1.assert.equal(localLogger.warns[0], log.message.emptyFieldDef({ type: type_1.QUANTITATIVE }, channel_1.DETAIL));
            });
        });
    });
    describe('initSize', function () {
        it('should have width, height = provided top-level width, height', function () {
            var model = util_1.parseUnitModel({
                width: 123,
                height: 456,
                mark: 'text',
                encoding: {},
                config: { scale: { textXRangeStep: 91 } }
            });
            chai_1.assert.equal(model.width, 123);
            chai_1.assert.equal(model.height, 456);
        });
        it('should have width = default textXRangeStep for text mark without x', function () {
            var model = util_1.parseUnitModel({
                mark: 'text',
                encoding: {},
                config: { scale: { textXRangeStep: 91 } }
            });
            chai_1.assert.equal(model.width, 91);
        });
        it('should have width/height = config.scale.rangeStep  for non-text mark without x,y', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {},
                config: { scale: { rangeStep: 23 } }
            });
            chai_1.assert.equal(model.width, 23);
            chai_1.assert.equal(model.height, 23);
        });
        it('should have width/height = config.cell.width/height for non-ordinal x,y', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'quantitative' },
                    y: { field: 'b', type: 'quantitative' }
                },
                config: { cell: { width: 123, height: 456 } }
            });
            chai_1.assert.equal(model.width, 123);
            chai_1.assert.equal(model.height, 456);
        });
        it('should have width/height = config.cell.width/height for non-ordinal x,y', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal', scale: { rangeStep: null } },
                    y: { field: 'b', type: 'ordinal', scale: { rangeStep: null } }
                },
                config: { cell: { width: 123, height: 456 } }
            });
            chai_1.assert.equal(model.width, 123);
            chai_1.assert.equal(model.height, 456);
        });
        it('should have width/height = undefined for non-ordinal x,y', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal' },
                    y: { field: 'b', type: 'ordinal' }
                },
                config: { cell: { width: 123, height: 456 } }
            });
            chai_1.assert.equal(model.width, undefined);
            chai_1.assert.equal(model.height, undefined);
        });
    });
});
//# sourceMappingURL=unit.test.js.map