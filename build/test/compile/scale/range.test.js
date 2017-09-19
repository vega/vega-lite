"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var range_1 = require("../../../src/compile/scale/range");
var config_1 = require("../../../src/config");
var log = require("../../../src/log");
var scale_1 = require("../../../src/scale");
var type_1 = require("../../../src/type");
describe('compile/scale', function () {
    describe('parseRange()', function () {
        describe('x/y', function () {
            it('should return config.cell.width for x-continous scales by default.', function () {
                for (var _i = 0, CONTINUOUS_TO_CONTINUOUS_SCALES_1 = scale_1.CONTINUOUS_TO_CONTINUOUS_SCALES; _i < CONTINUOUS_TO_CONTINUOUS_SCALES_1.length; _i++) {
                    var scaleType = CONTINUOUS_TO_CONTINUOUS_SCALES_1[_i];
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', scaleType, type_1.QUANTITATIVE, {}, config_1.defaultConfig, true, 'point', false, 'plot_width', []).value, [0, { signal: 'plot_width' }]);
                }
            });
            it('should return config.cell.height for y-continous scales by default.', function () {
                for (var _i = 0, CONTINUOUS_TO_CONTINUOUS_SCALES_2 = scale_1.CONTINUOUS_TO_CONTINUOUS_SCALES; _i < CONTINUOUS_TO_CONTINUOUS_SCALES_2.length; _i++) {
                    var scaleType = CONTINUOUS_TO_CONTINUOUS_SCALES_2[_i];
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('y', scaleType, type_1.QUANTITATIVE, {}, config_1.defaultConfig, true, 'point', false, 'plot_height', []).value, [{ signal: 'plot_height' }, 0]);
                }
            });
            it('should not support custom range.', log.wrap(function (localLogger) {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', 'linear', type_1.QUANTITATIVE, { range: [0, 100] }, config_1.defaultConfig, true, 'point', false, 'plot_width', []).value, [0, { signal: 'plot_width' }]);
                chai_1.assert.deepEqual(localLogger.warns[0], log.message.CANNOT_USE_RANGE_WITH_POSITION);
            }));
            it('should return config.scale.rangeStep for band/point scales by default.', function () {
                for (var _i = 0, _a = ['point', 'band']; _i < _a.length; _i++) {
                    var scaleType = _a[_i];
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', scaleType, type_1.NOMINAL, {}, config_1.defaultConfig, undefined, 'point', false, 'plot_width', []).value, { step: 21 });
                }
            });
            it('should return config.scale.textXRangeStep by default for text mark\'s x band/point scales.', function () {
                for (var _i = 0, _a = ['point', 'band']; _i < _a.length; _i++) {
                    var scaleType = _a[_i];
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', scaleType, type_1.NOMINAL, {}, { scale: { textXRangeStep: 55 } }, undefined, 'text', false, 'plot_width', []).value, { step: 55 });
                }
            });
            it('should return specified rangeStep if topLevelSize is undefined for band/point scales', function () {
                for (var _i = 0, _a = ['point', 'band']; _i < _a.length; _i++) {
                    var scaleType = _a[_i];
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', scaleType, type_1.NOMINAL, { rangeStep: 23 }, config_1.defaultConfig, undefined, 'text', false, 'plot_width', []).value, { step: 23 });
                }
            });
            it('should drop rangeStep if topLevelSize is specified for band/point scales', log.wrap(function (localLogger) {
                for (var _i = 0, _a = ['point', 'band']; _i < _a.length; _i++) {
                    var scaleType = _a[_i];
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', scaleType, type_1.NOMINAL, { rangeStep: 23 }, config_1.defaultConfig, undefined, 'text', true, 'plot_width', []).value, [0, { signal: 'plot_width' }]);
                }
                chai_1.assert.equal(localLogger.warns[0], log.message.rangeStepDropped('x'));
            }));
            it('should return default topLevelSize if rangeStep is null for band/point scales', function () {
                for (var _i = 0, _a = ['point', 'band']; _i < _a.length; _i++) {
                    var scaleType = _a[_i];
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', scaleType, type_1.NOMINAL, { rangeStep: null }, config_1.defaultConfig, undefined, 'text', false, 'plot_width', []).value, [0, { signal: 'plot_width' }]);
                }
            });
            it('should return default topLevelSize if rangeStep config is null', function () {
                for (var _i = 0, _a = ['point', 'band']; _i < _a.length; _i++) {
                    var scaleType = _a[_i];
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', scaleType, type_1.NOMINAL, {}, { view: { width: 200 }, scale: { rangeStep: null } }, undefined, 'point', false, 'plot_width', []).value, [0, { signal: 'plot_width' }]);
                }
            });
            it('should return default topLevelSize for text if textXRangeStep config is null', function () {
                for (var _i = 0, _a = ['point', 'band']; _i < _a.length; _i++) {
                    var scaleType = _a[_i];
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', scaleType, type_1.NOMINAL, {}, { view: { width: 200 }, scale: { textXRangeStep: null } }, undefined, 'text', false, 'plot_width', []).value, [0, { signal: 'plot_width' }]);
                }
            });
            it('should drop rangeStep for continuous scales', function () {
                var _loop_1 = function (scaleType) {
                    log.wrap(function (localLogger) {
                        chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', scaleType, type_1.QUANTITATIVE, { rangeStep: 23 }, config_1.defaultConfig, undefined, 'text', true, 'plot_width', []).value, [0, { signal: 'plot_width' }]);
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
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('color', 'ordinal', type_1.NOMINAL, { scheme: 'warm' }, config_1.defaultConfig, undefined, 'point', false, 'plot_width', []).value, { scheme: 'warm' });
            });
            it('should use the specified scheme with extent for a nominal color field.', function () {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('color', 'ordinal', type_1.NOMINAL, { scheme: { name: 'warm', extent: [0.2, 1] } }, config_1.defaultConfig, undefined, 'point', false, 'plot_width', []).value, { scheme: 'warm', extent: [0.2, 1] });
            });
            it('should use the specified range for a nominal color field.', function () {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('color', 'ordinal', type_1.NOMINAL, { range: ['red', 'green', 'blue'] }, config_1.defaultConfig, undefined, 'point', false, 'plot_width', []).value, ['red', 'green', 'blue']);
            });
            it('should use default category range in Vega for a nominal color field.', function () {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('color', 'ordinal', type_1.NOMINAL, {}, config_1.defaultConfig, undefined, 'point', false, 'plot_width', []).value, 'category');
            });
            it('should use default ordinal range in Vega for an ordinal color field.', function () {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('color', 'ordinal', type_1.ORDINAL, {}, config_1.defaultConfig, undefined, 'point', false, 'plot_width', []).value, 'ordinal');
            });
            it('should use default ramp range in Vega for a temporal/quantitative color field.', function () {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('color', 'sequential', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'point', false, 'plot_width', []).value, 'ramp');
            });
            it('should use the specified scheme with count for a quantitative color field.', function () {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('color', 'ordinal', type_1.QUANTITATIVE, { scheme: { name: 'viridis', count: 3 } }, config_1.defaultConfig, undefined, 'point', false, 'plot_width', []).value, { scheme: 'viridis', count: 3 });
            });
        });
        describe('opacity', function () {
            it('should use default opacityRange as opacity\'s scale range.', function () {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('opacity', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'point', false, 'plot_width', []).value, [config_1.defaultConfig.scale.minOpacity, config_1.defaultConfig.scale.maxOpacity]);
            });
        });
        describe('size', function () {
            describe('bar', function () {
                it('should return [minBandSize, maxBandSize] if both are specified', function () {
                    var config = {
                        scale: { minBandSize: 2, maxBandSize: 9 }
                    };
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config, undefined, 'bar', false, 'plot_width', []).value, [2, 9]);
                });
                it('should return [continuousBandSize, xRangeStep-1] by default since min/maxSize config are not specified', function () {
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'bar', false, 'plot_width', []).value, [2, config_1.defaultConfig.scale.rangeStep - 1]);
                });
            });
            describe('tick', function () {
                it('should return [minBandSize, maxBandSize] if both are specified', function () {
                    var config = {
                        scale: { minBandSize: 4, maxBandSize: 9 }
                    };
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config, undefined, 'tick', false, 'plot_width', []).value, [4, 9]);
                });
                it('should return [(default)minBandSize, rangeStep-1] by default since maxSize config is not specified', function () {
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'tick', false, 'plot_width', []).value, [config_1.defaultConfig.scale.minBandSize, config_1.defaultConfig.scale.rangeStep - 1]);
                });
            });
            describe('text', function () {
                it('should return [minFontSize, maxFontSize]', function () {
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'text', false, 'plot_width', []).value, [config_1.defaultConfig.scale.minFontSize, config_1.defaultConfig.scale.maxFontSize]);
                });
            });
            describe('rule', function () {
                it('should return [minStrokeWidth, maxStrokeWidth]', function () {
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'rule', false, 'plot_width', []).value, [config_1.defaultConfig.scale.minStrokeWidth, config_1.defaultConfig.scale.maxStrokeWidth]);
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
                        chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config, undefined, m, false, 'plot_width', []).value, [5, 25]);
                    }
                });
                it('should return [0, (minBandSize-2)^2] if both x and y are discrete and size is quantitative (thus use zero=true, by default)', function () {
                    for (var _i = 0, _a = ['point', 'square', 'circle']; _i < _a.length; _i++) {
                        var m = _a[_i];
                        chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, true, m, false, 'plot_width', [11, 13] // xyRangeSteps
                        ).value, [0, 81]);
                    }
                });
                it('should return [9, (minBandSize-2)^2] if both x and y are discrete and size is not quantitative (thus use zero=false, by default)', function () {
                    for (var _i = 0, _a = ['point', 'square', 'circle']; _i < _a.length; _i++) {
                        var m = _a[_i];
                        chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, false, m, false, 'plot_width', [11, 13] // xyRangeSteps
                        ).value, [9, 81]);
                    }
                });
                it('should return [9, (minBandSize-2)^2] if both x and y are discrete and size is quantitative but use zero=false', function () {
                    for (var _i = 0, _a = ['point', 'square', 'circle']; _i < _a.length; _i++) {
                        var m = _a[_i];
                        chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, false, m, false, 'plot_width', [11, 13] // xyRangeSteps
                        ).value, [9, 81]);
                    }
                });
                it('should return [0, (xRangeStep-2)^2] if x is discrete and y is continuous and size is quantitative (thus use zero=true, by default)', function () {
                    for (var _i = 0, _a = ['point', 'square', 'circle']; _i < _a.length; _i++) {
                        var m = _a[_i];
                        chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, true, m, false, 'plot_width', [11] // xyRangeSteps only have one value
                        ).value, [0, 81]);
                    }
                });
            });
        });
        describe('shape', function () {
            it('should use default symbol range in Vega as shape\'s scale range.', function () {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('shape', 'ordinal', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'point', false, 'plot_width', []).value, 'symbol');
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZ2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9zY2FsZS9yYW5nZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUU1QiwwREFBc0U7QUFDdEUsOENBQWtEO0FBQ2xELHNDQUF3QztBQUV4Qyw0Q0FBOEU7QUFDOUUsMENBQWlFO0FBRWpFLFFBQVEsQ0FBQyxlQUFlLEVBQUU7SUFDeEIsUUFBUSxDQUFDLGNBQWMsRUFBRTtRQUN2QixRQUFRLENBQUMsS0FBSyxFQUFFO1lBQ2QsRUFBRSxDQUFDLG9FQUFvRSxFQUFFO2dCQUN2RSxHQUFHLENBQUMsQ0FBb0IsVUFBK0IsRUFBL0Isb0NBQUEsdUNBQStCLEVBQS9CLDZDQUErQixFQUEvQixJQUErQjtvQkFBbEQsSUFBTSxTQUFTLHdDQUFBO29CQUNsQixhQUFNLENBQUMsU0FBUyxDQUNkLDRCQUFvQixDQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsbUJBQVksRUFBRSxFQUFFLEVBQUUsc0JBQWEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUNuSCxDQUFDLENBQUMsRUFBRSxFQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUMsQ0FBQyxDQUM1QixDQUFDO2lCQUNIO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMscUVBQXFFLEVBQUU7Z0JBQ3hFLEdBQUcsQ0FBQyxDQUFvQixVQUErQixFQUEvQixvQ0FBQSx1Q0FBK0IsRUFBL0IsNkNBQStCLEVBQS9CLElBQStCO29CQUFsRCxJQUFNLFNBQVMsd0NBQUE7b0JBQ2xCLGFBQU0sQ0FBQyxTQUFTLENBQ2QsNEJBQW9CLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxtQkFBWSxFQUFFLEVBQUUsRUFBRSxzQkFBYSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUs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