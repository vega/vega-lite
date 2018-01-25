"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var timeunit_1 = require("../../../src/compile/data/timeunit");
var util_1 = require("../../util");
function assembleFromEncoding(model) {
    return timeunit_1.TimeUnitNode.makeFromEncoding(model).assemble();
}
function assembleFromTransform(t) {
    return timeunit_1.TimeUnitNode.makeFromTransform(t).assemble();
}
describe('compile/data/timeunit', function () {
    describe('parseUnit', function () {
        it('should return a dictionary of formula transform', function () {
            var model = util_1.parseUnitModel({
                "data": { "values": [] },
                "mark": "point",
                "encoding": {
                    "x": { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            chai_1.assert.deepEqual(assembleFromEncoding(model), [{
                    type: 'formula',
                    as: 'month_a',
                    expr: 'datetime(0, month(datum["a"]), 1, 0, 0, 0, 0)'
                }]);
        });
        it('should return a dictionary of formula transform from transform array', function () {
            var t = { field: 'date', as: 'month_date', timeUnit: 'month' };
            chai_1.assert.deepEqual(assembleFromTransform(t), [{
                    type: 'formula',
                    as: 'month_date',
                    expr: 'datetime(0, month(datum["date"]), 1, 0, 0, 0, 0)'
                }]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXVuaXQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL3RpbWV1bml0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLCtEQUFnRTtBQUdoRSxtQ0FBMEM7QUFFMUMsOEJBQThCLEtBQXFCO0lBQ2pELE1BQU0sQ0FBQyx1QkFBWSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ3pELENBQUM7QUFFRCwrQkFBK0IsQ0FBb0I7SUFDakQsTUFBTSxDQUFDLHVCQUFZLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDdEQsQ0FBQztBQUVELFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtJQUNoQyxRQUFRLENBQUMsV0FBVyxFQUFFO1FBRXBCLEVBQUUsQ0FBQyxpREFBaUQsRUFBRTtZQUVwRCxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO2dCQUMzQixNQUFNLEVBQUUsRUFBQyxRQUFRLEVBQUUsRUFBRSxFQUFDO2dCQUN0QixNQUFNLEVBQUUsT0FBTztnQkFDZixVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUM7aUJBQ3ZEO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsYUFBTSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO29CQUM3QyxJQUFJLEVBQUUsU0FBUztvQkFDZixFQUFFLEVBQUUsU0FBUztvQkFDYixJQUFJLEVBQUUsK0NBQStDO2lCQUN0RCxDQUFDLENBQUMsQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHNFQUFzRSxFQUFFO1lBQ3pFLElBQU0sQ0FBQyxHQUFzQixFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUM7WUFFbEYsYUFBTSxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO29CQUMxQyxJQUFJLEVBQUUsU0FBUztvQkFDZixFQUFFLEVBQUUsWUFBWTtvQkFDaEIsSUFBSSxFQUFFLGtEQUFrRDtpQkFDekQsQ0FBQyxDQUFDLENBQUM7UUFDTixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtUaW1lVW5pdE5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvdGltZXVuaXQnO1xuaW1wb3J0IHtNb2RlbFdpdGhGaWVsZH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvbW9kZWwnO1xuaW1wb3J0IHtUaW1lVW5pdFRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vLi4vc3JjL3RyYW5zZm9ybSc7XG5pbXBvcnQge3BhcnNlVW5pdE1vZGVsfSBmcm9tICcuLi8uLi91dGlsJztcblxuZnVuY3Rpb24gYXNzZW1ibGVGcm9tRW5jb2RpbmcobW9kZWw6IE1vZGVsV2l0aEZpZWxkKSB7XG4gIHJldHVybiBUaW1lVW5pdE5vZGUubWFrZUZyb21FbmNvZGluZyhtb2RlbCkuYXNzZW1ibGUoKTtcbn1cblxuZnVuY3Rpb24gYXNzZW1ibGVGcm9tVHJhbnNmb3JtKHQ6IFRpbWVVbml0VHJhbnNmb3JtKSB7XG4gIHJldHVybiBUaW1lVW5pdE5vZGUubWFrZUZyb21UcmFuc2Zvcm0odCkuYXNzZW1ibGUoKTtcbn1cblxuZGVzY3JpYmUoJ2NvbXBpbGUvZGF0YS90aW1ldW5pdCcsICgpID0+IHtcbiAgZGVzY3JpYmUoJ3BhcnNlVW5pdCcsICgpID0+IHtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgZGljdGlvbmFyeSBvZiBmb3JtdWxhIHRyYW5zZm9ybScsICgpID0+IHtcblxuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ2YWx1ZXNcIjogW119LFxuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge2ZpZWxkOiAnYScsIHR5cGU6ICd0ZW1wb3JhbCcsIHRpbWVVbml0OiAnbW9udGgnfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChhc3NlbWJsZUZyb21FbmNvZGluZyhtb2RlbCksIFt7XG4gICAgICAgIHR5cGU6ICdmb3JtdWxhJyxcbiAgICAgICAgYXM6ICdtb250aF9hJyxcbiAgICAgICAgZXhwcjogJ2RhdGV0aW1lKDAsIG1vbnRoKGRhdHVtW1wiYVwiXSksIDEsIDAsIDAsIDAsIDApJ1xuICAgICAgfV0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBkaWN0aW9uYXJ5IG9mIGZvcm11bGEgdHJhbnNmb3JtIGZyb20gdHJhbnNmb3JtIGFycmF5JywgKCkgPT4ge1xuICAgICAgY29uc3QgdDogVGltZVVuaXRUcmFuc2Zvcm0gPSB7ZmllbGQ6ICdkYXRlJywgYXM6ICdtb250aF9kYXRlJywgdGltZVVuaXQ6ICdtb250aCd9O1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGFzc2VtYmxlRnJvbVRyYW5zZm9ybSh0KSwgW3tcbiAgICAgICAgdHlwZTogJ2Zvcm11bGEnLFxuICAgICAgICBhczogJ21vbnRoX2RhdGUnLFxuICAgICAgICBleHByOiAnZGF0ZXRpbWUoMCwgbW9udGgoZGF0dW1bXCJkYXRlXCJdKSwgMSwgMCwgMCwgMCwgMCknXG4gICAgICB9XSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=