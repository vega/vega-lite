"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var dataflow_1 = require("../../../src/compile/data/dataflow");
var geopoint_1 = require("../../../src/compile/data/geopoint");
var util_1 = require("../../../src/util");
var util_2 = require("../../util");
describe('compile/data/geopoint', function () {
    describe('geojson', function () {
        it('should make transform and assemble correctly', function () {
            var model = util_2.parseUnitModel({
                data: {
                    url: 'data/zipcodes.csv',
                    format: {
                        type: 'csv'
                    }
                },
                mark: 'circle',
                encoding: {
                    longitude: {
                        field: 'longitude',
                        type: 'quantitative'
                    },
                    latitude: {
                        field: 'latitude',
                        type: 'quantitative'
                    }
                }
            });
            model.parse();
            var root = new dataflow_1.DataFlowNode(null);
            geopoint_1.GeoPointNode.parseAll(root, model);
            var node = root.children[0];
            var _loop_1 = function () {
                chai_1.assert.instanceOf(node, geopoint_1.GeoPointNode);
                var transform = node.assemble();
                chai_1.assert.equal(transform.type, 'geopoint');
                chai_1.assert.isTrue(util_1.every(['longitude', 'latitude'], function (field) { return util_1.contains(transform.fields, field); }));
                chai_1.assert.isTrue(util_1.every([model.getName('x'), model.getName('y')], function (a) { return util_1.contains(transform.as, a); }));
                chai_1.assert.isDefined(transform.projection);
                chai_1.assert.isAtMost(node.children.length, 1);
                node = node.children[0];
            };
            while (node != null) {
                _loop_1();
            }
        });
    });
});
//# sourceMappingURL=geopoint.test.js.map