/* tslint:disable:quotemark */

import {assert} from 'chai';
import {toSet} from 'vega-util';
import {parseScale, parseScaleCore} from '../../../src/compile/scale/parse';
import {SELECTION_DOMAIN} from '../../../src/compile/selection/selection';
import * as log from '../../../src/log';
import {NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES, SCALE_PROPERTIES} from '../../../src/scale';
import {without} from '../../../src/util';
import {parseModel, parseModelWithScale, parseUnitModelWithScale} from '../../util';

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

    it('correctly ignores x/y when lon/lat', () => {
      const model = parseModel({
        "data": {
          "url": "data/zipcodes.csv",
          "format": {
            "type": "csv"
          }
        },
        "mark": "point",
        "encoding": {
          "x": {
            "field": "longitude",
            "type": "longitude"
          },
          "y": {
            "field": "latitude",
            "type": "latitude"
          }
        }
      });
      parseScaleCore(model);
      assert.isUndefined(model.getScaleComponent('x'));
      assert.isUndefined(model.getScaleComponent('y'));
    });

    it('correctly ignores shape when geojson', () => {
      const model = parseModel({
        "mark": "geoshape",
        "data": {"url": "data/income.json"},
        "transform": [
          {
            "lookup": "id",
            "from": {
              "data": {
                "url": "data/us-10m.json",
                "format": {"type": "topojson","feature": "states"}
              },
              "key": "id"
            },
            "as": "geo"
          }
        ],
        "encoding": {
          "shape": {"field": "geo","type": "geojson"},
        }
      });
      parseScaleCore(model);
      assert.isUndefined(model.getScaleComponent('shape'));
    });
  });

  describe('parseScale', () => {
    it('does not throw warning when two equivalent objects are specified', log.wrap((logger) => {
      const model = parseModel({
        "data": {"url": "data/seattle-weather.csv"},
        "layer": [
          {
            "mark": "circle",
            "encoding": {
              "y": {
                "field": "a",
                "type": "nominal",
                "scale": {"rangeStep": 17}
              }
            }
          },
          {
            "mark": "point",
            "encoding": {
              "y": {
                "field": "a",
                "type": "nominal",
                "scale": {"rangeStep": 17}
              }
            }
          }
        ]
      });
      parseScale(model);
      assert.deepEqual(model.getScaleComponent('y').explicit.range, {step: 17});
      assert.equal(logger.warns.length, 0);
    }));

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

    describe('ordinal color with bin', function() {
      const model = parseUnitModelWithScale({
          mark: "point",
          encoding: {
            color: {field: "origin", type: "ordinal", bin: true}
          }
        });

      const scale = model.getScaleComponent('color');

      it('should add correct scales', function() {
        assert.equal(scale.implicit.name, 'color');
        assert.equal(scale.implicit.type, 'ordinal');
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
          SELECTION_DOMAIN + '{"encoding":"x","selection":"brush"}');

        assert.property(yscale.explicit, 'domainRaw');
        assert.propertyVal(yscale.explicit.domainRaw, 'signal',
          SELECTION_DOMAIN + '{"field":"Miles_per_Gallon","selection":"foobar"}');
      });
    });
  });

  describe('parseScaleDomain', function() {
    describe('faceted domains', function() {
      it('should use cloned subtree', function() {
        const model = parseModelWithScale({
          facet: {
            row: {field: "symbol", type: "nominal"}
          },
          data: {url: "foo.csv"},
          spec: {
            mark: 'point',
            encoding: {
              x: {field: 'a', type: 'quantitative'},
            }
          }
        });

        assert.deepEqual(model.component.scales.x.domains, [{
          data: 'scale_child_main',
          field: 'a'
        }]);
      });

      it('should not use cloned subtree if the data is not faceted', function() {
        const model = parseModelWithScale({
          facet: {
            row: {field: "symbol", type: "nominal"}
          },
          data: {url: "foo.csv"},
          spec: {
            data: {url: 'foo'},
            mark: 'point',
            encoding: {
              x: {field: 'a', type: 'quantitative'},
            }
          }
        });

        assert.deepEqual(model.component.scales.x.domains, [{
          data: 'child_main',
          field: 'a'
        }]);
      });

      it('should not use cloned subtree if the scale is independent', function() {
        const model = parseModelWithScale({
          facet: {
            row: {field: "symbol", type: "nominal"}
          },
          data: {url: "foo.csv"},
          spec: {
            mark: 'point',
            encoding: {
              x: {field: 'a', type: 'quantitative'},
            }
          },
          resolve: {
            scale: {
              x: 'independent'
            }
          }
        });

        assert.deepEqual(model.children[0].component.scales.x.domains, [{
          data: 'child_main',
          field: 'a'
        }]);
      });
    });
  });
});
