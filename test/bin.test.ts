import {autoMaxBins, binToString, isBinParams} from '../src/bin.js';
import {
  COLOR,
  COLUMN,
  FILL,
  FILLOPACITY,
  OPACITY,
  ROW,
  SHAPE,
  SIZE,
  STROKE,
  STROKEOPACITY,
  STROKEWIDTH,
} from '../src/channel.js';

describe('autoMaxBins', () => {
  it('should assign generate correct defaults for different channels', () => {
    // Not testing case for 10 because it's already tested
    [COLOR, FILL, STROKE, STROKEWIDTH, SIZE, OPACITY, FILLOPACITY, STROKEOPACITY, SHAPE, ROW, COLUMN].forEach((a) =>
      expect(autoMaxBins(a)).toBe(6),
    );
  });
});

describe('binToString', () => {
  it('should generate the correct key for boolean', () => {
    expect(binToString(true)).toBe('bin_maxbins_10');
  });
});

describe('isBinParams', () => {
  it('should detect whether the input is BinParams or not', () => {
    expect(isBinParams(true)).toBe(false);
    expect(isBinParams('binned')).toBe(false);
    expect(isBinParams({})).toBe(true);
    expect(isBinParams({binned: true})).toBe(true);
    expect(isBinParams({extent: [0, 1]})).toBe(true);
  });
});
