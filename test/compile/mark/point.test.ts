import {COLOR, SHAPE, SIZE, X, Y} from '../../../src/channel';
import {circle, point, square} from '../../../src/compile/mark/point';
import {Config} from '../../../src/config';
import {Encoding} from '../../../src/encoding';
import {defaultMarkConfig} from '../../../src/mark';
import {NormalizedUnitSpec, TopLevel} from '../../../src/spec';
import {internalField} from '../../../src/util';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util';

describe('Mark: Point', () => {
  function pointXY(moreEncoding: Encoding<string> = {}, moreConfig: Config = {}): TopLevel<NormalizedUnitSpec> {
    return {
      mark: 'point',
      encoding: {
        x: {field: 'year', type: 'ordinal'},
        y: {field: 'yield', type: 'quantitative'},
        ...moreEncoding
      },
      data: {url: 'data/barley.json'},
      config: {mark: {invalid: null}, ...moreConfig}
    };
  }

  describe('with x', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'point',
      encoding: {x: {field: 'year', type: 'ordinal'}},
      data: {url: 'data/barley.json'}
    });

    const props = point.encodeEntry(model);

    it('should be centered on y', () => {
      expect(props.y).toEqual({
        mult: 0.5,
        signal: 'height'
      });
    });

    it('should scale on x', () => {
      expect(props.x).toEqual({scale: X, field: 'year'});
    });
  });

  it('with offset includes offset on y', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: {
        type: 'point',
        size: 250,
        y: 'height',
        yOffset: 25
      },
      data: {url: 'data/barley.json'}
    });

    const props = point.encodeEntry(model);

    expect(props.y).toEqual({field: {group: 'height'}, offset: 25});
  });

  describe('with stacked x', () => {
    // This is a simplified example for stacked point.
    // In reality this will be used as stacked's overlayed marker
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'point',
      encoding: {
        x: {aggregate: 'sum', field: 'a', type: 'quantitative', stack: 'zero'},
        color: {field: 'b', type: 'ordinal'}
      },
      data: {url: 'data/barley.json'}
    });

    const props = point.encodeEntry(model);

    it('should use stack_end on x', () => {
      expect(props.x).toEqual({scale: X, field: 'sum_a_end'});
    });
  });

  it('interpolate stacked x with band = 0.5', () => {
    // This is a simplified example for stacked point.
    // In reality this will be used as stacked's overlayed marker
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'point',
      encoding: {
        x: {field: 'a', type: 'quantitative', bandPosition: 0.5, stack: 'zero'},
        color: {field: 'b', type: 'ordinal'}
      },
      data: {url: 'data/barley.json'}
    });

    const props = point.encodeEntry(model);

    expect(props.x).toEqual({signal: 'scale("x", 0.5 * datum["a_start"] + 0.5 * datum["a_end"])'});
  });

  it('interpolates binned x with band = 0.6', () => {
    // This is a simplified example for stacked point.
    // In reality this will be used as stacked's overlayed marker
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'point',
      encoding: {
        x: {bin: true, field: 'a', type: 'quantitative', bandPosition: 0.6}
      },
      data: {url: 'data/barley.json'}
    });

    const props = point.encodeEntry(model);

    expect(props.x).toEqual([
      {test: '!isValid(datum["bin_maxbins_10_a"]) || !isFinite(+datum["bin_maxbins_10_a"])', value: 0},
      {signal: 'scale("x", 0.6 * datum["bin_maxbins_10_a"] + 0.4 * datum["bin_maxbins_10_a_end"])'}
    ]);
  });
  it('interpolates x timeUnit with timeUnitBand = 0.5', () => {
    // This is a simplified example for stacked point.
    // In reality this will be used as stacked's overlayed marker
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/barley.json'},
      mark: 'point',
      encoding: {
        x: {timeUnit: 'year', field: 'a'}
      },
      config: {
        point: {timeUnitBandPosition: 0.5}
      }
    });

    const props = point.encodeEntry(model);
    expect(props.x).toEqual({signal: 'scale("x", 0.5 * datum["year_a"] + 0.5 * datum["year_a_end"])'});
  });

  it('interpolates nominal x on a band scale with band = 0.6', () => {
    // This is a simplified example for stacked point.
    // In reality this will be used as stacked's overlayed marker
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'point',
      encoding: {
        x: {field: 'a', type: 'nominal', bandPosition: 0.6, scale: {type: 'band'}}
      },
      data: {url: 'data/barley.json'}
    });

    const props = point.encodeEntry(model);

    expect(props.x).toEqual({scale: 'x', field: 'a', band: 0.6});
  });

  it('supports encoding with expression', () => {
    // This is a simplified example for stacked point.
    // In reality this will be used as stacked's overlayed marker
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'point',
      encoding: {
        x: {value: {expr: 'a'}}
      },
      data: {url: 'data/barley.json'}
    });

    const props = point.encodeEntry(model);

    expect(props.x).toEqual({signal: 'a'});
  });

  describe('with y', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'point',
      encoding: {y: {field: 'year', type: 'ordinal'}},
      data: {url: 'data/barley.json'}
    });

    const props = point.encodeEntry(model);

    it('should be centered on x', () => {
      expect(props.x).toEqual({
        mult: 0.5,
        signal: 'width'
      });
    });

    it('should scale on y', () => {
      expect(props.y).toEqual({scale: Y, field: 'year'});
    });
  });

  describe('with stacked y', () => {
    // This is a simplified example for stacked point.
    // In reality this will be used as stacked's overlayed marker
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'point',
      encoding: {
        y: {aggregate: 'sum', field: 'a', type: 'quantitative', stack: 'zero'},
        color: {field: 'b', type: 'ordinal'}
      },
      data: {url: 'data/barley.json'}
    });

    const props = point.encodeEntry(model);

    it('should use stack_end on y', () => {
      expect(props.y).toEqual({scale: Y, field: 'sum_a_end'});
    });
  });

  describe('with x and y', () => {
    const model = parseUnitModelWithScaleAndLayoutSize(pointXY());
    const props = point.encodeEntry(model);

    it('should scale on x', () => {
      expect(props.x).toEqual({scale: X, field: 'year'});
    });

    it('should scale on y', () => {
      expect(props.y).toEqual({scale: Y, field: 'yield'});
    });

    it('should be an unfilled circle', () => {
      expect(props.fill).toEqual({value: 'transparent'});
      expect(props.stroke).toEqual({value: defaultMarkConfig.color});
    });
  });

  describe('with band x and quantitative y', () => {
    it('should offset band position by half band', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {url: 'data/barley.json'},
        mark: 'point',
        encoding: {
          x: {field: 'year', type: 'ordinal', scale: {type: 'band'}},
          y: {field: 'yield', type: 'quantitative'}
        }
      });
      const props = point.encodeEntry(model);
      expect(props.x).toEqual({scale: 'x', field: 'year', band: 0.5});
    });
  });

  describe('with x, y, size', () => {
    const model = parseUnitModelWithScaleAndLayoutSize(
      pointXY({
        size: {aggregate: 'count', type: 'quantitative'}
      })
    );
    const props = point.encodeEntry(model);

    it('should have scale for size', () => {
      expect(props.size).toEqual({scale: SIZE, field: internalField('count')});
    });
  });

  describe('with x, y, color', () => {
    const model = parseUnitModelWithScaleAndLayoutSize(
      pointXY({
        color: {field: 'yield', type: 'quantitative'}
      })
    );
    const props = point.encodeEntry(model);

    it('should have scale for color', () => {
      expect(props.stroke).toEqual({scale: COLOR, field: 'yield'});
    });
  });

  describe('with x, y, and condition-only color', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      ...pointXY({
        color: {condition: {param: 'test', field: 'yield', type: 'quantitative'}}
      }),
      params: [{name: 'test', select: 'point'}]
    });
    model.parseSelections();
    const props = point.encodeEntry(model);

    it('should have one condition for color with scale for "yield"', () => {
      expect(Array.isArray(props.stroke)).toBe(true);
      expect(props.stroke['length']).toEqual(2);
      expect(props.stroke[0].scale).toEqual(COLOR);
      expect(props.stroke[0].field).toBe('yield');
    });
  });

  describe('with x, y, and condition-only color and explicit test value', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      ...pointXY({
        color: {condition: {test: 'true', field: 'yield', type: 'quantitative'}}
      })
    });
    model.parseSelections();
    const props = point.encodeEntry(model);

    it('should have one condition for color with scale for "yield"', () => {
      expect(Array.isArray(props.stroke)).toBe(true);
      expect(props.stroke['length']).toEqual(2);
      expect(props.stroke[0].test).toBe('true');
      expect(props.stroke[1].value).toBe('#4c78a8');
    });
  });

  describe('with x, y, shape', () => {
    const model = parseUnitModelWithScaleAndLayoutSize(
      pointXY({
        shape: {field: 'site', type: 'nominal'}
      })
    );
    const props = point.encodeEntry(model);

    it('should have scale for shape', () => {
      expect(props.shape).toEqual({scale: SHAPE, field: 'site'});
    });
  });

  describe('with constant color, shape, and size', () => {
    const model = parseUnitModelWithScaleAndLayoutSize(
      pointXY({
        shape: {value: 'circle'},
        color: {value: 'red'},
        size: {value: 23}
      })
    );
    const props = point.encodeEntry(model);
    it('should correct shape, color and size', () => {
      expect(props.shape).toEqual({value: 'circle'});
      expect(props.stroke).toEqual({value: 'red'});
      expect(props.size).toEqual({value: 23});
    });
  });

  describe('with config.mark.size', () => {
    const model = parseUnitModelWithScaleAndLayoutSize(pointXY({}, {mark: {size: 23}}));
    const props = point.encodeEntry(model);
    it('should have no size as Vega config will already apply it correctly', () => {
      expect(props.size).toBeUndefined();
    });
  });

  describe('with config.point.size', () => {
    const model = parseUnitModelWithScaleAndLayoutSize(pointXY({}, {point: {size: 23}}));
    const props = point.encodeEntry(model);
    it('should have no size as Vega config will already apply it correctly', () => {
      expect(props.size).toBeUndefined();
    });
  });

  describe('with href', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'point',
      encoding: {
        href: {value: 'https://idl.cs.washington.edu/'}
      }
    });
    const props = point.encodeEntry(model);

    it('should pass href value to encoding', () => {
      expect(props.href).toEqual({value: 'https://idl.cs.washington.edu/'});
    });
  });
});

describe('Mark: Square', () => {
  it('should have correct shape', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'square',
      encoding: {
        color: {value: 'blue'}
      }
    });
    const props = square.encodeEntry(model);

    expect(props.shape['value']).toBe('square');
  });

  it('should be filled by default', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'square',
      encoding: {
        color: {value: 'blue'}
      }
    });
    const props = square.encodeEntry(model);

    expect(props.fill['value']).toBe('blue');
  });

  it('with config.mark.filled:false should have transparent fill', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'square',
      encoding: {
        color: {value: 'blue'}
      },
      config: {
        mark: {
          filled: false
        }
      }
    });

    const props = square.encodeEntry(model);

    expect(props.stroke['value']).toBe('blue');
    expect(props.fill['value']).toBe('transparent');
  });
});

describe('Mark: Circle', () => {
  const model = parseUnitModelWithScaleAndLayoutSize({
    mark: 'circle',
    encoding: {
      color: {value: 'blue'}
    }
  });
  const props = circle.encodeEntry(model);

  it('should have correct shape', () => {
    expect(props.shape['value']).toBe('circle');
  });

  it('should be filled by default', () => {
    expect(props.fill['value']).toBe('blue');
  });

  it('with config.mark.filled:false should have transparent fill', () => {
    const filledCircleModel = parseUnitModelWithScaleAndLayoutSize({
      mark: 'circle',
      encoding: {
        color: {value: 'blue'}
      },
      config: {
        mark: {
          filled: false
        }
      }
    });

    const filledCircleProps = circle.encodeEntry(filledCircleModel);

    expect(filledCircleProps.stroke['value']).toBe('blue');
    expect(filledCircleProps.fill['value']).toBe('transparent');
  });

  it('converts expression in mark properties to signal', () => {
    const filledCircleModel = parseUnitModelWithScaleAndLayoutSize({
      mark: {type: 'circle', stroke: {expr: "'red'"}},
      config: {
        mark: {
          filled: false
        }
      }
    });

    const filledCircleProps = circle.encodeEntry(filledCircleModel);

    expect(filledCircleProps.stroke).toEqual({signal: "'red'"});
  });

  it('converts expression in encoding into signal', () => {
    const filledCircleModel = parseUnitModelWithScaleAndLayoutSize({
      mark: {type: 'circle'},
      encoding: {
        x: {datum: {expr: 'myX'}, type: 'quantitative'}
      }
    });

    const filledCircleProps = circle.encodeEntry(filledCircleModel);

    expect(filledCircleProps.x).toEqual({scale: 'x', signal: 'myX'});
  });
});
