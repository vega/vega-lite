import {ScaleChannel, SCALE_CHANNELS} from '../src/channel';
import * as scale from '../src/scale';
import {
  channelSupportScaleType,
  CONTINUOUS_TO_CONTINUOUS_SCALES,
  CONTINUOUS_TO_DISCRETE_SCALES,
  ScaleType,
  SCALE_TYPES
} from '../src/scale';
import {some} from '../src/util';
import {without} from './util';

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

    it('shape should support only ordinal and discretizing scales', () => {
      const supportedScales = [ScaleType.ORDINAL, ...CONTINUOUS_TO_DISCRETE_SCALES] as const;
      for (const scaleType of supportedScales) {
        expect(channelSupportScaleType('shape', scaleType)).toBeTruthy();
      }
      const unsupported = without(SCALE_TYPES, supportedScales);
      for (const scaleType of unsupported) {
        expect(!channelSupportScaleType('shape', scaleType)).toBeTruthy();
      }
    });

    it('strokeDash should support only ordinal and discretizing scales', () => {
      const supportedScales = [ScaleType.ORDINAL, ...CONTINUOUS_TO_DISCRETE_SCALES] as const;
      for (const scaleType of supportedScales) {
        expect(channelSupportScaleType('strokeDash', scaleType)).toBeTruthy();
      }
      const unsupported = without(SCALE_TYPES, supportedScales);
      for (const scaleType of unsupported) {
        expect(!channelSupportScaleType('strokeDash', scaleType)).toBeTruthy();
      }
    });

    it('color should support all scale types except band', () => {
      for (const scaleType of SCALE_TYPES) {
        expect(channelSupportScaleType('color', scaleType)).toEqual(scaleType !== 'band');
      }
    });

    it('x and y support all continuous scale type as well as band and point', () => {
      // x,y should use either band or point for ordinal input
      const scaleTypes = [...CONTINUOUS_TO_CONTINUOUS_SCALES, ScaleType.BAND, ScaleType.POINT];

      for (const channel of ['x', 'y'] as ScaleChannel[]) {
        expect(channelSupportScaleType(channel, 'ordinal')).toBeFalsy();
        for (const scaleType of scaleTypes) {
          expect(channelSupportScaleType(channel, scaleType)).toBeTruthy();
        }
      }
    });

    it('size and opacity support all continuous scale type as well as band and point', () => {
      // x,y should use either band or point for ordinal input
      const scaleTypes = [...CONTINUOUS_TO_CONTINUOUS_SCALES, ScaleType.BAND, ScaleType.POINT];

      for (const channel of ['size', 'opacity'] as ScaleChannel[]) {
        for (const scaleType of scaleTypes) {
          expect(channelSupportScaleType(channel, scaleType)).toBeTruthy();
        }
      }
    });
  });
});
