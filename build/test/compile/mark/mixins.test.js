/* tslint:disable:quotemark */
import { assert } from 'chai';
import { X, Y } from '../../../src/channel';
import { color, pointPosition, tooltip } from '../../../src/compile/mark/mixins';
import * as log from '../../../src/log';
import { parseUnitModelWithScaleAndLayoutSize } from '../../util';
describe('compile/mark/mixins', function () {
    describe('color()', function () {
        it('color should be mapped to fill for bar', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
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
            var colorMixins = color(model);
            assert.deepEqual(colorMixins.fill, { "field": "gender", "scale": "color" });
        });
        it('color should be mapped to stroke for point', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
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
            var colorMixins = color(model);
            assert.deepEqual(colorMixins.stroke, { "field": "gender", "scale": "color" });
            assert.propertyVal(colorMixins.fill, 'value', "transparent");
        });
        it('add transparent fill when stroke is encoded', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "point",
                "encoding": {
                    "x": {
                        "field": "gender", "type": "nominal",
                        "scale": { "rangeStep": 6 },
                        "axis": null
                    },
                    "stroke": {
                        "field": "gender", "type": "nominal",
                        "scale": { "range": ["#EA98D2", "#659CCA"] }
                    }
                },
                "data": { "url": "data/population.json" }
            });
            var colorMixins = color(model);
            assert.deepEqual(colorMixins.stroke, { "field": "gender", "scale": "stroke" });
            assert.propertyVal(colorMixins.fill, 'value', "transparent");
        });
        it('ignores color if fill is specified', log.wrap(function (logger) {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "point",
                "encoding": {
                    "x": {
                        "field": "gender", "type": "nominal",
                        "scale": { "rangeStep": 6 },
                        "axis": null
                    },
                    "fill": {
                        "field": "gender", "type": "nominal",
                        "scale": { "range": ["#EA98D2", "#659CCA"] }
                    },
                    "color": {
                        "field": "gender", "type": "nominal",
                        "scale": { "range": ["#EA98D2", "#659CCA"] }
                    }
                },
                "data": { "url": "data/population.json" }
            });
            var colorMixins = color(model);
            assert.isUndefined(colorMixins.stroke);
            assert.deepEqual(colorMixins.fill, { "field": "gender", "scale": "fill" });
            assert.equal(logger.warns[0], log.message.droppingColor('encoding', { fill: true }));
        }));
        it('ignores color property if fill is specified', log.wrap(function (logger) {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": { "type": "point", "color": "red" },
                "encoding": {
                    "x": {
                        "field": "gender", "type": "nominal",
                        "scale": { "rangeStep": 6 },
                        "axis": null
                    },
                    "fill": {
                        "field": "gender", "type": "nominal",
                        "scale": { "range": ["#EA98D2", "#659CCA"] }
                    }
                },
                "data": { "url": "data/population.json" }
            });
            var colorMixins = color(model);
            assert.isUndefined(colorMixins.stroke);
            assert.deepEqual(colorMixins.fill, { "field": "gender", "scale": "fill" });
            assert.equal(logger.warns[0], log.message.droppingColor('property', { fill: true }));
        }));
        it('should apply stroke property over color property', log.wrap(function (logger) {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": { "type": "point", "color": "red", "stroke": "blue" },
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" }
                }
            });
            var props = color(model);
            assert.deepEqual(props.stroke, { value: "blue" });
            assert.equal(logger.warns[0], log.message.droppingColor('property', { stroke: true }));
        }));
        it('should apply ignore color property when fill is specified', log.wrap(function (logger) {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": { "type": "point", "color": "red", "fill": "blue" },
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" }
                }
            });
            var props = color(model);
            assert.isUndefined(props.stroke);
            assert.equal(logger.warns[0], log.message.droppingColor('property', { fill: true }));
        }));
        it('should apply color property', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": { "type": "point", "color": "red" },
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" }
                }
            });
            var props = color(model);
            assert.deepEqual(props.stroke, { value: "red" });
        });
        it('should apply color from mark-specific config over general mark config', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "point",
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" }
                },
                "config": { "mark": { "color": "blue" }, "point": { "color": "red" } }
            });
            var props = color(model);
            assert.deepEqual(props.stroke, { value: "red" });
        });
        it('should apply stroke mark config over color mark config', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "point",
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" }
                },
                "config": { "mark": { "color": "red", "stroke": "blue" } }
            });
            var props = color(model);
            assert.deepEqual(props.stroke, { value: "blue" });
        });
        it('should apply stroke mark config over color mark config', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "point",
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" }
                },
                "config": { "point": { "color": "red", "stroke": "blue" } }
            });
            var props = color(model);
            assert.deepEqual(props.stroke, { value: "blue" });
        });
    });
    describe('tooltip()', function () {
        it('generates tooltip object signal for an array of tooltip fields', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "point",
                "encoding": {
                    "tooltip": [
                        { "field": "Horsepower", "type": "quantitative" },
                        { "field": "Acceleration", "type": "quantitative" }
                    ]
                }
            });
            var props = tooltip(model);
            assert.deepEqual(props.tooltip, { signal: '{"Horsepower": format(datum["Horsepower"], ""), "Acceleration": format(datum["Acceleration"], "")}' });
        });
    });
    describe('midPoint()', function () {
        it('should return correctly for lat/lng', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
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
            [X, Y].forEach(function (channel) {
                var mixins = pointPosition(channel, model, 'zeroOrMin');
                assert.equal(mixins[channel].field, model.getName(channel));
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4aW5zLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvbWFyay9taXhpbnMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4QkFBOEI7QUFFOUIsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM1QixPQUFPLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQzFDLE9BQU8sRUFBQyxLQUFLLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBQyxNQUFNLGtDQUFrQyxDQUFDO0FBQy9FLE9BQU8sS0FBSyxHQUFHLE1BQU0sa0JBQWtCLENBQUM7QUFDeEMsT0FBTyxFQUFDLG9DQUFvQyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRWhFLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtJQUM5QixRQUFRLENBQUMsU0FBUyxFQUFFO1FBQ2xCLEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRTtZQUMzQyxJQUFNLEtBQUssR0FBRyxvQ0FBb0MsQ0FBQztnQkFDakQsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsVUFBVSxFQUFFO29CQUNWLEdBQUcsRUFBRTt3QkFDSCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTO3dCQUNwQyxPQUFPLEVBQUUsRUFBQyxXQUFXLEVBQUUsQ0FBQyxFQUFDO3dCQUN6QixNQUFNLEVBQUUsSUFBSTtxQkFDYjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUzt3QkFDcEMsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxFQUFDO3FCQUMzQztpQkFDRjtnQkFDRCxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsc0JBQXNCLEVBQUM7YUFDeEMsQ0FBQyxDQUFDO1lBRUgsSUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFD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TztnQkFDckIsSUFBTSxNQUFNLEdBQUcsYUFBYSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7Z0JBQ3hELE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDaEUsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtYLCBZfSBmcm9tICcuLi8uLi8uLi9zcmMvY2hhbm5lbCc7XG5pbXBvcnQge2NvbG9yLCBwb2ludFBvc2l0aW9uLCB0b29sdGlwfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9tYXJrL21peGlucyc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vLi4vc3JjL2xvZyc7XG5pbXBvcnQge3BhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdjb21waWxlL21hcmsvbWl4aW5zJywgKCkgPT4ge1xuICBkZXNjcmliZSgnY29sb3IoKScsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdjb2xvciBzaG91bGQgYmUgbWFwcGVkIHRvIGZpbGwgZm9yIGJhcicsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJnZW5kZXJcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwiLFxuICAgICAgICAgICAgXCJzY2FsZVwiOiB7XCJyYW5nZVN0ZXBcIjogNn0sXG4gICAgICAgICAgICBcImF4aXNcIjogbnVsbFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjb2xvclwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwiZ2VuZGVyXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIixcbiAgICAgICAgICAgIFwic2NhbGVcIjoge1wicmFuZ2VcIjogW1wiI0VBOThEMlwiLCBcIiM2NTlDQ0FcIl19XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBjb2xvck1peGlucyA9IGNvbG9yKG1vZGVsKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoY29sb3JNaXhpbnMuZmlsbCwge1wiZmllbGRcIjogXCJnZW5kZXJcIiwgXCJzY2FsZVwiOiBcImNvbG9yXCJ9KTtcbiAgICB9KTtcblxuICAgIGl0KCdjb2xvciBzaG91bGQgYmUgbWFwcGVkIHRvIHN0cm9rZSBmb3IgcG9pbnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwiZ2VuZGVyXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIixcbiAgICAgICAgICAgIFwic2NhbGVcIjoge1wicmFuZ2VTdGVwXCI6IDZ9LFxuICAgICAgICAgICAgXCJheGlzXCI6IG51bGxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY29sb3JcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcImdlbmRlclwiLCBcInR5cGVcIjogXCJub21pbmFsXCIsXG4gICAgICAgICAgICBcInNjYWxlXCI6IHtcInJhbmdlXCI6IFtcIiNFQTk4RDJcIiwgXCIjNjU5Q0NBXCJdfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgY29sb3JNaXhpbnMgPSBjb2xvcihtb2RlbCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGNvbG9yTWl4aW5zLnN0cm9rZSwge1wiZmllbGRcIjogXCJnZW5kZXJcIiwgXCJzY2FsZVwiOiBcImNvbG9yXCJ9KTtcbiAgICAgIGFzc2VydC5wcm9wZXJ0eVZhbChjb2xvck1peGlucy5maWxsLCAndmFsdWUnLCBcInRyYW5zcGFyZW50XCIpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2FkZCB0cmFuc3BhcmVudCBmaWxsIHdoZW4gc3Ryb2tlIGlzIGVuY29kZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwiZ2VuZGVyXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIixcbiAgICAgICAgICAgIFwic2NhbGVcIjoge1wicmFuZ2VTdGVwXCI6IDZ9LFxuICAgICAgICAgICAgXCJheGlzXCI6IG51bGxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic3Ryb2tlXCI6IHtcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJnZW5kZXJcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwiLFxuICAgICAgICAgICAgXCJzY2FsZVwiOiB7XCJyYW5nZVwiOiBbXCIjRUE5OEQyXCIsIFwiIzY1OUNDQVwiXX1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGNvbG9yTWl4aW5zID0gY29sb3IobW9kZWwpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChjb2xvck1peGlucy5zdHJva2UsIHtcImZpZWxkXCI6IFwiZ2VuZGVyXCIsIFwic2NhbGVcIjogXCJzdHJva2VcIn0pO1xuICAgICAgYXNzZXJ0LnByb3BlcnR5VmFsKGNvbG9yTWl4aW5zLmZpbGwsICd2YWx1ZScsIFwidHJhbnNwYXJlbnRcIik7XG4gICAgfSk7XG5cbiAgICBpdCgnaWdub3JlcyBjb2xvciBpZiBmaWxsIGlzIHNwZWNpZmllZCcsIGxvZy53cmFwKChsb2dnZXIpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJnZW5kZXJcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwiLFxuICAgICAgICAgICAgXCJzY2FsZVwiOiB7XCJyYW5nZVN0ZXBcIjogNn0sXG4gICAgICAgICAgICBcImF4aXNcIjogbnVsbFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJmaWxsXCI6IHtcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJnZW5kZXJcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwiLFxuICAgICAgICAgICAgXCJzY2FsZVwiOiB7XCJyYW5nZVwiOiBbXCIjRUE5OEQyXCIsIFwiIzY1OUNDQVwiXX1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY29sb3JcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcImdlbmRlclwiLCBcInR5cGVcIjogXCJub21pbmFsXCIsXG4gICAgICAgICAgICBcInNjYWxlXCI6IHtcInJhbmdlXCI6IFtcIiNFQTk4RDJcIiwgXCIjNjU5Q0NBXCJdfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgY29sb3JNaXhpbnMgPSBjb2xvcihtb2RlbCk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQoY29sb3JNaXhpbnMuc3Ryb2tlKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoY29sb3JNaXhpbnMuZmlsbCwge1wiZmllbGRcIjogXCJnZW5kZXJcIiwgXCJzY2FsZVwiOiBcImZpbGxcIn0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGxvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UuZHJvcHBpbmdDb2xvcignZW5jb2RpbmcnLCB7ZmlsbDogdHJ1ZX0pKTtcbiAgICB9KSk7XG5cbiAgICBpdCgnaWdub3JlcyBjb2xvciBwcm9wZXJ0eSBpZiBmaWxsIGlzIHNwZWNpZmllZCcsIGxvZy53cmFwKChsb2dnZXIpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IHtcInR5cGVcIjogXCJwb2ludFwiLCBcImNvbG9yXCI6IFwicmVkXCJ9LFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcImdlbmRlclwiLCBcInR5cGVcIjogXCJub21pbmFsXCIsXG4gICAgICAgICAgICBcInNjYWxlXCI6IHtcInJhbmdlU3RlcFwiOiA2fSxcbiAgICAgICAgICAgIFwiYXhpc1wiOiBudWxsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImZpbGxcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcImdlbmRlclwiLCBcInR5cGVcIjogXCJub21pbmFsXCIsXG4gICAgICAgICAgICBcInNjYWxlXCI6IHtcInJhbmdlXCI6IFtcIiNFQTk4RDJcIiwgXCIjNjU5Q0NBXCJdfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgY29sb3JNaXhpbnMgPSBjb2xvcihtb2RlbCk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQoY29sb3JNaXhpbnMuc3Ryb2tlKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoY29sb3JNaXhpbnMuZmlsbCwge1wiZmllbGRcIjogXCJnZW5kZXJcIiwgXCJzY2FsZVwiOiBcImZpbGxcIn0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGxvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UuZHJvcHBpbmdDb2xvcigncHJvcGVydHknLCB7ZmlsbDogdHJ1ZX0pKTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IHN0cm9rZSBwcm9wZXJ0eSBvdmVyIGNvbG9yIHByb3BlcnR5JywgbG9nLndyYXAoKGxvZ2dlcikgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjoge1widHlwZVwiOiBcInBvaW50XCIsIFwiY29sb3JcIjogXCJyZWRcIiwgXCJzdHJva2VcIjogXCJibHVlXCJ9LFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJIb3JzZXBvd2VyXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJNaWxlc19wZXJfR2FsbG9uXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHByb3BzID0gY29sb3IobW9kZWwpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5zdHJva2UsIHt2YWx1ZTogXCJibHVlXCJ9KTtcbiAgICAgIGFzc2VydC5lcXVhbChsb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLmRyb3BwaW5nQ29sb3IoJ3Byb3BlcnR5Jywge3N0cm9rZTogdHJ1ZX0pKTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGlnbm9yZSBjb2xvciBwcm9wZXJ0eSB3aGVuIGZpbGwgaXMgc3BlY2lmaWVkJywgbG9nLndyYXAoKGxvZ2dlcikgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjoge1widHlwZVwiOiBcInBvaW50XCIsIFwiY29sb3JcIjogXCJyZWRcIiwgXCJmaWxsXCI6IFwiYmx1ZVwifSxcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiSG9yc2Vwb3dlclwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiTWlsZXNfcGVyX0dhbGxvblwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBwcm9wcyA9IGNvbG9yKG1vZGVsKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChwcm9wcy5zdHJva2UpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGxvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UuZHJvcHBpbmdDb2xvcigncHJvcGVydHknLCB7ZmlsbDogdHJ1ZX0pKTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGNvbG9yIHByb3BlcnR5JywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjoge1widHlwZVwiOiBcInBvaW50XCIsIFwiY29sb3JcIjogXCJyZWRcIn0sXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIkhvcnNlcG93ZXJcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcIk1pbGVzX3Blcl9HYWxsb25cIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgcHJvcHMgPSBjb2xvcihtb2RlbCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnN0cm9rZSwge3ZhbHVlOiBcInJlZFwifSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGNvbG9yIGZyb20gbWFyay1zcGVjaWZpYyBjb25maWcgb3ZlciBnZW5lcmFsIG1hcmsgY29uZmlnJywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJIb3JzZXBvd2VyXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJNaWxlc19wZXJfR2FsbG9uXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9LFxuICAgICAgICBcImNvbmZpZ1wiOiB7XCJtYXJrXCI6IHtcImNvbG9yXCI6IFwiYmx1ZVwifSwgXCJwb2ludFwiOiB7XCJjb2xvclwiOiBcInJlZFwifX1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgcHJvcHMgPSBjb2xvcihtb2RlbCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnN0cm9rZSwge3ZhbHVlOiBcInJlZFwifSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IHN0cm9rZSBtYXJrIGNvbmZpZyBvdmVyIGNvbG9yIG1hcmsgY29uZmlnJywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJIb3JzZXBvd2VyXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJNaWxlc19wZXJfR2FsbG9uXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9LFxuICAgICAgICBcImNvbmZpZ1wiOiB7XCJtYXJrXCI6IHtcImNvbG9yXCI6IFwicmVkXCIsIFwic3Ryb2tlXCI6IFwiYmx1ZVwifX1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgcHJvcHMgPSBjb2xvcihtb2RlbCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnN0cm9rZSwge3ZhbHVlOiBcImJsdWVcIn0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBzdHJva2UgbWFyayBjb25maWcgb3ZlciBjb2xvciBtYXJrIGNvbmZpZycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiSG9yc2Vwb3dlclwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiTWlsZXNfcGVyX0dhbGxvblwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb25maWdcIjoge1wicG9pbnRcIjoge1wiY29sb3JcIjogXCJyZWRcIiwgXCJzdHJva2VcIjogXCJibHVlXCJ9fVxuICAgICAgfSk7XG4gICAgICBjb25zdCBwcm9wcyA9IGNvbG9yKG1vZGVsKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuc3Ryb2tlLCB7dmFsdWU6IFwiYmx1ZVwifSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd0b29sdGlwKCknLCAoKSA9PiB7XG4gICAgaXQoJ2dlbmVyYXRlcyB0b29sdGlwIG9iamVjdCBzaWduYWwgZm9yIGFuIGFycmF5IG9mIHRvb2x0aXAgZmllbGRzJywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInRvb2x0aXBcIjogW1xuICAgICAgICAgICAge1wiZmllbGRcIjogXCJIb3JzZXBvd2VyXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgIHtcImZpZWxkXCI6IFwiQWNjZWxlcmF0aW9uXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBwcm9wcyA9IHRvb2x0aXAobW9kZWwpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy50b29sdGlwLCB7c2lnbmFsOiAne1wiSG9yc2Vwb3dlclwiOiBmb3JtYXQoZGF0dW1bXCJIb3JzZXBvd2VyXCJdLCBcIlwiKSwgXCJBY2NlbGVyYXRpb25cIjogZm9ybWF0KGRhdHVtW1wiQWNjZWxlcmF0aW9uXCJdLCBcIlwiKX0nfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdtaWRQb2ludCgpJywgZnVuY3Rpb24gKCkge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3RseSBmb3IgbGF0L2xuZycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgICBcInVybFwiOiBcImRhdGEvemlwY29kZXMuY3N2XCIsXG4gICAgICAgICAgXCJmb3JtYXRcIjoge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiY3N2XCJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwibG9uZ2l0dWRlXCI6IHtcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJsb25naXR1ZGVcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImxhdGl0dWRlXCI6IHtcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJsYXRpdHVkZVwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBbWCwgWV0uZm9yRWFjaCgoY2hhbm5lbCkgPT4ge1xuICAgICAgICBjb25zdCBtaXhpbnMgPSBwb2ludFBvc2l0aW9uKGNoYW5uZWwsIG1vZGVsLCAnemVyb09yTWluJyk7XG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKG1peGluc1tjaGFubmVsXS5maWVsZCwgbW9kZWwuZ2V0TmFtZShjaGFubmVsKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==