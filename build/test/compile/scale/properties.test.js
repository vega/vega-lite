"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var rules = tslib_1.__importStar(require("../../../src/compile/scale/properties"));
var mark_1 = require("../../../src/mark");
describe('compile/scale', function () {
    describe('nice', function () {
        it('should return nice for x and y.', function () {
            for (var _i = 0, _a = ['x', 'y']; _i < _a.length; _i++) {
                var c = _a[_i];
                chai_1.assert.equal(rules.nice('linear', c, { type: 'quantitative' }), true);
            }
        });
        it('should not return nice for binned x and y.', function () {
            for (var _i = 0, _a = ['x', 'y']; _i < _a.length; _i++) {
                var c = _a[_i];
                chai_1.assert.equal(rules.nice('linear', c, { type: 'quantitative', bin: true }), undefined);
            }
        });
        it('should not return nice for temporal x and y.', function () {
            for (var _i = 0, _a = ['x', 'y']; _i < _a.length; _i++) {
                var c = _a[_i];
                chai_1.assert.equal(rules.nice('time', c, { type: 'temporal' }), undefined);
            }
        });
    });
    describe('padding', function () {
        it('should be pointPadding for point scale if channel is x or y and padding is not specified.', function () {
            for (var _i = 0, _a = ['x', 'y']; _i < _a.length; _i++) {
                var c = _a[_i];
                chai_1.assert.equal(rules.padding(c, 'point', { pointPadding: 13 }, undefined, undefined, undefined), 13);
            }
        });
        it('should be continuousBandSize for linear x-scale of vertical bar.', function () {
            chai_1.assert.equal(rules.padding('x', 'linear', {}, { field: 'date', type: 'temporal' }, { type: 'bar', orient: 'vertical' }, { continuousBandSize: 13 }), 13);
        });
        it('should be undefined for linear x-scale for binned field of vertical bar.', function () {
            chai_1.assert.equal(rules.padding('x', 'linear', {}, { bin: true, field: 'date', type: 'temporal' }, { type: 'bar', orient: 'vertical' }, { continuousBandSize: 13 }), undefined);
        });
        it('should be continuousBandSize for linear y-scale of horizontal bar.', function () {
            chai_1.assert.equal(rules.padding('y', 'linear', {}, { field: 'date', type: 'temporal' }, { type: 'bar', orient: 'horizontal' }, { continuousBandSize: 13 }), 13);
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
            for (var _i = 0, NONPOSITION_SCALE_CHANNELS_1 = channel_1.NONPOSITION_SCALE_CHANNELS; _i < NONPOSITION_SCALE_CHANNELS_1.length; _i++) {
                var c = NONPOSITION_SCALE_CHANNELS_1[_i];
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
            for (var _i = 0, NONPOSITION_SCALE_CHANNELS_2 = channel_1.NONPOSITION_SCALE_CHANNELS; _i < NONPOSITION_SCALE_CHANNELS_2.length; _i++) {
                var c = NONPOSITION_SCALE_CHANNELS_2[_i];
                for (var _a = 0, _b = ['point', 'band']; _a < _b.length; _a++) {
                    var scaleType = _b[_a];
                    chai_1.assert.equal(rules.paddingOuter(undefined, c, scaleType, 0, {}), undefined);
                }
            }
        });
    });
    describe('reverse', function () {
        it('should return true for a continuous scale with sort = "descending".', function () {
            chai_1.assert.isTrue(rules.reverse('linear', 'descending'));
        });
        it('should return false for a discrete scale with sort = "descending".', function () {
            chai_1.assert.isUndefined(rules.reverse('point', 'descending'));
        });
    });
    describe('zero', function () {
        it('should return true when mapping a quantitative field to x with scale.domain = "unaggregated"', function () {
            chai_1.assert(rules.zero('x', { field: 'a', type: 'quantitative' }, 'unaggregated', { type: 'point' }));
        });
        it('should return true when mapping a quantitative field to size', function () {
            chai_1.assert(rules.zero('size', { field: 'a', type: 'quantitative' }, undefined, { type: 'point' }));
        });
        it('should return false when mapping a ordinal field to size', function () {
            chai_1.assert(!rules.zero('size', { field: 'a', type: 'ordinal' }, undefined, { type: 'point' }));
        });
        it('should return true when mapping a non-binned quantitative field to x/y of point', function () {
            for (var _i = 0, _a = ['x', 'y']; _i < _a.length; _i++) {
                var channel = _a[_i];
                chai_1.assert(rules.zero(channel, { field: 'a', type: 'quantitative' }, undefined, { type: 'point' }));
            }
        });
        it('should return false when mapping a quantitative field to dimension axis of bar, line, and area', function () {
            for (var _i = 0, _a = [mark_1.BAR, mark_1.AREA, mark_1.LINE]; _i < _a.length; _i++) {
                var mark = _a[_i];
                chai_1.assert.isFalse(rules.zero('x', { field: 'a', type: 'quantitative' }, undefined, { type: mark, orient: 'vertical' }));
                chai_1.assert.isFalse(rules.zero('y', { field: 'a', type: 'quantitative' }, undefined, { type: mark, orient: 'horizontal' }));
            }
        });
        it('should return false when mapping a binned quantitative field to x/y', function () {
            for (var _i = 0, _a = ['x', 'y']; _i < _a.length; _i++) {
                var channel = _a[_i];
                chai_1.assert(!rules.zero(channel, { bin: true, field: 'a', type: 'quantitative' }, undefined, { type: 'point' }));
            }
        });
        it('should return false when mapping a non-binned quantitative field with custom domain to x/y', function () {
            for (var _i = 0, _a = ['x', 'y']; _i < _a.length; _i++) {
                var channel = _a[_i];
                chai_1.assert(!rules.zero(channel, {
                    bin: true, field: 'a', type: 'quantitative'
                }, [3, 5], { type: 'point' }));
            }
        });
    });
});
//# sourceMappingURL=properties.test.js.map