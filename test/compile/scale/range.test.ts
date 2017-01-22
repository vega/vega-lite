/* tslint:disable:quotemark */

import {assert} from 'chai';

import rangeMixins from '../../../src/compile/scale/range';

import {defaultConfig} from '../../../src/config';
import * as log from '../../../src/log';
import * as mark from '../../../src/mark';
import {Mark} from '../../../src/mark';
import {CONTINUOUS_TO_CONTINUOUS_SCALES, ScaleType} from '../../../src/scale';

describe('compile/scale', () => {
  describe('rangeMixins()', function() {
    describe('row', function() {
      it('should always return {range: height}.', () => {
        assert.deepEqual(
          rangeMixins('row', 'point', {}, defaultConfig, false, undefined, undefined, []),
          {range: 'height'}
        );
      });
    });

    describe('column', function() {
      it('should always return {range: width}.', () => {
        assert.deepEqual(
          rangeMixins('column', 'point', {}, defaultConfig, false, undefined, undefined, []),
          {range: 'width'}
        );
      });
    });

    describe('x/y', function() {
      it('should return config.cell.width for x-continous scales by default.', () => {
        for (let scaleType of CONTINUOUS_TO_CONTINUOUS_SCALES) {
          assert.deepEqual(
            rangeMixins('x', scaleType, {}, defaultConfig, true, 'point', undefined, []),
            {range: [0, 200]}
          );
        }
      });

      it('should return config.cell.height for y-continous scales by default.', () => {
        for (let scaleType of CONTINUOUS_TO_CONTINUOUS_SCALES) {
          assert.deepEqual(
            rangeMixins('y', scaleType, {}, defaultConfig, true, 'point', undefined, []),
            {range: [200, 0]}
          );
        }
      });

      it('should not support custom range.', log.wrap((localLogger) => {
        assert.deepEqual(
          rangeMixins('x', 'linear', {range: [0, 100]}, defaultConfig, true, 'point', undefined, []),
          {range: [0, 200]}
        );
        assert(localLogger.warns[0], log.message.CANNOT_USE_RANGE_WITH_POSITION);
      }));

      it('should return config.scale.rangeStep for band/point scales by default.', () => {
        for (let scaleType of ['point', 'band'] as ScaleType[]) {
          assert.deepEqual(
            rangeMixins('x', scaleType, {}, defaultConfig, undefined, 'point', undefined, []),
            {rangeStep: 21}
          );
        }
      });

      it('should return config.scale.textXRangeStep by default for text mark\'s x band/point scales.', () => {
        for (let scaleType of ['point', 'band'] as ScaleType[]) {
          assert.deepEqual(
            rangeMixins('x', scaleType, {}, {scale: {textXRangeStep: 55}}, undefined, 'text', undefined, []),
            {rangeStep: 55}
          );
        }
      });

      it('should return specified rangeStep if topLevelSize is undefined for band/point scales', () => {
        for (let scaleType of ['point', 'band'] as ScaleType[]) {
          assert.deepEqual(
            rangeMixins('x', scaleType, {rangeStep: 23}, defaultConfig, undefined, 'text', undefined, []),
            {rangeStep: 23}
          );
        }
      });

      it('should drop rangeStep if topLevelSize is specified for band/point scales', log.wrap((localLogger) => {
        for (let scaleType of ['point', 'band'] as ScaleType[]) {
          assert.deepEqual(
            rangeMixins('x', scaleType, {rangeStep: 23}, defaultConfig, undefined, 'text', 123, []),
            {range: [0, 123]}
          );
        }
        assert.equal(localLogger.warns[0], log.message.rangeStepDropped('x'));
      }));

      it('should return default topLevelSize if rangeStep is null for band/point scales', () => {
        for (let scaleType of ['point', 'band'] as ScaleType[]) {
          assert.deepEqual(
            rangeMixins('x', scaleType, {rangeStep: null}, defaultConfig, undefined, 'text', undefined, []),
            {range: [0, 200]}
          );
        }
      });

      it('should return default topLevelSize if rangeStep config is null', () => {
        for (let scaleType of ['point', 'band'] as ScaleType[]) {
          assert.deepEqual(
            rangeMixins('x', scaleType, {}, {cell: {width: 200}, scale: {rangeStep: null}}, undefined, 'point', undefined, []),
            {range: [0, 200]}
          );
        }
      });

      it('should return default topLevelSize for text if textXRangeStep config is null', () => {
        for (let scaleType of ['point', 'band'] as ScaleType[]) {
          assert.deepEqual(
            rangeMixins('x', scaleType, {}, {cell: {width: 200}, scale: {textXRangeStep: null}}, undefined, 'text', undefined, []),
            {range: [0, 200]}
          );
        }
      });

      it('should drop rangeStep for continuous scales', () => {
        for (let scaleType of CONTINUOUS_TO_CONTINUOUS_SCALES) {
          log.wrap((localLogger) => {
            assert.deepEqual(
              rangeMixins('x', scaleType, {rangeStep: 23}, defaultConfig, undefined, 'text', 123, []),
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
          rangeMixins('color', 'ordinal', {range: {scheme: 'warm'}}, defaultConfig, undefined, 'point', undefined, []),
          {range: {scheme: 'warm'}}
        );
      });

      it('should use the specified range scheme string for a nominal color field.', () => {
        assert.deepEqual(
          rangeMixins('color', 'ordinal', {range:'warm'}, defaultConfig, undefined, 'point', undefined, []),
          {range: {scheme: 'warm'}}
        );
      });

      it('should use the specified range for a nominal color field.', () => {
        assert.deepEqual(
          rangeMixins('color', 'ordinal', {range: ['red', 'green', 'blue']}, defaultConfig, undefined, 'point', undefined, []),
          {range: ['red', 'green', 'blue']}
        );
      });

      it('should use {scheme: "category"} for a nominal color field if only extend is provided.', () => {
        assert.deepEqual(
          rangeMixins('color', 'ordinal', {range: {extent: [0.2, 1]}}, defaultConfig, undefined, 'point', undefined, []),
          {range: {scheme: 'category', extent: [0.2, 1]}}
        );
      });

      it('should use {scheme: "category"} for a nominal color field.', () => {
        assert.deepEqual(
          rangeMixins('color', 'ordinal', {}, defaultConfig, undefined, 'point', undefined, []),
          {range: {scheme: 'category'}}
        );
      });

      it('should use {scheme: "ordinal"} for an ordinal color field.', () => {
        assert.deepEqual(
          rangeMixins('color', 'index', {}, defaultConfig,  undefined, 'point', undefined, []),
          {range: {scheme: 'ordinal'}}
        );
      });

      it('should use {scheme: "ramp"} for a temporal/quantitative color field.', () => {
        assert.deepEqual(
          rangeMixins('color', 'sequential', {}, defaultConfig, undefined, 'point', undefined, []),
          {range: {scheme: 'ramp'}}
        );
      });
    });

    describe('opacity', function() {
      it('should use default opacityRange as opacity\'s scale range.', () => {
        assert.deepEqual(
          rangeMixins('opacity', 'linear', {}, defaultConfig, undefined, 'point', undefined, []),
          {range: [mark.defaultMarkConfig.minOpacity, mark.defaultMarkConfig.maxOpacity]}
        );
      });
    });

    describe('size', function() {
      describe('bar', function() {
        it('should return [minBandSize, maxBandSize] if both are specified', () => {
          const config = {
            bar: {minBandSize: 2, maxBandSize: 9}
          };
          assert.deepEqual(
            rangeMixins('size', 'linear', {}, config, undefined, 'bar', undefined, []),
            {range: [2, 9]}
          );
        });

        it('should return [continuousBandSize, xRangeStep-1] by default since min/maxSize config are not specified', () => {
          assert.deepEqual(
            rangeMixins('size', 'linear', {}, defaultConfig, undefined, 'bar', undefined, []),
            {range: [defaultConfig.bar.continuousBandSize, defaultConfig.scale.rangeStep - 1]}
          );
        });
      });

      describe('tick', function() {
        it('should return [minBandSize, maxBandSize] if both are specified', () => {
          const config = {
            tick: {minBandSize: 4, maxBandSize: 9}
          };
          assert.deepEqual(
            rangeMixins('size', 'linear', {}, config, undefined, 'tick', undefined, []),
            {range: [4, 9]}
          );
        });

        it('should return [(default)minBandSize, rangeStep-1] by default since maxSize config is not specified', () => {
          assert.deepEqual(
            rangeMixins('size', 'linear', {}, defaultConfig, undefined, 'tick', undefined, []),
            {range: [defaultConfig.tick.minBandSize, defaultConfig.scale.rangeStep - 1]}
          );
        });
      });

      describe('text', function() {
        it('should return [minFontSize, maxFontSize]', () => {
          assert.deepEqual(
            rangeMixins('size', 'linear', {}, defaultConfig, undefined, 'text', undefined, []),
            {range: [defaultConfig.text.minFontSize, defaultConfig.text.maxFontSize]}
          );
        });
      });

      describe('rule', function() {
        it('should return [minStrokeWidth, maxStrokeWidth]', () => {
          assert.deepEqual(
            rangeMixins('size', 'linear', {}, defaultConfig, undefined, 'rule', undefined, []),
            {range: [defaultConfig.rule.minStrokeWidth, defaultConfig.rule.maxStrokeWidth]}
          );
        });
      });

      describe('point, square, circle', function() {
        it('should return [minSize, maxSize]', () => {
          for (let m of ['point', 'square', 'circle'] as Mark[]) {
            let config = {};
            config[m] = {
              minSize: 5,
              maxSize: 25
            };

            assert.deepEqual(
              rangeMixins('size', 'linear', {}, config, undefined, m, undefined, []),
              {range: [5, 25]}
            );
          }
        });

        it('should return [0, (minBandSize-2)^2] if both x and y are discrete and size is quantitative (thus use zero=true, by default)', () => {
          for (let m of ['point', 'square', 'circle'] as Mark[]) {
            assert.deepEqual(
              rangeMixins('size', 'linear', {}, defaultConfig, true, m, undefined,
                [11, 13] // xyRangeSteps
              ),
              {range: [0, 81]}
            );
          }
        });

        it('should return [9, (minBandSize-2)^2] if both x and y are discrete and size is not quantitative (thus use zero=false, by default)', () => {
          for (let m of ['point', 'square', 'circle'] as Mark[]) {
            assert.deepEqual(
              rangeMixins('size', 'linear', {}, defaultConfig,  false, m, undefined,
                [11, 13] // xyRangeSteps
              ),
              {range: [9, 81]}
            );
          }
        });

        it('should return [9, (minBandSize-2)^2] if both x and y are discrete and size is quantitative but use zero=false', () => {
          for (let m of ['point', 'square', 'circle'] as Mark[]) {
            assert.deepEqual(
              rangeMixins('size', 'linear', {}, defaultConfig, false, m, undefined,
                [11, 13] // xyRangeSteps
              ),
              {range: [9, 81]}
            );
          }
        });

        it('should return [0, (xRangeStep-2)^2] if x is discrete and y is continuous and size is quantitative (thus use zero=true, by default)', () => {
            for (let m of ['point', 'square', 'circle'] as Mark[]) {
            assert.deepEqual(
              rangeMixins('size', 'linear', {}, defaultConfig, true, m, undefined,
                [11] // xyRangeSteps only have one value
              ),
              {range: [0, 81]}
            );
          }
        });
      });
    });

    describe('shape', function() {
      it('should use default symbol scheme as shape\'s scale range.', () => {
        assert.deepEqual(
          rangeMixins('shape', 'ordinal', {}, defaultConfig, undefined, 'point', undefined, []),
          {range: {scheme: 'symbol'}}
        );
      });
    });
  });
});
