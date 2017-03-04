/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var nonpositivefilter_1 = require("../../../src/compile/data/nonpositivefilter");
var util_1 = require("../../util");
describe('compile/data/nonpositivefilter', function () {
    var model = util_1.parseUnitModel({
        mark: "point",
        encoding: {
            x: { field: 'a', type: "temporal" },
            y: { field: 'b', type: "quantitative", scale: { type: 'log' } }
        }
    });
    describe('parseUnit & assemble', function () {
        it('should produce the correct nonPositiveFilter component', function () {
            model.component.data = {};
            model.component.data.nonPositiveFilter = nonpositivefilter_1.nonPositiveFilter.parseUnit(model);
            chai_1.assert.deepEqual(model.component.data.nonPositiveFilter, {
                b: true,
                a: false
            });
        });
        it('should assemble the correct filter transform', function () {
            var filterTransform = nonpositivefilter_1.nonPositiveFilter.assemble(model.component.data.nonPositiveFilter)[0];
            chai_1.assert.deepEqual(filterTransform, {
                type: 'filter',
                expr: 'datum["b"] > 0'
            });
        });
        // it('unit (with aggregated log scale)', function() {
        //   // TODO: write
        // });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9ucG9zaXRpdmVmaWx0ZXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL25vbnBvc2l0aXZlZmlsdGVyLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOEJBQThCOzs7QUFFOUIsNkJBQTRCO0FBRTVCLGlGQUE4RTtBQUU5RSxtQ0FBMEM7QUFFMUMsUUFBUSxDQUFDLGdDQUFnQyxFQUFFO0lBQ3pDLElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7UUFDM0IsSUFBSSxFQUFFLE9BQU87UUFDYixRQUFRLEVBQUU7WUFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUM7WUFDakMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBRSxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUMsRUFBQztTQUM1RDtLQUNGLENBQUMsQ0FBQztJQUNILFFBQVEsQ0FBQyxzQkFBc0IsRUFBRTtRQUMvQixFQUFFLENBQUMsd0RBQXdELEVBQUU7WUFDM0QsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsRUFBbUIsQ0FBQztZQUMzQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxxQ0FBaUIsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDNUUsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtnQkFDdkQsQ0FBQyxFQUFFLElBQUk7Z0JBQ1AsQ0FBQyxFQUFFLEtBQUs7YUFDVCxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRTtZQUNqRCxJQUFNLGVBQWUsR0FBRyxxQ0FBaUIsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5RixhQUFNLENBQUMsU0FBUyxDQUFDLGVBQWUsRUFBRTtnQkFDaEMsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsSUFBSSxFQUFFLGdCQUFnQjthQUN2QixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILHNEQUFzRDtRQUN0RCxtQkFBbUI7UUFDbkIsTUFBTTtJQUNSLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFlBQVksRUFBRTtRQUNyQixtQkFBbUI7SUFDckIsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsWUFBWSxFQUFFO1FBQ3JCLG1CQUFtQjtJQUNyQixDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxVQUFVLEVBQUU7UUFDbkIsbUJBQW1CO0lBQ3JCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==