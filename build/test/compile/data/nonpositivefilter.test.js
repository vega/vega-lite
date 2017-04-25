/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var nonpositivefilter_1 = require("../../../src/compile/data/nonpositivefilter");
var util_1 = require("../../util");
describe('compile/data/nonpositivefilter', function () {
    it('should produce the correct nonPositiveFilter', function () {
        var model = util_1.parseUnitModel({
            mark: "point",
            encoding: {
                x: { field: 'a', type: "temporal" },
                y: { field: 'b', type: "quantitative", scale: { type: 'log' } }
            }
        });
        var filter = nonpositivefilter_1.NonPositiveFilterNode.make(model);
        chai_1.assert.deepEqual(filter.filter, {
            b: true,
            a: false
        });
        chai_1.assert.deepEqual(filter.assemble(), [{
                type: 'filter',
                expr: 'datum["b"] > 0'
            }]);
    });
    // it('unit (with aggregated log scale)', function() {
    //   // TODO: write
    // });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9ucG9zaXRpdmVmaWx0ZXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL25vbnBvc2l0aXZlZmlsdGVyLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOEJBQThCOzs7QUFFOUIsNkJBQTRCO0FBRTVCLGlGQUFrRjtBQUVsRixtQ0FBMEM7QUFFMUMsUUFBUSxDQUFDLGdDQUFnQyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRTtRQUNqRCxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO1lBQzNCLElBQUksRUFBRSxPQUFPO1lBQ2IsUUFBUSxFQUFFO2dCQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBQztnQkFDakMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBRSxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUMsRUFBQzthQUM1RDtTQUNGLENBQUMsQ0FBQztRQUVILElBQU0sTUFBTSxHQUFHLHlDQUFxQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVqRCxhQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDOUIsQ0FBQyxFQUFFLElBQUk7WUFDUCxDQUFDLEVBQUUsS0FBSztTQUNULENBQUMsQ0FBQztRQUVILGFBQU0sQ0FBQyxTQUFTLENBQWdCLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDO2dCQUNsRCxJQUFJLEVBQUUsUUFBUTtnQkFDZCxJQUFJLEVBQUUsZ0JBQWdCO2FBQ3ZCLENBQUMsQ0FBQyxDQUFDO0lBQ04sQ0FBQyxDQUFDLENBQUM7SUFFSCxzREFBc0Q7SUFDdEQsbUJBQW1CO0lBQ25CLE1BQU07QUFDUixDQUFDLENBQUMsQ0FBQyJ9