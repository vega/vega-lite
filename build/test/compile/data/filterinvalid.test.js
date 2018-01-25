"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var filterinvalid_1 = require("../../../src/compile/data/filterinvalid");
var util_1 = require("../../../src/util");
var util_2 = require("../../util");
function parse(model) {
    return filterinvalid_1.FilterInvalidNode.make(model);
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
                    y: { aggregate: 'count', field: '*', type: "quantitative" }
                }
            });
            chai_1.assert.deepEqual(parse(model), null);
        });
    });
    describe('assemble', function () {
        // TODO: write
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyaW52YWxpZC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL2RhdGEvZmlsdGVyaW52YWxpZC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUk1Qix5RUFBMEU7QUFHMUUsMENBQWtEO0FBQ2xELG1DQUFtRDtBQUVuRCxlQUFlLEtBQXFCO0lBQ2xDLE1BQU0sQ0FBQyxpQ0FBaUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkMsQ0FBQztBQUVELFFBQVEsQ0FBQyx5QkFBeUIsRUFBRTtJQUNsQyxRQUFRLENBQUMsYUFBYSxFQUFFO1FBQ3RCLElBQU0sSUFBSSxHQUFhO1lBQ3JCLElBQUksRUFBRSxPQUFPO1lBQ2IsUUFBUSxFQUFFO2dCQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztnQkFDdEMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFDO2dCQUNsQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7Z0JBQ3JDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQzthQUN0QztTQUNGLENBQUM7UUFFRixFQUFFLENBQUMsOENBQThDLEVBQUU7WUFDakQsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUMsYUFBTSxDQUFDLFNBQVMsQ0FBeUIsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRTtnQkFDNUQsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2dCQUN2QyxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUM7YUFDcEMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsbUVBQW1FLEVBQUU7WUFDdEUsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUMsZ0JBQVMsQ0FBcUIsSUFBSSxFQUFFO2dCQUN4RSxNQUFNLEVBQUU7b0JBQ04sYUFBYSxFQUFFLFFBQVE7aUJBQ3hCO2FBQ0YsQ0FBQyxDQUFDLENBQUM7WUFDSixhQUFNLENBQUMsU0FBUyxDQUF5QixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFO2dCQUM1RCxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7Z0JBQ3ZDLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBQzthQUNwQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx5REFBeUQsRUFBRTtZQUM1RCxJQUFNLEtBQUssR0FBRyw4QkFBdUIsQ0FBQyxnQkFBUyxDQUFxQixJQUFJLEVBQUU7Z0JBQ3hFLE1BQU0sRUFBRTtvQkFDTixhQUFhLEVBQUUsSUFBSTtpQkFDcEI7YUFDRixDQUFDLENBQUMsQ0FBQztZQUNKLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFFLDJDQUEyQyxFQUFFO1lBQy9DLElBQU0sS0FBSyxHQUFHLDhCQUF1QixDQUFDO2dCQUNwQyxJQUFJLEVBQUUsT0FBTztnQkFDYixRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7aUJBQzFEO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxVQUFVLEVBQUU7UUFDbkIsY0FBYztJQUNoQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcblxuaW1wb3J0IHtUb3BMZXZlbCwgVW5pdFNwZWN9IGZyb20gJy4uLy4uLy4uL3NyYy9zcGVjJztcblxuaW1wb3J0IHtGaWx0ZXJJbnZhbGlkTm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9maWx0ZXJpbnZhbGlkJztcbmltcG9ydCB7TW9kZWxXaXRoRmllbGR9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL21vZGVsJztcbmltcG9ydCB7RmllbGREZWZ9IGZyb20gJy4uLy4uLy4uL3NyYy9maWVsZGRlZic7XG5pbXBvcnQge0RpY3QsIG1lcmdlRGVlcH0gZnJvbSAnLi4vLi4vLi4vc3JjL3V0aWwnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmZ1bmN0aW9uIHBhcnNlKG1vZGVsOiBNb2RlbFdpdGhGaWVsZCkge1xuICByZXR1cm4gRmlsdGVySW52YWxpZE5vZGUubWFrZShtb2RlbCk7XG59XG5cbmRlc2NyaWJlKCdjb21waWxlL2RhdGEvbnVsbGZpbHRlcicsIGZ1bmN0aW9uKCkge1xuICBkZXNjcmliZSgnY29tcGlsZVVuaXQnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBzcGVjOiBVbml0U3BlYyA9IHtcbiAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgIHk6IHtmaWVsZDogJ3FxJywgdHlwZTogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIHg6IHtmaWVsZDogJ3R0JywgdHlwZTogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgY29sb3I6IHtmaWVsZDogJ29vJywgdHlwZTogXCJvcmRpbmFsXCJ9LFxuICAgICAgICBzaGFwZToge2ZpZWxkOiAnbm4nLCB0eXBlOiBcIm5vbWluYWxcIn1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaXQoJ3Nob3VsZCBhZGQgZmlsdGVyTnVsbCBmb3IgUSBhbmQgVCBieSBkZWZhdWx0JywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZShzcGVjKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8RGljdDxGaWVsZERlZjxzdHJpbmc+Pj4ocGFyc2UobW9kZWwpLmZpbHRlciwge1xuICAgICAgICBxcToge2ZpZWxkOiAncXEnLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgdHQ6IHtmaWVsZDogJ3R0JywgdHlwZTogXCJ0ZW1wb3JhbFwifVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGFkZCBmaWx0ZXJOdWxsIGZvciBRIGFuZCBUIHdoZW4gaW52YWxpZFZhbHVlcyBpcyBcImZpbHRlclwiLicsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUobWVyZ2VEZWVwPFRvcExldmVsPFVuaXRTcGVjPj4oc3BlYywge1xuICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICBpbnZhbGlkVmFsdWVzOiAnZmlsdGVyJ1xuICAgICAgICB9XG4gICAgICB9KSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPERpY3Q8RmllbGREZWY8c3RyaW5nPj4+KHBhcnNlKG1vZGVsKS5maWx0ZXIsIHtcbiAgICAgICAgcXE6IHtmaWVsZDogJ3FxJywgdHlwZTogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIHR0OiB7ZmllbGQ6ICd0dCcsIHR5cGU6IFwidGVtcG9yYWxcIn1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBhZGQgbm8gbnVsbCBmaWx0ZXIgaWYgd2hlbiBpbnZhbGlkVmFsdWVzIGlzIG51bGwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKG1lcmdlRGVlcDxUb3BMZXZlbDxVbml0U3BlYz4+KHNwZWMsIHtcbiAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgaW52YWxpZFZhbHVlczogbnVsbFxuICAgICAgICB9XG4gICAgICB9KSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHBhcnNlKG1vZGVsKSwgbnVsbCk7XG4gICAgfSk7XG5cbiAgICBpdCAoJ3Nob3VsZCBhZGQgbm8gbnVsbCBmaWx0ZXIgZm9yIGNvdW50IGZpZWxkJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB5OiB7YWdncmVnYXRlOiAnY291bnQnLCBmaWVsZDogJyonLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwYXJzZShtb2RlbCksIG51bGwpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnYXNzZW1ibGUnLCBmdW5jdGlvbigpIHtcbiAgICAvLyBUT0RPOiB3cml0ZVxuICB9KTtcbn0pO1xuIl19