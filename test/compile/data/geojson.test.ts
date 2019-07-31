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

    let node = root.children[0];

    while (node != null) {
      expect(node).toBeInstanceOf(GeoJSONNode);
      const transform = (node as GeoJSONNode).assemble();
      expect(transform.type).toBe('geojson');
      expect(every(['longitude', 'latitude'], field => contains(transform.fields, field))).toBe(true);
      expect(transform.geojson).not.toBeDefined();

      expect(node.children.length).toBeLessThanOrEqual(1);
      node = node.children[0];
    }
  });
  it('should skip geojson if custom projection', () => {
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
    expect(root.children.length).toBe(0);
  });
});
