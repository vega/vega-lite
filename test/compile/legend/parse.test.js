/* tslint:disable:quotemark */
"use strict";
var chai_1 = require("chai");
var util_1 = require("../../util");
var channel_1 = require("../../../src/channel");
var legendParse = require("../../../src/compile/legend/parse");
describe('compile/legend', function () {
    describe('parseLegend()', function () {
        it('should produce a Vega axis object with correct type and scale', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    color: { field: "a", type: "nominal" }
                }
            });
            var def = legendParse.parseLegend(model, channel_1.COLOR);
            chai_1.assert.isObject(def);
            chai_1.assert.equal(def.title, "a");
        });
        it('should produce correct encode block if needed', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    color: { field: "a", type: "quantitative", "legend": { "labelColor": "#0099ff" } }
                }
            });
            var def = legendParse.parseLegend(model, channel_1.COLOR);
            chai_1.assert.equal(def.encode.labels.update.fill.value, '#0099ff');
        });
    });
});
//# sourceMappingURL=parse.test.js.map