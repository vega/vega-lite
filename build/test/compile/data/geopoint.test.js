"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var dataflow_1 = require("../../../src/compile/data/dataflow");
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
                    'longitude': {
                        'field': 'longitude',
                        'type': 'quantitative'
                    },
                    'latitude': {
                        'field': 'latitude',
                        'type': 'quantitative'
                    }
                }
            });
            model.parse();
            var root = new dataflow_1.DataFlowNode(null);
            geopoint_1.GeoPointNode.parseAll(root, model);
            var node = root.children[0];
            var _loop_1 = function () {
                chai_1.assert.instanceOf(node, geopoint_1.GeoPointNode);
                var transform = node.assemble();
                chai_1.assert.equal(transform.type, 'geopoint');
                chai_1.assert.isTrue(util_1.every(['longitude', 'latitude'], function (field) { return util_1.contains(transform.fields, field); }));
                chai_1.assert.isTrue(util_1.every([model.getName('x'), model.getName('y')], function (a) { return util_1.contains(transform.as, a); }));
                chai_1.assert.isDefined(transform.projection);
                chai_1.assert.isAtMost(node.children.length, 1);
                node = node.children[0];
            };
            while (node != null) {
                _loop_1();
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VvcG9pbnQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL2dlb3BvaW50LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFDNUIsK0RBQWdFO0FBQ2hFLCtEQUFnRTtBQUNoRSwwQ0FBa0Q7QUFFbEQsbUNBQTBDO0FBRTFDLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtJQUNoQyxRQUFRLENBQUMsU0FBUyxFQUFFO1FBQ2xCLEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRTtZQUNqRCxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO2dCQUMzQixNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFLG1CQUFtQjtvQkFDMUIsUUFBUSxFQUFFO3dCQUNSLE1BQU0sRUFBRSxLQUFLO3FCQUNkO2lCQUNGO2dCQUNELE1BQU0sRUFBRSxRQUFRO2dCQUNoQixVQUFVLEVBQUU7b0JBQ1YsV0FBVyxFQUFFO3dCQUNYLE9BQU8sRUFBRSxXQUFXO3dCQUNwQixNQUFNLEVBQUUsY0FBYztxQkFDdkI7b0JBQ0QsVUFBVSxFQUFFO3dCQUNWLE9BQU8sRUFBRSxVQUFVO3dCQUNuQixNQUFNLEVBQUUsY0FBYztxQkFDdkI7aUJBQ0Y7YUFDRixDQUFDLENBQUM7WUFDSCxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7WUFFZCxJQUFNLElBQUksR0FBRyxJQUFJLHVCQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEMsdUJBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRW5DLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7O2dCQUcxQixhQUFNLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSx1QkFBWSxDQUFDLENBQUM7Z0JBRXRDLElBQU0sU0FBUyxHQUF1QyxJQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3ZFLGFBQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDekMsYUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFLLENBQUMsQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLEVBQUUsVUFBQyxLQUFLLElBQUssT0FBQSxlQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBakMsQ0FBaUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlGLGFBQU0sQ0FBQyxNQUFNLENBQUMsWUFBSyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsVUFBQyxDQUFDLElBQUssT0FBQSxlQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBekIsQ0FBeUIsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pHLGFBQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUN2QyxhQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQixDQUFDO1lBVkQsT0FBTyxJQUFJLElBQUksSUFBSTs7YUFVbEI7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9kYXRhZmxvdyc7XG5pbXBvcnQge0dlb1BvaW50Tm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9nZW9wb2ludCc7XG5pbXBvcnQge2NvbnRhaW5zLCBldmVyeX0gZnJvbSAnLi4vLi4vLi4vc3JjL3V0aWwnO1xuaW1wb3J0IHtWZ0dlb1BvaW50VHJhbnNmb3JtfSBmcm9tICcuLi8uLi8uLi9zcmMvdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdjb21waWxlL2RhdGEvZ2VvcG9pbnQnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdnZW9qc29uJywgZnVuY3Rpb24gKCkge1xuICAgIGl0KCdzaG91bGQgbWFrZSB0cmFuc2Zvcm0gYW5kIGFzc2VtYmxlIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAnZGF0YSc6IHtcbiAgICAgICAgICAndXJsJzogJ2RhdGEvemlwY29kZXMuY3N2JyxcbiAgICAgICAgICAnZm9ybWF0Jzoge1xuICAgICAgICAgICAgJ3R5cGUnOiAnY3N2J1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgJ21hcmsnOiAnY2lyY2xlJyxcbiAgICAgICAgJ2VuY29kaW5nJzoge1xuICAgICAgICAgICdsb25naXR1ZGUnOiB7XG4gICAgICAgICAgICAnZmllbGQnOiAnbG9uZ2l0dWRlJyxcbiAgICAgICAgICAgICd0eXBlJzogJ3F1YW50aXRhdGl2ZSdcbiAgICAgICAgICB9LFxuICAgICAgICAgICdsYXRpdHVkZSc6IHtcbiAgICAgICAgICAgICdmaWVsZCc6ICdsYXRpdHVkZScsXG4gICAgICAgICAgICAndHlwZSc6ICdxdWFudGl0YXRpdmUnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG1vZGVsLnBhcnNlKCk7XG5cbiAgICAgIGNvbnN0IHJvb3QgPSBuZXcgRGF0YUZsb3dOb2RlKG51bGwpO1xuICAgICAgR2VvUG9pbnROb2RlLnBhcnNlQWxsKHJvb3QsIG1vZGVsKTtcblxuICAgICAgbGV0IG5vZGUgPSByb290LmNoaWxkcmVuWzBdO1xuXG4gICAgICB3aGlsZSAobm9kZSAhPSBudWxsKSB7XG4gICAgICAgIGFzc2VydC5pbnN0YW5jZU9mKG5vZGUsIEdlb1BvaW50Tm9kZSk7XG5cbiAgICAgICAgY29uc3QgdHJhbnNmb3JtOiBWZ0dlb1BvaW50VHJhbnNmb3JtID0gKDxHZW9Qb2ludE5vZGU+bm9kZSkuYXNzZW1ibGUoKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zZm9ybS50eXBlLCAnZ2VvcG9pbnQnKTtcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShldmVyeShbJ2xvbmdpdHVkZScsICdsYXRpdHVkZSddLCAoZmllbGQpID0+IGNvbnRhaW5zKHRyYW5zZm9ybS5maWVsZHMsIGZpZWxkKSkpO1xuICAgICAgICBhc3NlcnQuaXNUcnVlKGV2ZXJ5KFttb2RlbC5nZXROYW1lKCd4JyksIG1vZGVsLmdldE5hbWUoJ3knKV0sIChhKSA9PiBjb250YWlucyh0cmFuc2Zvcm0uYXMsIGEpKSk7XG4gICAgICAgIGFzc2VydC5pc0RlZmluZWQodHJhbnNmb3JtLnByb2plY3Rpb24pO1xuICAgICAgICBhc3NlcnQuaXNBdE1vc3Qobm9kZS5jaGlsZHJlbi5sZW5ndGgsIDEpO1xuICAgICAgICBub2RlID0gbm9kZS5jaGlsZHJlblswXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==