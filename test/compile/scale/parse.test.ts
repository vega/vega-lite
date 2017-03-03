/* tslint:disable:quotemark */

import {assert} from 'chai';

import {parseScale} from '../../../src/compile/scale/parse';
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
        assert.equal(scales.main.type, 'bin-ordinal');
      });
    });

    describe('ordinal color with bin', function() {
      const model = parseUnitModel({
          mark: "point",
          encoding: {
            color: {field: "origin", type: "ordinal", bin: true}
          }
        });

      const scales = parseScale(model, 'color');

      it('should add correct scales', function() {
        assert.equal(scales.main.name, 'color');
        assert.equal(scales.main.type, 'ordinal');
      });
    });

    describe('opacity with bin', function() {
      const model = parseUnitModel({
          mark: "point",
          encoding: {
            opacity: {field: "origin", type: "quantitative", bin: true}
          }
        });

      const scales = parseScale(model, 'opacity');

      it('should add correct scales', function() {
        assert.equal(scales.main.name, 'opacity');
        assert.equal(scales.main.type, 'bin-linear');
      });
    });

    describe('size with bin', function() {
      const model = parseUnitModel({
          mark: "point",
          encoding: {
            size: {field: "origin", type: "quantitative", bin: true}
          }
        });

      const scales = parseScale(model, 'size');

      it('should add correct scales', function() {
        assert.equal(scales.main.name, 'size');
        assert.equal(scales.main.type, 'bin-linear');
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
      });
    });
  });
});
