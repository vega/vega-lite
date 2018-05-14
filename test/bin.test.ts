import {assert} from 'chai';
import {autoMaxBins, binToString, isBinParams} from '../src/bin';
import {COLOR, COLUMN, OPACITY, ROW, SHAPE} from '../src/channel';

describe('autoMaxBins', () => {
  it('should assign generate correct defaults for different channels', () => {
    // Not testing case for 10 because it's already tested
    [COLOR, OPACITY, SHAPE, ROW, COLUMN].forEach((a) => assert.deepEqual(autoMaxBins(a), 6));
  });
});

describe('binToString', () => {
  it('should generate the corrrect key for boolean', () => {
   assert.deepEqual(binToString(true), 'bin');
   assert.deepEqual(binToString(false), 'bin');
  });
});

describe('isBinParams', () => {
  it('should detect whether the input is BinParams or not', () => {
   assert.deepEqual(isBinParams(true), false);
   assert.deepEqual(isBinParams({}), true);
   assert.deepEqual(isBinParams({extent: [0,1]}), true);
  });
});

