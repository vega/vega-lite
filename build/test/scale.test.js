"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var channel_1 = require("../src/channel");
var scale = tslib_1.__importStar(require("../src/scale"));
var scale_1 = require("../src/scale");
var type_1 = require("../src/type");
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
    describe('getSupportedScaleType', function () {
        it('should return correct scale types for quantitative positional channels', function () {
            var type = type_1.Type.QUANTITATIVE;
            var positionalScaleTypes = [scale_1.ScaleType.LINEAR, scale_1.ScaleType.LOG, scale_1.ScaleType.POW, scale_1.ScaleType.SQRT];
            // x channel
            var scaleTypes = scale_1.getSupportedScaleType(channel_1.Channel.X, type);
            chai_1.assert.deepEqual(positionalScaleTypes, scaleTypes);
            // y channel
            scaleTypes = scale_1.getSupportedScaleType(channel_1.Channel.Y, type_1.Type.QUANTITATIVE);
            chai_1.assert.deepEqual(scaleTypes, positionalScaleTypes);
        });
        it('should return correct scale types for quantitative positional channels with bin', function () {
            var type = type_1.Type.QUANTITATIVE;
            var positionalScaleTypesBinned = [scale_1.ScaleType.LINEAR, scale_1.ScaleType.BIN_LINEAR];
            // x channel
            var scaleTypes = scale_1.getSupportedScaleType(channel_1.Channel.X, type, true);
            chai_1.assert.deepEqual(scaleTypes, positionalScaleTypesBinned);
            // y channel
            scaleTypes = scale_1.getSupportedScaleType(channel_1.Channel.Y, type, true);
            chai_1.assert.deepEqual(scaleTypes, positionalScaleTypesBinned);
        });
        it('should return correct scale types for nominal positional channels', function () {
            var type = type_1.Type.NOMINAL;
            var nominalPositionalScaleTypes = [scale_1.ScaleType.POINT, scale_1.ScaleType.BAND];
            var scaleTypes = scale_1.getSupportedScaleType(channel_1.Channel.X, type);
            chai_1.assert.deepEqual(scaleTypes, nominalPositionalScaleTypes);
            scaleTypes = scale_1.getSupportedScaleType(channel_1.Channel.Y, type);
            chai_1.assert.deepEqual(scaleTypes, nominalPositionalScaleTypes);
        });
        it('should return correct scale types for temporal positional channels', function () {
            var type = type_1.Type.TEMPORAL;
            var temporalPositionalScaleTypes = [scale_1.ScaleType.TIME, scale_1.ScaleType.UTC];
            var scaleTypes = scale_1.getSupportedScaleType(channel_1.Channel.X, type);
            chai_1.assert.deepEqual(scaleTypes, temporalPositionalScaleTypes);
            scaleTypes = scale_1.getSupportedScaleType(channel_1.Channel.Y, type);
            chai_1.assert.deepEqual(scaleTypes, temporalPositionalScaleTypes);
        });
    });
});
//# sourceMappingURL=scale.test.js.map