import {assert} from 'chai';

import * as log from '../../../src/log';

import {defaultConfig} from '../../../src/config';
import {X, Y, ROW, COLUMN} from '../../../src/channel';
import {ScaleType} from '../../../src/scale';
import {ORDINAL, NOMINAL} from '../../../src/type';
import scaleType from '../../../src/compile/scale/type';
import {TimeUnit} from '../../../src/timeunit';

describe('compile/scale', () => {
  describe('type()', () => {
    it('should return null for channel without scale', function() {
      assert.deepEqual(
        scaleType({
          field: 'a',
          type: 'temporal',
          timeUnit: TimeUnit.YEARMONTH
        }, 'detail', 'point', undefined, defaultConfig),
        null
      );
    });

    describe('row/column', () => {
      it('should return band for row/column', function() {
        [ROW, COLUMN].forEach((channel) => {
          assert.deepEqual(
            scaleType({
              field: 'a',
              type: 'temporal',
              timeUnit: TimeUnit.YEARMONTH
            }, channel, 'point', undefined, defaultConfig),
            ScaleType.BAND
          );
        });
      });

      it('should return band for row/column even if other type is specified', function() {
        [ROW, COLUMN].forEach((channel) => {
          [ScaleType.LINEAR, ScaleType.ORDINAL_LOOKUP, ScaleType.POINT].forEach((badScaleType) => {
            log.runLocalLogger((localLogger) => {
              assert.deepEqual(
                scaleType({
                  field: 'a',
                  type: 'temporal',
                  timeUnit: TimeUnit.YEARMONTH,
                  scale: {type: badScaleType}
                }, channel, 'point', undefined, defaultConfig),
                ScaleType.BAND
              );
              assert.equal(localLogger.warns[0], log.message.scaleTypeNotWorkWithChannel(channel, badScaleType, ScaleType.BAND));
            });
          });
        });
      });
    });

    describe('shape', () => {
      it('should return ordinal for shape', function() {
        assert.deepEqual(
          scaleType({
            field: 'a',
            type: 'temporal',
            timeUnit: TimeUnit.YEARMONTH
          }, 'shape', 'point', undefined, defaultConfig),
          ScaleType.ORDINAL_LOOKUP
        );
      });

      it('should return ordinal for shape even if other type is specified', function() {
        [ScaleType.LINEAR, ScaleType.BAND, ScaleType.POINT].forEach((badScaleType) => {
          log.runLocalLogger((localLogger) => {
            assert.deepEqual(
              scaleType({
                field: 'a',
                type: 'temporal',
                timeUnit: TimeUnit.YEARMONTH,
                scale: {type: badScaleType}
              }, 'shape', 'point', undefined, defaultConfig),
              ScaleType.ORDINAL_LOOKUP
            );
            assert.equal(localLogger.warns[0], log.message.scaleTypeNotWorkWithChannel('shape', badScaleType, ScaleType.ORDINAL_LOOKUP));
          });
        });
      });
    });

    describe('nominal/ordinal', () => {
      describe('color', () => {
        // TODO:
      });

      describe('x,y', () => {
        it('should return band scale for ordinal X,Y when mark is rect', () => {
          [ORDINAL, NOMINAL].forEach((t) => {
            [X, Y].forEach((channel) => {
              assert.equal(
                scaleType({field: 'a', type: t}, channel, 'rect', undefined, defaultConfig),
                ScaleType.BAND
              );
            });
          });
        });

        it('should return band scale for X,Y when mark is bar and rangeStep is null (fit)', () => {
          [ORDINAL, NOMINAL].forEach((t) => {
            [X, Y].forEach((channel) => {
              assert.equal(scaleType({field: 'a', type: t, scale: {rangeStep: null}}, channel, 'bar', undefined, defaultConfig), ScaleType.BAND);
            });
          });
        });

        it('should return point scale for X,Y when mark is bar and rangeStep is defined', () => {
          [ORDINAL, NOMINAL].forEach((t) => {
            [X, Y].forEach((channel) => {
              assert.equal(scaleType({field: 'a', type: t, scale: {rangeStep: 21}}, channel, 'bar', undefined, defaultConfig), ScaleType.POINT);
            });
          });
        });

        it('should return point scale for X,Y when mark is point', () => {
          [ORDINAL, NOMINAL].forEach((t) => {
            [X, Y].forEach((channel) => {
              assert.equal(scaleType({field: 'a', type: t}, channel, 'point', undefined, defaultConfig), ScaleType.POINT);
            });
          });
        });

        it('should return point scale for X,Y when mark is point when ORDINAL SCALE TYPE is specified and throw warning', () => {
          [ORDINAL, NOMINAL].forEach((t) => {
            [X, Y].forEach((channel) => {
              log.runLocalLogger((localLogger) => {
                assert.equal(scaleType({field: 'a', type: t, scale: {type: 'ordinal'}}, channel, 'point', undefined, defaultConfig), ScaleType.POINT);
                assert.equal(localLogger.warns[0], log.message.scaleTypeNotWorkWithChannel(channel, 'ordinal', 'point'));
              });
            });
          });
        });
      });
    });

    describe('temporal', () => {
      // TODO color

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
            scaleType({
              field: 'a',
              type: 'temporal',
              timeUnit: timeUnit
            }, Y, 'point', undefined, defaultConfig),
            ScaleType.TIME
          );
        }
      });

      it('should return a discrete scale for hours, day, month, quarter for x-y', function() {
        [TimeUnit.MONTH, TimeUnit.HOURS, TimeUnit.DAY, TimeUnit.QUARTER].forEach((timeUnit) => {
          assert.deepEqual(
            scaleType({
              field: 'a',
              type: 'temporal',
              timeUnit: timeUnit
            }, Y, 'point', undefined, defaultConfig),
            ScaleType.POINT
          );
        });
      });
    });
    describe('quantitative', () => {
      // TODO: color
      // TODO: normal
    });
  });
});
