/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../../util");
var mixins_1 = require("../../../src/compile/mark/mixins");
describe('compile/mark/mixins', function () {
    describe('color()', function () {
        it('color should be mapped to fill for bar', function () {
            var model = util_1.parseUnitModel({
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
            var model = util_1.parseUnitModel({
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
            chai_1.assert.deepEqual(colorMixins.fill.value, "transparent");
        });
    });
});
//# sourceMappingURL=mixins.test.js.map