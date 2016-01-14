/* tslint:disable:quotemark */

import {expect} from 'chai';

import {parseModel} from '../../src/compiler/Model';
import {compileData} from '../../src/compiler/data';
import {compileRootGroup} from '../../src/compiler/compiler';
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
      expect(tableData.length).to.equal(1);

      var tableAggrTransform = tableData[0].transform.filter(function(t) {
        return t.type === 'aggregate';
      })[0];
      expect(tableAggrTransform.groupby.length).to.equal(4);
      expect(tableAggrTransform.groupby.indexOf('bin_Cost__Total_$_start')).to.gt(-1);
    });

    it('should create stack summary data correctly', function() {
      var stackedData = dataSpec.filter(function(data) {
        return data.name === 'stacked_scale';
      });
      expect(stackedData.length).to.equal(1);
      var stackedAggrTransform = stackedData[0].transform[0];
      expect(stackedAggrTransform.groupby[0]).to.equal('bin_Cost__Total_$_start');
    });

    it('should stack data correctly', function() {
      const rootGroup = compileRootGroup(model);
      const stackTransform = rootGroup.marks[0].from.transform[0];
      expect(stackTransform.type).to.equal('stack');

      expect(stackTransform.groupby).to.eql(['bin_Cost__Total_$_start']);
      expect(stackTransform.field).to.eql('sum_Cost__Other');
      expect(stackTransform.sortby).to.eql(['-Effect__Amount_of_damage']);
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
      expect(tableData.length).to.equal(1);

      var tableAggrTransform = tableData[0].transform.filter(function(t) {
        return t.type === 'aggregate';
      })[0];
      expect(tableAggrTransform.groupby.length).to.equal(4);
      expect(tableAggrTransform.groupby.indexOf('bin_Cost__Total_$_start')).to.gt(-1);
    });

    it('should create stack summary data correctly', function() {
      var stackedData = dataSpec.filter(function(data) {
        return data.name === 'stacked_scale';
      });

      expect(stackedData.length).to.equal(1);
      var stackedAggrTransform = stackedData[0].transform[0];
      expect(stackedAggrTransform.groupby[0]).to.equal('bin_Cost__Total_$_start');
    });

    it('should stack data correctly', function() {
      const rootGroup = compileRootGroup(model);
      const stackTransform = rootGroup.marks[0].from.transform[0];
      expect(stackTransform.type).to.equal('stack');

      expect(stackTransform.groupby).to.eql(['bin_Cost__Total_$_start']);
      expect(stackTransform.field).to.eql('sum_Cost__Other');
      expect(stackTransform.sortby).to.eql(['-Effect__Amount_of_damage']);
    });
  });
});
