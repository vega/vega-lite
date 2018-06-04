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
        it('should assemble simple filter', function () {
            var model = util_2.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    y: { field: 'foo', type: "quantitative" }
                }
            });
            chai_1.assert.deepEqual(parse(model).assemble(), {
                type: 'filter',
                expr: 'datum["foo"] !== null && !isNaN(datum["foo"])'
            });
        });
        it('should assemble filter for nested data', function () {
            var model = util_2.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    y: { field: 'foo.bar', type: "quantitative" }
                }
            });
            chai_1.assert.deepEqual(parse(model).assemble(), {
                type: 'filter',
                expr: 'datum["foo.bar"] !== null && !isNaN(datum["foo.bar"])'
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyaW52YWxpZC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL2RhdGEvZmlsdGVyaW52YWxpZC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUM1Qix5RUFBMEU7QUFHMUUsMENBQTRDO0FBQzVDLG1DQUFtRDtBQUduRCxlQUFlLEtBQWdCO0lBQzdCLE9BQU8saUNBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM3QyxDQUFDO0FBRUQsUUFBUSxDQUFDLHlCQUF5QixFQUFFO0lBQ2xDLFFBQVEsQ0FBQyxhQUFhLEVBQUU7UUFDdEIsSUFBTSxJQUFJLEdBQXVCO1lBQy9CLElBQUksRUFBRSxPQUFPO1lBQ2IsUUFBUSxFQUFFO2dCQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztnQkFDdEMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFDO2dCQUNsQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7Z0JBQ3JDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQzthQUN0QztTQUNGLENBQUM7UUFFRixFQUFFLENBQUMsOENBQThDLEVBQUU7WUFDakQsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUMsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFO2dCQUNwQyxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7Z0JBQ3ZDLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBQzthQUNwQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxtRUFBbUUsRUFBRTtZQUN0RSxJQUFNLEtBQUssR0FBRyw4QkFBdUIsQ0FBQyxnQkFBUyxDQUErQixJQUFJLEVBQUU7Z0JBQ2xGLE1BQU0sRUFBRTtvQkFDTixhQUFhLEVBQUUsUUFBUTtpQkFDeEI7YUFDRixDQUFDLENBQUMsQ0FBQztZQUNKLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRTtnQkFDcEMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2dCQUN2QyxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUM7YUFDcEMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMseURBQXlELEVBQUU7WUFDNUQsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUMsZ0JBQVMsQ0FBK0IsSUFBSSxFQUFFO2dCQUNsRixNQUFNLEVBQUU7b0JBQ04sYUFBYSxFQUFFLElBQUk7aUJBQ3BCO2FBQ0YsQ0FBQyxDQUFDLENBQUM7WUFDSixhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBRSwyQ0FBMkMsRUFBRTtZQUMvQyxJQUFNLEtBQUssR0FBRyw4QkFBdUIsQ0FBQztnQkFDcEMsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztpQkFDOUM7YUFDRixDQUFDLENBQUM7WUFFSCxhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFVBQVUsRUFBRTtRQUNuQixFQUFFLENBQUUsK0JBQStCLEVBQUU7WUFDbkMsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUM7Z0JBQ3BDLElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7aUJBQ3hDO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0JBQ3hDLElBQUksRUFBRSxRQUFRO2dCQUNkLElBQUksRUFBRSwrQ0FBK0M7YUFDdEQsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUUsd0NBQXdDLEVBQUU7WUFDNUMsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUM7Z0JBQ3BDLElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7aUJBQzVDO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0JBQ3hDLElBQUksRUFBRSxRQUFRO2dCQUNkLElBQUksRUFBRSx1REFBdUQ7YUFDOUQsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7RmlsdGVySW52YWxpZE5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvZmlsdGVyaW52YWxpZCc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvdW5pdCc7XG5pbXBvcnQge05vcm1hbGl6ZWRVbml0U3BlYywgVG9wTGV2ZWx9IGZyb20gJy4uLy4uLy4uL3NyYy9zcGVjJztcbmltcG9ydCB7bWVyZ2VEZWVwfSBmcm9tICcuLi8uLi8uLi9zcmMvdXRpbCc7XG5pbXBvcnQge3BhcnNlVW5pdE1vZGVsV2l0aFNjYWxlfSBmcm9tICcuLi8uLi91dGlsJztcblxuXG5mdW5jdGlvbiBwYXJzZShtb2RlbDogVW5pdE1vZGVsKSB7XG4gIHJldHVybiBGaWx0ZXJJbnZhbGlkTm9kZS5tYWtlKG51bGwsIG1vZGVsKTtcbn1cblxuZGVzY3JpYmUoJ2NvbXBpbGUvZGF0YS9udWxsZmlsdGVyJywgZnVuY3Rpb24oKSB7XG4gIGRlc2NyaWJlKCdjb21waWxlVW5pdCcsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHNwZWM6IE5vcm1hbGl6ZWRVbml0U3BlYyA9IHtcbiAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgIHk6IHtmaWVsZDogJ3FxJywgdHlwZTogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIHg6IHtmaWVsZDogJ3R0JywgdHlwZTogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgY29sb3I6IHtmaWVsZDogJ29vJywgdHlwZTogXCJvcmRpbmFsXCJ9LFxuICAgICAgICBzaGFwZToge2ZpZWxkOiAnbm4nLCB0eXBlOiBcIm5vbWluYWxcIn1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaXQoJ3Nob3VsZCBhZGQgZmlsdGVyTnVsbCBmb3IgUSBhbmQgVCBieSBkZWZhdWx0JywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZShzcGVjKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocGFyc2UobW9kZWwpLmZpbHRlciwge1xuICAgICAgICBxcToge2ZpZWxkOiAncXEnLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgdHQ6IHtmaWVsZDogJ3R0JywgdHlwZTogXCJ0ZW1wb3JhbFwifVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGFkZCBmaWx0ZXJOdWxsIGZvciBRIGFuZCBUIHdoZW4gaW52YWxpZFZhbHVlcyBpcyBcImZpbHRlclwiLicsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUobWVyZ2VEZWVwPFRvcExldmVsPE5vcm1hbGl6ZWRVbml0U3BlYz4+KHNwZWMsIHtcbiAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgaW52YWxpZFZhbHVlczogJ2ZpbHRlcidcbiAgICAgICAgfVxuICAgICAgfSkpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwYXJzZShtb2RlbCkuZmlsdGVyLCB7XG4gICAgICAgIHFxOiB7ZmllbGQ6ICdxcScsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICB0dDoge2ZpZWxkOiAndHQnLCB0eXBlOiBcInRlbXBvcmFsXCJ9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYWRkIG5vIG51bGwgZmlsdGVyIGlmIHdoZW4gaW52YWxpZFZhbHVlcyBpcyBudWxsJywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZShtZXJnZURlZXA8VG9wTGV2ZWw8Tm9ybWFsaXplZFVuaXRTcGVjPj4oc3BlYywge1xuICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICBpbnZhbGlkVmFsdWVzOiBudWxsXG4gICAgICAgIH1cbiAgICAgIH0pKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocGFyc2UobW9kZWwpLCBudWxsKTtcbiAgICB9KTtcblxuICAgIGl0ICgnc2hvdWxkIGFkZCBubyBudWxsIGZpbHRlciBmb3IgY291bnQgZmllbGQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHk6IHthZ2dyZWdhdGU6ICdjb3VudCcsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHBhcnNlKG1vZGVsKSwgbnVsbCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdhc3NlbWJsZScsIGZ1bmN0aW9uKCkge1xuICAgIGl0ICgnc2hvdWxkIGFzc2VtYmxlIHNpbXBsZSBmaWx0ZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHk6IHtmaWVsZDogJ2ZvbycsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHBhcnNlKG1vZGVsKS5hc3NlbWJsZSgpLCB7XG4gICAgICAgIHR5cGU6ICdmaWx0ZXInLFxuICAgICAgICBleHByOiAnZGF0dW1bXCJmb29cIl0gIT09IG51bGwgJiYgIWlzTmFOKGRhdHVtW1wiZm9vXCJdKSdcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQgKCdzaG91bGQgYXNzZW1ibGUgZmlsdGVyIGZvciBuZXN0ZWQgZGF0YScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeToge2ZpZWxkOiAnZm9vLmJhcicsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHBhcnNlKG1vZGVsKS5hc3NlbWJsZSgpLCB7XG4gICAgICAgIHR5cGU6ICdmaWx0ZXInLFxuICAgICAgICBleHByOiAnZGF0dW1bXCJmb28uYmFyXCJdICE9PSBudWxsICYmICFpc05hTihkYXR1bVtcImZvby5iYXJcIl0pJ1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=