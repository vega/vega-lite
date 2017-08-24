"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var assemble_1 = require("../../../src/compile/scale/assemble");
var util_1 = require("../../util");
describe('Selection + Scales', function () {
    it('assembles domainRaw from selection parameter', function () {
        var model = util_1.parseConcatModel({
            vconcat: [
                {
                    mark: "area",
                    selection: {
                        brush: { type: "interval", encodings: ["x"] },
                        brush2: { type: "multi", fields: ["price"], resolve: "intersect" }
                    },
                    encoding: {
                        x: { field: "date", type: "temporal" },
                        y: { field: "price", type: "quantitative" }
                    }
                },
                {
                    selection: {
                        brush3: { type: "interval" }
                    },
                    mark: "area",
                    encoding: {
                        x: {
                            field: "date", type: "temporal",
                            scale: { domain: { selection: "brush", encoding: "x" } }
                        },
                        y: {
                            field: "price", type: "quantitative",
                            scale: { domain: { selection: "brush2", field: "price" } }
                        },
                        color: {
                            field: "symbol", type: "nominal",
                            scale: { domain: { selection: "brush2" } }
                        },
                        opacity: {
                            field: "symbol", type: "nominal",
                            scale: { domain: { selection: "brush3" } }
                        }
                    }
                }
            ],
            resolve: {
                scale: {
                    color: 'independent',
                    opacity: 'independent'
                }
            }
        });
        model.parseScale();
        model.parseSelection();
        var scales = assemble_1.assembleScalesForModel(model.children[1]);
        var xscale = scales[0];
        var yscale = scales[1];
        var cscale = scales[2];
        var oscale = scales[3];
        chai_1.assert.isObject(xscale.domain);
        chai_1.assert.property(xscale, 'domainRaw');
        chai_1.assert.propertyVal(xscale.domainRaw, 'signal', "vlIntervalDomain(\"brush_store\", \"x\", null)");
        chai_1.assert.isObject(yscale.domain);
        chai_1.assert.property(yscale, 'domainRaw');
        chai_1.assert.deepPropertyVal(yscale.domainRaw, 'signal', "vlMultiDomain(\"brush2_store\", null, \"price\", \"intersect\")");
        chai_1.assert.isObject(cscale.domain);
        chai_1.assert.property(cscale, 'domainRaw');
        chai_1.assert.propertyVal(cscale.domainRaw, 'signal', "vlMultiDomain(\"brush2_store\", null, \"price\", \"intersect\")");
        chai_1.assert.isObject(oscale.domain);
        chai_1.assert.property(oscale, 'domainRaw');
        chai_1.assert.propertyVal(oscale.domainRaw, 'signal', 'null');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGVzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2VsZWN0aW9uL3NjYWxlcy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUM1QixnRUFBMkU7QUFFM0UsbUNBQTRDO0FBRTVDLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRTtJQUM3QixFQUFFLENBQUMsOENBQThDLEVBQUU7UUFDakQsSUFBTSxLQUFLLEdBQUcsdUJBQWdCLENBQUM7WUFDN0IsT0FBTyxFQUFFO2dCQUNQO29CQUNFLElBQUksRUFBRSxNQUFNO29CQUNaLFNBQVMsRUFBRTt3QkFDVCxLQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFDO3dCQUMzQyxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUM7cUJBQ2pFO29CQUNELFFBQVEsRUFBRTt3QkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUM7d0JBQ3BDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztxQkFDMUM7aUJBQ0Y7Z0JBQ0Q7b0JBQ0UsU0FBUyxFQUFFO3dCQUNULE1BQU0sRUFBRSxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUM7cUJBQzNCO29CQUNELElBQUksRUFBRSxNQUFNO29CQUNaLFFBQVEsRUFBRTt3QkFDUixDQUFDLEVBQUU7NEJBQ0QsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsVUFBVTs0QkFDL0IsS0FBSyxFQUFFLEVBQUMsTUFBTSxFQUFFLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsR0FBRyxF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