"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var type_1 = require("../../../src/compile/scale/type");
var config_1 = require("../../../src/config");
var log = tslib_1.__importStar(require("../../../src/log"));
var mark_1 = require("../../../src/mark");
var scale_1 = require("../../../src/scale");
var timeunit_1 = require("../../../src/timeunit");
var type_2 = require("../../../src/type");
var util = tslib_1.__importStar(require("../../../src/util"));
var defaultScaleConfig = config_1.defaultConfig.scale;
describe('compile/scale', function () {
    describe('type()', function () {
        it('should return null for channel without scale', function () {
            chai_1.assert.deepEqual(type_1.scaleType({}, 'detail', { type: 'temporal', timeUnit: 'yearmonth' }, 'point', defaultScaleConfig), null);
        });
        it('should show warning if users try to override the scale and use bin', log.wrap(function (localLogger) {
            chai_1.assert.deepEqual(type_1.scaleType({ type: 'point' }, 'color', { type: 'quantitative', bin: true }, 'point', defaultScaleConfig), scale_1.ScaleType.BIN_ORDINAL);
            chai_1.assert.equal(localLogger.warns[0], log.message.scaleTypeNotWorkWithFieldDef(scale_1.ScaleType.POINT, scale_1.ScaleType.BIN_ORDINAL));
        }));
        describe('nominal/ordinal', function () {
            describe('color', function () {
                it('should return ordinal scale for nominal data by default.', function () {
                    chai_1.assert.equal(type_1.scaleType({}, 'color', { type: 'nominal' }, 'point', defaultScaleConfig), scale_1.ScaleType.ORDINAL);
                });
                it('should return ordinal scale for ordinal data.', function () {
                    chai_1.assert.equal(type_1.scaleType({}, 'color', { type: 'nominal' }, 'point', defaultScaleConfig), scale_1.ScaleType.ORDINAL);
                });
            });
            describe('discrete channel (shape)', function () {
                it('should return ordinal for nominal field', function () {
                    chai_1.assert.deepEqual(type_1.scaleType({}, 'shape', { type: 'nominal' }, 'point', defaultScaleConfig), scale_1.ScaleType.ORDINAL);
                });
                it('should return ordinal even if other type is specified', log.wrap(function (localLogger) {
                    [scale_1.ScaleType.LINEAR, scale_1.ScaleType.BAND, scale_1.ScaleType.POINT].forEach(function (badScaleType) {
                        chai_1.assert.deepEqual(type_1.scaleType({ type: badScaleType }, 'shape', { type: 'nominal' }, 'point', defaultScaleConfig), scale_1.ScaleType.ORDINAL);
                        var warns = localLogger.warns;
                        chai_1.assert.equal(warns[warns.length - 1], log.message.scaleTypeNotWorkWithChannel('shape', badScaleType, 'ordinal'));
                    });
                }));
                it('should return ordinal for an ordinal field and throw a warning.', log.wrap(function (localLogger) {
                    chai_1.assert.deepEqual(type_1.scaleType({}, 'shape', { type: 'ordinal' }, 'point', defaultScaleConfig), scale_1.ScaleType.ORDINAL);
                    chai_1.assert.equal(localLogger.warns[0], log.message.discreteChannelCannotEncode('shape', 'ordinal'));
                }));
            });
            describe('continuous', function () {
                it('should return point scale for ordinal X,Y for marks others than rect, rule, and bar', function () {
                    mark_1.PRIMITIVE_MARKS.forEach(function (mark) {
                        if (util.contains(['bar', 'rule', 'rect'], mark)) {
                            return;
                        }
                        [type_2.ORDINAL, type_2.NOMINAL].forEach(function (t) {
                            [channel_1.X, channel_1.Y].forEach(function (channel) {
                                chai_1.assert.equal(type_1.scaleType({}, channel, { type: t }, mark, defaultScaleConfig), scale_1.ScaleType.POINT);
                            });
                        });
                    });
                });
                it('should return band scale for ordinal X,Y when mark is rect, rule, bar', function () {
                    [type_2.ORDINAL, type_2.NOMINAL].forEach(function (t) {
                        [channel_1.X, channel_1.Y].forEach(function (channel) {
                            ['bar', 'rule', 'rect'].forEach(function (mark) {
                                chai_1.assert.equal(type_1.scaleType({}, channel, { type: t }, 'rect', defaultScaleConfig), scale_1.ScaleType.BAND);
                            });
                        });
                    });
                });
                it('should return point scale for X,Y when mark is point', function () {
                    [type_2.ORDINAL, type_2.NOMINAL].forEach(function (t) {
                        [channel_1.X, channel_1.Y].forEach(function (channel) {
                            chai_1.assert.equal(type_1.scaleType({}, channel, { type: t }, 'point', defaultScaleConfig), scale_1.ScaleType.POINT);
                        });
                    });
                });
                it('should return point scale for X,Y when mark is point when ORDINAL SCALE TYPE is specified and throw warning', log.wrap(function (localLogger) {
                    [type_2.ORDINAL, type_2.NOMINAL].forEach(function (t) {
                        [channel_1.X, channel_1.Y].forEach(function (channel) {
                            chai_1.assert.equal(type_1.scaleType({ type: 'ordinal' }, channel, { type: t }, 'point', defaultScaleConfig), scale_1.ScaleType.POINT);
                            var warns = localLogger.warns;
                            chai_1.assert.equal(warns[warns.length - 1], log.message.scaleTypeNotWorkWithChannel(channel, 'ordinal', 'point'));
                        });
                    });
                }));
                it('should return point scale for ordinal/nominal fields for continuous channels other than x and y.', function () {
                    var OTHER_CONTINUOUS_CHANNELS = channel_1.SCALE_CHANNELS.filter(function (c) { return channel_1.rangeType(c) === 'continuous' && !util.contains([channel_1.X, channel_1.Y], c); });
                    mark_1.PRIMITIVE_MARKS.forEach(function (mark) {
                        [type_2.ORDINAL, type_2.NOMINAL].forEach(function (t) {
                            OTHER_CONTINUOUS_CHANNELS.forEach(function (channel) {
                                chai_1.assert.equal(type_1.scaleType({}, channel, { type: t }, mark, defaultScaleConfig), scale_1.ScaleType.POINT, channel + ", " + mark + ", " + t + " " + type_1.scaleType({}, channel, { type: t }, mark, defaultScaleConfig));
                            });
                        });
                    });
                });
            });
        });
        describe('temporal', function () {
            it('should return sequential scale for temporal color field by default.', function () {
                chai_1.assert.equal(type_1.scaleType({}, 'color', { type: 'temporal' }, 'point', defaultScaleConfig), scale_1.ScaleType.SEQUENTIAL);
            });
            it('should return ordinal for temporal field and throw a warning.', log.wrap(function (localLogger) {
                chai_1.assert.deepEqual(type_1.scaleType({}, 'shape', { type: 'temporal', timeUnit: 'yearmonth' }, 'point', defaultScaleConfig), scale_1.ScaleType.ORDINAL);
                chai_1.assert.equal(localLogger.warns[0], log.message.discreteChannelCannotEncode('shape', 'temporal'));
            }));
            it('should return time for all time units.', function () {
                for (var _i = 0, TIMEUNITS_1 = timeunit_1.TIMEUNITS; _i < TIMEUNITS_1.length; _i++) {
                    var timeUnit = TIMEUNITS_1[_i];
                    chai_1.assert.deepEqual(type_1.scaleType({}, channel_1.Y, { type: 'temporal', timeUnit: timeUnit }, 'point', defaultScaleConfig), scale_1.ScaleType.TIME);
                }
            });
        });
        describe('quantitative', function () {
            it('should return sequential scale for quantitative color field by default.', function () {
                chai_1.assert.equal(type_1.scaleType({}, 'color', { type: 'quantitative' }, 'point', defaultScaleConfig), scale_1.ScaleType.SEQUENTIAL);
            });
            it('should return linear scale for piecewise quantitative color field by default.', function () {
                chai_1.assert.equal(type_1.scaleType({ domain: [1, 2, 3], range: ['red', 'green', 'blue'] }, 'color', { type: 'quantitative' }, 'point', defaultScaleConfig), scale_1.ScaleType.LINEAR);
            });
            it('should return ordinal bin scale for quantitative color field with binning.', function () {
                chai_1.assert.equal(type_1.scaleType({}, 'color', { type: 'quantitative', bin: true }, 'point', defaultScaleConfig), scale_1.ScaleType.BIN_ORDINAL);
            });
            it('should return ordinal for encoding quantitative field with a discrete channel and throw a warning.', log.wrap(function (localLogger) {
                chai_1.assert.deepEqual(type_1.scaleType({}, 'shape', { type: 'quantitative' }, 'point', defaultScaleConfig), scale_1.ScaleType.ORDINAL);
                chai_1.assert.equal(localLogger.warns[0], log.message.discreteChannelCannotEncode('shape', 'quantitative'));
            }));
            it('should return linear scale for quantitative by default.', function () {
                chai_1.assert.equal(type_1.scaleType({}, 'x', { type: 'quantitative' }, 'point', defaultScaleConfig), scale_1.ScaleType.LINEAR);
            });
            it('should return bin linear scale for quantitative by default.', function () {
                chai_1.assert.equal(type_1.scaleType({}, 'opacity', { type: 'quantitative', bin: true }, 'point', defaultScaleConfig), scale_1.ScaleType.BIN_LINEAR);
            });
            it('should return linear scale for quantitative x and y.', function () {
                chai_1.assert.equal(type_1.scaleType({}, 'x', { type: 'quantitative', bin: true }, 'point', defaultScaleConfig), scale_1.ScaleType.LINEAR);
            });
        });
        describe('dataTypeMatchScaleType()', function () {
            it('should return specified value if datatype is ordinal or nominal and specified scale type is the ordinal or nominal', function () {
                chai_1.assert.equal(type_1.scaleType({ type: scale_1.ScaleType.ORDINAL }, 'shape', { type: 'ordinal' }, 'point', defaultScaleConfig), scale_1.ScaleType.ORDINAL);
            });
            it('should return default scale type if data type is temporal but specified scale type is not time or utc', function () {
                chai_1.assert.equal(type_1.scaleType({ type: scale_1.ScaleType.LINEAR }, 'x', { type: 'temporal', timeUnit: 'year' }, 'point', defaultScaleConfig), scale_1.ScaleType.TIME);
                chai_1.assert.equal(type_1.scaleType({ type: scale_1.ScaleType.LINEAR }, 'color', { type: 'temporal', timeUnit: 'year' }, 'point', defaultScaleConfig), scale_1.ScaleType.SEQUENTIAL);
            });
            it('should return time if data type is temporal but specified scale type is discrete', function () {
                chai_1.assert.equal(type_1.scaleType({ type: scale_1.ScaleType.POINT }, 'x', { type: 'temporal', timeUnit: 'year' }, 'point', defaultScaleConfig), scale_1.ScaleType.TIME);
            });
            it('should return default scale type if data type is temporal but specified scale type is time or utc or any discrete type', function () {
                chai_1.assert.equal(type_1.scaleType({ type: scale_1.ScaleType.LINEAR }, 'x', { type: 'temporal', timeUnit: 'year' }, 'point', defaultScaleConfig), scale_1.ScaleType.TIME);
            });
            it('should return default scale type if data type is quantative but scale type do not support quantative', function () {
                chai_1.assert.equal(type_1.scaleType({ type: scale_1.ScaleType.TIME }, 'color', { type: 'quantitative' }, 'point', defaultScaleConfig), scale_1.ScaleType.SEQUENTIAL);
            });
            it('should return default scale type if data type is quantative and scale type supports quantative', function () {
                chai_1.assert.equal(type_1.scaleType({ type: scale_1.ScaleType.TIME }, 'x', { type: 'quantitative' }, 'point', defaultScaleConfig), scale_1.ScaleType.LINEAR);
            });
            it('should return default scale type if data type is quantative and scale type supports quantative', function () {
                chai_1.assert.equal(type_1.scaleType({ type: scale_1.ScaleType.TIME }, 'x', { type: 'temporal' }, 'point', defaultScaleConfig), scale_1.ScaleType.TIME);
            });
        });
    });
});
//# sourceMappingURL=type.test.js.map