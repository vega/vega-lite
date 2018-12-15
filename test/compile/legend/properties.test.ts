/* tslint:disable:quotemark */

import {LegendOrient} from 'vega';
import * as properties from '../../../src/compile/legend/properties';

describe('compile/legend', () => {
  describe('direction()', () => {
    it('should return horizontal for top/bottom if legend.orient and its config are not defined', () => {
      const orients: LegendOrient[] = ['top', 'bottom'];
      for (const orient of orients) {
        const dir = properties.direction({
          legend: {orient},
          legendConfig: {},
          channel: 'color',
          scaleType: 'linear'
        });

        expect(dir).toEqual('horizontal');
      }
    });

    it('should return undefined for left/right if legend.orient and its config are not defined', () => {
      const orients: LegendOrient[] = ['left', 'right', undefined, 'none'];
      for (const orient of orients) {
        const dir = properties.direction({
          legend: {orient},
          legendConfig: {},
          channel: 'color',
          scaleType: 'linear'
        });

        expect(dir).toEqual(undefined);
      }
    });

    it('should return horizontal for quantitative inner legend if legend.orient and its config are not defined', () => {
      const orients: LegendOrient[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
      for (const orient of orients) {
        const dir = properties.direction({
          legend: {orient},
          legendConfig: {},
          channel: 'color',
          scaleType: 'linear'
        });

        expect(dir).toEqual('horizontal');
      }
    });

    it('should return undefined for discrete inner legend if legend.orient and its config are not defined', () => {
      const orients: LegendOrient[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
      for (const orient of orients) {
        const dir = properties.direction({
          legend: {orient},
          legendConfig: {},
          channel: 'color',
          scaleType: 'ordinal'
        });

        expect(dir).toEqual(undefined);
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
  });

  describe('clipHeight()', () => {
    it('should return clip height for continuous domain', () => {
      const height = properties.clipHeight('linear');
      expect(height).toBe(20);
    });

    it('should simply return for discrete domain', () => {
      const height = properties.clipHeight('ordinal');
      expect(height).toBeUndefined();
    });
  });

  describe('labelOverlap()', () => {
    it('should return undefined for linear', () => {
      const overlap = properties.labelOverlap('linear');
      expect(overlap).toBeUndefined();
    });

    it('should return greedy for log', () => {
      const overlap = properties.labelOverlap('log');
      expect(overlap).toEqual('greedy');
    });

    it('should return greedy for threshold', () => {
      const overlap = properties.labelOverlap('threshold');
      expect(overlap).toEqual('greedy');
    });
  });
});
