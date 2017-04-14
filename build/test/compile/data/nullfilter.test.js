/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var nullfilter_1 = require("../../../src/compile/data/nullfilter");
var util_1 = require("../../../src/util");
var util_2 = require("../../util");
function parse(model) {
    return nullfilter_1.NullFilterNode.make(model);
}
describe('compile/data/nullfilter', function () {
    describe('compileUnit', function () {
        var spec = {
            mark: "point",
            encoding: {
                y: { field: 'qq', type: "quantitative" },
                x: { field: 'tt', type: "temporal" },
                color: { field: 'oo', type: "ordinal" }
            }
        };
        it('should add filterNull for Q and T by default', function () {
            var model = util_2.parseUnitModel(spec);
            chai_1.assert.deepEqual(parse(model).filteredFields, {
                qq: { field: 'qq', type: "quantitative" },
                tt: { field: 'tt', type: "temporal" },
                oo: null
            });
        });
        it('should add filterNull for O when specified', function () {
            var model = util_2.parseUnitModel(util_1.mergeDeep(spec, {
                config: {
                    filterInvalid: true
                }
            }));
            chai_1.assert.deepEqual(parse(model).filteredFields, {
                qq: { field: 'qq', type: "quantitative" },
                tt: { field: 'tt', type: "temporal" },
                oo: { field: 'oo', type: "ordinal" }
            });
        });
        it('should add no null filter if filterInvalid is false', function () {
            var model = util_2.parseUnitModel(util_1.mergeDeep(spec, {
                config: {
                    filterInvalid: false
                }
            }));
            chai_1.assert.deepEqual(parse(model).filteredFields, {
                qq: null,
                tt: null,
                oo: null
            });
        });
        it('should add no null filter for count field', function () {
            var model = util_2.parseUnitModel({
                mark: "point",
                encoding: {
                    y: { aggregate: 'count', field: '*', type: "quantitative" }
                }
            });
            chai_1.assert.deepEqual(parse(model), null);
        });
    });
    describe('assemble', function () {
        // TODO: write
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVsbGZpbHRlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL2RhdGEvbnVsbGZpbHRlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4Qjs7O0FBRTlCLDZCQUE0QjtBQUk1QixtRUFBb0U7QUFHcEUsMENBQWtEO0FBQ2xELG1DQUEwQztBQUUxQyxlQUFlLEtBQVk7SUFDekIsTUFBTSxDQUFDLDJCQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BDLENBQUM7QUFFRCxRQUFRLENBQUMseUJBQXlCLEVBQUU7SUFDbEMsUUFBUSxDQUFDLGFBQWEsRUFBRTtRQUN0QixJQUFNLElBQUksR0FBYTtZQUNyQixJQUFJLEVBQUUsT0FBTztZQUNiLFFBQVEsRUFBRTtnQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7Z0JBQ3RDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBQztnQkFDbEMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDO2FBQ3RDO1NBQ0YsQ0FBQztRQUVGLEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRTtZQUNqRCxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ25DLGFBQU0sQ0FBQyxTQUFTLENBQWlCLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxjQUFjLEVBQUU7Z0JBQzVELEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztnQkFDdkMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFDO2dCQUNuQyxFQUFFLEVBQUUsSUFBSTthQUNULENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDRDQUE0QyxFQUFFO1lBQy9DLElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUMsZ0JBQVMsQ0FBQyxJQUFJLEVBQUU7Z0JBQzNDLE1BQU0sRUFBRTtvQkFDTixhQUFhLEVBQUUsSUFBSTtpQkFDcEI7YUFDRixDQUFDLENBQUMsQ0FBQztZQUNKLGFBQU0sQ0FBQyxTQUFTLENBQWlCLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxjQUFjLEVBQUU7Z0JBQzVELEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztnQkFDdkMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFDO2dCQUNuQyxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7YUFDbkMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMscURBQXFELEVBQUU7WUFDeEQsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQyxnQkFBUyxDQUFDLElBQUksRUFBRTtnQkFDM0MsTUFBTSxFQUFFO29CQUNOLGFBQWEsRUFBRSxLQUFLO2lCQUNyQjthQUNGLENBQUMsQ0FBQyxDQUFDO1lBQ0osYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsY0FBYyxFQUFFO2dCQUM1QyxFQUFFLEVBQUUsSUFBSTtnQkFDUixFQUFFLEVBQUUsSUFBSTtnQkFDUixFQUFFLEVBQUUsSUFBSTthQUNULENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFFLDJDQUEyQyxFQUFFO1lBQy9DLElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7Z0JBQzNCLElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztpQkFDMUQ7YUFDRixDQUFDLENBQUM7WUFFSCxhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFVBQVUsRUFBRTtRQUNuQixjQUFjO0lBQ2hCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==