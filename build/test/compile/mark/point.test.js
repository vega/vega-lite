"use strict";
/* tslint:disable quotemark */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
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
            "encoding": __assign({ "x": { "field": "year", "type": "ordinal" }, "y": { "field": "yield", "type": "quantitative" } }, moreEncoding),
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
        var model = util_1.parseUnitModelWithScaleAndLayoutSize(__assign({}, pointXY({
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
        var model = util_1.parseUnitModelWithScaleAndLayoutSize(__assign({}, pointXY({
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
    describe('with configs', function () {
        it('should apply color from mark-specific config over general mark config', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": "point",
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" }
                },
                "config": { "mark": { "color": "blue" }, "point": { "color": "red" } }
            });
            var props = point_1.point.encodeEntry(model);
            chai_1.assert.deepEqual(props.stroke, { value: "red" });
        });
        it('should apply stroke mark config over color mark config', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": "point",
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" }
                },
                "config": { "mark": { "color": "red", "stroke": "blue" } }
            });
            var props = point_1.point.encodeEntry(model);
            chai_1.assert.deepEqual(props.stroke, { value: "blue" });
        });
        it('should apply stroke mark config over color mark config', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": "point",
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" }
                },
                "config": { "point": { "color": "red", "stroke": "blue" } }
            });
            var props = point_1.point.encodeEntry(model);
            chai_1.assert.deepEqual(props.stroke, { value: "blue" });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9pbnQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9tYXJrL3BvaW50LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7Ozs7Ozs7OztBQUU5Qiw2QkFBNEI7QUFDNUIsZ0RBQThEO0FBQzlELHlEQUFzRTtBQUV0RSwwQ0FBb0Q7QUFFcEQsbUNBQWdFO0FBRWhFLFFBQVEsQ0FBQyxhQUFhLEVBQUU7SUFFdEIsaUJBQWlCLFlBQW1DO1FBQW5DLDZCQUFBLEVBQUEsaUJBQW1DO1FBQ2xELE1BQU0sQ0FBQztZQUNMLE1BQU0sRUFBRSxPQUFPO1lBQ2YsVUFBVSxhQUNOLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQyxFQUN6QyxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUMsSUFDNUMsWUFBWSxDQUNsQjtZQUNELE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBQztTQUNwQyxDQUFDO0lBQ0osQ0FBQztJQUVELFFBQVEsQ0FBQyxRQUFRLEVBQUU7UUFDakIsSUFBTSxLQUFLLEdBQUcsMkNBQW9DLENBQUM7WUFDakQsTUFBTSxFQUFFLE9BQU87WUFDZixVQUFVLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUMsRUFBQztZQUN2RCxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUM7U0FDcEMsQ0FBQyxDQUFDO1FBRUgsSUFBTSxLQUFLLEdBQUcsYUFBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV2QyxFQUFFLENBQUMseUJBQXlCLEVBQUU7WUFDNUIsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO2dCQUN4QixJQUFJLEVBQUUs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QztJQUV4QyxFQUFFLENBQUMsMkJBQTJCLEVBQUU7UUFDOUIsYUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNyRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw2QkFBNkIsRUFBRTtRQUNoQyxhQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2xELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDREQUE0RCxFQUFFO1FBQy9ELElBQU0saUJBQWlCLEdBQUcsMkNBQW9DLENBQUM7WUFDN0QsTUFBTSxFQUFFLFFBQVE7WUFDaEIsVUFBVSxFQUFFO2dCQUNWLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUM7YUFDM0I7WUFDRCxRQUFRLEVBQUc7Z0JBQ1QsTUFBTSxFQUFHO29CQUNQLFFBQVEsRUFBRyxLQUFLO2lCQUNqQjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBTSxpQkFBaUIsR0FBRyxjQUFNLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFFaEUsYUFBTSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzlELGFBQU0sQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNyRSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGUgcXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7Q09MT1IsIFNIQVBFLCBTSVpFLCBYLCBZfSBmcm9tICcuLi8uLi8uLi9zcmMvY2hhbm5lbCc7XG5pbXBvcnQge2NpcmNsZSwgcG9pbnQsIHNxdWFyZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvbWFyay9wb2ludCc7XG5pbXBvcnQge0VuY29kaW5nfSBmcm9tICcuLi8uLi8uLi9zcmMvZW5jb2RpbmcnO1xuaW1wb3J0IHtkZWZhdWx0TWFya0NvbmZpZ30gZnJvbSAnLi4vLi4vLi4vc3JjL21hcmsnO1xuaW1wb3J0IHtVbml0U3BlY30gZnJvbSAnLi4vLi4vLi4vc3JjL3NwZWMnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemV9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnTWFyazogUG9pbnQnLCBmdW5jdGlvbigpIHtcblxuICBmdW5jdGlvbiBwb2ludFhZKG1vcmVFbmNvZGluZzogRW5jb2Rpbmc8c3RyaW5nPiA9IHt9KTogVW5pdFNwZWMge1xuICAgIHJldHVybiB7XG4gICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwieWVhclwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInlpZWxkXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAuLi5tb3JlRW5jb2RpbmcsXG4gICAgICB9LFxuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn1cbiAgICB9O1xuICB9XG5cbiAgZGVzY3JpYmUoJ3dpdGggeCcsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcInhcIjoge1wiZmllbGRcIjogXCJ5ZWFyXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn19LFxuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn1cbiAgICB9KTtcblxuICAgIGNvbnN0IHByb3BzID0gcG9pbnQuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBiZSBjZW50ZXJlZCBvbiB5JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtcbiAgICAgICAgbXVsdDogMC41LFxuICAgICAgICBzaWduYWw6ICdoZWlnaHQnXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc2NhbGUgb24geCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54LCB7c2NhbGU6IFgsIGZpZWxkOiAneWVhcid9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3dpdGggc3RhY2tlZCB4JywgZnVuY3Rpb24oKSB7XG4gICAgLy8gVGhpcyBpcyBhIHNpbXBsaWZpZWQgZXhhbXBsZSBmb3Igc3RhY2tlZCBwb2ludC5cbiAgICAvLyBJbiByZWFsaXR5IHRoaXMgd2lsbCBiZSB1c2VkIGFzIHN0YWNrZWQncyBvdmVybGF5ZWQgbWFya2VyXG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcImJcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifVxuICAgICAgfSxcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgXCJjb25maWdcIjoge1wic3RhY2tcIjogXCJ6ZXJvXCJ9XG4gICAgfSk7XG5cbiAgICBjb25zdCBwcm9wcyA9IHBvaW50LmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgdXNlIHN0YWNrX2VuZCBvbiB4JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngsIHtzY2FsZTogWCwgZmllbGQ6ICdzdW1fYV9lbmQnfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aXRoIHknLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XCJ5XCI6IHtcImZpZWxkXCI6IFwieWVhclwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9fSxcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9XG4gICAgfSk7XG5cbiAgICBjb25zdCBwcm9wcyA9IHBvaW50LmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgYmUgY2VudGVyZWQgb24geCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54LCB7XG4gICAgICAgIG11bHQ6IDAuNSxcbiAgICAgICAgc2lnbmFsOiAnd2lkdGgnXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc2NhbGUgb24geScsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55LCB7c2NhbGU6IFksIGZpZWxkOiAneWVhcid9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3dpdGggc3RhY2tlZCB5JywgZnVuY3Rpb24oKSB7XG4gICAgLy8gVGhpcyBpcyBhIHNpbXBsaWZpZWQgZXhhbXBsZSBmb3Igc3RhY2tlZCBwb2ludC5cbiAgICAvLyBJbiByZWFsaXR5IHRoaXMgd2lsbCBiZSB1c2VkIGFzIHN0YWNrZWQncyBvdmVybGF5ZWQgbWFya2VyXG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInlcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcImJcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifVxuICAgICAgfSxcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgXCJjb25maWdcIjoge1wic3RhY2tcIjogXCJ6ZXJvXCJ9XG4gICAgfSk7XG5cbiAgICBjb25zdCBwcm9wcyA9IHBvaW50LmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgdXNlIHN0YWNrX2VuZCBvbiB5JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogWSwgZmllbGQ6ICdzdW1fYV9lbmQnfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aXRoIHggYW5kIHknLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZShwb2ludFhZKCkpO1xuICAgIGNvbnN0IHByb3BzID0gcG9pbnQuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBzY2FsZSBvbiB4JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngsIHtzY2FsZTogWCwgZmllbGQ6ICd5ZWFyJ30pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzY2FsZSBvbiB5JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogWSwgZmllbGQ6ICd5aWVsZCd9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYmUgYW4gdW5maWxsZWQgY2lyY2xlJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLmZpbGwsIHt2YWx1ZTogJ3RyYW5zcGFyZW50J30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5zdHJva2UsIHt2YWx1ZTogZGVmYXVsdE1hcmtDb25maWcuY29sb3J9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3dpdGggYmFuZCB4IGFuZCBxdWFudGl0YXRpdmUgeScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG9mZnNldCBiYW5kIHBvc2l0aW9uIGJ5IGhhbGYgYmFuZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjp7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwieWVhclwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCIsIFwic2NhbGVcIjoge1widHlwZVwiOiBcImJhbmRcIn19LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInlpZWxkXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHByb3BzID0gcG9pbnQuZW5jb2RlRW50cnkobW9kZWwpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54LCB7c2NhbGU6ICd4JywgZmllbGQ6ICd5ZWFyJywgYmFuZDogMC41fSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aXRoIHgsIHksIHNpemUnLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUocG9pbnRYWSh7XG4gICAgICBcInNpemVcIjoge1wiYWdncmVnYXRlXCI6IFwiY291bnRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgfSkpO1xuICAgIGNvbnN0IHByb3BzID0gcG9pbnQuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHNjYWxlIGZvciBzaXplJywgZnVuY3Rpb24gKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5zaXplLCB7c2NhbGU6IFNJWkUsIGZpZWxkOiAnY291bnRfKid9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3dpdGggeCwgeSwgY29sb3InLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUocG9pbnRYWSh7XG4gICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwieWllbGRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgfSkpO1xuICAgIGNvbnN0IHByb3BzID0gcG9pbnQuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHNjYWxlIGZvciBjb2xvcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuc3Ryb2tlLCB7c2NhbGU6IENPTE9SLCBmaWVsZDogJ3lpZWxkJ30pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2l0aCB4LCB5LCBhbmQgY29uZGl0aW9uLW9ubHkgY29sb3InLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgLi4ucG9pbnRYWSh7XG4gICAgICAgIFwiY29sb3JcIjoge1wiY29uZGl0aW9uXCI6IHtcInNlbGVjdGlvblwiOiBcInRlc3RcIiwgXCJmaWVsZFwiOiBcInlpZWxkXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifX1cbiAgICAgIH0pLFxuICAgICAgc2VsZWN0aW9uOiB7dGVzdDoge3R5cGU6ICdzaW5nbGUnfX1cbiAgICB9KTtcbiAgICBtb2RlbC5wYXJzZVNlbGVjdGlvbigpO1xuICAgIGNvbnN0IHByb3BzID0gcG9pbnQuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIG9uZSBjb25kaXRpb24gZm9yIGNvbG9yIHdpdGggc2NhbGUgZm9yIFwieWllbGRcIicsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGFzc2VydC5pc0FycmF5KHByb3BzLnN0cm9rZSk7XG4gICAgICBhc3NlcnQuZXF1YWwocHJvcHMuc3Ryb2tlWydsZW5ndGgnXSwgMik7XG4gICAgICBhc3NlcnQuZXF1YWwocHJvcHMuc3Ryb2tlWzBdLnNjYWxlLCBDT0xPUik7XG4gICAgICBhc3NlcnQuZXF1YWwocHJvcHMuc3Ryb2tlWzBdLmZpZWxkLCAneWllbGQnKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3dpdGggeCwgeSwgYW5kIGNvbmRpdGlvbi1vbmx5IGNvbG9yJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIC4uLnBvaW50WFkoe1xuICAgICAgICBcImNvbG9yXCI6IHtcImNvbmRpdGlvblwiOiB7XCJ0ZXN0XCI6IFwidHJ1ZVwiLCBcImZpZWxkXCI6IFwieWllbGRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9fVxuICAgICAgfSlcbiAgICB9KTtcbiAgICBtb2RlbC5wYXJzZVNlbGVjdGlvbigpO1xuICAgIGNvbnN0IHByb3BzID0gcG9pbnQuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIG9uZSBjb25kaXRpb24gZm9yIGNvbG9yIHdpdGggc2NhbGUgZm9yIFwieWllbGRcIicsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGFzc2VydC5pc0FycmF5KHByb3BzLnN0cm9rZSk7XG4gICAgICBhc3NlcnQuZXF1YWwocHJvcHMuc3Ryb2tlWydsZW5ndGgnXSwgMik7XG4gICAgICBhc3NlcnQuZXF1YWwocHJvcHMuc3Ryb2tlWzBdLnRlc3QsIFwidHJ1ZVwiKTtcbiAgICAgIGFzc2VydC5lcXVhbChwcm9wcy5zdHJva2VbMV0udmFsdWUsIFwiIzRjNzhhOFwiKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3dpdGggeCwgeSwgc2hhcGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUocG9pbnRYWSh7XG4gICAgICBcInNoYXBlXCI6IHtcImZpZWxkXCI6IFwic2l0ZVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgfSkpO1xuICAgIGNvbnN0IHByb3BzID0gcG9pbnQuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHNjYWxlIGZvciBzaGFwZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuc2hhcGUsIHtzY2FsZTogU0hBUEUsIGZpZWxkOiAnc2l0ZSd9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3dpdGggY29uc3RhbnQgY29sb3IsIHNoYXBlLCBhbmQgc2l6ZScsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHBvaW50WFkoe1xuICAgICAgXCJzaGFwZVwiOiB7XCJ2YWx1ZVwiOiBcImNpcmNsZVwifSxcbiAgICAgIFwiY29sb3JcIjoge1widmFsdWVcIjogXCJyZWRcIn0sXG4gICAgICBcInNpemVcIjoge1widmFsdWVcIjogMjN9XG4gICAgfSkpO1xuICAgIGNvbnN0IHByb3BzID0gcG9pbnQuZW5jb2RlRW50cnkobW9kZWwpO1xuICAgIGl0KCdzaG91bGQgY29ycmVjdCBzaGFwZSwgY29sb3IgYW5kIHNpemUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnNoYXBlLCB7dmFsdWU6IFwiY2lyY2xlXCJ9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuc3Ryb2tlLCB7dmFsdWU6IFwicmVkXCJ9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuc2l6ZSwge3ZhbHVlOiAyM30pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2l0aCBjb25maWdzJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Nob3VsZCBhcHBseSBjb2xvciBmcm9tIG1hcmstc3BlY2lmaWMgY29uZmlnIG92ZXIgZ2VuZXJhbCBtYXJrIGNvbmZpZycsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJIb3JzZXBvd2VyXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcIk1pbGVzX3Blcl9HYWxsb25cIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb25maWdcIjoge1wibWFya1wiOiB7XCJjb2xvclwiOlwiYmx1ZVwifSwgXCJwb2ludFwiOiB7XCJjb2xvclwiOlwicmVkXCJ9fVxuICAgICAgfSk7XG4gICAgICBjb25zdCBwcm9wcyA9IHBvaW50LmVuY29kZUVudHJ5KG1vZGVsKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuc3Ryb2tlLCB7dmFsdWU6IFwicmVkXCJ9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgc3Ryb2tlIG1hcmsgY29uZmlnIG92ZXIgY29sb3IgbWFyayBjb25maWcnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiSG9yc2Vwb3dlclwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJNaWxlc19wZXJfR2FsbG9uXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH0sXG4gICAgICAgIFwiY29uZmlnXCI6IHtcIm1hcmtcIjoge1wiY29sb3JcIjpcInJlZFwiLCBcInN0cm9rZVwiOiBcImJsdWVcIn19XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHByb3BzID0gcG9pbnQuZW5jb2RlRW50cnkobW9kZWwpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5zdHJva2UsIHt2YWx1ZTogXCJibHVlXCJ9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgc3Ryb2tlIG1hcmsgY29uZmlnIG92ZXIgY29sb3IgbWFyayBjb25maWcnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiSG9yc2Vwb3dlclwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJNaWxlc19wZXJfR2FsbG9uXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH0sXG4gICAgICAgIFwiY29uZmlnXCI6IHtcInBvaW50XCI6IHtcImNvbG9yXCI6XCJyZWRcIiwgXCJzdHJva2VcIjogXCJibHVlXCJ9fVxuICAgICAgfSk7XG4gICAgICBjb25zdCBwcm9wcyA9IHBvaW50LmVuY29kZUVudHJ5KG1vZGVsKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuc3Ryb2tlLCB7dmFsdWU6IFwiYmx1ZVwifSk7XG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3dpdGggdG9vbHRpcCcsICgpID0+IHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwidG9vbHRpcFwiOiB7XCJ2YWx1ZVwiOiBcImZvb1wifVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gcG9pbnQuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIHRvb2x0aXAgdmFsdWUgdG8gZW5jb2RpbmcnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnRvb2x0aXAsIHt2YWx1ZTogXCJmb29cIn0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2l0aCBocmVmJywgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJocmVmXCI6IHtcInZhbHVlXCI6IFwiaHR0cHM6Ly9pZGwuY3Mud2FzaGluZ3Rvbi5lZHUvXCJ9XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBwb2ludC5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgaHJlZiB2YWx1ZSB0byBlbmNvZGluZycsICgpID0+IHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuaHJlZiwge3ZhbHVlOiAnaHR0cHM6Ly9pZGwuY3Mud2FzaGluZ3Rvbi5lZHUvJ30pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnTWFyazogU3F1YXJlJywgZnVuY3Rpb24oKSB7XG4gIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IHNoYXBlJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJtYXJrXCI6IFwic3F1YXJlXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJjb2xvclwiOiB7XCJ2YWx1ZVwiOiBcImJsdWVcIn1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IHNxdWFyZS5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBhc3NlcnQucHJvcGVydHlWYWwocHJvcHMuc2hhcGUsICd2YWx1ZScsICdzcXVhcmUnKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBiZSBmaWxsZWQgYnkgZGVmYXVsdCcsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwibWFya1wiOiBcInNxdWFyZVwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwiY29sb3JcIjoge1widmFsdWVcIjogXCJibHVlXCJ9XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBzcXVhcmUuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgYXNzZXJ0LnByb3BlcnR5VmFsKHByb3BzLmZpbGwsICd2YWx1ZScsICdibHVlJyk7XG4gIH0pO1xuXG4gIGl0KCd3aXRoIGNvbmZpZy5tYXJrLmZpbGxlZDpmYWxzZSBzaG91bGQgaGF2ZSB0cmFuc3BhcmVudCBmaWxsJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJtYXJrXCI6IFwic3F1YXJlXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJjb2xvclwiOiB7XCJ2YWx1ZVwiOiBcImJsdWVcIn1cbiAgICAgIH0sXG4gICAgICBcImNvbmZpZ1wiIDoge1xuICAgICAgICBcIm1hcmtcIiA6IHtcbiAgICAgICAgICBcImZpbGxlZFwiIDogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgcHJvcHMgPSBzcXVhcmUuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgYXNzZXJ0LnByb3BlcnR5VmFsKHByb3BzLnN0cm9rZSwgJ3ZhbHVlJywgJ2JsdWUnKTtcbiAgICBhc3NlcnQucHJvcGVydHlWYWwocHJvcHMuZmlsbCwgJ3ZhbHVlJywgJ3RyYW5zcGFyZW50Jyk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdNYXJrOiBDaXJjbGUnLCBmdW5jdGlvbigpIHtcbiAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgIFwibWFya1wiOiBcImNpcmNsZVwiLFxuICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgXCJjb2xvclwiOiB7XCJ2YWx1ZVwiOiBcImJsdWVcIn1cbiAgICB9XG4gIH0pO1xuICBjb25zdCBwcm9wcyA9IGNpcmNsZS5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3Qgc2hhcGUnLCBmdW5jdGlvbigpIHtcbiAgICBhc3NlcnQucHJvcGVydHlWYWwocHJvcHMuc2hhcGUsICd2YWx1ZScsICdjaXJjbGUnKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBiZSBmaWxsZWQgYnkgZGVmYXVsdCcsIGZ1bmN0aW9uKCkge1xuICAgIGFzc2VydC5wcm9wZXJ0eVZhbChwcm9wcy5maWxsLCAndmFsdWUnLCAnYmx1ZScpO1xuICB9KTtcblxuICBpdCgnd2l0aCBjb25maWcubWFyay5maWxsZWQ6ZmFsc2Ugc2hvdWxkIGhhdmUgdHJhbnNwYXJlbnQgZmlsbCcsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGZpbGxlZENpcmNsZU1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwibWFya1wiOiBcImNpcmNsZVwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwiY29sb3JcIjoge1widmFsdWVcIjogXCJibHVlXCJ9XG4gICAgICB9LFxuICAgICAgXCJjb25maWdcIiA6IHtcbiAgICAgICAgXCJtYXJrXCIgOiB7XG4gICAgICAgICAgXCJmaWxsZWRcIiA6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IGZpbGxlZENpcmNsZVByb3BzID0gY2lyY2xlLmVuY29kZUVudHJ5KGZpbGxlZENpcmNsZU1vZGVsKTtcblxuICAgIGFzc2VydC5wcm9wZXJ0eVZhbChmaWxsZWRDaXJjbGVQcm9wcy5zdHJva2UsICd2YWx1ZScsICdibHVlJyk7XG4gICAgYXNzZXJ0LnByb3BlcnR5VmFsKGZpbGxlZENpcmNsZVByb3BzLmZpbGwsICd2YWx1ZScsICd0cmFuc3BhcmVudCcpO1xuICB9KTtcbn0pO1xuIl19