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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXRzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2VsZWN0aW9uL2ZhY2V0cy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUM1QixvRUFBc0U7QUFFdEUsbUNBQXNDO0FBRXRDLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRTtJQUM3QixJQUFNLEtBQUssR0FBRyxpQkFBVSxDQUFDO1FBQ3ZCLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxvQkFBb0IsRUFBQztRQUNyQyxPQUFPLEVBQUU7WUFDUCxRQUFRLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7WUFDaEQsS0FBSyxFQUFFLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUM7U0FDdEQ7UUFDRCxNQUFNLEVBQUU7WUFDTixPQUFPLEVBQUUsQ0FBQztvQkFDUixNQUFNLEVBQUUsTUFBTTtvQkFDZCxVQUFVLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsRUFBRSxFQUFDLEVBQUM7aUJBQ2pDLEVBQUU7b0JBQ0QsV0FBVyxFQUFFO3dCQUNYLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUM7d0JBQ3pCLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUM7d0JBQ3hCLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUM7cUJBQzlCO29CQUNELE1BQU0sRUFBRSxNQUFNO29CQUNkLFVBQVUsRUFBRTt3QkFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsRUFBRSxFQUFDO3FCQUNuQjtpQkFDRixDQUFDO1NBQ0g7S0FDRixDQUFDLENBQUM7SUFFSCxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDZCxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQWMsQ0FBQztJQUV4RCxFQUFFLENBQUMsZ0NBQWdDLEVBQUU7UUFDbkMsYUFBTSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDMUU7Z0JBQ0UsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsSUFBSSxFQUFFO29CQUNKO3dCQUNFLFFBQVEsRUFBRSxDQUFDLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBQyxNQUFNLEVBQUUsV0FBVyxFQUFDLENBQUM7d0JBQ25ELFFBQVEsRUFBRSxnREFBZ0Q7cUJBQzNEO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywwQ0FBMEMsRUFBRTtRQUM3QyxhQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQ25DLGdGQUEwRSxDQUFDLENBQUM7SUFDaEYsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlIHF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQgKiBhcyBzZWxlY3Rpb24gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3NlbGVjdGlvbic7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvdW5pdCc7XG5pbXBvcnQge3BhcnNlTW9kZWx9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnRmFjZXRlZCBTZWxlY3Rpb25zJywgZnVuY3Rpb24oKSB7XG4gIGNvbnN0IG1vZGVsID0gcGFyc2VNb2RlbCh7XG4gICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYW5zY29tYmUuanNvblwifSxcbiAgICBcImZhY2V0XCI6IHtcbiAgICAgIFwiY29sdW1uXCI6IHtcImZpZWxkXCI6IFwiU2VyaWVzXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICBcInJvd1wiOiB7XCJmaWVsZFwiOiBcIlhcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwiLCBcImJpblwiOiB0cnVlfSxcbiAgICB9LFxuICAgIFwic3BlY1wiOiB7XG4gICAgICBcImxheWVyXCI6IFt7XG4gICAgICAgIFwibWFya1wiOiBcInJ1bGVcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XCJ5XCI6IHtcInZhbHVlXCI6IDEwfX1cbiAgICAgIH0sIHtcbiAgICAgICAgXCJzZWxlY3Rpb25cIjoge1xuICAgICAgICAgIFwib25lXCI6IHtcInR5cGVcIjogXCJzaW5nbGVcIn0sXG4gICAgICAgICAgXCJ0d3BcIjoge1widHlwZVwiOiBcIm11bHRpXCJ9LFxuICAgICAgICAgIFwidGhyZWVcIjoge1widHlwZVwiOiBcImludGVydmFsXCJ9XG4gICAgICAgIH0sXG4gICAgICAgIFwibWFya1wiOiBcInJ1bGVcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcInZhbHVlXCI6IDEwfVxuICAgICAgICB9XG4gICAgICB9XVxuICAgIH1cbiAgfSk7XG5cbiAgbW9kZWwucGFyc2UoKTtcbiAgY29uc3QgdW5pdCA9IG1vZGVsLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzFdIGFzIFVuaXRNb2RlbDtcblxuICBpdCgnc2hvdWxkIGFzc2VtYmxlIGEgZmFjZXQgc2lnbmFsJywgZnVuY3Rpb24oKSB7XG4gICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzZWxlY3Rpb24uYXNzZW1ibGVVbml0U2VsZWN0aW9uU2lnbmFscyh1bml0LCBbXSksIFtcbiAgICAgIHtcbiAgICAgICAgXCJuYW1lXCI6IFwiZmFjZXRcIixcbiAgICAgICAgXCJ2YWx1ZVwiOiB7fSxcbiAgICAgICAgXCJvblwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJldmVudHNcIjogW3tcInNvdXJjZVwiOiBcInNjb3BlXCIsXCJ0eXBlXCI6IFwibW91c2Vtb3ZlXCJ9XSxcbiAgICAgICAgICAgIFwidXBkYXRlXCI6IFwiaXNUdXBsZShmYWNldCkgPyBmYWNldCA6IGdyb3VwKFxcXCJjZWxsXFxcIikuZGF0dW1cIlxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIG5hbWUgdGhlIHVuaXQgd2l0aCB0aGUgZmFjZXQga2V5cycsIGZ1bmN0aW9uKCkge1xuICAgIGFzc2VydC5lcXVhbChzZWxlY3Rpb24udW5pdE5hbWUodW5pdCksXG4gICAgICBgXCJjaGlsZF9sYXllcl8xXCIgKyAnXycgKyBmYWNldFtcImJpbl9tYXhiaW5zXzZfWFwiXSArICdfJyArIGZhY2V0W1wiU2VyaWVzXCJdYCk7XG4gIH0pO1xufSk7XG4iXX0=