/* tslint:disable:quotemark */
import {assert} from 'chai';
import {getOffset, midPoint} from '../../../src/compile/mark/valueref';
import {FieldDef} from '../../../src/fielddef';
import {MarkDef} from '../../../src/mark';

describe('compile/mark/valueref', () => {
  describe('getOffset', () => {
    const markDef: MarkDef = {
      type: 'point',
      x2Offset: 100
    };
    it('should correctly get the offset value for the given channel', () => {
      assert.equal(getOffset('x2', markDef), 100);
    });
    it('should return undefined when the offset value for the given channel is not defined', () => {
      assert.equal(getOffset('x', markDef), undefined);
    });
  });

  describe('midPoint()', () => {
    it('should return correct value for width', () => {
      const ref = midPoint('x', {value: 'width'}, undefined, undefined, undefined, undefined, undefined);
      assert.deepEqual(ref, {field: {group: 'width'}});
    });
    it('should return correct value for height', () => {
      const ref = midPoint('y', {value: 'height'}, undefined, undefined, undefined, undefined, undefined);
      assert.deepEqual(ref, {field: {group: 'height'}});
    });
    it('should return correct value for binned data', () => {
      const fieldDef: FieldDef<string> = {field: 'bin_start', bin: 'binned', type: 'quantitative'};
      const fieldDef2: FieldDef<string> = {field: 'bin_end', type: 'quantitative'};
      const ref = midPoint('x', fieldDef, fieldDef2, 'x', undefined, undefined, undefined);
      assert.deepEqual(ref, {signal: 'scale("x", (datum["bin_start"] + datum["bin_end"]) / 2)'});
    });
  });
});
