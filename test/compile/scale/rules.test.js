/* tslint:disable:quotemark */
"use strict";
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var rules = require("../../../src/compile/scale/rules");
describe('compile/scale', function () {
    describe('nice', function () {
        // TODO:
    });
    describe('padding', function () {
        it('should be pointPadding for point scale if channel is x or y and padding is not specified.', function () {
            for (var _i = 0, _a = ['x', 'y']; _i < _a.length; _i++) {
                var c = _a[_i];
                chai_1.assert.equal(rules.padding(c, 'point', { pointPadding: 13 }), 13);
            }
        });
    });
    describe('paddingInner', function () {
        it('should be undefined if padding is specified.', function () {
            chai_1.assert.equal(rules.paddingInner(10, 'x', {}), undefined);
        });
        it('should be bandPaddingInner if channel is x or y and padding is not specified.', function () {
            chai_1.assert.equal(rules.paddingInner(undefined, 'x', { bandPaddingInner: 15 }), 15);
            chai_1.assert.equal(rules.paddingInner(undefined, 'y', { bandPaddingInner: 15 }), 15);
        });
        it('should be undefined for non-xy channels.', function () {
            for (var _i = 0, NONSPATIAL_SCALE_CHANNELS_1 = channel_1.NONSPATIAL_SCALE_CHANNELS; _i < NONSPATIAL_SCALE_CHANNELS_1.length; _i++) {
                var c = NONSPATIAL_SCALE_CHANNELS_1[_i];
                chai_1.assert.equal(rules.paddingInner(undefined, c, { bandPaddingInner: 15 }), undefined);
            }
        });
    });
    describe('paddingOuter', function () {
        it('should be undefined if padding is specified.', function () {
            for (var _i = 0, _a = ['point', 'band']; _i < _a.length; _i++) {
                var scaleType = _a[_i];
                chai_1.assert.equal(rules.paddingOuter(10, 'x', scaleType, 0, {}), undefined);
            }
        });
        it('should be config.scale.bandPaddingOuter for band scale if channel is x or y and padding is not specified and config.scale.bandPaddingOuter.', function () {
            for (var _i = 0, _a = ['x', 'y']; _i < _a.length; _i++) {
                var c = _a[_i];
                chai_1.assert.equal(rules.paddingOuter(undefined, c, 'band', 0, { bandPaddingOuter: 16 }), 16);
            }
        });
        it('should be paddingInner/2 for band scale if channel is x or y and padding is not specified and config.scale.bandPaddingOuter.', function () {
            for (var _i = 0, _a = ['x', 'y']; _i < _a.length; _i++) {
                var c = _a[_i];
                chai_1.assert.equal(rules.paddingOuter(undefined, c, 'band', 10, {}), 5);
            }
        });
        it('should be undefined for non-xy channels.', function () {
            for (var _i = 0, NONSPATIAL_SCALE_CHANNELS_2 = channel_1.NONSPATIAL_SCALE_CHANNELS; _i < NONSPATIAL_SCALE_CHANNELS_2.length; _i++) {
                var c = NONSPATIAL_SCALE_CHANNELS_2[_i];
                for (var _a = 0, _b = ['point', 'band']; _a < _b.length; _a++) {
                    var scaleType = _b[_a];
                    chai_1.assert.equal(rules.paddingOuter(undefined, c, scaleType, 0, {}), undefined);
                }
            }
        });
    });
    describe('round', function () {
        it('should return scaleConfig.round for x, y, row, column.', function () {
            for (var _i = 0, _a = ['x', 'y', 'row', 'column']; _i < _a.length; _i++) {
                var c = _a[_i];
                chai_1.assert(rules.round(c, { round: true }));
                chai_1.assert(!rules.round(c, { round: false }));
            }
        });
        it('should return undefined other channels (not x, y, row, column).', function () {
            for (var _i = 0, NONSPATIAL_SCALE_CHANNELS_3 = channel_1.NONSPATIAL_SCALE_CHANNELS; _i < NONSPATIAL_SCALE_CHANNELS_3.length; _i++) {
                var c = NONSPATIAL_SCALE_CHANNELS_3[_i];
                chai_1.assert.isUndefined(rules.round(c, { round: true }));
                chai_1.assert.isUndefined(rules.round(c, { round: false }));
            }
        });
    });
    describe('zero', function () {
        it('should return true when mapping a quantitative field to size', function () {
            chai_1.assert(rules.zero({}, 'size', { field: 'a', type: 'quantitative' }));
        });
        it('should return false when mapping a ordinal field to size', function () {
            chai_1.assert(!rules.zero({}, 'size', { field: 'a', type: 'ordinal' }));
        });
        it('should return true when mapping a non-binned quantitative field to x/y', function () {
            for (var _i = 0, _a = ['x', 'y']; _i < _a.length; _i++) {
                var channel = _a[_i];
                chai_1.assert(rules.zero({}, channel, { field: 'a', type: 'quantitative' }));
            }
        });
        it('should return false when mapping a binned quantitative field to x/y', function () {
            for (var _i = 0, _a = ['x', 'y']; _i < _a.length; _i++) {
                var channel = _a[_i];
                chai_1.assert(!rules.zero({}, channel, { bin: true, field: 'a', type: 'quantitative' }));
            }
        });
        it('should return false when mapping a non-binned quantitative field with custom domain to x/y', function () {
            for (var _i = 0, _a = ['x', 'y']; _i < _a.length; _i++) {
                var channel = _a[_i];
                chai_1.assert(!rules.zero({ domain: [1, 5] }, channel, {
                    bin: true, field: 'a', type: 'quantitative'
                }));
            }
        });
    });
});
//# sourceMappingURL=rules.test.js.map