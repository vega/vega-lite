import {assert} from 'chai';
import {DataFlowNode} from '../../../src/compile/data/dataflow';
import {GeoJSONNode} from '../../../src/compile/data/geojson';
import {contains, every} from '../../../src/util';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util';
/* tslint:disable:quotemark */

describe('compile/data/geojson', () => {
  it('should make transform and assemble correctly', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "data": {
        "url": "data/zipcodes.csv",
        "format": {
          "type": "csv"
        }
      },
      "mark": "circle",
      "encoding": {
        "x": {
          "field": "longitude",
          "type": "longitude"
        },
        "y": {
          "field": "latitude",
          "type": "latitude"
        }
      }
    });

    const root = new DataFlowNode(null);
    GeoJSONNode.parseAll(root, model);

    let node = root.children[0];

    while (node != null) {
      assert.instanceOf(node, GeoJSONNode);
      const transform = (<GeoJSONNode>node).assemble();
      assert.equal(transform.type, 'geojson');
      assert.isTrue(every(['longitude', 'latitude'], (field) => contains(transform.fields, field)));
      assert.isUndefined(transform.geojson);

      assert.isAtMost(node.children.length, 1);
      node = node.children[0];
    }
  });
});
