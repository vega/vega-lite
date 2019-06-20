"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var dataflow_1 = require("../../../src/compile/data/dataflow");
var geojson_1 = require("../../../src/compile/data/geojson");
var util_1 = require("../../../src/util");
var util_2 = require("../../util");
/* tslint:disable:quotemark */
describe('compile/data/geojson', function () {
    it('should make transform and assemble correctly', function () {
        var model = util_2.parseUnitModelWithScaleAndLayoutSize({
            "data": {
                "url": "data/zipcodes.csv",
                "format": {
                    "type": "csv"
                }
            },
            "mark": "circle",
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
        var root = new dataflow_1.DataFlowNode(null);
        geojson_1.GeoJSONNode.parseAll(root, model);
        var node = root.children[0];
        var _loop_1 = function () {
            chai_1.assert.instanceOf(node, geojson_1.GeoJSONNode);
            var transform = node.assemble();
            chai_1.assert.equal(transform.type, 'geojson');
            chai_1.assert.isTrue(util_1.every(['longitude', 'latitude'], function (field) { return util_1.contains(transform.fields, field); }));
            chai_1.assert.isUndefined(transform.geojson);
            chai_1.assert.isAtMost(node.children.length, 1);
            node = node.children[0];
        };
        while (node != null) {
            _loop_1();
        }
    });
});
//# sourceMappingURL=geojson.test.js.map