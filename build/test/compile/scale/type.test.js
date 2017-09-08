"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var type_1 = require("../../../src/compile/scale/type");
var config_1 = require("../../../src/config");
var log = require("../../../src/log");
var mark_1 = require("../../../src/mark");
var scale_1 = require("../../../src/scale");
var timeunit_1 = require("../../../src/timeunit");
var type_2 = require("../../../src/type");
var util = require("../../../src/util");
var defaultScaleConfig = config_1.defaultConfig.scale;
describe('compile/scale', function () {
    describe('type()', function () {
        it('should return null for channel without scale', function () {
            chai_1.assert.deepEqual(type_1.scaleType(undefined, 'detail', { type: 'temporal', timeUnit: 'yearmonth' }, 'point', defaultScaleConfig), null);
        });
        it('should show warning if users try to override the scale and use bin', function () {
            log.runLocalLogger(function (localLogger) {
                chai_1.assert.deepEqual(type_1.scaleType('point', 'color', { type: 'quantitative', bin: true }, 'point', defaultScaleConfig), scale_1.ScaleType.BIN_ORDINAL);
                chai_1.assert.equal(localLogger.warns[0], log.message.scaleTypeNotWorkWithFieldDef(scale_1.ScaleType.POINT, scale_1.ScaleType.BIN_ORDINAL));
            });
        });
        describe('nominal/ordinal', function () {
            describe('color', function () {
                it('should return ordinal scale for nominal data by default.', function () {
                    chai_1.assert.equal(type_1.scaleType(undefined, 'color', { type: 'nominal' }, 'point', defaultScaleConfig), scale_1.ScaleType.ORDINAL);
                });
                it('should return ordinal scale for ordinal data.', function () {
                    chai_1.assert.equal(type_1.scaleType(undefined, 'color', { type: 'nominal' }, 'point', defaultScaleConfig), scale_1.ScaleType.ORDINAL);
                });
            });
            describe('discrete channel (shape)', function () {
                it('should return ordinal for nominal field', function () {
                    chai_1.assert.deepEqual(type_1.scaleType(undefined, 'shape', { type: 'nominal' }, 'point', defaultScaleConfig), scale_1.ScaleType.ORDINAL);
                });
                it('should return ordinal even if other type is specified', function () {
                    [scale_1.ScaleType.LINEAR, scale_1.ScaleType.BAND, scale_1.ScaleType.POINT].forEach(function (badScaleType) {
                        log.runLocalLogger(function (localLogger) {
                            chai_1.assert.deepEqual(type_1.scaleType(badScaleType, 'shape', { type: 'nominal' }, 'point', defaultScaleConfig), scale_1.ScaleType.ORDINAL);
                            chai_1.assert.equal(localLogger.warns[0], log.message.scaleTypeNotWorkWithChannel('shape', badScaleType, 'ordinal'));
                        });
                    });
                });
                it('should return ordinal for an ordinal field and throw a warning.', log.wrap(function (localLogger) {
                    chai_1.assert.deepEqual(type_1.scaleType(undefined, 'shape', { type: 'ordinal' }, 'point', defaultScaleConfig), scale_1.ScaleType.ORDINAL);
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
                                chai_1.assert.equal(type_1.scaleType(undefined, channel, { type: t }, mark, defaultScaleConfig), scale_1.ScaleType.POINT);
                            });
                        });
                    });
                });
                it('should return band scale for ordinal X,Y when mark is rect', function () {
                    [type_2.ORDINAL, type_2.NOMINAL].forEach(function (t) {
                        [channel_1.X, channel_1.Y].forEach(function (channel) {
                            chai_1.assert.equal(type_1.scaleType(undefined, channel, { type: t }, 'rect', defaultScaleConfig), scale_1.ScaleType.BAND);
                        });
                    });
                });
                it('should return point scale for X,Y when mark is point', function () {
                    [type_2.ORDINAL, type_2.NOMINAL].forEach(function (t) {
                        [channel_1.X, channel_1.Y].forEach(function (channel) {
                            chai_1.assert.equal(type_1.scaleType(undefined, channel, { type: t }, 'point', defaultScaleConfig), scale_1.ScaleType.POINT);
                        });
                    });
                });
                it('should return point scale for X,Y when mark is point when ORDINAL SCALE TYPE is specified and throw warning', function () {
                    [type_2.ORDINAL, type_2.NOMINAL].forEach(function (t) {
                        [channel_1.X, channel_1.Y].forEach(function (channel) {
                            log.runLocalLogger(function (localLogger) {
                                chai_1.assert.equal(type_1.scaleType('ordinal', channel, { type: t }, 'point', defaultScaleConfig), scale_1.ScaleType.POINT);
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
                                chai_1.assert.equal(type_1.scaleType(undefined, channel, { type: t }, mark, defaultScaleConfig), scale_1.ScaleType.POINT, channel + ", " + mark + ", " + t + " " + type_1.scaleType(undefined, channel, { type: t }, mark, defaultScaleConfig));
                            });
                        });
                    });
                });
            });
        });
        describe('temporal', function () {
            it('should return sequential scale for temporal color field by default.', function () {
                chai_1.assert.equal(type_1.scaleType(undefined, 'color', { type: 'temporal' }, 'point', defaultScaleConfig), scale_1.ScaleType.SEQUENTIAL);
            });
            it('should return ordinal for temporal field and throw a warning.', log.wrap(function (localLogger) {
                chai_1.assert.deepEqual(type_1.scaleType(undefined, 'shape', { type: 'temporal', timeUnit: 'yearmonth' }, 'point', defaultScaleConfig), scale_1.ScaleType.ORDINAL);
                chai_1.assert.equal(localLogger.warns[0], log.message.discreteChannelCannotEncode('shape', 'temporal'));
            }));
            it('should return time for all time units.', function () {
                for (var _i = 0, TIMEUNITS_1 = timeunit_1.TIMEUNITS; _i < TIMEUNITS_1.length; _i++) {
                    var timeUnit = TIMEUNITS_1[_i];
                    chai_1.assert.deepEqual(type_1.scaleType(undefined, channel_1.Y, { type: 'temporal', timeUnit: timeUnit }, 'point', defaultScaleConfig), scale_1.ScaleType.TIME);
                }
            });
        });
        describe('quantitative', function () {
            it('should return sequential scale for quantitative color field by default.', function () {
                chai_1.assert.equal(type_1.scaleType(undefined, 'color', { type: 'quantitative' }, 'point', defaultScaleConfig), scale_1.ScaleType.SEQUENTIAL);
            });
            it('should return ordinal bin scale for quantitative color field with binning.', function () {
                chai_1.assert.equal(type_1.scaleType(undefined, 'color', { type: 'quantitative', bin: true }, 'point', defaultScaleConfig), scale_1.ScaleType.BIN_ORDINAL);
            });
            it('should return ordinal for encoding quantitative field with a discrete channel and throw a warning.', log.wrap(function (localLogger) {
                chai_1.assert.deepEqual(type_1.scaleType(undefined, 'shape', { type: 'quantitative' }, 'point', defaultScaleConfig), scale_1.ScaleType.ORDINAL);
                chai_1.assert.equal(localLogger.warns[0], log.message.discreteChannelCannotEncode('shape', 'quantitative'));
            }));
            it('should return linear scale for quantitative by default.', function () {
                chai_1.assert.equal(type_1.scaleType(undefined, 'x', { type: 'quantitative' }, 'point', defaultScaleConfig), scale_1.ScaleType.LINEAR);
            });
            it('should return bin linear scale for quantitative by default.', function () {
                chai_1.assert.equal(type_1.scaleType(undefined, 'opacity', { type: 'quantitative', bin: true }, 'point', defaultScaleConfig), scale_1.ScaleType.BIN_LINEAR);
            });
            it('should return linear scale for quantitative x and y.', function () {
                chai_1.assert.equal(type_1.scaleType(undefined, 'x', { type: 'quantitative', bin: true }, 'point', defaultScaleConfig), scale_1.ScaleType.LINEAR);
            });
        });
        describe('dataTypeMatchScaleType()', function () {
            it('should return specified value if datatype is ordinal or nominal and specified scale type is the ordinal or nominal', function () {
                chai_1.assert.equal(type_1.scaleType(scale_1.ScaleType.ORDINAL, 'shape', { type: 'ordinal' }, 'point', defaultScaleConfig), scale_1.ScaleType.ORDINAL);
            });
            it('should return default scale type if data type is temporal but specified scale type is not time or utc', function () {
                chai_1.assert.equal(type_1.scaleType(scale_1.ScaleType.LINEAR, 'x', { type: 'temporal', timeUnit: 'year' }, 'point', defaultScaleConfig), scale_1.ScaleType.TIME);
                chai_1.assert.equal(type_1.scaleType(scale_1.ScaleType.LINEAR, 'color', { type: 'temporal', timeUnit: 'year' }, 'point', defaultScaleConfig), scale_1.ScaleType.SEQUENTIAL);
            });
            it('should return time if data type is temporal but specified scale type is discrete', function () {
                chai_1.assert.equal(type_1.scaleType(scale_1.ScaleType.POINT, 'x', { type: 'temporal', timeUnit: 'year' }, 'point', defaultScaleConfig), scale_1.ScaleType.TIME);
            });
            it('should return default scale type if data type is temporal but specified scale type is time or utc or any discrete type', function () {
                chai_1.assert.equal(type_1.scaleType(scale_1.ScaleType.LINEAR, 'x', { type: 'temporal', timeUnit: 'year' }, 'point', defaultScaleConfig), scale_1.ScaleType.TIME);
            });
            it('should return default scale type if data type is quantative but scale type do not support quantative', function () {
                chai_1.assert.equal(type_1.scaleType(scale_1.ScaleType.TIME, 'color', { type: 'quantitative' }, 'point', defaultScaleConfig), scale_1.ScaleType.SEQUENTIAL);
            });
            it('should return default scale type if data type is quantative and scale type supports quantative', function () {
                chai_1.assert.equal(type_1.scaleType(scale_1.ScaleType.TIME, 'x', { type: 'quantitative' }, 'point', defaultScaleConfig), scale_1.ScaleType.LINEAR);
            });
            it('should return default scale type if data type is quantative and scale type supports quantative', function () {
                chai_1.assert.equal(type_1.scaleType(scale_1.ScaleType.TIME, 'x', { type: 'temporal' }, 'point', defaultScaleConfig), scale_1.ScaleType.TIME);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL3NjYWxlL3R5cGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUM1QixnREFBcUU7QUFDckUsd0RBQTBEO0FBQzFELDhDQUFrRDtBQUNsRCxzQ0FBd0M7QUFDeEMsMENBQWtEO0FBQ2xELDRDQUE2QztBQUM3QyxrREFBZ0Q7QUFDaEQsMENBQW1EO0FBQ25ELHdDQUEwQztBQUUxQyxJQUFNLGtCQUFrQixHQUFHLHNCQUFhLENBQUMsS0FBSyxDQUFDO0FBRS9DLFFBQVEsQ0FBQyxlQUFlLEVBQUU7SUFDeEIsUUFBUSxDQUFDLFFBQVEsRUFBRTtRQUNqQixFQUFFLENBQUMsOENBQThDLEVBQUU7WUFDakQsYUFBTSxDQUFDLFNBQVMsQ0FDZCxnQkFBUyxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUMsRUFBRSxPQUFPLEVBQUUsa0JBQWtCLENBQUMsRUFDdEcsSUFBSSxDQUNMLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxvRUFBb0UsRUFBRTtZQUN2RSxHQUFHLENBQUMsY0FBYyxDQUFDLFVBQUMsV0FBVztnQkFDN0IsYUFBTSxDQUFDLFNBQVMsQ0FDZCxnQkFBUyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsRUFBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUMsRUFBRSxPQUFPLEVBQUUsa0JBQWtCLENBQUMsRUFDM0YsaUJBQVMsQ0FBQyxXQUFXLENBQ3RCLENBQUM7Z0JBQ0YsYUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsNEJBQTRCLENBQUMsaUJBQVMsQ0FBQyxLQUFLLEVBQUUsaUJB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