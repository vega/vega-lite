import {assert} from 'chai';

import * as log from '../../../src/log';

import {X, Y, ROW, COLUMN} from '../../../src/channel';
import {ScaleType} from '../../../src/scale';
import {type} from '../../../src/compile/scale/type';
import {TimeUnit} from '../../../src/timeunit';

describe('compile/scale', () => {
  describe('type()', () => {
    it('should return null for channel without scale', function() {
      assert.deepEqual(
        type(undefined, {
          field: 'a',
          type: 'temporal',
          timeUnit: TimeUnit.YEARMONTH
        }, 'detail', 'point', true),
        null
      );
    });

    it('should return time for most of time unit.', function() {
      // See exception in the next test)
      const TIMEUNITS = [
        TimeUnit.YEAR,
        TimeUnit.DATE,
        TimeUnit.MINUTES,
        TimeUnit.SECONDS,
        TimeUnit.MILLISECONDS,
        TimeUnit.YEARMONTH,
        TimeUnit.YEARMONTHDATE,
        TimeUnit.YEARMONTHDATEHOURS,
        TimeUnit.YEARMONTHDATEHOURSMINUTES,
        TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS,
        TimeUnit.HOURSMINUTES,
        TimeUnit.HOURSMINUTESSECONDS,
        TimeUnit.MINUTESSECONDS,
        TimeUnit.SECONDSMILLISECONDS,
        TimeUnit.YEARQUARTER,
        TimeUnit.QUARTERMONTH,
        TimeUnit.YEARQUARTERMONTH,
      ];
      for (const timeUnit of TIMEUNITS) {
        assert.deepEqual(
          type(undefined, {
            field: 'a',
            type: 'temporal',
            timeUnit: timeUnit
          }, Y, 'point', true),
          ScaleType.TIME
        );
      }
    });

    it('should return a discrete scale for hours, day, month, quarter for x-y', function() {
      [TimeUnit.MONTH, TimeUnit.HOURS, TimeUnit.DAY, TimeUnit.QUARTER].forEach((timeUnit) => {
        assert.deepEqual(
          type(undefined, {
            field: 'a',
            type: 'temporal',
            timeUnit: timeUnit
          }, Y, 'point', true),
          ScaleType.POINT
        );
      });
    });

    it('should return ordinal for shape', function() {
      assert.deepEqual(
        type(undefined, {
          field: 'a',
          type: 'temporal',
          timeUnit: TimeUnit.YEARMONTH
        }, 'shape', 'point', true),
        ScaleType.ORDINAL_LOOKUP
      );
    });

    it('should return ordinal for shape even if other type is specified', function() {
      [ScaleType.LINEAR, ScaleType.BAND, ScaleType.POINT].forEach((badScaleType) => {
        log.runLocalLogger((localLogger) => {
          assert.deepEqual(
            type(badScaleType, {
              field: 'a',
              type: 'temporal',
              timeUnit: TimeUnit.YEARMONTH
            }, 'shape', 'point', true),
            ScaleType.ORDINAL_LOOKUP
          );
          assert.equal(localLogger.warns[0], log.message.scaleTypeNotWorkWithChannel('shape', badScaleType, ScaleType.ORDINAL_LOOKUP));
        });
      });
    });

    it('should return band for row/column', function() {
      [ROW, COLUMN].forEach((channel) => {
        assert.deepEqual(
          type(undefined, {
            field: 'a',
            type: 'temporal',
            timeUnit: TimeUnit.YEARMONTH
          }, channel, 'point', true),
          ScaleType.BAND
        );
      });
    });

    it('should return band for row/column even if other type is specified', function() {
      [ROW, COLUMN].forEach((channel) => {
        [ScaleType.LINEAR, ScaleType.ORDINAL_LOOKUP, ScaleType.POINT].forEach((badScaleType) => {
          log.runLocalLogger((localLogger) => {
            assert.deepEqual(
              type(badScaleType, {
                field: 'a',
                type: 'temporal',
                timeUnit: TimeUnit.YEARMONTH
              }, channel, 'point', true),
              ScaleType.BAND
            );
            assert.equal(localLogger.warns[0], log.message.scaleTypeNotWorkWithChannel(channel, badScaleType, ScaleType.BAND));
          });
        });
      });
    });

    it('should return band scale for ordinal X,Y when mark is rect', () => {
      [X, Y].forEach((channel) => {
        assert.equal(type(undefined, {field: 'a', type: 'ordinal'}, channel, 'rect', true), ScaleType.BAND);
      });
    });

    it('should return band scale for X,Y when mark is bar and rangeStep is undefined (fit)', () => {
      [X, Y].forEach((channel) => {
        assert.equal(type(undefined, {field: 'a', type: 'ordinal'}, channel, 'bar', false), ScaleType.BAND);
      });
    });

    it('should return point scale for X,Y when mark is bar and rangeStep is defined', () => {
      [X, Y].forEach((channel) => {
        assert.equal(type(undefined, {field: 'a', type: 'ordinal'}, channel, 'bar', true), ScaleType.POINT);
      });
    });

    it('should return point scale for X,Y when mark is point', () => {
      [X, Y].forEach((channel) => {
        assert.equal(type(undefined, {field: 'a', type: 'ordinal'}, channel, 'point', true), ScaleType.POINT);
      });
    });

    it('should return point scale for X,Y when mark is point when ORDINAL SCALE TYPE is specified and throw warning', () => {
      [X, Y].forEach((channel) => {
        log.runLocalLogger((localLogger) => {
          assert.equal(type('ordinal', {field: 'a', type: 'ordinal'}, channel, 'point', true), ScaleType.POINT);
          assert.equal(localLogger.warns[0], log.message.scaleTypeNotWorkWithChannel(channel, 'ordinal', 'point'));
        });
      });
    });
  });
});
