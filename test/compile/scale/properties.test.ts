import {NONPOSITION_SCALE_CHANNELS, OFFSET_SCALE_CHANNELS} from '../../../src/channel';
import * as rules from '../../../src/compile/scale/properties';
import {AREA, BAR, LINE} from '../../../src/mark';
import {ScaleType} from '../../../src/scale';

describe('compile/scale', () => {
  describe('nice', () => {
    it('should return nice for x and y', () => {
      for (const c of ['x', 'y'] as const) {
        expect(rules.nice('linear', c, undefined, undefined, undefined, {type: 'quantitative'})).toBe(true);
      }
    });

    it('should not return nice for binned x and y', () => {
      for (const c of ['x', 'y'] as const) {
        expect(
          rules.nice('linear', c, undefined, undefined, undefined, {type: 'quantitative', field: 'a', bin: true})
        ).toBeUndefined();
      }
    });

    it('should not return nice for temporal x and y', () => {
      for (const c of ['x', 'y'] as const) {
        expect(rules.nice('time', c, undefined, undefined, undefined, {type: 'temporal'})).toBeUndefined();
      }
    });

    it('should not return nice when domain is set explicitly', () => {
      for (const c of ['x', 'y'] as const) {
        expect(rules.nice('time', c, [0, 42], undefined, undefined, {type: 'quantitative'})).toBeUndefined();
      }
    });

    it('should not return nice when domainMin is set explicitly', () => {
      for (const c of ['x', 'y'] as const) {
        expect(rules.nice('time', c, undefined, 0, undefined, {type: 'quantitative'})).toBeUndefined();
      }
    });

    it('should not return nice when domainMax is set explicitly', () => {
      for (const c of ['x', 'y'] as const) {
        expect(rules.nice('time', c, [0, 42], undefined, 0, {type: 'quantitative'})).toBeUndefined();
      }
    });
  });

  describe('padding', () => {
    it('should be pointPadding for point scale if channel is x or y and padding is not specified', () => {
      for (const c of ['x', 'y'] as const) {
        expect(rules.padding(c, 'point', {pointPadding: 13}, undefined, undefined, undefined)).toBe(13);
      }
    });

    it('should be continuousBandSize for linear x-scale of vertical bar', () => {
      expect(
        rules.padding(
          'x',
          'linear',
          {},
          {field: 'date', type: 'temporal'},
          {type: 'bar', orient: 'vertical'},
          {continuousBandSize: 13}
        )
      ).toBe(13);
    });

    it('should be undefined for linear x-scale for binned field of vertical bar', () => {
      expect(
        rules.padding(
          'x',
          'linear',
          {},
          {bin: true, field: 'date', type: 'temporal'},
          {type: 'bar', orient: 'vertical'},
          {continuousBandSize: 13}
        )
      ).toBeUndefined();
    });

    it('should be continuousBandSize for linear y-scale of horizontal bar', () => {
      expect(
        rules.padding(
          'y',
          'linear',
          {},
          {field: 'date', type: 'temporal'},
          {type: 'bar', orient: 'horizontal'},
          {continuousBandSize: 13}
        )
      ).toBe(13);
    });
  });

  describe('paddingInner', () => {
    it('should be undefined if padding is specified', () => {
      expect(rules.paddingInner(10, 'x', 'bar', 'band', {})).toBeUndefined();
    });

    it('should be bandPaddingInner if channel is x or y and padding is not specified', () => {
      expect(rules.paddingInner(undefined, 'x', 'bar', 'band', {bandPaddingInner: 15})).toBe(15);
      expect(rules.paddingInner(undefined, 'y', 'bar', 'band', {bandPaddingInner: 15})).toBe(15);
    });

    it('should be config.scale.nestedOffsetPaddingInner if channel is x or y and padding is not specified and there is a nested offset encoding', () => {
      expect(rules.paddingInner(undefined, 'x', 'bar', 'band', {bandWithNestedOffsetPaddingInner: 15}, true)).toBe(15);
      expect(rules.paddingInner(undefined, 'y', 'bar', 'band', {bandWithNestedOffsetPaddingInner: 15}, true)).toBe(15);
    });

    it('should be undefined for non-xy channels', () => {
      for (const c of NONPOSITION_SCALE_CHANNELS) {
        expect(rules.paddingInner(undefined, c, 'bar', 'band', {bandPaddingInner: 15})).toBeUndefined();
      }
    });

    it('should be offsetBandPaddingInnher for x/y-offset channels', () => {
      for (const c of OFFSET_SCALE_CHANNELS) {
        expect(rules.paddingInner(undefined, c, 'bar', 'band', {offsetBandPaddingInner: 0.11})).toBe(0.11);
      }
    });
  });

  describe('paddingOuter', () => {
    it('should be undefined if padding is specified', () => {
      for (const scaleType of ['point', 'band'] as ScaleType[]) {
        expect(rules.paddingOuter(10, 'x', scaleType, 0, {})).toBeUndefined();
      }
    });

    it('should be config.scale.bandPaddingOuter for band scale if channel is x or y and padding is not specified and config.scale.bandPaddingOuter', () => {
      for (const c of ['x', 'y'] as const) {
        expect(rules.paddingOuter(undefined, c, 'band', 0, {bandPaddingOuter: 16})).toBe(16);
      }
    });

    it('should be config.scale.nestedOffsetPaddingOuter for band scale if channel is x or y and padding is not specified and there is a nested offset encoding', () => {
      for (const c of ['x', 'y'] as const) {
        expect(rules.paddingOuter(undefined, c, 'band', 0, {bandWithNestedOffsetPaddingOuter: 16}, true)).toBe(16);
      }
    });

    it('should be paddingInner/2 for band scale if channel is x or y and padding is not specified and config.scale.bandPaddingOuter', () => {
      for (const c of ['x', 'y'] as const) {
        expect(rules.paddingOuter(undefined, c, 'band', 10, {})).toBe(5);
      }
    });

    it('should be undefined for non-xy channels', () => {
      for (const c of NONPOSITION_SCALE_CHANNELS) {
        for (const scaleType of ['point', 'band'] as ScaleType[]) {
          expect(rules.paddingOuter(undefined, c, scaleType, 0, {})).toBeUndefined();
        }
      }
    });

    it('should be 0.5 for x/yOffset channels with point scales', () => {
      for (const c of ['xOffset', 'yOffset'] as const) {
        expect(rules.paddingOuter(undefined, c, 'point', 0, {})).toBe(0.5);
      }
    });
    it('should be offsetBandPaddingOuter for x/yOffset channels with band scales', () => {
      for (const c of ['xOffset', 'yOffset'] as const) {
        expect(rules.paddingOuter(undefined, c, 'band', 0, {offsetBandPaddingOuter: 0.23})).toBe(0.23);
      }
    });
  });

  describe('reverse', () => {
    it('should return true for a continuous scale with sort = "descending"', () => {
      expect(rules.reverse('linear', 'descending', 'x', {})).toBe(true);
    });

    it('should return false for a discrete scale with sort = "descending"', () => {
      expect(rules.reverse('point', 'descending', 'x', {})).toBeUndefined();
    });

    it('should return xReverse for continuous x scale', () => {
      expect(rules.reverse('linear', 'ascending', 'x', {xReverse: {signal: 'rtl'}})).toEqual({signal: 'rtl'});
    });

    it('should return flip xReverse for continuous x scale with descending sort', () => {
      expect(rules.reverse('linear', 'descending', 'x', {xReverse: {signal: 'rtl'}})).toEqual({signal: '!rtl'});

      expect(rules.reverse('linear', 'descending', 'x', {xReverse: true})).toBe(false);
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
    it('should return default (undefined) when mapping a quantitative field to x with scale.domain = "unaggregated"', () => {
      expect(
        rules.zero('x', {field: 'a', type: 'quantitative'}, 'unaggregated', {type: 'point'}, 'linear', undefined, false)
      ).toBeUndefined();
    });

    it('should return true when mapping a quantitative field to size', () => {
      expect(
        rules.zero('size', {field: 'a', type: 'quantitative'}, undefined, {type: 'point'}, 'linear', undefined, false)
      ).toBeTruthy();
    });

    it('should return false when mapping a ordinal field to size', () => {
      expect(
        !rules.zero('size', {field: 'a', type: 'ordinal'}, undefined, {type: 'point'}, 'linear', undefined, false)
      ).toBeTruthy();
    });

    it('should return default (undefined) when mapping a non-binned quantitative field to x/y of point', () => {
      for (const channel of ['x', 'y'] as const) {
        expect(
          rules.zero(
            channel,
            {field: 'a', type: 'quantitative'},
            undefined,
            {type: 'point'},
            'linear',
            undefined,
            false
          )
        ).toBeUndefined();
      }
    });

    it('should return false when mapping a quantitative field to dimension axis of bar, line, and area', () => {
      for (const mark of [BAR, AREA, LINE]) {
        expect(
          rules.zero(
            'x',
            {field: 'a', type: 'quantitative'},
            undefined,
            {type: mark, orient: 'vertical'},
            'linear',
            undefined,
            false
          )
        ).toBe(false);
        expect(
          rules.zero(
            'y',
            {field: 'a', type: 'quantitative'},
            undefined,
            {type: mark, orient: 'horizontal'},
            'linear',
            undefined,
            false
          )
        ).toBe(false);
      }
    });

    it('should return false when mapping a binned quantitative field to x/y', () => {
      for (const channel of ['x', 'y'] as const) {
        expect(
          !rules.zero(
            channel,
            {bin: true, field: 'a', type: 'quantitative'},
            undefined,
            {type: 'point'},
            'linear',
            undefined,
            false
          )
        ).toBeTruthy();
      }
    });

    it('should return false when mapping a non-binned quantitative field with custom domain to x/y', () => {
      for (const channel of ['x', 'y'] as const) {
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
            'linear',
            undefined,
            false
          )
        ).toBeTruthy();
      }
    });

    it(`should return config.scale.zero instead of true if it is specified`, () => {
      const configZero = false;
      for (const channel of ['x', 'y'] as const) {
        expect(
          rules.zero(
            channel,
            {field: 'a', type: 'quantitative'},
            undefined,
            {type: 'point'},
            'linear',
            {zero: configZero},
            false
          )
        ).toBe(configZero);
      }

      expect(
        rules.zero(
          'size',
          {field: 'a', type: 'ordinal'},
          undefined,
          {type: 'point'},
          'linear',
          {zero: configZero},
          false
        )
      ).toBe(configZero);

      // ranged bar/area should take default configZero
      expect(
        rules.zero('x', {field: 'a', type: 'quantitative'}, undefined, {type: BAR}, 'linear', {zero: configZero}, true)
      ).toBe(configZero);
    });

    it(`should return true for x/y scales of the non-ranged area/bar charts regardless to config`, () => {
      for (const mark of [BAR, AREA]) {
        for (const channel of ['x', 'y'] as const) {
          expect(
            rules.zero(
              channel,
              {field: 'a', type: 'quantitative'},
              undefined,
              {type: mark},
              'linear',
              {zero: false},
              false
            )
          ).toBe(true);
        }
      }
    });

    it(`should return true for the continuous & quantitative size scale regardless to config`, () => {
      expect(
        rules.zero(
          'size',
          {field: 'a', type: 'quantitative'},
          undefined,
          {type: 'point'},
          'linear',
          {zero: false},
          false
        )
      ).toBe(true);
    });
  });
});
