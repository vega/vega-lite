/* tslint:disable:quotemark */

import {assert} from 'chai';

import {parseModel} from '../../util';
import {compileMark} from '../../../src/compile/mark/mark';
import {SUMMARY} from '../../../src/data';

describe('Mark (Non-path based Mark)', function() {
  describe('Bar', function() {
    describe('Aggregated with a color with binned x', function () {
      const model = parseModel({
        "mark": "bar",
        "encoding": {
          "x": {"type": "quantitative", "field": "Cost__Other", "aggregate": "sum"},
          "y": {"bin": true, "type": "quantitative", "field": "Cost__Total_$"},
          "color": {"type": "ordinal", "field": "Effect__Amount_of_damage"}
        }
      });

      it('should stack data correctly', function() {
        const markGroup = compileMark(model);
        const stackTransform = markGroup[0].from.transform[0];
        assert.equal(stackTransform.type, 'stack');

        assert.deepEqual(stackTransform.groupby, ['bin_Cost__Total_$_start']);
        assert.deepEqual(stackTransform.field, 'sum_Cost__Other');
        assert.deepEqual(stackTransform.sortby, ['-Effect__Amount_of_damage']);
      });
    });

    describe('Aggregated with a color with binned x', function () {
      const model = parseModel({
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": "Cost__Other", "aggregate": "sum"},
          "x": {"bin": true, "type": "quantitative", "field": "Cost__Total_$"},
          "color": {"type": "ordinal", "field": "Effect__Amount_of_damage"}
        }
      });

      it('should stack data correctly', function() {
        const markGroup = compileMark(model);
        const stackTransform = markGroup[0].from.transform[0];
        assert.equal(stackTransform.type, 'stack');

        assert.deepEqual(stackTransform.groupby, ['bin_Cost__Total_$_start']);
        assert.deepEqual(stackTransform.field, 'sum_Cost__Other');
        assert.deepEqual(stackTransform.sortby, ['-Effect__Amount_of_damage']);
      });
    });
  });
});
