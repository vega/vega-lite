/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var legendParse = require("../../../src/compile/legend/parse");
var util_1 = require("../../util");
describe('compile/legend', function () {
    describe('parseLegend()', function () {
        it('should produce a Vega legend object with correct type and scale for color', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    color: { field: "a", type: "quantitative" }
                }
            });
            var def = legendParse.parseLegend(model, channel_1.COLOR);
            chai_1.assert.isObject(def);
            chai_1.assert.equal(def.title, 'a');
            chai_1.assert.equal(def.stroke, 'color');
            chai_1.assert.equal(def.type, 'gradient');
        });
        [channel_1.SIZE, channel_1.SHAPE, channel_1.OPACITY].forEach(function (channel) {
            it("should produce a Vega legend object with correct type and scale for " + channel, function () {
                var s = {
                    mark: "point",
                    encoding: {
                        x: { field: "a", type: "nominal" }
                    }
                };
                s.encoding[channel] = { field: "a", type: "nominal" };
                var model = util_1.parseUnitModel(s);
                var def = legendParse.parseLegend(model, channel);
                chai_1.assert.isObject(def);
                chai_1.assert.equal(def.title, "a");
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9sZWdlbmQvcGFyc2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4QkFBOEI7OztBQUU5Qiw2QkFBNEI7QUFDNUIsZ0RBQWlFO0FBQ2pFLCtEQUFpRTtBQUVqRSxtQ0FBMEM7QUFFMUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFO0lBQ3pCLFFBQVEsQ0FBQyxlQUFlLEVBQUU7UUFDeEIsRUFBRSxDQUFDLDJFQUEyRSxFQUFFO1lBQzlFLElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7Z0JBQzNCLElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7b0JBQ2hDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztpQkFDMUM7YUFDRixDQUFDLENBQUM7WUFDSCxJQUFNLEdBQUcsR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxlQUFLLENBQUMsQ0FBQztZQUNsRCxhQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3JCLGFBQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztZQUM3QixhQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDbEMsYUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO1FBRUgsQ0FBQyxjQUFJLEVBQUUsZUFBSyxFQUFFLGlCQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxPQUFPO1lBQ3BDLEVBQUUsQ0FBQyx5RUFBdUUsT0FBUyxFQUFFO2dCQUNuRixJQUFNLENBQUMsR0FBYTtvQkFDbEIsSUFBSSxFQUFFLE9BQU87b0JBQ2IsUUFBUSxFQUFFO3dCQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQztxQkFDakM7aUJBQ0YsQ0FBQztnQkFDRixDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDLENBQUM7Z0JBQ3BELElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRWhDLElBQU0sR0FBRyxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUNwRCxhQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNyQixhQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDL0IsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==