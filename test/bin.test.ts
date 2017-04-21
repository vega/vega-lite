import {assert} from 'chai';
import {autoMaxBins, binToString} from '../src/bin';
import {Channel, COLOR, COLUMN, hasScale, OPACITY, rangeType, ROW, SHAPE, supportScaleType} from '../src/channel';
import {CHANNELS, NONSPATIAL_CHANNELS, NONSPATIAL_SCALE_CHANNELS, SCALE_CHANNELS, UNIT_CHANNELS, UNIT_SCALE_CHANNELS} from '../src/channel';
import {SCALE_TYPES, ScaleType} from '../src/scale';
import {some, without} from '../src/util';

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
