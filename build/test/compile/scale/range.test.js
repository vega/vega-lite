"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var range_1 = require("../../../src/compile/scale/range");
var split_1 = require("../../../src/compile/split");
var config_1 = require("../../../src/config");
var log = tslib_1.__importStar(require("../../../src/log"));
var scale_1 = require("../../../src/scale");
var type_1 = require("../../../src/type");
describe('compile/scale', function () {
    describe('parseRange()', function () {
        describe('position', function () {
            it('should return [0, plot_width] for x-continuous scales by default.', function () {
                for (var _i = 0, CONTINUOUS_TO_CONTINUOUS_SCALES_1 = scale_1.CONTINUOUS_TO_CONTINUOUS_SCALES; _i < CONTINUOUS_TO_CONTINUOUS_SCALES_1.length; _i++) {
                    var scaleType = CONTINUOUS_TO_CONTINUOUS_SCALES_1[_i];
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', scaleType, type_1.QUANTITATIVE, {}, config_1.defaultConfig, true, 'point', false, 'plot_width', []), split_1.makeImplicit([0, { signal: 'plot_width' }]));
                }
            });
            it('should return [plot_height,0] for y-continuous scales by default.', function () {
                for (var _i = 0, CONTINUOUS_TO_CONTINUOUS_SCALES_2 = scale_1.CONTINUOUS_TO_CONTINUOUS_SCALES; _i < CONTINUOUS_TO_CONTINUOUS_SCALES_2.length; _i++) {
                    var scaleType = CONTINUOUS_TO_CONTINUOUS_SCALES_2[_i];
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('y', scaleType, type_1.QUANTITATIVE, {}, config_1.defaultConfig, true, 'point', false, 'plot_height', []), split_1.makeImplicit([{ signal: 'plot_height' }, 0]));
                }
            });
            it('should return [0, plot_height] for y-discrete scales with height by default.', function () {
                for (var _i = 0, DISCRETE_DOMAIN_SCALES_1 = scale_1.DISCRETE_DOMAIN_SCALES; _i < DISCRETE_DOMAIN_SCALES_1.length; _i++) {
                    var scaleType = DISCRETE_DOMAIN_SCALES_1[_i];
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('y', scaleType, type_1.QUANTITATIVE, {}, config_1.defaultConfig, true, 'point', true, 'plot_height', []), split_1.makeImplicit([0, { signal: 'plot_height' }]));
                }
            });
            it('should support custom range.', log.wrap(function (localLogger) {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', 'linear', type_1.QUANTITATIVE, { range: [0, 100] }, config_1.defaultConfig, true, 'point', false, 'plot_width', []), split_1.makeExplicit([0, 100]));
                chai_1.assert.deepEqual(localLogger.warns.length, 0);
            }));
            it('should return config.scale.rangeStep for band/point scales by default.', function () {
                for (var _i = 0, _a = ['point', 'band']; _i < _a.length; _i++) {
                    var scaleType = _a[_i];
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', scaleType, type_1.NOMINAL, {}, config_1.defaultConfig, undefined, 'point', false, 'plot_width', []), split_1.makeImplicit({ step: 21 }));
                }
            });
            it("should return config.scale.textXRangeStep by default for text mark's x band/point scales.", function () {
                for (var _i = 0, _a = ['point', 'band']; _i < _a.length; _i++) {
                    var scaleType = _a[_i];
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', scaleType, type_1.NOMINAL, {}, { scale: { textXRangeStep: 55 } }, undefined, 'text', false, 'plot_width', []), split_1.makeImplicit({ step: 55 }));
                }
            });
            it('should return specified rangeStep if topLevelSize is undefined for band/point scales', function () {
                for (var _i = 0, _a = ['point', 'band']; _i < _a.length; _i++) {
                    var scaleType = _a[_i];
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', scaleType, type_1.NOMINAL, { rangeStep: 23 }, config_1.defaultConfig, undefined, 'text', false, 'plot_width', []), split_1.makeExplicit({ step: 23 }));
                }
            });
            it('should drop rangeStep if topLevelSize is specified for band/point scales', log.wrap(function (localLogger) {
                for (var _i = 0, _a = ['point', 'band']; _i < _a.length; _i++) {
                    var scaleType = _a[_i];
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', scaleType, type_1.NOMINAL, { rangeStep: 23 }, config_1.defaultConfig, undefined, 'text', true, 'plot_width', []), split_1.makeImplicit([0, { signal: 'plot_width' }]));
                }
                chai_1.assert.equal(localLogger.warns[0], log.message.rangeStepDropped('x'));
            }));
            it('should return default topLevelSize if rangeStep is null for band/point scales', function () {
                for (var _i = 0, _a = ['point', 'band']; _i < _a.length; _i++) {
                    var scaleType = _a[_i];
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', scaleType, type_1.NOMINAL, { rangeStep: null }, config_1.defaultConfig, undefined, 'text', false, 'plot_width', []), split_1.makeImplicit([0, { signal: 'plot_width' }]));
                }
            });
            it('should return default topLevelSize if rangeStep config is null', function () {
                for (var _i = 0, _a = ['point', 'band']; _i < _a.length; _i++) {
                    var scaleType = _a[_i];
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', scaleType, type_1.NOMINAL, {}, { view: { width: 200 }, scale: { rangeStep: null } }, undefined, 'point', false, 'plot_width', []), split_1.makeImplicit([0, { signal: 'plot_width' }]));
                }
            });
            it('should return default topLevelSize for text if textXRangeStep config is null', function () {
                for (var _i = 0, _a = ['point', 'band']; _i < _a.length; _i++) {
                    var scaleType = _a[_i];
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', scaleType, type_1.NOMINAL, {}, { view: { width: 200 }, scale: { textXRangeStep: null } }, undefined, 'text', false, 'plot_width', []), split_1.makeImplicit([0, { signal: 'plot_width' }]));
                }
            });
            it('should drop rangeStep for continuous scales', function () {
                var _loop_1 = function (scaleType) {
                    log.wrap(function (localLogger) {
                        chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', scaleType, type_1.QUANTITATIVE, { rangeStep: 23 }, config_1.defaultConfig, undefined, 'text', true, 'plot_width', []), split_1.makeImplicit([0, { signal: 'plot_width' }]));
                        chai_1.assert.equal(localLogger.warns[0], log.message.scalePropertyNotWorkWithScaleType(scaleType, 'rangeStep', 'x'));
                    })();
                };
                for (var _i = 0, CONTINUOUS_TO_CONTINUOUS_SCALES_3 = scale_1.CONTINUOUS_TO_CONTINUOUS_SCALES; _i < CONTINUOUS_TO_CONTINUOUS_SCALES_3.length; _i++) {
                    var scaleType = CONTINUOUS_TO_CONTINUOUS_SCALES_3[_i];
                    _loop_1(scaleType);
                }
            });
        });
        describe('color', function () {
            it('should use the specified scheme for a nominal color field.', function () {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('color', 'ordinal', type_1.NOMINAL, { scheme: 'warm' }, config_1.defaultConfig, undefined, 'point', false, 'plot_width', []), split_1.makeExplicit({ scheme: 'warm' }));
            });
            it('should use the specified scheme with extent for a nominal color field.', function () {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('color', 'ordinal', type_1.NOMINAL, { scheme: { name: 'warm', extent: [0.2, 1] } }, config_1.defaultConfig, undefined, 'point', false, 'plot_width', []), split_1.makeExplicit({ scheme: 'warm', extent: [0.2, 1] }));
            });
            it('should use the specified range for a nominal color field.', function () {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('color', 'ordinal', type_1.NOMINAL, { range: ['red', 'green', 'blue'] }, config_1.defaultConfig, undefined, 'point', false, 'plot_width', []), split_1.makeExplicit(['red', 'green', 'blue']));
            });
            it('should use default category range in Vega for a nominal color field.', function () {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('color', 'ordinal', type_1.NOMINAL, {}, config_1.defaultConfig, undefined, 'point', false, 'plot_width', []), split_1.makeImplicit('category'));
            });
            it('should use default ordinal range in Vega for an ordinal color field.', function () {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('color', 'ordinal', type_1.ORDINAL, {}, config_1.defaultConfig, undefined, 'point', false, 'plot_width', []), split_1.makeImplicit('ordinal'));
            });
            it('should use default ramp range in Vega for a temporal/quantitative color field.', function () {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('color', 'sequential', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'point', false, 'plot_width', []), split_1.makeImplicit('ramp'));
            });
            it('should use the specified scheme with count for a quantitative color field.', function () {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('color', 'ordinal', type_1.QUANTITATIVE, { scheme: { name: 'viridis', count: 3 } }, config_1.defaultConfig, undefined, 'point', false, 'plot_width', []), split_1.makeExplicit({ scheme: 'viridis', count: 3 }));
            });
            it('should use default ordinal range for quantile/quantize scales', function () {
                var scales = ['quantile', 'quantize'];
                scales.forEach(function (discretizingScale) {
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('color', discretizingScale, type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'point', false, 'plot_width', []), split_1.makeImplicit({ scheme: 'blues', count: 4 }));
                });
            });
            it('should use default ordinal range for threshold scale', function () {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('color', 'threshold', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'point', false, 'plot_width', []), split_1.makeImplicit({ scheme: 'blues', count: 3 }));
            });
            it('should use default color range for log scale', function () {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('color', 'log', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'point', false, 'plot_width', []), split_1.makeImplicit(['#f7fbff', '#0e427f']));
            });
        });
        describe('opacity', function () {
            it("should use default opacityRange as opacity's scale range.", function () {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('opacity', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'point', false, 'plot_width', []), split_1.makeImplicit([config_1.defaultConfig.scale.minOpacity, config_1.defaultConfig.scale.maxOpacity]));
            });
        });
        describe('size', function () {
            describe('bar', function () {
                it('should return [minBandSize, maxBandSize] if both are specified', function () {
                    var config = {
                        scale: { minBandSize: 2, maxBandSize: 9 }
                    };
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config, undefined, 'bar', false, 'plot_width', []), split_1.makeImplicit([2, 9]));
                });
                it('should return [continuousBandSize, xRangeStep-1] by default since min/maxSize config are not specified', function () {
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'bar', false, 'plot_width', []), split_1.makeImplicit([2, config_1.defaultConfig.scale.rangeStep - 1]));
                });
            });
            describe('tick', function () {
                it('should return [minBandSize, maxBandSize] if both are specified', function () {
                    var config = {
                        scale: { minBandSize: 4, maxBandSize: 9 }
                    };
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config, undefined, 'tick', false, 'plot_width', []), split_1.makeImplicit([4, 9]));
                });
                it('should return [(default)minBandSize, rangeStep-1] by default since maxSize config is not specified', function () {
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'tick', false, 'plot_width', []), split_1.makeImplicit([config_1.defaultConfig.scale.minBandSize, config_1.defaultConfig.scale.rangeStep - 1]));
                });
            });
            describe('text', function () {
                it('should return [minFontSize, maxFontSize]', function () {
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'text', false, 'plot_width', []), split_1.makeImplicit([config_1.defaultConfig.scale.minFontSize, config_1.defaultConfig.scale.maxFontSize]));
                });
            });
            describe('rule', function () {
                it('should return [minStrokeWidth, maxStrokeWidth]', function () {
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'rule', false, 'plot_width', []), split_1.makeImplicit([config_1.defaultConfig.scale.minStrokeWidth, config_1.defaultConfig.scale.maxStrokeWidth]));
                });
            });
            describe('point, square, circle', function () {
                it('should return [minSize, maxSize]', function () {
                    for (var _i = 0, _a = ['point', 'square', 'circle']; _i < _a.length; _i++) {
                        var m = _a[_i];
                        var config = {
                            scale: {
                                minSize: 5,
                                maxSize: 25
                            }
                        };
                        chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config, undefined, m, false, 'plot_width', []), split_1.makeImplicit([5, 25]));
                    }
                });
                it('should return [0, (minBandSize-2)^2] if both x and y are discrete and size is quantitative (thus use zero=true, by default)', function () {
                    for (var _i = 0, _a = ['point', 'square', 'circle']; _i < _a.length; _i++) {
                        var m = _a[_i];
                        chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, true, m, false, 'plot_width', [11, 13] // xyRangeSteps
                        ), split_1.makeImplicit([0, 81]));
                    }
                });
                it('should return [9, (minBandSize-2)^2] if both x and y are discrete and size is not quantitative (thus use zero=false, by default)', function () {
                    for (var _i = 0, _a = ['point', 'square', 'circle']; _i < _a.length; _i++) {
                        var m = _a[_i];
                        chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, false, m, false, 'plot_width', [11, 13] // xyRangeSteps
                        ), split_1.makeImplicit([9, 81]));
                    }
                });
                it('should return [9, (minBandSize-2)^2] if both x and y are discrete and size is quantitative but use zero=false', function () {
                    for (var _i = 0, _a = ['point', 'square', 'circle']; _i < _a.length; _i++) {
                        var m = _a[_i];
                        chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, false, m, false, 'plot_width', [11, 13] // xyRangeSteps
                        ), split_1.makeImplicit([9, 81]));
                    }
                });
                it('should return [0, (xRangeStep-2)^2] if x is discrete and y is continuous and size is quantitative (thus use zero=true, by default)', function () {
                    for (var _i = 0, _a = ['point', 'square', 'circle']; _i < _a.length; _i++) {
                        var m = _a[_i];
                        chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, true, m, false, 'plot_width', [11] // xyRangeSteps only have one value
                        ), split_1.makeImplicit([0, 81]));
                    }
                });
                it('should return range interpolation of length 4 for quantile/quantize scales', function () {
                    var scales = ['quantile', 'quantize'];
                    scales.forEach(function (discretizingScale) {
                        chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', discretizingScale, type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'point', false, 'plot_width', []), split_1.makeImplicit([9, 126.33333333333333, 243.66666666666666, 361]));
                    });
                });
                it('should return range interpolation of length 4 for threshold scale', function () {
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'threshold', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'point', false, 'plot_width', []), split_1.makeImplicit([9, 185, 361]));
                });
            });
        });
        describe('shape', function () {
            it("should use default symbol range in Vega as shape's scale range.", function () {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('shape', 'ordinal', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'point', false, 'plot_width', []), split_1.makeImplicit('symbol'));
            });
        });
    });
    describe('defaultContinuousToDiscreteCount', function () {
        it('should use config.scale.quantileCount for quantile scale', function () {
            var config = {
                scale: {
                    quantileCount: 4
                }
            };
            chai_1.assert.equal(range_1.defaultContinuousToDiscreteCount('quantile', config, undefined, 'x'), 4);
        });
        it('should use config.scale.quantizeCount for quantize scale', function () {
            var config = {
                scale: {
                    quantizeCount: 4
                }
            };
            chai_1.assert.equal(range_1.defaultContinuousToDiscreteCount('quantize', config, undefined, 'x'), 4);
        });
        it('should use domain size for threshold scale', function () {
            chai_1.assert.equal(range_1.defaultContinuousToDiscreteCount('threshold', {}, [1, 10], 'x'), 3);
        });
        it('should throw warning and default to 4 for scale without domain', function () {
            log.wrap(function (localLogger) {
                chai_1.assert.equal(range_1.defaultContinuousToDiscreteCount('quantize', {}, undefined, 'x'), 4);
                chai_1.assert.equal(localLogger.warns[0], log.message.domainRequiredForThresholdScale('x'));
            });
        });
    });
    describe('interpolateRange', function () {
        it('should return the correct interpolation of 1 - 100 with cardinality of 5', function () {
            chai_1.assert.deepEqual(range_1.interpolateRange(0, 100, 5), [0, 25, 50, 75, 100]);
        });
    });
});
//# sourceMappingURL=range.test.js.map