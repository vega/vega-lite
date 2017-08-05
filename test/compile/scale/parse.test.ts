/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseScaleCore} from '../../../src/compile/scale/parse';
import {SELECTION_DOMAIN} from '../../../src/compile/selection/selection';
import * as log from '../../../src/log';
import {NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES, SCALE_PROPERTIES} from '../../../src/scale';
import {toSet, without} from '../../../src/util';
import {parseModel, parseUnitModelWithScale} from '../../util';

describe('src/compile', function() {
  it('NON_TYPE_RANGE_SCALE_PROPERTIES should be SCALE_PROPERTIES wihtout type, domain, and range properties', () => {
    assert.deepEqual(
      toSet(NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES),
      toSet(without(SCALE_PROPERTIES, ['type', 'domain', 'range', 'rangeStep', 'scheme']))
    );
  });

  describe('parseScaleCore', () => {
    it('respects explicit scale type', () => {
      const model = parseModel({
        "data": {"url": "data/seattle-weather.csv"},
        "layer": [
          {
            "mark": "bar",
            "encoding": {
              "y": {
                "aggregate": "mean",
                "field": "precipitation",
                "type": "quantitative"
              }
            }
          },
          {
            "mark": "rule",
            "encoding": {
              "y": {
                "aggregate": "mean",
                "field": "precipitation",
                "type": "quantitative",
                "scale": {"type": "log"}
              }
            }
          }
        ]
      });
      parseScaleCore(model);
      assert.equal(model.getScaleComponent('y').explicit.type, 'log');
    });

    it('respects explicit scale type', () => {
      const model = parseModel({
        "data": {"url": "data/seattle-weather.csv"},
        "layer": [
          {
            "mark": "bar",
            "encoding": {
              "y": {
                "aggregate": "mean",
                "field": "precipitation",
                "type": "quantitative",
                "scale": {"type": "log"}
              }
            }
          },
          {
            "mark": "rule",
            "encoding": {
              "y": {
                "aggregate": "mean",
                "field": "precipitation",
                "type": "quantitative"
              }
            }
          }
        ]
      });
      parseScaleCore(model);
      assert.equal(model.getScaleComponent('y').explicit.type, 'log');
    });

    // TODO: this actually shouldn't get merged
    it('favors the first explicit scale type', log.wrap((localLogger) => {
      const model = parseModel({
        "data": {"url": "data/seattle-weather.csv"},
        "layer": [
          {
            "mark": "bar",
            "encoding": {
              "y": {
                "aggregate": "mean",
                "field": "precipitation",
                "type": "quantitative",
                "scale": {"type": "log"}
              }
            }
          },
          {
            "mark": "rule",
            "encoding": {
              "y": {
                "aggregate": "mean",
                "field": "precipitation",
                "type": "quantitative",
                "scale": {"type": "pow"}
              }
            }
          }
        ]
      });
      parseScaleCore(model);
      assert.equal(model.getScaleComponent('y').explicit.type, 'log');
      assert.equal(localLogger.warns[0], log.message.mergeConflictingProperty('type', 'scale', 'log', 'pow'));
    }));

    it('favors the band over point', () => {
      const model = parseModel({
        "data": {"url": "data/seattle-weather.csv"},
        "layer": [
          {
            "mark": "point",
            "encoding": {
              "y": {
                "aggregate": "mean",
                "field": "precipitation",
                "type": "quantitative"
              },
              "x": {"field": "weather", "type": "nominal"}
            }
          },{
            "mark": "bar",
            "encoding": {
              "y": {
                "aggregate": "mean",
                "field": "precipitation",
                "type": "quantitative"
              },
              "x": {"field": "weather", "type": "nominal"}
            }
          },
        ]
      });
      parseScaleCore(model);
      assert.equal(model.getScaleComponent('x').implicit.type, 'band');
    });
  });

  describe('parseScale', () => {
    describe('x ordinal point', () => {
      it('should create an x point scale with rangeStep and no range', () => {
        const model = parseUnitModelWithScale({
          mark: "point",
          encoding: {
            x: {field: 'origin', type: "nominal"}
          }
        });
        const scale = model.getScaleComponent('x');
        assert.equal(scale.implicit.type, 'point');
        assert.deepEqual(scale.implicit.range, {step: 21});
      });
    });

    it('should output only padding without default paddingInner and paddingOuter if padding is specified for a band scale', () => {
      const model = parseUnitModelWithScale({
        mark: 'bar',
        encoding: {
          x: {field: 'origin', type: "nominal", scale: {type: 'band', padding: 0.6}}
        }
      });
      const scale = model.getScaleComponent('x');
      assert.equal(scale.explicit.padding, 0.6);
      assert.isUndefined(scale.get('paddingInner'));
      assert.isUndefined(scale.get('paddingOuter'));
    });

    it('should output default paddingInner and paddingOuter = paddingInner/2 if none of padding properties is specified for a band scale', () => {
      const model = parseUnitModelWithScale({
        mark: 'bar',
        encoding: {
          x: {field: 'origin', type: "nominal", scale: {type: 'band'}}
        },
        config: {
          scale: {bandPaddingInner: 0.3}
        }
      });
      const scale = model.getScaleComponent('x');
      assert.equal(scale.implicit.paddingInner, 0.3);
      assert.equal(scale.implicit.paddingOuter, 0.15);
      assert.isUndefined(scale.get('padding'));
    });

    describe('nominal with color', function() {
      const model = parseUnitModelWithScale({
        mark: "point",
        encoding: {
          color: {field: 'origin', type: "nominal"}
        }
      });

      const scale = model.getScaleComponent('color');

      it('should create correct color scale', function() {
        assert.equal(scale.implicit.name, 'color');
        assert.equal(scale.implicit.type, 'ordinal');
        assert.deepEqual(scale.domains, [{
          data: 'main',
          field: 'origin',
          sort: true
        }]);
        assert.equal(scale.implicit.range, 'category');
      });
    });

    describe('ordinal with color', function() {
      const model = parseUnitModelWithScale({
        mark: "point",
        encoding: {
          color: {field: 'origin', type: "ordinal"}
        }
      });

      const scale = model.getScaleComponent('color');

      it('should create sequential color scale', function() {
        assert.equal(scale.implicit.name, 'color');
        assert.equal(scale.implicit.type, 'ordinal');

        assert.deepEqual(scale.domains, [{
          data: 'main',
          field: 'origin',
          sort: true
        }]);
      });
    });

    describe('quantitative with color', function() {
      const model = parseUnitModelWithScale({
          mark: "point",
          encoding: {
            color: {field: "origin", type: "quantitative"}
          }
        });

      const scale = model.getScaleComponent('color');

      it('should create linear color scale', function() {
        assert.equal(scale.implicit.name, 'color');
        assert.equal(scale.implicit.type, 'sequential');
        assert.equal(scale.implicit.range, 'ramp');

        assert.deepEqual(scale.domains, [{
          data: 'main',
          field: 'origin'
        }]);
      });
    });

    describe('color with bin', function() {
      const model = parseUnitModelWithScale({
          mark: "point",
          encoding: {
            color: {field: "origin", type: "quantitative", bin: true}
          }
        });

      const scale = model.getScaleComponent('color');

      it('should add correct scales', function() {
        assert.equal(scale.implicit.name, 'color');
        assert.equal(scale.implicit.type, 'bin-ordinal');
      });
    });

    describe('opacity with bin', function() {
      const model = parseUnitModelWithScale({
          mark: "point",
          encoding: {
            opacity: {field: "origin", type: "quantitative", bin: true}
          }
        });

      const scale = model.getScaleComponent('opacity');

      it('should add correct scales', function() {
        assert.equal(scale.implicit.name, 'opacity');
        assert.equal(scale.implicit.type, 'bin-linear');
      });
    });

    describe('size with bin', function() {
      const model = parseUnitModelWithScale({
          mark: "point",
          encoding: {
            size: {field: "origin", type: "quantitative", bin: true}
          }
        });

      const scale = model.getScaleComponent('size');

      it('should add correct scales', function() {
        assert.equal(scale.implicit.name, 'size');
        assert.equal(scale.implicit.type, 'bin-linear');
      });
    });

    describe('color with time unit', function() {
      const model = parseUnitModelWithScale({
          mark: "point",
          encoding: {
            color: {field: 'origin', type: "temporal", timeUnit: "year"}
          }
        });

      const scale = model.getScaleComponent('color');

      it('should add correct scales', function() {
        assert.equal(scale.implicit.name, 'color');
        assert.equal(scale.implicit.type, 'sequential');
      });
    });

    describe('selection domain', function() {
      const model = parseUnitModelWithScale({
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

      const xScale = model.getScaleComponent('x');
      const yscale = model.getScaleComponent('y');
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
