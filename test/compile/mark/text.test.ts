/* tslint:disable quotemark */
import {assert} from 'chai';
import {X, Y} from '../../../src/channel';
import {text} from '../../../src/compile/mark/text';
import {UnitModel} from '../../../src/compile/unit';
import {NormalizedUnitSpec, TopLevel, TopLevelSpec} from '../../../src/spec';
import {parseModelWithScale, parseUnitModelWithScaleAndLayoutSize} from '../../util';

describe('Mark: Text', () => {
  describe('with stacked x', () => {
    // This is a simplified example for stacked text.
    // In reality this will be used as stacked's overlayed marker
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'text',
      encoding: {
        x: {aggregate: 'sum', field: 'a', type: 'quantitative'},
        color: {field: 'b', type: 'ordinal'}
      },
      data: {url: 'data/barley.json'},
      config: {stack: 'zero'}
    });

    const props = text.encodeEntry(model);

    it('should use stack_end on x', () => {
      assert.deepEqual(props.x, {scale: X, field: 'sum_a_end'});
    });
  });

  describe('with stacked y', () => {
    // This is a simplified example for stacked text.
    // In reality this will be used as stacked's overlayed marker
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'text',
      encoding: {
        y: {aggregate: 'sum', field: 'a', type: 'quantitative'},
        color: {field: 'b', type: 'ordinal'}
      },
      data: {url: 'data/barley.json'},
      config: {stack: 'zero'}
    });

    const props = text.encodeEntry(model);

    it('should use stack_end on y', () => {
      assert.deepEqual(props.y, {scale: Y, field: 'sum_a_end'});
    });
  });

  describe('with quantitative and format', () => {
    const spec: NormalizedUnitSpec = {
      mark: 'text',
      encoding: {
        text: {field: 'foo', type: 'quantitative', format: 'd'}
      }
    };
    const model = parseUnitModelWithScaleAndLayoutSize(spec);
    const props = text.encodeEntry(model);

    it('should use number template', () => {
      assert.deepEqual(props.text, {signal: `format(datum["foo"], "d")`});
    });
  });

  describe('with binned quantitative', () => {
    const spec: NormalizedUnitSpec = {
      mark: 'text',
      encoding: {
        text: {bin: true, field: 'foo', type: 'quantitative', format: 'd'}
      }
    };
    const model = parseUnitModelWithScaleAndLayoutSize(spec);
    const props = text.encodeEntry(model);

    it('should output correct bin range', () => {
      assert.deepEqual(props.text, {
        signal: `datum["bin_maxbins_10_foo"] === null || isNaN(datum["bin_maxbins_10_foo"]) ? "null" : format(datum["bin_maxbins_10_foo"], "d") + " - " + format(datum["bin_maxbins_10_foo_end"], "d")`
      });
    });
  });

  describe('with temporal', () => {
    const spec: NormalizedUnitSpec = {
      mark: 'text',
      encoding: {
        text: {field: 'foo', type: 'temporal'}
      }
    };
    const model = parseUnitModelWithScaleAndLayoutSize(spec);
    const props = text.encodeEntry(model);

    it('should use date template', () => {
      assert.deepEqual(props.text, {signal: `timeFormat(datum["foo"], '')`});
    });
  });

  describe('with x, y, text (ordinal)', () => {
    const spec: NormalizedUnitSpec = {
      mark: 'text',
      encoding: {
        x: {field: 'Acceleration', type: 'ordinal'},
        y: {field: 'Displacement', type: 'quantitative'},
        text: {field: 'Origin', type: 'ordinal'}
      },
      data: {url: 'data/cars.json'}
    };
    const model = parseUnitModelWithScaleAndLayoutSize(spec);
    const props = text.encodeEntry(model);

    it('should scale on x', () => {
      assert.deepEqual(props.x, {scale: X, field: 'Acceleration'});
    });
    it('should scale on y', () => {
      assert.deepEqual(props.y, {scale: Y, field: 'Displacement'});
    });

    it('should be centered', () => {
      assert.deepEqual(props.align, {value: 'center'});
    });

    it('should map text without template', () => {
      assert.deepEqual(props.text, {signal: `''+datum["Origin"]`});
    });
  });

  describe('with size in mark def', () => {
    const spec: NormalizedUnitSpec = {
      mark: {type: 'text', size: 5},
      encoding: {
        text: {field: 'Origin', type: 'ordinal'}
      },
      data: {url: 'data/cars.json'}
    };
    const model = parseUnitModelWithScaleAndLayoutSize(spec);
    const props = text.encodeEntry(model);

    it('should map size to fontSize', () => {
      assert.deepEqual(props.fontSize, {value: 5});
    });
  });

  describe('with config.text.size', () => {
    const spec: TopLevel<NormalizedUnitSpec> = {
      mark: {type: 'text'},
      encoding: {
        text: {field: 'Origin', type: 'ordinal'}
      },
      data: {url: 'data/cars.json'},
      config: {text: {size: 25}}
    };
    const model = parseUnitModelWithScaleAndLayoutSize(spec);
    const props = text.encodeEntry(model);

    it('should map size to fontSize', () => {
      assert.deepEqual(props.fontSize, {value: 25});
    });
  });

  describe('with config.text.size', () => {
    const spec: TopLevel<NormalizedUnitSpec> = {
      mark: {type: 'text'},
      encoding: {
        text: {field: 'Origin', type: 'ordinal'}
      },
      data: {url: 'data/cars.json'},
      config: {text: {fontSize: 25}}
    };
    const model = parseUnitModelWithScaleAndLayoutSize(spec);
    const props = text.encodeEntry(model);

    it('should map size to fontSize', () => {
      assert.deepEqual(props.fontSize, {value: 25});
    });
  });

  describe('with row, column, text, color, and size', () => {
    const spec: TopLevelSpec = {
      mark: 'text',
      encoding: {
        row: {field: 'Origin', type: 'ordinal'},
        column: {field: 'Cylinders', type: 'ordinal'},
        text: {field: 'Acceleration', type: 'quantitative', aggregate: 'mean'},
        color: {field: 'Acceleration', type: 'quantitative', aggregate: 'mean'},
        size: {field: 'Acceleration', type: 'quantitative', aggregate: 'mean'}
      },
      data: {url: 'data/cars.json'}
    };
    const model = parseModelWithScale(spec);
    model.parseLayoutSize();

    const childModel = model.children[0] as UnitModel;
    const props = text.encodeEntry(childModel);

    it('should fit the view on x', () => {
      assert.deepEqual(props.x, {signal: 'child_width', mult: 0.5});
    });

    it('should center on y', () => {
      assert.deepEqual(props.y, {
        mult: 0.5,
        signal: 'child_height'
      });
    });

    it('should map text to expression', () => {
      assert.deepEqual(props.text, {
        signal: `format(datum["mean_Acceleration"], "")`
      });
    });

    it('should map color to fill', () => {
      expect(props.fill).toEqual([
        {
          test: 'datum["mean_Acceleration"] === null || isNaN(datum["mean_Acceleration"])',
          value: null
        },
        {
          scale: 'color',
          field: 'mean_Acceleration'
        }
      ]);
    });

    it('should map size to fontSize', () => {
      assert.deepEqual(props.fontSize, {
        scale: 'size',
        field: 'mean_Acceleration'
      });
    });
  });
});
