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
        expect(
          some(scale.SCALE_TYPES, scaleType => {
            return scale.scaleTypeSupportProperty(scaleType, prop);
          })
        ).toBeTruthy();
      }
    });

    // TODO: write more test blindly (Don't look at our code, just look at Vega scale typings and D3 code.)
  });

  describe('scaleTypes', () => {
    it('should either hasContinuousDomain or hasDiscreteDomain', () => {
      for (const scaleType of scale.SCALE_TYPES) {
        expect(scale.hasContinuousDomain(scaleType) !== scale.hasDiscreteDomain(scaleType)).toBeTruthy();
      }
    });
  });

  describe('channelSupportScaleType', () => {
    // Make sure we always edit this when we add new channel
    it('should have at least one supported scale types for all channels with scale', () => {
      for (const channel of SCALE_CHANNELS) {
        expect(
          some(SCALE_TYPES, scaleType => {
            return channelSupportScaleType(channel, scaleType);
          })
        ).toBeTruthy();
      }
    });

    // Make sure we always edit this when we add new scale type
    it('should have at least one supported channel for all scale types', () => {
      for (const scaleType of SCALE_TYPES) {
        expect(
          some(SCALE_CHANNELS, channel => {
            return channelSupportScaleType(channel, scaleType);
          })
        ).toBeTruthy();
      }
    });

    it('shape should support only ordinal', () => {
      expect(channelSupportScaleType('shape', 'ordinal')).toBeTruthy();
      const nonOrdinal = without<ScaleType>(SCALE_TYPES, ['ordinal']);
      for (const scaleType of nonOrdinal) {
        expect(!channelSupportScaleType('shape', scaleType)).toBeTruthy();
      }
    });

    it('color should support all scale types except band', () => {
      for (const scaleType of SCALE_TYPES) {
        expect(channelSupportScaleType('color', scaleType)).toEqual(scaleType !== 'band');
      }
    });

    it('x, y, size, opacity should support all continuous scale type as well as band and point', () => {
      // x,y should use either band or point for ordinal input
      const scaleTypes = [...CONTINUOUS_TO_CONTINUOUS_SCALES, ScaleType.BAND, ScaleType.POINT];

      for (const channel of ['x', 'y', 'size', 'opacity'] as ScaleChannel[]) {
        expect(channelSupportScaleType(channel, 'ordinal')).toBeFalsy();
        for (const scaleType of scaleTypes) {
          expect(channelSupportScaleType(channel, scaleType)).toBeTruthy();
        }
      }
    });
  });

  describe('getSupportedScaleType', () => {
    it('should return correct scale types for quantitative positional channels', () => {
      const type = Type.QUANTITATIVE;
      const positionalScaleTypes = [ScaleType.LINEAR, ScaleType.LOG, ScaleType.SYMLOG, ScaleType.POW, ScaleType.SQRT];

      // x channel
      let scaleTypes = getSupportedScaleType(Channel.X, type);
      expect(positionalScaleTypes).toEqual(expect.arrayContaining(scaleTypes));

      // y channel
      scaleTypes = getSupportedScaleType(Channel.Y, Type.QUANTITATIVE);
      expect(scaleTypes).toEqual(expect.arrayContaining(positionalScaleTypes));
    });

    it('should return correct scale types for quantitative positional channels with bin', () => {
      const type = Type.QUANTITATIVE;

      // x channel
      let scaleTypes = getSupportedScaleType(Channel.X, type);
      expect(scaleTypes).toEqual(
        expect.arrayContaining([ScaleType.LINEAR, ScaleType.LOG, ScaleType.SYMLOG, ScaleType.POW, ScaleType.SQRT])
      );

      // y channel
      scaleTypes = getSupportedScaleType(Channel.Y, type);
      expect(scaleTypes).toEqual(
        expect.arrayContaining([ScaleType.LINEAR, ScaleType.LOG, ScaleType.SYMLOG, ScaleType.POW, ScaleType.SQRT])
      );
    });

    it('should return correct scale types for nominal positional channels', () => {
      const type = Type.NOMINAL;
      const nominalPositionalScaleTypes = [ScaleType.POINT, ScaleType.BAND];

      let scaleTypes = getSupportedScaleType(Channel.X, type);
      expect(scaleTypes).toEqual(nominalPositionalScaleTypes);

      scaleTypes = getSupportedScaleType(Channel.Y, type);
      expect(scaleTypes).toEqual(nominalPositionalScaleTypes);
    });

    it('should return correct scale types for temporal positional channels', () => {
      const type = Type.TEMPORAL;
      const temporalPositionalScaleTypes = [ScaleType.TIME, ScaleType.UTC];

      let scaleTypes = getSupportedScaleType(Channel.X, type);
      expect(scaleTypes).toEqual(temporalPositionalScaleTypes);

      scaleTypes = getSupportedScaleType(Channel.Y, type);
      expect(scaleTypes).toEqual(temporalPositionalScaleTypes);
    });
  });
});
