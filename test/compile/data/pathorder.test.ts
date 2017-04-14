/* tslint:disable:quotemark */

import {assert} from 'chai';
import {OrderNode} from '../../../src/compile/data/pathorder';
import {UnitModel} from '../../../src/compile/unit';
import {VgCollectTransform} from '../../../src/vega.schema';
import {parseUnitModel} from '../../util';

function assemble(model: UnitModel) {
  return OrderNode.make(model).assemble();
}

describe('compile/data/pathorder', function() {
  describe('compileUnit', function() {
    it('should order by order field for line with order (connected scatterplot)', function () {
      const model = parseUnitModel({
        "data": {"url": "data/driving.json"},
        "mark": "line",
        "encoding": {
          "x": {"field": "miles","type": "quantitative", "scale": {"zero": false}},
          "y": {"field": "gas","type": "quantitative", "scale": {"zero": false}},
          "order": {"field": "year","type": "temporal"}
        }
      });
      assert.deepEqual<VgCollectTransform>(assemble(model), {
        type: 'collect',
        sort: {
          field: ['year'],
          order: ['ascending']
        }
      });
    });

    it('should order by x by default if x is the dimension', function () {
      const model = parseUnitModel({
        "data": {"url": "data/movies.json"},
        "mark": "line",
        "encoding": {
          "x": {
            "bin": {"maxbins": 10},
            "field": "IMDB_Rating",
            "type": "quantitative"
          },
          "color": {
            "field": "Source",
            "type": "nominal"
          },
          "y": {
            "aggregate": "count",
            "type": "quantitative"
          }
        }
      });
      assert.deepEqual<VgCollectTransform>(assemble(model), {
        type: 'collect',
        sort: {
          field: 'bin_maxbins_10_IMDB_Rating_start',
          order: 'descending'
        }
      });
    });
  });
});
