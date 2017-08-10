"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var nonpositivefilter_1 = require("../../../src/compile/data/nonpositivefilter");
var util_1 = require("../../util");
describe('compile/data/nonpositivefilter', function () {
    it('should produce the correct nonPositiveFilter', function () {
        var model = util_1.parseUnitModelWithScale({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9ucG9zaXRpdmVmaWx0ZXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL25vbnBvc2l0aXZlZmlsdGVyLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBRTVCLGlGQUFrRjtBQUVsRixtQ0FBbUQ7QUFFbkQsUUFBUSxDQUFDLGdDQUFnQyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRTtRQUNqRCxJQUFNLEtBQUssR0FBRyw4QkFBdUIsQ0FBQztZQUNwQyxJQUFJLEVBQUUsT0FBTztZQUNiLFFBQVEsRUFBRTtnQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUM7Z0JBQ2pDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFDLEVBQUM7YUFDNUQ7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFNLE1BQU0sR0FBRyx5Q0FBcUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFakQsYUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO1lBQzlCLENBQUMsRUFBRSxJQUFJO1lBQ1AsQ0FBQyxFQUFFLEtBQUs7U0FDVCxDQUFDLENBQUM7UUFFSCxhQUFNLENBQUMsU0FBUyxDQUFnQixNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQztnQkFDbEQsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsSUFBSSxFQUFFLGdCQUFnQjthQUN2QixDQUFDLENBQUMsQ0FBQztJQUNOLENBQUMsQ0FBQyxDQUFDO0lBRUgsc0RBQXNEO0lBQ3RELG1CQUFtQjtJQUNuQixNQUFNO0FBQ1IsQ0FBQyxDQUFDLENBQUMifQ==