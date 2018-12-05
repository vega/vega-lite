/* tslint:disable:quotemark */

import * as properties from '../../../src/compile/legend/properties';

describe('compile/legend', () => {
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
      expect(height).toEqual(20);
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
