import {expect} from 'chai';

import * as vlFieldDef from '../src/fielddef';
import {Type} from '../src/consts';


describe('vl.fieldDef.cardinality()', function () {
  describe('for Q', function () {
    it('should return cardinality', function() {
      var fieldDef = {name:2, type:'quantitative'};
      var stats = {2:{distinct: 10, min:0, max:150}};
      var cardinality = vlFieldDef.cardinality(fieldDef, stats);
      expect(cardinality).to.equal(10);
    });
  });

  describe('for B(Q)', function(){
    it('should return cardinality', function() {
      var fieldDef = {name:2, type:'quantitative', bin: {maxbins: 15}};
      var stats = {2:{distinct: 10, min:0, max:150}};
      var cardinality = vlFieldDef.cardinality(fieldDef, stats);
      expect(cardinality).to.equal(15);
    });
  });
});

describe('vl.fieldDef.isTypes', function () {
  it('should return correct type checking', function() {
    var qDef = {name: 'number', type:'quantitative'};
    expect(qDef.type === Type.QUANTITATIVE).to.eql(true);
    expect(vlFieldDef.isTypes(qDef, [Type.QUANTITATIVE])).to.eql(true);
    expect(vlFieldDef.isTypes(qDef, [Type.QUANTITATIVE, Type.ORDINAL])).to.eql(true);
    expect(vlFieldDef.isTypes(qDef, [Type.ORDINAL, Type.QUANTITATIVE])).to.eql(true);
    expect(vlFieldDef.isTypes(qDef, [Type.QUANTITATIVE, Type.NOMINAL])).to.eql(true);
    expect(vlFieldDef.isTypes(qDef, [Type.NOMINAL])).to.eql(false);
  });
});
