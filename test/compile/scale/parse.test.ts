/* tslint:disable:quotemark */

import {assert} from 'chai';

import {parseScale} from '../../../src/compile/scale/parse';
import {NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES} from '../../../src/compile/scale/parse';
import {SELECTION_DOMAIN} from '../../../src/compile/selection/selection';
import {parseUnitModel} from '../../util';

import {SCALE_PROPERTIES} from '../../../src/scale';
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
      it('should create an x point scale with rangeStep and no range', () => {
        const model = parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: 'origin', type: "nominal"}
          }
        });
        const scale = parseScale(model, 'x');
        assert.equal(scale.implicit.type, 'point');
        assert.deepEqual(scale.implicit.range, {step: 21});
      });
    });

    describe('nominal with color', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          color: {field: 'origin', type: "nominal"}
        }
      });

      const scale = parseScale(model, 'color');

      it('should create correct color scale', function() {
        assert.equal(scale.implicit.name, 'color');
        assert.equal(scale.implicit.type, 'ordinal');
        assert.deepEqual(scale.implicit.domain, {
          data: 'main',
          field: 'origin',
          sort: true
        });
        assert.equal(scale.implicit.range, 'category');
      });
    });

    describe('ordinal with color', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          color: {field: 'origin', type: "ordinal"}
        }
      });

      const scale = parseScale(model, 'color');

      it('should create sequential color scale', function() {
        assert.equal(scale.implicit.name, 'color');
        assert.equal(scale.implicit.type, 'sequential');

        assert.deepEqual(scale.implicit.domain, {
          data: 'main',
          field: 'origin'
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

      const scale = parseScale(model, 'color');

      it('should create linear color scale', function() {
        assert.equal(scale.implicit.name, 'color');
        assert.equal(scale.implicit.type, 'sequential');
        assert.equal(scale.implicit.range, 'ramp');

        assert.deepEqual(scale.implicit.domain, {
          data: 'main',
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

      const scale = parseScale(model, 'color');

      it('should add correct scales', function() {
        assert.equal(scale.implicit.name, 'color');
        assert.equal(scale.implicit.type, 'bin-ordinal');
      });
    });

    describe('ordinal color with bin', function() {
      const model = parseUnitModel({
          mark: "point",
          encoding: {
            color: {field: "origin", type: "ordinal", bin: true}
          }
        });

      const scale = parseScale(model, 'color');

      it('should add correct scales', function() {
        assert.equal(scale.implicit.name, 'color');
        assert.equal(scale.implicit.type, 'sequential');
      });
    });

    describe('opacity with bin', function() {
      const model = parseUnitModel({
          mark: "point",
          encoding: {
            opacity: {field: "origin", type: "quantitative", bin: true}
          }
        });

      const scale = parseScale(model, 'opacity');

      it('should add correct scales', function() {
        assert.equal(scale.implicit.name, 'opacity');
        assert.equal(scale.implicit.type, 'bin-linear');
      });
    });

    describe('size with bin', function() {
      const model = parseUnitModel({
          mark: "point",
          encoding: {
            size: {field: "origin", type: "quantitative", bin: true}
          }
        });

      const scale = parseScale(model, 'size');

      it('should add correct scales', function() {
        assert.equal(scale.implicit.name, 'size');
        assert.equal(scale.implicit.type, 'bin-linear');
      });
    });

    describe('color with time unit', function() {
      const model = parseUnitModel({
          mark: "point",
          encoding: {
            color: {field: 'origin', type: "temporal", timeUnit: "year"}
          }
        });

      const scale = parseScale(model, 'color');

      it('should add correct scales', function() {
        assert.equal(scale.implicit.name, 'color');
        assert.equal(scale.implicit.type, 'sequential');
      });
    });

    describe('selection domain', function() {
      const model = parseUnitModel({
        mark: "area",
        encoding: {
          x: {
            field: "date", type: "temporal",
            scale: {domain: {selection: "brush", encoding: "x"}},
          },
          y: {
            field: "date", type: "temporal",
            scale: {domain: {selection: "foobar", field: "Miles_per_Gallon"}},
          }
        }
      });

      const xScale = parseScale(model, 'x');
      const yscale = parseScale(model, 'y');
      it('should add a raw selection domain', function() {
        assert.property(xScale.explicit, 'domainRaw');
        assert.propertyVal(xScale.explicit.domainRaw, 'signal',
          SELECTION_DOMAIN + '{"selection":"brush","encoding":"x"}');

        assert.property(yscale.explicit, 'domainRaw');
        assert.propertyVal(yscale.explicit.domainRaw, 'signal',
          SELECTION_DOMAIN + '{"selection":"foobar","field":"Miles_per_Gallon"}');
      });
    });
  });
});
