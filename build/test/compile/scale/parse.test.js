/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var parse_1 = require("../../../src/compile/scale/parse");
var parse_2 = require("../../../src/compile/scale/parse");
var util_1 = require("../../util");
var scale_1 = require("../../../src/scale");
;
var util_2 = require("../../../src/util");
describe('src/compile', function () {
    it('NON_TYPE_RANGE_SCALE_PROPERTIES should be SCALE_PROPERTIES wihtout type, domain, and range properties', function () {
        chai_1.assert.deepEqual(util_2.toSet(parse_2.NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES), util_2.toSet(util_2.without(scale_1.SCALE_PROPERTIES, ['type', 'domain', 'range', 'rangeStep', 'scheme'])));
    });
    describe('parseScale', function () {
        describe('x ordinal point', function () {
            it('should create a main x point scale with rangeStep and no range', function () {
                var model = util_1.parseUnitModel({
                    mark: "point",
                    encoding: {
                        x: { field: 'origin', type: "nominal" }
                    }
                });
                var scales = parse_1.parseScale(model, 'x');
                chai_1.assert.equal(scales.main.type, 'point');
                chai_1.assert.deepEqual(scales.main.range, { step: 21 });
            });
        });
        describe('nominal with color', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    color: { field: 'origin', type: "nominal" }
                }
            });
            var scales = parse_1.parseScale(model, 'color');
            it('should create correct main color scale', function () {
                chai_1.assert.equal(scales.main.name, 'color');
                chai_1.assert.equal(scales.main.type, 'ordinal');
                chai_1.assert.deepEqual(scales.main.domain, {
                    data: 'source',
                    field: 'origin',
                    sort: true
                });
                chai_1.assert.equal(scales.main.range, 'category');
            });
        });
        describe('ordinal with color', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    color: { field: 'origin', type: "ordinal" }
                }
            });
            var scales = parse_1.parseScale(model, 'color');
            it('should create ordinal color scale', function () {
                chai_1.assert.equal(scales.main.name, 'color');
                chai_1.assert.equal(scales.main.type, 'ordinal');
                chai_1.assert.deepEqual(scales.main.domain, {
                    data: 'source',
                    field: 'origin',
                    sort: true
                });
            });
        });
        describe('quantitative with color', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    color: { field: "origin", type: "quantitative" }
                }
            });
            var scales = parse_1.parseScale(model, 'color');
            it('should create linear color scale', function () {
                chai_1.assert.equal(scales.main.name, 'color');
                chai_1.assert.equal(scales.main.type, 'sequential');
                chai_1.assert.equal(scales.main.range, 'ramp');
                chai_1.assert.deepEqual(scales.main.domain, {
                    data: 'source',
                    field: 'origin'
                });
            });
        });
        describe('color with bin', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    color: { field: "origin", type: "quantitative", bin: true }
                }
            });
            var scales = parse_1.parseScale(model, 'color');
            it('should add correct scales', function () {
                chai_1.assert.equal(scales.main.name, 'color');
                chai_1.assert.equal(scales.main.type, 'sequential');
                chai_1.assert.equal(scales.binLegend.name, 'color_bin_legend');
                chai_1.assert.equal(scales.binLegend.type, 'point');
                chai_1.assert.equal(scales.binLegendLabel.name, 'color_bin_legend_label');
                chai_1.assert.equal(scales.binLegendLabel.type, 'ordinal');
            });
            it('should sort domain and range for labels', function () {
                chai_1.assert.deepEqual(scales.binLegendLabel.domain, {
                    data: 'source',
                    field: 'bin_origin_start',
                    sort: true
                });
                chai_1.assert.deepEqual(scales.binLegendLabel.range, {
                    data: 'source',
                    field: 'bin_origin_range',
                    sort: { "field": "bin_origin_start", "op": "min" }
                });
            });
        });
        describe('color with time unit', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    color: { field: 'origin', type: "temporal", timeUnit: "year" }
                }
            });
            var scales = parse_1.parseScale(model, 'color');
            it('should add correct scales', function () {
                chai_1.assert.equal(scales.main.name, 'color');
                chai_1.assert.equal(scales.main.type, 'sequential');
                chai_1.assert.equal(scales.binLegend, undefined);
                chai_1.assert.equal(scales.binLegendLabel, undefined);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9zY2FsZS9wYXJzZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4Qjs7O0FBRTlCLDZCQUE0QjtBQUU1QiwwREFBNEQ7QUFDNUQsMERBQTZGO0FBQzdGLG1DQUEwQztBQUcxQyw0Q0FBb0Q7QUFBQSxDQUFDO0FBQ3JELDBDQUFpRDtBQUVqRCxRQUFRLENBQUMsYUFBYSxFQUFFO0lBQ3RCLEVBQUUsQ0FBQyx1R0FBdUcsRUFBRTtRQUMxRyxhQUFNLENBQUMsU0FBUyxDQUNkLFlBQUssQ0FBQyxtREFBMkMsQ0FBQyxFQUNsRCxZQUFLLENBQUMsY0FBTyxDQUFDLHdCQUFnQixFQUFFLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FDckYsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFlBQVksRUFBRTtRQUNyQixRQUFRLENBQUMsaUJBQWlCLEVBQUU7WUFDMUIsRUFBRSxDQUFDLGdFQUFnRSxFQUFFO2dCQUNuRSxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO29CQUMzQixJQUFJLEVBQUUsT0FBTztvQkFDYixRQUFRLEVBQUU7d0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDO3FCQUN0QztpQkFDRixDQUFDLENBQUM7Z0JBQ0gsSUFBTSxNQUFNLEdBQUcsa0JBQVUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3RDLGFBQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3hDLGFBQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBQyxJ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