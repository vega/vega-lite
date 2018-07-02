import { assert } from 'chai';
import { isScaleChannel, rangeType, SINGLE_DEF_CHANNELS } from '../src/channel';
import { CHANNELS, NONPOSITION_SCALE_CHANNELS, SCALE_CHANNELS, UNIT_CHANNELS } from '../src/channel';
import { without } from '../src/util';
describe('channel', function () {
    describe('UNIT_CHANNELS', function () {
        it('should be CHANNELS without row and column', function () {
            assert.deepEqual(UNIT_CHANNELS, without(CHANNELS, ['row', 'column']));
        });
    });
    describe('SINGLE_DEF_CHANNELS', function () {
        it('should be CHANNELS without detail and order', function () {
            assert.deepEqual(SINGLE_DEF_CHANNELS, without(CHANNELS, ['detail', 'order']));
        });
    });
    describe('SCALE_CHANNELS', function () {
        it('should be UNIT_CHANNELS without X2, Y2, ORDER, DETAIL, TEXT, LABEL, TOOLTIP', function () {
            assert.deepEqual(SCALE_CHANNELS, without(UNIT_CHANNELS, ['x2', 'y2', 'latitude', 'longitude', 'latitude2', 'longitude2', 'order', 'detail', 'key', 'text', 'label', 'tooltip', 'href']));
        });
    });
    describe('NONPOSITION_SCALE_CHANNELS', function () {
        it('should be SCALE_CHANNELS without x, y, x2, y2', function () {
            assert.deepEqual(NONPOSITION_SCALE_CHANNELS, without(SCALE_CHANNELS, ['x', 'y']));
        });
    });
    describe('isScaleChannel', function () {
        it('should return true for all scale channel', function () {
            for (var _i = 0, SCALE_CHANNELS_1 = SCALE_CHANNELS; _i < SCALE_CHANNELS_1.length; _i++) {
                var channel = SCALE_CHANNELS_1[_i];
                assert(isScaleChannel(channel));
            }
        });
    });
    describe('rangeType', function () {
        it('should be defined for all channels (no error).', function () {
            var _loop_1 = function (c) {
                assert.doesNotThrow(function () {
                    rangeType(c);
                });
            };
            for (var _i = 0, CHANNELS_1 = CHANNELS; _i < CHANNELS_1.length; _i++) {
                var c = CHANNELS_1[_i];
                _loop_1(c);
            }
        });
    });
});
//# sourceMappingURL=channel.test.js.map