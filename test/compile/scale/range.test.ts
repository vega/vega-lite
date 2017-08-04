/* tslint:disable:quotemark */

import {assert} from 'chai';

import {defaultRange, parseRangeForChannel} from '../../../src/compile/scale/range';

import {ScaleComponent} from '../../../src/compile/scale/component';
import {Split} from '../../../src/compile/split';
import {defaultConfig} from '../../../src/config';
import * as log from '../../../src/log';
import {Mark} from '../../../src/mark';
import {CONTINUOUS_TO_CONTINUOUS_SCALES, Scale, ScaleType} from '../../../src/scale';
import {NOMINAL, ORDINAL, QUANTITATIVE} from '../../../src/type';
import {VgRange, VgRangeScheme, VgScale} from '../../../src/vega.schema';

describe('compile/scale', () => {
  describe('parseRange()', function() {
    describe('x/y', function() {
      it('should return config.cell.width for x-continous scales by default.', () => {
        for (const scaleType of CONTINUOUS_TO_CONTINUOUS_SCALES) {
          assert.deepEqual(
            parseRangeForChannel('x', scaleType, QUANTITATIVE, {}, defaultConfig, true, 'point', undefined, 'plot_width', []).value,
            [0, {signal: 'plot_width'}]
          );
        }
      });

      it('should return config.cell.height for y-continous scales by default.', () => {
        for (const scaleType of CONTINUOUS_TO_CONTINUOUS_SCALES) {
          assert.deepEqual(
            parseRangeForChannel('y', scaleType, QUANTITATIVE, {}, defaultConfig, true, 'point', undefined, 'plot_height', []).value,
            [{signal: 'plot_height'}, 0]
          );
        }
      });

      it('should not support custom range.', log.wrap((localLogger) => {
        assert.deepEqual(
          parseRangeForChannel('x', 'linear', QUANTITATIVE, {range: [0, 100]}, defaultConfig, true, 'point', undefined, 'plot_width', []).value,
          [0, {signal: 'plot_width'}]
        );
        assert.deepEqual(localLogger.warns[0], log.message.CANNOT_USE_RANGE_WITH_POSITION);
      }));

      it('should return config.scale.rangeStep for band/point scales by default.', () => {
        for (const scaleType of ['point', 'band'] as ScaleType[]) {
          assert.deepEqual(
            parseRangeForChannel('x', scaleType, NOMINAL, {}, defaultConfig, undefined, 'point', undefined, 'plot_width', []).value,
            {step: 21}
          );
        }
      });

      it('should return config.scale.textXRangeStep by default for text mark\'s x band/point scales.', () => {
        for (const scaleType of ['point', 'band'] as ScaleType[]) {
          assert.deepEqual(
            parseRangeForChannel('x', scaleType, NOMINAL, {}, {scale: {textXRangeStep: 55}}, undefined, 'text', undefined, 'plot_width', []).value,
            {step: 55}
          );
        }
      });

      it('should return specified rangeStep if topLevelSize is undefined for band/point scales', () => {
        for (const scaleType of ['point', 'band'] as ScaleType[]) {
          assert.deepEqual(
            parseRangeForChannel('x', scaleType, NOMINAL, {rangeStep: 23}, defaultConfig, undefined, 'text', undefined, 'plot_width', []).value,
            {step: 23}
          );
        }
      });

      it('should drop rangeStep if topLevelSize is specified for band/point scales', log.wrap((localLogger) => {
        for (const scaleType of ['point', 'band'] as ScaleType[]) {
          assert.deepEqual(
            parseRangeForChannel('x', scaleType, NOMINAL, {rangeStep: 23}, defaultConfig, undefined, 'text', 123, 'plot_width', []).value,
            [0, {signal: 'plot_width'}]
          );
        }
        assert.equal(localLogger.warns[0], log.message.rangeStepDropped('x'));
      }));

      it('should return default topLevelSize if rangeStep is null for band/point scales', () => {
        for (const scaleType of ['point', 'band'] as ScaleType[]) {
          assert.deepEqual(
            parseRangeForChannel('x', scaleType, NOMINAL, {rangeStep: null}, defaultConfig, undefined, 'text', undefined, 'plot_width', []).value,
            [0, {signal: 'plot_width'}]
          );
        }
      });

      it('should return default topLevelSize if rangeStep config is null', () => {
        for (const scaleType of ['point', 'band'] as ScaleType[]) {
          assert.deepEqual(
            parseRangeForChannel('x', scaleType, NOMINAL, {}, {cell: {width: 200}, scale: {rangeStep: null}}, undefined, 'point', undefined, 'plot_width', []).value,
            [0, {signal: 'plot_width'}]
          );
        }
      });

      it('should return default topLevelSize for text if textXRangeStep config is null', () => {
        for (const scaleType of ['point', 'band'] as ScaleType[]) {
          assert.deepEqual(
            parseRangeForChannel('x', scaleType, NOMINAL, {}, {cell: {width: 200}, scale: {textXRangeStep: null}}, undefined, 'text', undefined, 'plot_width', []).value,
            [0, {signal: 'plot_width'}]
          );
        }
      });

      it('should drop rangeStep for continuous scales', () => {
        for (const scaleType of CONTINUOUS_TO_CONTINUOUS_SCALES) {
          log.wrap((localLogger) => {
            assert.deepEqual(
              parseRangeForChannel('x', scaleType, QUANTITATIVE, {rangeStep: 23}, defaultConfig, undefined, 'text', 123, 'plot_width', []).value,
              [0, {signal: 'plot_width'}]
            );
            assert.equal(localLogger.warns[0], log.message.scalePropertyNotWorkWithScaleType(scaleType, 'rangeStep', 'x'));
          })();
        }
      });
    });

    describe('color', function() {
      it('should use the specified scheme for a nominal color field.', () => {
        assert.deepEqual(
          parseRangeForChannel('color', 'ordinal', NOMINAL, {scheme: 'warm'}, defaultConfig, undefined, 'point', undefined, 'plot_width', []).value,
          {scheme: 'warm'}
        );
      });

      it('should use the specified scheme with extent for a nominal color field.', () => {
        assert.deepEqual(
          parseRangeForChannel('color', 'ordinal', NOMINAL, {scheme: {name: 'warm', extent: [0.2, 1]}}, defaultConfig, undefined, 'point', undefined, 'plot_width', []).value,
          {scheme: 'warm', extent: [0.2, 1]}
        );
      });

      it('should use the specified range for a nominal color field.', () => {
        assert.deepEqual(
          parseRangeForChannel('color', 'ordinal', NOMINAL, {range: ['red', 'green', 'blue']}, defaultConfig, undefined, 'point', undefined, 'plot_width', []).value,
          ['red', 'green', 'blue']
        );
      });

      it('should use default category range in Vega for a nominal color field.', () => {
        assert.deepEqual(
          parseRangeForChannel('color', 'ordinal', NOMINAL, {}, defaultConfig, undefined, 'point', undefined, 'plot_width', []).value,
          'category'
        );
      });

      it('should use default ordinal range in Vega for an ordinal color field.', () => {
        assert.deepEqual(
          parseRangeForChannel('color', 'ordinal', ORDINAL, {}, defaultConfig,  undefined, 'point', undefined, 'plot_width', []).value,
          'ordinal'
        );
      });

      it('should use default ramp range in Vega for a temporal/quantitative color field.', () => {
        assert.deepEqual(
          parseRangeForChannel('color', 'sequential', QUANTITATIVE, {}, defaultConfig, undefined, 'point', undefined, 'plot_width', []).value,
          'ramp'
        );
      });

      it('should use the specified scheme with count for a quantitative color field.', () => {
        assert.deepEqual(
          parseRangeForChannel('color', 'ordinal', QUANTITATIVE, {scheme: {name: 'viridis', count: 3}}, defaultConfig, undefined, 'point', undefined, 'plot_width', []).value,
          {scheme: 'viridis', count: 3}
        );
      });
    });

    describe('opacity', function() {
      it('should use default opacityRange as opacity\'s scale range.', () => {
        assert.deepEqual(
          parseRangeForChannel('opacity', 'linear', QUANTITATIVE, {}, defaultConfig, undefined, 'point', undefined, 'plot_width', []).value,
          [defaultConfig.scale.minOpacity, defaultConfig.scale.maxOpacity]
        );
      });
    });

    describe('size', function() {
      describe('bar', function() {
        it('should return [minBandSize, maxBandSize] if both are specified', () => {
          const config = {
            scale: {minBandSize: 2, maxBandSize: 9}
          };
          assert.deepEqual(
            parseRangeForChannel('size', 'linear', QUANTITATIVE, {}, config, undefined, 'bar', undefined, 'plot_width', []).value,
            [2, 9]
          );
        });

        it('should return [continuousBandSize, xRangeStep-1] by default since min/maxSize config are not specified', () => {
          assert.deepEqual(
            parseRangeForChannel('size', 'linear', QUANTITATIVE, {}, defaultConfig, undefined, 'bar', undefined, 'plot_width', []).value,
            [defaultConfig.bar.continuousBandSize, defaultConfig.scale.rangeStep - 1]
          );
        });
      });

      describe('tick', function() {
        it('should return [minBandSize, maxBandSize] if both are specified', () => {
          const config = {
            scale: {minBandSize: 4, maxBandSize: 9}
          };
          assert.deepEqual(
            parseRangeForChannel('size', 'linear', QUANTITATIVE, {}, config, undefined, 'tick', undefined, 'plot_width', []).value,
            [4, 9]
          );
        });

        it('should return [(default)minBandSize, rangeStep-1] by default since maxSize config is not specified', () => {
          assert.deepEqual(
            parseRangeForChannel('size', 'linear', QUANTITATIVE, {}, defaultConfig, undefined, 'tick', undefined, 'plot_width', []).value,
            [defaultConfig.scale.minBandSize, defaultConfig.scale.rangeStep - 1]
          );
        });
      });

      describe('text', function() {
        it('should return [minFontSize, maxFontSize]', () => {
          assert.deepEqual(
            parseRangeForChannel('size', 'linear', QUANTITATIVE, {}, defaultConfig, undefined, 'text', undefined, 'plot_width', []).value,
            [defaultConfig.scale.minFontSize, defaultConfig.scale.maxFontSize]
          );
        });
      });

      describe('rule', function() {
        it('should return [minStrokeWidth, maxStrokeWidth]', () => {
          assert.deepEqual(
            parseRangeForChannel('size', 'linear', QUANTITATIVE, {}, defaultConfig, undefined, 'rule', undefined, 'plot_width', []).value,
            [defaultConfig.scale.minStrokeWidth, defaultConfig.scale.maxStrokeWidth]
          );
        });
      });

      describe('point, square, circle', function() {
        it('should return [minSize, maxSize]', () => {
          for (const m of ['point', 'square', 'circle'] as Mark[]) {
            const config = {
              scale: {
                minSize: 5,
                maxSize: 25

              }
            };

            assert.deepEqual(
              parseRangeForChannel('size', 'linear', QUANTITATIVE, {}, config, undefined, m, undefined, 'plot_width', []).value,
              [5, 25]
            );
          }
        });

        it('should return [0, (minBandSize-2)^2] if both x and y are discrete and size is quantitative (thus use zero=true, by default)', () => {
          for (const m of ['point', 'square', 'circle'] as Mark[]) {
            assert.deepEqual(
              parseRangeForChannel('size', 'linear', QUANTITATIVE, {}, defaultConfig, true, m, undefined, 'plot_width',
                [11, 13] // xyRangeSteps
              ).value,
              [0, 81]
            );
          }
        });

        it('should return [9, (minBandSize-2)^2] if both x and y are discrete and size is not quantitative (thus use zero=false, by default)', () => {
          for (const m of ['point', 'square', 'circle'] as Mark[]) {
            assert.deepEqual(
              parseRangeForChannel('size', 'linear', QUANTITATIVE, {}, defaultConfig,  false, m, undefined, 'plot_width',
                [11, 13] // xyRangeSteps
              ).value,
              [9, 81]
            );
          }
        });

        it('should return [9, (minBandSize-2)^2] if both x and y are discrete and size is quantitative but use zero=false', () => {
          for (const m of ['point', 'square', 'circle'] as Mark[]) {
            assert.deepEqual(
              parseRangeForChannel('size', 'linear', QUANTITATIVE, {}, defaultConfig, false, m, undefined, 'plot_width',
                [11, 13] // xyRangeSteps
              ).value,
              [9, 81]
            );
          }
        });

        it('should return [0, (xRangeStep-2)^2] if x is discrete and y is continuous and size is quantitative (thus use zero=true, by default)', () => {
            for (const m of ['point', 'square', 'circle'] as Mark[]) {
            assert.deepEqual(
              parseRangeForChannel('size', 'linear', QUANTITATIVE, {}, defaultConfig, true, m, undefined, 'plot_width',
                [11] // xyRangeSteps only have one value
              ).value,
              [0, 81]
            );
          }
        });
      });
    });

    describe('shape', function() {
      it('should use default symbol range in Vega as shape\'s scale range.', () => {
        assert.deepEqual(
          parseRangeForChannel('shape', 'ordinal', QUANTITATIVE, {}, defaultConfig, undefined, 'point', undefined, 'plot_width', []).value,
          'symbol'
        );
      });
    });
  });
});
