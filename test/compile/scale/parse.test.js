/* tslint:disable:quotemark */
"use strict";
var chai_1 = require("chai");
var parse_1 = require("../../../src/compile/scale/parse");
var util_1 = require("../../util");
describe('src/compile', function () {
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
    describe('parseDomain()', function () {
        it('should have correct domain with x and x2 channel', function () {
            var model = util_1.parseUnitModel({
                mark: 'bar',
                encoding: {
                    x: { field: 'a', type: 'quantitative' },
                    x2: { field: 'b', type: 'quantitative' },
                    y: { field: 'c', type: 'quantitative' },
                    y2: { field: 'd', type: 'quantitative' }
                }
            });
            var xDomain = parse_1.parseDomain(model, 'x');
            chai_1.assert.deepEqual(xDomain, { data: 'source', fields: ['a', 'b'] });
            var yDomain = parse_1.parseDomain(model, 'y');
            chai_1.assert.deepEqual(yDomain, { data: 'source', fields: ['c', 'd'] });
        });
        it('should have correct domain for color', function () {
            var model = util_1.parseUnitModel({
                mark: 'bar',
                encoding: {
                    color: { field: 'a', type: 'quantitative' },
                }
            });
            var xDomain = parse_1.parseDomain(model, 'color');
            chai_1.assert.deepEqual(xDomain, { data: 'source', field: 'a' });
        });
    });
});
//# sourceMappingURL=parse.test.js.map