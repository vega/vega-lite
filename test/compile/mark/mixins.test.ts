/* tslint:disable:quotemark */

import {assert} from 'chai';
import {X, Y} from '../../../src/channel';
import {color, pointPosition} from '../../../src/compile/mark/mixins';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util';

describe('compile/mark/mixins', () => {
  describe('color()', function() {
    it('color should be mapped to fill for bar', function() {
      const model = parseUnitModelWithScaleAndLayoutSize({
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
      const model = parseUnitModelWithScaleAndLayoutSize({
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

  describe('midPoint()', function () {
    it('should return correctly for lat/lng', function () {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "data": {
          "url": "data/zipcodes.csv",
          "format": {
            "type": "csv"
          }
        },
        "mark": "point",
        "encoding": {
          "longitude": {
            "field": "longitude",
            "type": "quantitative"
          },
          "latitude": {
            "field": "latitude",
            "type": "quantitative"
          }
        }
      });

      [X, Y].forEach((channel) => {
        const mixins = pointPosition(channel, model, 'zeroOrMin');
          assert.equal(mixins[channel].field, model.getName(channel));
      });
    });
  });
});
