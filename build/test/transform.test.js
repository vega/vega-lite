"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var log = tslib_1.__importStar(require("../src/log"));
var transform_1 = require("../src/transform");
describe('normalizeTransform()', function () {
    it('replaces filter with timeUnit=yearmonthday with yearmonthdate and throws the right warning', log.wrap(function (localLogger) {
        var filter = {
            and: [
                { not: { timeUnit: 'yearmonthday', field: 'd', equal: { year: 2008 } } },
                { or: [{ field: 'a', equal: 5 }] }
            ]
        };
        var transform = [
            { filter: filter }
        ];
        chai_1.assert.deepEqual(transform_1.normalizeTransform(transform), [{
                filter: {
                    and: [
                        { not: { timeUnit: 'yearmonthdate', field: 'd', equal: { year: 2008 } } },
                        { or: [{ field: 'a', equal: 5 }] }
                    ]
                }
            }]);
        chai_1.assert.equal(localLogger.warns[0], log.message.dayReplacedWithDate('yearmonthday'));
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0L3RyYW5zZm9ybS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUE0QjtBQUM1QixzREFBa0M7QUFJbEMsOENBQStEO0FBRS9ELFFBQVEsQ0FBQyxzQkFBc0IsRUFBRTtJQUMvQixFQUFFLENBQUMsNEZBQTRGLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFDLFdBQVc7UUFDcEgsSUFBTSxNQUFNLEdBQThCO1lBQ3hDLEdBQUcsRUFBRTtnQkFDSCxFQUFDLEdBQUcsRUFBRSxFQUFDLFFBQVEsRUFBRSxjQUEwQixFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxFQUFDLEVBQUM7Z0JBQzlFLEVBQUMsRUFBRSxFQUFFLENBQUMsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFDO2FBQy9CO1NBQ0YsQ0FBQztRQUNGLElBQU0sU0FBUyxHQUFnQjtZQUM3QixFQUFDLE1BQU0sUUFBQSxFQUFDO1NBQ1QsQ0FBQztRQUNGLGFBQU0sQ0FBQyxTQUFTLENBQUMsOEJBQWtCLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQztnQkFDL0MsTUFBTSxFQUFFO29CQUNOLEdBQUcsRUFBRTt3QkFDSCxFQUFDLEdBQUcsRUFBRSxFQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLEVBQUMsRUFBQzt3QkFDbkUsRUFBQyxFQUFFLEVBQUUsQ0FBQyxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUM7cUJBQy9CO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDLENBQUM7UUFDSixhQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBQ3RGLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDTixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9zcmMvbG9nJztcbmltcG9ydCB7TG9naWNhbE9wZXJhbmR9IGZyb20gJy4uL3NyYy9sb2dpY2FsJztcbmltcG9ydCB7UHJlZGljYXRlfSBmcm9tICcuLi9zcmMvcHJlZGljYXRlJztcbmltcG9ydCB7VGltZVVuaXR9IGZyb20gJy4uL3NyYy90aW1ldW5pdCc7XG5pbXBvcnQge25vcm1hbGl6ZVRyYW5zZm9ybSwgVHJhbnNmb3JtfSBmcm9tICcuLi9zcmMvdHJhbnNmb3JtJztcblxuZGVzY3JpYmUoJ25vcm1hbGl6ZVRyYW5zZm9ybSgpJywgKCkgPT4ge1xuICBpdCgncmVwbGFjZXMgZmlsdGVyIHdpdGggdGltZVVuaXQ9eWVhcm1vbnRoZGF5IHdpdGggeWVhcm1vbnRoZGF0ZSBhbmQgdGhyb3dzIHRoZSByaWdodCB3YXJuaW5nJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgY29uc3QgZmlsdGVyOiBMb2dpY2FsT3BlcmFuZDxQcmVkaWNhdGU+ID0ge1xuICAgICAgYW5kOiBbXG4gICAgICAgIHtub3Q6IHt0aW1lVW5pdDogJ3llYXJtb250aGRheScgYXMgVGltZVVuaXQsIGZpZWxkOiAnZCcsIGVxdWFsOiB7eWVhcjogMjAwOH19fSxcbiAgICAgICAge29yOiBbe2ZpZWxkOiAnYScsIGVxdWFsOiA1fV19XG4gICAgICBdXG4gICAgfTtcbiAgICBjb25zdCB0cmFuc2Zvcm06IFRyYW5zZm9ybVtdID0gW1xuICAgICAge2ZpbHRlcn1cbiAgICBdO1xuICAgIGFzc2VydC5kZWVwRXF1YWwobm9ybWFsaXplVHJhbnNmb3JtKHRyYW5zZm9ybSksIFt7XG4gICAgICBmaWx0ZXI6IHtcbiAgICAgICAgYW5kOiBbXG4gICAgICAgICAge25vdDoge3RpbWVVbml0OiAneWVhcm1vbnRoZGF0ZScsIGZpZWxkOiAnZCcsIGVxdWFsOiB7eWVhcjogMjAwOH19fSxcbiAgICAgICAgICB7b3I6IFt7ZmllbGQ6ICdhJywgZXF1YWw6IDV9XX1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH1dKTtcbiAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLmRheVJlcGxhY2VkV2l0aERhdGUoJ3llYXJtb250aGRheScpKTtcbiAgfSkpO1xufSk7XG4iXX0=