import {assert} from 'chai';
import {DataFlowNode} from '../../../src/compile/data/dataflow';
import {GeoPointNode} from '../../../src/compile/data/geopoint';
import {contains, every} from '../../../src/util';
import {VgGeoPointTransform} from '../../../src/vega.schema';
import {parseUnitModel} from '../../util';

describe('compile/data/geopoint', () => {
  describe('geojson', function () {
    it('should make transform and assemble correctly', () => {
      const model = parseUnitModel({
        'data': {
          'url': 'data/zipcodes.csv',
          'format': {
            'type': 'csv'
          }
        },
        'mark': 'circle',
        'encoding': {
          'x': {
            'field': 'longitude',
            'type': 'longitude'
          },
          'y': {
            'field': 'latitude',
            'type': 'latitude'
          }
        }
      });
      model.parse();

      const root = new DataFlowNode(null);
      GeoPointNode.parseAll(root, model);

      let node = root.children[0];

      while (node != null) {
        assert.instanceOf(node, GeoPointNode);

        const transform: VgGeoPointTransform = (<GeoPointNode>node).assemble();
        assert.equal(transform.type, 'geopoint');
        assert.isTrue(every(['longitude', 'latitude'], (field) => contains(transform.fields, field)));
        assert.isTrue(every(['longitude_geo', 'latitude_geo'], (a) => contains(transform.as, a)));
        assert.isDefined(transform.projection);
        assert.isAtMost(node.children.length, 1);
        node = node.children[0];
      }
    });
  });
});
