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
                    var OTHER_CONTINUOUS_CHANNELS = channel_1.SCALE_CHANNELS.filter(function (c) { return channel_1.rangeType(c) === 'continuous' && !util.contains([channel_1.X, channel_1.Y], c); });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL3NjYWxlL3R5cGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUU1QixzQ0FBd0M7QUFFeEMsZ0RBQXFFO0FBQ3JFLHdEQUEwRDtBQUMxRCw4Q0FBa0Q7QUFDbEQsMENBQWtEO0FBQ2xELDRDQUE2QztBQUM3QyxrREFBK0M7QUFDL0MsMENBQW1EO0FBQ25ELHdDQUEwQztBQUUxQyxJQUFNLGtCQUFrQixHQUFHLHNCQUFhLENBQUMsS0FBSyxDQUFDO0FBRS9DLFFBQVEsQ0FBQyxlQUFlLEVBQUU7SUFDeEIsUUFBUSxDQUFDLFFBQVEsRUFBRTtRQUNqQixFQUFFLENBQUMsOENBQThDLEVBQUU7WUFDakQsYUFBTSxDQUFDLFNBQVMsQ0FDZCxnQkFBUyxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLGtCQUFrQixDQUFDLEVBQ2pILElBQUksQ0FDTCxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsb0VBQW9FLEVBQUU7WUFDdkUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxVQUFDLFdBQVc7Z0JBQzdCLGFBQU0sQ0FBQyxTQUFTLENBQ2QsZ0JBQVMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFDLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxrQkFBa0IsQ0FBQyxFQUN0RyxpQkFBUyxDQUFDLFdBQVcsQ0FDdEIsQ0FBQztnQkFDRixhQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxpQkFB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