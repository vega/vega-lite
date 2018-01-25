import {assert} from 'chai';
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
      const nodes: GeoPointNode[] = GeoPointNode.makeAll(model);
      assert.isNotNull(nodes);
      assert.isNotEmpty(nodes);
      nodes.forEach((node) => {
        assert.isNotNull(node);
        if (node) {
          const transform: VgGeoPointTransform = node.assemble();
          assert.equal(transform.type, 'geopoint');
          assert.isTrue(every(['longitude', 'latitude'], (field) => contains(transform.fields, field)));
          assert.isTrue(every(['longitude_geo', 'latitude_geo'], (a) => contains(transform.as, a)));
          assert.isDefined(transform.projection);
        }
      });
    });
  });
});
