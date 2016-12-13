/* tslint:disable:quotemark */

import {assert} from 'chai';

import {rangeStep, parseScaleComponent, initScale} from '../../src/compile/scale';
import {parseUnitModel} from '../util';

import * as log from '../../src/log';
import {X} from '../../src/channel';
import {defaultScaleConfig} from '../../src/scale';
import {POINT, TEXT} from '../../src/mark';

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

  describe('reverse()', function() {
    // FIXME
  });
});
