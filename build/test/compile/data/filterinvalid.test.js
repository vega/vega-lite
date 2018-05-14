/* tslint:disable:quotemark */
import { assert } from 'chai';
import { FilterInvalidNode } from '../../../src/compile/data/filterinvalid';
import { mergeDeep } from '../../../src/util';
import { parseUnitModelWithScale } from '../../util';
function parse(model) {
    return FilterInvalidNode.make(null, model);
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
            var model = parseUnitModelWithScale(spec);
            assert.deepEqual(parse(model).filter, {
                qq: { field: 'qq', type: "quantitative" },
                tt: { field: 'tt', type: "temporal" }
            });
        });
        it('should add filterNull for Q and T when invalidValues is "filter".', function () {
            var model = parseUnitModelWithScale(mergeDeep(spec, {
                config: {
                    invalidValues: 'filter'
                }
            }));
            assert.deepEqual(parse(model).filter, {
                qq: { field: 'qq', type: "quantitative" },
                tt: { field: 'tt', type: "temporal" }
            });
        });
        it('should add no null filter if when invalidValues is null', function () {
            var model = parseUnitModelWithScale(mergeDeep(spec, {
                config: {
                    invalidValues: null
                }
            }));
            assert.deepEqual(parse(model), null);
        });
        it('should add no null filter for count field', function () {
            var model = parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    y: { aggregate: 'count', type: "quantitative" }
                }
            });
            assert.deepEqual(parse(model), null);
        });
    });
    describe('assemble', function () {
        it('should assemble simple filter', function () {
            var model = parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    y: { field: 'foo', type: "quantitative" }
                }
            });
            assert.deepEqual(parse(model).assemble(), {
                type: 'filter',
                expr: 'datum["foo"] !== null && !isNaN(datum["foo"])'
            });
        });
        it('should assemble filter for nested data', function () {
            var model = parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    y: { field: 'foo.bar', type: "quantitative" }
                }
            });
            assert.deepEqual(parse(model).assemble(), {
                type: 'filter',
                expr: 'datum["foo.bar"] !== null && !isNaN(datum["foo.bar"])'
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyaW52YWxpZC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL2RhdGEvZmlsdGVyaW52YWxpZC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4QjtBQUU5QixPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzVCLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHlDQUF5QyxDQUFDO0FBRzFFLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM1QyxPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFHbkQsZUFBZSxLQUFnQjtJQUM3QixPQUFPLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDN0MsQ0FBQztBQUVELFFBQVEsQ0FBQyx5QkFBeUIsRUFBRTtJQUNsQyxRQUFRLENBQUMsYUFBYSxFQUFFO1FBQ3RCLElBQU0sSUFBSSxHQUF1QjtZQUMvQixJQUFJLEVBQUUsT0FBTztZQUNiLFFBQVEsRUFBRTtnQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7Z0JBQ3RDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBQztnQkFDbEMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDO2dCQUNyQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7YUFDdEM7U0FDRixDQUFDO1FBRUYsRUFBRSxDQUFDLDhDQUE4QyxFQUFFO1lBQ2pELElBQU0sS0FBSyxHQUFHLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzVDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxD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Y2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtGaWx0ZXJJbnZhbGlkTm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9maWx0ZXJpbnZhbGlkJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS91bml0JztcbmltcG9ydCB7Tm9ybWFsaXplZFVuaXRTcGVjLCBUb3BMZXZlbH0gZnJvbSAnLi4vLi4vLi4vc3JjL3NwZWMnO1xuaW1wb3J0IHttZXJnZURlZXB9IGZyb20gJy4uLy4uLy4uL3NyYy91dGlsJztcbmltcG9ydCB7cGFyc2VVbml0TW9kZWxXaXRoU2NhbGV9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5cbmZ1bmN0aW9uIHBhcnNlKG1vZGVsOiBVbml0TW9kZWwpIHtcbiAgcmV0dXJuIEZpbHRlckludmFsaWROb2RlLm1ha2UobnVsbCwgbW9kZWwpO1xufVxuXG5kZXNjcmliZSgnY29tcGlsZS9kYXRhL251bGxmaWx0ZXInLCBmdW5jdGlvbigpIHtcbiAgZGVzY3JpYmUoJ2NvbXBpbGVVbml0JywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgc3BlYzogTm9ybWFsaXplZFVuaXRTcGVjID0ge1xuICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgeToge2ZpZWxkOiAncXEnLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgeDoge2ZpZWxkOiAndHQnLCB0eXBlOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICBjb2xvcjoge2ZpZWxkOiAnb28nLCB0eXBlOiBcIm9yZGluYWxcIn0sXG4gICAgICAgIHNoYXBlOiB7ZmllbGQ6ICdubicsIHR5cGU6IFwibm9taW5hbFwifVxuICAgICAgfVxuICAgIH07XG5cbiAgICBpdCgnc2hvdWxkIGFkZCBmaWx0ZXJOdWxsIGZvciBRIGFuZCBUIGJ5IGRlZmF1bHQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHNwZWMpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwYXJzZShtb2RlbCkuZmlsdGVyLCB7XG4gICAgICAgIHFxOiB7ZmllbGQ6ICdxcScsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICB0dDoge2ZpZWxkOiAndHQnLCB0eXBlOiBcInRlbXBvcmFsXCJ9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYWRkIGZpbHRlck51bGwgZm9yIFEgYW5kIFQgd2hlbiBpbnZhbGlkVmFsdWVzIGlzIFwiZmlsdGVyXCIuJywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZShtZXJnZURlZXA8VG9wTGV2ZWw8Tm9ybWFsaXplZFVuaXRTcGVjPj4oc3BlYywge1xuICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICBpbnZhbGlkVmFsdWVzOiAnZmlsdGVyJ1xuICAgICAgICB9XG4gICAgICB9KSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHBhcnNlKG1vZGVsKS5maWx0ZXIsIHtcbiAgICAgICAgcXE6IHtmaWVsZDogJ3FxJywgdHlwZTogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIHR0OiB7ZmllbGQ6ICd0dCcsIHR5cGU6IFwidGVtcG9yYWxcIn1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBhZGQgbm8gbnVsbCBmaWx0ZXIgaWYgd2hlbiBpbnZhbGlkVmFsdWVzIGlzIG51bGwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKG1lcmdlRGVlcDxUb3BMZXZlbDxOb3JtYWxpemVkVW5pdFNwZWM+PihzcGVjLCB7XG4gICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgIGludmFsaWRWYWx1ZXM6IG51bGxcbiAgICAgICAgfVxuICAgICAgfSkpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwYXJzZShtb2RlbCksIG51bGwpO1xuICAgIH0pO1xuXG4gICAgaXQgKCdzaG91bGQgYWRkIG5vIG51bGwgZmlsdGVyIGZvciBjb3VudCBmaWVsZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeToge2FnZ3JlZ2F0ZTogJ2NvdW50JywgdHlwZTogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocGFyc2UobW9kZWwpLCBudWxsKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2Fzc2VtYmxlJywgZnVuY3Rpb24oKSB7XG4gICAgaXQgKCdzaG91bGQgYXNzZW1ibGUgc2ltcGxlIGZpbHRlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeToge2ZpZWxkOiAnZm9vJywgdHlwZTogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocGFyc2UobW9kZWwpLmFzc2VtYmxlKCksIHtcbiAgICAgICAgdHlwZTogJ2ZpbHRlcicsXG4gICAgICAgIGV4cHI6ICdkYXR1bVtcImZvb1wiXSAhPT0gbnVsbCAmJiAhaXNOYU4oZGF0dW1bXCJmb29cIl0pJ1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCAoJ3Nob3VsZCBhc3NlbWJsZSBmaWx0ZXIgZm9yIG5lc3RlZCBkYXRhJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB5OiB7ZmllbGQ6ICdmb28uYmFyJywgdHlwZTogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocGFyc2UobW9kZWwpLmFzc2VtYmxlKCksIHtcbiAgICAgICAgdHlwZTogJ2ZpbHRlcicsXG4gICAgICAgIGV4cHI6ICdkYXR1bVtcImZvby5iYXJcIl0gIT09IG51bGwgJiYgIWlzTmFOKGRhdHVtW1wiZm9vLmJhclwiXSknXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==