import {assert} from 'chai';
import {defaultConfig} from '../src/config';
import {extractTransformsFromEncoding, normalizeEncoding} from '../src/encoding';
import {isPositionFieldDef} from '../src/fielddef';
import * as log from '../src/log';

describe('encoding', () => {
  describe('normalizeEncoding', () => {
    it(
      'should drop color channel if fill is specified',
      log.wrap(logger => {
        const encoding = normalizeEncoding(
          {
            color: {field: 'a', type: 'quantitative'},
            fill: {field: 'b', type: 'quantitative'}
          },
          'rule'
        );

        assert.deepEqual(encoding, {
          fill: {field: 'b', type: 'quantitative'}
        });
        assert.equal(logger.warns[0], log.message.droppingColor('encoding', {fill: true}));
      })
    );

    it(
      'should drop color channel if stroke is specified',
      log.wrap(logger => {
        const encoding = normalizeEncoding(
          {
            color: {field: 'a', type: 'quantitative'},
            stroke: {field: 'b', type: 'quantitative'}
          },
          'rule'
        );

        assert.deepEqual(encoding, {
          stroke: {field: 'b', type: 'quantitative'}
        });
        assert.equal(logger.warns[0], log.message.droppingColor('encoding', {stroke: true}));
      })
    );
  });

  describe('extractTransformsFromEncoding', () => {
    it('should indlude axis in extracted encoding', () => {
      const encoding = extractTransformsFromEncoding(
        {
          x: {field: 'dose', type: 'ordinal', axis: {labelAngle: 15}},
          y: {field: 'response', type: 'quantitative'}
        },
        defaultConfig
      ).encoding;

      const x = encoding.x;
      expect(x).toBeDefined();
      if (isPositionFieldDef(x)) {
        expect(x.axis).toBeDefined();
        expect(x.axis.labelAngle).toEqual(15);
      } else {
        assert.fail(null, null, 'encoding x is not PositionFieldDef');
      }
    });
  });
});
