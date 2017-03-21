/* tslint:disable:quotemark */

import {assert} from 'chai';

import {default as rangeMixins, parseRange} from '../../../src/compile/scale/range';

import {defaultConfig} from '../../../src/config';
import * as log from '../../../src/log';
import {Mark} from '../../../src/mark';
import {CONTINUOUS_TO_CONTINUOUS_SCALES, ScaleType} from '../../../src/scale';
import {NOMINAL, ORDINAL, QUANTITATIVE} from '../../../src/type';

describe('compile/scale', () => {
  describe('parseRange()', () => {
    it('should return correct range.step', () => {
      assert.deepEqual(parseRange({rangeStep: 123}), {step: 123});
    });

    it('should return correct range.scheme', () => {
      assert.deepEqual(parseRange({scheme: 'viridis'}), {scheme: 'viridis'});
    });

    it('should return correct range scheme object with count', () => {
      assert.deepEqual(parseRange({scheme: {name: 'viridis', count : 6}}), {scheme: 'viridis', count: 6});
    });

    it('should return correct range scheme object with extent', () => {
      assert.deepEqual(parseRange({scheme: {name: 'viridis', extent: [0.1, 0.9]}}), {scheme: 'viridis', extent: [0.1, 0.9]});
    });

    it('should return correct range', () => {
      assert.deepEqual(parseRange({range: 'category'}), 'category');
    });
  });

  describe('rangeMixins()', function() {
    describe('row', function() {
      it('should always return {range: height}.', () => {
        assert.deepEqual(
          rangeMixins('row', 'point', NOMINAL, {}, defaultConfig, false, undefined, undefined, []),
          {range: 'height'}
        );
      });
    });

    describe('column', function() {
      it('should always return {range: width}.', () => {
        assert.deepEqual(
          rangeMixins('column', 'point', NOMINAL, {}, defaultConfig, false, undefined, undefined, []),
          {range: 'width'}
        );
      });
    });

    describe('x/y', function() {
      it('should return config.cell.width for x-continous scales by default.', () => {
        for (let scaleType of CONTINUOUS_TO_CONTINUOUS_SCALES) {
          assert.deepEqual(
            rangeMixins('x', scaleType, QUANTITATIVE, {}, defaultConfig, true, 'point', undefined, []),
            {range: [0, 200]}
          );
        }
      });

      it('should return config.cell.height for y-continous scales by default.', () => {
        for (let scaleType of CONTINUOUS_TO_CONTINUOUS_SCALES) {
          assert.deepEqual(
            rangeMixins('y', scaleType, QUANTITATIVE, {}, defaultConfig, true, 'point', undefined, []),
            {range: [200, 0]}
          );
        }
      });

      it('should not support custom range.', log.wrap((localLogger) => {
        assert.deepEqual(
          rangeMixins('x', 'linear', QUANTITATIVE, {range: [0, 100]}, defaultConfig, true, 'point', undefined, []),
          {range: [0, 200]}
        );
        assert(localLogger.warns[0], log.message.CANNOT_USE_RANGE_WITH_POSITION);
      }));

      it('should return config.scale.rangeStep for band/point scales by default.', () => {
        for (let scaleType of ['point', 'band'] as ScaleType[]) {
          assert.deepEqual(
            rangeMixins('x', scaleType, NOMINAL, {}, defaultConfig, undefined, 'point', undefined, []),
            {rangeStep: 21}
          );
        }
      });

      it('should return config.scale.textXRangeStep by default for text mark\'s x band/point scales.', () => {
        for (let scaleType of ['point', 'band'] as ScaleType[]) {
          assert.deepEqual(
            rangeMixins('x', scaleType, NOMINAL, {}, {scale: {textXRangeStep: 55}}, undefined, 'text', undefined, []),
            {rangeStep: 55}
          );
        }
      });

      it('should return specified rangeStep if topLevelSize is undefined for band/point scales', () => {
        for (let scaleType of ['point', 'band'] as ScaleType[]) {
          assert.deepEqual(
            rangeMixins('x', scaleType, NOMINAL, {rangeStep: 23}, defaultConfig, undefined, 'text', undefined, []),
            {rangeStep: 23}
          );
        }
      });

      it('should drop rangeStep if topLevelSize is specified for band/point scales', log.wrap((localLogger) => {
        for (let scaleType of ['point', 'band'] as ScaleType[]) {
          assert.deepEqual(
            rangeMixins('x', scaleType, NOMINAL, {rangeStep: 23}, defaultConfig, undefined, 'text', 123, []),
            {range: [0, 123]}
          );
        }
        assert.equal(localLogger.warns[0], log.message.rangeStepDropped('x'));
      }));

      it('should return default topLevelSize if rangeStep is null for band/point scales', () => {
        for (let scaleType of ['point', 'band'] as ScaleType[]) {
          assert.deepEqual(
            rangeMixins('x', scaleType, NOMINAL, {rangeStep: null}, defaultConfig, undefined, 'text', undefined, []),
            {range: [0, 200]}
          );
        }
      });

      it('should return default topLevelSize if rangeStep config is null', () => {
        for (let scaleType of ['point', 'band'] as ScaleType[]) {
          assert.deepEqual(
            rangeMixins('x', scaleType, NOMINAL, {}, {cell: {width: 200}, scale: {rangeStep: null}}, undefined, 'point', undefined, []),
            {range: [0, 200]}
          );
        }
      });

      it('should return default topLevelSize for text if textXRangeStep config is null', () => {
        for (let scaleType of ['point', 'band'] as ScaleType[]) {
          assert.deepEqual(
            rangeMixins('x', scaleType, NOMINAL, {}, {cell: {width: 200}, scale: {textXRangeStep: null}}, undefined, 'text', undefined, []),
            {range: [0, 200]}
          );
        }
      });

      it('should drop rangeStep for continuous scales', () => {
        for (let scaleType of CONTINUOUS_TO_CONTINUOUS_SCALES) {
          log.wrap((localLogger) => {
            assert.deepEqual(
              rangeMixins('x', scaleType, QUANTITATIVE, {rangeStep: 23}, defaultConfig, undefined, 'text', 123, []),
              {range: [0, 123]}
            );
            assert.equal(localLogger.warns[0], log.message.scalePropertyNotWorkWithScaleType(scaleType, 'rangeStep', 'x'));
          })();
        }
      });
    });

    describe('color', function() {
      it('should use the specified scheme for a nominal color field.', () => {
        assert.deepEqual(
          rangeMixins('color', 'ordinal', NOMINAL, {scheme: 'warm'}, defaultConfig, undefined, 'point', undefined, []),
          {scheme: 'warm'}
        );
      });

      it('should use the specified scheme with extent for a nominal color field.', () => {
        assert.deepEqual(
          rangeMixins('color', 'ordinal', NOMINAL, {scheme: {name: 'warm', extent: [0.2, 1]}}, defaultConfig, undefined, 'point', undefined, []),
          {scheme: {name: 'warm', extent: [0.2, 1]}}
        );
      });

      it('should use the specified range for a nominal color field.', () => {
        assert.deepEqual(
          rangeMixins('color', 'ordinal', NOMINAL, {range: ['red', 'green', 'blue']}, defaultConfig, undefined, 'point', undefined, []),
          {range: ['red', 'green', 'blue']}
        );
      });

      it('should use default category range in Vega for a nominal color field.', () => {
        assert.deepEqual(
          rangeMixins('color', 'ordinal', NOMINAL, {}, defaultConfig, undefined, 'point', undefined, []),
          {range: 'category'}
        );
      });

      it('should use default ordinal range in Vega for an ordinal color field.', () => {
        assert.deepEqual(
          rangeMixins('color', 'ordinal', ORDINAL, {}, defaultConfig,  undefined, 'point', undefined, []),
          {range: 'ordinal'}
        );
      });

      it('should use default ramp range in Vega for a temporal/quantitative color field.', () => {
        assert.deepEqual(
          rangeMixins('color', 'sequential', QUANTITATIVE, {}, defaultConfig, undefined, 'point', undefined, []),
          {range: 'ramp'}
        );
      });

      it('should use the specified scheme with count for a quantitative color field.', () => {
        assert.deepEqual(
          rangeMixins('color', 'ordinal', QUANTITATIVE, {scheme: {name: 'viridis', count: 3}}, defaultConfig, undefined, 'point', undefined, []),
          {scheme: {name: 'viridis', count: 3}}
        );
      });
    });

    describe('opacity', function() {
      it('should use default opacityRange as opacity\'s scale range.', () => {
        assert.deepEqual(
          rangeMixins('opacity', 'linear', QUANTITATIVE, {}, defaultConfig, undefined, 'point', undefined, []),
          {range: [defaultConfig.scale.minOpacity, defaultConfig.scale.maxOpacity]}
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
            rangeMixins('size', 'linear', QUANTITATIVE, {}, config, undefined, 'bar', undefined, []),
            {range: [2, 9]}
          );
        });

        it('should return [continuousBandSize, xRangeStep-1] by default since min/maxSize config are not specified', () => {
          assert.deepEqual(
            rangeMixins('size', 'linear', QUANTITATIVE, {}, defaultConfig, undefined, 'bar', undefined, []),
            {range: [defaultConfig.bar.continuousBandSize, defaultConfig.scale.rangeStep - 1]}
          );
        });
      });

      describe('tick', function() {
        it('should return [minBandSize, maxBandSize] if both are specified', () => {
          const config = {
            scale: {minBandSize: 4, maxBandSize: 9}
          };
          assert.deepEqual(
            rangeMixins('size', 'linear', QUANTITATIVE, {}, config, undefined, 'tick', undefined, []),
            {range: [4, 9]}
          );
        });

        it('should return [(default)minBandSize, rangeStep-1] by default since maxSize config is not specified', () => {
          assert.deepEqual(
            rangeMixins('size', 'linear', QUANTITATIVE, {}, defaultConfig, undefined, 'tick', undefined, []),
            {range: [defaultConfig.scale.minBandSize, defaultConfig.scale.rangeStep - 1]}
          );
        });
      });

      describe('text', function() {
        it('should return [minFontSize, maxFontSize]', () => {
          assert.deepEqual(
            rangeMixins('size', 'linear', QUANTITATIVE, {}, defaultConfig, undefined, 'text', undefined, []),
            {range: [defaultConfig.scale.minFontSize, defaultConfig.scale.maxFontSize]}
          );
        });
      });

      describe('rule', function() {
        it('should return [minStrokeWidth, maxStrokeWidth]', () => {
          assert.deepEqual(
            rangeMixins('size', 'linear', QUANTITATIVE, {}, defaultConfig, undefined, 'rule', undefined, []),
            {range: [defaultConfig.scale.minStrokeWidth, defaultConfig.scale.maxStrokeWidth]}
          );
        });
      });

      describe('point, square, circle', function() {
        it('should return [minSize, maxSize]', () => {
          for (let m of ['point', 'square', 'circle'] as Mark[]) {
            let config = {
              scale: {
                minSize: 5,
                maxSize: 25

              }
            };

            assert.deepEqual(
              rangeMixins('size', 'linear', QUANTITATIVE, {}, config, undefined, m, undefined, []),
              {range: [5, 25]}
            );
          }
        });

        it('should return [0, (minBandSize-2)^2] if both x and y are discrete and size is quantitative (thus use zero=true, by default)', () => {
          for (let m of ['point', 'square', 'circle'] as Mark[]) {
            assert.deepEqual(
              rangeMixins('size', 'linear', QUANTITATIVE, {}, defaultConfig, true, m, undefined,
                [11, 13] // xyRangeSteps
              ),
              {range: [0, 81]}
            );
          }
        });

        it('should return [9, (minBandSize-2)^2] if both x and y are discrete and size is not quantitative (thus use zero=false, by default)', () => {
          for (let m of ['point', 'square', 'circle'] as Mark[]) {
            assert.deepEqual(
              rangeMixins('size', 'linear', QUANTITATIVE, {}, defaultConfig,  false, m, undefined,
                [11, 13] // xyRangeSteps
              ),
              {range: [9, 81]}
            );
          }
        });

        it('should return [9, (minBandSize-2)^2] if both x and y are discrete and size is quantitative but use zero=false', () => {
          for (let m of ['point', 'square', 'circle'] as Mark[]) {
            assert.deepEqual(
              rangeMixins('size', 'linear', QUANTITATIVE, {}, defaultConfig, false, m, undefined,
                [11, 13] // xyRangeSteps
              ),
              {range: [9, 81]}
            );
          }
        });

        it('should return [0, (xRangeStep-2)^2] if x is discrete and y is continuous and size is quantitative (thus use zero=true, by default)', () => {
            for (let m of ['point', 'square', 'circle'] as Mark[]) {
            assert.deepEqual(
              rangeMixins('size', 'linear', QUANTITATIVE, {}, defaultConfig, true, m, undefined,
                [11] // xyRangeSteps only have one value
              ),
              {range: [0, 81]}
            );
          }
        });
      });
    });

    describe('shape', function() {
      it('should use default symbol range in Vega as shape\'s scale range.', () => {
        assert.deepEqual(
          rangeMixins('shape', 'ordinal', QUANTITATIVE, {}, defaultConfig, undefined, 'point', undefined, []),
          {range: 'symbol'}
        );
      });
    });
  });
});
