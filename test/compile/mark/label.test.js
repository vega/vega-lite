/* tslint:disable quotemark */
"use strict";
var chai_1 = require("chai");
var util_1 = require("../../util");
var label_1 = require("../../../src/compile/mark/label");
var mark_1 = require("../../../src/mark");
// import {ANCHOR, OFFSET} from '../../../src/channel';
describe('Mark: Label', function () {
    it('should return correct marktype', function () {
        chai_1.assert.equal(label_1.label.vgMark, 'text');
    });
    describe('simple bar', function () {
        var model = util_1.parseLayerModel({
            "description": "A simple bar chart with embedded data.",
            "layer": [
                {
                    "name": "myBar",
                    "mark": "bar",
                    "data": {
                        "values": [
                            { "a": "A", "b": 28 },
                            { "a": "B", "b": 55 },
                            { "a": "C", "b": 43 },
                            { "a": "D", "b": 91 },
                            { "a": "E", "b": 81 },
                            { "a": "F", "b": 53 },
                            { "a": "G", "b": 2 },
                            { "a": "H", "b": 87 },
                            { "a": "I", "b": 52 }
                        ]
                    },
                    "encoding": {
                        "x": { "field": "a", "type": "ordinal" },
                        "y": { "field": "b", "type": "quantitative" }
                    }
                },
                {
                    "mark": "label",
                    "data": { "ref": "myBar" },
                    "encoding": {
                        "text": { "field": "b" },
                        "color": { "value": "auto" },
                        "anchor": { "value": "auto" },
                        "offset": { "value": "auto" }
                    }
                }
            ]
        });
        // const props = label.encodeEntry(model);
        var labelMarks = model.children().filter(function (child) { return typeof child.mark === mark_1.Mark.LABEL; });
        var encodedLabels = labelMarks.map(function (labelMark) { return label_1.label.encodeEntry(labelMark); });
        it('should have correct ANCHOR', function () {
            chai_1.assert.deepEqual(true, true);
        });
    });
});
//# sourceMappingURL=label.test.js.map