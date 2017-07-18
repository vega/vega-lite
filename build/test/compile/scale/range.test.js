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
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', scaleType, type_1.QUANTITATIVE, {}, config_1.defaultConfig, true, 'point', undefined, []).value, [0, 200]);
                }
            });
            it('should return config.cell.height for y-continous scales by default.', function () {
                for (var _i = 0, CONTINUOUS_TO_CONTINUOUS_SCALES_2 = scale_1.CONTINUOUS_TO_CONTINUOUS_SCALES; _i < CONTINUOUS_TO_CONTINUOUS_SCALES_2.length; _i++) {
                    var scaleType = CONTINUOUS_TO_CONTINUOUS_SCALES_2[_i];
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('y', scaleType, type_1.QUANTITATIVE, {}, config_1.defaultConfig, true, 'point', undefined, []).value, [200, 0]);
                }
            });
            it('should not support custom range.', log.wrap(function (localLogger) {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', 'linear', type_1.QUANTITATIVE, { range: [0, 100] }, config_1.defaultConfig, true, 'point', undefined, []).value, [0, 200]);
                chai_1.assert.deepEqual(localLogger.warns[0], log.message.CANNOT_USE_RANGE_WITH_POSITION);
            }));
            it('should return config.scale.rangeStep for band/point scales by default.', function () {
                for (var _i = 0, _a = ['point', 'band']; _i < _a.length; _i++) {
                    var scaleType = _a[_i];
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', scaleType, type_1.NOMINAL, {}, config_1.defaultConfig, undefined, 'point', undefined, []).value, { step: 21 });
                }
            });
            it('should return config.scale.textXRangeStep by default for text mark\'s x band/point scales.', function () {
                for (var _i = 0, _a = ['point', 'band']; _i < _a.length; _i++) {
                    var scaleType = _a[_i];
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', scaleType, type_1.NOMINAL, {}, { scale: { textXRangeStep: 55 } }, undefined, 'text', undefined, []).value, { step: 55 });
                }
            });
            it('should return specified rangeStep if topLevelSize is undefined for band/point scales', function () {
                for (var _i = 0, _a = ['point', 'band']; _i < _a.length; _i++) {
                    var scaleType = _a[_i];
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', scaleType, type_1.NOMINAL, { rangeStep: 23 }, config_1.defaultConfig, undefined, 'text', undefined, []).value, { step: 23 });
                }
            });
            it('should drop rangeStep if topLevelSize is specified for band/point scales', log.wrap(function (localLogger) {
                for (var _i = 0, _a = ['point', 'band']; _i < _a.length; _i++) {
                    var scaleType = _a[_i];
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', scaleType, type_1.NOMINAL, { rangeStep: 23 }, config_1.defaultConfig, undefined, 'text', 123, []).value, [0, 123]);
                }
                chai_1.assert.equal(localLogger.warns[0], log.message.rangeStepDropped('x'));
            }));
            it('should return default topLevelSize if rangeStep is null for band/point scales', function () {
                for (var _i = 0, _a = ['point', 'band']; _i < _a.length; _i++) {
                    var scaleType = _a[_i];
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', scaleType, type_1.NOMINAL, { rangeStep: null }, config_1.defaultConfig, undefined, 'text', undefined, []).value, [0, 200]);
                }
            });
            it('should return default topLevelSize if rangeStep config is null', function () {
                for (var _i = 0, _a = ['point', 'band']; _i < _a.length; _i++) {
                    var scaleType = _a[_i];
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', scaleType, type_1.NOMINAL, {}, { cell: { width: 200 }, scale: { rangeStep: null } }, undefined, 'point', undefined, []).value, [0, 200]);
                }
            });
            it('should return default topLevelSize for text if textXRangeStep config is null', function () {
                for (var _i = 0, _a = ['point', 'band']; _i < _a.length; _i++) {
                    var scaleType = _a[_i];
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', scaleType, type_1.NOMINAL, {}, { cell: { width: 200 }, scale: { textXRangeStep: null } }, undefined, 'text', undefined, []).value, [0, 200]);
                }
            });
            it('should drop rangeStep for continuous scales', function () {
                var _loop_1 = function (scaleType) {
                    log.wrap(function (localLogger) {
                        chai_1.assert.deepEqual(range_1.parseRangeForChannel('x', scaleType, type_1.QUANTITATIVE, { rangeStep: 23 }, config_1.defaultConfig, undefined, 'text', 123, []).value, [0, 123]);
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
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('color', 'ordinal', type_1.NOMINAL, { scheme: 'warm' }, config_1.defaultConfig, undefined, 'point', undefined, []).value, { scheme: 'warm' });
            });
            it('should use the specified scheme with extent for a nominal color field.', function () {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('color', 'ordinal', type_1.NOMINAL, { scheme: { name: 'warm', extent: [0.2, 1] } }, config_1.defaultConfig, undefined, 'point', undefined, []).value, { scheme: 'warm', extent: [0.2, 1] });
            });
            it('should use the specified range for a nominal color field.', function () {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('color', 'ordinal', type_1.NOMINAL, { range: ['red', 'green', 'blue'] }, config_1.defaultConfig, undefined, 'point', undefined, []).value, ['red', 'green', 'blue']);
            });
            it('should use default category range in Vega for a nominal color field.', function () {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('color', 'ordinal', type_1.NOMINAL, {}, config_1.defaultConfig, undefined, 'point', undefined, []).value, 'category');
            });
            it('should use default ordinal range in Vega for an ordinal color field.', function () {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('color', 'ordinal', type_1.ORDINAL, {}, config_1.defaultConfig, undefined, 'point', undefined, []).value, 'ordinal');
            });
            it('should use default ramp range in Vega for a temporal/quantitative color field.', function () {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('color', 'sequential', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'point', undefined, []).value, 'ramp');
            });
            it('should use the specified scheme with count for a quantitative color field.', function () {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('color', 'ordinal', type_1.QUANTITATIVE, { scheme: { name: 'viridis', count: 3 } }, config_1.defaultConfig, undefined, 'point', undefined, []).value, { scheme: 'viridis', count: 3 });
            });
        });
        describe('opacity', function () {
            it('should use default opacityRange as opacity\'s scale range.', function () {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('opacity', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'point', undefined, []).value, [config_1.defaultConfig.scale.minOpacity, config_1.defaultConfig.scale.maxOpacity]);
            });
        });
        describe('size', function () {
            describe('bar', function () {
                it('should return [minBandSize, maxBandSize] if both are specified', function () {
                    var config = {
                        scale: { minBandSize: 2, maxBandSize: 9 }
                    };
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config, undefined, 'bar', undefined, []).value, [2, 9]);
                });
                it('should return [continuousBandSize, xRangeStep-1] by default since min/maxSize config are not specified', function () {
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'bar', undefined, []).value, [config_1.defaultConfig.bar.continuousBandSize, config_1.defaultConfig.scale.rangeStep - 1]);
                });
            });
            describe('tick', function () {
                it('should return [minBandSize, maxBandSize] if both are specified', function () {
                    var config = {
                        scale: { minBandSize: 4, maxBandSize: 9 }
                    };
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config, undefined, 'tick', undefined, []).value, [4, 9]);
                });
                it('should return [(default)minBandSize, rangeStep-1] by default since maxSize config is not specified', function () {
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'tick', undefined, []).value, [config_1.defaultConfig.scale.minBandSize, config_1.defaultConfig.scale.rangeStep - 1]);
                });
            });
            describe('text', function () {
                it('should return [minFontSize, maxFontSize]', function () {
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'text', undefined, []).value, [config_1.defaultConfig.scale.minFontSize, config_1.defaultConfig.scale.maxFontSize]);
                });
            });
            describe('rule', function () {
                it('should return [minStrokeWidth, maxStrokeWidth]', function () {
                    chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'rule', undefined, []).value, [config_1.defaultConfig.scale.minStrokeWidth, config_1.defaultConfig.scale.maxStrokeWidth]);
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
                        chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config, undefined, m, undefined, []).value, [5, 25]);
                    }
                });
                it('should return [0, (minBandSize-2)^2] if both x and y are discrete and size is quantitative (thus use zero=true, by default)', function () {
                    for (var _i = 0, _a = ['point', 'square', 'circle']; _i < _a.length; _i++) {
                        var m = _a[_i];
                        chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, true, m, undefined, [11, 13] // xyRangeSteps
                        ).value, [0, 81]);
                    }
                });
                it('should return [9, (minBandSize-2)^2] if both x and y are discrete and size is not quantitative (thus use zero=false, by default)', function () {
                    for (var _i = 0, _a = ['point', 'square', 'circle']; _i < _a.length; _i++) {
                        var m = _a[_i];
                        chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, false, m, undefined, [11, 13] // xyRangeSteps
                        ).value, [9, 81]);
                    }
                });
                it('should return [9, (minBandSize-2)^2] if both x and y are discrete and size is quantitative but use zero=false', function () {
                    for (var _i = 0, _a = ['point', 'square', 'circle']; _i < _a.length; _i++) {
                        var m = _a[_i];
                        chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, false, m, undefined, [11, 13] // xyRangeSteps
                        ).value, [9, 81]);
                    }
                });
                it('should return [0, (xRangeStep-2)^2] if x is discrete and y is continuous and size is quantitative (thus use zero=true, by default)', function () {
                    for (var _i = 0, _a = ['point', 'square', 'circle']; _i < _a.length; _i++) {
                        var m = _a[_i];
                        chai_1.assert.deepEqual(range_1.parseRangeForChannel('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, true, m, undefined, [11] // xyRangeSteps only have one value
                        ).value, [0, 81]);
                    }
                });
            });
        });
        describe('shape', function () {
            it('should use default symbol range in Vega as shape\'s scale range.', function () {
                chai_1.assert.deepEqual(range_1.parseRangeForChannel('shape', 'ordinal', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'point', undefined, []).value, 'symbol');
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZ2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9zY2FsZS9yYW5nZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUU1QiwwREFBb0Y7QUFJcEYsOENBQWtEO0FBQ2xELHNDQUF3QztBQUV4Qyw0Q0FBcUY7QUFDckYsMENBQWlFO0FBR2pFLFFBQVEsQ0FBQyxlQUFlLEVBQUU7SUFDeEIsUUFBUSxDQUFDLGNBQWMsRUFBRTtRQUN2QixRQUFRLENBQUMsS0FBSyxFQUFFO1lBQ2QsRUFBRSxDQUFDLG9FQUFvRSxFQUFFO2dCQUN2RSxHQUFHLENBQUMsQ0FBb0IsVUFBK0IsRUFBL0Isb0NBQUEsdUNBQStCLEVBQS9CLDZDQUErQixFQUEvQixJQUErQjtvQkFBbEQsSUFBTSxTQUFTLHdDQUFBO29CQUNsQixhQUFNLENBQUMsU0FBUyxDQUNkLDRCQUFvQixDQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsbUJBQVksRUFBRSxFQUFFLEVBQUUsc0JBQWEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQ3pHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUNULENBQUM7aUJBQ0g7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxxRUFBcUUsRUFBRTtnQkFDeEUsR0FBRyxDQUFDLENBQW9CLFVBQStCLEVBQS9CLG9DQUFBLHVDQUErQixFQUEvQiw2Q0FBK0IsRUFBL0IsSUFBK0I7b0JBQWxELElBQU0sU0FBUyx3Q0FBQTtvQkFDbEIsYUFBTSxDQUFDLFNBQVMsQ0FDZCw0QkFBb0IsQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLG1CQUFZLEVBQUUsRUFBRSxFQUFFLHNCQUFhLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxF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