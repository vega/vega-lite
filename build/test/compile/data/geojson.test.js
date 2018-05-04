"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var dataflow_1 = require("../../../src/compile/data/dataflow");
var geojson_1 = require("../../../src/compile/data/geojson");
var util_1 = require("../../../src/util");
var util_2 = require("../../util");
/* tslint:disable:quotemark */
describe('compile/data/geojson', function () {
    it('should make transform and assemble correctly', function () {
        var model = util_2.parseUnitModelWithScaleAndLayoutSize({
            "data": {
                "url": "data/zipcodes.csv",
                "format": {
                    "type": "csv"
                }
            },
            "mark": "circle",
            "encoding": {
                "longitude": {
                    "field": "longitude",
                    "type": "quantitative"
                },
                "latitude": {
                    "field": "latitude",
                    "type": "quantitative"
                }
            }
        });
        var root = new dataflow_1.DataFlowNode(null);
        geojson_1.GeoJSONNode.parseAll(root, model);
        var node = root.children[0];
        var _loop_1 = function () {
            chai_1.assert.instanceOf(node, geojson_1.GeoJSONNode);
            var transform = node.assemble();
            chai_1.assert.equal(transform.type, 'geojson');
            chai_1.assert.isTrue(util_1.every(['longitude', 'latitude'], function (field) { return util_1.contains(transform.fields, field); }));
            chai_1.assert.isUndefined(transform.geojson);
            chai_1.assert.isAtMost(node.children.length, 1);
            node = node.children[0];
        };
        while (node != null) {
            _loop_1();
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VvanNvbi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL2RhdGEvZ2VvanNvbi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLCtEQUFnRTtBQUNoRSw2REFBOEQ7QUFDOUQsMENBQWtEO0FBQ2xELG1DQUFnRTtBQUNoRSw4QkFBOEI7QUFFOUIsUUFBUSxDQUFDLHNCQUFzQixFQUFFO0lBQy9CLEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRTtRQUNqRCxJQUFNLEtBQUssR0FBRywyQ0FBb0MsQ0FBQztZQUNqRCxNQUFNLEVBQUU7Z0JBQ04sS0FBSyxFQUFFLG1CQUFtQjtnQkFDMUIsUUFBUSxFQUFFO29CQUNSLE1BQU0sRUFBRSxLQUFLO2lCQUNkO2FBQ0Y7WUFDRCxNQUFNLEVBQUUsUUFBUTtZQUNoQixVQUFVLEVBQUU7Z0JBQ1YsV0FBVyxFQUFFO29CQUNYLE9BQU8sRUFBRSxXQUFXO29CQUNwQixNQUFNLEVBQUUsY0FBYztpQkFDdkI7Z0JBQ0QsVUFBVSxFQUFFO29CQUNWLE9BQU8sRUFBRSxVQUFVO29CQUNuQixNQUFNLEVBQUUsY0FBYztpQkFDdkI7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILElBQU0sSUFBSSxHQUFHLElBQUksdUJBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQyxxQkFBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFbEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7WUFHMUIsYUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUscUJBQVcsQ0FBQyxDQUFDO1lBQ3JDLElBQU0sU0FBUyxHQUFpQixJQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDakQsYUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3hDLGFBQU0sQ0FBQyxNQUFNLENBQUMsWUFBSyxDQUFDLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxFQUFFLFVBQUMsS0FBSyxJQUFLLE9BQUEsZUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQWpDLENBQWlDLENBQUMsQ0FBQyxDQUFDO1lBQzlGLGFBQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRXRDLGFBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDekMsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsQ0FBQztRQVRELE9BQU8sSUFBSSxJQUFJLElBQUk7O1NBU2xCO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7RGF0YUZsb3dOb2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2RhdGFmbG93JztcbmltcG9ydCB7R2VvSlNPTk5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvZ2VvanNvbic7XG5pbXBvcnQge2NvbnRhaW5zLCBldmVyeX0gZnJvbSAnLi4vLi4vLi4vc3JjL3V0aWwnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemV9IGZyb20gJy4uLy4uL3V0aWwnO1xuLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmRlc2NyaWJlKCdjb21waWxlL2RhdGEvZ2VvanNvbicsICgpID0+IHtcbiAgaXQoJ3Nob3VsZCBtYWtlIHRyYW5zZm9ybSBhbmQgYXNzZW1ibGUgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgIFwidXJsXCI6IFwiZGF0YS96aXBjb2Rlcy5jc3ZcIixcbiAgICAgICAgXCJmb3JtYXRcIjoge1xuICAgICAgICAgIFwidHlwZVwiOiBcImNzdlwiXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcIm1hcmtcIjogXCJjaXJjbGVcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcImxvbmdpdHVkZVwiOiB7XG4gICAgICAgICAgXCJmaWVsZFwiOiBcImxvbmdpdHVkZVwiLFxuICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgIH0sXG4gICAgICAgIFwibGF0aXR1ZGVcIjoge1xuICAgICAgICAgIFwiZmllbGRcIjogXCJsYXRpdHVkZVwiLFxuICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHJvb3QgPSBuZXcgRGF0YUZsb3dOb2RlKG51bGwpO1xuICAgIEdlb0pTT05Ob2RlLnBhcnNlQWxsKHJvb3QsIG1vZGVsKTtcblxuICAgIGxldCBub2RlID0gcm9vdC5jaGlsZHJlblswXTtcblxuICAgIHdoaWxlIChub2RlICE9IG51bGwpIHtcbiAgICAgIGFzc2VydC5pbnN0YW5jZU9mKG5vZGUsIEdlb0pTT05Ob2RlKTtcbiAgICAgIGNvbnN0IHRyYW5zZm9ybSA9ICg8R2VvSlNPTk5vZGU+bm9kZSkuYXNzZW1ibGUoKTtcbiAgICAgIGFzc2VydC5lcXVhbCh0cmFuc2Zvcm0udHlwZSwgJ2dlb2pzb24nKTtcbiAgICAgIGFzc2VydC5pc1RydWUoZXZlcnkoWydsb25naXR1ZGUnLCAnbGF0aXR1ZGUnXSwgKGZpZWxkKSA9PiBjb250YWlucyh0cmFuc2Zvcm0uZmllbGRzLCBmaWVsZCkpKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZCh0cmFuc2Zvcm0uZ2VvanNvbik7XG5cbiAgICAgIGFzc2VydC5pc0F0TW9zdChub2RlLmNoaWxkcmVuLmxlbmd0aCwgMSk7XG4gICAgICBub2RlID0gbm9kZS5jaGlsZHJlblswXTtcbiAgICB9XG4gIH0pO1xufSk7XG4iXX0=