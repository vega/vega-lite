"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:quotemark */
var chai_1 = require("chai");
var formula_1 = require("../../../src/compile/data/formula");
var unit_1 = require("../../../src/compile/unit");
var util_1 = require("../../../src/util");
describe('compile/data/formula', function () {
    describe('parseUnit', function () {
        it('should return a dictionary of formula', function () {
            var f = {
                "as": "a",
                "expr": "5"
            };
            var model = new unit_1.UnitModel({
                "data": { "url": "a.json" },
                "transform": {
                    "calculate": [f]
                },
                "mark": "point",
                "encoding": {}
            }, null, '');
            var formulaComponent = formula_1.formula.parseUnit(model);
            var hashed = util_1.hash(f);
            var expected = {};
            expected[hashed] = f;
            chai_1.assert.deepEqual(formulaComponent, expected);
        });
    });
    describe('parseLayer', function () {
        // TODO: write test
    });
    describe('parseFacet', function () {
        // TODO: write test
    });
    describe('assemble', function () {
        it('should return correct vega formula transform', function () {
            chai_1.assert.deepEqual(formula_1.formula.assemble({
                aaa: { as: 'a', expr: '5' }
            }), [{
                    type: 'formula',
                    as: 'a',
                    expr: '5'
                }]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybXVsYS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL2RhdGEvZm9ybXVsYS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsOEJBQThCO0FBQzlCLDZCQUE0QjtBQUM1Qiw2REFBMEQ7QUFDMUQsa0RBQW9EO0FBQ3BELDBDQUE2QztBQUc3QyxRQUFRLENBQUMsc0JBQXNCLEVBQUU7SUFDL0IsUUFBUSxDQUFDLFdBQVcsRUFBRTtRQUNwQixFQUFFLENBQUMsdUNBQXVDLEVBQUU7WUFDMUMsSUFBTSxDQUFDLEdBQVk7Z0JBQ2pCLElBQUksRUFBRSxHQUFHO2dCQUNULE1BQU0sRUFBRSxHQUFHO2FBQ1osQ0FBQztZQUNGLElBQU0sS0FBSyxHQUFHLElBQUksZ0JBQVMsQ0FBQztnQkFDMUIsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBQztnQkFDekIsV0FBVyxFQUFFO29CQUNYLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDakI7Z0JBQ0QsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsVUFBVSxFQUFFLEVBQUU7YUFDZixFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztZQUViLElBQU0sZ0JBQWdCLEdBQUcsaUJBQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbEQsSUFBTSxNQUFNLEdBQUcsV0FBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUNsQixRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3JCLGFBQU0sQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxZQUFZLEVBQUU7UUFDckIsbUJBQW1CO0lBQ3JCLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFlBQVksRUFBRTtRQUNyQixtQkFBbUI7SUFDckIsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsVUFBVSxFQUFFO1FBQ25CLEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRTtZQUNqRCxhQUFNLENBQUMsU0FBUyxDQUFDLGlCQUFPLENBQUMsUUFBUSxDQUFDO2dCQUNoQyxHQUFHLEVBQUUsRUFBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUM7YUFDVCxDQUFDLEVBQUUsQ0FBQztvQkFDcEIsSUFBSSxFQUFFLFNBQVM7b0JBQ2YsRUFBRSxFQUFFLEdBQUc7b0JBQ1AsSUFBSSxFQUFFLEdBQUc7aUJBQ1YsQ0FBQyxDQUFDLENBQUM7UUFDTixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==