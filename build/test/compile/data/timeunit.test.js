"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var timeunit_1 = require("../../../src/compile/data/timeunit");
var util_1 = require("../../util");
function assembleFromEncoding(model) {
    return timeunit_1.TimeUnitNode.makeFromEncoding(model).assemble();
}
function assembleFromTransform(model, t) {
    return timeunit_1.TimeUnitNode.makeFromTransform(model, t).assemble();
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
            var model = util_1.parseUnitModel({
                "data": { "values": [] },
                "transform": [t],
                "mark": "point",
                "encoding": {
                    "x": { field: 'date', type: 'temporal', timeUnit: 'month' }
                }
            });
            chai_1.assert.deepEqual(assembleFromTransform(model, t), [{
                    type: 'formula',
                    as: 'month_date',
                    expr: 'datetime(0, month(datum["date"]), 1, 0, 0, 0, 0)'
                }]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXVuaXQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL3RpbWV1bml0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLCtEQUFnRTtBQUdoRSxtQ0FBMEM7QUFFMUMsOEJBQThCLEtBQXFCO0lBQ2pELE1BQU0sQ0FBQyx1QkFBWSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ3pELENBQUM7QUFFRCwrQkFBK0IsS0FBWSxFQUFFLENBQW9CO0lBQy9ELE1BQU0sQ0FBQyx1QkFBWSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUM3RCxDQUFDO0FBRUQsUUFBUSxDQUFDLHVCQUF1QixFQUFFO0lBQ2hDLFFBQVEsQ0FBQyxXQUFXLEVBQUU7UUFFcEIsRUFBRSxDQUFDLGlEQUFpRCxFQUFFO1lBRXBELElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7Z0JBQzNCLE1BQU0sRUFBRSxFQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUM7Z0JBQ3RCLE1BQU0sRUFBRSxPQUFPO2dCQUNmLFVBQVUsRUFBRTtvQkFDVixHQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBQztpQkFDdkQ7YUFDRixDQUFDLENBQUM7WUFFSCxhQUFNLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7b0JBQzdDLElBQUksRUFBRSxTQUFTO29CQUNmLEVBQUUsRUFBRSxTQUFTO29CQUNiLElBQUksRUFBRSwrQ0FBK0M7aUJBQ3RELENBQUMsQ0FBQyxDQUFDO1FBQ04sQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsc0VBQXNFLEVBQUU7WUFDekUsSUFBTSxDQUFDLEdBQXNCLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUMsQ0FBQztZQUNsRixJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO2dCQUMzQixNQUFNLEVBQUUsRUFBQyxRQUFRLEVBQUUsRUFBRSxFQUFDO2dCQUN0QixXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLE1BQU0sRUFBRSxPQUFPO2dCQUNmLFVBQVUsRUFBRTtvQkFDVixHQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBQztpQkFDMUQ7YUFDRixDQUFDLENBQUM7WUFFSCxhQUFNLENBQUMsU0FBUyxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO29CQUNqRCxJQUFJLEVBQUUsU0FBUztvQkFDZixFQUFFLEVBQUUsWUFBWTtvQkFDaEIsSUFBSSxFQUFFLGtEQUFrRDtpQkFDekQsQ0FBQyxDQUFDLENBQUM7UUFDTixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==