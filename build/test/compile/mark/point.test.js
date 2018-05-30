"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var point_1 = require("../../../src/compile/mark/point");
var mark_1 = require("../../../src/mark");
var util_1 = require("../../util");
describe('Mark: Point', function () {
    function pointXY(moreEncoding) {
        if (moreEncoding === void 0) { moreEncoding = {}; }
        return {
            "mark": "point",
            "encoding": tslib_1.__assign({ "x": { "field": "year", "type": "ordinal" }, "y": { "field": "yield", "type": "quantitative" } }, moreEncoding),
            "data": { "url": "data/barley.json" }
        };
    }
    describe('with x', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "mark": "point",
            "encoding": { "x": { "field": "year", "type": "ordinal" } },
            "data": { "url": "data/barley.json" }
        });
        var props = point_1.point.encodeEntry(model);
        it('should be centered on y', function () {
            chai_1.assert.deepEqual(props.y, {
                mult: 0.5,
                signal: 'height'
            });
        });
        it('should scale on x', function () {
            chai_1.assert.deepEqual(props.x, { scale: channel_1.X, field: 'year' });
        });
    });
    describe('with stacked x', function () {
        // This is a simplified example for stacked point.
        // In reality this will be used as stacked's overlayed marker
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "mark": "point",
            "encoding": {
                "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                "color": { "field": "b", "type": "ordinal" }
            },
            "data": { "url": "data/barley.json" },
            "config": { "stack": "zero" }
        });
        var props = point_1.point.encodeEntry(model);
        it('should use stack_end on x', function () {
            chai_1.assert.deepEqual(props.x, { scale: channel_1.X, field: 'sum_a_end' });
        });
    });
    describe('with y', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "mark": "point",
            "encoding": { "y": { "field": "year", "type": "ordinal" } },
            "data": { "url": "data/barley.json" }
        });
        var props = point_1.point.encodeEntry(model);
        it('should be centered on x', function () {
            chai_1.assert.deepEqual(props.x, {
                mult: 0.5,
                signal: 'width'
            });
        });
        it('should scale on y', function () {
            chai_1.assert.deepEqual(props.y, { scale: channel_1.Y, field: 'year' });
        });
    });
    describe('with stacked y', function () {
        // This is a simplified example for stacked point.
        // In reality this will be used as stacked's overlayed marker
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "mark": "point",
            "encoding": {
                "y": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                "color": { "field": "b", "type": "ordinal" }
            },
            "data": { "url": "data/barley.json" },
            "config": { "stack": "zero" }
        });
        var props = point_1.point.encodeEntry(model);
        it('should use stack_end on y', function () {
            chai_1.assert.deepEqual(props.y, { scale: channel_1.Y, field: 'sum_a_end' });
        });
    });
    describe('with x and y', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize(pointXY());
        var props = point_1.point.encodeEntry(model);
        it('should scale on x', function () {
            chai_1.assert.deepEqual(props.x, { scale: channel_1.X, field: 'year' });
        });
        it('should scale on y', function () {
            chai_1.assert.deepEqual(props.y, { scale: channel_1.Y, field: 'yield' });
        });
        it('should be an unfilled circle', function () {
            chai_1.assert.deepEqual(props.fill, { value: 'transparent' });
            chai_1.assert.deepEqual(props.stroke, { value: mark_1.defaultMarkConfig.color });
        });
    });
    describe('with band x and quantitative y', function () {
        it('should offset band position by half band', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "data": { "url": "data/barley.json" },
                "mark": "point",
                "encoding": {
                    "x": { "field": "year", "type": "ordinal", "scale": { "type": "band" } },
                    "y": { "field": "yield", "type": "quantitative" }
                }
            });
            var props = point_1.point.encodeEntry(model);
            chai_1.assert.deepEqual(props.x, { scale: 'x', field: 'year', band: 0.5 });
        });
    });
    describe('with x, y, size', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize(pointXY({
            "size": { "aggregate": "count", "type": "quantitative" }
        }));
        var props = point_1.point.encodeEntry(model);
        it('should have scale for size', function () {
            chai_1.assert.deepEqual(props.size, { scale: channel_1.SIZE, field: 'count_*' });
        });
    });
    describe('with x, y, color', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize(pointXY({
            "color": { "field": "yield", "type": "quantitative" }
        }));
        var props = point_1.point.encodeEntry(model);
        it('should have scale for color', function () {
            chai_1.assert.deepEqual(props.stroke, { scale: channel_1.COLOR, field: 'yield' });
        });
    });
    describe('with x, y, and condition-only color', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize(tslib_1.__assign({}, pointXY({
            "color": { "condition": { "selection": "test", "field": "yield", "type": "quantitative" } }
        }), { selection: { test: { type: 'single' } } }));
        model.parseSelection();
        var props = point_1.point.encodeEntry(model);
        it('should have one condition for color with scale for "yield"', function () {
            chai_1.assert.isArray(props.stroke);
            chai_1.assert.equal(props.stroke['length'], 2);
            chai_1.assert.equal(props.stroke[0].scale, channel_1.COLOR);
            chai_1.assert.equal(props.stroke[0].field, 'yield');
        });
    });
    describe('with x, y, and condition-only color', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize(tslib_1.__assign({}, pointXY({
            "color": { "condition": { "test": "true", "field": "yield", "type": "quantitative" } }
        })));
        model.parseSelection();
        var props = point_1.point.encodeEntry(model);
        it('should have one condition for color with scale for "yield"', function () {
            chai_1.assert.isArray(props.stroke);
            chai_1.assert.equal(props.stroke['length'], 2);
            chai_1.assert.equal(props.stroke[0].test, "true");
            chai_1.assert.equal(props.stroke[1].value, "#4c78a8");
        });
    });
    describe('with x, y, shape', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize(pointXY({
            "shape": { "field": "site", "type": "nominal" }
        }));
        var props = point_1.point.encodeEntry(model);
        it('should have scale for shape', function () {
            chai_1.assert.deepEqual(props.shape, { scale: channel_1.SHAPE, field: 'site' });
        });
    });
    describe('with constant color, shape, and size', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize(pointXY({
            "shape": { "value": "circle" },
            "color": { "value": "red" },
            "size": { "value": 23 }
        }));
        var props = point_1.point.encodeEntry(model);
        it('should correct shape, color and size', function () {
            chai_1.assert.deepEqual(props.shape, { value: "circle" });
            chai_1.assert.deepEqual(props.stroke, { value: "red" });
            chai_1.assert.deepEqual(props.size, { value: 23 });
        });
    });
    describe('with tooltip', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "mark": "point",
            "encoding": {
                "tooltip": { "value": "foo" }
            }
        });
        var props = point_1.point.encodeEntry(model);
        it('should pass tooltip value to encoding', function () {
            chai_1.assert.deepEqual(props.tooltip, { value: "foo" });
        });
    });
    describe('with href', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "mark": "point",
            "encoding": {
                "href": { "value": "https://idl.cs.washington.edu/" }
            }
        });
        var props = point_1.point.encodeEntry(model);
        it('should pass href value to encoding', function () {
            chai_1.assert.deepEqual(props.href, { value: 'https://idl.cs.washington.edu/' });
        });
    });
});
describe('Mark: Square', function () {
    it('should have correct shape', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "mark": "square",
            "encoding": {
                "color": { "value": "blue" }
            }
        });
        var props = point_1.square.encodeEntry(model);
        chai_1.assert.propertyVal(props.shape, 'value', 'square');
    });
    it('should be filled by default', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "mark": "square",
            "encoding": {
                "color": { "value": "blue" }
            }
        });
        var props = point_1.square.encodeEntry(model);
        chai_1.assert.propertyVal(props.fill, 'value', 'blue');
    });
    it('with config.mark.filled:false should have transparent fill', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "mark": "square",
            "encoding": {
                "color": { "value": "blue" }
            },
            "config": {
                "mark": {
                    "filled": false
                }
            }
        });
        var props = point_1.square.encodeEntry(model);
        chai_1.assert.propertyVal(props.stroke, 'value', 'blue');
        chai_1.assert.propertyVal(props.fill, 'value', 'transparent');
    });
});
describe('Mark: Circle', function () {
    var model = util_1.parseUnitModelWithScaleAndLayoutSize({
        "mark": "circle",
        "encoding": {
            "color": { "value": "blue" }
        }
    });
    var props = point_1.circle.encodeEntry(model);
    it('should have correct shape', function () {
        chai_1.assert.propertyVal(props.shape, 'value', 'circle');
    });
    it('should be filled by default', function () {
        chai_1.assert.propertyVal(props.fill, 'value', 'blue');
    });
    it('with config.mark.filled:false should have transparent fill', function () {
        var filledCircleModel = util_1.parseUnitModelWithScaleAndLayoutSize({
            "mark": "circle",
            "encoding": {
                "color": { "value": "blue" }
            },
            "config": {
                "mark": {
                    "filled": false
                }
            }
        });
        var filledCircleProps = point_1.circle.encodeEntry(filledCircleModel);
        chai_1.assert.propertyVal(filledCircleProps.stroke, 'value', 'blue');
        chai_1.assert.propertyVal(filledCircleProps.fill, 'value', 'transparent');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9pbnQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9tYXJrL3BvaW50LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7O0FBRTlCLDZCQUE0QjtBQUM1QixnREFBOEQ7QUFDOUQseURBQXNFO0FBRXRFLDBDQUFvRDtBQUVwRCxtQ0FBZ0U7QUFFaEUsUUFBUSxDQUFDLGFBQWEsRUFBRTtJQUV0QixpQkFBaUIsWUFBbUM7UUFBbkMsNkJBQUEsRUFBQSxpQkFBbUM7UUFDbEQsT0FBTztZQUNMLE1BQU0sRUFBRSxPQUFPO1lBQ2YsVUFBVSxxQkFDTixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUMsRUFDekMsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDLElBQzVDLFlBQVksQ0FDbEI7WUFDRCxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUM7U0FDcEMsQ0FBQztJQUNKLENBQUM7SUFFRCxRQUFRLENBQUMsUUFBUSxFQUFFO1FBQ2pCLElBQU0sS0FBSyxHQUFHLDJDQUFvQyxDQUFDO1lBQ2pELE1BQU0sRUFBRSxPQUFPO1lBQ2YsVUFBVSxFQUFFLEVBQUMsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDLEVBQUM7WUFDdkQsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFDO1NBQ3BDLENBQUMsQ0FBQztRQUVILElBQU0sS0FBSyxHQUFHLGFBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFdkMsRUFBRSxDQUFDLHlCQUF5QixFQUFFO1lBQzVCLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtnQkFDeEIsSUFBSSxFQUFFLEdBQUc7Z0JBQ1Qs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QWlCLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNyRSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGUgcXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7Q09MT1IsIFNIQVBFLCBTSVpFLCBYLCBZfSBmcm9tICcuLi8uLi8uLi9zcmMvY2hhbm5lbCc7XG5pbXBvcnQge2NpcmNsZSwgcG9pbnQsIHNxdWFyZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvbWFyay9wb2ludCc7XG5pbXBvcnQge0VuY29kaW5nfSBmcm9tICcuLi8uLi8uLi9zcmMvZW5jb2RpbmcnO1xuaW1wb3J0IHtkZWZhdWx0TWFya0NvbmZpZ30gZnJvbSAnLi4vLi4vLi4vc3JjL21hcmsnO1xuaW1wb3J0IHtOb3JtYWxpemVkVW5pdFNwZWN9IGZyb20gJy4uLy4uLy4uL3NyYy9zcGVjJztcbmltcG9ydCB7cGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplfSBmcm9tICcuLi8uLi91dGlsJztcblxuZGVzY3JpYmUoJ01hcms6IFBvaW50JywgZnVuY3Rpb24oKSB7XG5cbiAgZnVuY3Rpb24gcG9pbnRYWShtb3JlRW5jb2Rpbmc6IEVuY29kaW5nPHN0cmluZz4gPSB7fSk6IE5vcm1hbGl6ZWRVbml0U3BlYyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJ5ZWFyXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwieWllbGRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIC4uLm1vcmVFbmNvZGluZyxcbiAgICAgIH0sXG4gICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifVxuICAgIH07XG4gIH1cblxuICBkZXNjcmliZSgnd2l0aCB4JywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1wieFwiOiB7XCJmaWVsZFwiOiBcInllYXJcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifX0sXG4gICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifVxuICAgIH0pO1xuXG4gICAgY29uc3QgcHJvcHMgPSBwb2ludC5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGJlIGNlbnRlcmVkIG9uIHknLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueSwge1xuICAgICAgICBtdWx0OiAwLjUsXG4gICAgICAgIHNpZ25hbDogJ2hlaWdodCdcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzY2FsZSBvbiB4JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngsIHtzY2FsZTogWCwgZmllbGQ6ICd5ZWFyJ30pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2l0aCBzdGFja2VkIHgnLCBmdW5jdGlvbigpIHtcbiAgICAvLyBUaGlzIGlzIGEgc2ltcGxpZmllZCBleGFtcGxlIGZvciBzdGFja2VkIHBvaW50LlxuICAgIC8vIEluIHJlYWxpdHkgdGhpcyB3aWxsIGJlIHVzZWQgYXMgc3RhY2tlZCdzIG92ZXJsYXllZCBtYXJrZXJcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwiYlwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9XG4gICAgICB9LFxuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICBcImNvbmZpZ1wiOiB7XCJzdGFja1wiOiBcInplcm9cIn1cbiAgICB9KTtcblxuICAgIGNvbnN0IHByb3BzID0gcG9pbnQuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCB1c2Ugc3RhY2tfZW5kIG9uIHgnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueCwge3NjYWxlOiBYLCBmaWVsZDogJ3N1bV9hX2VuZCd9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3dpdGggeScsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcInlcIjoge1wiZmllbGRcIjogXCJ5ZWFyXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn19LFxuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn1cbiAgICB9KTtcblxuICAgIGNvbnN0IHByb3BzID0gcG9pbnQuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBiZSBjZW50ZXJlZCBvbiB4JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngsIHtcbiAgICAgICAgbXVsdDogMC41LFxuICAgICAgICBzaWduYWw6ICd3aWR0aCdcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzY2FsZSBvbiB5JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogWSwgZmllbGQ6ICd5ZWFyJ30pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2l0aCBzdGFja2VkIHknLCBmdW5jdGlvbigpIHtcbiAgICAvLyBUaGlzIGlzIGEgc2ltcGxpZmllZCBleGFtcGxlIGZvciBzdGFja2VkIHBvaW50LlxuICAgIC8vIEluIHJlYWxpdHkgdGhpcyB3aWxsIGJlIHVzZWQgYXMgc3RhY2tlZCdzIG92ZXJsYXllZCBtYXJrZXJcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieVwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwiYlwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9XG4gICAgICB9LFxuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICBcImNvbmZpZ1wiOiB7XCJzdGFja1wiOiBcInplcm9cIn1cbiAgICB9KTtcblxuICAgIGNvbnN0IHByb3BzID0gcG9pbnQuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCB1c2Ugc3RhY2tfZW5kIG9uIHknLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueSwge3NjYWxlOiBZLCBmaWVsZDogJ3N1bV9hX2VuZCd9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3dpdGggeCBhbmQgeScsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHBvaW50WFkoKSk7XG4gICAgY29uc3QgcHJvcHMgPSBwb2ludC5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIHNjYWxlIG9uIHgnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueCwge3NjYWxlOiBYLCBmaWVsZDogJ3llYXInfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHNjYWxlIG9uIHknLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueSwge3NjYWxlOiBZLCBmaWVsZDogJ3lpZWxkJ30pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBiZSBhbiB1bmZpbGxlZCBjaXJjbGUnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuZmlsbCwge3ZhbHVlOiAndHJhbnNwYXJlbnQnfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnN0cm9rZSwge3ZhbHVlOiBkZWZhdWx0TWFya0NvbmZpZy5jb2xvcn0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2l0aCBiYW5kIHggYW5kIHF1YW50aXRhdGl2ZSB5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgb2Zmc2V0IGJhbmQgcG9zaXRpb24gYnkgaGFsZiBiYW5kJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOntcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJ5ZWFyXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIiwgXCJzY2FsZVwiOiB7XCJ0eXBlXCI6IFwiYmFuZFwifX0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwieWllbGRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgcHJvcHMgPSBwb2ludC5lbmNvZGVFbnRyeShtb2RlbCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngsIHtzY2FsZTogJ3gnLCBmaWVsZDogJ3llYXInLCBiYW5kOiAwLjV9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3dpdGggeCwgeSwgc2l6ZScsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZShwb2ludFhZKHtcbiAgICAgIFwic2l6ZVwiOiB7XCJhZ2dyZWdhdGVcIjogXCJjb3VudFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICB9KSk7XG4gICAgY29uc3QgcHJvcHMgPSBwb2ludC5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgc2NhbGUgZm9yIHNpemUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnNpemUsIHtzY2FsZTogU0laRSwgZmllbGQ6ICdjb3VudF8qJ30pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2l0aCB4LCB5LCBjb2xvcicsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZShwb2ludFhZKHtcbiAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJ5aWVsZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICB9KSk7XG4gICAgY29uc3QgcHJvcHMgPSBwb2ludC5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgc2NhbGUgZm9yIGNvbG9yJywgZnVuY3Rpb24gKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5zdHJva2UsIHtzY2FsZTogQ09MT1IsIGZpZWxkOiAneWllbGQnfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aXRoIHgsIHksIGFuZCBjb25kaXRpb24tb25seSBjb2xvcicsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAuLi5wb2ludFhZKHtcbiAgICAgICAgXCJjb2xvclwiOiB7XCJjb25kaXRpb25cIjoge1wic2VsZWN0aW9uXCI6IFwidGVzdFwiLCBcImZpZWxkXCI6IFwieWllbGRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9fVxuICAgICAgfSksXG4gICAgICBzZWxlY3Rpb246IHt0ZXN0OiB7dHlwZTogJ3NpbmdsZSd9fVxuICAgIH0pO1xuICAgIG1vZGVsLnBhcnNlU2VsZWN0aW9uKCk7XG4gICAgY29uc3QgcHJvcHMgPSBwb2ludC5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgb25lIGNvbmRpdGlvbiBmb3IgY29sb3Igd2l0aCBzY2FsZSBmb3IgXCJ5aWVsZFwiJywgZnVuY3Rpb24gKCkge1xuICAgICAgYXNzZXJ0LmlzQXJyYXkocHJvcHMuc3Ryb2tlKTtcbiAgICAgIGFzc2VydC5lcXVhbChwcm9wcy5zdHJva2VbJ2xlbmd0aCddLCAyKTtcbiAgICAgIGFzc2VydC5lcXVhbChwcm9wcy5zdHJva2VbMF0uc2NhbGUsIENPTE9SKTtcbiAgICAgIGFzc2VydC5lcXVhbChwcm9wcy5zdHJva2VbMF0uZmllbGQsICd5aWVsZCcpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2l0aCB4LCB5LCBhbmQgY29uZGl0aW9uLW9ubHkgY29sb3InLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgLi4ucG9pbnRYWSh7XG4gICAgICAgIFwiY29sb3JcIjoge1wiY29uZGl0aW9uXCI6IHtcInRlc3RcIjogXCJ0cnVlXCIsIFwiZmllbGRcIjogXCJ5aWVsZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn19XG4gICAgICB9KVxuICAgIH0pO1xuICAgIG1vZGVsLnBhcnNlU2VsZWN0aW9uKCk7XG4gICAgY29uc3QgcHJvcHMgPSBwb2ludC5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgb25lIGNvbmRpdGlvbiBmb3IgY29sb3Igd2l0aCBzY2FsZSBmb3IgXCJ5aWVsZFwiJywgZnVuY3Rpb24gKCkge1xuICAgICAgYXNzZXJ0LmlzQXJyYXkocHJvcHMuc3Ryb2tlKTtcbiAgICAgIGFzc2VydC5lcXVhbChwcm9wcy5zdHJva2VbJ2xlbmd0aCddLCAyKTtcbiAgICAgIGFzc2VydC5lcXVhbChwcm9wcy5zdHJva2VbMF0udGVzdCwgXCJ0cnVlXCIpO1xuICAgICAgYXNzZXJ0LmVxdWFsKHByb3BzLnN0cm9rZVsxXS52YWx1ZSwgXCIjNGM3OGE4XCIpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2l0aCB4LCB5LCBzaGFwZScsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZShwb2ludFhZKHtcbiAgICAgIFwic2hhcGVcIjoge1wiZmllbGRcIjogXCJzaXRlXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICB9KSk7XG4gICAgY29uc3QgcHJvcHMgPSBwb2ludC5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgc2NhbGUgZm9yIHNoYXBlJywgZnVuY3Rpb24gKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5zaGFwZSwge3NjYWxlOiBTSEFQRSwgZmllbGQ6ICdzaXRlJ30pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2l0aCBjb25zdGFudCBjb2xvciwgc2hhcGUsIGFuZCBzaXplJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUocG9pbnRYWSh7XG4gICAgICBcInNoYXBlXCI6IHtcInZhbHVlXCI6IFwiY2lyY2xlXCJ9LFxuICAgICAgXCJjb2xvclwiOiB7XCJ2YWx1ZVwiOiBcInJlZFwifSxcbiAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiAyM31cbiAgICB9KSk7XG4gICAgY29uc3QgcHJvcHMgPSBwb2ludC5lbmNvZGVFbnRyeShtb2RlbCk7XG4gICAgaXQoJ3Nob3VsZCBjb3JyZWN0IHNoYXBlLCBjb2xvciBhbmQgc2l6ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuc2hhcGUsIHt2YWx1ZTogXCJjaXJjbGVcIn0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5zdHJva2UsIHt2YWx1ZTogXCJyZWRcIn0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5zaXplLCB7dmFsdWU6IDIzfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aXRoIHRvb2x0aXAnLCAoKSA9PiB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInRvb2x0aXBcIjoge1widmFsdWVcIjogXCJmb29cIn1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IHBvaW50LmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgcGFzcyB0b29sdGlwIHZhbHVlIHRvIGVuY29kaW5nJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy50b29sdGlwLCB7dmFsdWU6IFwiZm9vXCJ9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3dpdGggaHJlZicsICgpID0+IHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwiaHJlZlwiOiB7XCJ2YWx1ZVwiOiBcImh0dHBzOi8vaWRsLmNzLndhc2hpbmd0b24uZWR1L1wifVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gcG9pbnQuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGhyZWYgdmFsdWUgdG8gZW5jb2RpbmcnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLmhyZWYsIHt2YWx1ZTogJ2h0dHBzOi8vaWRsLmNzLndhc2hpbmd0b24uZWR1Lyd9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ01hcms6IFNxdWFyZScsIGZ1bmN0aW9uKCkge1xuICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCBzaGFwZScsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwibWFya1wiOiBcInNxdWFyZVwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwiY29sb3JcIjoge1widmFsdWVcIjogXCJibHVlXCJ9XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBzcXVhcmUuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgYXNzZXJ0LnByb3BlcnR5VmFsKHByb3BzLnNoYXBlLCAndmFsdWUnLCAnc3F1YXJlJyk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgYmUgZmlsbGVkIGJ5IGRlZmF1bHQnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcIm1hcmtcIjogXCJzcXVhcmVcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCI6IFwiYmx1ZVwifVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gc3F1YXJlLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGFzc2VydC5wcm9wZXJ0eVZhbChwcm9wcy5maWxsLCAndmFsdWUnLCAnYmx1ZScpO1xuICB9KTtcblxuICBpdCgnd2l0aCBjb25maWcubWFyay5maWxsZWQ6ZmFsc2Ugc2hvdWxkIGhhdmUgdHJhbnNwYXJlbnQgZmlsbCcsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwibWFya1wiOiBcInNxdWFyZVwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwiY29sb3JcIjoge1widmFsdWVcIjogXCJibHVlXCJ9XG4gICAgICB9LFxuICAgICAgXCJjb25maWdcIiA6IHtcbiAgICAgICAgXCJtYXJrXCIgOiB7XG4gICAgICAgICAgXCJmaWxsZWRcIiA6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHByb3BzID0gc3F1YXJlLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGFzc2VydC5wcm9wZXJ0eVZhbChwcm9wcy5zdHJva2UsICd2YWx1ZScsICdibHVlJyk7XG4gICAgYXNzZXJ0LnByb3BlcnR5VmFsKHByb3BzLmZpbGwsICd2YWx1ZScsICd0cmFuc3BhcmVudCcpO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnTWFyazogQ2lyY2xlJywgZnVuY3Rpb24oKSB7XG4gIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICBcIm1hcmtcIjogXCJjaXJjbGVcIixcbiAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgIFwiY29sb3JcIjoge1widmFsdWVcIjogXCJibHVlXCJ9XG4gICAgfVxuICB9KTtcbiAgY29uc3QgcHJvcHMgPSBjaXJjbGUuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IHNoYXBlJywgZnVuY3Rpb24oKSB7XG4gICAgYXNzZXJ0LnByb3BlcnR5VmFsKHByb3BzLnNoYXBlLCAndmFsdWUnLCAnY2lyY2xlJyk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgYmUgZmlsbGVkIGJ5IGRlZmF1bHQnLCBmdW5jdGlvbigpIHtcbiAgICBhc3NlcnQucHJvcGVydHlWYWwocHJvcHMuZmlsbCwgJ3ZhbHVlJywgJ2JsdWUnKTtcbiAgfSk7XG5cbiAgaXQoJ3dpdGggY29uZmlnLm1hcmsuZmlsbGVkOmZhbHNlIHNob3VsZCBoYXZlIHRyYW5zcGFyZW50IGZpbGwnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBmaWxsZWRDaXJjbGVNb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcIm1hcmtcIjogXCJjaXJjbGVcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCI6IFwiYmx1ZVwifVxuICAgICAgfSxcbiAgICAgIFwiY29uZmlnXCIgOiB7XG4gICAgICAgIFwibWFya1wiIDoge1xuICAgICAgICAgIFwiZmlsbGVkXCIgOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBmaWxsZWRDaXJjbGVQcm9wcyA9IGNpcmNsZS5lbmNvZGVFbnRyeShmaWxsZWRDaXJjbGVNb2RlbCk7XG5cbiAgICBhc3NlcnQucHJvcGVydHlWYWwoZmlsbGVkQ2lyY2xlUHJvcHMuc3Ryb2tlLCAndmFsdWUnLCAnYmx1ZScpO1xuICAgIGFzc2VydC5wcm9wZXJ0eVZhbChmaWxsZWRDaXJjbGVQcm9wcy5maWxsLCAndmFsdWUnLCAndHJhbnNwYXJlbnQnKTtcbiAgfSk7XG59KTtcbiJdfQ==