/* tslint:disable:quotemark */

import {assert} from 'chai';
import {AggregateOp} from '../src/aggregate';
import {X, Y, DETAIL} from '../src/channel';
import {BAR, AREA, RULE, PRIMITIVE_MARKS} from '../src/mark';
import {ScaleType} from '../src/scale';
import {stack, StackOffset} from '../src/stack';
import {isStacked} from '../src/spec';

describe('stack', () => {
  const STACKABLE_MARKS = [BAR, AREA];
  const NON_STACKABLE_MARKS = [RULE];

  it('should be disabled for non-stackable marks with at least of of the stack channel', () => {
    [undefined, StackOffset.CENTER, StackOffset.NONE, StackOffset.ZERO, StackOffset.NORMALIZE].forEach((stacked) => {
      NON_STACKABLE_MARKS.forEach((nonStackableMark) => {
        const spec = {
          "data": {"url": "data/barley.json"},
          "mark": nonStackableMark,
          "encoding": {
            "x": {"aggregate": "sum", "field": "yield", "type": "quantitative"},
            "y": {"field": "variety", "type": "nominal"},
            "color": {"field": "site", "type": "nominal"}
          },
          "config": {
            "mark": {"stacked": stacked}
          }
        };
        assert.isNull(stack(spec.mark, spec.encoding as any, spec.config.mark.stacked));
        assert.isFalse(isStacked(spec as any));
      });
    });
  });

  it('should always be disabled for raw plot', () => {
    [undefined, StackOffset.CENTER, StackOffset.NONE, StackOffset.ZERO, StackOffset.NORMALIZE].forEach((stacked) => {
      PRIMITIVE_MARKS.forEach((mark) => {
        const spec = {
          "data": {"url": "data/barley.json"},
          "mark": mark,
          "encoding": {
            "x": {"field": "yield", "type": "quantitative"},
            "y": {"field": "variety", "type": "nominal"},
            "color": {"field": "site", "type": "nominal"}
          },
          "config": {
            "mark": {"stacked": stacked}
          }
        };
        assert.isNull(stack(spec.mark, spec.encoding as any, spec.config.mark.stacked));
        assert.isFalse(isStacked(spec as any));
      });
    });
  });

  it('should always be disabled if there is no stackby channel', () => {
    [undefined, StackOffset.CENTER, StackOffset.NONE, StackOffset.ZERO, StackOffset.NORMALIZE].forEach((stacked) => {
      PRIMITIVE_MARKS.forEach((mark) => {
        const spec = {
          "data": {"url": "data/barley.json"},
          "mark": mark,
          "encoding": {
            "x": {"aggregate": "sum", "field": "yield", "type": "quantitative"},
            "y": {"field": "variety", "type": "nominal"}
          },
          "config": {
            "mark": {"stacked": stacked}
          }
        };
        assert.isNull(stack(spec.mark, spec.encoding as any, spec.config.mark.stacked));
        assert.isFalse(isStacked(spec as any));
      });
    });
  });

  it('should always be disabled if the stackby channel is aggregated', () => {
    [undefined, StackOffset.CENTER, StackOffset.NONE, StackOffset.ZERO, StackOffset.NORMALIZE].forEach((stacked) => {
      PRIMITIVE_MARKS.forEach((mark) => {
        const spec = {
          "data": {"url": "data/barley.json"},
          "mark": mark,
          "encoding": {
            "x": {"aggregate": "sum", "field": "yield", "type": "quantitative"},
            "y": {"field": "variety", "type": "nominal"},
            "color": {"aggregate": "count", "field": "*", "type": "quantitative"}
          },
          "config": {
            "mark": {"stacked": stacked}
          }
        };
        assert.isNull(stack(spec.mark, spec.encoding as any, spec.config.mark.stacked));
        assert.isFalse(isStacked(spec as any));
      });
    });
  });

  it('can enabled if one of the stackby channels is not aggregated', () => {
    [undefined, StackOffset.CENTER, StackOffset.ZERO, StackOffset.NORMALIZE].forEach((stacked) => {
      STACKABLE_MARKS.forEach((mark) => {
        const spec = {
          "data": {"url": "data/barley.json"},
          "mark": mark,
          "encoding": {
            "x": {"aggregate": "sum", "field": "yield", "type": "quantitative"},
            "y": {"field": "variety", "type": "nominal"},
            "color": {"aggregate": "count", "field": "*", "type": "quantitative"},
            "detail": {"field": "site", "type": "nominal"}
          },
          "config": {
            "mark": {"stacked": stacked}
          }
        };
        const _stack = stack(spec.mark, spec.encoding as any, spec.config.mark.stacked);
        assert.isOk(_stack);
        assert.isTrue(isStacked(spec as any));
        assert.equal(_stack.stackByChannels[0], DETAIL);
      });
    });
  });

  it('should always be disabled if both x and y are aggregate', () => {
    [undefined, StackOffset.CENTER, StackOffset.NONE, StackOffset.ZERO, StackOffset.NORMALIZE].forEach((stacked) => {
      PRIMITIVE_MARKS.forEach((mark) => {
        const spec = {
          "data": {"url": "data/barley.json"},
          "mark": mark,
          "encoding": {
            "x": {"aggregate": "sum", "field": "yield", "type": "quantitative"},
            "y": {"aggregate": "count", "field": "*", "type": "quantitative"},
            "color": {"field": "site", "type": "nominal"}
          },
          "config": {
            "mark": {"stacked": stacked}
          }
        };
        assert.isNull(stack(spec.mark, spec.encoding as any, spec.config.mark.stacked));
        assert.isFalse(isStacked(spec as any));
      });
    });
  });

  it('should always be disabled if neither x nor y is aggregate', () => {
    [undefined, StackOffset.CENTER, StackOffset.NONE, StackOffset.ZERO, StackOffset.NORMALIZE].forEach((stacked) => {
      PRIMITIVE_MARKS.forEach((mark) => {
        const spec = {
          "data": {"url": "data/barley.json"},
          "mark": mark,
          "encoding": {
            "x": {"field": "variety", "type": "nominal"},
            "y": {"field": "variety", "type": "nominal"},
            "color": {"field": "site", "type": "nominal"}
          },
          "config": {
            "mark": {"stacked": stacked}
          }
        };
        assert.isNull(stack(spec.mark, spec.encoding as any, spec.config.mark.stacked));
        assert.isFalse(isStacked(spec as any));
      });
    });
  });

  it('should always be disabled if the aggregated axis has non-linear scale', () => {
    [undefined, StackOffset.CENTER, StackOffset.NONE, StackOffset.ZERO, StackOffset.NORMALIZE].forEach((stacked) => {
      [ScaleType.LOG, ScaleType.POW, ScaleType.SQRT].forEach((scaleType) => {
        PRIMITIVE_MARKS.forEach((mark) => {
          const spec = {
            "data": {"url": "data/barley.json"},
            "mark": mark,
            "encoding": {
              "x": {"field": "a", "type": "quantitative", "aggregate": "sum", "scale": {"type": scaleType}},
              "y": {"field": "variety", "type": "nominal"},
              "color": {"field": "site", "type": "nominal"}
            },
            "config": {
              "mark": {"stacked": stacked}
            }
          };
          assert.isNull(stack(spec.mark, spec.encoding as any, spec.config.mark.stacked));
          assert.isFalse(isStacked(spec as any));
        });
      });
    });
  });

  it('should always be disabled if the aggregated axis has non-summative aggregate', () => {
    [undefined, StackOffset.CENTER, StackOffset.NONE, StackOffset.ZERO, StackOffset.NORMALIZE].forEach((stacked) => {
      [AggregateOp.AVERAGE, AggregateOp.VARIANCE, AggregateOp.Q3].forEach((aggregate) => {
        PRIMITIVE_MARKS.forEach((mark) => {
          const spec = {
            "data": {"url": "data/barley.json"},
            "mark": mark,
            "encoding": {
              "x": {"field": "a", "type": "quantitative", "aggregate": aggregate},
              "y": {"field": "variety", "type": "nominal"},
              "color": {"field": "site", "type": "nominal"}
            },
            "config": {
              "mark": {"stacked": stacked}
            }
          };
          assert.isNull(stack(spec.mark, spec.encoding as any, spec.config.mark.stacked));
          assert.isFalse(isStacked(spec as any));
        });
      });
    });
  });

  describe('stack().groupbyChannel, .fieldChannel', () => {
    it('should be correct for horizontal', () => {
      [BAR, AREA].forEach((stackableMark) => {
        const spec = {
          "data": {"url": "data/barley.json"},
          "mark": stackableMark,
          "encoding": {
            "x": {"aggregate": "sum", "field": "yield", "type": "quantitative"},
            "y": {"field": "variety", "type": "nominal"},
            "color": {"field": "site", "type": "nominal"}
          }
        };
        const _stack = stack(spec.mark, spec.encoding as any, undefined);
        assert.equal(_stack.fieldChannel, X);
        assert.equal(_stack.groupbyChannel, Y);
        assert.isTrue(isStacked(spec as any));
      });
    });

    it('should be correct for horizontal (single)', () => {
      [BAR, AREA].forEach((stackableMark) => {
        const spec = {
          "data": {"url": "data/barley.json"},
          "mark": stackableMark,
          "encoding": {
            "x": {"aggregate": "sum", "field": "yield", "type": "quantitative"},
            "color": {"field": "site", "type": "nominal"}
          }
        };
        const _stack = stack(spec.mark, spec.encoding as any, undefined);
        assert.equal(_stack.fieldChannel, X);
        assert.equal(_stack.groupbyChannel, null);
        assert.isTrue(isStacked(spec as any));
      });
    });

    it('should be correct for vertical', () => {
      [BAR, AREA].forEach((stackableMark) => {
        const spec = {
          "data": {"url": "data/barley.json"},
          "mark": stackableMark,
          "encoding": {
            "y": {"aggregate": "sum", "field": "yield", "type": "quantitative"},
            "x": {"field": "variety", "type": "nominal"},
            "color": {"field": "site", "type": "nominal"}
          }
        };
        const _stack = stack(spec.mark, spec.encoding as any, undefined);
        assert.equal(_stack.fieldChannel, Y);
        assert.equal(_stack.groupbyChannel, X);
        assert.isTrue(isStacked(spec as any));
      });
    });

    it('should be correct for vertical (single)', () => {
      [BAR, AREA].forEach((stackableMark) => {
        const spec = {
          "data": {"url": "data/barley.json"},
          "mark": stackableMark,
          "encoding": {
            "y": {"aggregate": "sum", "field": "yield", "type": "quantitative"},
            "color": {"field": "site", "type": "nominal"}
          }
        };
        const _stack = stack(spec.mark, spec.encoding as any, undefined);
        assert.equal(_stack.fieldChannel, Y);
        assert.equal(_stack.groupbyChannel, null);
        assert.isTrue(isStacked(spec as any));
      });
    });
  });

  describe('stack().offset', () => {
    it('should be zero for stackable marks with at least of of the stack channel if stacked is unspecified', () => {
      [BAR, AREA].forEach((stackableMark) => {
        const spec = {
          "data": {"url": "data/barley.json"},
          "mark": stackableMark,
          "encoding": {
            "x": {"aggregate": "sum", "field": "yield", "type": "quantitative"},
            "y": {"field": "variety", "type": "nominal"},
            "color": {"field": "site", "type": "nominal"}
          }
        };
        assert.equal(stack(spec.mark, spec.encoding as any, undefined).offset, StackOffset.ZERO);
        assert.isTrue(isStacked(spec as any));
      });
    });

    it('should be the specified stacked for stackable marks with at least one of the stack channel', () => {
      [StackOffset.CENTER, StackOffset.ZERO, StackOffset.NORMALIZE].forEach((stacked) => {
        [BAR, AREA].forEach((stackableMark) => {
          const spec = {
            "data": {"url": "data/barley.json"},
            "mark": stackableMark,
            "encoding": {
              "x": {"aggregate": "sum", "field": "yield", "type": "quantitative"},
              "y": {"field": "variety", "type": "nominal"},
              "color": {"field": "site", "type": "nominal"}
            },
            "config": {
              "mark": {"stacked": stacked}
            }
          };
          assert.equal(stack(spec.mark, spec.encoding as any, spec.config.mark.stacked).offset, stacked);
          assert.equal(isStacked(spec as any), StackOffset.NONE !== stacked);
        });
      });
    });
  });
});
