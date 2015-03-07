'use strict';

var expect = require('chai').expect;

var compile = require('../../src/compile/compile'),
  Encoding = require('../../src/Encoding'),
  util = require('../../src/util');

// mock util.getbins()
util.getbins = function() {
  return {
    start: 0,
    stop: 10,
    step: 1
  };
};

var spec_stackBinY = {
  "marktype": "bar",
  "enc": {
    "x": {"type": "Q","name": "Cost__Other","aggr": "avg"},
    "y": {"bin": true,"type": "Q","name": "Cost__Total_$"},
    "color": {"type": "O","name": "Effect__Amount_of_damage"}
  }
};

var spec_stackXOnly = {
  "marktype": "bar",
  "enc": {
    "x": {"type": "Q","name": "Cost__Other","aggr": "avg"},
    "color": {"type": "O","name": "Effect__Amount_of_damage"}
  }
};

var spec_stackBinX = {
  "marktype": "bar",
  "enc": {
    "y": {"type": "Q","name": "Cost__Other","aggr": "avg"},
    "x": {"bin": true,"type": "Q","name": "Cost__Total_$"},
    "color": {"type": "O","name": "Effect__Amount_of_damage"}
  }
};

var stats = {
  'Cost__Total_$': {
    min: 0,
    max: 100,
    maxlength: 5
  },
  'Cost__Other': {
    min: 0,
    max: 100,
    maxlength: 5
  },
  'Effect__Amount_of_damage': {
    min: 0,
    max: 100,
    maxlength: 5
  }
};

describe('vl.compile.stacking()', function () {

  describe('bin-x', function () {
    it('should put stack on y', function () {
      var encoding = Encoding.fromSpec(spec_stackBinX);
      var vgSpec = compile(encoding, stats);

      var tableData = vgSpec.data.filter(function(data) {
        return data.name === 'table';
      });
      expect(tableData.length).to.equal(1);

      var tableAggrTransform = tableData[0].transform.filter(function(t) {
        return t.type === 'aggregate';
      })[0];
      expect(tableAggrTransform.groupby.length).to.equal(2);
      expect(tableAggrTransform.groupby.indexOf('data.bin_Cost__Total_$')).to.gt(-1);

      var stackedData = vgSpec.data.filter(function(data) {
        return data.name === 'stacked';
      });
      expect(stackedData.length).to.equal(1);
      var stackedAggrTransform = stackedData[0].transform[0];
      expect(stackedAggrTransform.groupby[0]).to.equal('data.bin_Cost__Total_$');
    });
  });

  describe('bin-y', function () {
    it('should put stack on x', function () {
      var encoding = Encoding.fromSpec(spec_stackBinY);
      var vgSpec = compile(encoding, stats);

      var tableData = vgSpec.data.filter(function(data) {
        return data.name === 'table';
      });
      expect(tableData.length).to.equal(1);

      var tableAggrTransform = tableData[0].transform.filter(function(t) {
        return t.type === 'aggregate';
      })[0];
      expect(tableAggrTransform.groupby.length).to.equal(2);
      expect(tableAggrTransform.groupby.indexOf('data.bin_Cost__Total_$')).to.gt(-1);

      var stackedData = vgSpec.data.filter(function(data) {
        return data.name === 'stacked';
      });

      expect(stackedData.length).to.equal(1);
      var stackedAggrTransform = stackedData[0].transform[0];
      expect(stackedAggrTransform.groupby[0]).to.equal('data.bin_Cost__Total_$');
    });
  });




});

