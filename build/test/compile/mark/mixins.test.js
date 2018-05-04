"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var mixins_1 = require("../../../src/compile/mark/mixins");
var log = require("../../../src/log");
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
        it('add transparent fill when stroke is encoded', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
            var colorMixins = mixins_1.color(model);
            chai_1.assert.deepEqual(colorMixins.stroke, { "field": "gender", "scale": "stroke" });
            chai_1.assert.propertyVal(colorMixins.fill, 'value', "transparent");
        });
        it('ignores color if fill is specified', log.wrap(function (logger) {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
            var colorMixins = mixins_1.color(model);
            chai_1.assert.isUndefined(colorMixins.stroke);
            chai_1.assert.deepEqual(colorMixins.fill, { "field": "gender", "scale": "fill" });
            chai_1.assert.equal(logger.warns[0], log.message.droppingColor('encoding', { fill: true }));
        }));
        it('ignores color property if fill is specified', log.wrap(function (logger) {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
            var colorMixins = mixins_1.color(model);
            chai_1.assert.isUndefined(colorMixins.stroke);
            chai_1.assert.deepEqual(colorMixins.fill, { "field": "gender", "scale": "fill" });
            chai_1.assert.equal(logger.warns[0], log.message.droppingColor('property', { fill: true }));
        }));
        it('should apply stroke property over color property', log.wrap(function (logger) {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": { "type": "point", "color": "red", "stroke": "blue" },
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" }
                }
            });
            var props = mixins_1.color(model);
            chai_1.assert.deepEqual(props.stroke, { value: "blue" });
            chai_1.assert.equal(logger.warns[0], log.message.droppingColor('property', { stroke: true }));
        }));
        it('should apply ignore color property when fill is specified', log.wrap(function (logger) {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": { "type": "point", "color": "red", "fill": "blue" },
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" }
                }
            });
            var props = mixins_1.color(model);
            chai_1.assert.isUndefined(props.stroke);
            chai_1.assert.equal(logger.warns[0], log.message.droppingColor('property', { fill: true }));
        }));
        it('should apply color property', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": { "type": "point", "color": "red" },
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" }
                }
            });
            var props = mixins_1.color(model);
            chai_1.assert.deepEqual(props.stroke, { value: "red" });
        });
        it('should apply color from mark-specific config over general mark config', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": "point",
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" }
                },
                "config": { "mark": { "color": "blue" }, "point": { "color": "red" } }
            });
            var props = mixins_1.color(model);
            chai_1.assert.deepEqual(props.stroke, { value: "red" });
        });
        it('should apply stroke mark config over color mark config', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": "point",
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" }
                },
                "config": { "mark": { "color": "red", "stroke": "blue" } }
            });
            var props = mixins_1.color(model);
            chai_1.assert.deepEqual(props.stroke, { value: "blue" });
        });
        it('should apply stroke mark config over color mark config', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": "point",
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" }
                },
                "config": { "point": { "color": "red", "stroke": "blue" } }
            });
            var props = mixins_1.color(model);
            chai_1.assert.deepEqual(props.stroke, { value: "blue" });
        });
    });
    describe('tooltip()', function () {
        it('generates tooltip object signal for an array of tooltip fields', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": "point",
                "encoding": {
                    "tooltip": [
                        { "field": "Horsepower", "type": "quantitative" },
                        { "field": "Acceleration", "type": "quantitative" }
                    ]
                }
            });
            var props = mixins_1.tooltip(model);
            chai_1.assert.deepEqual(props.tooltip, { signal: '{"Horsepower": format(datum["Horsepower"], ""), "Acceleration": format(datum["Acceleration"], "")}' });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4aW5zLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvbWFyay9taXhpbnMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFDNUIsZ0RBQTBDO0FBQzFDLDJEQUErRTtBQUMvRSxzQ0FBd0M7QUFDeEMsbUNBQWdFO0FBRWhFLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtJQUM5QixRQUFRLENBQUMsU0FBUyxFQUFFO1FBQ2xCLEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRTtZQUMzQyxJQUFNLEtBQUssR0FBRywyQ0FBb0MsQ0FBQztnQkFDakQsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsVUFBVSxFQUFFO29CQUNWLEdBQUcsRUFBRTt3QkFDSCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTO3dCQUNwQyxPQUFPLEVBQUUsRUFBQyxXQUFXLEVBQUUsQ0FBQyxFQUFDO3dCQUN6QixNQUFNLEVBQUUsSUFBSTtxQkFDYjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUzt3QkFDcEMsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxFQUFDO3FCQUMzQztpQkFDRjtnQkFDRCxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsc0JBQXNCLEVBQUM7YUFDeEMsQ0FBQyxDQUFDO1lBRUgsSUFBTSxXQUFXLEdBQUcsY0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2pDLGFBQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7UUFDNUUsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNENBQTRDLEVBQUU7WUFDL0MsSUFBTSxLQUFLLEdBQUcs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QztZQUNoRSxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge1gsIFl9IGZyb20gJy4uLy4uLy4uL3NyYy9jaGFubmVsJztcbmltcG9ydCB7Y29sb3IsIHBvaW50UG9zaXRpb24sIHRvb2x0aXB9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvbWl4aW5zJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi8uLi9zcmMvbG9nJztcbmltcG9ydCB7cGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplfSBmcm9tICcuLi8uLi91dGlsJztcblxuZGVzY3JpYmUoJ2NvbXBpbGUvbWFyay9taXhpbnMnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdjb2xvcigpJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ2NvbG9yIHNob3VsZCBiZSBtYXBwZWQgdG8gZmlsbCBmb3IgYmFyJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcImdlbmRlclwiLCBcInR5cGVcIjogXCJub21pbmFsXCIsXG4gICAgICAgICAgICBcInNjYWxlXCI6IHtcInJhbmdlU3RlcFwiOiA2fSxcbiAgICAgICAgICAgIFwiYXhpc1wiOiBudWxsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJnZW5kZXJcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwiLFxuICAgICAgICAgICAgXCJzY2FsZVwiOiB7XCJyYW5nZVwiOiBbXCIjRUE5OEQyXCIsIFwiIzY1OUNDQVwiXX1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGNvbG9yTWl4aW5zID0gY29sb3IobW9kZWwpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChjb2xvck1peGlucy5maWxsLCB7XCJmaWVsZFwiOiBcImdlbmRlclwiLCBcInNjYWxlXCI6IFwiY29sb3JcIn0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NvbG9yIHNob3VsZCBiZSBtYXBwZWQgdG8gc3Ryb2tlIGZvciBwb2ludCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJnZW5kZXJcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwiLFxuICAgICAgICAgICAgXCJzY2FsZVwiOiB7XCJyYW5nZVN0ZXBcIjogNn0sXG4gICAgICAgICAgICBcImF4aXNcIjogbnVsbFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjb2xvclwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwiZ2VuZGVyXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIixcbiAgICAgICAgICAgIFwic2NhbGVcIjoge1wicmFuZ2VcIjogW1wiI0VBOThEMlwiLCBcIiM2NTlDQ0FcIl19XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBjb2xvck1peGlucyA9IGNvbG9yKG1vZGVsKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoY29sb3JNaXhpbnMuc3Ryb2tlLCB7XCJmaWVsZFwiOiBcImdlbmRlclwiLCBcInNjYWxlXCI6IFwiY29sb3JcIn0pO1xuICAgICAgYXNzZXJ0LnByb3BlcnR5VmFsKGNvbG9yTWl4aW5zLmZpbGwsICd2YWx1ZScsIFwidHJhbnNwYXJlbnRcIik7XG4gICAgfSk7XG5cbiAgICBpdCgnYWRkIHRyYW5zcGFyZW50IGZpbGwgd2hlbiBzdHJva2UgaXMgZW5jb2RlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJnZW5kZXJcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwiLFxuICAgICAgICAgICAgXCJzY2FsZVwiOiB7XCJyYW5nZVN0ZXBcIjogNn0sXG4gICAgICAgICAgICBcImF4aXNcIjogbnVsbFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzdHJva2VcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcImdlbmRlclwiLCBcInR5cGVcIjogXCJub21pbmFsXCIsXG4gICAgICAgICAgICBcInNjYWxlXCI6IHtcInJhbmdlXCI6IFtcIiNFQTk4RDJcIiwgXCIjNjU5Q0NBXCJdfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgY29sb3JNaXhpbnMgPSBjb2xvcihtb2RlbCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGNvbG9yTWl4aW5zLnN0cm9rZSwge1wiZmllbGRcIjogXCJnZW5kZXJcIiwgXCJzY2FsZVwiOiBcInN0cm9rZVwifSk7XG4gICAgICBhc3NlcnQucHJvcGVydHlWYWwoY29sb3JNaXhpbnMuZmlsbCwgJ3ZhbHVlJywgXCJ0cmFuc3BhcmVudFwiKTtcbiAgICB9KTtcblxuICAgIGl0KCdpZ25vcmVzIGNvbG9yIGlmIGZpbGwgaXMgc3BlY2lmaWVkJywgbG9nLndyYXAoKGxvZ2dlcikgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcImdlbmRlclwiLCBcInR5cGVcIjogXCJub21pbmFsXCIsXG4gICAgICAgICAgICBcInNjYWxlXCI6IHtcInJhbmdlU3RlcFwiOiA2fSxcbiAgICAgICAgICAgIFwiYXhpc1wiOiBudWxsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImZpbGxcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcImdlbmRlclwiLCBcInR5cGVcIjogXCJub21pbmFsXCIsXG4gICAgICAgICAgICBcInNjYWxlXCI6IHtcInJhbmdlXCI6IFtcIiNFQTk4RDJcIiwgXCIjNjU5Q0NBXCJdfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjb2xvclwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwiZ2VuZGVyXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIixcbiAgICAgICAgICAgIFwic2NhbGVcIjoge1wicmFuZ2VcIjogW1wiI0VBOThEMlwiLCBcIiM2NTlDQ0FcIl19XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBjb2xvck1peGlucyA9IGNvbG9yKG1vZGVsKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChjb2xvck1peGlucy5zdHJva2UpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChjb2xvck1peGlucy5maWxsLCB7XCJmaWVsZFwiOiBcImdlbmRlclwiLCBcInNjYWxlXCI6IFwiZmlsbFwifSk7XG4gICAgICBhc3NlcnQuZXF1YWwobG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5kcm9wcGluZ0NvbG9yKCdlbmNvZGluZycsIHtmaWxsOiB0cnVlfSkpO1xuICAgIH0pKTtcblxuICAgIGl0KCdpZ25vcmVzIGNvbG9yIHByb3BlcnR5IGlmIGZpbGwgaXMgc3BlY2lmaWVkJywgbG9nLndyYXAoKGxvZ2dlcikgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjoge1widHlwZVwiOiBcInBvaW50XCIsIFwiY29sb3JcIjogXCJyZWRcIn0sXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwiZ2VuZGVyXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIixcbiAgICAgICAgICAgIFwic2NhbGVcIjoge1wicmFuZ2VTdGVwXCI6IDZ9LFxuICAgICAgICAgICAgXCJheGlzXCI6IG51bGxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZmlsbFwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwiZ2VuZGVyXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIixcbiAgICAgICAgICAgIFwic2NhbGVcIjoge1wicmFuZ2VcIjogW1wiI0VBOThEMlwiLCBcIiM2NTlDQ0FcIl19XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBjb2xvck1peGlucyA9IGNvbG9yKG1vZGVsKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChjb2xvck1peGlucy5zdHJva2UpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChjb2xvck1peGlucy5maWxsLCB7XCJmaWVsZFwiOiBcImdlbmRlclwiLCBcInNjYWxlXCI6IFwiZmlsbFwifSk7XG4gICAgICBhc3NlcnQuZXF1YWwobG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5kcm9wcGluZ0NvbG9yKCdwcm9wZXJ0eScsIHtmaWxsOiB0cnVlfSkpO1xuICAgIH0pKTtcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgc3Ryb2tlIHByb3BlcnR5IG92ZXIgY29sb3IgcHJvcGVydHknLCBsb2cud3JhcCgobG9nZ2VyKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiB7XCJ0eXBlXCI6IFwicG9pbnRcIiwgXCJjb2xvclwiOiBcInJlZFwiLCBcInN0cm9rZVwiOiBcImJsdWVcIn0sXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIkhvcnNlcG93ZXJcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcIk1pbGVzX3Blcl9HYWxsb25cIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgcHJvcHMgPSBjb2xvcihtb2RlbCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnN0cm9rZSwge3ZhbHVlOiBcImJsdWVcIn0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGxvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UuZHJvcHBpbmdDb2xvcigncHJvcGVydHknLCB7c3Ryb2tlOiB0cnVlfSkpO1xuICAgIH0pKTtcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgaWdub3JlIGNvbG9yIHByb3BlcnR5IHdoZW4gZmlsbCBpcyBzcGVjaWZpZWQnLCBsb2cud3JhcCgobG9nZ2VyKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiB7XCJ0eXBlXCI6IFwicG9pbnRcIiwgXCJjb2xvclwiOiBcInJlZFwiLCBcImZpbGxcIjogXCJibHVlXCJ9LFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJIb3JzZXBvd2VyXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJNaWxlc19wZXJfR2FsbG9uXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHByb3BzID0gY29sb3IobW9kZWwpO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKHByb3BzLnN0cm9rZSk7XG4gICAgICBhc3NlcnQuZXF1YWwobG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5kcm9wcGluZ0NvbG9yKCdwcm9wZXJ0eScsIHtmaWxsOiB0cnVlfSkpO1xuICAgIH0pKTtcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgY29sb3IgcHJvcGVydHknLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiB7XCJ0eXBlXCI6IFwicG9pbnRcIiwgXCJjb2xvclwiOiBcInJlZFwifSxcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiSG9yc2Vwb3dlclwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiTWlsZXNfcGVyX0dhbGxvblwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBwcm9wcyA9IGNvbG9yKG1vZGVsKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuc3Ryb2tlLCB7dmFsdWU6IFwicmVkXCJ9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgY29sb3IgZnJvbSBtYXJrLXNwZWNpZmljIGNvbmZpZyBvdmVyIGdlbmVyYWwgbWFyayBjb25maWcnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIkhvcnNlcG93ZXJcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcIk1pbGVzX3Blcl9HYWxsb25cIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH0sXG4gICAgICAgIFwiY29uZmlnXCI6IHtcIm1hcmtcIjoge1wiY29sb3JcIjogXCJibHVlXCJ9LCBcInBvaW50XCI6IHtcImNvbG9yXCI6IFwicmVkXCJ9fVxuICAgICAgfSk7XG4gICAgICBjb25zdCBwcm9wcyA9IGNvbG9yKG1vZGVsKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuc3Ryb2tlLCB7dmFsdWU6IFwicmVkXCJ9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgc3Ryb2tlIG1hcmsgY29uZmlnIG92ZXIgY29sb3IgbWFyayBjb25maWcnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIkhvcnNlcG93ZXJcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcIk1pbGVzX3Blcl9HYWxsb25cIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH0sXG4gICAgICAgIFwiY29uZmlnXCI6IHtcIm1hcmtcIjoge1wiY29sb3JcIjogXCJyZWRcIiwgXCJzdHJva2VcIjogXCJibHVlXCJ9fVxuICAgICAgfSk7XG4gICAgICBjb25zdCBwcm9wcyA9IGNvbG9yKG1vZGVsKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuc3Ryb2tlLCB7dmFsdWU6IFwiYmx1ZVwifSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IHN0cm9rZSBtYXJrIGNvbmZpZyBvdmVyIGNvbG9yIG1hcmsgY29uZmlnJywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJIb3JzZXBvd2VyXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJNaWxlc19wZXJfR2FsbG9uXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9LFxuICAgICAgICBcImNvbmZpZ1wiOiB7XCJwb2ludFwiOiB7XCJjb2xvclwiOiBcInJlZFwiLCBcInN0cm9rZVwiOiBcImJsdWVcIn19XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHByb3BzID0gY29sb3IobW9kZWwpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5zdHJva2UsIHt2YWx1ZTogXCJibHVlXCJ9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3Rvb2x0aXAoKScsICgpID0+IHtcbiAgICBpdCgnZ2VuZXJhdGVzIHRvb2x0aXAgb2JqZWN0IHNpZ25hbCBmb3IgYW4gYXJyYXkgb2YgdG9vbHRpcCBmaWVsZHMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwidG9vbHRpcFwiOiBbXG4gICAgICAgICAgICB7XCJmaWVsZFwiOiBcIkhvcnNlcG93ZXJcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAge1wiZmllbGRcIjogXCJBY2NlbGVyYXRpb25cIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHByb3BzID0gdG9vbHRpcChtb2RlbCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnRvb2x0aXAsIHtzaWduYWw6ICd7XCJIb3JzZXBvd2VyXCI6IGZvcm1hdChkYXR1bVtcIkhvcnNlcG93ZXJcIl0sIFwiXCIpLCBcIkFjY2VsZXJhdGlvblwiOiBmb3JtYXQoZGF0dW1bXCJBY2NlbGVyYXRpb25cIl0sIFwiXCIpfSd9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ21pZFBvaW50KCknLCBmdW5jdGlvbiAoKSB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdGx5IGZvciBsYXQvbG5nJywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcImRhdGFcIjoge1xuICAgICAgICAgIFwidXJsXCI6IFwiZGF0YS96aXBjb2Rlcy5jc3ZcIixcbiAgICAgICAgICBcImZvcm1hdFwiOiB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJjc3ZcIlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJsb25naXR1ZGVcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvbmdpdHVkZVwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwibGF0aXR1ZGVcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxhdGl0dWRlXCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIFtYLCBZXS5mb3JFYWNoKChjaGFubmVsKSA9PiB7XG4gICAgICAgIGNvbnN0IG1peGlucyA9IHBvaW50UG9zaXRpb24oY2hhbm5lbCwgbW9kZWwsICd6ZXJvT3JNaW4nKTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwobWl4aW5zW2NoYW5uZWxdLmZpZWxkLCBtb2RlbC5nZXROYW1lKGNoYW5uZWwpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19