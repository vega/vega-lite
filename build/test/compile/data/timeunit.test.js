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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXVuaXQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL3RpbWV1bml0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLCtEQUFnRTtBQUdoRSxtQ0FBMEM7QUFFMUMsOEJBQThCLEtBQXFCO0lBQ2pELE9BQU8sdUJBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDL0QsQ0FBQztBQUVELCtCQUErQixDQUFvQjtJQUNqRCxPQUFPLHVCQUFZLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzVELENBQUM7QUFFRCxRQUFRLENBQUMsdUJBQXVCLEVBQUU7SUFDaEMsUUFBUSxDQUFDLFdBQVcsRUFBRTtRQUVwQixFQUFFLENBQUMsaURBQWlELEVBQUU7WUFFcEQsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztnQkFDM0IsTUFBTSxFQUFFLEVBQUMsUUFBUSxFQUFFLEVBQUUsRUFBQztnQkFDdEIsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsVUFBVSxFQUFFO29CQUNWLEdBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDO2lCQUN2RDthQUNGLENBQUMsQ0FBQztZQUVILGFBQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztvQkFDN0MsSUFBSSxFQUFFLFNBQVM7b0JBQ2YsRUFBRSxFQUFFLFNBQVM7b0JBQ2IsSUFBSSxFQUFFLCtDQUErQztpQkFDdEQsQ0FBQyxDQUFDLENBQUM7UUFDTixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxzRUFBc0UsRUFBRTtZQUN6RSxJQUFNLENBQUMsR0FBc0IsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBQyxDQUFDO1lBRWxGLGFBQU0sQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztvQkFDMUMsSUFBSSxFQUFFLFNBQVM7b0JBQ2YsRUFBRSxFQUFFLFlBQVk7b0JBQ2hCLElBQUksRUFBRSxrREFBa0Q7aUJBQ3pELENBQUMsQ0FBQyxDQUFDO1FBQ04sQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7VGltZVVuaXROb2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3RpbWV1bml0JztcbmltcG9ydCB7TW9kZWxXaXRoRmllbGR9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL21vZGVsJztcbmltcG9ydCB7VGltZVVuaXRUcmFuc2Zvcm19IGZyb20gJy4uLy4uLy4uL3NyYy90cmFuc2Zvcm0nO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmZ1bmN0aW9uIGFzc2VtYmxlRnJvbUVuY29kaW5nKG1vZGVsOiBNb2RlbFdpdGhGaWVsZCkge1xuICByZXR1cm4gVGltZVVuaXROb2RlLm1ha2VGcm9tRW5jb2RpbmcobnVsbCwgbW9kZWwpLmFzc2VtYmxlKCk7XG59XG5cbmZ1bmN0aW9uIGFzc2VtYmxlRnJvbVRyYW5zZm9ybSh0OiBUaW1lVW5pdFRyYW5zZm9ybSkge1xuICByZXR1cm4gVGltZVVuaXROb2RlLm1ha2VGcm9tVHJhbnNmb3JtKG51bGwsIHQpLmFzc2VtYmxlKCk7XG59XG5cbmRlc2NyaWJlKCdjb21waWxlL2RhdGEvdGltZXVuaXQnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdwYXJzZVVuaXQnLCAoKSA9PiB7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBhIGRpY3Rpb25hcnkgb2YgZm9ybXVsYSB0cmFuc2Zvcm0nLCAoKSA9PiB7XG5cbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBcImRhdGFcIjoge1widmFsdWVzXCI6IFtdfSxcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtmaWVsZDogJ2EnLCB0eXBlOiAndGVtcG9yYWwnLCB0aW1lVW5pdDogJ21vbnRoJ31cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoYXNzZW1ibGVGcm9tRW5jb2RpbmcobW9kZWwpLCBbe1xuICAgICAgICB0eXBlOiAnZm9ybXVsYScsXG4gICAgICAgIGFzOiAnbW9udGhfYScsXG4gICAgICAgIGV4cHI6ICdkYXRldGltZSgwLCBtb250aChkYXR1bVtcImFcIl0pLCAxLCAwLCAwLCAwLCAwKSdcbiAgICAgIH1dKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgZGljdGlvbmFyeSBvZiBmb3JtdWxhIHRyYW5zZm9ybSBmcm9tIHRyYW5zZm9ybSBhcnJheScsICgpID0+IHtcbiAgICAgIGNvbnN0IHQ6IFRpbWVVbml0VHJhbnNmb3JtID0ge2ZpZWxkOiAnZGF0ZScsIGFzOiAnbW9udGhfZGF0ZScsIHRpbWVVbml0OiAnbW9udGgnfTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChhc3NlbWJsZUZyb21UcmFuc2Zvcm0odCksIFt7XG4gICAgICAgIHR5cGU6ICdmb3JtdWxhJyxcbiAgICAgICAgYXM6ICdtb250aF9kYXRlJyxcbiAgICAgICAgZXhwcjogJ2RhdGV0aW1lKDAsIG1vbnRoKGRhdHVtW1wiZGF0ZVwiXSksIDEsIDAsIDAsIDAsIDApJ1xuICAgICAgfV0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19