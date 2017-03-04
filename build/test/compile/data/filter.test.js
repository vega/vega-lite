"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:quotemark */
var chai_1 = require("chai");
var util_1 = require("../../util");
var filter_1 = require("../../../src/compile/data/filter");
describe('compile/data/filter', function () {
    describe('parseUnit', function () {
        it('should return a correct expression for an array of filter', function () {
            var model = util_1.parseUnitModel({
                "data": { "values": [] },
                "transform": {
                    "filter": [
                        { field: 'color', equal: 'red' },
                        { field: 'color', oneOf: ['red', 'yellow'] },
                        { field: 'x', range: [0, 5] },
                        'datum["x"]===5',
                        { field: 'x', range: [null, null] },
                    ]
                },
                mark: 'point',
                encoding: {}
            });
            var expr = filter_1.filter.parseUnit(model);
            chai_1.assert.equal(expr, '(datum["color"]==="red") && ' +
                '(indexof(["red","yellow"], datum["color"]) !== -1) && ' +
                '(inrange(datum["x"], 0, 5)) && ' +
                '(datum["x"]===5)');
        });
        it('should return a correct expression for a single filter', function () {
            var model = util_1.parseUnitModel({
                "data": { "values": [] },
                "transform": {
                    "filter": 'datum["x"]===5'
                },
                mark: 'point',
                encoding: {}
            });
            var expr = filter_1.filter.parseUnit(model);
            chai_1.assert.equal(expr, 'datum["x"]===5');
        });
    });
    describe('parseLayer', function () {
        // TODO: write test
    });
    describe('parseFacet', function () {
        // TODO: write test
    });
    describe('assemble', function () {
        // TODO: write test
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS9maWx0ZXIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhCQUE4QjtBQUM5Qiw2QkFBNEI7QUFFNUIsbUNBQTBDO0FBQzFDLDJEQUF3RDtBQUV4RCxRQUFRLENBQUMscUJBQXFCLEVBQUU7SUFDOUIsUUFBUSxDQUFDLFdBQVcsRUFBRTtRQUNwQixFQUFFLENBQUMsMkRBQTJELEVBQUU7WUFDOUQsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztnQkFDM0IsTUFBTSxFQUFFLEVBQUMsUUFBUSxFQUFFLEVBQUUsRUFBQztnQkFDdEIsV0FBVyxFQUFFO29CQUNYLFFBQVEsRUFBRTt3QkFDUixFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBQzt3QkFDOUIsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsRUFBQzt3QkFDMUMsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQzt3QkFDM0IsZ0JBQWdCO3dCQUNoQixFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFDO3FCQUNsQztpQkFDRjtnQkFDRCxJQUFJLEVBQUUsT0FBTztnQkFDYixRQUFRLEVBQUUsRUFBRTthQUNiLENBQUMsQ0FBQztZQUNILElBQU0sSUFBSSxHQUFHLGVBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDckMsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsOEJBQThCO2dCQUMvQyx3REFBd0Q7Z0JBQ3hELGlDQUFpQztnQkFDakMsa0JBQWtCLENBQUMsQ0FBQztRQUN4QixDQUFDLENBQUMsQ0FBQztRQUdILEVBQUUsQ0FBQyx3REFBd0QsRUFBRTtZQUMzRCxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO2dCQUMzQixNQUFNLEVBQUUsRUFBQyxRQUFRLEVBQUUsRUFBRSxFQUFDO2dCQUN0QixXQUFXLEVBQUU7b0JBQ1gsUUFBUSxFQUFFLGdCQUFnQjtpQkFDM0I7Z0JBQ0QsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsUUFBUSxFQUFFLEVBQUU7YUFDYixDQUFDLENBQUM7WUFDSCxJQUFNLElBQUksR0FBRyxlQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JDLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxZQUFZLEVBQUU7UUFDckIsbUJBQW1CO0lBQ3JCLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFlBQVksRUFBRTtRQUNyQixtQkFBbUI7SUFDckIsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsVUFBVSxFQUFFO1FBQ25CLG1CQUFtQjtJQUNyQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=