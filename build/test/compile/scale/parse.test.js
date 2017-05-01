"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var parse_1 = require("../../../src/compile/scale/parse");
var parse_2 = require("../../../src/compile/scale/parse");
var util_1 = require("../../util");
var scale_1 = require("../../../src/scale");
var util_2 = require("../../../src/util");
describe('src/compile', function () {
    it('NON_TYPE_RANGE_SCALE_PROPERTIES should be SCALE_PROPERTIES wihtout type, domain, and range properties', function () {
        chai_1.assert.deepEqual(util_2.toSet(parse_2.NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES), util_2.toSet(util_2.without(scale_1.SCALE_PROPERTIES, ['type', 'domain', 'range', 'rangeStep', 'scheme'])));
    });
    describe('parseScale', function () {
        describe('x ordinal point', function () {
            it('should create an x point scale with rangeStep and no range', function () {
                var model = util_1.parseUnitModel({
                    mark: "point",
                    encoding: {
                        x: { field: 'origin', type: "nominal" }
                    }
                });
                var scales = parse_1.parseScale(model, 'x');
                chai_1.assert.equal(scales.type, 'point');
                chai_1.assert.deepEqual(scales.range, { step: 21 });
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
            it('should create correct color scale', function () {
                chai_1.assert.equal(scales.name, 'color');
                chai_1.assert.equal(scales.type, 'ordinal');
                chai_1.assert.deepEqual(scales.domain, {
                    data: 'main',
                    field: 'origin',
                    sort: true
                });
                chai_1.assert.equal(scales.range, 'category');
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
                chai_1.assert.equal(scales.name, 'color');
                chai_1.assert.equal(scales.type, 'ordinal');
                chai_1.assert.deepEqual(scales.domain, {
                    data: 'main',
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
                chai_1.assert.equal(scales.name, 'color');
                chai_1.assert.equal(scales.type, 'sequential');
                chai_1.assert.equal(scales.range, 'ramp');
                chai_1.assert.deepEqual(scales.domain, {
                    data: 'main',
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
                chai_1.assert.equal(scales.name, 'color');
                chai_1.assert.equal(scales.type, 'bin-ordinal');
            });
        });
        describe('ordinal color with bin', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    color: { field: "origin", type: "ordinal", bin: true }
                }
            });
            var scales = parse_1.parseScale(model, 'color');
            it('should add correct scales', function () {
                chai_1.assert.equal(scales.name, 'color');
                chai_1.assert.equal(scales.type, 'ordinal');
            });
        });
        describe('opacity with bin', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    opacity: { field: "origin", type: "quantitative", bin: true }
                }
            });
            var scales = parse_1.parseScale(model, 'opacity');
            it('should add correct scales', function () {
                chai_1.assert.equal(scales.name, 'opacity');
                chai_1.assert.equal(scales.type, 'bin-linear');
            });
        });
        describe('size with bin', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    size: { field: "origin", type: "quantitative", bin: true }
                }
            });
            var scales = parse_1.parseScale(model, 'size');
            it('should add correct scales', function () {
                chai_1.assert.equal(scales.name, 'size');
                chai_1.assert.equal(scales.type, 'bin-linear');
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
                chai_1.assert.equal(scales.name, 'color');
                chai_1.assert.equal(scales.type, 'sequential');
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9zY2FsZS9wYXJzZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUU1QiwwREFBNEQ7QUFDNUQsMERBQTZGO0FBQzdGLG1DQUEwQztBQUcxQyw0Q0FBb0Q7QUFDcEQsMENBQWlEO0FBRWpELFFBQVEsQ0FBQyxhQUFhLEVBQUU7SUFDdEIsRUFBRSxDQUFDLHVHQUF1RyxFQUFFO1FBQzFHLGFBQU0sQ0FBQyxTQUFTLENBQ2QsWUFBSyxDQUFDLG1EQUEyQyxDQUFDLEVBQ2xELFlBQUssQ0FBQyxjQUFPLENBQUMsd0JBQWdCLEVBQUUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUNyRixDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsWUFBWSxFQUFFO1FBQ3JCLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtZQUMxQixFQUFFLENBQUMsNERBQTRELEVBQUU7Z0JBQy9ELElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7b0JBQzNCLElBQUksRUFBRSxPQUFPO29CQUNiLFFBQVEsRUFBRTt3QkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7cUJBQ3RDO2lCQUNGLENBQUMsQ0FBQztnQkFDSCxJQUFNLE1BQU0sR0FBRyxrQkFBVSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDdEMsYUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUNuQyxhQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQztZ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