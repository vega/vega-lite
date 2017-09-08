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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydGllcy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL2xlZ2VuZC9wcm9wZXJ0aWVzLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLGdEQUFpRDtBQUNqRCxtRUFBcUU7QUFFckUsUUFBUSxDQUFDLGdCQUFnQixFQUFFO0lBQ3pCLFFBQVEsQ0FBQyxVQUFVLEVBQUU7UUFDbkIsRUFBRSxDQUFDLHNEQUFzRCxFQUFFO1lBQ3pELElBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBQyxNQUFNLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUV6RSxhQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRTtnQkFDdkIsRUFBQyxRQUFRLEVBQUUsa0NBQWtDLEVBQUM7Z0JBQzlDLEVBQUMsUUFBUSxFQUFFLGtDQUFrQyxFQUFDO2FBQy9DLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDhDQUE4QyxFQUFFO1lBQ2pELElBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7WUFFdEQsYUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLENBQUMsQ0FBQyxDQUFDO0lBRUwsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsUUFBUSxFQUFFO1FBQ2pCLEVBQUUsQ0FBQyw2Q0FBNkMsRUFBRTtZQUNoRCxJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxlQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDL0QsYUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsZ0RBQWdELEVBQUU7WUFDbkQsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsY0FBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzFELGFBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGdEQUFnRCxFQUFFO1lBQ25ELElBQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLGVBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztZQUNoRSxhQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUM3QixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw2REFBNkQsRUFBRTtZQUNoRSxJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxlQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDckQsYUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNEVBQTRFLEVBQUU7WUFDL0UsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsZUFBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3hELGFBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDJFQUEyRSxFQUFFO1lBQzlFLElBQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGVBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztZQUN2RCxhQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUM3QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==