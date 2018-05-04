"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var rules = require("../../../src/compile/scale/properties");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydGllcy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL3NjYWxlL3Byb3BlcnRpZXMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFFNUIsZ0RBQXlFO0FBR3pFLDZEQUErRDtBQUMvRCwwQ0FBa0Q7QUFFbEQsUUFBUSxDQUFDLGVBQWUsRUFBRTtJQUN4QixRQUFRLENBQUMsTUFBTSxFQUFFO1FBQ2YsRUFBRSxDQUFDLGlDQUFpQyxFQUFFO1lBQ3BDLEtBQWdCLFVBQXVCLEVBQXZCLEtBQUEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFjLEVBQXZCLGNBQXVCLEVBQXZCLElBQXVCO2dCQUFsQyxJQUFNLENBQUMsU0FBQTtnQkFDVixhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxjQUFjLEVBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ3JFO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNENBQTRDLEVBQUU7WUFDL0MsS0FBZ0IsVUFBdUIsRUFBdkIsS0FBQSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQWMsRUFBdkIsY0FBdUIsRUFBdkIsSUFBdUI7Z0JBQWxDLElBQU0sQ0FBQyxTQUFBO2dCQUNWLGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQzthQUNyRjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDhDQUE4QyxFQUFFO1lBQ2pELEtBQWdCLFVBQXVCLEVBQXZCLEtBQUEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFj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QUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDRGQUE0RixFQUFFO1lBQy9GLEtBQXNCLFVBQXVCLEVBQXZCLEtBQUEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFjLEVBQXZCLGNBQXVCLEVBQXZCLElBQXVCO2dCQUF4QyxJQUFNLE9BQU8sU0FBQTtnQkFDaEIsYUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7b0JBQzFCLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYztpQkFDNUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLENBQUM7YUFDOUI7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuXG5pbXBvcnQge0NoYW5uZWwsIE5PTlBPU0lUSU9OX1NDQUxFX0NIQU5ORUxTfSBmcm9tICcuLi8uLi8uLi9zcmMvY2hhbm5lbCc7XG5pbXBvcnQge1NjYWxlVHlwZX0gZnJvbSAnLi4vLi4vLi4vc3JjL3NjYWxlJztcblxuaW1wb3J0ICogYXMgcnVsZXMgZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2NhbGUvcHJvcGVydGllcyc7XG5pbXBvcnQge0FSRUEsIEJBUiwgTElORX0gZnJvbSAnLi4vLi4vLi4vc3JjL21hcmsnO1xuXG5kZXNjcmliZSgnY29tcGlsZS9zY2FsZScsICgpID0+IHtcbiAgZGVzY3JpYmUoJ25pY2UnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gbmljZSBmb3IgeCBhbmQgeS4nLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGMgb2YgWyd4JywgJ3knXSBhcyBDaGFubmVsW10pIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHJ1bGVzLm5pY2UoJ2xpbmVhcicsIGMsIHt0eXBlOiAncXVhbnRpdGF0aXZlJ30pLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHJldHVybiBuaWNlIGZvciBiaW5uZWQgeCBhbmQgeS4nLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGMgb2YgWyd4JywgJ3knXSBhcyBDaGFubmVsW10pIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHJ1bGVzLm5pY2UoJ2xpbmVhcicsIGMsIHt0eXBlOiAncXVhbnRpdGF0aXZlJywgYmluOiB0cnVlfSksIHVuZGVmaW5lZCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZXR1cm4gbmljZSBmb3IgdGVtcG9yYWwgeCBhbmQgeS4nLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGMgb2YgWyd4JywgJ3knXSBhcyBDaGFubmVsW10pIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHJ1bGVzLm5pY2UoJ3RpbWUnLCBjLCB7dHlwZTogJ3RlbXBvcmFsJ30pLCB1bmRlZmluZWQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncGFkZGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGJlIHBvaW50UGFkZGluZyBmb3IgcG9pbnQgc2NhbGUgaWYgY2hhbm5lbCBpcyB4IG9yIHkgYW5kIHBhZGRpbmcgaXMgbm90IHNwZWNpZmllZC4nLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGMgb2YgWyd4JywgJ3knXSBhcyBDaGFubmVsW10pIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHJ1bGVzLnBhZGRpbmcoYywgJ3BvaW50Jywge3BvaW50UGFkZGluZzogMTN9LCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKSwgMTMpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBiZSBjb250aW51b3VzQmFuZFNpemUgZm9yIGxpbmVhciB4LXNjYWxlIG9mIHZlcnRpY2FsIGJhci4nLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwocnVsZXMucGFkZGluZygneCcsICdsaW5lYXInLCB7fSwge2ZpZWxkOiAnZGF0ZScsIHR5cGU6ICd0ZW1wb3JhbCd9LCB7dHlwZTogJ2JhcicsIG9yaWVudDogJ3ZlcnRpY2FsJ30sIHtjb250aW51b3VzQmFuZFNpemU6IDEzfSksIDEzKTtcbiAgICB9KTtcblxuXG4gICAgaXQoJ3Nob3VsZCBiZSB1bmRlZmluZWQgZm9yIGxpbmVhciB4LXNjYWxlIGZvciBiaW5uZWQgZmllbGQgb2YgdmVydGljYWwgYmFyLicsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChydWxlcy5wYWRkaW5nKCd4JywgJ2xpbmVhcicsIHt9LCB7YmluOiB0cnVlLCBmaWVsZDogJ2RhdGUnLCB0eXBlOiAndGVtcG9yYWwnfSwge3R5cGU6ICdiYXInLCBvcmllbnQ6ICd2ZXJ0aWNhbCd9LCB7Y29udGludW91c0JhbmRTaXplOiAxM30pLCB1bmRlZmluZWQpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBiZSBjb250aW51b3VzQmFuZFNpemUgZm9yIGxpbmVhciB5LXNjYWxlIG9mIGhvcml6b250YWwgYmFyLicsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChydWxlcy5wYWRkaW5nKCd5JywgJ2xpbmVhcicsIHt9LCB7ZmllbGQ6ICdkYXRlJywgdHlwZTogJ3RlbXBvcmFsJ30sIHt0eXBlOiAnYmFyJywgb3JpZW50OiAnaG9yaXpvbnRhbCd9LCB7Y29udGludW91c0JhbmRTaXplOiAxM30pLCAxMyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdwYWRkaW5nSW5uZXInLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSB1bmRlZmluZWQgaWYgcGFkZGluZyBpcyBzcGVjaWZpZWQuJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKHJ1bGVzLnBhZGRpbmdJbm5lcigxMCwgJ3gnLCB7fSksIHVuZGVmaW5lZCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGJlIGJhbmRQYWRkaW5nSW5uZXIgaWYgY2hhbm5lbCBpcyB4IG9yIHkgYW5kIHBhZGRpbmcgaXMgbm90IHNwZWNpZmllZC4nLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwocnVsZXMucGFkZGluZ0lubmVyKHVuZGVmaW5lZCwgJ3gnLCB7YmFuZFBhZGRpbmdJbm5lcjogMTV9KSwgMTUpO1xuICAgICAgYXNzZXJ0LmVxdWFsKHJ1bGVzLnBhZGRpbmdJbm5lcih1bmRlZmluZWQsICd5Jywge2JhbmRQYWRkaW5nSW5uZXI6IDE1fSksIDE1KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYmUgdW5kZWZpbmVkIGZvciBub24teHkgY2hhbm5lbHMuJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBjIG9mIE5PTlBPU0lUSU9OX1NDQUxFX0NIQU5ORUxTKSB7XG4gICAgICAgIGFzc2VydC5lcXVhbChydWxlcy5wYWRkaW5nSW5uZXIodW5kZWZpbmVkLCBjLCB7YmFuZFBhZGRpbmdJbm5lcjogMTV9KSwgdW5kZWZpbmVkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3BhZGRpbmdPdXRlcicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGJlIHVuZGVmaW5lZCBpZiBwYWRkaW5nIGlzIHNwZWNpZmllZC4nLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IHNjYWxlVHlwZSBvZiBbJ3BvaW50JywgJ2JhbmQnXSBhcyBTY2FsZVR5cGVbXSkge1xuICAgICAgICBhc3NlcnQuZXF1YWwocnVsZXMucGFkZGluZ091dGVyKDEwLCAneCcsIHNjYWxlVHlwZSwgMCwge30pLCB1bmRlZmluZWQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBiZSBjb25maWcuc2NhbGUuYmFuZFBhZGRpbmdPdXRlciBmb3IgYmFuZCBzY2FsZSBpZiBjaGFubmVsIGlzIHggb3IgeSBhbmQgcGFkZGluZyBpcyBub3Qgc3BlY2lmaWVkIGFuZCBjb25maWcuc2NhbGUuYmFuZFBhZGRpbmdPdXRlci4nLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGMgb2YgWyd4JywgJ3knXSBhcyBDaGFubmVsW10pIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHJ1bGVzLnBhZGRpbmdPdXRlcih1bmRlZmluZWQsIGMsICdiYW5kJywgMCwge2JhbmRQYWRkaW5nT3V0ZXI6IDE2fSksIDE2KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIGJlIHBhZGRpbmdJbm5lci8yIGZvciBiYW5kIHNjYWxlIGlmIGNoYW5uZWwgaXMgeCBvciB5IGFuZCBwYWRkaW5nIGlzIG5vdCBzcGVjaWZpZWQgYW5kIGNvbmZpZy5zY2FsZS5iYW5kUGFkZGluZ091dGVyLicsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgYyBvZiBbJ3gnLCAneSddIGFzIENoYW5uZWxbXSkge1xuICAgICAgICBhc3NlcnQuZXF1YWwocnVsZXMucGFkZGluZ091dGVyKHVuZGVmaW5lZCwgYywgJ2JhbmQnLCAxMCwge30pLCA1KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYmUgdW5kZWZpbmVkIGZvciBub24teHkgY2hhbm5lbHMuJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBjIG9mIE5PTlBPU0lUSU9OX1NDQUxFX0NIQU5ORUxTKSB7XG4gICAgICAgIGZvciAoY29uc3Qgc2NhbGVUeXBlIG9mIFsncG9pbnQnLCAnYmFuZCddIGFzIFNjYWxlVHlwZVtdKSB7XG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKHJ1bGVzLnBhZGRpbmdPdXRlcih1bmRlZmluZWQsIGMsIHNjYWxlVHlwZSwgMCwge30pLCB1bmRlZmluZWQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdyZXZlcnNlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgZm9yIGEgY29udGludW91cyBzY2FsZSB3aXRoIHNvcnQgPSBcImRlc2NlbmRpbmdcIi4nLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuaXNUcnVlKHJ1bGVzLnJldmVyc2UoJ2xpbmVhcicsICdkZXNjZW5kaW5nJykpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZmFsc2UgZm9yIGEgZGlzY3JldGUgc2NhbGUgd2l0aCBzb3J0ID0gXCJkZXNjZW5kaW5nXCIuJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKHJ1bGVzLnJldmVyc2UoJ3BvaW50JywgJ2Rlc2NlbmRpbmcnKSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd6ZXJvJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgd2hlbiBtYXBwaW5nIGEgcXVhbnRpdGF0aXZlIGZpZWxkIHRvIHggd2l0aCBzY2FsZS5kb21haW4gPSBcInVuYWdncmVnYXRlZFwiJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0KHJ1bGVzLnplcm8oJ3gnLCB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LCAndW5hZ2dyZWdhdGVkJywge3R5cGU6ICdwb2ludCd9KSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIHdoZW4gbWFwcGluZyBhIHF1YW50aXRhdGl2ZSBmaWVsZCB0byBzaXplJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0KHJ1bGVzLnplcm8oJ3NpemUnLCB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LCB1bmRlZmluZWQsIHt0eXBlOiAncG9pbnQnfSkpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZmFsc2Ugd2hlbiBtYXBwaW5nIGEgb3JkaW5hbCBmaWVsZCB0byBzaXplJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0KCFydWxlcy56ZXJvKCdzaXplJywge2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJ30sIHVuZGVmaW5lZCwge3R5cGU6ICdwb2ludCd9KSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIHdoZW4gbWFwcGluZyBhIG5vbi1iaW5uZWQgcXVhbnRpdGF0aXZlIGZpZWxkIHRvIHgveSBvZiBwb2ludCcsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBbJ3gnLCAneSddIGFzIENoYW5uZWxbXSkge1xuICAgICAgICBhc3NlcnQocnVsZXMuemVybyhjaGFubmVsLCB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LCB1bmRlZmluZWQsIHt0eXBlOiAncG9pbnQnfSkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZmFsc2Ugd2hlbiBtYXBwaW5nIGEgcXVhbnRpdGF0aXZlIGZpZWxkIHRvIGRpbWVuc2lvbiBheGlzIG9mIGJhciwgbGluZSwgYW5kIGFyZWEnLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IG1hcmsgb2YgW0JBUiwgQVJFQSwgTElORV0pIHtcbiAgICAgICAgYXNzZXJ0LmlzRmFsc2UocnVsZXMuemVybygneCcsIHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sIHVuZGVmaW5lZCwge3R5cGU6IG1hcmssIG9yaWVudDogJ3ZlcnRpY2FsJ30pKTtcbiAgICAgICAgYXNzZXJ0LmlzRmFsc2UocnVsZXMuemVybygneScsIHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sIHVuZGVmaW5lZCwge3R5cGU6IG1hcmssIG9yaWVudDogJ2hvcml6b250YWwnfSkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZmFsc2Ugd2hlbiBtYXBwaW5nIGEgYmlubmVkIHF1YW50aXRhdGl2ZSBmaWVsZCB0byB4L3knLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgWyd4JywgJ3knXSBhcyBDaGFubmVsW10pIHtcbiAgICAgICAgYXNzZXJ0KCFydWxlcy56ZXJvKGNoYW5uZWwsIHtiaW46IHRydWUsIGZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSwgdW5kZWZpbmVkLCB7dHlwZTogJ3BvaW50J30pKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIHdoZW4gbWFwcGluZyBhIG5vbi1iaW5uZWQgcXVhbnRpdGF0aXZlIGZpZWxkIHdpdGggY3VzdG9tIGRvbWFpbiB0byB4L3knLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgWyd4JywgJ3knXSBhcyBDaGFubmVsW10pIHtcbiAgICAgICAgYXNzZXJ0KCFydWxlcy56ZXJvKGNoYW5uZWwsIHtcbiAgICAgICAgICBiaW46IHRydWUsIGZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnXG4gICAgICAgIH0sIFszLCA1XSwge3R5cGU6ICdwb2ludCd9KSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=