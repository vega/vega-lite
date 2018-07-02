import { assert } from 'chai';
import { DataFlowNode } from '../../../src/compile/data/dataflow';
import { GeoJSONNode } from '../../../src/compile/data/geojson';
import { contains, every } from '../../../src/util';
import { parseUnitModelWithScaleAndLayoutSize } from '../../util';
/* tslint:disable:quotemark */
describe('compile/data/geojson', function () {
    it('should make transform and assemble correctly', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
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
        var root = new DataFlowNode(null);
        GeoJSONNode.parseAll(root, model);
        var node = root.children[0];
        var _loop_1 = function () {
            assert.instanceOf(node, GeoJSONNode);
            var transform = node.assemble();
            assert.equal(transform.type, 'geojson');
            assert.isTrue(every(['longitude', 'latitude'], function (field) { return contains(transform.fields, field); }));
            assert.isUndefined(transform.geojson);
            assert.isAtMost(node.children.length, 1);
            node = node.children[0];
        };
        while (node != null) {
            _loop_1();
        }
    });
});
//# sourceMappingURL=geojson.test.js.map