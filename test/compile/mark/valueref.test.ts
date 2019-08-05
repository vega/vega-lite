import {SecondaryFieldDef, TypedFieldDef} from '../../../src/channeldef';
import {getOffset, midPoint, tooltipForEncoding} from '../../../src/compile/mark/valueref';
import {defaultConfig} from '../../../src/config';
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
        markDef: {type: 'point'},
        config: defaultConfig,
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
        markDef: {type: 'point'},
        config: defaultConfig,
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
        markDef: {type: 'point'},
        config: defaultConfig,
        scaleName: 'x',
        scale: undefined,
        defaultRef
      });
      expect(ref).toEqual({signal: 'scale("x", 0.5 * datum["bin_start"] + 0.5 * datum["bin_end"])'});
    });
  });

  describe('tooltipForEncoding', () => {
    it('returns correct tooltip signal for binning field', () => {
      expect(
        tooltipForEncoding(
          {
            x: {
              bin: true,
              field: 'IMDB_Rating',
              type: 'quantitative'
            }
          },
          defaultConfig
        )
      ).toEqual({
        signal:
          '{"IMDB_Rating (binned)": datum["bin_maxbins_10_IMDB_Rating"] === null || isNaN(datum["bin_maxbins_10_IMDB_Rating"]) ? "null" : format(datum["bin_maxbins_10_IMDB_Rating"], "") + " - " + format(datum["bin_maxbins_10_IMDB_Rating_end"], "")}'
      });
    });

    it('returns correct tooltip signal for binning field', () => {
      expect(
        tooltipForEncoding(
          {
            x: {
              bin: 'binned',
              field: 'bin_IMDB_rating',
              type: 'quantitative',
              title: 'IMDB_Rating (binned)'
            },
            x2: {
              field: 'bin_IMDB_rating_end'
            }
          },
          defaultConfig
        )
      ).toEqual({
        signal:
          '{"IMDB_Rating (binned)": datum["bin_IMDB_rating"] === null || isNaN(datum["bin_IMDB_rating"]) ? "null" : format(datum["bin_IMDB_rating"], "") + " - " + format(datum["bin_IMDB_rating_end"], "")}'
      });
    });
  });
});
