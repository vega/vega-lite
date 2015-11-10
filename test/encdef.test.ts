var expect = require('chai').expect;

import * as vlEncDef from '../src/encdef';
import {Type} from '../src/consts';


describe('vl.encDef.cardinality()', function () {
  describe('for Q', function () {
    it('should return cardinality', function() {
      var encDef = {name:2, type:'Q'};
      var stats = {2:{distinct: 10, min:0, max:150}};
      var cardinality = vlEncDef.cardinality(encDef, stats);
      expect(cardinality).to.equal(11);
    });
  });

  describe('for B(Q)', function(){
    it('should return cardinality', function() {
      var encDef = {name:2, type:'Q', bin: {maxbins: 15}};
      var stats = {2:{distinct: 10, min:0, max:150}};
      var cardinality = vlEncDef.cardinality(encDef, stats);
      expect(cardinality).to.equal(15);
    });
  });
});

describe('vl.encDef.isType', function () {
  it('should return correct type checking', function() {
    var qDef = {name: 'number', type:'Q'};
    expect(vlEncDef.isType(qDef, Type.Q)).to.eql(true);
    expect(vlEncDef.isType(qDef, Type.N)).to.eql(false);
  });
});

describe('vl.encDef.isTypes', function () {
  it('should return correct type checking', function() {
    var qDef = {name: 'number', type:'Q'};
    expect(vlEncDef.isType(qDef, Type.Q)).to.eql(true);
    expect(vlEncDef.isTypes(qDef, [Type.Q])).to.eql(true);
    expect(vlEncDef.isTypes(qDef, [Type.Q, Type.O])).to.eql(true);
    expect(vlEncDef.isTypes(qDef, [Type.O, Type.Q])).to.eql(true);
    expect(vlEncDef.isTypes(qDef, [Type.Q, Type.N])).to.eql(true);
    expect(vlEncDef.isTypes(qDef, [Type.N])).to.eql(false);
  });
});
