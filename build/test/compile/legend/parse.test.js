/* tslint:disable:quotemark */
import { assert } from 'chai';
import { COLOR, OPACITY, SHAPE, SIZE } from '../../../src/channel';
import * as legendParse from '../../../src/compile/legend/parse';
import { parseLegend } from '../../../src/compile/legend/parse';
import { isFieldDef } from '../../../src/fielddef';
import { GEOJSON } from '../../../src/type';
import { parseLayerModel, parseUnitModelWithScale } from '../../util';
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
            var unitModel = parseUnitModelWithScale(spec);
            var channelDef = unitModel.encoding[SHAPE];
            assert.isTrue(isFieldDef(channelDef));
            if (isFieldDef(channelDef)) {
                assert.equal(channelDef.type, GEOJSON);
            }
            parseLegend(unitModel);
            var legendComp = unitModel.component.legends;
            assert.isUndefined(legendComp[SHAPE]);
        });
    });
    describe('parseLegendForChannel()', function () {
        it('should produce a Vega legend object with correct type and scale for color', function () {
            var model = parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    color: { field: "a", type: "quantitative" }
                }
            });
            var def = legendParse.parseLegendForChannel(model, COLOR).combine();
            assert.isObject(def);
            assert.equal(def.title, 'a');
            assert.equal(def.stroke, 'color');
            assert.equal(def.type, 'gradient');
        });
        it('should produce no legend title when title is null, "", or false', function () {
            for (var _i = 0, _a = [null, '', false]; _i < _a.length; _i++) {
                var val = _a[_i];
                var model = parseUnitModelWithScale({
                    mark: "point",
                    encoding: {
                        x: { field: "a", type: "nominal" },
                        color: {
                            field: "a", type: "quantitative",
                            legend: { title: val } // Need to cast as false is not valid, but we want to fall back gracefully
                        }
                    }
                });
                var def = legendParse.parseLegendForChannel(model, COLOR).combine();
                assert.doesNotHaveAnyKeys(def, ['title']);
            }
        });
        it('should store fieldDef.title as explicit', function () {
            var model = parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    color: {
                        field: "a", type: "quantitative",
                        legend: { title: 'foo' } // Need to cast as false is not valid, but we want to fall back gracefully
                    }
                }
            });
            var def = legendParse.parseLegendForChannel(model, COLOR).combine();
            assert.equal(def.title, 'foo');
        });
        [SIZE, SHAPE, OPACITY].forEach(function (channel) {
            it("should produce a Vega legend object with correct type and scale for " + channel, function () {
                var spec = {
                    mark: "point",
                    encoding: {
                        x: { field: "a", type: "nominal" }
                    }
                };
                spec.encoding[channel] = { field: "a", type: "nominal" };
                var model = parseUnitModelWithScale(spec);
                var def = legendParse.parseLegendForChannel(model, channel).combine();
                var channelDef = model.encoding[channel];
                if (isFieldDef(channelDef)) {
                    assert.notEqual(channelDef.type, GEOJSON);
                }
                if (channel !== OPACITY) {
                    assert.equal(def.encode.symbols.update.opacity.value, 0.7);
                }
                else {
                    assert.isUndefined(def.encode.symbols.update.opacity);
                }
                assert.isObject(def);
                assert.equal(def.title, "a");
            });
        });
    });
    describe('parseNonUnitLegend()', function () {
        it('should correctly merge orient by favoring explicit orient', function () {
            var model = parseLayerModel({
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
            assert.equal(model.component.legends.color.explicit.orient, 'left');
        });
        it('should correctly merge legend that exists only on one plot', function () {
            var model = parseLayerModel({
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
            assert.isOk(model.component.legends.color);
            assert.isUndefined(model.children[0].component.legends.color);
            assert.isUndefined(model.children[1].component.legends.color);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9sZWdlbmQvcGFyc2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4QkFBOEI7QUFFOUIsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM1QixPQUFPLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDakUsT0FBTyxLQUFLLFdBQVcsTUFBTSxtQ0FBbUMsQ0FBQztBQUNqRSxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sbUNBQW1DLENBQUM7QUFDOUQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRWpELE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMxQyxPQUFPLEVBQUMsZUFBZSxFQUFFLHVCQUF1QixFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRXBFLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtJQUN6QixRQUFRLENBQUMsbUJBQW1CLEVBQUU7UUFDNUIsRUFBRSxDQUFDLGdGQUFnRixFQUFFO1lBQ25GLElBQU0sSUFBSSxHQUF1QjtnQkFDL0IsTUFBTSxFQUFFLFVBQVU7Z0JBQ2xCLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBQztnQkFDbkMsV0FBVyxFQUFFO29CQUNYO3dCQUNFLFFBQVEsRUFBRSxJQUFJO3dCQUNkLE1BQU0sRUFBRTs0QkFDTixNQUFNLEVBQUU7Z0NBQ04sS0FBSyxFQUFFLGtCQUFrQjtnQ0FDekIsUUFBUSxFQUFFLEVBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFDOzZCQUNwRDs0QkFDRCxLQUFLLEVBQUUsSUFBSTt5QkFDWjt3QkFDRCxJQUFJLEVBQUUsS0FBSztxQkFDWjtpQkFDRjtnQkFDRCxVQUFVLEVBQUU7b0JB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LEVBQUUsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7d0JBQ3hDLFVBQVUsRUFBRTs0QkFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUM7NEJBQzFDLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBQzs0QkFDL0MsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO3lCQUNoRDtxQkFDRjtpQkFDRjthQUNGLENBQUMsQ0FBQztZQUNILEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNuQixLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDcEIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzQyxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM5RCxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoRSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtDT0xPUiwgT1BBQ0lUWSwgU0hBUEUsIFNJWkV9IGZyb20gJy4uLy4uLy4uL3NyYy9jaGFubmVsJztcbmltcG9ydCAqIGFzIGxlZ2VuZFBhcnNlIGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2xlZ2VuZC9wYXJzZSc7XG5pbXBvcnQge3BhcnNlTGVnZW5kfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9sZWdlbmQvcGFyc2UnO1xuaW1wb3J0IHtpc0ZpZWxkRGVmfSBmcm9tICcuLi8uLi8uLi9zcmMvZmllbGRkZWYnO1xuaW1wb3J0IHtOb3JtYWxpemVkVW5pdFNwZWN9IGZyb20gJy4uLy4uLy4uL3NyYy9zcGVjJztcbmltcG9ydCB7R0VPSlNPTn0gZnJvbSAnLi4vLi4vLi4vc3JjL3R5cGUnO1xuaW1wb3J0IHtwYXJzZUxheWVyTW9kZWwsIHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlfSBmcm9tICcuLi8uLi91dGlsJztcblxuZGVzY3JpYmUoJ2NvbXBpbGUvbGVnZW5kJywgZnVuY3Rpb24gKCkge1xuICBkZXNjcmliZSgncGFyc2VVbml0TGVnZW5kKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgaXQoYHNob3VsZCBub3QgcHJvZHVjZSBhIFZlZ2EgbGVnZW5kIG9iamVjdCBvbiBjaGFubmVsICdzaGFwZScgd2l0aCB0eXBlICdnZW9qc29uJ2AsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IHNwZWM6IE5vcm1hbGl6ZWRVbml0U3BlYyA9IHtcbiAgICAgICAgXCJtYXJrXCI6IFwiZ2Vvc2hhcGVcIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvaW5jb21lLmpzb25cIn0sXG4gICAgICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImxvb2t1cFwiOiBcImlkXCIsXG4gICAgICAgICAgICBcImZyb21cIjoge1xuICAgICAgICAgICAgICBcImRhdGFcIjoge1xuICAgICAgICAgICAgICAgIFwidXJsXCI6IFwiZGF0YS91cy0xMG0uanNvblwiLFxuICAgICAgICAgICAgICAgIFwiZm9ybWF0XCI6IHtcInR5cGVcIjogXCJ0b3BvanNvblwiLCBcImZlYXR1cmVcIjogXCJzdGF0ZXNcIn1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJrZXlcIjogXCJpZFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJhc1wiOiBcImdlb1wiXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInNoYXBlXCI6IHtcImZpZWxkXCI6IFwiZ2VvXCIsIFwidHlwZVwiOiBcImdlb2pzb25cIn1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgY29uc3QgdW5pdE1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoc3BlYyk7XG4gICAgICBjb25zdCBjaGFubmVsRGVmID0gdW5pdE1vZGVsLmVuY29kaW5nW1NIQVBFXTtcbiAgICAgIGFzc2VydC5pc1RydWUoaXNGaWVsZERlZihjaGFubmVsRGVmKSk7XG4gICAgICBpZiAoaXNGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgICAgICBhc3NlcnQuZXF1YWwoY2hhbm5lbERlZi50eXBlLCBHRU9KU09OKTtcbiAgICAgIH1cbiAgICAgIHBhcnNlTGVnZW5kKHVuaXRNb2RlbCk7XG4gICAgICBjb25zdCBsZWdlbmRDb21wID0gdW5pdE1vZGVsLmNvbXBvbmVudC5sZWdlbmRzO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKGxlZ2VuZENvbXBbU0hBUEVdKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3BhcnNlTGVnZW5kRm9yQ2hhbm5lbCgpJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIGEgVmVnYSBsZWdlbmQgb2JqZWN0IHdpdGggY29ycmVjdCB0eXBlIGFuZCBzY2FsZSBmb3IgY29sb3InLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiBcImFcIiwgdHlwZTogXCJub21pbmFsXCJ9LFxuICAgICAgICAgIGNvbG9yOiB7ZmllbGQ6IFwiYVwiLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgZGVmID0gbGVnZW5kUGFyc2UucGFyc2VMZWdlbmRGb3JDaGFubmVsKG1vZGVsLCBDT0xPUikuY29tYmluZSgpO1xuICAgICAgYXNzZXJ0LmlzT2JqZWN0KGRlZik7XG4gICAgICBhc3NlcnQuZXF1YWwoZGVmLnRpdGxlLCAnYScpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGRlZi5zdHJva2UsICdjb2xvcicpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGRlZi50eXBlLCAnZ3JhZGllbnQnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcHJvZHVjZSBubyBsZWdlbmQgdGl0bGUgd2hlbiB0aXRsZSBpcyBudWxsLCBcIlwiLCBvciBmYWxzZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGZvciAoY29uc3QgdmFsIG9mIFtudWxsLCAnJywgZmFsc2VdKSB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiBcImFcIiwgdHlwZTogXCJub21pbmFsXCJ9LFxuICAgICAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICAgICAgZmllbGQ6IFwiYVwiLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICBsZWdlbmQ6IHt0aXRsZTogdmFsIGFzIGFueX0gLy8gTmVlZCB0byBjYXN0IGFzIGZhbHNlIGlzIG5vdCB2YWxpZCwgYnV0IHdlIHdhbnQgdG8gZmFsbCBiYWNrIGdyYWNlZnVsbHlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGRlZiA9IGxlZ2VuZFBhcnNlLnBhcnNlTGVnZW5kRm9yQ2hhbm5lbChtb2RlbCwgQ09MT1IpLmNvbWJpbmUoKTtcbiAgICAgICAgYXNzZXJ0LmRvZXNOb3RIYXZlQW55S2V5cyhkZWYsIFsndGl0bGUnXSk7XG4gICAgICB9XG4gICAgfSk7XG5cblxuICAgIGl0KCdzaG91bGQgc3RvcmUgZmllbGREZWYudGl0bGUgYXMgZXhwbGljaXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogXCJhXCIsIHR5cGU6IFwibm9taW5hbFwifSxcbiAgICAgICAgICBjb2xvcjoge1xuICAgICAgICAgICAgZmllbGQ6IFwiYVwiLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgbGVnZW5kOiB7dGl0bGU6ICdmb28nfSAvLyBOZWVkIHRvIGNhc3QgYXMgZmFsc2UgaXMgbm90IHZhbGlkLCBidXQgd2Ugd2FudCB0byBmYWxsIGJhY2sgZ3JhY2VmdWxseVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGRlZiA9IGxlZ2VuZFBhcnNlLnBhcnNlTGVnZW5kRm9yQ2hhbm5lbChtb2RlbCwgQ09MT1IpLmNvbWJpbmUoKTtcbiAgICAgIGFzc2VydC5lcXVhbChkZWYudGl0bGUsICdmb28nKTtcbiAgICB9KTtcblxuICAgIFtTSVpFLCBTSEFQRSwgT1BBQ0lUWV0uZm9yRWFjaChjaGFubmVsID0+IHtcbiAgICAgIGl0KGBzaG91bGQgcHJvZHVjZSBhIFZlZ2EgbGVnZW5kIG9iamVjdCB3aXRoIGNvcnJlY3QgdHlwZSBhbmQgc2NhbGUgZm9yICR7Y2hhbm5lbH1gLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3Qgc3BlYzogTm9ybWFsaXplZFVuaXRTcGVjID0ge1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiBcImFcIiwgdHlwZTogXCJub21pbmFsXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBzcGVjLmVuY29kaW5nW2NoYW5uZWxdID0ge2ZpZWxkOiBcImFcIiwgdHlwZTogXCJub21pbmFsXCJ9O1xuXG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoc3BlYyk7XG5cbiAgICAgICAgY29uc3QgZGVmID0gbGVnZW5kUGFyc2UucGFyc2VMZWdlbmRGb3JDaGFubmVsKG1vZGVsLCBjaGFubmVsKS5jb21iaW5lKCk7XG5cbiAgICAgICAgY29uc3QgY2hhbm5lbERlZiA9IG1vZGVsLmVuY29kaW5nW2NoYW5uZWxdO1xuICAgICAgICBpZiAoaXNGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgICAgICAgIGFzc2VydC5ub3RFcXVhbChjaGFubmVsRGVmLnR5cGUsIEdFT0pTT04pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNoYW5uZWwgIT09IE9QQUNJVFkpIHtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZGVmLmVuY29kZS5zeW1ib2xzLnVwZGF0ZS5vcGFjaXR5LnZhbHVlLCAwLjcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChkZWYuZW5jb2RlLnN5bWJvbHMudXBkYXRlLm9wYWNpdHkpO1xuICAgICAgICB9XG4gICAgICAgIGFzc2VydC5pc09iamVjdChkZWYpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoZGVmLnRpdGxlLCBcImFcIik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3BhcnNlTm9uVW5pdExlZ2VuZCgpJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY29ycmVjdGx5IG1lcmdlIG9yaWVudCBieSBmYXZvcmluZyBleHBsaWNpdCBvcmllbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlTGF5ZXJNb2RlbCh7XG4gICAgICAgIFwiJHNjaGVtYVwiOiBcImh0dHBzOi8vdmVnYS5naXRodWIuaW8vc2NoZW1hL3ZlZ2EtbGl0ZS92Mi5qc29uXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJHb29nbGUncyBzdG9jayBwcmljZSBvdmVyIHRpbWUuXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3N0b2Nrcy5jc3ZcIn0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcImxpbmVcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzeW1ib2xcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0se1xuICAgICAgICAgICAgXCJtYXJrXCI6IHtcInR5cGVcIjpcInBvaW50XCIsIFwiZmlsbGVkXCI6IHRydWV9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInByaWNlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInN5bWJvbFwiLCBcInR5cGVcIjogXCJub21pbmFsXCIsIFwibGVnZW5kXCI6IHtcIm9yaWVudFwiOiBcImxlZnRcIn19XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICAgIG1vZGVsLnBhcnNlU2NhbGUoKTtcbiAgICAgIG1vZGVsLnBhcnNlTGVnZW5kKCk7XG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwuY29tcG9uZW50LmxlZ2VuZHMuY29sb3IuZXhwbGljaXQub3JpZW50LCAnbGVmdCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBjb3JyZWN0bHkgbWVyZ2UgbGVnZW5kIHRoYXQgZXhpc3RzIG9ubHkgb24gb25lIHBsb3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlTGF5ZXJNb2RlbCh7XG4gICAgICAgIFwiJHNjaGVtYVwiOiBcImh0dHBzOi8vdmVnYS5naXRodWIuaW8vc2NoZW1hL3ZlZ2EtbGl0ZS92Mi5qc29uXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJHb29nbGUncyBzdG9jayBwcmljZSBvdmVyIHRpbWUuXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3N0b2Nrcy5jc3ZcIn0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcImxpbmVcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LHtcbiAgICAgICAgICAgIFwibWFya1wiOiB7XCJ0eXBlXCI6XCJwb2ludFwiLCBcImZpbGxlZFwiOiB0cnVlfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzeW1ib2xcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgICBtb2RlbC5wYXJzZVNjYWxlKCk7XG4gICAgICBtb2RlbC5wYXJzZUxlZ2VuZCgpO1xuICAgICAgYXNzZXJ0LmlzT2sobW9kZWwuY29tcG9uZW50LmxlZ2VuZHMuY29sb3IpO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKG1vZGVsLmNoaWxkcmVuWzBdLmNvbXBvbmVudC5sZWdlbmRzLmNvbG9yKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChtb2RlbC5jaGlsZHJlblsxXS5jb21wb25lbnQubGVnZW5kcy5jb2xvcik7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=