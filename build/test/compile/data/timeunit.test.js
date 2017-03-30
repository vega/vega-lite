/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var timeunit_1 = require("../../../src/compile/data/timeunit");
var util_1 = require("../../util");
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
            var timeUnitComponent = timeunit_1.timeUnit.parseUnit(model);
            chai_1.assert.deepEqual(timeUnitComponent, {
                month_a: {
                    type: 'formula',
                    as: 'month_a',
                    expr: 'datetime(0, month(datum["a"]), 1, 0, 0, 0, 0)'
                }
            });
        });
    });
    describe('parseFacet', function () {
        // TODO:
    });
    describe('parseLayer', function () {
        // TODO:
    });
    describe('assemble', function () {
        // TODO:
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXVuaXQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL3RpbWV1bml0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOEJBQThCOzs7QUFFOUIsNkJBQTRCO0FBQzVCLCtEQUE0RDtBQUM1RCxtQ0FBMEM7QUFFMUMsUUFBUSxDQUFDLHVCQUF1QixFQUFFO0lBQ2hDLFFBQVEsQ0FBQyxXQUFXLEVBQUU7UUFFcEIsRUFBRSxDQUFDLGlEQUFpRCxFQUFFO1lBRXBELElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7Z0JBQzNCLE1BQU0sRUFBRSxFQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUM7Z0JBQ3RCLE1BQU0sRUFBRSxPQUFPO2dCQUNmLFVBQVUsRUFBRTtvQkFDVixHQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBQztpQkFDdkQ7YUFDRixDQUFDLENBQUM7WUFDSCxJQUFNLGlCQUFpQixHQUFHLG1CQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BELGFBQU0sQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQ2hDO2dCQUNFLE9BQU8sRUFBRTtvQkFDUCxJQUFJLEVBQUUsU0FBUztvQkFDZixFQUFFLEVBQUUsU0FBUztvQkFDYixJQUFJLEVBQUUsK0NBQStDO2lCQUN0RDthQUNGLENBQ0YsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsWUFBWSxFQUFFO1FBQ3JCLFFBQVE7SUFDVixDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxZQUFZLEVBQUU7UUFDckIsUUFBUTtJQUNWLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFVBQVUsRUFBRTtRQUNuQixRQUFRO0lBQ1YsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9