"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../src/channel");
var channel_2 = require("../src/channel");
var mark_1 = require("../src/mark");
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
            chai_1.assert.deepEqual(channel_2.SCALE_CHANNELS, util_1.without(channel_2.UNIT_CHANNELS, [
                'x2',
                'y2',
                'latitude',
                'longitude',
                'latitude2',
                'longitude2',
                'order',
                'detail',
                'key',
                'text',
                'label',
                'tooltip',
                'href'
            ]));
        });
    });
    describe('NONPOSITION_SCALE_CHANNELS', function () {
        it('should be SCALE_CHANNELS without x, y, x2, y2', function () {
            chai_1.assert.deepEqual(channel_2.NONPOSITION_SCALE_CHANNELS, util_1.without(channel_2.SCALE_CHANNELS, ['x', 'y']));
        });
    });
    describe('isScaleChannel', function () {
        it('should return true for all scale channel', function () {
            for (var _i = 0, SCALE_CHANNELS_1 = channel_2.SCALE_CHANNELS; _i < SCALE_CHANNELS_1.length; _i++) {
                var channel = SCALE_CHANNELS_1[_i];
                chai_1.assert(channel_1.isScaleChannel(channel));
            }
        });
    });
    describe('rangeType', function () {
        it('should be defined for all channels (no error).', function () {
            var _loop_1 = function (c) {
                chai_1.assert.doesNotThrow(function () {
                    channel_1.rangeType(c);
                });
            };
            for (var _i = 0, CHANNELS_1 = channel_2.CHANNELS; _i < CHANNELS_1.length; _i++) {
                var c = CHANNELS_1[_i];
                _loop_1(c);
            }
        });
    });
    describe('supportMark', function () {
        it('should support x2 for circle, point, square and tick mark with binned data', function () {
            var encoding = {
                x: {
                    field: 'bin_start',
                    bin: 'binned',
                    type: 'quantitative',
                    axis: {
                        tickStep: 2
                    }
                },
                x2: {
                    field: 'bin_end',
                    type: 'quantitative'
                },
                y: {
                    field: 'count',
                    type: 'quantitative'
                }
            };
            chai_1.assert.isTrue(channel_1.supportMark(encoding, channel_1.X2, mark_1.CIRCLE));
            chai_1.assert.isTrue(channel_1.supportMark(encoding, channel_1.X2, mark_1.POINT));
            chai_1.assert.isTrue(channel_1.supportMark(encoding, channel_1.X2, mark_1.SQUARE));
            chai_1.assert.isTrue(channel_1.supportMark(encoding, channel_1.X2, mark_1.TICK));
        });
        it('should support y2 for circle, point, square and tick mark with binned data', function () {
            var encoding = {
                y: {
                    field: 'bin_start',
                    bin: 'binned',
                    type: 'quantitative',
                    axis: {
                        tickStep: 2
                    }
                },
                y2: {
                    field: 'bin_end',
                    type: 'quantitative'
                },
                x: {
                    field: 'count',
                    type: 'quantitative'
                }
            };
            chai_1.assert.isTrue(channel_1.supportMark(encoding, channel_1.Y2, mark_1.CIRCLE));
            chai_1.assert.isTrue(channel_1.supportMark(encoding, channel_1.Y2, mark_1.POINT));
            chai_1.assert.isTrue(channel_1.supportMark(encoding, channel_1.Y2, mark_1.SQUARE));
            chai_1.assert.isTrue(channel_1.supportMark(encoding, channel_1.Y2, mark_1.TICK));
        });
        it('should not support x2 for circle, point, square and tick mark without binned data', function () {
            var encoding = {
                x: {
                    field: 'bin_start',
                    type: 'quantitative',
                    axis: {
                        tickStep: 2
                    }
                },
                x2: {
                    field: 'bin_end',
                    type: 'quantitative'
                },
                y: {
                    field: 'count',
                    type: 'quantitative'
                }
            };
            chai_1.assert.isFalse(channel_1.supportMark(encoding, channel_1.X2, mark_1.CIRCLE));
            chai_1.assert.isFalse(channel_1.supportMark(encoding, channel_1.X2, mark_1.POINT));
            chai_1.assert.isFalse(channel_1.supportMark(encoding, channel_1.X2, mark_1.SQUARE));
            chai_1.assert.isFalse(channel_1.supportMark(encoding, channel_1.X2, mark_1.TICK));
        });
        it('should not support y2 for circle, point, square and tick mark with binned data', function () {
            var encoding = {
                y: {
                    field: 'bin_start',
                    type: 'quantitative',
                    axis: {
                        tickStep: 2
                    }
                },
                y2: {
                    field: 'bin_end',
                    type: 'quantitative'
                },
                x: {
                    field: 'count',
                    type: 'quantitative'
                }
            };
            chai_1.assert.isFalse(channel_1.supportMark(encoding, channel_1.Y2, mark_1.CIRCLE));
            chai_1.assert.isFalse(channel_1.supportMark(encoding, channel_1.Y2, mark_1.POINT));
            chai_1.assert.isFalse(channel_1.supportMark(encoding, channel_1.Y2, mark_1.SQUARE));
            chai_1.assert.isFalse(channel_1.supportMark(encoding, channel_1.Y2, mark_1.TICK));
        });
    });
});
//# sourceMappingURL=channel.test.js.map