import {assert} from 'chai';
import {Channel, SCALE_CHANNELS, ScaleChannel} from '../src/channel';
import * as scale from '../src/scale';
import {
  channelSupportScaleType,
  CONTINUOUS_TO_CONTINUOUS_SCALES,
  getSupportedScaleType,
  SCALE_TYPES,
  ScaleType
} from '../src/scale';
import {Type} from '../src/type';
import {some, without} from '../src/util';

describe('scale', () => {
  describe('scaleTypeSupportProperty', () => {
    // Make sure we always edit this when we add new channel
    it('should have at least one supported scale types for all scale properties', () => {
      for (const prop of scale.SCALE_PROPERTIES) {
        assert(
          some(scale.SCALE_TYPES, scaleType => {
            return scale.scaleTypeSupportProperty(scaleType, prop);
          })
        );
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
        assert(
          some(SCALE_TYPES, scaleType => {
            return channelSupportScaleType(channel, scaleType);
          })
        );
      }
    });

    // Make sure we always edit this when we add new scale type
    it('should have at least one supported channel for all scale types', () => {
      for (const scaleType of SCALE_TYPES) {
        assert(
          some(SCALE_CHANNELS, channel => {
            return channelSupportScaleType(channel, scaleType);
          })
        );
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

      for (const channel of ['x', 'y', 'size', 'opacity'] as ScaleChannel[]) {
        assert(!channelSupportScaleType(channel, 'ordinal'));
        assert(!channelSupportScaleType(channel, 'sequential'));
        for (const scaleType of scaleTypes) {
          assert(channelSupportScaleType(channel, scaleType), `Error: ${channel}, ${scaleType}`);
        }
      }
    });
  });

  describe('getSupportedScaleType', () => {
    it('should return correct scale types for quantitative positional channels', () => {
      const type = Type.QUANTITATIVE;
      const positionalScaleTypes = [ScaleType.LINEAR, ScaleType.LOG, ScaleType.POW, ScaleType.SQRT];

      // x channel
      let scaleTypes = getSupportedScaleType(Channel.X, type);
      assert.deepEqual(positionalScaleTypes, scaleTypes);

      // y channel
      scaleTypes = getSupportedScaleType(Channel.Y, Type.QUANTITATIVE);
      assert.deepEqual(scaleTypes, positionalScaleTypes);
    });

    it('should return correct scale types for quantitative positional channels with bin', () => {
      const type = Type.QUANTITATIVE;
      const positionalScaleTypesBinned = [ScaleType.LINEAR, ScaleType.BIN_LINEAR];

      // x channel
      let scaleTypes = getSupportedScaleType(Channel.X, type, true);
      assert.deepEqual(scaleTypes, positionalScaleTypesBinned);

      // y channel
      scaleTypes = getSupportedScaleType(Channel.Y, type, true);
      assert.deepEqual(scaleTypes, positionalScaleTypesBinned);
    });

    it('should return correct scale types for nominal positional channels', () => {
      const type = Type.NOMINAL;
      const nominalPositionalScaleTypes = [ScaleType.POINT, ScaleType.BAND];

      let scaleTypes = getSupportedScaleType(Channel.X, type);
      assert.deepEqual(scaleTypes, nominalPositionalScaleTypes);

      scaleTypes = getSupportedScaleType(Channel.Y, type);
      assert.deepEqual(scaleTypes, nominalPositionalScaleTypes);
    });

    it('should return correct scale types for temporal positional channels', () => {
      const type = Type.TEMPORAL;
      const temporalPositionalScaleTypes = [ScaleType.TIME, ScaleType.UTC];

      let scaleTypes = getSupportedScaleType(Channel.X, type);
      assert.deepEqual(scaleTypes, temporalPositionalScaleTypes);

      scaleTypes = getSupportedScaleType(Channel.Y, type);
      assert.deepEqual(scaleTypes, temporalPositionalScaleTypes);
    });
  });
});
