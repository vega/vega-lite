/* tslint:disable:quotemark */

import {assert} from 'chai';

import {rangeStep, parseScaleComponent, initScale, defaultProperty} from '../../src/compile/scale';
import {parseUnitModel} from '../util';

import * as log from '../../src/log';
import {X, Channel, NONSPATIAL_SCALE_CHANNELS} from '../../src/channel';
import {ScaleType, defaultScaleConfig} from '../../src/scale';
import {Mark, POINT, TEXT} from '../../src/mark';
import * as mark from '../../src/mark';
import {ExtendedUnitSpec} from '../../src/spec';
import {Type} from '../../src/type';

describe('Scale', function() {
  describe('initScale', () => {
    it('should output only padding without default paddingInner and paddingOuter if padding is specified for a band scale', () => {
      const scale = initScale(100, 'bar', 'x',
        {field: 'a', type: 'ordinal', scale: {type: 'band', padding: 0.6}},
        {}
      );
      assert.equal(scale.padding, 0.6);
      assert.isUndefined(scale.paddingInner);
      assert.isUndefined(scale.paddingOuter);
    });

    it('should output default paddingInner and paddingOuter = paddingInner/2 if none of padding properties is specified for a band scale', () => {
      const scale = initScale(100, 'bar', 'x',
        {field: 'a', type: 'ordinal', scale: {type: 'band'}},
        {bandPaddingInner: 0.3}
      );
      assert.equal(scale.paddingInner, 0.3);
      assert.equal(scale.paddingOuter, 0.15);
      assert.isUndefined(scale.padding);
    });
  });

  describe('defaultProperty', () => {
    describe('nice', () => {
      // TODO:
    });

    describe('padding', () => {
      it('should be pointPadding for point scale if channel is x or y and padding is not specified.', () => {
        for (let c of ['x', 'y'] as Channel[]) {
          assert.equal(defaultProperty.padding(c, 'point', {pointPadding: 13}), 13);
        }
      });
    });

    describe('paddingInner', () => {
      it('should be undefined if padding is specified.', () => {
        assert.equal(defaultProperty.paddingInner(10, 'x', {}), undefined);
      });

      it('should be bandPaddingInner if channel is x or y and padding is not specified.', () => {
        assert.equal(defaultProperty.paddingInner(undefined, 'x', {bandPaddingInner: 15}), 15);
        assert.equal(defaultProperty.paddingInner(undefined, 'y', {bandPaddingInner: 15}), 15);
      });

      it('should be undefined for non-xy channels.', () => {
        for (let c of NONSPATIAL_SCALE_CHANNELS) {
          assert.equal(defaultProperty.paddingInner(undefined, c, {bandPaddingInner: 15}), undefined);
        }
      });
    });

    describe('paddingOuter', () => {
      it('should be undefined if padding is specified.', () => {
        for (let scaleType of ['point', 'band'] as ScaleType[]) {
          assert.equal(defaultProperty.paddingOuter(10, 'x', scaleType, 0, {}), undefined);
        }
      });

      it('should be config.scale.bandPaddingOuter for band scale if channel is x or y and padding is not specified and config.scale.bandPaddingOuter.', () => {
        for (let c of ['x', 'y'] as Channel[]) {
          assert.equal(defaultProperty.paddingOuter(undefined, c, 'band', 0, {bandPaddingOuter: 16}), 16);
        }
      });
      it('should be paddingInner/2 for band scale if channel is x or y and padding is not specified and config.scale.bandPaddingOuter.', () => {
        for (let c of ['x', 'y'] as Channel[]) {
          assert.equal(defaultProperty.paddingOuter(undefined, c, 'band', 10, {}), 5);
        }
      });

      it('should be undefined for non-xy channels.', () => {
        for (let c of NONSPATIAL_SCALE_CHANNELS) {
          for (let scaleType of ['point', 'band'] as ScaleType[]) {
            assert.equal(defaultProperty.paddingOuter(undefined, c, scaleType, 0, {}), undefined);
          }
        }
      });
    });

    describe('round', () => {
      it('should return scaleConfig.round for x, y, row, column.', () => {
        for (let c of ['x', 'y', 'row', 'column'] as Channel[]) {
          assert(defaultProperty.round(c, {round: true}));
          assert(!defaultProperty.round(c, {round: false}));
        }
      });

      it('should return undefined other channels (not x, y, row, column).', () => {
        for (let c of NONSPATIAL_SCALE_CHANNELS) {
          assert.isUndefined(defaultProperty.round(c, {round: true}));
          assert.isUndefined(defaultProperty.round(c, {round: false}));
        }
      });
    });

    describe('zero', () => {
      it('should return true when mapping a quantitative field to size', () => {
        assert(defaultProperty.zero({}, 'size', {field: 'a', type: 'quantitative'}));
      });

      it('should return false when mapping a ordinal field to size', () => {
        assert(!defaultProperty.zero({}, 'size', {field: 'a', type: 'ordinal'}));
      });

      it('should return true when mapping a non-binned quantitative field to x/y', () => {
        for (let channel of ['x', 'y'] as Channel[]) {
          assert(defaultProperty.zero({}, channel, {field: 'a', type: 'quantitative'}));
        }
      });

      it('should return false when mapping a binned quantitative field to x/y', () => {
        for (let channel of ['x', 'y'] as Channel[]) {
          assert(!defaultProperty.zero({}, channel, {bin: true, field: 'a', type: 'quantitative'}));
        }
      });

      it('should return false when mapping a non-binned quantitative field with custom domain to x/y', () => {
        for (let channel of ['x', 'y'] as Channel[]) {
          assert(!defaultProperty.zero({domain: [1, 5]}, channel, {
            bin: true, field: 'a', type: 'quantitative'
          }));
        }
      });
    });
  });

  describe('rangeStep()', () => {
    it('should return undefined if rangeStep spec is null', () => {
      const size = rangeStep(null, undefined, POINT, X, defaultScaleConfig);
      assert.deepEqual(size, undefined);
    });

    it('should return undefined if top-level size is provided for ordinal scale and drop specified rangeStep', log.wrap((localLogger)=> {
      const size = rangeStep(21, 180, POINT, X, defaultScaleConfig);
      assert.deepEqual(size, undefined);
      assert.equal(localLogger.warns[0], log.message.rangeStepDropped('x'));
    }));

    it('should return undefined if top-level size is provided for ordinal scale and throw warning if rangeStep is specified', log.wrap((logger) => {
      const size = rangeStep(21, 180, POINT, X, defaultScaleConfig);
      assert.deepEqual(size, undefined);
      assert.equal(logger.warns[0], log.message.rangeStepDropped(X));
    }));

    it('should return provided rangeStep for ordinal scale', () => {
      const size = rangeStep(21, undefined, POINT, X, defaultScaleConfig);
      assert.deepEqual(size, 21);
    });

    it('should return provided textXRangeStep for x-ordinal scale', () => {
      const size = rangeStep(undefined, undefined, TEXT, X, defaultScaleConfig);
      assert.deepEqual(size, defaultScaleConfig.textXRangeStep);
    });

    it('should return provided rangeStep for other ordinal scale', () => {
      const size = rangeStep(undefined, undefined, POINT, X, defaultScaleConfig);
      assert.deepEqual(size, defaultScaleConfig.rangeStep);
    });
  });

  describe('parseScaleComponent', () => {
    describe('x ordinal point', () => {
      it('should create a main x point scale with rangeStep and no range', () => {
        const model = parseUnitModel({
          mark: "point",
          encoding: {
            x: { field: 'origin', type: "nominal"}
          }
        });
        const scales = parseScaleComponent(model)['x'];
        assert.equal(scales.main.type, 'point');
        assert.equal(scales.main.rangeStep, 21);
        assert.equal(scales.main.range, undefined);
      });
    });

    describe('nominal with color', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          color: { field: 'origin', type: "nominal"}
        }
      });

      const scales = parseScaleComponent(model)['color'];

      it('should create correct main color scale', function() {
        assert.equal(scales.main.name, 'color');
        assert.equal(scales.main.type, 'ordinal');
        assert.deepEqual(scales.main.domain, {
          data: 'source',
          field: 'origin',
          sort: true
        });
        assert.deepEqual(scales.main.scheme, 'category10');
        assert.deepEqual(scales.main.rangeStep, undefined);
      });
    });

    describe('ordinal with color', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          color: { field: 'origin', type: "ordinal"}
        }
      });

      const scales = parseScaleComponent(model)['color'];

      it('should create index color scale', function() {
        assert.equal(scales.main.name, 'color');
        assert.equal(scales.main.type, 'index');

        assert.deepEqual(scales.main.domain, {
          data: 'source',
          field: 'origin',
          sort: true
        });
      });
    });

    describe('color with bin', function() {
      const model = parseUnitModel({
          mark: "point",
          encoding: {
            color: { field: "origin", type: "quantitative", bin: true}
          }
        });

      const scales = parseScaleComponent(model)['color'];

      it('should add correct scales', function() {
        assert.equal(scales.main.name, 'color');
        assert.equal(scales.main.type, 'sequential');

        assert.equal(scales.binLegend.name, 'color_bin_legend');
        assert.equal(scales.binLegend.type, 'point');

        assert.equal(scales.binLegendLabel.name, 'color_bin_legend_label');
        assert.equal(scales.binLegendLabel.type, 'ordinal');
      });

      it('should sort domain and range for labels', function() {
        assert.deepEqual(scales.binLegendLabel.domain, {
          data: 'source',
          field: 'bin_origin_start',
          sort: true
        });
        assert.deepEqual(scales.binLegendLabel.range, {
          data: 'source',
          field: 'bin_origin_range',
          sort: {"field": "bin_origin_start","op": "min"}
        });
      });
    });

    describe('color with time unit', function() {
      const model = parseUnitModel({
          mark: "point",
          encoding: {
            color: {field: 'origin', type: "temporal", timeUnit: "year"}
          }
        });

      const scales = parseScaleComponent(model)['color'];

      it('should add correct scales', function() {
        assert.equal(scales.main.name, 'color');
        assert.equal(scales.main.type, 'sequential');
        assert.equal(scales.binLegend, undefined);
        assert.equal(scales.binLegendLabel, undefined);
      });
    });
  });

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
        const scales = parseScaleComponent(model)['color'];
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
          const scales = parseScaleComponent(model)['color'];
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
        const scales = parseScaleComponent(model)['opacity'];
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
          const scales = parseScaleComponent(model)['size'];
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
          const scales = parseScaleComponent(model)['size'];
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
          const scales = parseScaleComponent(model)['size'];
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
          const scales = parseScaleComponent(model)['size'];
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
          const scales = parseScaleComponent(model)['size'];
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
          const scales = parseScaleComponent(model)['size'];
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
            const scales = parseScaleComponent(model)['size'];
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
          const scales = parseScaleComponent(model)['size'];
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
          const scales = parseScaleComponent(model)['size'];
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
          const scales = parseScaleComponent(model)['size'];
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
          const scales = parseScaleComponent(model)['size'];
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
          const scales = parseScaleComponent(model)['size'];
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
          const scales = parseScaleComponent(model)['size'];
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
          const scales = parseScaleComponent(model)['size'];
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
        const scales = parseScaleComponent(model)['shape'];
        assert.deepEqual(scales.main.range, mark.defaultPointConfig.shapes);
      });
    });
  });

  describe('reverse()', function() {
    // FIXME
  });
});
