"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var log = require("../src/log");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0L3RyYW5zZm9ybS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBRTVCLGdDQUFrQztBQUdsQyw4Q0FBK0Q7QUFFL0QsUUFBUSxDQUFDLHNCQUFzQixFQUFFO0lBQy9CLEVBQUUsQ0FBQyw0RkFBNEYsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQUMsV0FBVztRQUNwSCxJQUFNLE1BQU0sR0FBMkI7WUFDckMsR0FBRyxFQUFFO2dCQUNILEVBQUMsR0FBRyxFQUFFLEVBQUMsUUFBUSxFQUFFLGNBQTBCLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLEVBQUMsRUFBQztnQkFDOUUsRUFBQyxFQUFFLEVBQUUsQ0FBQyxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUM7YUFDL0I7U0FDRixDQUFDO1FBQ0YsSUFBTSxTQUFTLEdBQWdCO1lBQzdCLEVBQUMsTUFBTSxRQUFBLEVBQUM7U0FDVCxDQUFDO1FBQ0YsYUFBTSxDQUFDLFNBQVMsQ0FBQyw4QkFBa0IsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO2dCQUMvQyxNQUFNLEVBQUU7b0JBQ04sR0FBRyxFQUFFO3dCQUNILEVBQUMsR0FBRyxFQUFFLEVBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsRUFBQyxFQUFDO3dCQUNuRSxFQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQztxQkFDL0I7aUJBQ0Y7YUFDRixDQUFDLENBQUMsQ0FBQztRQUNKLGFBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFDdEYsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNOLENBQUMsQ0FBQyxDQUFDIn0=