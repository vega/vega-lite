import {assert} from 'chai';

import * as type from '../src/type';

describe('type', function () {
  describe('getFullName()', () => {
    it('should return correct lowercase, full type names.', () => {
      for (const t of ['q', 'Q', 'quantitative', 'QUANTITATIVE']) {
        assert.equal(type.getFullName(t), 'quantitative');
      }
      for (const t of ['t', 'T', 'temporal', 'TEMPORAL']) {
        assert.equal(type.getFullName(t), 'temporal');
      }
      for (const t of ['o', 'O', 'ordinal', 'ORDINAL']) {
        assert.equal(type.getFullName(t), 'ordinal');
      }
      for (const t of ['n', 'N', 'nominal', 'NOMINAL']) {
        assert.equal(type.getFullName(t), 'nominal');
      }
      for (const t of ['latitude', 'LATITUDE']) {
        assert.equal(type.getFullName(t), 'latitude');
      }
      for (const t of ['longitude', 'LONGITUDE']) {
        assert.equal(type.getFullName(t), 'longitude');
      }
      for (const t of ['geojson', 'GEOJSON']) {
        assert.equal(type.getFullName(t), 'geojson');
      }
    });

    it('should return undefined for invalid type', () => {
      assert.equal(type.getFullName('haha'), undefined);
    });
  });
});
