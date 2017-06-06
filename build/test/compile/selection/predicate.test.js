"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var mixins_1 = require("../../../src/compile/mark/mixins");
var selection = require("../../../src/compile/selection/selection");
var util_1 = require("../../util");
function getModel(selectionDef) {
    var model = util_1.parseUnitModel({
        "mark": "circle",
        "encoding": {
            "x": { "field": "Horsepower", "type": "quantitative" },
            "y": { "field": "Miles_per_Gallon", "type": "quantitative" },
            "color": {
                "field": "Cylinders", "type": "O",
                "condition": {
                    "selection": "!one",
                    "value": "grey"
                }
            },
            "opacity": {
                "field": "Origin", "type": "N",
                "condition": {
                    "selection": "one",
                    "value": 0.5
                }
            }
        }
    });
    model.component.selection = selection.parseUnitSelection(model, {
        "one": selectionDef
    });
    return model;
}
describe('Selection Predicate', function () {
    it('generates Vega production rules', function () {
        var single = getModel({ type: 'single' });
        chai_1.assert.deepEqual(mixins_1.nonPosition('color', single), {
            color: [
                { test: "!vlPoint(\"one_store\", \"\", datum, \"union\", \"all\")", value: "grey" },
                { scale: "color", field: "Cylinders" }
            ]
        });
        chai_1.assert.deepEqual(mixins_1.nonPosition('opacity', single), {
            opacity: [
                { test: "vlPoint(\"one_store\", \"\", datum, \"union\", \"all\")", value: 0.5 },
                { scale: "opacity", field: "Origin" }
            ]
        });
        var multi = getModel({ type: 'multi' });
        chai_1.assert.deepEqual(mixins_1.nonPosition('color', multi), {
            color: [
                { test: "!vlPoint(\"one_store\", \"\", datum, \"union\", \"all\")", value: "grey" },
                { scale: "color", field: "Cylinders" }
            ]
        });
        chai_1.assert.deepEqual(mixins_1.nonPosition('opacity', multi), {
            opacity: [
                { test: "vlPoint(\"one_store\", \"\", datum, \"union\", \"all\")", value: 0.5 },
                { scale: "opacity", field: "Origin" }
            ]
        });
        var interval = getModel({ type: 'interval' });
        chai_1.assert.deepEqual(mixins_1.nonPosition('color', interval), {
            color: [
                { test: "!vlInterval(\"one_store\", \"\", datum, \"union\", \"all\")", value: "grey" },
                { scale: "color", field: "Cylinders" }
            ]
        });
        chai_1.assert.deepEqual(mixins_1.nonPosition('opacity', interval), {
            opacity: [
                { test: "vlInterval(\"one_store\", \"\", datum, \"union\", \"all\")", value: 0.5 },
                { scale: "opacity", field: "Origin" }
            ]
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZGljYXRlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2VsZWN0aW9uL3ByZWRpY2F0ZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUM1QiwyREFBNkQ7QUFDN0Qsb0VBQXNFO0FBQ3RFLG1DQUEwQztBQUUxQyxrQkFBa0IsWUFBaUI7SUFDakMsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztRQUMzQixNQUFNLEVBQUUsUUFBUTtRQUNoQixVQUFVLEVBQUU7WUFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7WUFDbkQsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7WUFDekQsT0FBTyxFQUFFO2dCQUNQLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLEdBQUc7Z0JBQ2pDLFdBQVcsRUFBRTtvQkFDWCxXQUFXLEVBQUUsTUFBTTtvQkFDbkIsT0FBTyxFQUFFLE1BQU07aUJBQ2hCO2FBQ0Y7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsR0FBRztnQkFDOUIsV0FBVyxFQUFFO29CQUNYLFdBQVcsRUFBRSxLQUFLO29CQUNsQixPQUFPLEVBQUUsR0FBRztpQkFDYjthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7SUFFSCxLQUFLLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFO1FBQzlELEtBQUssRUFBRSxZQUFZO0tBQ3BCLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDZixDQUFDO0FBR0QsUUFBUSxDQUFDLHFCQUFxQixFQUFFO0lBQzlCLEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRTtRQUNwQyxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQztRQUMxQyxhQUFNLENBQUMsU0FBUyxDQUFDLG9CQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQzdDLEtBQUssRUFBRTtnQkFDTCxFQUFDLElBQUksRUFBRSwwREFBMEQsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFDO2dCQUNqRixFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBQzthQUNyQztTQUNGLENBQUMsQ0FBQztRQUVILGFBQU0sQ0FBQyxTQUFTLENBQUMsb0JBQVcsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDL0MsT0FBTyxFQUFFO2dCQUNQLEVBQUMsSUFBSSxFQUFFLHlEQUF5RCxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUM7Z0JBQzdFLEVBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFDO2FBQ3BDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7UUFDeEMsYUFBTSxDQUFDLFNBQVMsQ0FBQyxvQkFBVyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsRUFBRTtZQUM1QyxLQUFLLEVBQUU7Z0JBQ0wsRUFBQyxJQUFJLEVBQUUsMERBQTBELEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBQztnQkFDakYsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUM7YUFDckM7U0FDRixDQUFDLENBQUM7UUFFSCxhQUFNLENBQUMsU0FBUyxDQUFDLG9CQUFXLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQzlDLE9BQU8sRUFBRTtnQkFDUCxFQUFDLElBQUksRUFBRSx5REFBeUQsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFDO2dCQUM3RSxFQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBQzthQUNwQztTQUNGLENBQUMsQ0FBQztRQUVILElBQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUMsQ0FBQyxDQUFDO1FBQzlDLGFBQU0sQ0FBQyxTQUFTLENBQUMsb0JBQVcsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLEVBQUU7WUFDL0MsS0FBSyxFQUFFO2dCQUNMLEVBQUMsSUFBSSxFQUFFLDZEQUE2RCxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUM7Z0JBQ3BGLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFDO2FBQ3JDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsYUFBTSxDQUFDLFNBQVMsQ0FBQyxvQkFBVyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsRUFBRTtZQUNqRCxPQUFPLEVBQUU7Z0JBQ1AsRUFBQyxJQUFJLEVBQUUsNERBQTRELEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBQztnQkFDaEYsRUFBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUM7YUFDcEM7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=