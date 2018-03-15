/* tslint:disable:quotemark */
import {assert} from 'chai';
import {AggregateOp} from 'vega';

import {DETAIL, X, Y} from '../src/channel';
import * as log from '../src/log';
import {AREA, BAR, PRIMITIVE_MARKS, RECT} from '../src/mark';
import {ScaleType} from '../src/scale';
import {isStacked, NormalizedUnitSpec, TopLevel} from '../src/spec';
import {stack, STACK_BY_DEFAULT_MARKS, STACKABLE_MARKS, StackOffset} from '../src/stack';
import {stringify} from '../src/util';


describe('stack', () => {
  const NON_STACKABLE_MARKS = [RECT];

  it('should be disabled for non-stackable marks with at least of of the stack channel', () => {
    for (const stacked of [undefined, 'center', 'zero', 'normalize', null, 'none'] as StackOffset[]) {
      NON_STACKABLE_MARKS.forEach((nonStackableMark) => {
        const spec: TopLevel<NormalizedUnitSpec> = {
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
    }
  });

  it('should be allowed for raw plot', () => {
    STACKABLE_MARKS.forEach((mark) => {
      const spec: TopLevel<NormalizedUnitSpec> = {
        "data": {"url": "data/barley.json"},
        "mark": mark,
        "encoding": {
          "x": {"field": "yield", "type": "quantitative", "stack": "zero"},
          "y": {"field": "variety", "type": "nominal"},
          "color": {"field": "site", "type": "nominal"}
        }
      };
      const stackProps = stack(spec.mark, spec.encoding, undefined);
      assert.equal(stackProps.fieldChannel, 'x');
      assert.isTrue(isStacked(spec));
    });
  });


  it('should prioritize axis with stack', () => {
    STACKABLE_MARKS.forEach((mark) => {
      const spec: TopLevel<NormalizedUnitSpec> = {
        "data": {"url": "data/barley.json"},
        "mark": mark,
        "encoding": {
          "x": {"field": "yield", "type": "quantitative", "stack": "zero"},
          "y": {"field": "variety", "type": "quantitative"},
          "color": {"field": "site", "type": "nominal"}
        }
      };
      const stackProps = stack(spec.mark, spec.encoding, undefined);
      assert.equal(stackProps.fieldChannel, 'x');
      assert.isTrue(isStacked(spec));
    });
  });

  it('should always be disabled if there is no stackby channel', () => {
    for (const stacked of [undefined, 'center', 'zero', 'normalize', null, 'none'] as StackOffset[]) {
      PRIMITIVE_MARKS.forEach((mark) => {
        const spec: TopLevel<NormalizedUnitSpec> = {
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
    }
  });

  it('should always be disabled if the stackby channel is aggregated', () => {
    for (const stacked of [undefined, 'center', 'zero', 'normalize', null, 'none'] as StackOffset[]) {
      PRIMITIVE_MARKS.forEach((mark) => {
        const spec: TopLevel<NormalizedUnitSpec> = {
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
    }
  });

  it('should always be disabled if the stackby channel is identical to y', () => {
    for (const stacked of [undefined, 'center', 'zero', 'normalize', null, 'none'] as StackOffset[]) {
      PRIMITIVE_MARKS.forEach((mark) => {
        const spec: TopLevel<NormalizedUnitSpec> = {
          "data": {"url": "data/barley.json"},
          "mark": mark,
          "encoding": {
            "x": {"aggregate": "sum", "field": "yield", "type": "quantitative"},
            "y": {"field": "variety", "type": "nominal"},
            "color": {"field": "variety", "type": "nominal"},
          },
          "config": {
            "stack": stacked
          }
        };
        assert.isNull(stack(spec.mark, spec.encoding, spec.config.stack));
        assert.isFalse(isStacked(spec));
      });
    }
  });

  it('can enabled if one of the stackby channels is not aggregated', () => {
    for (const stacked of [undefined, 'center', 'zero', 'normalize'] as StackOffset[]) {
      const marks = stacked === undefined ? STACK_BY_DEFAULT_MARKS : STACKABLE_MARKS;
      marks.forEach((mark) => {
        const spec: TopLevel<NormalizedUnitSpec> = {
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
    }
  });

  it('can enabled if one of the stackby channels is not aggregated', () => {
    for (const stacked of [undefined, 'center', 'zero', 'normalize'] as StackOffset[]) {
      const marks = stacked === undefined ? STACK_BY_DEFAULT_MARKS : STACKABLE_MARKS;
      marks.forEach((mark) => {
        const spec: TopLevel<NormalizedUnitSpec> = {
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
    }
  });

  it('should always be disabled if both x and y are aggregate', () => {
    for (const stacked of [undefined, 'center', 'zero', 'normalize', null, 'none'] as StackOffset[]) {
      PRIMITIVE_MARKS.forEach((mark) => {
        const spec: TopLevel<NormalizedUnitSpec> = {
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
    }
  });

  it('should always be disabled if neither x nor y is aggregate or stack', () => {
    for (const stacked of [undefined, 'center', 'zero', 'normalize', null, 'none'] as StackOffset[]) {
      PRIMITIVE_MARKS.forEach((mark) => {
        const spec: TopLevel<NormalizedUnitSpec> = {
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
    }
  });

  it('should always be disabled if there is both x and x2', log.wrap((localLogger) => {
    for (const stacked of [undefined, 'center', 'zero', 'normalize'] as StackOffset[]) {
      const marks = stacked === undefined ? STACK_BY_DEFAULT_MARKS : STACKABLE_MARKS;
      marks.forEach((mark) => {
        const spec: TopLevel<NormalizedUnitSpec> = {
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
        const warns = localLogger.warns;
        assert.equal(warns[warns.length-1], log.message.cannotStackRangedMark(X),
          stringify({stacked: stacked, mark: mark})
        );
      });
    }
  }));

  it('should always be disabled if there is both y and y2', log.wrap((localLogger) => {
    for (const stacked of [undefined, 'center', 'zero', 'normalize'] as StackOffset[]) {
      const marks = stacked === undefined ? STACK_BY_DEFAULT_MARKS : STACKABLE_MARKS;
      marks.forEach((mark) => {
        const spec: TopLevel<NormalizedUnitSpec> = {
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
        const warns = localLogger.warns;
        assert.equal(warns[warns.length-1], log.message.cannotStackRangedMark(Y),
          stringify({stacked: stacked, mark: mark})
        );
      });
    }
  }));

  it('should always be disabled if the aggregated axis has non-linear scale', log.wrap((localLogger) => {
    for (const stacked of [undefined, 'center', 'zero', 'normalize'] as StackOffset[]) {
      [ScaleType.LOG, ScaleType.POW, ScaleType.SQRT].forEach((scaleType) => {
        const marks = stacked === undefined ? STACK_BY_DEFAULT_MARKS : STACKABLE_MARKS;
        marks.forEach((mark) => {
          const spec: TopLevel<NormalizedUnitSpec> = {
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
          const warns = localLogger.warns;
          assert.equal(warns[warns.length-1], log.message.cannotStackNonLinearScale(scaleType));
        });
      });
    }
  }));

  it('should throws warning if the aggregated axis has a non-summative aggregate', log.wrap((localLogger) => {
    for (const stackOffset of [undefined, 'center', 'zero', 'normalize'] as StackOffset[]) {
      for (const aggregate of ['average', 'variance', 'q3'] as AggregateOp[]) {
        const marks = stackOffset === undefined ? STACK_BY_DEFAULT_MARKS : STACKABLE_MARKS;
        marks.forEach((mark) => {
          const spec: TopLevel<NormalizedUnitSpec> = {
            "data": {"url": "data/barley.json"},
            "mark": mark,
            "encoding": {
              "x": {
                aggregate,
                stack: stackOffset,
                "field": "a",
                "type": "quantitative"
              },
              "y": {"field": "variety", "type": "nominal"},
              "color": {"field": "site", "type": "nominal"}
            }
          };
          assert.isTrue(isStacked(spec));
          const warns = localLogger.warns;
          assert.equal(warns[warns.length-1], log.message.stackNonSummativeAggregate(aggregate));
        });
      }
    }
  }));

  describe('stack().groupbyChannel, .fieldChannel', () => {
    it('should be correct for horizontal', () => {
      [BAR, AREA].forEach((stackableMark) => {
        const spec: TopLevel<NormalizedUnitSpec> = {
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
        const spec: TopLevel<NormalizedUnitSpec> = {
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
        const spec: TopLevel<NormalizedUnitSpec> = {
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
        const spec: TopLevel<NormalizedUnitSpec> = {
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
        const spec: TopLevel<NormalizedUnitSpec> = {
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
      for (const stacked of ['center', 'zero', 'normalize'] as StackOffset[]) {
        [BAR, AREA].forEach((stackableMark) => {
          const spec: TopLevel<NormalizedUnitSpec> = {
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
      }
    });
  });
});
