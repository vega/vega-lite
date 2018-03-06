"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4aW5zLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvbWFyay9taXhpbnMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFDNUIsMkRBQXVEO0FBQ3ZELG1DQUFnRTtBQUVoRSxRQUFRLENBQUMscUJBQXFCLEVBQUU7SUFDOUIsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNsQixFQUFFLENBQUMsd0NBQXdDLEVBQUU7WUFDM0MsSUFBTSxLQUFLLEdBQUcsMkNBQW9DLENBQUM7Z0JBQ2pELE1BQU0sRUFBRSxLQUFLO2dCQUNiLFVBQVUsRUFBRTtvQkFDVixHQUFHLEVBQUU7d0JBQ0gsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUzt3QkFDcEMsT0FBTyxFQUFFLEVBQUMsV0FBVyxFQUFFLENBQUMsRUFBQzt3QkFDekIsTUFBTSxFQUFFLElBQUk7cUJBQ2I7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVM7d0JBQ3BDLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsRUFBQztxQkFDM0M7aUJBQ0Y7Z0JBQ0QsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLHNCQUFzQixFQUFDO2FBQ3hDLENBQUMsQ0FBQztZQUVILElBQU0sV0FBVyxHQUFHLGNBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNqQyxhQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1FBQzVFLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDRDQUE0QyxFQUFFO1lBQy9DLElBQU0sS0FBSyxHQUFHLDJDQUFvQyxDQUFDO2dCQUNqRCxNQUFNLEVBQUUsT0FBTztnQkFDZixVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFO3dCQUNILE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVM7d0JBQ3BDLE9BQU8sRUFBRSxFQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUM7d0JBQ3pCLE1BQU0sRUFBRSxJQUFJO3FCQUNiO29CQUNELE9BQU8sRUFBRTt3QkFDUCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTO3dCQUNwQyxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLEVBQUM7cUJBQzNDO2lCQUNGO2dCQUNELE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxzQkFBc0IsRUFBQzthQUN4QyxDQUFDLENBQUM7WUFFSCxJQUFNLFdBQVcsR0FBRyxjQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDakMsYUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztZQUM1RSxhQUFNLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQy9ELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge2NvbG9yfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9tYXJrL21peGlucyc7XG5pbXBvcnQge3BhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdjb21waWxlL21hcmsvbWl4aW5zJywgKCkgPT4ge1xuICBkZXNjcmliZSgnY29sb3IoKScsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdjb2xvciBzaG91bGQgYmUgbWFwcGVkIHRvIGZpbGwgZm9yIGJhcicsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJnZW5kZXJcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwiLFxuICAgICAgICAgICAgXCJzY2FsZVwiOiB7XCJyYW5nZVN0ZXBcIjogNn0sXG4gICAgICAgICAgICBcImF4aXNcIjogbnVsbFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjb2xvclwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwiZ2VuZGVyXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIixcbiAgICAgICAgICAgIFwic2NhbGVcIjoge1wicmFuZ2VcIjogW1wiI0VBOThEMlwiLCBcIiM2NTlDQ0FcIl19XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBjb2xvck1peGlucyA9IGNvbG9yKG1vZGVsKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoY29sb3JNaXhpbnMuZmlsbCwge1wiZmllbGRcIjogXCJnZW5kZXJcIiwgXCJzY2FsZVwiOiBcImNvbG9yXCJ9KTtcbiAgICB9KTtcblxuICAgIGl0KCdjb2xvciBzaG91bGQgYmUgbWFwcGVkIHRvIHN0cm9rZSBmb3IgcG9pbnQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJnZW5kZXJcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwiLFxuICAgICAgICAgICAgXCJzY2FsZVwiOiB7XCJyYW5nZVN0ZXBcIjogNn0sXG4gICAgICAgICAgICBcImF4aXNcIjogbnVsbFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjb2xvclwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwiZ2VuZGVyXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIixcbiAgICAgICAgICAgIFwic2NhbGVcIjoge1wicmFuZ2VcIjogW1wiI0VBOThEMlwiLCBcIiM2NTlDQ0FcIl19XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBjb2xvck1peGlucyA9IGNvbG9yKG1vZGVsKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoY29sb3JNaXhpbnMuc3Ryb2tlLCB7XCJmaWVsZFwiOiBcImdlbmRlclwiLCBcInNjYWxlXCI6IFwiY29sb3JcIn0pO1xuICAgICAgYXNzZXJ0LnByb3BlcnR5VmFsKGNvbG9yTWl4aW5zLmZpbGwsICd2YWx1ZScsIFwidHJhbnNwYXJlbnRcIik7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=