/* tslint:disable:quotemark */

import {assert} from 'chai';

import {
  defaultContinuousToDiscreteCount,
  interpolateRange,
  parseRangeForChannel
} from '../../../src/compile/scale/range';
import {makeExplicit, makeImplicit} from '../../../src/compile/split';
import {Config, defaultConfig} from '../../../src/config';
import * as log from '../../../src/log';
import {Mark} from '../../../src/mark';
import {CONTINUOUS_TO_CONTINUOUS_SCALES, DISCRETE_DOMAIN_SCALES, ScaleType} from '../../../src/scale';
import {NOMINAL, ORDINAL, QUANTITATIVE} from '../../../src/type';

describe('compile/scale', () => {
  describe('parseRange()', () => {
    describe('position', () => {
      it('should return [0, plot_width] for x-continuous scales by default.', () => {
        for (const scaleType of CONTINUOUS_TO_CONTINUOUS_SCALES) {
          assert.deepEqual(
            parseRangeForChannel(
              'x',
              scaleType,
              QUANTITATIVE,
              {},
              defaultConfig,
              true,
              'point',
              false,
              'plot_width',
              []
            ),
            makeImplicit([0, {signal: 'plot_width'}])
          );
        }
      });

      it('should return [plot_height,0] for y-continuous scales by default.', () => {
        for (const scaleType of CONTINUOUS_TO_CONTINUOUS_SCALES) {
          assert.deepEqual(
            parseRangeForChannel(
              'y',
              scaleType,
              QUANTITATIVE,
              {},
              defaultConfig,
              true,
              'point',
              false,
              'plot_height',
              []
            ),
            makeImplicit([{signal: 'plot_height'}, 0])
          );
        }
      });

      it('should return [0, plot_height] for y-discrete scales with height by default.', () => {
        for (const scaleType of DISCRETE_DOMAIN_SCALES) {
          assert.deepEqual(
            parseRangeForChannel(
              'y',
              scaleType,
              QUANTITATIVE,
              {},
              defaultConfig,
              true,
              'point',
              true,
              'plot_height',
              []
            ),
            makeImplicit([0, {signal: 'plot_height'}])
          );
        }
      });

      it(
        'should support custom range.',
        log.wrap(localLogger => {
          assert.deepEqual(
            parseRangeForChannel(
              'x',
              'linear',
              QUANTITATIVE,
              {range: [0, 100]},
              defaultConfig,
              true,
              'point',
              false,
              'plot_width',
              []
            ),
            makeExplicit([0, 100])
          );
          assert.deepEqual(localLogger.warns.length, 0);
        })
      );

      it('should return config.scale.rangeStep for band/point scales by default.', () => {
        for (const scaleType of ['point', 'band'] as ScaleType[]) {
          assert.deepEqual(
            parseRangeForChannel(
              'x',
              scaleType,
              NOMINAL,
              {},
              defaultConfig,
              undefined,
              'point',
              false,
              'plot_width',
              []
            ),
            makeImplicit({step: 21})
          );
        }
      });

      it("should return config.scale.textXRangeStep by default for text mark's x band/point scales.", () => {
        for (const scaleType of ['point', 'band'] as ScaleType[]) {
          assert.deepEqual(
            parseRangeForChannel(
              'x',
              scaleType,
              NOMINAL,
              {},
              {scale: {textXRangeStep: 55}},
              undefined,
              'text',
              false,
              'plot_width',
              []
            ),
            makeImplicit({step: 55})
          );
        }
      });

      it('should return specified rangeStep if topLevelSize is undefined for band/point scales', () => {
        for (const scaleType of ['point', 'band'] as ScaleType[]) {
          assert.deepEqual(
            parseRangeForChannel(
              'x',
              scaleType,
              NOMINAL,
              {rangeStep: 23},
              defaultConfig,
              undefined,
              'text',
              false,
              'plot_width',
              []
            ),
            makeExplicit({step: 23})
          );
        }
      });

      it(
        'should drop rangeStep if topLevelSize is specified for band/point scales',
        log.wrap(localLogger => {
          for (const scaleType of ['point', 'band'] as ScaleType[]) {
            assert.deepEqual(
              parseRangeForChannel(
                'x',
                scaleType,
                NOMINAL,
                {rangeStep: 23},
                defaultConfig,
                undefined,
                'text',
                true,
                'plot_width',
                []
              ),
              makeImplicit([0, {signal: 'plot_width'}])
            );
          }
          assert.equal(localLogger.warns[0], log.message.rangeStepDropped('x'));
        })
      );

      it('should return default topLevelSize if rangeStep is null for band/point scales', () => {
        for (const scaleType of ['point', 'band'] as ScaleType[]) {
          assert.deepEqual(
            parseRangeForChannel(
              'x',
              scaleType,
              NOMINAL,
              {rangeStep: null},
              defaultConfig,
              undefined,
              'text',
              false,
              'plot_width',
              []
            ),
            makeImplicit([0, {signal: 'plot_width'}])
          );
        }
      });

      it('should return default topLevelSize if rangeStep config is null', () => {
        for (const scaleType of ['point', 'band'] as ScaleType[]) {
          assert.deepEqual(
            parseRangeForChannel(
              'x',
              scaleType,
              NOMINAL,
              {},
              {view: {width: 200}, scale: {rangeStep: null}},
              undefined,
              'point',
              false,
              'plot_width',
              []
            ),
            makeImplicit([0, {signal: 'plot_width'}])
          );
        }
      });

      it('should return default topLevelSize for text if textXRangeStep config is null', () => {
        for (const scaleType of ['point', 'band'] as ScaleType[]) {
          assert.deepEqual(
            parseRangeForChannel(
              'x',
              scaleType,
              NOMINAL,
              {},
              {view: {width: 200}, scale: {textXRangeStep: null}},
              undefined,
              'text',
              false,
              'plot_width',
              []
            ),
            makeImplicit([0, {signal: 'plot_width'}])
          );
        }
      });

      it('should drop rangeStep for continuous scales', () => {
        for (const scaleType of CONTINUOUS_TO_CONTINUOUS_SCALES) {
          log.wrap(localLogger => {
            assert.deepEqual(
              parseRangeForChannel(
                'x',
                scaleType,
                QUANTITATIVE,
                {rangeStep: 23},
                defaultConfig,
                undefined,
                'text',
                true,
                'plot_width',
                []
              ),
              makeImplicit([0, {signal: 'plot_width'}])
            );
            assert.equal(
              localLogger.warns[0],
              log.message.scalePropertyNotWorkWithScaleType(scaleType, 'rangeStep', 'x')
            );
          })();
        }
      });
    });

    describe('color', () => {
      it('should use the specified scheme for a nominal color field.', () => {
        assert.deepEqual(
          parseRangeForChannel(
            'color',
            'ordinal',
            NOMINAL,
            {scheme: 'warm'},
            defaultConfig,
            undefined,
            'point',
            false,
            'plot_width',
            []
          ),
          makeExplicit({scheme: 'warm'})
        );
      });

      it('should use the specified scheme with extent for a nominal color field.', () => {
        assert.deepEqual(
          parseRangeForChannel(
            'color',
            'ordinal',
            NOMINAL,
            {scheme: {name: 'warm', extent: [0.2, 1]}},
            defaultConfig,
            undefined,
            'point',
            false,
            'plot_width',
            []
          ),
          makeExplicit({scheme: 'warm', extent: [0.2, 1]})
        );
      });

      it('should use the specified range for a nominal color field.', () => {
        assert.deepEqual(
          parseRangeForChannel(
            'color',
            'ordinal',
            NOMINAL,
            {range: ['red', 'green', 'blue']},
            defaultConfig,
            undefined,
            'point',
            false,
            'plot_width',
            []
          ),
          makeExplicit(['red', 'green', 'blue'])
        );
      });

      it('should use default category range in Vega for a nominal color field.', () => {
        assert.deepEqual(
          parseRangeForChannel(
            'color',
            'ordinal',
            NOMINAL,
            {},
            defaultConfig,
            undefined,
            'point',
            false,
            'plot_width',
            []
          ),
          makeImplicit('category')
        );
      });

      it('should use default ordinal range in Vega for an ordinal color field.', () => {
        assert.deepEqual(
          parseRangeForChannel(
            'color',
            'ordinal',
            ORDINAL,
            {},
            defaultConfig,
            undefined,
            'point',
            false,
            'plot_width',
            []
          ),
          makeImplicit('ordinal')
        );
      });

      it('should use default ramp range in Vega for a temporal/quantitative color field.', () => {
        assert.deepEqual(
          parseRangeForChannel(
            'color',
            'sequential',
            QUANTITATIVE,
            {},
            defaultConfig,
            undefined,
            'point',
            false,
            'plot_width',
            []
          ),
          makeImplicit('ramp')
        );
      });

      it('should use the specified scheme with count for a quantitative color field.', () => {
        assert.deepEqual(
          parseRangeForChannel(
            'color',
            'ordinal',
            QUANTITATIVE,
            {scheme: {name: 'viridis', count: 3}},
            defaultConfig,
            undefined,
            'point',
            false,
            'plot_width',
            []
          ),
          makeExplicit({scheme: 'viridis', count: 3})
        );
      });

      it('should use default ordinal range for discretizing scales', () => {
        const scales: ScaleType[] = ['quantile', 'quantize', 'threshold'];
        scales.forEach(discretizingScale => {
          assert.deepEqual(
            parseRangeForChannel(
              'color',
              discretizingScale,
              QUANTITATIVE,
              {},
              defaultConfig,
              undefined,
              'circle',
              false,
              'plot_width',
              []
            ),
            makeImplicit({scheme: 'blues', count: 4})
          );
        });
      });
    });

    describe('opacity', () => {
      it("should use default opacityRange as opacity's scale range.", () => {
        assert.deepEqual(
          parseRangeForChannel(
            'opacity',
            'linear',
            QUANTITATIVE,
            {},
            defaultConfig,
            undefined,
            'point',
            false,
            'plot_width',
            []
          ),
          makeImplicit([defaultConfig.scale.minOpacity, defaultConfig.scale.maxOpacity])
        );
      });
    });

    describe('size', () => {
      describe('bar', () => {
        it('should return [minBandSize, maxBandSize] if both are specified', () => {
          const config = {
            scale: {minBandSize: 2, maxBandSize: 9}
          };
          assert.deepEqual(
            parseRangeForChannel('size', 'linear', QUANTITATIVE, {}, config, undefined, 'bar', false, 'plot_width', []),
            makeImplicit([2, 9])
          );
        });

        it('should return [continuousBandSize, xRangeStep-1] by default since min/maxSize config are not specified', () => {
          assert.deepEqual(
            parseRangeForChannel(
              'size',
              'linear',
              QUANTITATIVE,
              {},
              defaultConfig,
              undefined,
              'bar',
              false,
              'plot_width',
              []
            ),
            makeImplicit([2, defaultConfig.scale.rangeStep - 1])
          );
        });
      });

      describe('tick', () => {
        it('should return [minBandSize, maxBandSize] if both are specified', () => {
          const config = {
            scale: {minBandSize: 4, maxBandSize: 9}
          };
          assert.deepEqual(
            parseRangeForChannel(
              'size',
              'linear',
              QUANTITATIVE,
              {},
              config,
              undefined,
              'tick',
              false,
              'plot_width',
              []
            ),
            makeImplicit([4, 9])
          );
        });

        it('should return [(default)minBandSize, rangeStep-1] by default since maxSize config is not specified', () => {
          assert.deepEqual(
            parseRangeForChannel(
              'size',
              'linear',
              QUANTITATIVE,
              {},
              defaultConfig,
              undefined,
              'tick',
              false,
              'plot_width',
              []
            ),
            makeImplicit([defaultConfig.scale.minBandSize, defaultConfig.scale.rangeStep - 1])
          );
        });
      });

      describe('text', () => {
        it('should return [minFontSize, maxFontSize]', () => {
          assert.deepEqual(
            parseRangeForChannel(
              'size',
              'linear',
              QUANTITATIVE,
              {},
              defaultConfig,
              undefined,
              'text',
              false,
              'plot_width',
              []
            ),
            makeImplicit([defaultConfig.scale.minFontSize, defaultConfig.scale.maxFontSize])
          );
        });
      });

      describe('rule', () => {
        it('should return [minStrokeWidth, maxStrokeWidth]', () => {
          assert.deepEqual(
            parseRangeForChannel(
              'size',
              'linear',
              QUANTITATIVE,
              {},
              defaultConfig,
              undefined,
              'rule',
              false,
              'plot_width',
              []
            ),
            makeImplicit([defaultConfig.scale.minStrokeWidth, defaultConfig.scale.maxStrokeWidth])
          );
        });
      });

      describe('point, square, circle', () => {
        it('should return [minSize, maxSize]', () => {
          for (const m of ['point', 'square', 'circle'] as Mark[]) {
            const config = {
              scale: {
                minSize: 5,
                maxSize: 25
              }
            };

            assert.deepEqual(
              parseRangeForChannel('size', 'linear', QUANTITATIVE, {}, config, undefined, m, false, 'plot_width', []),
              makeImplicit([5, 25])
            );
          }
        });

        it('should return [0, (minBandSize-2)^2] if both x and y are discrete and size is quantitative (thus use zero=true, by default)', () => {
          for (const m of ['point', 'square', 'circle'] as Mark[]) {
            assert.deepEqual(
              parseRangeForChannel(
                'size',
                'linear',
                QUANTITATIVE,
                {},
                defaultConfig,
                true,
                m,
                false,
                'plot_width',
                [11, 13] // xyRangeSteps
              ),
              makeImplicit([0, 81])
            );
          }
        });

        it('should return [9, (minBandSize-2)^2] if both x and y are discrete and size is not quantitative (thus use zero=false, by default)', () => {
          for (const m of ['point', 'square', 'circle'] as Mark[]) {
            assert.deepEqual(
              parseRangeForChannel(
                'size',
                'linear',
                QUANTITATIVE,
                {},
                defaultConfig,
                false,
                m,
                false,
                'plot_width',
                [11, 13] // xyRangeSteps
              ),
              makeImplicit([9, 81])
            );
          }
        });

        it('should return [9, (minBandSize-2)^2] if both x and y are discrete and size is quantitative but use zero=false', () => {
          for (const m of ['point', 'square', 'circle'] as Mark[]) {
            assert.deepEqual(
              parseRangeForChannel(
                'size',
                'linear',
                QUANTITATIVE,
                {},
                defaultConfig,
                false,
                m,
                false,
                'plot_width',
                [11, 13] // xyRangeSteps
              ),
              makeImplicit([9, 81])
            );
          }
        });

        it('should return [0, (xRangeStep-2)^2] if x is discrete and y is continuous and size is quantitative (thus use zero=true, by default)', () => {
          for (const m of ['point', 'square', 'circle'] as Mark[]) {
            assert.deepEqual(
              parseRangeForChannel(
                'size',
                'linear',
                QUANTITATIVE,
                {},
                defaultConfig,
                true,
                m,
                false,
                'plot_width',
                [11] // xyRangeSteps only have one value
              ),
              makeImplicit([0, 81])
            );
          }
        });
      });
    });

    describe('shape', () => {
      it("should use default symbol range in Vega as shape's scale range.", () => {
        assert.deepEqual(
          parseRangeForChannel(
            'shape',
            'ordinal',
            QUANTITATIVE,
            {},
            defaultConfig,
            undefined,
            'point',
            false,
            'plot_width',
            []
          ),
          makeImplicit('symbol')
        );
      });
    });
  });

  describe('defaultContinuousToDiscreteCount', () => {
    it('should use config.scale.quantileCount for quantile scale', () => {
      const config: Config = {
        scale: {
          quantileCount: 4
        }
      };
      assert.equal(defaultContinuousToDiscreteCount('quantile', config, undefined), 4);
    });

    it('should use config.scale.quantizeCount for quantize scale', () => {
      const config: Config = {
        scale: {
          quantizeCount: 4
        }
      };
      assert.equal(defaultContinuousToDiscreteCount('quantize', config, undefined), 4);
    });

    it('should use domain size for threshold scale', () => {
      assert.equal(defaultContinuousToDiscreteCount('threshold', {}, [1, 10]), 3);
    });

    it('should throw warning and default to 4 for scale without domain', () => {
      log.wrap(localLogger => {
        assert.equal(defaultContinuousToDiscreteCount('quantize', {}, undefined), 4);
        assert.equal(localLogger.warns[0], log.message.DOMAIN_REQUIRED_FOR_THRESHOLD_SCALE);
      });
    });

    it('should return 4 as a default', () => {
      assert.equal(defaultContinuousToDiscreteCount('band', {}, undefined), 4);
    });
  });

  describe('interpolateRange', () => {
    it('should return the correct interpolation of 1 - 100 with cardinality of 5', () => {
      assert.deepEqual(interpolateRange(0, 100, 5), [0, 25, 50, 75, 100]);
    });
  });
});
