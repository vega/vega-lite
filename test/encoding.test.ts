import {assert} from 'chai';
import {normalizeEncoding} from '../src/encoding';
import * as log from '../src/log';

describe('encoding', () => {
  describe('normalizeEncoding', () => {
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
