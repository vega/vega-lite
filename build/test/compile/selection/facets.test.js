"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var selection = require("../../../src/compile/selection/selection");
var util_1 = require("../../util");
describe('Faceted Selections', function () {
    var model = util_1.parseModel({
        "data": { "url": "data/anscombe.json" },
        "facet": {
            "column": { "field": "Series", "type": "nominal" },
            "row": { "field": "X", "type": "nominal", "bin": true },
        },
        "spec": {
            "layer": [{
                    "mark": "rule",
                    "encoding": { "y": { "value": 10 } }
                }, {
                    "selection": {
                        "one": { "type": "single" },
                        "twp": { "type": "multi" },
                        "three": { "type": "interval" }
                    },
                    "mark": "rule",
                    "encoding": {
                        "x": { "value": 10 }
                    }
                }]
        }
    });
    model.parse();
    var unit = model.children[0].children[1];
    it('should assemble a facet signal', function () {
        chai_1.assert.includeDeepMembers(selection.assembleUnitSelectionSignals(unit, []), [
            {
                "name": "facet",
                "value": {},
                "on": [
                    {
                        "events": [{ "source": "scope", "type": "mousemove" }],
                        "update": "isTuple(facet) ? facet : group(\"cell\").datum"
                    }
                ]
            }
        ]);
    });
    it('should name the unit with the facet keys', function () {
        chai_1.assert.equal(selection.unitName(unit), "\"child_layer_1\" + '_' + facet[\"bin_maxbins_6_X\"] + '_' + facet[\"Series\"]");
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXRzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2VsZWN0aW9uL2ZhY2V0cy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUM1QixvRUFBc0U7QUFFdEUsbUNBQXNDO0FBRXRDLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRTtJQUM3QixJQUFNLEtBQUssR0FBRyxpQkFBVSxDQUFDO1FBQ3ZCLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxvQkFBb0IsRUFBQztRQUNyQyxPQUFPLEVBQUU7WUFDUCxRQUFRLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7WUFDaEQsS0FBSyxFQUFFLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUM7U0FDdEQ7UUFDRCxNQUFNLEVBQUU7WUFDTixPQUFPLEVBQUUsQ0FBQztvQkFDUixNQUFNLEVBQUUsTUFBTTtvQkFDZCxVQUFVLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsRUFBRSxFQUFDLEVBQUM7aUJBQ2pDLEVBQUU7b0JBQ0QsV0FBVyxFQUFFO3dCQUNYLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUM7d0JBQ3pCLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUM7d0JBQ3hCLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUM7cUJBQzlCO29CQUNELE1BQU0sRUFBRSxNQUFNO29CQUNkLFVBQVUsRUFBRTt3QkFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsRUFBRSxFQUFDO3FCQUNuQjtpQkFDRixDQUFDO1NBQ0g7S0FDRixDQUFDLENBQUM7SUFFSCxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDZCxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQWMsQ0FBQztJQUV4RCxFQUFFLENBQUMsZ0NBQWdDLEVBQUU7UUFDbkMsYUFBTSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDMUU7Z0JBQ0UsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsSUFBSSxFQUFFO29CQUNKO3dCQUNFLFFBQVEsRUFBRSxDQUFDLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBQyxNQUFNLEVBQUUsV0FBVyxFQUFDLENBQUM7d0JBQ25ELFFBQVEsRUFBRSxnREFBZ0Q7cUJBQzNEO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywwQ0FBMEMsRUFBRTtRQUM3QyxhQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQ25DLGdGQUEwRSxDQUFDLENBQUM7SUFDaEYsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9