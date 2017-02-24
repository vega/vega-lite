/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseUnitModel} from '../../util';
import {COLOR} from '../../../src/channel';
import * as legendParse from '../../../src/compile/legend/parse';

describe('compile/legend', function() {
  describe('parseLegend()', function() {
    it('should produce a Vega axis object with correct type and scale', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "nominal"},
          color: {field: "a", type: "nominal"}
        }
      });
      const def = legendParse.parseLegend(model, COLOR);
      assert.isObject(def);
      assert.equal(def.title, "a");
    });
  });
});
