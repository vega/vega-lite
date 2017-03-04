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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZ2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9zY2FsZS9yYW5nZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4Qjs7O0FBRTlCLDZCQUE0QjtBQUU1QiwwREFBb0Y7QUFFcEYsOENBQWtEO0FBQ2xELHNDQUF3QztBQUV4Qyw0Q0FBOEU7QUFDOUUsMENBQWlFO0FBRWpFLFFBQVEsQ0FBQyxlQUFlLEVBQUU7SUFDeEIsUUFBUSxDQUFDLGNBQWMsRUFBRTtRQUN2QixFQUFFLENBQUMsa0NBQWtDLEVBQUU7WUFDckMsYUFBTSxDQUFDLFNBQVMsQ0FBQyxrQkFBVSxDQUFDLEVBQUMsU0FBUyxFQUFFLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztRQUM5RCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRTtZQUN2QyxhQUFNLENBQUMsU0FBUyxDQUFDLGtCQUFVLENBQUMsRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFDLENBQUMsRUFBRSxFQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO1FBQ3pFLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHNEQUFzRCxFQUFFO1lBQ3pELGFBQU0sQ0FBQyxTQUFTLENBQUMsa0JBQVUsQ0FBQyxFQUFDLE1BQU0sRUFBRSxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFHLENBQUMsRUFBQyxFQUFDLENBQUMsRUFBRSxFQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDdEcsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsdURBQXVELEVBQUU7WUFDMUQsYUFBTSxDQUFDLFNBQVMsQ0FBQyxrQkFBVSxDQUFDLEVBQUMsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFFLFNB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