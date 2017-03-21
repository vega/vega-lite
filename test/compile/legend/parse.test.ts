/* tslint:disable:quotemark */

import {assert} from 'chai';
import {COLOR, OPACITY, SHAPE, SIZE} from '../../../src/channel';
import * as legendParse from '../../../src/compile/legend/parse';
import {UnitSpec} from '../../../src/spec';
import {parseUnitModel} from '../../util';

describe('compile/legend', function() {
  describe('parseLegend()', function() {
    it('should produce a Vega legend object with correct type and scale for color', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "nominal"},
          color: {field: "a", type: "quantitative"}
        }
      });
      const def = legendParse.parseLegend(model, COLOR);
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
        const model = parseUnitModel(s);

        const def = legendParse.parseLegend(model, channel);
        assert.isObject(def);
        assert.equal(def.title, "a");
      });
    });
  });
});
