"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var properties = tslib_1.__importStar(require("../../../src/compile/legend/properties"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydGllcy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL2xlZ2VuZC9wcm9wZXJ0aWVzLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7O0FBRTlCLDZCQUE0QjtBQUM1QixnREFBaUQ7QUFDakQseUZBQXFFO0FBRXJFLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtJQUN6QixRQUFRLENBQUMsVUFBVSxFQUFFO1FBQ25CLEVBQUUsQ0FBQyxzREFBc0QsRUFBRTtZQUN6RCxJQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUMsTUFBTSxFQUFFLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7WUFFekUsYUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUU7Z0JBQ3ZCLEVBQUMsUUFBUSxFQUFFLGtDQUFrQyxFQUFDO2dCQUM5QyxFQUFDLFFBQVEsRUFBRSxrQ0FBa0MsRUFBQzthQUMvQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRTtZQUNqRCxJQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1lBRXRELGFBQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxDQUFDLENBQUMsQ0FBQztJQUVMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFFBQVEsRUFBRTtRQUNqQixFQUFFLENBQUMsNkNBQTZDLEVBQUU7WUFDaEQsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsZUFBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQy9ELGFBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGdEQUFnRCxFQUFFO1lBQ25ELElBQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLGNBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMxRCxhQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUM3QixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxnREFBZ0QsRUFBRTtZQUNuRCxJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxlQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDaEUsYUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDN0IsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNkRBQTZELEVBQUU7WUFDaEUsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsZUFBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3JELGFBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDRFQUE0RSxFQUFFO1lBQy9FLElBQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLGVBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztZQUN4RCxhQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUM3QixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyRUFBMkUsRUFBRTtZQUM5RSxJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxlQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDdkQsYUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDN0IsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7Q09MT1IsIFNJWkV9IGZyb20gJy4uLy4uLy4uL3NyYy9jaGFubmVsJztcbmltcG9ydCAqIGFzIHByb3BlcnRpZXMgZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvbGVnZW5kL3Byb3BlcnRpZXMnO1xuXG5kZXNjcmliZSgnY29tcGlsZS9sZWdlbmQnLCBmdW5jdGlvbigpIHtcbiAgZGVzY3JpYmUoJ3ZhbHVlcygpJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3QgdGltZXN0YW1wIHZhbHVlcyBmb3IgRGF0ZVRpbWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgdmFsdWVzID0gcHJvcGVydGllcy52YWx1ZXMoe3ZhbHVlczogW3t5ZWFyOiAxOTcwfSwge3llYXI6IDE5ODB9XX0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHZhbHVlcywgW1xuICAgICAgICB7XCJzaWduYWxcIjogXCJkYXRldGltZSgxOTcwLCAwLCAxLCAwLCAwLCAwLCAwKVwifSxcbiAgICAgICAge1wic2lnbmFsXCI6IFwiZGF0ZXRpbWUoMTk4MCwgMCwgMSwgMCwgMCwgMCwgMClcIn0sXG4gICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc2ltcGx5IHJldHVybiB2YWx1ZXMgZm9yIG5vbi1EYXRlVGltZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlcyA9IHByb3BlcnRpZXMudmFsdWVzKHt2YWx1ZXM6IFsxLDIsMyw0XX0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHZhbHVlcywgWzEsMiwzLDRdKTtcbiAgICB9KTtcblxuICB9KTtcblxuICBkZXNjcmliZSgndHlwZSgpJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGdyYWRpZW50IHR5cGUgZm9yIGNvbG9yIHNjYWxlJywgKCkgPT4ge1xuICAgICAgY29uc3QgdCA9IHByb3BlcnRpZXMudHlwZSgncXVhbnRpdGF0aXZlJywgQ09MT1IsICdzZXF1ZW50aWFsJyk7XG4gICAgICBhc3NlcnQuZXF1YWwodCwgJ2dyYWRpZW50Jyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZXR1cm4gZ3JhZGllbnQgdHlwZSBmb3Igc2l6ZSBzY2FsZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHQgPSBwcm9wZXJ0aWVzLnR5cGUoJ3F1YW50aXRhdGl2ZScsIFNJWkUsICdsaW5lYXInKTtcbiAgICAgIGFzc2VydC5lcXVhbCh0LCB1bmRlZmluZWQpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gbm8gdHlwZSBmb3IgY29sb3Igc2NhbGUgd2l0aCBiaW4nLCAoKSA9PiB7XG4gICAgICBjb25zdCB0ID0gcHJvcGVydGllcy50eXBlKCdxdWFudGl0YXRpdmUnLCBDT0xPUiwgJ2Jpbi1vcmRpbmFsJyk7XG4gICAgICBhc3NlcnQuZXF1YWwodCwgdW5kZWZpbmVkKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGdyYWRpZW50IHR5cGUgZm9yIGNvbG9yIHNjYWxlIHdpdGggdGltZSBzY2FsZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHQgPSBwcm9wZXJ0aWVzLnR5cGUoJ3RlbXBvcmFsJywgQ09MT1IsICd0aW1lJyk7XG4gICAgICBhc3NlcnQuZXF1YWwodCwgJ2dyYWRpZW50Jyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBubyB0eXBlIGZvciBjb2xvciBzY2FsZSB3aXRoIG9yZGluYWwgc2NhbGUgYW5kIHRlbXBvcmFsIHR5cGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB0ID0gcHJvcGVydGllcy50eXBlKCd0ZW1wb3JhbCcsIENPTE9SLCAnb3JkaW5hbCcpO1xuICAgICAgYXNzZXJ0LmVxdWFsKHQsIHVuZGVmaW5lZCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBubyB0eXBlIGZvciBjb2xvciBzY2FsZSB3aXRoIG9yZGluYWwgc2NhbGUgYW5kIG9yZGluYWwgdHlwZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHQgPSBwcm9wZXJ0aWVzLnR5cGUoJ29yZGluYWwnLCBDT0xPUiwgJ29yZGluYWwnKTtcbiAgICAgIGFzc2VydC5lcXVhbCh0LCB1bmRlZmluZWQpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19