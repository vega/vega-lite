"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
// TODO:
// test mark-tick with the following test cases,
// looking at mark-point.test.ts as inspiration
//
// After finishing all test, make sure all lines in mark-tick.ts is tested
// (except the scaffold labels() method)
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var tick_1 = require("../../../src/compile/mark/tick");
var util_1 = require("../../util");
describe('Mark: Tick', function () {
    describe('with stacked x', function () {
        // This is a simplified example for stacked tick.
        // In reality this will be used as stacked's overlayed marker
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "mark": "tick",
            "encoding": {
                "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                "color": { "field": "b", "type": "ordinal" }
            },
            "data": { "url": "data/barley.json" },
            "config": { "stack": "zero" }
        });
        var props = tick_1.tick.encodeEntry(model);
        it('should use stack_end on x', function () {
            chai_1.assert.deepEqual(props.xc, { scale: channel_1.X, field: 'sum_a_end' });
        });
    });
    describe('with stacked y', function () {
        // This is a simplified example for stacked tick.
        // In reality this will be used as stacked's overlayed marker
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "mark": "tick",
            "encoding": {
                "y": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                "color": { "field": "b", "type": "ordinal" }
            },
            "data": { "url": "data/barley.json" },
            "config": { "stack": "zero" }
        });
        var props = tick_1.tick.encodeEntry(model);
        it('should use stack_end on y', function () {
            chai_1.assert.deepEqual(props.yc, { scale: channel_1.Y, field: 'sum_a_end' });
        });
    });
    describe('with quantitative x', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            'mark': 'tick',
            'encoding': { 'x': { 'field': 'Horsepower', 'type': 'quantitative' } },
            'data': { 'url': 'data/cars.json' }
        });
        var props = tick_1.tick.encodeEntry(model);
        it('should be centered on y', function () {
            chai_1.assert.deepEqual(props.yc, {
                mult: 0.5,
                signal: 'height'
            });
        });
        it('should scale on x', function () {
            chai_1.assert.deepEqual(props.xc, { scale: channel_1.X, field: 'Horsepower' });
        });
        it('width should tick thickness with orient vertical', function () {
            chai_1.assert.deepEqual(props.width, { value: 1 });
        });
    });
    describe('with quantitative y', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            'mark': 'tick',
            'encoding': { 'y': { 'field': 'Cylinders', 'type': 'quantitative' } },
            'data': { 'url': 'data/cars.json' }
        });
        var props = tick_1.tick.encodeEntry(model);
        it('should be centered on x', function () {
            chai_1.assert.deepEqual(props.xc, {
                mult: 0.5,
                signal: 'width'
            });
        });
        it('should scale on y', function () {
            chai_1.assert.deepEqual(props.yc, { scale: channel_1.Y, field: 'Cylinders' });
        });
        it('height should tick thickness with orient horizontal', function () {
            chai_1.assert.deepEqual(props.height, { value: 1 });
        });
    });
    describe('with quantitative x and ordinal y', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            'mark': 'tick',
            'encoding': {
                'x': { 'field': 'Horsepower', 'type': 'quantitative' },
                'y': { 'field': 'Cylinders', 'type': 'ordinal' }
            },
            'data': { 'url': 'data/cars.json' }
        });
        var props = tick_1.tick.encodeEntry(model);
        it('should scale on x', function () {
            chai_1.assert.deepEqual(props.xc, { scale: channel_1.X, field: 'Horsepower' });
        });
        it('should scale on y', function () {
            chai_1.assert.deepEqual(props.yc, { scale: channel_1.Y, field: 'Cylinders' });
        });
        it('wiidth should be tick thickness with default orient vertical', function () {
            chai_1.assert.deepEqual(props.width, { value: 1 });
        });
        it('height should be matched to field with default orient vertical', function () {
            chai_1.assert.deepEqual(props.height, { value: 14 });
        });
    });
    describe('width should be mapped to size', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            'mark': 'tick',
            'config': { 'mark': { 'orient': 'vertical' } },
            'encoding': {
                'x': { 'field': 'Horsepower', 'type': 'quantitative' },
                'y': { 'field': 'Cylinders', 'type': 'ordinal' },
                'size': { 'field': 'Acceleration', 'type': 'quantitative' }
            },
            'data': { 'url': 'data/cars.json' },
        });
        var props = tick_1.tick.encodeEntry(model);
        it('width should change with size field', function () {
            chai_1.assert.deepEqual(props.height, { 'field': 'Acceleration', 'scale': channel_1.SIZE });
        });
    });
    describe('height should be mapped to size', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            'mark': 'tick',
            'encoding': {
                'x': { 'field': 'Horsepower', 'type': 'quantitative' },
                'y': { 'field': 'Cylinders', 'type': 'ordinal' },
                'size': { 'field': 'Acceleration', 'type': 'quantitative' }
            },
            'data': { 'url': 'data/cars.json' },
        });
        var props = tick_1.tick.encodeEntry(model);
        it('height should change with size field', function () {
            chai_1.assert.deepEqual(props.height, { 'field': 'Acceleration', 'scale': channel_1.SIZE });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGljay50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL21hcmsvdGljay50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRzlCLFFBQVE7QUFDUixnREFBZ0Q7QUFDaEQsK0NBQStDO0FBQy9DLEVBQUU7QUFDRiwwRUFBMEU7QUFDMUUsd0NBQXdDO0FBQ3hDLDZCQUE0QjtBQUM1QixnREFBZ0Q7QUFDaEQsdURBQW9EO0FBQ3BELG1DQUFnRTtBQUVoRSxRQUFRLENBQUMsWUFBWSxFQUFFO0lBQ3JCLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN6QixpREFBaUQ7UUFDakQsNkRBQTZEO1FBQzdELElBQU0sS0FBSyxHQUFHLDJDQUFvQyxDQUFDO1lBQ2pELE1BQU0sRUFBRSxNQUFNO1lBQ2QsVUFBVSxFQUFFO2dCQUNWLEdBQUcsRUFBRSxFQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDO2dCQUMvRCxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7YUFDM0M7WUFDRCxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUM7WUFDbkMsUUFBUSxFQUFFLEVBQUMsT0FBTyxFQUFHLE1BQU0sRUFBQztTQUM3QixDQUFDLENBQUM7UUFFSCxJQUFNLEtBQUssR0FBRyxXQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXRDLEVBQUUsQ0FBQywyQkFBMkIsRUFBRTtZQUM5QixhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsV0FBQyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDO1FBQzdELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFHSCxRQUFR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Q0FBaUMsRUFBRTtRQUMxQyxJQUFNLEtBQUssR0FBRywyQ0FBb0MsQ0FBQztZQUNqRCxNQUFNLEVBQUUsTUFBTTtZQUNkLFVBQVUsRUFDUjtnQkFDRSxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7Z0JBQ3BELEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztnQkFDOUMsTUFBTSxFQUFFLEVBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDO2FBQzFEO1lBQ0gsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFDO1NBQ2xDLENBQUMsQ0FBQztRQUNILElBQU0sS0FBSyxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEMsRUFBRSxDQUFDLHNDQUFzQyxFQUFFO1lBQ3pDLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLGNBQUksRUFBQyxDQUFDLENBQUM7UUFDM0UsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGUgcXVvdGVtYXJrICovXG5cblxuLy8gVE9ETzpcbi8vIHRlc3QgbWFyay10aWNrIHdpdGggdGhlIGZvbGxvd2luZyB0ZXN0IGNhc2VzLFxuLy8gbG9va2luZyBhdCBtYXJrLXBvaW50LnRlc3QudHMgYXMgaW5zcGlyYXRpb25cbi8vXG4vLyBBZnRlciBmaW5pc2hpbmcgYWxsIHRlc3QsIG1ha2Ugc3VyZSBhbGwgbGluZXMgaW4gbWFyay10aWNrLnRzIGlzIHRlc3RlZFxuLy8gKGV4Y2VwdCB0aGUgc2NhZmZvbGQgbGFiZWxzKCkgbWV0aG9kKVxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtTSVpFLCBYLCBZfSBmcm9tICcuLi8uLi8uLi9zcmMvY2hhbm5lbCc7XG5pbXBvcnQge3RpY2t9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvdGljayc7XG5pbXBvcnQge3BhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdNYXJrOiBUaWNrJywgZnVuY3Rpb24oKSB7XG4gIGRlc2NyaWJlKCd3aXRoIHN0YWNrZWQgeCcsIGZ1bmN0aW9uKCkge1xuICAgIC8vIFRoaXMgaXMgYSBzaW1wbGlmaWVkIGV4YW1wbGUgZm9yIHN0YWNrZWQgdGljay5cbiAgICAvLyBJbiByZWFsaXR5IHRoaXMgd2lsbCBiZSB1c2VkIGFzIHN0YWNrZWQncyBvdmVybGF5ZWQgbWFya2VyXG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJtYXJrXCI6IFwidGlja1wiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwiYlwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9XG4gICAgICB9LFxuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICBcImNvbmZpZ1wiOiB7XCJzdGFja1wiOiAgXCJ6ZXJvXCJ9XG4gICAgfSk7XG5cbiAgICBjb25zdCBwcm9wcyA9IHRpY2suZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCB1c2Ugc3RhY2tfZW5kIG9uIHgnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueGMsIHtzY2FsZTogWCwgZmllbGQ6ICdzdW1fYV9lbmQnfSk7XG4gICAgfSk7XG4gIH0pO1xuXG5cbiAgZGVzY3JpYmUoJ3dpdGggc3RhY2tlZCB5JywgZnVuY3Rpb24oKSB7XG4gICAgLy8gVGhpcyBpcyBhIHNpbXBsaWZpZWQgZXhhbXBsZSBmb3Igc3RhY2tlZCB0aWNrLlxuICAgIC8vIEluIHJlYWxpdHkgdGhpcyB3aWxsIGJlIHVzZWQgYXMgc3RhY2tlZCdzIG92ZXJsYXllZCBtYXJrZXJcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcIm1hcmtcIjogXCJ0aWNrXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ5XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn1cbiAgICAgIH0sXG4gICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgIFwiY29uZmlnXCI6IHtcInN0YWNrXCI6ICBcInplcm9cIn1cbiAgICB9KTtcblxuICAgIGNvbnN0IHByb3BzID0gdGljay5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIHVzZSBzdGFja19lbmQgb24geScsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55Yywge3NjYWxlOiBZLCBmaWVsZDogJ3N1bV9hX2VuZCd9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3dpdGggcXVhbnRpdGF0aXZlIHgnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAnbWFyayc6ICd0aWNrJyxcbiAgICAgICdlbmNvZGluZyc6IHsneCc6IHsnZmllbGQnOiAnSG9yc2Vwb3dlcicsICd0eXBlJzogJ3F1YW50aXRhdGl2ZSd9fSxcbiAgICAgICdkYXRhJzogeyd1cmwnOiAnZGF0YS9jYXJzLmpzb24nfVxuICAgIH0pO1xuXG4gICAgY29uc3QgcHJvcHMgPSB0aWNrLmVuY29kZUVudHJ5KG1vZGVsKTtcbiAgICBpdCgnc2hvdWxkIGJlIGNlbnRlcmVkIG9uIHknLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueWMsIHtcbiAgICAgICAgbXVsdDogMC41LFxuICAgICAgICBzaWduYWw6ICdoZWlnaHQnXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc2NhbGUgb24geCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54Yywge3NjYWxlOiBYLCBmaWVsZDogJ0hvcnNlcG93ZXInfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnd2lkdGggc2hvdWxkIHRpY2sgdGhpY2tuZXNzIHdpdGggb3JpZW50IHZlcnRpY2FsJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLndpZHRoLCB7dmFsdWU6IDF9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3dpdGggcXVhbnRpdGF0aXZlIHknLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAnbWFyayc6ICd0aWNrJyxcbiAgICAgICdlbmNvZGluZyc6IHsneSc6IHsnZmllbGQnOiAnQ3lsaW5kZXJzJywndHlwZSc6ICdxdWFudGl0YXRpdmUnfX0sXG4gICAgICAnZGF0YSc6IHsndXJsJzogJ2RhdGEvY2Fycy5qc29uJ31cbiAgICB9KTtcblxuICAgIGNvbnN0IHByb3BzID0gdGljay5lbmNvZGVFbnRyeShtb2RlbCk7XG4gICAgaXQoJ3Nob3VsZCBiZSBjZW50ZXJlZCBvbiB4JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnhjLCB7XG4gICAgICAgIG11bHQ6IDAuNSxcbiAgICAgICAgc2lnbmFsOiAnd2lkdGgnXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc2NhbGUgb24geScsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55Yywge3NjYWxlOiBZLCBmaWVsZDogJ0N5bGluZGVycyd9KTtcbiAgICB9KTtcblxuICAgIGl0KCdoZWlnaHQgc2hvdWxkIHRpY2sgdGhpY2tuZXNzIHdpdGggb3JpZW50IGhvcml6b250YWwnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuaGVpZ2h0LCB7dmFsdWU6IDF9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3dpdGggcXVhbnRpdGF0aXZlIHggYW5kIG9yZGluYWwgeScsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICdtYXJrJzogJ3RpY2snLFxuICAgICAgJ2VuY29kaW5nJzpcbiAgICAgICAge1xuICAgICAgICAgICd4JzogeydmaWVsZCc6ICdIb3JzZXBvd2VyJywgJ3R5cGUnOiAncXVhbnRpdGF0aXZlJ30sXG4gICAgICAgICAgJ3knOiB7J2ZpZWxkJzogJ0N5bGluZGVycycsJ3R5cGUnOiAnb3JkaW5hbCd9XG4gICAgICAgIH0sXG4gICAgICAnZGF0YSc6IHsndXJsJzogJ2RhdGEvY2Fycy5qc29uJ31cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IHRpY2suZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBzY2FsZSBvbiB4JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnhjLCB7c2NhbGU6IFgsIGZpZWxkOiAnSG9yc2Vwb3dlcid9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc2NhbGUgb24geScsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55Yywge3NjYWxlOiBZLCBmaWVsZDogJ0N5bGluZGVycyd9KTtcbiAgICB9KTtcblxuICAgIGl0KCd3aWlkdGggc2hvdWxkIGJlIHRpY2sgdGhpY2tuZXNzIHdpdGggZGVmYXVsdCBvcmllbnQgdmVydGljYWwnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMud2lkdGgsIHt2YWx1ZTogMX0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2hlaWdodCBzaG91bGQgYmUgbWF0Y2hlZCB0byBmaWVsZCB3aXRoIGRlZmF1bHQgb3JpZW50IHZlcnRpY2FsJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLmhlaWdodCwge3ZhbHVlOiAxNH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2lkdGggc2hvdWxkIGJlIG1hcHBlZCB0byBzaXplJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgJ21hcmsnOiAndGljaycsXG4gICAgICAnY29uZmlnJzogeydtYXJrJzogeydvcmllbnQnOiAndmVydGljYWwnfX0sXG4gICAgICAnZW5jb2RpbmcnOlxuICAgICAgICB7XG4gICAgICAgICAgJ3gnOiB7J2ZpZWxkJzogJ0hvcnNlcG93ZXInLCAndHlwZSc6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICAneSc6IHsnZmllbGQnOiAnQ3lsaW5kZXJzJywgJ3R5cGUnOiAnb3JkaW5hbCd9LFxuICAgICAgICAgICdzaXplJzogeydmaWVsZCc6ICdBY2NlbGVyYXRpb24nLCAndHlwZSc6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICB9LFxuICAgICAgJ2RhdGEnOiB7J3VybCc6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gdGljay5lbmNvZGVFbnRyeShtb2RlbCk7XG4gICAgaXQoJ3dpZHRoIHNob3VsZCBjaGFuZ2Ugd2l0aCBzaXplIGZpZWxkJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLmhlaWdodCwgeydmaWVsZCc6ICdBY2NlbGVyYXRpb24nLCAnc2NhbGUnOiBTSVpFfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdoZWlnaHQgc2hvdWxkIGJlIG1hcHBlZCB0byBzaXplJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgJ21hcmsnOiAndGljaycsXG4gICAgICAnZW5jb2RpbmcnOlxuICAgICAgICB7XG4gICAgICAgICAgJ3gnOiB7J2ZpZWxkJzogJ0hvcnNlcG93ZXInLCAndHlwZSc6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICAneSc6IHsnZmllbGQnOiAnQ3lsaW5kZXJzJywgJ3R5cGUnOiAnb3JkaW5hbCd9LFxuICAgICAgICAgICdzaXplJzogeydmaWVsZCc6ICdBY2NlbGVyYXRpb24nLCAndHlwZSc6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICB9LFxuICAgICAgJ2RhdGEnOiB7J3VybCc6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gdGljay5lbmNvZGVFbnRyeShtb2RlbCk7XG4gICAgaXQoJ2hlaWdodCBzaG91bGQgY2hhbmdlIHdpdGggc2l6ZSBmaWVsZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5oZWlnaHQsIHsnZmllbGQnOiAnQWNjZWxlcmF0aW9uJywgJ3NjYWxlJzogU0laRX0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19