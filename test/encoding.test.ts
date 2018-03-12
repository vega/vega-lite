import {assert} from 'chai';
import {normalizeEncoding} from '../src/encoding';

describe('axis', () => {
  describe('normalizeEncoding', () => {
    it('should convert lat and long type to channels', () => {
      const encoding = normalizeEncoding({
        x: {field: 'a', type: 'longitude'},
        y: {field: 'b', type: 'latitude'},
        x2: {field: 'a2', type: 'longitude'},
        y2: {field: 'b2', type: 'latitude'}
      }, 'rule');

      assert.deepEqual(encoding, {
        longitude: {field: 'a', type: 'quantitative'},
        latitude: {field: 'b', type: 'quantitative'},
        longitude2: {field: 'a2', type: 'quantitative'},
        latitude2: {field: 'b2', type: 'quantitative'}
      });
    });
  });
});
