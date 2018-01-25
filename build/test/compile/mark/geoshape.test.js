"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var geoshape_1 = require("../../../src/compile/mark/geoshape");
var util_1 = require("../../util");
describe('Mark: Geoshape', function () {
    describe('encode', function () {
        it('should create no properties', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": "geoshape",
                "projection": {
                    "type": "albersUsa"
                },
                "data": {
                    "url": "data/us-10m.json",
                    "format": {
                        "type": "topojson",
                        "feature": "states"
                    }
                },
                "encoding": {
                    "color": {
                        "value": "black"
                    },
                    "opacity": {
                        "value": 0.8
                    }
                }
            });
            var props = geoshape_1.geoshape.encodeEntry(model);
            chai_1.assert.deepEqual({
                "fill": {
                    "value": "black"
                },
                "opacity": {
                    "value": 0.8
                }
            }, props);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2Vvc2hhcGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9tYXJrL2dlb3NoYXBlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLCtEQUE0RDtBQUM1RCxtQ0FBZ0U7QUFFaEUsUUFBUSxDQUFDLGdCQUFnQixFQUFFO0lBQ3pCLFFBQVEsQ0FBQyxRQUFRLEVBQUU7UUFDakIsRUFBRSxDQUFDLDZCQUE2QixFQUFFO1lBQ2hDLElBQU0sS0FBSyxHQUFHLDJDQUFvQyxDQUFDO2dCQUNqRCxNQUFNLEVBQUUsVUFBVTtnQkFDbEIsWUFBWSxFQUFFO29CQUNaLE1BQU0sRUFBRSxXQUFXO2lCQUNwQjtnQkFDRCxNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFLGtCQUFrQjtvQkFDekIsUUFBUSxFQUFFO3dCQUNSLE1BQU0sRUFBRSxVQUFVO3dCQUNsQixTQUFTLEVBQUUsUUFBUTtxQkFDcEI7aUJBQ0Y7Z0JBQ0QsVUFBVSxFQUFFO29CQUNWLE9BQU8sRUFBRTt3QkFDUCxPQUFPLEVBQUUsT0FBTztxQkFDakI7b0JBQ0QsU0FBUyxFQUFFO3dCQUNULE9BQU8sRUFBRSxHQUFHO3FCQUNiO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsSUFBTSxLQUFLLEdBQUcsbUJBQVEsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsYUFBTSxDQUFDLFNBQVMsQ0FBQztnQkFDZixNQUFNLEVBQUU7b0JBQ04sT0FBTyxFQUFFLE9BQU87aUJBQ2pCO2dCQUNELFNBQVMsRUFBRTtvQkFDVCxPQUFPLEVBQUUsR0FBRztpQkFDYjthQUNGLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZSBxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtnZW9zaGFwZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvbWFyay9nZW9zaGFwZSc7XG5pbXBvcnQge3BhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdNYXJrOiBHZW9zaGFwZScsIGZ1bmN0aW9uKCkge1xuICBkZXNjcmliZSgnZW5jb2RlJywgZnVuY3Rpb24gKCkge1xuICAgIGl0KCdzaG91bGQgY3JlYXRlIG5vIHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiBcImdlb3NoYXBlXCIsXG4gICAgICAgIFwicHJvamVjdGlvblwiOiB7XG4gICAgICAgICAgXCJ0eXBlXCI6IFwiYWxiZXJzVXNhXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgICBcInVybFwiOiBcImRhdGEvdXMtMTBtLmpzb25cIixcbiAgICAgICAgICBcImZvcm1hdFwiOiB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJ0b3BvanNvblwiLFxuICAgICAgICAgICAgXCJmZWF0dXJlXCI6IFwic3RhdGVzXCJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwiY29sb3JcIjoge1xuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImJsYWNrXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwib3BhY2l0eVwiOiB7XG4gICAgICAgICAgICBcInZhbHVlXCI6IDAuOFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBwcm9wcyA9IGdlb3NoYXBlLmVuY29kZUVudHJ5KG1vZGVsKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoe1xuICAgICAgICBcImZpbGxcIjoge1xuICAgICAgICAgIFwidmFsdWVcIjogXCJibGFja1wiXG4gICAgICAgIH0sXG4gICAgICAgIFwib3BhY2l0eVwiOiB7XG4gICAgICAgICAgXCJ2YWx1ZVwiOiAwLjhcbiAgICAgICAgfVxuICAgICAgfSwgcHJvcHMpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19