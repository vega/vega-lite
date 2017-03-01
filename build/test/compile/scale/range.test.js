/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var range_1 = require("../../../src/compile/scale/range");
var config_1 = require("../../../src/config");
var log = require("../../../src/log");
var scale_1 = require("../../../src/scale");
var type_1 = require("../../../src/type");
describe('compile/scale', function () {
    describe('parseRange()', function () {
        it('should return correct range.step', function () {
            chai_1.assert.deepEqual(range_1.parseRange({ rangeStep: 123 }), { step: 123 });
        });
        it('should return correct range.scheme', function () {
            chai_1.assert.deepEqual(range_1.parseRange({ scheme: 'viridis' }), { scheme: 'viridis' });
        });
        it('should return correct range scheme object with count', function () {
            chai_1.assert.deepEqual(range_1.parseRange({ scheme: { name: 'viridis', count: 6 } }), { scheme: 'viridis', count: 6 });
        });
        it('should return correct range scheme object with extent', function () {
            chai_1.assert.deepEqual(range_1.parseRange({ scheme: { name: 'viridis', extent: [0.1, 0.9] } }), { scheme: 'viridis', extent: [0.1, 0.9] });
        });
        it('should return correct range', function () {
            chai_1.assert.deepEqual(range_1.parseRange({ range: 'category' }), 'category');
        });
    });
    describe('rangeMixins()', function () {
        describe('row', function () {
            it('should always return {range: height}.', function () {
                chai_1.assert.deepEqual(range_1.default('row', 'point', type_1.NOMINAL, {}, config_1.defaultConfig, false, undefined, undefined, []), { range: 'height' });
            });
        });
        describe('column', function () {
            it('should always return {range: width}.', function () {
                chai_1.assert.deepEqual(range_1.default('column', 'point', type_1.NOMINAL, {}, config_1.defaultConfig, false, undefined, undefined, []), { range: 'width' });
            });
        });
        describe('x/y', function () {
            it('should return config.cell.width for x-continous scales by default.', function () {
                for (var _i = 0, CONTINUOUS_TO_CONTINUOUS_SCALES_1 = scale_1.CONTINUOUS_TO_CONTINUOUS_SCALES; _i < CONTINUOUS_TO_CONTINUOUS_SCALES_1.length; _i++) {
                    var scaleType = CONTINUOUS_TO_CONTINUOUS_SCALES_1[_i];
                    chai_1.assert.deepEqual(range_1.default('x', scaleType, type_1.QUANTITATIVE, {}, config_1.defaultConfig, true, 'point', undefined, []), { range: [0, 200] });
                }
            });
            it('should return config.cell.height for y-continous scales by default.', function () {
                for (var _i = 0, CONTINUOUS_TO_CONTINUOUS_SCALES_2 = scale_1.CONTINUOUS_TO_CONTINUOUS_SCALES; _i < CONTINUOUS_TO_CONTINUOUS_SCALES_2.length; _i++) {
                    var scaleType = CONTINUOUS_TO_CONTINUOUS_SCALES_2[_i];
                    chai_1.assert.deepEqual(range_1.default('y', scaleType, type_1.QUANTITATIVE, {}, config_1.defaultConfig, true, 'point', undefined, []), { range: [200, 0] });
                }
            });
            it('should not support custom range.', log.wrap(function (localLogger) {
                chai_1.assert.deepEqual(range_1.default('x', 'linear', type_1.QUANTITATIVE, { range: [0, 100] }, config_1.defaultConfig, true, 'point', undefined, []), { range: [0, 200] });
                chai_1.assert(localLogger.warns[0], log.message.CANNOT_USE_RANGE_WITH_POSITION);
            }));
            it('should return config.scale.rangeStep for band/point scales by default.', function () {
                for (var _i = 0, _a = ['point', 'band']; _i < _a.length; _i++) {
                    var scaleType = _a[_i];
                    chai_1.assert.deepEqual(range_1.default('x', scaleType, type_1.NOMINAL, {}, config_1.defaultConfig, undefined, 'point', undefined, []), { rangeStep: 21 });
                }
            });
            it('should return config.scale.textXRangeStep by default for text mark\'s x band/point scales.', function () {
                for (var _i = 0, _a = ['point', 'band']; _i < _a.length; _i++) {
                    var scaleType = _a[_i];
                    chai_1.assert.deepEqual(range_1.default('x', scaleType, type_1.NOMINAL, {}, { scale: { textXRangeStep: 55 } }, undefined, 'text', undefined, []), { rangeStep: 55 });
                }
            });
            it('should return specified rangeStep if topLevelSize is undefined for band/point scales', function () {
                for (var _i = 0, _a = ['point', 'band']; _i < _a.length; _i++) {
                    var scaleType = _a[_i];
                    chai_1.assert.deepEqual(range_1.default('x', scaleType, type_1.NOMINAL, { rangeStep: 23 }, config_1.defaultConfig, undefined, 'text', undefined, []), { rangeStep: 23 });
                }
            });
            it('should drop rangeStep if topLevelSize is specified for band/point scales', log.wrap(function (localLogger) {
                for (var _i = 0, _a = ['point', 'band']; _i < _a.length; _i++) {
                    var scaleType = _a[_i];
                    chai_1.assert.deepEqual(range_1.default('x', scaleType, type_1.NOMINAL, { rangeStep: 23 }, config_1.defaultConfig, undefined, 'text', 123, []), { range: [0, 123] });
                }
                chai_1.assert.equal(localLogger.warns[0], log.message.rangeStepDropped('x'));
            }));
            it('should return default topLevelSize if rangeStep is null for band/point scales', function () {
                for (var _i = 0, _a = ['point', 'band']; _i < _a.length; _i++) {
                    var scaleType = _a[_i];
                    chai_1.assert.deepEqual(range_1.default('x', scaleType, type_1.NOMINAL, { rangeStep: null }, config_1.defaultConfig, undefined, 'text', undefined, []), { range: [0, 200] });
                }
            });
            it('should return default topLevelSize if rangeStep config is null', function () {
                for (var _i = 0, _a = ['point', 'band']; _i < _a.length; _i++) {
                    var scaleType = _a[_i];
                    chai_1.assert.deepEqual(range_1.default('x', scaleType, type_1.NOMINAL, {}, { cell: { width: 200 }, scale: { rangeStep: null } }, undefined, 'point', undefined, []), { range: [0, 200] });
                }
            });
            it('should return default topLevelSize for text if textXRangeStep config is null', function () {
                for (var _i = 0, _a = ['point', 'band']; _i < _a.length; _i++) {
                    var scaleType = _a[_i];
                    chai_1.assert.deepEqual(range_1.default('x', scaleType, type_1.NOMINAL, {}, { cell: { width: 200 }, scale: { textXRangeStep: null } }, undefined, 'text', undefined, []), { range: [0, 200] });
                }
            });
            it('should drop rangeStep for continuous scales', function () {
                var _loop_1 = function (scaleType) {
                    log.wrap(function (localLogger) {
                        chai_1.assert.deepEqual(range_1.default('x', scaleType, type_1.QUANTITATIVE, { rangeStep: 23 }, config_1.defaultConfig, undefined, 'text', 123, []), { range: [0, 123] });
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
                chai_1.assert.deepEqual(range_1.default('color', 'ordinal', type_1.NOMINAL, { scheme: 'warm' }, config_1.defaultConfig, undefined, 'point', undefined, []), { scheme: 'warm' });
            });
            it('should use the specified scheme with extent for a nominal color field.', function () {
                chai_1.assert.deepEqual(range_1.default('color', 'ordinal', type_1.NOMINAL, { scheme: { name: 'warm', extent: [0.2, 1] } }, config_1.defaultConfig, undefined, 'point', undefined, []), { scheme: { name: 'warm', extent: [0.2, 1] } });
            });
            it('should use the specified range for a nominal color field.', function () {
                chai_1.assert.deepEqual(range_1.default('color', 'ordinal', type_1.NOMINAL, { range: ['red', 'green', 'blue'] }, config_1.defaultConfig, undefined, 'point', undefined, []), { range: ['red', 'green', 'blue'] });
            });
            it('should use default category range in Vega for a nominal color field.', function () {
                chai_1.assert.deepEqual(range_1.default('color', 'ordinal', type_1.NOMINAL, {}, config_1.defaultConfig, undefined, 'point', undefined, []), { range: 'category' });
            });
            it('should use default ordinal range in Vega for an ordinal color field.', function () {
                chai_1.assert.deepEqual(range_1.default('color', 'ordinal', type_1.ORDINAL, {}, config_1.defaultConfig, undefined, 'point', undefined, []), { range: 'ordinal' });
            });
            it('should use default ramp range in Vega for a temporal/quantitative color field.', function () {
                chai_1.assert.deepEqual(range_1.default('color', 'sequential', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'point', undefined, []), { range: 'ramp' });
            });
            it('should use the specified scheme with count for a quantitative color field.', function () {
                chai_1.assert.deepEqual(range_1.default('color', 'ordinal', type_1.QUANTITATIVE, { scheme: { name: 'viridis', count: 3 } }, config_1.defaultConfig, undefined, 'point', undefined, []), { scheme: { name: 'viridis', count: 3 } });
            });
        });
        describe('opacity', function () {
            it('should use default opacityRange as opacity\'s scale range.', function () {
                chai_1.assert.deepEqual(range_1.default('opacity', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'point', undefined, []), { range: [config_1.defaultConfig.scale.minOpacity, config_1.defaultConfig.scale.maxOpacity] });
            });
        });
        describe('size', function () {
            describe('bar', function () {
                it('should return [minBandSize, maxBandSize] if both are specified', function () {
                    var config = {
                        scale: { minBandSize: 2, maxBandSize: 9 }
                    };
                    chai_1.assert.deepEqual(range_1.default('size', 'linear', type_1.QUANTITATIVE, {}, config, undefined, 'bar', undefined, []), { range: [2, 9] });
                });
                it('should return [continuousBandSize, xRangeStep-1] by default since min/maxSize config are not specified', function () {
                    chai_1.assert.deepEqual(range_1.default('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'bar', undefined, []), { range: [config_1.defaultConfig.bar.continuousBandSize, config_1.defaultConfig.scale.rangeStep - 1] });
                });
            });
            describe('tick', function () {
                it('should return [minBandSize, maxBandSize] if both are specified', function () {
                    var config = {
                        scale: { minBandSize: 4, maxBandSize: 9 }
                    };
                    chai_1.assert.deepEqual(range_1.default('size', 'linear', type_1.QUANTITATIVE, {}, config, undefined, 'tick', undefined, []), { range: [4, 9] });
                });
                it('should return [(default)minBandSize, rangeStep-1] by default since maxSize config is not specified', function () {
                    chai_1.assert.deepEqual(range_1.default('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'tick', undefined, []), { range: [config_1.defaultConfig.scale.minBandSize, config_1.defaultConfig.scale.rangeStep - 1] });
                });
            });
            describe('text', function () {
                it('should return [minFontSize, maxFontSize]', function () {
                    chai_1.assert.deepEqual(range_1.default('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'text', undefined, []), { range: [config_1.defaultConfig.scale.minFontSize, config_1.defaultConfig.scale.maxFontSize] });
                });
            });
            describe('rule', function () {
                it('should return [minStrokeWidth, maxStrokeWidth]', function () {
                    chai_1.assert.deepEqual(range_1.default('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'rule', undefined, []), { range: [config_1.defaultConfig.scale.minStrokeWidth, config_1.defaultConfig.scale.maxStrokeWidth] });
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
                        chai_1.assert.deepEqual(range_1.default('size', 'linear', type_1.QUANTITATIVE, {}, config, undefined, m, undefined, []), { range: [5, 25] });
                    }
                });
                it('should return [0, (minBandSize-2)^2] if both x and y are discrete and size is quantitative (thus use zero=true, by default)', function () {
                    for (var _i = 0, _a = ['point', 'square', 'circle']; _i < _a.length; _i++) {
                        var m = _a[_i];
                        chai_1.assert.deepEqual(range_1.default('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, true, m, undefined, [11, 13] // xyRangeSteps
                        ), { range: [0, 81] });
                    }
                });
                it('should return [9, (minBandSize-2)^2] if both x and y are discrete and size is not quantitative (thus use zero=false, by default)', function () {
                    for (var _i = 0, _a = ['point', 'square', 'circle']; _i < _a.length; _i++) {
                        var m = _a[_i];
                        chai_1.assert.deepEqual(range_1.default('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, false, m, undefined, [11, 13] // xyRangeSteps
                        ), { range: [9, 81] });
                    }
                });
                it('should return [9, (minBandSize-2)^2] if both x and y are discrete and size is quantitative but use zero=false', function () {
                    for (var _i = 0, _a = ['point', 'square', 'circle']; _i < _a.length; _i++) {
                        var m = _a[_i];
                        chai_1.assert.deepEqual(range_1.default('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, false, m, undefined, [11, 13] // xyRangeSteps
                        ), { range: [9, 81] });
                    }
                });
                it('should return [0, (xRangeStep-2)^2] if x is discrete and y is continuous and size is quantitative (thus use zero=true, by default)', function () {
                    for (var _i = 0, _a = ['point', 'square', 'circle']; _i < _a.length; _i++) {
                        var m = _a[_i];
                        chai_1.assert.deepEqual(range_1.default('size', 'linear', type_1.QUANTITATIVE, {}, config_1.defaultConfig, true, m, undefined, [11] // xyRangeSteps only have one value
                        ), { range: [0, 81] });
                    }
                });
            });
        });
        describe('shape', function () {
            it('should use default symbol range in Vega as shape\'s scale range.', function () {
                chai_1.assert.deepEqual(range_1.default('shape', 'ordinal', type_1.QUANTITATIVE, {}, config_1.defaultConfig, undefined, 'point', undefined, []), { range: 'symbol' });
            });
        });
    });
});
//# sourceMappingURL=range.test.js.map