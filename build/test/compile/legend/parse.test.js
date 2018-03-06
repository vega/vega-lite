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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9sZWdlbmQvcGFyc2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFDNUIsZ0RBQWlFO0FBQ2pFLCtEQUFpRTtBQUNqRSwyREFBOEQ7QUFDOUQsa0RBQWlEO0FBRWpELDBDQUEwQztBQUMxQyxtQ0FBb0U7QUFFcEUsUUFBUSxDQUFDLGdCQUFnQixFQUFFO0lBQ3pCLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtRQUM1QixFQUFFLENBQUMsZ0ZBQWdGLEVBQUU7WUFDbkYsSUFBTSxJQUFJLEdBQWE7Z0JBQ3JCLE1BQU0sRUFBRSxVQUFVO2dCQUNsQixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUM7Z0JBQ25DLFdBQVcsRUFBRTtvQkFDWDt3QkFDRSxRQUFRLEVBQUUsSUFBSTt3QkFDZCxNQUFNLEVBQUU7NEJBQ04sTUFBTSxFQUFFO2dDQUNOLEtBQUssRUFBRSxrQkFBa0I7Z0NBQ3pCLFFBQVEsRUFBRSxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBQzs2QkFDcEQ7NEJBQ0QsS0FBSyxFQUFFLElBQUk7eUJBQ1o7d0JBQ0QsSUFBSSxFQUFFLEtBQUs7cUJBQ1o7aUJBQ0Y7Z0JBQ0QsVUFBVSxFQUFFO29CQUNWLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztpQkFDN0M7YUFDRixDQUFDO1lBRUYsSUFBTSxTQUFTLEdBQUcsOEJBQXVCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEQsSUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxlQUFLLENBQUMsQ0FBQztZQUM3QyxhQUFNLENBQUMsTUFBTSxDQUFDLHFCQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUN0QyxF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QyxLQUFLLENBQUMsQ0FBQztRQUNoRSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtDT0xPUiwgT1BBQ0lUWSwgU0hBUEUsIFNJWkV9IGZyb20gJy4uLy4uLy4uL3NyYy9jaGFubmVsJztcbmltcG9ydCAqIGFzIGxlZ2VuZFBhcnNlIGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2xlZ2VuZC9wYXJzZSc7XG5pbXBvcnQge3BhcnNlTGVnZW5kfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9sZWdlbmQvcGFyc2UnO1xuaW1wb3J0IHtpc0ZpZWxkRGVmfSBmcm9tICcuLi8uLi8uLi9zcmMvZmllbGRkZWYnO1xuaW1wb3J0IHtVbml0U3BlY30gZnJvbSAnLi4vLi4vLi4vc3JjL3NwZWMnO1xuaW1wb3J0IHtHRU9KU09OfSBmcm9tICcuLi8uLi8uLi9zcmMvdHlwZSc7XG5pbXBvcnQge3BhcnNlTGF5ZXJNb2RlbCwgcGFyc2VVbml0TW9kZWxXaXRoU2NhbGV9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnY29tcGlsZS9sZWdlbmQnLCBmdW5jdGlvbiAoKSB7XG4gIGRlc2NyaWJlKCdwYXJzZVVuaXRMZWdlbmQoKScsIGZ1bmN0aW9uICgpIHtcbiAgICBpdChgc2hvdWxkIG5vdCBwcm9kdWNlIGEgVmVnYSBsZWdlbmQgb2JqZWN0IG9uIGNoYW5uZWwgJ3NoYXBlJyB3aXRoIHR5cGUgJ2dlb2pzb24nYCwgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3Qgc3BlYzogVW5pdFNwZWMgPSB7XG4gICAgICAgIFwibWFya1wiOiBcImdlb3NoYXBlXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2luY29tZS5qc29uXCJ9LFxuICAgICAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJsb29rdXBcIjogXCJpZFwiLFxuICAgICAgICAgICAgXCJmcm9tXCI6IHtcbiAgICAgICAgICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgICAgICAgICBcInVybFwiOiBcImRhdGEvdXMtMTBtLmpzb25cIixcbiAgICAgICAgICAgICAgICBcImZvcm1hdFwiOiB7XCJ0eXBlXCI6IFwidG9wb2pzb25cIiwgXCJmZWF0dXJlXCI6IFwic3RhdGVzXCJ9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwia2V5XCI6IFwiaWRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiYXNcIjogXCJnZW9cIlxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJzaGFwZVwiOiB7XCJmaWVsZFwiOiBcImdlb1wiLCBcInR5cGVcIjogXCJnZW9qc29uXCJ9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHVuaXRNb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHNwZWMpO1xuICAgICAgY29uc3QgY2hhbm5lbERlZiA9IHVuaXRNb2RlbC5lbmNvZGluZ1tTSEFQRV07XG4gICAgICBhc3NlcnQuaXNUcnVlKGlzRmllbGREZWYoY2hhbm5lbERlZikpO1xuICAgICAgaWYgKGlzRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGNoYW5uZWxEZWYudHlwZSwgR0VPSlNPTik7XG4gICAgICB9XG4gICAgICBwYXJzZUxlZ2VuZCh1bml0TW9kZWwpO1xuICAgICAgY29uc3QgbGVnZW5kQ29tcCA9IHVuaXRNb2RlbC5jb21wb25lbnQubGVnZW5kcztcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChsZWdlbmRDb21wW1NIQVBFXSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdwYXJzZUxlZ2VuZEZvckNoYW5uZWwoKScsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdzaG91bGQgcHJvZHVjZSBhIFZlZ2EgbGVnZW5kIG9iamVjdCB3aXRoIGNvcnJlY3QgdHlwZSBhbmQgc2NhbGUgZm9yIGNvbG9yJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogXCJhXCIsIHR5cGU6IFwibm9taW5hbFwifSxcbiAgICAgICAgICBjb2xvcjoge2ZpZWxkOiBcImFcIiwgdHlwZTogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGRlZiA9IGxlZ2VuZFBhcnNlLnBhcnNlTGVnZW5kRm9yQ2hhbm5lbChtb2RlbCwgQ09MT1IpLmNvbWJpbmUoKTtcbiAgICAgIGFzc2VydC5pc09iamVjdChkZWYpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGRlZi50aXRsZSwgJ2EnKTtcbiAgICAgIGFzc2VydC5lcXVhbChkZWYuc3Ryb2tlLCAnY29sb3InKTtcbiAgICAgIGFzc2VydC5lcXVhbChkZWYudHlwZSwgJ2dyYWRpZW50Jyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHByb2R1Y2Ugbm8gbGVnZW5kIHRpdGxlIHdoZW4gdGl0bGUgaXMgbnVsbCwgXCJcIiwgb3IgZmFsc2UnLCBmdW5jdGlvbigpIHtcbiAgICAgIGZvciAoY29uc3QgdmFsIG9mIFtudWxsLCAnJywgZmFsc2VdKSB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiBcImFcIiwgdHlwZTogXCJub21pbmFsXCJ9LFxuICAgICAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICAgICAgZmllbGQ6IFwiYVwiLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICBsZWdlbmQ6IHt0aXRsZTogdmFsIGFzIGFueX0gLy8gTmVlZCB0byBjYXN0IGFzIGZhbHNlIGlzIG5vdCB2YWxpZCwgYnV0IHdlIHdhbnQgdG8gZmFsbCBiYWNrIGdyYWNlZnVsbHlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGRlZiA9IGxlZ2VuZFBhcnNlLnBhcnNlTGVnZW5kRm9yQ2hhbm5lbChtb2RlbCwgQ09MT1IpLmNvbWJpbmUoKTtcbiAgICAgICAgYXNzZXJ0LmRvZXNOb3RIYXZlQW55S2V5cyhkZWYsIFsndGl0bGUnXSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBbU0laRSwgU0hBUEUsIE9QQUNJVFldLmZvckVhY2goY2hhbm5lbCA9PiB7XG4gICAgICBpdChgc2hvdWxkIHByb2R1Y2UgYSBWZWdhIGxlZ2VuZCBvYmplY3Qgd2l0aCBjb3JyZWN0IHR5cGUgYW5kIHNjYWxlIGZvciAke2NoYW5uZWx9YCwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHNwZWM6IFVuaXRTcGVjID0ge1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiBcImFcIiwgdHlwZTogXCJub21pbmFsXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBzcGVjLmVuY29kaW5nW2NoYW5uZWxdID0ge2ZpZWxkOiBcImFcIiwgdHlwZTogXCJub21pbmFsXCJ9O1xuXG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoc3BlYyk7XG5cbiAgICAgICAgY29uc3QgZGVmID0gbGVnZW5kUGFyc2UucGFyc2VMZWdlbmRGb3JDaGFubmVsKG1vZGVsLCBjaGFubmVsKS5jb21iaW5lKCk7XG5cbiAgICAgICAgY29uc3QgY2hhbm5lbERlZiA9IG1vZGVsLmVuY29kaW5nW2NoYW5uZWxdO1xuICAgICAgICBpZiAoaXNGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgICAgICAgIGFzc2VydC5ub3RFcXVhbChjaGFubmVsRGVmLnR5cGUsIEdFT0pTT04pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNoYW5uZWwgIT09IE9QQUNJVFkpIHtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZGVmLmVuY29kZS5zeW1ib2xzLnVwZGF0ZS5vcGFjaXR5LnZhbHVlLCAwLjcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChkZWYuZW5jb2RlLnN5bWJvbHMudXBkYXRlLm9wYWNpdHkpO1xuICAgICAgICB9XG4gICAgICAgIGFzc2VydC5pc09iamVjdChkZWYpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoZGVmLnRpdGxlLCBcImFcIik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3BhcnNlTm9uVW5pdExlZ2VuZCgpJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY29ycmVjdGx5IG1lcmdlIG9yaWVudCBieSBmYXZvcmluZyBleHBsaWNpdCBvcmllbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlTGF5ZXJNb2RlbCh7XG4gICAgICAgIFwiJHNjaGVtYVwiOiBcImh0dHBzOi8vdmVnYS5naXRodWIuaW8vc2NoZW1hL3ZlZ2EtbGl0ZS92Mi5qc29uXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJHb29nbGUncyBzdG9jayBwcmljZSBvdmVyIHRpbWUuXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3N0b2Nrcy5jc3ZcIn0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcImxpbmVcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzeW1ib2xcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0se1xuICAgICAgICAgICAgXCJtYXJrXCI6IHtcInR5cGVcIjpcInBvaW50XCIsIFwiZmlsbGVkXCI6IHRydWV9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInByaWNlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInN5bWJvbFwiLCBcInR5cGVcIjogXCJub21pbmFsXCIsIFwibGVnZW5kXCI6IHtcIm9yaWVudFwiOiBcImxlZnRcIn19XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICAgIG1vZGVsLnBhcnNlU2NhbGUoKTtcbiAgICAgIG1vZGVsLnBhcnNlTGVnZW5kKCk7XG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwuY29tcG9uZW50LmxlZ2VuZHMuY29sb3IuZXhwbGljaXQub3JpZW50LCAnbGVmdCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBjb3JyZWN0bHkgbWVyZ2UgbGVnZW5kIHRoYXQgZXhpc3RzIG9ubHkgb24gb25lIHBsb3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlTGF5ZXJNb2RlbCh7XG4gICAgICAgIFwiJHNjaGVtYVwiOiBcImh0dHBzOi8vdmVnYS5naXRodWIuaW8vc2NoZW1hL3ZlZ2EtbGl0ZS92Mi5qc29uXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJHb29nbGUncyBzdG9jayBwcmljZSBvdmVyIHRpbWUuXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3N0b2Nrcy5jc3ZcIn0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcImxpbmVcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LHtcbiAgICAgICAgICAgIFwibWFya1wiOiB7XCJ0eXBlXCI6XCJwb2ludFwiLCBcImZpbGxlZFwiOiB0cnVlfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzeW1ib2xcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgICBtb2RlbC5wYXJzZVNjYWxlKCk7XG4gICAgICBtb2RlbC5wYXJzZUxlZ2VuZCgpO1xuICAgICAgYXNzZXJ0LmlzT2sobW9kZWwuY29tcG9uZW50LmxlZ2VuZHMuY29sb3IpO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKG1vZGVsLmNoaWxkcmVuWzBdLmNvbXBvbmVudC5sZWdlbmRzLmNvbG9yKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChtb2RlbC5jaGlsZHJlblsxXS5jb21wb25lbnQubGVnZW5kcy5jb2xvcik7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=