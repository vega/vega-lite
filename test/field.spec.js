'use strict';

require('../src/globals');

var expect = require('chai').expect;
var vlfield = require('../src/field');

describe('vl.field.cardinality()', function () {
  describe('for Q', function () {
    it('should return cardinality', function() {
      var field = {name:2, type:'Q'};
      var stats = {2:{distinct: 10, min:0, max:150}};
      var cardinality = vlfield.cardinality(field, stats);
      expect(cardinality).to.equal(10);
    });
  });

  describe('for B(Q)', function(){
    it('should return cardinality', function() {
      var field = {name:2, type:'Q', bin: {maxbins: 15}};
      var stats = {2:{distinct: 10, min:0, max:150}};
      var cardinality = vlfield.cardinality(field, stats);
      expect(cardinality).to.equal(10);
    });
  });
});


describe('vl.field.isTypes', function () {
  it('should return correct type checking', function() {
    var qField = {name: 'number', type:'Q'};
    expect(vlfield.isTypes(qField, [Q])).to.eql(true);
    expect(vlfield.isTypes(qField, [Q, O])).to.eql(true);
    expect(vlfield.isTypes(qField, [Q, N])).to.eql(true);
    expect(vlfield.isTypes(qField, [N])).to.eql(false);
  });


});