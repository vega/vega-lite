/* tslint:disable:quotemark */
"use strict";
var chai_1 = require("chai");
var util_1 = require("../../util");
var common_1 = require("../../../src/compile/mark/common");
describe('compile/mark/common', function () {
    describe('applyColorAndOpacity()', function () {
        it('opacity should be mapped to a field if specified', function () {
            var model = util_1.parseUnitModel({
                "mark": "bar",
                "encoding": {
                    "y": { "type": "quantitative", "field": 'US_Gross', "aggregate": "sum", "axis": true },
                    "opacity": { "field": "US_Gross", "type": "quantitative" }
                },
                "data": { "url": "data/movies.json" }
            });
            var p = {};
            common_1.applyColorAndOpacity(p, model);
            chai_1.assert.deepEqual(p.opacity.field, 'US_Gross');
        });
        it('opacity should be mapped to a value if specified', function () {
            var model = util_1.parseUnitModel({
                "mark": "bar",
                "encoding": {
                    "y": { "type": "quantitative", "field": 'US_Gross', "aggregate": "sum", "axis": true },
                    "opacity": { "value": 0.5 }
                },
                "data": { "url": "data/movies.json" }
            });
            var p = {};
            common_1.applyColorAndOpacity(p, model);
            chai_1.assert.deepEqual(p.opacity.value, 0.5);
        });
    });
});
//# sourceMappingURL=common.test.js.map