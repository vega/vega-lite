/* tslint:disable:quotemark */

import {assert} from 'chai';

import {parseScale} from '../../../src/compile/scale/parse';
import {parseUnitModel} from '../../util';

describe('src/compile', function() {
  describe('parseScale', () => {
    describe('x ordinal point', () => {
      it('should create a main x point scale with rangeStep and no range', () => {
        const model = parseUnitModel({
          mark: "point",
          encoding: {
            x: { field: 'origin', type: "nominal"}
          }
        });
        const scales = parseScale(model, 'x');
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

      const scales = parseScale(model, 'color');

      it('should create correct main color scale', function() {
        assert.equal(scales.main.name, 'color');
        assert.equal(scales.main.type, 'ordinal');
        assert.deepEqual(scales.main.domain, {
          data: 'source',
          field: 'origin',
          sort: true
        });
        assert.deepEqual(scales.main.range, {scheme: 'category'});
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

      const scales = parseScale(model, 'color');

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

      const scales = parseScale(model, 'color');

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

      const scales = parseScale(model, 'color');

      it('should add correct scales', function() {
        assert.equal(scales.main.name, 'color');
        assert.equal(scales.main.type, 'sequential');
        assert.equal(scales.binLegend, undefined);
        assert.equal(scales.binLegendLabel, undefined);
      });
    });
  });
});
