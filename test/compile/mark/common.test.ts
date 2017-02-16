/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseUnitModel} from '../../util';
import {applyColor} from '../../../src/compile/mark/common';

describe('compile/mark/common', () => {
  describe('applyColorAndOpacity()', function() {
    it('color should be mapped to fill for bar', function() {
      const model = parseUnitModel({
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

      let p: any = {};
      applyColor(p, model);
      assert.deepEqual(p.fill, {"field": "gender", "scale": "color"});
    });

    it('color should be mapped to stroke for point', function() {
      const model = parseUnitModel({
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

      let p: any = {};
      applyColor(p, model);
      assert.deepEqual(p.stroke, {"field": "gender", "scale": "color"});
      assert.deepEqual(p.fill.value, "transparent");
    });
  });
});
