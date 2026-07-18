import type {SignalRef} from 'vega';
import {positionOffset} from '../../../../src/compile/mark/encode/offset.js';
import {Mark, MarkDef} from '../../../../src/mark.js';

describe('compile/mark/encode/offset', () => {
  describe('positionOffset', () => {
    it('correctly get the offset value for the given channel', () => {
      const markDef: MarkDef<Mark, SignalRef> = {
        type: 'point',
        x2Offset: 100,
      };
      expect(positionOffset({channel: 'x2', markDef}).offset).toBe(100);
    });
    it('should return undefined when the offset value for the given channel is not defined', () => {
      const markDef: MarkDef<Mark, SignalRef> = {
        type: 'point',
        x2Offset: 100,
      };
      expect(positionOffset({channel: 'x', markDef}).offset).toBeUndefined();
    });
  });
});
