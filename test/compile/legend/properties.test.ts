import {LegendOrient} from 'vega';
import * as properties from '../../../src/compile/legend/properties';

describe('compile/legend', () => {
  describe('defaultDirection()', () => {
    it('should return horizontal for top/bottom if legend.orient and its config are not defined', () => {
      const orients: LegendOrient[] = ['top', 'bottom'];
      for (const orient of orients) {
        const dir = properties.defaultDirection(orient, 'gradient');

        expect(dir).toBe('horizontal');
      }
    });

    it('should return undefined for left/right if legend.orient and its config are not defined', () => {
      const orients: LegendOrient[] = ['left', 'right', undefined, 'none'];
      for (const orient of orients) {
        const dir = properties.defaultDirection(orient, 'gradient');

        expect(dir).toBeUndefined();
      }
    });

    it('should return horizontal for quantitative inner legend if legend.orient and its config are not defined', () => {
      const orients: LegendOrient[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
      for (const orient of orients) {
        const dir = properties.defaultDirection(orient, 'gradient');

        expect(dir).toBe('horizontal');
      }
    });

    it('should return undefined for discrete inner legend if legend.orient and its config are not defined', () => {
      const orients: LegendOrient[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
      for (const orient of orients) {
        const dir = properties.defaultDirection(orient, 'symbol');
        expect(dir).toBeUndefined();
      }
    });
  });

  describe('values()', () => {
    it('should return correct timestamp values for DateTimes', () => {
      const values = properties.values({values: [{year: 1970}, {year: 1980}]}, {field: 'a', type: 'temporal'});

      expect(values).toEqual([
        {signal: 'datetime(1970, 0, 1, 0, 0, 0, 0)'},
        {signal: 'datetime(1980, 0, 1, 0, 0, 0, 0)'}
      ]);
    });

    it('should simply return values for non-DateTime', () => {
      const values = properties.values({values: [1, 2, 3, 4]}, {field: 'a', type: 'quantitative'});

      expect(values).toEqual([1, 2, 3, 4]);
    });

    it('returns signal correctly for non-DateTime', () => {
      const values = properties.values({values: {signal: 'a'}}, {field: 'a', type: 'quantitative'});
      expect(values).toEqual({signal: 'a'});
    });
  });

  describe('clipHeight()', () => {
    it('should return clip height for gradient legend', () => {
      const height = properties.clipHeight('gradient');
      expect(height).toBe(20);
    });

    it('should simply return for symbol legends', () => {
      const height = properties.clipHeight('symbol');
      expect(height).toBeUndefined();
    });
  });

  describe('defaultLabelOverlap()', () => {
    it('should return undefined for linear', () => {
      const overlap = properties.defaultLabelOverlap('linear');
      expect(overlap).toBeUndefined();
    });

    it('should return greedy for log', () => {
      const overlap = properties.defaultLabelOverlap('log');
      expect(overlap).toBe('greedy');
    });

    it('should return greedy for symlog', () => {
      const overlap = properties.defaultLabelOverlap('symlog');
      expect(overlap).toBe('greedy');
    });

    it('should return greedy for threshold', () => {
      const overlap = properties.defaultLabelOverlap('threshold');
      expect(overlap).toBe('greedy');
    });
  });

  describe('defaultSymbolType()', () => {
    it('return stroke for line', () => {
      const overlap = properties.defaultSymbolType('line', 'color', {}, undefined);
      expect(overlap).toBe('stroke');
    });

    it('return stroke for rule', () => {
      const overlap = properties.defaultSymbolType('rule', 'color', {}, undefined);
      expect(overlap).toBe('stroke');
    });

    it('return square for rect', () => {
      const overlap = properties.defaultSymbolType('rect', 'color', {}, undefined);
      expect(overlap).toBe('square');
    });

    it('return circle for point', () => {
      const overlap = properties.defaultSymbolType('point', 'color', {}, undefined);
      expect(overlap).toBe('circle');
    });

    it('return the mark shape if defined', () => {
      const overlap = properties.defaultSymbolType('point', 'color', {}, 'triangle');
      expect(overlap).toBe('triangle');
    });

    it('return the value of the shape encoding', () => {
      const overlap = properties.defaultSymbolType('point', 'color', {value: 'triangle'}, undefined);
      expect(overlap).toBe('triangle');
    });
  });
});
