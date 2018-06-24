/* tslint:disable:quotemark */
import {assert} from 'chai';

import {getOffset, midPoint} from '../../../src/compile/mark/valueref';
import {MarkDef} from '../../../src/mark';


describe('compile/mark/valueref', () => {
  describe("getOffset", function () {
    const markDef: MarkDef = {
      "type": "point",
      "x2Offset": 100
    };
    it('should correctly get the offset value for the given channel', function () {
      assert.equal(getOffset('x2', markDef, false), 100);
    });
    it('should return undefined when the offset value for the given channel is not defined', function () {
      assert.equal(getOffset('x', markDef, false), undefined);
    });
    it('should correctly get the offset value for binned scale', function () {
      assert.equal(getOffset('x', {type: "point"}, true), 1);
      assert.equal(getOffset('y', {type: "point"}, true), -1);
      assert.equal(getOffset('x2', {type: "point"}, true), 0);
      assert.equal(getOffset('y2', {type: "point"}, true), 0);
    });
  });

  describe('midPoint()', () => {
    it('should return correct value for width', () => {
      const ref = midPoint('x', {value: 'width'}, undefined, undefined, undefined, undefined, false, undefined);
      assert.deepEqual(ref, {field: {group: 'width'}});
    });
    it('should return correct value for height', () => {
      const ref = midPoint('y', {value: 'height'}, undefined, undefined, undefined, undefined, false, undefined);
      assert.deepEqual(ref, {field: {group: 'height'}});
    });
  });
});
