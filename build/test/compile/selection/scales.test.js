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
    it('should bind both scales in diagonal repeated views', function () {
        var model = util_1.parseRepeatModel({
            repeat: {
                row: ["Horsepower", "Acceleration"],
                column: ["Miles_per_Gallon", "Acceleration"]
            },
            spec: {
                data: { url: "data/cars.json" },
                mark: "point",
                selection: {
                    grid: {
                        type: "interval",
                        resolve: "global",
                        bind: "scales"
                    }
                },
                encoding: {
                    x: { field: { repeat: "column" }, type: "quantitative" },
                    y: { field: { repeat: "row" }, type: "quantitative" },
                    color: { field: "Origin", type: "nominal" }
                }
            }
        });
        model.parseScale();
        model.parseSelection();
        var scales = assemble_1.assembleScalesForModel(model.children[3]);
        chai_1.assert.isTrue(scales.length === 2);
        chai_1.assert.property(scales[0], 'domainRaw');
        chai_1.assert.property(scales[1], 'domainRaw');
        chai_1.assert.propertyVal(scales[0].domainRaw, 'signal', 'grid_Acceleration');
        chai_1.assert.propertyVal(scales[1].domainRaw, 'signal', 'grid_Acceleration');
    });
    it('should merge domainRaw for layered views', function () {
        var model = util_1.parseConcatModel({
            data: { url: "data/sp500.csv" },
            vconcat: [
                {
                    layer: [
                        {
                            mark: "point",
                            encoding: {
                                x: {
                                    field: "date", type: "temporal",
                                    scale: { domain: { selection: "brush" } }
                                },
                                y: { field: "price", type: "quantitative" }
                            }
                        }
                    ]
                },
                {
                    mark: "area",
                    selection: {
                        brush: { type: "interval", encodings: ["x"] }
                    },
                    encoding: {
                        x: { field: "date", type: "temporal" },
                        y: { field: "price", type: "quantitative" }
                    }
                }
            ]
        });
        model.parseScale();
        model.parseSelection();
        var scales = assemble_1.assembleScalesForModel(model.children[0]);
        chai_1.assert.property(scales[0], 'domainRaw');
        chai_1.assert.propertyVal(scales[0].domainRaw, 'signal', 'vlIntervalDomain("brush_store", null, "date")');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGVzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2VsZWN0aW9uL3NjYWxlcy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUM1QixnRUFBMkU7QUFFM0UsbUNBQThEO0FBRTlELFFBQVEsQ0FBQyxvQkFBb0IsRUFBRTtJQUM3QixFQUFFLENBQUMsOENBQThDLEVBQUU7UUFDakQsSUFBTSxLQUFLLEdBQUcsdUJBQWdCLENBQUM7WUFDN0IsT0FBTyxFQUFFO2dCQUNQO29CQUNFLElBQUksRUFBRSxNQUFNO29CQUNaLFNBQVMsRUFBRTt3QkFDVCxLQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFDO3dCQUMzQyxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUM7cUJBQ2pFO29CQUNELFFBQVEsRUFBRTt3QkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUM7d0JBQ3BDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztxQkFDMUM7aUJBQ0Y7Z0JBQ0Q7b0JBQ0UsU0FBUyxFQUFFO3dCQUNULE1BQU0sRUFBRSxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUM7cUJBQzNCO29CQUNELElBQUksRUFBRSxNQUFNO29CQUNaLFFBQVEsRUFBRTt3QkFDUixDQUFDLEVBQUU7NEJBQ0QsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsVUFBVTs0QkFDL0IsS0FBSyxFQUFFLEVBQUMsTUFBTSxFQUFFLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFDLEVBQUM7eUJBQ3JEO3dCQUNELENBQUMsRUFBRTs0QkFDRCxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxjQUFjOzRCQUNwQyxLQUFLLEVBQUUsRUFBQyxNQUFNLEVBQUUsRUFBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUMsRUFBQzt5QkFDdkQ7d0JBQ0QsS0FBSyxFQUFFOzRCQUNMLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVM7NEJBQ2hDLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxFQUFDLFNBQVMsRUFBRSxRQUFRLEVBQVcsRUFBQzt5QkFDakQ7d0JBQ0QsT0FBTyxFQUFFOzRCQUNQLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVM7NEJBQ2hDLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxFQUFDLFNBQVMsRUFBRSxRQUFRLEVBQVcsRUFBQzt5QkFDakQ7cUJBQ0Y7aUJBQ0Y7YUFDRjtZQUNELE9BQU8sRUFBRTtnQkFDUCxLQUFLLEVBQUU7b0JBQ0wsS0FBSyxFQUFFLGFBQWE7b0JBQ3BCLE9BQU8sRUFBRSxhQUFhO2lCQUN2QjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ25CLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUV2QixJQUFNLE1BQU0sR0FBRyxpQ0FBc0IsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekQsSUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXpCLGFBQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9CLGFBQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3JDLGFBQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQzNDLGdEQUFnRCxDQUFDLENBQUM7UUFFcEQsYUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0IsYUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDckMsYUFBTSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFDL0MsaUVBQWlFLENBQUMsQ0FBQztRQUVyRSxhQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvQixhQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNyQyxhQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUMzQyxpRUFBaUUsQ0FBQyxDQUFDO1FBRXJFLGFBQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9CLGFBQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3JDLGFBQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDekQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsb0RBQW9ELEVBQUU7UUFDdkQsSUFBTSxLQUFLLEdBQUcsdUJBQWdCLENBQUM7WUFDN0IsTUFBTSxFQUFFO2dCQUNOLEdBQUcsRUFBRSxDQUFDLFlBQVksRUFBRSxjQUFjLENBQUM7Z0JBQ25DLE1BQU0sRUFBRSxDQUFDLGtCQUFrQixFQUFFLGNBQWMsQ0FBQzthQUM3QztZQUNELElBQUksRUFBRTtnQkFDSixJQUFJLEVBQUUsRUFBQyxHQUFHLEVBQUUsZ0JBQWdCLEVBQUM7Z0JBQzdCLElBQUksRUFBRSxPQUFPO2dCQUNiLFNBQVMsRUFBRTtvQkFDVCxJQUFJLEVBQUU7d0JBQ0osSUFBSSxFQUFFLFVBQVU7d0JBQ2hCLE9BQU8sRUFBRSxRQUFRO3dCQUNqQixJQUFJLEVBQUUsUUFBUTtxQkFDZjtpQkFDRjtnQkFDRCxRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBQyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7b0JBQ3BELENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO29CQUNqRCxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7aUJBQzFDO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbkIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRXZCLElBQU0sTUFBTSxHQUFHLGlDQUFzQixDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6RCxhQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDbkMsYUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDeEMsYUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDeEMsYUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3ZFLGFBQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUN6RSxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywwQ0FBMEMsRUFBRTtRQUM3QyxJQUFNLEtBQUssR0FBRyx1QkFBZ0IsQ0FBQztZQUM3QixJQUFJLEVBQUUsRUFBQyxHQUFHLEVBQUUsZ0JBQWdCLEVBQUM7WUFDN0IsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEtBQUssRUFBRTt3QkFDTDs0QkFDRSxJQUFJLEVBQUUsT0FBTzs0QkFDYixRQUFRLEVBQUU7Z0NBQ1IsQ0FBQyxFQUFFO29DQUNELEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVU7b0NBQy9CLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUMsRUFBQztpQ0FDdEM7Z0NBQ0QsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDOzZCQUMxQzt5QkFDRjtxQkFDRjtpQkFDRjtnQkFDRDtvQkFDRSxJQUFJLEVBQUUsTUFBTTtvQkFDWixTQUFTLEVBQUU7d0JBQ1QsS0FBSyxFQUFFLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBQztxQkFDNUM7b0JBQ0QsUUFBUSxFQUFFO3dCQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBQzt3QkFDcEMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO3FCQUMxQztpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ25CLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN2QixJQUFNLE1BQU0sR0FBRyxpQ0FBc0IsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekQsYUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDeEMsYUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSwrQ0FBK0MsQ0FBQyxDQUFDO0lBQ3JHLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHthc3NlbWJsZVNjYWxlc0Zvck1vZGVsfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9hc3NlbWJsZSc7XG5pbXBvcnQge0RvbWFpbn0gZnJvbSAnLi4vLi4vLi4vc3JjL3NjYWxlJztcbmltcG9ydCB7cGFyc2VDb25jYXRNb2RlbCwgcGFyc2VSZXBlYXRNb2RlbH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdTZWxlY3Rpb24gKyBTY2FsZXMnLCBmdW5jdGlvbigpIHtcbiAgaXQoJ2Fzc2VtYmxlcyBkb21haW5SYXcgZnJvbSBzZWxlY3Rpb24gcGFyYW1ldGVyJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZUNvbmNhdE1vZGVsKHtcbiAgICAgIHZjb25jYXQ6IFtcbiAgICAgICAge1xuICAgICAgICAgIG1hcms6IFwiYXJlYVwiLFxuICAgICAgICAgIHNlbGVjdGlvbjoge1xuICAgICAgICAgICAgYnJ1c2g6IHt0eXBlOiBcImludGVydmFsXCIsIGVuY29kaW5nczogW1wieFwiXX0sXG4gICAgICAgICAgICBicnVzaDI6IHt0eXBlOiBcIm11bHRpXCIsIGZpZWxkczogW1wicHJpY2VcIl0sIHJlc29sdmU6IFwiaW50ZXJzZWN0XCJ9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiBcImRhdGVcIiwgdHlwZTogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgIHk6IHtmaWVsZDogXCJwcmljZVwiLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHNlbGVjdGlvbjoge1xuICAgICAgICAgICAgYnJ1c2gzOiB7dHlwZTogXCJpbnRlcnZhbFwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgbWFyazogXCJhcmVhXCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgICAgZmllbGQ6IFwiZGF0ZVwiLCB0eXBlOiBcInRlbXBvcmFsXCIsXG4gICAgICAgICAgICAgIHNjYWxlOiB7ZG9tYWluOiB7c2VsZWN0aW9uOiBcImJydXNoXCIsIGVuY29kaW5nOiBcInhcIn19XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeToge1xuICAgICAgICAgICAgICBmaWVsZDogXCJwcmljZVwiLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICBzY2FsZToge2RvbWFpbjoge3NlbGVjdGlvbjogXCJicnVzaDJcIiwgZmllbGQ6IFwicHJpY2VcIn19XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICAgICAgZmllbGQ6IFwic3ltYm9sXCIsIHR5cGU6IFwibm9taW5hbFwiLFxuICAgICAgICAgICAgICBzY2FsZToge2RvbWFpbjoge3NlbGVjdGlvbjogXCJicnVzaDJcIn0gYXMgRG9tYWlufVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9wYWNpdHk6IHtcbiAgICAgICAgICAgICAgZmllbGQ6IFwic3ltYm9sXCIsIHR5cGU6IFwibm9taW5hbFwiLFxuICAgICAgICAgICAgICBzY2FsZToge2RvbWFpbjoge3NlbGVjdGlvbjogXCJicnVzaDNcIn0gYXMgRG9tYWlufVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgc2NhbGU6IHtcbiAgICAgICAgICBjb2xvcjogJ2luZGVwZW5kZW50JyxcbiAgICAgICAgICBvcGFjaXR5OiAnaW5kZXBlbmRlbnQnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIG1vZGVsLnBhcnNlU2NhbGUoKTtcbiAgICBtb2RlbC5wYXJzZVNlbGVjdGlvbigpO1xuXG4gICAgY29uc3Qgc2NhbGVzID0gYXNzZW1ibGVTY2FsZXNGb3JNb2RlbChtb2RlbC5jaGlsZHJlblsxXSk7XG4gICAgY29uc3QgeHNjYWxlID0gc2NhbGVzWzBdO1xuICAgIGNvbnN0IHlzY2FsZSA9IHNjYWxlc1sxXTtcbiAgICBjb25zdCBjc2NhbGUgPSBzY2FsZXNbMl07XG4gICAgY29uc3Qgb3NjYWxlID0gc2NhbGVzWzNdO1xuXG4gICAgYXNzZXJ0LmlzT2JqZWN0KHhzY2FsZS5kb21haW4pO1xuICAgIGFzc2VydC5wcm9wZXJ0eSh4c2NhbGUsICdkb21haW5SYXcnKTtcbiAgICBhc3NlcnQucHJvcGVydHlWYWwoeHNjYWxlLmRvbWFpblJhdywgJ3NpZ25hbCcsXG4gICAgICBcInZsSW50ZXJ2YWxEb21haW4oXFxcImJydXNoX3N0b3JlXFxcIiwgXFxcInhcXFwiLCBudWxsKVwiKTtcblxuICAgIGFzc2VydC5pc09iamVjdCh5c2NhbGUuZG9tYWluKTtcbiAgICBhc3NlcnQucHJvcGVydHkoeXNjYWxlLCAnZG9tYWluUmF3Jyk7XG4gICAgYXNzZXJ0LmRlZXBQcm9wZXJ0eVZhbCh5c2NhbGUuZG9tYWluUmF3LCAnc2lnbmFsJyxcbiAgICAgIFwidmxNdWx0aURvbWFpbihcXFwiYnJ1c2gyX3N0b3JlXFxcIiwgbnVsbCwgXFxcInByaWNlXFxcIiwgXFxcImludGVyc2VjdFxcXCIpXCIpO1xuXG4gICAgYXNzZXJ0LmlzT2JqZWN0KGNzY2FsZS5kb21haW4pO1xuICAgIGFzc2VydC5wcm9wZXJ0eShjc2NhbGUsICdkb21haW5SYXcnKTtcbiAgICBhc3NlcnQucHJvcGVydHlWYWwoY3NjYWxlLmRvbWFpblJhdywgJ3NpZ25hbCcsXG4gICAgICBcInZsTXVsdGlEb21haW4oXFxcImJydXNoMl9zdG9yZVxcXCIsIG51bGwsIFxcXCJwcmljZVxcXCIsIFxcXCJpbnRlcnNlY3RcXFwiKVwiKTtcblxuICAgIGFzc2VydC5pc09iamVjdChvc2NhbGUuZG9tYWluKTtcbiAgICBhc3NlcnQucHJvcGVydHkob3NjYWxlLCAnZG9tYWluUmF3Jyk7XG4gICAgYXNzZXJ0LnByb3BlcnR5VmFsKG9zY2FsZS5kb21haW5SYXcsICdzaWduYWwnLCAnbnVsbCcpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGJpbmQgYm90aCBzY2FsZXMgaW4gZGlhZ29uYWwgcmVwZWF0ZWQgdmlld3MnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlUmVwZWF0TW9kZWwoe1xuICAgICAgcmVwZWF0OiB7XG4gICAgICAgIHJvdzogW1wiSG9yc2Vwb3dlclwiLCBcIkFjY2VsZXJhdGlvblwiXSxcbiAgICAgICAgY29sdW1uOiBbXCJNaWxlc19wZXJfR2FsbG9uXCIsIFwiQWNjZWxlcmF0aW9uXCJdXG4gICAgICB9LFxuICAgICAgc3BlYzoge1xuICAgICAgICBkYXRhOiB7dXJsOiBcImRhdGEvY2Fycy5qc29uXCJ9LFxuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIHNlbGVjdGlvbjoge1xuICAgICAgICAgIGdyaWQ6IHtcbiAgICAgICAgICAgIHR5cGU6IFwiaW50ZXJ2YWxcIixcbiAgICAgICAgICAgIHJlc29sdmU6IFwiZ2xvYmFsXCIsXG4gICAgICAgICAgICBiaW5kOiBcInNjYWxlc1wiXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDoge3JlcGVhdDogXCJjb2x1bW5cIn0sIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIHk6IHtmaWVsZDoge3JlcGVhdDogXCJyb3dcIn0sIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIGNvbG9yOiB7ZmllbGQ6IFwiT3JpZ2luXCIsIHR5cGU6IFwibm9taW5hbFwifVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBtb2RlbC5wYXJzZVNjYWxlKCk7XG4gICAgbW9kZWwucGFyc2VTZWxlY3Rpb24oKTtcblxuICAgIGNvbnN0IHNjYWxlcyA9IGFzc2VtYmxlU2NhbGVzRm9yTW9kZWwobW9kZWwuY2hpbGRyZW5bM10pO1xuICAgIGFzc2VydC5pc1RydWUoc2NhbGVzLmxlbmd0aCA9PT0gMik7XG4gICAgYXNzZXJ0LnByb3BlcnR5KHNjYWxlc1swXSwgJ2RvbWFpblJhdycpO1xuICAgIGFzc2VydC5wcm9wZXJ0eShzY2FsZXNbMV0sICdkb21haW5SYXcnKTtcbiAgICBhc3NlcnQucHJvcGVydHlWYWwoc2NhbGVzWzBdLmRvbWFpblJhdywgJ3NpZ25hbCcsICdncmlkX0FjY2VsZXJhdGlvbicpO1xuICAgIGFzc2VydC5wcm9wZXJ0eVZhbChzY2FsZXNbMV0uZG9tYWluUmF3LCAnc2lnbmFsJywgJ2dyaWRfQWNjZWxlcmF0aW9uJyk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgbWVyZ2UgZG9tYWluUmF3IGZvciBsYXllcmVkIHZpZXdzJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZUNvbmNhdE1vZGVsKHtcbiAgICAgIGRhdGE6IHt1cmw6IFwiZGF0YS9zcDUwMC5jc3ZcIn0sXG4gICAgICB2Y29uY2F0OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBsYXllcjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICAgICAgeDoge1xuICAgICAgICAgICAgICAgICAgZmllbGQ6IFwiZGF0ZVwiLCB0eXBlOiBcInRlbXBvcmFsXCIsXG4gICAgICAgICAgICAgICAgICBzY2FsZToge2RvbWFpbjoge3NlbGVjdGlvbjogXCJicnVzaFwifX1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHk6IHtmaWVsZDogXCJwcmljZVwiLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbWFyazogXCJhcmVhXCIsXG4gICAgICAgICAgc2VsZWN0aW9uOiB7XG4gICAgICAgICAgICBicnVzaDoge3R5cGU6IFwiaW50ZXJ2YWxcIiwgZW5jb2RpbmdzOiBbXCJ4XCJdfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogXCJkYXRlXCIsIHR5cGU6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgICB5OiB7ZmllbGQ6IFwicHJpY2VcIiwgdHlwZTogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9KTtcblxuICAgIG1vZGVsLnBhcnNlU2NhbGUoKTtcbiAgICBtb2RlbC5wYXJzZVNlbGVjdGlvbigpO1xuICAgIGNvbnN0IHNjYWxlcyA9IGFzc2VtYmxlU2NhbGVzRm9yTW9kZWwobW9kZWwuY2hpbGRyZW5bMF0pO1xuICAgIGFzc2VydC5wcm9wZXJ0eShzY2FsZXNbMF0sICdkb21haW5SYXcnKTtcbiAgICBhc3NlcnQucHJvcGVydHlWYWwoc2NhbGVzWzBdLmRvbWFpblJhdywgJ3NpZ25hbCcsICd2bEludGVydmFsRG9tYWluKFwiYnJ1c2hfc3RvcmVcIiwgbnVsbCwgXCJkYXRlXCIpJyk7XG4gIH0pO1xufSk7XG4iXX0=