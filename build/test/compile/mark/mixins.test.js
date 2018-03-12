"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var mixins_1 = require("../../../src/compile/mark/mixins");
var util_1 = require("../../util");
describe('compile/mark/mixins', function () {
    describe('color()', function () {
        it('color should be mapped to fill for bar', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": "bar",
                "encoding": {
                    "x": {
                        "field": "gender", "type": "nominal",
                        "scale": { "rangeStep": 6 },
                        "axis": null
                    },
                    "color": {
                        "field": "gender", "type": "nominal",
                        "scale": { "range": ["#EA98D2", "#659CCA"] }
                    }
                },
                "data": { "url": "data/population.json" }
            });
            var colorMixins = mixins_1.color(model);
            chai_1.assert.deepEqual(colorMixins.fill, { "field": "gender", "scale": "color" });
        });
        it('color should be mapped to stroke for point', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": "point",
                "encoding": {
                    "x": {
                        "field": "gender", "type": "nominal",
                        "scale": { "rangeStep": 6 },
                        "axis": null
                    },
                    "color": {
                        "field": "gender", "type": "nominal",
                        "scale": { "range": ["#EA98D2", "#659CCA"] }
                    }
                },
                "data": { "url": "data/population.json" }
            });
            var colorMixins = mixins_1.color(model);
            chai_1.assert.deepEqual(colorMixins.stroke, { "field": "gender", "scale": "color" });
            chai_1.assert.propertyVal(colorMixins.fill, 'value', "transparent");
        });
    });
    describe('midPoint()', function () {
        it('should return correctly for lat/lng', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "data": {
                    "url": "data/zipcodes.csv",
                    "format": {
                        "type": "csv"
                    }
                },
                "mark": "point",
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
            [channel_1.X, channel_1.Y].forEach(function (channel) {
                var mixins = mixins_1.pointPosition(channel, model, 'zeroOrMin');
                chai_1.assert.equal(mixins[channel].field, model.getName(channel));
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4aW5zLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvbWFyay9taXhpbnMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFDNUIsZ0RBQTBDO0FBQzFDLDJEQUFzRTtBQUN0RSxtQ0FBZ0U7QUFFaEUsUUFBUSxDQUFDLHFCQUFxQixFQUFFO0lBQzlCLFFBQVEsQ0FBQyxTQUFTLEVBQUU7UUFDbEIsRUFBRSxDQUFDLHdDQUF3QyxFQUFFO1lBQzNDLElBQU0sS0FBSyxHQUFHLDJDQUFvQyxDQUFDO2dCQUNqRCxNQUFNLEVBQUUsS0FBSztnQkFDYixVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFO3dCQUNILE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVM7d0JBQ3BDLE9BQU8sRUFBRSxFQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUM7d0JBQ3pCLE1BQU0sRUFBRSxJQUFJO3FCQUNiO29CQUNELE9BQU8sRUFBRTt3QkFDUCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTO3dCQUNwQyxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLEVBQUM7cUJBQzNDO2lCQUNGO2dCQUNELE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxzQkFBc0IsRUFBQzthQUN4QyxDQUFDLENBQUM7WUFFSCxJQUFNLFdBQVcsR0FBRyxjQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDakMsYUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztRQUM1RSxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRTtZQUMvQyxJQUFNLEtBQUssR0FBRywyQ0FBb0MsQ0FBQztnQkFDakQsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsVUFBVSxFQUFFO29CQUNWLEdBQUcsRUFBRTt3QkFDSCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTO3dCQUNwQyxPQUFPLEVBQUUsRUFBQyxXQUFXLEVBQUUsQ0FBQyxFQUFDO3dCQUN6QixNQUFNLEVBQUUsSUFBSTtxQkFDYjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUzt3QkFDcEMsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxFQUFDO3FCQUMzQztpQkFDRjtnQkFDRCxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsc0JBQXNCLEVBQUM7YUFDeEMsQ0FBQyxDQUFDO1lBRUgsSUFBTSxXQUFXLEdBQUcsY0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2pDLGFBQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7WUFDNUUsYUFBTSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQztRQUMvRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFlBQVksRUFBRTtRQUNyQixFQUFFLENBQUMscUNBQXFDLEVBQUU7WUFDeEMsSUFBTSxLQUFLLEdBQUcsMkNBQW9DLENBQUM7Z0JBQ2pELE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsbUJBQW1CO29CQUMxQixRQUFRLEVBQUU7d0JBQ1IsTUFBTSxFQUFFLEtBQUs7cUJBQ2Q7aUJBQ0Y7Z0JBQ0QsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsVUFBVSxFQUFFO29CQUNWLFdBQVcsRUFBRTt3QkFDWCxPQUFPLEVBQUUsV0FBVzt3QkFDcEIsTUFBTSxFQUFFLGNBQWM7cUJBQ3ZCO29CQUNELFVBQVUsRUFBRTt3QkFDVixPQUFPLEVBQUUsVUFBVTt3QkFDbkIsTUFBTSxFQUFFLGNBQWM7cUJBQ3ZCO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsQ0FBQyxXQUFDLEVBQUUsV0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBTztnQkFDckIsSUFBTSxNQUFNLEdBQUcsc0JBQWEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUN4RCxhQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2hFLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7WCwgWX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NoYW5uZWwnO1xuaW1wb3J0IHtjb2xvciwgcG9pbnRQb3NpdGlvbn0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvbWFyay9taXhpbnMnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemV9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnY29tcGlsZS9tYXJrL21peGlucycsICgpID0+IHtcbiAgZGVzY3JpYmUoJ2NvbG9yKCknLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnY29sb3Igc2hvdWxkIGJlIG1hcHBlZCB0byBmaWxsIGZvciBiYXInLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwiZ2VuZGVyXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIixcbiAgICAgICAgICAgIFwic2NhbGVcIjoge1wicmFuZ2VTdGVwXCI6IDZ9LFxuICAgICAgICAgICAgXCJheGlzXCI6IG51bGxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY29sb3JcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcImdlbmRlclwiLCBcInR5cGVcIjogXCJub21pbmFsXCIsXG4gICAgICAgICAgICBcInNjYWxlXCI6IHtcInJhbmdlXCI6IFtcIiNFQTk4RDJcIiwgXCIjNjU5Q0NBXCJdfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgY29sb3JNaXhpbnMgPSBjb2xvcihtb2RlbCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGNvbG9yTWl4aW5zLmZpbGwsIHtcImZpZWxkXCI6IFwiZ2VuZGVyXCIsIFwic2NhbGVcIjogXCJjb2xvclwifSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY29sb3Igc2hvdWxkIGJlIG1hcHBlZCB0byBzdHJva2UgZm9yIHBvaW50JywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwiZ2VuZGVyXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIixcbiAgICAgICAgICAgIFwic2NhbGVcIjoge1wicmFuZ2VTdGVwXCI6IDZ9LFxuICAgICAgICAgICAgXCJheGlzXCI6IG51bGxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY29sb3JcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcImdlbmRlclwiLCBcInR5cGVcIjogXCJub21pbmFsXCIsXG4gICAgICAgICAgICBcInNjYWxlXCI6IHtcInJhbmdlXCI6IFtcIiNFQTk4RDJcIiwgXCIjNjU5Q0NBXCJdfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgY29sb3JNaXhpbnMgPSBjb2xvcihtb2RlbCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGNvbG9yTWl4aW5zLnN0cm9rZSwge1wiZmllbGRcIjogXCJnZW5kZXJcIiwgXCJzY2FsZVwiOiBcImNvbG9yXCJ9KTtcbiAgICAgIGFzc2VydC5wcm9wZXJ0eVZhbChjb2xvck1peGlucy5maWxsLCAndmFsdWUnLCBcInRyYW5zcGFyZW50XCIpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnbWlkUG9pbnQoKScsIGZ1bmN0aW9uICgpIHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0bHkgZm9yIGxhdC9sbmcnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgXCJ1cmxcIjogXCJkYXRhL3ppcGNvZGVzLmNzdlwiLFxuICAgICAgICAgIFwiZm9ybWF0XCI6IHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcImNzdlwiXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcImxvbmdpdHVkZVwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwibG9uZ2l0dWRlXCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJsYXRpdHVkZVwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwibGF0aXR1ZGVcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgW1gsIFldLmZvckVhY2goKGNoYW5uZWwpID0+IHtcbiAgICAgICAgY29uc3QgbWl4aW5zID0gcG9pbnRQb3NpdGlvbihjaGFubmVsLCBtb2RlbCwgJ3plcm9Pck1pbicpO1xuICAgICAgICAgIGFzc2VydC5lcXVhbChtaXhpbnNbY2hhbm5lbF0uZmllbGQsIG1vZGVsLmdldE5hbWUoY2hhbm5lbCkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=