/* tslint:disable quotemark */

import * as log from '../../../src/log';

import {assert} from 'chai';
import {BAR, CIRCLE, Mark, POINT, PRIMITIVE_MARKS, SQUARE, TICK} from '../../../src/mark';
import {without} from '../../../src/util';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util';

describe('compile/mark/init', function() {
  describe('defaultOpacity', () => {
    it('should return 0.7 by default for unaggregated point, tick, circle, and square', () => {
      for (const mark of [POINT, TICK, CIRCLE, SQUARE]) {
        const model = parseUnitModelWithScaleAndLayoutSize({
          mark,
          "encoding": {
            "y": {"type": "quantitative", "field": "foo"},
            "x": {"type": "quantitative", "field": "bar"}
          },
        });
        assert.equal(model.markDef.opacity, 0.7);
      }
    });

    it('should return undefined by default for aggregated point, tick, circle, and square', () => {
      for (const mark of [POINT, TICK, CIRCLE, SQUARE]) {
        const model = parseUnitModelWithScaleAndLayoutSize({
          mark,
          "encoding": {
            "y": {"aggregate": "mean", "type": "quantitative", "field": "foo"},
            "x": {"type": "nominal", "field": "bar"}
          },
        });
        assert.equal(model.markDef.opacity, undefined);
      }
    });

    it('should use specified opacity', () => {
      for (const mark of [POINT, TICK, CIRCLE, SQUARE]) {
        const model = parseUnitModelWithScaleAndLayoutSize({
          mark: {type: mark, opacity: 0.9},
          "encoding": {
            "y": {"type": "quantitative", "field": "foo"},
            "x": {"type": "quantitative", "field": "bar"}
          },
        });
        assert.equal(model.markDef.opacity, 0.9);
      }
    });

    it('should return undefined by default for other marks', () => {
      const otherMarks = without(PRIMITIVE_MARKS, [POINT, TICK, CIRCLE, SQUARE]);
      for (const mark of otherMarks) {
        const model = parseUnitModelWithScaleAndLayoutSize({
          mark,
          "encoding": {
            "y": {"type": "quantitative", "field": "foo"},
            "x": {"type": "nominal", "field": "bar"}
          },
        });
        assert.equal(model.markDef.opacity, undefined);
      }
    });
  });

  describe('orient', function() {
    it('should return correct default for QxQ', log.wrap((localLogger) => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": "foo"},
          "x": {"type": "quantitative", "field": "bar"}
        },
      });
      assert.equal(model.markDef.orient, 'vertical');
      assert.equal(localLogger.warns[0], log.message.unclearOrientContinuous(BAR));
    }));

    it('should return correct default for empty plot', log.wrap((localLogger) => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": "bar",
        encoding: {}
      });
      assert.equal(model.markDef.orient, undefined);
      assert.equal(localLogger.warns[0], log.message.unclearOrientDiscreteOrEmpty(BAR));
    }));

    it('should return correct orient for bar with both axes discrete', log.wrap((localLogger) => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": "bar",
        "encoding": {
          "x": {"type": "ordinal", "field": "foo"},
          "y": {"type": "ordinal", "field": "bar"}
        },
      });
      assert.equal(model.markDef.orient, undefined);
      assert.equal(localLogger.warns[0], log.message.unclearOrientDiscreteOrEmpty(BAR));
    }));


    it('should return correct orient for vertical bar', function() {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": "foo"},
          "x": {"type": "ordinal", "field": "bar"}
        },
      });
      assert.equal(model.markDef.orient, 'vertical');
    });

    it('should return correct orient for horizontal bar', function() {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": "bar",
        "encoding": {
          "x": {"type": "quantitative", "field": "foo"},
          "y": {"type": "ordinal", "field": "bar"}
        },
      });
      assert.equal(model.markDef.orient, 'horizontal');
    });

    it('should return correct orient for vertical bar with raw temporal dimension', function() {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": "foo"},
          "x": {"type": "temporal", "field": "bar"}
        },
      });
      assert.equal(model.markDef.orient, 'vertical');
    });

    it('should return correct orient for horizontal bar with raw temporal dimension', function() {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": "bar",
        "encoding": {
          "x": {"type": "quantitative", "field": "foo"},
          "y": {"type": "temporal", "field": "bar"}
        },
      });
      assert.equal(model.markDef.orient, 'horizontal');
    });

    it('should return correct orient for vertical tick', function() {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": "tick",
        "encoding": {
          "x": {"type": "quantitative", "field": "foo"},
          "y": {"type": "ordinal", "field": "bar"}
        },
      });
      assert.equal(model.markDef.orient, 'vertical');
    });

    it('should return correct orient for vertical tick with bin', function() {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": "tick",
        "encoding": {
          "x": {"type": "quantitative", "field": "foo"},
          "y": {"type": "quantitative", "field": "bar", "bin": true}
        },
      });
      assert.equal(model.markDef.orient, 'vertical');
    });

    it('should return correct orient for vertical tick of continuous timeUnit dotplot', function() {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": "tick",
        "encoding": {
          "x": {"type": "temporal", "field": "foo", "timeUnit": "yearmonthdate"},
          "y": {"type": "ordinal", "field": "bar"}
        },
      });
      assert.equal(model.markDef.orient, 'vertical');
    });

    it('should return correct orient for horizontal tick', function() {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": "tick",
        "encoding": {
          "y": {"type": "quantitative", "field": "foo"},
          "x": {"type": "ordinal", "field": "bar"}
        },
      });
      assert.equal(model.markDef.orient, 'horizontal');
    });

    it('should return correct orient for vertical rule', function() {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": "rule",
        "encoding": {
          "x": {"value": 0},
        },
      });
      assert.equal(model.markDef.orient, 'vertical');
    });

    it('should return correct orient for horizontal rule', function () {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": "rule",
        "encoding": {
          "y": {"value": 0},
        },
      });
      assert.equal(model.markDef.orient, 'horizontal');
    });

    it('should return undefined for line segment rule', function () {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": "rule",
        "encoding": {
          "y": {"value": 0},
          "x": {"value": 0},
          "y2": {"value": 100},
          "x2": {"value": 100},
        },
      });
      assert.equal(model.markDef.orient, undefined);
    });

    it('should return undefined for line segment rule with only x and y without x2, y2', function () {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": "rule",
        "encoding": {
          "y": {"value": 0},
          "x": {"value": 0}
        },
      });
      assert.equal(model.markDef.orient, undefined);
    });

    it('should return correct orient for horizontal rules without x2 ', function() {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": "rule",
        "encoding": {
          "x": {"field": "b", "type": "quantitative"},
          "y": {"field": "a", "type": "ordinal"},
        },
      });

      assert.equal(model.markDef.orient, 'horizontal');
    });

    it('should return correct orient for vertical rules without y2 ', function() {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": "rule",
        "encoding": {
          "y": {"field": "b", "type": "quantitative"},
          "x": {"field": "a", "type": "ordinal"},
        },
      });

      assert.equal(model.markDef.orient, 'vertical');
    });

    it('should return correct orient for vertical rule with range', function() {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": "rule",
        "encoding": {
          "x": {"type": "ordinal", "field": "foo"},
          "y": {"type": "quantitative", "field": "bar"},
          "y2": {"type": "quantitative", "field": "baz"}
        },
      });
      assert.equal(model.markDef.orient, 'vertical');
    });

    it('should return correct orient for horizontal rule with range', function() {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": "rule",
        "encoding": {
          "y": {"type": "ordinal", "field": "foo"},
          "x": {"type": "quantitative", "field": "bar"},
          "x2": {"type": "quantitative", "field": "baz"}
        },
      });
      assert.equal(model.markDef.orient, 'horizontal');
    });

    it('should return correct orient for horizontal rule with range and no ordinal', function() {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": "rule",
        "encoding": {
          "x": {"type": "quantitative", "field": "bar"},
          "x2": {"type": "quantitative", "field": "baz"}
        },
      });
      assert.equal(model.markDef.orient, 'horizontal');
    });

    it('should return correct orient for vertical rule with range and no ordinal', function() {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": "rule",
        "encoding": {
          "y": {"type": "quantitative", "field": "bar"},
          "y2": {"type": "quantitative", "field": "baz"}
        },
      });
      assert.equal(model.markDef.orient, 'vertical');
    });
  });

  describe('cursor', function() {
    it('cursor should be undefined when no href channel defined', function() {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": "foo"},
          "x": {"type": "temporal", "field": "bar"}
        },
      });
      assert.equal(model.markDef.cursor, undefined);
    });

    it('should return pointer cursor when href channel present', function() {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": "bar",
        "selection": {"test": {"type": "single"}},
        "encoding": {
          "x": {"field": "a", "type": "ordinal"},
          "y": {"field": "b", "type": "quantitative"},
          "href": {
            "condition": {"selection": "test", "value": "https://vega.github.io/schema/vega-lite/v2.json"},
            "field": "a",
            "type": "ordinal"
          },
        },
      });
      assert.equal(model.markDef.cursor, 'pointer');
    });

    it('should return specified cursor when href channel present but cursor specified', function() {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": {"type": "bar", "cursor": "auto"},
        "selection": {"test": {"type": "single"}},
        "encoding": {
          "x": {"field": "a", "type": "ordinal"},
          "y": {"field": "b", "type": "quantitative"},
          "href": {
            "condition": {"selection": "test", "value": "http://www.google.com"},
            "field": "a",
            "type": "ordinal"
          },
        },
      });
      assert.equal(model.markDef.cursor, 'auto');
    });

    it('should return pointer cursor when href channel specified in mark definition', function() {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": {"type": "bar", "href": "http://www.google.com"},
        "encoding": {
          "y": {"type": "quantitative", "field": "foo"},
          "x": {"type": "temporal", "field": "bar"}
        }
      });
      assert.equal(model.markDef.cursor, 'pointer');
    });

    it('should return specified cursor when href channel specified in mark definition but cursor also specified', function() {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": {"type": "bar", "href": "http://www.google.com", "cursor": "auto"},
        "encoding": {
          "y": {"type": "quantitative", "field": "foo"},
          "x": {"type": "temporal", "field": "bar"}
        }
      });
      assert.equal(model.markDef.cursor, 'auto');
    });

    it('should return pointer cursor when href channel specified in mark config', function() {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "config": {
          "mark": {
            "href": "http://www.google.com"
          }
        },
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": "foo"},
          "x": {"type": "temporal", "field": "bar"}
        }
      });
      assert.equal(model.markDef.cursor, 'pointer');
    });

    it('should return specified cursor when href channel specified in mark config but cursor also specified', function() {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "config": {
          "mark": {
            "href": "http://www.google.com"
          }
        },
        "mark": {"type": "bar", "cursor": "auto"},
        "encoding": {
          "y": {"type": "quantitative", "field": "foo"},
          "x": {"type": "temporal", "field": "bar"}
        }
      });
      assert.equal(model.markDef.cursor, 'auto');
    });

  });
});


