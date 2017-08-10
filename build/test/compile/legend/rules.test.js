"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var rules = require("../../../src/compile/legend/rules");
describe('compile/legend', function () {
    describe('values()', function () {
        it('should return correct timestamp values for DateTimes', function () {
            var values = rules.values({ values: [{ year: 1970 }, { year: 1980 }] });
            chai_1.assert.deepEqual(values, [
                { "signal": "datetime(1970, 0, 1, 0, 0, 0, 0)" },
                { "signal": "datetime(1980, 0, 1, 0, 0, 0, 0)" },
            ]);
        });
        it('should simply return values for non-DateTime', function () {
            var values = rules.values({ values: [1, 2, 3, 4] });
            chai_1.assert.deepEqual(values, [1, 2, 3, 4]);
        });
    });
    describe('type()', function () {
        it('should return gradient type for color scale', function () {
            var t = rules.type('quantitative', channel_1.COLOR, 'sequential');
            chai_1.assert.equal(t, 'gradient');
        });
        it('should not return gradient type for size scale', function () {
            var t = rules.type('quantitative', channel_1.SIZE, 'linear');
            chai_1.assert.equal(t, undefined);
        });
        it('should return no type for color scale with bin', function () {
            var t = rules.type('quantitative', channel_1.COLOR, 'bin-ordinal');
            chai_1.assert.equal(t, undefined);
        });
        it('should return gradient type for color scale with time scale', function () {
            var t = rules.type('temporal', channel_1.COLOR, 'time');
            chai_1.assert.equal(t, 'gradient');
        });
        it('should return no type for color scale with ordinal scale and temporal type', function () {
            var t = rules.type('temporal', channel_1.COLOR, 'ordinal');
            chai_1.assert.equal(t, undefined);
        });
        it('should return no type for color scale with ordinal scale and ordinal type', function () {
            var t = rules.type('ordinal', channel_1.COLOR, 'ordinal');
            chai_1.assert.equal(t, undefined);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZXMudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9sZWdlbmQvcnVsZXMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFDNUIsZ0RBQWlEO0FBQ2pELHlEQUEyRDtBQUczRCxRQUFRLENBQUMsZ0JBQWdCLEVBQUU7SUFDekIsUUFBUSxDQUFDLFVBQVUsRUFBRTtRQUNuQixFQUFFLENBQUMsc0RBQXNELEVBQUU7WUFDekQsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1lBRXBFLGFBQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO2dCQUN2QixFQUFDLFFBQVEsRUFBRSxrQ0FBa0MsRUFBQztnQkFDOUMsRUFBQyxRQUFRLEVBQUUsa0NBQWtDLEVBQUM7YUFDL0MsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsOENBQThDLEVBQUU7WUFDakQsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUVqRCxhQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsQ0FBQyxDQUFDLENBQUM7SUFFTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxRQUFRLEVBQUU7UUFDakIsRUFBRSxDQUFDLDZDQUE2QyxFQUFFO1lBQ2hELElBQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLGVBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztZQUMxRCxhQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxnREFBZ0QsRUFBRTtZQUNuRCxJQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxjQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDckQsYUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDN0IsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsZ0RBQWdELEVBQUU7WUFDbkQsSUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsZUFBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQzNELGFBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDZEQUE2RCxFQUFFO1lBQ2hFLElBQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLGVBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNoRCxhQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw0RUFBNEUsRUFBRTtZQUMvRSxJQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxlQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDbkQsYUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDN0IsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMkVBQTJFLEVBQUU7WUFDOUUsSUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsZUFBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ2xELGFBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9