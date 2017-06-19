/* tslint:disable:quotemark */

import {assert} from 'chai';
import {color} from '../../../src/compile/mark/mixins';
import {parseUnitModelWithScaleMarkDefLayoutSize} from '../../util';

describe('compile/mark/mixins', () => {
  describe('color()', function() {
    it('color should be mapped to fill for bar', function() {
      const model = parseUnitModelWithScaleMarkDefLayoutSize({
        "mark": "bar",
        "encoding": {
          "x": {
            "field": "gender", "type": "nominal",
            "scale": {"rangeStep": 6},
            "axis": null
          },
          "color": {
            "field": "gender", "type": "nominal",
            "scale": {"range": ["#EA98D2", "#659CCA"]}
          }
        },
        "data": {"url": "data/population.json"}
      });

      const colorMixins = color(model);
      assert.deepEqual(colorMixins.fill, {"field": "gender", "scale": "color"});
    });

    it('color should be mapped to stroke for point', function() {
      const model = parseUnitModelWithScaleMarkDefLayoutSize({
        "mark": "point",
        "encoding": {
          "x": {
            "field": "gender", "type": "nominal",
            "scale": {"rangeStep": 6},
            "axis": null
          },
          "color": {
            "field": "gender", "type": "nominal",
            "scale": {"range": ["#EA98D2", "#659CCA"]}
          }
        },
        "data": {"url": "data/population.json"}
      });

      const colorMixins = color(model);
      assert.deepEqual(colorMixins.stroke, {"field": "gender", "scale": "color"});
      assert.propertyVal(colorMixins.fill, 'value', "transparent");
    });
  });
});
