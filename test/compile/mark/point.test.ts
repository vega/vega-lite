/* tslint:disable quotemark */

import {assert} from 'chai';
import {COLOR, SHAPE, SIZE, X, Y} from '../../../src/channel';
import {circle, point, square} from '../../../src/compile/mark/point';
import {Encoding} from '../../../src/encoding';
import {defaultMarkConfig} from '../../../src/mark';
import {NormalizedUnitSpec} from '../../../src/spec';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util';

describe('Mark: Point', () => {
  function pointXY(moreEncoding: Encoding<string> = {}): NormalizedUnitSpec {
    return {
      mark: 'point',
      encoding: {
        x: {field: 'year', type: 'ordinal'},
        y: {field: 'yield', type: 'quantitative'},
        ...moreEncoding
      },
      data: {url: 'data/barley.json'}
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
      assert.deepEqual(props.y, {
        mult: 0.5,
        signal: 'height'
      });
    });

    it('should scale on x', () => {
      assert.deepEqual(props.x, {scale: X, field: 'year'});
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
      assert.deepEqual(props.x, {scale: X, field: 'sum_a_end'});
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
      assert.deepEqual(props.x, {
        mult: 0.5,
        signal: 'width'
      });
    });

    it('should scale on y', () => {
      assert.deepEqual(props.y, {scale: Y, field: 'year'});
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
      assert.deepEqual(props.y, {scale: Y, field: 'sum_a_end'});
    });
  });

  describe('with x and y', () => {
    const model = parseUnitModelWithScaleAndLayoutSize(pointXY());
    const props = point.encodeEntry(model);

    it('should scale on x', () => {
      assert.deepEqual(props.x, {scale: X, field: 'year'});
    });

    it('should scale on y', () => {
      assert.deepEqual(props.y, {scale: Y, field: 'yield'});
    });

    it('should be an unfilled circle', () => {
      assert.deepEqual(props.fill, {value: 'transparent'});
      assert.deepEqual(props.stroke, {value: defaultMarkConfig.color});
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
      assert.deepEqual(props.x, {scale: 'x', field: 'year', band: 0.5});
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
      assert.deepEqual(props.size, {scale: SIZE, field: 'count_*'});
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
      assert.deepEqual(props.stroke, {scale: COLOR, field: 'yield'});
    });
  });

  describe('with x, y, and condition-only color', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      ...pointXY({
        color: {condition: {selection: 'test', field: 'yield', type: 'quantitative'}}
      }),
      selection: {test: {type: 'single'}}
    });
    model.parseSelection();
    const props = point.encodeEntry(model);

    it('should have one condition for color with scale for "yield"', () => {
      assert.isArray(props.stroke);
      assert.equal(props.stroke['length'], 2);
      assert.equal(props.stroke[0].scale, COLOR);
      assert.equal(props.stroke[0].field, 'yield');
    });
  });

  describe('with x, y, and condition-only color', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      ...pointXY({
        color: {condition: {test: 'true', field: 'yield', type: 'quantitative'}}
      })
    });
    model.parseSelection();
    const props = point.encodeEntry(model);

    it('should have one condition for color with scale for "yield"', () => {
      assert.isArray(props.stroke);
      assert.equal(props.stroke['length'], 2);
      assert.equal(props.stroke[0].test, 'true');
      assert.equal(props.stroke[1].value, '#4c78a8');
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
      assert.deepEqual(props.shape, {scale: SHAPE, field: 'site'});
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
      assert.deepEqual(props.shape, {value: 'circle'});
      assert.deepEqual(props.stroke, {value: 'red'});
      assert.deepEqual(props.size, {value: 23});
    });
  });

  describe('with tooltip', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'point',
      encoding: {
        tooltip: {value: 'foo'}
      }
    });
    const props = point.encodeEntry(model);

    it('should pass tooltip value to encoding', () => {
      assert.deepEqual(props.tooltip, {value: 'foo'});
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
      assert.deepEqual(props.href, {value: 'https://idl.cs.washington.edu/'});
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

    assert.propertyVal(props.shape, 'value', 'square');
  });

  it('should be filled by default', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'square',
      encoding: {
        color: {value: 'blue'}
      }
    });
    const props = square.encodeEntry(model);

    assert.propertyVal(props.fill, 'value', 'blue');
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

    assert.propertyVal(props.stroke, 'value', 'blue');
    assert.propertyVal(props.fill, 'value', 'transparent');
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
    assert.propertyVal(props.shape, 'value', 'circle');
  });

  it('should be filled by default', () => {
    assert.propertyVal(props.fill, 'value', 'blue');
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

    assert.propertyVal(filledCircleProps.stroke, 'value', 'blue');
    assert.propertyVal(filledCircleProps.fill, 'value', 'transparent');
  });
});
