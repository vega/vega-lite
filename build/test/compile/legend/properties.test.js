"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var properties = require("../../../src/compile/legend/properties");
describe('compile/legend', function () {
    describe('values()', function () {
        it('should return correct timestamp values for DateTimes', function () {
            var values = properties.values({ values: [{ year: 1970 }, { year: 1980 }] });
            chai_1.assert.deepEqual(values, [
                { "signal": "datetime(1970, 0, 1, 0, 0, 0, 0)" },
                { "signal": "datetime(1980, 0, 1, 0, 0, 0, 0)" },
            ]);
        });
        it('should simply return values for non-DateTime', function () {
            var values = properties.values({ values: [1, 2, 3, 4] });
            chai_1.assert.deepEqual(values, [1, 2, 3, 4]);
        });
    });
    describe('type()', function () {
        it('should return gradient type for color scale', function () {
            var t = properties.type('quantitative', channel_1.COLOR, 'sequential');
            chai_1.assert.equal(t, 'gradient');
        });
        it('should not return gradient type for size scale', function () {
            var t = properties.type('quantitative', channel_1.SIZE, 'linear');
            chai_1.assert.equal(t, undefined);
        });
        it('should return no type for color scale with bin', function () {
            var t = properties.type('quantitative', channel_1.COLOR, 'bin-ordinal');
            chai_1.assert.equal(t, undefined);
        });
        it('should return gradient type for color scale with time scale', function () {
            var t = properties.type('temporal', channel_1.COLOR, 'time');
            chai_1.assert.equal(t, 'gradient');
        });
        it('should return no type for color scale with ordinal scale and temporal type', function () {
            var t = properties.type('temporal', channel_1.COLOR, 'ordinal');
            chai_1.assert.equal(t, undefined);
        });
        it('should return no type for color scale with ordinal scale and ordinal type', function () {
            var t = properties.type('ordinal', channel_1.COLOR, 'ordinal');
            chai_1.assert.equal(t, undefined);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydGllcy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL2xlZ2VuZC9wcm9wZXJ0aWVzLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLGdEQUFpRDtBQUNqRCxtRUFBcUU7QUFFckUsUUFBUSxDQUFDLGdCQUFnQixFQUFFO0lBQ3pCLFFBQVEsQ0FBQyxVQUFVLEVBQUU7UUFDbkIsRUFBRSxDQUFDLHNEQUFzRCxFQUFFO1lBQ3pELElBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBQyxNQUFNLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUV6RSxhQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRTtnQkFDdkIsRUFBQyxRQUFRLEVBQUUsa0NBQWtDLEVBQUM7Z0JBQzlDLEVBQUMsUUFBUSxFQUFFLGtDQUFrQyxFQUFDO2FBQy9DLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDhDQUE4QyxFQUFFO1lBQ2pELElBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7WUFFdEQsYUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLENBQUMsQ0FBQyxDQUFDO0lBRUwsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsUUFBUSxFQUFFO1FBQ2pCLEVBQUUsQ0FBQyw2Q0FBNkMsRUFBRTtZQUNoRCxJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxlQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDL0QsYUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsZ0RBQWdELEVBQUU7WUFDbkQsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsY0FBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzFELGFBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGdEQUFnRCxFQUFFO1lBQ25ELElBQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLGVBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztZQUNoRSxhQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUM3QixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw2REFBNkQsRUFBRTtZQUNoRSxJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxlQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDckQsYUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNEVBQTRFLEVBQUU7WUFDL0UsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsZUFBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3hELGFBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDJFQUEyRSxFQUFFO1lBQzlFLElBQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGVBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztZQUN2RCxhQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUM3QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtDT0xPUiwgU0laRX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NoYW5uZWwnO1xuaW1wb3J0ICogYXMgcHJvcGVydGllcyBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9sZWdlbmQvcHJvcGVydGllcyc7XG5cbmRlc2NyaWJlKCdjb21waWxlL2xlZ2VuZCcsIGZ1bmN0aW9uKCkge1xuICBkZXNjcmliZSgndmFsdWVzKCknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCB0aW1lc3RhbXAgdmFsdWVzIGZvciBEYXRlVGltZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZXMgPSBwcm9wZXJ0aWVzLnZhbHVlcyh7dmFsdWVzOiBbe3llYXI6IDE5NzB9LCB7eWVhcjogMTk4MH1dfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwodmFsdWVzLCBbXG4gICAgICAgIHtcInNpZ25hbFwiOiBcImRhdGV0aW1lKDE5NzAsIDAsIDEsIDAsIDAsIDAsIDApXCJ9LFxuICAgICAgICB7XCJzaWduYWxcIjogXCJkYXRldGltZSgxOTgwLCAwLCAxLCAwLCAwLCAwLCAwKVwifSxcbiAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzaW1wbHkgcmV0dXJuIHZhbHVlcyBmb3Igbm9uLURhdGVUaW1lJywgKCkgPT4ge1xuICAgICAgY29uc3QgdmFsdWVzID0gcHJvcGVydGllcy52YWx1ZXMoe3ZhbHVlczogWzEsMiwzLDRdfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwodmFsdWVzLCBbMSwyLDMsNF0pO1xuICAgIH0pO1xuXG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd0eXBlKCknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZ3JhZGllbnQgdHlwZSBmb3IgY29sb3Igc2NhbGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB0ID0gcHJvcGVydGllcy50eXBlKCdxdWFudGl0YXRpdmUnLCBDT0xPUiwgJ3NlcXVlbnRpYWwnKTtcbiAgICAgIGFzc2VydC5lcXVhbCh0LCAnZ3JhZGllbnQnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHJldHVybiBncmFkaWVudCB0eXBlIGZvciBzaXplIHNjYWxlJywgKCkgPT4ge1xuICAgICAgY29uc3QgdCA9IHByb3BlcnRpZXMudHlwZSgncXVhbnRpdGF0aXZlJywgU0laRSwgJ2xpbmVhcicpO1xuICAgICAgYXNzZXJ0LmVxdWFsKHQsIHVuZGVmaW5lZCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBubyB0eXBlIGZvciBjb2xvciBzY2FsZSB3aXRoIGJpbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHQgPSBwcm9wZXJ0aWVzLnR5cGUoJ3F1YW50aXRhdGl2ZScsIENPTE9SLCAnYmluLW9yZGluYWwnKTtcbiAgICAgIGFzc2VydC5lcXVhbCh0LCB1bmRlZmluZWQpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZ3JhZGllbnQgdHlwZSBmb3IgY29sb3Igc2NhbGUgd2l0aCB0aW1lIHNjYWxlJywgKCkgPT4ge1xuICAgICAgY29uc3QgdCA9IHByb3BlcnRpZXMudHlwZSgndGVtcG9yYWwnLCBDT0xPUiwgJ3RpbWUnKTtcbiAgICAgIGFzc2VydC5lcXVhbCh0LCAnZ3JhZGllbnQnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIG5vIHR5cGUgZm9yIGNvbG9yIHNjYWxlIHdpdGggb3JkaW5hbCBzY2FsZSBhbmQgdGVtcG9yYWwgdHlwZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHQgPSBwcm9wZXJ0aWVzLnR5cGUoJ3RlbXBvcmFsJywgQ09MT1IsICdvcmRpbmFsJyk7XG4gICAgICBhc3NlcnQuZXF1YWwodCwgdW5kZWZpbmVkKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIG5vIHR5cGUgZm9yIGNvbG9yIHNjYWxlIHdpdGggb3JkaW5hbCBzY2FsZSBhbmQgb3JkaW5hbCB0eXBlJywgKCkgPT4ge1xuICAgICAgY29uc3QgdCA9IHByb3BlcnRpZXMudHlwZSgnb3JkaW5hbCcsIENPTE9SLCAnb3JkaW5hbCcpO1xuICAgICAgYXNzZXJ0LmVxdWFsKHQsIHVuZGVmaW5lZCk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=