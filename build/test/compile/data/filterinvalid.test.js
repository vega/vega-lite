"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var filterinvalid_1 = require("../../../src/compile/data/filterinvalid");
var util_1 = require("../../../src/util");
var util_2 = require("../../util");
function parse(model) {
    return filterinvalid_1.FilterInvalidNode.make(null, model);
}
describe('compile/data/nullfilter', function () {
    describe('compileUnit', function () {
        var spec = {
            mark: "point",
            encoding: {
                y: { field: 'qq', type: "quantitative" },
                x: { field: 'tt', type: "temporal" },
                color: { field: 'oo', type: "ordinal" },
                shape: { field: 'nn', type: "nominal" }
            }
        };
        it('should add filterNull for Q and T by default', function () {
            var model = util_2.parseUnitModelWithScale(spec);
            chai_1.assert.deepEqual(parse(model).filter, {
                qq: { field: 'qq', type: "quantitative" },
                tt: { field: 'tt', type: "temporal" }
            });
        });
        it('should add filterNull for Q and T when invalidValues is "filter".', function () {
            var model = util_2.parseUnitModelWithScale(util_1.mergeDeep(spec, {
                config: {
                    invalidValues: 'filter'
                }
            }));
            chai_1.assert.deepEqual(parse(model).filter, {
                qq: { field: 'qq', type: "quantitative" },
                tt: { field: 'tt', type: "temporal" }
            });
        });
        it('should add no null filter if when invalidValues is null', function () {
            var model = util_2.parseUnitModelWithScale(util_1.mergeDeep(spec, {
                config: {
                    invalidValues: null
                }
            }));
            chai_1.assert.deepEqual(parse(model), null);
        });
        it('should add no null filter for count field', function () {
            var model = util_2.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    y: { aggregate: 'count', type: "quantitative" }
                }
            });
            chai_1.assert.deepEqual(parse(model), null);
        });
    });
    describe('assemble', function () {
        // TODO: write
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyaW52YWxpZC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL2RhdGEvZmlsdGVyaW52YWxpZC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUk1Qix5RUFBMEU7QUFHMUUsMENBQWtEO0FBQ2xELG1DQUFtRDtBQUVuRCxlQUFlLEtBQXFCO0lBQ2xDLE1BQU0sQ0FBQyxpQ0FBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzdDLENBQUM7QUFFRCxRQUFRLENBQUMseUJBQXlCLEVBQUU7SUFDbEMsUUFBUSxDQUFDLGFBQWEsRUFBRTtRQUN0QixJQUFNLElBQUksR0FBdUI7WUFDL0IsSUFBSSxFQUFFLE9BQU87WUFDYixRQUFRLEVBQUU7Z0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2dCQUN0QyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUM7Z0JBQ2xDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQztnQkFDckMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDO2FBQ3RDO1NBQ0YsQ0FBQztRQUVGLEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRTtZQUNqRCxJQUFNLEtBQUssR0FBRyw4QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1QyxhQUFNLENBQUMsU0FBUyxDQUF5QixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFO2dCQUM1RCxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7Z0JBQ3ZDLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBQzthQUNwQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxtRUFBbUUsRUFBRTtZQUN0RSxJQUFNLEtBQUssR0FBRyw4QkFBdUIsQ0FBQyxnQkFBUyxDQUErQixJQUFJLEVBQUU7Z0JBQ2xGLE1BQU0sRUFBRTtvQkFDTixhQUFhLEVBQUUsUUFBUTtpQkFDeEI7YUFDRixDQUFDLENBQUMsQ0FBQztZQUNKLGFBQU0sQ0FBQyxTQUFTLENBQXlCLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEVBQUU7Z0JBQzVELEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztnQkFDdkMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFDO2FBQ3BDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHlEQUF5RCxFQUFFO1lBQzVELElBQU0sS0FBSyxHQUFHLDhCQUF1QixDQUFDLGdCQUFTLENBQStCLElBQUksRUFBRTtnQkFDbEYsTUFBTSxFQUFFO29CQUNOLGFBQWEsRUFBRSxJQUFJO2lCQUNwQjthQUNGLENBQUMsQ0FBQyxDQUFDO1lBQ0osYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUUsMkNBQTJDLEVBQUU7WUFDL0MsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUM7Z0JBQ3BDLElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7aUJBQzlDO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxVQUFVLEVBQUU7UUFDbkIsY0FBYztJQUNoQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcblxuaW1wb3J0IHtOb3JtYWxpemVkVW5pdFNwZWMsIFRvcExldmVsfSBmcm9tICcuLi8uLi8uLi9zcmMvc3BlYyc7XG5cbmltcG9ydCB7RmlsdGVySW52YWxpZE5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvZmlsdGVyaW52YWxpZCc7XG5pbXBvcnQge01vZGVsV2l0aEZpZWxkfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9tb2RlbCc7XG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuLi8uLi8uLi9zcmMvZmllbGRkZWYnO1xuaW1wb3J0IHtEaWN0LCBtZXJnZURlZXB9IGZyb20gJy4uLy4uLy4uL3NyYy91dGlsJztcbmltcG9ydCB7cGFyc2VVbml0TW9kZWxXaXRoU2NhbGV9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5mdW5jdGlvbiBwYXJzZShtb2RlbDogTW9kZWxXaXRoRmllbGQpIHtcbiAgcmV0dXJuIEZpbHRlckludmFsaWROb2RlLm1ha2UobnVsbCwgbW9kZWwpO1xufVxuXG5kZXNjcmliZSgnY29tcGlsZS9kYXRhL251bGxmaWx0ZXInLCBmdW5jdGlvbigpIHtcbiAgZGVzY3JpYmUoJ2NvbXBpbGVVbml0JywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgc3BlYzogTm9ybWFsaXplZFVuaXRTcGVjID0ge1xuICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgeToge2ZpZWxkOiAncXEnLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgeDoge2ZpZWxkOiAndHQnLCB0eXBlOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICBjb2xvcjoge2ZpZWxkOiAnb28nLCB0eXBlOiBcIm9yZGluYWxcIn0sXG4gICAgICAgIHNoYXBlOiB7ZmllbGQ6ICdubicsIHR5cGU6IFwibm9taW5hbFwifVxuICAgICAgfVxuICAgIH07XG5cbiAgICBpdCgnc2hvdWxkIGFkZCBmaWx0ZXJOdWxsIGZvciBRIGFuZCBUIGJ5IGRlZmF1bHQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHNwZWMpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxEaWN0PEZpZWxkRGVmPHN0cmluZz4+PihwYXJzZShtb2RlbCkuZmlsdGVyLCB7XG4gICAgICAgIHFxOiB7ZmllbGQ6ICdxcScsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICB0dDoge2ZpZWxkOiAndHQnLCB0eXBlOiBcInRlbXBvcmFsXCJ9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYWRkIGZpbHRlck51bGwgZm9yIFEgYW5kIFQgd2hlbiBpbnZhbGlkVmFsdWVzIGlzIFwiZmlsdGVyXCIuJywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZShtZXJnZURlZXA8VG9wTGV2ZWw8Tm9ybWFsaXplZFVuaXRTcGVjPj4oc3BlYywge1xuICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICBpbnZhbGlkVmFsdWVzOiAnZmlsdGVyJ1xuICAgICAgICB9XG4gICAgICB9KSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPERpY3Q8RmllbGREZWY8c3RyaW5nPj4+KHBhcnNlKG1vZGVsKS5maWx0ZXIsIHtcbiAgICAgICAgcXE6IHtmaWVsZDogJ3FxJywgdHlwZTogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIHR0OiB7ZmllbGQ6ICd0dCcsIHR5cGU6IFwidGVtcG9yYWxcIn1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBhZGQgbm8gbnVsbCBmaWx0ZXIgaWYgd2hlbiBpbnZhbGlkVmFsdWVzIGlzIG51bGwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKG1lcmdlRGVlcDxUb3BMZXZlbDxOb3JtYWxpemVkVW5pdFNwZWM+PihzcGVjLCB7XG4gICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgIGludmFsaWRWYWx1ZXM6IG51bGxcbiAgICAgICAgfVxuICAgICAgfSkpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwYXJzZShtb2RlbCksIG51bGwpO1xuICAgIH0pO1xuXG4gICAgaXQgKCdzaG91bGQgYWRkIG5vIG51bGwgZmlsdGVyIGZvciBjb3VudCBmaWVsZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeToge2FnZ3JlZ2F0ZTogJ2NvdW50JywgdHlwZTogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocGFyc2UobW9kZWwpLCBudWxsKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2Fzc2VtYmxlJywgZnVuY3Rpb24oKSB7XG4gICAgLy8gVE9ETzogd3JpdGVcbiAgfSk7XG59KTtcbiJdfQ==