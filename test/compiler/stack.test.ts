'use strict';

var expect = require('chai').expect;

import * as fix from '../fixtures';
import {compile} from '../../src/compiler/compiler';
import {Table} from '../../src/consts';

var fixtures = fix.f.stack;

var stats = {
  'Cost__Total_$': {
    min: 0,
    max: 100,
    length: { max: 5}
  },
  'Cost__Other': {
    min: 0,
    max: 100,
    length: { max: 5}
  },
  'Effect__Amount_of_damage': {
    min: 0,
    max: 100,
    length: { max: 5}
  }
};

describe('vl.compile.stack()', function () {

  describe('bin-x', function () {
    it('should put stack on y', function () {
      // FIXME don't run the whole compile
      var vgSpec = compile(fixtures.binX, stats);

      var tableData = vgSpec.data.filter(function(data) {
        return data.name === Table.SUMMARY;
      });
      expect(tableData.length).to.equal(1);

      var tableAggrTransform = tableData[0].transform.filter(function(t) {
        return t.type === 'aggregate';
      })[0];
      expect(tableAggrTransform.groupby.length).to.equal(4);
      expect(tableAggrTransform.groupby.indexOf('bin_Cost__Total_$_start')).to.gt(-1);

      var stackedData = vgSpec.data.filter(function(data) {
        return data.name === 'stacked';
      });
      expect(stackedData.length).to.equal(1);
      var stackedAggrTransform = stackedData[0].transform[0];
      expect(stackedAggrTransform.groupby[0]).to.equal('bin_Cost__Total_$_start');
    });
  });

  describe('bin-y', function () {
    it('should put stack on x', function () {
      // FIXME don't run the whole compile
      var vgSpec = compile(fixtures.binY, stats);

      var tableData = vgSpec.data.filter(function(data) {
        return data.name === Table.SUMMARY;
      });
      expect(tableData.length).to.equal(1);

      var tableAggrTransform = tableData[0].transform.filter(function(t) {
        return t.type === 'aggregate';
      })[0];
      expect(tableAggrTransform.groupby.length).to.equal(4);
      expect(tableAggrTransform.groupby.indexOf('bin_Cost__Total_$_start')).to.gt(-1);

      var stackedData = vgSpec.data.filter(function(data) {
        return data.name === 'stacked';
      });

      expect(stackedData.length).to.equal(1);
      var stackedAggrTransform = stackedData[0].transform[0];
      expect(stackedAggrTransform.groupby[0]).to.equal('bin_Cost__Total_$_start');
    });
  });
});
