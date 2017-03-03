"use strict";
var channel_1 = require("../src/channel");
var channel_2 = require("../src/channel");
var scale_1 = require("../src/scale");
var chai_1 = require("chai");
var util_1 = require("../src/util");
describe('channel', function () {
    describe('UNIT_CHANNELS', function () {
        it('should be CHANNELS without row and column', function () {
            chai_1.assert.deepEqual(channel_2.UNIT_CHANNELS, util_1.without(channel_2.CHANNELS, ['row', 'column']));
        });
    });
    describe('UNIT_SCALE_CHANNELS', function () {
        it('should be UNIT_CHANNELS without X2, Y2, ORDER, DETAIL, TEXT, LABEL', function () {
            chai_1.assert.deepEqual(channel_2.UNIT_SCALE_CHANNELS, util_1.without(channel_2.UNIT_CHANNELS, ['x2', 'y2', 'order', 'detail', 'text', 'label', 'anchor', 'offset']));
        });
    });
    describe('SCALE_CHANNELS', function () {
        it('should be UNIT_SCALE_CHANNELS and ROW and COLUMN', function () {
            chai_1.assert.deepEqual(channel_2.SCALE_CHANNELS, [].concat(channel_2.UNIT_SCALE_CHANNELS, ['row', 'column']));
        });
    });
    describe('NONSPATIAL_CHANNELS', function () {
        it('should be UNIT_CHANNELS without x, y, x2, y2, ANCHOR, OFFSET', function () {
            chai_1.assert.deepEqual(channel_2.NONSPATIAL_CHANNELS, util_1.without(channel_2.UNIT_CHANNELS, ['x', 'y', 'x2', 'y2', 'anchor', 'offset']));
        });
    });
    describe('NONSPATIAL_SCALE_CHANNELS', function () {
        it('should be UNIT_SCALE_CHANNELS without x, y, ANCHOR, OFFSET', function () {
            chai_1.assert.deepEqual(channel_2.NONSPATIAL_SCALE_CHANNELS, util_1.without(channel_2.UNIT_SCALE_CHANNELS, ['x', 'y']));
        });
    });
    describe('hasScale', function () {
        it('should return true for all scale channel', function () {
            for (var _i = 0, SCALE_CHANNELS_1 = channel_2.SCALE_CHANNELS; _i < SCALE_CHANNELS_1.length; _i++) {
                var channel = SCALE_CHANNELS_1[_i];
                chai_1.assert(channel_1.hasScale(channel));
            }
        });
    });
    describe('supportScaleType', function () {
        // Make sure we always edit this when we add new channel
        it('should have at least one supported scale types for all channels with scale', function () {
            var _loop_1 = function (channel) {
                chai_1.assert(util_1.some(scale_1.SCALE_TYPES, function (scaleType) {
                    return channel_1.supportScaleType(channel, scaleType);
                }));
            };
            for (var _i = 0, SCALE_CHANNELS_2 = channel_2.SCALE_CHANNELS; _i < SCALE_CHANNELS_2.length; _i++) {
                var channel = SCALE_CHANNELS_2[_i];
                _loop_1(channel);
            }
        });
        // Make sure we always edit this when we add new scale type
        it('should have at least one supported channel for all scale types', function () {
            var _loop_2 = function (scaleType) {
                chai_1.assert(util_1.some(channel_2.SCALE_CHANNELS, function (channel) {
                    return channel_1.supportScaleType(channel, scaleType);
                }));
            };
            for (var _i = 0, SCALE_TYPES_1 = scale_1.SCALE_TYPES; _i < SCALE_TYPES_1.length; _i++) {
                var scaleType = SCALE_TYPES_1[_i];
                _loop_2(scaleType);
            }
        });
        it('row,column should support only band', function () {
            for (var _i = 0, _a = ['row', 'column']; _i < _a.length; _i++) {
                var channel = _a[_i];
                chai_1.assert(channel_1.supportScaleType(channel, 'band'));
                var nonBands = util_1.without(scale_1.SCALE_TYPES, ['band']);
                for (var _b = 0, nonBands_1 = nonBands; _b < nonBands_1.length; _b++) {
                    var scaleType = nonBands_1[_b];
                    chai_1.assert(!channel_1.supportScaleType(channel, scaleType));
                }
            }
        });
        it('shape should support only ordinal', function () {
            chai_1.assert(channel_1.supportScaleType('shape', 'ordinal'));
            var nonOrdinal = util_1.without(scale_1.SCALE_TYPES, ['ordinal']);
            for (var _i = 0, nonOrdinal_1 = nonOrdinal; _i < nonOrdinal_1.length; _i++) {
                var scaleType = nonOrdinal_1[_i];
                chai_1.assert(!channel_1.supportScaleType('shape', scaleType));
            }
        });
        it('color should support all scale types except band', function () {
            for (var _i = 0, SCALE_TYPES_2 = scale_1.SCALE_TYPES; _i < SCALE_TYPES_2.length; _i++) {
                var scaleType = SCALE_TYPES_2[_i];
                chai_1.assert.equal(channel_1.supportScaleType('color', scaleType), scaleType !== 'band');
            }
        });
        it('x, y, size, opacity should support all scale type except ordinal and sequential', function () {
            // x,y should use either band or point for ordinal input
            var nonOrdinal = util_1.without(scale_1.SCALE_TYPES, ['ordinal', 'sequential']);
            for (var _i = 0, _a = ['x', 'y', 'size', 'opacity']; _i < _a.length; _i++) {
                var channel = _a[_i];
                chai_1.assert(!channel_1.supportScaleType(channel, 'ordinal'));
                chai_1.assert(!channel_1.supportScaleType(channel, 'sequential'));
                for (var _b = 0, nonOrdinal_2 = nonOrdinal; _b < nonOrdinal_2.length; _b++) {
                    var scaleType = nonOrdinal_2[_b];
                    chai_1.assert(channel_1.supportScaleType(channel, scaleType), "Error: " + channel + ", " + scaleType);
                }
            }
        });
    });
});
//# sourceMappingURL=channel.test.js.map