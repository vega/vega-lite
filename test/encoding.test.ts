import {assert} from 'chai';
import {normalizeEncoding} from '../src/encoding';
import * as log from '../src/log';

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

    it('should drop color channel if fill is specified', log.wrap((logger) => {
      const encoding = normalizeEncoding({
        color: {field: 'a', type: 'quantitative'},
        fill: {field: 'b', type: 'quantitative'}
      }, 'rule');

      assert.deepEqual(encoding, {
        fill: {field: 'b', type: 'quantitative'}
      });
      assert.equal(logger.warns[0], log.message.droppingColor('encoding', {fill: true}));
    }));

    it('should drop color channel if stroke is specified', log.wrap((logger) => {
      const encoding = normalizeEncoding({
        color: {field: 'a', type: 'quantitative'},
        stroke: {field: 'b', type: 'quantitative'}
      }, 'rule');

      assert.deepEqual(encoding, {
        stroke: {field: 'b', type: 'quantitative'}
      });
      assert.equal(logger.warns[0], log.message.droppingColor('encoding', {stroke: true}));
    }));
  });
});
