"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var range_1 = require("../../../src/compile/scale/range");
var split_1 = require("../../../src/compile/split");
var config_1 = require("../../../src/config");
var log = require("../../../src/log");
var scale_1 = require("../../../src/scale");
var type_1 = require("../../../src/type");
describe('compile/scale', function () {
    describe('parseRange()', function () {
        describe('position', function () {
            it('should return [0, plot_width] for x-continous scales by default.', function () {
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
            it('should return config.scale.textXRangeStep by default for text mark\'s x band/point scales.', function () {
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
        });
        describe('opacity', function () {
            it('should use default opacityRange as opacity\'s scale range.', function () {
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
            });
        });
        describe('shape', function () {
            it('should use default symbol range in Vega as shape\'s scale range.', function () {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('shape', 'ordinal', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'point', false, 'plot_width', []), split_1.makeImplicit('symbol'));
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZ2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9zY2FsZS9yYW5nZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUU1QiwwREFBc0U7QUFDdEUsb0RBQXNFO0FBQ3RFLDhDQUFrRDtBQUNsRCxzQ0FBd0M7QUFFeEMsNENBQXNHO0FBQ3RHLDBDQUFpRTtBQUVqRSxRQUFRLENBQUMsZUFBZSxFQUFFO0lBQ3hCLFFBQVEsQ0FBQyxjQUFjLEVBQUU7UUFDdkIsUUFBUSxDQUFDLFVBQVUsRUFBRTtZQUNuQixFQUFFLENBQUMsa0VBQWtFLEVBQUU7Z0JBQ3JFLEdBQUcsQ0FBQyxDQUFvQixVQUErQixFQUEvQixvQ0FBQSx1Q0FBK0IsRUFBL0IsNkNBQStCLEVBQS9CLElBQStCO29CQUFsRCxJQUFNLFNBQVMsd0NBQUE7b0JBQ2xCLGFBQU0sQ0FBQyxTQUFTLENBQ2QsNEJBQW9CLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxtQkFBWSxFQUFFLEVBQUUsRUFBRSxzQkFBYSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxFQUFFLENBQUMsRUFDN0csb0JBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUMsQ0FBQyxDQUFDLENBQzFDLENBQUM7aUJBQ0g7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxtRUFBbUUsRUFBRTtnQkFDdEUsR0FBRyxDQUFDLENBQW9CLFVBQStCLEVBQS9CLG9DQUFBLHVDQUErQixFQUEvQiw2Q0FBK0IsRUFBL0IsSUFBK0I7b0JBQWxELElBQU0sU0FBUyx3Q0FBQTtvQkFDbEIsYUFBTSxDQUFDLFNBQVMsQ0FDZCw0QkFBb0IsQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLG1CQUFZLEVBQUUsRUFBRSxFQUFFLHNCQUFhLEVBQUUs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