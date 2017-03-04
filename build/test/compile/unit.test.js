"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var log = require("../../src/log");
var unit_1 = require("../../src/compile/unit");
var channel_1 = require("../../src/channel");
var mark_1 = require("../../src/mark");
var type_1 = require("../../src/type");
var util_1 = require("../util");
describe('UnitModel', function () {
    it('should say it is unit', function () {
        var model = new unit_1.UnitModel({ mark: 'point' }, null, null);
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
                chai_1.assert.equal(model.encoding.shape, undefined);
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
                chai_1.assert.equal(model.encoding.x, undefined);
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
                chai_1.assert.deepEqual(model.encoding.detail, [
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
    describe('initAxes', function () {
        it('it should have axis.labelMaxLength = config.axis.labelMaxLength', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal' },
                    y: { field: 'b', type: 'ordinal' }
                },
                config: { axis: { labelMaxLength: 123 } }
            });
            chai_1.assert.equal(model.axis(channel_1.X).labelMaxLength, 123);
            chai_1.assert.equal(model.axis(channel_1.Y).labelMaxLength, 123);
        });
        it('should not include properties of non-VlOnlyAxisConfig in config.facet.axis', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal' },
                    y: { field: 'b', type: 'ordinal' }
                },
                config: { axis: { domainWidth: 123 } }
            });
            chai_1.assert.equal(model.axis(channel_1.X)['domainWidth'], undefined);
        });
        it('it should have axis.offset = encode.x.axis.offset', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal', axis: { offset: 345 } },
                    y: { field: 'b', type: 'ordinal' }
                },
                config: { axis: { labelMaxLength: 123 } }
            });
            chai_1.assert.equal(model.axis(channel_1.X).offset, 345);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pdC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdGVzdC9jb21waWxlL3VuaXQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUU1QixtQ0FBcUM7QUFDckMsK0NBQWlEO0FBQ2pELDZDQUFzRDtBQUN0RCx1Q0FBbUM7QUFFbkMsdUNBQTRDO0FBQzVDLGdDQUF1QztBQUV2QyxRQUFRLENBQUMsV0FBVyxFQUFFO0lBQ3BCLEVBQUUsQ0FBQyx1QkFBdUIsRUFBRTtRQUMxQixJQUFNLEtBQUssR0FBRyxJQUFJLGdCQUFTLENBQUMsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFhLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JFLGFBQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUN2QixhQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUN6QixhQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUMzQixDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxjQUFjLEVBQUU7UUFDdkIsRUFBRSxDQUFDLG9EQUFvRCxFQUFFO1lBQ3ZELEdBQUcsQ0FBQyxjQUFjLENBQUMsVUFBQyxXQUFXO2dCQUM3QixJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO29CQUMzQixJQUFJLEVBQUUsS0FBSztvQkFDWCxRQUFRLEVBQUU7d0JBQ1IsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO3FCQUMxQztpQkFDRixDQUFDLENBQUM7Z0JBQ0gsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDOUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FB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