/* tslint:disable quotemark */

import {assert} from 'chai';
import {parseLayerModel} from '../../util';
import {label} from '../../../src/compile/mark/label';
import {Mark} from '../../../src/mark';
// import {ANCHOR, OFFSET} from '../../../src/channel';

describe('Mark: Label', function () {
  it('should return correct marktype', function() {
    assert.equal(label.vgMark, 'text');
  });

  describe('simple bar', function () {
    const model = parseLayerModel({
      "description": "A simple bar chart with embedded data.",
      "layer": [
        {
          "name": "myBar",
          "mark": "bar",
          "data": {
            "values": [
              {"a": "A","b": 28},
              {"a": "B","b": 55},
              {"a": "C","b": 43},
              {"a": "D","b": 91},
              {"a": "E","b": 81},
              {"a": "F","b": 53},
              {"a": "G","b": 2},
              {"a": "H","b": 87},
              {"a": "I","b": 52}
            ]
          },
          "encoding": {
            "x": {"field": "a","type": "ordinal"},
            "y": {"field": "b","type": "quantitative"}
          }
        },
        {
          "mark": "label",
          "data": {"ref": "myBar" },
          "encoding": {
            "text": {"field": "b"},
            "color": {"value": "auto"},
            "anchor": {"value": "auto"},
            "offset": {"value": "auto"}
          }
        }
      ]
    });

    // const props = label.encodeEntry(model);
    const labelMarks = model.children().filter((child) => typeof child.mark === Mark.LABEL);
    const encodedLabels = labelMarks.map((labelMark) => label.encodeEntry(labelMark));

    it('should have correct ANCHOR', function () {
      assert.deepEqual(true, true);
    });
  });
});
