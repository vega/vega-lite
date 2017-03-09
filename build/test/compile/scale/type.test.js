"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            chai_1.assert.deepEqual(type_2.default(undefined, 'detail', { type: 'temporal', timeUnit: 'yearmonth' }, 'point', undefined, undefined, config_1.defaultConfig), null);
        });
        it('should show warning if users try to override the scale and use bin', function () {
            log.runLocalLogger(function (localLogger) {
                chai_1.assert.deepEqual(type_2.default('point', 'color', { type: 'quantitative', bin: 'true' }, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.BIN_ORDINAL);
                chai_1.assert.equal(localLogger.warns[0], log.message.cannotOverrideBinScaleType('color', 'bin-ordinal'));
            });
        });
        describe('row/column', function () {
            it('should return band for row/column', function () {
                [channel_1.ROW, channel_1.COLUMN].forEach(function (channel) {
                    chai_1.assert.deepEqual(type_2.default(undefined, channel, { type: 'temporal', timeUnit: 'yearmonth' }, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.BAND);
                });
            });
            it('should return band for row/column even if other type is specified', function () {
                [channel_1.ROW, channel_1.COLUMN].forEach(function (channel) {
                    [scale_1.ScaleType.LINEAR, scale_1.ScaleType.ORDINAL, scale_1.ScaleType.POINT].forEach(function (badScaleType) {
                        log.runLocalLogger(function (localLogger) {
                            chai_1.assert.deepEqual(type_2.default(badScaleType, channel, { type: 'temporal', timeUnit: 'yearmonth' }, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.BAND);
                            chai_1.assert.equal(localLogger.warns[0], log.message.scaleTypeNotWorkWithChannel(channel, badScaleType, 'band'));
                        });
                    });
                });
            });
        });
        describe('nominal/ordinal', function () {
            describe('color', function () {
                it('should return ordinal scale for nominal data by default.', function () {
                    chai_1.assert.equal(type_2.default(undefined, 'color', { type: 'nominal' }, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.ORDINAL);
                });
                it('should return ordinal scale for ordinal data.', function () {
                    chai_1.assert.equal(type_2.default(undefined, 'color', { type: 'nominal' }, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.ORDINAL);
                });
            });
            describe('discrete channel (shape)', function () {
                it('should return ordinal for nominal field', function () {
                    chai_1.assert.deepEqual(type_2.default(undefined, 'shape', { type: 'nominal' }, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.ORDINAL);
                });
                it('should return ordinal even if other type is specified', function () {
                    [scale_1.ScaleType.LINEAR, scale_1.ScaleType.BAND, scale_1.ScaleType.POINT].forEach(function (badScaleType) {
                        log.runLocalLogger(function (localLogger) {
                            chai_1.assert.deepEqual(type_2.default(badScaleType, 'shape', { type: 'nominal' }, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.ORDINAL);
                            chai_1.assert.equal(localLogger.warns[0], log.message.scaleTypeNotWorkWithChannel('shape', badScaleType, 'ordinal'));
                        });
                    });
                });
                it('should return ordinal for an ordinal field and throw a warning.', log.wrap(function (localLogger) {
                    chai_1.assert.deepEqual(type_2.default(undefined, 'shape', { type: 'ordinal' }, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.ORDINAL);
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
                                chai_1.assert.equal(type_2.default(undefined, channel, { type: t }, mark, undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.POINT);
                            });
                        });
                    });
                });
                it('should return band scale for ordinal X,Y when mark is rect', function () {
                    [type_1.ORDINAL, type_1.NOMINAL].forEach(function (t) {
                        [channel_1.X, channel_1.Y].forEach(function (channel) {
                            chai_1.assert.equal(type_2.default(undefined, channel, { type: t }, 'rect', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.BAND);
                        });
                    });
                });
                it('should return band scale for X,Y when mark is bar and rangeStep is null (fit)', function () {
                    [type_1.ORDINAL, type_1.NOMINAL].forEach(function (t) {
                        [channel_1.X, channel_1.Y].forEach(function (channel) {
                            chai_1.assert.equal(type_2.default(undefined, channel, { type: t }, 'bar', null, undefined, config_1.defaultConfig), scale_1.ScaleType.BAND);
                        });
                    });
                });
                it('should return point scale for X,Y when mark is bar and rangeStep is defined', function () {
                    [type_1.ORDINAL, type_1.NOMINAL].forEach(function (t) {
                        [channel_1.X, channel_1.Y].forEach(function (channel) {
                            chai_1.assert.equal(type_2.default(undefined, channel, { type: t }, 'bar', undefined, 21, config_1.defaultConfig), scale_1.ScaleType.POINT);
                        });
                    });
                });
                it('should return point scale for X,Y when mark is point', function () {
                    [type_1.ORDINAL, type_1.NOMINAL].forEach(function (t) {
                        [channel_1.X, channel_1.Y].forEach(function (channel) {
                            chai_1.assert.equal(type_2.default(undefined, channel, { type: t }, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.POINT);
                        });
                    });
                });
                it('should return point scale for X,Y when mark is point when ORDINAL SCALE TYPE is specified and throw warning', function () {
                    [type_1.ORDINAL, type_1.NOMINAL].forEach(function (t) {
                        [channel_1.X, channel_1.Y].forEach(function (channel) {
                            log.runLocalLogger(function (localLogger) {
                                chai_1.assert.equal(type_2.default('ordinal', channel, { type: t }, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.POINT);
                                chai_1.assert.equal(localLogger.warns[0], log.message.scaleTypeNotWorkWithChannel(channel, 'ordinal', 'point'));
                            });
                        });
                    });
                });
                it('should return point scale for ordinal/nominal fields for continous channels other than x and y.', function () {
                    var OTHER_CONTINUOUS_CHANNELS = channel_1.CHANNELS.filter(function (c) { return channel_1.rangeType(c) === 'continuous' && !util.contains([channel_1.X, channel_1.Y, channel_1.ROW, channel_1.COLUMN], c); });
                    mark_1.PRIMITIVE_MARKS.forEach(function (mark) {
                        [type_1.ORDINAL, type_1.NOMINAL].forEach(function (t) {
                            OTHER_CONTINUOUS_CHANNELS.forEach(function (channel) {
                                chai_1.assert.equal(type_2.default(undefined, channel, { type: t }, mark, undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.POINT, channel + ", " + mark + ", " + t + " " + type_2.default(undefined, channel, { type: t }, mark, undefined, undefined, config_1.defaultConfig));
                            });
                        });
                    });
                });
            });
        });
        describe('temporal', function () {
            it('should return sequential scale for temporal color field by default.', function () {
                chai_1.assert.equal(type_2.default(undefined, 'color', { type: 'temporal' }, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.SEQUENTIAL);
            });
            it('should return ordinal for temporal field and throw a warning.', log.wrap(function (localLogger) {
                chai_1.assert.deepEqual(type_2.default(undefined, 'shape', { type: 'temporal', timeUnit: 'yearmonth' }, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.ORDINAL);
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
                    chai_1.assert.deepEqual(type_2.default(undefined, channel_1.Y, { type: 'temporal', timeUnit: timeUnit }, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.TIME);
                }
            });
            it('should return a discrete scale for hours, day, month, quarter for x-y', function () {
                [timeunit_1.TimeUnit.MONTH, timeunit_1.TimeUnit.HOURS, timeunit_1.TimeUnit.DAY, timeunit_1.TimeUnit.QUARTER].forEach(function (timeUnit) {
                    chai_1.assert.deepEqual(type_2.default(undefined, channel_1.Y, { type: 'temporal', timeUnit: timeUnit }, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.POINT);
                });
            });
        });
        describe('quantitative', function () {
            it('should return sequential scale for quantitative color field by default.', function () {
                chai_1.assert.equal(type_2.default(undefined, 'color', { type: 'quantitative' }, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.SEQUENTIAL);
            });
            it('should return ordinal bin scale for quantitative color field with binning.', function () {
                chai_1.assert.equal(type_2.default(undefined, 'color', { type: 'quantitative', bin: true }, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.BIN_ORDINAL);
            });
            it('should return ordinal for encoding quantitative field with a discrete channel and throw a warning.', log.wrap(function (localLogger) {
                chai_1.assert.deepEqual(type_2.default(undefined, 'shape', { type: 'quantitative' }, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.ORDINAL);
                chai_1.assert.equal(localLogger.warns[0], log.message.discreteChannelCannotEncode('shape', 'quantitative'));
            }));
            it('should return linear scale for quantitative by default.', function () {
                chai_1.assert.equal(type_2.default(undefined, 'x', { type: 'quantitative' }, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.LINEAR);
            });
            it('should return bin linear scale for quantitative by default.', function () {
                chai_1.assert.equal(type_2.default(undefined, 'x', { type: 'quantitative', bin: true }, 'point', undefined, undefined, config_1.defaultConfig), scale_1.ScaleType.BIN_LINEAR);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL3NjYWxlL3R5cGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUU1QixzQ0FBd0M7QUFFeEMsOENBQWtEO0FBQ2xELGdEQUE0RTtBQUM1RSwwQ0FBa0Q7QUFDbEQsNENBQTZDO0FBQzdDLDBDQUFtRDtBQUNuRCx3REFBd0Q7QUFDeEQsa0RBQStDO0FBQy9DLHdDQUEwQztBQUUxQyxRQUFRLENBQUMsZUFBZSxFQUFFO0lBQ3hCLFFBQVEsQ0FBQyxRQUFRLEVBQUU7UUFDakIsRUFBRSxDQUFDLDhDQUE4QyxFQUFFO1lBQ2pELGFBQU0sQ0FBQyxTQUFTLENBQ2QsY0FBUyxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxzQkFBYSxDQUFDLEVBQ3ZILElBQUksQ0FDTCxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsb0VBQW9FLEVBQUU7WUFDdkUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxVQUFDLFdBQVc7Z0JBQzdCLGFBQU0sQ0FBQyxTQUFTLENBQ2QsY0FBUyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsRUFBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxzQkFBYSxDQUFDLEVBQzlHLGlCQUFTLENBQUMsV0FBVyxDQUN0QixDQUFDO2dCQUNGLGFBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLDBCQUEwQixDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDO1lB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