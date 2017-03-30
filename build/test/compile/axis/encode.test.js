/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var encode = require("../../../src/compile/axis/encode");
var util_1 = require("../../util");
describe('compile/axis', function () {
    describe('encode.labels()', function () {
        it('should rotate label', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "temporal", timeUnit: "month" }
                }
            });
            var labels = encode.labels(model, 'x', {}, {});
            chai_1.assert.equal(labels.angle.value, 270);
        });
        it('should also rotate labels if the channel is column', function () {
            var model = util_1.parseModel({
                mark: "point",
                encoding: {
                    column: { field: "a", type: "temporal", timeUnit: "month", axis: { labelAngle: 270 } }
                }
            });
            var labels = encode.labels(model, 'column', {}, {});
            chai_1.assert.equal(labels.angle.value, 270);
        });
        it('should have correct text.signal for quarter timeUnits', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "temporal", timeUnit: "quarter" }
                }
            });
            var labels = encode.labels(model, 'x', {}, {});
            var expected = "'Q' + quarter(datum.value)";
            chai_1.assert.equal(labels.text.signal, expected);
        });
        it('should have correct text.signal for yearquartermonth timeUnits', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "temporal", timeUnit: "yearquartermonth" }
                }
            });
            var labels = encode.labels(model, 'x', {}, {});
            var expected = "'Q' + quarter(datum.value) + ' ' + timeFormat(datum.value, '%b %Y')";
            chai_1.assert.equal(labels.text.signal, expected);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvYXhpcy9lbmNvZGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4QkFBOEI7OztBQUU5Qiw2QkFBNEI7QUFFNUIseURBQTJEO0FBQzNELG1DQUFzRDtBQUd0RCxRQUFRLENBQUMsY0FBYyxFQUFFO0lBQ3ZCLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtRQUMxQixFQUFFLENBQUMscUJBQXFCLEVBQUU7WUFDeEIsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztnQkFDM0IsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDO2lCQUNyRDthQUNGLENBQUMsQ0FBQztZQUNILElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDakQsYUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxvREFBb0QsRUFBRTtZQUN2RCxJQUFNLEtBQUssR0FBRyxpQkFBVSxDQUFDO2dCQUN2QixJQUFJLEVBQUUsT0FBTztnQkFDYixRQUFRLEVBQUU7b0JBQ1IsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUMsVUFBVSxFQUFFLEdBQUcsRUFBQyxFQUFDO2lCQUNuRjthQUNGLENBQUMsQ0FBQztZQUNILElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDdEQsYUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx1REFBdUQsRUFBRTtZQUMxRCxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO2dCQUMzQixJQUFJLEVBQUUsT0FBTztnQkFDYixRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUM7aUJBQ3ZEO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsSUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNqRCxJQUFJLFFBQVEsR0FBRyw0QkFBNEIsQ0FBQztZQUM1QyxhQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGdFQUFnRSxFQUFFO1lBQ25FLElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7Z0JBQzNCLElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLGtCQUFrQixFQUFDO2lCQUNoRTthQUNGLENBQUMsQ0FBQztZQUNILElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDakQsSUFBSSxRQUFRLEdBQUcscUVBQXFFLENBQUM7WUFDckYsYUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM3QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==