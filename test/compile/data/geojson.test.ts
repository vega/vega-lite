import {FieldRef, GeoJSONTransform, Vector2} from 'vega';
import {GeoJSONNode} from '../../../src/compile/data/geojson';
import {contains, every} from '../../../src/util';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util';
import {PlaceholderDataFlowNode} from './util';

describe('compile/data/geojson', () => {
  it('should make transform and assemble correctly', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
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

    const root = new PlaceholderDataFlowNode(null);
    GeoJSONNode.parseAll(root, model);

    const node = root.children[0];

    expect(node).toBeInstanceOf(GeoJSONNode);
    const transforms = (node as GeoJSONNode).assemble();

    expect(transforms).toHaveLength(1);

    const geoJSONTransform = transforms[0] as GeoJSONTransform;

    expect(geoJSONTransform.type).toBe('geojson');
    expect(
      every(['longitude', 'latitude'], field => contains(geoJSONTransform.fields as Vector2<FieldRef>, field))
    ).toBe(true);
    expect(geoJSONTransform.geojson).not.toBeDefined();
  });

  it('should add filter when shape channel is used', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {values: []},
      mark: 'geoshape',
      encoding: {
        shape: {field: 'geo', type: 'geojson'},
        color: {field: 'state', type: 'nominal'}
      }
    });

    const root = new PlaceholderDataFlowNode(null);
    GeoJSONNode.parseAll(root, model);

    const node = root.children[0];

    expect(node).toBeInstanceOf(GeoJSONNode);
    const transforms = (node as GeoJSONNode).assemble();

    expect(transforms).toHaveLength(2);

    expect(transforms[0]).toEqual({
      type: 'filter',
      expr: 'isValid(datum["geo"])'
    });

    const geoJSONTransform = transforms[1] as GeoJSONTransform;

    expect(geoJSONTransform.type).toBe('geojson');
    expect(geoJSONTransform.geojson).toBe('geo');
  });

  it('should skip geojson when there is a custom projection', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {
        url: 'data/zipcodes.csv',
        format: {
          type: 'csv'
        }
      },
      projection: {
        type: 'mercator',
        scale: 1000
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
    const retval = GeoJSONNode.parseAll(root, model);

    expect(retval).toBe(root);
    expect(root.children).toHaveLength(0);
  });

  describe('GeoJSONNode', () => {
    describe('dependentFields', () => {
      it('should return fields', () => {
        const flatten = new GeoJSONNode(null, ['foo', {expr: 's'}], null);
        expect(flatten.dependentFields()).toEqual(new Set(['foo']));
      });
      it('should return geojson', () => {
        const flatten = new GeoJSONNode(null, null, 'geo');
        expect(flatten.dependentFields()).toEqual(new Set(['geo']));
      });
    });

    describe('producedFields', () => {
      it('should return empty set', () => {
        const flatten = new GeoJSONNode(null);
        expect(flatten.producedFields()).toEqual(new Set());
      });
    });
  });
});
