import {FieldRef, GeoPointTransform as VgGeoPointTransform, Vector2} from 'vega';
import {GeoPointNode} from '../../../src/compile/data/geopoint';
import {contains, every} from '../../../src/util';
import {parseUnitModel} from '../../util';
import {PlaceholderDataFlowNode} from './util';

describe('compile/data/geopoint', () => {
  describe('geojson', () => {
    it('should make transform and assemble correctly', () => {
      const model = parseUnitModel({
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

      const root = new PlaceholderDataFlowNode(null);
      GeoPointNode.parseAll(root, model);

      let node = root.children[0];

      while (node != null) {
        expect(node).toBeInstanceOf(GeoPointNode);

        const transform: VgGeoPointTransform = (node as GeoPointNode).assemble();
        expect(transform.type).toBe('geopoint');
        expect(every(['longitude', 'latitude'], field => contains(transform.fields as Vector2<FieldRef>, field))).toBe(
          true
        );
        expect(
          every([model.getName('x'), model.getName('y')], a => contains(transform.as as Vector2<FieldRef>, a))
        ).toBe(true);
        expect(transform.projection).toBeDefined();
        expect(node.children.length).toBeLessThanOrEqual(1);
        node = node.children[0];
      }
    });
  });

  describe('GeoPointNode', () => {
    describe('dependentFields', () => {
      it('should return empty set', () => {
        const gp = new GeoPointNode(null, 'mercator', ['foo', 'bar'], ['f1', 'f2']);
        expect(gp.dependentFields()).toEqual(new Set(['foo', 'bar']));
      });
    });

    describe('producedFields', () => {
      it('should return empty set', () => {
        const gp = new GeoPointNode(null, 'mercator', ['foo', 'bar'], ['f1', 'f2']);
        expect(gp.producedFields()).toEqual(new Set(['f1', 'f2']));
      });
    });
  });
});
