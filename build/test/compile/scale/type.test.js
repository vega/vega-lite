"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var log = require("../../../src/log");
var channel_1 = require("../../../src/channel");
var type_1 = require("../../../src/compile/scale/type");
var config_1 = require("../../../src/config");
var mark_1 = require("../../../src/mark");
var scale_1 = require("../../../src/scale");
var timeunit_1 = require("../../../src/timeunit");
var type_2 = require("../../../src/type");
var util = require("../../../src/util");
var defaultScaleConfig = config_1.defaultConfig.scale;
describe('compile/scale', function () {
    describe('type()', function () {
        it('should return null for channel without scale', function () {
            chai_1.assert.deepEqual(type_1.scaleType(undefined, 'detail', { type: 'temporal', timeUnit: 'yearmonth' }, 'point', undefined, defaultScaleConfig), null);
        });
        it('should show warning if users try to override the scale and use bin', function () {
            log.runLocalLogger(function (localLogger) {
                chai_1.assert.deepEqual(type_1.scaleType('point', 'color', { type: 'quantitative', bin: true }, 'point', undefined, defaultScaleConfig), scale_1.ScaleType.BIN_ORDINAL);
                chai_1.assert.equal(localLogger.warns[0], log.message.scaleTypeNotWorkWithFieldDef(scale_1.ScaleType.POINT, scale_1.ScaleType.BIN_ORDINAL));
            });
        });
        describe('row/column', function () {
            it('should return band for row/column', function () {
                [channel_1.ROW, channel_1.COLUMN].forEach(function (channel) {
                    chai_1.assert.deepEqual(type_1.scaleType(undefined, channel, { type: 'temporal', timeUnit: 'yearmonth' }, 'point', undefined, defaultScaleConfig), scale_1.ScaleType.BAND);
                });
            });
            it('should return band for row/column even if other type is specified', function () {
                [channel_1.ROW, channel_1.COLUMN].forEach(function (channel) {
                    [scale_1.ScaleType.LINEAR, scale_1.ScaleType.ORDINAL, scale_1.ScaleType.POINT].forEach(function (badScaleType) {
                        log.runLocalLogger(function (localLogger) {
                            chai_1.assert.deepEqual(type_1.scaleType(badScaleType, channel, { type: 'temporal', timeUnit: 'yearmonth' }, 'point', undefined, defaultScaleConfig), scale_1.ScaleType.BAND);
                            chai_1.assert.equal(localLogger.warns[0], log.message.scaleTypeNotWorkWithChannel(channel, badScaleType, 'band'));
                        });
                    });
                });
            });
        });
        describe('nominal/ordinal', function () {
            describe('color', function () {
                it('should return ordinal scale for nominal data by default.', function () {
                    chai_1.assert.equal(type_1.scaleType(undefined, 'color', { type: 'nominal' }, 'point', undefined, defaultScaleConfig), scale_1.ScaleType.ORDINAL);
                });
                it('should return ordinal scale for ordinal data.', function () {
                    chai_1.assert.equal(type_1.scaleType(undefined, 'color', { type: 'nominal' }, 'point', undefined, defaultScaleConfig), scale_1.ScaleType.ORDINAL);
                });
            });
            describe('discrete channel (shape)', function () {
                it('should return ordinal for nominal field', function () {
                    chai_1.assert.deepEqual(type_1.scaleType(undefined, 'shape', { type: 'nominal' }, 'point', undefined, defaultScaleConfig), scale_1.ScaleType.ORDINAL);
                });
                it('should return ordinal even if other type is specified', function () {
                    [scale_1.ScaleType.LINEAR, scale_1.ScaleType.BAND, scale_1.ScaleType.POINT].forEach(function (badScaleType) {
                        log.runLocalLogger(function (localLogger) {
                            chai_1.assert.deepEqual(type_1.scaleType(badScaleType, 'shape', { type: 'nominal' }, 'point', undefined, defaultScaleConfig), scale_1.ScaleType.ORDINAL);
                            chai_1.assert.equal(localLogger.warns[0], log.message.scaleTypeNotWorkWithChannel('shape', badScaleType, 'ordinal'));
                        });
                    });
                });
                it('should return ordinal for an ordinal field and throw a warning.', log.wrap(function (localLogger) {
                    chai_1.assert.deepEqual(type_1.scaleType(undefined, 'shape', { type: 'ordinal' }, 'point', undefined, defaultScaleConfig), scale_1.ScaleType.ORDINAL);
                    chai_1.assert.equal(localLogger.warns[0], log.message.discreteChannelCannotEncode('shape', 'ordinal'));
                }));
            });
            describe('continuous', function () {
                it('should return point scale for ordinal X,Y for marks others than rect and bar', function () {
                    mark_1.PRIMITIVE_MARKS.forEach(function (mark) {
                        if (util.contains(['bar', 'rect'], mark)) {
                            return;
                        }
                        [type_2.ORDINAL, type_2.NOMINAL].forEach(function (t) {
                            [channel_1.X, channel_1.Y].forEach(function (channel) {
                                chai_1.assert.equal(type_1.scaleType(undefined, channel, { type: t }, mark, undefined, defaultScaleConfig), scale_1.ScaleType.POINT);
                            });
                        });
                    });
                });
                it('should return band scale for ordinal X,Y when mark is rect', function () {
                    [type_2.ORDINAL, type_2.NOMINAL].forEach(function (t) {
                        [channel_1.X, channel_1.Y].forEach(function (channel) {
                            chai_1.assert.equal(type_1.scaleType(undefined, channel, { type: t }, 'rect', undefined, defaultScaleConfig), scale_1.ScaleType.BAND);
                        });
                    });
                });
                it('should return band scale for X,Y when mark is bar and rangeStep is null (fit)', function () {
                    [type_2.ORDINAL, type_2.NOMINAL].forEach(function (t) {
                        [channel_1.X, channel_1.Y].forEach(function (channel) {
                            chai_1.assert.equal(type_1.scaleType(undefined, channel, { type: t }, 'bar', null, defaultScaleConfig), scale_1.ScaleType.BAND);
                        });
                    });
                });
                it('should return band scale for X,Y when mark is bar and rangeStep is defined', function () {
                    [type_2.ORDINAL, type_2.NOMINAL].forEach(function (t) {
                        [channel_1.X, channel_1.Y].forEach(function (channel) {
                            chai_1.assert.equal(type_1.scaleType(undefined, channel, { type: t }, 'bar', undefined, defaultScaleConfig), scale_1.ScaleType.BAND);
                        });
                    });
                });
                it('should return point scale for X,Y when mark is point', function () {
                    [type_2.ORDINAL, type_2.NOMINAL].forEach(function (t) {
                        [channel_1.X, channel_1.Y].forEach(function (channel) {
                            chai_1.assert.equal(type_1.scaleType(undefined, channel, { type: t }, 'point', undefined, defaultScaleConfig), scale_1.ScaleType.POINT);
                        });
                    });
                });
                it('should return point scale for X,Y when mark is point when ORDINAL SCALE TYPE is specified and throw warning', function () {
                    [type_2.ORDINAL, type_2.NOMINAL].forEach(function (t) {
                        [channel_1.X, channel_1.Y].forEach(function (channel) {
                            log.runLocalLogger(function (localLogger) {
                                chai_1.assert.equal(type_1.scaleType('ordinal', channel, { type: t }, 'point', undefined, defaultScaleConfig), scale_1.ScaleType.POINT);
                                chai_1.assert.equal(localLogger.warns[0], log.message.scaleTypeNotWorkWithChannel(channel, 'ordinal', 'point'));
                            });
                        });
                    });
                });
                it('should return point scale for ordinal/nominal fields for continous channels other than x and y.', function () {
                    var OTHER_CONTINUOUS_CHANNELS = channel_1.CHANNELS.filter(function (c) { return channel_1.rangeType(c) === 'continuous' && !util.contains([channel_1.X, channel_1.Y, channel_1.ROW, channel_1.COLUMN], c); });
                    mark_1.PRIMITIVE_MARKS.forEach(function (mark) {
                        [type_2.ORDINAL, type_2.NOMINAL].forEach(function (t) {
                            OTHER_CONTINUOUS_CHANNELS.forEach(function (channel) {
                                chai_1.assert.equal(type_1.scaleType(undefined, channel, { type: t }, mark, undefined, defaultScaleConfig), scale_1.ScaleType.POINT, channel + ", " + mark + ", " + t + " " + type_1.scaleType(undefined, channel, { type: t }, mark, undefined, defaultScaleConfig));
                            });
                        });
                    });
                });
            });
        });
        describe('temporal', function () {
            it('should return sequential scale for temporal color field by default.', function () {
                chai_1.assert.equal(type_1.scaleType(undefined, 'color', { type: 'temporal' }, 'point', undefined, defaultScaleConfig), scale_1.ScaleType.SEQUENTIAL);
            });
            it('should return ordinal scale for temporal color field with discrete timeUnit by default.', function () {
                chai_1.assert.equal(type_1.scaleType(undefined, 'color', { timeUnit: 'quarter', type: 'temporal' }, 'point', undefined, defaultScaleConfig), scale_1.ScaleType.ORDINAL);
            });
            it('should return ordinal for temporal field and throw a warning.', log.wrap(function (localLogger) {
                chai_1.assert.deepEqual(type_1.scaleType(undefined, 'shape', { type: 'temporal', timeUnit: 'yearmonth' }, 'point', undefined, defaultScaleConfig), scale_1.ScaleType.ORDINAL);
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
                    chai_1.assert.deepEqual(type_1.scaleType(undefined, channel_1.Y, { type: 'temporal', timeUnit: timeUnit }, 'point', undefined, defaultScaleConfig), scale_1.ScaleType.TIME);
                }
            });
            it('should return a discrete scale for hours, day, month, quarter for x-y', function () {
                [timeunit_1.TimeUnit.MONTH, timeunit_1.TimeUnit.HOURS, timeunit_1.TimeUnit.DAY, timeunit_1.TimeUnit.QUARTER].forEach(function (timeUnit) {
                    chai_1.assert.deepEqual(type_1.scaleType(undefined, channel_1.Y, { type: 'temporal', timeUnit: timeUnit }, 'point', undefined, defaultScaleConfig), scale_1.ScaleType.POINT);
                });
            });
        });
        describe('quantitative', function () {
            it('should return sequential scale for quantitative color field by default.', function () {
                chai_1.assert.equal(type_1.scaleType(undefined, 'color', { type: 'quantitative' }, 'point', undefined, defaultScaleConfig), scale_1.ScaleType.SEQUENTIAL);
            });
            it('should return ordinal bin scale for quantitative color field with binning.', function () {
                chai_1.assert.equal(type_1.scaleType(undefined, 'color', { type: 'quantitative', bin: true }, 'point', undefined, defaultScaleConfig), scale_1.ScaleType.BIN_ORDINAL);
            });
            it('should return ordinal for encoding quantitative field with a discrete channel and throw a warning.', log.wrap(function (localLogger) {
                chai_1.assert.deepEqual(type_1.scaleType(undefined, 'shape', { type: 'quantitative' }, 'point', undefined, defaultScaleConfig), scale_1.ScaleType.ORDINAL);
                chai_1.assert.equal(localLogger.warns[0], log.message.discreteChannelCannotEncode('shape', 'quantitative'));
            }));
            it('should return linear scale for quantitative by default.', function () {
                chai_1.assert.equal(type_1.scaleType(undefined, 'x', { type: 'quantitative' }, 'point', undefined, defaultScaleConfig), scale_1.ScaleType.LINEAR);
            });
            it('should return bin linear scale for quantitative by default.', function () {
                chai_1.assert.equal(type_1.scaleType(undefined, 'opacity', { type: 'quantitative', bin: true }, 'point', undefined, defaultScaleConfig), scale_1.ScaleType.BIN_LINEAR);
            });
            it('should return linear scale for quantitative x and y.', function () {
                chai_1.assert.equal(type_1.scaleType(undefined, 'x', { type: 'quantitative', bin: true }, 'point', undefined, defaultScaleConfig), scale_1.ScaleType.LINEAR);
            });
        });
        describe('dataTypeMatchScaleType()', function () {
            it('should return specified value if datatype is ordinal or nominal and specified scale type is the ordinal or nominal', function () {
                chai_1.assert.equal(type_1.scaleType(scale_1.ScaleType.ORDINAL, 'shape', { type: 'ordinal' }, 'point', undefined, defaultScaleConfig), scale_1.ScaleType.ORDINAL);
            });
            it('should return default scale type if data type is temporal but specified scale type is not time or utc', function () {
                chai_1.assert.equal(type_1.scaleType(scale_1.ScaleType.LINEAR, 'x', { type: 'temporal', timeUnit: 'year' }, 'point', undefined, defaultScaleConfig), scale_1.ScaleType.TIME);
                chai_1.assert.equal(type_1.scaleType(scale_1.ScaleType.LINEAR, 'color', { type: 'temporal', timeUnit: 'year' }, 'point', undefined, defaultScaleConfig), scale_1.ScaleType.SEQUENTIAL);
            });
            it('should return specified discrete scale type if data type is temporal but specified scale type is time or utc', function () {
                chai_1.assert.equal(type_1.scaleType(scale_1.ScaleType.POINT, 'x', { type: 'temporal', timeUnit: 'year' }, 'point', undefined, defaultScaleConfig), scale_1.ScaleType.POINT);
            });
            it('should return default scale type if data type is temporal but specified scale type is time or utc or any discrete type', function () {
                chai_1.assert.equal(type_1.scaleType(scale_1.ScaleType.LINEAR, 'x', { type: 'temporal', timeUnit: 'year' }, 'point', undefined, defaultScaleConfig), scale_1.ScaleType.TIME);
            });
            it('should return default scale type if data type is quantative but scale type do not support quantative', function () {
                chai_1.assert.equal(type_1.scaleType(scale_1.ScaleType.TIME, 'color', { type: 'quantitative' }, 'point', undefined, defaultScaleConfig), scale_1.ScaleType.SEQUENTIAL);
            });
            it('should return default scale type if data type is quantative and scale type supports quantative', function () {
                chai_1.assert.equal(type_1.scaleType(scale_1.ScaleType.TIME, 'x', { type: 'quantitative' }, 'point', undefined, defaultScaleConfig), scale_1.ScaleType.LINEAR);
            });
            it('should return default scale type if data type is quantative and scale type supports quantative', function () {
                chai_1.assert.equal(type_1.scaleType(scale_1.ScaleType.TIME, 'x', { type: 'temporal' }, 'point', undefined, defaultScaleConfig), scale_1.ScaleType.TIME);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL3NjYWxlL3R5cGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUU1QixzQ0FBd0M7QUFFeEMsZ0RBQTRFO0FBQzVFLHdEQUEwRDtBQUMxRCw4Q0FBa0Q7QUFDbEQsMENBQWtEO0FBQ2xELDRDQUE2QztBQUM3QyxrREFBK0M7QUFDL0MsMENBQW1EO0FBQ25ELHdDQUEwQztBQUUxQyxJQUFNLGtCQUFrQixHQUFHLHNCQUFhLENBQUMsS0FBSyxDQUFDO0FBRS9DLFFBQVEsQ0FBQyxlQUFlLEVBQUU7SUFDeEIsUUFBUSxDQUFDLFFBQVEsRUFBRTtRQUNqQixFQUFFLENBQUMsOENBQThDLEVBQUU7WUFDakQsYUFBTSxDQUFDLFNBQVMsQ0FDZCxnQkFBUyxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLGtCQUFrQixDQUFDLEVBQ2pILElBQUksQ0FDTCxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsb0VBQW9FLEVBQUU7WUFDdkUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxVQUFDLFdBQVc7Z0JBQzdCLGFBQU0sQ0FBQyxTQUFTLENBQ2QsZ0JBQVMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFDLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxrQkFBa0IsQ0FBQyxFQUN0RyxpQkFBUyxDQUFDLFdBQVcsQ0FDdEIsQ0FBQztnQkFDRixhQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxpQkFB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