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
                    var OTHER_CONTINUOUS_CHANNELS = channel_1.CHANNELS.filter(function (c) { return channel_1.rangeType(c) === 'continuous' && !util.contains([channel_1.X, channel_1.Y, channel_1.ROW, channel_1.COLUMN], c); });
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL3NjYWxlL3R5cGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUU1QixzQ0FBd0M7QUFFeEMsOENBQWtEO0FBQ2xELGdEQUE0RTtBQUM1RSwwQ0FBa0Q7QUFDbEQsNENBQTZDO0FBQzdDLDBDQUFtRDtBQUNuRCx3REFBd0Q7QUFDeEQsa0RBQStDO0FBQy9DLHdDQUEwQztBQUUxQyxRQUFRLENBQUMsZUFBZSxFQUFFO0lBQ3hCLFFBQVEsQ0FBQyxRQUFRLEVBQUU7UUFDakIsRUFBRSxDQUFDLDhDQUE4QyxFQUFFO1lBQ2pELGFBQU0sQ0FBQyxTQUFTLENBQ2QsY0FBUyxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxzQkFBYSxDQUFDLEVBQ3JHLElBQUksQ0FDTCxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsWUFBWSxFQUFFO1lBQ3JCLEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRTtnQkFDdEMsQ0FBQyxhQUFHLEVBQUUsZ0JBQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQU87b0JBQzVCLGFBQU0sQ0FBQyxTQUFTLENBQ2QsY0FBUyxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxzQkFBYSxDQUFDLEVBQ3BHLGlCQUFTLENBQUMsSUFBSSxDQUNmLENBQUM7Z0JBQ0osQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxtRUFBbUUsRUFBRTtnQkFDdEUsQ0FBQyxhQUFHLEVBQUUsZ0JBQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQU87b0JBQzVCLENBQUMs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