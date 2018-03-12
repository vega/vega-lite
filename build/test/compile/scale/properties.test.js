"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var rules = require("../../../src/compile/scale/properties");
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
            chai_1.assert(rules.zero('x', { field: 'a', type: 'quantitative' }, 'unaggregated'));
        });
        it('should return true when mapping a quantitative field to size', function () {
            chai_1.assert(rules.zero('size', { field: 'a', type: 'quantitative' }, undefined));
        });
        it('should return false when mapping a ordinal field to size', function () {
            chai_1.assert(!rules.zero('size', { field: 'a', type: 'ordinal' }, undefined));
        });
        it('should return true when mapping a non-binned quantitative field to x/y', function () {
            for (var _i = 0, _a = ['x', 'y']; _i < _a.length; _i++) {
                var channel = _a[_i];
                chai_1.assert(rules.zero(channel, { field: 'a', type: 'quantitative' }, undefined));
            }
        });
        it('should return false when mapping a binned quantitative field to x/y', function () {
            for (var _i = 0, _a = ['x', 'y']; _i < _a.length; _i++) {
                var channel = _a[_i];
                chai_1.assert(!rules.zero(channel, { bin: true, field: 'a', type: 'quantitative' }, undefined));
            }
        });
        it('should return false when mapping a non-binned quantitative field with custom domain to x/y', function () {
            for (var _i = 0, _a = ['x', 'y']; _i < _a.length; _i++) {
                var channel = _a[_i];
                chai_1.assert(!rules.zero(channel, {
                    bin: true, field: 'a', type: 'quantitative'
                }, [3, 5]));
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydGllcy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL3NjYWxlL3Byb3BlcnRpZXMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFFNUIsZ0RBQXlFO0FBR3pFLDZEQUErRDtBQUUvRCxRQUFRLENBQUMsZUFBZSxFQUFFO0lBQ3hCLFFBQVEsQ0FBQyxNQUFNLEVBQUU7UUFDZixFQUFFLENBQUMsaUNBQWlDLEVBQUU7WUFDcEMsR0FBRyxDQUFDLENBQVksVUFBdUIsRUFBdkIsS0FBQSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQWMsRUFBdkIsY0FBdUIsRUFBdkIsSUFBdUI7Z0JBQWxDLElBQU0sQ0FBQyxTQUFBO2dCQUNWLGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDckU7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRTtZQUMvQyxHQUFHLENBQUMsQ0FBWSxVQUF1QixFQUF2QixLQUFBLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBYyxFQUF2QixjQUF1QixFQUF2QixJQUF1QjtnQkFBbEMsSUFBTSxDQUFDLFNBQUE7Z0JBQ1YsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQ3JGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsOENBQThDLEVBQUU7WUFDakQsR0FBRyxDQUFDLENBQVksVUFBdUIsRUFBdkIsS0FBQSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQWMsRUFBdkIsY0FBdUIsRUFBdkIsSUFBdUI7Z0JBQWxDLElBQU0sQ0FBQyxTQUFBO2dCQUNWLGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7YUFDcEU7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNsQixFQUFFLENBQUMsMkZBQTJGLEVBQUU7WUFDOUYsR0FBRyxDQUFDLENBQVksVUFBdUIsRUFBdkIsS0FBQSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQWMsRUFBdkIsY0FBdUIsRUFBdkIsSUFBdUI7Z0JBQWxDLElBQU0sQ0FBQyxTQUFBO2dCQUNWLGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUMsWUFBWSxFQUFFLEVBQUUsRUFBQyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7YUFDbEc7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxrRUFBa0UsRUFBRTtZQUNyRSxhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBQyxFQUFFLEVBQUMsa0JBQWtCLEVBQUUsRUFBRSxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNySixDQUFDLENBQUMsQ0FBQztRQUdILEVBQUUsQ0FBQywwRUFBMEUsRUFBRTtZQUM3RSxhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFDLEVBQUUsRUFBQyxrQkFBa0IsRUFBRSxFQUFFLEVBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZLLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG9FQUFvRSxFQUFFO1lBQ3ZFLGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFDLEVBQUUsRUFBQyxrQkFBa0IsRUFBRSxFQUFFLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsY0FBYyxFQUFFO1FBQ3ZCLEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRTtZQUNqRCxhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMzRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywrRUFBK0UsRUFBRTtZQUNsRixhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxFQUFDLGdCQUFnQixFQUFFLEVBQUUsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDN0UsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsRUFBQyxnQkFBZ0IsRUFBRSxFQUFFLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQy9FLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDBDQUEwQyxFQUFFO1lBQzdDLEdBQUcsQ0FBQyxDQUFZLFVBQTBCLEVBQTFCLCtCQUFBLG9DQUEwQixFQUExQix3Q0FBMEIsRUFBMUIsSUFBMEI7Z0JBQXJDLElBQU0sQ0FBQyxtQ0FBQTtnQkFDVixhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFDLGdCQUFnQixFQUFFLEVBQUUsRUFBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7YUFDbkY7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGNBQWMsRUFBRTtRQUN2QixFQUFFLENBQUMsOENBQThDLEVBQUU7WUFDakQsR0FBRyxDQUFDLENBQW9CLFVBQWdDLEVBQWhDLEtBQUEsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFnQixFQUFoQyxjQUFnQyxFQUFoQyxJQUFnQztnQkFBbkQsSUFBTSxTQUFTLFNBQUE7Z0JBQ2xCLGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7YUFDeEU7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw2SUFBNkksRUFBRTtZQUNoSixHQUFHLENBQUMsQ0FBWSxVQUF1QixFQUF2QixLQUFBLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBYyxFQUF2QixjQUF1QixFQUF2QixJQUF1QjtnQkFBbEMsSUFBTSxDQUFDLFNBQUE7Z0JBQ1YsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFDLGdCQUFnQixFQUFFLEVBQUUsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7YUFDdkY7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILEVBQUUsQ0FBQyw4SEFBOEgsRUFBRTtZQUNqSSxHQUFHLENBQUMsQ0FBWSxVQUF1QixFQUF2QixLQUFBLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBYyxFQUF2QixjQUF1QixFQUF2QixJQUF1QjtnQkFBbEMsSUFBTSxDQUFDLFNBQUE7Z0JBQ1YsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNuRTtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDBDQUEwQyxFQUFFO1lBQzdDLEdBQUcsQ0FBQyxDQUFZLFVBQTBCLEVBQTFCLCtCQUFBLG9DQUEwQixFQUExQix3Q0FBMEIsRUFBMUIsSUFBMEI7Z0JBQXJDLElBQU0sQ0FBQyxtQ0FBQTtnQkFDVixHQUFHLENBQUMsQ0FBb0IsVUFBZ0MsRUFBaEMsS0FBQSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQWdCLEVBQWhDLGNBQWdDLEVBQWhDLElBQWdDO29CQUFuRCxJQUFNLFNBQVMsU0FBQTtvQkFDbEIsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztpQkFDN0U7YUFDRjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsU0FBUyxFQUFFO1FBQ2xCLEVBQUUsQ0FBQyxxRUFBcUUsRUFBRTtZQUN4RSxhQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDdkQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsb0VBQW9FLEVBQUU7WUFDdkUsYUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQzNELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsTUFBTSxFQUFFO1FBQ2YsRUFBRSxDQUFDLDhGQUE4RixFQUFFO1lBQ2pHLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQyxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDOUUsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsOERBQThELEVBQUU7WUFDakUsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUM1RSxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywwREFBMEQsRUFBRTtZQUM3RCxhQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDeEUsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsd0VBQXdFLEVBQUU7WUFDM0UsR0FBRyxDQUFDLENBQWtCLFVBQXVCLEVBQXZCLEtBQUEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFjLEVBQXZCLGNBQXVCLEVBQXZCLElBQXVCO2dCQUF4QyxJQUFNLE9BQU8sU0FBQTtnQkFDaEIsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQzthQUM1RTtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHFFQUFxRSxFQUFFO1lBQ3hFLEdBQUcsQ0FBQyxDQUFrQixVQUF1QixFQUF2QixLQUFBLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBYyxFQUF2QixjQUF1QixFQUF2QixJQUF1QjtnQkFBeEMsSUFBTSxPQUFPLFNBQUE7Z0JBQ2hCLGFBQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO2FBQ3hGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNEZBQTRGLEVBQUU7WUFDL0YsR0FBRyxDQUFDLENBQWtCLFVBQXVCLEVBQXZCLEtBQUEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFjLEVBQXZCLGNBQXVCLEVBQXZCLElBQXVCO2dCQUF4QyxJQUFNLE9BQU8sU0FBQTtnQkFDaEIsYUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7b0JBQzFCLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYztpQkFDNUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDYjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCB7Q2hhbm5lbCwgTk9OUE9TSVRJT05fU0NBTEVfQ0hBTk5FTFN9IGZyb20gJy4uLy4uLy4uL3NyYy9jaGFubmVsJztcbmltcG9ydCB7U2NhbGVUeXBlfSBmcm9tICcuLi8uLi8uLi9zcmMvc2NhbGUnO1xuXG5pbXBvcnQgKiBhcyBydWxlcyBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9wcm9wZXJ0aWVzJztcblxuZGVzY3JpYmUoJ2NvbXBpbGUvc2NhbGUnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCduaWNlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIG5pY2UgZm9yIHggYW5kIHkuJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBjIG9mIFsneCcsICd5J10gYXMgQ2hhbm5lbFtdKSB7XG4gICAgICAgIGFzc2VydC5lcXVhbChydWxlcy5uaWNlKCdsaW5lYXInLCBjLCB7dHlwZTogJ3F1YW50aXRhdGl2ZSd9KSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZXR1cm4gbmljZSBmb3IgYmlubmVkIHggYW5kIHkuJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBjIG9mIFsneCcsICd5J10gYXMgQ2hhbm5lbFtdKSB7XG4gICAgICAgIGFzc2VydC5lcXVhbChydWxlcy5uaWNlKCdsaW5lYXInLCBjLCB7dHlwZTogJ3F1YW50aXRhdGl2ZScsIGJpbjogdHJ1ZX0pLCB1bmRlZmluZWQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmV0dXJuIG5pY2UgZm9yIHRlbXBvcmFsIHggYW5kIHkuJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBjIG9mIFsneCcsICd5J10gYXMgQ2hhbm5lbFtdKSB7XG4gICAgICAgIGFzc2VydC5lcXVhbChydWxlcy5uaWNlKCd0aW1lJywgYywge3R5cGU6ICd0ZW1wb3JhbCd9KSwgdW5kZWZpbmVkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3BhZGRpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSBwb2ludFBhZGRpbmcgZm9yIHBvaW50IHNjYWxlIGlmIGNoYW5uZWwgaXMgeCBvciB5IGFuZCBwYWRkaW5nIGlzIG5vdCBzcGVjaWZpZWQuJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBjIG9mIFsneCcsICd5J10gYXMgQ2hhbm5lbFtdKSB7XG4gICAgICAgIGFzc2VydC5lcXVhbChydWxlcy5wYWRkaW5nKGMsICdwb2ludCcsIHtwb2ludFBhZGRpbmc6IDEzfSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCksIDEzKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYmUgY29udGludW91c0JhbmRTaXplIGZvciBsaW5lYXIgeC1zY2FsZSBvZiB2ZXJ0aWNhbCBiYXIuJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKHJ1bGVzLnBhZGRpbmcoJ3gnLCAnbGluZWFyJywge30sIHtmaWVsZDogJ2RhdGUnLCB0eXBlOiAndGVtcG9yYWwnfSwge3R5cGU6ICdiYXInLCBvcmllbnQ6ICd2ZXJ0aWNhbCd9LCB7Y29udGludW91c0JhbmRTaXplOiAxM30pLCAxMyk7XG4gICAgfSk7XG5cblxuICAgIGl0KCdzaG91bGQgYmUgdW5kZWZpbmVkIGZvciBsaW5lYXIgeC1zY2FsZSBmb3IgYmlubmVkIGZpZWxkIG9mIHZlcnRpY2FsIGJhci4nLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwocnVsZXMucGFkZGluZygneCcsICdsaW5lYXInLCB7fSwge2JpbjogdHJ1ZSwgZmllbGQ6ICdkYXRlJywgdHlwZTogJ3RlbXBvcmFsJ30sIHt0eXBlOiAnYmFyJywgb3JpZW50OiAndmVydGljYWwnfSwge2NvbnRpbnVvdXNCYW5kU2l6ZTogMTN9KSwgdW5kZWZpbmVkKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYmUgY29udGludW91c0JhbmRTaXplIGZvciBsaW5lYXIgeS1zY2FsZSBvZiBob3Jpem9udGFsIGJhci4nLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwocnVsZXMucGFkZGluZygneScsICdsaW5lYXInLCB7fSwge2ZpZWxkOiAnZGF0ZScsIHR5cGU6ICd0ZW1wb3JhbCd9LCB7dHlwZTogJ2JhcicsIG9yaWVudDogJ2hvcml6b250YWwnfSwge2NvbnRpbnVvdXNCYW5kU2l6ZTogMTN9KSwgMTMpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncGFkZGluZ0lubmVyJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgdW5kZWZpbmVkIGlmIHBhZGRpbmcgaXMgc3BlY2lmaWVkLicsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChydWxlcy5wYWRkaW5nSW5uZXIoMTAsICd4Jywge30pLCB1bmRlZmluZWQpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBiZSBiYW5kUGFkZGluZ0lubmVyIGlmIGNoYW5uZWwgaXMgeCBvciB5IGFuZCBwYWRkaW5nIGlzIG5vdCBzcGVjaWZpZWQuJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKHJ1bGVzLnBhZGRpbmdJbm5lcih1bmRlZmluZWQsICd4Jywge2JhbmRQYWRkaW5nSW5uZXI6IDE1fSksIDE1KTtcbiAgICAgIGFzc2VydC5lcXVhbChydWxlcy5wYWRkaW5nSW5uZXIodW5kZWZpbmVkLCAneScsIHtiYW5kUGFkZGluZ0lubmVyOiAxNX0pLCAxNSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGJlIHVuZGVmaW5lZCBmb3Igbm9uLXh5IGNoYW5uZWxzLicsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgYyBvZiBOT05QT1NJVElPTl9TQ0FMRV9DSEFOTkVMUykge1xuICAgICAgICBhc3NlcnQuZXF1YWwocnVsZXMucGFkZGluZ0lubmVyKHVuZGVmaW5lZCwgYywge2JhbmRQYWRkaW5nSW5uZXI6IDE1fSksIHVuZGVmaW5lZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdwYWRkaW5nT3V0ZXInLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSB1bmRlZmluZWQgaWYgcGFkZGluZyBpcyBzcGVjaWZpZWQuJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBzY2FsZVR5cGUgb2YgWydwb2ludCcsICdiYW5kJ10gYXMgU2NhbGVUeXBlW10pIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHJ1bGVzLnBhZGRpbmdPdXRlcigxMCwgJ3gnLCBzY2FsZVR5cGUsIDAsIHt9KSwgdW5kZWZpbmVkKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYmUgY29uZmlnLnNjYWxlLmJhbmRQYWRkaW5nT3V0ZXIgZm9yIGJhbmQgc2NhbGUgaWYgY2hhbm5lbCBpcyB4IG9yIHkgYW5kIHBhZGRpbmcgaXMgbm90IHNwZWNpZmllZCBhbmQgY29uZmlnLnNjYWxlLmJhbmRQYWRkaW5nT3V0ZXIuJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBjIG9mIFsneCcsICd5J10gYXMgQ2hhbm5lbFtdKSB7XG4gICAgICAgIGFzc2VydC5lcXVhbChydWxlcy5wYWRkaW5nT3V0ZXIodW5kZWZpbmVkLCBjLCAnYmFuZCcsIDAsIHtiYW5kUGFkZGluZ091dGVyOiAxNn0pLCAxNik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCBiZSBwYWRkaW5nSW5uZXIvMiBmb3IgYmFuZCBzY2FsZSBpZiBjaGFubmVsIGlzIHggb3IgeSBhbmQgcGFkZGluZyBpcyBub3Qgc3BlY2lmaWVkIGFuZCBjb25maWcuc2NhbGUuYmFuZFBhZGRpbmdPdXRlci4nLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGMgb2YgWyd4JywgJ3knXSBhcyBDaGFubmVsW10pIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHJ1bGVzLnBhZGRpbmdPdXRlcih1bmRlZmluZWQsIGMsICdiYW5kJywgMTAsIHt9KSwgNSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGJlIHVuZGVmaW5lZCBmb3Igbm9uLXh5IGNoYW5uZWxzLicsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgYyBvZiBOT05QT1NJVElPTl9TQ0FMRV9DSEFOTkVMUykge1xuICAgICAgICBmb3IgKGNvbnN0IHNjYWxlVHlwZSBvZiBbJ3BvaW50JywgJ2JhbmQnXSBhcyBTY2FsZVR5cGVbXSkge1xuICAgICAgICAgIGFzc2VydC5lcXVhbChydWxlcy5wYWRkaW5nT3V0ZXIodW5kZWZpbmVkLCBjLCBzY2FsZVR5cGUsIDAsIHt9KSwgdW5kZWZpbmVkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncmV2ZXJzZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIGZvciBhIGNvbnRpbnVvdXMgc2NhbGUgd2l0aCBzb3J0ID0gXCJkZXNjZW5kaW5nXCIuJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShydWxlcy5yZXZlcnNlKCdsaW5lYXInLCAnZGVzY2VuZGluZycpKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIGZvciBhIGRpc2NyZXRlIHNjYWxlIHdpdGggc29ydCA9IFwiZGVzY2VuZGluZ1wiLicsICgpID0+IHtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChydWxlcy5yZXZlcnNlKCdwb2ludCcsICdkZXNjZW5kaW5nJykpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnemVybycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIHdoZW4gbWFwcGluZyBhIHF1YW50aXRhdGl2ZSBmaWVsZCB0byB4IHdpdGggc2NhbGUuZG9tYWluID0gXCJ1bmFnZ3JlZ2F0ZWRcIicsICgpID0+IHtcbiAgICAgIGFzc2VydChydWxlcy56ZXJvKCd4Jywge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSwgJ3VuYWdncmVnYXRlZCcpKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgd2hlbiBtYXBwaW5nIGEgcXVhbnRpdGF0aXZlIGZpZWxkIHRvIHNpemUnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQocnVsZXMuemVybygnc2l6ZScsIHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sIHVuZGVmaW5lZCkpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZmFsc2Ugd2hlbiBtYXBwaW5nIGEgb3JkaW5hbCBmaWVsZCB0byBzaXplJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0KCFydWxlcy56ZXJvKCdzaXplJywge2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJ30sIHVuZGVmaW5lZCkpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSB3aGVuIG1hcHBpbmcgYSBub24tYmlubmVkIHF1YW50aXRhdGl2ZSBmaWVsZCB0byB4L3knLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgWyd4JywgJ3knXSBhcyBDaGFubmVsW10pIHtcbiAgICAgICAgYXNzZXJ0KHJ1bGVzLnplcm8oY2hhbm5lbCwge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSwgdW5kZWZpbmVkKSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSB3aGVuIG1hcHBpbmcgYSBiaW5uZWQgcXVhbnRpdGF0aXZlIGZpZWxkIHRvIHgveScsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBbJ3gnLCAneSddIGFzIENoYW5uZWxbXSkge1xuICAgICAgICBhc3NlcnQoIXJ1bGVzLnplcm8oY2hhbm5lbCwge2JpbjogdHJ1ZSwgZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LCB1bmRlZmluZWQpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIHdoZW4gbWFwcGluZyBhIG5vbi1iaW5uZWQgcXVhbnRpdGF0aXZlIGZpZWxkIHdpdGggY3VzdG9tIGRvbWFpbiB0byB4L3knLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgWyd4JywgJ3knXSBhcyBDaGFubmVsW10pIHtcbiAgICAgICAgYXNzZXJ0KCFydWxlcy56ZXJvKGNoYW5uZWwsIHtcbiAgICAgICAgICBiaW46IHRydWUsIGZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnXG4gICAgICAgIH0sIFszLCA1XSkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19