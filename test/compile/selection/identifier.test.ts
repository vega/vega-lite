/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseModel} from '../../util';

describe('Identifier transform', function() {
  it('is not unnecessarily added', function() {
    let model = parseModel({
      "data": {"values": [1, 2, 3]},
      "mark": "circle",
      "encoding": {
        "x": {"field": "Horsepower","type": "quantitative"},
        "y": {"field": "Miles-per-Gallon","type": "quantitative"},
        "color": {"field": "Origin", "type": "nominal"}
      }
    });
    model.parse();

    let data = model.assembleData();
    assert.isNotTrue(data[0].transform &&
      data[0].transform.some((t) => t.type === 'identifier'));

    model = parseModel({
      "data": {"values": [1, 2, 3]},
      "selection": {
        "pt": {"type": "single", "encodings": ["x"]}
      },
      "mark": "circle",
      "encoding": {
        "x": {"field": "Horsepower","type": "quantitative"},
        "y": {"field": "Miles-per-Gallon","type": "quantitative"},
        "color": {"field": "Origin", "type": "nominal"}
      }
    });
    model.parse();
    data = model.assembleData();
    assert.isNotTrue(data[0].transform &&
      data[0].transform.some((t) => t.type === 'identifier'));
  });

  it('is added for default point selections', function() {
    let model = parseModel({
      "data": {"values": [1, 2, 3]},
      "selection": {
        "pt": {"type": "single"}
      },
      "mark": "circle",
      "encoding": {
        "x": {"field": "Horsepower","type": "quantitative"},
        "y": {"field": "Miles-per-Gallon","type": "quantitative"},
        "color": {"field": "Origin", "type": "nominal"}
      }
    });
    model.parse();
    let data = model.assembleData();
    assert.equal(data[0].transform[0].type, 'identifier');

    model = parseModel({
      "data": {"values": [1, 2, 3]},
      "selection": {
        "pt": {"type": "multi"}
      },
      "mark": "circle",
      "encoding": {
        "x": {"field": "Horsepower","type": "quantitative"},
        "y": {"field": "Miles-per-Gallon","type": "quantitative"},
        "color": {"field": "Origin", "type": "nominal"}
      }
    });
    model.parse();
    data = model.assembleData();
    assert.equal(data[0].transform[0].type, 'identifier');
  });

  it('is added after aggregate transforms', function() {
    let model = parseModel({
      "data": {"values": [1, 2, 3]},
      "selection": {
        "pt": {"type": "single"}
      },
      "mark": "circle",
      "encoding": {
        "x": {
          "bin": {"maxbins": 10},
          "field": "IMDB_Rating",
          "type": "quantitative"
        },
        "y": {
          "aggregate": "count",
          "type": "quantitative"
        }
      }
    });
    model.parse();
    let data = model.assembleData();
    const transforms = data[0].transform;
    assert.equal(transforms[transforms.length-1].type, 'identifier');

    model = parseModel({
      "data": {"values": [1, 2, 3]},
      "mark": "bar",
      "selection": {
        "pt": {"type": "single"}
      },
      "encoding": {
        "column": {"field": "year","type": "ordinal"},
        "x": {"field": "yield","type": "quantitative","aggregate": "sum"},
        "y": {"field": "variety","type": "nominal"},
        "color": {"field": "site","type": "nominal"}
      }
    });

    model.parse();
    data = model.assembleData();
    data.forEach((d) => {
      let idx = -1;
      const aggr = d.transform.some((t, i) => (idx = i, t.type === 'aggregate'));
      const pos = aggr ? idx + 1 : d.transform.length - 1;
      assert.equal(d.transform[pos].type, 'identifier');
    });
  });
});
