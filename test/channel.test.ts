import {Channel, SCALE_CHANNELS, hasScale, supportScaleType} from '../src/channel';
import {ScaleType, SCALE_TYPES} from '../src/scale';
import {assert} from 'chai';
import {some, without} from '../src/util';

describe('channel', () => {
  describe('hasScale', () => {
    it('should return true for all scale channel', () => {
      for (let channel of SCALE_CHANNELS) {
        assert(hasScale(channel));
      }
    });
  });

  describe('supportScaleType', () => {
    // Make sure we always edit this when we add new channel
    it('should have at least one supported scale type for all channels with scale', () => {
      for (let channel of SCALE_CHANNELS) {
        assert(some(SCALE_TYPES, (scaleType) => {
          return supportScaleType(channel, scaleType);
        }));
      }
    });

    // Make sure we always edit this when we add new scale type
    it('should have at least one supported channel for all scale types', () => {
      for (let scaleType of SCALE_TYPES) {
        assert(some(SCALE_CHANNELS, (channel) => {
          return supportScaleType(channel, scaleType);
        }));
      }
    });

    it('row,column should support only band', () => {
      for (let channel of ['row', 'column'] as Channel[]) {
        assert(supportScaleType(channel, 'band'));
        const nonBands = without<ScaleType>(SCALE_TYPES, ['band']);
        for (let scaleType of nonBands) {
          assert(!supportScaleType(channel, scaleType));
        }
      }
    });

    it('shape should support only ordinal', () => {
      assert(supportScaleType('shape', 'ordinal'));
      const nonOrdinal = without<ScaleType>(SCALE_TYPES, ['ordinal']);
      for (let scaleType of nonOrdinal) {
        assert(!supportScaleType('shape', scaleType));
      }
    });

    it('color should support all scale types', () => {
      for (let scaleType of SCALE_TYPES) {
        assert(supportScaleType('color', scaleType));
      }
    });

    it('x, y, size, opacity should support all scale type except ordinal', () => {
      // x,y should use either band or point for ordinal input
      for (let channel of ['x', 'y', 'size', 'opacity'] as Channel[]) {
        assert(!supportScaleType(channel, 'ordinal'));
        const nonOrdinal = without<ScaleType>(SCALE_TYPES, ['ordinal']);
        for (let scaleType of nonOrdinal) {
          assert(supportScaleType(channel, scaleType));
        }
      }
    });
  });
});
