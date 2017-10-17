"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var filterinvalid_1 = require("../../../src/compile/data/filterinvalid");
var util_1 = require("../../../src/util");
var util_2 = require("../../util");
function parse(model) {
    return filterinvalid_1.FilterInvalidNode.make(model);
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
                    y: { aggregate: 'count', field: '*', type: "quantitative" }
                }
            });
            chai_1.assert.deepEqual(parse(model), null);
        });
    });
    describe('assemble', function () {
        // TODO: write
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyaW52YWxpZC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL2RhdGEvZmlsdGVyaW52YWxpZC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUk1Qix5RUFBMEU7QUFHMUUsMENBQWtEO0FBQ2xELG1DQUFtRDtBQUVuRCxlQUFlLEtBQXFCO0lBQ2xDLE1BQU0sQ0FBQyxpQ0FBaUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkMsQ0FBQztBQUVELFFBQVEsQ0FBQyx5QkFBeUIsRUFBRTtJQUNsQyxRQUFRLENBQUMsYUFBYSxFQUFFO1FBQ3RCLElBQU0sSUFBSSxHQUFhO1lBQ3JCLElBQUksRUFBRSxPQUFPO1lBQ2IsUUFBUSxFQUFFO2dCQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztnQkFDdEMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFDO2dCQUNsQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7Z0JBQ3JDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQzthQUN0QztTQUNGLENBQUM7UUFFRixFQUFFLENBQUMsOENBQThDLEVBQUU7WUFDakQsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUMsYUFBTSxDQUFDLFNBQVMsQ0FBeUIsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRTtnQkFDNUQsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2dCQUN2QyxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUM7YUFDcEMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsbUVBQW1FLEVBQUU7WUFDdEUsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUMsZ0JBQVMsQ0FBcUIsSUFBSSxFQUFFO2dCQUN4RSxNQUFNLEVBQUU7b0JBQ04sYUFBYSxFQUFFLFFBQVE7aUJBQ3hCO2FBQ0YsQ0FBQyxDQUFDLENBQUM7WUFDSixhQUFNLENBQUMsU0FBUyxDQUF5QixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFO2dCQUM1RCxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7Z0JBQ3ZDLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBQzthQUNwQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx5REFBeUQsRUFBRTtZQUM1RCxJQUFNLEtBQUssR0FBRyw4QkFBdUIsQ0FBQyxnQkFBUyxDQUFxQixJQUFJLEVBQUU7Z0JBQ3hFLE1BQU0sRUFBRTtvQkFDTixhQUFhLEVBQUUsSUFBSTtpQkFDcEI7YUFDRixDQUFDLENBQUMsQ0FBQztZQUNKLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFFLDJDQUEyQyxFQUFFO1lBQy9DLElBQU0sS0FBSyxHQUFHLDhCQUF1QixDQUFDO2dCQUNwQyxJQUFJLEVBQUUsT0FBTztnQkFDYixRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7aUJBQzFEO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxVQUFVLEVBQUU7UUFDbkIsY0FBYztJQUNoQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=