/* tslint:disable:quotemark */

import { assert } from 'chai';
import { COLOR, OPACITY, SHAPE, SIZE } from '../../../src/channel';
import * as legendParse from '../../../src/compile/legend/parse';
import { parseLegend } from '../../../src/compile/legend/parse';
import { isFieldDef } from '../../../src/fielddef';
import { NormalizedUnitSpec } from '../../../src/spec';
import { GEOJSON } from '../../../src/type';
import { parseLayerModel, parseUnitModelWithScale } from '../../util';

describe('compile/legend', () =>  {
  describe('parseUnitLegend()', () =>  {
    it(`should not produce a Vega legend object on channel 'shape' with type 'geojson'`, () =>  {
      const spec: NormalizedUnitSpec = {
        "mark": "geoshape",
        "data": {"url": "data/income.json"},
        "transform": [
          {
            "lookup": "id",
            "from": {
              "data": {
                "url": "data/us-10m.json",
                "format": {"type": "topojson", "feature": "states"}
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

      const unitModel = parseUnitModelWithScale(spec);
      const channelDef = unitModel.encoding[SHAPE];
      assert.isTrue(isFieldDef(channelDef));
      if (isFieldDef(channelDef)) {
        assert.equal(channelDef.type, GEOJSON);
      }
      parseLegend(unitModel);
      const legendComp = unitModel.component.legends;
      assert.isUndefined(legendComp[SHAPE]);
    });
  });

  describe('parseLegendForChannel()', () =>  {
    it('should produce a Vega legend object with correct type and scale for color', () =>  {
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
    });

    it('should produce no legend title when title is null, "", or false', () =>  {
      for (const val of [null, '', false]) {
        const model = parseUnitModelWithScale({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {
              field: "a", type: "quantitative",
              legend: {title: val as any} // Need to cast as false is not valid, but we want to fall back gracefully
            }
          }
        });

        const def = legendParse.parseLegendForChannel(model, COLOR).combine();
        assert.doesNotHaveAnyKeys(def, ['title']);
      }
    });


    it('should store fieldDef.title as explicit', () =>  {
      const model = parseUnitModelWithScale({
        mark: "point",
        encoding: {
          x: {field: "a", type: "nominal"},
          color: {
            field: "a", type: "quantitative",
            legend: {title: 'foo'} // Need to cast as false is not valid, but we want to fall back gracefully
          }
        }
      });

      const def = legendParse.parseLegendForChannel(model, COLOR).combine();
      assert.equal(def.title, 'foo');
    });

    [SIZE, SHAPE, OPACITY].forEach(channel => {
      it(`should produce a Vega legend object with correct type and scale for ${channel}`, () =>  {
        const spec: NormalizedUnitSpec = {
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
          assert.equal((def.encode.symbols.update.opacity as any).value, 0.7);
        } else {
          assert.isUndefined(def.encode.symbols.update.opacity);
        }
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
