"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var legendParse = require("../../../src/compile/legend/parse");
var util_1 = require("../../util");
describe('compile/legend', function () {
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
        [channel_1.SIZE, channel_1.SHAPE, channel_1.OPACITY].forEach(function (channel) {
            it("should produce a Vega legend object with correct type and scale for " + channel, function () {
                var s = {
                    mark: "point",
                    encoding: {
                        x: { field: "a", type: "nominal" }
                    }
                };
                s.encoding[channel] = { field: "a", type: "nominal" };
                var model = util_1.parseUnitModelWithScale(s);
                var def = legendParse.parseLegendForChannel(model, channel).combine();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9sZWdlbmQvcGFyc2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFDNUIsZ0RBQWlFO0FBQ2pFLCtEQUFpRTtBQUVqRSxtQ0FBb0U7QUFFcEUsUUFBUSxDQUFDLGdCQUFnQixFQUFFO0lBQ3pCLFFBQVEsQ0FBQyx5QkFBeUIsRUFBRTtRQUNsQyxFQUFFLENBQUMsMkVBQTJFLEVBQUU7WUFDOUUsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUM7Z0JBQ3BDLElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7b0JBQ2hDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztpQkFDMUM7YUFDRixDQUFDLENBQUM7WUFFSCxJQUFNLEdBQUcsR0FBRyxXQUFXLENBQUMscUJBQXFCLENBQUMsS0FBSyxFQUFFLGVBQUssQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3RFLGFBQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDckIsYUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQzdCLGFBQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNsQyxhQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7UUFFSCxDQUFDLGNBQUksRUFBRSxlQUFLLEVBQUUsaUJBQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLE9BQU87WUFDcEMs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S0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge0NPTE9SLCBPUEFDSVRZLCBTSEFQRSwgU0laRX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NoYW5uZWwnO1xuaW1wb3J0ICogYXMgbGVnZW5kUGFyc2UgZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvbGVnZW5kL3BhcnNlJztcbmltcG9ydCB7VW5pdFNwZWN9IGZyb20gJy4uLy4uLy4uL3NyYy9zcGVjJztcbmltcG9ydCB7cGFyc2VMYXllck1vZGVsLCBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdjb21waWxlL2xlZ2VuZCcsIGZ1bmN0aW9uKCkge1xuICBkZXNjcmliZSgncGFyc2VMZWdlbmRGb3JDaGFubmVsKCknLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnc2hvdWxkIHByb2R1Y2UgYSBWZWdhIGxlZ2VuZCBvYmplY3Qgd2l0aCBjb3JyZWN0IHR5cGUgYW5kIHNjYWxlIGZvciBjb2xvcicsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6IFwiYVwiLCB0eXBlOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgY29sb3I6IHtmaWVsZDogXCJhXCIsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBkZWYgPSBsZWdlbmRQYXJzZS5wYXJzZUxlZ2VuZEZvckNoYW5uZWwobW9kZWwsIENPTE9SKS5jb21iaW5lKCk7XG4gICAgICBhc3NlcnQuaXNPYmplY3QoZGVmKTtcbiAgICAgIGFzc2VydC5lcXVhbChkZWYudGl0bGUsICdhJyk7XG4gICAgICBhc3NlcnQuZXF1YWwoZGVmLnN0cm9rZSwgJ2NvbG9yJyk7XG4gICAgICBhc3NlcnQuZXF1YWwoZGVmLnR5cGUsICdncmFkaWVudCcpO1xuICAgIH0pO1xuXG4gICAgW1NJWkUsIFNIQVBFLCBPUEFDSVRZXS5mb3JFYWNoKGNoYW5uZWwgPT4ge1xuICAgICAgaXQoYHNob3VsZCBwcm9kdWNlIGEgVmVnYSBsZWdlbmQgb2JqZWN0IHdpdGggY29ycmVjdCB0eXBlIGFuZCBzY2FsZSBmb3IgJHtjaGFubmVsfWAsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBzOiBVbml0U3BlYyA9IHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogXCJhXCIsIHR5cGU6IFwibm9taW5hbFwifVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcy5lbmNvZGluZ1tjaGFubmVsXSA9IHtmaWVsZDogXCJhXCIsIHR5cGU6IFwibm9taW5hbFwifTtcblxuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHMpO1xuXG4gICAgICAgIGNvbnN0IGRlZiA9IGxlZ2VuZFBhcnNlLnBhcnNlTGVnZW5kRm9yQ2hhbm5lbChtb2RlbCwgY2hhbm5lbCkuY29tYmluZSgpO1xuXG4gICAgICAgIGlmIChjaGFubmVsICE9PSBPUEFDSVRZKSB7XG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGRlZi5lbmNvZGUuc3ltYm9scy51cGRhdGUub3BhY2l0eS52YWx1ZSwgMC43KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhc3NlcnQuaXNVbmRlZmluZWQoZGVmLmVuY29kZS5zeW1ib2xzLnVwZGF0ZS5vcGFjaXR5KTtcbiAgICAgICAgfVxuICAgICAgICBhc3NlcnQuaXNPYmplY3QoZGVmKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGRlZi50aXRsZSwgXCJhXCIpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdwYXJzZU5vblVuaXRMZWdlbmQoKScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNvcnJlY3RseSBtZXJnZSBvcmllbnQgYnkgZmF2b3JpbmcgZXhwbGljaXQgb3JpZW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUxheWVyTW9kZWwoe1xuICAgICAgICBcIiRzY2hlbWFcIjogXCJodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3NjaGVtYS92ZWdhLWxpdGUvdjIuanNvblwiLFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiR29vZ2xlJ3Mgc3RvY2sgcHJpY2Ugb3ZlciB0aW1lLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9zdG9ja3MuY3N2XCJ9LFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic3ltYm9sXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LHtcbiAgICAgICAgICAgIFwibWFya1wiOiB7XCJ0eXBlXCI6XCJwb2ludFwiLCBcImZpbGxlZFwiOiB0cnVlfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzeW1ib2xcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwiLCBcImxlZ2VuZFwiOiB7XCJvcmllbnRcIjogXCJsZWZ0XCJ9fVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgICBtb2RlbC5wYXJzZVNjYWxlKCk7XG4gICAgICBtb2RlbC5wYXJzZUxlZ2VuZCgpO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLmNvbXBvbmVudC5sZWdlbmRzLmNvbG9yLmV4cGxpY2l0Lm9yaWVudCwgJ2xlZnQnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgY29ycmVjdGx5IG1lcmdlIGxlZ2VuZCB0aGF0IGV4aXN0cyBvbmx5IG9uIG9uZSBwbG90JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUxheWVyTW9kZWwoe1xuICAgICAgICBcIiRzY2hlbWFcIjogXCJodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3NjaGVtYS92ZWdhLWxpdGUvdjIuanNvblwiLFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiR29vZ2xlJ3Mgc3RvY2sgcHJpY2Ugb3ZlciB0aW1lLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9zdG9ja3MuY3N2XCJ9LFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSx7XG4gICAgICAgICAgICBcIm1hcmtcIjoge1widHlwZVwiOlwicG9pbnRcIiwgXCJmaWxsZWRcIjogdHJ1ZX0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic3ltYm9sXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgICAgbW9kZWwucGFyc2VTY2FsZSgpO1xuICAgICAgbW9kZWwucGFyc2VMZWdlbmQoKTtcbiAgICAgIGFzc2VydC5pc09rKG1vZGVsLmNvbXBvbmVudC5sZWdlbmRzLmNvbG9yKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChtb2RlbC5jaGlsZHJlblswXS5jb21wb25lbnQubGVnZW5kcy5jb2xvcik7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQobW9kZWwuY2hpbGRyZW5bMV0uY29tcG9uZW50LmxlZ2VuZHMuY29sb3IpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19