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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyaW52YWxpZC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL2RhdGEvZmlsdGVyaW52YWxpZC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUU1Qix5RUFBMEU7QUFJMUUsMENBQWtEO0FBQ2xELG1DQUFtRDtBQUVuRCxlQUFlLEtBQWdCO0lBQzdCLE9BQU8saUNBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM3QyxDQUFDO0FBRUQsUUFBUSxDQUFDLHlCQUF5QixFQUFFO0lBQ2xDLFFBQVEsQ0FBQyxhQUFhLEVBQUU7UUFDdEIsSUFBTSxJQUFJLEdBQXVCO1lBQy9CLElBQUksRUFBRSxPQUFPO1lBQ2IsUUFBUSxFQUFFO2dCQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztnQkFDdEMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFDO2dCQUNsQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7Z0JBQ3JDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQzthQUN0QztTQUNGLENBQUM7UUFFRixFQUFFLENBQUMsOENBQThDLEVBQUU7WUFDakQsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUMsYUFBTSxDQUFDLFNBQVMsQ0FBeUIsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRTtnQkFDNUQsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2dCQUN2QyxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUM7YUFDcEMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsbUVBQW1FLEVBQUU7WUFDdEUsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUMsZ0JBQVMsQ0FBK0IsSUFBSSxFQUFFO2dCQUNsRixNQUFNLEVBQUU7b0JBQ04sYUFBYSxFQUFFLFFBQVE7aUJBQ3hCO2FBQ0YsQ0FBQyxDQUFDLENBQUM7WUFDSixhQUFNLENBQUMsU0FBUyxDQUF5QixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFO2dCQUM1RCxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7Z0JBQ3ZDLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBQzthQUNwQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx5REFBeUQsRUFBRTtZQUM1RCxJQUFNLEtBQUssR0FBRyw4QkFBdUIsQ0FBQyxnQkFBUyxDQUErQixJQUFJLEVBQUU7Z0JBQ2xGLE1BQU0sRUFBRTtvQkFDTixhQUFhLEVBQUUsSUFBSTtpQkFDcEI7YUFDRixDQUFDLENBQUMsQ0FBQztZQUNKLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFFLDJDQUEyQyxFQUFFO1lBQy9DLElBQU0sS0FBSyxHQUFHLDhCQUF1QixDQUFDO2dCQUNwQyxJQUFJLEVBQUUsT0FBTztnQkFDYixRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2lCQUM5QzthQUNGLENBQUMsQ0FBQztZQUVILGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsVUFBVSxFQUFFO1FBQ25CLGNBQWM7SUFDaEIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCB7RmlsdGVySW52YWxpZE5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvZmlsdGVyaW52YWxpZCc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvdW5pdCc7XG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuLi8uLi8uLi9zcmMvZmllbGRkZWYnO1xuaW1wb3J0IHtOb3JtYWxpemVkVW5pdFNwZWMsIFRvcExldmVsfSBmcm9tICcuLi8uLi8uLi9zcmMvc3BlYyc7XG5pbXBvcnQge0RpY3QsIG1lcmdlRGVlcH0gZnJvbSAnLi4vLi4vLi4vc3JjL3V0aWwnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmZ1bmN0aW9uIHBhcnNlKG1vZGVsOiBVbml0TW9kZWwpIHtcbiAgcmV0dXJuIEZpbHRlckludmFsaWROb2RlLm1ha2UobnVsbCwgbW9kZWwpO1xufVxuXG5kZXNjcmliZSgnY29tcGlsZS9kYXRhL251bGxmaWx0ZXInLCBmdW5jdGlvbigpIHtcbiAgZGVzY3JpYmUoJ2NvbXBpbGVVbml0JywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgc3BlYzogTm9ybWFsaXplZFVuaXRTcGVjID0ge1xuICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgeToge2ZpZWxkOiAncXEnLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgeDoge2ZpZWxkOiAndHQnLCB0eXBlOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICBjb2xvcjoge2ZpZWxkOiAnb28nLCB0eXBlOiBcIm9yZGluYWxcIn0sXG4gICAgICAgIHNoYXBlOiB7ZmllbGQ6ICdubicsIHR5cGU6IFwibm9taW5hbFwifVxuICAgICAgfVxuICAgIH07XG5cbiAgICBpdCgnc2hvdWxkIGFkZCBmaWx0ZXJOdWxsIGZvciBRIGFuZCBUIGJ5IGRlZmF1bHQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHNwZWMpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxEaWN0PEZpZWxkRGVmPHN0cmluZz4+PihwYXJzZShtb2RlbCkuZmlsdGVyLCB7XG4gICAgICAgIHFxOiB7ZmllbGQ6ICdxcScsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICB0dDoge2ZpZWxkOiAndHQnLCB0eXBlOiBcInRlbXBvcmFsXCJ9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYWRkIGZpbHRlck51bGwgZm9yIFEgYW5kIFQgd2hlbiBpbnZhbGlkVmFsdWVzIGlzIFwiZmlsdGVyXCIuJywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZShtZXJnZURlZXA8VG9wTGV2ZWw8Tm9ybWFsaXplZFVuaXRTcGVjPj4oc3BlYywge1xuICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICBpbnZhbGlkVmFsdWVzOiAnZmlsdGVyJ1xuICAgICAgICB9XG4gICAgICB9KSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPERpY3Q8RmllbGREZWY8c3RyaW5nPj4+KHBhcnNlKG1vZGVsKS5maWx0ZXIsIHtcbiAgICAgICAgcXE6IHtmaWVsZDogJ3FxJywgdHlwZTogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIHR0OiB7ZmllbGQ6ICd0dCcsIHR5cGU6IFwidGVtcG9yYWxcIn1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBhZGQgbm8gbnVsbCBmaWx0ZXIgaWYgd2hlbiBpbnZhbGlkVmFsdWVzIGlzIG51bGwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKG1lcmdlRGVlcDxUb3BMZXZlbDxOb3JtYWxpemVkVW5pdFNwZWM+PihzcGVjLCB7XG4gICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgIGludmFsaWRWYWx1ZXM6IG51bGxcbiAgICAgICAgfVxuICAgICAgfSkpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwYXJzZShtb2RlbCksIG51bGwpO1xuICAgIH0pO1xuXG4gICAgaXQgKCdzaG91bGQgYWRkIG5vIG51bGwgZmlsdGVyIGZvciBjb3VudCBmaWVsZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeToge2FnZ3JlZ2F0ZTogJ2NvdW50JywgdHlwZTogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocGFyc2UobW9kZWwpLCBudWxsKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2Fzc2VtYmxlJywgZnVuY3Rpb24oKSB7XG4gICAgLy8gVE9ETzogd3JpdGVcbiAgfSk7XG59KTtcbiJdfQ==