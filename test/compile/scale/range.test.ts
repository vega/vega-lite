/* tslint:disable:quotemark */

import {assert} from 'chai';

// TODO: After refactor, we should not call parseScaleComponent simply to test rangeMixins!
import parseScales from '../../../src/compile/scale/parse';
import {rangeStep} from '../../../src/compile/scale/range';

import * as log from '../../../src/log';
import {X} from '../../../src/channel';
import * as mark from '../../../src/mark';
import {Mark} from '../../../src/mark';
import {defaultScaleConfig} from '../../../src/scale';
import {ExtendedUnitSpec} from '../../../src/spec';
import {Type} from '../../../src/type';
import {parseUnitModel} from '../../util';

describe('compile/scale', () => {
  describe('rangeMixins()', function() {
    describe('row', function() {
      // TODO:
    });

    describe('column', function() {
      // TODO:
    });

    describe('x', function() {
      // TODO: X
    });

    describe('y', function() {
      // TODO: Y
    });

    describe('color', function() {
      it('should use default nominalColorScheme for a nominal color field.', () => {
        const model = parseUnitModel({
          "data": {"url": "data/cars.json"},
          "mark": "point",
          "encoding": {
            "color": {"field": "Origin", "type": "nominal"}
          }
        });
        const scales = parseScales(model)['color'];
        assert.deepEqual(scales.main.scheme, mark.defaultMarkConfig.nominalColorScheme);
      });

      it('should use default sequentialColorSchema for a ordinal/temporal/quantitative color field.', () => {
        for (let type of ['ordinal', 'temporal', 'quantitative'] as Type[]) {
          const model = parseUnitModel({
            "data": {"url": "data/cars.json"},
            "mark": "point",
            "encoding": {
              "color": {"field": "Origin", "type": type}
            }
          });
          const scales = parseScales(model)['color'];
          assert.deepEqual(scales.main.scheme, mark.defaultMarkConfig.sequentialColorScheme);
        }
      });
    });

    describe('opacity', function() {
      it('should use default opacityRange as opacity\'s scale range.', () => {
        const model = parseUnitModel({
          "data": {"url": "data/cars.json"},
          "mark": "point",
          "encoding": {
            "opacity": {"field": "Acceleration", "type": "quantitative"}
          }
        });
        const scales = parseScales(model)['opacity'];
        assert.deepEqual(scales.main.range, [mark.defaultMarkConfig.minOpacity, mark.defaultMarkConfig.maxOpacity]);
      });
    });

    describe('size', function() {
      describe('bar', function() {
        it('should return [minBandSize, maxBandSize] if both are specified', () => {
          const model = parseUnitModel({
            "data": {"url": "data/cars.json"},
            "mark": "bar",
            "encoding": {
              "y": {"field": "Acceleration", "type": "quantitative"},
              "x": {"field": "Cylinders", "type": "ordinal", "scale": {"rangeStep": 11}},
              // not truly ordinal, just say ordinal for the sake of testing
              "size": {"field": "Origin", "type": "ordinal"}
            },
            config: {
              bar: {
                minBandSize: 2,
                maxBandSize: 9
              }
            }
          });
          const scales = parseScales(model)['size'];
          assert.deepEqual(scales.main.range, [2, 9]);
        });

        it('should return [continuousBandSize, bandWidth-1] if min/maxBarSize are not specified', () => {
          const model = parseUnitModel({
            "data": {"url": "data/cars.json"},
            "mark": "bar",
            "encoding": {
              "y": {"field": "Acceleration", "type": "quantitative"},
              "x": {"field": "Cylinders", "type": "ordinal", "scale": {"rangeStep": 11}},
              // not truly ordinal, just say ordinal for the sake of testing
              "size": {"field": "Origin", "type": "ordinal"}
            }
          });
          const scales = parseScales(model)['size'];
          assert.deepEqual(scales.main.range, [mark.defaultBarConfig.continuousBandSize, 10]);
        });
      });

      describe('tick', function() {
        it('should return [minBandSize, maxBandSize] if both are specified', () => {
          const model = parseUnitModel({
            "data": {"url": "data/cars.json"},
            "mark": "tick",
            "encoding": {
              // not truly ordinal, just say ordinal for the sake of testing
              "size": {"field": "Origin", "type": "ordinal"}
            },
            config: {
              tick: {
                minBandSize: 4,
                maxBandSize: 9
              }
            }
          });
          const scales = parseScales(model)['size'];
          assert.deepEqual(scales.main.range, [4, 9]);
        });

        it('should return [(default)minBandSize, bandWidth-1] if min/maxBarSize are not specified', () => {
          const model = parseUnitModel({
            "data": {"url": "data/cars.json"},
            "mark": "tick",
            "encoding": {
              "y": {"field": "Acceleration", "type": "quantitative"},
              "x": {"field": "Cylinders", "type": "ordinal", "scale": {"rangeStep": 11}},
              // not truly ordinal, just say ordinal for the sake of testing
              "size": {"field": "Origin", "type": "ordinal"}
            }
          });
          const scales = parseScales(model)['size'];
          assert.deepEqual(scales.main.range, [mark.defaultTickConfig.minBandSize, 20]);
        });
      });

      describe('text', function() {
        it('should return [minFontSize, maxFontSize]', () => {
          const model = parseUnitModel({
            "data": {"url": "data/cars.json"},
            "mark": "text",
            "encoding": {
              // not truly ordinal, just say ordinal for the sake of testing
              "size": {"field": "Origin", "type": "ordinal"}
            }
          });
          const scales = parseScales(model)['size'];
          assert.deepEqual(scales.main.range, [mark.defaultTextConfig.minFontSize, mark.defaultTextConfig.maxFontSize]);
        });
      });

      describe('rule', function() {
        it('should return [minStrokeWidth, maxStrokeWidth]', () => {
          const model = parseUnitModel({
            "data": {"url": "data/cars.json"},
            "mark": "rule",
            "encoding": {
              "y": {"field": "Acceleration", "type": "quantitative"},
              // not truly ordinal, just say ordinal for the sake of testing
              "size": {"field": "Origin", "type": "ordinal"}
            }
          });
          const scales = parseScales(model)['size'];
          assert.deepEqual(scales.main.range, [mark.defaultRuleConfig.minStrokeWidth, mark.defaultRuleConfig.maxStrokeWidth]);
        });
      });

      describe('point, square, circle', function() {
        it('should return [minSize, maxSize]', () => {
          for (let m of ['point', 'square', 'circle'] as Mark[]) {
            let spec: ExtendedUnitSpec = {
              "data": {"url": "data/cars.json"},
              "mark": m,
              "encoding": {
                "y": {"field": "Acceleration", "type": "quantitative"},
                // not truly ordinal, just say ordinal for the sake of testing
                "size": {"field": "Origin", "type": "ordinal"}
              },
              config: {}
            };
            spec.config[m] = {
              minSize: 5,
              maxSize: 25
            };
            const model = parseUnitModel(spec);
            const scales = parseScales(model)['size'];
            assert.deepEqual(scales.main.range, [5, 25]);
          }
        });

        it('should return [0, (minBandSize-2)^2] if both x and y are discrete and size is quantitative (thus use zero=true, by default)', () => {
          // TODO: replace this test with something more local
          const model = parseUnitModel({
            "data": {"url": "data/cars.json"},
            "mark": "point",
            "encoding": {
              "y": {"field": "Origin", "type": "ordinal", "scale": {"rangeStep": 11}},
              "x": {"field": "Cylinders", "type": "ordinal", "scale": {"rangeStep": 13}},
              "size": {"aggregate": "mean", "field": "Horsepower", "type": "quantitative"}
            }
          });
          const scales = parseScales(model)['size'];
          assert.deepEqual(scales.main.range, [0, 81]);
        });

        it('should return [9, (minBandSize-2)^2] if both x and y are discrete and size is not quantitative (thus use zero=false, by default)', () => {
          // TODO: replace this test with something more local
          const model = parseUnitModel({
            "data": {"url": "data/cars.json"},
            "mark": "point",
            "encoding": {
              "y": {"field": "Origin", "type": "ordinal", "scale": {"rangeStep": 11}},
              "x": {"field": "Cylinders", "type": "ordinal", "scale": {"rangeStep": 13}},
              // not truly ordinal, just say ordinal for the sake of testing
              "size": {"field": "Origin", "type": "ordinal"}
            }
          });
          const scales = parseScales(model)['size'];
          assert.deepEqual(scales.main.range, [9, 81]);
        });

        it('should return [9, (minBandSize-2)^2] if both x and y are discrete and size is quantitative but use zero=false', () => {
          // TODO: replace this test with something more local
          const model = parseUnitModel({
            "data": {"url": "data/cars.json"},
            "mark": "point",
            "encoding": {
              "y": {"field": "Origin", "type": "ordinal", "scale": {"rangeStep": 11}},
              "x": {"field": "Cylinders", "type": "ordinal", "scale": {"rangeStep": 13}},
              "size": {"field": "Acceleration", "type": "quantitative", "scale": {"zero": false}}
            }
          });
          const scales = parseScales(model)['size'];
          assert.deepEqual(scales.main.range, [9, 81]);
          // TODO: this actually should throw warning too.
        });

        it('should return [0, (xRangeStep-2)^2] if x is discrete and y is continuous and size is quantitative (thus use zero=true, by default)', () => {
          // TODO: replace this test with something more local
          const model = parseUnitModel({
            "data": {"url": "data/cars.json"},
            "mark": "point",
            "encoding": {
              "y": {"field": "Acceleration", "type": "quantitative"},
              "x": {"field": "Cylinders", "type": "ordinal", "scale": {"rangeStep": 11}},
              "size": {"aggregate": "mean", "field": "Horsepower", "type": "quantitative"}
            }
          });
          const scales = parseScales(model)['size'];
          assert.deepEqual(scales.main.range, [0, 81]);
        });

        it('should return [9, (xRangeStep-2)^2] if x is discrete and y is continuous and size is quantitative (thus use zero=false, by default)', () => {
          // TODO: replace this test with something more local
          const model = parseUnitModel({
            "data": {"url": "data/cars.json"},
            "mark": "point",
            "encoding": {
              "y": {"field": "Acceleration", "type": "quantitative"},
              "x": {"field": "Cylinders", "type": "ordinal", "scale": {"rangeStep": 11}},
              // not truly ordinal, just say ordinal for the sake of testing
              "size": {"field": "Origin", "type": "ordinal"}
            }
          });
          const scales = parseScales(model)['size'];
          assert.deepEqual(scales.main.range, [9, 81]);
        });

        it('should return [0, (yRangeStep-2)^2] if y is discrete and x is continuous and size is quantitative (thus use zero=true, by default)', () => {
          // TODO: replace this test with something more local
          const model = parseUnitModel({
            "data": {"url": "data/cars.json"},
            "mark": "point",
            "encoding": {
              "x": {"field": "Acceleration", "type": "quantitative"},
              "y": {"field": "Cylinders", "type": "ordinal", "scale": {"rangeStep": 11}},
              "size": {"aggregate": "mean", "field": "Horsepower", "type": "quantitative"}
            }
          });
          const scales = parseScales(model)['size'];
          assert.deepEqual(scales.main.range, [0, 81]);
        });

        it('should return [0, (scaleConfig.rangeStep-2)^2] if y is discrete and x is continuous and size is quantitative (thus use zero=true, by default)', () => {
          // TODO: replace this test with something more local
          const model = parseUnitModel({
            "data": {"url": "data/cars.json"},
            "mark": "point",
            "encoding": {
              "x": {"field": "Acceleration", "type": "quantitative"},
              "y": {"field": "Acceleration", "type": "quantitative"},
              "size": {"aggregate": "mean", "field": "Horsepower", "type": "quantitative"}
            },
            "config": {"scale": {"rangeStep": 11}}
          });
          const scales = parseScales(model)['size'];
          assert.deepEqual(scales.main.range, [0, 81]);
        });
      });
    });

    describe('shape', function() {
      it('should use default shapes as shape\'s scale range.', () => {
        const model = parseUnitModel({
          "data": {"url": "data/cars.json"},
          "mark": "point",
          "encoding": {
            "shape": {"field": "Origin", "type": "nominal"}
          }
        });
        const scales = parseScales(model)['shape'];
        assert.deepEqual(scales.main.range, mark.defaultPointConfig.shapes);
      });
    });
  });

  describe('rangeStep()', () => {
    it('should return undefined if rangeStep spec is null', () => {
      const size = rangeStep(null, undefined, 'point', X, defaultScaleConfig);
      assert.deepEqual(size, undefined);
    });

    it('should return undefined if top-level size is provided for ordinal scale and drop specified rangeStep', log.wrap((localLogger)=> {
      const size = rangeStep(21, 180, 'point', X, defaultScaleConfig);
      assert.deepEqual(size, undefined);
      assert.equal(localLogger.warns[0], log.message.rangeStepDropped('x'));
    }));

    it('should return undefined if top-level size is provided for ordinal scale and throw warning if rangeStep is specified', log.wrap((logger) => {
      const size = rangeStep(21, 180, 'point', X, defaultScaleConfig);
      assert.deepEqual(size, undefined);
      assert.equal(logger.warns[0], log.message.rangeStepDropped(X));
    }));

    it('should return provided rangeStep for ordinal scale', () => {
      const size = rangeStep(21, undefined, 'point', X, defaultScaleConfig);
      assert.deepEqual(size, 21);
    });

    it('should return provided textXRangeStep for x-ordinal scale', () => {
      const size = rangeStep(undefined, undefined, 'text', X, defaultScaleConfig);
      assert.deepEqual(size, defaultScaleConfig.textXRangeStep);
    });

    it('should return provided rangeStep for other ordinal scale', () => {
      const size = rangeStep(undefined, undefined, 'point', X, defaultScaleConfig);
      assert.deepEqual(size, defaultScaleConfig.rangeStep);
    });
  });
});
