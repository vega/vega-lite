/* tslint:disable:quotemark */
"use strict";
var chai_1 = require("chai");
var util_1 = require("../util");
var log = require("../../src/log");
var compile_1 = require("../../src/compile/compile");
describe('Compile', function () {
    it('should throw error for invalid spec', function () {
        chai_1.assert.throws(function () {
            compile_1.compile({});
        }, Error, log.message.INVALID_SPEC);
    });
    describe('compile', function () {
        it('should return a spec with basic top-level properties, size signals, data and marks', function () {
            var spec = compile_1.compile({
                "data": {
                    "values": [{ "a": "A", "b": 28 }]
                },
                "mark": "point",
                "encoding": {}
            }).spec;
            chai_1.assert.equal(spec.padding, 5);
            chai_1.assert.equal(spec.autosize, 'pad');
            chai_1.assert.deepEqual(spec.signals, [
                {
                    name: 'width',
                    update: "data('layout')[0].width"
                },
                {
                    name: 'height',
                    update: "data('layout')[0].height"
                }
            ]);
            chai_1.assert.equal(spec.data.length, 2); // just source and layout
            chai_1.assert.equal(spec.marks.length, 1); // just the root group
        });
    });
    describe('assembleRootGroup()', function () {
        it('produce correct from and size.', function () {
            var model = util_1.parseUnitModel({
                "description": "A simple bar chart with embedded data.",
                "data": {
                    "values": [
                        { "a": "A", "b": 28 }, { "a": "B", "b": 55 }, { "a": "C", "b": 43 },
                        { "a": "D", "b": 91 }, { "a": "E", "b": 81 }, { "a": "F", "b": 53 },
                        { "a": "G", "b": 19 }, { "a": "H", "b": 87 }, { "a": "I", "b": 52 }
                    ]
                },
                "mark": "bar",
                "encoding": {
                    "x": { "field": "a", "type": "ordinal" },
                    "y": { "field": "b", "type": "quantitative" }
                }
            });
            var rootGroup = compile_1.assembleRootGroup(model);
            chai_1.assert.deepEqual(rootGroup.from, { "data": "layout" });
            chai_1.assert.deepEqual(rootGroup.encode.update.width, { field: "width" });
            chai_1.assert.deepEqual(rootGroup.encode.update.height, { field: "height" });
        });
        it('produce correct from and size when a chart name is provided.', function () {
            var model = util_1.parseUnitModel({
                "name": "chart",
                "description": "A simple bar chart with embedded data.",
                "data": {
                    "values": [
                        { "a": "A", "b": 28 }, { "a": "B", "b": 55 }, { "a": "C", "b": 43 },
                        { "a": "D", "b": 91 }, { "a": "E", "b": 81 }, { "a": "F", "b": 53 },
                        { "a": "G", "b": 19 }, { "a": "H", "b": 87 }, { "a": "I", "b": 52 }
                    ]
                },
                "mark": "bar",
                "encoding": {
                    "x": { "field": "a", "type": "ordinal" },
                    "y": { "field": "b", "type": "quantitative" }
                }
            });
            var rootGroup = compile_1.assembleRootGroup(model);
            chai_1.assert.deepEqual(rootGroup.from, { "data": "chart_layout" });
            chai_1.assert.deepEqual(rootGroup.encode.update.width, { field: "chart_width" });
            chai_1.assert.deepEqual(rootGroup.encode.update.height, { field: "chart_height" });
        });
    });
});
//# sourceMappingURL=compile.test.js.map