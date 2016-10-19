/* tslint:disable quotemark */

import {assert} from 'chai';
import {orient} from '../../src/compile/config';
import {Orient} from '../../src/config';
import {parseUnitModel} from '../util';

describe('Config', function() {
  describe('orient', function() {
    it('should return correct default', function() {
      const model = parseUnitModel({
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": "foo"},
          "x": {"type": "quantitative", "field": "bar"}
        },
      });
      assert.equal(orient(model.mark(), model.encoding()), Orient.VERTICAL);

      const model2 = parseUnitModel({
        "mark": "bar",
      });
      assert.equal(orient(model2.mark(), model2.encoding()), Orient.VERTICAL);
    });

    it('should return correct orient for vertical bar', function() {
      const model = parseUnitModel({
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": "foo"},
          "x": {"type": "ordinal", "field": "bar"}
        },
      });
      assert.equal(orient(model.mark(), model.encoding()), Orient.VERTICAL);
    });

    it('should return correct orient for horizontal bar', function() {
      const model = parseUnitModel({
        "mark": "bar",
        "encoding": {
          "x": {"type": "quantitative", "field": "foo"},
          "y": {"type": "ordinal", "field": "bar"}
        },
      });
      assert.equal(orient(model.mark(), model.encoding()), Orient.HORIZONTAL);
    });

    it('should return correct orient for vertical bar with raw temporal dimension', function() {
      const model = parseUnitModel({
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": "foo"},
          "x": {"type": "temporal", "field": "bar"}
        },
      });
      assert.equal(orient(model.mark(), model.encoding()), Orient.VERTICAL);
    });

    it('should return correct orient for horizontal bar with raw temporal dimension', function() {
      const model = parseUnitModel({
        "mark": "bar",
        "encoding": {
          "x": {"type": "quantitative", "field": "foo"},
          "y": {"type": "temporal", "field": "bar"}
        },
      });
      assert.equal(orient(model.mark(), model.encoding()), Orient.HORIZONTAL);
    });

    it('should return correct orient for vertical tick', function() {
      const model = parseUnitModel({
        "mark": "tick",
        "encoding": {
          "x": {"type": "quantitative", "field": "foo"},
          "y": {"type": "ordinal", "field": "bar"}
        },
      });
      assert.equal(orient(model.mark(), model.encoding()), Orient.VERTICAL);
    });

    it('should return correct orient for vertical tick with bin', function() {
      const model = parseUnitModel({
        "mark": "tick",
        "encoding": {
          "x": {"type": "quantitative", "field": "foo"},
          "y": {"type": "quantitative", "field": "bar", "bin": true}
        },
      });
      assert.equal(orient(model.mark(), model.encoding()), Orient.VERTICAL);
    });

    it('should return correct orient for vertical tick of continuous timeUnit dotplot', function() {
      const model = parseUnitModel({
        "mark": "tick",
        "encoding": {
          "x": {"type": "temporal", "field": "foo", "timeUnit": "yearmonthdate"},
          "y": {"type": "ordinal", "field": "bar"}
        },
      });
      assert.equal(orient(model.mark(), model.encoding()), Orient.VERTICAL);
    });

    it('should return correct orient for horizontal tick', function() {
      const model = parseUnitModel({
        "mark": "tick",
        "encoding": {
          "y": {"type": "quantitative", "field": "foo"},
          "x": {"type": "ordinal", "field": "bar"}
        },
      });
      assert.equal(orient(model.mark(), model.encoding()), Orient.HORIZONTAL);
    });

    it('should return correct orient for vertical rule', function() {
      const model = parseUnitModel({
        "mark": "rule",
        "encoding": {
          "x": {"type": "quantitative", "field": "foo"},
        },
      });
      assert.equal(orient(model.mark(), model.encoding()), Orient.VERTICAL);
    });

    it('should return correct orient for horizontal rule', function() {
      const model = parseUnitModel({
        "mark": "rule",
        "encoding": {
          "y": {"type": "quantitative", "field": "foo"},
        },
      });
      assert.equal(orient(model.mark(), model.encoding(), {}), Orient.HORIZONTAL);
    });

    it('should return correct orient for vertical rule with range', function() {
      const model = parseUnitModel({
        "mark": "rule",
        "encoding": {
          "x": {"type": "ordinal", "field": "foo"},
          "y": {"type": "quanitative", "field": "bar"},
          "y2": {"type": "quanitative", "field": "baz"}
        },
      });
      assert.equal(orient(model.mark(), model.encoding(), {}), Orient.VERTICAL);
    });

    it('should return correct orient for horizontal rule with range', function() {
      const model = parseUnitModel({
        "mark": "rule",
        "encoding": {
          "y": {"type": "ordinal", "field": "foo"},
          "x": {"type": "quanitative", "field": "bar"},
          "x2": {"type": "quanitative", "field": "baz"}
        },
      });
      assert.equal(orient(model.mark(), model.encoding(), {}), Orient.HORIZONTAL);
    });

    it('should return correct orient for horizontal rule with range and no ordinal', function() {
      const model = parseUnitModel({
        "mark": "rule",
        "encoding": {
          "x": {"type": "quanitative", "field": "bar"},
          "x2": {"type": "quanitative", "field": "baz"}
        },
      });
      assert.equal(orient(model.mark(), model.encoding()), Orient.HORIZONTAL);
    });

    it('should return correct orient for vertical rule with range and no ordinal', function() {
      const model = parseUnitModel({
        "mark": "rule",
        "encoding": {
          "y": {"type": "quanitative", "field": "bar"},
          "y2": {"type": "quanitative", "field": "baz"}
        },
      });
      assert.equal(orient(model.mark(), model.encoding()), Orient.VERTICAL);
    });
  });
});
