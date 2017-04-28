"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var pathorder_1 = require("../../../src/compile/data/pathorder");
var util_1 = require("../../util");
function assemble(model) {
    return pathorder_1.OrderNode.make(model).assemble();
}
describe('compile/data/pathorder', function () {
    describe('compileUnit', function () {
        it('should order by order field for line with order (connected scatterplot)', function () {
            var model = util_1.parseUnitModel({
                "data": { "url": "data/driving.json" },
                "mark": "line",
                "encoding": {
                    "x": { "field": "miles", "type": "quantitative", "scale": { "zero": false } },
                    "y": { "field": "gas", "type": "quantitative", "scale": { "zero": false } },
                    "order": { "field": "year", "type": "temporal" }
                }
            });
            chai_1.assert.deepEqual(assemble(model), {
                type: 'collect',
                sort: {
                    field: ['year'],
                    order: ['ascending']
                }
            });
        });
        it('should order by x by default if x is the dimension', function () {
            var model = util_1.parseUnitModel({
                "data": { "url": "data/movies.json" },
                "mark": "line",
                "encoding": {
                    "x": {
                        "bin": { "maxbins": 10 },
                        "field": "IMDB_Rating",
                        "type": "quantitative"
                    },
                    "color": {
                        "field": "Source",
                        "type": "nominal"
                    },
                    "y": {
                        "aggregate": "count",
                        "type": "quantitative"
                    }
                }
            });
            chai_1.assert.deepEqual(assemble(model), {
                type: 'collect',
                sort: {
                    field: 'bin_maxbins_10_IMDB_Rating_start',
                    order: 'descending'
                }
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0aG9yZGVyLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS9wYXRob3JkZXIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFDNUIsaUVBQThEO0FBRzlELG1DQUEwQztBQUUxQyxrQkFBa0IsS0FBZ0I7SUFDaEMsTUFBTSxDQUFDLHFCQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzFDLENBQUM7QUFFRCxRQUFRLENBQUMsd0JBQXdCLEVBQUU7SUFDakMsUUFBUSxDQUFDLGFBQWEsRUFBRTtRQUN0QixFQUFFLENBQUMseUVBQXlFLEVBQUU7WUFDNUUsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztnQkFDM0IsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLG1CQUFtQixFQUFDO2dCQUNwQyxNQUFNLEVBQUUsTUFBTTtnQkFDZCxVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsRUFBQztvQkFDeEUsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsRUFBQztvQkFDdEUsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFDO2lCQUM5QzthQUNGLENBQUMsQ0FBQztZQUNILGFBQU0sQ0FBQyxTQUFTLENBQXFCLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDcEQsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsSUFBSSxFQUFFO29CQUNKLEtBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQztvQkFDZixLQUFLLEVBQUUsQ0FBQyxXQUFXLENBQUM7aUJBQ3JCO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsb0RBQW9ELEVBQUU7WUFDdkQsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztnQkFDM0IsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFDO2dCQUNuQyxNQUFNLEVBQUUsTUFBTTtnQkFDZCxVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFO3dCQUNILEtBQUssRUFBRSxFQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUM7d0JBQ3RCLE9BQU8sRUFBRSxhQUFhO3dCQUN0QixNQUFNLEVBQUUsY0FBYztxQkFDdkI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLE9BQU8sRUFBRSxRQUFRO3dCQUNqQixNQUFNLEVBQUUsU0FBUztxQkFDbEI7b0JBQ0QsR0FBRyxFQUFFO3dCQUNILFdBQVcsRUFBRSxPQUFPO3dCQUNwQixNQUFNLEVBQUUsY0FBYztxQkFDdkI7aUJBQ0Y7YUFDRixDQUFDLENBQUM7WUFDSCxhQUFNLENBQUMsU0FBUyxDQUFxQixRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ3BELElBQUksRUFBRSxTQUFTO2dCQUNmLElBQUksRUFBRTtvQkFDSixLQUFLLEVBQUUsa0NBQWtDO29CQUN6QyxLQUFLLEVBQUUsWUFBWTtpQkFDcEI7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==