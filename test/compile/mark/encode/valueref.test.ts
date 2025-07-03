import {SecondaryFieldDef, TypedFieldDef} from '../../../../src/channeldef.js';
import {midPoint} from '../../../../src/compile/mark/encode/valueref.js';
import {defaultConfig} from '../../../../src/config.js';

describe('compile/mark/encode/valueref', () => {
  describe('midPoint()', () => {
    const defaultRef = () => ({value: 0});
    it('should return correct value for width', () => {
      const ref = midPoint({
        channel: 'x',
        channelDef: {value: 'width'},
        markDef: {type: 'point'},
        config: defaultConfig,
        scaleName: undefined,
        scale: undefined,
        defaultRef,
      });
      expect(ref).toEqual({field: {group: 'width'}});
    });

    it('should return correct value for height', () => {
      const ref = midPoint({
        channel: 'y',
        channelDef: {value: 'height'},
        markDef: {type: 'point'},
        config: defaultConfig,
        scaleName: undefined,
        scale: undefined,
        defaultRef,
      });
      expect(ref).toEqual({field: {group: 'height'}});
    });

    it('returns correct value for datum', () => {
      const ref = midPoint({
        channel: 'y',
        channelDef: {datum: 5},
        markDef: {type: 'point'},
        config: defaultConfig,
        scaleName: 'x',
        scale: undefined,
        defaultRef,
      });
      expect(ref).toEqual({scale: 'x', value: 5});
    });

    it('returns correct value for datum with signal', () => {
      const ref = midPoint({
        channel: 'y',
        channelDef: {datum: {signal: 'foo'}},
        markDef: {type: 'point'},
        config: defaultConfig,
        scaleName: 'x',
        scale: undefined,
        defaultRef,
      });
      expect(ref).toEqual({scale: 'x', signal: 'foo'});
    });

    it('should return correct value for binned data', () => {
      const fieldDef: TypedFieldDef<string> = {field: 'bin_start', bin: 'binned', type: 'quantitative'};
      const fieldDef2: SecondaryFieldDef<string> = {field: 'bin_end'};
      const ref = midPoint({
        channel: 'x',
        channelDef: fieldDef,
        channel2Def: fieldDef2,
        markDef: {type: 'point'},
        config: defaultConfig,
        scaleName: 'x',
        scale: undefined,
        defaultRef,
      });
      expect(ref).toEqual({signal: 'scale("x", 0.5 * datum["bin_start"] + 0.5 * datum["bin_end"])'});
    });
  });
});
