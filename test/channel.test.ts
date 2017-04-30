import {assert} from 'chai';
import {Channel, hasScale, rangeType, supportScaleType} from '../src/channel';
import {CHANNELS, NONSPATIAL_CHANNELS, NONSPATIAL_SCALE_CHANNELS, SCALE_CHANNELS, UNIT_CHANNELS, UNIT_SCALE_CHANNELS} from '../src/channel';
import {SCALE_TYPES, ScaleType} from '../src/scale';
import {some, without} from '../src/util';


describe('channel', () => {
  describe('UNIT_CHANNELS', () => {
    it('should be CHANNELS without row and column', () => {
      assert.deepEqual(UNIT_CHANNELS, without(CHANNELS, ['row', 'column']));
    });
  });

  describe('UNIT_SCALE_CHANNELS', () => {
    it('should be UNIT_CHANNELS without X2, Y2, ORDER, DETAIL, TEXT, LABEL, TOOLTIP', () => {
      assert.deepEqual(UNIT_SCALE_CHANNELS, without(UNIT_CHANNELS, ['x2', 'y2', 'order', 'detail', 'text', 'label', 'tooltip']));
    });
  });

  describe('SCALE_CHANNELS', () => {
    it('should be UNIT_SCALE_CHANNELS and ROW and COLUMN', () => {
      assert.deepEqual(SCALE_CHANNELS, [].concat(UNIT_SCALE_CHANNELS, ['row', 'column']));
    });
  });

  describe('NONSPATIAL_CHANNELS', () => {
    it('should be UNIT_CHANNELS without x, y, x2, y2', () => {
      assert.deepEqual(NONSPATIAL_CHANNELS, without(UNIT_CHANNELS, ['x', 'y', 'x2', 'y2']));
    });
  });

  describe('NONSPATIAL_SCALE_CHANNELS', () => {
    it('should be UNIT_SCALE_CHANNELS without x, y, x2, y2', () => {
      assert.deepEqual(NONSPATIAL_SCALE_CHANNELS, without(UNIT_SCALE_CHANNELS, ['x', 'y']));
    });
  });

  describe('hasScale', () => {
    it('should return true for all scale channel', () => {
      for (const channel of SCALE_CHANNELS) {
        assert(hasScale(channel));
      }
    });
  });

  describe('supportScaleType', () => {
    // Make sure we always edit this when we add new channel
    it('should have at least one supported scale types for all channels with scale', () => {
      for (const channel of SCALE_CHANNELS) {
        assert(some(SCALE_TYPES, (scaleType) => {
          return supportScaleType(channel, scaleType);
        }));
      }
    });

    // Make sure we always edit this when we add new scale type
    it('should have at least one supported channel for all scale types', () => {
      for (const scaleType of SCALE_TYPES) {
        assert(some(SCALE_CHANNELS, (channel) => {
          return supportScaleType(channel, scaleType);
        }));
      }
    });

    it('row,column should support only band', () => {
      for (const channel of ['row', 'column'] as Channel[]) {
        assert(supportScaleType(channel, 'band'));
        const nonBands = without<ScaleType>(SCALE_TYPES, ['band']);
        for (const scaleType of nonBands) {
          assert(!supportScaleType(channel, scaleType));
        }
      }
    });

    it('shape should support only ordinal', () => {
      assert(supportScaleType('shape', 'ordinal'));
      const nonOrdinal = without<ScaleType>(SCALE_TYPES, ['ordinal']);
      for (const scaleType of nonOrdinal) {
        assert(!supportScaleType('shape', scaleType));
      }
    });

    it('color should support all scale types except band', () => {
      for (const scaleType of SCALE_TYPES) {
        assert.equal(supportScaleType('color', scaleType), scaleType !== 'band');
      }
    });

    it('x, y, size, opacity should support all scale type except ordinal and sequential', () => {
      // x,y should use either band or point for ordinal input
      const nonOrdinal = without<ScaleType>(SCALE_TYPES, ['ordinal', 'sequential']);
      for (const channel of ['x', 'y', 'size', 'opacity'] as Channel[]) {
        assert(!supportScaleType(channel, 'ordinal'));
        assert(!supportScaleType(channel, 'sequential'));
        for (const scaleType of nonOrdinal) {
          assert(supportScaleType(channel, scaleType), `Error: ${channel}, ${scaleType}`);
        }
      }
    });
  });

  describe('rangeType', () => {
    it('should be defined for all channels (no error).', () => {
      for (const c of CHANNELS) {
        assert.doesNotThrow(() => {
          rangeType(c);
        });
      }
    });
  });
});
