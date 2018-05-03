import {assert} from 'chai';
import {rangeType, SCALE_CHANNELS, X, Y} from '../../../src/channel';
import {scaleType} from '../../../src/compile/scale/type';
import {defaultConfig} from '../../../src/config';
import * as log from '../../../src/log';
import {PRIMITIVE_MARKS} from '../../../src/mark';
import {ScaleType} from '../../../src/scale';
import {TIMEUNITS} from '../../../src/timeunit';
import {NOMINAL, ORDINAL} from '../../../src/type';
import * as util from '../../../src/util';

const defaultScaleConfig = defaultConfig.scale;

describe('compile/scale', () => {
  describe('type()', () => {
    it('should return null for channel without scale', () =>  {
      assert.deepEqual(
        scaleType(undefined, 'detail', {type: 'temporal', timeUnit: 'yearmonth'}, 'point', defaultScaleConfig),
        null
      );
    });

    it('should show warning if users try to override the scale and use bin', log.wrap((localLogger) => {
      assert.deepEqual(
        scaleType('point', 'color', {type: 'quantitative', bin: true}, 'point', defaultScaleConfig),
        ScaleType.BIN_ORDINAL
      );
      assert.equal(localLogger.warns[0], log.message.scaleTypeNotWorkWithFieldDef(ScaleType.POINT, ScaleType.BIN_ORDINAL));
    }));

    describe('nominal/ordinal', () => {
      describe('color', () => {
        it('should return ordinal scale for nominal data by default.', () => {
          assert.equal(
            scaleType(undefined, 'color', {type: 'nominal'}, 'point', defaultScaleConfig),
            ScaleType.ORDINAL
          );
        });

        it('should return ordinal scale for ordinal data.', () => {
          assert.equal(
            scaleType(undefined, 'color', {type: 'nominal'}, 'point', defaultScaleConfig),
            ScaleType.ORDINAL
          );
        });
      });

      describe('discrete channel (shape)', () => {
        it('should return ordinal for nominal field', () =>  {
          assert.deepEqual(
            scaleType(undefined, 'shape', {type: 'nominal'}, 'point', defaultScaleConfig),
            ScaleType.ORDINAL
          );
        });

        it('should return ordinal even if other type is specified', log.wrap((localLogger) => {
          [ScaleType.LINEAR, ScaleType.BAND, ScaleType.POINT].forEach((badScaleType) => {
            assert.deepEqual(
              scaleType(badScaleType, 'shape', {type: 'nominal'}, 'point', defaultScaleConfig),
              ScaleType.ORDINAL
            );
            const warns = localLogger.warns;
            assert.equal(warns[warns.length-1], log.message.scaleTypeNotWorkWithChannel('shape', badScaleType, 'ordinal'));
          });
        }));

        it('should return ordinal for an ordinal field and throw a warning.', log.wrap((localLogger) => {
          assert.deepEqual(
            scaleType(undefined, 'shape', {type: 'ordinal'}, 'point', defaultScaleConfig),
            ScaleType.ORDINAL
          );
          assert.equal(localLogger.warns[0], log.message.discreteChannelCannotEncode('shape', 'ordinal'));
        }));
      });

      describe('continuous', () => {
        it('should return point scale for ordinal X,Y for marks others than rect, rule, and bar', () => {
          PRIMITIVE_MARKS.forEach((mark) => {
            if (util.contains(['bar', 'rule', 'rect'], mark)) {
              return;
            }

            [ORDINAL, NOMINAL].forEach((t) => {
              [X, Y].forEach((channel) => {
                assert.equal(
                  scaleType(undefined, channel, {type: t}, mark, defaultScaleConfig),
                  ScaleType.POINT
                );
              });
            });
          });
        });

        it('should return band scale for ordinal X,Y when mark is rect, rule, bar', () => {
          [ORDINAL, NOMINAL].forEach((t) => {
            [X, Y].forEach((channel) => {
              ['bar', 'rule', 'rect'].forEach((mark) => {
                assert.equal(
                  scaleType(undefined, channel, {type: t}, 'rect', defaultScaleConfig),
                  ScaleType.BAND
                );
              });
            });
          });
        });

        it('should return point scale for X,Y when mark is point', () => {
          [ORDINAL, NOMINAL].forEach((t) => {
            [X, Y].forEach((channel) => {
              assert.equal(scaleType(undefined, channel, {type: t}, 'point', defaultScaleConfig), ScaleType.POINT);
            });
          });
        });

        it('should return point scale for X,Y when mark is point when ORDINAL SCALE TYPE is specified and throw warning', log.wrap((localLogger) => {
          [ORDINAL, NOMINAL].forEach((t) => {
            [X, Y].forEach((channel) => {
              assert.equal(scaleType('ordinal', channel, {type: t}, 'point', defaultScaleConfig), ScaleType.POINT);
              const warns = localLogger.warns;
              assert.equal(warns[warns.length-1], log.message.scaleTypeNotWorkWithChannel(channel, 'ordinal', 'point'));
            });
          });
        }));

        it('should return point scale for ordinal/nominal fields for continuous channels other than x and y.', () => {
          const OTHER_CONTINUOUS_CHANNELS = SCALE_CHANNELS.filter((c) => rangeType(c) === 'continuous' && !util.contains([X, Y], c));
          PRIMITIVE_MARKS.forEach((mark) => {
            [ORDINAL, NOMINAL].forEach((t) => {
              OTHER_CONTINUOUS_CHANNELS.forEach((channel) => {
                assert.equal(
                  scaleType(undefined, channel, {type: t}, mark, defaultScaleConfig),
                  ScaleType.POINT,
                  `${channel}, ${mark}, ${t} ` + scaleType(undefined, channel, {type: t}, mark, defaultScaleConfig)
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
          scaleType(undefined, 'color', {type: 'temporal'}, 'point', defaultScaleConfig),
          ScaleType.SEQUENTIAL
        );
      });

      it('should return ordinal for temporal field and throw a warning.', log.wrap((localLogger) => {
        assert.deepEqual(
          scaleType(undefined, 'shape', {type: 'temporal', timeUnit: 'yearmonth'}, 'point', defaultScaleConfig),
          ScaleType.ORDINAL
        );
        assert.equal(localLogger.warns[0], log.message.discreteChannelCannotEncode('shape', 'temporal'));
      }));

      it('should return time for all time units.', () =>  {
        for (const timeUnit of TIMEUNITS) {
          assert.deepEqual(
            scaleType(undefined, Y, {type: 'temporal', timeUnit: timeUnit}, 'point', defaultScaleConfig),
            ScaleType.TIME
          );
        }
      });
    });
    describe('quantitative', () => {
      it('should return sequential scale for quantitative color field by default.', () => {
        assert.equal(
          scaleType(undefined, 'color', {type: 'quantitative'}, 'point', defaultScaleConfig),
          ScaleType.SEQUENTIAL
        );
      });

      it('should return ordinal bin scale for quantitative color field with binning.', () => {
        assert.equal(
          scaleType(undefined, 'color', {type: 'quantitative', bin: true}, 'point', defaultScaleConfig),
          ScaleType.BIN_ORDINAL
        );
      });

      it('should return ordinal for encoding quantitative field with a discrete channel and throw a warning.', log.wrap((localLogger) => {
        assert.deepEqual(
          scaleType(undefined, 'shape', {type: 'quantitative'}, 'point', defaultScaleConfig),
          ScaleType.ORDINAL
        );
        assert.equal(localLogger.warns[0], log.message.discreteChannelCannotEncode('shape', 'quantitative'));
      }));

      it('should return linear scale for quantitative by default.', () => {
        assert.equal(
          scaleType(undefined, 'x', {type: 'quantitative'}, 'point', defaultScaleConfig),
          ScaleType.LINEAR
        );
      });

      it('should return bin linear scale for quantitative by default.', () => {
        assert.equal(
          scaleType(undefined, 'opacity', {type: 'quantitative', bin: true}, 'point', defaultScaleConfig),
          ScaleType.BIN_LINEAR
        );
      });

      it('should return linear scale for quantitative x and y.', () => {
        assert.equal(
          scaleType(undefined, 'x', {type: 'quantitative', bin: true}, 'point', defaultScaleConfig),
          ScaleType.LINEAR
        );
      });
    });

    describe('dataTypeMatchScaleType()', () => {
      it('should return specified value if datatype is ordinal or nominal and specified scale type is the ordinal or nominal', () => {
        assert.equal(
          scaleType(ScaleType.ORDINAL, 'shape', {type: 'ordinal'}, 'point', defaultScaleConfig),
          ScaleType.ORDINAL
        );
      });

      it('should return default scale type if data type is temporal but specified scale type is not time or utc', () => {
        assert.equal(
          scaleType(ScaleType.LINEAR, 'x', {type: 'temporal', timeUnit: 'year'}, 'point', defaultScaleConfig),
          ScaleType.TIME
        );

        assert.equal(
          scaleType(ScaleType.LINEAR, 'color', {type: 'temporal', timeUnit: 'year'}, 'point', defaultScaleConfig),
          ScaleType.SEQUENTIAL
        );
      });

      it('should return time if data type is temporal but specified scale type is discrete', () => {
        assert.equal(
          scaleType(ScaleType.POINT, 'x', {type: 'temporal', timeUnit: 'year'}, 'point', defaultScaleConfig),
          ScaleType.TIME
        );
      });

      it('should return default scale type if data type is temporal but specified scale type is time or utc or any discrete type', () => {
        assert.equal(
          scaleType(ScaleType.LINEAR, 'x', {type: 'temporal', timeUnit: 'year'}, 'point', defaultScaleConfig),
          ScaleType.TIME
        );
      });

      it('should return default scale type if data type is quantative but scale type do not support quantative', () => {
        assert.equal(
          scaleType(ScaleType.TIME, 'color', {type: 'quantitative'}, 'point', defaultScaleConfig),
          ScaleType.SEQUENTIAL
        );
      });

      it('should return default scale type if data type is quantative and scale type supports quantative', () => {
        assert.equal(
          scaleType(ScaleType.TIME, 'x', {type: 'quantitative'}, 'point', defaultScaleConfig),
          ScaleType.LINEAR
        );
      });

      it('should return default scale type if data type is quantative and scale type supports quantative', () => {
        assert.equal(
          scaleType(ScaleType.TIME, 'x', {type: 'temporal'}, 'point', defaultScaleConfig),
          ScaleType.TIME
        );
      });
    });
  });
});
