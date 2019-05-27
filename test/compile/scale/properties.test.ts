import {Channel, NONPOSITION_SCALE_CHANNELS} from '../../../src/channel';
import * as rules from '../../../src/compile/scale/properties';
import {AREA, BAR, LINE} from '../../../src/mark';
import {ScaleType} from '../../../src/scale';

describe('compile/scale', () => {
  describe('nice', () => {
    it('should return nice for x and y.', () => {
      for (const c of ['x', 'y'] as Channel[]) {
        expect(rules.nice('linear', c, {type: 'quantitative'})).toEqual(true);
      }
    });

    it('should not return nice for binned x and y.', () => {
      for (const c of ['x', 'y'] as Channel[]) {
        expect(rules.nice('linear', c, {type: 'quantitative', bin: true})).toEqual(undefined);
      }
    });

    it('should not return nice for temporal x and y.', () => {
      for (const c of ['x', 'y'] as Channel[]) {
        expect(rules.nice('time', c, {type: 'temporal'})).toEqual(undefined);
      }
    });
  });

  describe('padding', () => {
    it('should be pointPadding for point scale if channel is x or y and padding is not specified.', () => {
      for (const c of ['x', 'y'] as Channel[]) {
        expect(rules.padding(c, 'point', {pointPadding: 13}, undefined, undefined, undefined)).toEqual(13);
      }
    });

    it('should be continuousBandSize for linear x-scale of vertical bar.', () => {
      expect(
        rules.padding(
          'x',
          'linear',
          {},
          {field: 'date', type: 'temporal'},
          {type: 'bar', orient: 'vertical'},
          {continuousBandSize: 13}
        )
      ).toEqual(13);
    });

    it('should be undefined for linear x-scale for binned field of vertical bar.', () => {
      expect(
        rules.padding(
          'x',
          'linear',
          {},
          {bin: true, field: 'date', type: 'temporal'},
          {type: 'bar', orient: 'vertical'},
          {continuousBandSize: 13}
        )
      ).toEqual(undefined);
    });

    it('should be continuousBandSize for linear y-scale of horizontal bar.', () => {
      expect(
        rules.padding(
          'y',
          'linear',
          {},
          {field: 'date', type: 'temporal'},
          {type: 'bar', orient: 'horizontal'},
          {continuousBandSize: 13}
        )
      ).toEqual(13);
    });
  });

  describe('paddingInner', () => {
    it('should be undefined if padding is specified.', () => {
      expect(rules.paddingInner(10, 'x', 'bar', {})).toEqual(undefined);
    });

    it('should be bandPaddingInner if channel is x or y and padding is not specified.', () => {
      expect(rules.paddingInner(undefined, 'x', 'bar', {bandPaddingInner: 15})).toEqual(15);
      expect(rules.paddingInner(undefined, 'y', 'bar', {bandPaddingInner: 15})).toEqual(15);
    });

    it('should be undefined for non-xy channels.', () => {
      for (const c of NONPOSITION_SCALE_CHANNELS) {
        expect(rules.paddingInner(undefined, c, 'bar', {bandPaddingInner: 15})).toEqual(undefined);
      }
    });
  });

  describe('paddingOuter', () => {
    it('should be undefined if padding is specified.', () => {
      for (const scaleType of ['point', 'band'] as ScaleType[]) {
        expect(rules.paddingOuter(10, 'x', scaleType, 'bar', 0, {})).toEqual(undefined);
      }
    });

    it('should be config.scale.bandPaddingOuter for band scale if channel is x or y and padding is not specified and config.scale.bandPaddingOuter.', () => {
      for (const c of ['x', 'y'] as Channel[]) {
        expect(rules.paddingOuter(undefined, c, 'band', 'bar', 0, {bandPaddingOuter: 16})).toEqual(16);
      }
    });
    it('should be paddingInner/2 for band scale if channel is x or y and padding is not specified and config.scale.bandPaddingOuter.', () => {
      for (const c of ['x', 'y'] as Channel[]) {
        expect(rules.paddingOuter(undefined, c, 'band', 'bar', 10, {})).toEqual(5);
      }
    });

    it('should be undefined for non-xy channels.', () => {
      for (const c of NONPOSITION_SCALE_CHANNELS) {
        for (const scaleType of ['point', 'band'] as ScaleType[]) {
          expect(rules.paddingOuter(undefined, c, scaleType, 'bar', 0, {})).toEqual(undefined);
        }
      }
    });
  });

  describe('reverse', () => {
    it('should return true for a continuous scale with sort = "descending".', () => {
      expect(rules.reverse('linear', 'descending')).toBe(true);
    });

    it('should return false for a discrete scale with sort = "descending".', () => {
      expect(rules.reverse('point', 'descending')).not.toBeDefined();
    });
  });

  describe('interpolate', () => {
    it('should return hcl for colored quantitative field', () => {
      expect(rules.interpolate('color', 'quantitative')).toBe('hcl');
    });

    it('should return undefined for colored nominal field', () => {
      expect(rules.interpolate('color', 'nominal')).toBeUndefined();
    });

    it('should return undefined for size', () => {
      expect(rules.interpolate('size', 'quantitative')).toBeUndefined();
    });
  });

  describe('zero', () => {
    it('should return true when mapping a quantitative field to x with scale.domain = "unaggregated"', () => {
      expect(
        rules.zero('x', {field: 'a', type: 'quantitative'}, 'unaggregated', {type: 'point'}, 'linear')
      ).toBeTruthy();
    });

    it('should return true when mapping a quantitative field to size', () => {
      expect(rules.zero('size', {field: 'a', type: 'quantitative'}, undefined, {type: 'point'}, 'linear')).toBeTruthy();
    });

    it('should return false when mapping a ordinal field to size', () => {
      expect(!rules.zero('size', {field: 'a', type: 'ordinal'}, undefined, {type: 'point'}, 'linear')).toBeTruthy();
    });

    it('should return true when mapping a non-binned quantitative field to x/y of point', () => {
      for (const channel of ['x', 'y'] as Channel[]) {
        expect(
          rules.zero(channel, {field: 'a', type: 'quantitative'}, undefined, {type: 'point'}, 'linear')
        ).toBeTruthy();
      }
    });

    it('should return false when mapping a quantitative field to dimension axis of bar, line, and area', () => {
      for (const mark of [BAR, AREA, LINE]) {
        expect(
          rules.zero('x', {field: 'a', type: 'quantitative'}, undefined, {type: mark, orient: 'vertical'}, 'linear')
        ).toBe(false);
        expect(
          rules.zero('y', {field: 'a', type: 'quantitative'}, undefined, {type: mark, orient: 'horizontal'}, 'linear')
        ).toBe(false);
      }
    });

    it('should return false when mapping a binned quantitative field to x/y', () => {
      for (const channel of ['x', 'y'] as Channel[]) {
        expect(
          !rules.zero(channel, {bin: true, field: 'a', type: 'quantitative'}, undefined, {type: 'point'}, 'linear')
        ).toBeTruthy();
      }
    });

    it('should return false when mapping a non-binned quantitative field with custom domain to x/y', () => {
      for (const channel of ['x', 'y'] as Channel[]) {
        expect(
          !rules.zero(
            channel,
            {
              bin: true,
              field: 'a',
              type: 'quantitative'
            },
            [3, 5],
            {type: 'point'},
            'linear'
          )
        ).toBeTruthy();
      }
    });
  });
});
