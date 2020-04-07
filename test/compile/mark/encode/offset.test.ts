import {getOffset} from '../../../../src/compile/mark/encode/offset';
import {MarkDef} from '../../../../src/mark';

describe('compile/mark/encode/offset', () => {
  describe('getOffset', () => {
    const markDef: MarkDef = {
      type: 'point',
      x2Offset: 100
    };
    it('should correctly get the offset value for the given channel', () => {
      expect(getOffset('x2', markDef)).toEqual(100);
    });
    it('should return undefined when the offset value for the given channel is not defined', () => {
      expect(getOffset('x', markDef)).toEqual(undefined);
    });
  });
});
