"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var timeunit_1 = require("../../../src/compile/data/timeunit");
var util_1 = require("../../util");
function assembleFromEncoding(model) {
    return timeunit_1.TimeUnitNode.makeFromEncoding(null, model).assemble();
}
function assembleFromTransform(t) {
    return timeunit_1.TimeUnitNode.makeFromTransform(null, t).assemble();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXVuaXQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL3RpbWV1bml0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLCtEQUFnRTtBQUdoRSxtQ0FBMEM7QUFFMUMsOEJBQThCLEtBQXFCO0lBQ2pELE1BQU0sQ0FBQyx1QkFBWSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUMvRCxDQUFDO0FBRUQsK0JBQStCLENBQW9CO0lBQ2pELE1BQU0sQ0FBQyx1QkFBWSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUM1RCxDQUFDO0FBRUQsUUFBUSxDQUFDLHVCQUF1QixFQUFFO0lBQ2hDLFFBQVEsQ0FBQyxXQUFXLEVBQUU7UUFFcEIsRUFBRSxDQUFDLGlEQUFpRCxFQUFFO1lBRXBELElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7Z0JBQzNCLE1BQU0sRUFBRSxFQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUM7Z0JBQ3RCLE1BQU0sRUFBRSxPQUFPO2dCQUNmLFVBQVUsRUFBRTtvQkFDVixHQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBQztpQkFDdkQ7YUFDRixDQUFDLENBQUM7WUFFSCxhQUFNLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7b0JBQzdDLElBQUksRUFBRSxTQUFTO29CQUNmLEVBQUUsRUFBRSxTQUFTO29CQUNiLElBQUksRUFBRSwrQ0FBK0M7aUJBQ3RELENBQUMsQ0FBQyxDQUFDO1FBQ04sQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsc0VBQXNFLEVBQUU7WUFDekUsSUFBTSxDQUFDLEdBQXNCLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUMsQ0FBQztZQUVsRixhQUFNLENBQUMsU0FBUyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7b0JBQzFDLElBQUksRUFBRSxTQUFTO29CQUNmLEVBQUUsRUFBRSxZQUFZO29CQUNoQixJQUFJLEVBQUUsa0RBQWtEO2lCQUN6RCxDQUFDLENBQUMsQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge1RpbWVVbml0Tm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS90aW1ldW5pdCc7XG5pbXBvcnQge01vZGVsV2l0aEZpZWxkfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9tb2RlbCc7XG5pbXBvcnQge1RpbWVVbml0VHJhbnNmb3JtfSBmcm9tICcuLi8uLi8uLi9zcmMvdHJhbnNmb3JtJztcbmltcG9ydCB7cGFyc2VVbml0TW9kZWx9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5mdW5jdGlvbiBhc3NlbWJsZUZyb21FbmNvZGluZyhtb2RlbDogTW9kZWxXaXRoRmllbGQpIHtcbiAgcmV0dXJuIFRpbWVVbml0Tm9kZS5tYWtlRnJvbUVuY29kaW5nKG51bGwsIG1vZGVsKS5hc3NlbWJsZSgpO1xufVxuXG5mdW5jdGlvbiBhc3NlbWJsZUZyb21UcmFuc2Zvcm0odDogVGltZVVuaXRUcmFuc2Zvcm0pIHtcbiAgcmV0dXJuIFRpbWVVbml0Tm9kZS5tYWtlRnJvbVRyYW5zZm9ybShudWxsLCB0KS5hc3NlbWJsZSgpO1xufVxuXG5kZXNjcmliZSgnY29tcGlsZS9kYXRhL3RpbWV1bml0JywgKCkgPT4ge1xuICBkZXNjcmliZSgncGFyc2VVbml0JywgKCkgPT4ge1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBkaWN0aW9uYXJ5IG9mIGZvcm11bGEgdHJhbnNmb3JtJywgKCkgPT4ge1xuXG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInZhbHVlc1wiOiBbXX0sXG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7ZmllbGQ6ICdhJywgdHlwZTogJ3RlbXBvcmFsJywgdGltZVVuaXQ6ICdtb250aCd9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGFzc2VtYmxlRnJvbUVuY29kaW5nKG1vZGVsKSwgW3tcbiAgICAgICAgdHlwZTogJ2Zvcm11bGEnLFxuICAgICAgICBhczogJ21vbnRoX2EnLFxuICAgICAgICBleHByOiAnZGF0ZXRpbWUoMCwgbW9udGgoZGF0dW1bXCJhXCJdKSwgMSwgMCwgMCwgMCwgMCknXG4gICAgICB9XSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBhIGRpY3Rpb25hcnkgb2YgZm9ybXVsYSB0cmFuc2Zvcm0gZnJvbSB0cmFuc2Zvcm0gYXJyYXknLCAoKSA9PiB7XG4gICAgICBjb25zdCB0OiBUaW1lVW5pdFRyYW5zZm9ybSA9IHtmaWVsZDogJ2RhdGUnLCBhczogJ21vbnRoX2RhdGUnLCB0aW1lVW5pdDogJ21vbnRoJ307XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoYXNzZW1ibGVGcm9tVHJhbnNmb3JtKHQpLCBbe1xuICAgICAgICB0eXBlOiAnZm9ybXVsYScsXG4gICAgICAgIGFzOiAnbW9udGhfZGF0ZScsXG4gICAgICAgIGV4cHI6ICdkYXRldGltZSgwLCBtb250aChkYXR1bVtcImRhdGVcIl0pLCAxLCAwLCAwLCAwLCAwKSdcbiAgICAgIH1dKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==