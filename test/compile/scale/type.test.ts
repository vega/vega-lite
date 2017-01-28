import {assert} from 'chai';

import * as log from '../../../src/log';

import {defaultConfig} from '../../../src/config';
import {X, Y, ROW, COLUMN, CHANNELS} from '../../../src/channel';
import {PRIMITIVE_MARKS} from '../../../src/mark';
import {ScaleType} from '../../../src/scale';
import {ORDINAL, NOMINAL} from '../../../src/type';
import scaleType, {channelRangeType} from '../../../src/compile/scale/type';
import {TimeUnit} from '../../../src/timeunit';
import * as util from '../../../src/util';

describe('compile/scale', () => {
  describe('type()', () => {
    it('should return null for channel without scale', function() {
      assert.deepEqual(
        scaleType(undefined, 'temporal', 'detail', 'yearmonth', 'point', undefined, undefined, defaultConfig),
        null
      );
    });

    describe('row/column', () => {
      it('should return band for row/column', function() {
        [ROW, COLUMN].forEach((channel) => {
          assert.deepEqual(
            scaleType(undefined, 'temporal', channel, 'yearmonth', 'point', undefined, undefined, defaultConfig),
            ScaleType.BAND
          );
        });
      });

      it('should return band for row/column even if other type is specified', function() {
        [ROW, COLUMN].forEach((channel) => {
          [ScaleType.LINEAR, ScaleType.ORDINAL, ScaleType.POINT].forEach((badScaleType) => {
            log.runLocalLogger((localLogger) => {
              assert.deepEqual(
                scaleType(badScaleType, 'temporal', channel, 'yearmonth', 'point', undefined, undefined, defaultConfig),
                ScaleType.BAND
              );
              assert.equal(localLogger.warns[0], log.message.scaleTypeNotWorkWithChannel(channel, badScaleType, ScaleType.BAND));
            });
          });
        });
      });
    });

    describe('nominal/ordinal', () => {
      describe('color', () => {
        it('should return ordinal scale for nominal data by default.', () => {
          assert.equal(
            scaleType(undefined, 'nominal', 'color', undefined, 'point', undefined, undefined, defaultConfig),
            ScaleType.ORDINAL
          );
        });

        it('should return ordinal scale for ordinal data.', () => {
          assert.equal(
            scaleType(undefined, 'ordinal', 'color', undefined, 'point', undefined, undefined, defaultConfig),
            ScaleType.ORDINAL
          );
        });
      });

      describe('discrete channel (shape)', () => {
        it('should return ordinal for nominal field', function() {
          assert.deepEqual(
            scaleType(undefined, 'nominal', 'shape', undefined, 'point', undefined, undefined, defaultConfig),
            ScaleType.ORDINAL
          );
        });

        it('should return ordinal even if other type is specified', function() {
          [ScaleType.LINEAR, ScaleType.BAND, ScaleType.POINT].forEach((badScaleType) => {
            log.runLocalLogger((localLogger) => {
              assert.deepEqual(
                scaleType(badScaleType, 'nominal', 'shape', undefined, 'point', undefined, undefined, defaultConfig),
                ScaleType.ORDINAL
              );
              assert.equal(localLogger.warns[0], log.message.scaleTypeNotWorkWithChannel('shape', badScaleType, ScaleType.ORDINAL));
            });
          });
        });

        it('should return ordinal for an ordinal field and throw a warning.', log.wrap((localLogger) => {
          assert.deepEqual(
            scaleType(undefined, 'ordinal', 'shape', undefined, 'point', undefined, undefined, defaultConfig),
            ScaleType.ORDINAL
          );
          assert.equal(localLogger.warns[0], log.message.discreteChannelCannotEncode('shape', 'ordinal'));
        }));
      });

      describe('continuous', () => {
        it('should return point scale for ordinal X,Y for marks others than rect and bar', () => {
          PRIMITIVE_MARKS.forEach((mark) => {
            if (util.contains(['bar', 'rect'], mark)) {
              return;
            }

            [ORDINAL, NOMINAL].forEach((t) => {
              [X, Y].forEach((channel) => {
                assert.equal(
                  scaleType(undefined, t, channel, undefined, mark, undefined, undefined, defaultConfig),
                  ScaleType.POINT
                );
              });
            });
          });
        });

        it('should return band scale for ordinal X,Y when mark is rect', () => {
          [ORDINAL, NOMINAL].forEach((t) => {
            [X, Y].forEach((channel) => {
              assert.equal(
                scaleType(undefined, t, channel, undefined, 'rect', undefined, undefined, defaultConfig),
                ScaleType.BAND
              );
            });
          });
        });

        it('should return band scale for X,Y when mark is bar and rangeStep is null (fit)', () => {
          [ORDINAL, NOMINAL].forEach((t) => {
            [X, Y].forEach((channel) => {
              assert.equal(scaleType(undefined, t, channel, undefined, 'bar', null, undefined, defaultConfig), ScaleType.BAND);
            });
          });
        });

        it('should return point scale for X,Y when mark is bar and rangeStep is defined', () => {
          [ORDINAL, NOMINAL].forEach((t) => {
            [X, Y].forEach((channel) => {
              assert.equal(scaleType(undefined, t, channel, undefined, 'bar', undefined, 21, defaultConfig), ScaleType.POINT);
            });
          });
        });

        it('should return point scale for X,Y when mark is point', () => {
          [ORDINAL, NOMINAL].forEach((t) => {
            [X, Y].forEach((channel) => {
              assert.equal(scaleType(undefined, t, channel, undefined, 'point', undefined, undefined, defaultConfig), ScaleType.POINT);
            });
          });
        });

        it('should return point scale for X,Y when mark is point when ORDINAL SCALE TYPE is specified and throw warning', () => {
          [ORDINAL, NOMINAL].forEach((t) => {
            [X, Y].forEach((channel) => {
              log.runLocalLogger((localLogger) => {
                assert.equal(scaleType('ordinal', t, channel, undefined, 'point', undefined, undefined, defaultConfig), ScaleType.POINT);
                assert.equal(localLogger.warns[0], log.message.scaleTypeNotWorkWithChannel(channel, 'ordinal', 'point'));
              });
            });
          });
        });

        it('should return point scale for ordinal/nominal fields for continous channels other than x and y.', () => {
          const OTHER_CONTINUOUS_CHANNELS = CHANNELS.filter((c) => channelRangeType(c) === 'continuous' && !util.contains([X, Y, ROW, COLUMN], c));
          PRIMITIVE_MARKS.forEach((mark) => {
            [ORDINAL, NOMINAL].forEach((t) => {
              OTHER_CONTINUOUS_CHANNELS.forEach((channel) => {
                assert.equal(
                  scaleType(undefined, t, channel, undefined, mark, undefined, undefined, defaultConfig),
                  ScaleType.POINT,
                  `${channel}, ${mark}, ${t} ` + scaleType(undefined, t, channel, undefined, mark, undefined, undefined, defaultConfig)
                );
              });
            });
          });
        });
      });
    });

    describe('temporal', () => {
      it('should return sequential scale for temporal color field by default.', () => {
        assert.equal(
          scaleType(undefined, 'temporal','color', undefined, 'point', undefined, undefined, defaultConfig),
          ScaleType.SEQUENTIAL
        );
      });

      it('should return ordinal for temporal field and throw a warning.', log.wrap((localLogger) => {
        assert.deepEqual(
          scaleType(undefined, 'temporal', 'shape', 'yearmonth', 'point', undefined, undefined, defaultConfig),
          ScaleType.ORDINAL
        );
        assert.equal(localLogger.warns[0], log.message.discreteChannelCannotEncode('shape', 'temporal'));
      }));

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
            scaleType(undefined, 'temporal', Y, timeUnit, 'point', undefined, undefined, defaultConfig),
            ScaleType.TIME
          );
        }
      });

      it('should return a discrete scale for hours, day, month, quarter for x-y', function() {
        [TimeUnit.MONTH, TimeUnit.HOURS, TimeUnit.DAY, TimeUnit.QUARTER].forEach((timeUnit) => {
          assert.deepEqual(
            scaleType(undefined, 'temporal', Y, timeUnit, 'point', undefined, undefined, defaultConfig),
            ScaleType.POINT
          );
        });
      });
    });
    describe('quantitative', () => {
      it('should return sequential scale for quantitative color field by default.', () => {
        assert.equal(
          scaleType(undefined, 'quantitative', 'color', undefined, 'point', undefined, undefined, defaultConfig),
          ScaleType.SEQUENTIAL
        );
      });

      it('should return ordinal for encoding quantitative field with a discrete channel and throw a warning.', log.wrap((localLogger) => {
        assert.deepEqual(
          scaleType(undefined, 'quantitative', 'shape', undefined, 'point', undefined, undefined, defaultConfig),
          ScaleType.ORDINAL
        );
        assert.equal(localLogger.warns[0], log.message.discreteChannelCannotEncode('shape', 'quantitative'));
      }));

      it('should return linear scale for quantitative by default.', () => {
        assert.equal(
          scaleType(undefined, 'quantitative', 'x', undefined, 'point', undefined, undefined, defaultConfig),
          ScaleType.LINEAR
        );
      });
    });
  });

  describe('channelRangeType', () => {
    it('should be defined for all channels (no error).', () => {
      for (let c of CHANNELS) {
        assert.doesNotThrow(() => {
          channelRangeType(c);
        });
      }
    });
  });
});
