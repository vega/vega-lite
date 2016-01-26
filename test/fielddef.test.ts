import {assert} from 'chai';

import * as vlFieldDef from '../src/fielddef';
import {QUANTITATIVE} from '../src/type';


describe('vl.fieldDef.cardinality()', function () {
  describe('for Q', function () {
    it('should return cardinality', function() {
      const fieldDef = {field: '2', type: QUANTITATIVE};
      const stats = {2:{distinct: 10, min:0, max:150}};
      const cardinality = vlFieldDef.cardinality(fieldDef, stats);
      assert.equal(cardinality, 10);
    });
  });

  describe('for B(Q)', function(){
    it('should return cardinality', function() {
      const fieldDef = {field: '2', type: QUANTITATIVE, bin: {maxbins: 15}};
      const stats = {2:{distinct: 10, min:0, max:150}};
      const cardinality = vlFieldDef.cardinality(fieldDef, stats);
      assert.equal(cardinality, 15);
    });
  });
});
