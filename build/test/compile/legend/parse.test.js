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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9sZWdlbmQvcGFyc2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFDNUIsZ0RBQWlFO0FBQ2pFLCtEQUFpRTtBQUNqRSwyREFBOEQ7QUFDOUQsa0RBQWlEO0FBRWpELDBDQUEwQztBQUMxQyxtQ0FBb0U7QUFFcEUsUUFBUSxDQUFDLGdCQUFnQixFQUFFO0lBQ3pCLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtRQUM1QixFQUFFLENBQUMsZ0ZBQWdGLEVBQUU7WUFDbkYsSUFBTSxJQUFJLEdBQXVCO2dCQUMvQixNQUFNLEVBQUUsVUFBVTtnQkFDbEIsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFDO2dCQUNuQyxXQUFXLEVBQUU7b0JBQ1g7d0JBQ0UsUUFBUSxFQUFFLElBQUk7d0JBQ2QsTUFBTSxFQUFFOzRCQUNOLE1BQU0sRUFBRTtnQ0FDTixLQUFLLEVBQUUsa0JBQWtCO2dDQUN6QixRQUFRLEVBQUUsRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUM7NkJBQ3BEOzRCQUNELEtBQUssRUFBRSxJQUFJO3lCQUNaO3dCQUNELElBQUksRUFBRSxLQUFLO3FCQUNaO2lCQUNGO2dCQUNELFVBQVUsRUFBRTtvQkFDVixPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7aUJBQzdDO2FBQ0YsQ0FBQztZQUVGLElBQU0sU0FBUyxHQUFHLDhCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hELElBQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsZUFBSyxDQUFDLENBQUM7WUFDN0MsYUFBTSxDQUFDLE1BQU0sQ0FBQyxxQkFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDdEMs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c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtDT0xPUiwgT1BBQ0lUWSwgU0hBUEUsIFNJWkV9IGZyb20gJy4uLy4uLy4uL3NyYy9jaGFubmVsJztcbmltcG9ydCAqIGFzIGxlZ2VuZFBhcnNlIGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2xlZ2VuZC9wYXJzZSc7XG5pbXBvcnQge3BhcnNlTGVnZW5kfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9sZWdlbmQvcGFyc2UnO1xuaW1wb3J0IHtpc0ZpZWxkRGVmfSBmcm9tICcuLi8uLi8uLi9zcmMvZmllbGRkZWYnO1xuaW1wb3J0IHtOb3JtYWxpemVkVW5pdFNwZWN9IGZyb20gJy4uLy4uLy4uL3NyYy9zcGVjJztcbmltcG9ydCB7R0VPSlNPTn0gZnJvbSAnLi4vLi4vLi4vc3JjL3R5cGUnO1xuaW1wb3J0IHtwYXJzZUxheWVyTW9kZWwsIHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlfSBmcm9tICcuLi8uLi91dGlsJztcblxuZGVzY3JpYmUoJ2NvbXBpbGUvbGVnZW5kJywgZnVuY3Rpb24gKCkge1xuICBkZXNjcmliZSgncGFyc2VVbml0TGVnZW5kKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgaXQoYHNob3VsZCBub3QgcHJvZHVjZSBhIFZlZ2EgbGVnZW5kIG9iamVjdCBvbiBjaGFubmVsICdzaGFwZScgd2l0aCB0eXBlICdnZW9qc29uJ2AsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IHNwZWM6IE5vcm1hbGl6ZWRVbml0U3BlYyA9IHtcbiAgICAgICAgXCJtYXJrXCI6IFwiZ2Vvc2hhcGVcIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvaW5jb21lLmpzb25cIn0sXG4gICAgICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImxvb2t1cFwiOiBcImlkXCIsXG4gICAgICAgICAgICBcImZyb21cIjoge1xuICAgICAgICAgICAgICBcImRhdGFcIjoge1xuICAgICAgICAgICAgICAgIFwidXJsXCI6IFwiZGF0YS91cy0xMG0uanNvblwiLFxuICAgICAgICAgICAgICAgIFwiZm9ybWF0XCI6IHtcInR5cGVcIjogXCJ0b3BvanNvblwiLCBcImZlYXR1cmVcIjogXCJzdGF0ZXNcIn1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJrZXlcIjogXCJpZFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJhc1wiOiBcImdlb1wiXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInNoYXBlXCI6IHtcImZpZWxkXCI6IFwiZ2VvXCIsIFwidHlwZVwiOiBcImdlb2pzb25cIn1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgY29uc3QgdW5pdE1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoc3BlYyk7XG4gICAgICBjb25zdCBjaGFubmVsRGVmID0gdW5pdE1vZGVsLmVuY29kaW5nW1NIQVBFXTtcbiAgICAgIGFzc2VydC5pc1RydWUoaXNGaWVsZERlZihjaGFubmVsRGVmKSk7XG4gICAgICBpZiAoaXNGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgICAgICBhc3NlcnQuZXF1YWwoY2hhbm5lbERlZi50eXBlLCBHRU9KU09OKTtcbiAgICAgIH1cbiAgICAgIHBhcnNlTGVnZW5kKHVuaXRNb2RlbCk7XG4gICAgICBjb25zdCBsZWdlbmRDb21wID0gdW5pdE1vZGVsLmNvbXBvbmVudC5sZWdlbmRzO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKGxlZ2VuZENvbXBbU0hBUEVdKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3BhcnNlTGVnZW5kRm9yQ2hhbm5lbCgpJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIGEgVmVnYSBsZWdlbmQgb2JqZWN0IHdpdGggY29ycmVjdCB0eXBlIGFuZCBzY2FsZSBmb3IgY29sb3InLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiBcImFcIiwgdHlwZTogXCJub21pbmFsXCJ9LFxuICAgICAgICAgIGNvbG9yOiB7ZmllbGQ6IFwiYVwiLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgZGVmID0gbGVnZW5kUGFyc2UucGFyc2VMZWdlbmRGb3JDaGFubmVsKG1vZGVsLCBDT0xPUikuY29tYmluZSgpO1xuICAgICAgYXNzZXJ0LmlzT2JqZWN0KGRlZik7XG4gICAgICBhc3NlcnQuZXF1YWwoZGVmLnRpdGxlLCAnYScpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGRlZi5zdHJva2UsICdjb2xvcicpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGRlZi50eXBlLCAnZ3JhZGllbnQnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcHJvZHVjZSBubyBsZWdlbmQgdGl0bGUgd2hlbiB0aXRsZSBpcyBudWxsLCBcIlwiLCBvciBmYWxzZScsIGZ1bmN0aW9uKCkge1xuICAgICAgZm9yIChjb25zdCB2YWwgb2YgW251bGwsICcnLCBmYWxzZV0pIHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6IFwiYVwiLCB0eXBlOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgICBjb2xvcjoge1xuICAgICAgICAgICAgICBmaWVsZDogXCJhXCIsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgIGxlZ2VuZDoge3RpdGxlOiB2YWwgYXMgYW55fSAvLyBOZWVkIHRvIGNhc3QgYXMgZmFsc2UgaXMgbm90IHZhbGlkLCBidXQgd2Ugd2FudCB0byBmYWxsIGJhY2sgZ3JhY2VmdWxseVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgZGVmID0gbGVnZW5kUGFyc2UucGFyc2VMZWdlbmRGb3JDaGFubmVsKG1vZGVsLCBDT0xPUikuY29tYmluZSgpO1xuICAgICAgICBhc3NlcnQuZG9lc05vdEhhdmVBbnlLZXlzKGRlZiwgWyd0aXRsZSddKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIFtTSVpFLCBTSEFQRSwgT1BBQ0lUWV0uZm9yRWFjaChjaGFubmVsID0+IHtcbiAgICAgIGl0KGBzaG91bGQgcHJvZHVjZSBhIFZlZ2EgbGVnZW5kIG9iamVjdCB3aXRoIGNvcnJlY3QgdHlwZSBhbmQgc2NhbGUgZm9yICR7Y2hhbm5lbH1gLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3Qgc3BlYzogTm9ybWFsaXplZFVuaXRTcGVjID0ge1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiBcImFcIiwgdHlwZTogXCJub21pbmFsXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBzcGVjLmVuY29kaW5nW2NoYW5uZWxdID0ge2ZpZWxkOiBcImFcIiwgdHlwZTogXCJub21pbmFsXCJ9O1xuXG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoc3BlYyk7XG5cbiAgICAgICAgY29uc3QgZGVmID0gbGVnZW5kUGFyc2UucGFyc2VMZWdlbmRGb3JDaGFubmVsKG1vZGVsLCBjaGFubmVsKS5jb21iaW5lKCk7XG5cbiAgICAgICAgY29uc3QgY2hhbm5lbERlZiA9IG1vZGVsLmVuY29kaW5nW2NoYW5uZWxdO1xuICAgICAgICBpZiAoaXNGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgICAgICAgIGFzc2VydC5ub3RFcXVhbChjaGFubmVsRGVmLnR5cGUsIEdFT0pTT04pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNoYW5uZWwgIT09IE9QQUNJVFkpIHtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZGVmLmVuY29kZS5zeW1ib2xzLnVwZGF0ZS5vcGFjaXR5LnZhbHVlLCAwLjcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChkZWYuZW5jb2RlLnN5bWJvbHMudXBkYXRlLm9wYWNpdHkpO1xuICAgICAgICB9XG4gICAgICAgIGFzc2VydC5pc09iamVjdChkZWYpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoZGVmLnRpdGxlLCBcImFcIik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3BhcnNlTm9uVW5pdExlZ2VuZCgpJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY29ycmVjdGx5IG1lcmdlIG9yaWVudCBieSBmYXZvcmluZyBleHBsaWNpdCBvcmllbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlTGF5ZXJNb2RlbCh7XG4gICAgICAgIFwiJHNjaGVtYVwiOiBcImh0dHBzOi8vdmVnYS5naXRodWIuaW8vc2NoZW1hL3ZlZ2EtbGl0ZS92Mi5qc29uXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJHb29nbGUncyBzdG9jayBwcmljZSBvdmVyIHRpbWUuXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3N0b2Nrcy5jc3ZcIn0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcImxpbmVcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzeW1ib2xcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0se1xuICAgICAgICAgICAgXCJtYXJrXCI6IHtcInR5cGVcIjpcInBvaW50XCIsIFwiZmlsbGVkXCI6IHRydWV9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInByaWNlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInN5bWJvbFwiLCBcInR5cGVcIjogXCJub21pbmFsXCIsIFwibGVnZW5kXCI6IHtcIm9yaWVudFwiOiBcImxlZnRcIn19XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICAgIG1vZGVsLnBhcnNlU2NhbGUoKTtcbiAgICAgIG1vZGVsLnBhcnNlTGVnZW5kKCk7XG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwuY29tcG9uZW50LmxlZ2VuZHMuY29sb3IuZXhwbGljaXQub3JpZW50LCAnbGVmdCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBjb3JyZWN0bHkgbWVyZ2UgbGVnZW5kIHRoYXQgZXhpc3RzIG9ubHkgb24gb25lIHBsb3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlTGF5ZXJNb2RlbCh7XG4gICAgICAgIFwiJHNjaGVtYVwiOiBcImh0dHBzOi8vdmVnYS5naXRodWIuaW8vc2NoZW1hL3ZlZ2EtbGl0ZS92Mi5qc29uXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJHb29nbGUncyBzdG9jayBwcmljZSBvdmVyIHRpbWUuXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3N0b2Nrcy5jc3ZcIn0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcImxpbmVcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LHtcbiAgICAgICAgICAgIFwibWFya1wiOiB7XCJ0eXBlXCI6XCJwb2ludFwiLCBcImZpbGxlZFwiOiB0cnVlfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzeW1ib2xcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgICBtb2RlbC5wYXJzZVNjYWxlKCk7XG4gICAgICBtb2RlbC5wYXJzZUxlZ2VuZCgpO1xuICAgICAgYXNzZXJ0LmlzT2sobW9kZWwuY29tcG9uZW50LmxlZ2VuZHMuY29sb3IpO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKG1vZGVsLmNoaWxkcmVuWzBdLmNvbXBvbmVudC5sZWdlbmRzLmNvbG9yKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChtb2RlbC5jaGlsZHJlblsxXS5jb21wb25lbnQubGVnZW5kcy5jb2xvcik7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=