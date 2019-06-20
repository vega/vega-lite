"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var channel_1 = require("../../src/channel");
var log = tslib_1.__importStar(require("../../src/log"));
var mark_1 = require("../../src/mark");
var type_1 = require("../../src/type");
var util_1 = require("../util");
describe('UnitModel', function () {
    describe('initEncoding', function () {
        it('should drop unsupported channel and throws warning', log.wrap(function (localLogger) {
            var model = util_1.parseUnitModel({
                mark: 'bar',
                encoding: {
                    shape: { field: 'a', type: 'quantitative' }
                }
            });
            chai_1.assert.equal(model.encoding.shape, undefined);
            chai_1.assert.equal(localLogger.warns[0], log.message.incompatibleChannel(channel_1.SHAPE, mark_1.BAR));
        }));
        it('should drop invalid channel and throws warning', log.wrap(function (localLogger) {
            var _model = util_1.parseUnitModel({
                mark: 'bar',
                encoding: {
                    _y: { type: 'quantitative' }
                }
            }); // To make parseUnitModel accept the model with invalid encoding channel
            chai_1.assert.equal(localLogger.warns[0], log.message.invalidEncodingChannel('_y'));
        }));
        it('should drop channel without field and value and throws warning', log.wrap(function (localLogger) {
            var model = util_1.parseUnitModel({
                mark: 'bar',
                encoding: {
                    x: { type: 'quantitative' }
                }
            });
            chai_1.assert.equal(model.encoding.x, undefined);
            chai_1.assert.equal(localLogger.warns[0], log.message.emptyFieldDef({ type: type_1.QUANTITATIVE }, channel_1.X));
        }));
        it('should drop a fieldDef without field and value from the channel def list and throws warning', log.wrap(function (localLogger) {
            var model = util_1.parseUnitModel({
                mark: 'bar',
                encoding: {
                    detail: [
                        { field: 'a', type: 'ordinal' },
                        { type: 'quantitative' }
                    ]
                }
            });
            chai_1.assert.deepEqual(model.encoding.detail, [
                { field: 'a', type: 'ordinal' }
            ]);
            chai_1.assert.equal(localLogger.warns[0], log.message.emptyFieldDef({ type: type_1.QUANTITATIVE }, channel_1.DETAIL));
        }));
    });
    describe('initAxes', function () {
        it('should not include properties of non-VlOnlyAxisConfig in config.axis', function () {
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
                }
            });
            chai_1.assert.equal(model.axis(channel_1.X).offset, 345);
        });
    });
});
//# sourceMappingURL=unit.test.js.map