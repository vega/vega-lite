/* tslint:disable:quotemark */

import {assert} from 'chai';
import {COLOR, OPACITY, SHAPE, SIZE} from '../../../src/channel';
import * as legendParse from '../../../src/compile/legend/parse';
import {UnitSpec} from '../../../src/spec';
import {parseUnitModel, parseUnitModelWithScale} from '../../util';

describe('compile/legend', function() {
  describe('parseLegend()', function() {
    it('should produce a Vega legend object with correct type and scale for color', function() {
      const model = parseUnitModelWithScale({
        mark: "point",
        encoding: {
          x: {field: "a", type: "nominal"},
          color: {field: "a", type: "quantitative"}
        }
      });

      const def = legendParse.parseLegendForChannel(model, COLOR);
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

        const def = legendParse.parseLegendForChannel(model, channel);
        assert.isObject(def);
        assert.equal(def.title, "a");
      });
    });
  });
});
