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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXVuaXQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL3RpbWV1bml0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLCtEQUFnRTtBQUdoRSxtQ0FBMEM7QUFFMUMsOEJBQThCLEtBQXFCO0lBQ2pELE1BQU0sQ0FBQyx1QkFBWSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ3pELENBQUM7QUFFRCwrQkFBK0IsQ0FBb0I7SUFDakQsTUFBTSxDQUFDLHVCQUFZLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDdEQsQ0FBQztBQUVELFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtJQUNoQyxRQUFRLENBQUMsV0FBVyxFQUFFO1FBRXBCLEVBQUUsQ0FBQyxpREFBaUQsRUFBRTtZQUVwRCxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO2dCQUMzQixNQUFNLEVBQUUsRUFBQyxRQUFRLEVBQUUsRUFBRSxFQUFDO2dCQUN0QixNQUFNLEVBQUUsT0FBTztnQkFDZixVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUM7aUJBQ3ZEO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsYUFBTSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO29CQUM3QyxJQUFJLEVBQUUsU0FBUztvQkFDZixFQUFFLEVBQUUsU0FBUztvQkFDYixJQUFJLEVBQUUsK0NBQStDO2lCQUN0RCxDQUFDLENBQUMsQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHNFQUFzRSxFQUFFO1lBQ3pFLElBQU0sQ0FBQyxHQUFzQixFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUM7WUFFbEYsYUFBTSxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO29CQUMxQyxJQUFJLEVBQUUsU0FBUztvQkFDZixFQUFFLEVBQUUsWUFBWTtvQkFDaEIsSUFBSSxFQUFFLGtEQUFrRDtpQkFDekQsQ0FBQyxDQUFDLENBQUM7UUFDTixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==