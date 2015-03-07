'use strict';

var expect = require('chai').expect;

var vlfield = require('../src/field');

describe('vl.field.cardinality()', function () {
  describe('for Q', function () {
    it('should return cardinality', function() {
      var field = {name:2, type:'Q'};
      var stats = {2:{cardinality: 10, min:0, max:150}};
      var cardinality = vlfield.cardinality(field, stats);
      expect(cardinality).to.equal(10);
    });
  });

  describe('for B(Q)', function(){
    it('should return cardinality', function() {
      var field = {name:2, type:'Q', bin: {maxbins: 15}};
      var stats = {2:{cardinality: 10, min:0, max:150}};
      var cardinality = vlfield.cardinality(field, stats);
      expect(cardinality).to.equal(10);
    });
  });
});
