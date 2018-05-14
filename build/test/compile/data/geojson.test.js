import { assert } from 'chai';
import { DataFlowNode } from '../../../src/compile/data/dataflow';
import { GeoJSONNode } from '../../../src/compile/data/geojson';
import { contains, every } from '../../../src/util';
import { parseUnitModelWithScaleAndLayoutSize } from '../../util';
/* tslint:disable:quotemark */
describe('compile/data/geojson', function () {
    it('should make transform and assemble correctly', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
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
        var root = new DataFlowNode(null);
        GeoJSONNode.parseAll(root, model);
        var node = root.children[0];
        var _loop_1 = function () {
            assert.instanceOf(node, GeoJSONNode);
            var transform = node.assemble();
            assert.equal(transform.type, 'geojson');
            assert.isTrue(every(['longitude', 'latitude'], function (field) { return contains(transform.fields, field); }));
            assert.isUndefined(transform.geojson);
            assert.isAtMost(node.children.length, 1);
            node = node.children[0];
        };
        while (node != null) {
            _loop_1();
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VvanNvbi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL2RhdGEvZ2VvanNvbi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDNUIsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBQ2hFLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUM5RCxPQUFPLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxvQ0FBb0MsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNoRSw4QkFBOEI7QUFFOUIsUUFBUSxDQUFDLHNCQUFzQixFQUFFO0lBQy9CLEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRTtRQUNqRCxJQUFNLEtBQUssR0FBRyxvQ0FBb0MsQ0FBQztZQUNqRCxNQUFNLEVBQUU7Z0JBQ04sS0FBSyxFQUFFLG1CQUFtQjtnQkFDMUIsUUFBUSxFQUFFO29CQUNSLE1BQU0sRUFBRSxLQUFLO2lCQUNkO2FBQ0Y7WUFDRCxNQUFNLEVBQUUsUUFBUTtZQUNoQixVQUFVLEVBQUU7Z0JBQ1YsV0FBVyxFQUFFO29CQUNYLE9BQU8sRUFBRSxXQUFXO29CQUNwQixNQUFNLEVBQUUsY0FBYztpQkFDdkI7Z0JBQ0QsVUFBVSxFQUFFO29CQUNWLE9BQU8sRUFBRSxVQUFVO29CQUNuQixNQUFNLEVBQUUsY0FBYztpQkFDdkI7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILElBQU0sSUFBSSxHQUFHLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRWxDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7O1lBRzFCLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ3JDLElBQU0sU0FBUyxHQUFpQixJQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDakQsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3hDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxFQUFFLFVBQUMsS0FBSyxJQUFLLE9BQUEsUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQWpDLENBQWlDLENBQUMsQ0FBQyxDQUFDO1lBQzlGLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRXRDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDekMsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsQ0FBQztRQVRELE9BQU8sSUFBSSxJQUFJLElBQUk7O1NBU2xCO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7RGF0YUZsb3dOb2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2RhdGFmbG93JztcbmltcG9ydCB7R2VvSlNPTk5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvZ2VvanNvbic7XG5pbXBvcnQge2NvbnRhaW5zLCBldmVyeX0gZnJvbSAnLi4vLi4vLi4vc3JjL3V0aWwnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemV9IGZyb20gJy4uLy4uL3V0aWwnO1xuLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmRlc2NyaWJlKCdjb21waWxlL2RhdGEvZ2VvanNvbicsICgpID0+IHtcbiAgaXQoJ3Nob3VsZCBtYWtlIHRyYW5zZm9ybSBhbmQgYXNzZW1ibGUgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgIFwidXJsXCI6IFwiZGF0YS96aXBjb2Rlcy5jc3ZcIixcbiAgICAgICAgXCJmb3JtYXRcIjoge1xuICAgICAgICAgIFwidHlwZVwiOiBcImNzdlwiXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcIm1hcmtcIjogXCJjaXJjbGVcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcImxvbmdpdHVkZVwiOiB7XG4gICAgICAgICAgXCJmaWVsZFwiOiBcImxvbmdpdHVkZVwiLFxuICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgIH0sXG4gICAgICAgIFwibGF0aXR1ZGVcIjoge1xuICAgICAgICAgIFwiZmllbGRcIjogXCJsYXRpdHVkZVwiLFxuICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHJvb3QgPSBuZXcgRGF0YUZsb3dOb2RlKG51bGwpO1xuICAgIEdlb0pTT05Ob2RlLnBhcnNlQWxsKHJvb3QsIG1vZGVsKTtcblxuICAgIGxldCBub2RlID0gcm9vdC5jaGlsZHJlblswXTtcblxuICAgIHdoaWxlIChub2RlICE9IG51bGwpIHtcbiAgICAgIGFzc2VydC5pbnN0YW5jZU9mKG5vZGUsIEdlb0pTT05Ob2RlKTtcbiAgICAgIGNvbnN0IHRyYW5zZm9ybSA9ICg8R2VvSlNPTk5vZGU+bm9kZSkuYXNzZW1ibGUoKTtcbiAgICAgIGFzc2VydC5lcXVhbCh0cmFuc2Zvcm0udHlwZSwgJ2dlb2pzb24nKTtcbiAgICAgIGFzc2VydC5pc1RydWUoZXZlcnkoWydsb25naXR1ZGUnLCAnbGF0aXR1ZGUnXSwgKGZpZWxkKSA9PiBjb250YWlucyh0cmFuc2Zvcm0uZmllbGRzLCBmaWVsZCkpKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZCh0cmFuc2Zvcm0uZ2VvanNvbik7XG5cbiAgICAgIGFzc2VydC5pc0F0TW9zdChub2RlLmNoaWxkcmVuLmxlbmd0aCwgMSk7XG4gICAgICBub2RlID0gbm9kZS5jaGlsZHJlblswXTtcbiAgICB9XG4gIH0pO1xufSk7XG4iXX0=