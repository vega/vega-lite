/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZXMudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9zY2FsZS9ydWxlcy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4Qjs7O0FBRTlCLDZCQUE0QjtBQUU1QixnREFBd0U7QUFHeEUsd0RBQTBEO0FBRTFELFFBQVEsQ0FBQyxlQUFlLEVBQUU7SUFDeEIsUUFBUSxDQUFDLE1BQU0sRUFBRTtRQUNmLFFBQVE7SUFDVixDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxTQUFTLEVBQUU7UUFDbEIsRUFBRSxDQUFDLDJGQUEyRixFQUFFO1lBQzlGLEdBQUcsQ0FBQyxDQUFVLFVBQXVCLEVBQXZCLEtBQUEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFjLEVBQXZCLGNBQXVCLEVBQXZCLElBQXVCO2dCQUFoQyxJQUFJLENBQUMsU0FBQTtnQkFDUixhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFDLFlBQVksRUFBRSxFQUFFLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2FBQ2pFO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxjQUFjLEVBQUU7UUFDdkIsRUFBRSxDQUFDLDhDQUE4QyxFQUFFO1lBQ2pELGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzNELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLCtFQUErRSxFQUFFO1lBQ2xGLGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLEVBQUMsZ0JBQWdCLEVBQUUsRUFBRSxFQUFDLENBQUMsRUFBRSxFQUFFLENB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