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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9sZWdlbmQvcGFyc2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFDNUIsZ0RBQWlFO0FBQ2pFLCtEQUFpRTtBQUNqRSwyREFBOEQ7QUFDOUQsa0RBQWlEO0FBRWpELDBDQUEwQztBQUMxQyxtQ0FBb0U7QUFFcEUsUUFBUSxDQUFDLGdCQUFnQixFQUFFO0lBQ3pCLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtRQUM1QixFQUFFLENBQUMsZ0ZBQWdGLEVBQUU7WUFDbkYsSUFBTSxJQUFJLEdBQXVCO2dCQUMvQixNQUFNLEVBQUUsVUFBVTtnQkFDbEIsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFDO2dCQUNuQyxXQUFXLEVBQUU7b0JBQ1g7d0JBQ0UsUUFBUSxFQUFFLElBQUk7d0JBQ2QsTUFBTSxFQUFFOzRCQUNOLE1BQU0sRUFBRTtnQ0FDTixLQUFLLEVBQUUsa0JBQWtCO2dDQUN6QixRQUFRLEVBQUUsRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUM7NkJBQ3BEOzRCQUNELEtBQUssRUFBRSxJQUFJO3lCQUNaO3dCQUNELElBQUksRUFBRSxLQUFLO3FCQUNaO2lCQUNGO2dCQUNELFVBQVUsRUFBRTtvQkFDVixPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7aUJBQzdDO2FBQ0YsQ0FBQztZQUVGLElBQU0sU0FBUyxHQUFHLDhCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hELElBQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsZUFBSyxDQUFDLENBQUM7WUFDN0MsYUFBTSxDQUFDLE1BQU0sQ0FBQyxxQkFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDdEMs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QUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge0NPTE9SLCBPUEFDSVRZLCBTSEFQRSwgU0laRX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NoYW5uZWwnO1xuaW1wb3J0ICogYXMgbGVnZW5kUGFyc2UgZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvbGVnZW5kL3BhcnNlJztcbmltcG9ydCB7cGFyc2VMZWdlbmR9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2xlZ2VuZC9wYXJzZSc7XG5pbXBvcnQge2lzRmllbGREZWZ9IGZyb20gJy4uLy4uLy4uL3NyYy9maWVsZGRlZic7XG5pbXBvcnQge05vcm1hbGl6ZWRVbml0U3BlY30gZnJvbSAnLi4vLi4vLi4vc3JjL3NwZWMnO1xuaW1wb3J0IHtHRU9KU09OfSBmcm9tICcuLi8uLi8uLi9zcmMvdHlwZSc7XG5pbXBvcnQge3BhcnNlTGF5ZXJNb2RlbCwgcGFyc2VVbml0TW9kZWxXaXRoU2NhbGV9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnY29tcGlsZS9sZWdlbmQnLCBmdW5jdGlvbiAoKSB7XG4gIGRlc2NyaWJlKCdwYXJzZVVuaXRMZWdlbmQoKScsIGZ1bmN0aW9uICgpIHtcbiAgICBpdChgc2hvdWxkIG5vdCBwcm9kdWNlIGEgVmVnYSBsZWdlbmQgb2JqZWN0IG9uIGNoYW5uZWwgJ3NoYXBlJyB3aXRoIHR5cGUgJ2dlb2pzb24nYCwgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3Qgc3BlYzogTm9ybWFsaXplZFVuaXRTcGVjID0ge1xuICAgICAgICBcIm1hcmtcIjogXCJnZW9zaGFwZVwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9pbmNvbWUuanNvblwifSxcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibG9va3VwXCI6IFwiaWRcIixcbiAgICAgICAgICAgIFwiZnJvbVwiOiB7XG4gICAgICAgICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgICAgICAgXCJ1cmxcIjogXCJkYXRhL3VzLTEwbS5qc29uXCIsXG4gICAgICAgICAgICAgICAgXCJmb3JtYXRcIjoge1widHlwZVwiOiBcInRvcG9qc29uXCIsIFwiZmVhdHVyZVwiOiBcInN0YXRlc1wifVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcImtleVwiOiBcImlkXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImFzXCI6IFwiZ2VvXCJcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwic2hhcGVcIjoge1wiZmllbGRcIjogXCJnZW9cIiwgXCJ0eXBlXCI6IFwiZ2VvanNvblwifVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBjb25zdCB1bml0TW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZShzcGVjKTtcbiAgICAgIGNvbnN0IGNoYW5uZWxEZWYgPSB1bml0TW9kZWwuZW5jb2RpbmdbU0hBUEVdO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShpc0ZpZWxkRGVmKGNoYW5uZWxEZWYpKTtcbiAgICAgIGlmIChpc0ZpZWxkRGVmKGNoYW5uZWxEZWYpKSB7XG4gICAgICAgIGFzc2VydC5lcXVhbChjaGFubmVsRGVmLnR5cGUsIEdFT0pTT04pO1xuICAgICAgfVxuICAgICAgcGFyc2VMZWdlbmQodW5pdE1vZGVsKTtcbiAgICAgIGNvbnN0IGxlZ2VuZENvbXAgPSB1bml0TW9kZWwuY29tcG9uZW50LmxlZ2VuZHM7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQobGVnZW5kQ29tcFtTSEFQRV0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncGFyc2VMZWdlbmRGb3JDaGFubmVsKCknLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnc2hvdWxkIHByb2R1Y2UgYSBWZWdhIGxlZ2VuZCBvYmplY3Qgd2l0aCBjb3JyZWN0IHR5cGUgYW5kIHNjYWxlIGZvciBjb2xvcicsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6IFwiYVwiLCB0eXBlOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgY29sb3I6IHtmaWVsZDogXCJhXCIsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBkZWYgPSBsZWdlbmRQYXJzZS5wYXJzZUxlZ2VuZEZvckNoYW5uZWwobW9kZWwsIENPTE9SKS5jb21iaW5lKCk7XG4gICAgICBhc3NlcnQuaXNPYmplY3QoZGVmKTtcbiAgICAgIGFzc2VydC5lcXVhbChkZWYudGl0bGUsICdhJyk7XG4gICAgICBhc3NlcnQuZXF1YWwoZGVmLnN0cm9rZSwgJ2NvbG9yJyk7XG4gICAgICBhc3NlcnQuZXF1YWwoZGVmLnR5cGUsICdncmFkaWVudCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIG5vIGxlZ2VuZCB0aXRsZSB3aGVuIHRpdGxlIGlzIG51bGwsIFwiXCIsIG9yIGZhbHNlJywgZnVuY3Rpb24oKSB7XG4gICAgICBmb3IgKGNvbnN0IHZhbCBvZiBbbnVsbCwgJycsIGZhbHNlXSkge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogXCJhXCIsIHR5cGU6IFwibm9taW5hbFwifSxcbiAgICAgICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgICAgIGZpZWxkOiBcImFcIiwgdHlwZTogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgbGVnZW5kOiB7dGl0bGU6IHZhbCBhcyBhbnl9IC8vIE5lZWQgdG8gY2FzdCBhcyBmYWxzZSBpcyBub3QgdmFsaWQsIGJ1dCB3ZSB3YW50IHRvIGZhbGwgYmFjayBncmFjZWZ1bGx5XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBkZWYgPSBsZWdlbmRQYXJzZS5wYXJzZUxlZ2VuZEZvckNoYW5uZWwobW9kZWwsIENPTE9SKS5jb21iaW5lKCk7XG4gICAgICAgIGFzc2VydC5kb2VzTm90SGF2ZUFueUtleXMoZGVmLCBbJ3RpdGxlJ10pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgW1NJWkUsIFNIQVBFLCBPUEFDSVRZXS5mb3JFYWNoKGNoYW5uZWwgPT4ge1xuICAgICAgaXQoYHNob3VsZCBwcm9kdWNlIGEgVmVnYSBsZWdlbmQgb2JqZWN0IHdpdGggY29ycmVjdCB0eXBlIGFuZCBzY2FsZSBmb3IgJHtjaGFubmVsfWAsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBzcGVjOiBOb3JtYWxpemVkVW5pdFNwZWMgPSB7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6IFwiYVwiLCB0eXBlOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHNwZWMuZW5jb2RpbmdbY2hhbm5lbF0gPSB7ZmllbGQ6IFwiYVwiLCB0eXBlOiBcIm5vbWluYWxcIn07XG5cbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZShzcGVjKTtcblxuICAgICAgICBjb25zdCBkZWYgPSBsZWdlbmRQYXJzZS5wYXJzZUxlZ2VuZEZvckNoYW5uZWwobW9kZWwsIGNoYW5uZWwpLmNvbWJpbmUoKTtcblxuICAgICAgICBjb25zdCBjaGFubmVsRGVmID0gbW9kZWwuZW5jb2RpbmdbY2hhbm5lbF07XG4gICAgICAgIGlmIChpc0ZpZWxkRGVmKGNoYW5uZWxEZWYpKSB7XG4gICAgICAgICAgYXNzZXJ0Lm5vdEVxdWFsKGNoYW5uZWxEZWYudHlwZSwgR0VPSlNPTik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2hhbm5lbCAhPT0gT1BBQ0lUWSkge1xuICAgICAgICAgIGFzc2VydC5lcXVhbChkZWYuZW5jb2RlLnN5bWJvbHMudXBkYXRlLm9wYWNpdHkudmFsdWUsIDAuNyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKGRlZi5lbmNvZGUuc3ltYm9scy51cGRhdGUub3BhY2l0eSk7XG4gICAgICAgIH1cbiAgICAgICAgYXNzZXJ0LmlzT2JqZWN0KGRlZik7XG4gICAgICAgIGFzc2VydC5lcXVhbChkZWYudGl0bGUsIFwiYVwiKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncGFyc2VOb25Vbml0TGVnZW5kKCknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjb3JyZWN0bHkgbWVyZ2Ugb3JpZW50IGJ5IGZhdm9yaW5nIGV4cGxpY2l0IG9yaWVudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VMYXllck1vZGVsKHtcbiAgICAgICAgXCIkc2NoZW1hXCI6IFwiaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby9zY2hlbWEvdmVnYS1saXRlL3YyLmpzb25cIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkdvb2dsZSdzIHN0b2NrIHByaWNlIG92ZXIgdGltZS5cIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc3RvY2tzLmNzdlwifSxcbiAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInByaWNlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInN5bWJvbFwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSx7XG4gICAgICAgICAgICBcIm1hcmtcIjoge1widHlwZVwiOlwicG9pbnRcIiwgXCJmaWxsZWRcIjogdHJ1ZX0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic3ltYm9sXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIiwgXCJsZWdlbmRcIjoge1wib3JpZW50XCI6IFwibGVmdFwifX1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgICAgbW9kZWwucGFyc2VTY2FsZSgpO1xuICAgICAgbW9kZWwucGFyc2VMZWdlbmQoKTtcbiAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5jb21wb25lbnQubGVnZW5kcy5jb2xvci5leHBsaWNpdC5vcmllbnQsICdsZWZ0Jyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGNvcnJlY3RseSBtZXJnZSBsZWdlbmQgdGhhdCBleGlzdHMgb25seSBvbiBvbmUgcGxvdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VMYXllck1vZGVsKHtcbiAgICAgICAgXCIkc2NoZW1hXCI6IFwiaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby9zY2hlbWEvdmVnYS1saXRlL3YyLmpzb25cIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkdvb2dsZSdzIHN0b2NrIHByaWNlIG92ZXIgdGltZS5cIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc3RvY2tzLmNzdlwifSxcbiAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInByaWNlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0se1xuICAgICAgICAgICAgXCJtYXJrXCI6IHtcInR5cGVcIjpcInBvaW50XCIsIFwiZmlsbGVkXCI6IHRydWV9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInByaWNlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInN5bWJvbFwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICAgIG1vZGVsLnBhcnNlU2NhbGUoKTtcbiAgICAgIG1vZGVsLnBhcnNlTGVnZW5kKCk7XG4gICAgICBhc3NlcnQuaXNPayhtb2RlbC5jb21wb25lbnQubGVnZW5kcy5jb2xvcik7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQobW9kZWwuY2hpbGRyZW5bMF0uY29tcG9uZW50LmxlZ2VuZHMuY29sb3IpO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKG1vZGVsLmNoaWxkcmVuWzFdLmNvbXBvbmVudC5sZWdlbmRzLmNvbG9yKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==