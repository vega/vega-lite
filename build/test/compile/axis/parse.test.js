/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../../util");
var axisParse = require("../../../src/compile/axis/parse");
var channel_1 = require("../../../src/channel");
describe('Axis', function () {
    // TODO: move this to model.test.ts
    describe('= true', function () {
        it('should produce default properties for axis', function () {
            var model1 = util_1.parseUnitModel({
                "mark": "bar",
                "encoding": {
                    "y": { "type": "quantitative", "field": 'US_Gross', "aggregate": "sum", "axis": true }
                },
                "data": { "url": "data/movies.json" }
            });
            var model2 = util_1.parseUnitModel({
                "mark": "bar",
                "encoding": {
                    "y": { "type": "quantitative", "field": 'US_Gross', "aggregate": "sum" }
                },
                "data": { "url": "data/movies.json" }
            });
            chai_1.assert.deepEqual(model1.axis(channel_1.Y), model2.axis(channel_1.Y));
        });
    });
    describe('parseAxisComponent', function () {
        it('should produce Vega grid axis objects for both main axis and for grid axis)', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: {
                        field: "a",
                        type: "quantitative",
                        axis: { grid: true, gridColor: "blue", gridWidth: 20 }
                    }
                }
            });
            var axisComponent = axisParse.parseAxisComponent(model, ['x', 'y']);
            chai_1.assert.equal(axisComponent['x'].length, 2);
            chai_1.assert.equal(axisComponent['x'][0].grid, undefined);
            chai_1.assert.equal(axisComponent['x'][1].grid, true);
        });
        it('should produce Vega grid axis objects for only main axis if grid is disabled)', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: {
                        field: "a",
                        type: "quantitative",
                        axis: { grid: false, gridColor: "blue", gridWidth: 20 }
                    }
                }
            });
            var axisComponent = axisParse.parseAxisComponent(model, ['x', 'y']);
            chai_1.assert.equal(axisComponent['x'].length, 1);
            chai_1.assert.equal(axisComponent['x'][0].grid, undefined);
        });
    });
    describe('parseGridAxis', function () {
        it('should produce a Vega grid axis object with correct type, scale and grid properties', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: {
                        field: "a",
                        type: "quantitative",
                        axis: { grid: true }
                    }
                }
            });
            var def = axisParse.parseGridAxis(channel_1.X, model);
            chai_1.assert.isObject(def);
            chai_1.assert.equal(def.orient, 'bottom');
            chai_1.assert.equal(def.scale, 'x');
        });
    });
    describe('parseMainAxis', function () {
        it('should produce a Vega axis object with correct type and scale', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "quantitative" }
                }
            });
            var def = axisParse.parseMainAxis(channel_1.X, model);
            chai_1.assert.isObject(def);
            chai_1.assert.equal(def.orient, 'bottom');
            chai_1.assert.equal(def.scale, 'x');
        });
    });
});
//# sourceMappingURL=parse.test.js.map