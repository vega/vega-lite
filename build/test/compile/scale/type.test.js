import { assert } from 'chai';
import { rangeType, SCALE_CHANNELS, X, Y } from '../../../src/channel';
import { scaleType } from '../../../src/compile/scale/type';
import { defaultConfig } from '../../../src/config';
import * as log from '../../../src/log';
import { PRIMITIVE_MARKS } from '../../../src/mark';
import { ScaleType } from '../../../src/scale';
import { TIMEUNITS } from '../../../src/timeunit';
import { NOMINAL, ORDINAL } from '../../../src/type';
import * as util from '../../../src/util';
var defaultScaleConfig = defaultConfig.scale;
describe('compile/scale', function () {
    describe('type()', function () {
        it('should return null for channel without scale', function () {
            assert.deepEqual(scaleType(undefined, 'detail', { type: 'temporal', timeUnit: 'yearmonth' }, 'point', defaultScaleConfig), null);
        });
        it('should show warning if users try to override the scale and use bin', log.wrap(function (localLogger) {
            assert.deepEqual(scaleType('point', 'color', { type: 'quantitative', bin: true }, 'point', defaultScaleConfig), ScaleType.BIN_ORDINAL);
            assert.equal(localLogger.warns[0], log.message.scaleTypeNotWorkWithFieldDef(ScaleType.POINT, ScaleType.BIN_ORDINAL));
        }));
        describe('nominal/ordinal', function () {
            describe('color', function () {
                it('should return ordinal scale for nominal data by default.', function () {
                    assert.equal(scaleType(undefined, 'color', { type: 'nominal' }, 'point', defaultScaleConfig), ScaleType.ORDINAL);
                });
                it('should return ordinal scale for ordinal data.', function () {
                    assert.equal(scaleType(undefined, 'color', { type: 'nominal' }, 'point', defaultScaleConfig), ScaleType.ORDINAL);
                });
            });
            describe('discrete channel (shape)', function () {
                it('should return ordinal for nominal field', function () {
                    assert.deepEqual(scaleType(undefined, 'shape', { type: 'nominal' }, 'point', defaultScaleConfig), ScaleType.ORDINAL);
                });
                it('should return ordinal even if other type is specified', log.wrap(function (localLogger) {
                    [ScaleType.LINEAR, ScaleType.BAND, ScaleType.POINT].forEach(function (badScaleType) {
                        assert.deepEqual(scaleType(badScaleType, 'shape', { type: 'nominal' }, 'point', defaultScaleConfig), ScaleType.ORDINAL);
                        var warns = localLogger.warns;
                        assert.equal(warns[warns.length - 1], log.message.scaleTypeNotWorkWithChannel('shape', badScaleType, 'ordinal'));
                    });
                }));
                it('should return ordinal for an ordinal field and throw a warning.', log.wrap(function (localLogger) {
                    assert.deepEqual(scaleType(undefined, 'shape', { type: 'ordinal' }, 'point', defaultScaleConfig), ScaleType.ORDINAL);
                    assert.equal(localLogger.warns[0], log.message.discreteChannelCannotEncode('shape', 'ordinal'));
                }));
            });
            describe('continuous', function () {
                it('should return point scale for ordinal X,Y for marks others than rect, rule, and bar', function () {
                    PRIMITIVE_MARKS.forEach(function (mark) {
                        if (util.contains(['bar', 'rule', 'rect'], mark)) {
                            return;
                        }
                        [ORDINAL, NOMINAL].forEach(function (t) {
                            [X, Y].forEach(function (channel) {
                                assert.equal(scaleType(undefined, channel, { type: t }, mark, defaultScaleConfig), ScaleType.POINT);
                            });
                        });
                    });
                });
                it('should return band scale for ordinal X,Y when mark is rect, rule, bar', function () {
                    [ORDINAL, NOMINAL].forEach(function (t) {
                        [X, Y].forEach(function (channel) {
                            ['bar', 'rule', 'rect'].forEach(function (mark) {
                                assert.equal(scaleType(undefined, channel, { type: t }, 'rect', defaultScaleConfig), ScaleType.BAND);
                            });
                        });
                    });
                });
                it('should return point scale for X,Y when mark is point', function () {
                    [ORDINAL, NOMINAL].forEach(function (t) {
                        [X, Y].forEach(function (channel) {
                            assert.equal(scaleType(undefined, channel, { type: t }, 'point', defaultScaleConfig), ScaleType.POINT);
                        });
                    });
                });
                it('should return point scale for X,Y when mark is point when ORDINAL SCALE TYPE is specified and throw warning', log.wrap(function (localLogger) {
                    [ORDINAL, NOMINAL].forEach(function (t) {
                        [X, Y].forEach(function (channel) {
                            assert.equal(scaleType('ordinal', channel, { type: t }, 'point', defaultScaleConfig), ScaleType.POINT);
                            var warns = localLogger.warns;
                            assert.equal(warns[warns.length - 1], log.message.scaleTypeNotWorkWithChannel(channel, 'ordinal', 'point'));
                        });
                    });
                }));
                it('should return point scale for ordinal/nominal fields for continuous channels other than x and y.', function () {
                    var OTHER_CONTINUOUS_CHANNELS = SCALE_CHANNELS.filter(function (c) { return rangeType(c) === 'continuous' && !util.contains([X, Y], c); });
                    PRIMITIVE_MARKS.forEach(function (mark) {
                        [ORDINAL, NOMINAL].forEach(function (t) {
                            OTHER_CONTINUOUS_CHANNELS.forEach(function (channel) {
                                assert.equal(scaleType(undefined, channel, { type: t }, mark, defaultScaleConfig), ScaleType.POINT, channel + ", " + mark + ", " + t + " " + scaleType(undefined, channel, { type: t }, mark, defaultScaleConfig));
                            });
                        });
                    });
                });
            });
        });
        describe('temporal', function () {
            it('should return sequential scale for temporal color field by default.', function () {
                assert.equal(scaleType(undefined, 'color', { type: 'temporal' }, 'point', defaultScaleConfig), ScaleType.SEQUENTIAL);
            });
            it('should return ordinal for temporal field and throw a warning.', log.wrap(function (localLogger) {
                assert.deepEqual(scaleType(undefined, 'shape', { type: 'temporal', timeUnit: 'yearmonth' }, 'point', defaultScaleConfig), ScaleType.ORDINAL);
                assert.equal(localLogger.warns[0], log.message.discreteChannelCannotEncode('shape', 'temporal'));
            }));
            it('should return time for all time units.', function () {
                for (var _i = 0, TIMEUNITS_1 = TIMEUNITS; _i < TIMEUNITS_1.length; _i++) {
                    var timeUnit = TIMEUNITS_1[_i];
                    assert.deepEqual(scaleType(undefined, Y, { type: 'temporal', timeUnit: timeUnit }, 'point', defaultScaleConfig), ScaleType.TIME);
                }
            });
        });
        describe('quantitative', function () {
            it('should return sequential scale for quantitative color field by default.', function () {
                assert.equal(scaleType(undefined, 'color', { type: 'quantitative' }, 'point', defaultScaleConfig), ScaleType.SEQUENTIAL);
            });
            it('should return ordinal bin scale for quantitative color field with binning.', function () {
                assert.equal(scaleType(undefined, 'color', { type: 'quantitative', bin: true }, 'point', defaultScaleConfig), ScaleType.BIN_ORDINAL);
            });
            it('should return ordinal for encoding quantitative field with a discrete channel and throw a warning.', log.wrap(function (localLogger) {
                assert.deepEqual(scaleType(undefined, 'shape', { type: 'quantitative' }, 'point', defaultScaleConfig), ScaleType.ORDINAL);
                assert.equal(localLogger.warns[0], log.message.discreteChannelCannotEncode('shape', 'quantitative'));
            }));
            it('should return linear scale for quantitative by default.', function () {
                assert.equal(scaleType(undefined, 'x', { type: 'quantitative' }, 'point', defaultScaleConfig), ScaleType.LINEAR);
            });
            it('should return bin linear scale for quantitative by default.', function () {
                assert.equal(scaleType(undefined, 'opacity', { type: 'quantitative', bin: true }, 'point', defaultScaleConfig), ScaleType.BIN_LINEAR);
            });
            it('should return linear scale for quantitative x and y.', function () {
                assert.equal(scaleType(undefined, 'x', { type: 'quantitative', bin: true }, 'point', defaultScaleConfig), ScaleType.LINEAR);
            });
        });
        describe('dataTypeMatchScaleType()', function () {
            it('should return specified value if datatype is ordinal or nominal and specified scale type is the ordinal or nominal', function () {
                assert.equal(scaleType(ScaleType.ORDINAL, 'shape', { type: 'ordinal' }, 'point', defaultScaleConfig), ScaleType.ORDINAL);
            });
            it('should return default scale type if data type is temporal but specified scale type is not time or utc', function () {
                assert.equal(scaleType(ScaleType.LINEAR, 'x', { type: 'temporal', timeUnit: 'year' }, 'point', defaultScaleConfig), ScaleType.TIME);
                assert.equal(scaleType(ScaleType.LINEAR, 'color', { type: 'temporal', timeUnit: 'year' }, 'point', defaultScaleConfig), ScaleType.SEQUENTIAL);
            });
            it('should return time if data type is temporal but specified scale type is discrete', function () {
                assert.equal(scaleType(ScaleType.POINT, 'x', { type: 'temporal', timeUnit: 'year' }, 'point', defaultScaleConfig), ScaleType.TIME);
            });
            it('should return default scale type if data type is temporal but specified scale type is time or utc or any discrete type', function () {
                assert.equal(scaleType(ScaleType.LINEAR, 'x', { type: 'temporal', timeUnit: 'year' }, 'point', defaultScaleConfig), ScaleType.TIME);
            });
            it('should return default scale type if data type is quantative but scale type do not support quantative', function () {
                assert.equal(scaleType(ScaleType.TIME, 'color', { type: 'quantitative' }, 'point', defaultScaleConfig), ScaleType.SEQUENTIAL);
            });
            it('should return default scale type if data type is quantative and scale type supports quantative', function () {
                assert.equal(scaleType(ScaleType.TIME, 'x', { type: 'quantitative' }, 'point', defaultScaleConfig), ScaleType.LINEAR);
            });
            it('should return default scale type if data type is quantative and scale type supports quantative', function () {
                assert.equal(scaleType(ScaleType.TIME, 'x', { type: 'temporal' }, 'point', defaultScaleConfig), ScaleType.TIME);
            });
        });
    });
});
//# sourceMappingURL=type.test.js.map