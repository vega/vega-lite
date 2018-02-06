"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
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
                "x": {
                    "field": "longitude",
                    "type": "longitude"
                },
                "y": {
                    "field": "latitude",
                    "type": "latitude"
                }
            }
        });
        var nodes = geojson_1.GeoJSONNode.makeAll(model);
        chai_1.assert.isNotEmpty(nodes);
        nodes.forEach(function (node) {
            chai_1.assert.isNotNull(node);
            var transform = node.assemble();
            chai_1.assert.equal(transform.type, 'geojson');
            chai_1.assert.isTrue(util_1.every(['longitude', 'latitude'], function (field) { return util_1.contains(transform.fields, field); }));
            chai_1.assert.isUndefined(transform.geojson);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VvanNvbi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL2RhdGEvZ2VvanNvbi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLDZEQUE4RDtBQUM5RCwwQ0FBa0Q7QUFDbEQsbUNBQWdFO0FBQ2hFLDhCQUE4QjtBQUU5QixRQUFRLENBQUMsc0JBQXNCLEVBQUU7SUFDL0IsRUFBRSxDQUFDLDhDQUE4QyxFQUFFO1FBQ2pELElBQU0sS0FBSyxHQUFHLDJDQUFvQyxDQUFDO1lBQ2pELE1BQU0sRUFBRTtnQkFDTixLQUFLLEVBQUUsbUJBQW1CO2dCQUMxQixRQUFRLEVBQUU7b0JBQ1IsTUFBTSxFQUFFLEtBQUs7aUJBQ2Q7YUFDRjtZQUNELE1BQU0sRUFBRSxRQUFRO1lBQ2hCLFVBQVUsRUFBRTtnQkFDVixHQUFHLEVBQUU7b0JBQ0gsT0FBTyxFQUFFLFdBQVc7b0JBQ3BCLE1BQU0sRUFBRSxXQUFXO2lCQUNwQjtnQkFDRCxHQUFHLEVBQUU7b0JBQ0gsT0FBTyxFQUFFLFVBQVU7b0JBQ25CLE1BQU0sRUFBRSxVQUFVO2lCQUNuQjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsSUFBTSxLQUFLLEdBQWtCLHFCQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hELGFBQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUk7WUFDakIsYUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN2QixJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbEMsYUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3hDLGFBQU0sQ0FBQyxNQUFNLENBQUMsWUFBSyxDQUFDLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxFQUFFLFVBQUMsS0FBSyxJQUFLLE9BQUEsZUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQWpDLENBQWlDLENBQUMsQ0FBQyxDQUFDO1lBQzlGLGFBQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7R2VvSlNPTk5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvZ2VvanNvbic7XG5pbXBvcnQge2NvbnRhaW5zLCBldmVyeX0gZnJvbSAnLi4vLi4vLi4vc3JjL3V0aWwnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemV9IGZyb20gJy4uLy4uL3V0aWwnO1xuLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmRlc2NyaWJlKCdjb21waWxlL2RhdGEvZ2VvanNvbicsICgpID0+IHtcbiAgaXQoJ3Nob3VsZCBtYWtlIHRyYW5zZm9ybSBhbmQgYXNzZW1ibGUgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgIFwidXJsXCI6IFwiZGF0YS96aXBjb2Rlcy5jc3ZcIixcbiAgICAgICAgXCJmb3JtYXRcIjoge1xuICAgICAgICAgIFwidHlwZVwiOiBcImNzdlwiXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcIm1hcmtcIjogXCJjaXJjbGVcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInhcIjoge1xuICAgICAgICAgIFwiZmllbGRcIjogXCJsb25naXR1ZGVcIixcbiAgICAgICAgICBcInR5cGVcIjogXCJsb25naXR1ZGVcIlxuICAgICAgICB9LFxuICAgICAgICBcInlcIjoge1xuICAgICAgICAgIFwiZmllbGRcIjogXCJsYXRpdHVkZVwiLFxuICAgICAgICAgIFwidHlwZVwiOiBcImxhdGl0dWRlXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IG5vZGVzOiBHZW9KU09OTm9kZVtdID0gR2VvSlNPTk5vZGUubWFrZUFsbChtb2RlbCk7XG4gICAgYXNzZXJ0LmlzTm90RW1wdHkobm9kZXMpO1xuICAgIG5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgIGFzc2VydC5pc05vdE51bGwobm9kZSk7XG4gICAgICBjb25zdCB0cmFuc2Zvcm0gPSBub2RlLmFzc2VtYmxlKCk7XG4gICAgICBhc3NlcnQuZXF1YWwodHJhbnNmb3JtLnR5cGUsICdnZW9qc29uJyk7XG4gICAgICBhc3NlcnQuaXNUcnVlKGV2ZXJ5KFsnbG9uZ2l0dWRlJywgJ2xhdGl0dWRlJ10sIChmaWVsZCkgPT4gY29udGFpbnModHJhbnNmb3JtLmZpZWxkcywgZmllbGQpKSk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQodHJhbnNmb3JtLmdlb2pzb24pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19