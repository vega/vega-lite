/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseUnitModel} from '../util';

describe('Stack', function() {
  describe('compileStackProperties()', function() {
    it('should return null from horizontal ranged bars with aggregate', function() {
      const model = parseUnitModel({
        mark: "bar",
        encoding: {
          x: {aggregate: "min", field: "yield", type: "quantitative"},
          x2: {aggregate: "max", field: "yield", type: "quantitative"},
          y: {field: "variety", type: "nominal"},
          color: {field: "site", type: "nominal"}
        }
      });
      assert.isNull(model.stack());
    });

    it('should return null from horizontal ranged bars with aggregate', function() {
      const model = parseUnitModel({
        mark: "bar",
        encoding: {
          y: {aggregate: "min", field: "yield", type: "quantitative"},
          y2: {aggregate: "max", field: "yield", type: "quantitative"},
          x: {field: "variety", type: "nominal"},
          color: {field: "site", type: "nominal"}
        }
      });
      assert.isNull(model.stack());
    });
  });
});
