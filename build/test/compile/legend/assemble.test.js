"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../../util");
describe('legend/assemble', function () {
    it('merges legend of the same field with the default type.', function () {
        var model = util_1.parseUnitModelWithScale({
            "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
            "description": "A scatterplot showing horsepower and miles per gallons.",
            "data": { "url": "data/cars.json" },
            "mark": "point",
            "encoding": {
                "x": { "field": "Horsepower", "type": "quantitative" },
                "y": { "field": "Miles_per_Gallon", "type": "quantitative" },
                "color": { "field": "Origin", "type": "nominal" },
                "shape": { "field": "Origin", "type": "nominal" }
            }
        });
        model.parseLegend();
        var legends = model.assembleLegends();
        chai_1.assert.equal(legends.length, 1);
        chai_1.assert.equal(legends[0].title, 'Origin');
        chai_1.assert.equal(legends[0].stroke, 'color');
        chai_1.assert.equal(legends[0].shape, 'shape');
    });
    it('merges legend of the same field and favor symbol legend over gradient', function () {
        var model = util_1.parseUnitModelWithScale({
            "data": { "values": [{ "a": "A", "b": 28 }, { "a": "B", "b": 55 }] },
            "mark": "bar",
            "encoding": {
                "x": { "field": "a", "type": "ordinal" },
                "y": { "field": "b", "type": "quantitative" },
                "color": { "field": "b", "type": "quantitative" },
                "size": { "field": "b", "type": "quantitative" }
            }
        });
        model.parseLegend();
        var legends = model.assembleLegends();
        chai_1.assert.equal(legends.length, 1);
        chai_1.assert.equal(legends[0].title, 'b');
        chai_1.assert.equal(legends[0].type, 'symbol');
        chai_1.assert.equal(legends[0].stroke, 'color');
        chai_1.assert.equal(legends[0].size, 'size');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9sZWdlbmQvYXNzZW1ibGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFDNUIsbUNBQW1EO0FBR25ELFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtJQUMxQixFQUFFLENBQUMsd0RBQXdELEVBQUU7UUFDM0QsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUM7WUFDcEMsU0FBUyxFQUFFLGlEQUFpRDtZQUM1RCxhQUFhLEVBQUUseURBQXlEO1lBQ3hFLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBQztZQUNqQyxNQUFNLEVBQUUsT0FBTztZQUNmLFVBQVUsRUFBRTtnQkFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7Z0JBQ3BELEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDO2dCQUMxRCxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7Z0JBQy9DLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQzthQUNoRDtTQUNGLENBQUMsQ0FBQztRQUNILEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUVwQixJQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDeEMsYUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRWhDLGFBQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN6QyxhQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDekMsYUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzFDLENBQUMsQ0FBQyxDQUFDO0lBQ0gsRUFBRSxDQUFDLHVFQUF1RSxFQUFFO1FBQzFFLElBQU0sS0FBSyxHQUFHLDhCQUF1QixDQUFDO1lBQ3BDLE1BQU0sRUFBRSxFQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBQyxHQUFHLEVBQUUsRUFBRSxFQUFDLEVBQUMsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUMsQ0FBQyxFQUFDO1lBQzNELE1BQU0sRUFBRSxLQUFLO1lBQ2IsVUFBVSxFQUFFO2dCQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUMsTUFBTSxFQUFFLFNBQVMsRUFBQztnQkFDckMsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDO2dCQUMxQyxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7Z0JBQzlDLE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQzthQUM5QztTQUNGLENBQUMsQ0FBQztRQUVILEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUVwQixJQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDeEMsYUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLGFBQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNwQyxhQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDeEMsYUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3pDLGFBQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN4QyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=