"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var layer_1 = require("../../src/compile/layer");
var util_1 = require("../util");
describe('Layer', function () {
    it('should say it is layer', function () {
        var model = new layer_1.LayerModel({ layer: [] }, null, null);
        chai_1.assert(!model.isUnit());
        chai_1.assert(!model.isFacet());
        chai_1.assert(model.isLayer());
    });
    describe('merge scale domains', function () {
        it('should merge domains', function () {
            var model = util_1.parseLayerModel({
                layer: [{
                        mark: 'point',
                        encoding: {
                            x: { field: 'a', type: 'ordinal' }
                        }
                    }, {
                        mark: 'point',
                        encoding: {
                            x: { field: 'b', type: 'ordinal' }
                        }
                    }]
            });
            chai_1.assert.equal(model.children.length, 2);
            model.parseScale();
            chai_1.assert.deepEqual(model.component.scales['x'].domain, {
                fields: [{
                        data: 'layer_0_source',
                        field: 'a'
                    }, {
                        data: 'layer_1_source',
                        field: 'b'
                    }],
                sort: true
            });
        });
        it('should union explicit and referenced domains', function () {
            var model = util_1.parseLayerModel({
                layer: [{
                        mark: 'point',
                        encoding: {
                            x: { scale: { domain: [1, 2, 3] }, field: 'b', type: 'ordinal' }
                        }
                    }, {
                        mark: 'point',
                        encoding: {
                            x: { field: 'b', type: 'ordinal' }
                        }
                    }]
            });
            model.parseScale();
            chai_1.assert.deepEqual(model.component.scales['x'].domain, {
                fields: [
                    [1, 2, 3],
                    {
                        data: 'layer_1_source',
                        field: 'b'
                    }
                ],
                sort: true
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3QvY29tcGlsZS9sYXllci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBRTVCLGlEQUFtRDtBQUVuRCxnQ0FBd0M7QUFFeEMsUUFBUSxDQUFDLE9BQU8sRUFBRTtJQUNoQixFQUFFLENBQUMsd0JBQXdCLEVBQUU7UUFDM0IsSUFBTSxLQUFLLEdBQUcsSUFBSSxrQkFBVSxDQUFDLEVBQUMsS0FBSyxFQUFFLEVBQUUsRUFBYyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNuRSxhQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUN4QixhQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUN6QixhQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDMUIsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMscUJBQXFCLEVBQUU7UUFDOUIsRUFBRSxDQUFDLHNCQUFzQixFQUFFO1lBQ3pCLElBQU0sS0FBSyxHQUFHLHNCQUFlLENBQUM7Z0JBQzVCLEtBQUssRUFBRSxDQUFDO3dCQUNOLElBQUksRUFBRSxPQUFPO3dCQUNiLFFBQVEsRUFBRTs0QkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7eUJBQ2pDO3FCQUNGLEVBQUM7d0JBQ0EsSUFBSSxFQUFFLE9BQU87d0JBQ2IsUUFBUSxFQUFFOzRCQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQzt5QkFDakM7cUJBQ0YsQ0FBQzthQUNILENBQUMsQ0FBQztZQUNILGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdkMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBRW5CLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFO2dCQUNuRCxNQUFNLEVBQUUsQ0FBQzt3QkFDUCxJQUFJLEVBQUUsZ0JBQWdCO3dCQUN0QixLQUFLLEVBQUUsR0FBRztxQkFDWCxFQUFDO3dCQUNBLElBQUksRUFBRSxnQkFBZ0I7d0JBQ3RCLEtBQUssRUFBRSxHQUFHO3FCQUNYLENBQUM7Z0JBQ0YsSUFBSSxFQUFFLElBQUk7YUFDWCxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRTtZQUNqRCxJQUFNLEtBQUssR0FBRyxzQkFBZSxDQUFDO2dCQUM1QixLQUFLLEVBQUUsQ0FBQzt3QkFDTixJQUFJLEVBQUUsT0FBTzt3QkFDYixRQUFRLEVBQUU7NEJBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEVBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQzt5QkFDN0Q7cUJBQ0YsRUFBQzt3QkFDQSxJQUFJLEVBQUUsT0FBTzt3QkFDYixRQUFRLEVBQUU7NEJBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDO3lCQUNqQztxQkFDRixDQUFDO2FBQ0gsQ0FBQyxDQUFDO1lBQ0gsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBRW5CLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFO2dCQUNuRCxNQUFNLEVBQUU7b0JBQ04sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDVDt3QkFDRSxJQUFJLEVBQUUsZ0JBQWdCO3dCQUN0QixLQUFLLEVBQUUsR0FBRztxQkFDWDtpQkFDRjtnQkFDRCxJQUFJLEVBQUUsSUFBSTthQUNYLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9