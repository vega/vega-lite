"use strict";
var chai_1 = require("chai");
var log = require("../../../src/log");
var config_1 = require("../../../src/config");
var channel_1 = require("../../../src/channel");
var mark_1 = require("../../../src/mark");
var scale_1 = require("../../../src/scale");
var type_1 = require("../../../src/type");
var type_2 = require("../../../src/compile/scale/type");
var timeunit_1 = require("../../../src/timeunit");
var util = require("../../../src/util");
describe('compile/scale', function () {
    describe('type()', function () {
        it('should return null for channel without scale', function () {
            chai_1.assert.deepEqual(type_2.default(undefined, 'temporal', 'detail', 'yearmonth', 'point', undefined, undefined, config_1.defaultConfig), null);
        });
        describe('row/column', function () {
            it('should return band for row/column', function () {
                [channel_1.ROW, channel_1.COLUMN].forEach(function (channel) {
                    chai_1.assert.deepEqual(type_2.default(undefined, 'temporal', channel, 'yearmonth', 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.BAND);
                });
            });
            it('should return band for row/column even if other type is specified', function () {
                [channel_1.ROW, channel_1.COLUMN].forEach(function (channel) {
                    [scale_1.ScaleType.LINEAR, scale_1.ScaleType.ORDINAL, scale_1.ScaleType.POINT].forEach(function (badScaleType) {
                        log.runLocalLogger(function (localLogger) {
                            chai_1.assert.deepEqual(type_2.default(badScaleType, 'temporal', channel, 'yearmonth', 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.BAND);
                            chai_1.assert.equal(localLogger.warns[0], log.message.scaleTypeNotWorkWithChannel(channel, badScaleType, scale_1.ScaleType.BAND));
                        });
                    });
                });
            });
        });
        describe('nominal/ordinal', function () {
            describe('color', function () {
                it('should return ordinal scale for nominal data by default.', function () {
                    chai_1.assert.equal(type_2.default(undefined, 'nominal', 'color', undefined, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.ORDINAL);
                });
                it('should return ordinal scale for ordinal data.', function () {
                    chai_1.assert.equal(type_2.default(undefined, 'ordinal', 'color', undefined, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.ORDINAL);
                });
            });
            describe('discrete channel (shape)', function () {
                it('should return ordinal for nominal field', function () {
                    chai_1.assert.deepEqual(type_2.default(undefined, 'nominal', 'shape', undefined, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.ORDINAL);
                });
                it('should return ordinal even if other type is specified', function () {
                    [scale_1.ScaleType.LINEAR, scale_1.ScaleType.BAND, scale_1.ScaleType.POINT].forEach(function (badScaleType) {
                        log.runLocalLogger(function (localLogger) {
                            chai_1.assert.deepEqual(type_2.default(badScaleType, 'nominal', 'shape', undefined, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.ORDINAL);
                            chai_1.assert.equal(localLogger.warns[0], log.message.scaleTypeNotWorkWithChannel('shape', badScaleType, scale_1.ScaleType.ORDINAL));
                        });
                    });
                });
                it('should return ordinal for an ordinal field and throw a warning.', log.wrap(function (localLogger) {
                    chai_1.assert.deepEqual(type_2.default(undefined, 'ordinal', 'shape', undefined, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.ORDINAL);
                    chai_1.assert.equal(localLogger.warns[0], log.message.discreteChannelCannotEncode('shape', 'ordinal'));
                }));
            });
            describe('continuous', function () {
                it('should return point scale for ordinal X,Y for marks others than rect and bar', function () {
                    mark_1.PRIMITIVE_MARKS.forEach(function (mark) {
                        if (util.contains(['bar', 'rect'], mark)) {
                            return;
                        }
                        [type_1.ORDINAL, type_1.NOMINAL].forEach(function (t) {
                            [channel_1.X, channel_1.Y].forEach(function (channel) {
                                chai_1.assert.equal(type_2.default(undefined, t, channel, undefined, mark, undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.POINT);
                            });
                        });
                    });
                });
                it('should return band scale for ordinal X,Y when mark is rect', function () {
                    [type_1.ORDINAL, type_1.NOMINAL].forEach(function (t) {
                        [channel_1.X, channel_1.Y].forEach(function (channel) {
                            chai_1.assert.equal(type_2.default(undefined, t, channel, undefined, 'rect', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.BAND);
                        });
                    });
                });
                it('should return band scale for X,Y when mark is bar and rangeStep is null (fit)', function () {
                    [type_1.ORDINAL, type_1.NOMINAL].forEach(function (t) {
                        [channel_1.X, channel_1.Y].forEach(function (channel) {
                            chai_1.assert.equal(type_2.default(undefined, t, channel, undefined, 'bar', null, undefined, config_1.defaultConfig), scale_1.ScaleType.BAND);
                        });
                    });
                });
                it('should return point scale for X,Y when mark is bar and rangeStep is defined', function () {
                    [type_1.ORDINAL, type_1.NOMINAL].forEach(function (t) {
                        [channel_1.X, channel_1.Y].forEach(function (channel) {
                            chai_1.assert.equal(type_2.default(undefined, t, channel, undefined, 'bar', undefined, 21, config_1.defaultConfig), scale_1.ScaleType.POINT);
                        });
                    });
                });
                it('should return point scale for X,Y when mark is point', function () {
                    [type_1.ORDINAL, type_1.NOMINAL].forEach(function (t) {
                        [channel_1.X, channel_1.Y].forEach(function (channel) {
                            chai_1.assert.equal(type_2.default(undefined, t, channel, undefined, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.POINT);
                        });
                    });
                });
                it('should return point scale for X,Y when mark is point when ORDINAL SCALE TYPE is specified and throw warning', function () {
                    [type_1.ORDINAL, type_1.NOMINAL].forEach(function (t) {
                        [channel_1.X, channel_1.Y].forEach(function (channel) {
                            log.runLocalLogger(function (localLogger) {
                                chai_1.assert.equal(type_2.default('ordinal', t, channel, undefined, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.POINT);
                                chai_1.assert.equal(localLogger.warns[0], log.message.scaleTypeNotWorkWithChannel(channel, 'ordinal', 'point'));
                            });
                        });
                    });
                });
                it('should return point scale for ordinal/nominal fields for continous channels other than x and y.', function () {
                    var OTHER_CONTINUOUS_CHANNELS = channel_1.CHANNELS.filter(function (c) { return channel_1.getRangeType(c) === 'continuous' && !util.contains([channel_1.X, channel_1.Y, channel_1.ROW, channel_1.COLUMN], c); });
                    mark_1.PRIMITIVE_MARKS.forEach(function (mark) {
                        [type_1.ORDINAL, type_1.NOMINAL].forEach(function (t) {
                            OTHER_CONTINUOUS_CHANNELS.forEach(function (channel) {
                                chai_1.assert.equal(type_2.default(undefined, t, channel, undefined, mark, undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.POINT, channel + ", " + mark + ", " + t + " " + type_2.default(undefined, t, channel, undefined, mark, undefined, undefined, config_1.defaultConfig));
                            });
                        });
                    });
                });
            });
        });
        describe('temporal', function () {
            it('should return sequential scale for temporal color field by default.', function () {
                chai_1.assert.equal(type_2.default(undefined, 'temporal', 'color', undefined, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.SEQUENTIAL);
            });
            it('should return ordinal for temporal field and throw a warning.', log.wrap(function (localLogger) {
                chai_1.assert.deepEqual(type_2.default(undefined, 'temporal', 'shape', 'yearmonth', 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.ORDINAL);
                chai_1.assert.equal(localLogger.warns[0], log.message.discreteChannelCannotEncode('shape', 'temporal'));
            }));
            it('should return time for most of time unit.', function () {
                // See exception in the next test)
                var TIMEUNITS = [
                    timeunit_1.TimeUnit.YEAR,
                    timeunit_1.TimeUnit.DATE,
                    timeunit_1.TimeUnit.MINUTES,
                    timeunit_1.TimeUnit.SECONDS,
                    timeunit_1.TimeUnit.MILLISECONDS,
                    timeunit_1.TimeUnit.YEARMONTH,
                    timeunit_1.TimeUnit.YEARMONTHDATE,
                    timeunit_1.TimeUnit.YEARMONTHDATEHOURS,
                    timeunit_1.TimeUnit.YEARMONTHDATEHOURSMINUTES,
                    timeunit_1.TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS,
                    timeunit_1.TimeUnit.HOURSMINUTES,
                    timeunit_1.TimeUnit.HOURSMINUTESSECONDS,
                    timeunit_1.TimeUnit.MINUTESSECONDS,
                    timeunit_1.TimeUnit.SECONDSMILLISECONDS,
                    timeunit_1.TimeUnit.YEARQUARTER,
                    timeunit_1.TimeUnit.QUARTERMONTH,
                    timeunit_1.TimeUnit.YEARQUARTERMONTH,
                ];
                for (var _i = 0, TIMEUNITS_1 = TIMEUNITS; _i < TIMEUNITS_1.length; _i++) {
                    var timeUnit = TIMEUNITS_1[_i];
                    chai_1.assert.deepEqual(type_2.default(undefined, 'temporal', channel_1.Y, timeUnit, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.TIME);
                }
            });
            it('should return a discrete scale for hours, day, month, quarter for x-y', function () {
                [timeunit_1.TimeUnit.MONTH, timeunit_1.TimeUnit.HOURS, timeunit_1.TimeUnit.DAY, timeunit_1.TimeUnit.QUARTER].forEach(function (timeUnit) {
                    chai_1.assert.deepEqual(type_2.default(undefined, 'temporal', channel_1.Y, timeUnit, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.POINT);
                });
            });
        });
        describe('quantitative', function () {
            it('should return sequential scale for quantitative color field by default.', function () {
                chai_1.assert.equal(type_2.default(undefined, 'quantitative', 'color', undefined, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.SEQUENTIAL);
            });
            it('should return ordinal for encoding quantitative field with a discrete channel and throw a warning.', log.wrap(function (localLogger) {
                chai_1.assert.deepEqual(type_2.default(undefined, 'quantitative', 'shape', undefined, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.ORDINAL);
                chai_1.assert.equal(localLogger.warns[0], log.message.discreteChannelCannotEncode('shape', 'quantitative'));
            }));
            it('should return linear scale for quantitative by default.', function () {
                chai_1.assert.equal(type_2.default(undefined, 'quantitative', 'x', undefined, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.LINEAR);
            });
        });
    });
    describe('getRangeType', function () {
        it('should be defined for all channels (no error).', function () {
            var _loop_1 = function (c) {
                chai_1.assert.doesNotThrow(function () {
                    channel_1.getRangeType(c);
                });
            };
            for (var _i = 0, CHANNELS_1 = channel_1.CHANNELS; _i < CHANNELS_1.length; _i++) {
                var c = CHANNELS_1[_i];
                _loop_1(c);
            }
        });
    });
});
//# sourceMappingURL=type.test.js.map