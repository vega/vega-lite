/* tslint:disable quote */

import {assert} from 'chai';
import {isVertical} from '../../src/compile/config';
import {BAR} from '../../src/mark';
import {parseUnitModel} from '../util';

describe('Config', function() {
  describe('isVertical', function() {
    it('should return correct default', function() {
      const model = parseUnitModel({
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": "foo"},
          "x": {"type": "quantitative", "field": "bar"}
        },
      });
      assert(isVertical(model.mark(), model.encoding()));

      const model2 = parseUnitModel({
        "mark": "bar",
      });
      assert(isVertical(model2.mark(), model2.encoding()));
    });

    it('should return correct orient for vertical bar', function() {
      const model = parseUnitModel({
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": "foo"},
          "x": {"type": "ordinal", "field": "bar"}
        },
      });
      assert(isVertical(model.mark(), model.encoding()));
    });

    it('should return correct orient for horizontal bar', function() {
      const model = parseUnitModel({
        "mark": "bar",
        "encoding": {
          "x": {"type": "quantitative", "field": "foo"},
          "y": {"type": "ordinal", "field": "bar"}
        },
      });
      assert(!isVertical(model.mark(), model.encoding()));
    });

    it('should return correct orient for vertical tick', function() {
      const model = parseUnitModel({
        "mark": "tick",
        "encoding": {
          "x": {"type": "quantitative", "field": "foo"},
          "y": {"type": "ordinal", "field": "bar"}
        },
      });
      assert(isVertical(model.mark(), model.encoding()));
    });

    it('should return correct orient for horizontal tick', function() {
      const model = parseUnitModel({
        "mark": "tick",
        "encoding": {
          "y": {"type": "quantitative", "field": "foo"},
          "x": {"type": "ordinal", "field": "bar"}
        },
      });
      assert(!isVertical(model.mark(), model.encoding()));
    });

    it('should return correct orient for vertical rule', function() {
      const model = parseUnitModel({
        "mark": "rule",
        "encoding": {
          "x": {"type": "quantitative", "field": "foo"},
        },
      });
      assert(isVertical(model.mark(), model.encoding()));
    });

    it('should return correct orient for horizontal rule', function() {
      const model = parseUnitModel({
        "mark": "rule",
        "encoding": {
          "y": {"type": "quantitative", "field": "foo"},
        },
      });
      assert(!isVertical(model.mark(), model.encoding()));
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
      assert(isVertical(model.mark(), model.encoding()));
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
      assert(!isVertical(model.mark(), model.encoding()));
    });

    it('should return correct orient for horizontal rule with range and no ordinal', function() {
      const model = parseUnitModel({
        "mark": "rule",
        "encoding": {
          "x": {"type": "quanitative", "field": "bar"},
          "x2": {"type": "quanitative", "field": "baz"}
        },
      });
      assert(!isVertical(model.mark(), model.encoding()));
    });

    it('should return correct orient for vertical rule with range and no ordinal', function() {
      const model = parseUnitModel({
        "mark": "rule",
        "encoding": {
          "y": {"type": "quanitative", "field": "bar"},
          "y2": {"type": "quanitative", "field": "baz"}
        },
      });
      assert(isVertical(model.mark(), model.encoding()));
    });
  });
});
