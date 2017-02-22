/* tslint:disable:quotemark */

import {assert} from 'chai';

import {parseScale, parseDomain} from '../../../src/compile/scale/parse';
import {NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES} from '../../../src/compile/scale/parse';
import {parseUnitModel} from '../../util';


import {SCALE_PROPERTIES} from '../../../src/scale';;
import {toSet, without} from '../../../src/util';

describe('src/compile', function() {
  it('NON_TYPE_RANGE_SCALE_PROPERTIES should be SCALE_PROPERTIES wihtout type, domain, and range properties', () => {
    assert.deepEqual(
      toSet(NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES),
      toSet(without(SCALE_PROPERTIES, ['type', 'domain', 'range', 'rangeStep', 'scheme']))
    );
  });

  describe('parseScale', () => {
    describe('x ordinal point', () => {
      it('should create a main x point scale with rangeStep and no range', () => {
        const model = parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: 'origin', type: "nominal"}
          }
        });
        const scales = parseScale(model, 'x');
        assert.equal(scales.main.type, 'point');
        assert.deepEqual(scales.main.range, {step: 21});
      });
    });

    describe('nominal with color', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          color: {field: 'origin', type: "nominal"}
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
        assert.equal(scales.main.range, 'category');
      });
    });

    describe('ordinal with color', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          color: {field: 'origin', type: "ordinal"}
        }
      });

      const scales = parseScale(model, 'color');

      it('should create ordinal color scale', function() {
        assert.equal(scales.main.name, 'color');
        assert.equal(scales.main.type, 'ordinal');

        assert.deepEqual(scales.main.domain, {
          data: 'source',
          field: 'origin',
          sort: true
        });
      });
    });

    describe('quantitative with color', function() {
      const model = parseUnitModel({
          mark: "point",
          encoding: {
            color: {field: "origin", type: "quantitative"}
          }
        });

      const scales = parseScale(model, 'color');

      it('should create linear color scale', function() {
        assert.equal(scales.main.name, 'color');
        assert.equal(scales.main.type, 'sequential');
        assert.equal(scales.main.range, 'ramp');

        assert.deepEqual(scales.main.domain, {
          data: 'source',
          field: 'origin'
        });
      });
    });

    describe('color with bin', function() {
      const model = parseUnitModel({
          mark: "point",
          encoding: {
            color: {field: "origin", type: "quantitative", bin: true}
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

  describe('parseDomain()', () => {
    it('should have correct domain with x and x2 channel', function() {
      const model = parseUnitModel({
          mark: 'bar',
          encoding: {
            x: {field: 'a', type: 'quantitative'},
            x2: {field: 'b', type: 'quantitative'},
            y: {field: 'c', type: 'quantitative'},
            y2: {field: 'd', type: 'quantitative'}
          }
        });

      const xDomain = parseDomain(model, 'x');
      assert.deepEqual(xDomain, {data: 'source', fields: ['a', 'b']});

      const yDomain = parseDomain(model, 'y');
      assert.deepEqual(yDomain, {data: 'source', fields: ['c', 'd']});
    });

    it('should have correct domain for color', function() {
      const model = parseUnitModel({
          mark: 'bar',
          encoding: {
            color: {field: 'a', type: 'quantitative'},
          }
        });

      const xDomain = parseDomain(model, 'color');
      assert.deepEqual(xDomain, {data: 'source', field: 'a'});
    });
  });

});
