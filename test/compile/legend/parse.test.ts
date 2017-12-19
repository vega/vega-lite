/* tslint:disable:quotemark */

import {assert} from 'chai';
import {COLOR, OPACITY, SHAPE, SIZE} from '../../../src/channel';
import * as legendParse from '../../../src/compile/legend/parse';
import {isFieldDef} from '../../../src/fielddef';
import {UnitSpec} from '../../../src/spec';
import {GEOJSON} from '../../../src/type';
import {parseLayerModel, parseUnitModelWithScale} from '../../util';

describe('compile/legend', function() {
  describe('parseLegendForChannel()', function() {
    it('should produce a Vega legend object with correct type and scale for color', function() {
      const model = parseUnitModelWithScale({
        mark: "point",
        encoding: {
          x: {field: "a", type: "nominal"},
          color: {field: "a", type: "quantitative"}
        }
      });

      const def = legendParse.parseLegendForChannel(model, COLOR).combine();
      assert.isObject(def);
      assert.equal(def.title, 'a');
      assert.equal(def.stroke, 'color');
      assert.equal(def.type, 'gradient');
    });

    [SIZE, SHAPE, OPACITY].forEach(channel => {
      it(`should produce a Vega legend object with correct type and scale for ${channel}`, function() {
        const spec: UnitSpec = {
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"}
          }
        };
        spec.encoding[channel] = {field: "a", type: "nominal"};

        const model = parseUnitModelWithScale(spec);

        const def = legendParse.parseLegendForChannel(model, channel).combine();

        const channelDef = model.encoding[channel];
        if (isFieldDef(channelDef)) {
          assert.notEqual(channelDef.type, GEOJSON);
        }

        if (channel !== OPACITY) {
          assert.equal(def.encode.symbols.update.opacity.value, 0.7);
        } else {
          assert.isUndefined(def.encode.symbols.update.opacity);
        }
        assert.isObject(def);
        assert.equal(def.title, "a");
      });
    });

    it(`should not produce a Vega legend object when channel is 'shape' with type 'geojson'`, function() {
      const spec: UnitSpec = {
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
          "shape": {"field": "geo", "type": "geojson"}
        }
      };

      const model = parseUnitModelWithScale(spec);
      const channelDef = model.encoding[SHAPE];
      assert.isTrue(isFieldDef(channelDef));
      if (isFieldDef(channelDef)) {
        assert.equal(channelDef.type, GEOJSON);
      }
      const def = legendParse.parseLegendForChannel(model, SHAPE);
      assert.isUndefined(def);
    });
  });

  describe('parseNonUnitLegend()', () => {
    it('should correctly merge orient by favoring explicit orient', () => {
      const model = parseLayerModel({
        "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
        "description": "Google's stock price over time.",
        "data": {"url": "data/stocks.csv"},
        "layer": [
          {
            "mark": "line",
            "encoding": {
              "x": {"field": "date", "type": "temporal"},
              "y": {"field": "price", "type": "quantitative"},
              "color": {"field": "symbol", "type": "nominal"}
            }
          },{
            "mark": {"type":"point", "filled": true},
            "encoding": {
              "x": {"field": "date", "type": "temporal"},
              "y": {"field": "price", "type": "quantitative"},
              "color": {"field": "symbol", "type": "nominal", "legend": {"orient": "left"}}
            }
          }
        ]
      });
      model.parseScale();
      model.parseLegend();
      assert.equal(model.component.legends.color.explicit.orient, 'left');
    });

    it('should correctly merge legend that exists only on one plot', () => {
      const model = parseLayerModel({
        "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
        "description": "Google's stock price over time.",
        "data": {"url": "data/stocks.csv"},
        "layer": [
          {
            "mark": "line",
            "encoding": {
              "x": {"field": "date", "type": "temporal"},
              "y": {"field": "price", "type": "quantitative"}
            }
          },{
            "mark": {"type":"point", "filled": true},
            "encoding": {
              "x": {"field": "date", "type": "temporal"},
              "y": {"field": "price", "type": "quantitative"},
              "color": {"field": "symbol", "type": "nominal"}
            }
          }
        ]
      });
      model.parseScale();
      model.parseLegend();
      assert.isOk(model.component.legends.color);
      assert.isUndefined(model.children[0].component.legends.color);
      assert.isUndefined(model.children[1].component.legends.color);
    });
  });
});
