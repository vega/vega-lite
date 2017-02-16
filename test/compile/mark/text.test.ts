/* tslint:disable quotemark */

import {assert} from 'chai';
import {parseUnitModel, parseModel} from '../../util';
import {text} from '../../../src/compile/mark/text';
import {X, Y} from '../../../src/channel';
import {UnitSpec, FacetedUnitSpec} from '../../../src/spec';

describe('Mark: Text', function() {
  describe('with nothing', function() {
    const spec: UnitSpec = {
      "mark": "text",
      "encoding": {},
      "data": {"url": "data/cars.json"}
    };
    const model = parseUnitModel(spec);
    const props = text.encodeEntry(model);

    it('should have placeholder text', function() {
      assert.deepEqual(props.text, {value: "Abc"});
    });
  });

  describe('with stacked x', function() {
    // This is a simplified example for stacked text.
    // In reality this will be used as stacked's overlayed marker
    const model = parseUnitModel({
      "mark": "text",
      "encoding": {
        "x": {"aggregate": "sum", "field": "a", "type": "quantitative"},
        "color": {"field": "b", "type": "ordinal"}
      },
      "data": {"url": "data/barley.json"},
      "config": {"stack":  "zero"}
    });

    const props = text.encodeEntry(model);

    it('should use stack_end on x', function() {
      assert.deepEqual(props.x, {scale: X, field: 'sum_a_end'});
    });
  });

  describe('with stacked y', function() {
    // This is a simplified example for stacked text.
    // In reality this will be used as stacked's overlayed marker
    const model = parseUnitModel({
      "mark": "text",
      "encoding": {
        "y": {"aggregate": "sum", "field": "a", "type": "quantitative"},
        "color": {"field": "b", "type": "ordinal"}
      },
      "data": {"url": "data/barley.json"},
      "config": {"stack":  "zero"}
    });

    const props = text.encodeEntry(model);

    it('should use stack_end on y', function() {
      assert.deepEqual(props.y, {scale: Y, field: 'sum_a_end'});
    });
  });

  describe('with quantitative and format', function() {
    const spec: UnitSpec = {
      "mark": "text",
      "encoding": {
        "text": {"field": "foo", "type": "quantitative", "format": "d"}
      }
    };
    const model = parseUnitModel(spec);
    const props = text.encodeEntry(model);

    it('should use number template', function() {
      assert.deepEqual(props.text, {signal: `format(datum["foo"], 'd')`});
    });
  });

  describe('with temporal', function() {
    const spec: UnitSpec = {
      "mark": "text",
      "encoding": {
        "text": {"field": "foo", "type": "temporal"}
      }
    };
    const model = parseUnitModel(spec);
    const props = text.encodeEntry(model);

    it('should use date template', function() {
      assert.deepEqual(props.text, {signal: `timeFormat(datum["foo"], '%b %d, %Y')`});
    });
  });

  describe('with x, y, text (ordinal)', function() {
    const spec: UnitSpec = {
      "mark": "text",
      "encoding": {
        "x": {"field": "Acceleration", "type": "ordinal"},
        "y": {"field": "Displacement", "type": "quantitative"},
        "text": {"field": "Origin", "type": "ordinal"},
      },
      "data": {"url": "data/cars.json"}
    };
    const model = parseUnitModel(spec);
    const props = text.encodeEntry(model);

    it('should scale on x', function() {
      assert.deepEqual(props.x, {scale: X, field: 'Acceleration'});
    });
    it('should scale on y', function(){
      assert.deepEqual(props.y, {scale: Y, field: 'Displacement'});
    });

    it('should be centered', function() {
      assert.deepEqual(props.align, {value: "center"});
    });

    it('should map text without template', function() {
      assert.deepEqual(props.text, {field: "Origin"});
    });
  });

  describe('with row, column, text, and color', function() {
    const spec: FacetedUnitSpec = {
        "mark": "text",
        "encoding": {
          "row": {"field": "Origin", "type": "ordinal"},
          "column": {"field": "Cylinders", "type": "ordinal"},
          "text": {"field": "Acceleration", "type": "quantitative", "aggregate": "mean"},
          "color": {"field": "Acceleration", "type": "quantitative", "aggregate": "mean"},
          "size": {"field": "Acceleration", "type": "quantitative", "aggregate": "mean"}
        },
        "data": {"url": "data/cars.json"}
      };
    const model = parseModel(spec);
    const props = text.encodeEntry(model.children[0] as any);

    it('should fit cell on x', function() {
      assert.deepEqual(props.x, {field: {group: 'width'}, offset: -5});
    });

    it('should center on y', function() {
      assert.deepEqual(props.y, {value: 10.5});
    });

    it('should map text to expression', function() {
      assert.deepEqual(props.text, {
        signal: `format(datum["mean_Acceleration"], 's')`
      });
    });

    it('should map color to fill', function() {
      assert.deepEqual(props.fill, {
        scale: 'child_color',
        field: 'mean_Acceleration'
      });
    });

    it('should map size to fontSize', function() {
      assert.deepEqual(props.fontSize, {
        scale: 'child_size',
        field: 'mean_Acceleration'
      });
    });
  });
});
