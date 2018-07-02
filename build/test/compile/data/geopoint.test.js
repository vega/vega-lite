import { assert } from 'chai';
import { DataFlowNode } from '../../../src/compile/data/dataflow';
import { GeoPointNode } from '../../../src/compile/data/geopoint';
import { contains, every } from '../../../src/util';
import { parseUnitModel } from '../../util';
describe('compile/data/geopoint', function () {
    describe('geojson', function () {
        it('should make transform and assemble correctly', function () {
            var model = parseUnitModel({
                'data': {
                    'url': 'data/zipcodes.csv',
                    'format': {
                        'type': 'csv'
                    }
                },
                'mark': 'circle',
                'encoding': {
                    'longitude': {
                        'field': 'longitude',
                        'type': 'quantitative'
                    },
                    'latitude': {
                        'field': 'latitude',
                        'type': 'quantitative'
                    }
                }
            });
            model.parse();
            var root = new DataFlowNode(null);
            GeoPointNode.parseAll(root, model);
            var node = root.children[0];
            var _loop_1 = function () {
                assert.instanceOf(node, GeoPointNode);
                var transform = node.assemble();
                assert.equal(transform.type, 'geopoint');
                assert.isTrue(every(['longitude', 'latitude'], function (field) { return contains(transform.fields, field); }));
                assert.isTrue(every([model.getName('x'), model.getName('y')], function (a) { return contains(transform.as, a); }));
                assert.isDefined(transform.projection);
                assert.isAtMost(node.children.length, 1);
                node = node.children[0];
            };
            while (node != null) {
                _loop_1();
            }
        });
    });
});
//# sourceMappingURL=geopoint.test.js.map