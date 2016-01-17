/* tslint:disable:quotemark */

import {assert} from 'chai';

import {parseModel} from '../util';
import {compileData} from '../../src/compile/data';
import {compileRootGroup} from '../../src/compile/compile';
import {SUMMARY} from '../../src/data';

describe('vl.compile.stack()', function () {

  describe('bin-x', function () {
    const model = parseModel({
      "mark": "bar",
      "encoding": {
        "x": {"type": "quantitative", "field": "Cost__Other", "aggregate": "sum"},
        "y": {"bin": true, "type": "quantitative", "field": "Cost__Total_$"},
        "color": {"type": "ordinal", "field": "Effect__Amount_of_damage"}
      }
    });
    const dataSpec = compileData(model);
    it('should aggregate data correctly', function () {

      var tableData = dataSpec.filter(function(data) {
        return data.name === SUMMARY;
      });
      assert.equal(tableData.length, 1);

      var tableAggrTransform = tableData[0].transform.filter(function(t) {
        return t.type === 'aggregate';
      })[0];
      assert.equal(tableAggrTransform.groupby.length, 4);
      assert.operator(tableAggrTransform.groupby.indexOf('bin_Cost__Total_$_start'), '>', -1);
    });

    it('should create stack summary data correctly', function() {
      var stackedData = dataSpec.filter(function(data) {
        return data.name === 'stacked_scale';
      });
      assert.equal(stackedData.length, 1);
      var stackedAggrTransform = stackedData[0].transform[0];
      assert.equal(stackedAggrTransform.groupby[0], 'bin_Cost__Total_$_start');
    });

    it('should stack data correctly', function() {
      const rootGroup = compileRootGroup(model);
      const stackTransform = rootGroup.marks[0].from.transform[0];
      assert.equal(stackTransform.type, 'stack');

      assert.deepEqual(stackTransform.groupby, ['bin_Cost__Total_$_start']);
      assert.deepEqual(stackTransform.field, 'sum_Cost__Other');
      assert.deepEqual(stackTransform.sortby, ['-Effect__Amount_of_damage']);
    });
  });

  describe('bin-y', function () {
    const model = parseModel({
      "mark": "bar",
      "encoding": {
        "y": {"type": "quantitative", "field": "Cost__Other", "aggregate": "sum"},
        "x": {"bin": true, "type": "quantitative", "field": "Cost__Total_$"},
        "color": {"type": "ordinal", "field": "Effect__Amount_of_damage"}
      }
    });

    const dataSpec = compileData(model);
    it('should aggregate data correctly', function () {

      var tableData = dataSpec.filter(function(data) {
        return data.name === SUMMARY;
      });
      assert.equal(tableData.length, 1);

      var tableAggrTransform = tableData[0].transform.filter(function(t) {
        return t.type === 'aggregate';
      })[0];
      assert.equal(tableAggrTransform.groupby.length, 4);
      assert.operator(tableAggrTransform.groupby.indexOf('bin_Cost__Total_$_start'), '>', -1);
    });

    it('should create stack summary data correctly', function() {
      var stackedData = dataSpec.filter(function(data) {
        return data.name === 'stacked_scale';
      });

      assert.equal(stackedData.length, 1);
      var stackedAggrTransform = stackedData[0].transform[0];
      assert.equal(stackedAggrTransform.groupby[0], 'bin_Cost__Total_$_start');
    });

    it('should stack data correctly', function() {
      const rootGroup = compileRootGroup(model);
      const stackTransform = rootGroup.marks[0].from.transform[0];
      assert.equal(stackTransform.type, 'stack');

      assert.deepEqual(stackTransform.groupby, ['bin_Cost__Total_$_start']);
      assert.deepEqual(stackTransform.field, 'sum_Cost__Other');
      assert.deepEqual(stackTransform.sortby, ['-Effect__Amount_of_damage']);
    });
  });
});
