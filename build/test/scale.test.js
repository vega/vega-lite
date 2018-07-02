import { assert } from 'chai';
import { Channel, SCALE_CHANNELS } from '../src/channel';
import * as scale from '../src/scale';
import { channelSupportScaleType, CONTINUOUS_TO_CONTINUOUS_SCALES, getSupportedScaleType, SCALE_TYPES, ScaleType } from '../src/scale';
import { Type } from '../src/type';
import { some, without } from '../src/util';
describe('scale', function () {
    describe('scaleTypeSupportProperty', function () {
        // Make sure we always edit this when we add new channel
        it('should have at least one supported scale types for all scale properties', function () {
            var _loop_1 = function (prop) {
                assert(some(scale.SCALE_TYPES, function (scaleType) {
                    return scale.scaleTypeSupportProperty(scaleType, prop);
                }));
            };
            for (var _i = 0, _a = scale.SCALE_PROPERTIES; _i < _a.length; _i++) {
                var prop = _a[_i];
                _loop_1(prop);
            }
        });
        // TODO: write more test blindly (Don't look at our code, just look at D3 code.)
        assert.isFalse(scale.scaleTypeSupportProperty('bin-linear', 'zero'));
    });
    describe('scaleTypes', function () {
        it('should either hasContinuousDomain or hasDiscreteDomain', function () {
            for (var _i = 0, _a = scale.SCALE_TYPES; _i < _a.length; _i++) {
                var scaleType = _a[_i];
                assert(scale.hasContinuousDomain(scaleType) !== scale.hasDiscreteDomain(scaleType));
            }
        });
    });
    describe('channelSupportScaleType', function () {
        // Make sure we always edit this when we add new channel
        it('should have at least one supported scale types for all channels with scale', function () {
            var _loop_2 = function (channel) {
                assert(some(SCALE_TYPES, function (scaleType) {
                    return channelSupportScaleType(channel, scaleType);
                }));
            };
            for (var _i = 0, SCALE_CHANNELS_1 = SCALE_CHANNELS; _i < SCALE_CHANNELS_1.length; _i++) {
                var channel = SCALE_CHANNELS_1[_i];
                _loop_2(channel);
            }
        });
        // Make sure we always edit this when we add new scale type
        it('should have at least one supported channel for all scale types', function () {
            var _loop_3 = function (scaleType) {
                assert(some(SCALE_CHANNELS, function (channel) {
                    return channelSupportScaleType(channel, scaleType);
                }));
            };
            for (var _i = 0, SCALE_TYPES_1 = SCALE_TYPES; _i < SCALE_TYPES_1.length; _i++) {
                var scaleType = SCALE_TYPES_1[_i];
                _loop_3(scaleType);
            }
        });
        it('shape should support only ordinal', function () {
            assert(channelSupportScaleType('shape', 'ordinal'));
            var nonOrdinal = without(SCALE_TYPES, ['ordinal']);
            for (var _i = 0, nonOrdinal_1 = nonOrdinal; _i < nonOrdinal_1.length; _i++) {
                var scaleType = nonOrdinal_1[_i];
                assert(!channelSupportScaleType('shape', scaleType));
            }
        });
        it('color should support all scale types except band', function () {
            for (var _i = 0, SCALE_TYPES_2 = SCALE_TYPES; _i < SCALE_TYPES_2.length; _i++) {
                var scaleType = SCALE_TYPES_2[_i];
                assert.equal(channelSupportScaleType('color', scaleType), scaleType !== 'band');
            }
        });
        it('x, y, size, opacity should support all continuous scale type as well as band and point', function () {
            // x,y should use either band or point for ordinal input
            var scaleTypes = CONTINUOUS_TO_CONTINUOUS_SCALES.concat([ScaleType.BAND, ScaleType.POINT]);
            for (var _i = 0, _a = ['x', 'y', 'size', 'opacity']; _i < _a.length; _i++) {
                var channel = _a[_i];
                assert(!channelSupportScaleType(channel, 'ordinal'));
                assert(!channelSupportScaleType(channel, 'sequential'));
                for (var _b = 0, scaleTypes_1 = scaleTypes; _b < scaleTypes_1.length; _b++) {
                    var scaleType = scaleTypes_1[_b];
                    assert(channelSupportScaleType(channel, scaleType), "Error: " + channel + ", " + scaleType);
                }
            }
        });
    });
    describe('getSupportedScaleType', function () {
        it('should return correct scale types for quantitative positional channels', function () {
            var type = Type.QUANTITATIVE;
            var positionalScaleTypes = [ScaleType.LINEAR, ScaleType.LOG, ScaleType.POW, ScaleType.SQRT];
            // x channel
            var scaleTypes = getSupportedScaleType(Channel.X, type);
            assert.deepEqual(positionalScaleTypes, scaleTypes);
            // y channel
            scaleTypes = getSupportedScaleType(Channel.Y, Type.QUANTITATIVE);
            assert.deepEqual(scaleTypes, positionalScaleTypes);
        });
        it('should return correct scale types for quantitative positional channels with bin', function () {
            var type = Type.QUANTITATIVE;
            var positionalScaleTypesBinned = [ScaleType.LINEAR, ScaleType.BIN_LINEAR];
            // x channel
            var scaleTypes = getSupportedScaleType(Channel.X, type, true);
            assert.deepEqual(scaleTypes, positionalScaleTypesBinned);
            // y channel
            scaleTypes = getSupportedScaleType(Channel.Y, type, true);
            assert.deepEqual(scaleTypes, positionalScaleTypesBinned);
        });
        it('should return correct scale types for nominal positional channels', function () {
            var type = Type.NOMINAL;
            var nominalPositionalScaleTypes = [ScaleType.POINT, ScaleType.BAND];
            var scaleTypes = getSupportedScaleType(Channel.X, type);
            assert.deepEqual(scaleTypes, nominalPositionalScaleTypes);
            scaleTypes = getSupportedScaleType(Channel.Y, type);
            assert.deepEqual(scaleTypes, nominalPositionalScaleTypes);
        });
        it('should return correct scale types for temporal positional channels', function () {
            var type = Type.TEMPORAL;
            var temporalPositionalScaleTypes = [ScaleType.TIME, ScaleType.UTC];
            var scaleTypes = getSupportedScaleType(Channel.X, type);
            assert.deepEqual(scaleTypes, temporalPositionalScaleTypes);
            scaleTypes = getSupportedScaleType(Channel.Y, type);
            assert.deepEqual(scaleTypes, temporalPositionalScaleTypes);
        });
    });
});
//# sourceMappingURL=scale.test.js.map