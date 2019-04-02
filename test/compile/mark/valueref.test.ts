/* tslint:disable:quotemark */
import {SecondaryFieldDef, TypedFieldDef} from '../../../src/channeldef';
import {getOffset, midPoint} from '../../../src/compile/mark/valueref';
import {MarkDef} from '../../../src/mark';

describe('compile/mark/valueref', () => {
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

  describe('midPoint()', () => {
    const defaultRef = () => ({value: 0});
    it('should return correct value for width', () => {
      const ref = midPoint({
        channel: 'x',
        channelDef: {value: 'width'},
        scaleName: undefined,
        scale: undefined,
        defaultRef
      });
      expect(ref).toEqual({field: {group: 'width'}});
    });
    it('should return correct value for height', () => {
      const ref = midPoint({
        channel: 'y',
        channelDef: {value: 'height'},
        scaleName: undefined,
        scale: undefined,
        defaultRef
      });
      expect(ref).toEqual({field: {group: 'height'}});
    });
    it('should return correct value for binned data', () => {
      const fieldDef: TypedFieldDef<string> = {field: 'bin_start', bin: 'binned', type: 'quantitative'};
      const fieldDef2: SecondaryFieldDef<string> = {field: 'bin_end'};
      const ref = midPoint({
        channel: 'x',
        channelDef: fieldDef,
        channel2Def: fieldDef2,
        scaleName: 'x',
        scale: undefined,
        defaultRef
      });
      expect(ref).toEqual({signal: 'scale("x", (datum["bin_start"] + datum["bin_end"]) / 2)'});
    });
  });
});
