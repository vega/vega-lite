"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../src/channel");
var channel_2 = require("../src/channel");
var scale_1 = require("../src/scale");
var util_1 = require("../src/util");
describe('channel', function () {
    describe('UNIT_CHANNELS', function () {
        it('should be CHANNELS without row and column', function () {
            chai_1.assert.deepEqual(channel_2.UNIT_CHANNELS, util_1.without(channel_2.CHANNELS, ['row', 'column']));
        });
    });
    describe('UNIT_SCALE_CHANNELS', function () {
        it('should be UNIT_CHANNELS without X2, Y2, ORDER, DETAIL, TEXT, LABEL', function () {
            chai_1.assert.deepEqual(channel_2.UNIT_SCALE_CHANNELS, util_1.without(channel_2.UNIT_CHANNELS, ['x2', 'y2', 'order', 'detail', 'text', 'label']));
        });
    });
    describe('SCALE_CHANNELS', function () {
        it('should be UNIT_SCALE_CHANNELS and ROW and COLUMN', function () {
            chai_1.assert.deepEqual(channel_2.SCALE_CHANNELS, [].concat(channel_2.UNIT_SCALE_CHANNELS, ['row', 'column']));
        });
    });
    describe('NONSPATIAL_CHANNELS', function () {
        it('should be UNIT_CHANNELS without x, y, x2, y2', function () {
            chai_1.assert.deepEqual(channel_2.NONSPATIAL_CHANNELS, util_1.without(channel_2.UNIT_CHANNELS, ['x', 'y', 'x2', 'y2']));
        });
    });
    describe('NONSPATIAL_SCALE_CHANNELS', function () {
        it('should be UNIT_SCALE_CHANNELS without x, y, x2, y2', function () {
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
    describe('rangeType', function () {
        it('should be defined for all channels (no error).', function () {
            var _loop_3 = function (c) {
                chai_1.assert.doesNotThrow(function () {
                    channel_1.rangeType(c);
                });
            };
            for (var _i = 0, CHANNELS_1 = channel_2.CHANNELS; _i < CHANNELS_1.length; _i++) {
                var c = CHANNELS_1[_i];
                _loop_3(c);
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbm5lbC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC9jaGFubmVsLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFDNUIsMENBQThFO0FBQzlFLDBDQUE0STtBQUM1SSxzQ0FBb0Q7QUFDcEQsb0NBQTBDO0FBRzFDLFFBQVEsQ0FBQyxTQUFTLEVBQUU7SUFDbEIsUUFBUSxDQUFDLGVBQWUsRUFBRTtRQUN4QixFQUFFLENBQUMsMkNBQTJDLEVBQUU7WUFDOUMsYUFBTSxDQUFDLFNBQVMsQ0FBQyx1QkFBYSxFQUFFLGNBQU8sQ0FBQyxrQkFBUSxFQUFFLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4RSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLHFCQUFxQixFQUFFO1FBQzlCLEVBQUUsQ0FBQyxvRUFBb0UsRUFBRTtZQUN2RSxhQUFNLENBQUMsU0FBUyxDQUFDLDZCQUFtQixFQUFFLGNBQU8sQ0FBQyx1QkFBYSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEgsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN6QixFQUFFLENBQUMsa0RBQWtELEVBQUU7WUFDckQsYUFBTSxDQUFDLFNBQVMsQ0FBQyx3QkFBYyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsNkJBQW1CLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RGLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMscUJBQXFCLEVBQUU7UUFDOUIsRUFBRSxDQUFDLDhDQUE4QyxFQUFFO1lB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