"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var nullfilter_1 = require("../../../src/compile/data/nullfilter");
var util_1 = require("../../../src/util");
var util_2 = require("../../util");
function parse(model) {
    return nullfilter_1.NullFilterNode.make(model);
}
describe('compile/data/nullfilter', function () {
    describe('compileUnit', function () {
        var spec = {
            mark: "point",
            encoding: {
                y: { field: 'qq', type: "quantitative" },
                x: { field: 'tt', type: "temporal" },
                color: { field: 'oo', type: "ordinal" }
            }
        };
        it('should add filterNull for Q and T by default', function () {
            var model = util_2.parseUnitModel(spec);
            chai_1.assert.deepEqual(parse(model).filteredFields, {
                qq: { field: 'qq', type: "quantitative" },
                tt: { field: 'tt', type: "temporal" },
                oo: null
            });
        });
        it('should add filterNull for O when specified', function () {
            var model = util_2.parseUnitModel(util_1.mergeDeep(spec, {
                config: {
                    filterInvalid: true
                }
            }));
            chai_1.assert.deepEqual(parse(model).filteredFields, {
                qq: { field: 'qq', type: "quantitative" },
                tt: { field: 'tt', type: "temporal" },
                oo: { field: 'oo', type: "ordinal" }
            });
        });
        it('should add no null filter if filterInvalid is false', function () {
            var model = util_2.parseUnitModel(util_1.mergeDeep(spec, {
                config: {
                    filterInvalid: false
                }
            }));
            chai_1.assert.deepEqual(parse(model).filteredFields, {
                qq: null,
                tt: null,
                oo: null
            });
        });
        it('should add no null filter for count field', function () {
            var model = util_2.parseUnitModel({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVsbGZpbHRlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL2RhdGEvbnVsbGZpbHRlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUk1QixtRUFBb0U7QUFHcEUsMENBQWtEO0FBQ2xELG1DQUEwQztBQUUxQyxlQUFlLEtBQXFCO0lBQ2xDLE1BQU0sQ0FBQywyQkFBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBRUQsUUFBUSxDQUFDLHlCQUF5QixFQUFFO0lBQ2xDLFFBQVEsQ0FBQyxhQUFhLEVBQUU7UUFDdEIsSUFBTSxJQUFJLEdBQWE7WUFDckIsSUFBSSxFQUFFLE9BQU87WUFDYixRQUFRLEVBQUU7Z0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2dCQUN0QyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUM7Z0JBQ2xDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQzthQUN0QztTQUNGLENBQUM7UUFFRixFQUFFLENBQUMsOENBQThDLEVBQUU7WUFDakQsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuQyxhQUFNLENBQUMsU0FBUyxDQUF5QixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsY0FBYyxFQUFFO2dCQUNwRSxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7Z0JBQ3ZDLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBQztnQkFDbkMsRUFBRSxFQUFFLElBQUk7YUFDVCxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRTtZQUMvQyxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDLGdCQUFTLENBQUMsSUFBSSxFQUFFO2dCQUMzQyxNQUFNLEVBQUU7b0JBQ04sYUFBYSxFQUFFLElBQUk7aUJBQ3BCO2FBQ0YsQ0FBQyxDQUFDLENBQUM7WUFDSixhQUFNLENBQUMsU0FBUyxDQUF5QixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsY0FBYyxFQUFFO2dCQUNwRSxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7Z0JBQ3ZDLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBQztnQkFDbkMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDO2FBQ25DLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHFEQUFxRCxFQUFFO1lBQ3hELElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUMsZ0JBQVMsQ0FBQyxJQUFJLEVBQUU7Z0JBQzNDLE1BQU0sRUFBRTtvQkFDTixhQUFhLEVBQUUsS0FBSztpQkFDckI7YUFDRixDQUFDLENBQUMsQ0FBQztZQUNKLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLGNBQWMsRUFBRTtnQkFDNUMsRUFBRSxFQUFFLElBQUk7Z0JBQ1IsRUFBRSxFQUFFLElBQUk7Z0JBQ1IsRUFBRSxFQUFFLElBQUk7YUFDVCxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBRSwyQ0FBMkMsRUFBRTtZQUMvQyxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO2dCQUMzQixJQUFJLEVBQUUsT0FBTztnQkFDYixRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7aUJBQzFEO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxVQUFVLEVBQUU7UUFDbkIsY0FBYztJQUNoQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=