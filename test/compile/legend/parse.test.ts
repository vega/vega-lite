/* tslint:disable:quotemark */

import {assert} from 'chai';
import {COLOR, OPACITY, SHAPE, SIZE} from '../../../src/channel';
import * as legendParse from '../../../src/compile/legend/parse';
import {UnitSpec} from '../../../src/spec';
import {parseLayerModel, parseUnitModel, parseUnitModelWithScale} from '../../util';

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
        const s: UnitSpec = {
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"}
          }
        };
        s.encoding[channel] = {field: "a", type: "nominal"};

        const model = parseUnitModelWithScale(s);

        const def = legendParse.parseLegendForChannel(model, channel).combine();
        assert.isObject(def);
        assert.equal(def.title, "a");
      });
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
  });
});
