/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseUnitModelWithScale} from '../../util';


describe('legend/assemble', () => {
  it('merges legend of the same field with the default type.', () => {
    const model = parseUnitModelWithScale({
      "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
      "description": "A scatterplot showing horsepower and miles per gallons.",
      "data": {"url": "data/cars.json"},
      "mark": "point",
      "encoding": {
        "x": {"field": "Horsepower", "type": "quantitative"},
        "y": {"field": "Miles_per_Gallon", "type": "quantitative"},
        "color": {"field": "Origin", "type": "nominal"},
        "shape": {"field": "Origin", "type": "nominal"}
      }
    });
    model.parseLegend();

    const legends = model.assembleLegends();
    assert.equal(legends.length, 1);

    assert.equal(legends[0].title, 'Origin');
    assert.equal(legends[0].stroke, 'color');
    assert.equal(legends[0].shape, 'shape');
  });

  it('merges legend of the same field and favor symbol legend over gradient', () => {
    const model = parseUnitModelWithScale({
      "data": {"values": [{"a": "A","b": 28},{"a": "B","b": 55}]},
      "mark": "bar",
      "encoding": {
        "x": {"field": "a","type": "ordinal"},
        "y": {"field": "b","type": "quantitative"},
        "color": {"field": "b","type": "quantitative"},
        "size": {"field": "b","type": "quantitative"}
      }
    });

    model.parseLegend();

    const legends = model.assembleLegends();
    assert.equal(legends.length, 1);
    assert.equal(legends[0].title, 'b');
    assert.equal(legends[0].type, 'symbol');
    assert.equal(legends[0].fill, 'color');
    assert.equal(legends[0].size, 'size');
  });
});
