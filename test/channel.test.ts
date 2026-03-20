import {
  CHANNELS,
  isScaleChannel,
  NONPOSITION_SCALE_CHANNELS,
  rangeType,
  SCALE_CHANNELS,
  SINGLE_DEF_CHANNELS,
  UNIT_CHANNELS,
} from '../src/channel.js';
import {without} from './util.js';

describe('channel', () => {
  describe('UNIT_CHANNELS', () => {
    it('should be CHANNELS without row and column', () => {
      expect(UNIT_CHANNELS).toEqual(without(CHANNELS, ['row', 'column', 'facet']));
    });
  });

  describe('SINGLE_DEF_CHANNELS', () => {
    it('should be CHANNELS without detail, order, tooltip, and hierarchy', () => {
      expect(SINGLE_DEF_CHANNELS).toEqual(without(CHANNELS, ['detail', 'order', 'tooltip', 'hierarchy']));
    });
  });

  describe('SCALE_CHANNELS', () => {
    it('should exclude non-scale channels', () => {
      expect(SCALE_CHANNELS).toEqual(
        without(UNIT_CHANNELS, [
          'x2',
          'y2',
          'xError',
          'yError',
          'xError2',
          'yError2',
          'theta2',
          'radius2',
          'latitude',
          'longitude',
          'latitude2',
          'longitude2',
          'order',
          'detail',
          'key',
          'text',
          'tooltip',
          'href',
          'url',
          'description',
          'hierarchy',
        ]),
      );
    });
  });

  describe('NONPOSITION_SCALE_CHANNELS', () => {
    it('should be SCALE_CHANNELS without x, y, x2, y2', () => {
      expect(NONPOSITION_SCALE_CHANNELS).toEqual(
        without(SCALE_CHANNELS, ['x', 'y', 'xOffset', 'yOffset', 'theta', 'radius']),
      );
    });
  });

  describe('isScaleChannel', () => {
    it('should return true for all scale channel', () => {
      for (const channel of SCALE_CHANNELS) {
        expect(isScaleChannel(channel)).toBeTruthy();
      }
    });
  });

  describe('rangeType', () => {
    it('should be defined for all channels (no error).', () => {
      for (const c of CHANNELS) {
        expect(() => {
          rangeType(c);
        }).not.toThrow();
      }
    });
  });
});
