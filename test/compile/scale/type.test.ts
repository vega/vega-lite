import {assert} from 'chai';

import * as log from '../../../src/log';

import {defaultConfig} from '../../../src/config';
import {X, Y, ROW, COLUMN, CHANNELS} from '../../../src/channel';
import {PRIMITIVE_MARKS} from '../../../src/mark';
import {ScaleType} from '../../../src/scale';
import {ORDINAL, NOMINAL, TEMPORAL, QUANTITATIVE} from '../../../src/type';
import scaleType, {channelRangeType} from '../../../src/compile/scale/type';
import {TimeUnit} from '../../../src/timeunit';
import * as util from '../../../src/util';

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

    describe('nominal/ordinal', () => {
      describe('color', () => {
        it('should return ordinal scale for nominal data by default.', () => {
          assert.equal(
            scaleType({field: 'a', type: NOMINAL}, 'color', 'point', undefined,     defaultConfig),
            ScaleType.ORDINAL_LOOKUP
          );
        });

        it('should return ordinal scale for ordinal data.', () => {
          assert.equal(
            scaleType({field: 'a', type: ORDINAL}, 'color', 'point', undefined, defaultConfig),
            ScaleType.ORDINAL_LOOKUP
          );
        });
      });

      describe('discrete channel (shape)', () => {
        it('should return ordinal for nominal field', function() {
          assert.deepEqual(
            scaleType({
              field: 'a',
              type: 'nominal'
            }, 'shape', 'point', undefined, defaultConfig),
            ScaleType.ORDINAL_LOOKUP
          );
        });

        it('should return ordinal even if other type is specified', function() {
          [ScaleType.LINEAR, ScaleType.BAND, ScaleType.POINT].forEach((badScaleType) => {
            log.runLocalLogger((localLogger) => {
              assert.deepEqual(
                scaleType({
                  field: 'a',
                  type: 'nominal',
                  scale: {type: badScaleType}
                }, 'shape', 'point', undefined, defaultConfig),
                ScaleType.ORDINAL_LOOKUP
              );
              assert.equal(localLogger.warns[0], log.message.scaleTypeNotWorkWithChannel('shape', badScaleType, ScaleType.ORDINAL_LOOKUP));
            });
          });
        });

        it('should return ordinal for an ordinal field and throw a warning.', log.wrap((localLogger) => {
          assert.deepEqual(
            scaleType({
              field: 'a',
              type: 'ordinal',
            }, 'shape', 'point', undefined, defaultConfig),
            ScaleType.ORDINAL_LOOKUP
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
                  scaleType({field: 'a', type: t}, channel, mark, undefined, defaultConfig),
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

        it('should return point scale for ordinal/nominal fields for continous channels other than x and y.', () => {
          const OTHER_CONTINUOUS_CHANNELS = CHANNELS.filter((c) => channelRangeType(c) === 'continuous' && !util.contains([X, Y, ROW, COLUMN], c));
          PRIMITIVE_MARKS.forEach((mark) => {
            [ORDINAL, NOMINAL].forEach((t) => {
              OTHER_CONTINUOUS_CHANNELS.forEach((channel) => {
                assert.equal(
                  scaleType({field: 'a', type: t}, channel, mark, undefined, defaultConfig),
                  ScaleType.POINT,
                  `${channel}, ${mark}, ${t} ` + scaleType({field: 'a', type: t}, channel, mark, undefined, defaultConfig)
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
          scaleType(
            {field: 'a', type: TEMPORAL},
            'color', 'point', undefined, defaultConfig
          ),
          ScaleType.SEQUENTIAL
        );
      });

      it('should return sequential scale for temporal color field if scheme is provided.', () => {
        assert.equal(
          scaleType(
            {field: 'a', type: TEMPORAL, scale: {range: {scheme: 'viridis'}}},
            'color', 'point', undefined, defaultConfig
          ),
          ScaleType.SEQUENTIAL
        );
      });

      it('should return sequential scale for temporal color field  if range is provided.', () => {
        assert.equal(
          scaleType(
            {field: 'a', type: TEMPORAL, scale: {range: ['cyan', 'blue']}},
            'color', 'point', undefined, defaultConfig
          ),
          ScaleType.SEQUENTIAL
        );
      });

      it('should return ordinal for temporal field and throw a warning.', log.wrap((localLogger) => {
        assert.deepEqual(
          scaleType({
            field: 'a',
            type: 'temporal',
            timeUnit: TimeUnit.YEARMONTH
          }, 'shape', 'point', undefined, defaultConfig),
          ScaleType.ORDINAL_LOOKUP
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
      it('should return sequential scale for quantitative color field by default.', () => {
        assert.equal(
          scaleType(
            {field: 'a', type: QUANTITATIVE},
            'color', 'point', undefined, defaultConfig
          ),
          ScaleType.SEQUENTIAL
        );
      });

      it('should return sequential scale for quantitative color field if scheme is provided.', () => {
        assert.equal(
          scaleType(
            {field: 'a', type: QUANTITATIVE, scale: {range: {scheme: 'viridis'}}},
            'color', 'point', undefined, defaultConfig
          ),
          ScaleType.SEQUENTIAL
        );
      });

      it('should return sequential scale for quantitative color field if range is provided.', () => {
        assert.equal(
          scaleType(
            {field: 'a', type: QUANTITATIVE, scale: {range: ['cyan', 'blue']}},
            'color', 'point', undefined, defaultConfig
          ),
          ScaleType.SEQUENTIAL
        );
      });

      it('should return ordinal for encoding quantitative field with a discrete channel and throw a warning.', log.wrap((localLogger) => {
        assert.deepEqual(
          scaleType({
            field: 'a',
            type: 'quantitative',
          }, 'shape', 'point', undefined, defaultConfig),
          ScaleType.ORDINAL_LOOKUP
        );
        assert.equal(localLogger.warns[0], log.message.discreteChannelCannotEncode('shape', 'quantitative'));
      }));

      it('should return linear scale for quantitative by default.', () => {
        assert.equal(
          scaleType(
            {field: 'a', type: QUANTITATIVE},
            'x', 'point', undefined, defaultConfig
          ),
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
