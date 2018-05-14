/* tslint:disable quotemark */
// TODO:
// test mark-tick with the following test cases,
// looking at mark-point.test.ts as inspiration
//
// After finishing all test, make sure all lines in mark-tick.ts is tested
// (except the scaffold labels() method)
import { assert } from 'chai';
import { SIZE, X, Y } from '../../../src/channel';
import { tick } from '../../../src/compile/mark/tick';
import { parseUnitModelWithScaleAndLayoutSize } from '../../util';
describe('Mark: Tick', function () {
    describe('with stacked x', function () {
        // This is a simplified example for stacked tick.
        // In reality this will be used as stacked's overlayed marker
        var model = parseUnitModelWithScaleAndLayoutSize({
            "mark": "tick",
            "encoding": {
                "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                "color": { "field": "b", "type": "ordinal" }
            },
            "data": { "url": "data/barley.json" },
            "config": { "stack": "zero" }
        });
        var props = tick.encodeEntry(model);
        it('should use stack_end on x', function () {
            assert.deepEqual(props.xc, { scale: X, field: 'sum_a_end' });
        });
    });
    describe('with stacked y', function () {
        // This is a simplified example for stacked tick.
        // In reality this will be used as stacked's overlayed marker
        var model = parseUnitModelWithScaleAndLayoutSize({
            "mark": "tick",
            "encoding": {
                "y": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                "color": { "field": "b", "type": "ordinal" }
            },
            "data": { "url": "data/barley.json" },
            "config": { "stack": "zero" }
        });
        var props = tick.encodeEntry(model);
        it('should use stack_end on y', function () {
            assert.deepEqual(props.yc, { scale: Y, field: 'sum_a_end' });
        });
    });
    describe('with quantitative x', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            'mark': 'tick',
            'encoding': { 'x': { 'field': 'Horsepower', 'type': 'quantitative' } },
            'data': { 'url': 'data/cars.json' }
        });
        var props = tick.encodeEntry(model);
        it('should be centered on y', function () {
            assert.deepEqual(props.yc, {
                mult: 0.5,
                signal: 'height'
            });
        });
        it('should scale on x', function () {
            assert.deepEqual(props.xc, { scale: X, field: 'Horsepower' });
        });
        it('width should tick thickness with orient vertical', function () {
            assert.deepEqual(props.width, { value: 1 });
        });
    });
    describe('with quantitative y', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            'mark': 'tick',
            'encoding': { 'y': { 'field': 'Cylinders', 'type': 'quantitative' } },
            'data': { 'url': 'data/cars.json' }
        });
        var props = tick.encodeEntry(model);
        it('should be centered on x', function () {
            assert.deepEqual(props.xc, {
                mult: 0.5,
                signal: 'width'
            });
        });
        it('should scale on y', function () {
            assert.deepEqual(props.yc, { scale: Y, field: 'Cylinders' });
        });
        it('height should tick thickness with orient horizontal', function () {
            assert.deepEqual(props.height, { value: 1 });
        });
    });
    describe('with quantitative x and ordinal y', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            'mark': 'tick',
            'encoding': {
                'x': { 'field': 'Horsepower', 'type': 'quantitative' },
                'y': { 'field': 'Cylinders', 'type': 'ordinal' }
            },
            'data': { 'url': 'data/cars.json' }
        });
        var props = tick.encodeEntry(model);
        it('should scale on x', function () {
            assert.deepEqual(props.xc, { scale: X, field: 'Horsepower' });
        });
        it('should scale on y', function () {
            assert.deepEqual(props.yc, { scale: Y, field: 'Cylinders' });
        });
        it('wiidth should be tick thickness with default orient vertical', function () {
            assert.deepEqual(props.width, { value: 1 });
        });
        it('height should be matched to field with default orient vertical', function () {
            assert.deepEqual(props.height, { value: 14 });
        });
    });
    describe('vertical ticks', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            'mark': 'tick',
            'config': { 'mark': { 'orient': 'vertical' } },
            'encoding': {
                'x': { 'field': 'Horsepower', 'type': 'quantitative' },
                'y': { 'field': 'Cylinders', 'type': 'ordinal' },
                'size': { 'field': 'Acceleration', 'type': 'quantitative' }
            },
            'data': { 'url': 'data/cars.json' },
        });
        var props = tick.encodeEntry(model);
        it('maps size to height', function () {
            assert.deepEqual(props.height, { 'field': 'Acceleration', 'scale': SIZE });
        });
    });
    describe('vertical ticks with size in mark def', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            'mark': { 'type': 'tick', 'size': 5 },
            'encoding': {
                'x': { 'field': 'Horsepower', 'type': 'quantitative' },
                'y': { 'field': 'Cylinders', 'type': 'ordinal' }
            },
            'data': { 'url': 'data/cars.json' },
        });
        var props = tick.encodeEntry(model);
        it('maps size to height in Vega', function () {
            assert.deepEqual(props.height, { value: 5 });
        });
    });
    describe('vertical ticks (implicit)', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            'mark': 'tick',
            'encoding': {
                'x': { 'field': 'Horsepower', 'type': 'quantitative' },
                'y': { 'field': 'Cylinders', 'type': 'ordinal' },
                'size': { 'field': 'Acceleration', 'type': 'quantitative' }
            },
            'data': { 'url': 'data/cars.json' },
        });
        var props = tick.encodeEntry(model);
        it('maps size to height in Vega', function () {
            assert.deepEqual(props.height, { 'field': 'Acceleration', 'scale': SIZE });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGljay50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL21hcmsvdGljay50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4QjtBQUc5QixRQUFRO0FBQ1IsZ0RBQWdEO0FBQ2hELCtDQUErQztBQUMvQyxFQUFFO0FBQ0YsMEVBQTBFO0FBQzFFLHdDQUF3QztBQUN4QyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzVCLE9BQU8sRUFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ2hELE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNwRCxPQUFPLEVBQUMsb0NBQW9DLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFaEUsUUFBUSxDQUFDLFlBQVksRUFBRTtJQUNyQixRQUFRLENBQUMsZ0JBQWdCLEVBQUU7UUFDekIsaURBQWlEO1FBQ2pELDZEQUE2RDtRQUM3RCxJQUFNLEtBQUssR0FBRyxvQ0FBb0MsQ0FBQztZQUNqRCxNQUFNLEVBQUUsTUFBTTtZQUNkLFVBQVUsRUFBRTtnQkFDVixHQUFHLEVBQUUsRUFBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBQztnQkFDL0QsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO2FBQzNDO1lBQ0QsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFDO1lBQ25DLFFBQVEsRUFBRSxFQUFDLE9BQU8sRUFBRyxNQUFNLEVBQUM7U0FDN0IsQ0FBQyxDQUFDO1FBRUgsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV0QyxFQUFFLENBQUMsMkJBQTJCLEVBQUU7WUFDOUIsTUFBTSxDQUFD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Y0FBYyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7YUFDMUQ7WUFDSCxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUM7U0FDbEMsQ0FBQyxDQUFDO1FBQ0gsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QyxFQUFFLENBQUMsNkJBQTZCLEVBQUU7WUFDaEMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEVBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUMzRSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZSBxdW90ZW1hcmsgKi9cblxuXG4vLyBUT0RPOlxuLy8gdGVzdCBtYXJrLXRpY2sgd2l0aCB0aGUgZm9sbG93aW5nIHRlc3QgY2FzZXMsXG4vLyBsb29raW5nIGF0IG1hcmstcG9pbnQudGVzdC50cyBhcyBpbnNwaXJhdGlvblxuLy9cbi8vIEFmdGVyIGZpbmlzaGluZyBhbGwgdGVzdCwgbWFrZSBzdXJlIGFsbCBsaW5lcyBpbiBtYXJrLXRpY2sudHMgaXMgdGVzdGVkXG4vLyAoZXhjZXB0IHRoZSBzY2FmZm9sZCBsYWJlbHMoKSBtZXRob2QpXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge1NJWkUsIFgsIFl9IGZyb20gJy4uLy4uLy4uL3NyYy9jaGFubmVsJztcbmltcG9ydCB7dGlja30gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvbWFyay90aWNrJztcbmltcG9ydCB7cGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplfSBmcm9tICcuLi8uLi91dGlsJztcblxuZGVzY3JpYmUoJ01hcms6IFRpY2snLCBmdW5jdGlvbigpIHtcbiAgZGVzY3JpYmUoJ3dpdGggc3RhY2tlZCB4JywgZnVuY3Rpb24oKSB7XG4gICAgLy8gVGhpcyBpcyBhIHNpbXBsaWZpZWQgZXhhbXBsZSBmb3Igc3RhY2tlZCB0aWNrLlxuICAgIC8vIEluIHJlYWxpdHkgdGhpcyB3aWxsIGJlIHVzZWQgYXMgc3RhY2tlZCdzIG92ZXJsYXllZCBtYXJrZXJcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcIm1hcmtcIjogXCJ0aWNrXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn1cbiAgICAgIH0sXG4gICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgIFwiY29uZmlnXCI6IHtcInN0YWNrXCI6ICBcInplcm9cIn1cbiAgICB9KTtcblxuICAgIGNvbnN0IHByb3BzID0gdGljay5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIHVzZSBzdGFja19lbmQgb24geCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54Yywge3NjYWxlOiBYLCBmaWVsZDogJ3N1bV9hX2VuZCd9KTtcbiAgICB9KTtcbiAgfSk7XG5cblxuICBkZXNjcmliZSgnd2l0aCBzdGFja2VkIHknLCBmdW5jdGlvbigpIHtcbiAgICAvLyBUaGlzIGlzIGEgc2ltcGxpZmllZCBleGFtcGxlIGZvciBzdGFja2VkIHRpY2suXG4gICAgLy8gSW4gcmVhbGl0eSB0aGlzIHdpbGwgYmUgdXNlZCBhcyBzdGFja2VkJ3Mgb3ZlcmxheWVkIG1hcmtlclxuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwibWFya1wiOiBcInRpY2tcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInlcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcImJcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifVxuICAgICAgfSxcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgXCJjb25maWdcIjoge1wic3RhY2tcIjogIFwiemVyb1wifVxuICAgIH0pO1xuXG4gICAgY29uc3QgcHJvcHMgPSB0aWNrLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgdXNlIHN0YWNrX2VuZCBvbiB5JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnljLCB7c2NhbGU6IFksIGZpZWxkOiAnc3VtX2FfZW5kJ30pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2l0aCBxdWFudGl0YXRpdmUgeCcsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICdtYXJrJzogJ3RpY2snLFxuICAgICAgJ2VuY29kaW5nJzogeyd4JzogeydmaWVsZCc6ICdIb3JzZXBvd2VyJywgJ3R5cGUnOiAncXVhbnRpdGF0aXZlJ319LFxuICAgICAgJ2RhdGEnOiB7J3VybCc6ICdkYXRhL2NhcnMuanNvbid9XG4gICAgfSk7XG5cbiAgICBjb25zdCBwcm9wcyA9IHRpY2suZW5jb2RlRW50cnkobW9kZWwpO1xuICAgIGl0KCdzaG91bGQgYmUgY2VudGVyZWQgb24geScsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55Yywge1xuICAgICAgICBtdWx0OiAwLjUsXG4gICAgICAgIHNpZ25hbDogJ2hlaWdodCdcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzY2FsZSBvbiB4JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnhjLCB7c2NhbGU6IFgsIGZpZWxkOiAnSG9yc2Vwb3dlcid9KTtcbiAgICB9KTtcblxuICAgIGl0KCd3aWR0aCBzaG91bGQgdGljayB0aGlja25lc3Mgd2l0aCBvcmllbnQgdmVydGljYWwnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMud2lkdGgsIHt2YWx1ZTogMX0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2l0aCBxdWFudGl0YXRpdmUgeScsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICdtYXJrJzogJ3RpY2snLFxuICAgICAgJ2VuY29kaW5nJzogeyd5JzogeydmaWVsZCc6ICdDeWxpbmRlcnMnLCd0eXBlJzogJ3F1YW50aXRhdGl2ZSd9fSxcbiAgICAgICdkYXRhJzogeyd1cmwnOiAnZGF0YS9jYXJzLmpzb24nfVxuICAgIH0pO1xuXG4gICAgY29uc3QgcHJvcHMgPSB0aWNrLmVuY29kZUVudHJ5KG1vZGVsKTtcbiAgICBpdCgnc2hvdWxkIGJlIGNlbnRlcmVkIG9uIHgnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueGMsIHtcbiAgICAgICAgbXVsdDogMC41LFxuICAgICAgICBzaWduYWw6ICd3aWR0aCdcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzY2FsZSBvbiB5JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnljLCB7c2NhbGU6IFksIGZpZWxkOiAnQ3lsaW5kZXJzJ30pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2hlaWdodCBzaG91bGQgdGljayB0aGlja25lc3Mgd2l0aCBvcmllbnQgaG9yaXpvbnRhbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5oZWlnaHQsIHt2YWx1ZTogMX0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2l0aCBxdWFudGl0YXRpdmUgeCBhbmQgb3JkaW5hbCB5JywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgJ21hcmsnOiAndGljaycsXG4gICAgICAnZW5jb2RpbmcnOlxuICAgICAgICB7XG4gICAgICAgICAgJ3gnOiB7J2ZpZWxkJzogJ0hvcnNlcG93ZXInLCAndHlwZSc6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICAneSc6IHsnZmllbGQnOiAnQ3lsaW5kZXJzJywndHlwZSc6ICdvcmRpbmFsJ31cbiAgICAgICAgfSxcbiAgICAgICdkYXRhJzogeyd1cmwnOiAnZGF0YS9jYXJzLmpzb24nfVxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gdGljay5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIHNjYWxlIG9uIHgnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueGMsIHtzY2FsZTogWCwgZmllbGQ6ICdIb3JzZXBvd2VyJ30pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzY2FsZSBvbiB5JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnljLCB7c2NhbGU6IFksIGZpZWxkOiAnQ3lsaW5kZXJzJ30pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3dpaWR0aCBzaG91bGQgYmUgdGljayB0aGlja25lc3Mgd2l0aCBkZWZhdWx0IG9yaWVudCB2ZXJ0aWNhbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy53aWR0aCwge3ZhbHVlOiAxfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnaGVpZ2h0IHNob3VsZCBiZSBtYXRjaGVkIHRvIGZpZWxkIHdpdGggZGVmYXVsdCBvcmllbnQgdmVydGljYWwnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuaGVpZ2h0LCB7dmFsdWU6IDE0fSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd2ZXJ0aWNhbCB0aWNrcycsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAnbWFyayc6ICd0aWNrJyxcbiAgICAgICdjb25maWcnOiB7J21hcmsnOiB7J29yaWVudCc6ICd2ZXJ0aWNhbCd9fSxcbiAgICAgICdlbmNvZGluZyc6XG4gICAgICAgIHtcbiAgICAgICAgICAneCc6IHsnZmllbGQnOiAnSG9yc2Vwb3dlcicsICd0eXBlJzogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICAgICd5JzogeydmaWVsZCc6ICdDeWxpbmRlcnMnLCAndHlwZSc6ICdvcmRpbmFsJ30sXG4gICAgICAgICAgJ3NpemUnOiB7J2ZpZWxkJzogJ0FjY2VsZXJhdGlvbicsICd0eXBlJzogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgIH0sXG4gICAgICAnZGF0YSc6IHsndXJsJzogJ2RhdGEvY2Fycy5qc29uJ30sXG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSB0aWNrLmVuY29kZUVudHJ5KG1vZGVsKTtcbiAgICBpdCgnbWFwcyBzaXplIHRvIGhlaWdodCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuaGVpZ2h0LCB7J2ZpZWxkJzogJ0FjY2VsZXJhdGlvbicsICdzY2FsZSc6IFNJWkV9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3ZlcnRpY2FsIHRpY2tzIHdpdGggc2l6ZSBpbiBtYXJrIGRlZicsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAnbWFyayc6IHsndHlwZSc6ICd0aWNrJywgJ3NpemUnOiA1fSxcbiAgICAgICdlbmNvZGluZyc6XG4gICAgICAgIHtcbiAgICAgICAgICAneCc6IHsnZmllbGQnOiAnSG9yc2Vwb3dlcicsICd0eXBlJzogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICAgICd5JzogeydmaWVsZCc6ICdDeWxpbmRlcnMnLCAndHlwZSc6ICdvcmRpbmFsJ31cbiAgICAgICAgfSxcbiAgICAgICdkYXRhJzogeyd1cmwnOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IHRpY2suZW5jb2RlRW50cnkobW9kZWwpO1xuICAgIGl0KCdtYXBzIHNpemUgdG8gaGVpZ2h0IGluIFZlZ2EnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLmhlaWdodCwge3ZhbHVlOiA1fSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd2ZXJ0aWNhbCB0aWNrcyAoaW1wbGljaXQpJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgJ21hcmsnOiAndGljaycsXG4gICAgICAnZW5jb2RpbmcnOlxuICAgICAgICB7XG4gICAgICAgICAgJ3gnOiB7J2ZpZWxkJzogJ0hvcnNlcG93ZXInLCAndHlwZSc6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICAneSc6IHsnZmllbGQnOiAnQ3lsaW5kZXJzJywgJ3R5cGUnOiAnb3JkaW5hbCd9LFxuICAgICAgICAgICdzaXplJzogeydmaWVsZCc6ICdBY2NlbGVyYXRpb24nLCAndHlwZSc6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICB9LFxuICAgICAgJ2RhdGEnOiB7J3VybCc6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gdGljay5lbmNvZGVFbnRyeShtb2RlbCk7XG4gICAgaXQoJ21hcHMgc2l6ZSB0byBoZWlnaHQgaW4gVmVnYScsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5oZWlnaHQsIHsnZmllbGQnOiAnQWNjZWxlcmF0aW9uJywgJ3NjYWxlJzogU0laRX0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19