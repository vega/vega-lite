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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydGllcy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL3NjYWxlL3Byb3BlcnRpZXMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOzs7QUFFOUIsNkJBQTRCO0FBRTVCLGdEQUF5RTtBQUd6RSxtRkFBK0Q7QUFDL0QsMENBQWtEO0FBRWxELFFBQVEsQ0FBQyxlQUFlLEVBQUU7SUFDeEIsUUFBUSxDQUFDLE1BQU0sRUFBRTtRQUNmLEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRTtZQUNwQyxLQUFnQixVQUF1QixFQUF2QixLQUFBLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBYyxFQUF2QixjQUF1QixFQUF2QixJQUF1QixFQUFFO2dCQUFwQyxJQUFNLENBQUMsU0FBQTtnQkFDVixhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxjQUFjLEVBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ3JFO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNENBQTRDLEVBQUU7WUFDL0MsS0FBZ0IsVUFBdUIsRUFBdkIsS0FBQSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQWMsRUFBdkIsY0FBdUIsRUFBdkIsSUFBdUIsRUFBRTtnQkFBcEMsSUFBTSxDQUFDLFNBQUE7Z0JBQ1YsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQ3JGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsOENBQThDLEVBQUU7WUFDakQsS0FBZ0IsVUFBdUIsRUFBdkIsS0FBQSxDQUFDLEdBQUcsRUFB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QUUsU0FBUyxFQUFFLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUMsQ0FBQzthQUN6RztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDRGQUE0RixFQUFFO1lBQy9GLEtBQXNCLFVBQXVCLEVBQXZCLEtBQUEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFjLEVBQXZCLGNBQXVCLEVBQXZCLElBQXVCLEVBQUU7Z0JBQTFDLElBQU0sT0FBTyxTQUFBO2dCQUNoQixhQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtvQkFDMUIsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjO2lCQUM1QyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUMsQ0FBQzthQUM5QjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCB7Q2hhbm5lbCwgTk9OUE9TSVRJT05fU0NBTEVfQ0hBTk5FTFN9IGZyb20gJy4uLy4uLy4uL3NyYy9jaGFubmVsJztcbmltcG9ydCB7U2NhbGVUeXBlfSBmcm9tICcuLi8uLi8uLi9zcmMvc2NhbGUnO1xuXG5pbXBvcnQgKiBhcyBydWxlcyBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9wcm9wZXJ0aWVzJztcbmltcG9ydCB7QVJFQSwgQkFSLCBMSU5FfSBmcm9tICcuLi8uLi8uLi9zcmMvbWFyayc7XG5cbmRlc2NyaWJlKCdjb21waWxlL3NjYWxlJywgKCkgPT4ge1xuICBkZXNjcmliZSgnbmljZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiBuaWNlIGZvciB4IGFuZCB5LicsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgYyBvZiBbJ3gnLCAneSddIGFzIENoYW5uZWxbXSkge1xuICAgICAgICBhc3NlcnQuZXF1YWwocnVsZXMubmljZSgnbGluZWFyJywgYywge3R5cGU6ICdxdWFudGl0YXRpdmUnfSksIHRydWUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmV0dXJuIG5pY2UgZm9yIGJpbm5lZCB4IGFuZCB5LicsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgYyBvZiBbJ3gnLCAneSddIGFzIENoYW5uZWxbXSkge1xuICAgICAgICBhc3NlcnQuZXF1YWwocnVsZXMubmljZSgnbGluZWFyJywgYywge3R5cGU6ICdxdWFudGl0YXRpdmUnLCBiaW46IHRydWV9KSwgdW5kZWZpbmVkKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHJldHVybiBuaWNlIGZvciB0ZW1wb3JhbCB4IGFuZCB5LicsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgYyBvZiBbJ3gnLCAneSddIGFzIENoYW5uZWxbXSkge1xuICAgICAgICBhc3NlcnQuZXF1YWwocnVsZXMubmljZSgndGltZScsIGMsIHt0eXBlOiAndGVtcG9yYWwnfSksIHVuZGVmaW5lZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdwYWRkaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgcG9pbnRQYWRkaW5nIGZvciBwb2ludCBzY2FsZSBpZiBjaGFubmVsIGlzIHggb3IgeSBhbmQgcGFkZGluZyBpcyBub3Qgc3BlY2lmaWVkLicsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgYyBvZiBbJ3gnLCAneSddIGFzIENoYW5uZWxbXSkge1xuICAgICAgICBhc3NlcnQuZXF1YWwocnVsZXMucGFkZGluZyhjLCAncG9pbnQnLCB7cG9pbnRQYWRkaW5nOiAxM30sIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpLCAxMyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGJlIGNvbnRpbnVvdXNCYW5kU2l6ZSBmb3IgbGluZWFyIHgtc2NhbGUgb2YgdmVydGljYWwgYmFyLicsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChydWxlcy5wYWRkaW5nKCd4JywgJ2xpbmVhcicsIHt9LCB7ZmllbGQ6ICdkYXRlJywgdHlwZTogJ3RlbXBvcmFsJ30sIHt0eXBlOiAnYmFyJywgb3JpZW50OiAndmVydGljYWwnfSwge2NvbnRpbnVvdXNCYW5kU2l6ZTogMTN9KSwgMTMpO1xuICAgIH0pO1xuXG5cbiAgICBpdCgnc2hvdWxkIGJlIHVuZGVmaW5lZCBmb3IgbGluZWFyIHgtc2NhbGUgZm9yIGJpbm5lZCBmaWVsZCBvZiB2ZXJ0aWNhbCBiYXIuJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKHJ1bGVzLnBhZGRpbmcoJ3gnLCAnbGluZWFyJywge30sIHtiaW46IHRydWUsIGZpZWxkOiAnZGF0ZScsIHR5cGU6ICd0ZW1wb3JhbCd9LCB7dHlwZTogJ2JhcicsIG9yaWVudDogJ3ZlcnRpY2FsJ30sIHtjb250aW51b3VzQmFuZFNpemU6IDEzfSksIHVuZGVmaW5lZCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGJlIGNvbnRpbnVvdXNCYW5kU2l6ZSBmb3IgbGluZWFyIHktc2NhbGUgb2YgaG9yaXpvbnRhbCBiYXIuJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKHJ1bGVzLnBhZGRpbmcoJ3knLCAnbGluZWFyJywge30sIHtmaWVsZDogJ2RhdGUnLCB0eXBlOiAndGVtcG9yYWwnfSwge3R5cGU6ICdiYXInLCBvcmllbnQ6ICdob3Jpem9udGFsJ30sIHtjb250aW51b3VzQmFuZFNpemU6IDEzfSksIDEzKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3BhZGRpbmdJbm5lcicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGJlIHVuZGVmaW5lZCBpZiBwYWRkaW5nIGlzIHNwZWNpZmllZC4nLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwocnVsZXMucGFkZGluZ0lubmVyKDEwLCAneCcsIHt9KSwgdW5kZWZpbmVkKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYmUgYmFuZFBhZGRpbmdJbm5lciBpZiBjaGFubmVsIGlzIHggb3IgeSBhbmQgcGFkZGluZyBpcyBub3Qgc3BlY2lmaWVkLicsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChydWxlcy5wYWRkaW5nSW5uZXIodW5kZWZpbmVkLCAneCcsIHtiYW5kUGFkZGluZ0lubmVyOiAxNX0pLCAxNSk7XG4gICAgICBhc3NlcnQuZXF1YWwocnVsZXMucGFkZGluZ0lubmVyKHVuZGVmaW5lZCwgJ3knLCB7YmFuZFBhZGRpbmdJbm5lcjogMTV9KSwgMTUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBiZSB1bmRlZmluZWQgZm9yIG5vbi14eSBjaGFubmVscy4nLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGMgb2YgTk9OUE9TSVRJT05fU0NBTEVfQ0hBTk5FTFMpIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHJ1bGVzLnBhZGRpbmdJbm5lcih1bmRlZmluZWQsIGMsIHtiYW5kUGFkZGluZ0lubmVyOiAxNX0pLCB1bmRlZmluZWQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncGFkZGluZ091dGVyJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgdW5kZWZpbmVkIGlmIHBhZGRpbmcgaXMgc3BlY2lmaWVkLicsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3Qgc2NhbGVUeXBlIG9mIFsncG9pbnQnLCAnYmFuZCddIGFzIFNjYWxlVHlwZVtdKSB7XG4gICAgICAgIGFzc2VydC5lcXVhbChydWxlcy5wYWRkaW5nT3V0ZXIoMTAsICd4Jywgc2NhbGVUeXBlLCAwLCB7fSksIHVuZGVmaW5lZCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGJlIGNvbmZpZy5zY2FsZS5iYW5kUGFkZGluZ091dGVyIGZvciBiYW5kIHNjYWxlIGlmIGNoYW5uZWwgaXMgeCBvciB5IGFuZCBwYWRkaW5nIGlzIG5vdCBzcGVjaWZpZWQgYW5kIGNvbmZpZy5zY2FsZS5iYW5kUGFkZGluZ091dGVyLicsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgYyBvZiBbJ3gnLCAneSddIGFzIENoYW5uZWxbXSkge1xuICAgICAgICBhc3NlcnQuZXF1YWwocnVsZXMucGFkZGluZ091dGVyKHVuZGVmaW5lZCwgYywgJ2JhbmQnLCAwLCB7YmFuZFBhZGRpbmdPdXRlcjogMTZ9KSwgMTYpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGl0KCdzaG91bGQgYmUgcGFkZGluZ0lubmVyLzIgZm9yIGJhbmQgc2NhbGUgaWYgY2hhbm5lbCBpcyB4IG9yIHkgYW5kIHBhZGRpbmcgaXMgbm90IHNwZWNpZmllZCBhbmQgY29uZmlnLnNjYWxlLmJhbmRQYWRkaW5nT3V0ZXIuJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBjIG9mIFsneCcsICd5J10gYXMgQ2hhbm5lbFtdKSB7XG4gICAgICAgIGFzc2VydC5lcXVhbChydWxlcy5wYWRkaW5nT3V0ZXIodW5kZWZpbmVkLCBjLCAnYmFuZCcsIDEwLCB7fSksIDUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBiZSB1bmRlZmluZWQgZm9yIG5vbi14eSBjaGFubmVscy4nLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGMgb2YgTk9OUE9TSVRJT05fU0NBTEVfQ0hBTk5FTFMpIHtcbiAgICAgICAgZm9yIChjb25zdCBzY2FsZVR5cGUgb2YgWydwb2ludCcsICdiYW5kJ10gYXMgU2NhbGVUeXBlW10pIHtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwocnVsZXMucGFkZGluZ091dGVyKHVuZGVmaW5lZCwgYywgc2NhbGVUeXBlLCAwLCB7fSksIHVuZGVmaW5lZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3JldmVyc2UnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSBmb3IgYSBjb250aW51b3VzIHNjYWxlIHdpdGggc29ydCA9IFwiZGVzY2VuZGluZ1wiLicsICgpID0+IHtcbiAgICAgIGFzc2VydC5pc1RydWUocnVsZXMucmV2ZXJzZSgnbGluZWFyJywgJ2Rlc2NlbmRpbmcnKSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSBmb3IgYSBkaXNjcmV0ZSBzY2FsZSB3aXRoIHNvcnQgPSBcImRlc2NlbmRpbmdcIi4nLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQocnVsZXMucmV2ZXJzZSgncG9pbnQnLCAnZGVzY2VuZGluZycpKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3plcm8nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSB3aGVuIG1hcHBpbmcgYSBxdWFudGl0YXRpdmUgZmllbGQgdG8geCB3aXRoIHNjYWxlLmRvbWFpbiA9IFwidW5hZ2dyZWdhdGVkXCInLCAoKSA9PiB7XG4gICAgICBhc3NlcnQocnVsZXMuemVybygneCcsIHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sICd1bmFnZ3JlZ2F0ZWQnLCB7dHlwZTogJ3BvaW50J30pKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgd2hlbiBtYXBwaW5nIGEgcXVhbnRpdGF0aXZlIGZpZWxkIHRvIHNpemUnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQocnVsZXMuemVybygnc2l6ZScsIHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sIHVuZGVmaW5lZCwge3R5cGU6ICdwb2ludCd9KSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSB3aGVuIG1hcHBpbmcgYSBvcmRpbmFsIGZpZWxkIHRvIHNpemUnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQoIXJ1bGVzLnplcm8oJ3NpemUnLCB7ZmllbGQ6ICdhJywgdHlwZTogJ29yZGluYWwnfSwgdW5kZWZpbmVkLCB7dHlwZTogJ3BvaW50J30pKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgd2hlbiBtYXBwaW5nIGEgbm9uLWJpbm5lZCBxdWFudGl0YXRpdmUgZmllbGQgdG8geC95IG9mIHBvaW50JywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBjaGFubmVsIG9mIFsneCcsICd5J10gYXMgQ2hhbm5lbFtdKSB7XG4gICAgICAgIGFzc2VydChydWxlcy56ZXJvKGNoYW5uZWwsIHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sIHVuZGVmaW5lZCwge3R5cGU6ICdwb2ludCd9KSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSB3aGVuIG1hcHBpbmcgYSBxdWFudGl0YXRpdmUgZmllbGQgdG8gZGltZW5zaW9uIGF4aXMgb2YgYmFyLCBsaW5lLCBhbmQgYXJlYScsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgbWFyayBvZiBbQkFSLCBBUkVBLCBMSU5FXSkge1xuICAgICAgICBhc3NlcnQuaXNGYWxzZShydWxlcy56ZXJvKCd4Jywge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSwgdW5kZWZpbmVkLCB7dHlwZTogbWFyaywgb3JpZW50OiAndmVydGljYWwnfSkpO1xuICAgICAgICBhc3NlcnQuaXNGYWxzZShydWxlcy56ZXJvKCd5Jywge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSwgdW5kZWZpbmVkLCB7dHlwZTogbWFyaywgb3JpZW50OiAnaG9yaXpvbnRhbCd9KSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSB3aGVuIG1hcHBpbmcgYSBiaW5uZWQgcXVhbnRpdGF0aXZlIGZpZWxkIHRvIHgveScsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBbJ3gnLCAneSddIGFzIENoYW5uZWxbXSkge1xuICAgICAgICBhc3NlcnQoIXJ1bGVzLnplcm8oY2hhbm5lbCwge2JpbjogdHJ1ZSwgZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LCB1bmRlZmluZWQsIHt0eXBlOiAncG9pbnQnfSkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZmFsc2Ugd2hlbiBtYXBwaW5nIGEgbm9uLWJpbm5lZCBxdWFudGl0YXRpdmUgZmllbGQgd2l0aCBjdXN0b20gZG9tYWluIHRvIHgveScsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBbJ3gnLCAneSddIGFzIENoYW5uZWxbXSkge1xuICAgICAgICBhc3NlcnQoIXJ1bGVzLnplcm8oY2hhbm5lbCwge1xuICAgICAgICAgIGJpbjogdHJ1ZSwgZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSdcbiAgICAgICAgfSwgWzMsIDVdLCB7dHlwZTogJ3BvaW50J30pKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==