"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../src/channel");
var scale = require("../src/scale");
var scale_1 = require("../src/scale");
var util_1 = require("../src/util");
describe('scale', function () {
    describe('scaleTypeSupportProperty', function () {
        // Make sure we always edit this when we add new channel
        it('should have at least one supported scale types for all scale properties', function () {
            var _loop_1 = function (prop) {
                chai_1.assert(util_1.some(scale.SCALE_TYPES, function (scaleType) {
                    return scale.scaleTypeSupportProperty(scaleType, prop);
                }));
            };
            for (var _i = 0, _a = scale.SCALE_PROPERTIES; _i < _a.length; _i++) {
                var prop = _a[_i];
                _loop_1(prop);
            }
        });
        // TODO: write more test blindly (Don't look at our code, just look at D3 code.)
        chai_1.assert.isFalse(scale.scaleTypeSupportProperty('bin-linear', 'zero'));
    });
    describe('scaleTypes', function () {
        it('should either hasContinuousDomain or hasDiscreteDomain', function () {
            for (var _i = 0, _a = scale.SCALE_TYPES; _i < _a.length; _i++) {
                var scaleType = _a[_i];
                chai_1.assert(scale.hasContinuousDomain(scaleType) !== scale.hasDiscreteDomain(scaleType));
            }
        });
    });
    describe('channelSupportScaleType', function () {
        // Make sure we always edit this when we add new channel
        it('should have at least one supported scale types for all channels with scale', function () {
            var _loop_2 = function (channel) {
                chai_1.assert(util_1.some(scale_1.SCALE_TYPES, function (scaleType) {
                    return scale_1.channelSupportScaleType(channel, scaleType);
                }));
            };
            for (var _i = 0, SCALE_CHANNELS_1 = channel_1.SCALE_CHANNELS; _i < SCALE_CHANNELS_1.length; _i++) {
                var channel = SCALE_CHANNELS_1[_i];
                _loop_2(channel);
            }
        });
        // Make sure we always edit this when we add new scale type
        it('should have at least one supported channel for all scale types', function () {
            var _loop_3 = function (scaleType) {
                chai_1.assert(util_1.some(channel_1.SCALE_CHANNELS, function (channel) {
                    return scale_1.channelSupportScaleType(channel, scaleType);
                }));
            };
            for (var _i = 0, SCALE_TYPES_1 = scale_1.SCALE_TYPES; _i < SCALE_TYPES_1.length; _i++) {
                var scaleType = SCALE_TYPES_1[_i];
                _loop_3(scaleType);
            }
        });
        it('row,column should support only band', function () {
            for (var _i = 0, _a = ['row', 'column']; _i < _a.length; _i++) {
                var channel = _a[_i];
                chai_1.assert(scale_1.channelSupportScaleType(channel, 'band'));
                var nonBands = util_1.without(scale_1.SCALE_TYPES, ['band']);
                for (var _b = 0, nonBands_1 = nonBands; _b < nonBands_1.length; _b++) {
                    var scaleType = nonBands_1[_b];
                    chai_1.assert(!scale_1.channelSupportScaleType(channel, scaleType));
                }
            }
        });
        it('shape should support only ordinal', function () {
            chai_1.assert(scale_1.channelSupportScaleType('shape', 'ordinal'));
            var nonOrdinal = util_1.without(scale_1.SCALE_TYPES, ['ordinal']);
            for (var _i = 0, nonOrdinal_1 = nonOrdinal; _i < nonOrdinal_1.length; _i++) {
                var scaleType = nonOrdinal_1[_i];
                chai_1.assert(!scale_1.channelSupportScaleType('shape', scaleType));
            }
        });
        it('color should support all scale types except band', function () {
            for (var _i = 0, SCALE_TYPES_2 = scale_1.SCALE_TYPES; _i < SCALE_TYPES_2.length; _i++) {
                var scaleType = SCALE_TYPES_2[_i];
                chai_1.assert.equal(scale_1.channelSupportScaleType('color', scaleType), scaleType !== 'band');
            }
        });
        it('x, y, size, opacity should support all continuous scale type as well as band and point', function () {
            // x,y should use either band or point for ordinal input
            var scaleTypes = scale_1.CONTINUOUS_TO_CONTINUOUS_SCALES.concat([scale_1.ScaleType.BAND, scale_1.ScaleType.POINT]);
            for (var _i = 0, _a = ['x', 'y', 'size', 'opacity']; _i < _a.length; _i++) {
                var channel = _a[_i];
                chai_1.assert(!scale_1.channelSupportScaleType(channel, 'ordinal'));
                chai_1.assert(!scale_1.channelSupportScaleType(channel, 'sequential'));
                for (var _b = 0, scaleTypes_1 = scaleTypes; _b < scaleTypes_1.length; _b++) {
                    var scaleType = scaleTypes_1[_b];
                    chai_1.assert(scale_1.channelSupportScaleType(channel, scaleType), "Error: " + channel + ", " + scaleType);
                }
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3Qvc2NhbGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUM1QiwwQ0FBcUU7QUFDckUsb0NBQXNDO0FBQ3RDLHNDQUE4RztBQUM5RyxvQ0FBMEM7QUFFMUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtJQUNoQixRQUFRLENBQUMsMEJBQTBCLEVBQUU7UUFDbkMsd0RBQXdEO1FBQ3hELEVBQUUsQ0FBQyx5RUFBeUUsRUFBRTtvQ0FDakUsSUFBSTtnQkFDYixhQUFNLENBQUMsV0FBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsVUFBQyxTQUFTO29CQUN2QyxNQUFNLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDekQsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNOLENBQUM7WUFKRCxHQUFHLENBQUMsQ0FBZSxVQUFzQixFQUF0QixLQUFBLEtBQUssQ0FBQyxnQkFBZ0IsRUFBdEIsY0FBc0IsRUFBdEIsSUFBc0I7Z0JBQXBDLElBQU0sSUFBSSxTQUFBO3dCQUFKLElBQUk7YUFJZDtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsZ0ZBQWdGO1FBRWhGLGFBQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3ZFLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFlBQVksRUFBRTtRQUNyQixFQUFFLENBQUMsd0RBQXdELEVBQUU7WUFDM0QsR0FBRyxDQUFDLENBQW9CLFVBQWlCLEVBQWpCLEtBQUEsS0FBSyxDQUFDLFdBQVcsRUFBakIsY0FBaUIsRUFBakIsSUFBaUI7Z0JBQXBDLElBQU0sU0FBUyxTQUFBO2dCQUNsQixhQUFNLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxLQUFLLEtB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