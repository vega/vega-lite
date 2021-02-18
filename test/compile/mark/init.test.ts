import {initMarkdef} from '../../../src/compile/mark/init';
import {defaultConfig} from '../../../src/config';
import {CIRCLE, GEOSHAPE, POINT, PRIMITIVE_MARKS, SQUARE, TICK} from '../../../src/mark';
import {parseUnitModelWithScaleAndLayoutSize, without} from '../../util';

describe('compile/mark/init', () => {
  describe('initMarkDef', () => {
    it('applies cornerRadiusEnd to all cornerRadius for ranged bars', () => {
      expect(
        initMarkdef(
          {type: 'bar', cornerRadiusEnd: 5},
          {x: {field: 'x', type: 'quantitative'}, x2: {field: 'x2'}},
          defaultConfig
        )
      ).toMatchObject({cornerRadius: 5});

      expect(
        initMarkdef(
          {type: 'bar', cornerRadiusEnd: 5},
          {y: {field: 'x', type: 'quantitative'}, y2: {field: 'x2'}},
          defaultConfig
        )
      ).toMatchObject({cornerRadius: 5});
    });

    it('applies cornerRadiusEnd to top cornerRadius for vertical bars', () => {
      expect(
        initMarkdef({type: 'bar', cornerRadiusEnd: 5}, {y: {field: 'x', type: 'quantitative'}}, defaultConfig)
      ).toMatchObject({cornerRadiusTopLeft: 5, cornerRadiusTopRight: 5});
    });

    it('applies cornerRadiusEnd to top cornerRadius for horizontal bars', () => {
      expect(
        initMarkdef({type: 'bar', cornerRadiusEnd: 5}, {x: {field: 'x', type: 'quantitative'}}, defaultConfig)
      ).toMatchObject({cornerRadiusBottomRight: 5, cornerRadiusTopRight: 5});
    });
  });

  describe('defaultOpacity', () => {
    it('should return 0.7 by default for unaggregated point, tick, circle, and square', () => {
      for (const mark of [POINT, TICK, CIRCLE, SQUARE]) {
        const model = parseUnitModelWithScaleAndLayoutSize({
          mark,
          encoding: {
            y: {type: 'quantitative', field: 'foo'},
            x: {type: 'quantitative', field: 'bar'}
          }
        });
        expect(model.markDef.opacity).toEqual(0.7);
      }
    });

    it('should return undefined by default for aggregated point, tick, circle, and square', () => {
      for (const mark of [POINT, TICK, CIRCLE, SQUARE]) {
        const model = parseUnitModelWithScaleAndLayoutSize({
          mark,
          encoding: {
            y: {aggregate: 'mean', type: 'quantitative', field: 'foo'},
            x: {type: 'nominal', field: 'bar'}
          }
        });
        expect(model.markDef.opacity).toBeUndefined();
      }
    });

    it('should use specified opacity', () => {
      for (const mark of [POINT, TICK, CIRCLE, SQUARE]) {
        const model = parseUnitModelWithScaleAndLayoutSize({
          mark: {type: mark, opacity: 0.9},
          encoding: {
            y: {type: 'quantitative', field: 'foo'},
            x: {type: 'quantitative', field: 'bar'}
          }
        });
        expect(model.markDef.opacity).toEqual(0.9);
      }
    });

    it('should return undefined by default for other marks', () => {
      const otherMarks = without(PRIMITIVE_MARKS, [POINT, TICK, CIRCLE, SQUARE, GEOSHAPE]);
      for (const mark of otherMarks) {
        const model = parseUnitModelWithScaleAndLayoutSize({
          mark,
          encoding: {
            y: {type: 'quantitative', field: 'foo'},
            x: {type: 'nominal', field: 'bar'}
          }
        });
        expect(model.markDef.opacity).toBeUndefined();
      }
    });
  });

  describe('orient', () => {
    it('should return correct default for QxQ', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'bar',
        encoding: {
          y: {type: 'quantitative', field: 'foo'},
          x: {type: 'quantitative', field: 'bar'}
        }
      });
      expect(model.markDef.orient).toBe('vertical');
    });

    it('should return correct default for empty plot', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'bar',
        encoding: {}
      });
      expect(model.markDef.orient).toBeUndefined();
    });

    it('should return correct orient for bar with both axes discrete', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'bar',
        encoding: {
          x: {type: 'ordinal', field: 'foo'},
          y: {type: 'ordinal', field: 'bar'}
        }
      });
      expect(model.markDef.orient).toBeUndefined();
    });

    it('should return correct orient for vertical bar', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'bar',
        encoding: {
          y: {type: 'quantitative', field: 'foo'},
          x: {type: 'ordinal', field: 'bar'}
        }
      });
      expect(model.markDef.orient).toBe('vertical');
    });

    it('should return correct orient for horizontal bar', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'bar',
        encoding: {
          x: {type: 'quantitative', field: 'foo'},
          y: {type: 'ordinal', field: 'bar'}
        }
      });
      expect(model.markDef.orient).toBe('horizontal');
    });

    it('should return correct orient for vertical bar with raw temporal dimension', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'bar',
        encoding: {
          y: {type: 'quantitative', field: 'foo'},
          x: {type: 'temporal', field: 'bar'}
        }
      });
      expect(model.markDef.orient).toBe('vertical');
    });

    it('should return correct orient for horizontal bar with raw temporal dimension', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'bar',
        encoding: {
          x: {type: 'quantitative', field: 'foo'},
          y: {type: 'temporal', field: 'bar'}
        }
      });
      expect(model.markDef.orient).toBe('horizontal');
    });

    it('should return correct orient for vertical with aggregation', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'bar',
        encoding: {
          x: {type: 'quantitative', field: 'foo', aggregate: 'mean'},
          y: {type: 'quantitative', field: 'bar'}
        }
      });
      expect(model.markDef.orient).toBe('horizontal');
    });

    it('should return correct orient for vertical tick', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'tick',
        encoding: {
          x: {type: 'quantitative', field: 'foo'},
          y: {type: 'ordinal', field: 'bar'}
        }
      });
      expect(model.markDef.orient).toBe('vertical');
    });

    it('should return correct orient for vertical tick with bin', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'tick',
        encoding: {
          x: {type: 'quantitative', field: 'foo'},
          y: {type: 'quantitative', field: 'bar', bin: true}
        }
      });
      expect(model.markDef.orient).toBe('vertical');
    });

    it('should return correct orient for vertical tick of continuous timeUnit dotplot', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'tick',
        encoding: {
          x: {type: 'temporal', field: 'foo', timeUnit: 'yearmonthdate'},
          y: {type: 'ordinal', field: 'bar'}
        }
      });
      expect(model.markDef.orient).toBe('vertical');
    });

    it('should return correct orient for horizontal tick', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'tick',
        encoding: {
          y: {type: 'quantitative', field: 'foo'},
          x: {type: 'ordinal', field: 'bar'}
        }
      });
      expect(model.markDef.orient).toBe('horizontal');
    });

    it('should return correct orient for vertical rule', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'rule',
        encoding: {
          x: {value: 0}
        }
      });
      expect(model.markDef.orient).toBe('vertical');
    });

    it('should return correct orient for horizontal rule', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'rule',
        encoding: {
          y: {value: 0}
        }
      });
      expect(model.markDef.orient).toBe('horizontal');
    });

    it('should return undefined for line segment rule', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'rule',
        encoding: {
          y: {value: 0},
          x: {value: 0},
          y2: {value: 100},
          x2: {value: 100}
        }
      });
      expect(model.markDef.orient).toBeUndefined();
    });

    it('should return undefined for line segment rule with only x and y without x2, y2', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'rule',
        encoding: {
          y: {value: 0},
          x: {value: 0}
        }
      });
      expect(model.markDef.orient).toBeUndefined();
    });

    it('should return correct orient for horizontal rules without x2', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'rule',
        encoding: {
          x: {field: 'b', type: 'quantitative'},
          y: {field: 'a', type: 'ordinal'}
        }
      });

      expect(model.markDef.orient).toBe('horizontal');
    });

    it('should return correct orient for vertical rules without y2', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'rule',
        encoding: {
          y: {field: 'b', type: 'quantitative'},
          x: {field: 'a', type: 'ordinal'}
        }
      });

      expect(model.markDef.orient).toBe('vertical');
    });

    it('should return correct orient for vertical rule with range', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'rule',
        encoding: {
          x: {type: 'ordinal', field: 'foo'},
          y: {type: 'quantitative', field: 'bar'},
          y2: {field: 'baz'}
        }
      });
      expect(model.markDef.orient).toBe('vertical');
    });

    it('should return correct orient for horizontal rule with range', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'rule',
        encoding: {
          y: {type: 'ordinal', field: 'foo'},
          x: {type: 'quantitative', field: 'bar'},
          x2: {field: 'baz'}
        }
      });
      expect(model.markDef.orient).toBe('horizontal');
    });

    it('should return correct orient for horizontal rule with range and no ordinal', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'rule',
        encoding: {
          x: {type: 'quantitative', field: 'bar'},
          x2: {field: 'baz'}
        }
      });
      expect(model.markDef.orient).toBe('horizontal');
    });

    it('should return correct orient for vertical rule with range and no ordinal', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'rule',
        encoding: {
          y: {type: 'quantitative', field: 'bar'},
          y2: {field: 'baz'}
        }
      });
      expect(model.markDef.orient).toBe('vertical');
    });

    it('should return correct orient for bar with vertical binned data', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'bar',
        encoding: {
          x: {
            field: 'bin_start',
            bin: 'binned',
            type: 'quantitative',
            axis: {
              tickMinStep: 2
            }
          },
          x2: {
            field: 'bin_end'
          },
          y: {
            field: 'count',
            type: 'quantitative'
          }
        }
      });
      expect(model.markDef.orient).toBe('vertical');
    });

    it('should return correct orient for bar with horizontal binned data', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'bar',
        encoding: {
          y: {
            field: 'bin_start',
            bin: 'binned',
            type: 'quantitative',
            axis: {
              tickMinStep: 2
            }
          },
          y2: {
            field: 'bin_end'
          },
          x: {
            field: 'count',
            type: 'quantitative'
          }
        }
      });
      expect(model.markDef.orient).toBe('horizontal');
    });

    it('should return correct orient for area with vertical binned data', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'area',
        encoding: {
          x: {
            field: 'bin_start',
            bin: 'binned',
            type: 'quantitative',
            axis: {
              tickMinStep: 2
            }
          },
          x2: {
            field: 'bin_end'
          },
          y: {
            field: 'count',
            type: 'quantitative'
          }
        }
      });
      expect(model.markDef.orient).toBe('vertical');
    });

    it('should return correct orient for area with horizontal binned data', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'area',
        encoding: {
          y: {
            field: 'bin_start',
            bin: 'binned',
            type: 'quantitative',
            axis: {
              tickMinStep: 2
            }
          },
          y2: {
            field: 'bin_end'
          },
          x: {
            field: 'count',
            type: 'quantitative'
          }
        }
      });
      expect(model.markDef.orient).toBe('horizontal');
    });
  });

  describe('cursor', () => {
    it('cursor should be undefined when no href channel defined', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'bar',
        encoding: {
          y: {type: 'quantitative', field: 'foo'},
          x: {type: 'temporal', field: 'bar'}
        }
      });
      expect(model.markDef.cursor).toBeUndefined();
    });

    it('should return pointer cursor when href channel present', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'bar',
        params: [{name: 'test', select: 'point'}],
        encoding: {
          x: {field: 'a', type: 'ordinal'},
          y: {field: 'b', type: 'quantitative'},
          href: {
            condition: {param: 'test', value: 'https://vega.github.io/schema/vega-lite/v5.json'},
            field: 'a',
            type: 'ordinal'
          }
        }
      });
      expect(model.markDef.cursor).toBe('pointer');
    });

    it('should return specified cursor when href channel present but cursor specified', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'bar', cursor: 'auto'},
        params: [{name: 'test', select: 'point'}],
        encoding: {
          x: {field: 'a', type: 'ordinal'},
          y: {field: 'b', type: 'quantitative'},
          href: {
            condition: {param: 'test', value: 'http://www.google.com'},
            field: 'a',
            type: 'ordinal'
          }
        }
      });
      expect(model.markDef.cursor).toBe('auto');
    });

    it('should return pointer cursor when href channel specified in mark definition', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'bar', href: 'http://www.google.com'},
        encoding: {
          y: {type: 'quantitative', field: 'foo'},
          x: {type: 'temporal', field: 'bar'}
        }
      });
      expect(model.markDef.cursor).toBe('pointer');
    });

    it('should return specified cursor when href channel specified in mark definition but cursor also specified in mark', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'bar', href: 'http://www.google.com', cursor: 'auto'},
        encoding: {
          y: {type: 'quantitative', field: 'foo'},
          x: {type: 'temporal', field: 'bar'}
        }
      });
      expect(model.markDef.cursor).toBe('auto');
    });

    it('should return pointer cursor when href channel specified in mark config', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        config: {
          mark: {
            href: 'http://www.google.com'
          }
        },
        mark: 'bar',
        encoding: {
          y: {type: 'quantitative', field: 'foo'},
          x: {type: 'temporal', field: 'bar'}
        }
      });
      expect(model.markDef.cursor).toBe('pointer');
    });

    it('should return specified cursor when href channel specified in mark config but cursor also specified in mark', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        config: {
          mark: {
            href: 'http://www.google.com'
          }
        },
        mark: {type: 'bar', cursor: 'auto'},
        encoding: {
          y: {type: 'quantitative', field: 'foo'},
          x: {type: 'temporal', field: 'bar'}
        }
      });
      expect(model.markDef.cursor).toBe('auto');
    });

    it('should not specify cursor in the markdef if defined in the config', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        config: {
          mark: {
            href: 'http://www.google.com',
            cursor: 'auto'
          }
        },
        mark: 'bar',
        encoding: {
          y: {type: 'quantitative', field: 'foo'},
          x: {type: 'temporal', field: 'bar'}
        }
      });
      expect(model.markDef.cursor).toBeUndefined();
    });
  });
});
