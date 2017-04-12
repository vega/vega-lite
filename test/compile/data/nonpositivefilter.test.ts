/* tslint:disable:quotemark */

import {assert} from 'chai';

import {NonPositiveFilterNode} from '../../../src/compile/data/nonpositivefilter';
import {VgTransform} from '../../../src/vega.schema';
import {parseUnitModel} from '../../util';

describe('compile/data/nonpositivefilter', function () {
  it('should produce the correct nonPositiveFilter' ,function () {
    const model = parseUnitModel({
      mark: "point",
      encoding: {
        x: {field: 'a', type: "temporal"},
        y: {field: 'b', type: "quantitative", scale: {type: 'log'}}
      }
    });

    const filter = new NonPositiveFilterNode(model);

    assert.deepEqual(filter.filter, {
      b: true,
      a: false
    });

    assert.deepEqual<VgTransform[]>(filter.assemble(), [{
      type: 'filter',
      expr: 'datum["b"] > 0'
    }]);
  });

  // it('unit (with aggregated log scale)', function() {
  //   // TODO: write
  // });
});
