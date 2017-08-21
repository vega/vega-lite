import {assert} from 'chai';
import {Channel, SCALE_CHANNELS} from '../src/channel';
import * as scale from '../src/scale';
import {channelSupportScaleType, CONTINUOUS_TO_CONTINUOUS_SCALES, SCALE_TYPES, ScaleType} from '../src/scale';
import {some, without} from '../src/util';

describe('scale', () => {
  describe('scaleTypeSupportProperty', () => {
    // Make sure we always edit this when we add new channel
    it('should have at least one supported scale types for all scale properties', () => {
      for (const prop of scale.SCALE_PROPERTIES) {
        assert(some(scale.SCALE_TYPES, (scaleType) => {
          return scale.scaleTypeSupportProperty(scaleType, prop);
        }));
      }
    });

    // TODO: write more test blindly (Don't look at our code, just look at D3 code.)

    assert.isFalse(scale.scaleTypeSupportProperty('bin-linear', 'zero'));
  });

  describe('scaleTypes', () => {
    it('should either hasContinuousDomain or hasDiscreteDomain', () => {
      for (const scaleType of scale.SCALE_TYPES) {
        assert(scale.hasContinuousDomain(scaleType) !== scale.hasDiscreteDomain(scaleType));
      }
    });
  });


  describe('channelSupportScaleType', () => {
    // Make sure we always edit this when we add new channel
    it('should have at least one supported scale types for all channels with scale', () => {
      for (const channel of SCALE_CHANNELS) {
        assert(some(SCALE_TYPES, (scaleType) => {
          return channelSupportScaleType(channel, scaleType);
        }));
      }
    });

    // Make sure we always edit this when we add new scale type
    it('should have at least one supported channel for all scale types', () => {
      for (const scaleType of SCALE_TYPES) {
        assert(some(SCALE_CHANNELS, (channel) => {
          return channelSupportScaleType(channel, scaleType);
        }));
      }
    });

    it('row,column should support only band', () => {
      for (const channel of ['row', 'column'] as Channel[]) {
        assert(channelSupportScaleType(channel, 'band'));
        const nonBands = without<ScaleType>(SCALE_TYPES, ['band']);
        for (const scaleType of nonBands) {
          assert(!channelSupportScaleType(channel, scaleType));
        }
      }
    });

    it('shape should support only ordinal', () => {
      assert(channelSupportScaleType('shape', 'ordinal'));
      const nonOrdinal = without<ScaleType>(SCALE_TYPES, ['ordinal']);
      for (const scaleType of nonOrdinal) {
        assert(!channelSupportScaleType('shape', scaleType));
      }
    });

    it('color should support all scale types except band', () => {
      for (const scaleType of SCALE_TYPES) {
        assert.equal(channelSupportScaleType('color', scaleType), scaleType !== 'band');
      }
    });

    it('x, y, size, opacity should support all continuous scale type as well as band and point', () => {
      // x,y should use either band or point for ordinal input
      const scaleTypes = [...CONTINUOUS_TO_CONTINUOUS_SCALES, ScaleType.BAND, ScaleType.POINT];

      for (const channel of ['x', 'y', 'size', 'opacity'] as Channel[]) {
        assert(!channelSupportScaleType(channel, 'ordinal'));
        assert(!channelSupportScaleType(channel, 'sequential'));
        for (const scaleType of scaleTypes) {
          assert(channelSupportScaleType(channel, scaleType), `Error: ${channel}, ${scaleType}`);
        }
      }
    });
  });
});
