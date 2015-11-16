import {expect} from 'chai';

import * as vlEncDef from '../src/encdef';
import {Type} from '../src/consts';


describe('vl.encDef.cardinality()', function () {
  describe('for Q', function () {
    it('should return cardinality', function() {
      var encDef = {name:2, type:'quantitative'};
      var stats = {2:{distinct: 10, min:0, max:150}};
      var cardinality = vlEncDef.cardinality(encDef, stats);
      expect(cardinality).to.equal(10);
    });
  });

  describe('for B(Q)', function(){
    it('should return cardinality', function() {
      var encDef = {name:2, type:'quantitative', bin: {maxbins: 15}};
      var stats = {2:{distinct: 10, min:0, max:150}};
      var cardinality = vlEncDef.cardinality(encDef, stats);
      expect(cardinality).to.equal(15);
    });
  });
});

describe('vl.encDef.isTypes', function () {
  it('should return correct type checking', function() {
    var qDef = {name: 'number', type:'quantitative'};
    expect(qDef.type === Type.Quantitative).to.eql(true);
    expect(vlEncDef.isTypes(qDef, [Type.Quantitative])).to.eql(true);
    expect(vlEncDef.isTypes(qDef, [Type.Quantitative, Type.Ordinal])).to.eql(true);
    expect(vlEncDef.isTypes(qDef, [Type.Ordinal, Type.Quantitative])).to.eql(true);
    expect(vlEncDef.isTypes(qDef, [Type.Quantitative, Type.Nominal])).to.eql(true);
    expect(vlEncDef.isTypes(qDef, [Type.Nominal])).to.eql(false);
  });
});
