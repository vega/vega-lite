"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var timeunit_1 = require("../../../src/compile/data/timeunit");
var util_1 = require("../../util");
function assemble(model) {
    return timeunit_1.TimeUnitNode.make(model).assemble();
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
            chai_1.assert.deepEqual(assemble(model), [{
                    type: 'formula',
                    as: 'month_a',
                    expr: 'datetime(0, month(datum["a"]), 1, 0, 0, 0, 0)'
                }]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXVuaXQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL3RpbWV1bml0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLCtEQUFnRTtBQUVoRSxtQ0FBMEM7QUFFMUMsa0JBQWtCLEtBQXFCO0lBQ3JDLE1BQU0sQ0FBQyx1QkFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUM3QyxDQUFDO0FBRUQsUUFBUSxDQUFDLHVCQUF1QixFQUFFO0lBQ2hDLFFBQVEsQ0FBQyxXQUFXLEVBQUU7UUFFcEIsRUFBRSxDQUFDLGlEQUFpRCxFQUFFO1lBRXBELElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7Z0JBQzNCLE1BQU0sRUFBRSxFQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUM7Z0JBQ3RCLE1BQU0sRUFBRSxPQUFPO2dCQUNmLFVBQVUsRUFBRTtvQkFDVixHQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBQztpQkFDdkQ7YUFDRixDQUFDLENBQUM7WUFFSCxhQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO29CQUNqQyxJQUFJLEVBQUUsU0FBUztvQkFDZixFQUFFLEVBQUUsU0FBUztvQkFDYixJQUFJLEVBQUUsK0NBQStDO2lCQUN0RCxDQUFDLENBQUMsQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9