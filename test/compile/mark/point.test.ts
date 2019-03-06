/* tslint:disable quotemark */

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
      config: {invalidValues: null, ...moreConfig}
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

  describe('with stacked x', () => {
    // This is a simplified example for stacked point.
    // In reality this will be used as stacked's overlayed marker
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'point',
      encoding: {
        x: {aggregate: 'sum', field: 'a', type: 'quantitative'},
        color: {field: 'b', type: 'ordinal'}
      },
      data: {url: 'data/barley.json'},
      config: {stack: 'zero'}
    });

    const props = point.encodeEntry(model);

    it('should use stack_end on x', () => {
      expect(props.x).toEqual({scale: X, field: 'sum_a_end'});
    });
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
        y: {aggregate: 'sum', field: 'a', type: 'quantitative'},
        color: {field: 'b', type: 'ordinal'}
      },
      data: {url: 'data/barley.json'},
      config: {stack: 'zero'}
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
        color: {condition: {selection: 'test', field: 'yield', type: 'quantitative'}}
      }),
      selection: {test: {type: 'single'}}
    });
    model.parseSelections();
    const props = point.encodeEntry(model);

    it('should have one condition for color with scale for "yield"', () => {
      expect(Array.isArray(props.stroke)).toBe(true);
      expect(props.stroke['length']).toEqual(2);
      expect(props.stroke[0].scale).toEqual(COLOR);
      expect(props.stroke[0].field).toEqual('yield');
    });
  });

  describe('with x, y, and condition-only color', () => {
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
      expect(props.stroke[0].test).toEqual('true');
      expect(props.stroke[1].value).toEqual('#4c78a8');
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
    it('should have correct size', () => {
      expect(props.size).toEqual({value: 23});
    });
  });

  describe('with config.point.size', () => {
    const model = parseUnitModelWithScaleAndLayoutSize(pointXY({}, {point: {size: 23}}));
    const props = point.encodeEntry(model);
    it('should have correct size', () => {
      expect(props.size).toEqual({value: 23});
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
});
