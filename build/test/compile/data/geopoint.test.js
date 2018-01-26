"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var geopoint_1 = require("../../../src/compile/data/geopoint");
var util_1 = require("../../../src/util");
var util_2 = require("../../util");
describe('compile/data/geopoint', function () {
    describe('geojson', function () {
        it('should make transform and assemble correctly', function () {
            var model = util_2.parseUnitModel({
                'data': {
                    'url': 'data/zipcodes.csv',
                    'format': {
                        'type': 'csv'
                    }
                },
                'mark': 'circle',
                'encoding': {
                    'x': {
                        'field': 'longitude',
                        'type': 'longitude'
                    },
                    'y': {
                        'field': 'latitude',
                        'type': 'latitude'
                    }
                }
            });
            model.parse();
            var nodes = geopoint_1.GeoPointNode.makeAll(model);
            chai_1.assert.isNotNull(nodes);
            chai_1.assert.isNotEmpty(nodes);
            nodes.forEach(function (node) {
                chai_1.assert.isNotNull(node);
                if (node) {
                    var transform_1 = node.assemble();
                    chai_1.assert.equal(transform_1.type, 'geopoint');
                    chai_1.assert.isTrue(util_1.every(['longitude', 'latitude'], function (field) { return util_1.contains(transform_1.fields, field); }));
                    chai_1.assert.isTrue(util_1.every(['longitude_geo', 'latitude_geo'], function (a) { return util_1.contains(transform_1.as, a); }));
                    chai_1.assert.isDefined(transform_1.projection);
                }
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VvcG9pbnQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL2dlb3BvaW50LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFDNUIsK0RBQWdFO0FBQ2hFLDBDQUFrRDtBQUVsRCxtQ0FBMEM7QUFFMUMsUUFBUSxDQUFDLHVCQUF1QixFQUFFO0lBQ2hDLFFBQVEsQ0FBQyxTQUFTLEVBQUU7UUFDbEIsRUFBRSxDQUFDLDhDQUE4QyxFQUFFO1lBQ2pELElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7Z0JBQzNCLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsbUJBQW1CO29CQUMxQixRQUFRLEVBQUU7d0JBQ1IsTUFBTSxFQUFFLEtBQUs7cUJBQ2Q7aUJBQ0Y7Z0JBQ0QsTUFBTSxFQUFFLFFBQVE7Z0JBQ2hCLFVBQVUsRUFBRTtvQkFDVixHQUFHLEVBQUU7d0JBQ0gsT0FBTyxFQUFFLFdBQVc7d0JBQ3BCLE1BQU0sRUFBRSxXQUFXO3FCQUNwQjtvQkFDRCxHQUFHLEVBQUU7d0JBQ0gsT0FBTyxFQUFFLFVBQVU7d0JBQ25CLE1BQU0sRUFBRSxVQUFVO3FCQUNuQjtpQkFDRjthQUNGLENBQUMsQ0FBQztZQUNILEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNkLElBQU0sS0FBSyxHQUFtQix1QkFBWSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxRCxhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hCLGFBQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDekIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUk7Z0JBQ2pCLGFBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3ZCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ1QsSUFBTSxXQUFTLEdBQXdCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDdkQsYUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFTLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO29CQUN6QyxhQUFNLENBQUMsTUFBTSxDQUFDLFlBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsRUFBRSxVQUFDLEtBQUssSUFBSyxPQUFBLGVBQVEsQ0FBQyxXQUFTLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFqQyxDQUFpQyxDQUFDLENBQUMsQ0FBQztvQkFDOUYsYUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFLLENBQUMsQ0FBQyxlQUFlLEVBQUUsY0FBYyxDQUFDLEVBQUUsVUFBQyxDQUFDLElBQUssT0FBQSxlQUFRLENBQUMsV0FBUyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBekIsQ0FBeUIsQ0FBQyxDQUFDLENBQUM7b0JBQzFGLGFBQU0sQ0FBQyxTQUFTLENBQUMsV0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUN6QyxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge0dlb1BvaW50Tm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9nZW9wb2ludCc7XG5pbXBvcnQge2NvbnRhaW5zLCBldmVyeX0gZnJvbSAnLi4vLi4vLi4vc3JjL3V0aWwnO1xuaW1wb3J0IHtWZ0dlb1BvaW50VHJhbnNmb3JtfSBmcm9tICcuLi8uLi8uLi9zcmMvdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdjb21waWxlL2RhdGEvZ2VvcG9pbnQnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdnZW9qc29uJywgZnVuY3Rpb24gKCkge1xuICAgIGl0KCdzaG91bGQgbWFrZSB0cmFuc2Zvcm0gYW5kIGFzc2VtYmxlIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAnZGF0YSc6IHtcbiAgICAgICAgICAndXJsJzogJ2RhdGEvemlwY29kZXMuY3N2JyxcbiAgICAgICAgICAnZm9ybWF0Jzoge1xuICAgICAgICAgICAgJ3R5cGUnOiAnY3N2J1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgJ21hcmsnOiAnY2lyY2xlJyxcbiAgICAgICAgJ2VuY29kaW5nJzoge1xuICAgICAgICAgICd4Jzoge1xuICAgICAgICAgICAgJ2ZpZWxkJzogJ2xvbmdpdHVkZScsXG4gICAgICAgICAgICAndHlwZSc6ICdsb25naXR1ZGUnXG4gICAgICAgICAgfSxcbiAgICAgICAgICAneSc6IHtcbiAgICAgICAgICAgICdmaWVsZCc6ICdsYXRpdHVkZScsXG4gICAgICAgICAgICAndHlwZSc6ICdsYXRpdHVkZSdcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbW9kZWwucGFyc2UoKTtcbiAgICAgIGNvbnN0IG5vZGVzOiBHZW9Qb2ludE5vZGVbXSA9IEdlb1BvaW50Tm9kZS5tYWtlQWxsKG1vZGVsKTtcbiAgICAgIGFzc2VydC5pc05vdE51bGwobm9kZXMpO1xuICAgICAgYXNzZXJ0LmlzTm90RW1wdHkobm9kZXMpO1xuICAgICAgbm9kZXMuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICBhc3NlcnQuaXNOb3ROdWxsKG5vZGUpO1xuICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybTogVmdHZW9Qb2ludFRyYW5zZm9ybSA9IG5vZGUuYXNzZW1ibGUoKTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwodHJhbnNmb3JtLnR5cGUsICdnZW9wb2ludCcpO1xuICAgICAgICAgIGFzc2VydC5pc1RydWUoZXZlcnkoWydsb25naXR1ZGUnLCAnbGF0aXR1ZGUnXSwgKGZpZWxkKSA9PiBjb250YWlucyh0cmFuc2Zvcm0uZmllbGRzLCBmaWVsZCkpKTtcbiAgICAgICAgICBhc3NlcnQuaXNUcnVlKGV2ZXJ5KFsnbG9uZ2l0dWRlX2dlbycsICdsYXRpdHVkZV9nZW8nXSwgKGEpID0+IGNvbnRhaW5zKHRyYW5zZm9ybS5hcywgYSkpKTtcbiAgICAgICAgICBhc3NlcnQuaXNEZWZpbmVkKHRyYW5zZm9ybS5wcm9qZWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=