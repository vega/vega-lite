import {assert} from 'chai';
import {autoMaxBins, binToString} from '../src/bin';
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
