"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var legendParse = require("../../../src/compile/legend/parse");
var parse_1 = require("../../../src/compile/legend/parse");
var fielddef_1 = require("../../../src/fielddef");
var type_1 = require("../../../src/type");
var util_1 = require("../../util");
describe('compile/legend', function () {
    describe('parseUnitLegend()', function () {
        it("should not produce a Vega legend object on channel 'shape' with type 'geojson'", function () {
            var spec = {
                "mark": "geoshape",
                "data": { "url": "data/income.json" },
                "transform": [
                    {
                        "lookup": "id",
                        "from": {
                            "data": {
                                "url": "data/us-10m.json",
                                "format": { "type": "topojson", "feature": "states" }
                            },
                            "key": "id"
                        },
                        "as": "geo"
                    }
                ],
                "encoding": {
                    "shape": { "field": "geo", "type": "geojson" }
                }
            };
            var unitModel = util_1.parseUnitModelWithScale(spec);
            var channelDef = unitModel.encoding[channel_1.SHAPE];
            chai_1.assert.isTrue(fielddef_1.isFieldDef(channelDef));
            if (fielddef_1.isFieldDef(channelDef)) {
                chai_1.assert.equal(channelDef.type, type_1.GEOJSON);
            }
            parse_1.parseLegend(unitModel);
            var legendComp = unitModel.component.legends;
            chai_1.assert.isUndefined(legendComp[channel_1.SHAPE]);
        });
    });
    describe('parseLegendForChannel()', function () {
        it('should produce a Vega legend object with correct type and scale for color', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    color: { field: "a", type: "quantitative" }
                }
            });
            var def = legendParse.parseLegendForChannel(model, channel_1.COLOR).combine();
            chai_1.assert.isObject(def);
            chai_1.assert.equal(def.title, 'a');
            chai_1.assert.equal(def.stroke, 'color');
            chai_1.assert.equal(def.type, 'gradient');
        });
        it('should produce no legend title when title is null, "", or false', function () {
            for (var _i = 0, _a = [null, '', false]; _i < _a.length; _i++) {
                var val = _a[_i];
                var model = util_1.parseUnitModelWithScale({
                    mark: "point",
                    encoding: {
                        x: { field: "a", type: "nominal" },
                        color: {
                            field: "a", type: "quantitative",
                            legend: { title: val } // Need to cast as false is not valid, but we want to fall back gracefully
                        }
                    }
                });
                var def = legendParse.parseLegendForChannel(model, channel_1.COLOR).combine();
                chai_1.assert.doesNotHaveAnyKeys(def, ['title']);
            }
        });
        it('should store fieldDef.title as explicit', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    color: {
                        field: "a", type: "quantitative",
                        legend: { title: 'foo' } // Need to cast as false is not valid, but we want to fall back gracefully
                    }
                }
            });
            var def = legendParse.parseLegendForChannel(model, channel_1.COLOR).combine();
            chai_1.assert.equal(def.title, 'foo');
        });
        [channel_1.SIZE, channel_1.SHAPE, channel_1.OPACITY].forEach(function (channel) {
            it("should produce a Vega legend object with correct type and scale for " + channel, function () {
                var spec = {
                    mark: "point",
                    encoding: {
                        x: { field: "a", type: "nominal" }
                    }
                };
                spec.encoding[channel] = { field: "a", type: "nominal" };
                var model = util_1.parseUnitModelWithScale(spec);
                var def = legendParse.parseLegendForChannel(model, channel).combine();
                var channelDef = model.encoding[channel];
                if (fielddef_1.isFieldDef(channelDef)) {
                    chai_1.assert.notEqual(channelDef.type, type_1.GEOJSON);
                }
                if (channel !== channel_1.OPACITY) {
                    chai_1.assert.equal(def.encode.symbols.update.opacity.value, 0.7);
                }
                else {
                    chai_1.assert.isUndefined(def.encode.symbols.update.opacity);
                }
                chai_1.assert.isObject(def);
                chai_1.assert.equal(def.title, "a");
            });
        });
    });
    describe('parseNonUnitLegend()', function () {
        it('should correctly merge orient by favoring explicit orient', function () {
            var model = util_1.parseLayerModel({
                "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
                "description": "Google's stock price over time.",
                "data": { "url": "data/stocks.csv" },
                "layer": [
                    {
                        "mark": "line",
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "field": "price", "type": "quantitative" },
                            "color": { "field": "symbol", "type": "nominal" }
                        }
                    }, {
                        "mark": { "type": "point", "filled": true },
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "field": "price", "type": "quantitative" },
                            "color": { "field": "symbol", "type": "nominal", "legend": { "orient": "left" } }
                        }
                    }
                ]
            });
            model.parseScale();
            model.parseLegend();
            chai_1.assert.equal(model.component.legends.color.explicit.orient, 'left');
        });
        it('should correctly merge legend that exists only on one plot', function () {
            var model = util_1.parseLayerModel({
                "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
                "description": "Google's stock price over time.",
                "data": { "url": "data/stocks.csv" },
                "layer": [
                    {
                        "mark": "line",
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "field": "price", "type": "quantitative" }
                        }
                    }, {
                        "mark": { "type": "point", "filled": true },
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "field": "price", "type": "quantitative" },
                            "color": { "field": "symbol", "type": "nominal" }
                        }
                    }
                ]
            });
            model.parseScale();
            model.parseLegend();
            chai_1.assert.isOk(model.component.legends.color);
            chai_1.assert.isUndefined(model.children[0].component.legends.color);
            chai_1.assert.isUndefined(model.children[1].component.legends.color);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9sZWdlbmQvcGFyc2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFDNUIsZ0RBQWlFO0FBQ2pFLCtEQUFpRTtBQUNqRSwyREFBOEQ7QUFDOUQsa0RBQWlEO0FBRWpELDBDQUEwQztBQUMxQyxtQ0FBb0U7QUFFcEUsUUFBUSxDQUFDLGdCQUFnQixFQUFFO0lBQ3pCLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtRQUM1QixFQUFFLENBQUMsZ0ZBQWdGLEVBQUU7WUFDbkYsSUFBTSxJQUFJLEdBQXVCO2dCQUMvQixNQUFNLEVBQUUsVUFBVTtnQkFDbEIsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFDO2dCQUNuQyxXQUFXLEVBQUU7b0JBQ1g7d0JBQ0UsUUFBUSxFQUFFLElBQUk7d0JBQ2QsTUFBTSxFQUFFOzRCQUNOLE1BQU0sRUFBRTtnQ0FDTixLQUFLLEVBQUUsa0JBQWtCO2dDQUN6QixRQUFRLEVBQUUsRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUM7NkJBQ3BEOzRCQUNELEtBQUssRUFBRSxJQUFJO3lCQUNaO3dCQUNELElBQUksRUFBRSxLQUFLO3FCQUNaO2lCQUNGO2dCQUNELFVBQVUsRUFBRTtvQkFDVixPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7aUJBQzdDO2FBQ0YsQ0FBQztZQUVGLElBQU0sU0FBUyxHQUFHLDhCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hELElBQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsZUFBSyxDQUFDLENBQUM7WUFDN0MsYUFBTSxDQUFDLE1BQU0sQ0FBQyxxQkFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDdEMs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TUFBTSxFQUFFLFNBQVMsRUFBQzt5QkFDaEQ7cUJBQ0Y7aUJBQ0Y7YUFDRixDQUFDLENBQUM7WUFDSCxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDbkIsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3BCLGFBQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0MsYUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUQsYUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEUsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7Q09MT1IsIE9QQUNJVFksIFNIQVBFLCBTSVpFfSBmcm9tICcuLi8uLi8uLi9zcmMvY2hhbm5lbCc7XG5pbXBvcnQgKiBhcyBsZWdlbmRQYXJzZSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9sZWdlbmQvcGFyc2UnO1xuaW1wb3J0IHtwYXJzZUxlZ2VuZH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvbGVnZW5kL3BhcnNlJztcbmltcG9ydCB7aXNGaWVsZERlZn0gZnJvbSAnLi4vLi4vLi4vc3JjL2ZpZWxkZGVmJztcbmltcG9ydCB7Tm9ybWFsaXplZFVuaXRTcGVjfSBmcm9tICcuLi8uLi8uLi9zcmMvc3BlYyc7XG5pbXBvcnQge0dFT0pTT059IGZyb20gJy4uLy4uLy4uL3NyYy90eXBlJztcbmltcG9ydCB7cGFyc2VMYXllck1vZGVsLCBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdjb21waWxlL2xlZ2VuZCcsIGZ1bmN0aW9uICgpIHtcbiAgZGVzY3JpYmUoJ3BhcnNlVW5pdExlZ2VuZCgpJywgZnVuY3Rpb24gKCkge1xuICAgIGl0KGBzaG91bGQgbm90IHByb2R1Y2UgYSBWZWdhIGxlZ2VuZCBvYmplY3Qgb24gY2hhbm5lbCAnc2hhcGUnIHdpdGggdHlwZSAnZ2VvanNvbidgLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBzcGVjOiBOb3JtYWxpemVkVW5pdFNwZWMgPSB7XG4gICAgICAgIFwibWFya1wiOiBcImdlb3NoYXBlXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2luY29tZS5qc29uXCJ9LFxuICAgICAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJsb29rdXBcIjogXCJpZFwiLFxuICAgICAgICAgICAgXCJmcm9tXCI6IHtcbiAgICAgICAgICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgICAgICAgICBcInVybFwiOiBcImRhdGEvdXMtMTBtLmpzb25cIixcbiAgICAgICAgICAgICAgICBcImZvcm1hdFwiOiB7XCJ0eXBlXCI6IFwidG9wb2pzb25cIiwgXCJmZWF0dXJlXCI6IFwic3RhdGVzXCJ9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwia2V5XCI6IFwiaWRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiYXNcIjogXCJnZW9cIlxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJzaGFwZVwiOiB7XCJmaWVsZFwiOiBcImdlb1wiLCBcInR5cGVcIjogXCJnZW9qc29uXCJ9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHVuaXRNb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHNwZWMpO1xuICAgICAgY29uc3QgY2hhbm5lbERlZiA9IHVuaXRNb2RlbC5lbmNvZGluZ1tTSEFQRV07XG4gICAgICBhc3NlcnQuaXNUcnVlKGlzRmllbGREZWYoY2hhbm5lbERlZikpO1xuICAgICAgaWYgKGlzRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGNoYW5uZWxEZWYudHlwZSwgR0VPSlNPTik7XG4gICAgICB9XG4gICAgICBwYXJzZUxlZ2VuZCh1bml0TW9kZWwpO1xuICAgICAgY29uc3QgbGVnZW5kQ29tcCA9IHVuaXRNb2RlbC5jb21wb25lbnQubGVnZW5kcztcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChsZWdlbmRDb21wW1NIQVBFXSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdwYXJzZUxlZ2VuZEZvckNoYW5uZWwoKScsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdzaG91bGQgcHJvZHVjZSBhIFZlZ2EgbGVnZW5kIG9iamVjdCB3aXRoIGNvcnJlY3QgdHlwZSBhbmQgc2NhbGUgZm9yIGNvbG9yJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogXCJhXCIsIHR5cGU6IFwibm9taW5hbFwifSxcbiAgICAgICAgICBjb2xvcjoge2ZpZWxkOiBcImFcIiwgdHlwZTogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGRlZiA9IGxlZ2VuZFBhcnNlLnBhcnNlTGVnZW5kRm9yQ2hhbm5lbChtb2RlbCwgQ09MT1IpLmNvbWJpbmUoKTtcbiAgICAgIGFzc2VydC5pc09iamVjdChkZWYpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGRlZi50aXRsZSwgJ2EnKTtcbiAgICAgIGFzc2VydC5lcXVhbChkZWYuc3Ryb2tlLCAnY29sb3InKTtcbiAgICAgIGFzc2VydC5lcXVhbChkZWYudHlwZSwgJ2dyYWRpZW50Jyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHByb2R1Y2Ugbm8gbGVnZW5kIHRpdGxlIHdoZW4gdGl0bGUgaXMgbnVsbCwgXCJcIiwgb3IgZmFsc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBmb3IgKGNvbnN0IHZhbCBvZiBbbnVsbCwgJycsIGZhbHNlXSkge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogXCJhXCIsIHR5cGU6IFwibm9taW5hbFwifSxcbiAgICAgICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgICAgIGZpZWxkOiBcImFcIiwgdHlwZTogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgbGVnZW5kOiB7dGl0bGU6IHZhbCBhcyBhbnl9IC8vIE5lZWQgdG8gY2FzdCBhcyBmYWxzZSBpcyBub3QgdmFsaWQsIGJ1dCB3ZSB3YW50IHRvIGZhbGwgYmFjayBncmFjZWZ1bGx5XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBkZWYgPSBsZWdlbmRQYXJzZS5wYXJzZUxlZ2VuZEZvckNoYW5uZWwobW9kZWwsIENPTE9SKS5jb21iaW5lKCk7XG4gICAgICAgIGFzc2VydC5kb2VzTm90SGF2ZUFueUtleXMoZGVmLCBbJ3RpdGxlJ10pO1xuICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBpdCgnc2hvdWxkIHN0b3JlIGZpZWxkRGVmLnRpdGxlIGFzIGV4cGxpY2l0JywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6IFwiYVwiLCB0eXBlOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICAgIGZpZWxkOiBcImFcIiwgdHlwZTogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgIGxlZ2VuZDoge3RpdGxlOiAnZm9vJ30gLy8gTmVlZCB0byBjYXN0IGFzIGZhbHNlIGlzIG5vdCB2YWxpZCwgYnV0IHdlIHdhbnQgdG8gZmFsbCBiYWNrIGdyYWNlZnVsbHlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBkZWYgPSBsZWdlbmRQYXJzZS5wYXJzZUxlZ2VuZEZvckNoYW5uZWwobW9kZWwsIENPTE9SKS5jb21iaW5lKCk7XG4gICAgICBhc3NlcnQuZXF1YWwoZGVmLnRpdGxlLCAnZm9vJyk7XG4gICAgfSk7XG5cbiAgICBbU0laRSwgU0hBUEUsIE9QQUNJVFldLmZvckVhY2goY2hhbm5lbCA9PiB7XG4gICAgICBpdChgc2hvdWxkIHByb2R1Y2UgYSBWZWdhIGxlZ2VuZCBvYmplY3Qgd2l0aCBjb3JyZWN0IHR5cGUgYW5kIHNjYWxlIGZvciAke2NoYW5uZWx9YCwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHNwZWM6IE5vcm1hbGl6ZWRVbml0U3BlYyA9IHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogXCJhXCIsIHR5cGU6IFwibm9taW5hbFwifVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgc3BlYy5lbmNvZGluZ1tjaGFubmVsXSA9IHtmaWVsZDogXCJhXCIsIHR5cGU6IFwibm9taW5hbFwifTtcblxuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHNwZWMpO1xuXG4gICAgICAgIGNvbnN0IGRlZiA9IGxlZ2VuZFBhcnNlLnBhcnNlTGVnZW5kRm9yQ2hhbm5lbChtb2RlbCwgY2hhbm5lbCkuY29tYmluZSgpO1xuXG4gICAgICAgIGNvbnN0IGNoYW5uZWxEZWYgPSBtb2RlbC5lbmNvZGluZ1tjaGFubmVsXTtcbiAgICAgICAgaWYgKGlzRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICAgICAgICBhc3NlcnQubm90RXF1YWwoY2hhbm5lbERlZi50eXBlLCBHRU9KU09OKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjaGFubmVsICE9PSBPUEFDSVRZKSB7XG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGRlZi5lbmNvZGUuc3ltYm9scy51cGRhdGUub3BhY2l0eS52YWx1ZSwgMC43KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhc3NlcnQuaXNVbmRlZmluZWQoZGVmLmVuY29kZS5zeW1ib2xzLnVwZGF0ZS5vcGFjaXR5KTtcbiAgICAgICAgfVxuICAgICAgICBhc3NlcnQuaXNPYmplY3QoZGVmKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGRlZi50aXRsZSwgXCJhXCIpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdwYXJzZU5vblVuaXRMZWdlbmQoKScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNvcnJlY3RseSBtZXJnZSBvcmllbnQgYnkgZmF2b3JpbmcgZXhwbGljaXQgb3JpZW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUxheWVyTW9kZWwoe1xuICAgICAgICBcIiRzY2hlbWFcIjogXCJodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3NjaGVtYS92ZWdhLWxpdGUvdjIuanNvblwiLFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiR29vZ2xlJ3Mgc3RvY2sgcHJpY2Ugb3ZlciB0aW1lLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9zdG9ja3MuY3N2XCJ9LFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic3ltYm9sXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LHtcbiAgICAgICAgICAgIFwibWFya1wiOiB7XCJ0eXBlXCI6XCJwb2ludFwiLCBcImZpbGxlZFwiOiB0cnVlfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzeW1ib2xcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwiLCBcImxlZ2VuZFwiOiB7XCJvcmllbnRcIjogXCJsZWZ0XCJ9fVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgICBtb2RlbC5wYXJzZVNjYWxlKCk7XG4gICAgICBtb2RlbC5wYXJzZUxlZ2VuZCgpO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLmNvbXBvbmVudC5sZWdlbmRzLmNvbG9yLmV4cGxpY2l0Lm9yaWVudCwgJ2xlZnQnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgY29ycmVjdGx5IG1lcmdlIGxlZ2VuZCB0aGF0IGV4aXN0cyBvbmx5IG9uIG9uZSBwbG90JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUxheWVyTW9kZWwoe1xuICAgICAgICBcIiRzY2hlbWFcIjogXCJodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3NjaGVtYS92ZWdhLWxpdGUvdjIuanNvblwiLFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiR29vZ2xlJ3Mgc3RvY2sgcHJpY2Ugb3ZlciB0aW1lLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9zdG9ja3MuY3N2XCJ9LFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSx7XG4gICAgICAgICAgICBcIm1hcmtcIjoge1widHlwZVwiOlwicG9pbnRcIiwgXCJmaWxsZWRcIjogdHJ1ZX0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic3ltYm9sXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgICAgbW9kZWwucGFyc2VTY2FsZSgpO1xuICAgICAgbW9kZWwucGFyc2VMZWdlbmQoKTtcbiAgICAgIGFzc2VydC5pc09rKG1vZGVsLmNvbXBvbmVudC5sZWdlbmRzLmNvbG9yKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChtb2RlbC5jaGlsZHJlblswXS5jb21wb25lbnQubGVnZW5kcy5jb2xvcik7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQobW9kZWwuY2hpbGRyZW5bMV0uY29tcG9uZW50LmxlZ2VuZHMuY29sb3IpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19