"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var selection = tslib_1.__importStar(require("../../../src/compile/selection/selection"));
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
        chai_1.assert.equal(selection.unitName(unit), "\"child_layer_1\" + '_' + (facet[\"bin_maxbins_6_X\"]) + '_' + (facet[\"Series\"])");
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXRzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2VsZWN0aW9uL2ZhY2V0cy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7OztBQUU5Qiw2QkFBNEI7QUFDNUIsMEZBQXNFO0FBRXRFLG1DQUFzQztBQUV0QyxRQUFRLENBQUMsb0JBQW9CLEVBQUU7SUFDN0IsSUFBTSxLQUFLLEdBQUcsaUJBQVUsQ0FBQztRQUN2QixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsb0JBQW9CLEVBQUM7UUFDckMsT0FBTyxFQUFFO1lBQ1AsUUFBUSxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO1lBQ2hELEtBQUssRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDO1NBQ3REO1FBQ0QsTUFBTSxFQUFFO1lBQ04sT0FBTyxFQUFFLENBQUM7b0JBQ1IsTUFBTSxFQUFFLE1BQU07b0JBQ2QsVUFBVSxFQUFFLEVBQUMsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLEVBQUUsRUFBQyxFQUFDO2lCQUNqQyxFQUFFO29CQUNELFdBQVcsRUFBRTt3QkFDWCxLQUFLLEVBQUUsRUFBQyxNQUFNLEVBQUUsUUFBUSxFQUFDO3dCQUN6QixLQUFLLEVBQUUsRUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFDO3dCQUN4QixPQUFPLEVBQUUsRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFDO3FCQUM5QjtvQkFDRCxNQUFNLEVBQUUsTUFBTTtvQkFDZCxVQUFVLEVBQUU7d0JBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLEVBQUUsRUFBQztxQkFDbkI7aUJBQ0YsQ0FBQztTQUNIO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2QsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFjLENBQUM7SUFFeEQsRUFBRSxDQUFDLGdDQUFnQyxFQUFFO1FBQ25DLGFBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsNEJBQTRCLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQzFFO2dCQUNFLE1BQU0sRUFBRSxPQUFPO2dCQUNmLE9BQU8sRUFBRSxFQUFFO2dCQUNYLElBQUksRUFBRTtvQkFDSjt3QkFDRSxRQUFRLEVBQUUsQ0FBQyxFQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUMsTUFBTSxFQUFFLFdBQVcsRUFBQyxDQUFDO3dCQUNuRCxRQUFRLEVBQUUsZ0RBQWdEO3FCQUMzRDtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsMENBQTBDLEVBQUU7UUFDN0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUNuQyxvRkFBOEUsQ0FBQyxDQUFDO0lBQ3BGLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZSBxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0ICogYXMgc2VsZWN0aW9uIGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi9zZWxlY3Rpb24nO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3VuaXQnO1xuaW1wb3J0IHtwYXJzZU1vZGVsfSBmcm9tICcuLi8uLi91dGlsJztcblxuZGVzY3JpYmUoJ0ZhY2V0ZWQgU2VsZWN0aW9ucycsIGZ1bmN0aW9uKCkge1xuICBjb25zdCBtb2RlbCA9IHBhcnNlTW9kZWwoe1xuICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2Fuc2NvbWJlLmpzb25cIn0sXG4gICAgXCJmYWNldFwiOiB7XG4gICAgICBcImNvbHVtblwiOiB7XCJmaWVsZFwiOiBcIlNlcmllc1wiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgXCJyb3dcIjoge1wiZmllbGRcIjogXCJYXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIiwgXCJiaW5cIjogdHJ1ZX0sXG4gICAgfSxcbiAgICBcInNwZWNcIjoge1xuICAgICAgXCJsYXllclwiOiBbe1xuICAgICAgICBcIm1hcmtcIjogXCJydWxlXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1wieVwiOiB7XCJ2YWx1ZVwiOiAxMH19XG4gICAgICB9LCB7XG4gICAgICAgIFwic2VsZWN0aW9uXCI6IHtcbiAgICAgICAgICBcIm9uZVwiOiB7XCJ0eXBlXCI6IFwic2luZ2xlXCJ9LFxuICAgICAgICAgIFwidHdwXCI6IHtcInR5cGVcIjogXCJtdWx0aVwifSxcbiAgICAgICAgICBcInRocmVlXCI6IHtcInR5cGVcIjogXCJpbnRlcnZhbFwifVxuICAgICAgICB9LFxuICAgICAgICBcIm1hcmtcIjogXCJydWxlXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJ2YWx1ZVwiOiAxMH1cbiAgICAgICAgfVxuICAgICAgfV1cbiAgICB9XG4gIH0pO1xuXG4gIG1vZGVsLnBhcnNlKCk7XG4gIGNvbnN0IHVuaXQgPSBtb2RlbC5jaGlsZHJlblswXS5jaGlsZHJlblsxXSBhcyBVbml0TW9kZWw7XG5cbiAgaXQoJ3Nob3VsZCBhc3NlbWJsZSBhIGZhY2V0IHNpZ25hbCcsIGZ1bmN0aW9uKCkge1xuICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2VsZWN0aW9uLmFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHModW5pdCwgW10pLCBbXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcImZhY2V0XCIsXG4gICAgICAgIFwidmFsdWVcIjoge30sXG4gICAgICAgIFwib25cIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiZXZlbnRzXCI6IFt7XCJzb3VyY2VcIjogXCJzY29wZVwiLFwidHlwZVwiOiBcIm1vdXNlbW92ZVwifV0sXG4gICAgICAgICAgICBcInVwZGF0ZVwiOiBcImlzVHVwbGUoZmFjZXQpID8gZmFjZXQgOiBncm91cChcXFwiY2VsbFxcXCIpLmRhdHVtXCJcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBuYW1lIHRoZSB1bml0IHdpdGggdGhlIGZhY2V0IGtleXMnLCBmdW5jdGlvbigpIHtcbiAgICBhc3NlcnQuZXF1YWwoc2VsZWN0aW9uLnVuaXROYW1lKHVuaXQpLFxuICAgICAgYFwiY2hpbGRfbGF5ZXJfMVwiICsgJ18nICsgKGZhY2V0W1wiYmluX21heGJpbnNfNl9YXCJdKSArICdfJyArIChmYWNldFtcIlNlcmllc1wiXSlgKTtcbiAgfSk7XG59KTtcbiJdfQ==