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
    describe('SINGLE_DEF_CHANNELS', function () {
        it('should be CHANNELS without detail and order', function () {
            chai_1.assert.deepEqual(channel_1.SINGLE_DEF_CHANNELS, util_1.without(channel_2.CHANNELS, ['detail', 'order']));
        });
    });
    describe('SCALE_CHANNELS', function () {
        it('should be UNIT_CHANNELS without X2, Y2, ORDER, DETAIL, TEXT, LABEL, TOOLTIP', function () {
            chai_1.assert.deepEqual(channel_2.SCALE_CHANNELS, util_1.without(channel_2.UNIT_CHANNELS, ['x2', 'y2', 'order', 'detail', 'text', 'label', 'tooltip']));
        });
    });
    describe('NONSPATIAL_CHANNELS', function () {
        it('should be UNIT_CHANNELS without x, y, x2, y2', function () {
            chai_1.assert.deepEqual(channel_2.NONSPATIAL_CHANNELS, util_1.without(channel_2.UNIT_CHANNELS, ['x', 'y', 'x2', 'y2']));
        });
    });
    describe('NONSPATIAL_SCALE_CHANNELS', function () {
        it('should be SCALE_CHANNELS without x, y, x2, y2', function () {
            chai_1.assert.deepEqual(channel_2.NONSPATIAL_SCALE_CHANNELS, util_1.without(channel_2.SCALE_CHANNELS, ['x', 'y']));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbm5lbC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC9jaGFubmVsLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFDNUIsMENBQW1HO0FBQ25HLDBDQUF1SDtBQUN2SCxzQ0FBb0Q7QUFDcEQsb0NBQTBDO0FBRzFDLFFBQVEsQ0FBQyxTQUFTLEVBQUU7SUFDbEIsUUFBUSxDQUFDLGVBQWUsRUFBRTtRQUN4QixFQUFFLENBQUMsMkNBQTJDLEVBQUU7WUFDOUMsYUFBTSxDQUFDLFNBQVMsQ0FBQyx1QkFBYSxFQUFFLGNBQU8sQ0FBQyxrQkFBUSxFQUFFLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4RSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLHFCQUFxQixFQUFFO1FBQzlCLEVBQUUsQ0FBQyw2Q0FBNkMsRUFBRTtZQUNoRCxhQUFNLENBQUMsU0FBUyxDQUFDLDZCQUFtQixFQUFFLGNBQU8sQ0FBQyxrQkFBUSxFQUFFLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGdCQUFnQixFQUFFO1FBQ3pCLEVBQUUsQ0FBQyw2RUFBNkUsRUFBRTtZQUNoRixhQUFNLENBQUMsU0FBUyxDQUFDLHdCQUFjLEVBQUUsY0FBTyxDQUFDLHVCQUFhLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEgsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtRQUM5QixFQUFFLENBQUMsOENBQThDLEVBQUU7WUFD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