/* tslint:disable quote */

import {assert} from 'chai';
import {parseUnitModel} from '../../util';
import {extend} from '../../../src/util';
import {text} from '../../../src/compile/mark/text';
import {X, Y} from '../../../src/channel';

describe('Mark: Text', function() {
  it('should return correct marktype', function() {
    assert.equal(text.markType(), 'text');
  });

  describe('with nothing', function() {
    const spec = {
      "data": {"url": "data/cars.json"},
      "mark": "text",
      "encoding": {}
    };
    const model = parseUnitModel(spec);
    const props = text.properties(model);

    it('should have placeholder text', function() {
      assert.deepEqual(props.text, {value: "Abc"});
    });
  });

  describe('with quantitative and format', function() {
    const spec = {
      "mark": "text",
      "encoding": {
        "text": {"field": "foo", "type": "quantitative"}
      },
      "config": {
        "mark": {
          "format": "d"
        }
      }
    };
    const model = parseUnitModel(spec);
    const props = text.properties(model);

    it('should use number template', function() {
      assert.deepEqual(props.text, {template: '{{datum.foo | number:\'d\'}}'});
    });
  });

  describe('with temporal', function() {
    const spec = {
      "mark": "text",
      "encoding": {
        "text": {"field": "foo", "type": "temporal"}
      }
    };
    const model = parseUnitModel(spec);
    const props = text.properties(model);

    it('should use date template', function() {
      assert.deepEqual(props.text, {template: '{{datum.foo | time:\'%Y-%m-%d\'}}'});
    });
  });

  describe('with x, y, text (ordinal)', function() {
    const spec = {
      "data": {"url": "data/cars.json"},
      "mark": "text",
      "encoding": {
        "x": {"field": "Acceleration", "type": "ordinal"},
        "y": {"field": "Displacement", "type": "quantitative"},
        "text": {"field": "Origin", "type": "ordinal"},
      }
    };
    const model = parseUnitModel(spec);
    const props = text.properties(model);

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
    const spec = {
        "data": {"url": "data/cars.json"},
        "mark": "text",
        "encoding": {
          "row": {"field": "Origin", "type": "ordinal"},
          "column": {"field": "Cylinders", "type": "ordinal"},
          "text": {"field": "Acceleration", "type": "quantitative", "aggregate": "mean"},
          "color": {"field": "Acceleration", "type": "quantitative", "aggregate": "mean"},
          "size": {"field": "Acceleration", "type": "quantitative", "aggregate": "mean"}
        }
      };
    const model = parseUnitModel(spec);
    const props = text.properties(model);

    it('should fit cell on x', function() {
      assert.deepEqual(props.x, { field: { group: 'width' }, offset: -5 });
    });

    it('should center on y', function() {
      assert.deepEqual(props.y, { value: 10.5 });
    });

    it('should map text to template', function() {
      assert.deepEqual(props.text, {
        template: "{{datum.mean_Acceleration | number:'s'}}"
      });
    });

    it('should map color to fill', function() {
      assert.deepEqual(props.fill, {
        scale: 'color',
        field: 'mean_Acceleration'
      });
    });

    it('should map size to fontSize', function() {
      assert.deepEqual(props.fontSize, {
        scale: 'size',
        field: 'mean_Acceleration'
      });
    });
  });

  describe('with row, column, text, and color and mark configs(applyColorToBackground, opacity)', function() {
    const spec = {
        "data": {"url": "data/cars.json"},
        "mark": "text",
        "encoding": {
          "row": {"field": "Origin", "type": "ordinal"},
          "column": {"field": "Cylinders", "type": "ordinal"},
          "text": {"field": "Acceleration", "type": "quantitative", "aggregate": "mean"},
          "color": {"field": "Acceleration", "type": "quantitative", "aggregate": "mean"},
          "size": {"field": "Acceleration", "type": "quantitative", "aggregate": "mean"}
        },
        "config": {
          "mark": {
            "applyColorToBackground": true,
            "opacity": 0.8
          }
        }
      };
    const model = parseUnitModel(spec);
    const props = text.properties(model);
    it('should fill black', function() {
      assert.deepEqual(props.fill, {value: 'black'});
    });

    const bg = text.background(model);
    it('should map color to background', function() {
      assert.deepEqual(bg.fill, {
        scale: 'color',
        field: 'mean_Acceleration'
      });
    });

  });

  describe('with x of type longitude', function() {
    const model = parseUnitModel({
      "data": {"url": "data/barley.json"},
      "mark": "text",
      "encoding": {
        "x": {"field": "year", "type": "longitude"},
        "text": {"field": "year", "type": "quantitative"}
      }
    });

    const props = text.properties(model);
    it('should not have scale on x', function() {
      assert.deepEqual(props.x.scale, undefined);
    });
  });

  describe('with y of type latitude', function() {
    const model = parseUnitModel({
      "data": {"url": "data/barley.json"},
      "mark": "text",
      "encoding": {
        "y": {"field": "year", "type": "latitude"},
        "text": {"field": "year", "type": "quantitative"}
      }
    });

    const props = text.properties(model);
    it('should not have scale on y', function() {
      assert.deepEqual(props.y.scale, undefined);
    });
  });
});
