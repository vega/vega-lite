/* tslint:disable:quotemark */

import {assert} from 'chai';

import * as log from '../src/log';

import {AggregateOp} from '../src/aggregate';
import {DETAIL, X, Y} from '../src/channel';
import {AREA, BAR, PRIMITIVE_MARKS, RECT} from '../src/mark';
import {ScaleType} from '../src/scale';
import {isStacked, TopLevel, UnitSpec} from '../src/spec';
import {stack, STACK_BY_DEFAULT_MARKS, STACKABLE_MARKS, StackOffset} from '../src/stack';

describe('stack', () => {
  const NON_STACKABLE_MARKS = [RECT];

  it('should be disabled for non-stackable marks with at least of of the stack channel', () => {
    [undefined, 'center', 'none', 'zero', 'normalize'].forEach((stacked: StackOffset) => {
      NON_STACKABLE_MARKS.forEach((nonStackableMark) => {
        const spec: TopLevel<UnitSpec> = {
          "data": {"url": "data/barley.json"},
          "mark": nonStackableMark,
          "encoding": {
            "x": {"aggregate": "sum", "field": "yield", "type": "quantitative"},
            "y": {"field": "variety", "type": "nominal"},
            "color": {"field": "site", "type": "nominal"}
          },
          "config": {
            "stack": stacked
          }
        };
        assert.isNull(stack(spec.mark, spec.encoding, spec.config.stack));
        assert.isFalse(isStacked(spec));
      });
    });
  });

  it('should always be disabled for raw plot', () => {
    [undefined, 'center', 'none', 'zero', 'normalize'].forEach((stacked: StackOffset) => {
      PRIMITIVE_MARKS.forEach((mark) => {
        const spec: TopLevel<UnitSpec> = {
          "data": {"url": "data/barley.json"},
          "mark": mark,
          "encoding": {
            "x": {"field": "yield", "type": "quantitative"},
            "y": {"field": "variety", "type": "nominal"},
            "color": {"field": "site", "type": "nominal"}
          },
          "config": {
            "stack": stacked
          }
        };
        assert.isNull(stack(spec.mark, spec.encoding, spec.config.stack));
        assert.isFalse(isStacked(spec));
      });
    });
  });

  it('should always be disabled if there is no stackby channel', () => {
    [undefined, 'center', 'none', 'zero', 'normalize'].forEach((stacked: StackOffset) => {
      PRIMITIVE_MARKS.forEach((mark) => {
        const spec: TopLevel<UnitSpec> = {
          "data": {"url": "data/barley.json"},
          "mark": mark,
          "encoding": {
            "x": {"aggregate": "sum", "field": "yield", "type": "quantitative"},
            "y": {"field": "variety", "type": "nominal"}
          },
          "config": {
            "stack": stacked
          }
        };
        assert.isNull(stack(spec.mark, spec.encoding, spec.config.stack));
        assert.isFalse(isStacked(spec));
      });
    });
  });

  it('should always be disabled if the stackby channel is aggregated', () => {
    [undefined, 'center', 'none', 'zero', 'normalize'].forEach((stacked: StackOffset) => {
      PRIMITIVE_MARKS.forEach((mark) => {
        const spec: TopLevel<UnitSpec> = {
          "data": {"url": "data/barley.json"},
          "mark": mark,
          "encoding": {
            "x": {"aggregate": "sum", "field": "yield", "type": "quantitative"},
            "y": {"field": "variety", "type": "nominal"},
            "color": {"aggregate": "count", "type": "quantitative"}
          },
          "config": {
            "stack": stacked
          }
        };
        assert.isNull(stack(spec.mark, spec.encoding, spec.config.stack));
        assert.isFalse(isStacked(spec));
      });
    });
  });

  it('can enabled if one of the stackby channels is not aggregated', () => {
    [undefined, 'center', 'zero', 'normalize'].forEach((stacked: StackOffset) => {
      const marks = stacked === undefined ? STACK_BY_DEFAULT_MARKS : STACKABLE_MARKS;
      marks.forEach((mark) => {
        const spec: TopLevel<UnitSpec> = {
          "data": {"url": "data/barley.json"},
          "mark": mark,
          "encoding": {
            "x": {"aggregate": "sum", "field": "yield", "type": "quantitative"},
            "y": {"field": "variety", "type": "nominal"},
            "color": {"aggregate": "count", "type": "quantitative"},
            "detail": {"field": "site", "type": "nominal"}
          },
          "config": {
            "stack": stacked
          }
        };
        const _stack = stack(spec.mark, spec.encoding, spec.config.stack);
        assert.isOk(_stack);
        assert.isTrue(isStacked(spec));
        assert.equal(_stack.stackBy[0].channel, DETAIL);
      });
    });
  });

  it('can enabled if one of the stackby channels is not aggregated', () => {
    [undefined, 'center', 'zero', 'normalize'].forEach((stacked: StackOffset) => {
      const marks = stacked === undefined ? STACK_BY_DEFAULT_MARKS : STACKABLE_MARKS;
      marks.forEach((mark) => {
        const spec: TopLevel<UnitSpec> = {
          "data": {"url": "data/barley.json"},
          "mark": mark,
          "encoding": {
            "x": {"aggregate": "sum", "field": "yield", "type": "quantitative", "stack": stacked},
            "y": {"field": "variety", "type": "nominal"},
            "color": {"aggregate": "count", "type": "quantitative"},
            "detail": {"field": "site", "type": "nominal"}
          }
        };

        const _stack = stack(spec.mark, spec.encoding, undefined);
        assert.isOk(_stack);
        assert.isTrue(isStacked(spec));
        assert.equal(_stack.stackBy[0].channel, DETAIL);
      });
    });
  });

  it('should always be disabled if both x and y are aggregate', () => {
    [undefined, 'center', 'none', 'zero', 'normalize'].forEach((stacked: StackOffset) => {
      PRIMITIVE_MARKS.forEach((mark) => {
        const spec: TopLevel<UnitSpec> = {
          "data": {"url": "data/barley.json"},
          "mark": mark,
          "encoding": {
            "x": {"aggregate": "sum", "field": "yield", "type": "quantitative"},
            "y": {"aggregate": "count", "type": "quantitative"},
            "color": {"field": "site", "type": "nominal"}
          },
          "config": {
            "stack": stacked
          }
        };
        assert.isNull(stack(spec.mark, spec.encoding, spec.config.stack));
        assert.isFalse(isStacked(spec));
      });
    });
  });

  it('should always be disabled if neither x nor y is aggregate', () => {
    [undefined, 'center', 'none', 'zero', 'normalize'].forEach((stacked: StackOffset) => {
      PRIMITIVE_MARKS.forEach((mark) => {
        const spec: TopLevel<UnitSpec> = {
          "data": {"url": "data/barley.json"},
          "mark": mark,
          "encoding": {
            "x": {"field": "variety", "type": "nominal"},
            "y": {"field": "variety", "type": "nominal"},
            "color": {"field": "site", "type": "nominal"}
          },
          "config": {
            "stack": stacked
          }
        };
        assert.isNull(stack(spec.mark, spec.encoding, spec.config.stack));
        assert.isFalse(isStacked(spec));
      });
    });
  });

  it('should always be disabled if there is both x and x2', () => {
    [undefined, 'center', 'zero', 'normalize'].forEach((stacked: StackOffset) => {
      const marks = stacked === undefined ? STACK_BY_DEFAULT_MARKS : STACKABLE_MARKS;
      marks.forEach((mark) => {
        log.runLocalLogger((localLogger) => {
          const spec: TopLevel<UnitSpec> = {
            "mark": mark,
            "encoding": {
              "x": {"field": "a", "type": "quantitative", "aggregate": "sum"},
              "x2": {"field": "a", "type": "quantitative", "aggregate": "sum"},
              "y": {"field": "variety", "type": "nominal"},
              "color": {"field": "site", "type": "nominal"}
            },
            "config": {
              "stack": stacked
            }
          };
          assert.isNull(stack(spec.mark, spec.encoding, spec.config.stack));
          assert.isFalse(isStacked(spec));
          assert.equal(localLogger.warns[0], log.message.cannotStackRangedMark(X),
            JSON.stringify({stacked: stacked, mark: mark})
          );
        });
      });
    });
  });

  it('should always be disabled if there is both y and y2', () => {
    [undefined, 'center', 'zero', 'normalize'].forEach((stacked: StackOffset) => {
      const marks = stacked === undefined ? STACK_BY_DEFAULT_MARKS : STACKABLE_MARKS;
      marks.forEach((mark) => {
        log.runLocalLogger((localLogger) => {
          const spec: TopLevel<UnitSpec> = {
            "mark": mark,
            "encoding": {
              "y": {"field": "a", "type": "quantitative", "aggregate": "sum"},
              "y2": {"field": "a", "type": "quantitative", "aggregate": "sum"},
              "x": {"field": "variety", "type": "nominal"},
              "color": {"field": "site", "type": "nominal"}
            },
            "config": {
              "stack": stacked
            }
          };
          assert.isNull(stack(spec.mark, spec.encoding, spec.config.stack));
          assert.isFalse(isStacked(spec));
          assert.equal(localLogger.warns[0], log.message.cannotStackRangedMark(Y),
            JSON.stringify({stacked: stacked, mark: mark})
          );
        });
      });
    });
  });

  it('should always be disabled if the aggregated axis has non-linear scale', () => {
    [undefined, 'center', 'zero', 'normalize'].forEach((stacked: StackOffset) => {
      [ScaleType.LOG, ScaleType.POW, ScaleType.SQRT].forEach((scaleType) => {
        const marks = stacked === undefined ? STACK_BY_DEFAULT_MARKS : STACKABLE_MARKS;
        marks.forEach((mark) => {
          log.runLocalLogger((localLogger) => {
            const spec: TopLevel<UnitSpec> = {
              "data": {"url": "data/barley.json"},
              "mark": mark,
              "encoding": {
                "x": {"field": "a", "type": "quantitative", "aggregate": "sum", "scale": {"type": scaleType}},
                "y": {"field": "variety", "type": "nominal"},
                "color": {"field": "site", "type": "nominal"}
              },
              "config": {
                "stack": stacked
              }
            };
            assert.isNull(stack(spec.mark, spec.encoding, spec.config.stack));
            assert.isFalse(isStacked(spec));
            assert.equal(localLogger.warns[0], log.message.cannotStackNonLinearScale(scaleType));
          });
        });
      });
    });
  });

  it('should always be disabled if the aggregated axis has non-summative aggregate', () => {
    [undefined, 'center', 'zero', 'normalize'].forEach((stacked: StackOffset) => {
      ['average', 'variance', 'q3'].forEach((aggregate: AggregateOp) => {
        const marks = stacked === undefined ? STACK_BY_DEFAULT_MARKS : STACKABLE_MARKS;
        marks.forEach((mark) => {
          log.runLocalLogger((localLogger) => {
            const spec: TopLevel<UnitSpec> = {
              "data": {"url": "data/barley.json"},
              "mark": mark,
              "encoding": {
                "x": {"field": "a", "type": "quantitative", "aggregate": aggregate},
                "y": {"field": "variety", "type": "nominal"},
                "color": {"field": "site", "type": "nominal"}
              },
              "config": {
                "stack": stacked
              }
            };
            assert.isNull(stack(spec.mark, spec.encoding, spec.config.stack));
            assert.isFalse(isStacked(spec));
            assert.equal(localLogger.warns[0], log.message.cannotStackNonSummativeAggregate(aggregate));
          });
        });
      });
    });
  });

  describe('stack().groupbyChannel, .fieldChannel', () => {
    it('should be correct for horizontal', () => {
      [BAR, AREA].forEach((stackableMark) => {
        const spec: TopLevel<UnitSpec> = {
          "data": {"url": "data/barley.json"},
          "mark": stackableMark,
          "encoding": {
            "x": {"aggregate": "sum", "field": "yield", "type": "quantitative"},
            "y": {"field": "variety", "type": "nominal"},
            "color": {"field": "site", "type": "nominal"}
          }
        };
        const _stack = stack(spec.mark, spec.encoding, undefined);
        assert.equal(_stack.fieldChannel, X);
        assert.equal(_stack.groupbyChannel, Y);
        assert.isTrue(isStacked(spec));
      });
    });

    it('should be correct for horizontal (single)', () => {
      [BAR, AREA].forEach((stackableMark) => {
        const spec: TopLevel<UnitSpec> = {
          "data": {"url": "data/barley.json"},
          "mark": stackableMark,
          "encoding": {
            "x": {"aggregate": "sum", "field": "yield", "type": "quantitative"},
            "color": {"field": "site", "type": "nominal"}
          }
        };
        const _stack = stack(spec.mark, spec.encoding, undefined);
        assert.equal(_stack.fieldChannel, X);
        assert.equal(_stack.groupbyChannel, null);
        assert.isTrue(isStacked(spec));
      });
    });

    it('should be correct for vertical', () => {
      [BAR, AREA].forEach((stackableMark) => {
        const spec: TopLevel<UnitSpec> = {
          "data": {"url": "data/barley.json"},
          "mark": stackableMark,
          "encoding": {
            "y": {"aggregate": "sum", "field": "yield", "type": "quantitative"},
            "x": {"field": "variety", "type": "nominal"},
            "color": {"field": "site", "type": "nominal"}
          }
        };
        const _stack = stack(spec.mark, spec.encoding, undefined);
        assert.equal(_stack.fieldChannel, Y);
        assert.equal(_stack.groupbyChannel, X);
        assert.isTrue(isStacked(spec));
      });
    });

    it('should be correct for vertical (single)', () => {
      [BAR, AREA].forEach((stackableMark) => {
        const spec: TopLevel<UnitSpec> = {
          "data": {"url": "data/barley.json"},
          "mark": stackableMark,
          "encoding": {
            "y": {"aggregate": "sum", "field": "yield", "type": "quantitative"},
            "color": {"field": "site", "type": "nominal"}
          }
        };
        const _stack = stack(spec.mark, spec.encoding, undefined);
        assert.equal(_stack.fieldChannel, Y);
        assert.equal(_stack.groupbyChannel, null);
        assert.isTrue(isStacked(spec));
      });
    });
  });

  describe('stack().offset', () => {
    it('should be zero for stackable marks with at least of of the stack channel if stacked is unspecified', () => {
      [BAR, AREA].forEach((stackableMark) => {
        const spec: TopLevel<UnitSpec> = {
          "data": {"url": "data/barley.json"},
          "mark": stackableMark,
          "encoding": {
            "x": {"aggregate": "sum", "field": "yield", "type": "quantitative"},
            "y": {"field": "variety", "type": "nominal"},
            "color": {"field": "site", "type": "nominal"}
          }
        };
        assert.equal(stack(spec.mark, spec.encoding, undefined).offset, 'zero');
        assert.isTrue(isStacked(spec));
      });
    });

    it('should be the specified stacked for stackable marks with at least one of the stack channel', () => {
      ['center', 'zero', 'normalize'].forEach((stacked: StackOffset) => {
        [BAR, AREA].forEach((stackableMark) => {
          const spec: TopLevel<UnitSpec> = {
            "data": {"url": "data/barley.json"},
            "mark": stackableMark,
            "encoding": {
              "x": {"aggregate": "sum", "field": "yield", "type": "quantitative"},
              "y": {"field": "variety", "type": "nominal"},
              "color": {"field": "site", "type": "nominal"}
            },
            "config": {
              "stack": stacked
            }
          };
          assert.equal(stack(spec.mark, spec.encoding, spec.config.stack).offset, stacked);
          assert.equal(isStacked(spec), true);
        });
      });
    });
  });
});
