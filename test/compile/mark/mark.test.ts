/* tslint:disable:quotemark */

import {assert} from 'chai';

import {parseUnitModel} from '../../util';
import {parseMark} from '../../../src/compile/mark/mark';

describe('Mark', function() {
  describe('Non-path based Mark', function() {
    it('Aggregated Bar with a color with binned x should use stacked data source', function() {
      const model = parseUnitModel({
        "mark": "bar",
        "encoding": {
          "x": {"type": "quantitative", "field": "Cost__Other", "aggregate": "sum"},
          "y": {"bin": true, "type": "quantitative", "field": "Cost__Total_$"},
          "color": {"type": "ordinal", "field": "Effect__Amount_of_damage"}
        }
      });
      const markGroup = parseMark(model);
      assert.equal(markGroup[0].from.data, 'stacked');
    });
  });
});
